const app = getApp();

const API = {
  getInventory(params = {}) {
    return app.request({ url: '/warehouse/inventory', data: params });
  },

  getInventorySummary(params = {}) {
    return app.request({ url: '/warehouse/inventory/summary', data: params });
  },

  sendChat(message, userRole = 'manager', sessionId) {
    return app.request({
      url: '/chat',
      method: 'POST',
      data: { message, user_role: userRole, session_id: sessionId },
    });
  },

  getDashboardSummary() {
    return app.request({ url: '/analytics/dashboard/summary' });
  },

  getSalesTrends(params = {}) {
    return app.request({ url: '/analytics/sales/trends', data: params });
  },

  getCustomers(params = {}) {
    return app.request({ url: '/customers', data: params });
  },

  getSalesOrders(params = {}) {
    return app.request({ url: '/sales/orders', data: params });
  },
};

module.exports = API;
