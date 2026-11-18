// Sizing model for the 002-sizing-research spike (research evidence, not product code).
//
// Usage:
//   node specs/002-sizing-research/model.mjs            proposal table EU 15..51 + test cases
//   node specs/002-sizing-research/model.mjs --de       German table rows for vergleich-de.md
//   node specs/002-sizing-research/model.mjs --report   foot-data comparison tables for report.md
//   node specs/002-sizing-research/model.mjs --size 27 [--cm 16.5]   one size as JSON
//   node specs/002-sizing-research/model.mjs --cm 16.5  one size from a measured foot length
//
// Rules are written out in report.md (R1..R10). Every computed value is a proposal
// ("berechnet") until the knitter accepts it (constitution amendment P1).
// Exit code 1: a test-case deviation or a monotonic break has no recorded explanation.

const MIN_SIZE = 15;
const MAX_SIZE = 51;

// ---------------------------------------------------------------------------
// Data: every size she has knitted (docs/domain/gestrickte-groessen.md).
// fitSize = single size assumed for fitting; covers = whole EU sizes of her label.
// tip = counted tip units [fourthRound, every3rdRound, every2ndRound].
// ---------------------------------------------------------------------------

const KNITTED = [
  {
    id: "15",
    label: "15",
    fitSize: 15,
    covers: [15, 15],
    certain: true,
    chartSize: "22/23 (overrides)",
    castOnTotal: 36,
    cuff: 21,
    leg: 5,
    heel: 16,
    heelSplit: [6, 6, 6],
    pickup: 9,
    postJoin: 3,
    plainFoot: 17,
    tip: [0, 1, 3],
    source: "packages/shared/data/actual-sizes/size-15.json",
  },
  {
    id: "17",
    label: "17",
    fitSize: 17,
    covers: [17, 17],
    certain: true,
    chartSize: "none",
    castOnTotal: 40,
    cuff: 25,
    leg: 5,
    heel: 18,
    heelSplit: [7, 6, 7],
    pickup: 10,
    postJoin: 3,
    plainFoot: 21,
    tip: [0, 1, 3],
    source: "handwritten note ca. 17 (private)",
  },
  {
    id: "18",
    label: "18",
    fitSize: 18,
    covers: [18, 18],
    certain: true,
    chartSize: "22/23",
    castOnTotal: 44,
    cuff: 25,
    leg: 5,
    heel: 20,
    heelSplit: [7, 8, 7],
    pickup: 11,
    postJoin: 3,
    plainFoot: 25,
    tip: [0, 1, 3],
    source: "packages/shared/data/actual-sizes/size-18.json",
  },
  {
    id: "19-20",
    label: "19-20",
    fitSize: 19.5,
    covers: [19, 20],
    certain: true,
    chartSize: "24/25",
    castOnTotal: 48,
    cuff: 28,
    leg: 8,
    heel: 22,
    heelSplit: [8, 8, 8],
    pickup: 12,
    postJoin: 3,
    plainFoot: 29,
    tip: [0, 1, 3],
    source: "handwritten note 19-20 (private)",
  },
  {
    id: "24-uncertain",
    label: "24 (chart 30/31)",
    fitSize: 24,
    covers: [24, 24],
    certain: false,
    chartSize: "30/31",
    castOnTotal: 52,
    cuff: 34,
    leg: 12,
    heel: 24,
    heelSplit: [8, 10, 8],
    pickup: null,
    postJoin: 5,
    plainFoot: 40,
    tip: [0, 2, 3],
    source: "handwritten note 30/31 for actual 24 (private)",
  },
  {
    id: "37/38",
    label: "37/38",
    fitSize: 37.5,
    covers: [37, 38],
    certain: true,
    chartSize: "44/45",
    castOnTotal: 68,
    cuff: 40,
    leg: 15,
    heel: 32,
    heelSplit: [11, 12, 11],
    pickup: 17,
    postJoin: 5,
    plainFoot: 45,
    tip: [1, 2, 4],
    source: "packages/shared/data/actual-sizes/size-37-38.json",
  },
  {
    id: "39/40",
    label: "39/40",
    fitSize: 39.5,
    covers: [39, 40],
    certain: true,
    chartSize: "44/45",
    castOnTotal: 68,
    cuff: 40,
    leg: 15,
    heel: 32,
    heelSplit: [11, 12, 11],
    pickup: 17,
    postJoin: 5,
    plainFoot: 48,
    tip: [1, 2, 4],
    source: "handwritten note 39/40 (private)",
  },
  {
    id: "40/41",
    label: "40/41",
    fitSize: 40.5,
    covers: [40, 41],
    certain: true,
    chartSize: "44/45",
    castOnTotal: 68,
    cuff: 40,
    leg: 15,
    heel: 32,
    heelSplit: [11, 12, 11],
    pickup: 17,
    postJoin: 5,
    plainFoot: 51,
    tip: [1, 2, 4],
    source: "packages/shared/data/actual-sizes/size-40-41.json",
  },
  {
    id: "43-45",
    label: "43-45",
    fitSize: 44,
    covers: [43, 45],
    certain: true,
    chartSize: "48/49",
    castOnTotal: 72,
    cuff: 42,
    leg: 15,
    heel: 34,
    heelSplit: [12, 12, 12],
    pickup: 18,
    postJoin: 5,
    plainFoot: 60,
    tip: [1, 2, 4],
    source: "handwritten note 43-45 (private)",
  },
  {
    id: "50/51",
    label: "50/51",
    fitSize: 50.5,
    covers: [50, 51],
    certain: true,
    chartSize: "50/51",
    castOnTotal: 76,
    cuff: 45,
    leg: 15,
    heel: 36,
    heelSplit: [13, 12, 13],
    pickup: 19,
    postJoin: 5,
    plainFoot: 62,
    tip: [1, 2, 5],
    source: "packages/shared/data/actual-sizes/size-50-51.json",
  },
];

