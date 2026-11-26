# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `AGENTS.md` for repository conventions (coding style, commit format, verification expectations). This file covers what those guidelines don't.

## Commands

- `npm run dev` — Vite dev server on `127.0.0.1` (frontend only; `/api/*` is not served).
- `vercel dev` — frontend plus the `api/` Vercel function together (needed to exercise blog likes locally).
- `npm run typecheck` — `tsc -b` with strict settings, including `noUnusedLocals`/`noUnusedParameters`.
- `npm run build` — typecheck, then build all pages into `dist/`. This is the only automated check; there is no test runner or linter.
- `npm run format` — Prettier over `src/` and root files.
- Add shadcn components with `npx shadcn@latest add <component-or-registry-url>` (config in `components.json`, aliases under `@/`).

## Architecture

### Multi-page static site

This is not an SPA. Each route is a separate HTML entry with its own React root:

| HTML entry | Script |
| --- | --- |
| `index.html` | `src/main.tsx` → `src/App.tsx` (main portfolio) |
| `projects/index.html` | `src/projects-main.tsx` |
| `hackathons/index.html` | `src/hackathons-main.tsx` |
| `highlights/index.html` | `src/highlights-main.tsx` |
| `blogs/index.html` and `blogs/<slug>/index.html` | `src/blog-main.tsx` |

Every HTML entry must be listed in `rollupOptions.input` in `vite.config.ts`, or it won't be built. **Adding a blog post** therefore requires: an entry in `src/data/blog-posts.json`, a body at `src/data/blogs/<slug>.html`, a `blogs/<slug>/index.html` shell, and a new line in `vite.config.ts`. Optional per-post extras go in `src/data/blog-editorial.ts`, and images in `public/images/blogs/<slug>/`. The site lives at `https://naren7.me` (www redirects to the apex in Vercel's domain settings), so a new post also needs its `<url>` in `public/sitemap.xml`, and its shell needs the canonical/Open Graph/Twitter tags copied from an existing post with an `og.jpg` (1200×630 JPEG) next to its cover.

`blog-main.tsx` works out which post to show from `window.location.pathname`. It loads post bodies as raw HTML through `import.meta.glob` and builds the table of contents from `h2[id]` elements in that HTML.

### Subpages reuse sections

Archive pages (`/projects/`, `/hackathons/`, `/highlights/`, `/blogs/`) wrap the same section components used on the home page in `PortfolioSubpage`. They usually pass an `archive` prop that hides the section heading and the "View all" link. `PortfolioSubpage` reimplements the theme toggle, command menu, and resume dialog independently of `App.tsx`. Change shared shell behavior in both places.

### Theme

The theme is `data-theme="light" | "dark"` on `<html>`, persisted in `localStorage` under `portfolio-theme` (wrapped in try/catch). CSS tokens key off `[data-theme]`. Every HTML entry has a small inline `<head>` script that applies the saved light theme before first paint; copy it into any new HTML shell, or light-mode visitors get a dark flash. Light-mode styling follows the reference site: when a rule hard-codes a colour, add a `:root[data-theme="light"]` override next to it (zinc palette, `rgb(0 0 0 / N%)` borders) rather than relying on tokens alone. On the home page, `App.tsx` animates the switch via `ThemeSurveyPoints` and a `theme-settling` class, and skips the animation under `prefers-reduced-motion`.

### Data

Content lives in `src/data/`. `portfolio.ts` is the hub: profile, `sections` (drives `SectionIndex` navigation and must match section element IDs), projects, and experience. It also re-exports `blog-posts.json` as `blogs`. `reference-content.json` holds placeholder content from the original reference site, kept for later use. Some sections, such as Open Source, are commented out in `App.tsx` and `portfolio.ts` rather than deleted.

GitHub activity is fetched live from a public contributions API on page load, and falls back to the `github-activity.json` snapshot if the request fails. Social hover-card data in `socials.ts` is static.

### Icons and assets

