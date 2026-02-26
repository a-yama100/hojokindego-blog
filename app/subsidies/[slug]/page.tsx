import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { DIFFICULTY_COLOR_BORDER } from '@/data/subsidies'
import { DeadlineLabel } from '@/components/DeadlineLabel'
import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SubsidyMemberSection } from '@/components/SubsidyMemberSection'

export const revalidate = 3600

export default async function SubsidyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServiceClient()
  const { data: s } = await supabase
    .from('subsidies')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!s) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Container className="py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{"\u88dc\u52a9\u91d1\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093"}</h1>
            <div className="flex justify-center">
              <Link href="/subsidies"><Button variant="primary">{"\u88dc\u52a9\u91d1\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    )
  }
  const score = s.target_score || 0
  const amt = s.max_amount || 0
  const scoreColor = score >= 75 ? 'text-green-700' : score >= 55 ? 'text-yellow-600' : 'text-red-600'
  const scoreBg = score >= 75 ? 'bg-green-50 border-green-300' : score >= 55 ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'
  const diffBorder = s.difficulty ? (DIFFICULTY_COLOR_BORDER[s.difficulty] || '') : ''
  const reqs: string[] = s.requirements || []
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-10">
          <Container>
            <p className="text-emerald-400 text-sm font-medium mb-2">{"\u88dc\u52a9\u91d1\u8a73\u7d30"}</p>
            <h1 className="text-2xl md:text-3xl font-bold">{s.title}</h1>
            {s.ministry && <p className="text-gray-400 text-sm mt-2">{s.ministry}</p>}
          </Container>
        </section>
        <Container className="py-8">
          <div className="flex justify-start mb-6">
            <Link href="/subsidies"><Button variant="outline" size="sm">{"\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={'border-2 rounded-xl p-4 text-center ' + scoreBg}>
              <p className="text-xs text-gray-500 mb-1">{"\u30bf\u30fc\u30b2\u30c3\u30c8\u30b9\u30b3\u30a2"}</p>
              <p className={'text-3xl font-bold ' + scoreColor}>{score}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{"\u4e0a\u9650\u984d"}</p>
              <p className="text-lg font-bold text-emerald-700">{(amt / 10000).toLocaleString()}{"\u4e07\u5186"}</p>
            </div>
            <div className={'border rounded-xl p-4 text-center ' + diffBorder}>
              <p className="text-xs mb-1">{"\u96e3\u6613\u5ea6"}</p>
              <p className="text-xl font-bold">{s.difficulty || '-'}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{"\u7de0\u5207"}</p>
              <p className="text-sm font-bold text-gray-900">{s.deadline || '-'}</p>
              <DeadlineLabel deadline={s.deadline} />
            </div>
          </div>
          {s.summary && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{"\u6982\u8981"}</h2>
              <div className="text-gray-700 space-y-3">
                {s.summary
                  .replace(/--+/g, '')
                  .replace(/■/g, '\n\n■')
                  .split('\n')
                  .filter((line: string) => line.trim())
                  .map((line: string, i: number) => <p key={i}>{line.trim()}</p>)
                }
              </div>
              {s.last_checked && <p className="text-xs text-gray-400 mt-4">{"\u6700\u7d42\u78ba\u8a8d\u65e5: "}{s.last_checked}{"\u3002\u6700\u65b0\u60c5\u5831\u306f\u5fc5\u305a\u516c\u5f0f\u30b5\u30a4\u30c8\u3067\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002"}</p>}
            </div>
          )}
          {reqs.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{"\u4e3b\u306a\u8981\u4ef6"}</h2>
              <ul className="space-y-2">
                {reqs.map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-gray-700 text-sm">{req}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <SubsidyMemberSection
            subsidyTitle={s.title}
            subsidySlug={s.slug}
            category={s.category || null}
            difficulty={s.difficulty || null}
            maxAmount={s.max_amount || null}
            targetScore={s.target_score || null}
            summary={s.summary || null}
          />
          {s.official_url && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{"\u516c\u5f0f\u30b5\u30a4\u30c8\u304b\u3089\u7533\u8acb"}</h3>
              <p className="text-gray-600 text-sm mb-4">{"\u8a73\u7d30\u306f\u5fc5\u305a\u516c\u5f0f\u30b5\u30a4\u30c8\u3067\u78ba\u8a8d\u306e\u4e0a\u3001\u7533\u8acb\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <a href={s.official_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition-colors">{"\u516c\u5f0f\u30b5\u30a4\u30c8\u3078"}</a>
                <Link href="/subsidies"><Button variant="outline">{"\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
