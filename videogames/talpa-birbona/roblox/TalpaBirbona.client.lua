-- Talpa Birbona: self-contained 2D game. No remote events, external images or asset IDs.
local Players=game:GetService("Players")
local UIS=game:GetService("UserInputService")
local RunService=game:GetService("RunService")
local StarterGui=game:GetService("StarterGui")
local GuiService=game:GetService("GuiService")
local player=Players.LocalPlayer
local gui=script.Parent
local Core=require(gui:WaitForChild("Core"))
gui.IgnoreGuiInset=true; gui.ResetOnSpawn=false; gui.DisplayOrder=100
gui.ZIndexBehavior=Enum.ZIndexBehavior.Sibling
pcall(function() StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.All,false) end)
local function hideCharacter(character)
    for _,part in ipairs(character:GetDescendants()) do
        if part:IsA("BasePart") then part.LocalTransparencyModifier=1 end
    end
    local humanoid=character:FindFirstChildOfClass("Humanoid")
    if humanoid then humanoid.WalkSpeed=0; humanoid.JumpPower=0; humanoid.AutoRotate=false end
end
if player.Character then hideCharacter(player.Character) end
player.CharacterAdded:Connect(hideCharacter)
task.defer(function()
    local scripts=player:FindFirstChild("PlayerScripts")
    local module=scripts and scripts:FindFirstChild("PlayerModule")
    if module then pcall(function() require(module):GetControls():Disable() end) end
end)
local C={ink=Color3.fromRGB(48,71,55),cream=Color3.fromRGB(255,249,233),orange=Color3.fromRGB(250,105,70),
    soil=Color3.fromRGB(185,125,78),dark=Color3.fromRGB(82,61,51),purple=Color3.fromRGB(173,108,232),white=Color3.fromRGB(255,253,240)}
local function rgb(r,g,b) return Color3.fromRGB(r,g,b) end
local function make(class,parent,props)
    local object=Instance.new(class); for k,v in pairs(props or {}) do object[k]=v end; object.Parent=parent; return object
end
local function frame(parent,x,y,w,h,color,z,radius)
    local f=make("Frame",parent,{Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundColor3=color or C.white,BackgroundTransparency=color and 0 or 1,BorderSizePixel=0,ZIndex=z or 1})
    if radius then make("UICorner",f,{CornerRadius=UDim.new(0,radius)}) end; return f
end
local function stroke(f,color,width) make("UIStroke",f,{Color=color,Thickness=width or 2,ApplyStrokeMode=Enum.ApplyStrokeMode.Border}) end
local function gradient(f,a,b,rotation) make("UIGradient",f,{Color=ColorSequence.new(a,b),Rotation=rotation or 90}) end
local function oval(parent,x,y,w,h,color,z,rotation,edge)
    local f=frame(parent,x,y,w,h,color,z,999); f.Rotation=rotation or 0; if edge then stroke(f,edge,2) end; return f
end
local function label(parent,text,x,y,w,h,size,color,z,font)
    return make("TextLabel",parent,{Text=text,Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundTransparency=1,TextColor3=color or C.ink,TextSize=size or 18,Font=font or Enum.Font.FredokaOne,TextWrapped=true,ZIndex=z or 1})
end
local function line(parent,x1,y1,x2,y2,color,width,z)
    local dx,dy=x2-x1,y2-y1; local length=math.sqrt(dx*dx+dy*dy)
    local f=frame(parent,(x1+x2)/2-length/2,(y1+y2)/2-(width or 3)/2,length,width or 3,color,z,3)
    f.Rotation=math.deg(math.atan2(dy,dx)); return f
end
local function button(parent,text,x,y,w,h,color,z)
    local b=make("TextButton",parent,{Text=text,Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundColor3=color or C.orange,TextColor3=C.white,TextSize=20,Font=Enum.Font.FredokaOne,BorderSizePixel=0,AutoButtonColor=true,ZIndex=z or 1})
    make("UICorner",b,{CornerRadius=UDim.new(0,14)}); return b
