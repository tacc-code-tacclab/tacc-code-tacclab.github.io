# Micio Incastro

An original implementation of a gentle falling-cat puzzle, designed for desktop and phone. No dependencies, ads, accounts or third-party assets. Italian UI.

The flat-top hexagonal nest has 9 columns and 12 rows. Pieces contain two or three kittens, rotate in 60-degree increments and use four colour/symbol families. Six adjacent matching cats leave the nest; column gravity can produce chain reactions. Four rescued groups charge **Fusa**, which clears the bottom two rows. A once-per-piece swap exchanges the active and next group.

**Senza fretta** is the default: the player decides when to drop. **Segui il ritmo** falls automatically, gradually accelerating from 1.7 seconds to a capped 0.65 seconds per step. A filled spawn ends the session without penalties. Separate local high scores are stored for the two modes; the game also works when storage is unavailable.

Keyboard: arrows move/rotate/step, Space drops, C swaps, F activates Fusa, P pauses. Touch: drag horizontally, tap to rotate, swipe down to drop, or use the large buttons. Portrait and landscape layouts are supported. Hidden pages pause automatically; held controls stop on blur/cancel.

Canvas graphics are drawn directly with vector paths, capped at 2× display resolution. Redraws happen only on changes or during short particle effects. Particles are limited to 100; reduced-motion disables them. Optional original audio uses at most eight sine voices with cleanup. Sound starts off.

This is not an official or licensed Tetris product. It uses its own name, artwork, hex geometry, small-piece set and cluster-rescue rules, not the familiar rectangular line-clearing presentation. These differences are design choices, not a legal guarantee or a claim that no similar puzzle has ever existed.

Run logic checks from the repository root:

    node --test videogames/micio-incastro/tests/*.test.cjs

Serve the repository over HTTP and open `videogames/micio-incastro/`. No build step.
