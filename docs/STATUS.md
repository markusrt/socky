# Socky — status for future sessions

Last updated: 2026-10-15 (G2 pass recorded; M3 API foundation started)

## Product

**Socky** — mobile sock-knitting helper (Käppchenferse, REGIA 4-fädig). Replaces iOS Notes `/` ticks.

**Live:** https://markusrt.github.io/socky/  
**Repo:** `markusrt/socky` (local folder: `D:\Development\KnitHelper`)

## What works

- Harness: CONSTITUTION, AGENTS, CI (`pnpm verify`), `gh` for CI, Node 24 toolchain
- Toolchain: TypeScript 6, Biome 2, Vitest 5, Vite 8, wrangler 4, zod 4 (ADR 0003)
- Domain: chart vs actual size, 2 needles, tip per rechts/Abnahme row, sequential pair socks
- Actual sizes (JSON): `size-15`, `size-18`, `size-37-38`, `size-40-41`, `size-50-51`
- Knitting UI: castOn → cuff → leg → heel (alternating) → split → pickup → postJoin → reduceToCastOn → plainFoot → tip rows → close
- Buttons: Reihe fertig / Fertig / Socke fertig (primary `Button`)
- Progress: **localStorage** (same browser/origin only — not cloud-safe)
- Design: Socky palette + logo from `docs/reference/design-concept-1.jpg`
- G2: real sock on real phone via GitHub Pages + size 15 as specified
- **M3 API foundation:** Better Auth (Google), role guards, pair-session D1 routes, admin sizes list (`packages/api`)

## Requirements / specs

See **`docs/SPEC.md`** (implemented features as requirements) + `docs/domain/` + ADRs.  
Update SPEC.md on every feature (rule in AGENTS.md).

## Open

| Item | Notes |
|---|---|
| G3 / M3 remaining | Web login UI, D1-backed sessions in UI, admin size editor UI |
| M4 | Offline PWA |
| Cloudflare deploy | Workflow exists but **never configured** (no account/secrets yet); GitHub Pages is the live deploy |
| localStorage risk | Clearing site data loses sessions — history is disposable (wife confirmed); no export/import needed |
| TypeScript 7 | Blocked on dependency-cruiser support (see ADR 0003) |

## M3 secrets / setup (Markus)

**See `README.md`** — “M3 local development” + “GitHub Secrets”. Short version:

1. **Local test without any accounts:** `pnpm dev:web` + `pnpm verify` (knitting UI + tests). No Cloudflare/Google needed.
2. **Local M3 (login + D1):** Google OAuth client (README §A) → `packages/api/.dev.vars` from `.dev.vars.example` (README §B) → `pnpm dev:api` + `db:app:local` + `db:auth:local` (README §C).
3. **Cloudflare / GitHub secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (README “GitHub Secrets”). Until those exist, `Deploy Cloudflare (optional)` fails on every push; CI + Pages stay green.

Cloudflare deploy failed earlier because **secrets were never configured** (expected). Full click-paths for Google Cloud Console and Cloudflare dashboard are in the README.

## Domain gotchas (do not regress)

- Chart size ≠ actual size
- 2 needles: `castOnPerNeedle2`
- Size 15 uses **construction overrides** (36 M, 6-6-6, 9) — not REGIA 22/23 numbers
- Tip unit `2 rechts` = **two** rows + Abnahme; chart `everyRound` close is not ticked
- English technical IDs; German only in display strings (Constitution §7)
- Sequential socks: no sock 2 before sock 1 is complete

## Commands

Requires **Node.js 24+** (see `.nvmrc`, ADR 0003).

```bash
pnpm install
pnpm verify
pnpm dev:web
gh run list --limit 5
```
