/**
 * Cloudflare Worker bindings + secrets for Socky API (M3).
 * Constitution §8: secrets live in wrangler / GitHub Actions, never in the repo.
 */
export type Bindings = {
  DB: D1Database;
  /** Public origin of the web app (CORS + OAuth redirect base). */
  WEB_ORIGIN: string;
  /** Comma-separated Google emails that receive the ADMIN role on first login. */
  ADMIN_EMAILS: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};
