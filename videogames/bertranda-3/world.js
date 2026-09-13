(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BertrandaWorld = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const CELL = 4, CHUNK = 16, SIZE = CELL * CHUNK;
  const KINDS = ["house", "forest", "cemetery", "catacombs", "hell"];
  const mod = (n, d) => ((n % d) + d) % d;
  function hash(x, z, seed) {
    let n = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
    n = Math.imul(n ^ n >>> 13, 1274126177);
    return ((n ^ n >>> 16) >>> 0) / 4294967296;
  }
  function noise(x, z, seed) {
    const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
    const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
    const a = hash(ix, iz, seed), b = hash(ix + 1, iz, seed), c = hash(ix, iz + 1, seed), d = hash(ix + 1, iz + 1, seed);
    return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
  }
  function fractal(x, z, seed) {
    return noise(x, z, seed) * 0.57 + noise(x * 2, z * 2, seed + 7) * 0.28 + noise(x * 4, z * 4, seed + 19) * 0.15;
  }
  function generateChunk(schema, cx, cz, seed = 73129) {
    const kind = KINDS[mod(schema - 1, 5)], cells = new Uint8Array(CHUNK * CHUNK);
    const salt = seed + schema * 197;
    let count = 0;
    const random = () => hash(cx * 317 + count++, cz * 719, salt);
    const put = (x, z, value) => { if (x >= 0 && z >= 0 && x < CHUNK && z < CHUNK) cells[z * CHUNK + x] = value; };
    if (kind === "house") {
      // Recursive room subdivision with two-cell doors, never a closed arena.
      for (let i = 0; i < CHUNK; i++) { put(i, 0, 1); put(i, 15, 1); put(0, i, 1); put(15, i, 1); }
      const split = (x1, z1, x2, z2, depth) => {
        if (!depth || x2 - x1 < 5 || z2 - z1 < 5) return;
        const vertical = x2 - x1 > z2 - z1 || random() > 0.5;
        if (vertical) {
          const x = x1 + 2 + Math.floor(random() * (x2 - x1 - 3));
          const door = z1 + Math.floor(random() * (z2 - z1));
          for (let z = z1; z <= z2; z++) if (z !== door && z !== door + 1) put(x, z, 1);
          split(x1, z1, x - 1, z2, depth - 1); split(x + 1, z1, x2, z2, depth - 1);
        } else {
          const z = z1 + 2 + Math.floor(random() * (z2 - z1 - 3));
          const door = x1 + Math.floor(random() * (x2 - x1));
          for (let x = x1; x <= x2; x++) if (x !== door && x !== door + 1) put(x, z, 1);
          split(x1, z1, x2, z - 1, depth - 1); split(x1, z + 1, x2, z2, depth - 1);
        }
      };
      split(1, 1, 14, 14, 4);
    } else if (kind === "catacombs") {
      cells.fill(1);
      const stack = [[1, 1]]; put(1, 1, 0);
      while (stack.length) {
        const [x, z] = stack[stack.length - 1];
        const options = [[2, 0], [-2, 0], [0, 2], [0, -2]].filter(([dx, dz]) => x + dx > 0 && z + dz > 0 && x + dx < 15 && z + dz < 15 && cells[(z + dz) * CHUNK + x + dx]);
        if (!options.length) { stack.pop(); continue; }
        const [dx, dz] = options[Math.floor(random() * options.length)];
        put(x + dx / 2, z + dz / 2, 0); put(x + dx, z + dz, 0); stack.push([x + dx, z + dz]);
      }
      // Burial chambers interrupt the narrow, branching corridors.
      for (let i = 0; i < 3; i++) {
        const x = 2 + Math.floor(random() * 9), z = 2 + Math.floor(random() * 9);
        for (let dz = 0; dz < 3; dz++) for (let dx = 0; dx < 3; dx++) put(x + dx, z + dz, 0);
      }
    } else {
      for (let z = 0; z < CHUNK; z++) for (let x = 0; x < CHUNK; x++) {
        const wx = cx * CHUNK + x, wz = cz * CHUNK + z;
        const n = fractal(wx * 0.16, wz * 0.16, salt);
        if (kind === "forest") put(x, z, n > 0.6 || hash(wx, wz, salt) < 0.14 ? 1 : 0);
        if (kind === "cemetery") put(x, z, mod(wx, 3) === 1 && mod(wz, 3) !== 0 && hash(wx, wz, salt) > 0.2 ? 1 : 0);
        if (kind === "hell") put(x, z, n < 0.45 ? 2 : 0);
      }
    }
    // Shared edge portals guarantee seamless connections, including negatives.
    // Each chunk has an accessible central clearing and four broad routes out.
    for (let i = 0; i < CHUNK; i++) for (let lane = 7; lane <= 9; lane++) { put(i, lane, 0); put(lane, i, 0); }
    for (let z = 5; z <= 10; z++) for (let x = 5; x <= 10; x++) put(x, z, 0);
    // Connect isolated islands/rooms with branches to the shared route network.
    const seen = new Uint8Array(256), queue = new Uint16Array(256);
    const flood = (start) => {
      let head = 0, tail = 1; queue[0] = start; seen[start] = 1;
      while (head < tail) {
        const at = queue[head++], ax = at % CHUNK, az = Math.floor(at / CHUNK);
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const x = ax + dx, z = az + dz, to = z * CHUNK + x;
          if (x < 0 || z < 0 || x >= CHUNK || z >= CHUNK || cells[to] || seen[to]) continue;
          seen[to] = 1; queue[tail++] = to;
        }
      }
    };
    flood(8 * CHUNK + 8);
    for (let i = 0; i < 256; i++) if (!cells[i] && !seen[i]) {
      let x = i % CHUNK, z = Math.floor(i / CHUNK);
      while (x !== 8) { put(x, z, 0); x += x < 8 ? 1 : -1; }
      while (z !== 8) { put(x, z, 0); z += z < 8 ? 1 : -1; }
      flood(i);
    }
    return { kind, cx, cz, cells };
  }

  class World {
    constructor(THREE, scene, { touch = false, seed = 73129 } = {}) {
      this.T = THREE; this.scene = scene; this.touch = touch; this.seed = seed;
      this.schema = 1; this.cache = new Map(); this.chunks = new Map(); this.blockers = [];
      this.center = ""; this.pending = []; this.generation = 0;
      this.geometries = {
        box: new THREE.BoxGeometry(1, 1, 1),
        cylinder: new THREE.CylinderGeometry(0.7, 1, 1, 6),
        cone: new THREE.ConeGeometry(1, 1, 6),
        orb: new THREE.IcosahedronGeometry(1, 1),
        skull: new THREE.SphereGeometry(1, 7, 5)
      };
      this.dummy = new THREE.Object3D();
      this.frustum = new THREE.Frustum(); this.projection = new THREE.Matrix4();
    }
    data(cx, cz) {
      const key = cx + "," + cz;
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }
      const value = generateChunk(this.schema, cx, cz, this.seed); this.cache.set(key, value);
      if (this.cache.size > 32) this.cache.delete(this.cache.keys().next().value);
      return value;
    }
    cell(x, z) { return this.data(Math.floor(x / CHUNK), Math.floor(z / CHUNK)).cells[mod(z, CHUNK) * CHUNK + mod(x, CHUNK)]; }
    walkable(x, z) { return this.cell(x, z) === 0; }
    free(x, z, radius = 0.38) {
      const kind = KINDS[mod(this.schema - 1, 5)];
      for (let cz = Math.floor((z - radius) / CELL); cz <= Math.floor((z + radius) / CELL); cz++) {
        for (let cx = Math.floor((x - radius) / CELL); cx <= Math.floor((x + radius) / CELL); cx++) {
          if (!this.cell(cx, cz)) continue;
          const px = (cx + 0.5) * CELL, pz = (cz + 0.5) * CELL;
          if (kind === "forest") { if (Math.hypot(x - px, z - pz) < radius + 0.85) return false; }
          else if (kind === "cemetery") { if (Math.abs(x - px) < radius + 1.3 && Math.abs(z - pz) < radius + 0.9) return false; }
          else return false;
        }
      }
      return true;
    }
    setSchema(schema, cycle) {
      this.clear(); this.schema = schema; this.cache.clear(); this.generation++;
      const T = this.T, kind = KINDS[mod(schema - 1, 5)];
      const colors = {
        house: [0x665844, 0x231b22, 0x40182a, 0xa27f50],
        forest: [0x243f32, 0x30212b, 0x145048, 0x93beb0],
        cemetery: [0x3c514a, 0x6b7882, 0x15292b, 0xa9b8a8],
        catacombs: [0x524236, 0x716458, 0x251c22, 0xc8b899],
        hell: [0x291c2a, 0x261623, 0x641626, 0xd59156]
      }[kind];
      const mat = (color, emissive = 0, intensity = 0) => new T.MeshStandardMaterial({ color, emissive, emissiveIntensity: intensity, roughness: 0.92, flatShading: true });
      const tint = new T.Color(colors[0]).lerp(new T.Color(cycle.accent), 0.1 + Math.floor((schema - 1) / 5) * 0.025);
      this.materials = {
        ground: mat(tint), wall: mat(colors[1]), detail: mat(colors[2]), bone: mat(colors[3]),
        black: mat(0x090d14), metal: mat(0x405962),
        glow: new T.MeshBasicMaterial({ color: cycle.accent }),
        lava: new T.MeshBasicMaterial({ color: 0xff421a }),
        fire: new T.MeshBasicMaterial({ color: 0xffce56 }),
        mist: new T.MeshBasicMaterial({ color: cycle.accent, transparent: true, opacity: 0.35, depthWrite: false })
      };
      this.materials.wall.color.lerp(new T.Color(cycle.accent), 0.1);
      this.center = "";
    }
    clear() {
      for (const chunk of this.chunks.values()) this.removeChunk(chunk);
      this.chunks.clear(); this.blockers.length = 0; this.pending.length = 0;
      if (this.materials) Object.values(this.materials).forEach(material => material.dispose());
    }
    removeChunk(chunk) {
      this.scene.remove(chunk.group);
      // Shared base geometry/materials survive streaming. Instance buffers do not.
      chunk.group.traverse(object => { if (object.isInstancedMesh && object.dispose) object.dispose(); });
    }
    update(x, z, immediate = false) {
      const cx = Math.floor(x / SIZE), cz = Math.floor(z / SIZE), center = cx + "," + cz;
      if (center !== this.center) {
        this.center = center;
        for (const [key, chunk] of this.chunks) {
          if (Math.abs(chunk.cx - cx) > 1 || Math.abs(chunk.cz - cz) > 1) { this.removeChunk(chunk); this.chunks.delete(key); }
        }
        this.pending = [];
        for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
          if (!this.chunks.has((cx + dx) + "," + (cz + dz))) this.pending.push({ cx: cx + dx, cz: cz + dz, distance: Math.abs(dx) + Math.abs(dz) });
        }
        this.pending.sort((a, b) => a.distance - b.distance);
      }
      const budget = immediate ? 9 : 1;
      for (let i = 0; i < budget && this.pending.length; i++) {
        const next = this.pending.shift();
        this.chunks.set(next.cx + "," + next.cz, this.buildChunk(this.data(next.cx, next.cz)));
      }
      this.blockers.length = 0;
      this.chunks.forEach(chunk => this.blockers.push(...chunk.blockers));
    }
    animate(time) {
      if (!this.materials) return;
      this.materials.lava.color.setHSL(0.035 + Math.sin(time * 1.8) * 0.012, 1, 0.48);
      this.materials.mist.opacity = 0.29 + Math.sin(time * 1.6) * 0.08;
    }
    cull(camera) {
      camera.updateMatrixWorld(true);
      this.projection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      this.frustum.setFromProjectionMatrix(this.projection);
      this.chunks.forEach(chunk => { chunk.group.visible = this.frustum.intersectsSphere(chunk.bounds); });
    }
    buildChunk(data) {
      const T = this.T, { kind, cx, cz } = data, groups = new Map();
      const add = (shape, material, x, y, z, sx, sy, sz, rotation = 0, tilt = 0, blocks = false) => {
        const key = shape + ":" + material + ":" + blocks;
        if (!groups.has(key)) groups.set(key, { shape, material, blocks, entries: [] });
        groups.get(key).entries.push([x, y, z, sx, sy, sz, rotation, tilt]);
      };
      const box = (mat, x, y, z, sx, sy, sz, rot = 0, blocks = false) => add("box", mat, x, y, z, sx, sy, sz, rot, 0, blocks);
      const skull = (x, y, z, scale = 1, rotation = 0) => {
        add("skull", "bone", x, y, z, scale * 0.45, scale * 0.55, scale * 0.4, rotation);
        for (const side of [-1, 1]) add("orb", "black", x + side * scale * 0.17, y + scale * 0.06, z + scale * 0.34, scale * 0.13, scale * 0.14, scale * 0.1);
        box("bone", x, y - scale * 0.45, z + scale * 0.17, scale * 0.52, scale * 0.24, scale * 0.38);
      };
      const tree = (x, z, seed) => {
        const height = 5.6 + seed * 4;
        add("cylinder", "wall", x, height / 2, z, 0.65, height, 0.65, seed, seed * 0.07, true);
        // Self-similar branching silhouette, batched into two draw calls.
        for (let depth = 0; depth < 3; depth++) for (let side = -1; side <= 1; side += 2) {
          const length = 2.4 * Math.pow(0.67, depth), yy = height * (0.58 + depth * 0.14);
          add("cylinder", "wall", x + side * length * 0.47, yy, z + depth * 0.15, 0.15 * (3 - depth), length, 0.15 * (3 - depth), seed * 5, -side * 0.85);
          add("orb", "detail", x + side * length * 0.7, yy + 1, z, 1.8 - depth * 0.25, 1.2, 1.7 - depth * 0.25);
        }
        add("cone", "wall", x, 0.25, z, 1.5, 0.5, 1.5);
      };
      const grave = (x, z, seed) => {
        box("wall", x, 0.18, z, 2.4, 0.36, 1.65);
        box("bone", x, 1.2, z - 0.45, 1.2, 2.2 + seed, 0.42, 0, true);
        add("orb", "bone", x, 2.2 + seed / 2, z - 0.45, 0.6, 0.5, 0.21);
        box("black", x, 1.63, z - 0.2, 0.13, 0.8, 0.06);
        box("black", x, 1.78, z - 0.19, 0.57, 0.13, 0.06);
        box("detail", x, 0.39, z + 0.4, 1.7, 0.06, 1.3);
      };
      box("ground", SIZE / 2, -0.18, SIZE / 2, SIZE, 0.35, SIZE);
      if (kind === "house" || kind === "catacombs") box("wall", SIZE / 2, kind === "house" ? 5.4 : 6.8, SIZE / 2, SIZE, 0.25, SIZE);
      for (let z = 0; z < CHUNK; z++) for (let x = 0; x < CHUNK; x++) {
        const value = data.cells[z * CHUNK + x], px = (x + 0.5) * CELL, pz = (z + 0.5) * CELL;
        const seed = hash(cx * CHUNK + x, cz * CHUNK + z, this.schema + this.seed);
        if (value === 2) {
          box("lava", px, 0.035, pz, CELL, 0.05, CELL);
          if (seed < 0.22) { add("cone", "black", px, 0.5, pz, 1.1, 2.2 + seed * 8, 1.1); add("cone", "fire", px, 1, pz, 0.17, 1.4, 0.17); }
        } else if (value === 1) {
          if (kind === "forest") tree(px, pz, seed);
          else if (kind === "cemetery") grave(px, pz, seed);
          else {
            const h = kind === "house" ? 5.3 : 6.6;
            box("wall", px, h / 2, pz, CELL, h, CELL, 0, true);
            if (kind === "house") {
              for (const side of [-1, 1]) {
                box("bone", px, 0.35, pz + side * 2.025, 4, 0.18, 0.07);
                box("detail", px, 2.8, pz + side * 2.026, 2.3, 2.7, 0.05);
                box("metal", px, 2.8, pz + side * 2.065, 0.13, 2.7, 0.055);
                box("metal", px, 2.8, pz + side * 2.07, 2.3, 0.12, 0.055);
              }
            } else if (seed > 0.58) {
              // Ossuary alcoves and skulls on both faces of the stone corridors.
              for (const side of [-1, 1]) {
                box("black", px, 2.15, pz + side * 2.04, 2.5, 1.8, 0.06);
                skull(px - 0.55, 1.85, pz + side * 2.2, 0.8); skull(px + 0.55, 1.85, pz + side * 2.2, 0.8);
              }
            }
          }
        } else if (kind === "house") {
          if (seed < 0.32) box("detail", px, 0.01, pz, 3.1, 0.025, 3.8);
          // Decorative furniture stays outside the broad routes and cell centre.
          if (seed > 0.91 && (x < 6 || x > 10) && (z < 6 || z > 10)) {
            box("bone", px - 1.35, 0.85, pz - 1.35, 1.05, 0.14, 1.05);
            for (const sx of [-1, 1]) for (const sz of [-1, 1]) box("wall", px - 1.35 + sx * 0.4, 0.4, pz - 1.35 + sz * 0.4, 0.1, 0.8, 0.1);
          }
        } else if (kind === "forest" && seed < 0.22) {
          add("cone", "detail", px - 1.4, 0.35, pz - 1.4, 0.4, 0.7, 0.4);
          add("orb", "glow", px - 1.4, 0.57, pz - 1.4, 0.33, 0.12, 0.33);
          if (seed < 0.07) { add("orb", "mist", px, 2.6, pz, 0.45, 1, 0.45); add("orb", "glow", px, 3.1, pz, 0.19, 0.23, 0.19); }
        } else if (kind === "cemetery" && seed < 0.18) box("detail", px, 0.025, pz, 3.5, 0.04, 3.5);
        else if (kind === "hell" && seed < 0.12) {
          add("cone", "black", px - 1.4, 1.6, pz - 1.4, 0.65, 3.2, 0.65);
          add("orb", "fire", px - 1.4, 3.4, pz - 1.4, 0.19, 0.45, 0.19);
        }
      }
      // A different landmark in every biome: a recognisable place, not recoloured walls.
      const lx = 24, lz = 24;
      if (kind === "house") {
        box("detail", 32, 0.02, 32, 10, 0.04, 8);
        add("cylinder", "metal", 32, 4.4, 32, 0.05, 1.5, 0.05);
        for (const side of [-1, 1]) { box("metal", 32 + side, 3.9, 32, 2, 0.1, 0.12); add("orb", "glow", 32 + side * 1.8, 4.2, 32, 0.15, 0.36, 0.15); }
      } else if (kind === "forest") {
        for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; add("cone", "bone", 32 + Math.cos(a) * 5, 0.6, 32 + Math.sin(a) * 5, 0.42, 1.2, 0.42); }
        add("orb", "mist", 32, 7, 32, 3.8, 0.8, 3.8);
      } else if (kind === "cemetery") {
        // Open mausoleum, with a walkable doorway and a peaked roof.
        for (const side of [-1, 1]) { box("wall", lx + side * 2, 2.2, lz, 0.65, 4.4, 4); add("cylinder", "bone", lx + side * 1.8, 2.1, lz + 2, 0.36, 4.2, 0.36); }
        box("bone", lx, 4.5, lz, 5.6, 0.4, 5.1); add("cone", "wall", lx, 5.6, lz, 3.4, 2, 3.4, Math.PI / 4);
        box("glow", lx, 3.8, lz + 2.2, 0.16, 1.3, 0.09); box("glow", lx, 4, lz + 2.2, 0.85, 0.14, 0.09);
      } else if (kind === "catacombs") {
        for (const side of [-1, 1]) add("cylinder", "bone", 32 + side * 4.5, 2.8, 32, 0.5, 5.6, 0.5);
        box("bone", 32, 5.7, 32, 10, 0.5, 0.8); skull(32, 5.1, 32.1, 1.6);
        box("black", 24, 0.4, 24, 2.3, 0.8, 3.8); skull(24, 1.3, 24, 1.2);
      } else {
        box("black", lx, 0.45, lz, 5, 0.9, 5);
        add("orb", "detail", lx, 2.5, lz, 1.1, 1.6, 0.8); skull(lx, 4.1, lz + 0.1, 1.5);
        for (const side of [-1, 1]) { add("cone", "bone", lx + side * 0.7, 5, lz, 0.22, 1.6, 0.22, 0, -side * 0.4); add("cone", "detail", lx + side * 1.5, 3, lz - 0.4, 1.1, 3.4, 0.25, 0, -side * 0.55); }
        add("orb", "lava", 32, 14, 32, 3.5, 3.5, 3.5);
      }
      const group = new T.Group(), blockers = [];
      group.position.set(cx * SIZE, 0, cz * SIZE);
      for (const batch of groups.values()) {
        const mesh = new T.InstancedMesh(this.geometries[batch.shape], this.materials[batch.material], batch.entries.length);
        for (let i = 0; i < batch.entries.length; i++) {
          const [x, y, z, sx, sy, sz, rot, tilt] = batch.entries[i];
          this.dummy.position.set(x, y, z); this.dummy.scale.set(sx, sy, sz); this.dummy.rotation.set(0, rot, tilt); this.dummy.updateMatrix();
          mesh.setMatrixAt(i, this.dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        // r128 culls against the base geometry, not the instance extents.
        mesh.frustumCulled = false;
        group.add(mesh); if (batch.blocks) blockers.push(mesh);
      }
      this.scene.add(group); group.updateMatrixWorld(true);
      return { group, blockers, cx, cz, bounds: new T.Sphere(new T.Vector3(cx * SIZE + SIZE / 2, 6, cz * SIZE + SIZE / 2), 48) };
    }
  }
  return { World, generateChunk, hash, noise, fractal, KINDS, CELL, CHUNK, SIZE };
});
