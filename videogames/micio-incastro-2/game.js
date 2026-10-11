(() => {
  'use strict';
  const $=id=>document.getElementById(id),canvas=$('board'),ctx=canvas.getContext('2d'),next=$('next'),nc=next.getContext('2d'),objective=$('objective'),oc=objective.getContext('2d');
  const game=new Micio.Game(),sound=MicioAudio.create(),dialog=$('dialog'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let started=false,paused=true,last=0,fall=0,width=0,height=0,needsDraw=true,particles=[],worldIndex=-1,phase='welcome',mainAction=null,secondaryAction=null;
  let repeatDelay=0,repeatTimer=0,drag=null,screenBusy=false,palette='pastel',noticeUntil=0,wand=false,source=null,cursor={x:4,y:11},effects=[],beePointerAt=-Infinity;
  const bests={flow:0,chill:0};
  try{const stored=JSON.parse(localStorage.getItem('micio2-records-v1')||'{}');for(const mode of ['flow','chill'])if(Number.isFinite(stored[mode])&&stored[mode]>=0)bests[mode]=stored[mode];sound.on=localStorage.getItem('micio-music')!=='off';}catch{}
  function setText(id,text){if($(id).textContent!==text)$(id).textContent=text;}
  function stopRepeat(){clearTimeout(repeatDelay);clearInterval(repeatTimer);repeatDelay=repeatTimer=0;}
  function resumeSound(){if(sound.on&&started&&!paused&&!game.over&&!wand)sound.enable();}
  function soundLabel(){$('sound').setAttribute('aria-pressed',String(sound.on));$('sound').setAttribute('aria-label',sound.on?'Disattiva musica e suoni':'Attiva musica e suoni');setText('sound-label',sound.on?'Musica on':'Musica off');}
  function defaultStatus(){return wand?(source?'Scegli una casella vuota · W o Esc annulla':'Scegli un gatto già posato · W o Esc annulla'):game.mission.kind==='figure'?'Caselle dorate = obiettivo · Le impronte restano.':'Unisci 6 uguali · Ogni 3 gatti salvati, 1 moneta.';}
  function notice(text){setText('board-status',text);$('board-status').classList.add('important');noticeUntil=performance.now()+2800;}
  function refreshScene(){
    const index=game.mission.world;if(worldIndex!==index){worldIndex=index;document.body.dataset.scene=game.world.asset;$('scene-mobile').srcset='../micio-incastro/backgrounds/'+game.world.asset+'-small.webp';$('scene').src='../micio-incastro/backgrounds/'+game.world.asset+'.webp';}
    setText('world-name',game.world.name);setText('world-number',game.world.symbol+' MONDO '+(index+1)+' / 4');
    document.querySelectorAll('[data-stop]').forEach((el,i)=>{el.classList.toggle('current',i===game.stage);el.classList.toggle('complete',i<game.stage);el.setAttribute('aria-label','Missione '+(i+1)+(i<game.stage?' completata':i===game.stage?' attuale':''));});
  }
  function refreshClock(){
    const seconds=Math.ceil(game.remaining/1000);setText('timer',game.mode==='chill'?'∞':Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0'));
    $('timer').classList.toggle('urgent',game.mode==='flow'&&seconds<=30&&!game.over);
    setText('slow-count',game.slowMs>0?Math.ceil(game.slowMs/1000)+'s':String(game.inventory.slow));
    let state='idle',text='Un’ape si aggira nei dintorni…',help='Quando vola: clic / tocco sull’ape · X spara.',count='…';
    if(wand){state='wand';text=source?'Ora scegli una casella vuota':'Bacchetta: scegli un gatto posato';help='Tempo fermo · Tocca la griglia o usa frecce e spazio.';count='✧';}
    else if(game.bee){state='warning';text='Spara all’ape! '+game.bee.hp+' colp'+(game.bee.hp===1?'o':'i')+' per scacciarla';help='Clic / tocco sull’ape · X mira · B miele';count=game.mode==='chill'?game.bee.placements+' pose':Math.ceil(game.bee.dropMs/1000)+'s';}
    else if(game.slowMs>0){state='slow';text='Un piccolo respiro: caduta rallentata';help='Il timer della missione continua a scorrere.';count=Math.ceil(game.slowMs/1000)+'s';}
    $('bee-banner').dataset.state=state;setText('bee-text',text);setText('bee-help',help);setText('bee-count',count);
  }
  function refreshControls(){
    const unavailable=game.over||!started;
    $('honey').disabled=unavailable||wand||!game.bee||game.inventory.honey===0;$('slow').disabled=unavailable||wand||game.mode==='chill'||game.slowMs>0||game.inventory.slow===0;
    $('wand').disabled=unavailable||game.inventory.wand===0;$('purr').disabled=unavailable||wand||game.charge<4;$('swap').disabled=unavailable||wand||game.swapped;
    setText('honey-count',String(game.inventory.honey));setText('wand-count',String(game.inventory.wand));setText('charge-text',game.charge+'/4');setText('wand-label',wand?'Annulla':'Bacchetta');
    $('wand').setAttribute('aria-pressed',String(wand));$('wand').setAttribute('aria-label',wand?'Annulla la bacchetta, tasto W o Esc':'Sposta un gattino con la bacchetta, tasto W');
    $('flying-bee').disabled=unavailable||paused||wand;$('flying-bee').setAttribute('aria-label','Spara all’ape: '+(game.bee?.hp||3)+' colpi rimasti. Anche con X.');setText('bee-hp',game.bee?'● '.repeat(game.bee.hp).trim():'');
    $('rotate-action').innerHTML=wand?'↑ <small>SU</small>':'↻ <small>RUOTA</small>';$('rotate-action').setAttribute('aria-label',wand?'Muovi il cursore in alto':'Ruota di sessanta gradi');
    $('drop-action').innerHTML=wand?'✓ <small>SCEGLI</small>':'↓ <small>POSA</small>';$('drop-action').setAttribute('aria-label',wand?'Scegli questa casella':'Posa il gruppo');
  }
  function refresh(){
    refreshScene();setText('score',game.score.toLocaleString('it-IT'));setText('coins',String(game.coins));setText('stage',(game.stage+1)+' / '+Micio.MISSIONS.length);
    const figure=game.mission.kind==='figure',progress=Math.min(game.progress,game.goal);
    setText('mission-kind',figure?'MISSIONE IMPRONTE':'MISSIONE SALVATAGGIO');setText('mission-title',figure?'Completa: '+game.mission.label:'Salva '+game.goal+' gattini');setText('progress-text',progress+' / '+game.goal);
    setText('mission-detail',figure?'Fai atterrare i gatti nelle caselle dorate. Le impronte restano accese anche quando i gatti vengono salvati.':'Unisci sei gattini della stessa famiglia. Salvali per ottenere monete e caricare le Fusa.');
    $('objective').setAttribute('aria-label',figure?'Sagoma '+game.mission.label+', '+progress+' impronte su '+game.goal:'Obiettivo: salva '+game.goal+' gattini');
    const p=$('goal-progress');p.setAttribute('aria-valuemax',String(game.goal));p.setAttribute('aria-valuenow',String(progress));p.setAttribute('aria-valuetext',progress+' su '+game.goal+(figure?' impronte':' gattini salvati'));$('goal-fill').style.width=(progress/game.goal*100)+'%';
    if(game.score>bests[game.mode]){bests[game.mode]=game.score;try{localStorage.setItem('micio2-records-v1',JSON.stringify(bests));}catch{}}
    refreshClock();refreshControls();if(!noticeUntil)setText('board-status',defaultStatus());
    const n=next.getBoundingClientRect(),o=objective.getBoundingClientRect();MicioDraw.preview(nc,n.width,n.height,game.queue);MicioDraw.objective(oc,o.width,o.height,game);updateBee();needsDraw=true;
  }
  function updateBee(){
    const bee=$('flying-bee'),visible=!!game.bee&&started&&!game.over;
    bee.hidden=!visible;$('arena').dataset.bee=visible&&!wand?'flying':'none';bee.dataset.still=String(paused||wand||reduced);
    if(!visible)return;
    const p=MicioDraw.beePosition(width,height,game.bee,reduced);
    bee.style.width=p.size+'px';bee.style.height=Math.max(44,p.size*.96)+'px';bee.style.transform='translate3d('+(p.x-p.size/2)+'px,'+(p.y-p.size*.48)+'px,0) rotate('+p.tilt+'deg)';
    bee.dataset.hit=String(game.bee.cooldown>90);
  }
  function addParticles(result){
    const g=MicioDraw.geometry(width,height);
    if(!reduced)for(const clear of result?.clears||[])for(const c of clear.cells){const p=MicioDraw.point(g,c.x,c.y);for(let n=0;n<2&&particles.length<90;n++)particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*75,vy:-25-Math.random()*55,size:2+Math.random()*3,color:c.color,life:1});}
  }
  function processEvents(){
    const events=game.drainEvents();for(const event of events){
      if(event.type==='bee-warning'){sound.fx('bee');notice('È arrivata! Clicca o tocca l’ape · 3 colpi la scacciano.');}
      else if(event.type==='bee-pollen'){
        sound.fx('pollen');notice('Bzz! Polline nel nido! Spara all’ape per ripulirlo.');
        if(!reduced){const p=MicioDraw.beePosition(width,height,event.flight,reduced);for(const cell of event.cells)effects.push({kind:'pollen',cell,x:p.x,y:p.y,age:0,duration:600});}
      }
      else if(event.type==='bee-hit'){sound.fx('hit');notice('Presa! Ancora '+event.hp+' colp'+(event.hp===1?'o':'i')+'.');}
      else if(event.type==='bee-defeated'){sound.fx('honey');addParticles(event.result);notice('Ape scacciata! Polline ripulito · +2 monete · +1 Fusa');}
      else if(event.type==='bee-away'){notice('L’ape è fuggita! Elimina il polline con incastri vicini.');}
      else if(event.type==='honey'){sound.fx('honey');addParticles(event.result);notice('Miele irresistibile! Ape scacciata · Polline ripulito');}
      else if(event.type==='slow'){sound.fx('rotate');notice('Ghiaccio! Caduta rallentata per 12 secondi.');}
    }if(events.length){effects=effects.slice(-12);refresh();if(game.over&&!dialog.open)showResult();}
  }
  function burst(result){
    if(!result)return;addParticles(result);
    if(result.clears?.length){sound.fx(result.purr?'purr':'clear',Math.max(1,result.chain));notice(result.purr?'Frrrr… nuove caselle libere!':result.chain>1?'Catena ×'+result.chain+' · Monete in arrivo!':'Una famiglia felice! +'+result.clears.reduce((n,c)=>n+c.cells.filter(cat=>Micio.isCat(cat.color)).length,0)+' gatti');}
    else if(result.stamped){sound.fx('stamp');notice('+'+result.stamped+' impronte · La figura prende forma!');}
    else sound.fx(result.moved?'fall':result.wand?'swap':'lock');
    processEvents();refresh();if(game.over)showResult();
  }
  function cancelWand(){if(!wand)return;wand=false;source=null;last=0;fall=0;stopRepeat();drag=null;noticeUntil=0;refresh();resumeSound();}
  function toggleWand(){
    if(wand){cancelWand();return;}
    if(game.inventory.wand<1)return;
    if(!game.board.some(row=>row.some(Micio.isCat))){notice('Prima posa almeno un gruppo di gattini.');return;}
    wand=true;source=null;cursor={x:4,y:11};last=0;fall=0;stopRepeat();drag=null;sound.stop();noticeUntil=0;refresh();
  }
  function selectCell(cell){
    if(!wand||!cell||paused||game.over)return;cursor=cell;
    if(Micio.isCat(game.board[cell.y][cell.x])){source={...cell};noticeUntil=0;refresh();return;}
    if(!source){notice('Scegli prima un gatto già posato.');needsDraw=true;return;}
    const result=game.useWand(source,cell);
    if(!result){notice('Scegli una casella vuota, libera dal gruppo che cade.');needsDraw=true;return;}
    wand=false;source=null;last=0;fall=0;noticeUntil=0;resumeSound();burst(result);
  }
  function act(action){
    if(!started||paused||game.over||dialog.open)return;
    if(action==='shoot'){shoot();return;}
    if(action==='wand'){toggleWand();return;}
    if(wand){if(action==='drop')selectCell(cursor);else{if(action==='left')cursor.x=(cursor.x+8)%9;else if(action==='right')cursor.x=(cursor.x+1)%9;else if(action==='rotate')cursor.y=(cursor.y+11)%12;else if(action==='down')cursor.y=(cursor.y+1)%12;needsDraw=true;}return;}
    let changed=false;
    if(action==='left')changed=game.move(-1);else if(action==='right')changed=game.move(1);else if(action==='rotate')changed=game.turn();else if(action==='swap')changed=game.swap();
    else if(action==='drop'){sound.fx('drop');burst(game.drop());fall=0;}
    else if(action==='down'){burst(game.step());fall=0;}
    else if(action==='purr'){burst(game.purr());fall=0;}
    else if(action==='honey'){game.useHoney();processEvents();}
    else if(action==='slow'){if(game.useSlow())fall=0;processEvents();}
    if(changed){sound.fx(action==='rotate'?'rotate':action==='swap'?'swap':'move');refresh();}needsDraw=true;
  }
  function shoot(target=null){
    if(!started||paused||wand||game.over||dialog.open||!game.bee)return;
    const p=MicioDraw.beePosition(width,height,game.bee,reduced),aim=target||p;
    const hit=Math.abs(aim.x-p.x)<=p.size*.6&&Math.abs(aim.y-p.y)<=p.size*.58;
    if(!game.shootBee(hit))return;
    sound.fx('shoot');effects.push({kind:'shot',x:aim.x,y:aim.y,fromX:width/2,fromY:height-12,hit,age:0,duration:300});effects=effects.slice(-12);
    drag=null;stopRepeat();processEvents();needsDraw=true;
  }
  function beginStage(){
    started=true;paused=false;wand=false;source=null;fall=0;last=0;particles=[];effects=[];noticeUntil=0;refresh();sound.setStage(game.mission.world);sound.index=game.stage%2?128:0;resumeSound();notice(game.mission.kind==='figure'?'Nuova missione: conquista tutte le caselle dorate.':'Missione '+(game.stage+1)+' · Salva '+game.goal+' gattini!');
  }
  function start(mode){game.reset(mode);beginStage();enterFullscreen(false);}
  function show(kind,title,copy,label,action,secondary=null,secondaryLabel='Annulla',kicker='MICIO INCASTRO 2'){
    if(wand){wand=false;source=null;}paused=true;last=0;drag=null;stopRepeat();sound.stop();phase=kind;dialog.dataset.kind=kind;dialog.dataset.result='';
    setText('dialog-title',title);$('dialog-copy').innerHTML=copy;setText('dialog-kicker',kicker);setText('dialog-main',label);mainAction=action;secondaryAction=secondary;
    $('dialog-secondary').hidden=!secondary;setText('dialog-secondary',secondaryLabel);$('dialog-close').hidden=kind==='welcome'||kind==='result';$('shop').hidden=true;$('palette-picker').hidden=kind==='result';
    if(!dialog.open)dialog.showModal();refreshControls();
  }
  function closeModal(action){dialog.close();if(action)action();if(!dialog.open&&started&&!game.over){paused=false;last=0;fall=0;resumeSound();}refresh();}
  function dismiss(){if(phase==='welcome'||phase==='result')return;closeModal();}
  $('dialog-main').onclick=()=>closeModal(mainAction);$('dialog-secondary').onclick=()=>closeModal(secondaryAction);$('dialog-close').onclick=dismiss;
  dialog.addEventListener('cancel',e=>{e.preventDefault();dismiss();});
  dialog.addEventListener('close',()=>{if(game.over)requestAnimationFrame(()=>{if(game.over&&!dialog.open)showResult();});});
  function welcome(){show('welcome','Un’ape ha cambiato i piani.',
    '<p><strong>Otto missioni, quattro mondi.</strong> Riunisci 6 gattini uguali oppure conquista una sagoma: cuore, pesce e stella.</p><ul><li><strong>Un’ape vola nel nido e lascia polline!</strong> Cliccala o toccala per sparare bolle: <strong>3 colpi la scacciano</strong> e ripuliscono gli ostacoli. Colpi infiniti; X mira automaticamente.</li><li>Miele o B la scaccia subito. Guadagna monete e compra miele, ghiaccio e bacchette fra le missioni.</li></ul><p>Trascina o usa ← →. Tocca la griglia o premi ↑ per ruotare; POSA o spazio fa scendere subito. Quando c’è l’ape, i tocchi sulla griglia sparano: usa RUOTA per i gatti.</p>',
    'Parti · Sfida →',()=>start('flow'),()=>start('chill'),'Senza fretta');}
  function help(){show('help','Piccoli trucchi, grandi incastri.',
    '<ul><li><strong>Salvataggi:</strong> unisci sei vicini uguali. Ogni 3 gatti salvati vale 1 moneta; quattro famiglie caricano le Fusa.</li><li><strong>Figure:</strong> fai atterrare gatti di qualsiasi colore nelle caselle dorate. Ogni impronta resta, anche dopo una combinazione. Completa la sagoma per vincere lo schema.</li><li><strong>Ape volante:</strong> clicca o tocca l’ape per sparare bolle. X mira automaticamente. Servono 3 colpi; sono infiniti. Scacciarla ripulisce tutto il polline, dà 2 monete e una Fusa. Miele / B la scaccia subito.</li><li><strong>Polline:</strong> i grumi ambrati bloccano gli incastri. Si rompono anche con combinazioni adiacenti o Fusa. Non contano come gatti né come impronte. L’ape lascia fino a tre scariche per visita; in Senza fretta aspetta due pose fra le scariche.</li><li><strong>Ghiaccio / I:</strong> rallenta la caduta per 12 secondi; il timer continua.</li><li><strong>Bacchetta / W:</strong> tempo fermo. Scegli un gatto posato, poi una casella vuota. Frecce e spazio funzionano; W o Esc annulla gratis.</li></ul><p>Quando vola l’ape, i tocchi sulla griglia sparano: usa RUOTA / ↑ per ruotare. Il trascinamento continua a spostare i gatti. C cambia gruppo, F fa le fusa, P mette in pausa. In Sfida hai 3 minuti per missione.</p>',
    'Riprendi →',null,null,'','COME SI GIOCA');}
  function pause(){if(!started||game.over||dialog.open)return;show('pause','Un piccolo respiro.',
    '<p>Timer, ape e musica sono in pausa. Il viaggio riparte dalla stessa posizione.</p><p>Missione '+(game.stage+1)+' / 8 · <strong>'+game.mission.title+'</strong><br>Record '+(game.mode==='chill'?'Senza fretta':'Sfida')+': '+bests[game.mode].toLocaleString('it-IT')+' punti.</p>',
    'Riprendi →',null,requestRestart,'Nuovo viaggio','PAUSA');}
  function requestRestart(){show('confirm','Si riparte dal giardino?',
    '<p>Inizi un nuovo viaggio dalla prima missione, con monete azzerate e il kit iniziale. Il record resta salvato.</p>',
    'Nuova Sfida →',()=>start('flow'),()=>start('chill'),'Nuovo Senza fretta','NUOVO VIAGGIO');}
  function refreshShop(){
    setText('shop-coins',String(game.coins));
    for(const [item,product]of Object.entries(Micio.SHOP)){
      setText('stock-'+item,game.inventory[item]+' / '+product.max+' in borsa');const button=$('buy-'+item);button.disabled=!game.canBuy(item);
      button.textContent=game.inventory[item]>=product.max?'Borsa piena':item==='slow'&&game.mode==='chill'?'Solo Sfida':'Compra · '+product.price+' ◉';
      button.setAttribute('title',game.coins<product.price?'Servono '+product.price+' monete':product.name+' · '+product.price+' monete');
    }
  }
  function showResult(){
    const won=game.won,final=game.campaignWon,timed=game.endReason==='time';refresh();
    const nextMission=Micio.MISSIONS[game.stage+1],message=final?'Hai completato <strong>tutte e otto le missioni</strong>, raccolto impronte e superato gli scherzi dell’ape!':won?'Missione completata! La prossima è <strong>'+nextMission.title+'</strong>. Scegli i bonus da portare con te.':timed?'Il tempo è finito. Riprovi questa missione con le monete e i bonus che avevi all’inizio.':'Il nido è pieno. Riprovi questa missione con le monete e i bonus che avevi all’inizio.';
    show('result',final?'Che viaggio, piccoli mici!':won?'Una missione in tasca.':timed?'Tempo scaduto!':'Il nido è pieno.',
      '<p>'+message+'</p><p><strong>'+game.score.toLocaleString('it-IT')+' punti</strong> · '+game.totalSaved+' gattini salvati'+(game.mission.kind==='figure'?' · '+game.progress+'/'+game.goal+' impronte':'')+'</p>'+(won?'<p class="reward">+6 monete per la missione completata</p>':''),
      final?'Un altro viaggio →':won?'Missione '+(game.stage+2)+' →':'Riprova questa missione →',()=>{if(final)start(game.mode);else if(won){if(game.nextStage())beginStage();}else if(game.retryStage())beginStage();},
      null,'',final?'VITTORIA · 8 / 8':won?'MISSIONE '+(game.stage+1)+' / 8 COMPLETATA':'RIPROVA, PICCOLO ESPLORATORE');
    dialog.dataset.result=won?'win':'';
    if(won&&!final){$('shop').hidden=false;setText('shop-feedback','Puoi continuare anche senza acquistare.');refreshShop();}
    sound.fx(final?'final':won?'win':'lose');
  }
  for(const item of Object.keys(Micio.SHOP))$('buy-'+item).onclick=()=>{if(game.buy(item)){sound.fx('swap');setText('shop-feedback',Micio.SHOP[item].name+' in borsa!');refreshShop();refresh();}};
  $('help').onclick=help;$('pause').onclick=pause;$('restart').onclick=requestRestart;
  for(const action of ['swap','honey','slow','wand','purr'])$(action).onclick=()=>act(action);
  $('flying-bee').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();beePointerAt=performance.now();shoot();});
  $('flying-bee').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if((e.detail===0&&!e.pointerType)||performance.now()-beePointerAt>500)shoot();});
  $('sound').onclick=()=>{if(!sound.on&&!sound.enable()){notice('Audio non disponibile in questo browser.');return;}sound.on=!sound.on;sound.stop();if(sound.on)resumeSound();try{localStorage.setItem('micio-music',sound.on?'on':'off');}catch{}soundLabel();};
  function setPalette(name,save=true){palette=MicioDraw.setPalette(name);document.body.dataset.palette=palette;const label=palette==='neon'?'Fluorescenti':'Pastello';setText('palette-label',label);$('palette').setAttribute('aria-label','Colori '+label.toLowerCase()+': passa a '+(palette==='neon'?'pastello':'fluorescenti'));document.querySelectorAll('[data-colors]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.colors===palette)));if(save)try{localStorage.setItem('micio-palette',palette);}catch{}refresh();}
  $('palette').onclick=()=>setPalette(palette==='pastel'?'neon':'pastel');document.querySelectorAll('[data-colors]').forEach(el=>el.onclick=()=>setPalette(el.dataset.colors));
  function nativeScreen(){return document.fullscreenElement||document.webkitFullscreenElement;}
  function syncScreen(){const on=!!nativeScreen();$('fullscreen').setAttribute('aria-pressed',String(on));$('fullscreen').setAttribute('aria-label',on?'Mostra le barre del browser':'Nascondi le barre del browser');requestAnimationFrame(resize);}
  async function enterFullscreen(explain=true){if(screenBusy||nativeScreen())return;screenBusy=true;try{const root=document.documentElement,request=root.requestFullscreen||root.webkitRequestFullscreen;if(request)await request.call(root);else if(explain)notice('Vista a tutta pagina. Su iPhone usa Aggiungi alla schermata Home.');}catch{if(explain)notice('Il browser mantiene le barre. Il gioco resta a tutta pagina.');}finally{screenBusy=false;syncScreen();}}
  $('fullscreen').onclick=async()=>{if(screenBusy)return;if(!nativeScreen()){await enterFullscreen();return;}screenBusy=true;try{const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}catch{}finally{screenBusy=false;syncScreen();}};
  for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,syncScreen);
  document.querySelectorAll('[data-action]').forEach(button=>{const action=button.dataset.action;if(action==='left'||action==='right'){
    button.addEventListener('pointerdown',e=>{e.preventDefault();stopRepeat();act(action);button.setPointerCapture?.(e.pointerId);repeatDelay=setTimeout(()=>{repeatTimer=setInterval(()=>act(action),110);},250);});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,stopRepeat);
    button.addEventListener('click',e=>{if(e.detail===0)act(action);});
  }else button.onclick=()=>act(action);});
  const keys={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rotate',ArrowDown:'down',' ':'drop',c:'swap',b:'honey',i:'slow',w:'wand',f:'purr',x:'shoot'};
  document.addEventListener('keydown',e=>{
    const key=e.key.length===1?e.key.toLowerCase():e.key;
    if(key==='Escape'&&!dialog.open){if(wand){e.preventDefault();cancelWand();}else if(!nativeScreen())pause();return;}
    if(key==='p'&&!e.repeat){e.preventDefault();if(dialog.open){if(phase==='pause'||phase==='help')dismiss();}else pause();return;}
    if(dialog.open||paused)return;if(key==='Enter'&&wand){e.preventDefault();selectCell(cursor);return;}
    if(keys[key]){e.preventDefault();if(e.repeat&&['drop','rotate','swap','honey','slow','wand','purr','shoot'].includes(keys[key]))return;act(keys[key]);}
  });
  canvas.addEventListener('pointerdown',e=>{if(!started||paused||game.over||drag)return;e.preventDefault();canvas.setPointerCapture?.(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,moved:false,wand};});
  canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId||drag.wand)return;const threshold=MicioDraw.geometry(width,height).r*1.5,steps=Math.trunc((e.clientX-drag.lastX)/threshold);if(steps){for(let n=0;n<Math.min(9,Math.abs(steps));n++)act(steps>0?'right':'left');drag.lastX+=steps*threshold;drag.moved=true;}});
  canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const d=drag;drag=null;if(d.wand){if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<22){const r=canvas.getBoundingClientRect();selectCell(MicioDraw.hit(width,height,e.clientX-r.left,e.clientY-r.top));}return;}if(e.clientY-d.y>45&&Math.abs(e.clientX-d.x)<45)act('drop');else if(!d.moved&&Math.abs(e.clientY-d.y)<18){if(game.bee){const r=canvas.getBoundingClientRect();shoot({x:e.clientX-r.left,y:e.clientY-r.top});}else act('rotate');}});
  canvas.addEventListener('pointercancel',()=>{drag=null;});window.addEventListener('blur',()=>{drag=null;stopRepeat();});
  document.addEventListener('visibilitychange',()=>{stopRepeat();drag=null;last=0;fall=0;if(document.hidden){sound.stop();if(started&&!paused&&!game.over)pause();}});
  function resize(){const ratio=Math.min(devicePixelRatio||1,2);for(const [element,context]of [[canvas,ctx],[next,nc],[objective,oc]]){const r=element.getBoundingClientRect();element.width=Math.round(r.width*ratio);element.height=Math.round(r.height*ratio);context.setTransform(ratio,0,0,ratio,0,0);if(element===canvas){width=r.width;height=r.height;}}particles=[];effects=[];refresh();}
  window.addEventListener('resize',resize);if(window.visualViewport)window.visualViewport.addEventListener('resize',resize);
  function loop(t){
    requestAnimationFrame(loop);const elapsed=last?Math.max(0,t-last):0,dt=Math.min(100,elapsed);last=t;if(document.hidden)return;
    if(started&&!paused&&!wand&&!game.over){
      const wasSlow=game.slowMs>0;game.advance(elapsed);processEvents();refreshClock();if(wasSlow&&game.slowMs===0)refreshControls();
      if(game.over)showResult();else{sound.tick(game.mode);if(game.mode==='flow'){fall=Math.min(fall+elapsed,game.interval*6);while(fall>=game.interval&&!game.over){fall-=game.interval;burst(game.step());}}}
    }
    if(noticeUntil&&t>noticeUntil){noticeUntil=0;$('board-status').classList.remove('important');setText('board-status',defaultStatus());}
    if(particles.length){for(const p of particles){p.life-=dt/750;p.x+=p.vx*dt/1000;p.y+=p.vy*dt/1000;p.vy+=dt*.08;}particles=particles.filter(p=>p.life>0);needsDraw=true;}
    if(effects.length&&!paused&&!wand){for(const fx of effects)fx.age+=dt;effects=effects.filter(fx=>fx.age<fx.duration);needsDraw=true;}
    if(game.bee)updateBee();
    if(needsDraw){MicioDraw.board(ctx,width,height,game,particles,{wand,source,cursor,effects});needsDraw=false;}
  }
  soundLabel();let initialPalette='pastel';try{initialPalette=localStorage.getItem('micio-palette')||'pastel';}catch{}setPalette(initialPalette,false);syncScreen();
  resize();welcome();requestAnimationFrame(loop);
})();
