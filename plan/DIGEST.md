# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-15

## Headline

**A new well opened and got drained the same day — the leanest-margin
story from yesterday reversed.** `take_h2` (season-page Section 01 H2
verbatim-restating H1) went from undrained to fully absorbed: two
same-day redirect passes covered 16 seasons across 7 shows. Alongside
it, `/critique` had its strongest single-day drain on record — passes
122/123/124 (7 findings total) plus eleven same-day `critique drain`
fix commits pulled `plan/CRITIQUE.md`'s Pending count from 33 down to
**18 rows**. Only 3 same-day Rule-3 (themed-list) zero-ship passes
logged today, versus 10-11 on each of the two diagnosis days — the
two thinner substitute wells (critique, expand) that candidate #33
worried about didn't need to carry the day alone. Rule 2 (season-fill)
stayed fully starred all day (35 shows / 36 gap-slots, unchanged).
Deploy green at HEAD (`6bd535e`). `e2e-full` broke red again last
night — fourth breach in five nights, same 75-minute duration-ceiling
wall, appended to the same tracked AUDIT row and issue #636.

## While you were out

| Window | Ticks | Outcome |
|---|---|---|
| Last ~26h, `march` | 40 runs | 32 `success`, 8 `cancelled` (concurrency evictions, expected), 0 `failure` |
| Commits since last digest (`c286056a`) | 39 | 22 `content:`, 8 `audit:`, 6 `critique:`, 3 `fix:` |
| `night` (digest) | 2 daily triggers | 08-14 **success**, this tick (08-15) running now |
| `e2e-full` breadth crawl | 1 night (08-14) | **failure** — run `31849116863`, standard 75-minute duration-ceiling wall, `10547` tests declared, 9,187 completed (87.1%), fourth breach in the last five nights |
| `pnpm deploy:check` at HEAD | — | `ready` (0s elapsed) |

## The saga

Rule 2 stayed fully starred all day — no new dated finale crossed
into the past, gap table unchanged at 35 shows / 36 gap-slots (68
catalogued). Next weekly sweep due 2026-08-16.

Rule 3 (themed lists) landed one real extend today
(`the-calendar-moved-the-format-didnt`, `d06612b2`) plus a
repetitive-template variation fix (`28c0d1c1`), then only 3 same-day
zero-ship passes — a sharp drop from the 10-11 seen on each of the
last two diagnosis days. The reason: two substitute wells carried the
load instead. `take_h2` — a content-check warning class flagging
season pages whose Section 01 H2 verbatim-restates the page H1 — went
from untouched to fully drained in two passes (`1c1fdad6`: 8 seasons
across 5 shows; `aca233c2`: 8 seasons across 2 shows; both mirrored as
`audit:` rows). And `/critique` ran its strongest single-day stretch
on record: three passes (122 — 2 findings, 123 — 2 findings, 124 — 3
findings) plus eleven same-day `critique drain` commits fixing
specific findings (traitors-uk castle-included/body echoes, Top Chef
Carolinas duplication, shark-tank canon repetition, survivor S50
fan-vote list duplication, a `ListDetailHero` unique-shows fix, an
adjacent-list opener duplication, a chopped premiere_caption
duplication) pulled `plan/CRITIQUE.md`'s Pending count from 33 down
to **18 rows** — the lowest in weeks.

Net for candidate #33 (the content-gate starvation finding, issue
#758): today is evidence *against* the "leanest margin yet" framing
from yesterday's digest, not for it — the fallback margin oscillates
well-to-well rather than thinning monotonically. `take_h2` is now
itself a spent well after today (same finite-well pattern
`episodes_caption` followed to corpus-zero), so tomorrow's supply
still depends on critique's schedule-driven refill or a fresh Rule 3
axis. Update appended to candidate #33 in `plan/PHASE_CANDIDATES.md`.

Catalog census: 68 shows / 1,046 seasons / 181 themed lists — flat
vs. yesterday, as expected with Rule 2 fully starred.

## Queues now

