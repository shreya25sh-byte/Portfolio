# Technique Catalog

Specific visual moves, organized by **what they achieve**. Start from the problem ("this
feels flat", "nothing stands out", "the table is a wall"), find the goal below, and pick
the technique that fits. Values are starting points. Adjust them by eye after rendering.

Contents:
1. Create hierarchy & focus
2. Improve typography
3. Build color systems
4. Structure layout
5. Create rhythm & breathing room
6. Add depth & surface
7. Present data
8. Add polish & finish
9. Signature moves
10. Medium-specific moves

---

## 1. Create hierarchy & focus

**Problem: nothing stands out / everything is the same weight.**

| Technique | How | When |
|---|---|---|
| **Extreme scale contrast** | Hero number/headline at 4–8× body size (e.g. 72–120px against 16px) | KPI heroes, title slides, landing heroes |
| **Weight contrast, not size creep** | Keep sizes close but pair 600–700 headings with 400 body; demote secondary text to 400 in a lighter color | Dense UIs where size is constrained |
| **Color demotion** | Instead of making the important thing louder, make everything else quieter: secondary text at ~60% contrast, tertiary at ~45% | Busy dashboards, cluttered pages |
| **The lone accent** | Everything neutral; the accent appears in exactly one place per view, the thing that matters | Charts, slides, CTAs |
| **Isolation** | Surround the focal element with 2–3× the usual whitespace | Key quotes, headline stats, CTAs |
| **Size-ordered layout** | Break the equal grid: one large tile (2×2) + smaller supporting tiles | Dashboards, feature sections, bento layouts |
| **Eyebrow + headline + deck** | Small uppercase label (12px, +8% tracking, accent or muted) → large headline → one-line subhead in muted color | Section openers, slides, cards |

## 2. Improve typography

**Problem: text looks default / generic / hard to read.**

| Technique | How |
|---|---|
| **Modular type scale** | Choose a ratio: 1.2 (dense UI), 1.25 (general), 1.333 (editorial), 1.5+ (dramatic decks). Generate: 12, 14, 16, 20, 25, 31, 39, 49, 61… (1.25 from 16) |
| **Tight display tracking** | Headlines ≥32px: letter-spacing −0.01em to −0.03em; line-height 1.0–1.15 |
| **Open label tracking** | Uppercase labels at 11–13px: letter-spacing +0.04em to +0.08em, weight 500–600 |
| **Tabular numerals** | `font-variant-numeric: tabular-nums` for any column of numbers, KPIs that update, timers |
| **Optical measure** | Body text max-width 60–72ch; captions narrower |
| **Contrasting pairing** | Serif display + sans body (editorial warmth) or grotesk display + mono data (technical precision). Pair by contrast, not by similarity |
| **Single-family system** | One versatile family (Inter, Söhne-like grotesks, IBM Plex Sans) using weight and size only. Very Swiss, very clean |
| **Balanced headlines** | `text-wrap: balance` on headings; `text-wrap: pretty` on paragraphs to avoid orphans |
| **Hanging punctuation / quotes** | Pull quotes with the opening quote mark outdented into the margin |
| **Real typographic characters** | “Curly quotes”, ’apostrophes’, en dash for ranges (2019–2024), em dash—for breaks, × for dimensions, … |
| **Small caps / all-caps for metadata** | Dates, categories, sources: small, spaced, muted. Keeps them out of the reading path |

**Proven pairings** are in `reference-library.md` → "Type pairings".

## 3. Build color systems

**Problem: colors feel random, loud, or generic.**

| Technique | How |
|---|---|
| **Neutral ramp first** | Build 9–11 steps of one neutral (e.g. warm stone, cool slate, true gray). It does 90% of the work: bg, surfaces, borders, text tiers |
| **Tinted neutrals** | Mix 2–5% of the accent hue into grays so the palette feels unified rather than default gray |
| **One accent, one job** | Accent = "this matters / act here". Don't also use it for decoration |
| **Off-black and off-white** | Text ~#111–#1A1A1A (or neutral-900); backgrounds ~#FAFAF9 / #FBFBFA / warm #F7F5F2. Dark mode: bg ~#0B0B0C–#111113, text ~#EDEDED |
| **Muted semantic colors** | Success/warning/error desaturated to sit with the palette; use tinted backgrounds (10% alpha) + saturated text/icon |
| **Highlight-and-gray charts** | All series in neutral-300/400; the series that matters in the accent |
| **Sequential ramps from one hue** | For heatmaps/choropleths: one hue from 10% to 100% lightness steps. Never rainbow |
| **Perceptual color spaces** | Define ramps in OKLCH so steps look even: vary L in equal steps, keep C and H mostly steady |
| **Color-blocking** | A section or slide filled entirely with the accent (or a deep neutral) with reversed type: bold, memorable, used once or twice |
| **Duotone imagery** | Map photos to two palette colors so imagery sits inside the system |

**Palette recipes** are in `reference-library.md` → "Palettes".

## 4. Structure layout

**Problem: layout feels random, boxy, or template-like.**

| Technique | How |
|---|---|
| **12-column grid** | Web/dashboards: 12 cols, 24px gutters (16px mobile). Spans of 3/4/6/8 create variety within order |
| **Asymmetric split** | 5/7 or 4/8 instead of 6/6. Text narrow, visual wide (or vice versa) |
| **Strong left edge** | Headline, body, and data all hang from the same left line. The single most effective calming move |
| **Bento grid** | Mixed-size tiles on a strict grid; the largest tile holds the hero content |
| **Marginalia column** | A narrow side column for labels, notes, and metadata beside the main text (editorial / Tufte) |
| **Full-bleed breaks** | Alternate contained sections with a full-width band (image, color block, or big stat) to create pacing |
| **Overlap / break the frame** | One element deliberately crosses a boundary (image over section edge, number overlapping a card). Use once |
| **Z / F reading patterns** | Place the hero at the top-left, supporting info along the scan path, CTA at the terminal point |
| **Rule of thirds for slides** | Anchor the key element on a third-line intersection instead of dead center |
| **Content-out widths** | Size containers from content (prose 65ch, tables fit columns) instead of stretching to fill |

## 5. Create rhythm & breathing room

**Problem: cramped, or spacing feels inconsistent.**

| Technique | How |
|---|---|
| **4/8-point spacing scale** | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Nothing else |
| **Proximity grouping** | Inside group = 8–12; between groups = 24–32; between sections = 64–128 |
| **Heading binding** | Space above heading ≈ 2× space below it |
| **Generous section padding** | Web sections 96–160px vertical on desktop; it signals confidence |
| **Baseline grid** | Line-heights and vertical spacing as multiples of 4 or 8 for print-like calm |
| **Consistent component padding** | Cards: 24 or 32 all round (not 20/15/18). Buttons: height on the scale (36/40/44) |
| **Repeated structure** | Identical anatomy across repeated units (same label position, same metric position) |

## 6. Add depth & surface

**Problem: flat and lifeless, or overloaded with shadows.**

| Technique | How |
|---|---|
| **Surface layering by tone** | bg = neutral-50, card = white, inset = neutral-100. Depth from value alone, no shadows needed |
| **Hairline borders** | 1px at ~6–10% opacity of text color (`rgba(0,0,0,.08)`; dark mode `rgba(255,255,255,.08)`) |
| **Layered soft shadows** | Stack 2–3 shadows: `0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.05), 0 16px 32px rgba(0,0,0,.04)` |
| **Inner highlight** | Dark UI: `inset 0 1px 0 rgba(255,255,255,.06)` on the top edge of cards; reads as a real lit surface (Linear) |
| **Subtle grain / noise** | 2–4% opacity noise over large gradients or color fields to kill banding and add tactility |
| **Restrained gradients** | Two close hues (not complementary), or a single hue from 100% to ~85% lightness. Mesh gradients only as atmosphere behind content, never on content |
| **Glass (sparingly)** | `backdrop-filter: blur(12–20px)` + 70–80% opaque surface + hairline border. Only for overlays on rich backgrounds |
| **Choose one separator** | Per element: border *or* shadow *or* fill, not all three |

## 7. Present data

**Problem: charts and tables look default or noisy.**

| Technique | How |
|---|---|
| **Maximize data-ink** | Remove chart borders, background fills, and heavy gridlines; keep faint horizontal gridlines only if they aid reading |
| **Direct labeling** | Label lines at their end and bars at their tip; delete the legend |
| **Headline the insight** | Chart title = the conclusion ("Enterprise now 61% of revenue"); a muted subtitle gives the metric + period |
| **Annotate the moment** | A small note + thin leader line at the point that matters (launch date, anomaly) |
| **Highlight and gray** | See color section; one colored series, the rest neutral |
| **Sparklines** | Tiny inline trend lines beside KPIs, no axes: context without chrome |
| **KPI anatomy** | Label (small, muted, uppercase) → value (large, tabular) → delta (colored ▲/▼ + %, vs period) → sparkline |
| **Small multiples** | Many tiny identical charts instead of one tangled chart |
| **Right chart for the question** | Comparison → bar (sorted); change over time → line; part-to-whole → stacked bar or ≤4-slice donut; distribution → histogram; correlation → scatter |
| **Sorted bars** | Sort by value unless there's a natural order (time, stages) |
| **Table craft** | No vertical rules; light horizontal rules or zebra at 2–3% tint; right-align numbers; left-align text; header in small muted caps; row height 40–48px; units in header, not every cell |
| **Number formatting** | Abbreviate (4.2M), consistent decimals, negative in parens or minus sign (not red alone), percentages with 0–1 decimals |

For charts specifically, also load the `dataviz` skill if available.

## 8. Add polish & finish

**Problem: good but not "finished".**

| Technique | How |
|---|---|
| **Consistent radii** | Pick one (e.g. 8) plus a small one (4) and full (pill). Nested: inner = outer − padding |
| **Icon discipline** | One set (Lucide, Phosphor, Heroicons), one stroke width (1.5), one size (16/20). Remove icons that repeat the label |
| **Micro-interactions** | 150–200ms `cubic-bezier(.2,.8,.2,1)` for hover/press; subtle translate (−1px) or background shift, not scale bounces |
| **Focus rings** | 2px accent outline with 2px offset, visible only on keyboard (`:focus-visible`) |
| **Considered empty states** | A short line of copy + one action instead of a blank box |
| **Loading skeletons** | Neutral-100 shapes matching final layout rather than spinners |
| **Metadata finish** | Source lines, "Updated 3 min ago", page numbers, a tidy footer: the small things that make it feel real |
| **Selection color** | `::selection` in the accent at low alpha: a tiny detail people notice |
| **Favicons and titles** | Web: a real `<title>`, a favicon, meta description |
| **Print styles** | For reports: `@page` margins, avoid breaking inside figures/tables |

## 9. Signature moves

Pick **one** per piece (two at most). This is what makes it memorable instead of templated.

| Move | Feels like | Good for |
|---|---|---|
| **Giant numeral** | Confident, editorial | Stat-led slides, KPI heroes, annual reports |
| **Monospace data voice** | Technical, precise | Dev tools, metrics, finance, engineering reports |
| **Single hairline rule system** | Swiss, calm | Reports, dashboards, documents |
| **Color-blocked sections** | Bold, modern | Decks (section dividers), landing pages |
| **Oversized serif headline** | Editorial, premium | Reports, portfolios, narratives |
| **Numbered sections (01, 02…)** | Structured, designed | Decks, long pages, processes |
| **Marginal annotations** | Scholarly, thoughtful | Reports, analyses, case studies |
| **Dark precision UI** | Pro tool, focused | Dashboards, product mockups (Linear-style) |
| **Grain + soft gradient field** | Warm, crafted | Hero sections, covers, title slides |
| **Strict typographic poster** | Bauhaus / Swiss | Title slides, covers, event pages |
| **Custom data glyph** | Specific, memorable | A visual unit derived from the data (dots per customer, bars as blocks) |
| **Outlined / stroked display type** | Graphic, energetic | Section numbers, background words (use very sparingly) |

## 10. Medium-specific moves

### Slides
- **Assertion-evidence structure:** sentence title stating the claim + one visual proving it.
- **Layout vocabulary:** define 5–7 layouts (title, section divider, big statement, stat,
  chart + takeaway, two-column compare, image + caption) and rotate among them.
- **Section dividers as moments:** color-blocked, numbered, big type.
- **Build reveals:** show complex charts in steps to control attention.
- **Consistent anchors:** title at the same y-position, same margins, small footer with
  section name / page number in muted text.

### Dashboards
- **Top strip of 3–5 KPIs**, then one hero chart, then supporting detail.
- **Shared time scale** across charts; a single period selector.
- **Status via small indicators** (dot, delta), not whole-card color fills.
- **Card titles as questions answered**: "Where are deals stalling?" → funnel chart.

### Spreadsheets
- Title block at the top (name, description, as-of date) above the table.
- Freeze panes; set column widths deliberately; hide gridlines.
- Header: bold, bottom border, subtle neutral fill; numbers formatted with separators.
- Conditional formatting limited to one purpose (e.g. outliers only) in the accent.
- Group summary rows with a top border and bold, not heavy fills.

### Documents / PDFs
- Cover page with strong typographic composition (big title, small metadata, lots of space).
- Pull quotes and callouts in the margin or with a single accent rule.
- Consistent figure styling: same chart theme as the text's typography and palette.