const COUNT_KEYS = [
  "castOnTotal",
  "cuff",
  "leg",
  "heel",
  "heelSplit",
  "pickup",
  "postJoin",
  "plainFoot",
  "tip",
];

// Every difference between the pure rules and a certain knitted size needs an entry here.
const EXPLAINED_DEVIATIONS = {
  "15.plainFoot":
    "R9a baby line is a least-squares fit through four sizes; her 15 lies 1 row above it (within ±2).",
  "17.cuff":
    "R6 is a straight line on the stitch count; her 17 and 18 share Bündchen 25, the line gives 24 and 26.",
  "17.plainFoot":
    "R9a baby line; her 'ca. 17' lies 2 rows below it (within ±2). The size is approximate and the note's foot tally was still in progress.",
  "18.cuff":
    "R6 is a straight line on the stitch count; her 17 and 18 share Bündchen 25, the line gives 24 and 26.",
  "18.plainFoot": "R9a baby line; her 18 lies 1 row above it (within ±2).",
  "37/38.plainFoot": "R9c adult line; her 37/38 lies 2 rows above it (within ±2).",
  "39/40.plainFoot": "R9c adult line; her 39/40 lies 1 row below it (within ±2).",
  "40/41.plainFoot": "R9c adult line; her 40/41 lies 1 row below it (within ±2).",
  "43-45.plainFoot":
    "R9c adult line; her 43-45 lies 1 row above it (within ±2). Assumed single size 44.",
  "50/51.plainFoot":
    "Outside ±2. The source note names only the chart size 50/51, no actual size. Her 62 rows match an actual size of about 46 under R9c, which fits her habit of knitting on a chart 4 to 7 sizes above the foot. Kept as her value; excluded from the R9c fit; open question for her (report, Q1).",
};

// Breaks of "never decreases as the size grows" in the printed table need an entry here.
const EXPLAINED_NON_MONOTONIC = {
  "plainFoot@47":
    "Size 46 is the last size on 72 stitches; 47 switches to 76 stitches, whose heel cap and tip are 4 rounds longer in total. The total foot rounds still grow.",
  "plainFoot@50":
    "50/51 shows her knitted 62 rows; the rule proposes 11 more (see EXPLAINED_DEVIATIONS 50/51.plainFoot, open question Q1).",
  "totalFootRounds@50":
    "50/51 shows her knitted 62 rows; the rule proposes 11 more (see EXPLAINED_DEVIATIONS 50/51.plainFoot, open question Q1).",
};

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/** D4: ISO/TS 19407 convention, foot length = (EU size - 2) Paris points of 2/3 cm. */
function footLengthFromSize(size) {
  return ((size - 2) * 2) / 3;
}

function sizeFromFootLength(cm) {
  return cm * 1.5 + 2;
}

// R1: cast-on bands by shoe size (girth-driven). `below` is the exclusive upper size limit.
const CAST_ON_BANDS = [
  { below: 16.5, castOnTotal: 36, basis: "knitted 15" },
  { below: 17.5, castOnTotal: 40, basis: "knitted 17" },
  { below: 18.5, castOnTotal: 44, basis: "knitted 18" },
  { below: 20.5, castOnTotal: 48, basis: "knitted 19-20" },
  { below: 24.5, castOnTotal: 52, basis: "interpolated, 4 sizes per 4 stitches" },
  { below: 28.5, castOnTotal: 56, basis: "interpolated, 4 sizes per 4 stitches" },
  { below: 32.5, castOnTotal: 60, basis: "interpolated, 4 sizes per 4 stitches" },
  { below: 36.5, castOnTotal: 64, basis: "interpolated, 4 sizes per 4 stitches" },
  { below: 41.5, castOnTotal: 68, basis: "knitted 37/38, 39/40, 40/41" },
  { below: 46.5, castOnTotal: 72, basis: "knitted 43-45" },
  { below: Number.POSITIVE_INFINITY, castOnTotal: 76, basis: "knitted 50/51 (largest she knits)" },
];

function castOnFor(size) {
  const band = CAST_ON_BANDS.find((b) => size < b.below);
  return band.castOnTotal;
}

