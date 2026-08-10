(function(){
  "use strict";

  var VERSION="mind-jackpot-2.0.0",SCHEMA="mind-jackpot-session-2.0",PRIMARY_ROUNDS=40,BONUS_ROUNDS=20,ROUNDS=60,SYMBOL_COUNT=6;
  var CURRENT_KEY="mind_jackpot_current_v2",DB_NAME="mind-jackpot-research",DB_STORE="sessions_v2";
  var API_URL="https://mdvqnqtsexngmyezhwbh.supabase.co/functions/v1/mind-jackpot-v2";
  var API_KEY="sb_publishable_jB8oBErnX6AmFNva3f0S6g_RIkWHQcZ";
  var PRECOMMITMENT_URL="precommitment-v2.json",ASSET_MANIFEST_URL="asset-manifest-v2.json";
  var symbols=[],protocolAssets=null,assetPromise=null;
  var $=function(id){return document.getElementById(id);};
  var screenIds=["intro-screen","consent-screen","ready-screen","game-screen","break-screen","bonus-screen","pause-screen","results-screen"];
  var session=null,roundIndex=0,picks=[],roundStarted=0,locked=false,audioOn=true,audioContext=null,timers=[],intervals=[];

  function show(id){screenIds.forEach(function(x){$(x).hidden=x!==id;});window.scrollTo({top:0,behavior:"smooth"});}
  function now(){return new Date().toISOString();}
  function bytesHex(a){return Array.prototype.map.call(a,function(b){return b.toString(16).padStart(2,"0");}).join("");}
  function randomInt(max){var a=new Uint32Array(1),limit=Math.floor(4294967296/max)*max;do{crypto.getRandomValues(a);}while(a[0]>=limit);return a[0]%max;}
  function randomToken(){return bytesHex(crypto.getRandomValues(new Uint8Array(32)));}
  function randomUUID(){if(crypto.randomUUID)return crypto.randomUUID();var a=crypto.getRandomValues(new Uint8Array(16));a[6]=(a[6]&15)|64;a[8]=(a[8]&63)|128;var h=bytesHex(a);return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20);}
  function sha256Bytes(value){return crypto.subtle.digest("SHA-256",value).then(function(b){return bytesHex(new Uint8Array(b));});}
  function sha256Text(text){return sha256Bytes(new TextEncoder().encode(text));}
  function symbol(index){return symbols[index];}
  function symbolMarkup(index){var s=symbol(index);return s?'<img src="'+s.objectUrl+'" alt="" draggable="false">':"?";}
  function formatCoins(n){return "$"+Number(n).toLocaleString("en-US");}
  function cancelTimers(){timers.forEach(clearTimeout);intervals.forEach(clearInterval);timers=[];intervals=[];}
  function later(fn,ms){var id=setTimeout(fn,ms);timers.push(id);return id;}

  function setSyncStatus(text,state){Array.prototype.forEach.call(document.querySelectorAll("[data-sync-status]"),function(el){el.textContent=text;el.dataset.state=state||"";});}
  function persistCurrent(){if(session)localStorage.setItem(CURRENT_KEY,JSON.stringify(session));}
  function loadCurrent(){try{return JSON.parse(localStorage.getItem(CURRENT_KEY));}catch(e){return null;}}
  function clearCurrent(){localStorage.removeItem(CURRENT_KEY);session=null;}
  function openDB(){return new Promise(function(resolve,reject){var req=indexedDB.open(DB_NAME,2);req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains(DB_STORE))req.result.createObjectStore(DB_STORE,{keyPath:"public_id"});};req.onsuccess=function(){resolve(req.result);};req.onerror=function(){reject(req.error);};});}
  function archiveSession(s){return openDB().then(function(db){return new Promise(function(resolve,reject){var tx=db.transaction(DB_STORE,"readwrite");tx.objectStore(DB_STORE).put(JSON.parse(JSON.stringify(s)));tx.oncomplete=function(){db.close();resolve();};tx.onerror=function(){reject(tx.error);};});});}
  function getArchive(){return openDB().then(function(db){return new Promise(function(resolve,reject){var req=db.transaction(DB_STORE,"readonly").objectStore(DB_STORE).getAll();req.onsuccess=function(){db.close();resolve(req.result||[]);};req.onerror=function(){reject(req.error);};});});}
  function updateArchiveCount(){getArchive().then(function(rows){$("archive-count").textContent=rows.length+" completed v2 session"+(rows.length===1?"":"s")+" stored in this browser";$("export-archive").disabled=!rows.length;}).catch(function(){$("archive-count").textContent="Local archive unavailable in this browser";});}

  function fetchTextAndBytes(url){return fetch(url,{cache:"no-store"}).then(function(response){if(!response.ok)throw new Error("HTTP "+response.status+" for "+url);return response.arrayBuffer();}).then(function(buffer){return {buffer:buffer,text:new TextDecoder().decode(buffer)};});}
  function loadProtocolAssets(){
    if(!window.crypto||!crypto.subtle||!crypto.getRandomValues)return Promise.reject(new Error("Secure Web Crypto unavailable"));
    return Promise.all([fetchTextAndBytes(PRECOMMITMENT_URL),fetchTextAndBytes(ASSET_MANIFEST_URL)]).then(function(files){
      var precommit=JSON.parse(files[0].text),manifest=JSON.parse(files[1].text);
      return sha256Bytes(files[1].buffer).then(function(manifestHash){
        if(manifestHash!==precommit.asset_manifest_hash)throw new Error("Asset manifest hash mismatch");
        if(!Array.isArray(precommit.deck_commitments)||!precommit.deck_commitments.length)throw new Error("Empty precommitment bank");
        if(!Array.isArray(manifest.symbols)||manifest.symbols.length!==SYMBOL_COUNT)throw new Error("Invalid symbol manifest");
        return Promise.all(manifest.symbols.map(function(item){return fetch(item.path,{cache:"no-store"}).then(function(response){if(!response.ok)throw new Error("Missing asset "+item.path);return response.arrayBuffer();}).then(function(buffer){return sha256Bytes(buffer).then(function(hash){if(hash!==item.sha256)throw new Error("Asset hash mismatch: "+item.id);return {index:item.index,id:item.id,name:item.name,path:item.path,sha256:item.sha256,objectUrl:URL.createObjectURL(new Blob([buffer],{type:"image/svg+xml"}))};});});})).then(function(verifiedSymbols){
          verifiedSymbols.sort(function(a,b){return a.index-b.index;});symbols=verifiedSymbols;protocolAssets={precommitment:precommit,manifest:manifest,manifestHash:manifestHash,verifiedAt:now()};return protocolAssets;
        });
      });
    });
  }

  function api(action,data){
    setSyncStatus("Contacting the sealed research server…","syncing");
    var body=Object.assign({action:action},data||{});
    return fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":API_KEY},body:JSON.stringify(body),cache:"no-store"}).then(function(response){return response.json().catch(function(){return {};}).then(function(payload){if(!response.ok||!payload.ok)throw new Error(payload.error||("HTTP_"+response.status));setSyncStatus("Authoritative record saved on the EU server","saved");return payload.data;});}).catch(function(error){setSyncStatus("Server unavailable · no outcome was revealed","pending");throw error;});
  }

  function initAudio(){if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==="suspended")audioContext.resume();}
  function tone(freq,duration,type,volume,delay){if(!audioOn)return;try{initAudio();var t=audioContext.currentTime+(delay||0),o=audioContext.createOscillator(),g=audioContext.createGain();o.type=type||"square";o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume||.06,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+duration+.02);}catch(e){}}
  function clickSound(){tone(420,.07,"square",.035);tone(620,.06,"square",.025,.035);}
  function stopSound(index){tone(500+index*110,.1,"square",.065);tone(250+index*55,.12,"triangle",.035,.025);}
  function winSound(matches){if(matches===0){tone(150,.16,"sawtooth",.035);tone(110,.2,"triangle",.02,.05);return;}var notes=matches===3?[392,523,659,784,1047,1319]:matches===2?[330,440,554,659,880]:[392,523,659];notes.forEach(function(n,i){tone(n,.2,"square",.065,i*.075);tone(n/2,.24,"triangle",.035,i*.075);});if(matches>=2)[0,.12,.24,.36].forEach(function(delay,i){tone(i%2?1568:2093,.055,"sine",.035,delay);});}
  function moneySound(matches){if(!audioOn||matches===0)return;var count=matches===3?42:matches===2?20:4,spacing=matches===3?.045:matches===2?.06:.09;for(var i=0;i<count;i++){var delay=i*spacing,freq=(i%3===0?1760:i%3===1?2217:2637)+(i%5)*19;tone(freq,matches===3?.085:.055,"sine",matches===1?.022:.038,delay);}}
  function announceWin(matches){if(!audioOn||matches<2||!("speechSynthesis" in window))return;try{window.speechSynthesis.cancel();var message=matches===3?"Mega jackpot! You won ten million Mind Coins!":"Amazing! You won one million Mind Coins!";var u=new SpeechSynthesisUtterance(message);u.lang="en-US";u.rate=1.05;u.pitch=1.16;u.volume=.95;window.speechSynthesis.speak(u);}catch(e){}}

  function symbolButton(s){return '<button class="symbol-button" type="button" data-symbol="'+s.index+'" aria-label="Choose '+s.name+'"><span>'+symbolMarkup(s.index)+'</span><span>'+(s.index+1)+' · '+s.name+'</span></button>';}
  function renderSymbols(){$("symbol-grid").innerHTML=symbols.map(symbolButton).join("");Array.prototype.forEach.call($("symbol-grid").querySelectorAll("button"),function(b){b.addEventListener("click",function(){choose(Number(b.dataset.symbol));});});}
  function setReel(index,id){$("reel-"+index).innerHTML=id===null?"?":symbolMarkup(id);}
  function setPick(index,id){$("pick-"+index).innerHTML=id===null||id===undefined?"?":symbolMarkup(id);}
  function updatePickControls(){var full=picks.length===3,next=Math.min(3,picks.length+1);Array.prototype.forEach.call($("symbol-grid").querySelectorAll("button"),function(b){b.disabled=locked||full;var s=symbol(Number(b.dataset.symbol));b.setAttribute("aria-label","Choose "+s.name+" for reel "+next);});$("undo-pick").disabled=locked||picks.length===0;$("clear-picks").disabled=locked||picks.length===0;$("spin-button").disabled=locked||!full;$("position-number").textContent=full?"✓":String(picks.length+1);}
  function lockControls(value){locked=value;updatePickControls();}

  function formData(form){var o={};new FormData(form).forEach(function(v,k){o[k]=v;});["adult","understood","consent","storage","solo_decisions","summary_reporting"].forEach(function(k){o[k]=form.elements[k].checked;});return o;}
  function createSession(formValues){
    return assetPromise.then(function(){
      var nickname=String(formValues.research_nickname||"").trim();
      var participant={},consents={};
      ["age_band","gender","alertness","sleep_quality","prior_belief","alcohol_12h","psychoactive_12h","attention_medication","caffeine_4h","physical_presence","observer_attention","observer_relationship","gaming","gambling","prior_participation"].forEach(function(key){participant[key]=String(formValues[key]||"");});
      ["adult","understood","consent","storage","solo_decisions","summary_reporting"].forEach(function(key){consents[key]=formValues[key]===true;});
      session={schema:SCHEMA,protocol:{version:VERSION,total_rounds:ROUNDS,primary_rounds:PRIMARY_ROUNDS,optional_bonus_rounds:BONUS_ROUNDS,reels_per_round:3,symbols_per_reel:SYMBOL_COUNT,chance_per_reel:1/6,primary_outcome:"total position-specific matches in rounds 1-40",target_generation:"Private bank generated with pgcrypto before study publication; rejection sampling maps accepted bytes uniformly to 0-5",reveal_order:"Prediction is inserted in the immutable server record before the current target is returned",individual_analysis:"First complete session is exploratory; candidates require at least two later complete sessions and Holm correction"},client_nonce:randomUUID(),session_token:randomToken(),research_nickname:nickname,participant:participant,consents:consents,status:"preparing",created_at:now(),rounds:[],pending:null,balance:0,bonus_opt_in:null,finish_mode:null,integrity:{assets_verified:true,assets_verified_at:protocolAssets.verifiedAt,commitment_membership_verified:false,commitment_verified:null},asset_manifest_hash:protocolAssets.manifestHash,events:[{type:"local_session_prepared",at:now()}]};
      persistCurrent();
      return api("create_session",{client_nonce:session.client_nonce,session_token:session.session_token,research_nickname:nickname,participant:participant,consents:consents,assets_verified:true,client:{language:navigator.language||"",screen_bucket:screen.width<600?"small":screen.width<1000?"medium":"large",touch:navigator.maxTouchPoints>0,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"",user_agent_family:"browser"}});
    }).then(function(data){
      var pre=protocolAssets.precommitment,entry=pre.deck_commitments.filter(function(x){return x.deck_no===data.deck_no;})[0];
      if(data.bank_id!==pre.bank_id||data.bank_root!==pre.bank_root||data.asset_manifest_hash!==pre.asset_manifest_hash||!entry||entry.commitment!==data.deck_commitment)throw new Error("SERVER_PRECOMMITMENT_MISMATCH");
      session.public_id=data.public_id;session.bank_id=data.bank_id;session.bank_root=data.bank_root;session.deck_no=data.deck_no;session.deck_commitment=data.deck_commitment;session.precommitment_url=data.precommitment_url;session.created_at=data.created_at;session.status="committed";session.integrity.commitment_membership_verified=true;session.events.push({type:"server_commitment_verified",at:now()});persistCurrent();return session;
    });
  }

  function prepareReady(){$("hash-value").textContent=session.deck_commitment;$("start-button").disabled=!session.integrity.commitment_membership_verified;show("ready-screen");}
  function beginGame(){session.status="in_progress";session.events.push({type:"game_started",at:now()});persistCurrent();roundIndex=session.rounds.length;startRound();}
  function startRound(){
    cancelTimers();locked=false;roundIndex=session.rounds.length;if(roundIndex>=ROUNDS){finish("primary_plus_bonus");return;}
    picks=session.pending&&session.pending.round_index===roundIndex+1?session.pending.prediction.slice():[];
    var phase=roundIndex>=PRIMARY_ROUNDS?"BONUS ROUND":roundIndex>=30?"FINAL PRIMARY PHASE":roundIndex>=20?"FOCUS PHASE":roundIndex>=10?"RHYTHM PHASE":"WARM-UP PHASE";
    $("game-screen").dataset.stage=roundIndex>=PRIMARY_ROUNDS?"bonus":String(Math.floor(roundIndex/10)+1);$("stage-label").textContent=phase;$("round-number").textContent=String(roundIndex+1).padStart(2,"0")+" / "+ROUNDS;$("balance-value").textContent=formatCoins(session.balance);$("progress-fill").style.width=(roundIndex/ROUNDS*100)+"%";$("machine-message").textContent=picks.length===3?"LOCKED LOCALLY — RETRY SERVER REVEAL":"PREDICT THE SEALED OUTCOME";$("win-amount").textContent="$0";$("win-banner").hidden=true;
    for(var i=0;i<3;i++){setReel(i,null);setPick(i,picks[i]);}renderSymbols();lockControls(false);updatePickControls();$("slot-machine").classList.remove("big-win");show("game-screen");roundStarted=performance.now();
  }
  function choose(id){if(locked||picks.length>=3)return;initAudio();clickSound();picks.push(id);setPick(picks.length-1,id);updatePickControls();if(picks.length===3)$("machine-message").textContent="PREDICTION READY — PRESS SPIN";}
  function undoPick(){if(locked||!picks.length)return;clickSound();picks.pop();session.pending=null;persistCurrent();for(var i=0;i<3;i++)setPick(i,picks[i]);$("machine-message").textContent="PREDICT THE SEALED OUTCOME";updatePickControls();}
  function clearPicks(){if(locked||!picks.length)return;clickSound();picks=[];session.pending=null;persistCurrent();for(var i=0;i<3;i++)setPick(i,null);$("machine-message").textContent="PREDICT THE SEALED OUTCOME";updatePickControls();}
  function confirmSpin(){
    if(locked||picks.length!==3)return;initAudio();tone(784,.08,"square",.05);lockControls(true);
    var pending=session.pending&&session.pending.round_index===roundIndex+1?session.pending:{round_index:roundIndex+1,prediction:picks.slice(),response_ms:Math.max(0,Math.round(performance.now()-roundStarted)),prepared_at:now()};
    session.pending=pending;persistCurrent();$("machine-message").textContent="PREDICTION LOCKED — REQUESTING REVEAL…";
    api("reveal_round",{public_id:session.public_id,session_token:session.session_token,round_index:pending.round_index,prediction:pending.prediction,response_ms:pending.response_ms}).then(function(record){spin(record);}).catch(function(error){lockControls(false);$("machine-message").textContent="NO REVEAL · CHECK CONNECTION AND RETRY";alert("The server did not reveal an outcome. Your prediction is preserved for a safe retry. ("+error.message+")");});
  }
  function spin(record){
    var target=record.target;$("machine-message").textContent="READING THE PRECOMMITTED FUTURE…";$("reels").classList.add("spinning");
    var cycles=[];for(var r=0;r<3;r++){(function(index){cycles[index]=setInterval(function(){setReel(index,randomInt(SYMBOL_COUNT));tone(95+index*18,.025,"square",.012);},70);intervals.push(cycles[index]);later(function(){clearInterval(cycles[index]);setReel(index,target[index]);stopSound(index);},430+index*260);})(r);}
    later(function(){$("reels").classList.remove("spinning");resolveRound(record);},1030);
  }
  function resolveRound(record){
    session.rounds.push({round_index:record.round_index,phase:record.phase,prediction:record.prediction,target:record.target,position_matches:record.position_matches,match_count:record.match_count,response_ms:session.pending&&session.pending.response_ms,prediction_locked_at:record.prediction_locked_at,revealed_at:record.revealed_at,reward:record.reward,balance_after:record.balance_after});session.pending=null;session.balance=record.balance_after;session.status=record.status;persistCurrent();
    var count=record.match_count,reward=record.reward;$("balance-value").textContent=formatCoins(session.balance);$("win-amount").textContent=reward?"+ "+formatCoins(reward):"NO MATCH";$("machine-message").textContent=count===3?"MEGA JACKPOT — TEN MILLION!":count===2?"TWO REELS — MILLION HIT!":count===1?"ONE REEL MATCHED":"THE FUTURE SLIPPED AWAY";winSound(count);moneySound(count);announceWin(count);if(count>0)coins(count===3?170:count===2?75:8,count);if(count>=2){$("slot-machine").classList.add("big-win");showWinBanner(count,reward);}later(nextRound,count===3?2600:count===2?1900:1400);
  }
  function showWinBanner(matches,reward){var b=$("win-banner");b.className="win-banner tier-"+matches;b.querySelector("span").textContent=matches===3?"MEGA JACKPOT":"BIG WIN";b.querySelector("strong").textContent=formatCoins(reward);b.hidden=false;}
  function coins(n,tier){var layer=$("coin-layer");layer.innerHTML="";for(var i=0;i<n;i++){var c=document.createElement("i");c.className="coin tier-"+tier;c.textContent="$";c.style.setProperty("--left",Math.random()*100+"vw");c.style.setProperty("--drift",(Math.random()*360-180)+"px");c.style.setProperty("--delay",Math.random()*(tier===3?.85:.5)+"s");c.style.setProperty("--duration",(1.1+Math.random()*1.5)+"s");layer.appendChild(c);}later(function(){layer.innerHTML="";},3600);}
  function nextRound(){roundIndex=session.rounds.length;if(roundIndex>=ROUNDS){finish("primary_plus_bonus");return;}if(roundIndex===PRIMARY_ROUNDS){session.status="primary_complete";session.events.push({type:"primary_completed",at:now()});persistCurrent();show("bonus-screen");return;}if(roundIndex===20){session.events.push({type:"break",after_round:roundIndex,at:now()});persistCurrent();$("break-text").textContent="20 of 40 primary rounds complete. Take one breath; the server-sealed sequence is waiting.";show("break-screen");return;}startRound();}

  function deckPayload(flatTargets,salt){return ["mind-jackpot-deck-2.0",session.bank_id,String(session.deck_no),salt,flatTargets.join(","),session.asset_manifest_hash].join("::");}
  function verifyReveal(reveal){
    if(!reveal||!Array.isArray(reveal.target_deck)||reveal.target_deck.length!==180)return Promise.resolve(false);
    for(var i=0;i<session.rounds.length;i++){var expected=reveal.target_deck.slice(i*3,i*3+3),actual=session.rounds[i].target;if(expected.join(",")!==actual.join(","))return Promise.resolve(false);}
    return sha256Text(deckPayload(reveal.target_deck,reveal.deck_salt)).then(function(hash){return hash===session.deck_commitment;});
  }
  function finish(mode){
    cancelTimers();setSyncStatus("Requesting the final verification reveal…","syncing");
    return api("finish_session",{public_id:session.public_id,session_token:session.session_token,finish_mode:mode}).then(function(data){session.status="complete";session.completed_at=data.completed_at;session.finish_mode=mode;session.bonus_opt_in=mode==="primary_plus_bonus";session.reveal={deck_salt:data.deck_salt,target_deck:data.target_deck};return verifyReveal(session.reveal).then(function(ok){session.integrity.commitment_verified=ok&&data.commitment_verified_server===true;session.events.push({type:"session_completed",finish_mode:mode,at:now()});persistCurrent();return archiveSession(session).catch(function(){}).then(showResults);});}).catch(function(error){persistCurrent();alert("Final verification is waiting for the server. Your completed rounds are safe; please retry when online. ("+error.message+")");if(session.rounds.length===40)show("bonus-screen");else show("pause-screen");});
  }
  function startBonus(){lockControls(true);api("start_bonus",{public_id:session.public_id,session_token:session.session_token}).then(function(){session.status="in_progress";session.bonus_opt_in=true;session.events.push({type:"bonus_started",at:now()});persistCurrent();startRound();}).catch(function(error){alert("The bonus phase could not start. Please retry. ("+error.message+")");show("bonus-screen");});}
  function showResults(){var primary=session.rounds.slice(0,PRIMARY_ROUNDS),bonus=session.rounds.slice(PRIMARY_ROUNDS),matches=primary.reduce(function(a,r){return a+r.match_count;},0),bonusMatches=bonus.reduce(function(a,r){return a+r.match_count;},0),jackpots=session.rounds.filter(function(r){return r.match_count===3;}).length;$("result-heading").textContent=session.research_nickname?"Future revealed, "+session.research_nickname+".":"Future revealed.";$("final-balance").textContent=formatCoins(session.balance);$("match-result").textContent=matches+" / "+(primary.length*3);$("jackpot-result").textContent=String(jackpots);$("bonus-result").textContent=bonus.length?bonusMatches+" / "+(bonus.length*3):"NOT PLAYED";$("verified-result").textContent=session.integrity.commitment_verified?"YES":"FAILED";setSyncStatus(session.integrity.commitment_verified?"Server record complete · deck verification passed":"Integrity verification failed","saved");show("results-screen");updateArchiveCount();}

  function exportJSON(data,name){var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
  function safeExport(){var out=JSON.parse(JSON.stringify(session));delete out.session_token;delete out.research_nickname;out.exported_at=now();return out;}
  function exportSession(partial){var out=safeExport();out.export_type=partial?"partial_blinded":"complete_unblinded";if(partial){delete out.reveal;out.note="Only already revealed outcomes are present; the future server deck remains hidden.";}exportJSON(out,"MIND_JACKPOT_"+out.public_id+(partial?"_partial":"_complete")+".json");}
  function pause(){if(!session||session.status==="complete")return;cancelTimers();session.status="paused";session.events.push({type:"paused_locally",at:now(),after_round:session.rounds.length});persistCurrent();show("pause-screen");}
  function resumeFromServer(){
    setSyncStatus("Reconciling with the authoritative server record…","syncing");
    return api("resume_session",{public_id:session.public_id,session_token:session.session_token}).then(function(data){session.rounds=data.trials||[];session.balance=data.balance||0;session.status=data.status;session.bonus_opt_in=data.bonus_opt_in;session.finish_mode=data.finish_mode;session.primary_completed_at=data.primary_completed_at;session.completed_at=data.completed_at;if(session.pending&&session.rounds.some(function(r){return r.round_index===session.pending.round_index;}))session.pending=null;persistCurrent();if(data.status==="complete"&&data.reveal){session.reveal=data.reveal;return verifyReveal(data.reveal).then(function(ok){session.integrity.commitment_verified=ok;persistCurrent();return archiveSession(session).catch(function(){}).then(showResults);});}if(session.rounds.length===PRIMARY_ROUNDS&&session.bonus_opt_in!==true){show("bonus-screen");return;}roundIndex=session.rounds.length;startRound();}).catch(function(error){setSyncStatus("Cannot resume without the research server","pending");alert("A connection to the research server is required to resume safely. ("+error.message+")");show("intro-screen");});
  }
  function resume(){session.events.push({type:"resume_requested",at:now()});persistCurrent();resumeFromServer();}
  function leaveForLater(){session.status="paused";persistCurrent();show("intro-screen");showResume();}
  function showResume(){var saved=loadCurrent();if(saved&&saved.schema===SCHEMA&&saved.status!=="complete"){$("resume-banner").hidden=false;$("resume-copy").textContent=(saved.research_nickname?saved.research_nickname+" · ":"")+(saved.rounds||[]).length+" rounds recorded · "+(saved.public_id||"server commitment pending");}else $("resume-banner").hidden=true;}
  function resumeSaved(){var saved=loadCurrent();if(!saved)return;session=saved;assetPromise.then(function(){renderSymbols();if(!session.public_id){alert("This session was never committed by the server and cannot be used. Please start a new session.");return;}resumeFromServer();}).catch(function(error){alert("Protocol assets failed verification: "+error.message);});}
  function newParticipant(){clearCurrent();location.reload();}

  function init(){
    $("start-button").disabled=true;setSyncStatus("Verifying the public commitment and symbol bytes…","syncing");assetPromise=loadProtocolAssets().then(function(){renderSymbols();setSyncStatus("Public commitment and symbol bytes verified","saved");return protocolAssets;}).catch(function(error){setSyncStatus("Protocol verification failed · study disabled","pending");$("enter-button").disabled=true;throw error;});
    updateArchiveCount();showResume();
    $("enter-button").addEventListener("click",function(){show("consent-screen");});$("how-button").addEventListener("click",function(){$("how-it-works").scrollIntoView({behavior:"smooth"});});$("consent-back").addEventListener("click",function(){show("intro-screen");});
    $("consent-form").addEventListener("submit",function(e){e.preventDefault();var f=e.currentTarget;if(!f.checkValidity()){$("form-error").hidden=false;f.reportValidity();return;}$("form-error").hidden=true;initAudio();if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();show("ready-screen");$("hash-value").textContent="Requesting a precommitted deck…";createSession(formData(f)).then(prepareReady).catch(function(error){alert("The publication protocol could not create a valid session. No game has started. ("+error.message+")");clearCurrent();show("consent-screen");});});
    $("copy-hash").addEventListener("click",function(){if(navigator.clipboard)navigator.clipboard.writeText(session.deck_commitment);this.textContent="COPIED";});$("start-button").addEventListener("click",beginGame);$("continue-button").addEventListener("click",startRound);$("finish-primary-button").addEventListener("click",function(){finish("primary_only");});$("start-bonus-button").addEventListener("click",startBonus);$("pause-button").addEventListener("click",pause);$("resume-button").addEventListener("click",resume);$("partial-button").addEventListener("click",function(){exportSession(true);});$("quit-button").addEventListener("click",leaveForLater);$("undo-pick").addEventListener("click",undoPick);$("clear-picks").addEventListener("click",clearPicks);$("spin-button").addEventListener("click",confirmSpin);
    $("resume-local").addEventListener("click",resumeSaved);$("discard-local").addEventListener("click",function(){if(confirm("Delete the unfinished local recovery copy? The server audit record is retained.")){clearCurrent();showResume();}});$("download-button").addEventListener("click",function(){exportSession(false);});$("not-now-button").addEventListener("click",function(){session.events.push({type:"download_declined",at:now()});persistCurrent();});$("new-session-button").addEventListener("click",newParticipant);
    $("export-archive").addEventListener("click",function(){getArchive().then(function(rows){var safe=rows.map(function(row){var copy=JSON.parse(JSON.stringify(row));delete copy.session_token;delete copy.research_nickname;return copy;});exportJSON({schema:"mind-jackpot-local-archive-2.0",exported_at:now(),session_count:safe.length,sessions:safe},"MIND_JACKPOT_v2_local_archive.json");});});
    $("sound-button").addEventListener("click",function(){audioOn=!audioOn;this.textContent=audioOn?"♪ ON":"♪ OFF";this.setAttribute("aria-pressed",String(audioOn));if(audioOn)initAudio();});$("fullscreen-button").addEventListener("click",function(){if(!document.fullscreenElement){document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();}else document.exitFullscreen&&document.exitFullscreen();});
    document.addEventListener("keydown",function(e){if($("game-screen").hidden||locked)return;var n=Number(e.key);if(n>=1&&n<=6){e.preventDefault();choose(n-1);}if((e.key==="Enter"||e.key===" ")&&picks.length===3){e.preventDefault();confirmSpin();}if(e.key==="Backspace"&&picks.length){e.preventDefault();undoPick();}if(e.key==="Escape")pause();});window.addEventListener("pagehide",persistCurrent);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
