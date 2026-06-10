// Critique pass-45 #384 closure: the SUGGEST AN ENTRY action moved
// out of the primary action row (ListDetailTools) because the row's
// other peers (Save / Share) act on the list-as-object — the reader's
// relationship to it — while Suggest flows backward to the editor.
// Rendered as a participation-framed verb-arrow CTA in an editorial-
// footer slot adjacent to the AdjacentLists rail, the action keeps
// the same `data-testid=list-suggest` so the page-reads e2e fixture
// continues to assert visibility on /themes/[theme].

type SuggestEntryCTAProps = {
  themeTitle: string
}

export function SuggestEntryCTA({ themeTitle }: SuggestEntryCTAProps) {
  const mailto = `mailto:editors@tiered.tv?subject=${encodeURIComponent(
    `Suggest entry: ${themeTitle}`,
  )}`

  return (
    <section className="list-suggest-cta" data-testid="list-suggest-cta">
      <a
        className="suggest-link"
        href={mailto}
        aria-label={`Suggest an entry for ${themeTitle}`}
        data-testid="list-suggest"
      >
        Suggest an entry <span aria-hidden="true">→</span>
      </a>
    </section>
  )
}
