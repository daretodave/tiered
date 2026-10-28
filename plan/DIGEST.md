# DIGEST — 2026-10-28

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**A quiet, steady content day — and the Rule 2 drain is genuinely
stalled, not just slow.** Six scheduled `march` ticks ran since
last night's digest; four shipped, two were clean no-ops. Every
shipping tick landed the same shape of work: `plan/CADENCE.md`'s
season gap table is fully starred (every remaining gap is
confirmed-but-unaired — real seasons waiting on real air dates,
not anything the loop can move faster), so Rule 2 (season-fill
drain) has nothing to pick, and the content mission is correctly
falling back to Rule 3 (themed-list extension) tick after tick:
`running-long-running-short` (+3 entries, featured rotation
swapped), `milestones-spent-not-marked` (+1, rhoc's new
Homecoming season slotted at rank 15), `away-from-home-turf` (+1,
rhoc's first appearance on that list), and `twice-in-one-year`
(+2, Survivor's first appearance on that list, both from the
Australian Outback/Africa back-to-back season pair). Each extend
carries its own audit progress note, as the standing row requires.
The two no-ops were both structural, not stalls: one tick lost its
own e2e leg to the harness's 30-minute foreground window and
correctly declined to claim a commit it couldn't verify; the other
hit the 24-hour cloud commit budget with nothing left to spend and
correctly exited idle rather than forcing work. Nothing else moved
— the candidate-queue silting and the one open rhoc HIGH finding
from pass 193 are exactly where last night's digest left them,
both still waiting on a human turn.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| seven_day utilization | — | unknown (no cached reading) |
| 10-27 16:37–17:28 | march | success — themed list `running-long-running-short` extended (+3 entries, featured rotation swapped) |
| 10-27 21:00–22:23 | march | success — themed list `milestones-spent-not-marked` extended (+1, rhoc Homecoming slotted rank 15) |
| 10-28 00:28–01:10 | march | success — themed list `away-from-home-turf` extended (+1, rhoc's first appearance on the list) |
| 10-28 06:21–07:17 | march | **no-op** — lost-to-background: the e2e leg exceeded the 30-minute foreground window and was auto-backgrounded by the harness; no commit carries this run's trailer, so it correctly claimed nothing |
| 10-28 07:17–08:11 | march retry | success — themed list `twice-in-one-year` extended (+2, Survivor's first appearance on the list) |
| 10-28 13:35–14:19 | march | **no-op** — 24h cloud commit budget spent; no ready work claimed |

## Shipped

- **Content (4 themed-list extends, Rule 3 fallback):**
  `running-long-running-short`, `milestones-spent-not-marked`,
  `away-from-home-turf`, `twice-in-one-year` — each grounded in
  the extending season's own frontmatter (premiere dates, `pull`/
  `take_h2` fields), each with a `plan/LISTS.md` ledger row and a
  paired `plan/AUDIT.md` progress note, as the standing Rule 2/3
  fallback discipline requires.
- **No Rule 2 (season-fill) work shipped** — the CADENCE gap table
  has been fully starred (every row confirmed-but-unaired) since
  the 16th weekly sweep two nights ago; Rule 2 has nothing eligible
  until a real-world premiere date lands.
- **Digest maintenance (this tick):** `plan/AUDIT.md`'s one
  `### [` pending row (`[user-issue #817]`, filed by the issue-age
  generator this past cycle) resolved — the underlying issue was
  closed by the owner same-day, before the generator's read caught
  up. Audit now reads clean (0 pending).

## Queues now

- **plan:** 0 specs, 0 chunks left, 0 held — unchanged; building
  is idle, the AUDIT/CRITIQUE/CADENCE maintenance queues and the
  content mission are carrying the loop.
- **plan/AUDIT.md:** 0 pending (was 1; the stale `#817` row closed
  above).
- **plan/CRITIQUE.md:** 71 pending, last pass 41h ago (pass 193,
  commit `514b6d8f`) — unchanged; no critique pass ran this
  window.
- **plan/CANDIDATES.md:** 21 pending (20 >21d), oldest 168d.
  Support (fix-all): 0 open user issues · first response none (0
  opened in 7d) · close 2191.2h mean (6 closed in 7d).
- **Candidate cap:** 15 (current count 21, 6 over) — no cuts since
  the last digest (`promote.mjs cuts --since 2026-10-27` → none).
- **Open `triage:needs-user` / `loop:do`:** 0 across both labels.
- **data/BACKLOG.md:** no data-layer backlog file exists.
- **Deploy:** ready at HEAD `9588207a`.
- **CADENCE gap table:** unchanged, every row starred
  confirmed-but-unaired; Rule 2 stays locked out until a real air
  date lands.
- **Breadth (`e2e-full`):** green — latest run
  (2026-10-28T02:00–02:35Z) passed; read, not re-run, per the
  standing rule for this tick.
- **seven_day utilization:** unknown (no cached reading).
- **Motion:** 26 shipped this week vs. floor 9.5 — `ok`.

## Needs you

- **oversight needed: candidate queue silting (20 pending >21d,
  oldest 168d).**
- **`Promote: aged` is live (`Improve: bold`) but the valve still
  can't turn itself from the cloud.** 8 Pending candidates clear
  both the floor (6.0) and the age bar (21d) — unchanged from last
  night: top of the stack is `[score 9.4] Show canon completeness
  lax→strict gate` (proposed 2026-06-15, 135d old). Every cloud
  checkout lacks the `.owner` marker, so `promote.mjs pick` returns
  `ask`, not `pick` — the intended trust boundary, not a bug; the
  dial only actually turns from a local, owner-mode `/oversight`
  session. **auto-promoted none, 8 awaiting.**
- No `escalate #N` rows (0 open user issues — `#817` closed since
  last digest), no blocked specs (`Held` lane empty), no open
  needs-user issues, no `[needs-user-call]` rows beyond the
  already-noted standing ones, no `motion stalled` (this week
  already clears the floor), no `rotate` rows (0 secret-audit
  events; this is a cloud run, so the check is skipped anyway).

## Today's intent

1. The plan table is empty — the next ready work is still
   CRITIQUE's one open HIGH from pass 193: rhoc's new Homecoming
   season page states Vicki Gunvalson's return gap two different
   ways ("13 seasons away" in the eyebrow vs. "since season
   thirteen" in the body). Content-only, one-field fix
   (`content/shows/rhoc/seasons/20-the-homecoming.md`'s `eyebrow`).
   Same top target as last night — still open, still the next
   `/iterate` or `/march` pick.
2. At the next local `/oversight` session: turn the `Promote:
   aged` valve (8 candidates waiting, top-scored at 9.4) and weigh
   the candidate-queue silting (20 of 21 pending are over 21 days
   old, oldest 168d).

## Tuning proposals

None. Today's loop behavior was all correctly-handled edge cases,
not mistuned gates: the lost-to-background no-op declined to claim
unverified work, the budget-exhausted no-op declined to force a
tick with nothing ready, and the Rule 2→Rule 3 fallback is the
CADENCE law working exactly as designed when the gap table is
fully starred. Nothing here needs a knob changed.
