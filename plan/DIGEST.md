# DIGEST — 2026-09-08

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean, fully-green day again: all 6 tracked `march` runs since
yesterday's digest succeeded, no crashes, no self-heals, and — for
once — zero no-ops, every tick shipped something. Critique pass 155
filed 3 fresh findings (1 HIGH, 1 MED, 1 LOW) and its HIGH landed
same-day: a finale-outcome spoiler (Too Hot to Handle S06's
multi-winner prize split) was live in four flagged places plus a
fifth the fix surfaced on its own, drained from `lede`,
`episodes_caption`, markdown body, `watch_list`, `canon.md`, and two
themed-list entries in one commit. Two older Pending-queue fixes also
shipped: pass-141's season-title doubling and pass-140's
canon-rank/season-number caption ambiguity. Content ran on the same
Rule-3 fallback as yesterday — two themed-list extends
(same-crown-new-price-tag/American Ninja Warrior S18) — while Rule 2
stays fully stalled. The one real miss, again: `e2e-full` breached the
75-minute wall for a **third consecutive night** (85.4% complete
tonight, back down from 09-07's 86.9%), pushing candidate #34 (shard
the crawl) to **48 days unpromoted**. Deploy is ready at HEAD
(2e37fa94). Nothing needs a same-day fire drill, but the two
workflow-file candidates are now firmly into their second month
unpromoted with an unambiguous, unchanged signal.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 12:57 | feaa460a / 0c1b1ae8 | content / audit | themed-list extend — a-way-back-in (America's Got Talent S05); content-gap progress note — Rule 2 stall, fell through to Rule 3 |
| 18:32 | 14d25ca1 / b8803085 | content / audit | fix host-name spelling mismatch — american-ninja-warrior the-tripleheader (critique pass-154) |
| 22:08–22:09 | 6b59d8dd / 1801095d / 7d1ba365 | content / audit | themed-list extend — same-crown-new-price-tag (American Ninja Warrior S18); ledger update; progress note |
| 00:30–00:40 | ba9d44dc / 891a8bfe | content / audit | fix adjacent-in-canon caption disambiguates canon rank vs season number (critique pass-140) |
| 04:28 | 84725b81 | critique | pass 155 — 3 findings (1 high, 1 medium, 1 low) |
| 09:40 | 0c665f5d / 9ae7c653 | content / audit | remove finale-outcome spoiler — too-hot-to-handle S06 (critique pass-155 HIGH, same-day) |
| 14:38–14:39 | a178205a / 2e37fa94 | content / audit | fix season page title doubling (critique pass-141 LOW) |

6 of 6 tracked `march` runs since yesterday's digest (12:13 09-07
through 13:51 09-08 UTC) succeeded — no crashes, no self-heals, no
dedupe absorptions, and every single one shipped a real change (no
no-op ticks logged this window).

## The saga

**Rule 2 (season-fill drain):** stayed fully stalled — the ninth full
weekly sweep (2026-09-06) reconfirmed all 41 gap-table rows (42
gap-slots) as confirmed-but-unaired; nothing drained, nothing new
found. Next full sweep due 2026-09-13. `show-add` stays LOCKED.

**Rule 3 (themed lists):** one extension tick this window —
`same-crown-new-price-tag` gained a rank-5 entry for American Ninja
Warrior S18, reworked around the pool-growth fact after the pass-155
spoiler fix touched the same list. List count holds at 181/181 per
issue #758's saturation finding — an extension under the entry cap,
not a new list.

**Content-gap redirect:** with Rule 2 and Rule 3 both
stalled/saturated for new work, three ticks pulled from the
`/critique` Pending queue instead — the pass-154 host-name spelling
fix, the pass-155 HIGH spoiler (same-day), and the pass-141/pass-140
LOW/MED caption fixes. This is the same redirect pattern digest has
reported for weeks: mechanical fallback classes keep the dispatcher
shipping real fixes while the two primary rules stay gated.

Catalog holds at **68 shows / 1049 seasons / 68 canons / 181 themes /
3 legal docs** — flat this window, as expected with Rule 2 stalled
and Rule 3 confined to within-cap extensions.

## Queues now

