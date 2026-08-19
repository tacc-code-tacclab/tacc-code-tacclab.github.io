(()=>{
  "use strict";

  const canvas=document.querySelector("#game"),ctx=canvas.getContext("2d",{alpha:false,desynchronized:true});
  const $=s=>document.querySelector(s);
  const ui={
    menu:$("#menu"),play:$("#play-btn"),hud:$("#hud"),score:$("#score"),level:$("#level"),lives:$("#lives"),flow:$("#flow-fill"),multiplier:$("#multiplier"),
    sound:$("#sound-btn"),pauseButton:$("#pause-btn"),status:$("#status"),surge:$("#surge"),surgeFill:$("#surge-fill"),pause:$("#pause"),resume:$("#resume-btn"),quit:$("#quit-btn"),
    clear:$("#level-clear"),bonus:$("#level-bonus"),next:$("#next-btn"),gameover:$("#gameover"),finalScore:$("#final-score"),finalLevel:$("#final-level"),finalFlow:$("#final-flow"),
    unlock:$("#unlock-message"),again:$("#again-btn"),home:$("#home-btn"),best:$("#best-score"),dailyBest:$("#daily-best"),dailyId:$("#daily-id"),mobile:$("#mobile-controls")
  };
  const TAU=Math.PI*2,COLS=25,ROWS=21,MID_Y=Math.floor(ROWS/2),coarse=matchMedia("(pointer:coarse)").matches;
  const DIR={left:{x:-1,y:0,a:Math.PI},right:{x:1,y:0,a:0},up:{x:0,y:-1,a:-Math.PI/2},down:{x:0,y:1,a:Math.PI/2},none:{x:0,y:0,a:0}};
  const OPP={left:"right",right:"left",up:"down",down:"up",none:"none"};
  const RUNNERS={ion:{color:"#5ff8ff",accent:"#ff4fd8"},pulse:{color:"#ff4fd8",accent:"#64f8ff"},nova:{color:"#ffe66d",accent:"#ff6ebc"}};
  const ECHO_COLORS=["#ff55d8","#5ff8ff","#ffe66d","#9a78ff"];
  const safeStorage={get(k,f=0){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
  const dateKey=new Date().toISOString().slice(0,10),dailySeed=Number(dateKey.replaceAll("-","")),dailyNumber=(dailySeed*17)%997+1;
  let best=Number(safeStorage.get("neonMazeBest",0))||0,dailyBest=Number(safeStorage.get("neonMazeDaily:"+dateKey,0))||0,runner=safeStorage.get("neonMazeRunner","ion");
  if(!RUNNERS[runner])runner="ion";

  let vw=innerWidth,vh=innerHeight,dpr=1,tile=24,originX=0,originY=64,mapW=0,mapH=0,ambient=0,last=performance.now(),lastDraw=0,state=null,mazeLayer=null;
  let audioCtx=null,master=null,soundOn=safeStorage.get("neonMazeSound",true)!==false,humTimer=0;
  const backgroundStars=Array.from({length:90},(_,i)=>({x:(i*137.2)%1000,y:(i*73.7)%800,r:.5+(i%4)*.32,p:i*.83}));

  function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
  function lerp(a,b,t){return a+(b-a)*t}
  function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
  function key(x,y){return x+","+y}
  function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function show(el,on){el.classList.toggle("active",on)}

  function resize(){
    vw=innerWidth;vh=innerHeight;dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);canvas.style.width=vw+"px";canvas.style.height=vh+"px";
    const top=coarse?58:66,bottom=coarse?Math.min(135,vh*.22):18,pad=coarse?7:18;
    tile=Math.max(10,Math.min((vw-pad*2)/COLS,(vh-top-bottom)/ROWS));mapW=tile*COLS;mapH=tile*ROWS;originX=(vw-mapW)/2;originY=top+Math.max(0,(vh-top-bottom-mapH)/2);if(state?.maze)buildMazeLayer();
  }

  function initAudio(){
    if(audioCtx)return;try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();master=audioCtx.createGain();master.gain.value=soundOn?0.22:0;master.connect(audioCtx.destination)}catch{}
  }
  function tone(kind){
    if(!audioCtx||!soundOn)return;const now=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(master);
    const cfg={shard:[620,880,.045,"sine"],core:[180,920,.3,"sawtooth"],echo:[160,80,.26,"square"],hurt:[120,48,.38,"sawtooth"],level:[330,990,.55,"triangle"],start:[180,620,.34,"triangle"],overdrive:[290,1180,.5,"sawtooth"],bonus:[520,1320,.28,"sine"]}[kind]||[260,420,.12,"sine"];
    o.type=cfg[3];o.frequency.setValueAtTime(cfg[0],now);o.frequency.exponentialRampToValueAtTime(Math.max(30,cfg[1]),now+cfg[2]);g.gain.setValueAtTime(.001,now);g.gain.exponentialRampToValueAtTime(kind==="hurt"?0.2:0.1,now+.012);g.gain.exponentialRampToValueAtTime(.001,now+cfg[2]);o.start(now);o.stop(now+cfg[2]+.02);
  }
  function ambientTone(dt){
    if(!audioCtx||!soundOn||!state||state.mode!=="playing")return;humTimer-=dt;if(humTimer>0)return;humTimer=state.overdrive>0?0.24:0.48;const now=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=state.overdrive>0?110+Math.random()*70:62+state.level*3;g.gain.setValueAtTime(.001,now);g.gain.exponentialRampToValueAtTime(.025,now+.025);g.gain.exponentialRampToValueAtTime(.001,now+.2);o.connect(g);g.connect(master);o.start(now);o.stop(now+.22)
  }

  function setRunner(name,announce=true){
    const threshold=name==="pulse"?2500:name==="nova"?6000:0;if(best<threshold){if(announce)toast("REACH "+threshold.toLocaleString()+" TO UNLOCK");return false}runner=name;safeStorage.set("neonMazeRunner",runner);
    document.querySelectorAll(".runner-choice").forEach(b=>{const active=b.dataset.runner===runner;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});return true
  }
  function updateUnlocks(){
    document.querySelectorAll(".runner-choice").forEach(b=>{const t=b.dataset.runner==="pulse"?2500:b.dataset.runner==="nova"?6000:0;b.classList.toggle("locked",best<t)});
    $("#pulse-lock").textContent=best>=2500?"UNLOCKED":"2,500 BEST";$("#nova-lock").textContent=best>=6000?"UNLOCKED":"6,000 BEST";
    ui.best.textContent=best.toLocaleString();ui.dailyBest.textContent=dailyBest.toLocaleString();ui.dailyId.textContent=String(dailyNumber).padStart(3,"0");setRunner(runner,false)
  }

  function makeMaze(level){
    const rng=mulberry32((dailySeed^(level*0x9e3779b9))>>>0),grid=Array.from({length:ROWS},()=>Array(COLS).fill(1));
    const stack=[[1,1]];grid[1][1]=0;
    while(stack.length){const [x,y]=stack[stack.length-1],choices=[];for(const d of [[2,0],[-2,0],[0,2],[0,-2]]){const nx=x+d[0],ny=y+d[1];if(nx>0&&nx<COLS-1&&ny>0&&ny<ROWS-1&&grid[ny][nx])choices.push([nx,ny,d[0]/2,d[1]/2])}if(!choices.length){stack.pop();continue}const pick=choices[Math.floor(rng()*choices.length)];grid[y+pick[3]][x+pick[2]]=0;grid[pick[1]][pick[0]]=0;stack.push([pick[0],pick[1]])}
    // Open selected walls to create the loops and alternate routes expected in a chase maze.
    for(let y=2;y<ROWS-2;y++)for(let x=2;x<COLS-2;x++){if(!grid[y][x]||rng()>.13)continue;const horizontal=!grid[y][x-1]&&!grid[y][x+1],vertical=!grid[y-1][x]&&!grid[y+1][x];if(horizontal||vertical)grid[y][x]=0}
    // A signature side-to-side portal lane and a small central Rift chamber.
    for(let x=0;x<COLS;x++)if(x<4||x>COLS-5)grid[MID_Y][x]=0;
    for(let y=MID_Y-1;y<=MID_Y+1;y++)for(let x=11;x<=13;x++)grid[y][x]=0;
    if(grid[MID_Y][10])grid[MID_Y][10]=0;if(grid[MID_Y][14])grid[MID_Y][14]=0;
    return {grid,rng};
  }
  function isOpen(maze,x,y){if(y===MID_Y&&(x<0||x>=COLS))return true;if(x<0||x>=COLS||y<0||y>=ROWS)return false;return maze.grid[y][x]===0}
  function nearestOpen(maze,sx,sy,used=new Set()){
    const q=[[clamp(sx,0,COLS-1),clamp(sy,0,ROWS-1)]],seen=new Set();while(q.length){const [x,y]=q.shift(),k=key(x,y);if(seen.has(k))continue;seen.add(k);if(isOpen(maze,x,y)&&!used.has(k))return{x,y};for(const d of Object.values(DIR).slice(0,4)){const nx=x+d.x,ny=y+d.y;if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS)q.push([nx,ny])}}
    return{x:1,y:1}
  }
  function entityAt(cell){return{x:cell.x+.5,y:cell.y+.5,dir:"none",wanted:"left"}}
  function prepareLevel(level,preserve=true){
    const made=makeMaze(level),maze={grid:made.grid};state.maze=maze;state.level=level;const used=new Set(),start=nearestOpen(maze,Math.floor(COLS/2),ROWS-3,used);used.add(key(start.x,start.y));
    const homes=[[12,MID_Y],[11,MID_Y],[13,MID_Y],[12,MID_Y-1]].map(([x,y])=>{const p=nearestOpen(maze,x,y,used);used.add(key(p.x,p.y));return p});
    state.player={...entityAt(start),dir:"left",wanted:"left",angle:Math.PI,invuln:3.2,trail:[],color:RUNNERS[runner].color,accent:RUNNERS[runner].accent};state.playerStart=start;
    state.echoes=homes.map((home,i)=>({...entityAt(home),home,index:i,color:ECHO_COLORS[i],spawnDelay:3.5+i*.75,phase:i*1.7,dir:i%2?"left":"right"}));
    state.shards=new Set();state.cores=new Set();state.relic=null;state.relicTriggered=false;state.totalItems=0;state.collected=0;state.surge=0;state.echoChain=0;state.overdrive=0;state.flowEnergy=preserve?state.flowEnergy*.35:0;state.chain=0;state.chainTimer=0;state.multiplier=1;
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!isOpen(maze,x,y))continue;const away=Math.abs(x-start.x)+Math.abs(y-start.y)>3,fromHome=Math.abs(x-12)+Math.abs(y-MID_Y)>3;if(away&&fromHome)state.shards.add(key(x,y))}
    const corners=[[1,1],[COLS-2,1],[1,ROWS-2],[COLS-2,ROWS-2]];for(const [x,y] of corners){const p=nearestOpen(maze,x,y);const k=key(p.x,p.y);state.shards.delete(k);state.cores.add(k)}state.totalItems=state.shards.size+state.cores.size;
    state.particles=[];state.shake=0;state.flash=0;state.mode="playing";state.lastTick=performance.now();buildMazeLayer();show(ui.clear,false);show(ui.pause,false);show(ui.gameover,false);updateHud();toast("DAILY MAZE "+String(dailyNumber).padStart(3,"0")+" · LEVEL "+level)
  }
  function createRun(){
    state={mode:"playing",score:0,level:1,lives:3,maxFlow:1,flowEnergy:0,particles:[],shake:0,flash:0,statusTimer:0,lastTick:performance.now()};prepareLevel(1,false);show(ui.menu,false);show(ui.hud,true);ui.hud.setAttribute("aria-hidden","false");ui.mobile.classList.toggle("active",coarse);initAudio();audioCtx?.resume();tone("start")
  }

  function cellOf(e){return{x:Math.floor(e.x),y:Math.floor(e.y)}}
  function canMove(e,name){const d=DIR[name],c=cellOf(e);return isOpen(state.maze,c.x+d.x,c.y+d.y)}
  function centered(e,step){const cx=Math.floor(e.x)+.5,cy=Math.floor(e.y)+.5;return Math.abs(e.x-cx)<=step+.018&&Math.abs(e.y-cy)<=step+.018}
  function movePlayer(dt){
    const p=state.player,speed=(6.05+Math.min(1.05,(state.level-1)*.12))*(state.overdrive>0?1.18:1),step=speed*dt,cx=Math.floor(p.x)+.5,cy=Math.floor(p.y)+.5;
    if(centered(p,step)){p.x=cx;p.y=cy;if(canMove(p,p.wanted))p.dir=p.wanted;else if(!canMove(p,p.dir))p.dir="none"}
    const oldX=p.x,oldY=p.y,d=DIR[p.dir];p.x+=d.x*step;p.y+=d.y*step;
    if(p.y>=MID_Y&&p.y<MID_Y+1){if(p.x<-.25)p.x=COLS-.25;if(p.x>COLS+.25)p.x=.25}
    const c=cellOf(p);if(c.y<0||c.y>=ROWS||(c.x>=0&&c.x<COLS&&!isOpen(state.maze,c.x,c.y))){p.x=oldX;p.y=oldY;p.dir="none"}
    if(p.dir!=="none")p.angle=DIR[p.dir].a;p.trail.unshift({x:p.x,y:p.y,a:1});if(p.trail.length>12)p.trail.pop();for(const t of p.trail)t.a*=.9
  }
  function ghostTarget(e){
    const p=cellOf(state.player),d=DIR[state.player.dir];if(e.index===0)return p;if(e.index===1)return{x:clamp(p.x+d.x*4,0,COLS-1),y:clamp(p.y+d.y*4,0,ROWS-1)};
    if(e.index===2){const phase=Math.floor(ambient/5)%4,spots=[[1,1],[COLS-2,1],[COLS-2,ROWS-2],[1,ROWS-2]];return Math.random()<.7?p:{x:spots[phase][0],y:spots[phase][1]}}
    return distance(e,state.player)>7?p:{x:COLS-p.x-1,y:ROWS-p.y-1}
  }
  function chooseEchoDirection(e){
    const options=[];for(const name of ["left","right","up","down"])if(canMove(e,name))options.push(name);let choices=options.filter(n=>n!==OPP[e.dir]);if(!choices.length)choices=options;if(!choices.length)return"none";
    const target=ghostTarget(e),fear=state.surge>0||state.overdrive>0,randomness=e.index===3?0.24:0.07;if(Math.random()<randomness)return choices[Math.floor(Math.random()*choices.length)];
    choices.sort((a,b)=>{const da=DIR[a],db=DIR[b],aa=Math.abs(e.x+da.x-(target.x+.5))+Math.abs(e.y+da.y-(target.y+.5)),bb=Math.abs(e.x+db.x-(target.x+.5))+Math.abs(e.y+db.y-(target.y+.5));return fear?bb-aa:aa-bb});return choices[0]
  }
  function moveEcho(e,dt){
    e.phase+=dt*(2.4+e.index*.17);if(e.spawnDelay>0){e.spawnDelay-=dt;return}const vulnerable=state.surge>0||state.overdrive>0,speed=(3.85+state.level*.15+e.index*.05)*(vulnerable?0.77:1),step=speed*dt,cx=Math.floor(e.x)+.5,cy=Math.floor(e.y)+.5;
    if(centered(e,step)){e.x=cx;e.y=cy;e.dir=chooseEchoDirection(e)}const oldX=e.x,oldY=e.y,d=DIR[e.dir];e.x+=d.x*step;e.y+=d.y*step;if(e.y>=MID_Y&&e.y<MID_Y+1){if(e.x<-.25)e.x=COLS-.25;if(e.x>COLS+.25)e.x=.25}const c=cellOf(e);if(c.y<0||c.y>=ROWS||(c.x>=0&&c.x<COLS&&!isOpen(state.maze,c.x,c.y))){e.x=oldX;e.y=oldY;e.dir=OPP[e.dir]}
  }
  function setDirection(name){if(!state||!["playing","ready"].includes(state.mode))return;state.player.wanted=name;document.querySelectorAll(".move").forEach(b=>b.classList.toggle("pressed",b.dataset.direction===name))}

  function collect(){
    const p=state.player,c=cellOf(p),k=key(c.x,c.y);if(state.shards.delete(k)){state.collected++;state.chainTimer=1.18;state.chain++;state.multiplier=Math.min(5,1+Math.floor(state.chain/8));state.maxFlow=Math.max(state.maxFlow,state.multiplier);const boosted=state.overdrive>0?2:1;state.score+=10*state.multiplier*boosted;state.flowEnergy=clamp(state.flowEnergy+3.4+state.multiplier*.9,0,100);burst(c.x+.5,c.y+.5,p.color,3,.55);if(state.chain%3===0)tone("shard");if(state.flowEnergy>=100&&state.overdrive<=0){state.overdrive=6.5;state.flowEnergy=0;state.surge=Math.max(state.surge,6.5);state.echoChain=0;tone("overdrive");toast("⚡ OVERDRIVE · SCORE ×2 ⚡");state.flash=.55}}
    if(state.cores.delete(k)){state.collected++;state.score+=100*state.multiplier;state.surge=8;state.echoChain=0;burst(c.x+.5,c.y+.5,"#ffffff",22,1.7);tone("core");toast("POWER SURGE · ECHOES EXPOSED");state.shake=6}
    if(state.relic&&c.x===state.relic.x&&c.y===state.relic.y){state.relic=null;state.score+=750*state.multiplier;state.flowEnergy=clamp(state.flowEnergy+38,0,100);tone("bonus");toast("RIFT RELIC +"+(750*state.multiplier).toLocaleString());burst(c.x+.5,c.y+.5,"#ffe66d",30,2.1)}
    if(!state.relicTriggered&&state.collected>state.totalItems*.48){state.relicTriggered=true;const spot=nearestOpen(state.maze,12,MID_Y);state.relic=spot;toast("BONUS RELIC DETECTED")}
    if(state.shards.size+state.cores.size===0)completeLevel()
  }
  function collideEchoes(){
    const p=state.player;if(p.invuln>0)return;for(const e of state.echoes){if(e.spawnDelay>0||distance(p,e)>.66)continue;if(state.surge>0||state.overdrive>0){state.echoChain++;const award=200*Math.pow(2,Math.min(3,state.echoChain-1));state.score+=award;e.x=e.home.x+.5;e.y=e.home.y+.5;e.spawnDelay=3.2;e.dir="none";burst(p.x,p.y,e.color,28,2.2);tone("echo");toast("ECHO ERASED +"+award);state.shake=8}else{loseCore();return}}
  }
  function loseCore(){
    state.lives--;state.chain=0;state.chainTimer=0;state.multiplier=1;state.flowEnergy=Math.max(0,state.flowEnergy-35);state.surge=0;state.overdrive=0;state.shake=15;state.flash=.8;tone("hurt");burst(state.player.x,state.player.y,"#ff416c",40,2.4);
    if(state.lives<=0){finish();return}const s=state.playerStart;Object.assign(state.player,{x:s.x+.5,y:s.y+.5,dir:"none",wanted:"left",invuln:2.8,trail:[]});state.echoes.forEach((e,i)=>Object.assign(e,{x:e.home.x+.5,y:e.home.y+.5,dir:"none",spawnDelay:2.6+i*.6}));toast("CORE LOST · "+state.lives+" REMAIN")
  }
  function completeLevel(){
    if(state.mode!=="playing")return;state.mode="clear";const bonus=1000*state.level*state.lives;state.score+=bonus;ui.bonus.textContent="Level bonus +"+bonus.toLocaleString();updateRecords();updateHud();show(ui.clear,true);ui.mobile.classList.remove("active");tone("level")
  }
  function nextLevel(){prepareLevel(state.level+1,true);ui.mobile.classList.toggle("active",coarse);tone("start")}
  function finish(){
    state.mode="gameover";updateRecords();ui.finalScore.textContent=Math.round(state.score).toLocaleString();ui.finalLevel.textContent=state.level;ui.finalFlow.textContent="×"+state.maxFlow;ui.unlock.textContent=best>=6000?"NOVA RUNNER AVAILABLE":best>=2500?"PULSE RUNNER AVAILABLE":"";show(ui.gameover,true);ui.mobile.classList.remove("active");tone("hurt")
  }
  function updateRecords(){const score=Math.round(state.score);if(score>best){best=score;safeStorage.set("neonMazeBest",best)}if(score>dailyBest){dailyBest=score;safeStorage.set("neonMazeDaily:"+dateKey,dailyBest)}updateUnlocks()}
  function pause(){if(!state||state.mode!=="playing")return;state.mode="paused";show(ui.pause,true);ui.mobile.classList.remove("active")}
  function resume(){if(!state||state.mode!=="paused")return;state.mode="playing";state.lastTick=performance.now();show(ui.pause,false);ui.mobile.classList.toggle("active",coarse);audioCtx?.resume()}
  function menu(){if(state)updateRecords();state=null;show(ui.pause,false);show(ui.clear,false);show(ui.gameover,false);show(ui.hud,false);ui.hud.setAttribute("aria-hidden","true");ui.mobile.classList.remove("active");show(ui.menu,true);updateUnlocks()}

  function burst(x,y,color,count=12,speed=1){if(!state)return;for(let i=0;i<count;i++){const a=Math.random()*TAU,s=speed*(.35+Math.random()*.85);state.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.35+Math.random()*.5,max:.85,r:.06+Math.random()*.09,color})}if(state.particles.length>360)state.particles.splice(0,state.particles.length-360)}
  function toast(text){ui.status.textContent=text;ui.status.classList.add("show");if(state)state.statusTimer=2.1}
  function updateHud(){if(!state)return;ui.score.textContent=Math.round(state.score).toLocaleString();ui.level.textContent=state.level;ui.lives.textContent=Array.from({length:state.lives},()=>"◆").join(" ");ui.flow.style.width=clamp(state.flowEnergy,0,100)+"%";ui.multiplier.textContent="×"+state.multiplier;ui.surge.classList.toggle("active",state.surge>0||state.overdrive>0);ui.surgeFill.style.transform="scaleX("+clamp(Math.max(state.surge/8,state.overdrive/6.5),0,1)+")";ui.sound.classList.toggle("muted",!soundOn);ui.sound.textContent=soundOn?"♪":"×"}

  function update(dt){
    state.player.invuln=Math.max(0,state.player.invuln-dt);state.surge=Math.max(0,state.surge-dt);state.overdrive=Math.max(0,state.overdrive-dt);state.shake=Math.max(0,state.shake-dt*24);state.flash=Math.max(0,state.flash-dt*2.6);
    if(state.chainTimer>0){state.chainTimer-=dt;if(state.chainTimer<=0){state.chain=0;state.multiplier=1}}state.flowEnergy=Math.max(0,state.flowEnergy-dt*(state.chainTimer>0?1.5:6.8));
    movePlayer(dt);for(const e of state.echoes)moveEcho(e,dt);collect();collideEchoes();for(const p of state.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.06,dt);p.vy*=Math.pow(.06,dt);p.life-=dt}state.particles=state.particles.filter(p=>p.life>0);
    if(state.statusTimer>0&&(state.statusTimer-=dt)<=0)ui.status.classList.remove("show");ambientTone(dt);updateHud()
  }

  function roundedRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
  function buildMazeLayer(){
    if(!state?.maze)return;const bleed=5,layerW=mapW+bleed*2,layerH=mapH+bleed*2;mazeLayer=document.createElement("canvas");mazeLayer.width=Math.max(1,Math.ceil(layerW*dpr));mazeLayer.height=Math.max(1,Math.ceil(layerH*dpr));const m=mazeLayer.getContext("2d");m.setTransform(dpr,0,0,dpr,0,0);m.beginPath();m.roundRect(0,0,layerW,layerH,10);m.fillStyle="rgba(3,3,20,.94)";m.fill();
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const px=bleed+x*tile,py=bleed+y*tile;if(state.maze.grid[y][x]){const grad=m.createLinearGradient(px,py,px+tile,py+tile);grad.addColorStop(0,"#2a2565");grad.addColorStop(.52,"#12113d");grad.addColorStop(1,"#080725");m.fillStyle=grad;m.strokeStyle="rgba(117,103,255,.78)";m.lineWidth=Math.max(1,tile*.055);m.beginPath();m.roundRect(px+tile*.06,py+tile*.06,tile*.88,tile*.88,tile*.18);m.fill();m.stroke();m.strokeStyle="rgba(113,246,255,.26)";m.lineWidth=Math.max(.6,tile*.025);m.beginPath();m.moveTo(px+tile*.2,py+tile*.16);m.lineTo(px+tile*.77,py+tile*.16);m.moveTo(px+tile*.16,py+tile*.2);m.lineTo(px+tile*.16,py+tile*.72);m.stroke()}else{m.fillStyle=(x+y)%2?"rgba(74,77,151,.04)":"rgba(61,222,238,.03)";m.fillRect(px,py,tile,tile)}}
  }
  function drawBackdrop(t){
    ctx.setTransform(dpr,0,0,dpr,0,0);const g=ctx.createLinearGradient(0,0,vw,vh);g.addColorStop(0,"#08041e");g.addColorStop(.48,"#130832");g.addColorStop(1,"#031827");ctx.fillStyle=g;ctx.fillRect(0,0,vw,vh);
    ctx.save();ctx.globalAlpha=.28;ctx.strokeStyle="#5ff8ff";ctx.lineWidth=1;const gap=58,ox=(t*8)%gap,oy=(t*3)%gap;for(let x=-gap+ox;x<vw+gap;x+=gap){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(vw/2+(x-vw/2)*.28,vh);ctx.stroke()}for(let y=-gap+oy;y<vh+gap;y+=gap){ctx.globalAlpha=.08+.17*y/vh;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(vw,y);ctx.stroke()}ctx.restore();
    for(const s of backgroundStars){const x=(s.x/1000*vw+t*(4+s.r))%(vw+10)-5,y=s.y/800*vh;ctx.globalAlpha=.25+.25*Math.sin(t+s.p);ctx.fillStyle=s.r>1?"#ff77dc":"#79faff";ctx.beginPath();ctx.arc(x,y,s.r,0,TAU);ctx.fill()}ctx.globalAlpha=1;
    const v=ctx.createRadialGradient(vw*.5,vh*.45,Math.min(vw,vh)*.12,vw*.5,vh*.5,Math.max(vw,vh)*.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,17,.68)");ctx.fillStyle=v;ctx.fillRect(0,0,vw,vh)
  }
  function sx(x){return originX+x*tile}function sy(y){return originY+y*tile}
  function drawMaze(){
    if(mazeLayer)ctx.drawImage(mazeLayer,originX-5,originY-5,mapW+10,mapH+10);
    // Side portals.
    ctx.save();ctx.strokeStyle="#5ff8ff";ctx.lineWidth=Math.max(2,tile*.13);ctx.shadowColor="#5ff8ff";ctx.shadowBlur=14;for(const x of [originX-2,originX+mapW+2]){ctx.beginPath();ctx.arc(x,sy(MID_Y+.5),tile*.64,-Math.PI/2,Math.PI/2);ctx.stroke()}ctx.restore()
  }
  function drawShards(){ctx.save();ctx.fillStyle="#c9ffff";ctx.shadowColor="#5ff8ff";ctx.shadowBlur=Math.min(5,tile*.18);ctx.beginPath();for(const k of state.shards){const comma=k.indexOf(","),x=Number(k.slice(0,comma)),y=Number(k.slice(comma+1)),px=sx(x+.5),py=sy(y+.5),r=Math.max(1.7,tile*.115)*(1+Math.sin(ambient*6+x)*.08);ctx.moveTo(px,py-r);ctx.lineTo(px+r,py);ctx.lineTo(px,py+r);ctx.lineTo(px-r,py);ctx.closePath()}ctx.fill();ctx.restore()}
  function polygon(x,y,r,n,rot=0){ctx.beginPath();for(let i=0;i<n;i++){const a=rot+i*TAU/n,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath()}
  function drawCore(k){const [x,y]=k.split(",").map(Number),px=sx(x+.5),py=sy(y+.5),pulse=1+Math.sin(ambient*5+x)*.1;ctx.save();ctx.translate(px,py);ctx.rotate(ambient*.7);ctx.strokeStyle="#fff";ctx.fillStyle="#5ff8ff";ctx.lineWidth=Math.max(1.5,tile*.1);ctx.shadowColor="#5ff8ff";ctx.shadowBlur=tile*.75;polygon(0,0,tile*.28*pulse,6);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";polygon(0,0,tile*.11,4,Math.PI/4);ctx.fill();ctx.restore()}
  function drawRelic(r){const px=sx(r.x+.5),py=sy(r.y+.5);ctx.save();ctx.translate(px,py);ctx.rotate(-ambient*.9);ctx.fillStyle="#ffe66d";ctx.strokeStyle="#fff4b0";ctx.lineWidth=2;ctx.shadowColor="#ffe66d";ctx.shadowBlur=22;polygon(0,0,tile*.34,8,Math.PI/8);ctx.fill();ctx.stroke();ctx.fillStyle="#ff5ac8";polygon(0,0,tile*.16,4,Math.PI/4);ctx.fill();ctx.restore()}
  function drawRunner(p){
    const px=sx(p.x),py=sy(p.y),r=tile*.38,blink=p.invuln>0&&Math.floor(p.invuln*12)%2===0;ctx.save();for(let i=p.trail.length-1;i>=0;i--){const t=p.trail[i];ctx.globalAlpha=t.a*.16;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(sx(t.x),sy(t.y),r*(.35+t.a*.35),0,TAU);ctx.fill()}ctx.globalAlpha=blink?0.38:1;ctx.translate(px,py);ctx.rotate(p.angle);ctx.shadowColor=p.color;ctx.shadowBlur=tile*.75;ctx.fillStyle="#12113c";ctx.strokeStyle=p.color;ctx.lineWidth=Math.max(1.5,tile*.09);ctx.beginPath();ctx.moveTo(-r*.7,-r*.62);ctx.quadraticCurveTo(r*.42,-r*.95,r*.86,-r*.18);ctx.lineTo(r*.72,r*.64);ctx.quadraticCurveTo(-r*.08,r*.98,-r*.75,r*.48);ctx.closePath();ctx.fill();ctx.stroke();const helmet=ctx.createRadialGradient(r*.12,-r*.45,1,r*.1,-r*.12,r);helmet.addColorStop(0,"#fff");helmet.addColorStop(.16,p.color);helmet.addColorStop(.55,"#2855b0");helmet.addColorStop(1,"#09072c");ctx.fillStyle=helmet;ctx.beginPath();ctx.arc(r*.08,-r*.18,r*.72,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle="#07112d";ctx.beginPath();ctx.ellipse(r*.35,-r*.3,r*.43,r*.22,-.1,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.76)";ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=p.accent;ctx.shadowColor=p.accent;ctx.beginPath();ctx.moveTo(-r*.62,r*.08);ctx.lineTo(-r*1.35,r*.55+Math.sin(ambient*9)*r*.08);ctx.lineTo(-r*.58,r*.58);ctx.closePath();ctx.fill();ctx.restore()
  }
  function drawEcho(e){
    if(e.spawnDelay>0&&Math.floor(e.spawnDelay*6)%2)return;const px=sx(e.x),py=sy(e.y),r=tile*.37,vulnerable=state.surge>0||state.overdrive>0,color=vulnerable?"#5a7dff":e.color;ctx.save();ctx.translate(px,py);ctx.rotate(Math.sin(e.phase)*.08);ctx.shadowColor=color;ctx.shadowBlur=tile*.72;ctx.fillStyle="#0b0928";ctx.strokeStyle=color;ctx.lineWidth=Math.max(1.5,tile*.085);polygon(0,0,r,6,e.phase*.08);ctx.fill();ctx.stroke();ctx.fillStyle=color;ctx.globalAlpha=.2;polygon(0,0,r*.72,4,Math.PI/4);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle="#eaffff";ctx.beginPath();ctx.ellipse(r*.23,-r*.12,r*.23,r*.15,0,0,TAU);ctx.fill();ctx.fillStyle=vulnerable?"#fff":"#071127";ctx.beginPath();ctx.arc(r*.28,-r*.12,r*.07,0,TAU);ctx.fill();if(vulnerable){ctx.strokeStyle="#d9ffff";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-r*.28,r*.19);ctx.lineTo(-r*.08,r*.05);ctx.lineTo(r*.1,r*.2);ctx.lineTo(r*.29,r*.04);ctx.stroke()}else{ctx.fillStyle=color;ctx.fillRect(-r*.42,r*.28,r*.84,r*.11)}ctx.restore()
  }
  function drawParticles(){for(const p of state.particles){ctx.globalAlpha=clamp(p.life/p.max,0,1);ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(sx(p.x),sy(p.y),Math.max(1,p.r*tile),0,TAU);ctx.fill()}ctx.globalAlpha=1;ctx.shadowBlur=0}
  function drawGame(){
    drawBackdrop(ambient);ctx.save();if(state.shake>0)ctx.translate((Math.random()-.5)*state.shake,(Math.random()-.5)*state.shake);drawMaze();drawShards();for(const k of state.cores)drawCore(k);if(state.relic)drawRelic(state.relic);for(const e of state.echoes)drawEcho(e);drawRunner(state.player);drawParticles();ctx.restore();if(state.flash>0){ctx.globalAlpha=state.flash*.28;ctx.fillStyle=state.lives>0?state.player.color:"#ff315e";ctx.fillRect(0,0,vw,vh);ctx.globalAlpha=1}
  }
  function drawMenu(t){drawBackdrop(t);const cx=vw*.5,cy=vh*.51;ctx.save();ctx.globalAlpha=.14;ctx.strokeStyle="#5ff8ff";ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.roundRect(cx-230-i*18,cy-150-i*13,460+i*36,300+i*26,22);ctx.stroke()}for(let i=0;i<4;i++){const a=t*(.32+i*.05)+i*TAU/4,x=cx+Math.cos(a)*Math.min(vw*.37,390),y=cy+Math.sin(a)*Math.min(vh*.34,230);ctx.fillStyle=ECHO_COLORS[i];ctx.shadowColor=ECHO_COLORS[i];ctx.shadowBlur=18;polygon(x,y,9+i,6,a);ctx.fill()}ctx.restore()}
  function frame(now){const dt=Math.min(.034,Math.max(.001,(now-last)/1000));last=now;ambient+=dt;if(state&&state.mode==="playing")update(dt);const drawInterval=1000/(coarse?30:45);if(now-lastDraw>=drawInterval){lastDraw=now;if(state)drawGame();else drawMenu(ambient)}requestAnimationFrame(frame)}

  addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();setDirection(e.key.slice(5).toLowerCase())}if(e.key==="Escape"){if(state?.mode==="playing")pause();else if(state?.mode==="paused")resume()}},{passive:false});
  document.querySelectorAll(".move").forEach(b=>{const dir=b.dataset.direction;b.addEventListener("pointerdown",e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);setDirection(dir)});b.addEventListener("pointerup",()=>b.classList.remove("pressed"));b.addEventListener("pointercancel",()=>b.classList.remove("pressed"))});
  let swipe=null;canvas.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse")swipe={x:e.clientX,y:e.clientY,id:e.pointerId}});canvas.addEventListener("pointerup",e=>{if(!swipe||swipe.id!==e.pointerId)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.hypot(dx,dy)<18)return;setDirection(Math.abs(dx)>Math.abs(dy)?dx>0?"right":"left":dy>0?"down":"up")});canvas.addEventListener("pointercancel",()=>swipe=null);
  const stopGesture=e=>{if(e.cancelable)e.preventDefault()};["gesturestart","gesturechange","gestureend"].forEach(type=>document.addEventListener(type,stopGesture,{passive:false}));document.addEventListener("touchmove",stopGesture,{passive:false});document.addEventListener("dblclick",stopGesture,{passive:false});let lastTouch=0;document.addEventListener("touchend",e=>{const n=Date.now();if(n-lastTouch<360&&e.cancelable)e.preventDefault();lastTouch=n},{passive:false});
  addEventListener("blur",()=>{if(state?.mode==="playing")pause()});document.addEventListener("visibilitychange",()=>{if(document.hidden&&state?.mode==="playing")pause()});addEventListener("resize",resize,{passive:true});
  document.querySelectorAll(".runner-choice").forEach(b=>b.addEventListener("click",()=>setRunner(b.dataset.runner)));
  ui.play.addEventListener("click",createRun);ui.pauseButton.addEventListener("click",pause);ui.resume.addEventListener("click",resume);ui.quit.addEventListener("click",menu);ui.next.addEventListener("click",nextLevel);ui.again.addEventListener("click",createRun);ui.home.addEventListener("click",menu);ui.sound.addEventListener("click",()=>{soundOn=!soundOn;safeStorage.set("neonMazeSound",soundOn);if(master)master.gain.value=soundOn?0.22:0;if(soundOn){initAudio();audioCtx?.resume();tone("shard")}updateHud()});

  window.__NEON_MAZE_DIAGNOSTICS__=()=>state?{mode:state.mode,score:state.score,level:state.level,lives:state.lives,shards:state.shards.size,cores:state.cores.size,player:{x:state.player.x,y:state.player.y,dir:state.player.dir,wanted:state.player.wanted},echoes:state.echoes.map(e=>({x:e.x,y:e.y,spawnDelay:e.spawnDelay})),surge:state.surge,overdrive:state.overdrive,multiplier:state.multiplier}: {mode:"menu",best,dailyBest,runner};
  updateUnlocks();resize();requestAnimationFrame(frame);
})();
