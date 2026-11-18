> **Historical document — not a requirement.** Original project plan written by
> MiMo Code on 2026-10-11 (plan file `nimble-squid.md`), archived here on
> 2026-11-14 when the project moved to the mvp-starter workflow (ADR 0004).
> Parts are superseded: Drizzle (not used; Better Auth + raw D1 SQL), Tailwind,
> TanStack Query, "do not digitize Bandspitze" (tip *is* derived from the chart),
> gate vocabulary G0–G3 (now checkpoints C1–C3). Use it as **input** when
> specifying M3/M4 features (data model §3, surfaces §4, acceptance §6/§8,
> open items §9), never as a source of truth.

# KnitHelper — Project Plan

Mobile-first webapp for sock knitting (Käppchenferse). Replaces iOS Notes tick-mark workflow. German UI, i18n-ready. Local first → Cloudflare free tier.

## Delivery philosophy (fail-fast, early steering)

Small vertical slices with **explicit review gates** — polish later.

| Gate | Reviewer | Question to answer | Slice |
|---|---|---|---|
| **G0 Harness** | Markus (architect) | Is CONSTITUTION.md + AGENTS.md + CI/arch rules the right harness? | M0 |
| **G1 Domain truth** | Wife (domain expert) | Do digitized chart + sock-01…04 stepped plans match her Notes? | M1 (CLI/JSON first, no UI polish) |
| **G2 Knitting feel** | Wife | Does "Reihe fertig" beat deleting `/`? | M2 thin UI |
| **G3 Product** | Both | Auth, offline, deploy worth it? | M3–M4 |

Rules: ship the smallest artifact that answers the gate question; no styling/PWA/auth until G0–G1 pass; keep `planning-input-do-not-commit/` out of git.

---

## 1. Domain model (from source notes + user answers)

### Two size concepts (confirmed)

| Concept | Example | Drives |
|---|---|---|
| **Chart base size** | 44/45, 50/51, 22/23 | Cast-on stitches, heel height rows, Aufteilung, stitches picked up |
| **Actual size** | 40/41, 37/38, child 18 | Foot-length counts (`Nach dem maschreduzieren nur rechte Runden`), tip configuration |

Evidence: sock-03 and sock-04 both use chart **44/45** (68 Maschen, Ferse 32, 11-12-11, 17 aufnehmen) but actual **40/41** (51 plain rounds) vs **37/38** (45 plain rounds).

sock-02: actual child size **18**, construction from chart **22/23** (44 M, Ferse 20, 7-8-7, 11 aufnehmen), intentionally short cuff/leg/join.

### Size chart (digitize construction rows only)

Source: `planning-input-do-not-commit/size-chart.jpg` (REGIA 4-fädig und Cotton, 2–3 mm).

15 chart sizes: `22/23` … `50/51`.

**Keep as structured data:**
- `anschlagGesamt` / `anschlagProNadel` (e.g. 68 / 17)
- `maschenFuerFerse` (34 for 44/45)
- `fersenhoeheReihen` (32 for 44/45)
- `aufteilung` (three ints: 11-12-11)
- `beidseitigeAufnahme` (17)
- `fusslaengeBisSpitzeCm` (22.5 for 44/45)
- `gesamteFusslaengeCm` (28.5 for 44/45)

**Do NOT digitize** Bandspitze schedule (`In der 4. Runde / jeder 3. / …`) — tip is fully configured per actual size.

Initial values to seed (verify in UI editor against the photo):

| Field | 22/23 | … | 44/45 | … | 50/51 |
|---|---|---|---|---|---|
| Anschlag / Nadel | 44/11 | … | 68/17 | … | 76/19 |
| Maschen für Ferse | 22 | … | 34 | … | 38 |
| Fersenhöhe Reihen | 20 | … | 32 | … | 36 |
| Aufteilung | 7/8/7 | … | 11/12/11 | … | 13/12/13 |
| Beidseitige Aufnahme | 11 | … | 17 | … | 19 |
| Fußlänge bis Spitze | 11.5 | … | 22.5 | … | 25 |
| Gesamte Fußlänge | 14.5 | … | 28.5 | … | 32 |

