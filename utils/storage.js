// utils/storage.js - 本地存储封装（购物车、订单、用户信息、AI配置）

const KEYS = {
  CART: 'hg_cart',
  ORDERS: 'hg_orders',
  USER: 'hg_user',
  AI_CONFIG: 'hg_ai_config'
};

// ---------- 购物车 ----------
// 购物车项结构：{ productId, name, price, unit, emoji, color, count, checked }
function getCart() {
  return wx.getStorageSync(KEYS.CART) || [];
}

function setCart(list) {
  wx.setStorageSync(KEYS.CART, list);
}

function saveCart(cart) {
  wx.setStorageSync(KEYS.CART, cart);
  // 同步 tabBar 购物车徽标
  const total = cart.reduce((sum, item) => sum + item.count, 0);
  if (total > 0) {
    wx.setTabBarBadge({ index: 2, text: total > 99 ? '99+' : String(total) });
  } else {
    wx.removeTabBarBadge({ index: 2 });
  }
}

// ---------- 订单 ----------
function getOrders() {
  return wx.getStorageSync(KEYS.ORDERS) || [];
}

function setOrders(list) {
  wx.setStorageSync(KEYS.ORDERS, list);
}

// ---------- 用户 ----------
function getUser() {
  return wx.getStorageSync(KEYS.USER) || null;
}

function setUser(user) {
  wx.setStorageSync(KEYS.USER, user);
}

// ---------- AI 配置 ----------
function getAiConfig() {
  return wx.getStorageSync(KEYS.AI_CONFIG) || null;
}

function setAiConfig(config) {
  wx.setStorageSync(KEYS.AI_CONFIG, config);
}

module.exports = {
  KEYS,
  getCart,
  setCart,
  saveCart,
  getOrders,
  setOrders,
  getUser,
  setUser,
  getAiConfig,
  setAiConfig
};
