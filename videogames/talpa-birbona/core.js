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
      this.player={x:1.5,y:0.5,facing:1,moving:false}; this.dug=Array(COLS*ROWS).fill(false);
      this.poison=Array(COLS*ROWS).fill(0); this.holes=[]; this.waves=[]; this.events=[];
      this.randomState=9187+level*7919;
      const count=Math.min(10,3+level);
      this.plants=Array.from({length:count},(_,i)=>({
        kind:ORDER[(i+level-1)%ORDER.length], x:3.5+i*22/(count-1),
        y:level===1?2.5+((i+level)%3):2.5+((i*3+level)%Math.min(8,level+3)), eaten:false
      }));
      this.remaining=count; this.total=count;
      this.difficulty={interval:Math.max(2.8,7.5-(level-1)*.45), warning:Math.max(1.4,2.8-(level-1)*.12),
        floodStep:Math.max(.32,.68-(level-1)*.034), farmerSpeed:4.5+level*.65};
      this.farmer={x:6.5, mode:'waiting', target:1, clock:level===1?6:Math.max(.6,2.5-(level-2)*.24), previous:-1};
      if(this.assist) {
        this.difficulty.interval*=1.3; this.difficulty.warning+=1;
        this.difficulty.floodStep*=1.35; this.difficulty.farmerSpeed*=.85; this.farmer.clock+=3;
      }
      this.dig(this.player.x,this.player.y);
    }
    random() { this.randomState=(this.randomState*16807)%2147483647; return this.randomState/2147483647; }
    dig(x,y) {
      const c=clamp(Math.floor(x),0,COLS-1), r=clamp(Math.floor(y),0,ROWS-1), k=index(c,r);
      if(!this.dug[k]) { this.dug[k]=true; this.events.push({type:'dig',x:c+.5,y:r+.5}); }
      if(r===0&&!this.holes.includes(c)) { this.holes.push(c); this.events.push({type:'hole',x:c+.5,y:0}); }
    }
    beginWave(c) {
      const k=index(c,0); this.poison[k]=Math.max(this.poison[k],5);
      this.waves.push({frontier:[k],seen:new Set([k]),clock:0,age:0});
      this.events.push({type:'pour',x:c+.5,y:0});
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
        wave.age+=dt; wave.clock+=dt;
        if(wave.clock<this.difficulty.floodStep||wave.age>18) continue;
        wave.clock-=this.difficulty.floodStep;
        const next=[];
        for(const k of wave.frontier) {
          const c=k%COLS,r=Math.floor(k/COLS);
          for(const [dc,dr] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nc=c+dc,nr=r+dr;
            if(nc<0||nc>=COLS||nr<0||nr>=ROWS) continue;
            const nk=index(nc,nr);
            if(this.dug[nk]&&!wave.seen.has(nk)) { wave.seen.add(nk); next.push(nk); this.poison[nk]=5; }
          }
        }
        wave.frontier=next;
      }
      this.waves=this.waves.filter(w=>w.age<=18&&w.frontier.length);
      if(this.poison[index(Math.floor(p.x),Math.floor(p.y))]>0&&this.invulnerable===0) {
        this.health--; this.invulnerable=1.8; this.events.push({type:'hurt',x:p.x,y:p.y});
        if(this.health<=0) { this.status='lost'; this.events.push({type:'lose'}); }
      }
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
        this.beginWave(f.target); f.mode='pouring'; f.clock=1.1;
      } else { f.mode='waiting'; f.clock=this.difficulty.interval; }
    }
    takeEvents() { const events=this.events; this.events=[]; return events; }
    retry() { this.start(this.level,this.startScore); }
    next() { if(this.status==='won') this.start(this.level+1,this.score); }
  }
  return {Game,CROPS,COLS,ROWS,LAST_LEVEL,SPEED};
});
