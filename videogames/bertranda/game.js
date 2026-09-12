(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
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
    nestCount: $("#nest-count"),
    danger: $("#danger"),
    prompt: $("#prompt"),
    caption: $("#subtitle"),
    holdWrap: $("#hold-wrap"),
    holdFill: $("#hold-fill"),
    range: $("#range-text"),
    bars: [...document.querySelectorAll("#signal-bars i")],
    battery: $("#battery-fill"),
    batteryText: $("#battery-text"),
    pauseButton: $("#pause-button"),
    touch: $("#touch-controls"),
    movePad: $("#move-pad"),
    moveKnob: $("#move-knob"),
    lookPad: $("#look-pad"),
    touchRun: $("#touch-run"),
    touchAction: $("#touch-action"),
    touchTorch: $("#touch-torch"),
    pause: $("#pause-screen"),
    resume: $("#resume-button"),
    restart: $("#restart-button"),
    death: $("#death-screen"),
    retry: $("#retry-button"),
    win: $("#win-screen"),
    again: $("#again-button"),
    finalTime: $("#final-time"),
    winCopy: $("#win-copy"),
    scare: $("#jumpscare")
  };

  const settings = {
    difficulty: "normal",
    quality: "auto",
    muted: false
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
    droneGain: null,
    started: false,
    start() {
      if (this.started) {
        if (this.context?.state === "suspended") this.context.resume();
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = settings.muted ? 0 : 0.72;
      this.master.connect(this.context.destination);

      const drone = this.context.createOscillator();
      const droneTwo = this.context.createOscillator();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      drone.type = "sawtooth";
      drone.frequency.value = 42;
      droneTwo.type = "sine";
      droneTwo.frequency.value = 56.5;
      filter.type = "lowpass";
      filter.frequency.value = 122;
      gain.gain.value = 0.032;
      drone.connect(filter);
      droneTwo.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      drone.start();
      droneTwo.start();
      this.droneGain = gain;
      this.started = true;
    },
    toggleMute() {
      settings.muted = !settings.muted;
      ui.mute.textContent = settings.muted ? "SOUND OFF" : "SOUND ON";
      ui.mute.setAttribute("aria-pressed", String(settings.muted));
      if (this.master && this.context) {
        this.master.gain.cancelScheduledValues(this.context.currentTime);
        this.master.gain.linearRampToValueAtTime(settings.muted ? 0 : 0.72, this.context.currentTime + 0.08);
      }
    },
    tone(frequency, duration = 0.12, volume = 0.1, type = "sine", slide = 0) {
      if (!this.context || !this.master || settings.muted) return;
      const now = this.context.currentTime;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency + slide), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    },
    noise(duration = 0.18, volume = 0.08, cutoff = 850) {
      if (!this.context || !this.master || settings.muted) return;
      const frames = Math.max(1, Math.floor(this.context.sampleRate * duration));
      const buffer = this.context.createBuffer(1, frames, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
      const source = this.context.createBufferSource();
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      filter.type = "bandpass";
      filter.frequency.value = cutoff;
      filter.Q.value = 0.8;
      gain.gain.value = volume;
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      source.start();
    },
    detector(strength) {
      this.tone(330 + strength * 690, 0.06, 0.045 + strength * 0.055, "square", 60);
    },
    step(run) {
      this.noise(0.075, run ? 0.06 : 0.035, run ? 260 : 190);
    },
    seal() {
      this.noise(0.65, 0.16, 1200);
      this.tone(185, 0.7, 0.11, "sawtooth", -120);
    },
    alert() {
      this.tone(74, 0.28, 0.15, "sawtooth", 80);
      setTimeout(() => this.tone(64, 0.32, 0.13, "sawtooth", 100), 170);
    },
    heartbeat(intensity) {
      this.tone(52, 0.09, 0.05 + intensity * 0.08, "sine", -11);
      setTimeout(() => this.tone(45, 0.1, 0.035 + intensity * 0.065, "sine", -8), 125);
    },
    scare() {
      this.noise(0.72, 0.34, 1500);
      this.tone(190, 0.75, 0.22, "sawtooth", -155);
      this.tone(66, 0.9, 0.2, "square", 42);
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

  const wallV = (x, z1, z2, openings = []) => {
    for (let z = z1; z <= z2; z += 1) if (!openings.includes(z)) grid[z][x] = 1;
  };
  const wallH = (z, x1, x2, openings = []) => {
    for (let x = x1; x <= x2; x += 1) if (!openings.includes(x)) grid[z][x] = 1;
  };
  wallV(8, 1, 7, [3]);
  wallV(16, 1, 7, [4]);
  wallH(8, 1, 23, [4, 12, 20]);
  wallV(10, 9, 17, [11, 16]);
  wallV(18, 9, 17, [12, 16]);
  wallH(13, 1, 9, [4]);
  wallH(14, 11, 23, [14, 21]);

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
    for (let x = 1; x < MAP_W - 1; x += 1) if (isWalkableCell(x, z)) floorCells.push({ x, z });
  }

  let renderer;
  let scene;
  let camera;
  let clock;
  let wallMesh;
  const flickerLights = [];
  const propColliders = [];
  const animatedProps = [];
  let exitDoor;
  let portraitTexture;
  let gameState = "title";
  let elapsed = 0;
  let captionUntil = 0;
  let dangerUntil = 0;
  let pointerGrace = 0;
  let raf = 0;

  const player = {
    x: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    height: 1.62,
    bob: 0,
    bobAmount: 0,
    stamina: 100,
    battery: 100,
    torch: true,
    hidden: false,
    hiddenAt: null,
    hideReturn: null,
    moving: false,
    running: false,
    stepPhase: 0,
    lastStepPhase: 0
  };

  const controls = {
    keys: new Set(),
    moveX: 0,
    moveY: 0,
    lookDX: 0,
    lookDY: 0,
    action: false,
    justAction: false,
    runTouch: false
  };

  function setPlayerSpawn() {
    const spawn = worldFromCell(3, 16);
    player.x = spawn.x;
    player.z = spawn.z;
    player.yaw = -Math.PI / 2;
    player.pitch = 0;
    player.bob = 0;
    player.bobAmount = 0;
    player.stamina = 100;
    player.battery = 100;
    player.torch = true;
    player.hidden = false;
    player.hiddenAt = null;
    player.hideReturn = null;
  }

  function makeTexture(kind) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (kind === "wall") {
      context.fillStyle = "#343323";
      context.fillRect(0, 0, 256, 256);
      context.fillStyle = "rgba(220,210,151,.035)";
      for (let y = 0; y < 256; y += 18) context.fillRect(0, y, 256, 2);
      for (let i = 0; i < 2500; i += 1) {
        const shade = 33 + Math.random() * 32;
        context.fillStyle = `rgba(${shade + 18},${shade + 15},${shade},${Math.random() * 0.15})`;
        context.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 7 + 1, Math.random() * 18 + 2);
      }
      context.fillStyle = "rgba(36,50,25,.22)";
      for (let i = 0; i < 18; i += 1) context.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 55, Math.random() * 45);
    } else if (kind === "floor") {
      context.fillStyle = "#181710";
      context.fillRect(0, 0, 256, 256);
      context.strokeStyle = "#393522";
      context.lineWidth = 3;
      for (let y = 0; y <= 256; y += 32) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(256, y + (Math.random() - 0.5) * 3);
        context.stroke();
      }
      for (let i = 0; i < 700; i += 1) {
        const value = 25 + Math.random() * 30;
        context.fillStyle = `rgba(${value + 12},${value + 8},${value},${Math.random() * 0.2})`;
        context.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 12 + 2, Math.random() * 2 + 1);
      }
    } else {
      context.fillStyle = "#161912";
      context.fillRect(0, 0, 256, 256);
      context.strokeStyle = "rgba(150,145,102,.14)";
      context.lineWidth = 1;
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

  function addBox(x, y, z, width, height, depth, material, parent = scene) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  function addCollider(x, z, width, depth) {
    propColliders.push({ x1: x - width / 2, x2: x + width / 2, z1: z - depth / 2, z2: z + depth / 2 });
  }

  function cylinderBetween(a, b, radius, material, parent) {
    const direction = new THREE.Vector3().subVectors(b, a);
    const length = direction.length();
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.82, length, 6), material);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    parent.add(mesh);
    return mesh;
  }

  function buildHouse() {
    const wallTexture = makeTexture("wall");
    wallTexture.repeat.set(1.4, 1.4);
    const floorTexture = makeTexture("floor");
    floorTexture.repeat.set(MAP_W * 0.72, MAP_H * 0.72);
    const ceilingTexture = makeTexture("ceiling");
    ceilingTexture.repeat.set(8, 6);

    const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture, color: 0xc4b985, roughness: 0.94, metalness: 0.02 });
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
      dummy.rotation.y = ((cell.x * 19 + cell.z * 7) % 5) * 0.001;
      dummy.updateMatrix();
      wallMesh.setMatrixAt(index, dummy.matrix);
      const shade = 0.73 + ((cell.x * 13 + cell.z * 11) % 13) / 70;
      tint.setRGB(shade, shade * 0.96, shade * 0.72);
      wallMesh.setColorAt(index, tint);
    });
    scene.add(wallMesh);

    const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, color: 0x71684b, roughness: 1 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(MAP_W * CELL, MAP_H * CELL), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture, color: 0x514f3b, side: THREE.DoubleSide, roughness: 1 });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(MAP_W * CELL, MAP_H * CELL), ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4.48;
    scene.add(ceiling);

    const darkWood = new THREE.MeshStandardMaterial({ color: 0x24160f, roughness: 0.86 });
    const oldWood = new THREE.MeshStandardMaterial({ color: 0x4a321e, roughness: 0.9 });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x3a211d, roughness: 1 });
    const metal = new THREE.MeshStandardMaterial({ color: 0x5d573b, roughness: 0.5, metalness: 0.54 });
    const glass = new THREE.MeshStandardMaterial({ color: 0xe0b85e, emissive: 0x6d4b14, emissiveIntensity: 0.7 });

    const addBed = (cx, cz, rotation = 0) => {
      const world = worldFromCell(cx, cz);
      const group = new THREE.Group();
      group.position.set(world.x, 0, world.z);
      group.rotation.y = rotation;
      scene.add(group);
      addBox(0, 0.42, 0, 3.25, 0.55, 1.75, oldWood, group);
      addBox(0, 0.78, 0.05, 3.05, 0.28, 1.58, cloth, group);
      addBox(-1.48, 1.22, 0, 0.22, 2.05, 1.95, darkWood, group);
      addBox(1.18, 1.0, 0, 0.18, 1.15, 1.82, darkWood, group);
      const w = rotation % Math.PI === 0 ? 3.25 : 1.75;
      const d = rotation % Math.PI === 0 ? 1.75 : 3.25;
      addCollider(world.x, world.z, w, d);
    };
    addBed(2, 6, 0);
    addBed(11, 6, Math.PI / 2);
    addBed(21, 5, 0);
    addBed(7, 16, Math.PI / 2);

    const addTable = (cx, cz) => {
      const world = worldFromCell(cx, cz);
      addBox(world.x, 1.08, world.z, 2.55, 0.18, 1.55, oldWood);
      [[-1.03, -0.55], [1.03, -0.55], [-1.03, 0.55], [1.03, 0.55]].forEach(([ox, oz]) => addBox(world.x + ox, 0.52, world.z + oz, 0.16, 1.05, 0.16, darkWood));
      addCollider(world.x, world.z, 2.7, 1.7);
    };
    addTable(5, 4);
    addTable(13, 3);
    addTable(14, 10);
    addTable(21, 16);

    const addShelf = (cx, cz, rotation = 0) => {
      const world = worldFromCell(cx, cz);
      const group = new THREE.Group();
      group.position.set(world.x, 0, world.z);
      group.rotation.y = rotation;
      scene.add(group);
      addBox(0, 1.6, 0, 2.8, 3.15, 0.38, darkWood, group);
      for (let y = 0.5; y < 3; y += 0.63) addBox(0, y, -0.28, 2.9, 0.1, 0.8, oldWood, group);
      for (let i = 0; i < 11; i += 1) {
        const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.06 + (i % 3) * 0.015, 0.08, 0.28 + (i % 4) * 0.05, 6), i % 2 ? glass : metal);
        bottle.position.set(-1.1 + (i % 6) * 0.43, 0.74 + Math.floor(i / 6) * 0.63, -0.54);
        group.add(bottle);
      }
      const w = rotation % Math.PI === 0 ? 3 : 0.9;
      const d = rotation % Math.PI === 0 ? 0.9 : 3;
      addCollider(world.x, world.z, w, d);
    };
    addShelf(6, 1, 0);
    addShelf(10, 1, 0);
    addShelf(17, 6, Math.PI / 2);
    addShelf(23, 11, Math.PI / 2);
    addShelf(11, 16, Math.PI / 2);

    const rugMaterial = new THREE.MeshBasicMaterial({ color: 0x3c1412, side: THREE.DoubleSide });
    [[4, 3, 0], [12, 4, Math.PI / 2], [20, 3, 0], [6, 10, 0], [14, 16, Math.PI / 2]].forEach(([cx, cz, rotation]) => {
      const world = worldFromCell(cx, cz);
      const rug = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 2.4), rugMaterial);
      rug.rotation.x = -Math.PI / 2;
      rug.rotation.z = rotation;
      rug.position.set(world.x, 0.012, world.z);
      scene.add(rug);
    });

    const lampCells = [[4, 4], [12, 4], [20, 4], [4, 10], [14, 10], [21, 11], [5, 16], [14, 16], [21, 16]];
    lampCells.forEach(([cx, cz], index) => {
      const world = worldFromCell(cx, cz);
      const fixture = new THREE.Group();
      fixture.position.set(world.x, 4.05, world.z);
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 5), metal);
      cord.position.y = 0.18;
      fixture.add(cord);
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.34, 9, 1, true), metal);
      shade.position.y = -0.12;
      fixture.add(shade);
      scene.add(fixture);
      const light = new THREE.PointLight(index % 4 === 0 ? 0xb2c277 : 0xe0ba68, 0.82, 15, 2.1);
      light.position.set(world.x, 3.65, world.z);
      scene.add(light);
      flickerLights.push({ light, base: light.intensity, phase: index * 2.13 });
    });

    buildWardrobes(darkWood, oldWood, metal);
    buildExit(darkWood, metal);
    addPortraits();
  }

  const wardrobes = [];
  function buildWardrobes(darkWood, oldWood, metal) {
    const defs = [
      { cell: [6, 5], rot: 0 },
      { cell: [14, 6], rot: Math.PI },
      { cell: [3, 10], rot: Math.PI / 2 },
      { cell: [15, 16], rot: -Math.PI / 2 },
      { cell: [21, 10], rot: Math.PI }
    ];
    defs.forEach((def, index) => {
      const world = worldFromCell(...def.cell);
      const group = new THREE.Group();
      group.position.set(world.x, 0, world.z);
      group.rotation.y = def.rot;
      addBox(0, 1.65, 0, 2.2, 3.3, 0.92, darkWood, group);
      addBox(-0.53, 1.67, -0.49, 1.01, 3.05, 0.08, oldWood, group);
      addBox(0.53, 1.67, -0.49, 1.01, 3.05, 0.08, oldWood, group);
      const knobA = new THREE.Mesh(new THREE.SphereGeometry(0.075, 6, 5), metal);
      knobA.position.set(-0.12, 1.62, -0.57);
      const knobB = knobA.clone();
      knobB.position.x = 0.12;
      group.add(knobA, knobB);
      scene.add(group);
      const colliderWidth = Math.abs(Math.sin(def.rot)) > 0.5 ? 1.1 : 2.3;
      const colliderDepth = Math.abs(Math.sin(def.rot)) > 0.5 ? 2.3 : 1.1;
      addCollider(world.x, world.z, colliderWidth, colliderDepth);
      const front = new THREE.Vector3(Math.sin(def.rot), 0, -Math.cos(def.rot));
      wardrobes.push({ id: index, group, x: world.x, z: world.z, front, occupied: false });
    });
  }

  function buildExit(darkWood, metal) {
    const world = worldFromCell(1, 16);
    const group = new THREE.Group();
    group.position.set(ORIGIN_X + CELL + 0.18, 0, world.z);
    group.rotation.y = Math.PI / 2;
    const door = addBox(0, 2.05, 0, 3.4, 4.1, 0.3, darkWood, group);
    door.material = door.material.clone();
    const bar = addBox(0, 1.25, -0.24, 2.4, 0.19, 0.16, metal, group);
    const seal = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.07, 7, 18), new THREE.MeshStandardMaterial({ color: 0x8c2a20, emissive: 0x260604, emissiveIntensity: 0.4 }));
    seal.position.set(0, 2.43, -0.22);
    group.add(seal);
    scene.add(group);
    exitDoor = { group, door, bar, seal, x: world.x, z: world.z, unlocked: false };
  }

  function addPortraits() {
    const loader = new THREE.TextureLoader();
    loader.load("assets/bertranda-human.svg", (texture) => {
      portraitTexture = texture;
      texture.encoding = THREE.sRGBEncoding;
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x332012, roughness: 0.7 });
      const portraitMat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
      const placements = [
        { cell: [12, 1], y: 2.25, rot: 0 },
        { cell: [23, 5], y: 2.2, rot: -Math.PI / 2 }
      ];
      placements.forEach((placement) => {
        const world = worldFromCell(...placement.cell);
        const group = new THREE.Group();
        group.position.set(world.x, placement.y, world.z);
        group.rotation.y = placement.rot;
        addBox(0, 0, 0, 1.72, 2.32, 0.12, frameMat, group);
        const portrait = new THREE.Mesh(new THREE.PlaneGeometry(1.48, 2.08), portraitMat);
        portrait.position.z = -0.07;
        group.add(portrait);
        scene.add(group);
      });
    });
  }

  const nestDefs = [[3, 2], [12, 2], [21, 2], [4, 11], [14, 11]];
  const nests = [];
  function buildNests() {
    const membrane = new THREE.MeshStandardMaterial({ color: 0x655b26, emissive: 0x3d2608, emissiveIntensity: 0.8, roughness: 0.74 });
    const sore = new THREE.MeshStandardMaterial({ color: 0x74231b, emissive: 0x3d0906, emissiveIntensity: 1.2, roughness: 0.65 });
    const fibre = new THREE.MeshStandardMaterial({ color: 0x2d2b14, emissive: 0x0d0a02, emissiveIntensity: 0.4, roughness: 1 });
    nestDefs.forEach(([cx, cz], index) => {
      const world = worldFromCell(cx, cz);
      const group = new THREE.Group();
      group.position.set(world.x, 0.06, world.z);
      for (let i = 0; i < 7; i += 1) {
        const angle = (i / 7) * TAU + index;
        const tendril = new THREE.Mesh(new THREE.TorusGeometry(0.75 + (i % 3) * 0.19, 0.055, 5, 20, Math.PI * 1.2), fibre);
        tendril.rotation.x = Math.PI / 2;
        tendril.rotation.z = angle;
        tendril.position.set(Math.cos(angle) * 0.35, 0.03, Math.sin(angle) * 0.35);
        group.add(tendril);
      }
      for (let i = 0; i < 8; i += 1) {
        const egg = new THREE.Mesh(new THREE.SphereGeometry(0.2 + (i % 3) * 0.07, 7, 5), i % 3 === 0 ? sore : membrane);
        const angle = (i / 8) * TAU + index * 0.7;
        egg.scale.y = 1.7 + (i % 2) * 0.35;
        egg.position.set(Math.cos(angle) * (0.28 + (i % 3) * 0.19), 0.25 + (i % 2) * 0.16, Math.sin(angle) * (0.28 + (i % 3) * 0.19));
        group.add(egg);
      }
      const core = new THREE.PointLight(0xc48e35, 0.55, 4.5, 2.5);
      core.position.y = 0.5;
      group.add(core);
      scene.add(group);
      nests.push({ index, group, x: world.x, z: world.z, active: true, core, phase: index * 1.7 });
    });
  }

  function buildBertranda() {
    const root = new THREE.Group();
    const shell = new THREE.MeshStandardMaterial({ color: 0x3f3b1c, roughness: 0.55, metalness: 0.13, flatShading: true });
    const shellLight = new THREE.MeshStandardMaterial({ color: 0x756a32, roughness: 0.66, metalness: 0.08, flatShading: true });
    const flesh = new THREE.MeshStandardMaterial({ color: 0x5b1814, emissive: 0x230403, emissiveIntensity: 0.65, roughness: 0.9, flatShading: true });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x2c1211, roughness: 1, side: THREE.DoubleSide, flatShading: true });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffe08a, emissive: 0xd06422, emissiveIntensity: 2.8, roughness: 0.25 });

    const abdomen = new THREE.Mesh(new THREE.SphereGeometry(0.82, 9, 7), shell);
    abdomen.scale.set(0.86, 1.48, 0.72);
    abdomen.position.y = 1.62;
    root.add(abdomen);
    const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.76, 8, 6), shellLight);
    thorax.scale.set(1.02, 1.12, 0.74);
    thorax.position.y = 2.72;
    root.add(thorax);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 8, 6), shell);
    head.scale.set(1, 0.83, 0.8);
    head.position.set(0, 3.53, -0.18);
    root.add(head);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.45, 0.53, 7), flesh);
    neck.position.y = 3.12;
    root.add(neck);
    const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.88, 1.25, 7, 1, true), cloth);
    skirt.position.y = 1.05;
    skirt.rotation.y = 0.2;
    root.add(skirt);

    [-1, 1].forEach((side) => {
      [0, 1, 2].forEach((pair) => {
        const pivot = new THREE.Group();
        pivot.position.set(side * (0.52 + pair * 0.06), 2.75 - pair * 0.58, 0);
        const knee = new THREE.Vector3(side * (0.95 + pair * 0.18), -0.22 - pair * 0.04, (pair - 1) * 0.28);
        const foot = new THREE.Vector3(side * (1.58 + pair * 0.2), -0.72 - pair * 0.12, (pair - 1) * 0.62);
        cylinderBetween(new THREE.Vector3(0, 0, 0), knee, 0.105, shellLight, pivot);
        cylinderBetween(knee, foot, 0.075, shell, pivot);
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.38, 5), shell);
        claw.position.copy(foot);
        claw.rotation.z = side * Math.PI / 2;
        pivot.add(claw);
        root.add(pivot);
        animatedProps.push({ type: "leg", object: pivot, side, pair });
      });
    });

    [-1, 1].forEach((side) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.105, 7, 5), eyeMat);
      eye.position.set(side * 0.23, 3.61, -0.61);
      root.add(eye);
      const upperEye = eye.clone();
      upperEye.scale.setScalar(0.72);
      upperEye.position.set(side * 0.32, 3.79, -0.48);
      root.add(upperEye);
      const mandible = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.62, 5), shellLight);
      mandible.position.set(side * 0.23, 3.25, -0.63);
      mandible.rotation.z = side * 0.7;
      mandible.rotation.x = -0.38;
      root.add(mandible);
    });

    [-1, 1].forEach((side) => {
      const antenna = new THREE.Group();
      antenna.position.set(side * 0.22, 3.87, -0.33);
      cylinderBetween(new THREE.Vector3(0, 0, 0), new THREE.Vector3(side * 0.28, 0.52, -0.25), 0.035, shellLight, antenna);
      cylinderBetween(new THREE.Vector3(side * 0.28, 0.52, -0.25), new THREE.Vector3(side * 0.58, 1.13, -0.5), 0.024, shellLight, antenna);
      root.add(antenna);
      animatedProps.push({ type: "antenna", object: antenna, side });
    });

    root.visible = false;
    root.scale.setScalar(0.92);
    scene.add(root);
    return root;
  }

  const enemy = {
    model: null,
    x: 0,
    z: 0,
    active: false,
    mode: "dormant",
    path: [],
    pathIndex: 0,
    repath: 0,
    huntTime: 0,
    lastKnown: null,
    patrol: null,
    gait: 0,
    distance: 999,
    alertShown: false
  };

  function resetEnemy() {
    const spawn = worldFromCell(21, 6);
    enemy.x = spawn.x;
    enemy.z = spawn.z;
    enemy.active = false;
    enemy.mode = "dormant";
    enemy.path = [];
    enemy.pathIndex = 0;
    enemy.repath = 0;
    enemy.huntTime = 0;
    enemy.lastKnown = null;
    enemy.patrol = null;
    enemy.gait = 0;
    enemy.distance = 999;
    enemy.alertShown = false;
    if (enemy.model) {
      enemy.model.position.set(enemy.x, 0, enemy.z);
      enemy.model.visible = false;
    }
  }

  function findPath(start, goal) {
    if (!isWalkableCell(goal.x, goal.z)) return [];
    const key = (x, z) => z * MAP_W + x;
    const startKey = key(start.x, start.z);
    const goalKey = key(goal.x, goal.z);
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
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dz]) => {
        const x = current.x + dx;
        const z = current.z + dz;
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
          } else open.push({ x, z, g: nextCost, f: nextCost + h });
        }
      });
    }
    return [];
  }

  function lineOfSight(ax, az, bx, bz) {
    const distance = Math.hypot(bx - ax, bz - az);
    const steps = Math.ceil(distance / 0.38);
    for (let i = 1; i < steps; i += 1) {
      const t = i / steps;
      const cell = cellFromWorld(lerp(ax, bx, t), lerp(az, bz, t));
      if (!isWalkableCell(cell.x, cell.z)) return false;
    }
    return true;
  }

  function choosePatrol() {
    const current = cellFromWorld(enemy.x, enemy.z);
    let choice = floorCells[Math.floor(Math.random() * floorCells.length)];
    for (let tries = 0; tries < 20; tries += 1) {
      const candidate = floorCells[Math.floor(Math.random() * floorCells.length)];
      if (Math.abs(candidate.x - current.x) + Math.abs(candidate.z - current.z) > 7) {
        choice = candidate;
        break;
      }
    }
    enemy.patrol = choice;
  }

  function wakeEnemy() {
    if (enemy.active) return;
    enemy.active = true;
    enemy.mode = "patrol";
    enemy.model.visible = true;
    choosePatrol();
    showCaption("That was not the house settling.", 4.4);
    audio.alert();
  }

  function updateEnemy(dt) {
    if (!enemy.active || !enemy.model) return;
    const dxPlayer = player.x - enemy.x;
    const dzPlayer = player.z - enemy.z;
    const distance = Math.hypot(dxPlayer, dzPlayer);
    enemy.distance = distance;

    const difficultySense = settings.difficulty === "quiet" ? 0.78 : settings.difficulty === "nightmare" ? 1.24 : 1;
    const visualRange = 18 * difficultySense;
    const heard = player.moving && distance < (player.running ? 18 : 7.2) * difficultySense;
    const seen = !player.hidden && distance < visualRange && lineOfSight(enemy.x, enemy.z, player.x, player.z);

    if (seen || heard) {
      if (enemy.mode !== "hunt") {
        dangerUntil = elapsed + 2.2;
        ui.danger.textContent = heard && !seen ? "SHE HEARD THAT" : "SHE CAN SEE YOU";
        audio.alert();
      }
      enemy.mode = "hunt";
      enemy.huntTime = 6.5 + sealedCount * 0.65;
      enemy.lastKnown = { x: player.x, z: player.z };
    } else if (enemy.mode === "hunt") {
      enemy.huntTime -= dt;
      if (!player.hidden) enemy.lastKnown = { x: player.x, z: player.z };
      if (enemy.huntTime <= 0) {
        enemy.mode = "patrol";
        choosePatrol();
      }
    }

    enemy.repath -= dt;
    if (enemy.repath <= 0 || enemy.pathIndex >= enemy.path.length) {
      enemy.repath = enemy.mode === "hunt" ? 0.34 : 0.82;
      const start = cellFromWorld(enemy.x, enemy.z);
      let target;
      if (enemy.mode === "hunt" && enemy.lastKnown) target = cellFromWorld(enemy.lastKnown.x, enemy.lastKnown.z);
      else {
        if (!enemy.patrol) choosePatrol();
        target = enemy.patrol;
      }
      enemy.path = findPath(start, target);
      enemy.pathIndex = 0;
      if (enemy.mode === "patrol" && enemy.path.length === 0) choosePatrol();
    }

    let target = enemy.path[enemy.pathIndex];
    if (target) {
      let dx = target.x - enemy.x;
      let dz = target.z - enemy.z;
      let length = Math.hypot(dx, dz);
      if (length < 0.2) {
        enemy.pathIndex += 1;
        target = enemy.path[enemy.pathIndex];
        if (target) {
          dx = target.x - enemy.x;
          dz = target.z - enemy.z;
          length = Math.hypot(dx, dz);
        }
      }
      if (target && length > 0.001) {
        const baseSpeed = settings.difficulty === "quiet" ? 2.05 : settings.difficulty === "nightmare" ? 2.85 : 2.45;
        const speed = baseSpeed + sealedCount * 0.17 + (enemy.mode === "hunt" ? 1.02 : 0);
        const step = Math.min(length, speed * dt);
        enemy.x += (dx / length) * step;
        enemy.z += (dz / length) * step;
        const targetRotation = Math.atan2(dx, dz);
        let delta = ((targetRotation - enemy.model.rotation.y + Math.PI) % TAU) - Math.PI;
        enemy.model.rotation.y += delta * Math.min(1, dt * 8);
        enemy.gait += dt * speed * 3.1;
      }
    } else if (enemy.mode === "patrol") choosePatrol();

    enemy.model.position.set(enemy.x, 0.02 + Math.abs(Math.sin(enemy.gait)) * 0.06, enemy.z);
    animatedProps.forEach((part) => {
      if (part.type === "leg") {
        part.object.rotation.z = part.side * (0.18 + Math.sin(enemy.gait + part.pair * 1.85 + (part.side > 0 ? Math.PI : 0)) * 0.26);
        part.object.rotation.y = Math.sin(enemy.gait * 0.68 + part.pair) * 0.13;
      } else if (part.type === "antenna") {
        part.object.rotation.z = part.side * (0.11 + Math.sin(elapsed * 3.3 + part.side) * 0.08);
      }
    });

    if (!player.hidden && distance < 1.22) killPlayer();
  }

  function circleFree(x, z, radius = 0.38) {
    const samples = [[0, 0], [radius, 0], [-radius, 0], [0, radius], [0, -radius], [radius * 0.72, radius * 0.72], [-radius * 0.72, radius * 0.72], [radius * 0.72, -radius * 0.72], [-radius * 0.72, -radius * 0.72]];
    if (samples.some(([ox, oz]) => {
      const cell = cellFromWorld(x + ox, z + oz);
      return !isWalkableCell(cell.x, cell.z);
    })) return false;
    return !propColliders.some((box) => x + radius > box.x1 && x - radius < box.x2 && z + radius > box.z1 && z - radius < box.z2);
  }

  function updatePlayer(dt) {
    if (player.hidden) {
      player.moving = false;
      player.running = false;
      camera.position.set(player.x, 1.52, player.z);
      camera.rotation.set(player.pitch, player.yaw, 0, "YXZ");
      return;
    }

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
    player.running = wantsRun && movementLength > 0.15 && player.stamina > 1;
    const speed = player.running ? 5.2 : 3.0;
    if (player.running) player.stamina = Math.max(0, player.stamina - dt * 18);
    else player.stamina = Math.min(100, player.stamina + dt * 12);
    const forwardX = Math.sin(player.yaw);
    const forwardZ = -Math.cos(player.yaw);
    const rightX = Math.cos(player.yaw);
    const rightZ = Math.sin(player.yaw);
    const dx = (forwardX * moveY + rightX * moveX) * speed * dt;
    const dz = (forwardZ * moveY + rightZ * moveX) * speed * dt;
    if (circleFree(player.x + dx, player.z)) player.x += dx;
    if (circleFree(player.x, player.z + dz)) player.z += dz;
    player.moving = movementLength > 0.08 && (Math.abs(dx) + Math.abs(dz) > 0.0001);

    if (player.moving) {
      player.bob += dt * (player.running ? 10.2 : 6.6);
      player.bobAmount = lerp(player.bobAmount, player.running ? 1 : 0.62, dt * 8);
      const phase = Math.floor(player.bob / Math.PI);
      if (phase !== player.lastStepPhase) {
        player.lastStepPhase = phase;
        audio.step(player.running);
      }
    } else player.bobAmount = lerp(player.bobAmount, 0, dt * 7);

    const lookSpeed = 0.0022;
    player.yaw -= controls.lookDX * lookSpeed;
    player.pitch = clamp(player.pitch - controls.lookDY * lookSpeed, -1.12, 1.12);
    controls.lookDX = 0;
    controls.lookDY = 0;

    const bobY = Math.abs(Math.sin(player.bob)) * 0.07 * player.bobAmount;
    const sway = Math.sin(player.bob * 0.5) * 0.018 * player.bobAmount;
    camera.position.set(player.x, player.height + bobY, player.z);
    camera.rotation.set(player.pitch, player.yaw, sway, "YXZ");

    if (player.torch && player.battery > 0) {
      player.battery = Math.max(0, player.battery - dt * (enemy.mode === "hunt" ? 0.17 : 0.105));
      if (player.battery <= 0) {
        player.torch = false;
        showCaption("The torch is dead.", 3);
      }
    }
  }

  let flashlight;
  let flashlightHalo;
  function buildFlashlight() {
    flashlight = new THREE.SpotLight(0xf2daa0, 2.25, 28, Math.PI / 6.3, 0.62, 1.35);
    flashlight.position.set(0.12, -0.07, 0.05);
    flashlight.target.position.set(0, -0.05, -2);
    camera.add(flashlight, flashlight.target);
    flashlightHalo = new THREE.PointLight(0xe1c58f, 0.22, 5, 2);
    flashlightHalo.position.set(0, 0, -0.25);
    camera.add(flashlightHalo);
  }

  function toggleTorch() {
    if (gameState !== "playing" || player.battery <= 0) return;
    player.torch = !player.torch;
    audio.tone(player.torch ? 540 : 260, 0.07, 0.055, "square", player.torch ? 60 : -40);
    ui.touchTorch.classList.toggle("pressed", player.torch);
  }

  let sealedCount = 0;
  let holdProgress = 0;
  let currentInteraction = null;
  let detectorTimer = 0;
  let heartbeatTimer = 0;

  function forwardDot(targetX, targetZ) {
    const dx = targetX - player.x;
    const dz = targetZ - player.z;
    const length = Math.hypot(dx, dz) || 1;
    return (dx / length) * Math.sin(player.yaw) + (dz / length) * -Math.cos(player.yaw);
  }

  function interactionAtPlayer() {
    if (player.hidden) return { type: "leave-hide", object: player.hiddenAt, distance: 0 };
    let best = null;
    nests.forEach((nest) => {
      if (!nest.active) return;
      const distance = Math.hypot(nest.x - player.x, nest.z - player.z);
      if (distance < 2.35 && forwardDot(nest.x, nest.z) > -0.08 && (!best || distance < best.distance)) best = { type: "nest", object: nest, distance };
    });
    wardrobes.forEach((wardrobe) => {
      const distance = Math.hypot(wardrobe.x - player.x, wardrobe.z - player.z);
      if (distance < 2.55 && forwardDot(wardrobe.x, wardrobe.z) > 0.02 && (!best || distance < best.distance)) best = { type: "hide", object: wardrobe, distance };
    });
    const exitDistance = Math.hypot(exitDoor.x - player.x, exitDoor.z - player.z);
    if (exitDistance < 2.65 && forwardDot(exitDoor.x, exitDoor.z) > -0.25 && (!best || exitDistance < best.distance)) best = { type: "exit", object: exitDoor, distance: exitDistance };
    return best;
  }

  function interactionLabel(interaction) {
    if (!interaction) return "";
    const key = IS_TOUCH ? "HOLD" : "HOLD E";
    if (interaction.type === "nest") return `${key} — CAUTERISE MOULT`;
    if (interaction.type === "hide") return `${IS_TOUCH ? "TAP" : "E"} — HIDE INSIDE`;
    if (interaction.type === "leave-hide") return `${IS_TOUCH ? "TAP" : "E"} — LEAVE WARDROBE`;
    if (interaction.type === "exit") return exitDoor.unlocked ? `${IS_TOUCH ? "TAP" : "E"} — OPEN FRONT DOOR` : "THE DOOR IS SEALED BY FIVE MARKS";
    return "";
  }

  function hideIn(wardrobe) {
    player.hideReturn = { x: player.x, z: player.z, yaw: player.yaw };
    player.hidden = true;
    player.hiddenAt = wardrobe;
    player.x = wardrobe.x - wardrobe.front.x * 0.25;
    player.z = wardrobe.z - wardrobe.front.z * 0.25;
    player.yaw = Math.atan2(wardrobe.front.x, -wardrobe.front.z) + Math.PI;
    player.pitch = 0;
    showCaption("Breathe through your mouth. Quietly.", 3.4);
    ui.host.style.filter = "brightness(.36) sepia(.2)";
    audio.noise(0.23, 0.07, 170);
  }

  function leaveHide() {
    if (!player.hideReturn) return;
    player.x = player.hideReturn.x;
    player.z = player.hideReturn.z;
    player.yaw = player.hideReturn.yaw;
    player.hidden = false;
    player.hiddenAt = null;
    player.hideReturn = null;
    ui.host.style.filter = "";
    audio.noise(0.18, 0.05, 220);
  }

  function sealNest(nest) {
    if (!nest.active) return;
    nest.active = false;
    nest.group.visible = false;
    sealedCount += 1;
    holdProgress = 0;
    audio.seal();
    const scorch = new THREE.Mesh(new THREE.RingGeometry(0.22, 0.98, 17), new THREE.MeshBasicMaterial({ color: 0x39100d, side: THREE.DoubleSide, transparent: true, opacity: 0.82 }));
    scorch.rotation.x = -Math.PI / 2;
    scorch.position.set(nest.x, 0.025, nest.z);
    scene.add(scorch);
    if (sealedCount === 1) {
      wakeEnemy();
      showCaption("Something unfolded upstairs. Bertranda is awake.", 5);
    } else if (sealedCount < nests.length) {
      const lines = ["The walls answer with six careful footsteps.", "A shell drags across the corridor.", "She is learning the shortest path to you.", "Only one nest remains. She knows."];
      showCaption(lines[sealedCount - 2] || "Keep moving.", 4.1);
    }
    if (sealedCount >= nests.length) unlockExit();
    updateObjective();
  }

  function unlockExit() {
    exitDoor.unlocked = true;
    exitDoor.door.material.color.setHex(0x354126);
    exitDoor.seal.material.color.setHex(0xb8c668);
    exitDoor.seal.material.emissive.setHex(0x53621d);
    exitDoor.seal.material.emissiveIntensity = 1.4;
    showCaption("Five marks broken. The front door is open.", 5);
    audio.tone(220, 1.2, 0.1, "sine", 440);
  }

  function updateInteraction(dt) {
    currentInteraction = interactionAtPlayer();
    const label = interactionLabel(currentInteraction);
    ui.prompt.textContent = label;
    ui.prompt.classList.toggle("visible", Boolean(label));
    ui.touchAction.textContent = currentInteraction?.type === "hide" || currentInteraction?.type === "leave-hide" || currentInteraction?.type === "exit" ? "USE" : "HOLD";

    if (currentInteraction?.type === "nest" && controls.action) {
      holdProgress += dt / (settings.difficulty === "nightmare" ? 1.95 : 1.55);
      ui.holdWrap.classList.add("visible");
      ui.holdFill.style.width = `${Math.min(100, holdProgress * 100)}%`;
      if (holdProgress >= 1) sealNest(currentInteraction.object);
    } else {
      holdProgress = Math.max(0, holdProgress - dt * 2.4);
      ui.holdWrap.classList.toggle("visible", holdProgress > 0.01);
      ui.holdFill.style.width = `${holdProgress * 100}%`;
    }

    if (controls.justAction) {
      controls.justAction = false;
      if (currentInteraction?.type === "hide") hideIn(currentInteraction.object);
      else if (currentInteraction?.type === "leave-hide") leaveHide();
      else if (currentInteraction?.type === "exit" && exitDoor.unlocked) winGame();
      else if (currentInteraction?.type === "exit") {
        audio.tone(105, 0.16, 0.07, "square", -25);
        showCaption(`${nests.length - sealedCount} mark${nests.length - sealedCount === 1 ? "" : "s"} still bind the door.`, 2.8);
      }
    }
  }

  function updateDetector(dt) {
    const active = nests.filter((nest) => nest.active);
    let nearest = Infinity;
    active.forEach((nest) => { nearest = Math.min(nearest, Math.hypot(nest.x - player.x, nest.z - player.z)); });
    if (!active.length) {
      ui.range.textContent = "FRONT DOOR";
      ui.bars.forEach((bar) => bar.classList.add("on"));
      return;
    }
    const strength = clamp(1 - nearest / 34, 0, 1);
    const level = nearest < 5 ? 5 : nearest < 10 ? 4 : nearest < 17 ? 3 : nearest < 25 ? 2 : nearest < 34 ? 1 : 0;
    ui.bars.forEach((bar, index) => bar.classList.toggle("on", index < level));
    ui.range.textContent = nearest < 5 ? "CRITICAL" : nearest < 10 ? "VERY CLOSE" : nearest < 17 ? "NEAR" : nearest < 25 ? "TRACE" : "SEARCHING";
    detectorTimer -= dt;
    if (detectorTimer <= 0) {
      detectorTimer = lerp(2.45, 0.22, strength * strength);
      audio.detector(strength);
    }
  }

  function updateObjective() {
    ui.nestCount.textContent = `${sealedCount} / ${nests.length} SEALED`;
    ui.objective.textContent = sealedCount < nests.length ? `Find and cauterise moulting nest ${sealedCount + 1}` : "Reach the front door and escape";
  }

  function updateHud(dt) {
    ui.battery.style.transform = `scaleX(${player.battery / 100})`;
    ui.batteryText.textContent = `${Math.ceil(player.battery)}%`;
    const dangerous = elapsed < dangerUntil || (enemy.mode === "hunt" && enemy.distance < 12);
    ui.danger.classList.toggle("visible", dangerous);
    if (enemy.mode === "hunt" && enemy.distance < 12 && elapsed >= dangerUntil) ui.danger.textContent = "DON'T LET HER SEE YOU";

    if (enemy.active) {
      const intensity = clamp(1 - enemy.distance / 18, 0, 1);
      heartbeatTimer -= dt;
      if (intensity > 0.13 && heartbeatTimer <= 0) {
        heartbeatTimer = lerp(1.65, 0.42, intensity);
        audio.heartbeat(intensity);
      }
      if (audio.droneGain && audio.context) audio.droneGain.gain.setTargetAtTime(0.032 + intensity * 0.055, audio.context.currentTime, 0.1);
    }

    if (elapsed > captionUntil) ui.caption.classList.remove("visible");
  }

  function showCaption(text, seconds = 3.2) {
    ui.caption.textContent = text;
    ui.caption.classList.add("visible");
    captionUntil = elapsed + seconds;
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  function killPlayer() {
    if (gameState !== "playing") return;
    gameState = "dying";
    controls.action = false;
    if (document.pointerLockElement) document.exitPointerLock();
    ui.scare.classList.remove("visible");
    void ui.scare.offsetWidth;
    ui.scare.classList.add("visible");
    audio.scare();
    setTimeout(() => setState("dead"), 760);
  }

  function winGame() {
    if (gameState !== "playing") return;
    if (document.pointerLockElement) document.exitPointerLock();
    let best = null;
    try {
      const previous = Number(localStorage.getItem("bertranda-best"));
      if (Number.isFinite(previous) && previous > 0) best = previous;
      if (!best || elapsed < best) {
        localStorage.setItem("bertranda-best", String(elapsed));
        best = elapsed;
      }
    } catch (_) {}
    ui.finalTime.textContent = formatTime(elapsed);
    ui.winCopy.textContent = best && elapsed <= best + 0.01
      ? "The nests are ash. You set a new escape record, but beneath the floor Bertranda is already learning to moult again."
      : `The nests are ash. Your best escape is ${formatTime(best || elapsed)}. Beneath the floor, Bertranda is learning to moult again.`;
    audio.tone(150, 1.1, 0.12, "sine", 310);
    setState("won");
  }

  function resetGame() {
    elapsed = 0;
    sealedCount = 0;
    holdProgress = 0;
    detectorTimer = 0;
    heartbeatTimer = 0;
    captionUntil = 0;
    dangerUntil = 0;
    controls.keys.clear();
    controls.moveX = 0;
    controls.moveY = 0;
    controls.action = false;
    controls.justAction = false;
    controls.runTouch = false;
    setPlayerSpawn();
    nests.forEach((nest) => {
      nest.active = true;
      nest.group.visible = true;
    });
    resetEnemy();
    exitDoor.unlocked = false;
    exitDoor.door.material.color.setHex(0x24160f);
    exitDoor.seal.material.color.setHex(0x8c2a20);
    exitDoor.seal.material.emissive.setHex(0x260604);
    exitDoor.seal.material.emissiveIntensity = 0.4;
    ui.host.style.filter = "";
    ui.touchTorch.classList.add("pressed");
    updateObjective();
  }

  function setState(next) {
    gameState = next;
    ui.title.classList.toggle("is-visible", next === "title");
    ui.title.hidden = next !== "title";
    ui.pause.classList.toggle("is-visible", next === "paused");
    ui.pause.hidden = next !== "paused";
    ui.death.classList.toggle("is-visible", next === "dead");
    ui.death.hidden = next !== "dead";
    ui.win.classList.toggle("is-visible", next === "won");
    ui.win.hidden = next !== "won";
    const inGame = next === "playing" || next === "dying";
    ui.hud.hidden = !inGame;
    ui.touch.hidden = !(next === "playing" && IS_TOUCH);
    if (next !== "playing") {
      controls.keys.clear();
      controls.action = false;
      controls.runTouch = false;
    }
    if (next === "playing") {
      pointerGrace = performance.now() + 900;
      if (!IS_TOUCH && renderer?.domElement.requestPointerLock) renderer.domElement.requestPointerLock();
    }
  }

  function startNight() {
    audio.start();
    resetGame();
    setState("playing");
    showCaption("Five nests. The needle grows brighter as you get close.", 5.2);
  }

  function pauseGame() {
    if (gameState !== "playing") return;
    if (document.pointerLockElement) document.exitPointerLock();
    setState("paused");
  }

  function resumeGame() {
    if (gameState !== "paused") return;
    audio.start();
    setState("playing");
  }

  function applyQuality() {
    if (!renderer) return;
    let ratio;
    if (settings.quality === "low") ratio = 0.7;
    else if (settings.quality === "high") ratio = Math.min(devicePixelRatio || 1, 1.65);
    else ratio = IS_TOUCH ? Math.min(devicePixelRatio || 1, 0.92) : Math.min(devicePixelRatio || 1, 1.25);
    renderer.setPixelRatio(ratio);
    renderer.setSize(innerWidth, innerHeight, false);
  }

  function resize() {
    if (!renderer || !camera) return;
    camera.aspect = innerWidth / Math.max(1, innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  }

  function bindControls() {
    window.addEventListener("keydown", (event) => {
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"].includes(event.code)) {
        controls.keys.add(event.code);
        event.preventDefault();
      }
      if (event.code === "KeyE" && gameState === "playing") {
        if (!controls.action) controls.justAction = true;
        controls.action = true;
      }
      if (event.code === "KeyF" && !event.repeat) toggleTorch();
      if (event.code === "Escape") {
        if (gameState === "playing") pauseGame();
        else if (gameState === "paused") resumeGame();
      }
    });
    window.addEventListener("keyup", (event) => {
      controls.keys.delete(event.code);
      if (event.code === "KeyE") controls.action = false;
    });
    window.addEventListener("blur", () => {
      controls.keys.clear();
      controls.action = false;
    });
    document.addEventListener("mousemove", (event) => {
      if (gameState === "playing" && document.pointerLockElement === renderer?.domElement) {
        controls.lookDX += event.movementX;
        controls.lookDY += event.movementY;
      }
    });
    document.addEventListener("pointerlockchange", () => {
      if (!IS_TOUCH && gameState === "playing" && document.pointerLockElement !== renderer?.domElement && performance.now() > pointerGrace) pauseGame();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && gameState === "playing") pauseGame();
    });
    renderer.domElement.addEventListener("click", () => {
      if (gameState === "playing" && !IS_TOUCH && document.pointerLockElement !== renderer.domElement) {
        pointerGrace = performance.now() + 500;
        renderer.domElement.requestPointerLock?.();
      }
    });

    let movePointer = null;
    const moveCenter = { x: 0, y: 0 };
    const endMove = (event) => {
      if (movePointer !== event.pointerId) return;
      movePointer = null;
      controls.moveX = 0;
      controls.moveY = 0;
      ui.moveKnob.style.transform = "";
      try { ui.movePad.releasePointerCapture(event.pointerId); } catch (_) {}
    };
    ui.movePad.addEventListener("pointerdown", (event) => {
      movePointer = event.pointerId;
      const rect = ui.movePad.getBoundingClientRect();
      moveCenter.x = rect.left + rect.width / 2;
      moveCenter.y = rect.top + rect.height / 2;
      ui.movePad.setPointerCapture(event.pointerId);
    });
    ui.movePad.addEventListener("pointermove", (event) => {
      if (movePointer !== event.pointerId) return;
      let dx = event.clientX - moveCenter.x;
      let dy = event.clientY - moveCenter.y;
      const distance = Math.hypot(dx, dy);
      const max = 38;
      if (distance > max) {
        dx = (dx / distance) * max;
        dy = (dy / distance) * max;
      }
      controls.moveX = dx / max;
      controls.moveY = -dy / max;
      ui.moveKnob.style.transform = `translate(${dx}px,${dy}px)`;
    });
    ui.movePad.addEventListener("pointerup", endMove);
    ui.movePad.addEventListener("pointercancel", endMove);

    let lookPointer = null;
    let lookLast = { x: 0, y: 0 };
    ui.lookPad.addEventListener("pointerdown", (event) => {
      lookPointer = event.pointerId;
      lookLast = { x: event.clientX, y: event.clientY };
      ui.lookPad.setPointerCapture(event.pointerId);
    });
    ui.lookPad.addEventListener("pointermove", (event) => {
      if (lookPointer !== event.pointerId) return;
      controls.lookDX += (event.clientX - lookLast.x) * 1.25;
      controls.lookDY += (event.clientY - lookLast.y) * 1.25;
      lookLast = { x: event.clientX, y: event.clientY };
    });
    const endLook = (event) => {
      if (lookPointer === event.pointerId) lookPointer = null;
    };
    ui.lookPad.addEventListener("pointerup", endLook);
    ui.lookPad.addEventListener("pointercancel", endLook);

    const bindHold = (element, onDown, onUp) => {
      element.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        element.setPointerCapture(event.pointerId);
        element.classList.add("pressed");
        onDown();
      });
      const finish = () => {
        element.classList.remove("pressed");
        onUp();
      };
      element.addEventListener("pointerup", finish);
      element.addEventListener("pointercancel", finish);
    };
    bindHold(ui.touchAction, () => {
      if (!controls.action) controls.justAction = true;
      controls.action = true;
    }, () => { controls.action = false; });
    bindHold(ui.touchRun, () => { controls.runTouch = true; }, () => { controls.runTouch = false; });
    ui.touchTorch.addEventListener("pointerdown", (event) => { event.preventDefault(); toggleTorch(); });
  }

  function animateWorld(dt) {
    flickerLights.forEach((entry, index) => {
      const noise = Math.sin(elapsed * (7.1 + index * 0.17) + entry.phase) * Math.sin(elapsed * 2.3 + index);
      const dropout = noise > 0.84 ? 0.17 : noise > 0.6 ? 0.68 : 1;
      entry.light.intensity = entry.base * dropout * (0.94 + Math.sin(elapsed * 1.7 + entry.phase) * 0.06);
    });
    nests.forEach((nest) => {
      if (!nest.active) return;
      const pulse = 0.92 + Math.sin(elapsed * 2.4 + nest.phase) * 0.08;
      nest.group.scale.setScalar(pulse);
      nest.group.rotation.y += dt * 0.07;
      nest.core.intensity = 0.45 + Math.sin(elapsed * 3 + nest.phase) * 0.18;
    });
    if (exitDoor) exitDoor.seal.rotation.z += dt * (exitDoor.unlocked ? 0.9 : 0.11);
    if (flashlight) {
      const flicker = player.battery < 18 && Math.sin(elapsed * 17) > 0.68 ? 0.08 : 1;
      flashlight.intensity = player.torch ? 2.25 * flicker : 0;
      flashlightHalo.intensity = player.torch ? 0.22 * flicker : 0;
    }
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, clock.getDelta());
    if (gameState === "playing") {
      elapsed += dt;
      updatePlayer(dt);
      updateInteraction(dt);
      updateDetector(dt);
      updateEnemy(dt);
      updateHud(dt);
    }
    animateWorld(dt);
    renderer.render(scene, camera);
  }

  function init() {
    if (!window.THREE) throw new Error("Three.js did not load");
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance", stencil: false });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.setClearColor(0x030403, 1);
    ui.host.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050706);
    scene.fog = new THREE.FogExp2(0x080a07, 0.037);
    camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.07, 70);
    camera.rotation.order = "YXZ";
    scene.add(camera);
    const ambient = new THREE.HemisphereLight(0x6e7655, 0x17130e, 0.23);
    scene.add(ambient);
    const moon = new THREE.DirectionalLight(0x8ca4a2, 0.18);
    moon.position.set(-20, 25, -15);
    scene.add(moon);
    clock = new THREE.Clock();

    buildHouse();
    buildNests();
    enemy.model = buildBertranda();
    buildFlashlight();
    setPlayerSpawn();
    resetEnemy();
    camera.position.set(player.x, player.height, player.z);
    camera.rotation.set(0, player.yaw, 0);
    bindControls();
    applyQuality();
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", () => setTimeout(resize, 250));
    ui.start.disabled = false;
    ui.loading.classList.add("is-done");
    setTimeout(() => { ui.loading.hidden = true; }, 550);
    loop();
  }

  ui.start.addEventListener("click", startNight);
  ui.pauseButton.addEventListener("click", pauseGame);
  ui.resume.addEventListener("click", resumeGame);
  ui.restart.addEventListener("click", startNight);
  ui.retry.addEventListener("click", startNight);
  ui.again.addEventListener("click", startNight);

  try {
    init();
  } catch (error) {
    console.error(error);
    ui.loading.innerHTML = "<strong>THE HOUSE COULD NOT OPEN</strong><small>This browser needs WebGL enabled. Try an updated Chrome, Edge, Firefox or Safari.</small>";
  }

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(raf);
    try { portraitTexture?.dispose(); } catch (_) {}
  });
})();
