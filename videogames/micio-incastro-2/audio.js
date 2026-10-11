(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MicioAudio=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Four original themes. Each arrangement has 32 bars: A, variation, bridge, reprise.
  const THEMES=[
    {bpm:112,lead:'triangle',chords:[[50,62,66,69],[47,59,62,66],[43,55,59,62],[45,57,61,64],[50,62,66,69],[42,54,57,61],[43,55,59,62],[45,57,61,64]],melody:[
      [74,0,78,81,0,78,76,0],[74,71,0,74,78,0,76,74],[71,0,74,79,0,78,76,74],[73,76,0,81,78,0,76,0],
      [78,81,83,0,86,83,81,78],[73,0,78,81,0,78,76,73],[74,76,79,0,83,79,76,74],[73,76,78,81,78,76,74,0]]},
    {bpm:100,lead:'sine',chords:[[40,59,64,67],[48,60,64,67],[43,59,62,67],[47,59,62,66],[45,57,60,64],[40,59,64,67],[48,60,64,67],[47,59,63,66]],melody:[
      [76,0,0,79,83,0,79,0],[76,0,79,0,84,83,0,79],[74,0,0,79,81,0,79,74],[78,0,74,0,71,0,74,0],
      [81,0,84,83,81,0,76,0],[79,0,83,86,0,83,79,0],[84,83,79,0,76,0,79,0],[78,75,0,78,83,0,76,0]]},
    {bpm:124,lead:'triangle',chords:[[41,57,60,65],[48,55,60,64],[50,57,62,65],[46,58,62,65],[41,57,60,65],[45,57,60,64],[46,58,62,65],[48,55,60,64]],melody:[
      [77,81,0,84,86,84,0,81],[79,0,76,79,84,0,79,76],[77,81,86,0,89,86,81,0],[82,0,86,89,86,0,82,77],
      [84,86,89,0,88,84,81,77],[81,84,0,88,84,0,81,76],[77,82,86,89,86,82,0,77],[79,84,88,0,84,79,77,0]]},
    {bpm:108,lead:'sine',chords:[[45,60,64,69],[41,60,65,69],[48,60,64,67],[43,59,62,67],[38,57,62,65],[45,60,64,69],[41,60,65,69],[40,59,64,68]],melody:[
      [81,0,76,0,84,0,83,81],[77,0,81,84,0,89,0,84],[79,0,84,0,88,0,86,84],[83,0,79,0,74,79,0,83],
      [86,0,81,77,0,81,0,86],[84,0,81,76,0,72,0,76],[77,81,84,0,89,0,84,81],[80,0,83,88,0,83,81,0]]}
  ];
  const frequency=n=>440*Math.pow(2,(n-69)/12);
  function create(){return {
    ctx:null,bus:null,on:true,next:0,index:0,stage:0,voices:new Set(),lastFall:-1,
    enable(){try{if(!this.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;this.ctx=new C();this.bus=this.ctx.createGain();this.bus.gain.value=.38;this.bus.connect(this.ctx.destination);}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});return true;}catch{return false;}},
    note(note,duration=.5,volume=.07,when,type='sine',endNote=null){
      if(!this.on||!this.ctx||this.voices.size>=16)return;
      const c=this.ctx,t=when??c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=frequency(note);
      if(endNote!==null){o.frequency.setValueAtTime(frequency(note),t);o.frequency.exponentialRampToValueAtTime(frequency(endNote),t+duration);}
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,volume),t+.009);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
      o.connect(g);g.connect(this.bus);this.voices.add(o);o.onended=()=>{o.disconnect();g.disconnect();this.voices.delete(o);};o.start(t);o.stop(t+duration+.02);
    },
    stop(){for(const o of this.voices){try{o.stop();}catch{}}this.voices.clear();this.next=0;this.lastFall=-1;},
    setStage(stage){this.stop();this.stage=Math.max(0,Math.min(3,stage));this.index=0;},
    tick(mode='flow'){
      if(!this.on||!this.ctx||this.ctx.state!=='running')return;
      const theme=THEMES[this.stage],now=this.ctx.currentTime,beat=60/(theme.bpm-(mode==='chill'?12:0))/2;
      if(this.next<now-.2)this.next=now+.025;
      while(this.next<now+.12){
        const bar=Math.floor(this.index/8),step=this.index%8,section=Math.floor(bar/8),chord=theme.chords[bar%8];
        let note=theme.melody[bar%8][step];
        if(section===2)note=step%2===0?chord[1+(step/2)%3]+12:0;
        else if(section===1&&bar%2===1&&step===7)note=chord[2]+12;
        if(note)this.note(note,beat*(theme.lead==='sine'?1.6:.95),.072,this.next,theme.lead);
        if(step%2===0)this.note(chord[1+((step/2+section)%3)],beat*1.7,.038,this.next);
        if(step===0||step===4)this.note(chord[0],beat*3.3,.085,this.next);
        if(section!==2&&step===0)this.note(47,.12,.04,this.next,'sine',28);
        if(section===3&&step===6)this.note(chord[3]+12,beat*.8,.026,this.next,'triangle');
        this.index=(this.index+1)%256;this.next+=beat;
      }
    },
    fx(kind,chain=1){
      if(!this.on||!this.ctx)return;const t=this.ctx.currentTime,chord=THEMES[this.stage].chords[0];
      if(kind==='bee'){[71,74,71].forEach((n,i)=>this.note(n,.11,.035,t+i*.11,'triangle'));}
      else if(kind==='shoot'){this.note(88,.055,.065,t,'triangle');this.note(100,.08,.035,t+.035,'sine');}
      else if(kind==='hit'){this.note(79,.09,.055,t,'square');this.note(91,.12,.035,t+.045,'triangle');}
      else if(kind==='pollen'){[48,43].forEach((n,i)=>this.note(n,.13,.055,t+i*.07,'triangle'));}
      else if(kind==='honey'){[chord[1]+12,chord[2]+12,chord[3]+12].forEach((n,i)=>this.note(n,.35,.055,t+i*.08));}
      else if(kind==='stamp'){this.note(chord[3]+12,.18,.045,t);this.note(chord[1]+24,.22,.035,t+.07);}
      else if(kind==='fall'){if(t-this.lastFall<.16)return;this.lastFall=t;this.note(62,.055,.014,t,'sine',56);}
      else if(kind==='move')this.note(83,.035,.02,t);
      else if(kind==='rotate'){this.note(86,.08,.026,t,'sine',93);}
      else if(kind==='swap'){this.note(chord[2]+12,.13,.05,t,'triangle');this.note(chord[3]+12,.18,.045,t+.07);}
      else if(kind==='drop')this.note(96,.19,.06,t,'triangle',42);
      else if(kind==='lock'){this.note(52,.12,.055,t);this.note(64,.065,.025,t);}
      else if(kind==='clear'||kind==='purr'){
        const offset=Math.min(3,chain-1)*2;
        [chord[1]+12,chord[2]+12,chord[3]+12,chord[1]+24].forEach((n,i)=>this.note(n+offset,.38,.065,t+i*.075,'triangle'));
        if(kind==='purr')this.note(chord[0],.5,.07,t,'sine',chord[0]+12);
      }else if(kind==='win'||kind==='final'){
        const notes=[chord[1]+12,chord[2]+12,chord[3]+12,chord[1]+24];
        if(kind==='final')notes.push(chord[3]+12,chord[2]+12,chord[3]+12,chord[1]+24);
        notes.forEach((n,i)=>this.note(n,.55,.085,t+i*.15,'triangle'));
      }else if(kind==='lose')[64,59,52].forEach((n,i)=>this.note(n,.3,.05,t+i*.13,'triangle'));
    }
  };}
  return {create};
});
