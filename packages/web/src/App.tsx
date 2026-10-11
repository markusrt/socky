import {
  ACTUAL_SIZES,
  type PairSession,
  REGIA_4_FAEDIG_PATTERN,
  STEP_LABELS,
  type SteppedPlan,
  TECHNIQUE_NOTES,
  type TipRound,
  canSwitchToSock2,
  createPairSession,
  currentStep,
  finishActiveSock,
  formatCountLine,
  formatTipCount,
  isCloseStep,
  materializePlan,
  switchToSock2,
  tickActiveSock,
  untickActiveSock,
} from "@knithelper/shared";
import { useMemo, useState } from "react";
import { loadSessions, upsertSession } from "./storage";

type View =
  | { name: "home" }
  | { name: "new" }
  | { name: "knit"; sessionId: string }
  | { name: "preview"; actualSizeId: string };

const DEMO_USER = "local";

function formatTipRound(round: TipRound): string {
  const [knit, decrease] = round.unitSegments;
  const unit = `${knit?.label ?? ""}, ${decrease?.label ?? ""}`;
  return round.times > 1 ? `(${unit}) ×${round.times}` : unit;
}

function fmtHeelSplit(t: readonly [number, number, number]): string {
  return `${t[0]}-${t[1]}-${t[2]}`;
}

function countLineForStep(
  stepKey: string,
  targetCount: number,
  unit: "rows" | "rounds" | "once" | "finish",
  stitch: "knit" | "purl" | "mixed" | "none"
): string {
  if (stepKey === "tip") return formatTipCount(targetCount);
  if (unit === "finish") return "Abschluss — bitte abketten";
  return formatCountLine(targetCount, unit, stitch);
}

export function App() {
  const [view, setView] = useState<View>({ name: "home" });
  const [sessions, setSessions] = useState<PairSession[]>(() => loadSessions());

  const session = useMemo(
    () => (view.name === "knit" ? sessions.find((s) => s.id === view.sessionId) : undefined),
    [view, sessions]
  );

  function commit(session: PairSession) {
    setSessions(upsertSession(session));
  }

  if (view.name === "new") {
    return (
      <NewSessionView
        onCancel={() => setView({ name: "home" })}
        onCreate={(s) => {
          commit(s);
          setView({ name: "knit", sessionId: s.id });
        }}
      />
    );
  }

  if (view.name === "knit" && session) {
    return (
      <KnitSessionView
        session={session}
        onBack={() => setView({ name: "home" })}
        onTick={() => commit(tickActiveSock(session))}
        onUndo={() => commit(untickActiveSock(session))}
        onFinishSock={() => commit(finishActiveSock(session))}
        onStartSock2={() => commit(switchToSock2(session))}
      />
    );
  }

  if (view.name === "preview") {
    return (
      <PreviewView actualSizeId={view.actualSizeId} onBack={() => setView({ name: "home" })} />
    );
  }

  return (
    <HomeView
      sessions={sessions}
      onNew={() => setView({ name: "new" })}
      onOpen={(id) => setView({ name: "knit", sessionId: id })}
      onPreview={(id) => setView({ name: "preview", actualSizeId: id })}
    />
  );
}

