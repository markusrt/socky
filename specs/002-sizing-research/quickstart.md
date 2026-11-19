# Quickstart: check the sizing model

Prerequisites: Node 24, branch `002-sizing-research` (or `main` after the merge).

1. `node specs/002-sizing-research/pairs.mjs` prints the fits, the gauge check, all
   pairs and the tests; exit 0 = her pairs within ±2 foot rows and sole length growing.
2. `node specs/002-sizing-research/pairs.mjs --de` equals both tables in
   `vergleich-paare-de.md`.
3. `pnpm verify` stays green (no product code changed).
4. Rules, constants, sources and how to extend: `report.md`.
