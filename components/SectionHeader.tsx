interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
  center?: boolean
}

export function SectionHeader({ title, subtitle, action, className = '', center = false }: SectionHeaderProps) {
  const alignClass = center ? 'text-center' : ''
  
  return (
    <div className={'mb-8 ' + alignClass + ' ' + className}>
      <div className={center ? '' : 'flex items-center justify-between'}>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>
        {action && !center && <div>{action}</div>}
      </div>
      {action && center && <div className="mt-4">{action}</div>}
    </div>
  )
}
