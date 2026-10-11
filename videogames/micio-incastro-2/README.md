# Micio Incastro 2

A separate sequel to Micio Incastro. Italian, static HTML/CSS/JavaScript, no build, ads, accounts, analytics, paid purchases or runtime dependencies. The original game and its source are unchanged. The four already published background illustrations are reused through `../micio-incastro/backgrounds/`; all sequel logic, drawing, audio, icons and styles live here.

## The journey

Eight missions alternate rescues and footprints across four illustrated worlds:

| Mission | World | Objective |
| --- | --- | --- |
| 1 | Lantern garden | Rescue 30 kittens |
| 2 | Lantern garden | Complete the 20-cell heart |
| 3 | Glowing bay | Rescue 42 kittens |
| 4 | Glowing bay | Complete the 24-cell fish |
| 5 | Cloud city | Rescue 48 kittens |
| 6 | Cloud city | Complete the 13-cell star |
| 7 | Starry observatory | Rescue 60 kittens |
| 8 | Starry observatory | Complete the final star |

Pieces contain two or three kittens of one family on a 9 × 12 flat-top hex grid. Six adjacent matching cats are rescued; gravity can produce chains. Four groups charge Fusa, which rescues the bottom two rows. C swaps the falling and next groups once per piece.

Figure missions highlight their exact target cells in gold and show a miniature silhouette and progress counter. Landing any kitten colour in a target cell leaves a permanent footprint. Footprints are counted before groups clear, remain after rescue or insect shuffles, and do not become solid obstacles. This lets players build a figure incrementally. A figure mission is won only by completing its silhouette; accumulating rescue points does not skip it. Actual settled kittens retain their faces; empty stamped cells use ticks, so they are not mistaken for blocks.

Sfida has 180 active seconds per mission. Initial fall intervals range from 700 to 385 ms across the eight missions, with further time-based acceleration and a 190 ms lower bound. Senza fretta uses manual placement and has no deadline. A full spawn loses in either mode. Failure retries the current mission from its starting wallet, score and inventory; rewards from failed attempts cannot be farmed. Success keeps progress and opens the shop. The eighth success shows a final victory. Progress within the journey is session-only; only high scores and preferences persist locally.

## Bee and bonuses

The first bee warning in Sfida occurs after at least three placements and 20 active seconds. It shows two different columns and waits five full seconds. Later visits are 32–38 seconds apart. The highlighted columns swap as whole columns, preserving all cats. If the falling piece cannot be placed legally after the swap, the bee retreats and the board is restored; the insect cannot force an unavoidable top-out. In Senza fretta, the first visit is after seven placements; it waits three more placements instead of using a timer, and later visits are eight placements apart.

Each journey starts with one of each bonus:

| Bonus | Key | Effect | Price | Inventory limit |
| --- | --- | --- | --- | --- |
| Honey | B | Cancels a pending bee and adds one Fusa charge | 4 coins | 3 |
| Ice | I | Slows falling for 12 active seconds; does not stop the mission timer | 6 coins | 2 |
| Wand | W | Moves one settled kitten to an empty cell, stamps it, then applies gravity | 8 coins | 2 |

The wand pauses time, falling, bee and music while selecting. Tap a source cat and an empty destination, or use arrow keys and Space/Enter. W/Escape cancels without spending it. Invalid destinations do not consume a charge. Moving into the current falling piece is disallowed. The wand rolls back unsafe moves. In Senza fretta, Ice is disabled and is not sold because there is no automatic fall to slow.

Every three rescued kittens earn one coin; every four new footprints earn one coin. Completing a mission awards six coins once. The between-mission shop uses only these virtual coins, checks affordability and inventory caps, and allows continuing without buying anything. Shop time is paused.

## Controls and presentation

Arrows move/rotate/step, Space drops, C swaps, B uses honey, I uses ice, W selects the wand, F activates Fusa and P pauses. Touch uses horizontal drag, tap-to-rotate, down-swipe-to-drop and buttons. While the wand is active, the rotate/drop buttons become cursor-up/select. Held movement ends on pointer cancel, capture loss or blur. Hidden pages pause without automatically resuming. Result dialogs cannot be accidentally dismissed into a frozen board.

The game always fills the page. Play requests native fullscreen where the browser allows it; rejection or exit leaves full-page layout intact. Portrait phones use a compact inventory dock; landscape has a side panel. Browser bars can be toggled through the header. iPhone standalone launch is supported by the web manifest and Apple metadata. The first game remains linked from the desktop panel and the homepage.

The board is opaque `#142430`, independent of the scene brightness. Both pastel and fluorescent families retain their distinct forehead marks, light outlines and high-contrast faces. Backgrounds are static WebP illustrations; small viewports select the existing 900-pixel versions. There are no blur filters, videos or per-frame background updates. Canvas DPR is capped at 2, particles at 90 and synthesis at 16 voices. Reduced motion disables particles and the bee's short CSS bob. Four original 32-bar musical themes are reused, with a different entry section for each paired figure mission, plus new bee/honey/footprint sounds. Audio starts on a gesture, stops on pause and can be muted.

High scores use the separate `micio2-records-v1` key. Colour and audio preferences share the original game's preference keys. Storage failures do not prevent gameplay. There is no service worker or offline cache.

## Verification

From the repository root:

    node --test videogames/micio-incastro-2/tests/*.test.cjs

The tests cover legal geometry and cat conservation, footprint persistence and victory, bee warnings and safe swaps, honey, slow timing, wand selection/rollback, exact shop payments and caps, checkpoint retries, all eight transitions, keyboard/touch/pause behaviour, palettes, audio cleanup and fullscreen fallback. Browser QA is performed on the deployed page. No physical-phone test is implied by the simulated touch checks.
