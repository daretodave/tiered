import type { TOCSection } from './SeasonTOC'

type SeasonTOCMobileProps = {
  sections: readonly TOCSection[]
}

export function SeasonTOCMobile({ sections }: SeasonTOCMobileProps) {
  if (sections.length === 0) return null

  return (
    <details className="toc-mobile" data-testid="season-toc-mobile">
      <summary>
        <span className="toc-mobile-head">On this page</span>
        <span className="toc-mobile-meta" aria-hidden="true">
          {sections.length} {sections.length === 1 ? 'section' : 'sections'}
        </span>
      </summary>
      <ol className="toc-mobile-list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              data-testid="toc-mobile-link"
              data-toc-id={s.id}
            >
              <span className="toc-num">{s.num}</span>
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </details>
  )
}
