// app.js - 惠购百货小程序入口
App({
  globalData: {
    // AI 导购模式：mock=本地智能推荐引擎（开箱即用）；api=调用真实大模型 API
    aiMode: 'mock',
    // 真实 API 配置（OpenAI 兼容接口，如火山方舟/通义千问/DeepSeek 等）
    apiKey: '',
    apiEndpoint: '',
    apiModel: ''
  },

  onLaunch() {
    // 恢复本地保存的 AI 配置
    const saved = wx.getStorageSync('hg_ai_config');
    if (saved && saved.aiMode) {
      this.globalData.aiMode = saved.aiMode;
      this.globalData.apiKey = saved.apiKey || '';
      this.globalData.apiEndpoint = saved.apiEndpoint || '';
      this.globalData.apiModel = saved.apiModel || '';
    }
  }
});
