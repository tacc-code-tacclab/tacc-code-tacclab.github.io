# FOREPATH browser pilot

FOREPATH is an exploratory browser experiment about anticipation, confidence and post-response outcomes. It is intentionally labelled a pilot: it is not a diagnostic test, it does not establish an individual paranormal ability, and it is not a substitute for ethics approval or preregistration.

## Trial sequence

1. A fixed approach animation is shown.
2. The participant rates anticipated danger and confidence.
3. The participant chooses left or right; the response and timestamp are locked.
4. The client observes the latest drand Quicknet round and targets round `latest + 3`, leaving a safety margin beyond the response timestamp.
5. The first byte of the future randomness assigns the safe side; the second byte assigns revealed or masked feedback.
6. The complete beacon record is stored for later audit. The lightweight browser pilot stores the BLS signature but does not verify it in-browser.
7. If all drand relays fail, `crypto.getRandomValues()` is used strictly after the choice and that trial is labelled `browser_webcrypto_fallback`.

Practice trials always reveal feedback and are excluded from the experimental summary. Experimental assignments are independent, not forced-balanced.

## Participant records

Each participant receives a pseudonymous identifier such as `FP-20260806-1A2B3C4D`. The application stores one structured session object in IndexedDB (with a localStorage fallback) and offers one JSON download at completion or early withdrawal.

The record includes:

- consent version and UTC timestamps;
- broad non-identifying baseline answers;
- ratings, choices, response times and hesitation summaries;
- future-beacon rounds, randomness and signatures;
- revealed/masked condition and outcome;
- interruption, fallback and timing quality flags;
- a SHA-256 hash over the core record at export.

GitHub Pages is static and cannot create participant files in the repository. Consequently, research answers are never uploaded by this build. A future centrally recruited study needs an ethics-approved HTTPS collection backend, authenticated ingestion, retention rules, a data-management plan and a preregistered analysis.

## Confirmatory requirements

Before using FOREPATH for confirmatory inference, freeze the build and analysis plan; obtain the relevant ethics determination; run timing and browser-compatibility validation; define exclusions before collection; verify drand signatures; specify one primary endpoint; correct or preregister secondary analyses; and arrange independent replication.
