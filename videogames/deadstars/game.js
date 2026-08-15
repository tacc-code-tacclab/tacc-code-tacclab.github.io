(() => {
  "use strict";

  const TAU = Math.PI * 2;
  const WORLD = { w: 2400, h: 1600 };
  const TARGET_SOULS = 12;
  const ROUND_SECONDS = 150;
  const PLAYER_SHOT_COOLDOWN = .095;
  const PLAYER_BULLET_SPEED = 1260;
  const FORCE_MOBILE = /(?:^|[?&])mobile=1(?:&|$)/.test(globalThis.location?.search || "")
    || document.documentElement?.dataset?.forceMobile === "true";

  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d", { alpha: false });
  const groundTexture = new Image();
  const playerSprite = new Image();
  playerSprite.src = "assets/nox-game.webp";
  const enemySprite = new Image();
  enemySprite.src = "assets/enemy-game.webp";
  const playerDirections = new Image();
  playerDirections.src = "assets/nox-directions-v3.webp";
  const enemyDirections = new Image();
  enemyDirections.src = "assets/enemy-directions-v3.webp";
  const cemeteryProps = new Image();
  cemeteryProps.src = "assets/cemetery-props-v3.webp";
  const hauntedGrass = new Image();
  hauntedGrass.src = "assets/haunted-grass-v4.webp";
  const creatureProps = new Image();
  creatureProps.src = "assets/creatures-props-v4.webp";
  let groundPattern = null;

  const ui = {
    menu: document.querySelector("#menu"),
    how: document.querySelector("#how"),
    hud: document.querySelector("#hud"),
    result: document.querySelector("#result"),
    pause: document.querySelector("#pause"),
    pauseBtn: document.querySelector("#pause-btn"),
    mobile: document.querySelector("#mobile-controls"),
    play: document.querySelector("#play-btn"),
    again: document.querySelector("#again-btn"),
    menuBtn: document.querySelector("#menu-btn"),
    audio: document.querySelector("#audio-btn"),
    announcement: document.querySelector("#announcement"),
    feed: document.querySelector("#kill-feed"),
    timer: document.querySelector("#timer"),
    playerScore: document.querySelector("#player-score"),
    leaderName: document.querySelector("#leader-name"),
    leaderScore: document.querySelector("#leader-score"),
    hpFill: document.querySelector("#hp-fill"),
    hpText: document.querySelector("#hp-text"),
    killCount: document.querySelector("#kill-count"),
    hudName: document.querySelector("#hud-name"),
    portrait: document.querySelector("#portrait"),
    skill: document.querySelector("#skill-indicator"),
    skillLabel: document.querySelector("#skill-label"),
    shot: document.querySelector("#shot-indicator"),
    mobileFire: document.querySelector("#mobile-fire"),
    heroList: document.querySelector("#hero-list"),
    mapList: document.querySelector("#map-list"),
    record: document.querySelector("#record-line"),
    lobbyHero: document.querySelector("#lobby-hero"),
    selectedHeroName: document.querySelector("#selected-hero-name"),
  };

  const HEROES = {
    nox: {
      id: "nox",
      name: "NOX",
      glyph: "N",
      title: "Cacciatore del vespro",
      detail: "Veloce e leggero. Salto più lungo.",
      skill: "SALTO",
      color: "#bcff3c",
      dark: "#3b5b0b",
      hp: 980,
      speed: 255,
      radius: 25,
    },
    vela: {
      id: "vela",
      name: "VELA",
      glyph: "V",
      title: "Strega senza volto",
      detail: "Agile e spettrale. Atterra in silenzio.",
      skill: "SALTO",
      color: "#a986ff",
      dark: "#42266f",
      hp: 850,
      speed: 235,
      radius: 23,
    },
    becchino: {
      id: "becchino",
      name: "BECCHINO",
      glyph: "B",
      title: "Custode dell'ultima fossa",
      detail: "Pesante. L'atterraggio scuote le tombe.",
      skill: "SALTO",
      color: "#ff795e",
      dark: "#722516",
      hp: 1320,
      speed: 205,
      radius: 29,
    },
  };

  const MAPS = {
    cemetery: {
      id: "cemetery",
      name: "CIMITERO DELLE LANTERNE",
      detail: "Prato infestato, lapidi e fiumi di lava",
      icon: "♰",
      ground: "#183a20",
      ground2: "#28532d",
      line: "rgba(202,255,166,.09)",
      accent: "#aeca65",
      fog: "rgba(196,230,188,.038)",
    },
    catacombs: {
      id: "catacombs",
      name: "CATACOMBE SUSSURRANTI",
      detail: "Pietra umida e candele morenti",
      icon: "☠",
      ground: "#17120f",
      ground2: "#211915",
      line: "#30251f",
      accent: "#e7a65d",
      fog: "rgba(230,170,106,.04)",
    },
    blackwood: {
      id: "blackwood",
      name: "BOSCO SENZA ALBA",
      detail: "Alberi contorti e pozze maledette",
      icon: "♠",
      ground: "#0c1816",
      ground2: "#12211e",
      line: "#1d312d",
      accent: "#64c5b1",
      fog: "rgba(106,200,181,.045)",
    },
  };

  const BOT_NAMES = ["Corvo", "Maledetta", "Karn", "Sepolto", "Ombra", "Ruggine", "Acheron", "Falce"];

  const game = {
    scene: "menu",
    selectedHero: "nox",
    selectedMap: "cemetery",
    fighters: [],
    shards: [],
    bullets: [],
    particles: [],
    obstacles: [],
    decor: [],
    lavaRivers: [],
    player: null,
    time: ROUND_SECONDS,
    elapsed: 0,
    last: performance.now(),
    camera: { x: WORLD.w / 2, y: WORLD.h / 2, shake: 0 },
    matchSeed: 1138,
    uid: 1,
    audio: true,
    mutedByVisibility: false,
    ambienceClock: 0,
    soulSpawnClock: 0,
    soundClock: new Map(),
  };

  const input = {
    keys: new Set(),
    moveX: 0,
    moveY: 0,
    mobileFire: false,
    fireAim: null,
    pointerAim: null,
    joystickActive: false,
  };

  let audioContext = null;
  let dpr = 1;
  let vw = innerWidth;
  let vh = innerHeight;
  let performanceMode = "desktop";
  let record = loadRecord();

  function loadRecord() {
    try {
      return JSON.parse(localStorage.getItem("deadstars-record")) || { wins: 0, kills: 0 };
    } catch (_) {
      return { wins: 0, kills: 0 };
    }
  }

  function saveRecord() {
    try { localStorage.setItem("deadstars-record", JSON.stringify(record)); } catch (_) {}
    ui.record.textContent = `Vittorie: ${record.wins} · Record atterraggi: ${record.kills}`;
  }

  function buildMenu() {
    ui.heroList.innerHTML = Object.values(HEROES).map((hero) => `
      <button class="hero-card${hero.id === game.selectedHero ? " selected" : ""}" data-hero="${hero.id}" role="radio" aria-checked="${hero.id === game.selectedHero}" style="--hero-color:${hero.color}">
        <span class="hero-avatar">${hero.glyph}</span>
        <strong>${hero.name}</strong>
        <small>${hero.detail}</small>
        <em>${hero.title}</em>
      </button>`).join("");

    ui.mapList.innerHTML = Object.values(MAPS).map((map) => `
      <button class="map-card${map.id === game.selectedMap ? " selected" : ""}" data-map="${map.id}" data-icon="${map.icon}" role="radio" aria-checked="${map.id === game.selectedMap}" style="--map-color:${map.accent}">
        <strong>${map.name}</strong><small>${map.detail}</small>
      </button>`).join("");

    ui.heroList.addEventListener("click", (event) => {
      const card = event.target.closest("[data-hero]");
      if (!card) return;
      game.selectedHero = card.dataset.hero;
      ui.selectedHeroName.textContent = HEROES[game.selectedHero].name;
      const heroFilter = game.selectedHero === "vela" ? "hue-rotate(45deg)" : game.selectedHero === "becchino" ? "hue-rotate(285deg) saturate(.9)" : "none";
      ui.lobbyHero.style.filter = `${heroFilter} drop-shadow(0 22px 20px rgba(0,0,0,.6))`;
      ui.heroList.querySelectorAll("[data-hero]").forEach((el) => {
        const selected = el === card;
        el.classList.toggle("selected", selected);
        el.setAttribute("aria-checked", String(selected));
      });
      sound("select");
    });

    ui.mapList.addEventListener("click", (event) => {
      const card = event.target.closest("[data-map]");
      if (!card) return;
      game.selectedMap = card.dataset.map;
      if (game.selectedMap !== "cemetery" && !groundTexture.src) {
        groundTexture.src = "assets/cemetery-ground.webp";
        groundPattern = null;
      }
      ui.mapList.querySelectorAll("[data-map]").forEach((el) => {
        const selected = el === card;
        el.classList.toggle("selected", selected);
        el.setAttribute("aria-checked", String(selected));
      });
      game.matchSeed = Object.keys(MAPS).indexOf(game.selectedMap) * 7919 + 1138;
      createArena();
      sound("select");
    });
    saveRecord();
  }

  function show(element, value = true) { element.classList.toggle("active", value); }

  function setupUI() {
    buildMenu();
    ui.play.addEventListener("click", startGame);
    ui.again.addEventListener("click", startGame);
    ui.menuBtn.addEventListener("click", returnToMenu);
    document.querySelector("#how-btn").addEventListener("click", () => show(ui.how));
    document.querySelectorAll("[data-close='how']").forEach((button) => button.addEventListener("click", () => show(ui.how, false)));
    ui.pauseBtn.addEventListener("click", pauseGame);
    document.querySelector("#resume-btn").addEventListener("click", resumeGame);
    document.querySelector("#quit-btn").addEventListener("click", returnToMenu);
    ui.audio.addEventListener("click", () => {
      game.audio = !game.audio;
      ui.audio.textContent = `Suono: ${game.audio ? "ON" : "OFF"}`;
      ui.audio.setAttribute("aria-pressed", String(!game.audio));
      if (game.audio) sound("select");
    });
  }

  function resize() {
    vw = innerWidth;
    vh = innerHeight;
    performanceMode = isTouchLayout() ? "mobile" : "desktop";
    dpr = Math.min(devicePixelRatio || 1, performanceMode === "mobile" ? 1.25 : 1.65);
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    canvas.style.width = `${vw}px`;
    canvas.style.height = `${vh}px`;
    if (game.scene === "playing") show(ui.mobile, isTouchLayout());
  }

  function isTouchLayout() { return FORCE_MOBILE || matchMedia("(pointer: coarse)").matches || vw < 760; }

  function initAudio() {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (AudioCtor) audioContext = new AudioCtor();
    }
    if (audioContext?.state === "suspended") audioContext.resume().catch(() => {});
  }

  function sound(type) {
    if (!game.audio || !audioContext || game.mutedByVisibility) return;
    const now = audioContext.currentTime;
    const throttle = { shot: .055, enemyShot: .08, hit: .045, step: .16 }[type] || 0;
    if (now - (game.soundClock.get(type) || -10) < throttle) return;
    game.soundClock.set(type, now);
    const voices = {
      hit: [[150, 42, .105, "square", .052], [610, 105, .055, "sawtooth", .025]],
      collect: [[440, 840, .13, "sine", .055], [660, 1080, .16, "triangle", .025]],
      select: [[270, 410, .06, "triangle", .035]],
      skill: [[210, 610, .2, "sawtooth", .055], [92, 45, .24, "square", .025]],
      shot: [[920, 145, .105, "sawtooth", .052], [185, 58, .13, "square", .036]],
      enemyShot: [[620, 95, .11, "sawtooth", .028], [130, 48, .12, "square", .02]],
      step: [[105, 54, .055, "sine", .023], [68, 42, .04, "square", .012]],
      land: [[125, 32, .19, "square", .055], [72, 28, .24, "sine", .038]],
      death: [[180, 38, .48, "square", .06], [90, 24, .52, "sawtooth", .035]],
      win: [[320, 760, .7, "triangle", .07], [480, 1080, .74, "sine", .035]],
    }[type] || [[200, 100, .08, "sine", .03]];
    voices.forEach(([from, to, duration, wave, volume], index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = wave;
      osc.detune.value = index ? -7 : 5;
      osc.frequency.setValueAtTime(from, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
      osc.connect(gain).connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + duration + .01);
    });
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    game.mutedByVisibility = document.hidden;
    if (document.hidden && game.scene === "playing") pauseGame();
  });

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    input.keys.add(key);
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
    if (game.scene === "playing" && !event.repeat) {
      if (key === " ") useSkill(game.player);
      if (key === "escape") pauseGame();
    } else if (game.scene === "paused" && key === "escape") {
      resumeGame();
    }
  });
  window.addEventListener("keyup", (event) => input.keys.delete(event.key.toLowerCase()));
  window.addEventListener("blur", () => {
    input.keys.clear();
    input.moveX = 0;
    input.moveY = 0;
    input.joystickActive = false;
    input.mobileFire = false;
    input.fireAim = null;
    input.pointerAim = null;
  });
  canvas.addEventListener("pointerdown", initAudio);
  canvas.addEventListener("pointermove", (event) => {
    if (game.scene !== "playing" || event.pointerType === "touch") return;
    input.pointerAim = { x: event.clientX, y: event.clientY };
  });
  canvas.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "touch") input.pointerAim = null;
  });
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());

  const touchDirections = new Set();
  const movePad = document.querySelector(".mobile-dpad");
  const moveKnob = document.querySelector(".mobile-stick-knob");
  const updateMoveJoystick = (event) => {
    if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return;
    const rect = movePad.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distanceFromCenter = Math.hypot(dx, dy);
    const radius = rect.width * .34;
    const strength = clamp((distanceFromCenter - 5) / Math.max(1, radius - 5), 0, 1);
    const scale = distanceFromCenter > 0 ? Math.min(radius, distanceFromCenter) / distanceFromCenter : 0;
    input.moveX = distanceFromCenter > 7 ? dx / distanceFromCenter * strength : 0;
    input.moveY = distanceFromCenter > 7 ? dy / distanceFromCenter * strength : 0;
    if (moveKnob) moveKnob.style.transform = `translate(${dx * scale}px, ${dy * scale}px)`;
    document.querySelectorAll("[data-direction]").forEach((button) => {
      const active = button.dataset.direction === "left" ? input.moveX < -.32
        : button.dataset.direction === "right" ? input.moveX > .32
          : button.dataset.direction === "up" ? input.moveY < -.32 : input.moveY > .32;
      button.classList.toggle("pressed", active);
    });
  };
  const stopMoveJoystick = (event) => {
    event.preventDefault();
    input.joystickActive = false;
    input.moveX = 0;
    input.moveY = 0;
    if (moveKnob) moveKnob.style.transform = "translate(0, 0)";
    document.querySelectorAll("[data-direction]").forEach((button) => button.classList.remove("pressed"));
  };
  movePad.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation?.();
    movePad.setPointerCapture?.(event.pointerId);
    input.joystickActive = true;
    updateMoveJoystick(event);
  }, { capture: true });
  movePad.addEventListener("pointermove", (event) => {
    if (input.joystickActive) updateMoveJoystick(event);
  }, { capture: true });
  movePad.addEventListener("pointerup", stopMoveJoystick, { capture: true });
  movePad.addEventListener("pointercancel", stopMoveJoystick, { capture: true });
  document.querySelector("#mobile-skill").addEventListener("pointerdown", (event) => { event.preventDefault(); useSkill(game.player); });
  {
    const fireButton = document.querySelector("#mobile-fire");
    const updateFireAim = (event) => {
      if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return;
      const rect = fireButton.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) > 8) input.fireAim = Math.atan2(dy, dx);
    };
    const startFire = (event) => {
      event.preventDefault();
      fireButton.setPointerCapture?.(event.pointerId);
      input.mobileFire = true;
      updateFireAim(event);
      shoot(game.player);
    };
    const stopFire = (event) => {
      event.preventDefault();
      input.mobileFire = false;
      input.fireAim = null;
    };
    fireButton.addEventListener("pointerdown", startFire);
    fireButton.addEventListener("pointermove", (event) => {
      if (input.mobileFire) updateFireAim(event);
    });
    fireButton.addEventListener("pointerup", stopFire);
    fireButton.addEventListener("pointercancel", stopFire);
    fireButton.addEventListener("lostpointercapture", stopFire);
  }

  function seededRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value + 0x6D2B79F5) | 0;
      let t = Math.imul(value ^ (value >>> 15), 1 | value);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function createArena() {
    const rng = seededRandom(game.matchSeed);
    game.obstacles = [];
    game.decor = [];
    game.lavaRivers = game.selectedMap === "cemetery" ? [
      { width: 58, points: [[-70, 735], [190, 705], [410, 625], [650, 675], [860, 805]] },
      { width: 64, points: [[1515, 990], [1735, 1060], [1960, 985], [2200, 1045], [2470, 955]] },
    ] : [];
    const addObstacle = (x, y, w, h, type) => game.obstacles.push({ x, y, w, h, type });

    // A symmetrical, readable battlefield with safe spawn lanes.
    const layout = [
      [390, 270, 170, 80], [WORLD.w - 560, 270, 170, 80],
      [390, WORLD.h - 350, 170, 80], [WORLD.w - 560, WORLD.h - 350, 170, 80],
      [850, 280, 110, 210], [WORLD.w - 960, 280, 110, 210],
      [850, WORLD.h - 490, 110, 210], [WORLD.w - 960, WORLD.h - 490, 110, 210],
      [WORLD.w / 2 - 260, WORLD.h / 2 - 50, 140, 100],
      [WORLD.w / 2 + 120, WORLD.h / 2 - 50, 140, 100],
      [WORLD.w / 2 - 55, WORLD.h / 2 - 300, 110, 125],
      [WORLD.w / 2 - 55, WORLD.h / 2 + 175, 110, 125],
    ];
    const types = game.selectedMap === "blackwood"
      ? ["thorn-hedge", "stump", "thorn-hedge", "stump"]
      : game.selectedMap === "catacombs"
        ? ["bone-wall", "sarcophagus", "bone-wall", "coffin-stack"]
        : [
          "stone-wall-art", "stone-wall-art", "stone-wall-art", "stone-wall-art",
          "mausoleum-art", "gate-art", "mausoleum-art", "gate-art",
          "coffin-art", "coffin-art", "grave-art", "cross-art",
        ];
    layout.forEach((item, index) => addObstacle(...item, types[index % types.length]));

    const decorTypes = game.selectedMap === "cemetery"
      ? [
        "grave", "grave", "grave", "cross", "cross", "lantern", "bones", "grass", "coffin", "iron-fence", "angel",
        "snake", "snake2", "spider", "spider2", "skull-pile", "thorn-plant",
      ]
      : game.selectedMap === "catacombs"
        ? ["skull", "candle", "candle", "crack", "bones", "rune", "coffin", "lantern"]
        : ["dead-tree", "dead-tree", "mushroom", "puddle", "bones", "grass", "lantern", "iron-fence"];

    const decorCount = performanceMode === "mobile" ? 150 : 220;
    for (let i = 0; i < decorCount; i += 1) {
      const x = 45 + rng() * (WORLD.w - 90);
      const y = 45 + rng() * (WORLD.h - 90);
      const nearObstacle = game.obstacles.some((o) => x > o.x - 40 && x < o.x + o.w + 40 && y > o.y - 40 && y < o.y + o.h + 40);
      if (!nearObstacle && !inLava(x, y, 12)) game.decor.push({ x, y, type: decorTypes[Math.floor(rng() * decorTypes.length)], size: .72 + rng() * .58, rot: rng() * TAU, variant: rng(), phase: rng() * TAU });
    }

    if (game.selectedMap === "cemetery") {
      // Curated rows and shrines make the graveyard read as a designed place, not random boxes.
      const anchors = [
        [180, 760, "grave", 1.25], [260, 760, "cross", 1.05], [340, 760, "grave", 1.15],
        [WORLD.w - 340, 820, "grave", 1.15], [WORLD.w - 260, 820, "cross", 1.05], [WORLD.w - 180, 820, "grave", 1.25],
        [WORLD.w / 2 - 390, 125, "angel", 1.15], [WORLD.w / 2 + 390, WORLD.h - 125, "dead-tree", 1.2],
        [1050, 250, "altar", 1.08], [1400, 1380, "skull-pile", .92],
        [520, 920, "snake", .82], [1860, 720, "snake2", .8],
        [730, 1200, "spider", .76], [2060, 520, "spider2", .78],
        [820, 790, "lava-rock", .86], [1570, 1020, "lava-rock", .9],
      ];
      anchors.forEach(([x, y, type, size], index) => game.decor.push({ x, y, type, size, rot: 0, variant: .84 + index * .01, phase: index * .73 }));
    }
  }

  function spawnPoint(index = 0) {
    const points = [
      [WORLD.w / 2, WORLD.h / 2 + 420],
      [240, 250], [WORLD.w - 240, 250],
      [240, WORLD.h - 250], [WORLD.w - 240, WORLD.h - 250],
      [WORLD.w / 2, 180], [WORLD.w / 2, WORLD.h - 180],
    ];
    const base = points[index % points.length];
    return { x: base[0] + (Math.random() - .5) * 80, y: base[1] + (Math.random() - .5) * 80 };
  }

  function spawnFreeShard(x, y) {
    let sx = x;
    let sy = y;
    for (let attempt = 0; attempt < 24 && (sx == null || collidesObstacle(sx, sy, 22)); attempt += 1) {
      sx = 90 + Math.random() * (WORLD.w - 180);
      sy = 90 + Math.random() * (WORLD.h - 180);
    }
    if (sx == null || sy == null) return;
    game.shards.push({ x: sx, y: sy, vx: 0, vy: 0, radius: 10, life: 40, phase: Math.random() * TAU });
  }

  function makeFighter({ heroId, name, bot, spawnIndex }) {
    const hero = HEROES[heroId];
    const point = spawnPoint(spawnIndex);
    return {
      id: game.uid++,
      name,
      bot,
      hero,
      x: point.x,
      y: point.y,
      z: 0,
      vz: 0,
      vx: 0,
      vy: 0,
      targetVx: 0,
      targetVy: 0,
      aim: -Math.PI / 2,
      targetAim: -Math.PI / 2,
      moveAmount: 0,
      movePhase: Math.random() * TAU,
      recoil: 0,
      stepCd: 0,
      radius: hero.radius,
      hp: hero.hp,
      maxHp: hero.hp,
      score: 0,
      kills: 0,
      skillCd: 0,
      shotCd: 0,
      alive: true,
      respawn: 0,
      invuln: 1.4,
      flash: 0,
      lastHit: 0,
      killer: null,
      stun: 0,
      landedPulse: 0,
      lavaCd: 0,
      ai: { think: 0, target: null, enemy: null, moveAngle: Math.random() * TAU, strafe: Math.random() < .5 ? -1 : 1 },
    };
  }

  function startGame() {
    initAudio();
    if (game.selectedMap !== "cemetery" && !groundTexture.src) groundTexture.src = "assets/cemetery-ground.webp";
    game.scene = "playing";
    game.time = ROUND_SECONDS;
    game.elapsed = 0;
    game.soulSpawnClock = 1.5;
    game.uid = 1;
    game.matchSeed = Date.now() % 100000 + Object.keys(MAPS).indexOf(game.selectedMap) * 7919;
    game.shards.length = 0;
    game.bullets.length = 0;
    game.particles.length = 0;
    game.fighters.length = 0;
    createArena();

    game.player = makeFighter({ heroId: game.selectedHero, name: "TU", bot: false, spawnIndex: 0 });
    game.fighters.push(game.player);
    const heroIds = Object.keys(HEROES);
    const shuffledNames = [...BOT_NAMES].sort(() => Math.random() - .5);
    for (let i = 0; i < 5; i += 1) {
      game.fighters.push(makeFighter({
        heroId: heroIds[(i + Math.floor(Math.random() * heroIds.length)) % heroIds.length],
        name: shuffledNames[i],
        bot: true,
        spawnIndex: i + 1,
      }));
    }
    for (let i = 0; i < 22; i += 1) spawnFreeShard();

    game.camera.x = game.player.x;
    game.camera.y = game.player.y;
    game.camera.shake = 0;
    ui.feed.innerHTML = "";
    show(ui.menu, false);
    if (performanceMode === "mobile") ui.lobbyHero.removeAttribute?.("src");
    show(ui.result, false);
    show(ui.pause, false);
    show(ui.hud);
    show(ui.pauseBtn);
    show(ui.mobile, isTouchLayout());
    ui.hudName.textContent = game.player.hero.name;
    ui.portrait.textContent = game.player.hero.glyph;
    ui.portrait.style.borderColor = game.player.hero.color;
    ui.portrait.style.color = game.player.hero.color;
    ui.skillLabel.textContent = game.player.hero.skill;
    announce("MIETITURA DELLE ANIME");
    sound("select");
    updateHUD();
  }

  function returnToMenu() {
    game.scene = "menu";
    input.keys.clear();
    touchDirections.clear();
    input.moveX = 0;
    input.moveY = 0;
    input.joystickActive = false;
    input.mobileFire = false;
    input.fireAim = null;
    input.pointerAim = null;
    show(ui.result, false);
    show(ui.pause, false);
    show(ui.hud, false);
    show(ui.pauseBtn, false);
    show(ui.mobile, false);
    if (!ui.lobbyHero.getAttribute?.("src")) ui.lobbyHero.src = "assets/nox-lobby.webp";
    show(ui.menu);
    game.matchSeed = Object.keys(MAPS).indexOf(game.selectedMap) * 7919 + 1138;
    createArena();
  }

  function pauseGame() {
    if (game.scene !== "playing") return;
    game.scene = "paused";
    touchDirections.clear();
    input.moveX = 0;
    input.moveY = 0;
    input.mobileFire = false;
    show(ui.pause);
    show(ui.mobile, false);
  }

  function resumeGame() {
    if (game.scene !== "paused") return;
    game.scene = "playing";
    game.last = performance.now();
    show(ui.pause, false);
    show(ui.mobile, isTouchLayout());
  }

  function endGame(winner = null) {
    if (game.scene !== "playing") return;
    game.scene = "result";
    const ranking = [...game.fighters].sort((a, b) => b.score - a.score || b.kills - a.kills);
    const place = ranking.findIndex((f) => f === game.player) + 1;
    const won = place === 1 && (!winner || winner === game.player);
    document.querySelector("#result-eyebrow").textContent = won ? "VITTORIA" : `HA VINTO ${ranking[0].name}`;
    document.querySelector("#result-title").textContent = won ? "LA NOTTE È TUA" : "L'ABISSO TI RECLAMA";
    document.querySelector("#result-title").style.color = won ? "var(--acid)" : "var(--blood)";
    document.querySelector("#result-place").textContent = `${place}°`;
    document.querySelector("#result-souls").textContent = game.player.score;
    document.querySelector("#result-kills").textContent = game.player.kills;
    if (won) record.wins += 1;
    record.kills = Math.max(record.kills, game.player.kills);
    saveRecord();
    show(ui.hud, false);
    show(ui.pauseBtn, false);
    show(ui.mobile, false);
    setTimeout(() => show(ui.result), 450);
    sound(won ? "win" : "death");
  }

  function announce(text) {
    ui.announcement.textContent = text;
    ui.announcement.classList.remove("show");
    void ui.announcement.offsetWidth;
    ui.announcement.classList.add("show");
  }

  function addFeed(attacker, victim) {
    const item = document.createElement("div");
    item.className = "feed-item";
    const action = attacker.lastAttack === "shot" ? "ha trafitto" : "ha schiacciato";
    item.innerHTML = `<strong>${escapeHtml(attacker.name)}</strong> ${action} ${escapeHtml(victim.name)}`;
    ui.feed.prepend(item);
    while (ui.feed.children.length > 4) ui.feed.lastElementChild.remove();
    setTimeout(() => item.remove(), 4600);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function angleDelta(a, b) {
    let delta = (a - b) % TAU;
    if (delta > Math.PI) delta -= TAU;
    if (delta < -Math.PI) delta += TAU;
    return delta;
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  function distanceToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSquared = dx * dx + dy * dy || 1;
    const amount = clamp(((px - ax) * dx + (py - ay) * dy) / lengthSquared, 0, 1);
    return Math.hypot(px - (ax + dx * amount), py - (ay + dy * amount));
  }

  function inLava(x, y, padding = 0) {
    return game.lavaRivers.some((river) => {
      for (let i = 1; i < river.points.length; i += 1) {
        const [ax, ay] = river.points[i - 1];
        const [bx, by] = river.points[i];
        if (distanceToSegment(x, y, ax, ay, bx, by) < river.width * .43 + padding) return true;
      }
      return false;
    });
  }

  function collidesObstacle(x, y, radius) {
    return game.obstacles.some((o) => {
      const nx = clamp(x, o.x, o.x + o.w);
      const ny = clamp(y, o.y, o.y + o.h);
      return (x - nx) ** 2 + (y - ny) ** 2 < radius ** 2;
    });
  }

  function moveFighter(fighter, dx, dy) {
    const radius = fighter.radius;
    let nx = clamp(fighter.x + dx, radius + 18, WORLD.w - radius - 18);
    if (fighter.z > 30 || !collidesObstacle(nx, fighter.y, radius)) fighter.x = nx;
    let ny = clamp(fighter.y + dy, radius + 18, WORLD.h - radius - 18);
    if (fighter.z > 30 || !collidesObstacle(fighter.x, ny, radius)) fighter.y = ny;
  }

  function useSkill(fighter) {
    if (!fighter?.alive || fighter.skillCd > 0 || fighter.z > 1 || fighter.stun > 0 || game.scene !== "playing") return;
    fighter.lastAttack = "jump";
    fighter.skillCd = .78;
    fighter.z = 1;
    fighter.vz = fighter.hero.id === "nox" ? 500 : fighter.hero.id === "vela" ? 465 : 430;
    fighter.invuln = Math.max(fighter.invuln, .12);
    burst(fighter.x, fighter.y, fighter.hero.color, 10, 125);
    if (!fighter.bot) sound("skill");
  }

  function shoot(fighter) {
    if (!fighter?.alive || fighter.shotCd > 0 || fighter.stun > 0 || game.scene !== "playing") return false;
    const angle = fighter.aim + (fighter.bot ? (Math.random() - .5) * .085 : 0);
    const color = fighter.bot ? "#ff304d" : "#76ff35";
    const speed = fighter.bot ? 980 : PLAYER_BULLET_SPEED;
    const muzzle = fighter.radius + 32;
    fighter.lastAttack = "shot";
    fighter.shotCd = fighter.bot ? .24 + Math.random() * .09 : PLAYER_SHOT_COOLDOWN;
    fighter.recoil = 1;
    game.bullets.push({
      x: fighter.x + Math.cos(angle) * muzzle,
      y: fighter.y + Math.sin(angle) * muzzle,
      z: Math.max(18, fighter.z + 20),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      owner: fighter,
      radius: fighter.bot ? 10.8 : 12.5,
      damage: fighter.bot ? 82 : 108,
      life: .94,
      maxLife: .94,
      color,
      phase: Math.random() * TAU,
    });
    const bulletCap = performanceMode === "mobile" ? 95 : 170;
    if (game.bullets.length > bulletCap) game.bullets.splice(0, game.bullets.length - bulletCap);
    burst(
      fighter.x + Math.cos(angle) * (fighter.radius + 18),
      fighter.y + Math.sin(angle) * (fighter.radius + 18),
      color,
      fighter.bot ? 5 : 8,
      120,
    );
    if (!fighter.bot) sound("shot");
    else if (game.player?.alive && distance(fighter, game.player) < 720) sound("enemyShot");
    return true;
  }

  function damageFighter(target, amount, attacker, knockX = 0, knockY = 0) {
    if (!target.alive || target.invuln > 0 || target === attacker) return false;
    const applied = amount;
    target.hp -= applied;
    target.flash = .12;
    target.lastHit = 3.8;
    target.killer = attacker;
    if (knockX || knockY) moveFighter(target, knockX, knockY);
    burst(target.x, target.y, target.hero.color, 5, 105);
    if (target === game.player || attacker === game.player) sound("hit");
    if (target.hp <= 0) killFighter(target, attacker);
    return true;
  }

  function killFighter(victim, attacker) {
    if (!victim.alive) return;
    victim.alive = false;
    victim.respawn = 2.8;
    victim.hp = 0;
    victim.z = 0;
    victim.vz = 0;
    const lost = Math.min(victim.score, Math.max(1, Math.ceil(victim.score * .38)));
    victim.score -= lost;
    const drops = Math.max(1, lost);
    for (let i = 0; i < drops; i += 1) {
      const angle = (i / drops) * TAU + Math.random() * .7;
      game.shards.push({
        x: victim.x,
        y: victim.y,
        vx: Math.cos(angle) * (90 + Math.random() * 130),
        vy: Math.sin(angle) * (90 + Math.random() * 130),
        radius: 10,
        life: 18,
        phase: Math.random() * TAU,
      });
    }
    if (attacker && attacker !== victim) {
      attacker.kills += 1;
      addFeed(attacker, victim);
    }
    burst(victim.x, victim.y, "#ff3d61", 32, 260);
    if (victim === game.player) announce("SEI STATO SEPOLTO");
    if (victim === game.player || attacker === game.player) sound("death");
    game.camera.shake = victim === game.player ? 16 : Math.max(game.camera.shake, 7);
  }

  function respawnFighter(fighter) {
    const point = spawnPoint(1 + Math.floor(Math.random() * 6));
    fighter.x = point.x;
    fighter.y = point.y;
    fighter.hp = fighter.maxHp;
    fighter.z = 0;
    fighter.vz = 0;
    fighter.vx = 0;
    fighter.vy = 0;
    fighter.targetVx = 0;
    fighter.targetVy = 0;
    fighter.alive = true;
    fighter.invuln = 1.7;
    fighter.lastHit = 0;
    fighter.stun = 0;
    fighter.shotCd = .24;
    fighter.recoil = 0;
    fighter.moveAmount = 0;
    fighter.lavaCd = .75;
    burst(fighter.x, fighter.y, fighter.hero.color, 18, 170);
    if (fighter === game.player) announce("RISORTO");
  }

  function burst(x, y, color, count = 8, speed = 100) {
    const fxCount = performanceMode === "mobile" ? Math.max(2, Math.ceil(count * .58)) : count;
    for (let i = 0; i < fxCount; i += 1) {
      const angle = Math.random() * TAU;
      const velocity = speed * (.35 + Math.random() * .65);
      game.particles.push({
        x, y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: .28 + Math.random() * .55,
        maxLife: .83,
        size: 2 + Math.random() * 5,
        color,
      });
    }
    const particleCap = performanceMode === "mobile" ? 130 : 300;
    if (game.particles.length > particleCap) game.particles.splice(0, game.particles.length - particleCap);
  }

  function updatePlayer(fighter, dt) {
    let mx = 0;
    let my = 0;
    if (input.keys.has("arrowup")) my -= 1;
    if (input.keys.has("arrowdown")) my += 1;
    if (input.keys.has("arrowleft")) mx -= 1;
    if (input.keys.has("arrowright")) mx += 1;
    if (Math.hypot(input.moveX, input.moveY) > .08) { mx = input.moveX; my = input.moveY; }
    const length = Math.hypot(mx, my);
    let desiredAim = length > 0 ? Math.atan2(my, mx) : null;
    if (input.mobileFire && input.fireAim !== null) desiredAim = input.fireAim;
    if (input.pointerAim) {
      const pointer = screenToWorld(input.pointerAim.x, input.pointerAim.y);
      desiredAim = Math.atan2(pointer.y - fighter.y, pointer.x - fighter.x);
    }
    if (desiredAim !== null) {
      fighter.targetAim = desiredAim;
      fighter.aim += angleDelta(fighter.targetAim, fighter.aim) * (1 - Math.exp(-dt * 20));
    }

    const airBoost = fighter.z > 0 ? 1.12 : 1;
    if (length > 0) {
      // Two arrows combine into an explicit 45° direction; normalization keeps diagonal speed natural.
      mx /= length;
      my /= length;
      fighter.targetVx = mx * fighter.hero.speed * airBoost;
      fighter.targetVy = my * fighter.hero.speed * airBoost;
    } else {
      fighter.targetVx = 0;
      fighter.targetVy = 0;
    }
    const steering = 1 - Math.exp(-dt * (length > 0 ? 18 : 14));
    fighter.vx += (fighter.targetVx - fighter.vx) * steering;
    fighter.vy += (fighter.targetVy - fighter.vy) * steering;
    const currentSpeed = Math.hypot(fighter.vx, fighter.vy);
    const moving = currentSpeed > 3;
    fighter.moveAmount += ((moving ? clamp(currentSpeed / fighter.hero.speed, 0, 1) : 0) - fighter.moveAmount) * (1 - Math.exp(-dt * 12));
    if (moving) {
      moveFighter(fighter, fighter.vx * dt, fighter.vy * dt);
      fighter.movePhase += dt * (fighter.z > 0 ? 8 : 13);
      if (fighter.z <= 1 && fighter.stepCd <= 0) {
        fighter.stepCd = .23;
        sound("step");
      }
    }
    if (input.keys.has("v") || input.keys.has("x") || input.mobileFire) shoot(fighter);
  }

  function updateBot(bot, dt) {
    bot.ai.think -= dt;
    if (bot.ai.think <= 0) {
      bot.ai.think = .2 + Math.random() * .22;
      const living = game.fighters.filter((f) => f.alive && f !== bot && f.z < 45);
      const closeEnemy = living.sort((a, b) => distance(bot, a) - distance(bot, b))[0];
      const closeShard = [...game.shards].sort((a, b) => distance(bot, a) - distance(bot, b))[0];
      bot.ai.enemy = closeEnemy || null;
      bot.ai.target = closeShard || closeEnemy;
      if (closeEnemy && distance(bot, closeEnemy) < 115 && Math.random() < .45) bot.ai.target = closeEnemy;
      if (Math.random() < .18) bot.ai.strafe *= -1;
    }

    const target = bot.ai.target;
    if (!target) {
      bot.moveAmount *= Math.pow(.04, dt);
      bot.targetVx = 0;
      bot.targetVy = 0;
      bot.vx += (bot.targetVx - bot.vx) * (1 - Math.exp(-dt * 9));
      bot.vy += (bot.targetVy - bot.vy) * (1 - Math.exp(-dt * 9));
      if (Math.hypot(bot.vx, bot.vy) > 3) moveFighter(bot, bot.vx * dt, bot.vy * dt);
      return;
    }
    const dx = target.x - bot.x;
    const dy = target.y - bot.y;
    const dist = Math.max(1, Math.hypot(dx, dy));
    let angle = Math.atan2(dy, dx);
    const isEnemy = Boolean(target.hero);
    const enemy = bot.ai.enemy?.alive ? bot.ai.enemy : null;
    const enemyDistance = enemy ? distance(bot, enemy) : Infinity;
    const attackAngle = enemy ? Math.atan2(enemy.y - bot.y, enemy.x - bot.x) : angle;
    bot.targetAim = attackAngle;
    bot.aim += angleDelta(bot.targetAim, bot.aim) * (1 - Math.exp(-dt * 13));
    if (enemy && enemyDistance < 720 && Math.abs(angleDelta(attackAngle, bot.aim)) < .3) shoot(bot);

    const blocked = collidesObstacle(bot.x + Math.cos(angle) * 58, bot.y + Math.sin(angle) * 58, bot.radius);
    if (blocked && bot.z <= 1 && bot.skillCd <= 0) useSkill(bot);
    else if (blocked) angle += bot.ai.strafe * 1.18;
    if (isEnemy && dist < 115 && bot.z <= 1 && bot.skillCd <= 0 && Math.random() < .12) useSkill(bot);

    const speed = bot.hero.speed * (.78 + (bot.z > 0 ? .13 : 0));
    bot.targetVx = Math.cos(angle) * speed;
    bot.targetVy = Math.sin(angle) * speed;
    const steering = 1 - Math.exp(-dt * 8.5);
    bot.vx += (bot.targetVx - bot.vx) * steering;
    bot.vy += (bot.targetVy - bot.vy) * steering;
    bot.moveAmount += (1 - bot.moveAmount) * Math.min(1, dt * 9);
    bot.movePhase += dt * (bot.z > 0 ? 7 : 11);
    moveFighter(bot, bot.vx * dt, bot.vy * dt);
  }

  function landFighter(fighter) {
    if (collidesObstacle(fighter.x, fighter.y, fighter.radius)) {
      let escaped = false;
      for (let radius = 35; radius <= 210 && !escaped; radius += 25) {
        for (let step = 0; step < 12; step += 1) {
          const angle = fighter.aim + step * TAU / 12;
          const x = clamp(fighter.x + Math.cos(angle) * radius, fighter.radius + 18, WORLD.w - fighter.radius - 18);
          const y = clamp(fighter.y + Math.sin(angle) * radius, fighter.radius + 18, WORLD.h - fighter.radius - 18);
          if (!collidesObstacle(x, y, fighter.radius)) {
            fighter.x = x;
            fighter.y = y;
            escaped = true;
            break;
          }
        }
      }
    }
    fighter.landedPulse = .34;
    const impactRadius = fighter.hero.id === "becchino" ? 112 : fighter.hero.id === "vela" ? 82 : 94;
    const impactDamage = fighter.hero.id === "becchino" ? 510 : fighter.hero.id === "vela" ? 330 : 410;
    let hits = 0;
    for (const target of game.fighters) {
      if (target === fighter || !target.alive || target.z > 32) continue;
      const dist = distance(fighter, target);
      if (dist > impactRadius + target.radius) continue;
      const dx = (target.x - fighter.x) / Math.max(1, dist);
      const dy = (target.y - fighter.y) / Math.max(1, dist);
      if (damageFighter(target, impactDamage, fighter, dx * 62, dy * 62)) {
        hits += 1;
        target.stun = Math.max(target.stun, fighter.hero.id === "becchino" ? .95 : .68);
        if (target.score > 0 && target.alive) {
          target.score -= 1;
          game.shards.push({ x: target.x, y: target.y, vx: dx * 150, vy: dy * 150, radius: 10, life: 18, phase: Math.random() * TAU });
        }
      }
    }
    if (hits) {
      if (fighter === game.player) announce(hits > 1 ? "SCHIANTO MULTIPLO!" : "ANIMA SPEZZATA!");
      game.camera.shake = fighter === game.player ? 12 : Math.max(game.camera.shake, 5);
      sound("hit");
    }
    burst(fighter.x, fighter.y, fighter.hero.color, 14 + hits * 5, 175);
    if (fighter === game.player) sound("land");
  }

  function updateFighters(dt) {
    for (const fighter of game.fighters) {
      fighter.skillCd = Math.max(0, fighter.skillCd - dt);
      fighter.shotCd = Math.max(0, fighter.shotCd - dt);
      fighter.stepCd = Math.max(0, fighter.stepCd - dt);
      fighter.lavaCd = Math.max(0, fighter.lavaCd - dt);
      fighter.recoil = Math.max(0, fighter.recoil - dt * 8.5);
      fighter.invuln = Math.max(0, fighter.invuln - dt);
      fighter.flash = Math.max(0, fighter.flash - dt);
      fighter.lastHit = Math.max(0, fighter.lastHit - dt);
      fighter.stun = Math.max(0, fighter.stun - dt);
      fighter.landedPulse = Math.max(0, fighter.landedPulse - dt);
      if (!fighter.alive) {
        fighter.moveAmount = 0;
        fighter.respawn -= dt;
        if (fighter.respawn <= 0) respawnFighter(fighter);
        continue;
      }

      const wasAirborne = fighter.z > 0;
      if (fighter.z > 0 || fighter.vz > 0) {
        fighter.z += fighter.vz * dt;
        fighter.vz -= 1040 * dt;
        if (fighter.z <= 0 && fighter.vz < 0) {
          fighter.z = 0;
          fighter.vz = 0;
          if (wasAirborne) landFighter(fighter);
        }
      }
      if (fighter.lastHit <= 0 && fighter.hp < fighter.maxHp) fighter.hp = Math.min(fighter.maxHp, fighter.hp + fighter.maxHp * .12 * dt);
      if (fighter.z < 24 && fighter.lavaCd <= 0 && inLava(fighter.x, fighter.y, fighter.radius * .25)) {
        fighter.lavaCd = .34;
        if (damageFighter(fighter, 36, null)) {
          burst(fighter.x, fighter.y, "#ff6a18", 7, 90);
          if (fighter === game.player) game.camera.shake = Math.max(game.camera.shake, 4);
        }
      }
      if (fighter.stun <= 0) {
        if (fighter.bot) updateBot(fighter, dt);
        else updatePlayer(fighter, dt);
      } else {
        fighter.moveAmount *= Math.pow(.04, dt);
      }
    }

    // Keep living fighters from occupying the same point.
    for (let i = 0; i < game.fighters.length; i += 1) {
      const a = game.fighters[i];
      if (!a.alive || a.z > 25) continue;
      for (let j = i + 1; j < game.fighters.length; j += 1) {
        const b = game.fighters[j];
        if (!b.alive || b.z > 25) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const overlap = a.radius + b.radius - dist;
        if (overlap > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          moveFighter(a, -nx * overlap * .25, -ny * overlap * .25);
          moveFighter(b, nx * overlap * .25, ny * overlap * .25);
        }
      }
    }
  }

  function updateBullets(dt) {
    for (let i = game.bullets.length - 1; i >= 0; i -= 1) {
      const bullet = game.bullets[i];
      bullet.life -= dt;
      bullet.phase += dt * 22;
      const travelX = bullet.vx * dt;
      const travelY = bullet.vy * dt;
      const steps = Math.max(1, Math.ceil(Math.hypot(travelX, travelY) / 18));
      let removed = false;
      for (let step = 0; step < steps && !removed; step += 1) {
        bullet.x += travelX / steps;
        bullet.y += travelY / steps;
        if (bullet.x < 8 || bullet.x > WORLD.w - 8 || bullet.y < 8 || bullet.y > WORLD.h - 8 || (bullet.z < 62 && collidesObstacle(bullet.x, bullet.y, bullet.radius))) {
          burst(bullet.x, bullet.y, bullet.color, 4, 58);
          removed = true;
          break;
        }
        for (const target of game.fighters) {
          if (target === bullet.owner || !target.alive || Math.abs(target.z + 18 - bullet.z) > 52) continue;
          if (distance(target, bullet) > target.radius + bullet.radius) continue;
          const magnitude = Math.hypot(bullet.vx, bullet.vy) || 1;
          damageFighter(target, bullet.damage, bullet.owner, bullet.vx / magnitude * 24, bullet.vy / magnitude * 24);
          burst(bullet.x, bullet.y, bullet.color, 8, 115);
          removed = true;
          break;
        }
      }
      if (removed || bullet.life <= 0) game.bullets.splice(i, 1);
    }
  }

  function updateShards(dt) {
    for (let i = game.shards.length - 1; i >= 0; i -= 1) {
      const shard = game.shards[i];
      shard.phase += dt * 4;
      shard.life -= dt;
      shard.vx *= Math.pow(.06, dt);
      shard.vy *= Math.pow(.06, dt);
      shard.x += shard.vx * dt;
      shard.y += shard.vy * dt;
      let collector = null;
      for (const fighter of game.fighters) {
        if (fighter.alive && distance(fighter, shard) < fighter.radius + 19) { collector = fighter; break; }
      }
      if (collector) {
        collector.score += 1;
        burst(shard.x, shard.y, "#b98cff", 9, 130);
        if (collector === game.player) sound("collect");
        game.shards.splice(i, 1);
        if (collector.score >= TARGET_SOULS) {
          announce(`${collector.name} HA DIVORATO 12 ANIME`);
          endGame(collector);
          return;
        }
      } else if (shard.life <= 0) {
        game.shards.splice(i, 1);
      }
    }
  }

  function updateParticles(dt) {
    for (let i = game.particles.length - 1; i >= 0; i -= 1) {
      const particle = game.particles[i];
      particle.life -= dt;
      particle.vx *= Math.pow(.12, dt);
      particle.vy *= Math.pow(.12, dt);
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      if (particle.life <= 0) game.particles.splice(i, 1);
    }
  }

  function updateHUD() {
    const player = game.player;
    if (!player) return;
    ui.playerScore.textContent = player.score;
    const seconds = Math.max(0, Math.ceil(game.time));
    ui.timer.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    ui.timer.style.color = seconds <= 20 ? "var(--blood)" : "var(--acid)";
    const leader = [...game.fighters].sort((a, b) => b.score - a.score || b.kills - a.kills)[0];
    ui.leaderName.textContent = leader?.name || "—";
    ui.leaderScore.textContent = leader?.score || 0;
    const hpPercent = clamp(player.hp / player.maxHp * 100, 0, 100);
    ui.hpFill.style.width = `${hpPercent}%`;
    ui.hpFill.style.background = hpPercent < 30 ? "linear-gradient(90deg,#b51e40,#ff3d61)" : "linear-gradient(90deg,#4fd16d,var(--acid))";
    ui.hpText.textContent = player.alive ? `${Math.ceil(player.hp)} / ${player.maxHp}` : `RITORNO IN ${Math.max(0, player.respawn).toFixed(1)}`;
    ui.killCount.textContent = `${player.kills} ATTERRAGGI`;
    const skillPercent = player.skillCd <= 0 ? 100 : (1 - player.skillCd / .78) * 100;
    ui.skill.querySelector("i").style.height = `${skillPercent}%`;
    ui.skill.classList.toggle("ready", player.skillCd <= 0 && player.alive && player.z <= 1);
    const shotPercent = player.shotCd <= 0 ? 100 : (1 - player.shotCd / PLAYER_SHOT_COOLDOWN) * 100;
    ui.shot.querySelector("i").style.height = `${shotPercent}%`;
    ui.shot.classList.toggle("ready", player.shotCd <= 0 && player.alive);
    document.querySelector("#mobile-skill").style.opacity = player.skillCd <= 0 && player.z <= 1 ? "1" : ".38";
    ui.mobileFire.style.opacity = player.shotCd <= 0 && player.alive ? "1" : ".48";
  }

  function update(dt) {
    if (game.scene !== "playing") return;
    game.elapsed += dt;
    game.time -= dt;
    updateFighters(dt);
    updateBullets(dt);
    updateShards(dt);
    updateParticles(dt);
    game.soulSpawnClock -= dt;
    if (game.soulSpawnClock <= 0) {
      game.soulSpawnClock = 1.3 + Math.random() * 1.4;
      if (game.shards.length < 16) spawnFreeShard();
    }

    if (game.scene === "playing" && game.time <= 0) endGame();
    if (game.player) {
      const follow = 1 - Math.pow(.001, dt);
      game.camera.x += (game.player.x - game.camera.x) * follow;
      game.camera.y += (game.player.y - game.camera.y) * follow;
    }
    game.camera.shake *= Math.pow(.025, dt);
    updateHUD();
  }

  function screenToWorld(screenX, screenY) {
    return {
      x: screenX - vw / 2 + game.camera.x,
      y: screenY - vh / 2 + game.camera.y,
    };
  }

  function roundedRectPath(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function visible(x, y, margin = 100) {
    return x > game.camera.x - vw / 2 - margin && x < game.camera.x + vw / 2 + margin && y > game.camera.y - vh / 2 - margin && y < game.camera.y + vh / 2 + margin;
  }

  function drawSheetCell(sheet, index, x, y, width, height, alpha = 1) {
    if (!sheet.complete || !sheet.naturalWidth || !sheet.naturalHeight) return false;
    const cellWidth = sheet.naturalWidth / 4;
    const cellHeight = sheet.naturalHeight / 2;
    const sourceX = (index % 4) * cellWidth;
    const sourceY = Math.floor(index / 4) * cellHeight;
    const previousAlpha = ctx.globalAlpha;
    ctx.globalAlpha *= alpha;
    ctx.drawImage(sheet, sourceX, sourceY, cellWidth, cellHeight, x, y, width, height);
    ctx.globalAlpha = previousAlpha;
    return true;
  }

  function drawLavaRivers(t) {
    if (!game.lavaRivers.length) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const river of game.lavaRivers) {
      const trace = () => {
        ctx.beginPath();
        river.points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      };
      trace();
      ctx.strokeStyle = "rgba(25,11,11,.92)";
      ctx.lineWidth = river.width + 34;
      ctx.stroke();
      trace();
      ctx.strokeStyle = "#74180d";
      ctx.lineWidth = river.width + 18;
      ctx.stroke();
      trace();
      ctx.strokeStyle = "#e34212";
      ctx.lineWidth = river.width;
      if (performanceMode !== "mobile") {
        ctx.shadowColor = "#ff541b";
        ctx.shadowBlur = 22;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      trace();
      ctx.strokeStyle = "#ff9a24";
      ctx.lineWidth = river.width * .52;
      ctx.stroke();
      trace();
      ctx.setLineDash([24, 17]);
      ctx.lineDashOffset = -t * 62;
      ctx.strokeStyle = "rgba(255,241,151,.78)";
      ctx.lineWidth = Math.max(4, river.width * .12);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let i = 1; i < river.points.length; i += 1) {
        const [ax, ay] = river.points[i - 1];
        const [bx, by] = river.points[i];
        const amount = .2 + ((i * .27 + t * .035) % .62);
        const x = ax + (bx - ax) * amount;
        const y = ay + (by - ay) * amount;
        ctx.fillStyle = `rgba(255,${135 + i * 17},38,${.48 + Math.sin(t * 4 + i) * .16})`;
        ctx.beginPath();
        ctx.arc(x, y, 4 + (i % 2) * 2, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawGround(map, t) {
    ctx.fillStyle = "#050409";
    ctx.fillRect(-400, -400, WORLD.w + 800, WORLD.h + 800);
    ctx.fillStyle = map.ground;
    ctx.fillRect(0, 0, WORLD.w, WORLD.h);

    if (game.selectedMap === "cemetery" && hauntedGrass.complete && hauntedGrass.naturalWidth) {
      ctx.save();
      ctx.globalAlpha = .94;
      ctx.drawImage(hauntedGrass, 0, 0, WORLD.w, WORLD.h);
      ctx.fillStyle = "rgba(18,52,24,.08)";
      ctx.fillRect(0, 0, WORLD.w, WORLD.h);
      ctx.restore();
    } else if (groundTexture.complete && groundTexture.naturalWidth) {
      groundPattern ||= ctx.createPattern(groundTexture, "repeat");
      if (groundPattern) {
        ctx.save();
        ctx.globalAlpha = .34;
        ctx.fillStyle = groundPattern;
        ctx.fillRect(0, 0, WORLD.w, WORLD.h);
        ctx.restore();
      }
    }

    if (game.selectedMap === "cemetery") {
      ctx.save();
      ctx.strokeStyle = "rgba(107,91,66,.22)";
      ctx.lineWidth = 70;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(WORLD.w / 2, 0); ctx.bezierCurveTo(1120, 420, 1300, 650, WORLD.w / 2, WORLD.h);
      ctx.stroke();
      ctx.strokeStyle = "rgba(181,203,151,.1)";
      ctx.lineWidth = 42;
      ctx.stroke();
      ctx.fillStyle = "rgba(10,28,12,.48)";
      ctx.beginPath(); ctx.arc(WORLD.w / 2, WORLD.h / 2, 132, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(188,255,60,.25)"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(WORLD.w / 2, WORLD.h / 2, 122, 0, TAU); ctx.stroke();
      ctx.strokeStyle = "rgba(255,135,41,.24)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(WORLD.w / 2, WORLD.h / 2, 99, 0, TAU); ctx.stroke();
      for (let i = 0; i < 14; i += 1) {
        const angle = i / 14 * TAU;
        ctx.fillStyle = i % 2 ? "#59695a" : "#748273";
        ctx.beginPath();
        ctx.ellipse(WORLD.w / 2 + Math.cos(angle) * 113, WORLD.h / 2 + Math.sin(angle) * 113, 12, 7, angle, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    drawLavaRivers(t);

    const tile = 80;
    const minX = Math.max(0, Math.floor((game.camera.x - vw / 2 - 100) / tile) * tile);
    const maxX = Math.min(WORLD.w, game.camera.x + vw / 2 + 100);
    const minY = Math.max(0, Math.floor((game.camera.y - vh / 2 - 100) / tile) * tile);
    const maxY = Math.min(WORLD.h, game.camera.y + vh / 2 + 100);
    ctx.strokeStyle = map.line;
    ctx.lineWidth = 1;
    ctx.globalAlpha = .48;
    ctx.beginPath();
    for (let x = minX; x <= maxX; x += tile) { ctx.moveTo(x, minY); ctx.lineTo(x, maxY); }
    for (let y = minY; y <= maxY; y += tile) { ctx.moveTo(minX, y); ctx.lineTo(maxX, y); }
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "rgba(205,220,210,.18)";
    ctx.lineWidth = 7;
    ctx.strokeRect(10, 10, WORLD.w - 20, WORLD.h - 20);
    ctx.strokeStyle = "rgba(0,0,0,.55)";
    ctx.lineWidth = 19;
    ctx.strokeRect(0, 0, WORLD.w, WORLD.h);

    for (const item of game.decor) {
      if (visible(item.x, item.y, 70)) drawDecor(item, map, t);
    }
  }

  function drawDecor(item, map, t) {
    ctx.save();
    ctx.translate(item.x, item.y);
    const creatureIndex = game.selectedMap === "cemetery" ? {
      snake: 0,
      snake2: 1,
      spider: 2,
      spider2: 3,
      "skull-pile": 4,
      "thorn-plant": 5,
      "lava-rock": 6,
      altar: 7,
    }[item.type] : null;
    if (creatureIndex != null && creatureProps.complete && creatureProps.naturalWidth) {
      const isCreature = creatureIndex < 4;
      const pulse = Math.sin(t * (creatureIndex < 2 ? 2.8 : 5.2) + (item.phase || 0));
      const sizes = creatureIndex < 4 ? [78, 104] : creatureIndex === 7 ? [112, 149] : [94, 125];
      if (isCreature) ctx.translate(Math.cos(t * 1.7 + item.phase) * 3.5, Math.sin(t * 1.35 + item.phase) * 2.5);
      ctx.rotate((item.rot || 0) + (isCreature ? pulse * .045 : 0));
      ctx.scale(item.size * (1 + (isCreature ? pulse * .018 : 0)), item.size * (1 - (isCreature ? pulse * .012 : 0)));
      ctx.fillStyle = creatureIndex === 6 ? "rgba(255,75,17,.38)" : "rgba(2,7,3,.44)";
      ctx.beginPath(); ctx.ellipse(5, 19, sizes[0] * .34, 10, 0, 0, TAU); ctx.fill();
      if (performanceMode !== "mobile") {
        ctx.filter = creatureIndex === 6
          ? "drop-shadow(0 7px 5px rgba(0,0,0,.62)) drop-shadow(0 0 9px rgba(255,73,18,.38))"
          : "drop-shadow(0 7px 5px rgba(0,0,0,.62))";
      }
      drawSheetCell(creatureProps, creatureIndex, -sizes[0] / 2, -sizes[1] + 31, sizes[0], sizes[1], .98);
      ctx.filter = "none";
      ctx.restore();
      return;
    }
    const artIndex = game.selectedMap === "cemetery" ? {
      grave: 4,
      cross: 5,
      "dead-tree": 6,
      coffin: 3,
      "iron-fence": 2,
      angel: 7,
    }[item.type] : null;
    if (artIndex != null && item.variant > .56 && cemeteryProps.complete && cemeteryProps.naturalWidth) {
      const sizes = {
        grave: [88, 118],
        cross: [76, 102],
        "dead-tree": [98, 131],
        coffin: [80, 107],
        "iron-fence": [96, 128],
        angel: [84, 112],
      };
      const [width, height] = sizes[item.type];
      ctx.scale(item.size * (item.variant > .78 ? -1 : 1), item.size);
      ctx.fillStyle = "rgba(2,2,6,.48)";
      ctx.beginPath(); ctx.ellipse(5, 19, width * .34, 10, 0, 0, TAU); ctx.fill();
      if (performanceMode !== "mobile") ctx.filter = "drop-shadow(0 7px 4px rgba(0,0,0,.58))";
      drawSheetCell(cemeteryProps, artIndex, -width / 2, -height + 27, width, height, .96);
      ctx.filter = "none";
      ctx.restore();
      return;
    }
    ctx.rotate(item.rot);
    ctx.scale(item.size, item.size);
    ctx.globalAlpha = .88;
    switch (item.type) {
      case "grave": {
        ctx.fillStyle = "rgba(4,3,8,.62)";
        ctx.beginPath(); ctx.ellipse(8, 16, 20, 8, .15, 0, TAU); ctx.fill();
        ctx.fillStyle = "#242933"; roundedRectPath(ctx, -7, -19, 23, 35, 6); ctx.fill();
        ctx.fillStyle = item.variant > .5 ? "#626a75" : "#505965";
        roundedRectPath(ctx, -12, -26, 23, 36, 6); ctx.fill();
        ctx.strokeStyle = "rgba(203,213,211,.28)"; ctx.lineWidth = 2;
        roundedRectPath(ctx, -10, -24, 19, 31, 5); ctx.stroke();
        ctx.fillStyle = "#292f38"; ctx.fillRect(-2, -17, 4, 18); ctx.fillRect(-7, -12, 14, 4);
        ctx.fillStyle = "rgba(137,170,77,.45)"; ctx.beginPath(); ctx.arc(-7, 5, 4, 0, TAU); ctx.arc(8, -19, 3, 0, TAU); ctx.fill();
        break;
      }
      case "cross": {
        ctx.fillStyle = "rgba(4,3,8,.62)"; ctx.beginPath(); ctx.ellipse(8, 15, 23, 8, .1, 0, TAU); ctx.fill();
        ctx.fillStyle = "#242833"; roundedRectPath(ctx, -15, 8, 37, 10, 3); ctx.fill();
        ctx.fillStyle = "#323844"; roundedRectPath(ctx, -19, 3, 37, 10, 3); ctx.fill();
        ctx.fillStyle = "#303641"; roundedRectPath(ctx, -4, -31, 13, 40, 3); ctx.fill(); roundedRectPath(ctx, -14, -19, 33, 12, 3); ctx.fill();
        ctx.fillStyle = item.variant > .5 ? "#69717b" : "#59616b";
        roundedRectPath(ctx, -8, -36, 12, 41, 3); ctx.fill(); roundedRectPath(ctx, -18, -24, 32, 11, 3); ctx.fill();
        ctx.strokeStyle = "rgba(225,230,220,.27)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-5, -33); ctx.lineTo(1, -33); ctx.lineTo(1, 1); ctx.moveTo(-15, -21); ctx.lineTo(11, -21); ctx.stroke();
        break;
      }
      case "dead-tree": {
        ctx.strokeStyle = "#231c21"; ctx.lineWidth = 9; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(0, 22); ctx.lineTo(-1, -25); ctx.lineTo(-20, -43); ctx.moveTo(-1, -20); ctx.lineTo(18, -40); ctx.moveTo(1, -7); ctx.lineTo(26, -15); ctx.stroke();
        ctx.strokeStyle = "#42313a"; ctx.lineWidth = 2; ctx.stroke();
        break;
      }
      case "candle": {
        ctx.fillStyle = "#ddd0a8"; ctx.fillRect(-3, -5, 6, 14);
        ctx.shadowBlur = 13; ctx.shadowColor = map.accent; ctx.fillStyle = map.accent;
        ctx.beginPath(); ctx.ellipse(0, -9 - Math.sin(t * 5 + item.x) * 2, 3, 6, 0, 0, TAU); ctx.fill();
        ctx.shadowBlur = 0; break;
      }
      case "lantern": {
        ctx.fillStyle = "rgba(3,3,7,.58)"; ctx.beginPath(); ctx.ellipse(8, 14, 17, 6, .18, 0, TAU); ctx.fill();
        ctx.fillStyle = "#25242c"; ctx.fillRect(-2, -22, 5, 34); ctx.fillRect(-10, 9, 21, 5);
        ctx.strokeStyle = "#77727e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(1, -25, 7, Math.PI, TAU); ctx.stroke();
        ctx.fillStyle = "#17151c"; roundedRectPath(ctx, -8, -24, 18, 18, 3); ctx.fill();
        ctx.shadowBlur = 18; ctx.shadowColor = map.accent; ctx.fillStyle = map.accent;
        ctx.globalAlpha = .92; roundedRectPath(ctx, -4, -20, 10, 10, 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = .88;
        ctx.strokeStyle = "#99949f"; ctx.lineWidth = 1.5; roundedRectPath(ctx, -8, -24, 18, 18, 3); ctx.stroke();
        break;
      }
      case "coffin": {
        ctx.fillStyle = "rgba(3,2,6,.6)"; ctx.beginPath(); ctx.ellipse(7, 10, 27, 12, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#3e231d"; ctx.beginPath(); ctx.moveTo(-9, -28); ctx.lineTo(12, -23); ctx.lineTo(20, -5); ctx.lineTo(15, 24); ctx.lineTo(-10, 26); ctx.lineTo(-17, -3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = item.variant > .5 ? "#8d5435" : "#73432f"; ctx.beginPath(); ctx.moveTo(-13, -32); ctx.lineTo(8, -27); ctx.lineTo(16, -9); ctx.lineTo(11, 19); ctx.lineTo(-14, 21); ctx.lineTo(-21, -7); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#c3844f"; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = "#2c1a18"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-3, -22); ctx.lineTo(-3, 11); ctx.moveTo(-11, -8); ctx.lineTo(7, -8); ctx.stroke();
        ctx.fillStyle = "#d0a055"; ctx.beginPath(); ctx.arc(8, 4, 3, 0, TAU); ctx.fill();
        break;
      }
      case "iron-fence": {
        ctx.strokeStyle = "rgba(3,2,7,.5)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-25, 9); ctx.lineTo(27, 15); ctx.stroke();
        ctx.strokeStyle = "#403c49"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-26, -6); ctx.lineTo(26, -6); ctx.moveTo(-26, 8); ctx.lineTo(26, 8);
        for (let x = -24; x <= 24; x += 12) { ctx.moveTo(x, 14); ctx.lineTo(x, -18); ctx.lineTo(x - 4, -12); ctx.moveTo(x, -18); ctx.lineTo(x + 4, -12); }
        ctx.stroke();
        ctx.strokeStyle = "rgba(190,180,205,.22)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-24, -8); ctx.lineTo(24, -8); ctx.stroke();
        break;
      }
      case "angel": {
        ctx.fillStyle = "rgba(3,3,7,.58)"; ctx.beginPath(); ctx.ellipse(8, 17, 22, 8, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#333944"; roundedRectPath(ctx, -13, 7, 31, 12, 3); ctx.fill();
        ctx.fillStyle = "#646b74"; roundedRectPath(ctx, -17, 2, 31, 12, 3); ctx.fill();
        ctx.fillStyle = "#555d68"; ctx.beginPath(); ctx.moveTo(-5, 5); ctx.lineTo(-1, -17); ctx.lineTo(8, -17); ctx.lineTo(11, 5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(3, -25, 7, 0, TAU); ctx.fill();
        ctx.fillStyle = "#737b84"; ctx.beginPath(); ctx.moveTo(-1, -13); ctx.quadraticCurveTo(-24, -24, -22, 2); ctx.quadraticCurveTo(-11, -7, 0, -3); ctx.fill();
        ctx.beginPath(); ctx.moveTo(7, -13); ctx.quadraticCurveTo(28, -23, 24, 3); ctx.quadraticCurveTo(14, -7, 5, -3); ctx.fill();
        ctx.strokeStyle = "rgba(230,232,220,.24)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(3, -25, 5, Math.PI, TAU); ctx.stroke();
        break;
      }
      case "bones": {
        ctx.strokeStyle = "#77736d"; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-11, -4); ctx.lineTo(13, 5); ctx.moveTo(-8, 8); ctx.lineTo(10, -8); ctx.stroke();
        break;
      }
      case "skull": {
        ctx.fillStyle = "#746e62"; ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fill();
        ctx.fillStyle = "#17120f"; ctx.beginPath(); ctx.arc(-3, -1, 2, 0, TAU); ctx.arc(3, -1, 2, 0, TAU); ctx.fill();
        break;
      }
      case "crack": {
        ctx.strokeStyle = "#09080a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-18, -12); ctx.lineTo(-3, -2); ctx.lineTo(-11, 11); ctx.moveTo(-3, -2); ctx.lineTo(17, 7); ctx.stroke();
        break;
      }
      case "rune": {
        ctx.strokeStyle = `rgba(220,150,82,${.2 + item.variant * .2})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, 15, 0, TAU); ctx.moveTo(-12, 8); ctx.lineTo(0, -13); ctx.lineTo(12, 8); ctx.closePath(); ctx.stroke();
        break;
      }
      case "mushroom": {
        ctx.fillStyle = "#675571"; ctx.beginPath(); ctx.arc(0, 0, 7, Math.PI, TAU); ctx.fill(); ctx.fillStyle = "#999098"; ctx.fillRect(-2, 0, 4, 8); break;
      }
      case "puddle": {
        ctx.fillStyle = "rgba(56,105,97,.32)"; ctx.beginPath(); ctx.ellipse(0, 0, 24, 12, 0, 0, TAU); ctx.fill(); break;
      }
      default: {
        ctx.strokeStyle = map.accent; ctx.globalAlpha = .18; ctx.lineWidth = 2;
        for (let i = -2; i <= 2; i += 1) { ctx.beginPath(); ctx.moveTo(i * 4, 8); ctx.lineTo(i * 6, -8 - Math.abs(i) * 2); ctx.stroke(); }
      }
    }
    ctx.restore();
  }

  function drawArtObstacle(obstacle) {
    const art = {
      "mausoleum-art": { index: 0, width: 176, height: 235 },
      "stone-wall-art": { index: 1, width: Math.max(190, obstacle.w * 1.25), height: 154 },
      "gate-art": { index: 2, width: 178, height: 238 },
      "coffin-art": { index: 3, width: 158, height: 188 },
      "grave-art": { index: 4, width: 146, height: 195 },
      "cross-art": { index: 5, width: 134, height: 184 },
    }[obstacle.type];
    if (!art || !cemeteryProps.complete || !cemeteryProps.naturalWidth) return false;
    ctx.save();
    ctx.translate(obstacle.x, obstacle.y);
    ctx.fillStyle = "rgba(2,2,6,.62)";
    ctx.beginPath();
    ctx.ellipse(obstacle.w / 2 + 10, obstacle.h + 11, Math.max(obstacle.w * .55, art.width * .34), 18, 0, 0, TAU);
    ctx.fill();
    const drawX = obstacle.w / 2 - art.width / 2;
    const drawY = obstacle.h + 24 - art.height;
    if (performanceMode !== "mobile") ctx.filter = "drop-shadow(0 11px 7px rgba(0,0,0,.67)) drop-shadow(0 0 5px rgba(126,255,68,.12))";
    drawSheetCell(cemeteryProps, art.index, drawX, drawY, art.width, art.height, 1);
    ctx.filter = "none";
    ctx.restore();
    return true;
  }

  function drawObstacle(obstacle, map) {
    if (!visible(obstacle.x + obstacle.w / 2, obstacle.y + obstacle.h / 2, 160)) return;
    if (drawArtObstacle(obstacle)) return;
    ctx.save();
    ctx.translate(obstacle.x, obstacle.y);
    ctx.fillStyle = "rgba(4,2,8,.58)";
    roundedRectPath(ctx, 12, 17, obstacle.w, obstacle.h, 16); ctx.fill();

    if (obstacle.type === "thorn-hedge") {
      ctx.fillStyle = "#342444"; roundedRectPath(ctx, -3, 5, obstacle.w + 6, obstacle.h, 16); ctx.fill();
      ctx.strokeStyle = "#795393"; ctx.lineWidth = 5; roundedRectPath(ctx, 0, 2, obstacle.w, obstacle.h - 3, 14); ctx.stroke();
      for (let x = 9; x < obstacle.w; x += 19) {
        for (let y = 8; y < obstacle.h - 3; y += 18) {
          const wobble = ((x * 13 + y * 7) % 9) - 4;
          ctx.fillStyle = (x + y) % 3 ? "#245d35" : "#338247";
          ctx.beginPath(); ctx.arc(x + wobble, y, 11, 0, TAU); ctx.fill();
          ctx.fillStyle = "#54a85e"; ctx.beginPath(); ctx.arc(x + wobble - 3, y - 4, 4, 0, TAU); ctx.fill();
          ctx.strokeStyle = "#d8c9ab"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 5, y - 8); ctx.lineTo(x + 9, y - 15); ctx.stroke();
        }
      }
    } else if (obstacle.type === "coffin-stack") {
      ctx.fillStyle = "#302035"; roundedRectPath(ctx, 0, 3, obstacle.w, obstacle.h, 10); ctx.fill();
      const count = obstacle.w > obstacle.h ? 3 : 2;
      for (let i = 0; i < count; i += 1) {
        const cellW = obstacle.w > obstacle.h ? obstacle.w / count : obstacle.w - 18;
        const cellH = obstacle.w > obstacle.h ? obstacle.h - 14 : obstacle.h / count;
        const x = obstacle.w > obstacle.h ? i * cellW + 4 : 9;
        const y = obstacle.w > obstacle.h ? 7 : i * cellH + 3;
        ctx.fillStyle = i % 2 ? "#8b5434" : "#a4683e";
        roundedRectPath(ctx, x, y, cellW - 8, cellH - 7, 5); ctx.fill();
        ctx.strokeStyle = "#3e251d"; ctx.lineWidth = 4; roundedRectPath(ctx, x + 2, y + 2, cellW - 12, cellH - 11, 4); ctx.stroke();
        ctx.strokeStyle = "#d19a58"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 8, y + cellH / 2); ctx.lineTo(x + cellW - 15, y + cellH / 2); ctx.stroke();
        ctx.fillStyle = "#bfdf55"; ctx.beginPath(); ctx.arc(x + cellW / 2 - 4, y + cellH / 2, 3, 0, TAU); ctx.fill();
      }
    } else if (obstacle.type === "stump") {
      ctx.fillStyle = "#211820"; roundedRectPath(ctx, 0, 0, obstacle.w, obstacle.h, 24); ctx.fill();
      ctx.strokeStyle = "#523948"; ctx.lineWidth = 8; roundedRectPath(ctx, 4, 4, obstacle.w - 8, obstacle.h - 8, 21); ctx.stroke();
      ctx.strokeStyle = "#0b0910"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(obstacle.w * .18, obstacle.h * .25); ctx.lineTo(obstacle.w * .66, obstacle.h * .62); ctx.lineTo(obstacle.w * .86, obstacle.h * .26); ctx.stroke();
      ctx.fillStyle = "#7bd75b"; ctx.globalAlpha = .45; ctx.beginPath(); ctx.arc(obstacle.w * .25, obstacle.h * .3, 7, 0, TAU); ctx.arc(obstacle.w * .72, obstacle.h * .68, 9, 0, TAU); ctx.fill();
    } else {
      const bone = obstacle.type === "bone-wall";
      const sarcophagus = obstacle.type === "sarcophagus";
      const base = bone ? "#766c62" : sarcophagus ? "#594538" : "#565267";
      const highlight = bone ? "#aa9d8b" : sarcophagus ? "#8b6b4e" : "#817a95";
      ctx.fillStyle = base; roundedRectPath(ctx, 0, 0, obstacle.w, obstacle.h, 10); ctx.fill();
      ctx.strokeStyle = highlight; ctx.lineWidth = 6; roundedRectPath(ctx, 3, 3, obstacle.w - 6, obstacle.h - 8, 8); ctx.stroke();
      const block = 44;
      ctx.strokeStyle = "rgba(22,14,27,.42)"; ctx.lineWidth = 3;
      for (let x = block; x < obstacle.w; x += block) { ctx.beginPath(); ctx.moveTo(x, 5); ctx.lineTo(x - 8, obstacle.h - 8); ctx.stroke(); }
      if (bone) {
        ctx.strokeStyle = "#ded3bd"; ctx.lineWidth = 7; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(15, obstacle.h / 2); ctx.lineTo(obstacle.w - 15, obstacle.h / 2); ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(8,5,12,.38)"; ctx.beginPath(); ctx.arc(obstacle.w / 2, obstacle.h / 2, Math.min(18, obstacle.h / 4), 0, TAU); ctx.fill();
        ctx.fillStyle = map.accent; ctx.globalAlpha = .32; ctx.beginPath(); ctx.arc(obstacle.w / 2, obstacle.h / 2, 6, 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawShard(shard, t) {
    const bob = Math.sin(shard.phase + t * 2) * 5;
    ctx.save();
    ctx.translate(shard.x, shard.y + bob);
    ctx.rotate(t * 1.8 + shard.phase);
    ctx.shadowColor = "#a986ff";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#cbb4ff";
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const angle = i * Math.PI / 4 - Math.PI / 2;
      const radius = i % 2 ? 5 : 12;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawFighter(fighter, t) {
    if (!fighter.alive || !visible(fighter.x, fighter.y, 120)) return;
    const hero = fighter.hero;
    const blink = fighter.invuln > 0 && Math.sin(t * 25) > .25;
    const isPlayer = fighter === game.player;
    const directionSheet = fighter.bot ? enemyDirections : playerDirections;
    const fallbackSprite = fighter.bot ? enemySprite : playerSprite;
    const spriteWidth = isPlayer ? 112 : 100;
    const spriteHeight = spriteWidth * (684 / 1024) * 2;
    const spriteTop = -spriteHeight + 39;
    const directionFloat = ((fighter.aim + Math.PI / 2 + TAU) % TAU) / TAU * 8;
    const frame = Math.round(directionFloat) % 8;
    const frameAngle = frame / 8 * TAU - Math.PI / 2;
    const residualTurn = angleDelta(fighter.aim, frameAngle);
    const step = Math.sin(fighter.movePhase);
    const movementBob = Math.abs(step) * 3.4 * fighter.moveAmount;
    const bodySway = step * .042 * fighter.moveAmount + residualTurn * .28;

    // Contact ring and projected shadow anchor the 3D body to the arena.
    ctx.save();
    ctx.translate(fighter.x, fighter.y);
    ctx.globalAlpha = blink ? .68 : 1;

    if (fighter.landedPulse > 0) {
      const progress = 1 - fighter.landedPulse / .34;
      ctx.globalAlpha = fighter.landedPulse / .34;
      ctx.strokeStyle = hero.color;
      ctx.lineWidth = 6 * (1 - progress) + 1;
      ctx.beginPath(); ctx.arc(0, 0, 32 + progress * 86, 0, TAU); ctx.stroke();
    }
    const shadowScale = 1 - Math.min(.48, fighter.z / 380);
    ctx.globalAlpha = (blink ? .25 : .52) * shadowScale;
    ctx.fillStyle = "#050307";
    ctx.beginPath(); ctx.ellipse(7, hero.radius * .78, spriteWidth * .34 * shadowScale, hero.radius * .62 * shadowScale, 0, 0, TAU); ctx.fill();
    if (isPlayer) {
      ctx.globalAlpha = blink ? .25 : .72;
      ctx.strokeStyle = "#76ff35"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 4, 34, 17, 0, 0, TAU); ctx.stroke();
      ctx.rotate(fighter.aim + Math.PI / 2);
      ctx.fillStyle = "#76ff35"; ctx.beginPath(); ctx.moveTo(0, -21); ctx.lineTo(-6, -11); ctx.lineTo(6, -11); ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(
      fighter.x - Math.cos(fighter.aim) * fighter.recoil * 4,
      fighter.y - fighter.z - movementBob - Math.sin(fighter.aim) * fighter.recoil * 2,
    );
    ctx.globalAlpha = blink ? .68 : 1;
    ctx.rotate(bodySway);
    const strideScale = 1 + Math.abs(step) * .018 * fighter.moveAmount;
    ctx.scale(strideScale + fighter.recoil * .025, 1 - Math.abs(step) * .012 * fighter.moveAmount);
    if (directionSheet.complete && directionSheet.naturalWidth) {
      if (performanceMode !== "mobile") {
        ctx.filter = fighter.flash > 0
          ? "brightness(2.35) saturate(.4)"
          : `drop-shadow(0 6px 4px rgba(0,0,0,.55)) drop-shadow(0 0 5px ${fighter.bot ? "rgba(255,38,64,.42)" : "rgba(118,255,53,.42)"})`;
      }
      drawSheetCell(directionSheet, frame, -spriteWidth / 2, spriteTop, spriteWidth, spriteHeight);
      ctx.filter = "none";
    } else if (fallbackSprite.complete && fallbackSprite.naturalWidth) {
      const fallbackHeight = spriteWidth * fallbackSprite.naturalHeight / fallbackSprite.naturalWidth;
      const facing = Math.cos(fighter.aim) >= 0 ? -1 : 1;
      ctx.scale(facing, 1);
      ctx.drawImage(fallbackSprite, -spriteWidth / 2, -fallbackHeight + 34, spriteWidth, fallbackHeight);
    } else {
      // Detailed hooded silhouette while the raster sprite is decoding.
      ctx.fillStyle = fighter.bot ? "#8a172b" : "#4e2471";
      ctx.beginPath(); ctx.moveTo(0, -55); ctx.quadraticCurveTo(-38, -35, -32, 24); ctx.lineTo(31, 24); ctx.quadraticCurveTo(37, -35, 0, -55); ctx.fill();
      ctx.fillStyle = "#d6cfbd"; ctx.beginPath(); ctx.ellipse(0, -23, 19, 23, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#08070b"; ctx.beginPath(); ctx.arc(-7, -26, 6, 0, TAU); ctx.fill();
      ctx.shadowBlur = 10; ctx.shadowColor = fighter.bot ? "#ff304d" : "#76ff35"; ctx.fillStyle = fighter.bot ? "#ff304d" : "#76ff35"; ctx.beginPath(); ctx.arc(7, -26, 5, 0, TAU); ctx.fill();
    }
    ctx.restore();

    if (fighter.recoil > .12) {
      const flashX = fighter.x + Math.cos(fighter.aim) * (fighter.radius + 34);
      const flashY = fighter.y - fighter.z + Math.sin(fighter.aim) * (fighter.radius + 20);
      const color = fighter.bot ? "#ff304d" : "#76ff35";
      ctx.save();
      ctx.translate(flashX, flashY);
      ctx.rotate(fighter.aim);
      ctx.globalAlpha = Math.min(1, fighter.recoil * 1.5) * (blink ? .68 : 1);
      ctx.shadowColor = color; ctx.shadowBlur = 22;
      ctx.fillStyle = "#f8ffe9";
      ctx.beginPath(); ctx.ellipse(0, 0, 8 + fighter.recoil * 7, 5 + fighter.recoil * 3, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(25 + fighter.recoil * 8, -7); ctx.lineTo(20, 0); ctx.lineTo(25 + fighter.recoil * 8, 7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // World-space labels stay upright even when the sprite changes facing.
    ctx.save();
    ctx.translate(fighter.x, fighter.y - fighter.z);
    const width = isPlayer ? 68 : 59;
    const labelY = spriteTop + 7;
    if (fighter.stun > 0) {
      ctx.fillStyle = "#ffd650"; ctx.font = "900 15px system-ui"; ctx.textAlign = "center";
      ctx.fillText("✦  ✦", 0, labelY - 19);
    }
    ctx.fillStyle = "rgba(0,0,0,.72)"; roundedRectPath(ctx, -width / 2, labelY, width, 8, 3); ctx.fill();
    ctx.fillStyle = fighter.hp / fighter.maxHp < .3 ? "#ff3d61" : hero.color;
    roundedRectPath(ctx, -width / 2 + 1, labelY + 1, (width - 2) * clamp(fighter.hp / fighter.maxHp, 0, 1), 6, 2); ctx.fill();
    ctx.font = "700 10px system-ui"; ctx.textAlign = "center"; ctx.fillStyle = fighter === game.player ? "#fff" : "#cfc8d5";
    ctx.fillText(fighter.name, 0, labelY - 5);
    if (fighter.score > 0) {
      ctx.fillStyle = "#b992ff"; ctx.font = "900 12px system-ui"; ctx.fillText(`✦ ${fighter.score}`, 0, 42);
    }
    ctx.restore();
  }

  function drawPlayerBeacon(t) {
    const player = game.player;
    if (!player?.alive || !visible(player.x, player.y, 140)) return;
    const occluded = game.obstacles.some((obstacle) => (
      player.x > obstacle.x - 62 && player.x < obstacle.x + obstacle.w + 62
      && player.y > obstacle.y - 165 && player.y < obstacle.y + obstacle.h
    ));
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.strokeStyle = occluded ? "rgba(118,255,53,.95)" : "rgba(118,255,53,.56)";
    ctx.lineWidth = occluded ? 4 : 2;
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = -t * 38;
    ctx.beginPath(); ctx.ellipse(0, 5, 38, 21, 0, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
    ctx.translate(0, -player.z - 103 - Math.sin(t * 4.5) * 3);
    ctx.fillStyle = "#76ff35";
    ctx.shadowColor = "#76ff35";
    ctx.shadowBlur = occluded ? 16 : 8;
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(-10, -3); ctx.lineTo(10, -3); ctx.closePath(); ctx.fill();
    if (occluded) {
      ctx.shadowBlur = 0;
      ctx.font = "900 10px system-ui";
      ctx.textAlign = "center";
      ctx.fillStyle = "#f5ffe9";
      ctx.fillText("TU", 0, -9);
    }
    ctx.restore();
  }

  function drawBullet(bullet) {
    if (!visible(bullet.x, bullet.y, 50)) return;
    const angle = Math.atan2(bullet.vy, bullet.vx);
    ctx.save();
    ctx.translate(bullet.x, bullet.y - bullet.z);
    ctx.rotate(angle);
    ctx.globalAlpha = clamp(bullet.life / .18, 0, 1);
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 25;
    ctx.strokeStyle = bullet.color;
    ctx.lineWidth = bullet.radius * .9;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-38, 0); ctx.lineTo(2, 0); ctx.stroke();
    ctx.globalAlpha *= .42;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-29, -7); ctx.lineTo(-4, -3); ctx.moveTo(-29, 7); ctx.lineTo(-4, 3); ctx.stroke();
    ctx.globalAlpha = clamp(bullet.life / .18, 0, 1);
    ctx.fillStyle = bullet.color; ctx.beginPath(); ctx.arc(3, 0, bullet.radius * 1.12, 0, TAU); ctx.fill();
    ctx.fillStyle = "#fbfff3"; ctx.beginPath(); ctx.arc(5, -1, bullet.radius * .62, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.88)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(3, 0, bullet.radius * .83, -.7, 1.7); ctx.stroke();
    ctx.fillStyle = bullet.color;
    for (let i = 0; i < 3; i += 1) {
      const sparkAngle = bullet.phase + i * TAU / 3;
      ctx.beginPath(); ctx.arc(3 + Math.cos(sparkAngle) * bullet.radius * 1.45, Math.sin(sparkAngle) * bullet.radius * .72, 2.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  function drawParticles() {
    for (const particle of game.particles) {
      if (!visible(particle.x, particle.y, 30)) continue;
      ctx.save();
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.size * clamp(particle.life * 2, .3, 1), 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  function drawFog(map, t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.save();
    ctx.fillStyle = map.fog;
    const fogBanks = performanceMode === "mobile" ? 3 : 5;
    for (let i = 0; i < fogBanks; i += 1) {
      const x = ((t * (10 + i * 3) + i * 260) % (vw + 500)) - 250;
      const y = vh * (.25 + i * .14) + Math.sin(t * .3 + i) * 45;
      ctx.beginPath(); ctx.ellipse(x, y, 260 + i * 25, 50 + i * 4, 0, 0, TAU); ctx.fill();
    }
    const vignette = ctx.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * .25, vw / 2, vh / 2, Math.max(vw, vh) * .74);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, game.selectedMap === "cemetery" ? "rgba(0,0,0,.29)" : "rgba(0,0,0,.42)");
    ctx.fillStyle = vignette; ctx.fillRect(0, 0, vw, vh);
    ctx.restore();
  }

  function render(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#07060b";
    ctx.fillRect(0, 0, vw, vh);

    if (game.scene === "menu") {
      game.camera.x = WORLD.w / 2 + Math.sin(t * .08) * 260;
      game.camera.y = WORLD.h / 2 + Math.cos(t * .07) * 150;
    }
    const shakeX = game.camera.shake ? (Math.random() - .5) * game.camera.shake : 0;
    const shakeY = game.camera.shake ? (Math.random() - .5) * game.camera.shake : 0;
    ctx.translate(vw / 2 - game.camera.x + shakeX, vh / 2 - game.camera.y + shakeY);

    const map = MAPS[game.selectedMap];
    drawGround(map, t);
    game.shards.forEach((shard) => { if (visible(shard.x, shard.y, 40)) drawShard(shard, t); });

    const drawables = [];
    game.obstacles.forEach((obstacle) => drawables.push({ y: obstacle.y + obstacle.h, type: "obstacle", value: obstacle }));
    game.bullets.forEach((bullet) => drawables.push({ y: bullet.y, type: "bullet", value: bullet }));
    game.fighters.forEach((fighter) => { if (fighter.alive) drawables.push({ y: fighter.y, type: "fighter", value: fighter }); });
    drawables.sort((a, b) => a.y - b.y);
    for (const item of drawables) {
      if (item.type === "fighter") drawFighter(item.value, t);
      else if (item.type === "bullet") drawBullet(item.value);
      else drawObstacle(item.value, map);
    }
    drawPlayerBeacon(t);
    drawParticles();
    drawFog(map, t);
  }

  function loop(now) {
    const dt = Math.min(.034, Math.max(0, (now - game.last) / 1000));
    game.last = now;
    update(dt);
    render(now / 1000);
    requestAnimationFrame(loop);
  }

  resize();
  setupUI();
  createArena();
  requestAnimationFrame(loop);
})();
