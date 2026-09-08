# ZERO RIOT — v2: Clear the board

Collect **every number on the board** to finish the level. Complete all five
levels to win. Numbers disappear permanently when collected. There is no timer,
no charge limit and no arithmetic penalty. Returning the running total to zero
is an optional bonus, never a requirement to complete the board.

Play: https://tacc-code-tacclab.github.io/videogames/zero-riot/?release=2

## What changed from v1

The survival timer and endlessly respawning numbers made the objective hard to
understand and difficult to finish. V2 replaces that loop with finite levels:

| Level | Numbers | Total hunters available |
| --- | ---: | ---: |
| 1 | 6 | 0 |
| 2 | 8 | 0 |
| 3 | 10 | 1 |
| 4 | 12 | 2 |
| 5 | 14 | 3 |

Hunters first appear after 12 seconds in levels 3–5, with a 1.4-second warning.
Subsequent hunters appear at eight-second intervals, up to the level quota.
Their speed is 40, 48 or 56 arena units per second versus the player's 190.
A blasted hunter or one that hits the player is removed permanently. Three hits
lose the current level. Retry preserves completed levels and their scores.
Every new level refills all three shields and starts the bonus total at zero.
There is no required final charge, so flipping signs or taking a hit cannot
leave an otherwise cleared board mathematically impossible to complete.

## Controls

- **Tap or click a number:** the ring travels to its centre and stops. A tap
  within 52 logical units selects that number; you do not need to hold it.
- Tap empty space to move there. Dragging updates the destination while held.
- **WASD / arrows / joystick:** manual movement, immediate stop on release.
  Manual input cancels the previous tap destination. Small stick noise is filtered
  with a 10% radial dead zone; the remaining range maps linearly to speed.
- **Space / FLIP:** reverse the signs of the remaining pickups for an optional
  bonus combination. The player's total stays unchanged. One-second recharge.
- **P / Escape / pause button:** pause. Window focus loss cancels movement and
  pauses the browser game. Resuming requires a new movement command.

Roblox additionally supports a gamepad stick and X to flip. Keyboard diagonals
are normalised. Both platforms use the same 720 × 720 arena and fixed 1/60-second
simulation steps. Target movement clamps travel to the exact remaining distance,
preventing overshoot. A selected number is collected at its centre; unselected
numbers crossed along the route use a tighter 26-unit collection radius. Pickups
are at least 100 units apart. Web screen shake has been removed.

## Bonuses and fair restarts

Each pickup is worth 25 points. When the running sum returns to zero, with `n`
collected numbers and total absolute value `M` in the current chain:

```
blast radius = min(310, 180 + 5*M)
bonus = 100 + 8*M + 5*n*n + 100*(hunters caught in the blast)
level completion bonus = 200 * level
```

Flip only changes remaining pickups. It is optional: collecting all numbers
wins even when their final sum is not zero. Hits reset the current bonus chain
and grant 2.5 seconds of protection; collected numbers stay collected.
Restarting the current level restores its starting score, so replaying it cannot
bank the same partial points repeatedly. Finishing level 5 shows final victory;
playing again starts from level 1 with a fresh score.

## Daily levels and sharing

The UTC date is the default seed. The first level is a fixed easy introduction;
levels 2–5 use seeded paired values and shuffled, well-spaced positions. Share
links transfer the level seed. Scores remain local and unverified. Browser best
scores persist on that device under a separate v2 key; Roblox best scores are
session-only. There is no shared multiplayer arena or global leaderboard.

## Roblox build

Python 3, standard library only:

```sh
python3 roblox/build_place.py --output Zero_Riot_Roblox_V2.rbxlx
```

Open the result in Roblox Studio, press **Play**, then **PLAY LEVEL 1**. The
self-contained ScreenGui needs no external image, sound asset, RemoteEvent,
DataStore or HTTP request. Publish it to the intended ZERO RIOT experience.

## Verification

From this directory:

```sh
node tests/core.test.cjs
node tests/web-smoke.cjs
luatex --luaonly tests/core_test.lua
node tests/compare-parity.cjs
```

The tests exercise permanent number removal, safe large sums, completion after
flips, the first two levels without a timer or enemies, tap precision and stopping,
keyboard/joystick control, all five level transitions, final victory, and score
restoration on retry. Five simple automated tap routes complete the campaign.
A full five-level JavaScript/Lua trace agrees within 1e-6 arena units. The web
smoke uses a minimal DOM/canvas mock; it is not a visual browser playtest.
The builder validates XML and embedded script round-trips. Real Roblox input
and screen layout still need a Roblox Studio playtest, which is not available
in the build environment.
