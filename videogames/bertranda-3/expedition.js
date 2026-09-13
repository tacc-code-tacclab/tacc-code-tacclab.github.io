(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BertrandaExpedition = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const CELL = 4;
  const cell = p => ({ x: Math.floor(p.x / CELL), z: Math.floor(p.z / CELL) });
  const point = p => ({ x: (p.x + 0.5) * CELL, z: (p.z + 0.5) * CELL });
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // A bounded search independent of enemy navigation: opening the map never
  // invalidates the swarm's shared paths or scans the entire endless world.
  function survey(world, position, radius = 32) {
    let start = cell(position);
    if (!world.walkable(start.x, start.z)) {
      let nearest, distance = Infinity;
      for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) {
        const candidate = { x: start.x + dx, z: start.z + dz }, p = point(candidate);
        const d = Math.hypot(p.x - position.x, p.z - position.z);
        if (world.walkable(candidate.x, candidate.z) && d < distance) { nearest = candidate; distance = d; }
      }
      if (nearest) start = nearest;
    }
    const size = radius * 2 + 1, ox = start.x - radius, oz = start.z - radius;
    const previous = new Int16Array(size * size), depth = new Int16Array(size * size), queue = new Int16Array(size * size);
    previous.fill(-1);
    const root = radius * size + radius;
    let head = 0, tail = 1;
    queue[0] = root; previous[root] = root;
    while (head < tail) {
      const at = queue[head++], x = at % size, z = Math.floor(at / size);
      for (const [dx, dz] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const nx = x + dx, nz = z + dz, to = nz * size + nx;
        if (nx < 0 || nz < 0 || nx >= size || nz >= size || previous[to] !== -1) continue;
        if (!world.walkable(nx + ox, nz + oz)) continue;
        previous[to] = at; depth[to] = depth[at] + 1; queue[tail++] = to;
      }
    }
    return { previous, depth, queue, count: tail, root, size, ox, oz, start };
  }

  function trace(field, destination) {
    const x = destination.x - field.ox, z = destination.z - field.oz;
    if (x < 0 || z < 0 || x >= field.size || z >= field.size) return [];
    let at = z * field.size + x;
    if (field.previous[at] < 0) return [];
    const path = [];
    for (let i = 0; i < field.previous.length; i++) {
      path.push(point({ x: at % field.size + field.ox, z: Math.floor(at / field.size) + field.oz }));
      if (at === field.root) return path.reverse();
      at = field.previous[at];
    }
    return [];
  }

  function chooseBulletSite(world, origin) {
    const field = survey(world, origin, 24), candidates = [];
    for (let i = 1; i < field.count; i++) {
      const at = field.queue[i], steps = field.depth[at];
      const destination = { x: at % field.size + field.ox, z: Math.floor(at / field.size) + field.oz };
      const p = point(destination), distance = Math.hypot(p.x - origin.x, p.z - origin.z);
      if (steps >= 22 && steps <= 34 && distance >= 52 && distance <= 96 && world.free(p.x, p.z, 0.7)) candidates.push(destination);
    }
    // Reachability is established by the flood, rather than guessed from air distance.
    const fallback = field.queue[field.count - 1];
    const destination = candidates.length
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : { x: fallback % field.size + field.ox, z: Math.floor(fallback / field.size) + field.oz };
    return { ...point(destination), route: trace(field, destination) };
  }

  function findRoute(world, origin, destination) {
    const field = survey(world, origin), target = cell(destination);
    let goal = target;
    if (Math.max(Math.abs(target.x - field.start.x), Math.abs(target.z - field.start.z)) > 24) {
      // Far away? Follow a neighbouring sector's shared corridor toward the
      // marker. This also guides a player who deliberately wanders off course.
      const cx = Math.floor(field.start.x / 16) * 16 + 8, cz = Math.floor(field.start.z / 16) * 16 + 8;
      goal = Math.abs(target.x - cx) > Math.abs(target.z - cz)
        ? { x: cx + Math.sign(target.x - cx) * 16, z: cz }
        : { x: cx, z: cz + Math.sign(target.z - cz) * 16 };
    }
    const route = trace(field, goal);
    let distance = 0, last = origin;
    for (const p of route) { distance += Math.hypot(p.x - last.x, p.z - last.z); last = p; }
    distance += Math.hypot(destination.x - last.x, destination.z - last.z);
    return { route, distance, partial: goal !== target };
  }

  function bearingAngle(origin, destination, yaw) {
    const angle = Math.atan2(-(destination.x - origin.x), -(destination.z - origin.z)) - yaw;
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  function bearingArrow(origin, destination, yaw) {
    const angle = bearingAngle(origin, destination, yaw);
    return ["↑", "↖", "←", "↙", "↓", "↘", "→", "↗"][(Math.round(angle / (Math.PI / 4)) % 8 + 8) % 8];
  }

  function routeWaypoint(world, route, origin, destination) {
    // Reuse the map's bounded route. A short look-ahead avoids jitter at each
    // tile, but only when the player's full collision radius clears the corner.
    const reachable = p => {
      const distance = Math.hypot(p.x - origin.x, p.z - origin.z);
      if (distance > CELL * 3) return false;
      const steps = Math.max(1, Math.ceil(distance / 0.4));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        if (!world.free(origin.x + (p.x - origin.x) * t, origin.z + (p.z - origin.z) * t, 0.38)) return false;
      }
      return true;
    };
    if (reachable(destination)) return destination;
    let nearest = 0, distance = Infinity;
    route.forEach((p, index) => {
      const d = Math.hypot(p.x - origin.x, p.z - origin.z);
      if (d < distance) { distance = d; nearest = index; }
    });
    for (let i = Math.min(nearest + 3, route.length - 1); i >= Math.max(0, nearest - 1); i--) {
      if (Math.hypot(route[i].x - origin.x, route[i].z - origin.z) > 0.65 && reachable(route[i])) return route[i];
    }
    return null;
  }

  class ScoutMap {
    constructor(canvas) {
      this.canvas = canvas; this.context = canvas.getContext("2d"); this.reset();
    }
    reset() { this.key = ""; this.nextSurvey = 0; this.nextDraw = 0; this.route = []; this.distance = 0; this.partial = false; }
    update(world, player, target, boss, enemies, now, visible, gold) {
      const from = cell(player), to = cell(target), key = [gold, from.x, from.z, to.x, to.z, world.generation].join(":");
      if (!gold) {
        // The monster is a marker only. No route is searched or retained after
        // collection, even while the player keeps the map closed.
        this.route = []; this.partial = false;
        this.distance = Math.hypot(target.x - player.x, target.z - player.z);
        this.key = key; this.nextSurvey = 0;
      } else if (key !== this.key && now >= this.nextSurvey) {
        Object.assign(this, findRoute(world, player, target));
        this.key = key; this.nextSurvey = now + 0.5;
      }
      if (!visible || !this.context || now < this.nextDraw) return;
      this.nextDraw = now + 0.2;
      this.draw(world, player, target, boss, enemies, gold, now);
    }
    draw(world, player, target, boss, enemies, gold, now = 0) {
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const pixels = Math.min(1.5, 480 / rect.width);
        const width = Math.round(rect.width * pixels), height = Math.round(rect.height * pixels);
        if (this.canvas.width !== width) this.canvas.width = width;
        if (this.canvas.height !== height) this.canvas.height = height;
      }
      const ctx = this.context, w = this.canvas.width, h = this.canvas.height, aspect = w / h;
      const near = Math.hypot(target.x - player.x, target.z - player.z) < 130;
      const points = gold ? [player, ...this.route] : [player];
      if ((gold && !this.partial) || (!gold && near)) points.push(target);
      const minX = Math.min(...points.map(p => p.x)), maxX = Math.max(...points.map(p => p.x));
      const minZ = Math.min(...points.map(p => p.z)), maxZ = Math.max(...points.map(p => p.z));
      // Fit the complete walking route, including detours, on short phone maps.
      // Sample terrain only around that route so the wide overview stays cheap.
      const span = Math.max(64, (maxX - minX) * w / Math.max(16, w - 24), (maxZ - minZ) * w / Math.max(16, h - 24));
      const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
      const left = cx - span / 2, top = cz - span / aspect / 2, scale = w / span;
      const xy = p => [ (p.x - left) * scale, (p.z - top) * scale ];
      ctx.fillStyle = "#071311"; ctx.fillRect(0, 0, w, h);
      for (let z = Math.floor(Math.max(top, minZ - 12) / CELL); z <= Math.ceil(Math.min(top + h / scale, maxZ + 12) / CELL); z++) {
        for (let x = Math.floor(Math.max(left, minX - 12) / CELL); x <= Math.ceil(Math.min(left + span, maxX + 12) / CELL); x++) {
          const value = world.cell(x, z);
          ctx.fillStyle = value === 2 ? "#983c2c" : value ? "#536760" : "#122d27";
          ctx.fillRect((x * CELL - left) * scale, (z * CELL - top) * scale, CELL * scale - 0.5, CELL * scale - 0.5);
        }
      }
      const start = xy(player);
      if (gold && this.route.length > 1) {
        ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.setLineDash([]); ctx.beginPath();
        ctx.moveTo(...start);
        for (const p of this.route) ctx.lineTo(...xy(p));
        ctx.strokeStyle = "#020904"; ctx.lineWidth = 7; ctx.stroke();
        ctx.strokeStyle = "#76ff03"; ctx.lineWidth = 4; ctx.stroke();
        ctx.strokeStyle = "#d9ffb4"; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
      }
      for (const enemy of enemies) if (enemy.alive) {
        const [x, y] = xy(enemy); ctx.fillStyle = "#ff7763"; ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
      const marker = (p, color, radius) => {
        const raw = xy(p), x = clamp(raw[0], 11, w - 11), y = clamp(raw[1], 11, h - 11);
        ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.strokeStyle = "#030806"; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#fff5dd"; ctx.lineWidth = 0.8; ctx.stroke(); ctx.restore();
      };
      if (boss.alive) marker(boss, "#ff3047", 6.5);
      if (gold) marker(target, "#76ff03", 7 + 0.8 * Math.sin(now * Math.PI * 2 / 1.2));
      ctx.save(); ctx.translate(...start); ctx.rotate(-player.yaw); ctx.fillStyle = "#78ffef"; ctx.strokeStyle = "#06110e"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(6, 6); ctx.lineTo(0, 3); ctx.lineTo(-6, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      ctx.fillStyle = "#dbfff1"; ctx.font = "bold 10px monospace"; ctx.fillText("N ↑", 7, 13);
    }
  }
  return { chooseBulletSite, findRoute, bearingAngle, bearingArrow, routeWaypoint, ScoutMap };
});
