# Socky

Mobile-first sock knitting helper (heel cap / Käppchenferse, **REGIA 4-fädig**). Replaces the iOS Notes tick-mark workflow.

**Tagline:** Knit. Track. Cozy.

## Status

**G2 knitting UX passed** (real sock + size 15 on GitHub Pages). Auth / offline PWA next (G3).

| Gate | Reviewer | Status |
|---|---|---|
| G0 Harness | Markus | done |
| G1 Domain | Wife | done |
| G2 Knitting UX | Wife | done (real phone, size 15) |
| G3 Product | Both | next (M3 auth + D1) |

## Quick start (knitting UI only)

Requires **Node.js 24+** (see `engines` / `.nvmrc`) and [pnpm](https://pnpm.io) (via Corepack: `corepack enable`).

```bash
pnpm install
pnpm verify     # lint + typecheck + dep-cruise + tests
pnpm dev:web    # knitting UI → http://localhost:5173
pnpm dev:api    # Hono API (health / plan preview) → http://localhost:8787/health
```

You do **not** need Cloudflare or Google to knit or run tests. Those are only for **M3** (login + cloud sessions).

---

## M3 local development (Google login + D1)

Goal: run the API with Google sign-in and local D1 on `http://localhost:8787`.

### A. One-time Google OAuth credentials (free)

1. Open [Google Cloud Console → APIs & Services](https://console.cloud.google.com/apis/dashboard).
2. Project selector → **New Project** (e.g. `socky`) → open it.
3. Left menu → **APIs & Services → OAuth consent screen**
   - User type: **External** (unless you have Google Workspace)
   - App name `Socky`, your email as support
   - Scopes: `email`, `profile` (openid is implied)
   - Test users: add **your Gmail** and **your wife’s Gmail**
   - Save (stay in **Testing** — no need to publish)
4. **Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `socky-local`
   - **Authorized redirect URIs** — add exactly:
     - `http://localhost:8787/api/auth/callback/google`
   - Create → copy **Client ID** and **Client Secret**

### B. Local env file

```bash
cd packages/api
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` (gitignored) and set:

| Key | Value |
|---|---|
| `GOOGLE_CLIENT_ID` | from step A4 |
| `GOOGLE_CLIENT_SECRET` | from step A4 |
| `BETTER_AUTH_SECRET` | long random string (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | `http://localhost:8787` |
| `WEB_ORIGIN` | `http://localhost:5173` |
| `ADMIN_EMAILS` | your Gmail (comma-separated if more) |

### C. Local D1 tables (first time / after schema changes)

In one terminal:

```bash
pnpm dev:api    # wrangler dev on :8787
```

In a second terminal:

```bash
pnpm --filter @socky/api db:app:local     # pair_sessions / session_steps / actual_sizes
pnpm --filter @socky/api db:auth:local    # Better Auth tables via POST /migrate
```

### D. Try it

| Check | How |
|---|---|
| API up | open `http://localhost:8787/health` → `{"ok":true,...}` |
| Auth routes | open `http://localhost:8787/api/auth/sign-in` (or hit `/api/auth/get-session`) |
| Google login | `curl -i http://localhost:8787/api/auth/sign-in/social` is interactive in browser; full UI login is next M3 slice |
| Role guard | `GET http://localhost:8787/api/sessions` without cookie → `401` |

Web UI (`pnpm dev:web`) still uses **localStorage** until the next M3 slice wires login + D1 sessions into the UI.

---

## GitHub Secrets (Cloudflare deploy / CI)

Needed for `Deploy Cloudflare (optional)` and for deploying the API to Workers.

### 1. Cloudflare account

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free plan is enough).
2. Copy **Account ID**: right sidebar on the dashboard overview (or Workers & Pages → account name).
3. **My Profile → API Tokens → Create Token → Custom token**
   - Permissions: **Account · Workers Scripts · Edit**, **Account · D1 · Edit**, **Account · Pages · Edit**
   - Account resources: include your account
   - Create → copy the token (shown once)

### 2. GitHub repository secrets

Repo `markusrt/socky` → **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | token from step 1.3 |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from step 1.2 |

Then **Workflows → Deploy Cloudflare (optional) → … → Enable workflow** if it is disabled.

### 3. Production D1 + Worker secrets (after account exists)

```bash
pnpm --filter @socky/api exec wrangler login
pnpm --filter @socky/api exec wrangler d1 create socky
# → put the printed database_id into packages/api/wrangler.toml
pnpm --filter @socky/api db:app:remote
pnpm --filter @socky/api deploy
curl -X POST https://socky-api.<your-subdomain>.workers.dev/migrate
```

In Cloudflare dashboard → Workers & Pages → `socky-api` → **Settings → Variables and Secrets** (or `wrangler secret put …`):

| Secret | Value |
|---|---|
| `BETTER_AUTH_SECRET` | long random string |
| `BETTER_AUTH_URL` | `https://socky-api.<your-subdomain>.workers.dev` |
| `GOOGLE_CLIENT_ID` | Google client (add the Workers redirect URI, see below) |
| `GOOGLE_CLIENT_SECRET` | same Google client |
| `WEB_ORIGIN` | `https://markusrt.github.io` |
| `ADMIN_EMAILS` | your Gmail |

### 4. Google OAuth production redirect

In the same Google OAuth client (or a second client `socky-prod`), add:

```
https://socky-api.<your-subdomain>.workers.dev/api/auth/callback/google
```

---

## Layout

```
CONSTITUTION.md          Non-negotiable principles
AGENTS.md                Agent/dev operating rules
docs/adr/                Architecture decisions
docs/domain/             Size model + note comparisons
docs/reference/          REGIA pattern PDF + design concept
packages/shared          Domain, size chart, session logic, JSON sizes
packages/api             Hono on Cloudflare Workers (+ Better Auth M3)
packages/web             React knitting UI (Socky)
```

## Domain (short)

**Chart base size** (e.g. 44/45) drives stitch construction, heel, and tip schedule. **Actual size** (e.g. 40/41, 18) drives plain-foot row counts. One pattern **REGIA 4-fädig**. Pair session tracks two socks (sequentially). Knitting on 2 needles.

## Release

GitHub Actions → GitHub Pages (`deploy-pages.yml`). Cloudflare optional (`deploy-cloudflare.yml`) once secrets exist.

Live: https://markusrt.github.io/socky/
