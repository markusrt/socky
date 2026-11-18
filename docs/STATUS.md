# Current handoff

Short on purpose: the state a fresh session needs, nothing else. History,
commands, outcomes, review findings and screenshots go to
`docs/journal/<feature>.md` (append-only). Keep this file under 80 lines.

## Product

- Product: **Socky**, mobile-first sock-knitting helper (Käppchenferse,
  REGIA 4-fädig); replaces deleting `/` tick marks in iOS Notes
- Owner: Markus. Live user and acceptance tester: his wife, the knitter
  (constitution amendment P2)
- Repository/branch: `markusrt/socky` (public), default branch `main`
- Live: <https://markusrt.github.io/socky/> (GitHub Pages; every merge to
  `main` deploys)
- Spec language: en (German UI, knitting terms and knitter steps)
- Publish choice: expert-review (PR, owner merges)
- Owner experience: technical

## Data safety (amendment P4)

- Her progress: localStorage `Socky.sessions.v1` on `markusrt.github.io` only
- Guarded by `packages/web/src/storage.test.ts` + Playwright resume smoke on
  the frozen fixture `packages/web/src/storage-fixtures/sessions-v1.json`
- Known gap: unreadable stored data loads as an empty list and the next tap
  overwrites it; fixed by feature 001-storage-safety

## Where we are

- Process: mvp-starter adopted (ADR 0004), baseline PR #1 merged
  2026-11-18 (`d2cc134`); knitter confirmed her live pair is intact
- Built before adoption: `specs/000-baseline/spec.md` (R1–R4; knitting UI
  live, M3 API foundation in `packages/api` not deployed)
- Active (parallel, own branch each): `001-storage-safety` (Light) at its
  C3 GATE (round 1); `002-sizing-research` (Spike) at its C1 GATE (round 2,
  `specs/002-sizing-research/review/round-2.md`, worktree `../KnitHelper-002`)
- Pending owner decisions: accept 001 (round 1); 002 go/no-go (round 2)

## Counters

- Rounds held: 2 (round 1 = 001 C3, round 2 = 002 C1)
- Last feedback id: none (next is r01)

## Machine

- Last tool check: 2026-11-14 (Windows; Node 24.21.0, pnpm 9.15.9,
  Playwright Chromium installed)

## Worktree

- Branches `001-storage-safety`, `002-sizing-research` from `main`; Spec
  Kit: set `SPECIFY_FEATURE_DIRECTORY=specs/<feature of current branch>`

## Roadmap (owner-approved order, 2026-11-14)

1. Done 2026-11-18: baseline PR merged, knitter confirmed; `main` ruleset
   active (PR + check, no force-push/deletion, admin bypass)
2. In parallel: `001-storage-safety` (Light) and `002-sizing-research`
   (Spike, research only: her new notes, REGIA structure, foot data,
   proposed sizing model with test cases)
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

1. 001: wait for the owner's round-1 decision; on acceptance tick T014 and
   `pnpm ship --mode expert-review`; after merge she checks her pair once.
2. 002: wait for the owner's go/no-go and the knitter's table verdicts;
   record them (feedback file), then publish per the decision.
