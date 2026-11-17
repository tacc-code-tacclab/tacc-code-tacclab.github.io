/* Lunar Rover — terrain.
   Height of the ground = three layers, kept separate so the page can always say which is which:

     MEASURED   D(x,y)  LROC NAC DTM, 2 m/px (real elevation), LOLA/Kaguya-based regional DEM outside the 2 km tile
     INFERRED   S(x,y)  relief derived from the shading of the real 0.5 m photo (tools/shape_from_shading.py);
                        positions are real, heights are estimates. Only wavelengths below 10 m.
     PREDICTED  P(x,y)  statistically generated: craters smaller than the photo can show, and fine roughness.
                        Individual features are invented; their size distribution and shapes follow published
                        lunar statistics (see RULES below and the README).

   World frame: x east, y north, z up, metres, origin at the Apollo 11 landing site. The Moon's curvature is
   included as a parabolic drop, so the horizon is where it should be. */
import * as THREE from 'three';

export const R_MOON = 1737400, G_MOON = 1.62, D2R = Math.PI / 180;
export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/* ---- the rules behind the predicted layer. Values are quoted from the literature from memory and
        should be checked against the sources before being cited. ---- */
export const RULES = {
  craterEquilibrium: { a: Math.pow(10, -1.1), b: -2, note: 'N(>D) = 10^-1.1 D^-2 per m² (D in m): equilibrium population of small mare craters (Trask 1966)' },
  craterMaxD: 3.0,       // m. Larger craters are visible in the 0.5 m photo, so they must come from the data, not from prediction
  craterMinD: 0.25,      // m. Smaller ones are below the mesh resolution
  craterDepth: { fresh: 0.2, min: 0.03, note: 'depth/diameter 0.2 when fresh, most small craters are degraded and shallower' },
  craterRim: 0.04,       // rim height / diameter for a fresh crater
  rocks: { k: 1.4e-3, g: -2.11, minD: 0.08, maxD: 1.0, note: 'N(>D) = 1.4e-3 D^-2.11 per m² (D in m): Surveyor I mare site (Shoemaker & Morris 1970); rocks ≥ 1 m would be visible in the photo' },
  roughness: { rms: 0.015, note: 'centimetre-scale regolith roughness, about 1.5 cm rms below 2 m' },
};

