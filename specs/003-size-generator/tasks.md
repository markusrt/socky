# Tasks: Size generator (size pairs as the standard)

**Input**: `specs/003-size-generator/` (spec.md, plan.md, quickstart.md)

**Delivery Mode**: Light (one C3 GATE)

## Format: `[ID] [P?] [Story] [ROUTINE?] Description`

## Phase 1: Setup

- [ ] T001 Data-safety check (P4): key unchanged; stored shape gains optional `sizeModel`, `castOnTotal`, `chartSizeLabel = ""` for new pairs, step `reduceToCastOn` with unit `rounds` and note key `note.reduce_last_round_two` → add frozen fixture `packages/web/src/storage-fixtures/sessions-v1-pairs.json` (created by the new code, one pair mid-way through counted reduce) and a test that it and every older fixture load; older fixtures untouched; record in the journal (FR-010, FR-011)

## Phase 2: Foundational

- [ ] T002 Model port `packages/shared/src/size-pairs.ts` per plan.md decision 1 (`computePair`, `tablePair`, `construction(m)`, `footCounts(pair)`, `OFFERED_PAIRS` 15/16 … 45/46, `SIZE_MODEL_VERSION`), no I/O (FR-003, FR-004, FR-005)
- [ ] T003 Frozen golden fixture `packages/shared/src/fixtures/size-pairs-v1.json` from `pairs.mjs --pair` for all 18 pairs; `size-pairs.test.ts`: every field equals the fixture, 16 rows equal Tabelle 1 transcribed in the test, her knitted/chosen pairs (17/18, 19/20, 37/38, 39/40 = 50, 45/46) exact, pairs with equal M share construction, 47/48 and 49/50 computable but not offered, M > 76 throws (FR-003, FR-004, FR-005, SC-001, SC-002)
- [ ] T004 Types and materialize: `Construction`, `SizePair` in `domain.ts`; `materializePlan(pattern, pair)` with `construction` in `SteppedPlan`; `createPairSession` stores `sizeModel`, `castOnTotal`, `chartSizeLabel = ""`; remove `ActualSizeConfig` runtime path and `ACTUAL_SIZES` seed (keep JSON files and `SIZE_CHART` as reference data); update `index.ts`, `materialize.test.ts`, `session.test.ts`, `stored-session.ts` (+ optional fields) and its test (FR-003, FR-005, FR-011)
- [ ] T005 [ROUTINE] API: `packages/api/src/index.ts` `/plans/:id` and `sessions.ts` `POST` take a pair label (zod `^\d{2}/\d{2}$`, offered pairs only, 400 otherwise); role guards unchanged; update api tests (FR-001, FR-011)

## Phase 3: User Story 1 - Start a pair by size pair (P1)

- [ ] T006 [US1] Web `NewSessionView`: select "Größe" with `OFFERED_PAIRS` as "<Paar> · <M> Maschen"; inline plan of the chosen pair (extract `PlanList` from `PreviewView`); remove home "Pläne prüfen (G1)" and the `preview` view; `sizeTitle(session)` helper for home list and knitting header (FR-001, FR-002, FR-006, FR-009, FR-012, FR-013)
- [ ] T007 [US1] [ROUTINE] Playwright in `packages/web/e2e/knitting.spec.ts`: list has exactly 16 pairs; choose 27/28 → plan shows the US1 scenario 2 counts; Starten → header "Größe 27/28 · 56 Maschen", cast-on "56 Maschen (2 Nadeln = 28 / Nadel)" (SC-001, SC-003)

## Phase 4: User Story 2 - Count the "Maschen reduzieren" rounds (P2)

- [ ] T008 [US2] Pattern `reduceToCastOn` unit `rounds`, count from the pair; note key `note.reduce_last_round_two` in `labels.ts` ("Letzte Reihe: nur 2 Maschen abnehmen") set when `heelSplit[1] % 4 !== 0`; web display "<N> Reihen · bis <M> Maschen (wie Anschlag)" for unit `rounds`, today's text and "Fertig" for unit `once`; unit tests for 37/38 (3, no note), 27/28 (3, note), 15/16 (2, note), 19/20 (2, no note) (FR-007, FR-008, FR-013)
- [ ] T009 [US2] [ROUTINE] Playwright: a pair stored at "Maschen reduzieren" (from `sessions-v1-pairs.json`) shows rounds, note and target; three "Reihe fertig" taps finish it; undo goes back one (FR-007, FR-008)

## Phase 5: User Story 3 - Saved pairs keep working (P3)

- [ ] T010 [US3] T001 fixture and tests: `storage.test.ts` loads `sessions-v1.json`, `sessions-v1-damaged.json`, `sessions-v1-pairs.json` unchanged; Playwright: old pairs show "40/41 (Tabelle 44/45)", a saved single-tap "Maschen reduzieren" still reads "Fertig"; new pairs show "<Paar> · <M> Maschen" in the same list; no notice (FR-009, FR-010, SC-004)

## Phase 6: Polish

- [ ] T011 [P] Docs: AGENTS.md knitting cheat-sheet to the pair model (pairs, M classes, reduce rounds; remove chart/trap lines that no longer apply); `docs/domain/groessenmodell.md` pointer to ADR 0007 and `report.md`; `docs/domain/gestrickte-groessen.md` note that the size JSONs are reference data
- [ ] T012 [P] [ROUTINE] Wording pass: German display text follows `docs/domain/groessenmodell.md` "Display and wording rules"; select and plan fit at Pixel 7 width

## Phase 7: Acceptance

- [ ] T013 [GATE] C3 checkpoint (owner-facing: "Ready to accept", Light, US1–US3): run `pnpm verify`; start `pnpm --filter @socky/web dev --host 127.0.0.1 --port 5173 --strictPort` and confirm the URL responds; if knitting rules or tap feel changed, include a step for the knitter (constitution amendment P2); draft the round report from docs/templates/round-report.md (≤3 owner steps); run the `reviewer` subagent (code review plus walk-through of the owner steps with screenshots) and fix blockers; save the report as specs/003-size-generator/review/round-<k>.md; update docs/STATUS.md (checkpoint, round counter, next action) and the spec in the same commit, and append evidence to docs/journal/003-size-generator.md; commit; post the report in chat; then **STOP** and wait for an explicit owner decision. Never mark accepted without a recorded owner decision. After acceptance: write the retro entry (docs/retro.md) and offer to send it upstream.

## Dependencies & Execution Order

- T001 → T002 → T003 → T004 → T005 ∥ US1 (T006 → T007) → US2 (T008 → T009) → US3 (T010) → T011 ∥ T012 → T013
- T001's fixture is created after T004/T008 produce the new shape (write it once, then freeze)
- GATE T013 blocks publishing; the PR waits for the knitter's try-out (Q7)

## Notes

- Never edit `storage-fixtures/*.json` or `fixtures/size-pairs-v1.json` after creation (P4, P1).
- Commit each finished story as one slice.
