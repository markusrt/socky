// Paired-size model and gauge check for the 002-sizing-research spike, round 3
// (research evidence, not product code). Feedback r01-r14 (feedback/round-2.md).
//
// Usage:
//   node specs/002-sizing-research/pairs.mjs        gauge check, pair proposals, tests
//   node specs/002-sizing-research/pairs.mjs --de   German tables for vergleich-paare-de.md
//
// Rules are written out in report.md, section 13 (P1..P6). Every computed value is a
// proposal ("berechnet") until the knitter accepts it (constitution amendment P1).
// Exit code 1: a test case is off by more than 2 foot rows, or the sole length of the
// pairs does not grow with the size.

// --- Her gauge (r11) and the cited foot data (report sections 3.1, 3.2) --------------

const STITCHES_PER_CM = 3.6; // 36 stitches = 10 cm, 2.25 mm needles, baby and adult alike
const ROUNDS_PER_CM = 5.2; // 52 rows (rounds) = 10 cm

/** ISO/TS 19407 convention [S1]: foot length = (EU size - 2) x 2/3 cm. */
function footLength(size) {
  return ((size - 2) * 2) / 3;
}

/** Own linear summary of the cited ball-girth data [S4]-[S6] (report 3.2), in cm. */
function ballGirth(cm) {
  return 3.2 + 0.81 * cm;
}

// --- Construction rules R2-R8 (unchanged from model.mjs, accepted in r05/r13) ---------

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

function tipScheduleFor(m) {
  const fourthRound = m >= 60 ? 1 : 0;
  const every3rdRound = m >= 52 ? 2 : 1;
  let every2ndRound = 3;
  if (m >= 68) every2ndRound = 4;
  if (m >= 76) every2ndRound = 5;
  const everyRound = (m - 8) / 4 - 1 - fourthRound - every3rdRound - every2ndRound;
  return { fourthRound, every3rdRound, every2ndRound, everyRound };
}

function tipRounds(t) {
  return 1 + 4 * t.fourthRound + 3 * t.every3rdRound + 2 * t.every2ndRound + t.everyRound;
}

const cuffFor = (m) => Math.round(0.584 * m + 0.24);
const legFor = (m) => (m <= 44 ? 5 : m >= 68 ? 15 : Math.round(8 + ((m - 48) * 7) / 20));
const postJoinFor = (m) => (m <= 56 ? 3 : 5);

/**
 * P3 (r12): after joining she decreases 2 stitches on each of her two needles, 4 per
 * round, until the cast-on count is back. The surplus is the middle Aufteilung number.
 * Round 2 assumed 2 stitches every 2nd round (middle number of rounds); kept as option.
 */
function gussetRounds(split, assumption = "r12") {
  return assumption === "r12" ? Math.ceil(split[1] / 4) : split[1];
}

/** Rounds of the sole that the construction fixes: heel cap, after joining, gusset, tip. */
function fixedSoleRounds(m, assumption) {
  const split = HEEL_SPLIT[m];
  return (
    2 * split[0] + postJoinFor(m) + gussetRounds(split, assumption) + tipRounds(tipScheduleFor(m))
  );
}

// --- Her knitted socks (docs/domain/gestrickte-groessen.md, corrected by r06) ---------
// fit: the foot size the sock is for; for a pair, its larger size.

const KNITTED = [
  { label: "15", fit: 15, m: 36, plainFoot: 17, group: "baby" },
  { label: "ca. 17", fit: 17, m: 40, plainFoot: 21, group: "baby" },
  { label: "18", fit: 18, m: 44, plainFoot: 25, cuff: 25, group: "baby", pair: "17/18" },
  { label: "19-20", fit: 20, m: 48, plainFoot: 29, group: "baby", pair: "19/20" },
  { label: "37/38", fit: 38, m: 68, plainFoot: 45, group: "adult", pair: "37/38" },
  { label: "39/40", fit: 40, m: 68, plainFoot: 48, group: "adult", pair: "39/40" },
  { label: "40/41", fit: 41, m: 68, plainFoot: 51, group: "adult" },
  { label: "43-45", fit: 44, m: 72, plainFoot: 60, group: "unknown" }, // r08: foot size unknown
  { label: "45/46 (Tabelle 50/51)", fit: 46, m: 76, plainFoot: 62, group: "adult", pair: "45/46" },
];

