import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/Button'
import Link from 'next/link'

const SUBSIDIES = [
  { slug: 'it-introduction-subsidy', title: 'IT導入補助金', category: 'digitalization', region: 'national', maxAmount: 4500000, difficulty: '普通', targetScore: 78, deadline: '2025-12-31' },
  { slug: 'monodukuri-subsidy', title: 'ものづくり・商業・サービス補助金', category: 'manufacturing', region: 'national', maxAmount: 12500000, difficulty: '難しい', targetScore: 62, deadline: '2025-09-30' },
  { slug: 'jizokuka-kyoka-subsidy', title: '小規模事業者持続化補助金', category: 'general', region: 'national', maxAmount: 500000, difficulty: '簡単', targetScore: 85, deadline: '2025-06-30' },
  { slug: 'saikouchiku-subsidy', title: '事業再構築補助金', category: 'reconstruction', region: 'national', maxAmount: 150000000, difficulty: '難しい', targetScore: 55, deadline: '2025-10-31' },
  { slug: 'tokyo-startup-subsidy', title: '東京都創業助成金', category: 'startup', region: 'tokyo', maxAmount: 3000000, difficulty: '普通', targetScore: 72, deadline: '2025-08-31' },
]

const CATEGORIES: Record<string, { label: string; color: string }> = {
  digitalization: { label: 'IT・デジタル化', color: 'bg-blue-100 text-blue-800' },
  manufacturing: { label: '製造業・ものづくり', color: 'bg-orange-100 text-orange-800' },
  general: { label: '一般事業', color: 'bg-green-100 text-green-800' },
  reconstruction: { label: '事業再構築', color: 'bg-purple-100 text-purple-800' },
  startup: { label: '創業・スタートアップ', color: 'bg-pink-100 text-pink-800' },
}

const DIFFICULTY_COLOR: Record<string, string> = {
  '簡単': 'text-green-700 bg-green-50',
  '普通': 'text-yellow-700 bg-yellow-50',
  '難しい': 'text-red-700 bg-red-50',
}

export default function SubsidiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-10">
          <Container>
            <div className="text-center">
              <p className="text-emerald-400 text-sm font-medium mb-1">補助金検索</p>
              <h1 className="text-3xl md:text-4xl font-bold">あなたに合った補助金を見つけよう</h1>
              <p className="text-gray-400 text-sm mt-2">中小企業・個人事業主向けの補助金・助成金一覧</p>
            </div>
          </Container>
        </section>

        <Container className="py-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <Link href="/subsidies" className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-700 text-white">すべて</Link>
            {Object.entries(CATEGORIES).map(([slug, cat]) => (
              <Link key={slug} href={'/category/' + slug} className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            {SUBSIDIES.map((s) => {
              const cat = CATEGORIES[s.category]
              const diffClass = DIFFICULTY_COLOR[s.difficulty] || ''
              const scoreColor = s.targetScore >= 75 ? 'text-green-700' : s.targetScore >= 50 ? 'text-yellow-600' : 'text-red-600'
              return (
                <Link key={s.slug} href={'/subsidies/' + s.slug} className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {cat && <span className={"px-2 py-0.5 rounded text-xs font-medium " + cat.color}>{cat.label}</span>}
                        <span className={"px-2 py-0.5 rounded text-xs font-medium " + diffClass}>{s.difficulty}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{s.region === 'national' ? '全国' : s.region}</span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h2>
                      <p className="text-sm text-gray-500">上限額: {(s.maxAmount / 10000).toLocaleString()}万円 / 締切: {s.deadline}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-xs text-gray-500">ターゲットスコア</p>
                      <div className={"text-3xl font-black " + scoreColor}>{s.targetScore}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-8 text-gray-500 text-sm">
            ※ 上記は代表的な補助金の一例です。実際の補助金データは今後拡充予定です。
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
