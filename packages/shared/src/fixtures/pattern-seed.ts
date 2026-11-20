/**
 * The REGIA 4-fädig Käppchenferse pattern: step list and defaults.
 * Counts come from the size-pair model (`../size-pairs.ts`, ADR 0007).
 *
 * German only in name/description — not in keys or enum values.
 */
import type { Pattern } from "../domain";

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
      unit: "rounds",
      stitch: "none",
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
