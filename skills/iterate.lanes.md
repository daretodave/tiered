# Iterate lanes

> This project's own `/iterate` audit dimensions. The kit
> re-syncs `skills/iterate.md` and never touches this file,
> so a dimension only this project audits lives here.

---

`skills/iterate.md` reads this file at one hook, through
`node scripts/plan/lanes.mjs iterate dimensions`, after its
stock dimensions. Each lane is one more dimension, lettered
back from Y (the first lane is Y, the next X, and so on) so
it never meets a stock letter. Its findings score on the
same scale and compete with the stock ones.

One block per lane. `when` is prose (the agent judges it) or
`script <path>` (exit 0 audits the dimension this tick);
absent, it always runs. `run` says what the audit reads and
what a finding looks like. `Lanes off: <name>` in
`plan/bearings.md` turns one off. No lane blocks here means
the stock dimensions only.

The example below sits inside a comment, so it is no lane.
Copy it out of the comment to make it one.

<!--
## lane: cross-links
- hook: dimensions
- when: a page shipped since the last audit
- run: every new page links to two older ones and is linked from one; each gap is a finding
- return: continue
-->

<!-- Moved from the v1 skills/iterate.md by nexus upgrade (2026-10-27): the text the kit never shipped, verbatim. Check each lane's hook and when. -->

## lane: finale-detection-gate-phase-39
- hook: dimensions
- when: as the section below says (moved verbatim from the v1 skills/iterate.md)
- run: the section below
- return: continue

### Step 0.5 — Finale-detection gate (phase 39)

```bash
node scripts/finale-gate.mjs
```

Idempotent: reads `content/calendar.yml`, files one
`category: content-gaps, source: self` AUDIT row per past finale
that has no shift note yet (HTML-comment marker dedupes — never
double-files, even after the row moves to `## Done`). A clean
no-op when nothing is due or the calendar is absent; never fails
the tick (log an unexpected I/O error and continue). A
gate-filed finale-shift row is editorially **autonomous**: the
drain that picks it up may write the spoiler-safe ranking-shift
note AND adjust `canonical_position` if warranted (oversight
2026-05-19; spoilers are P0 — frame the shift, never the
outcome).
