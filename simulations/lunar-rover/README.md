# Lunar Rover 2 - prospect the Moon, then fly home to Cape Canaveral

**Version 2** (19 November 2026). What changed from version 1: the goal is 20,000 units of energy, shown by a bar,
after which `B` brings the rover back to base; a map shows the whole Moon with the regions rich in each mineral,
the base and the vehicle, with arrows to base and lander; digging can be deepened and pays off mostly on crater
floors (the game does not say so); the journey home has four checkpoints - a faster orbit with a short burn window,
a denser meteoroid field, a fire level, and a steered parachute descent to Cape Canaveral over real NASA images.
A mistake restarts the checkpoint where it happened. Version 1 is in the git history.

## Version 3 (`v3.html`) - NASA's 3-D models

`v3.html` is a separate page; `index.html` (version 2) is unchanged in behaviour and the two share the same code,
switched by `data-v="3"` on the page. Version 3 replaces the hand-built vehicles with models from the NASA 3D
Resources collection (github.com/nasa/NASA-3D-Resources, "free and without copyright"), copied into `data/models/`:

| Used as | NASA model | Note |
|---|---|---|
| lander, and the ship of the journey home | Apollo Lunar Module | at 0.6 scale for play |
| descent stage at the landing site | the same, real size | everything above the descent stage is hidden, as the ascent stage left in 1969 |
| rover | Mars 2020 Perseverance Rover | a Mars rover: the most detailed rover model NASA publishes, nothing like it has driven on the Moon; its wheels do not turn here, and the working arm, gun and scoop are the game's own |
| base | Habitat Demonstration Unit (parts 1 and 2) | a ground prototype |
| figure by the base | Astronaut | decoration |

Rendering in version 3: filmic (ACES) tone mapping, a larger shadow map, a soft glow round the brightest things
(desktop only) and a vignette. The models' painted colours are toned down by a fixed factor so that they do not
burn out under a Sun set for the dark lunar soil. It downloads about 8 MB more than version 2. If the models fail
to load, the built-in ones are used. Use of the models does not imply endorsement by NASA.

What it is not: photographs, or hardware modelled for this game. The limits are those of NASA's models (the lunar
module has flat colours, not real foil) and of real-time rendering in a browser.

**Version 2.3** (19 November 2026): eight camera views (button Camera or C): from behind, from the front, from
either side, straight down from 15, 60 and 250 m, and the rover's own mast webcam. The map is drawn sharper; clicking
it (or Z) opens it large, next to a close-up of the region with the deposits at true size, their names and
distances; the line under it gives distance and direction of the base, the lander and the nearest deposit of each
mineral. From 500 units of energy the whole survey is shown.

**Version 2.2** (19 November 2026): more to hear and see, and a clearer goal.
* Each mineral has its own, louder sound when collected (a chime, a counter burst with a rising run, a fanfare).
* The gun fires tracer rounds with a muzzle flash; from level 6 it becomes a laser (an instant, straight beam).
* The map starts almost blank and is uncovered as the player travels (90 km around the rover, up to 500 km from
  high up); deposits within about 650 km (or 2.6 times the surveyed radius) show first as faint dots that brighten on approach, and a deposit is
  announced when it is fully uncovered.
* The mission is stated at the start, and at 1,000, 3,000, 5,000 and 8,000 a fanfare repeats what to do at 10,000.
* Journey: the burn window lasts 0.22 s of a 7 s orbit; the ship's engine burns on the way to the Earth; the
  meteoroid field is wider and denser and one hit destroys the ship in a fireball of wreckage; in the atmosphere
  the red zones are deadly on contact; the descent is free over the whole Earth, with thrusters for height, but
  only the red ring at Cape Canaveral has the (invented) cooling foam - on land elsewhere the ship explodes after
  a few seconds, in water it sinks. Each stage has its own original, synthesised music.

**Version 2.1** (19 November 2026): nothing is stored between visits, so reloading the page resets every counter;
the goal is 10,000; minerals are no longer plentiful in one place but in deposits scattered over the Moon; from
level 8 (2,000 captured) the rover can fly to another region, at a high cost in energy.

A browser game that starts beside a base station 130 m from the Apollo 11 landing site. A lander flies anywhere on
the Moon between 82 deg north and south, up to 100 km high, and lands; a rover drives out, lifts rocks with its arm
and analyses them, destroys the big ones with a gun, digs, and turns two ores into energy.