end
local function clamp(v,a,b) return math.max(a,math.min(b,v)) end
local W,H,CELL,GX,GY=1100,750,36,46,210
local function px(x) return GX+x*CELL end
local function py(y) return GY+y*CELL end
local background=frame(gui,0,0,1,1,C.cream); background.Size=UDim2.fromScale(1,1)
gradient(background,C.cream,rgb(224,235,201))
local root=frame(gui,0,0,1100,945,nil,2); root.AnchorPoint=Vector2.new(.5,.5); root.Position=UDim2.fromScale(.5,.5)
local scale=make("UIScale",root,{Scale=1})
label(root,"TALPA BIRBONA",20,4,600,60,46,C.orange,2).TextXAlignment=Enum.TextXAlignment.Left
label(root,"UN ORTO. MILLE GUAI.",720,21,355,30,16,C.ink,2)
local hud=frame(root,0,71,1100,61,C.white,3,16)
local levelLabel=label(hud,"ORTO 01 / 10",20,7,190,45,24,C.ink)
local plantsLabel=label(hud,"PIANTE 0 / 4",229,5,224,46,24,C.ink)
local progressBg=frame(hud,239,49,204,5,rgb(232,235,213),2,4)
local progress=frame(progressBg,0,0,0,5,rgb(130,180,83),2,4)
local scoreLabel=label(hud,"0 PUNTI",480,6,225,47,26,C.ink)
local healthLabel=label(hud,"♥ ♥ ♥",751,6,207,47,31,rgb(244,125,117))
local pauseButton=button(hud,"II",1022,11,50,40,rgb(133,160,101),3)
local board=frame(root,0,141,W,H,rgb(186,230,236),2,14); board.ClipsDescendants=true; board.Active=true
local sky=frame(board,0,0,W,GY,rgb(186,230,236),1); gradient(sky,rgb(170,224,237),rgb(239,245,198))
oval(board,80,20,63,63,rgb(255,236,168),2); oval(board,88,28,47,47,rgb(255,219,115),3)
local clouds={}
for _,v in ipairs({{280,35},{624,21},{929,51}}) do
    local c=frame(board,v[1],v[2],110,50,nil,2); oval(c,0,17,110,29,C.white); oval(c,21,1,48,40,C.white); oval(c,52,9,41,36,C.white); table.insert(clouds,{f=c,x=v[1]})
end
oval(board,-100,111,575,160,rgb(155,188,128),2); oval(board,350,93,570,202,rgb(155,188,128),2)
oval(board,792,124,450,142,rgb(171,199,132),2); oval(board,97,143,640,126,rgb(180,207,137),3)
local house=frame(board,895,101,72,52,rgb(249,214,159),4,3)
frame(board,897,84,67,22,rgb(205,124,86),5,7); frame(house,29,25,17,28,rgb(153,116,79),2,4)
frame(house,8,15,12,14,rgb(201,157,94),2,2); frame(house,52,15,12,14,rgb(201,157,94),2,2)
for _,x in ipairs({858,984}) do frame(board,x,112,6,43,rgb(139,136,81),4); oval(board,x-9,74,25,64,rgb(106,143,90),5) end
for x=10,W,37 do frame(board,x,155,6,49,rgb(224,215,165),5,3) end
frame(board,0,169,W,5,rgb(224,215,165),5); frame(board,0,188,W,5,rgb(224,215,165),5)
frame(board,0,195,W,17,rgb(125,167,77),6); frame(board,0,194,W,6,rgb(174,205,99),7)
local soil=frame(board,0,GY,W,H-GY,C.soil,7)
gradient(soil,C.soil,rgb(126,78,59))
for i=1,270 do
    local x=(i*127+31)%W; local y=GY+10+(i*83)%520
    local dot=oval(board,x,y,2+i%5,2+i%3,i%2==0 and rgb(230,174,115) or rgb(124,80,58),8); dot.BackgroundTransparency=.64
end
for x=10,W,43 do line(board,x,204,x+4,191,rgb(118,159,74),3,9); line(board,x+4,191,x+8,203,rgb(118,159,74),3,9) end
local function makeMole(parent,flip)
    local g=frame(parent,0,0,100,100,nil,30)
    local dark=rgb(94,61,46); local fur=rgb(136,91,63); local pink=rgb(243,163,152)
    local function b(x,y,w,h,c,z,rot,edge) return oval(g,flip and 100-x-w or x,y,w,h,c,z,flip and -(rot or 0) or rot,edge) end
    b(8,45,25,15,pink,1,-22,dark); b(21,29,58,60,fur,3,-7,dark)
    b(36,41,31,42,rgb(224,191,139),4,-10); b(53,12,23,24,fur,3,0,dark); b(59,17,13,15,pink,4)
    b(50,22,37,42,fur,5,-10,dark); b(72,39,24,18,pink,8,0,dark); b(83,41,10,7,rgb(255,193,183),9)
    b(69,31,12,15,C.white,6); b(75,33,6,10,rgb(45,43,35),7); b(77,34,3,4,C.white,8)
    b(65,23,13,4,dark,7,-13); b(75,57,12,4,dark,7,0); b(77,56,4,5,C.white,8)
    b(39,77,25,12,pink,7,7,dark); b(26,58,24,13,pink,7,-26,dark)
    for i=0,2 do b(27+i*5,68-i*2,3,7,rgb(255,229,193),8,-25); b(45+i*5,83,3,6,rgb(255,229,193),8) end
    b(45,54,29,9,rgb(224,79,58),8,-21); b(39,59,16,19,rgb(240,90,63),7,27)
    b(30,32,19,7,rgb(167,117,74),4,-25)
    return g
