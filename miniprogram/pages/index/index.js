const app = getApp();

Page({
  data: {
    userInfo: null,
    stats: {
      todaySales: '0.00',
      todayOrders: 0,
      avgGoldPrice: '—',
      pendingTasks: 0,
      todayWeight: '0.00',
      monthSales: '0.00',
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
      const res = await app.request({ url: '/analytics/dashboard/summary' });
      if (res.statusCode === 200 && res.data.success) {
        const d = res.data.data;
        this.setData({
          stats: {
            todaySales: (d.today.sales_amount || 0).toFixed(2),
            todayOrders: d.today.order_count || 0,
            avgGoldPrice: d.today.avg_gold_price ? d.today.avg_gold_price.toFixed(2) : '—',
            pendingTasks: d.pending.settlements || 0,
            todayWeight: (d.today.sales_weight || 0).toFixed(2),
            monthSales: (d.month.sales_amount || 0).toFixed(2),
          },
        });
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
