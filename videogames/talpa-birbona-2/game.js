/* Naughty Mole 2 — twenty-garden canvas game with keyboard, pointer and touch controls. */
(() => {
  'use strict';
  const {Game,CROPS,COLS,ROWS,LAST_LEVEL,SPEED}=TalpaCore;
  const {pickTarget,targetVector,DirectionState}=TalpaControls;
  const canvas=document.querySelector('#game'), ctx=canvas.getContext('2d');
  const $=id=>document.getElementById(id);
  const music=$('music');
  const W=1100,H=750,CELL=36,GX=46,GY=210;
  const comfortable=matchMedia('(any-pointer: coarse), (max-width: 760px)').matches;
  const game=new Game(1,0,{assist:comfortable}); let mode='menu', target=null, last=0, visualTime=0, toastUntil=0, biteUntil=0;
  let muted=false, audioContext=null, atlasReady=false, particles=[], popups=[], savedBest=0, death=null, summaryAt=0, poisonedMoleTile=null;
  const spriteTiles=[], cropArts=[];
  const held=new Set(), touches=new DirectionState(), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let canvasPointer=null, pointerOrigin=null, dragging=false;
  const defaultTip='Escape in zigzags: poison slows down on flat tunnels, climbs and every bend.';
  $('tip').textContent=defaultTip;
  if(comfortable)$('panel-note').textContent='20 gardens · directional poison · assisted touch controls · golden pumpkin';
  const atlas=new Image();
  music.volume=.14;
  try{
    savedBest=Number(localStorage.getItem('naughty-mole-2-best'))||0;
    const preference=localStorage.getItem('naughty-mole-2-muted');
    if(preference!==null)muted=preference==='true';
  }catch{}
  $('play').disabled=true;
  atlas.onload=()=>{buildSpriteTiles();atlasReady=true;renderCropArts();$('play').disabled=false;};
  atlas.onerror=()=>{$('panel-text').textContent='The pictures did not load. Refresh the page to try again.';};
  atlas.src='../talpa-birbona/assets/characters.png';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const px=x=>GX+x*CELL, py=y=>GY+y*CELL;
  function round(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
  function ellipse(x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
  function line(points,color,width=3){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function text(t,x,y,size=16,color='#fff8dd',align='center',weight=600){ctx.font=`${weight} ${size}px Fredoka, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(t,x,y);}
  function isolateLargestArtwork(tile){
    const tileContext=tile.getContext('2d',{willReadFrequently:true}),width=tile.width,height=tile.height,total=width*height;
    const image=tileContext.getImageData(0,0,width,height),labels=new Uint32Array(total),queue=new Int32Array(total);
    let nextLabel=0,bestLabel=0,bestCount=0;
    for(let start=0;start<total;start++){
      if(image.data[start*4+3]<=8||labels[start])continue;
      const label=++nextLabel;let head=0,tail=0,count=0;queue[tail++]=start;labels[start]=label;
      while(head<tail){const cell=queue[head++],x=cell%width;count++;
        const neighbors=[cell-width,cell+width,x?cell-1:-1,x<width-1?cell+1:-1];
        for(const next of neighbors)if(next>=0&&next<total&&!labels[next]&&image.data[next*4+3]>8){labels[next]=label;queue[tail++]=next;}
      }
      if(count>bestCount){bestCount=count;bestLabel=label;}
    }
    for(let i=0;i<total;i++)if(labels[i]!==bestLabel)image.data[i*4+3]=0;
    tileContext.putImageData(image,0,0);
  }
  function buildSpriteTiles(){
    const tileWidth=atlas.naturalWidth/4,tileHeight=atlas.naturalHeight/3;
    for(let id=0;id<12;id++){
      const tile=document.createElement('canvas');tile.width=tileWidth;tile.height=tileHeight;
      tile.getContext('2d').drawImage(atlas,id%4*tileWidth,Math.floor(id/4)*tileHeight,tileWidth,tileHeight,0,0,tileWidth,tileHeight);
      // The four middle-row crops contain detached pixels spilled from the row above in the source atlas.
      if(id>=4&&id<=7)isolateLargestArtwork(tile);
      spriteTiles[id]=tile;
    }
    poisonedMoleTile=document.createElement('canvas');poisonedMoleTile.width=tileWidth;poisonedMoleTile.height=tileHeight;
    const deadContext=poisonedMoleTile.getContext('2d');deadContext.drawImage(spriteTiles[0],0,0);
    deadContext.globalCompositeOperation='source-atop';deadContext.fillStyle='#874cc999';deadContext.fillRect(0,0,tileWidth,tileHeight);
    deadContext.globalCompositeOperation='source-over';deadContext.strokeStyle='#fff4d8';deadContext.lineWidth=8;deadContext.lineCap='round';
    const eyeX=tileWidth*.67,eyeY=tileHeight*.31,eyeSize=12;
    deadContext.beginPath();deadContext.moveTo(eyeX-eyeSize,eyeY-eyeSize);deadContext.lineTo(eyeX+eyeSize,eyeY+eyeSize);deadContext.moveTo(eyeX+eyeSize,eyeY-eyeSize);deadContext.lineTo(eyeX-eyeSize,eyeY+eyeSize);deadContext.stroke();
  }
  function drawSprite(source,x,y,w,h=w,flip=false,angle=0,alpha=1){
    if(!source)return;
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);if(flip)ctx.scale(-1,1);
    ctx.drawImage(source,0,0,source.width,source.height,-w/2,-h/2,w,h);ctx.restore();
  }
  function sprite(id,x,y,w,h=w,flip=false,angle=0,alpha=1){drawSprite(spriteTiles[id],x,y,w,h,flip,angle,alpha);}
  function renderCropArts(){for(const art of cropArts){const artContext=art.getContext('2d');artContext.clearRect(0,0,art.width,art.height);artContext.drawImage(spriteTiles[Number(art.dataset.sprite)],0,0,art.width,art.height);}}
  // Static earth texture is rendered once; gameplay does not allocate terrain every frame.
  const terrain=document.createElement('canvas');terrain.width=W;terrain.height=H;
  const tc=terrain.getContext('2d');
  const earth=tc.createLinearGradient(0,GY,0,H);earth.addColorStop(0,'#bd8150');earth.addColorStop(.5,'#a76b46');earth.addColorStop(1,'#80503e');
  tc.fillStyle=earth;tc.fillRect(0,GY,W,H-GY);
  let seed=782;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let i=0;i<950;i++) {const x=rand()*W,y=GY+rand()*(H-GY);tc.fillStyle=i%3?'#efb57624':'#563c3826';tc.beginPath();tc.ellipse(x,y,1+rand()*3,1+rand()*2,rand()*3,0,7);tc.fill();}
  for(let i=0;i<20;i++){const x=rand()*W,y=GY+30+rand()*(H-GY-40);tc.fillStyle='#cb97722d';tc.beginPath();tc.ellipse(x,y,8+rand()*12,4+rand()*4,rand(),0,7);tc.fill();}
  function landscape(t){
    const sky=ctx.createLinearGradient(0,0,0,GY);sky.addColorStop(0,'#b5e7ee');sky.addColorStop(1,'#eff6ce');ctx.fillStyle=sky;ctx.fillRect(0,0,W,GY);
    ellipse(111,50,29,29,'#fff8bb');ellipse(111,50,22,22,'#ffdf7f');
    [[275,40,1],[650,35,.7],[910,57,.8]].forEach(([x,y,s],i)=>{x+=reduced?0:Math.sin(t*.07+i)*18;ellipse(x,y,52*s,14*s,'#fffdf0cc');ellipse(x-15*s,y-10*s,23*s,19*s,'#fffdf0cc');ellipse(x+15*s,y-9*s,25*s,22*s,'#fffdf0cc');});
    ctx.fillStyle='#9dbf88';ctx.beginPath();ctx.moveTo(0,146);ctx.bezierCurveTo(155,48,226,130,390,146);ctx.bezierCurveTo(553,50,700,135,880,136);ctx.bezierCurveTo(996,85,1028,135,W,112);ctx.lineTo(W,GY);ctx.lineTo(0,GY);ctx.fill();
    ctx.fillStyle='#b3cf85';ctx.beginPath();ctx.moveTo(0,170);ctx.bezierCurveTo(256,117,407,157,540,169);ctx.bezierCurveTo(773,116,925,140,W,160);ctx.lineTo(W,GY);ctx.lineTo(0,GY);ctx.fill();
    // A tiny country house, cypress trees and a pale wooden fence.
    round(890,96,69,53,3,'#f9d69e');ctx.fillStyle='#d47859';ctx.beginPath();ctx.moveTo(878,99);ctx.lineTo(923,67);ctx.lineTo(970,99);ctx.fill();round(914,120,17,29,5,'#917251');round(938,108,11,13,2,'#d79767');
    for(const x of [856,978]){round(x,108,5,44,2,'#8c8758');ellipse(x+2,100,11,31,'#69875d');}
    for(let x=12;x<W;x+=37){round(x,154,6,48,3,'#e1d5a3');}round(0,166,W,5,1,'#e1d5a3');round(0,188,W,5,1,'#e1d5a3');
    ctx.fillStyle='#83aa53';ctx.fillRect(0,194,W,16);ctx.fillStyle='#aaca63';ctx.fillRect(0,193,W,6);
    for(let x=8;x<W;x+=18)line([[x,201],[x+2,190],[x+5,199]],'#78a34d',2);
    for(let i=0;i<16;i++){const x=(i*71+29)%W;if(i%3===0){ellipse(x,190,3,3,'#fff9d9');ellipse(x+3,189,2,2,'#f5c269');}}
  }
  function roots(plant,t){
    const crop=CROPS[plant.kind],x=px(plant.x),y=py(plant.y);
    if(plant.eaten){round(x-9,GY-7,18,8,3,'#80764c');text('✓',x,GY-14,18,'#fff8cc');return;}
    const sway=reduced?0:Math.sin(t*1.8+plant.x)*.025;
    const tree=plant.kind>=3&&plant.kind<=5;
    const width=tree?128:plant.kind===6?89:105;
    ellipse(x,GY-4,32,5,'#45643724');
    sprite(crop.sprite,x,GY-width*.47,width,width,false,sway);
    line([[x,GY+3],[x+4,GY+26],[x-3,y-14],[x,y]],'#f5cd96',5);
    for(let j=0;j<4;j++) {const ry=GY+24+(y-GY-30)*j/4;const side=j%2?1:-1;line([[x,ry],[x+side*12,ry+12],[x+side*17,ry+24]],'#e6b782',2.5);}
    const rootRadius=comfortable?Math.max(16,Math.min(29,9*W/Math.max(1,canvas.clientWidth))):12;
    ellipse(x,y,rootRadius+6+Math.sin(t*3+plant.x)*1.4,rootRadius+6,'#f9cb7920');
    ellipse(x,y,rootRadius,rootRadius+1,crop.color);ellipse(x-rootRadius*.25,y-rootRadius*.35,rootRadius*.32,rootRadius*.32,'#ffffff65');
    line([[x-5,y+12],[x-7,y+19]],'#f0c49b',2);line([[x+4,y+12],[x+7,y+17]],'#f0c49b',2);
    if(!comfortable){round(x-21,y+22,42,19,8,'#683d3299');text(crop.points,x,y+36,12,'#ffe8bc');}
  }
  function drawAnt(ant,t){
    const x=px(ant.x),y=py(ant.y),step=Math.sin(t*18+ant.phase)*3;
    ellipse(x,y,21,14,'#ffd36b22');
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(ant.vy,ant.vx));ctx.globalAlpha=ant.cooldown>0?.58:1;
    line([[-5,-2],[-12,-9-step]],'#442822',2.2);line([[0,-2],[-2,-12+step]],'#442822',2.2);line([[5,-2],[12,-9-step]],'#442822',2.2);
    line([[-5,2],[-12,9+step]],'#442822',2.2);line([[0,2],[-2,12-step]],'#442822',2.2);line([[5,2],[12,9+step]],'#442822',2.2);
    ellipse(-8,0,6.5,5.5,'#7a3125');ellipse(0,0,5.5,4.5,'#3f2722');ellipse(8,0,6,5,'#a84a2f');
    ellipse(10,-2,1.2,1.2,'#fff2b0');
    line([[11,-2],[17,-7]],'#442822',1.6);line([[11,1],[18,5]],'#442822',1.6);
    ctx.restore();
  }
  function draw(t){
    ctx.clearRect(0,0,W,H);landscape(t);ctx.drawImage(terrain,0,0);
    // A dark round tunnel connects each adjacent dug cell; a light edge reads as freshly dug earth.
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(game.dug[r*COLS+c]){
      const x=px(c+.5),y=py(r+.5);round(x-19,y-19,38,38,14,'#80533e');round(x-16,y-16,32,32,12,'#513e36');
      if(c+1<COLS&&game.dug[r*COLS+c+1])round(x,y-16,CELL,32,2,'#513e36');
      if(r+1<ROWS&&game.dug[(r+1)*COLS+c])round(x-16,y,32,CELL,2,'#513e36');
      if(game.antDug[r*COLS+c]){line([[x-10,y-7],[x-3,y-3],[x+7,y-6]],'#c98c5f99',1.6);line([[x-8,y+7],[x,y+4],[x+9,y+8]],'#c98c5f88',1.6);}
    }
    const poisonFront=new Set(game.waves.flatMap(w=>w.frontier));
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(game.poison[r*COLS+c]>0){
      const k=r*COLS+c,x=px(c+.5),y=py(r+.5),remaining=clamp(game.poison[k]/game.difficulty.poisonLife,0,1),a=.12+.76*Math.sqrt(remaining),radius=13+4*remaining;ctx.globalAlpha=a;
      round(x-radius,y-radius,radius*2,radius*2,10,'#a666e8');ellipse(x+Math.sin(t*3+c)*5,y+Math.cos(t*2+r)*6,5+2*remaining,4+2*remaining,'#d9b5fa');ellipse(x+8*remaining,y-8*remaining,2+remaining,2+remaining,'#f4d9ff');
      if(poisonFront.has(k)){ctx.lineWidth=3;round(x-19-Math.sin(t*10)*2,y-19-Math.sin(t*10)*2,38+Math.sin(t*10)*4,38+Math.sin(t*10)*4,12,null,'#f2d6ff');}ctx.globalAlpha=1;
    }
    for(const c of game.holes){const x=px(c+.5);ellipse(x,GY,22,7,'#7b593d');ellipse(x,GY,14,5,'#473a32');ellipse(x-22,GY,8,4,'#c2915e');ellipse(x+18,GY,7,4,'#c2915e');}
    game.plants.forEach(p=>roots(p,t));
    game.ants.forEach(ant=>drawAnt(ant,t));
    const f=game.farmer,fx=px(f.x),bop=f.mode==='walking'?Math.sin(t*14)*2:0;
    sprite(1,fx,155+bop,108,108,f.mode==='walking'&&f.target+.5<f.x);
    if(f.mode==='warning'||f.mode==='pouring'){
      const hole=px(f.target+.5);ctx.strokeStyle='#d7a3ff';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(hole,GY,27+Math.sin(t*9)*3,10,0,0,7);ctx.stroke();
      round(clamp(hole-83,5,W-171),61,166,31,12,'#7444a6');text(f.mode==='warning'?`POISON IN ${Math.max(1,Math.ceil(f.clock))}…`:'RUN FROM PURPLE!',clamp(hole,88,W-88),82,14,'#fff5ff');
      if(f.mode==='pouring'){line([[fx+26,171],[fx+30,185],[hole,GY]],'#c5a0f7',6);for(let i=0;i<3;i++)ellipse(hole+Math.sin(t*8+i)*8,GY+((t*70+i*14)%28),3,4,'#cbb4fb');}
    }
    if(target&&mode==='playing'){const x=px(target.x),y=py(target.y);ctx.setLineDash([3,5]);ctx.strokeStyle='#f7d17b80';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.stroke();ctx.setLineDash([]);}
    const p=game.player;
    const playerX=px(p.x),playerY=py(p.y),blink=game.invulnerable>0&&Math.floor(t*12)%2===0;
    if(death?.source==='poison'){
      const age=Math.max(0,t-death.start),fall=reduced?1:Math.min(1,age/.28),angle=(p.facing<0?-1:1)*Math.PI*.48*fall;
      ellipse(playerX,playerY+24,28,8,'#261f234f');ellipse(playerX,playerY,35+Math.sin(t*9)*3,29+Math.sin(t*9)*2,'#b990e54d');
      drawSprite(poisonedMoleTile,playerX,playerY+8*fall,76,76,p.facing<0,angle,.94);
      for(let i=0;i<4;i++){const phase=(age*.9+i*.23)%1;ellipse(playerX-24+i*16+Math.sin(t*5+i)*5,playerY+18-phase*58,3+phase*2,3+phase*2,'#e5c9ffbb');}
    }else{
      const bounce=p.moving&&!reduced?Math.sin(t*24)*1.5:0,bite=visualTime<biteUntil?Math.sin((biteUntil-visualTime)*32)*.08:0;
      ellipse(playerX,playerY+21,24,7,'#261f233b');sprite(0,playerX,playerY+bounce,73+(bite?3:0),73,p.facing<0,bite,blink?.45:1);
    }
    if(mode==='menu') {text('SOMEBODY IS DOWN THERE…',W/2,H-23,12,'#e8ba8870');}
    for(const item of particles){const age=t-item.start;if(age>item.life)continue;ctx.globalAlpha=1-age/item.life;ellipse(item.x+item.vx*age,item.y+item.vy*age+95*age*age,item.size,item.size*.75,item.color);ctx.globalAlpha=1;}
    for(const item of popups){const age=t-item.start;if(age>1.4)continue;ctx.globalAlpha=1-age/1.4;text(item.text,item.x,item.y-age*40,22,item.color);ctx.globalAlpha=1;}
    // Subtle underground decorative stripe; lower earth always remains available as an escape route.
    text('DIG YOUR OWN WAY',76,H-13,10,'#dab19277','left',500);
    text('NAUGHTY MOLE 2',W-40,H-13,10,'#dab19277','right',500);
  }
  function beep(kind){if(muted)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const now=audioContext.currentTime;
    const notes=kind==='eat'?[440,660,880]:kind==='win'?[523,659,784,1047]:kind==='hurt'?[190,120]:kind==='ant'?[330,260,220]:[310,260];
    notes.forEach((f,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+i*.085);g.gain.exponentialRampToValueAtTime(.07,now+i*.085+.015);g.gain.exponentialRampToValueAtTime(.0001,now+i*.085+.13);o.connect(g);g.connect(audioContext.destination);o.start(now+i*.085);o.stop(now+i*.085+.14);});}catch{}}
  function updateSoundButton(){
    $('sound').textContent=muted?'♪ Sound off':'♫ Sound on';$('sound').setAttribute('aria-label',muted?'Turn music and sounds on':'Turn music and sounds off');$('sound').setAttribute('aria-pressed',String(!muted));
  }
  function syncMusic(){
    if(muted||mode!=='playing'){music.pause();return;}
    const playing=music.play();if(playing&&typeof playing.catch==='function')playing.catch(()=>{});
  }
  function toast(message,duration=3){$('toast').textContent=message;$('toast').classList.add('on');toastUntil=visualTime+duration;}
  function emit(event){
    if(event.type==='eat'){
      if(target?.plantIndex!==undefined&&game.plants[target.plantIndex].eaten){target=null;$('tip').textContent=defaultTip;}
      biteUntil=visualTime+.3;beep('eat');popups.push({text:`+${event.points}`,x:px(event.x),y:py(event.y)-24,start:visualTime,color:'#fff3ac'});
      const crop=CROPS[event.kind];
      for(let i=0;i<(reduced?4:16);i++){particles.push({x:px(event.x),y:i%2?py(event.y):GY-25,vx:(Math.random()-.5)*180,vy:-50-Math.random()*120,start:visualTime,life:.6+Math.random()*.5,size:3+Math.random()*4,color:i%2?crop.color:'#b5d974'});}
      if(game.remaining===1)toast('Only one root left. You can do it!');
    }else if(event.type==='warning'){beep('warning');toast('The farmer is about to pour: run!',1.5);}
    else if(event.type==='antSpawn'&&event.count===1){beep('ant');toast('Ants dig tunnels, and poison can follow them!',3.2);}
    else if(event.type==='hurt'){
      beep('hurt');
      if(event.source==='poison'&&event.fatal){death={source:'poison',start:visualTime};toast('The poison touched the mole: instant KO!',1.2);
        for(let i=0;i<(reduced?5:18);i++)particles.push({x:px(event.x),y:py(event.y),vx:(Math.random()-.5)*150,vy:-35-Math.random()*95,start:visualTime,life:.55+Math.random()*.45,size:3+Math.random()*5,color:i%2?'#b87be8':'#e4c9ff'});
      }else toast('Ouch, an ant! You lost one heart: keep moving.');
    }
    else if(event.type==='win'){beep('win');showSummary();}
    else if(event.type==='lose'){
      if(event.source==='poison'){clearInput();mode='dying';summaryAt=visualTime+(reduced?.5:.95);$('pause').disabled=true;$('stop').disabled=true;document.body.classList.remove('playing');syncMusic();}
      else showSummary();
    }
    else if(event.type==='dig'&&Math.random()<.3&&!reduced){particles.push({x:px(event.x),y:py(event.y)+8,vx:(Math.random()-.5)*35,vy:-15,start:visualTime,life:.3,size:3,color:event.source==='ant'?'#f0a765':'#e2b180'});}
  }
  function clearInput(){held.clear();touches.clear();target=null;canvasPointer=null;pointerOrigin=null;dragging=false;document.querySelectorAll('.dpad .active').forEach(b=>b.classList.remove('active'));game.player.moving=false;$('tip').textContent=defaultTip;}
  function hud(){
    const values={level:`${String(game.level).padStart(2,'0')} / ${LAST_LEVEL}`,plants:`${game.total-game.remaining} / ${game.total}`,score:game.score.toLocaleString('en-US'),hearts:'♥ '.repeat(game.health).trim()+' ♡'.repeat(3-game.health)};
    for(const [id,value] of Object.entries(values))if($(id).textContent!==value)$(id).textContent=value;
    $('hearts').setAttribute('aria-label',`${game.health} hearts`);$('progress').style.width=`${(1-game.remaining/game.total)*100}%`;
    $('stop').disabled=mode!=='playing'||(!target&&!game.player.moving);
  }
  function setPanel(kicker,title,body,button,note){
    clearInput();$('panel-kicker').textContent=kicker;$('panel-title').textContent=title;$('panel-text').textContent=body;$('play').textContent=button;$('panel-note').textContent=note;
    $('rules').hidden=true;$('overlay').hidden=false;$('pause').disabled=true;$('stop').disabled=true;$('restart').hidden=mode==='menu';document.body.classList.remove('playing');
    syncMusic();$('play').focus({preventScroll:true});
  }
  function begin(){
    clearInput();death=null;summaryAt=0;$('menu-card').classList.remove('poisoned','complete');mode='playing';$('overlay').hidden=true;$('pause').disabled=false;document.body.classList.add('playing');canvas.focus({preventScroll:true});
    if(comfortable)document.querySelector('.game-shell').scrollIntoView({block:'start',behavior:'instant'});
    syncMusic();
    const antCount=game.difficulty.antCount;
    toast(game.level===1?'Dig zigzags: bends, flat tunnels and climbs slow the poison. Ants arrive in garden 2!':`Garden ${game.level}: up to ${antCount} digging ${antCount===1?'ant':'ants'}. Use zigzags and climbs to lose the poison!`,4);
  }
  function showSummary(){mode='summary';summaryAt=0;savedBest=Math.max(savedBest,game.score);try{localStorage.setItem('naughty-mole-2-best',String(savedBest));}catch{}
    const poisoned=game.status==='lost'&&death?.source==='poison',completed=game.status==='complete';$('menu-card').classList.toggle('poisoned',poisoned);$('menu-card').classList.toggle('complete',completed);
    if(poisoned)setPanel('THE POISON REACHED THE MOLE','Oh, what a mess!','Poison is fatal on first contact. Dig zigzags: it slows on flat tunnels, even more on climbs, and loses time at every bend.','RETRY THIS GARDEN',`Restart garden ${game.level}. Personal best: ${savedBest.toLocaleString('en-US')} points.`);
    else if(game.status==='lost')setPanel('THE ANTS CAUGHT YOU','Oh, what a mess!','You ran out of hearts. Do not stop near the ants, and change direction often.','RETRY THIS GARDEN',`Restart garden ${game.level}. Personal best: ${savedBest.toLocaleString('en-US')} points.`);
    else if(completed)setPanel('ALL TWENTY GARDENS CLEARED','Golden pumpkin!','You ate every root, outran the farmer and dodged the digging ants. The garden’s grand golden pumpkin is your prize!','PLAY AGAIN',`${game.score.toLocaleString('en-US')} points · Golden pumpkin won · Best: ${savedBest.toLocaleString('en-US')}`);
    else setPanel(`GARDEN ${game.level} CLEARED`,'Crunch complete!','In the next garden the farmer pours sooner and the ants open new routes. Zigzags, flat tunnels and climbs remain your best escape.',`GO TO GARDEN ${game.level+1} →`,`+${game.bonus} points for your remaining hearts · Total ${game.score.toLocaleString('en-US')}`);
  }
  function pause(help=false){if(mode!=='playing')return;mode=help?'help':'paused';
    setPanel(help?'ONE TAP. THE MOLE HANDLES THE BITE.':'NO RUSH',help?'How to play':'Snack break',help?'Tap a plant or its root and the mole goes there. Poison kills instantly but slows on flat tunnels, climbs and every bend: dig zigzags. Ants open new passages and steal one heart.':'The mole takes a rest while the farmer waits. Resume whenever you like.','BACK TO DIGGING',`Goal: eat all ${game.total} roots. The game ends after garden ${LAST_LEVEL}.`);
  }
  $('play').addEventListener('click',()=>{
    if(!atlasReady)return;if(mode==='menu')game.start(1,0);else if(mode==='summary'){if(game.status==='won')game.next();else if(game.status==='lost')game.retry();else game.start(1,0);particles=[];popups=[];}
    begin();hud();
  });
  $('restart').addEventListener('click',()=>{game.start(1,0);particles=[];popups=[];begin();hud();});
  $('stop').addEventListener('click',()=>{clearInput();hud();});
  $('pause').addEventListener('click',()=>pause());$('help').addEventListener('click',()=>{if(mode==='playing')pause(true);else if(mode==='menu')toast('Roots are the small coloured targets below each plant.',5);});
  $('sound').addEventListener('click',()=>{muted=!muted;try{localStorage.setItem('naughty-mole-2-muted',String(muted));}catch{}updateSoundButton();syncMusic();if(!muted)beep('eat');});
  const keyMap={ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0],ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1]};
  window.addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;
    if((k==='Escape'||k===' ')&&!e.repeat){if(mode==='playing'){e.preventDefault();pause();}else if(mode==='paused'||mode==='help'){e.preventDefault();begin();}return;}
    if(keyMap[k]&&mode==='playing'){e.preventDefault();held.add(k);target=null;}
  });
  window.addEventListener('keyup',e=>held.delete(e.key.length===1?e.key.toLowerCase():e.key));
  window.addEventListener('blur',()=>{clearInput();pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();pause();}});
  function point(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
    const next=pickTarget(game.plants,{x,y},{width:r.width,height:r.height,assist:comfortable||e.pointerType==='touch',dragging});
    if(next){target=next;$('tip').textContent=next.plantIndex===undefined?'Digging here! Tap a plant to choose the next root.':`Heading for ${CROPS[game.plants[next.plantIndex].kind].name}. Tap elsewhere to change course.`;}}
  canvas.addEventListener('pointerdown',e=>{if(mode!=='playing'||(e.pointerType==='mouse'&&e.button!==0)||canvasPointer!==null)return;
    e.preventDefault();canvas.focus({preventScroll:true});canvasPointer=e.pointerId;pointerOrigin={x:e.clientX,y:e.clientY};dragging=false;canvas.setPointerCapture(e.pointerId);point(e);},{passive:false});
  canvas.addEventListener('pointermove',e=>{if(mode!=='playing'||canvasPointer!==e.pointerId)return;
    if(Math.hypot(e.clientX-pointerOrigin.x,e.clientY-pointerOrigin.y)>8)dragging=true;
    if(dragging){e.preventDefault();point(e);}},{passive:false});
  canvas.addEventListener('pointerup',e=>{if(canvasPointer===e.pointerId){canvasPointer=null;pointerOrigin=null;}});
  for(const event of ['pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{if(canvasPointer===e.pointerId){canvasPointer=null;pointerOrigin=null;target=null;$('tip').textContent=defaultTip;}});
  const directionButtons=[...document.querySelectorAll('[data-dir]')];
  function paintPad(){for(const b of directionButtons)b.classList.toggle('active',touches.active(b));}
  function releaseDirection(e){touches.release(e.pointerId);paintPad();}
  for(const b of directionButtons){
    b.addEventListener('pointerdown',e=>{e.preventDefault();if(mode!=='playing'||(e.pointerType==='mouse'&&e.button!==0))return;
      target=null;canvasPointer=null;pointerOrigin=null;const [dx,dy]=b.dataset.dir.split(',').map(Number);touches.press(e.pointerId,dx,dy,b);b.setPointerCapture(e.pointerId);paintPad();$('tip').textContent='Hold an arrow to dig. Release it and the mole stops.';},{passive:false});
    b.addEventListener('pointermove',e=>{if(!b.hasPointerCapture(e.pointerId))return;e.preventDefault();const over=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-dir]');
      if(directionButtons.includes(over)){const [dx,dy]=over.dataset.dir.split(',').map(Number);touches.press(e.pointerId,dx,dy,over);}else touches.release(e.pointerId);paintPad();},{passive:false});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,releaseDirection);
  }
  for(const event of ['pointerup','pointercancel'])window.addEventListener(event,releaseDirection);
  // Scope Safari's selection/callout guard to the game and buttons; page links remain usable.
  for(const region of document.querySelectorAll('.game-shell,.mobile-controls,button')){
    for(const event of ['selectstart','contextmenu','dragstart'])region.addEventListener(event,e=>e.preventDefault());
  }
  for(const region of [canvas,document.querySelector('.dpad')]){
    for(const event of ['touchstart','touchmove'])region.addEventListener(event,e=>e.preventDefault(),{passive:false});
  }
  for(const crop of CROPS){const item=document.createElement('div');item.className='crop';const art=document.createElement('canvas');art.className='crop-art';art.width=180;art.height=180;art.dataset.sprite=crop.sprite;art.setAttribute('aria-hidden','true');cropArts.push(art);const name=document.createElement('span');name.className='crop-name';name.textContent=crop.name;const score=document.createElement('strong');score.textContent=`${crop.points} pt`;item.append(art,name,score);$('crop-list').append(item);}
  if(atlasReady)renderCropArts();
  function loop(now){const dt=Math.min(.06,(now-(last||now))/1000);last=now;visualTime+=dt;
    if(mode==='playing'){
      let {dx,dy}=touches.vector();for(const k of held){dx+=keyMap[k][0];dy+=keyMap[k][1];}
      if(target&&dx===0&&dy===0){const vector=targetVector(game.player,target,SPEED,dt);dx=vector.dx;dy=vector.dy;if(vector.arrived){target=null;$('tip').textContent=defaultTip;}}
      game.update(dt,dx,dy);game.takeEvents().forEach(emit);hud();
    }
    if(mode==='dying'&&visualTime>=summaryAt)showSummary();
    particles=particles.filter(p=>visualTime-p.start<p.life);popups=popups.filter(p=>visualTime-p.start<1.4);
    if(visualTime>toastUntil)$('toast').classList.remove('on');draw(visualTime);requestAnimationFrame(loop);
  }
  updateSoundButton();hud();requestAnimationFrame(loop);
})();
