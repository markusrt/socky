# Vergleich sock-03 ↔ generierter Plan

**Für G1 (Domänen-Review durch Frau):** Bitte Notiz `sock-03.txt` daneben halten.

## Ausgangsnotiz (Kernpunkte)

```
44/45 aktuelle Socken
68 Maschen aufnehmen
Größe 40/41
Bund 40 Reihen
Rechte Reihen 15
Ferse in Reihen 32 / Rechte 16 / Linke 16
Aufteilung 11-12-11
17 Maschen aufnehmen
Erst zusammen dann verschränkt
Nach dem zusammenstricken 5 rechte Reihen
Nach dem maschreduzieren nur rechte Runden 51
Maschenreduzieren erst verschränkt dann zusammen
  1. Runde: 3 rechts / 1 Abnahme
  2. Runde: 2 rechts / 1 Abnahme ×2
  3. Runde: 1 rechts / 1 Abnahme ×4
```

## Generierter Plan (materialize sock-03)

| # | Schritt | Unit | Ziel | Hinweis |
|---|---|---|---|---|
| 1 | cuff (Bund) | rows | **40** | |
| 2 | leg (Rechte Reihen) | rows | **15** | |
| 3 | heel (Ferse) | rows | **32** | Aus Chart 44/45 (Rechte 16 + Linke 16) |
| 4 | split (Aufteilung) | once | 11-12-11 | aus Chart 44/45 |
| 5 | pickup (Aufnehmen) | once | **17** | `Erst zusammen dann verschränkt` · 2 Nadeln: 34 |
| 6 | postJoin | rounds | **5** | |
| 7 | plainFoot | rounds | **51** | größenabhängig |
| 8 | tip | rounds | **3** | aus Chart-Bandspitze 44/45 |
| 8.1 | 1. Runde | | ×1 | 3 rechts / 1 Abnahme |
| 8.2 | 2. Runde | | ×2 | 2 rechts / 1 Abnahme |
| 8.3 | 3. Runde | | ×4 | 1 rechts / 1 Abnahme |

Bandspitze-Quelle: `In der 4. Runde 1x` / `In jeder 3. Runde 2x` / `In jeder 2. Runde 4x` („In jeder Runde“ = Abschluss, nicht gezählt).

## Zu bestätigen

- [ ] Alle Zahlen stimmen mit der Notiz überein
- [ ] Schritt-Reihenfolge ist korrekt
- [ ] Tip-Runden und Wiederholungen korrekt
- [ ] Technik-Hinweise vorhanden und richtig
- [ ] „2. Socken“ als zweiter Zähler je Schritt (Paar) ist das richtige Modell

## Abweichungen zur Chart-Größe

Konstruktion (68 M, Ferse 32, 11-12-11, 17 aufnehmen) stammt aus **44/45**.
Längen-Zählung (plain **51**) und Tip aus tatsächlicher Größe **40/41**.
