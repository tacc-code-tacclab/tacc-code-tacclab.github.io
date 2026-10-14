const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('document has unique controls and every local asset reference exists',()=>{
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const needed of ['stage','play','fallback','left','right','release','calibrate','sound','screen','pause','resume','again','act-card'])assert.ok(ids.includes(needed),needed);
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const ref=m[1].split('?')[0];if(!ref.startsWith('http')&&!ref.startsWith('../'))assert.ok(fs.existsSync(path.join(root,ref)),ref);}
 assert.match(html,/ENABLE TILT/);assert.match(html,/A \/ D \+ SPACE/);assert.match(html,/lang="en"/);
});
test('scripts parse in their browser loading order and expose their modules',()=>{
 const context={console,globalThis:null,window:{},document:{},devicePixelRatio:1,matchMedia:()=>({matches:false})};context.globalThis=context;vm.createContext(context);
 for(const file of ['engine.js','draw.js','audio.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
 assert.equal(typeof context.FlyingVelvet.Game,'function');assert.equal(typeof context.FlyingVelvetDraw.render,'function');assert.equal(typeof context.FlyingVelvetAudio.create,'function');
});
test('manifest installs as a fullscreen landscape game with an existing icon',()=>{
 const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));assert.equal(m.display,'fullscreen');assert.equal(m.orientation,'landscape');assert.equal(m.lang,'en');assert.ok(fs.existsSync(path.join(root,m.icons[0].src)));
});
