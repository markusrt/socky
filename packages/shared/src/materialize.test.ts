import { describe, expect, it } from "vitest";
import { REGIA_4_FAEDIG_PATTERN } from "./fixtures/pattern-seed";
import { formatCountLine, formatTipCount } from "./labels";
import {
  isPairStepComplete,
  materializePlan,
  REDUCE_LAST_ROW_NOTE_KEY,
  tickRow,
  untickRow,
} from "./materialize";
import {
  deriveTipRounds,
  getChartSize,
  SIZE_CHART,
  tipRoundsForChartSize,
} from "./size-chart-seed";
import { sizePair } from "./size-pairs";

describe("size chart seed (REGIA 4-fädig PDF)", () => {
  it("has 15 chart sizes from 22/23 to 50/51", () => {
    expect(SIZE_CHART).toHaveLength(15);
    expect(SIZE_CHART[0]?.label).toBe("22/23");
    expect(SIZE_CHART[14]?.label).toBe("50/51");
  });

  it("2-needle counts are half the total (wife's method)", () => {
    const s = getChartSize("44/45");
    expect(s?.castOnTotal).toBe(68);
    expect(s?.castOnPerNeedle2).toBe(34);
    expect(s?.castOnPerNeedleChart).toBe(17);
  });

  it("matches chart 44/45 construction used by size-40-41/04", () => {
    expect(getChartSize("44/45")).toMatchObject({
      castOnTotal: 68,
      heelStitches: 34,
      heelHeightRows: 32,
      heelSplit: [11, 12, 11],
      pickupStitchesBothSides: 17,
    });
  });

  it("tip schedule 44/45: 1×3knit, 2×2knit, 4×1knit (PDF)", () => {
    const chart = getChartSize("44/45");
    expect(chart?.tipSchedule).toEqual({
      fourthRound: 1,
      every3rdRound: 2,
      every2ndRound: 4,
      everyRound: 7,
    });
  });
});

describe("deriveTipRounds", () => {
  it("44/45 → 3 tip rounds matching size-40-41/04 notes", () => {
    const tip = tipRoundsForChartSize("44/45");
    expect(tip).toHaveLength(3);
    expect(tip[0]).toMatchObject({
      times: 1,
      unitSegments: [
        { kind: "knit", count: 3 },
        { kind: "decrease", count: 1 },
      ],
    });
    expect(tip[1]).toMatchObject({
      times: 2,
      unitSegments: [
        { kind: "knit", count: 2 },
        { kind: "decrease", count: 1 },
      ],
    });
    expect(tip[2]).toMatchObject({
      times: 4,
      unitSegments: [
        { kind: "knit", count: 1 },
        { kind: "decrease", count: 1 },
      ],
    });
  });

  it("22/23 → 2 tip rounds (no 3-knit round) matching size-18", () => {
    const tip = tipRoundsForChartSize("22/23");
    expect(tip).toHaveLength(2);
    expect(tip[0]?.unitSegments[0]).toEqual({ kind: "knit", count: 2 });
    expect(tip[0]?.times).toBe(1);
    expect(tip[1]?.unitSegments[0]).toEqual({ kind: "knit", count: 1 });
    expect(tip[1]?.times).toBe(3);
  });

  it("50/51 tip round 3 has 5 decrease units (size-50-51)", () => {
    const tip = tipRoundsForChartSize("50/51");
    expect(tip).toHaveLength(3);
    expect(tip[2]?.times).toBe(5);
    expect(tip[2]?.unitSegments[1]).toEqual({ kind: "decrease", count: 1 });
  });

  it("skips zero counts and never emits the final close round", () => {
    const tip = deriveTipRounds({
      fourthRound: 0,
      every3rdRound: 0,
      every2ndRound: 0,
      everyRound: 8,
    });
    expect(tip).toHaveLength(0);
  });
});

const plan = (label: string) => materializePlan(REGIA_4_FAEDIG_PATTERN, sizePair(label));
const byKey = (label: string) => Object.fromEntries(plan(label).steps.map((s) => [s.stepKey, s]));

