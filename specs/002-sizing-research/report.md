# Sizing model by size pair (002-sizing-research)

Result of the spike, accepted 2026-11-19 (feedback r18–r26). Everything needed to rerun or
extend the calculation; history of rounds 2–3 is in `feedback/`, `review/` and git
(`0013eac` holds the round-2 single-size model `model.mjs` and table `vergleich-de.md`).

## 1. Result

- One sock per size pair as sold: 15/16, 17/18 … 49/50, each made for its larger size.
- Construction follows from the cast-on M; M follows from the pair; plain-foot rows follow
  from foot length × a length share fitted on her socks.
- Her knitted pairs are reproduced within ±2 foot rows (in sample); leave-one-out 3 of 5.
- Accepted table for the knitter: `vergleich-paare-de.md`. Next knitted pair: 27/28 (r26).

## 2. Reproduce

```sh
node specs/002-sizing-research/pairs.mjs              # fits, gauge check, pairs, tests (exit 1 on failure)
node specs/002-sizing-research/pairs.mjs --de         # German tables of vergleich-paare-de.md
node specs/002-sizing-research/pairs.mjs --pair 27/28 # one pair as JSON
```

## 3. Data

- Her socks: `docs/domain/gestrickte-groessen.md` (counts, sources, answers r04–r26). The
  script's `KNITTED` holds the certain ones; `CHOSEN` holds her choice 39/40 = 50 foot rows.
- Gauge: 36 stitches × 52 rows = 10 cm, 2.25 mm, same for baby and adult (r11).
- Foot length: L = (EU − 2) × 2/3 cm (ISO/TS 19407 [S1]).
- Ball girth estimate: G = 3.2 + 0.81 × L cm, own line through [S4] (baby, toddler),
  [S5] (children 5–17 y), [S6] (adults); within 0.7 cm of each source row. Used only for
  the gauge check, not for any count.

## 4. Rules

`hi` = larger size of the pair, M = cast-on, split = Aufteilung (side-middle-side).

| Rule | Value | Basis |
| --- | --- | --- |
| P1 pairs | odd/even 15/16 … 49/50, made for `hi` | [S11], [S12]; r04, r18 |
| P2 M by `hi` | ≤16: 36, 17: 40, 18: 44, ≤20: 48, ≤24: 52, ≤28: 56, ≤32: 60, ≤36: 64, ≤41: 68, ≤44: 72, else 76 | her sizes, linear between 48 and 68; 76 for 45/46 (r22) |
| Aufteilung | 36: 6-6-6, 40: 7-6-7, 44: 7-8-7, 48: 8-8-8, 52: 8-10-8, 56: 9-10-9, 60: 10-10-10, 64: 10-12-10, 68: 11-12-11, 72: 12-12-12, 76: 13-12-13 | 36/40 hers, 44–76 REGIA [S7] |
| Ferse | M/2 − 2 rows | her sizes, REGIA |
| aufnehmen | M/4 per side | her sizes |
| Bündchen | round(0.584 × M + 0.24) | least squares, her 9 certain socks (`CUFF`) |
| Rechte Reihen | 5 if M ≤ 44; 15 if M ≥ 68; else round(8 + (M − 48) × 0.35) | her sizes; accepted for children (r13) |
| nach Zusammenstricken | 3 if M ≤ 56, else 5 | her sizes |
| Maschen reduzieren | ceil(middle / 4) rounds: 4 per round (1 at each edge of each needle), last round 2 if middle is 6 or 10 | r12, r23 |
| Spitze | 3-1: 1 if M ≥ 60; 2-1: 2 if M ≥ 52 else 1; 1-1: 5 if M ≥ 76, 4 if M ≥ 68, else 3; then every round to 8 stitches (not counted) | her sizes = REGIA |
| Fuß | round(5.2 × s(L) × L − fixed), L = L(`hi`) | P4 below |

- **fixed** = 2 × side + nach Zusammenstricken + Maschen reduzieren + tip rounds, where tip
  rounds = 1 + 4·(3-1) + 3·(2-1) + 2·(1-1) + everyRound and everyRound = (M − 8)/4 − 1 − units.
- **P4 length share s(L)** = sole rounds / 5.2 / L of her socks: adult 0.806 (mean of
  37/38, 39/40, 45/46 as knitted), baby 1.032 (mean of 15, ca. 17, 18, 19-20); straight
  line in L from 12.0 cm (size 20) to 24.0 cm (size 38). This gives children growing room
  from about 3.4 cm (21/22) to 0.7 cm (35/36), accepted in r24.
- Table values: her choice, else her knitted pair, else computed (amendment P1).

## 5. Results

- In sample (`node pairs.mjs`): 17/18 −1, 19/20 −1, 37/38 0, 39/40 +2, 45/46 −2 foot rows;
  M 5/5. Leave-one-out: −1, −1, −1, +3, −3 (3 of 5 within ±2).
- Sole length grows with every pair; foot rows dip where M steps up (29/30: tip and rows
  after joining get longer).
- Gauge check: adult soles are 79–82% of foot length at every size (gauge-independent
  consistency; no published norm to compare). Adult width 77–83% of the girth estimate,
  tighter than the usual 85–90% [S10]; wool relaxing in wear, slimmer feet or a snug
  preference may explain it (r17). Baby socks 98–103% of girth, about 3 cm growing room.
- 39/40: she prefers 50 foot rows (r21); refitting with 50 would raise the adult share
  to 0.811. Not done, so the accepted table stays stable; refit with the next knitted pairs.

## 6. Extending

- **New knitted pair:** add it to `KNITTED` (with `pair` if it is a pair, `group`), rerun;
  shares and Bündchen refit. 27/28 (r26) will be the first children's pair and tests the
  P4 line between 12 and 24 cm.
- **Above 76 stitches** (47/48, 49/50 at their 72–75% width; r25): needs an Aufteilung
  and her tip rule for 80; `fixedRounds` throws for an undefined M.
- **App (003):** count the "Maschen reduzieren" rounds (step `reduceToCastOn` is a
  once-step today, r23); the 50/51 app label means a 45/46 foot (r06).

## 7. Sources

- [S1] Wikipedia, "Shoe size" (Paris point, ISO/TS 19407), <https://en.wikipedia.org/wiki/Shoe_size>.
- [S4] Craft Yarn Council, "Foot Size Charts", <https://www.craftyarncouncil.com/standards/foot-size-charts>.
- [S5] Martín-Casado et al., Children 11(6):749, 2024, doi:10.3390/children11060749, Table 3.
- [S6] ANSUR II (2012), public data, <https://www.openlab.psu.edu/ansur2/> (means of
  `footlength`, `balloffootcircumference`: women 246.3/228.1 mm, men 271.2/252.0 mm).
- [S7] MEZ, "Größentabelle für Socken mit Käppchenferse, REGIA 4-fädig und Cotton", 2020,
  `docs/reference/kappchenferse_regia_4_faedig_0.pdf`.
- [S10] Kate Atherley, "On sock sizing, part I", 2011,
  <https://kateatherley.blogspot.com/2011/07/on-sock-sizing-part-i-choosing-which.html>.
- [S11] Bergfreunde, "Falke Größentabellen", <https://www.bergfreunde.de/falke-groessentabelle/>
  (women 35-36 … 41-42; men 39-40 … 49-50), read 2026-11-18.
- [S12] Bergfreunde, "Sterntaler Größentabellen", <https://www.bergfreunde.de/sterntaler-groessentabelle/>
  (children 17/18 = EU 18 … 33/34), read 2026-11-18.
