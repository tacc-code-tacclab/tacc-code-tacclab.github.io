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

/* ====================================================================== renderer, scene, light */
const renderer = new THREE.WebGLRenderer({ canvas: $('gl'), antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, touchUI ? 1.5 : 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(55, 1, 0.15, 900000);
function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* Sun where it was in the LRO photo: azimuth fitted from the data (see tools/shape_from_shading.py), elevation
   estimated from the length of the descent stage's shadow. Keeping it there keeps the photo and the relief consistent. */
const SUN_AZ = 272.5 * D2R, SUN_EL = 18 * D2R;
const sunDir = V(Math.sin(SUN_AZ) * Math.cos(SUN_EL), Math.cos(SUN_AZ) * Math.cos(SUN_EL), Math.sin(SUN_EL));
const sun = new THREE.DirectionalLight(0xfff6e8, 6.0); sun.castShadow = true;
sun.shadow.mapSize.set(touchUI ? 1024 : 2048, touchUI ? 1024 : 2048);
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

/* ====================================================================== small helpers for the models */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.15, ...o });
function cyl(r1, r2, h, seg = 12, m) { const g = new THREE.CylinderGeometry(r1, r2, h, seg); g.rotateX(Math.PI / 2); const o = new THREE.Mesh(g, m); o.castShadow = true; return o; }   // axis along z
function box(x, y, z, m) { const o = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), m); o.castShadow = true; return o; }
function strut(a, b, r, m) { const d = b.clone().sub(a), o = cyl(r, r, d.length(), 6, m); o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(Z, d.clone().normalize()); return o; }
const GOLD = mat(0xb08a3c, { metalness: 0.5, roughness: 0.45 }), GREY = mat(0x9aa0a6), DARK = mat(0x30363c), WHITE = mat(0xd9dde0), PANEL = mat(0x1d2f5a, { metalness: 0.6, roughness: 0.3 });

function legs(g, rBody, zBody, rPad, n, m) {
  for (let i = 0; i < n; i++) {
    const a = (i + 0.5) * 2 * Math.PI / n, c = Math.cos(a), s = Math.sin(a);
    g.add(strut(V(c * rBody, s * rBody, zBody), V(c * rPad, s * rPad, 0.08), 0.05, GREY));
    g.add(strut(V(c * rBody * 0.9, s * rBody * 0.9, zBody * 0.45), V(c * rPad, s * rPad, 0.08), 0.035, GREY));
    const pad = cyl(0.28, 0.28, 0.08, 10, GOLD); pad.position.set(c * rPad, s * rPad, 0.04); g.add(pad);
  }
}
function makeEagle() {                                   // Apollo 11 descent stage: real position, illustrative shape
  const g = new THREE.Group();
  const b = cyl(2.1, 2.1, 1.65, 8, GOLD); b.position.z = 1.95; g.add(b);
  const top = cyl(1.5, 2.0, 0.25, 8, GREY); top.position.z = 2.9; g.add(top);
  const bell = cyl(0.35, 0.8, 0.9, 12, DARK); bell.position.z = 0.75; g.add(bell);
  legs(g, 2.0, 2.2, 4.4, 4, GREY);
  return g;
}
function makeLander() {                                  // the player's hopper
  const g = new THREE.Group();
  const b = cyl(1.25, 1.25, 1.0, 8, GOLD); b.position.z = 1.45; g.add(b);
  const cab = cyl(0.6, 1.0, 0.9, 8, GREY); cab.position.z = 2.4; g.add(cab);
  const bell = cyl(0.25, 0.55, 0.6, 12, DARK); bell.position.z = 0.7; g.add(bell);
  legs(g, 1.2, 1.5, 2.3, 4, GREY);
  const ramp = box(0.9, 1.7, 0.06, GREY); ramp.position.set(0, 1.95, 0.5); ramp.rotation.x = -0.55; g.add(ramp);
  const flame = cyl(0.05, 0.45, 1.6, 12, new THREE.MeshBasicMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.55, depthWrite: false }));
  flame.castShadow = false; flame.position.z = -0.4; flame.visible = false; g.add(flame); g.userData.flame = flame;
  return g;
}
function makeRover() {
  const g = new THREE.Group(), u = g.userData;
  const body = box(0.9, 1.3, 0.28, WHITE); body.position.z = 0.06; g.add(body);
  const deck = box(0.8, 0.7, 0.03, PANEL); deck.position.set(0, -0.2, 0.22); g.add(deck);
  const mast = cyl(0.025, 0.025, 0.75, 6, GREY); mast.position.set(-0.28, 0.35, 0.57); g.add(mast);
  const head = box(0.22, 0.12, 0.1, DARK); head.position.set(-0.28, 0.37, 0.98); g.add(head);
  u.wheels = [];
  for (const [x, y] of [[-0.56, 0.52], [0.56, 0.52], [-0.56, -0.52], [0.56, -0.52]]) {
    const piv = new THREE.Group(); piv.position.set(x, y, -0.3);
    const wg = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 14); wg.rotateZ(Math.PI / 2);
    const w = new THREE.Mesh(wg, DARK); w.castShadow = true; piv.add(w);
    for (let i = 0; i < 6; i++) { const t = box(0.17, 0.05, 0.03, GREY); const a = i * Math.PI / 3; t.position.set(0, Math.cos(a) * 0.22, Math.sin(a) * 0.22); t.rotation.x = a; w.add(t); }   // grousers, so the spin is visible
    g.add(piv); u.wheels.push({ piv, w, x, y });
  }
  // blaster turret
  u.turret = new THREE.Group(); u.turret.position.set(0.22, 0.25, 0.3);
  u.turret.add(box(0.2, 0.24, 0.14, DARK)); const barrel = cyl(0.035, 0.045, 0.5, 8, GREY); barrel.rotation.x = -Math.PI / 2; barrel.position.y = 0.3; u.turret.add(barrel); g.add(u.turret);
  // arm: yaw base -> shoulder -> elbow -> gripper
  u.armBase = new THREE.Group(); u.armBase.position.set(-0.05, 0.6, 0.22); g.add(u.armBase);
  u.shoulder = new THREE.Group(); u.armBase.add(u.shoulder);
  const l1 = box(0.06, ARM_L, 0.06, GREY); l1.position.y = ARM_L / 2; u.shoulder.add(l1);
  u.elbow = new THREE.Group(); u.elbow.position.y = ARM_L; u.shoulder.add(u.elbow);
  const l2 = box(0.05, ARM_L, 0.05, GREY); l2.position.y = ARM_L / 2; u.elbow.add(l2);
  u.grip = new THREE.Group(); u.grip.position.y = ARM_L; u.elbow.add(u.grip);
  const f1 = box(0.03, 0.14, 0.03, DARK), f2 = f1.clone(); f1.position.set(-0.06, 0.06, 0); f2.position.set(0.06, 0.06, 0); u.grip.add(f1, f2);
  // scoop blade (unlocked later)
  u.scoop = box(0.95, 0.06, 0.26, mat(0xc8a030, { metalness: 0.6 })); u.scoop.position.set(0, 0.74, -0.18); u.scoop.rotation.x = 0.35; u.scoop.visible = false; g.add(u.scoop);
  return g;
}
const ARM_L = 0.8;
function makeBase() {                                    // the station that stays at Tranquility Base: charging point and rescue home
  const g = new THREE.Group();
  const b = cyl(1.5, 1.5, 1.3, 10, WHITE); b.position.z = 1.35; g.add(b);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.5, 14, 8, 0, 6.3, 0, 1.57), WHITE); dome.rotation.x = Math.PI / 2; dome.position.z = 2.0; dome.castShadow = true; g.add(dome);
  legs(g, 1.4, 1.3, 2.4, 3, GREY);
  for (const sx of [-1, 1]) { const arr = box(3.2, 0.05, 1.4, PANEL); arr.position.set(sx * 3.3, 0, 2.3); arr.rotation.y = sx * 0.5; g.add(arr); g.add(strut(V(sx * 1.4, 0, 2.2), V(sx * 2.0, 0, 2.3), 0.04, GREY)); }
  const mast = cyl(0.03, 0.03, 2.2, 6, GREY); mast.position.set(0.6, 0.6, 4.2); g.add(mast);
  const dish = cyl(0.55, 0.05, 0.25, 14, GREY); dish.position.set(0.6, 0.6, 5.3); dish.rotation.x = 0.9; g.add(dish);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: 0x66ff99 })); lamp.position.set(0.6, 0.6, 5.6); g.add(lamp);
  return g;
}
const BASE = { x: -118, y: -48 };

