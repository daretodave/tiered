# DIGEST — 2026-11-01

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**A local `/oversight` session did more in one sitting than most
weeks of loop ticks: three open HIGH critique findings closed,
one needs-user-call cleared with a workflow-file fix, two
needs-user-call content questions resolved with real editorial
calls, one new spec built and shipped end-to-end, one real
instrument bug fixed, and three plan ledgers trimmed by
roughly 2.4MB combined.** Ten commits landed since last night's
digest — nine from a local session (08:53-09:54 local time) and
one cloud `march` tick (critique pass 194, 13:54-14:08 UTC) sitting
in between them. The local session: shipped spec 47 (canon
tier-blurb gate, `content-check` strict) ahead of its own veto
window at the owner's explicit request; fixed `quota.mjs` to
recognize the plain-text "out of usage" error (closing the HIGH
`[needs-user-call]` row that's sat open since 2026-10-19 — the
4-day cloud-loop outage backoff gap); fixed `pulse.mjs`'s
AUDIT-pending counter (the bug last night's digest surfaced, now
reading 5 instead of a silent 0); resolved both open needs-user
content calls (Naked and Afraid's off-by-one season numbering —
turned out to be a genuine PSR S4 claim needing its own new LOW
row, not a numbering bug; The Apprentice S5 rewritten as "The
Open Draft" after scout research confirmed it was NYC-based, not
LA); closed the rhoc-homecoming and canouan HIGHs flagged two
nights running; and adopted an upstream nexus kit update
(`ca3c79f`) that retunes the promotion valve — `promote_after_days`
7 (was 21), `promote_queue_depth` 2 (was 0, now live for
`/march` itself), `promote_prefer: product`. The one cloud tick
(critique pass 194) filed a HIGH (hells-kitchen's canon
methodology text still said "twenty-four seasons" against a
"25 SEASONS IN CANON" header) that a follow-up local commit
closed the same morning. Three of today's four scheduled `march`
runs no-opped on the same cause: `seven_day` quota utilization
(0.84, 0.84, then 0.89) at or above the 0.8 scheduled-run
ceiling — worth watching, not yet acting on. Breadth is green
(latest `e2e-full` passed, though against last night's digest
commit — today's nine-commit local session hasn't had a fresh
nightly run yet). Deploy is green at HEAD `94a602dc`.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-01 02:08–02:11 | march | no-op, honestly reported: `quota` (seven_day utilization 0.84 ≥ 0.8 scheduled-run ceiling) |
| 11-01 08:53–09:54 (local, 9 commits) | oversight | success — spec 47 shipped, 3 open HIGH critique findings closed, 1 HIGH + 2 content needs-user-call rows resolved, pulse.mjs + quota.mjs fixed, nexus kit `ca3c79f` adopted, plan ledgers trimmed ~2.4MB |
| 11-01 09:47–09:50 | march | no-op, honestly reported: `quota` (seven_day utilization 0.84 ≥ 0.8 scheduled-run ceiling) |
| 11-01 13:54–14:08 | march | success — critique pass 194 shipped (3 findings: 1 HIGH, 0 MED, 2 LOW) |
| 11-01 16:47–16:50 | march | no-op, honestly reported: `quota` (seven_day utilization 0.89 ≥ 0.8 scheduled-run ceiling) |

## Shipped

- **Engineering (1 spec + 3 fixes):** spec 47 — canon tier-blurb
  gate (`scripts/content-check.ts`, `CANON_TIER_BLURB_STRICT`): a
  visible tier band whose fallback text equals its fixed headline
  (today's S tier) now fails `content:check`, same for a visible A
  band missing `tier_a_blurb`; tier headlines moved to
  `src/lib/canon/tier-bands.ts` so the gate compares real strings;
  backfilled `tier_a_blurb` on five shows. Built ahead of the
  auto-promoted candidate's own veto window (#829, closed same
  day) at the owner's request — one open follow-up left
  deliberately ungated: three 31+-entry canons (chopped,
  dancing-with-the-stars, the-real-world) render a C band with no
  `tier_c_blurb`. `scripts/cloud/quota.mjs` gained
  `capFromText()`/`capResetAt()` to recognize the plain-text
  "out of (extra) usage · resets <time> (UTC)" result that the
  structured `seven_day` reader never caught — this is what let
  the 2026-10-15–10-19 outage burn 26 consecutive failed `march`
  ticks rediscovering the same exhausted state; `night.yml` gained
  the same governor it never had. `scripts/pulse.mjs`'s
  `countRows()` moved to `scripts/lib/plan-rows.mjs`, now counts
  both `### [...]`-heading and `- [...]`-dash-bullet Pending rows
  (AUDIT reads 5 instead of 0). A fourth fix kept the e2e
  per-commit gate flat and reset the local stack cleanly on
  Windows.
