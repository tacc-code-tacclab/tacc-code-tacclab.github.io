const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Three = require('../../lovecraft/three.min.js');

// Real scene geometry and production game functions, with only browser I/O
// replaced. No test hooks, cheats or automation flags ship in the game itself.
function harness({ touch = true, width = 844, height = 390 } = {}) {
  class Element {
    constructor() {
      this.listeners = {};
      this.hidden = false;
      this.dataset = {};
      this.style = { setProperty() {} };
      const classes = new Set();
      this.classList = {
        add: (...names) => names.forEach(n => classes.add(n)),
        remove: (...names) => names.forEach(n => classes.delete(n)),
        contains: n => classes.has(n),
        toggle: (n, on = !classes.has(n)) => on ? classes.add(n) : classes.delete(n)
      };
    }
    addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); }
    emit(name, event = {}) { for (const callback of this.listeners[name] || []) callback({ preventDefault() {}, ...event }); }
    setAttribute() {}
    appendChild() {}
    setPointerCapture() {}
    getBoundingClientRect() { return { left: 0, top: 0, width: 126, height: 126 }; }
    getContext() { return new Proxy({}, { get: () => () => {} }); }
  }
  const elements = new Map();
  const document = new Element();
  document.hidden = false;
  document.body = new Element();
  document.documentElement = new Element();
  document.querySelector = id => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  document.querySelectorAll = () => [];
  document.createElement = () => new Element();
  document.exitPointerLock = () => { document.pointerLockElement = null; document.emit('pointerlockchange'); };
  const timers = [];
  const raf = new Map();
  let nextFrame = 0;
  class Renderer {
    constructor() {
      this.domElement = new Element();
      this.capabilities = { getMaxAnisotropy: () => 4 };
      this.renders = 0;
      this.resizes = 0;
    }
    setSize(w, h) { this.width = w; this.height = h; this.resizes++; }
    setPixelRatio(ratio) { this.ratio = ratio; }
    render(scene) { scene.updateMatrixWorld(true); this.renders++; }
  }
  const context = {
    console, document, navigator: { maxTouchPoints: touch ? 5 : 0 },
    BertrandaWorld: require('../world.js'),
    BertrandaExpedition: require('../expedition.js'),
    matchMedia: () => ({ matches: touch }),
    innerWidth: width, innerHeight: height, devicePixelRatio: 3,
    screen: { orientation: new Element() },
    THREE: { ...Three, WebGLRenderer: Renderer,
      TextureLoader: class { load() { return new Three.Texture(); } },
      Clock: class { constructor() { this.delta = 1 / 60; } getDelta() { return this.delta; } }
    },
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
    requestAnimationFrame: fn => { raf.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame: id => raf.delete(id)
  };
  const windowEvents = new Element();
  context.addEventListener = windowEvents.addEventListener.bind(windowEvents);
  context.window = context;
  context.window.emit = windowEvents.emit.bind(windowEvents);
  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
  const instrumented = source.replace('  init();\n})();', `
    window.gameTest = {
      startGame, pauseGame, resumeGame, requestLandscape, updateOrientation,
      animate, onResize, applyQuality, updatePerformance, findPath, moveCreature,
      worldFromCell, cellFromWorld, isWalkableCell, floorCells, navigation,
      explosionAt, impactAt, spawnHealth, spawnBurst, updateEffects, createTracer,
      effectiveEnemyCap, beginNextSchema, killBoss, stageInfo,
      spawnCreature, updateEnemies, currentFaceTexture, CREATURES,
      goldenBullet, placeGoldenBullet, updateGoldenBullet, bossExposed,
      fireWeapon, damageCreature, updateHud, toggleMap, updateExpeditionHud,
      updatePlayer, updateWeapon, updateTouchAim, shouldAutoFire, findAimAssistTarget, touchAssist,
      get scoutMap() { return scoutMap; }, get camera() { return camera; },
      get world() { return world; },
      controls, player, weapon, boss, settings, performanceState, effects, enemies,
      get state() { return gameState; }, get elapsed() { return elapsed; },
      get schema() { return schema; }, get renderer() { return renderer; },
      get clock() { return clock; }, get scene() { return scene; }
    };
    init();
  })();`);
  assert.notEqual(instrumented, source, 'test instrumentation anchor exists');
  vm.runInContext(instrumented, context);
  return { game: context.gameTest, context, document, timers, raf,
    el: id => document.querySelector('#' + id),
    visibleLights: () => {
      let lights = 0;
      context.gameTest.scene.traverseVisible(o => { if (o.isPointLight) lights++; });
      return lights;
    }
  };
}

