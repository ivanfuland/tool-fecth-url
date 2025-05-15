# Next.js URL Fetcher for n8n

这个项目是一个使用 Next.js (App Router) 构建的 Web 应用，它可以接收用户输入的 URL，然后直接从客户端调用一个 n8n webhook 来获取该 URL 的标题、摘要、重点内容以及完整的原始内容（均为 Markdown 格式），并在页面上展示这些信息。

## 功能

- 用户在前端页面输入 URL。
- 应用直接从客户端调用配置好的 n8n webhook，并传递 URL。
- n8n webhook 负责抓取和处理 URL 内容，返回：
    - 标题 (Title)
    - 摘要内容 (Abstract - Markdown 格式)
    - 重点内容 (Highlights - Markdown 格式数组)
    - 完整原始内容 (Msg - Markdown 格式)
- 前端页面展示标题、摘要和重点内容。
- 提供"阅读原文"功能，在模态框中显示完整的 Markdown 内容。
- 在模态框中，用户可以"复制原文到剪贴板"或"下载原文为 .md 文件"。
- 处理并显示调用过程中的错误信息。

## 技术栈

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS (带 `@tailwindcss/typography` 插件美化 Markdown)
- `react-markdown` 和 `remark-gfm` 用于渲染 GitHub Flavored Markdown
- `@headlessui/react` 用于构建模态框 (Dialog)

## 项目结构 (主要文件)

```
fetchurl/
├── app/
│   ├── components/
│   │   ├── markdown-display.tsx # Markdown 显示组件
│   │   └── content-modal.tsx    # 内容显示与交互模态框组件
│   ├── layout.tsx             # 全局布局
│   ├── page.tsx               # 主页面 (/)，包含主要的业务逻辑
│   └── globals.css            # 全局样式
├── public/                    # 静态资源
├── .env.local.example         # 环境变量示例
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.js
└── tailwind.config.ts
```

## 环境变量

在项目根目录创建一个 `.env.local` 文件，并可以设置以下**客户端**环境变量：

```
NEXT_PUBLIC_N8N_WEBHOOK_URL="你的n8n webhook URL"
```
如果未设置此环境变量，代码中会使用一个默认的 n8n webhook URL (`https://n8n.judyplan.com/webhook/fecth-url`)。建议始终通过环境变量配置此 URL。

## 本地开发

1.  **安装依赖**:
    ```bash
    npm install
    # 或者
    yarn install
    ```

2.  **运行开发服务器**:
    ```bash
    npm run dev
    # 或者
    yarn dev
    ```

    应用将在 `http://localhost:3000` 上运行。

## 构建和部署

1.  **构建项目**:
    ```bash
    npm run build
    # 或者
    yarn build
    ```

2.  **启动生产服务器 (可选，通常用于本地测试构建)**:
    ```bash
    npm run start
    # 或者
    yarn start
    ```

### 部署到 Cloudflare Pages

Next.js (App Router) 项目可以很好地部署到 Cloudflare Pages。请按照以下步骤操作：

1.  在Cloudflare Dashboard中，进入Pages选项。
2.  点击"创建项目"。
3.  选择并连接您的Git仓库提供商。
4.  选择包含本应用的仓库。
5.  配置构建设置：
    *   **框架预设 (Framework preset)**: 选择 `Next.js (Static HTML Export)`。
    *   **构建命令 (Build command)**: 系统会自动填入 `npx next build`。
    *   **构建输出目录 (Build output directory)**: `out`。
    *   **根目录 (Root directory)**: 保持默认值 `/`。
    *   **Node.js 版本 (Node.js version)**: 选择 16.x 或更高版本。
    *   **环境变量 (Environment variables)**: 添加 `NEXT_PUBLIC_N8N_WEBHOOK_URL` 并设置为您的 n8n webhook URL。
6.  点击"保存并部署"。

Cloudflare Pages 将自动处理构建和部署。由于 Next.js 的 App Router 使用了较新的 Node.js 功能，请确保 Cloudflare Pages 的构建环境支持兼容的 Node.js 版本 (通常 Cloudflare 会保持更新)。 