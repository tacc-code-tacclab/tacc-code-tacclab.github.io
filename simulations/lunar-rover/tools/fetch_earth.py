#!/usr/bin/env python3
"""
Real images of the Earth for the journey home, from NASA GIBS (Global Imagery Browse Services, public, free to use):
  earth_globe.jpg    Blue Marble shaded relief and bathymetry, whole Earth
  earth_florida.jpg  the same, Florida and its surroundings (about 500 m per pixel)
  earth_coast.jpg    Landsat WELD true-colour annual composite, the Space Coast (about 100 m per pixel)
  earth_cape.jpg     the same, Cape Canaveral (about 30 m per pixel)
All are plain latitude/longitude images (EPSG:4326); earth.json records their bounds and layers.
"""
import datetime, json, os, sys, urllib.parse, urllib.request

WMS = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
BM, WELD = "BlueMarble_ShadedRelief_Bathymetry", "Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual"
CAPE = {"name": "Cape Canaveral, Florida", "lat": 28.4889, "lon": -80.5778}
IMAGES = [  # file, layer, south, west, north, east, width, height, time
    ("earth_globe.jpg", BM, -90, -180, 90, 180, 4096, 2048, None),
    ("earth_florida.jpg", BM, 23.5, -89.0, 32.5, -77.0, 2400, 1800, None),
    ("earth_coast.jpg", WELD, 27.4, -81.7, 29.6, -79.5, 2048, 2048, "2000-12-01"),
    ("earth_cape.jpg", WELD, 28.19, -80.88, 28.79, -80.28, 2048, 2048, "2000-12-01"),
]
meta = {"source": "NASA Global Imagery Browse Services (GIBS), https://gibs.earthdata.nasa.gov - NASA imagery, free to use",
        "retrieved_utc": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "target": CAPE, "images": {}}
os.makedirs(OUT, exist_ok=True)
for name, layer, s, w, n, e, wd, ht, t in IMAGES:
    q = {"SERVICE": "WMS", "REQUEST": "GetMap", "VERSION": "1.3.0", "LAYERS": layer, "STYLES": "", "FORMAT": "image/jpeg", "CRS": "EPSG:4326",
         "BBOX": f"{s},{w},{n},{e}", "WIDTH": wd, "HEIGHT": ht}          # WMS 1.3.0 with EPSG:4326: latitude first
    if t: q["TIME"] = t
    data = urllib.request.urlopen(urllib.request.Request(WMS + "?" + urllib.parse.urlencode(q), headers={"User-Agent": "lunar-rover-data/1.0"}), timeout=300).read()
    if data[:3] != b"\xff\xd8\xff" or len(data) < 60000:
        sys.exit(f"{name}: the service did not return a usable picture ({len(data)} bytes): {data[:200]!r}")
    open(os.path.join(OUT, name), "wb").write(data)
    meta["images"][name] = {"layer": layer, "south": s, "west": w, "north": n, "east": e, "width": wd, "height": ht, "time": t, "bytes": len(data)}
    print(f"::notice::{name}: {len(data)} bytes, {layer}")
json.dump(meta, open(os.path.join(OUT, "earth.json"), "w"), indent=1)
