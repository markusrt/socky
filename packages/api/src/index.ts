import { getActualSize, materializePlan, REGIA_4_FAEDIG_PATTERN } from "@socky/shared";
import { getMigrations } from "better-auth/db/migration";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./auth";
import type { Bindings } from "./env";
import { adminSizeRoutes, sessionRoutes } from "./sessions";

type AppEnv = { Bindings: Bindings };

const app = new Hono<AppEnv>();

app.use("*", async (c, next) => {
  const origin = c.env.WEB_ORIGIN;
  if (origin) {
    return cors({
      origin,
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })(c, next);
  }
  await next();
});

app.get("/health", (c) => c.json({ ok: true, service: "socky-api" }));

/** Dev-only preview of a materialized plan (G1 domain review). */
app.get("/preview/plan/:actualSizeId", (c) => {
  const id = c.req.param("actualSizeId");
  const actual = getActualSize(id);
  if (!actual) {
    return c.json({ error: "unknown actual size", id }, 404);
  }
  return c.json(materializePlan(REGIA_4_FAEDIG_PATTERN, actual));
});

/**
 * Programmatic Better Auth migrations for D1 (Workers cannot run the CLI).
 * Protect before production: remove or guard with ADMIN in G3 hardening.
 * https://www.better-auth.com/docs/concepts/database#programmatic-migrations
 */
app.post("/migrate", async (c) => {
  try {
    const auth = createAuth(c.env);
    const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);
    if (toBeCreated.length === 0 && toBeAdded.length === 0) {
      return c.json({ message: "No auth migrations needed" });
    }
    await runMigrations();
    // App tables (pair_sessions, …) live in migrations/0001_app_tables.sql
    // and are applied with `wrangler d1 execute socky --file=...`.
    return c.json({
      message: "Auth migrations completed",
      created: toBeCreated.map((t) => t.table),
      added: toBeAdded.map((t) => t.table),
    });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Migration failed" }, 500);
  }
});

/** Better Auth routes (Google OAuth, session, account). */
app.on(["GET", "POST"], "/api/auth/*", (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

const getAuth = (env: Bindings) => createAuth(env);
app.route("/api/sessions", sessionRoutes(getAuth));
app.route("/api/admin", adminSizeRoutes(getAuth));

export default app;
export type AppType = typeof app;
