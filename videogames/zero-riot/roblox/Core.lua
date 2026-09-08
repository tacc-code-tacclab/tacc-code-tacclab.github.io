-- ZERO RIOT v2: finite levels, optional zero bonuses and exact tap-to-move.
local R={W=720,LEVELS=5,SPEED=190,COUNTS={6,8,10,12,14}}
local function dist(x,y,a,b) return math.sqrt((x-a)^2+(y-b)^2) end
function R.seedNumber(value)
 local n=0;value=tostring(value)
 for i=1,#value do n=(n*31+string.byte(value,i))%2147483646 end
 return n+1
end
function R.rng(seed)
 local s=seed;return function() s=(s*16807)%2147483647;return (s-1)/2147483646 end
end
function R.create(seed,level,carry)
 level=math.max(1,math.min(5,level or 1));carry=carry or {}
 local bank={score=carry.score or 0,novas=carry.novas or 0,bestChain=carry.bestChain or 0,kills=carry.kills or 0,totalTime=carry.totalTime or 0}
 local g={seed=tostring(seed),level=level,bank=bank,random=R.rng(R.seedNumber(tostring(seed)..'/L'..level)),time=0,totalTime=bank.totalTime,charge=0,lives=3,score=bank.score,novas=bank.novas,bestChain=bank.bestChain,kills=bank.kills,chain=0,mass=0,flipCooldown=0,invulnerable=1,spawnAt=12,spawned=0,enemyQuota=math.max(0,level-2),nextId=0,ended=false,won=false,campaignComplete=false,x=360,y=660,target=nil,total=R.COUNTS[level],collected=0,pickups={},enemies={},events={}}
 local slots={}
 if level==1 then slots={{260,500},{460,500},{200,340},{520,340},{260,180},{460,180}}
 else
  for y=120,570,150 do for x=120,600,160 do table.insert(slots,{x,y}) end end
  for i=#slots,2,-1 do local j=math.floor(g.random()*i)+1;slots[i],slots[j]=slots[j],slots[i] end
 end
 for i=0,g.total/2-1 do
  local v=level==1 and i+1 or (1+math.floor(g.random()*math.min(5,level+1)))
  for j=0,1 do local s=slots[i*2+j+1];g.nextId=g.nextId+1;table.insert(g.pickups,{id=g.nextId,x=s[1],y=s[2],v=j==0 and v or -v,wait=0}) end
 end
 return g
end
function R.nextLevel(g) if g.won and not g.campaignComplete then return R.create(g.seed,g.level+1,g) end return g end
function R.retryLevel(g) return R.create(g.seed,g.level,g.bank) end
function R.setTarget(g,x,y)
 if g.ended then return end
 local near=nil;local distance=52
 for _,p in ipairs(g.pickups) do local d=dist(p.x,p.y,x,y);if d<distance then near=p;distance=d end end
 if near then g.target={x=near.x,y=near.y,id=near.id}
 else g.target={x=math.max(26,math.min(694,x)),y=math.max(50,math.min(670,y))} end
end
function R.cancelTarget(g) g.target=nil end
function R.stickVector(x,y)
 local d=math.sqrt(x*x+y*y);if d<=.1 then return{x=0,y=0} end
 local s=math.min(1,(d-.1)/.9)/d;return{x=x*s,y=y*s}
end
function R.hurt(g,reason)
 if g.invulnerable>0 or g.ended then return false end
 g.lives=g.lives-1;g.charge=0;g.chain=0;g.mass=0;g.invulnerable=2.5
 table.insert(g.events,{type='hurt',x=g.x,y=g.y,reason=reason})
 if g.lives<=0 then g.ended=true;g.target=nil;table.insert(g.events,{type='end'}) end
 return true
