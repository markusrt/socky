# Socky — implemented requirements (spec)

Living summary of **what the product does** as of the last implementation.  
New features: add/adjust a section here in the same PR (AGENTS.md rule).

## R1 Pattern & sizes

| ID | Requirement | Implementation |
|---|---|---|
| R1.1 | One base pattern REGIA 4-fädig (Käppchenferse) | `REGIA_4_FAEDIG_PATTERN` |
| R1.2 | Digitized size chart (15 sizes, construction + tip schedule) | `size-chart-seed.ts` |
| R1.3 | Chart size ≠ actual size | `ActualSizeConfig.chartSizeLabel` vs `label` |
| R1.4 | 2-needle cast-on (`/2`); chart `/4` is reference | `castOnPerNeedle2` |
| R1.5 | Per-actual-size step counts (cuff, leg, heel, postJoin, plainFoot) | `counts` + JSON |
| R1.6 | Construction overrides when notes ≠ REGIA chart | `construction` (e.g. size 15) |
| R1.7 | Tip from chart Bandspitze or explicit `tipRounds` | `deriveTipRounds` / JSON |
| R1.8 | Admin-editable sizes as JSON under `packages/shared/data/actual-sizes/` | ADR 0002 |

## R2 Knitting session

| ID | Requirement | Implementation |
|---|---|---|
| R2.1 | Pair session = 2 socks, **sequential** (sock 1 all steps, then sock 2) | `session.ts` |
| R2.2 | Steps: castOn, cuff, leg, heel, split, pickup, postJoin, reduceToCastOn, plainFoot, tip, close | pattern steps + tip expansion |
| R2.3 | One tap = one row (Reihe fertig) | `tickActiveSock` + auto-advance |
| R2.4 | once steps → **Fertig**; close → **Socke fertig** | UI button labels |
| R2.5 | Tip: one tap per rechts/Abnahme; show round i/n + row j/k | expanded tip rows |
| R2.6 | Heel: alternating rechts/links indicator | `heelRowPolarity` |
| R2.7 | Undo walks back across steps | `untickActiveSock` |
| R2.8 | Finished sock shows ✓ not n/n | `SockProgress` |
| R2.9 | Persist progress in localStorage (same browser) | `storage.ts` |

## R3 Product shell

| ID | Requirement | Implementation |
|---|---|---|
| R3.1 | German UI (display); English technical code | Constitution §7 |
| R3.2 | Socky branding + palette | `theme.ts`, `logo-socky.png` |
| R3.3 | Mobile-first | shell max-width, large buttons |
| R3.4 | G1 plan preview (same card list as sessions) | preview view |
| R3.5 | GitHub Actions CI + Pages deploy | `ci.yml`, `deploy-pages.yml` |

## R4 Auth & cloud persistence (M3, in progress)

| ID | Requirement | Implementation |
|---|---|---|
| R4.1 | Google login (Better Auth) | `packages/api/src/auth.ts`, `/api/auth/*` |
| R4.2 | Roles `ADMIN` / `KNITTER` (server-owned) | `user.additionalFields.role`, `ADMIN_EMAILS` |
| R4.3 | Mutating routes require auth + role (Constitution §8) | `guards.ts` (`requireUser`, `requireRole`) |
| R4.4 | Own pair sessions only | `GET/POST /api/sessions`, `user_id` filter |
| R4.5 | Tick / undo / finish / start sock 2 over API | `POST /api/sessions/:id/actions` |
| R4.6 | D1 tables: auth + `actual_sizes`, `pair_sessions`, `session_steps` | `migrations/0001_app_tables.sql` + Better Auth migrate |
| R4.7 | Admin can list actual sizes in D1 | `GET /api/admin/actual-sizes` (ADMIN) |
| R4.8 | Web UI login + D1-backed sessions | *not yet* (localStorage still live) |
| R4.9 | Admin size editor UI | *not yet* |

## Not implemented (roadmap)

- Web login UI + D1-backed knitting sessions (R4.8)
- Admin size editor UI (R4.9)
- Offline PWA (M4)
- EN i18n
