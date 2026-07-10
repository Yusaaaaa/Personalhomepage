# Haowei Fan · Personal Homepage

Apple-inspired (Spatial / Liquid Glass), multilingual (EN / 中文 / 日本語) personal homepage. Static site — no build step.

Design decisions are documented in `design-system/MASTER.md`, informed by [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (portfolio grid, monochrome + blue accent, accessibility checklist).

## Contents

| Path | Description |
|------|-------------|
| `index.html` | Page structure |
| `css/styles.css` | Design system (light / dark, glass, elevation) |
| `js/i18n.js` | English & Chinese copy + language switch |
| `js/main.js` | Theme, nav, animations, contact form UI |
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

## Customize later

- Avatar: add an image under `assets/` and reference it in the hero
- Real form backend: wire the form to Formspree / Getform / your API in `js/main.js`
- Blog: add a new page or migrate to a framework when needed
