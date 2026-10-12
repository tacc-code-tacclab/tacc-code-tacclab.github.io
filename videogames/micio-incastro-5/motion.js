(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Micio5Motion=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const copy=p=>({...p,cells:p.cells.map(c=>c.slice())});
  const lerp=(a,b,t)=>a+(b-a)*t;
  // Rendering only: collision, rotation and confirmation always use the engine.
  class PieceMotion{
    constructor(reduced=false){this.reduced=reduced;this.reset();}
    reset(){this.target=null;this.from=null;this.key=null;this.start=0;this.duration=0;}
    busy(now){return !!this.target&&now<this.start+this.duration;}
    sample(now){
      if(!this.target)return null;
      if(!this.busy(now))return copy(this.target);
      const t=Math.max(0,Math.min(1,(now-this.start)/this.duration)),ease=1-(1-t)**3,a=this.from,b=this.target;
      return {...b,q:lerp(a.q,b.q,ease),r:lerp(a.r,b.r,ease),cells:b.cells.map(([q,r],i)=>{
        const [aq,ar]=a.cells[i],ax=aq*1.5,ay=(ar+aq/2)*Math.sqrt(3),bx=q*1.5,by=(r+q/2)*Math.sqrt(3);
        const angleA=Math.atan2(ay,ax),angleB=Math.atan2(by,bx),delta=Math.atan2(Math.sin(angleB-angleA),Math.cos(angleB-angleA));
        const radius=lerp(Math.hypot(ax,ay),Math.hypot(bx,by),ease),angle=angleA+delta*ease;
        const x=radius*Math.cos(angle),y=radius*Math.sin(angle),vq=x/1.5;
        return [vq,y/Math.sqrt(3)-vq/2];
      })};
    }
    set(piece,key,now,direct=false){
      if(!piece){this.reset();return;}
      if(!this.target||this.key!==key||this.target.cells.length!==piece.cells.length||this.reduced){
        this.target=copy(piece);this.from=copy(piece);this.key=key;this.start=now;this.duration=0;return;
      }
      const changedCells=piece.cells.some((c,i)=>c[0]!==this.target.cells[i][0]||c[1]!==this.target.cells[i][1]);
      const moved=piece.q!==this.target.q||piece.r!==this.target.r;
      if(!changedCells&&!moved)return;
      const current=this.sample(now);
      // Pointer movement follows 1:1, even while a rotation finishes. No lagging
      // spring, accumulating event queue or repeated restart of the rotation.
      if(direct&&!changedCells){
        this.from.q=this.target.q=piece.q;this.from.r=this.target.r=piece.r;return;
      }
      this.from=current;this.target=copy(piece);this.start=now;this.duration=changedCells?120:85;
      if(direct){this.from.q=piece.q;this.from.r=piece.r;}
    }
  }
  return {PieceMotion};
});
