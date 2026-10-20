// pages/detail/detail.js - 商品详情页
const { getProductById, getCategoryName } = require('../../utils/mock-data');
const { getCart, saveCart } = require('../../utils/storage');

Page({
  data: {
    product: null,
    count: 1,
    inCartCount: 0
  },

  onLoad(options) {
    const product = getProductById(options.id);
    if (!product) {
      wx.showToast({ title: '商品不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    product.categoryName = getCategoryName(product.categoryId);
    this.setData({ product });
  },

  onShow() {
    this.refreshInCart();
  },

  refreshInCart() {
    const cart = getCart();
    const found = cart.find((item) => item.productId === this.data.product.id);
    this.setData({ inCartCount: found ? found.count : 0 });
  },

  decrease() {
    if (this.data.count <= 1) return;
    this.setData({ count: this.data.count - 1 });
  },

  increase() {
    if (this.data.count >= this.data.product.stock) {
      wx.showToast({ title: '库存不足', icon: 'none' });
      return;
    }
    this.setData({ count: this.data.count + 1 });
  },

  addToCart() {
    const p = this.data.product;
    const cart = getCart();
    const found = cart.find((item) => item.productId === p.id);
    if (found) {
      found.count = Math.min(found.count + this.data.count, p.stock);
      found.checked = true;
    } else {
      cart.push({
        productId: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        emoji: p.emoji,
        color: p.color,
        count: this.data.count,
        checked: true
      });
    }
    saveCart(cart);
    this.refreshInCart();
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  buyNow() {
    const p = this.data.product;
    // 立即购买：携带商品参数进入结算页
    wx.navigateTo({
      url: '/pages/order/order?buyNow=1&id=' + p.id + '&count=' + this.data.count
    });
  },

  goCart() {
    wx.switchTab({ url: '/pages/cart/cart' });
  }
});
