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
  heelRowPolarity,
  isCloseStep,
  materializePlan,
  switchToSock2,
  tickActiveSock,
  tipProgressSummary,
  untickActiveSock,
} from "@socky/shared";
import { useMemo, useState } from "react";
import { loadSessions, upsertSession } from "./storage";
import { colors } from "./theme";
import { Button } from "./ui/Button";

type View =
  | { name: "home" }
  | { name: "new" }
  | { name: "knit"; sessionId: string }
  | { name: "preview"; actualSizeId: string };

const DEMO_USER = "local";

function formatTipRound(round: TipRound): string {
  const [knit, decrease] = round.unitSegments;
  const unit = `${knit?.count ?? 0} rechts, ${decrease?.count ?? 0} Abnahme`;
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
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "0.75rem",
          textAlign: "center",
        }}
      >
        <img
          src="./logo-socky.png"
          alt="Socky"
          style={{
            maxWidth: "100%",
            width: 240,
            height: "auto",
            display: "block",
            objectFit: "contain",
          }}
        />
        <p style={{ margin: "0.5rem 0 0", color: colors.ink }}>Knit. Track. Cozy.</p>
      </header>
      <Button onClick={onNew} fullWidth>
        Neue Socke starten
      </Button>

      <h2>Meine Strickprojekte</h2>
      {sessions.length === 0 ? (
        <p>Noch keine Socke angelegt.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sessions.map((s) => {
            const step = currentStep(s);
            return (
              <li key={s.id} style={{ marginBottom: "0.75rem" }}>
                <Button variant="secondary" fullWidth onClick={() => onOpen(s.id)}>
                  <span style={{ textAlign: "left", display: "block" }}>
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
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <h2>Pläne prüfen (G1)</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {ACTUAL_SIZES.map((s) => (
          <li key={s.id} style={{ marginBottom: "0.75rem" }}>
            <Button variant="secondary" fullWidth onClick={() => onPreview(s.id)}>
              <span style={{ textAlign: "left", display: "block" }}>
                <strong>
                  Größe {s.label} <small>(Tabelle {s.chartSizeLabel})</small>
                </strong>
                <div style={{ fontWeight: 400, opacity: 0.85 }}>Strickplan ansehen</div>
              </span>
            </Button>
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
        <Button
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
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Zurück
        </Button>
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
  const tipRow = step?.stepKey === "tip";
  const onceStep = step?.unit === "once";

  let confirmLabel = "Reihe fertig";
  if (closeStep) confirmLabel = "Socke fertig";
  else if (onceStep) confirmLabel = "Fertig";
  else if (tipRow) confirmLabel = "Reihe fertig";

  const confirmAction = closeStep ? onFinishSock : onTick;

  return (
    <main style={shell}>
      <Button variant="ghost" onClick={onBack}>
        ← Übersicht
      </Button>
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

            {tipRow ? (
              <TipRowBlock session={session} step={step} />
            ) : step.stepKey === "heel" ? (
              <HeelBlock session={session} step={step} />
            ) : (
              <p style={{ fontSize: "1.25rem", margin: "0.25rem 0" }}>
                {step.stepKey === "castOn" && step.displayValue
                  ? step.displayValue
                  : step.stepKey === "split" && step.displayValue
                    ? `Aufteilung: ${step.displayValue}`
                    : step.stepKey === "pickup" && step.displayValue
                      ? `${step.displayValue} Maschen aufnehmen`
                      : step.stepKey === "reduceToCastOn" && step.displayValue
                        ? `Reduzieren auf ${step.displayValue} Maschen (wie Anschlag)`
                        : countLineForStep(step.stepKey, step.targetCount, step.unit, "knit")}
              </p>
            )}

            {step.techniqueNoteKey ? (
              <p>
                <em>{TECHNIQUE_NOTES[step.techniqueNoteKey]}</em>
              </p>
            ) : null}

            {!tipRow ? (
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
            ) : null}
          </section>

          <Button fullWidth large onClick={confirmAction}>
            {confirmLabel}
          </Button>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            {!closeStep ? (
              <Button variant="secondary" onClick={onUndo}>
                Rückgängig
              </Button>
            ) : null}
            {session.activeSock === 1 && canSwitchToSock2(session) ? (
              <Button onClick={onStartSock2}>Socke 2 starten</Button>
            ) : null}
          </div>
        </>
      )}
    </main>
  );
}

function HeelBlock({
  session,
  step,
}: {
  session: PairSession;
  step: NonNullable<ReturnType<typeof currentStep>>;
}) {
  const rowNumber = (session.activeSock === 1 ? step.sock1Done : step.sock2Done) + 1;
  const polarity = heelRowPolarity(rowNumber);
  return (
    <div>
      <p style={{ fontSize: "1.25rem", margin: "0.25rem 0" }}>
        {step.targetCount} Reihen · abwechselnd rechts / links
      </p>
      <p style={{ fontSize: "1.5rem", margin: "0.25rem 0", fontWeight: 700 }}>
        Reihe {Math.min(rowNumber, step.targetCount)} von {step.targetCount}
        <span
          style={{
            marginLeft: "0.75rem",
            fontSize: "1.1rem",
            color: polarity === "knit" ? colors.woolyTeal : colors.warmMustard,
          }}
        >
          {polarity === "knit" ? "rechts" : "links"}
        </span>
      </p>
    </div>
  );
}

function TipRowBlock({
  session,
  step,
}: {
  session: PairSession;
  step: NonNullable<ReturnType<typeof currentStep>>;
}) {
  const summary = tipProgressSummary(session, step);
  const tipSteps = session.steps.filter((s) => s.stepKey === "tip");
  const roundRows = tipSteps.filter((s) => s.tipRoundIndex === step.tipRoundIndex);

  return (
    <div>
      <p style={{ margin: "0.25rem 0", color: "#555" }}>
        Bandspitze · Runde {summary.roundIndex} von {summary.totalRounds} · Reihe{" "}
        {summary.rowInRound} von {summary.rowsInRound}
      </p>
      <p style={{ fontSize: "1.5rem", margin: "0.25rem 0", fontWeight: 700 }}>
        {step.tipRowLabel}
        {step.tipDirection === "decrease" ? (
          <span style={{ marginLeft: "0.5rem", fontSize: "1rem", color: colors.warmMustard }}>
            Abnahme
          </span>
        ) : (
          <span style={{ marginLeft: "0.5rem", fontSize: "1rem", color: colors.woolyTeal }}>
            rechts
          </span>
        )}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
        {roundRows.map((row) => {
          const done = session.activeSock === 1 ? row.sock1Done > 0 : row.sock2Done > 0;
          const isCurrent = row === step;
          return (
            <span
              key={row.sortIndex}
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: 8,
                fontSize: "0.85em",
                border: isCurrent
                  ? `2px solid ${colors.berryRed}`
                  : `1px solid ${colors.cozyPeach}`,
                background: done ? colors.cozyPeach : isCurrent ? colors.softCream : "#fff",
              }}
            >
              {done ? "✓ " : ""}
              {row.tipRowLabel}
            </span>
          );
        })}
      </div>
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
    </div>
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
  const complete = done >= target;
  return (
    <div
      style={{
        flex: 1,
        padding: "0.5rem",
        borderRadius: 12,
        border: active
          ? `2px solid ${colors.woolyTeal}`
          : complete
            ? `2px solid ${colors.warmMustard}`
            : `1px solid ${colors.cozyPeach}`,
        background: active ? colors.softCream : complete ? "#F7E8B8" : "#fff",
      }}
    >
      <div style={{ fontWeight: active ? 700 : 400 }}>
        {label}
        {active ? " ●" : ""}
      </div>
      <div style={{ fontSize: "1.15rem" }}>
        {complete ? (
          <span style={{ color: colors.warmMustard, fontWeight: 700 }} title="fertig">
            ✓
          </span>
        ) : (
          <>
            {done} / {target}
          </>
        )}
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
      <Button variant="ghost" onClick={onBack}>
        ← Übersicht
      </Button>
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
  background: colors.softCream,
  minHeight: "100vh",
  color: colors.ink,
};

const card: React.CSSProperties = {
  padding: "0.75rem 1rem",
  border: `1px solid ${colors.cozyPeach}`,
  borderRadius: 12,
  background: "#fff",
  marginBottom: "1rem",
};
