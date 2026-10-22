# Repository Guidelines

This project uses Fuwari, Astro and pnpm. Keep the upstream layout unless customization is requested. Settings: src/config.ts; posts: src/content/posts. Validate with pnpm check and pnpm build. Deploy static dist output to Cloudflare Pages.

Preserve the existing Git history. Work directly on main and keep it as the only branch; use git revert to undo changes. Keep required license and attribution notices when importing third-party code. Do not enable services with upstream personal credentials.
