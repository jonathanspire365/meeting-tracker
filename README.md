# 会议遗留事项智能督办与跟踪看板 (Meeting Action Item Tracker)

这是一个基于 **Next.js / Vite + Express + Tailwind CSS** 以及 **Google Gemini API (@google/genai SDK)** 构建的现代全栈 Web 应用，专门用于企业会议纪要智能解析、遗留事项督办、卡点预警与 Kanban/List 双视图跟踪管理。

---

## ✨ 核心业务功能

1. **AI 会议纪要与文档智能解析**
   - 支持粘贴会议纪要文本、群聊记录、对话转写。
   - 支持直接上传 PDF、Word (.docx)、图片 (.png/.jpg)、TXT 会议文件。
   - 依赖 **Gemini 3.6 / 2.5 Flash** 的 Structured Outputs 结构化萃取能力，精准识别【任务名称】、【责任人】、【截止日期】、【交付物描述】及【卡点阻碍原因】。

2. **看板 (Kanban) 与表格 (List Table) 双视图跟踪**
   - **Kanban 视图**：进行中 (In Progress)、卡点阻塞 (Blocked)、已办结 (Done) 3 大状态泳道，支持一键切换状态与修改卡点说明。
   - **List 表格视图**：支持全字段检索、按超期时间/优先级/责任人多维度排序，支持多选批量办结与批量删除。

3. **超期自动预警与卡点高亮**
   - 自动对比今日日期，红框高亮已超期未完成任务 (⚠️ 已超期 N 天)。
   - 对 Blocked (卡点阻塞) 事项进行强提醒与专区说明，便于领导协调推进。

4. **数据导出与示例加载**
   - **一键导出 Excel (.xlsx)**：可导出全部或筛选后的督办事项为标准 Excel 报表，内置自动列宽排版。
   - **示例数据一键体验**：内置典型企业会议纪要示例，无需手动敲字即可立即体验完整流转。

5. **扩展模块预留**
   - 顶栏预留【招标文件智能解析与比对】Tab，方便未来扩展招投标废标项提炼与资质响应。

---

## 🚀 部署到 Vercel 指南

项目已配置标准 Next.js App Router API 路由 (`/app/api/extract-tasks/route.ts`)，支持一键部署至 Vercel：

### 1. 环境变量配置 (Vercel Settings -> Environment Variables)
在 Vercel 控制台中添加以下环境变量：
- `GEMINI_API_KEY`: 您的 Google Gemini API 密钥 (在 AI Studio 或 Google Cloud Console 中获取)

### 2. Vercel 部署步骤
1. 将项目代码推送到 GitHub / GitLab 仓库。
2. 登录 [Vercel Console](https://vercel.com/)，选择 **Import Project**。
3. 关联您的 GitHub 仓库，Framework Preset 选择 **Next.js**。
4. 在 Environment Variables 中填入 `GEMINI_API_KEY`。
5. 点击 **Deploy** 即可在一分钟内完成全栈部署。

---

## 💻 本地开发与运行指南

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env` 或在环境变量中设置 `GEMINI_API_KEY`：
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 3. 启动开发服务器
```bash
npm run dev
```
启动后在浏览器访问 `http://localhost:3000` 即可使用。

### 4. 打包为 ZIP 压缩包
```bash
node scripts/package-app.cjs
```
运行后将在项目根目录下生成 `meeting-tracker-app.zip` 压缩文件。

---

## 🛠️ 技术栈清单

- **Frontend**: React 19, Tailwind CSS v4, Lucide-React
- **Backend API**: Node.js, Express, Next.js App Router API
- **AI SDK**: `@google/genai` (Google GenAI TypeScript SDK)
- **Model**: `gemini-3.6-flash` / `gemini-2.5-flash`
- **Excel Export**: `xlsx`