## The story, and how much of it is real

* **Ilmenite** (FeTiO3) is real and is the reason this site is interesting: the Apollo 11 basalts are among the most
  titanium-rich lunar samples, and ilmenite is a candidate ore for oxygen, iron and titanium.
* **Thorium and uranium** are real and concentrate in KREEP-rich material; orbiters mapped thorium with gamma-ray
  spectrometers, which the rover's ticking detector imitates.
* **Armalcolite** is real too: a titanium mineral discovered in the Apollo 11 samples and named after ARMstrong,
  ALdrin and COLlins. In the game it is the rare, large, bright gem.
* The gems are hidden inside rocks and appear only when a rock is broken by the gun. They stay where they fall
  (stored by latitude and longitude, also across reloads) until collected. Ilmenite (+10) and thorium ore (+40)
  are picked up by driving over them; armalcolite (+150, only in rocks of 40 cm or more) only with the arm.
  Turning minerals into energy is fiction, and so is their glow: the real ones are dull, dark grains.
* The arm picks up a gem within reach; with none in reach it lifts the nearest rock and throws it aside.
* Energy runs every rover function; sunlight gives a trickle (real rovers are solar); the base station recharges to
  100; with a flat battery the rover only crawls and can be brought back to base.
* The total energy captured sets the level (speed, grip, gun, scoop, hop, flight). At 10,000 the journey to the
  Earth opens.
* Deposits: 93 patches, 9 to 90 km across, each rich in one mineral, placed pseudo-randomly over the globe (three
  within 40 km of the base) and drawn on the map in the mineral's colour. They are invented. Underneath, a gentle
  background still follows the measured thorium and titanium maps. A census of generated rocks: at the base
  13% hold ilmenite, 4.5% thorium ore, 1.2% armalcolite; in the nearby deposits 60% ilmenite, 29% thorium ore
  and 6.5% armalcolite respectively; on empty far-side highland 3.5%, 1.8% and 0.3%.
* Flying rover: invented. It needs 150 units in the battery to lift off, flies like the lander up to 30 km, and
  drains 3 to about 12 units per second depending on height and effort; near empty it lands by itself. The lander
  stays where it was left and the map points to it.
* Counters were checked against an instrumented session: energy captured equals 10 x ilmenite + 40 x thorium +
  150 x armalcolite finds, rocks broken and gems taken equal the events that actually happened.
* Digging: each dig deepens the hole (to about 2 m). The chance of a find grows with depth and with how far the
  spot lies below the ground around it. In a test, 12 crater floors gave 20 finds in 108 digs, 12 ordinary spots 4.
* How rich a region is follows real measurements: the Lunar Prospector gamma-ray spectrometer maps of thorium and
  titanium dioxide (`tools/fetch_lp_grs.py` -> `data/lp_grs_5deg.json`; PDS data set LP-L-GRS-5-ELEM-ABUNDANCE-V1.0,
  5 deg equal-area map, footprint about 150 km, read between cell centres by linear interpolation). The chance
  that a rock holds thorium ore scales with thorium relative to Tranquility Base (limited to 0.15-4 times),
  ilmenite and armalcolite with TiO2 (0.05-2 times). A census of generated rocks: thorium ore in 8% of rocks at
  Tranquility Base, 30% near Fra Mauro, 3% on the far-side highlands; ilmenite in 21%, 14% and 1%. The base odds
  are invented; only their variation from place to place is measured. The globe view can show both maps.
  The tool reads the column names from the PDS format file and stops if the values are not plausible
  (for instance if the median Th/U ratio is not near 3.7). Titanium and iron are given as oxides.
* The lander's speed grows with height and reaches tens of kilometres per second: purely theoretical, marked as such.

## The journey home

With 10,000 units of energy captured: `B` to base, board the lander, climb above 100 km, "Return to Earth".

