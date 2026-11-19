# Research: Storage safety

## R1 — How to decide a pair is damaged

- **Decision**: a zod schema in `@socky/shared` checks the fields the app needs
  to show and continue a pair (`id`, `actualSizeLabel`, `chartSizeLabel`,
  `status`, `activeSock`, `steps[]` with `stepKey`, `unit`, `targetCount`,
  `sock1Done`, `sock2Done`, …). Unknown extra fields are allowed. The schema
  is used for **checking only**: the app keeps the original object, so a
  re-save never strips fields.
- **Rationale**: P5 (zod at boundaries); zod is already a shared dependency;
  passthrough avoids silent data loss from future fields.
- **Alternatives**: hand-written type guard (more code, easier to drift from
  the type); strict schema (would strip or reject future fields).
- **Check**: the frozen `sessions-v1.json` must pass the schema unchanged.

## R2 — Where the preserved copy lives

- **Decision**: a new localStorage key per finding,
  `Socky.unreadable.v1.<ISO timestamp>`, holding
  `{ foundAt, raw, damagedCount, totalCount, dismissed }`. Written on load,
  **before** any save. If writing the copy fails, the session goes
  write-blocked: no save to `Socky.sessions.v1` for the rest of the page
  life, and the not-saved notice shows.
- **Rationale**: FR-002/FR-003; each finding keeps its own copy (no
  replacement); timestamped keys need no list maintenance.
- **Alternatives**: one key with an array (a failed rewrite could damage all
  copies); IndexedDB (more code, same origin limits).

## R3 — When the main key is rewritten

- **Decision**: after the copy is safely stored, the next normal save writes
  only the readable pairs to `Socky.sessions.v1`; the damaged ones live on in
  the preserved copy. No save happens on load itself.
- **Rationale**: the main key returns to a clean state so the next start
  needs no repeated preservation; nothing is lost because the full original
  is preserved.

## R4 — Save failures

- **Decision**: `saveSessions` returns `{ ok: true } | { ok: false }`
  (catching `QuotaExceededError`, `SecurityError`, any throw). App state keeps
  the on-screen progress; a `saveFailed` flag drives the notice and clears on
  the next successful save.

## R5 — Persistent storage

- **Decision**: `navigator.storage?.persist?.()` once on start in `main.tsx`,
  fire-and-forget, errors ignored. No UI.
- **Rationale**: FR-010; Safari 17+ and Chrome support the call; whether it
  exempts data from Safari's 7-day script-storage cap is not documented as a
  guarantee, so the round report says "reduces the risk", not "prevents".

## R6 — Copy to clipboard

- **Decision**: `navigator.clipboard.writeText(raw)`; on rejection or absence,
  show the raw text in a read-only, pre-selected textarea.
- **Rationale**: FR-005; iOS Safari allows clipboard writes inside a tap.

## R7 — Notice dismissal

- **Decision**: "Ausblenden" sets `dismissed: true` on the preserved copy
  record (no deletion); the notice shows while any copy is undismissed.
- **Rationale**: FR-006; survives reloads without nagging.
