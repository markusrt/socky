# Socky Constitution

Durable rules for humans and any coding agent. Spec Kit reads this file during
`/speckit-plan` (Constitution Check) and amends it only through
`/speckit-constitution`. Product requirements belong in `specs/<feature>/spec.md`;
the current checkpoint and next action belong in `docs/STATUS.md`.

The person this product is built for is called the **owner** throughout. The
agents working on it are called the **team** (lead, developer, reviewer; see
`AGENTS.md`).

## The owner's loop

These rules come first because every other rule serves them.

### A. The owner reviews running software and decides; the team does the rest

The owner has exactly two jobs: try the running product and make product
decisions (what it should do, for whom, in which order, when it is good enough).
The team never requires the owner to read code, diffs, plans, task lists or
spec files to move forward. The team may show them when the owner asks or when
the owner's recorded experience setting (`docs/STATUS.md`, "Owner
experience: technical") says to volunteer them.

### B. Every round ends in something the owner can try

A round is the unit of work between two owner decisions. It ends with a running
product at a verified address, a **round report** of at most 30 lines in the
owner's language (what is new, where to try it, at most three things to try,
decisions needed with a recommendation each, known limits), and screenshots the
reviewer took while walking those steps. Mock-ups, static screens and promises
are not a round result.

### C. The team is the scribe

The owner gives feedback in whatever form is natural: chat, screenshots,
half-sentences, another language. The team writes it down: the owner's words
quoted unchanged, plus the structure the next round needs (id, timing, type,
reference), and reads the result back. A question the owner did not answer is
recorded as **not stated** and asked again; it is never inferred from silence,
tone or a related remark.

### D. Business questions go to the owner, technical questions stay in the team

The team decides anything technical inside the shipped foundation (see VI) and
reports it in one plain sentence. It asks the owner whenever a choice changes
something the owner can feel: money, where data lives, who can see it, what the
product does in an edge case, what becomes harder later. Such questions are
asked the way `grilling` asks them: numbered, each with a recommended answer so
that "yes" is a complete reply. The team does not guess privacy, identity,
consent, retention or authorization rules (see VII); it cannot certify legal
compliance and says so when the owner's answers touch regulated data.

### E. Rules describe roles and outcomes, not models

Agent instructions in this repository say what a role is responsible for and
what a good result looks like. They do not prescribe how a model should think,
name specific model versions or add workarounds for a model's weaknesses. Model
size is expressed only through the runtime's tier aliases.

## Core Principles

### I. Learn before building

Identify the riskiest assumption early. Deliver small, end-to-end slices that
test it before adding breadth or infrastructure. The P1 user story of a product's
first feature MUST exercise that riskiest assumption. The bootstrap records, in
the owner's words, what must be true for the product to be worth building; the
first round tests it.

### II. Do not invent the domain

Record confirmed facts, assumptions, unanswered questions, and explicit
exclusions separately. Mark unknowns `[NEEDS CLARIFICATION]` instead of guessing.
Owner silence is not approval.

### III. Local first, deliberately

Prefer a useful local experience and reversible choices with a replaceable
asynchronous storage seam for future cloud needs. Local storage is not
automatically private, durable, backed up, or available offline. Reassess storage
against actual product requirements.

### IV. Keep boundaries honest and simple

Prefer the smallest usable slice over speculative abstractions. Use strict
typing. Validate untrusted input and persisted data at runtime; types alone do
not validate boundaries. Keep domain logic independent of UI, storage, and
external services.

### V. Make the experience usable

Semantic structure, keyboard operation, visible focus, labels, understandable
errors, accessible feedback, and mobile-friendly layouts are acceptance
requirements, not finishing touches.

### VI. Build on the shipped foundation

Socky has a tested foundation (stack, boundaries, checks, deployment;
`docs/adr/0001-stack-cloudflare-hono-d1.md`, `0002-data-storage-json-first.md`). Prefer current stable releases
supported together, not new majors for their own sake. Pin the toolchain and
preserve reproducibility. A plan that departs from the foundation needs an ADR
and, when the departure is something the owner can feel (rule D), the owner's
yes.

### VII. Protect people and credentials

Never commit secrets or real personal data. Do not guess privacy, retention,
consent, identity, or authorization rules. Obtain approval before sensitive
integrations, paid services, or irreversible operations.

### VIII. Prove what changed (tests are mandatory)

Cover meaningful behavior, boundaries, failure paths, accessibility, and
regressions with proportionate tests in every task list, whether or not the
spec mentions tests. Run the applicable checks and record actual commands,
outcomes, and limitations. Never fabricate passing checks, reachable URLs,
screenshots, or owner acceptance. Tests are part of done, not a follow-up.

### IX. Keep one truth