function HomeView({
  sessions,
  onNew,
  onOpen,
  onPreview,
}: {
  sessions: PairSession[];
  onNew: () => void;
  onOpen: (id: string) => void;
  onPreview: (id: string) => void;
}) {
  return (
    <main style={shell}>
      <h1>KnitHelper</h1>
      <button type="button" onClick={onNew} style={primaryBtn}>
        Neue Socke starten
      </button>

      <h2>Meine Strickprojekte</h2>
      {sessions.length === 0 ? (
        <p>Noch keine Socke angelegt.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sessions.map((s) => {
            const step = currentStep(s);
            return (
              <li key={s.id} style={{ marginBottom: "0.75rem" }}>
                <button type="button" onClick={() => onOpen(s.id)} style={listBtn}>
                  <strong>
                    {s.actualSizeLabel} <small>(Tabelle {s.chartSizeLabel})</small>
                  </strong>
                  <div>
                    {s.status === "DONE"
                      ? "Fertig"
                      : step
                        ? `${STEP_LABELS[step.stepKey]} · ${step.sock1Done}/${step.targetCount} · Socke ${s.activeSock}`
                        : "…"}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <h2>Pläne prüfen (G1)</h2>
      <ul>
        {ACTUAL_SIZES.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => onPreview(s.id)} style={linkBtn}>
              {s.id} — Größe {s.label} (Tabelle {s.chartSizeLabel})
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

function NewSessionView({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (s: PairSession) => void;
}) {
  const [actualSizeId, setActualSizeId] = useState(ACTUAL_SIZES[0]?.id ?? "");

  return (
    <main style={shell}>
      <h1>Neue Socke</h1>
      <p>
        Muster: <strong>REGIA 4-fädig</strong> · ein Paar (2 Socken)
      </p>
      <label htmlFor="actual">
        Ist-Größe / Notiz:{" "}
        <select id="actual" value={actualSizeId} onChange={(e) => setActualSizeId(e.target.value)}>
          {ACTUAL_SIZES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} (Tabelle {s.chartSizeLabel})
            </option>
          ))}
        </select>
      </label>
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          style={primaryBtn}
          onClick={() => {
            const actual = ACTUAL_SIZES.find((s) => s.id === actualSizeId);
            if (!actual) return;
            onCreate(
              createPairSession({
                userId: DEMO_USER,
                pattern: REGIA_4_FAEDIG_PATTERN,
                actualSize: actual,
              })
            );
          }}
        >
          Starten
        </button>
        <button type="button" style={secondaryBtn} onClick={onCancel}>
          Zurück
        </button>
      </div>
    </main>
  );
}

function KnitSessionView({
  session,
  onBack,
  onTick,
  onUndo,
  onFinishSock,
  onStartSock2,
}: {
  session: PairSession;
  onBack: () => void;
  onTick: () => void;
  onUndo: () => void;
  onFinishSock: () => void;
  onStartSock2: () => void;
}) {
  const step = currentStep(session);
  const done = session.status === "DONE" || !step;
  const closeStep = step ? isCloseStep(step) : false;

  return (
    <main style={shell}>
      <button type="button" style={linkBtn} onClick={onBack}>
        ← Übersicht
      </button>
      <h1>
        Größe {session.actualSizeLabel}{" "}
        <small style={{ fontWeight: "normal" }}>(Tabelle {session.chartSizeLabel})</small>
      </h1>
      <p style={{ marginTop: 0 }}>
        Aktuell: <strong>Socke {session.activeSock}</strong> von 2 (nacheinander)
      </p>

      {done ? (
        <section style={card}>
          <h2 style={{ marginTop: 0 }}>Paar fertig</h2>
          <p>Beide Socken sind abgeschlossen.</p>
        </section>
      ) : (
        <>
          <section style={card}>
            <h2 style={{ marginTop: 0 }}>{STEP_LABELS[step.stepKey]}</h2>
            <p style={{ fontSize: "1.25rem", margin: "0.25rem 0" }}>
              {countLineForStep(step.stepKey, step.targetCount, step.unit, "knit")}
            </p>
            {step.techniqueNoteKey ? (
              <p>
                <em>{TECHNIQUE_NOTES[step.techniqueNoteKey]}</em>
              </p>
            ) : null}

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem" }}>
              <SockProgress
                label="Socke 1"
                done={step.sock1Done}
                target={step.targetCount}
                active={session.activeSock === 1}
              />
              <SockProgress
                label="Socke 2"
                done={step.sock2Done}
                target={step.targetCount}
                active={session.activeSock === 2}
              />
            </div>

            {step.tipRounds?.length ? (
              <ul style={{ marginTop: "0.75rem" }}>
                {step.tipRounds.map((r) => (
                  <li key={r.index}>
                    {r.title}: {formatTipRound(r)}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {closeStep ? (
            <button type="button" style={bigBtn} onClick={onFinishSock}>
              Socke fertig
            </button>
          ) : (
            <button type="button" style={bigBtn} onClick={onTick}>
              Reihe fertig
            </button>
          )}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            {!closeStep ? (
              <button type="button" style={secondaryBtn} onClick={onUndo}>
                Rückgängig
              </button>
            ) : null}
            {session.activeSock === 1 && canSwitchToSock2(session) ? (
              <button type="button" style={primaryBtn} onClick={onStartSock2}>
                Socke 2 starten
              </button>
            ) : null}
          </div>
        </>
      )}
    </main>
  );
}

function SockProgress({
  label,
  done,
  target,
  active,
}: {
  label: string;
  done: number;
  target: number;
  active: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: "0.5rem",
        borderRadius: 8,
        border: active ? "2px solid #2563eb" : "1px solid #ccc",
        background: active ? "#eff6ff" : "#fff",
      }}
    >
      <div style={{ fontWeight: active ? 700 : 400 }}>
        {label}
        {active ? " ●" : ""}
      </div>
      <div>
        {done} / {target}
      </div>
    </div>
  );
}

function PreviewView({ actualSizeId, onBack }: { actualSizeId: string; onBack: () => void }) {
  const plan: SteppedPlan | null = useMemo(() => {
    const actual = ACTUAL_SIZES.find((s) => s.id === actualSizeId);
    return actual ? materializePlan(REGIA_4_FAEDIG_PATTERN, actual) : null;
  }, [actualSizeId]);

  if (!plan) return null;

  return (
    <main style={shell}>
      <button type="button" style={linkBtn} onClick={onBack}>
        ← Übersicht
      </button>
      <h1>
        {plan.patternName} · {plan.actualSizeLabel}{" "}
        <small style={{ fontWeight: "normal" }}>(Tabelle {plan.chartSizeLabel})</small>
      </h1>
      <section style={card}>
        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
          <li>
            Anschlag: <strong>{plan.chart.castOnTotal}</strong> ({plan.needleCount} Nadeln ={" "}
            {plan.chart.castOnPerNeedle2} / Nadel)
          </li>
          <li>
            Fersenhöhe: <strong>{plan.chart.heelHeightRows} Reihen</strong>
          </li>
          <li>
            Aufteilung: <strong>{fmtHeelSplit(plan.chart.heelSplit)}</strong>
          </li>
          <li>
            Aufnahme: <strong>{plan.chart.pickupStitchesBothSides}</strong>
          </li>
        </ul>
      </section>
      <ol>
        {plan.steps.map((step) => (
          <li key={step.stepKey} style={{ marginBottom: "0.75rem" }}>
            <strong>{STEP_LABELS[step.stepKey]}</strong>
            <div>
              {step.stepKey === "split"
                ? fmtHeelSplit(plan.chart.heelSplit)
                : step.stepKey === "pickup"
                  ? `${plan.chart.pickupStitchesBothSides} Maschen`
                  : countLineForStep(step.stepKey, step.targetCount, step.unit, step.stitch)}
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
    </main>
  );
}

// Wire preview into App via view state — keep App as single switch
// (PreviewView used when view.name === "preview")

const shell: React.CSSProperties = {
  fontFamily: "system-ui, sans-serif",
  maxWidth: "28rem",
  margin: "0 auto",
  padding: "1rem",
};

const card: React.CSSProperties = {
  padding: "0.75rem 1rem",
  border: "1px solid #ccc",
  borderRadius: 8,
  background: "#f8f8f8",
  marginBottom: "1rem",
};

const primaryBtn: React.CSSProperties = {
  fontSize: "1rem",
  padding: "0.75rem 1.25rem",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const bigBtn: React.CSSProperties = {
  ...primaryBtn,
  width: "100%",
  fontSize: "1.35rem",
  padding: "1.1rem",
  background: "#16a34a",
};

const secondaryBtn: React.CSSProperties = {
  fontSize: "1rem",
  padding: "0.65rem 1rem",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};

const listBtn: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  fontSize: "1rem",
  padding: "0.75rem 1rem",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};

const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
  fontSize: "1rem",
  padding: "0.25rem 0",
  textAlign: "left",
};
