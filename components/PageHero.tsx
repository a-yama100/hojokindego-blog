import { Container } from './Container'

interface PageHeroProps {
  title: string
  subtitle?: string
  // 本文の Container と同じ幅にそろえる（2026-11-26）
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export function PageHero({ title, subtitle, size = 'lg' }: PageHeroProps) {
  return (
    <section className="bg-gray-950 text-white py-16">
      <Container size={size}>
        <h1 className="text-3xl md:text-4xl font-bold text-center">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-400 text-center mt-4">{subtitle}</p>
        )}
      </Container>
    </section>
  )
}
