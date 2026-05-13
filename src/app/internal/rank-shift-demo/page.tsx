import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RankShiftPill, type RankSentiment } from '@/components/composition'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'RankShiftPill — demo',
  robots: { index: false, follow: false },
}

type Row = {
  sentiment: RankSentiment
  delta: number
  note: string
}

const ROWS: Row[] = [
  { sentiment: 'warm-up', delta: 3, note: 'Climbed three spots after the finale-week reread.' },
  { sentiment: 'warm-down', delta: -2, note: 'Down two after a cohort of new readers found it slow.' },
  { sentiment: 'neutral', delta: 0, note: 'Held position — a stable consensus week.' },
  { sentiment: 'hold', delta: 1, note: 'Locked at the top for the 18th week running.' },
  { sentiment: 'verdict', delta: -1, note: 'Slight slip after a divisive cast reveal.' },
  { sentiment: 'consensus', delta: 4, note: 'Sharp rise — community agrees with the canon.' },
]

export default function RankShiftDemoPage() {
  if (process.env['INTERNAL_DEMOS'] !== '1') notFound()
  return (
    <main
      id="main"
      data-testid="rank-shift-demo"
      style={{
        padding: '40px 32px',
        maxWidth: 720,
        margin: '0 auto',
        fontFamily: 'var(--sans, system-ui)',
      }}
    >
      <h1 style={{ fontFamily: 'var(--serif, serif)', fontSize: 32, marginBottom: 8 }}>
        RankShiftPill — demo
      </h1>
      <p style={{ marginBottom: 24, color: 'var(--ink-2, #444)' }}>
        One row per sentiment. Not rendered in production until the 72-hour
        shift signal lands. Gated by <code>INTERNAL_DEMOS=1</code>.
      </p>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {ROWS.map((row) => (
          <li
            key={row.sentiment}
            data-testid={`rank-shift-row-${row.sentiment}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: 16,
              alignItems: 'center',
              padding: '12px 16px',
              border: '1px solid var(--line, #ddd)',
              borderRadius: 8,
            }}
          >
            <code style={{ fontFamily: 'var(--mono, monospace)', fontSize: 12 }}>
              {row.sentiment}
            </code>
            <span style={{ fontSize: 14, color: 'var(--ink-1, #222)' }}>{row.note}</span>
            <RankShiftPill delta={row.delta} sentiment={row.sentiment} />
          </li>
        ))}
      </ul>
    </main>
  )
}
