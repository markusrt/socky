# Gestrickte Größen (data set of every size she has knitted)

> Status: transcribed 2026-11-18 for `specs/002-sizing-research` (task T002). Counts and
> knitting key points only. Her raw notes stay in the owner's private folder; no names, no
> note text, no photos are reproduced here (constitution amendment P10).

This is the single table the sizing model is checked against. Field names follow
`specs/002-sizing-research/data-model.md` ("KnittedSize").

## Sources

| Short name | What it is |
| --- | --- |
| note ca. 17, note 19-20, note 30/31-for-24, note 39/40, note 43-45 | Five handwritten notes with tally marks (private, transcribed here) |
| `size-15.json`, `size-18.json`, `size-37-38.json`, `size-40-41.json`, `size-50-51.json` | The sizes the app knits from today, `packages/shared/data/actual-sizes/` |
| `vergleich-sock-01-02.md`, `vergleich-sock-03.md`, `vergleich-sock-04.md` | Key points of her four earlier notes, `docs/domain/` |

## Assumed foot length

A note gives a shoe size, not a foot length. For fitting, each size gets one EU size and
one foot length: **foot length (cm) = (EU size − 2) × 2/3**. This is the ISO/TS 19407
convention (the shoe size is the foot length plus two Paris points of 2/3 cm); source and
alternatives are in `specs/002-sizing-research/report.md`, section 3.1.

- A double size takes its middle: 37/38 → 37.5, 39/40 → 39.5, 40/41 → 40.5, 50/51 → 50.5.
- The range 19-20 takes 19.5; the range 43-45 takes 44.
- "ca. 15" and "ca. 17" take 15 and 17.

## The table

Counts are rows (Reihen) unless stated. `pickup` is per side, as in the chart row
"Beidseitige M-Aufnahme". The tip is written as she writes it: "2 rechts, 1 Abnahme"
means two plain rounds and one decrease round; "×3" means that unit three times.

| actualSize | Assumed EU / foot length | chartSize | castOnTotal | cuff (Bündchen) | leg (Rechte Reihen) | heel (Ferse) | heelSplit (Aufteilung) | pickup | postJoin | plainFoot | tip | source | certainty |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ca. 15 | 15 / 8.7 cm | 22/23 with construction overrides | 36 | 21 | 5 | 16 | 6-6-6 | 9 | 3 | 17 | 2 rechts, 1 Abnahme; (1 rechts, 1 Abnahme) ×3 | `size-15.json` | certain |
| ca. 17 | 17 / 10.0 cm | none ("kein REGIA Eintrag") | 40 | 25 | 5 | 18 (9 + 9) | 7-6-7 | 10 | 3 | 21 | 2 rechts, 1 Abnahme; (1 rechts, 1 Abnahme) ×3 | note ca. 17 (private) | certain (counts as written; see C4) |
| 18 | 18 / 10.7 cm | 22/23 | 44 | 25 | 5 | 20 (10 + 10) | 7-8-7 | 11 | 3 | 25 | 2 rechts, 1 Abnahme; (1 rechts, 1 Abnahme) ×3 | `size-18.json`, `vergleich-sock-01-02.md` (sock-02) | certain |
| 19-20 | 19.5 / 11.7 cm | 24/25 | 48 | 28 | 8 | 22 (11 + 11) | 8-8-8 | 12 | 3 | 29 | 2 rechts, 1 Abnahme; (1 rechts, 1 Abnahme) ×3 | note 19-20 (private) | certain |
| 24 | 24 / 14.7 cm | 30/31 | 52 | 34 | 12 | 24 (12 + 12) | 8-10-8 | not noted (chart: 13) | 5 | 40 | (2 rechts, 1 Abnahme) ×2; (1 rechts, 1 Abnahme) ×3 | note 30/31-for-24 (private) | **uncertain** (see below) |
| 37/38 | 37.5 / 23.7 cm | 44/45 | 68 | 40 | 15 | 32 (16 + 16) | 11-12-11 | 17 | 5 | 45 | 3 rechts, 1 Abnahme; (2 rechts, 1 Abnahme) ×2; (1 rechts, 1 Abnahme) ×4 | `size-37-38.json`, `vergleich-sock-04.md` | certain |
| 39/40 | 39.5 / 25.0 cm | 44/45 | 68 | 40 | 15 | 32 (16 + 16) | 11-12-11 | 17 | 5 | 48 | 3 rechts, 1 Abnahme; (2 rechts, 1 Abnahme) ×2; (1 rechts, 1 Abnahme) ×4 | note 39/40 (private) | certain |
| 40/41 | 40.5 / 25.7 cm | 44/45 | 68 | 40 | 15 | 32 (16 + 16) | 11-12-11 | 17 | 5 | 51 | 3 rechts, 1 Abnahme; (2 rechts, 1 Abnahme) ×2; (1 rechts, 1 Abnahme) ×4 | `size-40-41.json`, `vergleich-sock-03.md` | certain |
| 43-45 | 44 / 28.0 cm | 48/49 | 72 | 42 | 15 | 34 (17 + 17) | 12-12-12 | 18 | 5 | 60 | 3 rechts, 1 Abnahme; (2 rechts, 1 Abnahme) ×2; (1 rechts, 1 Abnahme) ×4 | note 43-45 (private) | certain |
| 50/51 | 50.5 / 32.3 cm | 50/51 | 76 | 45 | 15 | 36 (18 + 18) | 13-12-13 | 19 | 5 | 62 | 3 rechts, 1 Abnahme; (2 rechts, 1 Abnahme) ×2; (1 rechts, 1 Abnahme) ×5 | `size-50-51.json`, `vergleich-sock-01-02.md` (sock-01) | certain counts; actual size not confirmed (see C1) |

