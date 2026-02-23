import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { Button } from '@/components/Button'

const CATEGORY_LABELS: Record<string, string> = {
  digitalization: 'IT\u30fb\u30c7\u30b8\u30bf\u30eb\u5316',
  manufacturing: '\u88fd\u9020\u696d\u30fb\u3082\u306e\u3065\u304f\u308a',
  general: '\u4e00\u822c\u4e8b\u696d',
  reconstruction: '\u4e8b\u696d\u518d\u69cb\u7bc9',
  startup: '\u5275\u696d\u30fb\u30b9\u30bf\u30fc\u30c8\u30a2\u30c3\u30d7',
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const label = CATEGORY_LABELS[slug] || slug
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Container className="py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{"\u30ab\u30c6\u30b4\u30ea: "}{label}</h1>
          <p className="text-gray-600 mb-6">{"\u30ab\u30c6\u30b4\u30ea\u5225\u306e\u88dc\u52a9\u91d1\u4e00\u89a7\u306f\u8fd1\u65e5\u516c\u958b\u4e88\u5b9a\u3067\u3059\u3002"}</p>
          <div className="flex justify-center">
            <Link href="/subsidies"><Button variant="primary">{"\u88dc\u52a9\u91d1\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
