import type { ActualSizeConfig, Pattern, PatternStep, PlannedStep, SteppedPlan } from "./domain";
import { getChartSize, NEEDLE_COUNT } from "./size-chart-seed";

/**
 * Materialize a stepped plan for one chart base + actual size.
 *
 * Constitution §2: construction comes from the chart size; foot-length and tip
 * from the actual-size config. Pattern steps supply the step list and defaults.
 */
export function materializePlan(pattern: Pattern, actualSize: ActualSizeConfig): SteppedPlan {
  const chart = getChartSize(actualSize.chartSizeLabel);
  if (!chart) {
    throw new Error(
      `Unknown chart size "${actualSize.chartSizeLabel}" for actual size ${actualSize.label}.`
    );
  }

  // Notes may override construction (e.g. child size 15: 36 M, 6-6-6, 9 aufnehmen).
  const o = actualSize.construction ?? {};
  const effectiveChart = {
    ...chart,
    castOnTotal: o.castOnTotal ?? chart.castOnTotal,
    castOnPerNeedle2: o.castOnPerNeedle2 ?? chart.castOnPerNeedle2,
    heelStitches: o.heelStitches ?? chart.heelStitches,
    heelHeightRows: o.heelHeightRows ?? chart.heelHeightRows,
    heelSplit: o.heelSplit ?? chart.heelSplit,
    pickupStitchesBothSides: o.pickupStitchesBothSides ?? chart.pickupStitchesBothSides,
  };

  const steps: PlannedStep[] = pattern.steps.map((step, sortIndex) =>
    materializeStep(step, sortIndex, actualSize)
  );

  return {
    patternId: pattern.id,
    patternName: pattern.name,
    chartSizeLabel: actualSize.chartSizeLabel,
    actualSizeLabel: actualSize.label,
    chart: effectiveChart,
    needleCount: NEEDLE_COUNT,
    steps,
  };
}

function materializeStep(
  step: PatternStep,
  sortIndex: number,
  actualSize: ActualSizeConfig
): PlannedStep {
  const notePart =
    step.techniqueNoteKey !== undefined ? { techniqueNoteKey: step.techniqueNoteKey } : {};
  const base = {
    stepKey: step.key,
    sortIndex,
    titleKey: step.titleKey,
    ...notePart,
    unit: step.unit,
    stitch: step.stitch,
  };

  if (step.key === "tip") {
    const tipRounds = actualSize.tipRounds.length ? actualSize.tipRounds : (step.tipRounds ?? []);
    return {
      ...base,
      targetCount: tipRounds.length,
      tipRounds,
    };
  }

  if (step.unit === "once" || step.unit === "finish") {
    // Aufteilung / Aufnehmen / close: single confirmation, no row counter.
    return {
      ...base,
      targetCount: 1,
    };
  }

  const override = actualSize.counts[step.key];
  const targetCount = override ?? step.defaultCount;
  if (targetCount === undefined) {
    throw new Error(
      `No count for step "${step.key}" (actual size ${actualSize.label}). Constitution: do not invent counts — configure the actual size.`
    );
  }

  return {
    ...base,
    targetCount,
  };
}

/** Tick one finished row/round on one sock of the pair. */
export function tickRow(sockDone: number, targetCount: number): number {
  return Math.min(sockDone + 1, targetCount);
}

/** Undo one tick (floor at 0). */
export function untickRow(sockDone: number): number {
  return Math.max(sockDone - 1, 0);
}

export function isStepComplete(sockDone: number, targetCount: number): boolean {
  return sockDone >= targetCount;
}

export function isPairStepComplete(
  sock1Done: number,
  sock2Done: number,
  targetCount: number
): boolean {
  return isStepComplete(sock1Done, targetCount) && isStepComplete(sock2Done, targetCount);
}
