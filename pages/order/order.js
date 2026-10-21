// pages/order/order.js - 结算下单页（收货地址 + 订单确认 + 模拟支付）
const { getProductById } = require('../../utils/mock-data');
const { getCart, saveCart, getOrders, setOrders, getUser, setUser } = require('../../utils/storage');

Page({
  data: {
    items: [],
    totalPrice: '0.00',
    totalCount: 0,
    address: { name: '', phone: '', detail: '' },
    fromCart: false,
    paying: false
  },

  onLoad(options) {
    let items = [];
    let fromCart = false;

    if (options.from === 'cart') {
      fromCart = true;
      items = getCart().filter((item) => item.checked);
    } else if (options.buyNow && options.id) {
      const p = getProductById(options.id);
      const count = Number(options.count) || 1;
      items = [{
        productId: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        emoji: p.emoji,
        color: p.color,
        count
      }];
    }

    if (items.length === 0) {
      wx.showToast({ title: '没有可结算的商品', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    const totalPrice = items.reduce((sum, it) => sum + it.price * it.count, 0);
    const totalCount = items.reduce((sum, it) => sum + it.count, 0);
    const user = getUser();
    const address = (user && user.address) || { name: '', phone: '', detail: '' };

    this.setData({ items, fromCart, totalPrice: totalPrice.toFixed(2), totalCount, address });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ ['address.' + field]: e.detail.value });
  },

  submitOrder() {
    const { name, phone, detail } = this.data.address;
    if (!name.trim()) {
      wx.showToast({ title: '请填写收货人姓名', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      wx.showToast({ title: '请填写正确的手机号', icon: 'none' });
      return;
    }
    if (!detail.trim()) {
      wx.showToast({ title: '请填写收货地址', icon: 'none' });
      return;
    }
    if (this.data.paying) return;

    // 结算前库存二次校验：防止多端操作或数据过期导致超卖
    for (let i = 0; i < this.data.items.length; i++) {
      const it = this.data.items[i];
      const p = getProductById(it.productId);
      if (!p || it.count > p.stock) {
        wx.showToast({ title: '「' + it.name + '」库存不足，请调整数量', icon: 'none' });
        return;
      }
    }

    this.setData({ paying: true });

    // 生成订单
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeText = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
      ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    const order = {
      id: now.getTime(),
      no: 'HG' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + String(now.getTime()).slice(-6),
      items: this.data.items,
      total: Number(this.data.totalPrice),
      status: '待付款',
      createTime: timeText,
      address: { name: name.trim(), phone: phone.trim(), detail: detail.trim() }
    };

    const orders = getOrders();
    orders.unshift(order);
    setOrders(orders);

    // 保存收货地址到用户信息
    const user = getUser() || {};
    user.address = order.address;
    setUser(user);

    // 从购物车移除已结算商品
    if (this.data.fromCart) {
      const cart = getCart().filter((item) => !item.checked);
      saveCart(cart);
    }

    // 模拟支付
    wx.showModal({
      title: '模拟支付',
      content: '订单金额 ¥' + this.data.totalPrice + '，确认支付？',
      confirmText: '确认支付',
      cancelText: '暂不支付',
      confirmColor: '#FF6A3D',
      success: (res) => {
        if (res.confirm) {
          order.status = '待收货';
          const list = getOrders();
          const idx = list.findIndex((o) => o.id === order.id);
          if (idx !== -1) list[idx] = order;
          setOrders(list);
          wx.showToast({ title: '支付成功', icon: 'success' });
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/orders/orders' });
          }, 800);
        } else {
          this.setData({ paying: false });
          wx.showToast({ title: '订单已生成，可在订单页继续付款', icon: 'none' });
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/orders/orders' });
          }, 800);
        }
      }
    });
  }
});
