# Feature Specification: Size generator (size pairs as the standard)

**Feature Branch**: `003-size-generator`

**Created**: 2026-11-19

**Status**: C3 round 4 pending owner decision (2026-11-20)

**Spec Language**: en

**Delivery mode**: Light (one GATE after the last story; team decision, reported to the owner)

**Input**: User description: "Add the computed size pairs from the 002 research as the way to choose a size, keep her in-progress pair readable, and count the 'Maschen reduzieren' rounds." (Owner 2026-11-19; interview Q1–Q8 below; inputs `specs/002-sizing-research/report.md`, r06, r23, r25; ADR 0007.)

## Context

Research 002 produced a sizing model by size pair (15/16 … 49/50) that the knitter accepted (round 3, r18–r26). Today the app offers only five hand-entered sizes (15, 18, 37/38, 40/41, 50/51), each with a REGIA chart label, and "Maschen reduzieren" is a single "Fertig" tap. This feature makes the pairs the size list (ADR 0007, amended P1/P3), counts the "Maschen reduzieren" rounds, and keeps every saved pair working. The knitter's next pair is 27/28.

## Clarifications

### Session 2026-11-19

- Q: Does the pair table become Socky's standard size list (P1)? → A: Yes. Research 002 is her acceptance; the app does not distinguish "berechnet" from "gestrickt" (that history stays in the research record).
- Q: What does she see when choosing a size? → A: One list "Größe" with the pairs, each with its stitch count; the five old sizes are removed from the list. Calculation errors are fixed by iterating on the pairs.
- Q: Are computed pairs knittable at once? → A: Yes; Research 002 = acceptance, no per-size acceptance in the app.
- Q: 47/48 and 49/50? → A: Not offered now; must stay computable later (r25).
- Q: Count "Maschen reduzieren" (r23)? → A: Yes, one tap per round, with the note for the 2-stitch last round; no special handling for pairs in progress (none is in progress; saved pairs keep working as they are).
- Q: Adjust counts before starting? → A: No, not in this feature (planned size editor, M3).
- Q: Timing? → A: One review round; 27/28 has not been started; the change waits on the pull request until she has tried it.
- Q: Amend constitution P1 and P3? → A: Yes, as worded (ADR 0007, constitution 2.0.0).

### Session 2026-11-20

- Q: Wording and button for the counted "Maschen reduzieren"? → A: Always "Reihen", as everywhere else ("the sock is round and a technical row is always a circle, still we name it Row"): "3 Reihen · bis 56 Maschen (wie Anschlag)", "Letzte Reihe: nur 2 Maschen abnehmen", button "Reihe fertig".
- Q: Plan shown inline on "Neue Socke" instead of the "Pläne prüfen" list? → A: Yes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start a pair by size pair (Priority: P1)

The knitter taps "Neue Socke starten" and chooses her size from one list "Größe": 15/16, 17/18 … 45/46, each shown with its stitch count (for example "27/28 · 56 Maschen"). Below the list she sees the plan of the chosen pair (all steps with their counts). She taps "Starten" and knits with exactly the counts of the accepted table.

**Why this priority**: Her next pair (27/28) exists only in the research table; this story makes it knittable in the app. It exercises the riskiest assumption: that the app's counts equal the table she accepted, for every pair.

**Independent Test**: For each of the 16 pairs, start a pair and compare every step's count with the accepted table; on the phone, choose 27/28 and start it in three taps from the home screen.

**Acceptance Scenarios**:

