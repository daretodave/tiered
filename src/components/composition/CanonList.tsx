import type { HTMLAttributes, ReactNode } from 'react'

type CanonListProps = {
  children?: ReactNode
} & Omit<HTMLAttributes<HTMLOListElement>, 'children'>

export function CanonList({ children, className, ...rest }: CanonListProps) {
  const compiled = `canon-list${className ? ` ${className}` : ''}`
  return (
    <ol className={compiled} data-testid="canon-list" {...rest}>
      {children}
    </ol>
  )
}
