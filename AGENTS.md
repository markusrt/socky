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

## Commits & ADRs

**During feature development (on a branch):** prefer **small commits in sensible slices** (Constitution §5). A slice is a coherent step: one behavior fix, one migration step, one docs sync — not one file, and not the whole feature.

**When wrapping up a named task** (“commit the X work / X changes”): that means the **full outcome of X** (code, deps, lockfile, docs, ADRs) in the commits you create for it — unless the user names files to exclude. “Only X” = don’t mix in unrelated pending work, not strip X down.

- Do not invent extra commits/ADRs just to make pieces smaller; do not merge independent slices into one dump either.
- **One ADR per decision theme.** A single toolchain/process move (e.g. Node bump + the majors that go with it) is one ADR, not one per package.
- Commit scoping is ambiguous → ask.

## Keep docs in sync (every feature)

With each feature/fix that changes behavior or data model, update in the **same change**:

1. **`docs/SPEC.md`** — add/adjust the requirement row (what + where implemented)
2. **`docs/STATUS.md`** — “What works” / “Open” if session-relevant
3. **`packages/shared/data/…` + tests** — if domain data changed
4. **ADR** under `docs/adr/` — if architecture/schema/process changed (one ADR per decision theme; see “Commits & ADRs”)
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
- UI strings: German display text lives in `packages/shared/src/labels.ts` (domain labels) and the web components; no i18n library yet. Technical keys stay English.
- Conventional commits

## Architecture boundaries (dependency-cruiser)

- `shared` must not import `api` or `web`
- `api` must not import `web`
- `web` must not import `api` internals (HTTP only)
- No I/O in `shared`

## Agent memory

The repo is the only source of truth (`docs/STATUS.md` for handoff). MiMo Code is retired for this project; do not read or write its memory.

## Knitting domain cheat-sheet

- Base pattern **REGIA 4-fädig** (Käppchenferse); chart size drives construction + tip
- Actual size drives plain-foot row counts
- Wife knits on **2 needles** (`anschlagProNadel2`)
- Tip: chart Bandspitze first three rows only; “In jeder Runde” close is not counted
- A **pair session** tracks two socks (Socke 1 / Socke 2); UI knits one sock at a time
- “Reihe fertig” increments the active sock’s counter for the current step
- Wording: **Reihen** everywhere, tip uses **Runden** (“N Runden”, never “N rechte Runden”); buttons `rows` → Reihe fertig, `once` → Fertig, close → Socke fertig
- Knit UI shows only her configured counts — no chart hints next to them
- Aufteilung always from the chart base size; chart Fußlänge cm is reference only
- Trap: chart 40/41 = 10-12-10, but actual 40/41 on chart 44/45 = 11-12-11
- Details: `docs/domain/groessenmodell.md` → “Display and wording rules”

## Toolchain & Windows notes

- pnpm missing from PATH → `corepack enable` then `corepack prepare pnpm@9.15.9 --activate`
- pnpm version lives only in `package.json#packageManager`; never also set `version:` on `pnpm/action-setup` (Actions fails with “multiple pnpm versions”)
- `Start-Process pnpm` fails on Windows; use `pnpm.cmd`
- Node 24 prints `DEP0169` (`url.parse()`) during pnpm runs — harmless
- PowerShell `-replace` is case-insensitive — never bulk-replace package scopes with it
- After large renames: `pnpm exec biome check --write .`, then `pnpm verify`
- `exactOptionalPropertyTypes` is on: never assign `undefined` to an optional field; conditional spread still fails when the value is `T | undefined` — narrow first
- `gh run view <id> --log-failed` can return empty → read the job summary instead
- Keep TypeScript on 6.x until dependency-cruiser supports TS 7 (it silently crawls almost nothing under 7) — ADR 0003
- Better Auth on Workers: needs `nodejs_compat`; uses native D1 (no Drizzle); `advanced.database.validateSchema: false` plus try/catch in `resolveUser` so a schema mismatch fails closed (401), not 500