test('mobile blur and pointer-lock changes do not open the pause menu; manual pause works', () => {
  const h = harness(); const g = h.game; g.startGame();
  g.controls.fire = true; g.controls.moveX = 1; g.controls.runTouch = true;
  h.context.emit('blur');
  assert.equal(g.state, 'playing');
  assert.equal(g.controls.fire, false); assert.equal(g.controls.moveX, 0); assert.equal(g.controls.runTouch, false);
  h.document.pointerLockElement = h.el('render-host'); h.document.emit('pointerlockchange');
  h.document.pointerLockElement = null; h.document.emit('pointerlockchange');
  assert.equal(g.state, 'playing');
  h.el('pause-button').emit('click'); assert.equal(g.state, 'paused');
  h.el('resume-button').emit('click'); assert.equal(g.state, 'playing');
});

test('hidden tabs freeze health/time/rendering and return without an unwanted pause', () => {
  const h = harness(); const g = h.game; g.startGame(); g.animate();
  const before = [g.elapsed, g.player.health, g.renderer.renders];
  h.document.hidden = true; h.document.emit('visibilitychange');
  g.clock.delta = 20; g.animate();
  assert.deepEqual([g.elapsed, g.player.health, g.renderer.renders], before);
  h.document.hidden = false; h.document.emit('visibilitychange'); g.clock.delta = 1 / 60; g.animate();
  assert.equal(g.state, 'playing'); assert.ok(g.elapsed > before[0]);
});

test('portrait safely blocks play, landscape resumes and optional orientation API failures are harmless', async () => {
  const h = harness({ width: 390, height: 844 }); const g = h.game;
  h.document.fullscreenEnabled = true;
  h.document.documentElement.requestFullscreen = async () => { throw Error('unsupported'); };
  h.context.screen.orientation.lock = async () => { throw Error('unsupported'); };
  g.startGame(); await g.requestLandscape();
  assert.equal(h.el('rotate-screen').hidden, false); assert.equal(h.el('touch-controls').hidden, true);
  g.animate(); assert.equal(g.elapsed, 0); assert.equal(g.state, 'playing');
  h.context.innerWidth = 844; h.context.innerHeight = 390; g.updateOrientation();
  assert.equal(h.el('rotate-screen').hidden, true); assert.equal(h.el('touch-controls').hidden, false);
  g.animate(); assert.ok(g.elapsed > 0);
  g.pauseGame(); assert.equal(h.el('rotate-screen').hidden, true);
});

test('touch holds have pointer ownership and lost capture clears movement, fire and sprint', () => {
  const h = harness(); const g = h.game; g.startGame();
  const fire = h.el('touch-fire');
  fire.emit('pointerdown', { pointerId: 1 }); assert.equal(g.controls.fire, true);
  fire.emit('pointerup', { pointerId: 2 }); assert.equal(g.controls.fire, true);
  fire.emit('lostpointercapture', { pointerId: 1 }); assert.equal(g.controls.fire, false);
  const move = h.el('move-pad');
  move.emit('pointerdown', { pointerId: 3, clientX: 63, clientY: 10 });
  assert.ok(g.controls.moveY > 0, 'up moves forward');
  move.emit('lostpointercapture', { pointerId: 3 }); assert.equal(g.controls.moveY, 0);
  h.el('touch-run').emit('pointerdown', { pointerId: 4 });
  h.context.emit('blur'); assert.equal(g.controls.runTouch, false);
  h.el('touch-run').emit('pointerdown', { pointerId: 5 }); assert.equal(g.controls.runTouch, true);
});

