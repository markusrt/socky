import {
  canSwitchToSock2,
  createPairSession,
  currentStep,
  finishActiveSock,
  formatCountLine,
  formatTipCount,
  heelRowPolarity,
  isCloseStep,
  materializePlan,
  OFFERED_PAIRS,
  type PairSession,
  REGIA_4_FAEDIG_PATTERN,
  STEP_LABELS,
  type SteppedPlan,
  sizePair,
  switchToSock2,
  TECHNIQUE_NOTES,
  type TipRound,
  tickActiveSock,
  tipProgressSummary,
  untickActiveSock,
} from "@socky/shared";
import { type ReactNode, useMemo, useState } from "react";
import { SaveFailedNotice, UnreadableDataNotice } from "./StorageNotice";
import { dismissUnreadable, loadStorage, type UnreadableNotice, upsertSession } from "./storage";
import { colors } from "./theme";
import { Button } from "./ui/Button";

type View = { name: "home" } | { name: "new" } | { name: "knit"; sessionId: string };

const DEMO_USER = "local";

function formatTipRound(round: TipRound): string {
  const [knit, decrease] = round.unitSegments;
  const unit = `${knit?.count ?? 0} rechts, ${decrease?.count ?? 0} Abnahme`;
  return round.times > 1 ? `(${unit}) ×${round.times}` : unit;
}

function fmtHeelSplit(t: readonly [number, number, number]): string {
  return `${t[0]}-${t[1]}-${t[2]}`;
}

/**
 * Size heading: pairs from the size-pair model show their stitch count
 * ("27/28", "· 56 Maschen"); pairs saved before keep their chart label (P4).
 */
function sizeTitle(session: PairSession): { size: string; detail: string } {
  if (session.sizeModel !== undefined && session.castOnTotal !== undefined) {
    return { size: session.actualSizeLabel, detail: `· ${session.castOnTotal} Maschen` };
  }
  return { size: session.actualSizeLabel, detail: `(Tabelle ${session.chartSizeLabel})` };
}

/** "3 Reihen · bis 56 Maschen (wie Anschlag)" for the counted reduce step. */
function reduceLine(rows: number, castOnTotal: number | string): string {
  return `${formatCountLine(rows, "rounds", "none")} · bis ${castOnTotal} Maschen (wie Anschlag)`;
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
  const [initial] = useState(() => loadStorage());
  const [sessions, setSessions] = useState<PairSession[]>(initial.sessions);
  const [notices, setNotices] = useState<UnreadableNotice[]>(initial.notices);
  const [saveFailed, setSaveFailed] = useState(false);

  const session = useMemo(
    () => (view.name === "knit" ? sessions.find((s) => s.id === view.sessionId) : undefined),
    [view, sessions]
  );

  function commit(session: PairSession) {
    const result = upsertSession(session, sessions);
    setSessions(result.sessions);
    setSaveFailed(!result.save.ok);
  }

  function dismiss(key: string) {
    dismissUnreadable(key);
    setNotices((current) => current.filter((n) => n.key !== key));
  }

  let screen: ReactNode;
  if (view.name === "new") {
    screen = (
      <NewSessionView
        onCancel={() => setView({ name: "home" })}
        onCreate={(s) => {
          commit(s);
          setView({ name: "knit", sessionId: s.id });
        }}
      />
    );
  } else if (view.name === "knit" && session) {
    screen = (
      <KnitSessionView
        session={session}
        onBack={() => setView({ name: "home" })}
        onTick={() => commit(tickActiveSock(session))}
        onUndo={() => commit(untickActiveSock(session))}
        onFinishSock={() => commit(finishActiveSock(session))}
        onStartSock2={() => commit(switchToSock2(session))}
      />
    );
  } else {
    screen = (
      <HomeView
        sessions={sessions}
        notices={notices}
        onDismissNotice={dismiss}
        onNew={() => setView({ name: "new" })}
        onOpen={(id) => setView({ name: "knit", sessionId: id })}
      />
    );
  }

  return (
    <>
      {saveFailed && <SaveFailedNotice />}
      {screen}
    </>
  );
}

