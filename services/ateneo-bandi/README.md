# Ateneo Bandi

Public academic-call search in TACC Lab's Services section, independent of games.

## National catalogs

`data/catalogs.json` is independent of open calls. It combines all active
institutions in the MUR/USTAT registry, the complete entity lists of the eight MUR
categories, all 20 regions and the 7,894 municipalities in the ISTAT release of
21 February 2026. Institution names are reconciled through an explicit reviewed
MUR/USTAT identifier crosswalk. New MUR entities are added by the daily import.

The 190 GSD, 366 current SSD, 190 historical competition sectors and the historical
USTAT SSD catalog are searchable by code or name. `scripts/build_catalogs.py`
extracts the DM 639/2024 Annex B mapping, including merged cells and page breaks.
Old codes may map to multiple new sectors: results are for discovery, not a legal
certificate of equivalence. Sources, provenance and source PDF pages are retained.

## Calls and completeness

`scripts/fetch_mur.py` explicitly queries professors, researchers, contracts,
postdocs, research assignments, grants, PhDs and technologists. The role comes from
the source category and professor/researcher designation, not incidental words in
a project description. Each national list count must reconcile before publication.
All SSDs in mixed calls are retained. Deadline timestamps use Europe/Rome including
DST; closed source records and records absent from a later list cannot silently
remain active. Detail failures and per-category counts are visible on the page.

The archive retains previously acquired calls; it is **not the complete historical
MUR database**. Calls published only on university sites are not automatically
indexed. A complete university selector does not guarantee every call is on MUR.
The public page loads snapshots directly from the public GitHub main branch, with
same-origin fallback, so a bot commit need not trigger another Pages build. A
warning appears after 36 hours without an update. No secrets are sent to browsers.

## Refresh / verify

```sh
python -m pip install -r services/ateneo-bandi/scripts/requirements.txt
python services/ateneo-bandi/scripts/build_catalogs.py
python services/ateneo-bandi/scripts/fetch_mur.py
python -m unittest discover -s services/ateneo-bandi/tests -p 'test_*.py'
node services/ateneo-bandi/tests/app.test.cjs
```

The daily GitHub workflow updates all three public data files atomically at the
commit level. Reference catalogs are rebuilt on the first day of each month.
Test fixtures are small excerpts of official MUR HTML, without contact details.

## Private report

`data/professor-watch.json` is an auditable public subset for full professors in
BIOS-08/A (BIO/11; 05/E2; 05/BIOS-08) OR BIOS-14/A (BIO/18; 05/I1; 05/BIOS-14).
It contains no email address. An enabled three-day ChatGPT automation verifies the
original sources, stores private run records in Supabase and sends through Gmail.
See `backend/README.md`. There are no public email subscriptions. Users can save,
restore, delete and share searches locally without an account.
