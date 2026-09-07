# ZERO RIOT — v1

A solo mathematical arcade for browser and Roblox. Collect positive and negative
charges, flip the signs of the pickups, and return your reactor to exactly zero
to unleash a nova. Runs last 90 seconds or end when all three shields are lost.

## Play

Browser: https://tacc-code-tacclab.github.io/videogames/zero-riot/

- Move: WASD, arrows, drag on the arena, or the touch joystick.
- Flip the signs of **all pickups**, including ones waiting to reappear: Space
  or the FLIP button. Your own charge does not change. Recharge: 2 seconds.
- Pause: P, Escape, or the pause button. Switching tabs pauses the browser game.
- Positive and negative pickups add their signed values to your charge.
- Return to zero to blast nearby hunters. A longer, heavier chain scores more
  and produces a larger nova. The blast does not consume pickups.
- Allowed charge range: −9 through +9 inclusive. Crossing the boundary loses a
  shield and resets the chain and charge. Hits grant 1.8 seconds of protection
  against further hits and overload; an unsafe pickup during protection is
  consumed without changing charge. Initial protection lasts 1 second.
- Hunters appear after 5 seconds. Charging darts join after 30 seconds, with a
  visible warning before they move. Arrival rate increases throughout the run.
- Survive 90 seconds to complete the run and bank 300 points per remaining shield.
  Three hits end the run immediately. Replay always resets the timer and shields.

The daily code uses UTC. Challenge links share a seed, providing the same initial
arena and deterministic generation for identical input. Choices affect subsequent
pickup placement. Scores are local and unverified, not a global leaderboard.
The browser best persists on that device; Roblox best lasts for the session.

## Mathematical rules

Collect value `v`: `charge := charge + v`, only if `abs(charge + v) <= 9`.
Flip: `v := -v` for each pickup. The reactor charge remains unchanged.

For each chain let `n` be its number of pickups, `M = sum(abs(v))` its total mass,
and `P` its greatest absolute running charge. On returning to zero:

```
nova radius = min(285, 120 + 5*M)
points = 100 + 12*M + 10*n*n + 15*P + 100*(hunters caught in the blast)
```

The radius is expressed in the shared 720 × 720 logical arena. Values normally
range from ±1 to ±7; a far-away pickup is adjusted when necessary to preserve an
exact cancellation option, including ±8 and ±9. Collisions use fixed 1/60 s steps.
Keyboard diagonal movement is normalised. Rendering never drives random game state.

## Roblox

The Roblox release is a self-contained 2D `ScreenGui` arcade. Each player has an
independent solo run. There is no shared arena, networking, global leaderboard,
monetisation, external image, sound asset, DataStore or HTTP requirement.

Build with Python 3:

```sh
python3 roblox/build_place.py --output Zero_Riot_Roblox_V1.rbxlx
```

Open the `.rbxlx` in Roblox Studio and press **Play**, then **PLAY ARENA**.
Roblox supports keyboard, touch joystick, and gamepad stick plus X to flip.
The editable arena code can be copied between browser and Roblox. Open a new
experience when publishing. Do not replace an existing Piranha place.

## Development and verification

No build, package install or external web dependency is needed. Serve this folder
with any static server. Source files are plain JavaScript, CSS, HTML, Lua and Python.

```sh
node tests/core.test.cjs
node tests/web-smoke.cjs
luatex --luaonly tests/core_test.lua
node tests/compare-parity.cjs
```

The Lua test runner uses LuaTeX only as an available Lua interpreter. A normal Lua
interpreter can also run the file. The tests cover charge conservation, flip,
overload, blast radius, endpoint, movement, replay and seeded JS/Lua equivalence.
The XML builder verifies script contents after XML round-trip. Roblox UI execution
still requires a real Roblox Studio playtest; XML and Lua checks cannot replace it.

## Design intent

The proposed hook is the combination of signed arithmetic, a global polarity
switch that leaves the reactor unchanged, risk-sensitive zero-triggered explosions,
and short score challenges. Positive/negative-number games and polarity mechanics
already exist. This is an original implementation, not proof of an unprecedented
genre or a guarantee of commercial success.

To evaluate the design, measure whether new testers understand the first nova,
start a second run voluntarily and send a challenge to a friend. No analytics are
embedded in this release. Multiplayer and server-verified scores would require a
separate design and implementation before competitive prizes or rankings.
