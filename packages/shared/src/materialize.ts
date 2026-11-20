import type {
  Pattern,
  PatternStep,
  PlannedStep,
  SizePair,
  SizePairCounts,
  SteppedPlan,
} from "./domain";
import { deriveTipRounds, NEEDLE_COUNT } from "./size-chart-seed";

/** Technique note on "Maschen reduzieren" when the last row takes only 2 stitches. */
export const REDUCE_LAST_ROW_NOTE_KEY = "note.reduce_last_row_two";

const PAIR_COUNT_KEYS: ReadonlySet<string> = new Set<keyof SizePairCounts>([
  "cuff",
  "leg",
  "heel",
  "postJoin",
  "reduceToCastOn",
  "plainFoot",
]);

/**
 * Materialize a stepped plan for one size pair (ADR 0007).
 *
 * Constitution P3: construction (cast-on, Aufteilung, aufnehmen, tip) comes
 * from the pair's construction class; row counts from the pair's counts.
 */
export function materializePlan(pattern: Pattern, pair: SizePair): SteppedPlan {
  const steps: PlannedStep[] = pattern.steps.map((step, sortIndex) =>
    materializeStep(step, sortIndex, pair)
  );

  return {
    patternId: pattern.id,
    patternName: pattern.name,
    sizeLabel: pair.label,
    construction: pair.construction,
    needleCount: NEEDLE_COUNT,
    steps,
  };
}

function materializeStep(step: PatternStep, sortIndex: number, pair: SizePair): PlannedStep {
  const noteKey =
    step.key === "reduceToCastOn" && pair.construction.heelSplit[1] % 4 !== 0
      ? REDUCE_LAST_ROW_NOTE_KEY
      : step.techniqueNoteKey;
  const base = {
    stepKey: step.key,
    sortIndex,
    titleKey: step.titleKey,
    ...(noteKey !== undefined ? { techniqueNoteKey: noteKey } : {}),
    unit: step.unit,
    stitch: step.stitch,
  };

  if (step.key === "tip") {
    const tipRounds = deriveTipRounds(pair.construction.tipSchedule);
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

  const fromPair = PAIR_COUNT_KEYS.has(step.key)
    ? pair.counts[step.key as keyof SizePairCounts]
    : undefined;
  const targetCount = fromPair ?? step.defaultCount;
  if (targetCount === undefined) {
    throw new Error(
      `No count for step "${step.key}" (pair ${pair.label}). Constitution P1: do not invent counts.`
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
