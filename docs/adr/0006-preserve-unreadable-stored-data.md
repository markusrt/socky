# ADR 0006 — Preserve unreadable stored data; check stored pairs with a schema

## Status

Accepted (2026-11-18) — feature `001-storage-safety`, owner interview Q3–Q5

## Context

- The knitter's progress lives only in localStorage `Socky.sessions.v1`
  (amendment P4). Before this decision, `loadSessions` returned `[]` when the
  stored text could not be parsed, and the next tap overwrote it for good.
- Stored pairs were cast to `PairSession` without any check, so one damaged
  pair could break the home list or the knitting view.
- Failed writes (storage full, private mode) were silent.

## Decision

1. **Check, don't rewrite.** `storedPairSessionSchema` (zod, `packages/shared`)
   decides whether a stored pair is readable. It allows unknown fields and is
   used for checking only: the app keeps the original objects, so re-saving
   never strips fields written by another app version.
2. **Preserve before any write.** When the stored text is unreadable or holds
   damaged pairs, the exact text is copied to a new key
   `Socky.unreadable.v1.<ISO time>` as
   `{ foundAt, raw, damagedCount, totalCount, dismissed }`, unless an identical
   copy exists. Only after that may the next save write the readable pairs back
   to `Socky.sessions.v1`.
3. **Write-block.** If the copy cannot be stored, or storage cannot be read at
   all, the app does not write `Socky.sessions.v1` for the rest of the page
   life; counting continues on screen and "Fortschritt wurde nicht
   gespeichert" shows.
4. **Never delete copies.** The app only sets `dismissed: true`; removing a
   copy is an owner task (browser developer tools).
5. Saves return `{ ok }`, which drives the not-saved notice. On start the app
   asks the browser for persistent storage (fire-and-forget).

## Consequences

- New stored key prefix: frozen fixture `storage-fixtures/unreadable-copy-v1.json`
  plus `sessions-v1-damaged.json`; `sessions-v1.json` is unchanged and still
  loads with no notice.
- Each finding costs one copy of her data in storage (a few KB).
- Copies accumulate only when new damage occurs; no cleanup UI exists.

## Alternatives considered

- Strict schema that strips unknown fields: silent data loss on re-save.
- One key holding an array of copies: a failed rewrite could damage all copies.
- Refusing to start until the owner fixes the data: blocks her knitting.
- IndexedDB for copies: more code, same origin limits.
