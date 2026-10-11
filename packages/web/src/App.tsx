import {
  ACTUAL_SIZES,
  REGIA_4_FAEDIG_PATTERN,
  type SteppedPlan,
  type TipRound,
  materializePlan,
} from "@knithelper/shared";
import { useMemo, useState } from "react";

function formatTipRound(round: TipRound): string {
  const [knit, decrease] = round.unitSegments;
  const unit = `${knit?.label ?? ""} / ${decrease?.label ?? ""}`;
  return round.times > 1 ? `(${unit}) ×${round.times}` : unit;
}

/**
 * G0/G1 shell: domain preview only — no auth, no PWA, no polish.
 * Wife reviews generated plans against Notes here (and via docs/domain/vergleich-*).
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
        maxWidth: "40rem",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <h1>KnitHelper</h1>
      <p>
        <strong>G0/G1 Preview</strong> — Strickplan gegen Notizen prüfen (noch ohne Strick-UI).
      </p>

      <label htmlFor="size">
        Socke / Größe:{" "}
        <select id="size" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          {ACTUAL_SIZES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — actual {s.label} (chart {s.chartSizeLabel})
            </option>
          ))}
        </select>
      </label>

      {plan ? (
        <section style={{ marginTop: "1.5rem" }}>
          <h2>
            {plan.patternName} · {plan.actualSizeLabel}
            <small style={{ fontWeight: "normal" }}> (Basis {plan.chartSizeLabel})</small>
          </h2>
          <ol>
            {plan.steps.map((step) => (
              <li key={step.stepKey} style={{ marginBottom: "0.75rem" }}>
                <strong>{step.stepKey}</strong>
                {step.techniqueNoteKey ? (
                  <em style={{ marginLeft: "0.5rem" }}>{step.techniqueNoteKey}</em>
                ) : null}
                <div>
                  {step.unit === "once"
                    ? "einmalig"
                    : `${step.targetCount} ${step.unit === "rows" ? "Reihen" : "Runden"}`}
                </div>
                {step.tipRounds?.length ? (
                  <ul>
                    {step.tipRounds.map((r) => (
                      <li key={r.index}>
                        {r.title}: {formatTipRound(r)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </main>
  );
}
