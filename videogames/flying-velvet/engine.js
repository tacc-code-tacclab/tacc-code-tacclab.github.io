(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.FlyingVelvet=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
  const mulberry32=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
  function difficulty(catches){
    const act=Math.floor(catches/10),within=catches%10;
    return {act,within,gap:clamp(315+catches*2.5,315,520),swing:clamp(.88+act*.045,0,1.58),amplitude:clamp(.58+act*.018,0,1.02),catchRadius:clamp(68-act*1.3,45,68),tigers:Math.min(5,2+Math.floor(act/2))};
  }
  class Game{
    constructor(seed=Date.now()){this.seed=seed>>>0;this.random=mulberry32(this.seed);this.best=0;this.reset();}
    reset(){
      this.time=0;this.score=0;this.catches=0;this.combo=0;this.state='ready';this.reason='';this.cameraX=0;this.input=0;this.releaseQueued=false;this.events=[];this.trapezes=[];
      this.player={x:0,y:0,vx:0,vy:0,angle:0,omega:0,attached:0,trail:[]};
      for(let i=0;i<8;i++)this.addTrapeze(i);this.attach(0,true);return this;
    }
    addTrapeze(index=this.trapezes.length){
      const d=difficulty(Math.max(0,index-1)),previous=this.trapezes[index-1];
      const gap=index===0?0:d.gap+(this.random()-.5)*70;
      const x=index===0?180:previous.anchorX+gap;
      const length=145+this.random()*42,anchorY=72+this.random()*45,roll=this.random();let kind='classic';
      if(d.act>=4&&roll<.17)kind='wild';else if(d.act>=3&&roll<.34)kind='double';else if(d.act>=2&&roll<.53)kind='elastic';else if(d.act>=1&&roll<.72)kind='short';
      this.trapezes.push({index,kind,anchorX:x,anchorY,length,phase:this.random()*TAU,dir:this.random()<.5?-1:1,speed:d.swing*(.9+this.random()*.18),amplitude:d.amplitude*(.9+this.random()*.16),bar:kind==='short'?40+this.random()*8:54+this.random()*16});
    }
    trapPose(trap,time=this.time){
      const a=Math.sin(time*trap.speed+trap.phase)*trap.amplitude*trap.dir;
      const da=Math.cos(time*trap.speed+trap.phase)*trap.amplitude*trap.speed*trap.dir;
      const elastic=trap.kind==='elastic',wild=trap.kind==='wild',wave=time*1.7+trap.phase;
      const length=trap.length*(elastic?1+.1*Math.sin(wave):1),dl=elastic?trap.length*.17*Math.cos(wave):0,shift=wild?26*Math.sin(time*1.3+trap.phase*2):0,dshift=wild?33.8*Math.cos(time*1.3+trap.phase*2):0;
      return {x:trap.anchorX+shift+Math.sin(a)*length,y:trap.anchorY+Math.cos(a)*length,angle:a,vx:dshift+Math.cos(a)*length*da+Math.sin(a)*dl,vy:-Math.sin(a)*length*da+Math.cos(a)*dl};
    }
    attach(index,initial=false){
      const t=this.trapezes[index],p=this.trapPose(t);this.player.attached=index;this.player.x=p.x;this.player.y=p.y+42;this.player.vx=p.vx;this.player.vy=p.vy;this.player.angle=p.angle*.32;this.player.omega=0;this.state=initial?'ready':'swing';
    }
    start(){if(this.state==='ready'){this.state='swing';this.events.push({type:'start'});return true;}return false;}
    setInput(v){this.input=clamp(Number(v)||0,-1,1);}
    release(){if(this.state==='ready')this.start();if(this.state!=='swing')return false;this.releaseQueued=true;return true;}
    update(dt){
      if(!Number.isFinite(dt)||dt<=0||this.state==='over')return;
      dt=Math.min(dt,.05);this.time+=dt;
      while(this.trapezes.length<Math.floor((this.cameraX+1600)/300)+6)this.addTrapeze();
      if(this.state==='ready'||this.state==='swing')this.updateAttached(dt);else if(this.state==='flight')this.updateFlight(dt);
      const targetX=this.player.x-230;this.cameraX+=(Math.max(0,targetX)-this.cameraX)*Math.min(1,dt*3.5);
      this.player.trail.push({x:this.player.x,y:this.player.y,life:1});if(this.player.trail.length>22)this.player.trail.shift();for(const p of this.player.trail)p.life-=dt*2.4;
    }
    updateAttached(dt){
      const trap=this.trapezes[this.player.attached],p=this.trapPose(trap);this.player.x=p.x;this.player.y=p.y+42;this.player.vx=p.vx;this.player.vy=p.vy;
      this.player.omega+=this.input*5.4*dt;this.player.omega*=Math.pow(.12,dt);this.player.angle=wrap(this.player.angle+this.player.omega*dt);
      if(this.releaseQueued){
        this.releaseQueued=false;this.state='flight';this.player.vx+=220+Math.max(0,this.player.vx)*.45;this.player.vy=-315+Math.min(0,this.player.vy)*.15;this.player.omega+=this.input*1.2;this.events.push({type:'release'});
      }
    }
    updateFlight(dt){
      const p=this.player;p.vy+=540*dt;p.vx+=12*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.omega+=this.input*8.4*dt;p.omega*=Math.pow(.82,dt);p.angle=wrap(p.angle+p.omega*dt);
      const next=this.trapezes[p.attached+1],bar=this.trapPose(next);const hand={x:p.x+Math.sin(p.angle)*44,y:p.y-Math.cos(p.angle)*44},dx=bar.x-hand.x,dy=bar.y-hand.y,dist=Math.hypot(dx,dy),d=difficulty(this.catches);
      if(dist<125&&p.vy>0){const pull=(1-dist/125)*145;p.vx+=dx/(dist||1)*pull*dt;p.vy+=dy/(dist||1)*pull*dt;}
      if(dist<d.catchRadius&&p.vy>0&&Math.abs(p.omega)<8.5){
        const style=Math.max(0,Math.round(180-Math.abs(wrap(p.angle))*38-Math.abs(p.omega)*8));this.catches++;this.combo++;this.score+=100+style+this.combo*12;this.best=Math.max(this.best,this.catches);this.events.push({type:'catch',style,act:difficulty(this.catches).act,newAct:this.catches%10===0});this.attach(next.index);return;
      }
      if(p.y>635||p.x<bar.x-360||p.x>bar.x+250)this.fail(p.y>635?'tigers':'miss');
    }
    fail(reason){this.state='over';this.reason=reason;this.combo=0;this.events.push({type:'fail',reason});}
    drainEvents(){const e=this.events;this.events=[];return e;}
    get target(){return this.trapezes[Math.min(this.trapezes.length-1,this.player.attached+1)];}
    get act(){return Math.floor(this.catches/10)+1;}
    get progress(){return this.catches%10;}
  }
  return {Game,difficulty,wrap,clamp,mulberry32};
});
