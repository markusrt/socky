# Retro notes

After each accepted checkpoint (at least after C3), the lead writes 3–5
bullets here: what slowed the team down, which template rule would have
helped, which rule was ambiguous. "Send retro" turns unsent entries into an
issue on `markusrt/mvp-starter` (AGENTS.md, handoff step 9) and links it here.

## 2026-11-14 — adopting mvp-starter into an existing product (not sent)

- The template has no path for adopting it into an existing repository; the
  owned paths (AGENTS.md, tasks override, agents, CI) assume a single-root,
  local-only app, so a monorepo with a backend had to fork them by hand.
- A "what to take" table for existing products (Lift did one too, ADR 009)
  would have saved most of the adaptation work.
- The template has no rule protecting a live user's stored data across
  deploys; Socky needed amendment P4 and a frozen-fixture test for that.
