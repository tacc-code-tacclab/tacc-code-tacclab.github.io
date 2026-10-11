-- Native Roblox GUI edition. The board expands independently in X and Y.
-- No webpage, fixed-width wrapper, letterboxing, external image requests or sidebar.
local Players=game:GetService('Players')
local UIS=game:GetService('UserInputService')
local RunService=game:GetService('RunService')
local GuiService=game:GetService('GuiService')
local StarterGui=game:GetService('StarterGui')
local SoundService=game:GetService('SoundService')
local gui=script.Parent
local Core=require(gui:WaitForChild('Core'))
local Layout=require(gui:WaitForChild('Layout'))
local Scenery=require(gui:WaitForChild('Scenery'))
local player=Players.LocalPlayer
local function make(kind,parent,props) local o=Instance.new(kind);for k,v in pairs(props or {}) do o[k]=v end;o.Parent=parent;return o end
local function rgb(r,g,b) return Color3.fromRGB(r,g,b) end
local C={ink=rgb(13,29,42),panel=rgb(20,39,54),white=rgb(244,252,253),mint=rgb(157,243,203),gold=rgb(255,222,119),muted=rgb(177,202,214),purple=rgb(207,165,255),danger=rgb(250,140,183)}
local palette={rgb(192,174,255),rgb(255,181,139),rgb(155,239,206),rgb(150,219,255)}
gui.ResetOnSpawn=false;gui.DisplayOrder=100;gui.ZIndexBehavior=Enum.ZIndexBehavior.Sibling
-- Interactive content respects Roblox's top bar and device cutouts; only scenery is full bleed.
gui.ScreenInsets=Enum.ScreenInsets.CoreUISafeInsets;gui.ClipToDeviceSafeArea=true
local playerGui=player:WaitForChild('PlayerGui')
if UIS.TouchEnabled then playerGui.ScreenOrientation=Enum.ScreenOrientation.Portrait end
local sceneryGui=make('ScreenGui',playerGui,{Name='Micio3Scenery',DisplayOrder=99,ResetOnSpawn=false,ScreenInsets=Enum.ScreenInsets.None,ClipToDeviceSafeArea=false,ZIndexBehavior=Enum.ZIndexBehavior.Sibling})
local scenery=make('Frame',sceneryGui,{Name='WorldBackground',Size=UDim2.fromScale(1,1),BackgroundColor3=C.ink,BorderSizePixel=0})
local root=make('Frame',gui,{Name='FullScreenGame',Size=UDim2.fromScale(1,1),BackgroundTransparency=1,BorderSizePixel=0})
local function frame(parent,name,x,y,w,h,color,z)
 return make('Frame',parent,{Name=name,Position=UDim2.fromOffset(x,y),Size=UDim2.fromOffset(w,h),BackgroundColor3=color or C.panel,BorderSizePixel=0,ZIndex=z or 1})
end
local function round(o,r) make('UICorner',o,{CornerRadius=UDim.new(r or .22,0)}) end
local function text(parent,name,value,size,color,z)
 return make('TextLabel',parent,{Name=name,Text=value,Size=UDim2.fromScale(1,1),BackgroundTransparency=1,Font=Enum.Font.GothamBold,TextSize=size or 14,TextColor3=color or C.white,TextWrapped=true,ZIndex=z or 2})
end
local function button(parent,name,value,color)
 local o=make('TextButton',parent,{Name=name,Text=value,Font=Enum.Font.GothamBold,TextSize=16,TextColor3=C.white,BackgroundColor3=color or C.panel,BackgroundTransparency=.06,BorderSizePixel=0,AutoButtonColor=true,TextWrapped=true,ZIndex=6})
 round(o,.22);return o
end
local function place(o,x,y,w,h) o.Position=UDim2.fromOffset(x,y);o.Size=UDim2.fromOffset(w,h) end
local function line(parent,name,x1,y1,x2,y2,color,width,z)
 local dx,dy=x2-x1,y2-y1
 local f=frame(parent,name,(x1+x2)/2,(y1+y2)/2,math.sqrt(dx*dx+dy*dy),width or 1,color,z)
 f.AnchorPoint=Vector2.new(.5,.5);f.Rotation=math.deg(math.atan2(dy,dx));return f
