import type { PairSession } from "@socky/shared";

const STORAGE_KEY = "Socky.sessions.v1";

export function loadSessions(): PairSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as PairSession[];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: PairSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function upsertSession(session: PairSession): PairSession[] {
  const sessions = loadSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  saveSessions(sessions);
  return sessions;
}