/* ====================================================================== game state */
const LEVELS = [0, 60, 150, 300, 500, 800, 1200];        // total energy captured
const LAUNCH = 2000;                                     // captured energy needed for the trip to the Earth
const PERKS = [
  null,
  { name: 'Rover deployed', vmax: 2.5, mu: 0.55, blastD: 0.35, blast: 1, liftD: 0.30, push: 15 },
  { name: 'Faster motors', vmax: 4.0, mu: 0.6, blastD: 0.35, blast: 1, liftD: 0.30, push: 30 },
  { name: 'Gun II: heavier rounds, deeper craters', vmax: 4.0, mu: 0.6, blastD: 0.7, blast: 2, liftD: 0.42, push: 60 },
  { name: 'Scoop blade: dig for buried gems', vmax: 4.5, mu: 0.65, blastD: 0.7, blast: 2, liftD: 0.42, push: 150, scoop: true },
  { name: 'Climbing claws: slopes up to 45°', vmax: 6.0, mu: 1.0, blastD: 0.7, blast: 2, liftD: 0.5, push: 250, scoop: true },
  { name: 'Gun III: explosive rounds, wide blast', vmax: 8.0, mu: 1.05, blastD: 1.05, blast: 3, liftD: 0.5, push: 400, scoop: true },
  { name: 'Hop thrusters', vmax: 9.0, mu: 1.1, blastD: 1.05, blast: 3, liftD: 0.6, push: 600, scoop: true, hop: true },
];
const KEEP_OUT = 75;                                     // m around the Apollo 11 descent stage where tools are locked
const G = { mode: 'lander', points: 0, level: 1, t: 0, shake: 0, overlay: false, cam: 0, soundOn: true, energy: 60, flat: false, names: true, det: 99, stats: { rocks: 0, th: 0, il: 0, shot: 0 }, ready: false, area: '' };
try { const s = JSON.parse(localStorage.getItem('lunar-rover-v1') || 'null'); if (s && s.points > 0) { G.points = s.points | 0; if (s.energy > 0) G.energy = +s.energy; if (s.stats) Object.assign(G.stats, s.stats); G.ready = G.points >= LAUNCH; } } catch (_) {}
function save() { try { localStorage.setItem('lunar-rover-v1', JSON.stringify({ points: G.points, energy: Math.round(G.energy), stats: G.stats })); } catch (_) {} }
/* energy: every function of the rover draws on it; thorium ore tops it up without limit, sunlight only trickles */
const COST = { drive: 0.3, shot: 0.25, grab: 0.6, dig: 2, hop: 4, solar: 0.04, baseRate: 8, baseMax: 100, thorium: 40, ilmenite: 10 };
function need(e) { if (G.energy < e) { toast(G.flat ? 'Battery flat — solar power only.\nFind thorium ore, or go back to base.' : 'Not enough energy for that', 2200); return false; } G.energy -= e; return true; }
const levelOf = p => { let l = 1; while (l < LEVELS.length && p >= LEVELS[l]) l++; return l; };
G.level = levelOf(G.points);
const perk = () => PERKS[G.level];
/* ore becomes energy: it fills the battery and counts towards the levels (G.points = total energy captured) */
function addPoints(n, why) {
  G.points += n; G.energy += n; save();
  const nl = levelOf(G.points);
  if (!G.ready && G.points >= LAUNCH) { G.ready = true; toast(`${LAUNCH} units of energy captured.\nNOW YOU ARE READY TO TAKE OFF FOR THE EARTH.\n(That journey is the next chapter of this game.)`, 12000); sfx.level(); }
  else if (nl > G.level) { G.level = nl; toast(`LEVEL ${nl}\n${perk().name}`, 5000); sfx.level(); rover.obj.userData.scoop.visible = !!perk().scoop; buildActs(); }
  else if (why) toast(`+${n} energy\n${why}`, 1800);
  G.level = nl; hudScore();
}
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
    const comp = c.createDynamicsCompressor(); this.out = c.createGain(); this.out.gain.value = 0.7; this.out.connect(comp).connect(c.destination);
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
    this.eng.g.gain.setTargetAtTime(0.55 * st.thrust * on, t, 0.12); this.eng.f.frequency.setTargetAtTime(70 + 260 * st.thrust, t, 0.2);
    this.hiss.g.gain.setTargetAtTime(0.05 * st.thrust * on, t, 0.1);
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
  shot() { this.nz(0.045, 'bandpass', 1800, 500, 0.5); this.tone(150, 55, 0.07, 'triangle', 0.5); },   // the action cycling and the recoil thump
  chip() { this.nz(0.05, 'bandpass', 2600, 900, 0.18); },
  boom(k = 1) { this.tone(75, 26, 0.45 + 0.25 * k, 'sine', 0.7); this.nz(0.3 + 0.15 * k, 'lowpass', 420, 60, 0.6, this.brown); for (let i = 1; i <= 4; i++) setTimeout(() => this.nz(0.03, 'bandpass', 900, 400, 0.12), 180 * i + Math.random() * 200); },   // felt through the ground, then fragments rattling off the chassis
  servo(dur = 0.45) { const c = this.ctx; if (!c || !G.soundOn) return; const t = c.currentTime, o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(170, t); o.frequency.linearRampToValueAtTime(260, t + dur * 0.5); o.frequency.linearRampToValueAtTime(190, t + dur);
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 3; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + 0.04); g.gain.setValueAtTime(0.09, t + dur - 0.05); g.gain.linearRampToValueAtTime(0, t + dur); o.connect(f).connect(g).connect(this.out); o.start(t); o.stop(t + dur + 0.02); },
  grab() { this.tone(240, 90, 0.05, 'square', 0.16); this.nz(0.03, 'bandpass', 1500, 700, 0.2); },
  ore(th) { if (th) { for (let i = 0; i < 14; i++) setTimeout(() => this.tick(0.2), i * 28); this.tone(660, 990, 0.3, 'sine', 0.14); } else this.tone(520, 780, 0.2, 'sine', 0.14); },
  level() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, f, 0.3, 'triangle', 0.2), i * 110)); },
  thud(v) { this.nz(0.14, 'lowpass', 260, 50, clamp(v * 0.2, 0.06, 0.6), this.brown); this.tone(60, 35, 0.12, 'sine', clamp(v * 0.12, 0.05, 0.4)); },
  dig() { this.nz(0.5, 'bandpass', 500, 1400, 0.4); this.servo(0.5); }, toss() { this.tone(170, 340, 0.09, 'sawtooth', 0.1); this.nz(0.04, 'bandpass', 1200, 600, 0.12); }, hop() { this.nz(0.35, 'highpass', 1200, 2500, 0.3); this.tone(90, 50, 0.3, 'sine', 0.3); },
};

