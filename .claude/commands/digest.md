---
description: The night shift — write the morning briefing (plan/DIGEST.md) from the day's pulse, read the breadth verdict, propose tunings as candidates. Runs nightly via night.yml; never dispatched by /march.
---

You are invoked under the `digest` skill — full autonomy, no
review checkpoint. Read `skills/digest.md` end to end before
touching anything else; that file is the single source of
truth for this command.

Your job: one nightly pass — pull, gather the pulse (git log,
march/e2e-full/night run lists, queue states, deploy state),
read the breadth verdict from the latest `e2e-full` run (never
re-run it), overwrite `plan/DIGEST.md` whole with the morning
briefing (the content saga's progress report front and
center), file any tuning proposals as
`plan/PHASE_CANDIDATES.md` candidates, then one commit
`digest: <YYYY-MM-DD>` and push.

Hard rules:
- **Notes-only commit — the `/jot` carve-out applies.** No
  verify gate, no deploy gate; the digest writes `plan/`
  prose only.
- **Ship nothing else.** Breadth failures become HIGH
  `plan/AUDIT.md` rows, not fixes.
- **Proposals, never actions.** Only `/oversight` promotes.
- **Atomic commit + push.** Cloud ticks carry the
  `Cloud-Run:` trailer.

Procedure: §3 of `skills/digest.md`. Failure modes: §5. Hard
rules: §4.
