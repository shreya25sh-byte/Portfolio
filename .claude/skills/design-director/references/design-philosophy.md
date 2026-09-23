# Design Philosophy

Principles for exercising real design expertise without overdoing it. The failure modes
lie on both sides: **generic** (safe defaults, no point of view) and **overdesigned**
(every technique at once, decoration over communication). Excellent work sits between
them: bold in one place, disciplined everywhere else.

---

## 1. Communication first, always

Design is how content gets understood, not decoration on top of it. Before any
aesthetic choice, ask what it does for the reader. A beautiful slide that obscures the
point has failed. A plain slide that lands the point has partly succeeded. The goal is
both.

> Test: if a choice can't be justified in terms of the reader's understanding,
> attention, or trust, it's decoration. Decoration has to be earned.

## 2. Have a point of view

Generic output comes from making no decisions and accepting every default. Designed
output comes from decisions you could defend. Every piece should have:

- **A stance**, e.g. "Swiss rigor with one warm accent" or "dark, dense, precise".
- **A signature**: one distinctive move people would remember.
- **Specificity**: something that only makes sense for *this* content (the swap test).

Decide on purpose. When unsure between two options, pick the one with more conviction
and execute it fully. A committed, slightly unusual choice beats a timid, safe one.

## 3. Bold in one place, quiet everywhere else

Boldness only reads against calm. If everything is loud, nothing is.

- **One** hero per view. **One** accent color. **One** signature move per piece.
- Spend your boldness budget where the message peaks: the title slide, the key metric,
  the CTA, the chart that proves the argument.
- Everywhere else, be systematic, neutral, and consistent, so the bold moment lands.

> The contrast between restraint and emphasis *is* the design.

## 4. Restraint is not blandness

Restraint means removing what doesn't serve. Blandness means never adding what
would. They look similar in a thumbnail and very different up close.

| Restraint (good) | Blandness (bad) |
|---|---|
| Neutral palette + one precise accent | Gray everything, no accent, no focus |
| Few elements, each refined in detail | Few elements, each at default settings |
| Generous whitespace framing a focal point | Empty space with nothing to frame |
| One typeface used with care across weights and sizes | One typeface at one size and weight |
| Deliberate simplicity you could explain | Simplicity because nothing was tried |

After a restraint pass, check that the piece still has a point of view. If cutting left
it generic, the problem was that the signature was never strong enough.

## 5. Systems make it look crafted

"Hand-crafted" doesn't mean irregular. It means *considered*. The paradox: what makes work
feel crafted is **rigorous consistency** plus **a few deliberate exceptions**.

- Consistency (one scale, one grid, one palette, one radius) creates calm and trust.
- Deliberate exceptions (the oversized number, the element breaking the grid, the
  color-blocked divider) create interest, and they only read as intentional *because*
  everything else is consistent.
- Random variation reads as sloppy. Systematic variation reads as design.

## 6. Details are the difference

The gap between "good" and "professional" is mostly details that each seem too small
to matter:

- Tabular figures in number columns. Curly quotes. En dashes in ranges.
- Tighter tracking on big type; looser on small caps.
- Consistent radii, nested correctly. Hairline borders at low opacity.
- Chart titles that state the finding. Sources cited. Units in headers.
- Balanced headline wraps. No orphans.
- Hover and focus states. Empty states.

No single detail makes the piece. Together they're what people read as "polished"
without being able to say why.

## 7. Borrow principles, not surfaces

Reference Stripe, Linear, Apple, Swiss design, and Bauhaus for **why** they work:
their discipline, hierarchy, and restraint. Don't reproduce their look wholesale.
A dashboard that looks like a Linear clone is still derivative. One that applies
Linear's tonal layering and hairline discipline to its own content is designed.

Never imitate a real brand's identity (logo, name, proprietary typefaces, signature
illustrations) in a way that could be mistaken for their material.

## 8. Fit the context

The right design depends on where the piece lives and who it's for.

- **A board deck** wants calm authority, not a startup launch aesthetic.
- **An internal dashboard** wants density and glanceability, not marketing whitespace.
- **A portfolio** can take more expressive risks than a compliance report.
- **A spreadsheet** is a tool. Polish it for clarity and scanning, not for spectacle.
- **Brand guidelines, when provided, are law.** Your job becomes excellence *within*
  the system: better hierarchy, spacing, and detail, not overriding their choices.

Match the level of expression to the stakes and setting. Over-designing an internal
status report is as much a misread as under-designing a keynote.

## 9. Accessibility is part of craft

Contrast, legibility, and clarity aren't constraints on good design. They're part of
it. Low-contrast gray-on-gray text that "looks elegant" but can't be read is a failure.

- Body text ≥ 4.5:1 contrast; large text and UI graphics ≥ 3:1.
- Never encode meaning in color alone. Add labels, icons, or patterns.
- Minimum sizes: web body 16px; slides body 20pt+; nothing illegible in print.
- Keyboard focus visible; motion subtle and respectful of reduced-motion settings.

## 10. Show the work, not the process

The user asked for a polished result. Give them that. Keep the design thinking
internal unless they ask. When they do ask, explain decisions in terms of effect
("the revenue number is 5× body size so it's read first") rather than jargon.

If a design choice is unusual and the user might not expect it (a dark theme, an
unconventional layout), mention it in one line so they can redirect easily.

---

## The design director's mindset, in short

- Would I be proud to put my name on this?
- Does it look like someone decided every part of it?
- Is there one thing that makes it memorable, and nothing that makes it noisy?
- Does it serve the reader first and the aesthetic second, while still being beautiful?

If any answer is "not yet", it goes back for another round.
