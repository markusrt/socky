# ADR 0007 — Size pairs are the standard; amend P1 and P3

## Status

Accepted (2026-11-19) — owner interview for `003-size-generator`, Q1–Q5 and Q8

## Context

- `specs/002-sizing-research` produced a sizing model by size pair
  (15/16 … 49/50, each made for its larger size): the pair chooses the cast-on
  M, M chooses the construction, the pair's foot length chooses the plain-foot
  rows. The knitter accepted the resulting table in round 3 (r18–r26).
- Constitution amendment P1 (1.0.0) treated every computed count as a proposal,
  marked "berechnet" in the app and knittable only after she accepts each size,
  and left "promoting a research-based model to the standard" to a future ADR.
- Amendment P3 (1.0.0) tied construction to a REGIA chart base size and foot
  rows to an actual size. The pair model has no chart base size: construction
  follows from M.
- The app offered five hand-entered sizes (15, 18, 37/38, 40/41, 50/51), each
  with a REGIA chart label.

## Decision

1. **The pair model is Socky's standard.** The size list is the pairs
   15/16 … 45/46, values from her choice, else her knitted pair, else computed
   (`specs/002-sizing-research/report.md`). 47/48 and 49/50 stay computable but
   are not offered until she decides on them (r25).
2. **Research 002 is her acceptance.** The app shows no "berechnet" or
   "gestrickt" marking; the research record keeps which values are knitted,
   chosen or computed. A later change to the model's rules or constants is a
   proposal she accepts in a review round (P2) before it ships.
3. **The five old sizes leave the size list.** Pairs already saved with them
   keep loading and counting unchanged (P4); calculation errors are fixed by
   iterating on the pairs.
4. **P3 becomes "construction class ≠ foot size":** M drives Aufteilung,
   Ferse, aufnehmen and the tip; the pair drives plain-foot rows. The REGIA
   chart is a historical reference.
5. Constitution 1.0.0 → 2.0.0 (P1 and P3 redefined).

## Consequences

- `packages/shared` gets a pair generator that reproduces the accepted table
  (tests against `vergleich-paare-de.md`); the hand-entered size configs and
  the chart-size lookup stop feeding new pairs.
- Stored pairs keep `chartSizeLabel`/`actualSizeLabel`; new pairs need a value
  for `chartSizeLabel` that the schema accepts (decided in the 003 plan).
- Fixing the model means a new research round and her acceptance, not a hand
  edit of a single size.
- Rejected: keep the old sizes as a second group (owner: iterate on pairs
  instead); per-size acceptance in the app (owner: 002 is the acceptance).
