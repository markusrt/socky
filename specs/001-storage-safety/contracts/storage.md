# Contract: `packages/web/src/storage.ts`

```ts
type LoadResult = {
  sessions: PairSession[];          // readable pairs, original objects
  notices: UnreadableCopy[];        // undismissed preserved copies
  writeBlocked: boolean;            // copy could not be preserved
};
loadStorage(): LoadResult           // never writes Socky.sessions.v1
loadSessions(): PairSession[]       // = loadStorage().sessions (kept for callers/tests)

type SaveResult = { ok: true } | { ok: false };
saveSessions(sessions): SaveResult  // catches every write error
upsertSession(session): { sessions: PairSession[]; save: SaveResult }
                                    // skips the save and returns { ok: false } when write-blocked

dismissUnreadable(key): void        // sets dismissed; never deletes
requestPersistentStorage(): void    // fire-and-forget
```

Invariants:

- Nothing writes `Socky.sessions.v1` while its current content is unreadable
  and not preserved.
- Preserved copies are never deleted or overwritten by the app.
- The frozen `sessions-v1.json` loads with `notices: []`, `writeBlocked: false`.
- `upsertSession` keeps working with the in-memory list when saving fails.