/* ====================================================================== world objects (filled in after loading) */
let terrain, clip, rocks, rover, lander, eagle, base, particles;
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
const CELL = 8, ACTIVE_R = touchUI ? 22 : 30, BUCKET = 2;
class Rocks {
  constructor() {
    this.cells = new Map(); this.removed = new Set(); this.active = []; this.buckets = new Map(); this.movers = new Set(); this.cx = 1e9; this.cy = 1e9;
    this.debris = []; this.gems = [];
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0, flatShading: true });
    this.meshes = [];
    for (let v = 0; v < 4; v++) {
      const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position, r = rng(977 + v * 31);
      const off = new Map();                               // same displacement for coincident vertices, so the rock stays closed
      for (let i = 0; i < p.count; i++) { const k = [p.getX(i), p.getY(i), p.getZ(i)].map(c => c.toFixed(3)).join(); if (!off.has(k)) off.set(k, 0.72 + 0.5 * r()); const s = off.get(k); p.setXYZ(i, p.getX(i) * s, p.getY(i) * s, p.getZ(i) * s); }
      g.computeVertexNormals();
      const im = new THREE.InstancedMesh(g, m, 420); im.castShadow = true; im.receiveShadow = true; im.frustumCulled = false; im.count = 0;
      im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(420 * 3).fill(1), 3); scene.add(im); this.meshes.push(im);
    }
    this.dm = new THREE.InstancedMesh(this.meshes[0].geometry, m, 320); this.dm.castShadow = true; this.dm.frustumCulled = false; this.dm.count = 0; scene.add(this.dm);
    const gg = new THREE.OctahedronGeometry(0.11, 0);
    this.gemMats = [null, new THREE.MeshStandardMaterial({ color: 0x4aa8ff, emissive: 0x1e6fe0, emissiveIntensity: 1.6, roughness: 0.15, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x2fe08a, emissive: 0x10b060, emissiveIntensity: 1.8, roughness: 0.15, metalness: 0.2 })];
    this.gemGeo = gg;
  }
  cell(ci, cj) {
    const key = ci + ',' + cj; let c = this.cells.get(key); if (c) return c;
    c = []; const r = rng(hash3(ci, cj, 4242)), K = RULES.rocks, x0 = ci * CELL - terrain.ax, y0 = cj * CELL - terrain.ay;      // cells are fixed to the Moon, not to the map
    const slope = terrain.slopeDeg(x0 + CELL / 2, y0 + CELL / 2, 3), mult = 1 + Math.min(5, (slope / 7) ** 2);   // assumption: fresher, steeper ground exposes more blocks
    const mean = CELL * CELL * K.k * Math.pow(K.minD, K.g) * mult;
    const n = Math.max(0, Math.round(mean + Math.sqrt(mean) * (r() + r() + r() - 1.5) * 2));
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * CELL, y = y0 + r() * CELL, D = K.minD * Math.pow(1 - r(), 1 / K.g), u1 = r(), u2 = r(), u3 = r(), u4 = r(), u5 = r(), u6 = r();
      if (D > K.maxD || (x - terrain.sx) ** 2 + (y - terrain.sy) ** 2 < 81) continue;      // nothing bigger than the photo could hide; keep the descent stage clear
      const a = D / 2, sx = a * (0.8 + 0.4 * u1), sy = a * (0.8 + 0.4 * u2), sz = a * (0.5 + 0.4 * u3), bury = 0.12 + 0.4 * u4;
      const gemU = u5 / (1 + 2.5 * D), gem = gemU < 0.04 ? 2 : gemU < 0.15 ? 1 : 0;      // 2 = thorium-bearing (energy), 1 = ilmenite (titanium ore)
      c.push({ id: key + ',' + i, x, y, z: 0, D, sx, sy, sz, bury, hr: 2 * sz * (1 - bury), yaw: u6 * 6.283, tilt: (u1 - 0.5) * 0.5, v: (u2 * 4) | 0, shade: 0.17 + 0.13 * u3, gem, mass: 3000 * 4.19 * sx * sy * sz, dyn: null, held: false, hp: 0 });
    }
    for (const k of c) k.z = terrain.height(k.x, k.y) + k.sz * (1 - 2 * k.bury);
    this.cells.set(key, c);
    if (this.cells.size > 500) { const first = this.cells.keys().next().value; this.cells.delete(first); }
    return c;
  }
  rebuild(x, y) {
    this.cx = x; this.cy = y; this.active.length = 0; this.buckets.clear();
    const gx = x + terrain.ax, gy = y + terrain.ay, c0 = Math.floor((gx - ACTIVE_R) / CELL), c1 = Math.floor((gx + ACTIVE_R) / CELL), d0 = Math.floor((gy - ACTIVE_R) / CELL), d1 = Math.floor((gy + ACTIVE_R) / CELL);
    const counts = [0, 0, 0, 0];
    for (let j = d0; j <= d1; j++) for (let i = c0; i <= c1; i++) for (const k of this.cell(i, j)) {
      if (this.removed.has(k.id) || counts[k.v] >= 420) continue;
      k.ii = counts[k.v]++; this.active.push(k); this.bucket(k); this.place(k);
    }
    for (let v = 0; v < 4; v++) { this.meshes[v].count = counts[v]; this.meshes[v].instanceMatrix.needsUpdate = true; this.meshes[v].instanceColor.needsUpdate = true; }
  }
  reset() { this.cells.clear(); this.active.length = 0; this.buckets.clear(); this.movers.clear(); for (const m of this.meshes) m.count = 0; this.debris.length = 0; this.dm.count = 0; for (const g of this.gems) scene.remove(g.m); this.gems.length = 0; this.cx = this.cy = 1e9; this.hidden = true; }
  bucket(k) { const key = Math.floor(k.x / BUCKET) + ',' + Math.floor(k.y / BUCKET); let b = this.buckets.get(key); if (!b) this.buckets.set(key, b = []); b.push(k); }
  place(k) {
    tmp.q.setFromEuler(new THREE.Euler(k.tilt, k.tilt * 0.7, k.yaw, 'ZYX')); tmp.m.compose(tmp.a.set(k.x, k.y, k.z), tmp.q, tmp.s.set(k.sx, k.sy, k.sz));
    const im = this.meshes[k.v]; im.setMatrixAt(k.ii, tmp.m);
    const c = im.instanceColor.array, o = 3 * k.ii, ov = G.overlay;
    c[o] = ov ? 1.0 : k.shade; c[o + 1] = ov ? 0.55 : k.shade; c[o + 2] = ov ? 0.2 : k.shade * 0.97;
    im.instanceMatrix.needsUpdate = true;
  }
  near(x, y, r, fn) {                                     // visit rocks whose centre is within r (+ their own size) of a point
    const b0 = Math.floor((x - r - 0.6) / BUCKET), b1 = Math.floor((x + r + 0.6) / BUCKET), c0 = Math.floor((y - r - 0.6) / BUCKET), c1 = Math.floor((y + r + 0.6) / BUCKET);
    for (let j = c0; j <= c1; j++) for (let i = b0; i <= b1; i++) { const b = this.buckets.get(i + ',' + j); if (b) for (const k of b) if (!k.dead && !k.dyn && !k.held) fn(k); }
    for (const k of this.movers) if (!k.dead && !k.held) fn(k);
  }
  bump(x, y) {                                            // extra height a wheel feels from small rocks
    let h = 0;
    this.near(x, y, 0.1, k => { if (k.hr > 0.3) return; const dx = x - k.x, dy = y - k.y, r = Math.max(k.sx, k.sy), d2 = (dx * dx + dy * dy) / (r * r); if (d2 < 1) h = Math.max(h, k.hr * Math.sqrt(1 - d2)); });
    return h;
  }
  remove(k) { k.dead = true; this.removed.add(k.id); this.movers.delete(k); tmp.m.makeScale(0, 0, 0); this.meshes[k.v].setMatrixAt(k.ii, tmp.m); this.meshes[k.v].instanceMatrix.needsUpdate = true; }
  reveal(k) { if (k.gem && !k.gemOut) { k.gemOut = true; this.gem(k.x, k.y, k.gem); } }
  gem(x, y, type) {
    const m = new THREE.Mesh(this.gemGeo, this.gemMats[type]); m.scale.setScalar(type === 2 ? 1.25 : 1); m.position.set(x, y, clip.ground(x, y) + 0.16); scene.add(m);
    this.gems.push({ m, type, x, y, t: G.t });
  }
  explode(k, power) {
    if (k.dead) return;
    this.reveal(k); this.remove(k);
    const n = Math.round(clamp(5 + k.D * 26, 6, 26));
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, el = (15 + Math.random() * 65) * D2R, v = (1.2 + Math.random() * 4.2) * (0.8 + 0.25 * power), s = k.D * (0.08 + Math.random() * 0.14);
      this.fragment(k.x + Math.cos(a) * k.sx * 0.5, k.y + Math.sin(a) * k.sy * 0.5, k.z + k.sz * 0.3, Math.cos(a) * Math.cos(el) * v, Math.sin(a) * Math.cos(el) * v, Math.sin(el) * v, s, k.shade);
    }
    particles.burst(k.x, k.y, k.z, 50, 1, 6 + power, 20, 80);
    G.shake = Math.max(G.shake, 0.15 + k.D * 0.4); sfx.boom(k.D);
  }
  fragment(x, y, z, vx, vy, vz, s, shade) {
    if (this.debris.length >= 320) this.debris.shift();
    this.debris.push({ x, y, z, vx, vy, vz, s, shade, rot: Math.random() * 6.28, spin: (Math.random() - 0.5) * 12, rest: false });
  }
  step(dt, fx, fy, show = true) {
    if (!show) { if (!this.hidden) { this.hidden = true; for (const m of this.meshes) m.count = 0; this.active.length = 0; this.buckets.clear(); } }
    else if (this.hidden || Math.hypot(fx - this.cx, fy - this.cy) > 5) { this.hidden = false; this.rebuild(fx, fy); }
    // pushed / dropped rocks: slide, roll and bounce on the real ground
    for (const k of this.movers) {
      const d = k.dyn; if (!d) continue;
      d.vz -= G_MOON * dt; k.x += d.vx * dt; k.y += d.vy * dt; k.z += d.vz * dt;
      const g = clip.ground(k.x, k.y) + k.sz * (1 - 2 * k.bury * 0.3);
      if (k.z <= g) {
        k.z = g; if (d.vz < -0.4) { d.vz = -d.vz * 0.25; sfx.thud(-d.vz); } else d.vz = 0;
        const sp = Math.hypot(d.vx, d.vy), dec = 0.7 * G_MOON * dt; if (sp <= dec) { d.vx = d.vy = 0; if (d.vz === 0) { k.dyn = null; this.movers.delete(k); this.bucket(k); } } else { d.vx *= 1 - dec / sp; d.vy *= 1 - dec / sp; }
        clip.normal(k.x, k.y, tmp.a); d.vx += tmp.a.x * G_MOON * dt; d.vy += tmp.a.y * G_MOON * dt;       // rolls downhill
      }
      k.yaw += Math.hypot(d ? d.vx : 0, d ? d.vy : 0) * dt / Math.max(0.05, k.sx); this.place(k);
    }
    // fragments
    let moving = false;
    for (let i = 0; i < this.debris.length; i++) {
      const f = this.debris[i]; if (!f.rest) {
        moving = true; f.vz -= G_MOON * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.z += f.vz * dt; f.rot += f.spin * dt;
        const g = clip.ground(f.x, f.y) + f.s * 0.5;
        if (f.z <= g) { f.z = g; if (Math.abs(f.vz) > 0.5) { f.vz = -f.vz * 0.3; f.vx *= 0.6; f.vy *= 0.6; f.spin *= 0.5; } else { f.rest = true; } }
      }
      tmp.q.setFromAxisAngle(tmp.b.set(0.3, 0.5, 0.8).normalize(), f.rot); tmp.m.compose(tmp.a.set(f.x, f.y, f.z), tmp.q, tmp.s.set(f.s, f.s * 0.8, f.s * 0.6)); this.dm.setMatrixAt(i, tmp.m);
    }
    if (moving || this.dm.count !== this.debris.length) { this.dm.count = this.debris.length; this.dm.instanceMatrix.needsUpdate = true; }
    // gems: glow, turn, and jump into the rover when it comes close
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const g = this.gems[i]; g.m.rotation.z += dt * 1.6; g.m.material.emissiveIntensity = 1.4 + 0.6 * Math.sin((G.t - g.t) * 4);
      if (G.mode === 'rover') {
        const dx = rover.pos.x - g.x, dy = rover.pos.y - g.y, d = Math.hypot(dx, dy);
        if (d < 2.2) { g.x += dx / d * dt * 5; g.y += dy / d * dt * 5; g.m.position.set(g.x, g.y, g.m.position.z + (rover.pos.z + 0.2 - g.m.position.z) * Math.min(1, dt * 4)); }
        if (d < 0.7) { scene.remove(g.m); this.gems.splice(i, 1); sfx.ore(g.type === 2);
          if (g.type === 2) { G.stats.th++; addPoints(COST.thorium, 'thorium ore'); } else { G.stats.il++; addPoints(COST.ilmenite, 'ilmenite'); } }
      }
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
    this.arm = { phase: 'idle', t: 0, rock: null, tip: V(0, 0.3, 0.35), from: V(), to: V() }; this.cool = 0;
    this.F = V(); this.T = V();
    this.s = { hp: V(), n: V(), tF: V(), tS: V(), cp: V(), v: V(), Fw: V(), wW: V(), Tb: V(), r: V(), qi: new THREE.Quaternion(), dq: new THREE.Quaternion() };
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
    for (let i = 0; i < 4; i++) {
      if (upz < 0.3) { this.comp[i] = 0; continue; }          // on its side or roof: the wheels are in the air
      hp.copy(this.hp[i]).applyQuaternion(this.q).add(this.pos);
      const hg = clip.ground(hp.x, hp.y) + rocks.bump(hp.x, hp.y);
      let comp = hg - (hp.z - REST - RW);
      if (comp <= 0) { this.comp[i] = 0; this.spin[i] += this.thr * P.vmax / RW * dt; continue; }
      comp = Math.min(comp, REST + 0.12);
      const rate = (comp - this.comp[i]) / dt; this.comp[i] = comp;
      const Fn = clamp(K * comp + C * rate, 0, 3500); if (Fn <= 0) continue;
      contacts++;
      clip.normal(hp.x, hp.y, n, 0.2);
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
    if (contacts === 0) this.air += dt; else { if (this.air > 0.35) { this.lastAir = this.air; this.lastAirT = G.t; sfx.thud(Math.abs(this.vel.z)); } this.air = 0; }
    // integrate: linear, then Euler's equations in the body frame
    this.vel.addScaledVector(this.F, dt / this.m); this.pos.addScaledVector(this.vel, dt);
    Tb.copy(this.T).applyQuaternion(S.qi.copy(this.q).invert());
    const w = this.w, I = this.I;
    w.x += (Tb.x - (I.z - I.y) * w.y * w.z) / I.x * dt; w.y += (Tb.y - (I.x - I.z) * w.z * w.x) / I.y * dt; w.z += (Tb.z - (I.y - I.x) * w.x * w.y) / I.z * dt;
    w.multiplyScalar(1 - 0.15 * dt);
    const ang = w.length() * dt; if (ang > 1e-9) { S.dq.setFromAxisAngle(hp.copy(w).normalize(), ang); this.q.multiply(S.dq).normalize(); }
  }
  /* rocks too tall to roll over: push them if light enough, otherwise be stopped */
  collide(dt) {
    const P = perk(), R = 0.8;
    rocks.near(this.pos.x, this.pos.y, R, k => {
      if (k.hr <= 0.3 && !k.dyn) return;
      const dx = k.x - this.pos.x, dy = k.y - this.pos.y, d = Math.hypot(dx, dy), rr = Math.max(k.sx, k.sy), ov = R * 0.75 + rr - d;
      if (ov <= 0 || d < 1e-6 || Math.abs(k.z - this.pos.z) > 0.9 + k.sz) return;
      const nx = dx / d, ny = dy / d, vn = this.vel.x * nx + this.vel.y * ny - (k.dyn ? k.dyn.vx * nx + k.dyn.vy * ny : 0);
      if (k.mass <= P.push) {
        if (!k.dyn) { k.dyn = { vx: 0, vy: 0, vz: 0 }; rocks.movers.add(k); k.bury *= 0.3; }
        if (vn > 0) { const j = vn * 1.2 / (1 / this.m + 1 / k.mass); k.dyn.vx += nx * j / k.mass; k.dyn.vy += ny * j / k.mass; this.vel.x -= nx * j / this.m; this.vel.y -= ny * j / this.m; rocks.reveal(k); }
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
      A.tip.lerpVectors(A.from, A.to, e);
      if (t >= 1) this.armNext();
    }
    if (A.rock && A.rock.held) {                          // carried rock follows the gripper
      u.grip.getWorldPosition(tmp.a); A.rock.x = tmp.a.x; A.rock.y = tmp.a.y; A.rock.z = tmp.a.z - A.rock.sz * 0.5; rocks.place(A.rock);
    }
    // two-link inverse kinematics in the vertical plane through the target
    const tip = A.tip, yaw = Math.atan2(-tip.x, tip.y), d = Math.hypot(tip.x, tip.y), h = tip.z, r = clamp(Math.hypot(d, h), 0.25, 2 * ARM_L - 0.02);
    const el = Math.acos(clamp((2 * ARM_L * ARM_L - r * r) / (2 * ARM_L * ARM_L), -1, 1)), sh = Math.atan2(h, d) + Math.acos(clamp(r / (2 * ARM_L), -1, 1));
    u.armBase.rotation.z = yaw; u.shoulder.rotation.x = sh; u.elbow.rotation.x = -(Math.PI - el);
    void STOW;
  }
  armGo(phase, to) { const A = this.arm; A.phase = phase; A.t = 0; A.from.copy(A.tip); if (to) A.to.copy(to); }
  armNext() {
    const A = this.arm, k = A.rock, P = perk();
    if (A.phase === 'reach') {
      if (!k || k.dead) return this.armGo('stow', V(0, 0.28, 0.32));
      sfx.grab(); sfx.servo(0.45); k.held = true; k.dyn = null; k.gemOut = true; rocks.movers.add(k);      // any ore is handled by the arm
      this.armGo('lift', V(0.1, 0.5, 0.8));
    } else if (A.phase === 'lift') {                      // held over the analyser on the deck
      G.stats.rocks++; k.held = false; A.rock = null;
      if (k.gem) { rocks.remove(k); sfx.ore(k.gem === 2); if (k.gem === 2) G.stats.th++; else G.stats.il++; addPoints(k.gem === 2 ? COST.thorium : COST.ilmenite, `Rock ${G.stats.rocks}: ${k.gem === 2 ? 'thorium ore' : 'ilmenite'}`); }
      else { const r = tmp.b.set(1, 0, 0).applyQuaternion(this.q), side = Math.random() < 0.5 ? -1 : 1; k.bury = 0.05; k.dyn = { vx: this.vel.x + r.x * side * 2.4, vy: this.vel.y + r.y * side * 2.4, vz: 2.3 }; sfx.toss(); toast(`Rock ${G.stats.rocks}: no ore — thrown away`, 1300); }
      this.armGo('stow', V(0, 0.28, 0.32));
    } else A.phase = 'idle';
    void P;
  }
  grab() {
    const A = this.arm, P = perk();
    if (A.phase !== 'idle') return;
    const f = this.fwd.clone(); let best = null, bd = 1e9;
    rocks.near(this.pos.x + f.x * 0.9, this.pos.y + f.y * 0.9, 1.25, k => {
      const dx = k.x - this.pos.x, dy = k.y - this.pos.y, d = Math.hypot(dx, dy); if (d > 2.05 || dx * f.x + dy * f.y < 0.25 || k.D > P.liftD) return;
      if (d < bd) { bd = d; best = k; }
    });
    if (!best) return toast(`No rock within reach.\nThe arm lifts rocks up to ${fm(P.liftD * 100, 0)} cm — shoot the bigger ones.`, 2200);
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
    this.yaw += -ax * 0.9 * dt;
    const f = tmp.a.set(Math.sin(this.yaw), Math.cos(this.yaw), 0);
    /* The stick asks for a speed that grows with height. Close to the ground this is ordinary hover flight; high up the
       speeds and accelerations are far beyond any real lander — theoretical, there to cross the map. */
    const vMaxH = Math.max(12, 0.8 * agl), aLim = Math.max(2.6, 0.6 * agl);
    const axW = clamp((f.x * ay * vMaxH - this.vel.x) * 0.9, -aLim, aLim), ayW = clamp((f.y * ay * vMaxH - this.vel.y) * 0.9, -aLim, aLim);
    const vMax = Math.max(2.5, 0.45 * agl), vT = vz * vMax, az = clamp((vT - this.vel.z) * 1.6, -Math.max(G_MOON, 0.5 * agl), Math.max(3.5, 0.5 * agl));
    this.thrust = clamp(Math.hypot(axW, ayW, az + G_MOON) / (G_MOON + 3.5), 0, 1.4);
    this.vel.x += axW * dt; this.vel.y += ayW * dt; this.vel.z += az * dt; this.pos.addScaledVector(this.vel, dt);
    this.tilt.lerp(tmp.b.set(axW, ayW, 0).multiplyScalar(1 / (G_MOON + 3)), Math.min(1, dt * 4));
    if (this.pos.z > g + 100000) { this.pos.z = g + 100000; this.vel.z = Math.min(0, this.vel.z); }
    if (this.pos.z <= g) {                                 // touchdown
      const vh = Math.hypot(this.vel.x, this.vel.y), slope = terrain.slopeDeg(this.pos.x, this.pos.y, 2);
      this.pos.z = g;
      if (this.vel.z > -3 && vh < 2.5 && slope < 16) { this.landed = true; this.vel.set(0, 0, 0); sfx.thud(2); toast('Touchdown — you can deploy the rover', 2500); buildActs(); }
      else { this.vel.z = Math.abs(this.vel.z) * 0.35 + 0.6; this.vel.x *= 0.5; this.vel.y *= 0.5; sfx.thud(4); toast(slope >= 16 ? `Too steep to land here (${fm(slope, 0)}°)` : 'Too fast — bounced', 2000); }
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
function reanchor() {                                    // keep the lander where it is on the Moon, move the map under it
  const [lat, lon] = terrain.toLatLon(lander.pos.x, lander.pos.y), alt = lander.pos.z + terrain.drop(lander.pos.x, lander.pos.y);
  if (!setAnchorAt(lat, lon)) return;
  const p = terrain.fromLatLon(lat, lon); lander.pos.set(p[0], p[1], alt - terrain.drop(p[0], p[1]));
}

/* ====================================================================== tools: blaster, scoop, hop, flip */
const shots = [];
const shotGeo = new THREE.SphereGeometry(0.05, 8, 6), shotMat = new THREE.MeshBasicMaterial({ color: 0xffe9a0 });
const dEagle = p => Math.hypot(p.x - eagle.position.x, p.y - eagle.position.y);
function locked() { if (dEagle(rover.pos) < KEEP_OUT) { toast(`Tranquility Base is a heritage site:\ntools are locked within ${KEEP_OUT} m of the descent stage`, 3000); return true; } return false; }
function fire() {
  if (rover.cool > 0 || locked() || !need(COST.shot)) return;
  const P = perk(), f = rover.fwd.clone(), o = rover.obj.userData.turret.getWorldPosition(V()).addScaledVector(f, 0.45), v0 = 34 + 6 * P.blast;
  // aim at the nearest rock in a cone ahead; the round is ballistic, so solve for the low arc
  let best = null, bs = 1e9;
  for (const k of rocks.active) { if (k.dead || k.held || k.D < 0.12) continue; const dx = k.x - o.x, dy = k.y - o.y, d = Math.hypot(dx, dy); if (d > 40 || d < 0.8) continue; const cs = (dx * f.x + dy * f.y) / d; if (cs < 0.94) continue; const sc = d * (1.06 - cs) * 20 + d * 0.2; if (sc < bs) { bs = sc; best = k; } }
  const dir = V();
  if (best) { const dx = best.x - o.x, dy = best.y - o.y, d = Math.hypot(dx, dy), h = best.z - o.z, disc = v0 ** 4 - G_MOON * (G_MOON * d * d + 2 * h * v0 * v0), th = disc > 0 ? Math.atan((v0 * v0 - Math.sqrt(disc)) / (G_MOON * d)) : 0.1; dir.set(dx / d * Math.cos(th), dy / d * Math.cos(th), Math.sin(th)); }
  else dir.copy(f).addScaledVector(Z, 0.03).normalize();
  dir.x += (Math.random() - 0.5) * 0.012; dir.y += (Math.random() - 0.5) * 0.012; dir.z += (Math.random() - 0.5) * 0.008; dir.normalize();     // a little spread
  const m = new THREE.Mesh(shotGeo, shotMat); m.scale.setScalar(0.5 + 0.35 * P.blast); scene.add(m);
  rover.vel.addScaledVector(dir, -0.05 * P.blast * v0 / rover.m);       // recoil: a 50 g round against a 180 kg rover
  shots.push({ p: o.clone(), v: dir.multiplyScalar(v0).add(rover.vel), m, life: 6, power: P.blast });
  rover.cool = 0.13; sfx.shot();
}
function stepShots(dt) {
  const P = perk();
  for (let i = shots.length - 1; i >= 0; i--) {
    const s = shots[i]; let hit = null, ground = false;
    for (let q = 0; q < 4 && !hit && !ground; q++) {
      const h = dt / 4; s.v.z -= G_MOON * h; s.p.addScaledVector(s.v, h);
      rocks.near(s.p.x, s.p.y, 0.1, k => { if (hit) return; const dx = (s.p.x - k.x) / (k.sx + 0.08), dy = (s.p.y - k.y) / (k.sy + 0.08), dz = (s.p.z - k.z) / (k.sz + 0.08); if (dx * dx + dy * dy + dz * dz < 1) hit = k; });
      if (!hit && s.p.z < clip.ground(s.p.x, s.p.y)) ground = true;
    }
    s.m.position.copy(s.p); s.life -= dt;
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
const dugCells = new Set();
function dig() {
  if (!perk().scoop) return toast(`The scoop blade unlocks at level 4 (${LEVELS[3]} energy captured)`, 2200);
  if (rover.cool > 0 || locked()) return; if (rover.onGround < 2 || !need(COST.dig)) return;
  const f = rover.fwd, x = rover.pos.x + f.x * 1.35, y = rover.pos.y + f.y * 1.35;
  terrain.addCrater(x, y, 0.6, 0.24); settle(x, y, 1.6); rover.cool = 0.7;
  particles.burst(x, y, clip.ground(x, y), 60, 0.6, 3.2, 35, 75); sfx.dig();
  const ci = Math.floor(x), cj = Math.floor(y), key = ci + ',' + cj;
  if (!dugCells.has(key)) { dugCells.add(key); const u = (hash3(ci, cj, 777) & 0xFFFF) / 65536; if (u < 0.08) rocks.gem(x, y, 2); else if (u < 0.26) rocks.gem(x, y, 1); }
}
function hop() { if (!perk().hop) return toast(`Hop thrusters unlock at level 7 (${LEVELS[6]} energy captured)`, 2200); if (rover.onGround >= 2 && rover.cool <= 0 && need(COST.hop)) { rover.vel.z += 3.4; rover.cool = 0.8; sfx.hop(); particles.burst(rover.pos.x, rover.pos.y, rover.pos.z - 0.4, 40, 2, 7, 3, 25); } }
function flip() { rover.q.setFromAxisAngle(Z, -rover.heading()); rover.pos.z = clip.ground(rover.pos.x, rover.pos.y) + 0.8; rover.vel.set(0, 0, 0); rover.w.set(0, 0, 0); }
function deployOrBoard() {
  if (G.mode === 'lander') {
    if (!lander.landed) return toast('Land first', 1500);
    const a = lander.yaw; rover.place(lander.pos.x + Math.sin(a) * 3.6, lander.pos.y + Math.cos(a) * 3.6, a); rover.obj.visible = true; rover.obj.userData.scoop.visible = !!perk().scoop; G.mode = 'rover'; camS.dist = 6.5; camS.off = 2.3; camS.userT = G.t;
    toast(G.points ? 'Rover deployed' : 'Rover deployed\nListen to the detector: it ticks faster near thorium ore.\nLift or shoot the rock to get it.', 5500);
  } else {
    if (Math.hypot(rover.pos.x - lander.pos.x, rover.pos.y - lander.pos.y) > 8) return toast('Drive back to the lander to board it', 2000);
    if (rover.arm.rock) return toast('Put the rock down first', 1500);
    rover.obj.visible = false; G.mode = 'lander'; camS.dist = 16; toast('Aboard — hold ▲ to lift off', 2500);
  }
  buildActs();
}

/* ====================================================================== input */
const keys = new Set(), stick = { x: 0, y: 0 }, held = new Set();
const ACT = { fire, grab: () => rover.grab(), dig, hop, flip, deploy: deployOrBoard,
  names() { G.names = !G.names; document.querySelector('#more [data-act=names]').textContent = 'Crater names: ' + (G.names ? 'on' : 'off'); },
  rescue() {                                            // never stranded: the base station brings both vehicles home
    if (rover.arm.rock) { rover.arm.rock.held = false; rover.arm.rock = null; rover.arm.phase = 'idle'; }
    setAnchorAt(terrain.site.lat, terrain.site.lon); clip.update(BASE.x, BASE.y);
    lander.place(BASE.x + 11, BASE.y + 5); lander.yaw = 1.2; rover.place(BASE.x + 6.5, BASE.y - 1, 0.6); rover.obj.visible = true; G.mode = 'rover'; G.energy = Math.max(G.energy, 30); G.flat = false; camS.dist = 6.5; camS.off = 2.3; camS.userT = G.t;
    toast('Brought back to Tranquility Base.\nStay close to the station to recharge.', 4500); buildActs(); },
  layers() { G.overlay = !G.overlay; clip.setOverlay(G.overlay); rocks.rebuild(rocks.cx, rocks.cy); $('legend').classList.toggle('open', G.overlay); document.querySelector('[data-act=layers]').classList.toggle('on', G.overlay); if (G.overlay) toast('Shape of the ground:\ngrey = measured · cyan = inferred from the photo · orange = predicted', 4500); },
  info() { sheet('info'); }, help() { sheet('help'); }, more() { sheet('more'); },
  cam() { G.cam = (G.cam + 1) % 3; document.querySelector('#more [data-act=cam]').textContent = 'Camera: ' + ['follow', 'rover mast', 'from above'][G.cam]; },
  sound() { G.soundOn = !G.soundOn; document.querySelector('#more [data-act=sound]').textContent = 'Sound: ' + (G.soundOn ? 'on' : 'off'); if (sfx.ctx) sfx.out.gain.value = G.soundOn ? 0.5 : 0; },
  fullscreen() { const d = document.documentElement, f = document.fullscreenElement || document.webkitFullscreenElement; if (f) (document.exitFullscreen || document.webkitExitFullscreen).call(document); else { const r = d.requestFullscreen || d.webkitRequestFullscreen; if (r) r.call(d); else toast('On iPhone: Share → Add to Home Screen opens it full screen', 5000); } },
  reset() { if (confirm('Erase your points and start again?')) { try { localStorage.removeItem('lunar-rover-v1'); } catch (_) {} location.reload(); } },
};
function sheet(id) { for (const s of document.querySelectorAll('.sheet')) s.classList.toggle('open', s.id === id && !s.classList.contains('open')); }
document.addEventListener('click', e => {
  const c = e.target.closest('[data-close]'); if (c) { c.closest('.sheet').classList.remove('open'); return; }
  const b = e.target.closest('[data-act]'); if (!b || b.dataset.hold) return; sfx.kick(); b.blur(); ACT[b.dataset.act]?.();
});
const KEYMAP = { Space: 'fire', KeyE: 'grab', KeyQ: 'dig', KeyH: 'hop', KeyT: 'flip', Enter: 'deploy', KeyL: 'deploy', KeyV: 'layers', KeyI: 'info', KeyG: 'help', KeyC: 'cam', KeyM: 'sound', KeyN: 'names', KeyB: 'rescue' };
addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return; sfx.kick();
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
  if (G.mode === 'lander') box.innerHTML = b('up', '▲', 'Up', 'R / PgUp', '', true) + b('down', '▼', 'Down', 'F / PgDn', '', true) + b('deploy', '⇣', 'Deploy rover', 'Enter', lander && lander.landed ? '' : 'locked');
  else box.innerHTML = (G.flat ? b('rescue', '⌂', 'Back to base', 'B', 'wide') : '') + b('fire', '✹', 'Gun ' + ['', 'I', 'II', 'III'][P.blast], 'Space', '', true) + b('grab', '✊', 'Grab', 'E') + b('dig', '⛏', 'Dig', 'Q', P.scoop ? '' : 'locked')
    + b('hop', '⇡', 'Hop', 'H', P.hop ? '' : 'locked') + b('flip', '↻', 'Upright', 'T') + b('deploy', '⇡', 'Board', 'Enter');
  for (const el of box.querySelectorAll('[data-hold]')) {
    const a = el.dataset.act, up = () => { held.delete(a); el.classList.remove('on'); };
    el.addEventListener('pointerdown', e => { e.preventDefault(); sfx.kick(); try { el.setPointerCapture(e.pointerId); } catch (_) {} held.add(a); el.classList.add('on'); });
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up); el.addEventListener('contextmenu', e => e.preventDefault());
  }
  $('keys').textContent = G.mode === 'lander' ? '↑↓ fly · ←→ turn · R / F up, down · Enter deploy rover · drag to look' : '↑↓ drive · ←→ steer · Space gun · E grab · Q dig · N names · Enter board · drag to look';
}
function hudScore() {
  $('enTxt').textContent = fm(Math.max(0, G.energy), 0); $('enFill').style.width = clamp(G.energy, 0, 100) + '%'; $('enFill').classList.toggle('low', G.energy < 12); $('enOver').textContent = G.energy > 100 ? '+' + fm(G.energy - 100, 0) : '';
  $('pts').firstChild.textContent = G.points.toLocaleString('en-US');
  const l = G.level, a = LEVELS[l - 1], b = LEVELS[l] ?? LAUNCH; $('lvlTxt').textContent = G.ready ? 'Ready for Earth' : 'Level ' + l; $('lvlFill').style.width = clamp((G.points - a) / (b - a), 0, 1) * 100 + '%';
}
function hudStat(agl) {
  const row = (k, v, c = '') => `<span class="k">${k.padEnd(7)}</span><span class="${c}">${v}</span>\n`, s = [];
  if (G.mode === 'lander') { const vh = Math.hypot(lander.vel.x, lander.vel.y); s.push(row('HEIGHT', lander.landed ? 'landed' : agl < 1000 ? fm(agl, 1) + ' m' : fm(agl / 1000, 2) + ' km'), row('SPEED', (vh < 280 ? fm(vh * 3.6, 0) + ' km/h' : fm(vh / 1000, 2) + ' km/s') + (vh > 60 ? ' · theoretical' : ''), vh > 60 ? 'warn' : ''), row('V/S', (lander.vel.z >= 0 ? '+' : '') + fm(lander.vel.z, 1) + ' m/s', lander.vel.z < -3 && agl < 20 ? 'warn' : '')); }
  else {
    const up = rover.up(), tilt = Math.acos(clamp(up.z, -1, 1)) * R2D, sp = rover.vel.length();
    s.push(row('SPEED', fm(sp * 3.6, 1) + ' km/h'), row('TILT', fm(tilt, 0) + '°', tilt > 30 ? 'warn' : ''));
    s.push(row('ROCKS', `${G.stats.rocks} · Th ${G.stats.th} · Il ${G.stats.il}`));
    const lv = G.det < 16 ? Math.round(clamp(1 - G.det / 16, 0, 1) * 8) : 0; s.push(row('THORIUM', '▮'.repeat(lv) + '▯'.repeat(8 - lv) + (G.det < 16 ? ' ' + fm(G.det, 0) + ' m' : ''), lv > 4 ? 'ok' : ''));
    if (rover.air > 0.25) s.push(row('AIR', fm(rover.air, 1) + ' s', 'ok')); else if (rover.lastAir && G.t - (rover.lastAirT || 0) < 3) s.push(row('JUMP', fm(rover.lastAir, 1) + ' s', 'ok'));
  }
  const p = G.mode === 'lander' ? lander.pos : rover.pos, d = dEagle(p);
  s.push(row('EAGLE', (d < 1000 ? fm(d, 0) + ' m' : fm(d / 1000, 1) + ' km') + (d < KEEP_OUT ? ' · keep-out' : ''), d < KEEP_OUT ? 'warn' : ''));
  const ll = terrain.toLatLon(p.x, p.y); s.push(row('LAT LON', `${fm(Math.abs(ll[0]), 2)}°${ll[0] >= 0 ? 'N' : 'S'} ${fm(Math.abs(ll[1]), 2)}°${ll[1] >= 0 ? 'E' : 'W'}`));
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
  <p>In the game the rover turns both into energy: ilmenite +${COST.ilmenite}, thorium ore +${COST.thorium}. Energy runs everything, and the total you have captured decides how fast and how strong the rover becomes. At ${LAUNCH} captured, you are ready for the journey to the Earth. <span class="dim">Ore as fuel is fiction: real lunar thorium is a few parts per million of the rock, far too dilute to fuel anything without an industrial plant. Real rovers run on sunlight, which here only trickles in.</span></p>
  <h3>The ground: what is real and what is a prediction</h3>
  <p>The LRO cameras see this site at 0.5 m per pixel and its elevation at 2 m per pixel. A rover is smaller than that, so the ground is built from three layers. Press <b>Layers</b> to see them in colour.</p>
  <p><b class="tagm">1 · Measured.</b> Elevation from the LROC NAC stereo model and the brightness of the real LROC photograph. Shapes larger than about 10 m are exactly these data.</p>
  <p><b class="tagi">2 · Inferred from the photograph.</b> Where the ground tilts towards the Sun the photo is brighter, so shading reveals craters of 2–10 m in their real positions; their depth is an estimate. Against the measured elevation (${v.band_m[0]}–${v.band_m[1]} m), slope and brightness agree with r = ${v.slope_brightness_r}; heights with r = ${v.heights['12-24 m'].r}.</p>
  <p><b class="tagp">3 · Predicted.</b> Below the photo's resolution nothing is measured. Features are generated so that their <em>statistics</em> match what is known; no individual one is real.</p>
  <table>
    <tr><td>Craters</td><td>${R.craterEquilibrium.note}. ${R.craterMinD}–${R.craterMaxD} m inside the photo; up to ${R.craterMaxDfar} m outside it, where the elevation data only resolve craters above about 250 m.</td></tr>
    <tr><td>Rocks ${R.rocks.minD * 100}–${R.rocks.maxD * 100} cm</td><td>${R.rocks.note}. More rocks on steeper ground — an assumption.</td></tr>
    <tr><td>Roughness</td><td>${R.roughness.note}.</td></tr>
    <tr><td>Ores</td><td>About one rock in seven carries ilmenite and one in twenty-five thorium ore, more often the larger ones. These odds are invented for the game.</td></tr>
  </table>
  <p class="dim">The constants in this table are quoted from the literature from memory and still need to be checked against the original papers.</p>
  <h3>The rest of the Moon</h3>
  <p>You can fly anywhere between 82° north and south. Away from the landing site the measured data get coarser — 59 m per pixel within 60 km, 474 m within 240 km, about 4 km for the rest of the globe — so more and more of what you see close up is predicted, and the HUD tells you below which size. Large predicted craters follow a rule of thumb: ${R.bigCraters.note}. Mare and highland are told apart by the brightness of the real global mosaic.</p>
  <p class="dim">Simplifications: the Sun is at the same height everywhere, as if it were the same local time all over the Moon; ore odds are the same everywhere; the map is flat around the vehicle with the curvature added, which is why the poles are left out.</p>
  <h3>Physics that is real</h3>
  <ul><li>Gravity 1.62 m/s², a sixth of Earth's: jumps last six times longer and debris flies six times farther.</li>
  <li>No air: fragments, dust and bullets follow clean parabolas and stop where they land.</li>
  <li>No air also means no sound. What you hear is what the vehicle's own structure would carry: motors, the gun's action, impacts through the wheels.</li>
  <li>Grip depends on weight, and the rover weighs a sixth: it accelerates and brakes gently.</li>
  <li>The Earth hangs over the middle of the near side: high in the sky at Tranquility Base, on the horizon near the limb, and never visible from the far side. Fly there and look.</li></ul>
  <h3>What is only a game</h3>
  <ul><li>Ore as glowing nuggets, thorium as fuel, the gun, unlimited propellant for the lander.</li>
  <li><b>The lander's speed.</b> It grows with height so the Moon can be crossed in a minute; at altitude it reaches tens of kilometres per second, with accelerations no vehicle or crew could take. The HUD marks it "theoretical".</li>
  <li>The Apollo 11 descent stage stands at its real position; its shape is illustrative. Tools are locked within ${KEEP_OUT} m of it, in the spirit of NASA's guidelines for protecting the Apollo sites.</li></ul>`;
  $('helpBody').innerHTML = `
  <p>You start in the lander beside the base station at Tranquility Base. <b>Deploy</b> the rover, prospect, and <b>Board</b> again to fly anywhere on the Moon.</p>
  <table>
    <tr><td><b>Energy</b></td><td>Everything the rover does uses it. Sunlight gives a trickle; the base station recharges to 100; thorium ore adds ${COST.thorium} each, with no upper limit. If it runs flat the rover only crawls — press <b>Back to base</b>.</td></tr>
    <tr><td><b>Detector</b></td><td>Ticks faster, and the THORIUM bar fills, as you approach a rock that holds thorium ore.</td></tr>
    <tr><td><b>Grab</b></td><td>The arm lifts the nearest rock in front and analyses it. Ore is turned into energy, with its own sound; a plain rock is thrown away. The HUD counts rocks analysed, thorium (Th) and ilmenite (Il) finds.</td></tr>
    <tr><td><b>Gun</b></td><td>Aims at the nearest rock ahead. Any rock can be destroyed; big ones take several rounds. The ore drops out.</td></tr>
    <tr><td><b>Ore</b></td><td><span style="color:var(--emer)">Thorium ore</span> +${COST.thorium} energy, <span style="color:var(--blue)">ilmenite</span> +${COST.ilmenite}. Rocks too big for the arm must be shot; drive over what falls out.</td></tr>
    <tr><td><b>Levels</b></td><td>By total energy captured:<br>${PERKS.slice(2).map((p, i) => `L${i + 2} (${LEVELS[i + 1]}): ${p.name}`).join('<br>')}<br>${LAUNCH}: ready for the Earth</td></tr>
    <tr><td><b>Drive</b></td><td>${touchUI ? 'Left stick' : 'Arrow keys or W A S D'}. Hit a rock at speed and the rover jumps — slowly, this is the Moon.</td></tr>
    <tr><td><b>Lander</b></td><td>${touchUI ? '▲ ▼ and the stick' : 'R / F (or PgUp / PgDn) and the arrow keys'}. The higher you are, the faster it flies and climbs, up to 100 km. Come down and slow down to land, on ground that is not too steep.</td></tr>
    <tr><td><b>Names</b></td><td>Official IAU names of craters and other features point the way, with distances. ${touchUI ? '☰ → Crater names' : 'N'} turns them off.</td></tr>
    <tr><td><b>View</b></td><td>Drag to look round, ${touchUI ? 'pinch' : 'scroll'} to zoom.</td></tr>
  </table>`;
}

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
(async function boot() {
  const load = $('load');
  try {
    terrain = await new Terrain().load(s => { load.textContent = 'Loading lunar data…\n' + s; });
    load.textContent = 'Building the ground…';
    clip = new Clipmap(terrain, scene, { terrainShadows: !touchUI });
    // tone: bring the regional mosaic to the brightness of the local photo
    clip.uniforms.uGain.value.set(1.0, 1.0);
    particles = new Particles(touchUI ? 900 : 1800); rocks = new Rocks(); rover = new Rover(); lander = new Lander();
    eagle = makeEagle(); scene.add(eagle); base = makeBase(); scene.add(base);
    BASE.ll = terrain.toLatLon(BASE.x, BASE.y);
    const sx = BASE.x + 15, sy = BASE.y + 7; clip.update(sx, sy); placeStatics(); base.rotation.z = 0.5; 
    lander.place(sx, sy); lander.yaw = 68 * D2R; rocks.rebuild(sx, sy); labels.load();
    camS.yaw = lander.yaw; buildActs(); hudScore(); fillSheets();
    load.style.display = 'none';
    toast('Tranquility Base, 130 m from where Apollo 11 landed.\nDeploy the rover and prospect for ore — or lift off and fly anywhere.', 7000);
  } catch (err) { console.error(err); load.textContent = 'Could not start: ' + err.message; return; }

  let last = performance.now(), hudT = 0, slow = 0, quality = 0, detT = 0, saveT = 0, anchorT = 0, poleT = 0;
  /* one step of the game (no drawing) */
  function tick(dt) {
    G.t += dt;
    const ax = clamp(kd('ArrowRight', 'KeyD') - kd('ArrowLeft', 'KeyA') + stick.x, -1, 1), ay = clamp(kd('ArrowUp', 'KeyW') - kd('ArrowDown', 'KeyS') + stick.y, -1, 1);
    let focus, agl = 0;
    if (G.mode === 'rover') {
      const thr = G.flat ? ay * 0.25 : ay;                // flat battery: sunlight alone only lets it crawl
      const n = Math.max(2, Math.ceil(dt / 0.006)); for (let i = 0; i < n; i++) rover.step(dt / n, ax, thr);
      rover.collide(dt); rover.cool -= dt;
      G.energy += (COST.solar - (G.flat ? 0 : COST.drive * Math.abs(ay))) * dt;
      if (G.energy < COST.baseMax && Math.hypot(rover.pos.x - BASE.x, rover.pos.y - BASE.y) < 10) G.energy = Math.min(COST.baseMax, G.energy + COST.baseRate * dt);
      if (G.energy <= 0 && !G.flat) { G.energy = 0; G.flat = true; buildActs(); toast('Battery flat.\nSunlight keeps the rover crawling. Find thorium ore,\nor press Back to base.', 6000); }
      else if (G.flat && G.energy > 4) { G.flat = false; buildActs(); }
      if (G.energy < 0) G.energy = 0;
      if (keys.has('Space') || held.has('fire')) fire();
      if (rover.pos.z < clip.ground(rover.pos.x, rover.pos.y) - 1.5) flip();
      if (rover.rolled > 2.0) { flip(); rover.rolled = 0; toast('Rolled over — set back on its wheels', 2000); }
      for (const [o, r] of [[lander.pos, 2.9], [eagle.position, 5.2], [base.position, 3.4]]) {      // cannot drive through the lander or the descent stage
        const dx = rover.pos.x - o.x, dy = rover.pos.y - o.y, d = Math.hypot(dx, dy); if (d >= r || d < 1e-6) continue;
        const nx = dx / d, ny = dy / d, vn = rover.vel.x * nx + rover.vel.y * ny; rover.pos.x += nx * (r - d); rover.pos.y += ny * (r - d); if (vn < 0) { rover.vel.x -= nx * vn; rover.vel.y -= ny * vn; }
      }
      if (Math.abs(rover.pos.x) > 58000 || Math.abs(rover.pos.y) > 58000) { rover.pos.x = clamp(rover.pos.x, -58000, 58000); rover.pos.y = clamp(rover.pos.y, -58000, 58000); rover.vel.multiplyScalar(0.5); }
      rover.sync(dt); focus = rover.pos;
    } else {
      agl = lander.step(dt, ax, ay, kd('KeyR', 'PageUp') - kd('KeyF', 'PageDown') + (held.has('up') ? 1 : 0) - (held.has('down') ? 1 : 0)); focus = lander.pos;
      const dA = Math.hypot(lander.pos.x, lander.pos.y);
      if (G.t > anchorT && (lander.landed ? dA > 12000 : dA > clamp(agl, 20000, 150000))) { anchorT = G.t + 1; reanchor(); }
      const lat = terrain.lat0 + lander.pos.y / terrain.ky;      // the polar regions are not covered by this flat-map method
      if (Math.abs(lat) > 82) { lander.pos.y = (82 * Math.sign(lat) - terrain.lat0) * terrain.ky; lander.vel.y = 0; if (G.t > poleT) { poleT = G.t + 10; toast('The polar regions are not covered yet (beyond 82°)', 3500); } }
    }
    const lowSlow = G.mode === 'rover' || (agl < 40 && lander.vel.length() < 20);
    lander.sync(); stepShots(dt); particles.step(dt); rocks.step(dt, focus.x, focus.y, lowSlow);
    // detector: distance to the nearest thorium ore, still in its rock or lying free
    detT -= dt; if (detT <= 0) { detT = 0.25; let d = 99; if (G.mode === 'rover') { for (const k of rocks.active) if (k.gem === 2 && !k.gemOut && !k.dead) d = Math.min(d, Math.hypot(k.x - rover.pos.x, k.y - rover.pos.y)); for (const g of rocks.gems) if (g.type === 2) d = Math.min(d, Math.hypot(g.x - rover.pos.x, g.y - rover.pos.y)); } G.det = d; }
    sfx.frame(dt, { thrust: G.mode === 'lander' && !lander.landed ? Math.min(1, lander.thrust) : 0, throttle: G.mode === 'rover' ? ay : 0, wheel: G.mode === 'rover' ? Math.abs(rover.vel.length()) / 6 : 0,
      speed: G.mode === 'rover' ? rover.vel.length() : 0, ground: G.mode === 'rover' && rover.onGround > 0, geiger: G.mode === 'rover' ? 0.5 + (G.det < 16 ? 70 / (1 + G.det * G.det * 0.5) : 0) : 0 });

    // camera
    const head = G.mode === 'rover' ? rover.heading() : lander.yaw, moving = G.mode === 'rover' ? rover.vel.length() > 0.4 : !lander.landed;
    if (G.t - camS.userT > 2.5 && moving) camS.off *= Math.max(0, 1 - dt * 1.5);
    let dy = head - camS.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); camS.yaw += dy * Math.min(1, dt * 3);
    const yaw = camS.yaw + camS.off, look = tmp.a.copy(focus).addScaledVector(Z, G.mode === 'rover' ? 0.5 : 1.6);
    if (G.cam === 1 && G.mode === 'rover') { camera.position.copy(tmp.b.set(-0.28, 0.45, 1.0).applyQuaternion(rover.q).add(rover.pos)); camera.up.copy(rover.up()); camera.lookAt(tmp.c.copy(rover.fwd).multiplyScalar(6).add(camera.position).addScaledVector(Z, -1.2)); }
    else {
      const hi = G.mode === 'lander' ? agl : 0;             // from high up: stand farther back and look further down, so the ground stays in view
      const pit = G.cam === 2 ? 1.25 : Math.max(camS.pitch, Math.min(1.2, hi / 900)), dist = (G.cam === 2 ? Math.max(camS.dist, 30) : camS.dist) * (1 + hi / 500), cp = Math.cos(pit);
      camS.pos.set(look.x - Math.sin(yaw) * cp * dist, look.y - Math.cos(yaw) * cp * dist, look.z + Math.sin(pit) * dist);
      const gz = clip.ground(camS.pos.x, camS.pos.y) + 0.35; if (camS.pos.z < gz) camS.pos.z = gz;
      camera.position.copy(camS.pos); camera.up.copy(Z); camera.lookAt(look);
    }
    if (G.shake > 0.001) { camera.position.x += (Math.random() - 0.5) * G.shake; camera.position.z += (Math.random() - 0.5) * G.shake; G.shake *= Math.exp(-dt * 7); }
    camera.near = clamp(Math.max(camS.dist * 0.03, agl * 0.01), 0.12, 60); camera.updateProjectionMatrix();
    clip.update(focus.x, focus.y, G.mode === 'lander' ? agl / 120 : 0); aimSun(focus, G.mode === 'rover' ? 22 : clamp(agl * 1.5, 40, 160));
    hudT += dt; if (hudT > 0.15) { hudT = 0; hudStat(agl); hudScore(); if ((saveT += 0.15) > 5) { saveT = 0; save(); } const d = document.querySelector('#acts [data-act=deploy]'); if (d) d.classList.toggle('locked', G.mode === 'lander' ? !lander.landed : Math.hypot(rover.pos.x - lander.pos.x, rover.pos.y - lander.pos.y) > 8); }
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
    if (!G.paused) tick(Math.min(0.05, real));
    adapt(real);
    const tag = $('tag'), de = camera.position.distanceTo(eagle.position);       // label on the descent stage
    if (de < 150) { const p = tmp.b.set(eagle.position.x, eagle.position.y, eagle.position.z + 4).project(camera); if (p.z < 1 && Math.abs(p.x) < 1 && Math.abs(p.y) < 1) { tag.style.display = 'block'; tag.style.left = ((p.x + 1) * innerWidth / 2) + 'px'; tag.style.top = ((1 - p.y) * innerHeight / 2) + 'px'; tag.textContent = 'Apollo 11 descent stage — real position, illustrative model'; } else tag.style.display = 'none'; } else tag.style.display = 'none';
    labels.frame();
    renderer.render(scene, camera);
  }
  window.__game = { labels, base, sfx, need, COST, reanchor, setAnchorAt, LAUNCH, LEVELS, G, terrain, clip, rocks, rover, lander, camS, ACT, perk, addPoints, keys, stick, held, particles, shots, THREE, camera, tick, get quality() { return quality; } };
  requestAnimationFrame(frame);
})();
