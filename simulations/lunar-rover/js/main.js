/* Lunar Rover — game. Physics is real where it matters for the feel of the Moon: gravity 1.62 m/s², no air
   (everything thrown flies on a clean parabola and nothing billows), traction limited by the low weight.
   The gems and the weapons are game elements, not science. */
import * as THREE from 'three';
import { Terrain, Clipmap, RULES, G_MOON, R_MOON, D2R, clamp, hash3, rng, wrap180 } from './terrain.js';

THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
const $ = id => document.getElementById(id);
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const Z = V(0, 0, 1), R2D = 1 / D2R;
const fm = (x, d = 1) => x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const params = new URLSearchParams(location.search);
const touchUI = params.has('touch') || matchMedia('(hover: none) and (pointer: coarse)').matches;
if (touchUI) document.body.classList.add('touch');
/* Version 3 (v3.html) swaps the hand-built vehicles for NASA's own 3-D models and adds film-like rendering.
   Everything else is shared, and without this flag the page behaves exactly as version 2. */
const V3 = ['3', '4'].includes(document.documentElement.dataset.v);
/* Version 4 (v4.html): richer deposits with veins, a pause key, a return window with radio calls from Houston, bigger sound. */
const V4 = document.documentElement.dataset.v === '4';

/* ====================================================================== renderer, scene, light */
const renderer = new THREE.WebGLRenderer({ canvas: $('gl'), antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, touchUI ? 1.5 : 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
if (V3) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12; }
let composer = null;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(55, 1, 0.15, 900000);
function resize() { renderer.setSize(innerWidth, innerHeight, false); if (composer) composer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* Sun where it was in the LRO photo: azimuth fitted from the data (see tools/shape_from_shading.py), elevation
   estimated from the length of the descent stage's shadow. Keeping it there keeps the photo and the relief consistent. */
const SUN_AZ = 272.5 * D2R, SUN_EL = 18 * D2R;
const sunDir = V(Math.sin(SUN_AZ) * Math.cos(SUN_EL), Math.cos(SUN_AZ) * Math.cos(SUN_EL), Math.sin(SUN_EL));
const sun = new THREE.DirectionalLight(0xfff6e8, 6.0); sun.castShadow = true;
sun.shadow.mapSize.set(touchUI ? 1024 : V3 ? 4096 : 2048, touchUI ? 1024 : V3 ? 4096 : 2048);
sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);
/* Fill light stands in for two things: sunlight scattered by the surrounding ground, and the fact that lunar soil
   brightens less on sun-facing slopes than an ideal matt surface. With sun 6 : fill 1.2, a slope changes brightness
   by about the factor measured in the real photo against the real elevation (K ≈ 1.4–1.9 per unit slope). */
scene.add(new THREE.AmbientLight(0xffffff, 1.2));
function aimSun(focus, half) {
  const c = sun.shadow.camera; if (c.right !== half) { c.left = -half; c.right = half; c.top = half; c.bottom = -half; c.near = 1; c.far = 400; c.updateProjectionMatrix(); }
  sun.target.position.copy(focus); sun.position.copy(focus).addScaledVector(sunDir, 200);
}
{ // the Earth: always in the same place in this sky, high in the west (the site is 23.5° from the sub-Earth point)
  const earth = new THREE.Mesh(new THREE.SphereGeometry(11600, 32, 16), new THREE.MeshLambertMaterial({ color: 0x4f86c6, emissive: 0x0a1626 }));
  const az = 268.4 * D2R, el = 66.5 * D2R; earth.position.set(Math.sin(az) * Math.cos(el), Math.cos(az) * Math.cos(el), Math.sin(el)).multiplyScalar(700000);
  earth.userData.sky = true; scene.add(earth); scene.userData.earth = earth;
}

{ const es = new THREE.Scene(), g = new THREE.SphereGeometry(50, 32, 16), P = g.attributes.position, col = new Float32Array(P.count * 3), v = V();
  for (let i = 0; i < P.count; i++) { v.set(P.getX(i), P.getY(i), P.getZ(i)).normalize(); const c = v.dot(sunDir) > 0.985 ? 60 : v.z < -0.02 ? 0.42 : 0.012; col[3 * i] = col[3 * i + 1] = col[3 * i + 2] = c; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); es.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(es, 0.03).texture; pm.dispose(); }

/* ====================================================================== small helpers for the models */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.15, ...o });
function canvasTex(w, h, draw, rep = [1, 1]) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); return t; }
const crinkle = canvasTex(128, 128, (x, w, h) => { const r = rng(71), id = x.createImageData(w, h); for (let i = 0; i < w * h; i++) { const v = 128 + (r() + r() - 1) * 120; id.data[4 * i] = id.data[4 * i + 1] = id.data[4 * i + 2] = v; id.data[4 * i + 3] = 255; } x.putImageData(id, 0, 0); x.globalAlpha = 0.5; x.drawImage(x.canvas, 0, 0, w * 2, h * 2); }, [3, 2]);
const cells = canvasTex(128, 128, (x, w, h) => { x.fillStyle = '#0c1a3c'; x.fillRect(0, 0, w, h); for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const g = x.createLinearGradient(i * 32, j * 32, i * 32 + 32, j * 32 + 32); g.addColorStop(0, '#1c3a86'); g.addColorStop(1, '#0d1f52'); x.fillStyle = g; x.fillRect(i * 32 + 1.5, j * 32 + 1.5, 29, 29); } x.strokeStyle = '#9fb4d8'; x.lineWidth = 0.6; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 32 + 16, 0); x.lineTo(i * 32 + 16, h); x.stroke(); } }, [3, 2]);
cells.colorSpace = THREE.SRGBColorSpace;
const cyl = (r1, r2, h, seg = 12, m) => { const g = new THREE.CylinderGeometry(r1, r2, h, seg); g.rotateX(Math.PI / 2); const o = new THREE.Mesh(g, m); o.castShadow = true; return o; };   // axis along z
const box = (x, y, z, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), m); o.castShadow = true; return o; };
const ball = (r, m, seg = 14) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg >> 1)), m); o.castShadow = true; return o; };
function strut(a, b, r, m) { const d = b.clone().sub(a), o = cyl(r, r, d.length(), 6, m); o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(Z, d.clone().normalize()); return o; }
const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const FOIL = mat(0xd39c2c, { metalness: 1, roughness: 0.33, bumpMap: crinkle, bumpScale: 1.4 });        // gold-coloured thermal blanket
const FOIL_K = mat(0x1e1b18, { metalness: 0.85, roughness: 0.4, bumpMap: crinkle, bumpScale: 1.2 });     // black-coated panels
const ALU = mat(0xc3c8ce, { metalness: 0.92, roughness: 0.4 }), GREY = mat(0x868c93, { metalness: 0.7, roughness: 0.5 }), DARK = mat(0x202428, { metalness: 0.5, roughness: 0.65 });
const WHITE = mat(0xe6e8ea, { roughness: 0.55, metalness: 0.05 }), GLASS = mat(0x070b12, { metalness: 1, roughness: 0.06 }), ORANGE = mat(0xc9652b, { roughness: 0.7, side: THREE.DoubleSide });
const PANEL = mat(0xffffff, { map: cells, metalness: 0.7, roughness: 0.25 }), MESH = mat(0xcbb26a, { metalness: 0.9, roughness: 0.45, side: THREE.DoubleSide });
const GOLD = FOIL;
function legs(g, rBody, zBody, rPad, n, m) {
  for (let i = 0; i < n; i++) {
    const a = (i + 0.5) * 2 * Math.PI / n, c = Math.cos(a), s = Math.sin(a);
    g.add(strut(V(c * rBody, s * rBody, zBody), V(c * rPad, s * rPad, 0.08), 0.05, m));
    g.add(strut(V(c * rBody * 0.9, s * rBody * 0.9, zBody * 0.45), V(c * rPad, s * rPad, 0.08), 0.035, m));
    g.add(at(cyl(0.28, 0.3, 0.08, 14, FOIL), c * rPad, s * rPad, 0.04));
  }
}
/* ---- version 3: NASA's 3-D models (github.com/nasa/NASA-3D-Resources, free and without copyright) ---- */
const MODELS = {}, SOIL = {};                              // SOIL: a real Apollo 11 photograph of the ground, used as the skin of rocks and soil in version 3
async function loadModels(onStep) {
  const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([import('three/addons/loaders/GLTFLoader.js'), import('three/addons/loaders/DRACOLoader.js')]);
  const draco = new DRACOLoader(); draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/'); const L = new GLTFLoader(); L.setDRACOLoader(draco);
  for (const [key, file, label] of [['lm', 'apollo_lunar_module.glb', 'Apollo lunar module'], ['rover', 'perseverance_rover.glb', 'rover'], ['hab1', 'habitat_1.glb', 'habitat'], ['hab2', 'habitat_2.glb', 'habitat'], ['astro', 'astronaut.glb', 'astronaut']]) {
    onStep(label); const g = await L.loadAsync('data/models/' + file); MODELS[key] = g.scene;
    g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; for (const m of [].concat(o.material)) if (m && !m.userData.fitted) { m.userData.fitted = true; m.userData.c0 = m.color ? m.color.clone() : null; m.envMapIntensity = 1; if (m.transmission) m.transmission = 0; if (m.color) m.color.multiplyScalar(0.42); if (key.startsWith('hab')) { m.metalness = 0; m.roughness = 0.9; } } } });
    if (key === 'lm') dressLM(g.scene);      // the Sun here is set for the dark lunar soil: painted surfaces are toned down so that they do not burn out
  }
}
/* Thermal blankets: the real lunar module is wrapped in crinkled metallised film. NASA's model paints those surfaces a flat
   colour; here they are given the look of creased foil — a wrinkled surface generated in the shader, on a metallic material. */
function foilify(m, scale, amp) {
  m.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvOP = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vOP;
      float fh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float fn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(mix(fh(i), fh(i + vec3(1,0,0)), f.x), mix(fh(i + vec3(0,1,0)), fh(i + vec3(1,1,0)), f.x), f.y), mix(mix(fh(i + vec3(0,0,1)), fh(i + vec3(1,0,1)), f.x), mix(fh(i + vec3(0,1,1)), fh(i + vec3(1,1,1)), f.x), f.y), f.z); }`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      { float h = fn(vOP * ${scale.toFixed(1)}) + 0.45 * fn(vOP * ${(scale * 2.3).toFixed(1)});      // broad creases only: finer ones would just sparkle
        vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition), r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1); vec2 dh = vec2(dFdx(h), dFdy(h)) * ${amp.toFixed(2)};
        normal = normalize(abs(det) * normal - sign(det) * (dh.x * r1 + dh.y * r2)); }`);
  };
  m.customProgramCacheKey = () => 'foil' + scale + '_' + amp; m.needsUpdate = true;
}
function dressLM(root) {                                 // gold and copper film, black film, bare aluminium, by the colour NASA gave each part
  const seen = new Set(); root.traverse(o => { if (!o.isMesh) return; for (const m of [].concat(o.material)) { if (!m || seen.has(m) || m.map) continue; seen.add(m); const c = m.userData.c0 || m.color, r = c.r, g = c.g, b = c.b;
    if (r > 0.5 && b < 0.2 && g > 0.25) { m.color.setRGB(r > 0.7 ? 0.95 : 0.85, r > 0.7 ? 0.63 : 0.42, r > 0.7 ? 0.2 : 0.12); m.metalness = 0.82; m.roughness = 0.56; m.envMapIntensity = 1.7; foilify(m, 3.6, 0.2); }      // gold / copper-coloured film
    else if (r < 0.3) { m.color.setRGB(0.07, 0.065, 0.06); m.metalness = 0.7; m.roughness = 0.5; m.envMapIntensity = 2.0; foilify(m, 4.5, 0.16); }                                                                      // black film
    else { m.color.setRGB(0.4, 0.41, 0.43); m.metalness = 0.55; m.roughness = 0.68; m.envMapIntensity = 1.1; } } });                                                                              // aluminium skin, slightly uneven
}
/* bring a model into the game's frame: z up, standing on z = 0, centred, scaled so that its width (or height) has the given size */
function fit(src, size, by = 'w', yaw = 0) {
  const piv = new THREE.Group(), g = new THREE.Group(); piv.add(src); piv.rotation.x = Math.PI / 2; g.add(piv); g.updateMatrixWorld(true);
  let b = new THREE.Box3().setFromObject(g), sz = b.getSize(V()); piv.scale.setScalar(size / (by === 'h' ? sz.z : Math.max(sz.x, sz.y))); g.updateMatrixWorld(true);
  b = new THREE.Box3().setFromObject(g); const c = b.getCenter(V()); piv.position.set(-c.x, -c.y, -b.min.z); g.rotation.z = yaw; const out = new THREE.Group(); out.add(g); out.userData.h = b.max.z - b.min.z; return out;
}
/* Apollo lunar module, descent stage: octagonal body in gold and black blankets, four legs with primary and secondary
   struts and dished footpads, ladder and porch on the front leg, engine skirt. Proportions follow the real one (4.2 m
   across the body, 9.4 m across the pads); details are simplified. */
function descentStage() {
  const g = new THREE.Group();
  const body = cyl(2.1, 2.1, 1.65, 8, FOIL); body.position.z = 1.95; body.rotation.z = Math.PI / 8; g.add(body);
  for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2, p = box(1.5, 0.05, 1.5, FOIL_K); p.position.set(Math.cos(a) * 1.95, Math.sin(a) * 1.95, 1.95); p.rotation.z = a + Math.PI / 2; g.add(p); }
  const deck = cyl(1.95, 2.1, 0.12, 8, ALU); deck.position.z = 2.84; deck.rotation.z = Math.PI / 8; g.add(deck);
  const under = cyl(2.0, 1.7, 0.1, 8, FOIL_K); under.position.z = 1.08; under.rotation.z = Math.PI / 8; g.add(under);
  g.add(at(cyl(0.32, 0.78, 0.9, 24, DARK), 0, 0, 0.72), at(cyl(0.8, 0.8, 0.04, 24, GREY), 0, 0, 0.28));
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2, c = Math.cos(a), sn = Math.sin(a), A = V(c * 2.0, sn * 2.0, 2.6), P = V(c * 4.45, sn * 4.45, 0.12), M = A.clone().lerp(P, 0.6);
    g.add(strut(A, M, 0.085, FOIL), strut(M, P, 0.06, ALU));
    for (const sd of [-1, 1]) g.add(strut(V(Math.cos(a + sd * 0.62) * 1.95, Math.sin(a + sd * 0.62) * 1.95, 1.25), M, 0.045, FOIL));
    g.add(strut(V(c * 2.0, sn * 2.0, 1.2), M, 0.04, ALU));
    g.add(at(cyl(0.47, 0.4, 0.1, 18, FOIL), P.x, P.y, 0.07), at(cyl(0.5, 0.5, 0.02, 18, ALU), P.x, P.y, 0.125));
  }
  for (const sd of [-0.2, 0.2]) g.add(strut(V(sd, 2.05, 2.6), V(sd, 3.25, 1.0), 0.022, ALU));         // ladder on the front (+y) leg
  for (let k = 0; k < 8; k++) { const t = k / 7; g.add(at(box(0.4, 0.03, 0.03, ALU), 0, 2.05 + 1.2 * t, 2.6 - 1.6 * t)); }
  g.add(at(box(0.95, 0.7, 0.05, ALU), 0, 2.15, 2.72));                                                 // porch
  return g;
}
function makeEagle() {
  if (V3 && MODELS.lm) {                                // the real module at its real size; the ascent stage left in 1969, so everything above the descent stage is hidden
    const g = fit(MODELS.lm.clone(true), 9.4, 'w', V3YAW.lm); g.updateMatrixWorld(true); const H = g.userData.h, b = new THREE.Box3(), c = V();
    g.traverse(o => { if (o.isMesh) { b.setFromObject(o); b.getCenter(c); if (c.z > H * 0.5 && b.min.z > H * 0.36) o.visible = false; } }); return g;
  }
  return descentStage();
}
const V3YAW = { lm: 0, rover: Math.PI, hab: 0 };          // what is left at Tranquility Base: the descent stage, real position
function ascentStage() {                                 // crew cabin: faceted pressure hull, windows, hatch, tanks, thrusters, antennas
  const g = new THREE.Group();
  const cg = new THREE.CylinderGeometry(1.16, 1.16, 2.3, 10); cg.rotateZ(Math.PI / 2); const cab = new THREE.Mesh(cg, ALU); cab.castShadow = true; g.add(at(cab, 0, 0.55, 4.1));
  g.add(at(box(2.5, 1.3, 1.55, ALU), 0, -0.4, 3.95), at(box(1.5, 0.75, 1.3, FOIL_K), 0, -1.35, 3.95), at(box(2.0, 0.5, 0.5, FOIL), 0, -0.5, 3.05));
  for (const sx of [-1, 1]) {
    const w = box(0.5, 0.04, 0.42, GLASS); w.position.set(sx * 0.52, 1.6, 4.45); w.rotation.set(0.5, 0, sx * -0.35); g.add(w);          // the two triangular-looking windows
    g.add(at(ball(0.62, FOIL, 16), sx * 1.5, -0.25, 3.7));                                                                           // propellant tanks
    for (const sy of [-1, 1]) { const q = at(box(0.22, 0.22, 0.22, GREY), sx * 1.72, 0.2 + sy * 1.05, 4.75); g.add(q, strut(V(sx * 1.2, 0.2 + sy * 0.8, 4.5), q.position, 0.03, ALU));
      for (const d of [[sx, 0, 0], [0, sy, 0], [0, 0, 1], [0, 0, -1]]) { const n = cyl(0.03, 0.07, 0.16, 8, DARK); n.position.copy(q.position).add(V(d[0], d[1], d[2]).multiplyScalar(0.18)); n.quaternion.setFromUnitVectors(Z, V(d[0], d[1], d[2])); g.add(n); } }
  }
  g.add(at(box(0.8, 0.05, 0.8, FOIL_K), 0, 1.72, 3.55), at(cyl(0.44, 0.44, 0.36, 18, ALU), 0, 0.15, 5.1), at(cyl(0.5, 0.5, 0.05, 18, GREY), 0, 0.15, 5.3));   // hatch, docking tunnel
  const rr = cyl(0.34, 0.05, 0.15, 18, ALU); rr.rotation.x = -Math.PI / 2 + 0.3; g.add(at(rr, 0, 1.45, 5.05), strut(V(0, 1.2, 4.9), V(0, 1.42, 5.0), 0.04, GREY));       // rendezvous radar
  const sb = cyl(0.42, 0.04, 0.16, 18, MESH); sb.rotation.set(0.5, 0.6, 0); g.add(at(sb, 1.35, 0.3, 5.6), strut(V(1.0, 0.2, 4.9), V(1.35, 0.3, 5.5), 0.03, GREY));       // S-band dish
  g.add(strut(V(-0.9, -0.5, 4.7), V(-0.95, -0.55, 5.9), 0.012, GREY), strut(V(-0.4, -1.2, 4.6), V(-0.4, -1.3, 5.7), 0.012, GREY));
  return g;
}
function makeLander() {                                  // the player's vehicle: a lunar module at 0.6 scale, with a ramp for the rover (the ramp is invented)
  if (V3 && MODELS.lm) { const g = new THREE.Group(); g.add(fit(MODELS.lm.clone(true), 5.7, 'w', V3YAW.lm));
    const flame = cyl(0.04, 0.42, 1.5, 16, new THREE.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.5, depthWrite: false })); flame.castShadow = false; flame.position.z = -0.45; flame.visible = false; g.add(flame); g.userData.flame = flame; return g; }
  const g = new THREE.Group(), s = new THREE.Group(); s.add(descentStage(), ascentStage()); s.scale.setScalar(0.6); g.add(s);
  const ramp = box(0.9, 1.9, 0.05, ALU); ramp.position.set(0, 2.45, 0.42); ramp.rotation.x = -0.42; g.add(ramp);
  const flame = cyl(0.04, 0.42, 1.5, 16, new THREE.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.5, depthWrite: false })); flame.castShadow = false; flame.position.z = -0.55; flame.visible = false; g.add(flame); g.userData.flame = flame;
  return g;
}
const ARM_L = 0.8;
/* Rover: aluminium chassis, wire-mesh wheels with chevron treads and fenders (after the Apollo lunar rover), camera mast,
   umbrella high-gain antenna, solar deck, sampling arm, gun and scoop. */
function makeRover() {
  const g = new THREE.Group(), u = g.userData;
  g.add(at(box(0.86, 1.34, 0.07, ALU), 0, 0, -0.05), at(box(0.7, 0.86, 0.22, WHITE), 0, -0.12, 0.1), at(box(0.72, 0.8, 0.02, PANEL), 0, -0.14, 0.225));
  for (const sx of [-1, 1]) g.add(at(box(0.06, 1.3, 0.05, GREY), sx * 0.4, 0, -0.02), at(box(0.14, 0.5, 0.16, FOIL), sx * 0.43, -0.15, 0.07));
  g.add(at(box(0.5, 0.3, 0.16, FOIL), 0, 0.5, 0.07), at(box(0.3, 0.2, 0.12, WHITE), 0.2, -0.55, 0.09));
  // mast with stereo cameras
  g.add(at(cyl(0.022, 0.028, 0.8, 8, ALU), -0.3, 0.3, 0.62), at(box(0.05, 0.05, 0.08, GREY), -0.3, 0.3, 1.02), at(box(0.26, 0.1, 0.1, WHITE), -0.3, 0.32, 1.1));
  for (const sx of [-0.08, 0.08]) { const l = cyl(0.028, 0.028, 0.05, 12, GLASS); l.rotation.x = Math.PI / 2; g.add(at(l, -0.3 + sx, 0.385, 1.1)); }
  // umbrella antenna
  const dish = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.1, 20, 1, true), MESH); dish.geometry.rotateX(-Math.PI / 2); dish.castShadow = true; dish.rotation.x = 0.45;
  g.add(at(dish, 0.3, -0.5, 0.95), strut(V(0.3, -0.5, 0.15), V(0.3, -0.5, 0.92), 0.015, ALU), at(ball(0.03, GREY, 8), 0.3, -0.46, 1.03));
  u.wheels = [];
  const tg = new THREE.TorusGeometry(0.19, 0.045, 8, 24); tg.rotateY(Math.PI / 2);
  const hg = new THREE.CylinderGeometry(0.19, 0.19, 0.035, 20); hg.rotateZ(Math.PI / 2); const hub = new THREE.CylinderGeometry(0.07, 0.07, 0.14, 12); hub.rotateZ(Math.PI / 2);
  const fg = new THREE.CylinderGeometry(0.27, 0.27, 0.19, 12, 1, true, 0, Math.PI * 0.75); fg.rotateZ(Math.PI / 2); fg.rotateX(Math.PI / 2 - Math.PI * 0.125);
  for (const [x, y] of [[-0.56, 0.52], [0.56, 0.52], [-0.56, -0.52], [0.56, -0.52]]) {
    const piv = new THREE.Group(); piv.position.set(x, y, -0.3);
    const w = new THREE.Group(), tire = new THREE.Mesh(tg, MESH); tire.castShadow = true; w.add(tire, new THREE.Mesh(hg, DARK), new THREE.Mesh(hub, ALU));
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, t = box(0.13, 0.035, 0.02, GREY); t.position.set(0, Math.cos(a) * 0.235, Math.sin(a) * 0.235); t.rotation.x = a; t.rotation.z = i % 2 ? 0.5 : -0.5; w.add(t); }   // chevron treads, so the spin shows
    const fen = new THREE.Mesh(fg, ORANGE); fen.castShadow = true; piv.add(w, fen, at(box(0.03, 0.03, 0.3, GREY), -Math.sign(x) * 0.1, 0, 0.16));
    g.add(piv, strut(V(Math.sign(x) * 0.36, y, -0.03), V(Math.sign(x) * 0.44, y, -0.06), 0.03, GREY)); u.wheels.push({ piv, w, x, y });
  }
  // gun: housing, twin barrels, magazine
  u.turret = new THREE.Group(); u.turret.position.set(0.24, 0.25, 0.3);
  u.turret.add(box(0.18, 0.26, 0.13, DARK), at(box(0.1, 0.14, 0.12, GREY), 0.12, -0.02, 0)); for (const sx of [-0.035, 0.035]) { const b = cyl(0.016, 0.02, 0.5, 8, GREY); b.rotation.x = -Math.PI / 2; u.turret.add(at(b, sx, 0.32, 0.01)); }
  u.turret.add(at(cyl(0.04, 0.04, 0.05, 10, DARK), 0, 0.14, 0.01)); g.add(u.turret);
  // arm: yaw base -> shoulder -> elbow -> three-finger gripper
  u.armBase = new THREE.Group(); u.armBase.position.set(-0.05, 0.6, 0.22); g.add(u.armBase, at(cyl(0.07, 0.08, 0.06, 14, GREY), -0.05, 0.6, 0.19));
  u.shoulder = new THREE.Group(); u.armBase.add(u.shoulder); u.shoulder.add(ball(0.055, DARK, 10));
  const l1 = cyl(0.028, 0.034, ARM_L, 8, ALU); l1.rotation.x = -Math.PI / 2; l1.position.y = ARM_L / 2; u.shoulder.add(l1);
  u.elbow = new THREE.Group(); u.elbow.position.y = ARM_L; u.shoulder.add(u.elbow); u.elbow.add(ball(0.045, DARK, 10));
  const l2 = cyl(0.022, 0.028, ARM_L, 8, ALU); l2.rotation.x = -Math.PI / 2; l2.position.y = ARM_L / 2; u.elbow.add(l2);
  u.grip = new THREE.Group(); u.grip.position.y = ARM_L; u.elbow.add(u.grip); u.grip.add(ball(0.035, DARK, 8));
  for (let i = 0; i < 3; i++) { const a = i * 2.094, f = box(0.022, 0.15, 0.022, GREY); f.position.set(Math.cos(a) * 0.055, 0.07, Math.sin(a) * 0.055); f.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35); u.grip.add(f); }
  u.scoop = box(0.95, 0.06, 0.26, mat(0xc8a030, { metalness: 0.8, roughness: 0.4 })); u.scoop.position.set(0, 0.74, -0.18); u.scoop.rotation.x = 0.35; u.scoop.visible = false; g.add(u.scoop);
  if (V3 && MODELS.rover) {                             // NASA's Perseverance model takes the place of the hand-built body; the working arm, gun and scoop stay
    for (const c of g.children) if (c !== u.armBase && c !== u.turret && c !== u.scoop) c.visible = false;
    const m = fit(MODELS.rover, 2.15, 'w', V3YAW.rover); m.scale.setScalar(0.74); m.position.z = -0.57; g.add(m); u.nasa = m;
    u.armBase.position.set(-0.32, 0.72, 0.18); u.turret.position.set(0.24, 0.46, 0.44);
    g.add(strut(V(0.24, 0.46, 0.37), V(0, 0.4, 0.33), 0.032, ALU), strut(V(0, 0.4, 0.34), V(0, 0.4, -0.2), 0.04, ALU), strut(V(0.24, 0.46, 0.37), V(0.05, 0.4, 0.05), 0.02, GREY), at(cyl(0.09, 0.11, 0.05, 14, GREY), 0, 0.4, 0.33));     // the gun's mount: a post rising from the deck, an arm and a brace
  }
  return g;
}
function makeBase() {                                    // the station that stays at Tranquility Base: habitat, solar wings, dish. Invented.
  if (V3 && MODELS.hab1) { const both = new THREE.Group(); both.add(MODELS.hab1, MODELS.hab2); const g = new THREE.Group(); g.add(fit(both, 9.5, 'w', V3YAW.hab));        // NASA's Habitat Demonstration Unit
    if (MODELS.astro) { const a = fit(MODELS.astro, 1.85, 'h', 2.4); a.position.set(3.2, -6.4, 0); g.add(a); }
    return g; }
  const g = new THREE.Group();
  const hg = new THREE.CylinderGeometry(1.35, 1.35, 3.2, 20); hg.rotateZ(Math.PI / 2); const hab = new THREE.Mesh(hg, WHITE); hab.castShadow = true; g.add(at(hab, 0, 0, 1.95));
  for (const sx of [-1, 1]) { g.add(at(ball(1.35, WHITE, 20), sx * 1.6, 0, 1.95)); const wing = box(3.4, 0.04, 1.5, PANEL); wing.position.set(sx * 4.6, 0, 3.0); wing.rotation.y = sx * 0.45; g.add(wing, strut(V(sx * 2.4, 0, 2.6), V(sx * 3.1, 0, 2.95), 0.05, ALU)); }
  for (const [x, y] of [[-1.6, -1], [-1.6, 1], [1.6, -1], [1.6, 1]]) g.add(strut(V(x, y * 0.7, 1.2), V(x * 1.15, y * 1.5, 0.06), 0.06, ALU), at(cyl(0.3, 0.3, 0.06, 14, FOIL), x * 1.15, y * 1.5, 0.03));
  g.add(at(box(1.0, 0.5, 1.5, FOIL), 0, 1.45, 1.6), at(box(0.6, 0.06, 1.0, GLASS), 0, 1.72, 1.7));   // airlock and hatch
  g.add(strut(V(0.6, -0.4, 3.2), V(0.6, -0.4, 5.6), 0.03, ALU)); const dish = cyl(0.7, 0.06, 0.3, 20, MESH); dish.rotation.x = 0.9; g.add(at(dish, 0.6, -0.4, 5.75));
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: 0x66ff99 })), 0.6, -0.4, 6.15));
  return g;
}
/* Gems: three minerals, three shapes. The real ones are dull dark grains; the glow is there so they can be found. */
const GEMMAT = [null,
  new THREE.MeshStandardMaterial({ color: 0x3b6fd8, emissive: 0x1750c8, emissiveIntensity: 1.2, metalness: 1, roughness: 0.18, flatShading: true }),
  new THREE.MeshStandardMaterial({ color: 0x35e39a, emissive: 0x0fae62, emissiveIntensity: 1.6, metalness: 0.3, roughness: 0.12, flatShading: true }),
  new THREE.MeshStandardMaterial({ color: 0xfff0b8, emissive: 0xffb830, emissiveIntensity: 2.6, metalness: 0.9, roughness: 0.1, flatShading: true })];
