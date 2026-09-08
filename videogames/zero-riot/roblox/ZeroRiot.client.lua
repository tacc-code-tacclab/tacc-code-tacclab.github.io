-- Bubble Riot v3. Standalone 2D GUI: local simulation, native glossy bubbles, no asset IDs.
local Players=game:GetService('Players')
local UIS=game:GetService('UserInputService')
local RunService=game:GetService('RunService')
local StarterGui=game:GetService('StarterGui')
local player=Players.LocalPlayer
local gui=script.Parent
local R=require(gui:WaitForChild('Core'))
gui.IgnoreGuiInset=true;gui.ResetOnSpawn=false;gui.DisplayOrder=100;gui.ZIndexBehavior=Enum.ZIndexBehavior.Sibling
local function rgb(r,g,b) return Color3.fromRGB(r,g,b) end
local C={bg=rgb(232,248,242),paper=rgb(255,253,244),ink=rgb(44,53,79),muted=rgb(103,114,141),purple=rgb(117,84,202),pink=rgb(235,133,173),gold=rgb(250,211,107),white=rgb(255,255,255),mint=rgb(117,220,197)}
local palette={
 {rgb(239,234,255),rgb(176,143,238),rgb(118,85,184)},
 {rgb(255,237,222),rgb(255,179,132),rgb(218,121,88)},
 {rgb(228,255,245),rgb(122,220,194),rgb(56,168,148)},
 {rgb(253,232,255),rgb(215,156,231),rgb(165,96,181)},
 {rgb(229,248,255),rgb(138,208,241),rgb(80,161,198)},
 {rgb(255,248,216),rgb(246,213,120),rgb(198,160,74)}
}
local function make(class,parent,props) local o=Instance.new(class);for k,v in pairs(props or {}) do o[k]=v end;o.Parent=parent;return o end
local function frame(parent,x,y,w,h,color,z) return make('Frame',parent,{Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundColor3=color or C.paper,BorderSizePixel=0,ZIndex=z or 1}) end
local function round(o,r) make('UICorner',o,{CornerRadius=UDim.new(0,r or 1000)}) end
local function outline(o,color,width) return make('UIStroke',o,{Color=color or C.white,Thickness=width or 2,ApplyStrokeMode=Enum.ApplyStrokeMode.Border}) end
local function gradient(o,a,b,c,rotation) return make('UIGradient',o,{Color=ColorSequence.new({ColorSequenceKeypoint.new(0,a),ColorSequenceKeypoint.new(.48,b),ColorSequenceKeypoint.new(1,c or b)}),Rotation=rotation or 75}) end
local function label(parent,text,x,y,w,h,size,color,z) return make('TextLabel',parent,{Text=text,Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundTransparency=1,TextColor3=color or C.ink,Font=Enum.Font.GothamBold,TextSize=size or 22,TextWrapped=true,ZIndex=z or 2}) end
local function button(parent,text,x,y,w,h,color,size) local o=make('TextButton',parent,{Text=text,Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundColor3=color or C.purple,TextColor3=C.white,BorderSizePixel=0,Font=Enum.Font.GothamBold,TextSize=size or 23,TextWrapped=true,AutoButtonColor=true,ZIndex=5});round(o,18);return o end
local function disc(parent,x,y,d,color,z) local o=frame(parent,x-d/2,y-d/2,d,d,color,z);round(o);return o end
local bg=frame(gui,0,0,1,1,C.bg);bg.Size=UDim2.fromScale(1,1);gradient(bg,rgb(215,250,239),C.bg,rgb(238,224,250),30)
local root=frame(gui,0,0,1120,1120,C.bg,2);root.BackgroundTransparency=1;root.AnchorPoint=Vector2.new(.5,.5);root.Position=UDim2.fromScale(.5,.5)
local scale=make('UIScale',root,{Scale=1})
local logo=disc(root,46,41,49,C.purple);gradient(logo,rgb(223,209,255),C.purple,rgb(94,67,163));label(logo,'B',0,0,49,49,31,C.white)
label(root,'BUBBLE RIOT',85,15,300,50,32,C.purple)
local strap=label(root,'AIM. ADD. POP!',397,20,250,40,15,C.muted)
local pauseButton=button(root,'Ⅱ PAUSE',928,23,165,41,rgb(222,222,239),15);pauseButton.TextColor3=C.purple
local hud=frame(root,20,83,720,65,C.paper);round(hud,20);outline(hud,C.white)
local captions={'GARDEN','MAKE','BUBBLES LEFT','SCORE'};local hudText={}
for i=1,4 do local x=(i-1)*180;label(hud,captions[i],x,5,180,18,12,C.muted);hudText[i]=label(hud,'0',x,22,180,39,i==2 and 36 or 27,i==2 and C.purple or C.ink) end
local board=frame(root,20,160,720,900,rgb(177,232,234));board.ClipsDescendants=true;round(board,26);outline(board,C.white,5);gradient(board,rgb(162,233,226),rgb(196,224,244),rgb(211,192,236),90)
-- Soft clouds, distant islands and flowering edges are drawn once, behind the arena.
local scenery=frame(board,0,0,720,900,C.white);scenery.BackgroundTransparency=1
for _,cloud in ipairs({{70,92,.7},{500,76,.9},{628,389,.65},{100,436,.6}}) do local x,y,s=cloud[1],cloud[2],cloud[3];for j=0,3 do local p=disc(scenery,x+j*38*s,y+(j%2)*11*s,(55+j%2*17)*s,C.white);p.BackgroundTransparency=.78 end end
local sun=disc(scenery,626,83,116,rgb(255,247,196));sun.BackgroundTransparency=.65
for side=0,1 do
 local x=side==0 and -62 or 575;local rock=frame(scenery,x,765,213,175,rgb(139,140,197));rock.Rotation=side==0 and 18 or -18;round(rock,62);gradient(rock,rgb(203,180,230),rgb(131,141,191),rgb(92,143,175),90)
 local grass=frame(scenery,x-12,736,232,53,rgb(81,190,164));round(grass,100);gradient(grass,rgb(169,238,169),rgb(90,204,172),rgb(50,171,163),90)
 local waterfall=frame(scenery,x+105,774,29,126,rgb(167,244,242));gradient(waterfall,rgb(236,255,253),rgb(164,241,244),rgb(148,209,233),90);waterfall.BackgroundTransparency=.2
 for j=1,7 do local lx=x+j*27;local leaf=frame(scenery,lx,701-(j%3)*11,20,58,rgb(81+j*8,187+j*5,167));leaf.Rotation=(j-4)*14;round(leaf,20)
  if j%2==0 then for p=0,4 do local a=p*math.pi*2/5;disc(scenery,lx+10+math.cos(a)*10,701-(j%3)*11+math.sin(a)*10,14,C.pink) end;disc(scenery,lx+10,701-(j%3)*11,11,C.gold) end
 end
