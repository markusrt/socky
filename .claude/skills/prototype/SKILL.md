---
name: prototype
description: Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like.
metadata:
  source: "https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/prototype"
  license: "MIT"
  vendored: "2026-11-01"
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## The shape

The question this skill answers is **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Build a single self-contained HTML file (free-play buttons plus tabbed guided walkthroughs) that pushes the state machine through cases that are hard to reason about on paper, and that a non-developer (the owner) can click through to answer the design question.

Identify the design question being answered, using the user's prompt, the surrounding code, or by asking if the user is around. If the question is genuinely ambiguous and the user isn't reachable, state the assumption at the top of the prototype.

## Rules

1. **Throwaway from day one, and clearly marked as such.** Write the file to the scratchpad / temp directory, not into the project tree, and name it so a casual reader can see it's a prototype, not production.
2. **Trivial to run.** A logic demo is a single HTML file the user double-clicks. No thinking required to start it.
3. **No persistence by default.** State lives in memory. Persistence is the thing the prototype is _checking_, not something it should depend on. If the question explicitly involves a database, hit a scratch DB or a local file with a clear "PROTOTYPE, wipe me" name.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype _runnable_, no abstractions. The point is to learn something fast.
5. **Surface the state.** After every action, print or render the full relevant state so the user can see what changed.
6. **Capture it when done.** Offer the file to the owner. Fold any validated decision into the real code; the main branch keeps only the validated decision. Keep the prototype itself as a **primary source** only if the owner says so: then commit it to a `prototype/<name>` branch, out of main, and capture the answer too (the verdict and the question it settled) in a commit on that branch.
