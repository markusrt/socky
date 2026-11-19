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

## 2026-11-18 — implementation (T001–T013)

- Owner "yes" (Q13 + plan): `main` ruleset 27524431 set to **active** via
  `gh api -X PUT`, rules now deletion, non_fast_forward,
  required_linear_history, required_status_checks
  ("lint · typecheck · deps · test · e2e"), pull_request (0 approvals,
  squash/rebase); bypass: repository admin role, always.
- T001: stored key and `PairSession` shape unchanged; new key prefix
  `Socky.unreadable.v1.` → frozen fixtures `sessions-v1-damaged.json`
  (fixture pairs 1 + 2 around a copy of pair 3 without `steps`) and
  `unreadable-copy-v1.json`, generated once with node. `sessions-v1.json`
  untouched (git shows no change).
- T004 `packages/shared/src/stored-session.ts` (zod `looseObject`, checking
  only): 10 tests pass, the frozen fixture passes unchanged.
- T006/T009/T010/T011 `storage.ts`: `loadStorage` (preserve before any write,
  dedupe identical copies, write-block), `upsertSession` → `{ sessions, save }`,
  `dismissUnreadable`, `requestPersistentStorage`. Web unit tests 17 pass
  (the original 4 unchanged).
- Mutation check: skipping the copy write in `preserve` → 7 of 17 web unit
  tests fail; restored → 17 pass.
- T007 `StorageNotice.tsx`; App shows unreadable notices on the home screen,
  the not-saved banner (sticky) on every screen.
- T008 Playwright `storage-safety.spec.ts`: 5 tests × desktop + Pixel 7.
  First run: clipboard comparison failed because the fixture file has line
  breaks that the OS clipboard rewrites; stored data is single-line JSON, so
  the test now cuts single-line JSON (matches real data).
- `pnpm verify`: exit 0 (shared 37, web 17, api 6 unit tests; Playwright 16).
- ADR 0006 written. Notice text names Markus as the person to send data to
  (owner name is already public in the repo).

## 2026-11-18 — C3 handoff (round 1)

- Dev server `pnpm --filter @socky/web dev --host 127.0.0.1 --port 5173
  --strictPort`: HTTP 200, title "Socky" (this computer only).
- Reviewer (fresh context, opus): no blockers. Should-fix, all fixed:
  - S1 `upsertSession` rebuilt the list from storage, so after a failed save
    counting another pair dropped unsaved rows and the red bar later cleared
    (FR-009). Fix: `upsertSession(session, current)` uses the on-screen list;
    unit test (two pairs, failing save) + e2e (switch pairs during failure).
    Mutation (ignore `current`) → the new unit test fails.
  - S2 copy not storable → empty app, no notice (FR-004/005). Fix: in-memory
    notice built from the raw text; unit test + e2e (clipboard gets the raw
    text, live key unchanged).
  - S3 schema enums not linked to domain types. Fix: `expectTypeOf` equality
    for StepKey/StepUnit/status/activeSock/tipDirection + every ACTUAL_SIZES
    pair walked to DONE stays readable. Mutation (add a StepKey) → typecheck
    fails in `stored-session.test.ts`.
  - S4 draft report asked the owner to run a console command → removed;
    screenshots cover those cases.
  - Nits fixed: ADR 0006 write-block wording, banner font, "Ausblenden" as
    secondary button (larger tap target), aria-live copy status, autofocus on
    the fallback textarea. Not changed: zod in the web bundle (acceptable).
- `pnpm verify` after fixes: exit 0 (shared 43, web 18, api 6 unit tests;
  Playwright 20 = 7 storage-safety + 3 knitting, × desktop/Pixel 7).
- Screenshots retaken after the fixes with the reviewer's walk script
  (scratchpad `walk.mjs`), 20 PNGs in `specs/001-storage-safety/review/round-1/`;
  the reviewer's two bug-evidence shots replaced by `fix-s1-*`/`fix-s2-*`.
- Not verified: real iPhone Safari (persist grant, clipboard).

## 2026-11-19 — C3 accepted (round 1)

- Owner: "001 can be raised as PR and I take a look" → recorded as r15 in
  `specs/001-storage-safety/feedback/round-1.md`; the name-in-notice question
  not stated (asked again; changeable in the PR).
- T014 ticked; spec status Accepted; STATUS written as the state after the
  merge, now also describing 002 (round 3, second folder) because the owner
  was unsure how a fresh session would find the other branch.
- Retro entry added (`docs/retro.md`, not sent).
- Publish: `pnpm ship --mode expert-review` with a PR body from the `pr`
  skill; result below.
