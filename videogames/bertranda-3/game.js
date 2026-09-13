(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, amount) => a + (b - a) * amount;
  const TAU = Math.PI * 2;
  const IS_TOUCH = matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
  const PLAYER_SPEED = { walk: 5.5, sprint: 8.4 };
  const LOOK_LEVELS = { precise: 0.7, fast: 1, veryfast: 1.3 };
  const MAX_SCHEMAS = 25;
  const ENVIRONMENTS = [
    { name: "THE HOUSE OF INFESTATION", short: "HAUNTED HOUSE", kind: "house" },
    { name: "THE WHISPERING FOREST", short: "SPIRIT FOREST", kind: "forest" },
    { name: "CEMETERY OF LOST FACES", short: "CEMETERY", kind: "cemetery", wall: 0x46514c, floor: 0x28352d, ceiling: 0x17211d },
    { name: "CATACOMBS OF BERTRANDA", short: "CATACOMBS", kind: "catacombs" },
    { name: "THE INFERNAL ABYSS", short: "HELL", kind: "hell" }
  ];
  const CORRUPTION_CYCLES = [
    { name: "VERDIGRIS", background: 0x03110d, sky: 0x79c997, ground: 0x061d13, moon: 0x65ff8d, accent: 0x67ff9a },
    { name: "ASH", background: 0x0a0c0f, sky: 0xa9b1b8, ground: 0x17191c, moon: 0xdce5e8, accent: 0xb7c0c7 },
    { name: "VIOLET", background: 0x100817, sky: 0xb486ff, ground: 0x210b2e, moon: 0xe56bff, accent: 0xb15cff },
    { name: "ROT", background: 0x151303, sky: 0xd5c052, ground: 0x302806, moon: 0xffdf48, accent: 0xd9c83d },
    { name: "INFERNO", background: 0x170202, sky: 0xff5a43, ground: 0x390706, moon: 0xff2418, accent: 0xff3829 }
  ];

  function stageInfo(value) {
    const stageIndex = Math.max(0, (value || schema) - 1);
    const environmentIndex = stageIndex % ENVIRONMENTS.length;
    const cycleIndex = Math.min(4, Math.floor(stageIndex / ENVIRONMENTS.length));
    return {
      environment: ENVIRONMENTS[environmentIndex],
      environmentIndex,
      cycle: CORRUPTION_CYCLES[cycleIndex],
      cycleIndex
    };
  }

  const ui = {
    game: $("#game"),
    host: $("#render-host"),
    loading: $("#loading"),
    title: $("#title-screen"),
    start: $("#start-button"),
    mute: $("#mute-button"),
    hud: $("#hud"),
    objective: $("#objective-text"),
    wave: $("#wave-text"),
    bossWrap: $("#boss-wrap"),
    bossName: $("#boss-name"),
    bossFill: $("#boss-fill"),
    bossPhase: $("#boss-phase"),
    mapWrap: $("#scout-map"),
    mapToggle: $("#map-toggle"),
    mapDetails: $("#map-details"),
    mapCanvas: $("#map-canvas"),
    mapStatus: $("#map-status"),
    mapHint: $("#map-hint"),
    goldGuide: $("#gold-guide"),
    goldArrow: $("#gold-guide-arrow"),
    goldDistance: $("#gold-guide-distance"),
    danger: $("#danger"),
    reticle: $("#reticle"),
    aimTarget: $("#aim-target"),
    prompt: $("#prompt"),
    caption: $("#subtitle"),
    healthFill: $("#health-fill"),
    healthText: $("#health-text"),
    streak: $("#streak-text"),
    ammo: $("#ammo-text"),
    weaponState: $("#weapon-state"),
    damageFlash: $("#damage-flash"),
    bossFlash: $("#boss-flash"),
    pauseButton: $("#pause-button"),
    rotate: $("#rotate-screen"),
    touch: $("#touch-controls"),
    movePad: $("#move-pad"),
    moveKnob: $("#move-knob"),
    lookPad: $("#look-pad"),
    touchFire: $("#touch-fire"),
    touchRun: $("#touch-run"),
    touchReload: $("#touch-reload"),
    touchTorch: $("#touch-torch"),
    touchAuto: $("#touch-auto"),
    pause: $("#pause-screen"),
    resume: $("#resume-button"),
    restart: $("#restart-button"),
    death: $("#death-screen"),
    retry: $("#retry-button"),
    scare: $("#jumpscare")
  };

  const settings = {
    difficulty: "normal",
    quality: "deep",
    realm: "1",
    look: "fast",
    touchAuto: false,
    muted: false
  };

  let renderer;
  let scene;
  let camera;
  let clock;
  let flashlight;
  let flashlightHalo;
  let hemisphereLight;
  let ambientLight;
  let moonLight;
  let gameState = "title";
  let elapsed = 0;
  let schemaElapsed = 0;
  let schema = 1;
  let sessionId = 0;
  let captionUntil = 0;
  let dangerUntil = 0;
  let screenShake = 0;
  let pointerWasLocked = false;
  let orientationBlocked = false;
  let needsRender = true;
  let resizeFrame = 0;
  const touchResetters = [];
  const performanceState = { scale: 1, seconds: 0, frames: 0, goodWindows: 0 };
  const renderSize = { width: 0, height: 0, ratio: 0 };
  let spawnTimer = 0;
  let wave = 1;
  let kills = 0;
  let streak = 0;
  let lastKillAt = -20;
  let hudTimer = 0;
  let aimLockUntil = 0;
  let scoutMap;
  let mapOpen = true;
  const goldenBullet = { status: "seeking", x: 0, z: 0, model: null, epoch: 0, hintAt: -10 };
  const missionReminder = { nextAt: 12, index: 0 };
  let guideRotation = 0;

  const enemies = [];
  const effects = [];
  const projectiles = [];
  const pickups = [];
  const faceTextures = {};
  const raycaster = new THREE.Raycaster();
  const aimPoint = new THREE.Vector2(0, 0);
  const touchAssist = { target: null, scanTimer: 0, acquired: 0, ready: false, inhibitUntil: 0 };
  const fragmentGeometry = new THREE.TetrahedronGeometry(0.12, 0);
  const sparkGeometry = new THREE.SphereGeometry(0.055, 5, 4);
  const boltGeometry = new THREE.OctahedronGeometry(0.12, 0);
  const blastGeometry = new THREE.IcosahedronGeometry(0.55, 1);
  const blastRingGeometry = new THREE.RingGeometry(0.25, 0.34, 18);

  const controls = {
    keys: new Set(),
    moveX: 0,
    moveY: 0,
    lookDX: 0,
    lookDY: 0,
    fire: false,
    fireTouch: false,
    aimTouch: false,
    runTouch: false
  };

  const player = {
    x: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    height: 1.62,
    bob: 0,
    bobAmount: 0,
    moving: false,
    running: false,
    stamina: 100,
    health: 100,
    invulnerable: 0,
    torch: true
  };

  const weapon = {
    model: null,
    muzzle: null,
    muzzleLight: null,
    ammo: 32,
    magazine: 32,
    cooldown: 0,
    reload: 0,
    recoil: 0,
    flash: 0
  };

  const boss = {
    type: "boss",
    model: null,
    x: 0,
    z: 0,
    hp: 1,
    maxHp: 1,
    alive: false,
    phase: 1,
    speed: 1.45,
    radius: 1.18,
    damage: 20,
    attackCooldown: 0,
    webCooldown: 2.4,
    repath: 0,
    path: [],
    pathIndex: 0,
    gait: 0,
    parts: [],
    face: null
  };

  document.querySelectorAll(".segmented").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-value]");
      if (!button) return;
      settings[group.dataset.setting] = button.dataset.value;
      // The title and pause menu share the same live sensitivity setting.
      document.querySelectorAll('.segmented[data-setting="' + group.dataset.setting + '"]').forEach((control) => {
        control.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item.dataset.value === button.dataset.value));
      });
      if (group.dataset.setting === "quality" && renderer) applyQuality();
    });
  });

  const audio = {
    context: null,
    master: null,
    noiseBuffer: null,
    started: false,
    musicStep: 0,
    musicNext: 0,
    musicBus: null,
    organWave: null,
    // Original eight-bar nocturne: pipe-organ ostinato, semitone/tritone
    // tension and sustained pedal notes. No film recording or quoted melody.
    melody: [
      64, null, 59, 65, 64, null, 58, 59,
      64, 67, null, 65, 64, 63, null, 59,
      60, null, 67, 66, 64, null, 63, 60,
      59, 63, 66, null, 65, null, 63, 59,
      64, null, 70, 71, 67, 65, null, 64,
      65, 68, null, 71, 70, null, 68, 65,
      64, null, 60, 66, 65, 63, null, 59,
      63, 66, null, 65, 63, null, 59, null
    ],
    bass: [40, 40, 36, 35, 40, 41, 36, 35],
    chords: [[52, 55, 59], [52, 53, 58], [48, 55, 59], [47, 51, 57], [52, 55, 58], [53, 56, 59], [48, 54, 59], [47, 51, 54]],
    start() {
      if (this.started) {
        if (this.context && this.context.state === "suspended") this.context.resume();
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = settings.muted ? 0 : 0.58;
      this.master.connect(this.context.destination);

      const frames = this.context.sampleRate;
      this.noiseBuffer = this.context.createBuffer(1, frames, this.context.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;

      this.setupOrgan();
      this.started = true;
      this.resetMusic();
    },
    setupOrgan() {
      // One shared wavetable and reverb; one oscillator per voice keeps the
      // score light on phones. Combat sounds retain their original dry path.
      const partials = new Float32Array([0, 1, 0.52, 0.18, 0.28, 0.07, 0.10, 0.025, 0.08]);
      this.organWave = this.context.createPeriodicWave(new Float32Array(partials.length), partials);
      this.musicBus = this.context.createGain();
      this.musicBus.gain.value = 0.82;
      const dry = this.context.createGain();
      dry.gain.value = 0.78;
      this.musicBus.connect(dry); dry.connect(this.master);
      const reverb = this.context.createConvolver();
      const seconds = 2.8, rate = this.context.sampleRate;
      const impulse = this.context.createBuffer(2, Math.ceil(rate * seconds), rate);
      let seed = 7219;
      for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        let smooth = 0;
        for (let i = 0; i < data.length; i++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
          smooth = smooth * 0.58 + ((seed >>> 0) / 2147483648 - 1) * 0.42;
          data[i] = i < rate * 0.035 ? 0 : smooth * Math.pow(1 - i / data.length, 2.6);
        }
      }
      reverb.buffer = impulse;
      const wet = this.context.createGain();
      wet.gain.value = 0.32;
      this.musicBus.connect(reverb); reverb.connect(wet); wet.connect(this.master);
    },
    resetMusic() {
      if (!this.context) return;
      this.musicStep = 0;
      this.musicNext = this.context.currentTime + 0.05;
    },
    toggleMute() {
      settings.muted = !settings.muted;
      ui.mute.textContent = settings.muted ? "MUSIC + SOUND OFF" : "MUSIC + SOUND ON";
      ui.mute.setAttribute("aria-pressed", String(settings.muted));
      if (this.master && this.context) {
        const now = this.context.currentTime;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.linearRampToValueAtTime(settings.muted ? 0 : 0.58, now + 0.08);
      }
    },
    frequency(note) {
      return 440 * Math.pow(2, (note - 69) / 12);
    },
    musicNote(note, time, duration, volume, sustained = false) {
      if (!this.context || !this.musicBus || note === null) return;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.setPeriodicWave(this.organWave);
      osc.frequency.setValueAtTime(this.frequency(note), time);
      osc.detune.value = Math.sin(note * 1.7) * 2.4;
      const attack = sustained ? 0.08 : 0.018, release = sustained ? 0.65 : 0.16;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(volume, time + attack);
      gain.gain.exponentialRampToValueAtTime(volume * 0.82, time + duration);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + release);
      osc.connect(gain); gain.connect(this.musicBus);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      osc.start(time);
      osc.stop(time + duration + release + 0.02);
    },
    updateMusic() {
      if (!this.context || gameState !== "playing") return;
      if (this.musicNext < this.context.currentTime - 0.5) this.musicNext = this.context.currentTime;
      const stepDuration = 60 / 94 / 2;
      while (this.musicNext < this.context.currentTime + 0.16) {
        const step = this.musicStep, bar = Math.floor(step / 8) % 8;
        this.musicNote(this.melody[step % this.melody.length], this.musicNext, stepDuration * 0.76, step % 8 === 0 ? 0.070 : 0.053);
        if (step % 8 === 0) {
          this.musicNote(this.bass[bar], this.musicNext, stepDuration * 7.1, 0.060, true);
          this.chords[bar].forEach(note => this.musicNote(note, this.musicNext, stepDuration * 5.7, 0.021, true));
        }
        if (step % 8 === 4) this.musicNote(this.bass[bar] + 12, this.musicNext, stepDuration * 1.3, 0.022, true);
        this.musicStep += 1;
        this.musicNext += stepDuration;
      }
    },
    tone(frequency, duration, volume, type, slide) {
      if (!this.context || !this.master || settings.muted) return;
      const now = this.context.currentTime;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type || "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency + slide), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    },
    noise(duration, volume, cutoff, highpass) {
      if (!this.context || !this.master || !this.noiseBuffer || settings.muted) return;
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      source.buffer = this.noiseBuffer;
      filter.type = highpass ? "highpass" : "lowpass";
      filter.frequency.value = cutoff;
      gain.gain.setValueAtTime(volume, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      source.start();
      source.stop(this.context.currentTime + duration + 0.02);
    },
    shot() {
      this.noise(0.11, 0.16, 2600, true);
      this.tone(118, 0.12, 0.11, "square", -70);
      this.tone(760, 0.055, 0.045, "sawtooth", -410);
    },
    hit() {
      this.tone(310, 0.055, 0.055, "square", 160);
    },
    reload() {
      this.tone(540, 0.07, 0.05, "square", -100);
      setTimeout(() => this.tone(690, 0.07, 0.05, "square", 100), 420);
    },
    explosion(scale) {
      const size = scale || 1;
      this.noise(0.48 + size * 0.08, Math.min(0.32, 0.2 + size * 0.035), 900, false);
      this.noise(0.22, Math.min(0.2, 0.11 + size * 0.02), 1200, true);
      this.tone(82, 0.42, Math.min(0.2, 0.11 + size * 0.025), "sawtooth", -48);
      this.tone(46, 0.58, Math.min(0.18, 0.08 + size * 0.022), "sine", -18);
    },
    hurt() {
      this.tone(94, 0.19, 0.12, "sawtooth", -40);
    },
    phase() {
      this.tone(70, 0.55, 0.15, "sawtooth", 120);
      this.noise(0.4, 0.1, 700, false);
    }
  };

  ui.mute.addEventListener("click", () => {
    audio.start();
    audio.toggleMute();
  });

  const CELL = 4;
  const MAP_W = 33, MAP_H = 33;
  let world;
  let nearbyCell = "";
  const floorCells = [];
  const worldFromCell = (x, z) => ({ x: (x + 0.5) * CELL, z: (z + 0.5) * CELL });
  const cellFromWorld = (x, z) => ({ x: Math.floor(x / CELL), z: Math.floor(z / CELL) });
  const isWalkableCell = (x, z) => world ? world.walkable(x, z) : false;
  function refreshNearbyCells() {
    const center = cellFromWorld(player.x, player.z);
    const key = center.x + "," + center.z + ":" + world.generation;
    if (key === nearbyCell) return;
    nearbyCell = key; floorCells.length = 0;
    for (let z = center.z - 10; z <= center.z + 10; z++) for (let x = center.x - 10; x <= center.x + 10; x++) {
      if (isWalkableCell(x, z)) floorCells.push({ x, z });
    }
  }

  function addBox(x, y, z, width, height, depth, material, parent) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z);
    (parent || scene).add(mesh);
    return mesh;
  }

  function cylinderBetween(a, b, radius, material, parent, segments) {
    const direction = new THREE.Vector3().subVectors(b, a);
    const length = direction.length();
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.82, length, segments || 6), material);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    parent.add(mesh);
    return mesh;
  }

  function loadFaceTexture(path) {
    const texture = new THREE.TextureLoader().load(path);
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  function facePlane(texture, width, height) {
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.06,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height || width), material);
    mesh.userData.weak = 1.72;
    mesh.renderOrder = 3;
    return mesh;
  }

  function buildWorld() {
    world = new BertrandaWorld.World(THREE, scene, { touch: IS_TOUCH });
    world.setSchema(schema, stageInfo().cycle);
    const spawn = worldFromCell(8, 8);
    world.update(spawn.x, spawn.z, true);
  }
  function currentFaceTexture(type = "boss") {
    if (type !== "boss") return faceTextures[type === "spirit" ? "bat" : type === "demon" ? "roach" : type];
    return faceTextures.tiers ? faceTextures.tiers[stageInfo().cycleIndex] : faceTextures.bertranda;
  }
  function applyFaceTier() {
    if (boss.face) { boss.face.material.map = currentFaceTexture(); boss.face.material.needsUpdate = true; }
    enemies.forEach(enemy => { enemy.face.material.map = currentFaceTexture(enemy.type); enemy.face.material.needsUpdate = true; });
  }
  function applySchemaLook() {
    if (!scene) return;
    const info = stageInfo();
    const sky = info.environment.kind === "hell" ? 0x210707 : info.environment.kind === "forest" ? 0x102c29 : info.environment.kind === "cemetery" ? 0x172330 : info.cycle.background;
    scene.background.setHex(sky).lerp(new THREE.Color(info.cycle.background), 0.45);
    scene.fog.color.copy(scene.background);
    hemisphereLight.color.setHex(info.cycle.sky);
    hemisphereLight.groundColor.setHex(info.cycle.ground);
    hemisphereLight.intensity = ["forest", "cemetery", "hell"].includes(info.environment.kind) ? 1.1 : 0.92;
    ambientLight.color.setHex(info.cycle.sky); ambientLight.intensity = 0.48;
    moonLight.color.setHex(info.environment.kind === "hell" ? 0xff7948 : info.cycle.moon); moonLight.intensity = 0.7;
    world.setSchema(schema, info.cycle); world.update(player.x, player.z, true); refreshNearbyCells();
    document.body.dataset.schema = String(schema);
    document.body.dataset.cycle = String(info.cycleIndex + 1);
    document.body.dataset.environment = info.environment.kind;
    applyFaceTier(); applyQuality();
  }

  function buildWeapon() {
    const root = new THREE.Group();
    const dark = new THREE.MeshStandardMaterial({ color: 0x071923, roughness: 0.36, metalness: 0.76 });
    const brass = new THREE.MeshStandardMaterial({ color: 0x39e9df, emissive: 0x074c50, emissiveIntensity: 1.2, roughness: 0.3, metalness: 0.82 });
    const ceramic = new THREE.MeshStandardMaterial({ color: 0xcaff55, emissive: 0x426d12, emissiveIntensity: 1.1, roughness: 0.5, metalness: 0.1 });
    addBox(0, 0, 0, 0.34, 0.28, 0.92, dark, root);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.76, 10), brass);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.06, -0.73);
    root.add(barrel);
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 7, 15), ceramic);
    coil.position.set(0, 0.03, -0.35);
    root.add(coil);
    const grip = addBox(0, -0.28, 0.18, 0.19, 0.46, 0.25, dark, root);
    grip.rotation.x = -0.18;
    const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.34, 9), new THREE.MeshStandardMaterial({ color: 0xff55c7, emissive: 0xff178e, emissiveIntensity: 2.2, transparent: true, opacity: 0.9 }));
    vial.position.set(0.22, -0.05, -0.12);
    root.add(vial);

    weapon.muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.15, 7, 5), new THREE.MeshBasicMaterial({ color: 0xcaffff, transparent: true, opacity: 0.96 }));
    weapon.muzzle.position.set(0, 0.06, -1.12);
    weapon.muzzle.visible = false;
    root.add(weapon.muzzle);
    weapon.muzzleLight = new THREE.PointLight(0x59fff1, 0, 5, 2);
    weapon.muzzleLight.position.copy(weapon.muzzle.position);
    root.add(weapon.muzzleLight);
    root.position.set(0.34, -0.34, -0.62);
    root.rotation.set(-0.04, -0.04, 0);
    if (IS_TOUCH) root.scale.setScalar(0.72);
    camera.add(root);
    weapon.model = root;
  }

  function tagCreature(root, creature) {
    root.traverse((object) => {
      if (object.isMesh) object.userData.creature = creature;
    });
  }

  function buildBoss() {
    const root = new THREE.Group();
    const shell = new THREE.MeshStandardMaterial({ color: 0x20143d, emissive: 0x16052d, emissiveIntensity: 0.86, roughness: 0.5, metalness: 0.24, flatShading: true });
    const shellLight = new THREE.MeshStandardMaterial({ color: 0x28b9ae, emissive: 0x064d50, emissiveIntensity: 1.2, roughness: 0.54, metalness: 0.16, flatShading: true });
    const flesh = new THREE.MeshStandardMaterial({ color: 0xc61c84, emissive: 0x690039, emissiveIntensity: 1.35, roughness: 0.82, flatShading: true });

    const abdomen = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), shell);
    abdomen.scale.set(1.42, 0.84, 1.75);
    abdomen.position.set(0, 1.02, -0.78);
    root.add(abdomen);
    const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.9, 11, 7), shellLight);
    thorax.scale.set(1.18, 0.78, 1.18);
    thorax.position.set(0, 0.98, 0.55);
    root.add(thorax);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.64, 0.62, 8), flesh);
    neck.position.set(0, 1.28, 0.95);
    neck.rotation.x = Math.PI / 2.8;
    root.add(neck);
    const headBack = new THREE.Mesh(new THREE.SphereGeometry(0.73, 10, 7), shell);
    headBack.scale.set(1, 1.05, 0.55);
    headBack.position.set(0, 1.75, 0.92);
    root.add(headBack);
    const face = facePlane(currentFaceTexture(), 1.55, 1.55);
    face.position.set(0, 1.82, 1.34);
    root.add(face);

    [-1, 1].forEach((side) => {
      [-0.72, -0.22, 0.3, 0.75].forEach((zOffset, pair) => {
        const pivot = new THREE.Group();
        pivot.position.set(side * 0.62, 0.98, zOffset);
        const knee = new THREE.Vector3(side * (1.12 + pair * 0.1), 0.12 + Math.abs(pair - 1.5) * 0.06, zOffset * 0.5);
        const foot = new THREE.Vector3(side * (2.1 + pair * 0.12), -0.78, zOffset * 1.35);
        cylinderBetween(new THREE.Vector3(0, 0, 0), knee, 0.12, shellLight, pivot, 7);
        cylinderBetween(knee, foot, 0.082, shell, pivot, 7);
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.38, 5), flesh);
        claw.position.copy(foot);
        claw.rotation.z = side * Math.PI / 2;
        pivot.add(claw);
        root.add(pivot);
        boss.parts.push({ kind: "leg", object: pivot, side, pair });
      });
    });

    const crown = new THREE.Group();
    for (let i = 0; i < 5; i += 1) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.62 + i % 2 * 0.18, 5), shellLight);
      spike.position.set((i - 2) * 0.22, 2.65 - Math.abs(i - 2) * 0.08, 0.95);
      spike.rotation.z = (i - 2) * -0.13;
      crown.add(spike);
    }
    root.add(crown);

    boss.model = root;
    boss.face = face;
    tagCreature(root, boss);
    face.userData.weak = 1.9;
    root.visible = false;
    root.scale.setScalar(1.08);
    scene.add(root);
  }

  function buildRoachModel() {
    const root = new THREE.Group();
    const shell = new THREE.MeshStandardMaterial({ color: 0x791947, emissive: 0x38051e, emissiveIntensity: 0.9, roughness: 0.46, metalness: 0.22, flatShading: true });
    const edge = new THREE.MeshStandardMaterial({ color: 0xff7048, emissive: 0x811406, emissiveIntensity: 1.05, roughness: 0.54, metalness: 0.14, flatShading: true });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), shell);
    body.scale.set(0.72, 0.46, 1.38);
    body.position.y = 0.34;
    root.add(body);
    const wingA = new THREE.Mesh(new THREE.SphereGeometry(0.4, 7, 5), edge);
    wingA.scale.set(0.55, 0.16, 1.22);
    wingA.position.set(-0.2, 0.52, -0.06);
    root.add(wingA);
    const wingB = wingA.clone();
    wingB.position.x = 0.2;
    root.add(wingB);
    const parts = [];
    [-1, 1].forEach((side) => {
      [-0.32, 0, 0.34].forEach((zOffset, pair) => {
        const leg = new THREE.Group();
        leg.position.set(side * 0.24, 0.32, zOffset);
        cylinderBetween(new THREE.Vector3(), new THREE.Vector3(side * 0.5, -0.24, zOffset * 0.3), 0.035, edge, leg, 5);
        cylinderBetween(new THREE.Vector3(side * 0.5, -0.24, zOffset * 0.3), new THREE.Vector3(side * 0.86, -0.3, zOffset * 0.55), 0.023, shell, leg, 5);
        root.add(leg);
        parts.push({ kind: "leg", object: leg, side, pair });
      });
    });
    const face = facePlane(currentFaceTexture("roach"), 0.67, 0.67);
    face.position.set(0, 0.55, 0.69);
    root.add(face);
    return { root, parts, face };
  }

  function makeWing(side, material) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      0, 0, 0,
      side * 0.86, 0.02, -0.28,
      side * 1.34, 0, 0.16,
      side * 0.72, 0.01, 0.62,
      side * 0.2, 0, 0.4
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4]);
    geometry.computeVertexNormals();
    return new THREE.Mesh(geometry, material);
  }

  function buildBatModel() {
    const root = new THREE.Group();
    const skin = new THREE.MeshStandardMaterial({ color: 0x493292, emissive: 0x190948, emissiveIntensity: 0.72, roughness: 0.72, flatShading: true });
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xb41a8b, emissive: 0x4b0637, emissiveIntensity: 0.64, side: THREE.DoubleSide, roughness: 0.88, flatShading: true });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.34, 7, 5), skin);
    body.scale.set(0.72, 1.08, 0.76);
    root.add(body);
    const wings = [];
    [-1, 1].forEach((side) => {
      const wing = makeWing(side, wingMaterial);
      wing.position.y = 0.1;
      root.add(wing);
      wings.push({ kind: "wing", object: wing, side });
    });
    const face = facePlane(currentFaceTexture("bat"), 0.72, 0.72);
    face.position.set(0, 0.08, 0.35);
    root.add(face);
    return { root, parts: wings, face };
  }

  function buildSnakeModel() {
    const root = new THREE.Group();
    const scales = new THREE.MeshStandardMaterial({ color: 0x39ad43, emissive: 0x105122, emissiveIntensity: 0.9, roughness: 0.55, metalness: 0.08, flatShading: true });
    const belly = new THREE.MeshStandardMaterial({ color: 0xcaff55, emissive: 0x416c0f, emissiveIntensity: 1.05, roughness: 0.76, flatShading: true });
    const parts = [];
    for (let i = 0; i < 9; i += 1) {
      const segment = new THREE.Mesh(new THREE.SphereGeometry(0.29 - i * 0.015, 7, 5), i % 2 ? belly : scales);
      segment.scale.set(1, 0.64, 1.15);
      segment.position.set(0, 0.25 - i * 0.008, -i * 0.34);
      root.add(segment);
      parts.push({ kind: "segment", object: segment, index: i });
    }
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6), scales);
    head.scale.set(0.84, 0.75, 1.05);
    head.position.set(0, 0.42, 0.34);
    root.add(head);
    const face = facePlane(currentFaceTexture("snake"), 0.7, 0.78);
    face.position.set(0, 0.52, 0.69);
    root.add(face);
    return { root, parts, face };
  }

  function buildSpiritModel() {
    const root = new THREE.Group(), parts = [];
    const veil = new THREE.MeshBasicMaterial({ color: stageInfo().cycle.accent, transparent: true, opacity: 0.46, side: THREE.DoubleSide, depthWrite: false });
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.64, 1.8, 9, 1, true), veil);
    body.rotation.z = Math.PI; body.position.y = -0.12; root.add(body);
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.2, 6), veil);
      arm.position.set(side * 0.52, 0.3, 0); arm.rotation.z = side * 0.45;
      root.add(arm); parts.push({ object: arm, side });
    }
    const face = facePlane(currentFaceTexture("spirit"), 0.8, 0.94);
    face.position.set(0, 0.7, 0.32); root.add(face);
    return { root, parts, face };
  }

  function buildDemonModel() {
    const root = new THREE.Group(), parts = [];
    const skin = new THREE.MeshStandardMaterial({ color: 0xb83b42, emissive: 0x661324, emissiveIntensity: 0.65, roughness: 0.65, flatShading: true });
    const bone = new THREE.MeshStandardMaterial({ color: 0xffcf86, roughness: 0.8 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 6), skin);
    body.scale.set(0.9, 1.3, 0.64); body.position.y = 1.25; root.add(body);
    for (const side of [-1, 1]) {
      const limb = new THREE.Group(); limb.position.set(side * 0.35, 0.7, 0);
      cylinderBetween(new THREE.Vector3(), new THREE.Vector3(side * 0.13, -0.65, 0.12), 0.17, skin, limb);
      root.add(limb); parts.push({ object: limb, side });
      cylinderBetween(new THREE.Vector3(side * 0.45, 1.65, 0), new THREE.Vector3(side * 0.93, 0.82, 0.24), 0.16, skin, root);
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.84, 6), bone);
      horn.position.set(side * 0.32, 2.45, 0); horn.rotation.z = -side * 0.3; root.add(horn);
      const wing = makeWing(side, skin); wing.position.set(side * 0.3, 1.7, -0.25); wing.rotation.x = -0.8; root.add(wing);
    }
    const face = facePlane(currentFaceTexture("demon"), 0.88, 1.03);
    face.position.set(0, 2, 0.42); root.add(face);
    return { root, parts, face };
  }

  const CREATURES = {
    roach: { build: buildRoachModel, health: 28, speed: 2.7, damage: 4, radius: 0.52, contact: 0.85, baseY: 0.03, aimY: 0.55 },
    bat: { build: buildBatModel, health: 22, speed: 3.4, damage: 3, radius: 0.48, contact: 1.02, baseY: 1.95, aimY: 0.08 },
    snake: { build: buildSnakeModel, health: 38, speed: 2.3, damage: 5, radius: 0.58, contact: 0.92, baseY: 0.02, aimY: 0.52 },
    spirit: { build: buildSpiritModel, health: 32, speed: 2.55, damage: 4, radius: 0.6, contact: 0.8, baseY: 1.12, aimY: 0.7 },
    demon: { build: buildDemonModel, health: 60, speed: 2.6, damage: 6, radius: 0.65, contact: 1.02, baseY: 0.03, aimY: 1.8 }
  };

  function difficultyConfig() {
    const base = settings.difficulty === "quiet"
      ? { bossHp: 620, damage: 0.5, cap: 8, interval: 2.2, speed: 0.78 }
      : settings.difficulty === "nightmare"
        ? { bossHp: 1280, damage: 1.05, cap: 20, interval: 1, speed: 1.02 }
        : { bossHp: 900, damage: 0.72, cap: 14, interval: 1.55, speed: 0.88 };
    const escalation = Math.min(50, schema - 1);
    const finalSurge = schema >= MAX_SCHEMAS ? 1.55 : 1;
    return {
      bossHp: Math.round(base.bossHp * (1 + escalation * 0.12) * finalSurge),
      damage: base.damage * (1 + escalation * 0.027),
      cap: base.cap + Math.floor(escalation / 2),
      interval: Math.max(0.58, base.interval / (1 + escalation * 0.035)),
      speed: base.speed * (1 + escalation * 0.018)
    };
  }

  function effectiveEnemyCap() {
    const config = difficultyConfig();
    let cap = config.cap;
    const cycleBonus = stageInfo().cycleIndex * 2;
    if (settings.quality === "low") cap = Math.min(cap, 9 + cycleBonus);
    if (settings.quality === "deep") cap = Math.min(cap, (IS_TOUCH ? 12 : 16) + cycleBonus);
    if (settings.quality === "high" && IS_TOUCH) cap = Math.min(cap, 17 + cycleBonus);
    // Later schemas increase strength, not an unbounded mobile draw-call count.
    if (IS_TOUCH) cap = Math.min(cap, settings.quality === "low" ? 8 : settings.quality === "deep" ? 12 : 14);
    return cap;
  }

  function chooseSpawnCell(minDistance = 18) {
    const candidates = floorCells.filter((cell) => {
      const world = worldFromCell(cell.x, cell.z);
      const distance = Math.hypot(world.x - player.x, world.z - player.z);
      return distance >= minDistance && distance < minDistance + 16;
    });
    return candidates[Math.floor(Math.random() * candidates.length)] || floorCells[Math.floor(Math.random() * floorCells.length)];
  }

  function chooseEnemyType() {
    const roll = Math.random();
    const kind = stageInfo().environment.kind;
    if (kind === "forest") return roll < 0.65 ? "spirit" : roll < 0.88 ? "bat" : "snake";
    if (kind === "cemetery") return roll < 0.48 ? "spirit" : roll < 0.8 ? "bat" : "roach";
    if (kind === "catacombs") return roll < 0.5 ? "snake" : roll < 0.78 ? "roach" : "spirit";
    if (kind === "hell") return roll < 0.72 ? "demon" : roll < 0.88 ? "bat" : "snake";
    if (wave <= 1) return roll < 0.64 ? "roach" : roll < 0.84 ? "snake" : "bat";
    if (wave === 2) return roll < 0.42 ? "roach" : roll < 0.7 ? "snake" : "bat";
    return roll < 0.34 ? "roach" : roll < 0.62 ? "snake" : "bat";
  }

  function spawnCreature(forcedType, silent) {
    if (enemies.filter((enemy) => enemy.alive).length >= effectiveEnemyCap()) return;
    const type = forcedType || chooseEnemyType();
    const profile = CREATURES[type];
    const built = profile.build();
    const { health, speed, damage, radius } = profile;
    const creature = {
      type,
      model: built.root,
      face: built.face,
      parts: built.parts,
      x: 0,
      z: 0,
      hp: health,
      maxHp: health,
      speed,
      damage,
      radius,
      alive: true,
      attackCooldown: Math.random() * 0.5,
      repath: Math.random() * 0.3,
      path: [],
      pathIndex: 0,
      gait: Math.random() * TAU,
      seed: Math.random() * 100
    };
    const cell = chooseSpawnCell();
    const world = worldFromCell(cell.x, cell.z);
    creature.x = world.x;
    creature.z = world.z;
    creature.model.position.set(creature.x, profile.baseY, creature.z);
    tagCreature(creature.model, creature);
    creature.face.userData.weak = type === "bat" ? 2.05 : 1.78;
    scene.add(creature.model);
    enemies.push(creature);
    if (!silent) {
      spawnBurst(new THREE.Vector3(creature.x, type === "bat" ? 2 : 0.35, creature.z), type === "bat" ? 0x59fff1 : type === "snake" ? 0xcaff55 : 0xff3bbd);
      audio.tone(type === "bat" ? 880 : type === "snake" ? 170 : 230, 0.12, 0.035, "sawtooth", -60);
    }
  }

  // A moving local navigation window keeps memory bounded in an endless world.
  const navigation = { goal: "", originX: 0, originZ: 0, next: new Int16Array(MAP_W * MAP_H), queue: new Int16Array(MAP_W * MAP_H) };
  function findPath(start, goal) {
    if (!isWalkableCell(goal.x, goal.z)) {
      // Trees and gravestones occupy only part of a cell: path to the nearest
      // free centre, then use precise pursuit for the final approach.
      let nearest = null, best = Infinity;
      for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) {
        if (!isWalkableCell(goal.x + dx, goal.z + dz) || dx * dx + dz * dz >= best) continue;
        nearest = { x: goal.x + dx, z: goal.z + dz }; best = dx * dx + dz * dz;
      }
      if (nearest) goal = nearest;
    }
    if (!isWalkableCell(goal.x, goal.z) || !isWalkableCell(start.x, start.z)) return [];
    const key = goal.x + "," + goal.z + ":" + world.generation;
    if (navigation.goal !== key) {
      navigation.goal = key; navigation.originX = goal.x - 16; navigation.originZ = goal.z - 16;
      navigation.next.fill(-1);
      const root = 16 * MAP_W + 16;
      navigation.next[root] = root; navigation.queue[0] = root;
      let head = 0, tail = 1;
      while (head < tail) {
        const cell = navigation.queue[head++], x = cell % MAP_W, z = Math.floor(cell / MAP_W);
        for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, nz = z + dz, next = nz * MAP_W + nx;
          if (nx < 0 || nz < 0 || nx >= MAP_W || nz >= MAP_H || navigation.next[next] !== -1) continue;
          if (!isWalkableCell(nx + navigation.originX, nz + navigation.originZ)) continue;
          navigation.next[next] = cell; navigation.queue[tail++] = next;
        }
      }
    }
    const sx = start.x - navigation.originX, sz = start.z - navigation.originZ;
    if (sx < 0 || sz < 0 || sx >= MAP_W || sz >= MAP_H) return [];
    let cursor = sz * MAP_W + sx;
    const goalIndex = 16 * MAP_W + 16, path = [];
    if (cursor === goalIndex) return [worldFromCell(goal.x, goal.z)];
    while (cursor !== goalIndex && path.length < MAP_W * MAP_H) {
      cursor = navigation.next[cursor]; if (cursor < 0) return [];
      path.push(worldFromCell(cursor % MAP_W + navigation.originX, Math.floor(cursor / MAP_W) + navigation.originZ));
    }
    return path;
  }

  function lineOfSight(ax, az, bx, bz) {
    const distance = Math.hypot(bx - ax, bz - az);
    const steps = Math.ceil(distance / 0.4);
    for (let i = 1; i < steps; i += 1) {
      const amount = i / steps;
      if (!circleFree(lerp(ax, bx, amount), lerp(az, bz, amount), 0.08)) return false;
    }
    return true;
  }

  function moveCreature(creature, dt, speed) {
    creature.repath -= dt;
    if (creature.repath <= 0) {
      creature.repath = creature === boss ? 0.38 : 0.55 + Math.random() * 0.28;
      creature.path = findPath(cellFromWorld(creature.x, creature.z), cellFromWorld(player.x, player.z));
      creature.pathIndex = 0;
    }
    // Follow the actual player position in the last few metres. Previously an
    // enemy stopped at the cell centre and could never reach a player at its edge.
    const close = Math.hypot(player.x - creature.x, player.z - creature.z) < 10 && lineOfSight(creature.x, creature.z, player.x, player.z);
    let target = close ? player : creature.path[creature.pathIndex];
    if (!target) return;
    let dx = target.x - creature.x;
    let dz = target.z - creature.z;
    let distance = Math.hypot(dx, dz);
    if (distance < 0.22 && !close) {
      creature.pathIndex += 1;
      target = creature.path[creature.pathIndex];
      if (!target) return;
      dx = target.x - creature.x;
      dz = target.z - creature.z;
      distance = Math.hypot(dx, dz);
    }
    if (distance < 0.001) return;
    const amount = Math.min(distance, speed * dt);
    const stepX = dx / distance * amount, stepZ = dz / distance * amount;
    if (circleFree(creature.x + stepX, creature.z, 0.24)) creature.x += stepX;
    if (circleFree(creature.x, creature.z + stepZ, 0.24)) creature.z += stepZ;
    const targetRotation = Math.atan2(dx, dz);
    let delta = (targetRotation - creature.model.rotation.y + Math.PI) % TAU - Math.PI;
    if (delta < -Math.PI) delta += TAU;
    creature.model.rotation.y += delta * Math.min(1, dt * 9);
    creature.gait += dt * speed * 4.2;
  }

  function animateCreature(creature, dt) {
    if (creature.type === "roach") {
      creature.parts.forEach((part) => {
        part.object.rotation.y = Math.sin(creature.gait + part.pair * 1.8 + (part.side > 0 ? Math.PI : 0)) * 0.28;
        part.object.rotation.z = part.side * 0.08;
      });
      creature.model.position.set(creature.x, 0.03 + Math.abs(Math.sin(creature.gait * 0.5)) * 0.035, creature.z);
    } else if (creature.type === "bat") {
      creature.parts.forEach((part) => {
        part.object.rotation.z = part.side * Math.sin(creature.gait * 1.5) * 0.72;
        part.object.rotation.x = Math.sin(creature.gait) * 0.12;
      });
      creature.model.position.set(creature.x, 1.95 + Math.sin(elapsed * 4 + creature.seed) * 0.46, creature.z);
      creature.model.rotation.z = Math.sin(elapsed * 3 + creature.seed) * 0.13;
    } else if (creature.type === "snake") {
      creature.parts.forEach((part) => {
        part.object.position.x = Math.sin(creature.gait * 0.75 - part.index * 0.7) * (0.08 + part.index * 0.015);
        part.object.position.y = 0.25 - part.index * 0.008 + Math.abs(Math.sin(creature.gait - part.index * 0.55)) * 0.035;
      });
      creature.model.position.set(creature.x, 0.02, creature.z);
    } else if (creature.type === "spirit") {
      creature.model.position.set(creature.x, 1.12 + Math.sin(elapsed * 2.4 + creature.seed) * 0.3, creature.z);
      creature.model.rotation.z = Math.sin(elapsed * 2 + creature.seed) * 0.08;
      creature.parts.forEach(part => { part.object.rotation.z = part.side * (0.35 + Math.sin(creature.gait) * 0.2); });
    } else if (creature.type === "demon") {
      creature.model.position.set(creature.x, 0.03, creature.z);
      creature.parts.forEach(part => { part.object.rotation.x = Math.sin(creature.gait + part.side * Math.PI / 2) * 0.32; });
    }
    creature.attackCooldown = Math.max(0, creature.attackCooldown - dt);
  }

  function updateEnemies(dt) {
    const config = difficultyConfig();
    const speedScale = config.speed;
    for (let i = enemies.length - 1; i >= 0; i--) {
      const creature = enemies[i];
      if (!creature.alive) continue;
      if (Math.hypot(player.x - creature.x, player.z - creature.z) > 64) {
        scene.remove(creature.model); disposeGroup(creature.model); creature.alive = false; enemies.splice(i, 1); continue;
      }
      moveCreature(creature, dt, creature.speed * speedScale * (1 + Math.min(0.8, (wave - 1) * 0.035)));
      animateCreature(creature, dt);
      const distance = Math.hypot(player.x - creature.x, player.z - creature.z);
      if (distance < CREATURES[creature.type].contact + 0.42 && creature.attackCooldown <= 0 && lineOfSight(creature.x, creature.z, player.x, player.z)) {
        if (!damagePlayer(Math.max(2, creature.damage * config.damage))) continue;
        creature.attackCooldown = 0.9;
        showCaption("CONTACT · −" + Math.ceil(Math.max(2, creature.damage * config.damage)) + " VITALS", 0.8);
        const push = Math.max(0.001, distance);
        const nx = (player.x - creature.x) / push;
        const nz = (player.z - creature.z) / push;
        if (circleFree(player.x + nx * 0.45, player.z + nz * 0.45)) {
          player.x += nx * 0.45;
          player.z += nz * 0.45;
        }
      }
    }
  }

  function updateBoss(dt) {
    if (!boss.alive) return;
    // Bertranda follows an endless expedition without accumulating distant actors.
    if (Math.hypot(player.x - boss.x, player.z - boss.z) > 60) {
      const cell = chooseSpawnCell(28), point = worldFromCell(cell.x, cell.z);
      boss.x = point.x; boss.z = point.z; boss.path = []; boss.repath = 0;
      showCaption("Bertranda is following your trail.", 2);
    }
    const ratio = boss.hp / boss.maxHp;
    const nextPhase = ratio <= 0.32 ? 3 : ratio <= 0.66 ? 2 : 1;
    if (nextPhase > boss.phase) {
      boss.phase = nextPhase;
      audio.phase();
      showDanger(nextPhase === 2 ? "BERTRANDA IS MOLTING" : "BERTRANDA HAS LOST HER FACE", 2.8);
      showCaption(nextPhase === 2 ? "Her joints split wider. Keep firing." : "She is faster without the skin.", 3.8);
      for (let i = 0; i < nextPhase + 1; i += 1) spawnCreature();
    }
    const speed = (boss.speed + (boss.phase - 1) * 0.48) * difficultyConfig().speed;
    moveCreature(boss, dt, speed);
    boss.model.position.set(boss.x, 0.08 + Math.abs(Math.sin(boss.gait * 0.45)) * 0.1, boss.z);
    boss.parts.forEach((part) => {
      part.object.rotation.z = part.side * (0.12 + Math.sin(boss.gait + part.pair * 1.47 + (part.side > 0 ? Math.PI : 0)) * 0.24);
      part.object.rotation.y = Math.sin(boss.gait * 0.61 + part.pair) * 0.12;
    });
    boss.attackCooldown = Math.max(0, boss.attackCooldown - dt);
    boss.webCooldown -= dt;
    const distance = Math.hypot(player.x - boss.x, player.z - boss.z);
    if (distance < boss.radius + 0.72 && boss.attackCooldown <= 0) {
      boss.attackCooldown = 0.82;
      damagePlayer(boss.damage * difficultyConfig().damage);
      screenShake = Math.max(screenShake, 0.55);
    }
    if (boss.webCooldown <= 0 && distance > 4 && distance < 28 && lineOfSight(boss.x, boss.z, player.x, player.z)) {
      boss.webCooldown = Math.max(1.15, 3.4 - boss.phase * 0.58);
      launchWeb();
    }
  }

  function launchWeb() {
    const material = new THREE.MeshBasicMaterial({ color: 0x9affee, transparent: true, opacity: 0.94 });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.23, 1), material);
    const start = new THREE.Vector3(boss.x, 1.25, boss.z);
    const target = new THREE.Vector3(player.x, player.height, player.z);
    const velocity = target.sub(start).normalize().multiplyScalar(7.2 + boss.phase * 0.65);
    mesh.position.copy(start);
    if (!IS_TOUCH && settings.quality !== "low") mesh.add(new THREE.PointLight(0x59fff1, 1.2, 5, 2));
    scene.add(mesh);
    projectiles.push({ mesh, velocity, life: 5, damage: 12 + boss.phase * 3 });
    audio.tone(260, 0.16, 0.07, "sawtooth", 420);
  }

  function updateProjectiles(dt) {
    for (let i = projectiles.length - 1; i >= 0; i -= 1) {
      const projectile = projectiles[i];
      projectile.life -= dt;
      projectile.mesh.position.addScaledVector(projectile.velocity, dt);
      projectile.mesh.rotation.x += dt * 7;
      projectile.mesh.rotation.y += dt * 10;
      const cell = cellFromWorld(projectile.mesh.position.x, projectile.mesh.position.z);
      const playerDistance = projectile.mesh.position.distanceTo(camera.position);
      if (playerDistance < 0.72) {
        damagePlayer(projectile.damage * difficultyConfig().damage);
        explosionAt(projectile.mesh.position.clone(), 0.42, 0x59fff1, false);
        removeProjectile(i);
      } else if (projectile.life <= 0 || !isWalkableCell(cell.x, cell.z)) {
        explosionAt(projectile.mesh.position.clone(), 0.3, 0xcaff55, false);
        removeProjectile(i);
      }
    }
  }

  function removeProjectile(index) {
    const mesh = projectiles[index].mesh;
    scene.remove(mesh);
    disposeGroup(mesh);
    projectiles.splice(index, 1);
  }

  function circleFree(x, z, radius = 0.38) {
    return world.free(x, z, radius);
  }

  function setPlayerSpawn() {
    const spawn = worldFromCell(8, 8);
    player.x = spawn.x;
    player.z = spawn.z;
    player.yaw = -Math.PI / 2;
    player.pitch = 0;
    player.bob = 0;
    player.bobAmount = 0;
    player.moving = false;
    player.running = false;
    player.stamina = 100;
    player.health = 100;
    player.invulnerable = 0;
    player.torch = true;
    camera.position.set(player.x, player.height, player.z);
    camera.rotation.set(player.pitch, player.yaw, 0, "YXZ");
  }

  function updatePlayer(dt) {
    // Consume the complete gesture before movement: turning and walking now
    // use the same direction in this simulation step, without camera easing.
    const lookSpeed = (IS_TOUCH ? clamp(1.7 / Math.min(renderSize.width, renderSize.height), 0.0035, 0.0068) : 0.0032) * (LOOK_LEVELS[settings.look] || 1);
    player.yaw -= controls.lookDX * lookSpeed;
    player.pitch = clamp(player.pitch - controls.lookDY * lookSpeed * (IS_TOUCH ? 0.78 : 1), -1.1, 1.1);
    controls.lookDX = controls.lookDY = 0;

    const keyboardX = (controls.keys.has("KeyD") || controls.keys.has("ArrowRight") ? 1 : 0) - (controls.keys.has("KeyA") || controls.keys.has("ArrowLeft") ? 1 : 0);
    const keyboardY = (controls.keys.has("KeyW") || controls.keys.has("ArrowUp") ? 1 : 0) - (controls.keys.has("KeyS") || controls.keys.has("ArrowDown") ? 1 : 0);
    let moveX = clamp(keyboardX + controls.moveX, -1, 1);
    let moveY = clamp(keyboardY + controls.moveY, -1, 1);
    const movementLength = Math.hypot(moveX, moveY);
    if (movementLength > 1) {
      moveX /= movementLength;
      moveY /= movementLength;
    }

    const wantsRun = controls.keys.has("ShiftLeft") || controls.keys.has("ShiftRight") || controls.runTouch;
    player.running = wantsRun && movementLength > 0.1 && player.stamina > 1;
    const speed = player.running ? PLAYER_SPEED.sprint : PLAYER_SPEED.walk;
    if (player.running) player.stamina = Math.max(0, player.stamina - dt * 17);
    else player.stamina = Math.min(100, player.stamina + dt * 16);

    const forwardX = -Math.sin(player.yaw);
    const forwardZ = -Math.cos(player.yaw);
    const rightX = Math.cos(player.yaw);
    const rightZ = -Math.sin(player.yaw);
    const dx = (forwardX * moveY + rightX * moveX) * speed * dt;
    const dz = (forwardZ * moveY + rightZ * moveX) * speed * dt;
    if (circleFree(player.x + dx, player.z)) player.x += dx;
    if (circleFree(player.x, player.z + dz)) player.z += dz;
    player.moving = movementLength > 0.08 && Math.abs(dx) + Math.abs(dz) > 0.0001;

    if (player.moving) {
      player.bob += dt * (player.running ? 10.8 : 7.3);
      player.bobAmount = lerp(player.bobAmount, player.running ? 1 : 0.65, Math.min(1, dt * 8));
    } else {
      player.bobAmount = lerp(player.bobAmount, 0, Math.min(1, dt * 7));
    }

    if (IS_TOUCH) {
      camera.position.set(player.x, player.height, player.z);
      camera.rotation.set(player.pitch, player.yaw, 0, "YXZ");
      camera.updateMatrixWorld(true);
      updateTouchAim(dt);
    }

    const stability = IS_TOUCH ? 0.18 : 1;
    const bobY = Math.abs(Math.sin(player.bob)) * 0.066 * player.bobAmount * stability;
    const sway = Math.sin(player.bob * 0.5) * 0.015 * player.bobAmount * stability;
    const shakeX = (Math.random() - 0.5) * screenShake * stability;
    const shakeY = (Math.random() - 0.5) * screenShake * 0.72 * stability;
    camera.position.set(player.x + shakeX, player.height + bobY + shakeY, player.z + (Math.random() - 0.5) * screenShake * stability);
    camera.rotation.set(player.pitch + shakeY * 0.08, player.yaw + shakeX * 0.06, sway, "YXZ");
    // Mouse shots and touch shots both use the view from this frame.
    camera.updateMatrixWorld(true);
    screenShake = Math.max(0, screenShake - dt * (1.7 + screenShake * 7));
    player.invulnerable = Math.max(0, player.invulnerable - dt);
  }

  function toggleTorch() {
    if (gameState !== "playing") return;
    player.torch = !player.torch;
    audio.tone(player.torch ? 580 : 270, 0.07, 0.055, "square", player.torch ? 70 : -40);
    ui.touchTorch.classList.toggle("pressed", player.torch);
    ui.touchTorch.textContent = IS_TOUCH ? "☼" : player.torch ? "LIGHT ON" : "LIGHT OFF";
    ui.touchTorch.setAttribute("aria-label", player.torch ? "Turn light off" : "Turn light on");
    ui.touchTorch.setAttribute("aria-pressed", String(player.torch));
    showCaption(player.torch ? "WEAPON LIGHT ON · E/F" : "WEAPON LIGHT OFF · E/F", 1.25);
    updateHud();
  }

  function startReload(showFeedback) {
    if (gameState !== "playing") return;
    if (weapon.reload > 0) {
      if (showFeedback) showCaption("RELOAD ALREADY IN PROGRESS", 1.1);
      return;
    }
    if (weapon.ammo >= weapon.magazine) {
      if (showFeedback) {
        showCaption("MAGAZINE FULL · R IS WORKING", 1.35);
        audio.tone(640, 0.05, 0.035, "square", 40);
      }
      return;
    }
    weapon.reload = 1.12;
    controls.fire = false;
    ui.reticle.classList.add("reloading");
    showCaption("RELOADING SALT CELLS", 1.15);
    audio.reload();
  }

  function updateWeapon(dt) {
    weapon.cooldown = Math.max(0, weapon.cooldown - dt);
    weapon.recoil = Math.max(0, weapon.recoil - dt * 6.7);
    weapon.flash = Math.max(0, weapon.flash - dt);
    if (weapon.flash <= 0) {
      weapon.muzzle.visible = false;
      weapon.muzzleLight.intensity = 0;
    }
    if (weapon.reload > 0) {
      weapon.reload -= dt;
      if (weapon.reload <= 0) {
        weapon.reload = 0;
        weapon.ammo = weapon.magazine;
        ui.reticle.classList.remove("reloading");
        audio.tone(820, 0.08, 0.055, "square", 130);
      }
    } else if (weapon.cooldown <= 0 && (controls.fire || (IS_TOUCH && controls.fireTouch) || shouldAutoFire())) {
      fireWeapon();
    }

    const bob = player.moving ? Math.sin(player.bob) * 0.014 : Math.sin(elapsed * 1.8) * 0.004;
    weapon.model.position.set(0.34 + bob, -0.34 - weapon.recoil * 0.12 + Math.abs(bob) * 0.5, -0.62 + weapon.recoil * 0.12);
    weapon.model.rotation.set(-0.04 + weapon.recoil * 0.18, -0.04, bob * 0.7);
  }

  function creatureFromHit(hit) {
    if (!hit) return null;
    let object = hit.object;
    let creature = object.userData.creature;
    while (!creature && object.parent) {
      object = object.parent;
      creature = object.userData.creature;
    }
    if (!creature || !creature.alive) return null;
    return { creature, multiplier: hit.object.userData.weak || object.userData.weak || 1 };
  }

  function findAimAssistTarget() {
    const candidates = enemies.filter((enemy) => enemy.alive);
    if (boss.alive) candidates.push(boss);
    let best = null;
    candidates.forEach((creature) => {
      const height = creature === boss ? 1.65 : CREATURES[creature.type].aimY + creature.model.position.y;
      const point = new THREE.Vector3(creature.x, height, creature.z);
      const distance = point.distanceTo(camera.position);
      if (distance > 50 || !lineOfSight(player.x, player.z, creature.x, creature.z)) return;
      const projected = point.clone().project(camera);
      if (projected.z < -1 || projected.z > 1) return;
      // Use height-relative screen distance on phones, so a wide landscape
      // viewport doesn't distort the assist cone horizontally.
      const screenDistance = Math.hypot(projected.x * (IS_TOUCH ? camera.aspect : 1), projected.y);
      const limit = IS_TOUCH ? (distance < 6 ? 1.05 : 0.64) + (creature === boss ? 0.1 : 0) : 0.2 + (creature === boss ? 0.035 : 0);
      if (screenDistance > limit) return;
      const score = screenDistance + distance * 0.0008 - (IS_TOUCH && touchAssist.target?.creature === creature ? 0.08 : 0);
      if (!best || score < best.score) best = { creature, point, score };
    });
    return best;
  }

  function updateTouchAim(dt) {
    if (!IS_TOUCH || !canPlay()) return;
    touchAssist.scanTimer -= dt;
    if (touchAssist.scanTimer <= 0 || (touchAssist.target && !touchAssist.target.creature.alive)) {
      const next = findAimAssistTarget();
      if (next?.creature !== touchAssist.target?.creature) touchAssist.acquired = 0;
      touchAssist.target = next;
      touchAssist.scanTimer = 0.09;
    }
    const target = touchAssist.target;
    touchAssist.ready = false;
    ui.aimTarget.hidden = !target;
    if (!target) return;
    const creature = target.creature;
    target.point.set(creature.x, creature === boss ? 1.65 : CREATURES[creature.type].aimY + creature.model.position.y, creature.z);
    // Assist the shot, never steer the view. Even a slow swipe belongs to the
    // player, and lifting a finger must leave the camera where it was aimed.
    const projected = target.point.clone().project(camera);
    const aimDistance = Math.hypot(projected.x * camera.aspect, projected.y);
    touchAssist.acquired += dt;
    touchAssist.ready = projected.z > -1 && projected.z < 1 && aimDistance < 0.34 && touchAssist.acquired >= 0.14;
    ui.aimTarget.style.left = (50 + projected.x * 50) + "%";
    ui.aimTarget.style.top = (50 - projected.y * 50) + "%";
    ui.aimTarget.classList.toggle("ready", touchAssist.ready);
  }

  function shouldAutoFire() {
    const target = touchAssist.target?.creature;
    return IS_TOUCH && settings.touchAuto && canPlay() && elapsed >= touchAssist.inhibitUntil && touchAssist.ready && target?.alive && lineOfSight(player.x, player.z, target.x, target.z);
  }

  function toggleTouchAuto() {
    if (!IS_TOUCH || !canPlay()) return;
    settings.touchAuto = !settings.touchAuto;
    updateHud();
    showCaption(settings.touchAuto ? "AUTO FIRE ON · aim near a creature" : "MANUAL FIRE · hold FIRE and drag to aim", 2);
  }

  function fireWeapon() {
    if (weapon.reload > 0) return;
    if (weapon.ammo <= 0) {
      startReload();
      return;
    }
    weapon.ammo -= 1;
    weapon.cooldown = 0.092;
    weapon.recoil = Math.min(1, weapon.recoil + 0.48);
    weapon.flash = 0.052;
    weapon.muzzle.visible = true;
    weapon.muzzle.scale.setScalar(0.75 + Math.random() * 0.65);
    weapon.muzzleLight.intensity = 3.3;
    audio.shot();
    screenShake = Math.max(screenShake, 0.035);

    raycaster.setFromCamera(aimPoint, camera);
    raycaster.far = 52;
    const targets = [...world.blockers];
    if (boss.alive) targets.push(boss.model);
    enemies.forEach((enemy) => {
      if (enemy.alive) targets.push(enemy.model);
    });
    const hits = raycaster.intersectObjects(targets, true);
    const fallback = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(48));
    const hit = hits[0];
    const direct = creatureFromHit(hit);
    const assisted = direct ? null : findAimAssistTarget();
    const end = direct ? hit.point.clone() : assisted ? assisted.point.clone() : hit ? hit.point.clone() : fallback;
    const start = weapon.muzzle.getWorldPosition(new THREE.Vector3());
    const token = sessionId;
    const epoch = goldenBullet.epoch;
    const target = direct ? direct.creature : assisted ? assisted.creature : null;
    // Only reserve the special round for a confirmed hit on an exposed boss.
    // Missing, reloading and shooting other creatures never waste the relic.
    const golden = target === boss && goldenBullet.status === "loaded" && bossExposed();
    if (golden) {
      goldenBullet.status = "fired";
      audio.tone(740, 0.4, 0.14, "triangle", 430);
      screenShake = Math.max(screenShake, 0.15);
    }
    createTracer(start, end, () => {
      if (sessionId !== token || goldenBullet.epoch !== epoch || gameState !== "playing") return;
      if (direct && direct.creature.alive) {
        damageCreature(direct.creature, 26 * direct.multiplier, end, direct.multiplier > 1.1, golden);
      } else if (assisted && assisted.creature.alive) {
        damageCreature(assisted.creature, 26 * (assisted.creature === boss ? 1.25 : 1.18), end, true, golden);
      } else if (hit) {
        impactAt(end, 0x59fff1, 4);
      }
    }, golden);
    if (assisted) {
      aimLockUntil = elapsed + 0.2;
      ui.reticle.classList.add("locked");
    }
    if (weapon.ammo <= 0) setTimeout(() => {
      if (gameState === "playing") startReload();
    }, 120);
  }

  function bossExposed() { return boss.hp <= boss.maxHp * 0.2 + 0.001; }

  function damageCreature(creature, damage, point, weak, golden = false) {
    if (!creature.alive) return;
    if (creature === boss) {
      if (golden && goldenBullet.status === "fired" && bossExposed()) {
        goldenBullet.status = "spent";
        creature.hp = 0;
      } else {
        creature.hp = Math.max(creature.maxHp * 0.2, creature.hp - damage);
        if (bossExposed() && elapsed >= goldenBullet.hintAt) {
          goldenBullet.hintAt = elapsed + 5;
          showCaption(goldenBullet.status === "seeking" ? "Her last seal needs GOLD. Follow the map to the golden bullet." : "Seal exposed. Fire at Bertranda — the golden round loads automatically!", 3);
        }
      }
    } else creature.hp -= damage;
    impactAt(point, weak ? 0xcaff55 : 0xff3bbd, weak ? 8 : 5);
    audio.hit();
    ui.reticle.classList.remove("hit");
    void ui.reticle.offsetWidth;
    ui.reticle.classList.add("hit");
    setTimeout(() => ui.reticle.classList.remove("hit"), 90);
    if (creature === boss) {
      ui.bossFlash.classList.remove("visible");
      void ui.bossFlash.offsetWidth;
      ui.bossFlash.classList.add("visible");
      setTimeout(() => ui.bossFlash.classList.remove("visible"), 480);
    }
    if (creature.hp <= 0) {
      if (creature === boss) killBoss();
      else killCreature(creature);
    }
  }

  function disposeGroup(root) {
    const geometries = new Set();
    const materials = new Set();
    root.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (Array.isArray(object.material)) object.material.forEach((material) => materials.add(material));
      else if (object.material) materials.add(object.material);
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
  }

  function killCreature(creature) {
    if (!creature.alive) return;
    creature.alive = false;
    scene.remove(creature.model);
    disposeGroup(creature.model);
    const enemyIndex = enemies.indexOf(creature);
    if (enemyIndex >= 0) enemies.splice(enemyIndex, 1);
    kills += 1;
    streak = elapsed - lastKillAt < 3.2 ? streak + 1 : 1;
    lastKillAt = elapsed;
    const position = new THREE.Vector3(creature.x, creature.type === "bat" ? 1.95 : 0.46, creature.z);
    explosionAt(position, creature.type === "snake" ? 0.85 : 0.68, creature.type === "bat" ? 0x59fff1 : creature.type === "snake" ? 0xcaff55 : 0xff3bbd, true);
    if (kills % 8 === 0 || Math.random() < 0.09) spawnHealth(position);
  }

  function killBoss() {
    if (!boss.alive || goldenBullet.status !== "spent") return;
    boss.alive = false;
    boss.hp = 0;
    gameState = "transitioning";
    controls.fire = false;
    const finalSchema = schema % MAX_SCHEMAS === 0;
    ui.objective.textContent = "DESCENT " + schema + " CLEARED";
    showDanger(finalSchema ? "CORRUPTION CYCLE CLEARED · THE DESCENT CONTINUES" : "BERTRANDA DOWN · THE NEXT REALM IS OPENING", 3);
    const token = sessionId;
    const base = new THREE.Vector3(boss.x, 1.15, boss.z);
    boss.model.visible = false;
    explosionAt(base.clone(), 2.55, 0xffd45a, true);
    [140, 300, 470, 650, 820].forEach((delay, index) => {
      setTimeout(() => {
        if (sessionId !== token || gameState !== "transitioning") return;
        const offset = new THREE.Vector3((Math.random() - 0.5) * 4.6, Math.random() * 2 + 0.25, (Math.random() - 0.5) * 4.6);
        explosionAt(base.clone().add(offset), 1.1 + index * 0.18, index % 2 ? 0x59fff1 : 0xcaff55, true);
      }, delay);
    });
    enemies.forEach((enemy, index) => {
      if (!enemy.alive) return;
      setTimeout(() => {
        if (sessionId === token && enemy.alive) killCreature(enemy);
      }, 80 + index * 42);
    });
    setTimeout(() => {
      if (sessionId !== token || gameState !== "transitioning") return;
      beginNextSchema();
    }, 1700);
  }

  function configureBossForSchema() {
    const config = difficultyConfig();
    const info = stageInfo();
    boss.maxHp = config.bossHp;
    boss.hp = boss.maxHp;
    boss.phase = 1;
    boss.alive = true;
    boss.path = [];
    boss.pathIndex = 0;
    boss.repath = 0;
    boss.attackCooldown = 1.35;
    boss.webCooldown = Math.max(2.1, 3.65 - schema * 0.24);
    boss.gait = 0;
    const bossCell = chooseSpawnCell(24);
    const bossSpawn = worldFromCell(bossCell.x, bossCell.z);
    boss.x = bossSpawn.x;
    boss.z = bossSpawn.z;
    boss.model.position.set(boss.x, 0.08, boss.z);
    boss.model.rotation.set(0, Math.PI, 0);
    const finalScale = schema >= MAX_SCHEMAS ? 0.22 : 0;
    boss.model.scale.setScalar(1 + info.cycleIndex * 0.12 + info.environmentIndex * 0.025 + finalScale);
    boss.model.visible = true;
    applyFaceTier();
  }

  function spawnOpeningSwarm() {
    const base = settings.difficulty === "quiet" ? 3 : settings.difficulty === "nightmare" ? 5 : 4;
    const count = Math.min(effectiveEnemyCap(), base + Math.min(3, schema - 1));
    for (let i = 0; i < count; i += 1) {
      spawnCreature(null, true);
    }
  }

  function clearBetweenSchemas() {
    clearSessionObjects();
  }

  function beginNextSchema() {
    clearBetweenSchemas();
    if (IS_TOUCH) resetInputs();
    schema += 1;
    schemaElapsed = 0;
    wave = 1;
    spawnTimer = 1.7;
    screenShake = 0.12;
    setPlayerSpawn();
    weapon.ammo = weapon.magazine;
    weapon.reload = 0;
    weapon.cooldown = 0;
    weapon.recoil = 0;
    controls.fire = false;
    applySchemaLook();
    configureBossForSchema();
    placeGoldenBullet();
    spawnOpeningSwarm();
    gameState = "playing";
    updateOrientation();
    ui.reticle.classList.remove("reloading", "hit", "locked");
    ui.touchTorch.classList.add("pressed");
    ui.touchTorch.textContent = IS_TOUCH ? "☼" : "LIGHT ON";
    ui.touchTorch.setAttribute("aria-label", "Turn light off");
    ui.touchTorch.setAttribute("aria-pressed", "true");
    audio.resetMusic();
    updateHud();
    showDanger("DESCENT " + schema + " · " + stageInfo().environment.short, 2.6);
    const info = stageInfo();
    showCaption(info.environment.name + ". A new golden bullet is hidden here — follow the map.", 4.2);
  }

  function damagePlayer(amount) {
    if (gameState !== "playing" || player.invulnerable > 0) return false;
    player.invulnerable = 0.55;
    player.health = Math.max(0, player.health - amount);
    screenShake = Math.max(screenShake, 0.3);
    audio.hurt();
    ui.damageFlash.classList.remove("visible");
    void ui.damageFlash.offsetWidth;
    ui.damageFlash.classList.add("visible");
    setTimeout(() => ui.damageFlash.classList.remove("visible"), 310);
    if (player.health <= 0) killPlayer();
    return true;
  }

  function killPlayer() {
    if (gameState !== "playing") return;
    gameState = "dying";
    ui.mapWrap.hidden = true;
    controls.fire = false;
    if (document.pointerLockElement) document.exitPointerLock();
    ui.scare.classList.remove("visible");
    void ui.scare.offsetWidth;
    ui.scare.classList.add("visible");
    audio.explosion(1.1);
    audio.tone(180, 0.8, 0.19, "sawtooth", -145);
    setTimeout(() => {
      if (gameState !== "dying") return;
      ui.hud.hidden = true;
      ui.touch.hidden = true;
      ui.death.hidden = false;
      ui.death.classList.add("is-visible");
      gameState = "dead";
    }, 760);
  }

  function createTracer(start, end, onImpact, golden = false) {
    const distance = start.distanceTo(end);
    const duration = clamp(distance / 86, 0.13, 0.34);
    const material = new THREE.MeshBasicMaterial({ color: golden ? 0xffdf65 : 0xcaffff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const bolt = new THREE.Mesh(boltGeometry, material);
    bolt.position.copy(start);
    bolt.scale.set(1.35, 1.35, 5.4);
    if (golden) bolt.scale.multiplyScalar(2);
    bolt.lookAt(end);
    bolt.renderOrder = 6;
    scene.add(bolt);

    const trailGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const trailMaterial = new THREE.LineBasicMaterial({ color: golden ? 0xffbe38 : 0x59fff1, transparent: true, opacity: 0.74, blending: THREE.AdditiveBlending, depthWrite: false });
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    trail.renderOrder = 5;
    scene.add(trail);
    effects.push({ kind: "bolt", object: bolt, trail, start: start.clone(), end: end.clone(), life: duration, maxLife: duration, onImpact });
  }

  function impactAt(position, color, count) {
    count = Math.min(count, particleSlots());
    for (let i = 0; i < count; i += 1) {
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
      const spark = new THREE.Mesh(sparkGeometry, material);
      spark.position.copy(position);
      const velocity = new THREE.Vector3((Math.random() - 0.5) * 3.4, Math.random() * 2.6, (Math.random() - 0.5) * 3.4);
      scene.add(spark);
      effects.push({ kind: "fragment", object: spark, velocity, life: 0.36 + Math.random() * 0.22, maxLife: 0.58, gravity: 5.8 });
    }
  }

  function spawnBurst(position, color) {
    impactAt(position, color, settings.quality === "low" ? 4 : settings.quality === "deep" ? 6 : 9);
    if (!IS_TOUCH && settings.quality !== "low") {
      const light = new THREE.PointLight(color, 1.5, 6, 2);
      light.position.copy(position);
      scene.add(light);
      effects.push({ kind: "light", object: light, life: 0.35, maxLife: 0.35 });
    }
  }

  function explosionAt(position, scale, color, loud) {
    const coreMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
    const core = new THREE.Mesh(blastGeometry, coreMaterial);
    core.position.copy(position);
    scene.add(core);
    const light = IS_TOUCH || settings.quality === "low" ? null : new THREE.PointLight(color, 5.4 * scale, 11 * scale, 1.5);
    if (light) {
      light.position.copy(position);
      scene.add(light);
    }
    effects.push({ kind: "blast", object: core, light, life: 0.48, maxLife: 0.48, scale });

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffe49b, transparent: true, opacity: 0.74, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(blastRingGeometry, ringMaterial);
    ring.position.copy(position);
    ring.lookAt(camera.position);
    scene.add(ring);
    effects.push({ kind: "ring", object: ring, life: 0.42, maxLife: 0.42, scale });

    const fragments = settings.quality === "low" ? Math.min(8, 5 + Math.round(scale * 2)) : settings.quality === "deep" ? Math.min(15, 9 + Math.round(scale * 3)) : Math.min(25, 15 + Math.round(scale * 4));
    const fragmentCount = Math.min(fragments, particleSlots());
    for (let i = 0; i < fragmentCount; i += 1) {
      const fragmentMaterial = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xcaff55 : i % 2 ? color : 0x59fff1, transparent: true, opacity: 1 });
      const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
      fragment.position.copy(position);
      fragment.scale.setScalar(0.6 + Math.random() * 1.2);
      const velocity = new THREE.Vector3((Math.random() - 0.5) * 7, Math.random() * 5.2 + 0.8, (Math.random() - 0.5) * 7).multiplyScalar(0.7 + scale * 0.26);
      scene.add(fragment);
      effects.push({ kind: "fragment", object: fragment, velocity, life: 0.68 + Math.random() * 0.62, maxLife: 1.3, gravity: 6.8, spin: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10) });
    }
    screenShake = Math.max(screenShake, Math.min(0.95, 0.18 + scale * 0.25));
    if (loud) audio.explosion(scale);
  }

  function particleSlots() {
    // Never discard bolts or their damage callbacks: budget decorative fragments only.
    const budget = IS_TOUCH ? (settings.quality === "low" ? 32 : 64) : 180;
    return Math.max(0, budget - effects.length);
  }

  function updateEffects(dt) {
    for (let i = effects.length - 1; i >= 0; i -= 1) {
      const effect = effects[i];
      effect.life -= dt;
      if (effect.kind === "fragment") {
        effect.velocity.y -= effect.gravity * dt;
        effect.object.position.addScaledVector(effect.velocity, dt);
        if (effect.spin) {
          effect.object.rotation.x += effect.spin.x * dt;
          effect.object.rotation.y += effect.spin.y * dt;
          effect.object.rotation.z += effect.spin.z * dt;
        }
        if (effect.object.material) effect.object.material.opacity = clamp(effect.life / Math.min(0.35, effect.maxLife), 0, 1);
      } else if (effect.kind === "blast") {
        const progress = 1 - effect.life / effect.maxLife;
        effect.object.scale.setScalar(effect.scale * (0.3 + progress * 3.7));
        effect.object.material.opacity = Math.max(0, 1 - progress);
        if (effect.light) effect.light.intensity = Math.max(0, (1 - progress) * 6 * effect.scale);
      } else if (effect.kind === "ring") {
        const progress = 1 - effect.life / effect.maxLife;
        effect.object.scale.setScalar(effect.scale * (0.5 + progress * 7));
        effect.object.material.opacity = Math.max(0, (1 - progress) * 0.74);
      } else if (effect.kind === "bolt") {
        const progress = clamp(1 - effect.life / effect.maxLife, 0, 1);
        effect.object.position.lerpVectors(effect.start, effect.end, progress);
        effect.object.material.opacity = Math.sin(Math.PI * progress) * 0.7 + 0.3;
        effect.object.scale.x = effect.object.scale.y = 1.15 + Math.sin(progress * Math.PI * 6) * 0.25;
        effect.trail.material.opacity = Math.max(0, (1 - progress) * 0.72);
      } else if (effect.kind === "light") {
        effect.object.intensity = Math.max(0, effect.life / effect.maxLife * 1.5);
      }
      if (effect.life <= 0) {
        const onImpact = effect.onImpact;
        scene.remove(effect.object);
        if (effect.light) scene.remove(effect.light);
        if (effect.trail) {
          scene.remove(effect.trail);
          effect.trail.geometry.dispose();
          effect.trail.material.dispose();
        }
        if (effect.object.material) effect.object.material.dispose();
        effects.splice(i, 1);
        if (onImpact) onImpact();
      }
    }
  }

  function clearGoldenBullet() {
    goldenBullet.epoch += 1;
    if (goldenBullet.model) {
      scene.remove(goldenBullet.model);
      disposeGroup(goldenBullet.model);
      goldenBullet.model = null;
    }
  }

  function placeGoldenBullet() {
    clearGoldenBullet();
    const site = BertrandaExpedition.chooseBulletSite(world, player);
    goldenBullet.status = "seeking";
    goldenBullet.x = site.x; goldenBullet.z = site.z;
    goldenBullet.hintAt = -10;
    missionReminder.nextAt = elapsed + 12;
    missionReminder.index = 0;
    const group = new THREE.Group();
    // Unlit neon stays green and visible in every realm and graphics preset.
    const gold = new THREE.MeshBasicMaterial({ color: 0x76ff03, toneMapped: false, fog: false });
    const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.84, 10), gold);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.44, 10), new THREE.MeshBasicMaterial({ color: 0xd9ffb4, toneMapped: false, fog: false }));
    tip.position.y = 0.64;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.1, 10), gold);
    base.position.y = -0.43;
    const glow = new THREE.MeshBasicMaterial({ color: 0x76ff03, toneMapped: false, fog: false, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.065, 5, 20), glow);
    const seal = new THREE.Mesh(new THREE.RingGeometry(0.86, 1.08, 24), glow);
    halo.name = "golden-halo"; seal.name = "golden-seal";
    seal.rotation.x = -Math.PI / 2; seal.position.y = -0.9;
    group.add(casing, tip, base, halo, seal);
    group.position.set(site.x, 1.05, site.z);
    goldenBullet.model = group; scene.add(group);
    scoutMap.reset();
    syncMapVisibility();
  }

  function updateGoldenBullet(dt) {
    if (gameState !== "playing" || goldenBullet.status !== "seeking" || !goldenBullet.model) return;
    const group = goldenBullet.model;
    group.rotation.y += dt * 1.6;
    group.position.y = 1.05 + Math.sin(elapsed * 3) * 0.12;
    const pulse = 0.5 + 0.5 * Math.sin(elapsed * Math.PI * 2 / 1.2);
    const halo = group.getObjectByName("golden-halo"), seal = group.getObjectByName("golden-seal");
    halo.material.opacity = 0.6 + pulse * 0.4;
    halo.scale.setScalar(1 + pulse * 0.13);
    seal.scale.setScalar(1 + pulse * 0.09);
    if (Math.hypot(player.x - goldenBullet.x, player.z - goldenBullet.z) >= 1.7 || !lineOfSight(player.x, player.z, goldenBullet.x, goldenBullet.z)) return;
    goldenBullet.status = "loaded";
    missionReminder.nextAt = elapsed + 14;
    player.health = Math.min(100, player.health + 20);
    player.invulnerable = Math.max(player.invulnerable, 1.2);
    explosionAt(group.position.clone(), 0.72, 0x76ff03, true);
    clearGoldenBullet();
    scoutMap.reset();
    audio.tone(660, 0.4, 0.12, "triangle", 660);
    showDanger("GOLDEN BULLET FOUND", 2.3);
    showCaption("+20 health. Weaken Bertranda, then fire: your golden finishing shot is automatic.", 4);
    updateHud();
  }

  function syncMapVisibility() {
    ui.mapWrap.hidden = false;
    ui.mapDetails.hidden = !mapOpen;
    ui.mapWrap.classList.toggle("expanded", mapOpen);
    ui.mapToggle.setAttribute("aria-expanded", String(mapOpen));
  }

  function toggleMap() {
    if (!canPlay()) return;
    mapOpen = !mapOpen;
    syncMapVisibility();
    scoutMap.nextDraw = 0;
    updateExpeditionHud();
  }

  function updateExpeditionHud() {
    const seeking = goldenBullet.status === "seeking", target = seeking ? goldenBullet : boss;
    scoutMap.update(world, player, target, boss, enemies, elapsed, mapOpen, seeking);
    const waypoint = seeking ? BertrandaExpedition.routeWaypoint(world, scoutMap.route, player, target) : boss;
    const arrow = waypoint ? BertrandaExpedition.bearingArrow(player, waypoint, player.yaw) : "◇";
    const distance = (scoutMap.partial ? "~" : "") + Math.ceil(scoutMap.distance) + "m";
    ui.mapStatus.textContent = (seeking ? "GOLD" : "BERTRANDA") + " " + arrow + " " + distance;
    ui.goldGuide.hidden = !seeking || !waypoint || !canPlay() || dangerUntil > elapsed;
    if (seeking && waypoint) {
      const rotation = -BertrandaExpedition.bearingAngle(player, waypoint, player.yaw) * 180 / Math.PI;
      // Keep CSS interpolation on the short arc when crossing north/180°.
      guideRotation += ((rotation - guideRotation) % 360 + 540) % 360 - 180;
      ui.goldArrow.style.transform = "rotate(" + guideRotation + "deg)";
      ui.goldDistance.textContent = distance;
      ui.goldGuide.setAttribute("aria-label", "Golden bullet: " + arrow + " " + distance + ". Follow the arrow along the map route.");
    }
    ui.mapHint.textContent = seeking ? "Green route → green circle · collect bullet" : bossExposed() ? "Red circle · aim at Bertranda · FIRE" : "Red circle · weaken Bertranda";
    ui.mapWrap.classList.toggle("gold-loaded", !seeking);
    if (gameState !== "transitioning") {
      ui.objective.textContent = seeking ? (IS_TOUCH ? "1 · FIND GOLD" : "1 · FIND THE GOLDEN BULLET")
        : bossExposed() ? "3 · FIRE THE GOLDEN SHOT" : "2 · WEAKEN BERTRANDA";
    }
    ui.bossWrap.classList.toggle("sealed", bossExposed() && seeking);
    ui.bossWrap.classList.toggle("finish-ready", bossExposed() && goldenBullet.status === "loaded");
  }

  function spawnHealth(position) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0xcaff55, emissive: 0x54b72a, emissiveIntensity: 2.4, roughness: 0.36 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 7, 16), material);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), material);
    group.add(core);
    if (!IS_TOUCH && settings.quality !== "low") group.add(new THREE.PointLight(0x72ff63, 1.1, 5, 2));
    group.position.copy(position);
    group.position.y = 0.62;
    scene.add(group);
    pickups.push({ group, life: 14, phase: Math.random() * TAU });
  }

  function updatePickups(dt) {
    for (let i = pickups.length - 1; i >= 0; i -= 1) {
      const pickup = pickups[i];
      pickup.life -= dt;
      pickup.group.rotation.y += dt * 2.6;
      pickup.group.position.y = 0.62 + Math.sin(elapsed * 3 + pickup.phase) * 0.12;
      if (Math.hypot(player.x - pickup.group.position.x, player.z - pickup.group.position.z) < 1.05) {
        player.health = Math.min(100, player.health + 22);
        audio.tone(440, 0.22, 0.07, "sine", 420);
        showCaption("A clean breath. +22 health.", 1.8);
        scene.remove(pickup.group);
        disposeGroup(pickup.group);
        pickups.splice(i, 1);
      } else if (pickup.life <= 0) {
        scene.remove(pickup.group);
        disposeGroup(pickup.group);
        pickups.splice(i, 1);
      }
    }
  }

  function updateSpawning(dt) {
    wave = 1 + Math.floor(schemaElapsed / 24);
    spawnTimer -= dt;
    if (spawnTimer > 0) return;
    const config = difficultyConfig();
    const phaseBoost = 1 + (boss.phase - 1) * 0.25;
    spawnTimer = Math.max(0.42, config.interval / phaseBoost) * (0.78 + Math.random() * 0.48);
    spawnCreature();
    if (settings.difficulty === "nightmare" && boss.phase === 3 && Math.random() < 0.32) spawnCreature();
    if (wave > 1 && Math.floor(schemaElapsed) % 24 < 2) showDanger("SCHEMA " + schema + " · WAVE " + wave + " — MORE FACES", 1.5);
  }

  function animateWorld() {
    world.animate(elapsed);
    const beam = settings.quality === "low" ? 8.4 : settings.quality === "deep" ? 8 : 7.6;
    flashlight.intensity = player.torch ? beam : 0;
    flashlightHalo.intensity = player.torch && settings.quality !== "low" ? 0.92 : 0;
  }

  function updateHud() {
    updateMissionReminder();
    const info = stageInfo();
    const healthRatio = clamp(player.health / 100, 0, 1);
    const bossRatio = clamp(boss.hp / boss.maxHp, 0, 1);
    ui.healthFill.style.transform = "scaleX(" + healthRatio + ")";
    ui.healthText.textContent = String(Math.ceil(player.health));
    ui.bossFill.style.transform = "scaleX(" + bossRatio + ")";
    const bearing = Math.atan2(-(boss.x - player.x), -(boss.z - player.z)) - player.yaw;
    const direction = Math.atan2(Math.sin(bearing), Math.cos(bearing));
    const arrow = Math.abs(direction) < 0.5 ? "↑" : Math.abs(direction) > 2.5 ? "↓" : direction > 0 ? "←" : "→";
    ui.bossName.textContent = boss.alive ? (bossExposed() ? (goldenBullet.status === "seeking" ? "GOLD REQUIRED" : IS_TOUCH ? "GOLD READY" : "GOLDEN SHOT READY") : "BERTRANDA") + " · " + Math.round(Math.hypot(boss.x - player.x, boss.z - player.z)) + "m " + arrow : "BERTRANDA DOWN";
    const phaseText = boss.phase === 1 ? "THE MOTHER BELOW" : boss.phase === 2 ? "SHELL SPLIT OPEN" : "FACE LOST · BERSERK";
    ui.bossPhase.textContent = "SCHEMA " + schema + " · " + info.environment.short + " · " + info.cycle.name + " · " + phaseText;
    ui.ammo.textContent = String(weapon.ammo).padStart(2, "0");
    ui.weaponState.textContent = weapon.reload > 0 ? "RELOADING " + Math.ceil(weapon.reload * 10) / 10 + "s" : weapon.ammo <= 5 ? "LOW · PRESS R" : "AUTO · LIGHT " + (player.torch ? "ON" : "OFF") + " · E/F";
    const sector = cellFromWorld(player.x, player.z);
    ui.wave.textContent = info.environment.short + " · " + info.cycle.name + " · SECTOR " + Math.floor(sector.x / 16) + ":" + Math.floor(sector.z / 16) + " · " + kills + " KILLS";
    const activeStreak = elapsed - lastKillAt < 3.2 ? streak : 0;
    ui.streak.textContent = activeStreak > 1 ? activeStreak + "× DETONATION STREAK" : "MOVE · AIM · DETONATE";
    ui.prompt.textContent = weapon.reload > 0 ? "RELOADING SALT CELLS" : "";
    ui.prompt.classList.toggle("visible", weapon.reload > 0);
    ui.danger.classList.toggle("visible", dangerUntil > elapsed);
    ui.caption.classList.toggle("visible", captionUntil > elapsed);
    const aimLocked = weapon.reload <= 0 && (aimLockUntil > elapsed || (IS_TOUCH ? touchAssist.ready : Boolean(findAimAssistTarget())));
    ui.reticle.classList.toggle("locked", aimLocked);
    if (IS_TOUCH) {
      ui.touchAuto.textContent = settings.touchAuto ? "AUTO ON" : "AUTO OFF";
      ui.touchAuto.setAttribute("aria-pressed", String(settings.touchAuto));
      ui.touchAuto.classList.toggle("enabled", settings.touchAuto);
    }
    updateExpeditionHud();
  }

  function updateMissionReminder() {
    if (!canPlay() || !boss.alive || !["seeking", "loaded"].includes(goldenBullet.status) || elapsed < missionReminder.nextAt) return;
    // Leave room for damage, reload and progression messages. Active game time
    // drives reminders, so pausing or rotating a phone never queues a burst.
    if (captionUntil > elapsed || dangerUntil > elapsed || weapon.reload > 0) {
      missionReminder.nextAt = elapsed + 4;
      return;
    }
    let message;
    if (goldenBullet.status === "seeking") {
      message = !mapOpen
        ? "Only the GOLDEN BULLET can kill Bertranda. Follow the green arrow. Open MAP for the route."
        : missionReminder.index++ % 2 === 0
          ? "Only the GOLDEN BULLET can kill Bertranda. Follow the green arrow and route on the MAP."
          : "Find the glowing GREEN CIRCLE on the MAP. Walk over the GOLDEN BULLET to collect it.";
    } else {
      message = bossExposed()
        ? "Bertranda is vulnerable! Aim at her and FIRE the golden finishing shot."
        : "GOLDEN BULLET loaded. Find Bertranda's red circle on MAP, weaken her, then FIRE.";
    }
    showCaption(message, 5);
    missionReminder.nextAt = elapsed + 28;
  }

  function showCaption(text, seconds) {
    ui.caption.textContent = text;
    captionUntil = elapsed + (seconds || 3);
    ui.caption.classList.add("visible");
  }

  function showDanger(text, seconds) {
    ui.goldGuide.hidden = true;
    ui.danger.textContent = text;
    dangerUntil = elapsed + (seconds || 2);
    ui.danger.classList.add("visible");
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function clearSessionObjects() {
    clearGoldenBullet();
    enemies.forEach((enemy) => {
      scene.remove(enemy.model);
      disposeGroup(enemy.model);
    });
    enemies.length = 0;
    projectiles.forEach((projectile) => {
      scene.remove(projectile.mesh);
      disposeGroup(projectile.mesh);
    });
    projectiles.length = 0;
    pickups.forEach((pickup) => {
      scene.remove(pickup.group);
      disposeGroup(pickup.group);
    });
    pickups.length = 0;
    effects.forEach((effect) => {
      scene.remove(effect.object);
      if (effect.light) scene.remove(effect.light);
      if (effect.trail) {
        scene.remove(effect.trail);
        effect.trail.geometry.dispose();
        effect.trail.material.dispose();
      }
      if (effect.object.material) effect.object.material.dispose();
    });
    effects.length = 0;
  }

  function resetSession() {
    sessionId += 1;
    clearSessionObjects();
    elapsed = 0;
    touchAssist.inhibitUntil = 0.35;
    schemaElapsed = 0;
    schema = clamp(Number(settings.realm) || 1, 1, 5);
    wave = 1;
    kills = 0;
    streak = 0;
    lastKillAt = -20;
    hudTimer = 0;
    aimLockUntil = 0;
    if (IS_TOUCH) mapOpen = true;
    spawnTimer = 1.25;
    captionUntil = 0;
    dangerUntil = 0;
    screenShake = 0;
    setPlayerSpawn();
    weapon.ammo = weapon.magazine;
    weapon.reload = 0;
    weapon.cooldown = 0;
    weapon.recoil = 0;
    controls.fire = false;
    ui.reticle.classList.remove("reloading", "hit", "locked");
    ui.touchTorch.classList.add("pressed");
    ui.touchTorch.textContent = IS_TOUCH ? "☼" : "LIGHT ON";
    ui.touchTorch.setAttribute("aria-label", "Turn light off");
    ui.touchTorch.setAttribute("aria-pressed", "true");
    applySchemaLook();
    configureBossForSchema();
    placeGoldenBullet();
    spawnOpeningSwarm();
    updateHud();
    audio.resetMusic();
  }

  function startGame() {
    resetInputs();
    requestLandscape();
    audio.start();
    ui.title.classList.remove("is-visible");
    ui.title.hidden = true;
    ui.pause.hidden = true;
    ui.pause.classList.remove("is-visible");
    ui.death.hidden = true;
    ui.death.classList.remove("is-visible");
    ui.hud.hidden = false;
    ui.touch.hidden = !IS_TOUCH;
    gameState = "playing";
    resetSession();
    updateOrientation();
    needsRender = true;
    showDanger("DESCENT " + schema + " · " + stageInfo().environment.short, 2.7);
    showCaption(IS_TOUCH ? "Left thumb: move. Drag right: look. Hold FIRE: shoot; release: stop. Find GOLD on the map." : "M opens your map. Find the golden bullet, weaken Bertranda, then fire to enter the next realm.", 5.2);
    if (!IS_TOUCH) requestPointer();
  }

  function pauseGame() {
    if (gameState !== "playing") return;
    gameState = "paused";
    resetInputs();
    needsRender = true;
    ui.pause.hidden = false;
    ui.pause.classList.add("is-visible");
    ui.touch.hidden = true;
    updateOrientation();
    if (document.pointerLockElement) document.exitPointerLock();
  }

  function resumeGame() {
    if (gameState !== "paused") return;
    resetInputs();
    requestLandscape();
    ui.pause.classList.remove("is-visible");
    ui.pause.hidden = true;
    ui.touch.hidden = !IS_TOUCH;
    gameState = "playing";
    updateOrientation();
    needsRender = true;
    if (audio.context && audio.context.state === "suspended") audio.context.resume();
    audio.resetMusic();
    if (!IS_TOUCH) requestPointer();
  }

  function requestPointer() {
    if (ui.host.requestPointerLock) {
      const result = ui.host.requestPointerLock();
      if (result && result.catch) result.catch(() => {});
    }
  }

  function restartGame() {
    startGame();
  }

  function resetInputs() {
    controls.keys.clear();
    controls.fire = false;
    controls.fireTouch = false;
    controls.aimTouch = false;
    controls.runTouch = false;
    touchAssist.target = null;
    touchAssist.ready = false;
    touchAssist.acquired = 0;
    touchAssist.scanTimer = 0;
    touchAssist.inhibitUntil = elapsed + 0.35;
    ui.aimTarget.hidden = true;
    controls.moveX = controls.moveY = controls.lookDX = controls.lookDY = 0;
    touchResetters.forEach((reset) => reset());
    ui.moveKnob.style.transform = "";
    ui.touchFire.classList.remove("pressed");
    ui.touchRun.classList.remove("pressed");
  }

  function updateOrientation() {
    const active = gameState === "playing" || gameState === "transitioning";
    if (IS_TOUCH && active) {
      // The title can scroll; the play surface cannot. Clear any focus/scroll
      // offset left by opening the menu or rotating in older mobile browsers.
      ui.game.scrollTop = 0;
      ui.game.scrollLeft = 0;
    }
    const viewport = playViewport();
    const blocked = IS_TOUCH && viewport.height > viewport.width && active;
    if (blocked !== orientationBlocked) {
      resetInputs();
      needsRender = true;
    }
    orientationBlocked = blocked;
    ui.rotate.hidden = !blocked;
    ui.touch.hidden = !IS_TOUCH || gameState !== "playing" || blocked;
  }

  async function requestLandscape() {
    if (!IS_TOUCH) return;
    // Run directly from Start/Resume's gesture. Unsupported iOS browsers use
    // the rotate hint; rejected fullscreen/lock promises never pause the game.
    try {
      if (!document.fullscreenElement && document.fullscreenEnabled && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (_) { /* Fullscreen is optional. */ }
    try {
      if (screen.orientation && screen.orientation.lock) await screen.orientation.lock("landscape");
    } catch (_) { /* Physical rotation remains available. */ }
    onResize();
    updateOrientation();
  }

  function canPlay() {
    return gameState === "playing" && !orientationBlocked && !document.hidden;
  }

  function bindKeyboardAndMouse() {
    window.addEventListener("keydown", (event) => {
      const typedKey = typeof event.key === "string" ? event.key.toLowerCase() : "";
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyR", "KeyE", "KeyF", "KeyM"].includes(event.code) && gameState === "playing") event.preventDefault();
      controls.keys.add(event.code);
      if (event.code === "Space" && gameState === "playing") controls.fire = true;
      if ((event.code === "KeyR" || typedKey === "r") && !event.repeat) startReload(true);
      if ((event.code === "KeyE" || event.code === "KeyF" || typedKey === "e" || typedKey === "f") && !event.repeat) toggleTorch();
      if ((event.code === "KeyM" || typedKey === "m") && !event.repeat) toggleMap();
      if (event.code === "KeyP" && !event.repeat) {
        if (gameState === "playing") pauseGame();
        else if (gameState === "paused") resumeGame();
      }
    });
    window.addEventListener("keyup", (event) => {
      controls.keys.delete(event.code);
      if (event.code === "Space") controls.fire = false;
    });
    window.addEventListener("blur", () => {
      // Mobile browser chrome, rotation and fullscreen all cause harmless blur.
      // Clear held inputs, but only the explicit pause control opens the menu.
      resetInputs();
    });
    document.addEventListener("visibilitychange", () => {
      resetInputs();
      if (clock) clock.getDelta();
      performanceState.seconds = performanceState.frames = 0;
      needsRender = true;
      if (!document.hidden) {
        audio.resetMusic();
        if (audio.context && audio.context.state === "suspended") audio.context.resume().catch(() => {});
        updateOrientation();
        if (IS_TOUCH) onResize();
      } else if (audio.context && audio.context.state === "running") {
        audio.context.suspend().catch(() => {});
      }
    });
    document.addEventListener("mousemove", (event) => {
      if (gameState === "playing" && document.pointerLockElement === ui.host) {
        controls.lookDX += event.movementX;
        controls.lookDY += event.movementY;
      }
    });
    ui.host.addEventListener("mousedown", (event) => {
      if (IS_TOUCH || event.button !== 0 || !canPlay()) return;
      if (!IS_TOUCH && document.pointerLockElement !== ui.host) requestPointer();
      controls.fire = true;
    });
    window.addEventListener("mouseup", (event) => {
      if (event.button === 0) controls.fire = false;
    });
    ui.host.addEventListener("contextmenu", (event) => event.preventDefault());
    document.addEventListener("pointerlockchange", () => {
      const locked = document.pointerLockElement === ui.host;
      if (!IS_TOUCH && pointerWasLocked && !locked && gameState === "playing" && !document.hidden) pauseGame();
      pointerWasLocked = locked;
    });
  }

  function bindTouchControls() {
    // Window listeners also finish gestures that leave a control or whose
    // capture is unavailable during a browser/fullscreen transition.
    const capture = (element, pointerId) => {
      try { element.setPointerCapture(pointerId); } catch (_) { /* Window fallback. */ }
    };
    let movePointer = null;
    const updateMove = (event) => {
      const rect = ui.movePad.getBoundingClientRect();
      let x = event.clientX - (rect.left + rect.width / 2);
      let y = event.clientY - (rect.top + rect.height / 2);
      const limit = rect.width * 0.34;
      const length = Math.hypot(x, y);
      if (length > limit) {
        x = x / length * limit;
        y = y / length * limit;
      }
      controls.moveX = x / limit;
      controls.moveY = -y / limit;
      controls.runTouch = Math.hypot(controls.moveX, controls.moveY) > 0.9;
      ui.moveKnob.style.transform = "translate(" + x + "px," + y + "px)";
    };
    ui.movePad.addEventListener("pointerdown", (event) => {
      if (!canPlay() || movePointer !== null) return;
      event.preventDefault();
      movePointer = event.pointerId;
      capture(ui.movePad, event.pointerId);
      updateMove(event);
    });
    window.addEventListener("pointermove", (event) => {
      if (event.pointerId !== movePointer) return;
      event.preventDefault();
      updateMove(event);
    });
    const endMove = (event) => {
      if (event.pointerId !== movePointer) return;
      movePointer = null;
      controls.moveX = 0;
      controls.moveY = 0;
      controls.runTouch = false;
      ui.moveKnob.style.transform = "";
    };
    window.addEventListener("pointerup", endMove);
    window.addEventListener("pointercancel", endMove);
    ui.movePad.addEventListener("lostpointercapture", endMove);
    touchResetters.push(() => { movePointer = null; });

    const aimingSurfaces = new Set();
    const bindAimSurface = (element, shoots) => {
      let pointer = null, x = 0, y = 0;
      element.addEventListener("pointerdown", event => {
        if (!canPlay() || pointer !== null) return;
        event.preventDefault();
        pointer = event.pointerId; x = event.clientX || 0; y = event.clientY || 0;
        capture(element, pointer);
        aimingSurfaces.add(element); controls.aimTouch = true;
        if (shoots) {
          controls.fireTouch = true; controls.fire = true;
          element.classList.add("pressed");
        }
      });
      window.addEventListener("pointermove", event => {
        if (pointer !== event.pointerId) return;
        event.preventDefault();
        // Preserve quick swipes rather than truncating them to 100 pixels.
        controls.lookDX += clamp(event.clientX - x, -renderSize.width, renderSize.width);
        controls.lookDY += clamp(event.clientY - y, -renderSize.height, renderSize.height);
        x = event.clientX; y = event.clientY;
      });
      const end = event => {
        if (pointer !== event.pointerId) return;
        pointer = null;
        aimingSurfaces.delete(element); controls.aimTouch = aimingSurfaces.size > 0;
        if (shoots) { controls.fireTouch = false; controls.fire = false; element.classList.remove("pressed"); }
      };
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      element.addEventListener("lostpointercapture", end);
      touchResetters.push(() => { pointer = null; aimingSurfaces.delete(element); });
    };
    bindAimSurface(ui.lookPad, false);
    bindAimSurface(ui.touchFire, true);

    const holdButton = (button, start, stop) => {
      let pointer = null;
      button.addEventListener("pointerdown", (event) => {
        if (!canPlay() || pointer !== null) return;
        event.preventDefault();
        pointer = event.pointerId;
        capture(button, event.pointerId);
        button.classList.add("pressed");
        start();
      });
      const end = (event) => {
        if (event.pointerId !== pointer) return;
        pointer = null;
        button.classList.remove("pressed");
        stop();
      };
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      button.addEventListener("lostpointercapture", end);
      touchResetters.push(() => { pointer = null; });
    };
    holdButton(ui.touchRun, () => {
      controls.runTouch = true;
    }, () => {
      controls.runTouch = false;
    });
    ui.touchReload.addEventListener("click", () => startReload(true));
    ui.touchTorch.addEventListener("click", toggleTorch);
    ui.touchAuto.addEventListener("click", toggleTouchAuto);
  }

  function applyQuality() {
    if (!renderer) return;
    updateRenderSize();
    const cycleIndex = stageInfo().cycleIndex;
    renderer.toneMappingExposure = (settings.quality === "low" ? 1.46 : settings.quality === "deep" ? 1.55 : 1.62) + cycleIndex * 0.035 + (IS_TOUCH ? 0.12 : 0);
    document.body.dataset.quality = settings.quality;
    if (!scene) return;
    scene.fog.density = (settings.quality === "low" ? 0.012 : settings.quality === "deep" ? 0.0155 : 0.018) + cycleIndex * 0.0008;
    if (flashlightHalo) flashlightHalo.visible = !IS_TOUCH && settings.quality !== "low";
    if (weapon.muzzleLight) weapon.muzzleLight.visible = !IS_TOUCH && settings.quality !== "low";
    needsRender = true;
  }

  function playViewport() {
    return {
      width: IS_TOUCH ? (ui.host.clientWidth || innerWidth) : innerWidth,
      height: IS_TOUCH ? (ui.host.clientHeight || innerHeight) : innerHeight
    };
  }

  function updateRenderSize() {
    if (!renderer) return;
    const { width, height } = playViewport();
    let cap = settings.quality === "low" ? (IS_TOUCH ? 0.72 : 0.86) : settings.quality === "high" ? (IS_TOUCH ? 1.15 : 1.75) : (IS_TOUCH ? 1 : 1.25);
    if (IS_TOUCH) cap = Math.min(cap, Math.sqrt(650000 / (width * height))) * performanceState.scale;
    const ratio = Math.min(devicePixelRatio || 1, cap);
    if (renderSize.width === width && renderSize.height === height && renderSize.ratio === ratio) return;
    renderSize.width = width;
    renderSize.height = height;
    if (renderSize.ratio !== ratio) renderer.setPixelRatio(ratio);
    renderSize.ratio = ratio;
    renderer.setSize(width, height, false);
    if (camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    needsRender = true;
  }

  function updatePerformance(dt) {
    if (!IS_TOUCH || dt <= 0 || dt > 0.2) return;
    performanceState.seconds += dt;
    performanceState.frames += 1;
    if (performanceState.seconds < 3) return;
    const fps = performanceState.frames / performanceState.seconds;
    const oldScale = performanceState.scale;
    if (fps < 38) {
      performanceState.scale = Math.max(0.6, oldScale - 0.1);
      performanceState.goodWindows = 0;
    } else if (fps > 56) {
      performanceState.goodWindows += 1;
      if (performanceState.goodWindows >= 3) {
        performanceState.scale = Math.min(1, oldScale + 0.05);
        performanceState.goodWindows = 0;
      }
    } else {
      performanceState.goodWindows = 0;
    }
    performanceState.seconds = performanceState.frames = 0;
    if (oldScale !== performanceState.scale) updateRenderSize();
  }

  function onResize() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      updateRenderSize();
      updateOrientation();
    });
  }

  function init() {
    if (!window.THREE || !window.BertrandaWorld || !window.BertrandaExpedition) {
      ui.loading.innerHTML = "<strong>THE REALMS FAILED TO OPEN</strong><small>Reload to finish loading the game.</small>";
      return;
    }
    document.body.dataset.touch = String(IS_TOUCH);
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    // Mobile canvas CSS must remain fluid after rotating. Three's default
    // setSize writes inline portrait pixels which override the 100% stylesheet.
    renderer.setSize(innerWidth, innerHeight, !IS_TOUCH);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.55;
    applyQuality();
    ui.host.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071017);
    scene.fog = new THREE.FogExp2(0x071017, 0.0155);
    camera = new THREE.PerspectiveCamera(73, renderSize.width / renderSize.height, 0.06, 95);
    camera.rotation.order = "YXZ";
    scene.add(camera);
    clock = new THREE.Clock();
    scoutMap = new BertrandaExpedition.ScoutMap(ui.mapCanvas);

    hemisphereLight = new THREE.HemisphereLight(0x9cfff4, 0x31072e, 0.84);
    scene.add(hemisphereLight);
    ambientLight = new THREE.AmbientLight(0x81aeb0, 0.34);
    scene.add(ambientLight);
    moonLight = new THREE.DirectionalLight(0xff69c7, 0.46);
    moonLight.position.set(-20, 18, -12);
    scene.add(moonLight);

    buildWorld();
    buildWeapon();
    flashlight = new THREE.SpotLight(0xd6fff8, 8, 56, Math.PI / 4.65, 0.46, 1.1);
    flashlight.position.set(0.12, -0.06, 0.05);
    flashlight.target.position.set(0, -0.03, -3);
    camera.add(flashlight, flashlight.target);
    flashlightHalo = new THREE.PointLight(0xcaff55, 0.92, 9, 2);
    flashlightHalo.position.set(0, 0, -0.25);
    camera.add(flashlightHalo);

    faceTextures.bertranda = loadFaceTexture("assets/bertranda-face-v2.png");
    faceTextures.roach = loadFaceTexture("../bertranda/assets/roach-face-v2.png");
    faceTextures.bat = loadFaceTexture("../bertranda/assets/bat-face-v2.png");
    faceTextures.snake = loadFaceTexture("../bertranda/assets/snake-face-v2.png");
    faceTextures.tiers = [
      faceTextures.bertranda,
      loadFaceTexture("assets/bertranda-face-tier2.png"),
      loadFaceTexture("assets/bertranda-face-tier3.png"),
      loadFaceTexture("assets/bertranda-face-tier4.png"),
      loadFaceTexture("assets/bertranda-face-tier5.png")
    ];
    buildBoss();
    applyQuality();
    setPlayerSpawn();
    bindKeyboardAndMouse();
    bindTouchControls();
    window.addEventListener("resize", onResize);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", onResize);
    if (screen.orientation && screen.orientation.addEventListener) screen.orientation.addEventListener("change", onResize);
    document.addEventListener("fullscreenchange", onResize);
    if (IS_TOUCH && window.ResizeObserver) new ResizeObserver(onResize).observe(ui.host);
    updateOrientation();

    ui.start.disabled = false;
    ui.loading.classList.add("is-done");
    setTimeout(() => {
      ui.loading.hidden = true;
    }, 560);
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    const frameDt = clock.getDelta();
    if (document.hidden || orientationBlocked) return;
    const active = gameState === "playing" || gameState === "transitioning" || gameState === "dying";
    if (!active && !needsRender) return;
    if (gameState === "playing") updatePerformance(frameDt);
    // At 20–30 FPS, advance real game time without tunnelling through walls.
    // Long OS stalls are discarded instead of replaying seconds of attacks.
    let remaining = Math.min(0.1, frameDt);
    while (remaining > 0) {
      const dt = Math.min(1 / 30, remaining);
      remaining -= dt;
      if (gameState === "playing") {
        elapsed += dt;
        schemaElapsed += dt;
        audio.updateMusic();
        updatePlayer(dt);
        refreshNearbyCells();
        updateWeapon(dt);
        updateSpawning(dt);
        updateBoss(dt);
        updateEnemies(dt);
        updateProjectiles(dt);
        updatePickups(dt);
        updateGoldenBullet(dt);
        updateEffects(dt);
        hudTimer -= dt;
        if (hudTimer <= 0) {
          hudTimer = 0.08;
          updateHud();
        }
      } else if (gameState === "transitioning" || gameState === "dying") {
        elapsed += dt;
        updateEffects(dt);
        if (gameState === "transitioning") audio.updateMusic();
      }
    }
    if (gameState === "playing") world.update(player.x, player.z);
    animateWorld();
    world.cull(camera);
    renderer.render(scene, camera);
    needsRender = false;
  }

  ui.start.addEventListener("click", startGame);
  ui.pauseButton.addEventListener("click", pauseGame);
  ui.resume.addEventListener("click", resumeGame);
  ui.restart.addEventListener("click", restartGame);
  ui.retry.addEventListener("click", restartGame);
  ui.mapToggle.addEventListener("click", toggleMap);

  init();
})();
