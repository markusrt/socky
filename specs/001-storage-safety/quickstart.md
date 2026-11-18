# Quickstart: check storage safety

Prerequisites: `pnpm install --frozen-lockfile`, Playwright Chromium installed.

1. `pnpm verify` — includes the new schema/storage unit tests and
   `packages/web/e2e/storage-safety.spec.ts` (desktop + Pixel 7).
2. Manual check (desktop): `pnpm dev:web`, open http://localhost:5173, then
   in the browser console:
   - `localStorage.setItem("Socky.sessions.v1", "[{\"id\":")` → reload → notice
     "Gespeicherte Strickstände konnten nicht gelesen werden. Nichts wurde
     gelöscht." with "Daten kopieren".
   - Start a new pair, tap "Reihe fertig", reload → the new pair is there and
     a `Socky.unreadable.v1.*` key still holds `[{"id":`.
3. Failed save: in Playwright, storage writes are made to throw → "Fortschritt
   wurde nicht gespeichert" appears; the count still advances.
4. Normal case: the frozen fixture resumes "20 / 51" with no notice (existing
   `knitting.spec.ts`).
