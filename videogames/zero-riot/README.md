# Bubble Riot · V3

A cheerful arithmetic bubble shooter for browsers and Roblox. This redesign replaces the moving-ring ZERO RIOT game at its existing `/videogames/zero-riot/` route, so previous links still work. Other games are untouched.

## Play

Choose one of three numbered shots. Aim and fire at a hanging bubble. When **bubble + shot = target**, the connected group of that same bubble number pops. For example, target **5**, bubble **3**, shot **+2**: the connected 3s pop together. From garden 7, some gardens use multiplication instead: **3 × 4 = 12**.

Bubbles with no remaining connection to the top row fall for bonus points. Clear **every bubble** to finish the garden; clear **all 12 gardens** to win the campaign. There is no timer, life counter or game-over for a mistake. A wrong shot explains the arithmetic and leaves the board intact. Every new ammo set includes a number for a reachable bubble. “Help me aim” selects a valid number and trajectory without firing.

Three correct shots in a row charge a rainbow shot: it pops any number and has a larger splash. Correct groups earn 100 points per bubble, dropped bubbles earn 150, each consecutive correct shot adds a 50-point combo increment. A clear earns three stars with no mistakes, two with up to two mistakes, or one otherwise; each star adds 200 points. Retrying starts the current garden from its original score bank, without duplicating points from that attempt.

| Gardens | Mathematics | Arcade challenge |
| --- | --- | --- |
| 1–3 | Addition, targets 5, 6, 8 | Small groups, clear trajectories |
| 4–6 | Addition, targets 10, 12, 15 | One then two reflecting bumpers |
| 7–9 | Multiplication, targets 12, 18, 24 | New operation introduced on a smaller board |
| 10 | Addition, target 30 | Larger sums, two bumpers |
| 11–12 | Multiplication, targets 36, 48 | More bubbles and two bumpers |

## Controls

- **Computer:** point and click to shoot. Left/right arrows aim; Space fires; 1/2/3 choose the shot. P pauses (Escape also pauses on the web).
- **Touch:** choose a shot, drag on the board and release to fire. Releasing outside the board or a cancelled touch cancels the shot. The large FIRE button fires along the current guide.
- **Help me aim:** selects a valid shot and a reachable target. Press FIRE to use it.
- Same garden code gives the same campaign layouts and initial ammo on both platforms. The web results can copy a challenge link; Roblox displays a selectable challenge code.
- Sound is optional on the web, synthesized locally; Roblox ships without external audio assets.

## Files and local use

Serve this directory with any static server, for example `python3 -m http.server 8000`, and open the localhost URL. No build, account or backend is required.

- `core.js`, `roblox/Core.lua`: paired deterministic simulation, ray collisions, group connectivity, ammo and campaign progression.
- `game.js`, `style.css`, `index.html`: browser controls, canvas bubbles, animation, local audio and screens.
- `roblox/ZeroRiot.client.lua`: standalone native GUI rendering, immediate local controls, responsive portrait/landscape layout. The old source filename is retained for compatibility.
- `roblox/build_place.py`: builds a `.rbxlx` containing both scripts. Native gradients and GUI scenery keep Roblox independent of image uploads or moderation. It does not embed the web background.

Build Roblox:

```sh
python3 roblox/build_place.py --output Bubble_Riot_Roblox_V3.rbxlx
```

Open the result in Roblox Studio and use Test → Play. The place launches through its own “LET’S POP!” button. Publishing the experience is separate from generating this file.

## Verification

Run from this directory:

```sh
node tests/core.test.cjs
luatex --luaonly tests/core_test.lua
node tests/compare-parity.cjs
node tests/web-smoke.cjs
```

The simulation suite clears 240 generated boards across all 12 difficulties; checks wrong answers, connected groups, unsupported drops, rainbow power, replay and the campaign ending; and checks 165 reflected routes at three frame rates. The Lua campaign is compared against the JavaScript campaign, including every starting board and every shot result. The web smoke executes input and screen transitions against a mocked DOM/canvas, including a complete campaign. XML generation verifies exact script embedding. These checks are **not** a visual browser test or a Roblox Studio playtest.

## Original artwork

`assets/bubble-garden.webp` is a compressed derivative of an original background created with OpenAI image generation for this project. It is 1122 × 1402 pixels (about 116 KB). Bubbles, the toy launcher, highlights, stars and interactive effects are drawn as native game entities in canvas and Roblox GUI. No characters or assets from Bubble Bobble, Angry Birds or Tetris are used.

Generation prompt:

> Use case: stylized-concept
> Asset type: original background illustration for a polished family arithmetic bubble-shooter mobile game called Bubble Riot. This is scenery only, for game UI to be layered over it.
> Primary request: a vibrant whimsical floating bubble garden.
> Scene/backdrop: soft turquoise sky fading into lavender; floating lush islands confined to the lower left and lower right edges, fantastical rounded plants, distant fluffy clouds, soft golden sunlight.
> Style/medium: rich, appealing premium mobile-game illustration, gently dimensional painted shapes, lush inviting colors, charming fantasy scenery, beautifully polished.
> Composition/framing: portrait 4:5 composition. The center and upper middle must be deliberately calm and open, with broad smooth sky gradients and very subtle distant clouds, so numbered game bubbles remain readable. Frame the lower edge corners with lush floating garden islands without blocking the broad central gameplay area. Balanced depth and soft atmosphere.
> Lighting/mood: warm soft golden sunlight, joyful and serene.
> Constraints: no text, no numbers, no UI, no cannon, no logos, no watermark, no existing game characters, no licensed references. Exactly one original background image.
