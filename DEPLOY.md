# Cloudflare Pages

当前使用 Fuwari 官方模板，保留 MIT LICENSE。原始说明见 README.md。

本地：`pnpm install --frozen-lockfile` 后执行 `pnpm dev`。

修改个人信息：`src/config.ts`。文章：`src/content/posts/`。官方演示文章已设为草稿，仅欢迎文章公开。

## Pages 设置

- GitHub 仓库：UEPBFOM/blog。
- 新代码分支：feat/fuwari-cloudflare。直接从此分支部署时，选择它作为生产分支；审核合并后再切换 main。
- 框架：Astro。
- 构建命令：`pnpm build`。
- 输出目录：`dist`。
- 根目录：仓库根目录。
- Node.js：22.16.0；pnpm：9.14.4（package.json 已固定）。

默认用 Cloudflare 的 `CF_PAGES_URL` 生成站点地址。绑定自定义域名后，设置 `PUBLIC_SITE_URL=https://你的域名` 并重新部署。不要将 localhost 配置为生产站点地址。

`pnpm build` 同时生成 Pagefind 搜索索引；`pnpm preview` 可以检查生产版搜索。

此文件是部署说明，不代表已完成线上发布。
