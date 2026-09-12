-- A small Roblox API mock catches startup/input regressions; it is not the engine.
math.atan2=math.atan2 or math.atan
local function signal()
    return {listeners={},Connect=function(self,fn) table.insert(self.listeners,fn) end,Fire=function(self,...) for _,fn in ipairs(self.listeners) do fn(...) end end}
end
Enum=setmetatable({},{__index=function(t,k)local v=setmetatable({},{__index=function(a,b) rawset(a,b,k..'.'..b);return a[b] end});rawset(t,k,v);return v end})
Color3={fromRGB=function(r,g,b) return {r=r,g=g,b=b} end}
ColorSequence={new=function(a,b)return {a,b}end}
UDim={new=function(s,o)return {Scale=s,Offset=o}end}
UDim2={fromOffset=function(x,y)return {X=UDim.new(0,x),Y=UDim.new(0,y)}end,fromScale=function(x,y)return {X=UDim.new(x,0),Y=UDim.new(y,0)}end,new=function(xs,xo,ys,yo)return {X=UDim.new(xs,xo),Y=UDim.new(ys,yo)}end}
Vector2={new=function(x,y)return {X=x,Y=y,Magnitude=math.sqrt(x*x+y*y)}end}
local cf=setmetatable({},{__mul=function()return {}end});CFrame={new=function()return cf end,Angles=function()return cf end}
task={defer=function(fn)fn()end}
local all={};local methods={};local signalNames={Activated=true,InputBegan=true,InputChanged=true,InputEnded=true,WindowFocusReleased=true,CharacterAdded=true,RenderStepped=true,MenuOpened=true}
function methods:GetDescendants() local out={};for _,v in ipairs(all) do local p=v.Parent;while p do if p==self then table.insert(out,v);break end;p=p.Parent end end;return out end
function methods:GetChildren()local out={};for _,v in ipairs(all)do if v.Parent==self then table.insert(out,v)end end;return out end
function methods:FindFirstChild(name)for _,v in ipairs(self:GetChildren())do if v.Name==name then return v end end end
function methods:FindFirstChildOfClass(name)for _,v in ipairs(self:GetChildren())do if v.ClassName==name then return v end end end
function methods:WaitForChild(name)return assert(self:FindFirstChild(name),name)end
function methods:IsA(name)return self.ClassName==name end
function methods:Destroy()self.Parent=nil;self.destroyed=true end
Instance={new=function(class)
    local p={ClassName=class,Name=class,Position=UDim2.fromOffset(0,0),Size=UDim2.fromOffset(0,0),Visible=true,AbsolutePosition=Vector2.new(0,0),AbsoluteSize=Vector2.new(1100,750)}
    local object=setmetatable({_p=p},{__index=function(self,k)if methods[k]then return methods[k]end;if signalNames[k]and not p[k]then p[k]=signal()end;return p[k]end,__newindex=function(self,k,v)p[k]=v end})
    table.insert(all,object);return object
end}
local screen=Instance.new('ScreenGui');local module=Instance.new('ModuleScript');module.Name='Core';module.Parent=screen
script={Parent=screen};local realRequire=require
require=function(arg)if arg==module then return dofile('roblox/Core.lua')else return realRequire(arg)end end
local user=Instance.new('Player');local services={Players={LocalPlayer=user},UserInputService=Instance.new('UserInputService'),RunService=Instance.new('RunService'),GuiService=Instance.new('GuiService'),StarterGui={SetCoreGuiEnabled=function()end}}
workspace={CurrentCamera={ViewportSize=Vector2.new(1440,1000)}};game={GetService=function(_,name)return assert(services[name],name)end}
dofile('roblox/TalpaBirbona.client.lua')
local function byText(s)for _,v in ipairs(all)do if v.Text==s and not v.destroyed then return v end end;error('Missing UI text: '..s)end
local function byName(s)for _,v in ipairs(all)do if v.Name==s and not v.destroyed then return v end end;error('Missing UI object: '..s)end
local function frames(n)for _=1,n do services.RunService.RenderStepped:Fire(1/60)end end
frames(2);byText('INIZIA A SCAVARE  →').Activated:Fire();frames(2)
local mole=byName('TalpaRight');local x=mole.Position.X.Offset;local input={KeyCode=Enum.KeyCode.Right}
services.UserInputService.InputBegan:Fire(input,false);frames(1);assert(mole.Position.X.Offset>x,'movement must start in first frame')
services.UserInputService.InputEnded:Fire(input);frames(1);x=mole.Position.X.Offset;frames(3);assert(mole.Position.X.Offset==x,'released key must stop movement')
local down={KeyCode=Enum.KeyCode.Down};services.UserInputService.InputBegan:Fire(down,false);frames(39);services.UserInputService.InputEnded:Fire(down)
services.UserInputService.InputBegan:Fire(input,false);frames(25);services.UserInputService.InputEnded:Fire(input);frames(1);byText('PIANTE 1 / 4')
byText('II').Activated:Fire();byText('PAUSA MERENDA');x=mole.Position.X.Offset;services.UserInputService.InputBegan:Fire(input,false);frames(20);assert(mole.Position.X.Offset==x)
byText('TORNA A SCAVARE').Activated:Fire();frames(2)
-- Touch controls retain a press, then stop exactly when that pointer is released.
local touch={KeyCode='Unknown',UserInputType=Enum.UserInputType.Touch};byText('▶').InputBegan:Fire(touch);frames(2);assert(mole.Position.X.Offset>x)
services.UserInputService.InputEnded:Fire(touch);frames(1);x=mole.Position.X.Offset;frames(3);assert(mole.Position.X.Offset==x)
services.UserInputService.TouchEnabled=true;workspace.CurrentCamera.ViewportSize=Vector2.new(390,844);frames(32)
workspace.CurrentCamera.ViewportSize=Vector2.new(844,390);frames(32)
services.GuiService.MenuOpened:Fire();byText('PAUSA MERENDA')
print('Roblox client mock: startup, first-frame movement, release, root collection, pause, touch and responsive layouts passed ('..#all..' GUI objects).')
