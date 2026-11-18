#!/usr/bin/env python3
"""
Element abundances measured from orbit by the Lunar Prospector gamma-ray spectrometer
(PDS data set LP-L-GRS-5-ELEM-ABUNDANCE-V1.0, T. H. Prettyman et al.), 5-degree equal-area map.

Downloads the table and its format file from the PDS Geosciences Node and writes data/lp_grs_5deg.json:
thorium, uranium and potassium (ppm), titanium and iron (weight %), resampled to a regular 5 x 5 degree grid by
taking, for each grid cell, the equal-area pixel that contains its centre. Values are copied, not smoothed.
The instrument's footprint is about 150 km, so this says what a region is like, not what a single rock contains.
"""
import datetime, json, os, re, statistics, sys, urllib.request

BASE = "https://pds-geosciences.wustl.edu/lunar/lp-l-grs-5-elem-abundance-v1/lp_9001/data/"
TAB, FMT = "lpgrs_high1_elem_abundance_5deg.tab", "lpgrs_elem_abundance.fmt"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "lp_grs_5deg.json")

def get(name):
    req = urllib.request.Request(BASE + name, headers={"User-Agent": "lunar-rover-data/1.0"})
    return urllib.request.urlopen(req, timeout=180).read().decode("latin-1")

fmt, tab = get(FMT), get(TAB)
names = [n.strip().strip('"') for n in re.findall(r"^\s*NAME\s*=\s*(.+?)\s*$", fmt, re.M)]
units = [n.strip().strip('"') for n in re.findall(r"^\s*UNIT\s*=\s*(.+?)\s*$", fmt, re.M)]
print("::notice::columns in the format file: " + " | ".join(names[:24]))
print("::notice::units: " + " | ".join(units[:24]))
rows = [[float(v) for v in ln.split()] for ln in tab.splitlines() if ln.strip()]
print(f"::notice::{len(rows)} pixels, {len(rows[0])} columns")

# column for each element: by name if the format file names it, otherwise by position; either way checked for plausibility
want = {"Th_ppm": (r"^(TH|THORIUM)\b", 14, (0.05, 15)), "U_ppm": (r"^(U|URANIUM)\b", 15, (0.01, 5)), "K_ppm": (r"^(K|POTASSIUM)\b", 13, (50, 5000)),
        "Ti_wt": (r"^(TI|TITANIUM)\b", 11, (0.0, 0.09)), "Fe_wt": (r"^(FE|IRON)\b", 12, (0.01, 0.22))}
cols, how = {}, {}
for key, (rx, pos, (lo, hi)) in want.items():
    idx = [i for i, n in enumerate(names) if re.match(rx, n.upper()) and not re.search(r"ERR|SIG|COV|UNC", n.upper())]
    c = idx[0] if idx and idx[0] < len(rows[0]) else pos
    how[key] = f"column {c + 1}" + (f" ('{names[c]}')" if idx and c < len(names) else " (by position)")
    vals = [r[c] for r in rows]; med = statistics.median(vals)
    if not (lo <= med <= hi and min(vals) >= -1e-9):
        sys.exit(f"{key}: {how[key]} has median {med:g}, outside the plausible range {lo}-{hi}: column layout not understood")
    cols[key] = c
ratio = statistics.median(r[cols["Th_ppm"]] / r[cols["U_ppm"]] for r in rows if r[cols["U_ppm"]] > 0)
if not 2.5 < ratio < 5: sys.exit(f"Th/U median ratio {ratio:.2f} is not lunar (expected about 3.7)")

def pixel(lat, lon):
    for r in rows:
        if r[1] <= lat < r[2] and r[3] <= lon < r[4]: return r
    raise SystemExit(f"no pixel contains {lat},{lon}")
lats = [-87.5 + 5 * j for j in range(36)]; lons = [-177.5 + 5 * i for i in range(72)]
grid = {k: [] for k in cols}
for la in lats:
    line = [pixel(la, lo) for lo in lons]
    for k, c in cols.items():
        f = 100.0 if k.endswith("_wt") else 1.0
        grid[k].append([round(p[c] * f, 3) for p in line])
out = {"source": {"mission": "Lunar Prospector", "instrument": "Gamma Ray Spectrometer", "data_set": "LP-L-GRS-5-ELEM-ABUNDANCE-V1.0",
                  "producer": "T. H. Prettyman, Planetary Science Institute", "file": TAB, "url": BASE + TAB},
       "generated_utc": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
       "processing": "for each 5 x 5 degree cell, the value of the equal-area pixel containing its centre; titanium and iron converted "
                     "from weight fraction to weight percent; nothing smoothed or filled", "columns_used": how,
       "th_over_u_median": round(ratio, 2), "lat_centres": lats, "lon_centres": lons, "units": {"Th_ppm": "ppm", "U_ppm": "ppm", "K_ppm": "ppm", "Ti_wt": "wt% Ti", "Fe_wt": "wt% Fe"},
       "grid": grid}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(out, open(OUT, "w"), separators=(",", ":"))
at = lambda la, lo: {k: grid[k][min(35, int((la + 90) // 5))][int((lo + 180) // 5) % 72] for k in grid}
for name, la, lo in (("Apollo 11 site", 0.67, 23.47), ("Fra Mauro / Apollo 14", -3.6, -17.5), ("Mare Imbrium", 35, -15), ("Aristarchus", 23.7, -47.4), ("far-side highlands", 0, 170), ("South Pole-Aitken", -50, -170)):
    print(f"::notice::{name}: " + json.dumps(at(la, lo)))
print("::notice::columns used: " + json.dumps(how) + f"  Th/U median {ratio:.2f}")
