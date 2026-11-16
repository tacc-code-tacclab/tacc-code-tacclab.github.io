# Lunar Flight & Surface Exploration Simulator (browser, real LRO data)

Two parts:

| file | role |
|---|---|
| `fetch_and_process.py` | downloads windows of real LRO products and writes web assets to `assets/<site>/` |
| `index.html` | single-page Three.js simulator (no build step) that reads `assets/` |
| `tests/` | offline self-test of the pipeline (format-faithful synthetic fixtures, never used by the simulator) |

## Run

```bash
pip install numpy requests Pillow
python fetch_and_process.py --site apollo11      # needs internet; ~0.7 GB transferred, a few minutes
python -m http.server 8000                       # any static server
# open http://localhost:8000/
```

`--list-sources` prints the exact URLs. `--mirror DIR` uses files you already downloaded (matched by
file name). `--lat/--lon/--name` builds a custom site (global + wide + regional tiers, no NAC tier).
`python tests/run_tests.py` validates georeferencing/resampling/encoding without internet.

## Data tiers (what you actually see)

| tier | extent | elevation | imagery |
|---|---|---|---|
| global | whole Moon | LOLA GDR `LDEM_16` (1.9 km/px) | NASA SVS CGI Moon Kit colour map from LROC WAC (4096x2048, 2.7 km/px) |
| wide | 16 x 16 deg (~485 km) | LOLA GDR `LDEM_64` (474 m/px) | LROC WAC global mosaic, 100 m/px, stored at 237 m/px |
| regional | 4 x 4 deg (~121 km) | LOLA GDR `LDEM_512` (59 m/px) | LROC WAC global mosaic (100 m/px) |
| local | up to 2 x 2 km | LROC NAC DTM (2 m/px) | LROC NAC orthophoto (0.5 m/px) |

Feature names (`assets/nomenclature.json`, step `names`): the IAU Working Group for Planetary System Nomenclature
gazetteer as published by the USGS Astrogeology Science Center (Moon, feature centre points: name, type, centre
latitude / longitude, diameter, origin of the name). Only records marked "Adopted by IAU" are kept; values are copied.
In the viewer a label sits on the catalogued centre point; which labels are drawn depends on their apparent size on
screen. `N` toggles them and a click / tap shows the catalogue entry. The HUD line FEATURE names the smallest
catalogued feature whose circle (centre + diameter) contains the vehicle - a circle, not the feature's real outline.

The `.IMG` products are uncompressed, so only the rows covering each window are fetched with HTTP Range
requests. `assets/<site>/manifest.json` records every source URL, byte range and processing step.

## Data-integrity rules implemented

* No procedural terrain, no texture synthesis, no hole filling. A DEM window containing no-data aborts
  the build; the NAC window is automatically moved/shrunk to a fully valid area and the offset is logged.
* DEM windows are aligned to the source pixel grid (values pass through unresampled; LOLA 0.5 m DN steps kept
  to < 1 cm by the 16-bit PNG encoding of the window's own range).
* Imagery: 8-bit sources are passed through; other bit depths get one linear 0.5-99.5 percentile stretch
  (recorded in the manifest). Lossy WebP (q90) is the only other change.
* Normal maps are central differences of the same DEM (used only by the optional relief display).
* In the viewer, each tier is cross-faded into the next coarser *real* tier over the outer 4 % of its
  footprint so that there is no cliff at tier borders. Chunk skirts only close LOD cracks.
* Close to the ground the HUD reports the screen ground-sample distance against the data resolution.
  When one data pixel spans >= 4 screen pixels the "REAL DATA RESOLUTION LIMIT" banner appears; pixels are
  magnified (bilinear, or true pixels with `P`), never embellished.

## Simulator

**Fast flight** (default, `B` to switch): the vehicle is moved over the real terrain at a chosen top speed, from
18 km/h to 1000 km/s (`,` `.`, or the on-screen buttons), with the arrow keys or `W/S A/D` to move, `Q/E` to turn and
`PgUp/PgDn` or `R/F` to go up / down (the rate grows with height, up to
3000 km). It follows the Moon's curvature and stays above the DEM. This mode is kinematic: no forces are integrated,
the speeds are not achievable by the lander, and the HUD labels it "kinematic, not physics". It cannot land.
`6` jumps to the point opposite the site. Engine sound and background music (`U`) are synthesised in the browser with
Web Audio; they are atmosphere, not data.

**Lander physics** (`B`): 6-DOF rigid body under central gravity GM/r^2 (1.62 m/s^2 at the surface; a 100 km orbit is stable),
main engine 0-10 m/s^2 along the body axis, RCS translation, attitude thrusters with optional rate damping
and auto-level, hover assist (vertical-speed hold), time warp. Touchdown limits: 3 m/s vertical, 2 m/s
horizontal, 25 deg tilt; on touchdown the position locks and the inspection camera (free look + zoom) opens.
Press `G` in the app for all controls. On phones and tablets on-screen controls appear instead: a left stick (lean up to 30 deg with
auto-level, or RCS translation), climb / hold / descend and turn buttons, one-finger look and pinch zoom; the menu
holds the other toggles and a compact flight panel replaces the two desktop panels (full data under the menu). The Moon's rotation is neglected. Propellant is unlimited.

## Known limits

* Sites poleward of 60 deg (e.g. Shackleton) are not supported yet: they need the polar-stereographic
  LOLA/WAC products, which this pipeline does not read.
* Only Apollo 11 has a NAC (2 m / 0.5 m) tier configured. Other NAC DTMs can be added to `SITES`.
* Three.js is loaded from the jsDelivr CDN, so the browser needs internet on first load.