end
local function leaf(parent,x,y,w,h,angle,color,z)
    local f=oval(parent,x,y,w,h,color or rgb(108,174,69),z or 5,angle or 0)
    local vein=frame(f,w/2-1,5,2,h-10,rgb(70,127,58),2,2); vein.BackgroundTransparency=.25; return f
end
local cropColors={rgb(255,146,63),rgb(239,199,136),rgb(164,223,105),rgb(233,232,88),rgb(255,103,108),rgb(255,183,77),rgb(255,224,135),rgb(255,105,97),rgb(149,210,86),rgb(193,151,245)}
local function plantArt(parent,kind)
    local g=frame(parent,0,0,100,130,nil,12); local dark=rgb(74,94,44)
    if kind==1 then
        leaf(g,36,16,13,52,-26); leaf(g,53,8,14,61,14); leaf(g,66,23,13,38,37)
        oval(g,28,65,39,53,rgb(239,120,44),7,21,rgb(169,90,40)); oval(g,36,91,22,36,rgb(247,141,49),8,25)
        for i=0,2 do line(g,38-i*3,80+i*13,52-i*3,82+i*13,rgb(185,87,40),2,9) end
        oval(g,39,68,7,23,rgb(255,178,72),9,25)
    elseif kind==2 then
        leaf(g,46,22,17,55,8); leaf(g,19,47,37,18,-30); leaf(g,55,49,32,18,26)
        oval(g,9,83,53,36,rgb(199,158,93),7,-18,rgb(138,106,57)); oval(g,43,73,42,47,rgb(224,185,112),8,16,rgb(138,106,57))
        for _,p in ipairs({{23,96},{35,106},{56,91},{70,109},{59,111}}) do oval(g,p[1],p[2],4,3,rgb(162,123,66),9) end
    elseif kind==3 then
        for _,v in ipairs({{9,84,-38},{44,82,32},{23,66,-19},{38,65,20}}) do leaf(g,v[1],v[2],43,41,v[3],rgb(108,161,63),5) end
        oval(g,22,60,57,60,rgb(154,193,81),6,0,dark); leaf(g,36,67,31,49,18,rgb(185,216,108),7)
        line(g,31,85,48,110,rgb(217,236,155),2,8); line(g,69,79,59,104,rgb(217,236,155),2,8)
    elseif kind>=4 and kind<=6 then
        local trunk=frame(g,45,61,13,66,rgb(137,91,56),4,4); gradient(trunk,rgb(166,117,68),rgb(120,80,51),0)
        line(g,51,88,30,61,rgb(139,94,58),7,4); line(g,52,75,73,49,rgb(139,94,58),7,4)
        for _,v in ipairs({{8,25,53,51},{39,13,49,53},{36,42,59,43},{3,54,50,41}}) do oval(g,v[1],v[2],v[3],v[4],rgb(99,162,64),5,0,dark) end
        oval(g,20,26,35,32,rgb(136,189,78),6); oval(g,53,22,24,27,rgb(136,189,78),6)
        for _,p in ipairs({{22,45},{58,38},{70,65},{38,76},{13,72}}) do
            line(g,p[1]+6,p[2]-2,p[1]+8,p[2]+4,rgb(111,82,44),3,8)
            if kind==4 then oval(g,p[1]+3,p[2],10,14,cropColors[kind],8); oval(g,p[1],p[2]+7,16,15,cropColors[kind],8)
            else oval(g,p[1],p[2],17,18,cropColors[kind],8) end
            oval(g,p[1]+3,p[2]+5,4,5,rgb(255,231,161),9)
        end
    elseif kind==7 then
        for j=0,3 do
            local x=25+j*16; local top=30+(j%2)*13; line(g,50,126,x,top,rgb(211,165,65),3,5)
            for i=0,4 do oval(g,x-9,top+i*9,11,18,rgb(244,197,79),6,-28); oval(g,x+1,top+i*9,11,18,rgb(255,215,104),6,28) end
        end
    elseif kind==8 then
        line(g,49,127,48,39,rgb(83,143,56),6,5)
        for _,v in ipairs({{22,45,-40},{52,51,35},{15,76,-40},{59,77,34}}) do leaf(g,v[1],v[2],29,16,v[3],nil,5) end
        for _,p in ipairs({{27,70},{62,60},{55,100}}) do
            oval(g,p[1]-12,p[2],29,29,rgb(230,82,54),7,0,rgb(166,65,43)); oval(g,p[1]-6,p[2]+4,8,7,rgb(255,159,105),8)
            leaf(g,p[1]-9,p[2]-3,16,6,-23,rgb(70,134,57),8); leaf(g,p[1]+2,p[2]-2,11,6,28,rgb(70,134,57),8)
        end
    elseif kind==9 then
        leaf(g,11,62,46,34,-24); leaf(g,43,49,47,34,26); leaf(g,32,30,30,45,4)
        oval(g,16,100,63,23,rgb(73,123,52),7,-10,dark); oval(g,31,83,58,23,rgb(99,153,60),8,22,dark)
        line(g,25,110,66,104,rgb(174,195,93),2,9); line(g,40,88,77,104,rgb(169,191,91),2,9)
        for i=0,4 do oval(g,17+math.cos(i*1.26)*9,83+math.sin(i*1.26)*9,14,14,rgb(254,205,75),10) end
        oval(g,23,89,10,10,rgb(226,145,44),11)
    else
        line(g,49,116,49,49,rgb(89,144,54),5,5); leaf(g,18,41,38,26,-28); leaf(g,51,51,32,22,23)
        oval(g,24,77,27,47,rgb(107,72,152),7,19,rgb(76,51,105)); oval(g,52,73,29,45,rgb(139,91,179),8,-15,rgb(76,51,105))
        oval(g,33,83,6,24,rgb(184,142,216),9,19); oval(g,59,79,6,23,rgb(203,161,230),9,-15)
        leaf(g,29,73,24,13,17,rgb(92,150,62),10); leaf(g,50,68,25,13,-14,rgb(92,150,62),10)
    end
    return g
