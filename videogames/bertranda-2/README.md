# BERTRANDA 2 — Endless Realms

Standalone first-person horror shooter for the browser. It is a separate sequel and does not replace the original Bertranda game.

## Campaign

Five different procedural environments repeat in this order. Choose any starting realm on the title screen:

1. Haunted house: recursively divided rooms, corridors, old furniture and insect swarms.
2. Enchanted forest: branching trees, mushrooms, clearings and attacking spirits under an open sky.
3. Cemetery: rows of graves, crosses, open mausoleums and revenants.
4. Catacombs: branching stone mazes, burial chambers, skull-lined ossuaries and snakes.
5. Hell: fractal lava fields, connected obsidian causeways, horned statues and attacking demons.

The first 25 descents pass through Verdigris, Ash, Violet, Rot and Inferno. The expedition then continues with fresh layouts in the final corruption tier. Each realm extends procedurally in all directions instead of enclosing the player in the same house. Seeds are deterministic per descent and sector; recursive subdivision and multi-octave noise generate the layouts. Shared portals and connectivity checks keep routes traversable.

Only Bertranda uses the woman's face and its five corruption tiers. Cockroaches, bats and snakes reuse their separate original portraits from `../bertranda/assets/`; spirits use the vampire portrait and demons the horned insect portrait. These shared assets are repository-local and the original game is unchanged.

Creatures pursue the actual player position at close range and deal small contact hits (minimum 2 health), with a 0.55-second player protection window and per-enemy attack cooldowns. Walls block melee damage. Bertranda's health bar includes her direction and distance so she remains findable during exploration.

## Golden bullet mission

Every descent requires an expedition before the final kill. A golden bullet is hidden along a verified, walkable route about 88–136 metres from the starting point. Follow the map and walk over the glowing bullet to collect it; collection restores up to 20 health and briefly protects the player.

Ordinary rounds weaken Bertranda to her final seal at 20% health, marked in gold on the boss bar. She cannot die until the relic has been found. Once both conditions are met, the next aimed hit on Bertranda automatically fires the golden round, visibly gold in flight, and opens the next realm on impact. No extra firing button is needed. Misses, other enemies and reloads cannot spend it. Players can collect the bullet first or weaken Bertranda first. Each new descent and restart places a fresh relic and resets the mission.

The tactical map shows walls/terrain, the player and heading, the golden bullet, Bertranda, nearby enemies and a walkable route. It switches from gold to boss tracking after collection. The compact direction/distance readout follows the next route waypoint. Searches remain bounded when wandering far away; a `~` distance indicates an estimate beyond the local route. Map display and routing do not pause combat or replace the enemy navigation field.

## Controls

- `WASD` or arrow keys: move
- Mouse or touch drag: aim
- Click or `Space`: fire
- `Shift`: sprint
- `R`: reload
- `E` or `F`: weapon light
- `M` or the MAP button: expand/collapse the tactical map
- `P`: pause

The touch interface uses a single 24-pixel status row and a 112-pixel-wide minimap that opens automatically when starting or restarting. It shows the player, pink Bertranda marker and golden bullet, with a tiny colour key. Its short canvas sits above the left joystick, including short landscape viewports with browser bars; MAP can still hide/show it. Small visual icons retain generous touch areas. The central aiming area stays clear. Desktop keeps its existing HUD and map behaviour.

On phones, the left joystick moves and pushing it to its outer edge sprints, removing the separate RUN button. Drag anywhere in the broad right-hand area to aim, or hold and drag FIRE to shoot and aim with the same thumb. The trigger continues after reloading while held. Pointer cancellation, blur and rotation release held input.

Phone firing starts in manual mode: hold FIRE to shoot and release to stop. Optional AUTO requires an explicit tap and fires only after a target near the reticle has been acquired, with line-of-sight checks. Shot assistance helps hit ground insects and flying enemies without steering the camera; even slow drags directly control the view. A small target bracket shows what is selected. Mouse/keyboard aiming and firing remain manual and unchanged. Mobile camera shake/bobbing is reduced, the weapon is smaller, exposure is slightly higher and full-screen boss-hit flashes are disabled to keep enemies visible.

The mobile canvas, HUD and touch areas share the same dynamic viewport. Canvas CSS stays fluid when rotating from portrait to landscape; the drawing buffer and camera aspect follow the actual play surface, including browser-bar and fullscreen changes. Window-level pointer movement/release handlers preserve drags outside the controls and stop firing even if pointer capture is unavailable.

On touch devices, play in landscape. Start/Resume requests fullscreen and landscape lock where supported; other browsers (including iPhone browsers without orientation-lock support) show a rotate prompt. Portrait play and hidden tabs freeze the simulation without opening the pause menu or losing progress. A transient browser blur only clears held controls. Use the pause button to pause manually.

## Soundtrack

The desktop and mobile soundtrack is an original eight-bar horror-organ score: deep pedal bass, a chromatic ostinato, dissonant sustained chords and a shared stereo church reverb. Pipe harmonics use one wavetable oscillator per voice, with explicit note cleanup and one reusable reverb buffer. Combat sounds keep their original levels and dry signal path; the existing music/sound mute button is unchanged. No external soundtrack recordings are required.

## Graphics

- Light: reduced effects and enemy cap
- Deep: default balance
- Ultra: higher lighting and particle density

Mobile Deep keeps its default look with capped decorative particles and enemies, and adaptive render resolution. The world retains at most nine render sectors and 32 cached sector grids; shared instanced geometry, chunk culling and one new sector per frame keep streaming bounded. A moving shared navigation field replaces repeated per-enemy searches. Simulation uses bounded time steps so a slower frame rate does not make movement run in slow motion. Static menus and background tabs do not continuously render the 3D scene.

The map uses a small 2D canvas at up to five redraws per second, with no drawing while collapsed. Its independent route search runs at most twice per second when cells change. Touch aim acquisition is throttled separately. The golden pickup adds five simple meshes and no dynamic lights.

## Roblox

The separate Roblox Studio place is available at [`roblox/Bertranda2.rbxlx`](roblox/Bertranda2.rbxlx). It preserves the earlier 25-schema Roblox campaign; the endless worlds and golden bullet mission are browser-edition features.

## Run locally

Serve the repository with a local HTTP server and open `videogames/bertranda-2/`. Direct `file://` loading is not supported by browser texture security rules.

## Regression checks

Run `node --test videogames/bertranda-2/tests/*.test.cjs` from the repository root. Tests use the bundled Three.js geometry and production game logic with browser I/O mocked. They cover golden bullet placement/reachability, finishing shots and progression, map input/throttling, one-thumb aim/fire, multi-touch ownership, continuous fire across reloads, manual firing by default, optional automatic fire, slow camera drags, capture failure, wall occlusion, unchanged desktop aiming/firing, portrait suspension, contact damage, faces and bounded worlds. Renderer mocks reproduce Three's inline CSS sizing, and rotation tests check display dimensions as well as camera/buffer size.

`tests/viewport.html` provides landscape, portrait and desktop previews, including 568×250 with simulated browser bars. Its optional HUD/map mode uses production styles and map without WebGL. The separate canvas/control mode runs production game logic and DOM input with a 2D calibration renderer: start in portrait, rotate without reloading, check that the canvas border fills the viewport and the reticle stays centred, drag to change the displayed camera angles, then hold/release FIRE and check ammo. Neither substitute measures actual 3D rendering or phone GPU performance.