(All 15 columns transcribed at implementation time into `packages/shared/src/size-chart-seed.ts`.)

### Pattern model

**One pattern** `Käppchenferse` with configurable steps. `"aktuelle Socken"` is a free-text tag, not a pattern version.

A **Pattern** has ordered **Steps**. Each step has:
- `key` (stable id): `cuff`, `leg`, `heel`, `heelKnit`, `heelPurl`, `split`, `pickup`, `postJoin`, `plainFoot`, `tip`
- `titleKey` i18n (e.g. `step.cuff`) + optional `techniqueNoteKey`
- `unit`: `rows` | `rounds` | `once` (Aufteilung / technique-only steps)
- Count source: **configured per actual size** (default values + per-size overrides)

Tip is a **phase** with N sub-rounds, each sub-round fully configured:
```
TipRound { index, title (e.g. "1. Runde"), segments: [{ label, repeats }] }
// sock-03/04: r1 "3 rechts / 1 Abnahme"; r2 "2 rechts, 1 Abnahme" ×2; r3 "1 rechts, 1 Abnahme" ×4
// sock-02:     r1 "2 rechts / 1 Abnahme"; r3 "1 rechts, 1 Abnahme" ×3
// sock-01:     r3 "1 rechts, 1 Abnahme" ×5
```

### Stepped plan (session runtime)

When starting a sock **PairSession**:
- User picks Pattern + Chart base size + Actual size (free-form label).
- App materializes a **SteppedPlan**: list of steps with concrete target counts and tip rounds for that actual size (from pattern/size config).
- Per step, two progress counters (Socke 1, Socke 2) — one sock worked at a time in UI, but pair is tracked together (matches `/////` + `2. Socken` blocks).
- One-click **"Reihe fertig"** increments the active sock's counter (replaces deleting `/`).

### Example materialization

**sock-03** (chart 44/45, actual 40/41):
1. Bund — 40 Reihen
2. Rechte Reihen — 15
3. Ferse — 32 Reihen (Rechte 16 + Linke 16)
4. Aufteilung — 11-12-11 (once)
5. Maschen aufnehmen — 17 (once) + note `Erst zusammen dann verschränkt`
6. Nach dem zusammenstricken — 5 rechte Runden
7. Nur rechte Runden — **51**
8. Maschenreduzieren (tip) — 3 Runden, note `erst verschränkt dann zusammen`
   - 1: 3 rechts, 1 Abnahme
   - 2: 2 rechts, 1 Abnahme ×2
   - 3: 1 rechts, 1 Abnahme ×4

**sock-04** (chart 44/45, actual 37/38): identical steps 1–6 and tip structure, but step 7 = **45**.

**sock-01** (chart 50/51, actual unlabeled → treat as 50/51): Bund 45, leg 15, Ferse 36 (18+18), 13-12-13, 19 aufnehmen, post-join 5, plain **62**, tip 3 rounds with **5** pairs in r3.

**sock-02** (chart 22/23, actual 18): Bund 25, leg 5, Ferse 20 (10+10), 7-8-7, 11 aufnehmen, post-join 3, plain **25**, tip **2** rounds (r1 `2 rechts`, r3 ×3 pairs).

---

## 2. Tech stack (Cloudflare-native TypeScript)

| Layer | Choice | Why |
|---|---|---|
| Runtime / deploy | Cloudflare Workers (`*.workers.dev`) | Free: 100k req/day, static assets free; household scale fits |
| API | Hono | Web-standard, first-class Workers support, tiny |
| DB | Cloudflare D1 (SQLite) | Free: 5 GB, 5M rows read/day, 100k writes/day |
| ORM | Drizzle ORM | TS-first, D1 adapter, migrations |
| Frontend | React 19 + Vite 7 + TypeScript strict | State-of-the-art, fast DX, PWA-friendly |
| Styling | Tailwind CSS v4 | Mobile-first utility CSS |
| Routing | React Router v7 (or wouter if we want smaller) | Boring, well-known |
| Data | TanStack Query | Cache + offline mutation queue hooks |
| Auth | Better Auth + Google OAuth | Runs on Workers/D1 (1.5+), free, no Clerk cost |
| i18n | i18next + react-i18next | DE default, easy EN later |
| PWA | vite-plugin-pwa (Workbox) | Offline knitting UI |
| Unit tests | Vitest + Testing Library | |
| E2E | Playwright | Knitting golden path on mobile viewport |
| Lint/format | Biome (or ESLint+Prettier) | Fast single tool |
| Architecture | dependency-cruiser | Enforce layer boundaries |
| CI/CD | GitHub Actions → `wrangler deploy` | Build, test, deploy on main |
| Local dev | wrangler dev + D1 local + Vite | No cloud needed for M0–M3 |

