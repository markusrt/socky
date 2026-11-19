import {
  currentStep,
  isCloseStep,
  type PairSession,
  STEP_LABELS,
  TECHNIQUE_NOTES,
  tickActiveSock,
} from "@socky/shared";
import { beforeEach, describe, expect, it } from "vitest";
import {
  dismissUnreadable,
  loadSessions,
  loadStorage,
  requestPersistentStorage,
  UNREADABLE_PREFIX,
  type UnreadableCopy,
  upsertSession,
} from "./storage";
import fixture from "./storage-fixtures/sessions-v1.json";
import damagedFixture from "./storage-fixtures/sessions-v1-damaged.json";
import copyFixture from "./storage-fixtures/unreadable-copy-v1.json";

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

/* ------------------------------------------------------------------------
 * 001-storage-safety (ADR 0006): unreadable data is preserved, never
 * overwritten; damaged pairs never hide readable ones; failed saves report.
 * ---------------------------------------------------------------------- */

/** Storage whose writes fail for keys matching `failWrites`. */
class FlakyStorage extends MemoryStorage {
  constructor(public failWrites: (key: string) => boolean = () => true) {
    super();
  }
  override setItem(key: string, value: string) {
    if (this.failWrites(key)) throw new DOMException("full", "QuotaExceededError");
    super.setItem(key, value);
  }
}

function useStorage(storage: Storage, live?: string) {
  if (live !== undefined) storage.setItem(LIVE_KEY, live);
  Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
  return storage;
}

function copies(storage: Storage): UnreadableCopy[] {
  const result: UnreadableCopy[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith(UNREADABLE_PREFIX)) result.push(JSON.parse(storage.getItem(key) ?? ""));
  }
  return result;
}

const [firstStored] = fixture as unknown as [PairSession];

describe("today's stored format stays quiet", () => {
  it("loads the frozen fixture with no notice and no preserved copy", () => {
    const result = loadStorage();
    expect(result.sessions).toEqual(fixture);
    expect(result.notices).toEqual([]);
    expect(result.writeBlocked).toBe(false);
    expect(copies(localStorage)).toEqual([]);
  });

  it("an empty store starts empty with no notice", () => {
    useStorage(new MemoryStorage());
    expect(loadStorage()).toEqual({ sessions: [], notices: [], writeBlocked: false });
  });
});

describe("unreadable stored data (US1)", () => {
  it.each([
    ["cut-off text", RAW.slice(0, 200)],
    ["not a list", JSON.stringify({ sessions: fixture })],
    ["unknown shape", JSON.stringify("hello")],
  ])("%s: preserved byte for byte, notice shown, never overwritten", (_name, raw) => {
    const storage = useStorage(new MemoryStorage(), raw);

    const loaded = loadStorage();
    expect(loaded.sessions).toEqual([]);
    expect(loaded.writeBlocked).toBe(false);
    expect(loaded.notices).toHaveLength(1);
    expect(loaded.notices[0]).toMatchObject({ raw, damagedCount: null, dismissed: false });

    // She starts a new pair and counts: the original text survives.
    const { save } = upsertSession(tickActiveSock(firstStored));
    expect(save).toEqual({ ok: true });
    expect(copies(storage).map((c) => c.raw)).toEqual([raw]);
    expect(loadSessions().map((s) => s.id)).toEqual([firstStored.id]);
  });

  it("loading twice keeps one copy; a new damage keeps both", () => {
    const storage = useStorage(new MemoryStorage(), "{broken");
    loadStorage();
    loadStorage();
    expect(copies(storage)).toHaveLength(1);

    storage.setItem(LIVE_KEY, "{broken again");
    loadStorage();
    expect(
      copies(storage)
        .map((c) => c.raw)
        .sort()
    ).toEqual(["{broken", "{broken again"]);
  });

  it("blocks every save when the copy cannot be preserved", () => {
    const storage = useStorage(
      new FlakyStorage((key) => key.startsWith(UNREADABLE_PREFIX)),
      "{broken"
    );
    expect(loadStorage().writeBlocked).toBe(true);

    const [notice] = loadStorage().notices;
    expect(notice).toMatchObject({ raw: "{broken", damagedCount: null, dismissed: false });

    const { sessions, save } = upsertSession(firstStored);
    expect(save).toEqual({ ok: false });
    expect(sessions.map((s) => s.id)).toEqual([firstStored.id]);
    expect(storage.getItem(LIVE_KEY)).toBe("{broken");
  });

  it("dismissing hides the notice and deletes nothing", () => {
    const storage = useStorage(new MemoryStorage(), "{broken");
    const [notice] = loadStorage().notices;
    if (!notice) throw new Error("expected a notice");

    dismissUnreadable(notice.key);

    expect(loadStorage().notices).toEqual([]);
    expect(copies(storage)).toEqual([{ ...copyOf(notice), dismissed: true }]);
  });

  it("reads the frozen preserved-copy format", () => {
    const storage = useStorage(new MemoryStorage());
    storage.setItem(`${UNREADABLE_PREFIX}${copyFixture.foundAt}`, JSON.stringify(copyFixture));
    expect(loadStorage().notices).toEqual([
      { ...copyFixture, key: `${UNREADABLE_PREFIX}${copyFixture.foundAt}` },
    ]);
  });
});

