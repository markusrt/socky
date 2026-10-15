import { betterAuth } from "better-auth";
import type { Bindings } from "./env";

/**
 * Better Auth on Cloudflare Workers + D1 (ADR 0001).
 * Role is server-owned (Constitution §8): clients cannot set it on signup.
 */
export function createAuth(env: Bindings) {
  const adminEmails = new Set(
    env.ADMIN_EMAILS.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );

  return betterAuth({
    appName: "Socky",
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: env.DB,
    advanced: {
      database: {
        // Tables are applied via POST /migrate + migrations/0001_app_tables.sql.
        validateSchema: false,
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        // Household app: always offer account picker so both spouses can choose.
        prompt: "select_account",
      },
    },
    user: {
      additionalFields: {
        role: {
          type: ["ADMIN", "KNITTER"],
          required: false,
          defaultValue: "KNITTER",
          input: false,
        },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const email = user.email?.toLowerCase() ?? "";
            const role = adminEmails.has(email) ? "ADMIN" : "KNITTER";
            return { data: { ...user, role } };
          },
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role?: string | null;
};
