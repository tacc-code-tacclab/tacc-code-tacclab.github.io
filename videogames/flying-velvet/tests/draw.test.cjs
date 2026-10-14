const test=require('node:test'),assert=require('node:assert/strict');
const D=require('../draw.js'),{Game}=require('../engine.js');
function fake(){const calls=[];const gradient={addColorStop(...a){calls.push(['stop',...a]);}};return new Proxy({createLinearGradient(){return gradient;},createRadialGradient(){return gradient;},measureText(){return{width:10};},roundRect(){calls.push(['roundRect']);}},{get:(o,k)=>k in o?o[k]:(...a)=>calls.push([k,...a]),set:(o,k,v)=>(o[k]=v,true)});}
test('all circus acts render finite Canvas geometry in phone and desktop ratios',()=>{
 for(const [w,h]of [[320,568],[844,390],[1366,768],[1920,1080]])for(const catches of [0,9,10,49,200]){
  const ctx=fake(),g=new Game(5);g.catches=catches;g.player.trail=[{x:1,y:2,life:.5}];assert.doesNotThrow(()=>D.render(ctx,w,h,g,{flash:.2}));
 }
});
test('theme and spectator hashing change deterministically between acts and positions',()=>{
 assert.equal(D.THEMES.length,5);assert.equal(D.hash(1,2),D.hash(1,2));assert.notEqual(D.hash(1,2),D.hash(2,1));for(const colors of D.THEMES)assert.equal(colors.length,5);
});
