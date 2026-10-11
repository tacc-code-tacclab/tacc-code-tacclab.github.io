-- Micio Incastro 3: platform-independent rules. Zero-based board and stage coordinates.
local Journey
if script then Journey=require(script.Parent:WaitForChild('Journey')) else Journey=dofile('Journey.lua') end
local Core={COLS=9,ROWS=12,MATCH=6,BLOCK=4,WORLDS=Journey.WORLDS,MISSIONS=Journey.MISSIONS}
local C,R,B=Core.COLS,Core.ROWS,Core.BLOCK
local SHAPES={{{0,0},{0,1},{0,2}},{{0,0},{1,0},{0,1}},{{0,0},{1,-1},{2,-1}},{{0,0},{-1,0},{1,0}},{{0,0},{0,1}}}
local DIRS={{1,0},{1,-1},{0,-1},{-1,0},{-1,1},{0,1}}
Core.WEAPON_IDS={'stone','dart','spear','bullet','laser'}
Core.WEAPONS={
 stone={name='Sassi',price=0,damage=1,cooldown=340,icon='●'},
 dart={name='Freccette',price=6,damage=2,cooldown=300,icon='➤'},
 spear={name='Lance',price=14,damage=3,cooldown=550,icon='↗'},
 bullet={name='Proiettili',price=26,damage=2,cooldown=120,icon='▪'},
 laser={name='Laser',price=44,damage=4,cooldown=260,icon='ϟ'}
}
local function copy(t) local out={};for k,v in pairs(t) do out[k]=type(v)=='table' and copy(v) or v end;return out end
local function contains(t,v) for _,x in ipairs(t) do if x==v then return true end end;return false end
local function cat(v) return type(v)=='number' and v==math.floor(v) and v>=0 and v<B end
local function finite(v) return type(v)=='number' and v==v and v~=math.huge and v~=-math.huge end
Core.isCat=cat
local Game={};Game.__index=Game
function Core.new(random) local self=setmetatable({random=random or math.random},Game);self:reset();return self end
function Game:mission() return Core.MISSIONS[self.stage+1] end
function Game:world() return Core.WORLDS[self:mission().world+1] end
function Game:targets() return self:mission().targets end
function Game:goal() return #self:targets() end
function Game:progress() local n=0;for _,p in ipairs(self:targets()) do if cat(self.stamps[p.y*C+p.x]) then n=n+1 end end;return n end
function Game:won() return self.endReason=='win' end
function Game:campaignWon() return self:won() and self.stage==#Core.MISSIONS-1 end
function Game:duration() return self:mission().duration end
function Game:remaining() return self.mode=='flow' and self:duration()-self.elapsed or math.huge end
function Game:interval() return math.max(260,760-self.stage*9-math.max(math.floor(self.saved/30),math.floor(self.elapsed/20000))*25) end
function Game:reset(mode)
 self.mode=mode=='chill' and 'chill' or 'flow';self.stage=0;self.score=0;self.coins=0;self.rescuedBefore=0;self.bestChain=0
 self.owned={'stone'};self.weapon='stone';self:prepareStage()
end
function Game:prepareStage()
 self.checkpoint={score=self.score,coins=self.coins,owned=copy(self.owned),weapon=self.weapon,bestChain=self.bestChain}
 self.board={};for y=0,R-1 do self.board[y]={};for x=0,C-1 do self.board[y][x]=false end end
 self.saved=0;self.stamps={};self.charge=0;self.moves=0;self.elapsed=0;self.over=false;self.endReason=nil
 self.mosquito=nil;self.mosquitoMs=12000;self.mosquitoMoves=5;self.events={};self.bag={};self.queue={self:make(),self:make(),self:make()};self:spawn()
