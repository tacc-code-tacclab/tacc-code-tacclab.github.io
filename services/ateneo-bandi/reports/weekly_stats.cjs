'use strict';

function summarize(data,catalog,start,end) {
 const names={professors:"Professori",researchers:"Ricercatori RTT/RTD",contracts:"Contratti di ricerca",postdoc:"Post-doc",research:"Incarichi di ricerca",grants:"Assegni",phd:"Dottorati",technologists:"Tecnologi"};
 const inst=new Map(catalog.institutions.map(x=>[x.id,x])), groups=new Map(catalog.groups.map(x=>[x.code,x.name]));
 const uniq=new Map();for(const c of data.calls){const key=c.id||c.url;if(!key)throw Error("Missing call identity");if(!uniq.has(key))uniq.set(key,c);}
 const rows=[...uniq.values()].filter(c=>/^\d{4}-\d{2}-\d{2}$/.test(c.published||"")&&c.published>=start&&c.published<end);
 const freq=(items)=>{const counts=new Map();for(const [key,name] of items){const v=counts.get(key)||{key,name,count:0};v.count++;counts.set(key,v);}return [...counts.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,"it"))};
 function rank(xs){const universityRows=xs.filter(c=>inst.get(c.institutionId)?.kind==="ateneo");return {count:xs.length,universities:freq(universityRows.map(c=>[c.institutionId,inst.get(c.institutionId).name])),otherEntityCalls:xs.length-universityRows.length,gsd:freq(xs.flatMap(c=>[...new Set(c.groupCodes||[])].map(code=>[code,groups.get(code)||code]))),missingSector:xs.filter(c=>!c.groupCodes?.length).length};}
 const cats=new Map();for(const c of rows){const key=c.category==="professors"?c.role:(names[c.category]||c.category);if(!cats.has(key))cats.set(key,[]);cats.get(key).push(c);}
 const categories=[...cats].map(([name,xs])=>({name,...rank(xs)})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,"it"));
 return {period:{start,endExclusive:end},updatedAt:data.updatedAt,...rank(rows),categories,missingPublicationDates:[...uniq.values()].filter(c=>!/^\d{4}-\d{2}-\d{2}$/.test(c.published||"")).length};
}

module.exports = { summarize };

