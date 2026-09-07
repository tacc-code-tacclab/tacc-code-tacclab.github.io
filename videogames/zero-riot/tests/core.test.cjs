const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const R=require('../core.js');
let checks=0;
function test(name,f){f();checks++;console.log('PASS',name);}
test('same seed gives same positions and values',()=>{assert.deepEqual(R.create('2026-09-07').pickups,R.create('2026-09-07').pickups);assert.notDeepEqual(R.create('a').pickups,R.create('b').pickups);});
test('flip negates every pickup but preserves reactor charge',()=>{const g=R.create('flip');g.charge=5;const before=g.pickups.map(p=>p.v);assert(R.flip(g));assert.equal(g.charge,5);assert.deepEqual(g.pickups.map(p=>p.v),before.map(v=>-v));assert.equal(R.flip(g),false);g.flipCooldown=0;R.flip(g);assert.deepEqual(g.pickups.map(p=>p.v),before);});
test('3 + 4 - 7 returns to zero; only nearby enemies are removed',()=>{const g=R.create('nova');g.enemies=[{x:g.x+20,y:g.y},{x:g.x+500,y:g.y}];for(const v of [3,4,-7])R.collect(g,{x:0,y:0,v});assert.equal(g.charge,0);assert.equal(g.novas,1);assert.equal(g.bestChain,3);assert.equal(g.chain,0);assert.equal(g.enemies.length,1);assert.equal(g.kills,1);assert.equal(g.score,563);});
test('overload consumes one shield and resets charge; protection prevents multi-hit loss',()=>{const g=R.create('overload');g.invulnerable=0;R.collect(g,{v:7});R.collect(g,{v:3});assert.equal(g.lives,2);assert.equal(g.charge,0);assert.equal(g.novas,0);assert.equal(R.hurt(g,'hit'),false);});
test('negative charge boundary is symmetric',()=>{const g=R.create('minus');g.invulnerable=0;R.collect(g,{v:-7});R.collect(g,{v:-2});assert.equal(g.charge,-9);assert.equal(g.lives,3);R.collect(g,{v:-1});assert.equal(g.lives,2);assert.equal(g.charge,0);});
test('movement reaches both edges and diagonal speed is normalised',()=>{function clear(){const g=R.create('move');g.pickups=[];g.spawnAt=999;return g;}const a=clear(),b=clear();R.step(a,.1,{x:1});R.step(b,.1,{x:1,y:1});assert(Math.abs(Math.hypot(b.x-360,b.y-390)-(a.x-360))<1e-8);for(let i=0;i<120;i++)R.step(a,1/60,{x:1});assert.equal(a.x,696);for(let i=0;i<240;i++)R.step(a,1/60,{x:-1});assert.equal(a.x,24);});
test('90-second run ends once and awards surviving shields once',()=>{const g=R.create('end');g.pickups=[];g.spawnAt=999;for(let i=0;i<5500;i++)R.step(g,1/60);assert.equal(g.ended,true);assert.equal(g.won,true);assert.equal(g.time,90);assert.equal(g.score,900);R.step(g,1);assert.equal(g.score,900);});
test('third hit ends run and replay starts clean',()=>{const g=R.create('replay');for(let i=0;i<3;i++){g.invulnerable=0;R.hurt(g,'test');}assert(g.ended);assert(!g.won);const r=R.create(g.seed);assert.equal(r.lives,3);assert.equal(r.time,0);assert.equal(r.score,0);assert.equal(r.charge,0);});
// A fixed nontrivial trace for the Lua implementation to reproduce, including
// pickups, flips, enemy updates, protection and eventual loss or completion.
const g=R.create('cross-platform');for(let i=0;i<4800&&!g.ended;i++){if(i%173===0)R.flip(g);const a=i*.013;R.step(g,1/60,{x:Math.cos(a),y:Math.sin(a)});g.events=[];}
const sample={time:g.time,x:g.x,y:g.y,charge:g.charge,lives:g.lives,score:g.score,novas:g.novas,seed:R.seedNumber('cross-platform'),pickups:g.pickups.map(p=>({x:p.x,y:p.y,v:p.v}))};
fs.writeFileSync(path.join(__dirname,'parity-expected.json'),JSON.stringify(sample,null,2)+'\n');
console.log(`${checks} core checks passed; cross-platform trace recorded.`);
