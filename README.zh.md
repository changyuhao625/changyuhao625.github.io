# Harry Chang's Blog

[線上瀏覽 →](https://changyuhao625.github.io)

> Harry 踩過的坑與想通的事 — 涵蓋 .NET、架構、敏捷、引導等主題。

以 **Astro 5** 打造的個人 blog，部署在 GitHub Pages。內建 CJK 友善的閱讀時間與排版、深色模式、RSS、sitemap、`llms.txt`，以及 JSON-LD 結構化資料。

English version: [README.md](./README.md)

## 技術棧

- [Astro 5](https://astro.build/) — 靜態網站產生器
- [`@astrojs/mdx`](https://docs.astro.build/en/guides/integrations-guide/mdx/) — 支援 `.md` 與 `.mdx`
- [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — 自動產生 `/sitemap-index.xml`
- [`@astrojs/rss`](https://docs.astro.build/en/guides/rss/) — `/rss.xml`
- [Shiki](https://shiki.style/) 配 `github-dark` 主題做程式碼高亮
- TypeScript（`astro/tsconfigs/strict`）
- Node 20（見 `.github/workflows/*.yml`）

## 快速開始

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 產出到 dist/
npm run preview  # 預覽 dist/
```

## 專案結構

```
.
├── astro.config.mjs
├── src/
│   ├── consts.ts                # 站點標題、網址、nav、社群連結、GA id
│   ├── content.config.ts        # 文章 Collection 的 Zod schema
│   ├── content/blog/
│   │   ├── tech/yyyy/mm/dd/slug.md
│   │   └── softskill/yyyy/mm/dd/slug.md
│   ├── components/              # BaseHead、SiteHeader、TableOfContents…
│   ├── layouts/                 # BaseLayout、PostLayout
│   ├── pages/
│   │   ├── index.astro          # 首頁分頁
│   │   ├── [...slug].astro      # 單篇文章（category/yyyy/mm/dd/slug）
│   │   ├── page/[page].astro    # 分頁
│   │   ├── tags/[tag].astro     # Tag 彙整
│   │   ├── archive.astro        # 全部文章時間軸
│   │   ├── about.astro          # 內嵌 ProfilePage JSON-LD
│   │   ├── rss.xml.ts           # RSS feed
│   │   └── llms.txt.ts          # 給 AI 爬蟲讀的索引
│   ├── styles/global.css
│   └── utils/
│       ├── description.ts       # 抽 meta description（純擷取、不改寫）
│       └── reading-time.ts      # CJK 感知（中文 300 CPM / 英文 220 WPM）
├── public/                      # img、fonts、PWA manifest、sw.js、verification 檔
├── .github/workflows/
│   ├── ci.yml                   # PR / 其他分支做 build 檢查
│   └── deploy.yml               # push master/main → GitHub Pages
└── package.json
```

## 寫一篇文章

在 `src/content/blog/{category}/{yyyy}/{mm}/{dd}/{slug}.md` 建立 Markdown 檔：

```md
---
title: "[C#] 擴充方法 (Extension Methods)"
date: 2016-04-13
category: tech          # "tech" | "softskill"
tags: ["C#", "Extension Methods"]
author: "Harry Chang"   # 可省略，預設 Harry Chang
subtitle: "..."         # 可選，顯示在標題下方
description: "..."      # 可選；做為 meta / OG description 與 JSON-LD 摘要
headerImg: "/img/..."   # 可選的頁首背景圖
draft: false            # 可選；draft: true 不會被 build 出來
---

正文從這裡開始…
```

Schema 定義在 [`src/content.config.ts`](./src/content.config.ts)（Zod）。URL 直接對應檔案路徑，因此 `tech/2016/04/13/csharp-extension-methods.md` 會輸出在 `/tech/2016/04/13/csharp-extension-methods/`。

Meta / OG description 的優先順序是：frontmatter 的 `description` → `subtitle` → `<!--more-->` 之前的內容 → 第一段內文。整段邏輯都在 `src/utils/description.ts`，全部是機械式擷取，不會改寫原文。

## SEO / AEO

- 每篇文章輸出 `BlogPosting` + `BreadcrumbList` JSON-LD
- `/about/` 輸出 `ProfilePage` JSON-LD
- 完整的 Open Graph / Twitter Card meta
- Canonical URL、RSS 自動探索、淺/深色 theme-color
- `/llms.txt` — 依分類列出文章、描述與標籤，給 AI 爬蟲抓
- `/rss.xml` — 含作者、標籤與描述的完整 feed
- `/sitemap-index.xml` — 由 `@astrojs/sitemap` 產生

## 設定

編輯 [`src/consts.ts`](./src/consts.ts)：

| Key | 用途 |
| --- | --- |
| `SITE_TITLE` / `SITE_DESCRIPTION` / `SITE_KEYWORDS` | 預設 meta 與站台標題 |
| `SITE_URL` | Canonical URL，需與 `astro.config.mjs` 裡的 `site` 一致 |
| `DISQUS_SHORTNAME` | 留言板命名 |
| `GA_MEASUREMENT_ID` | GA4 ID（例如 `G-XXXXXXXXXX`），留空則關閉 |
| `POSTS_PER_PAGE` | 首頁分頁筆數（預設 10） |
| `NAV_LINKS` | 導覽列項目 |
| `SOCIAL_LINKS` | GitHub、LinkedIn、Facebook、Email |

Astro 的站點 URL 設定在 [`astro.config.mjs`](./astro.config.mjs)（`site: 'https://changyuhao625.github.io'`，`trailingSlash: 'always'`）。

## 部署

push 到 `master` / `main` 後，GitHub Actions 會自動 build 並部署到 GitHub Pages（見 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)）。PR 或其他分支則只跑 build 檢查（[`.github/workflows/ci.yml`](./.github/workflows/ci.yml)）。

## 致謝

最早的 Jekyll 版本是從 [Hux Blog](https://github.com/Huxpro/huxpro.github.io) 衍生，而 Hux Blog 又是從 MIT License 的 [Clean Blog Jekyll Theme](https://github.com/BlackrockDigital/startbootstrap-clean-blog-jekyll/) 衍生。目前這套是基於 Astro 的全新改寫。

## 授權

Apache License 2.0 — 見 [LICENSE](./LICENSE)。
