/**
 * REGIA 4-fädig — Größentabelle Käppchenferse (construction + Bandspitze).
 * Source: docs/reference/kappchenferse_regia_4_faedig_0.pdf (MEZ GmbH, 2020).
 *
 * Chart "Anschlag/M je Nadel" is for 4 needles. Wife knits on 2 needles:
 * 44 stitches → 22 per needle (not 11).
 */
import type { BandspitzeSchedule, ChartSize, TipRound, TipSegment } from "./domain";

export const PATTERN_NAME = "REGIA 4-fädig";
export const SIZE_CHART_NEEDLE_MM = "2–3 mm";
export const NEEDLE_COUNT = 2;

export const SIZE_CHART: readonly ChartSize[] = [
  {
    label: "22/23",
    anschlagGesamt: 44,
    anschlagProNadel2: 22,
    anschlagProNadelChart: 11,
    maschenFuerFerse: 22,
    fersenhoeheReihen: 20,
    aufteilung: [7, 8, 7],
    beidseitigeAufnahme: 11,
    fusslaengeBisSpitzeCm: 11.5,
    gesamteFusslaengeCm: 14.5,
    bandspitze: { inDer4Runde: 0, inJeder3Runde: 1, inJeder2Runde: 3, inJederRunde: 4 },
  },
  {
    label: "24/25",
    anschlagGesamt: 48,
    anschlagProNadel2: 24,
    anschlagProNadelChart: 12,
    maschenFuerFerse: 24,
    fersenhoeheReihen: 22,
    aufteilung: [8, 8, 8],
    beidseitigeAufnahme: 12,
    fusslaengeBisSpitzeCm: 12.5,
    gesamteFusslaengeCm: 15.5,
    bandspitze: { inDer4Runde: 0, inJeder3Runde: 1, inJeder2Runde: 3, inJederRunde: 5 },
  },
  {
    label: "26/27",
    anschlagGesamt: 48,
    anschlagProNadel2: 24,
    anschlagProNadelChart: 12,
    maschenFuerFerse: 24,
    fersenhoeheReihen: 22,
    aufteilung: [8, 8, 8],
    beidseitigeAufnahme: 12,
    fusslaengeBisSpitzeCm: 14,
    gesamteFusslaengeCm: 17,
    bandspitze: { inDer4Runde: 0, inJeder3Runde: 1, inJeder2Runde: 3, inJederRunde: 5 },
  },
  {
    label: "28/29",
    anschlagGesamt: 52,
    anschlagProNadel2: 26,
    anschlagProNadelChart: 13,
    maschenFuerFerse: 26,
    fersenhoeheReihen: 24,
    aufteilung: [8, 10, 8],
    beidseitigeAufnahme: 13,
    fusslaengeBisSpitzeCm: 14,
    gesamteFusslaengeCm: 18,
    bandspitze: { inDer4Runde: 0, inJeder3Runde: 2, inJeder2Runde: 3, inJederRunde: 5 },
  },
  {
    label: "30/31",
    anschlagGesamt: 52,
    anschlagProNadel2: 26,
    anschlagProNadelChart: 13,
    maschenFuerFerse: 26,
    fersenhoeheReihen: 24,
    aufteilung: [8, 10, 8],
    beidseitigeAufnahme: 13,
    fusslaengeBisSpitzeCm: 15.5,
    gesamteFusslaengeCm: 19.5,
    bandspitze: { inDer4Runde: 0, inJeder3Runde: 2, inJeder2Runde: 3, inJederRunde: 5 },
  },
  {
    label: "32/33",
    anschlagGesamt: 56,
    anschlagProNadel2: 28,
    anschlagProNadelChart: 14,
    maschenFuerFerse: 28,
    fersenhoeheReihen: 26,
    aufteilung: [9, 10, 9],
    beidseitigeAufnahme: 14,
    fusslaengeBisSpitzeCm: 17,
    gesamteFusslaengeCm: 21,
    bandspitze: { inDer4Runde: 0, inJeder3Runde: 2, inJeder2Runde: 3, inJederRunde: 6 },
  },
  {
    label: "34/35",
    anschlagGesamt: 56,
    anschlagProNadel2: 28,
    anschlagProNadelChart: 14,
    maschenFuerFerse: 28,
    fersenhoeheReihen: 26,
    aufteilung: [9, 10, 9],
    beidseitigeAufnahme: 14,
    fusslaengeBisSpitzeCm: 18,
    gesamteFusslaengeCm: 22,
    bandspitze: { inDer4Runde: 0, inJeder3Runde: 2, inJeder2Runde: 3, inJederRunde: 6 },
  },
  {
    label: "36/37",
    anschlagGesamt: 60,
    anschlagProNadel2: 30,
    anschlagProNadelChart: 15,
    maschenFuerFerse: 30,
    fersenhoeheReihen: 28,
    aufteilung: [10, 10, 10],
    beidseitigeAufnahme: 15,
    fusslaengeBisSpitzeCm: 18.5,
    gesamteFusslaengeCm: 23.5,
    bandspitze: { inDer4Runde: 1, inJeder3Runde: 2, inJeder2Runde: 3, inJederRunde: 6 },
  },
  {
    label: "38/39",
    anschlagGesamt: 60,
    anschlagProNadel2: 30,
    anschlagProNadelChart: 15,
    maschenFuerFerse: 30,
    fersenhoeheReihen: 28,
    aufteilung: [10, 10, 10],
    beidseitigeAufnahme: 15,
    fusslaengeBisSpitzeCm: 20,
    gesamteFusslaengeCm: 25,
    bandspitze: { inDer4Runde: 1, inJeder3Runde: 2, inJeder2Runde: 3, inJederRunde: 7 },
  },
  {
    label: "40/41",
    anschlagGesamt: 64,
    anschlagProNadel2: 32,
    anschlagProNadelChart: 16,
    maschenFuerFerse: 32,
    fersenhoeheReihen: 30,
    aufteilung: [10, 12, 10],
    beidseitigeAufnahme: 16,
    fusslaengeBisSpitzeCm: 21,
    gesamteFusslaengeCm: 26.5,
    bandspitze: { inDer4Runde: 1, inJeder3Runde: 2, inJeder2Runde: 3, inJederRunde: 7 },
  },
  {
    label: "42/43",
    anschlagGesamt: 64,
    anschlagProNadel2: 32,
    anschlagProNadelChart: 16,
    maschenFuerFerse: 32,
    fersenhoeheReihen: 30,
    aufteilung: [10, 12, 10],
    beidseitigeAufnahme: 16,
    fusslaengeBisSpitzeCm: 22,
    gesamteFusslaengeCm: 27.5,
    bandspitze: { inDer4Runde: 1, inJeder3Runde: 2, inJeder2Runde: 3, inJederRunde: 7 },
  },
  {
    label: "44/45",
    anschlagGesamt: 68,
    anschlagProNadel2: 34,
    anschlagProNadelChart: 17,
    maschenFuerFerse: 34,
    fersenhoeheReihen: 32,
    aufteilung: [11, 12, 11],
    beidseitigeAufnahme: 17,
    fusslaengeBisSpitzeCm: 22.5,
    gesamteFusslaengeCm: 28.5,
    bandspitze: { inDer4Runde: 1, inJeder3Runde: 2, inJeder2Runde: 4, inJederRunde: 7 },
  },
  {
    label: "46/47",
    anschlagGesamt: 72,
    anschlagProNadel2: 36,
    anschlagProNadelChart: 18,
    maschenFuerFerse: 36,
    fersenhoeheReihen: 34,
    aufteilung: [12, 12, 12],
    beidseitigeAufnahme: 18,
    fusslaengeBisSpitzeCm: 24,
    gesamteFusslaengeCm: 30,
    bandspitze: { inDer4Runde: 1, inJeder3Runde: 2, inJeder2Runde: 4, inJederRunde: 8 },
  },
  {
    label: "48/49",
    anschlagGesamt: 72,
    anschlagProNadel2: 36,
    anschlagProNadelChart: 18,
    maschenFuerFerse: 36,
    fersenhoeheReihen: 34,
    aufteilung: [12, 12, 12],
    beidseitigeAufnahme: 18,
    fusslaengeBisSpitzeCm: 24.5,
    gesamteFusslaengeCm: 31,
    bandspitze: { inDer4Runde: 1, inJeder3Runde: 2, inJeder2Runde: 4, inJederRunde: 8 },
  },
  {
    label: "50/51",
    anschlagGesamt: 76,
    anschlagProNadel2: 38,
    anschlagProNadelChart: 19,
    maschenFuerFerse: 38,
    fersenhoeheReihen: 36,
    aufteilung: [13, 12, 13],
    beidseitigeAufnahme: 19,
    fusslaengeBisSpitzeCm: 25,
    gesamteFusslaengeCm: 32,
    bandspitze: { inDer4Runde: 1, inJeder3Runde: 2, inJeder2Runde: 5, inJederRunde: 8 },
  },
] as const;

