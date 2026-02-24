import { Suspense } from 'react'
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
              <p className="text-emerald-400 text-sm font-medium mb-1">{"補助金検索"}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{"あなたに合った補助金を見つけよう"}</h1>
              <p className="text-gray-400 text-sm mt-2">{"中小企業・個人事業主向けの補助金・助成金一覧"}</p>
            </div>
          </Container>
        </section>
        <Container className="py-8">
          <Suspense fallback={<div className="text-center py-8 text-gray-500">{"読み込み中..."}</div>}>
            <SubsidySearch initialData={subsidies || []} />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
