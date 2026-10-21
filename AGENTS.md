# Repository Guidelines

## Project structure

Astro 5, TypeScript, Bun and Astro Theme Pure. Routes live in `src/pages`, shared UI in `src/components`, layouts in `src/layouts`, and content in `src/content`. Global identity is in `src/site.identity.ts`; theme options are in `src/site.config.ts`. Chinese posts use `post.mdx`, English mirrors use `post.en.mdx` with a `translationKey`.

## Development and validation

- `bun install --frozen-lockfile`
- `bun dev`
- `bun test src/`
- `bun run check`
- `bun run build`

Use local development for reviewing server endpoints; `bun preview` only serves prerendered Vercel build files. No production deployment is configured yet. Set `PUBLIC_SITE_URL` before publishing. Do not enable analytics, comments or external services using upstream account configuration.

## Style

Use TypeScript and Astro, two-space indentation, single quotes and no semicolons. Put meaningful regression tests beside the code. Keep Apache-2.0 attribution in LICENSE and NOTICE. Never copy the upstream author's personal content or claim their biography as MF_xian's.

## Git workflow

Use Conventional Commits. Never push directly to `main`: open a PR from a feature branch and merge after approval. PRs should explain the behavior change and validation. Add local screenshots when capture is available; otherwise describe the verification limit. Preserve the first commit as a recoverable version of the original three-file page.
