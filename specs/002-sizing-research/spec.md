# Feature Specification: Sizing research

**Feature Branch**: `002-sizing-research`

**Created**: 2026-11-18

**Status**: Accepted (C1, round 3, 2026-11-19)

**Spec Language**: en

**Delivery mode**: Spike (C1 only, time-boxed; research, no app change)

**Input**: User description: "Research a sizing model that proposes every count for a new sock size (baby to adult, EU 15 to 50/51) from the shoe size or a measured foot length, fitted to the knitter's established rules and knitted sizes rather than the REGIA chart, checked against public foot-size data, with test cases and a German comparison table for her." (Owner interview 2026-11-14 Q21/Q24 and 2026-11-18 round 1, Q7–Q12; see `docs/journal/002-sizing-research.md`.)

## Context

Socky knows a handful of sizes the knitter has actually knitted. Her rules already depart from the REGIA 4-fädig chart, especially for foot length (constitution amendment P1). To knit a size she has not knitted yet, she needs proposed counts she can trust. This spike answers one central question:

> Can a sizing model reproduce every size she has knitted (or explain each deviation) and propose plausible counts for any EU size from 15 to 50/51?

The result is a go/no-go for `003-size-generator`, which would put the model into the app. Every value the model proposes is a proposal marked "berechnet" until she accepts it; promoting the model to a standard needs a later ADR (P1).

## Clarifications

### Session 2026-11-18 (round 2 feedback, r01–r14)

- Q: Which unit should proposals use? → A: Commonly sold size pairs for babies, children and adults; a pair fits its larger size (r01, r04). Odd/even 15/16 … 49/50 accepted 2026-11-19 (r18). FR-013.
- Q: Is her gauge consistent with foot data? → A: Check her gauge (36 stitches, 52 rows per 10 cm, 2.25 mm; r11) against the cited foot length and girth data. FR-014.
- Q: For which foot was the 50/51 pair knitted? → A: 45/46, with 76 stitches (r06); 72 in r14 is asked again.
- Q: Growing room for children's socks? → A: Some growing room is good (r07).
- Q: Children's preference counts (Bündchen, Rechte Reihen, rows after joining)? → A: The computed ones fit; the uncertain 30/31 note is discarded (r13).
- Q: Gusset decrease? → A: Every round, one stitch at each edge of each needle, 4 per round, until the cast-on count is back (r12, r23).
- Q: 45/46 stitches? → A: 76; the length fits (r22). 39/40 foot rows? → A: 50 (r21).
- Q: Sizes above 45/46? → A: Not needed now; must stay computable (r25).
- Q: Publish? → A: Docs-only PR, focused on what is needed to reproduce or extend the calculation (r20).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Her knitted sizes are documented as data (Priority: P1)

Markus has every size she has knitted (from the earlier notes, the size files already in the app, and her new handwritten notes) as one comparable table of counts, with each value's source, so the model can be checked against her real work.

**Why this priority**: Without a clean data set there is nothing to fit or test against; this is the first task of the spike.

**Independent Test**: Every count in the table can be traced to a note or an existing size file; the raw notes are not in the repository and no personal names appear.

**Acceptance Scenarios**:

1. **Given** her new notes (about 17, 19-20, 30/31 chart for actual 24, 39/40, 43-45) and the existing sizes (15, 18, 37/38, 40/41, 50/51), **When** the data set is written, **Then** each size lists chart size, cast-on, Bündchen, Rechte Reihen, Ferse, Aufteilung, picked-up stitches, rows after joining, foot rows and tip, with its source.
2. **Given** the 30/31-chart note for actual size 24, **When** it is recorded, **Then** it is marked "uncertain" with the reason (see Edge Cases) and is excluded from fitting.
3. **Given** a note that differs from a size file already in the app, **When** the data set is written, **Then** the difference is listed as an open question for her, not silently resolved.

---

### User Story 2 - A model proposes every count for any size (Priority: P1)

For any EU shoe size from 15 to 50/51, or a measured foot length in cm, the model proposes every count needed to knit the sock: cast-on, Bündchen, Rechte Reihen, Ferse, Aufteilung, picked-up stitches, rows after joining, foot rows and the tip.

**Why this priority**: This is the spike's central question and the input for 003.

**Independent Test**: The model's rules are written down so that anyone can compute a size by hand; each of her knitted sizes is a test case whose expected values are her counts.

**Acceptance Scenarios**:

1. **Given** each certain knitted size, **When** the model computes it from its shoe size, **Then** it reproduces her counts, or the deviation is listed per count with an explanation.
2. **Given** a size she has not knitted (for example 27), **When** the model computes it, **Then** every count is filled and plausible next to its neighbors (no count falls outside the range of its neighboring sizes without an explanation).
3. **Given** a measured foot length in cm, **When** the model computes it, **Then** it uses the length instead of the shoe size for the foot-length dependent counts, and the report states which counts depend on length and which on girth (width).

---

### User Story 3 - The model is checked against foot data (Priority: P2)

The research compares the model with public data on foot length per shoe size and on how feet differ between babies, children and adults (length and girth), cites its sources, and states where her rules and the data disagree.

**Why this priority**: It tells us whether her rules generalize to sizes she has not knitted, especially at the small and large ends.

**Independent Test**: Each external number in the report has a cited public source; the report names the shoe-size-to-length conversion it uses.

**Acceptance Scenarios**:

1. **Given** the model and the foot data, **When** they are compared, **Then** the report shows, per size, the model's foot length and the data's foot length, and explains differences larger than one shoe size.
2. **Given** baby, child and adult ranges, **When** the model covers them, **Then** the report states whether one rule fits all or which ranges need their own rule.

