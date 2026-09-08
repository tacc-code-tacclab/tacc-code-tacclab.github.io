-- Bubble Riot v4: deterministic arithmetic bubble shooter. Standard Lua / Luau.
local R={W=720,H=900,CX=360,CY=802,BR=32,SR=17,SPEED=820}
R.LEVELS={
 {target=5,op='+',rows=2,cols=6,name='FIRST POPS',bumpers=0},
 {target=6,op='+',rows=3,cols=6,name='SWEET SIX',bumpers=0},
 {target=8,op='+',rows=3,cols=7,name='BUBBLE GROVE',bumpers=0},
 {target=10,op='+',rows=3,cols=7,name='BOUNCE TO TEN',bumpers=1},
 {target=5,op='−',rows=4,cols=7,name='TAKE AWAY TRAIL',bumpers=1},
 {target=10,op='−',rows=4,cols=8,name='SUNSET SUBTRACTION',bumpers=2},
 {target=12,op='×',rows=3,cols=6,name='MULTIPLY THE FUN',bumpers=0},
 {target=18,op='×',rows=3,cols=7,name='MAGIC MULTIPLES',bumpers=1},
 {target=24,op='×',rows=4,cols=7,name='CRYSTAL CANOPY',bumpers=1},
 {target=3,op='÷',rows=4,cols=8,name='STAR SHARING',bumpers=2},
 {target=6,op='÷',rows=4,cols=8,name='DIVIDE THE GALAXY',bumpers=2},
 {target=48,op='×',rows=5,cols=8,name='THE GRAND BLOOM',bumpers=2}
}
local function clamp(v,a,b) return math.max(a,math.min(b,v)) end
local function hypot(x,y) return math.sqrt(x*x+y*y) end
local function find(g,id) for _,b in ipairs(g.bubbles) do if b.id==id then return b end end end
function R.seedNumber(value) local n=0;value=tostring(value);for i=1,#value do n=(n*31+value:byte(i))%2147483646 end;return n+1 end
function R.rng(seed) local s=seed;return function() s=s*16807%2147483647;return (s-1)/2147483646 end end
function R.valueOf(g,v,ammo) local op=g.config.op;if op=='+' then return v+ammo elseif op=='−' then return v-ammo elseif op=='÷' then return v/ammo else return v*ammo end end
function R.required(g,v) local op=g.config.op;if op=='+' then return g.config.target-v elseif op=='−' then return v-g.config.target elseif op=='÷' then return v/g.config.target else return g.config.target/v end end
function R.operationName(g) return ({['+']='ADD',['−']='SUBTRACT',['×']='MULTIPLY',['÷']='DIVIDE'})[g.config.op] end
function R.world(g) return math.floor((g.level-1)/4) end
local function rayCircle(x,y,dx,dy,cx,cy,r)
 local ox,oy=x-cx,y-cy;local b=ox*dx+oy*dy;local c=ox*ox+oy*oy-r*r;local d=b*b-c;if d<0 then return math.huge end
 local t=-b-math.sqrt(d);if t>.001 then return t else return math.huge end
end
function R.cast(g,x,y,dx,dy,maxDistance)
 local hit={kind='none',d=maxDistance or 2000}
 local function accept(kind,d,data) if d>.001 and d<hit.d then hit={kind=kind,d=d};for k,v in pairs(data or {}) do hit[k]=v end end end
 if dx< -1e-9 then accept('wall',(35-x)/dx,{nx=1,ny=0}) end;if dx>1e-9 then accept('wall',(685-x)/dx,{nx=-1,ny=0}) end
 if dy< -1e-9 then accept('ceiling',(55-y)/dy) end;if dy>1e-9 then accept('floor',(865-y)/dy) end
 for _,b in ipairs(g.bubbles) do accept('bubble',rayCircle(x,y,dx,dy,b.x,b.y,R.BR+R.SR),{id=b.id}) end
 for _,b in ipairs(g.bumpers) do local d=rayCircle(x,y,dx,dy,b.x,b.y,b.r+R.SR);if d<hit.d then accept('bumper',d,{nx=(x+dx*d-b.x)/(b.r+R.SR),ny=(y+dy*d-b.y)/(b.r+R.SR)}) end end
 return hit