const glowTex = (a, b) => canvasTex(64, 64, x => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, a); g.addColorStop(0.3, b); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
const HALO = [null, ['rgba(120,170,255,.9)', 'rgba(60,110,255,.3)'], ['rgba(120,255,190,.9)', 'rgba(30,220,130,.3)'], ['rgba(255,240,180,1)', 'rgba(255,190,70,.5)']].map(c => c && new THREE.SpriteMaterial({ map: glowTex(c[0], c[1]), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
const GEMGEO = [null, new THREE.CylinderGeometry(0.085, 0.085, 0.028, 6), new THREE.CylinderGeometry(0.012, 0.04, 0.2, 6), new THREE.OctahedronGeometry(0.06, 0)];
function makeGem(type) {
  const g = new THREE.Group(), r = rng(1000 + type * 77 + ((Math.random() * 1e6) | 0)), add = (m, sc) => { m.castShadow = true; g.add(m); return m; };
  if (type === 1) for (let i = 0; i < 6; i++) { const m = add(new THREE.Mesh(GEMGEO[1], GEMMAT[1])); m.position.set((r() - 0.5) * 0.12, (r() - 0.5) * 0.12, i * 0.022); m.rotation.set(Math.PI / 2 + (r() - 0.5) * 0.9, (r() - 0.5) * 0.9, r() * 3); m.scale.setScalar(0.7 + r() * 0.6); }      // ilmenite: stacked hexagonal plates
  else if (type === 2) for (let i = 0; i < 8; i++) { const m = add(new THREE.Mesh(GEMGEO[2], GEMMAT[2])), a = r() * 6.283, t = 0.15 + r() * 0.75; m.position.set(Math.sin(t) * Math.cos(a) * 0.07, Math.sin(t) * Math.sin(a) * 0.07, Math.cos(t) * 0.07); m.quaternion.setFromUnitVectors(V(0, -1, 0), V(Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t))); m.scale.set(1, 0.6 + r() * 0.8, 1); }   // thorium ore: a spray of prisms
  else { add(new THREE.Mesh(GEMGEO[3], GEMMAT[3])).scale.setScalar(1.5); for (let i = 0; i < 14; i++) { const m = add(new THREE.Mesh(GEMGEO[3], GEMMAT[3])), d = V(r() - 0.5, r() - 0.5, r() * 0.9).normalize(); m.position.copy(d).multiplyScalar(0.11); m.quaternion.setFromUnitVectors(V(0, 1, 0), d); m.scale.set(0.35, 1.6 + r() * 1.6, 0.35); }      // armalcolite: radiating golden blades
    if (!V4) { const L = new THREE.PointLight(0xffc860, 2.2, 7, 2); L.position.z = 0.25; g.add(L); } }      // version 4 finds many more: lights would slow it down
  const sp = new THREE.Sprite(HALO[type]); sp.scale.setScalar(type === 3 ? 1.5 : 0.55); sp.position.z = 0.05; g.add(sp);
  g.scale.setScalar(GEM[type].scale); return g;
}
const BASE = { x: -118, y: -48 };

/* ====================================================================== game state */
const LEVELS = [0, 60, 150, 300, 500, 800, 1200, 2000];        // total energy captured
const LAUNCH = 10000;                                     // captured energy needed for the trip to the Earth
const PERKS = [
  null,
  { name: 'Rover deployed', vmax: 2.5, mu: 0.55, blastD: 0.35, blast: 1, liftD: 0.30, push: 15 },
  { name: 'Faster motors', vmax: 4.0, mu: 0.6, blastD: 0.35, blast: 1, liftD: 0.30, push: 30 },
  { name: 'Gun II: heavier rounds, deeper craters', vmax: 4.0, mu: 0.6, blastD: 0.7, blast: 2, liftD: 0.42, push: 60 },
  { name: 'Scoop blade: dig for buried gems', vmax: 4.5, mu: 0.65, blastD: 0.7, blast: 2, liftD: 0.42, push: 150, scoop: true },
  { name: 'Climbing claws: slopes up to 45°', vmax: 6.0, mu: 1.0, blastD: 0.7, blast: 2, liftD: 0.5, push: 250, scoop: true },
  { name: 'Laser: a beam instead of bullets, it cuts through any rock', vmax: 8.0, mu: 1.05, blastD: 1.05, blast: 3, liftD: 0.5, push: 400, scoop: true },
  { name: 'Hop thrusters', vmax: 9.0, mu: 1.1, blastD: 1.05, blast: 3, liftD: 0.6, push: 600, scoop: true, hop: true },
  { name: 'Flight thrusters: the rover can fly to another region (it uses energy fast)', vmax: 9.0, mu: 1.1, blastD: 1.05, blast: 3, liftD: 0.6, push: 600, scoop: true, hop: true, fly: true },
];
const KEEP_OUT = 75;                                     // m around the Apollo 11 descent stage where tools are locked
const G = { mode: 'lander', points: 0, level: 1, t: 0, shake: 0, overlay: false, cam: 0, soundOn: true, energy: 60, flat: false, names: true, det: 99, stats: { rocks: 0, th: 0, il: 0, ar: 0, shot: 0 }, mile: 0, ready: false, area: '' };
try { localStorage.removeItem('lunar-rover-v1'); } catch (_) {}      // earlier versions kept the score; nothing is kept any more
function save() {}                                       // every visit is a new game: reloading the page resets all counters
/* energy: every function of the rover draws on it; thorium ore tops it up without limit, sunlight only trickles */
const COST = { drive: 0.3, shot: 0.25, grab: 0.6, dig: 2, hop: 4, solar: 0.04, baseRate: 8, baseMax: 100, thorium: 40, ilmenite: 10, armalcolite: 150 };
function need(e) { if (G.energy < e) { toast(G.flat ? 'Battery flat — solar power only.\nFind thorium ore, or go back to base.' : 'Not enough energy for that', 2200); return false; } G.energy -= e; return true; }
const levelOf = p => { let l = 1; while (l < LEVELS.length && p >= LEVELS[l]) l++; return l; };
G.level = levelOf(G.points);
const perk = () => PERKS[G.level];
/* ore becomes energy: it fills the battery and counts towards the levels (G.points = total energy captured) */
function addPoints(n, why) {
  G.points += n; G.energy += n; save();
  const nl = levelOf(G.points);
  if (!G.ready && G.points >= LAUNCH && V4) { G.ready = true; sfx.fanfare(); bigNews(); buildActs(); }
  else if (!G.ready && G.points >= LAUNCH) { G.ready = true; toast(`${LAUNCH.toLocaleString('en-US')} units of energy captured.\nNOW YOU ARE READY TO TAKE OFF FOR THE EARTH.\nPress B to return to base, board the lander and climb to orbit.`, 12000); sfx.level(); }
  else if (nl > G.level) { G.level = nl; toast(`LEVEL ${nl}\n${perk().name}`, 5000); sfx.level(); rover.obj.userData.scoop.visible = !!perk().scoop; buildActs(); }
  else if (why) toast(`+${n} energy\n${why}`, 1800);
  if (G.points >= SURVEY && !mini.all && mini.bg) { mini.revealAll(); setTimeout(() => { sfx.fanfare(); toast(`SURVEY DATA UNLOCKED\nThe map now shows every deposit on the Moon.\nClick the map${touchUI ? '' : ' (or press Z)'} to enlarge it.`, 8000); }, 1700); }
  G.level = nl; hudScore(); const el = $('pts'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  while (G.mile < MILES.length && G.points >= MILES[G.mile] && G.points < LAUNCH) { const m = MILES[G.mile++]; setTimeout(() => { sfx.fanfare(); toast(`${m.toLocaleString('en-US')} OF ${LAUNCH.toLocaleString('en-US')}\nAt ${LAUNCH.toLocaleString('en-US')} press B: back to base, aboard the lander, and home to the Earth.`, 7000); }, 1600); }
}
const MILES = [1000, 3000, 5000, 8000], SURVEY = 500;   // energy captured at which the whole map is handed over
let toastT = 0;
function toast(t, ms = 2500) { const m = $('msg'); m.textContent = t; m.style.opacity = 1; clearTimeout(toastT); toastT = setTimeout(() => { m.style.opacity = 0; }, ms); }

/* ====================================================================== sound (synthesised; there is no air to carry sound — this is what the rover's own chassis would hear) */
/* Nothing carries sound on the Moon. What is synthesised here is what the vehicle's own structure would carry to a
   microphone inside it: motors, the gun's action, impacts and the ground under the wheels — and a Geiger-style counter. */
const sfx = {
  ctx: null,
  kick() { if (!G.soundOn) return; if (!this.ctx) this.build(); if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  build() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; let c; try { c = this.ctx = new AC(); } catch (_) { return; }
    const comp = c.createDynamicsCompressor(); this.out = c.createGain(); this.out.gain.value = V4 ? 0.95 : 0.7; this.out.connect(comp).connect(c.destination);
    if (V4) {                                             // a long, dark echo gives every sound the size of the place
      const n = Math.floor(3.2 * c.sampleRate), ir = c.createBuffer(2, n, c.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); let lp = 0; for (let i = 0; i < n; i++) { lp = 0.82 * lp + 0.18 * (Math.random() * 2 - 1); d[i] = lp * Math.pow(1 - i / n, 2.6) * (i < 400 ? i / 400 : 1); } }
      const cv = c.createConvolver(), wet = c.createGain(); cv.buffer = ir; wet.gain.value = 0.55; this.out.connect(cv).connect(wet).connect(comp); }
    const n = 2 * c.sampleRate, mk = brown => { const b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); let v = 0; for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; if (brown) { v = 0.99 * v + 0.12 * w; d[i] = v * 1.6; } else d[i] = w; } return b; };
    this.white = mk(false); this.brown = mk(true);
    const loop = (buf, type, f, q) => { const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = buf; s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q; g.gain.value = 0; s.connect(fl).connect(g).connect(this.out); s.start(); return { f: fl, g }; };
    this.eng = loop(this.brown, 'lowpass', 90, 0.7);        // main engine: a deep rumble through the hull
    this.hiss = loop(this.white, 'bandpass', 2200, 0.6);    // propellant feed and thrusters
    this.crunch = loop(this.white, 'bandpass', 1300, 0.9);  // regolith under the wheels
    const o1 = c.createOscillator(), o2 = c.createOscillator(), lp = c.createBiquadFilter(), mg = c.createGain(); o1.type = 'sawtooth'; o2.type = 'square'; lp.type = 'lowpass'; lp.frequency.value = 500; mg.gain.value = 0;
    o1.connect(lp); o2.connect(lp); lp.connect(mg).connect(this.out); o1.start(); o2.start(); this.mot = { o1, o2, lp, g: mg };     // drive motors and gearboxes
  },
  /* continuous sounds follow the state of the vehicles */
  frame(dt, st) {
    const c = this.ctx; if (!c || c.state !== 'running') return; const t = c.currentTime, on = G.soundOn ? 1 : 0;
    this.eng.g.gain.setTargetAtTime((V4 ? 0.95 : 0.55) * st.thrust * on, t, 0.12); this.eng.f.frequency.setTargetAtTime(70 + 260 * st.thrust, t, 0.2);
    this.hiss.g.gain.setTargetAtTime((V4 ? 0.09 : 0.05) * st.thrust * on, t, 0.1);
    const w = Math.min(1.4, st.wheel);
    this.mot.g.gain.setTargetAtTime((0.012 + 0.035 * Math.abs(st.throttle)) * (w > 0.02 || st.throttle ? 1 : 0) * on, t, 0.08);
    this.mot.o1.frequency.setTargetAtTime(38 + 150 * w, t, 0.1); this.mot.o2.frequency.setTargetAtTime((38 + 150 * w) * 3.02, t, 0.1); this.mot.lp.frequency.setTargetAtTime(300 + 900 * w, t, 0.1);
    this.crunch.g.gain.setTargetAtTime(st.ground ? 0.05 * Math.min(1, st.speed / 3) * on : 0, t, 0.06);
    if (on && Math.random() < st.geiger * dt) this.tick(0.16);
  },
  nz(dur, type, f0, f1, vol, buf) { const c = this.ctx; if (!c || !G.soundOn) return; const t = c.currentTime, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = buf || this.white; s.loop = true; fl.type = type; fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); s.connect(fl).connect(g).connect(this.out); s.start(t, Math.random()); s.stop(t + dur + 0.02); },
  tone(f0, f1, dur, type = 'sine', vol = 0.3) { const c = this.ctx; if (!c || !G.soundOn) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); o.connect(g).connect(this.out); o.start(t); o.stop(t + dur + 0.02); },
  tick(v) { this.nz(0.006, 'highpass', 3000, 3000, v); },                                    // one count of the detector
  shot() { this.nz(0.045, 'bandpass', 1800, 500, 0.5); this.tone(150, 55, 0.07, 'triangle', 0.5); if (V4) { this.tone(70, 28, 0.3, 'sine', 0.7); this.nz(0.09, 'lowpass', 600, 80, 0.4, this.brown); } },
  quindar(f) { this.tone(f, f, 0.25, 'sine', 0.16); },     // the Apollo radio tones: 2525 Hz before a call, 2475 Hz after
  static(dur) { this.nz(dur, 'bandpass', 2200, 1600, 0.035); },   // the action cycling and the recoil thump
  chip() { this.nz(0.05, 'bandpass', 2600, 900, 0.18); },
  boom(k = 1) { this.tone(75, 26, 0.45 + 0.25 * k, 'sine', 0.7); this.nz(0.3 + 0.15 * k, 'lowpass', 420, 60, 0.6, this.brown); for (let i = 1; i <= 4; i++) setTimeout(() => this.nz(0.03, 'bandpass', 900, 400, 0.12), 180 * i + Math.random() * 200); },   // felt through the ground, then fragments rattling off the chassis
  servo(dur = 0.45) { const c = this.ctx; if (!c || !G.soundOn) return; const t = c.currentTime, o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(170, t); o.frequency.linearRampToValueAtTime(260, t + dur * 0.5); o.frequency.linearRampToValueAtTime(190, t + dur);
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 3; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + 0.04); g.gain.setValueAtTime(0.09, t + dur - 0.05); g.gain.linearRampToValueAtTime(0, t + dur); o.connect(f).connect(g).connect(this.out); o.start(t); o.stop(t + dur + 0.02); },
  grab() { this.tone(240, 90, 0.05, 'square', 0.16); this.nz(0.03, 'bandpass', 1500, 700, 0.2); },
  /* a struck bell: a few inharmonic partials, each dying at its own rate */
  bell(f, at, dur, vol) { const c = this.ctx; if (!c || !G.soundOn) return; const t = c.currentTime + at; for (const [m, a] of [[1, 1], [2.01, 0.55], [3.02, 0.32], [4.19, 0.2], [5.43, 0.12]]) { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = f * m; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol * a, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0006, t + dur / Math.sqrt(m)); o.connect(g).connect(this.out); o.start(t); o.stop(t + dur + 0.05); } },
  brass(f, at, dur, vol) { const c = this.ctx; if (!c || !G.soundOn) return; const t = c.currentTime + at, lp = c.createBiquadFilter(), g = c.createGain(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(400, t); lp.frequency.linearRampToValueAtTime(2600, t + 0.12); lp.frequency.linearRampToValueAtTime(900, t + dur); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.05); g.gain.setValueAtTime(vol, t + dur * 0.7); g.gain.linearRampToValueAtTime(0, t + dur);
    for (const d of [-7, 0, 7]) { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; o.connect(lp); o.start(t); o.stop(t + dur + 0.05); } lp.connect(g).connect(this.out); },
  sparkle(at, n, vol) { for (let i = 0; i < n; i++) this.bell(2400 + Math.random() * 3200, at + i * 0.045, 0.35, vol * (0.5 + Math.random() * 0.5)); },
  /* each mineral has its own voice: ilmenite a bright three-note chime, thorium a counter burst and a rising run, armalcolite a fanfare */
  ore(th) { if (th) { for (let i = 0; i < 18; i++) setTimeout(() => this.tick(0.3), i * 22); [784, 988, 1175, 1568].forEach((f, i) => this.bell(f, 0.12 + i * 0.085, 1.0, 0.34)); this.tone(110, 70, 0.35, 'sine', 0.5); this.sparkle(0.5, 6, 0.12); }
    else { [1047, 1319, 1568].forEach((f, i) => this.bell(f, i * 0.08, 0.9, 0.36)); this.sparkle(0.25, 4, 0.1); } },
  rare() { [262, 330, 392, 523].forEach((f, i) => this.brass(f, i * 0.11, 1.5 - i * 0.11, 0.2)); [523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => this.bell(f, 0.1 + i * 0.07, 1.8, 0.34)); this.tone(65, 65, 1.6, 'sine', 0.6); this.sparkle(0.6, 16, 0.16); },
  fanfare() { [[392, 0], [392, 0.16], [392, 0.32], [523, 0.48], [659, 0.9], [784, 1.06]].forEach(([f, t], i) => this.brass(f, t, i === 3 || i === 5 ? 0.55 : 0.15, 0.2)); this.sparkle(1.1, 10, 0.12); },
  laser() { const c = this.ctx; if (!c || !G.soundOn) return; this.tone(2400, 500, 0.13, 'sawtooth', 0.16); this.tone(1200, 260, 0.16, 'square', 0.1); this.nz(0.12, 'bandpass', 5000, 1800, 0.14); },
  bigBoom() { this.tone(160, 18, 2.2, 'sine', 1.0); this.tone(90, 24, 1.6, 'triangle', 0.7); this.nz(2.4, 'lowpass', 3000, 40, 1.0, this.brown); this.nz(0.5, 'highpass', 900, 3000, 0.7); for (let i = 1; i <= 14; i++) setTimeout(() => this.nz(0.05 + Math.random() * 0.1, 'bandpass', 600 + Math.random() * 2000, 200, 0.3), 120 * i + Math.random() * 150); },
  level() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, f, 0.3, 'triangle', 0.2), i * 110)); },
  thud(v) { this.nz(0.14, 'lowpass', 260, 50, clamp(v * 0.2, 0.06, 0.6), this.brown); this.tone(60, 35, 0.12, 'sine', clamp(v * 0.12, 0.05, 0.4)); },
  dig() { this.nz(0.5, 'bandpass', 500, 1400, 0.4); this.servo(0.5); }, toss() { this.tone(170, 340, 0.09, 'sawtooth', 0.1); this.nz(0.04, 'bandpass', 1200, 600, 0.12); }, hop() { this.nz(0.35, 'highpass', 1200, 2500, 0.3); this.tone(90, 50, 0.3, 'sine', 0.3); },
};

/* ====================================================================== music for the journey home.
   Three short original pieces, synthesised here: slow minor strings for deep space, a driving low pulse for the
   atmosphere, a ticking, climbing figure for the descent. No recordings are used. */
const music = {
  on: null, timer: 0, bar: 0, next: 0, g: null,
  N: n => 440 * Math.pow(2, (n - 69) / 12),
  pad(notes, t, dur, vol, cut = 900) { const c = sfx.ctx, lp = c.createBiquadFilter(), g = c.createGain(); lp.type = 'lowpass'; lp.frequency.value = cut; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.35); g.gain.setValueAtTime(vol, t + dur * 0.7); g.gain.linearRampToValueAtTime(0, t + dur * 1.15);
    for (const n of notes) for (const d of [-8, 7]) { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = this.N(n); o.detune.value = d; o.connect(lp); o.start(t); o.stop(t + dur * 1.2); } lp.connect(g).connect(this.g); },
  note(n, t, dur, vol, type = 'triangle') { const c = sfx.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = this.N(n); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0008, t + dur); o.connect(g).connect(this.g); o.start(t); o.stop(t + dur + 0.05); },
  low(n, t, dur, vol) { const c = sfx.ctx, o = c.createOscillator(), lp = c.createBiquadFilter(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.value = this.N(n); lp.type = 'lowpass'; lp.frequency.value = 260; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); o.connect(lp).connect(g).connect(this.g); o.start(t); o.stop(t + dur + 0.05); },
  hat(t, vol) { const c = sfx.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = sfx.white; f.type = 'highpass'; f.frequency.value = 6000; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.05); s.connect(f).connect(g).connect(this.g); s.start(t, Math.random()); s.stop(t + 0.08); },
  T: {
    moon: { len: 8, play(m, i, t) { const ch = [[38, 45, 50, 53, 57], [36, 43, 48, 52, 55], [34, 41, 46, 50, 53], [33, 40, 45, 48, 52]][i % 4];      // slow, wide chords and a few distant bells, for the hours on the surface
        m.pad(ch, t, 8, 0.035, 520 + 160 * Math.sin(i * 0.9)); m.low(ch[0] - 12, t, 7.5, 0.09); if (i % 2 === 0) m.note(ch[4] + 24, t + 2 + (i % 3), 5, 0.035, 'sine'); if (i % 3 === 1) m.note(ch[2] + 31, t + 5, 4, 0.02, 'sine'); } },
    space: { len: 4.8, play(m, i, t) { const ch = [[45, 52, 57, 60, 64], [41, 48, 57, 60, 65], [48, 55, 60, 64, 67], [40, 47, 55, 59, 64]][i % 4], mel = [[76, 0, 74, 72], [72, 0, 69, 0], [67, 0, 72, 76], [74, 0, 71, 0]][i % 4];
        m.pad(ch, t, 4.8, 0.05, 800 + 250 * Math.sin(i * 0.7)); m.low(ch[0] - 12, t, 4.5, 0.16); mel.forEach((n, k) => { if (n) { m.note(n, t + k * 1.2, 2.4, 0.07, 'sine'); m.note(n + 12, t + k * 1.2, 1.6, 0.018, 'sine'); } }); } },
    fire: { len: 1.714, play(m, i, t) { const up = Math.floor(i / 4) % 4, root = 38 + up; for (let k = 0; k < 8; k++) m.low(root + (k === 6 ? 1 : 0), t + k * 0.214, 0.2, 0.2); if (i % 2 === 0) m.pad([root + 12, root + 15, root + 18], t, 3.4, 0.045, 1300); for (let k = 0; k < 16; k++) if (k % 4 !== 0) m.hat(t + k * 0.107, 0.035); m.note(root + 24 + [0, 3, 6, 3][i % 4], t, 0.5, 0.05, 'square'); } },
    descent: { len: 2.4, play(m, i, t) { const ch = [[52, 59, 64, 67], [48, 55, 64, 67], [45, 52, 60, 64], [47, 54, 59, 63]][i % 4], arp = [64, 67, 71, 67, 72, 71, 67, 64]; for (let k = 0; k < 8; k++) { m.hat(t + k * 0.3, k % 2 ? 0.03 : 0.06); m.note(arp[k] + (i % 4 === 3 ? -1 : 0), t + k * 0.3, 0.28, 0.07); } m.pad(ch, t, 2.4, 0.04, 1000); m.low(ch[0] - 12, t, 1.1, 0.14); m.low(ch[0] - 12, t + 1.2, 1.1, 0.1); } },
  },
  play(name) { if (this.on === name) return; this.stop(); if (!G.soundOn) return; sfx.kick(); const c = sfx.ctx; if (!c) return; this.on = name; this.g = c.createGain(); this.g.gain.value = 0; this.g.gain.linearRampToValueAtTime(0.9, c.currentTime + 1.5); this.g.connect(sfx.out); this.bar = 0; this.next = c.currentTime + 0.15;
    const tr = this.T[name]; this.timer = setInterval(() => { if (c.state !== 'running') return; while (this.next < c.currentTime + 0.4) { tr.play(this, this.bar++, this.next); this.next += tr.len; } }, 120); },
  stop() { clearInterval(this.timer); this.timer = 0; this.on = null; if (this.g && sfx.ctx) { const g = this.g, t = sfx.ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + 0.6); setTimeout(() => { try { g.disconnect(); } catch (_) {} }, 900); } this.g = null; },
};

/* ====================================================================== world objects (filled in after loading) */
let terrain, clip, rocks, rover, lander, eagle, base, particles;
/* What the region is made of, measured from orbit: Lunar Prospector gamma-ray spectrometer, 5° map (tools/fetch_lp_grs.py).
   Read between cell centres by linear interpolation. It sets how often rocks hold thorium ore and titanium minerals. */
const lp = {
  g: null, site: null,
  async load() { try { const j = await (await fetch('data/lp_grs_5deg.json', { cache: 'no-cache' })).json(); this.g = j.grid; this.site = this.at(terrain.site.lat, terrain.site.lon); } catch (e) { console.warn('element maps not available:', e.message); } },
  at(lat, lon) {
    if (!this.g) return null; const fy = clamp((lat + 87.5) / 5, 0, 35), y0 = Math.min(34, Math.floor(fy)), ty = fy - y0, fx = (lon + 177.5) / 5, x0 = Math.floor(fx), tx = fx - x0, xa = ((x0 % 72) + 72) % 72, xb = (xa + 1) % 72, o = {};
    for (const k in this.g) { const q = this.g[k]; o[k] = (q[y0][xa] * (1 - tx) + q[y0][xb] * tx) * (1 - ty) + (q[y0 + 1][xa] * (1 - tx) + q[y0 + 1][xb] * tx) * ty; } return o;
  },
  /* how much more (or less) thorium and titanium than at Tranquility Base */
  /* Deposits: patches 30-90 km across where the game makes one mineral plentiful, scattered over the whole Moon so that
     no single region has everything. They are invented; only the gentle background underneath follows the orbital maps.
     Three of them are placed within reach of the base, in different directions. */
  deposits: (() => { const r = rng(20261119), d = [{ type: 1, lat: 0.9, lon: 24.0, rad: 9, k: 4 }, { type: 2, lat: 1.5, lon: 22.7, rad: 12, k: 5 }, { type: 3, lat: -0.5, lon: 23.9, rad: 10, k: 6 }].concat(V4 ? [{ type: 1, lat: 0.666, lon: 23.457, rad: 0.7, k: 6 }, { type: 2, lat: 0.74, lon: 23.47, rad: 1.0, k: 7 }, { type: 3, lat: 0.66, lon: 23.555, rad: 1.0, k: 7 }] : []);
    for (let type = 1; type <= 3; type++) for (let i = 0; i < (V4 ? 55 : 30); i++) d.push({ type, lat: Math.asin(2 * r() - 1) * R2D * 0.86, lon: r() * 360 - 180, rad: V4 ? 40 + r() * 80 : 30 + r() * 60, k: V4 ? 4 + r() * 5 : 2.5 + r() * 3.5 }); return d; })(),
  boost(lat, lon) { const b = [0, 0, 0, 0], c = Math.cos(lat * D2R); for (const d of this.deposits) { const dy = (lat - d.lat) * 30.32, dx = wrap180(lon - d.lon) * 30.32 * c, q = (dx * dx + dy * dy) / (d.rad * d.rad); if (q < 6) b[d.type] += d.k * Math.exp(-q); } return b; },
  inDeposit(lat, lon) { const c = Math.cos(lat * D2R); let best = null; for (const d of this.deposits) { const dy = (lat - d.lat) * 30.32, dx = wrap180(lon - d.lon) * 30.32 * c; if (dx * dx + dy * dy < d.rad * d.rad && (!best || d.k > best.k)) best = d; } return best; },
  /* how likely thorium ore, ilmenite and armalcolite are here, relative to plain ground at Tranquility Base */
  factors(lat, lon) { const a = this.at(lat, lon), b = this.boost(lat, lon), th = a && this.site ? clamp(a.Th_ppm / this.site.Th_ppm, 0.4, 2) : 1, ti = a && this.site ? clamp(a.TiO2_wt / this.site.TiO2_wt, 0.3, 1.5) : 1; return [th * (1 + b[2]), ti * (1 + b[1]), ti * (1 + b[3])]; },
  text(lat, lon) { const a = this.at(lat, lon); return a ? `Th ${fm(a.Th_ppm, 1)} ppm · TiO₂ ${fm(a.TiO2_wt, 1)}%` : ''; },
};
const tmp = { a: V(), b: V(), c: V(), d: V(), e: V(), f: V(), q: new THREE.Quaternion(), m: new THREE.Matrix4(), s: V() };

