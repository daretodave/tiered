# DIGEST — 2026-10-31

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**A productive content night (two season backfills, one new
themed list, one clean review batch) plus one real instrument
fix: the pulse's AUDIT counter has been silently reading zero
every night, and tonight's hand-count found a real HIGH
`[needs-user-call]` row hiding behind it.** Six commits since
last night's digest. Content: `borrowed-for-one-scene` (10
entries/7 shows, craft) shipped; a Rule 3 review batch cleared
the 5 oldest-due lists in `plan/LISTS.md` with no factual drift;
Bake Off Series 17 ("The Lawson Arrival," Nigella Lawson joins
the judging table) fully drained the show from the CADENCE gap
table; Hell's Kitchen Season 25 ("The Anniversary Class")
narrowed its row from `24/26, 2*` to `25/26, 1*`. The bake-off
tick also flagged three more already-premiered-but-starred rows
(`shark-tank`, `rhoslc`, `dragrace-uk`) as the next drain picks —
real, actionable Rule 2 headroom for tomorrow, a change from the
"fully starred, nothing to do" state of the last several nights.
Three `march` ticks tonight landed no commit, and — unlike the
two flagged as a mismatch last night — each one's own idle-tracker
step gave an honest, matching reason: two "lost-to-background"
(the e2e verify leg ran past its 30-minute foreground window) and
one quota-ceiling skip (`seven_day` utilization read 0.84 live,
above the 0.8 scheduled-run ceiling). No repeat of last night's
git/idle-tracker mismatch. The real finding: `scripts/pulse.mjs`'s
`countRows()` only matches `### [...]`-heading rows (the shape
`plan/CRITIQUE.md` uses); `plan/AUDIT.md` uses `- [ ] [SEV]`
dash-bullets per its own template, so every digest's
`plan/AUDIT.md: N pending` line has read 0 regardless of the true
count. Tonight's hand-count under `plan/AUDIT.md`'s `## Pending`
found 5 real open rows: the standing season-fill MED row, one HIGH
`[needs-user-call]` row (the Claude Code usage-cap outage backoff
gap, filed 2026-10-19, score 2.7 — unresolved because the fix
needs `.github/workflows/` write access the cloud loop structurally
lacks), and two LOW rows (a themed-list SERP-truncation gap, the
`YEAR_TENURE_RE` teen-number blind spot). Filed the pulse.mjs fix
as a candidate (see Tuning proposals); the needs-user-call row
itself goes under Needs you. Breadth is green (latest `e2e-full`
passed against this window's Rule 3 review-batch commit), deploy
is green, and both HIGH critique findings flagged last night are
still open, unchanged.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 10-30 19:44–20:41 | march | success — themed list `borrowed-for-one-scene` shipped (10 entries/7 shows, craft category) |
| 10-30 23:18–00:11 | march | no-op, honestly reported: `lost-to-background` (e2e verify leg exceeded its 30-minute foreground window, auto-backgrounded, no commit) |
| 10-31 00:11–00:55 | march (retry) | success — Rule 3 review batch shipped (5 oldest-due `plan/LISTS.md` lists reviewed, no factual drift, `last_reviewed` bumped) |
| 10-31 02:47–03:32 | march | no-op, honestly reported: `lost-to-background` (same cause as the 23:18 tick) |
| 10-31 03:32–04:22 | march (retry) | success — season backfill shipped (Bake Off S17 "The Lawson Arrival," fully drained, CADENCE row removed) |
| 10-31 09:31–10:07 | march | success — season backfill shipped (Hell's Kitchen S25 "The Anniversary Class," CADENCE row narrowed 2*→1*) |
| 10-31 15:30–15:33 | march | no-op, honestly reported: `quota` (seven_day utilization 0.84 ≥ 0.8 scheduled-run ceiling) |

## Shipped

- **Content (1 themed list + 1 review batch + 2 season
  backfills):** `borrowed-for-one-scene` (10 entries/7 shows —
  shark-tank, chopped, masterchef-australia,
  bachelor-in-paradise, rhony, americas-got-talent,
  hells-kitchen — strictly one-scene non-competing cameos,
  distinct from the two existing guest-promoted-to-permanent-seat
  lists). Rule 3 review batch: `the-mic-changed-hands`,
  `live-without-a-net`, `a-guest-spot-with-room-to-grow`,
  `when-age-became-the-casting-brief`,
  `the-cast-was-still-arriving` all re-swept against every season
  filed since their last review — no candidate cleared the
  excellence gate for any of the 5, `last_reviewed` bumped to
  2026-10-31 on all five with no-change narration.
- **Rule 2 (season-fill):** two drains. Bake Off Series 17 fully
  filed and the show fully drained (16/17 → 17/17, CADENCE row
  removed) — Nigella Lawson joins Paul Hollywood at the judge's
  table. Hell's Kitchen Season 25 filed, narrowing its row
  (24/26 → 25/26, gap 2*→1*) — a 25th-anniversary casting-conceit
  repeat of Season 20, one slot (Season 26) still starred and
  unconfirmed. The bake-off tick also flagged `shark-tank` (S18,
  premiered 2026-09-30), `rhoslc` (S7, premiered 2026-09-16), and
  `dragrace-uk` (S8, premiered 2026-09-03) as stale-starred rows
  already past their premiere — real headroom for the next three
  Rule 2 ticks, tie-broken by tier then `est_year`.
- **Tooling fix filed, not shipped:** `scripts/pulse.mjs`'s
  AUDIT-pending regex mismatch (see Headline) — filed as a
  candidate, not patched directly, per the digest's notes-only
  rail.

## Queues now

- **plan:** 0 specs, 0 chunks left, 0 held — unchanged.
- **plan/AUDIT.md:** pulse reads 0 (script bug — see Headline and
  Tuning proposals); the real count by hand is **5 pending**: 1
  standing MED (season-fill, always-open by design), 1 HIGH
  `[needs-user-call]` (Claude usage-cap outage backoff, filed
  2026-10-19, score 2.7 — see Needs you), 2 LOW (themed-list SERP
  truncation; `YEAR_TENURE_RE` teen-number gap). A third LOW
  (heartbeat false-positive hardening, #806) is also open but
  already carried as `plan/CANDIDATES.md`'s own [score 4.4]
  duplicate-scoped candidate.
- **plan/CRITIQUE.md:** 71 pending, last pass 5d ago (pass 193,
  commit `72f85b9b`, 2026-10-27) — unchanged in count and
  breakdown (2 HIGH / 41 MED / 28 LOW) since last night; no new
  pass ran this window (both open HIGHs keep the gate closed). 0
  `[needs-user-call]`-tagged rows (reconfirmed, matching last
  night's correction).
- **plan/CANDIDATES.md:** 22 pending (one more than last night's
  21 — tonight's pulse.mjs fix candidate, filed above). 21 of 22
  are now >21 days old (unchanged count of aged rows, since the
  new row is 0 days old itself), oldest 171d. Support (fix-all): 0
  open user issues · first response none (0 opened in 7d) · close
  2191.2h mean (6 closed in 7d) — unchanged from last night.
- **Candidate cap:** 15 (current count 22, 7 over) — no cuts
  since the last digest (`promote.mjs cuts --since 2026-10-30` →
  none).
- **Open `triage:needs-user` / `loop:do`:** 0 across both labels.
- **data/BACKLOG.md:** no data-layer backlog file exists.
- **Deploy:** ready at HEAD `2511c9ba`.
- **CADENCE gap table:** 32 shows / last logged at 34 gap-slots
  (the bake-off drain's own log line) — hells-kitchen's same-day
  narrowing (2*→1*) hasn't yet earned its own dated log-table row,
  so the table narrative is one tick ahead of its own log; actual
  current state is 32 shows / 33 gap-slots. Three rows
  (shark-tank, rhoslc, dragrace-uk) are flagged stale-starred and
  actionable for the next three Rule 2 ticks. Next full sweep due
  2026-11-03.
- **plan/LISTS.md Rule 3 review-due:** 22 lists ≥90 days since
  last review (cutoff 2026-08-02) — up from 8 after this
  morning's 5-list batch, not down: 14 more lists independently
  crossed the 90-day mark later the same day as the cutoff date
  itself advanced. Net effect: review-due count grew tonight
  despite a batch landing.
- **Breadth (`e2e-full`):** green — latest run
  (2026-10-31T02:01–02:31Z) passed against headSha `906573d2`
  (this window's Rule 3 review-batch commit); read via `gh run
  list`, not re-run, per the standing rule. The two later season
  backfills (bake-off, hells-kitchen) haven't been covered by a
  fresh nightly run yet — expected, `e2e-full` runs on its own
  daily cadence, not per-commit.
- **seven_day utilization:** unknown in the cached reading
  (`quota.mjs show`), but the 15:30 tick's own live quota gate
  read 0.84 — above the 0.8 scheduled-run ceiling, which is why
  that tick no-opped. The cache and the live gate are reading
  different things; not flagging as an anomaly (the cache is
  explicitly "night restores it, locally unknown," and tonight's
  read came from a scheduled run's own gate, not from `night`),
  but noting the live number since it's more current than
  "unknown."
- **Motion:** 26 shipped last full week (W43) vs. floor 9.5 —
  `ok`; 29 shipped so far in the current week (W44), already past
  the floor.

## Needs you

- **`plan/AUDIT.md`'s HIGH `[needs-user-call]` row has been
  invisible to every digest since 2026-10-19 — surfaced tonight
  by hand-counting around the pulse.mjs bug (see Headline).** The
  cloud loop (`march` + `night`) went dark for ~4 days
  (2026-10-15T11:15Z–2026-10-19T05:19Z) on a Claude Code
  subscription usage-cap exhaustion; 26 consecutive `march`
  failures and 2 consecutive `night` failures all burned a full
  CI run rediscovering the identical "out of extra usage" error
  before the cap reset. The mechanical fix (check the prior run's
  failure log for that exact string and skip, not fail, until the
  known reset time) needs a `.github/workflows/` edit — the cloud
  loop's `ACTIONS_PAT` lacks the `workflows` OAuth scope to make
  that change itself. Scored low (2.7: impact 9 × ease 3) because
  the ease factor already prices in that write-access gap, not
  because the underlying problem is small. Worth a look at the
  next local `/oversight` session.
- **oversight needed: candidate queue silting (21 pending >21d,
  oldest 171d).** Unchanged shape from last night; the queue grew
  by one tonight (the pulse.mjs fix candidate, itself 0 days old
  so not yet part of the aged count).
- **`Promote: aged` is live (`Improve: bold`) but the valve still
  can't turn itself from the cloud.** 8 Pending candidates clear
  both the floor (6.0) and the age bar (21d) — unchanged from last
  night: top of the stack is `[score 9.4] Show canon completeness
  lax→strict gate` (proposed 2026-06-15, 138d old). `promote.mjs
  pick` returns `ask`, not `pick`, from every cloud checkout (no
  `.owner` marker) — the intended trust boundary, not a bug.
  **auto-promoted none, 8 awaiting.**
- **Two open HIGH critique findings**, both unchanged from last
  night, both content-only one-field fixes: (1) rhoc's Homecoming
  season eyebrow says "13 seasons away" while the body says "since
  season thirteen" — two different numbers for the same gap
  (`content/shows/rhoc/seasons/20-the-homecoming.md`); (2)
  below-deck-down-under's Canouan season restates its two headline
  facts (Caribbean move, charter crossover) near-verbatim four
  times across meta description, lede, "the take," and the body's
  section-02 opener
  (`content/shows/below-deck-down-under/seasons/04-canouan.md`).
  Either is a same-shape, single-tick fix and either clears the
  critique gate for its next pass.
- No `escalate #N` rows (0 open user issues), no blocked specs
  (`Held` lane empty), no open needs-user issues, no `motion
  stalled` (this week already clears the floor), no `rotate` rows
  (0 secret-audit events; cloud run, check skipped anyway).

## Today's intent

1. Rule 2 has real headroom again: the three stale-starred rows
   flagged tonight (`shark-tank` S18, `rhoslc` S7, `dragrace-uk`
   S8, all gap=1, all tier B) are the next three drain picks,
   tie-broken by older `est_year` — `shark-tank` (2009) ahead of
   `dragrace-uk` (2019) ahead of `rhoslc` (2020).
2. Failing that, either open HIGH critique finding (rhoc's
   eyebrow/body mismatch or below-deck-down-under's four-times
   restatement) is a one-field fix that clears the gate for its
   next pass.
3. At the next local `/oversight` session: promote or weigh
   tonight's pulse.mjs fix candidate (cheap, mechanical, closes a
   real blind spot); turn the `Promote: aged` valve (8 candidates
   waiting, top-scored 9.4); weigh the candidate-queue silting (21
   of 22 pending over 21 days old); and take a look at the
   needs-user-call usage-cap-backoff row this tick's hand-count
   surfaced (filed 2026-10-19, needs workflow-file write access).

## Tuning proposals

- **`scripts/pulse.mjs`'s AUDIT pending counter always reads 0**
  — filed to `plan/CANDIDATES.md` tonight ([score 5.4]). The
  regex matches `### [...]`-heading rows (CRITIQUE.md's shape);
  `plan/AUDIT.md` uses `- [ ] [SEV]` dash-bullets per its own
  template and has never been counted correctly. Proposed fix:
  widen the AUDIT call site's matcher to also recognize
  dash-bullet Pending rows, leaving the CRITIQUE heading-match
  untouched. Single function + one colocated test.
