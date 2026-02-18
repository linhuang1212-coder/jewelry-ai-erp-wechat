App({
  globalData: {
    baseUrl: 'https://fblerp.com/api',
    userRole: 'manager',
    systemInfo: null,
  },

  onLaunch() {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    const savedRole = wx.getStorageSync('userRole');
    if (savedRole) {
      this.globalData.userRole = savedRole;
    }
  },

  setUserRole(role) {
    this.globalData.userRole = role;
    wx.setStorageSync('userRole', role);
  },

  request(options) {
    const that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${that.globalData.baseUrl}${options.url}`,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          ...options.header,
        },
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  },
});