/* ---------------------------------------------------------------------- ejecta: ballistic points, no drag, no cloud */
class Particles {
  constructor(n) {
    this.n = n; this.pos = new Float32Array(n * 3); this.vel = new Float32Array(n * 3); this.life = new Float32Array(n); this.i = 0; this.alive = 0;
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xb4ada2, size: 0.07, sizeAttenuation: true }));
    this.pts.frustumCulled = false; scene.add(this.pts); this.pos.fill(1e9);
  }
  emit(x, y, z, vx, vy, vz) { const k = this.i = (this.i + 1) % this.n, o = 3 * k; this.pos[o] = x; this.pos[o + 1] = y; this.pos[o + 2] = z; this.vel[o] = vx; this.vel[o + 1] = vy; this.vel[o + 2] = vz; this.life[k] = 1; }
  /* cone of ejecta: speeds and angles spread, everything on its own parabola */
  burst(x, y, z, n, vmin, vmax, elMin, elMax) {
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, el = (elMin + Math.random() * (elMax - elMin)) * D2R, v = vmin + Math.random() * (vmax - vmin);
      this.emit(x, y, z + 0.03, Math.cos(a) * Math.cos(el) * v, Math.sin(a) * Math.cos(el) * v, Math.sin(el) * v); }
  }
  step(dt) {
    const p = this.pos, v = this.vel, L = this.life;
    for (let k = 0; k < this.n; k++) {
      if (!L[k]) continue; const o = 3 * k;
      v[o + 2] -= G_MOON * dt; p[o] += v[o] * dt; p[o + 1] += v[o + 1] * dt; p[o + 2] += v[o + 2] * dt;
      if (v[o + 2] < 0 && p[o + 2] < clip.ground(p[o], p[o + 1])) { L[k] = 0; p[o] = p[o + 1] = p[o + 2] = 1e9; }     // lands and stays: no bounce, no drifting dust
    }
    this.pts.geometry.attributes.position.needsUpdate = true;
  }
}

/* ---------------------------------------------------------------------- rocks: predicted from the rock-size statistics; each can be pushed, lifted or blown up */
/* A rock is drawn while it is nearer than VIS times its own size, i.e. while it covers about three pixels or more. So rocks
   never appear or vanish at a size you can see: the big ones are there from far away, the small ones fill in as you come. */
function vnoise(x, y, sd) { const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), h = (a, b) => hash3(a, b, sd) / 4294967296; return (h(ix, iy) * (1 - sx) + h(ix + 1, iy) * sx) * (1 - sy) + (h(ix, iy + 1) * (1 - sx) + h(ix + 1, iy + 1) * sx) * sy; }
/* which mineral's vein runs here (0 = none): only inside a deposit, along a winding line of the noise field */
function veinAt(X, Y, b) { let t = 0; for (let q = 1; q <= 3; q++) if (b[q] > (t ? b[t] : 0)) t = q; if (!t || b[t] < 0.6) return 0; const w = 0.007 + 0.006 * Math.min(1, b[t] / 6); /* the noise sits mostly near 0.5, so the band is kept narrow: a few metres wide */ return Math.abs(vnoise(X / 70, Y / 70, 500 + t) - 0.5) < w ? t : 0; }
const VEINCOL = [null, [0.78, 0.92, 1.3], [0.82, 1.22, 0.92], [1.3, 1.12, 0.7]];
const BUCKET = 2, VIS = touchUI ? 170 : 220, CAP = touchUI ? 500 : 800;
const RCLASS = [{ p: 'a', cell: 8, d0: 0.08, d1: 0.16 }, { p: 'b', cell: 16, d0: 0.16, d1: 0.4 }, { p: 'c', cell: 64, d0: 0.4, d1: 1.0 }];
const GEM = [null, { name: 'ilmenite', scale: 1.2, e: () => COST.ilmenite }, { name: 'thorium ore', scale: 1.5, e: () => COST.thorium }, { name: 'armalcolite', scale: 2.2, e: () => COST.armalcolite }];
class Rocks {
  constructor() {
    this.cells = new Map(); this.removed = new Set(); this.moved = new Map(); this.active = []; this.buckets = new Map(); this.movers = new Set(); this.cx = 1e9; this.cy = 1e9; this.h = 0;
    this.debris = []; this.gems = [];
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0, flatShading: true, envMapIntensity: 0 });
    this.meshes = [];
    if (V3 && SOIL.map) { m.flatShading = false; m.map = SOIL.map; m.bumpMap = SOIL.map; m.bumpScale = 5; m.needsUpdate = true; }      // version 3: rounded stones wearing a real photograph of lunar soil
    for (let v = 0; v < 4; v++) {
      if (V3 && SOIL.map) { const g = asteroidGeo(977 + v * 31, 14, 9); g.scale(1, 1, 0.9); const im = new THREE.InstancedMesh(g, m, CAP); im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; im.count = 0; im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAP * 3).fill(1), 3); scene.add(im); this.meshes.push(im); continue; }
      const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position, r = rng(977 + v * 31);
      const off = new Map();                               // same displacement for coincident vertices, so the rock stays closed
      for (let i = 0; i < p.count; i++) { const k = [p.getX(i), p.getY(i), p.getZ(i)].map(c => c.toFixed(3)).join(); if (!off.has(k)) off.set(k, 0.72 + 0.5 * r()); const sc = off.get(k); p.setXYZ(i, p.getX(i) * sc, p.getY(i) * sc, p.getZ(i) * sc); }
      g.computeVertexNormals();
      const im = new THREE.InstancedMesh(g, m, CAP); im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; im.count = 0;
      im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CAP * 3).fill(1), 3); scene.add(im); this.meshes.push(im);
    }
    this.dm = new THREE.InstancedMesh(this.meshes[0].geometry, m, 320); this.dm.castShadow = true; this.dm.frustumCulled = false; this.dm.count = 0; scene.add(this.dm);
    this.gemGeo = new THREE.OctahedronGeometry(0.11, 0);
    const gm = (c, e, i) => new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: i, roughness: 0.15, metalness: 0.2 });
    this.gemMats = [null, gm(0x4aa8ff, 0x1e6fe0, 1.6), gm(0x2fe08a, 0x10b060, 1.9), gm(0xfff2c0, 0xffc040, 3.2)];
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,236,170,1)'); gr.addColorStop(0.3, 'rgba(255,200,90,.45)'); gr.addColorStop(1, 'rgba(255,180,60,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    this.halo = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  }
  cell(c, ci, cj) {
    const key = c.p + ci + ',' + cj; let list = this.cells.get(key); if (list) return list;
    list = []; const r = rng(hash3(ci, cj, 4242 + c.cell)), K = RULES.rocks, x0 = ci * c.cell - terrain.ax, y0 = cj * c.cell - terrain.ay;      // cells are fixed to the Moon, not to the map
    const slope = terrain.slopeDeg(x0 + c.cell / 2, y0 + c.cell / 2, 3), mult = 1 + Math.min(5, (slope / 7) ** 2);   // assumption: fresher, steeper ground exposes more blocks
    const mean = c.cell * c.cell * K.k * Math.pow(c.d0, K.g) * mult * (V4 ? 1.35 : 1);
    const cl = terrain.toLatLon(x0 + c.cell / 2, y0 + c.cell / 2), [fTh, fTi, fAr] = lp.factors(cl[0], cl[1]);      // richer or poorer ground: orbital maps and deposits
    const boost = V4 ? lp.boost(cl[0], cl[1]) : null;
    const n = Math.max(0, Math.round(mean + Math.sqrt(mean) * (r() + r() + r() - 1.5) * 2));
    for (let i = 0; i < n; i++) {
      let x = x0 + r() * c.cell, y = y0 + r() * c.cell; const D = c.d0 * Math.pow(1 - r(), 1 / K.g), u1 = r(), u2 = r(), u3 = r(), u4 = r(), u5 = r(), u6 = r(), id = key + ',' + i;
      if (D > c.d1 || this.removed.has(id) || (x - terrain.sx) ** 2 + (y - terrain.sy) ** 2 < 81) continue;      // larger sizes belong to the next class; keep the descent stage clear
      const a = D / 2, sx = a * (0.8 + 0.4 * u1), sy = a * (0.8 + 0.4 * u2), sz = a * (0.5 + 0.4 * u3); let bury = 0.12 + 0.4 * u4;
      const gemU = u5 / (1 + 2.5 * D), R4 = V4 ? 1.8 : 1; let pTh = Math.min(V4 ? 0.35 : 0.45, 0.022 * R4 * fTh), pIl = Math.min(V4 ? 0.35 : 0.45, 0.06 * R4 * fTi); if (V4 && pTh + pIl > 0.5) { const q = 0.5 / (pTh + pIl); pTh *= q; pIl *= q; }      // version 4: at most half the rocks hold ore, even in the richest ground
      let gem = D >= 0.4 && u6 < Math.min(0.6, 0.006 * R4 * (1 + 4 * D) * fAr) ? 3 : gemU < pTh ? 2 : gemU < pTh + pIl ? 1 : 0;      // 3 armalcolite (rare, large rocks only), 2 thorium-bearing, 1 ilmenite
      const mv = this.moved.get(id); if (mv) { const q = terrain.fromLatLon(mv[0], mv[1]); x = q[0]; y = q[1]; bury = 0.05; }     // a rock that was pushed or thrown stays where it ended up
      let vein = 0, gemN = 1; if (V4 && boost) { vein = veinAt(x + terrain.ax, y + terrain.ay, boost); if (vein && u4 < 0.8) { gem = vein; gemN = 2 + Math.floor(u1 * 3.99); } }
      list.push({ id, vein, gemN, x, y, z: 0, D, sx, sy, sz, bury, hr: 2 * sz * (1 - bury), yaw: u6 * 6.283, tilt: (u1 - 0.5) * 0.5, v: (u2 * 4) | 0, shade: 0.17 + 0.13 * u3, gem, mass: 3000 * 4.19 * sx * sy * sz, dyn: null, held: false, hp: 0 });
    }
    for (const k of list) k.z = terrain.height(k.x, k.y) + k.sz * (1 - 2 * k.bury);
    this.cells.set(key, list);
    if (this.cells.size > 6000) { const first = this.cells.keys().next().value; this.cells.delete(first); }
    return list;
  }
  rebuild(x, y) {
    this.cx = x; this.cy = y; this.active.length = 0; this.buckets.clear();
    const gx = x + terrain.ax, gy = y + terrain.ay, h2 = this.h * this.h, counts = [0, 0, 0, 0];
    for (let q = RCLASS.length - 1; q >= 0; q--) {         // large first, so that if the buffers ever fill it is the smallest that are left out
      const c = RCLASS[q], R2 = (VIS * c.d1) ** 2 - h2; if (R2 <= 0) continue; const R = Math.sqrt(R2);
      const c0 = Math.floor((gx - R) / c.cell), c1 = Math.floor((gx + R) / c.cell), d0 = Math.floor((gy - R) / c.cell), d1 = Math.floor((gy + R) / c.cell);
      for (let j = d0; j <= d1; j++) for (let i = c0; i <= c1; i++) for (const k of this.cell(c, i, j)) {
        if (k.dead || counts[k.v] >= CAP) continue;
        const dx = k.x - x, dy = k.y - y; if (!k.dyn && !k.held && dx * dx + dy * dy + h2 > (VIS * k.D) ** 2) continue;
        k.ii = counts[k.v]++; this.active.push(k); this.bucket(k); this.place(k);
      }
    }
    for (let v = 0; v < 4; v++) { this.meshes[v].count = counts[v]; this.meshes[v].instanceMatrix.needsUpdate = true; this.meshes[v].instanceColor.needsUpdate = true; }
  }
  reset() {                                               // the map moved: rocks and gems keep their place on the Moon
    this.cells.clear(); this.active.length = 0; this.buckets.clear(); this.movers.clear(); for (const m of this.meshes) m.count = 0; this.debris.length = 0; this.dm.count = 0; this.cx = this.cy = 1e9;
    for (const g of this.gems) this.gemPlace(g);
  }
  bucket(k) { const key = Math.floor(k.x / BUCKET) + ',' + Math.floor(k.y / BUCKET); let b = this.buckets.get(key); if (!b) this.buckets.set(key, b = []); b.push(k); }
  place(k) {
    tmp.q.setFromEuler(new THREE.Euler(k.tilt, k.tilt * 0.7, k.yaw, 'ZYX')); tmp.m.compose(tmp.a.set(k.x, k.y, k.z), tmp.q, tmp.s.set(k.sx, k.sy, k.sz));
    const im = this.meshes[k.v]; if (k.ii === undefined || k.ii >= CAP) return; im.setMatrixAt(k.ii, tmp.m);
    const c = im.instanceColor.array, o = 3 * k.ii, ov = G.overlay;
    const sh = V3 && SOIL.map ? k.shade * 3.0 : k.shade, tc = k.vein ? VEINCOL[k.vein] : [1, 1, 0.97]; c[o] = ov ? 1.0 : sh * tc[0]; c[o + 1] = ov ? 0.55 : sh * tc[1]; c[o + 2] = ov ? 0.2 : sh * tc[2];
    im.instanceMatrix.needsUpdate = true;
  }
  near(x, y, r, fn) {                                     // visit rocks whose centre is within r (+ their own size) of a point
    const b0 = Math.floor((x - r - 0.6) / BUCKET), b1 = Math.floor((x + r + 0.6) / BUCKET), c0 = Math.floor((y - r - 0.6) / BUCKET), c1 = Math.floor((y + r + 0.6) / BUCKET);
    for (let j = c0; j <= c1; j++) for (let i = b0; i <= b1; i++) { const b = this.buckets.get(i + ',' + j); if (b) for (const k of b) if (!k.dead && !k.dyn && !k.held) fn(k); }
    for (const k of this.movers) if (!k.dead && !k.held) fn(k);
  }
  bump(x, y) {                                            // extra height a wheel feels from small rocks
    let h = 0;
    this.near(x, y, 0.1, k => { if (k.hr > 0.2) return; const dx = x - k.x, dy = y - k.y, r = Math.max(k.sx, k.sy), d2 = (dx * dx + dy * dy) / (r * r); if (d2 < 1) h = Math.max(h, k.hr * Math.sqrt(1 - d2)); });
    return h;
  }
  remove(k) { k.dead = true; this.removed.add(k.id); this.movers.delete(k); if (k.ii !== undefined) { tmp.m.makeScale(0, 0, 0); this.meshes[k.v].setMatrixAt(k.ii, tmp.m); this.meshes[k.v].instanceMatrix.needsUpdate = true; } }
  /* gems lie where they fell until they are collected; they are stored by latitude and longitude */
  gem(x, y, type) { const ll = terrain.toLatLon(x, y); return this.gemLL(ll[0], ll[1], type); }
  gemLL(lat, lon, type) {
    const m = makeGem(type);
    scene.add(m); const g = { m, type, lat, lon, x: 0, y: 0, t: G.t }; this.gems.push(g); this.gemPlace(g); return g;
  }
  gemPlace(g) { const p = terrain.fromLatLon(g.lat, g.lon); g.x = p[0]; g.y = p[1]; const far = Math.hypot(g.x, g.y) > 3e5; g.m.visible = !far; if (!far) g.m.position.set(g.x, g.y, terrain.height(g.x, g.y) + 0.13 * GEM[g.type].scale); }
  take(g) {
    const i = this.gems.indexOf(g); if (i < 0) return; this.gems.splice(i, 1); scene.remove(g.m); g.gone = true;
    if (g.type === 3) { G.stats.ar++; sfx.rare(); addPoints(COST.armalcolite, 'ARMALCOLITE — the mineral first found here, in the Apollo 11 samples'); }
    else if (g.type === 2) { G.stats.th++; sfx.ore(true); addPoints(COST.thorium, 'thorium ore'); } else { G.stats.il++; sfx.ore(false); addPoints(COST.ilmenite, 'ilmenite'); }
  }
  explode(k, power) {
    if (k.dead) return;
    if (k.gem && !k.gemOut && k.gemN > 1) { k.gemOut = true; for (let i = 0; i < k.gemN; i++) { const a = i / k.gemN * 6.283 + Math.random(), rr = 0.35 + Math.random() * 0.5; this.gem(k.x + Math.cos(a) * rr, k.y + Math.sin(a) * rr, k.gem); }
      if (!G.veinSeen) { G.veinSeen = true; radio(`That rock was part of a vein of ${GEM[k.gem].name}. Veins run in lines — look for rocks with the same tint along it and break every one.`); } }
    if (k.gem && !k.gemOut) { k.gemOut = true; this.gem(k.x, k.y, k.gem); if (k.gem === 3) toast('Something large and bright was inside.\nPick it up with the arm (Grab).', 4000); }
    this.remove(k);
    const n = Math.round(clamp(5 + k.D * 26, 6, 26));
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, el = (15 + Math.random() * 65) * D2R, v = (1.2 + Math.random() * 4.2) * (0.8 + 0.25 * power), sc = k.D * (0.08 + Math.random() * 0.14);
      this.fragment(k.x + Math.cos(a) * k.sx * 0.5, k.y + Math.sin(a) * k.sy * 0.5, k.z + k.sz * 0.3, Math.cos(a) * Math.cos(el) * v, Math.sin(a) * Math.cos(el) * v, Math.sin(el) * v, sc, k.shade);
    }
    particles.burst(k.x, k.y, k.z, 50, 1, 6 + power, 20, 80);
    G.shake = Math.max(G.shake, 0.15 + k.D * 0.4); sfx.boom(k.D);
  }
  fragment(x, y, z, vx, vy, vz, sc, shade) {
    if (this.debris.length >= 320) this.debris.shift();
    this.debris.push({ x, y, z, vx, vy, vz, s: sc, shade, rot: Math.random() * 6.28, spin: (Math.random() - 0.5) * 12, rest: false });
  }
  /* h: height of the viewer above the ground (0 for the rover) */
  step(dt, fx, fy, h = 0) {
    if (h > VIS) { if (this.active.length) { this.active.length = 0; this.buckets.clear(); for (const m of this.meshes) m.count = 0; this.cx = 1e9; } }      // too high for any rock to cover two pixels
    else if (Math.hypot(fx - this.cx, fy - this.cy) > Math.max(4, h * 0.15) || Math.abs(h - this.h) > Math.max(3, this.h * 0.15)) { this.h = h; this.rebuild(fx, fy); }
    // pushed / thrown rocks: slide, roll and bounce on the real ground
    for (const k of this.movers) {
      const d = k.dyn; if (!d) continue;
      d.vz -= G_MOON * dt; k.x += d.vx * dt; k.y += d.vy * dt; k.z += d.vz * dt;
      const g = clip.ground(k.x, k.y) + k.sz * (1 - 2 * k.bury * 0.3);
      if (k.z <= g) {
        k.z = g; if (d.vz < -0.4) { d.vz = -d.vz * 0.25; sfx.thud(-d.vz); } else d.vz = 0;
        const sp = Math.hypot(d.vx, d.vy), dec = 0.7 * G_MOON * dt;
        if (sp <= dec) { d.vx = d.vy = 0; if (d.vz === 0) { k.dyn = null; this.movers.delete(k); this.bucket(k); this.moved.set(k.id, terrain.toLatLon(k.x, k.y)); } } else { d.vx *= 1 - dec / sp; d.vy *= 1 - dec / sp; }
        clip.normal(k.x, k.y, tmp.a); d.vx += tmp.a.x * G_MOON * dt; d.vy += tmp.a.y * G_MOON * dt;       // rolls downhill
      }
      k.yaw += Math.hypot(d ? d.vx : 0, d ? d.vy : 0) * dt / Math.max(0.05, k.sx); this.place(k);
    }
    let moving = false;                                   // fragments
    for (let i = 0; i < this.debris.length; i++) {
      const f = this.debris[i]; if (!f.rest) {
        moving = true; f.vz -= G_MOON * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.z += f.vz * dt; f.rot += f.spin * dt;
        const g = clip.ground(f.x, f.y) + f.s * 0.5;
        if (f.z <= g) { f.z = g; if (Math.abs(f.vz) > 0.5) { f.vz = -f.vz * 0.3; f.vx *= 0.6; f.vy *= 0.6; f.spin *= 0.5; } else { f.rest = true; } }
      }
      tmp.q.setFromAxisAngle(tmp.b.set(0.3, 0.5, 0.8).normalize(), f.rot); tmp.m.compose(tmp.a.set(f.x, f.y, f.z), tmp.q, tmp.s.set(f.s, f.s * 0.8, f.s * 0.6)); this.dm.setMatrixAt(i, tmp.m);
    }
    if (moving || this.dm.count !== this.debris.length) { this.dm.count = this.debris.length; this.dm.instanceMatrix.needsUpdate = true; }
    GEMMAT[1].emissiveIntensity = 1.2 + 0.5 * Math.sin(G.t * 4); GEMMAT[2].emissiveIntensity = 1.6 + 0.7 * Math.sin(G.t * 4.6); GEMMAT[3].emissiveIntensity = 2.6 + 1.4 * Math.sin(G.t * 2.5);
    // gems: the brighter and larger, the more they are worth. Small ones jump into the rover; the rare large one needs the arm
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const g = this.gems[i]; if (!g.m.visible) continue; g.m.rotation.z += dt * (g.type === 3 ? 0.7 : 1.3);
      if (G.mode !== 'rover' || rover.fly || rover.arm.gem === g) continue;
      const dx = rover.pos.x - g.x, dy = rover.pos.y - g.y, d = Math.hypot(dx, dy);
      if (g.type === 3) { if (d < 1.6 && G.t > (this.hintT || 0)) { this.hintT = G.t + 8; toast('Too big to scoop up while driving.\nFace it and press Grab.', 3000); } continue; }
      if (d < 2.2 && d > 1e-3) { g.x += dx / d * dt * 5; g.y += dy / d * dt * 5; g.m.position.set(g.x, g.y, g.m.position.z + (rover.pos.z + 0.2 - g.m.position.z) * Math.min(1, dt * 4)); }
      if (d < 0.7) this.take(g);
    }
  }
}

/* ---------------------------------------------------------------------- rover: rigid body on four sprung wheels */
class Rover {
  constructor() {
    this.obj = makeRover(); this.obj.visible = false; scene.add(this.obj);
    this.pos = V(); this.vel = V(); this.q = new THREE.Quaternion(); this.w = V();     // w: angular velocity, body frame
    this.m = 180; this.I = V(180 * (1.3 * 1.3 + 0.3 * 0.3) / 12, 180 * (0.9 * 0.9 + 0.3 * 0.3) / 12, 180 * (0.9 * 0.9 + 1.3 * 1.3) / 12);
    this.hp = [V(-0.56, 0.52, -0.05), V(0.56, 0.52, -0.05), V(-0.56, -0.52, -0.05), V(0.56, -0.52, -0.05)];
    this.comp = [0, 0, 0, 0]; this.spin = [0, 0, 0, 0]; this.onGround = 0; this.air = 0; this.lastAir = 0; this.steer = 0; this.thr = 0;
    this.arm = { phase: 'idle', t: 0, rock: null, gem: null, tip: V(0, 0.3, 0.35), from: V(), to: V() }; this.cool = 0;
    this.F = V(); this.T = V();
    this.s = { hp: V(), n: V(), tF: V(), tS: V(), cp: V(), v: V(), Fw: V(), wW: V(), Tb: V(), r: V(), na: V(), ax: V(), qi: new THREE.Quaternion(), dq: new THREE.Quaternion() };
  }
  place(x, y, yaw) { this.pos.set(x, y, clip.ground(x, y) + 0.6); this.vel.set(0, 0, 0); this.w.set(0, 0, 0); this.q.setFromAxisAngle(Z, -yaw); this.comp.fill(0); }
  get fwd() { return tmp.f.set(0, 1, 0).applyQuaternion(this.q); }
  heading() { const f = this.fwd; return Math.atan2(f.x, f.y); }
  up() { return tmp.e.set(0, 0, 1).applyQuaternion(this.q); }
  force(F, at) { this.F.add(F); this.T.add(this.s.r.copy(at).sub(this.pos).cross(F)); }
  step(dt, ax, ay) {
    const P = perk(), REST = 0.3, RW = 0.22, K = 1500, C = 320, S = this.s, { hp, n, tF, tS, cp, v, Fw, wW, Tb } = S;
    this.steer += clamp(ax * 0.5 / (1 + this.vel.length() * 0.18) - this.steer, -dt * 2.5, dt * 2.5);
    this.thr = ay;
    this.F.set(0, 0, -this.m * G_MOON); this.T.set(0, 0, 0);
    wW.copy(this.w).applyQuaternion(this.q);              // angular velocity in the world frame
    let contacts = 0;
    const upz = n.set(0, 0, 1).applyQuaternion(this.q).z;
    this.rolled = upz < 0.5 ? (this.rolled || 0) + dt : 0;        // tilted more than 60°
    S.na.set(0, 0, 0);
    for (let i = 0; i < 4; i++) {
      if (upz < 0.3) { this.comp[i] = 0; continue; }          // on its side or roof: the wheels are in the air
      hp.copy(this.hp[i]).applyQuaternion(this.q).add(this.pos);
      const hg = clip.ground(hp.x, hp.y) + rocks.bump(hp.x, hp.y);
      let comp = hg - (hp.z - REST - RW);
      if (comp <= 0) { this.comp[i] = 0; this.spin[i] += this.thr * P.vmax / RW * dt; continue; }
      comp = Math.min(comp, REST + 0.12);
      const rate = (comp - this.comp[i]) / dt; this.comp[i] = comp;
      const Fn = clamp(K * comp + C * rate, 0, 2200); if (Fn <= 0) continue;
      contacts++;
      clip.normal(hp.x, hp.y, n, 0.2); S.na.add(n);
      cp.set(hp.x, hp.y, hg);
      v.copy(cp).sub(this.pos); v.crossVectors(wW, v).add(this.vel);          // velocity of the contact point
      const st = i < 2 ? this.steer : 0;
      tF.set(Math.sin(st), Math.cos(st), 0).applyQuaternion(this.q); tF.addScaledVector(n, -tF.dot(n)).normalize(); tS.crossVectors(tF, n);
      const vF = v.dot(tF), vS = v.dot(tS);
      let Fd = clamp(300 * (this.thr * P.vmax - vF), -140, 140), Fs = -650 * vS;
      const lim = P.mu * Fn, mag = Math.hypot(Fd, Fs); if (mag > lim) { Fd *= lim / mag; Fs *= lim / mag; }     // traction is limited by the (low) lunar weight
      Fw.copy(n).multiplyScalar(Fn).addScaledVector(tF, Fd).addScaledVector(tS, Fs); this.force(Fw, cp);
      this.spin[i] += vF / RW * dt;
    }
    // body corners touching the ground (after a roll-over or a hard landing)
    for (let k = 0; k < 8; k++) {
      cp.set(k & 1 ? 0.5 : -0.5, k & 2 ? 0.7 : -0.7, k & 4 ? 0.3 : -0.12).applyQuaternion(this.q).add(this.pos);
      const pen = clip.ground(cp.x, cp.y) - cp.z; if (pen <= 0) continue;
      v.copy(cp).sub(this.pos); v.crossVectors(wW, v).add(this.vel);
      Fw.set(-v.x * 260, -v.y * 260, clamp(9000 * pen - 500 * v.z, 0, 6000)); this.force(Fw, cp);
    }
    this.onGround = contacts;
    /* Stabiliser — changed for playability, a real rover has nothing like it. It holds the body parallel to the ground under
       the wheels (level, while in flight) and damps rolling, so the rover can be driven without tipping over all the time. */
    if (upz > 0.2) { const tg = contacts ? S.na.normalize() : Z; S.ax.set(0, 0, 1).applyQuaternion(this.q).cross(tg); this.T.addScaledVector(S.ax, 900); }
    if (contacts === 0) this.air += dt; else { if (this.air > 0.35) { this.lastAir = this.air; this.lastAirT = G.t; sfx.thud(Math.abs(this.vel.z)); } this.air = 0; }
    // integrate: linear, then Euler's equations in the body frame
    this.vel.addScaledVector(this.F, dt / this.m); this.pos.addScaledVector(this.vel, dt);
    Tb.copy(this.T).applyQuaternion(S.qi.copy(this.q).invert());
    const w = this.w, I = this.I; Tb.x -= 170 * w.x; Tb.y -= 170 * w.y;
    w.x += (Tb.x - (I.z - I.y) * w.y * w.z) / I.x * dt; w.y += (Tb.y - (I.x - I.z) * w.z * w.x) / I.y * dt; w.z += (Tb.z - (I.y - I.x) * w.x * w.y) / I.z * dt;
    w.multiplyScalar(1 - 0.15 * dt);
    const ang = w.length() * dt; if (ang > 1e-9) { S.dq.setFromAxisAngle(hp.copy(w).normalize(), ang); this.q.multiply(S.dq).normalize(); }
  }
  /* rocks too tall to roll over: push them if light enough, otherwise be stopped */
  collide(dt) {
    const P = perk(), R = 0.8;
    rocks.near(this.pos.x, this.pos.y, R, k => {
      if (k.hr <= 0.2 && !k.dyn) return;
      const dx = k.x - this.pos.x, dy = k.y - this.pos.y, d = Math.hypot(dx, dy), rr = Math.max(k.sx, k.sy), ov = R * 0.75 + rr - d;
      if (ov <= 0 || d < 1e-6 || Math.abs(k.z - this.pos.z) > 0.9 + k.sz) return;
      const nx = dx / d, ny = dy / d, vn = this.vel.x * nx + this.vel.y * ny - (k.dyn ? k.dyn.vx * nx + k.dyn.vy * ny : 0);
      if (k.mass <= P.push) {
        if (!k.dyn) { k.dyn = { vx: 0, vy: 0, vz: 0 }; rocks.movers.add(k); k.bury *= 0.3; }
        if (vn > 0) { const j = vn * 1.2 / (1 / this.m + 1 / k.mass); k.dyn.vx += nx * j / k.mass; k.dyn.vy += ny * j / k.mass; this.vel.x -= nx * j / this.m; this.vel.y -= ny * j / this.m; }
        k.x += nx * ov * 0.6; k.y += ny * ov * 0.6; this.pos.x -= nx * ov * 0.1; this.pos.y -= ny * ov * 0.1;
      } else {
        this.pos.x -= nx * ov; this.pos.y -= ny * ov;
        if (vn > 0) { this.vel.x -= nx * vn * 1.3; this.vel.y -= ny * vn * 1.3; if (vn > 0.8) { sfx.thud(vn); if (!this.warned || G.t - this.warned > 6) { this.warned = G.t; toast('Too heavy to push — go round it, or blast it', 2200); } } }
      }
    });
  }
  sync(dt) {
    const o = this.obj, u = o.userData; o.position.copy(this.pos); o.quaternion.copy(this.q); o.updateMatrixWorld(true);
    u.wheels.forEach((w, i) => { w.piv.position.z = -0.05 - (0.3 - this.comp[i]); w.piv.rotation.z = i < 2 ? -this.steer : 0; w.w.rotation.x = -this.spin[i]; });
    this.armStep(dt);
  }
  /* ---- arm: reach, lift, stow (a sample) or hold (a rock to move) */
  armLocal(world, out) { return out.copy(world).sub(this.pos).applyQuaternion(tmp.q.copy(this.q).invert()).sub(this.obj.userData.armBase.position); }
  armStep(dt) {
    const A = this.arm, u = this.obj.userData, STOW = tmp.c.set(0, 0.28, 0.32);
    if (A.phase !== 'idle' && A.phase !== 'hold') {
      A.t += dt / 0.45; const t = Math.min(1, A.t), e = t * t * (3 - 2 * t);
      if (A.phase === 'reach' && A.rock) this.armLocal(tmp.a.set(A.rock.x, A.rock.y, A.rock.z + A.rock.sz * 0.6), A.to);
      if (A.phase === 'reachGem' && A.gem) this.armLocal(tmp.a.copy(A.gem.m.position), A.to);
      A.tip.lerpVectors(A.from, A.to, e);
      if (t >= 1) this.armNext();
    }
    if (A.rock && A.rock.held) {                          // carried rock follows the gripper
      u.grip.getWorldPosition(tmp.a); A.rock.x = tmp.a.x; A.rock.y = tmp.a.y; A.rock.z = tmp.a.z - A.rock.sz * 0.5; rocks.place(A.rock);
    }
    if (A.gem && A.phase === 'liftGem') { u.grip.getWorldPosition(tmp.a); A.gem.m.position.copy(tmp.a); }
    // two-link inverse kinematics in the vertical plane through the target
    const tip = A.tip, yaw = Math.atan2(-tip.x, tip.y), d = Math.hypot(tip.x, tip.y), h = tip.z, r = clamp(Math.hypot(d, h), 0.25, 2 * ARM_L - 0.02);
    const el = Math.acos(clamp((2 * ARM_L * ARM_L - r * r) / (2 * ARM_L * ARM_L), -1, 1)), sh = Math.atan2(h, d) + Math.acos(clamp(r / (2 * ARM_L), -1, 1));
    u.armBase.rotation.z = yaw; u.shoulder.rotation.x = sh; u.elbow.rotation.x = -(Math.PI - el);
    void STOW;
  }
  armGo(phase, to) { const A = this.arm; A.phase = phase; A.t = 0; A.from.copy(A.tip); if (to) A.to.copy(to); }
  armNext() {
    const A = this.arm, k = A.rock, STOW = V(0, 0.28, 0.32);
    if (A.phase === 'reach') {
      if (!k || k.dead) return this.armGo('stow', STOW);
      sfx.grab(); sfx.servo(0.45); k.held = true; k.dyn = null; rocks.movers.add(k); this.armGo('lift', V(0.1, 0.5, 0.8));
    } else if (A.phase === 'lift') {                      // moved aside: whatever is inside stays inside until the rock is broken
      const r = tmp.b.set(1, 0, 0).applyQuaternion(this.q), side = Math.random() < 0.5 ? -1 : 1; k.held = false; A.rock = null; k.bury = 0.05;
      k.dyn = { vx: this.vel.x + r.x * side * 2.4, vy: this.vel.y + r.y * side * 2.4, vz: 2.3 }; sfx.toss(); this.armGo('stow', STOW);
    } else if (A.phase === 'reachGem') {
      if (!A.gem || A.gem.gone) { A.gem = null; return this.armGo('stow', STOW); }
      sfx.grab(); sfx.servo(0.5); this.armGo('liftGem', V(0, 0.15, 0.6));
    } else if (A.phase === 'liftGem') { const g = A.gem; A.gem = null; rocks.take(g); this.armGo('stow', STOW); }
    else A.phase = 'idle';
  }
  /* Grab: a gem within reach is picked up; otherwise the nearest rock is lifted and thrown aside */
  grab() {
    const A = this.arm, P = perk(); if (A.phase !== 'idle' || this.fly) return;
    const f = this.fwd.clone(); let bg = null, bd = 1e9;
    for (const g of rocks.gems) { if (!g.m.visible) continue; const dx = g.x - this.pos.x, dy = g.y - this.pos.y, d = Math.hypot(dx, dy); if (d < 2.4 && dx * f.x + dy * f.y > 0.2 && d < bd) { bd = d; bg = g; } }
    if (bg) { if (!need(COST.grab)) return; A.gem = bg; sfx.servo(0.45); return this.armGo('reachGem'); }
    let best = null; bd = 1e9;
    rocks.near(this.pos.x + f.x * 0.9, this.pos.y + f.y * 0.9, 1.25, k => {
      const dx = k.x - this.pos.x, dy = k.y - this.pos.y, d = Math.hypot(dx, dy); if (d > 2.05 || dx * f.x + dy * f.y < 0.25 || k.D > P.liftD) return;
      if (d < bd) { bd = d; best = k; }
    });
    if (!best) return toast(`Nothing within reach.\nThe arm picks up gems, and throws aside rocks up to ${fm(P.liftD * 100, 0)} cm.`, 2400);
    if (!need(COST.grab)) return;
    A.rock = best; sfx.servo(0.45); this.armGo('reach');
  }
}

