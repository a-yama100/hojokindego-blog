import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SubsidySearch } from '@/components/SubsidySearch'
import { createServiceClient } from '@/lib/supabase/server'

export const revalidate = 3600

export default async function SubsidiesPage() {
  const supabase = createServiceClient()
  const { data: subsidies } = await supabase
    .from('subsidies')
    .select('*')
    .eq('is_active', true)
    .order('target_score', { ascending: false })

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
          <SubsidySearch initialData={subsidies || []} />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