end
local rail=frame(board,58,82,604,3,rgb(130,176,180),2);rail.BackgroundTransparency=.25
local nameLabel=label(board,'FIRST POPS',18,12,380,24,14,rgb(57,100,109),3);nameLabel.TextXAlignment=Enum.TextXAlignment.Left
label(board,'NO TIMER',545,12,156,24,13,rgb(57,100,109),3)
local items=frame(board,0,0,720,900,C.white,3);items.BackgroundTransparency=1
local fx=frame(board,0,0,720,900,C.white,6);fx.BackgroundTransparency=1
local aimDots={};for i=1,105 do local d=disc(items,0,0,6,C.white,1);d.Visible=false;aimDots[i]=d end
local aimRing=disc(items,0,0,77,C.white,4);aimRing.BackgroundTransparency=1;outline(aimRing,C.white,3)
local function bubble(parent,x,y,r,value,color,z)
 local p=palette[color%6+1];local o=disc(parent,x,y,r*2,C.white,z or 3);local grad=gradient(o,p[1],p[2],p[3],70);outline(o,C.white,2)
 local shine=frame(o,r*.34,r*.24,r*.7,r*.2,C.white,2);round(shine);shine.Rotation=-20;shine.BackgroundTransparency=.26
 local gleam=frame(o,r*.95,r*1.63,r*.55,r*.09,C.white,2);round(gleam);gleam.Rotation=-22;gleam.BackgroundTransparency=.56
 local t=label(o,tostring(value),0,1,r*2,r*2,r*.94,C.ink,3)
 return {view=o,text=t,gradient=grad,r=r}