**Not chosen:** Spring Boot / ASP.NET (JVM free hosting is weak; Workers is the stated target). Next.js-on-Workers is viable but Hono + Vite SPA is simpler and cheaper on CPU (Workers free = 10ms CPU).

### Monorepo layout (pnpm workspaces + turbo optional)

```
KnitHelper/
  AGENTS.md
  CONSTITUTION.md
  README.md
  package.json / pnpm-workspace.yaml
  .github/
    workflows/ci.yml
    workflows/deploy.yml
    PULL_REQUEST_TEMPLATE.md
  docs/
    adr/0001-stack-cloudflare-hono-d1.md
    domain/groessenmodell.md
  .specify/                 # Spec Kit artifacts (optional tooling)
  packages/
    shared/                 # domain types, step keys, size-chart seed, zod schemas
    api/                    # Hono app, D1 schema, Drizzle, auth routes
    web/                    # React PWA (admin + knitting UI)
```

---

## 3. Data model (D1 / Drizzle)

```
users(id, email, name, role[ADMIN|KNITTER], google_subject, created_at)
size_charts(id, name, needle_mm, yarn_note)                    -- e.g. "REGIA 4-fädig"
chart_sizes(id, chart_id, label, anschlag_gesamt, anschlag_pro_nadel,
            maschen_ferse, fersenhoehe_reihen, aufteilung_a, aufteilung_b, aufteilung_c,
            beidseitige_aufnahme, fusslaenge_bis_spitze_cm, gesamte_fusslaenge_cm)
patterns(id, name, name_i18n_key, description, is_template)
pattern_steps(id, pattern_id, sort_index, key, title_i18n_key, technique_note_i18n_key,
              unit, default_count)                              -- unit: rows|rounds|once|tip
pattern_step_size_overrides(id, step_id, chart_size_id_or_actual_label, count)
tip_rounds(id, step_id, sort_index, title)
tip_segments(id, tip_round_id, sort_index, label, repeats)      -- "3 rechts" / "1 Abnahme"
actual_sizes(id, pattern_id, label)                            -- "40/41", "37/38", "18"
actual_size_steps(id, actual_size_id, step_id, count)           -- concrete counts incl. tip
pair_sessions(id, user_id, pattern_id, chart_size_id, actual_size_label,
              status[ACTIVE|DONE|ARCHIVED], created_at, notes)
session_steps(id, session_id, step_id, sort_index, target_count, tip_json,
              sock1_done, sock2_done, unit)
-- optional later: session_events for undo/audit
```

Knitting sessions are **per-user**. Patterns + size charts are **shared** (admins edit; knitters read/use).

---

## 4. App surfaces

### A. Pattern & size management (admin)
- `/admin/patterns` — list, create, edit stepped plan (drag order, counts, tip rounds)
- `/admin/size-charts` — edit digitized chart table (fix any cell)
- `/admin/actual-sizes` — per pattern: label + step counts (seed from sock-01…04)
- `/admin/users` — roles (v1: two admins)

### B. Knitting UI (all roles)
- `/knit` — list my sessions (ACTIVE first)
- `/knit/new` — pick pattern + chart size + actual size → create pair session
- `/knit/:id` — **main screen**:
  - Current step title + technique note
  - Target count (e.g. "51 Runden")
  - Socke 1 / Socke 2 progress (`12/51` with visual ticks)
  - Big **"Reihe fertig"** button (advances active sock)
  - Switch active sock / undo last
  - When both socks complete a step → auto-advance (or "Nächster Schritt")
  - Offline: mutations queued in IndexedDB, synced when online

