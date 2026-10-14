# Socky — status for future sessions

Last updated: 2026-10-27 (Node 24 toolchain + dependency refresh)

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

## Requirements / specs

See **`docs/SPEC.md`** (implemented features as requirements) + `docs/domain/` + ADRs.  
Update SPEC.md on every feature (rule in AGENTS.md).

## Open

| Item | Notes |
|---|---|
| G2 try-out | Wife on real phone / multi-day |
| Size 15 confirm | 6-6-6, 9 pickup, tip 2 rounds from notes |
| localStorage risk | Clearing site data loses sessions |
| M3 | Google login, D1, roles, admin size editor |
| M4 | Offline PWA, Cloudflare |
| Export/import JSON | Optional backup before M3 |
| TypeScript 7 | Blocked on dependency-cruiser support (see ADR 0003) |

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
