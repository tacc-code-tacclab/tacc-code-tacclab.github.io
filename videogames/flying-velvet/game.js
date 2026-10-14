(()=>{
  'use strict';
  const $=id=>document.getElementById(id),canvas=$('stage'),ctx=canvas.getContext('2d',{alpha:false}),game=new FlyingVelvet.Game(),audio=FlyingVelvetAudio.create();
  let size={w:innerWidth,h:innerHeight},running=false,paused=true,last=0,accumulator=0,flash=0,flashColor='#fff',cheer=0,tiltEnabled=false,tiltReady=false,rawTilt=0,tiltZero=0,keyLeft=false,keyRight=false,touchLeft=false,touchRight=false,actTimer=0;
  try{game.best=Number(localStorage.getItem('flying-velvet-best'))||0;audio.on=localStorage.getItem('flying-velvet-sound')!=='off';}catch{}
  const panel=(id,on)=>$(id).classList.toggle('open',on);
  function resize(){size=FlyingVelvetDraw.setup(canvas,ctx);}
  function orientationValue(e){
    const angle=screen.orientation?.angle??window.orientation??0;
    if(Math.abs(angle)===90)return (Number(e.beta)||0)*(angle===90?1:-1);
    return Number(e.gamma)||0;
  }
  function onOrientation(e){rawTilt=orientationValue(e);if(!tiltReady){tiltZero=rawTilt;tiltReady=true;}}
  function calibrate(){tiltZero=rawTilt;tiltReady=true;$('calibrate').classList.add('active');setTimeout(()=>$('calibrate').classList.remove('active'),350);audio.fx('tilt');}
  async function enableTilt(){
    try{
      if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
        if(await DeviceOrientationEvent.requestPermission()!=='granted')throw Error('denied');
      }
      if(typeof DeviceOrientationEvent==='undefined')throw Error('unavailable');
      tiltReady=false;addEventListener('deviceorientation',onOrientation,{passive:true});tiltEnabled=true;audio.fx('tilt');return true;
    }catch{$('hint').textContent='MOTION UNAVAILABLE — USE ↶ / ↷ OR A / D';return false;}
  }
  async function fullscreen(){
    try{if(!document.fullscreenElement){const fn=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;if(fn)await fn.call(document.documentElement);try{await screen.orientation?.lock?.('landscape');}catch{}}}catch{}resize();
  }
  async function begin(withTilt){
    audio.enable();if(withTilt)await enableTilt();await fullscreen();panel('intro',false);panel('result',false);panel('pause-panel',false);document.body.classList.remove('paused');$('act-card').classList.remove('show');game.reset();running=true;paused=false;last=0;accumulator=0;flash=cheer=actTimer=0;updateHud();$('hint').textContent=tiltEnabled?'TILT TO SPIN — TAP RELEASE AT THE FORWARD SWING':'A / D OR ↶ / ↷ TO SPIN — SPACE TO RELEASE';
  }
  function pause(on=true){if(!running||game.state==='over')return;paused=on;document.body.classList.toggle('paused',on);panel('pause-panel',on);if(on)audio.stop();else{audio.enable();last=0;}}
  function control(){const buttons=(keyRight||touchRight?1:0)-(keyLeft||touchLeft?1:0),sensor=tiltEnabled?FlyingVelvet.clamp((rawTilt-tiltZero)/24,-1,1):0,value=buttons||sensor;game.setInput(value);$('tilt-dot').style.left=(50+value*45)+'%';}
  function release(){if(!running||paused||game.state==='over')return;audio.enable();game.release();}
  function updateHud(){
    $('act').textContent=game.act;$('flights').textContent=game.catches;$('score').textContent=game.score.toLocaleString('en-US');$('progress').style.width=(game.progress*10)+'%';
  }
  function processEvents(){for(const event of game.drainEvents()){
    if(event.type==='release'){audio.fx('release');$('hint').textContent='REACH!  TILT TO LINE UP THE HANDS';}
    else if(event.type==='catch'){audio.fx(event.newAct?'act':'catch',event.style/60);flash=event.newAct?.34:.14;cheer=1;flashColor=event.newAct?'#18efff':'#ffe85b';$('hint').textContent=event.style>125?'PERFECT CATCH!':event.style>65?'CAUGHT! KEEP FLYING':'CLOSE ONE!';if(event.newAct){$('act-card').querySelector('span').textContent=event.act+1;$('act-card').classList.add('show');actTimer=1.8;}updateHud();}
    else if(event.type==='fail'){audio.fx('fail');running=false;try{localStorage.setItem('flying-velvet-best',String(game.best));}catch{}setTimeout(showResult,700);}
  }}
  function showResult(){const cause=game.reason==='tigers'?'You missed the rope and joined the tiger act.':'The next trapeze escaped your reach.';$('result-copy').innerHTML=cause+'<br><strong>'+game.catches+' flights · '+game.score.toLocaleString('en-US')+' points</strong><br>Best run: '+game.best+' flights.';panel('result',true);}
  function frame(t){
    requestAnimationFrame(frame);const elapsed=last?Math.min(.1,(t-last)/1000):0;last=t;if(!paused&&running){control();accumulator=Math.min(.15,accumulator+elapsed);while(accumulator>=1/120){game.update(1/120);accumulator-=1/120;}processEvents();audio.tick(game.act-1);}flash=Math.max(0,flash-elapsed*1.8);cheer=Math.max(0,cheer-elapsed*1.4);if(actTimer>0){actTimer-=elapsed;if(actTimer<=0)$('act-card').classList.remove('show');}FlyingVelvetDraw.render(ctx,size.w,size.h,game,{flash,flashColor,cheer});
  }
  function bindHold(id,side){const el=$(id),set=v=>{if(side<0)touchLeft=v;else touchRight=v;};el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture?.(e.pointerId);set(true);});for(const n of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(n,()=>set(false));}
  bindHold('left',-1);bindHold('right',1);$('release').addEventListener('pointerdown',e=>{e.preventDefault();release();});
  addEventListener('keydown',e=>{if(['a','d','ArrowLeft','ArrowRight',' ','Enter','p'].includes(e.key)){e.preventDefault();}if(e.key==='a'||e.key==='ArrowLeft')keyLeft=true;if(e.key==='d'||e.key==='ArrowRight')keyRight=true;if((e.key===' '||e.key==='Enter')&&!e.repeat)release();if(e.key.toLowerCase()==='p'&&!e.repeat)pause(!paused);});
  addEventListener('keyup',e=>{if(e.key==='a'||e.key==='ArrowLeft')keyLeft=false;if(e.key==='d'||e.key==='ArrowRight')keyRight=false;});
  $('play').onclick=()=>begin(true);$('fallback').onclick=()=>begin(false);$('again').onclick=()=>begin(tiltEnabled);$('restart').onclick=()=>begin(tiltEnabled);$('resume').onclick=()=>pause(false);$('pause').onclick=()=>pause(true);$('calibrate').onclick=calibrate;$('screen').onclick=fullscreen;
  $('sound').onclick=()=>{audio.on=!audio.on;audio.stop();if(audio.on&&!paused)audio.enable();$('sound').setAttribute('aria-pressed',String(!audio.on));$('sound').textContent=audio.on?'♪':'×';try{localStorage.setItem('flying-velvet-sound',audio.on?'on':'off');}catch{}};
  addEventListener('resize',resize);addEventListener('orientationchange',()=>{tiltReady=false;setTimeout(resize,180);});document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)pause(true);});for(const e of ['selectstart','contextmenu','dragstart'])$('game').addEventListener(e,x=>x.preventDefault());
  resize();updateHud();requestAnimationFrame(frame);
})();
