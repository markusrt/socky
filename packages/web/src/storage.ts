import { isReadablePairSession, type PairSession } from "@socky/shared";

/**
 * Her progress lives only here (constitution amendment P4). Rules:
 * - Nothing writes STORAGE_KEY while its content is unreadable and not yet
 *   preserved under UNREADABLE_PREFIX (ADR 0006).
 * - Preserved copies are never deleted or replaced by the app.
 * - Stored pairs are checked, never rewritten field by field: the original
 *   objects are kept.
 */
const STORAGE_KEY = "Socky.sessions.v1";
export const UNREADABLE_PREFIX = "Socky.unreadable.v1.";

/** A preserved copy of stored text the app could not fully read. */
export interface UnreadableCopy {
  foundAt: string;
  /** Exact original text of STORAGE_KEY. */
  raw: string;
  /** Damaged pairs; null when nothing at all could be read. */
  damagedCount: number | null;
  totalCount: number | null;
  dismissed: boolean;
}

export interface UnreadableNotice extends UnreadableCopy {
  /** Storage key of the preserved copy (not stored inside the copy). */
  key: string;
}

export interface LoadResult {
  sessions: PairSession[];
  /** Undismissed preserved copies, oldest first. */
  notices: UnreadableNotice[];
  /** True when unreadable data could not be preserved: never save then. */
  writeBlocked: boolean;
}

export type SaveResult = { ok: true } | { ok: false };

interface ParsedStore {
  sessions: PairSession[];
  /** null: fully readable; otherwise counts for the preserved copy. */
  damage: { damagedCount: number | null; totalCount: number | null } | null;
}

function parseStore(raw: string | null): ParsedStore {
  if (raw === null || raw === "") return { sessions: [], damage: null };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { sessions: [], damage: { damagedCount: null, totalCount: null } };
  }
  if (!Array.isArray(parsed)) {
    return { sessions: [], damage: { damagedCount: null, totalCount: null } };
  }
  const sessions = parsed.filter(isReadablePairSession);
  const damagedCount = parsed.length - sessions.length;
  return {
    sessions,
    damage: damagedCount > 0 ? { damagedCount, totalCount: parsed.length } : null,
  };
}

function isUnreadableCopy(value: unknown): value is UnreadableCopy {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.foundAt === "string" && typeof v.raw === "string";
}

function readCopies(): UnreadableNotice[] {
  const copies: UnreadableNotice[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === null || !key.startsWith(UNREADABLE_PREFIX)) continue;
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) ?? "");
      if (isUnreadableCopy(value)) copies.push({ ...value, key });
    } catch {
      // A damaged copy is left alone (never deleted) and not shown.
    }
  }
  return copies.sort((a, b) => a.foundAt.localeCompare(b.foundAt));
}

/** Store an exact copy of `raw` unless an identical copy already exists. */
function preserve(raw: string, damage: NonNullable<ParsedStore["damage"]>): boolean {
  try {
    if (readCopies().some((copy) => copy.raw === raw)) return true;
    const foundAt = new Date().toISOString();
    let key = `${UNREADABLE_PREFIX}${foundAt}`;
    for (let n = 2; localStorage.getItem(key) !== null; n++) {
      key = `${UNREADABLE_PREFIX}${foundAt}#${n}`;
    }
    const copy: UnreadableCopy = { foundAt, raw, ...damage, dismissed: false };
    localStorage.setItem(key, JSON.stringify(copy));
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export function loadStorage(): LoadResult {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage not accessible: we cannot know what is there, so never write.
    return { sessions: [], notices: [], writeBlocked: true };
  }
  const { sessions, damage } = parseStore(raw);
  const writeBlocked = damage !== null && raw !== null && !preserve(raw, damage);
  let notices: UnreadableNotice[] = [];
  try {
    notices = readCopies().filter((copy) => !copy.dismissed);
  } catch {
    notices = [];
  }
  return { sessions, notices, writeBlocked };
}

/** Readable stored pairs (original objects). */
export function loadSessions(): PairSession[] {
  return loadStorage().sessions;
}

export function saveSessions(sessions: PairSession[]): SaveResult {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/**
 * Insert or replace one pair and save. The returned list always contains
 * the change, also when saving failed, so counting continues on screen.
 */
export function upsertSession(session: PairSession): {
  sessions: PairSession[];
  save: SaveResult;
} {
  const { sessions, writeBlocked } = loadStorage();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  const save: SaveResult = writeBlocked ? { ok: false } : saveSessions(sessions);
  return { sessions, save };
}

/** Hide the notice for one preserved copy. Never deletes the copy. */
export function dismissUnreadable(key: string): void {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "");
    if (!isUnreadableCopy(value)) return;
    localStorage.setItem(key, JSON.stringify({ ...value, dismissed: true }));
  } catch {
    // Nothing to do: the notice simply shows again next time.
  }
}

/** Ask the browser to keep Socky's data; fire-and-forget (FR-010). */
export function requestPersistentStorage(
  storageManager: Pick<StorageManager, "persist"> | undefined = globalThis.navigator?.storage
): void {
  try {
    const request = storageManager?.persist?.();
    request?.catch(() => undefined);
  } catch {
    // Unsupported or refused: the app works the same.
  }
}
