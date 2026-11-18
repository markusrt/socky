# Feature Specification: Storage safety

**Feature Branch**: `001-storage-safety`

**Created**: 2026-11-18

**Status**: Draft

**Spec Language**: en

**Delivery mode**: Light (one GATE after the last story; owner decision, interview Q6)

**Input**: User description: "Never lose or overwrite the knitter's saved progress: keep unreadable saved data untouched and recoverable, show readable pairs even when one is damaged, tell her when saving fails, and ask the browser to keep the data permanently." (Owner interview 2026-11-18, round 1, Q2–Q6; see `docs/journal/001-storage-safety.md`.)

## Context

The knitter's progress lives only in her phone's browser storage (constitution amendment P4). Today, if the saved data cannot be read, the app silently shows an empty list and her next tap overwrites the saved data for good. If saving fails, nothing tells her. The browser may also clear a website's data after a long pause unless it is asked to keep it. This feature closes those gaps without changing how counting feels.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unreadable saved data is kept and recoverable (Priority: P1)

The knitter opens Socky and the saved data cannot be read at all (damaged, cut off, or in a shape the app does not know). Instead of an empty app that will overwrite her data, she sees a German notice that her saved knitting could not be read and that nothing was deleted, with a "Daten kopieren" button that copies the saved text exactly so she can send it to Markus. She can still start a new pair; that does not destroy the unreadable data.

**Why this priority**: This is the one path where today's app destroys her work permanently (P4: "Unreadable stored data is never overwritten").

**Independent Test**: Put unreadable text into the saved data, open the app: the notice appears, "Daten kopieren" yields exactly that text, starting and counting a new pair works, and the unreadable text is still retrievable afterwards.

**Acceptance Scenarios**:

1. **Given** saved data that cannot be read, **When** she opens the app, **Then** she sees the notice "Gespeicherte Strickstände konnten nicht gelesen werden. Nichts wurde gelöscht." and a "Daten kopieren" button.
2. **Given** that notice, **When** she taps "Daten kopieren", **Then** her clipboard holds the saved text exactly as it was stored, and she gets a short confirmation that it was copied.
3. **Given** unreadable saved data, **When** she starts a new pair and taps "Reihe fertig", **Then** the new pair is saved and the original unreadable text is still kept unchanged.
4. **Given** the notice, **When** she dismisses it, **Then** it disappears and nothing is deleted.

---

### User Story 2 - Damaged pairs do not hide good pairs (Priority: P2)

Some of her pairs can be read and one cannot. She sees and continues her good pairs as usual, plus the notice telling her how many pairs could not be read, with the same "Daten kopieren" button. The damaged pair is not lost when she keeps knitting.

**Why this priority**: Her current pair keeps working even if an old pair is damaged; she never loses the pair she is knitting because of another one.

**Independent Test**: Store three pairs where one is damaged, open the app: two pairs show and resume normally, the notice says one pair could not be read, and after counting a row the full original saved text is still retrievable.

**Acceptance Scenarios**:

1. **Given** saved data with readable pairs and N damaged pairs, **When** she opens the app, **Then** all readable pairs show with their progress unchanged and the notice says that N pairs ("1 Strickstand" / "N Strickstände") could not be read and nothing was deleted.
2. **Given** that state, **When** she counts a row on a readable pair, **Then** the row is saved and the complete original saved text (including the damaged pair) is still kept unchanged.
3. **Given** that state, **When** she taps "Daten kopieren", **Then** the clipboard holds the complete original saved text.

---

### User Story 3 - She knows when progress was not saved (Priority: P3)

If the phone refuses to save (storage full, private browsing, storage blocked), a German notice "Fortschritt wurde nicht gespeichert" appears and stays visible until a save works again. Counting continues on screen so she does not lose her place.

**Why this priority**: Today a failed save is silent; she would only notice after reloading, when rows are gone.

**Independent Test**: Make saving fail, count a row: the notice appears and the count still advances on screen; let saving work again, count another row: the notice disappears and a reload shows the latest count.

**Acceptance Scenarios**:

1. **Given** saving fails, **When** she taps "Reihe fertig", **Then** the count advances on screen and the notice "Fortschritt wurde nicht gespeichert" appears.
2. **Given** the notice is shown, **When** a later save succeeds, **Then** the notice disappears.
3. **Given** saving fails, **When** she keeps counting, **Then** the notice stays visible and does not need to be dismissed per tap.

---

### User Story 4 - The browser is asked to keep her data (Priority: P3)

When Socky opens, it asks the browser to keep its saved data permanently instead of clearing it after a long pause, without showing anything to her.

**Why this priority**: Reduces the chance that a long knitting break wipes her progress; no visible change.

