import {
  ACTUAL_SIZES,
  REGIA_4_FAEDIG_PATTERN,
  STEP_LABELS,
  STEP_NOTES_HINT,
  type SteppedPlan,
  TECHNIQUE_NOTES,
  type TipRound,
  formatCountLine,
  materializePlan,
} from "@knithelper/shared";
import { useMemo, useState } from "react";

function formatTipRound(round: TipRound): string {
  const [knit, decrease] = round.unitSegments;
  const unit = `${knit?.label ?? ""}, ${decrease?.label ?? ""}`;
  return round.times > 1 ? `(${unit}) ×${round.times}` : unit;
}

function fmtAufteilung(t: readonly [number, number, number] | [number, number, number]): string {
  return `${t[0]}-${t[1]}-${t[2]}`;
}

/**
 * G1 preview: looks like her Notes / the REGIA sheet so she can compare.
 */
export function App() {
  const [selectedId, setSelectedId] = useState(ACTUAL_SIZES[0]?.id ?? "");
  const plan: SteppedPlan | null = useMemo(() => {
    const actual = ACTUAL_SIZES.find((s) => s.id === selectedId);
    return actual ? materializePlan(REGIA_4_FAEDIG_PATTERN, actual) : null;
  }, [selectedId]);

  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "42rem",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <h1>KnitHelper – Strickplan-Vorschau</h1>
      <p>
        Bitte mit der Notiz vergleichen. Das ist <em>noch nicht</em> die spätere Strick-UI.
      </p>

      <label htmlFor="size">
        Socke / Notiz:{" "}
        <select id="size" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          {ACTUAL_SIZES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — Größe {s.label} (Tabelle {s.chartSizeLabel})
            </option>
          ))}
        </select>
      </label>

      {plan ? (
        <>
          <section
            style={{
              marginTop: "1.25rem",
              padding: "0.75rem 1rem",
              border: "1px solid #ccc",
              borderRadius: 8,
              background: "#f8f8f8",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {plan.patternName}
              <small style={{ fontWeight: "normal" }}>
                {" "}
                · Ist-Größe {plan.actualSizeLabel} · Tabelle {plan.chartSizeLabel}
              </small>
            </h2>
            <p style={{ margin: "0.25rem 0" }}>
              <strong>Größentabelle (Käppchenferse)</strong> – Fersenaufbau folgt immer der Tabelle:
            </p>
            <ul style={{ margin: "0.25rem 0", paddingLeft: "1.25rem" }}>
              <li>
                Anschlag: <strong>{plan.chart.anschlagGesamt} Maschen</strong>{" "}
                <small>
                  ({plan.needleCount} Nadeln = {plan.chart.anschlagProNadel2} / Nadel; Tabelle
                  4&nbsp;Nadeln: {plan.chart.anschlagProNadelChart})
                </small>
              </li>
              <li>
                Maschen für Ferse: <strong>{plan.chart.maschenFuerFerse}</strong>
              </li>
              <li>
                Fersenhöhe: <strong>{plan.chart.fersenhoeheReihen} Reihen</strong>{" "}
                <small>(rechte + linke Hälften)</small>
              </li>
              <li>
                Aufteilung der M: <strong>{fmtAufteilung(plan.chart.aufteilung)}</strong>
              </li>
              <li>
                Beidseitige M-Aufnahme: <strong>{plan.chart.beidseitigeAufnahme}</strong>
              </li>
            </ul>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85em", color: "#666" }}>
              Fußlängen aus der Tabelle sind nur Referenz (hängt von Maschenprobe / Rundenzahl ab).
            </p>
          </section>

          <h2>Strickfolge</h2>
          <ol style={{ paddingLeft: "1.25rem" }}>
            {plan.steps.map((step) => {
              const title = STEP_LABELS[step.stepKey] ?? step.stepKey;
              const note = step.techniqueNoteKey
                ? TECHNIQUE_NOTES[step.techniqueNoteKey]
                : undefined;
              return (
                <li key={step.stepKey} style={{ marginBottom: "1rem" }}>
                  <strong>{title}</strong>
                  <div style={{ color: "#333" }}>
                    {step.stepKey === "split"
                      ? fmtAufteilung(plan.chart.aufteilung)
                      : step.stepKey === "pickup"
                        ? `${plan.chart.beidseitigeAufnahme} Maschen`
                        : formatCountLine(step.targetCount, step.unit, step.stitch)}
                  </div>
                  {note ? (
                    <div>
                      <em>{note}</em>
                    </div>
                  ) : null}
                  {step.tipRounds?.length ? (
                    <ul style={{ marginTop: "0.35rem" }}>
                      {step.tipRounds.map((r) => (
                        <li key={r.index}>
                          {r.title}: {formatTipRound(r)}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div style={{ fontSize: "0.85em", color: "#666", marginTop: "0.25rem" }}>
                    Notiz: „{STEP_NOTES_HINT[step.stepKey]}“
                  </div>
                </li>
              );
            })}
          </ol>

          <section
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1rem",
              border: "1px dashed #999",
              borderRadius: 8,
            }}
          >
            <strong>Bitte prüfen:</strong>
            <ul style={{ marginBottom: 0 }}>
              <li>Stimmen Anschlag, Ferse, Aufteilung, Aufnahme mit der Tabelle überein?</li>
              <li>Stimmen die Reihen-/Rundenzahlen und rechte/linke mit der Notiz überein?</li>
              <li>Stimmt die Bandspitze (Runden + Wiederholungen)?</li>
              <li>Ist „2 Nadeln“ (z.&nbsp;B. 34 statt 17 pro Nadel) richtig?</li>
            </ul>
          </section>
        </>
      ) : null}
    </main>
  );
}
