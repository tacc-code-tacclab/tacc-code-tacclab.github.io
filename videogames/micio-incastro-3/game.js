(() => {
  'use strict';
  const $=id=>document.getElementById(id),canvas=$('board'),ctx=canvas.getContext('2d'),next=$('next'),nc=next.getContext('2d'),objective=$('objective'),oc=objective.getContext('2d');
  const game=new Micio3.Game(),sound=Micio3Audio.create(),dialog=$('dialog'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const weaponButtons=[...document.querySelectorAll('[data-weapon]')];
  let started=false,paused=true,last=0,fall=0,width=0,height=0,needsDraw=true,worldIndex=-1,phase='welcome',mainAction=null,secondaryAction=null;
  let repeatDelay=0,repeatTimer=0,drag=null,screenBusy=false,palette='pastel',noticeUntil=0,particles=[],effects=[],mosquitoPointerAt=-Infinity,savedTrip=null;
  try{const data=JSON.parse(localStorage.getItem('micio3-trip-v1')||'null');if(new Micio3.Game().restoreCampaign(data))savedTrip=data;sound.on=localStorage.getItem('micio3-music')!=='off';}catch{}
  function setText(id,text){if($(id).textContent!==String(text))$(id).textContent=String(text);}
  function saveTrip(){savedTrip=game.campaignSave();try{localStorage.setItem('micio3-trip-v1',JSON.stringify(savedTrip));}catch{setText('save-hint','Salvataggio non disponibile: il viaggio resta aperto in questa pagina.');}}
  function stopRepeat(){clearTimeout(repeatDelay);clearInterval(repeatTimer);repeatDelay=repeatTimer=0;}
  function resumeSound(){if(sound.on&&started&&!paused&&!game.over)sound.enable();}
  function soundLabel(){$('sound').setAttribute('aria-pressed',String(sound.on));$('sound').setAttribute('aria-label',sound.on?'Disattiva musica e suoni':'Attiva musica e suoni');setText('sound-label',sound.on?'Musica on':'Musica off');}
  function defaultStatus(){const missing=game.goal-game.progress;return missing===1?'Manca una casella dorata! Trovala nella sagoma.':'Dorato = da riempire · Verde = impronta conquistata.';}
  function notice(text){setText('board-status',text);$('board-status').classList.add('important');noticeUntil=performance.now()+3200;}
  function refreshScene(){
    const index=game.mission.world;if(worldIndex!==index){worldIndex=index;document.body.dataset.scene=game.world.asset;$('scene-mobile').srcset='backgrounds/'+game.world.asset+'-small.webp';$('scene').src='backgrounds/'+game.world.asset+'.webp';}
    setText('world-name',game.world.name);setText('world-number',game.world.region.toUpperCase()+' · '+(index+1)+' / '+Micio3.WORLDS.length);setText('world-caption',game.world.caption);$('travel-fill').style.width=((game.stage+(game.won?1:0))/Micio3.MISSIONS.length*100)+'%';
  }
  function refreshClock(){
    const seconds=Math.ceil(game.remaining/1000);setText('timer',game.mode==='chill'?'∞':Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0'));
    $('timer').classList.toggle('urgent',game.mode==='flow'&&seconds<=30&&!game.over);
    let state='idle',text='Riempi tutta la sagoma',help='La zanzara si colpisce con SPARA o X.',count='';
    if(game.mosquito){state='warning';text='Ferma la zanzara!';const hits=Math.ceil(game.mosquito.hp/Micio3.WEAPONS[game.weapon].damage);help=hits+' colp'+(hits===1?'o':'i')+' con '+Micio3.WEAPONS[game.weapon].name.toLowerCase();count=game.mode==='chill'?game.mosquito.placements+' pose':Math.ceil(game.mosquito.dropMs/1000)+'s';}
    $('mosquito-banner').dataset.state=state;setText('mosquito-text',text);setText('mosquito-help',help);setText('mosquito-count',count);
  }
  function refreshControls(){
    const unavailable=game.over||!started,weapon=Micio3.WEAPONS[game.weapon];
    $('swap').disabled=unavailable||paused||game.swapped;$('purr').disabled=unavailable||paused||game.charge<4;$('cycle-weapon').disabled=unavailable||paused;
    setText('charge-text',game.charge+'/4');setText('shot-name',weapon.name.toUpperCase()+' · MIRA AUTO');
    $('flying-mosquito').disabled=unavailable||paused;$('flying-mosquito').dataset.still=String(paused||reduced);$('flying-mosquito').setAttribute('aria-label','Colpisci la zanzara: '+(game.mosquito?.hp||0)+' punti di resistenza. Anche con X.');setText('mosquito-hp',game.mosquito?game.mosquito.hp+' / '+game.mosquito.maxHp:'');
    $('shoot-mosquito').hidden=!game.mosquito||unavailable;$('shoot-mosquito').disabled=unavailable||paused;$('mosquito-banner').dataset.still=String(paused);
    for(const button of weaponButtons){const id=button.dataset.weapon,w=Micio3.WEAPONS[id],owned=game.owned.includes(id);button.dataset.locked=String(!owned);button.setAttribute('aria-pressed',String(id===game.weapon));button.setAttribute('aria-label',w.name+(owned?', '+w.damage+' danni, tasto '+(Micio3.WEAPON_IDS.indexOf(id)+1):', da sbloccare in armeria per '+w.price+' crediti'));button.style.setProperty('--weapon-color',w.color);button.querySelector('small').textContent=owned?(id===game.weapon?'In uso':'Sbloccata'):w.price+' ◇';}
  }
  function refresh(){
    refreshScene();setText('score',game.score.toLocaleString('it-IT'));setText('coins',game.coins);setText('stage',(game.stage+1)+' / '+Micio3.MISSIONS.length);
    $('score').title=(100-game.score%100)+' punti al prossimo credito';setText('mission-kind',game.world.name.toUpperCase()+' · '+game.world.country.toUpperCase());setText('mission-title','Completa: '+game.mission.label);setText('progress-text',game.progress+' / '+game.goal);
    $('objective').setAttribute('aria-label','Sagoma '+game.mission.label+': '+game.progress+' di '+game.goal+' caselle, mancano '+(game.goal-game.progress));
    const p=$('goal-progress');p.setAttribute('aria-valuemax',game.goal);p.setAttribute('aria-valuenow',game.progress);p.setAttribute('aria-valuetext',game.progress+' caselle completate su '+game.goal);$('goal-fill').style.width=(game.progress/game.goal*100)+'%';
    refreshClock();refreshControls();if(!noticeUntil)setText('board-status',defaultStatus());
    const n=next.getBoundingClientRect(),o=objective.getBoundingClientRect();Micio3Draw.preview(nc,n.width,n.height,game.queue);Micio3Draw.objective(oc,o.width,o.height,game);updateMosquito();needsDraw=true;
  }
  function updateMosquito(){
    const mosquito=$('flying-mosquito'),visible=!!game.mosquito&&started&&!game.over;
    mosquito.hidden=!visible;$('arena').dataset.mosquito=visible?'flying':'none';mosquito.dataset.still=String(paused||reduced);
    sound.setMosquito(visible&&!paused&&!document.hidden,game.mosquito?.age||0);if(!visible)return;
    const p=Micio3Draw.mosquitoPosition(width,height,game.mosquito,reduced);
    mosquito.style.width=p.size+'px';mosquito.style.height=Math.max(44,p.size*.96)+'px';mosquito.style.transform='translate3d('+(p.x-p.size/2)+'px,'+(p.y-p.size*.48)+'px,0) rotate('+p.tilt+'deg)';mosquito.dataset.hit=String(game.mosquito.cooldown>90);
  }
  function addParticles(result){
    const g=Micio3Draw.geometry(width,height);if(!reduced)for(const clear of result?.clears||[])for(const c of clear.cells){const p=Micio3Draw.point(g,c.x,c.y);for(let n=0;n<2&&particles.length<90;n++)particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*75,vy:-25-Math.random()*55,size:2+Math.random()*3,color:c.color,life:1});}
  }
  function processEvents(){
    const events=game.drainEvents();for(const event of events){
      if(event.type==='mosquito-warning'){sound.fx('mosquito');notice('Zzz! SPARA o X ferma la zanzara · E cambia arma.');}
      else if(event.type==='mosquito-clutter'){sound.fx('clutter');notice('La zanzara lascia macchie! Colpiscila per ripulire.');if(!reduced){const p=Micio3Draw.mosquitoPosition(width,height,event.flight,reduced);for(const cell of event.cells)effects.push({kind:'clutter',cell,x:p.x,y:p.y,age:0,duration:600});}}
      else if(event.type==='mosquito-hit'){sound.fx('hit');notice('Colpita! Resistenza rimasta: '+event.hp+'.');}
      else if(event.type==='mosquito-defeated'){sound.fx('honey');addParticles(event.result);notice('Zanzara scacciata! Macchie ripulite · +100 punti = 1 credito');}
      else if(event.type==='mosquito-away')notice('La zanzara è fuggita. Libera le macchie con incastri o Fusa.');
    }
    if(events.length){effects=effects.slice(-12);refresh();if(game.over&&!dialog.open)showResult();}
  }
  function burst(result){
    if(!result)return;addParticles(result);
    if(result.clears?.length){sound.fx(result.purr?'purr':'clear',Math.max(1,result.chain));notice(result.purr?'Frrrr… spazio libero, impronte salve!':result.chain>1?'Catena ×'+result.chain+' · Punti che diventano crediti!':'Gattini riuniti! Le impronte conquistate restano.');}
    else if(result.stamped){sound.fx('stamp');notice(game.goal-game.progress===1?'Manca solo una casella! Riempi anche l’ultimo buco.':'+'+result.stamped+' caselle · Ne mancano '+(game.goal-game.progress));}
    else sound.fx(result.moved?'fall':'lock');processEvents();refresh();if(game.over&&!dialog.open)showResult();
  }
  function equip(id){if(!started||paused||game.over)return;if(!game.equip(id)){notice('Sblocca '+Micio3.WEAPONS[id].name.toLowerCase()+' nell’armeria, fra le tappe.');return;}sound.fx('swap');notice(Micio3.WEAPONS[id].name+' · '+Micio3.WEAPONS[id].damage+' danni · Colpi illimitati');refresh();}
  function act(action){
    if(!started||paused||game.over||dialog.open)return;
    if(action==='shoot'){shoot();return;}if(action==='weapon'){game.cycleWeapon();notice('Arma: '+Micio3.WEAPONS[game.weapon].name);refresh();return;}
    let changed=false;if(action==='left')changed=game.move(-1);else if(action==='right')changed=game.move(1);else if(action==='rotate')changed=game.turn();else if(action==='swap')changed=game.swap();
    else if(action==='drop'){sound.fx('drop');burst(game.drop());fall=0;}else if(action==='down'){burst(game.step());fall=0;}else if(action==='purr'){burst(game.purr());fall=0;}
    if(changed){sound.fx(action==='rotate'?'rotate':action==='swap'?'swap':'move');refresh();}needsDraw=true;
  }
  function shoot(target=null){
    if(!started||paused||game.over||dialog.open||!game.mosquito)return;const p=Micio3Draw.mosquitoPosition(width,height,game.mosquito,reduced),aim=target||p,id=game.weapon,w=Micio3.WEAPONS[id];
    const hit=Math.abs(aim.x-p.x)<=p.size*.6&&Math.abs(aim.y-p.y)<=p.size*.58;if(!game.shootMosquito(hit))return;
    sound.fx(id);effects.push({kind:'shot',weapon:id,color:w.color,x:aim.x,y:aim.y,fromX:width/2,fromY:height-12,hit,age:0,duration:id==='laser'?250:340});effects=effects.slice(-12);drag=null;stopRepeat();processEvents();needsDraw=true;
  }
  function beginStage(){started=true;paused=false;last=0;fall=0;particles=[];effects=[];noticeUntil=0;sound.setStage(game.mission.world);sound.index=game.stage%2?128:0;resumeSound();refresh();saveTrip();notice(game.world.name+' · Riempi tutte le '+game.goal+' caselle della sagoma!');}
  function start(mode){game.reset(mode);beginStage();enterFullscreen(false);}
  function show(kind,title,copy,label,action,secondary=null,secondaryLabel='Annulla',kicker='MICIO INCASTRO 3'){
    paused=true;last=0;fall=0;drag=null;stopRepeat();sound.stop();phase=kind;mainAction=action;secondaryAction=secondary;dialog.dataset.kind=kind;dialog.dataset.result='';
    setText('dialog-title',title);$('dialog-copy').innerHTML=copy;setText('dialog-kicker',kicker);setText('dialog-main',label);setText('dialog-secondary',secondaryLabel);$('dialog-secondary').hidden=!secondary;$('dialog-close').hidden=kind==='welcome'||kind==='result';
    $('shop').hidden=true;$('passport').hidden=true;$('resume-trip').hidden=true;$('palette-picker').hidden=kind==='result'||kind==='passport';if(!dialog.open)dialog.showModal();refreshControls();updateMosquito();
  }
  function closeModal(action){dialog.close();if(action)action();if(!dialog.open&&started&&!game.over){paused=false;last=0;fall=0;resumeSound();}refresh();}
  function dismiss(){if(phase==='welcome'||phase==='result')return;closeModal();}
  $('dialog-main').onclick=()=>closeModal(mainAction);$('dialog-secondary').onclick=()=>closeModal(secondaryAction);$('dialog-close').onclick=dismiss;dialog.addEventListener('cancel',e=>{e.preventDefault();dismiss();});
  dialog.addEventListener('close',()=>{if(game.over)requestAnimationFrame(()=>{if(game.over&&!dialog.open)showResult();});});
  function welcome(){
    show('welcome','Il mondo, un incastro alla volta.','<p><strong>36 sagome. 18 destinazioni. Un viaggio con i mici.</strong></p><ul><li>Fai atterrare i gattini su <strong>tutte le caselle dorate</strong>. Se resta un buco, la tappa non è finita. Le impronte verdi restano anche dopo gli incastri.</li><li>Unisci 6 gatti uguali: liberi spazio e guadagni punti. <strong>100 punti diventano 1 credito</strong> per nuove armi.</li><li>Una zanzara dispettosa lascia macchie! Premi <strong>SPARA / X</strong>. Parti con i sassi; poi sblocchi freccette, lance, proiettili e laser.</li></ul><p>Frecce e spazio, oppure trascina e usa i pulsanti. <strong>Sfida</strong>: i gatti cadono e il tempo scorre. <strong>Senza fretta</strong>: decidi tu quando posarli.</p>','Parti · Sfida →',()=>start('flow'),()=>start('chill'),'Senza fretta');
    if(savedTrip){$('resume-trip').hidden=false;setText('resume-trip','Riprendi: '+Micio3.WORLDS[Micio3.MISSIONS[savedTrip.stage].world].name+' · tappa '+(savedTrip.stage+1)+' →');}
  }
  $('resume-trip').onclick=()=>{if(!savedTrip||!game.restoreCampaign(savedTrip))return;dialog.close();started=true;sound.setStage(game.mission.world);if(game.won){refresh();showResult();}else beginStage();enterFullscreen(false);};
  function help(){show('help','Ogni casella conta.','<ul><li><strong>Vittoria:</strong> riempi tutte le caselle dorate, anche quelle interne. Il punteggio non permette di saltare la sagoma.</li><li><strong>Impronte:</strong> ogni gatto che atterra su una casella obiettivo la conquista. Il segno verde resta quando 6 gattini uguali si riuniscono e scompaiono.</li><li><strong>Crediti:</strong> 100 punti = 1 credito, automaticamente. Fra le tappe compri armi permanenti per il viaggio, con colpi illimitati. I sassi sono sempre gratuiti.</li><li><strong>Zanzara:</strong> toccala, cliccala oppure premi SPARA / X per la mira automatica. E oppure 1–5 cambia arma. Scacciarla elimina le sue macchie e vale 100 punti.</li><li><strong>Fusa / F:</strong> si carica conquistando caselle, riunendo gatti e scacciando zanzare. Libera due file senza cancellare le impronte. Utile se hai coperto l’accesso a un buco!</li></ul><p>← → sposta · ↑ ruota · spazio posa · C cambia gruppo · P pausa. Sul telefono trascina per spostare e scorri in basso per posare. Con la zanzara presente, i tocchi sulla griglia sparano: ruota con il pulsante.</p><p>Il viaggio si salva a ogni tappa, inclusi gli acquisti. Dopo una chiusura riparti dall’inizio della tappa, con il suo portafoglio iniziale.</p>','Riprendi →',null);}
  function pause(){if(!started||game.over||dialog.open)return;show('pause','Una piccola sosta.','<p>Tutto è fermo: gatti, zanzara, timer e musica.</p><p><strong>'+game.world.name+' · '+game.mission.label+'</strong><br>Mancano '+(game.goal-game.progress)+' caselle per completare la tappa.</p>','Riprendi →',null,requestRestart,'Nuovo viaggio','TAPPA '+(game.stage+1)+' / 36');}
  function requestRestart(){show('confirm','Un nuovo giro del mondo?','<p>Riparti da Venezia con i sassi e il portafoglio vuoto. Il viaggio salvato verrà sostituito.</p>','Nuova Sfida →',()=>start('flow'),()=>start('chill'),'Nuovo Senza fretta');}
  function passport(){
    show('passport','Il tuo passaporto.','<p><strong>18 destinazioni, due sagome per ognuna.</strong> Il viaggio prosegue quando non resta nessuna casella dorata vuota.</p>','Torna al viaggio →',null,null,'','UN MONDO DI INCASTRI');$('passport').hidden=false;
    $('passport').innerHTML=Micio3.WORLDS.map((world,i)=>{const first=i*2,done=Math.min(2,Math.max(0,game.stage-first+(game.won?1:0))),current=i===game.mission.world;return '<article data-current="'+current+'"><img src="backgrounds/'+world.asset+'-small.webp" width="800" height="533" alt="Illustrazione di '+world.name+'" loading="lazy"><h3>'+world.name+'</h3><p>'+world.country+' · '+world.region+'<br>Tappe '+(first+1)+'–'+(first+2)+' · <span class="'+(done?'stamp':'locked')+'">'+(done===2?'✓ Completate':current?'Qui ora · '+done+'/2':done+'/2 sagome')+'</span></p></article>';}).join('');
  }
  $('shop-items').innerHTML=Micio3.WEAPON_IDS.filter(id=>id!=='stone').map(id=>{const w=Micio3.WEAPONS[id];return '<article id="product-'+id+'" style="--weapon-color:'+w.color+'"><span class="product-icon" aria-hidden="true">'+w.icon+'</span><div><h4>'+w.name+'</h4><p>'+w.hint+'</p><small class="weapon-detail">'+w.damage+' danni · '+(w.cooldown/1000).toLocaleString('it-IT')+' s fra i colpi</small></div><button id="buy-'+id+'">Sblocca · '+w.price+' ◇</button></article>';}).join('');
  function refreshShop(){setText('shop-coins',game.coins);for(const id of Micio3.WEAPON_IDS.filter(id=>id!=='stone')){const owned=game.owned.includes(id),w=Micio3.WEAPONS[id];$('product-'+id).dataset.owned=String(owned);setText('buy-'+id,owned?'✓ Già tua':'Sblocca · '+w.price+' ◇');$('buy-'+id).disabled=!game.canBuy(id);}}
  for(const id of Micio3.WEAPON_IDS.filter(id=>id!=='stone'))$('buy-'+id).onclick=()=>{if(game.buy(id)){saveTrip();sound.fx('swap');setText('shop-feedback',Micio3.WEAPONS[id].name+' sbloccate e pronte! Colpi illimitati.');refreshShop();refresh();}};
  function showResult(){
    const won=game.won,final=game.campaignWon,timed=game.endReason==='time';refresh();saveTrip();
    const nextMission=Micio3.MISSIONS[game.stage+1],nextWorld=nextMission?Micio3.WORLDS[nextMission.world]:null;
    show('result',final?'Il mondo è pieno di mici!':won?'Nessun buco. Tappa completata!':timed?'Il tempo è finito.':'Il nido è pieno.',
      '<p>'+(final?'Hai conquistato <strong>tutte le 36 sagome</strong>, attraversato 18 destinazioni e completato il giro del mondo!':won?'Prossima tappa: <strong>'+nextWorld.name+' · '+nextMission.label+'</strong>. Prima di partire puoi sbloccare una nuova arma.':'Mancavano <strong>'+(game.goal-game.progress)+' caselle</strong>. Riprova con i crediti e le armi che avevi all’inizio di questa tappa.')+'</p><p><strong>'+game.progress+' / '+game.goal+' caselle</strong> · '+game.score.toLocaleString('it-IT')+' punti · '+game.coins+' crediti</p>'+(won?'<p class="reward">+200 punti di viaggio = 2 crediti</p>':''),
      final?'Un nuovo viaggio →':won?'Tappa '+(game.stage+2)+' →':'Riprova questa tappa →',()=>{if(final)start(game.mode);else if(won){if(game.nextStage())beginStage();}else if(game.retryStage())beginStage();},null,'',final?'VIAGGIO COMPLETATO · 36 / 36':won?'TAPPA '+(game.stage+1)+' / 36 COMPLETATA':'UN ALTRO TENTATIVO');
    dialog.dataset.result=won?'win':'';if(won&&!final){$('shop').hidden=false;setText('shop-feedback','Puoi continuare anche senza comprare: i sassi sono sempre disponibili.');refreshShop();}sound.fx(final?'final':won?'win':'lose');
  }
  $('help').onclick=help;$('pause').onclick=pause;$('restart').onclick=requestRestart;$('passport-button').onclick=passport;$('swap').onclick=()=>act('swap');$('purr').onclick=()=>act('purr');$('cycle-weapon').onclick=()=>act('weapon');
  weaponButtons.forEach(button=>button.onclick=()=>equip(button.dataset.weapon));
  $('flying-mosquito').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();mosquitoPointerAt=performance.now();shoot();});$('flying-mosquito').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if((e.detail===0&&!e.pointerType)||performance.now()-mosquitoPointerAt>500)shoot();});$('shoot-mosquito').onclick=()=>shoot();
  $('sound').onclick=()=>{if(!sound.on&&!sound.enable()){notice('Audio non disponibile in questo browser.');return;}sound.on=!sound.on;sound.stop();if(sound.on)resumeSound();try{localStorage.setItem('micio3-music',sound.on?'on':'off');}catch{}soundLabel();};
  function setPalette(name,save=true){palette=Micio3Draw.setPalette(name);document.body.dataset.palette=palette;const label=palette==='neon'?'Fluorescenti':'Pastello';setText('palette-label',label);$('palette').setAttribute('aria-label','Colori '+label.toLowerCase()+': passa a '+(palette==='neon'?'pastello':'fluorescenti'));document.querySelectorAll('[data-colors]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.colors===palette)));if(save)try{localStorage.setItem('micio3-palette',palette);}catch{}refresh();}
  $('palette').onclick=()=>setPalette(palette==='pastel'?'neon':'pastel');document.querySelectorAll('[data-colors]').forEach(el=>el.onclick=()=>setPalette(el.dataset.colors));
  function nativeScreen(){return document.fullscreenElement||document.webkitFullscreenElement;}
  function syncScreen(){const on=!!nativeScreen();$('fullscreen').setAttribute('aria-pressed',String(on));$('fullscreen').setAttribute('aria-label',on?'Mostra le barre del browser':'Nascondi le barre del browser');requestAnimationFrame(resize);}
  async function enterFullscreen(explain=true){if(screenBusy||nativeScreen())return;screenBusy=true;try{const root=document.documentElement,request=root.requestFullscreen||root.webkitRequestFullscreen;if(request)await request.call(root);else if(explain)notice('Vista a tutta pagina. Su iPhone usa Aggiungi alla schermata Home.');}catch{if(explain)notice('Il browser mantiene le barre. Il gioco resta a tutta pagina.');}finally{screenBusy=false;syncScreen();}}
  $('fullscreen').onclick=async()=>{if(screenBusy)return;if(!nativeScreen()){await enterFullscreen();return;}screenBusy=true;try{const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}catch{}finally{screenBusy=false;syncScreen();}};for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,syncScreen);
  document.querySelectorAll('[data-action]').forEach(button=>{const action=button.dataset.action;if(action==='left'||action==='right'){button.addEventListener('pointerdown',e=>{e.preventDefault();stopRepeat();act(action);button.setPointerCapture?.(e.pointerId);repeatDelay=setTimeout(()=>{repeatTimer=setInterval(()=>act(action),110);},250);});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,stopRepeat);button.addEventListener('click',e=>{if(e.detail===0)act(action);});}else button.onclick=()=>act(action);});
  const keys={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rotate',ArrowDown:'down',' ':'drop',c:'swap',f:'purr',x:'shoot',e:'weapon'};
  document.addEventListener('keydown',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;if(key==='Escape'&&!dialog.open){if(!nativeScreen())pause();return;}if(key==='p'&&!e.repeat){e.preventDefault();if(dialog.open){if(['pause','help','passport'].includes(phase))dismiss();}else pause();return;}if(dialog.open||paused)return;if(/^[1-5]$/.test(key)){e.preventDefault();if(!e.repeat)equip(Micio3.WEAPON_IDS[Number(key)-1]);return;}if(keys[key]){e.preventDefault();if(e.repeat&&!['left','right','down'].includes(keys[key]))return;act(keys[key]);}});
  canvas.addEventListener('pointerdown',e=>{if(!started||paused||game.over||drag)return;e.preventDefault();canvas.setPointerCapture?.(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,moved:false};});
  canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const threshold=Math.max(8,Micio3Draw.geometry(width,height).r*1.5),steps=Math.trunc((e.clientX-drag.lastX)/threshold);if(steps){for(let n=0;n<Math.min(9,Math.abs(steps));n++)act(steps>0?'right':'left');drag.lastX+=steps*threshold;drag.moved=true;}});
  canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const d=drag;drag=null;if(e.clientY-d.y>45&&Math.abs(e.clientX-d.x)<45)act('drop');else if(!d.moved&&Math.abs(e.clientY-d.y)<18){if(game.mosquito){const r=canvas.getBoundingClientRect();shoot({x:e.clientX-r.left,y:e.clientY-r.top});}else act('rotate');}});canvas.addEventListener('pointercancel',()=>{drag=null;});window.addEventListener('blur',()=>{drag=null;stopRepeat();});
  document.addEventListener('visibilitychange',()=>{stopRepeat();drag=null;last=0;fall=0;if(document.hidden){sound.stop();if(started&&!paused&&!game.over)pause();}});
  function resize(){const ratio=Math.min(devicePixelRatio||1,2);for(const [element,context]of [[canvas,ctx],[next,nc],[objective,oc]]){const r=element.getBoundingClientRect();element.width=Math.round(r.width*ratio);element.height=Math.round(r.height*ratio);context.setTransform(ratio,0,0,ratio,0,0);if(element===canvas){width=r.width;height=r.height;}}particles=[];effects=[];refresh();}
  window.addEventListener('resize',resize);if(window.visualViewport)window.visualViewport.addEventListener('resize',resize);
  function loop(t){
    requestAnimationFrame(loop);const elapsed=last?Math.max(0,t-last):0,dt=Math.min(100,elapsed);last=t;if(document.hidden)return;
    if(started&&!paused&&!game.over){game.advance(elapsed);processEvents();refreshClock();if(game.over&&!dialog.open)showResult();else if(!game.over){sound.tick(game.mode);if(game.mode==='flow'){fall=Math.min(fall+elapsed,game.interval*6);while(fall>=game.interval&&!game.over){fall-=game.interval;burst(game.step());}}}}
    if(noticeUntil&&t>noticeUntil){noticeUntil=0;$('board-status').classList.remove('important');setText('board-status',defaultStatus());}
    if(particles.length&&!paused){for(const p of particles){p.life-=dt/750;p.x+=p.vx*dt/1000;p.y+=p.vy*dt/1000;p.vy+=dt*.08;}particles=particles.filter(p=>p.life>0);needsDraw=true;}
    if(effects.length&&!paused){for(const fx of effects)fx.age+=dt;effects=effects.filter(fx=>fx.age<fx.duration);needsDraw=true;}if(game.mosquito)updateMosquito();
    if(needsDraw){Micio3Draw.board(ctx,width,height,game,particles,{effects});needsDraw=false;}
  }
  soundLabel();let initialPalette='pastel';try{initialPalette=localStorage.getItem('micio3-palette')||'pastel';}catch{}setPalette(initialPalette,false);syncScreen();
  resize();welcome();requestAnimationFrame(loop);
})();