**Independent Test**: Open the app in a browser that supports the request: the request is made once per start and the app behaves the same whether it is granted, refused or unsupported.

**Acceptance Scenarios**:

1. **Given** a browser that supports permanent storage, **When** the app starts, **Then** it requests it, and no prompt or notice from Socky appears.
2. **Given** a browser that refuses or does not support the request, **When** the app starts, **Then** it works exactly as before.

### Edge Cases

- Saved data is empty or absent: the app starts empty with no notice (first use).
- Saved data is readable but has zero pairs: empty list, no notice.
- Storage cannot be accessed at all (blocked): the app starts empty, shows "Fortschritt wurde nicht gespeichert" on the first failed save, and writes nothing.
- The unreadable original cannot be preserved separately (for example storage full): the app never writes to her saved data while its unreadable content is not safely preserved; it keeps working on screen and shows the not-saved notice.
- Unreadable data is found again on a later start (a new damage after an earlier one): every preserved copy is kept; none replaces an earlier one.
- Clipboard access is refused: the app shows the saved text in a selectable field so it can be copied by hand.
- Today's stored format (the frozen fixture) is fully readable and shows no notice.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST treat saved data as unreadable when it cannot be parsed or is not a list of pairs, and MUST treat an individual pair as damaged when the app could not show it and continue counting it without errors.
- **FR-002**: The app MUST NOT overwrite or delete saved data that is unreadable or contains damaged pairs; before its next save it MUST keep an unchanged copy of the complete original saved text, and it MUST NOT save if that copy cannot be kept.
- **FR-003**: Preserved copies MUST stay until removed deliberately by the owner; the app MUST NOT delete or replace them on its own.
- **FR-004**: When saved data is unreadable or contains damaged pairs, the app MUST show the German notice "Gespeicherte Strickstände konnten nicht gelesen werden. Nichts wurde gelöscht.", naming the number of damaged pairs when some pairs were readable.
- **FR-005**: The notice MUST offer "Daten kopieren", which copies the complete original saved text unchanged and confirms the copy; if the clipboard is unavailable, it MUST show the text so it can be copied by hand.
- **FR-006**: The knitter MUST be able to dismiss the notice; dismissing MUST NOT delete anything.
- **FR-007**: Readable pairs MUST show and resume with their progress unchanged when other pairs are damaged.
- **FR-008**: The knitter MUST be able to start and count a new pair while unreadable data is preserved.
- **FR-009**: When a save fails, the app MUST keep the on-screen progress and show "Fortschritt wurde nicht gespeichert" until a later save succeeds.
- **FR-010**: On start the app MUST request permanent storage from the browser where supported, without any visible prompt from Socky, and MUST behave identically when the request is refused or unsupported.
- **FR-011**: Today's stored format (key `Socky.sessions.v1`, the frozen fixture `packages/web/src/storage-fixtures/sessions-v1.json`) MUST keep loading, resuming and saving unchanged, with no notice (P4).
- **FR-012**: All new display text MUST be German (P9); counting, buttons and tap behavior MUST stay unchanged (P11).

### Key Entities

- **Saved pairs**: the knitter's list of pair sessions as stored today; unchanged by this feature.
- **Preserved copy**: an exact copy of saved text that could not be fully read, with the time it was found; kept separately, never shown as a pair.
- **Storage notice**: what the knitter sees about unreadable data (with damaged-pair count and "Daten kopieren") or about failed saves.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In every tested damage case (cut-off text, not a list, one damaged pair among good ones, unknown shape), 100% of the original saved text is still retrievable byte for byte after she counts at least one row.
- **SC-002**: The frozen fixture of today's format loads and resumes with zero differences and no notice, on desktop and phone sizes.
- **SC-003**: The text copied by "Daten kopieren" is identical to the stored original in 100% of tested cases.
- **SC-004**: A failed save is visible on the next screen update after the tap, and the notice disappears after the first successful save.
- **SC-005**: Counting a row in the normal case needs the same number of taps and shows no new notices (no change she can feel).

## Assumptions

- She opens Socky in a normal Safari tab, not from a home-screen icon (interview Q2). The team tells her, outside the app, to keep opening it the same way during a pair, because the two have separate storage.
- Exporting or backing up data stays out of scope (owner decision 2026-11-14, confirmed Q6); "Daten kopieren" exists only for unreadable data.
- Removing preserved copies is an owner task (for example via browser developer tools), not a knitter feature.
- Acceptance (Light, one GATE): the owner accepts from the reviewer's screenshots of the damage and save-failure cases plus his own check; the knitter only confirms after deploy that her pair is still there (Q6).
- Web origin and storage key stay the same (ADR 0005).
