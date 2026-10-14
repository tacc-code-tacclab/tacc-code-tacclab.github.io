(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine.js'));else root.FlyingVelvetDraw=factory(root.FlyingVelvet);})(typeof globalThis!=='undefined'?globalThis:this,function(Engine){
  'use strict';
  const TAU=Math.PI*2,THEMES=[
    ['#12042f','#ff2fc7','#18efff','#ffe85b','#7bff6a'],['#061b38','#ff572f','#46ffe0','#e5ff45','#ad6bff'],['#29051c','#ffec57','#ff3e7d','#44f3ff','#ff8a38'],['#071a18','#7cffd4','#d747ff','#ffea73','#ff456e'],['#170523','#ff4fd8','#ffab2f','#55f5ff','#d8ff50']
  ];
  const hash=(a,b,c=0)=>{let n=(a*374761393+b*668265263+c*1442695041)|0;n=(n^(n>>>13))*1274126177;return((n^(n>>>16))>>>0)/4294967295;};
  function roundRect(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):(ctx.rect(x,y,w,h));}
  function setup(canvas,ctx){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,matchMedia('(pointer:coarse)').matches?1.5:2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);return {w:r.width,h:r.height};}
  function tent(ctx,w,h,act,time){
    const colors=THEMES[act%THEMES.length],grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,colors[0]);grad.addColorStop(.58,'#190b2f');grad.addColorStop(1,'#050510');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    const panels=9,span=w/panels;for(let i=0;i<panels;i++){ctx.beginPath();ctx.moveTo(w/2,-20);ctx.lineTo(i*span,h*.67);ctx.lineTo((i+1)*span,h*.67);ctx.closePath();ctx.fillStyle=i%2?colors[1]+'20':colors[2]+'18';ctx.fill();}
    ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<3;i++){const x=w*(.2+i*.3)+Math.sin(time*.2+i)*30,g=ctx.createRadialGradient(x,h*.25,5,x,h*.25,h*.55);g.addColorStop(0,colors[2]+'45');g.addColorStop(1,'#0000');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}ctx.restore();
    ctx.strokeStyle=colors[3]+'aa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,h*.67);ctx.quadraticCurveTo(w/2,h*.59,w,h*.67);ctx.stroke();
  }
  function crowd(ctx,w,h,cameraX,act,time,cheer=0){
    const colors=THEMES[act%THEMES.length],top=h*.66,rowH=Math.max(24,h*.052),cols=Math.ceil(w/25)+3;
    ctx.fillStyle='#080715';ctx.fillRect(0,top,w,h-top);
    for(let row=0;row<4;row++)for(let i=-1;i<cols;i++){
      const seed=Math.floor(cameraX/180)*10000+row*100+i,x=i*25-(cameraX*.08+row*11)%25,y=top+row*rowH+13,bob=Math.sin(time*(3+cheer*8)+seed)*(2+cheer*6);
      ctx.fillStyle=colors[2+(seed%3+3)%3];ctx.beginPath();ctx.arc(x,y+bob,5+hash(seed,1)*2,0,TAU);ctx.fill();ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y+7+bob);ctx.lineTo(x,y+19);if(hash(seed,2)>.72-cheer*.5){ctx.moveTo(x,y+12);ctx.lineTo(x-7,y+2+Math.sin(time*5+seed)*4);ctx.moveTo(x,y+12);ctx.lineTo(x+7,y+2-Math.sin(time*5+seed)*4);}ctx.stroke();
    }
    ctx.fillStyle='#ffdf7014';for(let row=0;row<4;row++)ctx.fillRect(0,top+row*rowH+rowH-3,w,2);
  }
  function tiger(ctx,x,y,s,phase,colors){
    ctx.save();ctx.translate(x,y+Math.sin(phase)*3);ctx.scale(s,s);ctx.fillStyle='#ff9b2f';ctx.strokeStyle='#210b24';ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(0,0,25,15,0,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(20,-10,12,0,TAU);ctx.fill();ctx.stroke();for(const ex of [15,25]){ctx.fillStyle='#d8ff50';ctx.beginPath();ctx.arc(ex,-12,2.5,0,TAU);ctx.fill();}ctx.fillStyle='#210b24';ctx.beginPath();ctx.arc(29,-7,3,0,TAU);ctx.fill();ctx.strokeStyle='#210b24';ctx.lineWidth=3;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(k*10,-13);ctx.lineTo(k*7,-2);ctx.stroke();}ctx.beginPath();ctx.moveTo(-24,0);ctx.quadraticCurveTo(-40,-18,-35,-30);ctx.stroke();for(const lx of [-15,2,14]){ctx.beginPath();ctx.moveTo(lx,9);ctx.lineTo(lx-3,22+Math.sin(phase+lx)*3);ctx.stroke();}ctx.restore();
  }
  function trapeze(ctx,trap,p,active,target,colors){
    const wild=trap.kind==='wild',elastic=trap.kind==='elastic',double=trap.kind==='double';ctx.strokeStyle=target?colors[3]:wild?colors[1]:'#d9f8ff';ctx.lineWidth=target?3.5:2;ctx.shadowColor=target?colors[3]:wild?colors[1]:'#fff';ctx.shadowBlur=target||wild?14:5;if(elastic)ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(trap.anchorX,trap.anchorY);ctx.lineTo(p.x-trap.bar/2,p.y);ctx.moveTo(trap.anchorX,trap.anchorY);ctx.lineTo(p.x+trap.bar/2,p.y);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p.x-trap.bar/2,p.y);ctx.lineTo(p.x+trap.bar/2,p.y);if(double){ctx.moveTo(p.x-trap.bar*.42,p.y+17);ctx.lineTo(p.x+trap.bar*.42,p.y+17);}ctx.stroke();if(target){ctx.fillStyle=colors[3];ctx.font='800 13px system-ui';ctx.textAlign='center';ctx.fillText(trap.kind==='classic'?'GRAB!':trap.kind.toUpperCase()+'!',p.x,p.y-15);}if(active){ctx.strokeStyle=colors[2]+'88';ctx.lineWidth=2;ctx.beginPath();ctx.arc(trap.anchorX,trap.anchorY,10,0,TAU);ctx.stroke();}
  }
  function acrobat(ctx,p,colors,time){
    const handX=p.x+Math.sin(p.angle)*44,handY=p.y-Math.cos(p.angle)*44;
    ctx.save();ctx.globalCompositeOperation='lighter';for(const t of p.trail){ctx.globalAlpha=Math.max(0,t.life)*.2;ctx.fillStyle=colors[2];ctx.beginPath();ctx.arc(t.x,t.y,6,0,TAU);ctx.fill();}ctx.restore();
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.shadowColor=colors[2];ctx.shadowBlur=13;ctx.lineCap='round';ctx.strokeStyle='#e9fcff';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(0,-39);ctx.stroke();ctx.strokeStyle=colors[2];ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,-29);ctx.lineTo(-17,-41);ctx.lineTo(-7,-48);ctx.moveTo(0,-29);ctx.lineTo(17,-41);ctx.lineTo(7,-48);ctx.moveTo(0,-4);ctx.lineTo(-15,22);ctx.moveTo(0,-4);ctx.lineTo(17,20);ctx.stroke();ctx.fillStyle='#ffe0c6';ctx.beginPath();ctx.arc(0,-49,9,0,TAU);ctx.fill();ctx.fillStyle=colors[1];ctx.beginPath();ctx.arc(0,-52,9,Math.PI,TAU);ctx.fill();ctx.fillStyle=colors[3];roundRect(ctx,-9,-27,18,27,6);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-3,-50,1.3,0,TAU);ctx.arc(3,-50,1.3,0,TAU);ctx.fill();ctx.restore();
    return {x:handX,y:handY};
  }
  function render(ctx,w,h,game,ui={}){
    const logicalH=720,scale=h/logicalH,viewW=w/scale,cam=game.cameraX,act=Math.floor(game.catches/10),colors=THEMES[act%THEMES.length];ctx.save();ctx.scale(scale,scale);tent(ctx,viewW,logicalH,act,game.time);crowd(ctx,viewW,logicalH,cam,act,game.time,ui.cheer||0);
    ctx.save();ctx.translate(-cam,0);const left=cam-100,right=cam+viewW+150;
    for(let i=0;i<game.trapezes.length;i++){const t=game.trapezes[i];if(t.anchorX<left||t.anchorX>right)continue;trapeze(ctx,t,game.trapPose(t),i===game.player.attached,i===game.player.attached+1,colors);}
    const d=Engine.difficulty(game.catches);for(let i=0;i<d.tigers;i++){const x=cam+viewW*(.12+i/Math.max(1,d.tigers-1)*.75)+(i%2)*30;tiger(ctx,x,635,.85+hash(act,i)*.25,game.time*4+i,colors);}
    const hand=acrobat(ctx,game.player,colors,game.time),target=game.target&&game.trapPose(game.target);if(game.state==='flight'&&target){ctx.setLineDash([6,10]);ctx.strokeStyle=colors[3]+'70';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hand.x,hand.y);ctx.lineTo(target.x,target.y);ctx.stroke();ctx.setLineDash([]);}
    ctx.restore();
    if(ui.flash>0){ctx.globalAlpha=ui.flash;ctx.fillStyle=ui.flashColor||'#fff';ctx.fillRect(0,0,viewW,logicalH);}
    ctx.restore();
  }
  return {setup,render,THEMES,hash};
});
