# Micio Incastro

An original implementation of a gentle falling-cat puzzle, designed for desktop and phone. No dependencies, ads, accounts or third-party assets. Italian UI.

The flat-top hexagonal nest has 9 columns and 12 rows. Pieces contain two or three kittens, rotate in 60-degree increments and use four colour/symbol families. Six adjacent matching cats leave the nest; column gravity can produce chain reactions. Four rescued groups charge **Fusa**, which clears the bottom two rows. A once-per-piece swap exchanges the active and next group.

**Sfida · 3 minuti** is the default: pieces fall automatically and a visible timer counts down 180 seconds of active play. Falling accelerates every 20 seconds (or sooner when enough cats are rescued), from 1.1 seconds per step to a lower bound of 0.24 seconds. A blocked spawn is an immediate game over; reaching the deadline ends the challenge with a score summary. **Senza fretta** remains available as an explicit choice, with manual drops and no timer. Both modes stop at a blocked spawn. Pause stops the timer and music. Separate local high scores are stored for the two modes; timed scores use a new record key, preserving the old unlimited record. The game also works when storage is unavailable.

Keyboard: arrows move/rotate/step, Space drops, C swaps, F activates Fusa, P pauses. Touch: drag horizontally, tap to rotate, swipe down to drop, or use the large buttons. Portrait and landscape layouts are supported. Hidden pages pause automatically; held controls stop on blur/cancel.

Choose **⛶ Schermo intero** in the header or welcome dialog to enter fullscreen. The board stretches to the available height and decorative content is hidden; exiting restores the regular layout without resetting play. Native fullscreen is feature-detected, including WebKit support. If the browser rejects it or does not support it, an extended layout stays available and explains the limitation. On iPhone, opening the game from Safari's **Add to Home Screen** provides a standalone view; the manifest and Apple mobile metadata support that launch mode. No offline cache or service worker is installed.

Canvas graphics are drawn directly with vector paths, capped at 2× display resolution. Redraws happen only on changes or during short particle effects. Particles are limited to 100; reduced-motion disables them. A 16-bar original melody with arpeggios and bass loops in the background, synthesized with at most 16 sine/triangle voices and cleanup. Audio begins with the Play gesture, pauses with the game, and can be muted; the preference is saved when storage is available. No audio files or third-party requests are required.

This is not an official or licensed Tetris product. It uses its own name, artwork, hex geometry, small-piece set and cluster-rescue rules, not the familiar rectangular line-clearing presentation. These differences are design choices, not a legal guarantee or a claim that no similar puzzle has ever existed.

Run the engine and DOM/audio/fullscreen simulation checks from the repository root:

    node --test videogames/micio-incastro/tests/*.test.cjs

Serve the repository over HTTP and open `videogames/micio-incastro/`. No build step.
