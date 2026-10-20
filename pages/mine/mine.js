// pages/mine/mine.js - 我的页（用户信息、订单入口、AI导购配置）
const { getUser, setUser, getAiConfig, setAiConfig } = require('../../utils/storage');

Page({
  data: {
    user: null,
    aiMode: 'mock',
    apiKey: '',
    apiEndpoint: '',
    apiModel: ''
  },

  onShow() {
    const user = getUser();
    const cfg = getApp().globalData;
    this.setData({
      user,
      aiMode: cfg.aiMode,
      apiKey: cfg.apiKey,
      apiEndpoint: cfg.apiEndpoint,
      apiModel: cfg.apiModel
    });
  },

  login() {
    wx.getUserProfile({
      desc: '用于展示个人中心头像昵称',
      success: (res) => {
        const user = {
          nickName: res.userInfo.nickName || '微信用户',
          avatarUrl: res.userInfo.avatarUrl || ''
        };
        setUser(user);
        this.setData({ user });
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '已取消登录', icon: 'none' });
      }
    });
  },

  goOrders(e) {
    const status = e.currentTarget.dataset.status || 'all';
    wx.navigateTo({ url: '/pages/orders/orders' });
  },

  goAssistant() {
    wx.navigateTo({ url: '/pages/assistant/assistant' });
  },

  // ---------- AI 配置 ----------
  onModeChange(e) {
    this.setData({ aiMode: e.detail.value });
  },

  onApiInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  saveAiConfig() {
    const { aiMode, apiKey, apiEndpoint, apiModel } = this.data;
    const cfg = { aiMode, apiKey: apiKey.trim(), apiEndpoint: apiEndpoint.trim(), apiModel: apiModel.trim() };
    setAiConfig(cfg);
    const app = getApp();
    app.globalData.aiMode = cfg.aiMode;
    app.globalData.apiKey = cfg.apiKey;
    app.globalData.apiEndpoint = cfg.apiEndpoint;
    app.globalData.apiModel = cfg.apiModel;
    wx.showToast({ title: '配置已保存', icon: 'success' });
  },

  resetAiConfig() {
    this.setData({ aiMode: 'mock', apiKey: '', apiEndpoint: '', apiModel: '' });
    setAiConfig({ aiMode: 'mock', apiKey: '', apiEndpoint: '', apiModel: '' });
    const app = getApp();
    app.globalData.aiMode = 'mock';
    app.globalData.apiKey = '';
    app.globalData.apiEndpoint = '';
    app.globalData.apiModel = '';
    wx.showToast({ title: '已重置为本地引擎', icon: 'success' });
  }
});
