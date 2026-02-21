import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="py-20 min-h-screen">
        <Container size="md">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">ページが見つかりません</p>
            <p className="text-gray-500 mb-8">お探しのページは存在しないか、移動した可能性があります。</p>
            <Link href="/" className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-8 rounded-lg font-medium transition-colors">
              トップページに戻る
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
