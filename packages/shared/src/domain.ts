/**
 * KnitHelper domain types.
 *
 * Constitution §2: chart base size ≠ actual size — never collapse them.
 * Constitution §1: do not invent knitting rules; only model what sources state.
 */

/** Stable step identity across patterns and sessions. */
export type StepKey =
  | "cuff"
  | "leg"
  | "heel"
  | "heelKnit"
  | "heelPurl"
  | "split"
  | "pickup"
  | "postJoin"
  | "plainFoot"
  | "tip";

export type StepUnit = "rows" | "rounds" | "once";

/**
 * Stitch direction as written in the Notes (“rechte Reihen” vs “linke Reihen”).
 * - rechte: knit rows/rounds
 * - linke: purl rows/rounds
 * - gemischt: both (e.g. heel cap: rechte + linke halves)
 * - none: not specified (e.g. Bund)
 */
export type StitchDirection = "rechte" | "linke" | "gemischt" | "none";

export type UserRole = "ADMIN" | "KNITTER";

/** One instruction fragment inside a tip round, e.g. "3 rechts" or "1 Abnahme". */
export interface TipSegment {
  /** German domain label as written in the notes. */
  label: string;
  /** How many times this segment repeats in the round (default 1). */
  repeats: number;
}

/** One fully configured tip round (Bandspitze). */
export interface TipRound {
  /** 1-based round index within the tip. */
  index: number;
  /** Display title, e.g. "1. Runde". */
  title: string;
  /**
   * Chart count: how often the (knit + decrease) unit appears in this round.
   * e.g. 4 → (1 rechts, 1 Abnahme) ×4 as in sock-03 tip round 3.
   */
  times: number;
  /** German labels for one unit, e.g. knit="1 rechts", decrease="1 Abnahme". */
  unitSegments: [TipSegment, TipSegment];
}

/** Chart Bandspitze schedule (wife uses first three rows only). */
export interface BandspitzeSchedule {
  /** "In der 4. Runde" — unit (3 rechts, 1 Abnahme), times; 0 = skip. */
  inDer4Runde: number;
  /** "In jeder 3. Runde" — unit (2 rechts, 1 Abnahme), times; 0 = skip. */
  inJeder3Runde: number;
  /** "In jeder 2. Runde" — unit (1 rechts, 1 Abnahme), times; 0 = skip. */
  inJeder2Runde: number;
  /** "In jeder Runde" — final close; NOT used / not counted by wife. */
  inJederRunde: number;
}

/** Row in the REGIA 4-fädig Käppchenferse size chart (construction + Bandspitze). */
export interface ChartSize {
  /** e.g. "44/45" */
  label: string;
  anschlagGesamt: number;
  /** Per needle when knitting on 2 needles (wife's method): total / 2. */
  anschlagProNadel2: number;
  /** Chart value (4 needles): total / 4 — reference only. */
  anschlagProNadelChart: number;
  maschenFuerFerse: number;
  fersenhoeheReihen: number;
  aufteilung: [number, number, number];
  beidseitigeAufnahme: number;
  fusslaengeBisSpitzeCm: number;
  gesamteFusslaengeCm: number;
  bandspitze: BandspitzeSchedule;
}

/** Pattern step template (counts resolved per actual size). */
export interface PatternStep {
  key: StepKey;
  /** i18n key, e.g. "step.cuff" */
  titleKey: string;
  /** Optional technique note i18n key. */
  techniqueNoteKey?: string;
  unit: StepUnit;
  /** Stitch direction (rechte/linke) — preserved from Notes wording. */
  stitch: StitchDirection;
  /**
   * For non-tip steps: default count when an actual size has no override.
   * For tip: undefined — tip rounds are explicit.
   */
  defaultCount?: number;
  /** Explicit tip structure (only for key === "tip"). */
  tipRounds?: TipRound[];
}

export interface Pattern {
  id: string;
  name: string;
  nameKey: string;
  description?: string;
  steps: PatternStep[];
}

/**
 * Concrete counts for one actual size on a pattern.
 * Tip is fully configured here (Constitution: tip per actual size).
 */
export interface ActualSizeConfig {
  id: string;
  patternId: string;
  /** e.g. "40/41", "37/38", "18" */
  label: string;
  /**
   * Chart base used for construction fields.
   * May differ from the actual size label (e.g. actual 40/41 with chart 44/45).
   */
  chartSizeLabel: string;
  /** step.key → concrete count (non-tip). */
  counts: Partial<Record<StepKey, number>>;
  /** Tip rounds for this actual size (overrides pattern default). */
  tipRounds: TipRound[];
  /** Free-text tags from notes, e.g. "aktuelle Socken". */
  tags?: string[];
  notes?: string;
}

export interface SessionStepProgress {
  stepKey: StepKey;
  sortIndex: number;
  titleKey: string;
  techniqueNoteKey?: string;
  unit: StepUnit;
  targetCount: number;
  tipRounds?: TipRound[];
  /** Completed rows/rounds for sock 1 and sock 2 of the pair. */
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
  /** Which sock of the pair is currently knitted in the UI. */
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
  /** Construction snapshot from the chart (always followed for heel etc.). */
  chart: ChartSize;
  /** Number of needles used (2 — wife's method). */
  needleCount: number;
  steps: PlannedStep[];
}
