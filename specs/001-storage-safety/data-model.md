# Data model: Storage safety

## Saved pairs (unchanged)

Key `Socky.sessions.v1`: JSON array of `PairSession`
(`packages/shared/src/domain.ts`). Frozen format:
`packages/web/src/storage-fixtures/sessions-v1.json`.

Validation (`storedPairSessionSchema`, shared): a value is a **readable
pair** when it has the fields the app reads, with these types:

| Field | Rule |
| --- | --- |
| `id`, `userId`, `patternId`, `chartSizeLabel`, `actualSizeLabel`, `createdAt` | string |
| `status` | `ACTIVE` \| `DONE` \| `ARCHIVED` |
| `activeSock` | 1 \| 2 |
| `steps` | non-empty array of steps |
| step `stepKey`, `titleKey` | string |
| step `unit` | `rows` \| `rounds` \| `once` \| `finish` |
| step `sortIndex`, `targetCount`, `sock1Done`, `sock2Done` | integer ≥ 0 |
| optional fields | type-checked when present; unknown fields allowed |

Load outcomes:

| Stored value | Outcome |
| --- | --- |
| absent or empty | no pairs, no notice |
| valid JSON array, all readable | pairs, no notice |
| valid JSON array, some damaged | readable pairs + preserved copy (`damagedCount` = N) |
| not JSON, or JSON but not an array | no pairs + preserved copy (`damagedCount` = null: nothing readable) |
| storage access throws | no pairs, write-blocked, not-saved notice on first save |

## Preserved copy (new)

Key `Socky.unreadable.v1.<foundAt ISO>`:

```json
{
  "foundAt": "2026-11-18T08:00:00.000Z",
  "raw": "<exact original text of Socky.sessions.v1>",
  "damagedCount": 1,
  "totalCount": 3,
  "dismissed": false
}
```

`damagedCount`/`totalCount` are `null` when the whole value was unreadable.
Frozen fixture: `storage-fixtures/unreadable-copy-v1.json`.

## UI state (not stored)

- `unreadable`: undismissed preserved copies (drives the notice and "Daten kopieren").
- `saveFailed`: last save failed (drives "Fortschritt wurde nicht gespeichert").
- `writeBlocked`: unreadable data could not be preserved; saves are skipped
  and reported as failed.
