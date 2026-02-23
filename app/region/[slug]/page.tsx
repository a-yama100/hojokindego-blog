import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import Link from 'next/link'
import { Button } from '@/components/Button'

const REGION_LABELS: Record<string, string> = {
  national: '\u5168\u56fd',
  tokyo: '\u6771\u4eac\u90fd',
  osaka: '\u5927\u962a\u5e9c',
  aichi: '\u611b\u77e5\u770c',
  fukuoka: '\u798f\u5ca1\u770c',
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const label = REGION_LABELS[slug] || slug
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Container className="py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{"\u5730\u57df: "}{label}</h1>
          <p className="text-gray-600 mb-6">{"\u5730\u57df\u5225\u306e\u88dc\u52a9\u91d1\u4e00\u89a7\u306f\u8fd1\u65e5\u516c\u958b\u4e88\u5b9a\u3067\u3059\u3002"}</p>
          <div className="flex justify-center">
            <Link href="/subsidies"><Button variant="primary">{"\u88dc\u52a9\u91d1\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