/* ---------------------------------------------------------------------- lander: simple hover flight with real gravity and ballistic dust */
class Lander {
  constructor() { this.obj = makeLander(); scene.add(this.obj); this.pos = V(); this.vel = V(); this.yaw = 0; this.landed = true; this.tilt = V(); this.vsT = 0; this.thrust = 0; }
  place(x, y) { this.pos.set(x, y, clip.ground(x, y)); this.vel.set(0, 0, 0); this.landed = true; }
  step(dt, ax, ay, vz) {
    const g = clip.ground(this.pos.x, this.pos.y), agl = this.pos.z - g;
    if (this.landed) {
      this.pos.z = g; this.thrust = 0; this.tilt.multiplyScalar(0.9);
      if (vz > 0) { this.landed = false; this.vel.set(0, 0, 1.2); toast('Lift-off', 1200); }
      return agl;
    }
    this.yaw += -ax * (agl < 300 ? 1.4 : 1.0) * dt;
    const f = tmp.a.set(Math.sin(this.yaw), Math.cos(this.yaw), 0);
    /* Changed for playability: the lander follows the controls almost at once, its speed and climb rate grow with height
       (far beyond any real vehicle — "theoretical"), and below 10 m it takes off its own sideways speed so that it can be set down. */
    const low = clamp(agl / 10, 0, 1), vMaxH = Math.max(8, 0.8 * agl) * (0.1 + 0.9 * low), aLim = Math.max(8, 1.6 * agl);
    const axW = clamp((f.x * ay * vMaxH - this.vel.x) * 2.4, -aLim, aLim), ayW = clamp((f.y * ay * vMaxH - this.vel.y) * 2.4, -aLim, aLim);
    const vMax = Math.max(2.2, 0.9 * agl), vT = vz * vMax, az = clamp((vT - this.vel.z) * 2.5, -Math.max(G_MOON, 1.3 * agl), Math.max(4, 1.3 * agl));
    this.thrust = clamp(Math.hypot(axW, ayW, az + G_MOON) / (G_MOON + 3.5), 0, 1.4);
    this.vel.x += axW * dt; this.vel.y += ayW * dt; this.vel.z += az * dt; this.pos.addScaledVector(this.vel, dt);
    this.tilt.lerp(tmp.b.set(axW, ayW, 0).multiplyScalar(1 / (G_MOON + 3)), Math.min(1, dt * 4));
    if (this.pos.z > g + 100000) { this.pos.z = g + 100000; this.vel.z = Math.min(0, this.vel.z); }
    if (this.pos.z <= g) {                                 // touchdown: gentle by construction; only a steep slope refuses it
      const slope = terrain.slopeDeg(this.pos.x, this.pos.y, 2); this.pos.z = g;
      if (slope < 22) { this.landed = true; this.vel.set(0, 0, 0); sfx.thud(2); toast('Touchdown — you can deploy the rover', 2500); buildActs(); }
      else { this.vel.set(this.vel.x * 0.3, this.vel.y * 0.3, 2.5); sfx.thud(3); toast(`Too steep to stand here (${fm(slope, 0)}°) — move a little and try again`, 2500); }
    }
    // engine exhaust blows regolith away in flat, straight sheets (no air to make it billow)
    if (agl < 14 && this.thrust > 0.15 && particles) for (let i = 0; i < 6; i++) { const a = Math.random() * 6.283, v = 6 + Math.random() * 16, r = 0.4 + Math.random() * 1.2, el = (2 + Math.random() * 8) * D2R;
      particles.emit(this.pos.x + Math.cos(a) * r, this.pos.y + Math.sin(a) * r, g + 0.03, Math.cos(a) * v * Math.cos(el), Math.sin(a) * v * Math.cos(el), v * Math.sin(el)); }
    return agl;
  }
  sync() {
    const o = this.obj; o.position.copy(this.pos); o.rotation.set(0, 0, 0);
    o.quaternion.setFromAxisAngle(Z, -this.yaw); tmp.q.setFromAxisAngle(tmp.a.set(-this.tilt.y, this.tilt.x, 0).normalize(), Math.min(0.45, this.tilt.length())); if (this.tilt.lengthSq() > 1e-8) o.quaternion.premultiply(tmp.q);
    const fl = o.userData.flame; fl.visible = !this.landed && this.thrust > 0.05; fl.scale.set(1, 1, 0.4 + this.thrust * 1.4 + Math.random() * 0.15);
  }
}

/* ====================================================================== the map follows the lander round the Moon */
function placeStatics() {
  const e = terrain.fromLatLon(terrain.site.lat, terrain.site.lon), far = Math.hypot(e[0], e[1]) > 4e5;
  eagle.visible = base.visible = !far;
  eagle.position.set(e[0], e[1], far ? 0 : terrain.height(e[0], e[1]) - 0.05);
  const b = terrain.fromLatLon(BASE.ll[0], BASE.ll[1]); BASE.x = b[0]; BASE.y = b[1]; base.position.set(b[0], b[1], far ? 0 : terrain.height(b[0], b[1]));
  // The Earth stands over the point 0°, 0° of the Moon: its height in the sky is 90° minus the distance from there, so
  // it is overhead in the middle of the near side, on the horizon at the limb, and never seen from the far side.
  const la = terrain.lat0 * D2R, lo = terrain.lon0 * D2R, el = Math.PI / 2 - Math.acos(clamp(Math.cos(la) * Math.cos(lo), -1, 1)), az = Math.atan2(-Math.sin(lo), -Math.sin(la) * Math.cos(lo)), E = scene.userData.earth;
  E.visible = el > -0.03; E.position.set(Math.sin(az) * Math.cos(el), Math.cos(az) * Math.cos(el), Math.sin(el)).multiplyScalar(700000);
}
function setAnchorAt(lat, lon) {
  if (!terrain.setAnchor(lat, lon)) return false;
  for (const sh of shots) scene.remove(sh.m); shots.length = 0; particles.pos.fill(1e9); particles.life.fill(0);
  clip.reset(); rocks.reset(); placeStatics(); labels.rebuild(); return true;
}
function reanchor(veh = lander) {                        // keep the vehicle where it is on the Moon, move the map under it
  const other = veh === lander ? null : lander, oll = other && terrain.toLatLon(other.pos.x, other.pos.y);
  const [lat, lon] = terrain.toLatLon(veh.pos.x, veh.pos.y), alt = veh.pos.z + terrain.drop(veh.pos.x, veh.pos.y);
  if (!setAnchorAt(lat, lon)) return;
  const p = terrain.fromLatLon(lat, lon); veh.pos.set(p[0], p[1], alt - terrain.drop(p[0], p[1]));
  if (other) { const q = terrain.fromLatLon(oll[0], oll[1]), near = Math.hypot(q[0], q[1]) < 3e5; other.pos.set(q[0], q[1], near ? terrain.height(q[0], q[1]) : 0); other.obj.visible = near; }     // the lander stays where it was left
}
/* Flight for the rover: invented for the game, so that you can move to another region without going back to the lander.
   It flies like the lander and it empties the battery quickly — faster the higher and the harder you fly. */
const FLY = { min: 150, base: 3, high: 5, move: 2.5, climb: 2, ceil: 30000 };
function flyStep(dt, ax, ay, vz) {
  const p = rover.pos, v = rover.vel, g = clip.ground(p.x, p.y) + 0.55, agl = Math.max(0, p.z - g); rover.rolled = 0; rover.onGround = 0; rover.agl = agl;
  if (G.energy <= 15 && !rover.landing) { rover.landing = true; toast('Energy almost gone: coming down to land.', 3500); }
  if (rover.landing) vz = -1;
  rover.psi += ax * (agl < 300 ? 1.4 : 1.0) * dt; const fx = Math.sin(rover.psi), fy = Math.cos(rover.psi);
  const low = clamp(agl / 10, 0, 1), vMaxH = Math.max(8, 0.8 * agl) * (0.15 + 0.85 * low), aLim = Math.max(8, 1.6 * agl);
  v.x += clamp((fx * ay * vMaxH - v.x) * 2.4, -aLim, aLim) * dt; v.y += clamp((fy * ay * vMaxH - v.y) * 2.4, -aLim, aLim) * dt;
  v.z += clamp((vz * Math.max(2.2, 0.9 * agl) - v.z) * 2.5, -Math.max(G_MOON, 1.3 * agl), Math.max(4, 1.3 * agl)) * dt; p.addScaledVector(v, dt);
  const g2 = clip.ground(p.x, p.y) + 0.55; if (p.z > g2 + FLY.ceil) { p.z = g2 + FLY.ceil; v.z = Math.min(0, v.z); } if (p.z < g2) { p.z = g2; v.z = Math.max(0, v.z); }
  const lat = terrain.lat0 + p.y / terrain.ky; if (Math.abs(lat) > 82) { p.y = (82 * Math.sign(lat) - terrain.lat0) * terrain.ky; v.y = 0; }
  rover.q.setFromAxisAngle(Z, -rover.psi); rover.w.set(0, 0, 0); rover.comp.fill(0);
  rover.drain = FLY.base + FLY.high * Math.min(1, agl / 20000) + FLY.move * Math.abs(ay) + FLY.climb * Math.abs(vz); G.energy = Math.max(0, G.energy - rover.drain * dt);
  if (agl < 10) for (let i = 0; i < 3; i++) { const a = Math.random() * 6.283, s = 4 + Math.random() * 10, el = (2 + Math.random() * 8) * D2R; particles.emit(p.x + Math.cos(a) * 0.5, p.y + Math.sin(a) * 0.5, g2 - 0.5, Math.cos(a) * s * Math.cos(el), Math.sin(a) * s * Math.cos(el), s * Math.sin(el)); }
  if (p.z <= g2 + 0.03 && (rover.landing || vz < 0)) {         // wheels down
    rover.fly = false; rover.landing = false; rover.agl = 0; v.set(0, 0, 0); p.z = g2 + 0.1; sfx.thud(2); toast('Wheels down.', 1500);
    if (Math.hypot(p.x, p.y) > 12000) reanchor(rover); buildActs();
  }
}
function fly() {
  if (G.mode !== 'rover') return;
  if (rover.fly) { rover.landing = true; return toast('Coming down to land…', 2000); }
  if (!perk().fly) return toast(`Flight thrusters unlock at level 8 (${LEVELS[7].toLocaleString('en-US')} energy captured)`, 2500);
  if (G.energy < FLY.min) return toast(`Flying needs at least ${FLY.min} units of energy in the battery`, 2500);
  if (rover.arm.phase !== 'idle') return;
  rover.fly = true; rover.landing = false; rover.psi = rover.heading(); rover.vel.set(0, 0, 2); rover.pos.z += 0.3; sfx.hop(); buildActs();
  toast('Flying. Hold ▲ to climb — the higher, the faster.\nIt drains the battery quickly: watch the energy.', 5000);
}

/* ====================================================================== tools: blaster, scoop, hop, flip */
const shots = [];
/* tracer rounds: a short bright streak with a glow, aligned with its flight; at the top level the gun becomes a laser */
const shotGeo = (() => { const g = new THREE.CylinderGeometry(0.012, 0.02, 0.7, 6); g.rotateX(Math.PI / 2); return g; })(), shotMat = new THREE.MeshBasicMaterial({ color: 0xfff2b0 });
const tracerGlow = new THREE.SpriteMaterial({ map: glowTex('rgba(255,245,200,1)', 'rgba(255,170,60,.5)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
const beams = [], beamMat = new THREE.MeshBasicMaterial({ color: 0x9fffe8, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), beamGlow = new THREE.SpriteMaterial({ map: glowTex('rgba(220,255,245,1)', 'rgba(60,255,200,.6)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
let flash = null;
function muzzle(o) { if (!flash) { flash = new THREE.Sprite(tracerGlow); scene.add(flash); } flash.position.copy(o); flash.scale.setScalar(0.5 + Math.random() * 0.3); flash.visible = true; flash.userData.t = 0.05; }
function laser(o, dir, P) {                                  // straight, instant, and it does not drop: light has no parabola worth drawing
  let hit = null, len = 70; const p = V();
  for (let d = 0.6; d < 70 && !hit; d += 0.35) { p.copy(o).addScaledVector(dir, d); rocks.near(p.x, p.y, 0.1, k => { if (hit) return; const dx = (p.x - k.x) / (k.sx + 0.06), dy = (p.y - k.y) / (k.sy + 0.06), dz = (p.z - k.z) / (k.sz + 0.06); if (dx * dx + dy * dy + dz * dz < 1) hit = k; }); if (hit || p.z < clip.ground(p.x, p.y)) { len = d; break; } }
  let b = beams.find(q => q.t <= 0); if (!b) { if (beams.length > 5) return; b = { m: cyl(0.012, 0.012, 1, 6, beamMat), g: new THREE.Sprite(beamGlow), t: 0 }; b.m.castShadow = false; scene.add(b.m, b.g); beams.push(b); }
  b.t = 0.07; b.m.visible = b.g.visible = true; b.m.position.copy(o).addScaledVector(dir, len / 2); b.m.quaternion.setFromUnitVectors(Z, dir); b.m.scale.set(1.6, 1.6, len); p.copy(o).addScaledVector(dir, len); b.g.position.copy(p); b.g.scale.setScalar(0.9);
  sfx.laser(); muzzle(o);
  if (hit) { hit.hp += 2; if (hit.hp >= Math.ceil((hit.D / P.blastD) ** 2)) { rocks.explode(hit, 3); G.stats.shot++; } else { particles.burst(p.x, p.y, p.z, 14, 1, 5, 10, 80); sfx.chip(); } }
  else if (len < 70) { if (dEagle(p) > KEEP_OUT) terrain.addCrater(p.x, p.y, 0.22, 0.08); particles.burst(p.x, p.y, clip.ground(p.x, p.y), 24, 0.8, 4, 30, 70); settle(p.x, p.y, 0.6); }
}
const dEagle = p => Math.hypot(p.x - eagle.position.x, p.y - eagle.position.y);
function locked() { if (dEagle(rover.pos) < KEEP_OUT) { toast(`Tranquility Base is a heritage site:\ntools are locked within ${KEEP_OUT} m of the descent stage`, 3000); return true; } return false; }
function fire() {
  if (rover.fly || rover.cool > 0 || locked() || !need(COST.shot)) return;
  const P = perk(), f = rover.fwd.clone(), o = rover.obj.userData.turret.getWorldPosition(V()).addScaledVector(f, 0.45), v0 = 34 + 6 * P.blast;
  // aim at the nearest rock in a cone ahead; the round is ballistic, so solve for the low arc
  let best = null, bs = 1e9;
  for (const k of rocks.active) { if (k.dead || k.held || k.D < 0.12) continue; const dx = k.x - o.x, dy = k.y - o.y, d = Math.hypot(dx, dy); if (d > 40 || d < 0.8) continue; const cs = (dx * f.x + dy * f.y) / d; if (cs < 0.94) continue; const sc = d * (1.06 - cs) * 20 + d * 0.2; if (sc < bs) { bs = sc; best = k; } }
  const dir = V();
  if (best) { const dx = best.x - o.x, dy = best.y - o.y, d = Math.hypot(dx, dy), h = best.z - o.z, disc = v0 ** 4 - G_MOON * (G_MOON * d * d + 2 * h * v0 * v0), th = disc > 0 ? Math.atan((v0 * v0 - Math.sqrt(disc)) / (G_MOON * d)) : 0.1; dir.set(dx / d * Math.cos(th), dy / d * Math.cos(th), Math.sin(th)); }
  else dir.copy(f).addScaledVector(Z, 0.03).normalize();
  dir.x += (Math.random() - 0.5) * 0.012; dir.y += (Math.random() - 0.5) * 0.012; dir.z += (Math.random() - 0.5) * 0.008; dir.normalize();     // a little spread
  if (P.blast >= 3) { if (!need(0.25)) return; laser(o, dir, P); rover.cool = 0.16; return; }
  const m = new THREE.Mesh(shotGeo, shotMat); m.scale.setScalar(0.8 + 0.3 * P.blast); const gl = new THREE.Sprite(tracerGlow); gl.scale.setScalar(0.35); m.add(gl); m.quaternion.setFromUnitVectors(Z, dir); scene.add(m); muzzle(o);
  rover.vel.addScaledVector(dir, -0.05 * P.blast * v0 / rover.m);       // recoil: a 50 g round against a 180 kg rover
  shots.push({ p: o.clone(), v: dir.multiplyScalar(v0).add(rover.vel), m, life: 6, power: P.blast });
  rover.cool = 0.13; sfx.shot();
}
function stepShots(dt) {
  if (flash && flash.visible && (flash.userData.t -= dt) <= 0) flash.visible = false;
  for (const b of beams) if (b.t > 0 && (b.t -= dt) <= 0) b.m.visible = b.g.visible = false;
  const P = perk();
  for (let i = shots.length - 1; i >= 0; i--) {
    const s = shots[i]; let hit = null, ground = false;
    for (let q = 0; q < 4 && !hit && !ground; q++) {
      const h = dt / 4; s.v.z -= G_MOON * h; s.p.addScaledVector(s.v, h);
      rocks.near(s.p.x, s.p.y, 0.1, k => { if (hit) return; const dx = (s.p.x - k.x) / (k.sx + 0.08), dy = (s.p.y - k.y) / (k.sy + 0.08), dz = (s.p.z - k.z) / (k.sz + 0.08); if (dx * dx + dy * dy + dz * dz < 1) hit = k; });
      if (!hit && s.p.z < clip.ground(s.p.x, s.p.y)) ground = true;
    }
    s.m.position.copy(s.p); s.life -= dt; if (s.v.lengthSq() > 1) s.m.quaternion.setFromUnitVectors(Z, tmp.d.copy(s.v).normalize());
    if (hit) {
      hit.hp++;                                              // a rock takes more rounds the larger it is than what one round can break
      if (hit.hp >= Math.ceil((hit.D / P.blastD) ** 2)) { rocks.explode(hit, s.power); G.stats.shot++; if (s.power >= 3) splash(hit.x, hit.y, 1.6, s.power); }
      else { particles.burst(s.p.x, s.p.y, s.p.z, 10, 1, 4, 10, 80); for (let c = 0; c < 2; c++) { const a = Math.random() * 6.283, v = 1 + Math.random() * 3; rocks.fragment(s.p.x, s.p.y, s.p.z, Math.cos(a) * v, Math.sin(a) * v, 1 + Math.random() * 2, hit.D * 0.07, hit.shade); } sfx.chip(); }
    } else if (ground) {
      const r = [0, 0.16, 0.3, 0.55][s.power];
      if (dEagle(s.p) > KEEP_OUT) terrain.addCrater(s.p.x, s.p.y, r, r * 0.42);
      particles.burst(s.p.x, s.p.y, clip.ground(s.p.x, s.p.y), 30 + 25 * s.power, 0.8, 3 + 2.5 * s.power, 30, 65); sfx.boom(0.2 * s.power); settle(s.p.x, s.p.y, r * 2.5);
      if (s.power >= 3) splash(s.p.x, s.p.y, 1.6, s.power);
    }
    if (hit || ground || s.life <= 0) { scene.remove(s.m); shots.splice(i, 1); }
  }
}
function splash(x, y, r, power) { const P = perk(), list = []; rocks.near(x, y, r, k => { if (Math.hypot(k.x - x, k.y - y) < r) list.push(k); }); for (const k of list) { rocks.explode(k, power); G.stats.shot++; } }
function settle(x, y, r) { rocks.near(x, y, r, k => { if (!k.dyn) { k.z = clip.ground(k.x, k.y) + k.sz * (1 - 2 * k.bury); rocks.place(k); } }); for (const g of rocks.gems) if (Math.hypot(g.x - x, g.y - y) < r) g.m.position.z = clip.ground(g.x, g.y) + 0.16; }
const holes = new Map();                                 // how many times each square metre has been dug
function dig() {
  if (!perk().scoop) return toast(`The scoop blade unlocks at level 4 (${LEVELS[3]} energy captured)`, 2200);
  if (rover.cool > 0 || locked()) return; if (rover.onGround < 2 || !need(COST.dig)) return;
  const f = rover.fwd, x = rover.pos.x + f.x * 1.35, y = rover.pos.y + f.y * 1.35, key = Math.round(x + terrain.ax) + ',' + Math.round(y + terrain.ay), n = (holes.get(key) || 0) + 1;
  if (n > 9) { rover.cool = 0.5; return toast('The scoop cannot go any deeper here', 1800); }
  // how far this spot lies below the ground around it (natural shape only): the floor of a crater scores high
  let ring = 0; for (let i = 0; i < 8; i++) { const a = i * 0.785; ring += terrain.height(x + Math.cos(a) * 3.5, y + Math.sin(a) * 3.5) - terrain.made(x + Math.cos(a) * 3.5, y + Math.sin(a) * 3.5); }
  const bowl = ring / 8 - (terrain.height(x, y) - terrain.made(x, y));
  holes.set(key, n); terrain.addCrater(x, y, 0.55 + 0.05 * n, 0.2 + 0.03 * n); settle(x, y, 2); rover.cool = 0.7;
  particles.burst(x, y, clip.ground(x, y), 60 + 10 * n, 0.6, 3.2 + 0.2 * n, 35, 75); sfx.dig();
  const depth = -terrain.made(x, y), dl = terrain.toLatLon(x, y), [fTh, fTi, fAr] = lp.factors(dl[0], dl[1]);
  const p = clamp((n < 3 ? 0.015 : 0.07 + 0.06 * (n - 3)) * (0.2 + clamp(bowl / 0.2, 0, 3.2)) * (V4 ? 1.6 : 1), 0, 0.9);
  if (Math.random() < p) {
    const u = Math.random(), type = n >= 5 && bowl > 0.35 && u < Math.min(0.6, 0.2 * fAr) ? 3 : Math.random() < fTh / (fTh + 1.6 * fTi) ? 2 : 1;
    rocks.gem(x, y, type); holes.set(key, Math.max(0, n - 3)); sfx.chip(); toast(type === 3 ? 'The scoop struck something large and bright' : 'Something glints at the bottom of the hole', 2600);
  } else toast(`Hole ${fm(depth, 1)} m deep`, 1100);
}
function hop() { if (!perk().hop) return toast(`Hop thrusters unlock at level 7 (${LEVELS[6]} energy captured)`, 2200); if (rover.onGround >= 2 && rover.cool <= 0 && need(COST.hop)) { rover.vel.z += 3.4; rover.cool = 0.8; sfx.hop(); particles.burst(rover.pos.x, rover.pos.y, rover.pos.z - 0.4, 40, 2, 7, 3, 25); } }
function flip() { rover.q.setFromAxisAngle(Z, -rover.heading()); rover.pos.z = clip.ground(rover.pos.x, rover.pos.y) + 0.8; rover.vel.set(0, 0, 0); rover.w.set(0, 0, 0); }
function deployOrBoard() {
  if (G.mode === 'lander') {
    if (!lander.landed) return toast('Land first', 1500);
    const a = lander.yaw; rover.place(lander.pos.x + Math.sin(a) * 3.6, lander.pos.y + Math.cos(a) * 3.6, a); rover.obj.visible = true; rover.obj.userData.scoop.visible = !!perk().scoop; G.mode = 'rover'; camS.dist = 6.5; camS.off = 2.3; camS.userT = G.t;
    toast(G.points ? 'Rover deployed' : 'Rover deployed\nListen to the detector: it ticks faster near thorium ore.\nLift or shoot the rock to get it.', 5500);
  } else {
    if (rover.fly) return toast('Land first', 1500);
    if (Math.hypot(rover.pos.x - lander.pos.x, rover.pos.y - lander.pos.y) > 8) return toast('Go back to the lander to board it (the map shows where it is)', 2500);
    if (rover.arm.rock) return toast('Put the rock down first', 1500);
    rover.obj.visible = false; G.mode = 'lander'; camS.dist = 16; toast('Aboard — hold ▲ to lift off', 2500);
  }
  buildActs();
}

/* ====================================================================== input */
const keys = new Set(), stick = { x: 0, y: 0 }, held = new Set();
/* camera views: round the vehicle at ground level, straight down from three heights, and the rover's own camera */
const VIEWS = [{ n: 'from behind', yaw: 0 }, { n: 'from the front', yaw: Math.PI }, { n: 'from the left side', yaw: -Math.PI / 2, pit: 0.14 }, { n: 'from the right side', yaw: Math.PI / 2, pit: 0.14 },
  { n: 'from above, 15 m', top: 15 }, { n: 'from above, 60 m', top: 60 }, { n: 'from above, 250 m', top: 250 }, { n: 'rover webcam', web: true }];
/* ---- version 4: pause, the return window, calls from Houston ---- */
const DEADLINE = 30 * 60;                                   // seconds of play to capture the energy and launch
const CALLS = [[25 * 60, 'Twenty-five minutes left in your return window. The coloured patches on your map are the richest ground.'], [20 * 60, 'Twenty minutes. Rocks tinted blue, green or gold sit on veins: each one holds several pieces.'],
  [15 * 60, 'Halfway through the window. Keep that energy coming.'], [10 * 60, 'Ten minutes, Tranquility Base. Start thinking about the launch.'], [5 * 60, 'Five minutes. If you have the energy: B, board, climb, and go.'],
  [2 * 60, 'Two minutes. Launch now or we lose the window.'], [60, 'One minute. Tranquility Base, do you copy? One minute.'], [30, 'Thirty seconds.']];
let radioT = 0;
function radio(text, ms = 9000) {
  if (!V4) return; const e = $('radio'); if (!e) return; e.querySelector('p').textContent = text; e.classList.add('on'); clearTimeout(radioT);
  sfx.quindar(2525); setTimeout(() => sfx.static(Math.min(4, ms / 1000 - 1)), 280); radioT = setTimeout(() => { e.classList.remove('on'); sfx.quindar(2475); }, ms);
}
function gameOver() {
  G.over = true; music.stop(); sfx.tone(220, 110, 2.5, 'sine', 0.4); sfx.quindar(2475); $('over').classList.add('on');
  $('overTxt').textContent = `The return window has closed. You captured ${G.points.toLocaleString('en-US')} of the ${LAUNCH.toLocaleString('en-US')} units needed to launch.`;
}
function togglePause() { if (!V4 || G.over) return; G.userPause = !G.userPause; $('pauseBox').classList.toggle('on', G.userPause); if (sfx.ctx) G.userPause ? sfx.ctx.suspend() : sfx.ctx.resume(); keys.clear(); held.clear(); }
const ACT = { fire, fly, pause: togglePause, grab: () => rover.grab(), dig, hop, flip, deploy: () => orbit.on ? ACT.earth() : deployOrBoard(),
  earth() { if (!orbit.on) return; if (G.points < LAUNCH) return toast(`The journey to the Earth needs ${LAUNCH} units of energy captured.\nYou have ${G.points}.`, 3500); ret.start(); },
  abort() { if (ret.on) ret.quit(); },
  bigmap() { mini.toggle(); },
  map() { if (orbit.on && !ret.on) orbit.nextMap(); },
  names() { G.names = !G.names; document.querySelector('#more [data-act=names]').textContent = 'Crater names: ' + (G.names ? 'on' : 'off'); },
  rescue() {                                            // never stranded: the base station brings both vehicles home
    if (ret.on || orbit.on) return; if (!G.flat && G.points < LAUNCH) return toast(`B brings you back to base when the battery is flat,\nor once you have ${LAUNCH.toLocaleString('en-US')} units of energy for the Earth.`, 3500);
    if (G.points >= LAUNCH && !G.flat) setTimeout(() => toast('At base. Now: Enter to board the lander,\nhold ▲ to climb above 100 km, then “Return to Earth”.', 9000), 300);
    if (rover.arm.rock) { rover.arm.rock.held = false; rover.arm.rock = null; rover.arm.phase = 'idle'; }
    rover.fly = false; rover.landing = false; setAnchorAt(terrain.site.lat, terrain.site.lon); clip.update(BASE.x, BASE.y); lander.obj.visible = true;
    lander.place(BASE.x + (V3 ? 15 : 11), BASE.y + (V3 ? 6 : 5)); lander.yaw = 1.2; rover.place(BASE.x + (V3 ? 11.5 : 6.5), BASE.y + (V3 ? 0.5 : -1), 0.6);      // close enough to board at once rover.obj.visible = true; G.mode = 'rover'; G.energy = Math.max(G.energy, 30); G.flat = false; camS.dist = 6.5; camS.off = 2.3; camS.userT = G.t;
    toast('Brought back to Tranquility Base.\nStay close to the station to recharge.', 4500); buildActs(); },
  layers() { G.overlay = !G.overlay; clip.setOverlay(G.overlay); rocks.rebuild(rocks.cx, rocks.cy); $('legend').classList.toggle('open', G.overlay); document.querySelector('[data-act=layers]').classList.toggle('on', G.overlay); if (G.overlay) toast('Shape of the ground:\ngrey = measured · cyan = inferred from the photo · orange = predicted', 4500); },
  info() { sheet('info'); }, help() { sheet('help'); }, more() { sheet('more'); },
  cam() { G.cam = (G.cam + 1) % VIEWS.length; const n = VIEWS[G.cam].n; document.querySelector('#more [data-act=cam]').textContent = 'Camera: ' + n; toast('Camera: ' + n, 1400); },
  sound() { G.soundOn = !G.soundOn; document.querySelector('#more [data-act=sound]').textContent = 'Sound: ' + (G.soundOn ? 'on' : 'off'); if (sfx.ctx) sfx.out.gain.value = G.soundOn ? 0.5 : 0; },
  fullscreen() { const d = document.documentElement, f = document.fullscreenElement || document.webkitFullscreenElement; if (f) (document.exitFullscreen || document.webkitExitFullscreen).call(document); else { const r = d.requestFullscreen || d.webkitRequestFullscreen; if (r) r.call(d); else toast('On iPhone: Share → Add to Home Screen opens it full screen', 5000); } },
  reset() { if (confirm('Erase your points and start again?')) { try { localStorage.removeItem('lunar-rover-v1'); } catch (_) {} location.reload(); } },
};
function sheet(id) { for (const s of document.querySelectorAll('.sheet')) s.classList.toggle('open', s.id === id && !s.classList.contains('open')); }
document.addEventListener('click', e => {
  const c = e.target.closest('[data-close]'); if (c) { c.closest('.sheet').classList.remove('open'); return; }
  const b = e.target.closest('[data-act]'); if (!b || b.dataset.hold) return; sfx.kick(); b.blur(); ACT[b.dataset.act]?.();
});
const KEYMAP = { KeyP: 'pause', Space: 'fire', KeyE: 'grab', KeyQ: 'dig', KeyH: 'hop', KeyT: 'flip', Enter: 'deploy', KeyL: 'deploy', KeyV: 'layers', KeyI: 'info', KeyG: 'help', KeyC: 'cam', KeyM: 'sound', KeyN: 'names', KeyB: 'rescue', KeyX: 'map', KeyY: 'fly', KeyZ: 'bigmap' };
addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (G.userPause && e.code !== 'KeyP' && e.code !== 'Escape') return; sfx.kick();
  if (/^(Arrow|Page|Space)/.test(e.code)) e.preventDefault();
  keys.add(e.code); if (e.repeat || !rover) return;
  if (e.code === 'Escape') { for (const s of document.querySelectorAll('.sheet')) s.classList.remove('open'); return; }
  const a = KEYMAP[e.code]; if (a && a !== 'fire') ACT[a]();
});
addEventListener('keyup', e => keys.delete(e.code)); addEventListener('blur', () => { keys.clear(); held.clear(); });
const kd = (...c) => c.some(k => keys.has(k)) ? 1 : 0;
{ // virtual stick
  const st = $('stick'); let id = null;
  const mv = e => { const r = st.getBoundingClientRect(), R = r.width / 2; let x = (e.clientX - r.left - R) / (R * 0.75), y = -(e.clientY - r.top - R) / (R * 0.75); const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } if (Math.hypot(x, y) < 0.12) x = y = 0; stick.x = x; stick.y = y; $('knob').style.transform = `translate(${x * 40}px,${-y * 40}px)`; };
  const end = e => { if (e.pointerId !== id) return; id = null; stick.x = stick.y = 0; $('knob').style.transform = ''; };
  st.addEventListener('pointerdown', e => { e.preventDefault(); sfx.kick(); if (id !== null) return; id = e.pointerId; try { st.setPointerCapture(id); } catch (_) {} mv(e); });
  st.addEventListener('pointermove', e => { if (e.pointerId === id) mv(e); }); st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end); st.addEventListener('lostpointercapture', end);
}
/* camera: drag to look round, wheel / pinch to zoom */
const camS = { yaw: 0, pitch: 0.32, dist: 16, off: 0, pos: V(), look: V(), userT: -10 };
{ const cv = $('gl'), ptr = new Map(); let pinch = 0;
  cv.addEventListener('pointerdown', e => { sfx.kick(); ptr.set(e.pointerId, [e.clientX, e.clientY]); pinch = 0; try { cv.setPointerCapture(e.pointerId); } catch (_) {} for (const s of document.querySelectorAll('.sheet')) s.classList.remove('open'); });
  const end = e => { ptr.delete(e.pointerId); pinch = 0; }; cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  cv.addEventListener('pointermove', e => { const p = ptr.get(e.pointerId); if (!p) return; const dx = e.clientX - p[0], dy = e.clientY - p[1]; p[0] = e.clientX; p[1] = e.clientY;
    if (ptr.size >= 2) { const [a, b] = [...ptr.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch > 0 && d > 0) camS.dist = clamp(camS.dist * pinch / d, 2.5, 400); pinch = d; return; }
    camS.off -= dx * 0.006; camS.pitch = clamp(camS.pitch + dy * 0.005, -0.1, 1.45); camS.userT = G.t; });
  cv.addEventListener('wheel', e => { e.preventDefault(); camS.dist = clamp(camS.dist * Math.exp(e.deltaY * 0.0012), 2.5, 400); }, { passive: false });
}
for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, e => e.preventDefault(), { passive: false });
document.addEventListener('touchmove', e => { if (e.touches.length > 1 && !e.target.closest('.sheet')) e.preventDefault(); }, { passive: false });
addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });

