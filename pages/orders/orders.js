// pages/orders/orders.js - 订单列表页
const { getOrders, setOrders } = require('../../utils/storage');

const TABS = [
  { key: 'all', label: '全部' },
  { key: '待付款', label: '待付款' },
  { key: '待收货', label: '待收货' },
  { key: '已完成', label: '已完成' }
];

Page({
  data: {
    tabs: TABS,
    activeTab: 'all',
    orderList: []
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const all = getOrders();
    const activeTab = this.data.activeTab;
    const orderList = activeTab === 'all' ? all : all.filter((o) => o.status === activeTab);
    this.setData({ orderList });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.key });
    this.refresh();
  },

  payOrder(e) {
    const id = e.currentTarget.dataset.id;
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    wx.showModal({
      title: '模拟支付',
      content: '订单金额 ¥' + order.total + '，确认支付？',
      confirmColor: '#FF6A3D',
      success: (res) => {
        if (res.confirm) {
          order.status = '待收货';
          setOrders(orders);
          wx.showToast({ title: '支付成功', icon: 'success' });
          this.refresh();
        }
      }
    });
  },

  confirmReceive(e) {
    const id = e.currentTarget.dataset.id;
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    wx.showModal({
      title: '确认收货',
      content: '确认已收到该订单的商品？',
      confirmColor: '#FF6A3D',
      success: (res) => {
        if (res.confirm) {
          order.status = '已完成';
          setOrders(orders);
          wx.showToast({ title: '已确认收货', icon: 'success' });
          this.refresh();
        }
      }
    });
  }
});
