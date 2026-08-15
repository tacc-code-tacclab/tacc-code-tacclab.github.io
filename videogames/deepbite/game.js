(() => {
  "use strict";

  const TAU = Math.PI * 2;
  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const atlas = new Image();
  const water = new Image();
  atlas.src = "assets/ocean-atlas.webp";
  water.src = "assets/ocean-water.webp";

  const ui = {
    menu: document.querySelector("#menu"), hud: document.querySelector("#hud"), over: document.querySelector("#gameover"), pause: document.querySelector("#pause"),
    play: document.querySelector("#play-btn"), again: document.querySelector("#again-btn"), home: document.querySelector("#home-btn"), pauseBtn: document.querySelector("#pause-btn"), resume: document.querySelector("#resume-btn"), quit: document.querySelector("#quit-btn"),
    score: document.querySelector("#score"), size: document.querySelector("#size"), record: document.querySelector("#record"), finalScore: document.querySelector("#final-score"), finalSize: document.querySelector("#final-size"), endTitle: document.querySelector("#end-title"), message: document.querySelector("#message"), mobile: document.querySelector("#mobile-controls"), joystick: document.querySelector("#joystick"), stick: document.querySelector("#stick"),
  };

  const input = { x: 0, y: 0, keys: new Set(), pointer: null };
  const state = { running: false, paused: false, last: 0, time: 0, score: 0, eaten: 0, camera: { x: 0, y: 0 }, player: null, creatures: [], particles: [], pattern: null, messageTimer: 0, spawnTimer: 0 };
  let vw = innerWidth;
  let vh = innerHeight;
  let dpr = 1;
  let audio = null;
  let best = Number(localStorage.getItem("deepbite-best") || 0);
  const isMobile = matchMedia("(pointer: coarse)").matches || /(?:^|[?&])mobile=1/.test(location.search);

  function show(node, active) { node.classList.toggle("active", active); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function random(min, max) { return min + Math.random() * (max - min); }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function hash(x, y, salt = 0) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(salt | 0, 1442695041);
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967295;
  }

  function resize() {
    vw = innerWidth; vh = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, isMobile ? 1.2 : 1.65);
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    canvas.style.width = `${vw}px`; canvas.style.height = `${vh}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.pattern = null;
  }

  function initAudio() {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
  }

  function sound(kind) {
    if (!audio) return;
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.connect(gain); gain.connect(audio.destination);
    if (kind === "bite") { osc.type = "sine"; osc.frequency.setValueAtTime(360, now); osc.frequency.exponentialRampToValueAtTime(720, now + .08); }
    else if (kind === "grow") { osc.type = "triangle"; osc.frequency.setValueAtTime(240, now); osc.frequency.exponentialRampToValueAtTime(920, now + .2); }
    else { osc.type = "sawtooth"; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(42, now + .5); }
    gain.gain.setValueAtTime(kind === "death" ? .15 : .09, now); gain.gain.exponentialRampToValueAtTime(.001, now + (kind === "death" ? .52 : .16));
    osc.start(now); osc.stop(now + (kind === "death" ? .55 : .18));
  }

  function announce(text) {
    ui.message.textContent = text; ui.message.classList.add("show"); state.messageTimer = 1.15;
  }

  function makeCreature(force = false) {
    const angle = random(0, TAU);
    const radius = force ? random(100, Math.max(vw, vh) * .72) : random(Math.max(vw, vh) * .62, Math.max(vw, vh) * .9);
    const x = state.player.x + Math.cos(angle) * radius;
    const y = state.player.y + Math.sin(angle) * radius;
    const roll = Math.random();
    let kind = "fish";
    if (roll > .91) kind = "jelly";
    else if (roll > .84 && state.time > 12) kind = "shark";
    const playerSize = state.player.size;
    let size;
    if (kind === "jelly") size = random(25, 42);
    else if (kind === "shark") size = Math.max(58, playerSize * random(1.35, 2.05));
    else {
      const biasSmall = Math.random() < .64;
      size = biasSmall ? random(11, Math.max(14, playerSize * .76)) : random(playerSize * 1.12, playerSize * 1.9);
    }
    const heading = random(0, TAU);
    return { kind, x, y, size, vx: Math.cos(heading), vy: Math.sin(heading), heading, speed: kind === "shark" ? random(72, 104) : random(34, 76), phase: random(0, TAU), turn: random(-.6, .6), alive: true };
  }

  function reset() {
    state.time = 0; state.score = 0; state.eaten = 0; state.spawnTimer = 0; state.messageTimer = 0;
    state.player = { x: 0, y: 0, size: 30, angle: 0, speed: 0, pulse: 0, alive: true };
    state.camera.x = 0; state.camera.y = 0; state.creatures.length = 0; state.particles.length = 0;
    const target = isMobile ? 42 : 62;
    for (let i = 0; i < target; i += 1) state.creatures.push(makeCreature(true));
    updateHud();
  }

  function start() {
    initAudio(); reset(); state.running = true; state.paused = false; state.last = performance.now();
    show(ui.menu, false); show(ui.over, false); show(ui.pause, false); show(ui.hud, true); ui.hud.setAttribute("aria-hidden", "false");
    ui.mobile.classList.toggle("active", isMobile); ui.mobile.setAttribute("aria-hidden", String(!isMobile));
    requestAnimationFrame(loop);
  }

  function end(reason) {
    if (!state.running) return;
    state.running = false; state.player.alive = false; sound("death"); burst(state.player.x, state.player.y, "#8ef7ff", 26);
    best = Math.max(best, state.score); localStorage.setItem("deepbite-best", String(best));
    ui.endTitle.textContent = reason === "jelly" ? "MEDUSA VELENOSA!" : reason === "shark" ? "LO SQUALO TI HA PRESO" : "SEI STATO MANGIATO";
    ui.finalScore.textContent = state.score.toLocaleString("it-IT"); ui.finalSize.textContent = `Taglia raggiunta: ${(state.player.size / 30).toFixed(1)}× · ${state.eaten} pesci mangiati`;
    show(ui.over, true); show(ui.hud, false); ui.mobile.classList.remove("active");
  }

  function updateInput() {
    let x = input.x, y = input.y;
    if (input.keys.has("ArrowLeft") || input.keys.has("a")) x -= 1;
    if (input.keys.has("ArrowRight") || input.keys.has("d")) x += 1;
    if (input.keys.has("ArrowUp") || input.keys.has("w")) y -= 1;
    if (input.keys.has("ArrowDown") || input.keys.has("s")) y += 1;
    const length = Math.hypot(x, y);
    return length > 1 ? { x: x / length, y: y / length } : { x, y };
  }

  function update(dt) {
    state.time += dt;
    const player = state.player;
    const move = updateInput();
    const amount = Math.hypot(move.x, move.y);
    if (amount > .08) {
      const targetAngle = Math.atan2(move.y, move.x);
      let delta = ((targetAngle - player.angle + Math.PI) % TAU + TAU) % TAU - Math.PI;
      player.angle += delta * Math.min(1, dt * 13);
      const maxSpeed = clamp(285 - (player.size - 30) * .75, 145, 285);
      player.speed += (maxSpeed * amount - player.speed) * Math.min(1, dt * 15);
    } else player.speed *= Math.pow(.001, dt);
    player.x += Math.cos(player.angle) * player.speed * dt;
    player.y += Math.sin(player.angle) * player.speed * dt;
    player.pulse = Math.max(0, player.pulse - dt);
    state.camera.x += (player.x - state.camera.x) * Math.min(1, dt * 8);
    state.camera.y += (player.y - state.camera.y) * Math.min(1, dt * 8);

    for (const fish of state.creatures) {
      fish.phase += dt * (fish.kind === "jelly" ? 2.2 : 4.5);
      const dx = player.x - fish.x, dy = player.y - fish.y;
      const dist = Math.hypot(dx, dy) || 1;
      const dangerous = fish.kind === "shark" || (fish.kind === "fish" && fish.size > player.size * 1.08);
      const prey = fish.kind === "fish" && fish.size < player.size * .86;
      let desired = fish.heading + fish.turn * dt;
      if (dangerous && dist < 520) desired = Math.atan2(dy, dx);
      else if (prey && dist < 360) desired = Math.atan2(-dy, -dx);
      let turn = ((desired - fish.heading + Math.PI) % TAU + TAU) % TAU - Math.PI;
      fish.heading += turn * Math.min(1, dt * (fish.kind === "shark" ? 2.2 : 1.5));
      const speedBoost = dangerous && dist < 520 ? 1.38 : prey && dist < 360 ? 1.22 : 1;
      if (fish.kind === "jelly") {
        fish.x += Math.cos(fish.heading) * fish.speed * .34 * dt;
        fish.y += (Math.sin(fish.heading) * fish.speed * .25 + Math.sin(fish.phase) * 13) * dt;
      } else {
        fish.x += Math.cos(fish.heading) * fish.speed * speedBoost * dt;
        fish.y += Math.sin(fish.heading) * fish.speed * speedBoost * dt;
      }

      if (dist < player.size * .56 + fish.size * .5) {
        if (fish.kind === "jelly") { end("jelly"); return; }
        if (dangerous) { end(fish.kind === "shark" ? "shark" : "fish"); return; }
        if (prey) eat(fish);
      }
    }

    const recycleDistance = Math.max(vw, vh) * 1.2 + 500;
    state.creatures = state.creatures.filter((fish) => fish.alive && distance(fish, player) < recycleDistance);
    const target = isMobile ? 42 : 62;
    while (state.creatures.length < target) state.creatures.push(makeCreature());
    updateParticles(dt);
    if (state.messageTimer > 0 && (state.messageTimer -= dt) <= 0) ui.message.classList.remove("show");
    updateHud();
  }

  function eat(fish) {
    fish.alive = false; state.eaten += 1;
    const gain = Math.max(1, Math.round(fish.size)); state.score += gain;
    const previousTier = Math.floor(state.player.size / 18);
    state.player.size = Math.min(150, Math.sqrt(state.player.size ** 2 + fish.size ** 2 * .16));
    state.player.pulse = .2; sound("bite"); burst(fish.x, fish.y, "#ffe45d", 9);
    if (Math.floor(state.player.size / 18) > previousTier) { sound("grow"); announce("SEI DIVENTATO PIÙ GRANDE!"); }
  }

  function burst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = random(0, TAU), speed = random(35, 150);
      state.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: random(.25, .65), max: .65, color, size: random(2, 6) });
    }
  }

  function updateParticles(dt) {
    for (const p of state.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= Math.pow(.08, dt); p.vy *= Math.pow(.08, dt); p.life -= dt; }
    state.particles = state.particles.filter((p) => p.life > 0);
  }

  function updateHud() {
    ui.score.textContent = state.score.toLocaleString("it-IT"); ui.size.textContent = `${(state.player.size / 30).toFixed(1)}×`; ui.record.textContent = Math.max(best, state.score).toLocaleString("it-IT");
  }

  function atlasCell(index, x, y, width, height, flip = false, alpha = 1) {
    if (!atlas.complete || !atlas.naturalWidth) return false;
    const cellW = atlas.naturalWidth / 4, cellH = atlas.naturalHeight / 3;
    ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1); ctx.globalAlpha = alpha;
    ctx.drawImage(atlas, index % 4 * cellW, Math.floor(index / 4) * cellH, cellW, cellH, -width / 2, -height / 2, width, height); ctx.restore();
    return true;
  }

  function drawOcean() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#075a91"; ctx.fillRect(0, 0, vw, vh);
    if (water.complete && water.naturalWidth) {
      if (!state.pattern) state.pattern = ctx.createPattern(water, "repeat");
      ctx.save(); ctx.translate(-((state.camera.x * .18) % 512), -((state.camera.y * .18) % 512)); ctx.globalAlpha = .72; ctx.fillStyle = state.pattern; ctx.fillRect(-512, -512, vw + 1024, vh + 1024); ctx.restore();
    }
    const gradient = ctx.createRadialGradient(vw * .45, vh * .35, 20, vw * .5, vh * .5, Math.max(vw, vh) * .75);
    gradient.addColorStop(0, "rgba(47,231,244,.09)"); gradient.addColorStop(1, "rgba(0,11,54,.48)"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, vw, vh);
  }

  function worldToScreen(x, y) { return { x: x - state.camera.x + vw / 2, y: y - state.camera.y + vh / 2 }; }
  function visible(x, y, margin = 100) { const p = worldToScreen(x, y); return p.x > -margin && p.x < vw + margin && p.y > -margin && p.y < vh + margin; }

  function drawDecor() {
    const chunk = 560;
    const cx = Math.floor(state.camera.x / chunk), cy = Math.floor(state.camera.y / chunk);
    for (let oy = -2; oy <= 2; oy += 1) for (let ox = -2; ox <= 2; ox += 1) {
      const gx = cx + ox, gy = cy + oy;
      for (let i = 0; i < 4; i += 1) {
        const x = gx * chunk + 45 + hash(gx, gy, i * 4) * (chunk - 90);
        const y = gy * chunk + 45 + hash(gx, gy, i * 4 + 1) * (chunk - 90);
        if (!visible(x, y, 120)) continue;
        const p = worldToScreen(x, y); const roll = hash(gx, gy, i * 4 + 2); const index = roll < .35 ? 8 : roll < .62 ? 9 : roll < .76 ? 10 : 11;
        const size = 52 + hash(gx, gy, i * 4 + 3) * 42;
        ctx.save(); ctx.globalAlpha = .7; atlasCell(index, p.x, p.y, size * 1.28, size); ctx.restore();
      }
    }
  }

  function drawCreature(fish) {
    if (!visible(fish.x, fish.y, fish.size * 2)) return;
    const p = worldToScreen(fish.x, fish.y); const flip = Math.cos(fish.heading) < 0;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(fish.phase) * .035); ctx.translate(0, Math.sin(fish.phase * .7) * 3);
    const shadowW = fish.size * (fish.kind === "shark" ? 1.3 : .9); ctx.fillStyle = "rgba(0,15,36,.25)"; ctx.beginPath(); ctx.ellipse(5, fish.size * .35, shadowW, fish.size * .25, 0, 0, TAU); ctx.fill();
    let index, ratio;
    if (fish.kind === "jelly") { index = fish.phase % TAU > Math.PI ? 5 : 6; ratio = .8; }
    else if (fish.kind === "shark") { index = 4; ratio = 1.75; }
    else if (fish.size < 24) { index = 0; ratio = 1.42; }
    else if (fish.size < 43) { index = 1; ratio = 1.38; }
    else if (fish.size < 70) { index = 2; ratio = 1.45; }
    else { index = fish.size > 95 ? 3 : 7; ratio = 1.45; }
    if (fish.kind !== "jelly") ctx.rotate(flip ? -fish.heading + Math.PI : fish.heading);
    const height = fish.size * 1.6; atlasCell(index, 0, 0, height * ratio, height, flip);
    ctx.restore();
  }

  function drawPlayer() {
    const player = state.player; const x = vw / 2 + (player.x - state.camera.x), y = vh / 2 + (player.y - state.camera.y); const flip = Math.cos(player.angle) < 0;
    ctx.save(); ctx.translate(x, y); ctx.rotate(flip ? -player.angle + Math.PI : player.angle);
    const pulse = player.pulse > 0 ? 1.12 : 1; ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(0,8,28,.34)"; ctx.beginPath(); ctx.ellipse(5, player.size * .48, player.size * 1.05, player.size * .35, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(118,249,255,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, player.size * .5, player.size * 1.12, player.size * .42, 0, 0, TAU); ctx.stroke();
    const index = player.size < 46 ? 0 : player.size < 78 ? 1 : player.size < 112 ? 2 : 3;
    const height = player.size * 2.05; ctx.filter = "drop-shadow(0 8px 6px rgba(0,16,40,.48)) drop-shadow(0 0 7px rgba(68,243,255,.5))"; atlasCell(index, 0, 0, height * 1.43, height, flip); ctx.filter = "none";
    ctx.restore();
  }

  function drawParticles() {
    for (const p of state.particles) { const s = worldToScreen(p.x, p.y); ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(s.x, s.y, p.size, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  function draw() {
    drawOcean(); drawDecor();
    const sorted = state.creatures.filter((f) => f.alive).sort((a, b) => a.y - b.y);
    for (const fish of sorted) drawCreature(fish);
    drawPlayer(); drawParticles();
    ctx.fillStyle = "rgba(209,251,255,.22)";
    for (let i = 0; i < 17; i += 1) { const x = (i * 173 + state.time * (11 + i % 3) - state.camera.x * .08) % (vw + 50) - 25; const y = (i * 97 - state.time * (26 + i % 4) - state.camera.y * .05) % (vh + 80); ctx.beginPath(); ctx.arc(x, y < 0 ? y + vh + 80 : y, 1.5 + i % 3, 0, TAU); ctx.fill(); }
  }

  function loop(now) {
    if (!state.running || state.paused) return;
    const dt = Math.min(.033, Math.max(.001, (now - state.last) / 1000)); state.last = now;
    update(dt); draw();
    if (state.running && !state.paused) requestAnimationFrame(loop);
  }

  function pauseGame() { if (!state.running) return; state.paused = true; show(ui.pause, true); ui.mobile.classList.remove("active"); }
  function resumeGame() { if (!state.running) return; state.paused = false; show(ui.pause, false); ui.mobile.classList.toggle("active", isMobile); state.last = performance.now(); requestAnimationFrame(loop); }
  function menu() { state.running = false; state.paused = false; show(ui.menu, true); show(ui.over, false); show(ui.pause, false); show(ui.hud, false); ui.mobile.classList.remove("active"); drawOcean(); }

  function joystickMove(event) {
    const rect = ui.joystick.getBoundingClientRect(); const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    let dx = event.clientX - cx, dy = event.clientY - cy; const max = rect.width * .32; const length = Math.hypot(dx, dy);
    if (length > max) { dx = dx / length * max; dy = dy / length * max; }
    input.x = dx / max; input.y = dy / max; ui.stick.style.transform = `translate(${dx}px, ${dy}px)`;
  }
  function releaseJoystick() { input.pointer = null; input.x = 0; input.y = 0; ui.stick.style.transform = ""; }

  addEventListener("resize", resize, { passive: true });
  addEventListener("keydown", (e) => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d"].includes(e.key)) { e.preventDefault(); input.keys.add(e.key); } if (e.key === "Escape" && state.running) state.paused ? resumeGame() : pauseGame(); });
  addEventListener("keyup", (e) => input.keys.delete(e.key));
  addEventListener("blur", () => { input.keys.clear(); if (state.running && !state.paused) pauseGame(); });
  ui.joystick.addEventListener("pointerdown", (e) => { input.pointer = e.pointerId; ui.joystick.setPointerCapture(e.pointerId); joystickMove(e); });
  ui.joystick.addEventListener("pointermove", (e) => { if (input.pointer === e.pointerId) joystickMove(e); });
  ui.joystick.addEventListener("pointerup", releaseJoystick); ui.joystick.addEventListener("pointercancel", releaseJoystick);
  ui.play.addEventListener("click", start); ui.again.addEventListener("click", start); ui.home.addEventListener("click", menu); ui.pauseBtn.addEventListener("click", pauseGame); ui.resume.addEventListener("click", resumeGame); ui.quit.addEventListener("click", menu);

  ui.record.textContent = best.toLocaleString("it-IT"); resize();
  water.addEventListener("load", () => { state.pattern = null; drawOcean(); });
  drawOcean();
})();
