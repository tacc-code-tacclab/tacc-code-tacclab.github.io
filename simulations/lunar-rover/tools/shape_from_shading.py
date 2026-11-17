#!/usr/bin/env python3
"""
Relief inferred from shading ("shape from shading") for the Apollo 11 local tile.

Input  (real data, produced by ../lunar-flight/fetch_and_process.py):
    local_dem.png   LROC NAC DTM, 2 m/px          (measured elevation)
    local_img.webp  LROC NAC orthophoto, 0.5 m/px (measured brightness)
Output:
    data/apollo11_sfs.png   8-bit height correction at 1 m/px, to be ADDED to the bicubically interpolated DTM
    data/apollo11_sfs.json  encoding, parameters and the validation numbers printed below

Method (linear photoclinometry, Fourier domain):
  * brightness is normalised by its 48 m local mean (removes albedo / large-scale trends);
  * for small slopes, relative brightness is proportional to the slope along the sun azimuth:  q = K * dz/da,
    a = unit vector pointing away from the sun.  Sun azimuth and K are NOT taken from the image label: both are
    fitted to the measured DTM in the band where DTM and image overlap (8-32 m wavelengths);
  * dz/da is integrated in the Fourier domain, regularised where the slope along the sun carries no information;
  * only wavelengths shorter than CROSS metres are kept, and the DTM's own content in that band is subtracted, so
        terrain = DTM (unchanged above CROSS)  +  shading-derived relief (below CROSS).
What this is and is not: positions of the small craters and bumps come from the real photo; their heights are an
estimate (albedo differences are mistaken for slopes, structure across the sun direction is weakly constrained).
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, zoom

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "..", "lunar-flight", "assets", "apollo11")
OUT = os.path.join(HERE, "..", "data")
NORM_M, EPS_M, CROSS_M, BAND = 48.0, 64.0, 10.0, (8.0, 32.0)

man = json.load(open(os.path.join(SRC, "manifest.json")))
t = [x for x in man["tiers"] if x["id"] == "local"][0]
dem = np.asarray(Image.open(os.path.join(SRC, "local_dem.png"))).astype(np.float64) * t["dem"]["h_scale"] + t["dem"]["h_min"]
img = np.asarray(Image.open(os.path.join(SRC, "local_img.webp")).convert("L")).astype(np.float64)
lo, hi = [float(v) for v in __import__("re").findall(r"linear, ([\d.]+) -> 0, ([\d.]+) -> 255", t["image"]["stretch"])[0]]
raw = lo + img * (hi - lo) / 255.0                      # undo the display stretch -> original DN
N, px = 2048, 1.0                                       # work at 1 m
r1 = raw.reshape(N, 2, N, 2).mean(axis=(1, 3))
demU = zoom(dem, 2, order=3, mode="nearest", grid_mode=True)
Df = np.fft.rfft2(demU - demU.mean())
kx = 2 * np.pi * np.fft.rfftfreq(N, px)[None, :]
ky = -2 * np.pi * np.fft.fftfreq(N, px)[:, None]        # row index grows southwards
kk = np.hypot(kx, ky)
lp = lambda lam: np.exp(-0.5 * (kk * lam / (2 * np.pi) / 0.6) ** 2)
inv = lambda F: np.fft.irfft2(F, s=(N, N))
q = r1 / gaussian_filter(r1, NORM_M / px) - 1.0
P = np.fft.rfft2(q)
core = (slice(128, -128),) * 2

# ---- fit sun azimuth and gain K against the measured DTM, 8-32 m band
bandw = lp(BAND[0]) * (1 - lp(BAND[1]))
Qb = inv(P * bandw)[core].ravel()
gx, gy = inv(Df * 1j * kx * bandw)[core].ravel(), inv(Df * 1j * ky * bandw)[core].ravel()
c, *_ = np.linalg.lstsq(np.stack([gx, gy], 1), Qb, rcond=None)
K = float(np.hypot(*c)); ax, ay = c / K                 # unit vector away from the sun
az = float(np.degrees(np.arctan2(-ax, -ay)) % 360)
r_slope = float(np.corrcoef(gx * c[0] + gy * c[1], Qb)[0, 1])
print(f"sun azimuth {az:.1f} deg (E of N), gain K = {K:.2f}, slope-vs-brightness correlation r = {r_slope:.2f}  [{BAND[0]:.0f}-{BAND[1]:.0f} m]")

# ---- integrate
ka = kx * ax + ky * ay
eps = 2 * np.pi / EPS_M
Zf = (P / K) * (-1j * ka) / (ka ** 2 + eps ** 2)
val = {}
for a_, b_ in ((8, 16), (12, 24), (16, 32)):
    w = lp(a_) * (1 - lp(b_)); A, B = inv(Zf * w)[core], inv(Df * w)[core]
    val[f"{a_}-{b_} m"] = {"r": round(float(np.corrcoef(A.ravel(), B.ravel())[0, 1]), 2),
                           "rms_sfs_cm": round(float(A.std() * 100), 1), "rms_dtm_cm": round(float(B.std() * 100), 1)}
    print(f"heights, {a_}-{b_} m band: r = {val[f'{a_}-{b_} m']['r']:.2f}, rms SfS {A.std()*100:.1f} cm vs DTM {B.std()*100:.1f} cm")

# ---- correction to add to the DTM: short wavelengths of (SfS - DTM)
sig = CROSS_M / (2 * np.pi * 0.6) / px                  # the spatial Gaussian with the same response as lp(CROSS_M)
R = inv(Zf * (1 - lp(CROSS_M))) - (demU - gaussian_filter(demU, sig, mode="nearest"))   # DTM filtered in space: the tile is not periodic
edge = np.minimum(np.arange(N), np.arange(N)[::-1]).astype(np.float64)
taper = np.clip(np.minimum.outer(edge, edge) / 16.0, 0, 1)                           # fade out over the outer 16 m
R = (R - R.mean()) * taper
lim = float(np.percentile(np.abs(R), 99.9))
scale = 2 * lim / 255.0
dn = np.clip(np.round((R + lim) / scale), 0, 255).astype(np.uint8)
os.makedirs(OUT, exist_ok=True)
Image.fromarray(dn).save(os.path.join(OUT, "apollo11_sfs.png"), optimize=True)
meta = {"file": "apollo11_sfs.png", "width": N, "height": N, "m_per_px": px, "bounds": t["bounds"],
        "encoding": "uint8 PNG; dz[m] = h_min + DN*h_scale, add to the bicubically interpolated NAC DTM",
        "h_min": -lim, "h_scale": scale, "rms_m": round(float(R.std()), 4), "clip_m": round(lim, 3),
        "method": "linear photoclinometry in the Fourier domain; see tools/shape_from_shading.py",
        "inputs": [t["dem"]["sources"][0]["file"] if "sources" in t["dem"] else "local_dem.png", t["image"]["sources"][0]["file"]],
        "parameters": {"normalisation_m": NORM_M, "regularisation_m": EPS_M, "crossover_wavelength_m": CROSS_M,
                       "sun_azimuth_deg_fitted": round(az, 1), "gain_K_fitted": round(K, 3)},
        "validation_against_dtm": {"slope_brightness_r": round(r_slope, 2), "band_m": list(BAND), "heights": val},
        "caveat": "feature positions follow the photo; heights are estimates. Albedo contrasts (bright rocks, shadows) "
                  "are read as slopes and structure perpendicular to the sun direction is weakly constrained."}
json.dump(meta, open(os.path.join(OUT, "apollo11_sfs.json"), "w"), indent=1)
print(f"correction: rms {R.std()*100:.1f} cm, clipped at +-{lim*100:.0f} cm, step {scale*1000:.1f} mm -> data/apollo11_sfs.png")
if "--preview" in sys.argv:
    np.save("/tmp/sfs_R.npy", R.astype(np.float32)); np.save("/tmp/sfs_demU.npy", demU.astype(np.float32)); np.save("/tmp/sfs_r1.npy", r1.astype(np.float32))
