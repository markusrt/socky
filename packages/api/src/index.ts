import { getActualSize, materializePlan, REGIA_4_FAEDIG_PATTERN } from "@socky/shared";
import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

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

export default app;
export type AppType = typeof app;
