# Research report: Sizing research (002)

**Status**: draft by the research agent, 2026-11-18, checked by the lead (T003, T007) for the C1 round.

**Question**: can a written sizing model reproduce every sock size the knitter has knitted
(or explain each deviation) and propose every count for any EU shoe size from 15 to 50/51,
from the shoe size or an optional measured foot length?

## 1. Result in brief

- **Construction: yes.** The cast-on follows size bands, and six further count families
  follow from the stitch count alone (heel rows, Aufteilung, pick-up, rows after joining,
  Rechte Reihen, tip). All seven match all nine certain knitted sizes. Bündchen matches
  seven of nine and misses two by one row each.
- **Foot rows: yes for the sizes she has knitted, with one open case.** The model is within
  ±2 rows for 8 of 9 certain sizes (89%; SC-002 asks for 80%). The miss is 50/51 (11 rows),
  where the note does not say for which foot the socks were knitted.
- **Sizes she has not knitted: proposals, not predictions.** When one knitted size is left
  out and predicted from the others, only 5 of 8 land within ±2 rows; the largest misses
  are 4 and 6 rows. Sizes 21 to 36 have no certain knitted size at all, and the plausible
  range for a size 24 runs from 23 to 45 foot rows depending on how much growing room a
  child's sock should have. That is her decision, not a calculation.
- **One rule does not fit all.** Her baby socks (15 to 19-20) are built like a chart size
  about 4.5 sizes larger, in width and in length. Her adult socks are wider than the chart
  but as long as the foot. The model needs a baby rule, an adult rule and a bridge.
- **Recommendation: go for 003, with conditions** (section 10): build the generator as a
  proposal tool with the constants kept as data, and settle questions Q1 and Q2 before she
  knits a proposed size in the ranges 21 to 36 or 46 to 49.

Every count the model produces is a proposal marked "berechnet" until she accepts it
(constitution amendment P1). Nothing in the app, its stored data or the size files changed.

## 2. Method and data set

1. All sizes she has knitted were transcribed into one table,
   [`docs/domain/gestrickte-groessen.md`](../../docs/domain/gestrickte-groessen.md): five
   handwritten notes (private), five size files, three earlier comparisons. Ten sizes; nine
   certain, one uncertain (chart 30/31 for an actual 24).
2. Regularities were read off her counts first (section 5, R2 to R5). Rules that need
   fitting use the nine certain sizes only. The uncertain note was never used to fit or to
   choose between rules; section 7 compares it with the finished model.
3. Public foot data were collected for the size-to-length conversion, for girth by age,
   and for other sock charts (section 3).
4. The rules are implemented in [`model.mjs`](model.mjs), which prints the proposal table
   for EU 15 to 51, checks every certain knitted size per count, checks that counts never
   decrease with size, and exits with 1 if a deviation has no recorded explanation.
5. Her knitted sizes return their own counts ("knitted"); the rules fill everything else.

Single sizes assumed for fitting: ca. 15 → 15, ca. 17 → 17, 19-20 → 19.5, 37/38 → 37.5,
39/40 → 39.5, 40/41 → 40.5, 43-45 → 44, 50/51 → 50.5.

| Size | Chart | M | Bündchen | Rechte Reihen | Ferse | Aufteilung | auf | nach Zus. | Fuß | Tip units |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ca. 15 | overrides | 36 | 21 | 5 | 16 | 6-6-6 | 9 | 3 | 17 | 0/1/3 |
| ca. 17 | none | 40 | 25 | 5 | 18 | 7-6-7 | 10 | 3 | 21 | 0/1/3 |
| 18 | 22/23 | 44 | 25 | 5 | 20 | 7-8-7 | 11 | 3 | 25 | 0/1/3 |
| 19-20 | 24/25 | 48 | 28 | 8 | 22 | 8-8-8 | 12 | 3 | 29 | 0/1/3 |
| 24 (uncertain) | 30/31 | 52 | 34 | 12 | 24 | 8-10-8 | not noted | 5 | 40 | 0/2/3 |
| 37/38 | 44/45 | 68 | 40 | 15 | 32 | 11-12-11 | 17 | 5 | 45 | 1/2/4 |
| 39/40 | 44/45 | 68 | 40 | 15 | 32 | 11-12-11 | 17 | 5 | 48 | 1/2/4 |
| 40/41 | 44/45 | 68 | 40 | 15 | 32 | 11-12-11 | 17 | 5 | 51 | 1/2/4 |
| 43-45 | 48/49 | 72 | 42 | 15 | 34 | 12-12-12 | 18 | 5 | 60 | 1/2/4 |
| 50/51 | 50/51 | 76 | 45 | 15 | 36 | 13-12-13 | 19 | 5 | 62 | 1/2/5 |

Tip units are the chart rows she counts: "In der 4. Runde" (3 rechts, 1 Abnahme) / "In
jeder 3. Runde" (2 rechts, 1 Abnahme) / "In jeder 2. Runde" (1 rechts, 1 Abnahme).

