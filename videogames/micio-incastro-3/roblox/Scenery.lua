-- Original asset-free vector scenery. Only the current destination exists in the GUI.
-- Shapes are created once per destination, never rebuilt in the animation loop.
local Art={}
local function rgb(r,g,b) return Color3.fromRGB(r,g,b) end
local function new(kind,parent,props) local o=Instance.new(kind);for k,v in pairs(props) do o[k]=v end;o.Parent=parent;return o end
local palettes={
 {rgb(40,56,84),rgb(229,137,103),rgb(30,98,114)}, {rgb(63,49,106),rgb(225,136,155),rgb(52,87,126)},
 {rgb(28,92,131),rgb(235,168,119),rgb(37,124,129)}, {rgb(54,71,113),rgb(209,135,153),rgb(41,70,99)},
 {rgb(70,48,104),rgb(230,159,118),rgb(49,108,118)}, {rgb(29,74,101),rgb(160,165,116),rgb(27,83,82)},
 {rgb(59,50,108),rgb(220,158,180),rgb(34,91,103)}, {rgb(61,41,113),rgb(237,159,93),rgb(45,104,111)},
 {rgb(42,53,101),rgb(205,105,142),rgb(30,64,114)}, {rgb(31,72,110),rgb(226,135,142),rgb(31,89,113)},
 {rgb(27,83,111),rgb(231,169,102),rgb(25,115,127)}, {rgb(36,86,121),rgb(233,152,107),rgb(28,126,126)},
 {rgb(37,66,101),rgb(170,199,197),rgb(33,124,142)}, {rgb(89,55,105),rgb(235,168,111),rgb(118,79,76)},
 {rgb(60,57,90),rgb(237,155,92),rgb(108,103,69)}, {rgb(40,66,121),rgb(216,143,166),rgb(30,103,134)},
 {rgb(25,60,87),rgb(153,191,171),rgb(26,101,118)}, {rgb(22,37,91),rgb(108,134,186),rgb(73,130,160)}
}
function Art.create(parent,index)
 local old=parent:FindFirstChild('Destination');if old then old:Destroy() end
 local p=palettes[(index-1)%#palettes+1]
 local root=new('Frame',parent,{Name='Destination',Size=UDim2.fromScale(1,1),BorderSizePixel=0,BackgroundColor3=p[1],ClipsDescendants=true})
 new('UIGradient',root,{Rotation=90,Color=ColorSequence.new({ColorSequenceKeypoint.new(0,p[1]),ColorSequenceKeypoint.new(.61,p[2]),ColorSequenceKeypoint.new(1,p[3])})})
 local function box(x,y,w,h,c,rot,radius,trans)
  local o=new('Frame',root,{Position=UDim2.fromScale(x,y),Size=UDim2.fromScale(w,h),BackgroundColor3=c,BorderSizePixel=0,Rotation=rot or 0,BackgroundTransparency=trans or 0})
  if radius then new('UICorner',o,{CornerRadius=UDim.new(radius,0)}) end;return o
 end
 local function oval(x,y,w,h,c,trans) return box(x-w/2,y-h/2,w,h,c,0,.5,trans) end
 local cream=rgb(255,215,150);local ink=rgb(24,45,68);local rock=rgb(67,83,106);local green=rgb(28,78,79)
 local function beam(x,y,w,h,c,rot) return box(x,y,w,h,c,rot,.08) end
 local function tower(x,y,w,h,c,spire)
  box(x,y,w,h,c);box(x-.008,y,w+.016,.013,cream)
  if spire then beam(x+w*.46,y-h*.28,w*.08,h*.3,c);oval(x+w*.5,y-h*.27,w*.2,.014,cream) end
  for col=0,2 do for row=0,3 do box(x+w*(.15+col*.28),y+h*(.1+row*.21),w*.12,h*.09,cream,0,.15,.1+((row+col)%3)*.19) end end
 end
 local function hill(x,y,w,h,c) return oval(x,y,w,h,c) end
 local function tree(x,y,s,c)
  beam(x,y-.15*s,.012*s,.22*s,ink,-5)
  for i=0,3 do oval(x+(i-1.5)*.023*s,y-.16*s-(i%2)*.025*s,.09*s,.066*s,c or green) end
 end
 local function bridge(y)
  box(-.03,y,1.06,.039,cream,-3,.05)
  for j=0,6 do box(j*.18-.015,y+.025,.037,.16,rock);oval(j*.18+.073,y+.12,.15,.13,p[3]) end
  box(-.03,y-.008,1.06,.012,ink,-3)
 end
 local function mountain(x,y,w,h,c)
  -- Overlapping rotated rounded blocks form a faceted mountain silhouette.
  box(x-w*.32,y-h*.47,w*.64,h*.72,c,45,.05);box(x-w*.43,y-h*.05,w*.86,h*.48,c,0,.1)
 end
 local function pagoda(x,y,s,c)
  for j=0,3 do local w=(.2-j*.035)*s;box(x-w*.29,y-j*.058*s,w*.58,.057*s,c);beam(x-w/2,y-j*.058*s-.013*s,w,.018*s,cream,0);beam(x-w*.55,y-j*.058*s-.01*s,w*.32,.014*s,ink,-12);beam(x+w*.23,y-j*.058*s-.01*s,w*.32,.014*s,ink,12) end
  beam(x-.004*s,y-.27*s,.008*s,.087*s,cream)
 end
 -- The sky and water span the playfield instead of framing a smaller board.
 oval(.74,.19,.17,.13,cream,.26)
 for i=1,7 do local x=(i*.19)%1;oval(x,.09+(i%3)*.065,.19,.027,rgb(255,218,205),.8) end
 box(0,.68,1,.32,p[3])
 for i=1,22 do box((i*.137)%1,.69+(i%9)*.034,.04+(i%4)*.022,.0025,cream,0,.5,.6+(i%3)*.08) end
 if index==1 then
  for i=0,3 do tower(i*.096-.04,.39-i*.014,.084,.31+i*.014,rgb(137+i*15,93+i*9,102),i==3);tower(.7+i*.092,.34+i*.025,.088,.36-i*.025,rgb(117+i*16,92+i*11,104),i==0) end
  bridge(.65);box(.2,.84,.19,.014,ink,-9,.5);beam(.3,.77,.006,.092,ink,22)
 elseif index==2 then
  for i=0,3 do tower(i*.1,.48-i*.016,.08,.22+i*.016,rock,false) end
  beam(.62,.34,.018,.36,cream,19);beam(.74,.34,.018,.36,cream,-19);beam(.68,.22,.009,.18,cream);beam(.6,.58,.18,.015,cream);beam(.648,.45,.084,.014,cream);bridge(.74)
 elseif index==3 then
  for i=0,5 do tower(.13+i*.116,.51-(i%3)*.056,.087,.22+(i%3)*.056,rgb(126+i*14,106+i*7,130),true) end
  for i=1,24 do box((i*.097)%1,.81+(i%4)*.021,.06,.023,palettes[(i%18)+1][2],i%2==0 and 8 or -8,.2) end
 elseif index==4 then
  tower(.12,.33,.095,.4,rgb(135,111,117),true);oval(.167,.385,.056,.05,cream);beam(.165,.37,.003,.017,ink);beam(.165,.386,.015,.003,ink)
  tower(.62,.47,.085,.24,rock,true);tower(.85,.47,.085,.24,rock,true);bridge(.7);beam(.66,.55,.23,.012,cream)
 elseif index==5 then
  box(.28,.53,.45,.16,rgb(203,182,191));oval(.505,.512,.29,.16,rgb(227,201,202));box(.36,.59,.29,.1,rgb(203,182,191));oval(.505,.635,.10,.12,p[1]);box(.32,.69,.37,.013,cream)
  for _,x in ipairs({.2,.76}) do tower(x,.41,.032,.29,cream,true) end
  beam(.5,.368,.007,.08,cream);box(.4,.73,.2,.27,rgb(68,143,156));tree(.1,.82,1.2);tree(.9,.81,1.1)
 elseif index==6 then
  for i=0,5 do mountain(i*.24,.66,.4,.3+(i%3)*.13,i%2==0 and green or rock) end
  for i=0,12 do local y=.69-i*.027+math.sin(i)*.03;box(i*.075,y,.10,.022,cream,-15);box(i*.075,y-.02,.013,.024,rock) end
  tower(.71,.35,.08,.15,rock,false)
 elseif index==7 then
  mountain(.7,.58,.42,.34,rock);pagoda(.36,.7,1.2,rgb(122,57,79));tree(.07,.6,1.8,rgb(185,115,160));tree(.9,.7,1.6,rgb(212,143,176))
  for i=1,15 do oval((i*.173)%1,.27+(i%8)*.067,.009,.006,cream,.24) end
 elseif index==8 then
  for i=0,3 do pagoda(.2+i*.21,.7,1-(i%2)*.15,rgb(175,122,76)) end;bridge(.78)
 elseif index==9 or index==10 then
  for i=0,10 do local h=.12+((i*7)%6)*.045;tower(i*.098-.03,.7-h,.078,h,rgb(39+i*4,55+i*3,92),i==6 or i==3) end
  if index==9 then bridge(.8);beam(.1,.64,.013,.17,cream);beam(.062,.64,.084,.009,cream) else oval(.49,.84,.22,.07,rgb(168,190,206));box(.15,.9,.7,.012,cream) end
 elseif index==11 then
  for i=0,4 do tower(i*.13-.02,.55-(i%2)*.035,.105,.18+(i%2)*.035,rgb(176+i*9,118+i*12,127),false) end
  for i=0,4 do tower(.62+i*.083,.36+(i%2)*.11,.062,.35-(i%2)*.11,rock,false) end;tree(.16,.84,1.5);tree(.92,.8,1.2)
 elseif index==12 then
  mountain(.28,.64,.5,.38,green);hill(.83,.57,.37,.42,rock);box(0,.79,.75,.038,cream,-9,.4)
  beam(.265,.37,.014,.1,cream);beam(.225,.385,.09,.012,cream);tree(.92,.88,1.5);tree(.04,.89,1.1)
 elseif index==13 or index==17 or index==18 then
  for i=0,4 do mountain(i*.27,.65,.36,.3+(i%3)*.1,index==17 and green or rgb(92+i*9,125+i*8,151));if index~=17 then mountain(i*.27,.50,.15,.13,cream) end end
  if index==17 then for i=0,4 do tree(i*.24,.83,1.2) end
  elseif index==18 then for i=0,3 do oval(.13+i*.23,.83,.044,.075,ink);oval(.13+i*.23,.842,.026,.047,cream) end
  else box(.02,.78,.25,.13,rgb(160,207,219),-10,.18);box(.74,.81,.19,.10,rgb(182,219,225),9,.1) end
 elseif index==14 then
  box(0,.68,1,.32,rgb(134,91,93));mountain(.32,.68,.42,.33,rgb(188,140,113));mountain(.75,.67,.33,.26,rgb(164,116,110));hill(.31,.95,.9,.31,rgb(157,105,103));tree(.91,.75,.85)
 elseif index==15 then
  mountain(.55,.61,.48,.33,rock);mountain(.55,.43,.15,.11,cream);box(0,.70,1,.3,rgb(106,93,69));tree(.15,.61,2.3);tree(.79,.74,1.45)
  for _,x in ipairs({.35,.62}) do oval(x,.8,.075,.057,ink);beam(x-.018,.81,.008,.058,ink);beam(x+.02,.81,.008,.058,ink);oval(x+.039,.79,.033,.043,ink);beam(x+.048,.79,.011,.045,ink,15) end
 elseif index==16 then
  bridge(.69);for i=0,3 do box(.33+i*.09,.69-(i%2)*.024,.11,.1,cream,-35+i*7,.2) end;box(.24,.79,.55,.026,rock)
 end
 -- A constant dark scrim keeps falling kittens and gold targets readable everywhere.
 box(0,0,1,1,rgb(5,15,27),0,nil,.38)
 return root
end
return Art