end
local header=frame(root,'CompactHUD',0,0,1,1,C.ink,6);header.BackgroundTransparency=.12;round(header,.13)
local locationText=text(header,'Destination','VENEZIA · 1/36',13,C.white)
locationText.TextXAlignment=Enum.TextXAlignment.Left
local goalText=text(header,'Goal','DIAMANTE · 0/8',13,C.gold);goalText.TextXAlignment=Enum.TextXAlignment.Left
local walletText=text(header,'Credits','0 ◇',12,C.mint)
local timerText=text(header,'Time','3:30',12,C.white)
local pauseButton=button(header,'Pause','Ⅱ')
local goalTrack=frame(root,'GoalTrack',5,55,1,3,C.ink,6)
local goalFill=frame(goalTrack,'Fill',0,0,0,3,C.mint,1)
local board=frame(root,'Board',0,0,1,1,C.ink,2);board.Size=UDim2.fromScale(1,1);board.BackgroundTransparency=1;board.Active=true;board.ClipsDescendants=true
local controls=frame(root,'Controls',0,0,1,1,C.panel,6);controls.Size=UDim2.fromScale(1,1);controls.BackgroundTransparency=1
local controlSpec={{'Left','←'},{'Rotate','↻'},{'Right','→'},{'Drop','↓ POSA'},{'Purr','✳ 0/4'},{'Arsenal','ARMI'}}
local buttons={};for _,spec in ipairs(controlSpec) do buttons[spec[1]]=button(controls,spec[1],spec[2],spec[1]=='Drop' and rgb(38,112,95) or C.panel) end
local swapButton=button(root,'Swap','',C.panel);swapButton.TextSize=12
local nextLabel=text(swapButton,'NextPiece','',13,C.mint);nextLabel.TextXAlignment=Enum.TextXAlignment.Left
local swapArrow=text(swapButton,'SwapArrow','⇄',15,C.white)
local shootButton=button(root,'Shoot','◎ SPARA\nX · SASSI',rgb(149,223,94));shootButton.TextColor3=C.ink;shootButton.TextSize=14;shootButton.Visible=false
local toast=text(root,'Notice','',13,C.gold,8);toast.BackgroundColor3=C.ink;toast.BackgroundTransparency=.2;round(toast,.2);toast.Visible=false
local g=Core.new();local phase='welcome';local paused=true;local dirty=true;local l=Layout.compute(390,800)
local elapsed,dropClock,hudClock,toastUntil=0,0,0,0
local held={};local pointer=nil;local lastResult=nil;local activeWorld=-1
local function notice(msg,duration) toast.Text=msg;toastUntil=elapsed+(duration or 2.5);toast.Visible=false end

-- A small fixed sound pool. Bundled Roblox sounds need no separately moderated assets.
-- The mosquito is a pitched, looped electronic tone with mild distortion/modulation.
local audioEnabled=true;local musicClock=0;local noteIndex=0
local ping='rbxasset://sounds/electronicpingshort.wav'
local buzz=make('Sound',SoundService,{Name='Micio3Mosquito',SoundId=ping,Volume=.055,Looped=true,PlaybackSpeed=1.64})
make('DistortionSoundEffect',buzz,{Level=.18})
make('EqualizerSoundEffect',buzz,{LowGain=-32,MidGain=-3,HighGain=-10})
local voices={};for i=1,8 do voices[i]=make('Sound',SoundService,{Name='Micio3Voice'..i,SoundId=ping,Volume=.08}) end;local voiceIndex=0
local function tone(speed,volume,id)
 if not audioEnabled then return end;voiceIndex=voiceIndex%#voices+1;local s=voices[voiceIndex];s:Stop();s.SoundId=id or ping;s.PlaybackSpeed=speed or 1;s.Volume=volume or .08;s.TimePosition=0;s:Play()
end
local function silence() buzz:Stop();for _,s in ipairs(voices) do s:Stop() end end

