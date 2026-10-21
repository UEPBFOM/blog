# MF_xian Blog

MF_xian 的个人博客，基于 [joyehuang/blog](https://github.com/joyehuang/blog)、Astro 5 与 Astro Theme Pure 改造。

## 本地运行

使用 Node.js 22 LTS 和 Bun 1.3.10：

```sh
bun install --frozen-lockfile
bun dev
```

打开终端输出的本地网址（默认 http://localhost:4321），不再通过双击 HTML 预览。

## 验证与构建

```sh
bun test src/
bun run check
bun run build
```

沿用模板的 Vercel 服务端适配器；搜索和终端内容 API 需要服务端运行。本次尚未部署。以后部署 Cloudflare 时需要适配其运行环境，不能直接上传源码。

## 修改信息与写文章

- `src/site.identity.ts`：显示名、简介、GitHub、邮箱。
- `src/site.config.ts`：导航与主题配置，评论默认关闭。
- `src/pages/about/index.astro` 及英文镜像：关于页。
- `src/assets/avatar.png` 与 `public/favicon/`：新建的 MF 字母头像和图标。
- `.env.example`：发布前设置 `PUBLIC_SITE_URL` 为真实域名；默认是本地地址。
- `src/content/blog/日期 - 标题/post.mdx`：中文文章；同目录 `post.en.mdx` 为英文版，设置 `language: en` 与对应中文路由的 `translationKey`。
- `src/content/notes/`：短笔记。
- `src/content/curated/`、`talks/`、`lab/`：精选、分享和实验内容，目前留空。

## 迁移说明

保留主题风格、中英文页面、深浅色切换、搜索、RSS、文章目录和终端交互。显示名 MF_xian，GitHub 为 UEPBFOM。原作者的文章、履历、二维码、个人项目、友链与私有 Jojo 包未纳入；统计和评论关闭。

原始三文件页面可以从首次 Git 提交恢复。C++ 占位文件仍保留，尚未接入博客。原始模板资料只在本地忽略目录 `.migration-backup/` 留存，不提交或部署。

代码来源、修改范围见 [NOTICE](NOTICE)，Apache-2.0 许可证见 [LICENSE](LICENSE)。