Each feature has exactly one spec (`specs/<feature>/spec.md`) with stable
requirement IDs (user stories, `FR-`, `SC-`). Update spec, tasks, and
`docs/STATUS.md` in the same change as behavior: implementation state, open
questions, and next action must agree. Distinguish planned, implemented,
verified, and owner-accepted work. History and evidence go to
`docs/journal/`; STATUS stays short.

### X. Commit complete slices

Use conventional commit subjects describing **WHAT** changed (for example,
`feat: recover unreadable demo storage`). Explain **WHY**, trade-offs, and
relevant evidence in the body. Do not create one commit per file or per task
merely because files changed.

### XI. Preserve owner control

Respect existing work and explicit scope. Stop at delivery checkpoints with a
running application and wait for an explicit owner decision; an agent cannot
approve its own exception or advance past a pending gate.

### XII. Speak the owner's language; build for localization

- **Spec language**: the language that best fits the owner, which is the language
  of their brief unless they state another. Conversation with the owner,
  questions, round reports, and the prose of `spec.md` (and its checklists) use
  it. The spec records it as `**Spec Language**: <BCP 47 tag>`.
- **Technical language is English**: constitution, AGENTS.md, README, ADRs,
  `docs/STATUS.md`, `docs/journal/`, plan/research/data-model/contracts/quickstart/tasks,
  code, identifiers, comments, test names, and commit messages.
- **Structure stays English in every document**: template headings, markers such
  as `[NEEDS CLARIFICATION]`, `## Clarifications`, `### Session`, and `GATE`, and
  IDs (`US1`, `P1`, `FR-001`, `SC-001`, `T001`, `r01`). Spec Kit commands look for them.
- **UI**: the default locale is the spec language unless the spec states
  otherwise. Every user-facing string comes from a locale message catalog, never
  hardcoded in components or thrown from domain/storage code (those layers
  return typed error codes the UI maps to messages). Set `<html lang>`, format
  dates/numbers/plurals with `Intl`, avoid sentence concatenation, and keep
  layouts tolerant of longer text. Shipping more than the default locale is a
  separate, approved feature.

## Delivery Checkpoints

The team works autonomously between checkpoints and stops at each checkpoint of
the feature's delivery mode (below). Each checkpoint is a round whose report
asks for a formal decision. The owner-facing names are in the second column;
the IDs stay in tasks and specs.

| ID | Owner-facing name | What it proves |
| --- | --- | --- |
| **C1** | First working slice | The P1 story runs end to end on real (synthetic, discardable) data and tests its important failures. |
| **C2** | Solid and usable | The approved workflow survives reload, invalid data, read/write failures, recovery, keyboard use, and agreed devices. |
| **C3** | Ready to accept | Acceptance criteria demonstrated, checks run, limits and restart steps documented, explicit acceptance requested. |

At each checkpoint: `pnpm verify` passes (or its failure is recorded), the app is
actually running at a verified URL, the reviewer has walked the review steps
and attached screenshots, and the round report gives at most three owner
steps. `AGENTS.md` defines the exact procedure.

### Delivery modes

