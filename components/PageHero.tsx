import { Container } from './Container'

interface PageHeroProps {
  title: string
  subtitle?: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-gray-950 text-white py-16">
      <Container>
        <h1 className="text-3xl md:text-4xl font-bold text-center">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-400 text-center mt-4">{subtitle}</p>
        )}
      </Container>
    </section>
  )
}
