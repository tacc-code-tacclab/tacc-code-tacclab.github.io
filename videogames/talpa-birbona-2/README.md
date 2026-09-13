# Naughty Mole 2

The English sequel to Talpa Birbona. It keeps the illustrated side-view garden and immediate keyboard, pointer and touch controls, then extends the campaign to 20 tested gardens.

- Poison falls quickly, moves more slowly sideways, climbs even more slowly and loses time at every bend.
- Every poison pour disappears completely after 2.5 seconds and is fatal on first contact.
- Digging ants add connected tunnels that can carry active poison.
- Gardens 1–10 keep the established balance; speed growth is deliberately gentler in gardens 11–20.
- Clearing garden 20 awards an animated golden pumpkin.
- Browser progress uses its own `naughty-mole-2-*` localStorage keys, separate from the Italian edition.

Run the deterministic checks from this directory with:

```sh
node --test tests/*.test.cjs
```

The matching standalone Roblox build is `../talpa-birbona/roblox/Talpa_Birbona_Roblox_V5.rbxlx`.
