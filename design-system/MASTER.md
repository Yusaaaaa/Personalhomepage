# Design System: Haowei Fan Personal Homepage

Source: **ui-ux-pro-max** design intelligence + product brief (Apple UI, public portfolio, bilingual).

## Product

| | |
|--|--|
| Type | Academic / research personal portfolio |
| Audience | Recruiters, researchers, collaborators (public web) |
| Stack | Static HTML / CSS / JS |
| Modes | Light + Dark |
| Languages | EN / 中文 |

## Style synthesis

| Layer | Choice | Why |
|-------|--------|-----|
| Brand feel | **Apple Spatial / Liquid Glass** | User request: premium Apple UI |
| Structure | **Portfolio Grid + Storytelling sections** | ui-ux-pro-max product match for portfolio |
| Visual density | **Exaggerated Minimalism (spacious)** | Variance 3 / Density 3 — large type, negative space |
| Color | **Monochrome + blue accent** | Academic portfolio palette |
| Motion | **Standard** (150–300ms micro; reveal ~400–700ms) | Respect `prefers-reduced-motion` |

### Effects (Apple glass)

- Nav: `backdrop-filter: blur(20px) saturate(180%)`
- Surfaces: elevated cards, soft borders, 4-level elevation scale
- Primary CTA: system blue `#0071e3` / dark `#2997ff`
- Avoid: neon gradients, emoji icons, corporate generic templates, harsh/fast animations

## Color tokens

| Role | Light | Dark |
|------|-------|------|
| Background | `#f5f5f7` | `#000000` |
| Elevated | `#ffffff` | `#1c1c1e` |
| Alt band | `#e8e8ed` | `#111113` |
| Text | `#1d1d1f` | `#f5f5f7` |
| Secondary text | `#6e6e73` | `#a1a1a6` |
| Accent | `#0071e3` | `#2997ff` |
| Destructive | `#ff3b30` | `#ff453a` |

Contrast target: body ≥ 4.5:1 (WCAG AA).

## Typography

Prefer **Apple system stack** for authentic SF Pro feel:

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
  "Segoe UI", "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
```

Optional academic pairing (ui-ux-pro-max): Crimson Pro + Atkinson Hyperlegible — not used by default (system fonts load faster, more “Apple”).

Scale: 12 / 13 / 14 / 15 / 17 / 19 / 22 / 32–44 section / 40–64 hero (clamp).

## Spacing

8pt rhythm: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 88 section padding.

Content max-width: ~980px. Nav shell: ~1120px.

## Interaction (pre-delivery)

- [x] SVG icons only (no emoji icons)
- [x] `cursor: pointer` on clickable controls
- [x] Hover/focus 150–300ms
- [x] Visible focus rings
- [x] Touch targets ≥ 44×44px
- [x] `prefers-reduced-motion`
- [x] Form labels + inline errors + `aria-live`
- [x] No phone numbers on public site
- [x] Responsive: 375 / 768 / 900 / 1024 / 1440

## Privacy

Do **not** publish phone numbers. Public contact: email, GitHub, LinkedIn, arXiv, WCA.

## Sections

1. Hero (name / role / CTA)  
2. About  
3. Experience  
4. Education  
5. Publications  
6. Projects (grid)  
7. Skills  
8. Teaching & Conferences  
9. Achievements  
10. Contact (email + form placeholder)  
11. Footer  
