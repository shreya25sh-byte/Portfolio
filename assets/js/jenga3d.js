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
    g.font = `700 ${size}px "Geist Mono", ui-monospace, monospace`;
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
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -22, 0) });
  world.allowSleep = true;
  world.solver.iterations = 24;
  const woodM = new CANNON.Material("wood");
  world.defaultContactMaterial = new CANNON.ContactMaterial(woodM, woodM, { friction: 0.45, restitution: 0.02 });
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
    const pool = [...CORE.map((c) => ({ name: c[1], why: c[2], proof: c[3], core: true })), ...FLUFF.map((f) => ({ name: f[1], why: f[2], core: false }))].sort(() => Math.random() - 0.5);
    for (let li = 0; li < LAYERS; li++) {
      const rot = li % 2 ? Math.PI / 2 : 0;
      for (let bi = 0; bi < 3; bi++) {
        const d = pool[li * 3 + bi], off = (bi - 1) * (W + GAP);
        const mesh = new THREE.Mesh(geo, mats(d.name));
        mesh.castShadow = mesh.receiveShadow = true;
        const body = new CANNON.Body({ mass: 1, shape: new CANNON.Box(half), material: woodM, sleepSpeedLimit: 0.2, sleepTimeLimit: 0.4, linearDamping: 0.05, angularDamping: 0.08 });
        const x = rot ? off : 0, z = rot ? 0 : off;
        body.position.set(x, H / 2 + li * (H + 0.002), z);
        body.quaternion.setFromEuler(0, rot, 0);
        world.addBody(body); body.sleep();
        scene.add(mesh);
        const b = { mesh, body, li, ...d, axis: rot ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0) };
        mesh.userData.b = b; blocks.push(b);
      }
    }
    root.classList.remove("is-down", "is-won");
    say('<span class="mono">Hover a block · tap to pull · drag to spin</span>');
  };

  // ---------- interaction ----------
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let hovered = null, drag = null, moved = false, idle = 0;
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
      theta -= dx * 0.008; phi = Math.min(1.1, Math.max(0.08, phi + dy * 0.004));
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
    // slide it out along its long axis, toward whichever end faces the camera
    const toCam = new THREE.Vector3().subVectors(camera.position, b.mesh.position).projectOnVector(b.axis).normalize();
    b.body.type = CANNON.Body.KINEMATIC; b.body.velocity.set(toCam.x * 9, 0, toCam.z * 9);
    sliding.push({ b, t: 0 });
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
    // the real step was holding everything above it: wake the tower and give it a shove
    const dir = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    setTimeout(() => {
      blocks.forEach((o) => {
        if (o.out) return;
        o.body.wakeUp();
        if (o.li > b.li) {
          const k = 1 + (o.li - b.li) * 0.35;
          o.body.applyImpulse(new CANNON.Vec3(dir.x * 2.2 * k, 0.4, dir.z * 2.2 * k), new CANNON.Vec3(0, H / 2, 0));
        } else if (o.li === b.li) o.body.applyImpulse(new CANNON.Vec3(dir.x * 0.6, 0, dir.z * 0.6), new CANNON.Vec3(0, 0, 0));
      });
    }, 180);
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
    if (!drag && !reduced) { idle += dt; if (idle > 1.5) theta += dt * 0.12; }
    sliding = sliding.filter((s) => {
      s.t += dt;
      if (s.t > 0.55) { world.removeBody(s.b.body); scene.remove(s.b.mesh); return false; }
      s.b.mesh.material.forEach((m) => { m.transparent = true; m.opacity = Math.max(0, 1 - Math.max(0, s.t - 0.3) / 0.25); });
      return true;
    });
    world.step(1 / 60, dt, 4);
    blocks.forEach((b) => { b.mesh.position.copy(b.body.position); b.mesh.quaternion.copy(b.body.quaternion); });
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
