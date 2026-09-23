---
name: ui-design
description: Shreya Hirpathak's UI design system and interface-design rules for this portfolio. Use whenever creating or changing any page, section, component, case study, interactive widget or redesigned product interface (HMI, mobile app, dashboard) in this repo, or when asked to make something "look better", "more fun", "cleaner" or "on brand".
---

# UI design skill: Shreya's portfolio

Read this before touching markup or styles. The goal: every new piece looks like it was always part of the site: calm, cool, research-led, with one playful moment per section.

## 1. Brand tokens (source of truth: top of `assets/css/style.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#050914` | page ground (midnight navy) |
| `--bg-2` / `--surface` / `--surface-2` | `#0a1122` / `#101a30` / `#17233f` | cards, widgets, raised surfaces |
| `--text` | `#e3ecfb` | primary text |
| `--muted` / `--dim` | `#8594b3` / `#56647f` | secondary text, labels |
| `--accent` | `#7ff0ff` (ice cyan) | the ONE highlight colour: CTAs, key numbers |
| `--iris` | cyan → violet `#a99bff` gradient | sparingly: primary buttons, italic headline words |
| Project colours | `--idetc` cyan · `--godrej #ff8a3d` · `--totsecure #4d8dff` · `--calidus #2fb3c4` · `--dfam #ff5a5f` | set `--c` on a case-study `<body>`; everything project-specific uses `var(--c)` |

Never hard-code a new colour when a token exists. New tokens go in `:root`.

## 2. Type

- **Geist** (sans) for everything; **Geist Mono** for small uppercase labels (`.mono`); **Instrument Serif italic** (`.serif`) for one emphasised phrase per heading.
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
- Show original work as "Before" beneath a redesign; label redesigns honestly ("UI refresh · 2026").
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