end
local farmer=frame(board,0,95,100,112,nil,22)
oval(farmer,26,94,26,12,rgb(104,77,50),2); oval(farmer,53,94,25,12,rgb(104,77,50),2)
frame(farmer,31,69,39,31,rgb(90,132,69),3,9); oval(farmer,23,43,53,40,rgb(192,79,59),4,0,rgb(118,75,46))
for i=0,2 do line(farmer,29+i*17,49,29+i*17,74,rgb(244,162,128),2,5); line(farmer,26,52+i*10,72,52+i*10,rgb(244,162,128),2,5) end
frame(farmer,38,50,6,32,rgb(90,132,69),6,2); frame(farmer,60,50,6,32,rgb(90,132,69),6,2)
oval(farmer,29,15,43,37,rgb(239,183,128),7,0,rgb(126,82,50)); oval(farmer,39,8,43,15,rgb(230,189,109),9)
oval(farmer,32,1,35,24,rgb(240,203,125),8); oval(farmer,18,19,67,10,rgb(221,178,95),10)
oval(farmer,49,29,4,6,rgb(67,62,42),9); oval(farmer,64,29,4,6,rgb(67,62,42),9)
oval(farmer,54,33,10,8,rgb(224,153,107),10); oval(farmer,47,40,21,5,rgb(116,82,49),9)
oval(farmer,64,63,28,12,rgb(239,183,128),8,-20)
local can=frame(farmer,76,66,24,24,C.purple,9,7); stroke(can,rgb(109,66,147),2)
oval(farmer,78,61,17,9,C.purple,8); line(farmer,94,70,103,63,C.purple,8,10)
label(can,"!",4,2,16,20,17,C.white,10)
local warning=frame(board,0,60,195,34,rgb(115,67,163),35,12); local warningText=label(warning,"VELENO TRA 3...",0,0,195,34,18,C.white,2); warning.Visible=false
local stream=line(board,0,0,0,36,rgb(206,167,246),7,24); stream.Visible=false
local holeRing=oval(board,0,GY-9,55,18,nil,25); stroke(holeRing,rgb(218,175,255),4); holeRing.Visible=false
local moleRight=makeMole(board,false); local moleLeft=makeMole(board,true)
moleRight.Name="TalpaRight"; moleLeft.Name="TalpaLeft"
for _,m in ipairs({moleRight,moleLeft}) do make("UIScale",m,{Scale=.75}) end
local tunnelCells,poisonCells,holeFrames,plants={},{},{},{}
for r=0,Core.ROWS-1 do for c=0,Core.COLS-1 do
    local k=r*Core.COLS+c+1
    local f=frame(board,px(c+.5)-19,py(r+.5)-19,38,38,C.dark,10,13); stroke(f,rgb(128,84,60),2); f.Visible=false; tunnelCells[k]=f
    local p=frame(board,px(c+.5)-17,py(r+.5)-17,34,34,C.purple,14,10); p.Visible=false
    oval(p,7,5,10,8,rgb(221,185,252),2); oval(p,21,21,5,5,rgb(234,201,255),2); poisonCells[k]=p
