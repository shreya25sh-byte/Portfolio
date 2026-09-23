/* Shreya Hirpathak — portfolio interactions (no dependencies) */

// ---- Edit these to your real links ------------------------------------
const CONFIG = {
  email: "hello@shreyahirpathak.com", // TODO: replace with your email
  linkedin: "https://www.linkedin.com/", // TODO: replace with your LinkedIn URL
  resume: "#", // TODO: link to your resume PDF, e.g. "assets/Shreya_Hirpathak_Resume.pdf"
};
// ------------------------------------------------------------------------

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- Config wiring ---------- */
$$("[data-email]").forEach((a) => {
  a.href = `mailto:${CONFIG.email}`;
  if (a.dataset.email === "text") a.textContent = CONFIG.email;
});
$$("[data-linkedin]").forEach((a) => (a.href = CONFIG.linkedin));
$$("[data-resume]").forEach((a) => (a.href = CONFIG.resume));

/* ---------- Toast ---------- */
const toast = (() => {
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  document.body.appendChild(el);
  let t;
  return (msg) => {
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(t);
    t = setTimeout(() => el.classList.remove("is-on"), 2600);
  };
})();

$$("[data-copy-email]").forEach((b) =>
  b.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      toast("Email copied. Talk soon ✳");
    } catch {
      window.location.href = `mailto:${CONFIG.email}`;
    }
  })
);

/* ---------- Loader (home, once per session) ---------- */
const loader = $(".loader");
if (loader) {
  let seen = false;
  try { seen = sessionStorage.getItem("sh-loaded") === "1"; } catch {}
  if (seen || reduced) {
    loader.remove();
    document.documentElement.classList.add("is-loaded");
  } else {
    const num = $(".loader__count", loader);
    const bar = $(".loader__bar i", loader);
    const target = 1910;
    const dur = 1400;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(e * target).toLocaleString();
      bar.style.transform = `scaleX(${e})`;
      if (p < 1) requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          loader.classList.add("is-done");
          document.documentElement.classList.add("is-loaded");
          try { sessionStorage.setItem("sh-loaded", "1"); } catch {}
          setTimeout(() => loader.remove(), 1000);
        }, 250);
      }
    };
    requestAnimationFrame(tick);
  }
} else {
  document.documentElement.classList.add("is-loaded");
}

/* ---------- Nav ---------- */
const nav = $(".nav");
if (nav) {
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 20);
    nav.classList.toggle("is-hidden", y > lastY && y > 400 && !nav.classList.contains("is-open"));
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const toggle = $(".nav__toggle", nav);
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$(".nav__links a", nav).forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );
}

/* ---------- Scroll progress ---------- */
const progress = $(".progress");
if (progress) {
  const upd = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener("scroll", upd, { passive: true });
  upd();
}

/* ---------- Custom cursor ---------- */
if (finePointer && !reduced) {
  const ring = document.createElement("div");
  ring.className = "cursor";
  ring.innerHTML = "<span></span>";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.append(ring, dot);
  document.body.classList.add("has-cursor");
  const label = $("span", ring);
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });
  const loop = () => {
    rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("[data-cursor], a, button, input");
    ring.classList.remove("is-link", "is-label");
    if (!t) return;
    if (t.dataset.cursor) {
      label.textContent = t.dataset.cursor;
      ring.classList.add("is-label");
    } else ring.classList.add("is-link");
  });
  document.addEventListener("pointerleave", () => { ring.classList.add("is-hidden"); dot.classList.add("is-hidden"); });
  document.addEventListener("pointerenter", () => { ring.classList.remove("is-hidden"); dot.classList.remove("is-hidden"); });
}

/* ---------- Split text + reveal ---------- */
$$(".split").forEach((el) => {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
          const o = document.createElement("span");
          o.className = "word";
          const i = document.createElement("span");
          i.textContent = w;
          o.appendChild(i);
          frag.appendChild(o);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
  $$(".word > span", el).forEach((s, i) => (s.style.transitionDelay = `${i * 45}ms`));
});

const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        e.target.dispatchEvent(new CustomEvent("reveal"));
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
const startReveals = () => $$(".reveal, .split, .cover, [data-count], [data-animate]").forEach((el) => io.observe(el));
if (document.documentElement.classList.contains("is-loaded") || !loader) startReveals();
else {
  const mo = new MutationObserver(() => {
    if (document.documentElement.classList.contains("is-loaded")) { mo.disconnect(); startReveals(); }
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
}

/* ---------- Count up ---------- */
$$("[data-count]").forEach((el) =>
  el.addEventListener("reveal", () => {
    const end = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split(".")[1] || "").length;
    const fmt = (v) => v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduced) { el.firstChild.textContent = fmt(end); return; }
    const t0 = performance.now(), d = 1600;
    const f = (t) => {
      const p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 4);
      el.firstChild.textContent = fmt(e * end);
      if (p < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  })
);

/* ---------- Magnetic buttons ---------- */
if (finePointer && !reduced) {
  $$("[data-magnetic]").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      b.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    b.addEventListener("pointerleave", () => {
      b.style.transition = "transform .6s cubic-bezier(.22,1,.36,1), background .25s, color .25s, border-color .25s";
      b.style.transform = "";
      setTimeout(() => (b.style.transition = ""), 600);
    });
  });
}

/* ---------- Hero: rotating questions ---------- */
const QUESTIONS = [
  "why do technicians dread the HMI screen?",
  "what makes a parent trust a lock they can't see?",
  "who feels like they belong in a makerspace?",
  "can a lattice make a room quieter?",
  "why don't people who game own gaming chairs?",
  "what would you do if this button didn't exist?",
  "what happened the last time that went wrong?",
];
const askEl = $(".hero__ask-q");
if (askEl) {
  let qi = 0;
  const type = async () => {
    const q = QUESTIONS[qi % QUESTIONS.length];
    if (reduced) { askEl.textContent = q; qi++; setTimeout(type, 3800); return; }
    for (let i = 0; i <= q.length; i++) { askEl.textContent = q.slice(0, i); await new Promise((r) => setTimeout(r, 26)); }
    await new Promise((r) => setTimeout(r, 2400));
    for (let i = q.length; i >= 0; i -= 2) { askEl.textContent = q.slice(0, i); await new Promise((r) => setTimeout(r, 12)); }
    qi++;
    type();
  };
  type();
}

