# DIGEST — 2026-09-23

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Another clean, fully-shipping day: all 6 tracked `march` ticks in
the last 26h landed real work — zero crashes, zero no-ops. One
critique pass (168, 5 findings, 0 high), one `/expand` pass (72, 0
new candidates, 1 reinforcement), and four content-gap redirect
fixes (love-is-blind, `/themes` featured-strip badge, Real
Housewives franchise normalization, ink-master fact restatement).
Rule 2 stays locked at 42 shows/44 starred gap-slots — nothing
actionable to drain, same state as every recent digest. The
nightly `e2e-full` breadth crawl flipped back to **green**
(2026-09-23T01:15Z) after Monday night's red — the alternating
duration-ceiling pattern (candidate #34) continues with no clear
trend. Catalog holds flat at 68 shows / 1,052 seasons / 182
themes. Deploy is ready at HEAD (55b8ca2a).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 15:09–15:49 (09-22) | (prior digest) | digest | 2026-09-22 briefing |
| 19:09–19:22 (09-22) | 6f4ca613, 1650b60f | content + audit | love-is-blind Columbus subhead redirect fix |
| 22:24–23:49 (09-22) | 9e9f0910 | critique | pass 168 — 5 findings (0 high, 5 medium) |
| 00:55–01:42 (09-23) | bbbd6d3b, 49a55dd1 | content + audit | `/themes` featured-strip badge staleness redirect fix |
| 01:15 (09-23) | — | e2e-full (nightly) | **green** — reverted from 09-22's red |
| 05:48–05:59 (09-23) | 1539e9bb, 564a202d, d8460ebd | content + audit + expand | Real Housewives "The" normalization fix; pass 72 (0 new, 1 reinforcement) |
| 11:19–12:10 (09-23) | b21bb554, 55b8ca2a | content + audit | ink-master hometown-heroes fact restatement fix |

6 of 6 tracked `march` ticks shipped real work. With Rule 2 fully
starred (nothing to drain) and Rule 3 not due, every content ship
this window came from the content-gaps gate (Step 3b.5) catching
small drift issues — franchise-name normalization, a stale badge,
a subhead fix, a fact restatement — rather than new seasons. This
is the expected shape while the gap table sits non-actionable, not
a starvation symptom (matches issue #758's own quiet status).

## The saga

**Rule 2 (season-fill drain):** unchanged since 09-20's sweep —
gap table holds at **42 shows/44 slots**, every row starred
confirmed-but-unaired. No sweep due this window (weekly cadence,
last ran 09-20, next due 09-27). Structurally locked, same as
every digest since early September.

**Rule 3 (themed lists):** no ship this window; no commit touched
`content/themes/`. Catalog holds at 182 themes.

**The content-gaps redirect fallback carried the entire window.**
Four of four content ships were small drift fixes (franchise-name
normalization, a stale UI badge, a subhead restatement, a canon
fact restatement) rather than new seasons or lists — the same
pattern as recent nights, expected while both Rule 2 and Rule 3
sit idle. Catalog holds flat at **68 shows / 1,052 seasons / 68
canons / 182 themes** — no new season or list filed this window.

## Queues now

- **`plan/CRITIQUE.md`**: pass 168 (2026-09-22, commit 9e9f0910),
  5 findings (0 HIGH, 5 MED). 8 Pending rows total in the file,
  nearly all tagged `[needs-user-call]` — the mobile home catalog
  list, `/shows` desktop + mobile, `/themes` anon (×2) and authed,
  `/u/e2e` own-profile scaffold, `/shows/dragrace` + adjacent
  themes — all correctly parked for a human `/oversight` session,
  not loop-actionable. File too large for a direct `Read`; grep
  remains the only safe access path.
- **`plan/AUDIT.md`**: 7 real Pending rows (8 counting the row
  template), unchanged in substance from yesterday: 1 standing MED
  (season-fill drain, 42/44 all-starred), 2 HIGH (the-voice
  factual corruption #762, still frozen since 2026-08-08; night.yml
  starvation, candidate #35, quiet since 09-07), 1 MED (e2e-full
  duration-ceiling, candidate #34, flipped green tonight), 2 LOW
  (SERP description budget; `YEAR_TENURE_RE` teen-number gap), 1 LOW
  (heartbeat false-positive #806, no recurrence).
- **`plan/PHASE_CANDIDATES.md`**: `/expand` pass 72 ran this window
  (2026-09-23, commit d8460ebd) — 0 new candidates, 1 reinforcement.
  ~21 numbered candidates still sit "awaiting promotion." Candidate
  #34 (shard e2e-full) is now **63 days unpromoted**, still the
  file's longest-lived open item per its own pass-72 note.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762
  (the-voice) remains the oldest live urgency.
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).

## Needs you

1. **the-voice factual corruption (issue #762) is still going
   stale.** No comment since 2026-08-08; `content/shows/the-voice.md`
   still carries the corrupted seasons 22-29 and the false
   "show has ended" framing. Needs a human-reviewed 8-file fix —
   can't ship from the loop.
2. **Candidate #34 (shard e2e-full) crossed 63 unpromoted days**,
   still the single longest-lived item in `plan/PHASE_CANDIDATES.md`.
   Tonight's run went green, but the alternating pattern (red
   09-20/09-22, green 09-21/09-23) shows no clear trend — still
   blocked on a `.github/workflows/e2e-full.yml` edit the cloud
   loop cannot push (lacks `workflows` OAuth scope).
3. **8 open `triage:needs-user` issues**, several stale (oldest:
   #777 night-digest crash from 2026-08-16, #398/#399 from
   2026-06-11). Worth a sweep to close what's since been
   superseded by later fixes.

## Today's intent

Rule 2 stays locked at 42/44 starred; expect the content-gaps
redirect fallback to keep catching small drift issues until the
next weekly sweep (due 09-27) turns up a real actionable gap, or a
starred item airs. Top non-content finding: candidate #34's
63-day-unpromoted status on a chronic, cloud-unfixable e2e timeout
— still the strongest standing case for the next `/oversight`
session, just ahead of issue #762's stale-but-urgent the-voice fix.

## Tuning proposals

None filed tonight. No fresh mistuned gate observed — `/expand`
already ran this window (pass 72) and reinforced the standing #34
candidate rather than finding anything new; the content-gaps
fallback continues working as designed with no starvation symptom.