`Icon.tsx` renders `<use href="/icons/portfolio-icons.svg#name">`, so new icons need a `<symbol>` added to that sprite. Public assets use lowercase hyphenated names, grouped by section (and by post, project, or event) under `public/images/`. Image-generation prompts live in `assets/prompts/`.

### Caching

`vercel.json` sets browser caching: hashed `/assets/*` bundles and `/fonts/*` are immutable for a year; `/images/*`, `/icons/*`, and `/favicon.svg` are cached for 7 days. Those files are not content-hashed, so **give a replaced image a new filename** rather than overwriting it, or returning visitors may see the old one for a week. HTML pages, `/resume/*`, and `/api/*` are deliberately left uncached. The GitHub calendar is cached in `localStorage` for an hour (`GitHubActivitySection.tsx`).

### Backend: blog likes

`api/blog-likes.js` is a plain-JS Vercel function that uses `postgres` against Supabase (`portfolio_private.blog_likes`; schema in `supabase/migrations/`). It needs the server-only env var `BLOG_LIKES_DATABASE_URL`, the transaction pooler URI. It imports `src/data/blog-posts.json` to whitelist slugs and tracks one like per post per visitor cookie. The client side is `useBlogLikes.ts`, which dedupes concurrent reads.

### Backend: blog email subscriptions

Double opt-in subscriptions sent through Resend (installed via the Vercel Marketplace; `RESEND_API_KEY`, sending domain `naren7.me` verified with DNS records in Cloudflare). Emails come from `naren7's raven <raven@naren7.me>`. Tables `portfolio_private.blog_subscribers` and `blog_notifications` (schema in `supabase/migrations/`) use the same `BLOG_LIKES_DATABASE_URL`. Shared code is in `api/_lib/subscriptions.js` (underscore paths are not deployed as functions).

- `api/blog-subscribe.js`: POST from `BlogSubscribeDialog`. Stores the address as pending and emails a confirmation link; at most one confirmation per address per day and 30 per hour overall. It always answers `pending`, so it never reveals whether an address is subscribed.
- `api/blog-confirm.js` / `api/blog-unsubscribe.js`: GET renders a page with a button and only POST changes state, so mail scanners that pre-open links can't act. Unsubscribe also accepts RFC 8058 one-click POSTs from the `List-Unsubscribe` header.
- `api/blog-notify.js`: bearer-protected with `BLOG_NOTIFY_SECRET`, called by `npm run notify -- <slug>` (dry run by default; `--test <email>`; `--send` asks for confirmation). It only accepts slugs in the deployed `blog-posts.json`, and records each send before sending, so nobody gets a post twice. The local secret lives in the gitignored `.env.notify` (not `.env.local`, which `vercel env pull` overwrites).

After publishing a post and deploying it, run `npm run notify -- <slug> --test <your email>`, check the email, then `npm run notify -- <slug> --send`.

### Styling

Styling is mostly hand-written CSS in `src/styles/`, imported by components and entry files. Tailwind v4 (via `@tailwindcss/vite`) and shadcn theme mappings live in `shadcn.css`, and the base reset sits in a layer so utilities can override it. Some UI components (`radial-glow-button`, `liquid-metal`) come from the VengeanceUI shadcn registry and load their own CSS. The layout is desktop-first: a centered column of `--column-width: min(768px, 100% - 64px)` (`layout.css`, mirrored in `blog.css`), so every laptop and desktop gets the same 768px layout instead of a share of the window. The section index sits beside it and hides below 1180px.

Below 768px, phones get their own design from `src/styles/mobile.css` (imported last in `main.tsx` and `PortfolioSubpage.tsx`): Instrument Serif/Sans (self-hosted, only downloaded by phone rules), the phone-only `MobileNav` top bar that floats as a pill on scroll, hatched side rails, hairline dividers, icon-only socials in the hero, and dashed one-line section intros (`sectionIntros` in `portfolio.ts`, passed to `SectionHeading`'s `intro` prop). The home banner is not rendered on phones (`useMediaQuery`). Phone-only elements are `display: none` on desktop, so check both widths after layout changes.
