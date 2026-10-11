import type {
  ActualSizeConfig,
  PairSession,
  Pattern,
  SessionStepProgress,
  SteppedPlan,
  TipRound,
  TipRowDirection,
} from "./domain";
import { materializePlan } from "./materialize";

/**
 * Pair session: two socks knitted **one after the other** (not in parallel).
 * Sock 1 runs through all steps first; only then sock 2 starts.
 *
 * Tip (Bandspitze) is expanded into one session step per knit/decrease row
 * so “Reihe fertig” walks every row and loop.
 */
export function createPairSession(input: {
  userId: string;
  pattern: Pattern;
  actualSize: ActualSizeConfig;
  plan?: SteppedPlan;
}): PairSession {
  const plan = input.plan ?? materializePlan(input.pattern, input.actualSize);
  const steps: SessionStepProgress[] = [];
  let sortIndex = 0;

  for (const step of plan.steps) {
    if (step.stepKey === "tip" && step.tipRounds?.length) {
      for (const row of expandTipRows(step.tipRounds, sortIndex)) {
        steps.push(row);
        sortIndex += 1;
      }
      continue;
    }

    let displayValue: string | undefined;
    if (step.stepKey === "castOn") {
      displayValue = `${plan.chart.castOnTotal} Maschen (${plan.needleCount} Nadeln = ${plan.chart.castOnPerNeedle2} / Nadel)`;
    } else if (step.stepKey === "split") {
      displayValue = `${plan.chart.heelSplit[0]}-${plan.chart.heelSplit[1]}-${plan.chart.heelSplit[2]}`;
    } else if (step.stepKey === "pickup") {
      displayValue = String(plan.chart.pickupStitchesBothSides);
    } else if (step.stepKey === "reduceToCastOn") {
      displayValue = String(plan.chart.castOnTotal);
    }

    steps.push({
      stepKey: step.stepKey,
      sortIndex,
      titleKey: step.titleKey,
      ...(step.techniqueNoteKey !== undefined ? { techniqueNoteKey: step.techniqueNoteKey } : {}),
      unit: step.unit,
      targetCount: step.targetCount,
      ...(displayValue !== undefined ? { displayValue } : {}),
      ...(step.tipRounds ? { tipRounds: step.tipRounds } : {}),
      sock1Done: 0,
      sock2Done: 0,
    });
    sortIndex += 1;
  }

  return {
    id: `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId,
    patternId: plan.patternId,
    chartSizeLabel: plan.chartSizeLabel,
    actualSizeLabel: plan.actualSizeLabel,
    status: "ACTIVE",
    steps,
    activeSock: 1,
    createdAt: new Date().toISOString(),
  };
}

function tipRowLabel(kind: "knit" | "decrease"): string {
  return kind === "knit" ? "rechts" : "Abnahme";
}

/**
 * Flatten tip rounds into one tickable row per single rechts/Abnahme.
 * e.g. knit count 2 + decrease 1, times 2 →
 * rechts, rechts, Abnahme, rechts, rechts, Abnahme.
 */
export function expandTipRows(
  tipRounds: TipRound[],
  startSortIndex: number
): SessionStepProgress[] {
  const rows: SessionStepProgress[] = [];
  let sortIndex = startSortIndex;

  for (const round of tipRounds) {
    for (let time = 0; time < round.times; time++) {
      for (const segment of round.unitSegments) {
        for (let n = 0; n < segment.count; n++) {
          rows.push({
            stepKey: "tip",
            sortIndex,
            titleKey: "step.tip",
            unit: "rows",
            targetCount: 1,
            tipRoundIndex: round.index,
            tipRoundTitle: round.title,
            tipRowLabel: tipRowLabel(segment.kind),
            tipDirection: segment.kind,
            sock1Done: 0,
            sock2Done: 0,
          });
          sortIndex += 1;
        }
      }
    }
  }

  return rows;
}

function sockDoneCount(step: SessionStepProgress, sock: 1 | 2): number {
  return sock === 1 ? step.sock1Done : step.sock2Done;
}

function withSockDone(step: SessionStepProgress, sock: 1 | 2, done: number): SessionStepProgress {
  return sock === 1 ? { ...step, sock1Done: done } : { ...step, sock2Done: done };
}

/** First incomplete step for one sock (sequential). */
export function currentStepIndexForSock(session: PairSession, sock: 1 | 2): number {
  return session.steps.findIndex((s) => sockDoneCount(s, sock) < s.targetCount);
}

export function isSockComplete(session: PairSession, sock: 1 | 2): boolean {
  return currentStepIndexForSock(session, sock) < 0;
}

export function canSwitchToSock2(session: PairSession): boolean {
  return isSockComplete(session, 1);
}

export function currentStepIndex(session: PairSession): number {
  return currentStepIndexForSock(session, session.activeSock);
}

export function currentStep(session: PairSession): SessionStepProgress | undefined {
  const index = currentStepIndex(session);
  return index >= 0 ? session.steps[index] : undefined;
}

/**
 * One finished unit on the active sock (row, tip row, or once/finish step).
 * Auto-advances when the step is full.
 */
export function tickActiveSock(session: PairSession): PairSession {
  const sock = session.activeSock;
  const index = currentStepIndexForSock(session, sock);
  if (index < 0) return session;

  const step = session.steps[index];
  if (!step) return session;

  const nextDone = Math.min(step.targetCount, sockDoneCount(step, sock) + 1);
  const steps = session.steps.map((s, i) => (i === index ? withSockDone(s, sock, nextDone) : s));

  let next = finishIfDone({ ...session, steps });
  if (sock === 1 && isSockComplete(next, 1) && !isSockComplete(next, 2)) {
    next = { ...next, activeSock: 2 };
  }
  return next;
}

/**
 * Undo one tick on the active sock.
 * If the current step is already at 0, move back to the previous step.
 */
export function untickActiveSock(session: PairSession): PairSession {
  const sock = session.activeSock;
  let index = currentStepIndexForSock(session, sock);

  if (index >= 0) {
    const step = session.steps[index];
    if (step && sockDoneCount(step, sock) === 0 && index > 0) {
      index = index - 1;
    }
  } else {
    index = session.steps.length - 1;
  }

  if (index < 0) return session;
  const step = session.steps[index];
  if (!step) return session;

  const nextDone = Math.max(0, sockDoneCount(step, sock) - 1);
  const steps = session.steps.map((s, i) => (i === index ? withSockDone(s, sock, nextDone) : s));

  let next = finishIfDone({ ...session, steps });
  if (sock === 1 && isSockComplete(next, 1) && !isSockComplete(next, 2)) {
    next = { ...next, activeSock: 2 };
  }
  return next;
}

/** Switch to sock 2 only after sock 1 is complete. */
export function switchToSock2(session: PairSession): PairSession {
  if (!canSwitchToSock2(session)) return session;
  return { ...session, activeSock: 2 };
}

/** Mark active sock finished on the close step. */
export function finishActiveSock(session: PairSession): PairSession {
  const sock = session.activeSock;
  const index = currentStepIndexForSock(session, sock);
  if (index < 0) return session;

  const step = session.steps[index];
  if (!step || step.stepKey !== "close") return session;

  const steps = session.steps.map((s, i) =>
    i === index ? withSockDone(s, sock, s.targetCount) : s
  );
  let next = finishIfDone({ ...session, steps });

  if (sock === 1 && isSockComplete(next, 1) && !isSockComplete(next, 2)) {
    next = { ...next, activeSock: 2 };
  }
  return next;
}

function finishIfDone(session: PairSession): PairSession {
  const remaining = session.steps.some(
    (s) => s.sock1Done < s.targetCount || s.sock2Done < s.targetCount
  );
  return {
    ...session,
    status: remaining ? session.status : "DONE",
  };
}

export function isPairStepFinished(step: SessionStepProgress): boolean {
  return step.sock1Done >= step.targetCount && step.sock2Done >= step.targetCount;
}

export function isCloseStep(step: SessionStepProgress): boolean {
  return step.stepKey === "close";
}

/**
 * Heel cap rows alternate: odd = rechts (knit), even = links (purl).
 * `rowNumber` is 1-based (next row to knit = sockDone + 1).
 */
export function heelRowPolarity(rowNumber: number): "knit" | "purl" {
  return rowNumber % 2 === 1 ? "knit" : "purl";
}

/** Tip progress summary for UI: round i of n and row within the round. */
export function tipProgressSummary(
  session: PairSession,
  step: SessionStepProgress
): { roundIndex: number; totalRounds: number; rowInRound: number; rowsInRound: number } {
  const tipSteps = session.steps.filter((s) => s.stepKey === "tip");
  const totalRounds = new Set(tipSteps.map((s) => s.tipRoundIndex ?? 0)).size || 1;
  const roundIndex = step.tipRoundIndex ?? 1;
  const rowsInRound = tipSteps.filter((s) => s.tipRoundIndex === roundIndex).length;
  const rowInRound =
    tipSteps.filter((s) => s.tipRoundIndex === roundIndex).findIndex((s) => s === step) + 1;
  return {
    roundIndex,
    totalRounds,
    rowInRound: Math.max(rowInRound, 1),
    rowsInRound: Math.max(rowsInRound, 1),
  };
}
