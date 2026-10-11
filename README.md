# KnitHelper

Mobile-first Socken-Strickhilfe (Käppchenferse, **REGIA 4-fädig**). Ersetzt den iOS-Notes-Tickmarken-Workflow.

## Status

**G0/G1** — Harness + Domain-Seed. Noch keine Auth/PWA/Deploy.

| Gate | Reviewer | Offen? |
|---|---|---|
| G0 Harness | Markus | |
| G1 Domain | Frau | **bitte prüfen** |
| G2 Knitting UX | Frau | |
| G3 Product | beide | |

## Quick start

```bash
pnpm install
pnpm verify     # lint + typecheck + dep-cruise + tests
pnpm dev:web    # Domain-Preview (G1)
pnpm dev:api    # Hono health / plan preview
```

## Layout

```
CONSTITUTION.md          Non-negotiable principles
AGENTS.md                Agent/Dev operating rules
docs/adr/                Architecture decisions
docs/domain/             Größenmodell + Vergleich sock-01…04 (G1)
docs/reference/          REGIA 4-fädig PDF
packages/shared          Domain, size-chart seed, materialize, fixtures
packages/api             Hono on Cloudflare Workers
packages/web             React preview → later knitting UI
```

## Domain in one paragraph

**Chart base size** (e.g. 44/45) drives stitch construction, heel, and Bandspitze (tip). **Actual size** (e.g. 40/41) drives plain-foot rounds. One pattern **REGIA 4-fädig**; a pair session tracks two socks with one-tap row confirmation. She knits on 2 needles.

## Release

GitHub Actions CI → later `wrangler deploy` to `*.workers.dev` (enable in G3).
