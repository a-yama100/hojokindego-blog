'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import { AccessGuard } from '@/components/AccessGuard'
import { Button } from '@/components/Button'
import Link from 'next/link'
import { CATEGORIES } from '@/data/subsidies'

interface MatchResult {
  slug: string
  title: string
  category: string | null
  difficulty: string | null
  max_amount: number | null
  target_score: number | null
  deadline: string | null
  match_reason: string
}

const INDUSTRIES = [
  { value: 'it', label: 'IT・ソフトウェア' },
  { value: 'manufacturing', label: '製造業' },
  { value: 'retail', label: '小売・飲食' },
  { value: 'service', label: 'サービス業' },
  { value: 'construction', label: '建設業' },
  { value: 'medical', label: '医療・福祀' },
  { value: 'agriculture', label: '農業・漁業' },
  { value: 'other', label: 'その他' },
]

const PURPOSES = [
  { value: 'digitalization', label: 'IT導入・デジタル化' },
  { value: 'equipment', label: '設備導入' },
  { value: 'startup', label: '創業・新事業' },
  { value: 'expansion', label: '販路拡大' },
  { value: 'hiring', label: '雇用・人材育成' },
  { value: 'energy', label: '省エネ・環境' },
  { value: 'reconstruction', label: '事業転換・再構築' },
]

const SIZES = [
  { value: 'solo', label: '個人事業主' },
  { value: 'micro', label: '1〜5人' },
  { value: 'small', label: '6〜20人' },
  { value: 'medium', label: '21〜100人' },
  { value: 'large', label: '101人以上' },
]

export default function MatchingToolPage() {
  const [industry, setIndustry] = useState('')
  const [purpose, setPurpose] = useState('')
  const [size, setSize] = useState('')
  const [results, setResults] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!industry || !purpose) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch('/api/tools/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, purpose, size }),
      })
      if (res.ok) {
        const data = await res.json()
        setResults(data.results || [])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolLayout
      toolId="matching"
      title="補助金マッチング"
      description="業種・規模・目的から最適な補助金をAIが提案"
      category="補助金検索"
    >
      <AccessGuard toolId="matching" requiredPlan="standard">
        {(checkAccess: () => boolean) => (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">業種 <span className="text-red-500">*</span></label>
                <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">選択してください</option>
                  {INDUSTRIES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目的 <span className="text-red-500">*</span></label>
                <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">選択してください</option>
                  {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">従業員規模</label>
                <select value={size} onChange={e => setSize(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">選択してください</option>
                  {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div className="text-center">
              <Button
                variant="primary"
                onClick={() => { if (checkAccess()) handleSearch() }}
                disabled={!industry || !purpose || loading}
              >
                {loading ? '検索中...' : 'AIマッチングを実行'}
              </Button>
            </div>

            {searched && !loading && (
              <div className="space-y-4">
                {results.length > 0 ? (
                  <>
                    <h3 className="text-lg font-bold text-gray-900">おすすめの補助金 ({results.length}件)</h3>
                    {results.map((r, i) => {
                      const cat = r.category ? CATEGORIES[r.category] : null
                      const scoreColor = (r.target_score || 0) >= 70 ? 'text-green-700' : (r.target_score || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                      return (
                        <Link key={i} href={'/subsidies/' + r.slug} className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex gap-2 mb-2">
                                {cat && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + cat.color}>{cat.label}</span>}
                                {r.difficulty && <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{r.difficulty}</span>}
                              </div>
                              <h4 className="font-bold text-gray-900 mb-1">{r.title}</h4>
                              <p className="text-sm text-gray-500">上限: {r.max_amount ? (r.max_amount / 10000).toLocaleString() + '万円' : '-'} / 締切: {r.deadline || '-'}</p>
                              <p className="text-sm text-emerald-700 mt-2">{r.match_reason}</p>
                            </div>
                            <div className="text-center ml-4">
                              <p className="text-xs text-gray-500">スコア</p>
                              <p className={'text-2xl font-bold ' + scoreColor}>{r.target_score || '-'}</p>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>条件に合う補助金が見つかりませんでした。</p>
                    <p className="text-sm mt-1">条件を変えて再度お試しください。</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </AccessGuard>
    </ToolLayout>
  )
}