end end
for c=0,Core.COLS-1 do
    local g=frame(board,px(c+.5)-25,GY-7,50,18,nil,19); oval(g,0,7,50,11,rgb(189,140,87)); oval(g,9,1,33,12,C.dark,2); g.Visible=false; holeFrames[c+1]=g
end
local targetRing=oval(board,0,0,24,24,nil,28); stroke(targetRing,rgb(244,206,125),2); targetRing.Visible=false
local tip=label(root,"Mangia tutte le radici. Il contadino ti avvisa prima di versare il veleno!",15,895,850,40,15,rgb(108,127,82),2)
tip.TextXAlignment=Enum.TextXAlignment.Left
local helpButton=button(root,"COME SI GIOCA?",884,897,206,35,rgb(130,154,96),3); helpButton.TextSize=15
local touchPanel=frame(root,0,940,1100,165,nil,4)
label(touchPanel,"TOCCA LA TERRA PER ANDARE LÌ\nOPPURE TIENI PREMUTE LE FRECCE",30,38,545,87,21,C.ink,2)
local pad=frame(touchPanel,756,0,290,160,nil,2)
local dpadButtons={
    {b=button(pad,"▲",95,0,76,70,rgb(142,172,98)),x=0,y=-1},
    {b=button(pad,"◀",11,79,76,70,rgb(142,172,98)),x=-1,y=0},
    {b=button(pad,"▼",95,79,76,70,rgb(142,172,98)),x=0,y=1},
    {b=button(pad,"▶",179,79,76,70,rgb(142,172,98)),x=1,y=0}
}
local curtain=frame(board,0,0,W,H,rgb(31,49,33),90); curtain.BackgroundTransparency=.45; curtain.Active=true
local panel=frame(curtain,288,121,524,510,C.cream,2,28); stroke(panel,C.white,4)
local mascot=makeMole(panel,false); mascot.Position=UDim2.fromOffset(193,-85); make("UIScale",mascot,{Scale=1.36})
local kicker=label(panel,"PICCOLA TALPA, GRANDE APPETITO",27,65,470,25,14,rgb(144,119,77),4)
local title=label(panel,"DAI, SCAVA!",20,91,484,65,44,C.ink,4)
local description=label(panel,"Mangia le radici di TUTTE le piante per completare l'orto. Il morso è automatico!",35,159,454,91,23,C.ink,4,Enum.Font.Gotham)
local rules=label(panel,"01   FRECCE / WASD O TOCCA LA TERRA\n02   RAGGIUNGI LE RADICI COLORATE\n03   VELENO VIOLA? SCAVA UNA VIA NUOVA!",32,256,460,101,17,rgb(111,129,80),4,Enum.Font.GothamBold)
local playButton=button(panel,"INIZIA A SCAVARE  →",37,372,450,63,C.orange,4)
local restartButton=button(panel,"Ricomincia dall'orto 1",105,447,314,31,rgb(137,158,99),4); restartButton.TextSize=16; restartButton.Visible=false
local note=label(panel,"10 orti · 3 cuori per orto · nessun conto alla rovescia",24,475,476,25,13,rgb(148,148,113),4,Enum.Font.Gotham)
local toast=frame(board,175,12,750,44,C.cream,80,17); local toastLabel=label(toast,"",10,0,730,44,20,C.ink,2); toast.Visible=false
local g=Core.new(); local mode="menu"; local held={}; local touchDirs={}; local target=nil; local touchTargetInput=nil
local visualTime=0; local toastUntil=0; local biteUntil=0; local popups={}; local best=0
local rebuildPlants,render,begin,showPanel,clearInput
rebuildPlants=function()
    for _,p in ipairs(plants) do p.art:Destroy(); p.roots:Destroy(); p.stump:Destroy() end; plants={}
    for _,p in ipairs(g.plants) do
        local x,y=px(p.x),py(p.y); local art=plantArt(board,p.kind); art.Position=UDim2.fromOffset(x-50,GY-128)
        local roots=frame(board,0,0,W,H,nil,17)
        line(roots,x,GY+2,x+4,GY+25,rgb(245,205,150),5)
        line(roots,x+4,GY+25,x,y,rgb(245,205,150),5)
        for j=0,3 do local ry=GY+24+(y-GY-30)*j/4; local side=j%2==0 and -1 or 1
            line(roots,x,ry,x+side*12,ry+12,rgb(230,183,130),3); line(roots,x+side*12,ry+12,x+side*17,ry+24,rgb(230,183,130),2)
        end
        local targetNode=oval(roots,x-13,y-13,26,26,cropColors[p.kind],2); stroke(targetNode,rgb(255,220,159),2)
        oval(roots,x-6,y-7,7,7,C.white,3).BackgroundTransparency=.35
        local pts=frame(roots,x-23,y+23,46,22,rgb(108,65,50),1,9); label(pts,tostring(Core.CROPS[p.kind].points),0,0,46,22,14,rgb(255,228,187),2)
        local stump=label(board,"✓",x-17,GY-39,34,34,25,rgb(249,234,164),19); stump.Visible=false
        table.insert(plants,{art=art,roots=roots,stump=stump})
    end
