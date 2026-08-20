# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-20

## Headline

**The loop just came back from 4+ days of near-total silence.** Both
cloud-scheduled workflows — `march` (hourly) and `night`/`/digest`
(daily) — went dark on the exact same root cause at the exact same
time: `Your organization has disabled Claude subscription access
for Claude Code`. For `march` that meant 178 consecutive
non-success runs across 2026-08-16T07:51 UTC through
2026-08-20T09:15 UTC — one commit landed in the entire window
(`e5f2a226`, itself the tail of the last healthy stretch). For
`night` it meant `plan/DIGEST.md` frozen on its 08-15 snapshot
through three failed nights and one cancelled one (issue #777).
Recovery began 2026-08-20T09:53 UTC; this tick's commit is the
first proof the loop is genuinely back. GitHub's own auto-filer
kept stacking "Recurred" comments onto issue #565 the entire time
(178 total now) under a stale 2026-07-12 diagnosis ("prompt too
long") that no longer matches what's actually failing — #565 needs
re-triage, not another append. Both findings filed this tick:
`plan/AUDIT.md` HIGH rows (score 7.2 for the march outage, updated
score-6.4 row for the sibling night gap) and a new
`plan/PHASE_CANDIDATES.md` #37 proposing an API-key fallback / faster
alert for the next time this org-access toggle flips. Deploy green
at HEAD (`3946d123`, 0s elapsed). `e2e-full` breadth crawl recovered
too — green last night (2026-08-19, run at 23:06 UTC), after the
08-18 duration-ceiling breach.

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| Last ~26h, `march` | 47 runs | 2 `success`, 33 `failure`, 12 `cancelled` — all failures share the org-access signature above |
| Full outage window | 178 runs (2026-08-16T07:51 → 2026-08-20T09:15) | **0 successes** — 141 `failure`, 37 `cancelled` |
| Commits since last digest (`e0f68fe0`, 08-15) | 51 | 24 `content:`, 17 `audit:`, 7 `critique:`, 1 `sweep:`, 1 `expand:`, 1 (this tick's audit/candidate edits) — 50 of the 51 landed before 2026-08-16T08:09; only 1 (`critique: pass 129`) landed after the outage began |
| `night` (digest) | 5 daily triggers since 08-15 | 08-16/08-17/08-18 **failure**, 08-19 **cancelled**, 08-20 (this tick) **running/recovering** |
| `e2e-full` breadth crawl | 2 nights | 08-18 **failure** (duration-ceiling breach, standing pattern), 08-19 **success** |
| `pnpm deploy:check` at HEAD | — | `ready` (0s elapsed) |

## The saga

Content velocity is unreadable for this window because the loop
that produces it was down for 4 of the last 5 days — not a content
story, an infrastructure one. The 50 pre-outage commits (24
`content:`) landed 08-15 evening through 08-16T08:09 and are
already reflected in the last digest's numbers; nothing shipped to
the catalog since. Catalog census: **68 shows / 1,046 seasons / 181
themed lists**, up 2 seasons from the 08-15 digest (the last two
`content:` commits before the outage began).

Rule 2 (season-fill drain): per the 2026-08-16 sixth full weekly
sweep (the last one that got to run), the gap table held at **42
shows / 43 gap-slots**, every row starred (confirmed-but-unaired,
deferred pending real-world finale dates) — not actionable even
before the outage hit. The next weekly sweep was due 2026-08-23;
whether this tick's recovery gives the loop enough runway to hit
that date on schedule is worth watching. Show-add stays LOCKED
(gap table nonzero).

Rule 3 (themed lists): no visibility into same-day drain/zero-ship
cadence for 08-16 through 08-19 — the loop wasn't running. `/critique`
did get one pass through today (pass 129, 6 findings: 2 HIGH, 3
MED, 1 LOW, sampling big-brother/the-real-world/southern-charm/
project-runway) once the outage cleared, which is itself a good
sign the recovery is holding past the first tick.

## Queues now

- `plan/AUDIT.md`: **7 actionable Pending rows** (up from 6 at the
  last digest) — 3 HIGH: the-voice factual corruption (candidate
  #36, unchanged since 07-26), night-shift silent gap (candidate
  #35, now carrying a *second*, distinct-root-cause occurrence
  filed this tick), and the new march-loop outage row (filed this
  tick, score 7.2, no promoted candidate yet — see #37 below); 2
  MED (standing Rule 2 drain row; e2e-full duration-ceiling breach,
  candidate #34, green again as of 08-19 but the structural ceiling
  issue is unchanged); 2 LOW (`YEAR_TENURE_RE` teen-number gap;
  themed-list SERP-budget over-length).
- `plan/CRITIQUE.md`: last pass **129**, 2026-08-20 — 6 findings (2
  HIGH, 3 MED, 1 LOW). **30 Pending rows total**, up from 18 at the
  last digest (08-15) — the queue grew rather than drained across
  the outage window, unsurprising since fix ticks couldn't run
  either.
- `plan/PHASE_CANDIDATES.md`: last `/expand` pass was 63 (08-16,
  0 new phase-shape candidates, 2 reinforcement updates). This
  tick adds **candidate #37** (cloud org-access fallback / faster
  alert), filed directly per the meta-loop rail rather than waiting
  for the next `/expand` pass, since the underlying pulse data is
  fresh and time-sensitive. 5 candidates now await promotion: #33
  (content-gate carve-out), #34 (shard e2e-full), #35 (decouple
  night.yml concurrency), #36 (the-voice remediation, top content
  priority), #37 (new, this tick).
- Open triage issues: **8** `triage:needs-user` (#398, #399, #565,
  #586, #758, #762, #763, #777) — #565 and #777 both got fresh
  activity today (#565's 178th "Recurred" comment, #777 freshly
  triaged with root cause found). #398/#399 (June) and #586
  (07-16) remain stale one-off crashes worth a `/triage` sweep to
  close. 2 `triage:loop-queued` (#754, #636).

## Needs you

1. **The org-access toggle itself** — new top priority. Twice in 5
   weeks (issue #586 07-16, this run 08-16 through 08-20) an
   org-level "Claude subscription access disabled" toggle has taken
   the entire cloud loop fully dark for multi-day stretches, both
   times self-healing with no human comment visible in either issue
   thread. Worth checking the Anthropic org console directly rather
   than waiting for the next silent recurrence, and deciding on
   candidate #37's proposed mitigation (API-key fallback and/or a
   faster multi-failure alert).
2. **Issue #565 needs re-triage.** Its only diagnosis comment is
   from 2026-07-12 ("prompt too long") and no longer matches the
   org-access failures the title-match dedup has been silently
   filing under it since at least 08-16.
3. **Candidate #36** — the-voice factual-corruption remediation.
   Still the top content-priority item: a live, reader-facing false
   "show has ended" claim, unchanged since 2026-07-26, untouched by
   the outage (correctly still excluded from all Rule 3 work).
4. **Candidate #34** — shard the e2e-full crawl. Green last night,
   but the structural duration-ceiling issue that's bitten
   repeatedly over the last month is still unfixed.
5. **Candidate #35** — decouple night.yml's concurrency group. Its
   originally-diagnosed race is a separate, still-unfixed bug from
   this week's org-access gap — both cause the same symptom
   (silent digest gap) via different mechanisms.
6. **Candidate #33** — content-gate bug-priority carve-out, unchanged
   diagnosis, still unpromoted.

Minor, non-blocking: 3 stale `triage:needs-user` issues (#398, #399,
#586) look safe for a `/triage` sweep to close.

## Today's intent

Once the loop has run cleanly for a few more ticks (today's pass-129
critique already suggests it's holding), the priority stack is:
address the org-access root cause and #565's stale diagnosis
directly (both need a human, not a loop tick); then #36 (the-voice,
still the only live content-facing harm); #34/#35 as the
long-unpromoted workflow-reliability pair; #37 as the freshest
addition, worth deciding alongside #34/#35 since all three are
workflow-file/infra calls the cloud token can't push itself. Content
side: Rule 2 stays locked pending the 08-23 sweep or a dated finale
landing; Rule 3 and critique both have real queues to work once
ticks resume at normal cadence (30 CRITIQUE.md rows, up from 18,
give `/iterate` and critique-drain plenty to do).

## Tuning proposals

**New this tick: candidate #37** (`plan/PHASE_CANDIDATES.md`) —
proposes re-triaging issue #565, evaluating an `ANTHROPIC_API_KEY`
fallback for `march.yml`/`night.yml` so a future org-access toggle
degrades gracefully instead of going fully dark, and adding a
distinct alert for N-consecutive-same-workflow-failures so a
multi-day outage surfaces faster than a human noticing a quiet git
log. Filed directly (not waiting for the next `/expand` pass) given
how fresh and time-sensitive the underlying pulse data is — the
same org-access signature has now cost two multi-day outages in 5
weeks. #33-#36 carry no new evidence this tick beyond what's already
recorded; the outage produced no time to move them either way.
