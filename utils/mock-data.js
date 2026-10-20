// utils/mock-data.js - 百货超市商品数据（本地模拟数据源，保证项目可离线运行）

// 商品分类
const categories = [
  { id: 1, name: '粮油副食', icon: '🍚' },
  { id: 2, name: '休闲零食', icon: '🍿' },
  { id: 3, name: '饮料乳品', icon: '🥛' },
  { id: 4, name: '生鲜果蔬', icon: '🍎' },
  { id: 5, name: '日用百货', icon: '🧻' },
  { id: 6, name: '洗护美妆', icon: '🧴' },
  { id: 7, name: '家居清洁', icon: '🧹' },
  { id: 8, name: '冷冻速食', icon: '🥟' }
];

// 商品列表
const products = [
  // 粮油副食
  { id: 1, name: '五常大米 5kg', categoryId: 1, price: 59.9, originalPrice: 69.9, unit: '袋', sales: 3200, stock: 120, emoji: '🍚', color: '#F5C26B', desc: '东北当季新米，颗粒饱满，煮饭软糯香甜', tags: ['热卖', '特惠'] },
  { id: 2, name: '一级大豆油 5L', categoryId: 1, price: 49.9, originalPrice: 59.9, unit: '桶', sales: 2800, stock: 80, emoji: '🫗', color: '#E8B84B', desc: '非转基因大豆，物理压榨，家庭烹饪好油', tags: ['特惠'] },
  { id: 3, name: '特级生抽 500ml', categoryId: 1, price: 12.9, originalPrice: 15.9, unit: '瓶', sales: 4100, stock: 200, emoji: '🍶', color: '#C98A5B', desc: '古法酿造，鲜味浓郁，凉拌红烧皆宜', tags: ['热卖'] },
  { id: 4, name: '白砂糖 1kg', categoryId: 1, price: 8.9, originalPrice: 9.9, unit: '袋', sales: 1500, stock: 300, emoji: '🍬', color: '#F0E6DA', desc: '精制细砂糖，烘焙冲饮两相宜', tags: [] },
  // 休闲零食
  { id: 5, name: '原味薯片 135g', categoryId: 2, price: 9.9, originalPrice: 12.9, unit: '袋', sales: 5200, stock: 260, emoji: '🍟', color: '#F2C879', desc: '精选土豆，香脆可口，追剧必备', tags: ['热卖'] },
  { id: 6, name: '夹心饼干 250g', categoryId: 2, price: 12.5, originalPrice: 15.5, unit: '盒', sales: 1800, stock: 150, emoji: '🍪', color: '#D9A06B', desc: '奶香浓郁，酥脆夹心，下午茶点心', tags: [] },
  { id: 7, name: '每日坚果 30包', categoryId: 2, price: 49.9, originalPrice: 69.9, unit: '箱', sales: 3600, stock: 90, emoji: '🥜', color: '#C9A063', desc: '6种坚果科学配比，独立小包锁鲜', tags: ['新品', '特惠'] },
  { id: 8, name: '巧克力威化 200g', categoryId: 2, price: 15.9, originalPrice: 18.9, unit: '盒', sales: 2100, stock: 130, emoji: '🍫', color: '#8D6E63', desc: '浓郁可可涂层，入口即化', tags: [] },
  // 饮料乳品
  { id: 9, name: '纯牛奶 250ml×12', categoryId: 3, price: 45.0, originalPrice: 52.0, unit: '箱', sales: 6800, stock: 180, emoji: '🥛', color: '#9CC9E8', desc: '生牛乳灭菌，3.6g优质乳蛋白', tags: ['热卖'] },
  { id: 10, name: '可乐 330ml×6', categoryId: 3, price: 14.9, originalPrice: 16.9, unit: '提', sales: 4300, stock: 220, emoji: '🥤', color: '#C0392B', desc: '冰爽解渴，汽水经典', tags: ['热卖'] },
  { id: 11, name: '矿泉水 550ml×24', categoryId: 3, price: 19.9, originalPrice: 24.9, unit: '箱', sales: 3900, stock: 200, emoji: '💧', color: '#7EC8E3', desc: '天然弱碱水，家中常备', tags: ['特惠'] },
  { id: 12, name: '橙汁 1L', categoryId: 3, price: 8.9, originalPrice: 10.9, unit: '瓶', sales: 2600, stock: 160, emoji: '🍊', color: '#F5A623', desc: 'NFC非浓缩还原，鲜榨口感', tags: [] },
  // 生鲜果蔬
  { id: 13, name: '红富士苹果 1kg', categoryId: 4, price: 12.9, originalPrice: 14.9, unit: '份', sales: 4500, stock: 100, emoji: '🍎', color: '#E05B4C', desc: '脆甜多汁，产地直采', tags: ['热卖'] },
  { id: 14, name: '海南香蕉 1kg', categoryId: 4, price: 6.9, originalPrice: 8.9, unit: '份', sales: 5100, stock: 140, emoji: '🍌', color: '#F2CE4B', desc: '自然熟成，香甜软糯', tags: ['特惠'] },
  { id: 15, name: '鲜鸡蛋 30枚', categoryId: 4, price: 22.9, originalPrice: 25.9, unit: '板', sales: 6200, stock: 110, emoji: '🥚', color: '#EAD9C4', desc: '谷物喂养，蛋香浓郁', tags: ['热卖'] },
  { id: 16, name: '有机西兰花 500g', categoryId: 4, price: 9.9, originalPrice: 12.9, unit: '份', sales: 1400, stock: 90, emoji: '🥦', color: '#7BA05B', desc: '有机种植，营养丰富', tags: ['新品'] },
  // 日用百货
  { id: 17, name: '抽纸 100抽×10包', categoryId: 5, price: 19.9, originalPrice: 24.9, unit: '提', sales: 5800, stock: 240, emoji: '🧻', color: '#B5C9E0', desc: '3层加厚，柔韧不易破', tags: ['热卖', '特惠'] },
  { id: 18, name: '洗衣液 2kg', categoryId: 5, price: 26.9, originalPrice: 32.9, unit: '瓶', sales: 3300, stock: 150, emoji: '🧺', color: '#7FB3D8', desc: '深层去渍，持久留香', tags: ['特惠'] },
  { id: 19, name: '牙膏 120g×2支', categoryId: 5, price: 16.9, originalPrice: 19.9, unit: '组', sales: 2700, stock: 180, emoji: '🪥', color: '#8FD3C4', desc: '清新口气，防蛀护龈', tags: [] },
  { id: 20, name: '垃圾袋 100只', categoryId: 5, price: 9.9, originalPrice: 12.9, unit: '卷', sales: 2200, stock: 300, emoji: '🗑️', color: '#9E9E9E', desc: '加厚背心式，防漏耐穿', tags: [] },
  // 洗护美妆
  { id: 21, name: '洗发水 750ml', categoryId: 6, price: 39.9, originalPrice: 49.9, unit: '瓶', sales: 4100, stock: 120, emoji: '🧴', color: '#F5A6B8', desc: '控油去屑，柔顺秀发', tags: ['热卖'] },
  { id: 22, name: '沐浴露 650ml', categoryId: 6, price: 29.9, originalPrice: 36.9, unit: '瓶', sales: 2500, stock: 130, emoji: '🫧', color: '#9FD8EF', desc: '温和清洁，留香持久', tags: [] },
  // 家居清洁
  { id: 23, name: '洗洁精 1.5kg', categoryId: 7, price: 13.9, originalPrice: 16.9, unit: '瓶', sales: 2900, stock: 170, emoji: '🍽️', color: '#6FCF97', desc: '快速去油，不伤手', tags: [] },
  { id: 24, name: '免手洗拖把', categoryId: 7, price: 49.9, originalPrice: 69.9, unit: '把', sales: 1600, stock: 60, emoji: '🧹', color: '#C49BDB', desc: '一推一拉自动清洁，省时省力', tags: ['新品'] },
  // 冷冻速食
  { id: 25, name: '速冻水饺 1kg', categoryId: 8, price: 19.9, originalPrice: 23.9, unit: '袋', sales: 3700, stock: 140, emoji: '🥟', color: '#E8C9A0', desc: '皮薄馅大，多种口味', tags: ['热卖'] },
  { id: 26, name: '黑芝麻汤圆 500g', categoryId: 8, price: 12.9, originalPrice: 14.9, unit: '袋', sales: 1900, stock: 100, emoji: '🍡', color: '#8D6E63', desc: '软糯流心，早餐夜宵皆宜', tags: [] }
];

