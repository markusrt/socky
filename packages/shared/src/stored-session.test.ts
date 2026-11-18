import { describe, expect, it } from "vitest";
import { mustActualSize, REGIA_4_FAEDIG_PATTERN } from "./fixtures/pattern-seed";
import { createPairSession, tickActiveSock } from "./session";
import { isReadablePairSession } from "./stored-session";

function freshSession() {
  return createPairSession({
    userId: "local",
    pattern: REGIA_4_FAEDIG_PATTERN,
    actualSize: mustActualSize("size-18"),
  });
}

describe("isReadablePairSession", () => {
  it("accepts a freshly created and a ticked session", () => {
    const session = freshSession();
    expect(isReadablePairSession(session)).toBe(true);
    expect(isReadablePairSession(tickActiveSock(session))).toBe(true);
  });

  it("accepts unknown extra fields (a newer app version may add them)", () => {
    expect(isReadablePairSession({ ...freshSession(), futureField: { a: 1 } })).toBe(true);
  });

  it.each([
    ["null", null],
    ["a string", "session"],
    ["an empty object", {}],
    ["no id", { ...freshSession(), id: "" }],
    ["no steps", { ...freshSession(), steps: [] }],
    ["unknown status", { ...freshSession(), status: "PAUSED" }],
    ["activeSock 3", { ...freshSession(), activeSock: 3 }],
  ])("rejects %s", (_name, value) => {
    expect(isReadablePairSession(value)).toBe(false);
  });

  it("rejects a step with an unknown step key or a negative count", () => {
    const session = freshSession();
    const [first, ...rest] = session.steps;
    expect(
      isReadablePairSession({ ...session, steps: [{ ...first, stepKey: "toe" }, ...rest] })
    ).toBe(false);
    expect(
      isReadablePairSession({ ...session, steps: [{ ...first, sock1Done: -1 }, ...rest] })
    ).toBe(false);
  });
});
