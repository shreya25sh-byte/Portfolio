---
name: ui-design
description: Shreya Hirpathak's UI design system and interface-design rules for this portfolio. Use whenever creating or changing any page, section, component, case study, interactive widget or redesigned product interface (HMI, mobile app, dashboard) in this repo, or when asked to make something "look better", "more fun", "cleaner" or "on brand".
---

# UI design skill: Shreya's portfolio

Read this before touching markup or styles. The goal: every new piece looks like it was always part of the site: calm, cool, research-led, with one playful moment per section.

## 1. Brand tokens: "research zine" (source of truth: `:root` overrides in `assets/css/style.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` / `--bg-2` | `#eeede8` / `#f8f7f3` | newsprint ground, cards |
| `--text` / `--body-ink` / `--muted` | `#111` / `#2f2d29` / `#55534d` | ink, body copy, labels |
| `--accent` | `#ff3fa4` (riso pink) | the ONE highlight: chapter-number stroke, eyebrow tabs, key numbers |
| `--riso-yellow` | `#ffe14d` | stickers, award card, marquee, text selection |
| Project colours | `--idetc #e8308c` · `--habit #7048e8` · `--totsecure #1f5fd6` · `--dfam #d9362b` · `--calidus #0b8a78` · `--godrej #c2410c` | case pages get `<body class="case case--X">`, which sets `--c` |

Rules learned the hard way:
- Never set colours or CSS variables with inline `style=""`: the preview viewer blocks them. Use a class (`case--X`, `next--X`, `xrow--X`), or set styles from JS via `el.style` (CSSOM is fine).
- Never put white text on a background that depends on `var(--c)`; if `--c` is missing, the text disappears. Use fixed ink or pink.
- Run the contrast check after every visual change: zero WCAG failures.
- Chapter numbers are solid ink with a pink highlighter stroke; no outlined text.

## 2. Type

- **Geist** (sans) for body; **Instrument Serif** for display headlines and numbers; **Geist Mono** for small uppercase labels (`.mono`); **Instrument Serif italic** (`.serif`) for one emphasised phrase per heading.
- Pattern for headings: plain sans + one serif-italic phrase, e.g. `Research, <span class="serif">presented.</span>`
- Keep the scale restrained (headings were deliberately reduced). Use the existing clamps: `.h2`, `.chapter h2`, `.case-hero h1`. Don't invent new giant sizes.
- Body 16px, line-height 1.6, max ~66ch per line.

## 3. Layout & components (reuse before inventing)

- Page gutter: `.wrap`. Section rhythm: `.section` + `.section-head` (mono eyebrow → `.h2` → `.lede`).
- Case study skeleton: `.case-hero` (h1, sub, `.meta` Role/Timeline/Context) → `.impact` panel (headline number + 3 stats + research-method chips linking to chapters) → `.cover` → `.case-body` (sticky `.toc` + `.chapter`s).
- Evidence: `.fig` + `.fig__frame` (click-to-zoom lightbox is automatic), `.insight` cards ("Design response →"), `.tldr` trio, `.quote`.
- Interactive demos live in `.widget` (bar + body) or `.device-stage` (for product UI mockups).
- Numbers: `data-count="94"` on the element whose FIRST child is the number text; units go in a following `<i>`/`<sup>`.

## 4. Designing product interfaces (HMI, apps, dashboards)

Build them as live HTML/CSS/JS inside `.device-stage`, not static images.
- Start from the research insight each screen answers; label it in `.tapp-notes`-style callouts next to the device.
- Surface status first (what needs attention now), details second.
- Destructive or high-stakes actions get a deliberate interaction (press-and-hold with a fill, like `.apply` / `.phone__btn`).
- Use real domain units and conventions (e.g. ICH 25/60, 30/65, 40/75 for stability chambers).
- Label redesigns honestly ("UI refresh · 2026"). Drop the "Before" screenshots once the live UI covers them.
- Every control must work with keyboard (buttons, `role="switch"` + `aria-checked`, `role="tab"` + `aria-selected`).

## 5. Motion & fun (on brand, not noisy)

- One playful moment per section max: hover lift, reveal, count-up, a small game or toy.
- Existing toolkit: `.reveal`, `.split` (word reveal), `data-magnetic`, `data-cursor="Label"`, `burst()`, `confetti()`, `toast()`.
- Always respect `prefers-reduced-motion`; wrap new animations in the reduced-motion media query.
- Avoid: full-width colour floods, many competing gradients, emoji as section markers, more than one animated gradient in view.

## 6. Content honesty

- Only use figures that exist in Shreya's resume or case-study PDFs. If a number is a problem statistic (not her result), label it as such.
- Flag any drafted copy or inferred facts to Shreya in the chat summary.

## 7. Before finishing

1. `node --check assets/js/main.js`
2. Load pages at 1440px and 390px; confirm no console errors and no horizontal scroll (`scrollWidth === innerWidth`).
3. Watch for duplicate element ids across pages (e.g. a section id colliding with a widget id).
