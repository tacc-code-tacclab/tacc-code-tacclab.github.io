-- Fill the available screen: no fixed-width page, outer card, sidebar or letterbox.
local Layout={}
function Layout.compute(w,h)
 w=math.max(240,w);h=math.max(220,h)
 local top=h<450 and 48 or 58
 local bottom=56
 local out={w=w,h=h,top=top,bottom=bottom,boardX=5,boardY=top,boardW=w-10,boardH=h-top-bottom}
 out.dx=out.boardW/(8+4/3);out.dy=out.boardH/12.5
 out.cellW=out.dx*4/3;out.cellH=out.dy
 out.font=h<450 and 11 or 13
 out.buttonGap=5;out.buttonW=(w-14-5*5)/6;out.buttonH=46
 out.buttonY=h-50
 return out
end
function Layout.cell(l,x,y) return l.boardX+l.cellW/2+x*l.dx,l.boardY+l.cellH/2+(y+(x%2)*.5)*l.dy end
function Layout.column(l,x) return math.max(0,math.min(8,math.floor((x-l.boardX-l.cellW/2)/l.dx+.5))) end
function Layout.buttons(l)
 local buttons={};for i=1,6 do buttons[i]={x=7+(i-1)*(l.buttonW+5),y=l.buttonY,w=l.buttonW,h=l.buttonH} end;return buttons
end
return Layout
