# Design Interrogation Checklist

Run this before delivering any visual output. Every question should get an honest
**yes**. A "no" means fix it, not explain it away. A few questions are
medium-specific. Skip the ones that don't apply.

---

## 60-second version (small outputs)

1. Is there **one** obvious focal point?
2. Is the type set on a deliberate scale with real size contrast (not 16 vs 18)?
3. Is there one accent color, used only where it means something?
4. Does every spacing value come from a scale, with groups visibly grouped?
5. Do the headings/labels state something specific instead of naming a category?
6. Would this look out of place as a generic template? (It should.)
7. Is there anything I could remove without losing meaning? (Remove it.)

---

## Full checklist

### 1. Purpose & hierarchy
- [ ] Can I state the one idea this piece communicates in a single sentence?
- [ ] Does the most important element get the most visual weight, clearly more than the next?
- [ ] Is there a clear reading order (1st, 2nd, 3rd) that matches importance?
- [ ] Does the squint test show 3–4 distinct levels of emphasis, not 1 or 10?
- [ ] Is anything competing with the focal point that should be demoted?

### 2. Typography
- [ ] Did I choose the typefaces on purpose, and can I say why they fit this tone?
- [ ] Am I using at most 2 families (+ a mono for data/code if needed)?
- [ ] Do sizes follow a ratio (e.g. 1.25 / 1.333 / 1.5) with no one-off sizes?
- [ ] Is the jump from body to top heading big enough to feel intentional (≥2×, often 3–5× for display)?
- [ ] Is weight used for hierarchy with restraint (typically 2–3 weights, not 5)?
- [ ] Is large display text tracked tighter (−1% to −3%) and line-height reduced (1.0–1.15)?
- [ ] Is body text at a comfortable line-height (1.4–1.6) and measure (45–75 characters)?
- [ ] Are small uppercase labels letter-spaced (+4% to +8%)?
- [ ] Are numbers in tables/KPIs set with tabular figures and right-aligned (or decimal-aligned)?
- [ ] No widows/orphans in headings; no single word dangling on its own line?
- [ ] Proper typographic characters: curly quotes, en dashes for ranges (2–4), em dashes, ×, real ellipsis?

