import { describe, expect, it } from "vitest";
import { REGIA_4_FAEDIG_PATTERN, mustActualSize } from "./fixtures/pattern-seed";
import {
  canSwitchToSock2,
  createPairSession,
  currentStep,
  finishActiveSock,
  isCloseStep,
  isSockComplete,
  switchToSock2,
  tickActiveSock,
  untickActiveSock,
} from "./session";

function newSession() {
  return createPairSession({
    userId: "u1",
    pattern: REGIA_4_FAEDIG_PATTERN,
    actualSize: mustActualSize("sock-02"),
  });
}

describe("sequential pair session (one sock at a time)", () => {
  it("starts on sock 1 at the first step", () => {
    const s = newSession();
    expect(s.activeSock).toBe(1);
    expect(currentStep(s)?.stepKey).toBe("cuff");
    expect(currentStep(s)?.targetCount).toBe(25);
    expect(canSwitchToSock2(s)).toBe(false);
  });

  it("auto-advances to the next step when the current step is full", () => {
    let s = newSession();
    for (let i = 0; i < 25; i++) {
      s = tickActiveSock(s);
    }
    expect(currentStep(s)?.stepKey).toBe("leg");
    expect(currentStep(s)?.targetCount).toBe(5);
    expect(s.activeSock).toBe(1);
  });

  it("cannot switch to sock 2 before sock 1 finished all steps", () => {
    let s = newSession();
    s = switchToSock2(s);
    expect(s.activeSock).toBe(1);

    while (!isSockComplete(s, 1)) {
      const step = currentStep(s);
      if (!step) break;
      if (isCloseStep(step)) {
        s = finishActiveSock(s);
      } else {
        for (let i = 0; i < step.targetCount; i++) {
          s = tickActiveSock(s);
        }
      }
    }
    expect(isSockComplete(s, 1)).toBe(true);
    expect(canSwitchToSock2(s)).toBe(true);
    expect(s.activeSock).toBe(2);
    expect(currentStep(s)?.stepKey).toBe("cuff");
  });

  it("close step uses finishActiveSock (Socke fertig), not row ticks", () => {
    let s = newSession();
    while (!isSockComplete(s, 1)) {
      const step = currentStep(s);
      if (!step) break;
      if (isCloseStep(step)) break;
      for (let i = 0; i < step.targetCount; i++) {
        s = tickActiveSock(s);
      }
    }
    const close = currentStep(s);
    expect(close?.stepKey).toBe("close");
    expect(close && isCloseStep(close)).toBe(true);

    s = finishActiveSock(s);
    expect(isSockComplete(s, 1)).toBe(true);
    expect(s.activeSock).toBe(2);
  });

  it("undo walks back across steps when current step is at 0", () => {
    let s = newSession();
    for (let i = 0; i < 25; i++) {
      s = tickActiveSock(s);
    }
    // now on leg (0/5) after cuff finished — actually auto-advance leaves us on leg 0 after last tick of cuff
    // After 25 ticks cuff is full and we advanced to leg; last tick filled cuff so leg is 0.
    expect(currentStep(s)?.stepKey).toBe("leg");
    expect(currentStep(s)?.sock1Done).toBe(0);

    // undo at 0 goes to previous step (cuff 25 → 24)
    s = untickActiveSock(s);
    expect(currentStep(s)?.stepKey).toBe("cuff");
    expect(currentStep(s)?.sock1Done).toBe(24);
    expect(currentStep(s)?.targetCount).toBe(25);
  });

  it("marks session DONE after both socks closed", () => {
    let s = newSession();
    for (const sock of [1, 2] as const) {
      if (sock === 2) {
        expect(canSwitchToSock2(s)).toBe(true);
        s = switchToSock2(s);
      }
      while (!isSockComplete(s, sock)) {
        const step = currentStep(s);
        if (!step) break;
        if (isCloseStep(step)) {
          s = finishActiveSock(s);
        } else {
          for (let i = 0; i < step.targetCount; i++) {
            s = tickActiveSock(s);
          }
        }
      }
    }
    expect(s.status).toBe("DONE");
  });
});
