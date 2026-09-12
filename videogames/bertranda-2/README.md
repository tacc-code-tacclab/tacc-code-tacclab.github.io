# BERTRANDA 2 — Twenty-Five Descents

Standalone first-person horror shooter for the browser. It is a separate sequel and does not replace the original Bertranda game.

## Campaign

The campaign contains 25 schemas. Five distinct environments repeat through five increasingly hostile corruption cycles:

1. St. Dymphna Asylum
2. Cemetery of Lost Faces
3. The Whispering Forest
4. Castle of the Eight Legs
5. Catacombs of Bertranda

The cycles are Verdigris, Ash, Violet, Rot and Inferno. Each cycle changes the lighting, fog, palette, environmental props and the shared human face used by Bertranda, cockroaches, bats and snakes. The face progressively ages and becomes gaunt, revenant-like and finally infernal.

Bertranda returns in every schema with increasing health, size, speed and damage. Schema 25 is the final infernal confrontation. The game only ends after that body is destroyed.

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

Mobile Deep keeps its default look with a fixed lighting budget, capped decorative particles and enemies, and adaptive render resolution. A shared navigation field replaces repeated per-enemy searches. Simulation uses bounded time steps so a slower frame rate does not make movement run in slow motion. Static menus and background tabs do not continuously render the 3D scene.

## Roblox

The Roblox Studio place is available at [`roblox/Bertranda2.rbxlx`](roblox/Bertranda2.rbxlx).

## Run locally

Serve the repository with a local HTTP server and open `videogames/bertranda-2/`. Direct `file://` loading is not supported by browser texture security rules.

## Regression checks

Run `node --test videogames/bertranda-2/tests/mobile.test.cjs` from the repository root. Tests use the bundled Three.js geometry and production game logic with browser I/O mocked. `tests/viewport.html` provides a touch-layout/rotation preview at 844×390, 667×375 and 390×844; it is not a hardware FPS benchmark.