### 3. Color
- [ ] Is there a neutral ramp doing most of the work (backgrounds, text, borders)?
- [ ] Is there one primary accent, and does it appear only where it carries meaning?
- [ ] Is text off-black on off-white (or the dark-mode equivalent) instead of pure #000 on #FFF?
- [ ] Do neutrals share a temperature (all warm, all cool, or truly neutral) instead of mixing?
- [ ] Does body text meet WCAG AA contrast (4.5:1; 3:1 for large text and UI graphics)?
- [ ] Are semantic colors (success/warning/error) used only for their semantic meaning?
- [ ] In charts, is color used to *highlight*, with everything else in neutral?
- [ ] Does it still work in grayscale? (Hierarchy shouldn't depend on hue alone.)
- [ ] Have I avoided the generic AI palette (purple-blue gradients, default indigo, rainbow categories)?

### 4. Layout & grid
- [ ] Is there an underlying grid, and does everything snap to it?
- [ ] Have I limited the number of distinct alignment edges?
- [ ] Is the default alignment left (with centered used deliberately, not by habit)?
- [ ] Is there asymmetry or scale variation somewhere, or is everything an equal-sized box?
- [ ] Does whitespace frame the focal point instead of just filling leftover space?
- [ ] Are outer margins generous (on slides, ≥ ~6% of width; on pages, roomy gutters)?
- [ ] Does the layout adapt cleanly (mobile widths for web; 16:9 safe area for slides; print margins for PDF)?

### 5. Spacing & rhythm
- [ ] Does every margin/padding/gap come from a single spacing scale?
- [ ] Is space *inside* a group smaller than space *between* groups (proximity)?
- [ ] Is vertical rhythm consistent: same gap between same-level sections everywhere?
- [ ] Are paddings inside components consistent across all instances?
- [ ] Does the space above a heading exceed the space below it (so it binds to its content)?

### 6. Content & copy
- [ ] Do headings state the takeaway rather than label a topic?
- [ ] Is every word necessary? Could labels be shorter?
- [ ] Are numbers formatted for humans ($4.2M, not $4,213,887.23, unless precision matters)?
- [ ] Are units, time periods, and sources stated where a skeptic would ask?
- [ ] Is placeholder or filler content completely gone?
- [ ] Is the data realistic and internally consistent (totals add up, percentages sum)?

### 7. Detail & craft
- [ ] Are corner radii consistent (one or two values, nested radii = outer − padding)?
- [ ] Are borders hairline and low-contrast, or absent, instead of heavy and gray?
- [ ] Is each element using at most *one* of: border, shadow, fill, for separation?
- [ ] Are shadows (if any) soft, layered, and consistent in light direction?
- [ ] Are icons from one family, one stroke weight, one size grid, and actually needed?
- [ ] Interactive (web): are hover, focus-visible, active, and disabled states designed?
- [ ] Interactive (web): are transitions short (150–250ms) and eased, not bouncy or slow?
- [ ] Are empty, loading, and error states considered where relevant?

### 8. Originality
- [ ] **Swap test:** would this layout fail to work for an unrelated topic? (It should be specific.)
- [ ] Is there a signature move, one distinctive decision someone would remember?
- [ ] Is at least one element derived from the content itself (a data-driven visual, a domain-appropriate metaphor, a typographic voice matching the subject)?
- [ ] Does it look like a person with a point of view made it?

### 9. Restraint
- [ ] If I remove each decorative element one at a time, does anything get worse? (If not, remove it.)
- [ ] Am I using boldness in one place instead of everywhere?
- [ ] Have I avoided stacking effects (gradient + shadow + glow + border)?
- [ ] Is there any "because I could" element (animation, texture, icon) that serves nothing?

---

## Medium-specific checks

### Presentations / decks
- [ ] One idea per slide; the slide title is that idea as a sentence.
- [ ] Readable from the back of the room: body ≥ 20pt, nothing below 14pt.
- [ ] Consistent title position and margins on every slide (titles don't jump).
- [ ] Varied layouts across the deck (not every slide = title + bullets), but from a small set of layout types.
- [ ] Clear arc: opening hook, tension/problem, resolution, specific ask/close.
- [ ] Title and section-divider slides feel designed, not like the default template.
- [ ] Bullets used only when content is truly a list; ≤ 5 per slide, ≤ ~8 words each.

### Dashboards
- [ ] Most important metric is top-left (or top, largest) and answers the primary question.
- [ ] Each panel answers one question, and its title says what the answer is.
- [ ] KPIs show context: comparison period, target, or trend, not just a naked number.
- [ ] Charts share a consistent color mapping (same metric = same color everywhere).
- [ ] Gridlines, axes, and borders are faint; data is the darkest ink on the page.
- [ ] Direct labels instead of legends where possible.
- [ ] Filters/controls are visually subordinate to the data.

### Spreadsheets
- [ ] Header row distinct (weight or subtle fill), frozen; column widths fitted.
- [ ] Numbers right-aligned, consistent decimal places, thousands separators, units in header.
- [ ] Fills used sparingly: banding is very light, highlights are reserved for exceptions.
- [ ] Inputs visually distinct from formulas (e.g. blue text for inputs, a finance convention).
- [ ] No gridline clutter: turn off gridlines and use light borders only where they help.

### Reports / PDFs / documents
- [ ] Clear typographic hierarchy for H1/H2/H3/body/caption, consistent throughout.
- [ ] Comfortable measure (60–75 characters) and generous margins.
- [ ] Running header/footer and page numbers placed with care.
- [ ] Figures and tables numbered, captioned, and referenced; aligned to the text grid.
- [ ] A strong cover / first page; an executive summary up front if it's for decision-makers.

### HTML / web artifacts
- [ ] Works at 375px width with no horizontal scroll; 16px minimum side gutter.
- [ ] Dark mode considered (if supported), with tokens and not only inverted colors.
- [ ] Semantic HTML; interactive elements are keyboard accessible with visible focus.
- [ ] Max content width set (e.g. 640–720px for prose, 1100–1280px for layouts).
- [ ] Fonts loaded properly with sensible fallbacks; no layout shift on load if avoidable.

---

## After the checklist: render and look

If you have any way to see the output (browser screenshot, slide-to-image, PDF render),
look at it. Check for: text overflow, awkward line breaks, elements colliding, contrast
problems, and whether the focal point actually reads as the focal point. Fix, re-render,
re-check.
