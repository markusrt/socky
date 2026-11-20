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

## 2026-11-19 — 001-storage-safety accepted (C3, Light; not sent)

- Two features in parallel on two branches each carried their own
  `docs/STATUS.md`. A fresh session reads only the checked-out one, so the
  owner could not tell how `/clear` would find the other feature. The
  template has no rule for parallel features; "one STATUS on the main
  folder's branch, pointing to every active feature" would have helped.
- The global round and feedback counters drifted between the two branches
  (one said "next is r01" while the other had reached r14). Counters that
  are global need one home, or the template should keep features serial.
- Light mode with a single C3 gate fit a data-safety change well: the
  reviewer's screenshots of states that tapping cannot produce replaced an
  owner try-out, and the owner accepted from them.
- The round report asked two questions in chat but the saved report held
  only one; the owner answered the saved one. Report and chat must match.

## 2026-11-20 — 003-size-generator accepted (C3, Light; not sent)

- The owner's "technical" setting worked well at the plan step: a short plan
  summary with two named overridable choices drew one precise correction
  (Reihen, not Runden) before any code was written.
- P2 (the live user accepts knitting changes) assumes she can try the round;
  here the try-out step needed ~76 taps, so step 3 became a screenshot and the
  owner moved her check to the deployed version. The template has no rule for
  "acceptance tester checks on the live version after merge"; a named variant
  (gate passes on the owner's yes, live check recorded as a follow-up item)
  would avoid improvising.
- A frozen golden fixture generated once from the research script plus an
  independently transcribed table made the port verifiable in one pass; the
  template could suggest this pattern for "research becomes product" features.
- Spec Kit 1.2.1's constitution command expects template placeholders; for a
  project-amendments-only change it was simpler to edit the section by hand
  and bump the version, which the skill text does not mention.
