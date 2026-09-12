/* Screen-independent touch targeting, also used by the input regression tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TalpaControls=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function pickTarget(plants,point,{width=1100,height=750,assist=false,dragging=false}={}) {
    const sx=width/1100,sy=height/750,cell=36,gx=46,gy=210;
    const candidates=[];
    if(!dragging)plants.forEach((plant,plantIndex)=>{
      if(plant.eaten)return;
      const x=gx+plant.x*cell,y=gy+plant.y*cell;
      if(point.y<gy&&point.y>=70){
        const tree=plant.kind>=3&&plant.kind<=5;
        const artWidth=tree?128:plant.kind===6?89:105;
        const distance=Math.abs(point.x-x)*sx;
        if(point.y>=gy-artWidth&&distance<=Math.max(assist?24:14,artWidth*sx*.55))candidates.push({plant,plantIndex,distance});
      }else if(point.y>=gy){
        const distance=Math.hypot((point.x-x)*sx,(point.y-y)*sy);
        if(distance<=(assist?24:13))candidates.push({plant,plantIndex,distance});
      }
    });
    candidates.sort((a,b)=>a.distance-b.distance);
    if(candidates.length){const {plant,plantIndex}=candidates[0];return {x:plant.x,y:plant.y,plantIndex};}
    if(point.y<gy&&!dragging)return null;
    return {x:clamp((point.x-gx)/cell,.5,27.5),y:clamp((point.y-gy)/cell,.5,13.5)};
  }
  function targetVector(player,target,speed,dt){
    if(!target)return {dx:0,dy:0,arrived:true};
    const dx=target.x-player.x,dy=target.y-player.y,distance=Math.hypot(dx,dy);
    if(distance<.04)return {dx:0,dy:0,arrived:true};
    const strength=Math.min(1,distance/(speed*Math.max(dt,.001)));
    return {dx:dx/distance*strength,dy:dy/distance*strength,arrived:false};
  }
  // Each finger has its own lifetime. A cancelled or lost pointer cannot keep moving.
  class DirectionState {
    constructor(){this.pointers=new Map();}
    press(id,dx,dy,button){this.pointers.set(id,{dx,dy,button});}
    release(id){this.pointers.delete(id);}
    clear(){this.pointers.clear();}
    vector(){let dx=0,dy=0;for(const p of this.pointers.values()){dx+=p.dx;dy+=p.dy;}return {dx,dy};}
    active(button){return [...this.pointers.values()].some(p=>p.button===button);}
  }
  return {pickTarget,targetVector,DirectionState};
});
