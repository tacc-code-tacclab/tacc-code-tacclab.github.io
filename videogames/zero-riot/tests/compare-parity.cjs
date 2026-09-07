const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const expected=JSON.parse(fs.readFileSync(path.join(__dirname,'parity-expected.json')));
const actual=JSON.parse(fs.readFileSync(path.join(__dirname,'parity-actual.json')));
function compare(a,b,key='root'){
 if(Array.isArray(a)){assert.equal(a.length,b.length,key);a.forEach((v,i)=>compare(v,b[i],key+'.'+i));}
 else if(a&&typeof a==='object'){assert.deepEqual(Object.keys(a).sort(),Object.keys(b).sort(),key);Object.keys(a).forEach(k=>compare(a[k],b[k],key+'.'+k));}
 else assert(Math.abs(a-b)<1e-6,`${key}: JavaScript ${a}, Lua ${b}`);
}
compare(expected,actual);console.log('PASS JS/Lua deterministic trace agrees within 1e-6 arena units.');
