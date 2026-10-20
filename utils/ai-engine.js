// utils/ai-engine.js - AI 导购助手引擎
// 双模式：
//   1. mock 模式：本地智能推荐引擎（意图解析 + 商品检索 + 推荐理由生成），开箱即用，无需网络；
//   2. api 模式：调用真实大模型（OpenAI 兼容接口），使用提示词工程驱动，返回 JSON 结构化推荐。
// 任一模式失败时自动回退到 mock 模式，保证功能始终可用。

const { products, categories, getCategoryName } = require('./mock-data');

/* ==================== 意图解析 ==================== */

// 场景关键词表：场景 -> { categories: [...], keywords: [...] }
const SCENES = [
  { key: '招待客人', match: ['招待', '客人', '聚会', '请客', '朋友来', '聚餐'], categories: [2, 3, 4], keywords: ['坚果', '饮料', '水果', '零食', '可乐'] },
  { key: '早餐', match: ['早餐', '早饭', '早上'], categories: [3, 8], keywords: ['牛奶', '水饺', '汤圆', '鸡蛋'] },
  { key: '熬夜加班', match: ['熬夜', '加班', '夜宵', '办公室', '上班'], categories: [2, 3], keywords: ['零食', '咖啡', '饮料', '水饺'] },
  { key: '野餐出游', match: ['野餐', '出游', '春游', '露营', '郊游'], categories: [2, 3, 4], keywords: ['薯片', '矿泉水', '水果', '饼干'] },
  { key: '送礼探望', match: ['送礼', '探望', '看望', '送人', '长辈', '走亲戚'], categories: [1, 2], keywords: ['坚果', '大米', '油', '牛奶'] },
  { key: '健康低卡', match: ['减肥', '健康', '低卡', '健身', '减脂', '养生'], categories: [3, 4], keywords: ['苹果', '西兰花', '矿泉水', '鸡蛋', '坚果'] },
  { key: '儿童', match: ['儿童', '孩子', '小孩', '宝宝', '学生'], categories: [3, 2], keywords: ['牛奶', '零食', '饼干'] },
  { key: '囤货居家', match: ['囤货', '居家', '日用', '生活用品', '家里缺'], categories: [5, 7, 1], keywords: ['纸巾', '洗衣液', '垃圾袋', '洗洁精'] }
];

// 品类关键词：词 -> 分类id
const CATEGORY_KEYWORDS = {
  '米': 1, '大米': 1, '油': 1, '酱油': 1, '生抽': 1, '糖': 1, '调味': 1, '粮油': 1,
  '零食': 2, '薯片': 2, '饼干': 2, '坚果': 2, '巧克力': 2, '威化': 2,
  '饮料': 3, '牛奶': 3, '可乐': 3, '水': 3, '矿泉水': 3, '果汁': 3, '乳品': 3,
  '水果': 4, '苹果': 4, '香蕉': 4, '蔬菜': 4, '鸡蛋': 4, '生鲜': 4, '西兰花': 4,
  '纸': 5, '纸巾': 5, '抽纸': 5, '洗衣': 5, '洗衣液': 5, '牙膏': 5, '垃圾袋': 5, '日用': 5,
  '洗发': 6, '沐浴': 6, '洗护': 6,
  '清洁': 7, '洗洁精': 7, '拖把': 7,
  '水饺': 8, '汤圆': 8, '速冻': 8
};

// 长词优先的关键词匹配：命中"水果"后不再匹配其子串"水"，避免误判
function matchCategoryKeywords(text) {
  const matched = [];
  const keys = Object.keys(CATEGORY_KEYWORDS).sort((a, b) => b.length - a.length);
  keys.forEach((kw) => {
    if (!text.includes(kw)) return;
    // 已被更长的已命中关键词覆盖时跳过
    const covered = matched.some((m) => m !== kw && m.includes(kw));
    if (covered) return;
    matched.push(kw);
  });
  return matched;
}

