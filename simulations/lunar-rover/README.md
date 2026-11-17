# Lunar Rover - prospecting on predicted ground at Tranquility Base

A browser game that starts beside a base station 130 m from the Apollo 11 landing site. A lander flies anywhere on
the Moon between 82 deg north and south, up to 100 km high, and lands; a rover drives out, lifts rocks with its arm
and analyses them, destroys the big ones with a gun, digs, and turns two ores into energy.

## The story, and how much of it is real

* **Ilmenite** (FeTiO3) is real and is the reason this site is interesting: the Apollo 11 basalts are among the most
  titanium-rich lunar samples, and ilmenite is a candidate ore for oxygen, iron and titanium.
* **Thorium and uranium** are real and concentrate in KREEP-rich material; orbiters mapped thorium with gamma-ray
  spectrometers, which the rover's ticking detector imitates.
* In the game the rover turns both into energy (ilmenite +10, thorium ore +40). That is fiction: lunar thorium is a
  few parts per million of the rock, and neither mineral is a fuel.
* The arm lifts every rock it can reach and analyses it: ore becomes energy, a plain rock is thrown away. Rocks too
  big for the arm are shot, and the ore that falls out is collected by driving over it.
* Energy runs every rover function; sunlight gives a trickle (real rovers are solar); the base station recharges to
  100; with a flat battery the rover only crawls and can be brought back to base.
* The total energy captured sets the level (speed, grip, gun, scoop, hop). At 2000 the game announces that the
  vehicle is ready for the Earth; that journey is not built yet.
* Ore odds (one rock in seven ilmenite, one in twenty-five thorium, more in larger rocks) are invented and the same
  everywhere. Making them follow the real orbital maps of titanium and thorium is planned.
* The lander's speed grows with height and reaches tens of kilometres per second: purely theoretical, marked as such.

## The whole Moon

The world is a flat map (x east, y north) around an anchor point, with the curvature added as a parabola. When the
lander flies away the anchor follows it, so any place between 82 deg N and S can be reached; the poles are left out
because this method breaks down there. Measured data by distance from the Apollo 11 site: NAC DTM 2 m/px and photo
0.5 m/px (2 km), 59 m/px (120 km), 474 m/px (485 km), then the global LOLA/Kaguya DEM, here at 3.8 km/px
(`data/global_dem_half.png`, a 2x2 block mean of the Lunar Flight file) with the 2.7 km/px LROC WAC mosaic.

Craters are predicted only in the size range the local data cannot show: up to 3 m in the photo, 150 m in the 59 m
DEM, 1.5 km in the 474 m DEM, 8 km on the global DEM. Above 150 m the equilibrium law no longer holds, so a rule of
thumb thins them out: on mare by (D/150 m)^-1.2, on highland to 0.6 of equilibrium; mare and highland are told
apart by the brightness of the real mosaic. This is an order-of-magnitude rule, not a fitted production function.
Predicted features are tied to Moon-fixed coordinates; they can shift by tens of metres when the map's latitude
band changes, which only happens in flight.

Simplifications: the Sun stands at the same height everywhere (as if it were the same local time all over the Moon);
the Earth is placed correctly for each location (overhead at the centre of the near side, absent from the far side).

The scientific point is the ground. The LRO cameras resolve this site at 0.5 m per pixel (image) and 2 m per pixel
(elevation); a rover is smaller than that. The ground is therefore built from three layers that the page keeps apart
and can show in colour (button **Layers**):

| Layer | Source | Scales | Status |
|---|---|---|---|
| measured | LROC NAC DTM (2 m/px), LROC NAC orthophoto (0.5 m/px); regional DEM beyond the tile | > ~10 m | real data, unchanged |
| inferred | shape from shading of the real photo, `tools/shape_from_shading.py` | 2-10 m | real positions, estimated heights |
| predicted | statistical generation, `js/terrain.js` (`RULES`) | < 3 m craters, 8 cm - 1 m rocks, cm roughness; outside the 2 km photo also craters up to 150 m | invented features, published statistics |

The measured data are the files produced by `../lunar-flight/fetch_and_process.py` (this page reads
`../lunar-flight/assets/apollo11/`); nothing is downloaded again.

## Inferred layer: what was done and how well it holds

