/* ZERO RIOT v2: finite levels, optional zero bonuses, exact tap-to-move. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ZeroRiot=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const W=720,LEVELS=5,SPEED=190,COUNTS=[6,8,10,12,14];
  function seedNumber(value){let n=0;for(const c of String(value))n=(n*31+c.charCodeAt(0))%2147483646;return n+1;}
  function rng(seed){let s=seed;return()=>{s=s*16807%2147483647;return(s-1)/2147483646;};}
  function create(seed,level=1,carry={}){
    level=Math.max(1,Math.min(LEVELS,level));
    const bank={score:carry.score||0,novas:carry.novas||0,bestChain:carry.bestChain||0,kills:carry.kills||0,totalTime:carry.totalTime||0};
    const g={seed:String(seed),level,bank,random:rng(seedNumber(String(seed)+'/L'+level)),time:0,totalTime:bank.totalTime,charge:0,lives:3,score:bank.score,novas:bank.novas,bestChain:bank.bestChain,kills:bank.kills,chain:0,mass:0,flipCooldown:0,invulnerable:1,spawnAt:12,spawned:0,enemyQuota:Math.max(0,level-2),nextId:0,ended:false,won:false,campaignComplete:false,x:360,y:660,target:null,total:COUNTS[level-1],collected:0,pickups:[],enemies:[],events:[]};
    let slots=[];
    if(level===1)slots=[[260,500],[460,500],[200,340],[520,340],[260,180],[460,180]];
    else{for(let y=120;y<=570;y+=150)for(let x=120;x<=600;x+=160)slots.push([x,y]);for(let i=slots.length-1;i>0;i--){const j=Math.floor(g.random()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]];}}
    for(let i=0;i<g.total/2;i++){const v=level===1?i+1:1+Math.floor(g.random()*Math.min(5,level+1));for(let j=0;j<2;j++){const s=slots[i*2+j];g.pickups.push({id:++g.nextId,x:s[0],y:s[1],v:j===0?v:-v,wait:0});}}
    return g;
  }
  function nextLevel(g){return g.won&&!g.campaignComplete?create(g.seed,g.level+1,g):g;}
  function retryLevel(g){return create(g.seed,g.level,g.bank);}
  function setTarget(g,x,y){if(g.ended)return;let near=null,distance=52;for(const p of g.pickups){const d=Math.hypot(p.x-x,p.y-y);if(d<distance){near=p;distance=d;}}g.target=near?{x:near.x,y:near.y,id:near.id}:{x:Math.max(26,Math.min(694,x)),y:Math.max(50,Math.min(670,y)),id:null};}
  function cancelTarget(g){g.target=null;}
  function stickVector(x,y){const d=Math.hypot(x,y);if(d<=.1)return{x:0,y:0};const scale=Math.min(1,(d-.1)/.9)/d;return{x:x*scale,y:y*scale};}
  function hurt(g,reason){if(g.invulnerable>0||g.ended)return false;g.lives--;g.charge=0;g.chain=0;g.mass=0;g.invulnerable=2.5;g.events.push({type:'hurt',x:g.x,y:g.y,reason});if(g.lives<=0){g.ended=true;g.target=null;g.events.push({type:'end'});}return true;}
  function collect(g,p){
    if(g.ended)return false;const index=g.pickups.indexOf(p);if(index<0)return false;
    g.pickups.splice(index,1);g.collected++;g.charge+=p.v;g.chain++;g.mass+=Math.abs(p.v);g.score+=25;
    g.events.push({type:'collect',x:p.x,y:p.y,value:p.v});
    if(g.target&&g.target.id===p.id)g.target=null;
    if(g.charge===0){const radius=Math.min(310,180+g.mass*5);let destroyed=0;g.enemies=g.enemies.filter(e=>{if(Math.hypot(e.x-g.x,e.y-g.y)<=radius){destroyed++;g.events.push({type:'destroy',x:e.x,y:e.y});return false;}return true;});
      const points=100+g.mass*8+g.chain*g.chain*5+destroyed*100;g.score+=points;g.novas++;g.kills+=destroyed;g.bestChain=Math.max(g.bestChain,g.chain);g.events.push({type:'nova',x:g.x,y:g.y,radius,points,chain:g.chain});g.chain=0;g.mass=0;
    }
    // Clearing the board ALWAYS wins, regardless of charge, flips or prior hits.
    if(g.pickups.length===0){g.ended=true;g.won=true;g.campaignComplete=g.level===LEVELS;g.score+=200*g.level;g.target=null;g.events.push({type:'end'});}return true;
  }
  function flip(g){if(g.ended||g.flipCooldown>0)return false;for(const p of g.pickups)p.v=-p.v;g.flipCooldown=1;g.events.push({type:'flip',x:g.x,y:g.y});return true;}
  function spawn(g){
    const corners=[[34,65],[686,65],[34,650],[686,650]];let index=Math.floor(g.random()*4);let chosen=corners[index];
    for(let i=0;i<4&&Math.hypot(chosen[0]-g.x,chosen[1]-g.y)<200;i++){index=(index+1)%4;chosen=corners[index];}
    g.enemies.push({id:++g.nextId,x:chosen[0],y:chosen[1],type:'hunter',warning:1.4,age:0});g.spawned++;
  }
  function step(g,dt,input={}){
    if(g.ended)return;dt=Math.max(0,Math.min(.1,dt));g.time+=dt;g.totalTime+=dt;g.flipCooldown=Math.max(0,g.flipCooldown-dt);g.invulnerable=Math.max(0,g.invulnerable-dt);
    let dx=input.x||0,dy=input.y||0,len=Math.hypot(dx,dy);const manual=len>0;if(manual)g.target=null;if(len>1){dx/=len;dy/=len;}
    const targetId=g.target?g.target.id:null;
    if(g.target){const tx=g.target.x-g.x,ty=g.target.y-g.y,d=Math.hypot(tx,ty),travel=SPEED*dt;if(d<=travel){g.x=g.target.x;g.y=g.target.y;g.target=null;}else{g.x+=tx/d*travel;g.y+=ty/d*travel;}}
    else{g.x=Math.max(26,Math.min(694,g.x+dx*SPEED*dt));g.y=Math.max(50,Math.min(670,g.y+dy*SPEED*dt));}
    for(const p of [...g.pickups]){const radius=p.id===targetId?.001:26;if(Math.hypot(p.x-g.x,p.y-g.y)<=radius){collect(g,p);if(g.ended)return;}}
    if(g.spawned<g.enemyQuota&&g.time>=g.spawnAt){spawn(g);g.spawnAt=g.time+8;}
    for(let i=g.enemies.length-1;i>=0;i--){const e=g.enemies[i];e.age+=dt;if(e.warning>0){e.warning=Math.max(0,e.warning-dt);continue;}const d=Math.hypot(g.x-e.x,g.y-e.y)||1,speed=40+(g.level-3)*8;e.x+=(g.x-e.x)/d*speed*dt;e.y+=(g.y-e.y)/d*speed*dt;
      if(Math.hypot(e.x-g.x,e.y-g.y)<25&&hurt(g,'HUNTER HIT')){g.enemies.splice(i,1);if(g.ended)return;}
    }
  }
  return{W,LEVELS,SPEED,COUNTS,seedNumber,rng,create,nextLevel,retryLevel,setTarget,cancelTarget,stickVector,step,flip,collect,hurt};
});
