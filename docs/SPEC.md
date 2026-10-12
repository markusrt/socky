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

## Not implemented (roadmap)

- Google login, ADMIN/KNITTER, multi-user (M3)
- D1 / server persistence (M3)
- Offline PWA (M4)
- Export/import session backup
- EN i18n
