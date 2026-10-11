(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MicioDraw=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const PALETTES=Object.freeze({pastel:Object.freeze(['#8fe3bd','#c5adff','#ffb18d','#88cfff']),neon:Object.freeze(['#b1ff3b','#fc66ed','#ffdc4f','#4aeaff'])});
  const COLORS=PALETTES.pastel.slice();let palette='pastel';
  function setPalette(name){palette=name==='neon'?'neon':'pastel';PALETTES[palette].forEach((color,i)=>{COLORS[i]=color;});return palette;}
  function hex(ctx,x,y,r){ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
  function kitten(ctx,x,y,r,color,ghost=false){
    ctx.save();ctx.translate(x,y);
    hex(ctx,0,0,r*.92);ctx.fillStyle=ghost?'#ffffff07':COLORS[color];ctx.fill();ctx.lineWidth=ghost?1.6:1.4;ctx.strokeStyle=ghost?COLORS[color]:'#f2fbffd9';if(ghost)ctx.setLineDash([3,4]);ctx.stroke();
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
  function geometry(w,h){const r=Math.min((w-28)/14,(h-28)/(12.5*Math.sqrt(3)));const bw=14*r,bh=12.5*Math.sqrt(3)*r;return {r,x:(w-bw)/2+r,y:(h-bh)/2+Math.sqrt(3)*r/2};}
  function point(g,x,y){return {x:g.x+x*g.r*1.5,y:g.y+(y+(x%2)*.5)*g.r*Math.sqrt(3)};}
  function pollen(ctx,x,y,r){
    ctx.save();hex(ctx,x,y,r*.94);ctx.fillStyle='#a85f23';ctx.fill();ctx.strokeStyle='#ffe598';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#ffcb52';for(const [dx,dy,s]of [[-.3,-.3,.22],[.25,-.13,.3],[-.1,.28,.26]]){ctx.beginPath();ctx.arc(x+dx*r,y+dy*r,r*s,0,Math.PI*2);ctx.fill();}
    ctx.strokeStyle='#5b3319';ctx.lineWidth=Math.max(1.5,r*.09);ctx.beginPath();ctx.moveTo(x-r*.45,y+r*.02);ctx.lineTo(x+r*.35,y+r*.5);ctx.stroke();ctx.restore();
  }
  function beePosition(w,h,bee,reduced=false){
    const size=Math.min(96,Math.max(62,w*.22),Math.max(44,h*.65)),t=reduced?0:bee.age/1000,phase=bee.phase;
    return {size,x:size/2+(w-size)*(.5+.42*Math.sin(t*.85+phase)),y:size*.48+Math.max(0,h-size)*(.19+.14*Math.sin(t*1.25+phase*.6)),tilt:reduced?0:Math.sin(t*1.7)*7};
  }
  function board(ctx,w,h,game,particles=[],ui={}){
    ctx.clearRect(0,0,w,h);const g=geometry(w,h);
    for(let y=0;y<12;y++)for(let x=0;x<9;x++){const p=point(g,x,y);hex(ctx,p.x,p.y,g.r*.93);ctx.fillStyle=y<2?'#c5adff0c':'#ffffff05';ctx.fill();ctx.strokeStyle=palette==='neon'?'#b394ed38':'#a8bdd22b';ctx.lineWidth=.8;ctx.stroke();}
    for(const {x,y}of game.targets){
      const p=point(g,x,y),stamped=game.stamps[y*9+x]!==undefined;hex(ctx,p.x,p.y,g.r*.92);
      ctx.fillStyle=stamped?'#a5edc81a':'#ffd36913';ctx.fill();ctx.strokeStyle=stamped?'#a5edc8b3':'#ffdc83';ctx.lineWidth=stamped?1.3:2;ctx.stroke();
      if(game.board[y][x]===null){ctx.beginPath();if(stamped){ctx.moveTo(p.x-g.r*.15,p.y);ctx.lineTo(p.x-g.r*.02,p.y+g.r*.13);ctx.lineTo(p.x+g.r*.22,p.y-g.r*.15);ctx.strokeStyle='#a5edc8';ctx.lineWidth=1.6;ctx.stroke();}else{ctx.arc(p.x,p.y,g.r*.09,0,Math.PI*2);ctx.fillStyle='#ffdc83';ctx.fill();}}
    }
    for(let y=0;y<12;y++)for(let x=0;x<9;x++){const c=game.board[y][x];if(c!==null){const p=point(g,x,y);if(c===4)pollen(ctx,p.x,p.y,g.r*.9);else kitten(ctx,p.x,p.y,g.r*.9,c);}}
    if(!game.over){for(const c of game.cells(game.ghost())){const p=point(g,c.x,c.y);kitten(ctx,p.x,p.y,g.r*.88,c.color,true);}for(const c of game.cells()){const p=point(g,c.x,c.y);ctx.save();ctx.shadowColor=COLORS[c.color];ctx.shadowBlur=palette==='neon'?12:9;kitten(ctx,p.x,p.y,g.r*.9,c.color);ctx.restore();}}
    if(ui.wand){for(const [cell,color]of [[ui.source,'#ffb3df'],[ui.cursor,'#ffffff']])if(cell){const p=point(g,cell.x,cell.y);hex(ctx,p.x,p.y,g.r*.99);ctx.strokeStyle=color;ctx.lineWidth=3;ctx.stroke();}}
    for(const p of particles){ctx.globalAlpha=p.life;ctx.fillStyle=p.color===4?'#ffce62':COLORS[p.color];ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    if(game.bee){ctx.save();ctx.translate(w/2,h-12);ctx.fillStyle='#bdf9f5';ctx.strokeStyle='#48c9e9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-13,9);ctx.lineTo(-9,-6);ctx.lineTo(0,-13);ctx.lineTo(9,-6);ctx.lineTo(13,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    for(const fx of ui.effects||[]){
      const progress=Math.min(1,fx.age/fx.duration);ctx.save();
      if(fx.kind==='pollen'){
        if(game.board[fx.cell.y][fx.cell.x]===4){const end=point(g,fx.cell.x,fx.cell.y);pollen(ctx,fx.x+(end.x-fx.x)*progress,fx.y+(end.y-fx.y)*progress*progress,g.r*.8);}
      }else{
        const travel=Math.min(1,progress/.65),x=fx.fromX+(fx.x-fx.fromX)*travel,y=fx.fromY+(fx.y-fx.fromY)*travel;
        ctx.strokeStyle='#7efbff';ctx.lineWidth=2;ctx.globalAlpha=(1-progress)*.8;ctx.beginPath();ctx.moveTo(fx.fromX,fx.fromY);ctx.lineTo(x,y);ctx.stroke();
        ctx.globalAlpha=1-progress*.5;ctx.fillStyle='#e6ffff';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();ctx.stroke();
        if(travel===1){ctx.strokeStyle=fx.hit?'#ffdf70':'#b4e6f4';ctx.globalAlpha=(1-progress)*2;ctx.beginPath();ctx.arc(fx.x,fx.y,8+(progress-.65)*60,0,Math.PI*2);ctx.stroke();}
      }ctx.restore();
    }
    return g;
  }
  function hit(w,h,x,y){const g=geometry(w,h);let best=null,distance=Infinity;for(let yy=0;yy<12;yy++)for(let xx=0;xx<9;xx++){const p=point(g,xx,yy),d=Math.hypot(p.x-x,p.y-y);if(d<distance){distance=d;best={x:xx,y:yy};}}return distance<=g.r?best:null;}
  function objective(ctx,w,h,game){
    ctx.clearRect(0,0,w,h);
    if(!game.targets.length){kitten(ctx,w*.35,h*.53,h*.24,0);kitten(ctx,w*.64,h*.53,h*.24,2);return;}
    const points=game.targets.map(c=>({...c,px:c.x*1.5,py:(c.y+(c.x%2)*.5)*Math.sqrt(3)}));
    const minX=Math.min(...points.map(c=>c.px)),maxX=Math.max(...points.map(c=>c.px)),minY=Math.min(...points.map(c=>c.py)),maxY=Math.max(...points.map(c=>c.py));
    const r=Math.min((w-8)/(maxX-minX+2),(h-6)/(maxY-minY+1.8));
    for(const c of points){hex(ctx,w/2+(c.px-(minX+maxX)/2)*r,h/2+(c.py-(minY+maxY)/2)*r,r*.88);const stamped=game.stamps[c.y*9+c.x]!==undefined;ctx.fillStyle=stamped?'#a5edc8':'#473e2c';ctx.fill();ctx.strokeStyle=stamped?'#dcfff0':'#ffd67d';ctx.lineWidth=.8;ctx.stroke();}
  }
  function preview(ctx,w,h,pieces){ctx.clearRect(0,0,w,h);pieces.forEach((p,i)=>{const raw=p.cells.map(([q,r])=>({x:q*1.5,y:(r+q/2)*Math.sqrt(3)}));const minX=Math.min(...raw.map(c=>c.x)),maxX=Math.max(...raw.map(c=>c.x)),minY=Math.min(...raw.map(c=>c.y)),maxY=Math.max(...raw.map(c=>c.y));const size=Math.min(16,(w/pieces.length-16)/(maxX-minX+2),(h-12)/(maxY-minY+1.74));const ox=(i+.5)*w/pieces.length-(minX+maxX)*size/2,oy=h/2-(minY+maxY)*size/2;raw.forEach(c=>kitten(ctx,ox+c.x*size,oy+c.y*size,size*.9,p.color));});}
  return {COLORS,PALETTES,setPalette,hex,kitten,pollen,beePosition,geometry,point,board,preview,objective,hit};
});
