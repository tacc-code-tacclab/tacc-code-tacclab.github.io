-- ZERO RIOT v1. Pure Lua rules, mirrored in ../core.js. Units are logical arena units.
local R = {W=720, DURATION=90, LIMIT=9}
function R.seedNumber(value)
 local n=0
 for i=1,#tostring(value) do n=(n*31+string.byte(tostring(value),i))%2147483646 end
 return n+1
end
function R.rng(seed)
 local s=seed
 return function() s=(s*16807)%2147483647; return (s-1)/2147483646 end
end
local function dist(x,y,a,b) return math.sqrt((x-a)^2+(y-b)^2) end
local function position(g)
 local x,y
 for tries=1,80 do
  x=45+g.random()*630; y=65+g.random()*590
  local valid=dist(x,y,g.x,g.y)>=90
  for _,p in ipairs(g.pickups) do if dist(p.x,p.y,x,y)<56 then valid=false; break end end
  if valid then return x,y end
 end
 return x,y
end
local function addPickup(g,v)
 local x,y=position(g); g.nextId=g.nextId+1
 table.insert(g.pickups,{id=g.nextId,x=x,y=y,v=v,wait=.3})
end
function R.create(seed)
 local g={seed=tostring(seed),random=R.rng(R.seedNumber(seed)),time=0,charge=0,lives=3,score=0,novas=0,bestChain=0,kills=0,chain=0,mass=0,peak=0,flipCooldown=0,invulnerable=1,collectCooldown=0,spawnAt=5,nextId=0,ended=false,won=false,x=360,y=390,pickups={},enemies={},events={}}
 for _,p in ipairs({{450,390,3},{520,460,4},{400,520,-7}}) do
  g.nextId=g.nextId+1; table.insert(g.pickups,{id=g.nextId,x=p[1],y=p[2],v=p[3],wait=0})
 end
 for i=1,8 do local v=1+math.floor(g.random()*7); addPickup(g,v); addPickup(g,-v) end
 return g
end
function R.hurt(g,reason)
 if g.invulnerable>0 or g.ended then return false end
 g.lives=g.lives-1;g.charge=0;g.chain=0;g.mass=0;g.peak=0;g.invulnerable=1.8;g.collectCooldown=.25
 table.insert(g.events,{type="hurt",x=g.x,y=g.y,reason=reason})
 if g.lives<=0 then g.ended=true; table.insert(g.events,{type="end"}) end
 return true
end
function R.collect(g,p)
 if g.ended then return end
 local result=g.charge+p.v
 table.insert(g.events,{type="collect",x=p.x,y=p.y,value=p.v})
 if math.abs(result)>9 then
  if g.invulnerable>0 then table.insert(g.events,{type="blocked",x=g.x,y=g.y}) else R.hurt(g,"OVERLOAD") end
  return
 end
 g.charge=result;g.chain=g.chain+1;g.mass=g.mass+math.abs(p.v);g.peak=math.max(g.peak,math.abs(result))
 if result==0 then
  local radius=math.min(285,120+g.mass*5);local destroyed=0
  local keep={}
  for _,e in ipairs(g.enemies) do
   if dist(e.x,e.y,g.x,g.y)<=radius then destroyed=destroyed+1;table.insert(g.events,{type="destroy",x=e.x,y=e.y}) else table.insert(keep,e) end
  end
  g.enemies=keep
  local points=100+g.mass*12+g.chain*g.chain*10+g.peak*15+destroyed*100
  g.score=g.score+points;g.novas=g.novas+1;g.kills=g.kills+destroyed;g.bestChain=math.max(g.bestChain,g.chain)
  table.insert(g.events,{type="nova",x=g.x,y=g.y,radius=radius,points=points,chain=g.chain})
  g.chain=0;g.mass=0;g.peak=0
 end
end
function R.flip(g)
 if g.ended or g.flipCooldown>0 then return false end
 for _,p in ipairs(g.pickups) do p.v=-p.v end
 g.flipCooldown=2;table.insert(g.events,{type="flip",x=g.x,y=g.y});return true
end
local function spawn(g)
 local side=math.floor(g.random()*4);local t=60+g.random()*600
 local x=side==0 and 24 or (side==1 and 696 or t)
 local y=side==2 and 40 or (side==3 and 680 or t)
 local dart=g.time>=30 and g.random()<.4
 local angle=math.atan2(g.y-y,g.x-x)
 g.nextId=g.nextId+1
 table.insert(g.enemies,{id=g.nextId,x=x,y=y,type=dart and "dart" or "hunter",warning=.9,age=0,dx=math.cos(angle),dy=math.sin(angle)})
end
function R.step(g,dt,input)
 if g.ended then return end
 input=input or {}
 g.time=math.min(90,g.time+dt);g.flipCooldown=math.max(0,g.flipCooldown-dt);g.invulnerable=math.max(0,g.invulnerable-dt);g.collectCooldown=math.max(0,g.collectCooldown-dt)
 local dx=input.x or 0; local dy=input.y or 0;local len=math.sqrt(dx*dx+dy*dy)
 if len>1 then dx=dx/len;dy=dy/len end
 g.x=math.max(24,math.min(696,g.x+dx*235*dt));g.y=math.max(45,math.min(675,g.y+dy*235*dt))
 for _,p in ipairs(g.pickups) do
  p.wait=math.max(0,p.wait-dt)
  if p.wait==0 and g.collectCooldown==0 and dist(p.x,p.y,g.x,g.y)<33 then
   R.collect(g,p);p.x,p.y=position(g)
   local sign=g.random()<.5 and -1 or 1
   p.v=sign*(1+math.floor(g.random()*7));p.wait=.65;g.collectCooldown=.11
   if g.ended then return end
  end
 end
 if g.charge~=0 then
  local found=false
  for _,p in ipairs(g.pickups) do if p.v==-g.charge and p.wait==0 then found=true;break end end
  if not found then
   local far=g.pickups[1]
   for _,p in ipairs(g.pickups) do if dist(p.x,p.y,g.x,g.y)>=dist(far.x,far.y,g.x,g.y) then far=p end end
   far.v=-g.charge
  end
 end
 if g.time>=g.spawnAt then
  if #g.enemies<22 then spawn(g) end
  g.spawnAt=g.time+math.max(.9,2.7-g.time*.021)
 end
 for i=#g.enemies,1,-1 do
  local e=g.enemies[i];e.age=e.age+dt
  if e.warning>0 then e.warning=e.warning-dt
  else
   local ex,ey=e.dx,e.dy
   if e.type=="hunter" then local d=math.max(.000001,dist(g.x,g.y,e.x,e.y));ex=(g.x-e.x)/d;ey=(g.y-e.y)/d end
   local speed=e.type=="dart" and 235 or (62+g.time*.55)
   e.x=e.x+ex*speed*dt;e.y=e.y+ey*speed*dt
   if e.x< -50 or e.x>770 or e.y< -50 or e.y>770 then table.remove(g.enemies,i)
   elseif dist(e.x,e.y,g.x,g.y)<30 and R.hurt(g,"HUNTER HIT") then
    table.remove(g.enemies,i);if g.ended then return end
   end
  end
 end
 if g.time>=90 then g.ended=true;g.won=true;g.score=g.score+g.lives*300;table.insert(g.events,{type="end"}) end
end
return R
