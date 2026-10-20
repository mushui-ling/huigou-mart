// pages/index/index.js - 首页：搜索、轮播、分类导航、热卖/新品
const { banners, categories, recommends, products, getProductById, searchProducts } = require('../../utils/mock-data');

Page({
  data: {
    banners,
    categories,
    hotList: [],
    newList: [],
    keyword: '',
    showSearchResult: false,
    searchResult: []
  },

  onLoad() {
    const hotList = recommends.hot.map(getProductById).filter(Boolean);
    const newList = recommends.new.map(getProductById).filter(Boolean);
    this.setData({ hotList, newList });
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearchConfirm() {
    const kw = this.data.keyword.trim();
    if (!kw) {
      this.setData({ showSearchResult: false, searchResult: [] });
      wx.showToast({ title: '请输入商品名称', icon: 'none' });
      return;
    }
    const result = searchProducts(kw);
    this.setData({ showSearchResult: true, searchResult: result });
  },

  clearSearch() {
    this.setData({ keyword: '', showSearchResult: false, searchResult: [] });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  goCategory(e) {
    const id = e.currentTarget.dataset.id;
    wx.switchTab({ url: '/pages/category/category' });
    // 通过全局事件传递分类
    getApp().globalData.pendingCategoryId = id;
  },

  goAssistant() {
    wx.navigateTo({ url: '/pages/assistant/assistant' });
  }
});
