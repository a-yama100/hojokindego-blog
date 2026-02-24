"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/Button'
import { Card, CardContent } from '@/components/Card'
import { DeadlineLabel } from '@/components/DeadlineLabel'
import { CATEGORIES, DIFFICULTY_COLOR } from '@/data/subsidies'

interface SubsidyRow {
  id: string; slug: string; title: string; summary: string | null
  category: string | null; region: string | null; max_amount: number | null
  difficulty: string | null; target_score: number | null; deadline: string | null
}

interface SavedRow {
  id: string; created_at: string; subsidy_id: string
  subsidies: SubsidyRow
}

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth()
  const [saved, setSaved] = useState<SavedRow[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || !user) return
    fetchSaved()
  }, [authLoading, user])

  async function fetchSaved() {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/saved')
      if (res.ok) {
        const d = await res.json()
        setSaved(d.saved || [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleRemove(subsidyId: string) {
    setRemoving(subsidyId)
    try {
      await fetch('/api/dashboard/saved', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subsidy_id: subsidyId }),
      })
      setSaved(prev => prev.filter(s => s.subsidy_id !== subsidyId))
    } catch { /* ignore */ }
    setRemoving(null)
  }

  if (authLoading) {
    return (<div className="min-h-screen bg-gray-50"><Header /><Container className="py-20 text-center"><p className="text-gray-500">Loading...</p></Container><Footer /></div>)
  }

  if (!user) {
    return (<div className="min-h-screen bg-gray-50"><Header /><Container className="py-20 text-center"><h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in Required</h1><p className="text-gray-600 mb-8">Please sign in to view saved subsidies.</p><div className="flex justify-center"><Link href="/login"><Button variant="primary">Sign In</Button></Link></div></Container><Footer /></div>)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <Container>
          <div className="mb-6">
            <Link href="/dashboard" className="text-sm text-emerald-700 hover:underline">{"\u2190 Back to Dashboard"}</Link>
          </div>
          <SectionHeader title="Saved Subsidies" subtitle={loading ? 'Loading...' : saved.length + ' subsidies saved'} />

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading...</p>
          ) : saved.length === 0 ? (
            <Card hover={false}>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">You have not saved any subsidies yet.</p>
                <Link href="/subsidies"><Button variant="primary">Browse Subsidies</Button></Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {saved.map((item) => {
                const s = item.subsidies
                if (!s) return null
                const cat = s.category ? CATEGORIES[s.category] : null
                const diffClass = s.difficulty ? (DIFFICULTY_COLOR[s.difficulty] || '') : ''
                const score = s.target_score || 0
                const scoreColor = score >= 75 ? 'text-green-700' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                const amt = s.max_amount || 0
                return (
                  <div key={item.id} className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <Link href={'/subsidies/' + s.slug} className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {cat && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + cat.color}>{cat.label}</span>}
                          {s.difficulty && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + diffClass}>{s.difficulty}</span>}
                          <DeadlineLabel deadline={s.deadline} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                        <p className="text-sm text-gray-500">
                          {"Max: \u00a5" + (amt / 10000).toLocaleString() + "man"}
                          {s.deadline ? " / Deadline: " + s.deadline : ""}
                        </p>
                        {s.summary && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{s.summary}</p>}
                      </Link>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Score</p>
                          <span className={'text-2xl font-black ' + scoreColor}>{score}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(s.id)}
                          disabled={removing === s.id}
                        >
                          {removing === s.id ? 'Removing...' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
