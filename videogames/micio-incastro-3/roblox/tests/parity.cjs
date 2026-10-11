// Generate assertions against the shipped web engine, including identical random draws.
const Core=require('../../engine.js');
const lua=x=>x===null?'nil':typeof x==='string'?JSON.stringify(x):Array.isArray(x)?'{'+x.map(lua).join(',')+'}':typeof x==='object'?'{'+Object.entries(x).map(([k,v])=>'['+lua(k)+']='+lua(v)).join(',')+'}':String(x);
let seed=24680;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const g=new Core.Game(random);
function snapshot(){return JSON.stringify({stage:g.stage,score:g.score,coins:g.coins,weapon:g.weapon,progress:g.progress,charge:g.charge,saved:g.saved,moves:g.moves,over:g.over,end:g.endReason||'',board:g.board.flat().map(c=>c===null?-1:c),active:g.cells().map(c=>[c.x,c.y,c.color]),mosquito:g.mosquito?[g.mosquito.hp,g.mosquito.cooldown,g.mosquito.drops,g.mosquito.placements]:[]});}
// Snapshot is compared as a Lua table, avoiding JSON libraries inside Roblox.
const out=[`local Core=dofile('Core.lua')\nlocal seed=24680\nlocal function random() seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296 end\nlocal g=Core.new(random)\nlocal function equal(a,b,path) assert(type(a)==type(b),path..' type mismatch');if type(a)=='table' then for k,v in pairs(a) do equal(v,b[k],path..'.'..tostring(k)) end;for k in pairs(b) do assert(a[k]~=nil,path..' missing key') end else assert(a==b,path..': '..tostring(a)..' != '..tostring(b)) end end\nlocal function check(expected,n)\n local cells,board={},{};for _,p in ipairs(g:cells()) do cells[#cells+1]={p.x,p.y,p.color} end;for y=0,11 do for x=0,8 do local c=g.board[y][x];board[#board+1]=c==false and -1 or c end end\n local m=g.mosquito;equal({stage=g.stage,score=g.score,coins=g.coins,weapon=g.weapon,progress=g:progress(),charge=g.charge,saved=g.saved,moves=g.moves,over=g.over,['end']=g.endReason or '',board=board,active=cells,mosquito=m and {m.hp,m.cooldown,m.drops,m.placements} or {}},expected,'step '..n)\nend`];
const actions=[['move',[-1]],['turn',[]],['move',[1]],['drop',[]],['advance',[360]],['shootMosquito',[]],['swap',[]],['step',[]],['drop',[]],['appearMosquito',[]],['advance',[4200]],['purr',[]],['drop',[]]];
for(let i=0;i<650;i++){
 let [method,args]=actions[(i*7+Math.floor(i/11))%actions.length];
 if(g.over){method=g.won?'nextStage':'retryStage';args=[];}
 if(i%103===0){method='reset';args=[i%206===0?'chill':'flow'];}
 g[method](...args);out.push(`g:${method}(${args.map(lua).join(',')});check(${lua(JSON.parse(snapshot()))},${i})`);
}
out.push("print('Parity: 650 action states match the existing JavaScript game exactly.')");process.stdout.write(out.join('\n'));
