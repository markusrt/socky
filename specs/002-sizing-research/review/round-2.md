# Round 2: First working slice (Spike) — sizing research (002)

**What is new**
- All ten sizes she has knitted are one table of counts (no names, raw notes stay private): `docs/domain/gestrickte-groessen.md`.
- Written sizing rules propose every count for EU 15 to 51 from a shoe size or a measured foot length; `specs/002-sizing-research/model.mjs` prints them and checks her sizes.
- Construction (heel, Aufteilung, pick-up, tip, rows after joining, Rechte Reihen) follows from the stitch count and matches all 9 certain sizes; Bündchen 7 of 9 (±1 row).
- Foot rows: within ±2 rows for 8 of 9 of her sizes, but only 5 of 8 when a size is predicted from the others; the 50/51 pair is off by 11 rows.
- A German table for her (`vergleich-de.md`): her sizes unchanged, everything else marked "berechnet", with a column for her verdict.

**Where to try it:** `specs/002-sizing-research/report.md` (sections 1 and 10 are the summary) and `vergleich-de.md`, on branch `002-sizing-research` (worktree `D:\Development\KnitHelper-002`).

**Try these**
1. Read report sections 1 and 10 (5 minutes).
2. Give her `vergleich-de.md` (print landscape, 13 columns): she marks "passt / passt nicht / weiß nicht" per "berechnet" row and answers the 9 questions at the end, most important Q1 (which foot the 50/51 pair is for) and Q2 (growing room for children's socks, and how the 30/31 pair fits the size-27 foot).
3. Decide go/no-go for 003.

**Your decisions**
- Q1 Go for `003-size-generator` with conditions: proposals only, all values "berechnet" until she accepts, constants kept as data, and her answers to Q1/Q2 before anyone knits a proposed size 21–36 or 46–51? ➡️ Yes.
- Q2 Merge this research as its own PR now (docs only, nothing changes for her), and collect her table verdicts as round-2 feedback later? ➡️ Yes.

**How to answer:** just tell me in chat, in any form. I will write it down and read it back to you.

**Known limits:** her gauge and needle size are unknown (5% density moves the foot 3–7 rows); sizes 21–36 have no certain knitted pair; foot data sources were cited by the research agent and checked for consistency, not re-fetched; the 50/51 question also decides the stitch counts for 46–51.
