App({
  globalData: {
    baseUrl: 'https://your-backend-domain.com/api/v1',
    userInfo: null,
    token: null,
    systemInfo: null,
  },

  onLaunch() {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.checkLogin();
  },

  checkLogin() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.getUserInfo();
    }
  },

  getUserInfo() {
    const that = this;
    wx.request({
      url: `${this.globalData.baseUrl}/auth/me`,
      header: { Authorization: `Bearer ${this.globalData.token}` },
      success(res) {
        if (res.statusCode === 200) {
          that.globalData.userInfo = res.data;
        } else {
          that.logout();
        }
      },
      fail() {
        that.logout();
      },
    });
  },

  logout() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.reLaunch({ url: '/pages/index/index' });
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
          Authorization: that.globalData.token
            ? `Bearer ${that.globalData.token}`
            : '',
          ...options.header,
        },
        success(res) {
          if (res.statusCode === 401) {
            that.logout();
            reject(new Error('Unauthorized'));
            return;
          }
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  },
});