test('R/E keyboard and mobile reload/light buttons remain functional', () => {
  const h = harness(); const g = h.game; g.startGame(); g.weapon.ammo = 9;
  h.context.emit('keydown', { code: 'KeyR', key: 'r' }); assert.ok(g.weapon.reload > 0);
  h.context.emit('keydown', { code: 'KeyE', key: 'e' }); assert.equal(g.player.torch, false);
  h.el('touch-torch').emit('click'); assert.equal(g.player.torch, true);
  g.weapon.reload = 0; h.el('touch-reload').emit('click'); assert.ok(g.weapon.reload > 0);
});

test('shared navigation paths reach goals without crossing walls; exhausted paths respect cooldown', () => {
  const h = harness(); const g = h.game; g.startGame();
  assert.ok(g.floorCells.length > 100);
  for (const goal of [g.cellFromWorld(g.player.x, g.player.z)]) {
    for (const start of g.floorCells) {
      const route = g.findPath(start, goal);
      assert.ok(route.length > 0);
      let previous = start;
      for (const point of route) {
        const cell = g.cellFromWorld(point.x, point.z);
        assert.ok(g.isWalkableCell(cell.x, cell.z));
        assert.ok(Math.abs(cell.x - previous.x) + Math.abs(cell.z - previous.z) <= 1);
        previous = cell;
      }
      assert.deepEqual({ ...previous }, { ...goal });
    }
  }
  const creature = { repath: 0.5, path: [], pathIndex: 0, x: -1000, z: -1000 };
  g.moveCreature(creature, 0.016, 1); assert.equal(creature.repath, 0.484);
});

test('slow frames use real time in bounded steps; static pause does not redraw', () => {
  const h = harness(); const g = h.game; g.startGame();
  g.clock.delta = 0.05; g.animate(); assert.ok(Math.abs(g.elapsed - 0.05) < 0.00001);
  g.pauseGame(); g.animate(); const count = g.renderer.renders; g.animate();
  assert.equal(g.renderer.renders, count);
});

test('adaptive resolution keeps Deep selected and resizing is deduplicated', () => {
  const h = harness(); const g = h.game;
  const initial = g.renderer.ratio;
  for (let i = 0; i < 100; i++) g.updatePerformance(0.05);
  assert.ok(g.renderer.ratio < initial); assert.equal(g.settings.quality, 'deep');
  const count = g.renderer.resizes; g.applyQuality(); g.applyQuality();
  assert.equal(g.renderer.resizes, count);
  for (let i = 0; i < 2000; i++) g.updatePerformance(0.05);
  assert.ok(g.performanceState.scale >= 0.6);
});

test('explosions cap fragments without growing mobile light count or dropping projectile damage', () => {
  const h = harness(); const g = h.game; g.startGame();
  const lights = h.visibleLights(); const p = new Three.Vector3(0, 1, 0);
  for (let i = 0; i < 20; i++) { g.explosionAt(p, 1, 0xff55ff, false); g.spawnBurst(p, 0xff55ff); }
  g.spawnHealth(p);
  assert.equal(h.visibleLights(), lights);
  assert.ok(g.effects.filter(e => e.kind === 'fragment').length <= 64);
  let impacts = 0;
  g.createTracer(p, new Three.Vector3(0, 1, -4), () => impacts++);
  g.updateEffects(2); assert.equal(impacts, 1);
});