function HomeView({
  sessions,
  notices,
  onDismissNotice,
  onNew,
  onOpen,
}: {
  sessions: PairSession[];
  notices: UnreadableNotice[];
  onDismissNotice: (key: string) => void;
  onNew: () => void;
  onOpen: (id: string) => void;
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
      {notices.map((notice) => (
        <UnreadableDataNotice
          key={notice.key}
          notice={notice}
          onDismiss={() => onDismissNotice(notice.key)}
        />
      ))}
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
            const title = sizeTitle(s);
            return (
              <li key={s.id} style={{ marginBottom: "0.75rem" }}>
                <Button variant="secondary" fullWidth onClick={() => onOpen(s.id)}>
                  <span style={{ textAlign: "left", display: "block" }}>
                    <strong>
                      {title.size} <small>{title.detail}</small>
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
  const [pairLabel, setPairLabel] = useState(OFFERED_PAIRS[0] ?? "");
  const pair = useMemo(() => sizePair(pairLabel), [pairLabel]);
  const plan = useMemo(() => materializePlan(REGIA_4_FAEDIG_PATTERN, pair), [pair]);

  return (
    <main style={shell}>
      <h1>Neue Socke</h1>
      <p>
        Muster: <strong>REGIA 4-fädig</strong> · ein Paar (2 Socken)
      </p>
      <label htmlFor="size" style={{ fontSize: "1.15rem" }}>
        Größe:{" "}
        <select
          id="size"
          value={pairLabel}
          onChange={(e) => setPairLabel(e.target.value)}
          style={{ fontSize: "1.15rem", padding: "0.35rem" }}
        >
          {OFFERED_PAIRS.map((label) => (
            <option key={label} value={label}>
              {label} · {sizePair(label).construction.castOnTotal} Maschen
            </option>
          ))}
        </select>
      </label>
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <Button
          onClick={() =>
            onCreate(
              createPairSession({
                userId: DEMO_USER,
                pattern: REGIA_4_FAEDIG_PATTERN,
                pair,
                plan,
              })
            )
          }
        >
          Starten
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Zurück
        </Button>
      </div>
      <h2>Strickplan {plan.sizeLabel}</h2>
      <PlanList plan={plan} />
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
  const title = sizeTitle(session);

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
        Größe {title.size} <small style={{ fontWeight: "normal" }}>{title.detail}</small>
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
                      : step.stepKey === "reduceToCastOn" &&
                          step.unit === "rounds" &&
                          step.displayValue
                        ? reduceLine(step.targetCount, step.displayValue)
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

/** Every step of a plan with its count, shown before "Starten" (FR-006). */
function PlanList({ plan }: { plan: SteppedPlan }) {
  const c = plan.construction;
  return (
    <ol style={{ paddingLeft: "1.25rem" }}>
      {plan.steps.map((step) => (
        <li key={step.stepKey} style={{ marginBottom: "0.75rem" }}>
          <strong>{STEP_LABELS[step.stepKey]}</strong>
          <div>
            {step.stepKey === "castOn"
              ? `${c.castOnTotal} Maschen (${plan.needleCount} Nadeln = ${c.castOnPerNeedle2} / Nadel)`
              : step.stepKey === "split"
                ? fmtHeelSplit(c.heelSplit)
                : step.stepKey === "pickup"
                  ? `${c.pickupStitchesBothSides} Maschen aufnehmen`
                  : step.stepKey === "reduceToCastOn"
                    ? reduceLine(step.targetCount, c.castOnTotal)
                    : countLineForStep(step.stepKey, step.targetCount, step.unit, step.stitch)}
          </div>
          {step.techniqueNoteKey ? (
            <div>
              <em>{TECHNIQUE_NOTES[step.techniqueNoteKey]}</em>
            </div>
          ) : null}
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
  );
}

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