end
clearInput=function() held={}; touchDirs={}; target=nil; touchTargetInput=nil; g.player.moving=false end
local function message(text,duration) toastLabel.Text=text; toast.Visible=true; toastUntil=visualTime+(duration or 3) end
showPanel=function(k,t,body,action,detail)
    clearInput(); kicker.Text=k; title.Text=t; description.Text=body; playButton.Text=action; note.Text=detail
    rules.Visible=false; description.Position=UDim2.fromOffset(35,158); description.Size=UDim2.fromOffset(454,185)
    curtain.Visible=true; restartButton.Visible=mode~="menu"; pauseButton.Visible=false
end
begin=function()
    clearInput(); mode="playing"; curtain.Visible=false; pauseButton.Visible=true
    message(g.level==1 and "Raggiungi le radici colorate: il morso è automatico!" or ("Orto "..g.level..": il contadino è più veloce!"),4)
end
local function pause(help)
    if mode~="playing" then return end; mode=help and "help" or "paused"
    showPanel(help and "BASTA MUOVERSI. AL MORSO PENSA LEI." or "NESSUNA FRETTA",help and "COME SI GIOCA?" or "PAUSA MERENDA",
        help and "Frecce / WASD, levetta sinistra, oppure tocca un punto sotto terra. Raggiungi tutte le radici colorate. Il veleno viola segue i cunicoli: scava nella terra intatta per scappare. Hai 3 cuori." or "La talpa si riposa e il contadino aspetta. Riprendi quando vuoi.",
        "TORNA A SCAVARE", "Obiettivo: tutte le piante. Il gioco finisce dopo l'orto 10.")
end
local function summary()
    mode="summary"; best=math.max(best,g.score)
    if g.status=="lost" then showPanel("IL CONTADINO TI HA BECCATA","OPS, CHE GUAIO!","Hai finito i cuori. Scava una via nuova nella terra marrone per evitare il viola. Il veleno si dissolve dopo pochi secondi.","RIPROVA QUESTO ORTO","Riparti dall'orto "..g.level..". Record di questa sessione: "..best)
    elseif g.status=="complete" then showPanel("TUTTI E DIECI GLI ORTI COMPLETATI","SEI UNA BIRBONA!","Hai mangiato tutte le piante e completato il gioco. Il contadino si prende una pausa!","GIOCA DI NUOVO",g.score.." punti · Record di questa sessione: "..best)
    else showPanel("ORTO "..g.level.." COMPLETATO","SGRANOCCHIATO!","Tutte le piante sono state mangiate! Nel prossimo orto il contadino sarà più veloce. Lascia sempre una via di fuga.","VAI ALL'ORTO "..(g.level+1).." →","+"..g.bonus.." punti per i cuori rimasti · Totale "..g.score) end
