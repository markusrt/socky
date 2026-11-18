---

description: "Task list template with MVP delivery checkpoints (mvp-starter override of spec-kit 1.2.1 core, adapted for the Socky monorepo)"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: MANDATORY (constitution VIII). Every story phase includes unit tests for
domain/boundary behavior and failure paths, plus Playwright coverage for the
user journey. Tests are written alongside the code they prove, never deferred.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
Story phases are grouped into the delivery checkpoints of the feature's
**Delivery Mode** (recorded in plan.md; constitution "Delivery modes"): Full =
C1, C2, C3; Light = one C3 gate; Spike = one C1 gate. Each checkpoint ends with a
**GATE** task: the implementing agent MUST stop there and wait for an explicit
owner decision recorded in `docs/STATUS.md`.

**Delivery Mode**: [Full | Light | Spike, copied from plan.md]

## Format: `[ID] [P?] [Story] [ROUTINE?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- **[ROUTINE]**: Fully specified by plan.md and the task text (exact files,
  existing patterns to follow, no open design choice), so it may be delegated
  to a faster model (AGENTS.md, Roles and models). Leave untagged anything that
  shapes domain rules, schemas/contracts, boundaries, security/privacy, or
  cross-cutting structure, plus every GATE task. When in doubt, leave it untagged.
- Include exact file paths in descriptions

## Path Conventions

Socky is a pnpm monorepo (ADR 0004 records the departures from the starter layout):

- `packages/shared/src/`: pure domain TypeScript (no I/O; dependency-cruiser enforced);
  unit tests beside code (`*.test.ts`); domain data in `packages/shared/data/`;
  German display labels in `packages/shared/src/labels.ts`
- `packages/web/src/`: React UI; browser storage in `packages/web/src/storage.ts`
- `packages/web/src/storage-fixtures/`: FROZEN snapshots of every stored format the
  live app has written. Never edit one; a new format adds a new fixture + migration test
- `packages/web/e2e/`: Playwright journeys (desktop Chrome and Pixel 7 projects)
- `packages/api/src/`: Hono Worker; every new route has a zod schema, role guard, unit test
- Adjust only if plan.md records an approved departure (ADR)

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  Checkpoint mapping by the Delivery Mode in plan.md:
  - Full (always for the first product feature):
    - C1 = P1 story, which MUST exercise the riskiest core assumption
    - C2 = remaining stories needed for a useful workflow, plus reload,
           invalid data, read/write failure, recovery, keyboard and device behavior
    - C3 = polish and agreed acceptance
  - Light: all stories, then the polish phase, then ONE GATE labeled C3 that
    covers C1–C3 criteria for the feature's scope. Omit the C1 and C2 gates;
    the C2 behavior of what changed is tested inside the story phases.
  - Spike: the smallest end-to-end test of the open question, then ONE GATE
    labeled C1 that records a go/no-go result with evidence. No polish phase.
    Later work is added by /speckit-tasks after the owner's decision.

  Keep every GATE task verbatim apart from the checkpoint label, the mode,
  and story IDs (a Spike GATE adds: record the go/no-go result and evidence).
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Protect live data and prepare the feature; do not regenerate tooling

- [ ] T001 Data-safety check: does this feature change the stored-session key, its shape, stored step/note keys, or the deploy origin? If yes, add a frozen fixture for the new format and a test that every older fixture still loads (packages/web/src/storage.test.ts); if no, record "no stored-data impact" in the journal
- [ ] T002 [ROUTINE] Add any new German display strings to packages/shared/src/labels.ts (domain) or the web component (chrome) per plan.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Define domain types and pure rules in packages/shared/src/[entity].ts with tests in packages/shared/src/[entity].test.ts
- [ ] T005 Update fixtures under packages/shared/data/ and materialize tests if domain data changes

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 C1 Risky core

**Goal**: [Brief description of what this story delivers]

**Riskiest assumption tested**: [Which assumption this proves or disproves]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1

- [ ] T006 [P] [US1] Unit tests for [rules and failure paths] in packages/shared/src/[name].test.ts
- [ ] T007 [P] [US1] [ROUTINE] Playwright journey for [user journey] in packages/web/e2e/[name].spec.ts

### Implementation for User Story 1

