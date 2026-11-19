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
- Built before adoption: `specs/000-baseline/spec.md` (R1–R4; knitting UI
  live, M3 API foundation in `packages/api` not deployed)
- `001-storage-safety` (Light): C3 accepted 2026-11-19 (round 1, r15);
  PR open for the owner's review; live once merged
- `002-sizing-research` (Spike): at its C1 GATE, round 3 (paired sizes,
  her gauge). It lives on its own branch in the second folder
  `D:\Development\KnitHelper-002`; that branch's `docs/STATUS.md` and
  `specs/002-sizing-research/review/round-3.md` hold its details
- Pending owner decisions: merge the 001 PR; 002 round 3 (Q1 pair scheme,
  Q2 go for 003, Q3 docs-only PR) and the knitter's six answers

## Counters

- Rounds held: 3 (round 1 = 001 C3, round 2 = 002 C1, round 3 = 002 C1
  repeat); counters are global across both branches
- Last feedback id: r17 (r01–r14 and r16–r17 recorded on the 002 branch,
  r15 = 001 acceptance)

## Machine

- Tool check 2026-11-14: Windows, Node 24.21.0, pnpm 9.15.9, Chromium

## Worktree

- Branches `001-storage-safety`, `002-sizing-research` from `main`; Spec
  Kit: set `SPECIFY_FEATURE_DIRECTORY=specs/<feature of current branch>`

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
- Cloudflare (Worker, D1, Google login) not configured; setup steps in
  `README.md`. Moving the web app there happens only between sock projects
  (ADR 0005)
- `POST /migrate` in `packages/api` is unauthenticated; guard before deploying
- TypeScript 7 blocked on dependency-cruiser (ADR 0003)

## Exact next action

1. 001 is merged and live (this file is `main` after the merge): the
   knitter opens Socky once and checks that her pair is still there.
2. Then bring 002 back into this folder: merge `main` into
   `002-sizing-research` (take the more complete STATUS), check it out here,
   remove the `../KnitHelper-002` worktree. Wait for the owner's round-3
   decisions and her answers; record them as round-3 feedback (next id r18).
