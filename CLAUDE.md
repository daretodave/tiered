# tiered.tv — read this first

Every agent landing in this repo reads this file before doing
anything else. The standing rules are listed once below; the
authoritative deep-dives live in `agents.md`, `design/CLAUDE.md`,
and `plan/bearings.md`. **Honor this file before improvising.**

---

## Reading order (the "before you touch a thing" checklist)

1. **`design/CLAUDE.md`** — visual law. Read it cold before any
   UI work. It overrides any older guidance found elsewhere in
   the repo, including this file.
2. **`design/tiered.tv · Brand.html`** — header, footer, brand
   mark spec. The mark is the **only** SVG illustration in the
   product.
3. **`design/tiered.tv · Survivor.html`** — the canonical
   production show page (full-bleed, tinted chrome, all
   seasons). When you build a show page, this is the reference.
4. **`design/tiered.tv · Heroes vs. Villains.html`** — the
   canonical production season page (lede, body, vote block,
   adjacent seasons, "also appears in," sticky thread aside).
5. **`design/compositions/screens.jsx` + `screens.css`** — the
   React + CSS source of truth for chrome and page shells.
6. **`design/compositions/interactions.jsx`** — VotePair,
   CommentInput, RankShiftPill. The production components are
   ports of these, not re-interpretations.
7. **`agents.md`** — standing rules, sub-agent index, repo shape.
8. **`plan/bearings.md`** — locked stack, voice, URL contract.
9. **`plan/steps/01_build_plan.md`** — what ships next.

If a phase brief mentions design files older than `design/CLAUDE.md`,
the design files win.

---

## The visual law (in one paragraph)

tiered.tv's identity is **color + typography**. Each show carries
a three-color palette (paper / ink / primary) and a serif
wordmark. That is the whole identity. **There is no
illustration, no per-show iconography, no sigil, no facade, no
mascot, no thematic ornamentation.** The only SVG in the product
is the shared tiered.tv brand mark (three horizontal bars,
stacked, descending in width — a literal tier list) which
appears in every header and footer. Color does the visual work.
Type does the editorial work. Everything else is text.

### The five hard rules — never break

1. **Never generate SVG illustration for individual shows.** No
   facades, sigils (per-show), mascots, torches, sequins,
   spoons, herbs, columns, pediments, friezes, ornaments, or
   any other per-show artwork. This direction was prototyped in
   the May 2026 facade grammar and **rejected** — the output
   reads as AI-generated and does not meet the bar. Do not
   retry it. Do not "improve" it. Do not add "just one small
   icon."
2. **Where a show needs a marker** — anywhere you'd otherwise
   reach for a tiny illustration, badge, sigil, or icon — use a
   **12–16px filled circle** in `var(--show-primary)`. Class
   `.bullet`. This is the only show-specific graphic permitted
   in the entire system.
3. **The only SVG in the product is the tiered.tv brand mark** —
   three horizontal bars on a 28-unit viewBox (widths 20/14/8),
   filled `currentColor`, no stroke, shared across every show.
   See `design/tiered.tv · Brand.html` for spec. Never invent
   per-show variants. Never equalize the bars, reverse them, or
   tighten the gaps.
4. **Color identity flows through chrome tinting.** On a show
   page the chrome reads `--show-paper / --show-ink /
   --show-primary` and the body becomes the show paper. Big
   colored blocks holding huge serif type ARE the hero
   treatment. Resist the urge to "add visual interest" with
   art.
5. **Type does the heavy lifting.** Source Serif 4 for editorial
   (40–96px on heroes). Inter for chrome. JetBrains Mono for
   ranks. When in doubt, make the type bigger before reaching
   for ornament.

---

## Show identity, formalized

Each show carries **up to thirteen fields** in
`content/shows/<slug>.md` frontmatter. Twelve required, one
optional editorial split (`card_tagline`):

| field          | type      | required | example                                                       |
|----------------|-----------|----------|---------------------------------------------------------------|
| `slug`         | string    | yes      | `survivor`                                                    |
| `name`         | string    | yes      | `Survivor`                                                    |
| `palette`      | object    | yes      | `{ paper: "#0E2A2A", ink: "#EFE2BD", primary: "#D55E36" }`    |
| `seasons`      | int       | yes      | `47`                                                          |
| `status`       | enum      | yes      | `airing` / `ended` / `hiatus`                                 |
| `blurb`        | string    | yes      | `47 seasons. One torch at a time.`                            |
| `tagline`      | string    | yes      | `47 seasons of strangers on a beach. We've ranked every one.` |
| `card_tagline` | string    | no       | `The format that invented itself in episode one.`             |
| `tier`         | enum      | yes      | `S` / `A` / `B` — editorial confidence in the canon order     |
| `network`      | string    | yes      | `CBS`                                                         |
| `est_year`     | int       | yes      | `2000` (first-aired year)                                     |
| `genre_tag`    | string    | yes      | `Reality competition`                                         |
| `featured`     | bool      | yes      | `true` for the single show that anchors the home hero         |

No `hero_motifs`. No `format`. No SVG path. No icon name. No
mascot reference. If a future contributor proposes a graphical
field, reject it. Non-graphical editorial metadata (like the
tier / network / est_year set added with the /shows redesign)
is permitted when a page genuinely needs it.

(The `seasons` int is the count of aired/airing seasons. The
`blurb` is the short hero subtitle. The `tagline` is the longer
editorial sentence — it appears on the show page meta column
and is the kind of line a reader quotes to a friend. The
optional `card_tagline` is the one-sentence form rendered by
card surfaces — the home featured cover-sub and the /shows tier
tile — so the show page hero is the only surface that quotes
the full `tagline`. When `card_tagline` is absent, those
surfaces fall back to `tagline`.)

---

## Standing rules summary (see `agents.md` for the full set)

1. **Commit and push as one atomic act.** No unpushed commits
   between loop ticks.
2. **No `Co-Authored-By:` trailers. No emojis.** Anywhere. (One
   carve-out: the cloud loop appends `Cloud-Run: <url>`.)
3. **`pnpm verify` is non-negotiable** — typecheck → test:run →
   build → e2e. No `--no-verify`. Fix root cause.
4. **`pnpm deploy:check` runs after every push.** Red deploy =
   blocked tick.
5. **No force-push. No destructive resets.**
5a. **Every commit ships unit tests AND e2e contributions.** New
    URL → row in `apps/e2e/src/fixtures/canonical-urls.ts` +
    `page-reads.ts`. New page family → dedicated spec.
6. **The brand name is `tiered.tv` — always lowercase, including
   the `.tv` suffix.** Never capitalize the T. The dot is part
   of the wordmark; never stylize, color, or kern it apart.
7. **Spoilers are P0.**
8. **Database mutations are autonomous in v1.**
9. **Content stays in `content/`. Data stays in Supabase.** No
   hardcoded copy in components; no hardcoded data records in
   TypeScript.

---

## Where to look

| If you need… | Read |
|---|---|
| What tiered.tv is | `spec.md` |
| Visual law (UI, brand, chrome) | `design/CLAUDE.md` |
| Stack, conventions, voice | `plan/bearings.md` |
| What ships next | `plan/steps/01_build_plan.md` |
| Sub-agent index | `agents.md` Sub-agents table |
| How a skill works | `skills/<skill>.md` |

---

## Tone of voice

Knowledgeable peer. Confident, warm, plain-spoken. The reader is
a friend who watches everything and wants the truth without
spoilers. No exclamation points unless quoted. The brand
promise (**"the seasons, ranked. no spoilers."**) is the only
place the word *ranked* needs to be loud; everywhere else it
can be quiet.