- [ ] T008 [US1] Implement [domain behavior] in packages/shared/src/[name].ts
- [ ] T009 [US1] [ROUTINE] Implement [UI flow] in packages/web/src/[Component].tsx
- [ ] T010 [US1] Surface validation and errors accessibly

### C1 GATE

- [ ] T011 [GATE] C1 checkpoint (owner-facing: "First working slice"): run `pnpm verify`; start `pnpm --filter @socky/web dev --host 127.0.0.1 --port 5173 --strictPort` and confirm the URL responds; if knitting rules or tap feel changed, include a step for the knitter (constitution amendment P2); draft the round report from docs/templates/round-report.md (≤3 owner steps); run the `reviewer` subagent (code review plus walk-through of the owner steps with screenshots) and fix blockers; save the report as specs/[###-feature-name]/review/round-<k>.md; update docs/STATUS.md (checkpoint, round counter, next action) and the spec in the same commit, and append evidence to docs/journal/[###-feature-name].md; commit; post the report in chat; then **STOP** and wait for an explicit owner decision. Do not start later phases until docs/STATUS.md records approval.

---

## Phase 4: User Story 2 - [Title] (Priority: P2) C2 Useful and recoverable

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2

- [ ] T012 [P] [US2] Unit tests for [persistence, invalid data, failures] in packages/web/src/[name].test.ts
- [ ] T013 [P] [US2] [ROUTINE] Playwright journey for [reload/recovery] in packages/web/e2e/[name].spec.ts

### Implementation for User Story 2

- [ ] T014 [US2] Implement [behavior] in packages/[package]/src/[file].ts
- [ ] T015 [US2] Integrate with User Story 1 components (if needed)

### C2 GATE

- [ ] T016 [GATE] C2 checkpoint (owner-facing: "Solid and usable"): same procedure as T011 for US1–US2; **STOP** for an explicit owner decision.

---

[Add more user story phases as needed, placing each before the gate of the checkpoint it belongs to]

---

## Phase N: Polish & Acceptance (C3)

**Purpose**: Demonstrate agreed acceptance criteria and hand off

- [ ] TXXX [P] Accessibility pass: keyboard-only journey, focus, labels, status/error announcements
- [ ] TXXX [P] [ROUTINE] Wording pass: German display text follows docs/domain/groessenmodell.md "Display and wording rules"; layouts tolerate longer text at mobile width
- [ ] TXXX Run quickstart.md validation
- [ ] TXXX Document known limits and exact restart/resume steps in docs/STATUS.md and README.md
- [ ] TXXX [GATE] C3 checkpoint (owner-facing: "Ready to accept"): same procedure as T011; request explicit acceptance. **STOP**; never mark accepted without a recorded owner decision. After acceptance: write the retro entry (docs/retro.md) and offer to send it upstream.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Proceed sequentially in priority order (P1 → P2 → P3)
- **GATE tasks**: Block every later task until docs/STATUS.md records an explicit owner decision
- **Polish (Final Phase)**: Depends on all desired user stories being complete and approved

### Within Each User Story

- Tests are written with or before the implementation they prove
- Domain before storage before UI
- Core implementation before integration
- Story complete and checks green before moving to next priority

### Parallel Opportunities

- Tasks marked [P] within a phase can run in parallel
- Never parallelize across a GATE

---

## Implementation Strategy

### Checkpointed MVP (Full)

1. Complete Setup + Foundational
2. Complete User Story 1 → C1 GATE: running app, evidence, **STOP**
3. After approval (or requested changes folded into spec.md/tasks.md): User Story 2+ → C2 GATE, **STOP**
4. After approval: Polish & Acceptance → C3 GATE, **STOP**

### Light and Spike

- Light: Setup/Foundational (only if needed) → stories in priority order → Polish → C3 GATE, **STOP**
- Spike: the open question end to end → C1 GATE with go/no-go and evidence, **STOP**; the owner decides whether it continues as Light or Full

Owner feedback at a gate is recorded by the team in
specs/[###-feature-name]/feedback/round-<k>.md (owner's words quoted, global
rNN ids), then updates spec.md (via `/speckit-clarify` or a direct edit with
stable IDs, decisions also as dated bullets under `## Clarifications`), then
`/speckit-tasks` or `/speckit-converge` refreshes remaining work before
implementation resumes.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit coherent slices (a story or a gate), not individual tasks or files
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
