const app = getApp();

Page({
  data: {
    userInfo: null,
    menuItems: [
      { icon: '📊', title: '经营报表', desc: '查看销售与库存分析' },
      { icon: '🔔', title: '消息通知', desc: '订单与库存预警' },
      { icon: '⚙️', title: '系统设置', desc: '账号与偏好设置' },
      { icon: '📖', title: '使用帮助', desc: '操作指南与常见问题' },
      { icon: '💬', title: '意见反馈', desc: '帮助我们做得更好' },
    ],
  },

  onShow() {
    this.setData({ userInfo: app.globalData.userInfo });
  },

  onMenuTap(e) {
    const title = e.currentTarget.dataset.title;
    wx.showToast({ title: `${title} - 即将开放`, icon: 'none' });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success(res) {
        if (res.confirm) {
          app.logout();
        }
      },
    });
  },
});
