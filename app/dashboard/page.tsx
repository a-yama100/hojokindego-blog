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
  free: 'Free',
  light: 'Light',
  standard: 'Standard',
  premium: 'Premium',
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
          <p className="text-gray-500">Loading...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in Required</h1>
          <p className="text-gray-600 mb-8">Please sign in to access your dashboard.</p>
          <div className="flex justify-center gap-4">
            <Link href="/login"><Button variant="primary">Sign In</Button></Link>
            <Link href="/signup"><Button variant="outline">Create Account</Button></Link>
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
                  {"Welcome back, " + (user.username || user.email.split("@")[0])}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge variant={PLAN_BADGE[plan] || 'default'} size="md">{PLAN_LABELS[plan] || 'Free'} Plan</Badge>
                  {user.subscription_expires_at && (
                    <span className="text-emerald-200 text-sm">
                      {"Expires: " + new Date(user.subscription_expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {!isStandard && (
                <Link href="/pricing">
                  <Button variant="white" size="sm">Upgrade Plan</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/dashboard/saved">
              <Card hover>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-1">Saved Subsidies</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '-' : (summary?.savedCount || 0)}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/alerts">
              <Card hover>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '-' : (summary?.alertsCount || 0)}</p>
                  {!isLight && <p className="text-xs text-amber-600 mt-1">Light plan required</p>}
                </CardContent>
              </Card>
            </Link>
            <Card hover={false}>
              <CardContent>
                <p className="text-sm text-gray-500 mb-1">Urgent Deadlines</p>
                <p className="text-3xl font-bold text-red-600">{loading ? '-' : (summary?.urgentDeadlines || 0)}</p>
                <p className="text-xs text-gray-400 mt-1">Within 14 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Search */}
          <div className="mb-8">
            <SectionHeader title="Quick Search" subtitle="Find subsidies matching your business" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/subsidies" className="flex-1">
                <Button variant="primary" fullWidth>Search All Subsidies</Button>
              </Link>
              <Link href="/subsidies?sort=deadline" className="flex-1">
                <Button variant="outline" fullWidth>Deadline Soon</Button>
              </Link>
              <Link href="/subsidies?sort=score" className="flex-1">
                <Button variant="outline" fullWidth>Top Scores</Button>
              </Link>
            </div>
          </div>

          {/* Saved Subsidies Preview */}
          <div className="mb-8">
            <SectionHeader
              title="Saved Subsidies"
              action={saved.length > 0 ? <Link href="/dashboard/saved"><Button variant="ghost" size="sm">View All</Button></Link> : undefined}
            />
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : saved.length === 0 ? (
              <Card hover={false}>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500 mb-4">No saved subsidies yet.</p>
                  <Link href="/subsidies"><Button variant="primary" size="sm">Browse Subsidies</Button></Link>
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
                          <p className="text-xs text-gray-500">Score</p>
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
            <SectionHeader title="Recommended" subtitle="Top-scoring subsidies for you" />
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading...</p>
            ) : recommended.length === 0 ? (
              <Card hover={false}>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No subsidies available.</p>
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
                          <p className="text-xs text-gray-500">Score</p>
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
              <SectionHeader title="Unlock More Features" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">1</span>
                  <div>
                    <p className="font-medium text-gray-900">Deadline Alerts</p>
                    <p className="text-sm text-gray-500">Get email notifications before deadlines</p>
                    <Badge variant={isLight ? 'success' : 'warning'} size="sm">{isLight ? 'Available' : 'Light+'}</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">2</span>
                  <div>
                    <p className="font-medium text-gray-900">All Tools</p>
                    <p className="text-sm text-gray-500">Unlimited access to all analysis tools</p>
                    <Badge variant="warning" size="sm">Standard+</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">3</span>
                  <div>
                    <p className="font-medium text-gray-900">Expert Matching</p>
                    <p className="text-sm text-gray-500">Connect with certified subsidy consultants</p>
                    <Badge variant="warning" size="sm">Standard+</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-lg">4</span>
                  <div>
                    <p className="font-medium text-gray-900">1-on-1 Sessions</p>
                    <p className="text-sm text-gray-500">Monthly personalized coaching</p>
                    <Badge variant="premium" size="sm">Premium</Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Link href="/pricing"><Button variant="primary">View Plans</Button></Link>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/subsidies"><Card><CardContent className="text-center py-4"><p className="font-medium text-gray-900">Search</p><p className="text-xs text-gray-500">Browse all</p></CardContent></Card></Link>
            <Link href="/blog"><Card><CardContent className="text-center py-4"><p className="font-medium text-gray-900">Blog</p><p className="text-xs text-gray-500">Latest articles</p></CardContent></Card></Link>
            <Link href="/mypage"><Card><CardContent className="text-center py-4"><p className="font-medium text-gray-900">Profile</p><p className="text-xs text-gray-500">Settings</p></CardContent></Card></Link>
            <Link href="/contact"><Card><CardContent className="text-center py-4"><p className="font-medium text-gray-900">Support</p><p className="text-xs text-gray-500">Contact us</p></CardContent></Card></Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