/* ------------------------------------------------------------------ data */
async function png16(url) {                              // 16-bit greyscale PNG (canvas would drop it to 8 bits)
  const buf = new Uint8Array(await (await fetch(url)).arrayBuffer()), dv = new DataView(buf.buffer);
  let p = 8, w = 0, h = 0; const idat = [];
  while (p < buf.length) {
    const len = dv.getUint32(p), type = String.fromCharCode(buf[p + 4], buf[p + 5], buf[p + 6], buf[p + 7]);
    if (type === 'IHDR') { w = dv.getUint32(p + 8); h = dv.getUint32(p + 12); if (buf[p + 16] !== 16 || buf[p + 17] !== 0) throw new Error('expected 16-bit greyscale PNG'); }
    else if (type === 'IDAT') idat.push(buf.subarray(p + 8, p + 8 + len));
    p += 12 + len;
  }
  const raw = new Uint8Array(await new Response(new Blob(idat).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
  const out = new Uint16Array(w * h), stride = w * 2, cur = new Uint8Array(stride); let prev = new Uint8Array(stride), q = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[q++];
    for (let i = 0; i < stride; i++) {
      const a = i >= 2 ? cur[i - 2] : 0, b = prev[i], c = i >= 2 ? prev[i - 2] : 0; let v = raw[q++];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[i] = v;
    }
    for (let x = 0; x < w; x++) out[y * w + x] = (cur[2 * x] << 8) | cur[2 * x + 1];
    prev.set(cur);
  }
  return { w, h, d: out };
}
async function png8(url) {                               // 8-bit greyscale via canvas
  const bmp = await createImageBitmap(await (await fetch(url)).blob(), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
  const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(bmp, 0, 0);
  const px = g.getImageData(0, 0, c.width, c.height).data, d = new Uint8Array(c.width * c.height);
  for (let i = 0; i < d.length; i++) d[i] = px[4 * i];
  return { w: c.width, h: c.height, d };
}
function loadTex(url, aniso) {
  return new Promise((ok, no) => new THREE.TextureLoader().load(url, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; t.generateMipmaps = true; ok(t); }, undefined, () => no(new Error('cannot load ' + url))));
}

/* Catmull-Rom (bicubic) sample of a raster; fx, fy in pixel units (pixel centres at integers) */
function cubic(r, fx, fy) {
  const w = r.w, h = r.h, d = r.d;
  const x1 = Math.floor(fx), y1 = Math.floor(fy), tx = fx - x1, ty = fy - y1;
  const wx0 = ((-tx + 2) * tx - 1) * tx * 0.5, wx1 = ((3 * tx - 5) * tx * tx + 2) * 0.5, wx2 = ((-3 * tx + 4) * tx + 1) * tx * 0.5, wx3 = (tx - 1) * tx * tx * 0.5;
  const wy0 = ((-ty + 2) * ty - 1) * ty * 0.5, wy1 = ((3 * ty - 5) * ty * ty + 2) * 0.5, wy2 = ((-3 * ty + 4) * ty + 1) * ty * 0.5, wy3 = (ty - 1) * ty * ty * 0.5;
  const xa = clamp(x1 - 1, 0, w - 1), xb = clamp(x1, 0, w - 1), xc = clamp(x1 + 1, 0, w - 1), xd = clamp(x1 + 2, 0, w - 1);
  let s = 0;
  for (let j = 0; j < 4; j++) {
    const o = clamp(y1 - 1 + j, 0, h - 1) * w, wy = j === 0 ? wy0 : j === 1 ? wy1 : j === 2 ? wy2 : wy3;
    s += wy * (wx0 * d[o + xa] + wx1 * d[o + xb] + wx2 * d[o + xc] + wx3 * d[o + xd]);
  }
  return s;
}
function bilin(r, fx, fy) {
  const w = r.w, h = r.h, d = r.d;
  fx = clamp(fx, 0, w - 1.001); fy = clamp(fy, 0, h - 1.001);
  const x = Math.floor(fx), y = Math.floor(fy), tx = fx - x, ty = fy - y, o = y * w + x;
  return (d[o] * (1 - tx) + d[o + 1] * tx) * (1 - ty) + (d[o + w] * (1 - tx) + d[o + w + 1] * tx) * ty;
}

/* ------------------------------------------------------------------ hashing (deterministic prediction) */
const SEED = 0x11A9011;                                  // one fixed seed: everyone sees the same predicted ground
function hash3(a, b, c) {
  let h = SEED ^ Math.imul(a | 0, 0x9E3779B1) ^ Math.imul(b | 0, 0x85EBCA77) ^ Math.imul(c | 0, 0xC2B2AE3D);
  h = Math.imul(h ^ (h >>> 15), 0x2C1B3C6D); h = Math.imul(h ^ (h >>> 12), 0x297A2D39); return (h ^ (h >>> 15)) >>> 0;
}
export function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
export { hash3 };

/* crater profile: r = distance / radius. Bowl inside, raised rim decaying outside. Returns height / radius units. */
function craterZ(r, depth, rim) {
  if (r >= 2.5) return 0;
  if (r <= 1) return (rim + depth) * r * r - depth;
  const f = 1 - smooth(1.8, 2.5, r);
  return rim / (r * r * r) * f;
}

/* ------------------------------------------------------------------ the terrain object */
export class Terrain {
  async load(onStep) {
    const A = '../lunar-flight/assets/apollo11/';
    const man = this.man = await (await fetch(A + 'manifest.json', { cache: 'no-cache' })).json();
    const tier = id => man.tiers.find(t => t.id === id);
    const L = tier('local'), Rg = tier('regional');
    this.lat0 = man.lat; this.lon0 = man.lon;
    const mPerDegLat = D2R * R_MOON, mPerDegLon = mPerDegLat * Math.cos(man.lat * D2R);
    const rect = b => ({ x0: (b.west - man.lon) * mPerDegLon, x1: (b.east - man.lon) * mPerDegLon, y0: (b.south - man.lat) * mPerDegLat, y1: (b.north - man.lat) * mPerDegLat });
    this.loc = rect(L.bounds); this.reg = rect(Rg.bounds);
    onStep('measured elevation (NAC DTM, 2 m)');
    this.dem = await png16(A + L.dem.file); this.demMin = L.dem.h_min; this.demScale = L.dem.h_scale;
    onStep('regional elevation');
    this.rdem = await png16(A + Rg.dem.file); this.rMin = Rg.dem.h_min; this.rScale = Rg.dem.h_scale;
    onStep('relief inferred from shading');
    this.sfsMeta = await (await fetch('data/apollo11_sfs.json', { cache: 'no-cache' })).json();
    this.sfs = await png8('data/apollo11_sfs.png');
    onStep('real photographs (LROC NAC 0.5 m)');
    const aniso = 8;
    this.texLocal = await loadTex(A + L.image.file, aniso);
    this.texRegional = await loadTex(A + Rg.image.file, aniso);
    this.dug = [];                                        // craters made during play: {x, y, r, depth, rim}
    this.dugGrid = new Map();
    this.h0 = 0; this.regOff = 0;
    { // the regional DEM is another data set: remove its mean offset to the NAC DTM over the 2 km tile, so the join is smooth
      let sum = 0, n = 0; const l = this.loc;
      for (let j = 1; j < 16; j++) for (let i = 1; i < 16; i++) { const x = l.x0 + (l.x1 - l.x0) * i / 16, y = l.y0 + (l.y1 - l.y0) * j / 16; sum += this.localH(x, y) - this.regionalH(x, y); n++; }
      this.regOff = sum / n;
    }
    this.h0 = this.measured(0, 0);                        // heights are relative to the ground at the landing site
    return this;
  }

  /* MEASURED: metres relative to the landing site */
  localH(x, y) { const l = this.loc; return this.demMin + this.demScale * cubic(this.dem, (x - l.x0) / (l.x1 - l.x0) * this.dem.w - 0.5, (l.y1 - y) / (l.y1 - l.y0) * this.dem.h - 0.5); }
  regionalH(x, y) { const r = this.reg; return this.rMin + this.rScale * bilin(this.rdem, (x - r.x0) / (r.x1 - r.x0) * this.rdem.w - 0.5, (r.y1 - y) / (r.y1 - r.y0) * this.rdem.h - 0.5) + this.regOff; }
  measured(x, y) {
    const l = this.loc, e = Math.min(x - l.x0, l.x1 - x, y - l.y0, l.y1 - y);          // distance inside the 2 km tile
    if (e >= 64) return this.localH(x, y) - this.h0;
    if (e <= 0) return this.regionalH(x, y) - this.h0;
    const w = smooth(0, 64, e);
    return this.regionalH(x, y) * (1 - w) + this.localH(x, y) * w - this.h0;
  }
  /* INFERRED from shading (zero outside the tile and at the descent stage, which is not terrain) */
  inferred(x, y) {
    const l = this.loc;
    if (x <= l.x0 || x >= l.x1 || y <= l.y0 || y >= l.y1) return 0;
    const d2 = x * x + y * y; if (d2 < 36) return 0;
    const v = this.sfsMeta.h_min + this.sfsMeta.h_scale * cubic(this.sfs, (x - l.x0) / (l.x1 - l.x0) * this.sfs.w - 0.5, (l.y1 - y) / (l.y1 - l.y0) * this.sfs.h - 0.5);
    return d2 < 196 ? v * smooth(36, 196, d2) : v;
  }
  /* PREDICTED: small craters in equilibrium + fine roughness */
  predicted(x, y) {
    let z = 0;
    const E = RULES.craterEquilibrium;
    for (let k = 0, D0 = RULES.craterMinD; D0 < RULES.craterMaxD; k++, D0 *= 2) {
      const cell = 4 * D0, cx = Math.floor(x / cell), cy = Math.floor(y / cell);
      const mean = cell * cell * E.a * (Math.pow(D0, E.b) - Math.pow(2 * D0, E.b));       // craters per cell in this size octave (≈ 0.95)
      const p0 = Math.exp(-mean);
      for (let j = cy - 1; j <= cy + 1; j++) for (let i = cx - 1; i <= cx + 1; i++) {
        const h = hash3(i, j, k), u = (h & 0xFFFF) / 65536;
        // Poisson count from one uniform number
        let n = 0, p = p0, c = p; while (u > c && n < 4) { n++; p *= mean / n; c += p; }
        if (!n) continue;
        const rnd = rng(h ^ 0xA5A5A5A5);
        for (let q = 0; q < n; q++) {
          const px = (i + rnd()) * cell, py = (j + rnd()) * cell, Dm = D0 / Math.sqrt(1 - 0.75 * rnd()), age = rnd();
          if (Dm > RULES.craterMaxD) continue;
          const rad = Dm / 2, dx = x - px, dy = y - py, r2 = (dx * dx + dy * dy) / (rad * rad);
          if (r2 >= 6.25) continue;
          const dd = RULES.craterDepth.min + (RULES.craterDepth.fresh - RULES.craterDepth.min) * age * age;      // most are degraded
          z += rad * craterZ(Math.sqrt(r2), 2 * dd, 2 * RULES.craterRim * dd / RULES.craterDepth.fresh);
        }
      }
    }
    return z + this.rough(x, y);
  }
  rough(x, y) {                                           // value noise, 3 octaves, ~1.5 cm rms
    let z = 0, amp = 0.022, f = 1 / 1.6;
    for (let o = 0; o < 3; o++, amp *= 0.6, f *= 2) {
      const fx = x * f, fy = y * f, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
      const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty), g = (i, j) => hash3(i, j, 97 + o) / 4294967296 - 0.5;
      z += amp * ((g(ix, iy) * (1 - sx) + g(ix + 1, iy) * sx) * (1 - sy) + (g(ix, iy + 1) * (1 - sx) + g(ix + 1, iy + 1) * sx) * sy);
    }
    return z;
  }
  /* craters made by the player (digging, impacts) */
  addCrater(x, y, r, depth) {
    const c = { x, y, r, depth, rim: depth * 0.25 }; this.dug.push(c);
    const g = 8, x0 = Math.floor((x - 2.5 * r) / g), x1 = Math.floor((x + 2.5 * r) / g), y0 = Math.floor((y - 2.5 * r) / g), y1 = Math.floor((y + 2.5 * r) / g);
    for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) { const k = i + ',' + j; if (!this.dugGrid.has(k)) this.dugGrid.set(k, []); this.dugGrid.get(k).push(c); }
    if (this.clip) this.clip.invalidate(x, y, 2.5 * r);
    return c;
  }
  made(x, y) {
    const l = this.dugGrid.get(Math.floor(x / 8) + ',' + Math.floor(y / 8)); if (!l) return 0;
    let z = 0;
    for (const c of l) { const dx = x - c.x, dy = y - c.y, r2 = (dx * dx + dy * dy) / (c.r * c.r); if (r2 < 6.25) z += c.r * craterZ(Math.sqrt(r2), c.depth / c.r, c.rim / c.r); }
    return z;
  }
  drop(x, y) { return (x * x + y * y) / (2 * R_MOON); }    // the Moon curves away: 29 cm at 1 km, 180 m at 25 km
  /* full height; detail: 2 = everything, 1 = measured + inferred, 0 = measured only. Parts are left in this.part */
  height(x, y, detail = 2) {
    const d = this.measured(x, y), s = detail > 0 ? this.inferred(x, y) : 0, p = detail > 1 ? this.predicted(x, y) : 0, m = this.dug.length ? this.made(x, y) : 0;
    this.partS = s; this.partP = p;
    return d + s + p + m - this.drop(x, y);
  }
  slopeDeg(x, y, base = 4) {                              // slope of the measured surface
    const gx = (this.measured(x + base, y) - this.measured(x - base, y)) / (2 * base), gy = (this.measured(x, y + base) - this.measured(x, y - base)) / (2 * base);
    return Math.atan(Math.hypot(gx, gy)) / D2R;
  }
}

