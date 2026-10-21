# MFxian Blog：从零开始

这是独立的新起点，旧版仍在上一级目录。只参考 Astro Theme Pure 简洁的排版方向，不导入 joyehuang/blog 的业务组件。本阶段没有安装 Pure 主题包；页面、布局和 CSS 都由我们逐步编写。

## 运行

在本目录执行 `bun install`，然后 `bun run dev`，访问 http://127.0.0.1:4322/ 。构建使用 `bun run build`，生成的静态文件在 `dist/`。

## 每个 chunk 的约定

先解释目的和涉及文件，再完成一个可运行的小改动，验证后讨论下一块。不要一次加完功能。

| Chunk | 内容 | 状态 |
| --- | --- | --- |
| 01 | 首页、布局、个人资料、基础 CSS | 已实现 |
| 02 | Markdown 文章、文章列表与详情页 | 待进行 |
| 03 | 阅读体验：目录、代码块、字体与间距 | 待进行 |
| 04 | 个性化：首页排版、颜色、深色模式 | 待进行 |
| 05 | 按需要增加搜索、标签或评论 | 待进行 |
| 06 | 域名、部署与发布流程 | 待进行 |

## Chunk 01：从哪里读代码

1. `src/site.ts`：个人资料，是数据。
2. `src/components/Profile.astro`：把数据变成头像和简介，是组件。
3. `src/pages/index.astro`：组合组件，对应网址 `/`。
4. `src/layouts/BaseLayout.astro`：提供全站外框，`<slot />` 接收页面内容。
5. `src/styles/global.css`：全站颜色和布局；组件自己的 `<style>` 负责局部样式。

动手练习：改一句简介 → 改 `--accent` 颜色 → 改头像尺寸。每次只改一项，观察页面变化。

本阶段没有文章，首页显示真实空状态。没有搜索、登录、评论或数据库。

## 参考

- Astro Theme Pure：https://github.com/cworld1/astro-theme-pure
- 此目录头像由用户提供，其授权独立于代码许可证。
