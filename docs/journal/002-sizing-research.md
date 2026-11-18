# Journal — 002-sizing-research

Append-only. Commands, outcomes, decisions and evidence for this feature.

## 2026-11-18 — interview round 1

Earlier owner decisions (2026-11-14): Q21 her rules, not REGIA, are the
basis; a "berechnet" mark until she accepts; research results may become a
future standard (ADR). Q24 domain authority (amendment P1). Her new notes live
in the owner's private folder outside the repo.

Round 1 answers ("yes" accepts the recommendation):

| Q | Topic | Decision |
| --- | --- | --- |
| Q7 | 30/31-chart note for actual 24 | Owner: the socks fit very long at the time, are now too small; the child's foot is now 27. She will check how the foot part fits. Maybe knitted more densely then; unknown. → uncertain point, not used for fitting |
| Q8 | Range | EU 15 to 50/51 |
| Q9 | Input | Shoe size (EU) main input; measured foot length cm optional override |
| Q10 | Yarn/needles | Same yarn and needle size in all notes; needle size to follow if known |
| Q11 | Output | Every count, marked "berechnet" |
| Q12 | Review | Report for the owner; German comparison table for her; notes as key points in `docs/domain/` without names |

Team decisions: research runs as a separate research agent on the Fable
model; web searches carry no personal data; 001 and 002 ship as separate PRs.

First look at the notes (lead): the 30/31 note matches REGIA 30/31
construction exactly (52 M, 8-10-8, 24 heel rows); interpolating her foot
rows (19-20 → 29, 39/40 → 48) puts 40 rows near a 30/31 foot, not a 24.

`/speckit-specify` → `specs/002-sizing-research/spec.md` (US1–US4,
FR-001–FR-012, SC-001–SC-006); quality checklist passed in one pass.

Open for the knitter: how the foot part of the 30/31-chart socks fits the
size-27 foot now.

## 2026-11-18 — planning

- Clarify: skipped; the interview (Q7–Q12 plus 2026-11-14 Q21/Q24) settled
  every open point, no `[NEEDS CLARIFICATION]` left.
- `/speckit-plan` → plan.md, research.md (D1–D6), data-model.md,
  contracts/sizing-model.md, quickstart.md. Constitution check: all pass.
- Tasks: T001–T010 (Spike, one C1 GATE).
- Analyze (manual coverage pass): FR-001→T002/T003, FR-002→T002,
  FR-003/004/005→T005, FR-006→T006, FR-007→T004, FR-008→T005/T008,
  FR-009→T009, FR-010→T008, FR-011→T001, FR-012→T003/T004; SC-001–SC-006
  covered by T002/T006/T004/T009/T010. No gaps.

## 2026-11-18 — implementation

- T001: no stored-data impact (no change to `packages/`, storage key, shape,
  step/note keys or deploy origin).
- T002/T004–T006/T008/T009 by the research agent (Fable, separate worktree
  `../KnitHelper-002`, about 28 min): `docs/domain/gestrickte-groessen.md`
  (10 sizes, conflicts C1–C8), `model.mjs`, `vergleich-de.md`. The harness
  refused the agent's write of `report.md` (subagents return reports as
  text); the lead saved the returned draft verbatim apart from the status
  line and the last limits bullet (now pointing to this journal).
- T003 lead check: every count of the data set traced to its source: size
  files 15/18/37-38/40-41/50-51 (counts and size-15 construction) and the five
  private notes (read by the lead earlier today) — all match. Privacy grep for
  names and tally marks in `docs/domain/gestrickte-groessen.md` and
  `specs/002-sizing-research/`: no hits.
- T007 lead review: `node specs/002-sizing-research/model.mjs` exit 0 ("every
  deviation and every decrease has a recorded explanation"); `--size 27`
  matches the report's worked example (56 M, 26 heel rows, 9-10-9, foot 37);
  `--de` output equals `vergleich-de.md`; Biome (main checkout binary, run in
  the worktree) clean.
- Result: construction rules match 9/9 certain sizes (Bündchen 7/9, ±1);
  foot rows within ±2 for 8/9 in sample (SC-002 met), leave-one-out 5/8;
  50/51 off by 11 (open question Q1). Recommendation: go for 003 with
  conditions (proposals only, constants as data, Q1/Q2 first).

## 2026-11-18 — C1 handoff (round 2)

- Reviewer (fresh context): no blockers. Refit all lines independently
  (baby, adult, Bündchen, leave-one-out 5/8 reproduced), hand-checked R1–R10
  for 27, 42, 40/41, confirmed `vergleich-de.md` table = `--de`, data set =
  notes + size files, privacy clean (no name, no tallies, no private paths).
- Should-fix, all fixed: line B wording (all five adult socks, not "43-45
  left out"); 50/51 used for R1 bands but excluded from R9c → Q1 now decides
  46–51 stitch bands too (§6, §10 condition 4, Q9); §10 qualified (R2–R8
  9/9, R1 interpolated; 8/9 in sample vs 5/8 leave-one-out); this branch's
  STATUS carried over from 001 with round 2.
- Nits fixed: German table "Reihen/Maschen" sentence, softened "Babysocken
  reichlich lang" to a computed statement, "ca. 15/17" note, 117–129% for her
  knitted baby sizes, "By the counts, babies grow …". Left for 003: pin model
  values in unit tests (EXPLAINED_DEVIATIONS keyed by id), `--size abc` NaN,
  provenance string outside the contract enum; addi "20/21" chart label not
  re-checked against the source; "Fable" model naming kept (it is the tier
  alias used for the research agent).
- `pnpm install --frozen-lockfile` in the worktree, `pnpm verify` exit 0
  (shared 27, web 4, api 6 unit tests; Playwright 6 — main's suite, this
  branch changes no app code).
- No dev-server step: Spike changes no app code (FR-011).
