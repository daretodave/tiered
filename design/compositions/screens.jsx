/* The three real screens. Identity is color + type only.
   No sigils, no facades, no per-show artwork. Just bullets and big serif. */

const SHOWS = {
  survivor: {
    name: "Survivor",
    paper: "#0E2A2A", ink: "#EFE2BD", primary: "#D55E36",
    seasons: 47,
    blurb: "47 seasons. One torch at a time.",
    tagline: "47 seasons of strangers on a beach. We've ranked every single one. No spoilers, no exceptions.",
  },
  topchef: {
    name: "Top Chef",
    paper: "#1B2418", ink: "#ECDFC6", primary: "#B86A2E",
    seasons: 22,
    blurb: "22 seasons. Knives drawn, herbs fresh.",
    tagline: "22 seasons of professional cooks in unfamiliar kitchens. Ranked by people who actually liked the food.",
  },
  dragrace: {
    name: "RuPaul's Drag Race",
    paper: "#2D0B2A", ink: "#F2E1D2", primary: "#E64B86",
    seasons: 17,
    blurb: "17 seasons. Quiet velvet, loud pink.",
    tagline: "17 seasons of queens, runways, and Snatch Game. Ranked without spoiling a single crowning.",
  },
};

/* Tiny shared atoms — the only per-show "graphic" allowed in the system */
function Bullet({ color, size = 12 }) {
  return (
    <span
      className="bullet"
      style={{ width: size, height: size, background: color }}
      aria-hidden="true"
    />
  );
}

function Wordmark({ show, size = 80, lineHeight = 0.95 }) {
  const s = SHOWS[show];
  return (
    <h2 className="wordmark"
        style={{ fontSize: size, lineHeight, color: s.ink }}>
      {s.name}
    </h2>
  );
}

/* ============================================================ HOME */
function HomeScreen({ mobile = false }) {
  return (
    <div className={`screen home ${mobile ? "mobile" : "desktop"}`}>
      <TopNav mobile={mobile} />

      <section className="home-hero">
        <div className="home-hero-cover"
             style={{ background: SHOWS.survivor.paper, color: SHOWS.survivor.ink }}>
          <div className="cover-tag">Currently featured</div>
          <h2 className="cover-name" style={{ color: SHOWS.survivor.ink }}>Survivor</h2>
          <p className="cover-sub" style={{ color: SHOWS.survivor.ink }}>
            47 seasons.<br/>One torch at a time.
          </p>
          <a className="cover-go" href="#" style={{ color: SHOWS.survivor.ink }}>
            <Bullet color={SHOWS.survivor.primary} size={10}/>
            go to Survivor <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="home-hero-copy">
          <div className="home-hero-eyebrow">Pantheon · est. 2026</div>
          <h1 className="home-hero-title">
            The seasons,<br/>ranked. <em>no spoilers.</em>
          </h1>
          <p className="home-hero-blurb">
            Two rankings for every show. One written by an editor with the
            whole series in their head, one voted by the people who lived
            through it.
          </p>
          <div className="home-hero-actions">
            <a className="btn-primary" href="#">Browse all shows</a>
            <a className="btn-ghost"  href="#">How it works</a>
          </div>
        </div>
      </section>

      <section className="home-shows">
        <div className="section-head">
          <h2>Pantheons</h2>
          <a className="section-link" href="#">All shows →</a>
        </div>
        <div className="home-show-grid">
          <ShowTile show="survivor"/>
          <ShowTile show="topchef"/>
          <ShowTile show="dragrace"/>
        </div>
      </section>

      <section className="home-lists">
        <div className="section-head">
          <h2>Themed lists</h2>
          <a className="section-link" href="#">All lists →</a>
        </div>
        <div className="home-list-grid">
          <ListTile title="The 12 most reviled finales"        meta="reality · cross-show · 12 entries" sentiment="warm-down"/>
          <ListTile title="Best comeback seasons"               meta="reality · cross-show · 18 entries" sentiment="warm-up"/>
          <ListTile title="Quietly perfect bottle seasons"      meta="editorial · 9 entries"            sentiment="hold"/>
        </div>
      </section>

      <Footer mobile={mobile}/>
    </div>
  );
}

function ShowTile({ show }) {
  const s = SHOWS[show];
  return (
    <a className="show-tile" href="#"
       style={{ background: s.paper, color: s.ink }}>
      <div className="show-tile-head">
        <Bullet color={s.primary} size={14}/>
        <span className="show-tile-name">{s.name}</span>
      </div>
      <p className="show-tile-blurb">{s.blurb}</p>
      <div className="show-tile-meta">
        <span>{s.seasons} seasons · ranked</span>
        <span className="show-tile-arrow" style={{ color: s.primary }}>→</span>
      </div>
    </a>
  );
}

function ListTile({ title, meta, sentiment }) {
  return (
    <a className="list-tile" href="#">
      <span className="list-tile-dot" style={{ background: `var(--s-${sentiment})` }}/>
      <div>
        <div className="list-tile-title">{title}</div>
        <div className="list-tile-meta">{meta}</div>
      </div>
      <div className="list-tile-arrow">→</div>
    </a>
  );
}

