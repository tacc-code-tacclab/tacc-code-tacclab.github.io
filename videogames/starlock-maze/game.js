(()=>{
  "use strict";

  const canvas=document.querySelector("#game"),ctx=canvas.getContext("2d",{alpha:false,desynchronized:true});
  const $=selector=>document.querySelector(selector);
  const ui={menu:$("#menu"),play:$("#play-btn"),hud:$("#hud"),score:$("#score"),level:$("#level"),lives:$("#lives"),power:$("#power-fill"),ammo:$("#ammo"),sound:$("#sound-btn"),pauseButton:$("#pause-btn"),watch:$("#watch-state"),status:$("#status"),pause:$("#pause"),resume:$("#resume-btn"),quit:$("#quit-btn"),clear:$("#level-clear"),bonus:$("#level-bonus"),next:$("#next-btn"),gameover:$("#gameover"),finalScore:$("#final-score"),finalLevel:$("#final-level"),finalWalls:$("#final-walls"),again:$("#again-btn"),home:$("#home-btn"),best:$("#best-score"),bestLevel:$("#best-level"),mobile:$("#mobile-controls"),fire:$("#fire-btn")};
  const TAU=Math.PI*2,COLS=23,ROWS=17,SIM_STEP=1/120,TURN_ASSIST=.45,POWER_TIME=10.5,coarse=matchMedia("(pointer:coarse)").matches;
  const DIR={left:{x:-1,y:0,a:Math.PI},right:{x:1,y:0,a:0},up:{x:0,y:-1,a:-Math.PI/2},down:{x:0,y:1,a:Math.PI/2},none:{x:0,y:0,a:0}};
  const OPP={left:"right",right:"left",up:"down",down:"up",none:"none"},ENEMY_COLORS=["#ff50c8","#62f6ff","#ffe26d","#9a77ff"];
  const safeStorage={get(keyName,fallback=0){try{return JSON.parse(localStorage.getItem(keyName))??fallback}catch{return fallback}},set(keyName,value){try{localStorage.setItem(keyName,JSON.stringify(value))}catch{}}};
  let best=Number(safeStorage.get("starlockBest",0))||0,bestLevel=Number(safeStorage.get("starlockLevel",1))||1;
  let vw=innerWidth,vh=innerHeight,dpr=1,tile=24,mapW=0,mapH=0,originX=0,originY=110,ambient=0,last=performance.now(),lastDraw=0,simAccumulator=0,state=null,mazeLayer=null;
  let audioCtx=null,master=null,soundOn=safeStorage.get("starlockSound",true)!==false,musicTimer=.1,musicStep=0,firing=false;
  const heldDirections=[],stars=Array.from({length:100},(_,i)=>({x:(i*137.13)%1000,y:(i*71.77)%800,r:.4+(i%5)*.25,p:i*.73}));
  const MUSIC=[196,246.94,293.66,369.99,293.66,246.94,220,277.18,329.63,415.3,329.63,277.18];

  function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
  function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
  function key(x,y){return x+","+y}
  function show(element,on){element.classList.toggle("active",on)}
  function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}

  function resize(){
    vw=innerWidth;vh=innerHeight;dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);canvas.style.width=vw+"px";canvas.style.height=vh+"px";
    const top=coarse?104:130,bottom=coarse?8:17,pad=coarse?7:17;tile=Math.max(9,Math.min((vw-pad*2)/COLS,(vh-top-bottom)/ROWS));mapW=tile*COLS;mapH=tile*ROWS;originX=(vw-mapW)/2;originY=top+Math.max(0,(vh-top-bottom-mapH)/2);if(state?.maze)buildMazeLayer()
  }

  function initAudio(){if(audioCtx)return;try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();master=audioCtx.createGain();master.gain.value=soundOn ? .22 : 0;master.connect(audioCtx.destination)}catch{}}
  function tone(kind){
    if(!audioCtx||!soundOn)return;const now=audioCtx.currentTime,osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),cfg={dot:[520,760,.035,"sine",.05],power:[190,1120,.38,"sawtooth",.13],warning:[440,220,.32,"square",.11],watch:[120,58,.52,"sawtooth",.18],safe:[240,620,.22,"triangle",.08],shoot:[890,250,.11,"square",.08],wall:[130,45,.18,"sawtooth",.15],enemy:[230,980,.25,"triangle",.12],hurt:[105,42,.45,"sawtooth",.2],level:[330,1320,.58,"triangle",.13],start:[180,760,.38,"triangle",.11]}[kind]||[260,420,.12,"sine",.08];
    osc.type=cfg[3];osc.frequency.setValueAtTime(cfg[0],now);osc.frequency.exponentialRampToValueAtTime(Math.max(30,cfg[1]),now+cfg[2]);gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(cfg[4],now+.012);gain.gain.exponentialRampToValueAtTime(.001,now+cfg[2]);osc.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+cfg[2]+.02)
  }
  function musicNote(frequency,duration,volume){if(!audioCtx||!master)return;const now=audioCtx.currentTime,osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type="triangle";osc.frequency.value=frequency;gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.018);gain.gain.exponentialRampToValueAtTime(.001,now+duration);osc.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+duration+.02)}
  function backgroundMusic(dt){if(!audioCtx||!soundOn||!state||state.mode!=="playing")return;musicTimer-=dt;if(musicTimer>0)return;const watching=state.lightMode==="watch";musicTimer=watching ? .38 : .24;const note=MUSIC[musicStep%MUSIC.length];musicNote(note*(watching ? .5 : 1),musicTimer*.8,watching ? .018 : .027);if(musicStep%4===0)musicNote(note/4,musicTimer*2.5,.018);musicStep++}

  function makeMaze(level){
    const rng=mulberry32((0x51a7f00d^(level*0x9e3779b9))>>>0),grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>x===0||y===0||x===COLS-1||y===ROWS-1?2:1));
    const stack=[[1,1]];grid[1][1]=0;
    while(stack.length){const [x,y]=stack[stack.length-1],choices=[];for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){const nx=x+dx,ny=y+dy;if(nx>0&&nx<COLS-1&&ny>0&&ny<ROWS-1&&grid[ny][nx]===1)choices.push([nx,ny,dx/2,dy/2])}if(!choices.length){stack.pop();continue}const pick=choices[Math.floor(rng()*choices.length)];grid[y+pick[3]][x+pick[2]]=0;grid[pick[1]][pick[0]]=0;stack.push([pick[0],pick[1]])}
    for(let y=2;y<ROWS-2;y++)for(let x=2;x<COLS-2;x++){if(grid[y][x]!==1||rng()>.15)continue;const horizontal=grid[y][x-1]===0&&grid[y][x+1]===0,vertical=grid[y-1][x]===0&&grid[y+1][x]===0;if(horizontal||vertical)grid[y][x]=0}
    for(let y=7;y<=9;y++)for(let x=9;x<=13;x++)grid[y][x]=0;for(let y=5;y<=11;y++)grid[y][11]=0;
    for(let x=8;x<=14;x++)grid[ROWS-2][x]=0;for(let y=ROWS-5;y<=ROWS-2;y++)grid[y][11]=0;
    return{grid,rng}
  }
  function isOpen(maze,x,y){return x>=0&&x<COLS&&y>=0&&y<ROWS&&maze.grid[y][x]===0}
  function nearestOpen(maze,sx,sy,used=new Set()){
    const queue=[[clamp(sx,1,COLS-2),clamp(sy,1,ROWS-2)]],seen=new Set();while(queue.length){const [x,y]=queue.shift(),cellKey=key(x,y);if(seen.has(cellKey))continue;seen.add(cellKey);if(isOpen(maze,x,y)&&!used.has(cellKey))return{x,y};for(const direction of Object.values(DIR).slice(0,4)){const nx=x+direction.x,ny=y+direction.y;if(nx>0&&nx<COLS-1&&ny>0&&ny<ROWS-1)queue.push([nx,ny])}}return{x:1,y:1}
  }
  function entityAt(cell){return{x:cell.x+.5,y:cell.y+.5,dir:"none",wanted:"none",facing:"left",angle:Math.PI}}

  function prepareLevel(level){
    const made=makeMaze(level),maze={grid:made.grid};state.maze=maze;state.level=level;const used=new Set(),start=nearestOpen(maze,11,ROWS-2,used);used.add(key(start.x,start.y));const homes=[[11,8],[10,8],[12,8],[11,7]].map(([x,y])=>{const point=nearestOpen(maze,x,y,used);used.add(key(point.x,point.y));return point});
    state.player={...entityAt(start),invuln:2.2,moved:false,trail:[],color:"#62f6ff",accent:"#ff50c8"};state.playerStart=start;
    state.enemies=homes.map((home,index)=>({...entityAt(home),home,index,color:ENEMY_COLORS[index],spawnDelay:1.35+index*.52,phase:index*1.8,dir:index%2?"left":"right"}));
    state.pellets=new Set();state.bonuses=new Set();state.bullets=[];state.particles=[];state.power=0;state.ammo=0;state.fireCooldown=0;state.flash=0;state.shake=0;state.statusTimer=0;
    for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++){if(!isOpen(maze,x,y))continue;const farFromStart=Math.abs(x-start.x)+Math.abs(y-start.y)>2,farFromHome=Math.abs(x-11)+Math.abs(y-8)>2;if(farFromStart&&farFromHome)state.pellets.add(key(x,y))}
    for(const [x,y] of [[1,1],[COLS-2,1],[1,ROWS-2],[COLS-2,ROWS-2]]){const point=nearestOpen(maze,x,y),cellKey=key(point.x,point.y);state.pellets.delete(cellKey);state.bonuses.add(cellKey)}
    state.mode="playing";setLight("sleep",3.8+Math.random()*1.4,false);heldDirections.length=0;firing=false;buildMazeLayer();show(ui.clear,false);show(ui.pause,false);show(ui.gameover,false);updateHud();toast("LEVEL "+level+" · MOVE WHILE IT SLEEPS")
  }
  function createRun(){state={mode:"playing",score:0,level:1,lives:3,wallsBlasted:0,maxLevel:1};musicTimer=.1;musicStep=0;simAccumulator=0;prepareLevel(1);show(ui.menu,false);show(ui.hud,true);show(ui.watch,true);ui.hud.setAttribute("aria-hidden","false");ui.mobile.classList.toggle("active",coarse);ui.fire.classList.toggle("active",coarse);initAudio();audioCtx?.resume();tone("start")}

  function cellOf(entity){return{x:Math.floor(entity.x),y:Math.floor(entity.y)}}
  function canMoveFrom(x,y,name){const direction=DIR[name];return isOpen(state.maze,x+direction.x,y+direction.y)}
  function canMove(entity,name){const cell=cellOf(entity);return canMoveFrom(cell.x,cell.y,name)}
  function atCenter(entity){return Math.abs(entity.x-(Math.floor(entity.x)+.5))<.0001&&Math.abs(entity.y-(Math.floor(entity.y)+.5))<.0001}
  function applyResponsiveTurn(player){
    const wanted=player.wanted;if(!wanted||wanted==="none"||wanted===player.dir)return;
    if(player.dir==="none"){if(canMove(player,wanted))player.dir=wanted;return}
    if(wanted===OPP[player.dir]){player.dir=wanted;return}
    if(atCenter(player)){if(canMove(player,wanted))player.dir=wanted;return}
    const moving=DIR[player.dir],turnAt=(tx,ty)=>{const gap=Math.abs(tx-player.x)+Math.abs(ty-player.y),cx=Math.floor(tx),cy=Math.floor(ty);if(gap>TURN_ASSIST||!canMoveFrom(cx,cy,wanted))return false;player.x=tx;player.y=ty;player.dir=wanted;return true};
    const nearX=moving.x?Math.floor(player.x)+.5:player.x,nearY=moving.y?Math.floor(player.y)+.5:player.y;if(turnAt(nearX,nearY))return;
    let tx=player.x,ty=player.y;if(moving.x>0)tx=Math.floor(player.x+.5)+.5;else if(moving.x<0)tx=Math.ceil(player.x-.5)-.5;else if(moving.y>0)ty=Math.floor(player.y+.5)+.5;else if(moving.y<0)ty=Math.ceil(player.y-.5)-.5;turnAt(tx,ty)
  }
  function walkGrid(entity,distanceLeft,chooseDirection){
    for(let guard=0;guard<3&&distanceLeft>.00001;guard++){
      if(atCenter(entity)){entity.x=Math.floor(entity.x)+.5;entity.y=Math.floor(entity.y)+.5;chooseDirection();if(entity.dir==="none")break}
      const direction=DIR[entity.dir],cx=Math.floor(entity.x)+.5,cy=Math.floor(entity.y)+.5;let targetX=entity.x,targetY=entity.y;
      if(direction.x>0)targetX=entity.x<cx-.0001?cx:cx+1;else if(direction.x<0)targetX=entity.x>cx+.0001?cx:cx-1;else if(direction.y>0)targetY=entity.y<cy-.0001?cy:cy+1;else if(direction.y<0)targetY=entity.y>cy+.0001?cy:cy-1;
      const toTarget=Math.abs(targetX-entity.x)+Math.abs(targetY-entity.y),travel=Math.min(distanceLeft,toTarget);entity.x+=direction.x*travel;entity.y+=direction.y*travel;distanceLeft-=travel;
      if(travel+1e-6>=toTarget){entity.x=targetX;entity.y=targetY}else break
    }
  }
  function movePlayer(dt){
    const player=state.player;player.moved=false;for(const trail of player.trail)trail.a*=.88;if(!heldDirections.length)return;
    player.wanted=heldDirections[heldDirections.length-1];applyResponsiveTurn(player);const oldX=player.x,oldY=player.y,speed=(7.25+Math.min(1.15,(state.level-1)*.1))*(state.power>0?1.08:1);
    walkGrid(player,speed*dt,()=>{if(canMove(player,player.wanted))player.dir=player.wanted;else if(!canMove(player,player.dir))player.dir="none"});player.moved=Math.hypot(player.x-oldX,player.y-oldY)>.0001;
    if(player.moved){player.facing=player.dir;player.angle=DIR[player.dir].a;player.trail.unshift({x:player.x,y:player.y,a:1});if(player.trail.length>11)player.trail.pop()}
  }
  function enemyTarget(enemy){const player=cellOf(state.player),direction=DIR[state.player.facing];if(enemy.index===0)return player;if(enemy.index===1)return{x:clamp(player.x+direction.x*3,1,COLS-2),y:clamp(player.y+direction.y*3,1,ROWS-2)};if(enemy.index===2)return Math.random()<.72?player:{x:COLS-2-player.x,y:ROWS-2-player.y};return distance(enemy,state.player)>6?player:{x:enemy.home.x,y:enemy.home.y}}
  function chooseEnemyDirection(enemy){const options=[];for(const name of ["left","right","up","down"])if(canMove(enemy,name))options.push(name);let choices=options.filter(name=>name!==OPP[enemy.dir]);if(!choices.length)choices=options;if(!choices.length)return"none";if(Math.random()<(enemy.index===3 ? .22 : .07))return choices[Math.floor(Math.random()*choices.length)];const target=enemyTarget(enemy),afraid=state.power>0;choices.sort((a,b)=>{const da=DIR[a],db=DIR[b],aa=Math.abs(enemy.x+da.x-(target.x+.5))+Math.abs(enemy.y+da.y-(target.y+.5)),bb=Math.abs(enemy.x+db.x-(target.x+.5))+Math.abs(enemy.y+db.y-(target.y+.5));return afraid ? bb-aa : aa-bb});return choices[0]}
  function moveEnemy(enemy,dt){enemy.phase+=dt*(2.2+enemy.index*.18);if(enemy.spawnDelay>0){enemy.spawnDelay-=dt;return}if(state.lightMode==="watch")return;const speed=(3.35+state.level*.14+enemy.index*.05)*(state.power>0 ? .72 : 1);walkGrid(enemy,speed*dt,()=>{enemy.dir=chooseEnemyDirection(enemy)})}

  function setLight(mode,duration,audible=true){
    state.lightMode=mode;state.lightTimer=duration;state.lightTotal=duration;ui.watch.classList.remove("sleep","warning","watch");ui.watch.classList.add(mode);
    if(mode==="sleep"){ui.watch.querySelector("span").textContent="SAFE TO MOVE";if(audible)tone("safe")}
    else if(mode==="warning"){ui.watch.querySelector("span").textContent="STAR IS TURNING...";if(audible)tone("warning");toast("GET READY TO FREEZE")}
    else{ui.watch.querySelector("span").textContent="FREEZE! IT IS WATCHING";if(audible)tone("watch");state.flash=Math.max(state.flash,.28)}
  }
  function updateWatcher(dt){
    state.lightTimer-=dt;if(state.lightTimer<=0){if(state.lightMode==="sleep")setLight("warning",Math.max(.46,.78-state.level*.025));else if(state.lightMode==="warning")setLight("watch",1.15+Math.random()*.78+state.level*.025);else setLight("sleep",Math.max(2.35,4.45-state.level*.16)+Math.random()*1.65)}
    if(state.lightMode==="watch"&&state.player.moved)loseLife("CAUGHT MOVING · RELEASE TO FREEZE")
  }

  function collect(){
    const cell=cellOf(state.player),cellKey=key(cell.x,cell.y);
    if(state.pellets.delete(cellKey)){state.score+=10;state.pelletBeat=(state.pelletBeat||0)+1;if(state.pelletBeat%4===0)tone("dot");burst(cell.x+.5,cell.y+.5,"#bfffff",2,.42)}
    if(state.bonuses.delete(cellKey)){state.score+=150;state.power=POWER_TIME;state.ammo=Math.min(28,state.ammo+14);tone("power");burst(cell.x+.5,cell.y+.5,"#ffe26d",25,1.8);toast("POWER PEARL · EAT HUNTERS · BLAST WALLS")}
    if(state.pellets.size+state.bonuses.size===0)completeLevel()
  }
  function defeatEnemy(enemy,shot=false){state.score+=shot?300:250;enemy.x=enemy.home.x+.5;enemy.y=enemy.home.y+.5;enemy.dir="none";enemy.spawnDelay=2.4;burst(enemy.x,enemy.y,enemy.color,24,1.8);tone("enemy");toast(shot?"HUNTER BLASTED +300":"HUNTER EATEN +250")}
  function collideEnemies(){if(state.player.invuln>0)return;for(const enemy of state.enemies){if(enemy.spawnDelay>0||distance(state.player,enemy)>.62)continue;if(state.power>0)defeatEnemy(enemy,false);else{loseLife("A HUNTER CAUGHT YOU");return}}}
  function fire(announce=false){
    if(!state||state.mode!=="playing")return;if(state.power<=0||state.ammo<=0){if(announce)toast("FIND A POWER PEARL FIRST");return}if(state.fireCooldown>0)return;const name=state.player.facing==="none"?"right":state.player.facing,direction=DIR[name];state.bullets.push({x:state.player.x+direction.x*.42,y:state.player.y+direction.y*.42,dx:direction.x,dy:direction.y,life:1.55});state.ammo--;state.fireCooldown=.16;tone("shoot");burst(state.player.x+direction.x*.4,state.player.y+direction.y*.4,"#ffe26d",5,.8)
  }
  function updateBullets(dt){
    for(const bullet of state.bullets){bullet.x+=bullet.dx*14.5*dt;bullet.y+=bullet.dy*14.5*dt;bullet.life-=dt;if(bullet.x<0||bullet.x>=COLS||bullet.y<0||bullet.y>=ROWS){bullet.life=0;continue}const x=Math.floor(bullet.x),y=Math.floor(bullet.y),wall=state.maze.grid[y][x];if(wall===1){state.maze.grid[y][x]=0;state.score+=25;state.wallsBlasted++;bullet.life=0;buildMazeLayer();burst(x+.5,y+.5,"#ff50c8",18,1.5);tone("wall");continue}if(wall===2){bullet.life=0;continue}for(const enemy of state.enemies){if(enemy.spawnDelay<=0&&distance(bullet,enemy)<.5){defeatEnemy(enemy,true);bullet.life=0;break}}}state.bullets=state.bullets.filter(bullet=>bullet.life>0)
  }

  function loseLife(message){
    if(!state||state.mode!=="playing")return;state.lives--;heldDirections.length=0;firing=false;setPressedVisual();state.power=0;state.ammo=0;state.bullets=[];state.shake=14;state.flash=.9;tone("hurt");burst(state.player.x,state.player.y,"#ff416c",38,2.3);
    if(state.lives<=0){finish();return}const start=state.playerStart;Object.assign(state.player,{x:start.x+.5,y:start.y+.5,dir:"none",wanted:"none",facing:"left",angle:Math.PI,moved:false,invuln:2,trail:[]});state.enemies.forEach((enemy,index)=>Object.assign(enemy,{x:enemy.home.x+.5,y:enemy.home.y+.5,dir:"none",spawnDelay:1.2+index*.45}));setLight("sleep",3.3+Math.random()*1.1,false);toast(message+" · "+state.lives+" LIVES LEFT")
  }
  function completeLevel(){if(state.mode!=="playing")return;state.mode="clear";heldDirections.length=0;firing=false;setPressedVisual();const bonus=1000*state.level*state.lives;state.score+=bonus;state.maxLevel=Math.max(state.maxLevel,state.level);ui.bonus.textContent="Level bonus +"+bonus.toLocaleString();updateRecords();updateHud();show(ui.clear,true);ui.mobile.classList.remove("active");ui.fire.classList.remove("active");tone("level")}
  function nextLevel(){prepareLevel(state.level+1);state.maxLevel=Math.max(state.maxLevel,state.level);ui.mobile.classList.toggle("active",coarse);ui.fire.classList.toggle("active",coarse);tone("start")}
  function updateRecords(){const score=Math.round(state?.score||0),level=state?.maxLevel||1;if(score>best){best=score;safeStorage.set("starlockBest",best)}if(level>bestLevel){bestLevel=level;safeStorage.set("starlockLevel",bestLevel)}ui.best.textContent=best.toLocaleString();ui.bestLevel.textContent=bestLevel}
  function finish(){state.mode="gameover";updateRecords();ui.finalScore.textContent=Math.round(state.score).toLocaleString();ui.finalLevel.textContent=state.level;ui.finalWalls.textContent=state.wallsBlasted;show(ui.gameover,true);ui.mobile.classList.remove("active");ui.fire.classList.remove("active");tone("hurt")}
  function pause(){if(!state||state.mode!=="playing")return;state.mode="paused";heldDirections.length=0;firing=false;setPressedVisual();show(ui.pause,true);ui.mobile.classList.remove("active");ui.fire.classList.remove("active")}
  function resume(){if(!state||state.mode!=="paused")return;state.mode="playing";show(ui.pause,false);ui.mobile.classList.toggle("active",coarse);ui.fire.classList.toggle("active",coarse);audioCtx?.resume()}
  function menu(){if(state)updateRecords();state=null;heldDirections.length=0;firing=false;show(ui.pause,false);show(ui.clear,false);show(ui.gameover,false);show(ui.hud,false);show(ui.watch,false);ui.hud.setAttribute("aria-hidden","true");ui.mobile.classList.remove("active");ui.fire.classList.remove("active");show(ui.menu,true);updateRecords()}

  function burst(x,y,color,count=12,speed=1){if(!state)return;for(let i=0;i<count;i++){const angle=Math.random()*TAU,force=speed*(.35+Math.random()*.85);state.particles.push({x,y,vx:Math.cos(angle)*force,vy:Math.sin(angle)*force,life:.35+Math.random()*.5,max:.85,r:.05+Math.random()*.09,color})}if(state.particles.length>360)state.particles.splice(0,state.particles.length-360)}
  function toast(text){ui.status.textContent=text;ui.status.classList.add("show");if(state)state.statusTimer=2.05}
  function updateHud(){if(!state)return;ui.score.textContent=Math.round(state.score).toLocaleString();ui.level.textContent=state.level;ui.lives.textContent=Array.from({length:state.lives},()=>"◆").join(" ");ui.power.style.width=clamp(state.power/POWER_TIME*100,0,100)+"%";ui.ammo.textContent=state.ammo+" SHOTS";ui.sound.classList.toggle("muted",!soundOn);ui.sound.textContent=soundOn?"♪":"×";ui.fire.classList.toggle("ready",state.power>0&&state.ammo>0)}

  function update(dt){
    state.player.invuln=Math.max(0,state.player.invuln-dt);state.power=Math.max(0,state.power-dt);if(state.power<=0)state.ammo=0;state.fireCooldown=Math.max(0,state.fireCooldown-dt);state.shake=Math.max(0,state.shake-dt*25);state.flash=Math.max(0,state.flash-dt*2.7);
    movePlayer(dt);updateWatcher(dt);for(const enemy of state.enemies)moveEnemy(enemy,dt);collect();if(state.mode!=="playing")return;collideEnemies();if(firing)fire(false);updateBullets(dt);
    for(const particle of state.particles){particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vx*=Math.pow(.06,dt);particle.vy*=Math.pow(.06,dt);particle.life-=dt}state.particles=state.particles.filter(particle=>particle.life>0);
    if(state.statusTimer>0&&(state.statusTimer-=dt)<=0)ui.status.classList.remove("show");backgroundMusic(dt);updateHud()
  }

  function polygon(context,x,y,radius,points,rotation=0,inner=0){context.beginPath();const count=inner?points*2:points;for(let i=0;i<count;i++){const angle=rotation+i*TAU/count,r=inner&&i%2?radius*inner:radius,px=x+Math.cos(angle)*r,py=y+Math.sin(angle)*r;i?context.lineTo(px,py):context.moveTo(px,py)}context.closePath()}
  function buildMazeLayer(){
    if(!state?.maze)return;const bleed=5,layerW=mapW+bleed*2,layerH=mapH+bleed*2;mazeLayer=document.createElement("canvas");mazeLayer.width=Math.max(1,Math.ceil(layerW*dpr));mazeLayer.height=Math.max(1,Math.ceil(layerH*dpr));const layer=mazeLayer.getContext("2d");layer.setTransform(dpr,0,0,dpr,0,0);layer.fillStyle="rgba(3,3,19,.96)";layer.beginPath();layer.roundRect(0,0,layerW,layerH,10);layer.fill();
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const px=bleed+x*tile,py=bleed+y*tile,wall=state.maze.grid[y][x];if(wall){const solid=wall===2,gradient=layer.createLinearGradient(px,py,px+tile,py+tile);gradient.addColorStop(0,solid?"#174d6e":"#35276e");gradient.addColorStop(.55,solid?"#0b2343":"#17113f");gradient.addColorStop(1,"#07051f");layer.fillStyle=gradient;layer.strokeStyle=solid?"rgba(98,246,255,.78)":"rgba(255,80,200,.58)";layer.lineWidth=Math.max(1,tile*.055);layer.beginPath();layer.roundRect(px+tile*.06,py+tile*.06,tile*.88,tile*.88,tile*.17);layer.fill();layer.stroke();layer.strokeStyle=solid?"rgba(255,255,255,.18)":"rgba(255,226,109,.22)";layer.lineWidth=Math.max(.6,tile*.025);layer.beginPath();layer.moveTo(px+tile*.2,py+tile*.21);layer.lineTo(px+tile*.76,py+tile*.76);if(!solid){layer.moveTo(px+tile*.72,py+tile*.22);layer.lineTo(px+tile*.28,py+tile*.66)}layer.stroke()}else{layer.fillStyle=(x+y)%2?"rgba(95,248,255,.035)":"rgba(134,95,255,.035)";layer.fillRect(px,py,tile,tile)}}
  }
  function drawBackdrop(time){
    ctx.setTransform(dpr,0,0,dpr,0,0);const gradient=ctx.createLinearGradient(0,0,vw,vh);gradient.addColorStop(0,"#07031f");gradient.addColorStop(.5,"#13072d");gradient.addColorStop(1,"#021a25");ctx.fillStyle=gradient;ctx.fillRect(0,0,vw,vh);
    ctx.save();ctx.globalAlpha=.18;ctx.strokeStyle="#62f6ff";ctx.lineWidth=1;const gap=52,offset=(time*8)%gap;for(let x=-gap+offset;x<vw+gap;x+=gap){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(vw/2+(x-vw/2)*.32,vh);ctx.stroke()}ctx.restore();
    for(const star of stars){const x=(star.x/1000*vw+time*(3+star.r))%(vw+8)-4,y=star.y/800*vh;ctx.globalAlpha=.2+.23*Math.sin(time+star.p);ctx.fillStyle=star.r>1?"#ff71cf":"#79faff";ctx.beginPath();ctx.arc(x,y,star.r,0,TAU);ctx.fill()}ctx.globalAlpha=1
  }
  function sx(x){return originX+x*tile}function sy(y){return originY+y*tile}
  function drawMaze(){if(mazeLayer)ctx.drawImage(mazeLayer,originX-5,originY-5,mapW+10,mapH+10)}
  function drawPellets(){ctx.save();ctx.fillStyle="#d8ffff";ctx.shadowColor="#62f6ff";ctx.shadowBlur=Math.min(5,tile*.2);ctx.beginPath();for(const cellKey of state.pellets){const comma=cellKey.indexOf(","),x=Number(cellKey.slice(0,comma)),y=Number(cellKey.slice(comma+1)),px=sx(x+.5),py=sy(y+.5),radius=Math.max(1.45,tile*.095);ctx.moveTo(px+radius,py);ctx.arc(px,py,radius,0,TAU)}ctx.fill();ctx.restore();for(const cellKey of state.bonuses){const [x,y]=cellKey.split(",").map(Number),px=sx(x+.5),py=sy(y+.5),pulse=1+Math.sin(ambient*6+x)*.12;ctx.save();ctx.translate(px,py);ctx.rotate(ambient*.8);ctx.strokeStyle="#fff5b0";ctx.fillStyle="#ffe26d";ctx.lineWidth=Math.max(1.2,tile*.08);ctx.shadowColor="#ffe26d";ctx.shadowBlur=tile*.65;polygon(ctx,0,0,tile*.28*pulse,8,Math.PI/8,.48);ctx.fill();ctx.stroke();ctx.restore()}}
  function drawStarfish(x,y,radius,mode){
    ctx.save();if(mode==="watch"){const beam=ctx.createLinearGradient(x,y,x,originY+mapH);beam.addColorStop(0,"rgba(255,70,112,.28)");beam.addColorStop(1,"rgba(255,70,112,0)");ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(x-radius*.52,y+radius*.25);ctx.lineTo(originX+mapW*.14,originY+mapH);ctx.lineTo(originX+mapW*.86,originY+mapH);ctx.lineTo(x+radius*.52,y+radius*.25);ctx.closePath();ctx.fill()}
    ctx.translate(x,y);ctx.rotate(mode==="sleep"?Math.sin(ambient*1.7)*.09:Math.sin(ambient*8)*.025);const color=mode==="sleep"?"#7663e8":mode==="warning"?"#ffe26d":"#ff5078";ctx.shadowColor=color;ctx.shadowBlur=mode==="watch"?28:18;const gradient=ctx.createRadialGradient(-radius*.2,-radius*.25,1,0,0,radius);gradient.addColorStop(0,"#fff1c9");gradient.addColorStop(.18,mode==="sleep"?"#6beaff":mode==="warning"?"#ffca67":"#ff8a9e");gradient.addColorStop(.55,color);gradient.addColorStop(1,"#4b1e73");ctx.fillStyle=gradient;ctx.strokeStyle=mode==="watch"?"#ffd6df":"#bfffff";ctx.lineWidth=Math.max(1.5,radius*.07);polygon(ctx,0,0,radius,5,-Math.PI/2,.42);ctx.fill();ctx.stroke();
    if(mode==="sleep"){ctx.strokeStyle="#160b31";ctx.lineWidth=Math.max(2,radius*.08);for(const ex of [-radius*.2,radius*.2]){ctx.beginPath();ctx.arc(ex,-radius*.02,radius*.11,.15,Math.PI-.15);ctx.stroke()}ctx.fillStyle="#8efaff";ctx.font=`900 ${Math.max(8,radius*.32)}px system-ui`;ctx.fillText("Z",radius*.62,-radius*.48)}else{for(const ex of [-radius*.2,radius*.2]){ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(ex,-radius*.04,radius*.13,radius*(mode==="warning" ? .07 : .15),0,0,TAU);ctx.fill();if(mode==="watch"){ctx.fillStyle="#17051f";ctx.beginPath();ctx.arc(ex,-radius*.03,radius*.055,0,TAU);ctx.fill()}}ctx.strokeStyle="#3a0a2e";ctx.lineWidth=Math.max(1.5,radius*.06);ctx.beginPath();ctx.arc(0,radius*.16,radius*.2,0,Math.PI);ctx.stroke()}ctx.restore()
  }
  function drawPlayer(player){
    const px=sx(player.x),py=sy(player.y),radius=tile*.37,blink=player.invuln>0&&Math.floor(player.invuln*12)%2===0;ctx.save();for(let i=player.trail.length-1;i>=0;i--){const trail=player.trail[i];ctx.globalAlpha=trail.a*.14;ctx.fillStyle=player.color;ctx.beginPath();ctx.arc(sx(trail.x),sy(trail.y),radius*(.3+trail.a*.35),0,TAU);ctx.fill()}ctx.globalAlpha=blink ? .35 : 1;ctx.translate(px,py);ctx.rotate(player.angle);ctx.shadowColor=player.color;ctx.shadowBlur=tile*.7;ctx.fillStyle="#10103b";ctx.strokeStyle=player.color;ctx.lineWidth=Math.max(1.4,tile*.085);ctx.beginPath();ctx.moveTo(-radius*.8,-radius*.55);ctx.quadraticCurveTo(radius*.32,-radius*.95,radius*.86,-radius*.16);ctx.lineTo(radius*.72,radius*.64);ctx.quadraticCurveTo(-radius*.08,radius*.95,-radius*.78,radius*.47);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#eaffff";ctx.beginPath();ctx.ellipse(radius*.34,-radius*.26,radius*.36,radius*.2,-.08,0,TAU);ctx.fill();ctx.fillStyle="#174e9d";ctx.beginPath();ctx.ellipse(radius*.43,-radius*.25,radius*.17,radius*.1,0,0,TAU);ctx.fill();ctx.fillStyle=player.accent;ctx.beginPath();ctx.moveTo(-radius*.6,radius*.04);ctx.lineTo(-radius*1.28,radius*.56+Math.sin(ambient*10)*radius*.08);ctx.lineTo(-radius*.56,radius*.58);ctx.closePath();ctx.fill();ctx.restore()
  }
  function drawEnemy(enemy){if(enemy.spawnDelay>0&&Math.floor(enemy.spawnDelay*7)%2)return;const px=sx(enemy.x),py=sy(enemy.y),radius=tile*.36,vulnerable=state.power>0,color=vulnerable?"#4b75ff":enemy.color;ctx.save();ctx.translate(px,py);ctx.rotate(Math.sin(enemy.phase)*.09);ctx.shadowColor=color;ctx.shadowBlur=tile*.66;ctx.fillStyle="#0b0828";ctx.strokeStyle=color;ctx.lineWidth=Math.max(1.4,tile*.08);polygon(ctx,0,0,radius,6,enemy.phase*.07,.62);ctx.fill();ctx.stroke();ctx.fillStyle="#f4ffff";ctx.beginPath();ctx.ellipse(radius*.22,-radius*.1,radius*.2,radius*.14,0,0,TAU);ctx.fill();ctx.fillStyle="#071128";ctx.beginPath();ctx.arc(radius*.27,-radius*.1,radius*.065,0,TAU);ctx.fill();if(vulnerable){ctx.strokeStyle="#d8ffff";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-radius*.3,radius*.2);ctx.lineTo(-radius*.1,radius*.05);ctx.lineTo(radius*.1,radius*.2);ctx.lineTo(radius*.3,radius*.04);ctx.stroke()}ctx.restore()}
  function drawBullets(){for(const bullet of state.bullets){const x=sx(bullet.x),y=sy(bullet.y),length=tile*.45;ctx.save();ctx.strokeStyle="#fff5aa";ctx.lineWidth=Math.max(2,tile*.13);ctx.lineCap="round";ctx.shadowColor="#ff50c8";ctx.shadowBlur=13;ctx.beginPath();ctx.moveTo(x-bullet.dx*length,y-bullet.dy*length);ctx.lineTo(x+bullet.dx*length*.25,y+bullet.dy*length*.25);ctx.stroke();ctx.restore()}}
  function drawParticles(){for(const particle of state.particles){ctx.globalAlpha=clamp(particle.life/particle.max,0,1);ctx.fillStyle=particle.color;ctx.shadowColor=particle.color;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(sx(particle.x),sy(particle.y),Math.max(1,particle.r*tile),0,TAU);ctx.fill()}ctx.globalAlpha=1;ctx.shadowBlur=0}
  function drawGame(){drawBackdrop(ambient);ctx.save();if(state.shake>0)ctx.translate((Math.random()-.5)*state.shake,(Math.random()-.5)*state.shake);drawMaze();drawPellets();for(const enemy of state.enemies)drawEnemy(enemy);drawPlayer(state.player);drawBullets();drawParticles();const starX=originX+mapW*.82,starY=originY-(coarse?24:35),starRadius=Math.min(34,tile*1.55);drawStarfish(starX,starY,starRadius,state.lightMode);ctx.restore();if(state.flash>0){ctx.globalAlpha=state.flash*.25;ctx.fillStyle=state.lightMode==="watch"?"#ff365f":"#62f6ff";ctx.fillRect(0,0,vw,vh);ctx.globalAlpha=1}}
  function drawMenu(time){drawBackdrop(time);ctx.save();ctx.globalAlpha=.14;ctx.strokeStyle="#62f6ff";ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.roundRect(vw*.5-240-i*17,vh*.52-150-i*12,480+i*34,300+i*24,22);ctx.stroke()}ctx.restore();drawStarfish(vw*.82,vh*.25,Math.min(64,vw*.065),Math.floor(time/3)%2?"sleep":"watch")}
  function frame(now){const dt=Math.min(.1,Math.max(.001,(now-last)/1000));last=now;ambient+=dt;if(state&&state.mode==="playing"){simAccumulator=Math.min(.12,simAccumulator+dt);while(simAccumulator>=SIM_STEP&&state?.mode==="playing"){update(SIM_STEP);simAccumulator-=SIM_STEP}}else simAccumulator=0;const drawInterval=1000/(coarse?30:60);if(now-lastDraw>=drawInterval){lastDraw=now;if(state)drawGame();else drawMenu(ambient)}requestAnimationFrame(frame)}

  function setPressedVisual(){document.querySelectorAll(".move").forEach(button=>button.classList.toggle("pressed",heldDirections.includes(button.dataset.direction)))}
  function pressDirection(name){if(!state||state.mode!=="playing")return;if(!heldDirections.includes(name))heldDirections.push(name);state.player.wanted=name;applyResponsiveTurn(state.player);setPressedVisual();initAudio();audioCtx?.resume()}
  function releaseDirection(name){let index;while((index=heldDirections.indexOf(name))>=0)heldDirections.splice(index,1);if(heldDirections.length)state.player.wanted=heldDirections[heldDirections.length-1];setPressedVisual()}
  addEventListener("keydown",event=>{const map={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"},name=map[event.key];if(name){event.preventDefault();if(!event.repeat)pressDirection(name);return}if(event.code==="Space"||event.key.toLowerCase()==="x"){event.preventDefault();firing=true;if(!event.repeat)fire(true)}if(event.key==="Escape"){if(state?.mode==="playing")pause();else if(state?.mode==="paused")resume()}},{passive:false});
  addEventListener("keyup",event=>{const map={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"},name=map[event.key];if(name){event.preventDefault();releaseDirection(name)}if(event.code==="Space"||event.key.toLowerCase()==="x"){event.preventDefault();firing=false}},{passive:false});
  document.querySelectorAll(".move").forEach(button=>{const name=button.dataset.direction;button.addEventListener("pointerdown",event=>{event.preventDefault();button.setPointerCapture?.(event.pointerId);pressDirection(name)});button.addEventListener("pointerup",()=>releaseDirection(name));button.addEventListener("pointercancel",()=>releaseDirection(name));button.addEventListener("lostpointercapture",()=>releaseDirection(name))});
  ui.fire.addEventListener("pointerdown",event=>{event.preventDefault();ui.fire.setPointerCapture?.(event.pointerId);firing=true;fire(true)});for(const type of ["pointerup","pointercancel","lostpointercapture"])ui.fire.addEventListener(type,()=>{firing=false});
  const stopGesture=event=>{if(event.cancelable)event.preventDefault()};for(const type of ["gesturestart","gesturechange","gestureend"])document.addEventListener(type,stopGesture,{passive:false});document.addEventListener("touchmove",stopGesture,{passive:false});document.addEventListener("dblclick",stopGesture,{passive:false});let lastTouch=0;document.addEventListener("touchend",event=>{const now=Date.now();if(now-lastTouch<360&&event.cancelable)event.preventDefault();lastTouch=now},{passive:false});
  addEventListener("blur",()=>{heldDirections.length=0;firing=false;setPressedVisual();if(state?.mode==="playing")pause()});document.addEventListener("visibilitychange",()=>{if(document.hidden&&state?.mode==="playing")pause()});addEventListener("resize",resize,{passive:true});
  ui.play.addEventListener("click",createRun);ui.pauseButton.addEventListener("click",pause);ui.resume.addEventListener("click",resume);ui.quit.addEventListener("click",menu);ui.next.addEventListener("click",nextLevel);ui.again.addEventListener("click",createRun);ui.home.addEventListener("click",menu);ui.sound.addEventListener("click",()=>{soundOn=!soundOn;safeStorage.set("starlockSound",soundOn);if(master)master.gain.value=soundOn ? .22 : 0;if(soundOn){initAudio();audioCtx?.resume();tone("safe")}updateHud()});

  window.__STARLOCK_DIAGNOSTICS__=()=>state?{mode:state.mode,score:state.score,level:state.level,lives:state.lives,lightMode:state.lightMode,lightTimer:state.lightTimer,power:state.power,ammo:state.ammo,remaining:state.pellets.size+state.bonuses.size,wallsBlasted:state.wallsBlasted,player:{x:state.player.x,y:state.player.y,dir:state.player.dir,wanted:state.player.wanted,facing:state.player.facing,moved:state.player.moved,open:["left","right","up","down"].filter(name=>canMove(state.player,name))},enemies:state.enemies.map(enemy=>({x:enemy.x,y:enemy.y,dir:enemy.dir,spawnDelay:enemy.spawnDelay})),bullets:state.bullets.length,held:[...heldDirections],firing,simHz:Math.round(1/SIM_STEP)}:{mode:"menu",best,bestLevel};
  updateRecords();resize();requestAnimationFrame(frame);
})();