- **`plan/CRITIQUE.md`**: pass 155 (today) filed 3 findings; 1 (the
  HIGH spoiler) shipped same-day. Pending section: **59 findings on
  file, 19 marked RESOLVED-but-not-archived, 40 still genuinely
  open** — flat vs. yesterday's 40 (today's redirect cleared as many
  rows as pass-155 added). Candidate #29 (archive closed rows out of
  the ledger) remains the standing fix for the accounting side.
- **`plan/AUDIT.md`**: standing rows unchanged in count — the
  season-fill STANDING ROW (MED, stalled since 08-30 sweep), 2 HIGH
  (the-voice factual corruption issue #762, unchanged; night.yml
  concurrency-starvation issue #763 — now **5 clean night.yml runs in
  a row**, 09-03 through tonight), 1 MED (e2e-full duration-ceiling,
  breached a third consecutive night), 2 LOW (SERP description
  budget; `YEAR_TENURE_RE` regex gap).
- **`plan/PHASE_CANDIDATES.md`**: ~21 candidates awaiting promotion.
  Candidate #34 (shard e2e-full) got a two-night reinforcement update
  this tick (09-07 + 09-08, neither previously logged) — now **48
  days unpromoted**, still the standing `/oversight` recommendation.
  Candidate #35 (decouple night.yml's concurrency group) has gone
  five clean nights with no new occurrence to reinforce.
- **Open `triage:needs-user`**: 8 issues, several stale — #762 and
  #763 are the two live ones needing an actual decision, both
  untouched since 2026-08-08 (31 days).
- **Open `triage:loop-queued`**: 4 issues (#636, #754, #785, #787) —
  same set as recent digests. #636 (e2e-full tracking issue) picked
  up its 41st and 42nd "Recurred" comments tonight and last night.
- **`plan/CRITIQUE.md` `[needs-user-call]` rows**: 6 open, unchanged
  — all genuine editorial-judgment calls (home page compact-tile
  cap, `/shows` B-tier sub-grouping, `/themes` stat-chip label,
  `/u/e2e` record scaffold, dynamic-vs-ISR caching split) already
  routed for `/oversight`, none auto-resolvable.

## Needs you

1. **Two ready-to-apply workflow-file fixes, both roughly seven weeks
   unpromoted, both blocked from cloud push** — candidate #34 (shard
   the e2e-full crawl, 48 days) and candidate #35 (decouple
   night.yml's concurrency group, 42 days at last reinforcement, now
   quiet for 5 nights). `e2e-full` has now breached on 3 consecutive
   nights (85.4%, 86.9%, 85.4% at the wall), reinforcing that the
   single-worker throughput ceiling — not variance — is the real
   bottleneck. Both candidates are unchanged in scope since filing
   and sitting only on a local/`workflows`-OAuth-scope session.
2. **the-voice factual corruption (issue #762) — 13 days to
   premiere.** S22-29 stays frozen pending a human-reviewed 8-file
   renumbering fix. The show's live frontmatter still reads
   `status: ended`; S30 premieres 2026-09-21 (NBC).
3. **CRITIQUE.md Pending queue is holding flat at 40 unresolved**,
   not shrinking — the content-gap redirect drains about as fast as
   critique files new rows, but no faster. Not urgent, just worth
   naming: the redirect alone won't work the backlog to zero, only
   keep it from growing.

## Today's intent

Content-gap ticks should keep pulling from CRITIQUE.md's Pending
queue while Rule 2 stays locked until the 2026-09-13 sweep and Rule 3
stays saturated at 181/181 outside of within-cap extensions. Top
non-content finding: candidate #34 (shard e2e-full) is now 48 days
unpromoted with three consecutive red nights of fresh evidence behind
it — the structural fix (Playwright `--shard`) is fully scoped and
waiting only on a local `/oversight` session with `workflows`
OAuth scope.

## Tuning proposals

None filed as new candidates tonight. No gate mistuning observed:
critique fired on schedule (pass 155, including a same-day P0 spoiler
fix), the content-gap redirect kept handling the dual-stall gap as
designed, and all 6 march runs finished clean with zero no-ops. The
one live infra candidate with fresh data (#34) got a two-night
reinforcement update rather than a new proposal — it already exists
and remains `/oversight`'s call, now 48 days unpromoted. Three
consecutive e2e-full breaches (09-06 through tonight) is worth
flagging as a settled trend, not a new finding: the structural fix
candidate #34 already names is the only thing that changes this
pattern — another timeout bump was explicitly rejected at the 50→75
change and would only buy a few more weeks.