/* ---------- Hero: research lens ---------- */
const lens = $(".lens");
if (lens) {
  const color = $(".lens__color", lens);
  const ring = $(".lens__ring", lens);
  let tx = 0, ty = 0, cx = 0, cy = 0, tr = 0, cr = 0, raf;
  const R = () => Math.max(70, lens.clientWidth * 0.2);
  const set = () => {
    cx = lerp(cx, tx, 0.2); cy = lerp(cy, ty, 0.2); cr = lerp(cr, tr, 0.15);
    color.style.setProperty("--x", `${cx}px`);
    color.style.setProperty("--y", `${cy}px`);
    color.style.setProperty("--r", `${cr}px`);
    ring.style.left = `${cx}px`; ring.style.top = `${cy}px`;
    ring.style.width = ring.style.height = `${cr * 2}px`;
    if (Math.abs(cr - tr) > 0.5 || Math.abs(cx - tx) > 0.5 || Math.abs(cy - ty) > 0.5) raf = requestAnimationFrame(set);
    else raf = null;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(set); };
  const move = (e) => {
    const r = lens.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
    if (!tr) { cx = tx; cy = ty; }
    tr = R();
    lens.classList.add("is-active");
    kick();
  };
  lens.addEventListener("pointermove", move);
  lens.addEventListener("pointerdown", move);
  lens.addEventListener("pointerleave", () => { tr = 0; lens.classList.remove("is-active"); kick(); });
  // idle demo sweep so people understand it
  if (!reduced) {
    setTimeout(() => {
      if (lens.classList.contains("is-active")) return;
      const w = lens.clientWidth, h = lens.clientHeight;
      tx = cx = w * 0.45; ty = cy = h * 0.42; tr = R(); kick();
      setTimeout(() => { if (!lens.matches(":hover")) { tr = 0; kick(); } }, 1600);
    }, 2600);
  }
}
$$(".note-pin button").forEach((b) =>
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    const pin = b.parentElement;
    const open = !pin.classList.contains("is-open");
    $$(".note-pin").forEach((p) => p.classList.remove("is-open"));
    pin.classList.toggle("is-open", open);
    b.setAttribute("aria-expanded", open);
  })
);
document.addEventListener("click", () => $$(".note-pin.is-open").forEach((p) => p.classList.remove("is-open")));

/* ---------- Work list: filter + hover preview ---------- */
$$(".filters .chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    $$(".filters .chip").forEach((c) => c.setAttribute("aria-pressed", c === chip));
    const f = chip.dataset.filter;
    $$(".work__item").forEach((it) => it.classList.toggle("is-dim", f !== "all" && !it.dataset.tags.split(" ").includes(f)));
  })
);
const preview = $(".work-preview");
if (preview && finePointer) {
  let px = 0, py = 0, cx = 0, cy = 0;
  const imgs = {};
  $$(".work__item").forEach((it) => {
    const img = document.createElement("img");
    img.src = it.dataset.img; img.alt = "";
    preview.appendChild(img);
    imgs[it.dataset.id] = img;
    const link = $(".work__link", it);
    link.style.setProperty("--c", `var(--${it.dataset.id})`);
    link.addEventListener("pointerenter", () => {
      if (it.classList.contains("is-dim")) return;
      Object.values(imgs).forEach((i) => i.classList.remove("is-on"));
      img.classList.add("is-on");
      preview.classList.add("is-on");
    });
    link.addEventListener("pointerleave", () => preview.classList.remove("is-on"));
  });
  addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; });
  const loop = () => {
    cx = lerp(cx, px, 0.12); cy = lerp(cy, py, 0.12);
    const rot = Math.max(-8, Math.min(8, (px - cx) * 0.08));
    preview.style.transform = `translate(${cx + 30}px, ${cy - 140}px) rotate(${rot}deg) scale(${preview.classList.contains("is-on") ? 1 : 0.85})`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* ---------- Process dial ---------- */
const steps = $$(".process__step");
if (steps.length) {
  const arc = $(".process__dial .arc");
  const num = $(".process__dial-label b");
  const name = $(".process__dial-label span");
  const C = 2 * Math.PI * 140;
  if (arc) { arc.style.strokeDasharray = C; arc.style.strokeDashoffset = C; }
  const sio = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = steps.indexOf(e.target);
        steps.forEach((s, j) => s.classList.toggle("is-active", j === i));
        if (arc) arc.style.strokeDashoffset = C * (1 - (i + 1) / steps.length);
        if (num) num.textContent = `0${i + 1}`;
        if (name) name.textContent = e.target.dataset.name;
      }),
    { rootMargin: "-45% 0px -45% 0px" }
  );
  steps.forEach((s) => sio.observe(s));
}