## 3. Foot data and sources

Every external number below carries its source. Sources are listed in 3.4.

### 3.1 Shoe size to foot length

- One Paris point is 2/3 cm; the EU size is the last length in Paris points, and the last
  is 4/3 to 5/3 cm longer than the foot [S1].
- ISO/TS 19407 adds two sizes to the foot length. Its tables pair 120 mm with EU 20,
  240 mm with 38, 280 mm with 44 and 320 mm with 50 [S1]. That is
  **foot length (cm) = (EU − 2) × 2/3**, the conversion this research uses.
- A shoe maker gives EU = (foot length + 1.5 cm) × 1.5 [S2], which is 0.17 cm shorter for
  the same size.
- A shop table for real shoes lists 9.7 cm for EU 17, 12.0 for 20, 14.4 for 24, 18.4 for
  30, 22.3 for 36, 25.0 for 40 and 26.2 for 42 [S3]. It is 0 to 0.5 cm below the ISO
  conversion over 17 to 42, always less than one shoe size (0.67 cm).

A measured foot length, when given, replaces the converted one for the foot rows (R9). It
must be the bare foot length, heel to longest toe.

### 3.2 Foot girth: babies, children, adults

| Group | Foot length | Ball girth | Girth / length | Source |
| --- | --- | --- | --- | --- |
| Baby, 6 to 18 months | 7.75 to 11.5 cm | 11 cm | about 1.14 | [S4] |
| Toddler, 2 to 3 years | 12 to 15.25 cm | 14 cm | about 1.03 | [S4] |
| Boys, 5 years | 172.4 mm | 172.6 mm | 1.00 | [S5] |
| Girls, 5 years | 167.7 mm | 166.1 mm | 0.99 | [S5] |
| Boys, 9 years | 208.3 mm | 198.9 mm | 0.95 | [S5] |
| Boys, 12 years | 231.2 mm | 218.0 mm | 0.94 | [S5] |
| Girls, 12 years | 225.6 mm | 211.7 mm | 0.94 | [S5] |
| Boys, 17 years | 251.6 mm | 242.3 mm | 0.96 | [S5] |
| Girls, 17 years | 230.9 mm | 221.3 mm | 0.96 | [S5] |
| Women (n = 1,986) | 246.3 mm | 228.1 mm | 0.93 | [S6] |
| Men (n = 4,082) | 271.2 mm | 252.0 mm | 0.93 | [S6] |

Reading: a baby's foot is about as thick around as it is long, or thicker; from school age
the girth is 93 to 96% of the length. The ratio falls with age, so one stitches-per-size
rule cannot hold from baby to adult.