/* ============================================================ SHOW HOME */
function ShowScreen({ mobile = false, show = "survivor" }) {
  const s = SHOWS[show];
  return (
    <div className={`screen show-home ${mobile ? "mobile" : "desktop"}`}
         style={{ "--show-paper": s.paper, "--show-ink": s.ink, "--show-primary": s.primary }}>
      <TopNav mobile={mobile} tinted/>

      <section className="show-hero">
        <div className="show-hero-cover">
          <Wordmark show={show} size={mobile ? 56 : 112}/>
          <p className="show-hero-sub">{s.blurb}</p>
        </div>
        <div className="show-hero-meta">
          <div className="show-hero-crumb">
            <Bullet color={s.primary} size={10}/>
            Pantheons / {s.name}
          </div>
          <p className="show-hero-line">{s.tagline}</p>
          <ShieldBadge/>
        </div>
      </section>

      <section className="show-split">
        <a className="split-btn" href="#">
          <div className="split-btn-tag">01 · CURATED</div>
          <div className="split-btn-title">Editor's Canon</div>
          <div className="split-btn-blurb">One ranking, written by someone who has seen every season twice.</div>
          <div className="split-btn-go">Read the canon →</div>
        </a>
        <a className="split-btn" href="#">
          <div className="split-btn-tag">02 · LIVE</div>
          <div className="split-btn-title">Community Rank</div>
          <div className="split-btn-blurb">Voted weekly by readers. Updated as the votes come in.</div>
          <div className="split-btn-go">See the vote →</div>
        </a>
      </section>

      <section className="show-seasons">
        <div className="section-head">
          <h2>All seasons, ranked</h2>
          <div className="section-filter">
            <button className="filter-btn on">Canon</button>
            <button className="filter-btn">Community</button>
            <button className="filter-btn">By era</button>
          </div>
        </div>
        <div className="season-grid">
          {SURVIVOR_SEASONS.map((row, i) => (
            <SeasonCard key={row.n} rank={i+1} season={row} accent={s.primary}/>
          ))}
        </div>
      </section>

      <Footer mobile={mobile}/>
    </div>
  );
}

const SURVIVOR_SEASONS = [
  { n: "20", title: "Heroes vs. Villains",  tag: "the format at its loudest",      shift: { d:  3, s: "warm-up"   } },
  { n: "01", title: "Borneo",                tag: "the genre, invented mid-air",     shift: { d:  0, s: "hold"      } },
  { n: "07", title: "Pearl Islands",         tag: "pirates, marooning, theater",     shift: { d:  0, s: "neutral"   } },
  { n: "16", title: "Micronesia",            tag: "the meta-season that earned it",  shift: { d:  2, s: "warm-up"   } },
  { n: "28", title: "Cagayan",               tag: "three tribes, no quiet hour",     shift: { d: -2, s: "warm-down" } },
  { n: "32", title: "Kaôh Rōng",             tag: "the harshest production yet",     shift: null },
  { n: "03", title: "Africa",                tag: "every dawn an hour earlier",      shift: null },
  { n: "10", title: "Palau",                 tag: "the rout that became a season",   shift: null },
  { n: "31", title: "Cambodia",              tag: "an all-returnee gamble that worked", shift: { d: 1, s: "warm-up" } },
];

function SeasonCard({ rank, season, accent }) {
  return (
    <a className="season-card" href="#">
      <div className="season-rank" style={{ color: accent }}>#{String(rank).padStart(2, "0")}</div>
      <div className="season-meta">
        <div className="season-title">{season.title}</div>
        <div className="season-tag">{season.tag}</div>
        <div className="season-bottom">
          <span className="season-num">Season {season.n}</span>
          {season.shift && <RankShiftPill delta={season.shift.d} sentiment={season.shift.s}/>}
        </div>
      </div>
    </a>
  );
}

