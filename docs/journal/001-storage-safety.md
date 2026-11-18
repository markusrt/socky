# Journal — 001-storage-safety

Append-only. Commands, outcomes, decisions and evidence for this feature.

## 2026-11-18 — interview round 1

Owner answers ("yes" accepts the recommendation):

| Q | Topic | Decision |
| --- | --- | --- |
| Q1 | Protect `main` | Owner set up a ruleset himself; check found it **disabled**, without PR requirement or admin bypass (reported, owner to decide on the fix) |
| Q2 | How she opens Socky | Safari tab; request permanent storage silently; tell her to keep opening it the same way (home-screen app has separate storage; Safari may clear site data after 7 days of use without a visit) |
| Q3 | Unreadable data | Keep an untouched copy; German notice "… Nichts wurde gelöscht."; "Daten kopieren"; new pair still possible |
| Q4 | Partly readable | Show good pairs, keep full original copy, notice with count |
| Q5 | Save fails | Visible "Fortschritt wurde nicht gespeichert" until a save works |
| Q6 | Acceptance | Light mode; owner accepts from reviewer screenshots + own look; knitter only confirms her pair after deploy; no export |

Known gap being fixed: `loadSessions` returns `[]` on parse failure, and the
next `upsertSession` overwrites `Socky.sessions.v1`.

`/speckit-specify` → `specs/001-storage-safety/spec.md` (US1–US4,
FR-001–FR-012, SC-001–SC-005); quality checklist passed in one pass.

Context at start of this session part: continued session (after compaction).

## 2026-11-18 — planning

- Clarify: skipped; interview Q2–Q6 settled every open point.
- `/speckit-plan` → plan.md (Light), research.md (R1–R7), data-model.md,
  contracts/storage.md, quickstart.md. Constitution check: all pass; storage
  addition gets ADR 0006.
- Tasks: T001–T014 (one C3 GATE).
- Analyze (manual coverage pass): FR-001→T004/T006, FR-002/003→T006,
  FR-004→T007/T009, FR-005/006→T007, FR-007→T009, FR-008→T006/T008,
  FR-009→T010, FR-010→T011, FR-011→T001/T004/T005/T013, FR-012→T002/T012;
  SC-001→T006/T008, SC-002/005→T013, SC-003→T007/T008, SC-004→T010. No gaps.
