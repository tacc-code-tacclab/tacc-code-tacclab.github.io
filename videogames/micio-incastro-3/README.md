# Micio Incastro 3 — il giro del mondo

A separate, buildless sequel in Italian. Static HTML/CSS/JavaScript, no dependencies, advertising, accounts, tracking, downloads or real-money purchases. V1 and V2 are preserved at their existing URLs; V3 has its own directory, source, artwork, manifest and local-storage keys.

## Native Roblox edition

The independent [Roblox Studio place](roblox/Micio_Incastro_3_Roblox.rbxlx) keeps the 36 silhouettes, mosquito and weapon economy in native Luau. Its board fills the usable screen, with subdued vector scenery behind the falling cats, a compact HUD and bottom touch controls. It has no web-page wrapper or sidebar. The [ZIP package](roblox/Micio_Incastro_3_Roblox_Package.zip) includes the place, sources and [Italian guide](roblox/README.md). Progress checkpoints last for the current Roblox session. The web edition and its saved journeys are unchanged.

The port was checked against 650 JavaScript action states and a mocked Roblox UI runtime. No Roblox Studio/device execution was available in the development environment; the guide explains the Studio playtest and publication steps.

## A world of silhouettes

There are **36 unique filled silhouettes in 18 destinations**, two stops per destination:

| Stops | Destination | Region |
| --- | --- | --- |
| 1–2 | Venice, Italy | Europe |
| 3–4 | Paris, France | Europe |
| 5–6 | Barcelona, Spain | Europe |
| 7–8 | London, England | Europe |
| 9–10 | Agra, India | Asia |
| 11–12 | Great Wall, China | Asia |
| 13–14 | Kyoto, Japan | Asia |
| 15–16 | Bangkok, Thailand | Asia |
| 17–18 | New York, USA | North America |
| 19–20 | Chicago, USA | North America |
| 21–22 | Panama City | Central America |
| 23–24 | Rio de Janeiro, Brazil | South America |
| 25–26 | Patagonia, Argentina | South America |
| 27–28 | Giza, Egypt | Africa |
| 29–30 | Amboseli, Kenya | Africa |
| 31–32 | Sydney, Australia | Oceania |
| 33–34 | Fiordland, New Zealand | Oceania |
| 35–36 | Antarctica | Antarctica |

`journey.js` defines the itinerary and every exact target cell. Silhouettes grow from 8 to 44 cells, with nondecreasing area, increasingly tall/dense designs, faster gravity and stronger mosquitoes. Their labels and actual masks are used consistently by the board, miniature preview, progress counter and victory check. The 36th completed silhouette is the final victory.

The goal is **every target cell**, including internal gaps. A high score, rescuing cats, arbitrary stamp keys, or painting only an outline cannot win. A landed cat of any colour leaves a persistent green footprint on its target cell. Six matching adjacent kittens clear and award points; their conquered footprints remain. Progress is counted only over the actual target mask. Purple mosquito clutter is never a cat and never earns footprints. Every target begins within the bottom eight rows, with the spawn area left free.

The 9 × 12 hex board retains fair-bag cat colours, two/three-cat shapes, rotation kicks, ghost landing, one swap per falling piece, adjacent clears and gravity. Fusa is earned by combinations, target progress and chasing mosquitoes; at 4 charges it frees the bottom two rows while preserving footprints. It cannot be bought. This gives players a way to reopen buried target cells.

**Sfida** has automatic falling and 3:30–4:45 active minutes per stop. Gravity begins at 760 ms, speeds up through the journey and elapsed time, and is capped at 260 ms per step. **Senza fretta** retains the same shapes and victory/loss rules but has manual placement, no deadline and mosquito attacks triggered by placements. A blocked spawn can lose in either mode.

## Points, credits and weapons

Points have no victory threshold. Every 100 accumulated points automatically generates 1 credit, including when the total crosses multiple hundreds. Spending credits does not change accumulated points or conversion remainders. Placements earn 5 points per cat, new footprints 15 each, combinations 20 per cat × chain, Fusa rescues 10 per cat, defeating a mosquito 100, and completing a stop 200. Footprints and completion rewards cannot be awarded twice.

The weapon shop opens only between successfully completed stops. Each unlock is paid once, persists for the journey and has unlimited shots. Basic stones are always free, so lacking credits cannot prevent defending the board.

