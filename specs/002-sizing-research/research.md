# Research decisions: Sizing research (plan level)

> Superseded for the model by `report.md` and `pairs.mjs` (size pairs, round 3). The
> round-2 files named below are in git at `0013eac`.

How the spike is run. The spike's findings go to `report.md`.

## D1 — Who does the research

- **Decision**: a separate research agent on the Fable model gathers foot
  data, fits the rules and drafts the deliverables; the lead checks every
  number against the notes and size files before the round.
- **Rationale**: owner decision (2026-11-14); keeps raw-note reading local and
  the lead's review independent.
- **Alternatives**: lead does everything (more context in the main session).

## D2 — Data set first, from three sources

- **Decision**: one table from (a) her new handwritten notes, (b) the earlier
  notes already summarized in `docs/domain/vergleich-sock-*.md`, (c) the
  actual-size files in `packages/shared/data/actual-sizes/`. Conflicts are
  listed, not resolved.
- **Rationale**: P1; the app's size files are what she knits from today.

## D3 — Model shape: written rules plus a reproducible script

- **Decision**: rules written in `report.md` (readable by hand) and the same
  rules in `model.mjs`, a dependency-free Node script that prints the
  proposal table for EU 15–50/51 and checks the test cases.
- **Rationale**: SC-001/SC-003 need a repeatable check; a script in the feature
  directory is research evidence, not product code, and 003 can port it.
- **Alternatives**: spreadsheet (not diffable), code in `packages/shared`
  (violates FR-011, belongs to 003).

## D4 — Inputs: shoe size to foot length

- **Decision**: the research picks and cites one EU shoe-size-to-foot-length
  conversion (and child/adult differences); a measured length overrides it
  for length-dependent counts (FR-004).
- **Rationale**: owner decision Q9.

## D5 — Uncertain and range sizes

- **Decision**: the 30/31-chart note for actual 24 is shown but excluded from
  fitting; ranges (19-20, 43-45) and "circa 17" use a stated single foot
  length.
- **Rationale**: spec Edge Cases; owner Q7.

## D6 — Privacy

- **Decision**: web queries contain only generic terms (shoe sizes, foot
  length, knitting gauge); the transcription has counts and knitting key
  points only, no names, no ages tied to people.
- **Rationale**: FR-001, FR-012, P10.
