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

## 2026-11-18 — Round 2 feedback and round 3 (C1 repeat)

- Feedback: owner chat plus the knitter's answers in a Word copy of
  `vergleich-de.md` (extracted with a local script in the session scratchpad;
  the file stays outside the repo). Recorded as r01–r14 in
  `feedback/round-2.md`, committed before triage (`7bebac3`); one sentence
  with a baby's birth month and wear dates omitted (public repo).
- Triage: r01–r03 extension → FR-013–FR-015, T011–T015; r04 → pairs fit
  their larger size; r06 → 50/51 pair relabelled 45/46 in the data set;
  r11 gauge, r12 gusset (4 per round) → `pairs.mjs`; r13 → 30/31 note out;
  r05/r08/r09 → recorded; open: r06 vs r14 (76/72), r12 rhythm, r07 fit at 27,
  r10 details, 45/46 length fit; round-2 Q1/Q2 owner decisions not stated.
- Sources (lead via web-fetch agents, generic queries only): Falke and
  Sterntaler size tables on bergfreunde.de → [S11], [S12]; odd/even pairs.
- `node specs/002-sizing-research/pairs.mjs` exit 0: length share adult
  0.806, baby 1.032; test pairs 17/18 −1, 19/20 −1, 37/38 0, 39/40 +2,
  45/46 −2 (in sample); width adult 77–83% of girth estimate.
- Reviewer (fresh context): B1 blocker — "gauge confirms the length" was
  circular (the share is rounds per cm of foot; the gauge cancels; 4.19 vs
  4.28 compares different quantities). Fixed: claim removed in report 13.3,
  round report and German summary; width named as the only gauge-dependent
  check and it is tighter than advice. Should-fix fixed: S1 leave-one-out
  3/5 within ±2 added; S2 72/76 conflict kept open (report, domain doc);
  S3 45/46 length fit added to Not stated and question 2; S4 pair scheme
  marked pending the owner (spec, FR-013, domain doc), 44/45 → 43/44 + 45/46
  explained, Sterntaler EU-number note; S5 ca. 17 named in the 17/18 hint.
  Nits fixed: "etwas knapp", gusset column note in bold rows, last-round 2
  stitches, T010 duplicate, FR order, SC-003, How-to-answer and fresh-start
  lines, 30/31 wording. Reviewer re-fetched both pages: [S11], [S12] accurate.
- Word copy for the knitter: `vergleich-paare-de.md` → HTML → Word (COM),
  landscape, 4 pages, PDF render checked; saved to the owner's Downloads
  folder (not in the repo).
- `pnpm verify` exit 0 (after fixes); Biome clean on the research folder;
  `pairs.mjs --de` equals both tables in `vergleich-paare-de.md`.

## 2026-11-19 — Round 3 partial feedback

- r16 (two branches, fresh session) answered in chat; the 001 branch STATUS
  now describes both features; plan: after the 001 merge, 002 moves back
  into the main folder. r17 (wool relaxes in wear): not considered before;
  wording in report 13.3, round-3 report and German table now names it as
  one possible reason, proposals unchanged. Word copy rebuilt (4 pages) and
  replaced in the owner's Downloads folder. Recorded in
  `feedback/round-3.md` (partial). r15 (001 acceptance) is on the 001 branch.

## 2026-11-19 — C1 accepted (round 3) and publish

- Owner: Q1 pairs yes, Q2 go for 003, Q3 docs-only PR "focused on the
  essential information required to reproduce or extend the calculation".
  Knitter: 39/40 → 50, 45/46 = 76 and fits, gusset rule confirmed (every
  round, 4), growing room right, 47/48–49/50 later, 27/28 next. Recorded as
  r18–r26 (`8dc1aae`) before triage; no row verdicts → all rows accepted.
- Triage → T016: `pairs.mjs` rewritten as the single reproducible model
  (data, Bündchen least-squares fit and length shares computed at run time,
  rules, `CHOSEN` 39/40 = 50, `--pair`, leave-one-out reproducing the
  reviewer's 3/5); `report.md` condensed from ~690 to ~110 lines;
  `vergleich-paare-de.md` is the agreed table; round-2 `model.mjs` and
  `vergleich-de.md` removed (in git at `0013eac`); planning files marked
  superseded; domain data set updated. All pair values equal round 3 except
  39/40 (50, her choice). Shares not refitted with 50 (would be 0.811).
- r23 and r25 go to 003; r26 (30/31 fit) later.
- T010 ticked. STATUS written as the state after both PRs merge (built from
  the 001 branch STATUS; only STATUS conflicts when the second PR merges).
