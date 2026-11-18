# ADR 0005 — Web origin stays on GitHub Pages; move to Cloudflare only between sock projects

## Status

Accepted (2026-11-14) — owner interview Q16/Q19

## Context

- The knitter's progress lives only in localStorage, which belongs to the
  page's **origin**. Today that is `https://markusrt.github.io` (GitHub Pages).
- `deploy-cloudflare.yml` would publish the same web app to Cloudflare Pages
  (project `knithelper`), a different origin: her sessions would not be there.
  The workflow was disabled by hand and never succeeded (no secrets).
- Cloudflare (Workers + D1 + Google login, ADR 0001/0002) remains the goal.
  The owner accepts that she starts fresh there instead of importing browser
  data.

## Decision

1. Delete `deploy-cloudflare.yml`. GitHub Pages (`deploy-pages.yml`) is the
   only web deploy.
2. The web app's origin changes only **between sock projects**: GitHub Pages
   keeps serving until her active pair is finished, she is told in advance,
   then the new origin goes live and she starts a new pair there.
3. No localStorage-to-D1 import is built.
4. How the Worker/D1 API and the web app get deployed to Cloudflare is
   designed as part of the M3 feature, under constitution amendment P4.

## Consequences

- No workflow can silently move her to an empty origin.
- `001-storage-safety` covers only same-origin safety (shape checks, never
  overwrite unreadable data); no migration hook for D1 is needed.
- README keeps the Cloudflare account / secrets steps for the API (M3).

## Alternatives considered

- Keep the disabled workflow for later: a trap if enabled before M3 planning.
- Import browser data into D1 on first login: extra code and risk for data the
  owner considers disposable once a pair is finished.