end
playButton.Activated:Connect(function()
    if mode=="menu" then g:start(1,0); rebuildPlants()
    elseif mode=="summary" then if g.status=="won" then g:next() elseif g.status=="lost" then g:retry() else g:start(1,0) end; rebuildPlants() end
    begin()
end)
restartButton.Activated:Connect(function() g:start(1,0); rebuildPlants(); begin() end)
pauseButton.Activated:Connect(function() pause(false) end)
helpButton.Activated:Connect(function() if mode=="playing" then pause(true) end end)
local keyMap={
    [Enum.KeyCode.Left]={-1,0},[Enum.KeyCode.A]={-1,0},[Enum.KeyCode.DPadLeft]={-1,0},
    [Enum.KeyCode.Right]={1,0},[Enum.KeyCode.D]={1,0},[Enum.KeyCode.DPadRight]={1,0},
    [Enum.KeyCode.Up]={0,-1},[Enum.KeyCode.W]={0,-1},[Enum.KeyCode.DPadUp]={0,-1},
    [Enum.KeyCode.Down]={0,1},[Enum.KeyCode.S]={0,1},[Enum.KeyCode.DPadDown]={0,1}
}
local stick=Vector2.new(0,0)
UIS.InputBegan:Connect(function(input,processed)
    if input.KeyCode==Enum.KeyCode.Space or input.KeyCode==Enum.KeyCode.P or input.KeyCode==Enum.KeyCode.ButtonStart then
        if mode=="playing" then pause(false) elseif mode=="paused" or mode=="help" then begin() end; return
    end
    if not processed and keyMap[input.KeyCode] and mode=="playing" then held[input.KeyCode]=true; target=nil end
end)
UIS.InputEnded:Connect(function(input)
    held[input.KeyCode]=nil; touchDirs[input]=nil
    if input==touchTargetInput then touchTargetInput=nil end
end)
UIS.WindowFocusReleased:Connect(function() clearInput(); stick=Vector2.new(0,0); pause(false) end)
GuiService.MenuOpened:Connect(function() clearInput(); stick=Vector2.new(0,0); pause(false) end)
local function setTarget(input)
    local pos=board.AbsolutePosition; local size=board.AbsoluteSize
    local bx=(input.Position.X-pos.X)*W/size.X; local by=(input.Position.Y-pos.Y)*H/size.Y
    if by<GY then return end
    target={x=clamp((bx-GX)/CELL,.5,Core.COLS-.5),y=clamp((by-GY)/CELL,.5,Core.ROWS-.5)}
end
board.InputBegan:Connect(function(input)
    if mode~="playing" then return end
    if input.UserInputType==Enum.UserInputType.Touch or input.UserInputType==Enum.UserInputType.MouseButton1 then touchTargetInput=input; setTarget(input) end
end)
UIS.InputChanged:Connect(function(input)
    if input.KeyCode==Enum.KeyCode.Thumbstick1 then stick=Vector2.new(input.Position.X,-input.Position.Y); if stick.Magnitude>.12 then target=nil end end
    if mode=="playing" and touchTargetInput then
        if input==touchTargetInput or (input.UserInputType==Enum.UserInputType.MouseMovement and touchTargetInput.UserInputType==Enum.UserInputType.MouseButton1) then setTarget(input) end
    end
end)
for _,entry in ipairs(dpadButtons) do
    entry.b.InputBegan:Connect(function(input)
        if mode=="playing" and (input.UserInputType==Enum.UserInputType.Touch or input.UserInputType==Enum.UserInputType.MouseButton1) then target=nil; touchDirs[input]={entry.x,entry.y} end
    end)
end
local function fit()
    local camera=workspace.CurrentCamera; if not camera then return end
    local viewport=camera.ViewportSize; local wide=viewport.X>viewport.Y*1.4; local rw,rh=1100,945
    touchPanel.Visible=UIS.TouchEnabled
    if UIS.TouchEnabled then
        if wide then rw=1420; touchPanel.Position=UDim2.fromOffset(1100,370); touchPanel.Size=UDim2.fromOffset(310,530); pad.Position=UDim2.fromOffset(0,310); touchPanel:FindFirstChildOfClass("TextLabel").Position=UDim2.fromOffset(15,110); touchPanel:FindFirstChildOfClass("TextLabel").Size=UDim2.fromOffset(275,150)
        else rh=1125; touchPanel.Position=UDim2.fromOffset(0,940); touchPanel.Size=UDim2.fromOffset(1100,165); pad.Position=UDim2.fromOffset(756,0); touchPanel:FindFirstChildOfClass("TextLabel").Position=UDim2.fromOffset(30,38); touchPanel:FindFirstChildOfClass("TextLabel").Size=UDim2.fromOffset(545,87) end
    end
    root.Size=UDim2.fromOffset(rw,rh); scale.Scale=math.max(.1,math.min((viewport.X-16)/rw,(viewport.Y-48)/rh))
    root.Position=UDim2.new(.5,0,.5,17)
    camera.CameraType=Enum.CameraType.Scriptable; camera.CFrame=CFrame.new(0,30,0)*CFrame.Angles(-math.pi/2,0,0)
