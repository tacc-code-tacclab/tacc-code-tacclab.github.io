-- ZERO RIOT v1: self-contained 2D arcade. No RemoteEvents, external assets or data APIs.
local Players=game:GetService("Players")
local UIS=game:GetService("UserInputService")
local RunService=game:GetService("RunService")
local StarterGui=game:GetService("StarterGui")
local player=Players.LocalPlayer
local gui=script.Parent
local R=require(gui:WaitForChild("Core"))
gui.IgnoreGuiInset=true;gui.ResetOnSpawn=false;gui.DisplayOrder=100;gui.ZIndexBehavior=Enum.ZIndexBehavior.Sibling
local function rgb(r,g,b) return Color3.fromRGB(r,g,b) end
local C={bg=rgb(9,13,35),panel=rgb(13,21,46),line=rgb(42,56,88),ink=rgb(244,245,255),muted=rgb(165,175,204),cyan=rgb(95,245,231),pink=rgb(255,115,200),yellow=rgb(227,255,117),red=rgb(255,121,114)}
local function make(class,parent,props)
 local o=Instance.new(class)
 for k,v in pairs(props or {}) do o[k]=v end
 o.Parent=parent;return o
end
local function frame(parent,x,y,w,h,color,z)
 return make("Frame",parent,{Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundColor3=color or C.panel,BorderSizePixel=0,ZIndex=z or 1})
end
local function round(o,r) make("UICorner",o,{CornerRadius=UDim.new(0,r)}) end
local function stroke(o,color,width) return make("UIStroke",o,{Color=color,Thickness=width or 1,ApplyStrokeMode=Enum.ApplyStrokeMode.Border}) end
local function label(parent,text,x,y,w,h,size,color,align,z)
 return make("TextLabel",parent,{Text=text,Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundTransparency=1,BorderSizePixel=0,TextColor3=color or C.ink,Font=Enum.Font.GothamBold,TextSize=size or 20,TextXAlignment=align or Enum.TextXAlignment.Center,TextYAlignment=Enum.TextYAlignment.Center,TextWrapped=true,ZIndex=z or 2})
end
local function button(parent,text,x,y,w,h,color,textColor,size)
 local o=make("TextButton",parent,{Text=text,Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundColor3=color or C.yellow,TextColor3=textColor or C.bg,BorderSizePixel=0,Font=Enum.Font.GothamBold,TextSize=size or 20,TextWrapped=true,AutoButtonColor=true,ZIndex=5})
 round(o,9);return o