/* ============================================================ SEASON PAGE */
function SeasonScreen({ mobile = false, show = "survivor" }) {
  const s = SHOWS[show];
  return (
    <div className={`screen season-page ${mobile ? "mobile" : "desktop"}`}
         style={{ "--show-paper": s.paper, "--show-ink": s.ink, "--show-primary": s.primary }}>
      <TopNav mobile={mobile} tinted/>

      <div className="season-shell">
        <article className="season-main">
          <header className="season-head">
            <div className="season-crumb">
              <Bullet color={s.primary} size={9}/>
              <a href="#">Pantheons</a> / <a href="#">{s.name}</a> / <span>Season 20</span>
            </div>
            <h1 className="season-h1">Heroes vs. Villains</h1>
            <div className="season-rankrow">
              <div className="season-rank-tag">
                <span className="season-rank-label">Editor's Canon</span>
                <span className="season-rank-num">#07</span>
              </div>
              <div className="season-rank-tag">
                <span className="season-rank-label">Community</span>
                <span className="season-rank-num">#04</span>
                <RankShiftPill delta={3} sentiment="warm-up"/>
              </div>
              <ShieldBadge inline/>
            </div>
          </header>

          <div className="season-body">
            <p className="season-lede">A returnees season that finally let the format show what it could really do, when nobody had to be introduced. The pace doesn't slow, even for sleep.</p>
            <p>Twenty veterans, ten cast as heroes and ten as villains, sent back to Samoa with no patience for the early-game small-talk. The first day plays like the eighth day of any other season. Production has the cast they deserve and seems to know it; the camera barely cuts away.</p>
            <p>It earns its reputation. The middle stretch, in particular, runs at a tempo the show has never replicated. Whether you read it as the franchise's peak or the moment it started favoring chaos over arc is a question worth having with someone over coffee.</p>
          </div>

          <div className="season-vote-block">
            <div className="season-vote-head">
              <div className="season-vote-q">Does this belong in the canon top 10?</div>
              <div className="season-vote-meta">412 readers voted this week · 3,891 lifetime</div>
            </div>
            <VotePair initial={274} label="Heroes vs. Villains"/>
          </div>

          <nav className="season-related" aria-label="Adjacent seasons">
            <a className="related-prev" href="#">
              <div className="related-tag">← #06 Canon</div>
              <div className="related-title">Pearl Islands</div>
            </a>
            <a className="related-next" href="#">
              <div className="related-tag">#08 Canon →</div>
              <div className="related-title">Micronesia</div>
            </a>
          </nav>
        </article>

        <aside className="season-aside">
          <div className="aside-head">
            <h3>The thread</h3>
            <span className="aside-meta">412 comments</span>
          </div>
          <CommentInput/>
          <ul className="comment-list">
            <Comment author="margaux.r" when="2h" body="The middle stretch is genuinely the best run of episodes the show has ever put together. I will die on this hill."/>
            <Comment author="thunderdomeguy" when="9h" body="A rare returnee season where casting actually matched the premise. Most fall apart by the merge — this one tightens." flag="hot"/>
            <Comment author="ngarrett" when="1d" body="Some of the camera work here is doing real ethnographic labor. Watch the establishing shots in episodes 3 and 4."/>
            <Comment author="boredathome" when="2d" body="Overrated by people who don't want to admit later seasons made the format better. Fight me (politely)."/>
          </ul>
          <button className="aside-more">Show 408 more →</button>
        </aside>
      </div>

      <Footer mobile={mobile}/>
    </div>
  );
}

function Comment({ author, when, body, flag }) {
  return (
    <li className={`comment-item ${flag || ""}`}>
      <div className="comment-meta">
        <span className="comment-author">{author}</span>
        <span className="comment-when">{when}</span>
        {flag === "hot" && <span className="comment-hot">★ much-liked</span>}
      </div>
      <p className="comment-body">{body}</p>
      <div className="comment-actions">
        <button>Reply</button>
        <button>↑</button>
        <button>↓</button>
      </div>
    </li>
  );
}

/* ============================================================ SHARED CHROME */
function TopNav({ mobile, tinted = false }) {
  return (
    <nav className={`topnav ${tinted ? "tinted" : ""}`}>
      <a className="topnav-brand" href="#">
        <svg viewBox="0 0 24 24" width={mobile ? 18 : 22} height={mobile ? 18 : 22} aria-hidden="true">
          <path d="M2 10 L12 3 L22 10" fill="none" stroke="currentColor" strokeWidth="1.4"/>
          <line x1="4" y1="12" x2="4" y2="21" stroke="currentColor" strokeWidth="1.4"/>
          <line x1="12" y1="12" x2="12" y2="21" stroke="currentColor" strokeWidth="1.4"/>
          <line x1="20" y1="12" x2="20" y2="21" stroke="currentColor" strokeWidth="1.4"/>
          <line x1="2" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
        <span>Pantheon</span>
      </a>
      {!mobile && (
        <div className="topnav-links">
          <a href="#">Shows</a>
          <a href="#">Lists</a>
          <a href="#">About</a>
        </div>
      )}
      <div className="topnav-right">
        {!mobile && <a className="topnav-search" href="#">⌕ Search</a>}
        <a className="topnav-signin" href="#">Sign in</a>
      </div>
    </nav>
  );
}

function ShieldBadge({ inline = false }) {
  return (
    <div className={`shield ${inline ? "inline" : ""}`}>
      <span className="shield-dot">●</span>
      <span className="shield-text">No spoilers. Every page is reviewed before it goes live.</span>
    </div>
  );
}

function Footer({ mobile }) {
  return (
    <footer className="pf-footer">
      <div className="pf-foot-row">
        <span>Pantheon · the seasons, ranked. no spoilers.</span>
        {!mobile && <span>About · Contact · Press · 2026</span>}
      </div>
    </footer>
  );
}

Object.assign(window, { SHOWS, Bullet, Wordmark, ShowTile, HomeScreen, ShowScreen, SeasonScreen });