test('five corruption cycles progress past descent 25 with stable mobile budgets', () => {
  const h = harness(); const g = h.game; g.startGame(); const lights = h.visibleLights();
  const environments = new Set(); const cycles = new Set(); let lastHP = g.boss.hp;
  for (let schema = 1; schema <= 25; schema++) {
    assert.equal(g.schema, schema);
    environments.add(g.stageInfo().environment.kind); cycles.add(g.stageInfo().cycleIndex);
    assert.ok(g.effectiveEnemyCap() <= 12); assert.equal(h.visibleLights(), lights);
    if (schema < 25) { g.beginNextSchema(); assert.ok(g.boss.hp > lastHP); lastHP = g.boss.hp; }
  }
  assert.equal(environments.size, 5); assert.equal(cycles.size, 5);
  g.player.x = g.goldenBullet.x; g.player.z = g.goldenBullet.z; g.updateGoldenBullet(0.01);
  g.damageCreature(g.boss, g.boss.maxHp, new Three.Vector3(g.boss.x, 1, g.boss.z), true);
  g.goldenBullet.status = 'fired';
  g.damageCreature(g.boss, 26, new Three.Vector3(g.boss.x, 1, g.boss.z), true, true);
  assert.equal(g.state, 'transitioning');
  h.timers.findLast(t => t.ms === 1700).fn(); assert.equal(g.state, 'playing');
  assert.equal(g.schema, 26); assert.equal(g.stageInfo().environment.kind, 'house');
  assert.equal(g.stageInfo().cycleIndex, 4);
});

test('each creature uses its own face family; only Bertranda uses the woman', () => {
  const h = harness(); const g = h.game; g.startGame();
  const woman = g.currentFaceTexture('boss');
  for (const type of ['roach', 'bat', 'snake', 'spirit', 'demon']) {
    g.spawnCreature(type, true);
    const creature = g.enemies.at(-1);
    assert.equal(creature.type, type);
    assert.notEqual(creature.face.material.map, woman);
    assert.equal(creature.face.material.map, g.currentFaceTexture(type));
  }
  assert.notEqual(g.currentFaceTexture('roach'), g.currentFaceTexture('bat'));
  assert.notEqual(g.currentFaceTexture('bat'), g.currentFaceTexture('snake'));
  assert.notEqual(g.currentFaceTexture('roach'), g.currentFaceTexture('snake'));
});

test('the title-screen realm choice starts each biome with a valid spawn and native enemies', () => {
  const h = harness(); const g = h.game;
  for (let realm = 1; realm <= 5; realm++) {
    g.settings.realm = String(realm); g.startGame();
    assert.equal(g.schema, realm);
    assert.ok(g.world.free(g.player.x, g.player.z));
    assert.equal(g.world.schema, realm);
    assert.ok(g.enemies.length >= 4);
    assert.equal(g.world.chunks.size, 9);
    if (realm === 1) assert.ok(g.enemies.every(e => ['roach', 'bat', 'snake'].includes(e.type)));
    if (realm === 5) assert.ok(g.enemies.every(e => ['demon', 'bat', 'snake'].includes(e.type)));
  }
});

test('insects pursue the player at a tile edge and inflict small, rate-limited contact damage', () => {
  for (const type of ['roach', 'bat', 'snake']) {
    const h = harness(); const g = h.game; g.startGame(); g.settings.touchAuto = false;
    g.spawnCreature(type, true); const creature = g.enemies.at(-1);
    creature.x = 32.4; creature.z = 32.4; creature.attackCooldown = 0;
    g.player.x = 35.3; g.player.z = 35.3; g.player.health = 100;
    const startDistance = Math.hypot(creature.x - g.player.x, creature.z - g.player.z);
    g.clock.delta = 1 / 60;
    for (let i = 0; i < 100; i++) g.animate();
    assert.ok(g.player.health < 100, type + ' must hurt the player');
    assert.ok(g.player.health >= 90, 'contact is not instant death');
    assert.ok(Math.hypot(creature.x - g.player.x, creature.z - g.player.z) < startDistance);
    const health = g.player.health;
    g.updateEnemies(0.001); assert.equal(g.player.health, health, 'no repeated damage in the same frame');
  }
});

