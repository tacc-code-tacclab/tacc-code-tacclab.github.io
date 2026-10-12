const test=require('node:test'),assert=require('node:assert/strict');
const {PieceMotion}=require('../motion.js'),{rotate,SHAPES}=require('../engine.js'),D=require('../draw.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≈ ${b}`);
test('rotations follow circular arcs, keep the shape rigid and settle exactly in 120 ms',()=>{
 for(const cells of SHAPES){
  const m=new PieceMotion(),p={q:4,r:3,cells,color:1};m.set(p,'piece',0);m.set({...p,cells:rotate(cells)},'piece',10);
  for(const t of [10,20,50,100,129]){
   const pose=m.sample(t);for(let i=0;i<cells.length;i++)for(let j=0;j<i;j++){
    const distance=cs=>{const [q,r]=cs[i],[q2,r2]=cs[j];return Math.hypot((q-q2)*1.5,(r-r2+(q-q2)/2)*Math.sqrt(3));};
    near(distance(pose.cells),distance(cells));
   }
  }
  assert.deepEqual(m.sample(130).cells,rotate(cells));assert.equal(m.busy(130),false);assert.deepEqual(p.cells,cells);
 }
});
test('direct pointer movement does not restart an unfinished rotation or lag behind the finger',()=>{
 const m=new PieceMotion(),p={q:4,r:3,cells:SHAPES[1],color:2};m.set(p,'piece',0);const rotated={...p,cells:rotate(p.cells)};m.set(rotated,'piece',10);
 for(let t=20;t<=150;t+=10){const q=t/30,r=t/60;m.set({...rotated,q,r},'piece',t,true);const pose=m.sample(t);near(pose.q,q);near(pose.r,r);}
 assert.equal(m.busy(150),false);assert.deepEqual(m.sample(150).cells,rotated.cells);
});
test('interrupted movement starts from its visible location and replacements never animate across the field',()=>{
 const m=new PieceMotion(),p={q:4,r:3,cells:SHAPES[2],color:0};m.set(p,'first',0);m.set({...p,q:5},'first',10);
 const midway=m.sample(40);m.set({...p,q:3},'first',40);near(m.sample(40).q,midway.q);near(m.sample(125).q,3);
 m.set({...p,q:0},'second',130);assert.equal(m.sample(130).q,0);assert.equal(m.busy(130),false);
 m.set(null,'second',140);assert.equal(m.sample(140),null);
 const reduced=new PieceMotion(true);reduced.set(p,'x',0);reduced.set({...p,cells:rotate(p.cells),q:1},'x',1);assert.equal(reduced.busy(1),false);assert.equal(reduced.sample(1).q,1);
});
test('settled visual axial coordinates match every legal engine grid location',()=>{
 for(const mobile of [true,false])for(const [w,h]of [[390,844],[844,390],[1920,1080]]){
  D.configure(mobile);const g=D.geometry(w,h);
  for(let x=0;x<9;x++)for(let y=0;y<12;y++){
   const a=D.posePoints(g,{q:x,r:y-Math.floor(x/2),cells:[[0,0]],color:1})[0],b=D.point(g,x,y);near(a.x,b.x);near(a.y,b.y);
  }
 }
});
