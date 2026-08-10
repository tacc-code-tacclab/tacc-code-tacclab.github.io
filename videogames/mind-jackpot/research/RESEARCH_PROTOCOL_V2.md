# MIND JACKPOT 2.0 — protocol and analysis plan

Protocol version: `mind-jackpot-2.0.0`  
Primary endpoint: position-specific symbol matches in rounds 1–40 (120 Bernoulli trials per completed session)  
Chance probability: `1/6` per position  
Optional endpoint: rounds 41–60, reported separately

## Scope and governance

This repository contains a technically auditable data-collection and analysis protocol. Publishing software is not the same as obtaining research-ethics approval. Before public recruitment or claims in an article, the investigator remains responsible for institutional ethics review, the final participant-information sheet, lawful data-processing documentation, a retention/deletion policy, preregistration and sample-size justification.

The interface must never tell a participant that a single score demonstrates an ability. Automated and manuscript reporting uses the terms “above-chance performance,” “exploratory candidate” and “prospective confirmation”; it must not state that someone “has premonitions.”

## What exists before a participant plays

The private Supabase database contains a bank of 1,024 decks. Each deck contains 180 symbol indices: three targets for each of 60 rounds. The complete bank is generated before activation of protocol 2.0.

For every deck:

1. PostgreSQL `pgcrypto.gen_random_bytes` produces cryptographically secure random bytes.
2. Bytes from 252 through 255 are rejected.
3. Every accepted byte is mapped to a symbol with `byte mod 6`.
4. Rejection is necessary because 252 is divisible by six; therefore every symbol receives exactly 42 possible byte values and modulo bias is absent.
5. A 256-bit salt and a canonical payload produce the deck’s SHA-256 commitment.

The canonical deck payload is:

```text
mind-jackpot-deck-2.0::<bank UUID>::<deck number>::<64-hex salt>::<180 comma-separated indices>::<asset-manifest SHA-256>
```

The public file `precommitment-v2.json` contains the ordered list of deck commitments, the bank root, timestamps, the symbol-manifest hash and the precise root algorithm. The root is SHA-256 over the UTF-8 string formed by joining these lines with a single LF and no final LF:

```text
1:<deck 1 commitment>
2:<deck 2 commitment>
...
```

The private targets and salts are not included. Git history provides independently inspectable evidence that the commitment list preceded protocol-2.0 observations. Database guards prevent a sealed bank, deck, assignment, trial or audit event from being edited or deleted through the application role. A database administrator remains technically powerful; the externally published commitments make any later target alteration detectable.

## Symbol identity

Targets and predictions are integers 0–5. Their meanings are fixed by `asset-manifest-v2.json`. The manifest and each SVG are hashed. At page load, the browser downloads the files as bytes, verifies all hashes with Web Crypto and renders blob URLs made from those verified bytes. A session cannot be created if verification fails.

This prevents an unnoticed later swap of symbol labels or image bytes. It does not claim that images themselves are random; the random variable is the pre-generated symbol index.

## Prediction-before-reveal order

The browser never receives a future deck. For each round it sends three predicted indices and the round number to the Edge Function. In one locked database transaction, the server:

1. authenticates a 256-bit per-session secret by its SHA-256 hash;
2. verifies that this is exactly the next round;
3. inserts the prediction and server lock timestamp into an append-only trial record together with the corresponding private target;
4. commits the transaction;
5. returns only that round’s target.

Retries with the same prediction are idempotent. A retry with a different prediction is rejected. No offline or client-generated outcome is accepted. On completion, the server releases the salt and full deck so the browser or a reviewer can recompute the commitment and compare every revealed target.

## Inclusion and separation from the legacy pilot

The primary protocol-2.0 population contains every non-test session with:

- protocol version `mind-jackpot-2.0.0`;
- successful asset verification;
- all 40 primary rounds recorded by the server.

All version-1.x sessions and trials are retained as a technical legacy pilot and counted separately. They are never pooled into the protocol-2.0 primary inference.

## Population analysis

Let `K` be the sum of primary position matches across eligible sessions and `N` the number of eligible sessions multiplied by 120. The report provides:

- participant and session counts, recruitment and attrition;
- observed rate `K/N`, chance rate `1/6`, expected and excess matches;
- a two-sided 95% Wilson confidence interval for the observed rate;
- the prespecified exact one-sided binomial tail `P[X ≥ K]`, where `X ~ Binomial(N, 1/6)`.

