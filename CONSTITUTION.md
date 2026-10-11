# KnitHelper Constitution

Immutable project principles. Agents and humans must not violate these to “finish a task”.
Change requires an ADR + human approval.

## 1. Domain truth from sources

Never invent knitting rules. Derive counts, steps, and terminology from:

- `docs/reference/` (REGIA 4-fädig PDF)
- `docs/domain/groessenmodell.md` and fixtures under `packages/shared/src/fixtures/`
- Explicit user / domain-expert confirmation

If a rule is unclear: **ask**, do not guess.

## 2. Chart size ≠ actual size

Keep both concepts distinct at every layer (types, DB, UI, tests):

- **Chart base size** (e.g. 44/45) → stitch construction (Anschlag, Ferse, Aufteilung, Aufnahme)
- **Actual size** (e.g. 40/41, 37/38, 18) → foot-length counts and tip configuration

Collapsing these is a defect.

## 3. TypeScript strict

`strict: true`, no `any` in `packages/shared` domain code and `packages/api` domain code.
Public boundaries use zod (or equivalent) validation.

## 4. Tests are part of done

- Domain materialization (`materialize.ts`) always covered by unit tests
- API mutations: role-guard tests
- Knitting golden path: Playwright smoke before calling M2 “done”
- A change is not done if tests are missing for new domain behavior

## 5. Small, reversible commits

Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`).
CI green before merge. No `--no-verify`. No force-push to `main`.

## 6. Free-tier first

Household scale (2–10 users). Prefer Cloudflare free tier (Workers, D1, R2).
Do not introduce paid-only Cloudflare features or heavy compute without an ADR.

## 7. German product language, English technical code

Domain **display** text stays German (Bündchen, Ferse, Abnahme, …) in names, titles, tags, notes, and i18n strings.

**Technical code is English only:** type names, field names, enum values, i18n/technique keys, API routes, DB columns.

- `stitch: "knit" | "purl" | "mixed" | "none"` — not `"rechte"`
- `techniqueNoteKey: "note.pickup_together_then_twisted"` — not `"note.…verschraenkt"`
- Chart fields: `castOnTotal`, `heelSplit`, `tipSchedule.fourthRound`, …

UI strings still go through i18n keys (`de` default).

## 8. Security by default

- Role checks on every mutating API route (`ADMIN` vs `KNITTER`)
- Users only read their own knitting sessions
- No secrets in the repo; Google OAuth credentials via env / wrangler secrets

## 9. Mobile-first, accessible

Large tap targets, readable at knitting distance, works one-handed.
The knitting UI optimizes for **one tap = one finished row**.

## 10. Document decisions

Architecture or schema changes need a short ADR under `docs/adr/`.
Principle changes amend this file **and** get an ADR.

---

## Review gates (process, not content)

| Gate | Owner | Passes when |
|---|---|---|
| G0 Harness | Markus | Constitution + AGENTS + CI accepted |
| G1 Domain truth | Wife | sock-01…04 fixtures match Notes |
| G2 Knitting feel | Wife | Tap UX beats deleting `/` |
| G3 Product | Both | Auth/offline/deploy approved |
