# Contract: sizing model output (input for 003)

The model's output for one size has the shape 003 needs to create an actual
size in the app. It mirrors today's `ChartSize` construction fields and
`ActualSizeConfig.counts` in `packages/shared/src/domain.ts`, plus provenance.

```text
input:  { shoeSizeEu: number } | { footLengthCm: number }

output: {
  label: string                    // e.g. "27"
  footLengthCm: number             // assumed or measured
  construction: {
    castOnTotal, heelStitches, heelHeightRows,
    heelSplit: [n, n, n], pickupStitchesBothSides,
    tipSchedule: { fourthRound, every3rdRound, every2ndRound, everyRound }
  }
  counts: { cuff, leg, heel, postJoin, plainFoot }
  provenance: per value "knitted" (her value) | "berechnet" (model)
  basis: nearest knitted sizes used, rule ids
}
```

Rules:

- A size she has knitted returns her values with provenance `knitted`.
- Every other value is `berechnet` until she accepts it (P1).
- Field names stay English; German labels come from `labels.ts` in 003.