function soleRounds(m, plainFoot, assumption = "r12") {
  return fixedSoleRounds(m, assumption) + plainFoot;
}

/** Knitted sole (heel cap to tip end) as a share of the foot length. */
function lengthShare(k, assumption = "r12") {
  return soleRounds(k.m, k.plainFoot, assumption) / ROUNDS_PER_CM / footLength(k.fit);
}

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

// P4: length shares. Adult: her three knitted pairs (r04 confirms 45 at 37/38).
// Baby: her four baby socks at the size they were knitted for.
function calibrate(assumption = "r12") {
  const adult = KNITTED.filter((k) => k.group === "adult" && k.pair);
  const baby = KNITTED.filter((k) => k.group === "baby");
  return {
    adult: mean(adult.map((k) => lengthShare(k, assumption))),
    baby: mean(baby.map((k) => lengthShare(k, assumption))),
  };
}

const RAMP_FROM = footLength(20); // her largest baby sock
const RAMP_TO = footLength(38); // her smallest adult pair

/** P4: share of the foot length the sole is knitted to; straight line between groups. */
function shareFor(cm, cal) {
  if (cm <= RAMP_FROM) return cal.baby;
  if (cm >= RAMP_TO) return cal.adult;
  const t = (cm - RAMP_FROM) / (RAMP_TO - RAMP_FROM);
  return cal.baby + (cal.adult - cal.baby) * t;
}

// --- P1: pairs, P2: stitches -----------------------------------------------------------

/** P1: odd/even pairs as sold [S11][S12]; her range 15 to 50 (r01). */
const PAIRS = [];
for (let lo = 15; lo <= 49; lo += 2) PAIRS.push([lo, lo + 1]);

/** P2: stitch count of the pair's larger size (R1), 45/46 = 76 (r06), 76 is the maximum. */
function stitchesFor(upper) {
  const bands = [
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
  ];
  for (const [maxSize, m] of bands) if (upper <= maxSize) return m;
  return 76;
}

function proposePair([lo, hi], cal = calibrate(), assumption = "r12") {
  const m = stitchesFor(hi);
  const split = HEEL_SPLIT[m];
  const cm = footLength(hi);
  const share = shareFor(cm, cal);
  const fixed = fixedSoleRounds(m, assumption);
  const plainFoot = Math.round(ROUNDS_PER_CM * share * cm - fixed);
  const sole = (fixed + plainFoot) / ROUNDS_PER_CM;
  return {
    label: `${lo}/${hi}`,
    lo,
    hi,
    m,
    cuff: cuffFor(m),
    leg: legFor(m),
    heel: m / 2 - 2,
    split,
    pickup: m / 4,
    postJoin: postJoinFor(m),
    gusset: gussetRounds(split, assumption),
    plainFoot,
    tip: tipScheduleFor(m),
    footCm: cm,
    girthCm: ballGirth(cm),
    sockCircCm: m / STITCHES_PER_CM,
    widthShare: m / STITCHES_PER_CM / ballGirth(cm),
    soleCm: sole,
    lengthShare: sole / cm,
    // Growing room: how much longer a foot the sole would fit at the adult share.
    roomCm: sole / cal.adult - cm,
  };
}

// --- Output -----------------------------------------------------------------------------

const f = (x, d = 1) => x.toFixed(d);
const pct = (x) => `${Math.round(x * 100)}%`;

