import { z } from "zod";
import type { PairSession } from "./domain";

/**
 * Checks whether a stored value is a pair session the app can show and keep
 * counting (constitution amendment P4, ADR 0006). Used for CHECKING ONLY:
 * callers keep the original object, so re-saving never strips fields that a
 * newer or older app version wrote. Unknown fields are allowed.
 */

const count = z.number().int().min(0);

const stepKey = z.enum([
  "castOn",
  "cuff",
  "leg",
  "heel",
  "heelKnit",
  "heelPurl",
  "split",
  "pickup",
  "postJoin",
  "reduceToCastOn",
  "plainFoot",
  "tip",
  "close",
]);

const tipSegment = z.looseObject({
  kind: z.enum(["knit", "decrease"]),
  count,
});

const tipRound = z.looseObject({
  index: count,
  title: z.string(),
  times: count,
  unitSegments: z.tuple([tipSegment, tipSegment]),
});

const storedStep = z.looseObject({
  stepKey,
  sortIndex: count,
  titleKey: z.string(),
  techniqueNoteKey: z.string().optional(),
  unit: z.enum(["rows", "rounds", "once", "finish"]),
  targetCount: count,
  displayValue: z.string().optional(),
  tipRoundIndex: count.optional(),
  tipRoundTitle: z.string().optional(),
  tipRowLabel: z.string().optional(),
  tipDirection: z.enum(["knit", "decrease"]).optional(),
  rowPolarity: z.enum(["knit", "purl"]).optional(),
  tipRounds: z.array(tipRound).optional(),
  sock1Done: count,
  sock2Done: count,
});

export const storedPairSessionSchema = z.looseObject({
  id: z.string().min(1),
  userId: z.string(),
  patternId: z.string(),
  chartSizeLabel: z.string(),
  actualSizeLabel: z.string(),
  status: z.enum(["ACTIVE", "DONE", "ARCHIVED"]),
  steps: z.array(storedStep).min(1),
  activeSock: z.union([z.literal(1), z.literal(2)]),
  createdAt: z.string(),
  notes: z.string().optional(),
  // Size-pair sessions (ADR 0007); absent on pairs saved before.
  sizeModel: z.string().optional(),
  castOnTotal: count.optional(),
});

/** True when the app can show and continue this stored pair. */
export function isReadablePairSession(value: unknown): value is PairSession {
  return storedPairSessionSchema.safeParse(value).success;
}
