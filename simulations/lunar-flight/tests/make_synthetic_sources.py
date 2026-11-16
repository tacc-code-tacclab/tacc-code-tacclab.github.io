#!/usr/bin/env python3
"""
TEST FIXTURE ONLY - never used by the simulator.

Writes files that mimic the *format* (PDS3 labels, byte layout, projections,
tile naming) of the real LOLA / LROC products, filled with an analytic function
of latitude/longitude. Because the function is known everywhere, the pipeline's
georeferencing and resampling can be checked numerically (tests/run_tests.py).
Files are sparse: only the rows the test site needs are written.
"""
import math
import os
import struct
import sys
import zipfile

import numpy as np
from PIL import Image

R = 1737400.0
MPD = math.pi * R / 180.0
SITE = (0.67416, 23.47314)


def height(lat, lon):
    """metres, lat/lon in degrees (broadcastable)"""
    la, lo = np.radians(lat), np.radians(lon)
    h = 1500.0 * np.sin(2 * la) * np.cos(3 * lo) + 400.0 * np.cos(40 * la) * np.sin(40 * lo)
    h += 60.0 * np.sin(900 * la) * np.cos(900 * lo)  # ~12 km wavelength
    h += 3.0 * np.sin(60000 * la + 1.0) * np.cos(60000 * lo)  # ~180 m wavelength
    return h


def albedo(lat, lon):
    """0..1"""
    la, lo = np.radians(lat), np.radians(lon)
    return 0.5 + 0.2 * np.sin(300 * la) * np.cos(300 * lo) + 0.2 * np.sin(20000 * la) * np.sin(20000 * lo) \
        + 0.08 * np.sin(400000 * la) * np.cos(400000 * lo)


def lola(outdir, name, res, s, n, w, e, rows=None):
    lines, samples = int(round((n - s) * res)), int(round((e - w) * res))
    lbl = f"""PDS_VERSION_ID            = "PDS3"
RECORD_TYPE               = FIXED_LENGTH
RECORD_BYTES              = {samples * 2}
FILE_RECORDS              = {lines}
^IMAGE                    = "{name}.IMG"
OBJECT                    = IMAGE
 NAME                     = HEIGHT
 LINES                    = {lines}
 LINE_SAMPLES             = {samples}
 BANDS                    = 1
 SAMPLE_TYPE              = LSB_INTEGER
 SAMPLE_BITS              = 16
 UNIT                     = METER
 SCALING_FACTOR           = 0.5
 OFFSET                   = 1737400.
END_OBJECT                = IMAGE
OBJECT                    = IMAGE_MAP_PROJECTION
 MAP_PROJECTION_TYPE      = "SIMPLE CYLINDRICAL"
 A_AXIS_RADIUS            = 1737.4 <km>
 CENTER_LATITUDE          = 0. <deg>
 CENTER_LONGITUDE         = 180. <deg>
 MAP_RESOLUTION           = {res} <pix/deg>
 MAXIMUM_LATITUDE         = {n} <deg>
 MINIMUM_LATITUDE         = {s} <deg>
 WESTERNMOST_LONGITUDE    = {w} <deg>
 EASTERNMOST_LONGITUDE    = {e} <deg>
END_OBJECT                = IMAGE_MAP_PROJECTION
END
"""
    open(os.path.join(outdir, name + ".LBL"), "w").write(lbl)
    mm = np.lib.format.open_memmap  # noqa (unused) - plain memmap below
    arr = np.memmap(os.path.join(outdir, name + ".IMG"), dtype="<i2", mode="w+", shape=(lines, samples))
    r0, r1 = rows if rows else (0, lines)
    lon = w + (np.arange(samples) + 0.5) / res
    for a in range(r0, r1, 256):
        b = min(r1, a + 256)
        lat = n - (np.arange(a, b) + 0.5) / res
        arr[a:b] = np.round(height(lat[:, None], lon[None, :]) / 0.5).astype("<i2")
    arr.flush()