// 解析用户问题，返回结构化意图
function analyzeIntent(text) {
  const q = String(text || '').trim();
  const intent = { budget: null, scenes: [], categories: [], raw: q };

  if (!q) return intent;

  // 预算：如 "预算50元""30块以内""便宜""实惠""性价比"
  const budgetMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:元|块钱|块)/);
  if (budgetMatch) {
    intent.budget = parseFloat(budgetMatch[1]);
  }
  if (/便宜|实惠|性价比|特价|优惠/.test(q) && !intent.budget) {
    intent.budget = 20; // 倾向低价
  }

  // 场景识别
  SCENES.forEach((scene) => {
    const hit = scene.match.some((w) => q.includes(w));
    if (hit) {
      intent.scenes.push(scene.key);
      scene.categories.forEach((c) => {
        if (intent.categories.indexOf(c) === -1) intent.categories.push(c);
      });
    }
  });

  // 品类关键词识别（长词优先）
  matchCategoryKeywords(q).forEach((kw) => {
    const cid = CATEGORY_KEYWORDS[kw];
    if (intent.categories.indexOf(cid) === -1) intent.categories.push(cid);
  });

  // 泛化请求（推荐/买什么/有什么）
  if (/推荐|买什么|有什么好|介绍|帮我选|怎么选/.test(q)) {
    intent.general = true;
  }

  return intent;
}

/* ==================== 商品匹配与排序 ==================== */

function scoreProducts(intent) {
  const scored = products.map((p) => {
    let score = 0;
    let reasons = [];
    let matched = false;

    // 品类匹配（真实相关性的必要条件）
    if (intent.categories.indexOf(p.categoryId) !== -1) {
      score += 6;
      matched = true;
      reasons.push('符合' + getCategoryName(p.categoryId) + '需求');
    }

    // 关键词匹配（名称/描述，长词优先）
    const text = p.name + ' ' + p.desc + ' ' + p.emoji;
    matchCategoryKeywords(intent.raw).forEach((kw) => {
      if (text.includes(kw)) {
        score += 4;
        matched = true;
        reasons.push('含' + kw);
      }
    });

    // 无真实匹配的商品不参与推荐（避免无关热卖品混入）
    if (!matched) return { product: p, score: 0, reasons: [] };

    // 销量仅作排序微调
    if (p.sales > 4000) {
      score += 0.5;
      reasons.push('门店热卖');
    }

    // 预算过滤
    if (intent.budget) {
      if (p.price > intent.budget) {
        score -= 10;
        reasons.push('超预算');
      } else if (p.price <= intent.budget * 0.6) {
        score += 2;
        reasons.push('价格实惠');
      }
    }

    return { product: p, score, reasons };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

// 泛化推荐（无品类/场景/预算信息）：按销量返回门店热卖 TOP
function hotProducts(limit) {
  return products.slice().sort((a, b) => b.sales - a.sales).slice(0, limit || 5);
}

/* ==================== mock 模式：本地智能推荐引擎 ==================== */

function mockAsk(question) {
  const intent = analyzeIntent(question);

  // 问候/空问题
  if (!intent.raw || /^(你好|您好|hi|hello|在吗)/i.test(intent.raw)) {
    return {
      mode: 'mock',
      reply: '您好，我是惠购百货的AI导购"小惠"～我可以根据您的预算、场景帮您挑选合适的商品。例如试试问我："50元以内的零食推荐"或"招待客人的饮料买什么好"。',
      products: [],
      quick: true
    };
  }

  // 泛化推荐：无品类/场景/预算信息时按门店热卖返回
  const noSignal = intent.categories.length === 0 && intent.scenes.length === 0 && !intent.budget;
  let matched;
  if (noSignal && intent.general) {
    matched = hotProducts(5).map((p) => ({ product: p, score: 0, reasons: ['门店热卖'] }));
  } else {
    matched = scoreProducts(intent).slice(0, 5);
  }

  if (matched.length === 0) {
    return {
      mode: 'mock',
      reply: '抱歉，我暂时没找到完全匹配的商品。您可以换个说法，比如告诉我"想买什么品类""预算多少元"或者"用于什么场景（早餐/野餐/招待客人）"。',
      products: [],
      quick: false
    };
  }

  // 组织回复
  const sceneText = intent.scenes.length
    ? '根据您提到的"' + intent.scenes.join('、') + '"场景'
    : '根据您的需求';
  const budgetText = intent.budget
    ? '，并控制在' + intent.budget + '元预算内'
    : '';

  let reply = sceneText + budgetText + '，我为您精选了以下商品：\n';
  matched.forEach((item, index) => {
    const p = item.product;
    const tag = item.reasons.indexOf('门店热卖') !== -1 ? '（门店热卖）' : '';
    reply += (index + 1) + '. ' + p.name + ' ' + p.price + '元' + tag + '：' + p.desc.split('，')[0] + '。\n';
  });
  reply += '您可以直接点开商品详情查看，或加入购物车一起结算～';

  return {
    mode: 'mock',
    reply,
    products: matched.map((item) => item.product),
    quick: false
  };
}

/* ==================== api 模式：真实大模型调用 ==================== */

// 提示词工程：系统提示词（约束角色、任务、输出格式、防幻觉）
function buildApiPrompt(question) {
  const catalog = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: getCategoryName(p.categoryId),
    desc: p.desc,
    tags: p.tags
  }));

  const systemPrompt =
    '你是一名百货超市的AI导购助手"小惠"，服务于微信小程序"惠购百货"。' +
    '请根据用户的提问与给定的商品目录，为用户推荐合适的商品。' +
    '要求：' +
    '1. 回复口语化、亲切、简洁，控制在200字以内；' +
    '2. 只能推荐商品目录中真实存在的商品，严禁虚构商品名、价格；' +
    '3. 严格输出JSON格式：{"reply": "导购回复文本", "productIds": [匹配的商品id数组，最多5个]}，不要输出JSON以外的任何内容；' +
    '4. 若用户问题与购物无关，则礼貌引导用户回到购物话题。' +
    '商品目录：' + JSON.stringify(catalog);

  return {
    systemPrompt,
    userPrompt: '用户问题：' + question
  };
}

