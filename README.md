# Shreya Hirpathak · UX Research Portfolio

A static site with no build step: plain HTML, CSS and JavaScript.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish (GitHub Pages)

Settings → Pages → Source: *Deploy from a branch* → pick the branch and `/ (root)`.

## Make it yours

| What | Where |
| --- | --- |
| Email, LinkedIn, resume link | `CONFIG` at the top of `assets/js/main.js` |
| Rotating hero questions | `QUESTIONS` in `assets/js/main.js` |
| Hero photo / about photo | `assets/img/shreya-lab.webp` / `assets/img/about.webp` |
| Colours & fonts | CSS variables at the top of `assets/css/style.css` |
| Case studies | `work/*.html` |

## Structure

```
index.html            Home: hero, work (4 case studies), talks, experience, how I work, field notes, about, side quests (+ extra work), contact
work/idetc.html       01 · MSES, M.S. thesis research: thesis timeline, phase stepper, mini Likert survey
work/habit.html       02 · Innovation vs habit: muscle-memory test, NASA-TLX sliders, link to the study kit
work/totsecure.html   03 · Child-safety lock: parent data, persona, requirements table, hold-to-lock demo with renders, app UI
work/dfam.html        04 · Lattice acoustics experiment (interactive results chart)
work/calidus.html     Extra · Stability chamber: contextual inquiry, task analysis, redesigned HMI
work/godrej.html      Extra · Godrej Interio gaming-chair research (survey funnel, benchmark grid)
study/index.html      Before/after habit study kit (runs the A/B tasks and exports CSV)
assets/css/style.css  All styles
assets/js/main.js     All interactions (no dependencies)
assets/img/           Images and renders
assets/Shreya_Hirpathak_Resume.pdf
```

## Interactions

- Custom cursor that changes label on hover (View, Drag, Zoom, Next)
- "Research lens" on the hero photo that reveals colour where you look, with pinned field notes
- Typewriter "Currently asking…" research questions
- Project list with a floating image preview and category filters
- "How I work" flip cards with proof from each project
- Habit test: like 5 posts, then again after a "redesign" moves the heart
- Draggable affinity-map sticky notes with a **Cluster into themes** button
- Count-up stats, text reveals, magnetic buttons, grain overlay, scroll progress
- Press `?` anywhere for a random research question
- Respects `prefers-reduced-motion`; touch devices get simplified layouts
