# Ateneo Bandi

A static-first academic-call search service for the TACC Lab site. The browser never scrapes third-party sites directly: it reads a versioned JSON snapshot and links every card back to the official source.

## Data strategy

1. `scripts/fetch_mur.py` discovers the MUR category/search pages and indexes current official detail records conservatively.
2. `.github/workflows/update-ateneo-bandi.yml` runs every morning and commits only a valid non-empty snapshot.
3. Previous records are retained for 180 days, allowing active/expired searches without repeatedly crawling the full historical archive.
4. University sites, inPA, the Gazzetta Ufficiale and EURAXESS are complementary connectors for later phases; they must be deduplicated against the MUR URL and the originating institution's identifier.

The initial checked-in snapshot is intentionally small and labelled as such. It makes the interface testable before the first scheduled collection and avoids presenting invented calls as live data.

## Local checks

```bash
node --check services/ateneo-bandi/app.js
node services/ateneo-bandi/tests/app.test.cjs
python -m py_compile services/ateneo-bandi/scripts/fetch_mur.py
```

## Email alerts

GitHub Pages cannot securely hold email addresses or mail-provider secrets. `backend/` contains a separate Supabase design with no public table policies, hashed one-time verification tokens, signed unsubscribe links and a deduplicated digest. The visible form stays disabled until a dedicated project, sending domain, privacy notice, CAPTCHA and rate limiting have been configured and tested.
