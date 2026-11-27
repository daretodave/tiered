# 53 — Archive closed `CRITIQUE.md` / `AUDIT.md` rows out of the live ledger

> A maintenance step moves already-`[x]`-closed rows out of
> `plan/CRITIQUE.md` and `plan/AUDIT.md` into append-only archive
> files, so the live ledgers stay small enough for a plain `Read`
> and for the loop's own prompt budget, while git history and the
> archive files both keep the full audit trail.

## Why

`plan/CANDIDATES.md`'s row (score 6.4, filed 2026-07-09, v1
candidate #29) documents a structural risk that scales with the
loop's own success: every finding-closing tick appends to
`plan/CRITIQUE.md` and `plan/AUDIT.md`, nothing ever removes from
them, because neither `skills/critique.md` nor either file's own
header says closed rows should ever be pruned or archived. Two
cloud march ticks failed outright with `SDK execution error:
Prompt is too long` (2026-07-08T22:04Z run 28978947705,
2026-07-09T21:07:57Z run 29050334437) — both self-healed on the
next tick, but the repeat within 24 hours moved this from
"plausible root cause" to "confirmed recurring pattern." A later
digest pass confirmed directly: a plain `Read` of
`plan/CRITIQUE.md` fails outright with "File content (98153
tokens) exceeds maximum allowed tokens (25000)" — any skill step
that needs the whole file in context (not just a targeted grep)
is already past the single-call read ceiling. At filing time 360
of the file's 385 findings were already `[x]` closed — dead
weight kept only because nothing prunes it. `plan/AUDIT.md` carries
the same shape at 388KB.

This is the same `lax→strict`-adjacent "add a mechanical gate to a
proven defect class" pattern the loop already ships repeatedly
(specs 48/50/51) — here the defect class is ledger bloat, not
content prose, but the shape (detect, drain, guard) is familiar.

## Design

**Archive files.** Add `plan/CRITIQUE_ARCHIVE.md` and
`plan/AUDIT_ARCHIVE.md` as append-only destinations, each with the
same one-line-per-row header convention as `plan/ARCHIVE.md`
("Append-only: ... Never edited or reordered.").

**The move.** A new script, `scripts/plan/ledger-archive.mjs`,
scans `plan/CRITIQUE.md` and `plan/AUDIT.md` for rows already
marked closed (`[x]`) whose closing date is `archive_after_days`
old (default 30) or more. It moves each matching row verbatim
(exact text, no rewriting) from the live file's `## Pending` /
closed section to the matching archive file, appending to the
archive and removing from the live file in the same pass. Dry-run
by default (`node scripts/plan/ledger-archive.mjs`); `--write`
performs the move. Prints one `archived <id>` line per row moved,
then `archived N` or `clean`.

**Where it runs.** Folded into `/critique`'s own close-out step
(`skills/critique.md`) rather than a standalone skill or lane —
the step that already walks closed rows to confirm they're still
closed is the natural place to also check their age and archive
them. Runs every critique pass; cheap when nothing has aged past
the threshold (`clean`).

**Reads stay scoped.** `skills/critique.md` and `skills/iterate.md`
(wherever they scan `CRITIQUE.md` / `AUDIT.md` for open findings)
gain a one-line note: the archive file exists, holds historical
closed rows, and is out of scope for normal ticks — only the live
file's open and recently-closed rows need to be in context.

**No behavior change.** This is pure file-size hygiene. No change
to scoring, gating, cadence, or what gets filed or how findings
are triaged.

## Contracts

- `scripts/plan/ledger-archive.mjs`: new script. Default (no
  flag): dry-run, prints what would move. `--write`: performs the
  move for both `plan/CRITIQUE.md` and `plan/AUDIT.md` against
  their respective archive files. `archive_after_days` constant
  (default 30) governs the age cutoff on a row's closing date.
- `plan/CRITIQUE_ARCHIVE.md`: new file, same append-only header
  convention as `plan/ARCHIVE.md`.
- `plan/AUDIT_ARCHIVE.md`: new file, same convention.
- Colocated unit test for `ledger-archive.mjs`: a closed row older
  than the cutoff moves; a closed row younger than the cutoff
  stays; an open row never moves regardless of age; moved rows
  keep their exact original text.
- `skills/critique.md`: close-out step gains the archive call
  (`node scripts/plan/ledger-archive.mjs --write`), after rows are
  confirmed closed, before the pass's own commit.
