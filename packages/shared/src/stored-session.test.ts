import { describe, expect, expectTypeOf, it } from "vitest";
import type { z } from "zod";
import type { PairSessionStatus, StepKey, StepUnit, TipRowDirection } from "./domain";
import { ACTUAL_SIZES, mustActualSize, REGIA_4_FAEDIG_PATTERN } from "./fixtures/pattern-seed";
import {
  createPairSession,
  currentStep,
  finishActiveSock,
  switchToSock2,
  tickActiveSock,
} from "./session";
import { isReadablePairSession, type storedPairSessionSchema } from "./stored-session";

type Stored = z.infer<typeof storedPairSessionSchema>;
type StoredStep = Stored["steps"][number];

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

describe("schema stays in sync with the domain types", () => {
  it("enums match exactly (a new StepKey must be added to the schema)", () => {
    expectTypeOf<StoredStep["stepKey"]>().toEqualTypeOf<StepKey>();
    expectTypeOf<StoredStep["unit"]>().toEqualTypeOf<StepUnit>();
    expectTypeOf<Stored["status"]>().toEqualTypeOf<PairSessionStatus>();
    expectTypeOf<Stored["activeSock"]>().toEqualTypeOf<1 | 2>();
    expectTypeOf<NonNullable<StoredStep["tipDirection"]>>().toEqualTypeOf<TipRowDirection>();
  });

  it.each(ACTUAL_SIZES.map((size) => [size.id, size] as const))(
    "%s stays readable through a whole pair (stored as JSON)",
    (_id, actualSize) => {
      let session = createPairSession({
        userId: "local",
        pattern: REGIA_4_FAEDIG_PATTERN,
        actualSize,
      });
      for (let i = 0; i < 2000 && session.status !== "DONE"; i++) {
        const step = currentStep(session);
        if (!step) break;
        if (step.stepKey === "close") {
          session = finishActiveSock(session);
          if (session.activeSock === 1 && session.status !== "DONE")
            session = switchToSock2(session);
        } else {
          session = tickActiveSock(session);
        }
        expect(isReadablePairSession(JSON.parse(JSON.stringify(session)))).toBe(true);
      }
      expect(session.status).toBe("DONE");
    }
  );
});