end
function Game:nextStage() if not self:won() or self:campaignWon() then return false end;self.rescuedBefore=self.rescuedBefore+self.saved;self.stage=self.stage+1;self:prepareStage();return true end
function Game:retryStage() if not self.over or self:won() then return false end;local c=self.checkpoint;self.score=c.score;self.coins=c.coins;self.owned=copy(c.owned);self.weapon=c.weapon;self.bestChain=c.bestChain;self:prepareStage();return true end
function Game:addScore(points) if not finite(points) or points<=0 then return end;local before=math.floor(self.score/100);self.score=self.score+math.floor(points);self.coins=self.coins+math.floor(self.score/100)-before end
function Game:finish(reason)
 if self.over then return end
 if reason=='win' then for _,p in ipairs(self:targets()) do if not cat(self.stamps[p.y*C+p.x]) then return end end end
 self.over=true;self.endReason=reason;self.mosquito=nil;if reason=='win' then self:addScore(200) end
end
function Game:drainEvents() local out=self.events;self.events={};return out end
function Game:advance(ms)
 if self.over or not finite(ms) or ms<=0 then return false end
 if self.mode=='flow' then self.elapsed=math.min(self:duration(),self.elapsed+ms);if self.elapsed==self:duration() then self:finish('time');return true end end
 if self.mosquito then local m=self.mosquito;m.age=m.age+ms;m.cooldown=math.max(0,m.cooldown-ms);if self.mode=='flow' then m.dropMs=math.max(0,m.dropMs-ms);if m.dropMs==0 then self:dropClutter() end end
 elseif self.mode=='flow' then self.mosquitoMs=self.mosquitoMs-ms;if self.mosquitoMs<=0 and self.moves>=2 then self:appearMosquito() end end
 return self.over
