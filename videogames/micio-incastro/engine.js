(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Micio=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const COLS=9, ROWS=12, MATCH=6, DURATION=180000;
  const SHAPES=[[[0,0],[0,1],[0,2]],[[0,0],[1,0],[0,1]],[[0,0],[1,-1],[2,-1]],[[0,0],[-1,0],[1,0]],[[0,0],[0,1]]];
  const DIRS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  const toGrid=(q,r)=>[q,r+Math.floor(q/2)];
  const toAxial=(x,y)=>[x,y-Math.floor(x/2)];
  const rotate=cells=>cells.map(([q,r])=>[-r||0,q+r||0]);
  class Game {
    constructor(random=Math.random){this.random=random;this.reset('flow');}
    reset(mode='flow'){this.mode=mode==='chill'?'chill':'flow';this.board=Array.from({length:ROWS},()=>Array(COLS).fill(null));this.score=0;this.saved=0;this.charge=0;this.bestChain=0;this.moves=0;this.elapsed=0;this.over=false;this.endReason=null;this.bag=[];this.queue=[this.make(),this.make(),this.make()];this.spawn();}
    finish(reason){if(this.over)return;this.over=true;this.endReason=reason;}
    advance(ms){if(this.over||this.mode!=='flow'||!Number.isFinite(ms)||ms<=0)return false;this.elapsed=Math.min(DURATION,this.elapsed+ms);if(this.elapsed===DURATION)this.finish('time');return this.over;}
    make(){if(!this.bag.length){this.bag=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}}const shape=SHAPES[Math.floor(this.random()*SHAPES.length)].map(c=>c.slice());return {cells:shape,color:this.bag.pop()};}
    spawn(){this.active={...this.queue.shift(),q:4,r:0};this.queue.push(this.make());this.active.r=-Math.min(...this.cells().map(c=>c.y));this.swapped=false;if(!this.fits(this.active))this.finish('full');}
    cells(piece=this.active){return piece.cells.map(([q,r])=>{const [x,y]=toGrid(q+piece.q,r+piece.r);return {x,y,color:piece.color};});}
    fits(piece){return this.cells(piece).every(({x,y})=>x>=0&&x<COLS&&y>=0&&y<ROWS&&this.board[y][x]===null);}
    move(dx){if(this.over)return false;const q=this.active.q+dx,p={...this.active,q,r:this.active.r+Math.floor(this.active.q/2)-Math.floor(q/2)};if(!this.fits(p))return false;this.active=p;return true;}
    turn(){if(this.over)return false;const cells=rotate(this.active.cells);for(const [dq,dr]of [[0,0],[-1,0],[1,-1],[0,1],[-1,1],[1,0],[0,-1]]){const p={...this.active,cells,q:this.active.q+dq,r:this.active.r+dr};if(this.fits(p)){this.active=p;return true;}}return false;}
    ghost(){let p={...this.active};while(this.fits({...p,r:p.r+1}))p.r++;return p;}
    swap(){if(this.over||this.swapped)return false;const old=this.active,next=this.queue[0];let p={...next,q:old.q,r:old.r};if(!this.fits(p))return false;this.queue[0]={cells:old.cells.map(c=>c.slice()),color:old.color};this.active=p;this.swapped=true;return true;}
    step(){if(this.over)return null;const p={...this.active,r:this.active.r+1};if(this.fits(p)){this.active=p;return {moved:true,clears:[]};}return this.lock();}
    drop(){if(this.over)return null;this.active=this.ghost();return this.lock();}
    lock(){if(!this.fits(this.active))return null;for(const c of this.cells())this.board[c.y][c.x]=c.color;this.moves++;this.score+=this.active.cells.length*5;const result=this.resolve();this.spawn();return result;}
    groups(){const seen=new Set(),groups=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const color=this.board[y][x],key=y*COLS+x;if(color===null||seen.has(key))continue;const group=[{x,y,color}];seen.add(key);for(let i=0;i<group.length;i++){const [q,r]=toAxial(group[i].x,group[i].y);for(const [dq,dr]of DIRS){const [xx,yy]=toGrid(q+dq,r+dr),k=yy*COLS+xx;if(xx<0||xx>=COLS||yy<0||yy>=ROWS||seen.has(k)||this.board[yy][xx]!==color)continue;seen.add(k);group.push({x:xx,y:yy,color});}}if(group.length>=MATCH)groups.push(group);}return groups;}
    collapse(){for(let x=0;x<COLS;x++){let dest=ROWS-1;for(let y=ROWS-1;y>=0;y--)if(this.board[y][x]!==null){const value=this.board[y][x];this.board[y][x]=null;this.board[dest--][x]=value;}}}
    resolve(){const clears=[];let chain=0,groups;while((groups=this.groups()).length){chain++;const cells=groups.flat();for(const c of cells)this.board[c.y][c.x]=null;this.saved+=cells.length;this.score+=cells.length*20*chain;this.charge=Math.min(4,this.charge+groups.length);clears.push({cells,chain});this.collapse();}this.bestChain=Math.max(this.bestChain,chain);return {moved:false,clears,chain};}
    purr(){if(this.over||this.charge<4)return null;this.charge=0;const cells=[];for(let y=ROWS-2;y<ROWS;y++)for(let x=0;x<COLS;x++)if(this.board[y][x]!==null){cells.push({x,y,color:this.board[y][x]});this.board[y][x]=null;}this.saved+=cells.length;this.score+=cells.length*10;this.collapse();const result=this.resolve();
      // Falling settled cats must not overlap a live piece under an overhang.
      if(!this.fits(this.active)){let found=null;for(let r=this.active.r-1;r>=-ROWS&&!found;r--){const p={...this.active,r};if(this.fits(p))found=p;}if(found)this.active=found;else{for(let q=0;q<COLS&&!found;q++)for(let r=-ROWS;r<ROWS&&!found;r++){const p={...this.active,q,r};if(this.fits(p))found=p;}if(found)this.active=found;else this.finish('full');}}
      result.clears.unshift({cells,chain:0});result.purr=true;return result;}
    get remaining(){return this.mode==='flow'?DURATION-this.elapsed:Infinity;}
    get level(){return 1+Math.max(Math.floor(this.saved/30),this.mode==='flow'?Math.floor(this.elapsed/20000):0);}
    get interval(){return Math.max(240,1100-(this.level-1)*90);}
  }
  return {Game,COLS,ROWS,MATCH,DURATION,SHAPES,DIRS,toGrid,toAxial,rotate};
});