### C. Auth
- Google OAuth via Better Auth
- First login: if email in allowlist / first user → ADMIN, else KNITTER (or invite)
- Session cookie; API enforces role

### D. i18n
- `de` default (all step titles, UI chrome)
- `en` scaffold from day one (no full translation required in v1)

---

## 5. Project constitution + agentic harness

### `CONSTITUTION.md` (immutable project principles)
1. **Domain truth from sources** — never invent knitting rules; derive from notes/chart or ask.
2. **Chart size ≠ actual size** — keep both; never collapse them.
3. **TypeScript strict** — no `any` in packages/shared or api domain code.
4. **Tests are part of done** — unit for domain materialization; e2e for knitting golden path.
5. **Small, reversible commits** — conventional commits; CI green before merge.
6. **Free-tier first** — design for household load; avoid paid Cloudflare features.
7. **German product language** — domain terms stay (Bündchen, Ferse, Abnahme); UI strings via i18n keys.
8. **Security by default** — role checks on every mutating API; no secrets in repo.
9. **Accessibility / mobile-first** — large tap targets for one-handed knitting use.
10. **Document decisions** — ADR for stack/schema changes.

### `AGENTS.md` (agent operating rules)
- Always read `CONSTITUTION.md` first
- Prefer editing existing files; no drive-by refactors
- Domain questions: consult `docs/domain/groessenmodell.md` and source notes under `planning-input-do-not-commit/` (do not commit those)
- Run `pnpm -r test` + `pnpm lint` before claiming done
- New API routes: zod schema + role guard + unit test

### Quality gates (GitHub Actions CI)
1. `biome check` / lint
2. `tsc --noEmit`
3. `dependency-cruiser` (web ↛ api internals, shared has no I/O)
4. `vitest` (coverage threshold on `packages/shared` domain)
5. `playwright` smoke (knitting complete one step)
6. On main: `wrangler deploy` (preview env per PR optional)

### Spec workflow
Use **GitHub Spec Kit–style** artifacts (constitution once; per feature: `specs/<feature>/spec.md` → plan → tasks → implement → converge). We don't require the Spec Kit CLI; the file discipline is what matters for the harness.

---

## 6. Phased delivery (gates first)

### M0 — Harness only → **G0 (Markus)**
Stop here for architect review **before** any app features.
- `CONSTITUTION.md`, `AGENTS.md`, `docs/adr/0001-stack-*.md`, `docs/domain/groessenmodell.md` draft
- pnpm monorepo stubs (`shared` / `api` / `web`) + Biome + Vitest + dependency-cruiser + GitHub Actions CI
- **No** Google auth, no PWA, no Tailwind polish
- **Accept:** CI green; Markus signs off harness (or we revise CONSTITUTION/AGENTS/CI).
- **Fail-fast:** if harness is wrong, we change it now — cheap.

### M1 — Domain truth, no pretty UI → **G1 (Wife)**
Goal: she can **read** the digital version next to her Notes and say "yes / wrong / missing".
- `packages/shared`: types + `materialize.ts` + size-chart seed (all 15 sizes)
- Seed patterns for sock-01, sock-02, sock-03, sock-04 as **JSON fixtures + a tiny printable plan view** (markdown/HTML dump is enough)
- Side-by-side artifacts:
  - `docs/domain/vergleich-sock-01.md` … `vergleich-sock-04.md` (txt structure ↔ generated plan)
  - or a single `/preview` page listing steps + counts + tip rounds (no edit UI yet)
- **Accept:** Wife compares each sock-0N plan to her note; corrections go into fixtures before we build editors.
- **Fail-fast:** wrong domain model is the most expensive bug — catch it here.

### M2 — Thin knitting loop (local, no login) → **G2 (Wife)**
- Create session: pick chart size + actual size (from seeded set)
- Active-step screen: title, note, `12/51`, Socke 1 / Socke 2, big **Reihe fertig**, undo
- In-memory or localStorage only (still no Better Auth / offline sync)
- Playwright: complete one step on mobile viewport
- **Accept:** She knits a real swatch/sock section and confirms the tap UX beats deleting `/`.
- **Fail-fast:** if the step/tip UI is wrong, fix before investing in sync/auth.

