(() => {
  "use strict";

  const LEVELS = window.ULISSE_LEVELS;
  const canvas = document.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const SAVE_KEY = "ulisse-nobody-save-v1";

  const ui = {
    frame: document.querySelector("#gameFrame"),
    start: document.querySelector("#startScreen"),
    play: document.querySelector("#playButton"),
    newVoyage: document.querySelector("#newVoyageButton"),
    pause: document.querySelector("#pauseScreen"),
    resume: document.querySelector("#resumeButton"),
    ending: document.querySelector("#endingScreen"),
    endingStats: document.querySelector("#endingStats"),
    playAgain: document.querySelector("#playAgainButton"),
    restart: document.querySelector("#restartButton"),
    sound: document.querySelector("#soundButton"),
    flash: document.querySelector("#deathFlash"),
    chapterCard: document.querySelector("#chapterCard"),
    chapterNumber: document.querySelector("#chapterNumber"),
    chapterSetting: document.querySelector("#chapterSetting"),
    chapterTitle: document.querySelector("#chapterTitle"),
    chapterStory: document.querySelector("#chapterStory"),
    hudChapter: document.querySelector("#hudChapter"),
    hudSetting: document.querySelector("#hudSetting"),
    hudTitle: document.querySelector("#hudTitle"),
    hudDeaths: document.querySelector("#hudDeaths"),
    hintText: document.querySelector("#hintText"),
    list: document.querySelector("#chapterList"),
  };

  if (!Array.isArray(LEVELS) || LEVELS.length === 0 || !ctx) {
    ui.start.querySelector("h2").textContent = "The voyage could not be loaded.";
    ui.start.querySelector("p:not(.panel-overline)").textContent = "Please refresh the page and try again.";
    ui.play.hidden = true;
    return;
  }

  const defaultSave = { current: 0, unlocked: 0, deaths: 0, completed: false };

  function readSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!parsed || typeof parsed !== "object") return { ...defaultSave };
      return {
        current: clamp(Number(parsed.current) || 0, 0, LEVELS.length - 1),
        unlocked: clamp(Number(parsed.unlocked) || 0, 0, LEVELS.length - 1),
        deaths: Math.max(0, Number(parsed.deaths) || 0),
        completed: Boolean(parsed.completed),
      };
    } catch {
      return { ...defaultSave };
    }
  }

  const saved = readSave();
  const state = {
    levelIndex: saved.current,
    unlocked: saved.unlocked,
    deaths: saved.deaths,
    completedBefore: saved.completed,
    level: null,
    player: null,
    keys: { left: false, right: false, jump: false },
    jumpQueued: false,
    running: false,
    paused: false,
    dying: false,
    completing: false,
    ended: false,
    muted: false,
    lastFrame: performance.now(),
    token: 0,
    chapterTimer: 0,
    startTime: 0,
    particles: [],
    nextAmbient: 0,
  };

  let audioContext = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function intersects(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function saveProgress() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        current: state.levelIndex,
        unlocked: state.unlocked,
        deaths: state.deaths,
        completed: state.completedBefore || state.ended,
      }));
    } catch {
      // The game remains fully playable when storage is unavailable.
    }
  }

  function enableAudio() {
    if (state.muted) return;
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext?.state === "suspended") audioContext.resume();
  }

  function tone(frequency, duration = 0.08, type = "sine", volume = 0.035, endFrequency = frequency) {
    if (state.muted || !audioContext) return;
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function sound(name) {
    if (name === "jump") tone(290, 0.09, "triangle", 0.025, 430);
    if (name === "trap") tone(185, 0.07, "square", 0.018, 135);
    if (name === "death") tone(150, 0.22, "sawtooth", 0.04, 46);
    if (name === "land") tone(92, 0.045, "triangle", 0.015, 70);
    if (name === "chapter") {
      tone(220, 0.18, "sine", 0.025, 330);
      window.setTimeout(() => tone(330, 0.22, "sine", 0.022, 440), 95);
    }
    if (name === "home") {
      [220, 277, 330, 440].forEach((note, index) => {
        window.setTimeout(() => tone(note, 0.34, "triangle", 0.027, note * 1.01), index * 95);
      });
    }
  }

  function setSound(enabled) {
    state.muted = !enabled;
    ui.sound.textContent = enabled ? "Sound on" : "Sound off";
    ui.sound.setAttribute("aria-pressed", String(enabled));
    if (enabled) {
      enableAudio();
      tone(330, 0.08, "sine", 0.02, 390);
    }
  }

  function cloneLevel(index) {
    const level = JSON.parse(JSON.stringify(LEVELS[index]));
    level.platforms.forEach((platform, id) => {
      platform._id = id;
      platform._visible = true;
      platform._timer = 0;
      platform._direction = 1;
      platform._fallVelocity = 0;
      platform._previousX = platform.x;
      platform._previousY = platform.y;
    });
    level.hazards.forEach((hazard) => {
      hazard._initialX = hazard.x;
      hazard._initialY = hazard.y;
      hazard._direction = 1;
      hazard._triggered = hazard.triggerX == null;
      hazard._announced = false;
      hazard._timer = 0;
      hazard._velocityY = 0;
      hazard._progress = hazard.hidden ? 0 : 1;
    });
    return level;
  }

  function loadLevel(index, announce = true) {
    state.token += 1;
    state.levelIndex = clamp(index, 0, LEVELS.length - 1);
    state.level = cloneLevel(state.levelIndex);
    state.dying = false;
    state.completing = false;
    state.ended = false;
    state.keys.left = false;
    state.keys.right = false;
    state.keys.jump = false;
    state.jumpQueued = false;
    state.particles.length = 0;
    state.player = {
      x: state.level.spawn.x,
      y: state.level.spawn.y,
      w: 24,
      h: 38,
      vx: 0,
      vy: 0,
      onGround: false,
      standingOn: null,
      coyote: 0,
      jumpBuffer: 0,
      facing: 1,
      step: 0,
    };
    updateInterface();
    renderChapterList();
    if (announce && state.running) showChapterCard();
    saveProgress();
    draw();
  }

  function updateInterface() {
    const level = LEVELS[state.levelIndex];
    ui.hudChapter.textContent = `${String(state.levelIndex + 1).padStart(2, "0")} / ${LEVELS.length}`;
    ui.hudSetting.textContent = level.shortSetting;
    ui.hudTitle.textContent = level.title;
    ui.hudDeaths.textContent = String(state.deaths).padStart(2, "0");
    ui.hintText.textContent = level.hint;
    ui.chapterNumber.textContent = level.numeral;
    ui.chapterSetting.textContent = level.setting;
    ui.chapterTitle.textContent = level.title;
    ui.chapterStory.textContent = level.story;
  }

  function showChapterCard() {
    window.clearTimeout(state.chapterTimer);
    ui.chapterCard.classList.add("visible");
    state.chapterTimer = window.setTimeout(() => ui.chapterCard.classList.remove("visible"), 2350);
    sound("chapter");
  }

  function renderChapterList() {
    ui.list.replaceChildren();
    LEVELS.forEach((level, index) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      const unlocked = index <= state.unlocked || state.completedBefore;
      button.type = "button";
      button.disabled = !unlocked;
      button.dataset.level = String(index);
      button.setAttribute("aria-label", unlocked
        ? `Play chapter ${index + 1}: ${level.title}, ${level.shortSetting}`
        : `Chapter ${index + 1} locked`);
      if (index === state.levelIndex) button.setAttribute("aria-current", "true");
      button.innerHTML = `
        <span class="chapter-index">${String(index + 1).padStart(2, "0")}${unlocked ? "" : " · LOCKED"}</span>
        <strong>${level.title}</strong>
        <small>${level.shortSetting}</small>
      `;
      if (unlocked) {
        button.addEventListener("click", () => {
          if (!state.running) startGame(index);
          else loadLevel(index);
          ui.frame.scrollIntoView({ behavior: "smooth", block: "center" });
          canvas.focus({ preventScroll: true });
        });
      }
      item.append(button);
      ui.list.append(item);
    });
  }

  function startGame(index = state.levelIndex) {
    enableAudio();
    state.running = true;
    state.paused = false;
    state.ended = false;
    if (!state.startTime) state.startTime = performance.now();
    ui.start.hidden = true;
    ui.pause.hidden = true;
    ui.ending.hidden = true;
    loadLevel(index);
    canvas.focus({ preventScroll: true });
  }

  function resetVoyage() {
    state.levelIndex = 0;
    state.unlocked = 0;
    state.deaths = 0;
    state.completedBefore = false;
    state.startTime = performance.now();
    saveProgress();
    startGame(0);
  }

  function restartLevel(countAsFall = false) {
    if (!state.running || state.ended) return;
    if (countAsFall) {
      state.deaths += 1;
      ui.hudDeaths.textContent = String(state.deaths).padStart(2, "0");
    }
    sound("trap");
    loadLevel(state.levelIndex, false);
  }

  function togglePause(force) {
    if (!state.running || state.ended || state.dying || state.completing) return;
    state.paused = typeof force === "boolean" ? force : !state.paused;
    ui.pause.hidden = !state.paused;
    if (!state.paused) {
      state.lastFrame = performance.now();
      canvas.focus({ preventScroll: true });
    }
  }

  function setControl(control, pressed) {
    if (control === "left" || control === "right") state.keys[control] = pressed;
    if (control === "jump") {
      state.keys.jump = pressed;
      if (pressed) state.jumpQueued = true;
    }
  }

  function updatePlatforms(dt) {
    const player = state.player;
    state.level.platforms.forEach((platform) => {
      platform._previousX = platform.x;
      platform._previousY = platform.y;

      if (platform.move === "x" || platform.move === "y") {
        const axis = platform.move;
        platform[axis] += platform.speed * platform._direction * dt;
        if (platform[axis] <= platform.min || platform[axis] >= platform.max) {
          platform[axis] = clamp(platform[axis], platform.min, platform.max);
          platform._direction *= -1;
        }
      }

      if (platform.vanish && player.x > platform.triggerX) {
        platform._timer += dt;
        if (platform._timer >= platform.vanishDelay) platform._visible = false;
      }

      if (platform.fall && player.standingOn === platform._id) {
        platform._timer += dt;
      }
      if (platform.fall && platform._timer >= platform.fallDelay) {
        platform._fallVelocity += 1180 * dt;
        platform.y += platform._fallVelocity * dt;
        if (platform.y > H + 90) platform._visible = false;
      }
    });

    const standing = state.level.platforms.find((platform) => platform._id === player.standingOn);
    if (standing?._visible) {
      player.x += standing.x - standing._previousX;
      player.y += standing.y - standing._previousY;
    }
  }

  function activeZones(player) {
    const result = { slow: 1, reverse: false, wind: 0, whirlpool: 0 };
    state.level.hazards.forEach((hazard) => {
      if (hazard.type !== "zone" || !intersects(player, hazard)) return;
      if (hazard.effect === "slow") result.slow = Math.min(result.slow, hazard.strength);
      if (hazard.effect === "reverse") result.reverse = true;
      if (hazard.effect === "wind-right") result.wind += hazard.strength;
      if (hazard.effect === "wind-left") result.wind -= hazard.strength;
      if (hazard.effect === "whirlpool") result.whirlpool += hazard.strength;
    });
    return result;
  }

  function updatePlayer(dt) {
    const player = state.player;
    updatePlatforms(dt);

    const zones = activeZones(player);
    let left = state.keys.left;
    let right = state.keys.right;
    if (zones.reverse) [left, right] = [right, left];

    const direction = (right ? 1 : 0) - (left ? 1 : 0);
    const targetVelocity = direction * 255 * zones.slow;
    player.vx += (targetVelocity - player.vx) * Math.min(1, 13 * dt);
    player.vx += zones.wind * dt;
    if (zones.whirlpool) {
      player.vx -= zones.whirlpool * 0.45 * dt;
      player.vy += zones.whirlpool * 0.85 * dt;
    }
    if (direction) player.facing = direction;

    if (state.jumpQueued) {
      player.jumpBuffer = 0.12;
      state.jumpQueued = false;
    } else {
      player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);
    }

    player.coyote = player.onGround ? 0.105 : Math.max(0, player.coyote - dt);
    if (player.jumpBuffer > 0 && player.coyote > 0) {
      player.vy = -585;
      player.onGround = false;
      player.standingOn = null;
      player.coyote = 0;
      player.jumpBuffer = 0;
      spawnDust(player.x + player.w / 2, player.y + player.h, 4);
      sound("jump");
    }

    const gravityMultiplier = !state.keys.jump && player.vy < -80 ? 1.45 : 1;
    player.vy += 1580 * gravityMultiplier * dt;
    player.vy = Math.min(player.vy, 900);

    movePlayerX(dt);
    movePlayerY(dt);

    player.step += Math.abs(player.vx) * dt * 0.05;
    if (player.y > H + 70) die();
  }

  function collidablePlatforms() {
    return state.level.platforms.filter((platform) => platform._visible);
  }

  function movePlayerX(dt) {
    const player = state.player;
    player.x += player.vx * dt;
    for (const platform of collidablePlatforms()) {
      if (!intersects(player, platform)) continue;
      if (player.vx > 0) player.x = platform.x - player.w;
      else if (player.vx < 0) player.x = platform.x + platform.w;
      player.vx = 0;
    }
    player.x = clamp(player.x, 0, W - player.w);
  }

  function movePlayerY(dt) {
    const player = state.player;
    const oldY = player.y;
    const oldBottom = oldY + player.h;
    player.y += player.vy * dt;
    player.onGround = false;
    player.standingOn = null;

    let landing = null;
    if (player.vy >= 0) {
      for (const platform of collidablePlatforms()) {
        const horizontal = player.x + player.w > platform.x + 2 && player.x < platform.x + platform.w - 2;
        const crossedTop = oldBottom <= platform.y + 5 && player.y + player.h >= platform.y;
        if (horizontal && crossedTop && (!landing || platform.y < landing.y)) landing = platform;
      }
      if (landing) {
        const wasFalling = player.vy > 190;
        player.y = landing.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.standingOn = landing._id;
        if (wasFalling) {
          spawnDust(player.x + player.w / 2, player.y + player.h, 3);
          sound("land");
        }
      }
    } else {
      for (const platform of collidablePlatforms()) {
        const horizontal = player.x + player.w > platform.x + 2 && player.x < platform.x + platform.w - 2;
        const crossedBottom = oldY >= platform.y + platform.h - 4 && player.y <= platform.y + platform.h;
        if (horizontal && crossedBottom) {
          player.y = platform.y + platform.h;
          player.vy = Math.max(0, player.vy);
          break;
        }
      }
    }
  }

  function announceTrap(hazard) {
    if (hazard._announced) return;
    hazard._announced = true;
    sound("trap");
  }

  function updateHazards(dt) {
    const player = state.player;
    for (const hazard of state.level.hazards) {
      if (hazard.triggerX != null && player.x >= hazard.triggerX) {
        if (!hazard._triggered) announceTrap(hazard);
        hazard._triggered = true;
      }

      if (hazard.type === "spikes") {
        const target = hazard._triggered ? 1 : 0;
        hazard._progress += (target - hazard._progress) * Math.min(1, dt * 15);
        const spikeRect = {
          x: hazard.x,
          y: hazard.y + hazard.h * (1 - hazard._progress),
          w: hazard.w,
          h: hazard.h * hazard._progress,
        };
        if (hazard._progress > 0.48 && intersects(player, spikeRect)) return die();
      }

      if (hazard.type === "kill" && intersects(player, hazard)) return die();

      if (hazard.type === "enemy") {
        const axis = hazard.axis === "y" ? "y" : "x";
        hazard[axis] += hazard.speed * hazard._direction * dt;
        if (hazard[axis] <= hazard.min || hazard[axis] >= hazard.max) {
          hazard[axis] = clamp(hazard[axis], hazard.min, hazard.max);
          hazard._direction *= -1;
        }
        if (intersects(player, hazard)) return die();
      }

      if (hazard.type === "drop" && hazard._triggered) {
        hazard._timer += dt;
        if (hazard._timer >= (hazard.delay || 0.08)) {
          hazard._velocityY += 1280 * dt;
          hazard.y += hazard._velocityY * dt;
        }
        if (intersects(player, hazard)) return die();
      }

      if (hazard.type === "boulder" && hazard._triggered) {
        hazard._timer += dt;
        if (hazard._timer >= (hazard.delay || 0)) hazard.x += hazard.speed * dt;
        const nearest = {
          x: clamp(hazard.x, player.x, player.x + player.w),
          y: clamp(hazard.y, player.y, player.y + player.h),
        };
        const dx = hazard.x - nearest.x;
        const dy = hazard.y - nearest.y;
        if (dx * dx + dy * dy < hazard.radius * hazard.radius) return die();
      }
    }
  }

  function updateParticles(dt) {
    state.particles.forEach((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 420 * dt;
      particle.life -= dt;
    });
    state.particles = state.particles.filter((particle) => particle.life > 0);
  }

  function spawnDust(x, y, count) {
    for (let i = 0; i < count; i += 1) {
      state.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y,
        vx: (Math.random() - 0.5) * 65,
        vy: -20 - Math.random() * 42,
        life: 0.25 + Math.random() * 0.18,
        maxLife: 0.43,
      });
    }
  }

  function die() {
    if (state.dying || state.completing || !state.running) return;
    state.dying = true;
    state.deaths += 1;
    ui.hudDeaths.textContent = String(state.deaths).padStart(2, "0");
    saveProgress();
    sound("death");
    ui.flash.classList.remove("active");
    void ui.flash.offsetWidth;
    ui.flash.classList.add("active");
    const token = state.token;
    window.setTimeout(() => {
      if (token === state.token) loadLevel(state.levelIndex, false);
    }, 235);
  }

  function completeLevel() {
    if (state.completing || state.dying) return;
    state.completing = true;
    const token = state.token;
    sound(state.level.final ? "home" : "chapter");
    for (let i = 0; i < 16; i += 1) {
      state.particles.push({
        x: state.level.goal.x + state.level.goal.w / 2,
        y: state.level.goal.y + state.level.goal.h / 2,
        vx: (Math.random() - 0.5) * 210,
        vy: -60 - Math.random() * 180,
        life: 0.55 + Math.random() * 0.5,
        maxLife: 1,
      });
    }
    window.setTimeout(() => {
      if (token !== state.token) return;
      if (state.level.final) finishVoyage();
      else {
        state.unlocked = Math.max(state.unlocked, state.levelIndex + 1);
        loadLevel(state.levelIndex + 1);
      }
    }, state.level.final ? 950 : 620);
  }

  function finishVoyage() {
    state.ended = true;
    state.running = false;
    state.completedBefore = true;
    state.unlocked = LEVELS.length - 1;
    const elapsed = state.startTime ? Math.max(1, Math.round((performance.now() - state.startTime) / 1000)) : 0;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    ui.endingStats.textContent = `Fourteen chapters crossed · ${state.deaths} falls · ${minutes}:${String(seconds).padStart(2, "0")} at sea.`;
    ui.ending.hidden = false;
    saveProgress();
    renderChapterList();
  }

  function update(dt, now) {
    if (!state.running || state.paused || state.dying || state.completing) {
      updateParticles(dt);
      return;
    }
    updatePlayer(dt);
    if (state.dying) return;
    updateHazards(dt);
    if (state.dying) return;
    updateParticles(dt);
    if (intersects(state.player, state.level.goal)) completeLevel();

    if (!state.muted && audioContext && now > state.nextAmbient) {
      const base = 76 + state.levelIndex * 2;
      tone(base, 0.62, "sine", 0.006, base * 1.03);
      state.nextAmbient = now + 2800 + Math.random() * 1800;
    }
  }

  function frame(now) {
    const elapsed = Math.min(0.035, Math.max(0, (now - state.lastFrame) / 1000));
    state.lastFrame = now;
    const steps = Math.max(1, Math.ceil(elapsed / 0.009));
    for (let i = 0; i < steps; i += 1) update(elapsed / steps, now);
    draw();
    requestAnimationFrame(frame);
  }

  function draw() {
    if (!state.level || !state.player) return;
    drawBackground();
    drawZones();
    drawPlatforms();
    drawGoal();
    drawHazards();
    drawParticles();
    drawPlayer();
  }

  function drawBackground() {
    const level = state.level;
    const p = level.palette;
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, p.sky);
    gradient.addColorStop(1, p.far);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.arc(790, 118, level.scene === "underworld" ? 32 : 54, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (["coast", "wind", "sirens", "storm", "island", "phaeacia"].includes(level.scene)) drawSeaBackdrop();
    if (level.scene === "troy") drawTroy();
    if (level.scene === "cave") drawCave();
    if (level.scene === "underworld") drawUnderworld();
    if (level.scene === "circe" || level.scene === "lotus" || level.scene === "sun") drawIsland();
    if (level.scene === "ithaca") drawIthaca();

    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSeaBackdrop() {
    const p = state.level.palette;
    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = p.far;
    ctx.fillRect(0, 315, W, 225);
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 2;
    for (let y = 335; y < 455; y += 24) {
      ctx.beginPath();
      for (let x = -40; x <= W + 40; x += 40) {
        ctx.quadraticCurveTo(x + 10, y - 5, x + 20, y);
        ctx.quadraticCurveTo(x + 30, y + 5, x + 40, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawTroy() {
    const p = state.level.palette;
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = p.ground;
    [40, 145, 250, 690, 810].forEach((x, index) => {
      const height = 85 + (index % 3) * 42;
      ctx.fillRect(x, 330 - height, 78, height + 132);
      ctx.beginPath();
      ctx.moveTo(x - 8, 330 - height);
      ctx.lineTo(x + 39, 292 - height);
      ctx.lineTo(x + 86, 330 - height);
      ctx.fill();
    });
    ctx.fillStyle = p.accent;
    for (let x = 75; x < 900; x += 175) {
      ctx.beginPath();
      ctx.moveTo(x, 380);
      ctx.quadraticCurveTo(x + 18, 332, x + 30, 380);
      ctx.quadraticCurveTo(x + 48, 345, x + 58, 390);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawCave() {
    const p = state.level.palette;
    ctx.save();
    ctx.fillStyle = p.sky;
    ctx.globalAlpha = 0.72;
    for (let x = -30; x < W + 60; x += 105) {
      ctx.beginPath();
      ctx.ellipse(x, 85 + (x % 3) * 9, 95, 125, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.ellipse(875, 280, 90, 170, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawUnderworld() {
    const p = state.level.palette;
    ctx.save();
    ctx.fillStyle = p.accent;
    for (let i = 0; i < 34; i += 1) {
      const x = (i * 137) % W;
      const y = 65 + ((i * 61) % 280);
      ctx.globalAlpha = 0.12 + (i % 4) * 0.05;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.restore();
  }

  function drawIsland() {
    const p = state.level.palette;
    ctx.save();
    ctx.globalAlpha = 0.26;
    ctx.fillStyle = p.ground;
    ctx.beginPath();
    ctx.moveTo(0, 390);
    ctx.quadraticCurveTo(160, 250, 340, 390);
    ctx.quadraticCurveTo(520, 205, 710, 390);
    ctx.quadraticCurveTo(850, 275, 960, 390);
    ctx.lineTo(960, 540);
    ctx.lineTo(0, 540);
    ctx.fill();
    ctx.restore();
  }

  function drawIthaca() {
    const p = state.level.palette;
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = p.ground;
    for (let x = 90; x < 930; x += 155) {
      ctx.fillRect(x, 210, 28, 210);
      ctx.fillRect(x - 10, 200, 48, 12);
      ctx.fillRect(x - 8, 420, 44, 12);
    }
    ctx.fillRect(45, 180, 880, 22);
    ctx.restore();
  }

  function drawZones() {
    ctx.save();
    state.level.hazards.forEach((hazard) => {
      if (hazard.type !== "zone") return;
      const isSong = hazard.effect === "reverse";
      ctx.globalAlpha = isSong ? 0.09 : 0.075;
      ctx.fillStyle = isSong ? "#f6c1df" : state.level.palette.accent;
      ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
      ctx.globalAlpha = 0.24;
      ctx.strokeStyle = state.level.palette.accent;
      ctx.lineWidth = 2;
      const direction = hazard.effect === "wind-left" ? -1 : 1;
      if (hazard.effect.includes("wind")) {
        for (let y = hazard.y + 55; y < hazard.y + hazard.h; y += 70) {
          for (let x = hazard.x + 30; x < hazard.x + hazard.w - 10; x += 70) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 22 * direction, y);
            ctx.lineTo(x + 15 * direction, y - 5);
            ctx.moveTo(x + 22 * direction, y);
            ctx.lineTo(x + 15 * direction, y + 5);
            ctx.stroke();
          }
        }
      }
      if (isSong) {
        ctx.font = "22px Georgia, serif";
        for (let x = hazard.x + 35; x < hazard.x + hazard.w; x += 85) ctx.fillText("♪", x, hazard.y + 60 + (x % 3) * 35);
      }
    });
    ctx.restore();
  }

  function drawPlatforms() {
    const p = state.level.palette;
    state.level.platforms.forEach((platform) => {
      if (!platform._visible) return;
      ctx.save();
      if (platform.vanish && platform._timer > 0) {
        ctx.globalAlpha = clamp(1 - platform._timer / platform.vanishDelay, 0.12, 1);
      }
      ctx.fillStyle = "rgba(0,0,0,0.17)";
      ctx.fillRect(platform.x + 5, platform.y + 7, platform.w, platform.h);
      ctx.fillStyle = p.ground;
      ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
      ctx.fillStyle = p.edge;
      ctx.fillRect(platform.x, platform.y, platform.w, 5);
      ctx.globalAlpha *= 0.18;
      ctx.fillStyle = p.accent;
      for (let x = platform.x + 10; x < platform.x + platform.w - 5; x += 24) {
        ctx.fillRect(x, platform.y + 14, 10, 2);
      }
      ctx.restore();
    });
  }

  function drawGoal() {
    const goal = state.level.goal;
    const p = state.level.palette;
    const pulse = 0.6 + Math.sin(performance.now() / 240) * 0.18;
    ctx.save();
    ctx.globalAlpha = 0.18 * pulse;
    ctx.fillStyle = p.accent;
    ctx.fillRect(goal.x - 10, goal.y - 10, goal.w + 20, goal.h + 20);
    ctx.globalAlpha = 1;
    ctx.fillStyle = p.accent;
    ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
    ctx.fillStyle = p.ground;
    ctx.fillRect(goal.x + 6, goal.y + 8, goal.w - 12, goal.h - 8);
    ctx.fillStyle = p.accent;
    ctx.beginPath();
    ctx.arc(goal.x + goal.w - 10, goal.y + goal.h / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "700 9px ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.fillText(goal.label.toUpperCase(), goal.x + goal.w, goal.y - 9);
    if (state.level.final) {
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(goal.x - 8, goal.y + goal.h);
      ctx.quadraticCurveTo(goal.x - 19, goal.y + 30, goal.x - 6, goal.y + 16);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHazards() {
    for (const hazard of state.level.hazards) {
      if (hazard.type === "spikes") drawSpikes(hazard);
      if (hazard.type === "kill" && hazard.kind === "water") drawWater(hazard);
      if (hazard.type === "enemy") drawEnemy(hazard);
      if (hazard.type === "drop") drawDrop(hazard);
      if (hazard.type === "boulder") drawBoulder(hazard);
    }
  }

  function drawSpikes(hazard) {
    const height = hazard.h * hazard._progress;
    if (height <= 0.2) return;
    const count = Math.max(1, Math.round(hazard.w / 14));
    const width = hazard.w / count;
    ctx.save();
    ctx.fillStyle = hazard.kind === "fire" ? "#f06b3f" : "#dbe6df";
    for (let i = 0; i < count; i += 1) {
      ctx.beginPath();
      ctx.moveTo(hazard.x + i * width, hazard.y + hazard.h);
      ctx.lineTo(hazard.x + (i + 0.5) * width, hazard.y + hazard.h - height);
      ctx.lineTo(hazard.x + (i + 1) * width, hazard.y + hazard.h);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawWater(hazard) {
    ctx.save();
    ctx.fillStyle = "rgba(11, 66, 76, 0.76)";
    ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
    ctx.strokeStyle = "rgba(214, 246, 235, 0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = hazard.x; x < hazard.x + hazard.w; x += 24) {
      ctx.quadraticCurveTo(x + 6, hazard.y - 5, x + 12, hazard.y);
      ctx.quadraticCurveTo(x + 18, hazard.y + 5, x + 24, hazard.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawEnemy(hazard) {
    const facing = hazard._direction;
    ctx.save();
    ctx.translate(hazard.x + hazard.w / 2, hazard.y + hazard.h / 2);
    ctx.scale(facing, 1);
    ctx.translate(-hazard.w / 2, -hazard.h / 2);
    const p = state.level.palette;
    ctx.fillStyle = hazard.kind === "shade" ? "rgba(192, 211, 203, 0.44)" : "#922f2c";

    if (hazard.kind === "cyclops") {
      ctx.fillStyle = "#6f6250";
      ctx.fillRect(4, 16, hazard.w - 8, hazard.h - 16);
      ctx.beginPath();
      ctx.arc(hazard.w / 2, 15, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(hazard.w / 2 + 4, 14, 6, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#181c19";
      ctx.fillRect(hazard.w / 2 + 3, 11, 2, 6);
    } else if (hazard.kind === "cattle") {
      ctx.fillStyle = "#eee1c2";
      ctx.fillRect(2, 10, hazard.w - 8, hazard.h - 13);
      ctx.fillRect(hazard.w - 14, 4, 13, 18);
      ctx.strokeStyle = "#eee1c2";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hazard.w - 9, 7);
      ctx.lineTo(hazard.w - 15, 0);
      ctx.moveTo(hazard.w - 3, 8);
      ctx.lineTo(hazard.w + 3, 1);
      ctx.stroke();
      ctx.fillRect(6, hazard.h - 7, 4, 8);
      ctx.fillRect(hazard.w - 16, hazard.h - 7, 4, 8);
    } else if (hazard.kind === "boar") {
      ctx.fillStyle = "#8c5b42";
      ctx.fillRect(2, 9, hazard.w - 5, hazard.h - 10);
      ctx.fillRect(hazard.w - 9, 15, 12, 10);
      ctx.fillStyle = "#ead7b6";
      ctx.fillRect(hazard.w - 1, 20, 5, 2);
      ctx.fillRect(5, hazard.h - 5, 4, 7);
      ctx.fillRect(hazard.w - 12, hazard.h - 5, 4, 7);
    } else if (hazard.kind === "scylla") {
      ctx.fillStyle = "#243a3c";
      ctx.fillRect(hazard.w / 2 - 5, 0, 10, hazard.h);
      ctx.beginPath();
      ctx.arc(hazard.w / 2, hazard.h - 8, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d7f66f";
      ctx.fillRect(hazard.w / 2 + 3, hazard.h - 11, 3, 3);
    } else if (hazard.kind === "wave") {
      ctx.fillStyle = "rgba(220, 247, 239, 0.7)";
      ctx.beginPath();
      ctx.moveTo(0, hazard.h);
      ctx.quadraticCurveTo(hazard.w * 0.45, -4, hazard.w, hazard.h);
      ctx.fill();
    } else {
      ctx.fillRect(4, 9, hazard.w - 8, hazard.h - 9);
      ctx.beginPath();
      ctx.arc(hazard.w / 2, 8, Math.min(8, hazard.w / 3), 0, Math.PI * 2);
      ctx.fill();
      if (hazard.kind === "siren") {
        ctx.fillStyle = "rgba(238, 226, 199, 0.72)";
        ctx.beginPath();
        ctx.moveTo(5, 13);
        ctx.lineTo(-8, 22);
        ctx.lineTo(7, 25);
        ctx.fill();
      }
      ctx.fillStyle = "#f7e8c6";
      ctx.fillRect(hazard.w / 2 + 2, 6, 2, 2);
    }
    ctx.restore();
  }

  function drawDrop(hazard) {
    ctx.save();
    ctx.fillStyle = hazard.shape === "lightning" ? "#f5df65" : state.level.palette.ground;
    if (hazard.shape === "rock") {
      ctx.beginPath();
      ctx.moveTo(hazard.x + hazard.w * 0.15, hazard.y);
      ctx.lineTo(hazard.x + hazard.w * 0.86, hazard.y + 4);
      ctx.lineTo(hazard.x + hazard.w, hazard.y + hazard.h * 0.68);
      ctx.lineTo(hazard.x + hazard.w * 0.45, hazard.y + hazard.h);
      ctx.lineTo(hazard.x, hazard.y + hazard.h * 0.5);
      ctx.fill();
    } else if (hazard.shape === "lightning") {
      ctx.beginPath();
      ctx.moveTo(hazard.x + hazard.w * 0.62, hazard.y);
      ctx.lineTo(hazard.x + 4, hazard.y + hazard.h * 0.58);
      ctx.lineTo(hazard.x + hazard.w * 0.43, hazard.y + hazard.h * 0.56);
      ctx.lineTo(hazard.x + hazard.w * 0.22, hazard.y + hazard.h);
      ctx.lineTo(hazard.x + hazard.w, hazard.y + hazard.h * 0.38);
      ctx.lineTo(hazard.x + hazard.w * 0.6, hazard.y + hazard.h * 0.42);
      ctx.fill();
    } else {
      ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
      ctx.fillStyle = state.level.palette.edge;
      ctx.fillRect(hazard.x, hazard.y + hazard.h - 5, hazard.w, 5);
    }
    ctx.restore();
  }

  function drawBoulder(hazard) {
    ctx.save();
    ctx.fillStyle = state.level.palette.ground;
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = state.level.palette.edge;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hazard.x - 3, hazard.y - 2, hazard.radius * 0.46, 0.2, Math.PI * 1.4);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    ctx.save();
    ctx.fillStyle = state.level.palette.accent;
    state.particles.forEach((particle) => {
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillRect(particle.x, particle.y, 3, 3);
    });
    ctx.restore();
  }

  function drawPlayer() {
    const player = state.player;
    const moving = Math.abs(player.vx) > 20 && player.onGround;
    const legSwing = moving ? Math.sin(player.step) * 3 : 0;
    ctx.save();
    ctx.translate(Math.round(player.x + player.w / 2), Math.round(player.y + player.h / 2));
    ctx.scale(player.facing, 1);
    ctx.translate(-player.w / 2, -player.h / 2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.beginPath();
    ctx.ellipse(player.w / 2, player.h + 3, 11, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#e6d3a8";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(8, 27);
    ctx.lineTo(7 + legSwing, 37);
    ctx.moveTo(16, 27);
    ctx.lineTo(17 - legSwing, 37);
    ctx.stroke();

    ctx.fillStyle = "#a83a32";
    ctx.beginPath();
    ctx.moveTo(6, 14);
    ctx.lineTo(19, 14);
    ctx.lineTo(21, 30);
    ctx.lineTo(4, 30);
    ctx.fill();
    ctx.fillStyle = "#d7b15f";
    ctx.fillRect(5, 25, 16, 3);

    ctx.fillStyle = "#e6d3a8";
    ctx.beginPath();
    ctx.arc(12, 9, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#262c29";
    ctx.fillRect(14, 7, 2, 2);

    ctx.fillStyle = "#435c59";
    ctx.beginPath();
    ctx.arc(10, 6, 8, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(3, 5, 15, 3);
    ctx.fillStyle = "#d7f66f";
    ctx.beginPath();
    ctx.moveTo(9, 0);
    ctx.quadraticCurveTo(4, -8, 15, -8);
    ctx.quadraticCurveTo(21, -7, 17, -2);
    ctx.fill();
    ctx.restore();
  }

  function keyForEvent(event) {
    if (["ArrowLeft", "KeyA"].includes(event.code)) return "left";
    if (["ArrowRight", "KeyD"].includes(event.code)) return "right";
    if (["ArrowUp", "KeyW", "Space"].includes(event.code)) return "jump";
    return null;
  }

  window.addEventListener("keydown", (event) => {
    const control = keyForEvent(event);
    if (control) {
      event.preventDefault();
      if (!state.running && !ui.start.hidden && (control === "jump" || event.code === "Enter")) startGame();
      setControl(control, true);
    }
    if (event.code === "KeyR") {
      event.preventDefault();
      restartLevel(true);
    }
    if (event.code === "Escape") {
      event.preventDefault();
      togglePause();
    }
    if (event.code === "KeyM") setSound(state.muted);
  });

  window.addEventListener("keyup", (event) => {
    const control = keyForEvent(event);
    if (control) {
      event.preventDefault();
      setControl(control, false);
    }
  });

  document.querySelectorAll("[data-control]").forEach((button) => {
    const control = button.dataset.control;
    const press = (event) => {
      event.preventDefault();
      enableAudio();
      button.classList.add("pressed");
      setControl(control, true);
      canvas.focus({ preventScroll: true });
    };
    const release = (event) => {
      event.preventDefault();
      button.classList.remove("pressed");
      setControl(control, false);
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });

  ui.play.addEventListener("click", () => startGame());
  ui.newVoyage.addEventListener("click", resetVoyage);
  ui.resume.addEventListener("click", () => togglePause(false));
  ui.restart.addEventListener("click", () => restartLevel(true));
  ui.playAgain.addEventListener("click", resetVoyage);
  ui.sound.addEventListener("click", () => setSound(state.muted));

  window.addEventListener("blur", () => {
    state.keys.left = false;
    state.keys.right = false;
    state.keys.jump = false;
    if (state.running && !state.dying && !state.completing) togglePause(true);
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
  ui.sound.setAttribute("aria-pressed", "true");
  if (saved.current > 0 || saved.completed) {
    ui.play.textContent = saved.completed ? "Return to Ithaca" : `Continue from ${LEVELS[saved.current].shortSetting}`;
  }
  loadLevel(state.levelIndex, false);
  renderChapterList();
  requestAnimationFrame(frame);
})();
