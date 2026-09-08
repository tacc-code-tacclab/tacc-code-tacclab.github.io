/* Rendering, input and local challenge sharing. No server, tracking or dependencies. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id),canvas=$('arena'),ctx=canvas.getContext('2d'),R=window.ZeroRiot;
  const C={cyan:'#5ff5e7',pink:'#ff73c8',yellow:'#e3ff75',red:'#ff7972',white:'#f4f5ff',muted:'#a5afcc'};
  const daily=new Date().toISOString().slice(0,10),urlSeed=new URLSearchParams(location.search).get('seed'),seed=urlSeed&&/^[a-zA-Z0-9-]{1,40}$/.test(urlSeed)?urlSeed:daily;
  let g=R.create(seed),mode='menu',last=0,accumulator=0,ambient=0,particles=[],rings=[],floats=[],shake=0,flipTint=0,stick={x:0,y:0,id:null},drag=null,sound=false,audioCtx=null;
  let best=0;try{best=Number(localStorage.getItem('zero-riot-best-v2'))||0;}catch(_){}
  const keys=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('best').textContent=best.toLocaleString();$('seed-label').textContent=(urlSeed?'SHARED ARENA':'TODAY’S ARENA')+' / '+seed;$('footer-seed').textContent=seed;
  if(urlSeed)$('start').innerHTML='PLAY SHARED LEVELS <span>→</span>';
  function audio(){if(!audioCtx){const A=window.AudioContext||window.webkitAudioContext;if(A)audioCtx=new A();}if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});}
  function tone(freq,duration=.1,type='sine',volume=.07,slide=1){if(!sound||!audioCtx)return;const o=audioCtx.createOscillator(),a=audioCtx.createGain(),t=audioCtx.currentTime;o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*slide),t+duration);a.gain.setValueAtTime(volume,t);a.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(a);a.connect(audioCtx.destination);o.start(t);o.stop(t+duration);}
  function clearInput(){R.cancelTarget(g);keys.clear();stick.x=0;stick.y=0;stick.id=null;drag=null;$('knob').style.transform='translate(0,0)';}
  function show(id,visible){$(id).classList.toggle('hidden',!visible);}
  function start(seedValue){playGame(R.create(seedValue));}
  function playGame(state){g=state;mode='play';accumulator=0;particles=[];rings=[];floats=[];shake=0;clearInput();show('menu',false);show('paused',false);show('results',false);$('pause').disabled=false;$('flip').disabled=false;$('footer-seed').textContent=g.seed;$('share-note').textContent='';show('share-fallback',false);audio();canvas.focus({preventScroll:true});updateHUD();}
  function pause(){if(mode==='play'){mode='paused';clearInput();show('paused',true);$('resume').focus({preventScroll:true});$('flip').disabled=true;}else if(mode==='paused'){mode='play';show('paused',false);accumulator=0;$('flip').disabled=false;canvas.focus({preventScroll:true});}}
  function doFlip(){if(mode==='play'&&R.flip(g)){audio();events();}}
  $('start').addEventListener('click',()=>start(seed));$('random').addEventListener('click',()=>{const x=new Uint32Array(1);crypto.getRandomValues(x);start('R'+x[0].toString(36));});
  $('flip').addEventListener('click',doFlip);$('pause').addEventListener('click',pause);$('resume').addEventListener('click',pause);$('restart').addEventListener('click',()=>playGame(R.retryLevel(g)));$('replay').addEventListener('click',()=>playGame(g.won?(g.campaignComplete?R.create(g.seed):R.nextLevel(g)):R.retryLevel(g)));
  $('home').addEventListener('click',()=>{mode='menu';g=R.create(seed);clearInput();show('results',false);show('menu',true);$('pause').disabled=true;$('flip').disabled=true;$('start').focus({preventScroll:true});updateHUD();});
  $('sound').addEventListener('click',()=>{sound=!sound;audio();$('sound').textContent=sound?'SOUND ON':'SOUND OFF';$('sound').setAttribute('aria-pressed',String(sound));$('sound').setAttribute('aria-label',sound?'Disable sound':'Enable sound');tone(440);});
  $('share').addEventListener('click',async()=>{const link=new URL(location.href);link.search='';link.hash='';link.searchParams.set('seed',g.seed);const text=`ZERO RIOT: ${g.score.toLocaleString()} points, ${g.novas} zero bonuses, ${g.won?g.level:g.level-1}/5 levels cleared. Same level layouts. Can you beat me? ${link.href}`;try{if(!navigator.clipboard)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);$('share-note').textContent='COPIED. Send it to a friend.';}catch(_){$('share-fallback').value=text;show('share-fallback',true);$('share-fallback').focus();$('share-fallback').select();$('share-note').textContent='Select and copy your challenge below.';}});
  const moveKeys=['arrowleft','arrowright','arrowup','arrowdown','w','a','s','d'];
  window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(e.target.tagName==='TEXTAREA')return;if(moveKeys.includes(k)&&mode==='play'){keys.add(k);drag=null;e.preventDefault();}if((k==='p'||k==='escape')&&!e.repeat){pause();e.preventDefault();}if(e.code==='Space'&&mode==='play'){e.preventDefault();if(!e.repeat)doFlip();}});
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{clearInput();if(mode==='play')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')pause();});
  function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*720/r.width,y:(e.clientY-r.top)*720/r.height};}
  canvas.addEventListener('pointerdown',e=>{if(mode!=='play')return;drag={...point(e),id:e.pointerId};R.setTarget(g,drag.x,drag.y);canvas.setPointerCapture(e.pointerId);e.preventDefault();});canvas.addEventListener('pointermove',e=>{if(drag&&drag.id===e.pointerId){drag={...point(e),id:e.pointerId};R.setTarget(g,drag.x,drag.y);}});for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,e=>{if(drag&&drag.id===e.pointerId){if(name!=='pointerup')R.cancelTarget(g);drag=null;}});
  const joystick=$('joystick');function stickMove(e){const r=joystick.getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/(r.width*.32),y=(e.clientY-r.top-r.height/2)/(r.height*.32),len=Math.hypot(x,y);if(len>1){x/=len;y/=len;}const precise=R.stickVector(x,y);stick.x=precise.x;stick.y=precise.y;$('knob').style.transform=`translate(${x*30}px,${y*30}px)`;}
  joystick.addEventListener('pointerdown',e=>{if(mode!=='play')return;R.cancelTarget(g);stick.id=e.pointerId;joystick.setPointerCapture(e.pointerId);stickMove(e);e.preventDefault();});joystick.addEventListener('pointermove',e=>{if(stick.id===e.pointerId)stickMove(e);});for(const name of ['pointerup','pointercancel','lostpointercapture'])joystick.addEventListener(name,e=>{if(stick.id===e.pointerId){stick.x=0;stick.y=0;stick.id=null;$('knob').style.transform='translate(0,0)';}});
  function input(){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);if(stick.id!==null){x=stick.x;y=stick.y;}return{x,y};}
  function signed(n){return n>0?'+'+n:n<0?'−'+Math.abs(n):'0';}
  function burst(x,y,color,n=20){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=30+Math.random()*220;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.3+Math.random()*.6,max:.9,color,size:2+Math.random()*3});}if(particles.length>300)particles.splice(0,particles.length-300);}
  function events(){for(const e of g.events){
    if(e.type==='collect'){burst(e.x,e.y,e.value>0?C.cyan:C.pink,8);tone(280+Math.abs(e.value)*45,.075,'sine',.035);}
    if(e.type==='nova'){rings.push({...e,life:.6,max:.6,color:C.yellow});burst(e.x,e.y,C.yellow,48);floats.push({x:e.x,y:e.y-52,text:'ZERO! +'+e.points,color:C.yellow,life:1.25});shake=0;tone(110,.38,'triangle',.13,5);}
    if(e.type==='flip'){rings.push({x:360,y:360,radius:540,life:.55,max:.55,color:C.cyan});flipTint=.3;tone(720,.2,'sine',.05,.35);}
    if(e.type==='destroy')burst(e.x,e.y,C.red,15);
    if(e.type==='hurt'){floats.push({x:e.x,y:e.y-50,text:e.reason,color:C.red,life:1.2});burst(e.x,e.y,C.red,25);shake=0;tone(130,.25,'sawtooth',.06,.3);}
    if(e.type==='blocked')floats.push({x:e.x,y:e.y-50,text:'SHIELDED',color:C.cyan,life:.8});
    if(e.type==='end')finish();
  }g.events.length=0;}
  function finish(){mode='end';clearInput();$('pause').disabled=true;$('flip').disabled=true;if(g.score>best){best=g.score;try{localStorage.setItem('zero-riot-best-v2',String(best));}catch(_){}$('best').textContent=best.toLocaleString();}
    $('result-status').textContent=g.won?(g.campaignComplete?'ALL 5 LEVELS CLEARED · YOU WIN!':'LEVEL '+g.level+' CLEARED!'):'TRY THIS LEVEL AGAIN';$('result-score').textContent=g.score.toLocaleString();$('result-rank').textContent=g.won?'Every number collected. Well done!':'Your completed levels are safe.';
    $('result-stats').innerHTML=`<span><b>${g.collected}/${g.total}</b>NUMBERS COLLECTED</span><span><b>${g.won?g.level:g.level-1}/5</b>LEVELS CLEARED</span><span><b>${g.novas}</b>ZERO BONUSES</span><span><b>${Math.floor(g.totalTime)}s</b>TIME PLAYED · NO LIMIT</span>`;
    $('replay').textContent=g.won?(g.campaignComplete?'PLAY AGAIN FROM LEVEL 1 →':'NEXT LEVEL →'):'RETRY THIS LEVEL →';show('results',true);$('replay').focus({preventScroll:true});tone(g.won?660:150,.4,'triangle',.07,g.won?1.5:.5);
  }
  function updateHUD(){
    $('score').textContent=g.score.toLocaleString();$('charge').textContent=signed(g.charge);$('charge').style.color=g.charge===0?C.yellow:g.charge>0?C.cyan:C.pink;$('time').textContent=String(g.pickups.length);$('lives').textContent='●'.repeat(g.lives)+'○'.repeat(3-g.lives);$('lives').setAttribute('aria-label',g.lives+' shields');
    $('phase').textContent='LEVEL '+g.level+' / 5 · '+(g.level<=2?'NO ENEMIES':'SLOW HUNTERS');$('chain').textContent=g.collected+' / '+g.total+' COLLECTED';$('danger').classList.remove('warn');$('danger').textContent='NO TIME LIMIT';
    $('progress-fill').style.width=(g.collected/g.total*100)+'%';$('progress-label').textContent='Collect all '+g.total+' numbers to finish level '+g.level+'.';
    let hint='Tap any number to collect it.';if(g.charge!==0){if(g.pickups.some(p=>p.v===-g.charge))hint='Bonus: collect '+signed(-g.charge)+' to make zero.';else if(g.pickups.some(p=>p.v===g.charge))hint='Optional bonus: FLIP, then collect '+signed(-g.charge)+'.';else hint='Keep collecting — any number is safe.';}
    $('hint').textContent=hint;$('flip-label').textContent=g.flipCooldown>0?'RECHARGING '+g.flipCooldown.toFixed(1)+'s':'FLIP SIGNS · OPTIONAL';$('recharge').style.transform=`scaleX(${1-g.flipCooldown})`;$('flip').disabled=mode!=='play'||g.flipCooldown>0;
  }
  function polygon(x,y,r,n,rotation){ctx.beginPath();for(let i=0;i<n;i++){const a=rotation+i*Math.PI*2/n;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
  function circle(x,y,r){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);}
  function draw(){
    ctx.setTransform(canvas.width/720,0,0,canvas.height/720,0,0);ctx.clearRect(0,0,720,720);ctx.fillStyle='#0c132e';ctx.fillRect(0,0,720,720);
    const bg=ctx.createRadialGradient(360,330,30,360,360,470);bg.addColorStop(0,'#182548');bg.addColorStop(1,'#0a1028');ctx.fillStyle=bg;ctx.fillRect(0,0,720,720);
    ctx.strokeStyle='#34466b';ctx.lineWidth=.6;ctx.globalAlpha=.4;for(let i=0;i<=720;i+=40){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,720);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(720,i);ctx.stroke();}ctx.globalAlpha=1;
    ctx.strokeStyle='#506187';ctx.lineWidth=1;ctx.setLineDash([3,12]);circle(360,360,280);ctx.stroke();circle(360,360,170);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#3d507a';for(const [x,y] of [[30,30],[690,30],[30,690],[690,690]]){ctx.fillRect(x-7,y,14,1);ctx.fillRect(x,y-7,1,14);}
    ctx.save();if(shake&&!reduced)ctx.translate(Math.sin(ambient*82)*shake,Math.cos(ambient*71)*shake);
    if(g.target&&mode==='play'){ctx.strokeStyle='#e3ff7580';ctx.lineWidth=2;circle(g.target.x,g.target.y,35);ctx.stroke();ctx.setLineDash([4,8]);ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(g.target.x,g.target.y);ctx.stroke();ctx.setLineDash([]);}
    for(const p of g.pickups){if(p.wait>.3)continue;ctx.save();ctx.globalAlpha=p.wait>0?.45:1;const useful=g.charge!==0&&p.v===-g.charge,danger=false,color=p.v>0?C.cyan:C.pink;
      ctx.shadowBlur=reduced?0:useful?22:8;ctx.shadowColor=useful?C.yellow:color;ctx.fillStyle=p.v>0?'#133a44':'#392445';ctx.strokeStyle=useful?C.yellow:color;ctx.lineWidth=useful?3:1.5;p.v>0?circle(p.x,p.y,23):polygon(p.x,p.y,26,6,Math.PI/6);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
      if(useful){ctx.strokeStyle='#e3ff7555';ctx.lineWidth=1;circle(p.x,p.y,31+Math.sin(ambient*5)*2);ctx.stroke();}
      ctx.font='bold 26px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(signed(p.v),p.x,p.y+1);
      if(danger){ctx.fillStyle=C.red;ctx.font='bold 15px Arial';ctx.fillText('!',p.x+24,p.y-23);}ctx.restore();
    }
    for(const e of g.enemies){ctx.save();const dart=e.type==='dart',warn=e.warning>0;ctx.translate(e.x,e.y);ctx.rotate(dart?Math.atan2(e.dy,e.dx):ambient*.9);ctx.strokeStyle=C.red;ctx.lineWidth=2;ctx.globalAlpha=warn?.4+.4*Math.sin(ambient*14):1;
      if(warn){ctx.setLineDash([4,5]);circle(0,0,29);ctx.stroke();ctx.setLineDash([]);}else{ctx.shadowBlur=10;ctx.shadowColor=C.red;}
      polygon(0,0,dart?21:20,dart?3:4,dart?0:Math.PI/4);ctx.fillStyle='#772e48';ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.beginPath();ctx.moveTo(-6,-6);ctx.lineTo(6,6);ctx.moveTo(6,-6);ctx.lineTo(-6,6);ctx.stroke();ctx.restore();
    }
    for(const r of rings){const progress=1-r.life/r.max;ctx.globalAlpha=r.life/r.max;ctx.strokeStyle=r.color;ctx.lineWidth=3+5*(1-progress);circle(r.x,r.y,r.radius*(1-Math.pow(1-progress,3)));ctx.stroke();ctx.globalAlpha=1;}
    ctx.save();const pc=g.charge===0?C.yellow:g.charge>0?C.cyan:C.pink;ctx.globalAlpha=g.invulnerable>0&&mode==='play'?.8:1;ctx.shadowBlur=reduced?0:24;ctx.shadowColor=pc;ctx.fillStyle='#131e36';ctx.strokeStyle=pc;ctx.lineWidth=4;circle(g.x,g.y,25);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    ctx.strokeStyle=pc;ctx.lineWidth=2;ctx.setLineDash([14,11]);circle(g.x,g.y,34);ctx.lineDashOffset=ambient*-24;ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=C.white;ctx.font=Math.abs(g.charge)>=10?'900 23px Arial':'900 29px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(signed(g.charge),g.x,g.y+1);ctx.restore();
    for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);}ctx.globalAlpha=1;
    for(const f of floats){ctx.globalAlpha=Math.min(1,f.life*2);ctx.fillStyle=f.color;ctx.font='bold 21px Arial';ctx.textAlign='center';ctx.fillText(f.text,f.x,f.y);}ctx.globalAlpha=1;ctx.restore();
    if(flipTint>0){ctx.strokeStyle=C.cyan;ctx.lineWidth=8;ctx.globalAlpha=flipTint;ctx.strokeRect(4,4,712,712);ctx.globalAlpha=1;}
  }
  function size(){const dpr=Math.min(2,window.devicePixelRatio||1),r=canvas.getBoundingClientRect();canvas.width=Math.max(360,Math.round(r.width*dpr));canvas.height=canvas.width;}
  window.addEventListener('resize',size);size();updateHUD();
  function frame(now){const dt=Math.min(.1,last?(now-last)/1000:0);last=now;ambient+=dt;
    if(mode==='play'){accumulator+=dt;while(accumulator>=1/60&&mode==='play'){R.step(g,1/60,input());events();accumulator-=1/60;}updateHUD();}
    if(mode!=='paused'){for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-3*dt);p.vy*=Math.exp(-3*dt);}particles=particles.filter(p=>p.life>0);for(const r of rings)r.life-=dt;rings=rings.filter(r=>r.life>0);for(const f of floats){f.life-=dt;f.y-=dt*22;}floats=floats.filter(f=>f.life>0);shake=Math.max(0,shake-dt*24);flipTint=Math.max(0,flipTint-dt);}
    draw();requestAnimationFrame(frame);
  }requestAnimationFrame(frame);
})();
