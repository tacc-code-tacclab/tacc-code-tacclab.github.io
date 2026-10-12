(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./journey.js'));else root.Micio4=factory(root.MicioJourney);})(typeof globalThis!=='undefined'?globalThis:this,function(Journey){
  'use strict';
  const COLS=9,ROWS=12,MATCH=6,BLOCK=4;
  const isCat=value=>Number.isInteger(value)&&value>=0&&value<BLOCK;
  const SHAPES=[[[0,0],[0,1],[0,2]],[[0,0],[1,0],[0,1]],[[0,0],[1,-1],[2,-1]],[[0,0],[-1,0],[1,0]],[[0,0],[0,1]]];
  const DIRS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  const toGrid=(q,r)=>[q,r+Math.floor(q/2)],toAxial=(x,y)=>[x,y-Math.floor(x/2)];
  const rotate=cells=>cells.map(([q,r])=>[-r||0,q+r||0]);
  const {WORLDS,MISSIONS}=Journey;
  const WEAPONS=Object.freeze({
    stone:{name:'Sassi',icon:'●',price:0,damage:1,cooldown:340,color:'#dce6ed',hint:'1 danno. Un sasso per tiro.'},
    dart:{name:'Freccette',icon:'➤',price:6,damage:2,cooldown:300,color:'#ffca75',hint:'Precise e veloci. 2 danni.'},
    spear:{name:'Lance',icon:'↗',price:14,damage:3,cooldown:550,color:'#ff997b',hint:'Un colpo pesante. 3 danni.'},
    bullet:{name:'Proiettili',icon:'▪',price:26,damage:2,cooldown:120,color:'#75ecff',hint:'Colpi rapidi. 2 danni.'},
    laser:{name:'Laser',icon:'ϟ',price:44,damage:4,cooldown:260,color:'#e6a5ff',hint:'Un raggio potente. 4 danni.'}
  });
  const WEAPON_IDS=Object.keys(WEAPONS);
  class Game{
    constructor(random=Math.random){this.random=random;this.reset();}
    reset(mode='flow'){
      this.mode=['chill','place'].includes(mode)?mode:'flow';this.ammo=18;this.ammoSpent=0;this.stage=0;this.score=0;this.coins=0;this.rescuedBefore=0;this.bestChain=0;
      this.owned=['stone'];this.weapon='stone';this.events=[];this.prepareStage();
    }
    prepareStage(){
      this.checkpoint={score:this.score,coins:this.coins,owned:this.owned.slice(),weapon:this.weapon,bestChain:this.bestChain,ammo:this.ammo,ammoSpent:this.ammoSpent};
      this.board=Array.from({length:ROWS},()=>Array(COLS).fill(null));this.saved=0;this.stamps={};this.charge=0;this.moves=0;this.elapsed=0;
      this.over=false;this.endReason=null;this.mosquito=null;this.mosquitoMs=12000;this.mosquitoMoves=5;this.events=[];
      this.bag=[];this.queue=[this.make(),this.make(),this.make()];this.spawn();
    }
    nextStage(){if(!this.won||this.campaignWon)return false;this.rescuedBefore+=this.saved;this.stage++;this.ammo=Math.min(99,this.ammo+8);this.prepareStage();return true;}
    retryStage(){if(!this.over||this.won)return false;const c=this.checkpoint;this.score=c.score;this.coins=c.coins;this.owned=c.owned.slice();this.weapon=c.weapon;this.bestChain=c.bestChain;this.ammo=c.ammo;this.ammoSpent=c.ammoSpent;this.prepareStage();return true;}
    finish(reason){if(this.over||(reason==='win'&&!this.targets.every(c=>isCat(this.stamps[c.y*COLS+c.x]))))return;this.over=true;this.endReason=reason;this.mosquito=null;if(reason==='win')this.addScore(200);}
    addScore(points){if(!Number.isFinite(points)||points<=0)return;const before=Math.floor(this.score/100);this.score+=Math.floor(points);this.coins+=Math.floor(this.score/100)-before;}
    drainEvents(){const events=this.events;this.events=[];return events;}
    advance(ms){
      if(this.over||!Number.isFinite(ms)||ms<=0)return false;
      if(this.mode==='flow'){
        this.elapsed=Math.min(this.duration,this.elapsed+ms);
        if(this.elapsed===this.duration){this.finish('time');return true;}
      }
      if(this.mosquito){
        this.mosquito.age+=ms;this.mosquito.cooldown=Math.max(0,this.mosquito.cooldown-ms);
        if(this.mode!=='chill'){this.mosquito.dropMs=Math.max(0,this.mosquito.dropMs-ms);if(this.mosquito.dropMs===0)this.dropClutter();}
      }else if(this.mode!=='chill'){this.mosquitoMs-=ms;if(this.mosquitoMs<=0&&this.moves>=2)this.appearMosquito();}
      return this.over;
    }
    make(){
      if(!this.bag.length){this.bag=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}}
      return {cells:SHAPES[Math.floor(this.random()*SHAPES.length)].map(c=>c.slice()),color:this.bag.pop()};
    }
    spawn(){this.active={...this.queue.shift(),q:4,r:0};this.queue.push(this.make());this.active.r=-Math.min(...this.cells().map(c=>c.y));this.swapped=false;if(this.mode==='place'){if(!this.hasPlacement(this.active)&&!this.hasPlacement(this.queue[0]))this.finish('full');}else if(!this.fits(this.active))this.finish('full');}
    cells(piece=this.active){return piece.cells.map(([q,r])=>{const [x,y]=toGrid(q+piece.q,r+piece.r);return {x,y,color:piece.color};});}
    fits(piece){return this.cells(piece).every(({x,y})=>x>=0&&x<COLS&&y>=0&&y<ROWS&&this.board[y][x]===null);}
    move(dx){if(this.mode==='place'||this.over)return false;const q=this.active.q+dx,p={...this.active,q,r:this.active.r+Math.floor(this.active.q/2)-Math.floor(q/2)};if(!this.fits(p))return false;this.active=p;return true;}
    turn(){if(this.mode==='place'||this.over)return false;const cells=rotate(this.active.cells);for(const [dq,dr]of [[0,0],[-1,0],[1,-1],[0,1],[-1,1],[1,0],[0,-1]]){const p={...this.active,cells,q:this.active.q+dq,r:this.active.r+dr};if(this.fits(p)){this.active=p;return true;}}return false;}
    ghost(){let p={...this.active};while(this.fits({...p,r:p.r+1}))p.r++;return p;}
    swap(){if(this.over||this.swapped)return false;const old=this.active,next=this.queue[0],p={...next,q:old.q,r:old.r};if(this.mode==='place'?!this.hasPlacement(p):!this.fits(p))return false;this.queue[0]={cells:old.cells.map(c=>c.slice()),color:old.color};this.active=p;this.swapped=true;return true;}
    step(){if(this.mode==='place'||this.over)return null;const p={...this.active,r:this.active.r+1};if(this.fits(p)){this.active=p;return {moved:true,clears:[]};}return this.lock();}
    drop(){if(this.mode==='place'||this.over)return null;this.active=this.ghost();return this.lock();}
    lock(){
      if(this.over||!this.fits(this.active))return null;
      for(const c of this.cells())this.board[c.y][c.x]=c.color;
      this.moves++;this.addScore(this.active.cells.length*5);const result=this.resolve();
      if(!this.over)this.spawn();
      if(!this.over&&this.mode==='chill'){
        if(this.mosquito){this.mosquito.placements--;if(this.mosquito.placements===0)this.dropClutter();}
        else if(--this.mosquitoMoves<=0)this.appearMosquito();
      }
      return result;
    }
    hasPlacement(piece=this.active){
      for(let q=0;q<COLS;q++)for(let r=-ROWS;r<ROWS;r++)if(this.fits({...piece,q,r}))return true;
      return false;
    }
    placement(x,y){if(!Number.isInteger(x)||!Number.isInteger(y))return null;const [q,r]=toAxial(x,y);return {...this.active,q,r};}
    place(x,y){if(this.mode!=='place'||this.over)return null;const p=this.placement(x,y);if(!p||!this.fits(p))return null;this.active=p;return this.lock();}
    groups(){
      const seen=new Set(),groups=[];
      for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
        const color=this.board[y][x],key=y*COLS+x;if(!isCat(color)||seen.has(key))continue;
        const group=[{x,y,color}];seen.add(key);
        for(let i=0;i<group.length;i++){const [q,r]=toAxial(group[i].x,group[i].y);for(const [dq,dr]of DIRS){
          const [xx,yy]=toGrid(q+dq,r+dr),k=yy*COLS+xx;
          if(xx<0||xx>=COLS||yy<0||yy>=ROWS||seen.has(k)||this.board[yy][xx]!==color)continue;
          seen.add(k);group.push({x:xx,y:yy,color});
        }}
        if(group.length>=MATCH)groups.push(group);
      }return groups;
    }
    collapse(protectActive=false){
      if(this.mode==='place')return;
      const occupied=protectActive?new Set(this.cells().map(c=>c.y*COLS+c.x)):new Set();
      for(let x=0;x<COLS;x++){let dest=ROWS-1;for(let y=ROWS-1;y>=0;y--){
        if(occupied.has(y*COLS+x)){dest=y-1;continue;}
        if(this.board[y][x]!==null){const value=this.board[y][x];this.board[y][x]=null;this.board[dest--][x]=value;}
      }}
    }
    rescue(n){this.saved+=n;}
    stampTargets(){
      const before=this.progress;
      for(const {x,y}of this.targets)if(isCat(this.board[y][x]))this.stamps[y*COLS+x]=this.board[y][x];
      const added=this.progress-before;this.addScore(added*15);this.charge=Math.min(4,this.charge+Math.floor(this.progress/6)-Math.floor(before/6));return added;
    }
    checkGoal(){if(this.targets.every(c=>isCat(this.stamps[c.y*COLS+c.x])))this.finish('win');}
    resolve(protectActive=false){
      const clears=[];let chain=0,groups,stamped=this.stampTargets();
      while((groups=this.groups()).length){chain++;const cells=groups.flat();for(const c of cells)this.board[c.y][c.x]=null;
        const debris=[];for(const c of cells){const [q,r]=toAxial(c.x,c.y);for(const [dq,dr]of DIRS){const [x,y]=toGrid(q+dq,r+dr);if(x>=0&&x<COLS&&y>=0&&y<ROWS&&this.board[y][x]===BLOCK){debris.push({x,y,color:BLOCK});this.board[y][x]=null;}}}
        this.rescue(cells.length);this.addScore(cells.length*20*chain);this.charge=Math.min(4,this.charge+groups.length);clears.push({cells:[...cells,...debris],chain});this.collapse(protectActive);stamped+=this.stampTargets();
      }
      this.bestChain=Math.max(this.bestChain,chain);this.checkGoal();return {moved:false,clears,chain,stamped};
    }
    relocateActive(){
      if(this.mode==='place')return this.hasPlacement()||(!this.swapped&&this.hasPlacement(this.queue[0]));
      if(this.fits(this.active))return true;const old=this.active;
      for(let r=old.r-1;r>=-ROWS;r--){const p={...old,r};if(this.fits(p)){this.active=p;return true;}}
      for(let q=0;q<COLS;q++)for(let r=-ROWS;r<ROWS;r++){const p={...old,q,r};if(this.fits(p)){this.active=p;return true;}}
      return false;
    }
    purr(){
      if(this.over||this.charge<4)return null;this.charge=0;const cells=[];
      for(let y=ROWS-2;y<ROWS;y++)for(let x=0;x<COLS;x++)if(this.board[y][x]!==null){cells.push({x,y,color:this.board[y][x]});this.board[y][x]=null;}
      const cats=cells.filter(c=>isCat(c.color)).length;this.rescue(cats);this.addScore(cats*10);this.collapse(true);const result=this.resolve(true);
      if(!this.over&&!this.relocateActive())this.finish('full');result.clears.unshift({cells,chain:0});result.purr=true;return result;
    }
    appearMosquito(){
      if(this.over||this.mosquito)return false;
      const hp=4+Math.floor(this.stage/9);this.mosquito={hp,maxHp:hp,age:0,phase:this.random()*Math.PI*2,speed:1+this.stage*.035,cooldown:0,dropMs:4200,placements:3,drops:0};
      this.events.push({type:'mosquito-warning'});return true;
    }
    restMosquito(){this.mosquito=null;this.mosquitoMs=20000+Math.floor(this.random()*5000);this.mosquitoMoves=6;}
    dropClutter(){
      if(!this.mosquito||this.over)return [];
      const cells=[],active=new Set(this.mode==='place'?[]:this.cells().map(c=>c.y*COLS+c.x));
      const cap=10-this.board.flat().filter(c=>c===BLOCK).length,amount=Math.min(cap,this.stage>=12?2:1);
      for(let n=0;n<amount;n++){
        const candidates=[];
        for(let x=0;x<COLS;x++){
          const top=this.board.findIndex(row=>row[x]!==null),y=top<0?ROWS-1:top-1;
          // Keep the spawn area free and never overwrite a cat or the falling group.
          if(y>=4&&!active.has(y*COLS+x)&&!cells.some(c=>c.x===x))candidates.push({x,y,color:BLOCK});
        }
        if(!candidates.length)break;
        const cell=candidates[Math.floor(this.random()*candidates.length)];this.board[cell.y][cell.x]=BLOCK;cells.push(cell);
      }
      this.mosquito.drops++;this.mosquito.dropMs=Math.max(2800,4200-this.stage*35);this.mosquito.placements=3;
      if(cells.length)this.events.push({type:'mosquito-clutter',cells,flight:{age:this.mosquito.age,phase:this.mosquito.phase}});
      if(this.mosquito.drops>=3||!cells.length){this.restMosquito();this.events.push({type:'mosquito-away'});}
      return cells;
    }
    clearClutter(){
      const cells=[];for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(this.board[y][x]===BLOCK){cells.push({x,y,color:BLOCK});this.board[y][x]=null;}
      // The current falling piece acts as a barrier during this mid-turn collapse.
      // Its input/position remains valid even when clutter was supporting other cats.
      this.collapse(true);const result=this.resolve(true);if(cells.length)result.clears.unshift({cells,chain:0});result.clutter=cells.length;return result;
    }
    shootMosquito(hit=true){
      if(this.over||!this.mosquito||this.mosquito.cooldown>0||this.ammo<=0)return false;
      this.ammo--;
      this.mosquito.cooldown=WEAPONS[this.weapon].cooldown;
      if(!hit){this.events.push({type:'mosquito-miss'});return true;}
      this.mosquito.hp=Math.max(0,this.mosquito.hp-WEAPONS[this.weapon].damage);this.mosquito.dropMs+=220;
      if(this.mosquito.hp>0)this.events.push({type:'mosquito-hit',hp:this.mosquito.hp});
      else{this.restMosquito();this.addScore(100);this.charge=Math.min(4,this.charge+1);const result=this.clearClutter();this.events.push({type:'mosquito-defeated',result});}
      return true;
    }
    canBuyAmmo(){return !this.campaignWon&&(!this.over||this.won)&&this.coins>=2&&this.ammo<=91;}
    buyAmmo(){if(!this.canBuyAmmo())return false;this.coins-=2;this.ammoSpent+=2;this.ammo+=8;return true;}
    canBuy(id){const w=WEAPONS[id];return !!w&&this.won&&!this.campaignWon&&!this.owned.includes(id)&&this.coins>=w.price;}
    buy(id){if(!this.canBuy(id))return false;this.coins-=WEAPONS[id].price;this.owned.push(id);this.weapon=id;return true;}
    equip(id){if(!WEAPONS[id]||!this.owned.includes(id))return false;this.weapon=id;return true;}
    cycleWeapon(){const ids=WEAPON_IDS.filter(id=>this.owned.includes(id));this.weapon=ids[(ids.indexOf(this.weapon)+1)%ids.length];return this.weapon;}
    campaignSave(){
      // Save completed stops/shop purchases, or the start-of-stop checkpoint on failure/reload.
      const c=this.won?this:this.checkpoint;
      return {version:4,stage:this.stage,mode:this.mode,status:this.won?'won':'start',score:c.score,coins:c.coins,owned:c.owned.slice(),weapon:c.weapon,bestChain:c.bestChain,ammo:c.ammo,ammoSpent:c.ammoSpent,rescuedBefore:this.rescuedBefore};
    }
    restoreCampaign(data){
      if(!data||data.version!==4||!Number.isInteger(data.stage)||data.stage<0||data.stage>=MISSIONS.length||!['flow','chill','place'].includes(data.mode)||!['start','won'].includes(data.status))return false;
      if(!Number.isSafeInteger(data.score)||data.score<0||data.score>1e9||!Number.isSafeInteger(data.coins)||data.coins<0||data.coins>Math.floor(data.score/100))return false;
      if(!Array.isArray(data.owned)||!data.owned.includes('stone')||new Set(data.owned).size!==data.owned.length||!data.owned.every(id=>WEAPON_IDS.includes(id))||!data.owned.includes(data.weapon))return false;
      if(!Number.isInteger(data.ammo)||data.ammo<0||data.ammo>99||!Number.isSafeInteger(data.ammoSpent)||data.ammoSpent<0||data.ammoSpent>1e7||data.ammoSpent%2)return false;
      if(data.owned.reduce((n,id)=>n+WEAPONS[id].price,0)+data.coins+data.ammoSpent!==Math.floor(data.score/100))return false;
      this.mode=data.mode;this.ammo=data.ammo;this.ammoSpent=data.ammoSpent;this.stage=data.stage;this.score=data.score;this.coins=data.coins;this.owned=data.owned.slice();this.weapon=data.weapon;
      this.bestChain=Number.isInteger(data.bestChain)&&data.bestChain>=0?Math.min(108,data.bestChain):0;
      this.rescuedBefore=Number.isInteger(data.rescuedBefore)&&data.rescuedBefore>=0?Math.min(1e7,data.rescuedBefore):0;this.prepareStage();
      if(data.status==='won'){for(const c of this.targets)this.stamps[c.y*COLS+c.x]=0;this.over=true;this.endReason='win';}
      return true;
    }
    get mission(){return MISSIONS[this.stage];}
    get world(){return WORLDS[this.mission.world];}
    get targets(){return this.mission.targets;}
    get goal(){return this.targets.length;}
    get progress(){return this.targets.reduce((n,c)=>n+(isCat(this.stamps[c.y*COLS+c.x])?1:0),0);}
    get won(){return this.endReason==='win';}
    get campaignWon(){return this.won&&this.stage===MISSIONS.length-1;}
    get totalSaved(){return this.rescuedBefore+this.saved;}
    get duration(){return this.mission.duration;}
    get remaining(){return this.mode==='flow'?this.duration-this.elapsed:Infinity;}
    get level(){return 1+Math.max(Math.floor(this.saved/30),Math.floor(this.elapsed/20000));}
    get interval(){return Math.max(260,760-this.stage*9-(this.level-1)*25);}
  }
  return {Game,COLS,ROWS,MATCH,BLOCK,isCat,SHAPES,DIRS,MISSIONS,WORLDS,WEAPONS,WEAPON_IDS,toGrid,toAxial,rotate};
});