/* ====================================================================== UI */
function buildActs() {
  const P = perk(), box = $('acts'), b = (act, sym, label, key, cls = '', hold = false) => `<button type="button" data-act="${act}" ${hold ? 'data-hold="1"' : ''} class="${cls}"><b>${sym}</b>${label}<kbd>${key}</kbd></button>`;
  if (ret.on) box.innerHTML = (ret.ph === 'cape' ? b('up', '▲', 'Thrust up', 'R / PgUp', '', true) + b('down', '▼', 'Down', 'F / PgDn', '', true) + b('abort', '⌂', 'Give up', '') : b('burn', '✹', ret.label(), 'Space', 'wide', true) + b('abort', '⌂', 'Give up: back to the Moon', '', 'wide'));
  else if (G.mode === 'lander') box.innerHTML = (orbit.on ? b('earth', '🜨', G.points >= LAUNCH ? 'Return to Earth' : `Return to Earth (needs ${LAUNCH})`, 'Enter', 'wide' + (G.points >= LAUNCH ? '' : ' locked')) : '') + b('up', '▲', 'Up', 'R / PgUp', '', true) + b('down', '▼', 'Down', 'F / PgDn', '', true) + (orbit.on ? b('map', '◐', orbit.mapLabel(), 'X') : b('deploy', '⇣', 'Deploy rover', 'Enter', lander && lander.landed ? '' : 'locked'));
  else if (rover && rover.fly) box.innerHTML = b('up', '▲', 'Up', 'R / PgUp', '', true) + b('down', '▼', 'Down', 'F / PgDn', '', true) + b('fly', '⤓', 'Land', 'Y');
  else box.innerHTML = (V4 && G.ready ? b('rescue', '🜨', 'RETURN TO EARTH — go to base', 'B', 'wide go') : '') + (perk().fly ? b('fly', '⤒', 'Fly to another region', 'Y', 'wide') : '') + (G.flat ? b('rescue', '⌂', 'Back to base', 'B', 'wide') : '') + b('fire', '✹', P.blast >= 3 ? 'Laser' : 'Gun ' + ['', 'I', 'II'][P.blast], 'Space', '', true) + b('grab', '✊', 'Grab', 'E') + b('dig', '⛏', 'Dig', 'Q', P.scoop ? '' : 'locked')
    + b('hop', '⇡', 'Hop', 'H', P.hop ? '' : 'locked') + b('flip', '↻', 'Upright', 'T') + b('deploy', '⇡', 'Board', 'Enter');
  for (const el of box.querySelectorAll('[data-hold]')) {
    const a = el.dataset.act, up = () => { held.delete(a); el.classList.remove('on'); };
    el.addEventListener('pointerdown', e => { e.preventDefault(); sfx.kick(); try { el.setPointerCapture(e.pointerId); } catch (_) {} held.add(a); el.classList.add('on'); });
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up); el.addEventListener('contextmenu', e => e.preventDefault());
  }
  $('keys').textContent = ret.on ? 'Follow the instructions at the top · Space = the action button · arrows steer' : orbit.on ? '↑↓←→ move over the Moon · R / F higher, lower · come down to 100 km to descend at the circle' : G.mode === 'lander' ? '↑↓ fly · ←→ turn · R / F up, down · Enter deploy rover · drag to look' : (rover && rover.fly ? '↑↓ fly · ←→ turn · R / F up, down · Y land' : '↑↓ drive · ←→ steer · Space gun · E grab · Q dig · Y fly · B base · Enter board');
}
/* version 4: a large announcement, repeated while the way home is open */
let bigT = 0;
function bigNews() { const e = $('bigmsg'); if (!e) return; e.classList.add('on'); clearTimeout(bigT); bigT = setTimeout(() => e.classList.remove('on'), 6500); }
/* version 4: which step of the way home comes next */
function nextStep() {
  const e = $('next'); if (!e) return; if (!G.ready || ret.on) { e.style.display = 'none'; return; } e.style.display = 'block'; let n, t;
  if (orbit.on) { n = 4; t = 'Press <u>RETURN TO EARTH</u> (Enter) — bottom right'; }
  else if (G.mode === 'lander') { const h = lander.landed ? 0 : lander.pos.z - clip.ground(lander.pos.x, lander.pos.y); n = 3; t = `Hold <u>▲ UP</u> (R or PgUp) to climb above 100 km${h > 1 ? ' — now ' + (h < 1000 ? fm(h, 0) + ' m' : fm(h / 1000, 1) + ' km') : ''}`; }
  else if (rover.fly) { n = 1; t = 'Land first (Y), then press <u>B</u>'; }
  else if (Math.hypot(rover.pos.x - lander.pos.x, rover.pos.y - lander.pos.y) > 8) { n = 1; t = 'Press <u>B</u> to go back to base and the lander'; }
  else { n = 2; t = 'Press <u>ENTER</u> to board the lander'; }
  const h = `<b>WAY HOME · STEP ${n} OF 4</b>${t}`; if (e._h !== h) { e._h = h; e.innerHTML = h; }
}
function hudScore() {
  if (V4) nextStep();
  if (V4) { const L = Math.max(0, G.left === undefined ? DEADLINE : G.left), e = $('clock'); e.textContent = `RETURN WINDOW ${String(Math.floor(L / 60)).padStart(2, '0')}:${String(Math.floor(L % 60)).padStart(2, '0')}`; e.className = ret.on ? 'done' : L < 300 ? 'warn' : ''; if (ret.on) e.textContent = 'RETURN WINDOW — launched'; }
  $('goalFill').style.width = clamp(G.points / LAUNCH, 0, 1) * 100 + '%'; $('goalTxt').textContent = G.points >= LAUNCH ? 'ready — press B' : `${G.points.toLocaleString('en-US')} / ${LAUNCH.toLocaleString('en-US')}`; $('goal').classList.toggle('ready', G.points >= LAUNCH);
  $('enTxt').textContent = fm(Math.max(0, G.energy), 0); $('enFill').style.width = clamp(G.energy, 0, 100) + '%'; $('enFill').classList.toggle('low', G.energy < 12); $('enOver').textContent = G.energy > 100 ? '+' + fm(G.energy - 100, 0) : '';
  $('pts').firstChild.textContent = G.points.toLocaleString('en-US');
  const l = G.level, a = LEVELS[l - 1], b = LEVELS[l] ?? LAUNCH; $('lvlTxt').textContent = G.ready ? 'Ready for Earth' : 'Level ' + l; $('lvlFill').style.width = clamp((G.points - a) / (b - a), 0, 1) * 100 + '%';
}
function hudStat(agl) {
  const row = (k, v, c = '') => `<span class="k">${k.padEnd(7)}</span><span class="${c}">${v}</span>\n`, s = [];
  if (G.mode === 'lander') { const vh = Math.hypot(lander.vel.x, lander.vel.y); s.push(row('HEIGHT', lander.landed ? 'landed' : agl < 1000 ? fm(agl, 1) + ' m' : fm(agl / 1000, 2) + ' km'), row('SPEED', (vh < 280 ? fm(vh * 3.6, 0) + ' km/h' : fm(vh / 1000, 2) + ' km/s') + (vh > 60 ? ' · theoretical' : ''), vh > 60 ? 'warn' : ''), row('V/S', (lander.vel.z >= 0 ? '+' : '') + fm(lander.vel.z, 1) + ' m/s', lander.vel.z < -3 && agl < 20 ? 'warn' : '')); }
  else {
    const up = rover.up(), tilt = Math.acos(clamp(up.z, -1, 1)) * R2D, sp = rover.vel.length();
    if (rover.fly) s.push(row('FLYING', (rover.agl < 1000 ? fm(rover.agl, 0) + ' m' : fm(rover.agl / 1000, 1) + ' km') + ' up', 'warn'), row('SPEED', sp < 280 ? fm(sp * 3.6, 0) + ' km/h' : fm(sp / 1000, 2) + ' km/s'), row('DRAIN', '−' + fm(rover.drain || 0, 1) + ' energy/s', 'warn'));
    else s.push(row('SPEED', fm(sp * 3.6, 1) + ' km/h'), row('TILT', fm(tilt, 0) + '°', tilt > 30 ? 'warn' : ''));
    s.push(row('BROKEN', `${G.stats.shot} rocks`), row('FOUND', `Il ${G.stats.il} · Th ${G.stats.th} · Ar ${G.stats.ar || 0}`));
    const lv = G.det < 16 ? Math.round(clamp(1 - G.det / 16, 0, 1) * 8) : 0; s.push(row('THORIUM', '▮'.repeat(lv) + '▯'.repeat(8 - lv) + (G.det < 16 ? ' ' + fm(G.det, 0) + ' m' : ''), lv > 4 ? 'ok' : ''));
    if (rover.air > 0.25) s.push(row('AIR', fm(rover.air, 1) + ' s', 'ok')); else if (rover.lastAir && G.t - (rover.lastAirT || 0) < 3) s.push(row('JUMP', fm(rover.lastAir, 1) + ' s', 'ok'));
  }
  const p = G.mode === 'lander' ? lander.pos : rover.pos, d = dEagle(p);
  s.push(row('EAGLE', (d < 1000 ? fm(d, 0) + ' m' : fm(d / 1000, 1) + ' km') + (d < KEEP_OUT ? ' · keep-out' : ''), d < KEEP_OUT ? 'warn' : ''));
  const ll = terrain.toLatLon(p.x, p.y); s.push(row('LAT LON', `${fm(Math.abs(ll[0]), 2)}°${ll[0] >= 0 ? 'N' : 'S'} ${fm(Math.abs(ll[1]), 2)}°${ll[1] >= 0 ? 'E' : 'W'}`));
  const comp = lp.text(ll[0], ll[1]); if (comp) s.push(row('REGION', comp));
  const dep = lp.inDeposit(ll[0], ll[1]); if (dep) s.push(row('DEPOSIT', GEM[dep.type].name, 'ok'));
  if (G.area) s.push(row('AREA', G.area.length > 24 ? G.area.slice(0, 23) + '…' : G.area));
  if (terrain.photoWeight(p.x, p.y) < 0.5) s.push(row('GROUND', terrain.regionWeight(p.x, p.y) > 0.5 ? 'predicted below 250 m' : terrain.wideWeight(p.x, p.y) > 0.5 ? 'predicted below 2 km' : 'predicted below 10 km', 'warn'));
  $('stat').innerHTML = s.join('');
}
function fillSheets() {
  const v = terrain.sfsMeta.validation_against_dtm, R = RULES;
  $('infoBody').innerHTML = `
  <h3>The mission</h3>
  <p>Two things in the lunar soil matter for anyone who wants to stay on the Moon, and both are real:</p>
  <ul><li><b style="color:var(--blue)">Ilmenite</b>, an iron–titanium oxide. The basalts Apollo 11 brought back from this very spot are among the most titanium-rich rocks known on the Moon. Ilmenite is a candidate ore for oxygen, iron and titanium.</li>
  <li><b style="color:var(--emer)">Thorium and uranium</b>, concentrated in a rock type called KREEP. Orbiters mapped thorium across the Moon with gamma-ray spectrometers — the instrument your detector imitates. There is about one part of uranium for four of thorium.</li></ul>
  <p>A third find is rarer: <b style="color:#ffe9a0">armalcolite</b>, a titanium mineral discovered in the Apollo 11 samples from this site and named after ARMstrong, ALdrin and COLlins. In the game it is the large bright gem, worth +${COST.armalcolite}, hidden only in big rocks and picked up with the arm.</p>
  <p>The gems are inside the rocks and come out only when a rock is broken by the gun; they stay where they fall until collected. In the game the rover turns them into energy: ilmenite +${COST.ilmenite}, thorium ore +${COST.thorium}. Energy runs everything, and the total you have captured decides how fast and how strong the rover becomes. At ${LAUNCH.toLocaleString('en-US')} captured, you are ready for the journey to the Earth. <span class="dim">Ore as fuel is fiction: real lunar thorium is a few parts per million of the rock, far too dilute to fuel anything without an industrial plant. Real rovers run on sunlight, which here only trickles in.</span></p>
  <h3>The ground: what is real and what is a prediction</h3>
  <p>The LRO cameras see this site at 0.5 m per pixel and its elevation at 2 m per pixel. A rover is smaller than that, so the ground is built from three layers. Press <b>Layers</b> to see them in colour.</p>
  <p><b class="tagm">1 · Measured.</b> Elevation from the LROC NAC stereo model and the brightness of the real LROC photograph. Shapes larger than about 10 m are exactly these data.</p>
  <p><b class="tagi">2 · Inferred from the photograph.</b> Where the ground tilts towards the Sun the photo is brighter, so shading reveals craters of 2–10 m in their real positions; their depth is an estimate. Against the measured elevation (${v.band_m[0]}–${v.band_m[1]} m), slope and brightness agree with r = ${v.slope_brightness_r}; heights with r = ${v.heights['12-24 m'].r}.</p>
  <p><b class="tagp">3 · Predicted.</b> Below the photo's resolution nothing is measured. Features are generated so that their <em>statistics</em> match what is known; no individual one is real.</p>
  <table>
    <tr><td>Craters</td><td>${R.craterEquilibrium.note}. ${R.craterMinD}–${R.craterMaxD} m inside the photo; up to ${R.craterMaxDfar} m outside it, where the elevation data only resolve craters above about 250 m.</td></tr>
    <tr><td>Rocks ${R.rocks.minD * 100}–${R.rocks.maxD * 100} cm</td><td>${R.rocks.note}. More rocks on steeper ground — an assumption.</td></tr>
    <tr><td>Roughness</td><td>${R.roughness.note}.</td></tr>
    <tr><td>Minerals</td><td>How rich a region is comes from real measurements: the Lunar Prospector orbiter mapped thorium and titanium over the whole Moon with its gamma-ray spectrometer (5° map, footprint about 150 km). Tranquility Base has ${lp.site ? fm(lp.site.Th_ppm, 1) : '2.7'} ppm of thorium and ${lp.site ? fm(lp.site.TiO2_wt, 1) : '6.4'}% of titanium dioxide. Elsewhere the chance that a rock holds thorium ore follows the thorium map, and ilmenite and armalcolite follow the titanium map. On top of that gentle, measured background the game scatters <b>deposits</b> over the whole Moon — patches 30 to 90 km across where one mineral is plentiful, drawn on the map in its colour (three small ones lie within 40 km of the base). The deposits and the odds themselves are invented for the game; no single place has everything, so it pays to travel.</td></tr>
  </table>
  <p class="dim">The constants in this table are quoted from the literature from memory and still need to be checked against the original papers.</p>
  <h3>The rest of the Moon</h3>
  <p>You can fly anywhere between 82° north and south. Away from the landing site the measured data get coarser — 59 m per pixel within 60 km, 474 m within 240 km, about 4 km for the rest of the globe — so more and more of what you see close up is predicted, and the HUD tells you below which size. Large predicted craters follow a rule of thumb: ${R.bigCraters.note}. Mare and highland are told apart by the brightness of the real global mosaic.</p>
  <p class="dim">Simplifications: the Sun is at the same height everywhere, as if it were the same local time all over the Moon; the map is flat around the vehicle with the curvature added, which is why the poles are left out.</p>
  <h3>Physics that is real</h3>
  <ul><li>Gravity 1.62 m/s², a sixth of Earth's: jumps last six times longer and debris flies six times farther.</li>
  <li>No air: fragments, dust and bullets follow clean parabolas and stop where they land.</li>
  <li>No air also means no sound. What you hear is what the vehicle's own structure would carry: motors, the gun's action, impacts through the wheels.</li>
  <li>Grip depends on weight, and the rover weighs a sixth: it accelerates and brakes gently.</li>
  <li>The Earth hangs over the middle of the near side: high in the sky at Tranquility Base, on the horizon near the limb, and never visible from the far side. Fly there and look.</li></ul>
  <h3>Changed so that it can be played</h3>
  <p>A faithful simulation of these vehicles is very hard to control, so some physics was deliberately altered:</p>
  <ul><li><b>Rover stabiliser.</b> An invented device holds the body parallel to the ground and damps rolling; in flight it keeps the rover level. A real rover at this speed in this gravity would tip over constantly.</li>
  <li><b>Softer obstacles.</b> The wheels roll over rocks up to 20 cm; taller ones are pushed or stop the rover, instead of launching it. Suspension forces are capped.</li>
  <li><b>Lander.</b> It follows the controls almost at once, takes off its own sideways speed below 10 m, and always touches down gently on slopes up to 22°. Speed and climb rate grow with height.</li>
  <li><b>The rover can fly</b> once it has captured ${LEVELS[7].toLocaleString('en-US')} units of energy. Nothing like it exists; it is there to change region without going back to the lander, and it drains the battery fast.</li>
  <li><b>Above 100 km</b> the game shows the Moon as a globe and you slide a viewpoint over it. That is not an orbit: a real one at 100 km moves at 1.6 km/s and takes about two hours a lap.</li>
  <li>Gravity, the parabolas of debris and dust, and the low grip of the wheels are left as they are.</li></ul>
  <h3>The journey home: what is real and what is not</h3>
  <ul><li><b>Leaving lunar orbit — real.</b> Apollo left with one engine burn of about two and a half minutes behind the Moon (trans-Earth injection), adding roughly 1 km/s. It is the engine, fired at the right point of the orbit, that sends the ship home — not centrifugal force. The game compresses a 118-minute orbit into 7 seconds, which is why the moment is so hard to catch.</li>
  <li><b>The coast — real, except the rocks and the engine.</b> The trip takes about three days; the ship slows as it climbs away from the Moon and then falls towards the Earth, reaching about 11 km/s. A real ship coasts with its engine off, and space there is almost perfectly empty: the burning engine and the meteoroid field are a game. So is the sound — there is none in space.</li>
  <li><b>The fire — real heat, invented dodging.</b> A capsule returning from the Moon meets the air at about 11 km/s and the gas in front of its heat shield reaches thousands of degrees. In reality the heating depends on the angle of entry and cannot be steered around; the red zones are a game.</li>
  <li><b>Cape Canaveral — real place, real pictures.</b> The ground is NASA imagery: the Blue Marble mosaic for the whole Earth and Florida, and Landsat images, about 30 m per pixel, for the Cape. Apollo capsules came down in the ocean under parachutes that could not be steered, and floated. The cooling foam, the thrusters, and a ship that explodes or sinks anywhere else are a game.</li>
  <li><b>The music</b> is original, synthesised in the page: slow minor strings for deep space, a driving pulse for the atmosphere, a ticking figure for the descent.</li></ul>
  <p class="dim">Figures in this section are quoted from memory.</p>
  <h3>What is only a game</h3>
  <ul><li>Minerals as glowing gems (real ilmenite and armalcolite are dull, dark grains), minerals as fuel, the gun, unlimited propellant for the lander.</li>
  <li><b>The lander's speed.</b> It grows with height so the Moon can be crossed in a minute; at altitude it reaches tens of kilometres per second, with accelerations no vehicle or crew could take. The HUD marks it "theoretical".</li>
  <li>The Apollo 11 descent stage stands at its real position; its shape is illustrative. Tools are locked within ${KEEP_OUT} m of it, in the spirit of NASA's guidelines for protecting the Apollo sites.</li></ul>`;
  if (V4) $('infoBody').innerHTML += `<h3>Version 4: veins, the return window, the radio</h3><p><b>Veins</b> are a game element. On Earth ore veins form mostly from hot water flowing through cracks; the Moon has had almost no water, so its minerals are concentrated in layers, lava flows and crater ejecta rather than veins. Deposits here are also richer than any real ones.</p><p><b>The return window</b> stands for something real: Apollo crews could stay only as long as their consumables lasted — Apollo 11 spent about 21 hours on the surface, Apollo 17 about 75 — and lift-off had to be timed to meet the command module as it passed overhead, every two hours or so. Thirty minutes is the game's version.</p><p><b>The radio calls</b> begin and end with the real Apollo "Quindar" tones, 2,525 Hz and 2,475 Hz, a quarter of a second each, which keyed the transmitters on and off. The words are invented. Figures here are quoted from memory.</p>`;
  if (V3) $('infoBody').innerHTML += `<h3>Version 3: the models</h3><p>The lunar module, the rover, the habitat and the astronaut are NASA's own 3-D models, from the NASA 3D Resources collection (free and without copyright). The module is the Apollo lunar module; at the landing site only its descent stage is shown, as it was left. The rover is NASA's model of <b>Perseverance</b> — a Mars rover, used here because it is the most detailed rover model NASA publishes; nothing like it has driven on the Moon. Its wheels do not turn in this version, and the arm, gun and scoop added to it are the game's. The habitat is the Habitat Demonstration Unit, a ground prototype. The lunar module's blankets are given the look of creased metal foil by the page (NASA's model paints them flat). The rocks and the soil close to the rover wear a real photograph: undisturbed soil from the Apollo 11 picture of a bootprint, taken at this very site. The shapes of the rocks are still generated — NASA's free collection has no scanned lunar rocks. Their use here does not imply any endorsement by NASA.</p>`;
  $('helpBody').innerHTML = `
  <p>You start in the lander beside the base station at Tranquility Base. <b>Deploy</b> the rover, prospect, and <b>Board</b> again to fly anywhere on the Moon.</p>
  <table>
    <tr><td><b>Energy</b></td><td>Everything the rover does uses it. Sunlight gives a trickle; the base station recharges to 100; thorium ore adds ${COST.thorium} each, with no upper limit. If it runs flat the rover only crawls — press <b>Back to base</b>.</td></tr>
    <tr><td><b>Goal</b></td><td>Capture ${LAUNCH.toLocaleString('en-US')} units of energy (the EARTH bar). Then press <b>B</b> to return to base, board the lander, climb above 100 km and press <b>Return to Earth</b>.</td></tr>
    <tr><td><b>Map</b></td><td>Top right: the whole Moon — but it starts almost blank. It is uncovered as you travel, more widely the higher you fly; faint dots hint at deposits a little further off, and grow brighter as you approach. Coloured patches are the deposits you have found, where one mineral is plentiful — <span style="color:var(--emer)">green thorium</span>, <span style="color:var(--blue)">blue ilmenite</span>, <span style="color:#ffd84a">yellow armalcolite</span>. The white square is the base, the red circle is you; the arrows and distances point to the base, the lander and the nearest deposit of each mineral. From ${SURVEY} units of energy the whole survey is shown. Click the map${touchUI ? '' : ' (or press Z)'} to open it large, with a close-up of your region; click again to close.</td></tr>
    <tr><td><b>Detector</b></td><td>Ticks faster, and the THORIUM bar fills, as you approach a rock that holds thorium ore.</td></tr>
    <tr><td><b>Grab</b></td><td>The arm picks up a gem within reach — the only way to take the large bright ones. With no gem in reach it lifts the nearest rock and throws it aside.</td></tr>
    <tr><td><b>Gun</b></td><td>Aims at the nearest rock ahead. Any rock can be destroyed; big ones take several rounds. The ore drops out.</td></tr>
    <tr><td><b>Gems</b></td><td>They appear only when a rock is broken, and stay until you take them. <span style="color:var(--blue)">Ilmenite</span> +${COST.ilmenite} and <span style="color:var(--emer)">thorium ore</span> +${COST.thorium}: drive over them. <span style="color:#ffe9a0">Armalcolite</span> +${COST.armalcolite}: larger, brighter, rare, only in big rocks, and only the arm can lift it.</td></tr>
    <tr><td><b>Levels</b></td><td>By total energy captured:<br>${PERKS.slice(2).map((p, i) => `L${i + 2} (${LEVELS[i + 1]}): ${p.name}`).join('<br>')}<br>${LAUNCH}: ready for the Earth</td></tr>
    ${V4 ? `<tr><td><b>Time</b></td><td>You have 30 minutes of play to capture ${LAUNCH.toLocaleString('en-US')} units and start the journey home; Houston calls as the time runs down. <b>P</b> pauses the game and the clock. Rocks tinted blue, green or gold lie on veins and hold several pieces each.</td></tr>` : ''}
    <tr><td><b>Fly</b></td><td>From level 8 the rover can lift off (<b>Fly</b>${touchUI ? '' : ', key Y'}) and travel fast to another region: ${touchUI ? '▲ ▼' : 'R / F'} for height, the higher the faster. It needs ${FLY.min} units of energy to start and uses it quickly; near empty it lands by itself.</td></tr>
    <tr><td><b>Drive</b></td><td>${touchUI ? 'Left stick' : 'Arrow keys or W A S D'}. Hit a rock at speed and the rover jumps — slowly, this is the Moon.</td></tr>
    <tr><td><b>Lander</b></td><td>${touchUI ? '▲ ▼ and the stick' : 'R / F (or PgUp / PgDn) and the arrow keys'}. The higher you are, the faster it flies and climbs. Above 100 km you see the whole Moon: move the circle anywhere, then come down to descend there. <b>Map</b> shows where orbiters measured more thorium or titanium — the places richest in ore. Come down and slow down to land, on ground that is not too steep.</td></tr>
    <tr><td><b>Names</b></td><td>Official IAU names of craters and other features point the way, with distances. ${touchUI ? '☰ → Crater names' : 'N'} turns them off.</td></tr>
    <tr><td><b>Camera</b></td><td>The <b>Camera</b> button${touchUI ? '' : ' (or C)'} changes the view: from behind, from the front, from either side, straight down from 15, 60 or 250 m, and the rover's own webcam on its mast.</td></tr>
    <tr><td><b>View</b></td><td>Drag to look round, ${touchUI ? 'pinch' : 'scroll'} to zoom.</td></tr>
  </table>`;
}

