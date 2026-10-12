# AGENTS.md — Socky operating rules

Read `CONSTITUTION.md` first. It overrides convenience.

## Project shape

```
packages/shared   domain types, size-chart seed, materialize(), session(), JSON actual-sizes
packages/api      Hono on Cloudflare Workers (+ D1/auth later)
packages/web      React + Vite Socky knitting UI
docs/SPEC.md      implemented requirements (keep updated)
docs/STATUS.md    handoff / current state
docs/adr/         architecture decision records
docs/domain/      size model + note comparisons
docs/reference/   REGIA PDF + design concept
```

## Workflow

1. Prefer the smallest slice that answers the current **review gate** (see Constitution).
2. Prefer editing existing files over creating new ones.
3. Domain questions: read `docs/domain/groessenmodell.md`, `docs/reference/`, and fixtures; if still unclear, ask.
4. Do not invent sizes, counts, or tip schedules.

## Keep docs in sync (every feature)

With each feature/fix that changes behavior or data model, update in the **same change**:

1. **`docs/SPEC.md`** — add/adjust the requirement row (what + where implemented)
2. **`docs/STATUS.md`** — “What works” / “Open” if session-relevant
3. **`packages/shared/data/…` + tests** — if domain data changed
4. **ADR** under `docs/adr/` — if architecture/schema/process changed
5. Domain cheat-sheet below — if knitting rules changed

Do not ship a feature and leave SPEC/STATUS stale.

## Before you claim done

```bash
pnpm verify
```

Playwright is required for knitting UI changes (M2+).

## GitHub (use `gh` CLI)

Preferred for CI/release investigation (do not guess from the UI):

```bash
gh run list --limit 5
gh run view <id> --log-failed
gh run watch <id>
gh pr checks
gh release list
```

Push only when the user asks. After a CI failure: `gh run view <id> --log-failed` first.

## Code rules

- TypeScript strict; no `any` in shared/api domain code
- German only in user-facing strings; technical identifiers English (Constitution §7)
- New API route: zod input schema + role guard + unit test
- New domain field: update fixtures + `materialize` tests in the same change
- UI strings: i18n keys only (`packages/web/src/i18n/`)
- Conventional commits

## Architecture boundaries (dependency-cruiser)

- `shared` must not import `api` or `web`
- `api` must not import `web`
- `web` must not import `api` internals (HTTP only)
- No I/O in `shared`

## Agent memory (MiMoCode)

- Project MEMORY: `C:\Users\Markus\.local\share\mimocode\memory\projects\global\MEMORY.md`
- Session notes: `…/memory/sessions/<session-id>/notes.md`
- Repo is the **source of truth** for product spec (`docs/SPEC.md`, `docs/STATUS.md`); MEMORY is a short handoff cache.

## Knitting domain cheat-sheet

- Base pattern **REGIA 4-fädig** (Käppchenferse); chart size drives construction + tip
- Actual size drives plain-foot row counts
- Wife knits on **2 needles** (`anschlagProNadel2`)
- Tip: chart Bandspitze first three rows only; “In jeder Runde” close is not counted
- A **pair session** tracks two socks (Socke 1 / Socke 2); UI knits one sock at a time
- “Reihe fertig” increments the active sock’s counter for the current step
