const app = getApp();

Page({
  data: {
    products: [],
    searchValue: '',
    categories: ['全部', '黄金', '铂金', '钻石', '翡翠', '其他'],
    activeCategory: 0,
    isLoading: false,
    page: 1,
    hasMore: true,
  },

  onLoad() {
    this.loadProducts();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true, products: [] });
    this.loadProducts().then(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadProducts();
    }
  },

  async loadProducts() {
    if (this.data.isLoading) return;
    this.setData({ isLoading: true });

    try {
      const category = this.data.categories[this.data.activeCategory];
      const res = await app.request({
        url: '/products',
        data: {
          page: this.data.page,
          limit: 20,
          search: this.data.searchValue,
          category: category === '全部' ? '' : category,
        },
      });

      if (res.statusCode === 200) {
        const newProducts = res.data.items || res.data || [];
        this.setData({
          products: [...this.data.products, ...newProducts],
          page: this.data.page + 1,
          hasMore: newProducts.length >= 20,
        });
      }
    } catch (e) {
      console.error('Load products failed:', e);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  onSearchInput(e) {
    this.setData({ searchValue: e.detail.value });
  },

  onSearch() {
    this.setData({ page: 1, hasMore: true, products: [] });
    this.loadProducts();
  },

  onCategoryTap(e) {
    const idx = e.currentTarget.dataset.index;
    if (idx === this.data.activeCategory) return;
    this.setData({
      activeCategory: idx,
      page: 1,
      hasMore: true,
      products: [],
    });
    this.loadProducts();
  },

  onProductTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/inventory/detail?id=${id}` });
  },
});
