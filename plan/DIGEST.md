# DIGEST — 2026-09-26

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean day in march itself: all 6 tracked ticks shipped real work
— zero crashes in the dispatcher. Survivor Season 51 backfilled
(premiered 2026-09-23, gap-table row closed), critique pass 171 (2
findings), a season-detail `?view=community` stray-param fix
(silent no-op → 308 redirect), and `/expand` pass 73 (1 candidate
filed, #41). The only crash this window was **last night's own
digest tick** — a transient Claude API 400 (`thinking` block
replay), not a code defect; filed to issue #817, self-resolved by
tonight's run. The nightly `e2e-full` breadth crawl went **red**
both nights (09-25, 09-26) — same chronic duration-ceiling breach
tracked since 2026-07-21 (candidate #34, now **66 days
unpromoted**), though tonight's run got much closer to the wire
(10,585/10,611 tests complete, 99.8%, all passing) than 09-25's.
Rule 2's gap table kept draining this week — 44 slots at the 09-20
sweep down to **38 today** — but every remaining slot is starred
confirmed-but-unaired, so both of today's content ticks zero-shipped
on Rule 2 and Rule 3 alike. Catalog: 68 shows / 1,053 seasons / 182
themes. Deploy ready at HEAD `c9615092`.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 15:06–15:54 (09-25) | 1371076c, e9de6844 | content + audit | Survivor Season 51 backfilled — gap-table row closed |
| 15:58 (09-25) | — | night (crash) | digest tick crashed on a transient SDK API 400 (thinking-block replay) — filed issue #817, not a code defect |
| 19:33–19:53 (09-25) | a5249c33 | critique | pass 171 — 2 findings (0 high, 2 med) |
| 22:48–23:58 (09-25) | 8d10a6e0 | content (zero-ship) | themed list — Rule 2 confirmed stalled, 2nd pass |
| 01:08 (09-26) | — | e2e-full (nightly) | red again — same 75-min duration-ceiling breach, 10,603 tests running |
| 01:24–02:10 (09-26) | c66d6e53 | content (zero-ship) | themed list — Rule 2/3 reconfirmed stalled |
| 06:35–06:47 (09-26) | f0ca2048 | expand | pass 73 — 1 candidate filed (#41, show-page ISR + client-hydrated ranking widget) |
| 11:47–12:39 (09-26) | 6fe08cc8, c9615092 | fix + audit | season-detail `?view=community` stray param now 308s away instead of silently no-oping |

All 6 tracked `march` ticks this window shipped real work — no
zero-crash caveat needed today. The only failure was the night
shift's own tick (#817), an infra-level SDK error unrelated to the
loop's code; `e2e-full` going red twice is the same known chronic
class (candidate #34), not a regression.

## The saga

**Rule 2 (season-fill drain):** Survivor Season 51 ("The Open Era")
filed this window — premiered 2026-09-23, scout-verified pre-season
facts only (location, host, cast count, twist-recurrence premise,
prize mechanic), fully spoiler-safe. Closed survivor's gap-table
row. The table has drained from **44 slots** (09-20 sweep) to **38
today** across the week's finale-shift and correction ticks, but
every one of the 37 shows / 38 slots remaining is starred
confirmed-but-unaired — both of today's dispatch attempts
(8d10a6e0, c66d6e53) found nothing actionable and zero-shipped.
Weekly sweep not due until 09-27.

**Rule 3 (themed lists):** no ship this window either; 182 themes,
unchanged.

Catalog holds at **68 shows / 1,053 seasons / 68 canons / 182
themes**.

## Queues now

- **`plan/CRITIQUE.md`**: last pass 171 (2026-09-25, commit
  a5249c33), 2 findings (0 HIGH, 2 MED) — a `/shows/dragrace`
  season-18 meta-description dangling-adjective defect and a
  missing `aria-live` region on `VotePair`. 8 Pending rows total in
  the file, most `[needs-user-call]` or single-surface content
  tweaks. File too large for a direct `Read`; grep is the safe path.
- **`plan/AUDIT.md`**: 8 Pending rows (incl. the row template). 2
  HIGH (the-voice factual corruption #762, frozen since 2026-08-08;
  a historical night.yml concurrency-starvation row from July), 1
  standing MED (season-fill drain, now 38 slots all-starred), 1 MED
  (e2e-full duration-ceiling, candidate #34, red again both nights),
  2 LOW (SERP description budget; `YEAR_TENURE_RE` teen-number gap),
  1 LOW (heartbeat false-positive #806, no recurrence).
- **`plan/PHASE_CANDIDATES.md`**: pass 73 ran today — 1 new
  candidate filed (#41, show-page `force-dynamic` Cache-Control gap,
  scoped off a pass-96 CRITIQUE finding). Candidate #34 (shard
  e2e-full) is now **66 days unpromoted**, still the file's
  longest-lived open item.
- **Open `triage:needs-user`**: 9 issues — #817 (tonight's digest
  crash) is new; #762 (the-voice) remains the oldest live urgency;
  several others are stale from June–August (#398, #399, #565,
  #586, #758, #763, #777).
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).

## Needs you

1. **Candidate #34 (shard e2e-full) crossed 66 unpromoted days.**
   Red again both nights this window, still blocked on a
   `.github/workflows/e2e-full.yml` edit the cloud loop cannot push
   (lacks the `workflows` OAuth scope). Tonight's run finished
   10,585/10,611 (99.8%) before the 75-minute wall — closer than
   09-25's run, but the trend is still governed by catalog growth,
   not test health. Still the strongest standing case for the next
   `/oversight` session.
2. **the-voice factual corruption (issue #762) is still going
   stale.** No comment since 2026-08-08; `content/shows/the-voice.md`
   still carries the corrupted seasons 22-29 and the false
   "show has ended" framing. Needs a human-reviewed 8-file fix —
   can't ship from the loop.
3. **New (self-resolving): last night's digest tick crashed on a
   transient Claude API error (#817)**, not a code defect — tonight's
   tick ran clean. No action needed unless the pattern recurs.
4. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11). Worth an `/oversight` sweep to close
   what's since been superseded.

## Today's intent

Rule 2 and Rule 3 both reconfirmed stalled today — expect the
content-gaps fallback to keep catching small drift fixes until the
09-27 weekly sweep turns up a real actionable gap, or a starred slot
airs. Top non-content finding: candidate #34's 66-day-unpromoted
status on a chronic, cloud-unfixable e2e timeout — still the
strongest standing case for the next `/oversight` session, just
ahead of issue #762's stale-but-urgent the-voice fix.

## Tuning proposals

None filed tonight. Pass 73's #41 candidate came from `/expand`'s
own gate, not a digest-observed mistuning — no fresh starvation or
gate-mistuning pattern surfaced this window; the content-gaps
fallback continues absorbing zero-ship days as designed.
