# Socky

Mobile-first sock knitting helper (heel cap / Käppchenferse, **REGIA 4-fädig**). Replaces the iOS Notes tick-mark workflow.

**Tagline:** Knit. Track. Cozy.

## Status

**G2 knitting UI** live on GitHub Pages. Auth / offline PWA not started (G3).

| Gate | Reviewer | Status |
|---|---|---|
| G0 Harness | Markus | done |
| G1 Domain | Wife | done |
| G2 Knitting UX | Wife | try-out URL |
| G3 Product | Both | next |

## Quick start

```bash
pnpm install
pnpm verify     # lint + typecheck + dep-cruise + tests
pnpm dev:web    # knitting UI
pnpm dev:api    # Hono health / plan preview
```

## Layout

```
CONSTITUTION.md          Non-negotiable principles
AGENTS.md                Agent/dev operating rules
docs/adr/                Architecture decisions
docs/domain/             Size model + note comparisons
docs/reference/          REGIA pattern PDF + design concept
packages/shared          Domain, size chart, session logic, JSON sizes
packages/api             Hono on Cloudflare Workers
packages/web             React knitting UI (Socky)
```

## Domain (short)

**Chart base size** (e.g. 44/45) drives stitch construction, heel, and tip schedule. **Actual size** (e.g. 40/41, 18) drives plain-foot row counts. One pattern **REGIA 4-fädig**. Pair session tracks two socks (sequentially). Knitting on 2 needles.

## Release

GitHub Actions → GitHub Pages (`deploy-pages.yml`). Optional Cloudflare Pages later.

Live: https://markusrt.github.io/socky/
