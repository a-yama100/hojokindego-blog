"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Card, CardContent } from '@/components/Card'
import { DeadlineLabel } from '@/components/DeadlineLabel'
import { CATEGORIES, REGIONS, DIFFICULTY_COLOR } from '@/data/subsidies'
import { hasAccess } from '@/lib/supabase/types'
import type { PlanType } from '@/lib/supabase/types'

const PLAN_LABELS: Record<string, string> = {
  free: '無料会員',
  light: 'ライト会員',
  standard: 'スタンダード会員',
  premium: 'プレミアム会員',
}

const PLAN_BADGE: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'premium'> = {
  free: 'default',
  light: 'primary',
  standard: 'success',
  premium: 'premium',
}

interface SubsidyRow {
  id: string; slug: string; title: string; summary: string | null
  category: string | null; region: string | null; max_amount: number | null
  difficulty: string | null; target_score: number | null; deadline: string | null
}

interface SavedRow {
  id: string; created_at: string; subsidy_id: string
  subsidies: SubsidyRow
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [summary, setSummary] = useState<{ savedCount: number; alertsCount: number; urgentDeadlines: number } | null>(null)
  const [saved, setSaved] = useState<SavedRow[]>([])
  const [recommended, setRecommended] = useState<SubsidyRow[]>([])
  const [loading, setLoading] = useState(true)

  const plan = (user?.plan_type || 'free') as PlanType
  const isLight = hasAccess(plan, 'light')
  const isStandard = hasAccess(plan, 'standard')

