const app = getApp();

Page({
  data: {
    products: [],
    searchValue: '',
    isLoading: false,
  },

  onLoad() {
    this.loadProducts();
  },

  onPullDownRefresh() {
    this.setData({ products: [] });
    this.loadProducts().then(() => wx.stopPullDownRefresh());
  },

  async loadProducts() {
    if (this.data.isLoading) return;
    this.setData({ isLoading: true });

    try {
      const params = { limit: 500 };
      if (this.data.searchValue) {
        params.product_name = this.data.searchValue;
      }
      const res = await app.request({
        url: '/warehouse/inventory',
        data: params,
      });

      if (res.statusCode === 200) {
        const items = Array.isArray(res.data) ? res.data : [];
        this.setData({ products: items });
      }
    } catch (e) {
      console.error('Load inventory failed:', e);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  onSearchInput(e) {
    this.setData({ searchValue: e.detail.value });
  },

  onSearch() {
    this.setData({ products: [] });
    this.loadProducts();
  },
});
