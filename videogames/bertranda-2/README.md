# BERTRANDA 2 — Endless Realms

Standalone first-person horror shooter for the browser. It is a separate sequel and does not replace the original Bertranda game.

## Campaign

Five different procedural environments repeat in this order. Choose any starting realm on the title screen; defeating Bertranda opens the next one:

1. Haunted house: recursively divided rooms, corridors, old furniture and insect swarms.
2. Enchanted forest: branching trees, mushrooms, clearings and attacking spirits under an open sky.
3. Cemetery: rows of graves, crosses, open mausoleums and revenants.
4. Catacombs: branching stone mazes, burial chambers, skull-lined ossuaries and snakes.
5. Hell: fractal lava fields, connected obsidian causeways, horned statues and attacking demons.

The first 25 descents pass through Verdigris, Ash, Violet, Rot and Inferno. The expedition then continues with fresh layouts in the final corruption tier. Each realm extends procedurally in all directions instead of enclosing the player in the same house. Seeds are deterministic per descent and sector; recursive subdivision and multi-octave noise generate the layouts. Shared portals and connectivity checks keep routes traversable.

Only Bertranda uses the woman's face and its five corruption tiers. Cockroaches, bats and snakes reuse their separate original portraits from `../bertranda/assets/`; spirits use the vampire portrait and demons the horned insect portrait. These shared assets are repository-local and the original game is unchanged.

Creatures pursue the actual player position at close range and deal small contact hits (minimum 2 health), with a 0.55-second player protection window and per-enemy attack cooldowns. Walls block melee damage. Bertranda's health bar includes her direction and distance so she remains findable during exploration.

## Controls

- `WASD` or arrow keys: move
- Mouse or touch drag: aim
- Click or `Space`: fire
- `Shift`: sprint
- `R`: reload
- `E` or `F`: weapon light
- `P`: pause

Mobile controls include a movement pad, drag-to-aim zone, fire, run, reload and light buttons. The mobile HUD stays compact along the top edge so the aiming area remains clear.

On touch devices, play in landscape. Start/Resume requests fullscreen and landscape lock where supported; other browsers (including iPhone browsers without orientation-lock support) show a rotate prompt. Portrait play and hidden tabs freeze the simulation without opening the pause menu or losing progress. A transient browser blur only clears held controls. Use the pause button to pause manually.

## Graphics

- Light: reduced effects and enemy cap
- Deep: default balance
- Ultra: higher lighting and particle density

Mobile Deep keeps its default look with capped decorative particles and enemies, and adaptive render resolution. The world retains at most nine render sectors and 32 cached sector grids; shared instanced geometry, chunk culling and one new sector per frame keep streaming bounded. A moving shared navigation field replaces repeated per-enemy searches. Simulation uses bounded time steps so a slower frame rate does not make movement run in slow motion. Static menus and background tabs do not continuously render the 3D scene.

## Roblox

The separate Roblox Studio place is available at [`roblox/Bertranda2.rbxlx`](roblox/Bertranda2.rbxlx). It preserves the earlier 25-schema Roblox campaign; this release updates the browser edition's world generator and combat.

## Run locally

Serve the repository with a local HTTP server and open `videogames/bertranda-2/`. Direct `file://` loading is not supported by browser texture security rules.

## Regression checks

Run `node --test videogames/bertranda-2/tests/*.test.cjs` from the repository root. Tests use the bundled Three.js geometry and production game logic with browser I/O mocked. They cover contact damage, portrait identity, progression, seam connectivity, negative and distant world coordinates, bounded streaming and mobile input. `tests/viewport.html` provides a touch-layout/rotation preview at 844×390, 667×375 and 390×844; it is not a hardware FPS benchmark.
