const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../engine.js'),{Game,COLS,ROWS,WEAPONS,WEAPON_IDS,BLOCK,isCat,MISSIONS,WORLDS}=M;
function seeded(seed=42){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function complete(g){for(const c of g.targets)g.board[c.y][c.x]=0;g.checkGoal();}
test('36 unique filled silhouettes grow in area across 18 destinations and every requested region',()=>{
 assert.equal(MISSIONS.length,36);assert.equal(WORLDS.length,18);assert.equal(new Set(MISSIONS.map(m=>JSON.stringify(m.targets))).size,36);
 for(let i=0;i<36;i++){const m=MISSIONS[i];assert.equal(m.kind,'figure');assert.equal(m.world,Math.floor(i/2));assert.ok(m.targets.length>=8);assert.equal(new Set(m.targets.map(c=>c.y*COLS+c.x)).size,m.targets.length);for(const c of m.targets){assert.ok(c.x>=0&&c.x<COLS);assert.ok(c.y>=4&&c.y<ROWS);}if(i)assert.ok(m.targets.length>=MISSIONS[i-1].targets.length);}
 for(const name of ['Europa','Asia','America del Nord','America Centrale','America del Sud','Africa','Oceania','Antartide'])assert.ok(WORLDS.some(w=>w.region===name));
});
test('hex rotation, movement, swap and landing conserve legal kittens',()=>{
 const g=new Game(seeded());const before=JSON.stringify(g.active.cells);for(let i=0;i<6;i++)g.turn();assert.equal(JSON.stringify(g.active.cells),before);for(let i=0;i<12;i++)g.move(-1);assert.ok(g.fits(g.active));assert.equal(g.swap(),true);assert.equal(g.swap(),false);const n=g.active.cells.length;g.drop();assert.equal(g.board.flat().filter(isCat).length,n);assert.ok(g.fits(g.active));
});
test('points or an almost complete outline cannot win; every inner target cell is required',()=>{
 for(let stage=0;stage<36;stage++){const g=new Game(seeded(stage));g.stage=stage;g.prepareStage();g.addScore(99999);const hole=g.targets[Math.floor(g.targets.length/2)];for(const c of g.targets){g.stamps[c.y*9+c.x]=0;if(c!==hole)g.board[c.y][c.x]=0;}g.stamps[0]=0;g.stamps[999]=0;g.checkGoal();assert.equal(g.won,false);assert.equal(g.progress,g.goal-1);g.finish('win');assert.equal(g.won,false);g.board[hole.y][hole.x]=0;g.checkGoal();assert.equal(g.won,true);}
});
test('progress counts present cats only; credit history never counts as physical occupancy',()=>{
 const g=new Game();const c=g.targets[0];g.board[c.y][c.x]=BLOCK;assert.equal(g.stampTargets(),0);g.board[c.y][c.x]=2;assert.equal(g.stampTargets(),1);const score=g.score;g.board[c.y][c.x]=null;assert.equal(g.progress,0);g.board[c.y][c.x]=1;assert.equal(g.stampTargets(),0);assert.equal(g.score,score);g.charge=4;g.purr();assert.ok(g.progress>=1);
});
test('every 100 points becomes exactly one credit; spending never resets conversion',()=>{
 const g=new Game();g.addScore(99);assert.equal(g.coins,0);g.addScore(1);assert.equal(g.coins,1);g.addScore(145);assert.equal(g.coins,2);g.addScore(-9);g.addScore(NaN);assert.equal(g.score,245);g.addScore(755);complete(g);const before=g.coins;assert.equal(g.buy('dart'),true);assert.equal(g.coins,before-WEAPONS.dart.price);g.addScore(100);assert.equal(g.coins,before-WEAPONS.dart.price+1);
});
test('weapons require real credits and a won stop, remain unlocked and cannot be bought twice',()=>{
 const g=new Game();assert.equal(g.weapon,'stone');assert.equal(g.buy('laser'),false);assert.equal(g.equip('laser'),false);g.addScore(20000);assert.equal(g.buy('laser'),false);complete(g);
 for(const id of WEAPON_IDS.slice(1)){const coins=g.coins;assert.equal(g.buy(id),true);assert.equal(g.coins,coins-WEAPONS[id].price);assert.equal(g.buy(id),false);assert.equal(g.equip(id),true);}assert.equal(g.buy('unknown'),false);const owned=g.owned.slice();g.nextStage();assert.deepEqual(g.owned,owned);for(let i=0;i<5;i++)g.cycleWeapon();assert.equal(g.weapon,'laser');
});
test('each weapon has its own damage/cooldown, with finite shared ammunition and no auto-hit on misses',()=>{
 for(const id of WEAPON_IDS){const g=new Game();g.stage=35;g.prepareStage();g.owned=WEAPON_IDS.slice();g.equip(id);g.appearMosquito();const hp=g.mosquito.hp;assert.equal(g.shootMosquito(false),true);assert.equal(g.mosquito.hp,hp);assert.equal(g.shootMosquito(),false);g.advance(WEAPONS[id].cooldown);assert.equal(g.shootMosquito(),true);assert.equal(g.mosquito.hp,Math.max(0,hp-WEAPONS[id].damage));assert.equal(g.shootMosquito(),false);}
 const g=new Game();g.reset('chill');g.appearMosquito();for(let i=0;i<4;i++){assert.equal(g.shootMosquito(),true);g.advance(340);}assert.equal(g.mosquito,null);assert.equal(g.score,100);assert.equal(g.coins,1);assert.equal(g.charge,1);assert.deepEqual(g.owned,['stone']);
});
test('zanzara arrivals and attacks obey active time or placements; clutter never overwrites kittens/spawn',()=>{
 const g=new Game(seeded());g.moves=2;g.advance(12000);assert.ok(g.mosquito);const active=g.cells().map(c=>c.y*9+c.x);g.board[11][0]=1;const cats=g.board.flat().filter(isCat).length;g.advance(10000);assert.ok(g.board.flat().includes(BLOCK));assert.equal(g.board.flat().filter(isCat).length,cats);for(let y=0;y<4;y++)assert.ok(g.board[y].every(v=>v!==BLOCK));for(const key of active)assert.notEqual(g.board[Math.floor(key/9)][key%9],BLOCK);
 const h=new Game(seeded());h.reset('chill');h.appearMosquito();h.advance(1000);assert.equal(h.mosquito.placements,6);assert.equal(h.board.flat().includes(BLOCK),false);assert.equal(h.remaining,Infinity);h.advance(31000);assert.equal(h.mosquito,null);
});
test('shooting removes all clutter and preserves the falling group and earned footprints',()=>{
 const g=new Game();g.reset('chill');g.board[10][0]=BLOCK;g.board[8][0]=2;g.board[11][1]=BLOCK;g.appearMosquito();const active=JSON.stringify(g.active);const t=g.targets[0];g.stamps[t.y*9+t.x]=1;for(let i=0;i<4;i++){g.shootMosquito();g.advance(340);}assert.equal(g.board.flat().includes(BLOCK),false);assert.ok(g.board.flat().includes(2));assert.equal(JSON.stringify(g.active),active);assert.ok(g.fits(g.active));assert.equal(g.stamps[t.y*9+t.x],1);
});
test('retry restores the start-of-stop wallet and arsenal without farming failed attempts',()=>{
 const g=new Game();g.addScore(1000);complete(g);g.buy('dart');g.nextStage();const baseline=g.campaignSave();g.addScore(500);g.finish('time');assert.equal(g.retryStage(),true);assert.deepEqual(g.campaignSave(),baseline);assert.equal(g.weapon,'dart');assert.equal(g.elapsed,0);
});
test('saved shop/level progress resumes without repeating completion rewards, rejecting invalid saves',()=>{
 const g=new Game();g.addScore(2000);complete(g);g.buy('dart');const raw=g.campaignSave(),h=new Game();assert.equal(h.restoreCampaign(JSON.parse(JSON.stringify(raw))),true);assert.equal(h.won,true);assert.equal(h.score,g.score);assert.equal(h.coins,g.coins);h.checkGoal();assert.equal(h.score,g.score);assert.equal(h.nextStage(),true);assert.equal(h.stage,1);const fresh=new Game();assert.equal(fresh.restoreCampaign(h.campaignSave()),true);assert.equal(fresh.won,false);assert.equal(fresh.progress,0);assert.deepEqual(fresh.owned,h.owned);
 for(const broken of [null,{}, {...raw,version:1},{...raw,stage:36},{...raw,coins:-1},{...raw,owned:['stone','laser']},{...raw,weapon:'laser'},{...raw,mode:'bogus'},{...raw,score:NaN}]){const safe=new Game();assert.equal(safe.restoreCampaign(broken),false);assert.equal(safe.stage,0);}
});
test('all 36 stops transition, retain purchases and finish in one explicit final victory',()=>{
 const g=new Game(seeded());g.reset('chill');g.addScore(600);for(let stage=0;stage<36;stage++){assert.equal(g.stage,stage);assert.equal(g.world,WORLDS[Math.floor(stage/2)]);complete(g);if(stage===0)g.buy('dart');assert.equal(g.campaignWon,stage===35);assert.equal(g.nextStage(),stage<35);if(stage<35)assert.equal(g.owned.includes('dart'),true);}assert.equal(g.canBuy('laser'),false);assert.equal(g.won,true);g.reset();assert.equal(g.stage,0);assert.deepEqual(g.owned,['stone']);
});
test('time expires exactly at the per-stop deadline and no invalid delta mutates it',()=>{const g=new Game();g.stage=35;g.prepareStage();for(const n of [NaN,Infinity,-1,0])g.advance(n);assert.equal(g.elapsed,0);g.advance(g.duration-1);assert.equal(g.over,false);g.advance(1);assert.equal(g.endReason,'time');assert.equal(g.remaining,0);});
test('mobile placements rotate deliberately, reject overlap and never fall by themselves',()=>{
 const g=new Game(seeded());g.reset('place');const original=JSON.stringify(g.active.cells);for(let i=0;i<6;i++)assert.equal(g.turn(),true);assert.equal(g.step(),null);assert.equal(g.drop(),null);assert.equal(g.move(1),false);g.advance(60000);assert.equal(g.elapsed,0);assert.equal(JSON.stringify(g.active.cells),original);
 assert.equal(g.place(-4,-3),null);assert.equal(g.moves,0);let p;
 outer:for(let y=3;y<7;y++)for(let x=0;x<9;x++){const candidate=g.placement(x,y);if(g.fits(candidate)){p=candidate;break outer;}}
 const cells=g.cells(p),grid=M.toGrid(p.q,p.r);assert.ok(g.place(...grid));for(const c of cells)assert.equal(g.board[c.y][c.x],c.color);g.collapse();g.clearClutter();for(const c of cells)assert.equal(g.board[c.y][c.x],c.color);const n=g.moves;const occupied=cells[0];assert.equal(g.place(occupied.x,occupied.y),null);assert.equal(g.moves,n);
});
test('mobile can place even with a blocked spawn area; full means no legal current or next group',()=>{
 const g=new Game();g.reset('place');for(let y=0;y<3;y++)g.board[y].fill(BLOCK);g.spawn();assert.equal(g.over,false);assert.ok(g.hasPlacement());g.board.forEach(row=>row.fill(BLOCK));g.spawn();assert.equal(g.endReason,'full');
});
test('empty ammunition blocks every weapon; misses spend, refills cost credits, retry restores stock',()=>{
 const g=new Game();g.reset('place');g.appearMosquito();g.ammo=2;const hp=g.mosquito.hp;assert.ok(g.shootMosquito(false));assert.equal(g.ammo,1);assert.equal(g.mosquito.hp,hp);assert.equal(g.shootMosquito(false),false);assert.equal(g.ammo,1);g.advance(350);assert.ok(g.shootMosquito(false));g.advance(350);assert.equal(g.ammo,0);assert.equal(g.shootMosquito(),false);assert.equal(g.mosquito.hp,hp);
 assert.equal(g.buyAmmo(),false);g.addScore(200);assert.equal(g.buyAmmo(),true);assert.equal(g.coins,0);assert.equal(g.ammo,8);assert.equal(g.ammoSpent,2);complete(g);const h=new Game();assert.ok(h.restoreCampaign(g.campaignSave()));assert.equal(h.ammo,8);assert.equal(h.ammoSpent,2);h.nextStage();assert.equal(h.ammo,16);h.ammo=0;h.finish('full');h.retryStage();assert.equal(h.ammo,16);
});
test('mobile mosquito attacks on active time and accelerates through the journey',()=>{
 const g=new Game();g.reset('place');g.moves=2;g.advance(12000);assert.ok(g.mosquito);const speed=g.mosquito.speed;g.advance(10000);assert.ok(g.board.flat().includes(BLOCK));g.stage=35;g.prepareStage();g.appearMosquito();assert.ok(g.mosquito.speed>speed);assert.ok(g.mosquito.speed<speed*2);assert.ok(g.mosquito.speed<1);
});
test('historical stamps alone cannot win in either mode, even after many points or a shot',()=>{
 for(const mode of ['flow','place']){const g=new Game(seeded());g.reset(mode);for(const c of g.targets)g.stamps[c.y*9+c.x]=0;g.addScore(99999);g.checkGoal();g.finish('win');assert.equal(g.won,false);assert.equal(g.progress,0);
  for(const c of g.targets)g.board[c.y][c.x]=c.x%4;const hole=g.targets[Math.floor(g.goal/2)];g.board[hole.y][hole.x]=BLOCK;g.checkGoal();assert.equal(g.won,false);g.clearClutter();assert.equal(g.won,false);assert.equal(g.progress,g.goal-1);g.board[hole.y][hole.x]=2;g.resolve();assert.equal(g.won,true);assert.ok(g.targets.every(c=>isCat(g.board[c.y][c.x])));
 }
});
test('goal kittens remain physically visible through matches, gravity, Fusa and clutter cleanup',()=>{
 for(const mode of ['flow','place']){const g=new Game(seeded());g.reset(mode);g.stage=35;g.prepareStage();const anchors=g.targets.slice(0,6);for(const c of anchors)g.board[c.y][c.x]=1;g.stampTargets();
  // Fill a row outside the bottom-aligned silhouette to force an actual match.
  for(let x=0;x<9;x++)g.board[2][x]=1;const result=g.resolve();assert.ok(result.clears.length);g.charge=4;g.purr();g.clearClutter();for(const c of anchors)assert.equal(g.board[c.y][c.x],1);assert.ok(g.progress>=anchors.length);
 }
});
test('mobile availability checks all six rotations rather than declaring a false full board',()=>{
 const g=new Game();g.reset('place');g.board.forEach(row=>row.fill(BLOCK));const piece={cells:[[0,0],[0,1],[0,2]],color:0,q:4,r:0};const rotated={...piece,cells:M.rotate(piece.cells),q:4,r:3};for(const c of g.cells(rotated))g.board[c.y][c.x]=null;
 assert.equal(g.hasPlacement(piece),true);g.active=piece;g.queue[0]=piece;g.spawn();assert.equal(g.over,false);
});
test('mosquito stays for 32 seconds after its three drops, pauses, and never adds extra clutter',()=>{
 const g=new Game();g.reset('place');g.stage=20;g.prepareStage();g.appearMosquito();for(let i=0;i<3;i++)g.advance(4200);assert.ok(g.mosquito);assert.equal(g.mosquito.drops,3);const blocks=g.board.flat().filter(v=>v===BLOCK).length;g.advance(19399);assert.ok(g.mosquito);assert.equal(g.board.flat().filter(v=>v===BLOCK).length,blocks);g.advance(1);assert.equal(g.mosquito,null);
 const D=require('../draw.js');D.configure(true);const p=age=>D.mosquitoPosition(390,844,{age,phase:1,speed:.55});assert.deepEqual(p(2500),p(3100));assert.notDeepEqual(p(2500),p(3500));
});
test('restored completed stops contain real cats in every goal cell and pay the reward only once',()=>{
 const g=new Game();complete(g);const saved=g.campaignSave(),restored=new Game();assert.ok(restored.restoreCampaign(saved));assert.equal(restored.progress,restored.goal);assert.ok(restored.targets.every(c=>isCat(restored.board[c.y][c.x])));const score=restored.score;restored.checkGoal();assert.equal(restored.score,score);
});
test('all 36 silhouettes can finish through legal placements with a visibly full final board',()=>{
 for(let stage=0;stage<36;stage++){
  const g=new Game(()=>.99);g.reset('place');g.stage=stage;g.prepareStage();
  // A legal deterministic bag of vertical pairs covers the field from below.
  // No fabricated stamps or direct board writes are used to reach victory.
  for(let x=0;x<9&&!g.over;x++)for(let y=10;y>=0&&!g.over;y-=2){assert.ok(g.place(x,y));if(g.won)assert.ok(g.targets.every(c=>isCat(g.board[c.y][c.x])));}
  assert.equal(g.won,true,'stage '+stage);assert.equal(g.progress,g.goal);
 }
});

test('first four visits build pressure gradually; later visits keep bounded clutter and the same flight',()=>{
 const counts=[],firsts=[];
 for(const stage of [0,1,2,3,12,35]){
  const g=new Game(seeded());g.reset('place');g.stage=stage;g.prepareStage();g.appearMosquito();
  assert.equal(g.mosquito.flightMs,32000);assert.equal(g.mosquito.speed,.55+stage*.01);
  let first=0;for(let t=100;t<32000;t+=100){g.advance(100);const n=g.board.flat().filter(v=>v===BLOCK).length;if(n&&!first)first=t;}
  counts.push(g.board.flat().filter(v=>v===BLOCK).length);firsts.push(first);
  assert.ok(g.mosquito);g.advance(100);assert.equal(g.mosquito,null);
 }
 assert.deepEqual(counts,[1,2,2,3,6,6]);assert.deepEqual(firsts.slice(0,4),[10000,9000,7500,6500]);
 for(let stage=0;stage<36;stage++){
  const p=M.mosquitoDifficulty(stage),g=new Game(seeded());g.reset('place');g.stage=stage;g.prepareStage();
  for(let visit=0;visit<8;visit++){g.appearMosquito();for(let i=0;i<10;i++)g.dropClutter();g.restMosquito();}
  assert.ok(g.board.flat().filter(v=>v===BLOCK).length<=p.clutterCap);
  if(stage){const prev=M.mosquitoDifficulty(stage-1);assert.ok(p.buzz>=prev.buzz&&p.dropInterval<=prev.dropInterval&&p.maxDrops>=prev.maxDrops&&p.clutterCap>=prev.clutterCap);}
 }
});
test('relaxed PC mode uses gentler early placement counts and stops attacking after its visit budget',()=>{
 for(const stage of [0,1,2,3,12]){
  const g=new Game(()=>.99);g.reset('chill');g.stage=stage;g.prepareStage();g.appearMosquito();
  const p=M.mosquitoDifficulty(stage);assert.equal(g.mosquito.placements,p.placementInterval);
  // Real placements, separated by clearing non-goal board state, avoid an unrelated top-out.
  for(let i=1;i<=p.placementInterval;i++){
   g.board=Array.from({length:12},()=>Array(9).fill(null));g.active={cells:[[0,0],[0,1]],color:i%4,q:0,r:0};g.lock();
   assert.equal(g.mosquito.drops,i===p.placementInterval?1:0);
  }
  for(let i=0;i<10;i++)g.dropClutter();assert.equal(g.mosquito.drops,p.maxDrops);assert.ok(g.mosquito);
 }
});
