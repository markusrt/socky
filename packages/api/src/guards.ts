import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import type { SessionUser } from "./auth";
import type { Bindings } from "./env";

export type AuthedEnv = {
  Bindings: Bindings;
  Variables: {
    user: SessionUser;
  };
};

/** ADMIN | KNITTER — matches shared `UserRole`. */
export type RequiredRole = "ADMIN" | "KNITTER";

const ROLE_RANK: Record<RequiredRole, number> = {
  KNITTER: 1,
  ADMIN: 2,
};

function parseRole(raw: string | null | undefined): RequiredRole {
  return raw === "ADMIN" ? "ADMIN" : "KNITTER";
}

export function hasRequiredRole(user: Pick<SessionUser, "role">, required: RequiredRole): boolean {
  return ROLE_RANK[parseRole(user.role)] >= ROLE_RANK[required];
}

/**
 * Session middleware: resolves the Better Auth user or 401.
 * Expects Better Auth handler to run first (cookie / bearer).
 */
export function requireUser(getUser: (c: Context) => Promise<SessionUser | null>) {
  return createMiddleware<AuthedEnv>(async (c, next) => {
    const user = await getUser(c);
    if (!user) {
      return c.json({ error: "unauthorized" }, 401);
    }
    c.set("user", user);
    await next();
  });
}

/** Role guard on mutating (and sensitive) routes — Constitution §8. */
export function requireRole(required: RequiredRole) {
  return createMiddleware<AuthedEnv>(async (c, next) => {
    const user = c.get("user");
    if (!user || !hasRequiredRole(user, required)) {
      return c.json({ error: "forbidden", required }, 403);
    }
    await next();
  });
}
