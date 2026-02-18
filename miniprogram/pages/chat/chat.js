const app = getApp();

Page({
  data: {
    messages: [],
    inputValue: '',
    isLoading: false,
    scrollToView: '',
    conversationId: null,
    suggestedQuestions: [
      '今天的金价是多少？',
      '帮我查一下库存里的黄金手链',
      '最近一周的销售情况怎么样？',
      '帮我生成一份采购建议',
    ],
  },

  onLoad() {
    this.addMessage('assistant', '你好！我是珠宝AI助手，可以帮你查库存、看金价、分析销售数据。有什么需要帮忙的吗？');
  },

  onUnload() {
    if (this._requestTask) {
      this._requestTask.abort();
    }
  },

  addMessage(role, content) {
    const messages = this.data.messages;
    const id = `msg-${Date.now()}`;
    messages.push({
      id,
      role,
      content,
      time: this.formatTime(new Date()),
    });
    this.setData({
      messages,
      scrollToView: id,
    });
    return id;
  },

  formatTime(date) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onSuggestTap(e) {
    const question = e.currentTarget.dataset.question;
    this.setData({ inputValue: question });
    this.sendMessage();
  },

  async sendMessage() {
    const content = this.data.inputValue.trim();
    if (!content || this.data.isLoading) return;

    this.addMessage('user', content);
    this.setData({ inputValue: '', isLoading: true });

    const assistantMsgId = this.addMessage('assistant', '');

    try {
      const res = await app.request({
        url: '/chat',
        method: 'POST',
        data: {
          message: content,
          user_role: app.globalData.userRole || 'manager',
          session_id: this.data.conversationId,
        },
      });

      if (res.statusCode === 200) {
        const data = res.data;
        let reply = data.message || '抱歉，我没有理解你的问题。';

        if (data.need_form) {
          const guides = {
            '入库': '\n\n💡 请直接告诉我完整信息，例如：\n"张三供应商 足金手链 15.5g 工费35"\n\n支持一次入库多个商品，每行一个即可。',
            '创建销售单': '\n\n💡 请直接告诉我销售信息，例如：\n"客户李四 足金项链 12.3g 工费30"',
            '退货': '\n\n💡 请直接告诉我退货信息，例如：\n"退货 订单号RK20260218001"',
          };
          reply = reply + (guides[data.action] || '\n\n💡 请提供更完整的信息，我会自动处理。');
        }

        this.updateAssistantMessage(assistantMsgId, reply);
      } else {
        this.updateAssistantMessage(assistantMsgId, '网络错误，请稍后重试。');
      }
    } catch (err) {
      console.error('Chat error:', err);
      this.updateAssistantMessage(assistantMsgId, '连接失败，请检查网络后重试。');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  updateAssistantMessage(msgId, content) {
    const messages = this.data.messages;
    const idx = messages.findIndex((m) => m.id === msgId);
    if (idx !== -1) {
      messages[idx].content = content;
      this.setData({ messages });
    }
  },

  onClearChat() {
    wx.showModal({
      title: '清空对话',
      content: '确定要清空当前对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [],
            conversationId: null,
          });
          this.addMessage('assistant', '对话已清空，有什么可以帮你的？');
        }
      },
    });
  },
});
