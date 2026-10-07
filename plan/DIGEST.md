# DIGEST — 2026-10-07

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A gap night broke the streak: last night's `night.yml` run
(2026-10-06, run 37499094983) crashed with the same `thinking`-block
API error tracked since 2026-09-25 as issue #817 — recurred, not a
new failure, so no new issue was filed, just a comment appended to
#817. That means **no digest shipped for 2026-10-06**; this briefing
covers the full ~44h window since the last one (2026-10-05T19:26Z).
In that window, 8 `march` ticks all completed successfully (6 landed
commits, 2 no-ops) — zero crashes in `march` itself, the crash was
isolated to the night-shift digest job. Content-wise it was a modest
window: one Rule 3 extend landed early (the-other-side-of-the-table,
American Idol S23), one Rule 3 research tick came up zero-ship, and
a second Rule 3 extend landed this afternoon (running-long-running-
short). A critique-redirect fix also closed out pass-182's MED
finding (the-other-side-of-the-table's skipped rank #04, renumbered
1-14). Rule 2 (season-fill) stayed fully starred all window — no
sweep due until 2026-10-11, gap table unchanged. Critique ran twice
(pass 182, pass 183), filing 3 new findings total (0 high, 1 med, 1
low from 182; 0/0/1 from 183) and closing 1 (182's own MED, same-day
redirect). `e2e-full` held green on 2026-10-07T02:06 (the only run in
window) — breadth watch stays clean. Deploy is ready at HEAD
`2a75765d`. Catalog unchanged: **68 shows / 1,058 seasons / 68 canons
/ 182 themes** (themed-list extends add entries to existing lists,
not new list files, so the count holds).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 2026-10-06 02:30–03:27 | d983e69c, f57a9b6b | content (Rule 3 extend) | the-other-side-of-the-table themed list extended with American Idol S23 |
| 2026-10-06 09:24–09:35 | f1958ad1 | critique (pass 182) | 2 findings (0 high, 1 med, 1 low) — rank-skip defect + `/themes` OG-image gap |
| 2026-10-06 16:15–16:59 | 086d6c69 | content (critique redirect) | the-other-side-of-the-table rank renumbered 1-14, closes pass-182's MED |
| 2026-10-06 21:13 | — | march (no-op) | no new work surfaced this tick |
| **2026-10-06 (night shift)** | — | **night digest crashed** | **`thinking`-block API error, recurrence of issue #817 — no briefing shipped for this date** |
| 2026-10-07 01:00–01:51 | 2d3f29fb, 990f72cb | content (Rule 3 research) | zero-ship — no thread cleared the excellence gate |
| 2026-10-07 07:42–07:52 | 5aaa3daa | critique (pass 183) | 1 finding (0 high, 0 med, 1 low) — host-caption bare-restatement recurrence |
| 2026-10-07 15:27–16:10 | be845218, 2a75765d | content (Rule 3 extend) | running-long-running-short themed list extended |

8 of 8 `march` ticks completed successfully (6 shipped real work or a
documented zero-ship, 2 no-ops); zero crashes in `march`. The one
crash in the window was the night-shift digest job itself (see
Headline), not a dispatcher tick.

## The saga

**Rule 2 (season-fill drain):** untouched this window — the 13th
full sweep ran 2026-10-04, next due 2026-10-11. Gap table holds at
**37 shows / 39 gap-slots, all starred** (confirmed-but-unaired),
unchanged. `the-voice` remains blocked behind issue #762, untouched
since 2026-08-08 (60 days now).

**Rule 3 (themed lists):** 2 extends this window (the-other-side-of-
the-table + American Idol S23; running-long-running-short), 1
zero-ship research tick in between. Mining continues to get harder
per the pattern flagged in recent digests — extends outpacing fresh
list creation. 182 lists total, unchanged (extends add entries to
existing files).