Not every feature needs all three gates. In `/speckit-plan` the team chooses
one mode, records it with a one-line reason as `**Delivery Mode**` in `plan.md`
and in `docs/STATUS.md`, and tells the owner in one plain sentence ("this one
is small, so there will be a single review"). `/speckit-tasks` inserts only
that mode's GATE tasks.

- **Full** (C1 → C2 → C3): a product's first feature, and any feature that adds
  a new workflow whose core assumption is not yet proven.
- **Light** (one GATE after the last story, C3 procedure): a feature that
  extends a proven workflow and whose risks can be tested inside the slice. The
  single gate demonstrates, for the feature's scope, the core end to end, the C2
  behavior (reload, invalid data, failures, recovery, keyboard, devices) of
  what changed, and the acceptance criteria.
- **Spike** (C1 only, time-boxed): a feature whose central question has an open
  outcome. It ends at a C1 GATE with a recorded go/no-go result and its
  evidence. The owner decides what follows: continue as Light or Full (tasks
  refreshed), or stop and record the learning.

When in doubt, choose the mode with more gates. The team may switch to a mode
with more gates and records why; a mode with fewer gates needs the owner's yes.
The owner may set or change the mode at any time.

## Governance

This constitution supersedes conflicting template text and plan output. The
sections above were adopted from the mvp-starter constitution 3.0.0
(`markusrt/mvp-starter` @39ad7c4) on 2026-11-14 with Socky's file
references (ADR 0004); there is no automatic template update. Amend any
section only with explicit owner approval, through `/speckit-constitution`,
plus an ADR in `docs/adr/` describing the reason and consequences; send
improvements that are not Socky-specific upstream as a template issue
(`docs/retro.md`). Bump the version per semantic versioning (MAJOR: removed
or redefined principle; MINOR: added principle or section; PATCH: wording).
Reading order and operational approval gates are defined in `AGENTS.md`.

Rules that apply to Socky only go in the section below. Where an amendment
narrows or overrides a rule above, the amendment wins for this product.

## Project amendments

Adopted 2026-11-14 (ADR 0004). P1–P13 carry over the former `CONSTITUTION.md`
§1–§11; P2 and P4 are new. P1 and P3 redefined 2026-11-19 (ADR 0007).

### P1. Domain authority (overrides nothing; sharpens II)

Knitting counts, steps and terminology come from, in this order:

1. **The knitter's established rules**, her confirmations, and the
   **size-pair model** she accepted in `specs/002-sizing-research` (ADR 0007),
   which is the standard: pairs 15/16 … 49/50, values from her choice, else
   her knitted pair, else computed (`docs/domain/`, `packages/shared/`).
2. **The REGIA 4-fädig chart** (`docs/reference/`), as historical reference
   only; her rules already depart from it, especially for foot sizes.

The team never invents a count. A change to the model's rules or constants,
or a new size outside it, is a **proposal**: the knitter accepts it in a
review round (P2) before it ships. Counts carry no "berechnet" marking in the
app; the research record keeps which values are knitted, chosen or computed.
The model must reproduce every size she has knitted, or document each
deviation and its reason. If a rule is unclear: ask.

### P2. The knitter accepts domain and knitting-feel changes

The owner is Markus. The knitter (his wife, the live user) is the acceptance
tester for anything that changes knitting rules, counts or how tapping feels.
Such a checkpoint's round report includes German steps for her to try, and
the gate passes only with her result recorded (replaces the former gates G1
"domain truth" and G2 "knitting feel").

### P3. Construction class ≠ foot size

Keep both concepts distinct at every layer (types, data, UI, tests). The
construction class, the cast-on stitch count M (e.g. 68), drives Aufteilung,
Ferse, aufnehmen and the tip; the foot size, the pair (e.g. 39/40), drives
plain-foot rows. The pair chooses M, but a pair is never used as a
construction class or M as a foot size. Collapsing them is a defect. The
REGIA chart is a historical reference. Pairs saved before ADR 0007 keep their
stored chart and actual size labels.

### P4. Never harm the live knitter's work in progress

Her progress lives only in the browser: localStorage key `Socky.sessions.v1`
on `https://markusrt.github.io`, and every merge to `main` deploys to her
phone. Therefore:

- A change to that key, the stored shape, stored step/note keys, or the
  web origin ships only with a frozen fixture of every older stored format
  and a test that it still loads (`packages/web/src/storage-fixtures/`,
  `storage.test.ts`). Fixtures are never edited to make a test pass.
- Unreadable stored data is never overwritten.
- The web origin changes only between sock projects, announced to her in
  advance; she then starts fresh (ADR 0005).
- Changes reach `main` only through a pull request the owner merges, with
  `pnpm verify` green (local and CI).

### P5. TypeScript strict

`strict: true`; no `any` in `packages/shared` or `packages/api` domain code;
runtime validation (zod) at public boundaries.

### P6. Tests that prove the domain

`materialize` and session logic are always unit-tested; every mutating API
route has role-guard tests; the knitting golden path is covered by Playwright
(desktop + phone) inside `pnpm verify`.

### P7. Commits and merges

Conventional commits; never `--no-verify`; never force-push `main`; CI green
before merge; `main` is protected and receives pull requests only.

### P8. Free tier first

Household scale (2–10 users). Prefer the Cloudflare and GitHub free tiers; no
paid-only feature or heavy compute without an ADR and the owner's yes.

### P9. German display text, English code (overrides XII where they differ)

User-facing text is German (Bündchen, Ferse, Abnahme, …). Technical code is
English: types, fields, enum values, keys, routes, DB columns. Until a
localization feature is approved, German display strings live in
`packages/shared/src/labels.ts` (domain labels) and the web components, not
in a message catalog. Spec prose is English (`**Spec Language**: en`); German
knitting terms and the knitter's try-out steps stay German.

### P10. Security by default

Role checks (`ADMIN`, `KNITTER`) on every mutating API route; users read only
their own knitting sessions; no secrets in the repository (wrangler secrets /
`.dev.vars`); the repository is public, so her raw notes and any personal data
stay outside it.

### P11. Mobile-first, one tap = one row

Large tap targets, readable at knitting distance, usable one-handed. The
knitting UI optimizes for one tap per finished row.

### P12. Local today, cloud planned (narrows III)

Today all knitting progress is local to her browser. Cloudflare Workers + D1
with Google login is the planned home (ADR 0001, 0002); moving there follows
P4 and needs no import of browser data.

### P13. Decisions are recorded

Architecture, schema or process changes get one ADR per decision theme under
`docs/adr/` (four-digit numbering). The pre-adoption requirements are frozen
in `specs/000-baseline/spec.md`.

**Version**: 2.0.0 (Socky; based on mvp-starter constitution 3.0.0) | **Ratified**: 2026-11-14 | **Last Amended**: 2026-11-19
