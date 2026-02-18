const app = getApp();

Page({
  data: {
    userRole: 'manager',
    roles: [
      { value: 'manager', label: '管理员' },
      { value: 'sales', label: '业务员' },
      { value: 'finance', label: '财务' },
      { value: 'product', label: '仓管' },
    ],
    menuItems: [
      { icon: '📊', title: '经营报表', desc: '查看销售与库存分析' },
      { icon: '🔔', title: '消息通知', desc: '订单与库存预警' },
      { icon: '📖', title: '使用帮助', desc: '操作指南与常见问题' },
      { icon: '💬', title: '意见反馈', desc: '帮助我们做得更好' },
    ],
  },

  onShow() {
    this.setData({ userRole: app.globalData.userRole });
  },

  onRoleChange(e) {
    const idx = e.detail.value;
    const role = this.data.roles[idx];
    app.setUserRole(role.value);
    this.setData({ userRole: role.value });
    wx.showToast({ title: `已切换为${role.label}`, icon: 'success' });
  },

  onMenuTap(e) {
    const title = e.currentTarget.dataset.title;
    wx.showToast({ title: `${title} - 即将开放`, icon: 'none' });
  },
});
