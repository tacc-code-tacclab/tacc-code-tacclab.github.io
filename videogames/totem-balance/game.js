(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const canvas = $('#gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = 1000, H = 650;
  const root = { x: 500, y: 472 };
  const ui = {
    title: $('#titleScreen'), game: $('#gameScreen'), modal: $('#resultModal'),
    pScore: $('#playerScore'), cScore: $('#cpuScore'), opponent: $('#opponentLabel'),
    turn: $('#turnLabel'), count: $('#pieceCount'), piece: $('#pieceName'),
    fill: $('#stabilityFill'), stability: $('#stabilityText'), banner: $('#messageBanner'),
    controls: $('#controls'), resultTitle: $('#resultTitle'), resultText: $('#resultText'),
    resultEyebrow: $('#resultEyebrow'), best: $('#bestScore')
  };

  const COLORS = [
    ['#8e461f','#f4b14c','#4d2518'], ['#0c6973','#4de5df','#063b4b'],
    ['#4b5368','#c7e7f0','#171c2a'], ['#792a70','#e17bd3','#35173d'],
    ['#7f6321','#ffe16d','#3e2f14']
  ];
  const SHAPES = [
    {name:'MOON SPEAR',len:208,bend:-20,weight:.93,hooks:[-.37,0,.34],tip:'spear'},
    {name:'SERPENT KEY',len:182,bend:31,weight:1.05,hooks:[-.34,.08,.39],tip:'hook'},
    {name:'SUN FORK',len:225,bend:12,weight:1.18,hooks:[-.4,-.05,.29],tip:'fork'},
    {name:'RUNE NEEDLE',len:164,bend:-36,weight:.82,hooks:[-.38,.16,.4],tip:'diamond'},
    {name:'ORACLE ARC',len:196,bend:46,weight:1.1,hooks:[-.42,-.12,.31],tip:'ring'},
    {name:'TITAN BONE',len:238,bend:-7,weight:1.3,hooks:[-.3,.04,.36],tip:'hammer'},
    {name:'EMBER WAND',len:176,bend:20,weight:.9,hooks:[-.42,.03,.42],tip:'orb'}
  ];
  const PIECE_HOOK_ORDER=[1,0,2,1,0,2,1];
  const DIFFICULTY = {
    novice:{limit:38,cpuError:.23,settle:1450}, oracle:{limit:31,cpuError:.11,settle:1650}, titan:{limit:25,cpuError:.035,settle:1850}
  };
  const STAND_BALLAST=2.8;

  let mode='duel', difficulty='oracle', state='menu', turn='player';
  let pieces=[], current=null, playerScore=0, cpuScore=0, pieceNumber=0, best=0;
  let pointer=null, rotateHold=0, lastTime=0, stress=0, soundOn=true, bannerTimer=0;
  let audio=null, aiTimer=0, collapseStart=0, dangerTime=0, physicsToken=0, loopRunning=false, selectedAnchor=0;

  function makePiece(index=pieceNumber){
    const shape=SHAPES[index%SHAPES.length];
    return {
      shape, palette:COLORS[index%COLORS.length], x:500, y:150,
      angle:(index%2?-.14:.12), hookIndex:PIECE_HOOK_ORDER[index%PIECE_HOOK_ORDER.length], owner:turn,
      placed:false, parent:null, anchor:null, baseAngle:0, wobble:0, angleV:0, slipTime:0,
      locked:false,fall:false, vx:0, vy:0, spin:0, opacity:1
    };
  }

  function worldPoint(piece, lx, ly=0){
    const c=Math.cos(piece.angle+piece.wobble), s=Math.sin(piece.angle+piece.wobble);
    return {x:piece.x+lx*c-ly*s,y:piece.y+lx*s+ly*c};
  }
  function hookPoint(piece, idx=piece.hookIndex){
    return worldPoint(piece,piece.shape.hooks[idx]*piece.shape.len,curveY(piece,piece.shape.hooks[idx]));
  }
  function curveY(piece,t){ return Math.sin((t+.5)*Math.PI)*piece.shape.bend; }
  function availableAnchors(){
    const a=[];
    for(let i=0;i<5;i++) a.push({x:root.x,y:root.y-58-i*68,parent:null,key:'r'+i,ref:null});
    pieces.forEach((p,pi)=>{
      if(p.fall)return;
      [-.48,.48].forEach((t,j)=>{ const q=worldPoint(p,t*p.shape.len,curveY(p,t)); a.push({...q,parent:p,key:pi+'e'+j,ref:{parent:p,t,kind:'edge'}}); });
      p.shape.hooks.forEach((t,j)=>{ if(j!==p.hookIndex){const q=hookPoint(p,j);a.push({...q,parent:p,key:pi+'h'+j,ref:{parent:p,t,kind:'hook'}});} });
    });
    return a.filter(a=>!pieces.some(p=>p.anchorKey===a.key));
  }

  function resize(){
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function startGame(which){
    mode=which;playerScore=0;cpuScore=0;best=Number(localStorage.getItem('totemBalanceBest')||0);
    ui.opponent.textContent=mode==='duel'?'ORACLE':'BEST'; resetRound(true);
    ui.title.classList.remove('active');ui.game.classList.add('active');ui.modal.classList.remove('open');
    ui.modal.setAttribute('aria-hidden','true');initAudio();tone(220,.05,'sine',.04);
    if(!loopRunning){loopRunning=true;lastTime=0;requestAnimationFrame(loop);}
  }
  function resetRound(first=false){
    physicsToken++;pieces=[];pieceNumber=0;turn='player';state='playing';stress=0;dangerTime=0;collapseStart=0;selectedAnchor=0;current=makePiece();
    current.x=500;current.y=155;updateHUD();
    if(!first) showBanner('A NEW RITUAL BEGINS'); else showBanner('ROTATE → HOOK → PLACE');
  }
  function updateHUD(){
    ui.pScore.textContent=mode==='duel'?playerScore:pieces.length;
    ui.cScore.textContent=mode==='duel'?cpuScore:best;
    ui.turn.textContent=turn==='player'?'YOUR TURN':'ORACLE THINKS';
    ui.count.textContent='PIECE '+(pieceNumber+1);ui.piece.textContent=current?current.shape.name:'—';
    const anchors=availableAnchors();selectedAnchor=anchors.length?selectedAnchor%anchors.length:0;
    $('#hookLabel').textContent=anchors.length?'HOOK '+(selectedAnchor+1)+'/'+anchors.length:'NO HOOK';
    ui.controls.classList.toggle('disabled',turn!=='player'||state!=='playing');
  }

  function chosenAnchor(){const a=availableAnchors();return a.length?a[selectedAnchor%a.length]:null;}
  function placeCurrent(){
    if(!current||turn!=='player'||state!=='playing')return;
    const a=chosenAnchor();
    if(!a){failTurn('THE RELIC MISSED THE TOTEM');return;}
    attach(current,a);
  }
  function attach(p,a){
    const hp=hookPoint(p);p.x+=a.x-hp.x;p.y+=a.y-hp.y;p.anchor={x:a.x,y:a.y};p.anchorRef=a.ref;p.anchorKey=a.key;p.parent=a.parent;p.placed=true;
    p.baseAngle=p.angle;p.wobble=0;p.angleV=(Math.random()-.5)*.18;p.slipTime=0;p.locked=false;
    pieces.push(p);current=null;state='settling';dangerTime=0;
    tone(460,.06,'triangle',.06);setTimeout(()=>tone(690,.08,'sine',.035),70);
    updateHUD();
    const token=physicsToken;setTimeout(()=>{if(token===physicsToken)resolvePlacement();},DIFFICULTY[difficulty].settle);
  }
  function resolvePlacement(){
    if(state!=='settling')return;
    calculateStress();
    const latest=pieces[pieces.length-1];
    if(stress>1||latest?.slipTime>120){collapse(turn);return;}
    if(latest){latest.locked=true;latest.angleV=0;latest.wobble=0;latest.slipTime=0;}
    best=Math.max(best,pieces.length);localStorage.setItem('totemBalanceBest',String(best));
    showBanner('LOCKED — THE RELIC HOLDS');tone(620,.12,'sine',.035);
    pieceNumber++;
    selectedAnchor=0;
    if(mode==='endless'){turn='player';current=makePiece();current.x=500;current.y=145;state='playing';updateHUD();showBanner('ROTATE → HOOK → PLACE');return;}
    turn=turn==='player'?'cpu':'player';current=makePiece();current.x=500;current.y=145;state='playing';updateHUD();
    if(turn==='cpu')beginAI();
  }
  function failTurn(message){showBanner(message);collapse(turn,true)}
  function calculateStress(){
    if(!pieces.length){stress=0;return;}
    let total=0,moment=0;
    pieces.forEach(p=>{const m=p.shape.weight;total+=m;moment+=(p.x-root.x)*m;});
    const drift=Math.abs(moment/(total+STAND_BALLAST));const height=Math.max(...pieces.map(p=>root.y-p.y));
    stress=Math.min(1.4,drift/DIFFICULTY[difficulty].limit + Math.max(0,height-430)/700 + pieces.length*.012);
  }
  function isDescendant(piece,ancestor){
    let p=piece;
    while(p){if(p===ancestor)return true;p=p.parent;}
    return false;
  }
  function subtreeDynamics(p){
    let mass=0,moment=0,inertia=0;
    for(const q of pieces){
      if(q.fall||!isDescendant(q,p))continue;
      const m=q.shape.weight,dx=q.x-p.anchor.x,dy=q.y-p.anchor.y;
      mass+=m;moment+=dx*m;inertia+=m*(dx*dx+dy*dy)+m*q.shape.len*q.shape.len/12;
    }
    return {mass,moment,inertia:Math.max(1800,inertia)};
  }
  function liveAnchor(p){
    if(!p.anchorRef)return p.anchor;
    const ref=p.anchorRef;
    return ref.kind==='hook'
      ? hookPoint(ref.parent,ref.parent.shape.hooks.indexOf(ref.t))
      : worldPoint(ref.parent,ref.t*ref.parent.shape.len,curveY(ref.parent,ref.t));
  }
  function endpointDanger(p){
    const left=worldPoint(p,-p.shape.len*.56,curveY(p,-.5));
    const right=worldPoint(p,p.shape.len*.56,curveY(p,.5));
    return left.y>505||right.y>505||left.x<28||right.x<28||left.x>972||right.x>972;
  }
  function collapse(loser,miss=false){
    if(state==='collapse'||state==='over')return;
    physicsToken++;state='collapse';collapseStart=performance.now();current=null;
    pieces.forEach((p,i)=>{p.fall=true;p.vx=(p.x-root.x)*.003+(Math.random()-.5)*1.2;p.vy=-1-Math.random()*2;p.spin=(Math.random()-.5)*.025;p.delay=i*24;});
    tone(90,.38,'sawtooth',.08);setTimeout(()=>tone(54,.55,'square',.045),120);
    showBanner(miss?'MISSED — THE RITUAL BREAKS':'THE TOTEM HAS FALLEN');
    const token=physicsToken;setTimeout(()=>{if(token===physicsToken)roundOver(loser);},1650);
  }
  function roundOver(loser){
    if(mode==='endless'){return finishGame(false);}
    if(loser==='player')cpuScore++;else playerScore++;
    updateHUD();
    if(playerScore>=2||cpuScore>=2)finishGame(playerScore>cpuScore);
    else setTimeout(()=>resetRound(false),700);
  }
  function finishGame(win){
    state='over';ui.modal.classList.add('open');ui.modal.setAttribute('aria-hidden','false');
    if(mode==='duel'){
      ui.resultEyebrow.textContent=win?'THE ORACLE BOWS':'THE ORACLE ENDURES';ui.resultTitle.textContent=win?'VICTORY':'DEFEAT';
      ui.resultText.textContent=win?'You forged a structure worthy of the moon temple.':'One unstable choice ended the ritual. Read the weight, then challenge the Oracle again.';
    }else{
      ui.resultEyebrow.textContent='THE RITUAL ENDS';ui.resultTitle.textContent=pieces.length>=best?'NEW RECORD':'TOTEM FALLEN';
      ui.resultText.textContent='Every impossible structure begins with one careful hook.';
    }
    ui.best.textContent=best+' PIECE'+(best===1?'':'S');
  }

  function beginAI(){
    state='ai';updateHUD();const anchors=availableAnchors();
    let bestChoice=null,bestValue=Infinity;
    for(const a of anchors){
      for(let n=0;n<18;n++){
          const angle=-1.2+n*.14;const test={...current,angle};
          const hp=hookPoint(test);test.x+=a.x-hp.x;test.y+=a.y-hp.y;
          const projected=(pieces.reduce((s,p)=>s+(p.x-root.x)*p.shape.weight,0)+(test.x-root.x)*test.shape.weight)/(pieces.reduce((s,p)=>s+p.shape.weight,0)+test.shape.weight+STAND_BALLAST);
          const edgePenalty=Math.max(0,Math.abs(test.x-root.x)-350)*2;
          let v=Math.abs(projected)+edgePenalty+Math.random()*DIFFICULTY[difficulty].cpuError*95;
          if(v<bestValue){bestValue=v;bestChoice={a,angle,x:test.x,y:test.y};}
        }
    }
    if(!bestChoice){collapse('cpu',true);return;}
    if(Math.random()<DIFFICULTY[difficulty].cpuError*.35)bestChoice.angle+=(Math.random()-.5)*1.1;
    const start={x:780,y:150,angle:current.angle},began=performance.now();
    aiTimer={choice:bestChoice,start,began};current.x=start.x;current.y=start.y;showBanner('THE ORACLE CHOOSES A HOOK');
  }
  function updateAI(now){
    if(!aiTimer||!current)return;
    const t=Math.min(1,(now-aiTimer.began)/1100),e=1-Math.pow(1-t,3),c=aiTimer.choice;
    current.x=lerp(aiTimer.start.x,c.x,e);current.y=lerp(aiTimer.start.y,c.y,e);current.angle=lerp(aiTimer.start.angle,c.angle,e);
    if(t>=1){aiTimer=0;state='playing';attach(current,c.a);}
  }

  function draw(now){
    ctx.clearRect(0,0,W,H);drawAtmosphere(now);drawTotem();
    const anchors=availableAnchors();
    if(turn==='player'&&state==='playing'){
      anchors.forEach((a,i)=>drawAnchor(a.x,a.y,i===selectedAnchor,i+1));
      const target=anchors[selectedAnchor%Math.max(1,anchors.length)];if(current&&target)drawPlacementGuide(current,target,now);
    }
    pieces.forEach(p=>drawPiece(p,false));if(current)drawPiece(current,true);
    if(state==='collapse')drawFragments(now);
  }
  function drawAtmosphere(now){
    ctx.save();ctx.globalCompositeOperation='screen';
    for(let i=0;i<18;i++){const x=(i*137+now*.012*(i%3+1))%1100-50,y=80+(i*83)%420,r=1+(i%3);ctx.globalAlpha=.08+(i%4)*.025;ctx.fillStyle=i%2?'#5fe9e6':'#ffb84b';ctx.beginPath();ctx.arc(x,y+Math.sin(now*.001+i)*9,r,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }
  function drawTotem(){
    const g=ctx.createLinearGradient(root.x-15,0,root.x+15,0);g.addColorStop(0,'#0e1722');g.addColorStop(.28,'#596473');g.addColorStop(.52,'#151d28');g.addColorStop(.8,'#9b6f38');g.addColorStop(1,'#161019');
    ctx.save();ctx.shadowColor='rgba(38,229,228,.35)';ctx.shadowBlur=14;ctx.fillStyle=g;roundRect(root.x-11,116,22,364,7);ctx.fill();ctx.shadowBlur=0;
    for(let y=145;y<455;y+=52){ctx.fillStyle='#17bcc1';ctx.globalAlpha=.65;ctx.beginPath();ctx.moveTo(root.x,y);ctx.lineTo(root.x+6,y+8);ctx.lineTo(root.x,y+16);ctx.lineTo(root.x-6,y+8);ctx.closePath();ctx.fill();}
    ctx.globalAlpha=1;ctx.strokeStyle='#d79a49';ctx.lineWidth=7;ctx.beginPath();ctx.arc(root.x,109,19,.3,Math.PI-.3);ctx.stroke();ctx.beginPath();ctx.arc(root.x,109,19,Math.PI+.3,-.3);ctx.stroke();
    ctx.fillStyle='#0b111d';ctx.beginPath();ctx.arc(root.x,109,8,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  function drawAnchor(x,y,hot=false,number=0){
    ctx.save();ctx.shadowColor=hot?'#fff1a0':'#ffb33e';ctx.shadowBlur=hot?22:10;ctx.strokeStyle=hot?'#fff4a8':'rgba(255,184,66,.72)';ctx.lineWidth=hot?4:2;ctx.beginPath();ctx.arc(x,y,hot?9:6,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  function drawPlacementGuide(piece,target,now){
    const hp=hookPoint(piece);ctx.save();ctx.setLineDash([7,8]);ctx.lineDashOffset=-now*.02;ctx.strokeStyle='rgba(255,225,129,.62)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hp.x,hp.y);ctx.lineTo(target.x,target.y);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#fff2a8';ctx.font='700 12px Inter, sans-serif';ctx.textAlign='center';ctx.fillText('SELECTED HOOK',target.x,target.y-17);ctx.restore();
  }
  function drawPiece(p,ghost){
    if(p.opacity<=0)return;const L=p.shape.len;ctx.save();ctx.globalAlpha=p.opacity*(ghost?.94:1);ctx.translate(p.x,p.y);ctx.rotate(p.angle+p.wobble);
    ctx.shadowColor=p.palette[1];ctx.shadowBlur=ghost?13:7;ctx.lineCap='round';ctx.lineJoin='round';
    const path=new Path2D();path.moveTo(-L/2,curveY(p,-.5));path.bezierCurveTo(-L*.2,p.shape.bend,L*.18,p.shape.bend*.5,L/2,curveY(p,.5));
    ctx.strokeStyle='#070b10';ctx.lineWidth=18;ctx.stroke(path);const grad=ctx.createLinearGradient(-L/2,0,L/2,0);grad.addColorStop(0,p.palette[2]);grad.addColorStop(.28,p.palette[0]);grad.addColorStop(.53,p.palette[1]);grad.addColorStop(.7,p.palette[0]);grad.addColorStop(1,p.palette[2]);ctx.strokeStyle=grad;ctx.lineWidth=12;ctx.stroke(path);ctx.strokeStyle='rgba(255,255,255,.36)';ctx.lineWidth=2;ctx.stroke(path);
    drawTips(p,L);drawRunes(p,L);
    p.shape.hooks.forEach((t,i)=>{const y=curveY(p,t);ctx.shadowBlur=i===p.hookIndex&&ghost?18:4;ctx.strokeStyle=i===p.hookIndex&&ghost?'#fff39b':'#d39a50';ctx.lineWidth=i===p.hookIndex&&ghost?4:2.5;ctx.beginPath();ctx.arc(t*L,y+8,7,Math.PI,0);ctx.stroke();});
    ctx.restore();
  }
  function drawTips(p,L){
    ctx.fillStyle=p.palette[1];ctx.strokeStyle='#28170f';ctx.lineWidth=3;
    const y1=curveY(p,-.5),y2=curveY(p,.5);
    if(p.shape.tip==='ring'){ctx.beginPath();ctx.arc(L/2+8,y2,12,0,Math.PI*2);ctx.strokeStyle=p.palette[1];ctx.lineWidth=6;ctx.stroke();}
    else if(p.shape.tip==='orb'){ctx.beginPath();ctx.arc(L/2+5,y2,9,0,Math.PI*2);ctx.fill();}
    else{ctx.beginPath();ctx.moveTo(L/2+15,y2);ctx.lineTo(L/2-2,y2-10);ctx.lineTo(L/2-2,y2+10);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.beginPath();ctx.moveTo(-L/2-13,y1);ctx.lineTo(-L/2+2,y1-9);ctx.lineTo(-L/2+2,y1+9);ctx.closePath();ctx.fill();ctx.stroke();
  }
  function drawRunes(p,L){
    ctx.shadowBlur=8;ctx.fillStyle=p.palette[1];ctx.globalAlpha=.9;
    [-.2,.08,.25].forEach((t,i)=>{const y=curveY(p,t);ctx.save();ctx.translate(t*L,y);ctx.rotate(Math.PI/4);ctx.fillRect(-3-i%2,-3-i%2,6+i%2*2,6+i%2*2);ctx.restore();});ctx.globalAlpha=1;
  }
  function drawFragments(){/* Falling rods are updated in physics; sparks provide the break effect. */}
  function updatePhysics(dt,now){
    const seconds=dt/1000;
    pieces.forEach((p,i)=>{
      if(p.fall){if(now-collapseStart<p.delay)return;p.vy+=.018*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;p.opacity=Math.max(0,1-(now-collapseStart-650)/900);return;}
      const live=liveAnchor(p);p.anchor.x=live.x;p.anchor.y=live.y;
      let hp=hookPoint(p);p.x+=p.anchor.x-hp.x;p.y+=p.anchor.y-hp.y;
      if(p.locked){p.angleV=0;p.wobble=0;return;}
      const dyn=subtreeDynamics(p);
      const gravityTorque=dyn.moment*245;
      const breeze=Math.sin(now*.00125+i*2.17)*(4+pieces.length*.55);
      const angularA=gravityTorque/dyn.inertia+breeze/dyn.inertia*60-p.angleV*1.75;
      p.angleV+=angularA*seconds;p.angleV*=Math.exp(-.34*seconds);p.angle+=p.angleV*seconds;
      hp=hookPoint(p);p.x+=p.anchor.x-hp.x;p.y+=p.anchor.y-hp.y;
      const relativeSpeed=Math.abs(p.angleV-(p.parent?.angleV||0));
      const a=Math.atan2(Math.sin(p.angle),Math.cos(p.angle));
      const overloaded=dyn.mass>4.4+p.shape.weight*1.4;
      const unsafe=Math.abs(a)>1.88||relativeSpeed>3.25||endpointDanger(p)||overloaded;
      p.slipTime=Math.max(0,p.slipTime+(unsafe?dt:-dt*1.8));
    });
    if(current&&turn==='player'&&state==='playing'&&!pointer)current.wobble=Math.sin(now*.003)*.018;
    if(state==='settling'&&pieces.length){
      const slipping=pieces.some(p=>p.slipTime>150);
      dangerTime=Math.max(0,dangerTime+(stress>1?dt:-dt*1.5));
      if(slipping||dangerTime>260){showBanner(slipping?'A HOOK HAS SLIPPED':'THE WEIGHT PULLS THE TOTEM OVER');collapse(turn);}
    }
  }

  function canvasPoint(ev){const r=canvas.getBoundingClientRect();return{x:(ev.clientX-r.left)/r.width*W,y:(ev.clientY-r.top)/r.height*H};}
  canvas.addEventListener('pointerdown',ev=>{if(turn!=='player'||state!=='playing'||!current)return;ev.preventDefault();canvas.setPointerCapture(ev.pointerId);pointer={id:ev.pointerId,...canvasPoint(ev)};});
  canvas.addEventListener('pointermove',()=>{});
  canvas.addEventListener('pointerup',ev=>{if(!pointer||pointer.id!==ev.pointerId)return;const point=canvasPoint(ev),anchors=availableAnchors();let best=-1,bestD=Infinity;anchors.forEach((a,i)=>{const d=Math.hypot(point.x-a.x,point.y-a.y);if(d<bestD){bestD=d;best=i;}});pointer=null;if(best>=0&&bestD<70){selectedAnchor=best;updateHUD();showBanner('HOOK '+(best+1)+' SELECTED');tone(510,.035,'triangle',.02);}});
  canvas.addEventListener('pointercancel',()=>pointer=null);
  canvas.addEventListener('wheel',ev=>{if(!current||turn!=='player')return;ev.preventDefault();current.angle+=Math.sign(ev.deltaY)*.12;},{passive:false});
  window.addEventListener('keydown',ev=>{if(!current||turn!=='player')return;if(ev.key==='ArrowLeft'||ev.key==='a')current.angle-=.1;if(ev.key==='ArrowRight'||ev.key==='d')current.angle+=.1;if(ev.key===' '||ev.key==='Enter'){ev.preventDefault();placeCurrent();}if(ev.key==='Tab'){ev.preventDefault();cycleHook();}});

  function rotate(dir){if(current&&turn==='player'&&state==='playing'){current.angle+=dir*.14;tone(280+dir*35,.025,'sine',.015);}}
  function cycleHook(){if(!current||turn!=='player'||state!=='playing')return;const anchors=availableAnchors();if(!anchors.length)return;selectedAnchor=(selectedAnchor+1)%anchors.length;updateHUD();showBanner('HOOK '+(selectedAnchor+1)+' SELECTED');tone(510,.035,'triangle',.02);}
  function bindHold(el,dir){el.addEventListener('pointerdown',ev=>{ev.preventDefault();rotate(dir);rotateHold=setInterval(()=>rotate(dir),80);});['pointerup','pointercancel','pointerleave'].forEach(e=>el.addEventListener(e,()=>{clearInterval(rotateHold);rotateHold=0;}));}
  bindHold($('#rotateLeft'),-1);bindHold($('#rotateRight'),1);$('#hookButton').addEventListener('click',cycleHook);$('#dropButton').addEventListener('click',placeCurrent);

  function loop(now){if(!ui.game.classList.contains('active')){loopRunning=false;return;}const dt=Math.min(32,now-(lastTime||now));lastTime=now;if(state==='ai')updateAI(now);updatePhysics(dt,now);calculateStress();updateStability();draw(now);requestAnimationFrame(loop);}
  function updateStability(){const safe=Math.max(0,1-stress);ui.fill.style.width=(safe*100)+'%';ui.stability.textContent=stress<.38?'CALM':stress<.72?'WAVERING':'CRITICAL';ui.stability.style.color=stress<.38?'#65f4d3':stress<.72?'#ffc65b':'#ff685b';}
  function showBanner(text){ui.banner.textContent=text;ui.banner.classList.add('show');clearTimeout(bannerTimer);bannerTimer=setTimeout(()=>ui.banner.classList.remove('show'),1500);}
  function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
  function lerp(a,b,t){return a+(b-a)*t}

  function initAudio(){if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();}
  function tone(freq,duration,type='sine',volume=.03){if(!soundOn)return;initAudio();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}

  $('#duelButton').addEventListener('click',()=>startGame('duel'));$('#endlessButton').addEventListener('click',()=>startGame('endless'));
  document.querySelectorAll('[data-difficulty]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-difficulty]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');difficulty=b.dataset.difficulty;tone(420,.04,'triangle',.02);}));
  $('#homeButton').addEventListener('click',()=>{state='menu';ui.game.classList.remove('active');ui.title.classList.add('active');ui.modal.classList.remove('open');});
  $('#soundButton').addEventListener('click',e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?'♪':'×';if(soundOn)tone(520,.06,'sine',.03);});
  $('#againButton').addEventListener('click',()=>startGame(mode));$('#menuButton').addEventListener('click',()=>{ui.modal.classList.remove('open');ui.game.classList.remove('active');ui.title.classList.add('active');state='menu';});
  window.addEventListener('resize',resize);resize();
})();