For the comparison in section 8 these points are summarised as
**girth (cm) ≈ 3.2 + 0.81 × foot length (cm)**. This line is this report's own summary,
not a published formula; it stays within 0.7 cm of every row above (range midpoints for
[S4]). The same source [S4] lists smaller girths for children and adults than [S5] and [S6]
measure (for example 20.5 cm for women's feet of 23.5 to 25.5 cm); only its baby and
toddler rows are used, because no measured baby girth data could be retrieved.

### 3.3 Other sock charts and ease

- The REGIA chart in the repository [S7] is knitted at 30 stitches and 42 rounds per
  10 cm on 2 to 3 mm needles. A second publisher prints the same chart with the same
  gauge [S8].
- A needle maker's baby chart for 4-ply yarn [S9] has 36 stitches, 6/6/6 and 16 heel rows
  for sizes 17/18 and 19/20; 40 stitches, 7/6/7 and 18 heel rows for 20/21 and 22/23; 44
  stitches, 7/8/7 and 20 heel rows for 24/25. Total foot length there is 10, 11.5, 13,
  14.5 and 16 cm. Her own constructions for ca. 15 (36 M, 6-6-6, 16) and ca. 17 (40 M,
  7-6-7, 18) are the same columns, used for smaller feet.
- A sock designer recommends socks 10 to 15% smaller around than the foot and about 1 cm
  shorter than the foot [S10].

### 3.4 Source list

- **[S1]** Wikipedia, "Shoe size", sections on the Paris point and ISO/TS 19407,
  <https://en.wikipedia.org/wiki/Shoe_size>. Wikipedia flags its ISO children's table for
  clean-up; the rows used here agree with the formula.
- **[S2]** Haflinger, "Schuhgröße berechnen mit dem Pariser Stich",
  <https://haflinger.com/en/blogs/news/schuhgroessee-berechnen-mit-dem-pariser-stich>.
- **[S3]** Juniorsteps, size chart for children's shoes (EU 17 to 42, foot length in cm),
  <https://juniorsteps.be/maattabel>.
- **[S4]** Craft Yarn Council, "Foot Size Charts" (US size bands; foot circumference and
  total foot length), <https://www.craftyarncouncil.com/standards/foot-size-charts>.
- **[S5]** Martín-Casado et al., "High Rate of Change of the Foot in Ecuadorian Children:
  The Need for Proper Shoe Design", Children 11(6):749, 2024,
  doi:10.3390/children11060749, Table 3 (n = 1,678, ages 5 to 17; foot length and
  metatarsal circumference, 3D scan).
- **[S6]** ANSUR II (2012 anthropometric survey of US Army personnel), public data files
  via <https://www.openlab.psu.edu/ansur2/>. The means of `footlength` and
  `balloffootcircumference` were computed from the two public CSV files for this report.
- **[S7]** MEZ GmbH, "Größentabelle für Socken mit Käppchenferse, REGIA 4-fädig und
  Cotton", 2020, `docs/reference/kappchenferse_regia_4_faedig_0.pdf`.
- **[S8]** Verelana, "Sock sizes for knitting: size chart for 4-ply and 6-ply sock yarn",
  <https://www.verelana.eu/en/blog/post/sokkenmaten-bij-sokken-breien-hoeveel-steken-heeft-u-nodig>.
- **[S9]** addi, baby sock chart for 4-ply sock yarn (needles 2.5 to 3 mm),
  <https://addi.de/en/?p=47543>.
- **[S10]** Kate Atherley, "On sock sizing, part I", 2011,
  <https://kateatherley.blogspot.com/2011/07/on-sock-sizing-part-i-choosing-which.html>.

Web searches used generic terms only (shoe size conversion, foot girth by age, sock ease,
baby sock charts). No personal data left the machine (FR-012).

## 4. Density assumptions and sensitivity

Her needle size is unknown and no swatch was measured. Counts alone cannot give her
stitches or rows per cm. What the data do give:

- **Rows.** Across her four adult sizes with a stated foot size, the foot grows by
  **4.28 rounds per cm of foot length** (2.85 rounds per shoe size), counted over the whole
  foot from heel cap to tip (R9c). The yarn band says 4.2 rounds per cm [S7]. The two agree,
  but the first number is rounds per cm of *foot*, not of fabric: it would also result from
  a tighter fabric worn with more stretch. The model uses 4.28 as an effective value.
- **Stitches.** At the band gauge of 3.0 stitches per cm [S7], her adult socks (37 to 45)
  measure 91 to 103% of the estimated ball girth and her knitted baby sizes 117 to 129% (section 8).
  The REGIA chart itself gives about 103% for 22/23 and 85 to 89% from 38/39 up on the same
  estimate, and the usual advice is 85 to 90% [S10]. At equal gauge her adult socks are
  6 to 13% wider than the chart's for the same foot. Either she knits tighter than the band
  (about 33 stitches per 10 cm would explain it) or she prefers a looser sock. Not known;
  question Q6. The model does not depend on the answer, because R1 is taken from her
  stitch counts, not from girth.

Sensitivity of the foot rows (`node model.mjs`, last block):

| EU | Model | Adult line B (with 50/51) | Density −5% | Density +5% | Density +10% |
| --- | --- | --- | --- | --- | --- |
| 16 | 21 | 21 | 18 | 24 | 26 |
| 24 | 34 | 35 | 30 | 38 | 42 |
| 30 | 35 | 37 | 30 | 40 | 44 |
| 36 | 44 | 47 | 39 | 49 | 54 |
| 40 | 51 | 51 | 45 | 56 | 62 |
| 42 | 53 | 51 | 47 | 59 | 65 |
| 46 | 65 | 59 | 58 | 71 | 78 |
| 48 | 66 | 59 | 59 | 73 | 80 |
| 49 | 69 | 61 | 62 | 76 | 83 |

- **Density.** 5% more rounds per cm (other needles, other yarn, a tighter hand) moves the
  foot by 3 rows at size 16 and by 7 rows at size 49. The model is valid for her yarn,
  needles and tension only. This is also the simplest explanation offered for the uncertain
  note (section 7).
- **Which large sock is trusted.** The adult line rests on four socks, and its slope rests
  on the 43-45 pair. Adding 50/51 to the four adult socks gives line B
  (T = 41.45 + 2.92 × L): it fits 37/38, 39/40, 40/41 and 50/51 within ±2 rows and misses
  43-45 by 5. Lines A and B differ by at most 3 rows up to size 42 and by 6 to 8 rows from
  46 to 49. Q1 and Q3 decide between them. Line A was chosen because all four socks with a
  written foot size agree with it, because its slope matches the band gauge, and because a
  46 foot on chart 50/51 is exactly her habit of knitting on a chart 4 to 7 sizes up.
- **Assumed size of the 43-45 range.** Taking 43 instead of 44 changes the adult slope from
  4.28 to 4.98 rounds per cm; taking 45 changes it to 3.71.
- **Conversion.** A foot measured 0.3 cm shorter than the ISO value for its shoe size gives
  1 to 2 fewer foot rows.

## 5. Rules

All rules can be worked by hand. `s` is the EU shoe size, `L` the foot length in cm,
`M` the cast-on (castOnTotal). Rounding is to the nearest whole number, halves up.

**Depends on girth (shoe size):** R1, and through `M` R2 to R8.
**Depends on length (shoe size or measured foot):** R9, R10.

**R0. Foot length.** L = (s − 2) × 2/3. A measured foot length replaces it for R9. If only
a foot length is given, s = 1.5 × L + 2 is used for R1.

**R1. Cast-on (castOnTotal).** By size band:

| EU size | M | Basis |
| --- | --- | --- |
| 15 to 16 | 36 | knitted 15 |
| 17 | 40 | knitted ca. 17 |
| 18 | 44 | knitted 18 |
| 19 to 20 | 48 | knitted 19-20 |
| 21 to 24 | 52 | interpolated |
| 25 to 28 | 56 | interpolated |
| 29 to 32 | 60 | interpolated |
| 33 to 36 | 64 | interpolated |
| 37 to 41 | 68 | knitted 37/38, 39/40, 40/41 |
| 42 to 46 | 72 | knitted 43-45 |
| 47 to 51 | 76 | knitted 50/51 |

Half sizes round up to the next whole size. Her three regimes are visible: one size per 4
stitches for babies, 4 sizes per 4 stitches between 20 and 37 (the 20 stitches between her
48 and her 68 spread evenly over 16 sizes), 5 sizes per 4 stitches for adults. She has not
knitted more than 76 stitches, and the chart ends there. Always divisible by 4.

**R2. Heel rows (Ferse).** M / 2 − 2. Heel stitches are M / 2.

**R3. Aufteilung (heelSplit).** By cast-on; always adds up to M / 2.

| M | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 68 | 72 | 76 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Aufteilung | 6-6-6 | 7-6-7 | 7-8-7 | 8-8-8 | 8-10-8 | 9-10-9 | 10-10-10 | 10-12-10 | 11-12-11 | 12-12-12 | 13-12-13 |

44 to 76 are the REGIA columns she follows; 36 and 40 are her own and equal the public baby
chart [S9]. No certain knitted size uses 52 to 64 yet.

**R4. Pick-up per side (pickup).** M / 4.

**R5. Tip (tipSchedule).**

| | Rule |
| --- | --- |
| fourthRound (3 rechts, 1 Abnahme) | 1 if M ≥ 60, else 0 |
| every3rdRound (2 rechts, 1 Abnahme) | 2 if M ≥ 52, else 1 |
| every2ndRound (1 rechts, 1 Abnahme) | 5 if M ≥ 76; 4 if M ≥ 68; else 3 |
| everyRound (not counted by her) | (M − 8) / 4 − 1 − the three above |

The first three equal her notes and the chart for every stitch count. The last one follows
from the chart's logic (one first decrease round, 4 stitches per decrease round, 8 stitches
left). It equals the chart everywhere except that the chart's second 60-stitch column
(38/39) has 7 where the formula and the first 60-stitch column (36/37) have 6. **The tip
can be derived from the stitch count**; a chart size is not needed.

