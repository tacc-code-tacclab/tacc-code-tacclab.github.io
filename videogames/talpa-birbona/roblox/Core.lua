-- Deterministic rules shared with the browser edition (coordinates are zero-based).
local Core = {COLS=28, ROWS=14, LAST_LEVEL=10, SPEED=4.6}
Core.CROPS = {
    {name="Carota",points=100}, {name="Patate",points=120}, {name="Cavolo",points=140},
    {name="Pero",points=300}, {name="Melo",points=280}, {name="Albicocco",points=320},
    {name="Grano",points=80}, {name="Pomodori",points=160}, {name="Zucchini",points=180}, {name="Melanzane",points=200}
}

local ORDER={1,2,3,8,9,10,4,5,6,7}
local DIRECTIONS={{1,0},{-1,0},{0,1},{0,-1}}
local function clamp(v,a,b) return math.max(a,math.min(b,v)) end
local function index(c,r) return r*Core.COLS+c+1 end
local function length(x,y) return math.sqrt(x*x+y*y) end
local Game={}; Game.__index=Game

function Core.new(level,score,assist)
    local g=setmetatable({assist=not not assist},Game)
    g:start(level or 1,score or 0)
    return g
end

function Game:start(level,score)
    self.level=clamp(level or 1,1,Core.LAST_LEVEL); self.score=score or 0; self.startScore=self.score
    self.status="playing"; self.time=0; self.health=3; self.invulnerable=0
    self.player={x=1.5,y=.5,facing=1,moving=false}
    self.dug={}; self.antDug={}; self.poison={}; self.holes={}; self.waves={}; self.ants={}; self.events={}
    for i=1,Core.COLS*Core.ROWS do self.dug[i]=false; self.antDug[i]=false; self.poison[i]=0 end
    self.randomState=9187+self.level*7919; self.plants={}
    local count=math.min(10,3+self.level)
    for i=0,count-1 do
        self.plants[i+1]={kind=ORDER[(i+self.level-1)%#ORDER+1],x=3.5+i*22/(count-1),
            y=self.level==1 and 2.5+((i+self.level)%3) or 2.5+((i*3+self.level)%math.min(8,self.level+3)),eaten=false}
    end
    self.remaining=count; self.total=count
    self.difficulty={
        interval=math.max(1.2,3.4-(self.level-1)*.24),
        warning=math.max(.45,1.05-(self.level-1)*.065),
        -- The later gardens stay demanding without making level 6 a hard wall.
        floodStep=math.max(.115,.235-(self.level-1)*.012),
        poisonLife=4,
        farmerSpeed=9.2+self.level*1.25,
        antCount=self.level==1 and 0 or math.min(5,math.floor(self.level/2)),
        antSpeed=1.35+self.level*.16,
        antSpawn=math.max(2.6,4.5-(self.level-2)*.22)
    }
    self.farmer={x=6.5,mode="waiting",target=1,clock=self.level==1 and 1.8 or math.max(.35,1-(self.level-2)*.075),previous=-1}
    self.antClock=self.level==1 and math.huge or math.max(2.3,3.8-(self.level-2)*.16)
    if self.assist then
        self.difficulty.interval=self.difficulty.interval*1.08; self.difficulty.warning=self.difficulty.warning+.15
        self.difficulty.floodStep=self.difficulty.floodStep*1.08; self.difficulty.farmerSpeed=self.difficulty.farmerSpeed*.96
        self.difficulty.antSpeed=self.difficulty.antSpeed*.94; self.farmer.clock=self.farmer.clock+.35; self.antClock=self.antClock+.45
    end
    self:dig(self.player.x,self.player.y)
end

function Game:random()
    self.randomState=(self.randomState*16807)%2147483647
    return self.randomState/2147483647
end

function Game:makeWave(k)
    return {pending={{k=k,at=0,dc=0,dr=0}},arrival={[k]=0},seen={[k]=true},frontier={k},age=0}
end

function Game:flowDelay(dc,dr,previousDc,previousDr)
    -- Falling remains dangerous, while horizontal runs, climbs and bends reward zig-zag escape tunnels.
    local directionFactor=dr>0 and .55 or (dr<0 and 3.2 or 1.75)
    previousDc=previousDc or 0; previousDr=previousDr or 0
    local turned=(previousDc~=0 or previousDr~=0) and (dc~=previousDc or dr~=previousDr)
    return self.difficulty.floodStep*(directionFactor+(turned and .65 or 0))
end

function Game:injectWaveCell(wave,k,dc,dr)
    local previous=wave.arrival[k]
    if previous and previous<=wave.age then return end
    wave.arrival[k]=wave.age; wave.seen[k]=true
    table.insert(wave.pending,{k=k,at=wave.age,dc=dc or 0,dr=dr or 0})
    local present=false; for _,front in ipairs(wave.frontier) do if front==k then present=true; break end end
    if not present then table.insert(wave.frontier,k) end
end

function Game:carryPoisonIntoAntTunnel(k,c,r)
    local poisoned=nil
    for _,d in ipairs(DIRECTIONS) do
        local nc,nr=c+d[1],r+d[2]
        if nc>=0 and nc<Core.COLS and nr>=0 and nr<Core.ROWS then
            local nk=index(nc,nr); if self.poison[nk]>0 then poisoned=nk; break end
        end
    end
    if not poisoned then return end
    self.poison[k]=math.max(self.poison[k],self.difficulty.poisonLife)
    local wave=nil
    for _,candidate in ipairs(self.waves) do if candidate.seen[poisoned] then wave=candidate; break end end
    local pc=(poisoned-1)%Core.COLS; local pr=math.floor((poisoned-1)/Core.COLS)
    if wave then self:injectWaveCell(wave,k,c-pc,r-pr) else table.insert(self.waves,self:makeWave(k)) end
    table.insert(self.events,{type="poisonBreach",x=c+.5,y=r+.5})
end

function Game:dig(x,y,source)
    source=source or "mole"
    local c=clamp(math.floor(x),0,Core.COLS-1); local r=clamp(math.floor(y),0,Core.ROWS-1); local k=index(c,r)
    if not self.dug[k] then
        self.dug[k]=true; if source=="ant" then self.antDug[k]=true end
        table.insert(self.events,{type="dig",source=source,x=c+.5,y=r+.5})
        if source=="ant" then self:carryPoisonIntoAntTunnel(k,c,r) end
    end
    if r==0 then
        local exists=false; for _,h in ipairs(self.holes) do if h==c then exists=true; break end end
        if not exists then table.insert(self.holes,c); table.insert(self.events,{type="hole",source=source,x=c+.5,y=0}) end
    end
end

function Game:beginWave(c)
    local k=index(c,0); self.poison[k]=math.max(self.poison[k],self.difficulty.poisonLife)
    table.insert(self.waves,self:makeWave(k)); table.insert(self.events,{type="pour",x=c+.5,y=0})
end

function Game:antPosition()
    local candidates={
        {x=.75,y=2+self:random()*(Core.ROWS-2.75)},
        {x=Core.COLS-.75,y=2+self:random()*(Core.ROWS-2.75)},
        {x=2+self:random()*(Core.COLS-4),y=Core.ROWS-.75}
    }
    local best=candidates[1]; local bestDistance=length(best.x-self.player.x,best.y-self.player.y)
    for i=2,#candidates do
        local distance=length(candidates[i].x-self.player.x,candidates[i].y-self.player.y)
        if distance>bestDistance then best=candidates[i]; bestDistance=distance end
    end
    return best
end

function Game:spawnAnt()
    local position=self:antPosition()
    local ant={x=position.x,y=position.y,vx=0,vy=0,facing=position.x<self.player.x and 1 or -1,phase=self:random()*math.pi*2,cooldown=.45}
    table.insert(self.ants,ant); self:dig(ant.x,ant.y,"ant")
    table.insert(self.events,{type="antSpawn",x=ant.x,y=ant.y,count=#self.ants})
end

function Game:moveAntAway(ant)
    local position=self:antPosition()
    ant.x=position.x; ant.y=position.y; ant.vx=0; ant.vy=0; ant.cooldown=1.15
    self:dig(ant.x,ant.y,"ant")
end

function Game:hurtPlayer(source,x,y)
    if self.invulnerable>0 or self.status~="playing" then return false end
    self.health=self.health-1; self.invulnerable=1.8
    local fatal=self.health<=0
    table.insert(self.events,{type="hurt",source=source,x=x or self.player.x,y=y or self.player.y,fatal=fatal})
    if fatal then self.status="lost"; table.insert(self.events,{type="lose",source=source}) end
    return true
end

function Game:killPlayer(source,x,y)
    if self.status~="playing" then return false end
    self.health=0; self.invulnerable=0
    table.insert(self.events,{type="hurt",source=source,x=x or self.player.x,y=y or self.player.y,fatal=true})
    self.status="lost"; table.insert(self.events,{type="lose",source=source})
    return true
end

function Game:poisonTouchesPlayer()
    local p=self.player
    if self.poison[index(math.floor(p.x),math.floor(p.y))]<=0 then return false end
    return self:killPlayer("poison",p.x,p.y)
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
        local candidates={}; for _,c in ipairs(self.holes) do if c~=f.previous then table.insert(candidates,c) end end
        while #candidates>3 do table.remove(candidates,1) end
        local choices=#candidates>0 and candidates or self.holes
        f.target=choices[math.floor(self:random()*#choices)+1]; f.previous=f.target; f.mode="walking"
    elseif f.mode=="warning" then
        self:beginWave(f.target); f.mode="pouring"; f.clock=.32
    else f.mode="waiting"; f.clock=self.difficulty.interval end
end

function Game:updateAnts(dt)
    self.antClock=self.antClock-dt
    if #self.ants<self.difficulty.antCount and self.antClock<=0 then
        self:spawnAnt(); self.antClock=self.difficulty.antSpawn
    end
    for _,ant in ipairs(self.ants) do
        ant.cooldown=math.max(0,ant.cooldown-dt)
        if ant.cooldown<=0 then
            local dx,dy=self.player.x-ant.x,self.player.y-ant.y; local distance=length(dx,dy)
            if distance>.001 then
                local oldX,oldY=ant.x,ant.y; local sway=math.sin(self.time*1.8+ant.phase)*.16
                local ux,uy=dx/distance,dy/distance
                ant.vx=ux-uy*sway; ant.vy=uy+ux*sway
                local magnitude=length(ant.vx,ant.vy); if magnitude==0 then magnitude=1 end
                ant.vx=ant.vx/magnitude; ant.vy=ant.vy/magnitude; ant.facing=ant.vx>=0 and 1 or -1
                ant.x=clamp(ant.x+ant.vx*self.difficulty.antSpeed*dt,.45,Core.COLS-.45)
                ant.y=clamp(ant.y+ant.vy*self.difficulty.antSpeed*dt,.45,Core.ROWS-.45)
                if math.floor(ant.x)~=math.floor(oldX) and math.floor(ant.y)~=math.floor(oldY) then self:dig(ant.x,oldY,"ant") end
                self:dig(ant.x,ant.y,"ant")
            end
            if length(self.player.x-ant.x,self.player.y-ant.y)<.62 then
                self:hurtPlayer("ant",ant.x,ant.y); self:moveAntAway(ant)
                if self.status~="playing" then break end
            end
        end
    end
end

function Game:step(dt,dx,dy)
    self.time=self.time+dt; self.invulnerable=math.max(0,self.invulnerable-dt)
    local p=self.player; local magnitude=length(dx,dy); p.moving=magnitude>.01
    if magnitude>.01 then
        local strength=math.min(1,magnitude)
        local nx=clamp(p.x+dx/magnitude*Core.SPEED*strength*dt,.5,Core.COLS-.5)
        local ny=clamp(p.y+dy/magnitude*Core.SPEED*strength*dt,.5,Core.ROWS-.5)
        if math.floor(nx)~=math.floor(p.x) and math.floor(ny)~=math.floor(p.y) then self:dig(nx,p.y) end
        p.x=nx; p.y=ny; if math.abs(dx)>.01 then p.facing=dx>0 and 1 or -1 end; self:dig(p.x,p.y)
    end
    -- Poison is lethal on the first frame of contact, even during an ant grace period.
    if self:poisonTouchesPlayer() then return end
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
        wave.age=wave.age+dt
        if wave.age<=13 then
            local ready,waiting={},{}
            for _,entry in ipairs(wave.pending) do
                if entry.at<=wave.age+1e-9 then table.insert(ready,entry) else table.insert(waiting,entry) end
            end
            wave.pending=waiting; table.sort(ready,function(a,b) return a.at<b.at end)
            local activated={}
            for _,entry in ipairs(ready) do
                if math.abs((wave.arrival[entry.k] or math.huge)-entry.at)<=1e-9 then
                    local k=entry.k; local c=(k-1)%Core.COLS; local r=math.floor((k-1)/Core.COLS)
                    table.insert(activated,k); self.poison[k]=math.max(self.poison[k],self.difficulty.poisonLife)
                    for _,d in ipairs(DIRECTIONS) do
                        local nc,nr=c+d[1],r+d[2]
                        if nc>=0 and nc<Core.COLS and nr>=0 and nr<Core.ROWS then
                            local nk=index(nc,nr); local at=entry.at+self:flowDelay(d[1],d[2],entry.dc,entry.dr); local arrival=wave.arrival[nk]
                            if self.dug[nk] and (not arrival or at+1e-9<arrival) then
                                wave.arrival[nk]=at; wave.seen[nk]=true; table.insert(wave.pending,{k=nk,at=at,dc=d[1],dr=d[2]})
                            end
                        end
                    end
                end
            end
            if #activated>0 then wave.frontier=activated end
        end
        if wave.age<=13 and #wave.pending>0 then table.insert(kept,wave) end
    end
    self.waves=kept
    if self:poisonTouchesPlayer() then return end
    self:updateAnts(dt)
    if self.status=="playing" then self:poisonTouchesPlayer() end
end

function Game:update(dt,dx,dy)
    if self.status~="playing" or dt~=dt or dt<=0 then return end
    local left=math.min(dt,.25)
    while left>1e-8 and self.status=="playing" do
        local step=math.min(left,1/60); self:step(step,dx or 0,dy or 0); left=left-step
    end
end

function Game:takeEvents() local out=self.events; self.events={}; return out end
function Game:retry() self:start(self.level,self.startScore) end
function Game:next() if self.status=="won" then self:start(self.level+1,self.score) end end
return Core