Nine sizes are certain and are the model's test cases. One is uncertain.

### The uncertain size (30/31 chart, actual 24)

- Construction equals the REGIA 30/31 column exactly (52 M, 24 heel rows, 8-10-8).
- It was knitted for a child with shoe size 24. The socks fitted very long when new and
  are too small now; the child's shoe size is 27 today.
- Possibly knitted more densely than her other socks; not known.
- It is shown here, excluded from fitting, and discussed in the report (section 7).

## Key points from the notes that are not counts

- All notes use the same yarn weight (REGIA 4-fädig or equal) and the same needle size;
  the needle size is not known.
- She knits on 2 needles; every cast-on is noted as a total.
- Technique hints "erst zusammen, dann verschränkt" appear only on the 68-stitch notes
  (37/38, 39/40, 40/41).
- The notes for ca. 17 and for the size 18 (sock-02) were transcribed while the pair was
  still in progress (tallies end partway); the headline counts are complete.
- In the note for 43-45, Bündchen and Rechte Reihen carry a count but no tally marks.

## Regularities in her counts

They hold for all ten rows, including the uncertain one:

- castOnTotal is divisible by 4.
- heel rows = castOnTotal / 2 − 2.
- pickup per side = castOnTotal / 4 (in the nine rows that note it).
- heelSplit adds up to castOnTotal / 2.
- From 44 stitches up, heelSplit and tip equal the REGIA column with the same stitch count.
  36 and 40 stitches have no REGIA column; her 6-6-6 and 7-6-7 are her own.
- The chart she picks is 4 to 7 sizes above the actual size (18 → 22/23, 19-20 → 24/25,
  24 → 30/31, 37/38 → 44/45, 39/40 → 44/45, 40/41 → 44/45, 43-45 → 48/49). Only 50/51
  has chart = label (C1).

## Conflicts and open questions for her

Not resolved here. Each is a question for the knitter.

- **C1 — 50/51: for which foot?** The earlier note names only the chart size 50/51 and
  no "Größe" line; the app labels the actual size 50/51. All her other socks use a chart
  4 to 7 sizes above the foot, and 62 foot rows are only 2 more than her 43-45 socks have.
  Were these socks knitted for a 50/51 foot, or for a smaller one (about 46)? Do they fit?
- **C2 — size 40 appears twice.** 39/40 has 48 foot rows, 40/41 has 51, everything else
  is equal. Which count is right for a size-40 foot?
- **C3 — 43-45: which foot?** The range covers three sizes. Were the socks knitted for a
  43, a 44 or a 45 foot?
- **C4 — ca. 17: finished?** The foot tally in the note stops at 6 of 21 rows. Was the
  pair finished with 21 rows, and does it fit?
- **C5 — "ca." sizes.** 15 and 17 are approximate. Are they the child's shoe size at the
  time, or an estimate from age?
- **C6 — 30/31 for size 24.** How does the foot part fit the size-27 foot today (already
  open from the owner interview)? Was this pair knitted more tightly?
- **C7 — pickup for the 30/31 note.** The note has no "Maschen aufnehmen" line; the chart
  says 13. Did she pick up 13?
- **C8 — size 15 has no note in the private folder.** Its counts come from
  `size-15.json` only ("custom smaller construction from Notes"). Is there a note, and
  does it match the file?

No count differs between a new note and a size file already in the app: the five new
notes cover sizes that had no file (ca. 17, 19-20, 24, 39/40, 43-45).

## Answers from round 2 (2026-11-18, feedback r04–r14)

Her answers to C1–C8 and Q1–Q9, as key points (`specs/002-sizing-research/feedback/round-2.md`):

- **C1 resolved for the foot:** the pair labelled 50/51 was knitted for a **45/46** foot on
  the chart column 50/51; she wrote that 76 stitches are needed for it, but answered "72"
  for 45/46 in Q9 (asked again; fit in length not stated). The app label `size-50-51.json` is unchanged
  (FR-011); a later feature may relabel it with her consent.
- **Gauge:** 36 stitches and 52 rows = 10 cm on 2.25 mm needles, the same for baby and
  adult socks.
- **Decrease after joining:** 2 stitches on each of her two needles, 4 per round, until the
  cast-on count is back (every round or every second round: open).
- **37/38:** 43 foot rows were a bit short at size 38; her 45 stays.
- **Size 15** fitted with room for about three months; the next pair is size 17.
- **Children:** some growing room is good; the computed children's Bündchen, Rechte Reihen
  and rows after joining fit. Her counts from the 30/31-for-24 note (uncertain) are
  discarded as a template; how that pair fits today is still asked.
- **43-45 and size 40:** replaced by paired sizes; the 43-45 foot stays unknown.
- **Size pairs:** the owner wants commonly sold pairs; odd/even 15/16 … 49/50 is proposed
  (owner decision pending), see `specs/002-sizing-research/report.md` section 13.
