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
- `003-size-generator` (Light): C3 accepted 2026-11-20 (round 4, r28);
  pairs 15/16 … 45/46 are the standard (ADR 0007, constitution 2.0.0);
  merged via its PR (expert-review) and live once the owner merges
- Knitter: starts 27/28 on the live app; that is her first check of 003
  (r29, P2, SC-005 open)
- Pending owner decisions: none

## Counters

- Rounds held: 4 (1 = 001 C3, 2–3 = 002 C1, 4 = 003 C3); global counters
- Last feedback id: r29 (r15, r27 on 001; r01–r14, r16–r26 on 002; r28–r29 on 003)

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

1. After the owner merged the 003 PR: create branch `003-size-generator-c2`
   from the updated `main`, first commit = STATUS "live" + PR number.
2. When the owner reports her 27/28 check (r30+): record it in
   `specs/003-size-generator/feedback/round-5.md`; a wrong count is a fix
   on a new branch. Next roadmap item: M3 (web login + D1, size editor).
