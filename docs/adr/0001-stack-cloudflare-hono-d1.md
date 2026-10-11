# ADR 0001 — Stack: Cloudflare-native TypeScript

## Status

Accepted (2026-10-11)

## Context

- Mobile-first sock-knitting webapp, German UI, offline knitting, Google login
- Must run locally first, later free/near-free remote (`*.workers.dev`)
- Author is fluent in C#/Java but chose Cloudflare-native TypeScript for free hosting and modern DX
- GitHub is the only CI/CD target

## Decision

| Layer | Choice |
|---|---|
| Runtime | Cloudflare Workers |
| API | Hono |
| DB | Cloudflare D1 (SQLite) + Drizzle ORM |
| Frontend | React + Vite + TypeScript (PWA later) |
| Auth | Better Auth + Google OAuth (M3) |
| i18n | i18next (DE default) |
| Tests | Vitest + Testing Library + Playwright |
| Lint/format | Biome |
| Architecture | dependency-cruiser |
| CI/CD | GitHub Actions → `wrangler deploy` |

Monorepo: pnpm workspaces (`packages/shared`, `packages/api`, `packages/web`).

## Consequences

- Free tier fits household load (Workers 100k req/day, D1 5 GB).
- No JVM: team applies C#/Java design instincts (clear layers, tests) in TS.
- CPU time on free Workers is 10 ms/invocation — keep API handlers thin.
- Auth and PWA deferred to M3/M4 after domain/knitting gates (G1/G2).

## Alternatives considered

- Spring Boot / ASP.NET: familiar, weak free hosting
- Next.js on Workers: viable, more moving parts than Hono + Vite SPA for this app
- Clerk/Supabase auth: extra cost/vendor; Better Auth keeps stack cohesive