| Checkpoint | What the player does | Real | Changed |
|---|---|---|---|
| 1 Lunar orbit | waits one orbit, then burns exactly on the short arc behind the Moon; a wasted burn locks the engine until the arc has passed | trans-Earth injection: one engine burn behind the Moon, about +1 km/s | 118 min compressed to 9 s; it is the engine, not centrifugal force, that sends the ship home |
| 2 Meteoroids | steers through them; three hits destroy the ship | about three days; speed falls, then rises to about 11 km/s | space there is almost empty: the field is a game |
| 3 Fire | steers away from the red zones before the heat gauge fills | entry at about 11 km/s, gas at thousands of degrees ahead of the heat shield | the heating cannot be steered around in reality |
| 4 Cape Canaveral | steers a parachute to the red ring; touchdown must be within 450 m when the height runs out, in changing wind | the place and the pictures | Apollo splashed down in the ocean under unsteerable parachutes |

Earth images (`tools/fetch_earth.py`, run by `.github/workflows/build-earth-images.yml`) come from NASA GIBS, which
is public and free to use: the Blue Marble shaded-relief mosaic for the globe and for Florida (about 500 m/px) and
the Landsat WELD true-colour annual composite for the Space Coast (about 100 m/px) and the Cape (about 30 m/px).
Google Maps imagery is not public data and is not used. The figures in the "Real" column are quoted from memory.

## The whole Moon

The world is a flat map (x east, y north) around an anchor point, with the curvature added as a parabola. When the
lander flies away the anchor follows it, so any place between 82 deg N and S can be reached; the poles are left out
because this method breaks down there. Above 100 km the page switches to a globe textured with the real mosaic:
the viewpoint slides over the Moon up to 20,000 km, a circle marks the point below, and coming back down to
100 km starts the descent there. This is a way of choosing a destination, not an orbit being flown.

Measured data by distance from the Apollo 11 site: NAC DTM 2 m/px and photo 0.5 m/px (2 km), 59 m/px (120 km),
474 m/px (485 km), then the global LOLA/Kaguya DEM, here at 3.8 km/px (`data/global_dem_half.png`, a 2x2 block
mean of the Lunar Flight file) with the 2.7 km/px LROC WAC mosaic.

Craters are predicted only in the size range the local data cannot show: up to 3 m in the photo, 150 m in the 59 m
DEM, 1.5 km in the 474 m DEM, 8 km on the global DEM. Above 150 m the equilibrium law no longer holds, so a rule of
thumb thins them out: on mare by (D/150 m)^-1.2, on highland to 0.6 of equilibrium; mare and highland are told
apart by the brightness of the real mosaic. This is an order-of-magnitude rule, not a fitted production function.

Rocks are drawn while they are nearer than 220 times their size (about three pixels), so they do not appear or
vanish at a visible size; they are generated in Moon-fixed cells, and rocks that were pushed, thrown or destroyed
stay that way. Predicted features can shift by tens of metres when the map's latitude band changes, which only
happens in flight.

Simplifications: the Sun stands at the same height everywhere (as if it were the same local time all over the Moon);
the Earth is placed correctly for each location (overhead at the centre of the near side, absent from the far side).

## Changed so that it can be played

A faithful simulation of these vehicles is very hard to control, so some physics was altered on purpose, and the
page says so in its Science notes:

* rover stabiliser: an invented device holds the body parallel to the ground, level in flight, and damps rolling;
* wheels roll over rocks up to 20 cm, taller ones are pushed or stop the rover; suspension forces are capped;
* the lander follows the controls almost at once, removes its own sideways speed below 10 m and always touches
  down gently, on slopes up to 22 deg; its speed and climb rate grow with height (theoretical);
* the globe view above 100 km replaces orbital flight.

Gravity, the ballistic flight of debris and dust, and the low traction are left as they are.

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
frames take too long. The sounds have not been listened to by a person yet. Nothing is kept between visits.

Graphics: the lander is modelled on the Apollo lunar module (descent stage in gold and black blankets, four
legs with struts and footpads, ladder, ascent stage with windows, tanks, thrusters and antennas) at 0.6 scale, with
an invented ramp; the object at the landing site is the descent stage alone, as it was left. The rover borrows the
wire-mesh wheels and fenders of the Apollo lunar rover. All are built from simple shapes, not from engineering data.
The Layers view colours each point by the share of measured, inferred and predicted relief in the local shape of
the ground (near the base the median predicted relief is under 1 cm against 3 cm inferred).

Not done yet: the lunar poles.
At top speed the map is rebuilt about once a second, which shows as a short stutter.
