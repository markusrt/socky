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