end
local bg=frame(gui,0,0,1,1,C.bg);bg.Size=UDim2.fromScale(1,1)
local root=frame(gui,0,0,1080,910,C.bg,2);root.AnchorPoint=Vector2.new(.5,.5);root.Position=UDim2.fromScale(.5,.5)
local scale=make("UIScale",root,{Scale=1})
local title=label(root,"ZERO",20,13,92,42,32,C.ink,Enum.TextXAlignment.Left)
label(root,"RIOT",117,13,92,42,32,C.yellow,Enum.TextXAlignment.Left)
local subtitle=label(root,"MAKE NOTHING. DESTROY EVERYTHING.",234,13,580,42,14,C.muted,Enum.TextXAlignment.Left)
local pauseButton=button(root,"PAUSE",940,17,115,36,C.panel,C.muted,14)
local scoreCaption=label(root,"SCORE",25,75,160,22,13,C.muted,Enum.TextXAlignment.Left)
local scoreLabel=label(root,"0",25,96,165,34,30,C.ink,Enum.TextXAlignment.Left)
label(root,"YOUR CHARGE",228,75,180,22,13,C.muted,Enum.TextXAlignment.Left)
local chargeLabel=label(root,"0",225,97,150,34,37,C.yellow,Enum.TextXAlignment.Left)
label(root,"TIME",440,75,100,22,13,C.muted,Enum.TextXAlignment.Left)
local timeLabel=label(root,"90s",440,96,110,34,30,C.ink,Enum.TextXAlignment.Left)
label(root,"SHIELDS",590,75,120,22,13,C.muted,Enum.TextXAlignment.Left)
local shieldsLabel=label(root,"●●●",590,96,130,34,26,C.yellow,Enum.TextXAlignment.Left)
local board=frame(root,20,145,720,720,C.panel);board.ClipsDescendants=true;round(board,12);stroke(board,C.line,2)
local gradient=make("UIGradient",board,{Color=ColorSequence.new({ColorSequenceKeypoint.new(0,rgb(24,38,70)),ColorSequenceKeypoint.new(1,rgb(10,16,40))}),Rotation=50})
for i=0,720,40 do local a=frame(board,i,0,1,720,C.line);a.BackgroundTransparency=.55;local b=frame(board,0,i,720,1,C.line);b.BackgroundTransparency=.55 end
for _,diameter in ipairs({340,560}) do local ring=frame(board,360-diameter/2,360-diameter/2,diameter,diameter,C.panel);ring.BackgroundTransparency=1;round(ring,1000);local s=stroke(ring,C.line,1);s.Transparency=.35 end
local items=frame(board,0,0,720,720,C.panel,3);items.BackgroundTransparency=1
local effects=frame(board,0,0,720,720,C.panel,5);effects.BackgroundTransparency=1
local phaseLabel=label(board,"01 / CHARGE UP",20,10,320,27,14,C.muted,Enum.TextXAlignment.Left,6)
local chainLabel=label(board,"BUILD A CHAIN",20,681,440,26,14,C.muted,Enum.TextXAlignment.Left,6)
local dangerLabel=label(board,"LIMIT ±9",540,681,160,26,14,C.muted,Enum.TextXAlignment.Right,6)
local hero=frame(items,360,390,68,68,C.panel,5);hero.BackgroundTransparency=1;hero.AnchorPoint=Vector2.new(.5,.5)
local aura=frame(hero,0,0,68,68,C.panel);aura.BackgroundTransparency=1;round(aura,100);local auraStroke=stroke(aura,C.yellow,1);auraStroke.Transparency=.35
local core=frame(hero,9,9,50,50,C.bg);round(core,100);local coreStroke=stroke(core,C.yellow,4)
local heroText=label(hero,"0",2,4,64,60,30,C.ink)
local side=frame(root,773,148,275,710,C.bg);side.BackgroundTransparency=1
label(side,"YOUR NEXT MOVE",0,0,275,25,13,C.muted,Enum.TextXAlignment.Left)
local hint=label(side,"Collect a charge\nto get started.",0,38,270,95,27,C.ink,Enum.TextXAlignment.Left)
local hintSub=label(side,"Outlined pickups would take you to zero.",0,135,270,46,15,C.muted,Enum.TextXAlignment.Left)
local flipButton=button(side,"±\nFLIP THE FIELD",0,206,265,136,C.yellow,C.bg,27)
local flipSmall=label(flipButton,"SPACE / TAP · 2s recharge",5,104,255,25,12,C.bg)
local recharge=frame(flipButton,0,131,265,5,rgb(151,191,56),6)
local rules=label(side,"+ / −   Add the number you touch.\n\n0   Return to zero. Blast hunters.\n\n±   Flip pickups. Your charge stays.\n\n◆   Avoid coral-red hunters.",0,365,270,204,17,C.muted,Enum.TextXAlignment.Left)
local risk=label(side,"RISK BUILDS POWER\nBigger chains make bigger novas. Crossing ±9 costs a shield.",0,596,270,85,16,C.yellow,Enum.TextXAlignment.Left)
local keysHelp=label(root,"WASD / ARROWS · MOVE     SPACE / X · FLIP     P / ESC · PAUSE",20,874,1020,26,13,C.muted,Enum.TextXAlignment.Left)
local joystick=button(root,"",40,895,140,140,C.panel,C.ink);round(joystick,100);stroke(joystick,C.line,2)
local stickCircle=frame(joystick,35,35,70,70,C.panel);stickCircle.BackgroundTransparency=1;round(stickCircle,100);stroke(stickCircle,C.line,2)
local knob=frame(joystick,50,50,40,40,C.cyan,6);round(knob,100)
label(joystick,"MOVE",0,111,140,20,12,C.muted)
local mobileHint=label(root,"",206,1040,500,33,18,C.muted,Enum.TextXAlignment.Left)
local modal=frame(board,0,0,720,720,C.bg,20);modal.BackgroundTransparency=.04
local startPane=frame(modal,40,24,640,672,C.bg);startPane.BackgroundTransparency=1
label(startPane,"A LITTLE MATH. A LOT OF MAYHEM.",0,15,640,30,14,C.cyan)
label(startPane,"MAKE",0,65,640,90,80,C.ink)
label(startPane,"NOTHING.",0,145,640,90,80,C.yellow)
label(startPane,"Hit zero. Unleash a nova.",0,244,640,38,27,C.ink)
label(startPane,"+3    +4",70,296,240,55,35,C.cyan)
label(startPane,"−7",312,296,90,55,35,C.pink)
label(startPane,"= 0",418,296,145,55,35,C.yellow)
label(startPane,"Collect signed numbers. FLIP reverses every pickup’s sign, but keeps your charge. Return to zero to blast the hunters.",32,364,576,75,19,C.muted)
label(startPane,"Stay between −9 and +9. Overload or touch a hunter: lose a shield. Survive 90 seconds; three hits end the run.",32,443,576,64,17,C.muted)
local startButton=button(startPane,"PLAY ARENA  →",42,523,556,61,C.yellow,C.bg,23)
label(startPane,"ARENA CODE",42,601,152,36,13,C.muted,Enum.TextXAlignment.Left)
local seedBox=make("TextBox",startPane,{Position=UDim2.fromOffset(195,599),Size=UDim2.fromOffset(260,38),Text=os.date("!%Y-%m-%d"),PlaceholderText="YYYY-MM-DD",ClearTextOnFocus=false,TextSize=19,Font=Enum.Font.Code,TextColor3=C.ink,BackgroundColor3=C.panel,BorderSizePixel=0,ZIndex=5});round(seedBox,5)
local randomButton=button(startPane,"RANDOM",467,599,130,38,C.panel,C.muted,14)
label(startPane,"Same code = same starting arena. Share it with a friend.",0,643,640,23,12,C.muted)
local pausePane=frame(modal,40,170,640,410,C.bg);pausePane.BackgroundTransparency=1;pausePane.Visible=false
label(pausePane,"TAKE A BREATH",0,0,640,35,18,C.cyan)
label(pausePane,"PAUSED.",0,58,640,100,78,C.yellow)
local resumeButton=button(pausePane,"KEEP GOING →",50,210,540,65,C.yellow,C.bg,24)
local restartButton=button(pausePane,"RESTART THIS ARENA",50,290,540,52,C.panel,C.muted,19)
local endPane=frame(modal,40,66,640,610,C.bg);endPane.BackgroundTransparency=1;endPane.Visible=false
local resultStatus=label(endPane,"RUN COMPLETE",0,0,640,40,18,C.cyan)
local resultScore=label(endPane,"0",0,56,640,112,85,C.yellow)
local resultRank=label(endPane,"ZERO HERO",0,178,640,46,28,C.ink)
local resultStats=label(endPane,"",40,245,560,100,22,C.muted)
local replayButton=button(endPane,"ONE MORE RUN →",40,372,560,65,C.yellow,C.bg,24)
local homeButton=button(endPane,"BACK TO START",40,450,560,47,C.panel,C.muted,18)
local resultCode=make("TextBox",endPane,{Position=UDim2.fromOffset(40,518),Size=UDim2.fromOffset(560,60),Text="",ClearTextOnFocus=false,TextEditable=false,TextWrapped=true,TextSize=16,Font=Enum.Font.Code,TextColor3=C.muted,BackgroundColor3=C.panel,BorderSizePixel=0,ZIndex=5})
label(endPane,"Copy this challenge text and send it to a friend.",0,580,640,25,13,C.muted)