1. **Given** the home screen, **When** she taps "Neue Socke starten", **Then** she sees the list "Größe" with exactly the 16 pairs 15/16 … 45/46 in ascending order, each as "<Paar> · <M> Maschen", and no other size.
2. **Given** the list, **When** she chooses 27/28, **Then** the plan below shows 56 Maschen (28 / Nadel), Bündchen 33, Rechte Reihen 11, Ferse 26, Aufteilung 9-10-9, 14 aufnehmen, 3 nach dem Zusammenstricken, Maschen reduzieren 3 Reihen, Fuß 41, Spitze 2-1 ×2, 1-1 ×3.
3. **Given** 27/28 chosen, **When** she taps "Starten", **Then** the knitting screen shows "Größe 27/28 · 56 Maschen" and the first step "Maschen anschlagen: 56 Maschen (2 Nadeln = 28 / Nadel)".
4. **Given** any pair, **When** she starts it, **Then** every count equals the accepted table, including her choice 39/40 = 50 foot rows and her knitted pairs 17/18, 19/20, 37/38, 45/46.

---

### User Story 2 - Count the "Maschen reduzieren" rounds (Priority: P2)

After "Nach dem Zusammenstricken" she reduces the picked-up stitches: 4 per round (one at each edge of each needle) until the cast-on count is back. The app shows "Maschen reduzieren: 3 Reihen, bis 68 Maschen (wie Anschlag)" and counts one tap per round like every other counted step. When the extra stitches are 6 or 10, it says "Letzte Reihe: nur 2 Maschen abnehmen".

**Why this priority**: She asked for it (r23); today it is one "Fertig" tap and she counts these rounds in her head.

**Independent Test**: Start 37/38 (middle 12): the step needs 3 taps and shows no note. Start 27/28 (middle 10): it needs 3 taps and shows the 2-stitch note. Undo works on the step.

**Acceptance Scenarios**:

1. **Given** a new pair at "Maschen reduzieren", **When** she looks at the step, **Then** she sees the number of rounds and the cast-on count to reach, for example "3 Reihen" and "bis 68 Maschen (wie Anschlag)".
2. **Given** that step, **When** she taps "Reihe fertig" once per round, **Then** the counter advances by one per tap and the step ends after the last round.
3. **Given** a pair whose Aufteilung middle is 6 or 10 (15/16 and 21/22 … 31/32), **When** she is on that step, **Then** she sees "Letzte Reihe: nur 2 Maschen abnehmen"; pairs with middle 8 or 12 show no such note.
4. **Given** the step, **When** she undoes a tap, **Then** the counter goes back by one, as on other counted steps.

---

### User Story 3 - Saved pairs keep working (Priority: P3)

Pairs she saved before this change (old sizes, single-tap "Maschen reduzieren") still show in "Meine Strickprojekte" with their old labels, open, and count exactly as before.

**Why this priority**: P4: never harm her saved knitting. No pair is in progress now, but finished pairs stay in the list.

**Independent Test**: Load the frozen fixtures of the stored format: every pair shows with its stored labels (for example "40/41 (Tabelle 44/45)"), resumes at its step, and its "Maschen reduzieren" is still one "Fertig" tap.

**Acceptance Scenarios**:

1. **Given** saved pairs from before, **When** she opens the app, **Then** they show with their stored size labels and progress unchanged, and no storage notice appears.
2. **Given** such a pair at "Maschen reduzieren", **When** she opens it, **Then** the step is a single "Fertig" tap as before.
3. **Given** saved pairs from before and new pairs, **When** she views the home list, **Then** new pairs show "<Paar> · <M> Maschen" and old pairs keep "<Größe> (Tabelle <Tabelle>)".

### Edge Cases

