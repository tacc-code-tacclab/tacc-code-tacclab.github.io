"""National MUR index. Explicit categories, count reconciliation, Rome deadlines.
Atomic publication only after all eight national result lists reconcile. Detail
failures remain visible in coverage; they never become an empty successful digest.
"""
import argparse, hashlib, json, re, time, unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from zoneinfo import ZoneInfo
import requests
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
BASE='https://bandi.mur.gov.it'
CATEGORIES={
 'professors':('profcalls','Jobs','jv','Professore'),
 'researchers':('jobs','Jobs','jv','RTT / Ricercatore TD'),
 'contracts':('contrattidiricerca','Fellowship','jf','Contratto di ricerca'),
 'postdoc':('incarichipostdoc','Fellowship','jf','Incarico post-doc'),
 'research':('incarichidiricerca','Fellowship','jf','Incarico di ricerca'),
 'grants':('bandi','Fellowship','jf','Assegno di ricerca'),
 'phd':('doctorate','Fellowship','jf','Dottorato'),
 'technologists':('tecno','Jobs','jv','Tecnologo')}
CODE=re.compile(r'(?<![\w/-])(?:\d{2}/[A-Z]{4}-\d{2}|[A-Z]{4}-\d{2}/[A-Z]|[A-Z]+(?:-[A-Z]+)?/\d{2}|\d{2}/[A-Z]\d)(?![\w/-])')
def clean(s):return ' '.join(str(s or '').split())
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',clean(s)).casefold() if unicodedata.category(c)!='Mn')
def canonical(url):return 'https://'+urlsplit(url).netloc+urlsplit(url).path

def get(url,cache=None):
 if cache and cache.exists():return cache.read_bytes()
 for attempt in range(3):
  try:
   r=requests.get(url,timeout=(15,55),headers={'User-Agent':'AteneoBandi/2.0 (+https://tacc-code-tacclab.github.io/services/ateneo-bandi/)'});r.raise_for_status()
   if cache:cache.parent.mkdir(parents=True,exist_ok=True);cache.write_bytes(r.content)
   return r.content
  except requests.RequestException:
   if attempt==2:raise
   time.sleep(1+attempt)

def parse_deadline(text):
 m=re.search(r'(\d{2})/(\d{2})/(\d{4})(?:\s*-?\s*alle ore\s*(\d{1,2}):(\d{2}))?',text)
 if not m:raise ValueError('Missing deadline: '+text[:100])
 d,mo,y,h,mi=m.groups();dt=datetime(int(y),int(mo),int(d),int(h or 23),int(mi or 59),0 if h else 59,tzinfo=ZoneInfo('Europe/Rome'))
 return dt.date().isoformat(),dt.isoformat()

def role_for(kind,role_text):
 t=norm(role_text)
 if kind=='professors':
  if 'prima fascia' in t:return 'Professore ordinario'
  if 'seconda fascia' in t:return 'Professore associato'
  return 'Professore · fascia da verificare'
 if kind=='researchers':
  if '(a)' in t:return 'RTD-A'
  if '(b)' in t:return 'RTD-B'
  if 'pnrr' in t:return 'Ricercatore PNRR'
  if 'rtt' in t:return 'RTT'
 return CATEGORIES[kind][3]

