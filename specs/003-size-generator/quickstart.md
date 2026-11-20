# Quickstart: Size generator

```sh
pnpm install --frozen-lockfile
pnpm --filter @socky/shared test           # model vs golden fixture and Tabelle 1
pnpm dev:web                                # http://localhost:5173
pnpm verify                                 # lint, typecheck, dep:cruise, test, test:e2e
```

Regenerate nothing: `packages/shared/src/fixtures/size-pairs-v1.json` is frozen. To
compare with the research script by hand:

```sh
node specs/002-sizing-research/pairs.mjs --pair 27/28
```

Manual check (German steps for the knitter):

1. „Neue Socke starten" → bei „Größe" **27/28 · 56 Maschen** wählen. Darunter steht der
   Strickplan: Bündchen 33, Rechte Reihen 11, Ferse 26, Aufteilung 9-10-9, 14 aufnehmen,
   3 nach dem Zusammenstricken, Maschen reduzieren 3 Reihen, Fuß 41, Spitze.
2. „Starten" → oben steht „Größe 27/28 · 56 Maschen".
3. Bis „Maschen reduzieren" tippen: „3 Reihen · bis 56 Maschen (wie Anschlag)" und
   „Letzte Reihe: nur 2 Maschen abnehmen"; dreimal „Reihe fertig".
