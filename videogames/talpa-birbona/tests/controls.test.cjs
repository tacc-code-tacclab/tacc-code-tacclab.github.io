const test=require('node:test');
const assert=require('node:assert/strict');
const {Game,SPEED}=require('../core.js');
const {pickTarget,targetVector,DirectionState}=require('../controls.js');
const mobile={width:364,height:364*750/1100,assist:true};
test('a tap on a surface crop targets its underground root; a near miss is accepted on mobile',()=>{
  const g=new Game(),p=g.plants[0],x=46+p.x*36,y=210+p.y*36;
  assert.deepEqual(pickTarget(g.plants,{x,y:180},mobile),{x:p.x,y:p.y,plantIndex:0});
  // 20 CSS pixels from the centre: usable with a thumb, without exact pixel aiming.
  assert.equal(pickTarget(g.plants,{x:x+20*1100/mobile.width,y},mobile).plantIndex,0);
  assert.equal(pickTarget(g.plants,{x:x+20*1100/mobile.width,y},{...mobile,assist:false}).plantIndex,undefined);
  p.eaten=true;assert.equal(pickTarget(g.plants,{x,y:180},mobile),null);
});
test('dragging remains free movement near roots and outside edges; distant sky taps do nothing',()=>{
  const g=new Game(),p=g.plants[0],point={x:46+p.x*36+10,y:210+p.y*36};
  const drag=pickTarget(g.plants,point,{...mobile,dragging:true});assert.equal(drag.plantIndex,undefined);assert(drag.x>p.x);
  assert.equal(pickTarget(g.plants,{x:20,y:20},mobile),null);
  assert.deepEqual(pickTarget(g.plants,{x:2000,y:1000},{...mobile,dragging:true}),{x:27.5,y:13.5});
});
test('target steering reaches a root without oscillation at different frame rates',()=>{
  for(const dt of [1/120,1/60,1/30,.06]){
    const g=new Game(1,0,{assist:true});const target=pickTarget(g.plants,{x:172,y:180},mobile);
    for(let i=0;i<1000&&g.remaining===4;i++){const v=targetVector(g.player,target,SPEED,dt);g.update(dt,v.dx,v.dy);}
    assert.equal(g.remaining,3);assert(g.score>=100);assert.equal(targetVector(g.player,g.player,SPEED,dt).arrived,true);
  }
});
test('independent fingers can change direction and release without stuck movement',()=>{
  const input=new DirectionState(),right={},up={};input.press(7,1,0,right);assert.deepEqual(input.vector(),{dx:1,dy:0});
  input.press(8,0,-1,up);assert.deepEqual(input.vector(),{dx:1,dy:-1});
  input.release(7);assert.deepEqual(input.vector(),{dx:0,dy:-1});assert(!input.active(right));
  input.press(8,-1,0,right);assert.deepEqual(input.vector(),{dx:-1,dy:0});
  input.release(8);input.release(8);assert.deepEqual(input.vector(),{dx:0,dy:0});
  input.press(9,1,0,right);input.clear();assert.deepEqual(input.vector(),{dx:0,dy:0});
});
test('mobile grace times persist after retry and next level while difficulty still increases',()=>{
  const easy=new Game(1,0,{assist:true}),normal=new Game();
  assert(easy.difficulty.warning>normal.difficulty.warning);assert(easy.difficulty.floodStep>normal.difficulty.floodStep);assert(easy.farmer.clock>normal.farmer.clock);
  const interval=easy.difficulty.interval;easy.retry();assert.equal(easy.difficulty.interval,interval);
  easy.status='won';easy.next();assert.equal(easy.level,2);assert(easy.assist);assert(easy.difficulty.interval<interval);assert(easy.difficulty.warning>new Game(2).difficulty.warning);
});