def parse_list(html,kind,allow_filtered_empty=False):
 soup=BeautifulSoup(html,'html.parser');text=soup.get_text(' ',strip=True)
 count=re.search(r'trovati\s+(\d+)\s+bandi',text,re.I)
 if count:expected=int(count[1])
 elif re.search(r'Totale bandi aperti:\s*0\b',text):expected=0
 elif allow_filtered_empty and 'Risultato della ricerca bandi' in text and soup.select_one('form select[name=idqualifica]'):expected=0
 else:raise ValueError(kind+': missing count; source format changed')
 records=[]
 for p in soup.select('.result > p'):
  a=p.select_one('a[href*="/public/"]');em=p.find('em');strong=p.find('strong')
  if not a or not em or not strong:raise ValueError(kind+': malformed result')
  url=canonical(urljoin(BASE,a['href']));raw_role=a.find('i');role=role_for(kind,raw_role.text if raw_role else '')
  if raw_role:raw_role.extract()
  deadline,instant=parse_deadline(em.get_text(' ',strip=True))
  sectors=[clean(x.text).removeprefix('Settore ') for x in p.find_all('strong')[1:]]
  records.append({'id':kind+'-'+url.rsplit('/',1)[-1],'url':url,'category':kind,'title':clean(a.text),'role':role,'institutionLabel':clean(strong.text),'institution':clean(strong.text),'deadline':deadline,'deadlineAt':instant,'sourceStatus':'closed' if 'scaduto' in em.get('class',[]) else 'open','sector':' · '.join(sectors),'codes':sorted(set(CODE.findall(' '.join(sectors)))),'published':None,'city':'','region':'','source':'MUR · Bandi'})
 if len(records)!=expected or len({r['id'] for r in records})!=expected:raise ValueError(f'{kind}: expected {expected}, parsed {len(records)}; refusing partial publication')
 entities={o['value']:clean(o.text) for o in soup.select('select[name="bb_type_code"] option') if o['value']!='%'}
 return records,entities,expected

def detail(call,html):
 soup=BeautifulSoup(html,'html.parser');fields={}
 for row in soup.select('table tr'):
  cells=row.find_all(['th','td'],recursive=False)
  if len(cells)>=2:fields.setdefault(norm(cells[0].get_text(' ',strip=True)),[]).append(clean(cells[1].get_text(' ',strip=True)))
 def first(key):return next((x for x in fields.get(norm(key),[]) if x and x!='-'),'')
 title=first('Titolo del progetto di ricerca in italiano') or first('Titolo del progetto in italiano')
 if not title:title=next((v[0] for k,v in fields.items() if k.startswith('titolo') and 'italiano' in k),'')
 if not title:raise ValueError('Missing detail title '+call['url'])
 call['title']=title
 call['city']=first('Città')
 call['gsd']=first('G.S.D.')
 ssd=first('S.S.D') or first('S.S.D.')
 call['sector']=ssd or call['sector'] or call['gsd']
 sector_fields=' '.join(sum([v for k,v in fields.items() if k.startswith(('s.s.d','g.s.d','settore concorsuale'))],[]))
 call['codes']=sorted(set(call['codes']+CODE.findall(sector_fields)))
 pub=first('Data del bando')
 if pub:call['published']=parse_deadline(pub)[0]
 due=first('Data di scadenza del bando')
 if not due:raise ValueError('Missing detail deadline')
 call['deadline'],call['deadlineAt']=parse_deadline(due)
 call['description']=first('Descrizione sintetica in italiano')[:3500]
 call['detailVerified']=True
 call['checkedAt']=datetime.now(timezone.utc).isoformat()
 return call

def enrich(call,catalog,labels):
 inst=labels.get(norm(call.get('institutionLabel',''))) or labels.get(norm(call.get('institution','')))
 if inst:call['institutionId']=inst['id'];call['institution']=inst['name']
 raw=clean(call.get('city',''));call['sourceCity']=raw
 aliases={'milan':'Milano','rome':'Roma','florence':'Firenze','naples':'Napoli','reggio calabria':'Reggio di Calabria','firenzaee':'Firenze','pieve emanuele - milano':'Pieve Emanuele','pollenzo fraz. di bra':'Bra','sesto fiorentino (fi) – italia':'Sesto Fiorentino','via menicucci 660121 ancona ancona':'Ancona'}
 raw=aliases.get(norm(raw),raw)
 cities=catalog['_cities'];found=cities.get(norm(raw)) or cities.get(norm(re.sub(r'\s*\([^)]*\)\s*$','',raw)))
 places=[found] if found else []
 if not places and re.search(r'\s*-\s*',raw):
  parts=re.split(r'\s*-\s*',raw)
  if all(norm(p) in cities for p in parts):places=[cities[norm(p)] for p in parts]
 if places:
  call['locations']=[{k:c[k] for k in ['name','code','region','province']} for c in places]
  call['city']=', '.join(c['name'] for c in places);call['region']=', '.join(dict.fromkeys(c['region'] for c in places))
  if len(places)==1:call['cityCode']=places[0]['code']
 elif not raw and inst and inst.get('city'):
  call['city']=inst['city'];call['region']=inst.get('region','');call['locationNote']='Sede dell’ateneo; verifica la sede di lavoro nel bando.'
 elif 'province of matera' in norm(raw):call['region']='Basilicata';call['locationNote']='La fonte indica la provincia di Matera, senza specificare il comune.'
 elif not call.get('region'):call['region']=''
 codes=set(call.get('codes',[]));ssd=[]
 for s in catalog['sectors']:
  if s['code'] in codes or set(s['oldCodes']) & codes:ssd.append(s)
 # When only a GSD is supplied do not invent a specific SSD in a multi-SSD group.
 call['sectorCodes']=[s['code'] for s in ssd]
 if ssd:call['sector']=' · '.join(s['code']+' — '+s['name'] for s in ssd)
 call['groupCodes']=sorted(set([s['gsd'] for s in ssd]+[c for c in codes if re.fullmatch(r'\d{2}/[A-Z]{4}-\d{2}',c)]))
 if not call['groupCodes']:
  call['groupCodes']=sorted({item['gsd'] for item in catalog['sectors'] if set(item['oldSC']) & codes})
 call['aliases']=sorted(set(sum([s['oldCodes']+s['oldSC']+[s['name']] for s in ssd],[])))
 call['sectorCode']=' · '.join(call['sectorCodes'])
 return call