function apiAsk(question, config) {
  return new Promise((resolve) => {
    const { systemPrompt, userPrompt } = buildApiPrompt(question);
    const endpoint = config.apiEndpoint || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

    wx.request({
      url: endpoint,
      method: 'POST',
      timeout: 15000,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (config.apiKey || '')
      },
      data: {
        model: config.apiModel || 'ep-xxxxxxxx',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      },
      success(res) {
        try {
          const content = res.data && res.data.choices && res.data.choices[0]
            ? res.data.choices[0].message.content
            : '';
          const jsonStr = content.replace(/```json|```/g, '').trim();
          const start = jsonStr.indexOf('{');
          const end = jsonStr.lastIndexOf('}');
          if (start === -1 || end === -1) throw new Error('invalid json');
          const parsed = JSON.parse(jsonStr.slice(start, end + 1));
          const ids = (parsed.productIds || []).map(Number).filter(Boolean);
          const matched = ids
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean)
            .slice(0, 5);
          resolve({
            mode: 'api',
            reply: String(parsed.reply || ''),
            products: matched,
            quick: false
          });
        } catch (e) {
          // 解析失败：回退到本地引擎
          const fallback = mockAsk(question);
          fallback.fallback = true;
          resolve(fallback);
        }
      },
      fail() {
        // 网络失败：回退到本地引擎
        const fallback = mockAsk(question);
        fallback.fallback = true;
        resolve(fallback);
      }
    });
  });
}

/* ==================== 统一入口 ==================== */

function ask(question, config) {
  const cfg = config || { aiMode: 'mock', apiKey: '', apiEndpoint: '', apiModel: '' };
  if (cfg.aiMode === 'api' && cfg.apiKey) {
    return apiAsk(question, cfg);
  }
  return Promise.resolve(mockAsk(question));
}

// 快捷引导问题（供UI展示）
const QUICK_QUESTIONS = [
  '50元以内有什么零食推荐？',
  '招待客人的饮料买什么好？',
  '家里要囤货，推荐一些日用品',
  '早餐吃什么比较方便？',
  '有没有适合孩子的健康零食？',
  '给我推荐一下热卖的牛奶'
];

module.exports = {
  analyzeIntent,
  mockAsk,
  apiAsk,
  buildApiPrompt,
  ask,
  QUICK_QUESTIONS
};
