(function(){
  "use strict";
  var VERSION="mind-jackpot-1.2.0",PRIMARY_ROUNDS=40,BONUS_ROUNDS=20,ROUNDS=60,SYMBOL_COUNT=6,CURRENT_KEY="mind_jackpot_current_v1",DB_NAME="mind-jackpot-research",DB_STORE="sessions";
  var SYNC_URL="https://mdvqnqtsexngmyezhwbh.supabase.co/functions/v1/mind-jackpot-ingest";
  var SYNC_KEY="sb_publishable_jB8oBErnX6AmFNva3f0S6g_RIkWHQcZ";
  var symbols=[
    {id:"star",name:"Nova",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="m50 7 11 30 32 1-25 19 9 31-27-18-27 18 9-31L7 38l32-1Z" fill="#ffd347" stroke="#fff2a2" stroke-width="3"/></svg>'},
    {id:"gem",name:"Gem",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 30 35 11h30l17 19-32 58Z" fill="#54e8ff" stroke="#d9fbff" stroke-width="3"/><path d="m18 30 32 13 32-13M35 11l15 32 15-32M50 43v45" fill="none" stroke="#246ea7" stroke-width="3"/></svg>'},
    {id:"moon",name:"Moon",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M72 75A38 38 0 1 1 64 17a30 30 0 0 0 8 58Z" fill="#be8dff" stroke="#eee0ff" stroke-width="3"/><circle cx="29" cy="36" r="4" fill="#8052ba"/><circle cx="40" cy="68" r="6" fill="#8052ba"/></svg>'},
    {id:"flame",name:"Flame",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M52 8c8 20-6 25 7 39 4-12 13-12 14-24 24 29 16 66-23 68C11 88 17 52 31 38c1 15 8 18 12 20-7-25 8-31 9-50Z" fill="#ff5d5d" stroke="#ffb33f" stroke-width="4"/><path d="M50 52c14 12 9 29 0 34-13-5-15-23 0-34Z" fill="#ffe16a"/></svg>'},
    {id:"eye",name:"Oracle",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M7 50s15-28 43-28 43 28 43 28-15 28-43 28S7 50 7 50Z" fill="#ff63c9" stroke="#ffd9f3" stroke-width="3"/><circle cx="50" cy="50" r="19" fill="#422071"/><circle cx="50" cy="50" r="9" fill="#48e7ff"/><circle cx="54" cy="45" r="3" fill="#fff"/></svg>'},
    {id:"crown",name:"Crown",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="m14 30 20 17 16-28 16 28 20-17-9 48H23Z" fill="#ffd347" stroke="#fff0a1" stroke-width="3"/><path d="M23 65h54M27 78h46" stroke="#b87516" stroke-width="5"/><circle cx="14" cy="27" r="6" fill="#ff4bc5"/><circle cx="50" cy="16" r="6" fill="#48e7ff"/><circle cx="86" cy="27" r="6" fill="#ff4bc5"/></svg>'}
  ];
  var $=function(id){return document.getElementById(id);},screenIds=["intro-screen","consent-screen","ready-screen","game-screen","break-screen","bonus-screen","pause-screen","results-screen"];
  var session=null,roundIndex=0,picks=[],roundStarted=0,locked=false,audioOn=true,audioContext=null,timers=[],intervals=[],syncInFlight=false,syncPending=false;

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
  function updateArchiveCount(){getArchive().then(function(rows){$("archive-count").textContent=rows.length+" completed pseudonymous session"+(rows.length===1?"":"s")+" stored in this browser";$("export-archive").disabled=!rows.length;}).catch(function(){$("archive-count").textContent="Local archive unavailable in this browser";});}

  function setSyncStatus(text,state){Array.prototype.forEach.call(document.querySelectorAll("[data-sync-status]"),function(el){el.textContent=text;el.dataset.state=state||"";});}
  function ensureSyncToken(){if(session&&!/^[a-f0-9]{64}$/.test(session.sync_token||"")){session.sync_token=bytesHex(crypto.getRandomValues(new Uint8Array(32)));persistCurrent();}}
  function syncSession(reason,keepalive){
    if(!session)return Promise.resolve(false);ensureSyncToken();
    if(navigator.onLine===false){setSyncStatus("Saved locally · waiting for internet","pending");return Promise.resolve(false);}
    if(syncInFlight){syncPending=true;return Promise.resolve(false);}
    syncInFlight=true;setSyncStatus("Saving research data…","syncing");
    return fetch(SYNC_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":SYNC_KEY},body:JSON.stringify({action:"sync_session",reason:reason||"update",session:session}),cache:"no-store",keepalive:!!keepalive})
      .then(function(response){return response.json().catch(function(){return {};}).then(function(data){if(!response.ok||!data.ok)throw new Error(data.error||("HTTP "+response.status));return data;});})
      .then(function(data){session.sync={state:"saved",last_saved_at:data.received_at||now(),rounds_received:data.rounds_received};persistCurrent();setSyncStatus("Saved securely · "+data.rounds_received+" / "+ROUNDS+" rounds","saved");return true;})
      .catch(function(){if(session){session.sync={state:"pending",last_attempt_at:now()};persistCurrent();}setSyncStatus("Saved locally · automatic retry pending","pending");return false;})
      .then(function(result){syncInFlight=false;if(syncPending){syncPending=false;later(function(){syncSession("queued_update");},150);}return result;});
  }

  function initAudio(){if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==="suspended")audioContext.resume();}
  function tone(freq,duration,type,volume,delay){if(!audioOn)return;try{initAudio();var t=audioContext.currentTime+(delay||0),o=audioContext.createOscillator(),g=audioContext.createGain();o.type=type||"square";o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(volume||.06,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+duration+.02);}catch(e){}}
  function clickSound(){tone(420,.07,"square",.035);tone(620,.06,"square",.025,.035);}
  function stopSound(index){tone(500+index*110,.1,"square",.065);tone(250+index*55,.12,"triangle",.035,.025);}
  function winSound(matches){
    if(matches===0){tone(150,.16,"sawtooth",.035);tone(110,.2,"triangle",.02,.05);return;}
    var notes=matches===3?[392,523,659,784,1047,1319]:matches===2?[330,440,554,659,880]:[392,523,659];
    notes.forEach(function(n,i){tone(n,.2,"square",.065,i*.075);tone(n/2,.24,"triangle",.035,i*.075);});
    if(matches>=2){[0,.12,.24,.36].forEach(function(delay,i){tone(i%2?1568:2093,.055,"sine",.035,delay);});}
    if(matches===3){tone(131,.7,"sawtooth",.04,0);tone(523,.7,"triangle",.05,.42);tone(659,.7,"triangle",.05,.42);tone(784,.7,"triangle",.05,.42);}
  }
  function moneySound(matches){
    if(!audioOn||matches===0)return;
    var count=matches===3?42:matches===2?20:4,spacing=matches===3?.045:matches===2?.06:.09;
    for(var i=0;i<count;i++){
      var delay=i*spacing,freq=(i%3===0?1760:i%3===1?2217:2637)+(i%5)*19;
      tone(freq,matches===3?.085:.055,"sine",matches===1?.022:.038,delay);
      if(matches===3&&i%4===0)tone(freq/2,.11,"triangle",.025,delay+.018);
    }
  }
  function announceWin(matches,reward){
    if(!audioOn||matches<2||!("speechSynthesis" in window))return;
    try{
      window.speechSynthesis.cancel();
      var message=matches===3?"Mega jackpot! You won ten million Mind Coins!":"Amazing! You won one million Mind Coins!";
      var utterance=new SpeechSynthesisUtterance(message);utterance.lang="en-US";utterance.rate=matches===3?1.03:1.08;utterance.pitch=matches===3?1.22:1.12;utterance.volume=.95;window.speechSynthesis.speak(utterance);
    }catch(e){}
  }

  function symbolButton(s,i){return '<button class="symbol-button" type="button" data-symbol="'+s.id+'" aria-label="Choose '+s.name+' for reel '+(picks.length+1)+'"><span>'+s.svg+'</span><span>'+(i+1)+' · '+s.name+'</span></button>';}
  function renderSymbols(){$("symbol-grid").innerHTML=symbols.map(symbolButton).join("");Array.prototype.forEach.call($("symbol-grid").querySelectorAll("button"),function(b){b.addEventListener("click",function(){choose(b.dataset.symbol);});});}
  function setReel(index,id){$("reel-"+index).innerHTML=id==="?"?"?":symbol(id).svg;}
  function setPick(index,id){$("pick-"+index).innerHTML=id?symbol(id).svg:"?";}
  function updatePickControls(){
    var full=picks.length===3,next=Math.min(3,picks.length+1);
    Array.prototype.forEach.call($("symbol-grid").querySelectorAll("button"),function(b){b.disabled=locked||full;var s=symbol(b.dataset.symbol);b.setAttribute("aria-label","Choose "+s.name+" for reel "+next);});
    $("undo-pick").disabled=locked||picks.length===0;$("clear-picks").disabled=locked||picks.length===0;$("spin-button").disabled=locked||!full;
    $("position-number").textContent=full?"✓":String(picks.length+1);
  }
  function lockControls(value){Array.prototype.forEach.call($("symbol-grid").querySelectorAll("button"),function(b){b.disabled=value;});locked=value;updatePickControls();}

  function formData(form){var o={};new FormData(form).forEach(function(v,k){o[k]=v;});["adult","understood","consent","storage","solo_decisions"].forEach(function(k){o[k]=form.elements[k].checked;});return o;}
  function createSession(participant){
    var nickname=String(participant.research_nickname||"").trim(),normalized=nickname.toLowerCase();participant.research_nickname=nickname;
    return sha256("mind-jackpot-longitudinal-v1|"+normalized).then(function(nicknameHash){
      participant.nickname_hash_sha256=nicknameHash;
      session={schema:"mind-jackpot-session-1.2",protocol:{version:VERSION,total_rounds:ROUNDS,primary_rounds:PRIMARY_ROUNDS,optional_bonus_rounds:BONUS_ROUNDS,reels_per_round:3,symbols_per_reel:SYMBOL_COUNT,chance_per_reel:1/6,exact_jackpot_probability:1/216,primary_outcome:"total position-specific symbol matches in rounds 1-40 (120 predictions)",stopping_rule:"40 prespecified primary rounds; optional rounds 41-60 analysed separately",target_generation:"180 independent uniform cryptographic draws before round 1",feedback:"immediate",rewards:{zero:0,one:10000,two:1000000,three:10000000},reward_unit:"fictional Mind Coins; no monetary value",longitudinal_plan:"Link repeated sessions by pseudonymous nickname hash; identify high performers in discovery data and test them in independent future sessions."},participant_id:randomId(),longitudinal_id:"MJ-L-"+nicknameHash.slice(0,20).toUpperCase(),sync_token:bytesHex(crypto.getRandomValues(new Uint8Array(32))),created_at:now(),completed_at:null,primary_completed_at:null,bonus_opt_in:null,finish_mode:null,status:"preparing",participant:participant,deck_salt:bytesHex(crypto.getRandomValues(new Uint8Array(16))),target_deck:makeDeck(),deck_commitment:null,commitment_created_at:null,rounds:[],balance:0,events:[{type:"session_created",at:now()}],client:{language:navigator.language||null,screen_bucket:screen.width<600?"small":screen.width<1000?"medium":"large",touch:navigator.maxTouchPoints>0},integrity:{commitment_verified:null,complete:false},sync:{state:"pending"}};
      return sha256(payload(session));
    }).then(function(hash){session.deck_commitment=hash;session.commitment_created_at=now();session.status="committed";persistCurrent();syncSession("session_committed");return session;});
  }

  function prepareReady(){$("hash-value").textContent=session.deck_commitment;$("start-button").disabled=false;show("ready-screen");}
  function beginGame(){session.status="in_progress";session.events.push({type:"game_started",at:now()});persistCurrent();syncSession("game_started");roundIndex=session.rounds.length;startRound();}
  function startRound(){
    cancelTimers();locked=false;picks=[];roundIndex=session.rounds.length;
    if(roundIndex>=ROUNDS){finish();return;}
    var phase=roundIndex>=PRIMARY_ROUNDS?"BONUS ROUND":roundIndex>=30?"FINAL PRIMARY PHASE":roundIndex>=20?"FOCUS PHASE":roundIndex>=10?"RHYTHM PHASE":"WARM-UP PHASE";
    $("game-screen").dataset.stage=roundIndex>=PRIMARY_ROUNDS?"bonus":String(Math.floor(roundIndex/10)+1);$("stage-label").textContent=phase;$("round-number").textContent=String(roundIndex+1).padStart(2,"0")+" / "+ROUNDS;$("balance-value").textContent=formatCoins(session.balance);$("progress-fill").style.width=(roundIndex/ROUNDS*100)+"%";$("position-number").textContent="1";$("machine-message").textContent="PREDICT THE SEALED OUTCOME";$("win-amount").textContent="$0";$("win-banner").hidden=true;
    for(var i=0;i<3;i++){setReel(i,"?");setPick(i,null);}lockControls(false);updatePickControls();$("slot-machine").classList.remove("big-win");show("game-screen");roundStarted=performance.now();
  }
  function choose(id){if(locked||picks.length>=3)return;initAudio();clickSound();picks.push(id);setPick(picks.length-1,id);updatePickControls();if(picks.length===3){$("machine-message").textContent="PREDICTION READY — PRESS SPIN";}}
  function undoPick(){if(locked||!picks.length)return;clickSound();picks.pop();for(var i=0;i<3;i++)setPick(i,picks[i]||null);$("machine-message").textContent="PREDICT THE SEALED OUTCOME";updatePickControls();}
  function clearPicks(){if(locked||!picks.length)return;clickSound();picks=[];for(var i=0;i<3;i++)setPick(i,null);$("machine-message").textContent="PREDICT THE SEALED OUTCOME";updatePickControls();}
  function confirmSpin(){if(locked||picks.length!==3)return;initAudio();tone(784,.08,"square",.05);lockControls(true);spin();}
  function spin(){
    var target=session.target_deck[roundIndex],spinStart=performance.now(),choiceLockedAt=now();$("machine-message").textContent="READING THE SEALED FUTURE…";$("reels").classList.add("spinning");
    var cycles=[];for(var r=0;r<3;r++){(function(index){cycles[index]=setInterval(function(){setReel(index,symbols[randomInt(SYMBOL_COUNT)].id);tone(95+index*18,.025,"square",.012);},70);intervals.push(cycles[index]);later(function(){clearInterval(cycles[index]);setReel(index,target[index]);stopSound(index);},430+index*260);})(r);}
    later(function(){$("reels").classList.remove("spinning");resolveRound(target,Math.round(spinStart-roundStarted),choiceLockedAt);},1030);
  }
  function rewardFor(m){var rewards=session.protocol&&session.protocol.rewards||{};return m===3?(rewards.three||10000000):m===2?(rewards.two||1000000):m===1?(rewards.one||10000):0;}
  function resolveRound(target,responseMs,choiceLockedAt){
    var matches=picks.map(function(x,i){return x===target[i];}),count=matches.filter(Boolean).length,reward=rewardFor(count);
    var record={round_index:roundIndex+1,phase:roundIndex<PRIMARY_ROUNDS?"primary":"bonus",prediction:picks.slice(),target:target.slice(),position_matches:matches,match_count:count,confidence:null,response_ms:responseMs,prediction_locked_at:choiceLockedAt,revealed_at:now(),reward:reward,balance_after:session.balance+reward};
    session.balance+=reward;session.rounds.push(record);persistCurrent();syncSession("round_completed");$("balance-value").textContent=formatCoins(session.balance);$("win-amount").textContent=reward?"+ "+formatCoins(reward):"NO MATCH";
    $("machine-message").textContent=count===3?"MEGA JACKPOT — TEN MILLION!":count===2?"TWO REELS — MILLION HIT!":count===1?"ONE REEL MATCHED":"THE FUTURE SLIPPED AWAY";winSound(count);moneySound(count);announceWin(count,reward);if(count>0)coins(count===3?170:count===2?75:8,count);if(count>=2){$("slot-machine").classList.add("big-win");showWinBanner(count,reward);}
    later(nextRound,count===3?2600:count===2?1900:1400);
  }
  function showWinBanner(matches,reward){var b=$("win-banner");b.className="win-banner tier-"+matches;b.querySelector("span").textContent=matches===3?"MEGA JACKPOT":"BIG WIN";b.querySelector("strong").textContent=formatCoins(reward);b.hidden=false;}
  function coins(n,tier){var layer=$("coin-layer");layer.innerHTML="";for(var i=0;i<n;i++){var c=document.createElement("i");c.className="coin tier-"+tier;c.textContent="$";c.style.setProperty("--left",Math.random()*100+"vw");c.style.setProperty("--drift",(Math.random()*360-180)+"px");c.style.setProperty("--delay",Math.random()*(tier===3?.85:.5)+"s");c.style.setProperty("--duration",(1.1+Math.random()*1.5)+"s");layer.appendChild(c);}later(function(){layer.innerHTML="";},3600);}
  function nextRound(){roundIndex=session.rounds.length;if(roundIndex>=ROUNDS){finish("primary_plus_bonus");return;}if(roundIndex===PRIMARY_ROUNDS&&session.schema==="mind-jackpot-session-1.2"){session.status="paused";session.primary_completed_at=session.primary_completed_at||now();session.events.push({type:"primary_completed",after_round:roundIndex,at:now()});persistCurrent();syncSession("primary_completed");show("bonus-screen");return;}if(roundIndex===20||(roundIndex===40&&session.schema!=="mind-jackpot-session-1.2")){session.events.push({type:"break",after_round:roundIndex,at:now()});persistCurrent();$("break-text").textContent=session.schema==="mind-jackpot-session-1.2"?"20 of 40 primary rounds complete. Take one breath; your sealed sequence is waiting.":roundIndex+" of 60 rounds complete. Take one breath; your sealed sequence is waiting.";show("break-screen");return;}startRound();}
  function verify(){return sha256(payload(session)).then(function(h){return h===session.deck_commitment;});}
  function finish(mode){cancelTimers();session.status="complete";session.completed_at=now();session.finish_mode=mode||((session.rounds.length>PRIMARY_ROUNDS)?"primary_plus_bonus":"primary_only");session.bonus_opt_in=session.finish_mode==="primary_plus_bonus";session.integrity.complete=session.rounds.length>=PRIMARY_ROUNDS;verify().then(function(ok){session.integrity.commitment_verified=ok;session.events.push({type:"session_completed",finish_mode:session.finish_mode,at:now()});persistCurrent();syncSession("session_completed");return archiveSession(session).catch(function(){session.events.push({type:"archive_failed",at:now()});persistCurrent();});}).then(showResults);}
  function startBonus(){session.status="in_progress";session.bonus_opt_in=true;session.events.push({type:"bonus_started",at:now()});persistCurrent();syncSession("bonus_started");startRound();}
  function showResults(){var primary=session.rounds.slice(0,PRIMARY_ROUNDS),bonus=session.rounds.slice(PRIMARY_ROUNDS),matches=primary.reduce(function(a,r){return a+r.match_count;},0),bonusMatches=bonus.reduce(function(a,r){return a+r.match_count;},0),jackpots=session.rounds.filter(function(r){return r.match_count===3;}).length,nickname=session.participant&&session.participant.research_nickname;$("result-heading").textContent=nickname?"Future revealed, "+nickname+".":"Future revealed.";$("final-balance").textContent=formatCoins(session.balance);$("match-result").textContent=matches+" / "+(primary.length*3);$("jackpot-result").textContent=String(jackpots);$("bonus-result").textContent=bonus.length?bonusMatches+" / "+(bonus.length*3):"NOT PLAYED";$("verified-result").textContent=session.integrity.commitment_verified?"YES":"FAILED";show("results-screen");updateArchiveCount();}

  function exportJSON(data,name){var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
  function exportSession(partial){var out=JSON.parse(JSON.stringify(session));delete out.sync_token;out.exported_at=now();out.export_type=partial?"partial_blinded":"complete_unblinded";if(partial&&out.status!=="complete"){out.target_deck=out.target_deck.slice(0,out.rounds.length);out.deck_salt=null;out.note="Future outcomes and commitment salt are withheld to preserve blinding.";}exportJSON(out,"MIND_JACKPOT_"+out.participant_id+(partial?"_partial":"_complete")+".json");session.events.push({type:partial?"partial_download":"complete_download",at:now()});persistCurrent();syncSession("download_choice");}
  function pause(){if(!session||session.status!=="in_progress")return;cancelTimers();session.status="paused";session.events.push({type:"paused",at:now(),after_round:session.rounds.length});persistCurrent();syncSession("paused");show("pause-screen");}
  function resume(){session.status="in_progress";session.events.push({type:"resumed",at:now()});persistCurrent();syncSession("resumed");roundIndex=session.rounds.length;startRound();}
  function leaveForLater(){session.status="paused";persistCurrent();syncSession("left_for_later");show("intro-screen");showResume();}
  function showResume(){var saved=loadCurrent();if(saved&&["committed","in_progress","paused"].indexOf(saved.status)>=0){$("resume-banner").hidden=false;var nickname=saved.participant&&saved.participant.research_nickname;$("resume-copy").textContent=(nickname?nickname+" · ":"")+saved.rounds.length+" rounds completed · "+saved.participant_id;}else $("resume-banner").hidden=true;}
  function resumeSaved(){var saved=loadCurrent();if(!saved)return;session=saved;ensureSyncToken();syncSession("local_session_resumed");if(session.status==="committed"){prepareReady();return;}if(session.schema==="mind-jackpot-session-1.2"&&session.rounds.length===PRIMARY_ROUNDS&&session.bonus_opt_in==null){show("bonus-screen");return;}resume();}
  function newParticipant(){clearCurrent();location.reload();}

  function init(){
    renderSymbols();updateArchiveCount();showResume();
    $("enter-button").addEventListener("click",function(){show("consent-screen");});$("how-button").addEventListener("click",function(){$("how-it-works").scrollIntoView({behavior:"smooth"});});$("consent-back").addEventListener("click",function(){show("intro-screen");});
    $("consent-form").addEventListener("submit",function(e){e.preventDefault();var f=e.currentTarget;if(!f.checkValidity()){$("form-error").hidden=false;f.reportValidity();return;}$("form-error").hidden=true;initAudio();if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();show("ready-screen");createSession(formData(f)).then(prepareReady).catch(function(){alert("Secure browser randomness is unavailable. Please open the HTTPS version in a current browser.");show("consent-screen");});});
    $("copy-hash").addEventListener("click",function(){if(navigator.clipboard)navigator.clipboard.writeText(session.deck_commitment);this.textContent="COPIED";});$("start-button").addEventListener("click",beginGame);$("continue-button").addEventListener("click",startRound);$("finish-primary-button").addEventListener("click",function(){finish("primary_only");});$("start-bonus-button").addEventListener("click",startBonus);$("pause-button").addEventListener("click",pause);$("resume-button").addEventListener("click",resume);$("partial-button").addEventListener("click",function(){exportSession(true);});$("quit-button").addEventListener("click",leaveForLater);$("undo-pick").addEventListener("click",undoPick);$("clear-picks").addEventListener("click",clearPicks);$("spin-button").addEventListener("click",confirmSpin);
    $("resume-local").addEventListener("click",resumeSaved);$("discard-local").addEventListener("click",function(){if(confirm("Delete the unfinished local session?")){clearCurrent();showResume();}});$("download-button").addEventListener("click",function(){exportSession(false);});$("not-now-button").addEventListener("click",function(){session.events.push({type:"download_declined",at:now()});persistCurrent();syncSession("download_declined");});$("new-session-button").addEventListener("click",newParticipant);
    $("export-archive").addEventListener("click",function(){getArchive().then(function(rows){exportJSON({schema:"mind-jackpot-local-archive-1.0",exported_at:now(),session_count:rows.length,sessions:rows},"MIND_JACKPOT_local_archive.json");});});
    $("sound-button").addEventListener("click",function(){audioOn=!audioOn;this.textContent=audioOn?"♪ ON":"♪ OFF";this.setAttribute("aria-pressed",String(audioOn));if(audioOn)initAudio();});$("fullscreen-button").addEventListener("click",function(){if(!document.fullscreenElement){document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();}else document.exitFullscreen&&document.exitFullscreen();});
    document.addEventListener("keydown",function(e){if($("game-screen").hidden||locked)return;var n=Number(e.key);if(n>=1&&n<=6){e.preventDefault();choose(symbols[n-1].id);}if((e.key==="Enter"||e.key===" ")&&picks.length===3){e.preventDefault();confirmSpin();}if(e.key==="Backspace"&&picks.length){e.preventDefault();undoPick();}if(e.key==="Escape")pause();});window.addEventListener("online",function(){syncSession("connection_restored");});window.addEventListener("pagehide",function(){persistCurrent();syncSession("pagehide",true);});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
