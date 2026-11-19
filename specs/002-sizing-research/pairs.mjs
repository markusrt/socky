// Sock sizing model by size pair (002-sizing-research; research evidence, not product code).
// Rules and their basis: report.md. Data: docs/domain/gestrickte-groessen.md.
//
//   node specs/002-sizing-research/pairs.mjs                 fits, gauge check, pairs, tests
//   node specs/002-sizing-research/pairs.mjs --de            German tables (vergleich-paare-de.md)
//   node specs/002-sizing-research/pairs.mjs --pair 47/48    one pair as JSON (any odd/even pair)
//
// Exit 1: a test fails (her pairs off by more than 2 foot rows, stitch count differs, or the
// sole length does not grow from pair to pair).

// --- Inputs --------------------------------------------------------------------------------

/** Her gauge (feedback r11): 36 stitches and 52 rows = 10 cm, 2.25 mm, baby and adult alike. */
const STITCHES_PER_CM = 3.6;
const ROUNDS_PER_CM = 5.2;

/**
 * Her certain knitted socks. fit = foot size the sock is for (a pair: its larger size).
 * tip = [3-1 units, 2-1 units, 1-1 units]. 45/46 is the pair labelled 50/51 in the app (r06).
 */
const KNITTED = [
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

/** Her choices that replace a computed or knitted value in the pair table (r21). */
const CHOSEN = { "39/40": { plainFoot: 50, note: "r21" } };

/** Foot length from EU size, ISO/TS 19407 convention [S1]. */
const footLength = (size) => ((size - 2) * 2) / 3;

/** Ball girth estimate (cm) from foot length, own summary of [S4]-[S6]. */
const ballGirth = (cm) => 3.2 + 0.81 * cm;

// --- Construction rules (by cast-on M) --------------------------------------------------------

/** P2: stitches by the pair's larger size; her sizes, linear in between; 76 is the largest known. */
const STITCH_BANDS = [
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

/** Aufteilung: 36 and 40 her own, 44-76 the REGIA chart [S7]. Above 76: not defined (r25). */
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

const stitchesFor = (upper) => STITCH_BANDS.find(([max]) => upper <= max)[1];

/** Tip: her schedule; everyRound closes to 8 stitches and is not counted by her. */
function tipFor(m) {
  const fourthRound = m >= 60 ? 1 : 0;
  const every3rdRound = m >= 52 ? 2 : 1;
  const every2ndRound = m >= 76 ? 5 : m >= 68 ? 4 : 3;
  const everyRound = (m - 8) / 4 - 1 - fourthRound - every3rdRound - every2ndRound;
  return { fourthRound, every3rdRound, every2ndRound, everyRound };
}

const tipRounds = (t) =>
  1 + 4 * t.fourthRound + 3 * t.every3rdRound + 2 * t.every2ndRound + t.everyRound;

/** Rechte Reihen: 5 up to 44 M, 15 from 68 M, straight line from 8 at 48 M in between. */
const legFor = (m) => (m <= 44 ? 5 : m >= 68 ? 15 : Math.round(8 + ((m - 48) * 7) / 20));

/** Rows after joining: 3 up to 56 M, else 5 (her 48 uses 3, her 68 uses 5). */
const postJoinFor = (m) => (m <= 56 ? 3 : 5);

/** Gusset (r12, r23): 4 stitches per round until the middle number is gone. */
const gussetFor = (split) => Math.ceil(split[1] / 4);

/** Rounds from heel cap to tip end, without the plain foot. */
function fixedRounds(m) {
  const split = HEEL_SPLIT[m];
  if (!split) throw new Error(`no Aufteilung for ${m} stitches (above 76 is not defined yet)`);
  return 2 * split[0] + postJoinFor(m) + gussetFor(split) + tipRounds(tipFor(m));
}

// --- Fits from her data -------------------------------------------------------------------------

function leastSquares(points) {
  const n = points.length;
  const mx = points.reduce((a, [x]) => a + x, 0) / n;
  const my = points.reduce((a, [, y]) => a + y, 0) / n;
  const sxy = points.reduce((a, [x, y]) => a + (x - mx) * (y - my), 0);
  const sxx = points.reduce((a, [x]) => a + (x - mx) ** 2, 0);
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

/** Bündchen: least squares on M over her certain socks. */
const CUFF = leastSquares(KNITTED.map((k) => [k.m, k.cuff]));
const cuffFor = (m) => Math.round(CUFF.slope * m + CUFF.intercept);

const soleRounds = (k) => fixedRounds(k.m) + k.plainFoot;
const lengthShare = (k) => soleRounds(k) / ROUNDS_PER_CM / footLength(k.fit);
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** P4: sole / foot length. Adult: her knitted pairs; baby: her four baby socks. */
function fitShares(socks) {
  return {
    adult: mean(socks.filter((k) => k.group === "adult" && k.pair).map(lengthShare)),
    baby: mean(socks.filter((k) => k.group === "baby").map(lengthShare)),
    from: footLength(20),
    to: footLength(38),
  };
}
const SHARE = fitShares(KNITTED);

function shareFor(cm, s = SHARE) {
  if (cm <= s.from) return s.baby;
  if (cm >= s.to) return s.adult;
  return s.baby + ((s.adult - s.baby) * (cm - s.from)) / (s.to - s.from);
}

// --- Pairs ---------------------------------------------------------------------------------------

function computePair(lo, share = SHARE) {
  const hi = lo + 1;
  const m = stitchesFor(hi);
  const cm = footLength(hi);
  const fixed = fixedRounds(m);
  return {
    label: `${lo}/${hi}`,
    m,
    cuff: cuffFor(m),
    leg: legFor(m),
    heel: m / 2 - 2,
    split: HEEL_SPLIT[m],
    pickup: m / 4,
    postJoin: postJoinFor(m),
    gusset: gussetFor(HEEL_SPLIT[m]),
    plainFoot: Math.round(ROUNDS_PER_CM * shareFor(cm, share) * cm - fixed),
    tip: tipFor(m),
    footCm: cm,
  };
}

/** Table value: her choice, else her knitted pair, else computed (amendment P1). */
function tablePair(lo) {
  const p = computePair(lo);
  const knitted = KNITTED.find((k) => k.pair === p.label);
  const chosen = CHOSEN[p.label];
  const shown = { ...p, computed: { cuff: p.cuff, plainFoot: p.plainFoot }, source: "berechnet" };
  if (knitted)
    Object.assign(shown, { cuff: knitted.cuff, plainFoot: knitted.plainFoot, source: "gestrickt" });
  if (chosen) Object.assign(shown, { plainFoot: chosen.plainFoot, source: "gewählt" });
  shown.knitted = knitted;
  return shown;
}

function check(p) {
  const sole = (fixedRounds(p.m) + p.plainFoot) / ROUNDS_PER_CM;
  const girth = ballGirth(p.footCm);
  return {
    girthCm: girth,
    sockCircCm: p.m / STITCHES_PER_CM,
    widthShare: p.m / STITCHES_PER_CM / girth,
    soleCm: sole,
    roomCm: sole / SHARE.adult - p.footCm,
  };
}

const PAIR_STARTS = [];
for (let lo = 15; lo <= 49; lo += 2) PAIR_STARTS.push(lo);

// --- Output ------------------------------------------------------------------------------------

const f = (x, d = 1) => x.toFixed(d);
const pct = (x) => `${Math.round(x * 100)}%`;
const tipText = (t, x = "x") =>
  [
    t.fourthRound ? `3-1 ${x}${t.fourthRound}` : "",
    `2-1 ${x}${t.every3rdRound}`,
    `1-1 ${x}${t.every2ndRound}`,
  ]
    .filter(Boolean)
    .join(", ");

function printReport() {
  console.log(`Fits: cuff = ${f(CUFF.slope, 3)} x M + ${f(CUFF.intercept, 2)}`);
  console.log(
    `      length share adult ${f(SHARE.adult, 3)}, baby ${f(SHARE.baby, 3)}, straight line 12.0-24.0 cm`
  );
  console.log("");
  console.log(
    "Gauge check, her socks: label | fit | M | width | sole rounds | sole cm | foot cm | length share"
  );
  for (const k of KNITTED) {
    const cm = footLength(k.fit);
    console.log(
      `  ${k.label} | ${k.fit} | ${k.m} | ${pct(k.m / STITCHES_PER_CM / ballGirth(cm))} | ${soleRounds(k)} | ${f(soleRounds(k) / ROUNDS_PER_CM)} | ${f(cm)} | ${pct(lengthShare(k))}`
    );
  }
  console.log("");
  console.log(
    "Pairs: pair | M | cuff | leg | heel | split | pickup | postJoin | gusset | foot | tip | source | width | sole cm | room cm"
  );
  for (const lo of PAIR_STARTS) {
    const p = tablePair(lo);
    const c = check(p);
    console.log(
      `  ${[p.label, p.m, p.cuff, p.leg, p.heel, p.split.join("-"), p.pickup, p.postJoin, p.gusset, p.plainFoot, tipText(p.tip), p.source, pct(c.widthShare), f(c.soleCm), f(c.roomCm)].join(" | ")}`
    );
  }
}

function runTests() {
  let failures = 0;
  console.log("");
  console.log("Tests: computed vs knitted pair (foot rows), in sample");
  for (const k of KNITTED.filter((x) => x.pair)) {
    const p = computePair(Number(k.pair.split("/")[0]));
    const diff = p.plainFoot - k.plainFoot;
    const ok = Math.abs(diff) <= 2 && p.m === k.m;
    if (!ok) failures++;
    console.log(
      `  ${k.pair}: M ${p.m}/${k.m}, foot ${p.plainFoot}/${k.plainFoot} (${diff >= 0 ? "+" : ""}${diff}) ${ok ? "ok" : "FAIL"}`
    );
  }
  console.log("Leave-one-out (shares refitted without that sock), foot rows:");
  let within = 0;
  const tested = KNITTED.filter((x) => x.pair);
  for (const k of tested) {
    const share = fitShares(KNITTED.filter((x) => x !== k));
    const diff = computePair(Number(k.pair.split("/")[0]), share).plainFoot - k.plainFoot;
    if (Math.abs(diff) <= 2) within++;
    console.log(`  ${k.pair}: ${diff >= 0 ? "+" : ""}${diff}`);
  }
  console.log(`  within ±2: ${within} of ${tested.length} (reported, not a test)`);
  let previous = 0;
  for (const lo of PAIR_STARTS) {
    const sole = check(tablePair(lo)).soleCm;
    if (sole <= previous) {
      failures++;
      console.log(`  FAIL: sole length does not grow at ${lo}/${lo + 1}`);
    }
    previous = sole;
  }
  console.log(failures ? `FAILED: ${failures}` : "OK");
  return failures;
}

function hintDe(p) {
  if (p.source === "gewählt")
    return `dein Wunsch (gestrickt: ${p.knitted.plainFoot}, Rechnung: ${p.computed.plainFoot})`;
  if (p.knitted) {
    const d = [];
    if (p.computed.cuff !== p.cuff) d.push(`Bündchen ${p.computed.cuff}`);
    if (p.computed.plainFoot !== p.plainFoot) d.push(`Fuß ${p.computed.plainFoot}`);
    const extra = p.label === "17/18" ? "; dein Paar ca. 17: 40 Maschen, 21 Reihen Fuß" : "";
    return (d.length ? `Rechnung: ${d.join(", ")}` : "Rechnung gleich") + extra;
  }
  const notes = {
    "15/16": "dein Paar 15: 17 Reihen Fuß",
    "27/28": "wird als Nächstes gestrickt",
    "41/42": "dein Paar 40/41: 68 Maschen, 51 Reihen Fuß",
    "43/44": "dein Paar 43-45: 60 Reihen Fuß",
    "47/48": "später; eng mit 76 Maschen",
    "49/50": "später; eng mit 76 Maschen",
  };
  return notes[p.label] ?? "";
}

function printGerman() {
  const de = (x) => f(x).replace(".", ",");
  console.log(
    "| Paar | Maschen | Bündchen | Rechte Reihen | Ferse | Aufteilung | aufnehmen | nach Zusammenstricken | Maschen reduzieren (Runden) | Fuß (Reihen) | Spitze | Quelle | Hinweis |"
  );
  console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  const pairs = PAIR_STARTS.map(tablePair);
  for (const p of pairs) {
    const label = p.source === "berechnet" ? p.label : `**${p.label}**`;
    console.log(
      `| ${label} | ${p.m} | ${p.cuff} | ${p.leg} | ${p.heel} | ${p.split.join("-")} | ${p.pickup} | ${p.postJoin} | ${p.gusset} | ${p.plainFoot} | ${tipText(p.tip, "×")} | ${p.source} | ${hintDe(p)} |`
    );
  }
  console.log("");
  console.log(
    "| Paar | Fuß lang (cm) | Fuß rund (cm) | Socke rund (cm) | Socke enger als Fuß | Socke lang (cm) | Platz zum Reinwachsen (cm) |"
  );
  console.log("| --- | --- | --- | --- | --- | --- | --- |");
  for (const p of pairs) {
    const c = check(p);
    const tighter = Math.round((1 - c.widthShare) * 100);
    console.log(
      `| ${p.label} | ${de(p.footCm)} | ${de(c.girthCm)} | ${de(c.sockCircCm)} | ${tighter <= 0 ? "gleich weit" : `${tighter} %`} | ${de(c.soleCm)} | ${c.roomCm < 0.25 ? "keiner" : de(c.roomCm)} |`
    );
  }
}

function main() {
  const argv = process.argv.slice(2);
  const pairArg = argv[argv.indexOf("--pair") + 1];
  if (argv.includes("--pair")) {
    const lo = Number(String(pairArg).split("/")[0]);
    if (!Number.isInteger(lo) || lo % 2 === 0 || lo < 15) {
      console.error("usage: --pair <odd>/<even>, e.g. 27/28");
      return 2;
    }
    const p = tablePair(lo);
    console.log(JSON.stringify({ ...p, knitted: undefined, check: check(p) }, null, 2));
    return 0;
  }
  if (argv.includes("--de")) {
    printGerman();
    return 0;
  }
  printReport();
  return runTests() ? 1 : 0;
}

process.exitCode = main();
