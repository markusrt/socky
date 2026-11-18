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
