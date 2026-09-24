# Drosophila Connectome Laboratory — web release

A named subcircuit of the MaleCNS *Drosophila* connectome, computed in the
browser. Live at
<https://tacc-code-tacclab.github.io/simulations/drosophila-connectome/>.

## What it is

The page loads a reduced graph — the neurons that lie on directed paths from the
wind receptors of Johnston's organ to the descending neurons for steering and
locomotion — and integrates a declared rate model over it. You set the wind
direction, remove neurons, and compare matched intact and lesioned runs.

**It is not the fly brain, and it simulates no behaviour.** There is no body, no
room and no locomotion. What changes is the firing of a circuit; what you read is
the firing of its output neurons. See [`MODEL_CARD.md`](MODEL_CARD.md).

## How it relates to the scientific project

| | |
|---|---|
| Connectome | MaleCNS v1.0, fingerprint `ef23cc27bea13be7f6a96f3c04fd3737` |
| Reference implementation | [flyverse-core](https://github.com/tel-0s/flyverse-core), MIT |
| Export script | `esporta_web/esporta.py` in the science project |
| Reference model | `esporta_web/modello.py` — the equations this page implements |
| Gain calibration | `esporta_web/calibra_guadagno.py` — the declared sweep |

The weights shipped here are the ones the reference implementation uses, with its
receptor model applied (`_shaped_weights(c, LIFParams())`, md5
`0e30e4a80cb607d4a168d1b08ebd6a40`). They are computed on the **whole** graph and
then sliced, not recomputed on the subgraph: recomputing would change the fan-in
normalisation and they would no longer be the validated model's weights.

## Rebuilding the assets

From a checkout of the science project, with its environment active:

```bash
python esporta_web/esporta.py            # writes esporta_web/costruito/
python esporta_web/modello.py            # writes riferimento.json (checkpoints)
python esporta_web/calibra_guadagno.py   # re-runs the declared gain sweep
cp esporta_web/costruito/* <site>/simulations/drosophila-connectome/model/
```

The export refuses to write if validation fails: non-finite weights, out-of-range
indices, a subgraph over the declared size limits, or — the one that caught a real
bug — fewer than 80 % of the wind sources carrying a functional side.

## Serving locally

Test through HTTP at the **nested path**, never `file://` and never only at `/`:

```bash
cd <site repository root>
python3 -m http.server 8731 --bind 127.0.0.1
# then open http://127.0.0.1:8731/simulations/drosophila-connectome/
```

## Tests

```bash
# numerics: the JS must reproduce the Python reference
node simulations/drosophila-connectome/test/prova_worker.mjs

# browser, at the production subpath
BASE=http://127.0.0.1:8731 npx playwright test simulazione.spec.mjs
```

The worker refuses to report itself ready unless its self-test against
`model/riferimento.json` passes, so a wrong model never reaches the screen.

## Architecture

Plain ES modules and a classic Web Worker — no bundler, matching the rest of this
site. Nothing is fetched from a third party at runtime.

```
index.html     structure, metadata, the limitations panel
app.css        styling, on the site's own design tokens
app.js         UI thread: controls, canvas, orchestration
worker.js      the model: loading, validation, dynamics, lesions, self-test
model/         nodes.json + three binaries + provenance + reference checkpoints
```

## Browser support

Needs Web Workers, `fetch`, typed arrays and Canvas 2D. Tested on Chromium
(desktop 1280×720 and a 390×780 touch viewport). No WebGL, no WASM, no service
worker.

## Limitations

Stated on the page itself, and in the model card. The short version: a subcircuit
of about a thousand neurons, measured wiring with declared reduced dynamics, no
behaviour, and a recurrent gain that is a chosen parameter.

## Licence and citation

Connectome data: MaleCNS v1.0, CC BY 4.0 — cite the release and the original
reconstruction papers. Reference implementation: flyverse-core, MIT. This page's
own code follows the licence of the site repository.
