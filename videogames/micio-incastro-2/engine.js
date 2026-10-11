(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Micio=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const COLS=9,ROWS=12,MATCH=6,DURATION=180000;
  const SHAPES=[[[0,0],[0,1],[0,2]],[[0,0],[1,0],[0,1]],[[0,0],[1,-1],[2,-1]],[[0,0],[-1,0],[1,0]],[[0,0],[0,1]]];
  const DIRS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  const toGrid=(q,r)=>[q,r+Math.floor(q/2)],toAxial=(x,y)=>[x,y-Math.floor(x/2)];
  const rotate=cells=>cells.map(([q,r])=>[-r||0,q+r||0]);
  const rowsToCells=rows=>rows.flatMap((xs,i)=>xs.map(x=>({x,y:7+i})));
  const FIGURES={
    heart:rowsToCells([[2,3,5,6],[1,2,3,4,5,6,7],[2,3,4,5,6],[3,4,5],[4]]),
    fish:rowsToCells([[1,4,5],[1,2,3,4,5,6],[2,3,4,5,6,7],[1,2,3,4,5,6],[1,4,5]]),
    star:[{x:4,y:9},...DIRS.flatMap(([q,r])=>[1,2].map(n=>{const [x,y]=toGrid(4+q*n,7+r*n);return {x,y};}))]
  };
  const WORLDS=[{name:'Giardino delle lanterne',asset:'lanterne',symbol:'✿'},{name:'Baia luminosa',asset:'baia',symbol:'≈'},{name:'Città delle nuvole',asset:'nuvole',symbol:'☁'},{name:'Osservatorio stellare',asset:'stelle',symbol:'✦'}];
  const MISSIONS=[
    {world:0,title:'Il giardino si risveglia',kind:'rescue',goal:30},
    {world:0,title:'Un cuore per i mici',kind:'figure',figure:'heart',label:'Cuore'},
    {world:1,title:'Gatti in fondo al mare',kind:'rescue',goal:42},
    {world:1,title:'Il pesce dei desideri',kind:'figure',figure:'fish',label:'Pesce'},
    {world:2,title:'Un nido fra le nuvole',kind:'rescue',goal:48},
    {world:2,title:'Disegna una stella',kind:'figure',figure:'star',label:'Stella'},
    {world:3,title:'Ultima chiamata per i mici',kind:'rescue',goal:60},
    {world:3,title:'La costellazione felice',kind:'figure',figure:'star',label:'Stella'}
  ];
  const SHOP={honey:{price:4,max:3,name:'Miele'},slow:{price:6,max:2,name:'Ghiaccio'},wand:{price:8,max:2,name:'Bacchetta'}};
  class Game{
    constructor(random=Math.random){this.random=random;this.reset();}
    reset(mode='flow'){
      this.mode=mode==='chill'?'chill':'flow';this.stage=0;this.score=0;this.coins=0;this.rescuedBefore=0;this.bestChain=0;
      this.inventory={honey:1,slow:1,wand:1};this.events=[];this.prepareStage();
    }
    prepareStage(){
      this.checkpoint={score:this.score,coins:this.coins,inventory:{...this.inventory},bestChain:this.bestChain};
      this.board=Array.from({length:ROWS},()=>Array(COLS).fill(null));this.saved=0;this.stamps={};this.charge=0;this.moves=0;this.elapsed=0;
      this.over=false;this.endReason=null;this.bee=null;this.beeMs=20000;this.beeMoves=7;this.slowMs=0;this.events=[];
      this.bag=[];this.queue=[this.make(),this.make(),this.make()];this.spawn();
    }
    nextStage(){if(!this.won||this.campaignWon)return false;this.rescuedBefore+=this.saved;this.stage++;this.prepareStage();return true;}
    retryStage(){if(!this.over||this.won)return false;const c=this.checkpoint;this.score=c.score;this.coins=c.coins;this.inventory={...c.inventory};this.bestChain=c.bestChain;this.prepareStage();return true;}
    finish(reason){if(this.over)return;this.over=true;this.endReason=reason;this.bee=null;this.slowMs=0;if(reason==='win')this.coins+=6;}
    drainEvents(){const events=this.events;this.events=[];return events;}
    advance(ms){
      if(this.over||!Number.isFinite(ms)||ms<=0)return false;
      if(this.mode==='flow'){
        this.elapsed=Math.min(DURATION,this.elapsed+ms);this.slowMs=Math.max(0,this.slowMs-ms);
        if(this.elapsed===DURATION){this.finish('time');return true;}
        if(this.bee){this.bee.remaining=Math.max(0,this.bee.remaining-ms);if(this.bee.remaining===0)this.shuffleBee();}
        else{this.beeMs-=ms;if(this.beeMs<=0&&this.moves>=3)this.appearBee();}
      }
      return this.over;
    }
    make(){
      if(!this.bag.length){this.bag=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}}
      return {cells:SHAPES[Math.floor(this.random()*SHAPES.length)].map(c=>c.slice()),color:this.bag.pop()};
    }
    spawn(){this.active={...this.queue.shift(),q:4,r:0};this.queue.push(this.make());this.active.r=-Math.min(...this.cells().map(c=>c.y));this.swapped=false;if(!this.fits(this.active))this.finish('full');}
    cells(piece=this.active){return piece.cells.map(([q,r])=>{const [x,y]=toGrid(q+piece.q,r+piece.r);return {x,y,color:piece.color};});}
    fits(piece){return this.cells(piece).every(({x,y})=>x>=0&&x<COLS&&y>=0&&y<ROWS&&this.board[y][x]===null);}
    move(dx){if(this.over)return false;const q=this.active.q+dx,p={...this.active,q,r:this.active.r+Math.floor(this.active.q/2)-Math.floor(q/2)};if(!this.fits(p))return false;this.active=p;return true;}
    turn(){if(this.over)return false;const cells=rotate(this.active.cells);for(const [dq,dr]of [[0,0],[-1,0],[1,-1],[0,1],[-1,1],[1,0],[0,-1]]){const p={...this.active,cells,q:this.active.q+dq,r:this.active.r+dr};if(this.fits(p)){this.active=p;return true;}}return false;}
    ghost(){let p={...this.active};while(this.fits({...p,r:p.r+1}))p.r++;return p;}
    swap(){if(this.over||this.swapped)return false;const old=this.active,next=this.queue[0],p={...next,q:old.q,r:old.r};if(!this.fits(p))return false;this.queue[0]={cells:old.cells.map(c=>c.slice()),color:old.color};this.active=p;this.swapped=true;return true;}
    step(){if(this.over)return null;const p={...this.active,r:this.active.r+1};if(this.fits(p)){this.active=p;return {moved:true,clears:[]};}return this.lock();}
    drop(){if(this.over)return null;this.active=this.ghost();return this.lock();}
    lock(){
      if(this.over||!this.fits(this.active))return null;
      for(const c of this.cells())this.board[c.y][c.x]=c.color;
      this.moves++;this.score+=this.active.cells.length*5;const result=this.resolve();
      if(!this.over)this.spawn();
      if(!this.over&&this.mode==='chill'){
        if(this.bee){this.bee.placements--;if(this.bee.placements===0)this.shuffleBee();}
        else if(--this.beeMoves<=0)this.appearBee();
      }
      return result;
    }
    groups(){
      const seen=new Set(),groups=[];
      for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
        const color=this.board[y][x],key=y*COLS+x;if(color===null||seen.has(key))continue;
        const group=[{x,y,color}];seen.add(key);
        for(let i=0;i<group.length;i++){const [q,r]=toAxial(group[i].x,group[i].y);for(const [dq,dr]of DIRS){
          const [xx,yy]=toGrid(q+dq,r+dr),k=yy*COLS+xx;
          if(xx<0||xx>=COLS||yy<0||yy>=ROWS||seen.has(k)||this.board[yy][xx]!==color)continue;
          seen.add(k);group.push({x:xx,y:yy,color});
        }}
        if(group.length>=MATCH)groups.push(group);
      }return groups;
    }
    collapse(){for(let x=0;x<COLS;x++){let dest=ROWS-1;for(let y=ROWS-1;y>=0;y--)if(this.board[y][x]!==null){const value=this.board[y][x];this.board[y][x]=null;this.board[dest--][x]=value;}}}
    rescue(n){const before=Math.floor(this.saved/3);this.saved+=n;this.coins+=Math.floor(this.saved/3)-before;}
    stampTargets(){
      if(this.mission.kind!=='figure')return 0;const before=this.progress;
      for(const {x,y}of this.targets)if(this.board[y][x]!==null)this.stamps[y*COLS+x]=this.board[y][x];
      const added=this.progress-before;this.score+=added*8;this.coins+=Math.floor(this.progress/4)-Math.floor(before/4);return added;
    }
    checkGoal(){if(this.progress>=this.goal)this.finish('win');}
    resolve(){
      const clears=[];let chain=0,groups,stamped=this.stampTargets();
      while((groups=this.groups()).length){chain++;const cells=groups.flat();for(const c of cells)this.board[c.y][c.x]=null;
        this.rescue(cells.length);this.score+=cells.length*20*chain;this.charge=Math.min(4,this.charge+groups.length);clears.push({cells,chain});this.collapse();stamped+=this.stampTargets();
      }
      this.bestChain=Math.max(this.bestChain,chain);this.checkGoal();return {moved:false,clears,chain,stamped};
    }
    relocateActive(){
      if(this.fits(this.active))return true;const old=this.active;
      for(let r=old.r-1;r>=-ROWS;r--){const p={...old,r};if(this.fits(p)){this.active=p;return true;}}
      for(let q=0;q<COLS;q++)for(let r=-ROWS;r<ROWS;r++){const p={...old,q,r};if(this.fits(p)){this.active=p;return true;}}
      return false;
    }
    purr(){
      if(this.over||this.charge<4)return null;this.charge=0;const cells=[];
      for(let y=ROWS-2;y<ROWS;y++)for(let x=0;x<COLS;x++)if(this.board[y][x]!==null){cells.push({x,y,color:this.board[y][x]});this.board[y][x]=null;}
      this.rescue(cells.length);this.score+=cells.length*10;this.collapse();const result=this.resolve();
      if(!this.over&&!this.relocateActive())this.finish('full');result.clears.unshift({cells,chain:0});result.purr=true;return result;
    }
    appearBee(){
      if(this.over||this.bee)return false;
      const occupied=Array.from({length:COLS},(_,x)=>x).filter(x=>this.board.some(row=>row[x]!==null));
      if(!occupied.length){this.beeMs=8000;this.beeMoves=3;return false;}
      const a=occupied[Math.floor(this.random()*occupied.length)];
      const candidates=Array.from({length:COLS},(_,x)=>x).filter(x=>x!==a&&this.board.some(row=>row[x]!==row[a]));
      if(!candidates.length){this.beeMs=8000;this.beeMoves=3;return false;}
      const b=candidates[Math.floor(this.random()*candidates.length)];
      this.bee={columns:[a,b].sort((x,y)=>x-y),remaining:5000,placements:3};this.events.push({type:'bee-warning'});return true;
    }
    restBee(){this.bee=null;this.beeMs=32000+Math.floor(this.random()*6000);this.beeMoves=8;}
    shuffleBee(){
      if(!this.bee||this.over)return false;const [a,b]=this.bee.columns,old=this.active;
      for(const row of this.board)[row[a],row[b]]=[row[b],row[a]];
      // An insect never causes an unavoidable top-out or overlaps the falling group.
      const safe=this.relocateActive();if(!safe){for(const row of this.board)[row[a],row[b]]=[row[b],row[a]];this.active=old;}
      this.restBee();this.events.push({type:safe?'bee-shuffle':'bee-cancelled',columns:[a,b]});return safe;
    }
    useHoney(){if(this.over||!this.bee||this.inventory.honey<1)return false;this.inventory.honey--;this.charge=Math.min(4,this.charge+1);this.restBee();this.events.push({type:'honey'});return true;}
    useSlow(){if(this.over||this.mode!=='flow'||this.slowMs>0||this.inventory.slow<1)return false;this.inventory.slow--;this.slowMs=12000;this.events.push({type:'slow'});return true;}
    useWand(from,to){
      const valid=c=>c&&Number.isInteger(c.x)&&Number.isInteger(c.y)&&c.x>=0&&c.x<COLS&&c.y>=0&&c.y<ROWS;
      if(this.over||this.inventory.wand<1||!valid(from)||!valid(to)||this.board[from.y][from.x]===null||this.board[to.y][to.x]!==null||this.cells().some(c=>c.x===to.x&&c.y===to.y))return null;
      const backup={board:this.board.map(r=>r.slice()),active:this.active,stamps:{...this.stamps},saved:this.saved,score:this.score,coins:this.coins,charge:this.charge,bestChain:this.bestChain};
      this.board[to.y][to.x]=this.board[from.y][from.x];this.board[from.y][from.x]=null;
      let stamped=this.stampTargets();this.collapse();const result=this.resolve();result.stamped+=stamped;
      if(!this.over&&!this.relocateActive()){Object.assign(this,backup);return null;}
      this.inventory.wand--;result.wand=true;return result;
    }
    canBuy(item){const product=SHOP[item];return !!product&&this.won&&!this.campaignWon&&this.coins>=product.price&&this.inventory[item]<product.max&&(item!=='slow'||this.mode==='flow');}
    buy(item){if(!this.canBuy(item))return false;this.coins-=SHOP[item].price;this.inventory[item]++;return true;}
    get mission(){return MISSIONS[this.stage];}
    get world(){return WORLDS[this.mission.world];}
    get targets(){return this.mission.kind==='figure'?FIGURES[this.mission.figure]:[];}
    get goal(){return this.mission.kind==='figure'?this.targets.length:this.mission.goal;}
    get progress(){return this.mission.kind==='figure'?Object.keys(this.stamps).length:this.saved;}
    get won(){return this.endReason==='win';}
    get campaignWon(){return this.won&&this.stage===MISSIONS.length-1;}
    get totalSaved(){return this.rescuedBefore+this.saved;}
    get remaining(){return this.mode==='flow'?DURATION-this.elapsed:Infinity;}
    get level(){return 1+Math.max(Math.floor(this.saved/30),Math.floor(this.elapsed/20000));}
    get interval(){return Math.max(190,700-this.stage*45-(this.level-1)*40)*(this.slowMs>0?1.85:1);}
  }
  return {Game,COLS,ROWS,MATCH,DURATION,SHAPES,DIRS,FIGURES,MISSIONS,WORLDS,SHOP,toGrid,toAxial,rotate};
});
