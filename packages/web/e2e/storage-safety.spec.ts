import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";

/**
 * 001-storage-safety (ADR 0006): unreadable saved data is preserved and
 * copyable, damaged pairs never hide good ones, failed saves are visible.
 */
const LIVE_KEY = "Socky.sessions.v1";
const PREFIX = "Socky.unreadable.v1.";
const fixture = (name: string) =>
  readFileSync(new URL(`../src/storage-fixtures/${name}`, import.meta.url), "utf-8");
const STORED = fixture("sessions-v1.json");
const DAMAGED = fixture("sessions-v1-damaged.json");
// Saved data is single-line JSON (saveSessions); the OS clipboard may rewrite line breaks.
const CUT_OFF = JSON.stringify(JSON.parse(STORED)).slice(0, 300);
const WHOLE_MESSAGE =
  "Gespeicherte Strickstände konnten nicht gelesen werden. Nichts wurde gelöscht.";

async function seed(page: Page, value: string) {
  await page.goto("./");
  await page.evaluate(([key, v]) => localStorage.setItem(key, v), [LIVE_KEY, value]);
  await page.reload();
}

function preservedCopies(page: Page) {
  return page.evaluate((prefix) => {
    const result: { raw: string; dismissed: boolean }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) result.push(JSON.parse(localStorage.getItem(key) ?? ""));
    }
    return result;
  }, PREFIX);
}

test("unreadable data: notice, exact copy, new pair, original kept", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await seed(page, CUT_OFF);

  await expect(page.getByText(WHOLE_MESSAGE)).toBeVisible();
  await page.getByRole("button", { name: "Daten kopieren" }).click();
  await expect(page.getByRole("button", { name: "Kopiert ✓" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(CUT_OFF);

  await page.getByRole("button", { name: "Neue Socke starten" }).click();
  await page.getByRole("button", { name: "Starten" }).click();
  await page.getByRole("button", { name: "Fertig", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Bund / Bündchen" })).toBeVisible();
  await expect(page.getByText("Fortschritt wurde nicht gespeichert")).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("button", { name: /Bund \/ Bündchen/ })).toBeVisible();
  expect((await preservedCopies(page)).map((c) => c.raw)).toEqual([CUT_OFF]);
});

test("dismissing the notice deletes nothing", async ({ page }) => {
  await seed(page, CUT_OFF);
  await page.getByRole("button", { name: "Ausblenden" }).click();
  await expect(page.getByText(WHOLE_MESSAGE)).toHaveCount(0);

  await page.reload();
  await expect(page.getByText(WHOLE_MESSAGE)).toHaveCount(0);
  expect(await preservedCopies(page)).toEqual([
    expect.objectContaining({ raw: CUT_OFF, dismissed: true }),
  ]);
});

test("copy falls back to selectable text when the clipboard refuses", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
    });
  });
  await seed(page, CUT_OFF);
  await page.getByRole("button", { name: "Daten kopieren" }).click();
  await expect(page.getByRole("textbox")).toHaveValue(CUT_OFF);
});

test("a damaged pair does not hide the good ones", async ({ page }) => {
  await seed(page, DAMAGED);

  await expect(
    page.getByText("1 Strickstand konnte nicht gelesen werden. Nichts wurde gelöscht.")
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /^15 .*Socke 2/ })).toBeVisible();
  await page.getByRole("button", { name: /40\/41.*20\/51/ }).click();
  await page.getByRole("button", { name: "Reihe fertig" }).click();
  await expect(page.getByText("21 / 51", { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: /40\/41.*21\/51/ })).toBeVisible();
  expect((await preservedCopies(page)).map((c) => c.raw)).toEqual([DAMAGED]);
});

test("a failed save is visible and clears after the next good save", async ({ page }) => {
  await seed(page, STORED);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.getByRole("button", { name: /40\/41.*20\/51/ }).click();

  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    (window as unknown as { restoreSetItem: () => void }).restoreSetItem = () => {
      Storage.prototype.setItem = original;
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("full", "QuotaExceededError");
    };
  });
  await page.getByRole("button", { name: "Reihe fertig" }).click();
  await expect(page.getByText("21 / 51", { exact: true })).toBeVisible();
  await expect(page.getByText("Fortschritt wurde nicht gespeichert")).toBeVisible();

  await page.evaluate(() => (window as unknown as { restoreSetItem: () => void }).restoreSetItem());
  await page.getByRole("button", { name: "Reihe fertig" }).click();
  await expect(page.getByText("22 / 51", { exact: true })).toBeVisible();
  await expect(page.getByText("Fortschritt wurde nicht gespeichert")).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("button", { name: /40\/41.*22\/51/ })).toBeVisible();
});