**R6. Bündchen (cuff).** round(0.584 × M + 0.24). Least-squares line through the nine
certain sizes.

**R7. Rechte Reihen (leg).** 5 if M ≤ 44; 15 if M ≥ 68; between: round(8 + (M − 48) × 0.35),
which gives 8, 9, 11, 12, 14 for 48, 52, 56, 60, 64 stitches.

**R8. Rows after joining (postJoin).** 3 if M ≤ 56, else 5. She uses 3 up to 48 stitches
and 5 from 68; the switch is placed halfway. She has never used 4.

**R9. Total foot rounds T.** All rounds from the heel cap to the end of the tip, as a
function of foot length:

| Range | Rule | Basis |
| --- | --- | --- |
| R9a, L ≤ 12.0 cm (up to size 20) | T = 7.12 × L − 12.5 | least squares, 15, 17, 18, 19-20 |
| R9c, L ≥ 23.33 cm (from size 37) | T = 4.28 × L + 7.1 | least squares, 37/38, 39/40, 40/41, 43-45 |
| R9b, between | straight line from T = 72.94 at 12.0 cm to T = 106.97 at 23.33 cm, about 3.0 rounds per cm | bridge, no knitted size |

**R10. Foot rows (plainFoot).** plainFoot = round(T − fixed rounds), where the fixed rounds
of a construction are

- heel cap: 2 × the outer number of the Aufteilung,
- rows after joining (R8),
- gusset: the middle number of the Aufteilung (2 stitches decreased every 2nd round until
  M stitches are left; an assumption, Q7),
- tip: 1 + 4 × fourthRound + 3 × every3rdRound + 2 × every2ndRound + everyRound.

