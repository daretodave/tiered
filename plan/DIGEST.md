# DIGEST — 2026-09-12

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Seven for seven again — every tracked `march` run since yesterday's
digest succeeded, zero crashes. With Rule 2 still locked (CADENCE
gap table stayed at 40 shows/41 gap-slots all window, next sweep
2026-09-13) and Rule 3 mostly exhausted (one clean extend, then a
four-thesis fresh-angle search that dead-ended on every candidate),
the loop found a new fallback lane this window: `pnpm content:check`'s
headline-to-body echo warning class. Four straight rounds
(22:45, 05:45, 10:10, 13:37) drained it tied-smallest-scope-first —
24 one-warning files, then 8 two-warning files, then 4 three-warning
files, then the last four-warning file — taking the catalog-wide
count from roughly 83 down to **27**, with the-voice's separate
37 take_h2/shape_h2 warnings still frozen behind issue #762. Pass
158 fired on schedule overnight (00:13) with 2 fresh findings, but
nothing has redirected into `plan/CRITIQUE.md`'s Pending queue yet
this window — the echo-drain lane absorbed every content-gap tick
instead. The story that still needs a human: **`e2e-full` breached
the 75-minute wall a sixth time tonight** (10,594 tests, 88.5%
complete at cutoff) — candidate #34 (shard the crawl) is now
**53 days unpromoted**. Deploy is ready at HEAD (5aa3f0dd).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 17:02–17:03 | 7e557216 / 7a093f14 / 9f4e4331 | content / audit | Rule 3 extend — `a-way-back-in` gains project-runway S22's "Siriano Save" entry (rank 14, ranks 15-17 shift) |
| 20:07 | 994c24fb | audit | Rule 3 zero-ship — 4-thesis fresh-angle search, all dead-end (2 already claimed, 1 sub-floor, 1 already covered) |
| 22:45–22:46 | dea14f7a / 0de556b9 | content / audit | echo drain round 1 — 24 one-warning files reworded, catalog echo count ~83→59 |
| 00:13 | dcf3c33d | critique | pass 158 — 2 findings (1 MED rhoc S19 repetition, 1 LOW /shows+/themes OG-image fallback) |
| 05:45 | 0e810466 / 8f8fc47b | content / audit | echo drain round 2 — 8 two-warning files, 59→43 |
| 10:10 | 1be94277 / 2c7b2170 | content / audit | echo drain round 3 — 4 three-warning files, 43→31 |
| 13:37 | 6a14e4fe / 5aa3f0dd | content / audit | echo drain round 4 — last four-warning file cleared, 31→27 |

7 of 7 tracked `march` runs since yesterday's digest (16:19 09-11
through 13:08 09-12 UTC) succeeded — no crashes, no self-heals. All
7 ticks shipped a real change; no zero-ship this window.

## The saga

**Rule 2 (season-fill drain):** fully locked all window — the
CADENCE gap table held at 40 shows/41 gap-slots (all
confirmed-but-unaired), unchanged since 09-11's finale-gate-triggered
project-runway drain. Next weekly sweep due 2026-09-13.

