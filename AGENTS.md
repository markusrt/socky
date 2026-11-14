# Team operating guide — Socky

This file is for the agents. The owner reads `README.md`; the owner never has
to read this. It applies to any agent or human contributor. The process comes
from mvp-starter, adapted for this monorepo ([ADR 0004](docs/adr/0004-adopt-mvp-starter-process.md)).
Specs follow GitHub Spec Kit (vendored);
delivery stops at owner checkpoints; the owner's loop is defined in the
constitution's first section and is the rule that wins when rules conflict.

Vocabulary: the **owner** is the person the product is for. The **team** is the
lead (the main session), the developer (`.claude/agents/developer.md`) and the
reviewer (`.claude/agents/reviewer.md`). A **round** is the work between two
owner decisions. A **checkpoint** is a round that asks for a formal decision
(C1 First working slice, C2 Solid and usable, C3 Ready to accept).

## Start or resume

Read, in order:

1. `.specify/memory/constitution.md` (including "Project amendments")
2. `AGENTS.md`
3. `docs/STATUS.md` (product, owner experience, current feature, checkpoint,
   counters, next action; it is short on purpose)
4. The active feature's `specs/NNN-*/spec.md`, `plan.md`, and `tasks.md`
5. Relevant decisions in `docs/adr/`; `docs/domain/` for knitting rules;
   `docs/journal/<feature>.md` only when a step needs history

Inspect the worktree, branch, available tools, package scripts, and existing
work. Spec Kit (`.specify/scripts/bash/`, `.claude/skills/speckit-*`) ships
with the template; nobody runs `specify init`. Spec Kit finds the active
feature through the untracked `.specify/feature.json`; on a fresh clone or
machine set `SPECIFY_FEATURE_DIRECTORY=specs/<active feature from STATUS>`
in the environment of the `/speckit-*` commands before running them. The
lead, not Spec Kit, creates feature branches (see Publish). Do not infer completion from a
document or prior conversation: compare claims with files and recorded
evidence. Resume from the next action in STATUS; repository documents, not chat
history, are the handoff.

After an interruption (crash, usage limit, ended session), re-run every GATE
step whose evidence has not reached `docs/journal/` and whose state is not in
`docs/STATUS.md`: a handoff counts only once STATUS records it.

Socky is an existing, live product that adopted this process; there is no
bootstrap. What was built before is frozen in `specs/000-baseline/spec.md`;
`docs/history/original-plan.md` is historical input, never a requirement.

## Talking to the owner

- Chat is the owner's only required interface. Everything the owner must know
  is said in chat, in the spec language, in plain words; the files are the
  record, never the message.
- What the owner is asked to do: try the running product, answer questions,
  decide. Never ask the owner to run a command, open a file, create a file,
  name a branch, or read a diff. If a step needs the owner's machine or account
  (for example installing a tool or enabling GitHub Pages), give the exact
  clicks or the exact command in one block and say why.
- Questions follow the `grilling` skill's shape: numbered, one short title,
  the question, a recommended answer so that "yes" is a complete reply. Ask the
  whole current frontier at once, not one question per message. Technical
  questions are never asked; they are decided and reported (constitution rule D).
