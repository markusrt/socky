import type {
  ActualSizeConfig,
  PairSession,
  Pattern,
  SessionStepProgress,
  SteppedPlan,
} from "./domain";
import { materializePlan } from "./materialize";

/** Create a pair session (two socks) from a materialized plan. */
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

export function currentStepIndex(session: PairSession): number {
  return session.steps.findIndex((s) => s.sock1Done < s.targetCount || s.sock2Done < s.targetCount);
}

export function currentStep(session: PairSession): SessionStepProgress | undefined {
  const index = currentStepIndex(session);
  return index >= 0 ? session.steps[index] : undefined;
}

/** One finished row on the active sock of the pair. */
export function tickActiveSock(session: PairSession): PairSession {
  const index = currentStepIndex(session);
  if (index < 0) return session;

  const steps = session.steps.map((step, i) => {
    if (i !== index) return step;
    if (session.activeSock === 1) {
      return { ...step, sock1Done: Math.min(step.sock1Done + 1, step.targetCount) };
    }
    return { ...step, sock2Done: Math.min(step.sock2Done + 1, step.targetCount) };
  });

  return finishIfDone({ ...session, steps });
}

/** Undo one tick on the active sock. */
export function untickActiveSock(session: PairSession): PairSession {
  const index = currentStepIndex(session);
  if (index < 0) return session;

  const steps = session.steps.map((step, i) => {
    if (i !== index) return step;
    if (session.activeSock === 1) {
      return { ...step, sock1Done: Math.max(step.sock1Done - 1, 0) };
    }
    return { ...step, sock2Done: Math.max(step.sock2Done - 1, 0) };
  });

  return { ...session, steps };
}

export function switchActiveSock(session: PairSession): PairSession {
  return { ...session, activeSock: session.activeSock === 1 ? 2 : 1 };
}

/** Explicit “next step” when both socks finished the current step. */
export function completeCurrentStep(session: PairSession): PairSession {
  const index = currentStepIndex(session);
  if (index < 0) return session;
  const step = session.steps[index];
  if (!step) return session;

  const steps = session.steps.map((s, i) =>
    i === index ? { ...s, sock1Done: s.targetCount, sock2Done: s.targetCount } : s
  );
  return finishIfDone({ ...session, steps });
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
