# DIGEST — 2026-11-13

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**Three quota-pause cycles this week, each recovery window
shorter than the last — but a clean stretch of real shipping
around them.** Specs 50 and 51 closed, spec 52 auto-promoted and
released from Held same day, a weekly season sweep found one new
gap, and critique pass 204 (2026-11-13 11:54Z) came back empty.
Quota utilization sits at 0.89 (allowed_warning), resets
2026-11-16T08:00:00Z. The night workflow skipped twice this week
(issues #847, #848) — both clean quota-gate no-ops, not
failures — but the gap between pauses has been shrinking
(~25.3h, then ~1.3h), which is worth a look before it becomes a
recurring stall. The queue work surfaced tonight is counting, not
shipping: `countRows()` silently excludes 17 finale-shift
`plan/AUDIT.md` rows from its own pending total (6 reported, 23
actual), and `plan/CANDIDATES.md` is sitting exactly at its
15-item pending cap.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-10 18:11 | march: content | spec 50 chunk shipped (`eb05071a`) |
| 11-10 ~22:00 | night | **skipped** — quota paused (issue #847 opened) |
| 11-11 ~23:20 | night | **skipped** — quota paused (issue #848 opened) |
| 11-12 | plan: settle | spec 51.2 settled (`4cdd2671`) |
| 11-12 | plan: close | spec 51.2 closed (`1a68659a`) |
| 11-12 | ship-a-chunk 51.1 | sentence-capitalization heuristic chunk shipped (`8554113d`) |
| 11-12 | content: weekly season sweep #18 | masterchef-australia S19 new gap filed (`08bd5a996a`) |
| 11-13 | plan: document | spec 51 spoiler-language warning documented, 51.2 (`247c1d07`) |
| 11-13 | plan: depth promotion | spec 52 auto-promoted (`d57e957d`) |
| 11-13 | plan: veto sweep | spec 52 released from Held — window closed with no veto filed; Held lane bullet removed, leaving the roadmap's Status column text stale (normal pipeline artifact) (`78fcfd1a`) |
| 11-13 11:54 | critique pass 204 | no findings (`9545e807`) |

Both night-workflow rows are confirmed clean quota-gate skips —
self-opened/closed `Loop paused: weekly quota` issues #847 and
#848 — not failures. The recovery window between them
(2026-11-10 ~22:00 → 2026-11-11 ~23:20, next pause implied by
#848's own timestamps at ~2026-11-12 ~23:20) narrowed from
~25.3h to ~1.3h — see Needs you.

## Shipped

- **Spec 51** (sentence-capitalization heuristic gate) — settled,
  code chunk 51.1 landed, spoiler-language warning documented
  (51.2), closed.
- **Spec 52** — auto-promoted via depth promotion, then released
  from its own Held veto window same day, no veto filed. The
  roadmap's Held lane is now empty.
- **Weekly season sweep #18** — one new content gap filed
  (masterchef-australia S19).
- **Critique pass 204** — ran clean, zero new findings.

## Queues now

- **plan:** 1 spec remaining, 0 chunks left, 0 held.
- **plan/AUDIT.md:** 6 pending reported, **23 pending actual**.
  The gap is a bug in `scripts/lib/plan-rows.mjs`'s `countRows()`:
  17 rows carry a same-line `<!-- finale-shift:<show>:<season>
  -->` dedup marker, and the counter's `if (opens && closes)
  continue` branch skips any row where both HTML-comment tags
  land on one line — not just genuine multi-line comment blocks.
  These are real, unresolved finale-shift rows, not noise. (Not
  "by design" as the 2026-11-10 digest assumed — no skill doc or
  prior candidate actually says this exclusion is intentional;
  that framing is corrected here. Finale-shift rows *are*
  editorially autonomous and dispatched through a different lane
  per `skills/iterate.lanes.md`, but that's a separate, true fact
  that doesn't justify undercounting them.) Filed as a candidate
  below.
- **plan/CRITIQUE.md:** 83 pending (0 HIGH, 50 MED, 33 LOW), last
  pass 204, ~18h ago.
- **candidates:** 15 pending (13 >21d), oldest 184d — **exactly at
  the 15-item pending cap**; `promote.mjs cap` reports clean (not
  over), but the next new proposal forces a cut. `promote.mjs
  sweep`: 0 of 1 auto-promotable this read (spec 52 already
  shipped — see above). `pick`/`due` on the next-strongest
  candidate ("Archive closed CRITIQUE.md/AUDIT.md rows," score
  6.4, 127d old, clears the 6.0 floor) returns `ask` rather than
  `pick` — expected, not a bug: this checkout runs non-owner
  (`night.yml` never touches `.owner`, unlike `march.yml`'s `touch
  .owner`), so the digest can see the pick but can't take it. The
  next owner-mode `/march` tick should auto-promote it.
- **support:** no open user issues, no activity to report this
  tick.

## Needs you

- **oversight needed: candidate queue silting (13 pending >21d,
  oldest 184d) — at the pending cap.** Tonight's own tuning
  proposal (below) will force a cut unless something is promoted
  or resolved first; the next owner-mode tick auto-promoting the
  score-6.4 candidate (above) would create headroom.
- **Quota pause recovery window is shrinking.** ~25.3h between
  issue #847 and #848, then an implied ~1.3h before the next
  cycle per #848's own close/reopen timestamps. Worth checking
  whether scheduling density or concurrent cloud-tick volume is
  compounding against the rolling 7-day utilization window before
  this becomes a recurring stall rather than an occasional one.
- Promote: aged — `sweep` reads 0 of 1 auto-promoted this read →
  auto-promoted none, 1 awaiting (see Queues now).
- No `cut` lines this window.
- No `rotate` lines — `secrets.mjs audit` read 0 events.
- No blocked rows, no open `[needs-user-call]` rows, no
  `triage:needs-user` / `loop:do` issues open, nothing else to
  escalate.

## Today's intent

No chunk is queued (0 chunks left across the one remaining spec).
Top finding: the `countRows()` finale-shift undercount (score 5.6
candidate, filed tonight) — fixing it will surface all 17
previously-invisible finale-shift rows into `/iterate`'s real
pending count, which the next audit tick should expect rather
than treat as a sudden regression.

## Tuning proposals

Filed two tonight, both in `plan/CANDIDATES.md`, both proposals
only — no gate, cadence, or ceiling edited directly:

1. **`countRows()` undercounts `plan/AUDIT.md` pending by skipping
   same-line `<!-- finale-shift:... -->` dedup markers**
   (`scripts/lib/plan-rows.mjs`'s `if (opens && closes) continue`
   branch). New `[score 5.6]` Pending row, with the true-vs-
   reported counts (23 vs. 6) as evidence.
2. **Cloud workflow fallback for org-level Claude access
   outages** — appended an `Update (digest 2026-11-13)` note to
   the existing `[score 5.4]` Pending row, citing this week's
   three-pause cycle and the shrinking recovery window as fresh,
   recurring evidence rather than a one-off.
