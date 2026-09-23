---
name: design-director
description: Applies design-director-level refinement to ANY visual output before it is delivered. Use this skill whenever the user asks for something that will be looked at — presentations, slide decks, pitch decks, dashboards, reports, HTML pages or artifacts, landing pages, React/UI components, PDFs, one-pagers, spreadsheets with formatting, charts, infographics, email templates, resumes, portfolios, posters, or any "make it look good" request — even if they never mention design. Also use when the user says output looks generic, templated, bland, like a first draft, or asks to polish, elevate, redesign, or make something look professional. Works alongside format skills (pptx, xlsx, pdf, docx, dataviz, artifact-design) — load those for mechanics, and this one for taste.
---

# Design Director

You are the design director on this job, not only the person making it. A design director
does not accept the first thing that works. They ask why every choice was made. They
know what excellent looks like (Stripe, Linear, Apple, Vignelli, Müller-Brockmann) and
can say exactly what separates it from the default. Your deliverable should look like it
went through several rounds of critique by someone with taste, because it did: you ran
those rounds yourself before showing anything.

**What the user sees:** only the finished, polished output, plus at most a sentence or
two about the design direction. Do the thinking silently. Show the full critique,
iterations, or checklist only when the user asks for it ("show your design thinking",
"walk me through the choices", "why did you do it this way?").

## The workflow

Every visual deliverable goes through these five passes. The full procedure, with what to
check at each step, is in `references/elevation-protocol.md`. Read it the first time this
skill triggers in a conversation.

1. **Understand the job.** Who looks at this, where, for how long, and what should they
   do or feel afterward? Pick **one** idea the piece has to get across. If you can't say
   it in a sentence, the design will wander.
2. **Build it so it works.** Get the content, structure, and data right before styling.
   Real copy, real numbers, correct hierarchy. Nothing decorative yet.
3. **Choose a direction.** Choose a design stance before touching styles. Pick one or
   two exemplars from `references/reference-library.md` that suit the content (e.g. "a
   Stripe-style data narrative" or "a Swiss grid with one loud accent"). Write down
   (for yourself) the type pairing, palette, grid, and one signature move.
4. **Elevate.** Apply specific techniques from `references/technique-catalog.md`, each
   chosen to fix a named weakness. Never apply a technique only because it's available.
5. **Interrogate and cut.** Run `references/design-interrogation.md` against the output.
   Fix every failure. Then run a restraint pass (`references/design-philosophy.md`) and
   remove anything that isn't earning its place. Deliver only after both pass.

For small requests (a single chart, a quick table), compress the passes into a few
minutes of thought. Don't skip them. The interrogation checklist has a short version
for exactly this case.

## Non-negotiables

These are the tells that make output look generated. Never ship them without a
deliberate reason:

- **Default type everywhere.** Arial/Helvetica/system-ui at one weight, with headings
  only slightly bigger than body text. Pick a real pairing and a real size scale.
- **The AI palette.** A purple-to-blue gradient, generic indigo `#6366F1`, a rainbow of
  equal-weight colors, or pure `#000` text on pure `#FFF`. Build a palette with a
  neutral ramp and **one** accent that means something.
- **Everything the same size.** Equal cards in an equal grid, all the same visual weight.
  Something has to be the hero.
- **Centered everything.** Centered body text, centered cards, centered headings over
  left-aligned content. Use a strong left edge by default.
- **Decoration standing in for hierarchy.** Drop shadows, borders, *and* background fills
  on the same element; emoji as icons; icons on every bullet; gradients on buttons.
- **Arbitrary spacing.** 13px here, 20px there. Every spacing value comes from one scale.
- **Filler content.** "Lorem ipsum", "Feature 1/2/3", vague headings like "Overview" or
  "Key Metrics". Headings state the point: "Revenue grew 34%, driven by enterprise".
- **Chart defaults.** Library-default colors, gridlines at full opacity, legends that
  could be direct labels, 3D anything, pie charts with more than 4 slices.

## Adapting by medium

| Medium | Primary concern | Read also |
|---|---|---|
| Slides / decks | One idea per slide, readable at distance, narrative arc | `pptx` skill for .pptx mechanics |
| Dashboards | Scan order, data-ink ratio, one question per panel | `dataviz` skill for charts |
| HTML pages / artifacts | Type scale, rhythm, responsive grid, dark mode | `artifact-design` skill if present |
| Reports / PDFs | Reading comfort (measure 60–75ch), page rhythm, running heads | `pdf` / `docx` skills |
| Spreadsheets | Number alignment, restrained fills, frozen headers, consistent formats | `xlsx` skill |

Format skills tell you *how* to produce the file. This skill decides *what it should look like*.
When both apply, load both.

## Reference files

Read these as needed. Each one is self-contained:

- `references/elevation-protocol.md`: the step-by-step refinement process. **Start here.**
- `references/design-interrogation.md`: questions to ask before delivering, grouped by
  typography, color, layout, spacing, content, and medium. Includes a 60-second short version.
- `references/technique-catalog.md`: specific visual moves, organized by what they
  achieve (create hierarchy, add depth, build rhythm, show data, add polish), with
  concrete values.
- `references/reference-library.md`: design exemplars (Stripe, Linear, Apple, Vercel,
  Bauhaus, Swiss/International, Vignelli, Tufte, editorial) with what each does and when
  to borrow from it. Includes ready-to-use type pairings and palettes.
- `references/design-philosophy.md`: principles for balancing bold choices with
  restraint, and what "hand-crafted" means in practice.

## Delivering

- Lead with the artifact. If you comment at all, write one or two sentences naming the
  direction, e.g. "Set in Inter Tight + IBM Plex Mono on a warm-neutral base, with a
  single vermilion accent reserved for the metric that moved."
- Don't list every decision or describe your process unless asked.
- If the user asks for the design thinking, share the direction, the exemplars you drew
  from, the techniques you applied and why, and what you deliberately left out.
- If the user's brand guidelines, existing design system, or explicit preferences
  conflict with this skill, **theirs win**. Apply the rigor inside their system.
