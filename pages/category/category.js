// pages/category/category.js - 分类页（左侧分类导航 + 右侧商品列表）
const { categories, getProductsByCategory } = require('../../utils/mock-data');

Page({
  data: {
    categories,
    activeId: 1,
    productList: []
  },

  onLoad() {
    this.setData({ productList: getProductsByCategory(1) });
  },

  onShow() {
    // 接收首页跳转传入的分类
    const pendingId = getApp().globalData.pendingCategoryId;
    if (pendingId) {
      getApp().globalData.pendingCategoryId = null;
      this.switchCategory(pendingId);
    }
  },

  onSelectCategory(e) {
    const id = Number(e.currentTarget.dataset.id);
    this.switchCategory(id);
  },

  switchCategory(id) {
    this.setData({
      activeId: id,
      productList: getProductsByCategory(id)
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  }
});
