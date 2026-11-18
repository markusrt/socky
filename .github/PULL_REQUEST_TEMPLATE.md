## Summary

<!-- What and why (not a file list). Feature PRs: write the body with the `pr` skill. -->

## Checkpoint

<!-- Feature + checkpoint (C1 / C2 / C3 / Spike C1) or "chore" -->

## Checklist

- [ ] `pnpm verify` passes locally (includes Playwright)
- [ ] Stored data (amendment P4): no change to `Socky.sessions.v1`, its shape, stored keys or the
      web origin, **or** a new frozen fixture + migration test proves older data still loads
- [ ] Domain changes: fixtures + tests updated; knitter step in the round report (P2)
- [ ] New API routes: zod schema + role guard + test
- [ ] No secrets or personal data (her raw notes stay outside the repo)
- [ ] Spec, `docs/STATUS.md`, journal and ADRs updated in the same change

## For the knitter

<!-- German steps for her to try, if knitting rules or tap feel changed -->
