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
        url: '/chat/stream',
        method: 'POST',
        data: {
          message: content,
          conversation_id: this.data.conversationId,
        },
      });

      if (res.statusCode === 200) {
        const data = res.data;
        if (data.conversation_id) {
          this.setData({ conversationId: data.conversation_id });
        }

        const messages = this.data.messages;
        const idx = messages.findIndex((m) => m.id === assistantMsgId);
        if (idx !== -1) {
          messages[idx].content = data.response || data.message || '抱歉，我没有理解你的问题。';
          this.setData({ messages, scrollToView: assistantMsgId });
        }
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
