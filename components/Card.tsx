import Link from 'next/link'

interface CardProps {
  children: React.ReactNode
  className?: string
  href?: string
  hover?: boolean
}

export function Card({ children, className = '', href, hover = true }: CardProps) {
  const baseStyles = 'bg-white rounded-xl border border-gray-200'
  const hoverStyles = hover ? 'transition-shadow hover:shadow-lg' : ''
  
  if (href) {
    return (
      <Link href={href} className={baseStyles + ' ' + hoverStyles + ' block ' + className}>
        {children}
      </Link>
    )
  }
  
  return (
    <div className={baseStyles + ' ' + hoverStyles + ' ' + className}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={'p-6 ' + className}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={'text-xl font-bold text-gray-900 ' + className}>{children}</h3>
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={'text-gray-600 mt-2 ' + className}>{children}</p>
}
