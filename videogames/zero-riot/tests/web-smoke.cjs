// Runtime smoke with a minimal DOM/canvas surface, not a browser or visual test.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const nodes=new Map();let draws=0,raf,time=1000;
const drawing=new Proxy({createRadialGradient:()=>({addColorStop(){}})}, {get(o,k){if(k in o)return o[k];return()=>{draws++;};},set(o,k,v){o[k]=v;return true;}});
function node(id){return {id,textContent:'',innerHTML:'',value:'',disabled:false,tagName:id==='share-fallback'?'TEXTAREA':'DIV',style:{},listeners:{},width:720,height:720,classList:{classes:new Set(),toggle(c,b){if(b)this.classes.add(c);else this.classes.delete(c);}},addEventListener(n,f){this.listeners[n]=f;},setAttribute(){},focus(){},select(){},setPointerCapture(){},getContext(){return drawing;},getBoundingClientRect(){return{left:0,top:0,width:id==='joystick'?112:720,height:id==='joystick'?112:720};}};}
for(const m of html.matchAll(/id="([^"]+)"/g))nodes.set(m[1],node(m[1]));
const doc={getElementById(id){assert(nodes.has(id),'Unknown HTML id '+id);return nodes.get(id);},hidden:false,listeners:{},addEventListener(n,f){this.listeners[n]=f;}};
const R=require('../core.js'),api={...R,create(seed){const g=R.create(seed);api.latest=g;return g;}};
const sandbox={document:doc,ZeroRiot:api,URL,URLSearchParams,Math,Date,Number,String,Set,Uint32Array,crypto:require('node:crypto').webcrypto,localStorage:{getItem:()=>null,setItem(){}},matchMedia:()=>({matches:false}),location:{href:'https://example.test/zero-riot/?seed=smoke',search:'?seed=smoke'},navigator:{},devicePixelRatio:1,requestAnimationFrame(f){raf=f;},listeners:{},addEventListener(n,f){this.listeners[n]=f;}};sandbox.window=sandbox;
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8'),sandbox);
function click(id){nodes.get(id).listeners.click();}function tick(n=1){for(let i=0;i<n;i++){time+=1000/60;raf(time);}}
tick(2);assert(draws>0);click('start');tick(2);assert.equal(api.latest.seed,'smoke');api.latest.pickups=[];api.latest.spawnAt=999;
const g=api.latest,start=g.x;sandbox.listeners.keydown({key:'d',target:{tagName:'CANVAS'},preventDefault(){}});tick(12);assert(g.x>start);sandbox.listeners.keyup({key:'d'});let x=g.x;tick(3);assert.equal(g.x,x);
const stick=nodes.get('joystick');stick.listeners.pointerdown({pointerId:1,clientX:112,clientY:56,preventDefault(){}});tick(12);assert(g.x>x);stick.listeners.pointercancel({pointerId:1});x=g.x;tick(3);assert.equal(g.x,x);
g.pickups=[{id:101,x:50,y:70,v:3,wait:0}];g.charge=0;click('flip');assert.equal(g.pickups[0].v,-3);assert(g.flipCooldown>0);tick(4);
click('pause');const t=g.time;tick(20);assert.equal(g.time,t);click('resume');tick(3);assert(g.time>t);
g.time=89.99;g.pickups=[];tick(3);assert(g.ended&&g.won);assert(!nodes.get('results').classList.classes.has('hidden'));
click('replay');assert.equal(api.latest.time,0);assert.equal(api.latest.lives,3);assert.equal(api.latest.score,0);
console.log('PASS web initialization, drawing calls, keyboard, touch release, flip, pause, end screen and replay. This is not visual browser QA.');
