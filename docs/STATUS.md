# Current handoff

Short on purpose: the state a fresh session needs, nothing else. History,
commands, outcomes, review findings and screenshots go to
`docs/journal/<feature>.md` (append-only). Keep this file under 80 lines.

## Product

- Product: **Socky**, mobile-first sock-knitting helper (Käppchenferse,
  REGIA 4-fädig); replaces deleting `/` tick marks in iOS Notes
- Owner: Markus. Live user and acceptance tester: the knitter (amendment P2)
- Repository/branch: `markusrt/socky` (public), default branch `main`
- Live: <https://markusrt.github.io/socky/> (every merge to `main` deploys)
- Spec language: en (German UI); publish choice: expert-review (PR, owner
  merges); owner experience: technical

## Data safety (amendment P4)

- Her progress: localStorage `Socky.sessions.v1` on `markusrt.github.io` only
- Guarded by `storage.test.ts` + Playwright on the frozen fixtures in
  `packages/web/src/storage-fixtures/`
- Unreadable stored data is copied, never overwritten (001, ADR 0006)

## Where we are

- Process: mvp-starter (ADR 0004); baseline PR #1 merged 2026-11-18
- Before adoption: `specs/000-baseline/spec.md` (UI live, API not deployed)
- `001-storage-safety` (Light): merged 2026-11-19 (PR #2, `83287c1`), live
  and checked by the owner (r27)
- `002-sizing-research` (Spike): C1 accepted 2026-11-19 (round 3, r18–r26),
  docs-only PR. Result: size pairs 15/16 … 49/50, model and constants in
  `specs/002-sizing-research/report.md`, script `pairs.mjs`; go for 003
- `003-size-generator` (Light): interview Q1–Q8 done 2026-11-19; pairs
  15/16 … 45/46 become the standard (ADR 0007, constitution 2.0.0: P1, P3);
  spec/plan/tasks T001–T013 committed; implementation not started
- Knitter: knits 27/28 next, from the app once 003 is tried (not started, Q7)
- Pending owner decisions: none until the 003 C3 round report

## Counters

- Rounds held: 3 (round 1 = 001 C3, round 2 = 002 C1, round 3 = 002 C1
  repeat); counters are global across both branches
- Last feedback id: r27 (r15, r27 on 001; r01–r14, r16–r26 on 002)

## Machine

- Tool check 2026-11-14: Windows, Node 24.21.0, pnpm 9.15.9, Chromium

## Worktree

- Active branch `003-size-generator` (from `main` after PR #3); Spec Kit:
  `SPECIFY_FEATURE_DIRECTORY=specs/003-size-generator`

## Roadmap (owner-approved order, 2026-11-14)

1. Done 2026-11-18: baseline PR merged, knitter confirmed; `main` ruleset
   active (PR + check, no force-push/deletion, admin bypass)
2. In parallel: `001-storage-safety` (Light) and `002-sizing-research` (Spike)
3. `003-size-generator` (from the research result)
4. M3: web login + D1 sessions, admin size editor (open items R4.8, R4.9;
   input: `docs/history/original-plan.md`)
5. M4: offline PWA

## Limits

- Progress is per browser; clearing site data loses it (accepted, no export)
- Cloudflare not configured (setup in `README.md`); moving the web app
  there only between sock projects (ADR 0005)
- `POST /migrate` in `packages/api` is unauthenticated; guard before deploying
- TypeScript 7 blocked on dependency-cruiser (ADR 0003)

## Exact next action

1. `/speckit-implement` 003 from T001 (order in tasks.md: T002 → T003 → T004
   first; T001's fixture is written once the new shape exists), story by
   story, then GATE T013 (round 4, with German steps for the knitter).
   Owner experience technical: plan summary and ADR 0007 were offered in
   chat before building. Next feedback id r28.
