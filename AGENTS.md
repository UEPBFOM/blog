# Repository Guidelines

This project uses Fuwari, Astro and pnpm. Keep the upstream layout unless customization is requested. Settings: src/config.ts; posts: src/content/posts. Validate with pnpm check and pnpm build. Deploy static dist output to Cloudflare Workers static assets (see DEPLOY.md).

Preserve the existing Git history. Work directly on main and keep it as the only branch; use git revert to undo changes. Keep required license and attribution notices when importing third-party code. Do not enable services with upstream personal credentials.

For the frontend design, follow the principles of simplicity, intuitiveness, and ease of use, so users can quickly understand and navigate the page. At the same time, I want a strong aesthetic sense — thoughtful color palettes, typography, and interaction details — so the overall experience feels both beautiful and comfortable. Animations should be smooth and natural, never stiff. Follow DESIGN.md for UI changes, and update it in the same commit when a change alters its rules.