- **Content (2 needs-user-call resolutions + 1 critique-HIGH
  batch):** Naked and Afraid's premiere dates corrected (15 of 19
  were wrong) — the earlier numbering question turned out to be a
  genuine new finding, not an off-by-one bug (filed as a new LOW
  AUDIT row on the S4 PSR claim). The Apprentice S5 retitled "The
  Open Draft" and rewritten NYC-based (not LA) per scout-verified
  Wikipedia/pogdesign/Cornell Sun sourcing — legacy slug 308s.
  Hells-kitchen's canon methodology text corrected to "twenty-five
  seasons" (critique pass 194 HIGH, closed same morning). rhoc's
  homecoming eyebrow/body gap-count mismatch and
  below-deck-down-under's four-times-restated canouan facts both
  rewritten (both HIGHs open two nights running — see last night's
  digest).
- **Plan hygiene:** `plan/CANDIDATES.md` 482→226KB (header
  trimmed, 55 pass-note comments + 1 digest comment stripped, 13
  Promoted/Rejected rows older than 30 days condensed, all 21
  then-Pending rows tagged `kind:`); `plan/AUDIT.md` 1300→178KB
  (240 Done rows closed before 2026-10-02 deleted, the standing
  season-fill row's 740 progress notes trimmed to the latest 3 +
  a pointer); `plan/CRITIQUE.md` 906→177KB (5,136 lines of pass
  narrative cut to four header lines, 187 Done rows before
  2026-10-02 deleted) — zero open-row counts changed by any of
  this (5 / 71 pending before and after their respective trims).
- **Candidate pulse.mjs fix** (filed as a candidate last night,
  score 5.4) was built directly rather than left pending.

## Queues now

- **plan:** 0 specs, 0 chunks left, 0 held — unchanged (spec 47
  shipped and archived the same session it was built).