end
local function reflect(dx,dy,nx,ny) local dot=dx*nx+dy*ny;return dx-2*dot*nx,dy-2*dot*ny end
function R.trace(g,angle)
 angle=angle or g.angle;local x,y,dx,dy=R.CX,R.CY,math.sin(angle),-math.cos(angle);local points={{x=x,y=y}}
 for _=1,7 do local h=R.cast(g,x,y,dx,dy);x=x+dx*h.d;y=y+dy*h.d;points[#points+1]={x=x,y=y};if h.kind=='bubble' then return {points=points,hitId=h.id} end;if h.kind~='wall' and h.kind~='bumper' then break end;dx,dy=reflect(dx,dy,h.nx,h.ny);x=x+dx*.02;y=y+dy*.02 end
 return {points=points,hitId=nil}
end
function R.refreshAmmo(g)
 if #g.bubbles==0 then g.ammo={1,2,3};return end
 local seen,choices={},{}
 local function add(angle) local b=find(g,R.trace(g,angle).hitId);if b then local n=R.required(g,b.v);if n%1==0 and n>0 and not seen[n] then seen[n]=true;choices[#choices+1]=n end end end
 add(g.angle);add(0);for i=0,80 do add(-1.16+i*2.32/80) end
 if #choices==0 then for _,b in ipairs(g.bubbles) do local n=R.required(g,b.v);if not seen[n] then seen[n]=true;choices[#choices+1]=n end end end
 local first=table.remove(choices,1);for i=#choices,2,-1 do local j=math.floor(g.random()*i)+1;choices[i],choices[j]=choices[j],choices[i] end;table.insert(choices,1,first)
 g.ammo={choices[1],choices[2] or choices[1],choices[3] or choices[2] or choices[1]};g.selected=0
end
function R.create(seed,level,carry)
 level=clamp(math.floor(level or 1),1,#R.LEVELS);carry=carry or {};local config=R.LEVELS[level];local random=R.rng(R.seedNumber(tostring(seed)..'/B'..level));local bank={score=carry.score or 0,totalStars=carry.totalStars or 0,totalRescued=carry.totalRescued or 0}
 local g={seed=tostring(seed),level=level,config=config,random=random,bank=bank,score=bank.score,totalStars=bank.totalStars,totalRescued=bank.totalRescued,rescued=0,lumiTotal=0,stars=0,time=0,shots=0,misses=0,combo=0,power=0,rainbowReady=false,selected=0,ammo={},angle=0,projectile=nil,cooldown=0,ended=false,won=false,campaignComplete=false,bubbles={},bumpers={},events={},nextId=0}
 local values={};if config.op=='−' then for v=1,12 do values[#values+1]=config.target+v end elseif config.op=='÷' then for v=2,12 do values[#values+1]=config.target*v end else for v=(config.op=='+' and 1 or 2),config.target-1 do if config.op=='+' or config.target%v==0 then values[#values+1]=v end end end
 local start=(R.W-(config.cols-1)*76-38)/2
 for row=0,config.rows-1 do local value=0;for col=0,config.cols-1 do if col%3==0 then if level==1 then value=1+row*2+math.floor(col/3) else value=values[math.floor(random()*#values)+1] end end;g.nextId=g.nextId+1;g.bubbles[#g.bubbles+1]={id=g.nextId,x=start+col*76+(row%2)*38,y=132+row*66,v=value,row=row,color=value%6} end end
 if config.bumpers>=1 then g.bumpers[#g.bumpers+1]={x=config.bumpers==1 and 260 or 210,y=525,r=40} end;if config.bumpers>=2 then g.bumpers[#g.bumpers+1]={x=510,y=558,r=40} end
 for i,b in ipairs(g.bubbles) do local col=(i-1)%config.cols;b.lumi=b.row==config.rows-1 and col%3==1;b.bomb=level>=3 and b.row==math.floor(config.rows/2) and (col==1 or (level>=6 and col==config.cols-2));if b.lumi then g.lumiTotal=g.lumiTotal+1 end end
 g.initial=#g.bubbles;R.refreshAmmo(g);return g
end
function R.nextLevel(g) if g.won and not g.campaignComplete then return R.create(g.seed,g.level+1,g) else return g end end
function R.retryLevel(g) return R.create(g.seed,g.level,g.bank) end
function R.aim(g,x,y) g.angle=clamp(math.atan2(x-R.CX,R.CY-y),-1.16,1.16);return g.angle end
function R.select(g,index) if not g.projectile and not g.ended and index>=0 and index<3 then g.selected=index end end
local function connected(g,start,sameValue)
 local found,queue={[start.id]=true},{start};local head=1
 while head<=#queue do local a=queue[head];head=head+1;for _,b in ipairs(g.bubbles) do if not found[b.id] and (not sameValue or b.v==start.v) and hypot(a.x-b.x,a.y-b.y)<83 then found[b.id]=true;queue[#queue+1]=b end end end
 return found
end
local function miss(g,message,x,y) g.misses=g.misses+1;g.combo=0;g.power=0;g.events[#g.events+1]={type='miss',message=message,x=x or R.CX,y=y or R.CY-100};g.projectile=nil;g.cooldown=.25;R.refreshAmmo(g) end
function R.resolve(g,id,shot)
 local b=find(g,id);if not b then return end;local result=R.valueOf(g,b.v,shot.value);local shown=result%1==0 and result or math.floor(result*100+.5)/100;local relation=result%1==0 and '=' or '≈'
 if not shot.rainbow and result~=g.config.target then miss(g,b.v..' '..g.config.op..' '..shot.value..' '..relation..' '..shown..' · aim for '..g.config.target,b.x,b.y);return end
 local ids=connected(g,b,true);if shot.rainbow then for _,q in ipairs(g.bubbles) do if hypot(q.x-b.x,q.y-b.y)<155 then ids[q.id]=true end end end
 local explosions,detonated,rowsBefore={},{},{};for _,q in ipairs(g.bubbles) do rowsBefore[q.row]=true end;local changed=true
 while changed do changed=false;for _,q in ipairs(g.bubbles) do if ids[q.id] and q.bomb and not detonated[q.id] then detonated[q.id]=true;explosions[#explosions+1]={x=q.x,y=q.y};for _,other in ipairs(g.bubbles) do if hypot(q.x-other.x,q.y-other.y)<160 and not ids[other.id] then ids[other.id]=true;changed=true end end end end end
 local popped,remaining={},{};for _,q in ipairs(g.bubbles) do if ids[q.id] then popped[#popped+1]=q else remaining[#remaining+1]=q end end;g.bubbles=remaining
 local anchored,queue={},{};for _,q in ipairs(g.bubbles) do if q.row==0 then anchored[q.id]=true;queue[#queue+1]=q end end;local head=1
 while head<=#queue do local q=queue[head];head=head+1;for _,other in ipairs(g.bubbles) do if not anchored[other.id] and hypot(q.x-other.x,q.y-other.y)<83 then anchored[other.id]=true;queue[#queue+1]=other end end end
 local dropped={};remaining={};for _,q in ipairs(g.bubbles) do if anchored[q.id] then remaining[#remaining+1]=q else dropped[#dropped+1]=q end end;g.bubbles=remaining
 g.combo=g.combo+1;if not shot.rainbow then g.power=g.power+1;if g.power>=3 then g.rainbowReady=true;g.power=0;g.events[#g.events+1]={type='ready'} end end
 local rescued={};for _,list in ipairs({popped,dropped}) do for _,q in ipairs(list) do if q.lumi then rescued[#rescued+1]=q end end end
 local rowsCleared=0;for row in pairs(rowsBefore) do local present=false;for _,q in ipairs(g.bubbles) do if q.row==row then present=true;break end end;if not present then rowsCleared=rowsCleared+1 end end
 g.rescued=g.rescued+#rescued;g.totalRescued=g.totalRescued+#rescued;local bankShot=(shot.bounces or 0)>0
 local points=#popped*100+#dropped*150+g.combo*50+#rescued*300+rowsCleared*250+(bankShot and 100 or 0);g.score=g.score+points
 g.events[#g.events+1]={type='pop',popped=popped,dropped=dropped,rescued=rescued,explosions=explosions,rowsCleared=rowsCleared,bankShot=bankShot,x=b.x,y=b.y,points=points,message=shot.rainbow and 'RAINBOW RIOT!' or (b.v..' '..g.config.op..' '..shot.value..' = '..g.config.target),combo=g.combo}
 g.projectile=nil;g.cooldown=.4
 if #g.bubbles==0 then g.ended=true;g.won=true;g.campaignComplete=g.level==#R.LEVELS;g.stars=g.misses==0 and 3 or (g.misses<=2 and 2 or 1);g.totalStars=g.totalStars+g.stars;g.score=g.score+g.stars*200;g.events[#g.events+1]={type='end'} else R.refreshAmmo(g) end
end
function R.shoot(g,angle)
 if g.ended or g.projectile or g.cooldown>0 then return false end;g.angle=clamp(angle or g.angle,-1.16,1.16);g.shots=g.shots+1
 g.projectile={x=R.CX,y=R.CY,dx=math.sin(g.angle),dy=-math.cos(g.angle),value=g.ammo[g.selected+1],rainbow=g.rainbowReady,age=0,bounces=0};g.rainbowReady=false;g.events[#g.events+1]={type='shoot'};return true
end
function R.step(g,dt)
 if g.ended then return end;dt=clamp(dt,0,.1);g.time=g.time+dt;g.cooldown=math.max(0,g.cooldown-dt);local p=g.projectile;if not p then return end;p.age=p.age+dt;if p.age>6 then miss(g,'Try another angle.');return end
 local remaining=R.SPEED*dt
 for _=1,6 do if remaining<=.0001 or not g.projectile then break end;local h=R.cast(g,p.x,p.y,p.dx,p.dy,remaining+.00001);local d=math.min(h.d,remaining);p.x=p.x+p.dx*d;p.y=p.y+p.dy*d;remaining=remaining-d
  if h.kind=='bubble' then R.resolve(g,h.id,p);return end;if h.kind=='ceiling' or h.kind=='floor' then miss(g,'Try a different angle.',p.x,p.y);return end
  if h.kind=='wall' or h.kind=='bumper' then p.dx,p.dy=reflect(p.dx,p.dy,h.nx,h.ny);p.x=p.x+p.dx*.02;p.y=p.y+p.dy*.02;p.bounces=p.bounces+1;g.events[#g.events+1]={type='bounce',x=p.x,y=p.y};if p.bounces>8 then miss(g,'Try another angle.');return end else break end
 end
end
return R
