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

## 来源与许可

博客使用 [Astro](https://astro.build/)，基于 [saicaca/Fuwari](https://github.com/saicaca/fuwari) 模板修改，感谢原作者及贡献者。

Fuwari 采用 MIT 协议。本仓库保留原作者的版权声明及完整许可文本，详见 [LICENSE](./LICENSE)。

博客中的个人文章及图片不因模板采用 MIT 协议而自动获得相同授权；如有单独的授权或来源说明，以相应说明为准。