-- Pooled grid, cats and outlines: only changed cells are updated after an action.
local views={}
for y=0,11 do for x=0,8 do
 local v={x=x,y=y};v.root=frame(board,'Cell_'..x..'_'..y,0,0,10,10,C.ink,2);v.root.BackgroundTransparency=1
 v.edges={};for i=1,6 do v.edges[i]=frame(v.root,'Edge'..i,0,0,1,1,C.white,1);v.edges[i].AnchorPoint=Vector2.new(.5,.5) end
 v.target=text(v.root,'Stamp','',14,C.gold,4)
 v.cat=frame(v.root,'Kitten',0,0,1,1,palette[1],2);v.cat.BackgroundTransparency=1
 v.parts={}
 for _,sx in ipairs({.22,.66}) do local ear=make('Frame',v.cat,{Name='Ear',Position=UDim2.fromScale(sx,.14),Size=UDim2.fromScale(.19,.26),BackgroundColor3=palette[1],BorderSizePixel=0,Rotation=45,ZIndex=1});round(ear,.12);v.parts[#v.parts+1]=ear end
 local face=make('Frame',v.cat,{Name='Face',Position=UDim2.fromScale(.12,.2),Size=UDim2.fromScale(.76,.68),BackgroundColor3=palette[1],BorderSizePixel=0,ZIndex=2});round(face,.38);v.parts[#v.parts+1]=face
 make('UIStroke',face,{Color=C.white,Thickness=1,Transparency=.3})
 for _,sx in ipairs({.26,.62}) do local eye=make('Frame',face,{Name='Eye',Position=UDim2.fromScale(sx,.36),Size=UDim2.fromScale(.085,.14),BackgroundColor3=C.ink,BorderSizePixel=0,ZIndex=3});round(eye,.5) end
 for _,sx in ipairs({.12,.73}) do local cheek=make('Frame',face,{Name='Cheek',Position=UDim2.fromScale(sx,.58),Size=UDim2.fromScale(.15,.12),BackgroundColor3=rgb(250,125,170),BackgroundTransparency=.3,BorderSizePixel=0,ZIndex=3});round(cheek,.5) end
 v.mouth=text(face,'Mouth','ω',12,C.ink,3);v.mouth.Position=UDim2.fromScale(.35,.51);v.mouth.Size=UDim2.fromScale(.3,.35)
 v.mark=make('Frame',v.root,{Name='Clutter',Position=UDim2.fromScale(.18,.14),Size=UDim2.fromScale(.64,.74),BackgroundColor3=rgb(103,69,142),BorderSizePixel=0,ZIndex=3});round(v.mark,.3);text(v.mark,'Cross','✕',20,C.purple)
 views[#views+1]=v
end end
local mosquito=button(board,'Mosquito','',C.ink);mosquito.BackgroundTransparency=1;mosquito.ZIndex=5;mosquito.Visible=false
local wings={}
for _,side in ipairs({-1,1}) do for row=0,1 do
 local wing=make('Frame',mosquito,{Name='Wing',Position=UDim2.fromScale(side<0 and .05 or .53,.08+row*.2),Size=UDim2.fromScale(.45,.23),BackgroundColor3=row==0 and rgb(159,244,242) or C.purple,BackgroundTransparency=.14,BorderSizePixel=0,Rotation=side*25,ZIndex=1});round(wing,.5);wings[#wings+1]={view=wing,side=side,row=row}
end end
local mosquitoBody=make('Frame',mosquito,{Name='Body',Position=UDim2.fromScale(.36,.35),Size=UDim2.fromScale(.25,.39),BackgroundColor3=rgb(132,83,175),BorderSizePixel=0,Rotation=-23,ZIndex=2});round(mosquitoBody,.5)
local mosquitoFace=make('Frame',mosquito,{Name='Face',Position=UDim2.fromScale(.27,.22),Size=UDim2.fromScale(.40,.33),BackgroundColor3=rgb(75,47,112),BorderSizePixel=0,ZIndex=3});round(mosquitoFace,.5)
text(mosquitoFace,'Eyes','> <',17,rgb(255,185,103),4)
line(mosquito,'Proboscis',28,35,8,58,C.purple,3,4)
for _,side in ipairs({-1,1}) do for row=0,2 do line(mosquito,'Leg',43+side*6,45+row*5,43+side*24,48+row*10,C.purple,2,1) end end
local hpText=text(mosquito,'HP','4/4',12,C.purple,4);hpText.Position=UDim2.fromScale(.1,.81);hpText.Size=UDim2.fromScale(.8,.19)
local projectile=frame(board,'Projectile',0,0,12,8,C.gold,9);round(projectile,.5);projectile.Visible=false;projectile.AnchorPoint=Vector2.new(.5,.5)
local shotTime,shotFrom,shotTo=0,nil,nil

local modal=frame(root,'Modal',0,0,1,1,C.ink,20);modal.Size=UDim2.fromScale(1,1);modal.BackgroundTransparency=.16;modal.Active=true
local card=frame(modal,'Card',0,0,1,1,C.panel,1);round(card,.035)
local modalTitle=text(card,'Title','MICIO INCASTRO 3',25,C.white)
local modalCopy=text(card,'Summary','',13,C.muted)
local content=make('ScrollingFrame',card,{Name='Choices',BackgroundTransparency=1,BorderSizePixel=0,ScrollBarThickness=3,ScrollBarImageColor3=C.mint,CanvasSize=UDim2.fromOffset(0,0),ScrollingDirection=Enum.ScrollingDirection.Y,ZIndex=3})
local primary=button(card,'Primary','PARTI · SFIDA →',rgb(39,120,99));local secondary=button(card,'Secondary','SENZA FRETTA')
local modalButtons={};local primaryAction,secondaryAction
local function clearInput() held={};pointer=nil;dropClock=0 end
local function modalLayout()
 local cw=math.min(510,l.w-18);local ch=math.min(630,l.h-14)
 place(card,(l.w-cw)/2,(l.h-ch)/2,cw,ch)
 place(modalTitle,16,13,cw-32,35);modalTitle.TextSize=ch<400 and 20 or 25
 place(modalCopy,18,51,cw-36,64);modalCopy.TextSize=ch<400 and 11 or 13
 place(content,14,122,cw-28,math.max(24,ch-238))
 for i,b in ipairs(modalButtons) do place(b,0,(i-1)*53,cw-36,47) end
 content.CanvasSize=UDim2.fromOffset(0,#modalButtons*53)
 place(primary,14,ch-105,cw-28,46);place(secondary,14,ch-54,cw-28,43)
end
local function openModal(kind,title,copyText,aText,a,bText,b)
 phase=kind;paused=true;clearInput();silence();modal.Visible=true;modalTitle.Text=title;modalCopy.Text=copyText
 for _,child in ipairs(content:GetChildren()) do child:Destroy() end;modalButtons={};content.CanvasPosition=Vector2.new(0,0)
 primary.Text=aText;primaryAction=a;secondary.Text=bText or '';secondaryAction=b;secondary.Visible=b~=nil;modalLayout()
end
local function choice(name,value,handler,color)
 local b=button(content,name,value,color);b.TextSize=13;b.Activated:Connect(handler);modalButtons[#modalButtons+1]=b;modalLayout();return b
end
local function resume() phase='playing';paused=false;clearInput();modal.Visible=false;dirty=true end
local update,act,showResult,showArsenal,showPause
local function newGame(mode) g:reset(mode);activeWorld=-1;lastResult=nil;resume();notice('Riempi TUTTE le caselle dorate. Le verdi restano tue.',5);update() end
local function audioChoice()
 local b; b=choice('Audio',audioEnabled and '♫  Suoni e musica: ON' or '♫  Suoni e musica: OFF',function() audioEnabled=not audioEnabled;silence();b.Text=audioEnabled and '♫  Suoni e musica: ON' or '♫  Suoni e musica: OFF' end)
end
local function weapons(canPurchase)
 for _,id in ipairs(Core.WEAPON_IDS) do local w=Core.WEAPONS[id];local owned=false;for _,v in ipairs(g.owned) do if v==id then owned=true end end
  local label=w.icon..'  '..w.name..'   ·   '..w.damage..' danni   ·   '..(owned and (g.weapon==id and 'IN USO' or 'SCEGLI') or tostring(w.price)..' crediti')
  local b=choice('Weapon_'..id,label,function()
   if owned then g:equip(id) elseif canPurchase then if not g:buy(id) then tone(.5,.08);return end;tone(1.8,.1) else return end
   if canPurchase then showResult() else showArsenal() end
  end,owned and rgb(36,82,79) or C.ink)
  b.AutoButtonColor=owned or (canPurchase and g:canBuy(id));if not b.AutoButtonColor then b.TextColor3=C.muted;b.BackgroundTransparency=.48 end
 end
end
showArsenal=function()
 openModal('arsenal','IL TUO ARSENALE',g.coins..' crediti · Cambia con E oppure 1–5.\nNuove armi si comprano tra le tappe. I colpi sono illimitati.','TORNA AL GIOCO →',resume,'CAMBIA GRUPPO · C',function() resume();act('swap') end)
 weapons(false);audioChoice()
end
showPause=function()
 if g.over then showResult();return end
 openModal('pause','PAUSA',g:world().name..' · Tappa '..(g.stage+1)..'/36\nCopri ogni casella dorata, anche quelle interne.','RIPRENDI →',resume,'ARMI',showArsenal)
 audioChoice();choice('Help','Frecce: muovi / ruota · Spazio: posa · X: spara\nTouch: trascina / scorri giù · Tocca: ruota',function() end)
 choice('Passport','PASSAPORTO · 18 DESTINAZIONI',function()
  openModal('passport','IL TUO VIAGGIO','Due sagome per destinazione.\nSi avanza completando ogni casella, senza buchi.','RIPRENDI →',resume,'TORNA ALLA PAUSA',showPause)
  for i,w in ipairs(Core.WORLDS) do local completed=math.max(0,math.min(2,g.stage-(i-1)*2));choice('World'..i,w.name..' · '..w.country..'   '..completed..'/2',function() end) end
 end)
end
showResult=function()
 lastResult=g.endReason
 if g:won() then
  local all=g:campaignWon()
  openModal('result',all and 'IL MONDO È DEI MICI!' or 'SAGOMA COMPLETA!',(all and 'Tutte le 36 sagome completate. Hai vinto il viaggio!' or g:mission().label..' conquistata. Nessun buco!')..'\n'..g.score..' punti · '..g.coins..' crediti',all and 'NUOVO VIAGGIO →' or 'PROSSIMA TAPPA →',function() if all then newGame(g.mode) else g:nextStage();lastResult=nil;resume();notice(g:world().name..' · '..g:mission().label,3);update() end end,'',nil)
  if not all then weapons(true) end
 else openModal('result',g.endReason=='time' and 'TEMPO SCADUTO' or 'NIDO PIENO',g:progress()..'/'..g:goal()..' caselle conquistate.\nRiprova la tappa: conservi armi e crediti delle tappe precedenti.','RIPROVA →',function() g:retryStage();lastResult=nil;resume();update() end,'',nil) end
end
primary.Activated:Connect(function() if primaryAction then primaryAction() end end)
secondary.Activated:Connect(function() if secondaryAction then secondaryAction() end end)

local function resize()
 local size=root.AbsoluteSize;if size.X<1 or size.Y<1 then return end;l=Layout.compute(size.X,size.Y)
 place(header,5,3,l.w-10,l.top-8);place(locationText,8,2,l.w-142,21);place(goalText,8,22,l.w-140,20)
 place(walletText,l.w-132,3,66,19);place(timerText,l.w-132,23,66,18);place(pauseButton,l.w-61,0,44,44)
 place(goalTrack,7,l.top-3,l.w-14,3);goalFill.Size=UDim2.new(g:progress()/g:goal(),0,1,0)
 for i,p in ipairs(Layout.buttons(l)) do place(buttons[controlSpec[i][1]],p.x,p.y,p.w,p.h);buttons[controlSpec[i][1]].TextSize=l.w<370 and 12 or 14;if i==6 then place(shootButton,p.x,p.y,p.w,p.h);shootButton.TextSize=l.w<500 and 11 or 14 end end
 place(swapButton,8,l.top+4,70,27);place(nextLabel,6,1,42,24);place(swapArrow,47,1,18,24)
 place(toast,18,l.h-l.bottom-33,l.w-36,28);toast.TextSize=l.font
 for _,v in ipairs(views) do local x,y=Layout.cell(l,v.x,v.y);local w,h=l.cellW*.94,l.cellH*.94;place(v.root,x-w/2,y-h/2,w,h);local catWidth=math.min(w,h*1.7);place(v.cat,(w-catWidth)/2,0,catWidth,h)
  local points={{w,h/2},{w*.75,h},{w*.25,h},{0,h/2},{w*.25,0},{w*.75,0}}
  for i,edge in ipairs(v.edges) do local a,b=points[i],points[i%6+1];local dx,dy=b[1]-a[1],b[2]-a[2];place(edge,(a[1]+b[1])/2,(a[2]+b[2])/2,math.sqrt(dx*dx+dy*dy),1);edge.Rotation=math.deg(math.atan2(dy,dx)) end
  v.mouth.TextSize=math.max(9,math.min(21,h*.23));v.target.TextSize=math.max(11,math.min(22,h*.38));v.cache=nil
 end
 modalLayout();dirty=true
end
update=function()
 local world=g:mission().world
 if world~=activeWorld then Scenery.create(scenery,world+1);activeWorld=world end
 locationText.Text=string.upper(g:world().name)..' · '..(g.stage+1)..'/36'
 goalText.Text=(elapsed<toastUntil and #toast.Text<=38) and toast.Text or (g:mission().label..' · '..g:progress()..'/'..g:goal());walletText.Text=g.coins..' ◇'
 local seconds=math.ceil(g:remaining()/1000);timerText.Text=seconds==math.huge and '∞' or string.format('%d:%02d',math.floor(seconds/60),seconds%60)
 goalFill.Size=UDim2.new(g:progress()/g:goal(),0,1,0)
 buttons.Purr.Text='✳ '..g.charge..'/4';buttons.Purr.TextColor3=g.charge>=4 and C.mint or C.muted
 buttons.Arsenal.Text=Core.WEAPONS[g.weapon].icon..' ARMI'
 nextLabel.Text=string.rep('●',#g.queue[1].cells);nextLabel.TextColor3=palette[g.queue[1].color+1]
 local m=g.mosquito;shootButton.Visible=m~=nil and not paused;mosquito.Visible=m~=nil and not paused
 buttons.Arsenal.Visible=not shootButton.Visible
 shootButton.Text='SPARA\n'..(UIS.TouchEnabled and Core.WEAPONS[g.weapon].icon or ('X · '..Core.WEAPONS[g.weapon].icon))
 if m then hpText.Text=m.hp..'/'..m.maxHp end
 if not dirty then return end;dirty=false
 local targets,active,ghost={},{},{}
 for _,p in ipairs(g:targets()) do targets[p.y*9+p.x]=true end
 if not g.over then for _,p in ipairs(g:cells()) do active[p.y*9+p.x]=p.color end;for _,p in ipairs(g:cells(g:ghost())) do ghost[p.y*9+p.x]=p.color end end
 for _,v in ipairs(views) do local k=v.y*9+v.x;local color=g.board[v.y][v.x];local isActive=active[k]~=nil;local stamped=Core.isCat(g.stamps[k]);local isTarget=targets[k];if isActive then color=active[k] end
  local key=tostring(color)..':'..tostring(isActive)..':'..tostring(stamped)..':'..tostring(isTarget)..':'..tostring(ghost[k])
  if key~=v.cache then v.cache=key;v.root.ZIndex=isActive and 4 or 2
   local edgeColor=isTarget and (stamped and C.mint or C.gold) or (ghost[k]~=nil and C.white or C.muted)
   for _,edge in ipairs(v.edges) do edge.BackgroundColor3=edgeColor;edge.BackgroundTransparency=isTarget and .04 or (ghost[k]~=nil and .16 or .88);edge.Size=UDim2.new(edge.Size.X.Scale,edge.Size.X.Offset,0,isTarget and 2 or 1) end
   v.cat.Visible=Core.isCat(color);v.mark.Visible=color==Core.BLOCK
   v.target.Text=isTarget and (stamped and '✓' or '•') or '';v.target.TextColor3=stamped and C.mint or C.gold
   if v.cat.Visible then for _,part in ipairs(v.parts) do part.BackgroundColor3=palette[color+1] end;v.target.Size=UDim2.fromScale(.26,.3);v.target.Position=UDim2.fromScale(.68,.64)
   else v.target.Size=UDim2.fromScale(1,1);v.target.Position=UDim2.fromScale(0,0) end
  end
 end
end
local function feedback(result)
 if not result then return end
 if result.stamped and result.stamped>0 then notice('+'..result.stamped..' caselle · '..(g:goal()-g:progress())..' da riempire',2);tone(1.5,.1) end
 if result.clears and #result.clears>0 then tone(2,.1);notice(result.purr and 'Fusa! Spazio liberato.' or 'Incastro! '..(result.chain or 1)..'×',2) end
end
act=function(action)
 if paused or phase~='playing' or g.over then return false end
 local result,ok
 if action=='left' then ok=g:move(-1) elseif action=='right' then ok=g:move(1)
 elseif action=='rotate' then ok=g:turn();if ok then tone(.9,.035,'rbxasset://sounds/button.wav') end
 elseif action=='drop' then result=g:drop();dropClock=0;tone(.6,.07,'rbxasset://sounds/button.wav')
 elseif action=='down' then result=g:step() elseif action=='swap' then ok=g:swap()
 elseif action=='purr' then result=g:purr();if not result then notice('Le Fusa si caricano con incastri e zanzare.',2) end
 elseif action=='weapon' then g:cycleWeapon();notice(Core.WEAPONS[g.weapon].name,1)
 elseif action=='shoot' then
  local m=g.mosquito;if not m then return false end
  local target={x=mosquito.Position.X.Offset+44,y=mosquito.Position.Y.Offset+40}
  ok=g:shootMosquito();if ok then shotTime=.25;shotFrom={x=l.w*.5,y=l.h-l.bottom};shotTo=target;projectile.Visible=true;projectile.BackgroundColor3=g.weapon=='laser' and C.purple or C.gold;tone(g.weapon=='laser' and 2 or 1.2,.12) end
 end
 feedback(result);dirty=true;update();return ok or result~=nil
end
for name,action in pairs({Left='left',Rotate='rotate',Right='right',Drop='drop',Purr='purr'}) do local a=action;buttons[name].Activated:Connect(function() act(a) end) end
buttons.Arsenal.Activated:Connect(function() if not paused then showArsenal() end end)
swapButton.Activated:Connect(function() act('swap') end)
pauseButton.Activated:Connect(function() if not paused then showPause() end end)
shootButton.Activated:Connect(function() act('shoot') end)
mosquito.Activated:Connect(function() act('shoot') end)
local keyActions={Left='left',Right='right',Up='rotate',Down='down',A='left',D='right',W='rotate',S='down',Space='drop',X='shoot',E='weapon',C='swap',F='purr',DPadLeft='left',DPadRight='right',DPadUp='rotate',DPadDown='down',ButtonA='drop',ButtonX='shoot',ButtonY='weapon'}
UIS.InputBegan:Connect(function(input,processed)
 if processed then return end;local key=input.KeyCode.Name
 if key=='P' or key=='ButtonStart' then if phase=='playing' then showPause() elseif phase=='pause' then resume() end;return end
 if paused then return end
 local numbers={One=1,Two=2,Three=3,Four=4,Five=5}
 if numbers[key] then if g:equip(Core.WEAPON_IDS[numbers[key]]) then dirty=true;update() end;return end
 local a=keyActions[key];if a then if held[key] then return end;act(a);if a=='left' or a=='right' or a=='down' then held[key]={action=a,wait=.27} end end
end)
UIS.InputEnded:Connect(function(input)
 held[input.KeyCode.Name]=nil
 if not pointer or pointer.input~=input then return end
 local p=pointer;pointer=nil;if paused or input.UserInputState==Enum.UserInputState.Cancel then return end
 local dy=input.Position.Y-p.startY
 if dy>math.max(50,l.dy*1.2) and math.abs(input.Position.X-p.startX)<l.w*.5 then act('drop') elseif not p.moved and elapsed-p.time<.4 then act('rotate') end
end)
board.InputBegan:Connect(function(input)
 if paused or pointer then return end
 if input.UserInputType~=Enum.UserInputType.Touch and input.UserInputType~=Enum.UserInputType.MouseButton1 then return end
 local y=input.Position.Y-root.AbsolutePosition.Y;if y<l.top+40 or y>l.h-l.bottom then return end
 pointer={input=input,startX=input.Position.X,startY=input.Position.Y,lastX=input.Position.X,time=elapsed,moved=false}
end)
UIS.InputChanged:Connect(function(input)
 if paused or not pointer then return end
 if input~=pointer.input and input.UserInputType~=Enum.UserInputType.MouseMovement then return end
 local dx=input.Position.X-pointer.lastX;local steps=math.floor(math.abs(dx)/math.max(15,l.dx*.65))
 if steps>0 then pointer.moved=true;local direction=dx>0 and 1 or -1;for _=1,math.min(8,steps) do act(direction>0 and 'right' or 'left') end;pointer.lastX=pointer.lastX+direction*steps*math.max(15,l.dx*.65) end
end)
GuiService.MenuOpened:Connect(function() if phase=='playing' then showPause() end end)
UIS.WindowFocusReleased:Connect(function() if phase=='playing' then showPause() end end)
root:GetPropertyChangedSignal('AbsoluteSize'):Connect(function() resize();update() end)
local melody={0,7,12,4,9,7,2,7,0,12,16,14,9,7,4,2,5,9,12,7,4,2,0,-5}
RunService.RenderStepped:Connect(function(dt)
 dt=math.min(math.max(dt,0),.1);elapsed=elapsed+dt
 if elapsed>=toastUntil then toast.Visible=false end
 if not paused and not g.over then
  g:advance(dt*1000)
  for _,h in pairs(held) do h.wait=h.wait-dt;if h.wait<=0 then act(h.action);h.wait=.095 end end
  if g.mode=='flow' then dropClock=dropClock+dt*1000;if dropClock>=g:interval() then dropClock=dropClock-g:interval();feedback(g:step());dirty=true end end
  for _,e in ipairs(g:drainEvents()) do
   if e.type=='mosquito-warning' then notice('Zzz! Premi SPARA o X.',3);tone(1.6,.11)
   elseif e.type=='mosquito-clutter' then dirty=true;notice('La zanzara sporca il nido! SPARA / X',2)
   elseif e.type=='mosquito-defeated' then feedback(e.result);dirty=true;notice('Zanzara scacciata! +1 credito',2);tone(2.1,.12) end
  end
  local m=g.mosquito
  if m then
   local t=m.age/1000;local mx=math.max(8,math.min(l.w-88,l.w*(.5+.34*math.sin(t*1.45+m.phase))-44));local my=l.top+l.boardH*(.22+.16*math.sin(t*2.03+m.phase))-25
   place(mosquito,mx,my,88,82);for _,wing in ipairs(wings) do wing.view.Rotation=wing.side*(24+math.sin(t*44)*24) end
   if audioEnabled then buzz.PlaybackSpeed=1.64+math.sin(t*17)*.05;if not buzz.IsPlaying then buzz:Play() end end
  else buzz:Stop() end
  if audioEnabled then musicClock=musicClock+dt;if musicClock>.46 then musicClock=0;noteIndex=noteIndex%#melody+1;tone(.52*2^((melody[noteIndex]+(g:mission().world%5)*2)/12),.035) end end
 end
 if not paused and g.over and lastResult~=g.endReason then showResult() end
 if paused then mosquito.Visible=false;shootButton.Visible=false end
 if shotTime>0 then shotTime=math.max(0,shotTime-dt);local t=1-shotTime/.25;local x=shotFrom.x+(shotTo.x-shotFrom.x)*t;local y=shotFrom.y+(shotTo.y-shotFrom.y)*t-math.sin(t*math.pi)*30;projectile.Position=UDim2.fromOffset(x,y);projectile.Rotation=t*280;projectile.Visible=shotTime>0 and not paused else projectile.Visible=false end
 hudClock=hudClock+dt;if dirty or hudClock>.18 then hudClock=0;update() end
end)
for _,kind in ipairs({Enum.CoreGuiType.Backpack,Enum.CoreGuiType.Health,Enum.CoreGuiType.PlayerList,Enum.CoreGuiType.Chat}) do pcall(function() StarterGui:SetCoreGuiEnabled(kind,false) end) end
task.spawn(function()
 local scripts=player:WaitForChild('PlayerScripts',8);local module=scripts and scripts:WaitForChild('PlayerModule',8)
 if module then pcall(function() require(module):GetControls():Disable() end) end
end)
local function camera() if workspace.CurrentCamera then workspace.CurrentCamera.CameraType=Enum.CameraType.Scriptable;workspace.CurrentCamera.CFrame=CFrame.new(0,100,0) end end
camera();workspace:GetPropertyChangedSignal('CurrentCamera'):Connect(camera)
resize();update()
openModal('welcome','MICIO INCASTRO 3','36 sagome · 18 destinazioni\nCopri TUTTE le caselle dorate. 100 punti = 1 credito.\nLa zanzara si scaccia con SPARA o X.','PARTI · SFIDA →',function() newGame('flow') end,'SENZA FRETTA',function() newGame('chill') end)
choice('Instructions','Trascina per spostare · Tocca per ruotare\nScorri giù o premi POSA per far cadere',function() end)
audioChoice()
