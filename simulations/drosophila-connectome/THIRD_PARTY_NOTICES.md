# Third-party notices

This page ships **no third-party code**. No libraries, no frameworks, no fonts and
no analytics are loaded, from this origin or any other. Everything under
`simulations/drosophila-connectome/` is either written for this release or derived
from the data below.

## Data

**MaleCNS v1.0 connectome** — licensed CC BY 4.0. The deployed files under
`model/` are a derived subset: 1,058 of 167,106 neurons and their connection
weights after the reference implementation's receptor model. Cite the release and
the original reconstruction papers.

## Derived from

**flyverse-core** (<https://github.com/tel-0s/flyverse-core>), MIT licence.
Three things are transcribed from it rather than invented here, and are marked as
such in the source:

- `air.deflections` — antennal deflection from wind direction;
- `senses.Wind.rates` — Johnston's-organ firing rates from deflection;
- `senses.laterality` — assigning a side to sensory neurons by functional
  connectivity.

The connection weights are produced by its `_shaped_weights` with default
`LIFParams`, and their md5 is recorded in `provenance.json`.

## Development-only

Playwright is used to test this release. It is not shipped and is not installed
inside this repository.