| Weapon | Cost | Damage | Cooldown |
| --- | ---: | ---: | ---: |
| Sassi | Free | 1 | 340 ms |
| Freccette | 6 credits | 2 | 300 ms |
| Lance | 14 credits | 3 | 550 ms |
| Proiettili | 26 credits | 2 | 120 ms |
| Laser | 44 credits | 4 | 260 ms |

All weapons have distinct visible projectiles and short synthesized sounds. Select an owned weapon with its card, E to cycle, or number keys 1–5. Locked selections cannot equip or spend credits; the UI explains where to unlock them. Invalid/repeated purchases and insufficient funds are rejected by the engine.

## The mosquito

A new cartoon mosquito replaces the bee. It has a thin striped body, long legs/proboscis, angry eyebrows, translucent independently flapping wings and a higher filtered whine. It has 4–7 resistance points through the campaign. In Sfida its first visit is after at least two placements and 12 active seconds. It waits 4.2 seconds before its first attack; later attacks take 4.2–2.8 seconds depending on stage. In Relax it first arrives after five placements and attacks every three further placements. There are at most three attacks per visit, then a 20–25-second/six-placement break.

Attacks leave 1 purple clutter block, or 2 from stop 13, with a maximum of 10. Clutter never overwrites a cat, the falling piece or the top four rows. The mosquito leaves if no safe location exists. Clutter also breaks next to a kitten combination or with Fusa.

Click/tap the target, or use the prominent **SPARA / X** control for assisted aim. Misses consume only the cooldown. Held X does not auto-fire; compatibility clicks cannot duplicate a touch shot. Defeating the mosquito removes all clutter, awards 100 points and adds one Fusa charge. Mid-turn cleanup treats the active piece as a barrier so the falling cats remain legal.

## Controls, saving and performance

Arrows: move/rotate/step. Space: drop. C: swap. F: Fusa. X: shoot. E/1–5: weapon. P: pause. Touch supports horizontal drag, down-swipe drop, buttons and tap rotation; while a mosquito flies, board taps aim a shot, with RUOTA still available. Pointer cancellation, blur and lost capture clear held movement. Pause, help, passport, shops and a hidden page freeze gameplay and stop all audio. Background tabs never silently resume. Reduced motion fixes the mosquito's location and disables wing/pulse/particle movement; shot feedback remains visible.

The game fills the viewport in desktop, portrait and landscape layouts. A native fullscreen request is made on starting/resuming and can also be toggled; denied requests retain the full-page game. The shoot button retains at least 44 px of touch height. The compact phone arsenal stays outside the board. The passport previews the 18 illustrated destinations without skipping progression.

`micio3-trip-v1` stores the start-of-stop checkpoint, completed-stop state and shop purchases. Reloading an unfinished stop starts it again with its initial points, credits and arsenal; completed-stop rewards are not repeated. Failure also restores that checkpoint. Saves are validated for version, stage, mode, currency consistency and real weapon IDs. The opening screen offers Resume if a valid save exists. `micio3-palette` and `micio3-music` store independent preferences. No V1/V2 keys are written. Blocked/unavailable storage or audio does not stop gameplay.

All **18 background illustrations are original built-in Imagegen assets**; see `backgrounds/README.md` for the exact prompts and provenance. Each destination has 1440 × 960 and 800 × 533 WebP variants. Only the current background loads during play; passport thumbnails load lazily. The complete set is about 5.7 MB; a single full image is about 191–256 KB and a phone image 83–100 KB. There are no background videos or per-frame image operations.

Canvas DPR is capped at 2, particles at 90, transient effects at 12 and synthesis at 16 oscillators (including the two reused mosquito buzz oscillators). The board redraws only when needed; the SVG target moves with transforms. Four original 32-bar musical themes have destination-specific transpositions and alternate entry sections for each second stop. Audio begins with a user gesture and can be muted.

## Verification

Run from the repository root:

    node --test videogames/micio-incastro-3/tests/*.test.cjs

Tests cover all 36 masks and missing-cell checks; hex controls; footprint persistence; exact point/credit conversion; weapon purchase, damage and cooldown; mosquito timing and safe clutter; cleanup preserving active cats; checkpoint retries and corruption rejection; all destination transitions/final victory; touch/keyboard shooting; pause, visibility and audio cleanup; Resume/shop persistence; old-version storage isolation; reduced motion and fullscreen fallback. Browser QA uses the deployed public game. Simulated touch checks are not a physical-phone test.
