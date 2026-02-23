import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { SubsidyCard } from '@/components/SubsidyCard'
import { CATEGORIES } from '@/data/subsidies'
import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 3600

export default async function SubsidiesPage() {
  const supabase = await createServiceClient()
  const { data: subsidies } = await supabase
    .from('subsidies')
    .select('*')
    .eq('is_active', true)
    .order('target_score', { ascending: false })

  const items = subsidies || []
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-10">
          <Container>
            <div className="text-center">
              <p className="text-emerald-400 text-sm font-medium mb-1">{"\u88dc\u52a9\u91d1\u691c\u7d22"}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{"\u3042\u306a\u305f\u306b\u5408\u3063\u305f\u88dc\u52a9\u91d1\u3092\u898b\u3064\u3051\u3088\u3046"}</h1>
              <p className="text-gray-400 text-sm mt-2">{"\u4e2d\u5c0f\u4f01\u696d\u30fb\u500b\u4eba\u4e8b\u696d\u4e3b\u5411\u3051\u306e\u88dc\u52a9\u91d1\u30fb\u52a9\u6210\u91d1\u4e00\u89a7"}</p>
            </div>
          </Container>
        </section>
        <Container className="py-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <Link href="/subsidies" className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-700 text-white">{"\u3059\u3079\u3066"}</Link>
            {Object.entries(CATEGORIES).map(([slug, cat]) => (
              <Link key={slug} href={"/category/" + slug} className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                {cat.label}
              </Link>
            ))}
          </div>
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((s: any) => <SubsidyCard key={s.slug} s={s} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{"\u73fe\u5728\u63b2\u8f09\u4e2d\u306e\u88dc\u52a9\u91d1\u306f\u3042\u308a\u307e\u305b\u3093\u3002"}</p>
            </div>
          )}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">{"\u30d7\u30ec\u30df\u30a2\u30e0\u4f1a\u54e1\u306f\u7de0\u5207\u30a2\u30e9\u30fc\u30c8\u3084\u696d\u7a2e\u5225\u304a\u3059\u3059\u3081\u3092\u3054\u5229\u7528\u3044\u305f\u3060\u3051\u307e\u3059\u3002"}</p>
            <Link href="/pricing"><Button variant="outline">{"\u4f1a\u54e1\u30d7\u30e9\u30f3\u3092\u898b\u308b"}</Button></Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
