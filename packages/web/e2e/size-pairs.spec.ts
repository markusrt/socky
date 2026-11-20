import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";

/**
 * 003-size-generator (ADR 0007): size pairs are the size list, the plan shows
 * before "Starten", "Maschen reduzieren" is counted in Reihen, and saved pairs
 * of both stored shapes keep their labels.
 */
const LIVE_KEY = "Socky.sessions.v1";
const fixture = (name: string): unknown[] =>
  JSON.parse(readFileSync(new URL(`../src/storage-fixtures/${name}`, import.meta.url), "utf-8"));

async function seed(page: Page, sessions: unknown[]) {
  await page.goto("./");
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [
    LIVE_KEY,
    JSON.stringify(sessions),
  ] as const);
  await page.reload();
}

test("the size list offers exactly the pairs 15/16 … 45/46 with stitch counts", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Neue Socke starten" }).click();
  const options = page.getByLabel("Größe").locator("option");
  await expect(options).toHaveCount(16);
  await expect(options.first()).toHaveText("15/16 · 36 Maschen");
  await expect(options.last()).toHaveText("45/46 · 76 Maschen");
  await expect(page.getByText("Tabelle")).toHaveCount(0);
});

test("choosing 27/28 shows its plan and starts it in three taps", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Neue Socke starten" }).click();
  await page.getByLabel("Größe").selectOption("27/28");

  await expect(page.getByRole("heading", { name: "Strickplan 27/28" })).toBeVisible();
  const plan = page.getByRole("list").first();
  for (const line of [
    "56 Maschen (2 Nadeln = 28 / Nadel)",
    "33 Reihen",
    "11 rechte Reihen",
    "26 rechte + linke Reihen",
    "9-10-9",
    "14 Maschen aufnehmen",
    "3 rechte Reihen",
    "3 Reihen · bis 56 Maschen (wie Anschlag)",
    "Letzte Reihe: nur 2 Maschen abnehmen",
    "41 rechte Reihen",
    "1. Runde: (2 rechts, 1 Abnahme) ×2",
    "2. Runde: (1 rechts, 1 Abnahme) ×3",
  ]) {
    await expect(plan.getByText(line, { exact: true })).toBeVisible();
  }

  await page.getByRole("button", { name: "Starten" }).click();
  await expect(page.getByRole("heading", { name: "Größe 27/28 · 56 Maschen" })).toBeVisible();
  await expect(page.getByText("56 Maschen (2 Nadeln = 28 / Nadel)")).toBeVisible();

  await page.getByRole("button", { name: "← Übersicht" }).click();
  await expect(page.getByRole("button", { name: /27\/28 · 56 Maschen/ })).toBeVisible();
});

test("Maschen reduzieren counts Reihen, with the 2-stitch note and undo", async ({ page }) => {
  await seed(page, fixture("sessions-v1-pairs.json"));
  await page.getByRole("button", { name: /27\/28 · 56 Maschen.*Maschen reduzieren/ }).click();

  await expect(page.getByRole("heading", { name: "Maschen reduzieren" })).toBeVisible();
  await expect(page.getByText("3 Reihen · bis 56 Maschen (wie Anschlag)")).toBeVisible();
  await expect(page.getByText("Letzte Reihe: nur 2 Maschen abnehmen")).toBeVisible();
  await expect(page.getByText("1 / 3", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Reihe fertig" }).click();
  await expect(page.getByText("2 / 3", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reihe fertig" }).click();
  await expect(page.getByRole("heading", { name: "Nur rechte Reihen (Fuß)" })).toBeVisible();

  await page.getByRole("button", { name: /Rückgängig/ }).click();
  await expect(page.getByRole("heading", { name: "Maschen reduzieren" })).toBeVisible();
  await expect(page.getByText("2 / 3", { exact: true })).toBeVisible();
});

test("saved pairs of both shapes keep their labels, with no notice", async ({ page }) => {
  await seed(page, [...fixture("sessions-v1.json"), ...fixture("sessions-v1-pairs.json")]);
  await expect(page.getByRole("button", { name: /40\/41 \(Tabelle 44\/45\)/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /27\/28 · 56 Maschen/ })).toBeVisible();
  await expect(page.getByText(/konnten nicht gelesen werden/)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Pläne prüfen/ })).toHaveCount(0);
});