function printGaugeCheck() {
  const cal = calibrate();
  console.log("Gauge check: her knitted socks at 3.6 stitches and 5.2 rounds per cm (r11)");
  console.log(
    "sock | fit | M | sock circ | foot girth | width | sole rounds | sole cm | foot cm | length | length (round-2 gusset)"
  );
  for (const k of KNITTED) {
    const cm = footLength(k.fit);
    const circ = k.m / STITCHES_PER_CM;
    const rounds = soleRounds(k.m, k.plainFoot);
    console.log(
      [
        k.label,
        k.fit,
        k.m,
        f(circ),
        f(ballGirth(cm)),
        pct(circ / ballGirth(cm)),
        rounds,
        f(rounds / ROUNDS_PER_CM),
        f(cm),
        pct(lengthShare(k)),
        pct(lengthShare(k, "round2")),
      ].join(" | ")
    );
  }
  console.log(`Length share: adult ${f(cal.adult, 3)}, baby ${f(cal.baby, 3)}`);
  const cal2 = calibrate("round2");
  console.log(
    `Same with the round-2 gusset assumption: adult ${f(cal2.adult, 3)}, baby ${f(cal2.baby, 3)}`
  );
  console.log(
    `Rounds per cm of foot implied for adults: ${f(ROUNDS_PER_CM * cal.adult, 2)} (round 2 fitted 4.28 without a gauge)`
  );
}

function tipText(t) {
  const parts = [];
  if (t.fourthRound) parts.push(`3-1 x${t.fourthRound}`);
  parts.push(`2-1 x${t.every3rdRound}`, `1-1 x${t.every2ndRound}`);
  return parts.join(", ");
}

function runTests(pairs) {
  let failures = 0;
  console.log("");
  console.log("Test cases: her knitted socks that are a pair (foot rows, model vs knitted)");
  for (const k of KNITTED.filter((x) => x.pair)) {
    const p = pairs.find((x) => x.label === k.pair);
    const diff = p.plainFoot - k.plainFoot;
    const ok = Math.abs(diff) <= 2 && p.m === k.m;
    if (!ok) failures++;
    console.log(
      `  ${k.pair}: M ${p.m}/${k.m}, foot ${p.plainFoot}/${k.plainFoot} (${diff >= 0 ? "+" : ""}${diff}) ${ok ? "ok" : "FAIL"}`
    );
  }
  for (let i = 1; i < pairs.length; i++) {
    if (pairs[i].soleCm <= pairs[i - 1].soleCm) {
      failures++;
      console.log(
        `  FAIL: sole length does not grow from ${pairs[i - 1].label} to ${pairs[i].label}`
      );
    }
  }
  return failures;
}

function printPairs(pairs) {
  console.log("");
  console.log("Pair proposals (P1-P6)");
  console.log(
    "pair | M | cuff | leg | heel | split | pickup | postJoin | gusset | foot | tip | foot cm | width | sole cm | length | room cm | foot (round-2 gusset)"
  );
  const alt = PAIRS.map((pr) => proposePair(pr, calibrate("round2"), "round2"));
  pairs.forEach((p, i) => {
    console.log(
      [
        p.label,
        p.m,
        p.cuff,
        p.leg,
        p.heel,
        p.split.join("-"),
        p.pickup,
        p.postJoin,
        p.gusset,
        p.plainFoot,
        tipText(p.tip),
        f(p.footCm),
        pct(p.widthShare),
        f(p.soleCm),
        pct(p.lengthShare),
        f(p.roomCm),
        alt[i].plainFoot,
      ].join(" | ")
    );
  });
}

// --- German tables (vergleich-paare-de.md) ----------------------------------------------

const KNITTED_PAIR = {
  "17/18": "gestrickt: 18",
  "19/20": "gestrickt: 19-20",
  "37/38": "gestrickt: 37/38",
  "39/40": "gestrickt: 39/40",
  "45/46": "gestrickt: Tabelle 50/51",
};

/** Her knitted pair outranks the computed one (amendment P1); the check uses what is shown. */
function displayed(p) {
  const knitted = KNITTED.find((k) => k.pair === p.label);
  if (!knitted) return { ...p, computedFoot: p.plainFoot, computedCuff: p.cuff };
  const sole = soleRounds(p.m, knitted.plainFoot) / ROUNDS_PER_CM;
  return {
    ...p,
    computedFoot: p.plainFoot,
    computedCuff: p.cuff,
    plainFoot: knitted.plainFoot,
    cuff: knitted.cuff ?? p.cuff,
    soleCm: sole,
    lengthShare: sole / p.footCm,
    roomCm: sole / calibrate().adult - p.footCm,
  };
}

