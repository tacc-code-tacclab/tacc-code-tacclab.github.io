"""Rebuild independent reference catalogs from MUR/USTAT, ISTAT and DM 639/2024.
Run with --source-dir to reuse downloaded source files. Never infer catalog entries
from the currently open calls. The MUR/USTAT crosswalk is explicitly reviewed.
"""
import argparse, csv, json, re
from datetime import datetime, timezone
from pathlib import Path
import requests
from bs4 import BeautifulSoup
from openpyxl import load_workbook
import pdfplumber
ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
 'atenei.csv': 'https://dati-ustat.mur.gov.it/dataset/bed0c71e-9f86-4a0f-a266-963b6f7bbbd2/resource/820aefe6-0662-4656-84ec-d8859a2a3b7e/download/01_atenei.csv',
 'comuni.xlsx': 'https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.xlsx',
 'ssd-map.pdf': 'https://dimi.unige.it/sites/dimi.unige.it/files/2024-05/Decreto%20Ministeriale%20n.%20639%20del%2002-05-2024%20-%20Allegato%20B.pdf',
 'mur-prof.html': 'https://bandi.mur.gov.it/profcalls.php/public/cercaJobs',
 'ssd.xlsx': 'https://dati-ustat.mur.gov.it/dataset/bed0c71e-9f86-4a0f-a266-963b6f7bbbd2/resource/ed9499df-4137-441a-83ea-320505f0b774/download/ssd_docenti.xlsx'
}
CROSSWALK = dict(x.split(':') for x in '''00101:UNITO 00102:POLITO 00201:UNIPMN 00401:SCGA 00701:VDA 01001:UNIGE 01201:LIUC 01202:UNINS 01301:ECAMPUS 01501:UNIMI 01502:POLIMI 01503:BOCCONI 01504:UNICATT 01505:IULM 01508:SANRAFMI 01509:UNIMIB 01510:UNIHUM 01601:UNIBG 01701:UNIBS 01801:UNIPV 01802:IUSS 02101:UNIBZ 02201:UNITN 02301:UNIVR 02701:UNIVE 02702:IUAV 02801:UNIPD 03001:UNIUD 03201:UNITS 03202:SISSA 03401:UNIPR 03601:UNIMORE 03701:UNIBO 03801:UNIFE 04101:UNIPU 04201:MARCHE 04301:UNIMC 04302:UICAM 04601:IMT 04801:UNIFI 04804:IUL 05001:UNIPI 05002:NORMALE 05003:SANNA 05201:UNISI 05202:STRASI 05401:UNIPG 05403:STRAPG 05601:TUSCIA 05801:ROMA1 05802:ROMA2 05803:LUMSA 05805:LUISS 05806:RMFORO 05807:ROMA3 05808:CAMPUS 05809:LUSPIO 05810:MARCONI 05811:TELMA 05812:EUROPEA 05813:NETTUNO 05814:MERCATO 05815:UNISU 05816:SANRAFRM 05817:LINKRM 05818:UNICML 05819:CASD 06001:UNICAS 06201:SANNIO 06202:TELFORT 06301:UNINA 06302:NAPARTH 06303:NAORIEN 06304:NASORS 06306:UNINA2 06307:PEGASO 06308:UNISSME 06501:UNISA 06601:UNIAQ 06603:UNIGSSI 06701:UNITE 06901:UNICH 07001:UNIMOL 07101:UNIFG 07201:UNIBA 07202:POLIBA 07203:LUM 07501:UNILE 07601:UNIBAS 07801:UNICAL 07901:UNICZ 08001:UNIMED 08003:STRARC 08201:UNIPA 08301:UNIME 08601:UKE 08701:UNICT 09001:UNISS 09201:UNICA'''.split())
def clean(s): return ' '.join((s or '').split())
def region(s):
 s=s.title()
 return {'Emilia Romagna':'Emilia-Romagna','Friuli Venezia Giulia':'Friuli-Venezia Giulia','Trentino Alto Adige':'Trentino-Alto Adige','Trentino-Alto Adige/Südtirol':'Trentino-Alto Adige',"Valle D'Aosta/Vallée D'Aoste":"Valle d'Aosta","Valle D'Aosta":"Valle d'Aosta"}.get(s,s)