describe("materializePlan (size pairs, ADR 0007)", () => {
  it("27/28: construction from 56 M, foot rows from the pair", () => {
    const p = plan("27/28");
    expect(p.patternName).toBe("REGIA 4-fädig");
    expect(p.sizeLabel).toBe("27/28");
    expect(p.needleCount).toBe(2);
    expect(p.construction).toMatchObject({
      castOnTotal: 56,
      castOnPerNeedle2: 28,
      heelHeightRows: 26,
      heelSplit: [9, 10, 9],
      pickupStitchesBothSides: 14,
    });
    const k = byKey("27/28");
    expect(k.cuff?.targetCount).toBe(33);
    expect(k.leg?.targetCount).toBe(11);
    expect(k.heel?.targetCount).toBe(26);
    expect(k.postJoin?.targetCount).toBe(3);
    expect(k.reduceToCastOn?.targetCount).toBe(3);
    expect(k.plainFoot?.targetCount).toBe(41);
    // Spitze 2-1 ×2, 1-1 ×3
    expect(k.tip?.tipRounds?.map((r) => [r.unitSegments[0].count, r.times])).toEqual([
      [2, 2],
      [1, 3],
    ]);
  });

  it("37/38 (knitted): 68 M, 11-12-11, Fuß 45, Spitze 3-1 ×1, 2-1 ×2, 1-1 ×4", () => {
    const k = byKey("37/38");
    expect(plan("37/38").construction.heelSplit).toEqual([11, 12, 11]);
    expect(k.cuff?.targetCount).toBe(40);
    expect(k.plainFoot?.targetCount).toBe(45);
    expect(k.tip?.tipRounds?.map((r) => [r.unitSegments[0].count, r.times])).toEqual([
      [3, 1],
      [2, 2],
      [1, 4],
    ]);
  });

  it("preserves stitch direction (knit / mixed)", () => {
    const k = byKey("39/40");
    expect(k.postJoin?.stitch).toBe("knit");
    expect(k.plainFoot?.stitch).toBe("knit");
    expect(k.leg?.stitch).toBe("knit");
    expect(k.heel?.stitch).toBe("mixed");
  });

  it("once steps (cast-on, Aufteilung, aufnehmen) are single confirmations", () => {
    const k = byKey("45/46");
    expect(k.castOn?.targetCount).toBe(1);
    expect(k.split?.targetCount).toBe(1);
    expect(k.pickup?.targetCount).toBe(1);
    expect(k.close?.unit).toBe("finish");
  });

  it("throws when a step has no count (never invent)", () => {
    const pair = sizePair("27/28");
    // A counted step the pair has no count for and the pattern no default.
    const noCount = {
      ...REGIA_4_FAEDIG_PATTERN,
      steps: [
        { key: "castOn" as const, titleKey: "x", unit: "rows" as const, stitch: "none" as const },
      ],
    };
    expect(() => materializePlan(noCount, pair)).toThrow(/do not invent/i);
  });
});

describe("Maschen reduzieren (r23): counted rows, 2-stitch note", () => {
  it.each([
    ["15/16", 2, true],
    ["17/18", 2, false],
    ["19/20", 2, false],
    ["27/28", 3, true],
    ["29/30", 3, true],
    ["31/32", 3, true],
    ["33/34", 3, false],
    ["37/38", 3, false],
    ["45/46", 3, false],
  ])("%s: %i rows, note %s", (label, rows, note) => {
    const step = byKey(label).reduceToCastOn;
    expect(step?.unit).toBe("rounds");
    expect(step?.targetCount).toBe(rows);
    expect(step?.techniqueNoteKey === REDUCE_LAST_ROW_NOTE_KEY).toBe(note);
  });
});

describe("German wording (Reihen vs Runden)", () => {
  it("uses Reihen for normal steps and Runden only for tip", () => {
    expect(formatCountLine(5, "rounds", "knit")).toBe("5 rechte Reihen");
    expect(formatCountLine(51, "rounds", "knit")).toBe("51 rechte Reihen");
    expect(formatCountLine(32, "rows", "mixed")).toBe("32 rechte + linke Reihen");
    expect(formatCountLine(40, "rows", "none")).toBe("40 Reihen");
    expect(formatCountLine(3, "rounds", "none")).toBe("3 Reihen");
    expect(formatTipCount(3)).toBe("3 Runden");
    expect(formatTipCount(2)).toBe("2 Runden");
  });
});

describe("pair progress ticks", () => {
  it("increments, clamps, undoes, and completes pairs", () => {
    expect(tickRow(0, 3)).toBe(1);
    expect(tickRow(3, 3)).toBe(3);
    expect(untickRow(1)).toBe(0);
    expect(untickRow(0)).toBe(0);
    expect(isPairStepComplete(3, 3, 3)).toBe(true);
    expect(isPairStepComplete(3, 2, 3)).toBe(false);
  });
});
