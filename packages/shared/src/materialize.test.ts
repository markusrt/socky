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
    expect(s?.anschlagGesamt).toBe(68);
    expect(s?.anschlagProNadel2).toBe(34);
    expect(s?.anschlagProNadelChart).toBe(17);
  });

  it("matches chart 44/45 construction used by sock-03/04", () => {
    expect(getChartSize("44/45")).toMatchObject({
      anschlagGesamt: 68,
      maschenFuerFerse: 34,
      fersenhoeheReihen: 32,
      aufteilung: [11, 12, 11],
      beidseitigeAufnahme: 17,
    });
  });

  it("bandspitze 44/45: 1×3rechts, 2×2rechts, 4×1rechts (PDF)", () => {
    const chart = getChartSize("44/45");
    expect(chart?.bandspitze).toEqual({
      inDer4Runde: 1,
      inJeder3Runde: 2,
      inJeder2Runde: 4,
      inJederRunde: 7,
    });
  });
});

describe("deriveTipRounds", () => {
  it("44/45 → 3 tip rounds matching sock-03/04 notes", () => {
    const tip = tipRoundsForChartSize("44/45");
    expect(tip).toHaveLength(3);
    expect(tip[0]).toMatchObject({
      times: 1,
      unitSegments: [{ label: "3 rechts" }, { label: "1 Abnahme" }],
    });
    expect(tip[1]).toMatchObject({
      times: 2,
      unitSegments: [{ label: "2 rechts" }, { label: "1 Abnahme" }],
    });
    expect(tip[2]).toMatchObject({
      times: 4,
      unitSegments: [{ label: "1 rechts" }, { label: "1 Abnahme" }],
    });
  });

  it("22/23 → 2 tip rounds (no 3-rechts round) matching sock-02", () => {
    const tip = tipRoundsForChartSize("22/23");
    expect(tip).toHaveLength(2);
    expect(tip[0]?.unitSegments[0]?.label).toBe("2 rechts");
    expect(tip[0]?.times).toBe(1);
    expect(tip[1]?.unitSegments[0]?.label).toBe("1 rechts");
    expect(tip[1]?.times).toBe(3);
  });

  it("50/51 tip round 3 has 5 decrease units (sock-01)", () => {
    const tip = tipRoundsForChartSize("50/51");
    expect(tip).toHaveLength(3);
    expect(tip[2]?.times).toBe(5);
  });

  it("skips zero counts and never emits 'In jeder Runde' close", () => {
    const tip = deriveTipRounds({
      inDer4Runde: 0,
      inJeder3Runde: 0,
      inJeder2Runde: 0,
      inJederRunde: 8,
    });
    expect(tip).toHaveLength(0);
  });
});

describe("materializePlan", () => {
  it("sock-03: chart 44/45 + actual 40/41 → plain 51, tip from chart", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("sock-03"));

    expect(plan.patternName).toBe("REGIA 4-fädig");
    expect(plan.chartSizeLabel).toBe("44/45");
    expect(plan.actualSizeLabel).toBe("40/41");
    // Construction snapshot for the preview (Aufteilung etc.)
    expect(plan.chart.aufteilung).toEqual([11, 12, 11]);
    expect(plan.chart.beidseitigeAufnahme).toBe(17);
    expect(plan.needleCount).toBe(2);
    expect(plan.chart.anschlagProNadel2).toBe(34);

    const byKey = Object.fromEntries(plan.steps.map((s) => [s.stepKey, s]));
    expect(byKey.cuff?.targetCount).toBe(40);
    expect(byKey.leg?.targetCount).toBe(15);
    expect(byKey.heel?.targetCount).toBe(32);
    expect(byKey.postJoin?.targetCount).toBe(5);
    expect(byKey.plainFoot?.targetCount).toBe(51);
    expect(byKey.tip?.targetCount).toBe(3);
    expect(byKey.tip?.tipRounds?.[2]?.times).toBe(4);
  });

  it("sock-04: same chart base 44/45 but plain 45 (actual 37/38)", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("sock-04"));
    expect(plan.chartSizeLabel).toBe("44/45");
    expect(plan.actualSizeLabel).toBe("37/38");
    const plain = plan.steps.find((s) => s.stepKey === "plainFoot");
    expect(plain?.targetCount).toBe(45);
  });

  it("sock-01: plain 62 and tip round 3 has 5 decrease units", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("sock-01"));
    const plain = plan.steps.find((s) => s.stepKey === "plainFoot");
    const tip = plan.steps.find((s) => s.stepKey === "tip");
    expect(plain?.targetCount).toBe(62);
    expect(tip?.tipRounds?.[2]?.times).toBe(5);
  });

  it("sock-02: child 18 on 22/23, plain 25, tip only 2 rounds", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("sock-02"));
    expect(plan.chartSizeLabel).toBe("22/23");
    expect(plan.actualSizeLabel).toBe("18");
    const plain = plan.steps.find((s) => s.stepKey === "plainFoot");
    const tip = plan.steps.find((s) => s.stepKey === "tip");
    expect(plain?.targetCount).toBe(25);
    expect(tip?.targetCount).toBe(2);
    expect(tip?.tipRounds).toHaveLength(2);
    expect(tip?.tipRounds?.[0]?.unitSegments[0]?.label).toBe("2 rechts");
  });

  it("preserves stitch direction (rechte Reihen)", () => {
    const plan = materializePlan(REGIA_4_FAEDIG_PATTERN, mustActualSize("sock-03"));
    const byKey = Object.fromEntries(plan.steps.map((s) => [s.stepKey, s]));
    expect(byKey.postJoin?.stitch).toBe("rechte");
    expect(byKey.plainFoot?.stitch).toBe("rechte");
    expect(byKey.leg?.stitch).toBe("rechte");
    expect(byKey.heel?.stitch).toBe("gemischt");
  });

  it("throws when a step has no configured count (never invent)", () => {
    const broken = {
      ...mustActualSize("sock-03"),
      counts: { cuff: 40 },
    };
    expect(() => materializePlan(REGIA_4_FAEDIG_PATTERN, broken)).toThrow(/do not invent/i);
  });

  it("seeded actual sizes cover the four notes", () => {
    expect(ACTUAL_SIZES.map((s) => s.id).sort()).toEqual([
      "sock-01",
      "sock-02",
      "sock-03",
      "sock-04",
    ]);
  });
});

describe("German wording (Reihen vs Runden)", () => {
  it("uses Reihen for normal steps and Runden only for tip", () => {
    expect(formatCountLine(5, "rounds", "rechte")).toBe("5 rechte Reihen");
    expect(formatCountLine(51, "rounds", "rechte")).toBe("51 rechte Reihen");
    expect(formatCountLine(32, "rows", "gemischt")).toBe("32 rechte + linke Reihen");
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
