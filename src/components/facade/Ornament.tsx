import type { ReactNode, SVGProps } from 'react'
import { slotCoords } from '@/lib/facade'

type OrnamentProps = {
  cx?: number
  cy?: number
  size?: number
  children?: ReactNode
} & Omit<SVGProps<SVGGElement>, 'cx' | 'cy' | 'children'>

export function Ornament({
  cx = 0,
  cy = 0,
  size = slotCoords.ornament.defaultSize,
  children,
  ...rest
}: OrnamentProps) {
  const r = size / 2
  return (
    <g
      transform={`translate(${cx} ${cy})`}
      data-testid="ornament"
      data-slot="ornament"
      data-size={size}
      {...rest}
    >
      {children ?? (
        <g
          stroke="var(--show-primary, var(--color-primary-base))"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          data-testid="ornament-default"
        >
          <circle r={r * 0.35} fill="var(--show-primary, var(--color-primary-base))" />
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i * Math.PI) / 3
            const x1 = Math.cos(angle) * r * 0.5
            const y1 = Math.sin(angle) * r * 0.5
            const x2 = Math.cos(angle) * r
            const y2 = Math.sin(angle) * r
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          })}
        </g>
      )}
    </g>
  )
}
