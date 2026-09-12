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
  const h = harness(); const g = h.game;
  for (const goal of g.floorCells.filter((_, i) => i % 37 === 0)) {
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
  const creature = { repath: 0.5, path: [], pathIndex: 0 };
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

test('all 25 schemas retain progression and stable mobile light/enemy budgets', () => {
  const h = harness(); const g = h.game; g.startGame(); const lights = h.visibleLights();
  const environments = new Set(); const cycles = new Set(); let lastHP = g.boss.hp;
  for (let schema = 1; schema <= 25; schema++) {
    assert.equal(g.schema, schema);
    environments.add(g.stageInfo().environment.kind); cycles.add(g.stageInfo().cycleIndex);
    assert.ok(g.effectiveEnemyCap() <= 12); assert.equal(h.visibleLights(), lights);
    if (schema < 25) { g.beginNextSchema(); assert.ok(g.boss.hp > lastHP); lastHP = g.boss.hp; }
  }
  assert.equal(environments.size, 5); assert.equal(cycles.size, 5);
  g.killBoss(); assert.equal(g.state, 'transitioning');
  h.timers.findLast(t => t.ms === 1700).fn(); assert.equal(g.state, 'won');
});

test('desktop pointer unlock still pauses deliberately', () => {
  const h = harness({ touch: false, width: 1280, height: 800 }); h.game.startGame();
  h.document.pointerLockElement = h.el('render-host'); h.document.emit('pointerlockchange');
  h.document.pointerLockElement = null; h.document.emit('pointerlockchange');
  assert.equal(h.game.state, 'paused');
});
