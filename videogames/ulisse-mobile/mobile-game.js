(function () {
  "use strict";

  var levels = window.ULISSE_MOBILE_LEVELS;
  var canvas = document.getElementById("mobileCanvas");
  var ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  var width = 640;
  var height = 360;
  var saveKey = "ulisse-nessuno-mobile-save-v1";
  var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
    return window.setTimeout(function () { callback(now()); }, 16);
  };

  var ui = {
    start: document.getElementById("mobileStart"),
    play: document.getElementById("mobilePlay"),
    fresh: document.getElementById("mobileFresh"),
    pause: document.getElementById("mobilePause"),
    paused: document.getElementById("mobilePaused"),
    resume: document.getElementById("mobileResume"),
    sound: document.getElementById("mobileSound"),
    end: document.getElementById("mobileEnd"),
    again: document.getElementById("mobileAgain"),
    stats: document.getElementById("mobileStats"),
    restart: document.getElementById("mobileRestart"),
    left: document.getElementById("mobileLeft"),
    right: document.getElementById("mobileRight"),
    jump: document.getElementById("mobileJump"),
    chapter: document.getElementById("mobileChapter"),
    title: document.getElementById("mobileTitle"),
    setting: document.getElementById("mobileSetting"),
    deaths: document.getElementById("mobileDeaths"),
    hint: document.getElementById("mobileHint"),
    toast: document.getElementById("mobileToast"),
    numeral: document.getElementById("mobileNumeral"),
    place: document.getElementById("mobilePlace"),
    toastTitle: document.getElementById("mobileToastTitle"),
    flash: document.getElementById("mobileFlash"),
    list: document.getElementById("mobileLevelList")
  };

  if (!levels || !levels.length || !ctx) {
    if (ui.start) {
      ui.start.getElementsByTagName("h1")[0].innerHTML = "The voyage<br>could not load";
      ui.play.style.display = "none";
    }
    return;
  }

  var saved = readSave();
  var state = {
    index: saved.current,
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
    token: 0,
    lastTime: now(),
    startedAt: 0,
    toastTimer: 0,
    particles: []
  };

  var audioContext = null;

  function now() {
    return Date.now ? Date.now() : new Date().getTime();
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function pad(value) {
    value = String(value);
    return value.length < 2 ? "0" + value : value;
  }

  function hit(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function addClass(element, name) {
    if (!element) return;
    if ((" " + element.className + " ").indexOf(" " + name + " ") === -1) element.className += " " + name;
  }

  function removeClass(element, name) {
    if (!element) return;
    element.className = (" " + element.className + " ").replace(" " + name + " ", " ").replace(/^\s+|\s+$/g, "");
  }

  function readSave() {
    var parsed;
    try {
      parsed = JSON.parse(window.localStorage.getItem(saveKey));
      if (!parsed) throw new Error("empty");
      return {
        current: clamp(parseInt(parsed.current, 10) || 0, 0, levels.length - 1),
        unlocked: clamp(parseInt(parsed.unlocked, 10) || 0, 0, levels.length - 1),
        deaths: Math.max(0, parseInt(parsed.deaths, 10) || 0),
        completed: !!parsed.completed
      };
    } catch (error) {
      return { current: 0, unlocked: 0, deaths: 0, completed: false };
    }
  }

  function save() {
    try {
      window.localStorage.setItem(saveKey, JSON.stringify({
        current: state.index,
        unlocked: state.unlocked,
        deaths: state.deaths,
        completed: state.completedBefore || state.ended
      }));
    } catch (error) {
      return;
    }
  }

  function unlockAudio() {
    var AudioType;
    if (state.muted) return;
    try {
      if (!audioContext) {
        AudioType = window.AudioContext || window.webkitAudioContext;
        if (AudioType) audioContext = new AudioType();
      }
      if (audioContext && audioContext.state === "suspended" && audioContext.resume) audioContext.resume();
    } catch (error) {
      audioContext = null;
    }
  }

  function tone(frequency, duration, type, volume, endFrequency) {
    var oscillator;
    var gain;
    var start;
    if (state.muted || !audioContext) return;
    try {
      start = audioContext.currentTime;
      oscillator = audioContext.createOscillator();
      gain = audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode();
      oscillator.type = type || "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      if (oscillator.frequency.exponentialRampToValueAtTime) {
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency || frequency), start + duration);
      }
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume || 0.025, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      if (oscillator.start) oscillator.start(start); else oscillator.noteOn(start);
      if (oscillator.stop) oscillator.stop(start + duration + 0.02); else oscillator.noteOff(start + duration + 0.02);
    } catch (error) {
      return;
    }
  }

  function playSound(name) {
    if (name === "jump") tone(280, 0.08, "triangle", 0.022, 410);
    if (name === "trap") tone(175, 0.07, "square", 0.015, 120);
    if (name === "death") tone(140, 0.19, "sawtooth", 0.032, 48);
    if (name === "chapter") {
      tone(220, 0.15, "sine", 0.02, 330);
      window.setTimeout(function () { tone(330, 0.17, "sine", 0.018, 430); }, 85);
    }
    if (name === "home") {
      tone(220, 0.3, "triangle", 0.022, 330);
      window.setTimeout(function () { tone(330, 0.32, "triangle", 0.022, 440); }, 110);
    }
  }

  function setSound(on) {
    state.muted = !on;
    ui.sound.innerHTML = on ? "♪" : "×";
    ui.sound.setAttribute("aria-pressed", on ? "true" : "false");
    ui.sound.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
    if (on) {
      unlockAudio();
      tone(330, 0.07, "sine", 0.018, 390);
    }
  }

  function prepareLevel(index) {
    var level = JSON.parse(JSON.stringify(levels[index]));
    var i;
    var item;
    for (i = 0; i < level.platforms.length; i += 1) {
      item = level.platforms[i];
      item._id = i;
      item._visible = true;
      item._timer = 0;
      item._dir = 1;
      item._fallSpeed = 0;
      item._oldX = item.x;
      item._oldY = item.y;
    }
    for (i = 0; i < level.hazards.length; i += 1) {
      item = level.hazards[i];
      item._dir = 1;
      item._triggered = typeof item.trigger === "undefined";
      item._heard = false;
      item._timer = 0;
      item._vy = 0;
      item._rise = item.hidden ? 0 : 1;
    }
    return level;
  }

  function loadLevel(index, announce) {
    state.token += 1;
    state.index = clamp(index, 0, levels.length - 1);
    state.level = prepareLevel(state.index);
    state.player = {
      x: state.level.spawn.x,
      y: state.level.spawn.y,
      w: 16,
      h: 26,
      vx: 0,
      vy: 0,
      onGround: false,
      standing: null,
      coyote: 0,
      buffer: 0,
      facing: 1,
      step: 0
    };
    state.dying = false;
    state.completing = false;
    state.keys.left = false;
    state.keys.right = false;
    state.keys.jump = false;
    state.jumpQueued = false;
    state.particles = [];
    updateLabels();
    buildLevelList();
    save();
    if (announce && state.running) showToast();
    draw();
  }

  function updateLabels() {
    var level = levels[state.index];
    ui.chapter.innerHTML = pad(state.index + 1) + " / " + levels.length;
    ui.title.innerHTML = level.title;
    ui.setting.innerHTML = level.place;
    ui.deaths.innerHTML = pad(state.deaths);
    ui.hint.innerHTML = level.hint;
    ui.numeral.innerHTML = level.numeral;
    ui.place.innerHTML = level.place;
    ui.toastTitle.innerHTML = level.title;
  }

  function buildLevelList() {
    var i;
    var item;
    var button;
    var open;
    ui.list.innerHTML = "";
    for (i = 0; i < levels.length; i += 1) {
      item = document.createElement("li");
      button = document.createElement("button");
      open = i <= state.unlocked || state.completedBefore;
      button.type = "button";
      button.disabled = !open;
      if (i === state.index) addClass(button, "current");
      button.innerHTML = "<small>" + pad(i + 1) + (open ? "" : " · LOCKED") + "</small><strong>" + levels[i].title + "</strong><span>" + levels[i].place + "</span>";
      if (open) bindLevelButton(button, i);
      item.appendChild(button);
      ui.list.appendChild(item);
    }
  }

  function bindLevelButton(button, index) {
    button.addEventListener("click", function () {
      if (!state.running) start(index); else loadLevel(index, true);
      document.getElementById("stage").scrollIntoView();
    }, false);
  }

  function showToast() {
    window.clearTimeout(state.toastTimer);
    addClass(ui.toast, "show");
    state.toastTimer = window.setTimeout(function () { removeClass(ui.toast, "show"); }, 1700);
    playSound("chapter");
  }

  function start(index) {
    unlockAudio();
    state.running = true;
    state.paused = false;
    state.ended = false;
    if (!state.startedAt) state.startedAt = now();
    ui.start.hidden = true;
    ui.paused.hidden = true;
    ui.end.hidden = true;
    loadLevel(typeof index === "number" ? index : state.index, true);
    if (canvas.focus) canvas.focus();
  }

  function freshVoyage() {
    state.index = 0;
    state.unlocked = 0;
    state.deaths = 0;
    state.completedBefore = false;
    state.startedAt = now();
    save();
    start(0);
  }

  function restart(count) {
    if (!state.running || state.ended) return;
    if (count) state.deaths += 1;
    playSound("trap");
    loadLevel(state.index, false);
  }

  function togglePause(force) {
    if (!state.running || state.dying || state.completing || state.ended) return;
    state.paused = typeof force === "boolean" ? force : !state.paused;
    ui.paused.hidden = !state.paused;
    if (!state.paused) state.lastTime = now();
  }

  function zonesFor(player) {
    var result = { slow: 1, reverse: false, wind: 0, whirlpool: 0 };
    var hazards = state.level.hazards;
    var i;
    var hazard;
    for (i = 0; i < hazards.length; i += 1) {
      hazard = hazards[i];
      if (hazard.type !== "zone" || !hit(player, hazard)) continue;
      if (hazard.effect === "slow") result.slow = Math.min(result.slow, hazard.strength);
      if (hazard.effect === "reverse") result.reverse = true;
      if (hazard.effect === "windRight") result.wind += hazard.strength;
      if (hazard.effect === "windLeft") result.wind -= hazard.strength;
      if (hazard.effect === "whirlpool") result.whirlpool += hazard.strength;
    }
    return result;
  }

  function updatePlatforms(dt) {
    var player = state.player;
    var platforms = state.level.platforms;
    var standing = null;
    var i;
    var p;
    for (i = 0; i < platforms.length; i += 1) {
      p = platforms[i];
      p._oldX = p.x;
      p._oldY = p.y;
      if (p.move === "x" || p.move === "y") {
        p[p.move] += p.speed * p._dir * dt;
        if (p[p.move] <= p.min || p[p.move] >= p.max) {
          p[p.move] = clamp(p[p.move], p.min, p.max);
          p._dir *= -1;
        }
      }
      if (p.vanish && player.x > p.trigger) {
        p._timer += dt;
        if (p._timer >= p.delay) p._visible = false;
      }
      if (p.fall && player.standing === p._id) p._timer += dt;
      if (p.fall && p._timer >= p.delay) {
        p._fallSpeed += 790 * dt;
        p.y += p._fallSpeed * dt;
        if (p.y > height + 60) p._visible = false;
      }
      if (p._id === player.standing) standing = p;
    }
    if (standing && standing._visible) {
      player.x += standing.x - standing._oldX;
      player.y += standing.y - standing._oldY;
    }
  }

  function updatePlayer(dt) {
    var player = state.player;
    var zones;
    var left;
    var right;
    var swap;
    var direction;
    var target;
    var gravity;

    updatePlatforms(dt);
    zones = zonesFor(player);
    left = state.keys.left;
    right = state.keys.right;
    if (zones.reverse) {
      swap = left;
      left = right;
      right = swap;
    }
    direction = (right ? 1 : 0) - (left ? 1 : 0);
    target = direction * 172 * zones.slow;
    player.vx += (target - player.vx) * Math.min(1, 12 * dt);
    player.vx += zones.wind * dt;
    if (zones.whirlpool) {
      player.vx -= zones.whirlpool * 0.4 * dt;
      player.vy += zones.whirlpool * 0.8 * dt;
    }
    if (direction) player.facing = direction;

    if (state.jumpQueued) {
      player.buffer = 0.13;
      state.jumpQueued = false;
    } else {
      player.buffer = Math.max(0, player.buffer - dt);
    }
    player.coyote = player.onGround ? 0.11 : Math.max(0, player.coyote - dt);
    if (player.buffer > 0 && player.coyote > 0) {
      player.vy = -395;
      player.onGround = false;
      player.standing = null;
      player.coyote = 0;
      player.buffer = 0;
      dust(player.x + player.w / 2, player.y + player.h, 3);
      playSound("jump");
    }

    gravity = !state.keys.jump && player.vy < -55 ? 1.42 : 1;
    player.vy += 1060 * gravity * dt;
    player.vy = Math.min(620, player.vy);
    moveX(dt);
    moveY(dt);
    player.step += Math.abs(player.vx) * dt * 0.07;
    if (player.y > height + 48) die();
  }

  function livePlatforms() {
    var result = [];
    var platforms = state.level.platforms;
    var i;
    for (i = 0; i < platforms.length; i += 1) {
      if (platforms[i]._visible) result.push(platforms[i]);
    }
    return result;
  }

  function moveX(dt) {
    var player = state.player;
    var platforms = livePlatforms();
    var i;
    var p;
    player.x += player.vx * dt;
    for (i = 0; i < platforms.length; i += 1) {
      p = platforms[i];
      if (!hit(player, p)) continue;
      if (player.vx > 0) player.x = p.x - player.w;
      else if (player.vx < 0) player.x = p.x + p.w;
      player.vx = 0;
    }
    player.x = clamp(player.x, 0, width - player.w);
  }

  function moveY(dt) {
    var player = state.player;
    var platforms = livePlatforms();
    var oldY = player.y;
    var oldBottom = oldY + player.h;
    var landing = null;
    var i;
    var p;
    var horizontal;
    player.y += player.vy * dt;
    player.onGround = false;
    player.standing = null;

    if (player.vy >= 0) {
      for (i = 0; i < platforms.length; i += 1) {
        p = platforms[i];
        horizontal = player.x + player.w > p.x + 1 && player.x < p.x + p.w - 1;
        if (horizontal && oldBottom <= p.y + 4 && player.y + player.h >= p.y && (!landing || p.y < landing.y)) landing = p;
      }
      if (landing) {
        player.y = landing.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.standing = landing._id;
      }
    } else {
      for (i = 0; i < platforms.length; i += 1) {
        p = platforms[i];
        horizontal = player.x + player.w > p.x + 1 && player.x < p.x + p.w - 1;
        if (horizontal && oldY >= p.y + p.h - 3 && player.y <= p.y + p.h) {
          player.y = p.y + p.h;
          player.vy = 0;
          break;
        }
      }
    }
  }

  function hearTrap(hazard) {
    if (hazard._heard) return;
    hazard._heard = true;
    playSound("trap");
  }

  function updateHazards(dt) {
    var player = state.player;
    var hazards = state.level.hazards;
    var i;
    var h;
    var target;
    var area;
    var axis;
    var nearX;
    var nearY;
    var dx;
    var dy;
    for (i = 0; i < hazards.length; i += 1) {
      h = hazards[i];
      if (typeof h.trigger !== "undefined" && player.x >= h.trigger) {
        if (!h._triggered) hearTrap(h);
        h._triggered = true;
      }
      if (h.type === "spike") {
        target = h._triggered ? 1 : 0;
        h._rise += (target - h._rise) * Math.min(1, dt * 14);
        area = { x: h.x, y: h.y + h.h * (1 - h._rise), w: h.w, h: h.h * h._rise };
        if (h._rise > 0.48 && hit(player, area)) return die();
      } else if (h.type === "water") {
        if (hit(player, h)) return die();
      } else if (h.type === "enemy") {
        axis = h.axis === "y" ? "y" : "x";
        h[axis] += h.speed * h._dir * dt;
        if (h[axis] <= h.min || h[axis] >= h.max) {
          h[axis] = clamp(h[axis], h.min, h.max);
          h._dir *= -1;
        }
        if (hit(player, h)) return die();
      } else if (h.type === "drop" && h._triggered) {
        h._timer += dt;
        if (h._timer >= (h.delay || 0.08)) {
          h._vy += 860 * dt;
          h.y += h._vy * dt;
        }
        if (hit(player, h)) return die();
      } else if (h.type === "boulder" && h._triggered) {
        h._timer += dt;
        if (h._timer >= (h.delay || 0)) h.x += h.speed * dt;
        nearX = clamp(h.x, player.x, player.x + player.w);
        nearY = clamp(h.y, player.y, player.y + player.h);
        dx = h.x - nearX;
        dy = h.y - nearY;
        if (dx * dx + dy * dy < h.radius * h.radius) return die();
      }
    }
  }

  function dust(x, y, count) {
    var i;
    for (i = 0; i < count; i += 1) {
      state.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y,
        vx: (Math.random() - 0.5) * 42,
        vy: -12 - Math.random() * 28,
        life: 0.25,
        max: 0.25
      });
    }
  }

  function updateParticles(dt) {
    var next = [];
    var i;
    var p;
    for (i = 0; i < state.particles.length; i += 1) {
      p = state.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 280 * dt;
      p.life -= dt;
      if (p.life > 0) next.push(p);
    }
    state.particles = next;
  }

  function die() {
    var token;
    if (state.dying || state.completing || !state.running) return;
    state.dying = true;
    state.deaths += 1;
    ui.deaths.innerHTML = pad(state.deaths);
    save();
    playSound("death");
    removeClass(ui.flash, "flash");
    ui.flash.offsetWidth;
    addClass(ui.flash, "flash");
    token = state.token;
    window.setTimeout(function () {
      if (token === state.token) loadLevel(state.index, false);
    }, 220);
  }

  function complete() {
    var token;
    var i;
    if (state.dying || state.completing) return;
    state.completing = true;
    token = state.token;
    playSound(state.level.final ? "home" : "chapter");
    for (i = 0; i < 10; i += 1) {
      state.particles.push({
        x: state.level.goal.x + state.level.goal.w / 2,
        y: state.level.goal.y + state.level.goal.h / 2,
        vx: (Math.random() - 0.5) * 130,
        vy: -35 - Math.random() * 100,
        life: 0.55,
        max: 0.55
      });
    }
    window.setTimeout(function () {
      if (token !== state.token) return;
      if (state.level.final) finish();
      else {
        state.unlocked = Math.max(state.unlocked, state.index + 1);
        loadLevel(state.index + 1, true);
      }
    }, state.level.final ? 800 : 520);
  }

  function finish() {
    var seconds;
    var minutes;
    state.ended = true;
    state.running = false;
    state.completedBefore = true;
    state.unlocked = levels.length - 1;
    seconds = Math.max(1, Math.round((now() - state.startedAt) / 1000));
    minutes = Math.floor(seconds / 60);
    seconds %= 60;
    ui.stats.innerHTML = "14 chapters · " + state.deaths + " falls · " + minutes + ":" + pad(seconds) + " at sea";
    ui.end.hidden = false;
    save();
    buildLevelList();
  }

  function update(dt) {
    if (!state.running || state.paused || state.dying || state.completing) {
      updateParticles(dt);
      return;
    }
    updatePlayer(dt);
    if (state.dying) return;
    updateHazards(dt);
    if (state.dying) return;
    updateParticles(dt);
    if (hit(state.player, state.level.goal)) complete();
  }

  function loop(timestamp) {
    var current = typeof timestamp === "number" ? timestamp : now();
    var elapsed = Math.min(0.04, Math.max(0, (current - state.lastTime) / 1000));
    var steps = Math.max(1, Math.ceil(elapsed / 0.012));
    var i;
    state.lastTime = current;
    for (i = 0; i < steps; i += 1) update(elapsed / steps);
    draw();
    raf(loop);
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
    var level = state.level;
    var palette = level.palette;
    var i;
    var x;
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = palette[1];
    ctx.fillRect(0, 205, width, 155);
    ctx.globalAlpha = 0.23;
    ctx.fillStyle = palette[4];
    ctx.beginPath();
    ctx.arc(527, 78, level.scene === "underworld" ? 21 : 34, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (level.scene === "troy") {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = palette[2];
      for (i = 0; i < 6; i += 1) ctx.fillRect(28 + i * 108, 115 + (i % 2) * 25, 52, 120);
      ctx.globalAlpha = 1;
    } else if (level.scene === "cave") {
      ctx.fillStyle = palette[0];
      ctx.globalAlpha = 0.65;
      for (x = -20; x < width + 40; x += 75) {
        ctx.beginPath();
        ctx.arc(x, 58, 65, 0, Math.PI * 2, false);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (level.scene === "underworld") {
      ctx.fillStyle = palette[4];
      for (i = 0; i < 20; i += 1) {
        ctx.globalAlpha = 0.15 + (i % 3) * 0.08;
        ctx.fillRect((i * 91) % width, 38 + ((i * 47) % 150), 2, 2);
      }
      ctx.globalAlpha = 1;
    } else if (level.scene === "ithaca") {
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = palette[2];
      for (x = 60; x < 620; x += 105) {
        ctx.fillRect(x, 130, 20, 150);
        ctx.fillRect(x - 7, 123, 34, 8);
      }
      ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = palette[4];
      ctx.globalAlpha = 0.24;
      ctx.lineWidth = 1;
      for (i = 0; i < 4; i += 1) {
        ctx.beginPath();
        for (x = 0; x <= width; x += 20) {
          if (x === 0) ctx.moveTo(x, 222 + i * 20);
          else ctx.lineTo(x, 222 + i * 20 + Math.sin(x * 0.08) * 3);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawZones() {
    var hazards = state.level.hazards;
    var i;
    var h;
    ctx.save();
    for (i = 0; i < hazards.length; i += 1) {
      h = hazards[i];
      if (h.type !== "zone") continue;
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = h.effect === "reverse" ? "#f6c1df" : state.level.palette[4];
      ctx.fillRect(h.x, h.y, h.w, h.h);
      if (h.effect === "reverse") {
        ctx.globalAlpha = 0.25;
        ctx.font = "18px Georgia";
        ctx.fillText("♪", h.x + 30, h.y + 45);
        ctx.fillText("♪", h.x + h.w - 45, h.y + 78);
      }
    }
    ctx.restore();
  }

  function drawPlatforms() {
    var palette = state.level.palette;
    var platforms = state.level.platforms;
    var i;
    var p;
    for (i = 0; i < platforms.length; i += 1) {
      p = platforms[i];
      if (!p._visible) continue;
      ctx.save();
      if (p.vanish && p._timer > 0) ctx.globalAlpha = clamp(1 - p._timer / p.delay, 0.15, 1);
      ctx.fillStyle = palette[2];
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = palette[3];
      ctx.fillRect(p.x, p.y, p.w, 4);
      ctx.restore();
    }
  }

  function drawGoal() {
    var goal = state.level.goal;
    var palette = state.level.palette;
    ctx.fillStyle = palette[4];
    ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
    ctx.fillStyle = palette[2];
    ctx.fillRect(goal.x + 5, goal.y + 6, goal.w - 10, goal.h - 6);
    ctx.fillStyle = palette[4];
    ctx.fillRect(goal.x + goal.w - 8, goal.y + goal.h / 2, 2, 2);
    ctx.fillStyle = palette[4];
    ctx.font = "bold 7px Courier New";
    ctx.textAlign = "right";
    ctx.fillText(goal.label.toUpperCase(), goal.x + goal.w, goal.y - 6);
  }

  function drawHazards() {
    var hazards = state.level.hazards;
    var i;
    for (i = 0; i < hazards.length; i += 1) {
      if (hazards[i].type === "spike") drawSpike(hazards[i]);
      else if (hazards[i].type === "water") drawWater(hazards[i]);
      else if (hazards[i].type === "enemy") drawEnemy(hazards[i]);
      else if (hazards[i].type === "drop") drawDrop(hazards[i]);
      else if (hazards[i].type === "boulder") drawBoulder(hazards[i]);
    }
  }

  function drawSpike(hazard) {
    var rise = hazard.h * hazard._rise;
    var count;
    var piece;
    var i;
    if (rise < 0.2) return;
    count = Math.max(1, Math.round(hazard.w / 10));
    piece = hazard.w / count;
    ctx.fillStyle = hazard.kind === "fire" ? "#f06b3f" : "#e3ebe6";
    for (i = 0; i < count; i += 1) {
      ctx.beginPath();
      ctx.moveTo(hazard.x + i * piece, hazard.y + hazard.h);
      ctx.lineTo(hazard.x + (i + 0.5) * piece, hazard.y + hazard.h - rise);
      ctx.lineTo(hazard.x + (i + 1) * piece, hazard.y + hazard.h);
      ctx.fill();
    }
  }

  function drawWater(hazard) {
    var x;
    ctx.fillStyle = "rgba(8,75,84,0.78)";
    ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
    ctx.strokeStyle = "rgba(225,245,238,0.68)";
    ctx.beginPath();
    for (x = hazard.x; x < hazard.x + hazard.w; x += 16) {
      ctx.moveTo(x, hazard.y);
      ctx.quadraticCurveTo(x + 4, hazard.y - 3, x + 8, hazard.y);
      ctx.quadraticCurveTo(x + 12, hazard.y + 3, x + 16, hazard.y);
    }
    ctx.stroke();
  }

  function drawEnemy(hazard) {
    var palette = state.level.palette;
    ctx.save();
    if (hazard.kind === "shade") ctx.globalAlpha = 0.48;
    ctx.fillStyle = hazard.kind === "shade" ? "#c0d3cb" : "#92332f";
    if (hazard.kind === "cyclops") {
      ctx.fillStyle = "#6f6250";
      ctx.fillRect(hazard.x + 3, hazard.y + 10, hazard.w - 6, hazard.h - 10);
      ctx.beginPath();
      ctx.arc(hazard.x + hazard.w / 2, hazard.y + 10, 10, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = palette[4];
      ctx.fillRect(hazard.x + hazard.w / 2 + 1, hazard.y + 8, 4, 3);
    } else if (hazard.kind === "cattle") {
      ctx.fillStyle = "#eee1c2";
      ctx.fillRect(hazard.x + 2, hazard.y + 7, hazard.w - 6, hazard.h - 9);
      ctx.fillRect(hazard.x + hazard.w - 10, hazard.y + 3, 9, 12);
      ctx.fillRect(hazard.x + 5, hazard.y + hazard.h - 5, 3, 6);
      ctx.fillRect(hazard.x + hazard.w - 11, hazard.y + hazard.h - 5, 3, 6);
    } else if (hazard.kind === "boar") {
      ctx.fillStyle = "#8c5b42";
      ctx.fillRect(hazard.x + 1, hazard.y + 6, hazard.w - 3, hazard.h - 7);
      ctx.fillRect(hazard.x + hazard.w - 6, hazard.y + 10, 8, 7);
    } else if (hazard.kind === "scylla") {
      ctx.fillStyle = "#243a3c";
      ctx.fillRect(hazard.x + hazard.w / 2 - 3, hazard.y, 6, hazard.h);
      ctx.beginPath();
      ctx.arc(hazard.x + hazard.w / 2, hazard.y + hazard.h - 6, 9, 0, Math.PI * 2, false);
      ctx.fill();
    } else if (hazard.kind === "wave") {
      ctx.fillStyle = "rgba(225,245,238,0.72)";
      ctx.beginPath();
      ctx.moveTo(hazard.x, hazard.y + hazard.h);
      ctx.quadraticCurveTo(hazard.x + hazard.w * 0.45, hazard.y - 2, hazard.x + hazard.w, hazard.y + hazard.h);
      ctx.fill();
    } else {
      ctx.fillRect(hazard.x + 3, hazard.y + 7, hazard.w - 6, hazard.h - 7);
      ctx.beginPath();
      ctx.arc(hazard.x + hazard.w / 2, hazard.y + 6, 5, 0, Math.PI * 2, false);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawDrop(hazard) {
    ctx.fillStyle = hazard.shape === "lightning" ? "#f5df65" : state.level.palette[2];
    if (hazard.shape === "rock") {
      ctx.beginPath();
      ctx.moveTo(hazard.x + 4, hazard.y);
      ctx.lineTo(hazard.x + hazard.w - 3, hazard.y + 2);
      ctx.lineTo(hazard.x + hazard.w, hazard.y + hazard.h - 7);
      ctx.lineTo(hazard.x + hazard.w / 2, hazard.y + hazard.h);
      ctx.lineTo(hazard.x, hazard.y + hazard.h / 2);
      ctx.fill();
    } else if (hazard.shape === "lightning") {
      ctx.beginPath();
      ctx.moveTo(hazard.x + hazard.w * 0.6, hazard.y);
      ctx.lineTo(hazard.x + 3, hazard.y + hazard.h * 0.58);
      ctx.lineTo(hazard.x + hazard.w * 0.45, hazard.y + hazard.h * 0.55);
      ctx.lineTo(hazard.x + hazard.w * 0.22, hazard.y + hazard.h);
      ctx.lineTo(hazard.x + hazard.w, hazard.y + hazard.h * 0.38);
      ctx.fill();
    } else {
      ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
    }
  }

  function drawBoulder(hazard) {
    ctx.fillStyle = state.level.palette[2];
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.strokeStyle = state.level.palette[3];
    ctx.beginPath();
    ctx.arc(hazard.x - 2, hazard.y - 1, hazard.radius * 0.45, 0, Math.PI * 1.4, false);
    ctx.stroke();
  }

  function drawParticles() {
    var i;
    var particle;
    ctx.save();
    ctx.fillStyle = state.level.palette[4];
    for (i = 0; i < state.particles.length; i += 1) {
      particle = state.particles[i];
      ctx.globalAlpha = clamp(particle.life / particle.max, 0, 1);
      ctx.fillRect(particle.x, particle.y, 2, 2);
    }
    ctx.restore();
  }

  function drawPlayer() {
    var player = state.player;
    var swing = Math.abs(player.vx) > 12 && player.onGround ? Math.sin(player.step) * 2 : 0;
    ctx.save();
    ctx.translate(Math.round(player.x + player.w / 2), Math.round(player.y + player.h / 2));
    ctx.scale(player.facing, 1);
    ctx.translate(-player.w / 2, -player.h / 2);
    ctx.strokeStyle = "#e6d3a8";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(5, 18);
    ctx.lineTo(5 + swing, 25);
    ctx.moveTo(11, 18);
    ctx.lineTo(11 - swing, 25);
    ctx.stroke();
    ctx.fillStyle = "#a83a32";
    ctx.fillRect(3, 9, 11, 11);
    ctx.fillStyle = "#d7b15f";
    ctx.fillRect(3, 17, 11, 2);
    ctx.fillStyle = "#e6d3a8";
    ctx.beginPath();
    ctx.arc(8, 6, 5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "#405b57";
    ctx.beginPath();
    ctx.arc(7, 4, 6, Math.PI, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "#d7f66f";
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.quadraticCurveTo(3, -5, 11, -5);
    ctx.lineTo(13, -1);
    ctx.fill();
    ctx.restore();
  }

  function setControl(name, pressed) {
    if (name === "left" || name === "right") state.keys[name] = pressed;
    if (name === "jump") {
      state.keys.jump = pressed;
      if (pressed) state.jumpQueued = true;
    }
  }

  function bindControl(button, name) {
    function press(event) {
      if (event && event.preventDefault) event.preventDefault();
      unlockAudio();
      addClass(button, "is-down");
      setControl(name, true);
    }
    function release(event) {
      if (event && event.preventDefault) event.preventDefault();
      removeClass(button, "is-down");
      setControl(name, false);
    }
    button.addEventListener("touchstart", press, false);
    button.addEventListener("touchend", release, false);
    button.addEventListener("touchcancel", release, false);
    button.addEventListener("mousedown", press, false);
    button.addEventListener("mouseup", release, false);
    button.addEventListener("mouseleave", release, false);
  }

  function keyName(code) {
    if (code === 37 || code === 65) return "left";
    if (code === 39 || code === 68) return "right";
    if (code === 38 || code === 87 || code === 32) return "jump";
    return null;
  }

  document.addEventListener("keydown", function (event) {
    var name = keyName(event.keyCode);
    if (name) {
      if (event.preventDefault) event.preventDefault();
      setControl(name, true);
      if (!state.running && name === "jump") start();
    }
    if (event.keyCode === 82) restart(true);
    if (event.keyCode === 27) togglePause();
  }, false);

  document.addEventListener("keyup", function (event) {
    var name = keyName(event.keyCode);
    if (name) setControl(name, false);
  }, false);

  bindControl(ui.left, "left");
  bindControl(ui.right, "right");
  bindControl(ui.jump, "jump");
  ui.play.addEventListener("click", function () { start(); }, false);
  ui.fresh.addEventListener("click", freshVoyage, false);
  ui.restart.addEventListener("click", function () { restart(true); }, false);
  ui.pause.addEventListener("click", function () { togglePause(); }, false);
  ui.resume.addEventListener("click", function () { togglePause(false); }, false);
  ui.sound.addEventListener("click", function () { setSound(state.muted); }, false);
  ui.again.addEventListener("click", freshVoyage, false);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && state.running && !state.paused) togglePause(true);
  }, false);

  window.addEventListener("blur", function () {
    state.keys.left = false;
    state.keys.right = false;
    state.keys.jump = false;
  }, false);

  if (saved.current > 0 || saved.completed) {
    ui.play.innerHTML = saved.completed ? "Return to Ithaca" : "Continue from " + levels[saved.current].place;
  }
  loadLevel(state.index, false);
  raf(loop);
}());
