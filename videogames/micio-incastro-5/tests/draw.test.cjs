const test=require('node:test'),assert=require('node:assert/strict');
const D=require('../draw.js'),{Game,SHAPES}=require('../engine.js');
function canvasContract(){
 const calls=[];
 const ctx=new Proxy({arc(x,y,r){if(r<0){const e=new Error('The radius provided is negative');e.name='IndexSizeError';throw e;}calls.push(['arc',r]);}},{get:(o,k)=>k in o?o[k]:(...args)=>calls.push([k,...args])});
 return {ctx,calls};
}
test('hidden and undersized previews cannot abort startup for any kitten colour or shape',()=>{
 for(const [w,h]of [[0,0],[0,54],[110,0],[4,4],[16,12],[48,12],[NaN,54]])for(const cells of SHAPES)for(let color=0;color<4;color++){
  const {ctx,calls}=canvasContract();assert.doesNotThrow(()=>D.preview(ctx,w,h,[{cells,color}]));assert.equal(calls.some(c=>c[0]==='arc'),false);
 }
});
test('visible phone tray and desktop queue still draw kitten faces',()=>{
 for(const [w,h,n]of [[110,54,1],[116,38,1],[125,40,3],[76,40,3]]){
  const {ctx,calls}=canvasContract(),pieces=Array.from({length:n},()=>({cells:SHAPES[1],color:1}));D.preview(ctx,w,h,pieces);assert.ok(calls.some(c=>c[0]==='arc'&&c[1]>0));
 }
});
test('real playfield rendering draws the hex grid and cats after a phone placement',()=>{
 const g=new Game(()=>.4);g.reset('place');g.place(4,5);D.configure(true);const {ctx,calls}=canvasContract();D.board(ctx,390,844,g);assert.ok(calls.filter(c=>c[0]==='closePath').length>=108);assert.ok(calls.some(c=>c[0]==='arc'));assert.doesNotThrow(()=>D.objective(ctx,0,0,g));assert.doesNotThrow(()=>D.board(ctx,0,0,g));
});
