# 珠宝AI ERP 微信小程序版

WeChat Mini Program for Jewelry AI ERP System.

## 项目结构

```
jewelry-ai-erp-wechat/
├── miniprogram/           # 小程序源码
│   ├── pages/
│   │   ├── index/         # 首页 - 仪表盘
│   │   ├── chat/          # AI对话助手
│   │   ├── inventory/     # 库存管理
│   │   └── profile/       # 个人中心
│   ├── components/        # 公共组件
│   ├── utils/             # 工具函数
│   ├── assets/            # 静态资源
│   ├── app.js             # 应用入口
│   ├── app.json           # 应用配置
│   └── app.wxss           # 全局样式
├── cloud-functions/       # 云函数（预留）
├── server/                # 服务端适配层（预留）
└── project.config.json    # 项目配置
```

## 功能模块

- **首页仪表盘**: 商品统计、今日订单、实时金价、待办任务
- **AI对话助手**: 对接后端AI Chat API，支持自然语言查询库存、金价、销售数据
- **库存管理**: 商品列表、分类筛选、搜索、库存预警
- **个人中心**: 账号管理、系统设置

## 开发指南

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入本项目，选择 `project.config.json` 所在目录
3. 在 `miniprogram/app.js` 中配置后端 API 地址
4. 在 `project.config.json` 中替换为你的小程序 AppID

## 后端对接

本小程序对接 [jewelry-ai-erp](https://github.com/linhuang1212-coder/jewelry-ai-erp) 后端 API。

需要确保后端 API 支持：
- HTTPS 访问（小程序要求）
- 域名已在小程序管理后台配置为合法域名
