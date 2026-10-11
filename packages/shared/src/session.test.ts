import { describe, expect, it } from "vitest";
import { REGIA_4_FAEDIG_PATTERN, mustActualSize } from "./fixtures/pattern-seed";
import {
  completeCurrentStep,
  createPairSession,
  currentStep,
  isPairStepFinished,
  switchActiveSock,
  tickActiveSock,
  untickActiveSock,
} from "./session";

function newSession() {
  return createPairSession({
    userId: "u1",
    pattern: REGIA_4_FAEDIG_PATTERN,
    actualSize: mustActualSize("sock-03"),
  });
}

describe("pair session knitting loop", () => {
  it("starts at cuff with zero progress on both socks", () => {
    const s = newSession();
    expect(s.status).toBe("ACTIVE");
    expect(s.activeSock).toBe(1);
    expect(s.steps[0]?.stepKey).toBe("cuff");
    expect(s.steps[0]?.sock1Done).toBe(0);
    expect(s.steps[0]?.sock2Done).toBe(0);
    expect(currentStep(s)?.targetCount).toBe(40);
  });

  it("tickActiveSock only advances the active sock and clamps", () => {
    let s = newSession();
    s = tickActiveSock(s);
    expect(currentStep(s)?.sock1Done).toBe(1);
    expect(currentStep(s)?.sock2Done).toBe(0);

    s = switchActiveSock(s);
    s = tickActiveSock(s);
    s = tickActiveSock(s);
    expect(currentStep(s)?.sock1Done).toBe(1);
    expect(currentStep(s)?.sock2Done).toBe(2);

    s = untickActiveSock(s);
    expect(currentStep(s)?.sock2Done).toBe(1);
    s = untickActiveSock(s);
    s = untickActiveSock(s);
    expect(currentStep(s)?.sock2Done).toBe(0);
  });

  it("advances when both socks complete a step (manual complete)", () => {
    let s = newSession();
    const target = currentStep(s)?.targetCount ?? 0;
    for (let i = 0; i < target; i++) {
      s = tickActiveSock(s);
    }
    expect(currentStep(s)?.stepKey).toBe("cuff");
    s = switchActiveSock(s);
    for (let i = 0; i < target; i++) {
      s = tickActiveSock(s);
    }
    expect(currentStep(s)?.stepKey).toBe("leg");
  });

  it("completeCurrentStep fills both socks and marks DONE at end", () => {
    let s = newSession();
    s = completeCurrentStep(s);
    expect(s.steps[0]).toMatchObject({ sock1Done: 40, sock2Done: 40 });
    expect(currentStep(s)?.stepKey).toBe("leg");
    expect(s.steps[0] && isPairStepFinished(s.steps[0])).toBe(true);

    // finish all remaining steps
    while (currentStep(s)) {
      s = completeCurrentStep(s);
    }
    expect(s.status).toBe("DONE");
  });
});
