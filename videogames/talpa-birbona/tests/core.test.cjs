const test=require('node:test');
const assert=require('node:assert/strict');
const {Game,CROPS,COLS,ROWS,LAST_LEVEL,SPEED}=require('../core.js');
function drive(g,x,y){let ticks=0;while(g.status==='playing'&&Math.hypot(g.player.x-x,g.player.y-y)>.08&&ticks++<3000){const dx=x-g.player.x,dy=y-g.player.y,d=Math.hypot(dx,dy);g.update(1/60,dx/d*Math.min(1,d/(SPEED/60)),dy/d*Math.min(1,d/(SPEED/60)));}assert(ticks<3000);}
test('all ten garden layouts are completable, all crops appear, final victory and replay work',()=>{
 const g=new Game(),kinds=new Set();let expected=0;
 for(let level=1;level<=LAST_LEVEL;level++){
  assert.equal(g.level,level);g.invulnerable=Infinity;const crops=g.plants.map(p=>({...p}));
  for(const plant of crops){kinds.add(plant.kind);expected+=CROPS[plant.kind].points;drive(g,plant.x,plant.y);}
  assert.equal(g.remaining,0);assert.equal(g.status,level===LAST_LEVEL?'complete':'won');assert(g.health>0);
  expected+=g.health*100;assert.equal(g.score,expected);assert(g.holes.length>1);
  const doneScore=g.score;g.update(.25,1,0);assert.equal(g.score,doneScore);
  if(level<LAST_LEVEL)g.next();
 }
 assert.equal(kinds.size,10);g.next();assert.equal(g.level,10);g.start(1,0);assert.equal(g.status,'playing');assert.equal(g.score,0);
});
test('movement responds in one frame, stops immediately, normalizes diagonals and respects edges',()=>{
 const g=new Game();g.farmer.clock=1e6;g.update(1/60,1,0);assert(Math.abs(g.player.x-(1.5+SPEED/60))<1e-10);
 const x=g.player.x;g.update(.1,0,0);assert.equal(g.player.x,x);assert.equal(g.player.moving,false);
 const a=new Game(),b=new Game();a.update(.1,1,0);b.update(.1,1,1);assert(Math.abs(Math.hypot(b.player.x-1.5,b.player.y-.5)-(a.player.x-1.5))<1e-9);
 for(let i=0;i<500;i++)g.update(1/60,-1,-1);assert.equal(g.player.x,.5);assert.equal(g.player.y,.5);
 g.farmer.clock=1e6;drive(g,COLS-.5,ROWS-.5);assert(Math.abs(g.player.x-(COLS-.5))<.08);assert(Math.abs(g.player.y-(ROWS-.5))<.08);
});
test('poison only flows through connected tunnels and eventually disappears',()=>{
 const g=new Game();g.farmer.clock=1e6;for(let r=0;r<5;r++)g.dig(1.5,r+.5);
 g.dig(5.5,2.5);g.beginWave(1);g.player={x:20.5,y:12.5,facing:1};
 for(let i=0;i<150;i++)g.update(1/60);
 assert(g.poison[3*COLS+1]>0);assert.equal(g.poison[2*COLS+5],0);assert.equal(g.poison[2*COLS+2],0);
 for(let i=0;i<1400;i++)g.update(1/60);
 assert(g.poison.every(n=>n===0));assert.equal(g.waves.length,0);assert.equal(g.health,3);
});
test('farmer warns briefly before pouring and attacks only open surface holes',()=>{
 const g=new Game(10);let warningAt=null,pourAt=null;
 for(let i=0;i<1000;i++){g.update(1/60);for(const e of g.takeEvents()){if(e.type==='warning'&&warningAt===null)warningAt=g.time;if(e.type==='pour'&&pourAt===null)pourAt=g.time;}if(pourAt!==null)break;}
 assert(warningAt!==null&&pourAt!==null);assert(pourAt-warningAt>=g.difficulty.warning-.02);assert(pourAt<2.2);assert(g.holes.includes(g.farmer.target));
 const first=new Game(1);assert(g.difficulty.interval<first.difficulty.interval);assert(g.difficulty.farmerSpeed>first.difficulty.farmerSpeed);assert(g.difficulty.floodStep<first.difficulty.floodStep);
});
test('farmer, poison and ants become progressively more dangerous',()=>{
 const first=new Game(1),middle=new Game(6),last=new Game(10),phone=new Game(10,0,{assist:true});
 assert.equal(first.difficulty.antCount,0);assert.equal(middle.difficulty.antCount,3);assert.equal(last.difficulty.antCount,5);
 assert(last.difficulty.interval<middle.difficulty.interval&&middle.difficulty.interval<first.difficulty.interval);
 assert(last.difficulty.warning<first.difficulty.warning);assert(last.difficulty.floodStep<first.difficulty.floodStep);
 assert(last.difficulty.farmerSpeed>first.difficulty.farmerSpeed);assert(last.difficulty.antSpeed>middle.difficulty.antSpeed);
 assert(phone.difficulty.interval>last.difficulty.interval);assert(phone.difficulty.floodStep>last.difficulty.floodStep);assert(phone.difficulty.antSpeed<last.difficulty.antSpeed);
});
test('ants spawn away from the mole, chase her and cause protected damage on contact',()=>{
 const g=new Game(2);g.farmer.clock=1e6;g.antClock=0;g.update(1/60);
 assert.equal(g.ants.length,1);assert(Math.hypot(g.ants[0].x-g.player.x,g.ants[0].y-g.player.y)>5);
 assert(g.takeEvents().some(e=>e.type==='antSpawn'));
 const ant=g.ants[0];ant.x=g.player.x;ant.y=g.player.y;ant.cooldown=0;g.update(1/60);
 const events=g.takeEvents();assert.equal(g.health,2);assert(events.some(e=>e.type==='hurt'&&e.source==='ant'));
 assert(Math.hypot(ant.x-g.player.x,ant.y-g.player.y)>5);
 ant.x=g.player.x;ant.y=g.player.y;ant.cooldown=0;g.update(1/60);assert.equal(g.health,2);
});
test('ants dig connected tunnels and fresh ant tunnels carry active poison',()=>{
 const g=new Game(2);g.farmer.clock=1e6;g.antClock=0;g.update(1/60);g.takeEvents();
 for(let i=0;i<180;i++)g.update(1/60);
 const cells=g.antDug.map((dug,k)=>dug?k:-1).filter(k=>k>=0);assert(cells.length>3);
 const cellSet=new Set(cells),visited=new Set([cells[0]]),queue=[cells[0]];
 while(queue.length){const k=queue.shift(),c=k%COLS,r=Math.floor(k/COLS);for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){const nk=(r+dr)*COLS+c+dc;if(c+dc>=0&&c+dc<COLS&&r+dr>=0&&r+dr<ROWS&&cellSet.has(nk)&&!visited.has(nk)){visited.add(nk);queue.push(nk);}}}
 assert.equal(visited.size,cells.length);
 const breach=new Game(2);breach.farmer.clock=1e6;breach.antClock=Infinity;breach.dig(6.5,6.5,'ant');breach.poison[6*COLS+6]=4;
 breach.dig(7.5,6.5,'ant');breach.dig(8.5,6.5,'ant');
 assert(breach.poison[6*COLS+7]>0&&breach.poison[6*COLS+8]>0);assert(breach.takeEvents().some(e=>e.type==='poisonBreach'));
});
test('damage has a grace period and retry restores the level checkpoint',()=>{
 const g=new Game(4,900);g.farmer.clock=1e6;g.antClock=Infinity;g.difficulty.antCount=0;g.poison[1]=10;g.update(1/60);assert.equal(g.health,2);
 for(let i=0;i<60;i++)g.update(1/60);assert.equal(g.health,2);
 for(let i=0;i<240;i++)g.update(1/60);assert.equal(g.status,'lost');assert.equal(g.health,0);
 g.score+=500;g.retry();assert.equal(g.score,900);assert.equal(g.level,4);assert.equal(g.health,3);assert.equal(g.remaining,g.total);assert(g.poison.every(x=>x===0));
});
test('diagonal digging leaves a connected escape route',()=>{
 const g=new Game();g.farmer.clock=1e6;for(let i=0;i<70;i++)g.update(1/60,1,1);
 const visited=new Set([1]),queue=[1];while(queue.length){const k=queue.shift(),c=k%COLS,r=Math.floor(k/COLS);for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]){const nc=c+dc,nr=r+dr,nk=nr*COLS+nc;if(nc>=0&&nr>=0&&nc<COLS&&nr<ROWS&&g.dug[nk]&&!visited.has(nk)){visited.add(nk);queue.push(nk);}}}
 assert.equal(visited.size,g.dug.filter(Boolean).length);
});