function copyOf({ key: _key, ...copy }: UnreadableCopy & { key: string }): UnreadableCopy {
  return copy;
}

describe("damaged pairs among readable ones (US2)", () => {
  it("shows readable pairs unchanged and counts the damaged one", () => {
    const raw = JSON.stringify(damagedFixture);
    const storage = useStorage(new MemoryStorage(), raw);

    const loaded = loadStorage();
    expect(loaded.sessions).toEqual([damagedFixture[0], damagedFixture[2]]);
    expect(loaded.notices[0]).toMatchObject({ raw, damagedCount: 1, totalCount: 3 });

    upsertSession(tickActiveSock(loaded.sessions[0] as PairSession));
    expect(copies(storage).map((c) => c.raw)).toEqual([raw]);
    expect(currentStep(loadSessions()[0] as PairSession)?.sock1Done).toBe(21);
  });
});

describe("failed saves (US3)", () => {
  it("reports a failed save and keeps the change in the returned list", () => {
    const storage = useStorage(new FlakyStorage(() => false), RAW);
    (storage as FlakyStorage).failWrites = () => true;

    const ticked = tickActiveSock(firstStored);
    const { sessions, save } = upsertSession(ticked);
    expect(save).toEqual({ ok: false });
    expect(sessions[0]).toEqual(ticked);
    expect(storage.getItem(LIVE_KEY)).toBe(RAW);

    (storage as FlakyStorage).failWrites = () => false;
    expect(upsertSession(ticked).save).toEqual({ ok: true });
  });

  it("keeps every on-screen pair when saves fail and another pair is counted", () => {
    const storage = useStorage(new FlakyStorage(() => false), RAW) as FlakyStorage;
    storage.failWrites = () => true;
    let screen = loadSessions();
    const [foot, tip] = screen as [PairSession, PairSession];

    const footTicked = tickActiveSock(tickActiveSock(foot));
    screen = upsertSession(footTicked, screen).sessions;
    screen = upsertSession(tickActiveSock(tip), screen).sessions;
    expect(screen.find((s) => s.id === foot.id)).toEqual(footTicked);

    storage.failWrites = () => false;
    upsertSession(tickActiveSock(tip), screen);
    expect(currentStep(loadSessions()[0] as PairSession)?.sock1Done).toBe(22);
  });

  it("blocks saves when storage cannot be read at all", () => {
    const storage = useStorage(new MemoryStorage());
    storage.getItem = () => {
      throw new DOMException("blocked", "SecurityError");
    };
    expect(loadStorage()).toEqual({ sessions: [], notices: [], writeBlocked: true });
    expect(upsertSession(firstStored).save).toEqual({ ok: false });
  });
});

describe("persistent storage request (US4)", () => {
  it("asks once and tolerates refusal or absence", async () => {
    let asked = 0;
    requestPersistentStorage({
      persist: () => {
        asked++;
        return Promise.reject(new Error("refused"));
      },
    });
    expect(asked).toBe(1);
    expect(() => requestPersistentStorage(undefined)).not.toThrow();
    await Promise.resolve();
  });
});
