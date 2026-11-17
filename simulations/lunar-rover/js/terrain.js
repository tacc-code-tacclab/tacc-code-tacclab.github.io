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
const wrap180 = d => ((d + 180) % 360 + 360) % 360 - 180;
export { wrap180 };
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/* ---- the rules behind the predicted layer. Values are quoted from the literature from memory and
        should be checked against the sources before being cited. ---- */
export const RULES = {
  craterEquilibrium: { a: Math.pow(10, -1.1), b: -2, note: 'N(>D) = 10^-1.1 D^-2 per m² (D in m): equilibrium population of small mare craters (Trask 1966)' },
  craterMaxD: 3.0,       // m, inside the 0.5 m photo: larger craters are visible in it, so they must come from the data, not from prediction
  craterMaxDfar: 150,    // m, outside the photo, where the elevation data only resolve craters above ~250 m; equilibrium holds up to ~150 m on mare of this age
  craterMaxDwide: 1500,  // m, where only the 474 m/px elevation exists
  craterMaxDglobal: 8192, // m, where only the global elevation (3.8 km/px here) exists
  bigCraters: { eq: 150, slope: -1.2, highland: 0.6, note: 'above 150 m craters are no longer in equilibrium: on mare their number falls off as (D/150 m)^-1.2 relative to the equilibrium law (production slope about -3.2); on bright highland 0.6 of equilibrium is kept' },
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
    const L = tier('local'), Rg = tier('regional'), Wd = tier('wide'), Gl = tier('global');
    this.site = { lat: man.lat, lon: man.lon }; this.bounds = { loc: L.bounds, reg: Rg.bounds, wid: Wd.bounds };
    this.dug = []; this.dugGrid = new Map(); this.setAnchor(man.lat, man.lon);
    onStep('measured elevation (NAC DTM, 2 m)');
    this.dem = await png16(A + L.dem.file); this.demMin = L.dem.h_min; this.demScale = L.dem.h_scale;
    onStep('regional elevation');
    this.rdem = await png16(A + Rg.dem.file); this.rMin = Rg.dem.h_min; this.rScale = Rg.dem.h_scale;
    this.wdem = await png16(A + Wd.dem.file); this.wMin = Wd.dem.h_min; this.wScale = Wd.dem.h_scale;
    onStep('relief inferred from shading');
    this.sfsMeta = await (await fetch('data/apollo11_sfs.json', { cache: 'no-cache' })).json();
    this.sfs = await png8('data/apollo11_sfs.png');
    onStep('real photographs (LROC NAC 0.5 m)');
    const aniso = 8;
    this.texLocal = await loadTex(A + L.image.file, aniso);
    this.texRegional = await loadTex(A + Rg.image.file, aniso);
    this.texWide = await loadTex(A + Wd.image.file, aniso);
    onStep('the whole Moon');
    this.texGlobal = await loadTex(A + Gl.image.file, aniso); this.texGlobal.wrapS = THREE.RepeatWrapping;
    { const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(this.texGlobal.image, 0, 0, 1024, 512);
      const px = g.getImageData(0, 0, 1024, 512).data, d = new Uint8Array(1024 * 512); for (let i = 0; i < d.length; i++) d[i] = (px[4 * i] * 0.3 + px[4 * i + 1] * 0.59 + px[4 * i + 2] * 0.11) | 0; this.lum = { w: 1024, h: 512, d }; }
    const gm = await (await fetch('data/global_dem_half.json', { cache: 'no-cache' })).json();
    this.gdem = await png16('data/' + gm.file); this.gMin = gm.h_min; this.gScale = gm.h_scale;
    this.h0 = 0; this.regOff = 0; this.wOff = 0; this.gOff = 0;
    { // the regional DEM is another data set: remove its mean offset to the NAC DTM over the 2 km tile, so the join is smooth
      let sum = 0, n = 0; const l = this.loc;
      for (let j = 1; j < 16; j++) for (let i = 1; i < 16; i++) { const x = l.x0 + (l.x1 - l.x0) * i / 16, y = l.y0 + (l.y1 - l.y0) * j / 16; sum += this.localH(x, y) - this.regionalH(x, y); n++; }
      this.regOff = sum / n;
      sum = 0; n = 0; const g = this.reg;
      for (let j = 1; j < 16; j++) for (let i = 1; i < 16; i++) { const x = g.x0 + (g.x1 - g.x0) * i / 16, y = g.y0 + (g.y1 - g.y0) * j / 16; sum += this.regionalH(x, y) - this.wideH(x, y); n++; }
      this.wOff = sum / n;
      sum = 0; n = 0; const w = this.wid;
      for (let j = 2; j < 15; j++) for (let i = 2; i < 15; i++) { const x = w.x0 + (w.x1 - w.x0) * i / 16, y = w.y0 + (w.y1 - w.y0) * j / 16; sum += this.wideH(x, y) - this.globalH(x, y); n++; }
      this.gOff = sum / n;
    }
    this.h0 = this.measured(0, 0);                        // heights are relative to the ground at the landing site
    return this;
  }

  /* The world is a flat map (x east, y north, metres) around an anchor point on the Moon. Flying far away moves the anchor.
     Predicted features are tied to Moon-fixed coordinates (x + ax, y + ay), so they stay put when the anchor moves
     within the same latitude band. */
  setAnchor(lat, lon) {
    const s = this.site, near = Math.hypot((lat - s.lat) * D2R * R_MOON, wrap180(lon - s.lon) * D2R * R_MOON * Math.cos(s.lat * D2R)) < 40000;
    if (near) { lat = s.lat; lon = s.lon; } else lat = clamp(Math.round(lat * 2) / 2, -84, 84);     // home region keeps the exact site frame; elsewhere latitude snaps to half degrees
    if (lat === this.lat0 && wrap180(lon) === this.lon0) return false;
    this.lat0 = lat; this.lon0 = wrap180(lon); this.kx = D2R * R_MOON * Math.cos(lat * D2R); this.ky = D2R * R_MOON; this.ax = this.kx * this.lon0; this.ay = this.ky * lat;
    const rect = b => { const x0 = wrap180(b.west - this.lon0) * this.kx; return { x0, x1: x0 + (b.east - b.west) * this.kx, y0: (b.south - lat) * this.ky, y1: (b.north - lat) * this.ky }; };
    this.loc = rect(this.bounds.loc); this.reg = rect(this.bounds.reg); this.wid = rect(this.bounds.wid);
    const p = this.fromLatLon(s.lat, s.lon); this.sx = p[0]; this.sy = p[1];                          // where the Apollo 11 site is on this map
    this.dug.length = 0; this.dugGrid.clear();
    return true;
  }
  toLatLon(x, y) { return [this.lat0 + y / this.ky, wrap180(this.lon0 + x / this.kx)]; }
  fromLatLon(lat, lon) { return [wrap180(lon - this.lon0) * this.kx, (lat - this.lat0) * this.ky]; }
  globalH(x, y) {
    const r = this.gdem, lat = this.lat0 + y / this.ky, lon = this.lon0 + x / this.kx;
    let fx = ((lon + 180) / 360 % 1 + 1) % 1 * r.w - 0.5; const fy = clamp((90 - lat) / 180 * r.h - 0.5, 0, r.h - 1.001);
    if (fx < 0) fx += r.w; const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0, xa = x0 % r.w, xb = (x0 + 1) % r.w, o = y0 * r.w, d = r.d;
    return this.gMin + this.gScale * ((d[o + xa] * (1 - tx) + d[o + xb] * tx) * (1 - ty) + (d[o + r.w + xa] * (1 - tx) + d[o + r.w + xb] * tx) * ty) + this.gOff;
  }
  /* 1 on dark mare, 0 on bright highland, from the brightness of the real global mosaic */
  mareness(X, Y) { const l = this.lum, lat = Y / this.ky, lon = X / this.kx, c = ((Math.floor((lon + 180) / 360 * l.w) % l.w) + l.w) % l.w, r = clamp(Math.floor((90 - lat) / 180 * l.h), 0, l.h - 1); return 1 - smooth(95, 135, l.d[r * l.w + c]); }
  regionWeight(x, y) { const g = this.reg; return smooth(0, 4000, Math.min(x - g.x0, g.x1 - x, y - g.y0, g.y1 - y)); }
  wideWeight(x, y) { const g = this.wid; return smooth(0, 20000, Math.min(x - g.x0, g.x1 - x, y - g.y0, g.y1 - y)); }
  /* MEASURED: metres relative to the landing site */
  localH(x, y) { const l = this.loc; return this.demMin + this.demScale * cubic(this.dem, (x - l.x0) / (l.x1 - l.x0) * this.dem.w - 0.5, (l.y1 - y) / (l.y1 - l.y0) * this.dem.h - 0.5); }
  regionalH(x, y) { const r = this.reg; return this.rMin + this.rScale * bilin(this.rdem, (x - r.x0) / (r.x1 - r.x0) * this.rdem.w - 0.5, (r.y1 - y) / (r.y1 - r.y0) * this.rdem.h - 0.5) + this.regOff; }
  wideH(x, y) { const r = this.wid; return this.wMin + this.wScale * bilin(this.wdem, (x - r.x0) / (r.x1 - r.x0) * this.wdem.w - 0.5, (r.y1 - y) / (r.y1 - r.y0) * this.wdem.h - 0.5) + this.wOff; }
  photoWeight(x, y) { const l = this.loc; return smooth(0, 64, Math.min(x - l.x0, l.x1 - x, y - l.y0, l.y1 - y)); }      // 1 inside the 0.5 m photo
  measured(x, y) {
    const wl = this.photoWeight(x, y);
    if (wl >= 1) return this.localH(x, y) - this.h0;
    const wr = this.regionWeight(x, y); let far;
    if (wr >= 1) far = this.regionalH(x, y);
    else { const ww = this.wideWeight(x, y), out = ww >= 1 ? this.wideH(x, y) : ww <= 0 ? this.globalH(x, y) : this.globalH(x, y) * (1 - ww) + this.wideH(x, y) * ww; far = wr <= 0 ? out : out * (1 - wr) + this.regionalH(x, y) * wr; }
    return (wl > 0 ? far * (1 - wl) + this.localH(x, y) * wl : far) - this.h0;
  }
  /* INFERRED from shading (zero outside the tile and at the descent stage, which is not terrain) */
  inferred(x, y) {
    const l = this.loc;
    if (x <= l.x0 || x >= l.x1 || y <= l.y0 || y >= l.y1) return 0;
    const d2 = (x - this.sx) ** 2 + (y - this.sy) ** 2; if (d2 < 36) return 0;
    const v = this.sfsMeta.h_min + this.sfsMeta.h_scale * cubic(this.sfs, (x - l.x0) / (l.x1 - l.x0) * this.sfs.w - 0.5, (l.y1 - y) / (l.y1 - l.y0) * this.sfs.h - 0.5);
    return d2 < 196 ? v * smooth(36, 196, d2) : v;
  }
  /* PREDICTED: small craters in equilibrium + fine roughness */
  /* c = spacing of the mesh that asks: craters smaller than that are left out (they would only alias) */
  predicted(x, y, c = 0.25) {
    let z = 0;
    const E = RULES.craterEquilibrium, B = RULES.bigCraters, wFar = 1 - this.photoWeight(x, y), wNoReg = wFar > 0 ? 1 - this.regionWeight(x, y) : 0, wNoWide = wNoReg > 0 ? 1 - this.wideWeight(x, y) : 0;
    const maxD = wNoWide > 0 ? RULES.craterMaxDglobal : wNoReg > 0 ? RULES.craterMaxDwide : wFar > 0 ? RULES.craterMaxDfar : RULES.craterMaxD;
    const X = x + this.ax, Y = y + this.ay;                // Moon-fixed map coordinates
    for (let k = 0, D0 = RULES.craterMinD; D0 < maxD; k++, D0 *= 2) {
      if (D0 < c) continue;
      const cell = 4 * D0, cx = Math.floor(X / cell), cy = Math.floor(Y / cell);
      const mean = cell * cell * E.a * (Math.pow(D0, E.b) - Math.pow(2 * D0, E.b));       // craters per cell in this size octave (≈ 0.95)
      const p0 = Math.exp(-mean);
      for (let j = cy - 1; j <= cy + 1; j++) for (let i = cx - 1; i <= cx + 1; i++) {
        const h = hash3(i, j, k), u = (h & 0xFFFF) / 65536;
        let n = 0, p = p0, cc = p; while (u > cc && n < 4) { n++; p *= mean / n; cc += p; }      // Poisson count from one uniform number
        if (!n) continue;
        const rnd = rng(h ^ 0xA5A5A5A5);
        for (let q = 0; q < n; q++) {
          const px = (i + rnd()) * cell, py = (j + rnd()) * cell, Dm = D0 / Math.sqrt(1 - 0.75 * rnd()), age = rnd(), keep = rnd();
          // each size range is only predicted where the data cannot show it
          const wgt = Dm > RULES.craterMaxDwide ? wNoWide : Dm > RULES.craterMaxDfar ? wNoReg : Dm > RULES.craterMaxD ? wFar : 1;
          if (wgt <= 0 || Dm > maxD) continue;
          if (Dm > B.eq) { const m = this.mareness(px, py); if (keep > m * Math.pow(Dm / B.eq, B.slope) + (1 - m) * B.highland) continue; }      // fewer large craters, far fewer on young mare
          const rad = Dm / 2, dx = X - px, dy = Y - py, r2 = (dx * dx + dy * dy) / (rad * rad);
          if (r2 >= 6.25) continue;
          const dd = RULES.craterDepth.min + (RULES.craterDepth.fresh - RULES.craterDepth.min) * age * age;      // most are degraded
          z += wgt * rad * craterZ(Math.sqrt(r2), 2 * dd, 2 * RULES.craterRim * dd / RULES.craterDepth.fresh);
        }
      }
    }
    return c <= 1 ? z + this.rough(X, Y) : z;
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
  /* full height for a mesh of spacing c (0.25 = everything). Parts are left in this.partS / partP */
  height(x, y, c = 0.25) {
    const d = this.measured(x, y), s = c <= 4 ? this.inferred(x, y) : 0, p = c <= 4096 ? this.predicted(x, y, c) : 0, m = this.dug.length ? this.made(x, y) : 0;
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
    const cells = [0.25, 1, 4, 16, 64, 256, 1024, 4096, 16384];
    this.first = 0;
    this.levels = cells.map((c, i) => {
      const geo = new THREE.BufferGeometry(), nv = (N + 1) * (N + 1);
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(nv * 3).fill(1), 3).setUsage(THREE.DynamicDrawUsage));
      geo.setIndex(new THREE.BufferAttribute(new Uint16Array(N * N * 6), 1).setUsage(THREE.DynamicDrawUsage));
      const mesh = new THREE.Mesh(geo, this.mat); mesh.frustumCulled = false; mesh.receiveShadow = true; mesh.castShadow = i < 2 && opts.terrainShadows !== false;
      this.group.add(mesh);
      return { i, c, geo, mesh, ox: NaN, oy: NaN, h: new Float32Array(M * M).fill(NaN), s: new Float32Array(M * M), p: new Float32Array(M * M), hole: '', dirty: true };
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
      tLocal: { value: t.texLocal }, tRegional: { value: t.texRegional }, tWide: { value: t.texWide }, tGlobal: { value: t.texGlobal }, tGrain: { value: grain },
      uA: { value: new THREE.Vector4(t.lon0, t.lat0, t.kx, t.ky) },
      uWid: { value: new THREE.Vector4(t.wid.x0, t.wid.y0, t.wid.x1 - t.wid.x0, t.wid.y1 - t.wid.y0) },
      uLoc: { value: new THREE.Vector4(t.loc.x0, t.loc.y0, t.loc.x1 - t.loc.x0, t.loc.y1 - t.loc.y0) },
      uReg: { value: new THREE.Vector4(t.reg.x0, t.reg.y0, t.reg.x1 - t.reg.x0, t.reg.y1 - t.reg.y0) },
      uGain: { value: new THREE.Vector2(1.0, 1.0) }, uFlat: { value: 0 },
    };
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vW;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvW = position.xy;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
        varying vec2 vW; uniform sampler2D tLocal, tRegional, tWide, tGlobal, tGrain; uniform vec4 uLoc, uReg, uWid, uA; uniform vec2 uGain; uniform float uFlat;`)
        .replace('#include <map_fragment>', `
        vec2 ul = (vW - uLoc.xy) / uLoc.zw, ur = (vW - uReg.xy) / uReg.zw;
        float wl = smoothstep(0.0, 0.04, min(min(ul.x, 1.0 - ul.x), min(ul.y, 1.0 - ul.y)));
        vec2 uw = (vW - uWid.xy) / uWid.zw;
        float wr = smoothstep(0.0, 0.03, min(min(ur.x, 1.0 - ur.x), min(ur.y, 1.0 - ur.y)));
        float ww = smoothstep(0.0, 0.04, min(min(uw.x, 1.0 - uw.x), min(uw.y, 1.0 - uw.y)));
        vec2 ug = vec2((uA.x + vW.x / uA.z + 180.0) / 360.0, (uA.y + vW.y / uA.w + 90.0) / 180.0);            // the whole Moon, by longitude and latitude
        vec3 glob = texture2D(tGlobal, vec2(fract(ug.x), clamp(ug.y, 0.0, 1.0))).rgb;
        vec3 farc = mix(mix(glob, texture2D(tWide, clamp(uw, 0.0, 1.0)).rgb, ww), texture2D(tRegional, clamp(ur, 0.0, 1.0)).rgb, wr) * uGain.y;
        vec3 photo = mix(farc, texture2D(tLocal, clamp(ul, 0.0, 1.0)).rgb * uGain.x, wl);
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
  /* the anchor moved: every cached height is in the old frame */
  reset() {
    const t = this.t, u = this.uniforms;
    for (const l of this.levels) { l.ox = l.oy = NaN; l.h.fill(NaN); l.hole = ''; l.dirty = true; }
    u.uLoc.value.set(t.loc.x0, t.loc.y0, t.loc.x1 - t.loc.x0, t.loc.y1 - t.loc.y0); u.uReg.value.set(t.reg.x0, t.reg.y0, t.reg.x1 - t.reg.x0, t.reg.y1 - t.reg.y0);
    u.uWid.value.set(t.wid.x0, t.wid.y0, t.wid.x1 - t.wid.x0, t.wid.y1 - t.wid.y0); u.uA.value.set(t.lon0, t.lat0, t.kx, t.ky);
  }
  setOverlay(on) { this.overlay = on; this.uniforms.uFlat.value = on ? 1 : 0; for (const l of this.levels) l.dirty = true; }
  invalidate(x, y, r) {                                   // heights changed inside a circle: forget cached cells there
    for (const l of this.levels) {
      if (isNaN(l.ox) || l.i < this.first) continue;
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
      h[k] = t.height(l.ox + (i - 1) * c, l.oy + (j - 1) * c, c); l.s[k] = t.partS; l.p[k] = t.partP;
    }
  }
  /* minCell: finest spacing worth drawing (from high up the fine levels are switched off) */
  update(cx, cy, minCell = 0) {
    const Ls = this.levels; let first = 0; while (first < Ls.length - 3 && Ls[first].c < minCell) first++;
    if (first !== this.first) { this.first = first; for (const l of Ls) { l.mesh.visible = l.i >= first; l.hole = ''; } Ls[first].dirty = true; }
    for (let q = Ls.length - 1; q >= first; q--) {        // coarse to fine
      const l = Ls[q], snap = 4 * l.c, ox = Math.round(cx / snap) * snap - N / 2 * l.c, oy = Math.round(cy / snap) * snap - N / 2 * l.c;
      if (ox !== l.ox || oy !== l.oy) {
        const nh = new Float32Array(M * M).fill(NaN), ns = new Float32Array(M * M), np = new Float32Array(M * M);
        if (!isNaN(l.ox)) {
          const di = Math.round((ox - l.ox) / l.c), dj = Math.round((oy - l.oy) / l.c);
          if (Math.abs(di) < M && Math.abs(dj) < M) for (let j = 0; j < M; j++) { const sj = j + dj; if (sj < 0 || sj >= M) continue;
            for (let i = 0; i < M; i++) { const si = i + di; if (si < 0 || si >= M) continue; const a = j * M + i, b = sj * M + si; nh[a] = l.h[b]; ns[a] = l.s[b]; np[a] = l.p[b]; } }
        }
        l.h = nh; l.s = ns; l.p = np; l.ox = ox; l.oy = oy; l.dirty = true;
        if (q + 1 < Ls.length) Ls[q + 1].hole = '';
      }
      if (l.dirty) { this.fill(l); this.write(l, q + 1 < Ls.length ? Ls[q + 1] : null); l.dirty = false; if (q > first) Ls[q - 1].dirty = true; }
    }
    for (let q = first + 1; q < Ls.length; q++) {         // cut the finer level's footprint out of each coarser one
      const l = Ls[q], f = Ls[q - 1], hx = Math.round((f.ox - l.ox) / l.c), hy = Math.round((f.oy - l.oy) / l.c), key = hx + ',' + hy;
      if (key !== l.hole) { l.hole = key; this.index(l, hx, hy, N / 4); }
    }
    if (Ls[first].hole !== 'full') { Ls[first].hole = 'full'; this.index(Ls[first], -1, -1, 0); }
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
      if (l.i < this.first) continue;
      const fx = (x - l.ox) / l.c + 1, fy = (y - l.oy) / l.c + 1;
      if (!(fx >= 1 && fy >= 1 && fx < N + 1 && fy < N + 1)) continue;
      const ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy, o = iy * M + ix, H = l.h;
      const a = H[o], b = H[o + 1], cc = H[o + M], d = H[o + M + 1];
      if (a !== a || b !== b || cc !== cc || d !== d) break;
      return (a * (1 - tx) + b * tx) * (1 - ty) + (cc * (1 - tx) + d * tx) * ty;
    }
    return this.t.height(x, y, 0.25);
  }
  normal(x, y, out, e = 0.15) {
    const gx = (this.ground(x + e, y) - this.ground(x - e, y)) / (2 * e), gy = (this.ground(x, y + e) - this.ground(x, y - e)) / (2 * e);
    return out.set(-gx, -gy, 1).normalize();
  }
}
