local Core=dofile('roblox/Core.lua')
local function near(a,b) assert(math.abs(a-b)<1e-8,tostring(a)..' != '..tostring(b)) end
local function drive(g,x,y)
    local ticks=0
    while g.status=='playing' do
        local dx,dy=x-g.player.x,y-g.player.y; local dist=math.sqrt(dx*dx+dy*dy)
        if dist<.08 then break end
        local amount=math.min(1,dist/(Core.SPEED/60)); g:update(1/60,dx/dist*amount,dy/dist*amount)
        ticks=ticks+1; assert(ticks<3000)
    end
end
local g=Core.new();local expected=0;local kinds={}
for level=1,10 do
    assert(g.level==level)
    for _,p in ipairs(g.plants) do kinds[p.kind]=true; expected=expected+Core.CROPS[p.kind].points; drive(g,p.x,p.y) end
    assert(g.remaining==0); assert(g.status==(level==10 and 'complete' or 'won'));assert(g.health>0)
    expected=expected+g.health*100; assert(g.score==expected);assert(#g.holes>1)
    if level<10 then g:next() end
end
local count=0;for _ in pairs(kinds) do count=count+1 end;assert(count==10)
g:next();assert(g.level==10);g:start(1,0);assert(g.health==3 and g.score==0 and g.remaining==4)
g:update(1/60,1,0);near(g.player.x,1.5+Core.SPEED/60)
local x=g.player.x;g:update(.1,0,0);near(g.player.x,x)
g:start(1,0);g.farmer.clock=1e6
for r=0,4 do g:dig(1.5,r+.5) end
g:dig(5.5,2.5);g:beginWave(1);g.player={x=20.5,y=12.5,facing=1}
for i=1,150 do g:update(1/60) end
assert(g.poison[3*Core.COLS+2]>0);assert(g.poison[2*Core.COLS+6]==0);assert(g.poison[2*Core.COLS+3]==0)
for i=1,1400 do g:update(1/60) end
for _,p in ipairs(g.poison) do assert(p==0) end;assert(#g.waves==0 and g.health==3)
g:start(4,900);g.farmer.clock=1e6;g.poison[2]=10;g:update(1/60);assert(g.health==2)
for i=1,60 do g:update(1/60) end;assert(g.health==2)
for i=1,240 do g:update(1/60) end;assert(g.status=='lost')
g.score=g.score+500;g:retry();assert(g.score==900 and g.level==4 and g.health==3)
print('Lua core: 10 gardens, final victory, scoring, movement, poison, damage and retry passed.')
