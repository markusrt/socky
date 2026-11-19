# Data model: Sizing research

> Superseded for the model by `report.md` and `pairs.mjs` (size pairs, round 3). The
> round-2 files named below are in git at `0013eac`.

English field names (P9); German knitting terms in labels.

## KnittedSize (data set row, `docs/domain/gestrickte-groessen.md`)

| Field | Meaning |
| --- | --- |
| `actualSize` | Shoe size she knitted for, as written ("17 ca.", "19-20", "39/40") |
| `assumedFootLengthCm` | Single foot length used for fitting, with the conversion source |
| `chartSize` | REGIA chart size she used for construction ("24/25", "44/45", none) |
| `castOnTotal` | Maschen angeschlagen |
| `cuff` | Bündchen rows |
| `leg` | Rechte Reihen after the Bündchen |
| `heel` | Ferse rows (rechts + links) |
| `heelSplit` | Aufteilung, e.g. 11-12-11 (must add up to heel stitches) |
| `pickup` | Maschen aufnehmen (both sides) |
| `postJoin` | Rechte Runden/Reihen after joining |
| `plainFoot` | Foot rows after the decreases ("nur rechte Runden") |
| `tip` | Tip rounds as written (e.g. 3 rechts/1 Abnahme; 2/1 ×2; 1/1 ×4) |
| `source` | Note file (private, named generically) or size file path |
| `certainty` | `certain` or `uncertain` (+ reason) |
| `conflicts` | Differences between sources, as questions for her |

## SizingModel (rules in `report.md`, code in `model.mjs`)

- Input: `shoeSizeEu` (15–51, half sizes allowed) or `footLengthCm`.
- Derived: foot length, foot girth class (baby / child / adult) with sources.
- Output per size: see [contracts/sizing-model.md](contracts/sizing-model.md).
- Assumptions: rows per cm (from her notes), stitches per cm, ease.

## TestCase

| Field | Meaning |
| --- | --- |
| `size` | KnittedSize reference (certain only) |
| `expected` | Her counts |
| `actual` | Model counts |
| `result` per count | `match` or `deviation` + explanation |

## FootReference

`shoeSizeEu`, `footLengthCm`, optional `girthCm`, `ageRange`, `source` (URL or citation).

## Validation rules

- `castOnTotal` even (2 needles); `heelSplit` sums to `castOnTotal / 2`.
- Counts are positive integers; proposals never decrease as size grows unless
  explained (monotonic check in `model.mjs`).
