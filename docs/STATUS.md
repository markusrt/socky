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

Cloudflare deploy failed earlier because **secrets were never configured** (expected). To finish G3:

### 1. Cloudflare

1. Create a free Cloudflare account → note **Account ID** (dashboard URL or Workers overview).
2. Create API token (`My Profile → API Tokens`) with:
   - Account · Workers Scripts · Edit
   - Account · D1 · Edit
   - Account · Workers R2 · Edit *(optional, M4)*
   - Account · Pages · Edit *(if using Cloudflare Pages for web)*
3. GitHub repo **Settings → Secrets and variables → Actions**:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Create D1: `pnpm --filter @socky/api exec wrangler d1 create socky` → put the returned `database_id` into `packages/api/wrangler.toml`.
5. Apply app tables: `wrangler d1 execute socky --file=packages/api/migrations/0001_app_tables.sql`
6. Deploy API: `pnpm --filter @socky/api deploy` (or add to CI). Auth tables: `POST /migrate` once after deploy.

Worker secrets (wrangler secret put / GitHub):
- `BETTER_AUTH_SECRET` (long random string)
- `BETTER_AUTH_URL` (e.g. `https://socky-api.<account>.workers.dev`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `WEB_ORIGIN` (e.g. `https://markusrt.github.io`)
- `ADMIN_EMAILS` (comma-separated; e.g. your Gmail)

### 2. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/apis/dashboard) → new project (or existing).
2. **APIs & Services → OAuth consent screen** → External (or Internal if Workspace) → add scopes `email`, `profile` → add test users (you + wife) while in Testing.
3. **Credentials → Create Credentials → OAuth client ID → Web application**.
4. Authorized redirect URIs:
   - `http://localhost:8787/api/auth/callback/google` (local wrangler)
   - `https://socky-api.<account>.workers.dev/api/auth/callback/google` (production)
5. Copy **Client ID** + **Client Secret** into the Worker secrets above.

### 3. GitHub Actions note

`Deploy Cloudflare (optional)` is currently failing on every main push (`deploy-cloudflare.yml`). Either add the two secrets above and rename the job to required, or leave it optional/ignore until G3 is ready. CI and GitHub Pages are green and unaffected.

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
