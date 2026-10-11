(() => {
  'use strict';
  const $=id=>document.getElementById(id), canvas=$('board'), ctx=canvas.getContext('2d'), next=$('next'), nc=next.getContext('2d');
  const game=new Micio.Game(), dialog=$('dialog'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused=true, needsDraw=true, last=0, fall=0, particles=[], toastUntil=0, repeatDelay=0, repeatTimer=0, modalAction=null, modalSecondary=null, width=0,height=0,clockValue='',screenBusy=false,palette='pastel',sceneIndex=-1;
  const worlds=[
    {name:'Giardino delle lanterne',asset:'lanterne',symbol:'✿'},
    {name:'Baia luminosa',asset:'baia',symbol:'≈'},
    {name:'Città delle nuvole',asset:'nuvole',symbol:'☁'},
    {name:'Osservatorio stellare',asset:'stelle',symbol:'✦'}
  ];
  // Four-world scores have their own records; earlier score keys stay intact.
  let bests={chill:0,flow:0};
  try{const data=JSON.parse(localStorage.getItem('micio-records-v4')||'{}');for(const m of ['chill','flow'])if(Number.isFinite(data[m])&&data[m]>=0)bests[m]=data[m];}catch{}

  const sound=MicioAudio.create();
  try{sound.on=localStorage.getItem('micio-music')!=='off';}catch{}
  function soundLabel(){$('sound').setAttribute('aria-pressed',String(sound.on));$('sound').setAttribute('aria-label',sound.on?'Disattiva musica e suoni':'Attiva musica e suoni');$('sound').querySelector('span').textContent=sound.on?'Musica on':'Musica off';}
  function resumeSound(){if(sound.on&&!game.over)sound.enable();}
  function stopRepeat(){clearTimeout(repeatDelay);clearInterval(repeatTimer);repeatDelay=repeatTimer=0;}
  function toast(text){$('toast').textContent=text;$('toast').classList.add('show');toastUntil=performance.now()+2400;}
  function refreshScene(){
    if(sceneIndex===game.stage)return;sceneIndex=game.stage;const world=worlds[sceneIndex];
    document.body.dataset.scene=world.asset;
    $('scene-mobile').srcset='backgrounds/'+world.asset+'-small.webp';$('scene').src='backgrounds/'+world.asset+'.webp';
    $('world-name').textContent=world.name;$('world-number').textContent=world.symbol+' SCHEMA '+(sceneIndex+1)+' / '+Micio.STAGES;
    document.querySelectorAll('[data-world]').forEach((el,i)=>{el.classList.toggle('current',i===sceneIndex);el.classList.toggle('complete',i<sceneIndex);el.setAttribute('aria-current',i===sceneIndex?'step':'false');});
    sound.setStage(sceneIndex);
  }
  function refreshTime(){
    const seconds=Math.ceil(game.remaining/1000),value=game.mode==='chill'?'∞':Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
    if(value!==clockValue){clockValue=value;$('timer').textContent=value;$('timer').classList.toggle('urgent',game.mode==='flow'&&seconds<=30&&!game.over);}
    const label='RITMO '+String(game.level).padStart(2,'0');if($('level').textContent!==label)$('level').textContent=label;
  }
  function refresh(){
    refreshScene();
    $('score').textContent=game.score.toLocaleString('it-IT');$('saved').textContent=Math.min(game.saved,game.goal)+' / '+game.goal;
    const progress=$('goal-progress'),rescued=Math.min(game.saved,game.goal);
    progress.setAttribute('aria-valuemax',String(game.goal));progress.setAttribute('aria-valuenow',String(rescued));progress.setAttribute('aria-valuetext',rescued+' su '+game.goal+' gattini salvati');$('goal-fill').style.width=(rescued/game.goal*100)+'%';
    if(game.score>bests[game.mode]){bests[game.mode]=game.score;try{localStorage.setItem('micio-records-v4',JSON.stringify(bests));}catch{}}
    $('best').textContent=bests[game.mode].toLocaleString('it-IT');refreshTime();
    $('mode-label').textContent=(game.stage+1)+' / '+Micio.STAGES+' · '+worlds[game.stage].name.toUpperCase();
    $('charge-text').textContent=game.charge+' / 4';$('charge').setAttribute('aria-label','Fusa: '+game.charge+' su quattro');
    [...$('charge').children].forEach((el,i)=>el.classList.toggle('on',i<game.charge));$('purr').disabled=game.charge<4||game.over;
    $('swap').disabled=game.swapped||game.over;
    $('hint').textContent=game.won?'Schema completato!':(game.goal-rescued)+' gattini al '+(game.stage===Micio.STAGES-1?'traguardo':'prossimo mondo')+' · '+(game.mode==='chill'?'Senza fretta':'Unisci 6 uguali');
    document.querySelectorAll('[data-mode]').forEach(b=>{const yes=b.dataset.mode===game.mode;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes));});
    const r=next.getBoundingClientRect();MicioDraw.preview(nc,r.width,r.height,game.queue);needsDraw=true;
  }
  function finish(){
    const won=game.won,final=game.campaignWon,timed=game.endReason==='time',missing=Math.max(0,game.goal-game.saved);
    refresh();
    const message=final?'Hai attraversato <strong>tutti e quattro i mondi</strong> e salvato <strong>'+game.totalSaved+' gattini</strong>. Il viaggio è completo!':won?'I gattini di <strong>'+worlds[game.stage].name+'</strong> sono al sicuro. Prossima fermata: <strong>'+worlds[game.stage+1].name+'</strong>! Nuovo nido, '+(game.mode==='flow'?'3 minuti e un ritmo più veloce.':'altri 60 gattini da salvare.'):timed?'Il tempo è finito prima dell’obiettivo. Ti mancavano <strong>'+missing+' gattini</strong>. Riprova questo schema: anche le Fusa contano!':'Non c’è più spazio per il prossimo gruppo. Ti mancavano <strong>'+missing+' gattini</strong>. Riprova questo schema e riunisci sei vicini uguali.';
    show(final?'Hai vinto!':won?'Schema completato!':timed?'Tempo scaduto!':'Il nido è pieno.',
      (won?'<div class="victory-mark" aria-hidden="true">'+worlds[game.stage].symbol+'</div>':'')+'<p><strong>'+game.score.toLocaleString('it-IT')+' punti</strong> · <strong>'+game.totalSaved+' gatti felici</strong></p><p>'+message+'</p>',
      final?'Gioca ancora →':won?'Prossimo mondo →':'Riprova lo schema →',()=>{if(final)start(game.mode);else if(won){if(game.nextStage())beginStage();}else if(game.retryStage())beginStage();},null,final?'VITTORIA · 4 MONDI SU 4':won?'SCHEMA '+(game.stage+1)+' / 4 COMPLETATO':timed?'OBIETTIVO MANCATO':'FINE PARTITA');
    dialog.dataset.result=won?'win':'';
    sound.fx(final?'final':won?'win':'lose');
  }
  function burst(result){
    if(!result)return;const g=MicioDraw.geometry(width,height);
    for(const clear of result.clears||[]){if(!reduced)for(const c of clear.cells){const p=MicioDraw.point(g,c.x,c.y);for(let n=0;n<2&&particles.length<100;n++)particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*75,vy:-25-Math.random()*55,size:2+Math.random()*3,color:c.color,life:1});}}
    if(result.clears?.length){toast(result.purr?'Frrrr… spazio per nuovi amici.':result.chain>1?'CATENA ×'+result.chain+' · Che bel gioco di squadra!':'Una famiglia felice! +'+result.clears.reduce((s,c)=>s+c.cells.length,0)+' gatti');sound.fx(result.purr?'purr':'clear',Math.max(1,result.chain));}else sound.fx(result.moved?'fall':'lock');
    if(game.over)finish();else refresh();
  }
  function act(action){
    if(paused||game.over||dialog.open)return;let changed=false;
    if(action==='left')changed=game.move(-1);else if(action==='right')changed=game.move(1);else if(action==='rotate')changed=game.turn();else if(action==='swap')changed=game.swap();
    else if(action==='drop'){sound.fx('drop');burst(game.drop());fall=0;}else if(action==='down'){burst(game.step());fall=0;}else if(action==='purr'){burst(game.purr());fall=0;}
    if(changed){sound.fx(action==='rotate'?'rotate':action==='swap'?'swap':'move');refresh();}needsDraw=true;
  }
  function beginStage(){fall=0;last=0;particles=[];paused=false;needsDraw=true;refresh();sound.setStage(game.stage);resumeSound();toast(worlds[game.stage].symbol+' '+worlds[game.stage].name+' · Salva 60 gattini');}
  function start(mode){game.reset(mode);beginStage();enterFullscreen(false);}
  function show(title,copy,button,action,secondary=null,kicker='UN PICCOLO RESPIRO',secondaryLabel='Annulla'){
    paused=true;last=0;stopRepeat();sound.stop();dialog.dataset.result='';$('dialog-title').textContent=title;$('dialog-copy').innerHTML=copy;$('dialog-kicker').textContent=kicker;
    $('dialog-main').textContent=button;modalAction=action;modalSecondary=secondary;$('dialog-secondary').hidden=!secondary;$('dialog-secondary').textContent=secondaryLabel;
    if(!dialog.open)dialog.showModal();
  }
  const instructions='<ol><li><strong>Sposta e ruota</strong> i gattini. Unisci <strong>6 vicini della stessa famiglia</strong> per salvarli.</li><li>Salva <strong>60 gattini per schema</strong>: giardino, baia, nuvole e stelle. Completa i quattro mondi per vincere!</li><li>Nella Sfida hai <strong>3 minuti per schema</strong>, con caduta sempre più veloce. Se il nido si riempie o il tempo finisce, riprovi lo schema.</li></ol>';
  function welcome(){show('Quattro mondi. Un viaggio felice.',instructions+'<p>Trascina o usa ← →. Tocca o premi ↑ per ruotare; POSA o spazio per far scendere subito.</p>','Parti · Sfida →',()=>start('flow'),()=>start('chill'),'MICIO INCASTRO','Senza fretta');}
  function help(){show('Ogni gatto al suo posto.',instructions+'<p>Quattro famiglie caricano le <strong>Fusa</strong>: liberano le due file più basse e i gattini salvati contano per la vittoria. C cambia gruppo, F fa le fusa, P mette in pausa.</p><p>☾ <strong>Senza fretta</strong>: stesso obiettivo di '+game.goal+' gattini, senza timer. Scegli tu quando posare.</p>','Riprendi →',()=>{paused=game.over;},null,'COME SI GIOCA');}
  $('dialog-main').onclick=()=>{const fn=modalAction;dialog.close();if(fn)fn();if(!paused)resumeSound();refresh();};
  $('dialog-secondary').onclick=()=>{const fn=modalSecondary;dialog.close();if(fn)fn();if(!paused)resumeSound();};
  dialog.addEventListener('close',()=>{paused=game.over;last=0;fall=0;stopRepeat();if(!paused)resumeSound();else requestAnimationFrame(()=>{if(game.over&&!dialog.open)finish();});needsDraw=true;});
  $('pause').onclick=()=>{if(!dialog.open&&!game.over)show('Il nido può aspettare.','<p>Timer, gattini e musica sono in pausa. Riprendi quando vuoi.</p>','Riprendi →',()=>{paused=false;});};
  $('help').onclick=help;
  function requestStart(mode){if(game.moves===0&&game.elapsed<1000){start(mode);return;}show('Prepariamo un nuovo nido?','<p>La partita attuale termina. Il tuo record rimane salvato su questo dispositivo.</p>','Sì, ricomincia',()=>start(mode),()=>{paused=game.over;});}
  $('restart').onclick=()=>requestStart(game.mode);
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{if(b.dataset.mode!==game.mode)requestStart(b.dataset.mode);});
  $('swap').onclick=()=>act('swap');$('purr').onclick=()=>act('purr');
  $('sound').onclick=()=>{
    if(!sound.on&&!sound.enable()){toast('Audio non disponibile in questo browser.');return;}
    sound.on=!sound.on;sound.stop();if(sound.on)resumeSound();try{localStorage.setItem('micio-music',sound.on?'on':'off');}catch{}soundLabel();
  };

  function setPalette(name,save=true){
    palette=MicioDraw.setPalette(name);document.body.dataset.palette=palette;
    const label=palette==='neon'?'Fluorescenti':'Pastello';
    $('palette').setAttribute('aria-label','Colori '+label.toLowerCase()+': passa a '+(palette==='neon'?'pastello':'fluorescenti'));
    $('palette').setAttribute('title','Cambia colori · '+label);$('palette-label').textContent=label;
    document.querySelectorAll('[data-colors]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.colors===palette)));
    if(save)try{localStorage.setItem('micio-palette',palette);}catch{}
    refresh();
  }
  $('palette').onclick=()=>setPalette(palette==='pastel'?'neon':'pastel');
  document.querySelectorAll('[data-colors]').forEach(b=>b.onclick=()=>setPalette(b.dataset.colors));

  function nativeScreen(){return document.fullscreenElement||document.webkitFullscreenElement;}
  function syncScreen(){
    document.body.classList.add('immersive');const on=!!nativeScreen();
    $('fullscreen').setAttribute('aria-pressed',String(on));$('fullscreen').setAttribute('aria-label',on?'Mostra le barre del browser':'Nascondi le barre del browser');
    $('fullscreen').querySelector('span').textContent=on?'Mostra barre':'Schermo intero';$('dialog-fullscreen').textContent=on?'⛶ Mostra le barre del browser':'⛶ Nascondi le barre del browser';
    requestAnimationFrame(resize);
  }
  function screenNotice(message){$('screen-status').textContent=message;$('screen-status').hidden=false;toast(message);}
  async function enterFullscreen(notify=true){
    if(screenBusy||nativeScreen())return;screenBusy=true;
    try{
      const root=document.documentElement,request=root.requestFullscreen||root.webkitRequestFullscreen;
      if(request){await request.call(root);$('screen-status').hidden=true;}
      else if(notify)screenNotice('Il gioco occupa già tutta la pagina. Su iPhone: Safari → Condividi → Aggiungi alla schermata Home per nascondere le barre.');
    }catch{if(notify)screenNotice('Il browser mantiene le sue barre. Il gioco resta a tutta pagina.');}
    finally{screenBusy=false;syncScreen();}
  }
  async function toggleFullscreen(){
    if(screenBusy)return;
    if(!nativeScreen()){await enterFullscreen();return;}
    screenBusy=true;
    try{const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}
    catch{screenNotice('Usa il comando del browser per mostrare le barre.');}
    finally{screenBusy=false;syncScreen();}
  }
  $('fullscreen').onclick=toggleFullscreen;$('dialog-fullscreen').onclick=toggleFullscreen;
  for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,syncScreen);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nativeScreen()&&!dialog.open)$('pause').click();});

  document.querySelectorAll('[data-action]').forEach(b=>{
    const action=b.dataset.action;
    if(action==='left'||action==='right'){
      b.addEventListener('pointerdown',e=>{e.preventDefault();stopRepeat();act(action);b.setPointerCapture?.(e.pointerId);repeatDelay=setTimeout(()=>{repeatTimer=setInterval(()=>act(action),120);},260);});
      b.addEventListener('pointerup',stopRepeat);b.addEventListener('pointercancel',stopRepeat);b.addEventListener('lostpointercapture',stopRepeat);b.addEventListener('click',e=>{if(e.detail===0)act(action);});
    }else b.onclick=()=>act(action);
  });
  const keys={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rotate',ArrowDown:'down',' ':'drop',c:'swap',f:'purr'};
  document.addEventListener('keydown',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;if(key==='p'&&!e.repeat){e.preventDefault();if(dialog.open)dialog.close();else $('pause').click();return;}if(dialog.open||paused)return;if(keys[key]){e.preventDefault();if(e.repeat&&['drop','rotate','swap','purr'].includes(keys[key]))return;act(keys[key]);}});
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{if(paused||game.over||drag)return;e.preventDefault();canvas.setPointerCapture?.(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,moved:false};});
  canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const threshold=MicioDraw.geometry(width,height).r*1.5;const steps=Math.trunc((e.clientX-drag.lastX)/threshold);if(steps){for(let i=0;i<Math.min(9,Math.abs(steps));i++)act(steps>0?'right':'left');drag.lastX+=steps*threshold;drag.moved=true;}});
  canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const d=drag;drag=null;if(e.clientY-d.y>45&&Math.abs(e.clientX-d.x)<45)act('drop');else if(!d.moved&&Math.abs(e.clientY-d.y)<18)act('rotate');});
  canvas.addEventListener('pointercancel',()=>{drag=null;});
  window.addEventListener('blur',()=>{drag=null;stopRepeat();});
  document.addEventListener('visibilitychange',()=>{stopRepeat();drag=null;last=0;fall=0;if(document.hidden){sound.stop();if(!paused&&!game.over)$('pause').click();}});
  function resize(){const ratio=Math.min(devicePixelRatio||1,2);for(const [c,cx]of [[canvas,ctx],[next,nc]]){const r=c.getBoundingClientRect();c.width=Math.round(r.width*ratio);c.height=Math.round(r.height*ratio);cx.setTransform(ratio,0,0,ratio,0,0);if(c===canvas){width=r.width;height=r.height;}}particles=[];refresh();}
  window.addEventListener('resize',resize);if(window.visualViewport)window.visualViewport.addEventListener('resize',resize);
  function loop(t){
    requestAnimationFrame(loop);const elapsed=last?Math.max(0,t-last):0,dt=Math.min(100,elapsed);last=t;if(document.hidden)return;
    if(!paused&&!game.over){
      if(game.advance(elapsed))finish();
      else{
    sound.tick(game.mode);refreshTime();
        if(game.mode==='flow'){
          // Bound catch-up work after a slow frame; the real countdown never slows down.
          fall=Math.min(fall+elapsed,game.interval*8);
          while(fall>=game.interval&&!game.over){fall-=game.interval;burst(game.step());}
        }
      }
    }
    if(toastUntil&&t>toastUntil){$('toast').classList.remove('show');toastUntil=0;}
    if(particles.length){for(const p of particles){p.life-=dt/750;p.x+=p.vx*dt/1000;p.y+=p.vy*dt/1000;p.vy+=dt*.08;}particles=particles.filter(p=>p.life>0);needsDraw=true;}
    if(needsDraw){MicioDraw.board(ctx,width,height,game,particles);needsDraw=false;}
  }
  soundLabel();let initialPalette='pastel';try{initialPalette=localStorage.getItem('micio-palette')||'pastel';}catch{}setPalette(initialPalette,false);
  syncScreen();
  resize();welcome();requestAnimationFrame(loop);
})();
