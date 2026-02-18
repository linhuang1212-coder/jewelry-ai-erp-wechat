const app = getApp();

const API = {
  getProducts(params = {}) {
    return app.request({ url: '/products', data: params });
  },

  getProduct(id) {
    return app.request({ url: `/products/${id}` });
  },

  sendChat(message, conversationId) {
    return app.request({
      url: '/chat/stream',
      method: 'POST',
      data: { message, conversation_id: conversationId },
    });
  },

  getDashboardStats() {
    return app.request({ url: '/dashboard/stats' });
  },

  getGoldPrice() {
    return app.request({ url: '/gold-price' });
  },

  login(credentials) {
    return app.request({
      url: '/auth/login',
      method: 'POST',
      data: credentials,
    });
  },
};

module.exports = API;
