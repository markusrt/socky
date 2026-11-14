# ADR 0004 — Adopt the mvp-starter process; retire MiMo Code

## Status

Accepted (2026-11-14) — owner interview, questions Q1–Q25

## Context

- Socky was built with MiMo Code and a MiMo-tailored spec process:
  `CONSTITUTION.md`, a single living `docs/SPEC.md`, review gates G0–G3,
  milestones M1–M4, and handoff state partly in MiMo's memory outside the repo.
- Development continues with Claude Code. The owner's own template,
  [markusrt/mvp-starter](https://github.com/markusrt/mvp-starter), defines an
  owner's loop on GitHub Spec Kit: per-feature specs, checkpoints C1–C3 with
  round reports, a reviewer agent, a scribe rule for feedback, and PR-based
  publishing.
- The template is for new single-app, browser-only products. Socky is a live
  pnpm monorepo (`shared`, `web`, `api`) with a planned Cloudflare backend.
- The knitter uses the live app daily; her progress exists only in her
  browser, and every push to `main` deployed straight to her phone, with no
  web tests and no branch protection.

## Decision

1. **Retire MiMo Code.** Everything it knew that the repo did not is moved
   into the repo (`docs/domain/`, `AGENTS.md`, `docs/history/original-plan.md`).
   The repo is the only memory.
2. **Take the process, keep the structure.** Vendor mvp-starter @39ad7c4
   (Spec Kit 1.2.1, `team`/`grilling`/`pr`/`prototype` skills, developer and
   reviewer agents, round/feedback templates, `ship.mjs`) and adapt it to the
   monorepo. No `.mvp-starter/manifest.json`: template updates are ported by
   hand, so nothing can overwrite Socky's adaptations.
3. **Constitution** moves to `.specify/memory/constitution.md`: the template's
   owner's loop and principles, plus Socky's former §1–§11 as "Project
   amendments" P1–P13. New: P1 (her rules outrank REGIA; computed counts are
   proposals marked "berechnet" until she accepts them) and P4 (never harm her
   stored progress).
4. **Specs**: `docs/SPEC.md` becomes the frozen `specs/000-baseline/spec.md`;
   new work lives in `specs/NNN-*/`. Gates G0–G3 are replaced by C1–C3 and the
   delivery modes; the knitter's acceptance is a named owner step (P2).
5. **Roles**: Markus is the owner (`technical`); the knitter is the acceptance
   tester. Spec language English; German UI and knitting terms.
6. **Publishing**: `expert-review` (PR, owner merges). After the first merge,
   `main` gets protection: PR and passing checks required, no force-push, no
   deletion, no required approvals, admin bypass kept for emergencies.
7. **Safety net before any feature**: a frozen fixture of the stored format
   with unit tests, and Playwright (desktop + Pixel 7) in `pnpm verify`, in
   CI and in the Pages deploy.

## Consequences

- Every change to the live app goes through a PR and through tests that load
  her real stored format; a storage-key or shape change fails CI unless it
  migrates old data.
- `STATUS.md` follows the template's fixed sections; evidence goes to
  `docs/journal/`, retro notes to `docs/retro.md`.
- Spec Kit scripts need bash (Git Bash on Windows); `.gitattributes` pins LF.
- Template improvements must be compared and ported manually (recorded commit
  in `THIRD-PARTY-NOTICES.md`).
- The four-digit ADR numbering stays; the template's own ADRs are not copied.
- Historical "G1/G2" mentions in old ADRs, code comments and one UI heading
  remain; they change only when that code is touched.

## Alternatives considered

- **Full adoption** (manifest, template-owned paths, single spec layout):
  every template update would overwrite monorepo paths and the data-safety
  rules; the starter's browser-only stance conflicts with the D1 plan.
- **Only a few habits** (branches, reviewer): loses the round/feedback loop
  and the per-feature specs the owner wants.
- **Keep MiMo alongside Claude**: two memory systems and two rule sets drift.
