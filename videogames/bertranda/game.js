(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, amount) => a + (b - a) * amount;
  const TAU = Math.PI * 2;
  const IS_TOUCH = matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

  const ui = {
    host: $("#render-host"),
    loading: $("#loading"),
    title: $("#title-screen"),
    start: $("#start-button"),
    mute: $("#mute-button"),
    hud: $("#hud"),
    objective: $("#objective-text"),
    wave: $("#wave-text"),
    bossWrap: $("#boss-wrap"),
    bossFill: $("#boss-fill"),
    bossPhase: $("#boss-phase"),
    danger: $("#danger"),
    reticle: $("#reticle"),
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
    touch: $("#touch-controls"),
    movePad: $("#move-pad"),
    moveKnob: $("#move-knob"),
    lookPad: $("#look-pad"),
    touchFire: $("#touch-fire"),
    touchRun: $("#touch-run"),
    touchReload: $("#touch-reload"),
    touchTorch: $("#touch-torch"),
    pause: $("#pause-screen"),
    resume: $("#resume-button"),
    restart: $("#restart-button"),
    death: $("#death-screen"),
    retry: $("#retry-button"),
    win: $("#win-screen"),
    again: $("#again-button"),
    finalTime: $("#final-time"),
    finalKills: $("#final-kills"),
    scare: $("#jumpscare")
  };

  const settings = {
    difficulty: "normal",
    quality: "auto",
    muted: false
  };

  let renderer;
  let scene;
  let camera;
  let clock;
  let wallMesh;
  let flashlight;
  let flashlightHalo;
  let gameState = "title";
  let elapsed = 0;
  let sessionId = 0;
  let captionUntil = 0;
  let dangerUntil = 0;
  let screenShake = 0;
  let pointerWasLocked = false;
  let spawnTimer = 0;
  let wave = 1;
  let kills = 0;
  let streak = 0;
  let lastKillAt = -20;

  const flickerLights = [];
  const propColliders = [];
  const shotBlockers = [];
  const rifts = [];
  const enemies = [];
  const effects = [];
  const projectiles = [];
  const pickups = [];
  const faceTextures = {};
  const raycaster = new THREE.Raycaster();
  const aimPoint = new THREE.Vector2(0, 0);
  const fragmentGeometry = new THREE.TetrahedronGeometry(0.12, 0);
  const sparkGeometry = new THREE.SphereGeometry(0.055, 5, 4);

  const controls = {
    keys: new Set(),
    moveX: 0,
    moveY: 0,
    lookDX: 0,
    lookDY: 0,
    fire: false,
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
    parts: []
  };

  document.querySelectorAll(".segmented").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-value]");
      if (!button) return;
      group.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item === button));
      settings[group.dataset.setting] = button.dataset.value;
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
    melody: [69, 72, 76, 74, 72, 76, 81, 76, 69, 74, 77, 76, 74, 77, 83, 77, 67, 71, 74, 72, 71, 74, 79, 74, 65, 69, 72, 71, 69, 73, 76, 73],
    bass: [45, 52, 48, 52, 43, 50, 47, 50, 41, 48, 45, 48, 40, 47, 44, 47],
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

      const drone = this.context.createOscillator();
      const droneTwo = this.context.createOscillator();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      drone.type = "sawtooth";
      drone.frequency.value = 41;
      droneTwo.type = "sine";
      droneTwo.frequency.value = 61.5;
      filter.type = "lowpass";
      filter.frequency.value = 130;
      gain.gain.value = 0.018;
      drone.connect(filter);
      droneTwo.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      drone.start();
      droneTwo.start();
      this.started = true;
      this.resetMusic();
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
    musicNote(note, time, duration, volume) {
      if (!this.context || !this.master) return;
      const osc = this.context.createOscillator();
      const upper = this.context.createOscillator();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      osc.type = "sawtooth";
      upper.type = "square";
      osc.frequency.setValueAtTime(this.frequency(note), time);
      upper.frequency.setValueAtTime(this.frequency(note + 12), time);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, time);
      filter.frequency.exponentialRampToValueAtTime(520, time + duration);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(volume, time + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      osc.connect(filter);
      upper.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      osc.start(time);
      upper.start(time);
      osc.stop(time + duration + 0.02);
      upper.stop(time + duration + 0.02);
    },
    updateMusic() {
      if (!this.context || gameState !== "playing") return;
      if (this.musicNext < this.context.currentTime - 0.5) this.musicNext = this.context.currentTime;
      const stepDuration = 60 / 132 / 2;
      while (this.musicNext < this.context.currentTime + 0.16) {
        const step = this.musicStep;
        this.musicNote(this.melody[step % this.melody.length], this.musicNext, stepDuration * 0.72, 0.021);
        if (step % 2 === 0) {
          const bassNote = this.bass[Math.floor(step / 2) % this.bass.length];
          this.musicNote(bassNote, this.musicNext, stepDuration * 1.45, 0.014);
        }
        if (step % 4 === 3) this.musicNote(this.melody[(step + 7) % this.melody.length] - 12, this.musicNext, stepDuration * 0.58, 0.009);
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
  const MAP_W = 25;
  const MAP_H = 19;
  const ORIGIN_X = -(MAP_W * CELL) / 2;
  const ORIGIN_Z = -(MAP_H * CELL) / 2;
  const grid = Array.from({ length: MAP_H }, (_, z) =>
    Array.from({ length: MAP_W }, (_, x) => (x === 0 || z === 0 || x === MAP_W - 1 || z === MAP_H - 1 ? 1 : 0))
  );

  const wallV = (x, z1, z2, openings) => {
    const gaps = openings || [];
    for (let z = z1; z <= z2; z += 1) if (!gaps.includes(z)) grid[z][x] = 1;
  };
  const wallH = (z, x1, x2, openings) => {
    const gaps = openings || [];
    for (let x = x1; x <= x2; x += 1) if (!gaps.includes(x)) grid[z][x] = 1;
  };
  wallV(8, 1, 7, [3, 6]);
  wallV(16, 1, 7, [4, 6]);
  wallH(8, 1, 23, [4, 7, 12, 16, 20]);
  wallV(10, 9, 17, [11, 13, 16]);
  wallV(18, 9, 17, [12, 14, 16]);
  wallH(13, 1, 9, [4, 7]);
  wallH(14, 11, 23, [14, 17, 21]);

  const worldFromCell = (cx, cz) => ({
    x: ORIGIN_X + (cx + 0.5) * CELL,
    z: ORIGIN_Z + (cz + 0.5) * CELL
  });

  const cellFromWorld = (x, z) => ({
    x: Math.floor((x - ORIGIN_X) / CELL),
    z: Math.floor((z - ORIGIN_Z) / CELL)
  });

  const isWalkableCell = (x, z) => x > 0 && z > 0 && x < MAP_W - 1 && z < MAP_H - 1 && grid[z][x] === 0;
  const floorCells = [];
  for (let z = 1; z < MAP_H - 1; z += 1) {
    for (let x = 1; x < MAP_W - 1; x += 1) {
      if (isWalkableCell(x, z)) floorCells.push({ x, z });
    }
  }

  function makeTexture(kind) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (kind === "wall") {
      context.fillStyle = "#4d4b31";
      context.fillRect(0, 0, 256, 256);
      context.fillStyle = "rgba(225,218,166,.08)";
      for (let y = 0; y < 256; y += 18) context.fillRect(0, y, 256, 2);
      for (let i = 0; i < 1700; i += 1) {
        const shade = 35 + Math.random() * 45;
        context.fillStyle = "rgba(" + (shade + 25) + "," + (shade + 22) + "," + shade + "," + Math.random() * 0.17 + ")";
        context.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 8 + 1, Math.random() * 15 + 2);
      }
      context.fillStyle = "rgba(37,63,25,.2)";
      for (let i = 0; i < 16; i += 1) context.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 58, Math.random() * 43);
    } else if (kind === "floor") {
      context.fillStyle = "#2b291b";
      context.fillRect(0, 0, 256, 256);
      context.strokeStyle = "#625b38";
      context.lineWidth = 3;
      for (let y = 0; y <= 256; y += 32) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(256, y + (Math.random() - 0.5) * 3);
        context.stroke();
      }
      for (let i = 0; i < 600; i += 1) {
        const value = 30 + Math.random() * 42;
        context.fillStyle = "rgba(" + (value + 14) + "," + (value + 10) + "," + value + "," + Math.random() * 0.22 + ")";
        context.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 12 + 2, Math.random() * 2 + 1);
      }
    } else {
      context.fillStyle = "#2b3023";
      context.fillRect(0, 0, 256, 256);
      context.strokeStyle = "rgba(190,181,130,.18)";
      for (let x = 0; x < 256; x += 24) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + 18, 256);
        context.stroke();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    return texture;
  }

  function addBox(x, y, z, width, height, depth, material, parent) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z);
    (parent || scene).add(mesh);
    return mesh;
  }

  function addCollider(x, z, width, depth) {
    propColliders.push({ x1: x - width / 2, x2: x + width / 2, z1: z - depth / 2, z2: z + depth / 2 });
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

  function buildHouse() {
    const wallTexture = makeTexture("wall");
    wallTexture.repeat.set(1.35, 1.35);
    const floorTexture = makeTexture("floor");
    floorTexture.repeat.set(MAP_W * 0.7, MAP_H * 0.7);
    const ceilingTexture = makeTexture("ceiling");
    ceilingTexture.repeat.set(8, 6);

    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture, color: 0xd0c58e, roughness: 0.94, metalness: 0.01 });
    const wallCells = [];
    for (let z = 0; z < MAP_H; z += 1) {
      for (let x = 0; x < MAP_W; x += 1) if (grid[z][x] === 1) wallCells.push({ x, z });
    }
    const geometry = new THREE.BoxGeometry(CELL, 4.5, CELL);
    wallMesh = new THREE.InstancedMesh(geometry, wallMaterial, wallCells.length);
    const dummy = new THREE.Object3D();
    const tint = new THREE.Color();
    wallCells.forEach((cell, index) => {
      const world = worldFromCell(cell.x, cell.z);
      dummy.position.set(world.x, 2.25, world.z);
      dummy.updateMatrix();
      wallMesh.setMatrixAt(index, dummy.matrix);
      const shade = 0.82 + ((cell.x * 13 + cell.z * 11) % 12) / 68;
      tint.setRGB(shade, shade * 0.97, shade * 0.76);
      wallMesh.setColorAt(index, tint);
    });
    scene.add(wallMesh);
    shotBlockers.push(wallMesh);

    const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, color: 0x8a805a, roughness: 1 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(MAP_W * CELL, MAP_H * CELL), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture, color: 0x77755a, side: THREE.DoubleSide, roughness: 1 });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(MAP_W * CELL, MAP_H * CELL), ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4.48;
    scene.add(ceiling);

    const darkWood = new THREE.MeshStandardMaterial({ color: 0x3a2417, roughness: 0.86 });
    const oldWood = new THREE.MeshStandardMaterial({ color: 0x6c4929, roughness: 0.92 });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x512824, roughness: 1 });
    const metal = new THREE.MeshStandardMaterial({ color: 0x80774c, roughness: 0.45, metalness: 0.56 });

    const addTable = (cx, cz, rotation) => {
      const world = worldFromCell(cx, cz);
      const group = new THREE.Group();
      group.position.set(world.x, 0, world.z);
      group.rotation.y = rotation || 0;
      addBox(0, 1.04, 0, 2.55, 0.18, 1.42, oldWood, group);
      [[-1.02, -0.5], [1.02, -0.5], [-1.02, 0.5], [1.02, 0.5]].forEach((pair) => addBox(pair[0], 0.52, pair[1], 0.16, 1.04, 0.16, darkWood, group));
      scene.add(group);
      const turn = Math.abs(Math.sin(rotation || 0)) > 0.5;
      addCollider(world.x, world.z, turn ? 1.55 : 2.7, turn ? 2.7 : 1.55);
    };
    addTable(5, 4, 0);
    addTable(13, 3, Math.PI / 2);
    addTable(14, 10, 0);
    addTable(21, 16, 0);

    const addBed = (cx, cz, rotation) => {
      const world = worldFromCell(cx, cz);
      const group = new THREE.Group();
      group.position.set(world.x, 0, world.z);
      group.rotation.y = rotation || 0;
      addBox(0, 0.42, 0, 3.15, 0.55, 1.65, oldWood, group);
      addBox(0, 0.78, 0, 2.96, 0.28, 1.48, cloth, group);
      addBox(-1.46, 1.2, 0, 0.2, 2, 1.83, darkWood, group);
      scene.add(group);
      const turn = Math.abs(Math.sin(rotation || 0)) > 0.5;
      addCollider(world.x, world.z, turn ? 1.8 : 3.3, turn ? 3.3 : 1.8);
    };
    addBed(2, 6, 0);
    addBed(11, 6, Math.PI / 2);
    addBed(21, 5, 0);
    addBed(7, 16, Math.PI / 2);

    const addCabinet = (cx, cz, rotation) => {
      const world = worldFromCell(cx, cz);
      const group = new THREE.Group();
      group.position.set(world.x, 0, world.z);
      group.rotation.y = rotation || 0;
      addBox(0, 1.55, 0, 2.4, 3.1, 0.72, darkWood, group);
      for (let y = 0.44; y < 2.9; y += 0.6) addBox(0, y, 0.4, 2.5, 0.09, 0.82, oldWood, group);
      scene.add(group);
      const turn = Math.abs(Math.sin(rotation || 0)) > 0.5;
      addCollider(world.x, world.z, turn ? 0.9 : 2.6, turn ? 2.6 : 0.9);
    };
    addCabinet(6, 1, 0);
    addCabinet(17, 6, Math.PI / 2);
    addCabinet(23, 11, Math.PI / 2);
    addCabinet(11, 16, Math.PI / 2);

    const rugMaterial = new THREE.MeshBasicMaterial({ color: 0x5a1b17, side: THREE.DoubleSide });
    [[4, 3, 0], [12, 4, Math.PI / 2], [20, 3, 0], [6, 10, 0], [14, 16, Math.PI / 2]].forEach((def) => {
      const world = worldFromCell(def[0], def[1]);
      const rug = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 2.4), rugMaterial);
      rug.rotation.x = -Math.PI / 2;
      rug.rotation.z = def[2];
      rug.position.set(world.x, 0.012, world.z);
      scene.add(rug);
    });

    const lampCells = [[4, 4], [12, 4], [20, 4], [4, 10], [14, 10], [21, 11], [5, 16], [14, 16], [21, 16]];
    lampCells.forEach((cell, index) => {
      const world = worldFromCell(cell[0], cell[1]);
      const fixture = new THREE.Group();
      fixture.position.set(world.x, 4.05, world.z);
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 5), metal);
      cord.position.y = 0.18;
      fixture.add(cord);
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.34, 9, 1, true), metal);
      shade.position.y = -0.12;
      fixture.add(shade);
      scene.add(fixture);
      const colour = index % 4 === 0 ? 0xcce38a : 0xffd178;
      const light = new THREE.PointLight(colour, 1.42, 23, 1.8);
      light.position.set(world.x, 3.63, world.z);
      scene.add(light);
      flickerLights.push({ light, base: light.intensity, phase: index * 2.13 });
    });

    const riftMaterial = new THREE.MeshStandardMaterial({ color: 0x3f160f, emissive: 0xc43b1f, emissiveIntensity: 1.8, roughness: 0.6 });
    [[2, 2], [22, 2], [3, 11], [22, 11], [3, 16], [20, 16]].forEach((cell, index) => {
      const world = worldFromCell(cell[0], cell[1]);
      const group = new THREE.Group();
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.08, 6, 19), riftMaterial);
      ring.rotation.x = -Math.PI / 2;
      group.add(ring);
      for (let i = 0; i < 5; i += 1) {
        const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.52, 5), riftMaterial);
        const angle = i / 5 * TAU;
        tooth.position.set(Math.cos(angle) * 0.7, 0.18, Math.sin(angle) * 0.7);
        tooth.rotation.z = Math.PI / 2;
        tooth.rotation.y = -angle;
        group.add(tooth);
      }
      const glow = new THREE.PointLight(0xff4a25, 0.5, 5, 2);
      glow.position.y = 0.35;
      group.add(glow);
      group.position.set(world.x, 0.035, world.z);
      scene.add(group);
      rifts.push({ group, ring, glow, phase: index * 1.6, x: world.x, z: world.z });
    });
  }

  function buildWeapon() {
    const root = new THREE.Group();
    const dark = new THREE.MeshStandardMaterial({ color: 0x171d16, roughness: 0.36, metalness: 0.76 });
    const brass = new THREE.MeshStandardMaterial({ color: 0x947d3e, roughness: 0.35, metalness: 0.82 });
    const ceramic = new THREE.MeshStandardMaterial({ color: 0xd4ca9d, roughness: 0.5, metalness: 0.1 });
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
    const vial = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.34, 9), new THREE.MeshStandardMaterial({ color: 0xc8eb8d, emissive: 0x6e9c36, emissiveIntensity: 1.5, transparent: true, opacity: 0.88 }));
    vial.position.set(0.22, -0.05, -0.12);
    root.add(vial);

    weapon.muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.15, 7, 5), new THREE.MeshBasicMaterial({ color: 0xffe28a, transparent: true, opacity: 0.92 }));
    weapon.muzzle.position.set(0, 0.06, -1.12);
    weapon.muzzle.visible = false;
    root.add(weapon.muzzle);
    weapon.muzzleLight = new THREE.PointLight(0xffb43b, 0, 5, 2);
    weapon.muzzleLight.position.copy(weapon.muzzle.position);
    root.add(weapon.muzzleLight);
    root.position.set(0.34, -0.34, -0.62);
    root.rotation.set(-0.04, -0.04, 0);
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
    const shell = new THREE.MeshStandardMaterial({ color: 0x28200f, roughness: 0.5, metalness: 0.24, flatShading: true });
    const shellLight = new THREE.MeshStandardMaterial({ color: 0x665b27, roughness: 0.58, metalness: 0.16, flatShading: true });
    const flesh = new THREE.MeshStandardMaterial({ color: 0x651d17, emissive: 0x3c0906, emissiveIntensity: 0.72, roughness: 0.86, flatShading: true });

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
    const face = facePlane(faceTextures.bertranda, 1.55, 1.55);
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
    tagCreature(root, boss);
    face.userData.weak = 1.9;
    root.visible = false;
    root.scale.setScalar(1.08);
    scene.add(root);
  }

  function buildRoachModel() {
    const root = new THREE.Group();
    const shell = new THREE.MeshStandardMaterial({ color: 0x4d2515, roughness: 0.46, metalness: 0.22, flatShading: true });
    const edge = new THREE.MeshStandardMaterial({ color: 0x9a5728, roughness: 0.58, metalness: 0.14, flatShading: true });
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
    const face = facePlane(faceTextures.roach, 0.67, 0.67);
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
    const skin = new THREE.MeshStandardMaterial({ color: 0x32283a, roughness: 0.77, flatShading: true });
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0x4c2940, side: THREE.DoubleSide, roughness: 0.92, flatShading: true });
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
    const face = facePlane(faceTextures.bat, 0.72, 0.72);
    face.position.set(0, 0.08, 0.35);
    root.add(face);
    return { root, parts: wings, face };
  }

  function buildSnakeModel() {
    const root = new THREE.Group();
    const scales = new THREE.MeshStandardMaterial({ color: 0x506126, roughness: 0.58, metalness: 0.08, flatShading: true });
    const belly = new THREE.MeshStandardMaterial({ color: 0x9b8b49, roughness: 0.8, flatShading: true });
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
    const face = facePlane(faceTextures.snake, 0.7, 0.78);
    face.position.set(0, 0.52, 0.69);
    root.add(face);
    return { root, parts, face };
  }

  function difficultyConfig() {
    if (settings.difficulty === "quiet") return { bossHp: 760, damage: 0.72, cap: 11, interval: 1.85, speed: 0.9 };
    if (settings.difficulty === "nightmare") return { bossHp: 1450, damage: 1.28, cap: 25, interval: 0.78, speed: 1.15 };
    return { bossHp: 1080, damage: 1, cap: 18, interval: 1.2, speed: 1 };
  }

  function effectiveEnemyCap() {
    const config = difficultyConfig();
    let cap = config.cap;
    if (settings.quality === "low") cap = Math.min(cap, 12);
    if (settings.quality === "auto" && (IS_TOUCH || navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)) cap = Math.min(cap, 15);
    return cap;
  }

  function chooseSpawnCell() {
    const candidates = floorCells.filter((cell) => {
      const world = worldFromCell(cell.x, cell.z);
      const distance = Math.hypot(world.x - player.x, world.z - player.z);
      if (distance < 18) return false;
      return rifts.some((rift) => Math.hypot(rift.x - world.x, rift.z - world.z) < 5.2);
    });
    return candidates[Math.floor(Math.random() * candidates.length)] || floorCells[Math.floor(Math.random() * floorCells.length)];
  }

  function chooseEnemyType() {
    const roll = Math.random();
    if (wave <= 1) return roll < 0.64 ? "roach" : roll < 0.84 ? "snake" : "bat";
    if (wave === 2) return roll < 0.42 ? "roach" : roll < 0.7 ? "snake" : "bat";
    return roll < 0.34 ? "roach" : roll < 0.62 ? "snake" : "bat";
  }

  function spawnCreature(forcedType, silent) {
    if (enemies.filter((enemy) => enemy.alive).length >= effectiveEnemyCap()) return;
    const type = forcedType || chooseEnemyType();
    const built = type === "roach" ? buildRoachModel() : type === "bat" ? buildBatModel() : buildSnakeModel();
    const health = type === "roach" ? 34 : type === "bat" ? 27 : 54;
    const speed = type === "roach" ? 3.15 : type === "bat" ? 4.05 : 2.7;
    const damage = type === "roach" ? 7 : type === "bat" ? 6 : 10;
    const radius = type === "roach" ? 0.52 : type === "bat" ? 0.48 : 0.58;
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
    creature.x = world.x + (Math.random() - 0.5) * 1.2;
    creature.z = world.z + (Math.random() - 0.5) * 1.2;
    creature.model.position.set(creature.x, type === "bat" ? 2.05 : 0.03, creature.z);
    tagCreature(creature.model, creature);
    creature.face.userData.weak = type === "bat" ? 2.05 : 1.78;
    scene.add(creature.model);
    enemies.push(creature);
    if (!silent) {
      spawnBurst(new THREE.Vector3(creature.x, type === "bat" ? 2 : 0.35, creature.z), 0xb84525);
      audio.tone(type === "bat" ? 880 : type === "snake" ? 170 : 230, 0.12, 0.035, "sawtooth", -60);
    }
  }

  function findPath(start, goal) {
    if (!isWalkableCell(goal.x, goal.z) || !isWalkableCell(start.x, start.z)) return [];
    const key = (x, z) => z * MAP_W + x;
    const startKey = key(start.x, start.z);
    const goalKey = key(goal.x, goal.z);
    if (startKey === goalKey) return [worldFromCell(goal.x, goal.z)];
    const open = [{ x: start.x, z: start.z, g: 0, f: Math.abs(goal.x - start.x) + Math.abs(goal.z - start.z) }];
    const came = new Map();
    const cost = new Map([[startKey, 0]]);
    const closed = new Set();
    while (open.length) {
      open.sort((a, b) => a.f - b.f);
      const current = open.shift();
      const currentKey = key(current.x, current.z);
      if (currentKey === goalKey) {
        const cells = [];
        let cursor = currentKey;
        while (cursor !== startKey) {
          const x = cursor % MAP_W;
          const z = Math.floor(cursor / MAP_W);
          cells.push(worldFromCell(x, z));
          cursor = came.get(cursor);
          if (cursor === undefined) break;
        }
        return cells.reverse();
      }
      closed.add(currentKey);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach((offset) => {
        const x = current.x + offset[0];
        const z = current.z + offset[1];
        if (!isWalkableCell(x, z)) return;
        const neighbourKey = key(x, z);
        if (closed.has(neighbourKey)) return;
        const nextCost = current.g + 1;
        if (!cost.has(neighbourKey) || nextCost < cost.get(neighbourKey)) {
          cost.set(neighbourKey, nextCost);
          came.set(neighbourKey, currentKey);
          const h = Math.abs(goal.x - x) + Math.abs(goal.z - z);
          const existing = open.find((node) => node.x === x && node.z === z);
          if (existing) {
            existing.g = nextCost;
            existing.f = nextCost + h;
          } else {
            open.push({ x, z, g: nextCost, f: nextCost + h });
          }
        }
      });
    }
    return [];
  }

  function lineOfSight(ax, az, bx, bz) {
    const distance = Math.hypot(bx - ax, bz - az);
    const steps = Math.ceil(distance / 0.4);
    for (let i = 1; i < steps; i += 1) {
      const amount = i / steps;
      const cell = cellFromWorld(lerp(ax, bx, amount), lerp(az, bz, amount));
      if (!isWalkableCell(cell.x, cell.z)) return false;
    }
    return true;
  }

  function moveCreature(creature, dt, speed) {
    creature.repath -= dt;
    if (creature.repath <= 0 || creature.pathIndex >= creature.path.length) {
      creature.repath = creature === boss ? 0.38 : 0.55 + Math.random() * 0.28;
      creature.path = findPath(cellFromWorld(creature.x, creature.z), cellFromWorld(player.x, player.z));
      creature.pathIndex = 0;
    }
    let target = creature.path[creature.pathIndex];
    if (!target) return;
    let dx = target.x - creature.x;
    let dz = target.z - creature.z;
    let distance = Math.hypot(dx, dz);
    if (distance < 0.22) {
      creature.pathIndex += 1;
      target = creature.path[creature.pathIndex];
      if (!target) return;
      dx = target.x - creature.x;
      dz = target.z - creature.z;
      distance = Math.hypot(dx, dz);
    }
    if (distance < 0.001) return;
    const amount = Math.min(distance, speed * dt);
    creature.x += dx / distance * amount;
    creature.z += dz / distance * amount;
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
    } else {
      creature.parts.forEach((part) => {
        part.object.position.x = Math.sin(creature.gait * 0.75 - part.index * 0.7) * (0.08 + part.index * 0.015);
        part.object.position.y = 0.25 - part.index * 0.008 + Math.abs(Math.sin(creature.gait - part.index * 0.55)) * 0.035;
      });
      creature.model.position.set(creature.x, 0.02, creature.z);
    }
    creature.attackCooldown = Math.max(0, creature.attackCooldown - dt);
  }

  function updateEnemies(dt) {
    const speedScale = difficultyConfig().speed;
    enemies.forEach((creature) => {
      if (!creature.alive) return;
      moveCreature(creature, dt, creature.speed * speedScale * (1 + (wave - 1) * 0.035));
      animateCreature(creature, dt);
      const distance = Math.hypot(player.x - creature.x, player.z - creature.z);
      if (distance < creature.radius + 0.62 && creature.attackCooldown <= 0) {
        creature.attackCooldown = creature.type === "bat" ? 0.72 : 0.92;
        damagePlayer(creature.damage * difficultyConfig().damage);
        const push = Math.max(0.001, distance);
        const nx = (player.x - creature.x) / push;
        const nz = (player.z - creature.z) / push;
        if (circleFree(player.x + nx * 0.45, player.z + nz * 0.45)) {
          player.x += nx * 0.45;
          player.z += nz * 0.45;
        }
      }
    });
  }

  function updateBoss(dt) {
    if (!boss.alive) return;
    const ratio = boss.hp / boss.maxHp;
    const nextPhase = ratio <= 0.32 ? 3 : ratio <= 0.66 ? 2 : 1;
    if (nextPhase > boss.phase) {
      boss.phase = nextPhase;
      audio.phase();
      showDanger(nextPhase === 2 ? "BERTRANDA IS MOLTING" : "BERTRANDA HAS LOST HER FACE", 2.8);
      showCaption(nextPhase === 2 ? "Her joints split wider. Keep firing." : "She is faster without the skin.", 3.8);
      for (let i = 0; i < nextPhase + 1; i += 1) spawnCreature(i % 2 ? "bat" : "roach");
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
    const material = new THREE.MeshBasicMaterial({ color: 0xd8e875, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.23, 1), material);
    const start = new THREE.Vector3(boss.x, 1.25, boss.z);
    const target = new THREE.Vector3(player.x, player.height, player.z);
    const velocity = target.sub(start).normalize().multiplyScalar(7.2 + boss.phase * 0.65);
    mesh.position.copy(start);
    const light = new THREE.PointLight(0xd9ef6d, 1.2, 5, 2);
    mesh.add(light);
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
        explosionAt(projectile.mesh.position.clone(), 0.42, 0xc6e65b, false);
        removeProjectile(i);
      } else if (projectile.life <= 0 || !isWalkableCell(cell.x, cell.z)) {
        explosionAt(projectile.mesh.position.clone(), 0.3, 0x98b84c, false);
        removeProjectile(i);
      }
    }
  }

  function removeProjectile(index) {
    scene.remove(projectiles[index].mesh);
    projectiles.splice(index, 1);
  }

  function circleFree(x, z, radius) {
    const r = radius || 0.38;
    const samples = [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r], [r * 0.72, r * 0.72], [-r * 0.72, r * 0.72], [r * 0.72, -r * 0.72], [-r * 0.72, -r * 0.72]];
    if (samples.some((sample) => {
      const cell = cellFromWorld(x + sample[0], z + sample[1]);
      return !isWalkableCell(cell.x, cell.z);
    })) return false;
    return !propColliders.some((box) => x + r > box.x1 && x - r < box.x2 && z + r > box.z1 && z - r < box.z2);
  }

  function setPlayerSpawn() {
    const spawn = worldFromCell(3, 16);
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
    const speed = player.running ? 5.8 : 3.7;
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

    const lookSpeed = IS_TOUCH ? 0.0031 : 0.00215;
    player.yaw -= controls.lookDX * lookSpeed;
    player.pitch = clamp(player.pitch - controls.lookDY * lookSpeed, -1.1, 1.1);
    controls.lookDX = 0;
    controls.lookDY = 0;

    const bobY = Math.abs(Math.sin(player.bob)) * 0.066 * player.bobAmount;
    const sway = Math.sin(player.bob * 0.5) * 0.015 * player.bobAmount;
    const shakeX = (Math.random() - 0.5) * screenShake;
    const shakeY = (Math.random() - 0.5) * screenShake * 0.72;
    camera.position.set(player.x + shakeX, player.height + bobY + shakeY, player.z + (Math.random() - 0.5) * screenShake);
    camera.rotation.set(player.pitch + shakeY * 0.08, player.yaw + shakeX * 0.06, sway, "YXZ");
    screenShake = Math.max(0, screenShake - dt * (1.7 + screenShake * 7));
    player.invulnerable = Math.max(0, player.invulnerable - dt);
  }

  function toggleTorch() {
    if (gameState !== "playing") return;
    player.torch = !player.torch;
    audio.tone(player.torch ? 580 : 270, 0.07, 0.055, "square", player.torch ? 70 : -40);
    ui.touchTorch.classList.toggle("pressed", player.torch);
  }

  function startReload() {
    if (gameState !== "playing" || weapon.reload > 0 || weapon.ammo >= weapon.magazine) return;
    weapon.reload = 1.12;
    controls.fire = false;
    ui.reticle.classList.add("reloading");
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
    } else if (controls.fire && weapon.cooldown <= 0) {
      fireWeapon();
    }

    const bob = player.moving ? Math.sin(player.bob) * 0.014 : Math.sin(elapsed * 1.8) * 0.004;
    weapon.model.position.set(0.34 + bob, -0.34 - weapon.recoil * 0.12 + Math.abs(bob) * 0.5, -0.62 + weapon.recoil * 0.12);
    weapon.model.rotation.set(-0.04 + weapon.recoil * 0.18, -0.04, bob * 0.7);
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
    const targets = [wallMesh];
    if (boss.alive) targets.push(boss.model);
    enemies.forEach((enemy) => {
      if (enemy.alive) targets.push(enemy.model);
    });
    const hits = raycaster.intersectObjects(targets, true);
    const fallback = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(48));
    const hit = hits[0];
    const end = hit ? hit.point.clone() : fallback;
    createTracer(raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(0.72)), end);
    if (hit) {
      let object = hit.object;
      let creature = object.userData.creature;
      while (!creature && object.parent) {
        object = object.parent;
        creature = object.userData.creature;
      }
      if (creature && creature.alive) {
        const multiplier = hit.object.userData.weak || object.userData.weak || 1;
        damageCreature(creature, 19 * multiplier, hit.point, multiplier > 1.1);
      } else {
        impactAt(hit.point, 0xd7b75b, 4);
      }
    }
    if (weapon.ammo <= 0) setTimeout(() => {
      if (gameState === "playing") startReload();
    }, 120);
  }

  function damageCreature(creature, damage, point, weak) {
    creature.hp -= damage;
    impactAt(point, weak ? 0xffde6a : 0xc54c28, weak ? 9 : 6);
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

  function killCreature(creature) {
    if (!creature.alive) return;
    creature.alive = false;
    scene.remove(creature.model);
    kills += 1;
    streak = elapsed - lastKillAt < 3.2 ? streak + 1 : 1;
    lastKillAt = elapsed;
    const position = new THREE.Vector3(creature.x, creature.type === "bat" ? 1.95 : 0.46, creature.z);
    explosionAt(position, creature.type === "snake" ? 0.85 : 0.68, creature.type === "bat" ? 0x9d79bd : creature.type === "snake" ? 0x9eb843 : 0xd4672e, true);
    if (kills % 8 === 0 || Math.random() < 0.09) spawnHealth(position);
  }

  function killBoss() {
    if (!boss.alive) return;
    boss.alive = false;
    boss.hp = 0;
    gameState = "winning";
    controls.fire = false;
    ui.objective.textContent = "BERTRANDA DESTROYED";
    showDanger("DIRECT HIT — BERTRANDA DOWN", 3);
    const token = sessionId;
    const base = new THREE.Vector3(boss.x, 1.15, boss.z);
    boss.model.visible = false;
    explosionAt(base.clone(), 2.55, 0xff7a31, true);
    [140, 300, 470, 650, 820].forEach((delay, index) => {
      setTimeout(() => {
        if (sessionId !== token || gameState !== "winning") return;
        const offset = new THREE.Vector3((Math.random() - 0.5) * 4.6, Math.random() * 2 + 0.25, (Math.random() - 0.5) * 4.6);
        explosionAt(base.clone().add(offset), 1.1 + index * 0.18, index % 2 ? 0xd43c25 : 0xffcf59, true);
      }, delay);
    });
    enemies.forEach((enemy, index) => {
      if (!enemy.alive) return;
      setTimeout(() => {
        if (sessionId === token && enemy.alive) killCreature(enemy);
      }, 80 + index * 42);
    });
    setTimeout(() => {
      if (sessionId === token && gameState === "winning") finishWin();
    }, 1700);
  }

  function damagePlayer(amount) {
    if (gameState !== "playing" || player.invulnerable > 0) return;
    player.invulnerable = 0.28;
    player.health = Math.max(0, player.health - amount);
    screenShake = Math.max(screenShake, 0.3);
    audio.hurt();
    ui.damageFlash.classList.remove("visible");
    void ui.damageFlash.offsetWidth;
    ui.damageFlash.classList.add("visible");
    setTimeout(() => ui.damageFlash.classList.remove("visible"), 310);
    if (player.health <= 0) killPlayer();
  }

  function killPlayer() {
    if (gameState !== "playing") return;
    gameState = "dying";
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

  function finishWin() {
    gameState = "won";
    if (document.pointerLockElement) document.exitPointerLock();
    ui.hud.hidden = true;
    ui.touch.hidden = true;
    ui.finalTime.textContent = formatTime(elapsed);
    ui.finalKills.textContent = String(kills);
    ui.win.hidden = false;
    ui.win.classList.add("is-visible");
  }

  function createTracer(start, end) {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: 0xffe59a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    effects.push({ kind: "line", object: line, life: 0.07, maxLife: 0.07 });
  }

  function impactAt(position, color, count) {
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
    impactAt(position, color, settings.quality === "low" ? 5 : 9);
    const light = new THREE.PointLight(color, 1.5, 6, 2);
    light.position.copy(position);
    scene.add(light);
    effects.push({ kind: "light", object: light, life: 0.35, maxLife: 0.35 });
  }

  function explosionAt(position, scale, color, loud) {
    const coreMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), coreMaterial);
    core.position.copy(position);
    scene.add(core);
    const light = new THREE.PointLight(color, 5.4 * scale, 11 * scale, 1.5);
    light.position.copy(position);
    scene.add(light);
    effects.push({ kind: "blast", object: core, light, life: 0.48, maxLife: 0.48, scale });

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffe49b, transparent: true, opacity: 0.74, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.34, 18), ringMaterial);
    ring.position.copy(position);
    ring.lookAt(camera.position);
    scene.add(ring);
    effects.push({ kind: "ring", object: ring, life: 0.42, maxLife: 0.42, scale });

    const fragments = settings.quality === "low" ? 12 : Math.min(34, 16 + Math.round(scale * 7));
    for (let i = 0; i < fragments; i += 1) {
      const fragmentMaterial = new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? 0xffb64b : i % 2 ? color : 0x2b180e, emissive: i % 3 === 0 ? 0x9b310f : 0x000000, emissiveIntensity: 1 });
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
        effect.light.intensity = Math.max(0, (1 - progress) * 6 * effect.scale);
      } else if (effect.kind === "ring") {
        const progress = 1 - effect.life / effect.maxLife;
        effect.object.scale.setScalar(effect.scale * (0.5 + progress * 7));
        effect.object.material.opacity = Math.max(0, (1 - progress) * 0.74);
      } else if (effect.kind === "line") {
        effect.object.material.opacity = Math.max(0, effect.life / effect.maxLife);
      } else if (effect.kind === "light") {
        effect.object.intensity = Math.max(0, effect.life / effect.maxLife * 1.5);
      }
      if (effect.life <= 0) {
        scene.remove(effect.object);
        if (effect.light) scene.remove(effect.light);
        effects.splice(i, 1);
      }
    }
  }

  function spawnHealth(position) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0xa8d45a, emissive: 0x5e9a27, emissiveIntensity: 2.2, roughness: 0.4 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 7, 16), material);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), material);
    group.add(core);
    const light = new THREE.PointLight(0xa8e35a, 1.1, 5, 2);
    group.add(light);
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
        pickups.splice(i, 1);
      } else if (pickup.life <= 0) {
        scene.remove(pickup.group);
        pickups.splice(i, 1);
      }
    }
  }

  function updateSpawning(dt) {
    wave = 1 + Math.floor(elapsed / 24);
    spawnTimer -= dt;
    if (spawnTimer > 0) return;
    const config = difficultyConfig();
    const phaseBoost = 1 + (boss.phase - 1) * 0.25;
    spawnTimer = Math.max(0.42, config.interval / phaseBoost) * (0.78 + Math.random() * 0.48);
    spawnCreature();
    if (settings.difficulty === "nightmare" && boss.phase === 3 && Math.random() < 0.32) spawnCreature();
    if (wave > 1 && Math.floor(elapsed) % 24 < 2) showDanger("WAVE " + wave + " — MORE FACES", 1.5);
  }

  function animateHouse() {
    flickerLights.forEach((entry) => {
      const flicker = 0.92 + Math.sin(elapsed * 5.7 + entry.phase) * 0.055 + Math.sin(elapsed * 17.3 + entry.phase) * 0.025;
      entry.light.intensity = entry.base * flicker;
    });
    rifts.forEach((rift) => {
      rift.ring.rotation.z = elapsed * 0.22 + rift.phase;
      rift.glow.intensity = 0.5 + Math.sin(elapsed * 3.1 + rift.phase) * 0.18;
      rift.group.scale.setScalar(0.96 + Math.sin(elapsed * 2.2 + rift.phase) * 0.04);
    });
    flashlight.intensity = player.torch ? 4.7 : 0;
    flashlightHalo.intensity = player.torch ? 0.52 : 0;
  }

  function updateHud() {
    const healthRatio = clamp(player.health / 100, 0, 1);
    const bossRatio = clamp(boss.hp / boss.maxHp, 0, 1);
    ui.healthFill.style.transform = "scaleX(" + healthRatio + ")";
    ui.healthText.textContent = String(Math.ceil(player.health));
    ui.bossFill.style.transform = "scaleX(" + bossRatio + ")";
    ui.bossPhase.textContent = boss.phase === 1 ? "THE MOTHER BELOW" : boss.phase === 2 ? "SHELL SPLIT OPEN" : "FACE LOST · BERSERK";
    ui.ammo.textContent = String(weapon.ammo).padStart(2, "0");
    ui.weaponState.textContent = weapon.reload > 0 ? "RELOADING " + Math.ceil(weapon.reload * 10) / 10 + "s" : weapon.ammo <= 5 ? "LOW · PRESS R" : "READY · FULL AUTO";
    ui.wave.textContent = "WAVE " + wave + " · " + kills + (kills === 1 ? " VERMIN DESTROYED" : " VERMIN DESTROYED");
    const activeStreak = elapsed - lastKillAt < 3.2 ? streak : 0;
    ui.streak.textContent = activeStreak > 1 ? activeStreak + "× DETONATION STREAK" : "MOVE · AIM · DETONATE";
    ui.prompt.textContent = weapon.reload > 0 ? "RELOADING SALT CELLS" : "";
    ui.prompt.classList.toggle("visible", weapon.reload > 0);
    ui.danger.classList.toggle("visible", dangerUntil > elapsed);
    ui.caption.classList.toggle("visible", captionUntil > elapsed);
  }

  function showCaption(text, seconds) {
    ui.caption.textContent = text;
    captionUntil = elapsed + (seconds || 3);
    ui.caption.classList.add("visible");
  }

  function showDanger(text, seconds) {
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
    enemies.forEach((enemy) => scene.remove(enemy.model));
    enemies.length = 0;
    projectiles.forEach((projectile) => scene.remove(projectile.mesh));
    projectiles.length = 0;
    pickups.forEach((pickup) => scene.remove(pickup.group));
    pickups.length = 0;
    effects.forEach((effect) => {
      scene.remove(effect.object);
      if (effect.light) scene.remove(effect.light);
    });
    effects.length = 0;
  }

  function resetSession() {
    sessionId += 1;
    clearSessionObjects();
    elapsed = 0;
    wave = 1;
    kills = 0;
    streak = 0;
    lastKillAt = -20;
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
    ui.reticle.classList.remove("reloading", "hit");
    const config = difficultyConfig();
    boss.maxHp = config.bossHp;
    boss.hp = boss.maxHp;
    boss.phase = 1;
    boss.alive = true;
    boss.path = [];
    boss.pathIndex = 0;
    boss.repath = 0;
    boss.attackCooldown = 1.2;
    boss.webCooldown = 3.4;
    boss.gait = 0;
    const bossSpawn = worldFromCell(21, 10);
    boss.x = bossSpawn.x;
    boss.z = bossSpawn.z;
    boss.model.position.set(boss.x, 0.08, boss.z);
    boss.model.rotation.set(0, Math.PI, 0);
    boss.model.visible = true;
    for (let i = 0; i < (settings.difficulty === "quiet" ? 4 : 6); i += 1) {
      spawnCreature(i % 3 === 0 ? "bat" : i % 3 === 1 ? "snake" : "roach", true);
    }
    updateHud();
    audio.resetMusic();
  }

  function startGame() {
    audio.start();
    ui.title.classList.remove("is-visible");
    ui.title.hidden = true;
    ui.pause.hidden = true;
    ui.pause.classList.remove("is-visible");
    ui.death.hidden = true;
    ui.death.classList.remove("is-visible");
    ui.win.hidden = true;
    ui.win.classList.remove("is-visible");
    ui.hud.hidden = false;
    ui.touch.hidden = !IS_TOUCH;
    gameState = "playing";
    resetSession();
    showDanger("BERTRANDA IS IN THE HOUSE", 2.4);
    showCaption("Every face is human. Everything else is hungry. Fire.", 4.6);
    if (!IS_TOUCH) requestPointer();
  }

  function pauseGame() {
    if (gameState !== "playing") return;
    gameState = "paused";
    controls.fire = false;
    ui.pause.hidden = false;
    ui.pause.classList.add("is-visible");
    ui.touch.hidden = true;
    if (document.pointerLockElement) document.exitPointerLock();
  }

  function resumeGame() {
    if (gameState !== "paused") return;
    ui.pause.classList.remove("is-visible");
    ui.pause.hidden = true;
    ui.touch.hidden = !IS_TOUCH;
    gameState = "playing";
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

  function bindKeyboardAndMouse() {
    window.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code) && gameState === "playing") event.preventDefault();
      controls.keys.add(event.code);
      if (event.code === "Space" && gameState === "playing") controls.fire = true;
      if (event.code === "KeyR" && !event.repeat) startReload();
      if (event.code === "KeyF" && !event.repeat) toggleTorch();
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
      controls.keys.clear();
      controls.fire = false;
      if (gameState === "playing" && IS_TOUCH) pauseGame();
    });
    document.addEventListener("mousemove", (event) => {
      if (gameState === "playing" && document.pointerLockElement === ui.host) {
        controls.lookDX += event.movementX;
        controls.lookDY += event.movementY;
      }
    });
    ui.host.addEventListener("mousedown", (event) => {
      if (event.button !== 0 || gameState !== "playing") return;
      if (!IS_TOUCH && document.pointerLockElement !== ui.host) requestPointer();
      controls.fire = true;
    });
    window.addEventListener("mouseup", (event) => {
      if (event.button === 0) controls.fire = false;
    });
    ui.host.addEventListener("contextmenu", (event) => event.preventDefault());
    document.addEventListener("pointerlockchange", () => {
      const locked = document.pointerLockElement === ui.host;
      if (pointerWasLocked && !locked && gameState === "playing") pauseGame();
      pointerWasLocked = locked;
    });
  }

  function bindTouchControls() {
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
      ui.moveKnob.style.transform = "translate(" + x + "px," + y + "px)";
    };
    ui.movePad.addEventListener("pointerdown", (event) => {
      movePointer = event.pointerId;
      ui.movePad.setPointerCapture(event.pointerId);
      updateMove(event);
    });
    ui.movePad.addEventListener("pointermove", (event) => {
      if (event.pointerId === movePointer) updateMove(event);
    });
    const endMove = (event) => {
      if (event.pointerId !== movePointer) return;
      movePointer = null;
      controls.moveX = 0;
      controls.moveY = 0;
      ui.moveKnob.style.transform = "";
    };
    ui.movePad.addEventListener("pointerup", endMove);
    ui.movePad.addEventListener("pointercancel", endMove);

    let lookPointer = null;
    let lookX = 0;
    let lookY = 0;
    ui.lookPad.addEventListener("pointerdown", (event) => {
      lookPointer = event.pointerId;
      lookX = event.clientX;
      lookY = event.clientY;
      ui.lookPad.setPointerCapture(event.pointerId);
    });
    ui.lookPad.addEventListener("pointermove", (event) => {
      if (event.pointerId !== lookPointer) return;
      controls.lookDX += (event.clientX - lookX) * 1.15;
      controls.lookDY += (event.clientY - lookY) * 1.15;
      lookX = event.clientX;
      lookY = event.clientY;
    });
    const endLook = (event) => {
      if (event.pointerId === lookPointer) lookPointer = null;
    };
    ui.lookPad.addEventListener("pointerup", endLook);
    ui.lookPad.addEventListener("pointercancel", endLook);

    const holdButton = (button, start, stop) => {
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        button.classList.add("pressed");
        start();
      });
      const end = () => {
        button.classList.remove("pressed");
        stop();
      };
      button.addEventListener("pointerup", end);
      button.addEventListener("pointercancel", end);
    };
    holdButton(ui.touchFire, () => {
      controls.fire = true;
    }, () => {
      controls.fire = false;
    });
    holdButton(ui.touchRun, () => {
      controls.runTouch = true;
    }, () => {
      controls.runTouch = false;
    });
    ui.touchReload.addEventListener("click", startReload);
    ui.touchTorch.addEventListener("click", toggleTorch);
  }

  function applyQuality() {
    if (!renderer) return;
    let ratio = Math.min(devicePixelRatio, 1.55);
    if (settings.quality === "low") ratio = 1;
    if (settings.quality === "high") ratio = Math.min(devicePixelRatio, 2);
    renderer.setPixelRatio(ratio);
    renderer.setSize(innerWidth, innerHeight, false);
  }

  function onResize() {
    if (!camera || !renderer) return;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  }

  function init() {
    if (!window.THREE) {
      ui.loading.innerHTML = "<strong>THE HOUSE FAILED TO LOAD</strong><small>Three.js is missing.</small>";
      return;
    }
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.34;
    applyQuality();
    ui.host.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x182014);
    scene.fog = new THREE.FogExp2(0x182014, 0.018);
    camera = new THREE.PerspectiveCamera(73, innerWidth / innerHeight, 0.06, 95);
    camera.rotation.order = "YXZ";
    scene.add(camera);
    clock = new THREE.Clock();

    const hemisphere = new THREE.HemisphereLight(0xdce6bb, 0x332215, 0.68);
    scene.add(hemisphere);
    const ambient = new THREE.AmbientLight(0x8f976f, 0.24);
    scene.add(ambient);
    const moon = new THREE.DirectionalLight(0xbad5c5, 0.34);
    moon.position.set(-20, 18, -12);
    scene.add(moon);

    buildHouse();
    buildWeapon();
    flashlight = new THREE.SpotLight(0xffe0a6, 4.7, 48, Math.PI / 5.4, 0.55, 1.2);
    flashlight.position.set(0.12, -0.06, 0.05);
    flashlight.target.position.set(0, -0.03, -3);
    camera.add(flashlight, flashlight.target);
    flashlightHalo = new THREE.PointLight(0xffd59a, 0.52, 7, 2);
    flashlightHalo.position.set(0, 0, -0.25);
    camera.add(flashlightHalo);

    faceTextures.bertranda = loadFaceTexture("assets/bertranda-face-v2.png");
    faceTextures.roach = loadFaceTexture("assets/roach-face-v2.png");
    faceTextures.bat = loadFaceTexture("assets/bat-face-v2.png");
    faceTextures.snake = loadFaceTexture("assets/snake-face-v2.png");
    buildBoss();
    setPlayerSpawn();
    bindKeyboardAndMouse();
    bindTouchControls();
    window.addEventListener("resize", onResize);

    ui.start.disabled = false;
    ui.loading.classList.add("is-done");
    setTimeout(() => {
      ui.loading.hidden = true;
    }, 560);
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(0.034, clock.getDelta());
    if (gameState === "playing") {
      elapsed += dt;
      audio.updateMusic();
      updatePlayer(dt);
      updateWeapon(dt);
      updateSpawning(dt);
      updateBoss(dt);
      updateEnemies(dt);
      updateProjectiles(dt);
      updatePickups(dt);
      updateEffects(dt);
      animateHouse();
      updateHud();
    } else {
      if (gameState === "winning" || gameState === "dying") {
        elapsed += dt;
        updateEffects(dt);
      }
      animateHouse();
    }
    renderer.render(scene, camera);
  }

  ui.start.addEventListener("click", startGame);
  ui.pauseButton.addEventListener("click", pauseGame);
  ui.resume.addEventListener("click", resumeGame);
  ui.restart.addEventListener("click", restartGame);
  ui.retry.addEventListener("click", restartGame);
  ui.again.addEventListener("click", restartGame);

  init();
})();