`python tools/shape_from_shading.py` (numpy, scipy, Pillow) writes `data/apollo11_sfs.png` and `.json`.
Linear photoclinometry in the Fourier domain: brightness, normalised by its 48 m local mean, is taken as proportional
to the slope along the sun direction, integrated, and only wavelengths below 10 m are kept; the DTM's own content in
that band is subtracted, so above 10 m the terrain is exactly the DTM.

The sun azimuth and the brightness-per-slope gain are not read from the image label; both are fitted against the
measured DTM in the 8-32 m band where the two overlap. Results of that fit, which are also the validation:

* sun azimuth 272.5 deg, gain K = 1.43;
* slope along the sun vs brightness: correlation r = 0.70;
* heights, SfS vs DTM: r = 0.56 (8-16 m), 0.64 (12-24 m), 0.64 (16-32 m).

So small craters sit where the photograph shows them, and their depths are right to within a factor of roughly 1.5.
Known weaknesses: albedo contrasts (bright blocks, hard shadows) are read as slopes; structure perpendicular to the
sun direction is weakly constrained; the correction is switched off within 14 m of the descent stage, whose
brightness and shadow are not terrain.

## Predicted layer: the rules

| What | Rule used | Note |
|---|---|---|
| craters 0.25-3 m (to 150 m outside the photo) | cumulative density N(>D) = 10^-1.1 D^-2 per m2 (equilibrium population, Trask 1966); depth/diameter 0.03-0.2, mostly degraded; rim 0.04 D when fresh | inside the photo, craters above 3 m are left to it: they would be visible. Outside it the elevation data (59 m/px) resolve only craters above about 250 m, so the same law is used up to 150 m, roughly where equilibrium ends on mare of this age |
| rocks 8 cm - 1 m | N(>D) = 1.4e-3 D^-2.11 per m2 (Surveyor I mare site, Shoemaker & Morris 1970) | rocks of 1 m or more would be visible in the photo, so none are generated; density is raised on steeper ground - an assumption of this page, not a published law |
| roughness | value noise, about 1.5 cm rms below 2 m | order of magnitude only |

**These constants were written from memory and have not yet been checked against the original papers.** Treat them
as placeholders with the right order of magnitude until someone verifies them.

The prediction is deterministic (one fixed seed): everybody sees the same ground. It says what the ground is
statistically like; it does not say what is actually at any given spot.

## Physics

Real: gravity 1.62 m/s2; no air, so fragments, dust and shots follow parabolas and stop where they land; wheel
traction limited by friction times the (low) lunar weight; rigid-body rover on four sprung wheels; the Moon's
curvature (parabolic approximation). The sun stands where it was in the LRO photograph (azimuth fitted, elevation
about 18 deg estimated from the descent stage's shadow) and the Earth is placed where it is seen from this site.
The fill light is set so that slopes brighten by about the measured factor K rather than as an ideal matt surface.

Simplified: the lander is a point mass with hover control and unlimited propellant; rocks are spheres for collisions;
wheels sample the ground along the vertical.

Sound: there is none on the Moon; the page synthesises what the vehicle's structure would carry (motors, the gun's
action, impacts, regolith under the wheels) plus the detector's ticks.

Game only: ore as glowing nuggets, thorium as fuel, the gun, levels and upgrades, the lander's speed. The Apollo 11
descent stage stands at its real coordinates but its 3-D shape is illustrative; tools are locked within 75 m of it.

## Controls

Keyboard: arrows or WASD drive / fly, Space gun, E grab, Q dig, H hop, T upright, Enter deploy / board,
R / F (PgUp / PgDn) lander up / down, N feature names, B back to base (flat battery), V layers, I science notes,
G help, C camera, M sound. Touch: stick and buttons.

## Status

Tested in a headless desktop browser and an emulated phone (game logic stepped directly; rendering by software).
Not yet tested on a real phone or a real GPU, so performance there is unknown; the page lowers its own quality if
frames take too long. The sounds have not been listened to by a person yet. Points and energy are kept in the
browser's local storage.

Not done yet: the journey to the Earth, the lunar poles, and ore distributions that follow the real maps.
At top speed the map is rebuilt about once a second, which shows as a short stutter.