def build(folder):
 folder=Path(folder);folder.mkdir(parents=True,exist_ok=True)
 for name,url in SOURCES.items():
  p=folder/name
  if not p.exists():
   r=requests.get(url,timeout=90);r.raise_for_status();p.write_bytes(r.content)
 soup=BeautifulSoup((folder/'mur-prof.html').read_bytes(),'html.parser')
 def opts(name):return [{'code':o['value'],'name':clean(o.text).split(' - ',1)[-1]} for o in soup.select(f'select[name="{name}"] option') if o['value']!='%']
 groups=opts('idgsd24');old_sc=opts('idsettore')
 mur={o['value']:clean(o.text) for o in soup.select('select[name="bb_type_code"] option') if o['value']!='%'}
 cities=[{'code':r[4],'name':r[6], 'region':region(r[10]),'province':r[14],'aliases':[r[5],r[7]]} for r in list(load_workbook(folder/'comuni.xlsx',read_only=True,data_only=True).worksheets[0].values)[1:] if r[4]]
 institutions=[]
 for r in csv.DictReader(open(folder/'atenei.csv',encoding='utf-8-sig'),delimiter=';'):
  if r['Status']!='A':continue
  key=CROSSWALK.get(r['COD_Ateneo'],'ustat-'+r['COD_Ateneo'])
  institutions.append({'id':key,'name':r['NomeEsteso'],'city':r['CITTA'].title().split(' - ')[0], 'region':region(r['REGIONE']),'kind':'ateneo','aliases':[r['NomeOperativo'],mur.get(key,'')], 'ustatCode':r['COD_Ateneo']})
 for key,name in mur.items():
  if not any(x['id']==key for x in institutions):institutions.append({'id':key,'name':name,'city':'','region':'','kind':'ateneo','aliases':[]})
 sectors={}; current_gsd=''; current_sc=[]; previous_ssd=''; group_sc={}
 with pdfplumber.open(folder/'ssd-map.pdf') as pdf:
  for page in pdf.pages:
   for table in page.extract_tables() + page.extract_tables({"explicit_horizontal_lines":[63.26,535]}):
    for row in table:
     if len(row)!=6:continue
     gsd,gn,ssd,sn,sc,old=map(clean,row)
     if not ssd and not gsd and not gn and not sn and not sc and old and previous_ssd:
      sectors[previous_ssd]['oldCodes']=sorted(set(sectors[previous_ssd]['oldCodes']+re.findall(r'[A-Z]+(?:-[A-Z]+)?/\d{2}',old)))
     if not re.fullmatch(r'[A-Z]{4}-\d{2}/[A-Z]',ssd):continue
     previous_ssd=ssd
     if re.fullmatch(r'\d{2}/[A-Z]{4}-\d{2}',gsd):current_gsd=gsd
     codes=re.findall(r'\d{2}/[A-Z]\d',sc)
     if codes:current_sc=codes
     # Derive GSD from the authoritative MUR list, including merged table cells.
     group=next((g['code'] for g in groups if g['code'].endswith(ssd.split('/')[0])),current_gsd)
     if codes: group_sc.setdefault(group,set()).update(codes)
     sectors[ssd]={'code':ssd,'name':sn,'gsd':group,'oldCodes':sorted(set(re.findall(r'[A-Z]+(?:-[A-Z]+)?/\d{2}',old))),'oldSC':current_sc,'sourcePage':page.page_number}
 for s in sectors.values():s['oldSC']=sorted(group_sc.get(s['gsd'],set()))
 old_sectors=[{'code':r[0],'name':r[1]} for r in list(load_workbook(folder/'ssd.xlsx',read_only=True,data_only=True).worksheets[0].values)[1:] if r[0]]
 assert len(groups)==190 and len(old_sc)==190 and len(cities)>7800 and len(institutions)>=100
 assert len(sectors)==366, f'Incomplete SSD extraction: {len(sectors)}'
 assert sectors['BIOS-08/A']['oldCodes']==['BIO/11'] and sectors['BIOS-14/A']['oldCodes']==['BIO/18']
 result={'updatedAt':datetime.now(timezone.utc).isoformat(),'sources':SOURCES,'licenseNote':'Catalogo atenei e SSD storici: MUR, Ufficio Statistica e Studi (IODL 2.0). Comuni: ISTAT, elenco 21/02/2026. Corrispondenze: DM 639/2024, Allegato B, copia istituzionale Università di Genova. Alcune corrispondenze sono uno-a-molti: verificare le note del decreto.', 'institutions':institutions,'regions':sorted(set(c['region'] for c in cities)),'cities':cities,'groups':groups,'oldSC':old_sc,'sectors':list(sectors.values()),'oldSectors':old_sectors}
 (ROOT/'data/catalogs.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
 print({k:len(result[k]) for k in ['institutions','regions','cities','groups','oldSC','sectors','oldSectors']})
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--source-dir',default='/tmp/ateneo-catalog-sources');build(p.parse_args().source_dir)
