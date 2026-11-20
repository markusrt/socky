import { describe, expect, it } from "vitest";
import type { Bindings } from "./env";
import app from "./index";

const testEnv = {
  DB: {
    prepare: () => ({
      bind: () => ({
        all: async () => ({ results: [], meta: { changes: 0, last_row_id: 0 } }),
        run: async () => ({ success: true }),
      }),
      all: async () => ({ results: [], meta: { changes: 0, last_row_id: 0 } }),
    }),
    batch: async () => [],
    exec: async () => ({ results: [] }),
  } as unknown as D1Database,
  WEB_ORIGIN: "http://localhost:5173",
  ADMIN_EMAILS: "admin@example.com",
  BETTER_AUTH_SECRET: "test-secret-test-secret-test-secret",
  BETTER_AUTH_URL: "http://localhost:8787",
  GOOGLE_CLIENT_ID: "test-client-id",
  GOOGLE_CLIENT_SECRET: "test-client-secret",
} satisfies Bindings;

describe("api health", () => {
  it("returns ok", async () => {
    const res = await app.request("/health", {}, testEnv);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, service: "socky-api" });
  });
});

describe("session routes auth", () => {
  it("rejects unauthenticated session list", async () => {
    const res = await app.request("/api/sessions", { method: "GET" }, testEnv);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "unauthorized" });
  });
});

describe("plan preview by size pair (ADR 0007)", () => {
  it("returns the 27/28 plan", async () => {
    const res = await app.request("/preview/plan/27/28", {}, testEnv);
    expect(res.status).toBe(200);
    const plan = (await res.json()) as { sizeLabel: string; construction: { castOnTotal: number } };
    expect(plan.sizeLabel).toBe("27/28");
    expect(plan.construction.castOnTotal).toBe(56);
  });

  it.each(["47/48", "40/41", "15/17"])("rejects %s (not offered)", async (pair) => {
    const res = await app.request(`/preview/plan/${pair}`, {}, testEnv);
    expect(res.status).toBe(404);
  });

  it("creating a session still requires a signed-in user", async () => {
    const res = await app.request(
      "/api/sessions",
      {
        method: "POST",
        body: JSON.stringify({ pair: "27/28" }),
        headers: { "Content-Type": "application/json" },
      },
      testEnv
    );
    expect(res.status).toBe(401);
  });
});