/* ====================================================================== map: the whole Moon with the regions rich in minerals, the base, the vehicle */
const gc = (la1, lo1, la2, lo2) => { const a = la1 * D2R, b = la2 * D2R, dl = (lo2 - lo1) * D2R; return { d: Math.acos(clamp(Math.sin(a) * Math.sin(b) + Math.cos(a) * Math.cos(b) * Math.cos(dl), -1, 1)) * R_MOON, brg: Math.atan2(Math.sin(dl) * Math.cos(b), Math.cos(a) * Math.sin(b) - Math.sin(a) * Math.cos(b) * Math.cos(dl)) }; };
/* colours of the three minerals, from the measured maps: green where there is more thorium, blue where there is more titanium
   (ilmenite), yellow where titanium is highest (armalcolite forms in the most titanium-rich basalts) */
function mineralCanvas(W, H) {
  const a = document.createElement('canvas'); a.width = 72; a.height = 36; const x = a.getContext('2d'), id = x.createImageData(72, 36);
  for (let j = 0; j < 36; j++) for (let i = 0; i < 72; i++) { const th = clamp((lp.g.Th_ppm[35 - j][i] - 1) / 7, 0, 1), ti = clamp((lp.g.TiO2_wt[35 - j][i] - 1) / 5.5, 0, 1), o = 4 * (j * 72 + i), y = clamp((ti - 0.72) / 0.2, 0, 1);
    const r = 255 * y, g = 235 * Math.max(th, y * 0.9), b = 255 * ti * (1 - y); id.data[o] = r; id.data[o + 1] = g; id.data[o + 2] = b; id.data[o + 3] = 255 * clamp(Math.max(th, ti) * 0.55, 0, 0.4); }
  x.putImageData(id, 0, 0); const b = document.createElement('canvas'); b.width = W; b.height = H; const c = b.getContext('2d'); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(a, 0, 0, W, H);
  for (const d of lp.deposits) { const px = (d.lon + 180) / 360 * W, py = (90 - d.lat) / 180 * H, ry = Math.max(2.2, d.rad / 30.32 / 180 * H * 1.5), rx = ry / Math.max(0.25, Math.cos(d.lat * D2R)), col = ['', '74,168,255', '53,227,154', '255,216,74'][d.type];
    c.save(); c.translate(px, py); c.scale(rx / ry, 1); const g = c.createRadialGradient(0, 0, 0, 0, 0, ry); g.addColorStop(0, `rgba(${col},1)`); g.addColorStop(0.55, `rgba(${col},.75)`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.beginPath(); c.arc(0, 0, ry, 0, 6.3); c.fill(); c.restore(); }
  return b;
}
const mini = {
  bg: null, known: null, full: null, W: 1024, H: 512, local: null, last: null, all: false,
  build() { const mk = () => { const c = document.createElement('canvas'); c.width = this.W; c.height = this.H; return c; }; const b = this.bg = mk(), x = b.getContext('2d'); x.drawImage(terrain.texGlobal.image, 0, 0, this.W, this.H); x.fillStyle = 'rgba(0,0,0,.42)'; x.fillRect(0, 0, this.W, this.H);
    this.known = mk(); this.full = lp.g ? mineralCanvas(this.W, this.H) : mk(); this.reveal(BASE.ll[0], BASE.ll[1], 90, true);
    $('mini').addEventListener('click', () => this.toggle()); },
  toggle() { $('mini').classList.toggle('big'); this.draw(); },
  /* from 500 units of energy the whole survey is handed over */
  revealAll() { this.all = true; const x = this.known.getContext('2d'); x.clearRect(0, 0, this.W, this.H); x.fillStyle = 'rgba(190,225,235,.10)'; x.fillRect(0, 0, this.W, this.H); x.drawImage(this.full, 0, 0); for (const d of lp.deposits) d.seen = true; if (orbit.maps[1]) orbit.maps[1].needsUpdate = true; },
  /* uncover what lies within r km of a place: the colours of the map, and any deposit there */
  reveal(lat, lon, r, quiet) {
    this.last = [lat, lon, r]; if (this.all) return;
    const x = this.known.getContext('2d'), W = this.W, H = this.H, px = (lon + 180) / 360 * W, py = (90 - lat) / 180 * H, ry = r / 30.32 / 180 * H, rx = ry / Math.max(0.2, Math.cos(lat * D2R));
    for (const off of [0, -W, W]) { x.save(); x.beginPath(); x.ellipse(px + off, py, rx, ry, 0, 0, 6.3); x.clip(); x.fillStyle = 'rgba(190,225,235,.10)'; x.clearRect(0, 0, W, H); x.fillRect(0, 0, W, H); x.drawImage(this.full, 0, 0); x.restore(); }
    let found = null; for (const d of lp.deposits) if (!d.seen && gc(lat, lon, d.lat, d.lon).d < (r + d.rad * 0.5) * 1000) { d.seen = true; found = d; }
    if (found && !quiet) { sfx.bell(1319, 0, 0.8, 0.25); sfx.bell(1760, 0.12, 0.9, 0.22); toast(`New on the map: a deposit of ${GEM[found.type].name}`, 3500); }
    if (orbit.maps[1]) orbit.maps[1].needsUpdate = true;
  },
  COL: ['', '#4aa8ff', '#35e39a', '#ffd84a'],
  draw() {
    if (!this.bg) return; const x = $('miniC').getContext('2d'), W = this.W, H = this.H, big = $('mini').classList.contains('big');
    if (this.local) { x.save(); x.scale(W / 440, H / 220); this.local(x, 440, 220); x.restore(); return; }
    const veh = G.mode === 'lander' ? lander : rover, cur = orbit.on ? [orbit.lat, orbit.lon] : terrain.toLatLon(veh.pos.x, veh.pos.y), P = ll => [(ll[1] + 180) / 360 * W, (90 - ll[0]) / 180 * H], k = big ? 1.3 : 2.3;      // marker size: the small map is drawn at more than twice its screen size
    const hKm = orbit.on ? 0 : (G.mode === 'lander' ? Math.max(0, lander.pos.z - clip.ground(lander.pos.x, lander.pos.y)) : rover.fly ? rover.agl : 0) / 1000, r = orbit.on ? 300 : Math.min(500, 90 + 9 * hKm);       // the higher you are, the more you survey
    if (!this.last || r > this.last[2] * 1.25 || gc(cur[0], cur[1], this.last[0], this.last[1]).d > r * 350) this.reveal(cur[0], cur[1], r);
    x.drawImage(this.bg, 0, 0); x.drawImage(this.known, 0, 0);
    const near = [], hint = [];                             // deposits known, nearest first; and those only hinted at
    for (const d of lp.deposits) { const g = gc(cur[0], cur[1], d.lat, d.lon); if (d.seen) near.push({ d, g }); else if (g.d / 1000 < Math.max(650, r * 2.6) + d.rad) hint.push({ d, g, a: clamp(1.2 - g.d / 1000 / (Math.max(650, r * 2.6) + d.rad), 0.2, 0.7) }); }
    near.sort((a, b) => a.g.d - b.g.d);
    for (const h of hint) { const q = P([h.d.lat, h.d.lon]); x.globalAlpha = h.a; x.fillStyle = this.COL[h.d.type]; x.beginPath(); x.arc(q[0], q[1], 3.4 * k, 0, 6.3); x.fill(); } x.globalAlpha = 1;
    if (this.all) for (const n of near) { const q = P([n.d.lat, n.d.lon]); x.strokeStyle = 'rgba(0,0,0,.7)'; x.lineWidth = 1.2 * k; x.fillStyle = this.COL[n.d.type]; x.beginPath(); x.arc(q[0], q[1], 2.6 * k, 0, 6.3); x.fill(); x.stroke(); }      // a crisp dot on every deposit, so that none is lost in the colours
    const dot = (ll, col, rr, sq) => { const q = P(ll); x.fillStyle = col; x.strokeStyle = '#000'; x.lineWidth = 2 * k; x.beginPath(); sq ? x.rect(q[0] - rr, q[1] - rr, 2 * rr, 2 * rr) : x.arc(q[0], q[1], rr, 0, 6.3); x.fill(); x.stroke(); };
    dot(BASE.ll, '#ffffff', 4 * k, true); const q = P(cur); x.strokeStyle = '#ff3b30'; x.lineWidth = 2.5 * k; x.beginPath(); x.arc(q[0], q[1], 9 * k, 0, 6.3); x.stroke(); dot(cur, '#ff3b30', 3 * k);
    const head = orbit.on ? 0 : G.mode === 'lander' ? lander.yaw : rover.heading(), km = d => d < 1000 ? fm(d, 0) + ' m' : fm(d / 1000, d < 20000 ? 1 : 0) + ' km', arrow = (brg) => `<span class="arr" style="transform:rotate(${((brg - head) * R2D).toFixed(0)}deg)">↑</span>`;
    const b = gc(cur[0], cur[1], BASE.ll[0], BASE.ll[1]); let t = `<span>■ Base ${km(b.d)} ${arrow(b.brg)}</span>`;
    if (G.mode === 'rover' && !orbit.on) { const ll = terrain.toLatLon(lander.pos.x, lander.pos.y), l = gc(cur[0], cur[1], ll[0], ll[1]); t += `<span style="color:#ffd84a">▲ Lander ${km(l.d)} ${arrow(l.brg)}</span>`; }
    for (let ty = 1; ty <= 3; ty++) { const n = near.find(q => q.d.type === ty); if (n) t += `<span class="dep" style="color:${this.COL[ty]}">● ${GEM[ty].name} ${n.g.d < n.d.rad * 1000 ? 'here' : km(n.g.d)} ${n.g.d < n.d.rad * 1000 ? '' : arrow(n.g.brg)}</span>`; }
    if ($('miniTxt')._t !== t) { $('miniTxt')._t = t; $('miniTxt').innerHTML = t; }
    if (big) this.zoom(cur, head, near, hint);
  },
  /* close-up of the region round the vehicle, shown when the map is opened: deposits at their true size, with names and distances */
  zoom(cur, head, near, hint) {
    const c = $('miniZ'), x = c.getContext('2d'), W = c.width, H = c.height, im = terrain.texGlobal.image, R = clamp((near[2] ? near[2].g.d / 1000 : near[0] ? near[0].g.d / 1000 : 100) * 1.35, 45, 2500), dLat = R / 30.32, dLon = 2 * R / (30.32 * Math.max(0.2, Math.cos(cur[0] * D2R)));
    x.fillStyle = '#0a0d10'; x.fillRect(0, 0, W, H); x.imageSmoothingQuality = 'high'; x.drawImage(im, (cur[1] - dLon + 180) / 360 * im.width, (90 - cur[0] - dLat) / 180 * im.height, 2 * dLon / 360 * im.width, 2 * dLat / 180 * im.height, 0, 0, W, H); x.fillStyle = 'rgba(0,0,0,.38)'; x.fillRect(0, 0, W, H);
    const P = (lat, lon) => [W / 2 + wrap180(lon - cur[1]) / dLon * W / 2, H / 2 - (lat - cur[0]) / dLat * H / 2], km = d => d < 1000 ? fm(d, 0) + ' m' : fm(d / 1000, d < 20000 ? 1 : 0) + ' km'; x.font = '600 20px ui-monospace,Menlo,Consolas,monospace'; x.textBaseline = 'middle';
    for (const h of hint) { const q = P(h.d.lat, h.d.lon); x.globalAlpha = h.a; x.fillStyle = this.COL[h.d.type]; x.beginPath(); x.arc(q[0], q[1], 9, 0, 6.3); x.fill(); } x.globalAlpha = 1;
    for (const n of near) { const q = P(n.d.lat, n.d.lon), rr = Math.max(7, n.d.rad / R * H / 2); if (q[0] < -rr || q[0] > W + rr || q[1] < -rr || q[1] > H + rr) continue;
      x.globalAlpha = 0.35; x.fillStyle = this.COL[n.d.type]; x.beginPath(); x.arc(q[0], q[1], rr, 0, 6.3); x.fill(); x.globalAlpha = 1; x.strokeStyle = this.COL[n.d.type]; x.lineWidth = 3; x.stroke();
      const lab = `${GEM[n.d.type].name} ${km(n.g.d)}`; x.lineWidth = 5; x.strokeStyle = 'rgba(0,0,0,.85)'; x.strokeText(lab, q[0] + rr + 8, q[1]); x.fillStyle = '#fff'; x.fillText(lab, q[0] + rr + 8, q[1]); }
    const mark = (ll, col, lab, sq) => { const q = P(ll[0], ll[1]); x.fillStyle = col; x.strokeStyle = '#000'; x.lineWidth = 3; x.beginPath(); sq ? x.rect(q[0] - 8, q[1] - 8, 16, 16) : (x.moveTo(q[0], q[1] - 11), x.lineTo(q[0] + 10, q[1] + 8), x.lineTo(q[0] - 10, q[1] + 8), x.closePath()); x.fill(); x.stroke(); x.lineWidth = 5; x.strokeStyle = 'rgba(0,0,0,.85)'; x.strokeText(lab, q[0] + 14, q[1] - 16); x.fillStyle = col; x.fillText(lab, q[0] + 14, q[1] - 16); };
    mark(BASE.ll, '#ffffff', 'Base', true); if (G.mode === 'rover' && !orbit.on) mark(terrain.toLatLon(lander.pos.x, lander.pos.y), '#ffd84a', 'Lander');
    x.save(); x.translate(W / 2, H / 2); x.rotate(head); x.fillStyle = '#ff3b30'; x.strokeStyle = '#000'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, -20); x.lineTo(13, 14); x.lineTo(0, 7); x.lineTo(-13, 14); x.closePath(); x.fill(); x.stroke(); x.restore();
    const nice = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].reduce((a, v) => v <= R * 0.5 ? v : a, 1), bw = nice / R * H / 2; x.strokeStyle = '#fff'; x.lineWidth = 4; x.beginPath(); x.moveTo(24, H - 26); x.lineTo(24 + bw, H - 26); x.stroke(); x.fillStyle = '#fff'; x.fillText(nice + ' km', 30 + bw, H - 26); x.fillText('N ↑', W - 70, 28);
  },
};

/* ====================================================================== names of real features (IAU / USGS gazetteer, same file as Lunar Flight) */
const labels = {
  all: null, F: null, act: [], pool: [], next: 0, nextArea: 0,
  async load() {
    try { const j = await (await fetch('../lunar-flight/assets/nomenclature.json')).json(); this.all = j.features.filter(f => f[4] !== 'SF').map(f => ({ n: f[0], lat: f[1], lon: f[2], D: Math.max(f[3], 0.03) * 1000 })); this.rebuild(); }
    catch (e) { console.warn('names not available', e.message); }
  },
  rebuild() {                                             // positions on the current map, for features within 450 km
    if (!this.all) return; this.F = []; this.next = 0;
    for (const f of this.all) { const p = terrain.fromLatLon(f.lat, f.lon); if (Math.hypot(p[0], p[1]) < 4.5e5 && Math.abs(f.lat - terrain.lat0) < 20) { f.x = p[0]; f.y = p[1]; this.F.push(f); } }
  },
  area(p) {                                               // smallest catalogued feature whose circle contains the vehicle
    if (!this.F) return ''; let best = null, near = null, nd = 1e12;
    for (const f of this.F) { const d = Math.hypot(f.x - p.x, f.y - p.y); if (d < f.D / 2 && (!best || f.D < best.D)) best = f; if (d < nd) { nd = d; near = f; } }
    return best ? 'in ' + best.n : near ? `${near.n} ${fm(nd / 1000, 0)} km` : '';
  },
  frame() {
    const box = $('names'); if (!this.F || !G.names) { if (this.act.length) { this.act = []; for (const e of this.pool) e.style.display = 'none'; } return; }
    const eye = camera.position;
    if (G.t > this.nextArea) { this.nextArea = G.t + 1; G.area = this.area(G.mode === 'lander' ? lander.pos : rover.pos); }
    if (G.t > this.next) {                                  // a few times per second: which names matter from here
      this.next = G.t + 0.5; const c = [];
      for (const f of this.F) { const d = Math.hypot(f.x - eye.x, f.y - eye.y), sc = f.D / Math.max(d, 400); if (d < 5000 || sc > 0.045) c.push([sc + (d < 5000 ? 1 : 0), f]); }
      c.sort((a, b) => b[0] - a[0]); this.act = c.slice(0, touchUI ? 6 : 9).map(q => q[1]);
    }
    const hAgl = Math.max(1, eye.z - clip.ground(eye.x, eye.y)), dip = Math.sqrt(2 * hAgl / R_MOON);
    for (let k = 0; k < Math.max(this.act.length, this.pool.length); k++) {
      let e = this.pool[k]; if (!e) { e = this.pool[k] = document.createElement('div'); e.className = 'nm'; box.appendChild(e); }
      const f = this.act[k]; if (!f) { e.style.display = 'none'; continue; }
      const dx = f.x - eye.x, dy = f.y - eye.y, d = Math.hypot(dx, dy), p = tmp.c;
      if (d < 2500) p.set(f.x, f.y, clip.ground(f.x, f.y) + 2); else p.set(eye.x + dx / d * 2500, eye.y + dy / d * 2500, eye.z - 2500 * Math.tan(dip));   // far ones: on the horizon, in their direction
      p.project(camera);
      if (p.z > 1 || Math.abs(p.x) > 0.97 || Math.abs(p.y) > 0.95) { e.style.display = 'none'; continue; }
      e.style.display = ''; e.style.transform = `translate(${((p.x + 1) * innerWidth / 2).toFixed(1)}px,${((1 - p.y) * innerHeight / 2).toFixed(1)}px)`;
      const txt = f.n + ' · ' + (d < 1000 ? fm(d, 0) + ' m' : fm(d / 1000, d < 20000 ? 1 : 0) + ' km'); if (e._t !== txt) { e._t = txt; e.textContent = txt; }
    }
  },
};

/* ====================================================================== main */
/* ====================================================================== orbit: the Moon as a globe, to choose where to go down.
   This is a viewpoint sliding over the Moon, not an orbit being flown: a real one at 100 km takes two hours a lap. */
