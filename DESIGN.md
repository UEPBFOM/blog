---
version: alpha
name: MFxian Blog
description: A quiet night-sky reading blog built on Fuwari. One world (the starry night), plain navigation, smooth motion.
colors:
  # Theme colours follow the hue in src/config.ts (themeColor.hue, currently 250). Visitors can change it, so build with the CSS variables, not these literals.
  primary: "oklch(0.70 0.14 250)"
  primary-dark: "oklch(0.75 0.14 250)"
  page-bg: "oklch(0.95 0.01 250)"
  page-bg-dark: "oklch(0.16 0.014 250)"
  card-bg: "#ffffff"
  card-bg-dark: "oklch(0.23 0.015 250)"
  btn-content: "oklch(0.55 0.12 250)"
  btn-content-dark: "oklch(0.75 0.1 250)"
  btn-regular-bg: "oklch(0.95 0.025 250)"
  btn-regular-bg-dark: "oklch(0.33 0.035 250)"
  deep-text: "oklch(0.25 0.02 250)"
  codeblock-bg: "oklch(0.17 0.015 250)"
  night: "#03040a"
  status-done: "#15803d"
  status-partial: "#0369a1"
  status-wip: "#b45309"
typography:
  body:
    fontFamily: Roboto, sans-serif
    fontSize: 1rem
    fontWeight: 400
  body-mobile:
    fontFamily: Roboto, sans-serif
    fontSize: 14px
    fontWeight: 400
  post-title:
    fontFamily: Roboto, sans-serif
    fontSize: 1.875rem
    fontWeight: 700
  hero-name:
    fontFamily: Roboto, sans-serif
    fontSize: 3rem
    fontWeight: 700
  meta:
    fontFamily: Roboto, sans-serif
    fontSize: 0.875rem
    fontWeight: 400
  code:
    fontFamily: JetBrains Mono Variable, ui-monospace, monospace
    fontSize: 0.875rem
rounded:
  cell: 2px
  sm: 0.375rem
  md: 0.5rem
  lg: 1rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  card-x: 2.25rem
  page-width: 75rem
  sidebar: 17.5rem
components:
  card:
    backgroundColor: "{colors.card-bg}"
    rounded: "{rounded.lg}"
  button-regular:
    backgroundColor: "{colors.btn-regular-bg}"
    textColor: "{colors.btn-content}"
    rounded: "{rounded.md}"
    height: 2.75rem
  status-badge:
    rounded: "{rounded.md}"
    height: 1.75rem
    typography: "{typography.meta}"
  splash:
    backgroundColor: "{colors.night}"
---

# MFxian Blog design

