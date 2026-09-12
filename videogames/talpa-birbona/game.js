/* Talpa Birbona — canvas presentation and immediate keyboard/touch controls. */
(() => {
  'use strict';
  const {Game,CROPS,COLS,ROWS,LAST_LEVEL,SPEED}=TalpaCore;
  const canvas=document.querySelector('#game'), ctx=canvas.getContext('2d');
  const $=id=>document.getElementById(id);
  const W=1100,H=750,CELL=36,GX=46,GY=210;
  const game=new Game(); let mode='menu', target=null, last=0, visualTime=0, toastUntil=0, biteUntil=0;
  let muted=true, audioContext=null, atlasReady=false, particles=[], popups=[], savedBest=0;
  const held=new Set(), touches=new Map(), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const atlas=new Image(); atlas.src='assets/characters.png';
  try{savedBest=Number(localStorage.getItem('talpa-birbona-best'))||0;}catch{}
  $('play').disabled=true;
  atlas.onload=()=>{atlasReady=true;$('play').disabled=false;};
  atlas.onerror=()=>{$('panel-text').textContent='Le immagini non si sono caricate. Ricarica la pagina per riprovare.';};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const px=x=>GX+x*CELL, py=y=>GY+y*CELL;
  function round(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
  function ellipse(x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
  function line(points,color,width=3){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function text(t,x,y,size=16,color='#fff8dd',align='center',weight=600){ctx.font=`${weight} ${size}px Fredoka, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(t,x,y);}
  function sprite(id,x,y,w,h=w,flip=false,angle=0,alpha=1){
    if(!atlasReady)return;const s=atlas.naturalWidth/4;
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);if(flip)ctx.scale(-1,1);
    ctx.drawImage(atlas,id%4*s,Math.floor(id/4)*s,s,s,-w/2,-h/2,w,h);ctx.restore();
  }
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
    ellipse(x,y,18+Math.sin(t*3+plant.x)*1.4,18,'#f9cb7920');
    ellipse(x,y,12,13,crop.color);ellipse(x-3,y-4,4,4,'#ffffff65');
    line([[x-5,y+12],[x-7,y+19]],'#f0c49b',2);line([[x+4,y+12],[x+7,y+17]],'#f0c49b',2);
    round(x-21,y+22,42,19,8,'#683d3299');text(crop.points,x,y+36,12,'#ffe8bc');
  }
  function draw(t){
    ctx.clearRect(0,0,W,H);landscape(t);ctx.drawImage(terrain,0,0);
    // A dark round tunnel connects each adjacent dug cell; a light edge reads as freshly dug earth.
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(game.dug[r*COLS+c]){
      const x=px(c+.5),y=py(r+.5);round(x-19,y-19,38,38,14,'#80533e');round(x-16,y-16,32,32,12,'#513e36');
      if(c+1<COLS&&game.dug[r*COLS+c+1])round(x,y-16,CELL,32,2,'#513e36');
      if(r+1<ROWS&&game.dug[(r+1)*COLS+c])round(x-16,y,32,CELL,2,'#513e36');
    }
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(game.poison[r*COLS+c]>0){
      const x=px(c+.5),y=py(r+.5),a=Math.min(.85,game.poison[r*COLS+c]/2);ctx.globalAlpha=a;
      round(x-17,y-17,34,34,10,'#a666e8');ellipse(x+Math.sin(t*3+c)*5,y+Math.cos(t*2+r)*6,7,6,'#d9b5fa');ellipse(x+9,y-8,3,3,'#f4d9ff');ctx.globalAlpha=1;
    }
    for(const c of game.holes){const x=px(c+.5);ellipse(x,GY,22,7,'#7b593d');ellipse(x,GY,14,5,'#473a32');ellipse(x-22,GY,8,4,'#c2915e');ellipse(x+18,GY,7,4,'#c2915e');}
    game.plants.forEach(p=>roots(p,t));
    const f=game.farmer,fx=px(f.x),bop=f.mode==='walking'?Math.sin(t*14)*2:0;
    sprite(1,fx,155+bop,108,108,f.mode==='walking'&&f.target+.5<f.x);
    if(f.mode==='warning'||f.mode==='pouring'){
      const hole=px(f.target+.5);ctx.strokeStyle='#d7a3ff';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(hole,GY,27+Math.sin(t*9)*3,10,0,0,7);ctx.stroke();
      round(clamp(hole-83,5,W-171),61,166,31,12,'#7444a6');text(f.mode==='warning'?`VELENO TRA ${Math.max(1,Math.ceil(f.clock))}…`:'SCAPPA DAL VIOLA!',clamp(hole,88,W-88),82,14,'#fff5ff');
      if(f.mode==='pouring'){line([[fx+26,171],[fx+30,185],[hole,GY]],'#c5a0f7',6);for(let i=0;i<3;i++)ellipse(hole+Math.sin(t*8+i)*8,GY+((t*70+i*14)%28),3,4,'#cbb4fb');}
    }
    if(target&&mode==='playing'){const x=px(target.x),y=py(target.y);ctx.setLineDash([3,5]);ctx.strokeStyle='#f7d17b80';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.stroke();ctx.setLineDash([]);}
    const p=game.player;
    const blink=game.invulnerable>0&&Math.floor(t*12)%2===0;
    const bounce=p.moving&&!reduced?Math.sin(t*24)*1.5:0;
    const bite=visualTime<biteUntil?Math.sin((biteUntil-visualTime)*32)*.08:0;
    ellipse(px(p.x),py(p.y)+21,24,7,'#261f233b');
    sprite(0,px(p.x),py(p.y)+bounce,73+(bite?3:0),73, p.facing<0,bite,blink?.45:1);
    if(mode==='menu') {text('LA SOTTO C’È QUALCUNO…',W/2,H-23,12,'#e8ba8870');}
    for(const item of particles){const age=t-item.start;if(age>item.life)continue;ctx.globalAlpha=1-age/item.life;ellipse(item.x+item.vx*age,item.y+item.vy*age+95*age*age,item.size,item.size*.75,item.color);ctx.globalAlpha=1;}
    for(const item of popups){const age=t-item.start;if(age>1.4)continue;ctx.globalAlpha=1-age/1.4;text(item.text,item.x,item.y-age*40,22,item.color);ctx.globalAlpha=1;}
    // Subtle underground decorative stripe; lower earth always remains available as an escape route.
    text('SCAVA LA TUA STRADA',76,H-13,10,'#dab19277','left',500);
    text('TALPA BIRBONA',W-40,H-13,10,'#dab19277','right',500);
  }
  function beep(kind){if(muted)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const now=audioContext.currentTime;
    const notes=kind==='eat'?[440,660,880]:kind==='win'?[523,659,784,1047]:kind==='hurt'?[190,120]:[310,260];
    notes.forEach((f,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+i*.085);g.gain.exponentialRampToValueAtTime(.07,now+i*.085+.015);g.gain.exponentialRampToValueAtTime(.0001,now+i*.085+.13);o.connect(g);g.connect(audioContext.destination);o.start(now+i*.085);o.stop(now+i*.085+.14);});}catch{}}
  function toast(message,duration=3){$('toast').textContent=message;$('toast').classList.add('on');toastUntil=visualTime+duration;}
  function emit(event){
    if(event.type==='eat'){
      biteUntil=visualTime+.3;beep('eat');popups.push({text:`+${event.points}`,x:px(event.x),y:py(event.y)-24,start:visualTime,color:'#fff3ac'});
      const crop=CROPS[event.kind];
      for(let i=0;i<(reduced?4:16);i++){particles.push({x:px(event.x),y:i%2?py(event.y):GY-25,vx:(Math.random()-.5)*180,vy:-50-Math.random()*120,start:visualTime,life:.6+Math.random()*.5,size:3+Math.random()*4,color:i%2?crop.color:'#b5d974'});}
      if(game.remaining===1)toast('Ne resta una sola. Dai, che ci sei!');
    }else if(event.type==='warning'){beep('warning');toast('Occhio al contadino! Il veleno segue i cunicoli.',2.5);}
    else if(event.type==='hurt'){beep('hurt');toast('Ahi! Scava nella terra marrone per uscire dal veleno.');}
    else if(event.type==='win'){beep('win');showSummary();}
    else if(event.type==='lose'){showSummary();}
    else if(event.type==='dig'&&Math.random()<.3&&!reduced){particles.push({x:px(event.x),y:py(event.y)+8,vx:(Math.random()-.5)*35,vy:-15,start:visualTime,life:.3,size:3,color:'#e2b180'});}
  }
  function clearInput(){held.clear();touches.clear();target=null;document.querySelectorAll('.dpad .active').forEach(b=>b.classList.remove('active'));game.player.moving=false;}
  function hud(){
    const values={level:`${String(game.level).padStart(2,'0')} / ${LAST_LEVEL}`,plants:`${game.total-game.remaining} / ${game.total}`,score:game.score.toLocaleString('it-IT'),hearts:'♥ '.repeat(game.health).trim()+' ♡'.repeat(3-game.health)};
    for(const [id,value] of Object.entries(values))if($(id).textContent!==value)$(id).textContent=value;
    $('hearts').setAttribute('aria-label',`${game.health} vite`);$('progress').style.width=`${(1-game.remaining/game.total)*100}%`;
  }
  function setPanel(kicker,title,body,button,note){
    clearInput();$('panel-kicker').textContent=kicker;$('panel-title').textContent=title;$('panel-text').textContent=body;$('play').textContent=button;$('panel-note').textContent=note;
    $('rules').hidden=true;$('overlay').hidden=false;$('pause').disabled=true;$('restart').hidden=mode==='menu';document.body.classList.remove('playing');
    $('play').focus({preventScroll:true});
  }
  function begin(){
    clearInput();mode='playing';$('overlay').hidden=true;$('pause').disabled=false;document.body.classList.add('playing');canvas.focus({preventScroll:true});
    toast(game.level===1?'Cerca le radici colorate: il morso è automatico!':`Orto ${game.level}: ${game.total} piante, contadino più veloce!`,4);
  }
  function showSummary(){mode='summary';savedBest=Math.max(savedBest,game.score);try{localStorage.setItem('talpa-birbona-best',String(savedBest));}catch{}
    if(game.status==='lost')setPanel('IL CONTADINO TI HA BECCATA','Ops, che guaio!','Hai finito i cuori. Evita il viola e scava una nuova via nella terra marrone: il veleno si dissolve dopo pochi secondi.','RIPROVA QUESTO ORTO',`Riparti dall’orto ${game.level}. Record personale: ${savedBest.toLocaleString('it-IT')} punti.`);
    else if(game.status==='complete')setPanel('TUTTI E DIECI GLI ORTI COMPLETATI','Sei una birbona!','Carote, alberi, perfino il grano: hai mangiato tutte le piante e completato il gioco. Il contadino si prende una pausa!','GIOCA DI NUOVO',`${game.score.toLocaleString('it-IT')} punti · Record: ${savedBest.toLocaleString('it-IT')}`);
    else setPanel(`ORTO ${game.level} COMPLETATO`,'Sgranocchiato!','Tutte le piante sono state mangiate. Nel prossimo orto il contadino sarà un po’ più veloce: lascia sempre una via di fuga.',`VAI ALL’ORTO ${game.level+1} →`,`+${game.bonus} punti per i cuori rimasti · Totale ${game.score.toLocaleString('it-IT')}`);
  }
  function pause(help=false){if(mode!=='playing')return;mode=help?'help':'paused';
    setPanel(help?'BASTA MUOVERSI. AL MORSO PENSA LEI.':'NESSUNA FRETTA',help?'Come si gioca?':'Pausa merenda',help?'Frecce / WASD oppure tocca un punto sotto terra. Raggiungi ogni radice colorata per far seccare la pianta. Il contadino versa veleno viola nelle buche: scava nella terra intatta per scappare. Hai 3 cuori.':'La talpa si riposa e il contadino aspetta. Riprendi quando vuoi.','TORNA A SCAVARE',`Obiettivo: tutte le ${game.total} piante dell’orto. Il gioco finisce dopo l’orto 10.`);
  }
  $('play').addEventListener('click',()=>{
    if(!atlasReady)return;if(mode==='menu')game.start(1,0);else if(mode==='summary'){if(game.status==='won')game.next();else if(game.status==='lost')game.retry();else game.start(1,0);particles=[];popups=[];}
    begin();hud();
  });
  $('restart').addEventListener('click',()=>{game.start(1,0);particles=[];popups=[];begin();hud();});
  $('pause').addEventListener('click',()=>pause());$('help').addEventListener('click',()=>{if(mode==='playing')pause(true);else if(mode==='menu')toast('Le radici sono i piccoli bersagli colorati sotto ogni pianta.',5);});
  $('sound').addEventListener('click',()=>{muted=!muted;$('sound').textContent=muted?'♪ Audio spento':'♪ Audio acceso';$('sound').setAttribute('aria-label',muted?'Attiva audio':'Disattiva audio');$('sound').setAttribute('aria-pressed',String(!muted));if(!muted)beep('eat');});
  const keyMap={ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0],ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1]};
  window.addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;
    if((k==='Escape'||k===' ')&&!e.repeat){if(mode==='playing'){e.preventDefault();pause();}else if(mode==='paused'||mode==='help'){e.preventDefault();begin();}return;}
    if(keyMap[k]&&mode==='playing'){e.preventDefault();held.add(k);target=null;}
  });
  window.addEventListener('keyup',e=>held.delete(e.key.length===1?e.key.toLowerCase():e.key));
  window.addEventListener('blur',()=>{clearInput();pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();pause();}});
  function point(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
    if(y<GY&&e.type==='pointerdown')return;target={x:clamp((x-GX)/CELL,.5,COLS-.5),y:clamp((y-GY)/CELL,.5,ROWS-.5)};}
  let canvasPointer=null;
  canvas.addEventListener('pointerdown',e=>{if(mode!=='playing')return;e.preventDefault();canvas.focus({preventScroll:true});canvasPointer=e.pointerId;canvas.setPointerCapture(e.pointerId);point(e);});
  canvas.addEventListener('pointermove',e=>{if(mode==='playing'&&canvasPointer===e.pointerId)point(e);});
  canvas.addEventListener('pointerup',()=>{canvasPointer=null;});canvas.addEventListener('pointercancel',()=>{canvasPointer=null;target=null;});
  for(const b of document.querySelectorAll('[data-dir]')){
    b.addEventListener('pointerdown',e=>{e.preventDefault();if(mode!=='playing')return;target=null;touches.set(e.pointerId,b.dataset.dir.split(',').map(Number));b.setPointerCapture(e.pointerId);b.classList.add('active');});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,e=>{touches.delete(e.pointerId);b.classList.remove('active');});
    b.addEventListener('contextmenu',e=>e.preventDefault());
  }
  for(const crop of CROPS){const item=document.createElement('div');item.className='crop';const art=document.createElement('span');art.className='crop-art';art.style.backgroundPosition=`${crop.sprite%4*100/3}% ${Math.floor(crop.sprite/4)*50}%`;art.setAttribute('aria-hidden','true');const name=document.createElement('span');name.className='crop-name';name.textContent=crop.name;const score=document.createElement('strong');score.textContent=`${crop.points} pt`;item.append(art,name,score);$('crop-list').append(item);}
  function loop(now){const dt=Math.min(.06,(now-(last||now))/1000);last=now;visualTime+=dt;
    if(mode==='playing'){
      let dx=0,dy=0;for(const k of held){dx+=keyMap[k][0];dy+=keyMap[k][1];}for(const v of touches.values()){dx+=v[0];dy+=v[1];}
      if(target&&dx===0&&dy===0){dx=target.x-game.player.x;dy=target.y-game.player.y;const dist=Math.hypot(dx,dy);
        if(dist<.04){target=null;dx=dy=0;}else{const strength=Math.min(1,dist/(SPEED*Math.max(dt,.001)));dx=dx/dist*strength;dy=dy/dist*strength;}}
      game.update(dt,dx,dy);game.takeEvents().forEach(emit);hud();
    }
    particles=particles.filter(p=>visualTime-p.start<p.life);popups=popups.filter(p=>visualTime-p.start<1.4);
    if(visualTime>toastUntil)$('toast').classList.remove('on');draw(visualTime);requestAnimationFrame(loop);
  }
  hud();requestAnimationFrame(loop);
})();