- `skills/critique.md` and `skills/iterate.md`: one-line note each
  documenting the archive files' existence and out-of-scope status
  for normal reads.

## Decisions made upfront (do not ask)

- Fold the archive step into `/critique`'s close-out rather than a
  new standalone skill or `march.lanes.md` lane — one fewer moving
  part, and critique already walks closed rows every pass it runs.
- 30-day age cutoff on the closing date, not a pass-count
  threshold — dates are already present on every closed row link
  (issue or commit), pass counts are not.
- Archive files are plain append-only logs, not a database or a
  queryable index — git history plus the archive file is enough
  audit trail; this spec does not add tooling to search the
  archive.
- No change to `plan/ARCHIVE.md` itself (the chunk-completion
  ledger) — this spec only touches the finding ledgers
  (`CRITIQUE.md`, `AUDIT.md`), which are structurally different
  (append-only-forever by design assumption, not by necessity).

## Acceptance

- **A8** Running the script against the current `plan/CRITIQUE.md`
  and `plan/AUDIT.md` moves their existing aged `[x]` rows (the
  360-of-385 already closed at filing time) into the archive
  files, and `node scripts/plan-check.mjs` stays green.

## Open questions

- Whether `plan/ARCHIVE.md` itself ever needs the same treatment —
  deferred; it is already append-only by design and has not shown
  the same read-ceiling failure.

## Chunks

Measure: 1 open · 7 closed · next A9


  `scripts/plan/ledger-archive.mjs`: dry-run by default
  (prints each `archived <id>` it would move, then `archived N`
  or `clean`), `--write` performs the move for both
  `plan/CRITIQUE.md` and `plan/AUDIT.md` against their
  respective archive files. Parses each file's `## Pending` /
  closed rows (same row-boundary logic as `scripts/lib/
  plan-rows.mjs`'s existing section/row scanning — reuse it,
  don't re-derive), finds rows already marked `[x]` whose
  closing date (the `RESOLVED (<date>, ...)` or equivalent
  closing-date line already present on every closed row in this
  repo's two files — confirm the exact literal pattern against
  today's `plan/CRITIQUE.md`/`AUDIT.md` content before coding
  the regex, per the spec's Design) is `archive_after_days` (a
  module constant, default 30) days old or more, moves each
  matching row verbatim (exact original text, no rewriting)
  from the live file to the matching archive file (appended),
  and removes it from the live file in the same `--write` pass.
  `plan/CRITIQUE_ARCHIVE.md` and `plan/AUDIT_ARCHIVE.md`: new
  files, each opening with the same one-line "Append-only: ...
  Never edited or reordered." header convention as
  `plan/ARCHIVE.md`. Colocated test
  (`scripts/plan/__tests__/ledger-archive.test.mjs` or the
  repo's matching convention for `scripts/plan/*.mjs` tests):
  a closed row older than the cutoff moves (A3); a closed row
  younger than the cutoff stays (A4); an open (non-`[x]`) row
  never moves regardless of age (A5); a moved row's text is
  byte-identical to its original (A3).


  `skills/critique.md`: its close-out step (the step that
  already walks closed rows to confirm they're still closed)
  gains a call to `node scripts/plan/ledger-archive.mjs --write`
  immediately after that confirmation and before the pass's own
  commit — so a closed-and-confirmed row from this pass is
  eligible for archiving the same tick it ages past the
  threshold, not the next one. Both `skills/critique.md` and
  `skills/iterate.md` gain a one-line note, wherever each scans
  `plan/CRITIQUE.md` / `plan/AUDIT.md` for open or recently-
  closed findings, stating the archive files exist, hold
  historical closed rows, and are out of scope for a normal
  tick's read (no behavior change — documentation only).

- [ ] **53.3** One-time drain of the existing backlog · S · closes A8 · needs —

  Run `node scripts/plan/ledger-archive.mjs --write` against
  this repo's current `plan/CRITIQUE.md` and `plan/AUDIT.md` in
  the same commit, moving every already-aged `[x]` row into the
  two new archive files. Confirm `node scripts/plan-check.mjs`
  stays green after the move (row counts in both live files drop
  accordingly; `## Pending` / still-open rows are untouched and
  verified byte-identical before/after). This is the chunk that
  actually relieves the read-ceiling problem the spec exists to
  fix — commit it only once 53.1's script round-trips cleanly.