- A size from before (for example 40/41) is no longer in the list: its saved pairs still open and count from their own stored counts.
- 47/48 and 49/50 are never offered, though the calculation can produce them.
- Pairs with the same stitch count (for example 25/26 and 27/28, both 56) differ only in foot rows; construction and tip are identical.
- 15/16 (36 stitches, 6-6-6, 9 aufnehmen) and 17/18 (44 stitches) have no REGIA column of their own; their construction comes from her rules, not from the chart.
- A middle of 6 means 2 rounds: 4 then 2 stitches (the note shows); a middle of 8 means 2 rounds of 4 (no note).
- A saved pair from before that is mid-way through the single-tap "Maschen reduzieren" stays single-tap.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The size list MUST offer exactly the pairs 15/16, 17/18 … 45/46 in ascending order, and no other size (no 47/48, 49/50, nor the former sizes 15, 18, 37/38, 40/41, 50/51).
- **FR-002**: Each list entry MUST read "<Paar> · <M> Maschen"; the field is labelled "Größe"; no "Tabelle", "berechnet" or "gestrickt" marking appears for pairs.
- **FR-003**: Starting a pair MUST produce, for every step, the counts of the accepted table (`specs/002-sizing-research/vergleich-paare-de.md`, Tabelle 1): Maschen (and per needle on 2 needles), Bündchen, Rechte Reihen, Ferse, Aufteilung, aufnehmen, nach Zusammenstricken, Maschen reduzieren (rounds), Fuß, Spitze.
- **FR-004**: The counts MUST come from one size-pair model (rules of `report.md` §4) with the precedence her choice, else her knitted pair, else computed; the model MUST also produce 47/48 and 49/50 so they can be offered later without new rules.
- **FR-005**: The construction class (M: Aufteilung, Ferse, aufnehmen, Spitze) and the foot size (pair: foot rows) MUST stay distinct in data, logic, display and tests (P3).
- **FR-006**: Before "Starten", the screen MUST show the plan of the chosen pair (every step with its count), updating when she chooses another pair.
- **FR-007**: For new pairs, "Maschen reduzieren" MUST be a counted step: target = the table's rounds, one tap per round, undo as on other counted steps; it shows "<N> Reihen" and "bis <M> Maschen (wie Anschlag)".
- **FR-008**: When the Aufteilung middle leaves a 2-stitch last round (middle not divisible by 4), the step MUST show "Letzte Reihe: nur 2 Maschen abnehmen".
- **FR-009**: The knitting screen and the home list MUST show new pairs as "<Paar> · <M> Maschen"; pairs saved before this feature MUST keep their stored labels as today.
- **FR-010**: Saved pairs in today's stored format (key `Socky.sessions.v1`, frozen fixtures in `packages/web/src/storage-fixtures/`) MUST load, resume and count unchanged, including their single-tap "Maschen reduzieren", with no storage notice (P4).
- **FR-011**: New pairs MUST be saved in a shape that the current stored-pair check accepts, so that reading never depends on the size list.
- **FR-012**: The home list "Pläne prüfen (G1)" of the former sizes MUST be removed; the plan is shown before starting (FR-006).
- **FR-013**: All new display text MUST be German (P9); counting and taps of all other steps MUST stay unchanged (P11).

### Key Entities

- **Size pair**: a sold size pair, for example 27/28, made for its larger size; chooses M and the foot rows.
- **Construction class**: the cast-on M with its Aufteilung, Ferse, aufnehmen and tip.
- **Pair plan**: the ordered steps with counts for one pair, from which a pair session is started.
- **Saved pair**: a pair session as stored today, self-contained (its own labels and counts); unchanged by this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For all 16 offered pairs, 100% of counts in a started pair equal the accepted table.
- **SC-002**: Her five knitted or chosen pairs (17/18, 19/20, 37/38, 39/40 = 50 foot rows, 45/46) are reproduced exactly.
- **SC-003**: From the home screen, starting 27/28 takes at most three taps plus choosing the size, on phone and desktop sizes.
- **SC-004**: The frozen fixtures of the stored format load and resume with zero differences and no notice.
- **SC-005**: The knitter tries the German steps of the round report and confirms that the counted "Maschen reduzieren" and the 27/28 counts are right (P2).

## Assumptions

- The table in `vergleich-paare-de.md` is the acceptance reference; the model is not refitted in this feature (report §5, §6).
- No pair is in progress on her phone (Q5); her finished pairs stay in the list.
- The size list replaces the five former sizes for new pairs only; their data files may stay as test references.
- Delivery mode Light: one GATE after US3. Her acceptance (P2) comes from trying the round report's German steps; the pull request waits until she has (Q7).
- Adjusting counts before starting, a fit record after knitting, and 47/48 / 49/50 are out of scope.
