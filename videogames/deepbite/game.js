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
  const state = { running: false, paused: false, last: 0, time: 0, score: 0, eaten: 0, camera: { x: 0, y: 0 }, player: null, creatures: [], obstacles: [], particles: [], pattern: null, messageTimer: 0, spawnTimer: 0 };
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

  function makeCreature(initial = false, forcedKind = null) {
    const roll = Math.random();
    let kind;
    if (forcedKind) kind = forcedKind;
    else if (state.time < 12) kind = roll < .92 ? "small" : roll < .96 ? "piranha" : "jelly";
    else if (state.time < 35) kind = roll < .78 ? "small" : roll < .87 ? "piranha" : roll < .91 ? "shark" : roll < .95 ? "lionfish" : "jelly";
    else kind = roll < .64 ? "small" : roll < .77 ? "piranha" : roll < .87 ? "shark" : roll < .94 ? "lionfish" : "jelly";
    const size = kind === "small" ? random(12, 23) : kind === "piranha" ? random(30, 43) : kind === "shark" ? random(52, 72) : kind === "lionfish" ? random(36, 49) : random(27, 40);
    const x = initial ? state.camera.x + random(vw * .35, vw * 1.7) : state.camera.x + vw * .62 + random(100, 360);
    const y = random(kind === "jelly" ? 0 : -vh * .36, vh * .34);
    return { kind, x, y, size, heading: Math.PI, speed: kind === "small" ? random(72, 112) : kind === "shark" ? random(115, 155) : random(92, 136), phase: random(0, TAU), alive: true };
  }

  function makeObstacle(initial = false) {
    const roll = Math.random();
    const kind = roll < .45 ? "coral" : roll < .78 ? "shell" : "treasure";
    return { kind, x: initial ? state.camera.x + random(vw * .35, vw * 2.1) : state.camera.x + vw * .62 + random(160, 520), y: vh * .39, size: kind === "coral" ? random(54, 76) : kind === "shell" ? random(42, 59) : random(47, 62), phase: random(0, TAU), alive: true };
  }

  function creatureTarget() {
    const base = isMobile ? 8 : 10;
    const maximum = isMobile ? 15 : 22;
    return Math.min(maximum, base + Math.floor(state.time / 14) * (isMobile ? 1 : 2));
  }

  function obstacleTarget() {
    const base = 3;
    const maximum = isMobile ? 5 : 7;
    return Math.min(maximum, base + Math.floor(state.time / 25));
  }

  function reset() {
    state.time = 0; state.score = 0; state.eaten = 0; state.spawnTimer = 0; state.messageTimer = 0;
    state.player = { x: -vw * .2, y: 0, size: 30, angle: 0, speed: 0, pulse: 0, alive: true };
    state.camera.x = 0; state.camera.y = 0; state.creatures.length = 0; state.obstacles.length = 0; state.particles.length = 0;
    for (let i = 0; i < creatureTarget(); i += 1) state.creatures.push(makeCreature(true, "small"));
    ["treasure", "coral", "shell"].forEach((kind, index) => {
      const object = makeObstacle(true); object.kind = kind; object.x = vw * (.75 + index * .58); state.obstacles.push(object);
    });
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
    ui.endTitle.textContent = reason === "jelly" ? "MEDUSA VELENOSA!"
      : reason === "shark" ? "LO SQUALO TI HA PRESO"
        : reason === "piranha" ? "MORSO DAL PIRANHA!"
          : reason === "lionfish" ? "PESCE VELENOSO!"
            : reason === "coral" ? "CONTRO IL CORALLO!"
              : reason === "shell" ? "CONCHIGLIA FATALE!" : "SEI STATO MANGIATO";
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
    const scrollSpeed = Math.min(235, 112 + state.time * 1.05);
    state.camera.x += scrollSpeed * dt;
    player.speed += (move.x * 150 - player.speed) * Math.min(1, dt * 13);
    player.x += (scrollSpeed + player.speed) * dt;
    player.y += move.y * 245 * dt;
    player.x = clamp(player.x, state.camera.x - vw * .36, state.camera.x + vw * .22);
    player.y = clamp(player.y, -vh * .4, vh * .33);
    player.angle += (move.y * .2 - player.angle) * Math.min(1, dt * 10);
    player.pulse = Math.max(0, player.pulse - dt);

    for (const fish of state.creatures) {
      fish.phase += dt * (fish.kind === "jelly" ? 2.2 : 5);
      if (fish.kind === "jelly") {
        fish.x -= fish.speed * .28 * dt;
        fish.y += Math.sin(fish.phase) * 10 * dt;
      } else {
        fish.x -= fish.speed * dt;
        fish.y += Math.sin(fish.phase * .55) * 5 * dt;
      }

      if (distance(fish, player) < player.size * .55 + fish.size * .48) {
        if (fish.kind === "small") eat(fish);
        else { end(fish.kind); return; }
      }
    }

    for (const object of state.obstacles) {
      if (!object.alive) continue;
      if (distance(object, player) < player.size * .52 + object.size * .38) {
        if (object.kind === "treasure") collectTreasure(object);
        else { end(object.kind); return; }
      }
    }

    state.creatures = state.creatures.filter((fish) => fish.alive && fish.x > state.camera.x - vw * .7);
    state.obstacles = state.obstacles.filter((object) => object.alive && object.x > state.camera.x - vw * .7);
    const target = creatureTarget();
    while (state.creatures.length < target) state.creatures.push(makeCreature());
    while (state.obstacles.length < obstacleTarget()) state.obstacles.push(makeObstacle());
    updateParticles(dt);
    if (state.messageTimer > 0 && (state.messageTimer -= dt) <= 0) ui.message.classList.remove("show");
    updateHud();
  }

  function eat(fish) {
    fish.alive = false; state.eaten += 1;
    const gain = Math.max(1, Math.round(fish.size)); state.score += gain;
    const previousTier = Math.floor(state.player.size / 18);
    state.player.size = Math.min(105, state.player.size + 1.15 + fish.size * .035);
    state.player.pulse = .2; sound("bite"); burst(fish.x, fish.y, "#ffe45d", 9);
    if (Math.floor(state.player.size / 18) > previousTier) { sound("grow"); announce("SEI DIVENTATO PIÙ GRANDE!"); }
  }

  function collectTreasure(object) {
    object.alive = false; state.score += 75; state.player.size = Math.min(105, state.player.size + 4.5); state.player.pulse = .24;
    sound("grow"); burst(object.x, object.y, "#ffe45d", 16); announce("TESORO! CRESCITA EXTRA");
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
    const floorY = vh * .88;
    const floor = ctx.createLinearGradient(0, floorY - 80, 0, vh);
    floor.addColorStop(0, "rgba(7,72,98,0)"); floor.addColorStop(.35, "rgba(7,54,73,.42)"); floor.addColorStop(1, "rgba(2,25,42,.82)");
    ctx.fillStyle = floor; ctx.fillRect(0, floorY - 80, vw, 120);
    for (const object of state.obstacles) {
      if (!object.alive || !visible(object.x, object.y, 100)) continue;
      const p = worldToScreen(object.x, object.y);
      const index = object.kind === "coral" ? 8 : object.kind === "shell" ? 9 : 10;
      const bob = object.kind === "treasure" ? Math.sin(state.time * 2.4 + object.phase) * 4 : 0;
      atlasCell(index, p.x, p.y + bob, object.size * 1.32, object.size);
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
    else if (fish.kind === "small") { index = fish.size < 18 ? 0 : 1; ratio = 1.42; }
    else if (fish.kind === "lionfish") { index = 7; ratio = 1.45; }
    else { index = 3; ratio = 1.45; }
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
    const index = 2;
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