def lroc(outdir, name, scale, clat, clon, s, n, w, e, kind, rows=None, valid=None):
    kx = R * math.cos(math.radians(clat)) * math.pi / 180.0 / scale
    ky = MPD / scale
    lines, samples = int(round((n - s) * ky)), int(round((e - w) * kx))
    # PDS convention: centre of 0-based pixel (r, c) is at lat=(L0-r)/ky, lon=clon+(c-S0)/kx
    L0, S0 = n * ky - 0.5, -(w - clon) * kx - 0.5
    dt, bits, st, extra = {"dtm": ("<f4", 32, "PC_REAL", " MISSING_CONSTANT         = -3.40282265508890445e+38\n"),
                           "u8": ("u1", 8, "MSB_UNSIGNED_INTEGER", ""),
                           "i16": ("<i2", 16, "LSB_INTEGER", " SCALING_FACTOR           = 0.0001\n OFFSET                   = 0.0\n MISSING_CONSTANT         = -32768\n")}[kind]
    rec = samples * (bits // 8)

    def mk(nrec):
        return f"""PDS_VERSION_ID                  = PDS3
RECORD_TYPE                     = FIXED_LENGTH
RECORD_BYTES                    = {rec}
FILE_RECORDS                    = {lines + nrec}
LABEL_RECORDS                   = {nrec}
^IMAGE                          = {nrec + 1}
PRODUCT_ID                      = "{name}"
OBJECT                          = IMAGE_MAP_PROJECTION
    MAP_PROJECTION_TYPE         = EQUIRECTANGULAR
    A_AXIS_RADIUS               = 1737.4 <KM>
    B_AXIS_RADIUS               = 1737.4 <KM>
    C_AXIS_RADIUS               = 1737.4 <KM>
    CENTER_LATITUDE             = {clat} <DEG>
    CENTER_LONGITUDE            = {clon} <DEG>
    LINE_FIRST_PIXEL            = 1
    LINE_LAST_PIXEL             = {lines}
    SAMPLE_FIRST_PIXEL          = 1
    SAMPLE_LAST_PIXEL           = {samples}
    MAP_RESOLUTION              = {ky:.8f} <PIX/DEG>
    MAP_SCALE                   = {scale} <METERS/PIXEL>
    MAXIMUM_LATITUDE            = {n:.8f} <DEG>
    MINIMUM_LATITUDE            = {s:.8f} <DEG>
    EASTERNMOST_LONGITUDE       = {e:.8f} <DEG>
    WESTERNMOST_LONGITUDE       = {w:.8f} <DEG>
    LINE_PROJECTION_OFFSET      = {L0:.4f} <PIXEL>
    SAMPLE_PROJECTION_OFFSET    = {S0:.4f} <PIXEL>
END_OBJECT                      = IMAGE_MAP_PROJECTION
OBJECT                          = IMAGE
    LINES                       = {lines}
    LINE_SAMPLES                = {samples}
    BANDS                       = 1
    SAMPLE_BITS                 = {bits}
    SAMPLE_TYPE                 = {st}
{extra}END_OBJECT                      = IMAGE
END
"""
    nrec = 1
    while len(mk(nrec)) > nrec * rec:
        nrec += 1
    path = os.path.join(outdir, name + ".IMG")
    with open(path, "wb") as f:
        f.write(mk(nrec).encode().ljust(nrec * rec, b" "))
        f.truncate(nrec * rec + lines * rec)
    arr = np.memmap(path, dtype=dt, mode="r+", offset=nrec * rec, shape=(lines, samples))
    r0, r1 = rows(ky, L0, lines) if rows else (0, lines)
    lon = clon + (np.arange(samples) - S0) / kx
    for a in range(r0, r1, 256):
        b = min(r1, a + 256)
        lat = (L0 - np.arange(a, b)) / ky
        LA, LO = lat[:, None], lon[None, :]
        if kind == "dtm":
            v = height(LA, LO).astype("<f4")
            if valid is not None:
                v[~valid(np.arange(a, b)[:, None], np.arange(samples)[None, :], lines, samples)] = -3.40282265508890445e+38
        elif kind == "u8":
            v = np.clip(np.round(albedo(LA, LO) * 255), 1, 255).astype("u1")
        else:
            v = np.round(albedo(LA, LO) * 0.12 / 0.0001).astype("<i2")
        arr[a:b] = v
    arr.flush()


# Gazetteer stand-in: same dBASE layout as MOON_nomenclature_center_pts.dbf, invented test names only
NAMES = [  # name, clean_name, diameter km, lon 0..360 E, lat, type, code, approval, origin, feature id
    ("Tèst Alpha", "Test Alpha", 93.5, 339.92, 9.62, "Crater, craters", "AA", "Adopted by IAU", "synthetic test record", 1),
    ("Mare Probationis", "Mare Probationis", 875.75, 30.83, 8.35, "Mare, maria", "ME", "Adopted by IAU", "synthetic", 2),
    ("Test Beta", "Test Beta", 0.0, 23.47314, 0.67416, "Landing site name", "LF", "Adopted by IAU", "", 3),
    ("Test Dropped", "Test Dropped", 12.0, 10.0, 5.0, "Crater, craters", "AA", "Dropped, disallowed", "", 4),
    ("Test Gamma K", "Test Gamma K", 4.25, 180.0, -89.5, "Satellite Feature", "SF", "Adopted by IAU", "", 5),
]
NAME_FIELDS = [("name", "C", 254, 0), ("clean_name", "C", 254, 0), ("approvaldt", "C", 29, 0), ("origin", "C", 254, 0),
               ("diameter", "N", 24, 15), ("center_lon", "N", 24, 15), ("center_lat", "N", 24, 15), ("type", "C", 254, 0),
               ("code", "C", 254, 0), ("approval", "C", 254, 0), ("min_lon", "N", 24, 15), ("max_lon", "N", 24, 15),
               ("min_lat", "N", 24, 15), ("max_lat", "N", 24, 15), ("ethnicity", "C", 254, 0), ("continent", "C", 254, 0),
               ("quad_name", "C", 254, 0), ("quad_code", "C", 20, 0), ("link", "C", 80, 0)]


def nomenclature(outdir):
    rows = []
    for name, clean, d, lon, lat, typ, code, appr, origin, fid in NAMES:
        rows.append({"name": name, "clean_name": clean, "approvaldt": "2000/01/01 00:00:00", "origin": origin,
                     "diameter": d, "center_lon": lon, "center_lat": lat, "type": typ, "code": code, "approval": appr,
                     "min_lon": lon, "max_lon": lon, "min_lat": lat, "max_lat": lat, "ethnicity": "", "continent": "",
                     "quad_name": "", "quad_code": "", "link": f"http://planetarynames.wr.usgs.gov/Feature/{fid}"})
    rlen = 1 + sum(f[2] for f in NAME_FIELDS)
    hlen = 32 + 32 * len(NAME_FIELDS) + 1
    head = struct.pack("<BBBBIHH20x", 3, 126, 11, 16, len(rows), hlen, rlen)
    for n, t, ln, dc in NAME_FIELDS:
        head += struct.pack("<11sc4xBB14x", n.encode(), t.encode(), ln, dc)
    body = b""
    for r in rows:
        body += b" "
        for n, t, ln, dc in NAME_FIELDS:
            v = r[n]
            b = (f"{v:{ln}.{dc}f}" if t == "N" else str(v)).encode("utf-8")
            body += (b.rjust(ln) if t == "N" else b.ljust(ln))[:ln]
    with zipfile.ZipFile(os.path.join(outdir, "MOON_nomenclature_center_pts.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("MOON_nomenclature_center_pts.dbf", head + b"\r" + body + b"\x1a")
        z.writestr("MOON_nomenclature_center_pts.cpg", "UTF-8")


def main(outdir):
    os.makedirs(outdir, exist_ok=True)
    lola(outdir, "LDEM_16", 16, -90, 90, 0, 360)
    lola(outdir, "LDEM_64", 64, -90, 90, 0, 360, rows=(int((90 - 10) * 64), int((90 + 9) * 64)))
    lola(outdir, "LDEM_512_00N_45N_000_090", 512, 0, 45, 0, 90, rows=(int((45 - 3) * 512), 45 * 512))
    lola(outdir, "LDEM_512_45S_00S_000_090", 512, -45, 0, 0, 90, rows=(0, 2 * 512))
    band = lambda la0, la1: (lambda ky, L0, lines: (max(0, int(L0 - la1 * ky)), min(lines, int(L0 - la0 * ky) + 2)))
    lroc(outdir, "WAC_GLOBAL_E300N0450_100M", 100.0, 30.0, 45.0, 0, 60, 0, 90, "u8", rows=band(0, 9))
    lroc(outdir, "WAC_GLOBAL_E300S0450_100M", 100.0, -30.0, 45.0, -60, 0, 0, 90, "u8", rows=band(-8, 0))
    # NAC strip: slanted valid area with ragged no-data margins, like a real stereo DTM
    valid = lambda r, c, L, S: (c > 150 + 0.02 * r) & (c < S - 420 + 0.02 * r) & (r > 80) & (r < L - 80)
    lroc(outdir, "NAC_DTM_APOLLO11_E008N0234", 2.0, 0.78, 23.44, 0.31, 1.24, 23.37, 23.51, "dtm", valid=valid)
    lroc(outdir, "NAC_DTM_APOLLO11_M150361817_50CM", 0.5, 0.78, 23.44, 0.31, 1.24, 23.37, 23.51, "i16",
         rows=band(SITE[0] - 0.06, SITE[0] + 0.06))
    # SVS colour map stand-in (centre = 0 deg lon)
    lat = 90 - (np.arange(2048) + 0.5) / 2048 * 180
    lon = -180 + (np.arange(4096) + 0.5) / 4096 * 360
    a = albedo(lat[:, None] * 0.01, lon[None, :] * 0.01)
    rgb = np.stack([a, a * 0.95, a * 0.9], -1)
    Image.fromarray(np.round(rgb * 255).astype("u1")).save(os.path.join(outdir, "lroc_color_poles_4k.tif"))
    nomenclature(outdir)
    print("synthetic sources written to", outdir)


if __name__ == "__main__":
    main(sys.argv[1])