// 轮播 banner（促销活动）
const banners = [
  { id: 1, title: '周末大促', subtitle: '全场满99减20', color: '#FF6A3D' },
  { id: 2, title: '生鲜直采', subtitle: '新鲜到家 每日特价', color: '#34C759' },
  { id: 3, title: '会员专享', subtitle: 'AI导购 帮你选好物', color: '#5B7FFF' }
];

// 首页推荐位
const recommends = {
  hot: [1, 9, 13, 17, 5, 15, 21, 25], // 热卖榜
  new: [7, 16, 24] // 新品
};

function getCategoryName(id) {
  const c = categories.find((item) => item.id === id);
  return c ? c.name : '其他';
}

function getProductById(id) {
  return products.find((item) => item.id === Number(id));
}

function getProductsByCategory(categoryId) {
  return products.filter((item) => item.categoryId === Number(categoryId));
}

function searchProducts(keyword) {
  const kw = String(keyword || '').trim().toLowerCase();
  if (!kw) return [];
  return products.filter(
    (item) =>
      item.name.toLowerCase().includes(kw) ||
      getCategoryName(item.categoryId).includes(kw)
  );
}

module.exports = {
  categories,
  products,
  banners,
  recommends,
  getCategoryName,
  getProductById,
  getProductsByCategory,
  searchProducts
};
