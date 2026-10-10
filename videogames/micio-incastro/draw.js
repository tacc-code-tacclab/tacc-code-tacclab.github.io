(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MicioDraw=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const COLORS=['#8fe3bd','#c5adff','#ffb18d','#88cfff'];
  function hex(ctx,x,y,r){ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
  function kitten(ctx,x,y,r,color,ghost=false){
    ctx.save();ctx.translate(x,y);
    hex(ctx,0,0,r*.92);ctx.fillStyle=ghost?'#ffffff07':COLORS[color];ctx.fill();ctx.lineWidth=ghost?1.4:1;ctx.strokeStyle=ghost?COLORS[color]:'#ffffff55';if(ghost)ctx.setLineDash([3,4]);ctx.stroke();
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
  function board(ctx,w,h,game,particles=[]){
    ctx.clearRect(0,0,w,h);const g=geometry(w,h);
    for(let y=0;y<12;y++)for(let x=0;x<9;x++){const p=point(g,x,y);hex(ctx,p.x,p.y,g.r*.93);ctx.fillStyle=y<2?'#c5adff08':'#ffffff04';ctx.fill();ctx.strokeStyle='#a8bdd214';ctx.lineWidth=.7;ctx.stroke();const c=game.board[y][x];if(c!==null)kitten(ctx,p.x,p.y,g.r*.9,c);}
    if(!game.over){for(const c of game.cells(game.ghost())){const p=point(g,c.x,c.y);kitten(ctx,p.x,p.y,g.r*.88,c.color,true);}for(const c of game.cells()){const p=point(g,c.x,c.y);ctx.save();ctx.shadowColor=COLORS[c.color];ctx.shadowBlur=9;kitten(ctx,p.x,p.y,g.r*.9,c.color);ctx.restore();}}
    for(const p of particles){ctx.globalAlpha=p.life;ctx.fillStyle=COLORS[p.color];ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;return g;
  }
  function preview(ctx,w,h,pieces){ctx.clearRect(0,0,w,h);pieces.forEach((p,i)=>{const raw=p.cells.map(([q,r])=>({x:q*1.5,y:(r+q/2)*Math.sqrt(3)}));const minX=Math.min(...raw.map(c=>c.x)),maxX=Math.max(...raw.map(c=>c.x)),minY=Math.min(...raw.map(c=>c.y)),maxY=Math.max(...raw.map(c=>c.y));const size=Math.min(16,(w/pieces.length-16)/(maxX-minX+2),(h-12)/(maxY-minY+1.74));const ox=(i+.5)*w/pieces.length-(minX+maxX)*size/2,oy=h/2-(minY+maxY)*size/2;raw.forEach(c=>kitten(ctx,ox+c.x*size,oy+c.y*size,size*.9,p.color));});}
  return {COLORS,hex,kitten,geometry,point,board,preview};
});
