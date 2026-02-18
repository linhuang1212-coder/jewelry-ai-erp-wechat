const app = getApp();

Page({
  data: {
    userInfo: null,
    stats: {
      totalProducts: 0,
      todayOrders: 0,
      goldPrice: '—',
      pendingTasks: 0,
    },
    quickActions: [
      { icon: '💬', title: 'AI对话', desc: '智能助手', page: '/pages/chat/chat' },
      { icon: '📦', title: '库存查询', desc: '实时库存', page: '/pages/inventory/inventory' },
      { icon: '📊', title: '今日报表', desc: '经营数据', page: '' },
      { icon: '🔔', title: '待办事项', desc: '任务提醒', page: '' },
    ],
  },

  onLoad() {
    this.loadDashboard();
  },

  onShow() {
    this.setData({ userInfo: app.globalData.userInfo });
  },

  onPullDownRefresh() {
    this.loadDashboard().then(() => wx.stopPullDownRefresh());
  },

  async loadDashboard() {
    try {
      const res = await app.request({ url: '/dashboard/stats' });
      if (res.statusCode === 200) {
        this.setData({ stats: res.data });
      }
    } catch (e) {
      console.log('Dashboard load failed, using defaults');
    }
  },

  onActionTap(e) {
    const page = e.currentTarget.dataset.page;
    if (page) {
      wx.switchTab({ url: page });
    } else {
      wx.showToast({ title: '即将开放', icon: 'none' });
    }
  },
});
