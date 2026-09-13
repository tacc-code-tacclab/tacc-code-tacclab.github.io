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

Mobile controls include a movement pad, drag-to-aim zone, fire, run, reload, light and MAP buttons. The map starts collapsed on touch devices, leaving only a small direction/distance button near the top left. Its expanded view scales to landscape height above the movement pad; aiming and fire stay available. Desktop starts with the map expanded. The mobile HUD stays compact along the top edge so the aiming area remains clear.

On touch devices, play in landscape. Start/Resume requests fullscreen and landscape lock where supported; other browsers (including iPhone browsers without orientation-lock support) show a rotate prompt. Portrait play and hidden tabs freeze the simulation without opening the pause menu or losing progress. A transient browser blur only clears held controls. Use the pause button to pause manually.

## Graphics

- Light: reduced effects and enemy cap
- Deep: default balance
- Ultra: higher lighting and particle density

Mobile Deep keeps its default look with capped decorative particles and enemies, and adaptive render resolution. The world retains at most nine render sectors and 32 cached sector grids; shared instanced geometry, chunk culling and one new sector per frame keep streaming bounded. A moving shared navigation field replaces repeated per-enemy searches. Simulation uses bounded time steps so a slower frame rate does not make movement run in slow motion. Static menus and background tabs do not continuously render the 3D scene.

The map uses a small 2D canvas at up to five redraws per second, with no drawing while collapsed. Its independent route search runs at most twice per second when cells change. The golden pickup adds five simple meshes and no dynamic lights.

## Roblox

The separate Roblox Studio place is available at [`roblox/Bertranda2.rbxlx`](roblox/Bertranda2.rbxlx). It preserves the earlier 25-schema Roblox campaign; the endless worlds and golden bullet mission are browser-edition features.

## Run locally

Serve the repository with a local HTTP server and open `videogames/bertranda-2/`. Direct `file://` loading is not supported by browser texture security rules.

## Regression checks

Run `node --test videogames/bertranda-2/tests/*.test.cjs` from the repository root. Tests use the bundled Three.js geometry and production game logic with browser I/O mocked. They cover golden bullet placement/reachability, required collection, visible finishing shots and progression on desktop and touch, map input/throttling, contact damage, portrait identity, seam connectivity, distant coordinates, bounded streaming and mobile input. `tests/viewport.html` provides a touch-layout/rotation preview at 844×390, 667×375 and 390×844; it is not a hardware FPS benchmark.