export function getChartSize(label: string): ChartSize | undefined {
  return SIZE_CHART.find((s) => s.label === label);
}

/**
 * Bandspitze as the wife knits it (max 3 counted rounds).
 *
 * Chart meaning (confirmed with her):
 * - "In der 4. Runde Nx"   → unit (3 rechts + 1 Abnahme), Nx times in that round — skip if 0
 * - "In jeder 3. Runde Nx" → unit (2 rechts + 1 Abnahme), Nx times in that round — skip if 0
 * - "In jeder 2. Runde Nx" → unit (1 rechts + 1 Abnahme), Nx times in that round — skip if 0
 * - "In jeder Runde Nx"    → final close; NOT used / not counted
 */
export function deriveTipRounds(schedule: BandspitzeSchedule): TipRound[] {
  const rounds: TipRound[] = [];
  let index = 1;

  const push = (times: number, unitSegments: [TipSegment, TipSegment]): void => {
    if (times <= 0) return;
    rounds.push({
      index,
      title: `${index}. Runde`,
      times,
      unitSegments,
    });
    index += 1;
  };

  push(schedule.inDer4Runde, [
    { label: "3 rechts", repeats: 1 },
    { label: "1 Abnahme", repeats: 1 },
  ]);
  push(schedule.inJeder3Runde, [
    { label: "2 rechts", repeats: 1 },
    { label: "1 Abnahme", repeats: 1 },
  ]);
  push(schedule.inJeder2Runde, [
    { label: "1 rechts", repeats: 1 },
    { label: "1 Abnahme", repeats: 1 },
  ]);

  return rounds;
}

export function tipRoundsForChartSize(chartLabel: string): TipRound[] {
  const chart = getChartSize(chartLabel);
  if (!chart) {
    throw new Error(`Unknown chart size "${chartLabel}"`);
  }
  return deriveTipRounds(chart.bandspitze);
}
