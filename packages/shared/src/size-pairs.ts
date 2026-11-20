import type { Construction, SizePair, TipDecreaseSchedule } from "./domain";

/**
 * Size-pair model (ADR 0007, constitution P1/P3 2.0.0).
 *
 * Port of `specs/002-sizing-research/pairs.mjs`, the model the knitter accepted
 * in research 002. Rules and their basis: `specs/002-sizing-research/report.md`.
 *
 * P3: the construction class (cast-on M → Aufteilung, Ferse, aufnehmen, tip)
 * and the foot size (pair → plain-foot rows) are computed by separate
 * functions; a pair only chooses M.
 *
 * Fits (Bündchen, length share) are computed from her knitted socks at module
 * load, exactly as the script does, so a refit is a data change.
 */

export const SIZE_MODEL_VERSION = "pairs-v1";

/** Her gauge (r11): 52 rows = 10 cm. */
const ROUNDS_PER_CM = 5.2;

type Group = "baby" | "adult" | "unknown";

interface KnittedSock {
  label: string;
  /** Foot size the sock is for (a pair: its larger size). */
  fit: number;
  m: number;
  cuff: number;
  leg: number;
  postJoin: number;
  plainFoot: number;
  group: Group;
  /** Size pair this sock counts as (her knitted pairs). */
  pair?: string;
}

/** Her certain knitted socks (`docs/domain/gestrickte-groessen.md`). 45/46 = app label 50/51 (r06). */
const KNITTED: readonly KnittedSock[] = [
  { label: "15", fit: 15, m: 36, cuff: 21, leg: 5, postJoin: 3, plainFoot: 17, group: "baby" },
  { label: "ca. 17", fit: 17, m: 40, cuff: 25, leg: 5, postJoin: 3, plainFoot: 21, group: "baby" },
  {
    label: "18",
    fit: 18,
    m: 44,
    cuff: 25,
    leg: 5,
    postJoin: 3,
    plainFoot: 25,
    group: "baby",
    pair: "17/18",
  },
  {
    label: "19-20",
    fit: 20,
    m: 48,
    cuff: 28,
    leg: 8,
    postJoin: 3,
    plainFoot: 29,
    group: "baby",
    pair: "19/20",
  },
  {
    label: "37/38",
    fit: 38,
    m: 68,
    cuff: 40,
    leg: 15,
    postJoin: 5,
    plainFoot: 45,
    group: "adult",
    pair: "37/38",
  },
  {
    label: "39/40",
    fit: 40,
    m: 68,
    cuff: 40,
    leg: 15,
    postJoin: 5,
    plainFoot: 48,
    group: "adult",
    pair: "39/40",
  },
  { label: "40/41", fit: 41, m: 68, cuff: 40, leg: 15, postJoin: 5, plainFoot: 51, group: "adult" },
  {
    label: "43-45",
    fit: 44,
    m: 72,
    cuff: 42,
    leg: 15,
    postJoin: 5,
    plainFoot: 60,
    group: "unknown",
  },
  {
    label: "45/46",
    fit: 46,
    m: 76,
    cuff: 45,
    leg: 15,
    postJoin: 5,
    plainFoot: 62,
    group: "adult",
    pair: "45/46",
  },
];

/** Her choices that replace a computed or knitted value (r21). */
const CHOSEN: Readonly<Record<string, { plainFoot: number }>> = {
  "39/40": { plainFoot: 50 },
};

/** Foot length (cm) from EU size, ISO/TS 19407 convention. */
export const footLengthCm = (size: number): number => ((size - 2) * 2) / 3;

// --- Construction class (by cast-on M) -----------------------------------------------------

/** Stitches by the pair's larger size. */
const STITCH_BANDS: readonly (readonly [number, number])[] = [
  [16, 36],
  [17, 40],
  [18, 44],
  [20, 48],
  [24, 52],
  [28, 56],
  [32, 60],
  [36, 64],
  [41, 68],
  [44, 72],
  [Number.POSITIVE_INFINITY, 76],
];

/** Aufteilung: 36 and 40 her own, 44–76 the REGIA chart. Above 76: not defined (r25). */
const HEEL_SPLIT: Readonly<Record<number, readonly [number, number, number]>> = {
  36: [6, 6, 6],
  40: [7, 6, 7],
  44: [7, 8, 7],
  48: [8, 8, 8],
  52: [8, 10, 8],
  56: [9, 10, 9],
  60: [10, 10, 10],
  64: [10, 12, 10],
  68: [11, 12, 11],
  72: [12, 12, 12],
  76: [13, 12, 13],
};

/** Cast-on M for a pair's larger size. */
export function castOnForSize(hi: number): number {
  const band = STITCH_BANDS.find(([max]) => hi <= max);
  if (!band) throw new Error(`no stitch count for size ${hi}`);
  return band[1];
}

function heelSplitFor(m: number): [number, number, number] {
  const split = HEEL_SPLIT[m];
  if (!split) throw new Error(`no Aufteilung for ${m} stitches (above 76 is not defined yet)`);
  return [split[0], split[1], split[2]];
}

/** Tip: her schedule; everyRound closes to 8 stitches and is not counted. */
function tipFor(m: number): TipDecreaseSchedule {
  const fourthRound = m >= 60 ? 1 : 0;
  const every3rdRound = m >= 52 ? 2 : 1;
  const every2ndRound = m >= 76 ? 5 : m >= 68 ? 4 : 3;
  const everyRound = (m - 8) / 4 - 1 - fourthRound - every3rdRound - every2ndRound;
  return { fourthRound, every3rdRound, every2ndRound, everyRound };
}