| M | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 68 | 72 | 76 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fixed rounds | 33 | 36 | 39 | 42 | 47 | 50 | 58 | 61 | 65 | 68 | 72 |

Because the fixed rounds jump when the stitch count steps up, the foot rows dip at each
step (for example 39 rows at size 28, 33 at size 29, where the tip gains its first
"3 rechts, 1 Abnahme" unit and the rows after joining go from 3 to 5). The total T never
decreases. The REGIA chart shows the same effect: its "Fußlänge bis Spitze" stays at 14 cm
from 26/27 to 28/29 [S7].

**Worked example, size 27.** L = 16.67 cm. R1: 56 M. R2: 26 heel rows. R3: 9-10-9. R4: 14.
R5: 0/2/3, everyRound 6. R6: round(32.94) = 33. R7: round(10.8) = 11. R8: 3.
R9b: T = 72.94 + (106.97 − 72.94) × (16.67 − 12.0) / (23.33 − 12.0) = 86.95.
R10: fixed = 18 + 3 + 10 + (1 + 6 + 6 + 6) = 50; plainFoot = round(86.95 − 50) = 37.

## 6. Test-case results

`node specs/002-sizing-research/model.mjs` computes each certain knitted size from the
rules alone (no knitted override) and compares per count. Exit code 0: every deviation has
an explanation in `EXPLAINED_DEVIATIONS`.

| Count | Match | Deviation | Deviations |
| --- | --- | --- | --- |
| castOnTotal | 9 | 0 | |
| cuff | 7 | 2 | 17: model 24, hers 25. 18: model 26, hers 25 |
| leg | 9 | 0 | |
| heel | 9 | 0 | |
| heelSplit | 9 | 0 | |
| pickup | 9 | 0 | |
| postJoin | 9 | 0 | |
| plainFoot | 1 | 8 | see below |
| tip | 9 | 0 | |

71 of 81 comparisons match (SC-001: all 10 deviations are explained).

| Size | Her foot rows | Model | Difference | Leave-one-out prediction |
| --- | --- | --- | --- | --- |
| 15 | 17 | 16 | −1 | 14 (−3) |
| 17 | 21 | 23 | +2 | 23 (+2) |
| 18 | 25 | 24 | −1 | 24 (−1) |
| 19-20 | 29 | 29 | 0 | 28 (−1) |
| 37/38 | 45 | 43 | −2 | 41 (−4) |
| 39/40 | 48 | 49 | +1 | 50 (+2) |
| 40/41 | 51 | 52 | +1 | 52 (+1) |
| 43-45 | 60 | 59 | −1 | 54 (−6) |
| 50/51 | 62 | 73 | +11 | not in the fit |

- **SC-002: met in sample.** 8 of 9 certain sizes (89%) are within ±2 rows.
- **Honest reading.** The two lines of R9 have four fitted numbers for eight socks, so the
  in-sample result flatters the model. Leave-one-out is the fairer test: 5 of 8 within ±2
  rows (63%), below the 80% target. A proposal for a size she has not knitted should be
  expected to be off by 2 to 6 rows (0.5 to 1.5 cm) even inside her knitted ranges.
- **50/51.** The rule gives 73 foot rows for a 50.5 foot; she knitted 62. Her 62 rows are
  what the rule gives for a foot of 29.6 cm, about size 46. The earlier note names only the
  chart size. Her value is kept and shown as knitted; the point is excluded from the adult
  line; Q1 asks her. The cast-on band R1 still uses it for 47 to 51 (section 10,
  condition 4). If the socks were knitted for a 50/51 foot and fit, line B of section
  4 is the better adult rule and sizes 46 to 49 need 6 to 8 fewer rows than proposed.

Monotonic check: cast-on, Bündchen, Rechte Reihen, heel, pick-up, rows after joining, tip
units and total foot rounds never decrease from 15 to 51 in the rules. Foot rows dip only
at stitch-count steps (R10). In the printed table, where her knitted values replace the
rules, the one further decrease is 49 → 50/51 (69 → 62 foot rows), the 50/51 case above.

## 7. The uncertain 30/31 note

Chart 30/31 for a child with shoe size 24; not used for fitting.

| Count | Her note | Model for size 24 |
| --- | --- | --- |
| castOnTotal | 52 | 52 |
| heel, Aufteilung, tip | 24, 8-10-8, 0/2/3 | 24, 8-10-8, 0/2/3 |
| pickup | not noted | 13 |
| Bündchen | 34 | 31 |
| Rechte Reihen | 12 | 9 |
| rows after joining | 5 | 3 |
| foot rows | 40 | 34 |
| total foot rounds | 89 | 81 |

- The construction agrees with the model. All four row counts are higher than the model.
- Her 89 total rounds are what the adult rule gives for a 19.1 cm foot (about size 30 to
  31): the sock was knitted to the chart size, not to the foot. A size-24 foot is 14.7 cm,
  so "fitted very long" is what the numbers say.
