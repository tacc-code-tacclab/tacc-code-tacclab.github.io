const assert = require('node:assert/strict');
const S = require('../search.js');
const catalog = require('../data/catalogs.json');
const engine = S.create(catalog);
const now = new Date('2026-09-12T10:00:00Z');
const mol = {role:'Professore ordinario',sourceStatus:'open',presentInLatestSource:true,deadlineAt:'2026-09-12T13:00:00+02:00',title:'Selezione di prima fascia',sector:'Biologia molecolare',codes:['BIOS-08/A'],sectorCodes:['BIOS-08/A'],groupCodes:['05/BIOS-08'],institutionId:'UNIPD',institution:'Università degli studi di Padova',institutionLabel:'Univ. PADOVA',city:'Padova',region:'Veneto'};
const genetics = {...mol,sector:'Genetica',codes:['BIOS-14/A'],sectorCodes:['BIOS-14/A'],groupCodes:['05/BIOS-14']};
const clinical = {...mol,sector:'Biochimica clinica e biologia molecolare clinica',codes:['BIOS-09/A'],sectorCodes:['BIOS-09/A'],groupCodes:['05/BIOS-09']};
const pharmacology = {...mol,sector:'Farmacologia',codes:['BIOS-11/A'],sectorCodes:['BIOS-11/A'],groupCodes:['05/BIOS-11']};
for (const code of ['BIO11','bio/11','BIOS08A','BIOS-08/A','05/BIOS-08','05/E2','Biologia molecolare']) {
 assert(engine.matches(mol,{sector:code,status:'active'},now),code);
 assert(!engine.matches(clinical,{sector:code},now),`clinical false positive: ${code}`);
 assert(!engine.matches(pharmacology,{query:code},now),`pharmacology false positive: ${code}`);
}
for (const code of ['BIO18','BIO/18','BIOS-14/A','05/BIOS-14','05/I1','genetica']) assert(engine.matches(genetics,{query:code},now),code);
assert(engine.matches(mol,{sector:'biologia molecolare o genetica'},now));
assert(engine.matches(genetics,{sector:'BIO11, BIO18'},now));
assert(!engine.matches(clinical,{sector:'BIO11 o BIO18'},now));
assert(!engine.matches({...mol,role:'Professore associato'},{role:'Professore ordinario'},now));
assert(!engine.matches(mol,{region:'Lombardia'},now));
assert(engine.matches(mol,{institution:'UNIPD',city:'Padova',region:'Veneto'},now));
assert(S.isActive(mol,new Date('2026-09-12T10:59:59Z')));
assert(!S.isActive(mol,new Date('2026-09-12T11:00:01Z')));
assert(!S.isActive({...mol,sourceStatus:'closed'},now));
assert(!S.isActive({...mol,presentInLatestSource:false},now));
assert.equal(S.sortCalls([{published:null,deadlineAt:mol.deadlineAt},{published:'2026-09-01',deadlineAt:mol.deadlineAt}],'newest')[0].published,'2026-09-01');
assert.equal(catalog.regions.length,20);assert.equal(catalog.cities.length,7894);assert.equal(catalog.sectors.length,366);assert.equal(catalog.groups.length,190);assert.equal(catalog.oldSC.length,190);
assert(catalog.institutions.filter(i=>i.kind==='ateneo').length>=102);
for(const id of ['UNIPD','UNITO','UNIPA','UNICATT','ECAMPUS','SISSA','UNIBZ','UNINEUROMED']) assert(catalog.institutions.some(i=>i.id===id),id);
for(const name of ['Rovigo','Cesena','Fano','Olbia','Aosta']) assert(catalog.cities.some(c=>c.name===name),name);
for(const s of catalog.sectors){assert(s.oldCodes.length,s.code);assert(s.oldSC.length,s.code);assert(catalog.groups.some(g=>g.code===s.gsd),s.code);}
console.log('PASS: national catalogs, exact scientific matches, code aliases, OR search, institution and Rome deadlines.');
