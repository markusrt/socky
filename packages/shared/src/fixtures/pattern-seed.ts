/**
 * Seeded actual sizes from her sock Notes (reference for G1).
 * JSON under packages/shared/data/actual-sizes/ is the admin-editable source.
 * Tip rounds come from the chart tip schedule unless a file overrides tipRounds.
 *
 * German only in name/description/tags/notes — not in keys or enum values.
 */
import size18 from "../../data/actual-sizes/size-18.json";
import size3738 from "../../data/actual-sizes/size-37-38.json";
import size4041 from "../../data/actual-sizes/size-40-41.json";
import size5051 from "../../data/actual-sizes/size-50-51.json";
import type { ActualSizeConfig, Pattern, TipRound } from "../domain";
import { getChartSize, tipRoundsForChartSize } from "../size-chart-seed";

export const REGIA_4_FAEDIG_PATTERN: Pattern = {
  id: "regia-4-faedig",
  name: "REGIA 4-fädig",
  nameKey: "pattern.regia4faedig",
  description: "Socken mit Käppchenferse — REGIA 4-fädig und Cotton, 2–3 mm",
  steps: [
    { key: "castOn", titleKey: "step.castOn", unit: "once", stitch: "none", defaultCount: 1 },
    { key: "cuff", titleKey: "step.cuff", unit: "rows", stitch: "none", defaultCount: 40 },
    { key: "leg", titleKey: "step.leg", unit: "rows", stitch: "knit", defaultCount: 15 },
    { key: "heel", titleKey: "step.heel", unit: "rows", stitch: "mixed", defaultCount: 32 },
    { key: "split", titleKey: "step.split", unit: "once", stitch: "none", defaultCount: 1 },
    {
      key: "pickup",
      titleKey: "step.pickup",
      techniqueNoteKey: "note.pickup_together_then_twisted",
      unit: "once",
      stitch: "none",
      defaultCount: 1,
    },
    {
      key: "postJoin",
      titleKey: "step.postJoin",
      unit: "rounds",
      stitch: "knit",
      defaultCount: 5,
    },
    {
      key: "reduceToCastOn",
      titleKey: "step.reduceToCastOn",
      unit: "once",
      stitch: "none",
      defaultCount: 1,
    },
    { key: "plainFoot", titleKey: "step.plainFoot", unit: "rounds", stitch: "knit" },
    {
      key: "tip",
      titleKey: "step.tip",
      techniqueNoteKey: "note.decrease_twisted_then_together",
      unit: "rounds",
      stitch: "knit",
    },
    {
      key: "close",
      titleKey: "step.close",
      unit: "finish",
      stitch: "none",
      defaultCount: 1,
    },
  ],
};

type ActualSizeJson = {
  id: string;
  patternId: string;
  label: string;
  chartSizeLabel: string;
  tags?: string[];
  notes?: string;
  counts: ActualSizeConfig["counts"];
  tipRounds?: TipRound[];
};

function loadActualSize(raw: ActualSizeJson): ActualSizeConfig {
  const chart = getChartSize(raw.chartSizeLabel);
  if (!chart) {
    throw new Error(`actual size ${raw.id}: unknown chart "${raw.chartSizeLabel}"`);
  }
  return {
    ...raw,
    tipRounds: raw.tipRounds?.length ? raw.tipRounds : tipRoundsForChartSize(raw.chartSizeLabel),
  };
}

const JSON_SEEDS: ActualSizeJson[] = [size4041, size3738, size5051, size18] as ActualSizeJson[];

export const ACTUAL_SIZES: readonly ActualSizeConfig[] = JSON_SEEDS.map(loadActualSize);

export function getActualSize(id: string): ActualSizeConfig | undefined {
  return ACTUAL_SIZES.find((s) => s.id === id);
}

/** Test helper: assert a seeded actual size exists. */
export function mustActualSize(id: string): ActualSizeConfig {
  const actual = getActualSize(id);
  if (!actual) {
    throw new Error(`missing fixture actual size: ${id}`);
  }
  return actual;
}
