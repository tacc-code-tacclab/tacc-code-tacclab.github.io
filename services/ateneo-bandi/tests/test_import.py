import importlib.util, unittest, json
from pathlib import Path
from datetime import datetime, timezone
P=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('fetch_mur',P/'scripts/fetch_mur.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class ImportTests(unittest.TestCase):
 def fixture(self,name):return (P/'tests/fixtures'/name).read_bytes()
 def test_role_is_explicit(self):
  rows,_,_=m.parse_list(self.fixture('contracts.html'),'contracts');self.assertEqual(rows[0]['role'],'Contratto di ricerca')
  rows,_,_=m.parse_list(self.fixture('professors.html'),'professors');self.assertEqual(rows[0]['role'],'Professore ordinario')
  self.assertEqual(m.role_for('professors','Professore di seconda fascia'),'Professore associato')
  self.assertEqual(m.role_for('researchers','Ricercatore a tempo determinato (B)'),'RTD-B')
 def test_partial_source_rejected(self):
  with self.assertRaises(ValueError):m.parse_list(self.fixture('professors.html').replace(b'trovati 1 bandi',b'trovati 2 bandi'),'professors')
  with self.assertRaises(ValueError):m.parse_list(b'<h1>Server unavailable</h1>','professors')
 def test_true_zero(self):self.assertEqual(m.parse_list('<h2>Totale bandi aperti: 0</h2>','grants')[0],[])
 def test_rome_time(self):
  self.assertEqual(m.parse_deadline('12/09/2026 - alle ore 13:00')[1],'2026-09-12T13:00:00+02:00')
  self.assertEqual(m.parse_deadline('12/01/2026 - alle ore 13:00')[1],'2026-01-12T13:00:00+01:00')
 def test_detail_fields_and_aliases(self):
  c=m.parse_list(self.fixture('professors.html'),'professors')[0][0];c=m.detail(c,self.fixture('professor-detail.html'))
  self.assertEqual(c['published'],'2026-08-06');self.assertEqual(c['city'],'Ferrara');self.assertEqual(c['deadlineAt'],'2026-10-05T12:00:00+02:00');self.assertIn('BIOS-11/A',c['codes']);self.assertNotIn('BIO/11',c['codes'])
 def test_postdoc_title_label(self):
  c={'url':'https://bandi.mur.gov.it/incarichipostdoc.php/public/fellowship/id_fellow/317082','codes':[],'sector':''}
  m.detail(c,self.fixture('postdoc-detail.html'));self.assertTrue(c['detailVerified']);self.assertEqual(c['city'],'Trento');self.assertIn('GSPS-07/A',c['codes'])
 def test_multiple_sectors(self):
  html=self.fixture('professors.html').replace(b'</p>',b'<strong>Settore Genetica BIOS-14/A</strong></p>')
  c=m.parse_list(html,'professors')[0][0];self.assertIn('BIOS-11/A',c['codes']);self.assertIn('BIOS-14/A',c['codes'])
if __name__=='__main__':unittest.main()
