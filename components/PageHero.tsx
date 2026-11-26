import { Container } from './Container'

interface PageHeroProps {
  title: string
  subtitle?: string
  // 本文の Container と同じ幅にそろえる（2026-11-26）
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export function PageHero({ title, subtitle, size = 'lg' }: PageHeroProps) {
  return (
    <section className="pt-6">
      <Container size={size}>
        {/* 背景の帯も本文の幅に収める（2026-11-27） */}
        <div className="bg-gray-950 text-white rounded-2xl px-6 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-center">{title}</h1>
          {subtitle && (
            <p className="text-xl text-gray-400 text-center mt-4">{subtitle}</p>
          )}
        </div>
      </Container>
    </section>
  )
}
