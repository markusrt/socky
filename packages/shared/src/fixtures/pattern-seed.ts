import sock01 from "../../data/actual-sizes/sock-01.json";
import sock02 from "../../data/actual-sizes/sock-02.json";
import sock03 from "../../data/actual-sizes/sock-03.json";
import sock04 from "../../data/actual-sizes/sock-04.json";
/**
 * Seeded actual sizes from her sock Notes (reference for G1).
 * JSON files under packages/shared/data/actual-sizes/ are the admin-editable source.
 * Tip rounds are derived from the chart Bandspitze unless a file overrides tipRounds.
 */
import type { ActualSizeConfig, Pattern, TipRound } from "../domain";
import { getChartSize, tipRoundsForChartSize } from "../size-chart-seed";

export const REGIA_4_FAEDIG_PATTERN: Pattern = {
  id: "regia-4-faedig",
  name: "REGIA 4-fädig",
  nameKey: "pattern.regia4faedig",
  description: "Socken mit Käppchenferse — REGIA 4-fädig und Cotton, 2–3 mm",
  steps: [
    { key: "cuff", titleKey: "step.cuff", unit: "rows", stitch: "none", defaultCount: 40 },
    { key: "leg", titleKey: "step.leg", unit: "rows", stitch: "rechte", defaultCount: 15 },
    { key: "heel", titleKey: "step.heel", unit: "rows", stitch: "gemischt", defaultCount: 32 },
    { key: "split", titleKey: "step.split", unit: "once", stitch: "none" },
    {
      key: "pickup",
      titleKey: "step.pickup",
      techniqueNoteKey: "note.pickup_verschraenkt",
      unit: "once",
      stitch: "none",
    },
    {
      key: "postJoin",
      titleKey: "step.postJoin",
      unit: "rounds",
      stitch: "rechte",
      defaultCount: 5,
    },
    { key: "plainFoot", titleKey: "step.plainFoot", unit: "rounds", stitch: "rechte" },
    {
      key: "tip",
      titleKey: "step.tip",
      techniqueNoteKey: "note.tip_verschraenkt",
      unit: "rounds",
      stitch: "rechte",
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

const JSON_SEEDS: ActualSizeJson[] = [sock03, sock04, sock01, sock02] as ActualSizeJson[];

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