// R3: Aufteilung by cast-on. 36 and 40 are her own; 44..76 are the REGIA chart rows she follows.
const HEEL_SPLIT = {
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

// R5: tip units by cast-on (her tips equal the chart rows; 36 and 40 continue the pattern).
function tipScheduleFor(castOnTotal) {
  const fourthRound = castOnTotal >= 60 ? 1 : 0;
  const every3rdRound = castOnTotal >= 52 ? 2 : 1;
  let every2ndRound = 3;
  if (castOnTotal >= 68) every2ndRound = 4;
  if (castOnTotal >= 76) every2ndRound = 5;
  // One first decrease round, then the schedule, 4 stitches per decrease round, 8 stitches left.
  const everyRound = (castOnTotal - 8) / 4 - 1 - fourthRound - every3rdRound - every2ndRound;
  return { fourthRound, every3rdRound, every2ndRound, everyRound };
}

/** All tip rounds: first decrease round + (3+1), (2+1), (1+1) units + every-round decreases. */
function tipRounds(schedule) {
  const { fourthRound, every3rdRound, every2ndRound, everyRound } = schedule;
  return 1 + 4 * fourthRound + 3 * every3rdRound + 2 * every2ndRound + everyRound;
}

// R6: Bündchen, least-squares line on the stitch count (nine certain sizes).
function cuffFor(castOnTotal) {
  return Math.round(0.584 * castOnTotal + 0.24);
}

// R7: Rechte Reihen: 5 up to 44 stitches, 8 at 48, straight line to 15 at 68, then 15.
function legFor(castOnTotal) {
  if (castOnTotal <= 44) return 5;
  if (castOnTotal >= 68) return 15;
  return Math.round(8 + ((castOnTotal - 48) * 7) / 20);
}

// R8: rows after joining: her small sizes (up to 48 stitches) use 3, her large ones (68+) use 5.
// The switch is placed halfway between her nearest knitted stitch counts (48 and 68).
function postJoinFor(castOnTotal) {
  return castOnTotal <= 56 ? 3 : 5;
}

function constructionFor(castOnTotal) {
  const heelSplit = HEEL_SPLIT[castOnTotal];
  return {
    castOnTotal,
    heelStitches: castOnTotal / 2,
    heelHeightRows: castOnTotal / 2 - 2, // R2
    heelSplit,
    pickupStitchesBothSides: castOnTotal / 4, // R4
    tipSchedule: tipScheduleFor(castOnTotal), // R5
  };
}

/**
 * R10: foot rounds that are fixed by the construction: heel cap (2 x side stitches),
 * rows after joining, gusset (one round per middle stitch: 2 stitches every 2nd round)
 * and all tip rounds.
 */
function fixedFootRounds(heelSplit, postJoin, schedule) {
  return 2 * heelSplit[0] + postJoin + heelSplit[1] + tipRounds(schedule);
}

// R9: total foot rounds T as a function of foot length L (cm).
const BABY_LINE = { intercept: -12.5, slope: 7.12 }; // R9a, fitted to 15, 17, 18, 19-20
const ADULT_LINE = { intercept: 7.1, slope: 4.28 }; // R9c, fitted to 37/38, 39/40, 40/41, 43-45
const BABY_END_CM = footLengthFromSize(20); // upper end of her knitted baby range
const ADULT_START_CM = footLengthFromSize(37); // lower end of her knitted adult range

function line(l, cm) {
  return l.intercept + l.slope * cm;
}

function footRule(cm) {
  if (cm <= BABY_END_CM) return "R9a";
  if (cm >= ADULT_START_CM) return "R9c";
  return "R9b";
}

function totalFootRounds(cm, adultLine = ADULT_LINE, babyLine = BABY_LINE) {
  if (cm <= BABY_END_CM) return line(babyLine, cm);
  if (cm >= ADULT_START_CM) return line(adultLine, cm);
  // R9b: straight bridge between the end of the baby line and the start of the adult line.
  const from = line(babyLine, BABY_END_CM);
  const to = line(adultLine, ADULT_START_CM);
  return from + ((to - from) * (cm - BABY_END_CM)) / (ADULT_START_CM - BABY_END_CM);
}

function sizeLabel(size) {
  return Number.isInteger(size) ? String(size) : size.toFixed(1);
}

function resolveInput(input) {
  const hasSize = typeof input.shoeSizeEu === "number";
  const hasLength = typeof input.footLengthCm === "number";
  if (!hasSize && !hasLength) throw new Error("Give shoeSizeEu or footLengthCm.");
  const size = hasSize ? input.shoeSizeEu : sizeFromFootLength(input.footLengthCm);
  const cm = hasLength ? input.footLengthCm : footLengthFromSize(size);
  if (size < MIN_SIZE || size > MAX_SIZE) {
    throw new Error(`Size ${size.toFixed(1)} is outside EU ${MIN_SIZE} to ${MAX_SIZE}.`);
  }
  return { size, cm, hasSize, hasLength };
}

function nearestKnitted(size) {
  const certain = KNITTED.filter((k) => k.certain);
  const below = certain.filter((k) => k.fitSize <= size).at(-1);
  const above = certain.find((k) => k.fitSize >= size);
  return [...new Set([below?.label, above?.label].filter(Boolean))];
}

/** Pure rules, no knitted override. Options allow sensitivity runs. */
function compute(input, options = {}) {
  const { size, cm, hasSize, hasLength } = resolveInput(input);
  const castOnTotal = castOnFor(size);
  const construction = constructionFor(castOnTotal);
  const postJoin = postJoinFor(castOnTotal);
  const fixed = fixedFootRounds(construction.heelSplit, postJoin, construction.tipSchedule);
  const density = options.densityFactor ?? 1;
  const total = totalFootRounds(cm, options.adultLine, options.babyLine) * density;
  const counts = {
    cuff: cuffFor(castOnTotal),
    leg: legFor(castOnTotal),
    heel: construction.heelHeightRows,
    postJoin,
    plainFoot: Math.round(total - fixed),
  };
  return {
    label: hasSize ? sizeLabel(size) : `${cm.toFixed(1)} cm`,
    shoeSizeEu: Number(size.toFixed(2)),
    footLengthCm: Number(cm.toFixed(2)),
    footLengthSource: hasLength ? "measured" : "from shoe size, (EU - 2) x 2/3 cm",
    construction,
    counts,
    totalFootRounds: fixed + counts.plainFoot,
    provenance: {
      castOnTotal: "berechnet",
      heelHeightRows: "berechnet",
      heelSplit: "berechnet",
      pickupStitchesBothSides: "berechnet",
      tipSchedule: "berechnet",
      cuff: "berechnet",
      leg: "berechnet",
      heel: "berechnet",
      postJoin: "berechnet",
      plainFoot: "berechnet",
    },
    basis: {
      nearestKnitted: nearestKnitted(size),
      rules: ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", footRule(cm), "R10"],
      notes: [],
    },
  };
}

function knittedCovering(size) {
  return KNITTED.filter((k) => k.certain && size >= k.covers[0] && size <= k.covers[1]);
}

/**
 * Contract (contracts/sizing-model.md): a size she has knitted returns her values with
 * provenance "knitted"; everything else is "berechnet". A measured foot length always
 * recomputes plainFoot.
 */
function propose(input) {
  const computed = compute(input);
  if (typeof input.shoeSizeEu !== "number") return computed;
  const covering = knittedCovering(input.shoeSizeEu);
  if (covering.length > 1) {
    const labels = covering.map((k) => `${k.label} (${k.plainFoot} foot rows)`).join(" and ");
    computed.basis.notes.push(`Covered by two knitted sizes: ${labels}; computed value shown.`);
    return computed;
  }
  if (covering.length === 0) return computed;

  const k = covering[0];
  const measured = typeof input.footLengthCm === "number";
  const schedule = {
    fourthRound: k.tip[0],
    every3rdRound: k.tip[1],
    every2ndRound: k.tip[2],
    everyRound: tipScheduleFor(k.castOnTotal).everyRound,
  };
  const fixed = fixedFootRounds(k.heelSplit, k.postJoin, schedule);
  const plainFoot = measured
    ? Math.round(totalFootRounds(input.footLengthCm) - fixed)
    : k.plainFoot;
  const notes = [`Her knitted size ${k.label} (${k.source}).`];
  if (measured) notes.push("plainFoot recomputed from the measured foot length.");
  return {
    ...computed,
    label: k.label,
    construction: {
      castOnTotal: k.castOnTotal,
      heelStitches: k.castOnTotal / 2,
      heelHeightRows: k.heel,
      heelSplit: k.heelSplit,
      pickupStitchesBothSides: k.pickup,
      tipSchedule: schedule,
    },
    counts: { cuff: k.cuff, leg: k.leg, heel: k.heel, postJoin: k.postJoin, plainFoot },
    totalFootRounds: fixed + plainFoot,
    provenance: {
      castOnTotal: "knitted",
      heelHeightRows: "knitted",
      heelSplit: "knitted",
      pickupStitchesBothSides: "knitted",
      tipSchedule: "knitted (everyRound: berechnet, she does not count it)",
      cuff: "knitted",
      leg: "knitted",
      heel: "knitted",
      postJoin: "knitted",
      plainFoot: measured ? "berechnet" : "knitted",
    },
    basis: { ...computed.basis, nearestKnitted: [k.label], notes },
  };
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function validate(result) {
  const errors = [];
  const c = result.construction;
  const sum = c.heelSplit[0] + c.heelSplit[1] + c.heelSplit[2];
  if (c.castOnTotal % 4 !== 0) errors.push("castOnTotal is not divisible by 4");
  if (sum !== c.castOnTotal / 2) errors.push("heelSplit does not add up to castOnTotal / 2");
  const numbers = [
    c.castOnTotal,
    c.heelHeightRows,
    c.pickupStitchesBothSides,
    c.tipSchedule.every3rdRound,
    c.tipSchedule.every2ndRound,
    c.tipSchedule.everyRound,
    ...Object.values(result.counts),
  ];
  if (numbers.some((n) => !Number.isInteger(n) || n <= 0)) {
    errors.push("a count is not a positive integer");
  }
  if (!Number.isInteger(c.tipSchedule.fourthRound) || c.tipSchedule.fourthRound < 0) {
    errors.push("tipSchedule.fourthRound is not a non-negative integer");
  }
  return errors;
}

function tipCounted(schedule) {
  return [schedule.fourthRound, schedule.every3rdRound, schedule.every2ndRound];
}

function modelValue(result, key) {
  switch (key) {
    case "castOnTotal":
      return result.construction.castOnTotal;
    case "heelSplit":
      return result.construction.heelSplit;
    case "pickup":
      return result.construction.pickupStitchesBothSides;
    case "tip":
      return tipCounted(result.construction.tipSchedule);
    default:
      return result.counts[key];
  }
}

function show(value) {
  return Array.isArray(value) ? value.join("-") : String(value);
}

function runTestCases() {
  const lines = [];
  let unexplained = 0;
  let footWithin2 = 0;
  const tally = Object.fromEntries(COUNT_KEYS.map((key) => [key, { match: 0, deviation: 0 }]));
  const certain = KNITTED.filter((k) => k.certain);
  const used = new Set();

  for (const k of certain) {
    const result = compute({ shoeSizeEu: k.fitSize });
    const cm = footLengthFromSize(k.fitSize).toFixed(1);
    lines.push(`${k.label} (computed at EU ${k.fitSize}, foot ${cm} cm; ${k.source})`);
    for (const key of COUNT_KEYS) {
      const expected = show(k[key]);
      const actual = show(modelValue(result, key));
      if (expected === actual) {
        tally[key].match += 1;
        lines.push(`  ${key.padEnd(12)} match      ${expected}`);
        continue;
      }
      tally[key].deviation += 1;
      const id = `${k.id}.${key}`;
      const explanation = EXPLAINED_DEVIATIONS[id];
      used.add(id);
      if (!explanation) unexplained += 1;
      lines.push(`  ${key.padEnd(12)} deviation  hers ${expected}, model ${actual}`);
      lines.push(`               ${explanation ?? "NO EXPLANATION RECORDED"}`);
    }
    if (Math.abs(result.counts.plainFoot - k.plainFoot) <= 2) footWithin2 += 1;
  }

  const stale = Object.keys(EXPLAINED_DEVIATIONS).filter((id) => !used.has(id));
  return { lines, unexplained, footWithin2, total: certain.length, tally, stale };
}

function wholeSizes() {
  const sizes = [];
  for (let size = MIN_SIZE; size <= MAX_SIZE; size += 1) sizes.push(size);
  return sizes;
}

const MONOTONIC_FIELDS = [
  ["castOnTotal", (r) => r.construction.castOnTotal],
  ["cuff", (r) => r.counts.cuff],
  ["leg", (r) => r.counts.leg],
  ["heel", (r) => r.counts.heel],
  ["pickup", (r) => r.construction.pickupStitchesBothSides],
  ["postJoin", (r) => r.counts.postJoin],
  ["tip.fourthRound", (r) => r.construction.tipSchedule.fourthRound],
  ["tip.every3rdRound", (r) => r.construction.tipSchedule.every3rdRound],
  ["tip.every2ndRound", (r) => r.construction.tipSchedule.every2ndRound],
  ["tip.everyRound", (r) => r.construction.tipSchedule.everyRound],
  ["totalFootRounds", (r) => r.totalFootRounds],
  ["plainFoot", (r) => r.counts.plainFoot],
];

/**
 * Counts never decrease as the size grows. plainFoot may dip where the stitch count
 * steps up (the longer heel cap, gusset and tip take over those rounds) as long as the
 * total foot rounds do not decrease; every other break needs a recorded explanation.
 */
function checkMonotonic(results) {
  const lines = [];
  let unexplained = 0;
  for (let i = 1; i < results.length; i += 1) {
    const prev = results[i - 1];
    const cur = results[i];
    for (const [name, get] of MONOTONIC_FIELDS) {
      if (get(cur) >= get(prev)) continue;
      const where = `EU ${prev.shoeSizeEu} -> ${cur.shoeSizeEu}: ${name} ${get(prev)} -> ${get(cur)}`;
      const castOnStep = cur.construction.castOnTotal > prev.construction.castOnTotal;
      const totalGrows = cur.totalFootRounds >= prev.totalFootRounds;
      const explanation = EXPLAINED_NON_MONOTONIC[`${name}@${cur.shoeSizeEu}`];
      if (explanation) {
        lines.push(`  ${where}\n    explained: ${explanation}`);
      } else if (name === "plainFoot" && castOnStep && totalGrows) {
        const from = prev.construction.castOnTotal;
        const to = cur.construction.castOnTotal;
        lines.push(
          `  ${where}\n    explained: stitch count steps ${from} -> ${to}; the longer heel cap, gusset and tip take over these rounds (total foot rounds ${prev.totalFootRounds} -> ${cur.totalFootRounds}).`
        );
      } else {
        unexplained += 1;
        lines.push(`  ${where}\n    NO EXPLANATION RECORDED`);
      }
    }
  }
  return { lines, unexplained };
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function tipText(schedule) {
  const s = schedule;
  return `${s.fourthRound}/${s.every3rdRound}/${s.every2ndRound}/${s.everyRound}`;
}

function tableRow(cells, widths) {
  return cells.map((cell, i) => String(cell).padEnd(widths[i])).join(" ");
}

function printProposalTable(results) {
  const widths = [5, 9, 6, 4, 4, 4, 4, 9, 4, 4, 4, 9, 5, 4];
  const head = [
    "EU",
    "source",
    "cm",
    "M",
    "Bü",
    "RR",
    "Fe",
    "Auft.",
    "auf",
    "nZ",
    "Fuß",
    "Spitze",
    "T",
    "rule",
  ];
  console.log("Proposal table, EU 15..51");
  console.log(
    "M castOnTotal | Bü cuff | RR leg | Fe heel rows | Auft. heelSplit | auf pickup per side |"
  );
  console.log(
    "nZ postJoin | Fuß plainFoot | Spitze fourth/3rd/2nd/every round units | T total foot rounds"
  );
  console.log("");
  console.log(tableRow(head, widths));
  for (const r of results) {
    const knitted = r.provenance.plainFoot === "knitted";
    const c = r.construction;
    console.log(
      tableRow(
        [
          r.shoeSizeEu,
          knitted ? `gestr.${r.label === String(r.shoeSizeEu) ? "" : "*"}` : "berechnet",
          r.footLengthCm.toFixed(1),
          c.castOnTotal,
          r.counts.cuff,
          r.counts.leg,
          r.counts.heel,
          c.heelSplit.join("-"),
          c.pickupStitchesBothSides,
          r.counts.postJoin,
          r.counts.plainFoot,
          tipText(c.tipSchedule),
          r.totalFootRounds,
          knitted ? `knitted ${r.label}` : r.basis.rules.find((rule) => rule.startsWith("R9")),
        ],
        widths
      )
    );
  }
  console.log("");
  console.log("gestr.* = her knitted size whose label covers this EU size (19-20, 37/38, ...).");
  console.log("EU 40 is covered by 39/40 (48 foot rows) and 40/41 (51): computed value shown.");
}

function printUncertain() {
  const k = KNITTED.find((entry) => !entry.certain);
  const r = compute({ shoeSizeEu: k.fitSize });
  console.log("");
  console.log(`Uncertain note (not a test case, not used for fitting): ${k.label}`);
  for (const key of COUNT_KEYS) {
    const hers = k[key] === null ? "not noted" : show(k[key]);
    console.log(`  ${key.padEnd(12)} hers ${hers.padEnd(10)} model ${show(modelValue(r, key))}`);
  }
  const hersTotal =
    fixedFootRounds(k.heelSplit, k.postJoin, tipScheduleFor(k.castOnTotal)) + k.plainFoot;
  console.log(`  total foot rounds: hers ${hersTotal}, model ${r.totalFootRounds}`);
}

function leastSquares(points) {
  const n = points.length;
  const meanX = points.reduce((sum, p) => sum + p[0], 0) / n;
  const meanY = points.reduce((sum, p) => sum + p[1], 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (const [x, y] of points) {
    sxy += (x - meanX) * (y - meanY);
    sxx += (x - meanX) ** 2;
  }
  const slope = sxy / sxx;
  return { intercept: meanY - slope * meanX, slope };
}

function knittedTotalPoint(k) {
  const fixed = fixedFootRounds(k.heelSplit, k.postJoin, tipScheduleFor(k.castOnTotal));
  return [footLengthFromSize(k.fitSize), fixed + k.plainFoot];
}

function fmtLine(l) {
  return `T = ${l.intercept.toFixed(2)} + ${l.slope.toFixed(3)} x L`;
}

/** Shows where the R9 constants come from and how much they depend on single socks. */
function printDerivation() {
  const byId = (ids) => KNITTED.filter((k) => ids.includes(k.id));
  const babyIds = ["15", "17", "18", "19-20"];
  const adultIds = ["37/38", "39/40", "40/41", "43-45"];
  const baby = leastSquares(byId(babyIds).map(knittedTotalPoint));
  const adult = leastSquares(byId(adultIds).map(knittedTotalPoint));
  const adultAll = leastSquares(byId([...adultIds, "50/51"]).map(knittedTotalPoint));

  console.log("");
  console.log("Derivation of R9 (least squares on total foot rounds T over foot length L in cm)");
  console.log(`  R9a baby line   fitted ${fmtLine(baby)}   used ${fmtLine(BABY_LINE)}`);
  console.log(`  R9c adult line  fitted ${fmtLine(adult)}   used ${fmtLine(ADULT_LINE)}`);
  console.log(`  alternative B (adult line including 50/51): ${fmtLine(adultAll)}`);

  console.log("");
  console.log("Leave-one-out (refit without the size, then predict its foot rows)");
  let within2 = 0;
  for (const ids of [babyIds, adultIds]) {
    for (const id of ids) {
      const rest = byId(ids.filter((other) => other !== id)).map(knittedTotalPoint);
      const fitted = leastSquares(rest);
      const k = KNITTED.find((entry) => entry.id === id);
      const options = ids === babyIds ? { babyLine: fitted } : { adultLine: fitted };
      const predicted = compute({ shoeSizeEu: k.fitSize }, options).counts.plainFoot;
      const diff = predicted - k.plainFoot;
      if (Math.abs(diff) <= 2) within2 += 1;
      console.log(
        `  ${k.label.padEnd(6)} hers ${k.plainFoot}, predicted ${predicted} (${diff >= 0 ? "+" : ""}${diff})`
      );
    }
  }
  console.log(`  within ±2 rows: ${within2} of ${babyIds.length + adultIds.length}`);

  console.log("");
  console.log("Sensitivity of plainFoot (rows) for selected sizes");
  console.log("  EU   model  altB   dens-5%  dens+5%  dens+10%");
  for (const size of [16, 21, 24, 27, 30, 33, 36, 40, 42, 46, 47, 48, 49]) {
    const base = compute({ shoeSizeEu: size }).counts.plainFoot;
    const altB = compute({ shoeSizeEu: size }, { adultLine: adultAll }).counts.plainFoot;
    const low = compute({ shoeSizeEu: size }, { densityFactor: 0.95 }).counts.plainFoot;
    const high = compute({ shoeSizeEu: size }, { densityFactor: 1.05 }).counts.plainFoot;
    const higher = compute({ shoeSizeEu: size }, { densityFactor: 1.1 }).counts.plainFoot;
    console.log(
      `  ${String(size).padEnd(4)} ${String(base).padEnd(6)} ${String(altB).padEnd(6)} ${String(low).padEnd(8)} ${String(high).padEnd(8)} ${higher}`
    );
  }
}

// --- German table for the knitter (vergleich-de.md) -------------------------

function tipTextDe(schedule) {
  const parts = [];
  if (schedule.fourthRound > 0) parts.push(`3-1 ×${schedule.fourthRound}`);
  if (schedule.every3rdRound > 0) parts.push(`2-1 ×${schedule.every3rdRound}`);
  if (schedule.every2ndRound > 0) parts.push(`1-1 ×${schedule.every2ndRound}`);
  return parts.join(", ");
}

const DE_NAMES = {
  castOnTotal: "Maschen",
  cuff: "Bündchen",
  leg: "Rechte Reihen",
  heel: "Ferse",
  heelSplit: "Aufteilung",
  pickup: "aufnehmen",
  postJoin: "nach Zusammenstricken",
  plainFoot: "Fuß",
  tip: "Spitze",
};

function deviationTextDe(k) {
  const r = compute({ shoeSizeEu: k.fitSize });
  const parts = [];
  for (const key of COUNT_KEYS) {
    const hers = k[key];
    const model = modelValue(r, key);
    if (show(hers) === show(model)) continue;
    const diff = typeof hers === "number" ? model - hers : null;
    const sign = diff !== null && diff > 0 ? "+" : "";
    const delta = diff === null ? "" : ` (${sign}${diff})`;
    parts.push(`${DE_NAMES[key]} berechnet ${show(model)}${delta}`);
  }
  return parts.length === 0 ? "keine" : parts.join("; ");
}

function noteDe(size) {
  if (size === 16) return "zwischen deinen Größen 15 und 17";
  if (size === 24) {
    return "deine Notiz 30/31 für Größe 24 (unsicher): Bündchen 34, Rechte Reihen 12, nach Zusammenstricken 5, Fuß 40";
  }
  if (size >= 21 && size <= 36) return "dazwischen hast du noch nichts gestrickt";
  if (size === 42) return "zwischen deinen Größen 40/41 und 43-45";
  if (size >= 46 && size <= 49) return "unsicher, hängt an der Frage zu 50/51";
  return "";
}

function printGermanTable() {
  const head =
    "| Größe | Maschen | Bündchen | Rechte Reihen | Ferse | Aufteilung | aufnehmen | nach Zusammenstricken | Fuß (Reihen) | Spitze | Quelle | Abweichung | Urteil |";
  console.log(head);
  console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  const done = new Set();
  const rows = [];
  for (const k of KNITTED.filter((entry) => entry.certain)) {
    rows.push({ order: k.fitSize, knitted: k, result: propose({ shoeSizeEu: k.fitSize }) });
    for (let size = k.covers[0]; size <= k.covers[1]; size += 1) done.add(size);
  }
  for (const size of wholeSizes()) {
    if (!done.has(size)) rows.push({ order: size, result: propose({ shoeSizeEu: size }) });
  }
  rows.sort((a, b) => a.order - b.order);
  for (const { knitted, result } of rows) {
    const c = result.construction;
    const cells = [
      knitted ? `**${knitted.label}**` : result.label,
      c.castOnTotal,
      result.counts.cuff,
      result.counts.leg,
      result.counts.heel,
      c.heelSplit.join("-"),
      c.pickupStitchesBothSides,
      result.counts.postJoin,
      result.counts.plainFoot,
      tipTextDe(c.tipSchedule),
      knitted ? "gestrickt" : "berechnet",
      knitted ? deviationTextDe(knitted) : noteDe(result.shoeSizeEu),
      "",
    ];
    console.log(`| ${cells.join(" | ")} |`);
  }
}

// --- Foot-data comparison for report.md (external numbers are cited there) ---

// Real-world children's and adults' shoe table, foot length in cm per EU size (report, S3).
const SHOP_TABLE_CM = {
  17: 9.7,
  18: 10.5,
  19: 11.2,
  20: 12,
  21: 12.5,
  22: 13.3,
  23: 13.9,
  24: 14.4,
  25: 15.1,
  26: 15.7,
  27: 16.3,
  28: 17,
  29: 17.8,
  30: 18.4,
  31: 19,
  32: 19.7,
  33: 20.3,
  34: 21,
  35: 21.6,
  36: 22.3,
  37: 23,
  38: 23.6,
  39: 24.3,
  40: 25,
  41: 25.6,
  42: 26.2,
};

// REGIA chart "Gesamte Fußlänge (cm)" by the lower size of each chart column (repo chart).
const REGIA_TOTAL_CM = {
  22: 14.5,
  24: 15.5,
  26: 17,
  28: 18,
  30: 19.5,
  32: 21,
  34: 22,
  36: 23.5,
  38: 25,
  40: 26.5,
  42: 27.5,
  44: 28.5,
  46: 30,
  48: 31,
  50: 32,
};

const NOMINAL_STITCHES_PER_CM = 3; // REGIA band gauge: 30 stitches = 10 cm

/** Own linear summary of the cited ball-girth data (report, section 3.2), in cm. */
function ballGirthEstimate(cm) {
  return 3.2 + 0.81 * cm;
}

/** Foot length an adult-rule sock (R9c) with this many total foot rounds is made for. */
function adultRuleFootLength(total) {
  return (total - ADULT_LINE.intercept) / ADULT_LINE.slope;
}

function signed(value, digits) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;
}

function printReportTables() {
  const proposals = wholeSizes().map((s) => propose({ shoeSizeEu: s }));
  console.log(
    "| EU | Source | Foot length used (cm) | Shoe table (cm) | REGIA total (cm) | Sock made for (cm) | Difference (cm) | Difference (sizes) |"
  );
  console.log("| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const r of proposals) {
    const size = r.shoeSizeEu;
    const knitted = r.provenance.plainFoot === "knitted";
    const madeFor = adultRuleFootLength(r.totalFootRounds);
    const diff = madeFor - r.footLengthCm;
    const regia = REGIA_TOTAL_CM[size - (size % 2)];
    const cells = [
      size,
      knitted ? `knitted ${r.label}` : "berechnet",
      r.footLengthCm.toFixed(1),
      SHOP_TABLE_CM[size]?.toFixed(1) ?? "",
      regia?.toFixed(1) ?? "",
      madeFor.toFixed(1),
      signed(diff, 1),
      signed(diff * 1.5, 1),
    ];
    console.log(`| ${cells.join(" | ")} |`);
  }

  console.log("");
  console.log(
    "| EU | Maschen | Sock circumference at 30 M/10 cm (cm) | Ball girth estimate (cm) | Sock / foot |"
  );
  console.log("| --- | --- | --- | --- | --- |");
  for (const r of proposals) {
    const around = r.construction.castOnTotal / NOMINAL_STITCHES_PER_CM;
    const girth = ballGirthEstimate(r.footLengthCm);
    const share = Math.round((around / girth) * 100);
    const cells = [
      r.shoeSizeEu,
      r.construction.castOnTotal,
      around.toFixed(1),
      girth.toFixed(1),
      `${share}%`,
    ];
    console.log(`| ${cells.join(" | ")} |`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : Number(process.argv[index + 1]);
}

function main() {
  if (process.argv.includes("--de")) {
    printGermanTable();
    return 0;
  }
  if (process.argv.includes("--report")) {
    printReportTables();
    return 0;
  }

  const size = argValue("--size");
  const cm = argValue("--cm");
  if (size !== undefined || cm !== undefined) {
    const input = {};
    if (size !== undefined) input.shoeSizeEu = size;
    if (cm !== undefined) input.footLengthCm = cm;
    console.log(JSON.stringify(propose(input), null, 2));
    return 0;
  }

  const proposals = wholeSizes().map((s) => propose({ shoeSizeEu: s }));
  const pure = wholeSizes().map((s) => compute({ shoeSizeEu: s }));
  printProposalTable(proposals);
  printUncertain();

  let failures = 0;

  console.log("");
  console.log("Validation (stitch rules, positive integers)");
  const invalid = [...proposals, ...pure].flatMap((r) =>
    validate(r).map((error) => `  EU ${r.shoeSizeEu}: ${error}`)
  );
  console.log(invalid.length === 0 ? "  ok for all sizes" : invalid.join("\n"));
  failures += invalid.length;

  console.log("");
  console.log("Monotonic check, rules only (no knitted override)");
  const pureCheck = checkMonotonic(pure);
  console.log(pureCheck.lines.length === 0 ? "  no decreases" : pureCheck.lines.join("\n"));
  failures += pureCheck.unexplained;

  console.log("");
  console.log("Monotonic check, proposal table (her knitted values shown where they exist)");
  const tableCheck = checkMonotonic(proposals);
  console.log(tableCheck.lines.length === 0 ? "  no decreases" : tableCheck.lines.join("\n"));
  failures += tableCheck.unexplained;

  console.log("");
  console.log("Test cases: certain knitted sizes against the rules (no knitted override)");
  const tests = runTestCases();
  console.log(tests.lines.join("\n"));
  failures += tests.unexplained;

  console.log("");
  console.log("Summary per count (match / deviation)");
  for (const key of COUNT_KEYS) {
    console.log(`  ${key.padEnd(12)} ${tests.tally[key].match} / ${tests.tally[key].deviation}`);
  }
  const share = Math.round((tests.footWithin2 / tests.total) * 100);
  console.log("");
  console.log(
    `SC-002: plainFoot within ±2 rows for ${tests.footWithin2} of ${tests.total} certain sizes (${share}%, target 80%).`
  );
  if (tests.stale.length > 0) {
    console.log(`Warning: explanations without a deviation: ${tests.stale.join(", ")}`);
  }

  printDerivation();

  console.log("");
  if (failures > 0) {
    console.log(`FAILED: ${failures} problem(s) without a recorded explanation.`);
    return 1;
  }
  console.log("OK: every deviation and every decrease has a recorded explanation.");
  return 0;
}

process.exitCode = main();
