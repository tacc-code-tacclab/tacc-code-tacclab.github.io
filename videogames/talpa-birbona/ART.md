# Art direction — Talpa Birbona

Original warm cartoon illustration for a small Romagna orchard game: soft cream, sage green, apricot orange, warm brown earth, lilac fantasy poison, a brown mole with pink snout and a red neckerchief. Friendly and mischievous, with clearly recognizable crops.

The built-in image generation tool produced `assets/characters.png` for this project. The delivered image has genuine alpha transparency and has been copied unchanged into the game, with no background-removal or image conversion pass.

Atlas layout: 4 columns × 3 rows, 362×362 pixels per cell, total 1448×1086. Cells, left to right and top to bottom:

1. Mole facing right, red neckerchief.
2. Farmer, straw hat, red checked shirt, green overalls, purple watering can.
3. Carrot with fronds.
4. Potatoes with leaves.
5. Cabbage.
6. Pear tree.
7. Apple tree.
8. Apricot tree.
9. Wheat.
10. Tomato vine.
11. Zucchini and blossom.
12. Eggplants.

Generation brief: create one polished, cheerful 4×3 sprite sheet for a side-view game called Talpa Birbona, with one complete isolated subject in each cell and no text. Use consistent warm cartoon art, friendly rounded shapes, expressive eyes, crisp dark outlines, soft highlights and shadows, and true transparent backgrounds. Design the mole and farmer as original characters, and make all ten crops individually recognizable. Keep padding around every subject so each sprite can be sampled independently. No existing entertainment characters or copied game assets.

Roblox uses independently drawn rounded GUI shapes in `TalpaBirbona.client.lua`: mole, farmer, ten crops, country house, trees, roots, tunnels and poison. It does not claim pixel-identical parity with the raster atlas and requires no uploaded image IDs.
