"use client"
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { hasAccess, PlanType } from '@/lib/supabase/types'
import { Button } from './Button'
import Link from 'next/link'

interface SubsidyMemberSectionProps {
  subsidyTitle: string
  subsidySlug: string
  category: string | null
  difficulty: string | null
  maxAmount: number | null
  targetScore: number | null
  summary: string | null
}

function LockOverlay({ requiredPlan, label }: { requiredPlan: string; label: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
        <p className="text-xs text-gray-500 mb-3">{requiredPlan}以上で閲覧できます</p>
        <Link href="/pricing">
          <Button variant="primary" size="sm">プランを見る</Button>
        </Link>
      </div>
      <div className="opacity-20 pointer-events-none select-none">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
export function SubsidyMemberSection({
  subsidyTitle, subsidySlug, category, difficulty, maxAmount, targetScore, summary
}: SubsidyMemberSectionProps) {
  const { user, loading } = useAuth()
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const userPlan = (user?.plan_type || 'free') as PlanType
  const hasLight = !loading && user && hasAccess(userPlan, 'light')

  const estimateRate = () => {
    const score = targetScore || 50
    if (score >= 80) return { rate: '60〜80%', level: '高い', color: 'text-green-700 bg-green-50 border-green-200' }
    if (score >= 60) return { rate: '40〜60%', level: 'やや高い', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' }
    if (score >= 40) return { rate: '20〜40%', level: '普通', color: 'text-orange-700 bg-orange-50 border-orange-200' }
    return { rate: '10〜20%', level: '競争率高', color: 'text-red-700 bg-red-50 border-red-200' }
  }

  const getTips = () => {
    const tips: string[] = []
    if (difficulty === '簡単') {
      tips.push('比較的簡単な補助金です。初めての方でも申請しやすいでしょう。')
      tips.push('申請書は簡潔に、具体的な数字を入れて書きましょう。')
    } else if (difficulty === '難しい') {
      tips.push('競争率が高い補助金です。事業計画書の完成度が重要です。')
      tips.push('専門家のレビューを受けることを強くおすすめします。')
    } else {
      tips.push('標準的な難易度です。要件をしっかり確認して申請しましょう。')
    }
    if (maxAmount && maxAmount >= 10000000) {
      tips.push('高額補助金のため、詳細な事業計画と収支計画が必須です。')
    }
    if (category === 'digitalization') {
      tips.push('IT導入の効果を具体的な数字（売上○%向上、工数○時間削減など）で示しましょう。')
    } else if (category === 'startup') {
      tips.push('創業の動機と市場調査結果を具体的に記載しましょう。')
    } else if (category === 'manufacturing') {
      tips.push('設備導入による生産性向上の具体的な見込みを示しましょう。')
    }
    tips.push('締切の2週間前までには書類を完成させましょう。')
    return tips
  }

  const runAiAnalysis = async () => {
    setAiLoading(true)
    try {
      const res = await fetch('/api/subsidies/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: subsidySlug }),
      })
      if (res.ok) {
        const data = await res.json()
        setAiAnalysis(data.analysis)
      } else {
        setAiAnalysis('分析に失敗しました。しばらくしてから再度お試しください。')
      }
    } catch {
      setAiAnalysis('エラーが発生しました。')
    } finally {
      setAiLoading(false)
    }
  }

  const rateInfo = estimateRate()
  const tips = getTips()
  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        会員限定分析
      </h2>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 採択率推定</h3>
        {hasLight ? (
          <div>
            <div className={'inline-flex items-center gap-2 px-4 py-2 rounded-lg border ' + rateInfo.color}>
              <span className="text-2xl font-bold">{rateInfo.rate}</span>
              <span className="text-sm font-medium">（{rateInfo.level}）</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              ※ 過去の類似補助金のデータからのAI推定値です。実際の採択率とは異なる場合があります。
            </p>
          </div>
        ) : (
          <LockOverlay requiredPlan="ライト会員" label="採択率推定を見る" />
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 申請のコツ</h3>
        {hasLight ? (
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-gray-700 text-sm">{tip}</p>
              </li>
            ))}
          </ul>
        ) : (
          <LockOverlay requiredPlan="ライト会員" label="申請のコツを見る" />
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🤖 AI分析</h3>
        {hasLight ? (
          <div>
            {aiAnalysis ? (
              <div className="prose prose-sm max-w-none">
                {aiAnalysis.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                  <p key={i} className="text-gray-700">{line}</p>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-4">
                  AIがこの補助金の特徴・注意点・おすすめの申請戦略を分析します。
                </p>
                <Button
                  variant="primary"
                  onClick={runAiAnalysis}
                  disabled={aiLoading}
                >
                  {aiLoading ? '分析中...' : 'AI分析を実行'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <LockOverlay requiredPlan="ライト会員" label="AI分析を使う" />
        )}
      </div>
    </div>
  )
}