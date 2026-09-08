/* Bubble Riot / ZERO RIOT v3. Deterministic maths, connected groups and ray collisions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ZeroRiot=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const W=720,H=900,CX=360,CY=802,BR=32,SR=17,SPEED=820;
const LEVELS=[
 {target:5,op:'+',rows:2,cols:6,name:'FIRST POPS',bumpers:0},
 {target:6,op:'+',rows:3,cols:6,name:'SWEET SIX',bumpers:0},
 {target:8,op:'+',rows:3,cols:7,name:'BUBBLE GROVE',bumpers:0},
 {target:10,op:'+',rows:3,cols:7,name:'BOUNCE TO TEN',bumpers:1},
 {target:12,op:'+',rows:4,cols:7,name:'CLOUD GARDEN',bumpers:1},
 {target:15,op:'+',rows:4,cols:8,name:'DOUBLE BOUNCE',bumpers:2},
 {target:12,op:'×',rows:3,cols:6,name:'MULTIPLY THE FUN',bumpers:0},
 {target:18,op:'×',rows:3,cols:7,name:'MAGIC MULTIPLES',bumpers:1},
 {target:24,op:'×',rows:4,cols:7,name:'CRYSTAL CANOPY',bumpers:1},
 {target:30,op:'+',rows:4,cols:8,name:'BIG SUMS',bumpers:2},
 {target:36,op:'×',rows:4,cols:8,name:'STAR BLOSSOM',bumpers:2},
 {target:48,op:'×',rows:5,cols:8,name:'THE GRAND BLOOM',bumpers:2}
];
function seedNumber(value){let n=0;for(const c of String(value))n=(n*31+c.charCodeAt(0))%2147483646;return n+1;}
function rng(seed){let s=seed;return()=>{s=s*16807%2147483647;return(s-1)/2147483646;};}
function valueOf(g,v,ammo){return g.config.op==='+'?v+ammo:v*ammo;}
function required(g,v){return g.config.op==='+'?g.config.target-v:g.config.target/v;}
function create(seed,level=1,carry={}){
 level=Math.max(1,Math.min(LEVELS.length,Math.floor(level)));const config=LEVELS[level-1],random=rng(seedNumber(String(seed)+'/B'+level));
 const bank={score:carry.score||0,totalStars:carry.totalStars||0};
 const g={seed:String(seed),level,config,random,bank,score:bank.score,totalStars:bank.totalStars,stars:0,time:0,shots:0,misses:0,combo:0,power:0,rainbowReady:false,selected:0,ammo:[],angle:0,projectile:null,cooldown:0,ended:false,won:false,campaignComplete:false,bubbles:[],bumpers:[],events:[],nextId:0};
 const values=[];if(config.op==='+'){for(let v=1;v<config.target;v++)values.push(v);}else for(let v=2;v<config.target;v++)if(config.target%v===0)values.push(v);
 const start=(W-(config.cols-1)*76-38)/2;
 for(let row=0;row<config.rows;row++){let value=0;for(let col=0;col<config.cols;col++){if(col%3===0)value=level===1?1+row*2+Math.floor(col/3):values[Math.floor(random()*values.length)];g.bubbles.push({id:++g.nextId,x:start+col*76+(row%2)*38,y:132+row*66,v:value,row,color:value%6});}}
 if(config.bumpers>=1)g.bumpers.push({x:config.bumpers===1?260:210,y:525,r:40});if(config.bumpers>=2)g.bumpers.push({x:510,y:558,r:40});
 g.initial=g.bubbles.length;refreshAmmo(g);return g;
}
function nextLevel(g){return g.won&&!g.campaignComplete?create(g.seed,g.level+1,g):g;}
function retryLevel(g){return create(g.seed,g.level,g.bank);}
function aim(g,x,y){g.angle=Math.max(-1.16,Math.min(1.16,Math.atan2(x-CX,CY-y)));return g.angle;}
function select(g,index){if(!g.projectile&&!g.ended&&index>=0&&index<3)g.selected=index;}
function rayCircle(x,y,dx,dy,cx,cy,r){const ox=x-cx,oy=y-cy,b=ox*dx+oy*dy,c=ox*ox+oy*oy-r*r,d=b*b-c;if(d<0)return Infinity;const t=-b-Math.sqrt(d);return t>.001?t:Infinity;}
function cast(g,x,y,dx,dy,max=2000){let hit={kind:'none',d:max};function accept(kind,d,data){if(d>.001&&d<hit.d)hit={kind,d,...data};}
 if(dx< -1e-9)accept('wall',(35-x)/dx,{nx:1,ny:0});if(dx>1e-9)accept('wall',(685-x)/dx,{nx:-1,ny:0});
 if(dy< -1e-9)accept('ceiling',(55-y)/dy,{});if(dy>1e-9)accept('floor',(865-y)/dy,{});
 for(const b of g.bubbles)accept('bubble',rayCircle(x,y,dx,dy,b.x,b.y,BR+SR),{id:b.id});
 for(const b of g.bumpers){const d=rayCircle(x,y,dx,dy,b.x,b.y,b.r+SR);if(d<hit.d){const hx=x+dx*d,hy=y+dy*d;accept('bumper',d,{nx:(hx-b.x)/(b.r+SR),ny:(hy-b.y)/(b.r+SR)});}}
 return hit;
}
function reflect(dx,dy,nx,ny){const dot=dx*nx+dy*ny;return{dx:dx-2*dot*nx,dy:dy-2*dot*ny};}
function trace(g,angle=g.angle){let x=CX,y=CY,dx=Math.sin(angle),dy=-Math.cos(angle),points=[{x,y}];
 for(let i=0;i<7;i++){const h=cast(g,x,y,dx,dy);x+=dx*h.d;y+=dy*h.d;points.push({x,y});if(h.kind==='bubble')return{points,hitId:h.id};if(h.kind!=='wall'&&h.kind!=='bumper')break;const r=reflect(dx,dy,h.nx,h.ny);dx=r.dx;dy=r.dy;x+=dx*.02;y+=dy*.02;}
 return{points,hitId:null};
}
function refreshAmmo(g){if(!g.bubbles.length){g.ammo=[1,2,3];return;}const seen=new Set(),choices=[];
 function add(angle){const id=trace(g,angle).hitId,b=g.bubbles.find(b=>b.id===id);if(b){const n=required(g,b.v);if(Number.isInteger(n)&&n>0&&!seen.has(n)){seen.add(n);choices.push(n);}}}
 add(g.angle);add(0);for(let i=0;i<=80;i++)add(-1.16+i*2.32/80);
 // Every level has an unobstructed route; this also keeps hand-authored boards usable.
 if(!choices.length)for(const b of g.bubbles){const n=required(g,b.v);if(!seen.has(n)){seen.add(n);choices.push(n);}}
 const first=choices.shift();for(let i=choices.length-1;i>0;i--){const j=Math.floor(g.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}choices.unshift(first);
 g.ammo=[choices[0],choices[1]||choices[0],choices[2]||choices[1]||choices[0]];g.selected=0;
}
function connected(g,start,sameValue){const found=new Set([start.id]),queue=[start];while(queue.length){const a=queue.shift();for(const b of g.bubbles)if(!found.has(b.id)&&(!sameValue||b.v===start.v)&&Math.hypot(a.x-b.x,a.y-b.y)<83){found.add(b.id);queue.push(b);}}return found;}
function miss(g,message,x,y){g.misses++;g.combo=0;g.power=0;g.events.push({type:'miss',message,x:x||CX,y:y||CY-100});g.projectile=null;g.cooldown=.25;refreshAmmo(g);}
function resolve(g,id,shot){const b=g.bubbles.find(b=>b.id===id);if(!b)return;
 const result=valueOf(g,b.v,shot.value);if(!shot.rainbow&&result!==g.config.target){miss(g,`${b.v} ${g.config.op} ${shot.value} = ${result} · aim for ${g.config.target}`,b.x,b.y);return;}
 const ids=connected(g,b,true);if(shot.rainbow)for(const q of g.bubbles)if(Math.hypot(q.x-b.x,q.y-b.y)<155)ids.add(q.id);
 const popped=g.bubbles.filter(q=>ids.has(q.id));g.bubbles=g.bubbles.filter(q=>!ids.has(q.id));
 const anchored=new Set(),queue=g.bubbles.filter(q=>q.row===0);for(const q of queue)anchored.add(q.id);while(queue.length){const q=queue.shift();for(const other of g.bubbles)if(!anchored.has(other.id)&&Math.hypot(q.x-other.x,q.y-other.y)<83){anchored.add(other.id);queue.push(other);}}
 const dropped=g.bubbles.filter(q=>!anchored.has(q.id));g.bubbles=g.bubbles.filter(q=>anchored.has(q.id));
 g.combo++;if(!shot.rainbow){g.power++;if(g.power>=3){g.rainbowReady=true;g.power=0;g.events.push({type:'ready'});}}
 const points=popped.length*100+dropped.length*150+g.combo*50;g.score+=points;
 g.events.push({type:'pop',popped,dropped,x:b.x,y:b.y,points,message:shot.rainbow?'RAINBOW RIOT!':`${b.v} ${g.config.op} ${shot.value} = ${g.config.target}`,combo:g.combo});
 g.projectile=null;g.cooldown=.4;
 if(!g.bubbles.length){g.ended=true;g.won=true;g.campaignComplete=g.level===LEVELS.length;g.stars=g.misses===0?3:g.misses<=2?2:1;g.totalStars+=g.stars;g.score+=g.stars*200;g.events.push({type:'end'});}else refreshAmmo(g);
}
function shoot(g,angle=g.angle){if(g.ended||g.projectile||g.cooldown>0)return false;g.angle=Math.max(-1.16,Math.min(1.16,angle));g.shots++;g.projectile={x:CX,y:CY,dx:Math.sin(g.angle),dy:-Math.cos(g.angle),value:g.ammo[g.selected],rainbow:g.rainbowReady,age:0,bounces:0};g.rainbowReady=false;g.events.push({type:'shoot'});return true;}
function step(g,dt){if(g.ended)return;dt=Math.max(0,Math.min(.1,dt));g.time+=dt;g.cooldown=Math.max(0,g.cooldown-dt);const p=g.projectile;if(!p)return;p.age+=dt;if(p.age>6){miss(g,'Try another angle.');return;}
 let remaining=SPEED*dt;for(let i=0;i<6&&remaining>.0001&&g.projectile;i++){const h=cast(g,p.x,p.y,p.dx,p.dy,remaining+.00001);const d=Math.min(h.d,remaining);p.x+=p.dx*d;p.y+=p.dy*d;remaining-=d;
  if(h.kind==='bubble'){resolve(g,h.id,p);return;}if(h.kind==='ceiling'||h.kind==='floor'){miss(g,'Try a different angle.',p.x,p.y);return;}
  if(h.kind==='wall'||h.kind==='bumper'){const r=reflect(p.dx,p.dy,h.nx,h.ny);p.dx=r.dx;p.dy=r.dy;p.x+=p.dx*.02;p.y+=p.dy*.02;p.bounces++;g.events.push({type:'bounce',x:p.x,y:p.y});if(p.bounces>8){miss(g,'Try another angle.');return;}}else break;
 }
}
return{W,H,CX,CY,BR,SR,SPEED,LEVELS,seedNumber,rng,create,nextLevel,retryLevel,aim,select,valueOf,required,cast,trace,refreshAmmo,shoot,step,resolve};
});
