(function () {
  'use strict';
  const state = { calls: [], visible: 12, filtered: [], catalog: null, engine: null };
  const el = id => document.getElementById(id);
  const form = el('filters');
  const fields = ['query','sector','role','region','city','institution','status','sort'];
  const S = window.BandiSearch;
  const storage = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k,v) { try { localStorage.setItem(k,v); return true; } catch { return false; } }, remove(k) { try { localStorage.removeItem(k); } catch {} } };
  const escape = v => String(v || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => { try { const u = new URL(value); return u.protocol === 'https:' ? escape(u.href) : '#'; } catch { return '#'; } };
  const formatDay = date => date ? new Intl.DateTimeFormat('it-IT',{dateStyle:'medium',timeZone:'Europe/Rome'}).format(new Date(`${date}T12:00:00Z`)) : 'Non indicata';
  const formatInstant = date => new Intl.DateTimeFormat('it-IT',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Rome'}).format(new Date(date));
  const currentFilters = () => Object.fromEntries(fields.map(f => [f, el(f).value.trim()]));
  function options(id, entries) {
    el(id).replaceChildren(...entries.map(e => { const o = document.createElement('option'); o.value = typeof e === 'string' ? e : e.value; o.textContent = typeof e === 'string' ? e : e.label; return o; }));
  }
  function cities() {
    if (!state.catalog) return;
    const q = S.normalize(el('city').value.split(' — ')[0]);
    const region = el('region').value;
    options('city-options', state.catalog.cities.filter(c => (!region || c.region === region) && (!q || [c.name,...c.aliases].some(n => S.normalize(n).includes(q)))).slice(0,100).map(c => ({value:`${c.name} — ${c.province}`,label:c.region})));
  }
  function setFilters(values) { form.reset(); fields.forEach(f => { if (typeof values[f] === 'string') el(f).value = values[f]; }); cities(); }
  function makeQuery(f) {
    const p = new URLSearchParams();
    Object.entries(f).forEach(([k,v]) => { if (v && !(k==='status' && v==='active') && !(k==='sort' && v==='deadline')) p.set(k,v); });
    return `${location.pathname}${p.size ? '?'+p : ''}`;
  }
  function card(c) {
    const active = S.isActive(c), expired = S.isExpired(c), n = S.daysLeft(c);
    const label = active ? (n <= 1 ? 'Scadenza vicina' : `${n} giorni`) : expired ? 'Scaduto / chiuso' : 'Stato da verificare';
    const a = document.createElement('article'); a.className = 'call-card';
    const place = [c.city,c.region].filter(Boolean).join(', ') || 'Sede da verificare nel bando';
    a.innerHTML = `<div class="call-top"><div class="badges"><span class="badge status ${active?'':'expired'}">${label}</span><span class="badge">${escape(c.role)}</span></div><span class="deadline">Scadenza · ${c.deadlineAt ? formatInstant(c.deadlineAt) : formatDay(c.deadline)} (Italia)</span></div>
      <h3>${escape(c.title)}</h3><div class="call-meta"><span>⌂ ${escape(c.institution)}</span><span>⌖ ${escape(place)}</span><span>Pubblicato ${formatDay(c.published)}</span></div>
      <p class="sector">${escape(c.sector || c.gsd || 'Settore da verificare nel bando')}</p>
      ${c.aliases?.length ? `<p class="code-aliases">Codici equivalenti: ${escape(c.aliases.filter(x => /\d/.test(x)).join(' · '))}</p>`:''}
      ${c.locationNote ? `<p class="small-text">${escape(c.locationNote)}</p>`:''}
      ${c.detailVerified === false ? '<p class="small-text">Scheda importata dalla lista MUR; dettaglio non verificato nell’ultimo controllo.</p>':''}
      <div class="call-bottom"><span class="source">Fonte: MUR · Bandi</span><a class="official" href="${safeUrl(c.url)}" target="_blank" rel="noopener">Verifica il bando ufficiale ↗</a></div>`;
    return a;
  }
  function render(reset = true) {
    if (!state.engine) return;
    if (reset) state.visible = 12;
    const f = currentFilters();
    state.filtered = S.sortCalls(state.calls.filter(c => state.engine.matches(c,f)),f.sort);
    const cards = el('cards'); cards.replaceChildren(...state.filtered.slice(0,state.visible).map(card)); cards.setAttribute('aria-busy','false');
    if (!state.filtered.length) cards.append(el('empty-template').content.cloneNode(true));
    el('result-count').textContent = state.filtered.length;
    const active = state.filtered.filter(c => S.isActive(c)).length, expired = state.filtered.filter(c => S.isExpired(c)).length;
    el('result-summary').textContent = `${active} aperti · ${expired} scaduti/chiusi${state.filtered.length-active-expired ? ` · ${state.filtered.length-active-expired} da verificare`:''}`;
    el('load-more').hidden = state.visible >= state.filtered.length;
    history.replaceState(null,'',makeQuery(f)+location.hash);
  }
  function savedState() {
    const exists = !!storage.get('ateneo-bandi-search');
    el('restore-search').hidden = !exists; el('delete-search').hidden = !exists;
  }
  async function init() {
    try {
      const [data,catalog] = await Promise.all(['data/calls.json','data/catalogs.json'].map(async url => { let r; try { r = await fetch('https://raw.githubusercontent.com/tacc-code-tacclab/tacc-code-tacclab.github.io/main/services/ateneo-bandi/'+url+'?v=2&t='+Math.floor(Date.now()/300000),{cache:'no-store'}); if (!r.ok) throw new Error('Snapshot non disponibile'); } catch { r = await fetch(url,{cache:'no-store'}); } if (!r.ok) throw new Error('Dati non disponibili'); return r.json(); }));
      state.calls = data.calls; state.catalog = catalog; state.engine = S.create(catalog);
      catalog.regions.forEach(r => { const o=document.createElement('option'); o.value=r; o.textContent=r; el('region').append(o); });
      options('institution-options', [...catalog.institutions].sort((a,b) => a.name.localeCompare(b.name,'it')).map(i => ({value:i.name,label:[i.city,i.region,...i.aliases].filter(Boolean).join(' · ')})));
      const sectors = [...catalog.sectors.map(s => ({value:`${s.code} — ${s.name}`,label:`ex ${s.oldCodes.join(', ')} · ${s.gsd}`})), ...catalog.groups.map(g => ({value:`${g.code} — ${g.name}`,label:'Gruppo scientifico-disciplinare'})), ...catalog.oldSC.map(g => ({value:`${g.code} — ${g.name}`,label:'Settore concorsuale precedente'})), ...catalog.oldSectors.map(s => ({value:s.code,label:s.name}))];
      options('sector-options',sectors);
      el('catalog-summary').textContent = `${catalog.institutions.filter(i=>i.kind==='ateneo').length} istituzioni universitarie · ${catalog.institutions.filter(i=>i.kind!=='ateneo').length} altri enti · 20 regioni · ${catalog.cities.length.toLocaleString('it-IT')} comuni · ${catalog.groups.length} GSD · ${catalog.sectors.length} SSD attuali + codici storici`;
      el('freshness').textContent = `Ultimo controllo · ${formatInstant(data.updatedAt)}`;
      const stale = Date.now()-new Date(data.updatedAt).getTime()>36*3600000;
      el('data-notice').textContent = (stale ? 'ATTENZIONE: l’indice non viene aggiornato da oltre 36 ore. ' : '') + data.coverageNote;
      el('data-notice').hidden = false;
      const names = {professors:'Professori',researchers:'Ricercatori',contracts:'Contratti di ricerca',postdoc:'Post-doc',research:'Incarichi di ricerca',grants:'Assegni',phd:'Dottorati',technologists:'Tecnologi'};
      el('coverage-details').innerHTML = `<p>Ogni categoria viene interrogata su tutti gli enti, senza filtro territoriale. Le date sono interpretate nel fuso Europe/Rome.</p><ul>${(data.coverage||[]).map(c=>`<li><a target="_blank" rel="noopener" href="${safeUrl(c.url)}">${escape(names[c.category]||c.category)}</a>: ${c.parsed}/${c.expected} schede · ${formatInstant(c.checkedAt)}</li>`).join('')}</ul><p>Un elenco completo di atenei non garantisce che ogni bando sia comunicato al MUR. L’archivio del servizio cresce con le acquisizioni; per lo storico integrale consulta la fonte.</p>`;
      setFilters(Object.fromEntries(new URLSearchParams(location.search))); render(); savedState();
    } catch(error) {
      el('cards').setAttribute('aria-busy','false'); el('cards').innerHTML='<div class="empty"><h3>Dati momentaneamente non disponibili.</h3><p>Consulta il portale ufficiale MUR nella sezione Fonti.</p></div>';
      el('data-notice').textContent=error.message;el('data-notice').hidden=false;
    }
  }
  form.addEventListener('submit',e=>{e.preventDefault();render();el('results').scrollIntoView({behavior:'smooth'});});
  form.addEventListener('change',e=>{if(e.target.id==='region'){el('city').value='';cities();}render();});
  let timer; ['query','sector','city','institution'].forEach(id=>el(id).addEventListener('input',()=>{if(id==='city')cities();clearTimeout(timer);timer=setTimeout(()=>render(),180);}));
  el('reset').addEventListener('click',()=>{form.reset();cities();render();});
  el('load-more').addEventListener('click',()=>{state.visible+=12;render(false);});
  document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{setFilters(JSON.parse(b.dataset.preset));render();el('results').scrollIntoView({behavior:'smooth'});}));
  el('save-search').addEventListener('click',()=>{el('save-status').textContent=storage.set('ateneo-bandi-search',JSON.stringify(currentFilters()))?'Ricerca salvata su questo dispositivo.':'Il browser non permette di salvare: copia il link.';savedState();});
  el('restore-search').addEventListener('click',()=>{try{setFilters(JSON.parse(storage.get('ateneo-bandi-search'))||{});render();el('save-status').textContent='Ricerca ripristinata.';}catch{storage.remove('ateneo-bandi-search');savedState();}});
  el('delete-search').addEventListener('click',()=>{storage.remove('ateneo-bandi-search');savedState();el('save-status').textContent='Ricerca salvata eliminata.';});
  el('share-search').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.origin+makeQuery(currentFilters()));el('save-status').textContent='Link copiato.';}catch{el('save-status').textContent='Copia l’indirizzo dalla barra del browser: contiene già i filtri.';}});
  document.querySelector('.theme').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;storage.set('theme',next);});
  init();
})();