  useEffect(() => {
    if (authLoading || !user) return
    async function load() {
      setLoading(true)
      try {
        const [sumRes, savedRes, recRes] = await Promise.all([
          fetch('/api/dashboard/summary'),
          fetch('/api/dashboard/saved'),
          fetch('/api/subsidies/search?sort=score&limit=5'),
        ])
        if (sumRes.ok) setSummary(await sumRes.json())
        if (savedRes.ok) {
          const d = await savedRes.json()
          setSaved(d.saved || [])
        }
        if (recRes.ok) {
          const d = await recRes.json()
          setRecommended((d.subsidies || []).slice(0, 5))
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [authLoading, user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Container className="py-20 text-center">
          <p className="text-gray-500">読み込み中...</p>
        </Container>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Container className="py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <p className="text-gray-600 mb-8">マイページを見るには、ログインしてください。</p>
          <div className="flex justify-center gap-4">
            <Link href="/login"><Button variant="primary">ログイン</Button></Link>
            <Link href="/signup"><Button variant="outline">無料で登録する</Button></Link>
          </div>
        </Container>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <Container>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-xl p-6 md:p-8 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {"ようこそ、" + (user.username || user.email.split("@")[0]) + " さん"}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge variant={PLAN_BADGE[plan] || 'default'} size="md">{PLAN_LABELS[plan] || '無料会員'}</Badge>
                  {user.subscription_expires_at && (
                    <span className="text-emerald-200 text-sm">
                      {"有効期限: " + new Date(user.subscription_expires_at).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                </div>
              </div>
              {!isStandard && (
                <Link href="/pricing">
                  <Button variant="white" size="sm">プランを変更する</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/dashboard/saved">
              <Card hover>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-1">保存した補助金</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '-' : (summary?.savedCount || 0)}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/alerts">
              <Card hover>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-1">設定中の締切アラート</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '-' : (summary?.alertsCount || 0)}</p>
                  {!isLight && <p className="text-xs text-amber-600 mt-1">ライト会員以上で使えます</p>}
                </CardContent>
              </Card>
            </Link>
            <Card hover={false}>
              <CardContent>
                <p className="text-sm text-gray-500 mb-1">締切が近い補助金</p>
                <p className="text-3xl font-bold text-red-600">{loading ? '-' : (summary?.urgentDeadlines || 0)}</p>
                <p className="text-xs text-gray-400 mt-1">14日以内</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Search */}
          <div className="mb-8">
            <SectionHeader title="補助金を探す" subtitle="事業に合う補助金を見つけましょう" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/subsidies" className="flex-1">
                <Button variant="primary" fullWidth>すべての補助金を検索</Button>
              </Link>
              <Link href="/subsidies?sort=deadline" className="flex-1">
                <Button variant="outline" fullWidth>締切が近い順</Button>
              </Link>
              <Link href="/subsidies?sort=score" className="flex-1">
                <Button variant="outline" fullWidth>スコアが高い順</Button>
              </Link>
            </div>
          </div>

          {/* Saved Subsidies Preview */}
          <div className="mb-8">
            <SectionHeader
              title="保存した補助金"
              action={saved.length > 0 ? <Link href="/dashboard/saved"><Button variant="ghost" size="sm">すべて見る</Button></Link> : undefined}
            />
            {loading ? (
              <p className="text-gray-500 text-center py-8">読み込み中...</p>
            ) : saved.length === 0 ? (
              <Card hover={false}>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500 mb-4">保存した補助金はまだありません。</p>
                  <Link href="/subsidies"><Button variant="primary" size="sm">補助金を探す</Button></Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {saved.slice(0, 3).map((item) => {
                  const s = item.subsidies
                  if (!s) return null
                  const cat = s.category ? CATEGORIES[s.category] : null
                  const diffClass = s.difficulty ? (DIFFICULTY_COLOR[s.difficulty] || '') : ''
                  const score = s.target_score || 0
                  const scoreColor = score >= 75 ? 'text-green-700' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                  return (
                    <Link key={item.id} href={'/subsidies/' + s.slug} className="block bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {cat && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + cat.color}>{cat.label}</span>}
                            {s.difficulty && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + diffClass}>{s.difficulty}</span>}
                            <DeadlineLabel deadline={s.deadline} />
                          </div>
                          <h3 className="font-bold text-gray-900 truncate">{s.title}</h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">スコア</p>
                          <span className={'text-2xl font-black ' + scoreColor}>{score}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recommended Subsidies */}
          <div className="mb-8">
            <SectionHeader title="おすすめの補助金" subtitle="スコアが高い補助金" />
            {loading ? (
              <p className="text-gray-500 text-center py-8">読み込み中...</p>
            ) : recommended.length === 0 ? (
              <Card hover={false}>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">表示できる補助金がありません。</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recommended.map((s) => {
                  const cat = s.category ? CATEGORIES[s.category] : null
                  const diffClass = s.difficulty ? (DIFFICULTY_COLOR[s.difficulty] || '') : ''
                  const score = s.target_score || 0
                  const scoreColor = score >= 75 ? 'text-green-700' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                  return (
                    <Link key={s.id} href={'/subsidies/' + s.slug} className="block bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {cat && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + cat.color}>{cat.label}</span>}
                            {s.difficulty && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + diffClass}>{s.difficulty}</span>}
                            <DeadlineLabel deadline={s.deadline} />
                          </div>
                          <h3 className="font-bold text-gray-900 truncate">{s.title}</h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">スコア</p>
                          <span className={'text-2xl font-black ' + scoreColor}>{score}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Plan Features */}
          {!isStandard && (
            <div className="bg-white rounded-xl border border-emerald-200 p-6 mb-8">
              <SectionHeader title="有料プランでできること" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">1</span>
                  <div>
                    <p className="font-medium text-gray-900">締切アラート</p>
                    <p className="text-sm text-gray-500">締切の前にメールでお知らせします</p>
                    <Badge variant={isLight ? 'success' : 'warning'} size="sm">{isLight ? '利用できます' : 'ライト会員以上'}</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">2</span>
                  <div>
                    <p className="font-medium text-gray-900">補助金マッチング・申請書AIレビュー</p>
                    <p className="text-sm text-gray-500">事業に合う補助金を探すツールと、申請書をAIが読んで改善点を示すツール</p>
                    <Badge variant="warning" size="sm">スタンダード会員以上</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">3</span>
                  <div>
                    <p className="font-medium text-gray-900">実践ガイド・ダウンロード素材</p>
                    <p className="text-sm text-gray-500">月1テーマの実践ガイドと、申請に使える素材</p>
                    <Badge variant="warning" size="sm">スタンダード会員以上</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">4</span>
                  <div>
                    <p className="font-medium text-gray-900">AIチャット相談・優先メールサポート</p>
                    <p className="text-sm text-gray-500">AIに個別に相談でき、メールでの質問にも優先して回答します</p>
                    <Badge variant="premium" size="sm">プレミアム会員</Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Link href="/pricing"><Button variant="primary">プランを見る</Button></Link>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/subsidies"><Card><CardContent className="text-center py-4"><p className="font-medium text-gray-900">補助金検索</p><p className="text-xs text-gray-500">すべての補助金</p></CardContent></Card></Link>
            <Link href="/blog"><Card><CardContent className="text-center py-4"><p className="font-medium text-gray-900">ブログ</p><p className="text-xs text-gray-500">新しい記事</p></CardContent></Card></Link>
            <Link href="/dashboard/alerts"><Card><CardContent className="text-center py-4"><p className="font-medium text-gray-900">締切アラート</p><p className="text-xs text-gray-500">アラートの一覧</p></CardContent></Card></Link>
            <Link href="/contact"><Card><CardContent className="text-center py-4"><p className="font-medium text-gray-900">お問い合わせ</p><p className="text-xs text-gray-500">ご質問・ご要望</p></CardContent></Card></Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
