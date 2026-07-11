# Haowei Fan · Personal Homepage

Apple-inspired (Spatial / Liquid Glass), multilingual (EN / 中文 / 日本語) personal homepage. Static site — no build step.

Design decisions are documented in `design-system/MASTER.md`, informed by [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (portfolio grid, monochrome + blue accent, accessibility checklist).

## Contents

| Path | Description |
|------|-------------|
| `index.html` | Page structure |
| `writing.html` / `post.html` | Full notes list / single article |
| `writing/*.md` | Notes & essays (Markdown + frontmatter) |
| `data/writing-index.json` | Generated index (newest first) |
| `scripts/build_writing.py` | Rebuild writing index |
| `scripts/publish-writing.sh` | Build index + commit + push writing only |
| `css/styles.css` | Design system (light / dark, glass, elevation) |
| `js/i18n.js` | EN / 中 / 日 copy + language switch |
| `js/main.js` | Theme, nav, animations, contact form UI |
| `js/writing.js` | Load notes list & render Markdown posts |
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
- **Writing**: homepage shows latest 5 notes; full list + article pages; content from `writing/*.md`

## Writing / notes

1. Add a Markdown file under `writing/` with frontmatter:

```markdown
---
title: My note
date: 2026-07-11
summary: Optional one-liner for cards
---

Body in Markdown…
```

2. Publish (rebuild index, commit writing files only, push):

```bash
./scripts/publish-writing.sh
# or:
./scripts/publish-writing.sh "writing: add note on markets"
```

Local only (no push): `python3 scripts/build_writing.py` then `python3 -m http.server 8080`.

See `writing/README.md` for details.

## Customize later

- Avatar: add an image under `assets/` and reference it in the hero
- Real form backend: wire the form to Formspree / Getform / your API in `js/main.js`
