# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-13

## Headline

**A busy, healthy night — the #758 workaround is now the saga's
main engine, not a fallback.** Deploy green at HEAD (cbb28678).
Rule 2 (season-fill) stayed fully starred all night (42 shows /
43 gap-slots, nearest actionable finale american-ninja-warrior
S18 still 4 days out) and Rule 3 (themed lists) hit five more
same-day zero-ship passes on top of two genuine extends — but
rather than burn ticks on repeat searches, cloud `march` kept
redirecting into the `episodes_caption` bare-restatement drain
(CRITIQUE pass-95/117), and that queue moved hard: **248 → 140
remaining warnings**, six shows fully cleared overnight
(love-island-us, selling-sunset, queer-eye,
married-at-first-sight-australia, vanderpump-rules, big-brother,
survivor-australia — 7 shows, 65 files). One march tick failed
(31590129638, 08-12 11:03 UTC) but self-healed by the next
trigger 80 minutes later — auto-mirrored to stale issue #565, no
pattern, not actioned. `e2e-full` breadth crawl stayed red for a
third straight night on the same known duration-ceiling wall
(candidate #34, now 23 days unpromoted). All four standing
`/oversight` candidates (#33-#36) are unchanged in substance but
#33 (content-gate carve-out) keeps accumulating same-day evidence
in issue #758's thread — worth a fresh look.

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| Last 26h, `march` | 40 runs | 37 `success`, 2 `cancelled` (concurrency evictions, expected), 1 `failure` (31590129638, self-healed next trigger, mirrored to stale issue #565) |
| Commits since last digest (0c9f8fe3) | 36 | mostly `content:` episodes_caption drain + `audit:` progress notes, 2 `critique:` fixes, 1 `themed-list extend` pair, several `zero-ship`/redirect notes |
| `night` (digest) | 2 daily triggers | 08-12 **success**, this tick (08-13) running now |
| `e2e-full` breadth crawl | 2 nights (08-11, 08-12) | both **failure** — 08-11 was the distinct one-off git/TLS checkout flake noted last digest; 08-12 (run 31650237517) reverted to the standard 75-minute duration-ceiling wall, all completed checks passing, appended to issue #636 |
| `pnpm deploy:check` at HEAD | — | `ready` (0s elapsed) |

## The saga

Rule 2 stayed fully starred all night — this tick's re-check
confirmed no dated finale has crossed into the past since the
08-12 fourth sweep; the board stays locked at 42 shows / 43
gap-slots until american-ninja-warrior S18 lands 2026-08-17 or
the 08-16 weekly sweep finds something new. Rule 3 landed two
real extends today (`one-rule-fills-every-seat` 16→17,
The Apprentice S07's gender-split casting rule; and
`the-couch-kept-adding-chairs` 16→17→17, RHOSLC S06 then RHOM
S07) but also burned five same-day zero-ship passes re-confirming
the idea pool dry on other axes — consistent with the pattern
issue #758 has tracked since 08-08. On every exhausted tick,
cloud `march` fell through to the `episodes_caption`
bare-restatement drain instead of forcing a sixth search: six
redirect commits landed overnight, draining love-island-us (8
files), selling-sunset (9), queer-eye (10),
married-at-first-sight-australia (11), vanderpump-rules (11),
big-brother (12), and survivor-australia (12) — 73 files, warning
count **248 → 140** since the drain began 08-12, with **108 of
that total cleared just since yesterday's digest**. Five shows
remain: chopped (62), the-real-world (32), ink-master (16),
bake-off (16), bachelor (14) — chopped alone is now the long
pole. `/expand` has not run since pass 61 (2026-08-11, 0 new
candidates) — 2 days stale, worth a pass soon but not yet
starved.

## Queues now

- `plan/AUDIT.md`: 6 actionable Pending rows, unchanged shape
  from yesterday — 2 HIGH (the-voice factual corruption,
  candidate #36; night.yml starvation, candidate #35 — still
  quiet, no eviction since the last several nights), 1 MED
  (standing Rule 2 drain row, correctly starved), 1 MED
  (e2e-full duration-ceiling breach, candidate #34 — updated
  tonight with the 08-12 evidence, third red night in the last
  three), 2 LOW (`YEAR_TENURE_RE` teen-number gap; themed-list
  SERP-budget over-length, parked for oversight).
- `plan/CRITIQUE.md`: last pass **118**, 2026-08-13 — 4 findings
  (0 HIGH, 1 MED resolved same-day, 3 others). ~34 Pending rows
  total. The episodes_caption drain is technically a standing
  pass-95/117 row, not fresh findings — its own progress notes
  now span 8 update entries tracking the corpus-wide sweep.
- `plan/PHASE_CANDIDATES.md`: last `/expand` pass 61, 2026-08-11
  — 2 days stale. Same 4 fully-scoped unpromoted candidates as
  the last several digests: #33 (content-gate carve-out, now
  accumulating same-day evidence in issue #758's thread — six
  separate ticks today alone reasoned through the identical
  dispatch tension and chose the identical workaround), #34
  (shard e2e-full, confirmed still broken, now 23 days
  unpromoted), #35 (decouple night.yml concurrency, dormant
  risk), #36 (the-voice remediation, top priority — live harm).
  All await a local `/oversight` session.
- Open triage issues: 3 `triage:needs-user` (#758 content-gate
  starvation — now the most active thread in the repo, six new
  same-day comments; #762 the-voice corruption mirror; #763
  night.yml starvation mirror), 2 `triage:loop-queued` (#754
  Rule-3 pass-22 extend; #636 the e2e-full mirror, recurred again
  08-12 into the same stale thread). No new unlabeled issues.

## Needs you

Same four candidates as the last several digests, unchanged
priority order:

1. **Candidate #36** — the-voice factual-corruption remediation.
   Still top: a live, reader-facing false "show has ended" claim
   at the root (8 season files + frontmatter). No new spread
   caught overnight (the loop correctly keeps excluding
   `the-voice` ≥22 from all Rule 3 work), root cause unchanged
   since 2026-07-26.
2. **Candidate #34** — shard the e2e-full crawl. 23 days
   unpromoted, red again last night on the standard
   duration-ceiling wall (3rd of the last 3 nights). The fix is
   still just a workflow-file edit no cloud token can push.
3. **Candidate #35** — decouple night.yml's concurrency group.
   Still dormant — no eviction incident in the last several
   nights — but the race itself is unfixed. Cheap, worth
   bundling with #34.
4. **Candidate #33** — content-gate bug-priority carve-out. Issue
   #758's thread now has six same-day instances today alone of
   ticks manually re-deriving the same workaround this candidate
   would codify. The workaround is working well (108 warnings
   drained since yesterday via this exact path), but the
   repetition is itself the argument: worth promoting this tick,
   not just noting it again.

All four remain workflow/skill-file or multi-file edits scoped
for a local `/oversight` session, not a cloud tick.

## Today's intent

Recommend the same bundle as recent digests — #36 (the-voice,
active harm) and #34 (e2e-full sharding, long-unpromoted) as the
priority pair for the next `/oversight` session, #35 folded in
cheaply alongside #34's workflow-file edit. #33 has crossed from
"worth a fresh look" to "worth promoting" — six same-day
re-derivations of the identical workaround in one 24h window is a
strong signal the manual reasoning is now pure overhead, not
judgment. Content-wise: keep draining `episodes_caption`
smallest-cluster-first; chopped (62 files) is the new long pole
once the current run of small shows clears, and may be worth
splitting across multiple ticks rather than one mega-commit.

## Tuning proposals

None new. `plan/PHASE_CANDIDATES.md` already carries all four
live candidates (#33-#36) with tonight's evidence folded into the
`Needs you` section above rather than a new candidate filing —
the gate/cadence/ceiling shape is unchanged from yesterday, only
the urgency read on #33 shifted (flagged above, not a new
proposal).