local mode="menu";local g=R.create(seedBox.Text);local clock=0;local accumulator=0;local best=0;local hudClock=0
local keyState={};local stickX,stickY=0,0;local stickTouch=nil;local padX,padY=0,0
local pickupViews={};local enemyViews={};local particles={};local rings={};local floats={}
local function signed(n) if n>0 then return "+"..n elseif n<0 then return "−"..math.abs(n) else return "0" end end
local function clearInput() keyState={};stickX=0;stickY=0;padX=0;padY=0;stickTouch=nil;knob.Position=UDim2.fromOffset(50,50) end
local function resize()
 local size=gui.AbsoluteSize
 local portrait=size.X/size.Y<1.15
 local w,h=portrait and 760 or 1080,portrait and 1100 or 910
 root.Size=UDim2.fromOffset(w,h);scale.Scale=math.min(size.X/w,size.Y/h)*.97
 pauseButton.Position=UDim2.fromOffset(portrait and 610 or 940,17)
 subtitle.Visible=not portrait;side.Visible=true
 if portrait then
  side.Position=UDim2.fromOffset(210,900);side.Size=UDim2.fromOffset(500,160)
  flipButton.Position=UDim2.fromOffset(0,0);flipButton.Size=UDim2.fromOffset(495,134)
  flipSmall.Size=UDim2.fromOffset(485,25);recharge.Size=UDim2.fromOffset(495,5)
 else
  side.Position=UDim2.fromOffset(773,148);side.Size=UDim2.fromOffset(275,710)
  flipButton.Position=UDim2.fromOffset(0,206);flipButton.Size=UDim2.fromOffset(265,136)
  flipSmall.Size=UDim2.fromOffset(255,25);recharge.Size=UDim2.fromOffset(265,5)
 end
 for _,child in ipairs(side:GetChildren()) do if child~=flipButton then child.Visible=not portrait end end
 joystick.Visible=portrait or UIS.TouchEnabled
 if not portrait and UIS.TouchEnabled then joystick.Position=UDim2.fromOffset(800,715);risk.Visible=false else joystick.Position=UDim2.fromOffset(40,895) end
 mobileHint.Visible=portrait;keysHelp.Visible=not portrait
