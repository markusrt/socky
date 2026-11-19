# Round 1: Ready to accept — storage safety (001)

**What is new**
- Saved knitting that can't be read is never overwritten: an exact copy is kept, and she sees "Gespeicherte Strickstände konnten nicht gelesen werden. Nichts wurde gelöscht." with "Daten kopieren" and "Ausblenden".
- If one pair is damaged, the other pairs still show and keep counting ("1 Strickstand konnte nicht gelesen werden …").
- If the phone refuses to save, a red bar "Fortschritt wurde nicht gespeichert" shows on every screen until a save works again; the counts on screen are kept, also when she switches pairs.
- On start the app asks the browser to keep its data (no visible change).
- Normal counting looks and feels exactly as before.

**Where to try it:** http://127.0.0.1:5173 (this computer only). If the page does not load, tell me and I will start it again.

**Try these (test data only, nothing real)**
1. Open the page, tap "Neue Socke starten" → "Starten" → "Fertig", then reload: the pair is still there and no notice appears.
2. Look through the screenshots below (phone and desktop); they show every damaged-data and save-failure case, which can't be produced by tapping.

Screenshots (`specs/001-storage-safety/review/round-1/`, each `-mobile` and `-desktop`):
- `step1-new-pair-reload`: new pair kept after reload, no notice
- `case1-frozen-fixture-no-notice`: today's stored data (3 pairs), no notice
- `step3a-unreadable-notice` / `step3b-copied` / `step3c-dismissed-reload`: unreadable data → notice → "Kopiert ✓" → hidden after reload, copy still stored
- `case4-damaged-pair`: two good pairs plus "1 Strickstand konnte nicht gelesen werden"
- `case5-save-failed`: red bar while the count advances to 22/51
- `fix-s1-other-pair-keeps-count`: after counting another pair during a save failure, 40/41 keeps 22/51
- `fix-s2-copy-not-stored-notice`: copy could not be stored → notice still offers "Daten kopieren"
- `case6-clipboard-refused`: copy fallback, text shown for manual copying

**Your decisions**
- Q1 Accept storage safety and open the pull request? ➡️ Yes; after you merge, she only checks once that her pair is still there.

**How to answer:** just tell me in chat, in any form. I will write it down and read it back to you.

**Known limits:** Whether Safari really exempts the data from its 7-day clearing after the "keep data" request is not documented; it lowers the risk, it does not remove it. Preserved copies can only be removed by you via developer tools. Not tested on a real iPhone (Playwright uses a Pixel 7 profile in Chromium).