### M3 — Management + auth + persistence (only after G2)
- D1 + Drizzle, pattern/size admin CRUD, Google login, ADMIN/KNITTER
- Role guards + API tests
- **Accept:** Two admins can edit patterns; knitter role cannot.

### M4 — Offline PWA + deploy polish
- vite-plugin-pwa, mutation queue, `wrangler deploy` to `workers.dev`
- i18n keys complete (DE), EN scaffold
- **Accept:** Phone install + airplane-mode tick + sync; production URL works.

**Iteration cadence:** each M* is a PR-sized slice; after G0 and G1 we pause for feedback even if later work could start in parallel. Polishing (Tailwind theme, animations, export PDF, general txt import) is explicitly **deferred**.

---

## 7. Critical files (to create)

| Path | Purpose |
|---|---|
| `CONSTITUTION.md` | Non-negotiable principles |
| `AGENTS.md` | Agent/dev operating rules |
| `docs/domain/groessenmodell.md` | Chart vs actual size + sock-01…04 mapping |
| `docs/domain/vergleich-sock-0N.md` | Note ↔ generated plan side-by-side for wife review (G1) |
| `packages/shared/fixtures/sock-01.json` … `sock-04.json` | Seeded stepped plans from her notes |
| `docs/adr/0001-stack-cloudflare-hono-d1.md` | Stack decision |
| `packages/shared/src/size-chart-seed.ts` | Digitized chart (15 sizes) |
| `packages/shared/src/domain.ts` | Types: Pattern, Step, Tip, PairSession |
| `packages/shared/src/materialize.ts` | Build SteppedPlan from pattern+sizes |
| `packages/api/src/schema.ts` | Drizzle schema |
| `packages/api/src/routes/*.ts` | patterns, sizes, sessions, auth |
| `packages/web/src/pages/knit/ActiveSessionPage.tsx` | Main knitting UI |
| `.github/workflows/ci.yml` | Quality gates |
| `.github/workflows/deploy.yml` | wrangler deploy |

---

## 8. Verification (gate-aligned)

| Gate | How we verify |
|---|---|
| **G0** | CI green; Markus reads CONSTITUTION.md / AGENTS.md / ADR and either approves or requests edits before M1 |
| **G1** | Wife walks sock-01…04 fixtures vs her Notes; any mismatch → fix domain/fixtures before M2. Unit tests lock materialize() for plain=51/45/62/25 and tip shapes |
| **G2** | Wife uses thin UI on phone for a real step; Playwright smoke for "Reihe fertig" + undo |
| **M3** | API role tests (KNITTER cannot mutate patterns); user A cannot read user B sessions |
| **M4** | Offline tick survives reload; `wrangler deploy` smoke on phone; free-tier usage check |

Domain unit tests (keep green after G1):
- materialize sock-03 → plain=51, tip 3 rounds / 4 pairs
- materialize sock-04 → plain=45 (same chart base 44/45)
- materialize sock-02 → tip 2 rounds
- materialize sock-01 → plain=62, tip r3 ×5
- chart 44/45 fields match the digitized table

---

## 9. Open items (non-blocking)

- Exact Google OAuth client setup (Cloudflare vs Google Cloud console) during M3.
- Whether `Rechte Reihen` after cuff is always preference (5 vs 15) or child-size rule — modeled as configurable either way.
- Import of the four txt files is **seed/reference only**, not a general txt parser.
- Bandspitze chart row intentionally omitted (user choice).

---

## 10. Summary

Cloudflare-native TypeScript monorepo (Hono + React/Vite + D1 + Better Auth) with Spec Kit–style constitution/harness. Domain keeps **chart base size** vs **actual size** distinct; one pattern with configurable steps and fully configured tip rounds; pair sessions with one-click row confirmation and offline PWA for the knitting UI.

**Fail-fast order:** G0 harness (Markus) → G1 domain fixtures vs Notes (wife) → G2 thin knitting tap UX (wife) → only then auth/persistence/offline/deploy (M3–M4). Polish is deferred until the gates pass.
