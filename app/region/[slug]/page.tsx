import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { SubsidyCard } from '@/components/SubsidyCard'
import { REGIONS } from '@/data/subsidies'
import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 3600

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const label = REGIONS[slug] || slug

  const supabase = await createServiceClient()
  const { data: subsidies } = await supabase
    .from('subsidies')
    .select('*')
    .eq('is_active', true)
    .eq('region', slug)
    .order('target_score', { ascending: false })

  const items = subsidies || []
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-10">
          <Container>
            <div className="text-center">
              <p className="text-emerald-400 text-sm font-medium mb-1">{"\u5730\u57df\u5225\u88dc\u52a9\u91d1"}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{label}</h1>
            </div>
          </Container>
        </section>
        <Container className="py-8">
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((s: any) => <SubsidyCard key={s.slug} s={s} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{"\u3053\u306e\u5730\u57df\u306e\u88dc\u52a9\u91d1\u306f\u307e\u3060\u767b\u9332\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002"}</p>
              <Link href="/subsidies"><Button variant="primary">{"\u88dc\u52a9\u91d1\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