/* ---------- Affinity board ---------- */
const board = $(".board");
if (board) {
  const notes = $$(".sticky", board);
  const labels = $$(".cluster-label", board);
  const isDesktop = () => innerWidth > 820;
  let z = 10;

  const scatter = () => {
    if (!isDesktop()) return;
    board.classList.remove("is-clustered");
    const W = board.clientWidth - 200, H = board.clientHeight - 150;
    notes.forEach((n, i) => {
      const col = i % 5, row = Math.floor(i / 5);
      const x = (col / 4) * W * 0.92 + Math.random() * 40;
      const y = row * (H / 2.1) + 20 + Math.random() * 60;
      n.style.left = `${Math.max(8, Math.min(W, x))}px`;
      n.style.top = `${Math.max(8, Math.min(H, y))}px`;
      n.style.transform = `rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;
    });
  };

  const cluster = () => {
    if (!isDesktop()) return;
    board.classList.add("is-clustered");
    const groups = {};
    notes.forEach((n) => (groups[n.dataset.theme] ||= []).push(n));
    const keys = labels.map((l) => l.dataset.theme);
    const colW = board.clientWidth / keys.length;
    keys.forEach((k, ci) => {
      const lab = labels[ci];
      lab.style.left = `${ci * colW + 16}px`;
      lab.style.top = "18px";
      lab.style.width = `${colW - 32}px`;
      (groups[k] || []).forEach((n, ri) => {
        n.style.left = `${ci * colW + (colW - 190) / 2 + ri * 6}px`;
        n.style.top = `${60 + ri * 118}px`;
        n.style.transform = `rotate(${(ri % 2 ? 1.5 : -1.5)}deg)`;
        n.style.zIndex = ++z;
      });
    });
  };

  // drag
  notes.forEach((n) => {
    n.setAttribute("data-cursor", "Drag");
    let sx, sy, ox, oy, id;
    n.addEventListener("pointerdown", (e) => {
      if (!isDesktop()) return;
      id = e.pointerId;
      n.setPointerCapture(id);
      n.classList.add("is-dragging");
      n.style.zIndex = ++z;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(n.style.left) || 0; oy = parseFloat(n.style.top) || 0;
      n.style.transform = "rotate(0deg) scale(1.05)";
    });
    n.addEventListener("pointermove", (e) => {
      if (e.pointerId !== id || !n.classList.contains("is-dragging")) return;
      const maxX = board.clientWidth - n.offsetWidth, maxY = board.clientHeight - n.offsetHeight;
      n.style.left = `${Math.max(0, Math.min(maxX, ox + e.clientX - sx))}px`;
      n.style.top = `${Math.max(0, Math.min(maxY, oy + e.clientY - sy))}px`;
    });
    const end = () => {
      if (!n.classList.contains("is-dragging")) return;
      n.classList.remove("is-dragging");
      n.style.transform = `rotate(${(Math.random() * 6 - 3).toFixed(1)}deg)`;
      id = null;
    };
    n.addEventListener("pointerup", end);
    n.addEventListener("pointercancel", end);
  });

  $("[data-board='cluster']")?.addEventListener("click", cluster);
  $("[data-board='scatter']")?.addEventListener("click", scatter);
  scatter();
  let rt;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => (board.classList.contains("is-clustered") ? cluster() : scatter()), 200);
  });
}

/* ---------- Local clock ---------- */
$$("[data-clock]").forEach((el) => {
  const upd = () =>
    (el.textContent = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", minute: "2-digit", timeZone: "America/New_York", hour12: true,
    }).format(new Date()) + " ET");
  upd();
  setInterval(upd, 30000);
});
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- Easter egg: press ? ---------- */
addEventListener("keydown", (e) => {
  if (e.key === "?" && !/input|textarea/i.test(document.activeElement.tagName)) {
    toast("Q: " + QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
  }
});

/* ==========================================================================
   Case study
   ========================================================================== */

/* TOC active state */
const tocLinks = $$(".toc a");
if (tocLinks.length) {
  const map = new Map(tocLinks.map((a) => [a.getAttribute("href").slice(1), a]));
  const tio = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove("is-active"));
          map.get(e.target.id)?.classList.add("is-active");
        }
      }),
    { rootMargin: "-30% 0px -60% 0px" }
  );
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) tio.observe(s); });
}

/* Lightbox */
const figs = $$(".fig__frame");
if (figs.length) {
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Image preview");
  lb.innerHTML = '<img alt=""><p></p><button aria-label="Close">✕</button>';
  document.body.appendChild(lb);
  let last;
  const close = () => { lb.classList.remove("is-on"); last?.focus(); };
  figs.forEach((f) => {
    f.setAttribute("tabindex", "0");
    f.setAttribute("role", "button");
    f.setAttribute("data-cursor", "Zoom");
    const img = $("img", f);
    f.setAttribute("aria-label", `Enlarge: ${img.alt}`);
    const open = () => {
      last = f;
      $("img", lb).src = img.currentSrc || img.src;
      $("img", lb).alt = img.alt;
      $("p", lb).textContent = f.closest("figure")?.querySelector("figcaption")?.textContent.trim() || img.alt;
      lb.classList.add("is-on");
      $("button", lb).focus();
    };
    f.addEventListener("click", open);
    f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  lb.addEventListener("click", close);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && lb.classList.contains("is-on")) close(); });
}

/* DFAM: acoustic chart */
const chart = $("#spl-chart");
if (chart) {
  const DATA = [
    ["Hexagonal Honeycomb", 58.3, [62, 50, 63]],
    ["Body-Centered Cubic", 59.7, [60, 59, 60]],
    ["Fluorite", 64.4, [64, 64, 65]],
    ["Diamond", 65.7, [65, 65, 67]],
    ["Face-Centered Cubic", 68.0, [69, 68, 70]],
    ["IsoTruss", 73.0, [71, 70, 73]],
  ];
  const BASE = 69.7, MIN = 50, MAX = 76;
  const zone = document.createElement("div");
  zone.className = "chart__refzone";
  const ref = document.createElement("div");
  ref.className = "chart__ref";
  ref.innerHTML = "<span>No lattice · 69.7 dB</span>";
  zone.appendChild(ref);
  const rows = DATA.map(([name, avg, reads]) => {
    const r = document.createElement("div");
    r.className = "bar-row " + (avg < BASE ? "is-good" : "is-bad");
    r.innerHTML = `<span class="bar-row__label">${name}</span><div class="bar-row__track" title="Readings: ${reads.join(", ")} dB"><div class="bar-row__fill"></div></div><span class="bar-row__val"></span>`;
    chart.appendChild(r);
    return { r, avg };
  });
  chart.appendChild(zone);
  let mode = "abs";
  const draw = (animate = true) => {
    rows.forEach(({ r, avg }) => {
      const fill = $(".bar-row__fill", r), val = $(".bar-row__val", r);
      if (mode === "abs") {
        fill.style.left = "0%";
        fill.style.width = animate ? `${((avg - MIN) / (MAX - MIN)) * 100}%` : "0%";
        val.textContent = `${avg.toFixed(1)} dB`;
      } else {
        const d = avg - BASE;
        const basePct = ((BASE - MIN) / (MAX - MIN)) * 100;
        const w = (Math.abs(d) / (MAX - MIN)) * 100;
        fill.style.left = `${d < 0 ? basePct - w : basePct}%`;
        fill.style.width = `${w}%`;
        val.textContent = `${d > 0 ? "+" : ""}${d.toFixed(1)} dB`;
      }
    });
    ref.style.left = `${((BASE - MIN) / (MAX - MIN)) * 100}%`;
  };
  draw(false);
  chart.addEventListener("reveal", () => draw(true));
  $$("[data-chart-mode]").forEach((b) =>
    b.addEventListener("click", () => {
      mode = b.dataset.chartMode;
      $$("[data-chart-mode]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      draw(true);
    })
  );
}

/* Calidus: task analysis explorer */
const explorer = $("#task-explorer");
if (explorer) {
  const TASKS = {
    "Switch on": {
      "Physical load": "Physical effort to flip the switch — the same effort again for shutdown.",
      "Cognitive load": "Simple action, minimal mental effort, but a shutdown procedure has to be followed.",
      "Emotional level": "Routine, familiar task.",
      "Possible error": "Misaligned power switch → delay in starting experiments, loss of data or experiment integrity.",
      "Root cause": "Lack of clear labeling; inadequate shutdown instructions.",
    },
    "Load samples": {
      "Physical load": "Placing containers in designated areas, possibly lifting equipment.",
      "Cognitive load": "Basic organization skills.",
      "Emotional level": "Double-checking placement to make sure there's no mistake.",
      "Possible error": "Misplacement or incorrect arrangement → potential degradation of stored medicines.",
      "Root cause": "Lack of proper organization; insufficient training on equipment usage.",
    },
    "Set up": {
      "Physical load": "Requires manual adjustments on the panel.",
      "Cognitive load": "Concentrating on temperature / humidity settings and intervals.",
      "Emotional level": "Pressure to understand exactly which setting the experiment needs — and be precise.",
      "Possible error": "Incorrect temperature/humidity; a confusing HMI → compromised experiment integrity.",
      "Root cause": "Lack of attention to detail, amplified by an unclear interface.",
    },
    "Observe": {
      "Physical load": "Regularly checking displays or gauges for readings.",
      "Cognitive load": "Tracking progress even when it isn't easily visible.",
      "Emotional level": "Constantly conscious — watching for small changes and tweaks.",
      "Possible error": "Failing to record data accurately or to notice fluctuations → misinterpreted results.",
      "Root cause": "Lack of proper monitoring protocols.",
    },
    "Retrieve": {
      "Possible error": "Difficulty locating specific medicines.",
      "Impact": "Delay in retrieval.",
      "Root cause": "Inadequate labeling or storage system.",
    },
  };
  const tabs = $(".tabs", explorer.closest(".widget"));
  const render = (k) => {
    explorer.innerHTML = Object.entries(TASKS[k])
      .map(([h, p]) => `<div class="${/error|root|impact/i.test(h) ? "is-risk" : ""}"><h5>${h}</h5><p>${p}</p></div>`)
      .join("");
  };
  Object.keys(TASKS).forEach((k, i) => {
    const b = document.createElement("button");
    b.textContent = k;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", i === 0);
    b.addEventListener("click", () => {
      $$("button", tabs).forEach((x) => x.setAttribute("aria-selected", x === b));
      render(k);
    });
    tabs.appendChild(b);
  });
  render(Object.keys(TASKS)[0]);
}

/* IDETC: research phases stepper */
const stepper = $("#phase-stepper");
if (stepper) {
  const PHASES = [
    ["Survey & segment", "Survey 1,910 students & collect demographic data", "Designed and administered a two-round survey to 1,910 first-year engineering students to collect baseline self-efficacy data alongside demographic information — gender, first-generation status and race/ethnicity."],
    ["Build the MSES", "Existing scales fall short — so I built one", "SEED, EMSE, ISE and CESES were designed for broad engineering contexts and miss the process of making. I developed the Makerspace Self-Efficacy Scale (MSES) to capture the full breadth of skills in a making project."],
    ["Validate", "Validate the MSES", "Confirmatory Factor Analysis (CFA) on 1,190+ responses across two independent student cohorts validated 16 of the 17 items (94%) and confirmed a stable four-domain structure."],
    ["Pre / post", "Collect pre & post self-efficacy data", "A second round captured student self-efficacy before and after the cornerstone makerspace project, enabling direct measurement of change in each domain."],
    ["Correlate", "Connect confidence to background", "Item response theory (IRT) isolated 2 background factors that call for system-level improvement, not individual fixes: the kind of finding that changes how a space is designed."],
  ];
  const panel = $(".stepper-panel");
  PHASES.forEach(([short, title, body], i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", i === 0);
    b.innerHTML = `<b>PHASE 0${i + 1}</b><span>${short}</span>`;
    b.addEventListener("click", () => {
      $$("button", stepper).forEach((x) => x.setAttribute("aria-selected", x === b));
      panel.innerHTML = `<h4>${title}</h4><p>${body}</p>`;
      panel.animate?.([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: "ease-out" });
    });
    stepper.appendChild(b);
  });
  panel.innerHTML = `<h4>${PHASES[0][1]}</h4><p>${PHASES[0][2]}</p>`;
}

/* Totsecure: lock demo */
const lockdemo = $("#lockdemo");
if (lockdemo) {
  const phone = $(".phone", lockdemo);
  const btn = $(".phone__btn", lockdemo);
  const hint = $(".phone__hint", lockdemo);
  const log = $(".lockdemo__log", lockdemo);
  const ringC = $(".ring circle", lockdemo);
  const ICON_LOCK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 9V7A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3ZM9 7a3 3 0 0 1 6 0v2H9Zm4 9.73V18a1 1 0 0 1-2 0v-1.27a2 2 0 1 1 2 0Z"/></svg>';
  const ICON_UNLOCK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 9H9V7a3 3 0 0 1 5.83-1 1 1 0 1 0 1.88-.66A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3Zm-4 7.73V18a1 1 0 0 1-2 0v-1.27a2 2 0 1 1 2 0Z"/></svg>';
  let locked = true, raf, t0;
  const HOLD = 700;
  const icon = $(".phone__icon", lockdemo);
  const addLog = (m) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const s = document.createElement("span");
    s.textContent = `${time}  ${m}`;
    log.prepend(s);
    while (log.children.length > 4) log.lastChild.remove();
  };
  const setState = (l) => {
    locked = l;
    icon.innerHTML = l ? ICON_LOCK : ICON_UNLOCK;
    phone.classList.toggle("is-unlocked", !l);
    lockdemo.classList.toggle("is-unlocked", !l);
    lockdemo.classList.remove("is-open");
    hint.textContent = l ? "Hold to disable child lock" : "Hold to enable child lock";
    btn.setAttribute("aria-label", hint.textContent);
    addLog(l ? "child lock ENABLED · latch engaged" : "child lock DISABLED · adult can open");
    if (!l) setTimeout(() => lockdemo.classList.contains("is-unlocked") && lockdemo.classList.add("is-open"), 700);
  };
  const C = 402;
  const start = (e) => {
    e.preventDefault();
    t0 = performance.now();
    const f = (t) => {
      const p = Math.min(1, (t - t0) / HOLD);
      ringC.style.strokeDashoffset = C * (1 - p);
      if (p < 1) raf = requestAnimationFrame(f);
      else { ringC.style.strokeDashoffset = C; setState(!locked); }
    };
    raf = requestAnimationFrame(f);
  };
  const cancel = () => { cancelAnimationFrame(raf); ringC.style.strokeDashoffset = C; };
  btn.addEventListener("pointerdown", start);
  btn.addEventListener("pointerup", cancel);
  btn.addEventListener("pointerleave", cancel);
  btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setState(!locked); } });
  icon.innerHTML = ICON_LOCK;
  addLog("device connected · battery OK");
}

/* Totsecure: donuts + bars */
$$(".donut").forEach((d) =>
  d.addEventListener("reveal", () => {
    const v = parseFloat(d.dataset.value);
    $(".fg", d).style.strokeDashoffset = 289 * (1 - v / 100);
  })
);
$$(".hbars").forEach((h) =>
  h.addEventListener("reveal", () => $$(".hbar", h).forEach((b, i) => setTimeout(() => ($("i", b).style.width = `${b.dataset.value}%`), i * 80)))
);

/* Veneze: sequential compression demo */
const compress = $("#compress");
if (compress) {
  const bands = $$(".seg-band", compress).reverse(); // ankle → thigh
  const leg = $(".leg", compress);
  const playBtn = $("[data-compress='play']", compress);
  const speed = $("#c-speed", compress), inten = $("#c-int", compress);
  const speedOut = $("#c-speed-out", compress), intOut = $("#c-int-out", compress);
  let playing = false, timer, idx = 0;
  const tick = () => {
    bands.forEach((b, i) => b.classList.toggle("is-on", i <= idx));
    const k = 0.88 - (inten.value - 1) * 0.03;
    bands.forEach((b, i) => (b.style.transform = i <= idx ? `scaleX(${k})` : ""));
    idx = (idx + 1) % (bands.length + 1);
    if (idx === 0) bands.forEach((b) => { b.classList.remove("is-on"); b.style.transform = ""; });
    timer = setTimeout(tick, 900 - speed.value * 120);
  };
  const toggle = () => {
    playing = !playing;
    leg.classList.toggle("is-playing", playing);
    playBtn.textContent = playing ? "Pause cycle" : "Run compression cycle";
    playBtn.setAttribute("aria-pressed", playing);
    if (playing) tick();
    else { clearTimeout(timer); }
  };
  playBtn.addEventListener("click", toggle);
  const out = () => {
    speedOut.textContent = ["", "Gentle", "Slow", "Steady", "Brisk", "Fast"][speed.value];
    intOut.textContent = `Level ${inten.value}`;
  };
  speed.addEventListener("input", out);
  inten.addEventListener("input", out);
  out();
}

/* ==========================================================================
   v2: fun layer
   ========================================================================== */

/* Hero letters lean toward the cursor */
const heroTitle = $(".hero__title");
if (heroTitle && finePointer && !reduced) {
  $$(".word > span", heroTitle).forEach((w) => {
    const txt = w.textContent;
    w.textContent = "";
    [...txt].forEach((c) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      w.appendChild(s);
    });
  });
  const chars = $$(".ch", heroTitle);
  let raf;
  heroTitle.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      chars.forEach((c) => {
        const r = c.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy), k = Math.max(0, 1 - d / 160);
        c.style.transform = k ? `translate(${(-dx / d) * k * 10 || 0}px, ${-k * 14}px) rotate(${(dx / 160) * k * -12}deg)` : "";
        c.style.color = k > 0.55 ? "var(--accent)" : "";
      });
    });
  });
  heroTitle.addEventListener("pointerleave", () => chars.forEach((c) => { c.style.transform = ""; c.style.color = ""; }));
}

/* Click bursts of research glyphs */
const GLYPHS = ["?", "!", "why?", "how?", "✳", "?", "who?"];
const burst = (x, y, n = 9) => {
  if (reduced) return;
  for (let i = 0; i < n; i++) {
    const g = document.createElement("span");
    g.className = "burst";
    g.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    document.body.appendChild(g);
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.6, v = 70 + Math.random() * 90;
    g.animate(
      [
        { transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(.4)`, opacity: 1 },
        { transform: `translate(${x + Math.cos(a) * v}px, ${y + Math.sin(a) * v - 30}px) translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 60}deg) scale(1)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.22,1,.36,1)" }
    ).onfinish = () => g.remove();
  }
};
const STAMPS = ["WHY?", "HOW?", "SO WHAT?", "WHO?", "TELL ME MORE", "VALIDATED ✓", "ASK AGAIN"];
$$(".hero, .contact").forEach((sec) =>
  sec.addEventListener("click", (e) => {
    if (e.target.closest("a, button, .lens, input, .stamp-spin")) return;
    const r = sec.getBoundingClientRect();
    const st = document.createElement("span");
    st.className = "inkstamp" + (Math.random() < 0.35 ? " b" : "");
    st.textContent = STAMPS[Math.floor(Math.random() * STAMPS.length)];
    st.style.left = `${e.clientX - r.left}px`;
    st.style.top = `${e.clientY - r.top}px`;
    sec.appendChild(st);
    const rot = (Math.random() * 30 - 15).toFixed(1);
    st.animate(
      [{ transform: `translate(-50%,-50%) rotate(${rot}deg) scale(1.8)`, opacity: 0 },
       { transform: `translate(-50%,-50%) rotate(${rot}deg) scale(.95)`, opacity: .9, offset: .25 },
       { transform: `translate(-50%,-50%) rotate(${rot}deg) scale(1)`, opacity: .9, offset: .85 },
       { transform: `translate(-50%,-50%) rotate(${rot}deg) scale(1)`, opacity: 0 }],
      { duration: reduced ? 1500 : 3200, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
    ).onfinish = () => st.remove();
  })
);
$$(".stamp-spin").forEach((sp) => {
  const go = (e) => { e.stopPropagation(); sp.classList.add("is-fast"); setTimeout(() => sp.classList.remove("is-fast"), 1200); confetti(30); };
  sp.addEventListener("click", go);
  sp.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(e); } });
});

/* Logo: spin on click */
$$(".logo").forEach((l) =>
  l.addEventListener("click", () => {
    l.classList.remove("is-spin");
    void l.offsetWidth;
    l.classList.add("is-spin");
  })
);

/* Confetti of sticky-note colours */
const confetti = (n = 70) => {
  if (reduced) return;
  const cols = ["#ff3fa4", "#1f5fd6", "#ffe14d", "#e8590c", "#0b8a78", "#111111"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("i");
    c.className = "confetti";
    c.style.background = cols[i % cols.length];
    document.body.appendChild(c);
    const x = Math.random() * innerWidth, drift = (Math.random() - 0.5) * 200, rot = Math.random() * 720;
    c.animate(
      [
        { transform: `translate(${x}px, -20px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${x + drift}px, ${innerHeight + 40}px) rotate(${rot}deg)`, opacity: 0.9 },
      ],
      { duration: 1800 + Math.random() * 1400, delay: Math.random() * 300, easing: "cubic-bezier(.3,.6,.5,1)" }
    ).onfinish = () => c.remove();
  }
};

/* Secret: type "hire" anywhere */
let typed = "";
addEventListener("keydown", (e) => {
  if (/input|textarea/i.test(document.activeElement.tagName) || e.key.length !== 1) return;
  typed = (typed + e.key.toLowerCase()).slice(-4);
  if (typed === "hire") {
    confetti();
    toast("Excellent decision. My email is one click away ✳");
  }
});

/* Mini self-efficacy survey */
$$(".likert").forEach((form) => {
  const qs = $$(".likert__q", form);
  const answers = {};
  qs.forEach((q) => {
    const scale = $(".likert__scale", q);
    for (let v = 1; v <= 5; v++) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = v;
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("aria-label", `${v} of 5: ${q.querySelector("p").textContent}`);
      b.addEventListener("click", (e) => {
        answers[q.dataset.domain] = v;
        $$("button", scale).forEach((x) => x.setAttribute("aria-pressed", x === b));
        const r = b.getBoundingClientRect();
        if (v >= 4) burst(r.left + r.width / 2, r.top, 5);
        if (Object.keys(answers).length === qs.length) done();
        void e;
      });
      scale.appendChild(b);
    }
  });
  const done = () => {
    const vals = Object.values(answers), avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const res = $(".likert__result", form);
    const top = Object.entries(answers).sort((a, b) => b[1] - a[1])[0][0];
    const label = avg >= 4.3 ? "Fearless maker" : avg >= 3.3 ? "Confident tinkerer" : avg >= 2.3 ? "Curious builder" : "Future maker (everyone starts here)";
    res.innerHTML =
      `<span class="mono muted">Your result</span><b>${label} · ${avg.toFixed(1)}/5</b>` +
      Object.entries(answers).map(([k, v]) => `<div class="likert__bar"><span>${k}</span><i style="--w:0%"></i><span>${v}</span></div>`).join("") +
      `<p class="likert__note">Strongest domain: ${top}. This is how a Likert scale turns a feeling into data. The real MSES has 17 validated items; these 3 are just for fun.</p>`;
    form.classList.add("is-done");
    requestAnimationFrame(() => requestAnimationFrame(() => $$(".likert__bar", res).forEach((b, i) => ($("i", b).style.setProperty("--w", `${(vals[i] / 5) * 100}%`)))));
    if (avg >= 4) confetti(40);
  };
});

/* 30-second version */
const panel = $(".tldr-panel");
if (panel) {
  const open = () => { panel.classList.add("is-on"); panel.setAttribute("aria-hidden", "false"); $(".tldr-close", panel).focus(); };
  const close = () => { panel.classList.remove("is-on"); panel.setAttribute("aria-hidden", "true"); $(".tldr-fab")?.focus(); };
  $$("[data-tldr]").forEach((b) => b.addEventListener("click", open));
  $(".tldr-close", panel).addEventListener("click", close);
  panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  $$("a", panel).forEach((a) => a.addEventListener("click", close));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("is-on")) close(); });
}

/* Godrej: funnel */
$$(".funnel").forEach((f) =>
  f.addEventListener("reveal", () => $$(".funnel__row", f).forEach((r, i) => setTimeout(() => ($("i", r).style.width = `${r.dataset.value}%`), i * 250)))
);

/* Godrej: benchmark grid */
$$(".bench").forEach((b) => {
  const out = $(".bench-count b", b.parentElement);
  const btns = $$("button", b);
  btns.forEach((x, i) => {
    x.style.transitionDelay = `${i * 40}ms`;
    x.addEventListener("click", () => {
      x.style.transitionDelay = "0ms";
      x.setAttribute("aria-pressed", x.getAttribute("aria-pressed") !== "true");
      if (out) out.textContent = btns.filter((y) => y.getAttribute("aria-pressed") === "true").length;
    });
  });
});

/* ==========================================================================
   v4: more fun
   ========================================================================== */

/* Images with a fallback (e.g. About photo not added yet) */
$$("img[data-fallback]").forEach((img) => {
  const swap = () => { if (img.src.indexOf(img.dataset.fallback) === -1) img.src = img.dataset.fallback; };
  img.addEventListener("error", swap);
  if (img.complete && img.naturalWidth === 0) swap();
});

/* Polaroid stack: click to shuffle */
$$(".stack").forEach((stack) => {
  const rots = [-7, 5, -3, 8, -5];
  const layout = () =>
    $$(".polaroid", stack).forEach((p, i, all) => {
      const depth = all.length - 1 - i;
      p.style.setProperty("--rot", `${rots[i % rots.length]}deg`);
      p.style.setProperty("--tx", `${depth * 6}px`);
      p.style.setProperty("--ty", `${depth * 4}px`);
      p.style.zIndex = i;
    });
  layout();
  const shuffle = () => {
    const top = $(".polaroid:last-child", stack);
    if (!top || top.classList.contains("is-out")) return;
    top.classList.add("is-out");
    setTimeout(() => {
      stack.prepend(top);
      top.classList.remove("is-out");
      layout();
    }, reduced ? 0 : 420);
  };
  stack.setAttribute("tabindex", "0");
  stack.setAttribute("role", "button");
  stack.addEventListener("click", shuffle);
  stack.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); shuffle(); } });
});

/* Draggable stickers */
$$(".sticker").forEach((st) => {
  st.setAttribute("data-cursor", "Drag");
  let sx, sy, ox, oy, id = null;
  st.addEventListener("pointerdown", (e) => {
    id = e.pointerId; st.setPointerCapture(id); st.classList.add("is-dragging");
    const par = st.offsetParent.getBoundingClientRect(), r = st.getBoundingClientRect();
    ox = r.left - par.left; oy = r.top - par.top; sx = e.clientX; sy = e.clientY;
    st.style.left = `${ox}px`; st.style.top = `${oy}px`; st.style.right = "auto"; st.style.bottom = "auto";
  });
  st.addEventListener("pointermove", (e) => {
    if (e.pointerId !== id) return;
    st.style.left = `${ox + e.clientX - sx}px`; st.style.top = `${oy + e.clientY - sy}px`;
  });
  const end = () => { if (id === null) return; id = null; st.classList.remove("is-dragging"); st.style.setProperty("--r", `${(Math.random() * 16 - 8).toFixed(1)}deg`); };
  st.addEventListener("pointerup", end);
  st.addEventListener("pointercancel", end);
});

/* Sparkle trail behind the cursor */
if (finePointer && !reduced) {
  const cols = ["#7ff0ff", "#a99bff", "#e3ecfb"];
  let last = 0;
  addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - last < 90) return;
    last = now;
    const s = document.createElement("i");
    s.className = "spark";
    s.style.background = cols[Math.floor(Math.random() * cols.length)];
    document.body.appendChild(s);
    const dx = (Math.random() - 0.5) * 30, dy = 10 + Math.random() * 24;
    s.animate(
      [{ transform: `translate(${e.clientX}px, ${e.clientY}px) scale(1)`, opacity: 0.9 },
       { transform: `translate(${e.clientX + dx}px, ${e.clientY + dy}px) scale(0)`, opacity: 0 }],
      { duration: 700, easing: "ease-out" }
    ).onfinish = () => s.remove();
  }, { passive: true });
}

/* Method chips: jump to the section and flash it */
$$(".method").forEach((m) =>
  m.addEventListener("click", () => {
    const t = document.querySelector(m.getAttribute("href"));
    if (!t) return;
    setTimeout(() => { t.classList.remove("is-flash"); void t.offsetWidth; t.classList.add("is-flash"); }, 450);
  })
);

/* Experience tabs */
$$(".xp-tabs button").forEach((b) =>
  b.addEventListener("click", () => {
    $$(".xp-tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
    $$(".xp-list").forEach((l) => (l.hidden = l.dataset.panel !== b.dataset.xp));
  })
);

/* ==========================================================================
   Redesigned interfaces
   ========================================================================== */

/* Calidus HMI */
const hmi = $("#hmi");
if (hmi) {
  const st = { t: 25, h: 60, st: 25, sh: 60, cond: "ICH long-term" };
  const ARC = 251.3; // length of the 180° arc (r=80)
  $$(".arc-val, .arc-bg, .arc-band", hmi).forEach((p) => (p.style.strokeDasharray = ARC));
  const ranges = { t: [10, 45], h: [20, 90] };
  const bandOf = { t: 2, h: 5 };
  const pos = (k, v) => (v - ranges[k][0]) / (ranges[k][1] - ranges[k][0]);
  const drawBand = (k) => {
    const band = $(`.gauge[data-g="${k}"] [data-band]`, hmi);
    const sp = k === "t" ? st.st : st.sh, b = bandOf[k];
    const a = pos(k, sp - b), z = pos(k, sp + b);
    band.style.strokeDasharray = `0 ${a * ARC} ${(z - a) * ARC} ${ARC}`;
  };
  const render = () => {
    ["t", "h"].forEach((k) => {
      const v = st[k], sp = k === "t" ? st.st : st.sh;
      $(`[data-v="${k}"]`, hmi).textContent = v.toFixed(1);
      $(`[data-s="${k}"]`, hmi).textContent = sp;
      $(`.gauge[data-g="${k}"] .arc-val`, hmi).style.strokeDashoffset = ARC * (1 - pos(k, v));
    });
    const ok = Math.abs(st.t - st.st) <= 2 && Math.abs(st.h - st.sh) <= 5;
    const state = $("#hmi-state");
    state.textContent = ok ? "Stable" : "Stabilising";
    state.classList.toggle("is-warn", !ok);
    $("#hmi-cond").textContent = st.cond;
    $("#hmi-cond-sub").textContent = `${st.st} °C / ${st.sh} %RH`;
  };
  drawBand("t"); drawBand("h"); render();
  setInterval(() => {
    st.t += (st.st - st.t) * 0.12 + (Math.random() - 0.5) * 0.15;
    st.h += (st.sh - st.h) * 0.12 + (Math.random() - 0.5) * 0.6;
    render();
    const d = new Date();
    $("#hmi-clock").textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, 900);

  // nav
  $$(".hmi__nav button", hmi).forEach((b) =>
    b.addEventListener("click", () => {
      $$(".hmi__nav button", hmi).forEach((x) => x.setAttribute("aria-selected", x === b));
      $$(".hmi__view", hmi).forEach((v) => v.classList.toggle("is-on", v.dataset.view === b.dataset.v));
    })
  );
  // presets + sliders
  const ti = $("#hmi-t"), hi = $("#hmi-h");
  const outs = () => { $("#hmi-t-out").textContent = ti.value; $("#hmi-h-out").textContent = hi.value; };
  let pendingCond = st.cond;
  $$(".presets button", hmi).forEach((b) =>
    b.addEventListener("click", () => {
      $$(".presets button", hmi).forEach((x) => x.setAttribute("aria-pressed", x === b));
      if (b.dataset.p !== "custom") {
        const [t, h, name] = b.dataset.p.split(",");
        ti.value = t; hi.value = h; pendingCond = name;
      } else pendingCond = "Custom study";
      outs();
    })
  );
  [ti, hi].forEach((i) => i.addEventListener("input", () => {
    $$(".presets button", hmi).forEach((x) => x.setAttribute("aria-pressed", x.dataset.p === "custom"));
    pendingCond = "Custom study"; outs();
  }));
  // hold to apply
  const ap = $("#hmi-apply"), fill = $("i", ap), label = $("span", ap);
  let raf, t0;
  const apply = () => {
    st.st = +ti.value; st.sh = +hi.value; st.cond = pendingCond;
    drawBand("t"); drawBand("h"); render();
    label.textContent = "Applied ✓";
    setTimeout(() => { label.textContent = "Hold to apply"; fill.style.transform = "scaleX(0)"; }, 1400);
  };
  const start = (e) => {
    e.preventDefault(); t0 = performance.now();
    const f = (t) => { const p = Math.min(1, (t - t0) / 800); fill.style.transform = `scaleX(${p})`; if (p < 1) raf = requestAnimationFrame(f); else apply(); };
    raf = requestAnimationFrame(f);
  };
  const cancel = () => { cancelAnimationFrame(raf); if (label.textContent === "Hold to apply") fill.style.transform = "scaleX(0)"; };
  ap.addEventListener("pointerdown", start);
  ap.addEventListener("pointerup", cancel);
  ap.addEventListener("pointerleave", cancel);
  ap.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apply(); } });
  // toggles
  $$(".toggle", hmi).forEach((t) => t.addEventListener("click", () => t.setAttribute("aria-checked", t.getAttribute("aria-checked") !== "true")));
  // 24h chart
  const svg = $("#hmi-chart");
  const W = 600, H = 180, N = 48;
  const series = (base, amp, lo, hi2, seed) => Array.from({ length: N }, (_, i) => base + Math.sin(i / 5 + seed) * amp + Math.sin(i * 1.7 + seed) * amp * 0.3)
    .map((v, i) => `${(i / (N - 1)) * W},${H - ((v - lo) / (hi2 - lo)) * H}`).join(" ");
  svg.innerHTML =
    `<g stroke="rgba(170,230,240,.08)">${[0.25, 0.5, 0.75].map((y) => `<line x1="0" x2="${W}" y1="${y * H}" y2="${y * H}"/>`).join("")}</g>` +
    `<polyline fill="none" stroke="#a99bff" stroke-width="2" points="${series(60, 2.2, 45, 75, 1)}"/>` +
    `<polyline fill="none" stroke="#7ff0ff" stroke-width="2.5" points="${series(25, 0.6, 20, 30, 0)}"/>`;
}

/* Totsecure app */
const tapp = $("#tapp");
if (tapp) {
  const cards = $$(".lock-card", tapp);
  const log = $("#tapp-log");
  const summary = () => {
    const open = cards.filter((c) => c.classList.contains("is-open"));
    const n = cards.length, locked = n - open.length;
    $("#tapp-count").textContent = `${locked}/${n}`;
    $(".tapp__ring .rf", tapp).style.strokeDashoffset = 188.5 * (1 - locked / n);
    $("#tapp-hero").classList.toggle("is-open", open.length > 0);
    $("#tapp-title").textContent = open.length ? `${open.length} lock${open.length > 1 ? "s" : ""} open` : "Everything's secure";
    $("#tapp-sub").textContent = open.length
      ? `${open.map((c) => $("b", c).textContent).join(", ")} ${open.length > 1 ? "are" : "is"} unlocked.`
      : "All cabinets and doors are locked.";
  };
  cards.forEach((c) => {
    const sw = $(".lk", c), sub = $("small", c);
    sw.addEventListener("click", () => {
      const nowOpen = !c.classList.contains("is-open");
      c.classList.toggle("is-open", nowOpen);
      sw.setAttribute("aria-checked", !nowOpen);
      sub.textContent = sub.textContent.replace(/Locked|Unlocked/, nowOpen ? "Unlocked" : "Locked");
      const row = document.createElement("div");
      const t = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      row.innerHTML = `<i class="${nowOpen ? "o" : ""}"></i><span>${$("b", c).textContent} ${nowOpen ? "unlocked" : "locked"} by Amy</span><time>${t}</time>`;
      log.prepend(row);
      summary();
    });
  });
  $$(".tapp__tabs button", tapp).forEach((b) =>
    b.addEventListener("click", () => {
      $$(".tapp__tabs button", tapp).forEach((x) => x.setAttribute("aria-selected", x === b));
      $$(".tapp__view", tapp).forEach((v) => v.classList.toggle("is-on", v.dataset.view === b.dataset.t));
    })
  );
  $$(".toggle", tapp).forEach((t) => t.addEventListener("click", () => t.setAttribute("aria-checked", t.getAttribute("aria-checked") !== "true")));
  $("#tapp-clock").textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(/\s?[AP]M/i, "");
  summary();
}

/* ==========================================================================
   Journey timeline
   ========================================================================== */
const journey = $("#timeline");
if (journey) {
  // Edit this list to update the timeline (oldest → newest)
  const EVENTS = [
    ["extra", "Feb ’19", "Arangetram", "Bharatanatyam debut"],
    ["extra", "Nov ’19", "Dance diploma", "T.M.V, Pune"],
    ["acad", "2020 – 2024", "MIT Institute of Design", "B.Des, Industrial Design"],
    ["extra", "Mar ’21", "Visharad", "Gandharva Mahavidyalaya"],
    ["work", "Jun – Jul ’22", "Chef at Home", "Packaging design intern"],
    ["cert", "Jul ’22", "Emotional thinking & design psychology", "Udemy"],
    ["work", "Aug – Sep ’22", "Guddee", "Product design intern"],
    ["extra", "Feb ’23", "Packaging of the World", "Featured design"],
    ["work", "May – Jun ’23", "Godrej & Boyce (Interio)", "Product design intern"],
    ["extra", "Jun – Jul ’23", "CRY", "Volunteering"],
    ["work", "Jan – Jun ’24", "Therefore Design", "Industrial design intern"],
    ["acad", "2024 – 2026", "Penn State", "M.S., Engineering Design"],
    ["work", "Aug ’24 – now", "Penn State", "Teaching assistant"],
    ["work", "Nov ’24 – now", "Penn State", "Graduate researcher"],
    ["research", "Aug ’25", "ASME IDETC-CIE", "Presentation, Anaheim"],
    ["research", "Apr ’26", "CERS 2026", "Research symposium"],
    ["research", "Aug ’26", "ASME IDETC-CIE", "2nd place Best Paper"],
  ];
  const STEP = 150, PAD = 110, H = 440, MID = 220, AMP = 34;
  const W = PAD * 2 + STEP * (EVENTS.length - 1);
  const yAt = (x) => MID + Math.sin((x - PAD) / 95) * AMP;
  let d = `M0 ${yAt(0)}`;
  for (let x = 8; x <= W; x += 8) d += ` L${x} ${yAt(x).toFixed(1)}`;
  const inner = document.createElement("div");
  inner.className = "journey__inner";
  inner.style.width = `${W}px`;
  inner.innerHTML = `<svg class="wave" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><linearGradient id="jgrad" x1="0" x2="1"><stop offset="0" stop-color="#e8590c"/><stop offset=".5" stop-color="#e8308c"/><stop offset="1" stop-color="#1f5fd6"/></linearGradient></defs><path d="${d}"/></svg>`;
  EVENTS.forEach(([type, when, title, sub], i) => {
    const x = PAD + i * STEP, y = yAt(x), up = i % 2 === 0;
    const stem = up ? 58 + (i % 4) * 14 : 50 + (i % 3) * 16;
    const n = document.createElement("div");
    n.className = "jn";
    n.dataset.type = type;
    n.style.left = `${x}px`;
    n.style.top = `${y}px`;
    n.innerHTML =
      `<span class="jn__dot"></span><span class="jn__stem" style="${up ? `bottom:0;height:${stem}px` : `top:0;height:${stem}px`}"></span>` +
      `<div class="jn__card" tabindex="0" style="${up ? `bottom:${stem + 8}px;--lift:-4px` : `top:${stem + 8}px;--lift:4px`}"><small>${when}</small><b>${title}</b><span>${sub}</span></div>`;
    inner.appendChild(n);
  });
  journey.appendChild(inner);
  const path = $(".wave path", journey);
  path.style.setProperty("--len", Math.ceil(path.getTotalLength()));
  io.observe(journey);
  journey.addEventListener("reveal", () => {
    if (reduced) return;
    $$(".jn", journey).forEach((n, i) => n.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 300 + i * 90, fill: "backwards", easing: "ease-out" }));
  });
  // drag to scroll + wheel sideways
  let dx = null, sl = 0;
  journey.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; dx = e.clientX; sl = journey.scrollLeft; journey.classList.add("is-drag"); });
  addEventListener("pointermove", (e) => { if (dx !== null) journey.scrollLeft = sl - (e.clientX - dx); });
  addEventListener("pointerup", () => { dx = null; journey.classList.remove("is-drag"); });
  journey.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const max = journey.scrollWidth - journey.clientWidth;
      if ((e.deltaY > 0 && journey.scrollLeft < max - 1) || (e.deltaY < 0 && journey.scrollLeft > 0)) { e.preventDefault(); journey.scrollLeft += e.deltaY; }
    }
  }, { passive: false });
  // legend filter
  $$(".journey-legend button").forEach((b) =>
    b.addEventListener("click", () => {
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true");
      const on = $$(".journey-legend button").filter((x) => x.getAttribute("aria-pressed") === "true").map((x) => x.dataset.type);
      $$(".jn", journey).forEach((n) => n.classList.toggle("is-off", !on.includes(n.dataset.type)));
    })
  );
}

/* ==========================================================================
   Mini-game: catch the questions, dodge the assumptions
   ========================================================================== */
const gameBtn = $("#game-start");
if (gameBtn) {
  const field = $("#game-field"), scoreEl = $("#game-score"), bestEl = $("#game-best"), timeEl = $("#game-time");
  const GOOD = ["why?", "how?", "who?", "what if?", "tell me more", "walk me through it"];
  const BAD = ["users will love it", "it's obvious", "just add a button", "trust me", "nobody reads that"];
  let best = 0;
  try { best = +localStorage.getItem("sh-best") || 0; } catch {}
  bestEl.textContent = best;
  let score = 0, timer, spawner, left = 15, running = false;
  const spawn = () => {
    const good = Math.random() < 0.65;
    const b = document.createElement("button");
    b.type = "button";
    b.className = `bubble ${good ? "bubble--q" : "bubble--a"}`;
    b.textContent = (good ? GOOD : BAD)[Math.floor(Math.random() * (good ? GOOD : BAD).length)];
    field.appendChild(b);
    const fw = field.clientWidth, fh = field.clientHeight;
    const x = Math.random() * Math.max(10, fw - b.offsetWidth - 10) + 5;
    b.style.left = `${x}px`;
    b.style.top = `${fh}px`;
    const dur = 2600 + Math.random() * 1600;
    const anim = b.animate([{ transform: "translateY(0)" }, { transform: `translateY(-${fh + 40}px)` }], { duration: dur, easing: "linear" });
    anim.onfinish = () => b.remove();
    b.addEventListener("click", (e) => {
      if (!running) return;
      score += good ? 1 : -2;
      scoreEl.textContent = score;
      burst(e.clientX, e.clientY, good ? 6 : 3);
      anim.pause();
      b.classList.add("is-pop");
      setTimeout(() => b.remove(), 300);
    });
  };
  const end = () => {
    running = false;
    clearInterval(timer); clearInterval(spawner);
    $$(".bubble", field).forEach((b) => b.remove());
    if (score > best) { best = score; bestEl.textContent = best; try { localStorage.setItem("sh-best", best); } catch {} }
    toast(score >= 10 ? `${score} points. You'd make a great UX researcher ✳` : score > 0 ? `${score} points. Solid instincts!` : `${score} points. Assumptions got you this time.`);
    if (score >= 10) confetti(50);
    gameBtn.textContent = "Play again";
    gameBtn.disabled = false;
  };
  gameBtn.addEventListener("click", () => {
    score = 0; left = 15; running = true;
    scoreEl.textContent = 0; timeEl.textContent = "15s";
    gameBtn.disabled = true; gameBtn.textContent = "Go!";
    spawner = setInterval(spawn, 520);
    spawn();
    timer = setInterval(() => { left--; timeEl.textContent = `${left}s`; if (left <= 0) end(); }, 1000);
  });
}

/* Autoplay case-study videos only while visible */
$$(".video-frame video").forEach((v) => {
  if (reduced) return;
  new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())), { threshold: 0.4 }).observe(v);
});

