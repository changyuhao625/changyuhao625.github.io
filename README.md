# Harry Chang's Blog

[View Live →](https://changyuhao625.github.io)

> Harry's 踩過的坑與想通的事 — 涵蓋 .NET、架構、敏捷、引導等主題。

Personal blog built with **Astro 5**, deployed to GitHub Pages. Traditional Chinese content with CJK-aware typography, dark mode, RSS, sitemap, `llms.txt`, and JSON-LD structured data baked in.

中文說明：[README.zh.md](./README.zh.md)

## Tech stack

- [Astro 5](https://astro.build/) — static site generator
- [`@astrojs/mdx`](https://docs.astro.build/en/guides/integrations-guide/mdx/) — author posts in `.md` or `.mdx`
- [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — auto-generated `/sitemap-index.xml`
- [`@astrojs/rss`](https://docs.astro.build/en/guides/rss/) — `/rss.xml` feed
- [Shiki](https://shiki.style/) with the `github-dark` theme for code highlighting
- TypeScript (`astro/tsconfigs/strict`)
- Node 20 (see `.github/workflows/*.yml`)

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview  # serve dist/
```

## Project structure

```
.
├── astro.config.mjs
├── src/
│   ├── consts.ts                # site title, URL, nav, social links, GA id
│   ├── content.config.ts        # content collection schema (Zod)
│   ├── content/blog/
│   │   ├── tech/yyyy/mm/dd/slug.md
│   │   └── softskill/yyyy/mm/dd/slug.md
│   ├── components/              # BaseHead, SiteHeader, TableOfContents, …
│   ├── layouts/                 # BaseLayout, PostLayout
│   ├── pages/
│   │   ├── index.astro          # paginated home
│   │   ├── [...slug].astro      # individual post (category/yyyy/mm/dd/slug)
│   │   ├── page/[page].astro    # pagination
│   │   ├── tags/[tag].astro     # tag archive
│   │   ├── archive.astro        # full archive
│   │   ├── about.astro          # ProfilePage JSON-LD
│   │   ├── rss.xml.ts           # RSS feed
│   │   └── llms.txt.ts          # AI-crawler friendly index
│   ├── styles/global.css
│   └── utils/
│       ├── description.ts       # meta description extractor (no fabrication)
│       └── reading-time.ts      # CJK-aware (300 CPM / 220 WPM)
├── public/                      # img, fonts, PWA manifest, sw.js, verification files
├── .github/workflows/
│   ├── ci.yml                   # PR / branch build check
│   └── deploy.yml               # push master/main -> GitHub Pages
└── package.json
```

## Write a post

Create a Markdown file at `src/content/blog/{category}/{yyyy}/{mm}/{dd}/{slug}.md`:

```md
---
title: "[C#] 擴充方法 (Extension Methods)"
date: 2016-04-13
category: tech          # "tech" | "softskill"
tags: ["C#", "Extension Methods"]
author: "Harry Chang"   # optional; defaults to Harry Chang
subtitle: "..."         # optional, shown under the title
description: "..."      # optional; used as meta/OG description and JSON-LD
headerImg: "/img/..."   # optional hero background
draft: false            # optional; drafts are excluded from the build
---

正文從這裡開始…
```

Front-matter schema lives in [`src/content.config.ts`](./src/content.config.ts) (Zod). The URL is derived from the file path, so `tech/2016/04/13/csharp-extension-methods.md` is served at `/tech/2016/04/13/csharp-extension-methods/`.

A `<!--more-->` marker or explicit `description` field is used to generate the meta/OG description; otherwise the first meaningful paragraph is extracted mechanically (see `src/utils/description.ts`). Nothing is paraphrased.

## SEO / AEO features

- `BlogPosting` + `BreadcrumbList` JSON-LD on every post
- `ProfilePage` JSON-LD on `/about/`
- Open Graph and Twitter Card meta tags
- Canonical URL, RSS auto-discovery, theme-color (light/dark)
- `/llms.txt` — per-category post index with descriptions and tags for AI crawlers
- `/rss.xml` — full feed with author, tags, description
- `/sitemap-index.xml` — via `@astrojs/sitemap`

## Configuration

Edit [`src/consts.ts`](./src/consts.ts):

| Key | Purpose |
| --- | --- |
| `SITE_TITLE` / `SITE_DESCRIPTION` / `SITE_KEYWORDS` | Default meta tags and site-wide title |
| `SITE_URL` | Canonical URL; must match `site` in `astro.config.mjs` |
| `DISQUS_SHORTNAME` | Comment thread namespace |
| `GA_MEASUREMENT_ID` | GA4 ID (e.g. `G-XXXXXXXXXX`); leave blank to disable |
| `POSTS_PER_PAGE` | Home pagination size (default 10) |
| `NAV_LINKS` | Header nav entries |
| `SOCIAL_LINKS` | GitHub, LinkedIn, Facebook, email |

The Astro site URL lives in [`astro.config.mjs`](./astro.config.mjs) (`site: 'https://changyuhao625.github.io'`, `trailingSlash: 'always'`).

## Deployment

GitHub Actions build & deploy to GitHub Pages on every push to `master` / `main` ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)). PRs and other branches run a build-only check ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

## Credits

The original Jekyll incarnation of this blog was derived from [Hux Blog](https://github.com/Huxpro/huxpro.github.io) (itself derived from the MIT-licensed [Clean Blog Jekyll Theme](https://github.com/BlackrockDigital/startbootstrap-clean-blog-jekyll/)). The current codebase is a ground-up rewrite on Astro.

## License

Apache License 2.0 — see [LICENSE](./LICENSE).
