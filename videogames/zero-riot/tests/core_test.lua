-- Run from the game directory with Lua or luatex --luaonly tests/core_test.lua.
math.atan2=math.atan2 or function(y,x) return math.atan(y,x) end
local R=dofile('roblox/Core.lua')
assert(loadfile('roblox/ZeroRiot.client.lua'))
local g=R.create('nova')
g.enemies={{x=g.x+20,y=g.y},{x=g.x+500,y=g.y}}
for _,v in ipairs({3,4,-7}) do R.collect(g,{x=0,y=0,v=v}) end
assert(g.charge==0 and g.novas==1 and g.score==563 and g.kills==1 and #g.enemies==1)
local h=R.create('overload');h.invulnerable=0;R.collect(h,{v=7});R.collect(h,{v=3});assert(h.lives==2 and h.charge==0)
local f=R.create('flip');f.charge=5;local v=f.pickups[1].v;assert(R.flip(f));assert(f.charge==5 and f.pickups[1].v==-v);assert(not R.flip(f))
local e=R.create('end');e.pickups={};e.spawnAt=999;for i=1,5500 do R.step(e,1/60) end;assert(e.ended and e.won and e.score==900)
local p=R.create('cross-platform')
for i=0,4799 do
 if p.ended then break end
 if i%173==0 then R.flip(p) end
 local a=i*.013;R.step(p,1/60,{x=math.cos(a),y=math.sin(a)});p.events={}
end
local out=assert(io.open('tests/parity-actual.json','w'))
out:write(string.format('{"time":%.15g,"x":%.15g,"y":%.15g,"charge":%d,"lives":%d,"score":%d,"novas":%d,"seed":%d,"pickups":[',p.time,p.x,p.y,p.charge,p.lives,p.score,p.novas,R.seedNumber('cross-platform')))
for i,pick in ipairs(p.pickups) do if i>1 then out:write(',') end;out:write(string.format('{"x":%.15g,"y":%.15g,"v":%d}',pick.x,pick.y,pick.v)) end
out:write(']}');out:close()
print('PASS Lua arithmetic, flip, overload, endpoint, client syntax and trace.')
