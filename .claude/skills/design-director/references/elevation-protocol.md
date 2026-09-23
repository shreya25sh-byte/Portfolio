# Elevation Protocol

A systematic process for turning a functional first draft into something that looks
designed. Run it in order. Each pass has an exit criterion. Don't move on until it's met.

---

## Pass 0: Brief (before building anything)

Answer these for yourself in a line each:

| Question | Why it matters |
|---|---|
| **Audience:** who looks at this? | A board skims; an analyst digs; a customer judges. Density and tone follow. |
| **Context:** where and how long? | Projected in a room, on a phone, printed, glanced at between meetings? |
| **Job:** what should they do or believe afterward? | This is the one idea. Everything serves it. |
| **Constraints:** brand, format, existing system? | Existing brand rules override your taste. Work inside them. |
| **Tone:** three adjectives | e.g. "calm, precise, confident" vs "bold, energetic, playful". These pick the direction. |

**Exit:** You can finish the sentence "This piece exists to make [audience] [do/believe X]."

---

## Pass 1: Functional build

Build the correct thing plainly.

- Real content only. If data wasn't given, invent realistic and internally consistent
  values (totals add up, trends make sense, names sound real). Never use "Lorem ipsum"
  or "Item 1".
- Establish information hierarchy in the **content** before the styling: what comes first,
  what's grouped, what's secondary, what can be cut.
- Rewrite headings so they state the point ("Churn fell to 2.1% after onboarding
  redesign") instead of labeling a category ("Churn").
- Cut. A first draft usually has 30% more content than it needs.

**Exit:** If you stripped all styling, the piece would still read in the right order and
make its point.

---

## Pass 2: Direction

Choose deliberately, and write the choices down in your head as a mini spec:

```
Exemplar(s):   e.g. Linear (restraint, dark precision) + Swiss grid
Type:          display face / body face / mono (if data)   → sizes on a ratio
Palette:       neutral ramp (5–9 steps) + 1 accent (+ semantic colors only if needed)
Grid:          columns, gutter, margins, baseline unit
Spacing scale: e.g. 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
Signature:     ONE distinctive move this piece will be remembered by
```

The **signature move** is what separates designed work from templated work. Examples:
an oversized numeral as the hero, a single hairline rule system, a monospaced data
voice, a bold color-blocked title slide, an asymmetric 5/7 split, a marginalia column.
Choose one. Two at most. See `technique-catalog.md` → "Signature moves".

Use `reference-library.md` to pick exemplars that suit the tone adjectives from Pass 0.

**Exit:** You could describe the design to another designer in two sentences and they
could sketch it.

---

## Pass 3: Systematize

Apply the spec across the whole piece, mechanically:

1. **Type.** Every text element maps to a named step on the scale (display, h1, h2, h3,
   body, small, caption, label). No one-off sizes.
2. **Color.** Every color comes from the palette. Text uses the neutral ramp: primary text
   ~90% contrast, secondary ~60%, tertiary ~45%, not pure black. The accent appears
   only where it means something.
3. **Spacing.** Every margin, padding, and gap is a scale value. Related things sit
   closer together than unrelated things (proximity carries grouping).
4. **Alignment.** Everything snaps to the grid. Pick a few alignment edges and reuse
   them. Fewer edges read as calmer.
5. **Components.** Repeated elements (cards, table rows, slide headers, KPI tiles) are
   identical in structure. Consistency makes the piece feel intentional.

**Exit:** You can't find a size, color, or spacing value that isn't from the system.

---

## Pass 4: Elevate

Now apply craft. Look at the systematized version and **name its three biggest
weaknesses** (e.g. "flat, no focal point", "the table is a wall", "the title slide is
forgettable"). For each one, pick a technique from `technique-catalog.md` under the
matching goal and apply it.

Common elevations, in rough order of impact:

1. **Scale contrast.** Make the most important thing much bigger (3–6× body size), not
   slightly bigger.
2. **Whitespace.** Double the space around the hero element. Increase outer margins.
3. **Type refinement.** Tighten tracking on large display text (−1% to −3%), use tabular
   numerals in data, set labels in small caps or uppercase with +5–8% tracking.
4. **Color discipline.** Pull everything back to neutrals, then let the accent land once.
5. **Detail layer.** Hairline rules, subtle surface layering, consistent corner radii,
   refined focus and hover states, careful number formatting.

**Exit:** Each of the three named weaknesses is fixed, and the signature move is visible
within 2 seconds of looking.

---

## Pass 5: Interrogate

Run the full checklist in `design-interrogation.md`. For each "no", fix it. Don't
rationalize it. Then do the three perception tests:

- **Squint test.** Blur your mental image (or literally look at a rendered screenshot
  zoomed out). Can you see the hierarchy? Is there one clear focal point? Are the groups
  obvious?
- **Swap test.** Could this exact layout be used for any other company or topic with
  only the text changed? If yes, it's a template. Add something specific to *this*
  content (a data-driven visual, a domain-appropriate typographic voice, a meaningful
  accent).
- **Five-second test.** After five seconds, would the viewer know the one idea from Pass 0?

If you can render the output (HTML via a browser screenshot, slides via image export),
**do it and look.** Rendered output always shows problems the code hides: overflow,
awkward wraps, orphans, contrast failures, collisions.

---

## Pass 6: Restraint

Go through every element and ask, *"If I removed this, would anything be lost?"*

- Remove decorative elements that don't carry information or direct attention.
- Remove the second accent color, the extra shadow, the redundant border, the icon that
  repeats the label.
- Remove words: shorten every heading and label you can.
- Check that the signature move still stands out once the noise is gone. It usually
  stands out more.

See `design-philosophy.md` for how to tell confident restraint from blandness.

**Exit:** Every remaining element has a reason you could state.

---

## Timeboxing

| Request size | How to run the protocol |
|---|---|
| Single chart / table / small component | Passes 0–2 in your head, Pass 3–4 light, 60-second interrogation |
| Page / dashboard / short deck (≤10 slides) | All passes, full interrogation |
| Long deck / multi-page report / site | All passes; also check consistency *across* pages/slides at the end |
| Iteration on existing work ("make it better") | Start at Pass 4: name weaknesses first, then fix |

## When the user gives feedback

Treat it like a note from a client in a critique: find the principle behind it. "It
feels cluttered" usually means too many competing focal points or too little
spacing, not just "remove one thing". Fix the principle across the whole piece, then
re-run Pass 5.