end
gui:GetPropertyChangedSignal("AbsoluteSize"):Connect(resize)
resize()
local function wipeEffects()
 for _,list in ipairs({particles,rings,floats}) do for _,e in ipairs(list) do e.view:Destroy() end end
 particles={};rings={};floats={}
end
local function start(seed)
 seed=tostring(seed):sub(1,40):gsub("[^%w%-]","")
 if seed=="" then seed=os.date("!%Y-%m-%d") end
 seedBox.Text=seed;g=R.create(seed);mode="play";accumulator=0;clearInput();wipeEffects();modal.Visible=false
end
local function togglePause()
 if mode=="play" then mode="paused";clearInput();modal.Visible=true;startPane.Visible=false;endPane.Visible=false;pausePane.Visible=true
 elseif mode=="paused" then mode="play";modal.Visible=false;accumulator=0 end
end
local function burst(x,y,color,n)
 for i=1,n do
  if #particles>=150 then break end
  local a=math.random()*math.pi*2;local speed=30+math.random()*220;local size=2+math.random()*4
  local view=frame(effects,x,y,size,size,color,4)
  table.insert(particles,{view=view,x=x,y=y,dx=math.cos(a)*speed,dy=math.sin(a)*speed,life=.3+math.random()*.6})
 end
end
local function float(x,y,text,color)
 local view=label(effects,text,x-160,y-55,320,40,24,color,nil,6)
 table.insert(floats,{view=view,x=x,y=y-55,life=1.2})
end
local function ring(x,y,radius,color)
 local view=frame(effects,x,y,1,1,C.panel,3);view.AnchorPoint=Vector2.new(.5,.5);view.BackgroundTransparency=1;round(view,1000)
 local outline=stroke(view,color,5)
 table.insert(rings,{view=view,outline=outline,radius=radius,life=.6})