**Rule 3 (themed lists):** one genuine extend (`a-way-back-in` staked
project-runway S22's mentor-reclaim mechanic), then a bounded
fresh-angle search across 4 candidate theses came up fully dead-end
— consistent with issue #758's standing saturation verdict. Catalog
holds flat at **182/182** themes.

**New fallback lane — headline-to-body echo drain:** with both
content-mission rules stalled, the loop shifted its fallback target
from `plan/CRITIQUE.md` redirects (used most of last window) to
`pnpm content:check`'s own headline-to-body echo warning class —
same tied-smallest-scope-first discipline as the prior 13-round
cross-callout drain (issue #325 precedent). Four rounds this window
closed roughly 56 warnings, catalog-wide count now **27** (down from
an estimated ~83 at window start). Next-smallest remaining batch is
a tied 5-warning pair (`the-finale-broke-its-own-rulebook`,
`a-way-back-in`); the-voice's separate 37 take_h2/shape_h2 warnings
stay frozen behind the standing factual-corruption block (issue
#762).

Catalog holds flat at **68 shows / 1051 seasons / 68 canons / 182
themes / 3 legal docs** — no season, show, or theme-file count moved
this window; only content-quality rewording shipped.

## Queues now

- **`plan/CRITIQUE.md`**: pass 158 fired overnight (00:13) — 1 new
  MED (rhoc `the-resurfacing` fact repeated across lede/body/canon/
  meta), 1 new LOW (`/shows` and `/themes` hub pages fall back to the
  site-wide OG image). Neither addressed yet — the window's
  content-gap ticks all went to the new echo-drain lane instead.
  Pending section reads **41 open findings** on a direct heading
  count (39 yesterday + 2 new from pass 158), plus the same ~24
  resolved-in-place-but-not-archived rows noted yesterday (candidate
  #29's housekeeping gap, still unshipped).
- **`plan/AUDIT.md`**: 7 open rows, unchanged in count and mix: 2
  HIGH (the-voice factual corruption #762; night.yml starvation #763,
  quiet again this window — night ran clean 09-11 and is in-flight
  now), 2 MED (season-fill STANDING ROW, Rule 2 still locked;
  e2e-full duration-ceiling — sixth breach night logged), 3 LOW (SERP
  description budget; `YEAR_TENURE_RE` regex gap; heartbeat
  false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: ~28 candidates awaiting promotion
  (6 marked resolved-inline pending archival), unchanged in true
  count — no new candidate filed this window. Candidate #34 (shard
  e2e-full) got tonight's reinforcement: 88.5% completion at cutoff,
  now **53 days unpromoted**.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762 and #763
  remain the two live ones needing an actual decision, both untouched
  since 2026-08-08 (35 days now).
- **Open `triage:loop-queued`**: 5 issues (#636, #754, #785, #787,
  #806), unchanged — #636 (e2e-full tracking issue) picked up
  tonight's "Recurred" comment too. #806 (the heartbeat
  "march has flatlined" false-positive from 09-10) is worth a glance:
  march has run cleanly every 2-5 hours since, so the underlying
  report reads stale even though the hardening fix hasn't shipped
  yet.

## Needs you

1. **Candidate #34 (shard e2e-full) is now 53 days unpromoted, and
   the pattern hasn't broken.** Six consecutive nights red now
   (09-07 through 09-12). This is a `.github/workflows/e2e-full.yml`
   edit the cloud loop structurally cannot push (no `workflows` OAuth
   scope) — a local/`/oversight` session is the only path to
   promotion.
2. **the-voice factual corruption (issue #762) — premiere is 9 days
   out.** S22-29 stays frozen pending a human-reviewed 8-file
   renumbering fix. The show's live frontmatter still reads
   `status: ended`; S30 premieres 2026-09-21 (NBC).
3. **`plan/CRITIQUE.md`'s pass 158 findings are sitting unaddressed**
   for the first time in a few windows — not urgent (1 MED, 1 LOW,
   neither spoiler-adjacent) but worth noting since the loop's
   fallback attention shifted to the new echo-drain lane instead of
   its usual CRITIQUE-redirect habit. Should self-correct once the
   echo-drain's current batch clears or CRITIQUE's own escalation
   rules kick in.

## Today's intent

Content-gap ticks should keep draining the headline-to-body echo
warning class (27 remaining, next tied batch:
`the-finale-broke-its-own-rulebook` / `a-way-back-in` at 5 each)
while Rule 2 stays locked until the 2026-09-13 sweep and Rule 3
sits on a freshly-confirmed dead end. Worth a redirect back to
`plan/CRITIQUE.md`'s pass-158 findings at some point this cycle if
the echo-drain lane runs dry before the next content-mission unlock.
Top non-content finding, unchanged in kind and now sharper on
duration: candidate #34 (shard e2e-full) at 53 days unpromoted, six
consecutive nights red — this is well past the point where another
reinforcement pass adds new information; it needs an `/oversight`
decision.

## Tuning proposals

No new candidates filed tonight. One reinforcement update: candidate
#34 got tonight's breach data (10,594 tests, 88.5% completion at the
75-minute cutoff) appended to its existing write-up in
`plan/PHASE_CANDIDATES.md`, with a matching continuity update to the
source row in `plan/AUDIT.md`. This is evidence-gathering on an
already-filed, already-unpromoted candidate, not a new proposal. No
gate mistuning observed otherwise: the loop self-discovered a new
fallback lane (headline-to-body echo drain) when the CRITIQUE-redirect
queue ran short of fresh material, which is the meta-loop working as
intended rather than a stall requiring a tuning proposal. Worth
flagging for a future `/oversight` glance, not a candidate: issue
#806 (heartbeat false-positive) looks stale given 7 straight clean
march windows since it was filed — low urgency, no action taken here.
