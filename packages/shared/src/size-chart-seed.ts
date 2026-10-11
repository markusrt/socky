/**
 * REGIA 4-fädig — size chart for heel-cap socks (construction + tip schedule).
 * Source: docs/reference/kappchenferse_regia_4_faedig_0.pdf (MEZ GmbH, 2020).
 *
 * Chart "cast-on per needle" is for 4 needles. Wife knits on 2 needles:
 * 44 stitches → 22 per needle (not 11).
 *
 * German appears only in user-facing names/labels, not in field names.
 */
import type { ChartSize, TipDecreaseSchedule, TipRound } from "./domain";

export const PATTERN_NAME = "REGIA 4-fädig";
export const SIZE_CHART_NEEDLE_MM = "2–3 mm";
export const NEEDLE_COUNT = 2;

export const SIZE_CHART: readonly ChartSize[] = [
  {
    label: "22/23",
    castOnTotal: 44,
    castOnPerNeedle2: 22,
    castOnPerNeedleChart: 11,
    heelStitches: 22,
    heelHeightRows: 20,
    heelSplit: [7, 8, 7],
    pickupStitchesBothSides: 11,
    footLengthToToeCm: 11.5,
    totalFootLengthCm: 14.5,
    tipSchedule: { fourthRound: 0, every3rdRound: 1, every2ndRound: 3, everyRound: 4 },
  },
  {
    label: "24/25",
    castOnTotal: 48,
    castOnPerNeedle2: 24,
    castOnPerNeedleChart: 12,
    heelStitches: 24,
    heelHeightRows: 22,
    heelSplit: [8, 8, 8],
    pickupStitchesBothSides: 12,
    footLengthToToeCm: 12.5,
    totalFootLengthCm: 15.5,
    tipSchedule: { fourthRound: 0, every3rdRound: 1, every2ndRound: 3, everyRound: 5 },
  },
  {
    label: "26/27",
    castOnTotal: 48,
    castOnPerNeedle2: 24,
    castOnPerNeedleChart: 12,
    heelStitches: 24,
    heelHeightRows: 22,
    heelSplit: [8, 8, 8],
    pickupStitchesBothSides: 12,
    footLengthToToeCm: 14,
    totalFootLengthCm: 17,
    tipSchedule: { fourthRound: 0, every3rdRound: 1, every2ndRound: 3, everyRound: 5 },
  },
  {
    label: "28/29",
    castOnTotal: 52,
    castOnPerNeedle2: 26,
    castOnPerNeedleChart: 13,
    heelStitches: 26,
    heelHeightRows: 24,
    heelSplit: [8, 10, 8],
    pickupStitchesBothSides: 13,
    footLengthToToeCm: 14,
    totalFootLengthCm: 18,
    tipSchedule: { fourthRound: 0, every3rdRound: 2, every2ndRound: 3, everyRound: 5 },
  },
  {
    label: "30/31",
    castOnTotal: 52,
    castOnPerNeedle2: 26,
    castOnPerNeedleChart: 13,
    heelStitches: 26,
    heelHeightRows: 24,
    heelSplit: [8, 10, 8],
    pickupStitchesBothSides: 13,
    footLengthToToeCm: 15.5,
    totalFootLengthCm: 19.5,
    tipSchedule: { fourthRound: 0, every3rdRound: 2, every2ndRound: 3, everyRound: 5 },
  },
  {
    label: "32/33",
    castOnTotal: 56,
    castOnPerNeedle2: 28,
    castOnPerNeedleChart: 14,
    heelStitches: 28,
    heelHeightRows: 26,
    heelSplit: [9, 10, 9],
    pickupStitchesBothSides: 14,
    footLengthToToeCm: 17,
    totalFootLengthCm: 21,
    tipSchedule: { fourthRound: 0, every3rdRound: 2, every2ndRound: 3, everyRound: 6 },
  },
  {
    label: "34/35",
    castOnTotal: 56,
    castOnPerNeedle2: 28,
    castOnPerNeedleChart: 14,
    heelStitches: 28,
    heelHeightRows: 26,
    heelSplit: [9, 10, 9],
    pickupStitchesBothSides: 14,
    footLengthToToeCm: 18,
    totalFootLengthCm: 22,
    tipSchedule: { fourthRound: 0, every3rdRound: 2, every2ndRound: 3, everyRound: 6 },
  },
  {
    label: "36/37",
    castOnTotal: 60,
    castOnPerNeedle2: 30,
    castOnPerNeedleChart: 15,
    heelStitches: 30,
    heelHeightRows: 28,
    heelSplit: [10, 10, 10],
    pickupStitchesBothSides: 15,
    footLengthToToeCm: 18.5,
    totalFootLengthCm: 23.5,
    tipSchedule: { fourthRound: 1, every3rdRound: 2, every2ndRound: 3, everyRound: 6 },
  },
  {
    label: "38/39",
    castOnTotal: 60,
    castOnPerNeedle2: 30,
    castOnPerNeedleChart: 15,
    heelStitches: 30,
    heelHeightRows: 28,
    heelSplit: [10, 10, 10],
    pickupStitchesBothSides: 15,
    footLengthToToeCm: 20,
    totalFootLengthCm: 25,
    tipSchedule: { fourthRound: 1, every3rdRound: 2, every2ndRound: 3, everyRound: 7 },
  },
  {
    label: "40/41",
    castOnTotal: 64,
    castOnPerNeedle2: 32,
    castOnPerNeedleChart: 16,
    heelStitches: 32,
    heelHeightRows: 30,
    heelSplit: [10, 12, 10],
    pickupStitchesBothSides: 16,
    footLengthToToeCm: 21,
    totalFootLengthCm: 26.5,
    tipSchedule: { fourthRound: 1, every3rdRound: 2, every2ndRound: 3, everyRound: 7 },
  },
  {
    label: "42/43",
    castOnTotal: 64,
    castOnPerNeedle2: 32,
    castOnPerNeedleChart: 16,
    heelStitches: 32,
    heelHeightRows: 30,
    heelSplit: [10, 12, 10],
    pickupStitchesBothSides: 16,
    footLengthToToeCm: 22,
    totalFootLengthCm: 27.5,
    tipSchedule: { fourthRound: 1, every3rdRound: 2, every2ndRound: 3, everyRound: 7 },
  },
  {
    label: "44/45",
    castOnTotal: 68,
    castOnPerNeedle2: 34,
    castOnPerNeedleChart: 17,
    heelStitches: 34,
    heelHeightRows: 32,
    heelSplit: [11, 12, 11],
    pickupStitchesBothSides: 17,
    footLengthToToeCm: 22.5,
    totalFootLengthCm: 28.5,
    tipSchedule: { fourthRound: 1, every3rdRound: 2, every2ndRound: 4, everyRound: 7 },
  },
  {
    label: "46/47",
    castOnTotal: 72,
    castOnPerNeedle2: 36,
    castOnPerNeedleChart: 18,
    heelStitches: 36,
    heelHeightRows: 34,
    heelSplit: [12, 12, 12],
    pickupStitchesBothSides: 18,
    footLengthToToeCm: 24,
    totalFootLengthCm: 30,
    tipSchedule: { fourthRound: 1, every3rdRound: 2, every2ndRound: 4, everyRound: 8 },
  },
  {
    label: "48/49",
    castOnTotal: 72,
    castOnPerNeedle2: 36,
    castOnPerNeedleChart: 18,
    heelStitches: 36,
    heelHeightRows: 34,
    heelSplit: [12, 12, 12],
    pickupStitchesBothSides: 18,
    footLengthToToeCm: 24.5,
    totalFootLengthCm: 31,
    tipSchedule: { fourthRound: 1, every3rdRound: 2, every2ndRound: 4, everyRound: 8 },
  },
  {
    label: "50/51",
    castOnTotal: 76,
    castOnPerNeedle2: 38,
    castOnPerNeedleChart: 19,
    heelStitches: 38,
    heelHeightRows: 36,
    heelSplit: [13, 12, 13],
    pickupStitchesBothSides: 19,
    footLengthToToeCm: 25,
    totalFootLengthCm: 32,
    tipSchedule: { fourthRound: 1, every3rdRound: 2, every2ndRound: 5, everyRound: 8 },
  },
] as const;