/* Innovation vs habit: muscle-memory test */
const ht = $("#habit-test");
if (ht) {
  const bar = $("#ht-bar"), stage = $("#ht-stage"), btn = $("#ht-start"), msg = $("#ht-msg");
  const ICONS = ["⌂", "⌕", "⊕", "♥", "◉"];
  let layout = [...ICONS], round = 0, taps = 0, times = [], t0 = 0, results = [];
  const draw = () => {
    bar.innerHTML = layout.map((ic) => `<button type="button" aria-label="${ic === "♥" ? "Heart" : "Other icon"}" class="${ic === "♥" ? "is-target" : ""}">${ic}</button>`).join("");
    $$("button", bar).forEach((b) => b.addEventListener("click", () => hit(b)));
  };
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const next = () => { t0 = performance.now(); };
  const hit = (b) => {
    if (!round) return;
    if (b.textContent !== "♥") { b.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], { duration: 200 }); return; }
    times.push(performance.now() - t0); taps++;
    if (round === 2) { layout = shuffle(layout); draw(); }
    if (taps < 5) return next();
    results.push(avg(times));
    (round === 1 ? $("#ht-a") : $("#ht-b")).textContent = `${Math.round(results.at(-1))} ms`;
    if (round === 1) {
      round = 0; bar.classList.add("is-idle");
      const f = document.createElement("div"); f.className = "ht__flash"; f.textContent = "New update! We've redesigned the app ✨";
      bar.parentElement.appendChild(f);
      setTimeout(() => { f.remove(); layout = shuffle(ICONS); draw(); bar.classList.remove("is-idle"); round = 2; taps = 0; times = []; stage.textContent = "Round 2 · after the redesign"; next(); }, 1500);
    } else {
      round = 0; bar.classList.add("is-idle");
      const pct = Math.round((results[1] / results[0] - 1) * 100);
      msg.innerHTML = pct > 0 ? `You were <b>${pct}% slower</b> after the redesign. That extra time is the cognitive load this study sets out to measure.` : `You adapted instantly this time, but real redesigns move whole flows, not one icon. That's what the study measures.`;
      stage.textContent = "Done · try again?"; btn.textContent = "Restart"; btn.disabled = false;
    }
  };
  const shuffle = (a) => { let b; do { b = [...a].sort(() => Math.random() - 0.5); } while (b.indexOf("♥") === a.indexOf("♥")); return b; };
  bar.classList.add("is-idle"); draw();
  btn.addEventListener("click", () => {
    layout = [...ICONS]; draw(); bar.classList.remove("is-idle");
    round = 1; taps = 0; times = []; results = [];
    $("#ht-a").textContent = "–"; $("#ht-b").textContent = "–";
    stage.textContent = "Round 1 · familiar layout · tap ♥ 5×"; btn.disabled = true; next();
  });
}

/* NASA-TLX raw score */
const tlxBox = $("#tlx");
if (tlxBox) {
  const ins = $$("input", tlxBox), out = $("#tlx-score");
  const upd = () => { ins.forEach((i) => (i.nextElementSibling.textContent = i.value)); out.textContent = Math.round(ins.reduce((a, i) => a + +i.value, 0) / ins.length); };
  ins.forEach((i) => i.addEventListener("input", upd)); upd();
}
