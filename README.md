# MFxian Blog

基于 [Fuwari](https://github.com/saicaca/fuwari) 构建的个人博客。

## 关于我

你好，我是 MFxian。

这里记录我的编程学习、项目实践与日常思考。希望把学习过程中遇到的问题、尝试过的方法，以及值得留下的想法，慢慢整理成自己的积累。

[我的 GitHub](https://github.com/UEPBFOM)

## 本地运行

```sh
pnpm install --frozen-lockfile
pnpm dev
```

- 个人信息与主题设置：`src/config.ts`
- 文章目录：`src/content/posts/`
- 新建文章：`pnpm new-post my-first-post`
- 构建网站：`pnpm build`
- Cloudflare Pages 部署说明：[DEPLOY.md](./DEPLOY.md)

## 文章时间

需要显示具体时间时，在文章开头填写带时区、带引号的时间：

```yaml
published: "2026-10-22T14:30:00+08:00"
updated: "2026-10-23T09:15:00+08:00"
```

首页文章卡片和文章详情会显示发布时间，例如 `2026-10-22 14:30`。详情页还会显示不同于发布时间的更新时间。统一按台北时区（UTC+08:00）显示，与部署服务器时区无关。

`pnpm new-post` 自动记录创建时刻；发布时间和更新时间均可手动修改，不会在部署或保存时自动刷新。已有 `published: 2026-10-22` 这种仅日期写法仍然只显示日期。归档页保留简洁的月日显示。

## 来源与许可

博客使用 [Astro](https://astro.build/)，基于 [saicaca/Fuwari](https://github.com/saicaca/fuwari) 模板修改，感谢原作者及贡献者。

Fuwari 采用 MIT 协议。本仓库保留原作者的版权声明及完整许可文本，详见 [LICENSE](./LICENSE)。

博客中的个人文章及图片不因模板采用 MIT 协议而自动获得相同授权；如有单独的授权或来源说明，以相应说明为准。