/** Her other socks near a knitted pair, named in its hint. */
const OTHER_KNITTED = {
  "17/18": "dein Paar ca. 17: 40 Maschen, 7-6-7, 21 Reihen Fuß",
};

function hintDe(p) {
  const knitted = KNITTED.find((k) => k.pair === p.label);
  if (knitted) {
    const diffs = [];
    if (p.computedCuff !== p.cuff) diffs.push(`Bündchen ${p.computedCuff}`);
    if (p.computedFoot !== p.plainFoot) diffs.push(`${p.computedFoot} Reihen Fuß`);
    const own = diffs.length ? `Rechnung: ${diffs.join(", ")}` : "Rechnung trifft deine Zahlen";
    return OTHER_KNITTED[p.label] ? `${own}; ${OTHER_KNITTED[p.label]}` : own;
  }
  const notes = {
    "15/16": "dein Paar 15: 17 Reihen Fuß (für Fuß 15)",
    "41/42": "dein Paar 40/41: 68 Maschen, 51 Reihen Fuß",
    "43/44": "dein Paar 43-45: 60 Reihen Fuß",
    "47/48": "enger als deine Socken; mehr als 76 Maschen gibt es noch nicht",
    "49/50": "enger als deine Socken; mehr als 76 Maschen gibt es noch nicht",
  };
  if (notes[p.label]) return notes[p.label];
  return p.hi <= 36 ? "Kindergröße, noch nicht gestrickt" : "";
}

function tipTextDe(t) {
  return tipText(t).replaceAll("x", "×");
}

function printGerman(pairs) {
  console.log(
    "| Paar | Maschen | Bündchen | Rechte Reihen | Ferse | Aufteilung | aufnehmen | nach Zusammenstricken | Maschen reduzieren (Runden) | Fuß (Reihen) | Spitze | Quelle | Hinweis | Urteil |"
  );
  console.log(
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"
  );
  for (const p of pairs) {
    const knitted = KNITTED_PAIR[p.label];
    const label = knitted ? `**${p.label}**` : p.label;
    console.log(
      `| ${label} | ${p.m} | ${p.cuff} | ${p.leg} | ${p.heel} | ${p.split.join("-")} | ${p.pickup} | ${p.postJoin} | ${p.gusset} | ${p.plainFoot} | ${tipTextDe(p.tip)} | ${knitted ?? "berechnet"} | ${hintDe(p)} |  |`
    );
  }
  console.log("");
  console.log(
    "| Paar | Fuß lang (cm) | Fuß rund (cm) | Socke rund (cm) | Socke enger als Fuß | Socke lang (cm) | Platz zum Reinwachsen (cm) |"
  );
  console.log("| --- | --- | --- | --- | --- | --- | --- |");
  for (const p of pairs) {
    const de = (x) => f(x).replace(".", ",");
    const tighter = Math.round((1 - p.widthShare) * 100);
    const room = p.roomCm < 0.25 ? "keiner" : `${de(p.roomCm)}`;
    console.log(
      `| ${p.label} | ${de(p.footCm)} | ${de(p.girthCm)} | ${de(p.sockCircCm)} | ${tighter <= 0 ? "gleich weit" : `${tighter} %`} | ${de(p.soleCm)} | ${room} |`
    );
  }
}

function main() {
  const pairs = PAIRS.map((pr) => proposePair(pr));
  if (process.argv.includes("--de")) {
    printGerman(pairs.map(displayed));
    return 0;
  }
  printGaugeCheck();
  printPairs(pairs);
  const failures = runTests(pairs);
  console.log("");
  console.log(
    failures
      ? `FAILED: ${failures} problem(s).`
      : "OK: test pairs within ±2 foot rows, sole length grows with size."
  );
  return failures ? 1 : 0;
}

process.exitCode = main();
