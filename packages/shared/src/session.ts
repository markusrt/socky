import type {
  ActualSizeConfig,
  PairSession,
  Pattern,
  SessionStepProgress,
  SteppedPlan,
} from "./domain";
import { materializePlan } from "./materialize";

/**
 * Pair session: two socks knitted **one after the other** (not in parallel).
 * Sock 1 runs through all steps first; only then sock 2 starts.
 */
export function createPairSession(input: {
  userId: string;
  pattern: Pattern;
  actualSize: ActualSizeConfig;
  plan?: SteppedPlan;
}): PairSession {
  const plan = input.plan ?? materializePlan(input.pattern, input.actualSize);
  const steps: SessionStepProgress[] = plan.steps.map((step) => ({
    stepKey: step.stepKey,
    sortIndex: step.sortIndex,
    titleKey: step.titleKey,
    ...(step.techniqueNoteKey !== undefined ? { techniqueNoteKey: step.techniqueNoteKey } : {}),
    unit: step.unit,
    targetCount: step.targetCount,
    ...(step.tipRounds ? { tipRounds: step.tipRounds } : {}),
    sock1Done: 0,
    sock2Done: 0,
  }));

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

/** Current step for the active sock (not the pair). */
export function currentStepIndex(session: PairSession): number {
  return currentStepIndexForSock(session, session.activeSock);
}

export function currentStep(session: PairSession): SessionStepProgress | undefined {
  const index = currentStepIndex(session);
  return index >= 0 ? session.steps[index] : undefined;
}

/**
 * One finished row on the active sock.
 * When the step target is reached, the session moves to the next step automatically.
 * After sock 1 finishes every step, active sock becomes 2.
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
 * If the current step is already at 0, move back to the previous step and
 * decrease it (so undo can walk through the whole plan).
 */
export function untickActiveSock(session: PairSession): PairSession {
  const sock = session.activeSock;
  let index = currentStepIndexForSock(session, sock);

  // Current step at 0 → fall back to previous incomplete-or-just-finished step.
  if (index >= 0) {
    const step = session.steps[index];
    if (step && sockDoneCount(step, sock) === 0 && index > 0) {
      index = index - 1;
    }
  } else {
    // Sock fully complete → undo last step.
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

/**
 * Switch to sock 2 only after sock 1 is complete.
 * Switching back to sock 1 is not offered (one sock at a time).
 */
export function switchToSock2(session: PairSession): PairSession {
  if (!canSwitchToSock2(session)) return session;
  return { ...session, activeSock: 2 };
}

/**
 * Mark the active sock finished (close/abketten step).
 * Only valid on a `close` step (unit "finish").
 */
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

/** True when this step is the final close (not a row-tick step). */
export function isCloseStep(step: SessionStepProgress): boolean {
  return step.stepKey === "close";
}
