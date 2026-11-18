import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";

/**
 * Knitting smoke (ADR 0004). Starts from the FROZEN stored-format fixture
 * so it proves her live sessions still open and count after a deploy.
 */
const LIVE_KEY = "Socky.sessions.v1";
const STORED = readFileSync(
  new URL("../src/storage-fixtures/sessions-v1.json", import.meta.url),
  "utf-8"
);

async function seedStoredSessions(page: Page) {
  // Seed once per test (not on every navigation), so reload shows what the app saved.
  await page.goto("./");
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [LIVE_KEY, STORED]);
  await page.reload();
}

test("resumes a stored session, counts a row and keeps it after reload", async ({ page }) => {
  await seedStoredSessions(page);

  const project = page.getByRole("button", { name: /40\/41.*Nur rechte Reihen.*20\/51/ });
  await expect(project).toBeVisible();
  await project.click();

  await expect(page.getByRole("heading", { name: "Nur rechte Reihen (Fuß)" })).toBeVisible();
  await expect(page.getByText("20 / 51", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Reihe fertig" }).click();
  await expect(page.getByText("21 / 51", { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: /40\/41.*21\/51/ })).toBeVisible();
});

test("a stored sock-2 session resumes inside the tip", async ({ page }) => {
  await seedStoredSessions(page);

  await page.getByRole("button", { name: /^15 .*Socke 2/ }).click();
  await expect(page.getByRole("heading", { name: "Maschenreduzieren (Bandspitze)" })).toBeVisible();
  await expect(page.getByText(/Bandspitze · Runde 1 von/)).toBeVisible();
  await expect(page.getByText("Socke 2 ●")).toBeVisible();
});

test("a new sock can be started from scratch", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Neue Socke starten" }).click();
  await page.getByRole("button", { name: "Starten" }).click();
  await expect(page.getByRole("heading", { name: "Maschen anschlagen" })).toBeVisible();
  // Cast-on is a one-time step: its button reads "Fertig", then the cuff counts rows.
  await page.getByRole("button", { name: "Fertig", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Bund / Bündchen" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reihe fertig" })).toBeVisible();
});