The one-sided direction is above chance. A result below chance is descriptive and is not converted into a post-hoc lower-tail claim. Repeated predictions and adaptive choices do not change the conditional `1/6` target probability when the server targets remain independent, but dependence caused by data-quality failures must be investigated with randomisation diagnostics and sensitivity analyses.

The report may say that the sample is or is not detectably above chance. It must not infer that the average participant has, or lacks, a metaphysical capacity.

## Individual discovery and prospective confirmation

Individual inference deliberately separates selection from confirmation:

1. Only the first completed primary session for a nickname hash is used for discovery.
2. A one-sided exact binomial value of `p ≤ 0.01` flags an **exploratory candidate**. This is a screening label, not evidence of an ability.
3. Only sessions created after the server flag timestamp can enter confirmation.
4. At least two completed prospective sessions are required.
5. A post-flag session that remains incomplete for more than 24 hours invalidates the automated confirmation label, guarding against selective abandonment.
6. Raw confirmation p-values are corrected across all candidate tests performed in that report with the Holm procedure.
7. `Holm p ≤ 0.05`, an observed rate above `1/6`, and all preceding validity conditions yield the wording **prospectively above chance**. Otherwise the status is “awaiting confirmation,” “confirmation invalid because of an incomplete session,” or “no confirmatory evidence.”

Nickname hashes do not prove human identity. A participant can deliberately choose another nickname, automate requests or share a nickname. Strong individual claims therefore require supervised identity control and an independently preregistered replication outside this unsupervised web protocol.

## Participant descriptives and contextual variables

For eligible primary sessions the automated snapshot tabulates age band, gender, alertness, sleep quality, prior belief, alcohol in the previous 12 hours, recreational/psychoactive substances, attention-affecting medication, caffeine, physical company, observer attention and relationship, gaming, gambling and prior participation.

Candidate summaries use only a generated participant code and those categories. They exclude the local nickname, session secret and unrevealed deck. Small cells must be suppressed in emailed prose. Associations with alcohol, substances, company or any other context are exploratory, non-causal and should not be tested or narrated when group sizes are too small. A confirmatory moderator analysis requires a separate preregistration and appropriate participant-level modelling.

## Randomisation quality control

The report counts target and prediction indices. These diagnostics can find implementation errors, missing symbols or gross imbalance. They cannot prove randomness. The reproducible evidence for reviewers is the combination of:

- a standard operating-system-backed CSPRNG (`pgcrypto`);
- unbiased rejection sampling visible in the SQL source;
- generation before protocol activation;
- externally published commitments and Git timestamps;
- private future targets;
- server-side prediction-before-reveal transactions;
- immutable application audit records;
- end-of-session commitment verification.

No paid external randomness service is needed. A public randomness beacon could be added for a different threat model—principally mistrust of the server administrator—but it is not required to prevent participants from learning a pseudorandom pattern.

## Automated reporting

The database function `mj_v2_report_snapshot()` emits a privacy-minimised JSON snapshot containing the fixed analysis policy, recruitment, attrition, descriptives, population statistics, candidate confirmation states, randomisation diagnostics, legacy exclusions and bank audit metadata. The scheduled report converts this snapshot into a concise Italian email every 14 days. If no new eligible data exist, it sends a short status message rather than inventing an inference.

## Known limitations

- Unsupervised pseudonyms do not establish unique participants.
- Public endpoints remain vulnerable to motivated automation or denial-of-service; such activity is auditable but not fully prevented by cryptography.
- Immediate feedback can change later predictions and engagement.
- Questionnaire categories are self-report and can be inaccurate.
- Multiple sessions per participant require participant-level sensitivity analyses for population inference once repeats are material.
- The commitment proves non-alteration relative to the published hash; it does not prove who generated the bank or eliminate the need for independent replication.

## Reproduction

Run `node research/verify-precommitment.mjs` from the game directory to verify the symbol files, manifest and bank root. Add the path of a completed participant JSON to verify the assigned deck and every revealed round:

```bash
node research/verify-precommitment.mjs MIND_JACKPOT_MJ2-XXXXXXXXXXXXXXX_complete.json
```