- Her baby socks sit on the same pattern. Extending the baby line (R9a) to size 24 gives
  92 total rounds; she knitted 89. Seen this way the note is less an outlier than the
  continuation of how she knits children's socks: chart size 4.5 to 6.5 above the foot, and
  the chart's length with it.
- By the model the socks should be long enough for the size-27 foot today (87 total rounds
  proposed for 27, she knitted 89). They are too small now. Either they are too narrow
  (52 stitches; the model proposes 56 for 27), or they were knitted more densely, or they
  shrank. Eight rounds are about 10% of the foot, the same share by which Bündchen exceeds
  the model (34 against 31); a fabric about 10% denser would explain both. This cannot be
  confirmed from the note.
- Her check of how the foot part fits the size-27 foot (already open) is the most useful
  single data point for sizes 21 to 36.

## 8. Foot-data comparison per size

"Sock made for" is the foot length for which the adult rule (R9c) would knit a sock with
the same total foot rounds; for her adult socks this is the foot they fit. "Shoe table" is
[S3], "REGIA total" is the chart's "Gesamte Fußlänge" for the column that contains the
size [S7]. Produced by `node model.mjs --report`.

| EU | Source | Foot length used (cm) | Shoe table (cm) | REGIA total (cm) | Sock made for (cm) | Difference (cm) | Difference (sizes) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 15 | knitted 15 | 8.7 |  |  | 10.0 | +1.4 | +2.0 |
| 16 | berechnet | 9.3 |  |  | 11.0 | +1.6 | +2.4 |
| 17 | knitted 17 | 10.0 | 9.7 |  | 11.7 | +1.7 | +2.5 |
| 18 | knitted 18 | 10.7 | 10.5 |  | 13.3 | +2.6 | +3.9 |
| 19 | knitted 19-20 | 11.3 | 11.2 |  | 14.9 | +3.6 | +5.4 |
| 20 | knitted 19-20 | 12.0 | 12.0 |  | 14.9 | +2.9 | +4.4 |
| 21 | berechnet | 12.7 | 12.5 |  | 15.9 | +3.2 | +4.8 |
| 22 | berechnet | 13.3 | 13.3 | 14.5 | 16.3 | +3.0 | +4.5 |
| 23 | berechnet | 14.0 | 13.9 | 14.5 | 16.8 | +2.8 | +4.2 |
| 24 | berechnet | 14.7 | 14.4 | 15.5 | 17.3 | +2.6 | +3.9 |
| 25 | berechnet | 15.3 | 15.1 | 15.5 | 17.7 | +2.4 | +3.6 |
| 26 | berechnet | 16.0 | 15.7 | 17.0 | 18.2 | +2.2 | +3.3 |
| 27 | berechnet | 16.7 | 16.3 | 17.0 | 18.7 | +2.0 | +3.0 |
| 28 | berechnet | 17.3 | 17.0 | 18.0 | 19.1 | +1.8 | +2.7 |
| 29 | berechnet | 18.0 | 17.8 | 18.0 | 19.6 | +1.6 | +2.4 |
| 30 | berechnet | 18.7 | 18.4 | 19.5 | 20.1 | +1.4 | +2.1 |
| 31 | berechnet | 19.3 | 19.0 | 19.5 | 20.5 | +1.2 | +1.8 |
| 32 | berechnet | 20.0 | 19.7 | 21.0 | 21.0 | +1.0 | +1.5 |
| 33 | berechnet | 20.7 | 20.3 | 21.0 | 21.5 | +0.8 | +1.2 |
| 34 | berechnet | 21.3 | 21.0 | 22.0 | 21.9 | +0.6 | +0.9 |
| 35 | berechnet | 22.0 | 21.6 | 22.0 | 22.4 | +0.4 | +0.6 |
| 36 | berechnet | 22.7 | 22.3 | 23.5 | 22.9 | +0.2 | +0.3 |
| 37 | knitted 37/38 | 23.3 | 23.0 | 23.5 | 24.0 | +0.7 | +1.1 |
| 38 | knitted 37/38 | 24.0 | 23.6 | 25.0 | 24.0 | +0.0 | +0.1 |
| 39 | knitted 39/40 | 24.7 | 24.3 | 25.0 | 24.7 | +0.1 | +0.1 |
| 40 | berechnet | 25.3 | 25.0 | 26.5 | 25.4 | +0.1 | +0.2 |
| 41 | knitted 40/41 | 26.0 | 25.6 | 26.5 | 25.4 | -0.6 | -0.8 |
| 42 | berechnet | 26.7 | 26.2 | 27.5 | 26.6 | -0.1 | -0.1 |
| 43 | knitted 43-45 | 27.3 |  | 27.5 | 28.2 | +0.9 | +1.4 |
| 44 | knitted 43-45 | 28.0 |  | 28.5 | 28.2 | +0.2 | +0.4 |
| 45 | knitted 43-45 | 28.7 |  | 28.5 | 28.2 | -0.4 | -0.6 |
| 46 | berechnet | 29.3 |  | 30.0 | 29.4 | +0.1 | +0.1 |
| 47 | berechnet | 30.0 |  | 30.0 | 30.1 | +0.1 | +0.2 |
| 48 | berechnet | 30.7 |  | 31.0 | 30.6 | -0.1 | -0.1 |
| 49 | berechnet | 31.3 |  | 31.0 | 31.3 | -0.0 | -0.1 |
| 50 | knitted 50/51 | 32.0 |  | 32.0 | 29.6 | -2.4 | -3.5 |
| 51 | knitted 50/51 | 32.7 |  | 32.0 | 29.6 | -3.0 | -4.5 |

