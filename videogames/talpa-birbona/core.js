/* Pure, deterministic game rules. No browser APIs and no network requests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TalpaCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const COLS = 28, ROWS = 14, LAST_LEVEL = 10, SPEED = 4.6;
  const CROPS = [
    {name:'Carota', points:100, sprite:2, color:'#ff923f'},
    {name:'Patate', points:120, sprite:3, color:'#efc788'},
    {name:'Cavolo', points:140, sprite:4, color:'#a4df69'},
    {name:'Pero', points:300, sprite:5, color:'#e9e858'},
    {name:'Melo', points:280, sprite:6, color:'#ff676c'},
    {name:'Albicocco', points:320, sprite:7, color:'#ffb74d'},
    {name:'Grano', points:80, sprite:8, color:'#ffe087'},
    {name:'Pomodori', points:160, sprite:9, color:'#ff6961'},
    {name:'Zucchini', points:180, sprite:10, color:'#95d256'},
    {name:'Melanzane', points:200, sprite:11, color:'#c197f5'}
  ];
  const ORDER = [0,1,2,7,8,9,3,4,5,6];
  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
  const index = (c,r) => r*COLS+c;
  class Game {
    constructor(level=1, score=0, options={}) { this.assist=Boolean(options.assist); this.start(level, score); }
    start(level=1, score=0) {
      this.level = clamp(level,1,LAST_LEVEL); this.score=score; this.startScore=score;
      this.status='playing'; this.time=0; this.health=3; this.invulnerable=0;
      this.player={x:1.5,y:0.5,facing:1,moving:false}; this.dug=Array(COLS*ROWS).fill(false); this.antDug=Array(COLS*ROWS).fill(false);
      this.poison=Array(COLS*ROWS).fill(0); this.holes=[]; this.waves=[]; this.ants=[]; this.events=[];
      this.randomState=9187+level*7919;
      const count=Math.min(10,3+level);
      this.plants=Array.from({length:count},(_,i)=>({
        kind:ORDER[(i+level-1)%ORDER.length], x:3.5+i*22/(count-1),
        y:level===1?2.5+((i+level)%3):2.5+((i*3+level)%Math.min(8,level+3)), eaten:false
      }));
      this.remaining=count; this.total=count;
      this.difficulty={
        interval:Math.max(1.2,3.4-(level-1)*.24),
        warning:Math.max(.45,1.05-(level-1)*.065),
        floodStep:Math.max(.08,.23-(level-1)*.016),
        poisonLife:4,
        farmerSpeed:9.2+level*1.25,
        antCount:level===1?0:Math.min(5,Math.floor(level/2)),
        antSpeed:1.35+level*.16,
        antSpawn:Math.max(2.6,4.5-(level-2)*.22)
      };
      this.farmer={x:6.5, mode:'waiting', target:1, clock:level===1?1.8:Math.max(.35,1-(level-2)*.075), previous:-1};
      this.antClock=level===1?Infinity:Math.max(2.3,3.8-(level-2)*.16);
      if(this.assist) {
        this.difficulty.interval*=1.08; this.difficulty.warning+=.15;
        this.difficulty.floodStep*=1.08; this.difficulty.farmerSpeed*=.96;
        this.difficulty.antSpeed*=.94; this.farmer.clock+=.35; this.antClock+=.45;
      }
      this.dig(this.player.x,this.player.y);
    }
    random() { this.randomState=(this.randomState*16807)%2147483647; return this.randomState/2147483647; }
    makeWave(k) {
      const arrival=new Float64Array(COLS*ROWS);arrival.fill(Infinity);arrival[k]=0;
      return {pending:[{k,at:0}],arrival,seen:new Set([k]),frontier:[k],age:0};
    }
    flowDelay(dr) {
      // Gravity makes downward flow fast; climbing against it is deliberately slow.
      const directionFactor=dr>0?.46:dr<0?2.6:1;
      return this.difficulty.floodStep*directionFactor;
    }
    injectWaveCell(wave,k) {
      if(wave.arrival[k]<=wave.age)return;
      wave.arrival[k]=wave.age;wave.seen.add(k);wave.pending.push({k,at:wave.age});
      if(!wave.frontier.includes(k))wave.frontier.push(k);
    }
    carryPoisonIntoAntTunnel(k,c,r) {
      const neighbors=[[c+1,r],[c-1,r],[c,r+1],[c,r-1]]
        .filter(([nc,nr])=>nc>=0&&nc<COLS&&nr>=0&&nr<ROWS).map(([nc,nr])=>index(nc,nr));
      const poisoned=neighbors.find(nk=>this.poison[nk]>0);
      if(poisoned===undefined)return;
      this.poison[k]=Math.max(this.poison[k],this.difficulty.poisonLife);
      const wave=this.waves.find(candidate=>candidate.seen.has(poisoned));
      if(wave)this.injectWaveCell(wave,k);
      else this.waves.push(this.makeWave(k));
      this.events.push({type:'poisonBreach',x:c+.5,y:r+.5});
    }
    dig(x,y,source='mole') {
      const c=clamp(Math.floor(x),0,COLS-1), r=clamp(Math.floor(y),0,ROWS-1), k=index(c,r);
      if(!this.dug[k]) {
        this.dug[k]=true;if(source==='ant')this.antDug[k]=true;
        this.events.push({type:'dig',source,x:c+.5,y:r+.5});
        if(source==='ant')this.carryPoisonIntoAntTunnel(k,c,r);
      }
      if(r===0&&!this.holes.includes(c)) { this.holes.push(c); this.events.push({type:'hole',source,x:c+.5,y:0}); }
    }
    beginWave(c) {
      const k=index(c,0); this.poison[k]=Math.max(this.poison[k],this.difficulty.poisonLife);
      this.waves.push(this.makeWave(k));
      this.events.push({type:'pour',x:c+.5,y:0});
    }
    antPosition() {
      const candidates=[
        {x:.75,y:2+this.random()*(ROWS-2.75)},
        {x:COLS-.75,y:2+this.random()*(ROWS-2.75)},
        {x:2+this.random()*(COLS-4),y:ROWS-.75}
      ];
      return candidates.reduce((best,p)=>Math.hypot(p.x-this.player.x,p.y-this.player.y)>Math.hypot(best.x-this.player.x,best.y-this.player.y)?p:best);
    }
    spawnAnt() {
      const position=this.antPosition();
      const ant={x:position.x,y:position.y,vx:0,vy:0,facing:position.x<this.player.x?1:-1,phase:this.random()*Math.PI*2,cooldown:.45};
      this.ants.push(ant);this.dig(ant.x,ant.y,'ant');this.events.push({type:'antSpawn',x:ant.x,y:ant.y,count:this.ants.length});
    }
    moveAntAway(ant) {
      const position=this.antPosition();
      ant.x=position.x; ant.y=position.y; ant.vx=0; ant.vy=0; ant.cooldown=1.15;this.dig(ant.x,ant.y,'ant');
    }
    hurtPlayer(source,x=this.player.x,y=this.player.y) {
      if(this.invulnerable>0||this.status!=='playing') return false;
      this.health--; this.invulnerable=1.8; const fatal=this.health<=0;
      this.events.push({type:'hurt',source,x,y,fatal});
      if(fatal) { this.status='lost'; this.events.push({type:'lose',source}); }
      return true;
    }
    killPlayer(source,x=this.player.x,y=this.player.y) {
      if(this.status!=='playing') return false;
      this.health=0; this.invulnerable=0;
      this.events.push({type:'hurt',source,x,y,fatal:true});
      this.status='lost'; this.events.push({type:'lose',source});
      return true;
    }
    poisonTouchesPlayer() {
      const p=this.player;
      if(this.poison[index(Math.floor(p.x),Math.floor(p.y))]<=0) return false;
      return this.killPlayer('poison',p.x,p.y);
    }
    update(dt,dx=0,dy=0) {
      if(this.status!=='playing'||!Number.isFinite(dt)||dt<=0) return;
      // Bound each step so fast input cannot skip a root or a tunnel cell.
      let left=Math.min(dt,.25);
      while(left>1e-8&&this.status==='playing') { const step=Math.min(left,1/60); this.step(step,dx,dy); left-=step; }
    }
    step(dt,dx,dy) {
      this.time+=dt; this.invulnerable=Math.max(0,this.invulnerable-dt);
      const p=this.player, length=Math.hypot(dx,dy);
      p.moving=length>.01;
      if(length>.01) {
        const speed=SPEED, strength=Math.min(1,length);
        const nx=clamp(p.x+dx/length*speed*strength*dt,.5,COLS-.5);
        const ny=clamp(p.y+dy/length*speed*strength*dt,.5,ROWS-.5);
        // Fill both orthogonal neighbors on diagonal crossings: tunnels stay connected.
        if(Math.floor(nx)!==Math.floor(p.x)&&Math.floor(ny)!==Math.floor(p.y)) this.dig(nx,p.y);
        p.x=nx; p.y=ny; if(Math.abs(dx)>.01) p.facing=dx>0?1:-1; this.dig(p.x,p.y);
      }
      // Poison is lethal on the first frame of contact, even during an ant grace period.
      if(this.poisonTouchesPlayer()) return;
      for(const plant of this.plants) {
        if(!plant.eaten&&Math.hypot(plant.x-p.x,plant.y-p.y)<.72) {
          plant.eaten=true; this.remaining--; const crop=CROPS[plant.kind]; this.score+=crop.points;
          // The uprooted plant leaves a shaft to the surface, and a fresh hole for the farmer.
          for(let r=0;r<=Math.floor(plant.y);r++) this.dig(plant.x,r+.5);
          this.events.push({type:'eat',x:plant.x,y:plant.y,points:crop.points,kind:plant.kind});
        }
      }
      if(this.remaining===0) {
        const bonus=this.health*100; this.score+=bonus; this.bonus=bonus;
        this.status=this.level===LAST_LEVEL?'complete':'won'; this.events.push({type:'win'}); return;
      }
      this.updateFarmer(dt);
      for(let i=0;i<this.poison.length;i++) this.poison[i]=Math.max(0,this.poison[i]-dt);
      for(const wave of this.waves) {
        wave.age+=dt;
        if(wave.age>13)continue;
        const ready=[],waiting=[];
        for(const entry of wave.pending)(entry.at<=wave.age+1e-9?ready:waiting).push(entry);
        wave.pending=waiting;ready.sort((a,b)=>a.at-b.at);const activated=[];
        for(const entry of ready) {
          if(Math.abs(wave.arrival[entry.k]-entry.at)>1e-9)continue;
          const k=entry.k,c=k%COLS,r=Math.floor(k/COLS);activated.push(k);
          this.poison[k]=Math.max(this.poison[k],this.difficulty.poisonLife);
          for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nc=c+dc,nr=r+dr;
            if(nc<0||nc>=COLS||nr<0||nr>=ROWS)continue;
            const nk=index(nc,nr),at=entry.at+this.flowDelay(dr);
            if(this.dug[nk]&&at+1e-9<wave.arrival[nk]){wave.arrival[nk]=at;wave.seen.add(nk);wave.pending.push({k:nk,at});}
          }
        }
        if(activated.length)wave.frontier=activated;
      }
      this.waves=this.waves.filter(w=>w.age<=13&&w.pending.length);
      if(this.poisonTouchesPlayer()) return;
      this.updateAnts(dt);
      if(this.status==='playing') this.poisonTouchesPlayer();
    }
    updateFarmer(dt) {
      const f=this.farmer;
      if(f.mode==='walking') {
        const distance=f.target+.5-f.x, step=this.difficulty.farmerSpeed*dt;
        if(Math.abs(distance)<=step) { f.x=f.target+.5; f.mode='warning'; f.clock=this.difficulty.warning;
          this.events.push({type:'warning',x:f.x,y:0});
        } else f.x+=Math.sign(distance)*step;
        return;
      }
      f.clock-=dt;
      if(f.clock>0) return;
      if(f.mode==='waiting') {
        const candidates=this.holes.filter(c=>c!==f.previous).slice(-3);
        const choices=candidates.length?candidates:this.holes;
        f.target=choices[Math.floor(this.random()*choices.length)]; f.previous=f.target; f.mode='walking';
      } else if(f.mode==='warning') {
        this.beginWave(f.target); f.mode='pouring'; f.clock=.32;
      } else { f.mode='waiting'; f.clock=this.difficulty.interval; }
    }
    updateAnts(dt) {
      this.antClock-=dt;
      if(this.ants.length<this.difficulty.antCount&&this.antClock<=0) {
        this.spawnAnt(); this.antClock=this.difficulty.antSpawn;
      }
      for(const ant of this.ants) {
        ant.cooldown=Math.max(0,ant.cooldown-dt);
        if(ant.cooldown>0) continue;
        const dx=this.player.x-ant.x,dy=this.player.y-ant.y,distance=Math.hypot(dx,dy);
        if(distance>.001) {
          const oldX=ant.x,oldY=ant.y;
          const sway=Math.sin(this.time*1.8+ant.phase)*.16;
          const ux=dx/distance,uy=dy/distance;
          ant.vx=ux-uy*sway; ant.vy=uy+ux*sway;
          const length=Math.hypot(ant.vx,ant.vy)||1;
          ant.vx/=length; ant.vy/=length; ant.facing=ant.vx>=0?1:-1;
          ant.x=clamp(ant.x+ant.vx*this.difficulty.antSpeed*dt,.45,COLS-.45);
          ant.y=clamp(ant.y+ant.vy*this.difficulty.antSpeed*dt,.45,ROWS-.45);
          if(Math.floor(ant.x)!==Math.floor(oldX)&&Math.floor(ant.y)!==Math.floor(oldY))this.dig(ant.x,oldY,'ant');
          this.dig(ant.x,ant.y,'ant');
        }
        if(Math.hypot(this.player.x-ant.x,this.player.y-ant.y)<.62) {
          this.hurtPlayer('ant',ant.x,ant.y); this.moveAntAway(ant);
          if(this.status!=='playing') break;
        }
      }
    }
    takeEvents() { const events=this.events; this.events=[]; return events; }
    retry() { this.start(this.level,this.startScore); }
    next() { if(this.status==='won') this.start(this.level+1,this.score); }
  }
  return {Game,CROPS,COLS,ROWS,LAST_LEVEL,SPEED};
});
