import { describe, expect, it } from "vitest";
import size18 from "../data/actual-sizes/size-18.json";
import size3738 from "../data/actual-sizes/size-37-38.json";
import size5051 from "../data/actual-sizes/size-50-51.json";
import golden from "./fixtures/size-pairs-v1.json";
import {
  COMPUTABLE_PAIRS,
  castOnForSize,
  constructionFor,
  isOfferedPair,
  OFFERED_PAIRS,
  sizePair,
} from "./size-pairs";

/**
 * The model must reproduce the table the knitter accepted in research 002
 * (constitution P1, ADR 0007). `size-pairs-v1.json` was generated once from
 * `node specs/002-sizing-research/pairs.mjs --pair <p>` and is FROZEN: never
 * edit it to make a test pass.
 */

describe("golden fixture from pairs.mjs (all 18 computable pairs)", () => {
  it("covers 15/16 … 49/50", () => {
    expect(golden.map((g) => g.label)).toEqual([...COMPUTABLE_PAIRS]);
  });

  it.each(golden.map((g) => [g.label, g] as const))("%s equals the research script", (label, g) => {
    const p = sizePair(label);
    expect({
      label: p.label,
      m: p.construction.castOnTotal,
      cuff: p.counts.cuff,
      leg: p.counts.leg,
      heel: p.counts.heel,
      split: p.construction.heelSplit,
      pickup: p.construction.pickupStitchesBothSides,
      postJoin: p.counts.postJoin,
      gusset: p.counts.reduceToCastOn,
      plainFoot: p.counts.plainFoot,
      tip: p.construction.tipSchedule,
    }).toEqual(g);
  });
});

/**
 * Tabelle 1 of `specs/002-sizing-research/vergleich-paare-de.md`, transcribed by
 * hand (independent of the script): Paar | Maschen | Bündchen | Rechte Reihen |
 * Ferse | Aufteilung | aufnehmen | nach Zusammenstricken | Maschen reduzieren |
 * Fuß | Spitze.
 */
const TABELLE_1 = `
15/16 | 36 | 21 | 5 | 16 | 6-6-6 | 9 | 3 | 2 | 21 | 2-1 ×1, 1-1 ×3
17/18 | 44 | 25 | 5 | 20 | 7-8-7 | 11 | 3 | 2 | 25 | 2-1 ×1, 1-1 ×3
19/20 | 48 | 28 | 8 | 22 | 8-8-8 | 12 | 3 | 2 | 29 | 2-1 ×1, 1-1 ×3
21/22 | 52 | 31 | 9 | 24 | 8-10-8 | 13 | 3 | 3 | 30 | 2-1 ×2, 1-1 ×3
23/24 | 52 | 31 | 9 | 24 | 8-10-8 | 13 | 3 | 3 | 35 | 2-1 ×2, 1-1 ×3
25/26 | 56 | 33 | 11 | 26 | 9-10-9 | 14 | 3 | 3 | 37 | 2-1 ×2, 1-1 ×3
27/28 | 56 | 33 | 11 | 26 | 9-10-9 | 14 | 3 | 3 | 41 | 2-1 ×2, 1-1 ×3
29/30 | 60 | 35 | 12 | 28 | 10-10-10 | 15 | 5 | 3 | 37 | 3-1 ×1, 2-1 ×2, 1-1 ×3
31/32 | 60 | 35 | 12 | 28 | 10-10-10 | 15 | 5 | 3 | 41 | 3-1 ×1, 2-1 ×2, 1-1 ×3
33/34 | 64 | 38 | 14 | 30 | 10-12-10 | 16 | 5 | 3 | 43 | 3-1 ×1, 2-1 ×2, 1-1 ×3
35/36 | 64 | 38 | 14 | 30 | 10-12-10 | 16 | 5 | 3 | 46 | 3-1 ×1, 2-1 ×2, 1-1 ×3
37/38 | 68 | 40 | 15 | 32 | 11-12-11 | 17 | 5 | 3 | 45 | 3-1 ×1, 2-1 ×2, 1-1 ×4
39/40 | 68 | 40 | 15 | 32 | 11-12-11 | 17 | 5 | 3 | 50 | 3-1 ×1, 2-1 ×2, 1-1 ×4
41/42 | 72 | 42 | 15 | 34 | 12-12-12 | 18 | 5 | 3 | 53 | 3-1 ×1, 2-1 ×2, 1-1 ×4
43/44 | 72 | 42 | 15 | 34 | 12-12-12 | 18 | 5 | 3 | 58 | 3-1 ×1, 2-1 ×2, 1-1 ×4
45/46 | 76 | 45 | 15 | 36 | 13-12-13 | 19 | 5 | 3 | 62 | 3-1 ×1, 2-1 ×2, 1-1 ×5
`
  .trim()
  .split("\n");

