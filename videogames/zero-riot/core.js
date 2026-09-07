/* ZERO RIOT simulation. Fixed 1/60 s steps; portable rules mirrored in Roblox. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ZeroRiot=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const W=720,DURATION=90,LIMIT=9;
  function seedNumber(value){let n=0;for(const c of String(value))n=(n*31+c.charCodeAt(0))%2147483646;return n+1;}
  function rng(seed){let s=seed;return()=>{s=s*16807%2147483647;return(s-1)/2147483646;};}
  function create(seed){
    const g={seed:String(seed),random:rng(seedNumber(seed)),time:0,charge:0,lives:3,score:0,novas:0,bestChain:0,kills:0,chain:0,mass:0,peak:0,flipCooldown:0,invulnerable:1,collectCooldown:0,spawnAt:5,nextId:0,ended:false,won:false,x:360,y:390,pickups:[],enemies:[],events:[]};
    // A readable first decision: +3, +4, -7; other charges form signed pairs.
    for(const [x,y,v] of [[450,390,3],[520,460,4],[400,520,-7]])g.pickups.push({id:++g.nextId,x,y,v,wait:0});
    for(let i=0;i<8;i++){const v=1+Math.floor(g.random()*7);addPickup(g,v);addPickup(g,-v);}return g;
  }
  function position(g){let x,y;for(let tries=0;tries<80;tries++){x=45+g.random()*630;y=65+g.random()*590;if(Math.hypot(x-g.x,y-g.y)<90)continue;if(g.pickups.some(p=>Math.hypot(p.x-x,p.y-y)<56))continue;return{x,y};}return{x,y};}
  function addPickup(g,v){g.pickups.push({id:++g.nextId,...position(g),v,wait:.3});}
  function hurt(g,reason){if(g.invulnerable>0||g.ended)return false;g.lives--;g.charge=0;g.chain=0;g.mass=0;g.peak=0;g.invulnerable=1.8;g.collectCooldown=.25;g.events.push({type:'hurt',x:g.x,y:g.y,reason});if(g.lives<=0){g.ended=true;g.events.push({type:'end'});}return true;}
  function collect(g,p){
    if(g.ended)return;
    const result=g.charge+p.v;
    g.events.push({type:'collect',x:p.x,y:p.y,value:p.v});
    if(Math.abs(result)>LIMIT){if(g.invulnerable>0){g.events.push({type:'blocked',x:g.x,y:g.y});}else hurt(g,'OVERLOAD');return;}
    g.charge=result;g.chain++;g.mass+=Math.abs(p.v);g.peak=Math.max(g.peak,Math.abs(result));
    if(result===0){
      const radius=Math.min(285,120+g.mass*5);let destroyed=0;
      g.enemies=g.enemies.filter(e=>{if(Math.hypot(e.x-g.x,e.y-g.y)<=radius){destroyed++;g.events.push({type:'destroy',x:e.x,y:e.y});return false;}return true;});
      const points=100+g.mass*12+g.chain*g.chain*10+g.peak*15+destroyed*100;
      g.score+=points;g.novas++;g.kills+=destroyed;g.bestChain=Math.max(g.bestChain,g.chain);
      g.events.push({type:'nova',x:g.x,y:g.y,radius,points,chain:g.chain});g.chain=0;g.mass=0;g.peak=0;
    }
  }
  function flip(g){if(g.ended||g.flipCooldown>0)return false;for(const p of g.pickups)p.v=-p.v;g.flipCooldown=2;g.events.push({type:'flip',x:g.x,y:g.y});return true;}
  function spawn(g){
    const side=Math.floor(g.random()*4),t=60+g.random()*600;
    const x=side===0?24:side===1?696:t,y=side===2?40:side===3?680:t;
    const dart=g.time>=30&&g.random()<.4,angle=Math.atan2(g.y-y,g.x-x);
    g.enemies.push({id:++g.nextId,x,y,type:dart?'dart':'hunter',warning:.9,age:0,dx:Math.cos(angle),dy:Math.sin(angle)});
  }
  function step(g,dt,input={}){
    if(g.ended)return;g.time=Math.min(DURATION,g.time+dt);g.flipCooldown=Math.max(0,g.flipCooldown-dt);g.invulnerable=Math.max(0,g.invulnerable-dt);g.collectCooldown=Math.max(0,g.collectCooldown-dt);
    let dx=input.x||0,dy=input.y||0,len=Math.hypot(dx,dy);if(len>1){dx/=len;dy/=len;}
    g.x=Math.max(24,Math.min(696,g.x+dx*235*dt));g.y=Math.max(45,Math.min(675,g.y+dy*235*dt));
    for(const p of g.pickups){p.wait=Math.max(0,p.wait-dt);if(p.wait===0&&g.collectCooldown===0&&Math.hypot(p.x-g.x,p.y-g.y)<33){collect(g,p);Object.assign(p,position(g),{v:(g.random()<.5?-1:1)*(1+Math.floor(g.random()*7)),wait:.65});g.collectCooldown=.11;if(g.ended)return;}}
    // Ensure a route out always exists, including at charge ±8/±9.
    if(g.charge!==0&&!g.pickups.some(p=>p.v===-g.charge&&p.wait===0)){const p=g.pickups.reduce((a,b)=>Math.hypot(a.x-g.x,a.y-g.y)>Math.hypot(b.x-g.x,b.y-g.y)?a:b);p.v=-g.charge;}
    if(g.time>=g.spawnAt){if(g.enemies.length<22)spawn(g);g.spawnAt=g.time+Math.max(.9,2.7-g.time*.021);}
    for(let i=g.enemies.length-1;i>=0;i--){const e=g.enemies[i];e.age+=dt;if(e.warning>0){e.warning-=dt;continue;}let ex=e.dx,ey=e.dy;
      if(e.type==='hunter'){const d=Math.hypot(g.x-e.x,g.y-e.y)||1;ex=(g.x-e.x)/d;ey=(g.y-e.y)/d;}
      const speed=e.type==='dart'?235:62+g.time*.55;e.x+=ex*speed*dt;e.y+=ey*speed*dt;
      if(e.x< -50||e.x>770||e.y< -50||e.y>770){g.enemies.splice(i,1);continue;}
      if(Math.hypot(e.x-g.x,e.y-g.y)<30&&hurt(g,'HUNTER HIT')){g.enemies.splice(i,1);if(g.ended)return;}
    }
    if(g.time>=DURATION){g.ended=true;g.won=true;g.score+=g.lives*300;g.events.push({type:'end'});}
  }
  return{W,DURATION,LIMIT,seedNumber,rng,create,step,flip,collect,hurt};
});
