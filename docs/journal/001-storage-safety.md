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
