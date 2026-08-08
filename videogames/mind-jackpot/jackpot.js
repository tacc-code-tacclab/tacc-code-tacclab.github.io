(function(){
  "use strict";
  var VERSION="mind-jackpot-1.0.0",ROUNDS=60,SYMBOL_COUNT=6,CURRENT_KEY="mind_jackpot_current_v1",DB_NAME="mind-jackpot-research",DB_STORE="sessions";
  var symbols=[
    {id:"star",name:"Nova",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="m50 7 11 30 32 1-25 19 9 31-27-18-27 18 9-31L7 38l32-1Z" fill="#ffd347" stroke="#fff2a2" stroke-width="3"/></svg>'},
    {id:"gem",name:"Gem",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 30 35 11h30l17 19-32 58Z" fill="#54e8ff" stroke="#d9fbff" stroke-width="3"/><path d="m18 30 32 13 32-13M35 11l15 32 15-32M50 43v45" fill="none" stroke="#246ea7" stroke-width="3"/></svg>'},
    {id:"moon",name:"Moon",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M72 75A38 38 0 1 1 64 17a30 30 0 0 0 8 58Z" fill="#be8dff" stroke="#eee0ff" stroke-width="3"/><circle cx="29" cy="36" r="4" fill="#8052ba"/><circle cx="40" cy="68" r="6" fill="#8052ba"/></svg>'},
    {id:"flame",name:"Flame",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M52 8c8 20-6 25 7 39 4-12 13-12 14-24 24 29 16 66-23 68C11 88 17 52 31 38c1 15 8 18 12 20-7-25 8-31 9-50Z" fill="#ff5d5d" stroke="#ffb33f" stroke-width="4"/><path d="M50 52c14 12 9 29 0 34-13-5-15-23 0-34Z" fill="#ffe16a"/></svg>'},
    {id:"eye",name:"Oracle",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M7 50s15-28 43-28 43 28 43 28-15 28-43 28S7 50 7 50Z" fill="#ff63c9" stroke="#ffd9f3" stroke-width="3"/><circle cx="50" cy="50" r="19" fill="#422071"/><circle cx="50" cy="50" r="9" fill="#48e7ff"/><circle cx="54" cy="45" r="3" fill="#fff"/></svg>'},
    {id:"crown",name:"Crown",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="m14 30 20 17 16-28 16 28 20-17-9 48H23Z" fill="#ffd347" stroke="#fff0a1" stroke-width="3"/><path d="M23 65h54M27 78h46" stroke="#b87516" stroke-width="5"/><circle cx="14" cy="27" r="6" fill="#ff4bc5"/><circle cx="50" cy="16" r="6" fill="#48e7ff"/><circle cx="86" cy="27" r="6" fill="#ff4bc5"/></svg>'}
  ];
  var $=function(id){return document.getElementById(id);},screenIds=["intro-screen","consent-screen","ready-screen","game-screen","break-screen","pause-screen","results-screen"];
  var session=null,roundIndex=0,picks=[],confidence=50,roundStarted=0,locked=false,audioOn=true,audioContext=null,timers=[],intervals=[];

  function show(id){screenIds.forEach(function(x){$(x).hidden=x!==id;});window.scrollTo({top:0,behavior:"smooth"});}
  function now(){return new Date().toISOString();}
  function bytesHex(a){return Array.prototype.map.call(a,function(b){return b.toString(16).padStart(2,"0");}).join("");}
  function randomInt(max){var a=new Uint32Array(1),limit=Math.floor(4294967296/max)*max;do{crypto.getRandomValues(a);}while(a[0]>=limit);return a[0]%max;}
  function randomId(){return "MJ-"+bytesHex(crypto.getRandomValues(new Uint8Array(8))).toUpperCase();}
  function makeDeck(){var deck=[];for(var r=0;r<ROUNDS;r++){var row=[];for(var p=0;p<3;p++)row.push(symbols[randomInt(SYMBOL_COUNT)].id);deck.push(row);}return deck;}
  function payload(s){return [s.protocol.version,s.participant_id,s.deck_salt,s.target_deck.map(function(x){return x.join(".");}).join("|")].join("::");}
  function sha256(text){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(text)).then(function(b){return bytesHex(new Uint8Array(b));});}
  function symbol(id){return symbols.filter(function(s){return s.id===id;})[0];}
  function formatCoins(n){return "$"+Number(n).toLocaleString("en-US");}
  function cancelTimers(){timers.forEach(clearTimeout);intervals.forEach(clearInterval);timers=[];intervals=[];}
  function later(fn,ms){var id=setTimeout(fn,ms);timers.push(id);return id;}

  function persistCurrent(){if(session)localStorage.setItem(CURRENT_KEY,JSON.stringify(session));}
  function loadCurrent(){try{return JSON.parse(localStorage.getItem(CURRENT_KEY));}catch(e){return null;}}
  function clearCurrent(){localStorage.removeItem(CURRENT_KEY);session=null;}
  function openDB(){return new Promise(function(resolve,reject){var req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains(DB_STORE))req.result.createObjectStore(DB_STORE,{keyPath:"participant_id"});};req.onsuccess=function(){resolve(req.result);};req.onerror=function(){reject(req.error);};});}
  function archiveSession(s){return openDB().then(function(db){return new Promise(function(resolve,reject){var tx=db.transaction(DB_STORE,"readwrite");tx.objectStore(DB_STORE).put(JSON.parse(JSON.stringify(s)));tx.oncomplete=function(){db.close();resolve();};tx.onerror=function(){reject(tx.error);};});});}
  function getArchive(){return openDB().then(function(db){return new Promise(function(resolve,reject){var req=db.transaction(DB_STORE,"readonly").objectStore(DB_STORE).getAll();req.onsuccess=function(){db.close();resolve(req.result||[]);};req.onerror=function(){reject(req.error);};});});}
  function updateArchiveCount(){getArchive().then(function(rows){$("archive-count").textContent=rows.length+" completed anonymous session"+(rows.length===1?"":"s")+" stored in this browser";$("export-archive").disabled=!rows.length;}).catch(function(){$("archive-count").textContent="Local archive unavailable in this browser";});}

  function initAudio(){if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==="suspended")audioContext.resume();}
  function tone(freq,duration,type,volume,delay){if(!audioOn)return;try{initAudio();var t=audioContext.currentTime+(delay||0),o=audioContext.createOscillator(),g=audioContext.createGain();o.type=type||"square";o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(volume||.06,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+duration+.02);}catch(e){}}
  function clickSound(){tone(420,.07,"square",.035);tone(620,.06,"square",.025,.035);}
  function stopSound(index){tone(500+index*110,.1,"square",.065);tone(250+index*55,.12,"triangle",.035,.025);}
  function winSound(matches){if(matches===0){tone(150,.16,"sawtooth",.035);return;}var notes=matches===3?[523,659,784,1047]:matches===2?[440,554,659]:[392,523];notes.forEach(function(n,i){tone(n,.18,"square",.055,i*.08);});}

  function symbolButton(s,i){return '<button class="symbol-button" type="button" data-symbol="'+s.id+'" aria-label="Choose '+s.name+' for reel '+(picks.length+1)+'"><span>'+s.svg+'</span><span>'+(i+1)+' · '+s.name+'</span></button>';}
  function renderSymbols(){$("symbol-grid").innerHTML=symbols.map(symbolButton).join("");Array.prototype.forEach.call($("symbol-grid").querySelectorAll("button"),function(b){b.addEventListener("click",function(){choose(b.dataset.symbol);});});}
  function setReel(index,id){$("reel-"+index).innerHTML=id==="?"?"?":symbol(id).svg;}
  function setPick(index,id){$("pick-"+index).innerHTML=id?symbol(id).svg:"?";}
  function lockControls(value){Array.prototype.forEach.call($("symbol-grid").querySelectorAll("button"),function(b){b.disabled=value;});Array.prototype.forEach.call(document.querySelectorAll(".confidence-control button"),function(b){b.disabled=value;});}

  function formData(form){var o={};new FormData(form).forEach(function(v,k){o[k]=v;});["adult","understood","consent","storage"].forEach(function(k){o[k]=form.elements[k].checked;});return o;}
  function createSession(participant){
    session={schema:"mind-jackpot-session-1.0",protocol:{version:VERSION,total_rounds:ROUNDS,reels_per_round:3,symbols_per_reel:SYMBOL_COUNT,chance_per_reel:1/6,exact_jackpot_probability:1/216,primary_outcome:"total position-specific symbol matches over 180 predictions",stopping_rule:"60 completed rounds",target_generation:"180 independent uniform cryptographic draws before round 1",feedback:"immediate",rewards:{zero:0,one:10000,two:1000000,three:100000000},reward_unit:"fictional Mind Coins; no monetary value"},participant_id:randomId(),created_at:now(),completed_at:null,status:"preparing",participant:participant,deck_salt:bytesHex(crypto.getRandomValues(new Uint8Array(16))),target_deck:makeDeck(),deck_commitment:null,commitment_created_at:null,rounds:[],balance:0,events:[{type:"session_created",at:now()}],client:{language:navigator.language||null,screen_bucket:screen.width<600?"small":screen.width<1000?"medium":"large",touch:navigator.maxTouchPoints>0},integrity:{commitment_verified:null,complete:false}};
    return sha256(payload(session)).then(function(hash){session.deck_commitment=hash;session.commitment_created_at=now();session.status="committed";persistCurrent();return session;});
  }

  function prepareReady(){$("hash-value").textContent=session.deck_commitment;$("start-button").disabled=false;show("ready-screen");}
  function beginGame(){session.status="in_progress";session.events.push({type:"game_started",at:now()});persistCurrent();roundIndex=session.rounds.length;startRound();}
  function startRound(){
    cancelTimers();locked=false;picks=[];confidence=50;roundIndex=session.rounds.length;
    if(roundIndex>=ROUNDS){finish();return;}
    $("round-number").textContent=String(roundIndex+1).padStart(2,"0")+" / "+ROUNDS;$("balance-value").textContent=formatCoins(session.balance);$("progress-fill").style.width=(roundIndex/ROUNDS*100)+"%";$("position-number").textContent="1";$("machine-message").textContent="PREDICT THE SEALED OUTCOME";$("win-amount").textContent="$0";
    for(var i=0;i<3;i++){setReel(i,"?");setPick(i,null);}document.querySelectorAll(".confidence-control button").forEach(function(b){b.classList.toggle("active",b.dataset.confidence==="50");});lockControls(false);$("slot-machine").classList.remove("big-win");show("game-screen");roundStarted=performance.now();
  }
  function choose(id){if(locked||picks.length>=3)return;initAudio();clickSound();picks.push(id);setPick(picks.length-1,id);$("position-number").textContent=String(Math.min(3,picks.length+1));if(picks.length===3){locked=true;lockControls(true);spin();}}
  function spin(){
    var target=session.target_deck[roundIndex],spinStart=performance.now(),choiceLockedAt=now();$("machine-message").textContent="READING THE SEALED FUTURE…";$("reels").classList.add("spinning");
    var cycles=[];for(var r=0;r<3;r++){(function(index){cycles[index]=setInterval(function(){setReel(index,symbols[randomInt(SYMBOL_COUNT)].id);tone(95+index*18,.025,"square",.012);},70);intervals.push(cycles[index]);later(function(){clearInterval(cycles[index]);setReel(index,target[index]);stopSound(index);},430+index*260);})(r);}
    later(function(){$("reels").classList.remove("spinning");resolveRound(target,Math.round(spinStart-roundStarted),choiceLockedAt);},1030);
  }
  function rewardFor(m){return m===3?100000000:m===2?1000000:m===1?10000:0;}
  function resolveRound(target,responseMs,choiceLockedAt){
    var matches=picks.map(function(x,i){return x===target[i];}),count=matches.filter(Boolean).length,reward=rewardFor(count);
    var record={round_index:roundIndex+1,prediction:picks.slice(),target:target.slice(),position_matches:matches,match_count:count,confidence:confidence,response_ms:responseMs,prediction_locked_at:choiceLockedAt,revealed_at:now(),reward:reward,balance_after:session.balance+reward};
    session.balance+=reward;session.rounds.push(record);persistCurrent();$("balance-value").textContent=formatCoins(session.balance);$("win-amount").textContent=reward?"+ "+formatCoins(reward):"NO MATCH";
    $("machine-message").textContent=count===3?"IMPOSSIBLE? EXACT JACKPOT!":count===2?"TWO REELS — MILLION HIT!":count===1?"ONE REEL MATCHED":"THE FUTURE SLIPPED AWAY";winSound(count);if(count>0)coins(count===3?80:count===2?35:12);if(count>=2)$("slot-machine").classList.add("big-win");
    later(nextRound,count===3?2600:count===2?1900:1400);
  }
  function coins(n){var layer=$("coin-layer");layer.innerHTML="";for(var i=0;i<n;i++){var c=document.createElement("i");c.className="coin";c.textContent="$";c.style.setProperty("--left",Math.random()*100+"vw");c.style.setProperty("--delay",Math.random()*.55+"s");c.style.setProperty("--duration",(1.2+Math.random()*1.1)+"s");layer.appendChild(c);}later(function(){layer.innerHTML="";},3000);}
  function nextRound(){roundIndex=session.rounds.length;if(roundIndex>=ROUNDS){finish();return;}if(roundIndex===20||roundIndex===40){session.events.push({type:"break",after_round:roundIndex,at:now()});persistCurrent();$("break-text").textContent=roundIndex+" of "+ROUNDS+" rounds complete. Take one breath; your sealed sequence is waiting.";show("break-screen");return;}startRound();}
  function verify(){return sha256(payload(session)).then(function(h){return h===session.deck_commitment;});}
  function finish(){cancelTimers();session.status="complete";session.completed_at=now();session.integrity.complete=session.rounds.length===ROUNDS;verify().then(function(ok){session.integrity.commitment_verified=ok;session.events.push({type:"session_completed",at:now()});persistCurrent();return archiveSession(session).catch(function(){session.events.push({type:"archive_failed",at:now()});persistCurrent();});}).then(showResults);}
  function showResults(){var matches=session.rounds.reduce(function(a,r){return a+r.match_count;},0),jackpots=session.rounds.filter(function(r){return r.match_count===3;}).length,mean=session.rounds.length?session.rounds.reduce(function(a,r){return a+r.confidence;},0)/session.rounds.length:0;$("final-balance").textContent=formatCoins(session.balance);$("match-result").textContent=matches+" / "+(session.rounds.length*3);$("jackpot-result").textContent=String(jackpots);$("confidence-result").textContent=Math.round(mean)+" / 100";$("verified-result").textContent=session.integrity.commitment_verified?"YES":"FAILED";show("results-screen");updateArchiveCount();}

  function exportJSON(data,name){var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
  function exportSession(partial){var out=JSON.parse(JSON.stringify(session));out.exported_at=now();out.export_type=partial?"partial_blinded":"complete_unblinded";if(partial&&out.status!=="complete"){out.target_deck=out.target_deck.slice(0,out.rounds.length);out.deck_salt=null;out.note="Future outcomes and commitment salt are withheld to preserve blinding.";}exportJSON(out,"MIND_JACKPOT_"+out.participant_id+(partial?"_partial":"_complete")+".json");session.events.push({type:partial?"partial_download":"complete_download",at:now()});persistCurrent();}
  function pause(){if(!session||session.status!=="in_progress")return;cancelTimers();session.status="paused";session.events.push({type:"paused",at:now(),after_round:session.rounds.length});persistCurrent();show("pause-screen");}
  function resume(){session.status="in_progress";session.events.push({type:"resumed",at:now()});persistCurrent();roundIndex=session.rounds.length;startRound();}
  function leaveForLater(){session.status="paused";persistCurrent();show("intro-screen");showResume();}
  function showResume(){var saved=loadCurrent();if(saved&&["committed","in_progress","paused"].indexOf(saved.status)>=0){$("resume-banner").hidden=false;$("resume-copy").textContent=saved.rounds.length+" of "+ROUNDS+" rounds completed · "+saved.participant_id;}else $("resume-banner").hidden=true;}
  function resumeSaved(){var saved=loadCurrent();if(!saved)return;session=saved;if(session.status==="committed"){prepareReady();return;}resume();}
  function newParticipant(){clearCurrent();location.reload();}

  function init(){
    renderSymbols();updateArchiveCount();showResume();
    $("enter-button").addEventListener("click",function(){show("consent-screen");});$("how-button").addEventListener("click",function(){$("how-it-works").scrollIntoView({behavior:"smooth"});});$("consent-back").addEventListener("click",function(){show("intro-screen");});
    $("consent-form").addEventListener("submit",function(e){e.preventDefault();var f=e.currentTarget;if(!f.checkValidity()){$("form-error").hidden=false;f.reportValidity();return;}$("form-error").hidden=true;initAudio();if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();show("ready-screen");createSession(formData(f)).then(prepareReady).catch(function(){alert("Secure browser randomness is unavailable. Please open the HTTPS version in a current browser.");show("consent-screen");});});
    $("copy-hash").addEventListener("click",function(){if(navigator.clipboard)navigator.clipboard.writeText(session.deck_commitment);this.textContent="COPIED";});$("start-button").addEventListener("click",beginGame);$("continue-button").addEventListener("click",startRound);$("pause-button").addEventListener("click",pause);$("resume-button").addEventListener("click",resume);$("partial-button").addEventListener("click",function(){exportSession(true);});$("quit-button").addEventListener("click",leaveForLater);
    $("resume-local").addEventListener("click",resumeSaved);$("discard-local").addEventListener("click",function(){if(confirm("Delete the unfinished local session?")){clearCurrent();showResume();}});$("download-button").addEventListener("click",function(){exportSession(false);});$("not-now-button").addEventListener("click",function(){session.events.push({type:"download_declined",at:now()});persistCurrent();});$("new-session-button").addEventListener("click",newParticipant);
    $("export-archive").addEventListener("click",function(){getArchive().then(function(rows){exportJSON({schema:"mind-jackpot-local-archive-1.0",exported_at:now(),session_count:rows.length,sessions:rows},"MIND_JACKPOT_local_archive.json");});});
    document.querySelectorAll(".confidence-control button").forEach(function(b){b.addEventListener("click",function(){if(locked)return;confidence=Number(b.dataset.confidence);document.querySelectorAll(".confidence-control button").forEach(function(x){x.classList.toggle("active",x===b);});clickSound();});});
    $("sound-button").addEventListener("click",function(){audioOn=!audioOn;this.textContent=audioOn?"♪ ON":"♪ OFF";this.setAttribute("aria-pressed",String(audioOn));if(audioOn)initAudio();});$("fullscreen-button").addEventListener("click",function(){if(!document.fullscreenElement){document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();}else document.exitFullscreen&&document.exitFullscreen();});
    document.addEventListener("keydown",function(e){if($("game-screen").hidden||locked)return;var n=Number(e.key);if(n>=1&&n<=6){e.preventDefault();choose(symbols[n-1].id);}if(e.key==="Escape")pause();});window.addEventListener("pagehide",persistCurrent);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
