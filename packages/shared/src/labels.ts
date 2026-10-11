import type { StepKey, StitchDirection } from "./domain";

/**
 * German labels as written in her Notes / the REGIA sheet.
 * Keep domain vocabulary (Bund, Ferse, Aufteilung, …).
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
};

export const TECHNIQUE_NOTES: Record<string, string> = {
  "note.pickup_verschraenkt": "Erst zusammen dann verschränkt",
  "note.tip_verschraenkt": "Maschenreduzieren erst verschränkt dann zusammen",
};

/** Notes-text snippets the step maps to (for G1 side-by-side review). */
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
};

export const STITCH_LABELS: Record<StitchDirection, string> = {
  rechte: "rechte",
  linke: "linke",
  gemischt: "rechte + linke",
  none: "",
};

/**
 * Count line as she writes it.
 * - Almost everything is **Reihen** (Bund, Bein, Ferse, Fuß, …).
 * - Only the tip (Bandspitze) is counted in **Runden**, and without “rechte”
 *   (each tip round mixes rechts + Abnahme).
 */
export function formatCountLine(
  count: number,
  unit: "rows" | "rounds" | "once",
  stitch: StitchDirection
): string {
  if (unit === "once") return "einmal";
  if (stitch === "rechte" || stitch === "linke" || stitch === "gemischt") {
    return `${count} ${STITCH_LABELS[stitch]} Reihen`;
  }
  return `${count} Reihen`;
}

/** Tip header, e.g. "3 Runden" — never "rechte Runden". */
export function formatTipCount(roundCount: number): string {
  return `${roundCount} Runden`;
}
