# AGENTS.md — KnitHelper operating rules

Read `CONSTITUTION.md` first. It overrides convenience.

## Project shape

```
packages/shared   domain types, size-chart seed, materialize(), fixtures
packages/api      Hono on Cloudflare Workers + Drizzle/D1 + auth routes
packages/web      React + Vite mobile-first PWA (admin + knitting UI)
docs/adr/         architecture decision records
docs/domain/      groessenmodell + sock-0N comparison notes (for domain review)
docs/reference/   REGIA 4-fädig pattern PDF
```

## Workflow

1. Prefer the smallest slice that answers the current **review gate** (see Constitution).
2. Prefer editing existing files over creating new ones.
3. Domain questions: read `docs/domain/groessenmodell.md`, `docs/reference/`, and fixtures; if still unclear, ask.
4. Do not invent sizes, counts, or tip schedules.

## Before you claim done

```bash
pnpm verify
```

Playwright is required for knitting UI changes (M2+).

## Code rules

- TypeScript strict; no `any` in shared/api domain code
- German only in user-facing strings; technical identifiers English (Constitution §7)
- New API route: zod input schema + role guard + unit test
- New domain field: update fixtures + `materialize` tests in the same change
- UI strings: i18n keys only (`packages/web/src/i18n/`)
- Conventional commits

## Architecture boundaries (dependency-cruiser)

- `shared` must not import `api` or `web`
- `api` must not import `web`
- `web` must not import `api` internals (HTTP only)
- No I/O in `shared`

## Knitting domain cheat-sheet

- Base pattern **REGIA 4-fädig** (Käppchenferse); chart size drives construction + tip
- Actual size drives plain-foot row counts
- Wife knits on **2 needles** (`anschlagProNadel2`)
- Tip: chart Bandspitze first three rows only; “In jeder Runde” close is not counted
- A **pair session** tracks two socks (Socke 1 / Socke 2); UI knits one sock at a time
- “Reihe fertig” increments the active sock’s counter for the current step