end
local function moveBubble(v,x,y) v.view.Position=UDim2.fromOffset(x-v.r,y-v.r) end
local cannon=frame(items,304,746,112,130,C.white,4);cannon.BackgroundTransparency=1
local barrelPivot=frame(cannon,56,56,0,0,C.white,1);barrelPivot.BackgroundTransparency=1
local barrel=frame(barrelPivot,-23,-67,46,70,C.purple);round(barrel,10);gradient(barrel,rgb(184,155,231),C.purple,rgb(95,68,168),0)
local lip=frame(barrelPivot,-28,-67,56,19,rgb(217,199,252));round(lip,8)
disc(cannon,56,71,108,C.purple,2);local face=disc(cannon,56,67,90,rgb(191,164,237),3);gradient(face,rgb(231,214,255),rgb(191,164,237),rgb(158,121,207))
disc(face,29,46,8,C.ink,3);disc(face,60,46,8,C.ink,3);disc(face,18,58,12,rgb(239,177,215),3);disc(face,71,58,12,rgb(239,177,215),3);label(face,'⌣',27,44,35,30,25,rgb(108,75,135),3)
local loaded=bubble(items,360,785,24,2,1,5)
local projectile=bubble(items,360,802,17,2,1,5);projectile.view.Visible=false
local trails={};for i=1,4 do local d=disc(items,360,802,16-i*2,C.white,4);d.Visible=false;trails[i]=d end
local side=frame(root,775,181,310,780,C.paper);side.BackgroundTransparency=1
local sideTitle=label(side,'PICK YOUR\nMAGIC NUMBER.',0,0,310,90,31,C.purple)
local equationCard=frame(side,0,120,310,133,C.paper);round(equationCard,22);outline(equationCard,C.white)
local opLabel=label(equationCard,'ADDITION GARDEN',5,12,300,22,12,C.muted)
local equation=label(equationCard,'3 + 2 = ?',5,40,300,50,32,C.ink)
local equationHint=label(equationCard,'Make 5. Clear every bubble.',5,96,300,22,14,C.muted)
local ammoButtons={};local ammoOutlines={}
for i=1,3 do local b=button(side,'+2',(i-1)*106,280,92,92,C.white,30);round(b);local p=palette[i+1];gradient(b,p[1],p[2],p[3]);b.TextColor3=C.ink;ammoButtons[i]=b;ammoOutlines[i]=outline(b,C.white,3) end
local fireButton=button(side,'FIRE!  ↗',0,401,310,73,C.purple,31)
local powerBox=frame(side,0,510,310,129,C.paper);round(powerBox,20)
local powerLabel=label(powerBox,'RAINBOW RIOT  ·  0 / 3',8,10,294,25,15,C.purple)
local track=frame(powerBox,18,46,274,10,rgb(224,222,235));round(track,8)
local powerFill=frame(track,0,0,0,10,C.pink);round(powerFill,8);gradient(powerFill,C.mint,C.gold,C.pink,0)
local powerHelp=label(powerBox,'3 correct shots in a row unlock a rainbow blast. Any number. Bigger pops!',18,68,274,48,14,C.muted)
local hintButton=button(side,'✦ HELP ME AIM',0,663,310,52,rgb(225,221,243),17);hintButton.TextColor3=C.purple
local keysHelp=label(side,'POINT & CLICK or DRAG & RELEASE\n← → aim · SPACE fire · 1 2 3 choose\n\nSums first. Multiply from garden 7.',0,741,310,100,14,C.muted)
local bottomHelp=label(root,'CLEAR EVERY BUBBLE TO FINISH.  ·  12 GARDENS.  ·  UNLIMITED TRIES.',20,1076,1080,25,13,C.muted)
local toast=frame(board,40,613,640,70,C.paper,10);round(toast,21);outline(toast,C.white,2);toast.Visible=false
local toastText=label(toast,'',12,8,616,54,21,C.purple)
local modal=frame(board,0,0,720,900,C.paper,20);modal.BackgroundTransparency=.12
local card=frame(modal,56,86,608,728,C.paper);round(card,28);outline(card,C.white,3)
local intro=frame(card,0,0,608,728,C.paper);intro.BackgroundTransparency=1
label(intro,'12 GARDENS TO CLEAR',20,25,568,35,16,C.purple)
label(intro,'AIM. ADD.',20,82,568,75,58,C.ink)
label(intro,'POP!',20,149,568,105,93,C.pink)
bubble(intro,180,303,37,3,3);label(intro,'+',223,272,45,65,34,C.ink);bubble(intro,300,303,37,2,1);label(intro,'=',343,272,45,65,34,C.ink);bubble(intro,420,303,37,5,5)
label(intro,'Choose a shot. Hit a bubble to make the target number. Matching groups pop together!',40,370,528,83,23,C.ink)
label(intro,'Clear every bubble to finish. Unsupported bubbles fall for bonus points. No timer. Unlimited tries.',40,465,528,74,19,C.muted)
local startButton=button(intro,'LET’S POP!  →',45,566,518,66,C.purple,26)
label(intro,'GARDEN CODE',42,655,146,38,13,C.muted)
local seedBox=make('TextBox',intro,{Text=os.date('!%Y-%m-%d'),PlaceholderText='Garden code',ClearTextOnFocus=false,Position=UDim2.fromOffset(194,655),Size=UDim2.fromOffset(265,38),TextSize=18,TextColor3=C.ink,BackgroundColor3=rgb(237,234,244),BorderSizePixel=0,Font=Enum.Font.Code,ZIndex=5});round(seedBox,8)
local randomButton=button(intro,'↻',477,652,80,42,rgb(229,223,242),27);randomButton.TextColor3=C.purple
local paused=frame(card,0,0,608,728,C.paper);paused.BackgroundTransparency=1;paused.Visible=false
label(paused,'TAKE YOUR TIME',20,109,568,33,18,C.purple);label(paused,'LITTLE\nBREATHER?',30,180,548,156,58,C.purple)
local resumeButton=button(paused,'KEEP POPPING →',50,421,508,70,C.purple,25)
local restartButton=button(paused,'RESTART THIS GARDEN',50,516,508,57,rgb(229,223,242),20);restartButton.TextColor3=C.purple
local results=frame(card,0,0,608,728,C.paper);results.BackgroundTransparency=1;results.Visible=false
local resultTitle=label(results,'GARDEN CLEARED!',20,34,568,46,20,C.purple)
local stars=label(results,'★★★',20,88,568,104,76,C.gold)
local resultHeading=label(results,'POP PERFECTION!',20,205,568,66,40,C.purple)
local resultStats=label(results,'',45,289,518,100,23,C.ink)
local nextButton=button(results,'NEXT GARDEN →',50,421,508,70,C.purple,26)
local retryButton=button(results,'TRY FOR MORE STARS',50,515,508,55,rgb(229,223,242),19);retryButton.TextColor3=C.purple
local shareText=make('TextBox',results,{Text='',ClearTextOnFocus=false,TextEditable=false,TextWrapped=true,Position=UDim2.fromOffset(45,607),Size=UDim2.fromOffset(518,78),TextSize=17,TextColor3=C.muted,BackgroundTransparency=1,Font=Enum.Font.Code,ZIndex=5})
local mode='menu';local g=R.create(seedBox.Text);local clock=0;local endDelay=0;local toastTime=0;local recoil=0;local keys={};local pointer=nil;local mouseDown=false
local views={};local bumperViews={};local particles={};local rings={};local drops={};local floaters={}
local function clearInput() keys={};pointer=nil;mouseDown=false end
local function resize()
 local size=gui.AbsoluteSize;local portrait=size.X/size.Y<1.13;local w,h=portrait and 760 or 1120,portrait and 1350 or 1120;root.Size=UDim2.fromOffset(w,h);scale.Scale=math.min(size.X/w,size.Y/h)*.97
 pauseButton.Position=UDim2.fromOffset(portrait and 574 or 928,23);strap.Visible=not portrait;side.Position=UDim2.fromOffset(portrait and 20 or 775,portrait and 1085 or 181);side.Size=UDim2.fromOffset(portrait and 720 or 310,portrait and 240 or 850)
 sideTitle.Visible=not portrait;equationCard.Visible=not portrait;keysHelp.Visible=not portrait;powerHelp.Visible=not portrait;bottomHelp.Visible=not portrait
 for i,b in ipairs(ammoButtons) do b.Position=UDim2.fromOffset((i-1)*(portrait and 133 or 106),portrait and 0 or 280);b.Size=UDim2.fromOffset(portrait and 107 or 92,portrait and 107 or 92) end
 fireButton.Position=UDim2.fromOffset(portrait and 430 or 0,portrait and 10 or 401);fireButton.Size=UDim2.fromOffset(portrait and 290 or 310,portrait and 87 or 73)
 powerBox.Position=UDim2.fromOffset(0,portrait and 129 or 510);powerBox.Size=UDim2.fromOffset(portrait and 409 or 310,portrait and 79 or 129)
 powerLabel.Size=UDim2.fromOffset(portrait and 393 or 294,25);track.Size=UDim2.fromOffset(portrait and 373 or 274,10)
 hintButton.Position=UDim2.fromOffset(portrait and 430 or 0,portrait and 145 or 663);hintButton.Size=UDim2.fromOffset(portrait and 290 or 310,52)
