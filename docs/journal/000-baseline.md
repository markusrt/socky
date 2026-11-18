# Journal: 000-baseline (process adoption)

Append-only evidence. Newest entry last.

## 2026-11-14 — Adopt mvp-starter, retire MiMo Code

**Decisions** (owner interview, Q1–Q25, all accepted; recorded in ADR 0004
and ADR 0005):

- MiMo Code retired; the repository is the only memory.
- Take mvp-starter's process, keep Socky's structure (no template manifest).
- Order: rescue MiMo-only knowledge, adopt the process, then features.
- Publish choice `expert-review`; protect `main` after the first merge.
- Owner Markus (technical); the knitter accepts domain/feel changes (P2).
- Domain authority: her rules first, REGIA as reference, computed counts
  marked "berechnet" until she accepts them (P1).
- Web origin stays on GitHub Pages; a later move to Cloudflare happens only
  between sock projects, no browser-data import (ADR 0005).

**MiMo inventory** (`~/.local/share/mimocode/`): last Socky session
`ses_ffe5ec12…` ("GitHub Pages Deployment Next Steps") had ended cleanly with
`7f34fab` pushed; its checkpoint text was stale. Git: clean, no stashes,
branches or worktrees. Knowledge found only in MiMo moved into
`docs/domain/groessenmodell.md`, `AGENTS.md` and `docs/history/original-plan.md`.

**Her original notes** (sock-01…04, chart screenshot) existed only in
`mimocode.db`; extracted to the owner's private folder outside the repo. Umlauts
had already been lost by MiMo (U+FFFD); restored by context for "Größe",
"Bündchen", "verschränkt" only.

**Safety net** (commit `59c3b2f`): frozen fixture of the stored format
generated once from shared code at `6dd5669` (sessions: 40/41 mid-foot on
sock 1; 15 with sock 2 inside the tip; 18 finished).

- Mutation check: renaming the key to `Socky.sessions.v2` failed 3 of 4
  storage tests (restored afterwards).
- `pnpm exec playwright test`: 6 passed (3 tests × desktop + Pixel 7) after
  fixing two test-side selector mistakes (cast-on uses "Fertig").
- `pnpm verify`: exit 0 after every commit on the branch.

**Process layer** (commit `a49589c`): mvp-starter @39ad7c4 vendored and adapted
(monorepo paths, data-safety task T001, `ship.mjs` watches "Deploy GitHub
Pages"). `ship --dry-run` refused a dirty worktree as designed; Spec Kit
`check-prerequisites.sh --help` runs under Git Bash with LF endings.

**Context**: one long session (interview + execution).
