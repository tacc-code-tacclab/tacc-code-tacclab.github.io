const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R=require('../core.js');
function settle(g,dt=1/60){for(let i=0;i<1000&&g.projectile;i++)R.step(g,dt);assert.equal(g.projectile,null,'shot must settle');}
function solution(g){for(let i=0;i<=240;i++){const angle=-1.16+i*2.32/240,b=g.bubbles.find(q=>q.id===R.trace(g,angle).hitId);if(!b)continue;const slot=g.ammo.indexOf(R.required(g,b.v));if(slot>=0||g.rainbowReady)return{angle,slot:Math.max(0,slot),id:b.id};}throw Error(`No reachable solution: ${g.seed} level ${g.level}, ${g.bubbles.length} bubbles`);}
function win(g,dt=1/60){while(!g.ended&&g.shots<100){const s=solution(g);g.cooldown=0;R.select(g,s.slot);assert(R.shoot(g,s.angle));settle(g,dt);assert.equal(g.misses,0,'preview and simulation must agree');g.events=[];}assert(g.won);assert.equal(g.bubbles.length,0);assert.equal(g.rescued,g.lumiTotal,'every Lumi must be rescued');return g;}
// Daily boards and every difficulty have a reachable legal shot after each change.
let cleared=0,shots=0;for(let seed=0;seed<20;seed++)for(let l=1;l<=12;l++){const g=win(R.create('test-'+seed,l),[1/30,1/60,1/120][seed%3]);cleared++;shots+=g.shots;}
// Bad arithmetic teaches without erasing progress, adding clutter, or losing a life.
let g=R.create('mistake');const b=g.bubbles[6],before=JSON.stringify(g.bubbles);R.resolve(g,b.id,{value:99,rainbow:false});assert.equal(JSON.stringify(g.bubbles),before);assert.equal(g.misses,1);assert.match(g.events[0].message,/= 102/);assert(!g.ended);assert.equal(g.power,0);
// Equal connected groups pop; clearing their only ceiling connection drops the rest.
g=R.create('drop');g.bubbles=[{id:1,x:200,y:132,v:1,row:0,color:1},{id:2,x:238,y:198,v:2,row:1,color:2},{id:3,x:314,y:198,v:2,row:1,color:2}];R.resolve(g,1,{value:4,rainbow:false});const pop=g.events.find(e=>e.type==='pop');assert.equal(pop.popped.length,1);assert.equal(pop.dropped.length,2);assert(g.won);
// Three accurate shots unlock a rainbow; it ignores arithmetic and adds a splash.
g=R.create('rainbow',12);for(let i=0;i<3;i++){const s=solution(g);g.cooldown=0;R.select(g,s.slot);R.shoot(g,s.angle);settle(g);g.events=[];}assert(g.rainbowReady);g.cooldown=0;const s=solution(g);R.shoot(g,s.angle);assert(g.projectile.rainbow);assert(!g.rainbowReady);settle(g);assert(g.events.some(e=>e.type==='pop'&&e.message==='RAINBOW RIOT!'));
// Aim is immediate, clamped, and repeated fire cannot spawn duplicate projectiles.
g=R.create('input');R.aim(g,100,500);assert(g.angle<0);R.aim(g,99999,800);assert.equal(g.angle,1.16);g.angle=0;assert(R.shoot(g));assert(!R.shoot(g));
// Wall/bumper reflections use identical rays at several frame rates, without tunnelling.
let reflected=0;for(let l of [4,6,9,12])for(let i=0;i<=90;i++){const a=-1.16+i*2.32/90,base=R.create('ricochet',l),trace=R.trace(base,a);if(trace.points.length<3||!trace.hitId)continue;for(const dt of [1/30,1/60,1/120]){g=R.create('ricochet',l);const b=g.bubbles.find(b=>b.id===trace.hitId);g.ammo[0]=R.required(g,b.v);R.shoot(g,a);settle(g,dt);assert.equal(g.misses,0);assert(g.events.some(e=>e.type==='bounce'));assert(g.events.find(e=>e.type==='pop').popped.some(b=>b.id===trace.hitId));}reflected++;}assert(reflected>10);
// Campaign progression ends at 12 and replay does not farm points from prior attempts.
g=win(R.create('campaign'));const bank=g.score;let next=R.nextLevel(g);assert.equal(next.level,2);assert.equal(next.score,bank);next.score+=999;assert.equal(R.retryLevel(next).score,bank);for(let l=2;l<=12;l++){g=win(next);next=R.nextLevel(g);}assert(g.campaignComplete);assert.equal(g.level,12);assert.equal(next,g);assert.equal(g.totalStars,36);assert.equal(R.create(g.seed).level,1);
// Explosion propagation rescues both popped and unsupported creatures exactly once.
g=R.create('explosions');g.lumiTotal=2;g.bubbles=[
 {id:1,x:180,y:132,v:1,row:0,color:1,bomb:true},
 {id:2,x:332,y:132,v:2,row:0,color:2,bomb:true},
 {id:3,x:484,y:132,v:3,row:0,color:3,lumi:true},
 {id:4,x:522,y:198,v:4,row:1,color:4,lumi:true}
];R.resolve(g,1,{value:4,rainbow:false,bounces:1});const chain=g.events.find(e=>e.type==='pop');assert.equal(chain.explosions.length,2);assert.equal(chain.rescued.length,2);assert.equal(chain.rowsCleared,2);assert(chain.bankShot);assert.equal(g.totalRescued,2);assert(g.won);const saved=g.score;R.resolve(g,1,{value:4});assert.equal(g.score,saved);assert.equal(R.nextLevel(g).totalRescued,2);assert.equal(R.retryLevel(g).totalRescued,0);
// Every operation yields positive integer ammunition and an exact target.
const operations=new Set();for(let l=1;l<=12;l++){g=R.create('operations',l);operations.add(g.config.op);for(const b of g.bubbles){const n=R.required(g,b.v);assert(Number.isInteger(n)&&n>0);assert.equal(R.valueOf(g,b.v,n),g.config.target);}assert.equal(R.world(g),Math.floor((l-1)/4));}assert.equal(operations.size,4);
// Exact JS/Lua parity fixture records all initial boards and a complete deterministic run.
const parity=[];let state=R.create('parity-314');for(let level=1;level<=12;level++){parity.push({level,initial:state.bubbles.map(b=>[b.id,b.x,b.y,b.v,b.row,b.lumi?1:0,b.bomb?1:0]),ammo:[...state.ammo]});while(!state.ended){const s=solution(state);state.cooldown=0;R.select(state,s.slot);R.shoot(state,s.angle);settle(state);parity.push({level,shot:state.shots,angle:s.angle,score:state.score,stars:state.totalStars,rescued:state.rescued,totalRescued:state.totalRescued,power:state.power,rainbow:state.rainbowReady?1:0,ids:state.bubbles.map(b=>b.id),ammo:[...state.ammo]});state.events=[];}state=R.nextLevel(state);}
fs.writeFileSync(path.join(__dirname,'parity-expected.json'),JSON.stringify(parity));console.log(`PASS ${cleared} boards cleared with ${shots} shots; ${reflected} reflected routes × 3 frame rates; four operations, explosion chains, rescues, row clears, rainbow and final replay.`);
