# Cloudflare Workers 部署

当前使用 Fuwari 官方模板，保留 MIT LICENSE。模板原始说明见 https://github.com/saicaca/fuwari 。

本地：`pnpm install --frozen-lockfile` 后执行 `pnpm dev`。

修改个人信息：`src/config.ts`。文章：`src/content/posts/`。官方演示文章已设为草稿，仅欢迎文章公开。

## Cloudflare 设置（Workers，静态资源）

- GitHub 仓库：UEPBFOM/blog，生产分支：`main`，推送即自动部署。
- 项目名：`blog`，与 `wrangler.jsonc` 中的 `name` 保持一致。
- 构建命令：`pnpm run build`。
- 部署命令：`npx wrangler deploy`（按 `wrangler.jsonc` 上传 `dist`）。
- 根目录：仓库根目录。
- Node.js / pnpm 版本由 package.json 固定。

## 站点地址

站点地址由环境变量 `PUBLIC_SITE_URL` 决定（用于 sitemap、RSS、canonical）。未设置时回退到 `https://blog.uepbfom.workers.dev/`。

- 使用 workers.dev 预览：在 Cloudflare 项目的 Settings → Variables and secrets 中设置 `PUBLIC_SITE_URL=https://blog.<你的子域>.workers.dev`。
- 绑定自定义域名后：在 Domains and routes 添加域名，把 `PUBLIC_SITE_URL` 改为 `https://你的域名`，重新部署。
- 不要把 localhost 配置为生产站点地址。

`pnpm build` 同时生成 Pagefind 搜索索引；`pnpm preview` 可以检查生产版搜索。
