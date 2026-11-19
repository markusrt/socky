# Feedback, round 3 (C1 repeat / T010)

Written by the team from the owner's chats of 2026-11-19 (r16–r17 first, r18–r26
second, with the knitter's answers to the six questions of `vergleich-paare-de.md`).
The owner's and knitter's words are quoted unchanged; ids, timing, type and
reference are the team's reading.

**Decision**: approve (C1 accepted; go for 003; docs-only PR, kept focused)
**Publish choice**: open a pull request (as recorded, expert-review)
**Tried**: the knitter answered all six questions; no row verdicts were written,
so every row counts as accepted (the table asked for marks only on disagreement)

| ID | Timing | Type | Reference | Summary |
| --- | --- | --- | --- | --- |
| r16 | next round | question | AGENTS context budget, STATUS | How does a fresh session know about two branches? |
| r17 | next round | question | report 13.3, vergleich-paare-de.md | Does the "tighter than usual" width account for wool socks relaxing in wear? |
| r18 | next round | decision | round 3 Q1, FR-013 | Pairs 15/16 … 49/50, each for its larger size: yes |
| r19 | next round | decision | round 3 Q2, FR-010 | Go for 003-size-generator: yes |
| r20 | next round | decision | round 3 Q3 | Docs-only PR: yes, focused on what is needed to reproduce or extend the calculation |
| r21 | next round | decision | 39/40 | 50 foot rows rather than her 48 |
| r22 | next round | decision | 45/46, r06/r14 | 76 stitches; the length fits |
| r23 | 003 | extension | P3, step `reduceToCastOn` | Gusset rule confirmed; the app should count the "Maschen reduzieren" rounds |
| r24 | next round | decision | P4 | Children's growing room as proposed is right |
| r25 | 003 | decision | P2 | 47/48 and 49/50 not needed now, but must be computable later |
| r26 | later | question | 27/28, r07 | 30/31 pair fit still pending; she knits 27/28 as computed first |

## r16 Two branches and a fresh session

> I will answer here first as I am bit confused with multiple branches. I.e. there are currently two branches and I do not know how a "clear" would know that.

Answered in chat: a fresh session reads `docs/STATUS.md` of the branch checked out
in `D:\Development\KnitHelper`. That STATUS (001 branch, now PR #2) was updated to
describe both features; after the 001 merge, 002 moves back into the main folder
and the second folder is removed. Also recorded in `docs/retro.md` on the 001 branch.

## r17 Wool relaxes in wear

> Regarding tightness. Did you consider that these are wool socks that, especially as they are knitted quite densely, have room for adapting on wear?

Not considered explicitly in round 3. The 10–15% advice [S10] is already meant for
wool sock yarn and assumes the fabric stretches, so wear alone does not explain the
gap; how much her dense fabric loosens is not known from data. The proposals do
not change (stitch counts come from her socks, not from girth). The wording in
report 13.3, the round-3 report and the German table now names wear as one
possible reason and states that her socks fit.

## r18–r20 Owner decisions

> Q1: yes
> Q2: yes
> Q3: yes but keep it focused on the essential information required to reproduce or extend the calculation later. Not too many fill words-

C1 accepted. The research is published as its own PR with only what is needed to
rerun or extend the model: data, rules, constants, script, sources, open points.
Superseded round-2 artifacts leave the tree (they stay in git history).

## r21 39/40

> - 39/40: Dein Paar hat 48 Reihen im Fuß, die Rechnung 50. Ist 48 für einen Fuß in Größe 40 lang genug, oder lieber 50? -> Lieber 50

The pair 39/40 gets 50 foot rows. Her knitted 48 stays in the data set as knitted.

## r22 45/46

> - 45/46: Bei Frage 1 hast du geschrieben, dass die 76 Maschen dafür nötig sind. Bei Frage 9 stand „Größe 45/46: 72“. Was gilt: 76 oder 72? Und passen die Socken in der Länge? -> 76 gilt und die Länge passt

76 stitches; r14's 72 is withdrawn. The pair's 62 foot rows fit in length.

## r23 Decrease after joining

> - Maschen reduzieren: Stimmt es so, dass du 4 Maschen in jeder Runde abnimmst, also 3 Runden bei 68 Maschen? Oder nur in jeder zweiten Runde? -> So müsste es sein. Aktuell ist das Maschenreduzieren ja nicht in der App. Du kannst das aber mal aufnehmen. Beim Maschen Aufnehmen (z.B. 9) sind das ja 9 auf jeder  Seite/Nadel. D.h. 18 bzw immer eine gerade Zahl. Reduziert wird dann immer je eine Masche Rechts und Links am Rand und je Nadel, also 4 Maschen. So lange bis die vorher aufgenommenen Maschen wieder weg sind.

Every round: one stitch at the right and one at the left edge of each of the two
needles, 4 per round, until the surplus from picking up is gone (the cast-on count
is back): ceil(middle / 4) rounds, the last one taking 2 stitches when the middle
number is 6 or 10. The app shows "Maschen reduzieren" today only as a once-step
with the cast-on count; counting its rounds is scope for 003.

## r24 Growing room

> - Platz zum Reinwachsen: Ist die Menge bei den Kindergrößen richtig: 3 cm bei 21/22, weniger werdend bis 1 cm bei 33/34? -> Ja das passt so. 33/34 ist ja schon der Übergang zu sehr kleinen Erwachsenen Füße.

P4 stands.

## r25 47/48 and 49/50

> - 47/48 und 49/50: Brauchst du diese Größen? Mit 76 Maschen wären sie enger als deine anderen Socken. Mit 80 Maschen bräuchte es eine neue Aufteilung und Spitze, die es in der Tabelle nicht gibt. Sonst endet die Tabelle bei 45/46. -> Nein die werden aktuell nicht gebraucht. Der sollte aber verfügbar sein um sie später ausrechnen.

The model keeps a way to compute any pair (`pairs.mjs --pair 47/48`); the
construction above 76 stitches stays open until she needs it.

## r26 30/31 pair at size 27

> - Paar nach Tabelle 30/31 am Fuß Größe 27: Ist es jetzt zu kurz oder zu eng? -> Ich warte noch auf Antwort. Meine Frau würde 27/28 jetzt erstmal wie berechnet stricken und die Antwort ggf. später nachreichen.

She knits 27/28 as computed; it becomes the first knitted children's pair and a
test of P4. The fit of the old pair may follow later.

## Not stated

- None for this round. Later: the 30/31 pair's fit (r26) and how 27/28 fits.
