# Model card — Drosophila Connectome Laboratory

## Intended use

Showing what a measured connectome subcircuit does when you drive it and when you
remove parts of it, with every step traceable to a dataset version, an export
script and a declared set of equations. Teaching, exploration, and a concrete
demonstration that a lesion changes a computation rather than a picture.

## Not intended use

- **Predicting fly behaviour.** No behaviour is simulated here.
- **Claiming that the fly brain runs in a browser.** About a thousand neurons of
  167,106 are deployed.
- **Comparing against electrophysiology.** The dynamics are a declared reduction,
  not a fitted model; the rates are in Hz but they are not calibrated to
  recordings.
- **Any clinical, diagnostic or safety-related purpose.**

## Connectome representation

| | |
|---|---|
| Dataset | MaleCNS v1.0 |
| Whole graph | 167,106 neurons · 25,578,600 connections · 124,161,872 synapses |
| Fingerprint | `ef23cc27bea13be7f6a96f3c04fd3737` |
| Deployed here | 1,058 neurons · 58,753 connections |
| Weights | `_shaped_weights(c, LIFParams())`, md5 `0e30e4a80cb607d4a168d1b08ebd6a40` |

### The reduction rule

`regions.pare(connectome, sources, targets, max_hops=2)`: keep the neurons that
lie on directed walks from the sources to the targets in at most two hops.

- **Sources** — `JO-C` and `JO-E`, the two Johnston's-organ classes the reference
  implementation actually uses for wind (Yorozu et al. 2009: wind pushes the
  arista back → E, forward → C). 335 cells survive the reduction.
- **Targets** — DNa02, DNa01, DNp09, MDN, DNg02, DNp18, DNp33. All 14 cells
  survive.

The weights are computed on the whole graph and then sliced. Recomputing them on
the subgraph would change the fan-in normalisation.

### Laterality

Johnston's-organ neurons have **no `somaSide`**: their somata sit in the antenna,
outside the brain volume — all 672 are blank. The side is therefore assigned the
way the reference implementation does it in `senses.Wind`: by **functional
laterality**, the sign of how strongly a neuron drives the left versus the right
`cb_intrinsic` population. 100 % of the deployed sources get a non-zero side, and
the export fails if fewer than 80 % do.

This matters because an earlier draft read a column named `side`, which does not
exist, silently got empty strings, and produced a graph with no laterality at
all — in which the wind experiment returned exactly zero and looked like a result.

## Sensory interface

Antennal deflection uses `flyverse.air.deflections`, transcribed:
`dL, dR = −(w·x̂·cos45 ± w·ŷ·cos45) / full_speed`, with wind speed 0.3 m/s and
`full_speed` 0.5. Johnston's-organ rates use `flyverse.senses.Wind.rates`:
`2 Hz + 50 Hz · clip(d, 0, 1)`, with the deflection sign inverted for the C class.

Neither formula is ours. Nothing else is fed into the circuit: no vision, no
olfaction, no proprioception.

## Motor interface

There is none. The descending neurons are **read**, not connected to anything. The
page reports their firing rate per side and the DNa02 left-minus-right asymmetry.

## Dynamics — a declared reduction

```
tau · dx/dt = −x + relu( gain · (Wnorm @ x) + input )
```

- `tau` 20 ms, `dt` 2 ms — Euler, well inside stability.
- `Wnorm` is `W` with each row divided by the sum of its absolute weights, so
  `Wnorm @ x` is a weighted mean of presynaptic rates: dimensionally consistent
  (Hz in, Hz out) and contracting for gain below 1.
- `gain` 0.8.

**This is not the reference implementation's model.** That one integrates all
167,106 neurons with spiking LIF dynamics, a receptor model, adaptation and a
spiking→rate feedback. Same measured wiring, different and simpler dynamics.

### Why the normalisation exists

The shipped weights are in millivolts, for a LIF with a threshold. An earlier
draft multiplied them directly by rates in hertz — dimensionally meaningless. Half
the network pinned at the safety ceiling, and the DNa02 asymmetry read exactly
`0.0000` not because DNa02 was silent but because **both sides were saturated**.
A ceiling can disguise a divergence as a result. The ceiling now raises an error
instead of clipping quietly.

### How the gain was chosen

A sweep over 0.2–1.1 against a criterion stated before looking: no saturation,
under 50 % of cells silent, peak rate below 100 Hz. 0.2 is excluded (59.8 %
silent); 0.4–1.1 are admissible; 0.8 is the middle of that range. The sign of the
DNa02 asymmetry flips with wind side at **every** admissible gain, so the effect
does not depend on the choice.

## Lesion semantics

Removing a neuron sets its rate to zero, zeroes any input current it would have
injected, and drops its outgoing edges from the matrix–vector product. The
computation changes. Restoring returns the model to a state that reproduces the
intact run exactly, which the test suite checks.

## Validation

- `model/riferimento.json` holds reference outputs from the Python implementation
  at nine checkpoints (three wind angles × three step counts) plus one lesioned
  case. The worker reproduces them to ~10⁻⁶ relative against a declared tolerance
  of 10⁻⁴, and refuses to start if it does not.
- 18 numerical assertions in `test/prova_worker.mjs`.
- 12 browser tests, run at the production subpath.

## Uncertainty and limitations

1. A subcircuit, not a brain. Anything the rest of the connectome would contribute
   is absent — including inhibition that would change these rates.
2. The dynamics are chosen, not fitted. Rates are in hertz but are not calibrated
   against recordings, and should be read as relative, not absolute.
3. Two hops is a declared cut. Three hops gives 8,019 neurons and 1.13 million
   connections, which the browser could hold but the graph view could not show
   usefully.
4. The reduction targets the wind pathway. Nothing here speaks to vision, olfaction
   or any other modality.
5. Float32 throughout, and JavaScript and Python agree to about 10⁻⁶ relative —
   fine for this purpose, not for accumulating long runs.

## A note on communication

The most defensible statement this page supports is: *removing this neuron changes
the computation actually executed on this measured subcircuit, and here is the
difference under matched conditions.* Not: *this is what the fly would do.* The
page says so in its own words, on the page, not only here.

## Citation

MaleCNS v1.0 connectome (CC BY 4.0) — cite the release and the original
reconstruction papers. Reference implementation: flyverse-core (MIT).
