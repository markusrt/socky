import type { ActualSizeConfig, Pattern, PatternStep, PlannedStep, SteppedPlan } from "./domain";

/**
 * Materialize a stepped plan for one chart base + actual size.
 *
 * Constitution §2: construction comes from the chart size; foot-length and tip
 * from the actual-size config. Pattern steps supply the step list and defaults.
 */
export function materializePlan(pattern: Pattern, actualSize: ActualSizeConfig): SteppedPlan {
  const steps: PlannedStep[] = pattern.steps.map((step, sortIndex) =>
    materializeStep(step, sortIndex, actualSize)
  );

  return {
    patternId: pattern.id,
    patternName: pattern.name,
    chartSizeLabel: actualSize.chartSizeLabel,
    actualSizeLabel: actualSize.label,
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
  };

  if (step.key === "tip") {
    const tipRounds = actualSize.tipRounds.length ? actualSize.tipRounds : (step.tipRounds ?? []);
    return {
      ...base,
      targetCount: tipRounds.length,
      tipRounds,
    };
  }

  if (step.unit === "once") {
    // Aufteilung / Aufnehmen: informational — no row counter.
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