- `plan/AUDIT.md`: 6 actionable Pending rows, same shape as
  yesterday — 2 HIGH (the-voice factual corruption, candidate #36,
  unchanged since 2026-07-26; night.yml starvation, candidate #35,
  still quiet — no eviction incident logged recently), 1 MED
  (standing Rule 2 drain row, correctly starved), 1 MED (e2e-full
  duration-ceiling breach, candidate #34 — updated tonight with
  08-14's evidence, fourth breach in five nights), 2 LOW
  (`YEAR_TENURE_RE` teen-number gap; themed-list SERP-budget
  over-length, both parked for oversight).
- `plan/CRITIQUE.md`: last pass **124**, 2026-08-15 — 3 findings (0
  HIGH, 0 MED, 3 LOW). **18 Pending rows total, down sharply from 33**
  at the last digest — today's three-pass, eleven-fix drain stretch
  is the strongest single-day reduction on record.
- `plan/PHASE_CANDIDATES.md`: no new `/expand` pass today (last was
  pass 62, 2026-08-14, 0 new candidates) — file untouched except for
  tonight's digest updates to #33 and #34. Same 4 fully-scoped
  unpromoted candidates as the last several digests: #33
  (content-gate carve-out — tonight's update notes the margin
  recovering, not thinning further), #34 (shard e2e-full, 25 days
  unpromoted, red again last night), #35 (decouple night.yml
  concurrency, dormant risk), #36 (the-voice remediation, top
  priority — live harm, unchanged since 2026-07-26). All await a
  local `/oversight` session.
- Open triage issues: **7** `triage:needs-user` total, but only 3 are
  active threads (#758 content-gate starvation, last comment 08-14;
  #762 the-voice corruption mirror; #763 night.yml starvation
  mirror) — the other 4 (#398, #399 both from 2026-06-11; #565 from
  2026-07-12, last touched 08-12; #586 from 2026-07-16, last touched
  07-20) are old one-off cloud-tick crashes that self-healed on the
  next retry per `plan/AUDIT.md`'s own notes, and look like they were
  never closed after triage. Worth a `/triage` sweep to close the
  stale four rather than leaving them inflating the queue count. 2
  `triage:loop-queued` (#754 Rule-3 pass-22 extend; #636 the e2e-full
  mirror, recurred again 08-14 into the same staleness-bounded
  thread). No new unlabeled issues.

## Needs you

Same four candidates as the last several digests, unchanged priority
order:

1. **Candidate #36** — the-voice factual-corruption remediation.
   Still top: a live, reader-facing false "show has ended" claim at
   the root (8 season files + frontmatter). No new spread caught (the
   loop correctly keeps excluding `the-voice` ≥22 from all Rule 3
   work), root cause unchanged since 2026-07-26.
2. **Candidate #34** — shard the e2e-full crawl. 25 days unpromoted,
   red again last night on the standard duration-ceiling wall (4th
   of the last 5 nights). Still just a workflow-file edit no cloud
   token can push.
3. **Candidate #35** — decouple night.yml's concurrency group. Still
   dormant — no eviction incident in the last several nights — but
   the race itself is unfixed. Cheap, worth bundling with #34.
4. **Candidate #33** — content-gate bug-priority carve-out. Today's
   evidence cuts the other way from yesterday's — the fallback
   margin recovered on a fresh `take_h2` well plus a record critique
   drain — but the structural diagnosis is unchanged: every
   substitute well is either finite (now including `take_h2`, spent
   after today) or schedule/posture-gated (critique, expand). Worth
   promoting alongside the other three, not deprioritizing because
   one good day landed.

Minor, non-blocking: 4 stale `triage:needs-user` issues (#398, #399,
#565, #586) look safe for a `/triage` sweep to close — self-healed
one-off crashes, no live thread activity in 3-9 weeks.

## Today's intent

Same bundle as recent digests — #36 (the-voice, active harm) and #34
(e2e-full sharding, long-unpromoted) as the priority pair for the
next `/oversight` session, #35 folded in cheaply alongside #34's
workflow-file edit, #33 still worth promoting on its unchanged
structural diagnosis despite today's margin recovery. Content-wise:
Rule 2 stays locked until a dated finale lands or the 08-16 sweep
finds something; Rule 3's idea pool still needs either fresh raw
material or a fresh axis class; `take_h2` is now spent as a redirect
target, so tomorrow's zero-ship pressure likely lands on critique's
18-row queue or a fresh `/expand` pass. A `/triage` sweep to close
the 4 stale needs-user issues would tidy the queue at no risk.

## Tuning proposals

None new. `plan/PHASE_CANDIDATES.md` already carries all four live
candidates (#33-#36); tonight's evidence (e2e-full's fourth breach in
five nights, the `take_h2` well opening and draining same-day, the
critique queue's record single-day reduction) was folded into their
existing entries above rather than filed as new proposals — the
gate/cadence/ceiling shape itself is unchanged, only the urgency read
on #33 and #34 updated with fresh numbers.
