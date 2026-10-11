# Micio Incastro

An original implementation of a gentle falling-cat puzzle, designed for desktop and phone. No dependencies, ads, accounts or third-party assets. Italian UI.

The flat-top hexagonal nest has 9 columns and 12 rows. Pieces contain two or three kittens, rotate in 60-degree increments and use four colour/symbol families. Six adjacent matching cats leave the nest; column gravity can produce chain reactions. Four rescued groups charge **Fusa**, which clears the bottom two rows. A once-per-piece swap exchanges the active and next group.

**Rescue 60 kittens in each of four worlds to win the journey.** The worlds are Giardino delle lanterne, Baia luminosa, Città delle nuvole and Osservatorio stellare. Matching groups, complete chains and Fusa all count. The counter and progress bar show the current world's goal. A completed world pauses with **Prossimo mondo**, then opens a fresh board and timer while keeping the score and total rescued kittens. The fourth completion shows **Hai vinto!**. A blocked spawn is a loss; retrying restores the current world's starting score, so failed attempts cannot accumulate points.

**Sfida** is the default: pieces fall automatically and a visible timer counts down 180 seconds of active play per world. Starting intervals are 720, 635, 550 and 465 ms, compared with the previous version's 1100 ms. Falling accelerates another 45 ms every 20 seconds (or sooner with rescued cats), bounded at 180 ms. Running out of time before rescuing 60 kittens is a loss. **Senza fretta** has the same four-world journey, manual drops and no timer. Pause stops time and music. Separate local high scores use `micio-records-v4`, preserving earlier record keys. The game also works when storage is unavailable.

Choose **Pastello** or **Fluorescenti** in the welcome/pause dialog, or toggle them with the coloured squares in the header. Both palettes recolour every kitten, preview, landing ghost, particle, legend and interface accent. The selection persists locally and changing it never resets the game or timer. The four family symbols and shapes stay the same. Fluorescent colours use solid fills and a small glow on the active piece only; there are no flashing effects or additional assets.

Keyboard: arrows move/rotate/step, Space drops, C swaps, F activates Fusa, P pauses. Touch: drag horizontally, tap to rotate, swipe down to drop, or use the large buttons. Portrait and landscape layouts are supported. Hidden pages pause automatically; held controls stop on blur/cancel.

The game **always fills the page** on desktop and phone. Play also requests native fullscreen during the user gesture where supported, including the WebKit alternative. The header button can restore or hide the browser bars; exiting fullscreen never shrinks the game layout or resets progress. Unsupported/rejected requests leave full-page play intact. On iPhone, Safari's **Add to Home Screen** provides a standalone view. The manifest and Apple metadata support that mode. No offline cache or service worker is installed.

The four approved, originally generated illustrations are stored as static WebP backgrounds. Desktop versions are 1440 × 810 (141–171 KiB each); phones and viewports up to 900 px use smaller 900 × 507 versions (72–86 KiB). Only the current world's background is displayed and requested. No video, parallax, blur filters or per-frame background drawing. The opaque `#142430` board keeps kittens independent of the background: the lowest solid-fill contrast ratio is 6.24:1 across both palettes, with light outlines and dark facial marks. Interface panels also have dark backings. Portrait status messages occupy the board's footer rather than cover the cats.

Canvas graphics use vector paths, capped at 2× display resolution. Redraws happen only on changes or short particle effects. Particles are limited to 100; reduced-motion disables them. `audio.js` provides four original 32-bar themes (roughly 62–77 seconds), with melody, arpeggios, bass, bridge and reprise. Each world has its own notes, harmony, tempo and arrangement. Short sounds distinguish movement, rotation, swapping, descent, hard drops, landing, chains, Fusa and results. Automatic descent sounds are quiet and throttled. Synthesis is limited to 16 concurrent voices with cleanup. Audio starts with a user gesture, pauses with the game and respects the saved mute preference. No audio downloads or third-party requests.

This is not an official or licensed Tetris product. It uses its own name, artwork, hex geometry, small-piece set and cluster-rescue rules, not the familiar rectangular line-clearing presentation. These differences are design choices, not a legal guarantee or a claim that no similar puzzle has ever existed.

Run the engine and DOM/audio/fullscreen simulation checks from the repository root:

    node --test videogames/micio-incastro/tests/*.test.cjs

Serve the repository over HTTP and open `videogames/micio-incastro/`. No build step.