test('a wall prevents melee damage even when the enemy is close in world space', () => {
  const h = harness(); const g = h.game; g.startGame();
  let wall;
  for (let z = 0; z < 16 && !wall; z++) for (let x = 0; x < 16; x++) {
    if (!g.isWalkableCell(x, z)) { wall = { x, z }; break; }
  }
  assert.ok(wall);
  g.spawnCreature('roach', true); const enemy = g.enemies.at(-1);
  const p = g.worldFromCell(wall.x, wall.z);
  g.player.x = p.x; g.player.z = p.z; enemy.x = p.x + 0.6; enemy.z = p.z;
  enemy.attackCooldown = 0; enemy.repath = 1; g.player.health = 100;
  g.updateEnemies(0.01); assert.equal(g.player.health, 100);
});

test('desktop pointer unlock still pauses deliberately', () => {
  const h = harness({ touch: false, width: 1280, height: 800 }); h.game.startGame();
  h.document.pointerLockElement = h.el('render-host'); h.document.emit('pointerlockchange');
  h.document.pointerLockElement = null; h.document.emit('pointerlockchange');
  assert.equal(h.game.state, 'paused');
});

test('ordinary fire cannot clear a realm without its golden bullet, even at zero attempted HP', () => {
  const h = harness(); const g = h.game; g.startGame();
  const point = new Three.Vector3(g.boss.x, 1, g.boss.z);
  for (let i = 0; i < 5; i++) g.damageCreature(g.boss, 100000, point, true);
  g.killBoss();
  assert.equal(g.state, 'playing'); assert.equal(g.boss.alive, true);
  assert.equal(g.boss.hp, g.boss.maxHp * 0.2);
  assert.equal(g.goldenBullet.status, 'seeking');
  g.updateHud(); assert.match(h.el('boss-name').textContent, /GOLD REQUIRED/);
});

test('gold is collected by proximity once, heals a little and survives reloads and misses', () => {
  const h = harness(); const g = h.game; g.startGame();
  const original = g.goldenBullet.model;
  g.player.x = g.goldenBullet.x; g.player.z = g.goldenBullet.z; g.player.health = 60;
  g.updateGoldenBullet(0.01);
  assert.equal(g.goldenBullet.status, 'loaded'); assert.equal(g.player.health, 80);
  assert.equal(g.goldenBullet.model, null); assert.equal(original.parent, null);
  g.updateGoldenBullet(0.5); assert.equal(g.player.health, 80);
  g.weapon.ammo = 0; g.fireWeapon();
  assert.ok(g.weapon.reload > 0); assert.equal(g.goldenBullet.status, 'loaded');
  g.weapon.ammo = 32; g.weapon.reload = 0;
  g.boss.alive = false; g.enemies.forEach(e => { e.alive = false; });
  g.camera.rotation.x = 1.4; g.scene.updateMatrixWorld(true);
  g.fireWeapon(); g.updateEffects(0.5);
  assert.equal(g.goldenBullet.status, 'loaded', 'a miss cannot consume gold');
  g.startGame(); assert.equal(g.goldenBullet.status, 'seeking');
  assert.equal(g.player.health, 100); assert.ok(g.goldenBullet.model);
});

test('desktop and touch rifles fire a visible golden finisher and require a fresh relic next realm', () => {
  for (const touch of [true, false]) {
    const h = harness({ touch }); const g = h.game; g.startGame();
    g.player.x = g.goldenBullet.x; g.player.z = g.goldenBullet.z; g.updateGoldenBullet(0.01);
    g.player.x = 34; g.player.z = 34; g.player.yaw = 0;
    g.camera.position.set(34, 1.62, 34); g.camera.rotation.set(0, 0, 0, 'YXZ');
    g.enemies.forEach(e => { e.alive = false; });
    g.boss.x = 34; g.boss.z = 26; g.boss.model.position.set(34, 0.08, 26);
    g.boss.model.rotation.set(0, 0, 0);
    g.scene.updateMatrixWorld(true);
    g.damageCreature(g.boss, g.boss.maxHp, new Three.Vector3(34, 1, 26), true);
    assert.equal(g.state, 'playing'); assert.equal(g.goldenBullet.status, 'loaded');
    g.fireWeapon();
    assert.equal(g.goldenBullet.status, 'fired');
    const shot = g.effects.findLast(e => e.kind === 'bolt');
    assert.equal(shot.object.material.color.getHex(), 0xffdf65);
    assert.equal(g.boss.alive, true, 'damage waits for the travelling projectile');
    g.pauseGame(); g.animate(); assert.equal(g.goldenBullet.status, 'fired');
    g.resumeGame(); g.updateEffects(0.5);
    assert.equal(g.boss.alive, false); assert.equal(g.goldenBullet.status, 'spent');
    assert.equal(g.state, 'transitioning');
    h.timers.findLast(t => t.ms === 1700).fn();
    assert.equal(g.schema, 2); assert.equal(g.state, 'playing');
    assert.equal(g.goldenBullet.status, 'seeking'); assert.ok(g.goldenBullet.model);
  }
});

