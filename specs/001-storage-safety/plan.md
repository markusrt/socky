# Implementation Plan: Storage safety

**Branch**: `001-storage-safety` | **Date**: 2026-11-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-storage-safety/spec.md`

**Delivery mode**: Light — extends the proven knitting workflow; every risk
(damaged data, failed saves) can be tested inside the slice with fixtures and
Playwright. One C3 GATE (owner decision, interview Q6).

## Summary

Validate saved pairs on load with a zod schema from `packages/shared`, keep
readable pairs, and preserve the complete original text in a separate
"unreadable copy" key before the app ever writes again. Saving becomes a
reported operation (success / failure) so the UI can show "Fortschritt wurde
nicht gespeichert". A storage notice on the home screen offers "Daten kopieren"
and can be dismissed without deleting anything. On start, the app asks the
browser for persistent storage. Today's key, shape and frozen fixture stay
unchanged.

## Technical Context

**Language/Version**: TypeScript 6 (strict), React 19, Vite 8

**Primary Dependencies**: zod 4 (already a dependency of `@socky/shared`); no new packages

**Storage**: browser localStorage; existing key `Socky.sessions.v1` unchanged; new key prefix `Socky.unreadable.v1.` for preserved copies

**Testing**: Vitest (shared schema, web storage module with a memory/failing storage stub), Playwright desktop + Pixel 7 (damaged data, partial data, failed save, notice dismissal) inside `pnpm verify`

**Target Platform**: iOS Safari (live knitter), desktop Chrome for development

**Project Type**: existing pnpm monorepo web app

**Performance Goals**: no perceptible change; validation of a handful of pairs on start

**Constraints**: P4 (never overwrite unreadable data; old fixture keeps loading), P9 (German display text), P11 (tap behavior unchanged), `exactOptionalPropertyTypes`

**Scale/Scope**: one user's browser, typically < 20 pairs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Check | Status |
| --- | --- | --- |
| Owner's loop / Light mode | One C3 GATE; owner accepts from reviewer screenshots + own look (Q6) | Pass |
| P2 Knitter accepts knitting-feel changes | Counting and taps unchanged (FR-012, SC-005); she only confirms her pair after deploy | Pass |
| P4 Never harm her WIP | Key and shape unchanged; frozen `sessions-v1.json` still loads with no notice; new preserved-copy format gets its own frozen fixture; never write while unreadable data is unpreserved | Pass |
| P5 Strict TS + zod at boundaries | Stored data is a boundary: zod schema in shared | Pass |
| P6 Tests prove the domain | Schema unit tests, storage tests, Playwright journeys | Pass |
| P9 German display text | Notice texts German; code English | Pass |
| P11 Mobile-first | Notice readable at phone width; no extra taps for counting | Pass |
| P13 Decisions recorded | Storage-format addition recorded in ADR 0006 | Pass |

Post-design re-check: unchanged, all pass.

## Project Structure

### Documentation (this feature)

```text
specs/001-storage-safety/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── storage.md      # load/save contract of packages/web/src/storage.ts
└── tasks.md
```

### Source Code (repository root)

```text
packages/shared/src/
├── stored-session.ts         # NEW: zod schema for a stored PairSession (validation only)
└── stored-session.test.ts    # NEW
packages/web/src/
├── storage.ts                # load → { sessions, unreadable }, preserve copy, save → result, persist()
├── storage.test.ts           # extended (existing tests unchanged)
├── storage-fixtures/
│   ├── sessions-v1.json            # FROZEN, untouched
│   ├── sessions-v1-damaged.json    # NEW frozen: one damaged pair among good ones
│   └── unreadable-copy-v1.json     # NEW frozen: preserved-copy record format
├── StorageNotice.tsx         # NEW: unreadable notice + "Daten kopieren" + not-saved notice
├── App.tsx                   # wire load result, save result, notice
└── main.tsx                  # request persistent storage once
packages/web/e2e/
└── storage-safety.spec.ts    # NEW
docs/adr/0006-preserve-unreadable-stored-data.md   # NEW
```

**Structure Decision**: validation schema in `shared` (pure, no I/O, reusable
by the API for D1 later); all storage I/O stays in `web/storage.ts`.

## Complexity Tracking

None.
