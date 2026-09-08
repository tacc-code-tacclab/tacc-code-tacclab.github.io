-- Run from videogames/zero-riot: luatex --luaonly tests/core_test.lua
local R=dofile('roblox/Core.lua')
local function solution(g)
 for i=0,240 do local angle=-1.16+i*2.32/240;local id=R.trace(g,angle).hitId;local b=nil;for _,q in ipairs(g.bubbles) do if q.id==id then b=q;break end end
  if b then local slot=-1;for k,n in ipairs(g.ammo) do if n==R.required(g,b.v) then slot=k-1;break end end;if slot>=0 or g.rainbowReady then return angle,math.max(0,slot) end end
 end;error('No solution '..g.level)
end
local function json(v)
 if type(v)=='number' then return string.format('%.14g',v) end
 if type(v)=='string' then return '"'..v..'"' end
 if type(v)=='table' then local out={};if #v>0 or next(v)==nil then for _,x in ipairs(v) do out[#out+1]=json(x) end;return '['..table.concat(out,',')..']' else for k,x in pairs(v) do out[#out+1]=json(k)..':'..json(x) end;return '{'..table.concat(out,',')..'}' end end
 error('unsupported JSON')
end
local parity={};local g=R.create('parity-314');local shotCount=0
for level=1,12 do
 local initial,ammo={},{};for _,b in ipairs(g.bubbles) do initial[#initial+1]={b.id,b.x,b.y,b.v,b.row} end;for _,n in ipairs(g.ammo) do ammo[#ammo+1]=n end;parity[#parity+1]={level=level,initial=initial,ammo=ammo}
 while not g.ended do
  local angle,slot=solution(g);g.cooldown=0;R.select(g,slot);assert(R.shoot(g,angle));for _=1,1000 do if not g.projectile then break end;R.step(g,1/60) end;assert(not g.projectile);assert(g.misses==0);shotCount=shotCount+1;assert(shotCount<200)
  local ids,ammoNow={},{};for _,b in ipairs(g.bubbles) do ids[#ids+1]=b.id end;for _,n in ipairs(g.ammo) do ammoNow[#ammoNow+1]=n end
  parity[#parity+1]={level=level,shot=g.shots,angle=angle,score=g.score,stars=g.totalStars,power=g.power,rainbow=g.rainbowReady and 1 or 0,ids=ids,ammo=ammoNow};g.events={}
 end;assert(g.won);g=R.nextLevel(g)
end
assert(g.campaignComplete and g.totalStars==36);assert(R.nextLevel(g)==g)
local f=assert(io.open('tests/parity-actual.json','w'));f:write(json(parity));f:close()
assert(loadfile('roblox/ZeroRiot.client.lua'))
print('PASS Lua: all 12 levels, '..shotCount..' accurate shots, final win and client syntax.')
