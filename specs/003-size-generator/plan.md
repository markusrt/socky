# Implementation Plan: Size generator (size pairs as the standard)

**Branch**: `003-size-generator` | **Date**: 2026-11-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-size-generator/spec.md`

**Delivery mode**: Light — the model already exists and was accepted (002); the
risk is a porting or wiring error, which golden tests catch inside the slice.
One C3 GATE with the knitter's try-out (P2); the PR waits for her result (Q7).

## Summary

Port the accepted size-pair model (`specs/002-sizing-research/pairs.mjs`) to
`packages/shared` as a pure TypeScript module that turns a pair (15/16 …
49/50) into a construction class (by M) plus foot counts, with the precedence
her choice > her knitted pair > computed. A frozen golden fixture generated
from `pairs.mjs` proves every count equals the accepted table. `materializePlan`
takes this pair instead of a REGIA chart label; "Maschen reduzieren" becomes a
counted step for new pairs. The web "Neue Socke" screen offers the 16 pairs
15/16 … 45/46 and shows the chosen pair's plan inline; the former five sizes
leave the list. Saved pairs are self-contained and keep loading unchanged.

## Technical Context

**Language/Version**: TypeScript 6 (strict, `exactOptionalPropertyTypes`), React 19, Vite 8

**Primary Dependencies**: none new (zod 4 already in `@socky/shared`)

**Storage**: localStorage `Socky.sessions.v1` unchanged key; new pairs add two optional fields (`sizeModel`, `castOnTotal`); old shape untouched

**Testing**: Vitest (model vs golden fixture, materialize/session, stored-session schema on a new frozen fixture), Playwright desktop + Pixel 7 (start 27/28, counted reduce, old fixture labels)

**Target Platform**: iOS Safari (live knitter), desktop Chrome

**Project Type**: existing pnpm monorepo (shared domain, web UI, api not deployed)

**Performance Goals**: none beyond today (16 pairs computed on demand, microseconds)

**Constraints**: P1/P3 (amended, ADR 0007), P4 (saved pairs, frozen fixtures), P9 (German UI), P11 (tap behavior), dependency-cruiser boundaries (`shared` has no I/O)

**Scale/Scope**: 16 offered pairs, 18 computable; one user's browser

## Constitution Check

| Rule | Check | Result |
| --- | --- | --- |
| A–D owner loop | One round with German try-out steps; technical choices reported, not asked | Pass |
| P1 domain authority (2.0.0) | Model = accepted 002 model; golden fixture from `pairs.mjs`; no hand-invented counts; no "berechnet" marking | Pass |
| P2 knitter accepts | GATE requires her try-out result (counted reduce, 27/28 counts) | Pass |
| P3 construction ≠ foot size | `Construction` (by M) and `FootCounts` (by pair) are separate types and functions; tests cover both and that pairs with equal M share construction | Pass |
| P4 work in progress | Key, old shape and fixtures unchanged; new optional fields; new frozen fixture `sessions-v1-pairs.json`; schema accepts both | Pass |
| P5 strict | No `any`; model is pure typed functions | Pass |
| P6 tests prove domain | Model, materialize, session, schema unit-tested; Playwright golden path updated | Pass |
| P9 German UI / English code | Labels in `labels.ts`; identifiers English | Pass |
| P11 one tap = one row | Reduce gets one tap per round; other steps unchanged | Pass |
| P13 decisions recorded | ADR 0007 (pairs standard, P1/P3) | Pass |

Re-checked after design: pass, no violations.

## Design decisions

1. **Model module** `packages/shared/src/size-pairs.ts`: port of `pairs.mjs`
   (inputs `KNITTED`, `CHOSEN`, gauge 5.2 rounds/cm, `footLength`, stitch
   bands, Aufteilung table, tip, leg, postJoin, gusset, least-squares cuff fit,
   length-share fit, `computePair`, `tablePair`). Fits are computed from the
   same data at module load, exactly as the script does, so a future refit is a
   data change, not a constant edit. Above 76 stitches it throws (as the script).
   `SIZE_MODEL_VERSION = "pairs-v1"`.
2. **Golden fixture** `packages/shared/src/fixtures/size-pairs-v1.json`,
   generated once from `node specs/002-sizing-research/pairs.mjs --pair <p>` for
   all 18 pairs and frozen; the test compares every field of `tablePair` with it.
   A second test checks 16 rows against Tabelle 1 values transcribed in the test
   (independent of the script). Never edited to make a test pass.
3. **Types** (`domain.ts`): `Construction { castOnTotal, castOnPerNeedle2,
   heelHeightRows, heelSplit, pickupStitchesBothSides, tipSchedule }`,
   `SizePair { label, lo, hi, construction, counts: { cuff, leg, heel, postJoin,
   reduceToCastOn, plainFoot } }`. `SteppedPlan.chart: ChartSize` becomes
   `construction: Construction` plus `sizeLabel`; `chartSizeLabel` leaves the
   plan.
4. **Materialize**: `materializePlan(pattern, pair: SizePair)`; tip rounds from
   `deriveTipRounds(construction.tipSchedule)`. `ActualSizeConfig`, the
   `ACTUAL_SIZES` seed and its JSON loader leave the runtime; the five JSON files
   and `SIZE_CHART` stay as historical reference data (docs link to them) and
   are used only by a test that her knitted sizes match their pairs (SC-002).
5. **Pattern**: `reduceToCastOn` becomes `unit: "rounds"`, count from the pair;
   new technique note key `note.reduce_last_row_two` = "Letzte Reihe: nur 2
   Maschen abnehmen", set on the step when `heelSplit[1] % 4 !== 0`.
6. **Session shape** (new pairs only): `actualSizeLabel = "27/28"`,
   `chartSizeLabel = ""` (schema field stays required; empty = no chart),
   new optional `sizeModel: "pairs-v1"` and `castOnTotal: 56`. Display helper
   `sizeTitle(session)`: with `sizeModel` → "27/28 · 56 Maschen", else
   "40/41 (Tabelle 44/45)". The stored-session schema adds both fields as
   optional; older shapes unchanged.
7. **Reduce display**: unit `rounds` on `reduceToCastOn` → "<N> Reihen · bis
   <M> Maschen (wie Anschlag)", button "Reihe fertig" (same as tip rows, where
   each tap is one round); unit `once` (saved pairs) → today's text and "Fertig".
8. **Web**: `NewSessionView` lists `OFFERED_PAIRS` (15/16 … 45/46) as
   "<Paar> · <M> Maschen", label "Größe", preselected 15/16 (the first pair);
   the plan of the chosen pair renders below (extract today's
   `PreviewView` body into `PlanList`). Home "Pläne prüfen (G1)" and the
   `preview` view are removed.
9. **API** (not deployed): `/plans/:id` and `POST /sessions` take a pair label
   (`zod` regex `^\d{2}/\d{2}$`, offered pairs only); role guards unchanged;
   tests updated.
10. **Docs**: AGENTS knitting cheat-sheet and `docs/domain/groessenmodell.md`
    pointer updated to the pair model in the same change as the code.

## Project Structure

### Documentation (this feature)

```text
specs/003-size-generator/
├── spec.md
├── plan.md            # this file (design decisions above serve as data model)
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
packages/shared/src/
├── size-pairs.ts              # new: model port
├── size-pairs.test.ts         # new: golden + Tabelle 1 + P3 + knitted sizes
├── fixtures/size-pairs-v1.json# new: frozen golden from pairs.mjs
├── fixtures/pattern-seed.ts   # reduce rounds; ACTUAL_SIZES removed
├── domain.ts, materialize.ts, session.ts, labels.ts, stored-session.ts, index.ts
packages/web/src/
├── App.tsx                    # size list, inline plan, labels, reduce display
├── storage-fixtures/sessions-v1-pairs.json  # new frozen fixture (new shape)
├── storage.test.ts
packages/web/e2e/knitting.spec.ts
packages/api/src/index.ts, sessions.ts (+ tests)
```

**Structure Decision**: existing monorepo; the model is pure domain code in
`packages/shared` (no I/O), consumed by web and api.

## Complexity Tracking

None.
