import Link from 'next/link'
import {
  type MdBlock,
  type MdInline,
  parseInline,
  parseMarkdownBlocks,
} from '@/lib/markdown'

type ProseProps = {
  source: string
}

export function Prose({ source }: ProseProps) {
  const blocks = parseMarkdownBlocks(source)
  return (
    <div className="prose-tiered flex flex-col gap-6">
      {blocks.map((block, ix) => renderBlock(block, ix))}
    </div>
  )
}

function renderBlock(block: MdBlock, key: number): React.ReactNode {
  if (block.type === 'heading') {
    const classes: Record<1 | 2 | 3 | 4, string> = {
      1: 'font-serif text-4xl text-ink-0 leading-tight md:text-5xl',
      2: 'font-serif text-2xl text-ink-0 leading-tight md:text-3xl mt-4',
      3: 'font-serif text-xl text-ink-0 leading-snug mt-2',
      4: 'font-serif text-lg text-ink-0 leading-snug',
    }
    const inline = parseInline(block.text)
    const className = classes[block.level]
    if (block.level === 1) return <h1 key={key} className={className}>{renderInline(inline)}</h1>
    if (block.level === 2) return <h2 key={key} className={className}>{renderInline(inline)}</h2>
    if (block.level === 3) return <h3 key={key} className={className}>{renderInline(inline)}</h3>
    return <h4 key={key} className={className}>{renderInline(inline)}</h4>
  }
  if (block.type === 'paragraph') {
    return (
      <p key={key} className="font-serif text-base leading-relaxed text-ink-1">
        {renderInline(parseInline(block.text))}
      </p>
    )
  }
  return (
    <ul key={key} className="flex list-disc flex-col gap-2 pl-6 text-ink-1">
      {block.items.map((item, idx) => (
        <li key={idx} className="font-serif text-base leading-relaxed">
          {renderInline(parseInline(item))}
        </li>
      ))}
    </ul>
  )
}

function renderInline(tokens: MdInline[]): React.ReactNode {
  return tokens.map((token, ix) => {
    if (token.type === 'text') return <span key={ix}>{token.value}</span>
    if (token.type === 'strong') return <strong key={ix} className="text-ink-0">{token.value}</strong>
    if (token.type === 'em') return <em key={ix}>{token.value}</em>
    if (token.type === 'code')
      return (
        <code
          key={ix}
          className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-sm text-ink-0"
        >
          {token.value}
        </code>
      )
    if (token.href.startsWith('/')) {
      return (
        <Link key={ix} href={token.href} className="text-primary-base underline hover:opacity-80">
          {token.value}
        </Link>
      )
    }
    return (
      <a
        key={ix}
        href={token.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-base underline hover:opacity-80"
      >
        {token.value}
      </a>
    )
  })
}
