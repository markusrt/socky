/**
 * Socky domain types.
 *
 * Constitution §2: chart base size ≠ actual size — never collapse them.
 * Constitution §1: do not invent knitting rules; only model what sources state.
 * Constitution §7: German only in user-facing strings (names, titles, tags, notes).
 * Technical identifiers (types, field names, enum values, keys) are English.
 */

/** Stable step identity across patterns and sessions. */
export type StepKey =
  | "castOn"
  | "cuff"
  | "leg"
  | "heel"
  | "heelKnit"
  | "heelPurl"
  | "split"
  | "pickup"
  | "postJoin"
  | "reduceToCastOn"
  | "plainFoot"
  | "tip"
  | "close";

export type StepUnit = "rows" | "rounds" | "once" | "finish";

/**
 * Stitch direction (universal knitting term).
 * Display German lives in labels (e.g. knit → "rechte").
 */
export type StitchDirection = "knit" | "purl" | "mixed" | "none";

export type UserRole = "ADMIN" | "KNITTER";

/**
 * One fragment inside a tip round (e.g. knit 3 then decrease 1).
 * Each unit becomes one tickable row when expanded.
 */
export interface TipSegment {
  /** knit = "rechts", decrease = "Abnahme" */
  kind: "knit" | "decrease";
  /** How many single rows (e.g. 3 → "rechts", "rechts", "rechts"). */
  count: number;
}

/** One tip round (heel-toe decrease). `title` is user-facing (e.g. "1. Runde"). */
export interface TipRound {
  index: number;
  title: string;
  /**
   * How often the (knit + decrease) unit appears in this round.
   * e.g. 4 → (1 knit, 1 decrease) ×4 as in sock-03 tip round 3.
   */
  times: number;
  unitSegments: [TipSegment, TipSegment];
}

/**
 * Chart tip-decrease schedule (first three rows used; final close not counted).
 * Field names map to REGIA rows but stay English.
 */
export interface TipDecreaseSchedule {
  /** "In der 4. Runde" — unit (3 knit, 1 decrease), times; 0 = skip. */
  fourthRound: number;
  /** "In jeder 3. Runde" — unit (2 knit, 1 decrease), times; 0 = skip. */
  every3rdRound: number;
  /** "In jeder 2. Runde" — unit (1 knit, 1 decrease), times; 0 = skip. */
  every2ndRound: number;
  /** "In jeder Runde" — final close; NOT used / not counted. */
  everyRound: number;
}

/** Row in the REGIA 4-fädig size chart (construction + tip schedule). */
export interface ChartSize {
  label: string;
  castOnTotal: number;
  /** Per needle on 2 needles (wife's method): total / 2. */
  castOnPerNeedle2: number;
  /** Chart value (4 needles): total / 4 — reference only. */
  castOnPerNeedleChart: number;
  heelStitches: number;
  heelHeightRows: number;
  heelSplit: [number, number, number];
  pickupStitchesBothSides: number;
  footLengthToToeCm: number;
  totalFootLengthCm: number;
  tipSchedule: TipDecreaseSchedule;
}

/** Pattern step template (counts resolved per actual size). */
export interface PatternStep {
  key: StepKey;
  /** i18n key, e.g. "step.cuff" */
  titleKey: string;
  /** Optional technique note i18n key (English key). */
  techniqueNoteKey?: string;
  unit: StepUnit;
  stitch: StitchDirection;
  defaultCount?: number;
  tipRounds?: TipRound[];
}

export interface Pattern {
  id: string;
  /** User-facing name (may be German / product name). */
  name: string;
  nameKey: string;
  description?: string;
  steps: PatternStep[];
}

/** Concrete counts for one actual size on a pattern. */
export interface ActualSizeConfig {
  id: string;
  patternId: string;
  /** User-facing size label (may be German-ish, e.g. "40/41", "18"). */
  label: string;
  chartSizeLabel: string;
  counts: Partial<Record<StepKey, number>>;
  tipRounds: TipRound[];
  tags?: string[];
  notes?: string;
}

export type TipRowDirection = "knit" | "decrease";

export interface SessionStepProgress {
  stepKey: StepKey;
  sortIndex: number;
  titleKey: string;
  techniqueNoteKey?: string;
  unit: StepUnit;
  targetCount: number;
  /** e.g. "44 (22 / Nadel)" or "11-12-11" or "44". */
  displayValue?: string;
  /** Expanded tip: which tip round this row belongs to (1-based). */
  tipRoundIndex?: number;
  tipRoundTitle?: string;
  /** Single row label: "rechts" or "Abnahme". */
  tipRowLabel?: string;
  tipDirection?: TipRowDirection;
  /** Heel: odd row = knit, even row = purl (alternating). */
  rowPolarity?: "knit" | "purl";
  tipRounds?: TipRound[];
  sock1Done: number;
  sock2Done: number;
}

export type PairSessionStatus = "ACTIVE" | "DONE" | "ARCHIVED";

export interface PairSession {
  id: string;
  userId: string;
  patternId: string;
  chartSizeLabel: string;
  actualSizeLabel: string;
  status: PairSessionStatus;
  steps: SessionStepProgress[];
  activeSock: 1 | 2;
  createdAt: string;
  notes?: string;
}

/** Materialized plan step shown to the knitter. */
export interface PlannedStep {
  stepKey: StepKey;
  sortIndex: number;
  titleKey: string;
  techniqueNoteKey?: string;
  unit: StepUnit;
  stitch: StitchDirection;
  targetCount: number;
  tipRounds?: TipRound[];
}

export interface SteppedPlan {
  patternId: string;
  patternName: string;
  chartSizeLabel: string;
  actualSizeLabel: string;
  chart: ChartSize;
  needleCount: number;
  steps: PlannedStep[];
}
