# Flying Velvet — Infinite Neon Circus

An original full-screen arcade game in English, built with dependency-free HTML, Canvas and Web Audio.

Live URL: https://tacc-code-tacclab.github.io/videogames/flying-velvet/

## The act

The acrobat travels through a procedurally extended circus. Every trapeze has its own pendulum phase, length, speed and direction. Later acts introduce short bars, breathing elastic ropes, double bars and horizontally wandering “wild” rigs. Release timing supplies the launch momentum; in flight the player rotates the acrobat and therefore moves the hands that must reach the next bar. A bounded near-bar attraction makes touch play readable without performing the catch automatically.

Every ten catches completes an act. The tent palette, audience, hazards, spacing and swing speed evolve, then the circus continues. Difficulty has explicit ceilings: trapeze spacing never exceeds 520 logical pixels, catch radius never falls below 45 pixels, swing speed is capped and at most five tigers are rendered. The current run, score, act progress and best run are visible or saved locally. There are no purchases, ads or network calls.

## Controls

- Phone/tablet: **Enable Tilt & Enter the Ring** requests `DeviceOrientation` permission from a user gesture. Portrait uses `gamma`; landscape remaps `beta` according to orientation. **Level** recalibrates the neutral pose. The onscreen rotate buttons remain available as a deterministic fallback. **Release** lets go of the current trapeze.
- Keyboard: A / D or left / right rotate; Space or Enter releases; P pauses.
- Fullscreen and landscape lock are requested when supported and degrade safely when the browser refuses either operation.
- System visibility pauses the game and audio. Canvas density is capped at 1.5× on coarse pointers and 2× elsewhere.

## Sound and art

All visuals are drawn at runtime: fluorescent tent panels, moving spotlights, changing spectators, procedural trapezes, acrobat, trail and animated tigers. The original procedural circus score uses a reusable, capped Web Audio oscillator pool. Sound starts only after a user gesture and can be muted.

## Verification

```bash
node --test videogames/flying-velvet/tests/*.test.cjs
```

Tests cover deterministic generation, progressive bounded difficulty, momentum and torque, real catch windows across seeded layouts, scoring/acts, failure states and Canvas rendering across phone and desktop aspect ratios. Browser sensor permission and physical tilt still require testing on a real phone.
