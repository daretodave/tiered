import type { ReactNode, SVGProps } from 'react'
import { type ColumnPosition, slotCoords } from '@/lib/facade'

type ColumnProps = {
  position: ColumnPosition
  children?: ReactNode
} & Omit<SVGProps<SVGGElement>, 'children' | 'position'>

export function Column({ position, children, ...rest }: ColumnProps) {
  const { x, y, width, height } = slotCoords.columns[position]
  return (
    <g data-testid={`column-${position}`} data-slot="column" data-position={position} {...rest}>
      {children ?? (
        <>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill="var(--show-ink, var(--color-ink-0))"
            data-testid={`column-${position}-default-body`}
          />
          <rect
            x={x - 6}
            y={y - 8}
            width={width + 12}
            height={8}
            fill="var(--show-ink, var(--color-ink-0))"
          />
          <rect
            x={x - 6}
            y={y + height}
            width={width + 12}
            height={8}
            fill="var(--show-ink, var(--color-ink-0))"
          />
        </>
      )}
    </g>
  )
}
