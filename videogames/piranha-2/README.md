# Piranha 2

A separate English-language evolution of DeepBite, built for immediate keyboard and touch response.

- Direct four-direction movement with no acceleration lag, plus an analogue thumb stick on mobile.
- Nemo uses separate closed-mouth and open-mouth animation sprites when eating.
- Sharks use a complete standalone sprite, avoiding atlas cropping.
- A visible scrolling seabed anchors lethal coral and shell hazards; glowing treasure grants points and growth.
- Animated surface waves and bubbles rising from seabed hazards enrich the ocean without adding heavy assets.
- Any non-jellyfish creature becomes edible once Nemo is larger.
- Reaching near-screen-filling size clears the ocean.
- Each new ocean increases colour intensity, enemy speed and difficulty.

The game shares the lightweight ocean artwork with DeepBite but does not replace or modify the original game.

PNG assets and always-painted Canvas vector underlays keep creatures and obstacles visible in Chrome, Firefox and Safari, including when a browser reports a decoded image but fails to paint it. GPU-sensitive Canvas filters and the desynchronised context are intentionally avoided. Mobile pinch, double-tap zoom, page dragging and overscroll are suppressed while playing.
