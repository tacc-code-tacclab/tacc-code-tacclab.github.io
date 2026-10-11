-- A GUI/runtime mock: catches API usage, input and layout regressions, not a Studio playtest.
math.atan2=math.atan2 or math.atan
local function signal() return {listeners={},Connect=function(self,fn) self.listeners[#self.listeners+1]=fn;return {Disconnect=function() end} end,Fire=function(self,...) for _,fn in ipairs(self.listeners) do fn(...) end end} end
Enum=setmetatable({},{__index=function(t,k) local values=setmetatable({},{__index=function(a,b) local v={Name=b,EnumType=k};rawset(a,b,v);return v end});rawset(t,k,values);return values end})
Color3={fromRGB=function(r,g,b) return {r=r,g=g,b=b} end}
ColorSequenceKeypoint={new=function(t,c) return {Time=t,Value=c} end}
ColorSequence={new=function(a,b) return b and {{Time=0,Value=a},{Time=1,Value=b}} or a end}
UDim={new=function(s,o) return {Scale=s,Offset=o} end}
UDim2={fromOffset=function(x,y) return {X=UDim.new(0,x),Y=UDim.new(0,y)} end,fromScale=function(x,y) return {X=UDim.new(x,0),Y=UDim.new(y,0)} end,new=function(xs,xo,ys,yo) return {X=UDim.new(xs,xo),Y=UDim.new(ys,yo)} end}
Vector2={new=function(x,y) return {X=x,Y=y} end}
CFrame={new=function(...) return {...} end}
task={spawn=function(f) f() end}
local viewport={w=390,h=844}
local all,methods={},{}
local signals={Activated=true,InputBegan=true,InputChanged=true,InputEnded=true,WindowFocusReleased=true,RenderStepped=true,MenuOpened=true}
function methods:GetChildren() local out={};for _,v in ipairs(all) do if v.Parent==self and not v.destroyed then out[#out+1]=v end end;return out end
function methods:GetDescendants() local out={};for _,v in ipairs(self:GetChildren()) do out[#out+1]=v;for _,c in ipairs(v:GetDescendants()) do out[#out+1]=c end end;return out end
function methods:FindFirstChild(name) for _,v in ipairs(self:GetChildren()) do if v.Name==name then return v end end end
function methods:WaitForChild(name,timeout) local found=self:FindFirstChild(name);if not timeout then assert(found,name) end;return found end
function methods:GetPropertyChangedSignal(name) self._signals=self._signals or {};self._signals[name]=self._signals[name] or signal();return self._signals[name] end
function methods:Destroy() for _,v in ipairs(self:GetChildren()) do v:Destroy() end;self.Parent=nil;self.destroyed=true end
function methods:Play() self.IsPlaying=true end
function methods:Stop() self.IsPlaying=false end
function methods:IsA(name) return self.ClassName==name end
Instance={new=function(class)
 local p={ClassName=class,Name=class,Position=UDim2.fromOffset(0,0),Size=UDim2.fromOffset(100,100),AnchorPoint=Vector2.new(0,0),Visible=true,ZIndex=1,BackgroundTransparency=0,Rotation=0}
 local object=setmetatable({_p=p},{__index=function(self,k)
  if methods[k] then return methods[k] end
  if signals[k] and not p[k] then p[k]=signal() end
  if k=='AbsoluteSize' then
   if class=='ScreenGui' then return Vector2.new(viewport.w,viewport.h-(p.ScreenInsets==Enum.ScreenInsets.None and 0 or 44)) end
   local s=p.Parent and p.Parent.AbsoluteSize or Vector2.new(viewport.w,viewport.h);return Vector2.new(s.X*p.Size.X.Scale+p.Size.X.Offset,s.Y*p.Size.Y.Scale+p.Size.Y.Offset)
  elseif k=='AbsolutePosition' then
   if class=='ScreenGui' then return Vector2.new(0,p.ScreenInsets==Enum.ScreenInsets.None and 0 or 44) end
   local pos=p.Parent and p.Parent.AbsolutePosition or Vector2.new(0,0);local size=p.Parent and p.Parent.AbsoluteSize or Vector2.new(viewport.w,viewport.h);local own=self.AbsoluteSize
   return Vector2.new(pos.X+p.Position.X.Scale*size.X+p.Position.X.Offset-own.X*p.AnchorPoint.X,pos.Y+p.Position.Y.Scale*size.Y+p.Position.Y.Offset-own.Y*p.AnchorPoint.Y)
  end
  return p[k]
 end,__newindex=function(_,k,v) p[k]=v end})
 all[#all+1]=object;return object
end}
local player=Instance.new('Player');local pg=Instance.new('PlayerGui');pg.Name='PlayerGui';pg.Parent=player
local screen=Instance.new('ScreenGui');screen.Name='MicioIncastro3';screen.Parent=pg
for _,name in ipairs({'Core','Journey','Layout','Scenery'}) do local m=Instance.new('ModuleScript');m.Name=name;m.Parent=screen end
script={Parent=screen}
local modules,gameObject={}
require=function(module)
 if not modules[module.Name] then
  modules[module.Name]=dofile(module.Name..'.lua')
  if module.Name=='Core' then local create=modules.Core.new;modules.Core.new=function(...) gameObject=create(...);return gameObject end end
 end
 return modules[module.Name]
end
local services={Players={LocalPlayer=player},UserInputService=Instance.new('UserInputService'),RunService=Instance.new('RunService'),GuiService=Instance.new('GuiService'),StarterGui={SetCoreGuiEnabled=function() end},SoundService=Instance.new('SoundService')}
services.UserInputService.TouchEnabled=true
workspace=Instance.new('Workspace');workspace.CurrentCamera={}
game={GetService=function(_,name) return assert(services[name],name) end}
local function byName(name) for i=#all,1,-1 do local v=all[i];if v.Name==name and not v.destroyed then return v end end;error('Missing object '..name) end
local function frames(n) for _=1,n do services.RunService.RenderStepped:Fire(1/60) end end
local function key(name) return {KeyCode=Enum.KeyCode[name],UserInputType=Enum.UserInputType.Keyboard,Position=Vector2.new(0,0)} end
local function press(name) local k=key(name);services.UserInputService.InputBegan:Fire(k,false);services.UserInputService.InputEnded:Fire(k) end
local function json(v)
 if type(v)=='string' then return '"'..v:gsub('\\','\\\\'):gsub('"','\\"'):gsub('\n','\\n'):gsub('\r','\\r'):gsub('\t','\\t')..'"' end
 if type(v)=='number' or type(v)=='boolean' then return tostring(v) end
 if v==nil then return 'null' end
 local out={};if #v>0 then for _,x in ipairs(v) do out[#out+1]=json(x) end;return '['..table.concat(out,',')..']' end
 for k,x in pairs(v) do out[#out+1]=json(k)..':'..json(x) end;return '{'..table.concat(out,',')..'}'
end
local function export(name)
 local dir=os.getenv('MICIO_PREVIEW_DIR');if not dir then return end
 local index,nodes={},{}
 for _,o in ipairs(all) do if not o.destroyed then index[o]=#nodes+1;nodes[#nodes+1]={};end end
 for o,i in pairs(index) do
  local n={class=o.ClassName,name=o.Name,parent=index[o.Parent] or 0,position=o.Position,size=o.Size,anchor=o.AnchorPoint,visible=o.Visible,z=o.ZIndex or 1,rotation=o.Rotation or 0,background=o.BackgroundColor3,alpha=1-(o.BackgroundTransparency or 0),text=o.Text,textSize=o.TextSize,textColor=o.TextColor3,align=o.TextXAlignment and o.TextXAlignment.Name,radius=o.CornerRadius,stroke=o.Color,thickness=o.Thickness,transparency=o.Transparency,gradient=o.Color,displayOrder=o.DisplayOrder,inset=o.ClassName=='ScreenGui' and (o.ScreenInsets==Enum.ScreenInsets.None and 0 or 44) or nil,clip=o.ClipsDescendants}
  nodes[i]=n
 end
 local f=assert(io.open(dir..'/'..name..'.json','w'));f:write(json({width=viewport.w,height=viewport.h,nodes=nodes}));f:close()
end
dofile('Micio3.client.lua')
frames(2);assert(byName('FullScreenGame').AbsoluteSize.X==390)
assert(pg.ScreenOrientation==Enum.ScreenOrientation.Portrait)
assert(byName('Micio3Scenery').ScreenInsets==Enum.ScreenInsets.None)
assert(screen.ScreenInsets==Enum.ScreenInsets.CoreUISafeInsets)
byName('Secondary').Activated:Fire();frames(2);assert(gameObject.mode=='chill' and not byName('Modal').Visible)
local q=gameObject.active.q;byName('Left').Activated:Fire();assert(gameObject.active.q==q-1);press('Right');assert(gameObject.active.q==q)
local r=gameObject.active.r;frames(90);assert(gameObject.active.r==r,'relax does not auto-drop')
byName('Drop').Activated:Fire();assert(gameObject.moves==1)
-- Pointer gestures are ignored outside the board; cancellation never drops or rotates.
local touch={KeyCode=Enum.KeyCode.Unknown,UserInputType=Enum.UserInputType.Touch,Position=Vector2.new(140,230),UserInputState=Enum.UserInputState.Begin}
byName('Board').InputBegan:Fire(touch);touch.Position=Vector2.new(220,240);services.UserInputService.InputChanged:Fire(touch);assert(gameObject.active.q>4)
local moves=gameObject.moves;touch.Position=Vector2.new(220,370);touch.UserInputState=Enum.UserInputState.Cancel;services.UserInputService.InputEnded:Fire(touch);assert(gameObject.moves==moves)
-- First spawn, assisted shooting and no held/automatic fire.
gameObject:appearMosquito();frames(12);assert(byName('Shoot').Visible and byName('Mosquito').Visible)
local hp=gameObject.mosquito.hp;byName('Shoot').Activated:Fire();assert(gameObject.mosquito.hp==hp-1);frames(30);assert(gameObject.mosquito.hp==hp-1);press('X');assert(gameObject.mosquito.hp==hp-2)
frames(30);export('roblox-phone')
byName('Pause').Activated:Fire();local age=gameObject.mosquito.age;frames(60);assert(gameObject.mosquito.age==age);assert(not byName('Micio3Mosquito').IsPlaying)
byName('Primary').Activated:Fire();frames(3);assert(byName('Micio3Mosquito').IsPlaying)
byName('Arsenal').Activated:Fire();assert(byName('Modal').Visible);byName('Audio').Activated:Fire();frames(2);assert(not byName('Micio3Mosquito').IsPlaying);byName('Primary').Activated:Fire();frames(3);assert(not byName('Micio3Mosquito').IsPlaying)
-- Credits and unlocks are presented only in the completed-level shop.
gameObject:addScore(1000);for _,c in ipairs(gameObject:targets()) do gameObject.stamps[c.y*9+c.x]=0 end;gameObject:checkGoal();frames(3)
assert(byName('Title').Text=='SAGOMA COMPLETA!');byName('Weapon_dart').Activated:Fire();assert(gameObject.weapon=='dart');local coins=gameObject.coins;byName('Primary').Activated:Fire();frames(2);assert(gameObject.stage==1 and gameObject.coins==coins)
-- Resize without resetting progress or rebuilding scenery in each frame.
for _,size in ipairs({{320,568},{430,932},{844,390},{1440,900}}) do viewport.w,viewport.h=size[1],size[2];byName('FullScreenGame'):GetPropertyChangedSignal('AbsoluteSize'):Fire();frames(2)
 local root=byName('FullScreenGame');assert(root.AbsoluteSize.X==size[1]);assert(byName('Left').AbsoluteSize.X>=44);assert(gameObject.stage==1)
end
export('roblox-desktop')
local count=#all;frames(400);assert(#all==count,'no GUI allocation in animation frames')
-- Exactly one destination tree, a bounded amount of native scenery for every world.
local art=require(byName('Scenery'));local back=byName('WorldBackground')
for world=1,18 do art.create(back,world);assert(#back:GetChildren()==1);assert(#back:GetDescendants()<650,'background object budget') end
services.GuiService.MenuOpened:Fire();assert(byName('Title').Text=='PAUSA')
print('GUI mock: full-screen sizing, safe areas, touch/cancel, X/SPARA, no auto-fire, pause/audio, shop, resize, 18 scene budgets and allocation stability passed.')
