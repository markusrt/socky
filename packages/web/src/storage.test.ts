import {
  currentStep,
  isCloseStep,
  type PairSession,
  STEP_LABELS,
  TECHNIQUE_NOTES,
  tickActiveSock,
} from "@socky/shared";
import { beforeEach, describe, expect, it } from "vitest";
import { loadSessions, upsertSession } from "./storage";
import fixture from "./storage-fixtures/sessions-v1.json";

/**
 * Data-safety regression (ADR 0004): the live app stores the knitter's
 * progress under this exact key on markusrt.github.io. The fixture is a
 * FROZEN snapshot of that stored format (generated 2026-11-14 from the
 * shared code at that time). Never regenerate or edit it to make a test
 * pass — a failure here means a change would break her stored sessions.
 */
const LIVE_KEY = "Socky.sessions.v1";
const RAW = JSON.stringify(fixture);

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

beforeEach(() => {
  const storage = new MemoryStorage();
  storage.setItem(LIVE_KEY, RAW);
  Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
});

describe("stored sessions v1 (live format)", () => {
  it("loads every stored session unchanged from the live key", () => {
    expect(loadSessions()).toEqual(fixture);
  });

  it("every stored step still has a German label and known technique note", () => {
    for (const session of loadSessions()) {
      for (const step of session.steps) {
        expect(STEP_LABELS[step.stepKey], step.stepKey).toBeTypeOf("string");
        if (step.techniqueNoteKey !== undefined) {
          expect(TECHNIQUE_NOTES[step.techniqueNoteKey], step.techniqueNoteKey).toBeTypeOf(
            "string"
          );
        }
      }
    }
  });

  it("resumes each session at the step she left off", () => {
    const [foot, tip, done] = loadSessions() as [PairSession, PairSession, PairSession];
    expect(currentStep(foot)).toMatchObject({ stepKey: "plainFoot", sock1Done: 20 });
    expect(foot.activeSock).toBe(1);
    expect(currentStep(tip)).toMatchObject({ stepKey: "tip", tipRowLabel: "Abnahme" });
    expect(tip.activeSock).toBe(2);
    expect(done.status).toBe("DONE");
    expect(currentStep(done)).toBeUndefined();
  });

  it("a tap on a stored session saves without touching the other sessions", () => {
    const [foot, ...others] = loadSessions() as [PairSession, ...PairSession[]];
    const step = currentStep(foot);
    expect(step && isCloseStep(step)).toBe(false);

    upsertSession(tickActiveSock(foot));

    const [savedFoot, ...savedOthers] = loadSessions() as [PairSession, ...PairSession[]];
    expect(currentStep(savedFoot)?.sock1Done).toBe(21);
    expect(savedOthers).toEqual(others);
  });
});