export function getChartSize(label: string): ChartSize | undefined {
  return SIZE_CHART.find((s) => s.label === label);
}

/**
 * Tip rounds as the wife knits them (max 3 counted rounds).
 *
 * Chart row → unit in one round (times = Nx; skip if 0):
 * - "In der 4. Runde"   → (3 knit, 1 decrease) ×Nx
 * - "In jeder 3. Runde" → (2 knit, 1 decrease) ×Nx
 * - "In jeder 2. Runde" → (1 knit, 1 decrease) ×Nx
 * - "In jeder Runde"    → final close; not counted
 *
 * Each segment is expanded to `count` single rows when knitting
 * (e.g. knit count 2 → "rechts", "rechts", then "Abnahme").
 */
export function deriveTipRounds(schedule: TipDecreaseSchedule): TipRound[] {
  const rounds: TipRound[] = [];
  let index = 1;

  const push = (times: number, knitCount: number): void => {
    if (times <= 0) return;
    rounds.push({
      index,
      title: `${index}. Runde`,
      times,
      unitSegments: [
        { kind: "knit", count: knitCount },
        { kind: "decrease", count: 1 },
      ],
    });
    index += 1;
  };

  push(schedule.fourthRound, 3);
  push(schedule.every3rdRound, 2);
  push(schedule.every2ndRound, 1);

  return rounds;
}

export function tipRoundsForChartSize(chartLabel: string): TipRound[] {
  const chart = getChartSize(chartLabel);
  if (!chart) {
    throw new Error(`Unknown chart size "${chartLabel}"`);
  }
  return deriveTipRounds(chart.tipSchedule);
}
