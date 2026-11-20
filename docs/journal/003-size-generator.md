# Journal — 003-size-generator

Append-only. Commands, outcomes, decisions and evidence for this feature.

## 2026-11-19 — interview (rounds 1–2)

Context at start: fresh session after `/clear`.

Owner answers (round 1 Q1–Q7, round 2 Q8):

| Q | Topic | Decision |
| --- | --- | --- |
| Q1 | Pairs the standard (P1) | Yes; no "berechnet"/"gestrickt" distinction in the app, history stays in research 002 |
| Q2 | Size list | Pairs only, with stitch count; the five old sizes are removed ("we rather iterate on experiments with the new sizes") |
| Q3 | Knittable now | Research 002 == acceptance |
| Q4 | 47/48, 49/50 | Hidden; computable later |
| Q5 | Count "Maschen reduzieren" | Yes, with the 2-stitch note; "no pair in progress support needed" (read back as: saved pairs keep working, no conversion) |
| Q6 | Adjust counts | No, not in this feature (M3) |
| Q7 | Timing | One round; 27/28 not started; change waits on the PR until she tried it |
| Q8 | Amend P1, P3 | Yes, as worded → constitution 2.0.0, ADR 0007 |

## 2026-11-19 — planning

- `/speckit-constitution` (project amendments only): P1 and P3 redefined,
  version 1.0.0 → 2.0.0 (MAJOR: principle redefinition); ADR 0007.
- `/speckit-specify` → spec.md (US1–US3, FR-001–FR-013, SC-001–SC-005);
  checklist passed in one pass. Clarify: skipped, interview settled all points.
- `/speckit-plan` → plan.md (Light; design decisions 1–10 serve as data model),
  quickstart.md. Constitution check: all pass.
- `/speckit-tasks` → T001–T013 (one C3 GATE).
- Analyze (manual coverage pass): FR-001→T005/T006, FR-002→T006,
  FR-003/004→T002/T003, FR-005→T002–T004, FR-006→T006, FR-007/008→T008/T009,
  FR-009→T006/T010, FR-010→T001/T010, FR-011→T001/T004/T005, FR-012→T006,
  FR-013→T006/T008/T012; SC-001/002→T003/T007, SC-003→T007, SC-004→T010,
  SC-005→T013. No gaps. Note: T001's fixture can only be written after
  T004/T008 produce the new shape (recorded in tasks.md order).

## 2026-11-20 — plan review by the owner (technical experience)

- Override 1: "Maschen reduzieren" shows Reihen, not Runden ("3 Reihen · bis 56
  Maschen (wie Anschlag)", "Letzte Reihe: nur 2 Maschen abnehmen"), button
  "Reihe fertig". Folded into spec Clarifications, FR-007/008, plan, tasks,
  quickstart. Spec fix: the note applies to 15/16 and 21/22 … 27/28 (17/18
  and 19/20 have middle 8).
- Choice 2 (inline plan on "Neue Socke"): yes.
- Open, non-blocking: does "always Reihen" also change the tip header
  ("Bandspitze · Runde 1 von 3")? Kept as is until the owner says otherwise.
- Owner: "Yes toe wording is fine" → tip keeps "Runden" headers.

## 2026-11-20 — implementation (T001–T011)

- T002/T003: `size-pairs.ts` ports `pairs.mjs` (fits computed at load from
  the same `KNITTED` data). Golden `fixtures/size-pairs-v1.json` generated with
  `node specs/002-sizing-research/pairs.mjs --pair <p>` for all 18 pairs, then
  frozen; `size-pairs.test.ts` checks it field by field, the 16 Tabelle 1 rows
  transcribed by hand, her knitted sizes (`size-18/37-38/50-51.json` counts),
  P3 (25/26 and 27/28 share construction), 47/48 = 66 and 49/50 = 71 foot rows
  not offered, and rejects non-pairs. All passed on the first run.
- T004: `materializePlan(pattern, pair)`, `SteppedPlan.construction`;
  `ActualSizeConfig`/`ACTUAL_SIZES` removed from the runtime; size JSONs and
  `SIZE_CHART` stay as reference data. New sessions: `chartSizeLabel ""`,
  `sizeModel "pairs-v1"`, `castOnTotal`; schema adds both as optional.
- T005: API `/preview/plan/:lo/:hi` and `POST /api/sessions {pair}` (zod
  regex + offered pairs only; 404 otherwise); auth guard unchanged (401 test).
  Limit: D1 does not persist `sizeModel`/`castOnTotal` yet (API not deployed;
  M3 work).
- T001/T010 data safety: key unchanged; old fixtures untouched (`git diff`
  shows no change under `storage-fixtures/` except the new file). New frozen
  fixture `sessions-v1-pairs.json` generated 2026-11-20 from the new code
  (vitest run from the scratchpad: 27/28, sock 1, reduce 1 of 3).
  `storage.test.ts`: old fixture's reduce stays `once`; pairs fixture loads
  with no notice; both shapes load together. US3 scenario 2 ("Fertig" on a
  saved single-tap reduce) is covered by the unit test of the stored unit plus
  the unchanged `once` → "Fertig" rule; no stored fixture is parked on that
  step, so no Playwright check of the button text.
- T006–T009: "Neue Socke" select "Größe" (16 pairs, "27/28 · 56 Maschen"),
  inline plan (`PlanList`), home "Pläne prüfen (G1)" and the preview view
  removed; `sizeTitle` for header/list; reduce line "3 Reihen · bis 56
  Maschen (wie Anschlag)" + note; new `e2e/size-pairs.spec.ts` (4 tests ×
  desktop/phone).
- T011: AGENTS cheat-sheet, `groessenmodell.md` banner, `gestrickte-groessen.md`
  note.
- `pnpm verify` (2026-11-20): exit 0 — lint, typecheck, dep:cruise (no
  violations, 64 modules), shared 109, web 22, api 11 tests, Playwright 28
  passed (desktop + Pixel 7). One earlier run failed on Biome formatting only;
  fixed with `biome check --write`.
