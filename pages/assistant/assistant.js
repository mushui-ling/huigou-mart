// pages/assistant/assistant.js - AI 导购助手对话页
const aiEngine = require('../../utils/ai-engine');

Page({
  data: {
    messages: [],
    inputValue: '',
    quickQuestions: aiEngine.QUICK_QUESTIONS,
    thinking: false,
    aiMode: 'mock',
    scrollInto: ''
  },

  onLoad() {
    const cfg = getApp().globalData;
    this.setData({ aiMode: cfg.aiMode });
    this.pushMessage({
      role: 'assistant',
      content: '你好，我是惠购百货的AI导购"小惠"🤖\n告诉我你的需求（品类、预算或使用场景），我帮你挑选合适的商品～',
      products: []
    });
  },

  pushMessage(msg) {
    const messages = this.data.messages.concat([msg]);
    this.setData({ messages, scrollInto: 'msg-' + (messages.length - 1) });
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onQuickTap(e) {
    this.send(e.currentTarget.dataset.text);
  },

  onSend() {
    const text = this.data.inputValue.trim();
    if (!text || this.data.thinking) return;
    this.setData({ inputValue: '' });
    this.send(text);
  },

  send(text) {
    this.pushMessage({ role: 'user', content: text, products: [] });
    this.setData({ thinking: true });

    const cfg = getApp().globalData;
    aiEngine.ask(text, {
      aiMode: cfg.aiMode,
      apiKey: cfg.apiKey,
      apiEndpoint: cfg.apiEndpoint,
      apiModel: cfg.apiModel
    }).then((res) => {
      const modeTip = res.mode === 'api'
        ? (res.fallback ? '（真实模型调用失败，已切换本地引擎）' : '（大模型回答）')
        : '（本地智能引擎）';
      this.pushMessage({
        role: 'assistant',
        content: res.reply + modeTip,
        products: res.products || []
      });
      this.setData({ thinking: false });
    });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },

  addToCart(e) {
    const product = this.data.messages[e.currentTarget.dataset.mid].products[e.currentTarget.dataset.pid];
    const storage = require('../../utils/storage');
    const cart = storage.getCart();
    const found = cart.find((item) => item.productId === product.id);
    if (found) {
      found.count += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        emoji: product.emoji,
        color: product.color,
        count: 1,
        checked: true
      });
    }
    storage.saveCart(cart);
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  }
});
