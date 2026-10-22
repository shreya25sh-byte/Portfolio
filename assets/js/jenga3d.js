/* Design Jenga, real 3D: three.js for rendering, cannon-es for physics.
   Loaded lazily by main.js; the CSS tower stays as the fallback. */
import * as THREE from "./vendor/three.module.min.js";
import * as CANNON from "./vendor/cannon-es.js";

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
  let theta = 0.75, phi = 0.36, radius = 12.5;
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

  // ---------- physics ----------
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -16, 0) });
  world.allowSleep = true;
  world.solver.iterations = 30;
  world.broadphase = new CANNON.SAPBroadphase(world);
  const woodM = new CANNON.Material("wood");
  world.defaultContactMaterial = new CANNON.ContactMaterial(woodM, woodM, { friction: 0.5, restitution: 0.04 });
  const floor = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: woodM });
  floor.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(floor);
  const half = new CANNON.Vec3(L / 2, H / 2, W / 2);

  // ---------- tower ----------
  let blocks = [], dead = false, score = 0, sliding = [];
  const clear = () => {
    blocks.forEach((b) => { scene.remove(b.mesh); world.removeBody(b.body); b.mesh.material.forEach((m) => { m.map !== topTex && m.map.dispose(); m.dispose(); }); });
    blocks = []; sliding = [];
  };
  const build = () => {
    clear(); dead = false; score = 0; onScore(0);
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
        const body = new CANNON.Body({ mass: 1, type: CANNON.Body.KINEMATIC, shape: new CANNON.Box(half), material: woodM, sleepSpeedLimit: 0.1, sleepTimeLimit: 0.5, linearDamping: 0.04, angularDamping: 0.06 });
        const x = rot ? off : 0, z = rot ? 0 : off;
        body.position.set(x, H / 2 + li * H, z);                     // exactly touching: nothing settles or bounces on wake
        body.quaternion.setFromEuler(0, rot, 0);
        world.addBody(body);                                         // held still (kinematic) until the tower actually falls
        scene.add(mesh);
        const b = { mesh, body, li, ...d, peek: 0, axis: rot ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0) };
        mesh.userData.b = b; blocks.push(b);
      }
    }
    root.classList.remove("is-down", "is-won");
    say('<span class="mono">Hover a block · tap to pull · drag to spin</span>');
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

  const pull = (b) => {
    if (dead || b.out) return;
    b.out = true; glow(b, 0);
    // slide it out along its long axis, toward whichever end faces the camera: quick start, easing to a stop
    const toCam = new THREE.Vector3().subVectors(camera.position, b.mesh.position).projectOnVector(b.axis).normalize();
    b.body.type = CANNON.Body.KINEMATIC; b.body.velocity.set(0, 0, 0); b.body.angularVelocity.set(0, 0, 0);
    const from = b.body.position.clone();
    sliding.push({ b, t: 0, from, dir: toCam, dist: L + 0.25, dur: reduced ? 0.01 : 0.6 });
    if (!b.core) {
      score++; onScore(score);
      say(`<b>${b.name}</b> pulled. ${b.why}`);
      if (score === FLUFF.length) { dead = true; root.classList.add("is-won"); say("<b>You spotted every look-alike.</b> Everything left is load-bearing."); onEnd(true); }
      return;
    }
    dead = true;
    say(`<span class="jg-down mono">Tower down · that was a real step</span><span class="jg-learn"><b>${b.name}.</b> ${b.why}</span><span class="jg-proof"><span class="jg-tag mono">Where I learned it</span>${b.proof}</span>`);
    root.classList.add("is-down");
    onEnd(false);
    // it was holding everything above it: a short creak, then the upper section leans as one piece toward the gap and topples
    const side = new THREE.Vector3(b.body.position.x, 0, b.body.position.z);
    const lean = side.lengthSq() > 0.01 ? side.normalize() : new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    const axis = new THREE.Vector3(0, 1, 0).cross(lean).normalize();          // tip over this horizontal axis
    const pivot = new THREE.Vector3(lean.x * (L / 2), b.body.position.y + H / 2, lean.z * (L / 2));
    blocks.forEach((o) => { if (!o.out) { o.body.type = CANNON.Body.DYNAMIC; o.body.mass = 1; o.body.updateMassProperties(); o.body.velocity.set(0, 0, 0); o.body.angularVelocity.set(0, 0, 0); o.body.wakeUp(); } });
    const creak = (amp) => blocks.forEach((o) => { if (!o.out && o.li > b.li) { o.body.wakeUp(); const w = axis.clone().multiplyScalar(amp); const r = new THREE.Vector3(o.body.position.x, o.body.position.y, o.body.position.z).sub(pivot); const v = w.clone().cross(r); o.body.velocity.set(v.x, Math.max(0, v.y), v.z); o.body.angularVelocity.set(w.x, w.y, w.z); } });
    setTimeout(() => creak(0.25), 260);
    setTimeout(() => creak(-0.15), 420);
    setTimeout(() => {
      const w = axis.clone().multiplyScalar(2.1);                                 // angular velocity of the rigid lean
      blocks.forEach((o) => {
        if (o.out) return;
        o.body.wakeUp();
        if (o.li > b.li) {
          const r = new THREE.Vector3(o.body.position.x, o.body.position.y, o.body.position.z).sub(pivot);
          const v = w.clone().cross(r);                                           // v = ω × r, same rotation for the whole stack
          const jitter = 0.08;
          o.body.velocity.set(v.x + (Math.random() - 0.5) * jitter, v.y, v.z + (Math.random() - 0.5) * jitter);
          o.body.angularVelocity.set(w.x, w.y, w.z);
        } else if (o.li === b.li) {
          // the rest of the weakened layer gives way, squeezed out sideways
          const out = new THREE.Vector3(o.body.position.x, 0, o.body.position.z);
          const d = out.lengthSq() > 0.01 ? out.normalize() : lean;
          o.body.velocity.set(d.x * 2.4 + lean.x * 1.2, 0.2, d.z * 2.4 + lean.z * 1.2);
          o.body.angularVelocity.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
        }
      });
    }, 560);
  };

  // ---------- loop ----------
  const resize = () => {
    const w = scene3.clientWidth, h = scene3.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    radius = w < 520 ? 16 : 12.5;
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
    sliding = sliding.filter((s) => {
      s.t += dt;
      const b = s.b.body;
      if (s.t <= s.dur) {
        // drive the kinematic block with a real velocity (ease-out), so neighbours feel friction instead of being teleported into
        const k1 = 1 - Math.pow(1 - Math.min(1, s.t / s.dur), 3), k0 = 1 - Math.pow(1 - Math.min(1, (s.t - dt) / s.dur), 3);
        const v = (s.dist * (k1 - k0)) / Math.max(dt, 1e-3);
        b.velocity.set(s.dir.x * v, 0, s.dir.z * v);
        return true;
      }
      if (!s.released) {                                                           // clear of the tower: let gravity have it
        s.released = true; b.type = CANNON.Body.DYNAMIC; b.mass = 1; b.updateMassProperties(); b.velocity.set(0, 0, 0);
        b.velocity.set(s.dir.x * 1.2, 0, s.dir.z * 1.2); b.angularVelocity.set(s.dir.z * 2, 0, -s.dir.x * 2); b.wakeUp();
      }
      const fadeFrom = s.dur + 1.6;
      if (s.t > fadeFrom) s.b.mesh.material.forEach((m) => { m.transparent = true; m.opacity = Math.max(0, 1 - (s.t - fadeFrom) / 0.5); });
      if (s.t > fadeFrom + 0.5) { world.removeBody(b); scene.remove(s.b.mesh); return false; }
      return true;
    });
    world.step(1 / 120, dt, 8);
    blocks.forEach((b) => {
      // hovered block peeks out a little (visual only), easing in and out
      const want = !reduced && b === hovered && !dead ? 0.18 : 0;
      b.peek += (want - b.peek) * Math.min(1, dt * 12);
      b.mesh.position.copy(b.body.position);
      if (b.peek > 0.001) { const toCam = new THREE.Vector3().subVectors(camera.position, b.mesh.position).projectOnVector(b.axis).normalize(); b.mesh.position.addScaledVector(toCam, b.peek); }
      b.mesh.quaternion.copy(b.body.quaternion);
    });
    placeCam();
    renderer.render(scene, camera);
  };
  resize(); build(); placeCam();
  requestAnimationFrame(tick);

  return {
    rebuild: build,
    rotate: (dir) => { theta += dir * 0.6; idle = 0; },
  };
}