const RKM = R_MOON / 1000;
const orbit = {
  on: false, lat: 0, lon: 0, alt: 100, armed: false, hudT: 0, selT: 0, act: [], area: '',
  build() {
    const sc = this.scene = new THREE.Scene(); sc.background = new THREE.Color(0x000000);
    const g = new THREE.SphereGeometry(RKM, 128, 64); g.rotateX(Math.PI / 2);                 // north = +z, longitude 0 = +x, east = +y
    sc.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: terrain.texGlobal, roughness: 1, metalness: 0 })));
    const og = g.clone(); og.scale(1.004, 1.004, 1.004); this.over = new THREE.Mesh(og, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9, depthWrite: false })); this.over.visible = false; sc.add(this.over);
    const sl = (terrain.site.lon - 72) * D2R, s2 = new THREE.DirectionalLight(0xffffff, 3.0); s2.position.set(Math.cos(sl), Math.sin(sl), 0.05); sc.add(s2, new THREE.AmbientLight(0xffffff, 1.1));
    const e = new THREE.Mesh(new THREE.SphereGeometry(6371, 32, 16), new THREE.MeshLambertMaterial({ color: 0x4f86c6, emissive: 0x0a1626 })); e.position.set(384400, 0, 0); sc.add(e);   // the Earth, at its real distance and size
    this.cam = new THREE.PerspectiveCamera(45, 1, 20, 1.2e6); this.cam.up.set(0, 0, 1);
  },
  P(lat, lon, r, out) { const a = lat * D2R, o = lon * D2R; return out.set(Math.cos(a) * Math.cos(o) * r, Math.cos(a) * Math.sin(o) * r, Math.sin(a) * r); },
  /* overlay of a measured element map: 0 photo only, 1 thorium, 2 titanium dioxide */
  map: 0, maps: [],
  mapLabel() { return 'Map: ' + ['photo', 'minerals', 'thorium', 'titanium'][this.map]; },
  nextMap() {
    if (!lp.g) return toast('The element maps are not loaded', 2000); this.map = (this.map + 1) % 4; this.over.visible = this.map > 0;
    if (this.map === 1 && !this.maps[1]) { const t = new THREE.CanvasTexture(mini.known); t.colorSpace = THREE.SRGBColorSpace; this.maps[1] = t; }
    if (this.map > 1 && !this.maps[this.map]) { const key = this.map === 2 ? 'Th_ppm' : 'TiO2_wt', top = this.map === 2 ? 11 : 8, a = document.createElement('canvas'); a.width = 72; a.height = 36; const x = a.getContext('2d'), id = x.createImageData(72, 36);
      for (let j = 0; j < 36; j++) for (let i = 0; i < 72; i++) { const t = clamp(lp.g[key][35 - j][i] / top, 0, 1), o = 4 * (j * 72 + i), c = this.map === 2 ? [40 + 215 * t, 255 * Math.min(1, t * 1.6), 120 * (1 - t) + 60 * t] : [60 + 190 * t * t, 110 + 140 * t, 255];
        id.data[o] = c[0]; id.data[o + 1] = c[1]; id.data[o + 2] = c[2]; id.data[o + 3] = 255 * Math.min(0.85, 0.08 + 1.1 * t); }
      x.putImageData(id, 0, 0); const b = document.createElement('canvas'); b.width = 720; b.height = 360; const y = b.getContext('2d'); y.imageSmoothingEnabled = true; y.imageSmoothingQuality = 'high'; y.drawImage(a, 0, 0, 720, 360);
      const t = new THREE.CanvasTexture(b); t.colorSpace = THREE.SRGBColorSpace; this.maps[this.map] = t; }
    if (this.map) { this.over.material.map = this.maps[this.map]; this.over.material.needsUpdate = true; }
    toast(['Photograph only', 'What you have surveyed so far: green thorium, blue ilmenite, yellow armalcolite.\nThe rest of the Moon is still to explore.', 'Thorium measured from orbit by Lunar Prospector.\nBright = up to 11 ppm. More thorium in the region, more thorium ore in its rocks.', 'Titanium dioxide measured from orbit by Lunar Prospector.\nBright = up to 8%. More titanium, more ilmenite and armalcolite.'][this.map], 6000); buildActs();
  },
  enter() {
    if (!this.scene) this.build(); const ll = terrain.toLatLon(lander.pos.x, lander.pos.y); this.lat = clamp(ll[0], -82, 82); this.lon = ll[1]; this.alt = 100; this.armed = false; this.on = true;
    document.body.classList.add('orbit'); buildActs(); toast('Above 100 km: the whole Moon.\nKeep climbing, move the circle over the place you want,\nthen come back down to descend there.', 8000);
  },
  leave() {
    this.on = false; document.body.classList.remove('orbit'); setAnchorAt(this.lat, this.lon);
    const p = terrain.fromLatLon(this.lat, this.lon); clip.update(p[0], p[1], 800); lander.pos.set(p[0], p[1], clip.ground(p[0], p[1]) + 99000); lander.vel.set(0, 0, 0); lander.landed = false;
    buildActs(); toast('Descending' + (this.area ? ' — ' + this.area : ''), 4000);
  },
  step(dt, ax, ay, vz) {
    G.t += dt; this.alt = clamp(this.alt * Math.exp(vz * 1.1 * dt), 100, 20000); if (this.alt > 102) this.armed = true;
    const k = 0.9 * this.alt / RKM * R2D * dt * Math.min(1, 0.3 + 600 / this.alt);       // the ground slides by at a similar pace on screen whatever the height
    this.lat = clamp(this.lat + ay * k, -82, 82); this.lon = wrap180(this.lon + ax * k / Math.max(0.25, Math.cos(this.lat * D2R)));
    if (this.armed && vz < 0 && this.alt <= 100.001) return this.leave();
    sfx.frame(dt, { thrust: 0.12 * Math.abs(vz), throttle: 0, wheel: 0, speed: 0, ground: false, geiger: 0 });
    this.hudT -= dt; if (this.hudT <= 0) { this.hudT = 0.2;
      if (labels.all) { let best = null; const la = this.lat * D2R, lo = this.lon * D2R; for (const f of labels.all) { const a = f.lat * D2R, d = Math.acos(clamp(Math.sin(la) * Math.sin(a) + Math.cos(la) * Math.cos(a) * Math.cos(f.lon * D2R - lo), -1, 1)) * R_MOON; if (d < f.D / 2 && (!best || f.D < best.D)) best = f; } this.area = best ? 'over ' + best.n : ''; }
      const row = (a, b, c = '') => `<span class="k">${a.padEnd(8)}</span><span class="${c}">${b}</span>\n`;
      $('stat').innerHTML = row('HEIGHT', fm(this.alt, 0) + ' km') + row('LAT LON', `${fm(Math.abs(this.lat), 1)}°${this.lat >= 0 ? 'N' : 'S'} ${fm(Math.abs(this.lon), 1)}°${this.lon >= 0 ? 'E' : 'W'}`) + (this.area ? row('AREA', this.area.length > 24 ? this.area.slice(0, 23) + '…' : this.area) : '') + row('SIDE', Math.abs(this.lon) < 90 ? 'near side' : 'far side') + (lp.g ? row('REGION', lp.text(this.lat, this.lon), 'ok') : '') + row('DESCEND', this.alt > 100.5 ? 'come down to 100 km' : 'hold ▼', 'warn'); hudScore(); mini.draw(); }
  },
  draw() {
    const c = this.cam; c.aspect = innerWidth / innerHeight; c.near = Math.max(5, this.alt * 0.3); c.updateProjectionMatrix();
    this.P(this.lat, this.lon, RKM + this.alt, c.position); c.lookAt(0, 0, 0); c.updateMatrixWorld();
    const box = $('names'), pool = labels.pool, want = G.names && labels.all ? 12 : 0;      // names of the features large enough to read from this height
    this.selT -= 1; if (this.selT <= 0 && want) { this.selT = 12; const cp = c.position, lim = RKM * RKM * 1.02, a = [];
      for (const f of labels.all) { if (f.D < this.alt * 45 || this.alt > 9000) continue; this.P(f.lat, f.lon, RKM, tmp.c); if (tmp.c.dot(cp) < lim) continue; a.push(f); }
      a.sort((p, q) => q.D - p.D); this.act = a.slice(0, want); }
    for (let i = 0; i < Math.max(pool.length, want); i++) {
      let e = pool[i]; if (!e) { e = pool[i] = document.createElement('div'); e.className = 'nm'; box.appendChild(e); }
      const f = this.act[i]; if (!f || !want) { e.style.display = 'none'; continue; }
      const p = this.P(f.lat, f.lon, RKM, tmp.c).project(c); if (p.z > 1 || Math.abs(p.x) > 0.97 || Math.abs(p.y) > 0.95) { e.style.display = 'none'; continue; }
      e.style.display = ''; e.style.transform = `translate(${((p.x + 1) * innerWidth / 2).toFixed(1)}px,${((1 - p.y) * innerHeight / 2).toFixed(1)}px)`; if (e._t !== f.n) { e._t = f.n; e.textContent = f.n; }
    }
    renderer.render(this.scene, c);
  },
};

/* ====================================================================== the journey home (version 2): four checkpoints.
   A mistake restarts the checkpoint where it happened. The Earth is shown with real NASA images (tools/fetch_earth.py). */
const texLoad = url => new Promise((ok, no) => new THREE.TextureLoader().load(url, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; ok(t); }, undefined, () => no(new Error('cannot load ' + url))));
function asteroidGeo(seed, sw = 30, sh2 = 20) {                             // an irregular, cratered body: a sphere pushed in and out by smooth noise, with a few dents
  const g = new THREE.SphereGeometry(1, sw, sh2), P = g.attributes.position, r = rng(seed), o = [r() * 50, r() * 50, r() * 50], ax = [0.75 + r() * 0.5, 0.75 + r() * 0.5, 0.75 + r() * 0.5], v = V();
  const n3 = (x, y, z) => { const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z), fx = x - ix, fy = y - iy, fz = z - iz, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), sz = fz * fz * (3 - 2 * fz), h = (a, b, c) => hash3(a, b, c * 131 + seed) / 4294967296, L = (a, b, t) => a + (b - a) * t;
    return L(L(L(h(ix, iy, iz), h(ix + 1, iy, iz), sx), L(h(ix, iy + 1, iz), h(ix + 1, iy + 1, iz), sx), sy), L(L(h(ix, iy, iz + 1), h(ix + 1, iy, iz + 1), sx), L(h(ix, iy + 1, iz + 1), h(ix + 1, iy + 1, iz + 1), sx), sy), sz) - 0.5; };
  const dents = Array.from({ length: 7 }, () => ({ d: V(r() - 0.5, r() - 0.5, r() - 0.5).normalize(), a: 0.22 + r() * 0.45, k: 0.07 + r() * 0.15 }));
  for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i).normalize(); let sc = 1 + 0.6 * n3(v.x * 1.5 + o[0], v.y * 1.5 + o[1], v.z * 1.5 + o[2]) + 0.24 * n3(v.x * 4 + o[1], v.y * 4 + o[2], v.z * 4 + o[0]) + 0.08 * n3(v.x * 10 + o[2], v.y * 10 + o[0], v.z * 10 + o[1]);
    for (const c of dents) { const an = Math.acos(clamp(v.dot(c.d), -1, 1)); if (an < c.a) { const q = 1 - an / c.a; sc -= c.k * q * q * (3 - 2 * q); } } P.setXYZ(i, v.x * sc * ax[0], v.y * sc * ax[1], v.z * sc * ax[2]); }
  g.computeVertexNormals(); return g;
}
const ret = {
  on: false, ph: '', t: 0, dead: 0,
  WIN: 0.1, LAP: 7, TOL: 0.45,                            // burn window (rad, each side), seconds per orbit, landing tolerance (km)
  async build() {
    const meta = this.meta = await (await fetch('data/earth.json', { cache: 'no-cache' })).json(), I = meta.images, [tg, tf, tc, tk] = await Promise.all(['earth_globe.jpg', 'earth_florida.jpg', 'earth_coast.jpg', 'earth_cape.jpg'].map(f => texLoad('data/' + f)));
    this.tgt = meta.target; this.coastImg = tc.image; this.globeImg = tg.image;
    const px = (img, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0, w, h); return x.getImageData(0, 0, w, h).data; };
    this.coastPx = px(tc.image, 512, 512); this.globePx = px(tg.image, 1024, 512);
    const sph = (r, m, seg = 96) => { const g = new THREE.SphereGeometry(r, seg, seg >> 1); g.rotateX(Math.PI / 2); return new THREE.Mesh(g, m); };
    // ---- A: the Moon, the parking orbit, the burn window
    const A = this.sA = new THREE.Scene(); A.add(sph(RKM, new THREE.MeshStandardMaterial({ map: terrain.texGlobal, roughness: 1 }))); { const d = new THREE.DirectionalLight(0xffffff, 3); d.position.set(-0.6, -0.5, 0.6); A.add(d, new THREE.AmbientLight(0xffffff, 0.7)); }
    const ring = (r, a0, a1, col) => { const p = []; for (let i = 0; i <= 96; i++) { const a = a0 + (a1 - a0) * i / 96; p.push(Math.cos(a) * r, Math.sin(a) * r, 0); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); return new THREE.Line(g, new THREE.LineBasicMaterial({ color: col })); };
    const RO = RKM + 100; A.add(ring(RO, 0, 6.2832, 0x5f8f9c)); for (const d of [-18, -9, 0, 9, 18]) A.add(ring(RO + d, Math.PI - this.WIN, Math.PI + this.WIN, 0x49ff8a));
    this.dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,255,255,1)', 'rgba(255,220,140,.6)'), depthTest: false })); this.dot.scale.setScalar(300); A.add(this.dot);
    this.camA = new THREE.PerspectiveCamera(40, 1, 100, 1e5); this.camA.position.set(0, 0, 7600); this.camA.up.set(0, 1, 0); this.camA.lookAt(0, 0, 0);
    // ---- N: deep space and the fire of the entry
    const N = this.sN = new THREE.Scene(); N.environment = scene.environment; N.background = new THREE.Color(0); { const d = new THREE.DirectionalLight(0xfff4e6, 4.2); d.position.set(-0.7, -0.35, 0.6); N.add(d, new THREE.AmbientLight(0xffffff, V4 ? 0.75 : 0.2)); if (V4) { const f = new THREE.DirectionalLight(0xbfd4ff, 1.6); f.position.set(0.3, -1, 0.2); N.add(f); } }
    this.ship = makeLander(); this.ship.rotation.x = -Math.PI / 2; N.add(this.ship);
    const add = new THREE.SpriteMaterial({ map: glowTex('rgba(235,245,255,1)', 'rgba(90,150,255,.6)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    this.jet = new THREE.Sprite(add); this.ship.add(this.jet); this.jet.position.set(0, 0, -0.9);            // the glow of the engine at the nozzle
    const eg = this.earth = new THREE.Group(); eg.add(sph(1, new THREE.MeshStandardMaterial({ map: tg, roughness: 0.85, metalness: 0 }), 128));
    eg.add(sph(1.035, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: 'varying vec3 vN, vV; void main(){ vec4 p = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-p.xyz); gl_Position = projectionMatrix * p; }',
      fragmentShader: 'varying vec3 vN, vV; void main(){ float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.2); gl_FragColor = vec4(0.35, 0.62, 1.0, 1.0) * f * 1.25; }' }), 64));
    eg.rotation.set(0.489, 0, -0.164); N.add(eg);
    const mkPts = (n, R, size, col) => { const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const v = V(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(R); a.set([v.x, v.y, v.z], 3 * i); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); return new THREE.Points(g, new THREE.PointsMaterial({ color: col, size, sizeAttenuation: false })); };
    this.stars = mkPts(2400, 4000, 1.4, 0xffffff); N.add(this.stars);
    this.dust = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xbdb6aa, size: 0.07, sizeAttenuation: true })); { const a = new Float32Array(300 * 3); for (let i = 0; i < 300; i++) a.set([(Math.random() - 0.5) * 80, Math.random() * 320 - 20, (Math.random() - 0.5) * 50], 3 * i); this.dust.geometry.setAttribute('position', new THREE.BufferAttribute(a, 3)); } this.dust.frustumCulled = false; N.add(this.dust);
    const geos = [11, 23, 37, 51, 67].map(sd => asteroidGeo(sd)),      /* (map would pass the index as the second argument and leave the shapes empty) */ am = [0x6b635a, 0x574f47, 0x7a7167].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.96, metalness: 0.04, bumpMap: crinkle, bumpScale: 2.5, envMapIntensity: 0.15 }));
    const warnMat = new THREE.SpriteMaterial({ map: canvasTex(128, 128, x => { x.strokeStyle = '#ff3a2a'; x.lineWidth = 7; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(64, 64, 54, i * 1.571 + 0.25, i * 1.571 + 1.32); x.stroke(); } }), depthTest: false, transparent: true });
    if (V4) for (const m of am) { m.color.multiplyScalar(1.9); m.emissive = new THREE.Color(0x2c2620); }
    this.rocks = []; for (let i = 0; i < 60; i++) { const m = new THREE.Mesh(geos[i % 5], am[i % 3]); if (V4) { const w = new THREE.Sprite(warnMat); w.scale.setScalar(3.2); w.visible = false; w.renderOrder = 30; m.add(w); m.userData.warn = w; } m.visible = false; N.add(m); this.rocks.push({ m, on: false }); }
    const hot = new THREE.SpriteMaterial({ map: glowTex('rgba(255,70,25,1)', 'rgba(190,0,0,.8)'), depthWrite: false, transparent: true }), warm = new THREE.SpriteMaterial({ map: glowTex('rgba(255,235,160,.55)', 'rgba(255,170,40,.28)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    this.cells = []; for (let i = 0; i < 48; i++) { const m = new THREE.Sprite(hot); m.visible = false; N.add(m); this.cells.push({ m, on: false }); }
    this.wisps = []; for (let i = 0; i < 40; i++) { const m = new THREE.Sprite(warm); m.position.set((Math.random() - 0.5) * 80, Math.random() * 260, (Math.random() - 0.5) * 46); m.scale.setScalar(10 + Math.random() * 16); m.visible = false; N.add(m); this.wisps.push(m); }
    this.bow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,255,255,1)', 'rgba(255,170,70,.7)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); this.bow.visible = false; N.add(this.bow);
    this.camN = new THREE.PerspectiveCamera(58, 1, 0.3, 9000);
    // the wreck: pieces of the ship and balls of fire, moved to whichever scene the ship is in
    this.deb = []; for (let i = 0; i < 46; i++) { const m = i % 3 ? box(0.5, 0.3, 0.08, i % 2 ? FOIL : ALU) : new THREE.Mesh(geos[i % 5], am[1]); m.visible = false; m.castShadow = false; this.deb.push({ m, v: V(), w: V() }); }
    const fm1 = new THREE.SpriteMaterial({ map: glowTex('rgba(255,255,235,1)', 'rgba(255,120,20,.85)'), blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true });
    this.fb = []; for (let i = 0; i < 16; i++) { const m = new THREE.Sprite(fm1.clone()); m.visible = false; m.renderOrder = 20; this.fb.push({ m, d: V(), s: 1 }); }
    // ---- C: the Earth laid flat. The whole globe, then Florida at 500 m per pixel, the coast at 100 m, the Cape at 30 m
    const C = this.sC = new THREE.Scene(); C.background = new THREE.Color(0x9fc4ec); C.fog = new THREE.Fog(0xa9cbee, 40, 700);
    const KY = 111.19, KX = 111.19 * Math.cos(this.tgt.lat * D2R), flat = (tex, b, order) => { const m = new THREE.Mesh(new THREE.PlaneGeometry((b.east - b.west) * KX, (b.north - b.south) * KY), new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false })); m.renderOrder = order; m.position.set(((b.east + b.west) / 2 - this.tgt.lon) * KX, ((b.north + b.south) / 2 - this.tgt.lat) * KY, 0); C.add(m); return m; };
    this.KX = KX; this.KY = KY; flat(tg, I['earth_globe.jpg'], 1); flat(tf, I['earth_florida.jpg'], 2); flat(tc, I['earth_coast.jpg'], 3); flat(tk, I['earth_cape.jpg'], 4);
    const mk = this.mark3 = new THREE.Group(), red = new THREE.MeshBasicMaterial({ color: 0xff2a1a, side: THREE.DoubleSide, fog: false, depthTest: false }); const R1 = Object.assign(new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 64), red), { renderOrder: 8 }), R2 = Object.assign(new THREE.Mesh(new THREE.RingGeometry(0.95, 1, 64), red), { renderOrder: 8 }); mk.add(R1, R2); this.ringTrue = R1; this.ringFar = R2;
    const beam = cyl(1, 1, 1, 8, new THREE.MeshBasicMaterial({ color: 0xff3a2a, transparent: true, opacity: 0.5, fog: false, depthTest: false })); beam.castShadow = false; beam.renderOrder = 8; mk.add(beam); mk.position.z = 0.02; C.add(mk); this.beam = beam;
    const foam = this.foam = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ color: 0xf4fbff, transparent: true, opacity: 0.9, depthTest: false })); foam.renderOrder = 7; foam.visible = false; C.add(foam);
    const sc2 = this.shipC = new THREE.Group(), lm = makeLander(); sc2.add(lm); this.flameC = lm.userData.flame; const can = canvasTex(256, 8, (x, w, h) => { for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? '#f4f4f0' : '#e2581c'; x.fillRect(i * 16, 0, 16, h); } });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(4.6, 24, 10, 0, 6.2832, 0, 1.25), new THREE.MeshBasicMaterial({ map: can, side: THREE.DoubleSide })); dome.geometry.rotateX(Math.PI / 2); dome.position.z = 9.5; sc2.add(dome);
    for (let i = 0; i < 8; i++) { const a = i * 0.785; sc2.add(strut(V(Math.cos(a) * 4.3, Math.sin(a) * 4.3, 10.9), V(0, 0, 3.4), 0.02, new THREE.MeshBasicMaterial({ color: 0xdddddd }))); }
    sc2.traverse(o => { o.renderOrder = 10; }); C.add(sc2, new THREE.AmbientLight(0xffffff, 2.2)); { const d = new THREE.DirectionalLight(0xffffff, 2.5); d.position.set(-0.4, -0.5, 0.8); C.add(d); } C.environment = scene.environment;
    this.camC = new THREE.PerspectiveCamera(55, 1, 0.004, 60000); this.camC.up.set(0, 0, 1);
  },
  water(x, y) {                                           // is this point of the Earth sea? read from the real pictures
    const lon = this.tgt.lon + x / this.KX, lat = this.tgt.lat + y / this.KY, b = this.meta.images['earth_coast.jpg'], u = (lon - b.west) / (b.east - b.west), v = (b.north - lat) / (b.north - b.south);
    if (u >= 0 && u <= 1 && v >= 0 && v <= 1) { const o = 4 * (clamp(Math.floor(v * 512), 0, 511) * 512 + clamp(Math.floor(u * 512), 0, 511)), p = this.coastPx; return p[o + 2] > p[o] * 1.12 && p[o] < 95; }
    const o = 4 * (clamp(Math.floor((90 - lat) / 180 * 512), 0, 511) * 1024 + ((Math.floor((lon + 180) / 360 * 1024) % 1024) + 1024) % 1024), p = this.globePx; return p[o + 2] > p[o] * 1.25 && p[o + 2] > p[o + 1];
  },
  say(n, text) { $('guide').innerHTML = `<b>CHECKPOINT ${n} OF 4</b>${text}`; $('guide').style.display = 'block'; },
  label() { return { lap: 'Burn engine', coast: 'Steer with the arrows', fire: 'Steer away from the red', done: 'Back to the Moon' }[this.ph] || '…'; },
  async start() { if (!this.sA) { toast('Preparing the journey…', 2500); try { await this.build(); } catch (e) { return toast('The images of the Earth could not be loaded: ' + e.message, 5000); } } orbit.on = false; document.body.classList.remove('orbit'); document.body.classList.add('ret'); for (const e of labels.pool) e.style.display = 'none'; for (const id of ['bigmsg', 'radio']) { const e = $(id); if (e) e.classList.remove('on'); } clearTimeout(bigT); $('msg').style.opacity = 0; this.on = true; this.go('lap'); },
  quit() { this.on = false; music.stop(); mini.local = null; $('mini').classList.remove('show'); document.body.classList.remove('ret'); $('guide').style.display = 'none'; $('bar').style.display = 'none'; $('heat').style.opacity = 0; ACT.rescue(); },
  go(ph) {
    this.ph = ph; this.t = 0; this.acc = 0; this.was = true; this.dead = 0; this.down = 0; $('bar').style.display = 'none'; $('heat').style.opacity = 0; mini.local = null; $('mini').classList.remove('show');
    for (const r of this.rocks) { r.on = false; r.m.visible = false; } for (const c of this.cells) { c.on = false; c.m.visible = false; } for (const d of this.deb) d.m.visible = false; for (const f of this.fb) f.m.visible = false;
    const fire = ph === 'fire'; for (const w of this.wisps) w.visible = fire; this.bow.visible = fire; this.earth.visible = ph === 'coast'; this.stars.visible = !fire; this.dust.visible = ph === 'coast'; this.ship.visible = true; this.shipC.visible = true; this.foam.visible = false;
    this.ship.position.set(0, 0, 0); this.ship.rotation.set(-Math.PI / 2, 0, 0); this.sN.background.set(0x000000); this.ship.userData.flame.visible = ph === 'coast'; this.jet.visible = ph === 'coast';
    if (ph === 'lap') { music.play('space'); this.th = 0; this.lock = -1; this.say(1, 'Lunar orbit. After <u>one full orbit</u>, hold <u>Burn</u> exactly while the ship crosses the small <span style="color:#49ff8a">green arc</span> behind the Moon. It lasts a fraction of a second: burn outside it and you must wait for the next orbit.'); }
    if (ph === 'coast') { music.play('space'); this.say(2, '384,000 km to the Earth, engine burning. <u>Steer with the arrows</u> through the meteoroids — <u>one hit destroys the ship</u>.' + (V4 ? ' A <span style="color:#ff3a2a">red ring</span> marks every rock on a collision course.' : '')); }
    if (ph === 'fire') { music.play('fire'); sfx.fanfare(); toast('ENTERING THE ATMOSPHERE', 4000); this.say(3, 'You are entering the atmosphere at 11 km/s. Yellow is hot; <span style="color:#ff5a3c">red is deadly</span>. <u>Do not touch the red</u>.'); }
    if (ph === 'cape') { music.play('descent'); const s0 = [[-430, -170], [390, 130], [-160, 430], [270, -390]][Math.floor(Math.random() * 4)]; this.px = s0[0]; this.py = s0[1]; this.psi = Math.atan2(-s0[0], -s0[1]) + (Math.random() - 0.5) * 0.8; this.alt = 45; this.vz = 0; this.w0 = Math.random() * 6.28; this.bank = 0;
      this.say(4, 'Through the fire, parachute open, thrusters alive. You can come down anywhere on Earth — but only at the <span style="color:#ff5a3c">red marker on the coast of Florida</span>, Cape Canaveral, is the cooling foam waiting. <u>Land inside the red ring.</u> ← → turn, ↑ ↓ speed, ▲ ▼ height (higher is faster).'); mini.local = (x, W, H) => this.map(x, W, H); $('mini').classList.add('show'); }
    if (ph === 'done') { music.stop(); G.home = (G.home || 0) + 1; sfx.rare(); setTimeout(() => sfx.fanfare(), 900); this.foam.visible = true; $('guide').innerHTML = `<b>MISSION COMPLETE</b>Touchdown at Cape Canaveral, ${fm(this.miss, 0)} m from the centre of the ring: the cooling foam covers the ship. Aboard: ${G.stats.il} ilmenite, ${G.stats.th} thorium and ${G.stats.ar || 0} armalcolite finds. You brought it home.`; }
    buildActs();
  },
  /* the ship is destroyed: a ball of fire, wreckage flying apart, and the checkpoint starts again */
  boom(msg, quiet) {
    if (this.dead > 0) return; this.dead = 2.8; this.deadMsg = msg; const inC = this.ph === 'cape', sc = inC ? this.sC : this.sN, obj = inC ? this.shipC : this.ship, at = obj.position, k = inC ? this.shipC.scale.x * 1.3 : 1; obj.visible = false; this.bow.visible = false;
    if (!quiet) { sfx.bigBoom(); G.shake = 1.4; $('heat').style.opacity = 1; }
    for (const d of this.deb) { sc.add(d.m); d.m.visible = !quiet; d.m.position.copy(at); d.v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar((5 + Math.random() * 30) * k); d.w.set(Math.random() * 8, Math.random() * 8, Math.random() * 8); d.m.scale.setScalar((0.5 + Math.random() * 1.6) * k); d.m.renderOrder = 15; }
    for (const f of this.fb) { sc.add(f.m); f.m.visible = !quiet; f.d.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(5 * k); f.m.position.copy(at); f.s = (3 + Math.random() * 7) * k; f.m.material.opacity = 1; }
    music.stop(); toast(msg, 3200);
  },
  bar(a, b) { const e = $('bar'); e.style.display = 'block'; e.firstElementChild.style.left = a * 100 + '%'; e.firstElementChild.style.width = (b - a) * 100 + '%'; },
  mark(v) { $('bar').lastElementChild.style.left = clamp(v, 0, 1) * 100 + '%'; },
  map(x, W, H) {                                         // small map: the whole Earth while far away, the Space Coast when near
    const d = Math.hypot(this.px, this.py), lon = this.tgt.lon + this.px / this.KX, lat = this.tgt.lat + this.py / this.KY; let P;
    if (d > 105) { const span = clamp(d / this.KX * 1.5, 8, 180), w0 = this.tgt.lon - span, w1 = this.tgt.lon + span, n0 = clamp(this.tgt.lat + span / 2, -90 + span, 90), im = this.globeImg; x.fillStyle = '#06203f'; x.fillRect(0, 0, W, H);
      x.drawImage(im, (w0 + 180) / 360 * im.width, (90 - n0) / 180 * im.height, (w1 - w0) / 360 * im.width, span / 180 * im.height, 0, 0, W, H); P = (lo, la) => [(lo - w0) / (w1 - w0) * W, (n0 - la) / span * H]; }
    else { const b = this.meta.images['earth_coast.jpg'], im = this.coastImg, R = 105, w0 = this.tgt.lon - R / this.KX, w1 = this.tgt.lon + R / this.KX, n0 = this.tgt.lat + R * 0.5 / this.KY, n1 = this.tgt.lat - R * 0.5 / this.KY;
      x.drawImage(im, (w0 - b.west) / (b.east - b.west) * im.width, (b.north - n0) / (b.north - b.south) * im.height, (w1 - w0) / (b.east - b.west) * im.width, (n0 - n1) / (b.north - b.south) * im.height, 0, 0, W, H); P = (lo, la) => [(lo - w0) / (w1 - w0) * W, (n0 - la) / (n0 - n1) * H]; }
    let q = P(this.tgt.lon, this.tgt.lat); x.strokeStyle = '#ff2a1a'; x.lineWidth = 3; x.beginPath(); x.arc(q[0], q[1], 9, 0, 6.3); x.stroke(); x.fillStyle = '#ff2a1a'; x.beginPath(); x.arc(q[0], q[1], 2.5, 0, 6.3); x.fill();
    q = P(lon, lat); x.save(); x.translate(q[0], q[1]); x.rotate(this.psi); x.fillStyle = '#fff'; x.strokeStyle = '#000'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, -11); x.lineTo(7, 8); x.lineTo(-7, 8); x.closePath(); x.fill(); x.stroke(); x.restore();
    const t = `<span>◯ Cape Canaveral ${d < 10 ? fm(d, 1) : fm(d, 0)} km</span>`; if ($('miniTxt')._t !== t) { $('miniTxt')._t = t; $('miniTxt').innerHTML = t; }
  },
  step(dt, ax, ay, burn, vz = 0) {
    G.t += dt; this.t += dt; const edge = burn && !this.was; this.was = burn; const row = (a, b, c = '') => `<span class="k">${a.padEnd(9)}</span><span class="${c}">${b}</span>\n`; let hud = '';
    sfx.frame(dt, { thrust: this.dead > 0 ? 0 : (burn && this.ph === 'lap') ? 0.9 : this.ph === 'coast' ? 0.45 : this.ph === 'fire' ? 0.8 : this.ph === 'cape' && vz > 0 ? 0.7 : 0, throttle: 0, wheel: 0, speed: 0, ground: false, geiger: 0 });
    if (this.dead > 0) {                                  // the wreck flies apart, then the checkpoint starts again
      this.dead -= dt; const age = 2.8 - this.dead; for (const d of this.deb) { d.m.position.addScaledVector(d.v, dt); d.m.rotation.x += d.w.x * dt; d.m.rotation.y += d.w.y * dt; }
      for (const f of this.fb) { f.m.position.addScaledVector(f.d, dt); f.m.scale.setScalar(f.s * (0.4 + age * 2.2)); f.m.material.opacity = Math.max(0, 1 - age / 1.9); }
      $('heat').style.opacity = Math.max(0, 1 - age * 1.2); if (this.dead <= 0) { toast(this.deadMsg + '\nStarting again from this checkpoint.', 4500); this.go(this.ph); } return;
    }
    if (this.ph === 'lap') {
      this.th += dt * 6.2832 / this.LAP; const laps = Math.floor(this.th / 6.2832), a = this.th % 6.2832, inWin = Math.abs(a - Math.PI) < this.WIN;      // one lap in 7 s; the real one takes 118 minutes
      this.dot.position.set(Math.cos(a) * (RKM + 100), Math.sin(a) * (RKM + 100), 0); this.dot.material.color.set(burn ? 0xffb060 : 0xffffff);
      if (edge) { if (laps < 1) toast('Not yet: complete one full orbit first.', 2500); else if (!inWin) { this.lock = a > Math.PI ? laps + 1 : laps; this.lockA = a > Math.PI ? 1 : 0; toast('Wrong moment: that burn was wasted.\nThe engine is locked until the green arc has passed once.', 3500); } }
      const locked = this.lock >= 0 && (laps < this.lock || (laps === this.lock && this.lockA === 0 && a < Math.PI + this.WIN)); if (!locked && this.lock >= 0 && !burn) this.lock = -1;
      if (burn && laps >= 1 && inWin && !locked) { this.acc += dt; if (this.acc > 0.1) { sfx.fanfare(); toast('Trans-Earth injection: on the way home.', 3500); return this.go('coast'); } } else if (!inWin) this.acc = 0;
      hud = row('ORBITS', `${laps} of 1`, laps ? 'ok' : '') + row('ENGINE', locked ? 'locked' : laps ? 'ready' : 'wait', locked ? 'warn' : laps ? 'ok' : '') + row('SPEED', '1.63 km/s') + row('LAP', `118 min (here ${this.LAP} s)`);
    } else if (this.ph === 'coast') {
      const T = 42, u = Math.min(1, this.t / T), r = 384400 * (1 - u) + 6700 * u, v = Math.sqrt(2 * 398600 / r + 0.6), sp = this.ship.position;
      sp.x = clamp(sp.x + ax * 14 * dt, -16, 16); sp.z = clamp(sp.z + ay * 11 * dt, -9, 9); this.ship.rotation.y = -ax * 0.4; const fl = this.ship.userData.flame; fl.scale.set(1, 1, 0.9 + Math.random() * 0.5); this.jet.scale.setScalar(2.2 + Math.random() * 0.8);
      if (V4) this.earth.position.set(-330, 900, 230); else this.earth.position.set(-4, 900, 3); this.earth.scale.setScalar(16 + 430 * u * u * u);      /* version 4: the Earth off to one side, so that nothing hides behind it */ this.earth.rotation.z = -0.164 + this.t * 0.004;
      const D = this.dust.geometry.attributes.position; for (let i = 0; i < D.count; i++) { let y = D.getY(i) - 170 * dt; if (y < -20) y += 320; D.setY(i, y); } D.needsUpdate = true;
      if (u < 0.95 && Math.random() < dt * (V4 ? 0.7 + 1.6 * Math.sin(u * Math.PI) : 1.6 + 4.2 * Math.sin(u * Math.PI))) { const k = this.rocks.find(q => !q.on); if (k) { k.on = true; k.m.visible = true; const aim = Math.random() < 0.5; k.m.position.set(aim ? sp.x + (Math.random() - 0.5) * 5 : (Math.random() - 0.5) * 42, 330, aim ? sp.z + (Math.random() - 0.5) * 3.5 : (Math.random() - 0.5) * 24); k.s = V4 ? 3.5 + Math.random() * 4.5 : 0.5 + Math.random() * Math.random() * 2.6; k.m.scale.setScalar(k.s); k.v = V4 ? 55 + Math.random() * 40 : 95 + Math.random() * 80; k.w = V(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5); k.dx = (Math.random() - 0.5) * 4; } }
      for (const k of this.rocks) { if (!k.on) continue; const p = k.m.position; p.y -= k.v * dt; p.x += k.dx * dt; if (k.m.userData.warn) k.m.userData.warn.visible = p.y > 3 && p.y < 330 && Math.hypot(p.x - sp.x, p.z - sp.z) < 1.2 + 0.5 * k.s + 1.5; k.m.rotation.x += k.w.x * dt * 2.2; k.m.rotation.y += k.w.y * dt * 2.2; k.m.rotation.z += k.w.z * dt * 2.2;
        if (Math.abs(p.y) < 2.5 && Math.hypot(p.x - sp.x, p.z - sp.z) < (V4 ? 1.2 + 0.5 * k.s : 1.0 + 0.8 * k.s) && this.t > 1.5) return this.boom('A meteoroid tore the ship apart.');
        else if (p.y < -30) { k.on = false; k.m.visible = false; } }
      hud = row('TO EARTH', fm(r, 0) + ' km') + row('SPEED', fm(v, 2) + ' km/s') + row('ENGINE', 'burning', 'ok') + row('TIME', 'about 3 days (here 42 s)');
      if (u >= 1) return this.go('fire');
    } else if (this.ph === 'fire') {
      const T = 32, u = Math.min(1, this.t / T), peak = Math.sin(u * Math.PI), sp = this.ship.position, bg = this.sN.background;
      sp.x = clamp(sp.x + ax * 14 * dt, -16, 16); sp.z = clamp(sp.z + ay * 11 * dt, -9, 9); this.ship.rotation.set(-Math.PI / 2 - 0.25, -ax * 0.35, 0);
      u < 0.5 ? bg.setRGB(0.12 + 1.5 * u, 0.03 + 0.9 * u, 0.01 + 0.2 * u) : bg.setRGB(0.87 - 0.9 * (u - 0.5), 0.48 + 0.5 * (u - 0.5), 0.11 + 1.6 * (u - 0.5));
      for (const w of this.wisps) { w.position.y -= (80 + w.scale.x * 2) * dt; if (w.position.y < -25) w.position.set((Math.random() - 0.5) * 80, 260, (Math.random() - 0.5) * 46); w.material.opacity = 0.35 + 0.65 * peak; }
      this.bow.position.set(sp.x, 2.2, sp.z - 0.6); this.bow.scale.setScalar(5 + 5 * peak + Math.random() * 0.8); $('heat').style.opacity = 0.15 + 0.4 * peak; G.shake = 0.05 + 0.08 * peak;
      if (u < 0.95 && this.t > 1 && Math.random() < dt * (1.6 + 4.4 * peak)) { const c = this.cells.find(q => !q.on); if (c) { c.on = true; c.m.visible = true; const aim = Math.random() < 0.5; c.r = 2.0 + Math.random() * 2.8; c.m.position.set(aim ? sp.x + (Math.random() - 0.5) * 7 : (Math.random() - 0.5) * 42, 240, aim ? sp.z + (Math.random() - 0.5) * 4 : (Math.random() - 0.5) * 24); c.m.scale.setScalar(c.r * 3.1); c.v = 75 + Math.random() * 60; } }
      for (const c of this.cells) { if (!c.on) continue; const p = c.m.position; p.y -= c.v * dt; if (p.y < -25) { c.on = false; c.m.visible = false; continue; } if (Math.abs(p.y) < 4 && Math.hypot(p.x - sp.x, p.z - sp.z) < c.r * 0.75) return this.boom('The ship flew into a red zone and burned up.'); }
      hud = row('SHIELD', fm(900 + 1900 * peak, 0) + ' °C', peak > 0.7 ? 'warn' : '') + row('HEIGHT', fm(120 - 75 * u, 0) + ' km') + row('SPEED', fm(11 - 10.4 * u * u, 1) + ' km/s') + row('RED', 'deadly', 'warn');
      if (u >= 1) { sfx.fanfare(); toast('Through the fire. Parachute open.', 3000); return this.go('cape'); }
    } else if (this.ph === 'cape') {
      const d = Math.hypot(this.px, this.py);
      if (this.down > 0) {                                // on the ground or in the water, away from the foam
        this.down -= dt; const wet = this.wet; if (wet) this.sink = (this.sink || 0) + dt * 0.4; G.shake = wet ? 0 : 0.1 + (3 - this.down) * 0.08; $('heat').style.opacity = wet ? 0 : clamp((3 - this.down) / 3, 0, 0.8);
        hud = row('TO TARGET', fm(d, d < 10 ? 1 : 0) + ' km', 'warn') + row('STATUS', wet ? 'taking in water' : 'hull overheating', 'warn');
        if (this.down <= 0) return this.boom(wet ? `The ship sank, ${fm(d, d < 10 ? 1 : 0)} km from Cape Canaveral.\nOnly the red ring on the coast of Florida is safe.` : `No cooling foam here: the hot ship exploded, ${fm(d, d < 10 ? 1 : 0)} km from Cape Canaveral.\nOnly the red ring on the coast of Florida is safe.`, wet);
      } else {
        const up = vz > 0 ? 0.3 + 0.07 * this.alt : vz < 0 ? -(0.45 + 0.13 * this.alt) : -(0.05 + 0.012 * this.alt); this.vz += (up - this.vz) * Math.min(1, dt * 2.5); this.alt = clamp(this.alt + this.vz * dt, 0, 200);
        const v = (0.2 + 0.14 * this.alt) * (1 + 0.55 * ay), wd = this.w0 + 0.4 * Math.sin(this.t * 0.21), ws = (0.03 + 0.03 * Math.sin(this.t * 0.5 + 1)) * (0.5 + Math.min(1, this.alt / 12));
        this.psi += ax * 0.95 * dt; this.px = clamp(this.px + (Math.sin(this.psi) * v + Math.sin(wd) * ws) * dt, -17000, 17000); this.py = clamp(this.py + (Math.cos(this.psi) * v + Math.cos(wd) * ws) * dt, -12000, 6500); this.bank += (ax * 0.45 - this.bank) * Math.min(1, dt * 4);
        this.flameC.visible = vz > 0; this.flameC.scale.set(1, 1, 0.8 + Math.random() * 0.5);
        const rel = ((wd - this.psi) * R2D % 360 + 360) % 360;
        hud = row('TO TARGET', d < 1 ? fm(d * 1000, 0) + ' m' : fm(d, d < 10 ? 1 : 0) + ' km', d < this.TOL ? 'ok' : '') + row('HEIGHT', this.alt < 1 ? fm(this.alt * 1000, 0) + ' m' : fm(this.alt, 1) + ' km', this.alt < 1.5 ? 'warn' : '') + row('SPEED', v < 0.28 ? fm(v * 3600, 0) + ' km/h' : fm(v, 2) + ' km/s') + row('WIND', `${fm(ws * 3600, 0)} km/h <span class="arr" style="display:inline-block;transform:rotate(${rel.toFixed(0)}deg)">↑</span>`) + row('BELOW', this.water(this.px, this.py) ? 'water' : 'land');
        if (this.alt <= 0) { this.miss = d * 1000; this.flameC.visible = false; if (d <= this.TOL) return this.go('done'); this.wet = this.water(this.px, this.py); this.down = 3; this.sink = 0; sfx.thud(4); toast(this.wet ? 'Splashdown — but there is no recovery ship here…' : 'Down — but there is no cooling foam here…', 3000); }
      }
    } else if (this.ph === 'done') { hud = row('MISSION', 'complete', 'ok') + row('MISS', fm(this.miss, 0) + ' m') + row('RETURNS', String(G.home || 1)); if (edge) return this.quit(); }
    this.hT = (this.hT || 0) - dt; if (this.hT <= 0) { this.hT = 0.12; $('stat').innerHTML = hud; hudScore(); mini.draw(); }
  },
  draw() {
    const asp = innerWidth / innerHeight, sh = G.shake > 0.001 ? G.shake : 0; G.shake *= 0.9;
    if (this.ph === 'lap') { const c = this.camA; c.aspect = asp; c.updateProjectionMatrix(); renderer.render(this.sA, c); }
    else if (this.ph === 'cape' || this.ph === 'done') { const c = this.camC, alt = this.ph === 'done' ? 0 : this.alt, d = clamp(0.25 + 0.55 * alt, 0.25, 130), fx = Math.sin(this.psi), fy = Math.cos(this.psi), dist = Math.hypot(this.px, this.py);
      this.shipC.position.set(this.px, this.py, alt + 0.01 - (this.down > 0 && this.wet ? (this.sink || 0) * d * 0.05 : 0)); this.shipC.scale.setScalar(d * 0.011); this.shipC.rotation.set(0, 0, -this.psi); this.shipC.rotateY(this.bank || 0);
      const k = Math.max(0.35 + alt * 0.22, dist * 0.02), hgt = Math.max(1.5, alt * 1.3 + 1.5, dist * 0.25); this.ringTrue.scale.setScalar(this.TOL); this.ringFar.visible = dist > 4; this.ringFar.scale.setScalar(k * 3 * (1 + 0.15 * Math.sin(G.t * 4))); this.beam.scale.set(k * 0.08, k * 0.08, hgt); this.beam.position.z = hgt / 2;
      this.foam.position.set(this.px, this.py, 0.001); this.foam.scale.setScalar(d * 0.09); this.sC.fog.far = 700 + alt * 90; this.sC.fog.near = 40 + alt * 6;
      c.aspect = asp; c.updateProjectionMatrix(); c.position.set(this.px - fx * d + (Math.random() - 0.5) * sh * d * 0.1, this.py - fy * d, alt + 0.42 * d + 0.03); c.lookAt(this.px + fx * d * 1.6, this.py + fy * d * 1.6, Math.max(0, alt - 0.5 * d)); renderer.render(this.sC, c); }
    else { const c = this.camN, sp = this.ship.position; c.aspect = asp; c.updateProjectionMatrix(); if (V4) { c.position.set(sp.x * 0.8 + (Math.random() - 0.5) * sh, -20, sp.z * 0.8 + 10 + (Math.random() - 0.5) * sh); c.up.set(0, 0, 1); c.lookAt(sp.x * 0.9, 80, sp.z * 0.9 + 2); }      /* from above and behind: what is coming is not hidden behind the ship */
      else { c.position.set(sp.x * 0.78 + (Math.random() - 0.5) * sh, -17, sp.z * 0.78 + 4.5 + (Math.random() - 0.5) * sh); c.up.set(0, 0, 1); c.lookAt(sp.x * 0.9, 40, sp.z * 0.9); } renderer.render(this.sN, c); }
  },
};