end
gui:GetPropertyChangedSignal('AbsoluteSize'):Connect(resize);resize()
local function say(text,time) toastText.Text=text;toast.Visible=true;toastTime=time or 2.7 end
local function showPanel(which) modal.Visible=which~=nil;intro.Visible=which=='intro';paused.Visible=which=='paused';results.Visible=which=='results' end
local function wipe()
 for _,list in ipairs({particles,rings,drops,floaters}) do for _,e in ipairs(list) do e.view:Destroy() end end;particles={};rings={};drops={};floaters={}
 for id,v in pairs(views) do v.view:Destroy();views[id]=nil end;for _,v in ipairs(bumperViews) do v:Destroy() end;bumperViews={}
end
local function play(state) g=state;mode='play';endDelay=0;clearInput();wipe();showPanel(nil);say(g.level==7 and 'Now multiply! Make 12.' or ('Make '..g.config.target..'. Clear every bubble!')) end
local function start() local seed=seedBox.Text:sub(1,32):gsub('[^%w%-]','');if seed=='' then seed=os.date('!%Y-%m-%d') end;seedBox.Text=seed;play(R.create(seed)) end
local function togglePause() if mode=='play' and not g.ended then mode='paused';clearInput();showPanel('paused') elseif mode=='paused' then mode='play';showPanel(nil) end end
local function burst(x,y,color,n)
 for _=1,n do if #particles>=250 then break end;local a=math.random()*math.pi*2;local speed=75+math.random()*235;local view=label(fx,'✦',x,y,14,14,16,color,4);particles[#particles+1]={view=view,x=x,y=y,dx=math.cos(a)*speed,dy=math.sin(a)*speed-60,life=.5+math.random()*.45} end
