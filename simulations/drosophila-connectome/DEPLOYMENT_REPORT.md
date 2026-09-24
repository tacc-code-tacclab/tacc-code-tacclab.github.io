# Deployment report

| | |
|---|---|
| Website commit | `5223033ffb3ab283680afe79c442e8fd9df15daf` (branch `main`) |
| Science source commit | `5b8242ad78542bb11b3c6b0d1f3d46341f46bd1f` (flyverse-core, branch `verifica-indipendente`) |
| Deployed | 24 September 2026, verified live 2026-09-24 |
| Pages build | `built`, checked through the GitHub Pages API |

## Public URLs

- https://tacc-code-tacclab.github.io/
- https://tacc-code-tacclab.github.io/simulations/
- https://tacc-code-tacclab.github.io/simulations/drosophila-connectome/
- https://tacc-code-tacclab.github.io/sitemap.xml

All return HTTP 200 with cache bypassed, as do `worker.js`, `app.js`,
`app.css`, the four `model/` assets, `provenance.json` and the markdown
documents.

## Build

No bundler. The browser assets are produced by the science project:

```bash
python esporta_web/esporta.py            # sottografo validato -> costruito/
python esporta_web/modello.py            # riferimento.json, i punti di controllo
python esporta_web/calibra_guadagno.py   # lo sweep del guadagno, ri-eseguibile
```

The export asserts its own limits and refuses to write on failure. It exited 1
twice during this release — once because the laterality column was missing, once
because the Johnston's-organ neurons have no `somaSide` at all — and both were
real defects, not false alarms.

## Tests and outcomes

```bash
node simulations/drosophila-connectome/test/prova_worker.mjs
#   18/18 assertions pass; JS matches the Python reference to ~1e-6 relative
#   against a declared tolerance of 1e-4

BASE=http://127.0.0.1:8731 npx playwright test simulazione.spec.mjs
#   12/12 against the local production artifacts at the nested path

BASE=https://tacc-code-tacclab.github.io npx playwright test simulazione.spec.mjs
#   12/12 against the live public origin
```

Coverage: cold start, deep link, hard refresh, provenance content, single step,
continuous run and pause, wind change, lesion and exact restore, matched
comparison (including the control that the two arms are identical with no
lesion), determinism, keyboard access, a 390×780 touch viewport, and a
no-regression pass over the existing homepage sections.

## Browser and viewport matrix

| | |
|---|---|
| Chromium desktop | 1280×720 — all tests |
| Chromium mobile | 390×780, touch — core interaction, no horizontal scroll |
| Firefox / WebKit | not run; no browser-specific API is used beyond Web Workers, `fetch`, typed arrays and Canvas 2D |

## Performance, measured on the live origin

| | desktop 1280×720 | mobile 390×780 |
|---|---|---|
| Requests | 11 | 11 |
| Transferred | 577 KB | 577 KB |
| `load` event | 748 ms | 362 ms |
| Usable interface | 2.05 s | 1.66 s |
| JS heap | 10 MB | 10 MB |

Continuous run: **120 steps/s**, which is the animation frame rate times two
steps per frame — the renderer is the limit, not the model. With `dt` 2 ms that
is 0.24× realtime, which is irrelevant here: the model has no clock to keep.

## What was found by running against production

The suite passed 12/12 locally and failed one test live. The cause was a real
defect: `.sim-grid { display: grid }` outranks the browser's
`[hidden] { display: none }` by specificity, so `#app` was never actually
hidden and was interactive while the worker was still loading. Clicking into that
window reached a null model. The window is too short to hit locally and wide
enough to hit over the network.

Fixed in `5223033` with `[hidden] { display: none !important }` and a guard in
the worker that refuses any request before the model is loaded. Re-verified:
12/12 live.

## Known limitations

Stated precisely in [`MODEL_CARD.md`](MODEL_CARD.md) and on the page itself. In
short: a 1,058-neuron subcircuit of a 167,106-neuron connectome; measured wiring
with declared reduced dynamics that are **not** the reference implementation's
spiking model; no behaviour, no body, no room; wind is the only sensory channel;
the recurrent gain is a chosen parameter, though the sign of the result holds
across the whole admissible range.

## Deliberately deferred

Graph pan and zoom, edge-level lesions, undo/redo history, a speed control, and
result export. Each is marked `NOT IMPLEMENTED` in
[`FEATURE_PARITY_CHECKLIST.md`](FEATURE_PARITY_CHECKLIST.md) rather than faked.

## Note on the brief

The brief describes this as publishing an *already-created* simulation. There was
none: the science project contains no browser code — zero `.html`, `.js`,
`.ts`, `package.json` or `.wasm` — and its only interactive interface is a
pygame desktop window. This release was written from scratch, which is why there
is no parity column against a predecessor.
