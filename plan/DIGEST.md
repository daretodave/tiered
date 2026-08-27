# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-08-27

## Headline

**A quiet, single-mission 26 hours: the `shape_h2` mechanical drain (pass-131) ran almost non-stop, filing 17 shows' worth of season-page fixes, while Rule 2 (season-fill) and Rule 3 (themed lists) both stayed silent — no commits from either this window.** One `march` tick hit a transient 502 (22:35 08-26, self-recovered next tick, no pattern). The bigger story is `plan/CRITIQUE.md`: **pass 147 (14:14 today) loaded the gate with 2 HIGH findings**, both bumps of recurring systemic defects — the meta-description-echoes-lede bug (5th recurrence across 3 passes, per-page patches have failed to stop it) and the vote-pair pre-vote triple-stack (confirmed on 4 shows across 2 passes). **`/march` will not re-dispatch `/critique` until `/iterate` clears at least one of these two HIGHs** — no `/iterate` tick has run since the gate loaded, so it's still live as of this writing. On the breadth side, `e2e-full` went red both of the last two nights (08-25, 08-26→08-27) on the same duration-ceiling wall — candidate #34 now 37 days unpromoted. The night shift itself lost one night (08-26, cancelled) to the same concurrency-eviction race candidate #35 has documented four times now — tonight's tick is the recovery. Deploy is green at HEAD (`48ef7ea5`). Catalog held flat at 68 shows / 1047 seasons / 68 canons / 181 themes; the `shape_h2` field itself grew from 89 to 106 of 1047 season files (941 remaining).

## While you were out

| Time (UTC) | Verb | Outcome |
|---|---|---|
| 12:32 (08-26) | content-gap redirect | shipped — alone-australia `shape_h2` drain (pass-131) |
| 13:15 | content-gap redirect | shipped — traitors `shape_h2` drain (pass-131) |
| 13:59 | content-gap redirect | shipped — below-deck-down-under `shape_h2` drain (pass-131) |
| 14:14 | critique | **pass 147 — 4 findings (0 new high, 2 med, 2 bumped MED→HIGH) — gate now loaded** |
| 15:41 | content-gap redirect | shipped — the-ultimatum `shape_h2` drain (pass-131) |
| 16:33 | content-gap redirect | shipped — perfect-match `shape_h2` drain (pass-131) |
| 17:17 | content-gap redirect | shipped — traitors-uk `shape_h2` drain (pass-131) |
| 17:59 | content-gap redirect | shipped — below-deck-sailing-yacht `shape_h2` drain (pass-131) |
| 18:47 | content-gap redirect | shipped — rhod `shape_h2` drain (pass-131) |
| 19:55 | content-gap redirect | shipped — jersey-shore `shape_h2` drain (pass-131) |
| 20:59 | content-gap redirect | shipped — rhoslc `shape_h2` drain (pass-131) |
| 22:30 | content-gap redirect | shipped — too-hot-to-handle `shape_h2` drain (pass-131) |
| 22:35 | march tick | **failure** — transient 502 from the Claude API, no pattern, next tick clean |
| 00:32 (08-27) | content-gap redirect | shipped — rhom `shape_h2` drain (pass-131) |
| 02:34 | content-gap redirect | shipped — dragrace-uk `shape_h2` drain (pass-131) |
| 04:36 | content-gap redirect | shipped — the-circle `shape_h2` drain (pass-131) |
| 06:56 | content-gap redirect | shipped — love-island-us `shape_h2` drain (pass-131) |
| 10:29 | content-gap redirect | shipped — selling-sunset `shape_h2` drain (pass-131) |
| 14:15 | content-gap redirect | shipped — bachelor-in-paradise `shape_h2` drain (pass-131) |

(A handful of additional `march` runs this window show `cancelled` —
normal concurrency-group overlap when a trigger lands mid-tick, not
incidents.)

## The saga

**Rule 2 (season-fill drain):** silent this window — zero commits, `plan/CADENCE.md`'s gap table unchanged since the 08-23 sweep (last audit reconfirmation still holds: 44/44 shows starred, every remaining slot confirmed-but-unaired). Next sweep due 2026-08-30.

**Rule 3 (themed lists):** also silent this window — no extends, no zero-ship notes logged. Whether this is continued saturation (as the last several digests documented) or simply crowded out by the `shape_h2` mechanical queue isn't distinguishable from the commit history alone.