function tableRow(label: string): string {
  const p = sizePair(label);
  const t = p.construction.tipSchedule;
  const tip = [
    t.fourthRound ? `3-1 ×${t.fourthRound}` : "",
    `2-1 ×${t.every3rdRound}`,
    `1-1 ×${t.every2ndRound}`,
  ]
    .filter(Boolean)
    .join(", ");
  return [
    p.label,
    p.construction.castOnTotal,
    p.counts.cuff,
    p.counts.leg,
    p.counts.heel,
    p.construction.heelSplit.join("-"),
    p.construction.pickupStitchesBothSides,
    p.counts.postJoin,
    p.counts.reduceToCastOn,
    p.counts.plainFoot,
    tip,
  ].join(" | ");
}

describe("accepted Tabelle 1 (SC-001)", () => {
  it("offers exactly the 16 pairs of the table, in order", () => {
    expect([...OFFERED_PAIRS]).toEqual(TABELLE_1.map((row) => row.split(" | ")[0]));
  });

  it.each(TABELLE_1.map((row) => [row.split(" | ")[0] ?? "", row] as const))(
    "%s matches the table",
    (label, row) => {
      expect(tableRow(label)).toBe(row);
    }
  );
});

describe("her knitted sizes are reproduced (SC-002)", () => {
  it.each([
    ["17/18", size18],
    ["37/38", size3738],
    ["45/46", size5051],
  ] as const)("%s equals her knitted counts", (label, knitted) => {
    const p = sizePair(label);
    expect(p.counts).toMatchObject(knitted.counts);
  });

  it("19/20 = her 19-20 note; 39/40 = her choice of 50 foot rows (r21)", () => {
    expect(sizePair("19/20").counts).toMatchObject({ cuff: 28, leg: 8, plainFoot: 29 });
    expect(sizePair("39/40").counts.plainFoot).toBe(50);
  });
});

describe("construction class ≠ foot size (P3)", () => {
  it("pairs with the same M share construction and differ only in foot rows", () => {
    const a = sizePair("25/26");
    const b = sizePair("27/28");
    expect(a.construction).toEqual(b.construction);
    expect(a.counts.plainFoot).not.toBe(b.counts.plainFoot);
  });

  it("construction depends on M alone", () => {
    expect(sizePair("37/38").construction).toEqual(constructionFor(68));
    expect(castOnForSize(28)).toBe(56);
  });

  it("no construction above 76 stitches (r25)", () => {
    expect(() => constructionFor(80)).toThrow(/above 76/);
  });
});

describe("offered vs computable (r25)", () => {
  it("47/48 and 49/50 are computable but not offered", () => {
    expect(sizePair("47/48").counts.plainFoot).toBe(66);
    expect(sizePair("49/50").counts.plainFoot).toBe(71);
    expect(isOfferedPair("47/48")).toBe(false);
    expect(isOfferedPair("49/50")).toBe(false);
    expect(isOfferedPair("27/28")).toBe(true);
  });

  it.each(["15", "16/17", "27-28", "13/14", "40/41", ""])("rejects %j", (label) => {
    expect(() => sizePair(label)).toThrow(/not a size pair/);
    expect(isOfferedPair(label)).toBe(false);
  });
});