end
local resizeTimer=0
rebuildPlants(); pauseButton.Visible=false; fit()
RunService.RenderStepped:Connect(function(delta)
    local dt=math.min(delta,.06); visualTime=visualTime+dt; resizeTimer=resizeTimer+dt
    if resizeTimer>.5 then fit(); resizeTimer=0 end
    if mode=="playing" then
        local dx,dy=0,0
        for key in pairs(held) do local d=keyMap[key]; dx=dx+d[1]; dy=dy+d[2] end
        for _,d in pairs(touchDirs) do dx=dx+d[1]; dy=dy+d[2] end
        if stick.Magnitude>.12 then dx=dx+stick.X; dy=dy+stick.Y end
        if target and dx==0 and dy==0 then
            dx=target.x-g.player.x; dy=target.y-g.player.y; local dist=math.sqrt(dx*dx+dy*dy)
            if dist<.04 then target=nil; dx=0; dy=0 else local strength=math.min(1,dist/(Core.SPEED*math.max(dt,.001))); dx=dx/dist*strength; dy=dy/dist*strength end
        end
        g:update(dt,dx,dy)
        for _,event in ipairs(g:takeEvents()) do
            if event.type=="eat" then
                biteUntil=visualTime+.25
                local pop=label(board,"+"..event.points,px(event.x)-55,py(event.y)-48,110,42,26,rgb(255,239,160),40)
                table.insert(popups,{f=pop,y=py(event.y)-48,t=visualTime})
                if g.remaining==1 then message("Ne resta una sola. Dai, che ci sei!") end
            elseif event.type=="warning" then message("Occhio al contadino! Il veleno segue i cunicoli.")
            elseif event.type=="hurt" then message("Ahi! Scava nella terra marrone per uscire dal veleno.")
            elseif event.type=="win" or event.type=="lose" then summary() end
        end
    end
    levelLabel.Text=string.format("ORTO %02d / 10",g.level); plantsLabel.Text="PIANTE "..(g.total-g.remaining).." / "..g.total
    scoreLabel.Text=g.score.." PUNTI"; healthLabel.Text=string.rep("♥ ",g.health)..string.rep("♡ ",3-g.health)
    progress.Size=UDim2.fromOffset(204*(1-g.remaining/g.total),5)
    for i,f in ipairs(tunnelCells) do f.Visible=g.dug[i] end
    for i,f in ipairs(poisonCells) do f.Visible=g.poison[i]>0; if f.Visible then f.BackgroundTransparency=1-math.min(.85,g.poison[i]/2) end end
    for _,f in ipairs(holeFrames) do f.Visible=false end
    for _,c in ipairs(g.holes) do holeFrames[c+1].Visible=true end
    for i,p in ipairs(plants) do
        local eaten=g.plants[i].eaten; p.art.Visible=not eaten; p.roots.Visible=not eaten; p.stump.Visible=eaten
        p.art.Rotation=math.sin(visualTime*1.8+i)*1.2
    end
    for i,c in ipairs(clouds) do c.f.Position=UDim2.fromOffset(c.x+math.sin(visualTime*.07+i)*16,c.f.Position.Y.Offset) end
    local f=g.farmer; local fx=px(f.x)
    farmer.Position=UDim2.fromOffset(fx-50,96+(f.mode=="walking" and math.sin(visualTime*14)*2 or 0))
    warning.Visible=f.mode=="warning" or f.mode=="pouring"; holeRing.Visible=warning.Visible; stream.Visible=f.mode=="pouring"
    if warning.Visible then
        warning.Position=UDim2.fromOffset(clamp(px(f.target+.5)-97,4,W-199),56)
        warningText.Text=f.mode=="warning" and ("VELENO TRA "..math.max(1,math.ceil(f.clock)).."...") or "SCAPPA DAL VIOLA!"
        holeRing.Position=UDim2.fromOffset(px(f.target+.5)-27,GY-9); stream.Position=UDim2.fromOffset(fx+5,GY-24); stream.Rotation=38
    end
    local p=g.player; local bounce=p.moving and math.sin(visualTime*24)*1.5 or 0
    local visible=g.invulnerable==0 or math.floor(visualTime*12)%2==0
    moleRight.Visible=p.facing>0 and visible; moleLeft.Visible=p.facing<0 and visible
    for _,m in ipairs({moleRight,moleLeft}) do m.Position=UDim2.fromOffset(px(p.x)-37.5,py(p.y)-37.5+bounce); m.Rotation=visualTime<biteUntil and math.sin(visualTime*30)*3 or 0 end
    targetRing.Visible=target~=nil and mode=="playing"; if targetRing.Visible then targetRing.Position=UDim2.fromOffset(px(target.x)-12,py(target.y)-12) end
    for i=#popups,1,-1 do local pop=popups[i]; local age=visualTime-pop.t
        if age>1.25 then pop.f:Destroy(); table.remove(popups,i) else pop.f.Position=UDim2.fromOffset(pop.f.Position.X.Offset,pop.y-age*36); pop.f.TextTransparency=age/1.25 end
    end
    if visualTime>toastUntil then toast.Visible=false end
end)