**e2e-full breadth watch:** green on the one run in window
(2026-10-07T02:06, conclusion success) — the only data point since
last digest, no second run yet tonight to confirm a streak. AUDIT.md's
duration-ceiling row (line 662) is unchanged pending the sharding fix
(candidate #34).

Catalog: **68 shows / 1,058 seasons / 68 canons / 182 themes** — no
change since last digest.

## Queues now

- **`plan/CRITIQUE.md`**: last pass 183 (2026-10-07, commit 5aaa3daa),
  1 new finding (0 high, 0 med, 1 low) — a host-caption bare-
  restatement recurrence on two fresh season pages (Traitors New
  Blood, DWTS Fall 2026), the same shape as the already-resolved
  dragrace fix, now flagged as a candidate `content-check` invariant
  rather than a one-off content fix. Pass 182 (2026-10-06, commit
  f1958ad1) filed 2 (0/1/1): the rank-skip defect (now resolved same
  window) and `/themes`' reused sitewide OG image. 92 headed findings
  total in the Pending section (1 HIGH, 58 MED, 33 LOW), up from 89 —
  net of 3 filed (2 from pass 182, 1 from pass 183), 1 of which (the
  rank-skip MED) is already marked resolved in the same window.
- **`plan/AUDIT.md`**: 7 open rows, unchanged (2 HIGH: the-voice
  factual corruption #762 frozen since 08-08, night.yml staleness row
  quiet since 09-07 — though issue #817 itself recurred this window,
  see Needs you; 2 MED: season-fill drain standing row, e2e-full
  duration-ceiling; 3 LOW: SERP description budget, `YEAR_TENURE_RE`
  teen-number gap, heartbeat false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 74
  (2026-10-04, commit 6d1d104e) — now 3 days old. 23 candidates
  pending promotion in "Considered (awaiting promotion)," unchanged.
  Candidate #29 (archive closed ledger rows) sits at **~90 days**
  unpromoted; candidate #34 (shard e2e-full) at **~78 days**
  unpromoted. No reinforcement filed either candidate this window —
  no fresh evidence beyond what's already logged.
- **Open `triage:needs-user`**: 9 issues, unchanged in count, but
  #817 (night digest crashed) got a new recurrence comment tonight
  (2026-10-06T17:22Z) — the oldest `thinking`-block-error instance of
  this bug now spans 2026-09-25 to 2026-10-06, still unresolved at the
  root per its own triage note (needs a human to pick a mitigation
  path: pin a different `claude-code-action` version, disable
  extended thinking for the night job, or file upstream).
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).
- **0 unlabeled open issues.**

## Needs you

1. **Issue #817 (night digest crashes on a `thinking`-block API
   error) just recurred for the third time** (2026-09-25, 2026-10-06)
   and cost tonight's briefing entirely — this digest had to
   reconstruct a 44h window instead of 26h. The bug is SDK-level
   (context compaction mutating a thinking block the API then
   rejects) and the repo's workflow code can't safely self-heal mid-
   run. Needs a human decision on mitigation: pin a different
   `claude-code-action` version, disable extended thinking for the
   night job specifically, or escalate upstream to Anthropic if it
   keeps recurring. This is now the sharpest fresh item on the board,
   ahead of the two long-standing candidates below.
2. **Candidate #29 (archive closed CRITIQUE.md/AUDIT.md rows) is
   still the sharpest standing item.** ~90 days unpromoted since
   filing (2026-07-09). All three append-only ledgers fail a plain
   `Read` outright at the tool's 256KB ceiling — this digest tick
   again had to work around it with targeted `grep`/`awk` reads.
3. **Candidate #34 (shard e2e-full) is ~78 days unpromoted.** Only
   one e2e-full data point this window (green, 2026-10-07T02:06) —
   not enough to call a streak either way. Root blocker unchanged:
   single-worker bottleneck, needs a workflow-file edit the cloud
   loop's token can't push.
4. **the-voice factual corruption (issue #762) is still stale** — no
   comment since 2026-08-08 (60 days), still the sole blocker keeping
   Rule 2's gap table from a hypothetically-full drain.
5. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11, now 118 days old) — worth a sweep
   alongside the items above if an `/oversight` session opens.

## Today's intent

Rule 2 stays fully starred until the next sweep (due 2026-10-11).
Rule 3 landed two extends this window with one zero-ship research
tick between them — the pattern of extends outpacing fresh list
creation continues; expect more of the same until the sweep refreshes
the board or a new concept clears the excellence gate. No fresh HIGH
critique findings; pass 183's LOW (host-caption bare-restatement) is
the most actionable pickup — it's now recurred twice (dragrace,
then Traitors + DWTS in the same tick), making a strong case for the
suggested `content-check` invariant (`collectHostCaptionBareRestatement
Issues`) rather than a third reactive content fix. Top non-content
signal is new tonight: issue #817's third recurrence, which actually
cost a full digest cycle this time — a sharper, fresher pickup than
either long-standing candidate (#29, #34) for the next `/oversight`
pass.

## Tuning proposals

None new tonight. The sharpest fresh signal (#817's recurrence) is
already a filed, labeled GitHub issue with its own triage note and
mitigation options — it doesn't need a new `PHASE_CANDIDATES.md` row,
it needs a human to pick one of the three paths already on record.
No reinforcement filed for #29 or #34 either — no fresh evidence
beyond what prior passes already logged, and restating unchanged
numbers again tonight would just be noise.
