import { useState } from "react";
import type { UnreadableNotice } from "./storage";
import { colors } from "./theme";
import { Button } from "./ui/Button";

const box = {
  border: `2px solid ${colors.berryRed}`,
  borderRadius: 14,
  background: colors.softCream,
  color: colors.ink,
  padding: "0.75rem 1rem",
  margin: "0 0 1rem",
} as const;

export function unreadableMessage(notice: Pick<UnreadableNotice, "damagedCount">): string {
  const { damagedCount } = notice;
  if (damagedCount === null) {
    return "Gespeicherte Strickstände konnten nicht gelesen werden. Nichts wurde gelöscht.";
  }
  return damagedCount === 1
    ? "1 Strickstand konnte nicht gelesen werden. Nichts wurde gelöscht."
    : `${damagedCount} Strickstände konnten nicht gelesen werden. Nichts wurde gelöscht.`;
}

/** Unreadable saved data: tell her nothing was deleted, offer the raw text. */
export function UnreadableDataNotice({
  notice,
  onDismiss,
}: {
  notice: UnreadableNotice;
  onDismiss: () => void;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(notice.raw);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  }

  return (
    <section role="alert" aria-label="Speicherhinweis" style={box}>
      <p style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>{unreadableMessage(notice)}</p>
      <p style={{ margin: "0 0 0.75rem" }}>Bitte die Daten kopieren und an Markus schicken.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
        <Button onClick={copy}>{copyState === "copied" ? "Kopiert ✓" : "Daten kopieren"}</Button>
        <Button variant="secondary" onClick={onDismiss}>
          Ausblenden
        </Button>
      </div>
      <p aria-live="polite" style={{ margin: copyState === "copied" ? "0.5rem 0 0" : 0 }}>
        {copyState === "copied" ? "Daten wurden kopiert." : ""}
      </p>
      {copyState === "manual" && (
        <label style={{ display: "block", marginTop: "0.75rem" }}>
          Kopieren hat nicht geklappt. Bitte den Text markieren und kopieren:
          <textarea
            readOnly
            value={notice.raw}
            rows={4}
            // biome-ignore lint/a11y/noAutofocus: shown right after her tap; selects the text to copy
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
            style={{ display: "block", width: "100%", marginTop: "0.25rem", fontSize: "0.85rem" }}
          />
        </label>
      )}
    </section>
  );
}

/** Shown on every screen while the last save failed (FR-009). */
export function SaveFailedNotice() {
  return (
    <div
      role="alert"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: colors.berryRed,
        color: colors.softCream,
        padding: "0.6rem 1rem",
        fontWeight: 600,
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      Fortschritt wurde nicht gespeichert
    </div>
  );
}
