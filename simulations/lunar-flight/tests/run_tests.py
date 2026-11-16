#!/usr/bin/env python3
"""
Pipeline self-test (no internet needed).

1. builds format-faithful synthetic source files (tests/make_synthetic_sources.py)
2. runs fetch_and_process.py on them, once from disk and once through a local
   HTTP server using Range requests (same code path as the real NASA servers)
3. checks every tier's DEM against the known analytic surface at each pixel's
   latitude/longitude, i.e. validates georeferencing + resampling + encoding.

    python tests/run_tests.py [workdir]
"""
import http.server
import json
import os
import re
import subprocess
import sys
import threading

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, ROOT)
import make_synthetic_sources as syn  # noqa: E402


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return self.send_error(404)
        size = os.path.getsize(path)
        m = re.match(r"bytes=(\d+)-(\d*)", self.headers.get("Range", ""))
        a, b = (int(m.group(1)), int(m.group(2) or size - 1)) if m else (0, size - 1)
        self.send_response(206 if m else 200)
        self.send_header("Content-Length", str(b - a + 1))
        if m:
            self.send_header("Content-Range", f"bytes {a}-{b}/{size}")
        self.end_headers()
        with open(path, "rb") as f:
            f.seek(a)
            left = b - a + 1
            while left > 0:
                chunk = f.read(min(1 << 20, left))
                if not chunk:
                    break
                self.wfile.write(chunk)
                left -= len(chunk)


def check(assets, label):
    man = json.load(open(os.path.join(assets, "apollo11", "manifest.json")))
    ok = True
    for t in man["tiers"]:
        d, b = t["dem"], t["bounds"]
        dn = np.asarray(Image.open(os.path.join(assets, "apollo11", d["file"]))).astype(np.float64)
        h = d["h_min"] + dn * d["h_scale"]
        H, W = h.shape
        lat = b["north"] - (np.arange(H) + 0.5) * (b["north"] - b["south"]) / H
        lon = b["west"] + (np.arange(W) + 0.5) * (b["east"] - b["west"]) / W
        ref = syn.height(lat[:, None], lon[None, :])
        err = np.abs(h - ref)
        # tolerance: 0.5 m source quantisation (LOLA) + interpolation of the finest test wavelength
        # LOLA DNs are 0.5 m steps (max rounding error 0.25 m); all DEM tiers are pixel-aligned pass-through
        tol = {"global": 0.3, "wide": 0.3, "regional": 0.3, "local": 0.01}[t["id"]]
        good = err.max() <= tol
        ok &= good
        print(f"  [{label}] {t['id']:9s} DEM max |err| = {err.max():8.4f} m  rms = {np.sqrt((err**2).mean()):8.4f} m "
              f"(tol {tol})  {'OK' if good else 'FAIL'}")
        # one-pixel shift sensitivity: prove the check would catch a 1 px georeferencing error
        if t["id"] in ("regional", "local"):
            sh = np.abs(h[:, 1:] - ref[:, :-1]).max()
            print(f"             (same check with a deliberate 1 px shift: {sh:.3f} m)")
            ok &= sh > 3 * tol
        img = np.asarray(Image.open(os.path.join(assets, "apollo11", t["image"]["file"])))
        ok &= img.shape[0] == t["image"]["height"] and img.std() > 5
    return ok


def main():
    work = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "tests", "_work")
    mirror = os.path.join(work, "mirror")
    if not os.path.exists(os.path.join(mirror, "lroc_color_poles_4k.tif")):
        syn.main(mirror)
    script = os.path.join(ROOT, "fetch_and_process.py")
    a1 = os.path.join(work, "assets_disk")
    subprocess.check_call([sys.executable, script, "--mirror", mirror, "--out", a1, "--cache", os.path.join(work, "c1")],
                          stdout=subprocess.DEVNULL)
    ok = check(a1, "disk ")

    # same run through HTTP Range requests
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), lambda *a: RangeHandler(*a, directory=mirror))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}/"
    import fetch_and_process as fp
    fp.LOLA_BASE = base
    fp.LROC_BASE = base
    fp.SVS_COLOR = base + "lroc_color_poles_4k.tif"
    fp.SITES["apollo11"]["nac_dtm"] = base + "NAC_DTM_APOLLO11_E008N0234.IMG"
    fp.SITES["apollo11"]["nac_ortho"] = base + "NAC_DTM_APOLLO11_M150361817_50CM.IMG"
    orig = fp.Builder.lroc
    fp.Builder.lroc = lambda self, url: orig(self, base + url.rsplit("/", 1)[-1])
    a2 = os.path.join(work, "assets_http")
    os.environ.update({"NO_PROXY": "127.0.0.1", "no_proxy": "127.0.0.1"})
    fp.log = lambda *a: None
    fp.main(["--out", a2, "--cache", os.path.join(work, "c2")])
    ok &= check(a2, "http ")
    for t in ("global", "wide", "regional", "local"):
        f = f"apollo11/{t}_dem.png"
        same = open(os.path.join(a1, f), "rb").read() == open(os.path.join(a2, f), "rb").read()
        ok &= same
        print(f"  disk vs http {t}: {'identical' if same else 'DIFFERENT'}")
    print("ALL TESTS PASSED" if ok else "TESTS FAILED")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
