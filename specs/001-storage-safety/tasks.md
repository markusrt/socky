# Tasks: Storage safety

**Input**: `specs/001-storage-safety/` (spec.md, plan.md, research.md, data-model.md, contracts/storage.md, quickstart.md)

**Delivery Mode**: Light (one C3 GATE)

## Format: `[ID] [P?] [Story] [ROUTINE?] Description`

## Phase 1: Setup

- [x] T001 Data-safety check: does this feature change the stored-session key, its shape, stored step/note keys, or the deploy origin? If yes, add a frozen fixture for the new format and a test that every older fixture still loads (packages/web/src/storage.test.ts); if no, record "no stored-data impact" in the journal. (Here: key and shape unchanged; NEW key prefix `Socky.unreadable.v1.` → frozen fixtures `sessions-v1-damaged.json` and `unreadable-copy-v1.json`; `sessions-v1.json` untouched) (FR-011)
- [x] T002 [ROUTINE] Add the German display strings (notice texts, "Daten kopieren", "Kopiert", "Ausblenden", "Fortschritt wurde nicht gespeichert") to the web component per plan.md (FR-012)
- [x] T003 ADR `docs/adr/0006-preserve-unreadable-stored-data.md`: preserved-copy key, write-block rule, schema-for-checking-only (P13)

## Phase 2: Foundational

- [x] T004 Stored-pair schema `packages/shared/src/stored-session.ts` + `stored-session.test.ts` per data-model.md; frozen `sessions-v1.json` passes unchanged; export from `packages/shared/src/index.ts` (FR-001, FR-011)

## Phase 3: User Story 1 - Unreadable data kept and recoverable (P1)

- [x] T005 [US1] Frozen fixtures `packages/web/src/storage-fixtures/sessions-v1-damaged.json` and `unreadable-copy-v1.json` (generated once, then never edited) (FR-011)
- [x] T006 [US1] `packages/web/src/storage.ts` per contracts/storage.md: load result with preservation before any save, write-block when preservation fails, `dismissUnreadable`; unit tests in `storage.test.ts` for: cut-off text, not an array, unknown shape, preservation failure, repeated finding keeps both copies, existing tests unchanged (FR-001, FR-002, FR-003, FR-008, SC-001)
- [x] T007 [US1] `packages/web/src/StorageNotice.tsx` + `App.tsx` wiring: unreadable notice, "Daten kopieren" with confirmation and textarea fallback, "Ausblenden" (FR-004, FR-005, FR-006, SC-003)
- [x] T008 [US1] Playwright `packages/web/e2e/storage-safety.spec.ts`: unreadable data → notice → copy → new pair → reload → copy still stored; dismiss → reload → no notice, copy still stored (US1 scenarios 1–4, SC-001, SC-003)

## Phase 4: User Story 2 - Damaged pairs do not hide good pairs (P2)

- [x] T009 [US2] Load keeps readable pairs and counts damaged ones; notice names the count ("1 Strickstand" / "N Strickstände"); unit test + Playwright case with `sessions-v1-damaged.json`: good pairs resume with unchanged progress, counting a row keeps the full original in the preserved copy (FR-004, FR-007, US2 scenarios 1–3)

## Phase 5: User Story 3 - Failed saves are visible (P3)

- [x] T010 [US3] `saveSessions`/`upsertSession` return a save result; `App.tsx` keeps on-screen progress and shows "Fortschritt wurde nicht gespeichert" until the next successful save; unit test with a throwing storage; Playwright case making writes throw then succeed (FR-009, SC-004, US3 scenarios 1–3)

## Phase 6: User Story 4 - Persistent storage request (P3)

- [x] T011 [US4] [ROUTINE] `requestPersistentStorage()` in `storage.ts` called once from `packages/web/src/main.tsx`; fire-and-forget, errors ignored; unit test that it tolerates missing `navigator.storage` and a rejected promise (FR-010)

## Phase 7: Polish & Acceptance (C3)

- [x] T012 [P] [ROUTINE] Wording pass: German display text follows docs/domain/groessenmodell.md "Display and wording rules"; layouts tolerate longer text at mobile width (FR-012)
- [x] T013 Regression: existing `knitting.spec.ts` and the four original storage tests pass unchanged; normal counting shows no notice (SC-002, SC-005)
- [x] T014 [GATE] C3 checkpoint (owner-facing: "Ready to accept", Light, US1–US4): run `pnpm verify`; start `pnpm --filter @socky/web dev --host 127.0.0.1 --port 5173 --strictPort` and confirm the URL responds; if knitting rules or tap feel changed, include a step for the knitter (constitution amendment P2); draft the round report from docs/templates/round-report.md (≤3 owner steps); run the `reviewer` subagent (code review plus walk-through of the owner steps with screenshots) and fix blockers; save the report as specs/001-storage-safety/review/round-<k>.md; update docs/STATUS.md (checkpoint, round counter, next action) and the spec in the same commit, and append evidence to docs/journal/001-storage-safety.md; commit; post the report in chat; then **STOP** and wait for an explicit owner decision. Never mark accepted without a recorded owner decision. After acceptance: write the retro entry (docs/retro.md) and offer to send it upstream.

## Dependencies & Execution Order

- T001–T003 → T004 → US1 (T005 → T006 → T007 → T008) → US2 (T009) → US3 (T010) → US4 (T011) → T012 ∥ T013 → T014
- T011 is independent of US1–US3 and may run any time after T004
- GATE T014 blocks publishing

## Notes

- Never edit `storage-fixtures/*.json` after creation (P4).
- Commit each finished story as one slice.
