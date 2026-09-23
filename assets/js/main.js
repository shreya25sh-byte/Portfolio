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
  "why is Velcro still winning in hospitals?",
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
$$(".hero, .contact").forEach((sec) =>
  sec.addEventListener("click", (e) => {
    if (e.target.closest("a, button, .lens, input")) return;
    burst(e.clientX, e.clientY);
  })
);

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
  const cols = ["#c9c0ff", "#a9c8ff", "#9fe3ea", "#ffb3ad", "#e6f7a2", "#ffc79a"];
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