end
local function finish()
 mode="end";clearInput();modal.Visible=true;startPane.Visible=false;pausePane.Visible=false;endPane.Visible=true
 resultStatus.Text=g.won and "90 SECONDS · REACTOR SURVIVED" or "THREE HITS · REACTOR DOWN"
 resultScore.Text=tostring(g.score)
 resultRank.Text=g.score>best and "NEW SESSION BEST" or (g.novas>=12 and "ZERO HERO" or (g.novas>=6 and "CHAIN REACTION" or "ONE MORE RUN?"))
 best=math.max(best,g.score)
 resultStats.Text=g.novas.." NOVAS     /     "..g.bestChain.." LONGEST CHAIN\n\n"..g.kills.." HUNTERS BLASTED     /     "..math.floor(g.time).."s SURVIVED"
 resultCode.Text="ZERO RIOT | "..g.score.." points | "..g.novas.." novas\nArena: "..g.seed.." — can you beat me?"
end
local function processEvents()
 for _,e in ipairs(g.events) do
  if e.type=="collect" then burst(e.x,e.y,e.value>0 and C.cyan or C.pink,8)
  elseif e.type=="nova" then ring(e.x,e.y,e.radius,C.yellow);burst(e.x,e.y,C.yellow,42);float(e.x,e.y,"ZERO! +"..e.points,C.yellow)
  elseif e.type=="flip" then ring(360,360,540,C.cyan)
  elseif e.type=="destroy" then burst(e.x,e.y,C.red,15)
  elseif e.type=="hurt" then burst(e.x,e.y,C.red,25);float(e.x,e.y,e.reason,C.red)
  elseif e.type=="blocked" then float(e.x,e.y,"SHIELDED",C.cyan)
  elseif e.type=="end" then finish() end
 end
 g.events={}
