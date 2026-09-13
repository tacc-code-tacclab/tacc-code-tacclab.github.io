local Core=dofile('roblox/Core.lua')
local function near(a,b,tolerance) assert(math.abs(a-b)<(tolerance or 1e-8),tostring(a)..' != '..tostring(b)) end
local function drive(g,x,y)
    local ticks=0
    while g.status=='playing' do
        local dx,dy=x-g.player.x,y-g.player.y; local dist=math.sqrt(dx*dx+dy*dy)
        if dist<.08 then break end
        local amount=math.min(1,dist/(Core.SPEED/60)); g:update(1/60,dx/dist*amount,dy/dist*amount)
        ticks=ticks+1; assert(ticks<3000)
    end
end

local g=Core.new(); local expected=0; local kinds={}
for level=1,Core.LAST_LEVEL do
    assert(g.level==level); g.invulnerable=math.huge; g.farmer.clock=1e6; g.antClock=math.huge; g.difficulty.antCount=0
    local plants={}; for i,p in ipairs(g.plants) do plants[i]={kind=p.kind,x=p.x,y=p.y} end
    for _,p in ipairs(plants) do kinds[p.kind]=true; expected=expected+Core.CROPS[p.kind].points; drive(g,p.x,p.y) end
    assert(g.remaining==0); assert(g.status==(level==Core.LAST_LEVEL and 'complete' or 'won')); assert(g.health>0)
    expected=expected+g.health*100; assert(g.score==expected); assert(#g.holes>1)
    if level<Core.LAST_LEVEL then g:next() end
end
local count=0; for _ in pairs(kinds) do count=count+1 end; assert(count==10)
g:next(); assert(g.level==Core.LAST_LEVEL); g:start(1,0); assert(g.health==3 and g.score==0 and g.remaining==4)
g:update(1/60,1,0); near(g.player.x,1.5+Core.SPEED/60)
local x=g.player.x; g:update(.1,0,0); near(g.player.x,x)

-- Poison remains inside connected tunnels and disappears completely.
g:start(1,0); g.farmer.clock=1e6
for r=0,4 do g:dig(1.5,r+.5) end
g:dig(5.5,2.5); g:beginWave(1); g.player={x=20.5,y=12.5,facing=1}
for _=1,90 do g:update(1/60) end
assert(g.poison[3*Core.COLS+2]>0); assert(g.poison[2*Core.COLS+6]==0); assert(g.poison[2*Core.COLS+3]==0)
for _=1,1400 do g:update(1/60) end
for _,p in ipairs(g.poison) do assert(p==0) end; assert(#g.waves==0 and g.health==3)

-- Gravity makes poison fall first, then move sideways, then climb.
g=Core.new(1); g.farmer.clock=1e6; g.antClock=math.huge; g.difficulty.antCount=0
for i=1,#g.dug do g.dug[i]=false; g.poison[i]=0 end
g.player={x=.5,y=.5,facing=1,moving=false}
local c,r=12,6; local source=r*Core.COLS+c+1; local down=(r+1)*Core.COLS+c+1; local side=r*Core.COLS+c+2; local up=(r-1)*Core.COLS+c+1
for _,k in ipairs({source,down,side,up}) do g.dug[k]=true end
g.poison[source]=g.difficulty.poisonLife; g.waves={g:makeWave(source)}
local downAt,sideAt,upAt=nil,nil,nil
for _=1,1000 do
    g:update(1/240)
    if not downAt and g.poison[down]>0 then downAt=g.time end
    if not sideAt and g.poison[side]>0 then sideAt=g.time end
    if not upAt and g.poison[up]>0 then upAt=g.time; break end
end
assert(downAt and sideAt and upAt and downAt<sideAt and sideAt<upAt)
assert(downAt<g.difficulty.floodStep*.65); assert(upAt>g.difficulty.floodStep*3)
for _=1,1200 do g:update(1/120) end
for _,p in ipairs(g.poison) do assert(p==0) end; assert(#g.waves==0)

-- A complete pour, including cells reached later, has a hard lifetime of 2.5 seconds.
g=Core.new(5); g.farmer.clock=1e6; g.antClock=math.huge; g.difficulty.antCount=0
g.player={x=Core.COLS-.5,y=Core.ROWS-.5,facing=1,moving=false}
for rr=0,7 do g:dig(12.5,rr+.5) end; for cc=12,19 do g:dig(cc+.5,7.5) end; g:beginWave(12)
for _=1,149 do g:update(1/60) end
local active=false; for _,p in ipairs(g.poison) do if p>0 then active=true end end; assert(active)
for _=1,4 do g:update(1/60) end
for _,p in ipairs(g.poison) do assert(p==0) end; assert(#g.waves==0)

-- From garden 6 onward, a mole moving horizontally can outrun poison; every bend buys extra time.
for _,level in ipairs({6,10,20}) do
    local balanced=Core.new(level); local moleCellTime=1/Core.SPEED
    local horizontal=balanced:flowDelay(1,0); local uphill=balanced:flowDelay(0,-1); local downhill=balanced:flowDelay(0,1)
    assert(downhill<moleCellTime and horizontal>moleCellTime and uphill>horizontal)
    assert(balanced:flowDelay(1,0,0,1)>horizontal); assert(balanced:flowDelay(0,-1,1,0)>uphill)
    balanced.farmer.clock=1e6; balanced.antClock=math.huge; balanced.difficulty.antCount=0
    for i=1,#balanced.dug do balanced.dug[i]=false; balanced.poison[i]=0 end
    balanced.player={x=Core.COLS-.5,y=Core.ROWS-.5,facing=1,moving=false}
    local path={{2,0}}; local c,r=2,0
    for i=0,13 do if i%2==0 then r=r+1 else c=c+1 end; table.insert(path,{c,r}) end
    for _,cell in ipairs(path) do balanced.dug[cell[2]*Core.COLS+cell[1]+1]=true end
    local source=path[1][2]*Core.COLS+path[1][1]+1; local last=path[#path]; local target=last[2]*Core.COLS+last[1]+1
    balanced.poison[source]=balanced.difficulty.poisonLife; balanced.waves={balanced:makeWave(source)}
    local arrival=nil
    for _=1,4000 do
        if #balanced.waves==0 then break end
        balanced:update(1/480); if balanced.poison[target]>0 then arrival=balanced.time; break end
    end
    assert(not arrival or arrival>(#path-1)/Core.SPEED)
    if not arrival then assert(balanced.poison[target]==0) end
end

-- Later gardens add ants that chase, hurt and carve connected passages.
local first,middle,tenth,last=Core.new(1),Core.new(6),Core.new(10),Core.new(20)
assert(first.difficulty.antCount==0 and middle.difficulty.antCount==3 and tenth.difficulty.antCount==5 and last.difficulty.antCount==5)
assert(tenth.difficulty.interval<middle.difficulty.interval and middle.difficulty.interval<first.difficulty.interval)
assert(last.difficulty.warning<first.difficulty.warning and last.difficulty.floodStep<first.difficulty.floodStep)
near(tenth.difficulty.farmerSpeed,21.7); near(tenth.difficulty.antSpeed,2.95)
near(last.difficulty.farmerSpeed,25.2); near(last.difficulty.antSpeed,3.4)
assert(last.difficulty.farmerSpeed>tenth.difficulty.farmerSpeed and last.difficulty.antSpeed>tenth.difficulty.antSpeed)
assert(last.difficulty.antSpeed<Core.SPEED)
g=Core.new(2); g.farmer.clock=1e6; g.antClock=0; g:update(1/60)
assert(#g.ants==1); local ant=g.ants[1]; assert(math.sqrt((ant.x-g.player.x)^2+(ant.y-g.player.y)^2)>5)
ant.x=g.player.x; ant.y=g.player.y; ant.cooldown=0; g:update(1/60); assert(g.health==2)
assert(math.sqrt((ant.x-g.player.x)^2+(ant.y-g.player.y)^2)>5)
for _=1,180 do g:update(1/60) end
local antCells=0; for _,dug in ipairs(g.antDug) do if dug then antCells=antCells+1 end end; assert(antCells>3)

-- A fresh ant tunnel immediately carries adjacent active poison.
g=Core.new(2); g.farmer.clock=1e6; g.antClock=math.huge
g:dig(6.5,6.5,'ant'); g.poison[6*Core.COLS+7]=4
g:dig(7.5,6.5,'ant'); g:dig(8.5,6.5,'ant')
assert(g.poison[6*Core.COLS+8]>0 and g.poison[6*Core.COLS+9]>0)

-- Poison kills instantly even during ant-contact invulnerability; retry restores the checkpoint.
g=Core.new(4,900); g.farmer.clock=1e6; g.antClock=math.huge; g.difficulty.antCount=0
g.invulnerable=1.5; g.poison[2]=10; g:update(1/60)
assert(g.health==0 and g.status=='lost')
local fatal=false; for _,event in ipairs(g:takeEvents()) do if event.type=='hurt' and event.source=='poison' and event.fatal then fatal=true end end; assert(fatal)
g.score=g.score+500; g:retry(); assert(g.score==900 and g.level==4 and g.health==3)

print('Lua core: 20 gardens, gentle second-chapter scaling, directional fading poison, instant death, digging ants and retry passed.')
