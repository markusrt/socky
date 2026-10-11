import type { StepKey, StitchDirection } from "./domain";

/**
 * User-facing German strings. Technical keys stay English (Constitution §7).
 */
export const STEP_LABELS: Record<StepKey, string> = {
  cuff: "Bund / Bündchen",
  leg: "Rechte Reihen (Bein)",
  heel: "Ferse (Käppchen)",
  heelKnit: "Ferse – rechte Reihen",
  heelPurl: "Ferse – linke Reihen",
  split: "Aufteilung der Maschen",
  pickup: "Maschen aufnehmen",
  postJoin: "Nach dem Zusammenstricken",
  plainFoot: "Nur rechte Reihen (Fuß)",
  tip: "Maschenreduzieren (Bandspitze)",
  close: "Socke abketten (Abschluss)",
};

export const TECHNIQUE_NOTES: Record<string, string> = {
  "note.pickup_together_then_twisted": "Erst zusammen dann verschränkt",
  "note.decrease_twisted_then_together": "Maschenreduzieren erst verschränkt dann zusammen",
};

/** Notes-text snippets for G1 side-by-side review (user-facing). */
export const STEP_NOTES_HINT: Record<StepKey, string> = {
  cuff: "Bündchen 40 Reihen / Bund 40 Reihen",
  leg: "Rechte Reihen 15",
  heel: "Ferse in Reihen 32 (Rechte 16 + Linke 16)",
  heelKnit: "Rechte Reihen 16",
  heelPurl: "Linke Reihen 16",
  split: "Aufteilung 11-12-11",
  pickup: "17 Maschen aufnehmen",
  postJoin: "Nach dem zusammenstricken 5 rechte Reihen",
  plainFoot: "Nach dem maschreduzieren nur rechte Reihen 51",
  tip: "Maschenreduzieren … 1./2./3. Runde",
  close: "Abschluss / Abketten (wird nicht mit „Reihe fertig“ gezählt)",
};

export const STITCH_LABELS: Record<StitchDirection, string> = {
  knit: "rechte",
  purl: "linke",
  mixed: "rechte + linke",
  none: "",
};

/**
 * Count line as she writes it.
 * Almost everything is **Reihen**; only the tip is **Runden** (no “rechte”).
 */
export function formatCountLine(
  count: number,
  unit: "rows" | "rounds" | "once" | "finish",
  stitch: StitchDirection
): string {
  if (unit === "finish") return "Abschluss — nicht mit Reihen zählen";
  if (unit === "once") return "einmal";
  if (stitch === "knit" || stitch === "purl" || stitch === "mixed") {
    return `${count} ${STITCH_LABELS[stitch]} Reihen`;
  }
  return `${count} Reihen`;
}

/** Tip header, e.g. "3 Runden" — never "rechte Runden". */
export function formatTipCount(roundCount: number): string {
  return `${roundCount} Runden`;
}
