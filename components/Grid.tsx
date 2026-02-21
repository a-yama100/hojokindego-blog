import React from 'react'

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
  centerLastRow?: boolean
}

export function Grid({ children, cols = 3, gap = 'md', className = '', centerLastRow = true }: GridProps) {
  const colsClass: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const gapClass: Record<string, string> = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  if (!centerLastRow) {
    return (
      <div className={'grid ' + colsClass[cols] + ' ' + gapClass[gap] + ' ' + className}>
        {children}
      </div>
    )
  }

  const items = React.Children.toArray(children)
  const remainder = items.length % cols

  if (remainder === 0 || cols === 1) {
    return (
      <div className={'grid ' + colsClass[cols] + ' ' + gapClass[gap] + ' ' + className}>
        {children}
      </div>
    )
  }

  const mainItems = items.slice(0, items.length - remainder)
  const lastRowItems = items.slice(items.length - remainder)

  return (
    <div className={className}>
      <div className={'grid ' + colsClass[cols] + ' ' + gapClass[gap]}>
        {mainItems}
      </div>
      <div className={'flex justify-center ' + gapClass[gap] + ' mt-' + gapClass[gap].replace('gap-', '')}>
        {lastRowItems.map((item, i) => (
          <div key={i} className={cols === 3 ? 'w-full md:w-1/2 lg:w-1/3' : 'w-full md:w-1/2'}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