const tipRoundCount = (t: TipDecreaseSchedule): number =>
  1 + 4 * t.fourthRound + 3 * t.every3rdRound + 2 * t.every2ndRound + t.everyRound;

/** Rechte Reihen: 5 up to 44 M, 15 from 68 M, straight line from 8 at 48 M in between. */
const legFor = (m: number): number =>
  m <= 44 ? 5 : m >= 68 ? 15 : Math.round(8 + ((m - 48) * 7) / 20);

/** Rows after joining: 3 up to 56 M, else 5. */
const postJoinFor = (m: number): number => (m <= 56 ? 3 : 5);

/** Maschen reduzieren (r12, r23): 4 stitches per row until the middle number is gone. */
const reduceRowsFor = (split: readonly [number, number, number]): number => Math.ceil(split[1] / 4);

/** Construction class for cast-on M (P3: independent of the foot size). */
export function constructionFor(m: number): Construction {
  const heelSplit = heelSplitFor(m);
  return {
    castOnTotal: m,
    castOnPerNeedle2: m / 2,
    heelHeightRows: m / 2 - 2,
    heelSplit,
    pickupStitchesBothSides: m / 4,
    tipSchedule: tipFor(m),
  };
}

/** Rows from heel cap to tip end, without the plain foot. */
function fixedRows(m: number): number {
  const split = heelSplitFor(m);
  return 2 * split[0] + postJoinFor(m) + reduceRowsFor(split) + tipRoundCount(tipFor(m));
}

// --- Fits from her data ------------------------------------------------------------------

function leastSquares(points: readonly (readonly [number, number])[]): {
  slope: number;
  intercept: number;
} {
  const n = points.length;
  const mx = points.reduce((a, [x]) => a + x, 0) / n;
  const my = points.reduce((a, [, y]) => a + y, 0) / n;
  const sxy = points.reduce((a, [x, y]) => a + (x - mx) * (y - my), 0);
  const sxx = points.reduce((a, [x]) => a + (x - mx) ** 2, 0);
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

const CUFF = leastSquares(KNITTED.map((k) => [k.m, k.cuff] as const));
const cuffFor = (m: number): number => Math.round(CUFF.slope * m + CUFF.intercept);

const mean = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;
const lengthShare = (k: KnittedSock): number =>
  (fixedRows(k.m) + k.plainFoot) / ROUNDS_PER_CM / footLengthCm(k.fit);

const SHARE = {
  adult: mean(KNITTED.filter((k) => k.group === "adult" && k.pair).map(lengthShare)),
  baby: mean(KNITTED.filter((k) => k.group === "baby").map(lengthShare)),
  from: footLengthCm(20),
  to: footLengthCm(38),
};

function shareFor(cm: number): number {
  if (cm <= SHARE.from) return SHARE.baby;
  if (cm >= SHARE.to) return SHARE.adult;
  return SHARE.baby + ((SHARE.adult - SHARE.baby) * (cm - SHARE.from)) / (SHARE.to - SHARE.from);
}

// --- Pairs ---------------------------------------------------------------------------------

function parsePair(label: string): { lo: number; hi: number } {
  const match = /^(\d{2})\/(\d{2})$/.exec(label);
  const lo = Number(match?.[1]);
  const hi = Number(match?.[2]);
  if (!match || hi !== lo + 1 || lo % 2 === 0 || lo < 15) {
    throw new Error(`not a size pair: "${label}" (expected odd/even from 15/16)`);
  }
  return { lo, hi };
}

/** Foot rows for a pair (P3: from the foot length; M only through the fixed rows). */
function computedPlainFoot(hi: number, m: number): number {
  const cm = footLengthCm(hi);
  return Math.round(ROUNDS_PER_CM * shareFor(cm) * cm - fixedRows(m));
}

/**
 * The pair as offered: her choice, else her knitted pair, else computed
 * (constitution P1). Throws for labels that are not a pair or above 76 M.
 */
export function sizePair(label: string): SizePair {
  const { lo, hi } = parsePair(label);
  const m = castOnForSize(hi);
  const construction = constructionFor(m);
  const knitted = KNITTED.find((k) => k.pair === label);
  const chosen = CHOSEN[label];
  const computedFoot = computedPlainFoot(hi, m);
  return {
    label,
    lo,
    hi,
    construction,
    counts: {
      cuff: knitted?.cuff ?? cuffFor(m),
      leg: legFor(m),
      heel: construction.heelHeightRows,
      postJoin: postJoinFor(m),
      reduceToCastOn: reduceRowsFor(construction.heelSplit),
      plainFoot: chosen?.plainFoot ?? knitted?.plainFoot ?? computedFoot,
    },
  };
}

/** Every pair the model can compute: 15/16 … 49/50. */
export const COMPUTABLE_PAIRS: readonly string[] = Array.from(
  { length: 18 },
  (_, i) => `${15 + 2 * i}/${16 + 2 * i}`
);

/** Pairs offered in the app (47/48 and 49/50 not yet, r25). */
export const OFFERED_PAIRS: readonly string[] = COMPUTABLE_PAIRS.filter(
  (label) => parsePair(label).hi <= 46
);

export function isOfferedPair(label: string): boolean {
  return OFFERED_PAIRS.includes(label);
}
