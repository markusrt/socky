# Größenmodell (Domain)

> Status: **G1** — after wife review of PDF + Notes. Base pattern: **REGIA 4-fädig**.

## Two size concepts

| Concept | German | Example | Drives |
|---|---|---|---|
| **Chart base size** | Größentabelle | 44/45, 50/51, 22/23 | Anschlag, Fersenhöhe, Aufteilung, beidseitige Aufnahme, **Bandspitze** |
| **Actual size** | Passgröße | 40/41, 37/38, 18 | `Nach dem maschreduzieren nur rechte Runden` (plain foot length) |

**Rule:** sock-03 and sock-04 both use chart **44/45** (68 Maschen) but actual **40/41** (51 plain rounds) vs **37/38** (45 plain rounds). Heel construction always follows the chart.

## Needles

Wife knits on **2 needles**. Chart `Anschlag/M je Nadel` is for 4 needles:

| | Chart (4 Nadeln) | Wife (2 Nadeln) |
|---|---|---|
| 44 stitches | 11 / Nadel | **22 / Nadel** |
| 68 stitches | 17 / Nadel | **34 / Nadel** |

Stored as `anschlagProNadelChart` (reference) and `anschlagProNadel2` (used).

## Size chart (REGIA 4-fädig)

Source: `docs/reference/kappchenferse_regia_4_faedig_0.pdf` (MEZ GmbH, 2020).

Construction rows always followed from chart: Fersenhöhe, Aufteilung, Beidseitige M-Aufnahme.

All 15 sizes 22/23…50/51 are digitized (even if she skips e.g. 38/39 for now) so new actual sizes can pick any base.

## Bandspitze (tip) — chart meaning (confirmed)

| Chart row | Meaning |
|---|---|
| **In der 4. Runde** Nx | Unit **(3 rechts, 1 Abnahme)** — this unit Nx times in one round. Skip if 0x |
| **In jeder 3. Runde** Nx | Unit **(2 rechts, 1 Abnahme)** — Nx times in one round. Skip if 0x |
| **In jeder 2. Runde** Nx | Unit **(1 rechts, 1 Abnahme)** — Nx times in one round. Skip if 0x |
| **In jeder Runde** Nx | Final close of the tip — **not used / not counted** |

Hence at most **3 counted tip rounds**. Examples:

- 44/45 (1x / 2x / 4x) → 3 rounds: `3 rechts`, `(2 rechts)×2`, `(1 rechts)×4` — matches sock-03/04
- 22/23 (0x / 1x / 3x) → 2 rounds: `2 rechts`, `(1 rechts)×3` — matches sock-02
- 50/51 (1x / 2x / 5x) → 3 rounds with `×5` in round 3 — matches sock-01

Tip is **derived from the chart base size** (`deriveTipRounds`). Actual size may override if needed.

## Pattern

**REGIA 4-fädig** (only base pattern). Steps:

1. Bund / Bündchen — rows (preference)
2. Rechte Reihen (leg) — rows (preference)
3. Ferse — rows from chart (often split Rechte + Linke)
4. Aufteilung — once (chart)
5. Maschen aufnehmen — once (chart) + technique note
6. Nach dem zusammenstricken — rounds (preference)
7. Nur rechte Runden (plain foot) — **actual-size dependent**
8. Maschenreduzieren (tip) — derived from chart Bandspitze (≤3 rounds)

## Pair sessions

One sock at a time in the UI; session tracks a **pair** (Socke 1 / Socke 2).

## Mapping of sample socks

See `vergleich-sock-03.md`, `vergleich-sock-04.md`, `vergleich-sock-01-02.md`.
