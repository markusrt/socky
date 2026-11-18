# Tasks: Sizing research

**Input**: `specs/002-sizing-research/` (spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md)

**Delivery Mode**: Spike (one C1 GATE with go/no-go)

## Format: `[ID] [P?] [Story] [ROUTINE?] Description`

## Phase 1: Setup

- [x] T001 Data-safety check: does this feature change the stored-session key, its shape, stored step/note keys, or the deploy origin? If yes, add a frozen fixture for the new format and a test that every older fixture still loads (packages/web/src/storage.test.ts); if no, record "no stored-data impact" in the journal (FR-011)

## Phase 2: User Story 1 - Her knitted sizes as data (P1)

- [x] T002 [US1] Transcribe the five new notes from the owner's private folder and merge them with `docs/domain/vergleich-sock-*.md` and `packages/shared/data/actual-sizes/*.json` into `docs/domain/gestrickte-groessen.md` per data-model.md (counts and key points only, no names; 30/31-chart note marked uncertain; conflicts listed as questions for her) (FR-001, FR-002, SC-001)
- [x] T003 [US1] Lead check of T002: every number traced to its source; privacy grep for names and raw note text (FR-001, FR-012)

## Phase 3: User Stories 2 + 3 - Model and foot data (P1/P2)

- [x] T004 [US3] Research agent (Fable): public foot-length-per-EU-size data and baby/child/adult differences (length, girth), cited; generic queries only (FR-007, FR-012, SC-004)
- [x] T005 [US2] Research agent: derive rows/cm and stitch assumptions from her data (FR-008) and written rules for every count (FR-003, FR-004, FR-005); size-15 overrides and tip schedule handled (spec Edge Cases)
- [x] T006 [US2] Research agent: `specs/002-sizing-research/model.mjs` (Node, no deps) printing the EU 15–51 table and the test-case check with match/deviation per count, exit 1 on an unexplained deviation (FR-006, SC-001, SC-002, SC-003)
- [x] T007 [US2] Lead review of T004–T006: run `node specs/002-sizing-research/model.mjs`, re-check test cases against `docs/domain/gestrickte-groessen.md`, check monotonic/validation rules from data-model.md; `pnpm exec biome check specs/002-sizing-research`

## Phase 4: User Story 4 - Report and German table (P1)

- [x] T008 [US4] `specs/002-sizing-research/report.md`: method, sources, rules, density assumptions and sensitivity, test-case results, foot-data comparison, go/no-go recommendation for 003, open questions for her (FR-008, FR-010, SC-004)
- [x] T009 [US4] `specs/002-sizing-research/vergleich-de.md`: German table Größe | ihre Werte | berechnet | Abweichung, every proposal marked "berechnet", a column for "passt / passt nicht / weiß nicht" (FR-009, SC-005)

### Round 3 (feedback round 2, same C1 checkpoint)

- [x] T011 Record feedback r01–r14 in `specs/002-sizing-research/feedback/round-2.md`; STATUS counters; spec `## Clarifications` (FR-013–FR-015)
- [x] T012 [US2] `specs/002-sizing-research/pairs.mjs`: pair proposals P1–P6 with her gauge, test pairs within ±2 foot rows, sole length grows with size (FR-013, FR-014, SC-002)
- [x] T013 [US3] Report section 13: common size pairs [S11][S12], gauge check, rules P1–P6, results, open questions (FR-014, SC-004)
- [x] T014 [US4] `specs/002-sizing-research/vergleich-paare-de.md` (plus a Word copy for her): pair table and gauge table, "berechnet", verdict column, six questions (FR-015, SC-005)
- [x] T015 `docs/domain/gestrickte-groessen.md`: her round-2 answers as key points (FR-001)

GATE T010 below is repeated for round 3 (same procedure, report `review/round-3.md`).

### C1 GATE

- [ ] T010 [GATE] C1 checkpoint (owner-facing: "First working slice", Spike): run `pnpm verify`; start `pnpm --filter @socky/web dev --host 127.0.0.1 --port 5173 --strictPort` and confirm the URL responds; if knitting rules or tap feel changed, include a step for the knitter (constitution amendment P2); draft the round report from docs/templates/round-report.md (≤3 owner steps); run the `reviewer` subagent (code review plus walk-through of the owner steps with screenshots) and fix blockers; save the report as specs/002-sizing-research/review/round-<k>.md; update docs/STATUS.md (checkpoint, round counter, next action) and the spec in the same commit, and append evidence to docs/journal/002-sizing-research.md; record the go/no-go result and its evidence; commit; post the report in chat; then **STOP** and wait for an explicit owner decision. Do not start later phases until docs/STATUS.md records approval. (SC-006)

## Dependencies & Execution Order

- T001 → T002 → T003 → T004 ∥ T005 → T006 → T007 → T008 ∥ T009 → T010
- T004 can start right after T001 (no dependency on the data set)
- GATE T010 blocks everything after it

## Notes

- No task touches `packages/` (FR-011).
- The C1 knitter step: read `vergleich-de.md` and mark each size; the owner
  can also hand her the table on paper.
