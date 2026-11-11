/* Design Jenga, real 3D: three.js for rendering; every pull and collapse is hand-choreographed.
   Loaded lazily by main.js; the CSS tower stays as the fallback. */
import * as THREE from "./vendor/three.module.min.js";

export default function initJenga3D(root, { CORE, FLUFF, say, onScore, onEnd }) {
  const scene3 = root.querySelector("#jg-scene");
  const L = 3, H = 0.6, W = 1, GAP = 0.03, LAYERS = 8;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.className = "jenga__canvas";
  scene3.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const target = new THREE.Vector3(0, 2.1, 0);
  let theta = 0.75, phi = 0.36, radius = 12.5, baseRadius = 12.5;
  const placeCam = () => {
    camera.position.set(target.x + radius * Math.cos(phi) * Math.sin(theta), target.y + radius * Math.sin(phi), target.z + radius * Math.cos(phi) * Math.cos(theta));
    camera.lookAt(target);
  };

  scene.add(new THREE.HemisphereLight(0xfff3e0, 0x2a2018, 0.9));
  const key = new THREE.DirectionalLight(0xffe6c7, 2.4);
  key.position.set(6, 11, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 9, bottom: -3, near: 1, far: 30 });
  key.shadow.radius = 5;
  key.shadow.bias = -0.0006;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff3fa4, 0.7);
  rim.position.set(-7, 5, -6);
  scene.add(rim);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.ShadowMaterial({ opacity: 0.45 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------- textures ----------
  const woodCanvas = (w, h, rings) => {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#edc58e"); grad.addColorStop(1, "#dcae73");
    g.fillStyle = grad; g.fillRect(0, 0, w, h);
    if (rings) {
      for (let r = w; r > 4; r -= 7 + Math.random() * 5) { g.strokeStyle = `rgba(150,95,40,${0.12 + Math.random() * 0.12})`; g.lineWidth = 2; g.beginPath(); g.arc(w * 0.5, h * 1.25, r, 0, Math.PI * 2); g.stroke(); }
    } else {
      for (let i = 0; i < 26; i++) {
        g.strokeStyle = `rgba(140,85,35,${0.07 + Math.random() * 0.12})`; g.lineWidth = 1 + Math.random() * 2;
        const y = Math.random() * h; g.beginPath(); g.moveTo(0, y);
        for (let x = 0; x <= w; x += w / 8) g.lineTo(x, y + Math.sin(x / 60 + i) * 3 + (Math.random() - 0.5) * 2);
        g.stroke();
      }
    }
    g.strokeStyle = "rgba(90,55,20,.55)"; g.lineWidth = 3; g.strokeRect(1.5, 1.5, w - 3, h - 3);
    return { c, g };
  };
  const label = (g, text, w, h, size, wrap) => {
    g.fillStyle = "#3a220b"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = `700 ${size}px "Geist", system-ui, sans-serif`;
    const t = text.toUpperCase();
    if (!wrap) { g.fillText(t, w / 2, h / 2 + 2); return; }
    const words = t.split(" "), lines = []; let line = "";
    words.forEach((wd) => { const test = line ? line + " " + wd : wd; if (g.measureText(test).width > w - 18 && line) { lines.push(line); line = wd; } else line = test; });
    lines.push(line);
    const lh = size * 1.1, y0 = h / 2 - ((lines.length - 1) * lh) / 2 + 2;
    lines.forEach((ln, i) => g.fillText(ln, w / 2, y0 + i * lh));
  };
  const tex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t; };
  const topTex = tex(woodCanvas(512, 170).c);
  const mats = (name) => {
    const side = woodCanvas(768, 154); label(side.g, name, 768, 154, 44);
    const end = woodCanvas(256, 154, true); label(end.g, name, 256, 154, 30, true);
    const m = (t) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.72, metalness: 0, emissive: 0xff3fa4, emissiveIntensity: 0 });
    const sideT = tex(side.c), endT = tex(end.c);
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z (length runs along x)
    return [m(endT), m(endT), m(topTex), m(topTex), m(sideT), m(sideT)];
  };
  const geo = new THREE.BoxGeometry(L, H, W);


  // ---------- tower ----------
  // No physics engine: every block move is choreographed, so a pull and a collapse look the same, finished, every time.
  let blocks = [], dead = false, score = 0, anims = [], shake = 0;
  const Y = new THREE.Vector3(0, 1, 0);
  const clear = () => {
    blocks.forEach((b) => { scene.remove(b.mesh); b.mesh.material.forEach((m) => { m.map !== topTex && m.map.dispose(); m.dispose(); }); });
    blocks = []; anims = []; shake = 0;
  };
  const build = () => {
    clear(); dead = false; score = 0; onScore(0); readyAt = 0;
    // one look-alike per layer (2 real steps + 1 look-alike), so pulling any look-alike leaves a layer real Jenga would hold
    const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
    const cores = shuffle(CORE.map((c) => ({ name: c[1], why: c[2], proof: c[3], core: true })));
    const fluffs = shuffle(FLUFF.map((f) => ({ name: f[1], why: f[2], core: false })));
    const pool = [];
    for (let li = 0; li < LAYERS; li++) pool.push(...shuffle([cores[li * 2], cores[li * 2 + 1], fluffs[li % fluffs.length]]));
    for (let li = 0; li < LAYERS; li++) {
      const rot = li % 2 ? Math.PI / 2 : 0;
      for (let bi = 0; bi < 3; bi++) {
        const d = pool[li * 3 + bi], off = (bi - 1) * (W + GAP);
        const mesh = new THREE.Mesh(geo, mats(d.name));
        mesh.castShadow = mesh.receiveShadow = true;
        scene.add(mesh);
        const b = {
          mesh, li, ...d, peek: 0, opacity: 1,
          pos: new THREE.Vector3(rot ? off : 0, H / 2 + li * H, rot ? 0 : off),
          quat: new THREE.Quaternion().setFromAxisAngle(Y, rot),
          axis: rot ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0),
        };
        mesh.userData.b = b; blocks.push(b);
      }
    }
    root.classList.remove("is-down", "is-won");
    say('<span class="mono">Hover a block · tap to pull · drag to spin</span>');
  };

  // ---------- easing + motion helpers ----------
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const hermite = (p0, v0, p1, v1, u) => {
    const u2 = u * u, u3 = u2 * u;
    return p0.clone().multiplyScalar(2 * u3 - 3 * u2 + 1).add(v0.clone().multiplyScalar(u3 - 2 * u2 + u))
      .add(p1.clone().multiplyScalar(-2 * u3 + 3 * u2)).add(v1.clone().multiplyScalar(u3 - u2));
  };
  // a landed block settles with a short damped rock and hop instead of stopping dead
  const settle = (b, t, amp, axis) => {
    const k = Math.exp(-t * 9), s = Math.sin(t * 34);
    return { hop: Math.abs(s) * k * amp * 0.25, rock: new THREE.Quaternion().setFromAxisAngle(axis, s * k * amp * 0.12) };
  };

  // ---------- interaction ----------
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let hovered = null, drag = null, moved = false, idle = 0, vTheta = 0;
  const pick = (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(blocks.filter((b) => !b.out).map((b) => b.mesh))[0];
    return hit ? hit.object.userData.b : null;
  };
  const glow = (b, v) => b && b.mesh.material.forEach((m) => (m.emissiveIntensity = v));
  const cv = renderer.domElement;
  cv.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; moved = false; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", (e) => {
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      vTheta = -dx * 0.008; theta += vTheta; phi = Math.min(1.1, Math.max(0.08, phi + dy * 0.004));
      drag = { x: e.clientX, y: e.clientY }; idle = 0; return;
    }
    const b = dead ? null : pick(e);
    if (b !== hovered) { glow(hovered, 0); hovered = b; glow(b, 0.18); cv.style.cursor = b ? "pointer" : "grab"; if (b) say(b.proof ? `<b>${b.name}</b> · ${b.proof}` : `<b>${b.name}</b>`); }
  });
  cv.addEventListener("pointerleave", () => { glow(hovered, 0); hovered = null; });
  cv.addEventListener("pointerup", (e) => { const wasDrag = moved; drag = null; if (!wasDrag) { const b = pick(e); if (b) pull(b); } });

  // a resting block is a flat box: footprint rectangle (centre, long-axis direction, half sizes) plus a bottom and top height
  const foot = (pos, quat, y0) => {
    const u = new THREE.Vector3(1, 0, 0).applyQuaternion(quat); u.y = 0; u.normalize();
    return { x: pos.x, z: pos.z, ux: u.x, uz: u.z, y0, y1: y0 + H };
  };
  const SEP = 0.02;                                                         // a hair of clearance so faces never touch
  const overlap2d = (a, c) => {
    // separating-axis test for two L×W rectangles
    const axes = [[a.ux, a.uz], [-a.uz, a.ux], [c.ux, c.uz], [-c.uz, c.ux]];
    const dx = c.x - a.x, dz = c.z - a.z;
    return axes.every(([ax, az]) => {
      const ra = (L / 2) * Math.abs(a.ux * ax + a.uz * az) + (W / 2) * Math.abs(-a.uz * ax + a.ux * az);
      const rc = (L / 2) * Math.abs(c.ux * ax + c.uz * az) + (W / 2) * Math.abs(-c.uz * ax + c.ux * az);
      return Math.abs(dx * ax + dz * az) < ra + rc + SEP;
    });
  };
  // slide a block out of the tower toward the viewer, drop it to the floor, let it settle, fade it away
  const slideOut = (b, fade) => {
    const toCam = new THREE.Vector3().subVectors(camera.position, b.pos).projectOnVector(b.axis).normalize();
    const p0 = b.pos.clone().addScaledVector(toCam, b.peek); b.peek = 0;
    const out = b.pos.clone().addScaledVector(toCam, L + 0.12);               // fully clear of the layer
    const q0 = b.quat.clone(), tipAxis = new THREE.Vector3().crossVectors(Y, toCam).normalize();
    b.rest = { pos: new THREE.Vector3(out.x + toCam.x * 0.35, H / 2, out.z + toCam.z * 0.35), quat: q0.clone() };
    const me = foot(b.rest.pos, b.rest.quat, 0);
    blocks.forEach((o) => { if (o !== b && o.out && o.rest && o.mesh.visible && !o.gone && overlap2d(me, foot(o.rest.pos, o.rest.quat, o.rest.pos.y - H / 2))) b.rest.pos.y = Math.max(b.rest.pos.y, o.rest.pos.y + H + 0.002); });
    const slide = reduced ? 0.01 : 0.5, dropH = Math.max(0, out.y - b.rest.pos.y), fall = reduced ? 0.01 : Math.max(0.12, Math.sqrt((2 * dropH) / 16));
    let t = 0;
    anims.push((dt) => {
      t += dt;
      if (t <= slide) { b.pos.lerpVectors(p0, out, easeOut(t / slide)); return true; }
      const tf = t - slide;
      if (tf <= fall) {
        const u = tf / fall;
        b.pos.set(out.x + toCam.x * 0.35 * u, out.y - dropH * u * u, out.z + toCam.z * 0.35 * u);   // gravity: accelerating drop, a little forward carry
        b.quat.copy(q0).premultiply(new THREE.Quaternion().setFromAxisAngle(tipAxis, Math.sin(u * Math.PI) * 0.22));
        return true;
      }
      const ts = tf - fall, s = settle(b, ts, Math.min(1, dropH / 2 + 0.25), tipAxis);
      b.pos.copy(b.rest.pos); b.pos.y += s.hop; b.quat.copy(q0).premultiply(s.rock);
      if (b.fadeFast) b.opacity = Math.max(0, b.opacity - dt / 0.1);
      else if (fade && ts > 1.1) b.opacity = Math.max(0, 1 - (ts - 1.1) / 0.45);
      if (b.fadeFast && b.opacity <= 0) { b.mesh.visible = false; return false; }
      if (fade && b.opacity <= 0) { b.mesh.visible = false; return false; }
      return ts < 3;
    });
  };

  let readyAt = 0;
  const pull = (b) => {
    if (dead || b.out || performance.now() < readyAt) return;
    readyAt = performance.now() + (reduced ? 0 : 900);
    blocks.forEach((o) => { if (o.out && o.rest && !o.gone) { o.gone = true; o.fadeFast = true; } });
    b.out = true; glow(b, 0);
    if (hovered === b) hovered = null;
    if (!b.core) {
      slideOut(b, true);
      score++; onScore(score);
      say(`<b>${b.name}</b> pulled. ${b.why}`);
      if (score === FLUFF.length) { dead = true; root.classList.add("is-won"); say("<b>You caught every shortcut.</b> Everything left is load-bearing."); onEnd(true); }
      return;
    }
    dead = true;
    say(`<span class="jg-learn"><b>${b.name}.</b> ${b.why}</span>`);
    root.classList.add("is-down");
    onEnd(false, b.proof);
    const home = new THREE.Vector3(b.pos.x, 0, b.pos.z);
    slideOut(b, false);
    collapse(b, home);
  };

  // ---------- the collapse ----------
  // 1 · creak: the stack above the gap shivers.  2 · tip: it leans over the tower's edge, speeding up like a real topple.
  // 3 · break: each layer peels off in turn and tumbles to the floor along a smooth arc.  4 · settle: a hop and a rock, then still.
  // do two blocks (given by centre + rotation) interpenetrate? separating-axis test on the two boxes
  const HALF = [L / 2, H / 2, W / 2];
  const boxAxes = (q) => [new THREE.Vector3(1, 0, 0).applyQuaternion(q), new THREE.Vector3(0, 1, 0).applyQuaternion(q), new THREE.Vector3(0, 0, 1).applyQuaternion(q)];
  const hits = (pa, qa, pb, qb, clear = -0.012) => {   // resting on / touching is fine; only real overlap counts
    const d = new THREE.Vector3().subVectors(pb, pa);
    if (d.lengthSq() > 11) return false;                                     // farther apart than two block diagonals
    const A = boxAxes(qa), B = boxAxes(qb), axes = [...A, ...B];
    A.forEach((a) => B.forEach((bb) => { const c = new THREE.Vector3().crossVectors(a, bb); if (c.lengthSq() > 1e-8) axes.push(c.normalize()); }));
    return axes.every((ax) => {
      const ra = HALF.reduce((s, h, i) => s + h * Math.abs(A[i].dot(ax)), 0), rb = HALF.reduce((s, h, i) => s + h * Math.abs(B[i].dot(ax)), 0);
      return Math.abs(d.dot(ax)) < ra + rb + clear;
    });
  };
  const corners = (p, q) => { const out = []; for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) out.push(new THREE.Vector3(sx * L / 2, sy * H / 2, sz * W / 2).applyQuaternion(q).add(p)); return out; };

  // 1 · creak: the section above the gap shivers.
  // 2 · topple: it tips over the tower's edge as one piece, slides off, and drops onto its side. Every frame its corners are kept
  //     above the standing tower and the floor, so it can't pass through either.
  // 3 · break: lying on its side, its layers fall outward one after another like dominoes, each stopping exactly where it meets
  //     the floor or the layer already down.  4 · settle: a small rock, then still.
  const collapse = (b, home) => {
    const camFlat = new THREE.Vector3(camera.position.x, 0, camera.position.z).normalize();
    // a side block: fall toward the gap it left. The centre block: fall to one side, across its slide, so the section never lands on it
    const across = new THREE.Vector3().crossVectors(Y, b.axis);
    let lean = home.lengthSq() > 0.01 ? home.clone().normalize() : across.multiplyScalar(across.dot(new THREE.Vector3(-camFlat.z, 0, camFlat.x)) >= 0 ? 1 : -1);
    // tip over one of the tower's four faces, never a diagonal
    lean = Math.abs(lean.x) > Math.abs(lean.z) ? new THREE.Vector3(Math.sign(lean.x), 0, 0) : new THREE.Vector3(0, 0, Math.sign(lean.z));
    const axis = new THREE.Vector3().crossVectors(Y, lean).normalize();      // positive angle tips the top toward `lean`
    const base = blocks.some((o) => !o.out && o.li > b.li) ? b.li : b.li - 1;
    const EDGE = (3 * W + 2 * GAP) / 2;                                        // the tower's half-width, face to face
    const stubTop = (base + 1) * H;
    const pivot = new THREE.Vector3(lean.x * EDGE, stubTop, lean.z * EDGE);
    const layers = [];
    for (let li = base + 1; li < LAYERS; li++) {
      const members = blocks.filter((o) => !o.out && o.li === li && o !== b);
      if (members.length) layers.push(members.map((o) => ({ o, p0: o.pos.clone(), q0: o.quat.clone() })));
    }
    if (!layers.length) return;
    const all = layers.flat();
    const others = [];                                                        // things the falling layers must not enter
    blocks.forEach((o) => { if (o.out && o.rest && o.mesh.visible && !o.gone) others.push({ p: o.rest.pos.clone(), q: o.rest.quat.clone() }); });
    const DT = 1 / 60, creak = reduced ? 0 : 0.42, start = 0.28;

    // ---- rehearse the topple once, frame by frame, and record it ----
    const along = (v) => v.dot(lean);
    const poseAt = (th, s, d) => {
      const q = new THREE.Quaternion().setFromAxisAngle(axis, th);
      const off = lean.clone().multiplyScalar(s).addScaledVector(Y, -d);
      return all.map((m) => ({ p: m.p0.clone().sub(pivot).applyQuaternion(q).add(pivot).add(off), q: q.clone().multiply(m.q0) }));
    };
    const solid = blocks.filter((o) => !o.out && o.li <= base).map((o) => ({ p: o.pos.clone(), q: o.quat.clone() })).concat(others);
    const blocked = (pose, up) => pose.some(({ p, q }) => { const pp = p.clone(); pp.y += up; return solid.some((o) => hits(pp, q, o.p, o.q)); });
    const lift = (pose) => {
      // how far the section must rise so no corner is below the floor, or below the stub's top while over the stub
      let need = 0;
      pose.forEach(({ p, q }) => corners(p, q).forEach((c) => {
        need = Math.max(need, -c.y);
        if (along(c) < EDGE - 0.01 && Math.abs(c.dot(new THREE.Vector3().crossVectors(Y, lean))) < EDGE + 0.05) need = Math.max(need, stubTop - c.y);
      }));
      return need;
    };
    const topple = [];
    {
      let th = 0, w = 0, s = 0, vs = 0, d = 0, vd = 0, still = 0;
      for (let i = 0; i < 300; i++) {
        const tc = i * DT;
        if (tc < creak) { topple.push({ th: Math.sin(tc * 46) * 0.012 * (tc / creak), s: 0, d: 0 }); continue; }
        if (th < Math.PI / 2) { w += 10 * Math.sin(th + 0.07) * DT; th = Math.min(Math.PI / 2, th + w * DT); } else w = 0;
        if (th > 0.55) { vs += 4.5 * DT; s += vs * DT; }                     // as it leans past ~30° it starts sliding off the edge
        vd += 16 * DT; d += vd * DT;                                          // and gravity pulls it down wherever nothing holds it
        const pose = poseAt(th, s, d);
        let up = lift(pose);
        if (blocked(pose, up)) { let lo = up, hi = up + 1.2; for (let k = 0; k < 9; k++) { const mid = (lo + hi) / 2; if (blocked(pose, mid)) lo = mid; else hi = mid; } up = hi; }
        if (up > 0) { d -= up; if (vd > 2.5 && th >= Math.PI / 2) vd = -vd * 0.18; else vd = Math.min(vd, 0.5); }
        topple.push({ th, s, d });
        if (th >= Math.PI / 2 && Math.abs(vd) < 0.6 && up > 0) { if (++still > 6) break; }
      }
    }
    const tTopple = topple.length * DT;
    const lying = poseAt(topple[topple.length - 1].th, topple[topple.length - 1].s, topple[topple.length - 1].d);
    // layers now stand side by side along `lean`, the old top layer furthest out; each falls about its outer bottom edge
    let idx = 0;
    const slabs = layers.map((members) => {
      const blocksNow = members.map(() => lying[idx++]);
      let outer = -Infinity;
      blocksNow.forEach(({ p, q }) => corners(p, q).forEach((c) => (outer = Math.max(outer, along(c)))));
      const hinge = lean.clone().multiplyScalar(outer); hinge.y = 0;
      const perp = new THREE.Vector3().crossVectors(Y, lean); const cen = blocksNow.reduce((a, x) => a.add(x.p), new THREE.Vector3()).divideScalar(blocksNow.length);
      hinge.addScaledVector(perp, cen.dot(perp));
      return { members, from: blocksNow, hinge };
    }).reverse();                                                              // outermost first
    const placed = others.slice();
    const rotAbout = (from, hinge, a) => { const q = new THREE.Quaternion().setFromAxisAngle(axis, a); return from.map(({ p, q: q0 }) => ({ p: p.clone().sub(hinge).applyQuaternion(q).add(hinge), q: q.clone().multiply(q0) })); };
    const clashes = (pose) => pose.some(({ p, q }) => corners(p, q).some((c) => c.y < -0.005) || placed.some((o) => hits(p, q, o.p, o.q)));
    slabs.forEach((S) => {
      // fall as far as it can: the largest angle (up to flat) where it touches but doesn't enter what's already down
      let lo = 0, hi = Math.PI / 2;
      if (!clashes(rotAbout(S.from, S.hinge, hi))) lo = hi;
      else for (let i = 0; i < 18; i++) { const mid = (lo + hi) / 2; if (clashes(rotAbout(S.from, S.hinge, mid))) hi = mid; else lo = mid; }
      S.angle = lo; S.to = rotAbout(S.from, S.hinge, lo);
      S.to.forEach((x) => placed.push(x));
    });
    const fallDur = reduced ? 0.01 : 0.42, gapT = reduced ? 0 : 0.11;
    slabs.forEach((S, i) => (S.t0 = tTopple + i * gapT));

    let t = 0;
    const toppled = layers.map(() => false);
    anims.push((dt) => {
      t += dt;
      const tc = t - start;
      if (tc < 0) return true;
      if (tc < tTopple) {
        const f = topple[Math.min(topple.length - 1, Math.floor(tc / DT))];
        poseAt(f.th, f.s, f.d).forEach((x, i) => { all[i].o.pos.copy(x.p); all[i].o.quat.copy(x.q); });
        if (tc + dt >= tTopple) shake = Math.max(shake, 0.1);                 // the section hits the floor
        return true;
      }
      let busy = false;
      slabs.forEach((S, i) => {
        const u = clamp01((tc - S.t0) / fallDur);
        let a = S.angle * u * u;                                              // accelerates as it goes over, like a domino
        if (u >= 1) {
          if (!toppled[i]) { toppled[i] = true; shake = Math.max(shake, 0.035); }
          a = S.angle;                                                        // lands and stays: the thud is in the camera, not a bounce
          if (tc - S.t0 - fallDur < 0.6) busy = true;
        } else busy = true;
        rotAbout(S.from, S.hinge, a).forEach((x, j) => { S.members[j].o.pos.copy(x.p); S.members[j].o.quat.copy(x.q); });
      });
      return busy;
    });
  };

  // ---------- loop ----------
  const resize = () => {
    const w = scene3.clientWidth, h = scene3.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // only the target changes here; the loop eases toward it, so a resize mid-fall doesn't snap the zoom
    const first = baseRadius === 12.5 && radius === 12.5;
    baseRadius = w < 520 ? 16 : 12.5; if (first) radius = baseRadius;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(scene3);
  let visible = true, last = performance.now();
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(scene3);
  const tick = (now) => {
    requestAnimationFrame(tick);
    if (!visible) { last = now; return; }
    const dt = Math.min(0.033, (now - last) / 1000); last = now;
    if (!drag) { if (Math.abs(vTheta) > 1e-4 && !reduced) { theta += vTheta; vTheta *= 0.92; } else vTheta = 0; }
    if (!drag && !reduced) { idle += dt; if (idle > 1.5) theta += dt * 0.12; }
    anims = anims.filter((a) => a(dt));
    // ease the camera back while the tower comes down so the whole spill stays in frame
    radius += ((root.classList.contains("is-down") ? baseRadius * 1.35 : baseRadius) - radius) * Math.min(1, dt * 2);
    blocks.forEach((b) => {
      // hovered block peeks out a little, easing in and out
      const want = !reduced && b === hovered && !dead ? 0.18 : 0;
      b.peek += (want - b.peek) * Math.min(1, dt * 12);
      b.mesh.position.copy(b.pos);
      if (b.peek > 0.001) { const toCam = new THREE.Vector3().subVectors(camera.position, b.pos).projectOnVector(b.axis).normalize(); b.mesh.position.addScaledVector(toCam, b.peek); }
      b.mesh.quaternion.copy(b.quat);
      if (b.opacity < 1) b.mesh.material.forEach((m) => { m.transparent = true; m.opacity = b.opacity; });
    });
    placeCam();
    if (shake > 0.001 && !reduced) { camera.position.y += (Math.random() - 0.5) * shake; camera.position.x += (Math.random() - 0.5) * shake; shake *= Math.pow(0.02, dt); }
    renderer.render(scene, camera);
  };
  resize(); build(); placeCam();
  requestAnimationFrame(tick);

  return {
    rebuild: build,
    rotate: (dir) => { theta += dir * 0.6; idle = 0; },
  };
}