def active(call,now=None):
 return call.get('sourceStatus')=='open' and bool(call.get('deadlineAt')) and datetime.fromisoformat(call['deadlineAt'])>=(now or datetime.now(timezone.utc)) and call.get('presentInLatestSource',True)

def main(source_dir=None,workers=4):
 catalog=json.loads((ROOT/'data/catalogs.json').read_text());entities={i['id']:i for i in catalog['institutions']};calls=[];coverage=[]
 source_dir=Path(source_dir) if source_dir else None
 # All list checks finish successfully before any public JSON is replaced.
 for kind,(path,form,status,role) in CATEGORIES.items():
  url=f'{BASE}/{path}.php/public/cerca{form}?azione=cerca&{status}_comp_status_id=2-3'
  rows,names,total=parse_list(get(url,source_dir/(kind+'.html') if source_dir else None),kind)
  for key,name in names.items():
   if key not in entities:entities[key]={'id':key,'name':name,'city':'','region':'','kind':'ente','aliases':[]}
   elif name not in entities[key]['aliases']:entities[key]['aliases'].append(name)
  calls.extend(rows);coverage.append({'category':kind,'expected':total,'parsed':len(rows),'url':url,'checkedAt':datetime.now(timezone.utc).isoformat(),'status':'ok'})
  print(kind,total,flush=True)
 research_roles={}
 for code,role in {'21':'RTD-A','22':'RTD-B','81':'Ricercatore PNRR','82':'RTT'}.items():
  url=f'{BASE}/jobs.php/public/cercaJobs?azione=cerca&jv_comp_status_id=2-3&idqualifica={code}'
  rows,_,total=parse_list(get(url,source_dir/('role-'+code+'.html') if source_dir else None),'researchers',allow_filtered_empty=True)
  for c in rows:
   if c['id'] in research_roles:raise ValueError('Overlapping researcher categories')
   research_roles[c['id']]=role
 if set(research_roles)!={c['id'] for c in calls if c['category']=='researchers'}:raise ValueError('Researcher subtypes do not reconcile')
 for c in calls:
  if c['id'] in research_roles:c['role']=research_roles[c['id']]
 known_names={norm(n) for i in entities.values() for n in [i['name']]+i['aliases']}
 for call in calls:
  name=call['institutionLabel']
  if norm(name) not in known_names:
   key='mur-'+hashlib.sha1(name.encode()).hexdigest()[:12];entities[key]={'id':key,'name':name,'city':'','region':'','kind':'ente','aliases':[]};known_names.add(norm(name))
 catalog['institutions']=list(entities.values()); labels={norm(n):i for i in entities.values() for n in [i['name']]+i['aliases'] if n}
 citymap={norm(n):c for c in catalog['cities'] for n in [c['name']]+c['aliases'] if n};catalog['_cities']=citymap
 old=json.loads((ROOT/'data/calls.json').read_text()) if (ROOT/'data/calls.json').exists() else {'calls':[]}
 failures=[];completed=[]
 def worker(c):
  try:return detail(c,get(c['url'],source_dir/'details'/(c['id']+'.html') if source_dir else None))
  except Exception as e:c['detailVerified']=False;failures.append(c['id']);print('DETAIL FAILED',c['id'],type(e).__name__,flush=True);return c
 with ThreadPoolExecutor(max_workers=workers) as ex:
  for f in as_completed([ex.submit(worker,c) for c in calls]):
   c=enrich(f.result(),catalog,labels);c['presentInLatestSource']=True;completed.append(c)
   if len(completed)%50==0:print('Details',len(completed),'/',len(calls),flush=True)
 urls={c['url'] for c in completed};now=datetime.now(timezone.utc)
 for c in old['calls']:
  if canonical(c['url']) in urls:continue
  # Retain history, but never treat absence from today's active list as confirmation.
  c['presentInLatestSource']=False
  path=urlsplit(c['url']).path.split('.php')[0].lstrip('/')
  kind=next((k for k,v in CATEGORIES.items() if v[0]==path),None)
  if not kind:continue
  c['category']=kind;c['id']=kind+'-'+c['url'].rsplit('/',1)[-1]
  if kind not in ['professors','researchers']:c['role']=CATEGORIES[kind][3]
  if not c.get('deadlineAt'):c['deadlineAt']=c['deadline']+'T23:59:59'+('+'+('02:00' if datetime.fromisoformat(c['deadline']).replace(tzinfo=ZoneInfo('Europe/Rome')).utcoffset().seconds==7200 else '01:00'))
  c['sourceStatus']='closed' if datetime.fromisoformat(c['deadlineAt'])<now else 'unconfirmed'
  c['codes']=sorted(set(c.get('codes',[])+CODE.findall(' '.join([c.get('sector',''),c.get('sectorCode',''),c.get('gsd','')]))))
  completed.append(enrich(c,catalog,labels));urls.add(canonical(c['url']))
 updated=now.isoformat()
 data={'schemaVersion':2,'updatedAt':updated,'coverage':coverage,'detailFailures':failures,'coverageNote':f'Tutte le 8 categorie nazionali MUR controllate. {len(calls)} schede nelle liste aperte; {len(failures)} dettagli non verificati. L’archivio conserva i bandi già acquisiti, non tutto lo storico MUR. Sono esclusi i bandi pubblicati solo sui siti degli enti.','calls':sorted(completed,key=lambda c:(c['deadline'],c['id']))}
 prof=[c for c in completed if c['category']=='professors' and c.get('presentInLatestSource')]
 targets=[c for c in prof if c['role']=='Professore ordinario' and active(c,now) and (set(c.get('sectorCodes',[])) & {'BIOS-08/A','BIOS-14/A'} or set(c.get('groupCodes',[])) & {'05/BIOS-08','05/BIOS-14'})]
 uncertain=[c['id'] for c in prof if not c.get('detailVerified') or not c.get('codes') or c['role']=='Professore · fascia da verificare']
 digest={'updatedAt':updated,'scope':'Italia; chiamate dei professori MUR; prima fascia; biologia molecolare oppure genetica','source':next(c for c in coverage if c['category']=='professors'),'status':'incomplete' if uncertain else 'verified','unclassified':uncertain,'calls':targets,'coverageNote':'Ricerca nazionale MUR senza restrizioni di ateneo. Verificare documenti, rettifiche e riserve nei bandi originali; non certifica la completezza dei siti di ateneo.'}
 del catalog['_cities']
 for name,obj in [('calls.json',data),('catalogs.json',catalog),('professor-watch.json',digest)]:
  target=ROOT/'data'/name;tmp=target.with_suffix('.tmp');tmp.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':'))+'\n');tmp.replace(target)
 print('Published',len(completed),'records; watch:',digest['status'],len(targets),'matches;',len(uncertain),'uncertain',flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--source-dir');p.add_argument('--workers',type=int,default=4);a=p.parse_args();main(a.source_dir,a.workers)
