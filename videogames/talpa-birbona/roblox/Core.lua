-- Deterministic rules shared with the browser edition (coordinates are zero-based).
local Core = {COLS=28, ROWS=14, LAST_LEVEL=10, SPEED=4.6}
Core.CROPS = {
    {name="Carota",points=100}, {name="Patate",points=120}, {name="Cavolo",points=140},
    {name="Pero",points=300}, {name="Melo",points=280}, {name="Albicocco",points=320},
    {name="Grano",points=80}, {name="Pomodori",points=160}, {name="Zucchini",points=180}, {name="Melanzane",points=200}
}
local ORDER={1,2,3,8,9,10,4,5,6,7}
local function clamp(v,a,b) return math.max(a,math.min(b,v)) end
local function index(c,r) return r*Core.COLS+c+1 end
local function length(x,y) return math.sqrt(x*x+y*y) end
local Game={}; Game.__index=Game
function Core.new(level,score) local g=setmetatable({},Game); g:start(level or 1,score or 0); return g end
function Game:start(level,score)
    self.level=clamp(level or 1,1,Core.LAST_LEVEL); self.score=score or 0; self.startScore=self.score
    self.status="playing"; self.time=0; self.health=3; self.invulnerable=0
    self.player={x=1.5,y=.5,facing=1,moving=false}; self.dug={}; self.poison={}; self.holes={}; self.waves={}; self.events={}
    for i=1,Core.COLS*Core.ROWS do self.dug[i]=false; self.poison[i]=0 end
    self.randomState=9187+self.level*7919; self.plants={}
    local count=math.min(10,3+self.level)
    for i=0,count-1 do self.plants[i+1]={kind=ORDER[(i+self.level-1)%#ORDER+1],x=3.5+i*22/(count-1),y=self.level==1 and 2.5+((i+self.level)%3) or 2.5+((i*3+self.level)%math.min(8,self.level+3)),eaten=false} end
    self.remaining=count; self.total=count
    self.difficulty={interval=math.max(2.8,7.5-(self.level-1)*.45),warning=math.max(1.4,2.8-(self.level-1)*.12),
        floodStep=math.max(.32,.68-(self.level-1)*.034),farmerSpeed=4.5+self.level*.65}
    self.farmer={x=6.5,mode="waiting",target=1,clock=self.level==1 and 6 or math.max(.6,2.5-(self.level-2)*.24),previous=-1}
    self:dig(self.player.x,self.player.y)
end
function Game:random() self.randomState=(self.randomState*16807)%2147483647; return self.randomState/2147483647 end
function Game:dig(x,y)
    local c=clamp(math.floor(x),0,Core.COLS-1); local r=clamp(math.floor(y),0,Core.ROWS-1); local k=index(c,r)
    if not self.dug[k] then self.dug[k]=true; table.insert(self.events,{type="dig",x=c+.5,y=r+.5}) end
    if r==0 then
        local exists=false; for _,h in ipairs(self.holes) do if h==c then exists=true end end
        if not exists then table.insert(self.holes,c); table.insert(self.events,{type="hole",x=c+.5,y=0}) end
    end
end
function Game:beginWave(c)
    local k=index(c,0); self.poison[k]=math.max(self.poison[k],5)
    table.insert(self.waves,{frontier={k},seen={[k]=true},clock=0,age=0})
    table.insert(self.events,{type="pour",x=c+.5,y=0})
end
function Game:updateFarmer(dt)
    local f=self.farmer
    if f.mode=="walking" then
        local distance=f.target+.5-f.x; local step=self.difficulty.farmerSpeed*dt
        if math.abs(distance)<=step then
            f.x=f.target+.5; f.mode="warning"; f.clock=self.difficulty.warning
            table.insert(self.events,{type="warning",x=f.x,y=0})
        else f.x=f.x+(distance>0 and 1 or -1)*step end
        return
    end
    f.clock=f.clock-dt; if f.clock>0 then return end
    if f.mode=="waiting" then
        local choices={}; for _,c in ipairs(self.holes) do if c~=f.previous then table.insert(choices,c) end end
        while #choices>3 do table.remove(choices,1) end
        if #choices==0 then choices=self.holes end
        f.target=choices[math.floor(self:random()*#choices)+1]; f.previous=f.target; f.mode="walking"
    elseif f.mode=="warning" then self:beginWave(f.target); f.mode="pouring"; f.clock=1.1
    else f.mode="waiting"; f.clock=self.difficulty.interval end
end
function Game:step(dt,dx,dy)
    self.time=self.time+dt; self.invulnerable=math.max(0,self.invulnerable-dt)
    local p=self.player; local n=length(dx,dy); p.moving=n>.01
    if n>.01 then
        local speed=Core.SPEED; local strength=math.min(1,n)
        local nx=clamp(p.x+dx/n*speed*strength*dt,.5,Core.COLS-.5)
        local ny=clamp(p.y+dy/n*speed*strength*dt,.5,Core.ROWS-.5)
        if math.floor(nx)~=math.floor(p.x) and math.floor(ny)~=math.floor(p.y) then self:dig(nx,p.y) end
        p.x=nx; p.y=ny; if math.abs(dx)>.01 then p.facing=dx>0 and 1 or -1 end; self:dig(p.x,p.y)
    end
    for _,plant in ipairs(self.plants) do
        if not plant.eaten and length(plant.x-p.x,plant.y-p.y)<.72 then
            plant.eaten=true; self.remaining=self.remaining-1; local crop=Core.CROPS[plant.kind]; self.score=self.score+crop.points
            for r=0,math.floor(plant.y) do self:dig(plant.x,r+.5) end
            table.insert(self.events,{type="eat",x=plant.x,y=plant.y,points=crop.points,kind=plant.kind})
        end
    end
    if self.remaining==0 then
        self.bonus=self.health*100; self.score=self.score+self.bonus
        self.status=self.level==Core.LAST_LEVEL and "complete" or "won"; table.insert(self.events,{type="win"}); return
    end
    self:updateFarmer(dt)
    for i=1,#self.poison do self.poison[i]=math.max(0,self.poison[i]-dt) end
    local kept={}
    for _,wave in ipairs(self.waves) do
        wave.age=wave.age+dt; wave.clock=wave.clock+dt
        if wave.clock>=self.difficulty.floodStep and wave.age<=18 then
            wave.clock=wave.clock-self.difficulty.floodStep; local nextCells={}
            for _,k in ipairs(wave.frontier) do
                local c=(k-1)%Core.COLS; local r=math.floor((k-1)/Core.COLS)
                for _,d in ipairs({{1,0},{-1,0},{0,1},{0,-1}}) do
                    local nc=c+d[1]; local nr=r+d[2]
                    if nc>=0 and nc<Core.COLS and nr>=0 and nr<Core.ROWS then
                        local nk=index(nc,nr)
                        if self.dug[nk] and not wave.seen[nk] then wave.seen[nk]=true; table.insert(nextCells,nk); self.poison[nk]=5 end
                    end
                end
            end
            wave.frontier=nextCells
        end
        if wave.age<=18 and #wave.frontier>0 then table.insert(kept,wave) end
    end
    self.waves=kept
    if self.poison[index(math.floor(p.x),math.floor(p.y))]>0 and self.invulnerable==0 then
        self.health=self.health-1; self.invulnerable=1.8; table.insert(self.events,{type="hurt",x=p.x,y=p.y})
        if self.health<=0 then self.status="lost"; table.insert(self.events,{type="lose"}) end
    end
end
function Game:update(dt,dx,dy)
    if self.status~="playing" or dt~=dt or dt<=0 then return end
    local left=math.min(dt,.25)
    while left>1e-8 and self.status=="playing" do local step=math.min(left,1/60); self:step(step,dx or 0,dy or 0); left=left-step end
end
function Game:takeEvents() local out=self.events; self.events={}; return out end
function Game:retry() self:start(self.level,self.startScore) end
function Game:next() if self.status=="won" then self:start(self.level+1,self.score) end end
return Core
