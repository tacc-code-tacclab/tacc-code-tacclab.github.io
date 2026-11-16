#!/usr/bin/env python3
"""
fetch_and_process.py - data pipeline for the browser lunar flight simulator.

Downloads ONLY real LRO products and converts them into lightweight web assets:

  tier      DEM source (native)                    imagery source (native)
  --------  -------------------------------------  ------------------------------------
  global    LOLA GDR LDEM_16     (1895 m/px)        NASA SVS CGI Moon Kit, LROC WAC color
  wide      LOLA GDR LDEM_64     ( 474 m/px)        LROC WAC global mosaic (100 m/px)
  regional  LOLA GDR LDEM_512    (  59 m/px)        LROC WAC global mosaic (100 m/px)
  local     LROC NAC DTM         (   2 m/px)        LROC NAC orthophoto   (0.5 m/px)

Nothing is synthesised: no procedural craters, no texture synthesis, no hole
filling. The only numerical operations are windowing, bilinear / block-mean
resampling, linear contrast stretch (16-bit imagery only) and finite-difference
normals derived from the DEM itself. Every operation is recorded in the
manifest together with the source URL and the byte window that was read.

The PDS .IMG products are uncompressed rasters, so only the rows that cover the
requested window are downloaded (HTTP Range requests), not the multi-GB files.

Usage:
    python fetch_and_process.py --site apollo11
    python fetch_and_process.py --lat 26.13 --lon 3.63 --name hadley   # no NAC tier
    python fetch_and_process.py --site apollo11 --mirror /path/with/predownloaded/files

Requires: numpy, requests, Pillow (with WebP).
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import math
import os
import re
import sys
import time

import numpy as np

try:
    import requests
except ImportError:  # only needed for remote access
    requests = None
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

R_MOON = 1737400.0  # m, LRO/LOLA reference sphere
M_PER_DEG = math.pi * R_MOON / 180.0

# --------------------------------------------------------------------------
# Source catalogue (all URLs point to NASA PDS nodes / NASA SVS)
# --------------------------------------------------------------------------
LOLA_BASE = "https://imbrium.mit.edu/DATA/LOLA_GDR/CYLINDRICAL/IMG/"  # LOLA PDS data node
LROC_BASE = "https://pds.lroc.im-ldi.com/data/LRO-L-LROC-5-RDR-V1.0/LROLRC_2001/DATA/"
SVS_COLOR = "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_4k.tif"

SITES = {
    "apollo11": {
        "name": "Apollo 11 - Tranquility Base (Mare Tranquillitatis)",
        "lat": 0.67416, "lon": 23.47314,  # LM descent stage
        "nac_dtm": LROC_BASE + "SDP/NAC_DTM/APOLLO11/NAC_DTM_APOLLO11_E008N0234.IMG",
        "nac_ortho": LROC_BASE + "SDP/NAC_DTM/APOLLO11/NAC_DTM_APOLLO11_M150361817_50CM.IMG",
    },
}

TIER_DEFAULTS = {
    "wide": {"span_deg": 16.0, "dem_px": 1024, "img_px": 2048},
    "regional": {"span_deg": 4.0, "dem_px": 2048, "img_px": 2048},
    "local": {"size_m": 2048.0, "min_size_m": 256.0, "img_factor": 4},
}


def log(*a):
    print("[moon]", *a, flush=True)


# --------------------------------------------------------------------------
# Byte access: remote (HTTP Range) or local mirror
# --------------------------------------------------------------------------
class ByteSource:
    """Random access to a remote file, with optional local mirror directory."""

    def __init__(self, url: str, mirror: str | None, cache: str):
        self.url = url
        self.name = url.rsplit("/", 1)[-1]
        self.local = None
        for d in filter(None, [mirror, cache]):
            p = os.path.join(d, self.name)
            if os.path.isfile(p) and not os.path.exists(p + ".part"):
                self.local = p
                break
        self.cache = cache
        self.bytes_read = 0
        self.ranges = []

    def describe(self):
        return self.local if self.local else self.url

    def read(self, start: int, length: int) -> bytes:
        self.ranges.append([int(start), int(length)])
        self.bytes_read += length
        if self.local:
            with open(self.local, "rb") as f:
                f.seek(start)
                data = f.read(length)
            if len(data) != length:
                raise IOError(f"{self.local}: short read at {start} (+{length})")
            return data
        return self._http_range(start, length)

    def _http_range(self, start, length, tries=5):
        if requests is None:
            raise RuntimeError("the 'requests' package is required for downloads")
        hdr = {"Range": f"bytes={start}-{start + length - 1}",
               "User-Agent": "lunar-sim-pipeline/1.0 (research use)"}
        last = None
        for attempt in range(tries):
            try:
                with requests.get(self.url, headers=hdr, stream=True, timeout=120) as r:
                    if r.status_code == 200 and (start > 0 or length < int(r.headers.get("Content-Length", length))):
                        log(f"  server ignored Range for {self.name}; downloading the whole file once")
                        r.close()
                        self.local = self.download_full()
                        return self.read_local(start, length)
                    if r.status_code not in (200, 206):
                        raise IOError(f"HTTP {r.status_code} for {self.url}")
                    buf = bytearray()
                    t0 = time.time()
                    for chunk in r.iter_content(1 << 20):
                        buf.extend(chunk)
                        if length > (32 << 20) and time.time() - t0 > 5:
                            t0 = time.time()
                            log(f"    {self.name}: {len(buf) / 1e6:.0f} / {length / 1e6:.0f} MB")
                    if len(buf) < length:
                        raise IOError(f"short body {len(buf)} < {length}")
                    return bytes(buf[:length])
            except Exception as e:  # network errors: retry with back-off
                last = e
                log(f"  retry {attempt + 1}/{tries} for {self.name}: {e}")
                time.sleep(2 + 3 * attempt)
        raise IOError(f"could not read {self.url}: {last}")

    def read_local(self, start, length):
        with open(self.local, "rb") as f:
            f.seek(start)
            return f.read(length)

    def download_full(self) -> str:
        """Download the complete file into the cache (resumable)."""
        if self.local:
            return self.local
        os.makedirs(self.cache, exist_ok=True)
        dst = os.path.join(self.cache, self.name)
        part = dst + ".part"
        have = os.path.getsize(part) if os.path.exists(part) else 0
        hdr = {"User-Agent": "lunar-sim-pipeline/1.0 (research use)"}
        if have:
            hdr["Range"] = f"bytes={have}-"
        log(f"  downloading {self.url}" + (f" (resuming at {have / 1e6:.0f} MB)" if have else ""))
        with requests.get(self.url, headers=hdr, stream=True, timeout=120) as r:
            if r.status_code == 200:
                have = 0
            elif r.status_code != 206:
                raise IOError(f"HTTP {r.status_code} for {self.url}")
            with open(part, "ab" if have else "wb") as f:
                t0 = time.time()
                for chunk in r.iter_content(1 << 20):
                    f.write(chunk)
                    have += len(chunk)
                    if time.time() - t0 > 5:
                        t0 = time.time()
                        log(f"    {self.name}: {have / 1e6:.0f} MB")
        os.replace(part, dst)
        self.local = dst
        return dst


# --------------------------------------------------------------------------
# PDS3 label parsing
# --------------------------------------------------------------------------
_KV = re.compile(r"^\s*(\^?[A-Za-z0-9_:]+)\s*=\s*(.*?)\s*$")


def parse_pds3_label(text: str) -> dict:
    """Flat dict of KEY -> value plus 'OBJECT.KEY' qualified entries."""
    out, stack = {}, []
    for raw in text.splitlines():
        line = raw.split("/*")[0].rstrip()
        if line.strip() == "END":
            break
        m = _KV.match(line)
        if not m:
            continue
        key, val = m.group(1).upper(), m.group(2)
        if key in ("OBJECT", "GROUP"):
            stack.append(val.strip().upper())
            continue
        if key in ("END_OBJECT", "END_GROUP"):
            if stack:
                stack.pop()
            continue
        val = re.sub(r"<[^>]*>", "", val).strip().strip('"').strip("'").strip()
        if stack:
            out[stack[-1] + "." + key] = val
        out.setdefault(key, val)
    return out


def _num(v, default=None):
    if v is None:
        return default
    try:
        return float(str(v).replace("D", "E").replace("d", "e"))
    except ValueError:
        return default


_DTYPES = {
    "LSB_INTEGER": "<i", "PC_INTEGER": "<i", "VAX_INTEGER": "<i",
    "MSB_INTEGER": ">i", "SUN_INTEGER": ">i", "INTEGER": ">i",
    "LSB_UNSIGNED_INTEGER": "<u", "PC_UNSIGNED_INTEGER": "<u",
    "MSB_UNSIGNED_INTEGER": ">u", "UNSIGNED_INTEGER": ">u", "SUN_UNSIGNED_INTEGER": ">u",
    "PC_REAL": "<f", "IEEE_REAL": ">f", "REAL": ">f", "SUN_REAL": ">f", "MAC_REAL": ">f",
}


class PdsRaster:
    """A map-projected, uncompressed PDS3 raster (attached or detached label)."""

    def __init__(self, url, mirror, cache, detached_label=False):
        self.src = ByteSource(url, mirror, cache)
        self.name = self.src.name
        if detached_label:
            lbl_url = re.sub(r"\.IMG$", ".LBL", url, flags=re.I)
            lsrc = ByteSource(lbl_url, mirror, cache)
            text = self._fetch_small(lsrc)
        else:
            text = self.src.read(0, 65536).decode("latin-1", "replace")
        self.text = text
        L = self.label = parse_pds3_label(text)
        g = lambda k, d=None: L.get("IMAGE." + k, L.get(k, d))
        self.lines = int(_num(g("LINES")))
        self.samples = int(_num(g("LINE_SAMPLES")))
        bits = int(_num(g("SAMPLE_BITS")))
        st = str(g("SAMPLE_TYPE", "MSB_UNSIGNED_INTEGER")).upper()
        if st not in _DTYPES:
            raise ValueError(f"{self.name}: unsupported SAMPLE_TYPE {st}")
        self.dtype = np.dtype("u1") if bits == 8 else np.dtype(_DTYPES[st] + str(bits // 8))
        if int(_num(g("BANDS", 1))) != 1:
            raise ValueError(f"{self.name}: multi-band rasters are not supported")
        self.scale = _num(g("SCALING_FACTOR"), 1.0)
        self.offset = _num(g("OFFSET"), 0.0)
        self.missing = self._missing(g("MISSING_CONSTANT", g("NULL", g("CORE_NULL"))))
        if self.missing is None and bits == 8:
            self.missing = 0.0  # LROC 8-bit products use DN 0 as NULL
        # data offset
        rec = _num(L.get("RECORD_BYTES"), 0) or 0
        ptr = L.get("^IMAGE", "1")
        self.data_offset = 0
        if not detached_label:
            m = re.match(r"\(?\s*(\d+)", ptr)
            if m:
                n = int(m.group(1))
                self.data_offset = (n - 1) if "BYTES" in raw_units(text, "^IMAGE") else (n - 1) * int(rec)
            elif L.get("LABEL_RECORDS"):
                self.data_offset = int(_num(L["LABEL_RECORDS"])) * int(rec)
        self._georef()

    @staticmethod
    def _fetch_small(src):
        if src.local:
            return open(src.local, "rb").read().decode("latin-1", "replace")
        r = requests.get(src.url, timeout=60, headers={"User-Agent": "lunar-sim-pipeline/1.0"})
        if r.status_code != 200:
            raise IOError(f"HTTP {r.status_code} for {src.url}")
        return r.content.decode("latin-1", "replace")

    def _missing(self, v):
        if v is None:
            return None
        m = re.match(r"16#([0-9A-Fa-f]+)#", str(v))
        if m:
            raw = bytes.fromhex(m.group(1))
            if len(raw) == self.dtype.itemsize:
                return float(np.frombuffer(raw, dtype=self.dtype.newbyteorder(">"))[0])
            return None
        return _num(v)

    # -- georeferencing (both supported projections are separable in lat / lon)
    def _georef(self):
        L = self.label
        p = lambda k: _num(L.get("IMAGE_MAP_PROJECTION." + k, L.get(k)))
        proj = str(L.get("IMAGE_MAP_PROJECTION.MAP_PROJECTION_TYPE", L.get("MAP_PROJECTION_TYPE", ""))).upper()
        self.maxlat, self.minlat = p("MAXIMUM_LATITUDE"), p("MINIMUM_LATITUDE")
        self.west, self.east = p("WESTERNMOST_LONGITUDE"), p("EASTERNMOST_LONGITUDE")
        if "CYLINDRICAL" in proj:  # LOLA GDR: constant pixels/degree, bounds are pixel edges
            res = p("MAP_RESOLUTION")
            self.kind = "simple_cylindrical"
            self._row = lambda lat: (self.maxlat - lat) * res
            self._col = lambda lon: np.mod(lon - self.west, 360.0) * res
            self._lat = lambda y: self.maxlat - y / res
            self._lon = lambda x: self.west + x / res
            self.mpp_lat = M_PER_DEG / res
            self.global_lon = abs((self.east - self.west) - 360.0) < 1e-6
        elif "EQUIRECT" in proj:  # LROC RDR: metres/pixel, true at CENTER_LATITUDE
            sc = p("MAP_SCALE")
            if sc is None:
                raise ValueError(f"{self.name}: MAP_SCALE missing")
            unit = raw_units(self.text, "MAP_SCALE")
            if sc < 0.05 or "KM" in unit:  # km/pixel
                sc *= 1000.0
            rad = (p("A_AXIS_RADIUS") or 1737.4) * 1000.0
            clat, clon = p("CENTER_LATITUDE") or 0.0, p("CENTER_LONGITUDE") or 0.0
            L0, S0 = p("LINE_PROJECTION_OFFSET"), p("SAMPLE_PROJECTION_OFFSET")
            kx = rad * math.cos(math.radians(clat)) * math.pi / 180.0 / sc  # px per degree lon
            ky = rad * math.pi / 180.0 / sc  # px per degree lat
            # pixel centre of 0-based (row, col) sits at continuous (row+0.5, col+0.5)
            cands = []
            if L0 is not None and S0 is not None:
                cands.append(("label offsets, origin at equator", L0 + 0.5, S0 + 0.5, 0.0))
                cands.append(("label offsets, origin at centre latitude", L0 + 0.5, S0 + 0.5, clat))
            if None not in (self.maxlat, self.west):
                dl = ((self.west - clon + 180.0) % 360.0) - 180.0
                cands.append(("label bounds", self.maxlat * ky, -dl * kx, 0.0))
            if len(cands) > 1:
                cands = cands[:2]  # explicit projection offsets always win over (possibly rounded) bounds
            best = None
            for how, y0, x0, lat0 in cands:
                err = 0.0
                if None not in (self.maxlat, self.minlat):
                    err = max(abs((y0 - (self.maxlat - lat0) * ky)), abs(y0 - (self.minlat - lat0) * ky - self.lines))
                if best is None or err < best[0] - 0.75:
                    best = (err, how, y0, x0, lat0)
            if best is None:
                raise ValueError(f"{self.name}: cannot georeference (no offsets, no bounds)")
            err, how, y0, x0, lat0 = best
            self.georef_note = f"{how} (bounds mismatch {err:.2f} px)"
            if err > 3.0:
                log(f"  WARNING {self.name}: georeferencing check off by {err:.1f} px ({how})")
            self.kind = "equirectangular"
            wrap = lambda d: np.mod(d + 180.0, 360.0) - 180.0
            self._row = lambda lat: y0 - (lat - lat0) * ky
            self._col = lambda lon: x0 + wrap(lon - clon) * kx
            self._lat = lambda y: lat0 + (y0 - y) / ky
            self._lon = lambda x: clon + (x - x0) / kx
            self.mpp_lat = sc
            self.global_lon = False
        else:
            raise ValueError(f"{self.name}: unsupported projection '{proj}'")

    # -- raster access
    def read_window(self, r0, r1, c0, c1) -> np.ndarray:
        """Rows [r0,r1) x cols [c0,c1) as float32 physical values, NaN = no data."""
        r0, r1 = max(0, int(r0)), min(self.lines, int(r1))
        c0, c1 = max(0, int(c0)), min(self.samples, int(c1))
        isz = self.dtype.itemsize
        rowb = self.samples * isz
        out = np.empty((r1 - r0, c1 - c0), dtype=self.dtype)
        step = max(1, (48 << 20) // rowb)  # ~48 MB per request
        log(f"  reading {self.name} rows {r0}:{r1} cols {c0}:{c1} "
            f"({(r1 - r0) * rowb / 1e6:.1f} MB of {self.lines * rowb / 1e6:.0f} MB) from {self.src.describe()}")
        for a in range(r0, r1, step):
            b = min(r1, a + step)
            buf = self.src.read(self.data_offset + a * rowb, (b - a) * rowb)
            out[a - r0:b - r0] = np.frombuffer(buf, dtype=self.dtype).reshape(b - a, self.samples)[:, c0:c1]
        return self.to_physical(out)

    def to_physical(self, dn):
        v = dn.astype(np.float32)
        bad = np.zeros(dn.shape, bool)
        if self.missing is not None:
            bad |= dn == np.array(self.missing).astype(self.dtype) if self.dtype.kind != "f" else np.isclose(v, self.missing)
        if self.dtype.kind == "f":
            bad |= ~np.isfinite(v) | (v < -1e30)
        off = 0.0 if abs(self.offset - R_MOON) < 1.0 else self.offset  # heights relative to 1737.4 km
        v = v * np.float32(self.scale) + np.float32(off)
        v[bad] = np.nan
        return v

    def provenance(self):
        return {"file": self.name, "url": self.src.url, "projection": self.kind,
                "native_m_per_px": round(self.mpp_lat, 4), "bytes_read": self.src.bytes_read,
                "byte_ranges": self.src.ranges[:64],
                "georef": getattr(self, "georef_note", "label bounds / MAP_RESOLUTION")}


def raw_units(text, key):
    m = re.search(r"^\s*" + re.escape(key) + r"\s*=.*?<([^>]*)>", text or "", flags=re.M)
    return m.group(1).upper() if m else ""


# --------------------------------------------------------------------------
# Resampling (separable lat/lon grids)
# --------------------------------------------------------------------------
def block_mean(a, k):
    if k <= 1:
        return a
    h, w = (a.shape[0] // k) * k, (a.shape[1] // k) * k
    a = a[:h, :w].reshape(h // k, k, w // k, k)
    with np.errstate(invalid="ignore"):
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", RuntimeWarning)
            return np.nanmean(a, axis=(1, 3)).astype(np.float32)


def bilinear(a, y, x):
    """Sample a (pixel centres at i+0.5) at continuous coords y (rows) / x (cols). NaN outside."""
    fy, fx = y - 0.5, x - 0.5
    inside_y = (y >= 0) & (y <= a.shape[0])
    inside_x = (x >= 0) & (x <= a.shape[1])
    fy = np.clip(fy, 0, a.shape[0] - 1)
    fx = np.clip(fx, 0, a.shape[1] - 1)
    y0 = np.minimum(np.floor(fy).astype(np.int64), max(a.shape[0] - 2, 0))
    x0 = np.minimum(np.floor(fx).astype(np.int64), max(a.shape[1] - 2, 0))
    y1 = np.minimum(y0 + 1, a.shape[0] - 1)
    x1 = np.minimum(x0 + 1, a.shape[1] - 1)
    wy = (fy - y0).astype(np.float32)[:, None]
    wx = (fx - x0).astype(np.float32)[None, :]
    out = np.empty((len(y), len(x)), np.float32)
    CH = 512  # chunk rows to bound memory
    for s in range(0, len(y), CH):
        e = min(len(y), s + CH)
        ia, ib = y0[s:e], y1[s:e]
        top = a[np.ix_(ia, x0)] * (1 - wx) + a[np.ix_(ia, x1)] * wx
        bot = a[np.ix_(ib, x0)] * (1 - wx) + a[np.ix_(ib, x1)] * wx
        out[s:e] = top * (1 - wy[s:e]) + bot * wy[s:e]
    out[~inside_y, :] = np.nan
    out[:, ~inside_x] = np.nan
    return out


def sample_products(products, lats, lons):
    """Fill a (len(lats), len(lons)) grid from one or more rasters. NaN where no data."""
    out = np.full((len(lats), len(lons)), np.nan, np.float32)
    for p in products:
        y, x = p._row(lats), p._col(lons)
        my = (y >= 0) & (y <= p.lines)
        mx = (x >= 0) & (x <= p.samples)
        if not my.any() or not mx.any():
            continue
        yi, xi = np.where(my)[0], np.where(mx)[0]
        if p.global_lon:
            c0, c1 = 0, p.samples
        else:
            c0, c1 = int(math.floor(x[mx].min())) - 2, int(math.ceil(x[mx].max())) + 2
        r0, r1 = int(math.floor(y[my].min())) - 2, int(math.ceil(y[my].max())) + 2
        r0, r1, c0, c1 = max(0, r0), min(p.lines, r1), max(0, c0), min(p.samples, c1)
        win = p.read_window(r0, r1, c0, c1)
        if p.global_lon:  # wrap one column each side for interpolation across 0/360
            win = np.concatenate([win[:, -1:], win, win[:, :1]], axis=1)
            c0 -= 1
        fy = abs(float(np.median(np.diff(y)))) if len(y) > 1 else 1.0
        fx = abs(float(np.median(np.diff(x)))) if len(x) > 1 else 1.0
        k = int(max(1, math.floor(min(fy, fx) + 0.25)))
        if k > 1:  # anti-aliased downsampling: block mean, then bilinear
            win = block_mean(win, k)
        sub = bilinear(win, (y[yi] - r0) / k, (x[xi] - c0) / k)
        tgt = out[np.ix_(yi, xi)]
        fill = np.isnan(tgt) & ~np.isnan(sub)
        tgt[fill] = sub[fill]
        out[np.ix_(yi, xi)] = tgt
    return out


def grid(bounds, w, h):
    s, n, wst, e = bounds
    lats = n - (np.arange(h) + 0.5) * (n - s) / h
    lons = wst + (np.arange(w) + 0.5) * (e - wst) / w
    return lats, lons


# --------------------------------------------------------------------------
# Asset writers
# --------------------------------------------------------------------------
def write_dem_png(path, dem):
    if np.isnan(dem).any():
        raise ValueError(f"{os.path.basename(path)}: DEM window contains no-data pixels "
                         f"({np.isnan(dem).mean() * 100:.2f}%); refusing to invent values")
    lo, hi = float(dem.min()), float(dem.max())
    hs = max(hi - lo, 1e-3) / 65535.0
    q = np.round((dem - lo) / hs).astype(np.uint16)
    Image.fromarray(q).save(path, format="PNG", optimize=False, compress_level=6)
    return {"file": os.path.basename(path), "width": int(dem.shape[1]), "height": int(dem.shape[0]),
            "h_min": lo, "h_scale": hs, "encoding": "uint16 PNG; h[m] = h_min + DN*h_scale, relative to 1737400 m sphere"}


def write_normal_map(path, dem, bounds, max_px=2048):
    """East-North-Up surface normals by central differences of the DEM itself."""
    s, n, w, e = bounds
    h, wd = dem.shape
    lat = n - (np.arange(h) + 0.5) * (n - s) / h
    dy = (n - s) / h * M_PER_DEG
    dx = (e - w) / wd * M_PER_DEG * np.maximum(np.cos(np.radians(lat)), 1e-3)[:, None]
    dz_dn = -np.gradient(dem, axis=0) / dy  # rows run north -> south
    dz_de = np.gradient(dem, axis=1) / dx
    nrm = np.stack([-dz_de, -dz_dn, np.ones_like(dem)], axis=-1)
    nrm /= np.linalg.norm(nrm, axis=-1, keepdims=True)
    img = Image.fromarray(np.round((nrm * 0.5 + 0.5) * 255).astype(np.uint8), "RGB")
    if max(img.size) > max_px:
        f = max_px / max(img.size)
        img = img.resize((round(img.size[0] * f), round(img.size[1] * f)), Image.BOX)
    img.save(path, format="WEBP", quality=92, method=4)
    return {"file": os.path.basename(path), "width": img.size[0], "height": img.size[1],
            "encoding": "RGB = (east, north, up)*0.5+0.5, derived from the DEM by central differences"}


def write_image(path, arr, quality=90):
    """arr: float32 (H,W) physical values (NaN=no data) or uint8 (H,W[,3])."""
    info = {}
    if arr.dtype != np.uint8:
        nodata = np.isnan(arr)
        valid = arr[~nodata]
        if valid.size == 0:
            raise ValueError(f"{os.path.basename(path)}: image window has no valid data")
        if valid.min() >= 0 and valid.max() <= 255 and np.all(valid == np.round(valid)):
            a8 = np.where(nodata, 0, arr).astype(np.uint8)
            info["stretch"] = "none (8-bit source values preserved)"
        else:
            lo, hi = np.percentile(valid, [0.5, 99.5])
            a8 = np.clip((arr - lo) / max(hi - lo, 1e-12) * 255.0, 0, 255)
            a8 = np.where(nodata, 0, a8).astype(np.uint8)
            info["stretch"] = f"linear, {lo:.6g} -> 0, {hi:.6g} -> 255 (0.5-99.5 percentile)"
        info["nodata_fraction"] = float(nodata.mean())
        arr = a8
    img = Image.fromarray(arr)
    img.save(path, format="WEBP", quality=quality, method=4)
    info.update({"file": os.path.basename(path), "width": img.size[0], "height": img.size[1]})
    return info


# --------------------------------------------------------------------------
# Tier builders
# --------------------------------------------------------------------------
def lola512_tiles(bounds):
    s, n, w, e = bounds
    names = set()
    for lat in (s + 1e-9, n - 1e-9):
        for lon in (w + 1e-9, e - 1e-9):
            lb = min(3, int((lat + 90) // 45))
            band = ["90S_45S", "45S_00S", "00N_45N", "45N_90N"][lb]
            lo = int((lon % 360) // 90) * 90
            names.add(f"LDEM_512_{band}_{lo:03d}_{lo + 90:03d}.IMG")
    return sorted(names)


def wac_tiles(bounds):
    s, n, w, e = bounds
    if s < -60 or n > 60:
        raise ValueError("WAC equirectangular tiles cover |lat| <= 60 deg only; "
                         "polar-stereographic sites are not implemented in this pipeline")
    names = set()
    for lat in (s + 1e-9, n - 1e-9):
        for lon in (w + 1e-9, e - 1e-9):
            c = int((lon % 360) // 90) * 90 + 45
            names.add(f"WAC_GLOBAL_E300{'N' if lat >= 0 else 'S'}{c * 10:04d}_100M.IMG")
    return sorted(names)


class Builder:
    def __init__(self, site_id, site, out, cache, mirror):
        self.site_id, self.site = site_id, site
        self.out = os.path.join(out, site_id)
        self.cache, self.mirror = cache, mirror
        os.makedirs(self.out, exist_ok=True)
        os.makedirs(cache, exist_ok=True)
        self.tiers = []

    def lola(self, name):
        return PdsRaster(LOLA_BASE + name, self.mirror, self.cache, detached_label=True)

    def lroc(self, url):
        return PdsRaster(url, self.mirror, self.cache)

    def _finish(self, tid, bounds, dem, dem_srcs, img, img_srcs, img_native, dem_native, notes=None):
        s, n, w, e = bounds
        p = lambda suf: os.path.join(self.out, f"{tid}_{suf}")
        d = write_dem_png(p("dem.png"), dem)
        nm = write_normal_map(p("nrm.webp"), dem, bounds)
        im = write_image(p("img.webp"), img)
        clat = math.cos(math.radians((s + n) / 2))
        d.update({"native_m_per_px": dem_native, "grid_m_per_px": (n - s) * M_PER_DEG / dem.shape[0],
                  "sources": [x.provenance() if hasattr(x, "provenance") else x for x in dem_srcs]})
        im.update({"native_m_per_px": img_native, "grid_m_per_px": (n - s) * M_PER_DEG / im["height"],
                   "sources": [x.provenance() if hasattr(x, "provenance") else x for x in img_srcs]})
        t = {"id": tid, "bounds": {"south": s, "north": n, "west": w, "east": e},
             "size_km": [round((e - w) * M_PER_DEG * clat / 1000, 3), round((n - s) * M_PER_DEG / 1000, 3)],
             "dem": d, "normal": nm, "image": im}
        if notes:
            t["notes"] = notes
        self.tiers.append(t)
        log(f"  tier '{tid}': DEM {d['width']}x{d['height']} @ {d['grid_m_per_px']:.2f} m/px "
            f"(native {dem_native:.2f}), image {im['width']}x{im['height']} (native {img_native:.2f} m/px)")

    def build_global(self):
        log("tier global: LOLA LDEM_16 + SVS CGI Moon Kit colour")
        p = self.lola("LDEM_16.IMG")
        dem = p.read_window(0, p.lines, 0, p.samples)
        dem = np.roll(dem, p.samples // 2, axis=1)  # 0..360E  ->  -180..180E
        src = ByteSource(SVS_COLOR, self.mirror, self.cache)
        path = src.download_full()
        try:
            col = np.asarray(Image.open(path).convert("RGB"))
        except Exception:
            import tifffile  # 16-bit TIFF fallback
            col = tifffile.imread(path)
            if col.dtype == np.uint16:
                col = (col >> 8).astype(np.uint8)
            col = np.ascontiguousarray(col[..., :3])
        self._finish("global", (-90.0, 90.0, -180.0, 180.0), dem, [p], col,
                     [{"file": src.name, "url": SVS_COLOR,
                       "note": "NASA SVS CGI Moon Kit (svs.gsfc.nasa.gov/4720): LROC WAC Hapke-normalised "
                               "colour mosaic, map centred on 0 deg longitude"}],
                     img_native=math.pi * R_MOON / col.shape[0], dem_native=p.mpp_lat)

    def _lola_wac(self, tid, span, dem_px, img_px, dem_products):
        lat0, lon0 = self.site["lat"], self.site["lon"]
        # snap the window to the source pixel grid so DEM values pass through unresampled
        res = dem_px / span
        s0, w0 = round((lat0 - span / 2) * res) / res, round((lon0 - span / 2) * res) / res
        b = (s0, s0 + span, w0, w0 + span)
        if b[0] < -90 or b[1] > 90:
            raise ValueError(f"tier {tid}: window crosses a pole; not supported")
        lats, lons = grid(b, dem_px, dem_px)
        dem = sample_products(dem_products, lats, lons)
        wacs = [self.lroc(LROC_BASE + "BDR/WAC_GLOBAL/" + n) for n in wac_tiles(b)]
        lats, lons = grid(b, img_px, img_px)
        img = sample_products(wacs, lats, lons)
        self._finish(tid, b, dem, dem_products, img, wacs, img_native=wacs[0].mpp_lat,
                     dem_native=dem_products[0].mpp_lat)

    def build_wide(self):
        c = TIER_DEFAULTS["wide"]
        log("tier wide: LOLA LDEM_64 + LROC WAC global mosaic")
        self._lola_wac("wide", c["span_deg"], c["dem_px"], c["img_px"], [self.lola("LDEM_64.IMG")])

    def build_regional(self):
        c = TIER_DEFAULTS["regional"]
        log("tier regional: LOLA LDEM_512 + LROC WAC global mosaic")
        lat0, lon0, sp = self.site["lat"], self.site["lon"], c["span_deg"]
        b = (lat0 - sp / 2, lat0 + sp / 2, lon0 - sp / 2, lon0 + sp / 2)
        self._lola_wac("regional", sp, c["dem_px"], c["img_px"], [self.lola(n) for n in lola512_tiles(b)])

    def build_local(self):
        if "nac_dtm" not in self.site:
            log("tier local: no LROC NAC DTM configured for this site - skipped")
            return
        c = TIER_DEFAULTS["local"]
        log("tier local: LROC NAC DTM + NAC orthophoto")
        dtm = self.lroc(self.site["nac_dtm"])
        full = dtm.read_window(0, dtm.lines, 0, dtm.samples)
        valid = np.isfinite(full)
        yc, xc = float(dtm._row(np.array([self.site["lat"]]))[0]), float(dtm._col(np.array([self.site["lon"]]))[0])
        if not (0 <= yc < dtm.lines and 0 <= xc < dtm.samples) or not valid[int(yc), int(xc)]:
            raise ValueError("site centre is outside the valid area of the NAC DTM")
        ii = np.zeros((dtm.lines + 1, dtm.samples + 1), np.int64)
        ii[1:, 1:] = np.cumsum(np.cumsum(valid, axis=0, dtype=np.int64), axis=1)
        size, chosen = c["size_m"], None
        while size >= c["min_size_m"] and chosen is None:
            n = int(round(size / dtm.mpp_lat))
            if n < dtm.lines and n < dtm.samples:
                tot = ii[n:, n:] - ii[:-n, n:] - ii[n:, :-n] + ii[:-n, :-n]  # valid count per top-left
                m = int(0.1 * n)  # keep the site at least 10% away from the window edge
                ra, rb = max(0, int(yc) - n + m), min(tot.shape[0], int(yc) - m + 1)
                ca, cb = max(0, int(xc) - n + m), min(tot.shape[1], int(xc) - m + 1)
                if rb > ra and cb > ca:
                    ok = np.argwhere(tot[ra:rb, ca:cb] == n * n)
                    if len(ok):
                        cen = ok + [ra + n / 2, ca + n / 2]
                        k = np.argmin((cen[:, 0] - yc) ** 2 + (cen[:, 1] - xc) ** 2)
                        chosen = (int(ok[k, 0] + ra), int(ok[k, 1] + ca), n)
            if chosen is None:
                size /= 2
        if chosen is None:
            raise ValueError("no fully valid NAC DTM window found around the site")
        r0, c0, n = chosen
        log(f"  fully valid {n}x{n} px window ({n * dtm.mpp_lat:.0f} m) at row {r0}, col {c0}; "
            f"site offset from window centre: {(yc - r0 - n / 2) * dtm.mpp_lat:+.0f} m S, {(xc - c0 - n / 2) * dtm.mpp_lat:+.0f} m E")
        dem = full[r0:r0 + n, c0:c0 + n]
        b = (float(dtm._lat(r0 + n)), float(dtm._lat(r0)), float(dtm._lon(c0)), float(dtm._lon(c0 + n)))
        srcs, img, native = [], None, None
        ortho = self.lroc(self.site["nac_ortho"])
        f = max(1, min(c["img_factor"], int(round(dtm.mpp_lat / ortho.mpp_lat))))
        while n * f > 4096 and f > 1:
            f -= 1
        lats, lons = grid(b, n * f, n * f)
        img = sample_products([ortho], lats, lons)
        nd = float(np.isnan(img).mean())
        if nd > 0:
            log(f"  note: {nd * 100:.2f}% of the orthophoto window has no data (shown black)")
        self._finish("local", b, dem, [dtm], img, [ortho], img_native=ortho.mpp_lat, dem_native=dtm.mpp_lat,
                     notes="window aligned to the NAC DTM pixel grid (DEM values are passed through unresampled)")

    def write_manifest(self):
        m = {"schema": 1, "site_id": self.site_id, "name": self.site["name"],
             "lat": self.site["lat"], "lon": self.site["lon"], "radius_m": R_MOON,
             "generated_utc": _dt.datetime.now(_dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
             "generator": "fetch_and_process.py",
             "data_policy": "All elevation and imagery values derive from LRO LOLA / LROC products. "
                            "Operations: windowing, block-mean + bilinear resampling, linear stretch of "
                            "non-8-bit imagery, DEM-derived normals. No synthetic detail.",
             "sun": {"azimuth_deg": 90.0, "elevation_deg": 25.0,
                     "note": "only used by the optional DEM relief-shading mode"},
             "tiers": sorted(self.tiers, key=lambda t: ["global", "wide", "regional", "local"].index(t["id"]))}
        with open(os.path.join(self.out, "manifest.json"), "w") as f:
            json.dump(m, f, indent=1)
        idx_path = os.path.join(os.path.dirname(self.out), "sites.json")
        idx = {"default": self.site_id, "sites": {}}
        if os.path.exists(idx_path):
            try:
                idx = json.load(open(idx_path))
            except Exception:
                pass
        idx["sites"][self.site_id] = {"name": self.site["name"], "manifest": f"{self.site_id}/manifest.json"}
        idx.setdefault("default", self.site_id)
        json.dump(idx, open(idx_path, "w"), indent=1)
        log(f"manifest written: {os.path.join(self.out, 'manifest.json')}")


def main(argv=None):
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--site", default="apollo11", help=f"predefined site ({', '.join(SITES)})")
    ap.add_argument("--lat", type=float, help="custom site latitude (deg N); disables the NAC tier")
    ap.add_argument("--lon", type=float, help="custom site longitude (deg E)")
    ap.add_argument("--name", help="custom site id / name")
    ap.add_argument("--tiers", default="global,wide,regional,local")
    ap.add_argument("--out", default=os.path.join(here, "assets"))
    ap.add_argument("--cache", default=os.path.join(here, "cache"))
    ap.add_argument("--mirror", help="directory with pre-downloaded source files (matched by file name)")
    ap.add_argument("--list-sources", action="store_true", help="print the source URLs and exit")
    a = ap.parse_args(argv)

    if a.lat is not None and a.lon is not None:
        sid = re.sub(r"[^a-z0-9_]+", "_", (a.name or f"site_{a.lat:.3f}_{a.lon:.3f}").lower())
        site = {"name": a.name or sid, "lat": a.lat, "lon": a.lon % 360 if a.lon < 0 else a.lon}
    elif a.site in SITES:
        sid, site = a.site, SITES[a.site]
    else:
        ap.error(f"unknown site '{a.site}'")
    site = dict(site)
    site["lon"] = ((site["lon"] + 180) % 360) - 180

    if a.list_sources:
        sp = TIER_DEFAULTS["regional"]["span_deg"]
        b = (site["lat"] - sp / 2, site["lat"] + sp / 2, site["lon"] - sp / 2, site["lon"] + sp / 2)
        w = TIER_DEFAULTS["wide"]["span_deg"]
        bw = (site["lat"] - w / 2, site["lat"] + w / 2, site["lon"] - w / 2, site["lon"] + w / 2)
        urls = [LOLA_BASE + "LDEM_16.IMG", SVS_COLOR, LOLA_BASE + "LDEM_64.IMG"]
        urls += [LOLA_BASE + n for n in lola512_tiles(b)]
        urls += [LROC_BASE + "BDR/WAC_GLOBAL/" + n for n in sorted(set(wac_tiles(b) + wac_tiles(bw)))]
        urls += [site[k] for k in ("nac_dtm", "nac_ortho") if k in site]
        print("\n".join(urls))
        return 0

    bld = Builder(sid, site, a.out, a.cache, a.mirror)
    t0 = time.time()
    for t in [x.strip() for x in a.tiers.split(",") if x.strip()]:
        getattr(bld, "build_" + t)()
    bld.write_manifest()
    log(f"done in {time.time() - t0:.0f} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
