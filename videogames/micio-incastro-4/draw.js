(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Micio4Draw=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const PALETTES=Object.freeze({pastel:Object.freeze(['#8fe3bd','#c5adff','#ffb18d','#88cfff']),neon:Object.freeze(['#b1ff3b','#fc66ed','#ffdc4f','#4aeaff'])});
  const COLORS=PALETTES.pastel.slice();let palette='pastel',placementMode=false,insetTop=0,insetBottom=0,insetLeft=0,insetRight=0;
  function configure(place,top=0,bottom=0,left=0,right=0){placementMode=place;insetTop=top;insetBottom=bottom;insetLeft=left;insetRight=right;}
  function tile(ctx,x,y,rx,ry){ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);hex(ctx,0,0,1);ctx.restore();}
  function setPalette(name){palette=name==='neon'?'neon':'pastel';PALETTES[palette].forEach((color,i)=>{COLORS[i]=color;});return palette;}
  function hex(ctx,x,y,r){ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
  function kitten(ctx,x,y,r,color,ghost=false,rx=r,ry=r){
    if(![r,rx,ry].every(n=>Number.isFinite(n)&&n>0))return;
    ctx.save();ctx.translate(x,y);
    tile(ctx,0,0,rx*.92,ry*.92);ctx.fillStyle=ghost?'#ffffff07':COLORS[color];ctx.fill();ctx.lineWidth=ghost?1.6:1.4;ctx.strokeStyle=ghost?COLORS[color]:'#f2fbffd9';if(ghost)ctx.setLineDash([3,4]);ctx.stroke();
    if(ghost){ctx.restore();return;}
    ctx.fillStyle='#ffffff24';ctx.beginPath();ctx.moveTo(-r*.8,-r*.2);ctx.lineTo(0,-r*.8);ctx.lineTo(r*.8,-r*.2);ctx.lineTo(0,0);ctx.closePath();ctx.fill();
    ctx.fillStyle=COLORS[color];ctx.strokeStyle='#26334844';ctx.lineWidth=r*.035;
    for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*r*.22,-r*.46);ctx.lineTo(s*r*.62,-r*.77);ctx.lineTo(s*r*.63,-r*.09);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#26334825';ctx.beginPath();ctx.moveTo(s*r*.37,-r*.41);ctx.lineTo(s*r*.54,-r*.59);ctx.lineTo(s*r*.54,-r*.24);ctx.fill();ctx.fillStyle=COLORS[color];}
    ctx.strokeStyle='#203247';ctx.fillStyle='#203247';ctx.lineWidth=Math.max(1.4,r*.065);ctx.lineCap='round';
    for(const s of [-1,1]){ctx.beginPath();if(color===2){ctx.arc(s*r*.28,-r*.07,r*.12,Math.PI*1.12,Math.PI*1.9);}else{ctx.moveTo(s*r*.28,-r*.15);ctx.lineTo(s*r*.28,-r*.03);}ctx.stroke();}
    ctx.beginPath();ctx.moveTo(-r*.07,r*.13);ctx.lineTo(r*.07,r*.13);ctx.lineTo(0,r*.2);ctx.closePath();ctx.fill();
    ctx.lineWidth=Math.max(1,r*.035);ctx.beginPath();ctx.moveTo(0,r*.2);ctx.quadraticCurveTo(-r*.08,r*.34,-r*.18,r*.24);ctx.moveTo(0,r*.2);ctx.quadraticCurveTo(r*.08,r*.34,r*.18,r*.24);ctx.stroke();
    for(const s of [-1,1])for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(s*r*.47,r*(.1+i*.12));ctx.lineTo(s*r*.69,r*(.06+i*.2));ctx.stroke();}
    // Distinct forehead marks accompany colour, making families recognisable.
    ctx.lineWidth=r*.05;ctx.beginPath();if(color===0){ctx.moveTo(-r*.1,-r*.42);ctx.lineTo(0,-r*.3);ctx.lineTo(r*.1,-r*.42);}else if(color===1){ctx.arc(0,-r*.37,r*.08,0,Math.PI*2);}else if(color===2){ctx.moveTo(-r*.12,-r*.38);ctx.lineTo(r*.12,-r*.38);}else{ctx.moveTo(0,-r*.47);ctx.lineTo(0,-r*.28);}ctx.stroke();ctx.restore();
  }
  function geometry(w,h){const top=(placementMode?(h<500?100:145):88)+insetTop,bottom=64+insetBottom;const rx=(w-insetLeft-insetRight-16)/14,ry=Math.max(30,h-top-bottom)/(12.5*Math.sqrt(3));return {rx,ry,r:Math.min(rx,ry),x:insetLeft+8+rx,y:top+Math.sqrt(3)*ry/2};}
  function point(g,x,y){return {x:g.x+x*g.rx*1.5,y:g.y+(y+(x%2)*.5)*g.ry*Math.sqrt(3)};}
  function clutter(ctx,x,y,r){
    ctx.save();hex(ctx,x,y,r*.94);ctx.fillStyle='#66326d';ctx.fill();ctx.strokeStyle='#efb2ff';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#c87ef1';for(const [dx,dy,s]of [[-.3,-.3,.22],[.25,-.13,.3],[-.1,.28,.26]]){ctx.beginPath();ctx.arc(x+dx*r,y+dy*r,r*s,0,Math.PI*2);ctx.fill();}
    ctx.strokeStyle='#361c51';ctx.lineWidth=Math.max(1.5,r*.09);ctx.beginPath();ctx.moveTo(x-r*.45,y+r*.02);ctx.lineTo(x+r*.35,y+r*.5);ctx.stroke();ctx.restore();
  }
  function mosquitoPosition(w,h,mosquito,reduced=false){
    const g=geometry(w,h),size=Math.min(90,Math.max(52,w*.16)),seconds=mosquito.age/1000,t=reduced?0:(Math.floor(seconds/3.2)*2.4+Math.min(2.4,seconds%3.2))*(mosquito.speed||.55),phase=mosquito.phase;
    const top=g.y+size*.5,bottom=Math.max(top,h-75-size*.5);
    return {size,x:insetLeft+size/2+(w-insetLeft-insetRight-size)*(.5+.45*Math.sin(t*1.65+phase)),y:top+(bottom-top)*(.46+.42*Math.sin(t*1.2+phase*.6)),tilt:reduced?0:Math.sin(t*3)*9};
  }
  function board(ctx,w,h,game,particles=[],ui={}){
    if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return null;
    ctx.clearRect(0,0,w,h);const g=geometry(w,h);
    for(let y=0;y<12;y++)for(let x=0;x<9;x++){const p=point(g,x,y);tile(ctx,p.x,p.y,g.rx*.93,g.ry*.93);ctx.fillStyle=y<2?'#c5adff0c':'#ffffff05';ctx.fill();ctx.strokeStyle=palette==='neon'?'#b394ed38':'#a8bdd22b';ctx.lineWidth=.8;ctx.stroke();}
    for(const {x,y}of game.targets){
      const p=point(g,x,y),stamped=game.isAnchored(x,y);tile(ctx,p.x,p.y,g.rx*.92,g.ry*.92);
      ctx.fillStyle=stamped?'#a5edc829':'#ffd3692a';ctx.fill();ctx.strokeStyle=stamped?'#a5edc8b3':'#ffdc83';ctx.lineWidth=stamped?1.3:2;ctx.stroke();
      if(game.board[y][x]===null){ctx.beginPath();if(stamped){ctx.moveTo(p.x-g.r*.15,p.y);ctx.lineTo(p.x-g.r*.02,p.y+g.r*.13);ctx.lineTo(p.x+g.r*.22,p.y-g.r*.15);ctx.strokeStyle='#a5edc8';ctx.lineWidth=1.6;ctx.stroke();}else{ctx.arc(p.x,p.y,g.r*.09,0,Math.PI*2);ctx.fillStyle='#ffdc83';ctx.fill();}}
    }
    for(let y=0;y<12;y++)for(let x=0;x<9;x++){const c=game.board[y][x];if(c!==null){const p=point(g,x,y);if(c===4)clutter(ctx,p.x,p.y,g.r*.9);else kitten(ctx,p.x,p.y,g.r*.9,c,false,g.rx*.9,g.ry*.9);}}
    if(!game.over&&game.mode!=='place'){for(const c of game.cells(game.ghost())){const p=point(g,c.x,c.y);kitten(ctx,p.x,p.y,g.r*.88,c.color,true,g.rx*.88,g.ry*.88);}for(const c of game.cells()){const p=point(g,c.x,c.y);kitten(ctx,p.x,p.y,g.r*.9,c.color,false,g.rx*.9,g.ry*.9);}}
    if(ui.placement){const valid=game.fits(ui.placement);for(const c of game.cells(ui.placement)){if(c.x<0||c.x>8||c.y<0||c.y>11)continue;const p=point(g,c.x,c.y);ctx.save();ctx.globalAlpha=.72;kitten(ctx,p.x,p.y,g.r*.9,c.color,false,g.rx*.9,g.ry*.9);ctx.restore();tile(ctx,p.x,p.y,g.rx*.96,g.ry*.96);ctx.strokeStyle=valid?'#c7ff87':'#ff647d';ctx.lineWidth=3;ctx.stroke();}}
    if(ui.wand){for(const [cell,color]of [[ui.source,'#ffb3df'],[ui.cursor,'#ffffff']])if(cell){const p=point(g,cell.x,cell.y);hex(ctx,p.x,p.y,g.r*.99);ctx.strokeStyle=color;ctx.lineWidth=3;ctx.stroke();}}
    for(const p of particles){ctx.globalAlpha=p.life;ctx.fillStyle=p.color===4?'#d7a0ff':COLORS[p.color];ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    if(game.mosquito){ctx.save();ctx.translate(w/2,h-12);ctx.fillStyle='#bdf9f5';ctx.strokeStyle='#48c9e9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-13,9);ctx.lineTo(-9,-6);ctx.lineTo(0,-13);ctx.lineTo(9,-6);ctx.lineTo(13,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    for(const fx of ui.effects||[]){
      const progress=Math.min(1,fx.age/fx.duration);ctx.save();
      if(fx.kind==='clutter'){
        if(game.board[fx.cell.y][fx.cell.x]===4){const end=point(g,fx.cell.x,fx.cell.y);clutter(ctx,fx.x+(end.x-fx.x)*progress,fx.y+(end.y-fx.y)*progress*progress,g.r*.8);}
      }else{
        const travel=Math.min(1,progress/.7),color=fx.color||'#dce6ed';
        let x=fx.fromX+(fx.x-fx.fromX)*travel,y=fx.fromY+(fx.y-fx.fromY)*travel;
        if(fx.weapon==='stone')y-=Math.sin(travel*Math.PI)*30;
        ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineCap='round';ctx.globalAlpha=1-progress*.6;
        if(fx.weapon==='laser'){
          ctx.lineWidth=5*(1-progress)+1;ctx.beginPath();ctx.moveTo(fx.fromX,fx.fromY);ctx.lineTo(fx.x,fx.y);ctx.stroke();
          ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();
        }else if(fx.weapon==='stone'){
          ctx.save();ctx.translate(x,y);ctx.rotate(progress*9);hex(ctx,0,0,6);ctx.fill();ctx.strokeStyle='#f3f7ff';ctx.lineWidth=1;ctx.stroke();ctx.restore();
        }else{
          const angle=Math.atan2(fx.y-fx.fromY,fx.x-fx.fromX),length=fx.weapon==='spear'?28:fx.weapon==='bullet'?14:19;
          ctx.lineWidth=fx.weapon==='bullet'?3:2;ctx.beginPath();ctx.moveTo(x-Math.cos(angle)*length,y-Math.sin(angle)*length);ctx.lineTo(x,y);ctx.stroke();
          if(fx.weapon!=='bullet'){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-8,-4);ctx.lineTo(-8,4);ctx.closePath();ctx.fill();ctx.restore();}
        }
        if(travel===1||fx.weapon==='laser'){ctx.strokeStyle=fx.hit?color:'#b4e6f4';ctx.lineWidth=2;ctx.globalAlpha=Math.max(0,(1-progress)*1.5);ctx.beginPath();ctx.arc(fx.x,fx.y,6+progress*25,0,Math.PI*2);ctx.stroke();}
      }ctx.restore();
    }
    return g;
  }
  function hit(w,h,x,y){const g=geometry(w,h);let best=null,distance=Infinity;for(let yy=0;yy<12;yy++)for(let xx=0;xx<9;xx++){const p=point(g,xx,yy),d=Math.hypot((p.x-x)/g.rx,(p.y-y)/g.ry);if(d<distance){distance=d;best={x:xx,y:yy};}}return distance<=1?best:null;}
  function objective(ctx,w,h,game){
    if(!Number.isFinite(w)||!Number.isFinite(h)||w<=8||h<=6)return;
    ctx.clearRect(0,0,w,h);
    if(!game.targets.length){kitten(ctx,w*.35,h*.53,h*.24,0);kitten(ctx,w*.64,h*.53,h*.24,2);return;}
    const points=game.targets.map(c=>({...c,px:c.x*1.5,py:(c.y+(c.x%2)*.5)*Math.sqrt(3)}));
    const minX=Math.min(...points.map(c=>c.px)),maxX=Math.max(...points.map(c=>c.px)),minY=Math.min(...points.map(c=>c.py)),maxY=Math.max(...points.map(c=>c.py));
    const r=Math.min((w-8)/(maxX-minX+2),(h-6)/(maxY-minY+1.8));
    for(const c of points){hex(ctx,w/2+(c.px-(minX+maxX)/2)*r,h/2+(c.py-(minY+maxY)/2)*r,r*.88);const stamped=game.isAnchored(c.x,c.y);ctx.fillStyle=stamped?'#a5edc8':'#473e2c';ctx.fill();ctx.strokeStyle=stamped?'#dcfff0':'#ffd67d';ctx.lineWidth=.8;ctx.stroke();}
  }
  function preview(ctx,w,h,pieces){
    // display:none canvases have a zero-sized DOM rectangle. Never derive a
    // negative kitten radius: browser Canvas.arc throws before the game boots.
    if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0||!pieces.length)return;
    ctx.clearRect(0,0,w,h);pieces.forEach((p,i)=>{const raw=p.cells.map(([q,r])=>({x:q*1.5,y:(r+q/2)*Math.sqrt(3)}));const minX=Math.min(...raw.map(c=>c.x)),maxX=Math.max(...raw.map(c=>c.x)),minY=Math.min(...raw.map(c=>c.y)),maxY=Math.max(...raw.map(c=>c.y));const size=Math.min(16,(w/pieces.length-16)/(maxX-minX+2),(h-12)/(maxY-minY+1.74));if(size<=0)return;const ox=(i+.5)*w/pieces.length-(minX+maxX)*size/2,oy=h/2-(minY+maxY)*size/2;raw.forEach(c=>kitten(ctx,ox+c.x*size,oy+c.y*size,size*.9,p.color));});}
  return {configure,COLORS,PALETTES,setPalette,hex,kitten,clutter,mosquitoPosition,geometry,point,board,preview,objective,hit};
});
