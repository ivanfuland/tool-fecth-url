# Next.js URL Fetcher for n8n

这个项目是一个使用 Next.js (App Router) 构建的 Web 应用，它可以接收用户输入的 URL，然后通过调用一个 n8n webhook 来获取该 URL 的完整爬取内容和摘要内容（均为 Markdown 格式），并在页面上展示这些信息。

## 功能

- 用户输入 URL。
- 应用调用后端 API (`/api/fetch-url`)。
- 后端 API 调用配置好的 n8n webhook。
- n8n webhook 返回 URL 的标题、完整 Markdown 内容和摘要 Markdown 内容。
- 应用在前端友好地展示返回的 Markdown 内容。

## 技术栈

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS (带 `@tailwindcss/typography` 插件美化 Markdown)
- `react-markdown` 用于渲染 Markdown

## 项目结构

```
fetchurl/
├── app/
│   ├── api/
│   │   └── fetch-url/
│   │       └── route.ts       # 后端 API 路由
│   │   ├── (components)/
│   │   │   └── markdown-display.tsx # Markdown 显示组件
│   │   ├── layout.tsx           # 全局布局
│   │   ├── page.tsx             # 主页面 (/) 
│   │   └── globals.css          # 全局样式
│   ├── public/                  # 静态资源
│   ├── .env.local.example       # 环境变量示例
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── postcss.config.js
│   └── tailwind.config.ts
└── README.md
```

## 环境变量

在项目根目录创建一个 `.env.local` 文件，并可以设置以下变量：

```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook-path/fetch-url
```

如果未设置 `N8N_WEBHOOK_URL`，程序将默认使用 `https://n8n.judyplan.com/webhook-test/fetch-url`。

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

Next.js (App Router) 项目可以很好地部署到 Cloudflare Pages。

1.  将您的代码推送到 GitHub/GitLab 仓库。
2.  在 Cloudflare Pages 仪表板中，连接您的仓库。
3.  配置构建设置：
    - **框架预设 (Framework preset)**: 选择 `Next.js`。
    - **构建命令 (Build command)**: 通常是 `npm run build` 或 `yarn build` (Cloudflare 可能会自动填充)。
    - **构建输出目录 (Build output directory)**: 通常是 `.next` (Cloudflare 可能会自动填充)。
    - **环境变量 (Environment variables)**: 添加您的 `N8N_WEBHOOK_URL` (如果需要覆盖默认值)。

Cloudflare Pages 将自动处理构建和部署。由于 Next.js 的 App Router 使用了较新的 Node.js 功能，请确保 Cloudflare Pages 的构建环境支持兼容的 Node.js 版本 (通常 Cloudflare 会保持更新)。 