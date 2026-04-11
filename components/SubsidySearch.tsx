"use client"
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES, REGIONS, DIFFICULTY_COLOR } from '@/data/subsidies'
import { DeadlineLabel } from '@/components/DeadlineLabel'

interface SubsidyItem {
  id: string; slug: string; title: string; summary: string | null
  category: string | null; region: string | null; max_amount: number | null
  difficulty: string | null; target_score: number | null; deadline: string | null
}

const AMOUNT_OPTIONS = [
  { value: '', label: '指定なし' },
  { value: '500000', label: '50万円以上' },
  { value: '1000000', label: '100万円以上' },
  { value: '5000000', label: '500万円以上' },
  { value: '10000000', label: '1,000万円以上' },
  { value: '50000000', label: '5,000万円以上' },
]

const SORT_OPTIONS = [
  { value: 'score', label: 'スコア順' },
  { value: 'deadline', label: '締切が近い順' },
  { value: 'amount', label: '金額が大きい順' },
]

export function SubsidySearch({ initialData }: { initialData: SubsidyItem[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [region, setRegion] = useState(searchParams.get('region') || '')
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '')
  const [minAmount, setMinAmount] = useState(searchParams.get('min') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'score')
  const [results, setResults] = useState<SubsidyItem[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const hasParams = searchParams.get('q') || searchParams.get('category') || searchParams.get('region') || searchParams.get('difficulty') || searchParams.get('min')

  useEffect(() => {
    if (hasParams) { doSearch() }
  }, [])

  function updateUrl(params: Record<string, string>) {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v) })
    const qs = sp.toString()
    router.replace('/subsidies' + (qs ? '?' + qs : ''), { scroll: false })
  }

  async function doSearch() {
    setLoading(true)
    setSearched(true)
    const params: Record<string, string> = {}
    if (keyword) params.q = keyword
    if (category) params.category = category
    if (region) params.region = region
    if (difficulty) params.difficulty = difficulty
    if (minAmount) params.min = minAmount
    if (sort && sort !== 'score') params.sort = sort
    updateUrl(params)
    const sp = new URLSearchParams()
    if (keyword) sp.set('q', keyword)
    if (category) sp.set('category', category)
    if (region) sp.set('region', region)
    if (difficulty) sp.set('difficulty', difficulty)
    if (minAmount) sp.set('min', minAmount)
    if (sort) sp.set('sort', sort)
    try {
      const res = await fetch('/api/subsidies/search?' + sp.toString())
      const json = await res.json()
      setResults(json.subsidies || [])
    } catch {
      setResults([])
    }
    setLoading(false)
  }

  function reset() {
    setKeyword(''); setCategory(''); setRegion(''); setDifficulty('')
    setMinAmount(''); setSort('score')
    setResults(initialData); setSearched(false)
    router.replace('/subsidies', { scroll: false })
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{"キーワード"}</label>
            <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder={"補助金名、業種など"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onKeyDown={e => e.key === 'Enter' && doSearch()} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{"カテゴリ"}</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm">
              <option value="">{"すべて"}</option>
              {Object.entries(CATEGORIES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{"地域"}</label>
            <select value={region} onChange={e => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm">
              <option value="">{"すべて"}</option>
              {Object.entries(REGIONS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{"難易度"}</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm">
              <option value="">{"すべて"}</option>
              <option value={"簡単"}>{"簡単"}</option>
              <option value={"普通"}>{"普通"}</option>
              <option value={"難しい"}>{"難しい"}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{"最低金額"}</label>
            <select value={minAmount} onChange={e => setMinAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm">
              {AMOUNT_OPTIONS.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{"並び替え"}</label>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm">
              {SORT_OPTIONS.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={doSearch} disabled={loading}
            className="px-6 py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 text-sm">
            {loading ? "検索中..." : "検索"}</button>
          <button onClick={reset}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors text-sm cursor-pointer">
            {"リセット"}</button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">{searched ? results.length + "件の補助金が見つかりました" : results.length + "件の補助金が掲載中"}</p>
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((s) => {
            const cat = s.category ? CATEGORIES[s.category] : null
            const diffClass = s.difficulty ? (DIFFICULTY_COLOR[s.difficulty] || '') : ''
            const score = s.target_score || 0
            const scoreColor = score >= 75 ? 'text-green-700' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
            const regionLabel = s.region ? (REGIONS[s.region] || s.region) : ''
            const amt = s.max_amount || 0
            return (
              <Link key={s.id} href={'/subsidies/' + s.slug} className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {cat && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + cat.color}>{cat.label}</span>}
                      {s.difficulty && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + diffClass}>{s.difficulty}</span>}
                      {regionLabel && <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{regionLabel}</span>}
                      <DeadlineLabel deadline={s.deadline} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h2>
                    <p className="text-sm text-gray-500">{"上限額: "}{(amt / 10000).toLocaleString()}{"万円"}{s.deadline ? " / 締切: " + s.deadline : ""}</p>
                    {s.summary && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{s.summary}</p>}
                  </div>
                  <div className="text-center md:text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{"スコア"}</p>
                    <div className={'text-3xl font-black ' + scoreColor}>{score}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">{"椝件に合う補助金が見つかりませんでした。"}</p>
        </div>
      )}
    </div>
  )
}
