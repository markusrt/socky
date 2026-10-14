# ADR 0003 — Node.js 24 toolchain

## Status

Accepted (2026-10-27)

## Context

Local development moved to Node.js v24. CI, `engines`, and docs still declared Node 20, and several build/test tools were multiple majors behind. The codebase is small (shared/api/web), so one coordinated toolchain move is cheaper than staggered upgrades.

## Decision

**Node floor**

- **engines** in root `package.json`: `"node": ">=24"`
- **CI / deploy workflows** (`ci.yml`, `deploy-pages.yml`, `deploy-cloudflare.yml`): `node-version: 24`
- **`.nvmrc`**: `24` for local version managers
- README quick start documents the Node 24+ requirement

Runtime target remains Cloudflare Workers (ADR 0001); Node is the build/test toolchain only.

**Dependency majors** (same change)

| Package | From → To | Notes |
|---|---|---|
| TypeScript | 5.9 → **6.0** | 7.x deferred: dependency-cruiser does not support its API yet |
| Biome | 1.9 → **2.5** | config migrated (`organizeImports` → `assist`, `files.includes`) |
| Vitest | 2.1 → **5.0** | |
| Vite | 6.x → **8.x** | + `@vitejs/plugin-react` 6 |
| React | 19.0 → **19.3** | |
| zod | 3.x → **4.x** | little surface area so far |
| wrangler | 3.x → **4.x** | |
| workers-types | 4.x → **5.x** | |
| dependency-cruiser | 16 → **18** | |

Lint auto-fixes applied (import sort, optional chain, `indexOf`). No domain behavior change.

## Consequences

- Local, CI, and documented Node versions match; Node 20/22 is no longer a supported build environment.
- Stay on TypeScript 6 until dependency-cruiser supports TS 7 (otherwise `dep:cruise` silently crawls almost nothing).
- Biome 2 treats import/export organization as check failures — `pnpm format` / `biome check --write` is part of the workflow after upgrades.
- `pnpm verify` remains the done gate (Constitution §4/§5).
