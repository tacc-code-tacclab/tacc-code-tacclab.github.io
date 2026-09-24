# Feature checklist

The brief asks for a parity check against an existing application. **There was
none**: the science project contains no browser code at all — zero `.html`,
`.js`, `.ts`, `package.json` or `.wasm` files — and the only interactive
interface ever written for it is a pygame desktop window in the reference
implementation. This release was therefore written from scratch, and the table
below is a check against the brief's own acceptance matrix, not against a
predecessor.

Evidence: `test/prova_worker.mjs` (18 numerical assertions, node) and
`simulazione.spec.mjs` (12 browser tests, Chromium, run at the production
subpath). "Local" is the production artifacts served over HTTP at
`/simulations/drosophila-connectome/`.

| Test | Local | Live | Evidence |
|---|---|---|---|
| Cold start, no console error or failed request | PASS | PASS | *avvio a freddo* |
| Deep link to the full nested URL | PASS | PASS | *collegamento diretto* |
| Hard refresh at the nested URL | PASS | PASS | *collegamento diretto* |
| Autonomous run | NOT APPLICABLE | — | no behaviour is simulated; the model is driven by the wind control |
| Determinism: same input, same result | PASS | PASS | *determinismo*; also bit-identical in node |
| Visual stimulus | NOT IMPLEMENTED | — | the reduction targets the wind pathway only |
| Odour / food | NOT IMPLEMENTED | — | as above |
| Threat | NOT IMPLEMENTED | — | as above |
| Wind / mechanosensation | PASS | PASS | *cambiare la direzione del vento* |
| Graph view, inspect, hover | PASS | PASS | canvas with per-node tooltip |
| Graph pan / zoom | NOT IMPLEMENTED | — | the layout is fixed and fits; deferred, not faked |
| Lesion a node | PASS | PASS | click a node; *la lesione cambia il calcolo* |
| Lesion a group | PASS | PASS | *la lesione cambia il calcolo* |
| Lesion an edge | NOT IMPLEMENTED | — | lesions act on neurons only |
| Eraser precision | PASS | PASS | nearest-node hit test within 14 px |
| Undo / redo | NOT IMPLEMENTED | — | only full restore; there is no lesion history |
| Full reset to the canonical intact model | PASS | PASS | *il ripristino lo riporta identico* |
| Matched intact-versus-lesioned comparison | PASS | PASS | *confronto appaiato* |
| Comparison is genuinely controlled | PASS | PASS | with no lesion the two arms are bit-identical |
| Pause / resume | PASS | PASS | *avanzamento a passo singolo e corsa continua* |
| Single step | PASS | PASS | as above |
| Speed control | NOT IMPLEMENTED | — | presentation speed is the frame rate; not exposed |
| Scenario switch | PASS | PASS | wind direction is the scenario, and switching resets state |
| Replay | NOT APPLICABLE | — | runs are deterministic: re-running *is* the replay |
| Export of results | NOT IMPLEMENTED | — | deferred |
| Resize without losing scientific state | PASS | PASS | the canvas redraws; the worker holds the state |
| Mobile, 390×780 with touch | PASS | PASS | *mobile*; no horizontal page scroll |
| Keyboard access to essential controls | PASS | PASS | *tastiera* |
| Reduced motion respected | PASS | PASS | only the progress bar animates, and it is gated |
| Error recovery | PASS | PASS | explicit error panel with a retry button; no fallback animation |
| Existing site has no regression | PASS | PASS | *il resto del sito non regredisce* |

## Deliberately not implemented

Marked `NOT IMPLEMENTED` above rather than faked: graph pan/zoom, edge-level
lesions, undo/redo history, a speed control, result export, and every sensory
modality other than wind. Each is absent because the deployed model does not
contain it, not because it failed.

`NOT APPLICABLE` rows are ones where the brief's category does not map onto this
model: there is no autonomous behaviour to run, and replay is meaningless for a
deterministic model with no hidden state.
