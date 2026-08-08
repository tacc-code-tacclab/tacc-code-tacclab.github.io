(function(){
  "use strict";

  var VERSION="forepath-cards-1.1.0";
  var TOTAL_TRIALS=60;
  var STORE_KEY="forepath_cards_session_v1";
  var cards=[
    {id:"flower",name:"Flower",valence:"positive",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 48C30 43 27 21 42 18c8-2 12 7 8 18 4-11 13-17 20-12 12 9 2 24-14 26 16 2 22 18 11 26-9 7-18-2-18-16-3 14-16 21-24 12-9-11 3-24 19-24Z" fill="#fff4d1" stroke="#196b52" stroke-width="3"/><circle cx="50" cy="49" r="9" fill="#d9a43b"/><path d="M49 58v30M48 70c-12-9-20-4-21 5 11 5 18 1 21-5Zm2 8c9-8 18-5 20 3-9 6-17 3-20-3Z" fill="none" stroke="#196b52" stroke-width="4" stroke-linecap="round"/></svg>'},
    {id:"ocean",name:"Ocean",valence:"positive",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="74" cy="25" r="12" fill="#f8d46b"/><path d="M3 57c12-11 22-11 34 0s22 11 34 0 21-10 28-3v29H3Z" fill="#e9faf8" opacity=".9"/><path d="M2 61c12-11 22-11 34 0s22 11 34 0 21-10 29-3M2 74c12-9 22-9 34 0s22 9 34 0 21-8 29-3" fill="none" stroke="#185a69" stroke-width="5"/></svg>'},
    {id:"stars",name:"Stars",valence:"neutral",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="m50 13 8 23 24 1-19 14 7 24-20-14-20 14 7-24-19-14 24-1Z" fill="#f4d77c"/><circle cx="18" cy="19" r="3" fill="#fff"/><circle cx="83" cy="18" r="2" fill="#fff"/><circle cx="83" cy="77" r="3" fill="#fff"/><circle cx="17" cy="80" r="2" fill="#fff"/></svg>'},
    {id:"snake",name:"Snake",valence:"negative",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M24 79c0-14 46-8 46-23 0-13-31-7-31-24 0-12 13-18 25-13" fill="none" stroke="#1b241f" stroke-width="11" stroke-linecap="round"/><path d="m59 18 25-8-8 24Z" fill="#1b241f"/><circle cx="74" cy="18" r="2" fill="#e9b24b"/><path d="m83 17 10-4m-10 4 9 4" stroke="#9f3a36" stroke-width="2"/></svg>'},
    {id:"storm",name:"Storm",valence:"negative",svg:'<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 53c-18-2-16-25 2-25 5-17 31-21 41-5 19-3 27 25 8 30Z" fill="#263846"/><path d="m49 50-14 25h14l-5 19 23-31H54l8-13Z" fill="#f5ce59"/><path d="M20 67 14 78m22-11-6 11m49-11-6 11" stroke="#236377" stroke-width="4" stroke-linecap="round"/></svg>'}
  ];

  var $=function(id){return document.getElementById(id);};
  var screens=["intro-screen","form-screen","instructions-screen","game-screen","break-screen","results-screen","stopped-screen"];
  var session=null;
  var phase="idle";
  var trialIndex=0;
  var practiceDone=false;
  var trialStartedAt=0;
  var trialLocked=false;
  var revealTimer=null;
  var resumeScreen="game-screen";

  function show(id){
    screens.forEach(function(name){var node=$(name);node.hidden=name!==id;node.classList.toggle("active",name===id);});
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function bytesHex(bytes){return Array.prototype.map.call(bytes,function(b){return b.toString(16).padStart(2,"0");}).join("");}
  function randomInt(max){
    var limit=Math.floor(4294967296/max)*max;
    var a=new Uint32Array(1);
    do{crypto.getRandomValues(a);}while(a[0]>=limit);
    return a[0]%max;
  }
  function randomId(){return "FP-"+bytesHex(crypto.getRandomValues(new Uint8Array(8))).toUpperCase();}
  function makeDeck(){var d=[];for(var i=0;i<TOTAL_TRIALS;i++)d.push(cards[randomInt(cards.length)].id);return d;}
  function commitmentPayload(s){return [s.protocol.version,s.participant_id,s.deck_salt,s.target_deck.join(",")].join("|");}
  function sha256(text){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(text)).then(function(buf){return bytesHex(new Uint8Array(buf));});}
  function now(){return new Date().toISOString();}

  function cardMarkup(card,interactive,index){
    var tag=interactive?"button":"div";
    var attrs=interactive?' type="button" data-card="'+card.id+'" aria-label="Choose '+card.name+'"':'';
    return "<"+tag+attrs+' class="target-card card-'+card.id+'"><span class="card-key">'+(index+1)+'</span><span class="card-art">'+card.svg+'</span><span class="card-name">'+card.name+"</span></"+tag+">";
  }
  function renderMiniDeck(){$("mini-deck").innerHTML=cards.map(function(c,i){return cardMarkup(c,false,i);}).join("");}
  function renderChoices(){
    $("card-grid").innerHTML=cards.map(function(c,i){return cardMarkup(c,true,i);}).join("");
    Array.prototype.forEach.call($("card-grid").querySelectorAll("button"),function(btn){btn.addEventListener("click",function(){choose(btn.dataset.card);});});
  }

  function formObject(form){
    var data={};new FormData(form).forEach(function(v,k){data[k]=v;});
    ["adult","consent","local"].forEach(function(k){data[k]=form.elements[k].checked;});
    return data;
  }
  function save(){if(session)localStorage.setItem(STORE_KEY,JSON.stringify(session));}
  function clear(){localStorage.removeItem(STORE_KEY);session=null;}

  function createSession(participant){
    var salt=bytesHex(crypto.getRandomValues(new Uint8Array(16)));
    session={
      schema:"forepath-session-1.1",
      protocol:{version:VERSION,total_trials:TOTAL_TRIALS,number_of_targets:5,chance_probability:0.2,stopping_rule:"60 completed experimental trials",feedback:"immediate",target_generation:"independent cryptographic uniform draw before practice",primary_outcome:"exact card matches"},
      participant_id:randomId(),created_at:now(),completed_at:null,status:"prepared",participant:participant,
      deck_salt:salt,target_deck:makeDeck(),deck_commitment:null,commitment_created_at:null,
      practice:[],trials:[],events:[{type:"session_created",at:now()}],
      client:{language:navigator.language||null,screen_bucket:(screen.width<600?"small":screen.width<1000?"medium":"large"),touch:navigator.maxTouchPoints>0},
      integrity:{commitment_verified:null,duplicate_trial_indices:false,complete:false}
    };
    return sha256(commitmentPayload(session)).then(function(hash){session.deck_commitment=hash;session.commitment_created_at=now();session.status="committed";save();return session;});
  }

  function prepareInstructions(){
    $("commitment-value").textContent=session.deck_commitment;
    $("start-practice").disabled=false;
    show("instructions-screen");
  }
  function beginPractice(){phase="practice";practiceDone=false;trialIndex=0;startTrial();}
  function beginExperiment(){phase="experiment";trialIndex=session.trials.length;session.status="in_progress";session.events.push({type:"experiment_started",at:now()});save();startTrial();}

  function startTrial(){
    clearTimeout(revealTimer);trialLocked=false;
    $("reveal").hidden=true;$("card-grid").hidden=false;$("confidence-block").hidden=false;
    $("confidence-range").value=50;$("confidence-output").value=50;
    Array.prototype.forEach.call($("card-grid").querySelectorAll("button"),function(b){b.disabled=false;b.classList.remove("selected");});
    if(phase==="practice"){
      $("phase-label").textContent="PRACTICE";$("trial-label").textContent="Practice trial";$("progress-fill").style.width="0%";
    }else{
      $("phase-label").textContent="SEALED DECK";$("trial-label").textContent="Card "+(trialIndex+1)+" of "+TOTAL_TRIALS;$("progress-fill").style.width=(trialIndex/TOTAL_TRIALS*100)+"%";
    }
    $("question-overline").textContent="SENSE THE NEXT CARD";$("question-title").textContent="Which one will appear?";$("question-help").textContent="Pause for a moment, then choose.";
    show("game-screen");trialStartedAt=performance.now();
  }

  function choose(cardId){
    if(trialLocked||phase==="idle")return;
    trialLocked=true;
    var clicked=$("card-grid").querySelector('[data-card="'+cardId+'"]');if(clicked)clicked.classList.add("selected");
    Array.prototype.forEach.call($("card-grid").querySelectorAll("button"),function(b){b.disabled=true;});
    var responseMs=Math.round(performance.now()-trialStartedAt);
    var confidence=Number($("confidence-range").value);
    var target=phase==="practice"?cards[randomInt(cards.length)].id:session.target_deck[trialIndex];
    var record={trial_index:phase==="practice"?0:trialIndex+1,choice:cardId,target:target,hit:cardId===target,confidence:confidence,response_ms:responseMs,choice_at:now(),reveal_at:null};
    if(phase==="practice")session.practice.push(record);else session.trials.push(record);
    save();
    $("question-overline").textContent="CHOICE LOCKED";$("question-title").textContent="Revealing the next card…";$("question-help").textContent="The target was already fixed.";
    revealTimer=setTimeout(function(){reveal(record);},500);
  }

  function reveal(record){
    record.reveal_at=now();save();
    var target=cards.filter(function(c){return c.id===record.target;})[0];
    $("revealed-card").innerHTML=cardMarkup(target,false,cards.indexOf(target));
    $("reveal-result").textContent=record.hit?"You matched it.":"Not this time.";
    $("reveal-result").style.color=record.hit?"var(--green)":"var(--muted)";
    $("card-grid").hidden=true;$("confidence-block").hidden=true;$("reveal").hidden=false;
    revealTimer=setTimeout(advance,1250);
  }

  function advance(){
    if(phase==="practice"){
      practiceDone=true;session.events.push({type:"practice_completed",at:now()});save();
      $("start-practice").textContent="Begin the 60-card study →";show("instructions-screen");return;
    }
    trialIndex=session.trials.length;
    if(trialIndex>=TOTAL_TRIALS){finish();return;}
    if(trialIndex===20||trialIndex===40){
      session.events.push({type:"break_started",after_trial:trialIndex,at:now()});save();
      $("break-copy").textContent="You have completed "+trialIndex+" of "+TOTAL_TRIALS+" trials. Take a breath; continue when ready.";show("break-screen");return;
    }
    startTrial();
  }

  function verifyCommitment(){return sha256(commitmentPayload(session)).then(function(hash){return hash===session.deck_commitment;});}
  function finish(){
    phase="idle";session.status="complete";session.completed_at=now();session.integrity.complete=session.trials.length===TOTAL_TRIALS;
    var seen={};session.integrity.duplicate_trial_indices=session.trials.some(function(t){if(seen[t.trial_index])return true;seen[t.trial_index]=true;return false;});
    verifyCommitment().then(function(ok){
      session.integrity.commitment_verified=ok;session.events.push({type:"session_completed",at:now()});save();
      var hits=session.trials.filter(function(t){return t.hit;}).length;
      var mean=session.trials.reduce(function(a,t){return a+t.confidence;},0)/session.trials.length;
      $("hits-result").textContent=hits+" / "+TOTAL_TRIALS;$("confidence-result").textContent=Math.round(mean)+" / 100";$("verification-result").textContent=ok?"Yes":"Failed";$("final-commitment").textContent=session.deck_commitment;show("results-screen");
    });
  }

  function exportRecord(partial){
    var copy=JSON.parse(JSON.stringify(session));
    copy.exported_at=now();copy.export_type=partial?"partial_blinded":"complete_unblinded";
    if(partial&&copy.status!=="complete"){
      copy.target_deck=copy.target_deck.slice(0,copy.trials.length);
      copy.deck_salt=null;copy.note="Future targets and the commitment salt are withheld in partial exports to preserve blinding.";
    }
    var blob=new Blob([JSON.stringify(copy,null,2)],{type:"application/json"});
    var url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="FOREPATH_"+copy.participant_id+"_"+(partial?"partial":"complete")+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);
    session.events.push({type:partial?"partial_downloaded":"complete_downloaded",at:now()});save();
  }

  function stopSession(){if(phase!=="practice"&&phase!=="experiment")return;clearTimeout(revealTimer);resumeScreen="game-screen";session.events.push({type:"session_paused",at:now(),after_trials:session.trials.length});save();show("stopped-screen");}
  function resumeSession(){session.events.push({type:"session_resumed",at:now()});save();startTrial();}
  function deleteAndLeave(){if(!confirm("Delete this local FOREPATH session? This cannot be undone."))return;clear();phase="idle";location.reload();}

  function init(){
    renderMiniDeck();renderChoices();
    $("enter-study").addEventListener("click",function(){show("form-screen");});
    $("form-back").addEventListener("click",function(){show("intro-screen");});
    $("participant-form").addEventListener("submit",function(e){e.preventDefault();var form=e.currentTarget;if(!form.checkValidity()){$("form-error").hidden=false;form.reportValidity();return;}$("form-error").hidden=true;$("start-practice").disabled=true;show("instructions-screen");createSession(formObject(form)).then(prepareInstructions).catch(function(){alert("The secure browser random-number generator is unavailable. Please use a current HTTPS browser.");show("form-screen");});});
    $("copy-commitment").addEventListener("click",function(){navigator.clipboard&&navigator.clipboard.writeText(session.deck_commitment);$("copy-commitment").textContent="Copied";});
    $("start-practice").addEventListener("click",function(){if(practiceDone)beginExperiment();else beginPractice();});$("continue-button").addEventListener("click",startTrial);$("stop-button").addEventListener("click",stopSession);$("resume-button").addEventListener("click",resumeSession);
    $("download-button").addEventListener("click",function(){exportRecord(false);});$("decline-download").addEventListener("click",function(){session.events.push({type:"download_declined",at:now()});save();});$("partial-button").addEventListener("click",function(){exportRecord(true);});$("delete-button").addEventListener("click",deleteAndLeave);$("leave-button").addEventListener("click",deleteAndLeave);
    $("confidence-range").addEventListener("input",function(){$("confidence-output").value=this.value;});
    $("fullscreen-button").addEventListener("click",function(){if(!document.fullscreenElement){document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();}else{document.exitFullscreen&&document.exitFullscreen();}});
    document.addEventListener("fullscreenchange",function(){$("fullscreen-button").querySelector("span").textContent=document.fullscreenElement?"Exit":"Fullscreen";});
    document.addEventListener("keydown",function(e){if(phase!=="practice"&&phase!=="experiment")return;if(e.key==="Escape"){stopSession();return;}var n=Number(e.key);if(n>=1&&n<=5){e.preventDefault();choose(cards[n-1].id);}});
    window.addEventListener("beforeunload",function(){save();});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
