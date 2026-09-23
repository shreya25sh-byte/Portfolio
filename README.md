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
| Hero / about photo | `assets/img/shreya-lab.webp` (replace with a high-res original, same name) |
| Colours & fonts | CSS variables at the top of `assets/css/style.css` |
| Case studies | `work/*.html` |

## Structure

```
index.html            Home: hero lens, work list, process, affinity board, talks, about, contact
work/veneze.html      DVT wearable: field research → 6-zone sleeve (interactive compression demo)
work/totsecure.html   Child-safety lock: parent data, persona, requirements (interactive lock demo)
work/calidus.html     Stability chamber: contextual inquiry, task analysis (interactive explorer)
work/idetc.html       MSES thesis research, conference talks (interactive phase stepper)
work/dfam.html        Lattice acoustics experiment (interactive results chart)
assets/css/style.css  All styles
assets/js/main.js     All interactions (no dependencies)
assets/img/           Images cropped from the original case-study PDFs
```

## Interactions

- Custom cursor that changes label on hover (View, Drag, Zoom, Next)
- "Research lens" on the hero photo that reveals colour where you look, with pinned field notes
- Typewriter "Currently asking…" research questions
- Project list with a floating image preview and category filters
- Scroll-driven process dial
- Draggable affinity-map sticky notes with a **Cluster into themes** button
- Count-up stats, text reveals, magnetic buttons, grain overlay, scroll progress
- Press `?` anywhere for a random research question
- Respects `prefers-reduced-motion`; touch devices get simplified layouts
