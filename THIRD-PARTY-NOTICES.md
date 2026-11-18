# Third-party notices

## Process layer from mvp-starter

The team process (`.claude/agents/`, `.claude/skills/`, `.specify/`,
`docs/templates/`, `scripts/ship.mjs`, `CLAUDE.md`, `.gitattributes`) was
taken from [markusrt/mvp-starter](https://github.com/markusrt/mvp-starter)
at commit `39ad7c4` (template v3.0.0) on 2026-11-14 and adapted for this
monorepo (ADR 0004): no template manifest, Socky paths in the agents and the
tasks template, the `team` skill's start/update procedures, and
`scripts/ship.mjs` watching the "Deploy GitHub Pages" workflow.

GitHub Spec Kit 1.2.1 (`.specify/`, `.claude/skills/speckit-*`) is vendored
through mvp-starter; Spec Kit is © GitHub, Inc., MIT License
(https://github.com/github/spec-kit).

## Skills from mattpocock/skills

The skills `grilling`, `prototype`, `pr`, `to-questionnaire` and `wait-what` under `.claude/skills/` are vendored from [mattpocock/skills](https://github.com/mattpocock/skills) at commit `4ae2317` (`4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`), licensed under the MIT License (Copyright (c) 2026 Matt Pocock). Each vendored `SKILL.md` carries a `metadata.source` link to the exact file in that commit. The `pr` skill additionally credits Dex Horthy's `show-me` skill (Humanlayer); see `.claude/skills/pr/CREDITS.md`.

They were adapted for this template as follows (the `agents/openai.yaml` file was dropped from every skill, and a `metadata` block with source, license and vendoring date was added to every `SKILL.md`):

- `grilling` — copied unchanged.
- `prototype` — `UI.md` dropped and the SKILL.md rewritten to describe only the LOGIC branch: a single self-contained HTML file written to the scratchpad/temp directory and offered to the owner, kept on a `prototype/<name>` branch only if the owner says so; references to an issue tracker removed; `LOGIC.md` adjusted accordingly (UI.md pointer removed, capture step reworded).
- `pr` — `CREDITS.md` kept.
- `to-questionnaire` — copied unchanged.
- `pr` — the reference to `GLOSSARY.md` replaced by the vocabulary of the active spec and the product's own words.
- `wait-what` — the reference to `GLOSSARY.md` / `GLOSSARY-MAP.md` replaced by the vocabulary of the active spec (`specs/NNN-*/spec.md`) and the product's own words.

## MIT License (mattpocock/skills)

```
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
