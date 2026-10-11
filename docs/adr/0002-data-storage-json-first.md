# ADR 0002 — Data storage: JSON first, D1 later

## Status

Accepted (2026-10-11) — architect review

## Context

Need to store patterns, size chart, and per-sock “actual size” configs. Household scale (2 admins + later knitters). Must stay simple until G2/G3; Cloudflare D1 is the long-term free-tier store.

## Decision

### Phase A (now, G1–G2) — JSON in the repo

| Data | Where | Who edits |
|---|---|---|
| Size chart (15 sizes + Bandspitze) | `packages/shared/src/size-chart-seed.ts` (typed, tested) | code change + review |
| Pattern steps (REGIA 4-fädig) | `packages/shared/src/fixtures/pattern-seed.ts` | code change + review |
| Actual sizes (one sock config) | `packages/shared/src/fixtures/pattern-seed.ts` → **`packages/shared/data/actual-sizes/*.json`** | admin edits JSON |

Rules:

- One JSON file per actual size, e.g. `data/actual-sizes/sock-03.json` (label 40/41, chart 44/45, counts, optional tip override).
- Zod schema validates every file on `pnpm test` — no silent drift.
- Pattern + chart stay in TypeScript so unit tests can lock Bandspitze derivation.
- Knitting progress (M2) lives in **localStorage** only (per browser, per user) until auth.

### Phase B (M3) — Cloudflare D1

Same shapes as JSON, tables: `patterns`, `chart_sizes`, `actual_sizes`, `pair_sessions`, `session_steps`. Admin UI reads/writes D1. JSON files remain the seed/import source.

### Phase C (M4) — R2 (optional)

Exports (PDF/print plans) only; not required for core.

## Consequences

- Admin can configure a sock size without a UI: edit JSON + PR (or later admin form → API → D1).
- No cloud dependency for G1/G2; free tier only when deployed.
- Tip may omit `tipRounds` in JSON to inherit from chart Bandspitze (preferred).

## Alternatives

- Full D1 + admin UI from day one: slower fail-fast, more moving parts before G2
- Pure in-memory: not durable across reloads for G2 knitting
