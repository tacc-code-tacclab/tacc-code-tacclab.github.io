#!/usr/bin/env python3
"""Build the static Ateneo Bandi index from the official MUR portal.

The crawler is deliberately conservative: one request per second, an identifying
user agent, retries, and a fail-safe that leaves the previous dataset untouched.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE = "https://bandi.mur.gov.it/"
UA = "AteneoBandi/1.0 (+https://tacc-code-tacclab.github.io/services/ateneo-bandi/)"
DETAIL_RE = re.compile(r"/public/(?:job|fellowship|chiamat|contratt|incaric)[^/]*/?(?:id_[a-z_]+/)?\d+", re.I)
DATE_RE = re.compile(r"(\d{2}/\d{2}/\d{4})")

REGIONS = {
    "Bologna":"Emilia-Romagna","Cesena":"Emilia-Romagna","Ferrara":"Emilia-Romagna","Forlì":"Emilia-Romagna","Modena":"Emilia-Romagna","Parma":"Emilia-Romagna","Piacenza":"Emilia-Romagna","Ravenna":"Emilia-Romagna","Reggio Emilia":"Emilia-Romagna","Rimini":"Emilia-Romagna",
    "Milano":"Lombardia","Bergamo":"Lombardia","Brescia":"Lombardia","Pavia":"Lombardia","Varese":"Lombardia","Como":"Lombardia","Monza":"Lombardia","Mantova":"Lombardia",
    "Padova":"Veneto","Venezia":"Veneto","Verona":"Veneto","Vicenza":"Veneto","Treviso":"Veneto",
    "Torino":"Piemonte","Alessandria":"Piemonte","Vercelli":"Piemonte","Novara":"Piemonte",
    "Firenze":"Toscana","Pisa":"Toscana","Siena":"Toscana","Lucca":"Toscana",
    "Roma":"Lazio","Viterbo":"Lazio","Cassino":"Lazio",
    "Napoli":"Campania","Salerno":"Campania","Caserta":"Campania","Benevento":"Campania",
    "Genova":"Liguria","Trieste":"Friuli-Venezia Giulia","Udine":"Friuli-Venezia Giulia","Trento":"Trentino-Alto Adige","Bolzano":"Trentino-Alto Adige",
    "Perugia":"Umbria","Camerino":"Marche","Ancona":"Marche","Urbino":"Marche","Macerata":"Marche","L'Aquila":"Abruzzo","Chieti":"Abruzzo","Teramo":"Abruzzo",
    "Bari":"Puglia","Lecce":"Puglia","Foggia":"Puglia","Potenza":"Basilicata","Matera":"Basilicata","Cosenza":"Calabria","Catanzaro":"Calabria","Reggio Calabria":"Calabria",
    "Palermo":"Sicilia","Catania":"Sicilia","Messina":"Sicilia","Enna":"Sicilia","Cagliari":"Sardegna","Sassari":"Sardegna","Aosta":"Valle d'Aosta","Campobasso":"Molise"
}

def get(session: requests.Session, url: str, **kwargs) -> requests.Response:
    last = None
    for delay in (0, 2, 5):
        if delay: time.sleep(delay)
        try:
            response = session.get(url, timeout=30, **kwargs)
            response.raise_for_status()
            time.sleep(1)
            return response
        except requests.RequestException as exc:
            last = exc
    raise RuntimeError(f"Cannot fetch {url}: {last}")

def text_map(soup: BeautifulSoup) -> dict[str, str]:
    values: dict[str, str] = {}
    for row in soup.select("tr"):
        cells = [c.get_text(" ", strip=True) for c in row.select("th,td")]
        if len(cells) >= 2 and cells[0]: values.setdefault(cells[0].rstrip(" :"), " ".join(cells[1:]).strip())
    return values

def field(data: dict[str, str], *starts: str) -> str:
    for key, value in data.items():
        if any(key.casefold().startswith(start.casefold()) for start in starts) and value:
            return value
    return ""

def iso_date(value: str) -> str:
    match = DATE_RE.search(value or "")
    return dt.datetime.strptime(match.group(1), "%d/%m/%Y").date().isoformat() if match else ""

def infer_role(page_title: str, title: str) -> str:
    text = f"{page_title} {title}".casefold()
    if "ordinario" in text or "prima fascia" in text: return "Professore ordinario"
    if "associato" in text or "seconda fascia" in text: return "Professore associato"
    if "post doc" in text or "post-doc" in text: return "Incarico post-doc"
    if "contratt" in text and "ricerca" in text: return "Contratto di ricerca"
    if "assegn" in text: return "Assegno di ricerca"
    if "dottorat" in text: return "Dottorato"
    if "tecnolog" in text: return "Tecnologo"
    return "RTT / Ricercatore TD"

def find_search_pages(session: requests.Session) -> list[str]:
    soup = BeautifulSoup(get(session, BASE).text, "html.parser")
    pages = {urljoin(BASE, a.get("href")) for a in soup.select("a[href]") if ".php" in (a.get("href") or "")}
    pages.add(urljoin(BASE, "jobs.php/public/cercaJobs"))
    return sorted(pages)

def run_search(session: requests.Session, page: str) -> set[str]:
    soup = BeautifulSoup(get(session, page).text, "html.parser")
    form = soup.find("form")
    if form:
        params = {}
        for hidden in form.select('input[type="hidden"][name]'):
            params[hidden["name"]] = hidden.get("value", "")
        for select in form.select("select[name]"):
            options = select.find_all("option")
            open_option = next((o for o in options if "apert" in o.get_text(" ", strip=True).casefold()), None)
            wildcard = next((o for o in options if "tutt" in o.get_text(" ", strip=True).casefold()), None)
            chosen = open_option or wildcard
            if chosen: params[select["name"]] = chosen.get("value", "")
        params.setdefault("azione", "cerca")
        action = urljoin(page, form.get("action") or page)
        soup = BeautifulSoup(get(session, action, params=params).text, "html.parser")
    return {urljoin(page, a["href"]) for a in soup.select("a[href]") if DETAIL_RE.search(a["href"])}

def parse_detail(session: requests.Session, url: str) -> dict | None:
    soup = BeautifulSoup(get(session, url).text, "html.parser")
    data = text_map(soup)
    title = field(data, "Titolo del progetto di ricerca in italiano", "Titolo in italiano", "Titolo")
    deadline = iso_date(field(data, "Data di scadenza"))
    published = iso_date(field(data, "Data del bando", "Data pubblicazione"))
    if not title or not deadline: return None
    institution = field(data, "Organizzazione/Ente")
    city = field(data, "Città")
    sector_raw = field(data, "S.S.D")
    gsd = field(data, "G.S.D")
    sector_code, _, sector = sector_raw.partition(" - ")
    heading = soup.find(["h1", "h2"])
    page_title = heading.get_text(" ", strip=True) if heading else ""
    canonical = url.split("?")[0]
    return {
        "id":"mur-" + hashlib.sha1(canonical.encode()).hexdigest()[:12], "title":title,
        "role":infer_role(page_title, title), "institution":institution or "Ente non indicato",
        "city":city or "Sede non indicata", "region":REGIONS.get(city, "Regione da verificare"),
        "sector":sector or sector_raw or field(data, "Campo principale della ricerca"),
        "sectorCode":sector_code if sector else "", "gsd":gsd,
        "keywords":" ".join([field(data,"Campo principale"),field(data,"Sottocampo")]),
        "published":published or deadline, "deadline":deadline, "source":"MUR · Bandi", "url":canonical
    }

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="services/ateneo-bandi/data/calls.json")
    args = parser.parse_args()
    output = Path(args.output)
    old = json.loads(output.read_text()) if output.exists() else {"calls":[]}
    session = requests.Session(); session.headers.update({"User-Agent":UA,"Accept-Language":"it-IT,it;q=0.9"})
    urls: set[str] = set()
    for page in find_search_pages(session):
        try: urls.update(run_search(session, page))
        except Exception as exc: print(f"warning: {page}: {exc}", file=sys.stderr)
    fresh = []
    for index, url in enumerate(sorted(urls), 1):
        try:
            item = parse_detail(session, url)
            if item: fresh.append(item)
        except Exception as exc: print(f"warning: {url}: {exc}", file=sys.stderr)
        print(f"[{index}/{len(urls)}] {url}", file=sys.stderr)
    if len(fresh) < 5: raise RuntimeError(f"Safety stop: only {len(fresh)} records parsed")
    by_id = {item["id"]:item for item in old.get("calls", [])}
    by_id.update({item["id"]:item for item in fresh})
    cutoff = (dt.date.today() - dt.timedelta(days=180)).isoformat()
    merged = [item for item in by_id.values() if item.get("deadline", "") >= cutoff]
    merged.sort(key=lambda item:(item["deadline"],item["institution"]))
    payload={"updatedAt":dt.datetime.now(dt.timezone.utc).isoformat(),"coverageNote":"Indice aggiornato automaticamente dal portale MUR. Le categorie vengono ampliate progressivamente; verifica sempre il testo ufficiale.","calls":merged}
    output.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n")
    print(f"Wrote {len(merged)} calls ({len(fresh)} currently indexed)")
    return 0

if __name__ == "__main__": raise SystemExit(main())
