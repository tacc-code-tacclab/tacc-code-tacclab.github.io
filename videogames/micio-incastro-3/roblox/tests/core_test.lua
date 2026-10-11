local Core=dofile('Core.lua')
local Layout=dofile('Layout.lua')
local function seeded(seed) return function() seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296 end end
local g=Core.new(seeded(123))
assert(#Core.MISSIONS==36 and #Core.WORLDS==18)
local last=0
for i,m in ipairs(Core.MISSIONS) do
 assert(#m.targets>=last);last=#m.targets;assert(m.world==math.floor((i-1)/2));local seen={}
 for _,p in ipairs(m.targets) do assert(p.x>=0 and p.x<9 and p.y>=4 and p.y<12);assert(not seen[p.y*9+p.x]);seen[p.y*9+p.x]=true end
end
-- Every board spans the available width and all vertices stay above touch controls.
for _,size in ipairs({{320,524},{390,760},{430,858},{768,980},{844,342},{1440,860},{1920,1040}}) do
 local l=Layout.compute(size[1],size[2]);assert(l.boardW/size[1]>.965)
 for y=0,11 do for x=0,8 do local xx,yy=Layout.cell(l,x,y);assert(xx-l.cellW/2>=-.01 and xx+l.cellW/2<=l.w+.01);assert(yy-l.cellH/2>=l.top-.01 and yy+l.cellH/2<=l.h-l.bottom+.01) end end
 for _,b in ipairs(Layout.buttons(l)) do assert(b.w>=44 and b.h>=44 and b.x+b.w<=l.w and b.y+b.h<=l.h) end
end
-- A high score and every exterior target still cannot cover one missing cell.
g:addScore(20000);g:checkGoal();assert(not g.over)
for i,p in ipairs(g:targets()) do if i~=5 then g.stamps[p.y*9+p.x]=0 end end
g:checkGoal();assert(not g.over and g:progress()==g:goal()-1)
local p=g:targets()[5];g.stamps[p.y*9+p.x]=0;g:checkGoal();assert(g:won() and g.coins==202)
assert(g:buy('dart'));assert(not g:buy('dart'));assert(g.weapon=='dart' and g.coins==196)
assert(g:nextStage());assert(g.stage==1 and g:progress()==0 and g.weapon=='dart');assert(not g:buy('laser'))
-- Retry restores the checkpoint instead of farming score or credits.
g:addScore(300);g:finish('full');assert(g:retryStage());assert(g.coins==196 and g.score==20200)
g:appearMosquito();assert(g.mosquito.hp==4);assert(g:shootMosquito());assert(g.mosquito.hp==2);assert(not g:shootMosquito());g:advance(300);assert(g:shootMosquito() and not g.mosquito)
assert(g.coins==197 and g.charge==1)
-- Blocks cannot overwrite current pieces or existing kittens and never enter spawn rows.
g=Core.new(seeded(84));g:reset('chill');g:appearMosquito();local occupied={};for _,c in ipairs(g:cells()) do occupied[c.y*9+c.x]=true end
for _=1,3 do for _,c in ipairs(g:dropClutter()) do assert(c.y>=4 and not occupied[c.y*9+c.x]);assert(g.board[c.y][c.x]==4) end end
assert(not g.mosquito);g:clearClutter();for y=0,11 do for x=0,8 do assert(g.board[y][x]~=4) end end
-- Six adjacent cats clear, while footprint progress survives.
g=Core.new(seeded(5));for x=1,6 do g.board[11][x]=1 end;local result=g:resolve();assert(#result.clears>0 and g.saved>=6)
assert(g:progress()>=1);local progress=g:progress();g:resolve();assert(g:progress()==progress)
-- Fall/timer, safe pause contract (client never calls advance while paused), terminal state.
g=Core.new(seeded(9));g:advance(g:duration());assert(g.endReason=='time');assert(not g:move(1));assert(g:retryStage())
g:reset('chill');g:advance(900000);assert(not g.over and g.elapsed==0)
-- All 36 stage transitions and the final campaign ending.
for stage=0,35 do
 assert(g.stage==stage);for _,c in ipairs(g:targets()) do g.stamps[c.y*9+c.x]=0 end;g:checkGoal();assert(g:won())
 if stage<35 then assert(g:nextStage()) else assert(g:campaignWon() and not g:nextStage()) end
end
print('Core: 36 missions, full silhouettes, credit economy, weapons, retries, mosquito, clearing, timer and 7 responsive viewports passed.')
