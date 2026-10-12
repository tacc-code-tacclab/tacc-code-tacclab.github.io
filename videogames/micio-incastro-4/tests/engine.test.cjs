const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../engine.js'),{Game,COLS,ROWS,WEAPONS,WEAPON_IDS,BLOCK,isCat,MISSIONS,WORLDS}=M;
function seeded(seed=42){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function complete(g){for(const c of g.targets)g.stamps[c.y*COLS+c.x]=0;g.checkGoal();}
test('36 unique filled silhouettes grow in area across 18 destinations and every requested region',()=>{
 assert.equal(MISSIONS.length,36);assert.equal(WORLDS.length,18);assert.equal(new Set(MISSIONS.map(m=>JSON.stringify(m.targets))).size,36);
 for(let i=0;i<36;i++){const m=MISSIONS[i];assert.equal(m.kind,'figure');assert.equal(m.world,Math.floor(i/2));assert.ok(m.targets.length>=8);assert.equal(new Set(m.targets.map(c=>c.y*COLS+c.x)).size,m.targets.length);for(const c of m.targets){assert.ok(c.x>=0&&c.x<COLS);assert.ok(c.y>=4&&c.y<ROWS);}if(i)assert.ok(m.targets.length>=MISSIONS[i-1].targets.length);}
 for(const name of ['Europa','Asia','America del Nord','America Centrale','America del Sud','Africa','Oceania','Antartide'])assert.ok(WORLDS.some(w=>w.region===name));
});
test('hex rotation, movement, swap and landing conserve legal kittens',()=>{
 const g=new Game(seeded());const before=JSON.stringify(g.active.cells);for(let i=0;i<6;i++)g.turn();assert.equal(JSON.stringify(g.active.cells),before);for(let i=0;i<12;i++)g.move(-1);assert.ok(g.fits(g.active));assert.equal(g.swap(),true);assert.equal(g.swap(),false);const n=g.active.cells.length;g.drop();assert.equal(g.board.flat().filter(isCat).length,n);assert.ok(g.fits(g.active));
});
test('points or an almost complete outline cannot win; every inner target cell is required',()=>{
 for(let stage=0;stage<36;stage++){const g=new Game(seeded(stage));g.stage=stage;g.prepareStage();g.addScore(99999);const hole=g.targets[Math.floor(g.targets.length/2)];for(const c of g.targets)if(c!==hole)g.stamps[c.y*9+c.x]=0;g.stamps[0]=0;g.stamps[999]=0;g.checkGoal();assert.equal(g.won,false);assert.equal(g.progress,g.goal-1);g.finish('win');assert.equal(g.won,false);g.stamps[hole.y*9+hole.x]=0;g.checkGoal();assert.equal(g.won,true);}
});
test('footprints count real landed cats, survive clears and never award twice or count clutter',()=>{
 const g=new Game();const c=g.targets[0];g.board[c.y][c.x]=BLOCK;assert.equal(g.stampTargets(),0);g.board[c.y][c.x]=2;assert.equal(g.stampTargets(),1);const score=g.score;g.board[c.y][c.x]=null;assert.equal(g.progress,1);g.board[c.y][c.x]=1;assert.equal(g.stampTargets(),0);assert.equal(g.score,score);g.charge=4;g.purr();assert.ok(g.progress>=1);
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
 const g=new Game(seeded());g.moves=2;g.advance(12000);assert.ok(g.mosquito);const active=g.cells().map(c=>c.y*9+c.x);g.board[11][0]=1;const cats=g.board.flat().filter(isCat).length;g.advance(4200);assert.ok(g.board.flat().includes(BLOCK));assert.equal(g.board.flat().filter(isCat).length,cats);for(let y=0;y<4;y++)assert.ok(g.board[y].every(v=>v!==BLOCK));for(const key of active)assert.notEqual(g.board[Math.floor(key/9)][key%9],BLOCK);
 const h=new Game(seeded());h.reset('chill');h.appearMosquito();h.advance(500000);assert.equal(h.mosquito.placements,3);assert.equal(h.board.flat().includes(BLOCK),false);assert.equal(h.remaining,Infinity);
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
test('mobile placements stay where released, reject overlap and edges, and never rotate or fall',()=>{
 const g=new Game(seeded());g.reset('place');const original=JSON.stringify(g.active.cells);assert.equal(g.turn(),false);assert.equal(g.step(),null);assert.equal(g.drop(),null);assert.equal(g.move(1),false);g.advance(60000);assert.equal(g.elapsed,0);assert.equal(JSON.stringify(g.active.cells),original);
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
 const g=new Game();g.reset('place');g.moves=2;g.advance(12000);assert.ok(g.mosquito);const speed=g.mosquito.speed;g.advance(4200);assert.ok(g.board.flat().includes(BLOCK));g.stage=35;g.prepareStage();g.appearMosquito();assert.ok(g.mosquito.speed>speed*2);
});