---

### User Story 4 - She and Markus can judge the result (Priority: P1)

Markus reads a research report with the method, sources, rules, test cases and a go/no-go recommendation for 003. The knitter gets a German comparison table (Größe | ihre Werte | berechnet | Abweichung) for her knitted sizes and the proposed sizes in between, so she can say whether the "berechnet" values look right.

**Why this priority**: The spike ends with their decision (C1); the knitter is the authority on counts (P1, P2).

**Independent Test**: The round report links the report and the German table; the table can be read without the report.

**Acceptance Scenarios**:

1. **Given** the finished research, **When** Markus opens the round report, **Then** he finds the go/no-go recommendation, the open questions for her, and what 003 would build.
2. **Given** the German table, **When** she reads it, **Then** each proposed value is marked "berechnet" and each of her own values is shown unchanged.

### Edge Cases

- **Uncertain data point (30/31 chart, actual 24)**: stitch counts match REGIA 30/31; the foot has 40 rows, where her other sizes would suggest about 33 for a 24. The socks fit very long at the time; the child's foot is now 27 and the socks are now too small. Possibly knitted more densely, unknown. The knitter will check how the foot part fits on the size-27 foot; until then it is a marked outlier and not used to fit the model.
- Sizes given as ranges (19-20, 43-45) or as "circa" (about 17): the report states which single foot length it assumes for each.
- Size 15 uses construction overrides (36 stitches, 6-6-6, 9 picked up) instead of the chart; the model must reproduce these or explain why not.
- Ranges with no knitted sizes (about 25–36): proposals there are marked as interpolated and get extra attention in her table.
- Odd counts and stitch rules: cast-on must divide onto 2 needles and the Aufteilung must add up to the heel stitches; the model must respect these.
- Tip schedules come from the chart today (P1 "chart size drives construction + tip"); the report states whether the tip can be derived from the stitch count.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The research MUST transcribe her new notes into `docs/domain/` as counts and key points only; raw notes, photos and personal names MUST NOT enter the repository (P10, project working rule).
- **FR-002**: The research MUST build one data set of all knitted sizes with every count and its source, marking uncertain points and conflicts.
- **FR-003**: The model MUST propose every count of a sock (cast-on, Bündchen, Rechte Reihen, Ferse, Aufteilung, picked-up stitches, rows after joining, foot rows, tip) for any EU size from 15 to 50/51.
- **FR-004**: The model MUST accept a shoe size (EU) as the main input and an optional measured foot length in cm that overrides it for length-dependent counts.
- **FR-005**: Her established rules and knitted sizes MUST outrank the REGIA chart and external data (P1); the chart and the foot data are references.
- **FR-006**: Every certain knitted size MUST be a test case; the model MUST reproduce it or document each deviation per count.
- **FR-007**: The research MUST compare the model with cited public foot-size data, covering baby, child and adult ranges.
- **FR-008**: The research MUST state its assumptions about knitting density (rows per cm), based on her notes, and how sensitive the results are to it.
- **FR-009**: The research MUST deliver a German comparison table for the knitter in which every proposed value is marked "berechnet".
- **FR-010**: The research MUST end with a go/no-go recommendation for 003 and the open questions for the knitter.
- **FR-011**: The spike MUST NOT change the app, its stored data or the existing size files.
- **FR-012**: Web searches and any external requests MUST NOT contain personal data about the owner, the knitter or the people the socks were knitted for.
- **FR-013**: The model MUST propose one sock per commonly sold size pair (odd/even, 15/16 to 49/50), made for the pair's larger size, and MUST show her knitted pairs with her own values (r01, r04).
- **FR-014**: The research MUST check her measured gauge against the cited foot length and girth data, per pair and per knitted sock (r02, r11).
- **FR-015**: The research MUST deliver a second German table by size pair, every proposed value marked "berechnet", with a verdict column and the open questions (r03).

### Key Entities

- **Knitted size**: one size she has knitted: actual shoe size, chart size used, all counts, source, certainty (certain / uncertain).
- **Sizing model**: written rules that compute every count from shoe size or foot length, with its assumptions (density, ease, age range).
- **Test case**: a knitted size with its expected counts and the model's result, per count: match or explained deviation.
- **Foot reference**: public foot length (and, where available, girth) per shoe size and age range, with its source.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the certain knitted sizes are test cases; for each, every count either matches her value or has a written explanation.
- **SC-002**: Foot rows: the model is within ±2 rows of her value for at least 80% of certain knitted sizes, or the report explains why that is not reachable.
- **SC-003**: Proposals exist for every EU size from 15 to 50/51 (at least 36 sizes), with every count filled. From round 3: one proposal per size pair, 15/16 to 49/50 (18 pairs).
- **SC-004**: Every external number in the report has a cited public source.
- **SC-005**: The knitter can read the German table and give a judgment per proposed size ("passt" / "passt nicht" / "weiß nicht") in one sitting.
- **SC-006**: The C1 round ends with a recorded go/no-go decision by the owner.

## Assumptions

- All her notes use REGIA 4-fädig (or the same yarn weight) on the same needle size (interview Q10); the owner adds the needle size if she knows it.
- Range covered: EU 15 to 50/51, baby to adult (Q8).
- Shoe size is the main input, measured foot length optional (Q9).
- The research is done by a research agent; its results are checked by the lead before the round.
- Publishing the model as the app's standard and building it into the app are out of scope (003 and a later ADR).
