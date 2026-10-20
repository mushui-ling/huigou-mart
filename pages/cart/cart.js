// pages/cart/cart.js - 购物车页
const { getCart, saveCart } = require('../../utils/storage');

Page({
  data: {
    cart: [],
    allChecked: false,
    totalPrice: '0.00',
    totalCount: 0
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const cart = getCart();
    let totalPrice = 0;
    let totalCount = 0;
    cart.forEach((item) => {
      if (item.checked) {
        totalPrice += item.price * item.count;
        totalCount += item.count;
      }
    });
    const allChecked = cart.length > 0 && cart.every((item) => item.checked);
    this.setData({
      cart,
      allChecked,
      totalPrice: totalPrice.toFixed(2),
      totalCount
    });
  },

  toggleCheck(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    cart[index].checked = !cart[index].checked;
    saveCart(cart);
    this.refresh();
  },

  toggleAll() {
    const cart = this.data.cart;
    const target = !this.data.allChecked;
    cart.forEach((item) => {
      item.checked = target;
    });
    saveCart(cart);
    this.refresh();
  },

  decrease(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    if (cart[index].count <= 1) return;
    cart[index].count -= 1;
    saveCart(cart);
    this.refresh();
  },

  increase(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    cart[index].count += 1;
    saveCart(cart);
    this.refresh();
  },

  removeItem(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cart[index];
    wx.showModal({
      title: '移除商品',
      content: '确定将「' + item.name + '」移出购物车吗？',
      confirmColor: '#FF6A3D',
      success: (res) => {
        if (res.confirm) {
          const cart = this.data.cart;
          cart.splice(index, 1);
          saveCart(cart);
          this.refresh();
        }
      }
    });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },

  checkout() {
    if (this.data.totalCount === 0) {
      wx.showToast({ title: '请先勾选要结算的商品', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/order/order?from=cart' });
  },

  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