end
local function flip() if mode=="play" and R.flip(g) then processEvents() end end
startButton.Activated:Connect(function() start(seedBox.Text) end)
randomButton.Activated:Connect(function() seedBox.Text="R"..math.random(100000,999999) end)
flipButton.Activated:Connect(flip);pauseButton.Activated:Connect(togglePause);resumeButton.Activated:Connect(togglePause)
restartButton.Activated:Connect(function() start(g.seed) end);replayButton.Activated:Connect(function() start(g.seed) end)
homeButton.Activated:Connect(function() mode="menu";clearInput();g=R.create(seedBox.Text);wipeEffects();startPane.Visible=true;endPane.Visible=false;pausePane.Visible=false;modal.Visible=true end)
resultCode.Focused:Connect(function() resultCode.SelectionStart=1;resultCode.CursorPosition=#resultCode.Text+1 end)
local movement={W=true,A=true,S=true,D=true,Up=true,Down=true,Left=true,Right=true}
UIS.InputBegan:Connect(function(input,processed)
 if UIS:GetFocusedTextBox() then return end
 local k=input.KeyCode.Name
 if movement[k] and not processed then keyState[k]=true end
 if not processed and (k=="Space" or k=="ButtonX") then flip() end
 if not processed and (k=="P" or k=="Escape" or k=="ButtonStart") then togglePause() end
end)
UIS.InputEnded:Connect(function(input)
 keyState[input.KeyCode.Name]=nil
 if input==stickTouch then stickTouch=nil;stickX=0;stickY=0;knob.Position=UDim2.fromOffset(50,50) end
end)
local function moveStick(input)
 local p=joystick.AbsolutePosition;local s=joystick.AbsoluteSize
 local x=(input.Position.X-p.X-s.X/2)/(s.X*.32);local y=(input.Position.Y-p.Y-s.Y/2)/(s.Y*.32)
 local d=math.sqrt(x*x+y*y);if d>1 then x=x/d;y=y/d end
 stickX=x;stickY=y;knob.Position=UDim2.fromOffset(50+x*42,50+y*42)
end
joystick.InputBegan:Connect(function(input)
 if mode=="play" and (input.UserInputType==Enum.UserInputType.Touch or input.UserInputType==Enum.UserInputType.MouseButton1) then stickTouch=input;moveStick(input) end
end)
UIS.InputChanged:Connect(function(input)
 if input.KeyCode==Enum.KeyCode.Thumbstick1 then
  local v=input.Position;padX=v.X;padY=-v.Y
  if math.sqrt(padX*padX+padY*padY)<.1 then padX=0;padY=0 end
 elseif stickTouch and (input==stickTouch or (stickTouch.UserInputType==Enum.UserInputType.MouseButton1 and input.UserInputType==Enum.UserInputType.MouseMovement)) then moveStick(input) end
end)
UIS.WindowFocusReleased:Connect(function() clearInput();if mode=="play" then togglePause() end end)
local function inputVector()
 local x=(keyState.D or keyState.Right) and 1 or 0; x=x-((keyState.A or keyState.Left) and 1 or 0)
 local y=(keyState.S or keyState.Down) and 1 or 0; y=y-((keyState.W or keyState.Up) and 1 or 0)
 if stickTouch then x=stickX;y=stickY elseif math.abs(padX)+math.abs(padY)>0 then x=padX;y=padY end
 return {x=x,y=y}
end
local function pickupView(p)
 local view=frame(items,p.x,p.y,64,64,C.panel,3);view.BackgroundTransparency=1;view.AnchorPoint=Vector2.new(.5,.5)
 local body=frame(view,9,9,46,46,C.panel);round(body,100);local outline=stroke(body,C.cyan,2)
 local halo=frame(view,1,1,62,62,C.panel);halo.BackgroundTransparency=1;round(halo,100);local haloStroke=stroke(halo,C.yellow,2)
 local text=label(view,"",0,0,64,64,27,C.cyan)
 local warn=label(view,"!",43,-13,25,25,18,C.red)
 return {view=view,body=body,outline=outline,halo=halo,haloStroke=haloStroke,text=text,warn=warn}
end
local function updateViews(dt)
 hero.Position=UDim2.fromOffset(g.x,g.y);local color=g.charge==0 and C.yellow or (g.charge>0 and C.cyan or C.pink)
 coreStroke.Color=color;auraStroke.Color=color;heroText.Text=signed(g.charge)
 coreStroke.Transparency=g.invulnerable>0 and mode=="play" and (.2+.2*math.sin(clock*20)) or 0
 for _,p in ipairs(g.pickups) do
  local v=pickupViews[p.id];if not v then v=pickupView(p);pickupViews[p.id]=v end
  v.view.Position=UDim2.fromOffset(p.x,p.y);v.view.Visible=p.wait<=.3
  local pc=p.v>0 and C.cyan or C.pink;local useful=g.charge~=0 and p.v==-g.charge
  v.body.BackgroundColor3=p.v>0 and rgb(19,58,68) or rgb(57,36,69)
  v.outline.Color=useful and C.yellow or pc;v.outline.Thickness=useful and 3 or 1.5;v.text.Text=signed(p.v);v.text.TextColor3=pc
  v.halo.Visible=useful;v.haloStroke.Transparency=.25+.2*math.sin(clock*5);v.warn.Visible=math.abs(g.charge+p.v)>9
 end
 local live={}
 for _,e in ipairs(g.enemies) do
  live[e.id]=true;local v=enemyViews[e.id]
  if not v then
   local body=frame(items,e.x,e.y,36,36,rgb(115,42,63),4);body.AnchorPoint=Vector2.new(.5,.5);round(body,4);stroke(body,C.red,2)
   local text=label(body,e.type=="dart" and "▲" or "×",0,0,36,36,31,C.red)
   v={view=body,text=text};enemyViews[e.id]=v
  end
  v.view.Position=UDim2.fromOffset(e.x,e.y);v.view.Rotation=e.type=="dart" and (math.deg(math.atan2(e.dy,e.dx))+90) or clock*50
  v.view.BackgroundTransparency=e.warning>0 and .6 or 0;v.text.TextTransparency=e.warning>0 and (.3+.3*math.sin(clock*14)) or 0
 end
 for id,v in pairs(enemyViews) do if not live[id] then v.view:Destroy();enemyViews[id]=nil end end
 if mode~="paused" then
  for i=#particles,1,-1 do local p=particles[i];p.life=p.life-dt;p.x=p.x+p.dx*dt;p.y=p.y+p.dy*dt;p.dx=p.dx*math.exp(-3*dt);p.dy=p.dy*math.exp(-3*dt)
   if p.life<=0 then p.view:Destroy();table.remove(particles,i) else p.view.Position=UDim2.fromOffset(p.x,p.y);p.view.BackgroundTransparency=1-math.min(1,p.life/.7) end
  end
  for i=#rings,1,-1 do local r=rings[i];r.life=r.life-dt
   if r.life<=0 then r.view:Destroy();table.remove(rings,i) else local d=r.radius*2*(1-(r.life/.6)^3);r.view.Size=UDim2.fromOffset(d,d);r.outline.Transparency=1-r.life/.6 end
  end
  for i=#floats,1,-1 do local f=floats[i];f.life=f.life-dt;f.y=f.y-dt*22
   if f.life<=0 then f.view:Destroy();table.remove(floats,i) else f.view.Position=UDim2.fromOffset(f.x-160,f.y);f.view.TextTransparency=1-math.min(1,f.life*2) end
  end
 end
 hudClock=hudClock+dt
 if hudClock>=.07 then
  hudClock=0;scoreLabel.Text=tostring(g.score);chargeLabel.Text=signed(g.charge);chargeLabel.TextColor3=color
  timeLabel.Text=math.ceil(90-g.time).."s";shieldsLabel.Text=string.rep("●",g.lives)..string.rep("○",3-g.lives)
  phaseLabel.Text=g.time<30 and "01 / CHARGE UP" or (g.time<60 and "02 / CROSS FIRE" or "03 / ZERO HOUR")
  chainLabel.Text=g.chain>0 and (g.chain.." PICKUPS · POWER "..g.mass) or "BUILD A CHAIN"
  dangerLabel.Text=math.abs(g.charge)>=7 and "NEAR OVERLOAD" or "LIMIT ±9";dangerLabel.TextColor3=math.abs(g.charge)>=7 and C.red or C.muted
  local h=g.charge==0 and "Collect a charge\nto get started." or ("Find "..signed(-g.charge).."\nor flip "..signed(g.charge)..".")
  hint.Text=h;mobileHint.Text=h:gsub("\n"," ")
  flipButton.Text=g.flipCooldown>0 and ("±\nRECHARGING "..string.format("%.1f",g.flipCooldown).."s") or "±\nFLIP THE FIELD"
  recharge.Size=UDim2.new(1-g.flipCooldown/2,0,0,5)
  flipButton.BackgroundColor3=mode=="play" and C.yellow or rgb(138,155,93)
 end
end
-- Hide the default avatar and controls without holding up the arcade UI.
task.spawn(function()
 pcall(function() StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.All,false) end)
 local function hideCharacter(character)
  for _,o in ipairs(character:GetDescendants()) do if o:IsA("BasePart") or o:IsA("Decal") then o.LocalTransparencyModifier=1 end end
  local humanoid=character:FindFirstChildOfClass("Humanoid");if humanoid then humanoid.DisplayDistanceType=Enum.HumanoidDisplayDistanceType.None end
 end
 player.CharacterAdded:Connect(function(character) task.defer(function() pcall(hideCharacter,character) end) end)
 if player.Character then pcall(hideCharacter,player.Character) end
 local playerScripts=player:WaitForChild("PlayerScripts")
 local module=playerScripts:WaitForChild("PlayerModule",8)
 if module then pcall(function() require(module):GetControls():Disable() end) end
 local touch=player.PlayerGui:FindFirstChild("TouchGui");if touch then touch.Enabled=false end
end)
RunService.PreRender:Connect(function(delta)
 local dt=math.min(.1,delta);clock=clock+dt
 if mode=="play" then
  accumulator=accumulator+dt
  while accumulator>=1/60 and mode=="play" do R.step(g,1/60,inputVector());processEvents();accumulator=accumulator-1/60 end
 end
 updateViews(dt)
end)
