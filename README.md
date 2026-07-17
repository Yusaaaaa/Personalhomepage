# Haowei Fan · Personal Homepage

Apple-inspired (Spatial / Liquid Glass), multilingual (EN / 中文 / 日本語) personal homepage. Static site — no build step for the shell; content indexes are generated from Markdown.

Design decisions are documented in `design-system/MASTER.md`, informed by [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (portfolio grid, monochrome + blue accent, accessibility checklist).

## Contents

| Path | Description |
|------|-------------|
| `index.html` | Page structure |
| `ai-views.html` / `writing.html` / `notes.html` | Full list pages |
| `post.html` | Single article (`?collection=&slug=`) |
| `AI_views/*.md` | AI-assisted world insights |
| `writing/*.md` | Personal essays |
| `notes/*.md` | Study notes |
| `data/*-index.json` | Generated indexes (newest first) |
| `scripts/build_content.py` | Rebuild all (or one) content index |
| `scripts/publish-content.sh` | Build index + commit + push one/all collections |
| `css/styles.css` | Design system (light / dark, glass, elevation) |
| `js/i18n.js` | EN / 中 / 日 copy + language switch |
| `js/main.js` | Theme, nav, animations, contact form UI |
| `js/writing.js` | Load lists & render Markdown posts |
| `design-system/MASTER.md` | Design tokens & UX rules |
| `HaoweiFan_CV.pdf` | Private CV reference (not linked on the public page) |

## Privacy

Public pages intentionally **omit phone numbers**. Shown: email, GitHub, LinkedIn, arXiv, WCA.

If your LinkedIn URL differs from `https://www.linkedin.com/in/haowei-fan`, edit the link in `index.html`.

Chinese display name is **樊浩玮**.

## Preview locally

**Option A — open the file**

```bash
open index.html
```

**Option B — local server** (recommended)

```bash
cd Personalhomepage
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

## Deploy (GitHub Pages)

1. Create a GitHub repository (e.g. `username.github.io` or any repo).
2. Push this folder as the site root (or put files under `/docs`).
3. **Settings → Pages → Source**: Deploy from branch `main` (root or `/docs`).
4. After a minute, open the Pages URL.

Also works on Cloudflare Pages, Netlify, or Vercel as a static site (no build command).

## Features

- Light / dark theme (remembers preference)
- EN / 中 / 日 language toggle (remembers preference; defaults from browser)
- Responsive layout, frosted navigation, scroll reveal
- Contact form UI only — submit shows a “please email me” message; use **Email directly** for `mailto:`
- **Updates**: date + note + links list in `data/updates.json` — homepage shows latest **10**; full list on `updates.html` (with “View all” when there are more than 10)
- **Three content rails** (AI / essays / notes): homepage shows latest 5 each; full list + article pages from Markdown

## Content collections

| Section (中文) | Folder | List page | Publish |
|----------------|--------|-----------|---------|
| AI辅助-对世界的洞察 | `AI_views/` | `ai-views.html` | `./scripts/publish-content.sh ai_views` |
| 随笔 | `writing/` | `writing.html` | `./scripts/publish-content.sh writing` |
| 笔记 | `notes/` | `notes.html` | `./scripts/publish-content.sh notes` |

1. Add a Markdown file under the right folder with frontmatter:

```markdown
---
title: My note
date: 2026-07-11
summary: Optional one-liner for cards
---

Body in Markdown…
```

2. Publish (rebuild index, commit that collection only, push):

```bash
./scripts/publish-content.sh ai_views
./scripts/publish-content.sh writing "writing: add essay"
./scripts/publish-content.sh notes
# all three:
./scripts/publish-content.sh
```

**动态（Updates）** 编辑 `data/updates.json`（按日期从新到旧会自动排序）。主页最多显示 10 条，更多请打开 `updates.html`。

```json
{
  "date": "2026-07-14",
  "text": "一句话事件",
  "links": [
    { "label": "arXiv:2601.00062", "href": "https://arxiv.org/abs/2601.00062" },
    { "label": "Slides", "href": "assets/talk-2601.00062.pdf" }
  ]
}
```

Local only (no push): `python3 scripts/build_content.py` then `python3 -m http.server 8080`.

Article URL shape:

```text
post.html?collection=ai_views&slug=file-stem
```

See each folder’s `README.md` for details.

## Customize later

- Avatar: add an image under `assets/` and reference it in the hero
- Real form backend: wire the form to Formspree / Getform / your API in `js/main.js`