Differences larger than one shoe size:

- **15 to 20 (+2 to +5 sizes): her baby socks.** They are as long as an adult-rule sock for
  a foot 1.4 to 3.6 cm longer. This is her knitting, not a model error: 18 is knitted on
  chart 22/23 and comes out as a 22/23 sock, 19-20 on 24/25 as a 24/25 sock. By the counts, babies grow
  into them. The adult rule cannot describe these socks; R9a does.
- **21 to 33 (+1 to +5 sizes): the bridge.** R9b lets the extra length of the baby socks
  fade out by size 37. Nothing she has knitted with certainty supports the values in
  between. Lower bound: the adult rule, a sock as snug as her adult socks (size 24: 23 foot
  rows; 27: 28; 30: 29; 33: 35). Upper bound: the baby line continued (24: 45; 27: 56).
  The proposal lies between (24: 34; 27: 37; 30: 35; 33: 38). How much room a child's sock
  should have is Q2.
- **37 and 43 (+1.1 and +1.4 sizes).** One knitted pair stands for the whole label range
  (37/38, 43-45); at the lower end of the range the same sock is nominally long.
- **50/51 (−3.5 to −4.5 sizes).** Section 6 and Q1.
- Foot length source: the shoe table [S3] and the ISO conversion differ by less than one
  size everywhere, so the choice of conversion explains none of the differences above.

Width, one row per cast-on band, at the band gauge of 30 stitches per 10 cm and with the
girth line of section 3.2:

| EU | M | Sock around (cm) | Estimated ball girth (cm) | Sock / foot |
| --- | --- | --- | --- | --- |
| 15 to 16 | 36 | 12.0 | 10.2 to 10.8 | 117 to 112% |
| 17 | 40 | 13.3 | 11.3 | 118% |
| 18 | 44 | 14.7 | 11.8 | 124% |
| 19 to 20 | 48 | 16.0 | 12.4 to 12.9 | 129 to 124% |
| 21 to 24 | 52 | 17.3 | 13.5 to 15.1 | 129 to 115% |
| 25 to 28 | 56 | 18.7 | 15.6 to 17.2 | 120 to 108% |
| 29 to 32 | 60 | 20.0 | 17.8 to 19.4 | 112 to 103% |
| 33 to 36 | 64 | 21.3 | 19.9 to 21.6 | 107 to 99% |
| 37 to 41 | 68 | 22.7 | 22.1 to 24.3 | 103 to 93% |
| 42 to 46 | 72 | 24.0 | 24.8 to 27.0 | 97 to 89% |
| 47 to 51 | 76 | 25.3 | 27.5 to 29.7 | 92 to 85% |

Her socks go from clearly wider than the foot for babies to slightly narrower for adults.
The REGIA chart has the same direction (about 103% at 22/23, 85 to 89% from 38/39 up), so
the trend is normal for sock charts; her socks are wider than the chart's throughout. The
interpolated bands 52 to 64 continue that trend without a jump.

## 9. Baby, child, adult: one rule or several?

- **One rule for everything that hangs on the stitch count** (R2 to R8): heel rows,
  Aufteilung, pick-up, tip, Bündchen, Rechte Reihen, rows after joining. Baby and adult
  sizes follow the same formulas.
- **Three regimes for the stitch count itself** (R1): babies gain 4 stitches per size,
  children 4 stitches per 4 sizes, adults 4 stitches per 5 sizes. The foot data explain the
  direction: small feet are thicker for their length (section 3.2).
- **Two rules and a bridge for the foot length** (R9). Her baby socks carry growing room of
  1.4 to 3.6 cm; her adult socks carry none. A single straight line through the eight
  sizes with a stated foot size is within ±2 rows for only 6 of them and misses 15 by 4
  rows and 19-20 by 6. For children it gives 30, 34, 33 and 38 foot rows at sizes 24, 27,
  30 and 33, within 4 rows of the proposal, so the children's proposals do not hinge on
  the choice between one line and two.
- **Children 21 to 36 are the weak part.** There the model interpolates in stitch count,
  in the three preference counts (Bündchen, Rechte Reihen, rows after joining) and in
  length, and the only knitted pair in that range is the uncertain one.

