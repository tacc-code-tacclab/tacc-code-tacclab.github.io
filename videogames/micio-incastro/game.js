(() => {
  'use strict';
  const $=id=>document.getElementById(id), canvas=$('board'), ctx=canvas.getContext('2d'), next=$('next'), nc=next.getContext('2d');
  const game=new Micio.Game(), dialog=$('dialog'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused=true, needsDraw=true, last=0, fall=0, particles=[], toastUntil=0, repeatDelay=0, repeatTimer=0, modalAction=null, modalSecondary=null, width=0,height=0;
  let bests={chill:0,flow:0};try{const data=JSON.parse(localStorage.getItem('micio-records')||'{}');for(const m of ['chill','flow'])if(Number.isFinite(data[m])&&data[m]>=0)bests[m]=data[m];}catch{}
  const sound={ctx:null,on:false,next:0,index:0,voices:new Set(),
    enable(){if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;this.ctx=new C();}this.ctx.resume().catch(()=>{});return true;},
    note(note,duration=.8,volume=.04){if(!this.on||!this.ctx||this.voices.size>=8)return;const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=440*Math.pow(2,(note-69)/12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(c.destination);this.voices.add(o);o.onended=()=>{o.disconnect();g.disconnect();this.voices.delete(o);};o.start();o.stop(t+duration+.02);},
    stop(){for(const o of this.voices)o.stop();this.voices.clear();},
    tick(t){if(this.on&&t>this.next){this.next=t+3300;const notes=[57,64,69,61,64,73,69,64];this.note(notes[this.index++%notes.length],2.4,.022);}}
  };
  function stopRepeat(){clearTimeout(repeatDelay);clearInterval(repeatTimer);repeatDelay=repeatTimer=0;}
  function toast(text){$('toast').textContent=text;$('toast').classList.add('show');toastUntil=performance.now()+1900;}
  function refresh(){
    $('score').textContent=game.score.toLocaleString('it-IT');$('saved').textContent=game.saved;
    if(game.score>bests[game.mode]){bests[game.mode]=game.score;try{localStorage.setItem('micio-records',JSON.stringify(bests));}catch{}}
    $('best').textContent=bests[game.mode].toLocaleString('it-IT');$('level').textContent='NIDO '+String(game.level).padStart(2,'0');
    $('mode-label').textContent=game.mode==='chill'?'☾ SENZA FRETTA':'✦ SEGUI IL RITMO';
    $('charge-text').textContent=game.charge+' / 4';$('charge').setAttribute('aria-label','Fusa: '+game.charge+' su quattro');
    [...$('charge').children].forEach((el,i)=>el.classList.toggle('on',i<game.charge));$('purr').disabled=game.charge<4||game.over;
    $('swap').disabled=game.swapped||game.over;
    $('hint').textContent=game.mode==='chill'?'Tocca per ruotare · trascina per spostare · POSA per scendere.':'La sagoma mostra dove arriveranno · P per una pausa.';
    document.querySelectorAll('[data-mode]').forEach(b=>{const yes=b.dataset.mode===game.mode;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes));});
    const r=next.getBoundingClientRect();MicioDraw.preview(nc,r.width,r.height,game.queue);needsDraw=true;
  }
  function burst(result){if(!result)return;const g=MicioDraw.geometry(width,height);for(const clear of result.clears||[]){if(!reduced)for(const c of clear.cells){const p=MicioDraw.point(g,c.x,c.y);for(let n=0;n<2&&particles.length<100;n++)particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*75,vy:-25-Math.random()*55,size:2+Math.random()*3,color:c.color,life:1});}}
    if(result.clears?.length){toast(result.purr?'Frrrr… spazio per nuovi amici.':result.chain>1?'CATENA ×'+result.chain+' · Che bel gioco di squadra!':'Una famiglia felice! +'+result.clears.reduce((s,c)=>s+c.cells.length,0)+' gatti');sound.note(76,.5,.04);sound.note(81,1,.025);}else if(!result.moved)sound.note(57,.18,.025);
    if(game.over){paused=true;stopRepeat();sound.stop();show('Il nido è pieno.','Hai fatto felici <strong>'+game.saved+' gatti</strong> e raccolto <strong>'+game.score.toLocaleString('it-IT')+' punti</strong>.<p>Non è una sconfitta: è un buon momento per un nuovo nido. O per una pausa.</p>','Un altro nido →',()=>start(game.mode),null,'UN ULTIMO MIAO');}
    refresh();
  }
  function act(action){if(paused||game.over||dialog.open)return;let changed=false;if(action==='left')changed=game.move(-1);else if(action==='right')changed=game.move(1);else if(action==='rotate')changed=game.turn();else if(action==='swap')changed=game.swap();else if(action==='drop'){burst(game.drop());fall=0;}else if(action==='down'){burst(game.step());fall=0;}else if(action==='purr'){burst(game.purr());fall=0;}if(changed){sound.note(action==='rotate'?72:64,.065,.01);refresh();}needsDraw=true;}
  function start(mode){game.reset(mode);fall=0;particles=[];paused=false;needsDraw=true;refresh();toast(mode==='chill'?'Prenditi il tuo tempo. Il nido aspetta.':'Segui il ritmo. E ricordati di respirare.');}
  function show(title,copy,button,action,secondary=null,kicker='UN PICCOLO RESPIRO'){
    paused=true;stopRepeat();sound.stop();$('dialog-title').textContent=title;$('dialog-copy').innerHTML=copy;$('dialog-kicker').textContent=kicker;
    $('dialog-main').textContent=button;modalAction=action;modalSecondary=secondary;$('dialog-secondary').hidden=!secondary;
    if(!dialog.open)dialog.showModal();
  }
  function help(){show('Un incastro alla volta.','<ol><li><strong>Sposta e ruota</strong> i gruppi di gattini. La sagoma indica dove cadranno.</li><li>Unisci <strong>almeno sei vicini</strong> della stessa famiglia: escono dal nido e fanno spazio.</li><li>Le cadute possono creare <strong>catene</strong>. Quattro famiglie caricano le Fusa, che liberano le due file più basse.</li></ol><p>Telefono: trascina, tocca per ruotare, premi POSA. PC: frecce, spazio, C per cambiare gruppo, F per le Fusa.</p>','Ci sono →',()=>{paused=game.over;},null,'COME SI GIOCA');}
  $('dialog-main').onclick=()=>{const fn=modalAction;dialog.close();if(fn)fn();refresh();};
  $('dialog-secondary').onclick=()=>{const fn=modalSecondary;dialog.close();if(fn)fn();};
  dialog.addEventListener('close',()=>{paused=game.over;fall=0;stopRepeat();needsDraw=true;});
  $('pause').onclick=()=>{if(!dialog.open&&!game.over)show('Il nido può aspettare.','<p>I gattini restano qui. Riprendi quando vuoi.</p>','Riprendi →',()=>{paused=false;});};
  $('help').onclick=help;
  function requestStart(mode){if(game.moves===0){start(mode);return;}show('Prepariamo un nuovo nido?','<p>La partita attuale termina. Il tuo record rimane salvato su questo dispositivo.</p>','Sì, ricomincia',()=>start(mode),()=>{paused=game.over;});}
  $('restart').onclick=()=>requestStart(game.mode);
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{if(b.dataset.mode!==game.mode)requestStart(b.dataset.mode);});
  $('swap').onclick=()=>act('swap');$('purr').onclick=()=>act('purr');
  $('sound').onclick=()=>{if(!sound.on&&!sound.enable()){toast('Audio non disponibile in questo browser.');return;}sound.on=!sound.on;sound.next=0;if(!sound.on)sound.stop();$('sound').setAttribute('aria-pressed',String(sound.on));$('sound').setAttribute('aria-label',sound.on?'Disattiva suoni':'Attiva suoni');$('sound').querySelector('span').textContent=sound.on?'Audio on':'Audio off';};
  document.querySelectorAll('[data-action]').forEach(b=>{const action=b.dataset.action;if(action==='left'||action==='right'){b.addEventListener('pointerdown',e=>{e.preventDefault();stopRepeat();act(action);b.setPointerCapture?.(e.pointerId);repeatDelay=setTimeout(()=>{repeatTimer=setInterval(()=>act(action),120);},260);});b.addEventListener('pointerup',stopRepeat);b.addEventListener('pointercancel',stopRepeat);b.addEventListener('lostpointercapture',stopRepeat);b.addEventListener('click',e=>{if(e.detail===0)act(action);});}else b.onclick=()=>act(action);});
  const keys={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rotate',ArrowDown:'down',' ':'drop',c:'swap',f:'purr'};
  document.addEventListener('keydown',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;if(key==='p'&&!e.repeat){e.preventDefault();if(dialog.open){dialog.close();}else $('pause').click();return;}if(dialog.open||paused)return;if(keys[key]){e.preventDefault();if(e.repeat&&['drop','rotate','swap','purr'].includes(keys[key]))return;act(keys[key]);}});
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{if(paused||game.over||drag)return;e.preventDefault();canvas.setPointerCapture?.(e.pointerId);drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,moved:false};});
  canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const threshold=MicioDraw.geometry(width,height).r*1.5;const steps=Math.trunc((e.clientX-drag.lastX)/threshold);if(steps){for(let i=0;i<Math.min(9,Math.abs(steps));i++)act(steps>0?'right':'left');drag.lastX+=steps*threshold;drag.moved=true;}});
  canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const d=drag;drag=null;if(e.clientY-d.y>45&&Math.abs(e.clientX-d.x)<45)act('drop');else if(!d.moved&&Math.abs(e.clientY-d.y)<18)act('rotate');});
  canvas.addEventListener('pointercancel',()=>{drag=null;});
  window.addEventListener('blur',()=>{drag=null;stopRepeat();});
  document.addEventListener('visibilitychange',()=>{stopRepeat();drag=null;last=0;fall=0;if(document.hidden){sound.stop();if(!paused&&!game.over)$('pause').click();}});
  function resize(){const ratio=Math.min(devicePixelRatio||1,2);for(const [c,cx]of [[canvas,ctx],[next,nc]]){const r=c.getBoundingClientRect();c.width=Math.round(r.width*ratio);c.height=Math.round(r.height*ratio);cx.setTransform(ratio,0,0,ratio,0,0);if(c===canvas){width=r.width;height=r.height;}}particles=[];refresh();}
  window.addEventListener('resize',resize);if(window.visualViewport)visualViewport.addEventListener('resize',resize);
  function loop(t){requestAnimationFrame(loop);const dt=last?Math.min(100,t-last):0;last=t;if(document.hidden)return;if(!paused&&!game.over){sound.tick(t);if(game.mode==='flow'){fall+=dt;if(fall>=game.interval){fall=0;burst(game.step());}}}if(toastUntil&&t>toastUntil){$('toast').classList.remove('show');toastUntil=0;}if(particles.length){for(const p of particles){p.life-=dt/750;p.x+=p.vx*dt/1000;p.y+=p.vy*dt/1000;p.vy+=dt*.08;}particles=particles.filter(p=>p.life>0);needsDraw=true;}if(needsDraw){MicioDraw.board(ctx,width,height,game,particles);needsDraw=false;}}
  resize();help();requestAnimationFrame(loop);
})();
