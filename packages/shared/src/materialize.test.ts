import { describe, expect, it } from "vitest";
import { ACTUAL_SIZES, REGIA_4_FAEDIG_PATTERN, mustActualSize } from "./fixtures/pattern-seed";
import { formatCountLine, formatTipCount } from "./labels";
import { isPairStepComplete, materializePlan, tickRow, untickRow } from "./materialize";
import {
  SIZE_CHART,
  deriveTipRounds,
  getChartSize,
  tipRoundsForChartSize,
} from "./size-chart-seed";

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

describe("materializePlan", () => {
  it("size-40-41: chart 44/45 + actual 40/41 → plain 51, tip from chart", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("size-40-41"));

    expect(plan.patternName).toBe("REGIA 4-fädig");
    expect(plan.chartSizeLabel).toBe("44/45");
    expect(plan.actualSizeLabel).toBe("40/41");
    expect(plan.chart.heelSplit).toEqual([11, 12, 11]);
    expect(plan.chart.pickupStitchesBothSides).toBe(17);
    expect(plan.needleCount).toBe(2);
    expect(plan.chart.castOnPerNeedle2).toBe(34);

    const byKey = Object.fromEntries(plan.steps.map((s) => [s.stepKey, s]));
    expect(byKey.cuff?.targetCount).toBe(40);
    expect(byKey.leg?.targetCount).toBe(15);
    expect(byKey.heel?.targetCount).toBe(32);
    expect(byKey.postJoin?.targetCount).toBe(5);
    expect(byKey.plainFoot?.targetCount).toBe(51);
    expect(byKey.tip?.targetCount).toBe(3);
    expect(byKey.tip?.tipRounds?.[2]?.times).toBe(4);
  });

  it("size-37-38: same chart base 44/45 but plain 45 (actual 37/38)", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("size-37-38"));
    expect(plan.chartSizeLabel).toBe("44/45");
    expect(plan.actualSizeLabel).toBe("37/38");
    const plain = plan.steps.find((s) => s.stepKey === "plainFoot");
    expect(plain?.targetCount).toBe(45);
  });

  it("size-50-51: plain 62 and tip round 3 has 5 decrease units", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("size-50-51"));
    const plain = plan.steps.find((s) => s.stepKey === "plainFoot");
    const tip = plan.steps.find((s) => s.stepKey === "tip");
    expect(plain?.targetCount).toBe(62);
    expect(tip?.tipRounds?.[2]?.times).toBe(5);
  });

  it("size-18: child 18 on 22/23, plain 25, tip only 2 rounds", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("size-18"));
    expect(plan.chartSizeLabel).toBe("22/23");
    expect(plan.actualSizeLabel).toBe("18");
    const plain = plan.steps.find((s) => s.stepKey === "plainFoot");
    const tip = plan.steps.find((s) => s.stepKey === "tip");
    expect(plain?.targetCount).toBe(25);
    expect(tip?.targetCount).toBe(2);
    expect(tip?.tipRounds).toHaveLength(2);
    expect(tip?.tipRounds?.[0]?.unitSegments[0]).toEqual({ kind: "knit", count: 2 });
  });

  it("preserves stitch direction (knit / mixed)", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("size-40-41"));
    const byKey = Object.fromEntries(plan.steps.map((s) => [s.stepKey, s]));
    expect(byKey.postJoin?.stitch).toBe("knit");
    expect(byKey.plainFoot?.stitch).toBe("knit");
    expect(byKey.leg?.stitch).toBe("knit");
    expect(byKey.heel?.stitch).toBe("mixed");
  });

  it("size-15: custom construction from notes (36 M, 6-6-6, 9 pickup), tip 2 rounds", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("size-15"));
    expect(plan.actualSizeLabel).toBe("15");
    expect(plan.chart.castOnTotal).toBe(36);
    expect(plan.chart.castOnPerNeedle2).toBe(18);
    expect(plan.chart.heelSplit).toEqual([6, 6, 6]);
    expect(plan.chart.heelHeightRows).toBe(16);
    expect(plan.chart.pickupStitchesBothSides).toBe(9);
    const byKey = Object.fromEntries(plan.steps.map((s) => [s.stepKey, s]));
    expect(byKey.cuff?.targetCount).toBe(21);
    expect(byKey.leg?.targetCount).toBe(5);
    expect(byKey.heel?.targetCount).toBe(16);
    expect(byKey.postJoin?.targetCount).toBe(3);
    expect(byKey.plainFoot?.targetCount).toBe(17);
    expect(byKey.tip?.targetCount).toBe(2);
    expect(byKey.tip?.tipRounds?.[0]?.unitSegments[0]).toEqual({ kind: "knit", count: 2 });
    expect(byKey.tip?.tipRounds?.[1]?.times).toBe(3);
  });

  it("throws when a step has no configured count (never invent)", () => {
    const broken = {
      ...mustActualSize("size-40-41"),
      counts: { cuff: 40 },
    };
    expect(() => materializePlan(REGIA_4_FAEDIG_PATTERN, broken)).toThrow(/do not invent/i);
  });

  it("seeded actual sizes cover the four reference configs", () => {
    expect(ACTUAL_SIZES.map((s) => s.id).sort()).toEqual([
      "size-15",
      "size-18",
      "size-37-38",
      "size-40-41",
      "size-50-51",
    ]);
  });
});

describe("German wording (Reihen vs Runden)", () => {
  it("uses Reihen for normal steps and Runden only for tip", () => {
    expect(formatCountLine(5, "rounds", "knit")).toBe("5 rechte Reihen");
    expect(formatCountLine(51, "rounds", "knit")).toBe("51 rechte Reihen");
    expect(formatCountLine(32, "rows", "mixed")).toBe("32 rechte + linke Reihen");
    expect(formatCountLine(40, "rows", "none")).toBe("40 Reihen");
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