## 10. Go / no-go for 003-size-generator

**Recommendation: go, with conditions.**

For it:

- The construction of a sock follows from the stitch count by simple rules that match all
  nine certain sizes: the rules from stitch count to construction (R2 to R8) match 9/9.
  Which stitch count a size gets (R1) is interpolated for 21 to 36 and uncertain at the
  band edges (Q9) and from 46 up (Q1).
- The foot rows are within ±2 rows for 8 of 9 certain sizes in sample (5 of 8
  leave-one-out, below the 80% target), and the one miss has a
  specific, answerable cause.
- The model is small (two tables, a few formulas), fits the contract in
  `contracts/sizing-model.md`, and `model.mjs` can be ported to `packages/shared` with its
  test cases as unit tests.

Conditions:

1. 003 ships proposals only: every value marked "berechnet", editable, and knittable after
   she accepts it (P1, P2). Her knitted sizes stay untouched and win over the rules.
2. The constants (R1 bands, R6 to R9 numbers) are data with an algorithm version, because
   each new pair she knits should refit them. Leave-one-out says the proposals are good to
   about ±2 to ±6 rows, not better.
3. Before she knits a proposed size from 21 to 36: her answer to Q2, and ideally one pair
   in that range that fits (27 or 28 would sit in the middle).
4. Before she knits a proposed size from 46 to 51: her answer to Q1. It decides the foot
   rows and also the stitch bands: R1 takes 76 stitches for 47 to 51 from the 50/51 pair,
   while R9c treats that pair as a smaller (about 46) foot; both cannot hold.
5. A measured foot length should be offered next to the shoe size, since the length rules
   are the less certain half of the model.

What would change the recommendation to no-go: if she judges most "berechnet" rows of the
German table as "passt nicht", or if Q6 shows that her tension differs between socks by
more than about 5%; then a table of her own sizes with manual entry is the better tool.

What 003 would build: the rules as a pure function in `packages/shared` (input: shoe size,
optional foot length; output: the contract shape with provenance and basis), unit tests
from her nine sizes, a way to create an actual size from a proposal, the "berechnet" mark
in the UI, and her acceptance step. Making the model the standard needs its own ADR (P1).

## 11. Open questions for the knitter

1. **Q1 — 50/51.** For which foot were these socks knitted: really 50/51, or a smaller
   foot (about 46) on the 50/51 chart? Do they fit in length?
2. **Q2 — children's socks.** Should a child's sock have room to grow, as her baby socks
   have (2 to 3 cm), or fit as closely as an adult's? And how does the foot of the
   30/31-chart pair fit the size-27 foot today?
3. **Q3 — 43-45.** Was the pair knitted for a 43, a 44 or a 45 foot?
4. **Q4 — size 40.** 39/40 has 48 foot rows, 40/41 has 51. Which is right for a 40?
5. **Q5 — "ca. 15" and "ca. 17".** Shoe sizes at the time, or estimates? Was the ca. 17
   pair finished with 21 foot rows, and do both fit with room?
6. **Q6 — gauge.** On one finished adult sock and one baby sock: how many stitches and how
   many rows are 10 cm (or 5 cm)? Which needle size?
7. **Q7 — gusset.** After the rows that follow the joining, how does she reduce back to the
   cast-on count: two stitches every second round? How many rounds does that take on 68
   stitches?
8. **Q8 — preference counts for children.** For 52 to 64 stitches the model proposes
   Bündchen 31 to 38, Rechte Reihen 9 to 14 and 3 rows after joining up to 56 stitches.
   Her 30/31-chart pair has 34, 12 and 5. Which does she prefer?
9. **Q9 — band edges.** 36 or 40 stitches for size 16; 68 or 72 for 42; 72 or 76 for 46?
   (The 46 to 51 bands also depend on Q1.)

Questions C7 and C8 of the data set (pick-up on the 30/31 note; a note for size 15) are
for completeness only and do not change the model.

## 12. Limits: what was not verified

- Her gauge, needle size and how her finished socks measure. All lengths in cm in this
  report are computed from counts, not measured on a sock.
- Whether any pair fits its wearer, apart from what the owner reported about the
  30/31-chart pair.
- The gusset rhythm (Q7) and the uncounted tip rounds. They enter the fixed rounds of R10;
  if they are wrong, the foot rows of interpolated sizes shift by a few rows at the
  stitch-count steps, and her knitted sizes are unaffected.
- Size 15 was taken from `size-15.json`; no handwritten note for it was available.
- Baby foot girth rests on one craft-industry table [S4]; the review literature on infant
  feet could not be retrieved. The ISO rows in [S1] were read from Wikipedia, not from the
  standard.
- The research agent ran `node model.mjs` (exit 0) and Biome with the main checkout's
  binary; the lead's checks are recorded in `docs/journal/002-sizing-research.md`.
