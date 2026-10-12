# Socky — status for future sessions

Last updated: 2026-10-11 (initial build session)

## What works (G0–G2 code complete)

- Constitution + AGENTS + CI (`pnpm verify`)
- Domain: REGIA 4-fädig, 15 chart sizes, JSON actual-sizes (sock-01…04)
- Knitting UI (localhost:5173): sequential socks, Reihe fertig / Fertig / Socke fertig, tip per-stitch rows, heel polarity, undo across steps
- localStorage sessions

## Open for try-out (G2)

Deploy so wife can use it on a phone (not localhost).

## Remaining roadmap

1. **Deploy (GitHub Pages)** — after push to GitHub:
   - Repo **Settings → Pages → Source: GitHub Actions**
   - Push `main` → `deploy-pages.yml` publishes `packages/web/dist`
   - URL: `https://<user>.github.io/<repo>/`
2. Optional **Cloudflare Pages** — secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` + `deploy-cloudflare.yml`
3. **M3** — Google auth (Better Auth), ADMIN/KNITTER, D1, admin for sizes
4. **M4** — offline PWA, production workers.dev
5. Polish: i18n EN, print/export

## Domain gotchas (do not regress)

- Chart size ≠ actual size
- 2 needles (not 4): 44 → 22 / Nadel
- Tip: `2 rechts` means **two** rows then Abnahme; `In jeder Runde` close is not ticked
- No German in technical identifiers (Constitution §7)
- Buttons: once → Fertig; close → Socke fertig; else Reihe fertig

## Commands

```bash
pnpm install
pnpm verify
pnpm dev:web
```
