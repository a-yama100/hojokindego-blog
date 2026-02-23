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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{"\u30ab\u30c6\u30b4\u30ea: "}{slug}</h1>
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