end
local function ring(x,y,r,color) local v=disc(fx,x,y,r*2,C.white,2);v.BackgroundTransparency=1;local s=outline(v,color,4);rings[#rings+1]={view=v,stroke=s,x=x,y=y,r=r,life=.5} end
local function finish()
 mode='end';clearInput();showPanel('results');resultTitle.Text=g.campaignComplete and 'ALL 12 GARDENS CLEARED!' or ('GARDEN '..g.level..' CLEARED!');stars.Text=string.rep('★',g.stars)..string.rep('☆',3-g.stars)
 resultHeading.Text=g.campaignComplete and 'YOU’RE A POP STAR!' or (g.stars==3 and 'POP PERFECTION!' or 'BEAUTIFULLY POPPED!')
 resultStats.Text=g.score..' POINTS  ·  '..g.shots..' SHOTS\n'..g.totalStars..' STARS EARNED\nEvery bubble is gone!'
 nextButton.Text=g.campaignComplete and 'PLAY AGAIN →' or 'NEXT GARDEN →'
 shareText.Text='BUBBLE RIOT | '..g.score..' points | '..g.totalStars..' stars | '..g.level..'/12 gardens\nGarden code: '..g.seed
end
local function processEvents()
 for _,e in ipairs(g.events) do
  if e.type=='shoot' then recoil=1
  elseif e.type=='bounce' then ring(e.x,e.y,8,C.white)
  elseif e.type=='ready' then say('RAINBOW READY! Your next shot pops any number.')
  elseif e.type=='miss' then say(e.message,3.5)
  elseif e.type=='pop' then
   for _,b in ipairs(e.popped) do burst(b.x,b.y,palette[b.color+1][2],12);ring(b.x,b.y,32,palette[b.color+1][2]) end
   for _,b in ipairs(e.dropped) do local v=bubble(fx,b.x,b.y,32,b.v,b.color,3);drops[#drops+1]={view=v.view,bubble=v,x=b.x,y=b.y,dx=(math.random()-.5)*160,dy=40,life=1.8} end
   local f=label(fx,'+'..e.points,e.x-120,e.y-30,240,50,34,C.purple,5);floaters[#floaters+1]={view=f,x=e.x-120,y=e.y-30,life=1.3}
   say(e.message..(#e.dropped>0 and (' · '..#e.dropped..' bonus drops!') or (e.combo>1 and (' · Combo ×'..e.combo) or '')))
  elseif e.type=='end' then endDelay=1.2 end
 end;g.events={}
end
local function fire() if mode=='play' and R.shoot(g) then processEvents() end end
local function choose(index) if mode=='play' then R.select(g,index) end end
local function aimAt(position) local origin=board.AbsolutePosition;local size=board.AbsoluteSize;R.aim(g,(position.X-origin.X)*720/size.X,(position.Y-origin.Y)*900/size.Y) end
local function inside(position) local a,s=board.AbsolutePosition,board.AbsoluteSize;return position.X>=a.X and position.X<=a.X+s.X and position.Y>=a.Y and position.Y<=a.Y+s.Y end
-- One transparent input surface captures the entire board. Release outside cancels the shot.
local inputSurface=make('TextButton',board,{Text='',Size=UDim2.fromScale(1,1),BackgroundTransparency=1,AutoButtonColor=false,ZIndex=12})
inputSurface.InputBegan:Connect(function(input)
 if mode~='play' or g.projectile or g.ended then return end
 if input.UserInputType==Enum.UserInputType.Touch then pointer=input;aimAt(input.Position)
 elseif input.UserInputType==Enum.UserInputType.MouseButton1 then mouseDown=true;aimAt(input.Position) end
end)
UIS.InputChanged:Connect(function(input)
 if mode~='play' or g.projectile then return end
 if input==pointer then aimAt(input.Position) elseif input.UserInputType==Enum.UserInputType.MouseMovement and inside(input.Position) then aimAt(input.Position) end
end)
UIS.InputEnded:Connect(function(input)
 if input==pointer then pointer=nil;if inside(input.Position) then aimAt(input.Position);fire() end
 elseif input.UserInputType==Enum.UserInputType.MouseButton1 and mouseDown then mouseDown=false;if inside(input.Position) then aimAt(input.Position);fire() end end
 keys[input.KeyCode]=nil
end)
UIS.InputBegan:Connect(function(input,processed)
 if processed or UIS:GetFocusedTextBox() then return end
 if input.KeyCode==Enum.KeyCode.P then togglePause();return end
 keys[input.KeyCode]=true
 if input.KeyCode==Enum.KeyCode.Space then fire() elseif input.KeyCode==Enum.KeyCode.One then choose(0) elseif input.KeyCode==Enum.KeyCode.Two then choose(1) elseif input.KeyCode==Enum.KeyCode.Three then choose(2) end
end)
UIS.WindowFocusReleased:Connect(function() clearInput();if mode=='play' and not g.ended then togglePause() end end)
startButton.Activated:Connect(start);randomButton.Activated:Connect(function() seedBox.Text='G'..math.random(100000,999999) end)
pauseButton.Activated:Connect(togglePause);resumeButton.Activated:Connect(togglePause);restartButton.Activated:Connect(function() play(R.retryLevel(g)) end);retryButton.Activated:Connect(function() play(R.retryLevel(g)) end)
nextButton.Activated:Connect(function() play(g.campaignComplete and R.create(g.seed) or R.nextLevel(g)) end);fireButton.Activated:Connect(fire)
for i,b in ipairs(ammoButtons) do b.Activated:Connect(function() choose(i-1) end) end
hintButton.Activated:Connect(function()
 if mode~='play' or g.projectile or g.ended then return end
 for i=0,240 do local a=-1.16+i*2.32/240;local id=R.trace(g,a).hitId;local b=nil;for _,q in ipairs(g.bubbles) do if q.id==id then b=q;break end end
  if b then local n=R.required(g,b.v);for slot,value in ipairs(g.ammo) do if value==n then g.angle=a;R.select(g,slot-1);say(b.v..' '..g.config.op..' '..n..' = '..g.config.target..'. Press FIRE!',4);return end end end
 end;say('Try bouncing off the side wall.')
end)
local function updateViews()
 local alive={}
 for _,b in ipairs(g.bubbles) do alive[b.id]=true;if not views[b.id] then views[b.id]=bubble(items,b.x,b.y,32,b.v,b.color,3) end end
 for id,v in pairs(views) do if not alive[id] then v.view:Destroy();views[id]=nil end end
 if #bumperViews~=#g.bumpers then for _,v in ipairs(bumperViews) do v:Destroy() end;bumperViews={};for _,b in ipairs(g.bumpers) do local v=disc(items,b.x,b.y,b.r*2,C.white,3);gradient(v,rgb(255,253,239),rgb(239,220,253),rgb(168,133,211));outline(v,C.white,3);label(v,'✦',0,0,b.r*2,b.r*2,48,rgb(176,143,213),3);bumperViews[#bumperViews+1]=v end end
 local preview=R.trace(g);local hit=nil;for _,b in ipairs(g.bubbles) do if b.id==preview.hitId then hit=b;break end end
 local dots=0
 if mode=='play' and not g.projectile and not g.ended then local offset=clock*26%20
  for i=2,#preview.points do local a,b=preview.points[i-1],preview.points[i];local dx,dy=b.x-a.x,b.y-a.y;local len=math.sqrt(dx*dx+dy*dy);local t=offset
   while t<len and dots<#aimDots do dots=dots+1;local d=aimDots[dots];d.Position=UDim2.fromOffset(a.x+dx*t/len-3,a.y+dy*t/len-3);d.Visible=true;d.BackgroundColor3=g.rainbowReady and C.pink or C.white;t=t+20 end;offset=(offset-len)%20
  end
 end
 for i=dots+1,#aimDots do aimDots[i].Visible=false end
 aimRing.Visible=hit~=nil and mode=='play' and not g.projectile and not g.ended;if hit then aimRing.Position=UDim2.fromOffset(hit.x-38.5,hit.y-38.5) end
 barrelPivot.Rotation=g.angle*180/math.pi;cannon.Position=UDim2.fromOffset(304,746+recoil*7)
 loaded.view.Visible=not g.projectile and not g.ended;loaded.text.Text=g.rainbowReady and '★' or tostring(g.ammo[g.selected+1]);loaded.view.Rotation=g.rainbowReady and math.sin(clock*5)*12 or 0
 projectile.view.Visible=g.projectile~=nil
 for _,d in ipairs(trails) do d.Visible=g.projectile~=nil end
 if g.projectile then local p=g.projectile;moveBubble(projectile,p.x,p.y);projectile.text.Text=p.rainbow and '★' or tostring(p.value);for i,d in ipairs(trails) do d.Position=UDim2.fromOffset(p.x-p.dx*i*10-5,p.y-p.dy*i*10-5);d.BackgroundColor3=p.rainbow and palette[i][2] or C.white end end
 hudText[1].Text=g.level..' / 12';hudText[2].Text=tostring(g.config.target);hudText[3].Text=tostring(#g.bubbles);hudText[4].Text=tostring(g.score);nameLabel.Text=g.config.name
 opLabel.Text=g.config.op=='+' and 'ADDITION GARDEN' or 'MULTIPLICATION GARDEN'
 equation.Text=g.rainbowReady and 'ANY NUMBER!' or ((hit and tostring(hit.v) or '?')..' '..g.config.op..' '..g.ammo[g.selected+1]..' = ?')
 equationHint.Text='Make '..g.config.target..'. Clear every bubble.'
 for i,b in ipairs(ammoButtons) do b.Text=g.config.op..g.ammo[i];ammoOutlines[i].Color=g.selected==i-1 and C.purple or C.white;ammoOutlines[i].Thickness=g.selected==i-1 and 5 or 2 end
 fireButton.Text=g.rainbowReady and 'RAINBOW! ✦' or 'FIRE! ↗';fireButton.BackgroundTransparency=(mode~='play' or g.projectile or g.cooldown>0 or g.ended) and .4 or 0
 powerLabel.Text=g.rainbowReady and 'RAINBOW RIOT · READY!' or ('RAINBOW RIOT · '..g.power..' / 3');powerFill.Size=UDim2.new(g.rainbowReady and 1 or g.power/3,0,1,0)
end
RunService.PreRender:Connect(function(delta)
 local dt=math.min(.04,math.max(0,delta))
 if mode~='paused' then
  clock=clock+dt;recoil=math.max(0,recoil-dt*6)
  if mode=='play' then if not g.projectile then local a=(keys[Enum.KeyCode.Right] and 1 or 0)-(keys[Enum.KeyCode.Left] and 1 or 0);g.angle=math.max(-1.16,math.min(1.16,g.angle+a*dt*1.05)) end;R.step(g,dt);if #g.events>0 then processEvents() end;if endDelay>0 then endDelay=endDelay-dt;if endDelay<=0 then finish() end end end
  for i=#particles,1,-1 do local p=particles[i];p.x=p.x+p.dx*dt;p.y=p.y+p.dy*dt;p.dy=p.dy+300*dt;p.life=p.life-dt;if p.life<=0 then p.view:Destroy();table.remove(particles,i) else p.view.Position=UDim2.fromOffset(p.x,p.y);p.view.TextTransparency=math.max(0,1-p.life);p.view.Rotation=p.life*170 end end
  for i=#rings,1,-1 do local p=rings[i];p.r=p.r+90*dt;p.life=p.life-dt;if p.life<=0 then p.view:Destroy();table.remove(rings,i) else p.view.Position=UDim2.fromOffset(p.x-p.r,p.y-p.r);p.view.Size=UDim2.fromOffset(p.r*2,p.r*2);p.stroke.Transparency=1-p.life*2 end end
  for i=#drops,1,-1 do local p=drops[i];p.x=p.x+p.dx*dt;p.y=p.y+p.dy*dt;p.dy=p.dy+800*dt;p.life=p.life-dt;if p.life<=0 or p.y>980 then p.view:Destroy();table.remove(drops,i) else moveBubble(p.bubble,p.x,p.y);p.view.Rotation=p.dx*p.life*.15 end end
  for i=#floaters,1,-1 do local p=floaters[i];p.y=p.y-46*dt;p.life=p.life-dt;if p.life<=0 then p.view:Destroy();table.remove(floaters,i) else p.view.Position=UDim2.fromOffset(p.x,p.y);p.view.TextTransparency=math.max(0,1-p.life) end end
  if toastTime>0 then toastTime=toastTime-dt;if toastTime<=0 then toast.Visible=false end end
 end
 updateViews()
end)
updateViews()
-- Disable platform avatar controls asynchronously; the START button is immediately usable.
task.spawn(function()
 pcall(function() StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.All,false) end)
 pcall(function() local scripts=player:WaitForChild('PlayerScripts',5);local module=scripts and scripts:WaitForChild('PlayerModule',5);if module then require(module):GetControls():Disable() end end)
 local function hide(character) for _,o in ipairs(character:GetDescendants()) do if o:IsA('BasePart') then o.LocalTransparencyModifier=1 elseif o:IsA('Decal') then o.Transparency=1 end end end
 if player.Character then hide(player.Character) end;player.CharacterAdded:Connect(hide)
end)