/* ------------------------------------------------------------------ clipmap: nested grids that follow the player */
const N = 96, M = N + 3;                                  // cells per side; cache has a one-cell border for normals
export class Clipmap {
  constructor(terrain, scene, opts = {}) {
    this.t = terrain; terrain.clip = this; this.group = new THREE.Group(); scene.add(this.group);
    this.overlay = false;
    this.mat = this.makeMaterial();
    const cells = [0.25, 1, 4, 16, 64, 256, 1024];
    this.levels = cells.map((c, i) => {
      const geo = new THREE.BufferGeometry(), nv = (N + 1) * (N + 1);
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(nv * 3).fill(1), 3).setUsage(THREE.DynamicDrawUsage));
      geo.setIndex(new THREE.BufferAttribute(new Uint16Array(N * N * 6), 1).setUsage(THREE.DynamicDrawUsage));
      const mesh = new THREE.Mesh(geo, this.mat); mesh.frustumCulled = false; mesh.receiveShadow = true; mesh.castShadow = i < 2 && opts.terrainShadows !== false;
      this.group.add(mesh);
      return { i, c, detail: c <= 1 ? 2 : c <= 4 ? 1 : 0, geo, mesh, ox: NaN, oy: NaN, h: new Float32Array(M * M).fill(NaN), s: new Float32Array(M * M), p: new Float32Array(M * M), hole: '', dirty: true };
    });
  }
  makeMaterial() {
    const t = this.t, g = document.createElement('canvas'); g.width = g.height = 256;
    const ctx = g.getContext('2d'), id = ctx.createImageData(256, 256), r = rng(12345);
    for (let i = 0; i < 256 * 256; i++) { const v = 128 + (r() + r() + r() - 1.5) * 90; id.data[4 * i] = id.data[4 * i + 1] = id.data[4 * i + 2] = clamp(v, 0, 255); id.data[4 * i + 3] = 255; }
    ctx.putImageData(id, 0, 0);
    const grain = new THREE.CanvasTexture(g); grain.wrapS = grain.wrapT = THREE.RepeatWrapping; grain.generateMipmaps = true; grain.minFilter = THREE.LinearMipmapLinearFilter;
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0, vertexColors: true });
    const u = this.uniforms = {
      tLocal: { value: t.texLocal }, tRegional: { value: t.texRegional }, tGrain: { value: grain },
      uLoc: { value: new THREE.Vector4(t.loc.x0, t.loc.y0, t.loc.x1 - t.loc.x0, t.loc.y1 - t.loc.y0) },
      uReg: { value: new THREE.Vector4(t.reg.x0, t.reg.y0, t.reg.x1 - t.reg.x0, t.reg.y1 - t.reg.y0) },
      uGain: { value: new THREE.Vector2(1.0, 1.0) }, uFlat: { value: 0 },
    };
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vW;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvW = position.xy;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
        varying vec2 vW; uniform sampler2D tLocal, tRegional, tGrain; uniform vec4 uLoc, uReg; uniform vec2 uGain; uniform float uFlat;`)
        .replace('#include <map_fragment>', `
        vec2 ul = (vW - uLoc.xy) / uLoc.zw, ur = (vW - uReg.xy) / uReg.zw;
        float wl = smoothstep(0.0, 0.04, min(min(ul.x, 1.0 - ul.x), min(ul.y, 1.0 - ul.y)));
        vec3 photo = mix(texture2D(tRegional, clamp(ur, 0.0, 1.0)).rgb * uGain.y, texture2D(tLocal, clamp(ul, 0.0, 1.0)).rgb * uGain.x, wl);
        float dist = length(vViewPosition);
        // The photo's light and dark are mostly shading. Close up the relief is modelled, so the photo is used faintly and the
        // geometry does the shading; far away, where the mesh is coarse, the photo carries the detail.
        vec3 alb = mix(vec3(0.235), photo, mix(0.22, 0.9, smoothstep(25.0, 400.0, dist)));
        // fine grain (predicted appearance below the 0.5 m photo pixel); fades with distance
        float gr = texture2D(tGrain, vW * 1.7).r * 0.6 + texture2D(tGrain, vW * 0.23).r * 0.4;
        alb *= mix(1.0, 0.78 + 0.44 * gr, 1.0 - smoothstep(6.0, 60.0, dist));
        diffuseColor.rgb *= mix(alb, vec3(0.3), uFlat);`);
    };
    return mat;
  }
  setOverlay(on) { this.overlay = on; this.uniforms.uFlat.value = on ? 1 : 0; for (const l of this.levels) l.dirty = true; }
  invalidate(x, y, r) {                                   // heights changed inside a circle: forget cached cells there
    for (const l of this.levels) {
      if (isNaN(l.ox)) continue;
      const i0 = Math.max(0, Math.floor((x - r - l.ox) / l.c)), i1 = Math.min(M - 1, Math.ceil((x + r - l.ox) / l.c) + 2), j0 = Math.max(0, Math.floor((y - r - l.oy) / l.c)), j1 = Math.min(M - 1, Math.ceil((y + r - l.oy) / l.c) + 2);
      if (i0 > i1 || j0 > j1) continue;
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) l.h[j * M + i] = NaN;
      l.dirty = true;
    }
  }
  /* cache index (i, j) of level l is the lattice point (ox + (i-1) c, oy + (j-1) c) */
  fill(l) {
    const t = this.t, h = l.h, c = l.c;
    for (let j = 0; j < M; j++) for (let i = 0; i < M; i++) {
      const k = j * M + i; if (h[k] === h[k]) continue;
      h[k] = t.height(l.ox + (i - 1) * c, l.oy + (j - 1) * c, l.detail); l.s[k] = t.partS; l.p[k] = t.partP;
    }
  }
  update(cx, cy) {
    const Ls = this.levels;
    for (let q = Ls.length - 1; q >= 0; q--) {            // coarse to fine
      const l = Ls[q], snap = 4 * l.c, ox = Math.round(cx / snap) * snap - N / 2 * l.c, oy = Math.round(cy / snap) * snap - N / 2 * l.c;
      if (ox !== l.ox || oy !== l.oy) {
        const nh = new Float32Array(M * M).fill(NaN), ns = new Float32Array(M * M), np = new Float32Array(M * M);
        if (!isNaN(l.ox)) {
          const di = Math.round((ox - l.ox) / l.c), dj = Math.round((oy - l.oy) / l.c);
          for (let j = 0; j < M; j++) { const sj = j + dj; if (sj < 0 || sj >= M) continue;
            for (let i = 0; i < M; i++) { const si = i + di; if (si < 0 || si >= M) continue; const a = j * M + i, b = sj * M + si; nh[a] = l.h[b]; ns[a] = l.s[b]; np[a] = l.p[b]; } }
        }
        l.h = nh; l.s = ns; l.p = np; l.ox = ox; l.oy = oy; l.dirty = true;
        if (q + 1 < Ls.length) Ls[q + 1].holeDirty = true;
        if (q > 0) Ls[q - 1].dirty = true;                // its edge is tied to this level
      }
      if (l.dirty) { this.fill(l); this.write(l, q + 1 < Ls.length ? Ls[q + 1] : null); l.dirty = false; if (q > 0) Ls[q - 1].dirty = true; }
    }
    for (let q = 1; q < Ls.length; q++) {                 // cut the finer level's footprint out of each coarser one
      const l = Ls[q], f = Ls[q - 1], hx = Math.round((f.ox - l.ox) / l.c), hy = Math.round((f.oy - l.oy) / l.c), key = hx + ',' + hy;
      if (key !== l.hole) { l.hole = key; this.index(l, hx, hy, N / 4); }
    }
    if (Ls[0].hole !== 'full') { Ls[0].hole = 'full'; this.index(Ls[0], -1, -1, 0); }
  }
  index(l, hx, hy, hn) {
    const ix = l.geo.index.array; let n = 0;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      if (i >= hx && i < hx + hn && j >= hy && j < hy + hn) continue;
      const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
      ix[n++] = a; ix[n++] = b; ix[n++] = d; ix[n++] = a; ix[n++] = d; ix[n++] = c;
    }
    l.geo.setDrawRange(0, n); l.geo.index.needsUpdate = true;
  }
  write(l, coarse) {
    const P = l.geo.attributes.position.array, Nn = l.geo.attributes.normal.array, C = l.geo.attributes.color.array, h = l.h, c = l.c, ov = this.overlay;
    let v = 0;
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++, v += 3) {
      const k = (j + 1) * M + i + 1; let z = h[k];
      if (coarse && (i === 0 || i === N || j === 0 || j === N)) {     // edge: follow the coarser level exactly, so there are no cracks
        const x = l.ox + i * c, y = l.oy + j * c, fx = (x - coarse.ox) / coarse.c + 1, fy = (y - coarse.oy) / coarse.c + 1;
        const ix = Math.min(Math.floor(fx + 1e-6), M - 2), iy = Math.min(Math.floor(fy + 1e-6), M - 2), tx = fx - ix, ty = fy - iy, o = iy * M + ix, H = coarse.h;
        z = (H[o] * (1 - tx) + H[o + 1] * tx) * (1 - ty) + (H[o + M] * (1 - tx) + H[o + M + 1] * tx) * ty;
      }
      P[v] = l.ox + i * c; P[v + 1] = l.oy + j * c; P[v + 2] = z;
      const nx = (h[k - 1] - h[k + 1]) / (2 * c), ny = (h[k - M] - h[k + M]) / (2 * c), inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
      Nn[v] = nx * inv; Nn[v + 1] = ny * inv; Nn[v + 2] = inv;
      if (ov) {                                           // what the shape here is made of: grey measured, cyan inferred, orange predicted
        const s = Math.min(1, Math.abs(l.s[k]) / 0.12), p = Math.min(1, Math.abs(l.p[k]) / 0.05);
        C[v] = 1 - 0.75 * s + 0.6 * p; C[v + 1] = 1 + 0.25 * s - 0.25 * p; C[v + 2] = 1 + 0.45 * s - 0.85 * p;
      } else { C[v] = C[v + 1] = C[v + 2] = 1; }
    }
    l.geo.attributes.position.needsUpdate = l.geo.attributes.normal.needsUpdate = l.geo.attributes.color.needsUpdate = true;
  }
  /* ground height as drawn (bilinear on the finest grid that contains the point) — used by the physics */
  ground(x, y) {
    for (const l of this.levels) {
      const fx = (x - l.ox) / l.c + 1, fy = (y - l.oy) / l.c + 1;
      if (!(fx >= 1 && fy >= 1 && fx < N + 1 && fy < N + 1)) continue;
      const ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy, o = iy * M + ix, H = l.h;
      const a = H[o], b = H[o + 1], cc = H[o + M], d = H[o + M + 1];
      if (a !== a || b !== b || cc !== cc || d !== d) break;
      return (a * (1 - tx) + b * tx) * (1 - ty) + (cc * (1 - tx) + d * tx) * ty;
    }
    return this.t.height(x, y, 2);
  }
  normal(x, y, out, e = 0.15) {
    const gx = (this.ground(x + e, y) - this.ground(x - e, y)) / (2 * e), gy = (this.ground(x, y + e) - this.ground(x, y - e)) / (2 * e);
    return out.set(-gx, -gy, 1).normalize();
  }
}