- **plan/AUDIT.md:** 5 pending (now reading correctly —
  `pulse.mjs` fix, see Shipped): 1 standing MED (season-fill,
  always-open by design), 1 new LOW (Naked and Afraid's S4 "PSR
  formalized" claim plus three sibling founding-era-language
  issues, filed today), 1 LOW (themed-list SERP-truncation
  budget, parked for oversight), 1 LOW (`YEAR_TENURE_RE` teen-number
  blind spot, scoped-but-not-simple), 1 LOW (heartbeat
  false-positive alert, #806). The HIGH `[needs-user-call]`
  usage-cap row that was invisible to every digest since
  2026-10-19 is now resolved (see Shipped) — 0 open
  `[needs-user-call]` rows remain in this file.
- **plan/CRITIQUE.md:** 71 pending (0 HIGH / 41 MED / 30 LOW),
  last pass 194 (commit 37bc90d4 per the file header, filed
  13:54-14:08 UTC today). All three HIGHs open at last night's
  digest (hells-kitchen methodology, rhoc homecoming, canouan
  restatement) are now closed. 0 `[needs-user-call]`-tagged rows.
- **plan/CANDIDATES.md:** 20 pending (down from 22 — one shipped
  directly, one promoted to spec 47). 19 of 20 are >21 days old
  (down from 21 of 22), oldest 172d (`Newsletter subscribe` filed
  2026-05-14). **Candidate cap: 15 (current 20, 5 over) — the cap
  valve (`promote.mjs cap`) has 5 of 5 over-cap rows due for a
  stale cut (lowest-scoring, 60+ days old): the newsletter-embed
  row (171d), the `/u/[handle]` stat-chip scaffold (139d), the
  `/shows` B-tier filter (113d), the cloud-outage-fallback row
  (73d, now largely superseded by today's quota.mjs fix), and the
  `lastRevised(scope)` helper (137d) — not yet cut (no `--write`
  run since the last digest; `promote.mjs cuts --since 2026-10-31`
  → none).** Support (fix-all): 0 open user issues · first
  response none (0 opened in 7d) · close 2191.2h mean (6 closed
  in 7d).
- **`Promote: aged` revalued today** (nexus adopt `ca3c79f`):
  `promote_after_days` 21→7, `promote_queue_depth` 0→2 (so
  `/march` itself, not just `/expand`, can now promote, once the
  roadmap carries fewer than 2 open specs — it carries 0),
  `promote_prefer: product`. Under the new knobs, 7 Pending rows
  clear the floor (6.0) and the 7-day age bar; `promote.mjs due`
  ranks the sole eligible `kind: product` row
  (`Signed-in header handle affordance`, score 6.6, 137d) ahead
  of three higher-scoring `kind: guard` rows (8.7, 8.3, 7.5) per
  the new `prefer: product` rule, and returns `ask`, not `pick`,
  from this cloud checkout (no `.owner` marker — the intended
  trust boundary). **auto-promoted none, 7 awaiting.**
- **Open `triage:needs-user` / `loop:do`:** 0 across both labels.
- **data/BACKLOG.md:** no data-layer backlog file exists.
- **Deploy:** ready at HEAD `94a602dc`.
- **plan/CADENCE.md gap table:** 32 shows / 33 gap-slots (per the
  standing AUDIT row's own progress log; the table's own last
  dated row, 2026-10-31, is one tick behind at 34 — unchanged
  today, no Rule 2 drain landed in this window). Three rows
  remain immediately actionable: `shark-tank` (S18, est_year 2009),
  `dragrace-uk` (S8, est_year 2019), `rhoslc` (S7, est_year 2020) —
  all gap=1, tier B, tie-broken oldest-`est_year`-first.
- **plan/LISTS.md Rule 3 review-due:** 22 lists ≥90 days since
  last review (cutoff 2026-08-03) — unchanged from last night's
  count; oldest is `the-schedule-didnt-ask-permission` (last
  reviewed 2026-08-01).
- **Breadth (`e2e-full`):** green — latest run
  (2026-11-01T01:51–02:19Z) passed against headSha `94b4ee7b`
  (last night's digest commit); read via `gh run list`, not
  re-run, per the standing rule. Today's nine-commit local session
  and the one cloud critique commit haven't been covered by a
  fresh nightly run yet — expected, `e2e-full` runs on its own
  daily cadence.
- **seven_day utilization:** 0.89 cached (`allowed_warning`,
  resets 2026-11-02T08:00:00Z) — climbing across today's three
  live quota reads (0.84 → 0.84 → 0.89), each one above the 0.8
  scheduled-run ceiling and each one correctly no-opping its
  `march` tick rather than running hot. Not yet a `[needs-user-call]`:
  the gate is doing exactly what it's designed to do.
- **Motion:** 26 shipped last full week (W43) vs. floor 9.5 —
  `ok`; 36 shipped so far this week (W44), already well past the
  floor (today's 9-commit local session is most of that jump).

## Needs you

- **oversight needed: candidate queue silting (19 pending >21d,
  oldest 172d).** Mechanically unchanged in shape from last night
  despite today's big session — the session retuned the promotion
  machinery (knobs, nexus kit) and shipped two candidates out of
  the queue, but didn't triage the aged backlog itself. Given
  today's revised `Promote: aged` knobs (7d age bar, `floor` 6.0,
  `prefer: product`) already surface a ranked, scored shortlist —
  7 eligible, top pick `Signed-in header handle affordance`
  (score 6.6) — the next `/oversight` session has a live
  pick ready rather than a cold read of the queue.
- **5 `plan/CANDIDATES.md` rows are due for the cap's stale cut**
  (`promote.mjs cap`, no `--write` run yet — see Queues now for
  the list). Mechanical and low-stakes; either let the next
  `/march`/`/expand` tick apply it or review the 5 by hand first
  (the cloud-outage-fallback row in particular may now be
  partially moot given today's `quota.mjs` fix).
- **Three 31+-entry canons (chopped, dancing-with-the-stars,
  the-real-world) render a C tier band with no `tier_c_blurb`** —
  spec 47's own commit flagged this as a deliberate, not-yet-gated
  gap, distinct from the S/A gate it shipped. Worth a look before
  it's forgotten as "already handled."
- No `escalate #N` rows (0 open user issues), no blocked specs
  (`Held` lane empty), no open needs-user issues, no `motion
  stalled` (this week already clears the floor by a wide margin),
  no `rotate` rows (0 secret-audit events; cloud run, check
  skipped anyway).

## Today's intent

1. Rule 2 has three ready picks, unchanged from two nights ago:
   `shark-tank` (S18, est_year 2009) first, then `dragrace-uk`
   (S8, 2019), then `rhoslc` (S7, 2020) — all gap=1, tier B.
2. The candidate-cap's 5 stale-cut rows (see Needs you) are a
   clean, mechanical `/expand` or `/march` pickup if Rule 2/Rule 3
   both fall through.
3. At the next local `/oversight` session: the candidate queue's
   7 now-eligible rows under the retuned `Promote: aged` knobs are
   ready for a real pick (top: `Signed-in header handle
   affordance`, score 6.6); the chopped/DWTS/real-world C-band
   blurb gap from spec 47 is a small, scoped follow-up; and the
   climbing `seven_day` quota reading (0.84→0.89 today) is worth a
   glance even though the gate is behaving correctly.

## Tuning proposals

- None filed tonight — today's local `/oversight` session already
  absorbed the open tuning question from last night's digest
  (the `pulse.mjs` AUDIT counter) by building it directly, and
  retuned the promotion valve itself (nexus kit `ca3c79f`) rather
  than leaving it as a candidate. No new mistuned gate surfaced in
  tonight's pulse.
