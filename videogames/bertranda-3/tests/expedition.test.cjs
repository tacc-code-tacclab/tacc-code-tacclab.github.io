const test = require('node:test');
const assert = require('node:assert/strict');
const Three = require('../../lovecraft/three.min.js');
const { World } = require('../world.js');
const { chooseBulletSite, findRoute, bearingAngle, bearingArrow, routeWaypoint, ScoutMap } = require('../expedition.js');
const world = () => new World(Three, new Three.Scene());

function traversable(w, route) {
  assert.ok(route.length > 1, 'a real route is present');
  for (let i = 0; i < route.length; i++) {
    const p = route[i]; assert.ok(w.free(p.x, p.z, 0.38));
    if (!i) continue;
    const prev = route[i - 1], distance = Math.hypot(prev.x - p.x, prev.z - p.z);
    assert.equal(distance, 4, 'path uses adjacent cells');
    assert.ok(w.free((prev.x + p.x) / 2, (prev.z + p.z) / 2, 0.38));
  }
}

test('all 25 descents hide the golden bullet on a reachable 88–136 metre route', () => {
  const w = world(), origin = { x: 34, z: 34 };
  const sites = new Set();
  for (let schema = 1; schema <= 25; schema++) {
    w.setSchema(schema, { accent: 0x67ff9a });
    const site = chooseBulletSite(w, origin); sites.add(site.x + ',' + site.z);
    assert.ok(site.route.length >= 23 && site.route.length <= 35);
    assert.ok(Math.hypot(site.x - origin.x, site.z - origin.z) >= 52);
    traversable(w, site.route);
    const result = findRoute(w, origin, site);
    traversable(w, result.route);
    assert.equal(result.partial, false);
    assert.deepEqual(result.route.at(-1), { x: site.x, z: site.z });
    assert.ok(w.cache.size <= 32);
  }
  assert.ok(sites.size > 10, 'the hunt does not always point to the same place');
});

test('wandering far from gold still gets a bounded, traversable route back toward it', () => {
  const w = world(), target = { x: 34, z: 34 };
  for (let schema = 1; schema <= 5; schema++) {
    w.setSchema(schema, { accent: 0x67ff9a });
    for (const origin of [{ x: -1246, z: 2338 }, { x: 100002, z: -100030 }]) {
      const result = findRoute(w, origin, target); traversable(w, result.route);
      assert.equal(result.partial, true);
      const last = result.route.at(-1);
      assert.ok(Math.hypot(last.x - target.x, last.z - target.z) < Math.hypot(origin.x - target.x, origin.z - target.z));
      assert.ok(w.cache.size <= 32);
    }
  }
});

test('map headings match forward, left and right on PC and phone', () => {
  const p = { x: 0, z: 0 };
  assert.equal(bearingArrow(p, { x: 0, z: -10 }, 0), '↑');
  assert.equal(bearingArrow(p, { x: 10, z: 0 }, 0), '→');
  assert.equal(bearingArrow(p, { x: -10, z: 0 }, 0), '←');
  assert.equal(bearingArrow(p, { x: 10, z: 0 }, -Math.PI / 2), '↑');
});

test('map is throttled and draws nothing when collapsed', () => {
  const w = world(); w.setSchema(1, { accent: 0x67ff9a });
  const map = new ScoutMap({ getContext: () => null });
  let frames = 0; map.context = {}; map.draw = () => frames++;
  const p = { x: 34, z: 34, yaw: 0 }, target = chooseBulletSite(w, p);
  for (let i = 0; i < 100; i++) map.update(w, p, target, {}, [], i / 100, false, true);
  assert.equal(frames, 0);
  for (let i = 100; i < 200; i++) map.update(w, p, target, {}, [], i / 100, true, true);
  assert.ok(frames >= 4 && frames <= 5);
  assert.ok(map.route.length > 1);
});

test('gold guidance follows a detour around a wall and turns with the player', () => {
  const route = [{x:2,z:2},{x:2,z:6},{x:2,z:10},{x:6,z:10},{x:10,z:10},{x:10,z:6},{x:10,z:2}];
  const open = new Set(route.map(p => Math.floor(p.x/4)+':'+Math.floor(p.z/4)));
  const w = { free(x,z,r) { return [-r,r].every(dx => [-r,r].every(dz => open.has(Math.floor((x+dx)/4)+':'+Math.floor((z+dz)/4)))); } };
  const origin = route[0], gold = route.at(-1);
  const first = routeWaypoint(w, route, origin, gold);
  assert.deepEqual(first, {x:2,z:10}, 'the arrow leads down the corridor, not straight through the wall toward gold');
  assert.equal(bearingArrow(origin, first, 0), '↓');
  assert.ok(Math.abs(bearingAngle(origin, first, Math.PI)) < 1e-8, 'turning around brings the guide straight ahead');
  assert.deepEqual(routeWaypoint(w, route, {x:2,z:9.7}, gold), {x:10,z:10}, 'the guide turns at the corridor bend');
  assert.equal(routeWaypoint(w, [], origin, gold), null, 'missing routes never invent a shortcut through walls');
});

