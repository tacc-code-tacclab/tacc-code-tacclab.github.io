// Runtime smoke with a minimal DOM/canvas surface, not a browser or visual test.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const nodes=new Map();let draws=0,raf,time=1000;
const drawing=new Proxy({createRadialGradient:()=>({addColorStop(){}})}, {get(o,k){if(k in o)return o[k];return()=>{draws++;};},set(o,k,v){o[k]=v;return true;}});
function node(id){return {id,textContent:'',innerHTML:'',value:'',disabled:false,tagName:id==='share-fallback'?'TEXTAREA':'DIV',style:{},listeners:{},width:720,height:720,classList:{classes:new Set(),remove(c){this.classes.delete(c);},toggle(c,b){if(b)this.classes.add(c);else this.classes.delete(c);}},addEventListener(n,f){this.listeners[n]=f;},setAttribute(){},focus(){},select(){},setPointerCapture(){},getContext(){return drawing;},getBoundingClientRect(){return{left:0,top:0,width:id==='joystick'?112:720,height:id==='joystick'?112:720};}};}
for(const m of html.matchAll(/id="([^"]+)"/g))nodes.set(m[1],node(m[1]));
const doc={getElementById(id){assert(nodes.has(id),'Unknown HTML id '+id);return nodes.get(id);},hidden:false,listeners:{},addEventListener(n,f){this.listeners[n]=f;}};
const R=require('../core.js'),api={...R};for(const name of ['create','nextLevel','retryLevel'])api[name]=(...args)=>{const g=R[name](...args);api.latest=g;return g;};
const sandbox={document:doc,ZeroRiot:api,URL,URLSearchParams,Math,Date,Number,String,Set,Uint32Array,crypto:require('node:crypto').webcrypto,localStorage:{getItem:()=>null,setItem(){}},matchMedia:()=>({matches:false}),location:{href:'https://example.test/zero-riot/?seed=smoke',search:'?seed=smoke'},navigator:{},devicePixelRatio:1,requestAnimationFrame(f){raf=f;},listeners:{},addEventListener(n,f){this.listeners[n]=f;}};sandbox.window=sandbox;
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8'),sandbox);
function click(id){nodes.get(id).listeners.click();}function tick(n=1){for(let i=0;i<n;i++){time+=1000/60;raf(time);}}
tick(2);assert(draws>0);click('start');tick(2);assert.equal(api.latest.seed,'smoke');
let g=api.latest;const p=g.pickups[0],board=nodes.get('arena');
board.listeners.pointerdown({pointerId:9,clientX:p.x+10,clientY:p.y,preventDefault(){}});board.listeners.pointerup({pointerId:9});tick(160);
assert.equal(g.x,p.x);assert.equal(g.y,p.y);assert.equal(g.collected,1);assert.equal(g.target,null);
const start=g.x;sandbox.listeners.keydown({key:'d',target:{tagName:'CANVAS'},preventDefault(){}});tick(12);assert(g.x>start);sandbox.listeners.keyup({key:'d'});let x=g.x;tick(3);assert.equal(g.x,x);
const stick=nodes.get('joystick');stick.listeners.pointerdown({pointerId:1,clientX:112,clientY:56,preventDefault(){}});tick(12);assert(g.x>x);stick.listeners.pointercancel({pointerId:1});x=g.x;tick(3);assert.equal(g.x,x);
const value=g.pickups[0].v;click('flip');assert.equal(g.pickups[0].v,-value);tick(4);
click('pause');const t=g.time;tick(20);assert.equal(g.time,t);click('resume');tick(3);assert(g.time>t);
for(let level=1;level<=5;level++){
 g=api.latest;assert.equal(g.level,level);for(const q of [...g.pickups])R.collect(g,q);tick(3);assert(g.ended&&g.won);assert(!nodes.get('results').classList.classes.has('hidden'));
 assert.equal(nodes.get('time').textContent,'0');click('replay');
}
assert.equal(api.latest.level,1);assert.equal(api.latest.lives,3);assert.equal(api.latest.score,0);
console.log('PASS web tap-and-release, exact stop, keyboard, joystick cancel, flip, pause, remaining counter, next-level flow and final replay. Not visual browser QA.');
