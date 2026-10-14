const test=require('node:test'),assert=require('node:assert/strict');
const {Game,difficulty,wrap,mulberry32}=require('../engine.js');
function run(g,seconds,input=0){g.setInput(input);for(let t=0;t<seconds;t+=1/120)g.update(1/120);}
test('seeded circus layout is deterministic, ordered and never degenerates',()=>{
 for(let seed=0;seed<100;seed++){
  const a=new Game(seed),b=new Game(seed);assert.deepEqual(a.trapezes,b.trapezes);
  for(let i=1;i<a.trapezes.length;i++){const gap=a.trapezes[i].anchorX-a.trapezes[i-1].anchorX;assert.ok(gap>=280&&gap<=560);}
  for(const t of a.trapezes)for(let time=0;time<10;time+=.13){const p=a.trapPose(t,time);assert.ok([p.x,p.y,p.vx,p.vy,p.angle].every(Number.isFinite));}
 }
});
test('later acts introduce four distinct readable trapeze hazards',()=>{
 const g=new Game(88);while(g.trapezes.length<100)g.addTrapeze();const kinds=new Set(g.trapezes.map(t=>t.kind));assert.deepEqual([...kinds].sort(),['classic','double','elastic','short','wild']);
 for(const t of g.trapezes.filter(t=>t.kind==='elastic'||t.kind==='wild'))assert.notDeepEqual(g.trapPose(t,0),g.trapPose(t,1));
});
test('difficulty rises by act but preserves humane hard limits',()=>{
 let prior=difficulty(0);
 for(let n=1;n<1000;n++){const d=difficulty(n);assert.ok(d.gap>=prior.gap&&d.swing>=prior.swing&&d.catchRadius<=prior.catchRadius);assert.ok(d.gap<=520&&d.swing<=1.58&&d.catchRadius>=45&&d.tigers<=5);prior=d;}
 assert.equal(difficulty(0).act,0);assert.equal(difficulty(9).within,9);assert.equal(difficulty(10).act,1);
});
test('release transfers swing momentum, tilt applies torque and flight is deterministic',()=>{
 const a=new Game(42),b=new Game(42);for(const g of [a,b]){g.start();run(g,1.8,-.6);const swingVx=g.player.vx;assert.equal(g.release(),true);g.update(1/120);assert.equal(g.state,'flight');assert.ok(g.player.vx>swingVx+150&&g.player.vy<-300);run(g,.5,-.6);}
 assert.deepEqual(a.player,b.player);assert.ok(Math.abs(a.player.angle)>.05);assert.ok(Number.isFinite(wrap(999)));
});
test('many seeded opening jumps have real catch windows, without auto-release',()=>{
 let solvable=0;
 for(let seed=1;seed<=16;seed++){
  let won=false;
  for(let release=.5;release<6&&!won;release+=.1)for(const input of [-1,-.6,0,.6,1]){
   const g=new Game(seed);g.start();run(g,release,input);g.release();run(g,2.6,input);if(g.catches===1){won=true;break;}
  }
  if(won)solvable++;
 }
 assert.ok(solvable>=14,`${solvable}/16 opening layouts solvable by coarse search`);
 const idle=new Game(4);idle.start();run(idle,30);assert.equal(idle.catches,0);assert.equal(idle.state,'swing');
});
test('catch scoring advances acts, drains events once and best survives reset',()=>{
 const g=new Game(1);g.state='flight';g.catches=9;g.combo=2;g.player.attached=0;const target=g.trapPose(g.trapezes[1]);g.player.x=target.x;g.player.y=target.y+44;g.player.vx=0;g.player.vy=1;g.player.angle=0;g.player.omega=0;g.update(1/120);
 assert.equal(g.catches,10);assert.equal(g.act,2);assert.ok(g.score>=100);assert.equal(g.best,10);assert.ok(g.drainEvents().some(e=>e.type==='catch'&&e.newAct));assert.deepEqual(g.drainEvents(),[]);g.reset();assert.equal(g.best,10);
});
test('a fall ends exactly once and invalid deltas cannot mutate the run',()=>{
 const g=new Game(2);g.start();g.release();g.update(1/120);g.player.y=640;g.update(1/120);assert.equal(g.state,'over');assert.equal(g.reason,'tigers');const snapshot=JSON.stringify(g.player);g.update(NaN);g.update(-1);g.update(99);assert.equal(JSON.stringify(g.player),snapshot);assert.equal(g.release(),false);assert.equal(g.drainEvents().filter(e=>e.type==='fail').length,1);
});
test('random generator stays within [0,1) and produces diverse values',()=>{const r=mulberry32(9),values=Array.from({length:1000},r);assert.ok(values.every(v=>v>=0&&v<1));assert.ok(new Set(values).size>990);});
