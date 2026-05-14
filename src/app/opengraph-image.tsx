import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'tiered.tv — the seasons, ranked. no spoilers.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0E0B08',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '80px',
        color: '#F2EADB',
        fontFamily: 'serif',
      }}
    >
      <div style={{ fontSize: 140, color: '#E8B65A', lineHeight: 1 }}>
        tiered.tv
      </div>
      <div
        style={{
          marginTop: 30,
          fontSize: 56,
          color: '#D8CFBE',
          lineHeight: 1.1,
        }}
      >
        the seasons, ranked.
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 56,
          color: '#9D9485',
          lineHeight: 1.1,
        }}
      >
        no spoilers.
      </div>
    </div>,
    {
      ...size,
    },
  )
}
