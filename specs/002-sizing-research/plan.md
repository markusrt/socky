# Implementation Plan: Sizing research

**Branch**: `002-sizing-research` | **Date**: 2026-11-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-sizing-research/spec.md`

**Delivery mode**: Spike — one C1 GATE with a go/no-go for `003-size-generator`.
Time box: one research run plus one lead review pass; if the model misses
SC-002 after that, the result is reported as it is (a valid spike outcome).

## Summary

Transcribe every size the knitter has knitted into one data set (key points
only, no names), research public foot-size data, and derive written sizing
rules that compute every count of a sock from an EU shoe size (or measured
foot length) for 15 to 50/51. Her knitted sizes are the test cases. A small
reproducible script computes the model's table and the test-case comparison;
the knitter gets a German comparison table. No app code, stored data or size
file changes.

## Technical Context

**Language/Version**: Markdown deliverables; one Node 24 ESM script (`.mjs`, no dependencies) to compute the table

**Primary Dependencies**: none (Node standard library only)

**Storage**: files in the repository (`docs/domain/`, `specs/002-sizing-research/`); her raw notes stay in the owner's private folder

**Testing**: the script checks every certain knitted size against the model and prints match / deviation per count; `pnpm verify` stays green (Biome lints the script)

**Target Platform**: owner's machine (Windows, Node 24)

**Project Type**: research spike in an existing monorepo

**Performance Goals**: n/a

**Constraints**: P1 (her rules outrank REGIA and external data), P10 (public repo: no raw notes, no names), FR-012 (no personal data in web searches), FR-011 (no app change)

**Scale/Scope**: about 10 knitted sizes, 36+ EU sizes to propose, 9 count families

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Check | Status |
| --- | --- | --- |
| Owner's loop / Spike mode | One C1 GATE with recorded go/no-go | Pass |
| P1 Domain authority | Her knitted sizes are the test oracle; REGIA and foot data are references; outputs marked "berechnet" | Pass |
| P2 Knitter accepts domain changes | German table for her in the C1 round; her verdict recorded | Pass |
| P4 Never harm her WIP | No change to app, storage, size files, deploy | Pass |
| P6 Tests prove the domain | Model script asserts every certain test case (match or documented deviation) | Pass |
| P9 German display, English code | Table for her in German; report, script, data in English with German knitting terms | Pass |
| P10 Privacy | Transcribed counts only; no names; raw notes stay private | Pass |
| P8 Free tier | Web search only | Pass |
| P13 Decisions recorded | Making the model the standard needs a later ADR (out of scope) | Pass |

Post-design re-check: unchanged, all pass.

## Project Structure

### Documentation (this feature)

```text
specs/002-sizing-research/
├── spec.md
├── plan.md               # this file
├── research.md           # plan-level decisions (how the spike is run)
├── data-model.md         # knitted size, model, test case, foot reference
├── quickstart.md         # how to re-run and check the result
├── contracts/
│   └── sizing-model.md   # model input/output shape for 003
├── report.md             # spike deliverable: method, sources, rules, results, go/no-go
├── vergleich-de.md       # spike deliverable: German comparison table for her
├── model.mjs             # spike deliverable: computes table + test-case check
└── tasks.md              # /speckit-tasks

docs/domain/
└── gestrickte-groessen.md  # transcribed data set of all knitted sizes (key points)
```

### Source Code (repository root)

No product source changes. `packages/` stays untouched (FR-011).

**Structure Decision**: deliverables live in the feature directory, except
the transcribed data set, which belongs to the domain docs because 003 and
later work reuse it.

## Complexity Tracking

None.
