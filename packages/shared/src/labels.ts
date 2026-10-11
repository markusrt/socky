import type { StepKey, StitchDirection } from "./domain";

/**
 * User-facing German strings. Technical keys stay English (Constitution §7).
 */
export const STEP_LABELS: Record<StepKey, string> = {
  castOn: "Maschen anschlagen",
  cuff: "Bund / Bündchen",
  leg: "Rechte Reihen (Bein)",
  heel: "Ferse (Käppchen)",
  heelKnit: "Ferse – rechte Reihen",
  heelPurl: "Ferse – linke Reihen",
  split: "Aufteilung der Maschen",
  pickup: "Maschen aufnehmen",
  postJoin: "Nach dem Zusammenstricken",
  reduceToCastOn: "Maschen reduzieren",
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
  castOn: "44 Maschen aufnehmen (2 Nadeln = 22)",
  cuff: "Bündchen 40 Reihen / Bund 40 Reihen",
  leg: "Rechte Reihen 15",
  heel: "Ferse in Reihen 20 (abwechselnd rechts / links)",
  heelKnit: "Rechte Reihen",
  heelPurl: "Linke Reihen",
  split: "Aufteilung 7-8-7",
  pickup: "11 Maschen aufnehmen",
  postJoin: "Nach dem zusammenstricken 3 rechte Reihen",
  reduceToCastOn: "Maschen reduzieren bis Anschlag (z. B. 44)",
  plainFoot: "Nach dem maschreduzieren nur rechte Reihen 25",
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