end
function R.collect(g,p)
 if g.ended then return false end
 local index=nil;for i,v in ipairs(g.pickups) do if v==p then index=i;break end end
 if not index then return false end
 table.remove(g.pickups,index);g.collected=g.collected+1;g.charge=g.charge+p.v;g.chain=g.chain+1;g.mass=g.mass+math.abs(p.v);g.score=g.score+25
 table.insert(g.events,{type='collect',x=p.x,y=p.y,value=p.v})
 if g.target and g.target.id==p.id then g.target=nil end
 if g.charge==0 then
  local radius=math.min(310,180+g.mass*5);local destroyed=0;local keep={}
  for _,e in ipairs(g.enemies) do
   if dist(e.x,e.y,g.x,g.y)<=radius then destroyed=destroyed+1;table.insert(g.events,{type='destroy',x=e.x,y=e.y}) else table.insert(keep,e) end
  end
  g.enemies=keep
  local points=100+g.mass*8+g.chain*g.chain*5+destroyed*100
  g.score=g.score+points;g.novas=g.novas+1;g.kills=g.kills+destroyed;g.bestChain=math.max(g.bestChain,g.chain)
  table.insert(g.events,{type='nova',x=g.x,y=g.y,radius=radius,points=points,chain=g.chain});g.chain=0;g.mass=0
 end
 if #g.pickups==0 then g.ended=true;g.won=true;g.campaignComplete=g.level==5;g.score=g.score+200*g.level;g.target=nil;table.insert(g.events,{type='end'}) end
 return true
end
function R.flip(g)
 if g.ended or g.flipCooldown>0 then return false end
 for _,p in ipairs(g.pickups) do p.v=-p.v end
 g.flipCooldown=1;table.insert(g.events,{type='flip',x=g.x,y=g.y});return true
end
local function spawn(g)
 local corners={{34,65},{686,65},{34,650},{686,650}}
 local index=math.floor(g.random()*4)+1;local c=corners[index]
 for i=1,4 do if dist(c[1],c[2],g.x,g.y)>=200 then break end;index=index%4+1;c=corners[index] end
 g.nextId=g.nextId+1;table.insert(g.enemies,{id=g.nextId,x=c[1],y=c[2],type='hunter',warning=1.4,age=0});g.spawned=g.spawned+1
end
function R.step(g,dt,input)
 if g.ended then return end
 input=input or {};dt=math.max(0,math.min(.1,dt));g.time=g.time+dt;g.totalTime=g.totalTime+dt;g.flipCooldown=math.max(0,g.flipCooldown-dt);g.invulnerable=math.max(0,g.invulnerable-dt)
 local dx=input.x or 0;local dy=input.y or 0;local len=math.sqrt(dx*dx+dy*dy)
 if len>0 then g.target=nil end;if len>1 then dx=dx/len;dy=dy/len end
 local targetId=g.target and g.target.id or nil
 if g.target then
  local tx,ty=g.target.x-g.x,g.target.y-g.y;local d=math.sqrt(tx*tx+ty*ty);local travel=R.SPEED*dt
  if d<=travel then g.x=g.target.x;g.y=g.target.y;g.target=nil else g.x=g.x+tx/d*travel;g.y=g.y+ty/d*travel end
 else g.x=math.max(26,math.min(694,g.x+dx*R.SPEED*dt));g.y=math.max(50,math.min(670,g.y+dy*R.SPEED*dt)) end
 local snapshot={};for _,p in ipairs(g.pickups) do table.insert(snapshot,p) end
 for _,p in ipairs(snapshot) do local radius=p.id==targetId and .001 or 26;if dist(p.x,p.y,g.x,g.y)<=radius then R.collect(g,p);if g.ended then return end end end
 if g.spawned<g.enemyQuota and g.time>=g.spawnAt then spawn(g);g.spawnAt=g.time+8 end
 for i=#g.enemies,1,-1 do
  local e=g.enemies[i];e.age=e.age+dt
  if e.warning>0 then e.warning=math.max(0,e.warning-dt)
  else
   local d=dist(g.x,g.y,e.x,e.y);if d==0 then d=1 end;local speed=40+(g.level-3)*8
   e.x=e.x+(g.x-e.x)/d*speed*dt;e.y=e.y+(g.y-e.y)/d*speed*dt
   if dist(e.x,e.y,g.x,g.y)<25 and R.hurt(g,'HUNTER HIT') then table.remove(g.enemies,i);if g.ended then return end end
  end
 end
end
return R
