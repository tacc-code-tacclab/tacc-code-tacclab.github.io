local R=dofile('roblox/Core.lua')
assert(loadfile('roblox/ZeroRiot.client.lua'))
local g=R.create('tap');local p=g.pickups[1];R.setTarget(g,p.x+20,p.y-13)
for i=1,200 do R.step(g,1/60) end
assert(g.x==p.x and g.y==p.y and g.collected==1 and g.target==nil)
local f=R.create('flip');R.collect(f,f.pickups[1]);R.flip(f)
while #f.pickups>0 do R.collect(f,f.pickups[1]) end
assert(f.won and f.charge~=0)
local calm=R.create('calm',2);for i=1,6001 do R.step(calm,.1) end
assert(not calm.ended and calm.spawned==0 and #calm.pickups==calm.total)
local trace={};g=R.create('cross-platform')
for level=1,5 do
 local steps=0
 while not g.ended and steps<15000 do
  steps=steps+1
  if not g.target and #g.pickups>0 then local q=g.pickups[1];R.setTarget(g,q.x,q.y) end
  R.step(g,1/60);g.events={}
 end
 assert(g.won,'Simple tap route failed on level '..level)
 table.insert(trace,string.format('{"level":%d,"time":%.15g,"totalTime":%.15g,"x":%.15g,"y":%.15g,"score":%d,"charge":%d,"lives":%d,"novas":%d,"collected":%d,"spawned":%d}',g.level,g.time,g.totalTime,g.x,g.y,g.score,g.charge,g.lives,g.novas,g.collected,g.spawned))
 if level<5 then local score=g.score;g=R.nextLevel(g);assert(g.score==score and g.lives==3) end
end
assert(g.campaignComplete and R.nextLevel(g)==g)
local out=assert(io.open('tests/parity-actual.json','w'));out:write('['..table.concat(trace,',')..']');out:close()
print('PASS Lua tap precision, permanent collection, safe flips, calm levels, five-level victory and client syntax.')