- "Owner experience" in `docs/STATUS.md` sets how much the team
  volunteers. `plain`: report technical decisions in one sentence each, no IDs,
  no file paths, no Spec Kit vocabulary. `technical`: additionally offer the
  plan summary, architecture decisions and ADR drafts before building, with
  the option to override. The setting never changes the process, the gates,
  the evidence or who decides what. The owner may change it any time ("be more
  technical with me").
- Translate vocabulary for `plain`: constitution → ground rules; spec → what
  we are building; clarify → questions for you; plan/tasks → our work plan;
  GATE/checkpoint → review round; ship mode → publish choice; ADR → a recorded
  decision. Keep the English terms in the files.
- Read back what you noted after any owner feedback, before acting on it.
- Status questions ("where are we?") are answered from STATUS in three or four
  sentences: what works now, what is being built, what the owner is waiting on.

## Spec Kit flow

| Step | Command | Autonomy |
| --- | --- | --- |
| Interview | `grilling` skill | Before the first spec and whenever a round opens product questions. Rounds of numbered questions with recommended answers; facts are looked up by the team, decisions are the owner's. |
| Spec | `/speckit-specify <brief>` | Autonomous. Mark unknowns `[NEEDS CLARIFICATION]`. |
| Clarify | `/speckit-clarify` | Residual pass after the interview. Ask only what the interview did not settle (≤5, each with a recommended answer). Stop only if an answer changes acceptance, domain, privacy, retention, paid usage, external access, or what the owner can feel of the architecture. |
| Plan | `/speckit-plan` | Autonomous. Default to the stack in ADR 0001; a departure needs an ADR and, if the owner can feel it, the owner's yes. Choose the delivery mode and record it in plan.md and STATUS; tell the owner in one sentence. |
| Tasks | `/speckit-tasks` | Autonomous. The override template inserts the GATE tasks of the delivery mode (Full: C1–C3; Light: C3; Spike: C1). |
| Analyze | `/speckit-analyze` | Autonomous. Fix inconsistencies before implementing. Every implementation task cites the `FR-`/`SC-` IDs it satisfies; list remaining coverage gaps in the journal. Then commit the planning slice (`docs: specify and plan <feature>`). |
| Implement | `/speckit-implement` | Autonomous until the next GATE task, then stop. |
| Feedback | `/speckit-clarify` or spec edit, then `/speckit-tasks` / `/speckit-converge`, then `/speckit-analyze` | After an owner decision at a round. Hand edits to tasks.md are fine for a few tasks; analyze still runs before implementing. |

A `prototype` (the vendored skill, LOGIC branch) is allowed before a spec when
a product question is easier to answer by clicking than by talking: one
self-contained HTML file the owner can try, never product code.

### Roles and models

The lead owns everything that needs judgment: interview, specify, clarify,
plan, tasks, analyze, untagged tasks, reviewing delegated work, `pnpm verify`,
commits, round reports and handoffs. During `/speckit-implement`, delegate
tasks tagged `[ROUTINE]` to the developer in coherent batches (one story's
routine tasks, with task IDs and feature directory), review the diff and tick
the tasks yourself. Redo or take over delegated work that fails checks or
reports a stop.

| Role | Where | Model |
| --- | --- | --- |
| Lead | the main session | the runtime's largest general tier (Claude Code: `opus`) |
| Developer | `.claude/agents/developer.md` | `sonnet` |
| Reviewer | `.claude/agents/reviewer.md` | `opus`, read-only, fresh context |

Models are named only through tier aliases, never versions. Instructions
describe responsibilities and outcomes, not model behaviour. The `team`
skill's start check reports the lead's tier; if it is smaller than the table
says, the lead tells the owner once, with the one thing to type (`/model
opus`), and continues either way.

### Language (constitution XII and amendment P9)

| What | Language |
| --- | --- |
| Chat with the owner, questions, round reports, feedback quotes | Spec language |
| `spec.md` prose, its checklists, clarification answers | Spec language |
| Headings, `[NEEDS CLARIFICATION]`, `## Clarifications`, `GATE`, IDs | English, always |
| Constitution, AGENTS, README, ADRs, STATUS, journal, plan, tasks, code, tests, commits | English |
| UI | German display text (amendment P9) |

Socky's spec language is English (`en`); German knitting terms and the
knitter's try-out steps stay German. The spec records it as
`**Spec Language**: <BCP 47 tag>`. If the owner switches
language mid-project, ask before changing the recorded spec language.
Subagent reports and tool output are English; keep writing to the owner in the
spec language anyway, including progress messages.

The constitution is amended only with the owner's explicit yes, through
`/speckit-constitution` and an ADR; product-only rules go in its "Project
amendments" section, generic improvements also upstream as a template issue.
`/speckit-checklist` is optional; unchecked checklist items make
`/speckit-implement` ask before proceeding.

## Autonomy and gates

- Independently perform reversible implementation, local inspection, and checks
  within the approved spec and environment permissions.
- Decide alone: anything technical inside the shipped foundation and reversible
  within an hour. Report it in one sentence. When blocked between two reasonable
  technical options, pick one, build it, and name the other in the round
  report. Do not build both.
- Ask first: anything that changes product acceptance, domain rules, privacy,
  retention, paid usage, external access, destructive operations, or something
  the owner can feel of the architecture (money, where data lives, who can see
  it, what gets harder later). Do not substitute plausible guesses.
- Ask the whole frontier at once, each question with a recommended answer and
  its consequences. Track nonblocking questions in the round report without
  stopping unrelated work. A pending approval is a stop gate for the affected
  action.
- A GATE task in `tasks.md` is a hard stop: do not mark it done or start later
  phases until `docs/STATUS.md` records an explicit owner decision.
- Preserve unrelated and uncommitted work. Do not use destructive Git operations,
  rewrite history, bypass checks, expose secrets, or alter unrelated files.
- Local branches are reversible and always allowed: work on a local feature
  branch from the feature's first commit, never on `main`. Push, PR creation,
  merging, deployment, and paid services require authorization. A product grants
  them through its recorded publish choice (see Publish); "keep it on my
  machine" grants none. Grants do not transfer to copied projects.
- Standing instructions from the owner go into the repository: product rules
  into the constitution's "Project amendments" section, team habits into the
  "Project working rules" section of this file, never only into agent memory.
  If one was saved in agent memory, move it here and delete the memory entry.
  Before adding a rule, consider whether it belongs in the template instead
  (`docs/retro.md`).

## Working rules

- Edit files with the agent's edit/write tool. Use the shell for commands
  (tests, git, generators) and for bulk mechanical changes only, not for
  scripted edits of single files. Never run commands that wait for stdin.
- Scratch and probe files go to the session's scratchpad or temp directory,
  never into `src/` or other tracked folders. The one exception is reviewer
  screenshots: they are committed under `specs/NNN-*/review/round-<k>/` so
  the round report, the journal and the PR can link them and they survive
  the session.
- Before discarding or reshaping uncommitted work, save it in git
  (`git stash push -u`, or `git commit-tree` into `refs/backup/<name>`), not
  only in temp files. Delete such refs once the work is committed.
- While a delegated task runs its checks, do not edit files those checks build
  or test. After stopping a subagent that runs tests or servers, check its
  ports and child processes before the next check.

### Project working rules

- **Data safety first** (2026-11-14; amendment P4). Before touching
  `packages/web/src/storage.ts`, session types in `packages/shared`, stored
  step/note keys, the `vite.config.ts` base, or any deploy workflow, read P4.
  The frozen fixtures in `packages/web/src/storage-fixtures/` are never edited.
- **Small commits in sensible slices** (2026-10-14). A slice is a coherent
  step (one behavior fix, one migration step, one docs sync), not one file and
  not the whole feature. "Commit the X work" means the full outcome of X (code,
  deps, lockfile, docs, ADRs), without unrelated pending work. One ADR per
  decision theme. Ambiguous scoping: ask.
- **GitHub via `gh` CLI** (2026-10-14). Investigate CI with `gh run list`,
  `gh run view <id> --log-failed` (empty output: read the job summary),
  `gh pr checks`; never guess from the UI.
- **Her raw notes stay private** (2026-11-14). The repository is public; the
  knitter's original notes live outside it, and only transcribed key points go
  into `docs/domain/`.

## Context budget

Every turn reprocesses the whole conversation, so session size drives cost.
The repository is the handoff; a long chat adds cost, not information.

- Prefer a fresh session at every GATE and after the planning commit. Only
  the owner can start one, so the round report ends with: "When you come
  back, a fresh start is best: type `/clear` (or restart Claude Code) and
  then just answer; the repository has everything." The next round resumes
  from STATUS in whatever session the owner's message arrives in.
- Within a checkpoint, once the context passes about 250k tokens, stop at the
  next story boundary, record "`C<n>` in progress" in STATUS (done, started
  with open points, not started, known problems, checks), commit, and tell the
  owner in one sentence. A short resume continues.
- Read STATUS and the active phase of tasks.md first, then only the spec,
  plan, and contract sections the phase cites (grep the IDs). Read code by
  range or search, not whole files, unless you are about to edit them. Read the
  journal only for the history a step needs.
- Send long test and verify output to a log file in the scratchpad and print
  only the summary and failures.
- Record the context size at the start and end of each session in the journal.

## Slice workflow

1. Work the next phase of the active `tasks.md`; each story is an end-to-end
   slice with stable spec IDs (US, `FR-`, `SC-`) and identified risk. Work one
   story at a time: finish, check, tick, and commit it before starting the
   next. Parallelize only within a story (`[P]`), and delegate only tasks of the
   current story.
2. Implement behavior, failure handling, and tests together; tests are mandatory.
3. Run the smallest relevant checks, then `pnpm verify` before claiming
   readiness. A blocked check is a limitation, not a pass.
4. Tick completed tasks, and update `spec.md` (if scope changed) and
   `docs/STATUS.md` in the same change; put commands, outcomes and evidence in
   `docs/journal/<feature>.md`.
5. Commit each finished story as one coherent slice on the feature branch, not
   individual tasks or files, and never leave a checkpoint uncommitted until its
   gate. Use a conventional WHAT subject and a WHY body with trade-offs and
   evidence.

## Commands and architecture

Inspect `package.json` and the available toolchain before running commands.
Command definitions are not execution evidence; record actual results in the
journal.

```sh
pnpm install --frozen-lockfile
pnpm --filter @socky/web exec playwright install chromium
pnpm dev:web                 # knitting UI, http://localhost:5173
pnpm dev:api                 # Hono API, http://localhost:8787/health
pnpm test                    # unit tests, all packages
pnpm test:e2e                # Playwright (builds the web app first)
pnpm verify                  # lint, typecheck, dep:cruise, test, test:e2e
```

Toolchain: Node `>=24` (`.nvmrc`, `engines`), pnpm `9.15.9` in
`packageManager`, TypeScript 6 (ADR 0003), Biome 2, Vitest 5, Playwright
(desktop Chrome + Pixel 7), Spec Kit 1.2.1 vendored under `.specify/` and
`.claude/skills/speckit-*`.

Monorepo (pnpm workspaces):

```
packages/shared   pure domain: types, size chart, materialize(), session logic,
                  JSON actual sizes (data/), German labels (labels.ts)
packages/web      React + Vite knitting UI; storage.ts (localStorage);
                  storage-fixtures/ (frozen); e2e/ (Playwright)
packages/api      Hono on Cloudflare Workers, Better Auth, D1 (not deployed)
specs/            000-baseline (frozen) + one directory per feature
docs/             STATUS, journal/, retro, adr/, domain/, reference/, history/
```

Boundaries (dependency-cruiser): `shared` imports neither `api` nor `web` and
does no I/O; `api` does not import `web`; `web` talks to `api` over HTTP only.

Code rules: TypeScript strict, no `any` in shared/api domain code; a new API
route gets a zod schema, role guard and unit test; a new domain field updates
fixtures and `materialize` tests in the same change; conventional commits.

### Toolchain & Windows notes

- pnpm missing from PATH: `corepack enable`, then `corepack prepare pnpm@9.15.9 --activate`
- The pnpm version lives only in `package.json#packageManager`; never also set
  `version:` on `pnpm/action-setup` (Actions fails with "multiple pnpm versions")
- `Start-Process pnpm` fails on Windows; use `pnpm.cmd`
- Node 24 prints `DEP0169` (`url.parse()`) during pnpm runs; harmless
- PowerShell `-replace` is case-insensitive; never bulk-replace package scopes with it
- After large renames: `pnpm exec biome check --write .`, then `pnpm verify`
- `exactOptionalPropertyTypes` is on: never assign `undefined` to an optional
  field; a conditional spread still fails when the value is `T | undefined`,
  so narrow first
- Keep TypeScript on 6.x until dependency-cruiser supports TS 7 (ADR 0003)
- Better Auth on Workers needs `nodejs_compat` and uses native D1 (no Drizzle);
  `advanced.database.validateSchema: false` plus try/catch in `resolveUser`
  make a schema mismatch fail closed (401), not 500
- Spec Kit scripts are bash; on Windows run them with Git Bash (LF endings are
  pinned in `.gitattributes`)

### Knitting domain cheat-sheet

Full rules: `docs/domain/groessenmodell.md`.

- Base pattern **REGIA 4-fädig** (Käppchenferse); her established rules win
  over the chart (amendment P1); the chart size drives construction + tip
- Actual size drives plain-foot row counts (amendment P3)
- She knits on **2 needles** (`castOnPerNeedle2`)
- Tip: chart Bandspitze first three rows only; "In jeder Runde" close is not
  counted; one tap per single rechts / Abnahme
- A **pair session** tracks two socks, knitted one after the other
- Wording: **Reihen** everywhere, the tip uses **Runden** ("N Runden", never
  "N rechte Runden"); buttons `rows` → Reihe fertig, `once` → Fertig,
  close → Socke fertig
- The knit UI shows only her configured counts, no chart hints next to them
- Aufteilung always from the chart base size; chart Fußlänge cm is reference only
- Trap: chart 40/41 = 10-12-10, but actual 40/41 on chart 44/45 = 11-12-11
- Size 15 uses construction overrides (36 M, 6-6-6, 9 pick-up), not REGIA 22/23

## Rounds, checkpoints and handoff

C1–C3 and the delivery modes are defined in the constitution and expressed as
GATE tasks; a feature has only the gates of its mode. Before requesting review,
verify the actual running application and a reachable URL in the available
environment. Never invent a preview or imply loopback is reachable from another
machine. Stop at pending owner decisions; silence is not acceptance.

Exact handoff procedure (run at every GATE task):

1. Inspect `git status --short`, branch, and recent commits; preserve existing work.
2. Reconcile implemented spec IDs with files, ticked tasks, and checks. Run
   `pnpm verify` and record any failure or check not run in the journal.
3. Start/restart the server using the README commands; check the real review
   URL and its access scope. Never promise process survival or remote access
   from loopback.
4. Draft the round report from `docs/templates/round-report.md` (spec language,
   ≤30 lines, ≤3 owner steps, decisions with recommendations). The round
   number `k` is STATUS "Rounds held" + 1; it is written to STATUS in step 6,
   not before.
5. Independent review: run the `reviewer` subagent with the branch diff, the
   draft report, the URL, a scratchpad path for its script and
   `specs/NNN-*/review/round-<k>/` as the screenshot folder (agents without
   subagents: do the same checklist and walk-through yourself in a fresh pass).
   Fix blockers and should-fix findings, rerun the affected checks, and keep
   the remaining findings in the journal. If the reviewer could not perform an
   owner step as written, fix the step or the product before continuing.
6. Save the report as `specs/NNN-*/review/round-<k>.md` with the screenshots
   beside it. Update `docs/STATUS.md` (feature, checkpoint, rounds held,
   worktree, one exact next action) and the spec in the same commit; append
   evidence (commands, outcomes, review findings, screenshot paths, context
   size) to `docs/journal/<feature>.md`. Check every state claim against git
   and the running system.
7. Review the diff for secrets and artifacts; make coherent authorized commits.
   Post the round report in chat. Screenshots: for `plain`, describe in one
   line each what they show and say they are saved with the round (and in the
   pull request, if one exists); for `technical`, also give their paths. Stop
   and wait; a fresh agent may not advance past the pending gate.
8. Feedback: the owner answers in chat in any form (or edits a spec inline).
   - Write `specs/NNN-*/feedback/round-<k>.md` from
     `docs/templates/feedback-round.md`: the owner's words quoted unchanged,
     global `rNN` ids, timing, type, reference; **not stated** for anything
     the owner did not answer. Update STATUS "Counters" (last feedback id)
     and commit both before triage (`docs: record round <k> feedback`).
   - Read the record back to the owner in chat (items, your reading, open
     points) and ask the not-stated decisions again. Fix the record if the
     owner corrects it; never infer an answer.
   - Triage every item: bug within the spec → fix task; behavior other than
     specified → `/speckit-clarify`, and the decision is also written into the
     spec's `## Clarifications` as a dated bullet; new scope → spec backlog or
     a new feature; question → answer it; decision → record it. Record the
     mapping (item → FR/task) in the journal.
   - With changes: fold them in, `/speckit-analyze`, implement, back to step 2
     for the next round. On approval: record it in STATUS, tick the GATE task,
     and publish per the publish choice.
9. After each accepted checkpoint (at least after C3): write 3–5 bullets to `docs/retro.md` (what slowed the
   team down, which template rule would have helped, which rule was ambiguous)
   and offer the owner to send them upstream (`team` skill, "send retro").

## Publish: PR, merge, deploy

The publish choice is recorded in `docs/STATUS.md` (Socky: `expert-review`,
because every merge deploys to the live knitter's phone; ADR 0004). Owner-facing names map to the engine's ship modes:

| Owner says | Mode | What the team does after an approved round |
| --- | --- | --- |
| "keep it on my machine" | `local-only` | Nothing beyond local commits. Default when the owner names sensitive data. |
| "open a pull request for someone to check" | `expert-review` | `pnpm ship --mode expert-review`: push, create/reuse the PR, report its URL, stop. A human reviews and merges. |
| "publish automatically" | `auto-merge` | `pnpm ship --mode auto-merge`: push, PR, wait for CI, merge (rebase by default), wait for the `main` run including the Pages deploy, verify the live URL, comment it on the PR, tell the owner the link. Default when the owner does not choose. |

- The lead creates the feature branch before the feature's first commit
  (Spec Kit 1.2.1 does not branch on its own): `NNN-<short-name>` with the
  next sequential number, matching the `specs/NNN-*` directory
  `/speckit-specify` will create (for example `001-booking-mvp`). After a
  merge, continue on a new branch from the updated `main` (for example
  `001-booking-mvp-c2`).
- Before publishing, write the STATUS "Exact next action" as the state after the
  merge (what is live, which branch comes next), so `main` is correct the
  moment it merges.
- First PR: write the body with the `pr` skill (summary, evidence with the
  reviewer's before/after screenshots, merge danger) from STATUS and the
  journal, and pass `--title "<conventional subject>" --body-file <file
  outside the repo>`. Later rounds on the same branch update the open PR.
- GitHub Pages: `ship` checks it before pushing. If it isn't set up, enable it
  with `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow` when
  the publish choice needs it and `gh` is logged in; if that fails, give the
  owner the exact clicks the script prints (Settings > Pages > Source: GitHub
  Actions; private repositories need GitHub Pro/Team, and the site is public
  either way). CI never fails because Pages is missing: it skips the deploy
  and explains why in the run summary.
- Report the outcome in plain words: the live link (or the PR link), and that
  the next round starts from a fresh branch. Record them in `docs/STATUS.md`
  as the first commit of the next branch (never push directly to `main`). Exit
  codes: 1 = checks or deploy failed (fix on a new branch), 3 = precondition
  (report the printed hint in plain words).