test('guide waypoints stay walkable with player clearance throughout all 25 realms', () => {
  const w = world(), origin = {x:34,z:34};
  for (let schema = 1; schema <= 25; schema++) {
    w.setSchema(schema, { accent: 0x67ff9a });
    const gold = chooseBulletSite(w, origin), route = findRoute(w, origin, gold).route;
    for (const p of route.slice(0,-1)) {
      const next = routeWaypoint(w, route, p, gold);
      assert.ok(next, 'each route position has a forward waypoint');
      assert.ok(Math.hypot(next.x-p.x,next.z-p.z) <= 12, 'look-ahead stays bounded');
      for (let i=0;i<=40;i++) assert.ok(w.free(p.x+(next.x-p.x)*i/40,p.z+(next.z-p.z)*i/40,0.38), 'following the arrow leaves room for the player');
    }
  }
});

test('the short phone map fits the full green detour and uses separate green and red circles', () => {
  const strokes = [], fills = [];
  let path = [], dash = [];
  const ctx = {
    save(){}, restore(){}, translate(){}, rotate(){}, fillRect(){}, fillText(){}, closePath(){},
    beginPath(){path=[];}, moveTo(x,y){path.push(['point',x,y]);}, lineTo(x,y){path.push(['point',x,y]);},
    arc(x,y,r){path.push(['circle',x,y,r]);}, setLineDash(value){dash=value;},
    stroke(){strokes.push({color:this.strokeStyle,width:this.lineWidth,path:[...path],dash:[...dash]});},
    fill(){fills.push({color:this.fillStyle,path:[...path]});}
  };
  const canvas = {width:162,height:69,getContext:()=>ctx,getBoundingClientRect:()=>({width:108,height:46})};
  const map = new ScoutMap(canvas), player={x:2,z:2,yaw:0}, gold={x:98,z:2}, boss={x:52,z:52,alive:true};
  // The required detour extends well outside the box between player and bullet.
  map.route=[player,{x:2,z:102},{x:98,z:102},gold];
  let cells=0;
  const w={cell(){cells++;return 0;}};
  map.draw(w,player,gold,boss,[],true,0);
  const route = strokes.find(s=>s.color==='#76ff03');
  assert.ok(route && route.width >= 4); assert.deepEqual(route.dash,[], 'the route is a continuous line');
  assert.ok(strokes.some(s=>s.color==='#020904' && s.width > route.width), 'dark outline separates the route from terrain');
  for (const [,x,y] of route.path) {
    assert.ok(x>=11 && x<=canvas.width-11 && y>=11 && y<=canvas.height-11, 'the entire detour and endpoints fit inside marker padding');
  }
  assert.ok(fills.some(f=>f.color==='#76ff03' && f.path[0][0]==='circle'), 'bullet is a fluorescent green circle');
  assert.ok(fills.some(f=>f.color==='#ff3047' && f.path[0][0]==='circle'), 'Bertranda is a red circle');
  assert.ok(cells<1500, 'overview terrain work stays bounded');
  strokes.length=0; fills.length=0;
  map.draw(w,player,boss,boss,[],false,1); // Even a stale route must not be drawn.
  assert.equal(strokes.some(s=>s.path.some(p=>p[0]==='point') && s.width>=4),false, 'no route is drawn to the monster');
  assert.equal(fills.some(f=>f.color==='#76ff03'),false);
  assert.ok(fills.some(f=>f.color==='#ff3047' && f.path[0][0]==='circle'));
});

test('collecting the bullet clears navigation and never searches for a route to Bertranda', () => {
  const w=world(); w.setSchema(1,{accent:0x67ff9a});
  const map=new ScoutMap({getContext:()=>null}), player={x:34,z:34,yaw:0}, gold=chooseBulletSite(w,player);
  map.update(w,player,gold,{},[],0,false,true);
  assert.ok(map.route.length>1);
  const noRouting={generation:w.generation,walkable(){assert.fail('boss tracking must not search terrain');}};
  const boss={x:94,z:114};
  for (const visible of [false,true]) {
    map.update(noRouting,player,boss,boss,[],1,visible,false);
    assert.deepEqual(map.route,[]); assert.equal(map.partial,false);
    assert.equal(map.distance,100,'the monster readout is direct distance only');
  }
});
