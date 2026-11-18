# Quickstart: check the sizing research

Prerequisites: Node 24, repository checked out on `002-sizing-research`.

1. Print the proposal table and test-case check:

   ```sh
   node specs/002-sizing-research/model.mjs
   ```

   Expected: one row per EU size 15–51 with every count; a test-case block
   listing each certain knitted size with `match` or `deviation` per count;
   exit code 0 when every deviation has a recorded explanation, 1 otherwise.

2. `pnpm verify` stays green (the script passes Biome; no product code changed).

3. Read `report.md`: method, sources (every external number cited), rules,
   test-case results, go/no-go for 003, open questions for the knitter.

4. Hand `vergleich-de.md` to the knitter: she marks each proposed size
   "passt" / "passt nicht" / "weiß nicht".

5. Privacy check: `git diff main -- docs specs` contains counts and key
   points only, no names, no raw note text.
