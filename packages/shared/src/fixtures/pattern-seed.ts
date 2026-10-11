/**
 * Seeded actual sizes from her sock Notes (reference for G1).
 * Tip rounds are derived from the chart Bandspitze (chartSizeLabel) unless overridden.
 */
import type { ActualSizeConfig, Pattern } from "../domain";
import { tipRoundsForChartSize } from "../size-chart-seed";

export const REGIA_4_FAEDIG_PATTERN: Pattern = {
  id: "regia-4-faedig",
  name: "REGIA 4-fädig",
  nameKey: "pattern.regia4faedig",
  description: "Socken mit Käppchenferse — REGIA 4-fädig und Cotton, 2–3 mm",
  steps: [
    { key: "cuff", titleKey: "step.cuff", unit: "rows", defaultCount: 40 },
    { key: "leg", titleKey: "step.leg", unit: "rows", defaultCount: 15 },
    { key: "heel", titleKey: "step.heel", unit: "rows", defaultCount: 32 },
    { key: "split", titleKey: "step.split", unit: "once" },
    {
      key: "pickup",
      titleKey: "step.pickup",
      techniqueNoteKey: "note.pickup_verschraenkt",
      unit: "once",
    },
    { key: "postJoin", titleKey: "step.postJoin", unit: "rounds", defaultCount: 5 },
    { key: "plainFoot", titleKey: "step.plainFoot", unit: "rounds" },
    {
      key: "tip",
      titleKey: "step.tip",
      techniqueNoteKey: "note.tip_verschraenkt",
      unit: "rounds",
    },
  ],
};

/** Fallback if chart size missing — never invent; prefer tipRoundsForChartSize. */
function tipFromChartOrEmpty(chartLabel: string) {
  try {
    return tipRoundsForChartSize(chartLabel);
  } catch {
    return [];
  }
}

export const ACTUAL_SIZES: readonly ActualSizeConfig[] = [
  {
    id: "sock-03",
    patternId: "regia-4-faedig",
    label: "40/41",
    chartSizeLabel: "44/45",
    tags: ["aktuelle Socken", "Referenz sock-03"],
    notes: "68 Maschen aufnehmen (2 Nadeln: 34); Bund 40; plain 51",
    counts: {
      cuff: 40,
      leg: 15,
      heel: 32,
      postJoin: 5,
      plainFoot: 51,
    },
    tipRounds: tipFromChartOrEmpty("44/45"),
  },
  {
    id: "sock-04",
    patternId: "regia-4-faedig",
    label: "37/38",
    chartSizeLabel: "44/45",
    tags: ["aktuelle Socken", "Referenz sock-04"],
    notes: "68 Maschen (2 Nadeln: 34); Bund 40; plain 45",
    counts: {
      cuff: 40,
      leg: 15,
      heel: 32,
      postJoin: 5,
      plainFoot: 45,
    },
    tipRounds: tipFromChartOrEmpty("44/45"),
  },
  {
    id: "sock-01",
    patternId: "regia-4-faedig",
    label: "50/51",
    chartSizeLabel: "50/51",
    tags: ["Referenz sock-01"],
    notes: "76 Maschen (2 Nadeln: 38); ohne verschränkt-Hinweise",
    counts: {
      cuff: 45,
      leg: 15,
      heel: 36,
      postJoin: 5,
      plainFoot: 62,
    },
    tipRounds: tipFromChartOrEmpty("50/51"),
  },
  {
    id: "sock-02",
    patternId: "regia-4-faedig",
    label: "18",
    chartSizeLabel: "22/23",
    tags: ["aktuelle Socken", "Kind", "Referenz sock-02"],
    notes: "44 Maschen (2 Nadeln: 22); Kind 18 auf 22/23-Konstruktion",
    counts: {
      cuff: 25,
      leg: 5,
      heel: 20,
      postJoin: 3,
      plainFoot: 25,
    },
    tipRounds: tipFromChartOrEmpty("22/23"),
  },
];

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
