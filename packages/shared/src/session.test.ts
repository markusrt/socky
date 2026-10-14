import { describe, expect, it } from "vitest";
import { mustActualSize, REGIA_4_FAEDIG_PATTERN } from "./fixtures/pattern-seed";
import {
  canSwitchToSock2,
  createPairSession,
  currentStep,
  finishActiveSock,
  heelRowPolarity,
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
    actualSize: mustActualSize("size-18"),
  });
}

describe("sequential pair session (one sock at a time)", () => {
  it("starts with castOn on sock 1", () => {
    const s = newSession();
    expect(s.activeSock).toBe(1);
    expect(currentStep(s)?.stepKey).toBe("castOn");
    expect(currentStep(s)?.displayValue).toContain("44");
    expect(canSwitchToSock2(s)).toBe(false);
  });

  it("auto-advances to the next step when the current step is full", () => {
    let s = newSession();
    // castOn (1) → cuff (25)
    s = tickActiveSock(s);
    expect(currentStep(s)?.stepKey).toBe("cuff");
    for (let i = 0; i < 25; i++) {
      s = tickActiveSock(s);
    }
    expect(currentStep(s)?.stepKey).toBe("leg");
  });

  it("expands tip into one row per rechts/Abnahme", () => {
    const s = newSession();
    const tipRows = s.steps.filter((x) => x.stepKey === "tip");
    // 22/23: R1 times1 (2 knit + 1 dec) = 3; R2 times3 (1+1) = 6 → 9
    expect(tipRows.length).toBe(9);
    expect(tipRows[0]?.tipRowLabel).toBe("rechts");
    expect(tipRows[1]?.tipRowLabel).toBe("rechts");
    expect(tipRows[2]?.tipRowLabel).toBe("Abnahme");
    expect(tipRows[3]?.tipRowLabel).toBe("rechts");
    expect(tipRows[4]?.tipRowLabel).toBe("Abnahme");
    expect(tipRows[2]?.tipDirection).toBe("decrease");
  });

  it("castOn, split, pickup and reduceToCastOn carry chart values", () => {
    const s = newSession();
    const castOn = s.steps.find((x) => x.stepKey === "castOn");
    const split = s.steps.find((x) => x.stepKey === "split");
    const pickup = s.steps.find((x) => x.stepKey === "pickup");
    const reduce = s.steps.find((x) => x.stepKey === "reduceToCastOn");
    expect(castOn?.displayValue).toContain("44");
    expect(castOn?.displayValue).toContain("22");
    expect(split?.displayValue).toBe("7-8-7");
    expect(pickup?.displayValue).toBe("11");
    expect(reduce?.displayValue).toBe("44");
  });

  it("heel rows alternate knit/purl polarity", () => {
    expect(heelRowPolarity(1)).toBe("knit");
    expect(heelRowPolarity(2)).toBe("purl");
    expect(heelRowPolarity(3)).toBe("knit");
    expect(heelRowPolarity(20)).toBe("purl");
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
    expect(currentStep(s)?.stepKey).toBe("castOn");
  });

  it("undo walks back across steps when current step is at 0", () => {
    let s = newSession();
    s = tickActiveSock(s); // castOn done → cuff
    for (let i = 0; i < 25; i++) {
      s = tickActiveSock(s);
    }
    expect(currentStep(s)?.stepKey).toBe("leg");
    s = untickActiveSock(s);
    expect(currentStep(s)?.stepKey).toBe("cuff");
    expect(currentStep(s)?.sock1Done).toBe(24);
  });

  it("close step uses finishActiveSock (Socke fertig)", () => {
    let s = newSession();
    while (!isSockComplete(s, 1)) {
      const step = currentStep(s);
      if (!step) break;
      if (isCloseStep(step)) break;
      for (let i = 0; i < step.targetCount; i++) {
        s = tickActiveSock(s);
      }
    }
    expect(currentStep(s)?.stepKey).toBe("close");
    s = finishActiveSock(s);
    expect(isSockComplete(s, 1)).toBe(true);
    expect(s.activeSock).toBe(2);
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