**`shape_h2` drain (pass-131, the content-gap-redirect workaround under issue #758):** this is where every unit of velocity landed this window — **17 shows**, one season file each, given a per-season editorial H2 fragment in place of the shared literal `<h2>A rhythm worth tracking.</h2>` (alone-australia, traitors, below-deck-down-under, the-ultimatum, perfect-match, traitors-uk, below-deck-sailing-yacht, rhod, jersey-shore, rhoslc, too-hot-to-handle, rhom, dragrace-uk, the-circle, love-island-us, selling-sunset, bachelor-in-paradise). `shape_h2` coverage is now 106/1047 season files (up from 89) — **941 remaining**. At this window's pace (~17/day) full drain is still roughly 55 days out; the field ships LAX today per `scripts/content-check.ts`, so there's no gate pressure to accelerate, just a long queue.

**Critique:** pass 147 fired once (14:14 UTC), found the catalog mechanically clean (0 console errors, 0 failed requests, 0 mobile overflow, all pages 200, no spoiler leaks) but confirmed two recurring systemic bugs badly enough to bump both MED→HIGH: the meta-description-echoes-lede defect (5th recurrence, 3 prior per-page fix rounds have not stopped it — needs a template-level guard) and the vote-pair pre-vote triple-stack (4 shows, 2 passes — "no vote cast yet" stated four ways on every community view checked). **The gate is now loaded**: `/march` Step 2 will not re-run `/critique` until `/iterate` closes at least one of these two HIGHs. No `/iterate` tick has landed since 14:14 — this is a live blocker as of this digest.

## Queues now

- `plan/AUDIT.md`: 3 open standing/non-standing rows carried forward — the season-fill drain standing row (Rule 2, unchanged), the e2e-full timeout row (updated this tick, see below), and the night-shift starvation row (updated this tick, 4th occurrence logged). The-voice factual corruption (issue #762) and its themed-list duplicate remain the other live HIGH-category threads tracked via GitHub, not a fresh AUDIT row this tick.
- `plan/CRITIQUE.md`: latest pass **147** (14:14 UTC today), gated — 2 pending HIGH findings block the next `/critique` dispatch until `/iterate` clears one.
- `plan/PHASE_CANDIDATES.md`: longest-unpromoted — #34 shard e2e-full crawl (**37 days**), #35 decouple night.yml concurrency (**37 days**, 4th confirmed occurrence), #36 the-voice remediation (**32 days**), #37 org-outage fallback (**7 days**).
- Open `triage:needs-user`: 8 issues (#777, #763, #762, #758, #586, #565, #399, #398).
- Open `triage:loop-queued`: 4 issues (#787, #785, #754, #636).

## Needs you

- **The critique gate is loaded and nothing has cleared it yet.** Two systemic HIGH findings (meta-description/lede echo, vote-pair pre-vote triple-stack) need a template-level fix, not another per-page patch — three rounds of per-page fixes already failed to hold on the first one. This is squarely `/iterate`'s job; worth checking whether the next cloud tick actually picks one of these up or whether the `shape_h2` redirect keeps absorbing cycles instead.
- **Candidate #35 (decouple night.yml concurrency) — 37 days unpromoted, 4th confirmed occurrence** (one night lost this time, 08-26). Workflow-file edit, cloud-blocked; needs local `/oversight`.
- **Candidate #34 (shard e2e-full crawl) — 37 days unpromoted.** Two more red nights (08-25, 08-26→08-27), same wall, zero real test regressions. Also cloud-blocked.
- **The-voice factual corruption (issue #762)** — no update this window; still open, still blocking new the-voice ≥S22 content.

## Today's intent

Top priority: get `/iterate` to close one of pass-147's two HIGH findings so `/critique` can run again — the gate has now sat loaded since 14:14 yesterday with no clearing commit. Rule 2 and Rule 3 both look dormant this window rather than actively saturated; worth a fresh look next tick to tell which. The `shape_h2` drain can keep running in the background regardless (LAX, no gate pressure) but shouldn't be the only thing shipping if a HIGH-gated fix is sitting available. Second priority, unchanged: get a local `/oversight` session on candidates #34 and #35 — both are workflow-file edits the cloud loop structurally cannot ship, both have now recurred four-plus times each.

## Tuning proposals

None new this tick. The critique-gate situation is a process observation, not a gate-tuning proposal — the gate is working exactly as designed (blocking re-dispatch until a HIGH clears); the open question is whether `/march`'s Step ordering is actually routing to `/iterate` first when the gate is loaded, which is worth watching over the next few ticks before proposing anything. The two live infra patterns (e2e-full timeout, night/march concurrency race) remain fully covered by candidates #34 and #35, both reinforced with fresh recurrence data in this tick's `plan/AUDIT.md` update.
