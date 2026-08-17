# Totem Balance

An original touch-first browser physics game. Players alternate with the Oracle, hooking asymmetrical forged relics onto an ancient vertical totem. The player who collapses the structure loses the round.

## Controls

- Rotate the staged relic with the on-screen arrows, mouse wheel, or keyboard arrows.
- Press **Hook** (or `Tab`) to cycle through the available golden attachment points.
- Press **Place** (or `Enter`) to attach the relic to the selected hook.
- A new relic moves under gravity for about two seconds. If it survives, it locks permanently.

Each attached relic is a free hinge rather than a fixed decoration: gravity acts on the full supported subtree, impulses travel through parent rods, and overloaded or inverted hooks can slip. The game is dependency-free and designed for desktop and mobile browsers.