end
function Game:make()
 if #self.bag==0 then self.bag={0,1,2,3};for i=4,2,-1 do local j=math.floor(self.random()*i)+1;self.bag[i],self.bag[j]=self.bag[j],self.bag[i] end end
 return {cells=copy(SHAPES[math.floor(self.random()*#SHAPES)+1]),color=table.remove(self.bag)}
end
function Game:cells(piece)
 piece=piece or self.active;local out={};for _,p in ipairs(piece.cells) do local x=p[1]+piece.q;out[#out+1]={x=x,y=p[2]+piece.r+math.floor(x/2),color=piece.color} end;return out
end
function Game:fits(piece) for _,p in ipairs(self:cells(piece)) do if p.x<0 or p.x>=C or p.y<0 or p.y>=R or self.board[p.y][p.x]~=false then return false end end;return true end
function Game:spawn()
 self.active=table.remove(self.queue,1);self.active.q=4;self.active.r=0;self.queue[#self.queue+1]=self:make()
 local low=math.huge;for _,p in ipairs(self:cells()) do low=math.min(low,p.y) end;self.active.r=-low;self.swapped=false
 if not self:fits(self.active) then self:finish('full') end
end
function Game:move(dx)
 if self.over then return false end;local p=copy(self.active);p.q=p.q+dx;p.r=p.r+math.floor(self.active.q/2)-math.floor(p.q/2)
 if not self:fits(p) then return false end;self.active=p;return true
end
function Game:turn()
 if self.over then return false end
 local cells={};for _,p in ipairs(self.active.cells) do cells[#cells+1]={-p[2],p[1]+p[2]} end
 for _,kick in ipairs({{0,0},{-1,0},{1,-1},{0,1},{-1,1},{1,0},{0,-1}}) do local p=copy(self.active);p.cells=cells;p.q=p.q+kick[1];p.r=p.r+kick[2];if self:fits(p) then self.active=p;return true end end;return false
end
function Game:ghost() local p=copy(self.active);while true do local nextp=copy(p);nextp.r=nextp.r+1;if not self:fits(nextp) then return p end;p=nextp end end
function Game:swap() if self.over or self.swapped then return false end;local p=copy(self.queue[1]);p.q=self.active.q;p.r=self.active.r;if not self:fits(p) then return false end;self.queue[1]={cells=copy(self.active.cells),color=self.active.color};self.active=p;self.swapped=true;return true end
function Game:step() if self.over then return nil end;local p=copy(self.active);p.r=p.r+1;if self:fits(p) then self.active=p;return {moved=true,clears={}} end;return self:lock() end
function Game:drop() if self.over then return nil end;self.active=self:ghost();return self:lock() end
function Game:lock()
 if self.over or not self:fits(self.active) then return nil end
 for _,p in ipairs(self:cells()) do self.board[p.y][p.x]=p.color end
 self.moves=self.moves+1;self:addScore(#self.active.cells*5);local result=self:resolve()
 if not self.over then self:spawn() end
 if not self.over and self.mode=='chill' then if self.mosquito then self.mosquito.placements=self.mosquito.placements-1;if self.mosquito.placements==0 then self:dropClutter() end else self.mosquitoMoves=self.mosquitoMoves-1;if self.mosquitoMoves<=0 then self:appearMosquito() end end end
 return result
end
local function neighbors(x,y) local out={};local r=y-math.floor(x/2);for _,d in ipairs(DIRS) do local xx=x+d[1];out[#out+1]={x=xx,y=r+d[2]+math.floor(xx/2)} end;return out end
function Game:groups()
 local seen,groups={},{}
 for y=0,R-1 do for x=0,C-1 do local color,key=self.board[y][x],y*C+x
  if cat(color) and not seen[key] then local group={{x=x,y=y,color=color}};seen[key]=true;local i=1
   while i<=#group do for _,p in ipairs(neighbors(group[i].x,group[i].y)) do local k=p.y*C+p.x
    if p.x>=0 and p.x<C and p.y>=0 and p.y<R and not seen[k] and self.board[p.y][p.x]==color then seen[k]=true;p.color=color;group[#group+1]=p end
   end;i=i+1 end
   if #group>=Core.MATCH then groups[#groups+1]=group end
  end
 end end;return groups
end
function Game:collapse(protect)
 local occupied={};if protect then for _,p in ipairs(self:cells()) do occupied[p.y*C+p.x]=true end end
 for x=0,C-1 do local dest=R-1;for y=R-1,0,-1 do
  if occupied[y*C+x] then dest=y-1 elseif self.board[y][x]~=false then local value=self.board[y][x];self.board[y][x]=false;self.board[dest][x]=value;dest=dest-1 end
 end end
end
function Game:stampTargets()
 local before=self:progress();for _,p in ipairs(self:targets()) do if cat(self.board[p.y][p.x]) then self.stamps[p.y*C+p.x]=self.board[p.y][p.x] end end
 local added=self:progress()-before;self:addScore(added*15);self.charge=math.min(4,self.charge+math.floor(self:progress()/6)-math.floor(before/6));return added
end
function Game:checkGoal() if self:progress()==self:goal() then self:finish('win') end end
function Game:resolve(protect)
 local clears,chain,stamped={},0,self:stampTargets();local groups=self:groups()
 while #groups>0 do chain=chain+1;local cells={}
  for _,group in ipairs(groups) do for _,p in ipairs(group) do cells[#cells+1]=p;self.board[p.y][p.x]=false end end
  local cats=#cells;local debris={};for _,p in ipairs(cells) do for _,n in ipairs(neighbors(p.x,p.y)) do if n.x>=0 and n.x<C and n.y>=0 and n.y<R and self.board[n.y][n.x]==B then n.color=B;debris[#debris+1]=n;self.board[n.y][n.x]=false end end end
  for _,p in ipairs(debris) do cells[#cells+1]=p end
  self.saved=self.saved+cats;self:addScore(cats*20*chain);self.charge=math.min(4,self.charge+#groups);clears[#clears+1]={cells=cells,chain=chain};self:collapse(protect);stamped=stamped+self:stampTargets();groups=self:groups()
 end
 self.bestChain=math.max(self.bestChain,chain);self:checkGoal();return {moved=false,clears=clears,chain=chain,stamped=stamped}
end
function Game:relocateActive()
 if self:fits(self.active) then return true end;local old=self.active
 for r=old.r-1,-R,-1 do local p=copy(old);p.r=r;if self:fits(p) then self.active=p;return true end end
 for q=0,C-1 do for r=-R,R-1 do local p=copy(old);p.q=q;p.r=r;if self:fits(p) then self.active=p;return true end end end;return false
end
function Game:purr()
 if self.over or self.charge<4 then return nil end;self.charge=0;local cells,cats={},0
 for y=R-2,R-1 do for x=0,C-1 do if self.board[y][x]~=false then local color=self.board[y][x];cells[#cells+1]={x=x,y=y,color=color};if cat(color) then cats=cats+1 end;self.board[y][x]=false end end end
 self.saved=self.saved+cats;self:addScore(cats*10);self:collapse(true);local result=self:resolve(true);if not self.over and not self:relocateActive() then self:finish('full') end
 table.insert(result.clears,1,{cells=cells,chain=0});result.purr=true;return result
end
function Game:appearMosquito()
 if self.over or self.mosquito then return false end;local hp=4+math.floor(self.stage/9)
 self.mosquito={hp=hp,maxHp=hp,age=0,phase=self.random()*math.pi*2,cooldown=0,dropMs=4200,placements=3,drops=0};self.events[#self.events+1]={type='mosquito-warning'};return true
end
function Game:restMosquito() self.mosquito=nil;self.mosquitoMs=20000+math.floor(self.random()*5000);self.mosquitoMoves=6 end
function Game:dropClutter()
 if not self.mosquito or self.over then return {} end
 local cells,active,count,used={},{},0,{};for _,p in ipairs(self:cells()) do active[p.y*C+p.x]=true end
 for y=0,R-1 do for x=0,C-1 do if self.board[y][x]==B then count=count+1 end end end
 for _=1,math.min(10-count,self.stage>=12 and 2 or 1) do local candidates={}
  for x=0,C-1 do local y=R-1;for yy=0,R-1 do if self.board[yy][x]~=false then y=yy-1;break end end
   if y>=4 and not active[y*C+x] and not used[x] then candidates[#candidates+1]={x=x,y=y,color=B} end
  end
  if #candidates==0 then break end;local p=candidates[math.floor(self.random()*#candidates)+1];self.board[p.y][p.x]=B;cells[#cells+1]=p;used[p.x]=true
 end
 local m=self.mosquito;m.drops=m.drops+1;m.dropMs=math.max(2800,4200-self.stage*35);m.placements=3
 if #cells>0 then self.events[#self.events+1]={type='mosquito-clutter',cells=cells} end
 if m.drops>=3 or #cells==0 then self:restMosquito();self.events[#self.events+1]={type='mosquito-away'} end;return cells
end
function Game:clearClutter()
 local cells={};for y=0,R-1 do for x=0,C-1 do if self.board[y][x]==B then cells[#cells+1]={x=x,y=y,color=B};self.board[y][x]=false end end end
 self:collapse(true);local result=self:resolve(true);if #cells>0 then table.insert(result.clears,1,{cells=cells,chain=0}) end;result.clutter=#cells;return result
end
function Game:shootMosquito(hit)
 if self.over or not self.mosquito or self.mosquito.cooldown>0 then return false end
 self.mosquito.cooldown=Core.WEAPONS[self.weapon].cooldown
 if hit==false then self.events[#self.events+1]={type='mosquito-miss'};return true end
 self.mosquito.hp=math.max(0,self.mosquito.hp-Core.WEAPONS[self.weapon].damage);self.mosquito.dropMs=self.mosquito.dropMs+220
 if self.mosquito.hp>0 then self.events[#self.events+1]={type='mosquito-hit',hp=self.mosquito.hp}
 else self:restMosquito();self:addScore(100);self.charge=math.min(4,self.charge+1);local result=self:clearClutter();self.events[#self.events+1]={type='mosquito-defeated',result=result} end;return true
end
function Game:canBuy(id) local w=Core.WEAPONS[id];return w~=nil and self:won() and not self:campaignWon() and not contains(self.owned,id) and self.coins>=w.price end
function Game:buy(id) if not self:canBuy(id) then return false end;self.coins=self.coins-Core.WEAPONS[id].price;self.owned[#self.owned+1]=id;self.weapon=id;return true end
function Game:equip(id) if not contains(self.owned,id) then return false end;self.weapon=id;return true end
function Game:cycleWeapon() local ids={};for _,id in ipairs(Core.WEAPON_IDS) do if contains(self.owned,id) then ids[#ids+1]=id end end;for i,id in ipairs(ids) do if id==self.weapon then self.weapon=ids[i%#ids+1];break end end;return self.weapon end
return Core