(async function boot() {
  const load = $('load');
  try {
    terrain = await new Terrain().load(s => { load.textContent = 'Loading lunar data…\n' + s; });
    load.textContent = 'Building the ground…';
    if (V3) try { const t = await texLoad('data/apollo11_soil.jpg'); t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping; t.repeat.set(2, 1); SOIL.map = t; const g2 = t.clone(); g2.colorSpace = THREE.NoColorSpace; g2.repeat.set(1, 1); g2.needsUpdate = true; SOIL.grain = g2; } catch (e) { console.warn('soil photograph not loaded:', e.message); }
    clip = new Clipmap(terrain, scene, { terrainShadows: !touchUI, grain: SOIL.grain });
    // tone: bring the regional mosaic to the brightness of the local photo
    clip.uniforms.uGain.value.set(1.0, 1.0);
    load.textContent = 'Loading the element maps (Lunar Prospector)…'; await lp.load();
    if (V3) { try { await loadModels(n => { load.textContent = 'Loading NASA 3-D models…\n' + n; }); } catch (e) { console.warn('NASA models not loaded, using the built-in ones:', e.message); for (const k in MODELS) delete MODELS[k]; } }
    load.textContent = 'Building the ground…';
    particles = new Particles(touchUI ? 900 : 1800); rocks = new Rocks(); rover = new Rover(); lander = new Lander();
    eagle = makeEagle(); scene.add(eagle); base = makeBase(); scene.add(base);
    BASE.ll = terrain.toLatLon(BASE.x, BASE.y);
    const sx = BASE.x + 15, sy = BASE.y + 7; clip.update(sx, sy); placeStatics(); base.rotation.z = 0.5; 
    lander.place(sx, sy); lander.yaw = 68 * D2R; rocks.rebuild(sx, sy); labels.load(); mini.build();
    for (const q of G.savedGems || []) if (q && q[2] >= 1 && q[2] <= 3) rocks.gemLL(q[0], q[1], q[2]);
    camS.yaw = lander.yaw; buildActs(); hudScore(); fillSheets();
    if (V3 && !touchUI) try {                               // a soft glow round the brightest things: gems, the laser, flames, sunlit metal
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([import('three/addons/postprocessing/EffectComposer.js'), import('three/addons/postprocessing/RenderPass.js'), import('three/addons/postprocessing/UnrealBloomPass.js'), import('three/addons/postprocessing/OutputPass.js')]);
      composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera)); composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.22, 0.4, 2.4)); composer.addPass(new OutputPass()); composer.setSize(innerWidth, innerHeight);
    } catch (e) { console.warn('no bloom:', e.message); composer = null; }
    load.style.display = 'none';
    if (!V4) toast(`YOUR MISSION\nCapture ${LAUNCH.toLocaleString('en-US')} units of energy from the Moon's minerals.\nThen press B, board the lander and fly home to the Earth.\nStart: press Deploy to let the rover out.`, 11000);
  } catch (err) { console.error(err); load.textContent = 'Could not start: ' + err.message; return; }

  let last = performance.now(), hudT = 0, slow = 0, quality = 0, detT = 0, saveT = 0, anchorT = 0, poleT = 0, remindT = 20;
  /* one step of the game (no drawing) */
  function tick(dt) {
    G.t += dt;
    const ax = clamp(kd('ArrowRight', 'KeyD') - kd('ArrowLeft', 'KeyA') + stick.x, -1, 1), ay = clamp(kd('ArrowUp', 'KeyW') - kd('ArrowDown', 'KeyS') + stick.y, -1, 1);
    const vzIn = kd('KeyR', 'PageUp') - kd('KeyF', 'PageDown') + (held.has('up') ? 1 : 0) - (held.has('down') ? 1 : 0);
    if (V4 && !ret.on) {                                 // the return window runs while on the Moon; it stops once the journey home begins
      if (!G.left) G.left = DEADLINE; G.left -= dt; if (!G.call0 && G.t > 4) { G.call0 = true; radio(`Tranquility Base, Houston. Your return window closes in 30 minutes. Capture ${LAUNCH.toLocaleString('en-US')} units of energy and launch before then. P pauses the clock. Over.`, 12000); }
      G.ci = G.ci || 0; while (G.ci < CALLS.length && G.left <= CALLS[G.ci][0]) { const c = CALLS[G.ci++]; if (G.left > c[0] - 5) radio('Houston: ' + c[1] + (G.points >= LAUNCH ? '' : ` You have ${G.points.toLocaleString('en-US')} of ${LAUNCH.toLocaleString('en-US')}.`)); }
      if (G.points >= LAUNCH && G.mode === 'rover' && G.t > (G.bigAt || 0)) { G.bigAt = G.t + 60; if (G.callReady) { bigNews(); sfx.fanfare(); } }
      if (G.points >= LAUNCH && !G.callReady) { G.callReady = true; radio('Houston: you have the energy. Press B, board the lander, climb above 100 kilometres and launch for home. The window will not wait.', 11000); }
      if (G.left <= 0) { gameOver(); return; }
      if (sfx.ctx && sfx.ctx.state === 'running' && !music.on && G.soundOn) music.play('moon');
    }
    if (ret.on) { ret.step(dt, ax, ay, keys.has('Space') || held.has('burn'), vzIn); return; }
    if (orbit.on) { orbit.step(dt, ax, ay, vzIn); return; }
    let focus, agl = 0;
    if (G.mode === 'rover') {
      if (rover.fly) { flyStep(dt, ax, ay, vzIn); agl = rover.agl; rover.cool -= dt; G.energy += COST.solar * dt;
        if (rover.fly && G.t > anchorT && Math.hypot(rover.pos.x, rover.pos.y) > clamp(agl, 20000, 150000)) { anchorT = G.t + 1; reanchor(rover); }
      } else {
        const thr = G.flat ? ay * 0.25 : ay;              // flat battery: sunlight alone only lets it crawl
        const n = Math.max(2, Math.ceil(dt / 0.006)); for (let i = 0; i < n; i++) rover.step(dt / n, ax, thr);
        rover.collide(dt); rover.cool -= dt;
        G.energy += (COST.solar - (G.flat ? 0 : COST.drive * Math.abs(ay))) * dt;
      }
      if (G.energy < COST.baseMax && Math.hypot(rover.pos.x - BASE.x, rover.pos.y - BASE.y) < 10) G.energy = Math.min(COST.baseMax, G.energy + COST.baseRate * dt);
      if (G.energy <= 0 && !G.flat) { G.energy = 0; G.flat = true; buildActs(); toast('Battery flat.\nSunlight keeps the rover crawling. Find thorium ore,\nor press Back to base.', 6000); }
      else if (G.flat && G.energy > 4) { G.flat = false; buildActs(); }
      if (G.energy < 0) G.energy = 0;
      if (keys.has('Space') || held.has('fire')) fire();
      if (rover.pos.z < clip.ground(rover.pos.x, rover.pos.y) - 1.5) flip();
      if (rover.rolled > 2.0) { flip(); rover.rolled = 0; toast('Rolled over — set back on its wheels', 2000); }
      for (const [o, r] of [[lander.pos, 2.9], [eagle.position, 5.2], [base.position, V3 ? 6.2 : 3.4]]) {      // cannot drive through the lander or the descent stage
        const dx = rover.pos.x - o.x, dy = rover.pos.y - o.y, d = Math.hypot(dx, dy); if (d >= r || d < 1e-6) continue;
        const nx = dx / d, ny = dy / d, vn = rover.vel.x * nx + rover.vel.y * ny; rover.pos.x += nx * (r - d); rover.pos.y += ny * (r - d); if (vn < 0) { rover.vel.x -= nx * vn; rover.vel.y -= ny * vn; }
      }
      if (Math.abs(rover.pos.x) > 58000 || Math.abs(rover.pos.y) > 58000) { rover.pos.x = clamp(rover.pos.x, -58000, 58000); rover.pos.y = clamp(rover.pos.y, -58000, 58000); rover.vel.multiplyScalar(0.5); }
      rover.sync(dt); focus = rover.pos;
    } else {
      agl = lander.step(dt, ax, ay, vzIn); focus = lander.pos;
      if (!lander.landed && agl > 99500 && vzIn > 0) { orbit.enter(); return; }
      const dA = Math.hypot(lander.pos.x, lander.pos.y);
      if (G.t > anchorT && (lander.landed ? dA > 12000 : dA > clamp(agl, 20000, 150000))) { anchorT = G.t + 1; reanchor(); }
      const lat = terrain.lat0 + lander.pos.y / terrain.ky;      // the polar regions are not covered by this flat-map method
      if (Math.abs(lat) > 82) { lander.pos.y = (82 * Math.sign(lat) - terrain.lat0) * terrain.ky; lander.vel.y = 0; if (G.t > poleT) { poleT = G.t + 10; toast('The polar regions are not covered yet (beyond 82°)', 3500); } }
    }
    const air = G.mode === 'lander' || rover.fly ? agl : 0;      // height of whoever is flying
    lander.sync(); stepShots(dt); particles.step(dt); rocks.step(dt, focus.x, focus.y, air);
    // detector: distance to the nearest thorium ore, still in its rock or lying free
    detT -= dt; if (detT <= 0) { detT = 0.25; let d = 99; if (G.mode === 'rover') { for (const k of rocks.active) if (k.gem === 2 && !k.gemOut && !k.dead) d = Math.min(d, Math.hypot(k.x - rover.pos.x, k.y - rover.pos.y)); for (const g of rocks.gems) if (g.type === 2) d = Math.min(d, Math.hypot(g.x - rover.pos.x, g.y - rover.pos.y)); } G.det = d; }
    sfx.frame(dt, { thrust: G.mode === 'lander' && !lander.landed ? Math.min(1, lander.thrust) : rover.fly ? 0.55 : 0, throttle: G.mode === 'rover' ? ay : 0, wheel: G.mode === 'rover' ? Math.abs(rover.vel.length()) / 6 : 0,
      speed: G.mode === 'rover' ? rover.vel.length() : 0, ground: G.mode === 'rover' && rover.onGround > 0, geiger: G.mode === 'rover' ? 0.5 + (G.det < 16 ? 70 / (1 + G.det * G.det * 0.5) : 0) : 0 });

    // camera
    const head = G.mode === 'rover' ? rover.heading() : lander.yaw, moving = G.mode === 'rover' ? rover.vel.length() > 0.4 : !lander.landed;
    if (G.t - camS.userT > 2.5 && moving) camS.off *= Math.max(0, 1 - dt * 1.5);
    let dy = head - camS.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); camS.yaw += dy * Math.min(1, dt * 3);
    const view = VIEWS[G.cam], web = !!view.web && G.mode === 'rover' && !rover.fly, look = tmp.a.copy(focus).addScaledVector(Z, G.mode === 'rover' ? 0.5 : 1.6);
    document.body.classList.toggle('webcam', web);
    if (web) { camera.position.copy((V3 ? tmp.b.set(0, 0.78, 0.62) : tmp.b.set(-0.3, 0.42, 1.12)).applyQuaternion(rover.q).add(rover.pos)); camera.up.copy(rover.up()); camera.lookAt(tmp.c.copy(rover.fwd).multiplyScalar(6).add(camera.position).addScaledVector(Z, -1.6)); }      // the mast camera: it sees the arm, the gun and the ground ahead
    else {
      const hi = air;                                    // from high up: stand farther back and look further down, so the ground stays in view
      const yaw = camS.yaw + camS.off + (view.yaw || 0), pit = view.top ? 1.5 : Math.max(view.pit !== undefined ? view.pit + camS.pitch - 0.32 : camS.pitch, Math.min(1.2, hi / 900)), dist = (view.top ? view.top * camS.dist / 6.5 : camS.dist) * (1 + hi / 500), cp = Math.cos(pit);
      camS.pos.set(look.x - Math.sin(yaw) * cp * dist, look.y - Math.cos(yaw) * cp * dist, look.z + Math.sin(pit) * dist);
      const gz = clip.ground(camS.pos.x, camS.pos.y) + 0.35; if (camS.pos.z < gz) camS.pos.z = gz;
      camera.position.copy(camS.pos); camera.up.copy(Z); camera.lookAt(look);
    }
    if (G.shake > 0.001) { camera.position.x += (Math.random() - 0.5) * G.shake; camera.position.z += (Math.random() - 0.5) * G.shake; G.shake *= Math.exp(-dt * 7); }
    camera.near = web ? 0.08 : clamp(Math.max(camS.dist * 0.03, agl * 0.01), 0.12, 60); camera.fov = web ? 78 : 55; camera.updateProjectionMatrix();
    clip.update(focus.x, focus.y, air / 120); aimSun(focus, air > 0 ? clamp(air * 1.5, 40, 160) : G.mode === 'rover' ? 22 : 40);
    hudT += dt; if (hudT > 0.15) { hudT = 0; hudStat(agl); hudScore(); mini.draw();
      if (G.points >= LAUNCH && G.t > remindT) { remindT = G.t + 80; if (G.mode === 'rover') toast('You have enough energy for the Earth.\nPress B to return to base and take off.', 6000); } if ((saveT += 0.15) > 5) { saveT = 0; save(); } const d = document.querySelector('#acts [data-act=deploy]'); if (d) d.classList.toggle('locked', G.mode === 'lander' ? !lander.landed : Math.hypot(rover.pos.x - lander.pos.x, rover.pos.y - lander.pos.y) > 8); }
  }
  /* if the device cannot keep up, give up detail rather than speed */
  function adapt(real) {
    slow = real > 0.045 ? slow + real : Math.max(0, slow - real * 0.5);
    if (slow < 2.5 || quality >= 3) return; slow = 0; quality++;
    if (quality === 1) renderer.setPixelRatio(1);
    else if (quality === 2) { renderer.shadowMap.enabled = false; sun.castShadow = false; scene.traverse(o => { if (o.material) o.material.needsUpdate = true; }); }
    else { for (const m of rocks.meshes) m.castShadow = false; renderer.setPixelRatio(0.75); }
    resize();
  }
  function frame(now) {
    requestAnimationFrame(frame);
    const real = (now - last) / 1000; last = now; if (real <= 0) return;
    if (!G.paused && !G.userPause && !G.over) tick(Math.min(0.05, real));
    adapt(real);
    if (ret.on) { $('tag').style.display = 'none'; ret.draw(); return; }
    if (orbit.on) { $('tag').style.display = 'none'; orbit.draw(); return; }
    const tag = $('tag'), de = camera.position.distanceTo(eagle.position);       // label on the descent stage
    if (de < 150) { const p = tmp.b.set(eagle.position.x, eagle.position.y, eagle.position.z + 4).project(camera); if (p.z < 1 && Math.abs(p.x) < 1 && Math.abs(p.y) < 1) { tag.style.display = 'block'; tag.style.left = ((p.x + 1) * innerWidth / 2) + 'px'; tag.style.top = ((1 - p.y) * innerHeight / 2) + 'px'; tag.textContent = 'Apollo 11 descent stage — real position, illustrative model'; } else tag.style.display = 'none'; } else tag.style.display = 'none';
    labels.frame(); if (document.body.classList.contains('webcam')) $('webTime').textContent = new Date().toISOString().slice(11, 19) + ' UTC';
    composer ? composer.render() : renderer.render(scene, camera);
  }
  window.__game = { V3, V4, togglePause, radio, MODELS, labels, base, sfx, need, COST, orbit, ret, lp, FLY, GEM, mini, music, reanchor, setAnchorAt, LAUNCH, LEVELS, G, terrain, clip, rocks, rover, lander, camS, ACT, perk, addPoints, keys, stick, held, particles, shots, THREE, camera, tick, get quality() { return quality; } };
  requestAnimationFrame(frame);
})();