This file describes how the blog looks and moves, so that every change keeps the same feel. It follows the [DESIGN.md format](https://github.com/google-labs-code/design.md): tokens in the front matter, reasons in the prose below. The sections Motion, Responsive Behavior and Agent Guide are additions of our own.

The source of truth is still the code. Colours are in `src/styles/variables.styl`, sizes in `src/constants/constants.ts`, site settings in `src/config.ts`. If this file and the code disagree, fix one of them in the same change.

## Overview

**A quiet room under a night sky.** The blog is a place to read and write while learning. The one world it lives in is the starry night: the splash screen is a hand-drawn deep-space sky, the banner is the Milky Way over a ridge, and dark mode is the default mood.

Three principles, in priority order:

1. **Easy to read and navigate.** Anyone should find a post, read it, and get back, without learning anything first. Decoration never blocks reading.
2. **Beautiful in the details.** Restraint over spectacle: a narrow palette, consistent radii, careful type and spacing, small moments of delight.
3. **Smooth and natural motion.** Everything eases in and out. Nothing snaps, jumps or makes the reader wait.

The base is the [Fuwari](https://github.com/saicaca/fuwari) template. Keep its layout and components unless a change is asked for, and build new parts out of its pieces (`card-base`, `btn-regular`, `btn-plain`, `text-90` and so on) so they look native.

## Colors

- **Hue-driven theme.** Every theme colour is an `oklch()` value built on `var(--hue)`. The default hue is 250 (cool blue-violet), and visitors can change it in the palette picker. New colours should be written as `oklch(L C var(--hue))` so they follow the picker.
- **Light and dark pairs.** Each variable in `variables.styl` has a light and a dark value. Define both for anything new; never hard-code a colour that only works on one background.
- **Text uses opacity, not new greys.** Use `text-90` for titles, `text-75` for body text, `text-50` for meta and `text-30` for hints. These are black or white at that opacity, so they sit well on any card.
- **Primary is for emphasis only.** `--primary` marks the active item, links on hover, the heatmap and the 404 number. If more than one thing on screen is shouting in primary, one of them should not be.
- **Fixed colours are rare and named.** The only colours outside the hue system are the splash night `#03040a` (with star tints from hot blue to warm orange) and the three status badges: green for done, sky for partial, amber for work in progress, each as a 10% tint with a 30% border.
- **Contrast.** Body text must stay readable on both card backgrounds: use `text-75` or stronger for anything meant to be read, and keep white text on the banner over a soft dark text-shadow.

## Typography

- **Families.** Roboto (400, 500, 700) for Latin text. Chinese falls back to the system font (PingFang, Microsoft YaHei), which is intended. JetBrains Mono for code.
- **Size.** The root is 14px on phones and 16px from `md` up, so everything set in `rem` scales together. Do not set body text in `px`.
- **Hierarchy.** Post titles are 1.875rem bold (`text-3xl`), growing to 2.25rem on the post page from `md` up. Section headings come from the markdown styles, body is 1rem, meta is 0.875rem. Weight and opacity carry the hierarchy; avoid adding more sizes.
- **Chinese text.** Do not use letter-spacing on running Chinese text. Wide tracking is reserved for tiny labels such as the splash hint.

## Layout

- **Grid.** The page is at most 75rem wide: a 17.5rem sidebar on the left and the content on the right, with a 1rem gap. Below `lg` (1024px) the sidebar moves under the content.
- **Banner.** Pages have a 45vh banner. The home banner is 51vh (45 + 6), with the name and bio laid over its lower left. The main panel overlaps the banner by 3.5rem.
- **Cards.** Content sits in cards with generous padding (about 2.25rem across on posts and About). One idea per card; separate cards with 1rem.
- **Navigation.** Blog, Notes, Projects, Archive, About, GitHub. The brand on the left goes home. Prev and next on a post stay within its section.
- **Sidebar.** Profile, then categories, tags, and the token usage card. Sidebar cards stay compact: a title, a little content, no scrolling inside.
- **Whitespace over lines.** Prefer space to divider lines. When a divider is needed, use `--line-divider` (8% black or white).

## Elevation & Depth

The design is flat. Depth comes from surface lightness, not shadows: page background, then cards one step lighter, then float panels (search, settings) with a large shadow in light mode only. Do not add shadows to cards. The banner and splash are the only places with photographic or painted depth.

## Shapes

- Cards and float panels: `--radius-large` (1rem).
- Buttons and badges: 0.5rem (`rounded-lg`). Small icon buttons and inline code: 0.375rem (`rounded-md`).
- Heatmap cells: 2px. Avatars on the splash: full circle.
- Keep corners consistent inside a component; a rounded card never holds square buttons.

## Components

- **Card** (`card-base`): the default container. White or `card-bg-dark`, 1rem radius, no border, no shadow.
- **Buttons.** `btn-regular` is a tinted fill for primary actions (the 404 page's "回首页"). `btn-plain` is transparent with a tinted hover for secondary actions and nav. `btn-card` is for large clickable areas such as the post card arrow. Press states scale to 95%.
- **Sections.** Content is split into Blog, Notes and Projects by `type:` in a post's frontmatter (`blog` by default). Each has its own list page in the navbar (`/blog/`, `/notes/`, `/projects/`) with a header card holding its name and one-line description. Names and descriptions live in `src/constants/sections.ts`.
- **Home sections.** The home page is an overview, not a feed: one card per section with its name, description, a "全部 N" link to the full list, and the latest three posts as compact rows (title, date, one-line description). An empty section says 还在整理中，敬请期待。
- **Post card.** Title, meta row, description, word count and reading time. In the Notes list it also carries the status badge on the right. No cover images for now.
- **Status badge.** Three states only: 已完成 (done), 待补充 (partial), 施工中 (wip). It appears only on notes: in the Notes list and on a note's own page, never on the home page or in Blog. It is a label, not a button, so it has no hover state.
- **Banner hero.** `MFxian` and the bio over the home banner, white with a soft shadow, aligned with the sidebar's left edge. It fades out away from home.
- **Splash.** Shown at most once a day per browser on the home page: a procedural night sky, the avatar in the centre, and one short hint (点击头像). Esc or Enter also enter. It must never be the only way in.
- **Token usage card.** A 16-week heatmap in the sidebar, cells at most 14px, shaded by quartiles of active days in `--primary` at 30/55/80/100%.
- **Comments.** giscus inside a card at the bottom of a post. Its theme follows light or dark mode.

## Motion

Motion explains what changed; it is never decoration for its own sake.

- **Easing.** Use ease-out for things entering, ease-in-out for things moving, and Tailwind's default curve for state changes. Never use linear for movement. Stepped timing is only for a deliberate effect (see the note below).
- **Durations.** State changes such as hover, press and colour take 150–300ms. Content entering (`onload-animation`, fade in and up 2rem) takes 300ms with a 50–75ms stagger between items. Page transitions (Swup fade) take 200ms. Layout changes such as the banner height take 700ms. The splash entrance, about 2.3s, is the only long sequence, and it plays at most once a day.
- **Distance.** Entrances travel 12px to 2rem, not more. Things grow from 95–105%, never from zero.
- **Reduced motion.** Respect `prefers-reduced-motion`: replace movement with a plain fade or show the final state. The splash and the banner hero already do this.
- **Never block.** Animations must not delay reading or clicking. If the content is ready, it shows.

Note: the home bio currently uses a stepped typewriter with a blinking caret. It is the one exception to the smooth rule, and it is under review.

## Responsive Behavior

- **Breakpoints.** `md` (768px) shows the full nav links and the 16px root size. `lg` (1024px) puts the sidebar beside the content and enables the taller home banner. `2xl` shows the table of contents beside posts.
- **Phones first.** Check every change at 375px wide: no sideways scrolling, and touch targets of at least 2.75rem for primary buttons.
- **Heavy effects scale down.** The splash draws fewer stars on small screens. Any new canvas or WebGL effect needs a cheaper version, or no effect, on small or weak devices.

## Do's and Don'ts

Do:

- Keep the night-sky world in small details: the 404 page, loading moments, selection colour. Small and consistent beats big and new.
- Keep navigation plain and always within reach. Real links, real URLs, and a keyboard way out of anything that covers the page (Esc closes dialogs and the splash).
- Give every interactive effect a fallback: reduced motion, weak devices, no JavaScript where possible.
- Write hints that ask for one action at a time, in short Chinese (点击头像, not a paragraph).
- Reuse Fuwari's classes and variables before adding new ones.

Don't:

- Don't add full-screen WebGL scenes, background music or long loading screens. This is a blog for reading.
- Don't add shadows, gradients or new accent colours to cards.
- Don't animate layout properties that cause jank (width, top) when a transform or opacity will do.
- Don't hide content behind hover only; phones cannot hover.
- Don't use more than one attention-grabbing element per screen.

## References

Sites we looked at and what we took from them, not what we copied:

- [makemepulse 2019, "Nomadic Tribe"](https://2019.makemepulse.com/): a restrained palette with a paper-grain texture that ties illustration, 3D and type together; loading as part of the art; one verb per prompt.
- [Felix Rieseberg](https://felixrieseberg.com/): one metaphor (a desk at night) carried through every section, while the nav stays plain and every section has a real URL; a static version for weak devices and a lo-fi switch.
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md): how other teams lay out their DESIGN.md files.

## Agent Guide

When changing the UI:

1. Read this file and the component you are touching. Match its idiom.
2. Use the CSS variables and helper classes above. New colours go in `variables.styl` as light and dark pairs on `var(--hue)`.
3. Check light and dark mode, 375px and desktop widths, and reduced motion.
4. Run `pnpm check` and `pnpm build`, and Biome with LF line endings.
5. If the change alters a rule here, update this file in the same commit.
