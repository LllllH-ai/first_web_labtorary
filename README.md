# AI研究实验室官方网站

一个现代化、专业的课题组官方网站，展示研究成果、团队信息和与访客互动。

## 📋 项目结构

```
zuzhi_web2/
├── index.html              # 首页
├── publications.html       # 文章发表页面
├── team.html              # 团队成员页面
├── contact.html           # 联系我们页面
├── css/
│   ├── style.css          # 全局样式和导航栏样式
│   ├── publications.css    # 文章发表页面样式
│   ├── team.css           # 团队成员页面样式
│   └── contact.css        # 联系我们页面样式
├── js/
│   ├── script.js          # 全局JavaScript功能
│   ├── publications.js     # 文章发表页面交互
│   ├── team.js            # 团队成员页面交互
│   └── contact.js         # 联系我们页面交互
└── README.md              # 本文件
```

## 🎯 页面功能说明

### 1. 首页 (index.html)
- **英雄横幅**：展示课题组名称和研究方向
- **研究方向**：4个研究领域的卡片展示
- **最新发表**：展示最近发表的3篇论文
- **特点**：平滑滚动动画、响应式设计

### 2. 文章发表 (publications.html)
分为4个子模块：

- **在线投稿**
  - 论文类型选择
  - 出版社/期刊选择
  - 支持文件上传（PDF、Word，最大50MB）
  - 展示投稿流程

- **写作要求**
  - 详细的论文写作规范
  - 包括格式、内容、引用等要求

- **意见反馈**
  - 用户反馈表单
  - 选择相关出版社
  - 支持联系许可

- **附加功能**
  - 联系信息
  - 论文模板下载
  - 作者指南下载

### 3. 团队成员 (team.html)
- **三层级别展示**
  - 课题组组长（1人）
  - 副组长（2人）
  - 核心研究员（3人）

- **成员卡片包含**
  - 头像
  - 姓名和职位
  - 研究方向
  - 邮件和个人主页链接

- **团队统计**
  - 展示团队规模信息

### 4. 联系我们 (contact.html)
- **联系表单**
  - 姓名、邮箱、电话
  - 咨询主题选择
  - 消息内容输入
  - 实时表单验证

- **联系信息卡片**
  - 电子邮箱
  - 联系电话
  - 办公地址
  - 工作时间

- **主要联系人**
  - 课题组组长
  - 副组长

- **关注我们**
  - GitHub、Twitter、LinkedIn、WeChat链接

- **常见问题 (FAQ)**
  - 投稿流程
  - 加入团队条件
  - 实验室访问
  - 合作研究流程

## 🎨 设计特点

### 颜色方案
- **主色调**：紫蓝色渐变 (`#667eea` 至 `#764ba2`)
- **辅助色**：浅灰色背景
- **文字色**：深灰色主文本，浅灰色辅助文本

### 响应式设计
- ✅ 完全支持桌面端
- ✅ 完全支持平板端
- ✅ 完全支持手机端
- ✅ 流体布局，自适应屏幕

### 交互效果
- 平滑的悬停动画
- 淡入淡出过渡效果
- 卡片浮起效果
- 表单验证反馈
- 通知消息提示

## 🚀 快速开始

### 方法1：直接在浏览器打开
1. 找到 `index.html` 文件
2. 双击或右键选择"用浏览器打开"
3. 即可查看网站

### 方法2：使用本地服务器（推荐）
```bash
# 如果已安装Python
python -m http.server 8000

# 如果已安装Node.js
npx http-server

# 然后在浏览器访问：http://localhost:8000
```

## 📝 内容修改指南

### 修改课题组信息
编辑 `index.html` 中的：
- 课题组名称（导航栏的 `.logo-text`）
- 研究方向卡片内容（`.area-card`）
- 论文信息（`.paper-item`）

### 修改团队成员
编辑 `team.html` 中的：
- 成员名字（`.member-name`）
- 职位和研究方向（`.member-title` 和 `.member-bio`）
- 联系邮箱（`.member-contact` 中的 `href`）

### 修改联系信息
编辑 `contact.html` 中的：
- 邮箱地址（`.info-content a` 中的 `href="mailto:..."`）
- 电话号码（`.info-content a` 中的 `href="tel:..."`）
- 办公地址（`.info-content p`）

## 🔧 功能说明

### 表单提交
目前所有表单提交都是前端处理，显示成功消息。
**后端集成提示**：如需实际发送邮件或保存数据，需要：
1. 创建后端API接口
2. 修改 `contact.js` 中的 `submitContactForm` 函数
3. 修改 `publications.js` 中的 `handleSubmissionForm` 函数
4. 修改 `publications.js` 中的 `handleFeedbackForm` 函数

示例代码（修改 `contact.js`）：
```javascript
// 替换现有的模拟提交代码
fetch('/api/contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => {
    showNotification('消息发送成功！', 'success');
    form.reset();
})
.catch(error => {
    showNotification('消息发送失败，请重试', 'error');
});
```

### 文件上传
目前文件选择只在前端验证格式和大小。
**后端集成提示**：需要创建处理文件上传的API接口。

## 📱 浏览器兼容性

- ✅ Chrome (最新版本)
- ✅ Firefox (最新版本)
- ✅ Safari (最新版本)
- ✅ Edge (最新版本)
- ✅ 移动浏览器

## 🎯 后续改进建议

1. **数据库集成**
   - 存储论文投稿信息
   - 存储用户反馈
   - 存储联系消息

2. **用户系统**
   - 用户注册和登录
   - 投稿进度追踪
   - 个人资料管理

3. **邮件功能**
   - 自动发送确认邮件
   - 发送回复邮件
   - 邮件通知

4. **内容管理系统 (CMS)**
   - 动态管理论文列表
   - 动态管理团队成员
   - 动态管理联系信息

5. **搜索和筛选**
   - 按关键词搜索论文
   - 按研究方向筛选团队成员
   - 按日期排序论文

6. **社交媒体整合**
   - 显示Twitter最新动态
   - 显示GitHub项目
   - 链接到学术平台

## 📄 许可证

本项目免费使用和修改。

## 👥 团队

- **Dr. Sarah Chen** - 课题组组长
- **Prof. Michael Zhang** - 副组长
- **Dr. Emily Rodriguez** - 副组长

## 📞 支持

如有任何问题，请通过以下方式联系：
- 邮箱：contact@ailab.org
- 电话：+86-10-62737800

---

**最后更新**：2024年12月
