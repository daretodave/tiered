# DIGEST — 2026-09-27

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A second clean day: all 6 tracked `march` ticks shipped real work,
zero crashes in the dispatcher. Best news of the window — the
chronic `e2e-full` duration-ceiling breach (candidate #34, red for
most of the last week) went **green** last night
(2026-09-27T01:05 UTC, run 36284451493) after two straight failures
on 09-25 and 09-26. Content-wise Rule 2 stayed fully stalled (all
43 gap-table slots starred confirmed-but-unaired, even after the
weekly sweep found 2 fresh gaps) so both content ticks fell to
Rule 3, extending two existing themed lists rather than filing new
seasons. Also shipped: critique pass 172 (3 findings, 0 high),
Survivor 51's premiere-metadata backfilled into blurb/eyebrow/canon,
and a same-day `aria-live` a11y fix that closed a critique-filed
issue (#818) within about 3 hours of it being opened. Catalog holds
at 68 shows / 1,053 seasons / 182 themes. Deploy ready at HEAD
`dcf56c18`.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 16:13–16:24 | 64e002e0 | critique | pass 172 — 3 findings (0 high, 2 med, 1 low) |
| 19:22–20:13 | 14c072bf, ac909744 | content + audit | Survivor 51 premiere-metadata propagated to blurb, eyebrow, canon `last_revised` |
| 22:11–23:00 | 0ff3655d, 3cfb87ae | a11y + audit | `VotePair` now announces vote-state + count via `aria-live` — closed issue #818 same-day |
| 00:52–01:49 (09-27) | 4d660f64 | sweep | weekly season sweep — 2 new gaps found (married-at-first-sight S21, love-island-uk S14), gap table 38→43 (incl. a 2-row bugfix restoration) |
| — 01:05 (09-27) | — | e2e-full (nightly) | **green** — first pass since 09-22, breaking a 2-night red streak |
| 06:28–07:25 | 94b8daaa, c43cf692 | content (Rule 3) | themed-list extension — `two-coasts-one-open-call` (AGT S21 entry); Rule 2 reconfirmed stalled |
| 12:26–13:16 | e824a765, 4fc4c492, dcf56c18 | content (Rule 3) | themed-list extension — `the-ten-items-are-never-the-same-ten-items` (Alone S13 entry), now fully capped 13/13; Rule 2 reconfirmed stalled (2nd same-day tick) |

All 6 ticks shipped real work; no dispatcher crashes this window.

## The saga

**Rule 2 (season-fill drain):** fully stalled all window. The
weekly sweep (12th full pass, 00:52 tick) covered all 68 catalogued
shows via 6 scout batches, fixed a table-integrity bug (2 prior
finds — `american-ninja-warrior`, `survivor-australia` — that had
been narrated as added but never physically inserted), found 2
genuine new gaps (`married-at-first-sight` S21, `love-island-uk`
S14), and corrected 3 stale `hiatus`→`airing` status fields. Net
result: **43 gap-slots across 41 of 68 shows**, every single one
starred confirmed-but-unaired — nothing airing has actually landed
since Survivor 51 closed its row on 09-25. Both of today's dispatch
ticks (06:28, 12:26) reconfirmed the stall rather than re-running a
redundant full sweep.

**Rule 3 (themed lists):** absorbed both zero-ship days. Two
single-show list extensions landed, each grounded in a season's own
`location` frontmatter field: `two-coasts-one-open-call` (AGT S21)
and `the-ten-items-are-never-the-same-ten-items` (Alone S13, now
fully capped at 13/13). `plan/LISTS.md`'s ledger shows Rule 3's
cross-canon well is close to dry too — the day's rejected-candidate
trail (PR S22, Top Chef, Chopped, MasterChef S16) found nothing new
to stake; the standing next-unlock condition is unchanged: a Rule 2
season filing, or an oversight-authorized scout pass for facts
outside the repo's own season text.

Catalog holds at **68 shows / 1,053 seasons / 68 canons / 182
themes** — unchanged in count, since Rule 3 extended existing lists
rather than adding new ones.

## Queues now

- **`plan/CRITIQUE.md`**: last pass 172 (2026-09-26, commit
  64e002e0), 3 findings (0 HIGH, 2 MED, 1 LOW) — one of the MED
  findings (`VotePair` missing `aria-live`) was filed as issue #818
  and closed same day. File too large for a direct `Read`; grep is
  the safe path.
- **`plan/AUDIT.md`**: 9 open rows (incl. the row template) — up
  from 8 last night; the sweep's 2 new gap-table entries didn't add
  a row (Rule 2's standing row absorbs them), the net new row is a
  `[LOW]` `the-voice` tagline/ending-framing consistency note. Still
  carries the same 2 HIGH (the-voice factual corruption #762, frozen
  since 2026-08-08; a historical night.yml starvation row), 1
  standing MED (season-fill drain, now 43 slots all-starred), 1 MED
  (e2e-full duration-ceiling — candidate #34, though last night's
  run went green), 2 LOW (SERP description budget; `YEAR_TENURE_RE`
  teen-number gap), 1 LOW (heartbeat false-positive #806, no
  recurrence since filing).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass was 73
  (2026-09-26) — no new pass this window (both cadence gates stayed
  closed: critique spacing floor unmet, no pending phase/data rows).
  21 candidates sit in "awaiting promotion." Candidate #34 (shard
  e2e-full) is now **67 days unpromoted**, still the file's
  longest-lived open item — though it's worth noting to the next
  `/oversight` session that last night's green run is the first
  data point in over a week that isn't a straight breach.
- **Open `triage:needs-user`**: 9 issues, unchanged in count — #762
  (the-voice) remains the oldest live urgency; several stale from
  June–August (#398, #399, #565, #586, #758, #763, #777) plus #817
  (self-resolved digest crash from 09-25).
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).

## Needs you

1. **Candidate #34 (shard e2e-full) crossed 67 unpromoted days**,
   still blocked on a `.github/workflows/e2e-full.yml` edit the
   cloud loop cannot push (lacks the `workflows` OAuth scope).
   Last night's run went green for the first time in over a week —
   worth watching one more cycle before deciding whether the
   sharding fix is still warranted or the ceiling just needed a
   quieter night.
2. **the-voice factual corruption (issue #762) is still going
   stale.** No comment since 2026-08-08; `content/shows/the-voice.md`
   still carries the corrupted seasons 22-29 and the false
   "show has ended" framing. Needs a human-reviewed 8-file fix —
   can't ship from the loop.
3. **Rule 2 has been fully stalled for a week** (44 slots on 09-20
   down to 43 today, but every remaining slot is starred
   confirmed-but-unaired). This isn't a defect — it's the drain
   waiting on real air dates — but if it persists past the 10-04
   sweep, worth an `/oversight` look at whether Rule 3's single-show
   fallback is running dry too (per `plan/LISTS.md`'s latest
   rejected-candidate trail).
4. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11). Worth an `/oversight` sweep to close
   what's since been superseded.

## Today's intent

Rule 2 stays stalled going into the 2026-10-04 weekly sweep; expect
Rule 3's single-show list extensions to keep absorbing zero-ship
days until either a starred slot airs or an oversight-authorized
scout pass opens new cross-canon material. Top non-content signal:
candidate #34's 67-day-unpromoted status just posted its first green
night in over a week — flag it to `/oversight` as a "watch, don't
promote yet" rather than an escalation. #762's stale-but-urgent
the-voice fix remains the standing human-only item.

## Tuning proposals

None filed tonight. No fresh gate-mistuning or starvation pattern
surfaced this window — the content-gaps fallback (Rule 3) continues
absorbing Rule 2's stall as designed, and `/expand`'s cadence gates
correctly stayed closed (critique spacing floor unmet, no pending
phase/data rows).