test('map opens by M on PC or a touch button, without pausing or stealing held inputs', () => {
  for (const touch of [true, false]) {
    const h = harness({ touch }); const g = h.game; g.startGame();
    assert.equal(h.el('map-details').hidden, touch);
    g.controls.fire = true; g.controls.moveX = 1;
    if (touch) h.el('map-toggle').emit('click');
    else h.context.emit('keydown', { code: 'KeyM', key: 'm' });
    assert.equal(h.el('map-details').hidden, !touch);
    assert.equal(g.state, 'playing'); assert.equal(g.controls.fire, true); assert.equal(g.controls.moveX, 1);
    const before = h.el('map-details').hidden;
    h.context.emit('keydown', { code: 'KeyM', key: 'm', repeat: true });
    assert.equal(h.el('map-details').hidden, before);
    g.pauseGame(); h.el('map-toggle').emit('click');
    assert.equal(h.el('map-details').hidden, before);
    g.resumeGame();
    if (touch) {
      h.context.innerWidth = 390; h.context.innerHeight = 844; g.updateOrientation();
      h.el('map-toggle').emit('click'); assert.equal(h.el('map-details').hidden, before);
    }
  }
});

function faceTarget(h, x = 34, z = 26) {
  const g = h.game;
  g.enemies.forEach(e => { e.alive = false; });
  g.player.x = 34; g.player.z = 34; g.player.yaw = 0; g.player.pitch = 0;
  g.camera.position.set(34, 1.62, 34); g.camera.rotation.set(0, 0, 0, 'YXZ');
  g.boss.x = x; g.boss.z = z; g.boss.model.position.set(x, 0.08, z);
  g.boss.model.rotation.set(0, 0, 0);
  g.scene.updateMatrixWorld(true);
}

test('one right thumb can aim and fire while the other moves; pointer cancellation releases both', () => {
  const h = harness(); const g = h.game; g.startGame();
  h.el('move-pad').emit('pointerdown', { pointerId: 1, clientX: 63, clientY: 10 });
  const fire = h.el('touch-fire');
  fire.emit('pointerdown', { pointerId: 2, clientX: 700, clientY: 280 });
  fire.emit('pointermove', { pointerId: 2, clientX: 728, clientY: 267 });
  assert.equal(g.controls.fireTouch, true); assert.equal(g.controls.aimTouch, true);
  assert.ok(g.controls.moveY > 0); assert.equal(g.controls.runTouch, true);
  assert.equal(g.controls.lookDX, 28); assert.equal(g.controls.lookDY, -13);
  const yaw = g.player.yaw, pitch = g.player.pitch;
  g.updatePlayer(1 / 60);
  assert.ok(g.player.yaw < yaw, 'drag right turns right');
  assert.ok(g.player.pitch > pitch, 'drag up looks up');
  fire.emit('pointerup', { pointerId: 9 }); assert.equal(g.controls.fireTouch, true);
  fire.emit('lostpointercapture', { pointerId: 2 });
  assert.equal(g.controls.fireTouch, false); assert.equal(g.controls.aimTouch, false);
  assert.ok(g.controls.moveY > 0, 'ending aim does not steal the movement finger');
  h.el('move-pad').emit('pointercancel', { pointerId: 1 });
  assert.equal(g.controls.moveY, 0); assert.equal(g.controls.runTouch, false);
});

