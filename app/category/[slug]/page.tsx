import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { Button } from '@/components/Button'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Container className="py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category: {slug}</h1>
          <p className="text-gray-600 mb-6">Subsidies filtered by category. Coming soon.</p>
          <div className="flex justify-center">
            <Link href="/subsidies"><Button variant="primary">Back to Subsidies</Button></Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
