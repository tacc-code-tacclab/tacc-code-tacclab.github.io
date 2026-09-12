(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BandiSearch = api;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’‘]/g, "'").trim();
  const compact = value => normalize(value).replace(/[^a-z0-9]/g, '');
  const deadline = call => new Date(call.deadlineAt || `${call.deadline}T23:59:59+01:00`);
  const isActive = (call, now = new Date()) => call.sourceStatus === 'open' && call.presentInLatestSource !== false && deadline(call) >= now;
  const isExpired = (call, now = new Date()) => deadline(call) < now || call.sourceStatus === 'closed';
  const daysLeft = (call, now = new Date()) => Math.max(0, Math.ceil((deadline(call) - now) / 86400000));
  function create(catalog) {
    const codeMap = new Map();
    const add = (key, value) => { key = compact(key); if (!codeMap.has(key)) codeMap.set(key, []); codeMap.get(key).push(value); };
    catalog.sectors.forEach(s => [s.code, ...s.oldCodes, s.name].forEach(k => add(k, { ssd: s.code, gsd: s.gsd })));
    catalog.groups.forEach(g => [g.code, g.name].forEach(k => add(k, { gsd: g.code, broad: true })));
    catalog.oldSC.forEach(sc => [sc.code, sc.name].forEach(k => {
      catalog.sectors.filter(s => s.oldSC.includes(sc.code)).forEach(s => add(k, { gsd: s.gsd, broad: true }));
    }));
    function alternatives(q) { return normalize(q).split(/\s+(?:o|or)\s+|[,;|]/).map(x => x.trim()).filter(Boolean); }
    function sectorMatch(call, input) {
      if (!input) return true;
      return alternatives(input).some(q => {
        // A datalist option begins with its precise code and a human label.
        const term = q.split(' — ')[0];
        const resolved = codeMap.get(compact(term));
        const rawCodes = (call.codes || []).map(compact);
        if (resolved) return resolved.some(r => r.broad
          ? (call.groupCodes || []).includes(r.gsd)
          : (call.sectorCodes || []).includes(r.ssd) || (!(call.sectorCodes || []).length && (call.groupCodes || []).includes(r.gsd)));
        if (rawCodes.includes(compact(term))) return true;
        return normalize([call.sector, call.gsd, ...(call.aliases || [])].join(' ')).includes(q);
      });
    }
    function queryMatch(call, input) {
      if (!input) return true;
      const haystack = normalize([call.title, call.description, call.institution, call.institutionLabel, call.city, call.region, call.role, call.sector, ...(call.aliases || [])].join(' '));
      return alternatives(input).some(q => {
        if (codeMap.has(compact(q))) return sectorMatch(call, q);
        return q.split(/\s+/).every(word => codeMap.has(compact(word)) ? sectorMatch(call, word) : haystack.includes(word));
      });
    }
    function matches(call, f, now = new Date()) {
      if (!queryMatch(call, f.query) || !sectorMatch(call, f.sector)) return false;
      if (f.role === 'RTT / Ricercatore TD') { if (!['RTT','RTD-A','RTD-B','Ricercatore PNRR','RTT / Ricercatore TD'].includes(call.role)) return false; }
      else if (f.role && call.role !== f.role) return false;
      const places = call.locations || [{name:call.city,region:call.region,code:call.cityCode}];
      if (f.region && !places.some(p=>normalize(p.region)===normalize(f.region))) return false;
      if (f.city) {
        const [name, province] = f.city.split(' — ');
        if (!places.some(p => normalize(p.name)===normalize(name) && (!f.region || normalize(p.region)===normalize(f.region)) && (!province || !p.province || p.province===province))) return false;
      }
      if (f.institution) {
        const q = normalize(f.institution);
        const inst = catalog.institutions.find(i => normalize(i.name) === q || i.id === f.institution || i.aliases.some(a => normalize(a) === q));
        if (inst ? call.institutionId !== inst.id : !normalize(call.institution + ' ' + call.institutionLabel).includes(q)) return false;
      }
      if (f.status === 'active' && !isActive(call,now)) return false;
      if (f.status === 'expired' && !isExpired(call,now)) return false;
      if (f.status === 'expiring' && (!isActive(call,now) || daysLeft(call,now)>7)) return false;
      return true;
    }
    return { matches, sectorMatch, queryMatch };
  }
  function sortCalls(calls, sort) {
    return [...calls].sort((a,b) => sort === 'newest' ? (b.published || '').localeCompare(a.published || '') : sort === 'institution' ? a.institution.localeCompare(b.institution,'it') : deadline(a)-deadline(b));
  }
  return { normalize, compact, create, isActive, isExpired, daysLeft, deadline, sortCalls };
});