test('holding the touch trigger resumes firing after an automatic reload', () => {
  const h = harness(); const g = h.game; g.startGame();
  g.settings.touchAuto = false; g.boss.alive = false; g.enemies.forEach(e => { e.alive = false; });
  h.el('touch-fire').emit('pointerdown', { pointerId: 4, clientX: 700, clientY: 280 });
  g.weapon.ammo = 1; g.updateWeapon(0.02); assert.equal(g.weapon.ammo, 0);
  g.updateWeapon(0.2); assert.ok(g.weapon.reload > 0); assert.equal(g.controls.fireTouch, true);
  g.updateWeapon(1.2); assert.equal(g.weapon.ammo, 32);
  g.updateWeapon(0.02); assert.equal(g.weapon.ammo, 31);
  h.el('touch-fire').emit('pointerup', { pointerId: 4 });
  g.updateWeapon(0.2); assert.equal(g.weapon.ammo, 31);
});

test('phone AUTO shoots an acquired target; the same idle desktop scene never fires', () => {
  for (const touch of [true, false]) {
    const h = harness({ touch }); const g = h.game; g.startGame(); faceTarget(h);
    const hp = g.boss.hp;
    for (let i = 0; i < 55; i++) g.animate();
    if (touch) {
      assert.ok(g.weapon.ammo < 32); assert.ok(g.boss.hp < hp);
      assert.equal(g.weapon.model.scale.x, 0.72);
    } else {
      assert.equal(g.weapon.ammo, 32); assert.equal(g.boss.hp, hp);
      assert.equal(g.player.yaw, 0); assert.equal(g.player.pitch, 0);
      assert.equal(g.weapon.model.scale.x, 1);
    }
  }
});

test('AUTO can be disabled; a deliberate swipe takes priority over magnetic aiming', () => {
  const h = harness(); const g = h.game; g.startGame(); faceTarget(h, 36.5, 26);
  h.el('touch-auto').emit('click'); assert.equal(g.settings.touchAuto, false);
  for (let i = 0; i < 50; i++) g.animate();
  assert.equal(g.weapon.ammo, 32); assert.ok(g.player.yaw < -0.1, 'gentle assist brings the target toward centre');
  const yaw = g.player.yaw;
  g.controls.lookDX = -50; g.updatePlayer(1 / 60);
  assert.ok(g.player.yaw > yaw, 'the player can swipe away from the target');
  h.context.emit('blur'); assert.equal(g.touchAssist.target, null); assert.equal(g.touchAssist.ready, false);
});

test('automatic targeting respects walls and the portrait gameplay gate', () => {
  const h = harness(); const g = h.game; g.startGame(); faceTarget(h);
  let wall;
  for (let z = 1; z < 15 && !wall; z++) for (let x = 1; x < 15; x++) {
    if (!g.world.walkable(x,z) && g.world.walkable(x-1,z) && g.world.walkable(x+1,z)) { wall={x,z}; break; }
  }
  assert.ok(wall);
  const p = g.worldFromCell(wall.x-1,wall.z), b = g.worldFromCell(wall.x+1,wall.z);
  Object.assign(g.player,p,{yaw:-Math.PI/2}); Object.assign(g.boss,b);
  g.boss.model.position.set(b.x,0.08,b.z);
  g.camera.position.set(p.x,1.62,p.z); g.camera.rotation.set(0,-Math.PI/2,0,'YXZ'); g.scene.updateMatrixWorld(true);
  assert.equal(g.findAimAssistTarget(), null);
  g.updateTouchAim(0.2); assert.equal(g.touchAssist.target, null);
  faceTarget(h); for (let i=0;i<40;i++) g.animate();
  h.context.innerWidth=390; h.context.innerHeight=844; g.updateOrientation();
  const hp=g.boss.hp, ammo=g.weapon.ammo;
  for (let i=0;i<40;i++) g.animate();
  assert.equal(g.boss.hp,hp); assert.equal(g.weapon.ammo,ammo);
  assert.equal(g.controls.fireTouch,false); assert.equal(g.touchAssist.target,null);
});
