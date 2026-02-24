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
import { hasAccess } from '@/lib/supabase/types'
import type { PlanType } from '@/lib/supabase/types'

interface AlertSubsidy {
  id: string; slug: string; title: string; deadline: string | null; target_score: number | null
}

interface AlertRow {
  id: string; alert_days_before: number; is_active: boolean; created_at: string
  subsidy_id: string; subsidies: AlertSubsidy
}

export default function AlertsPage() {
  const { user, loading: authLoading } = useAuth()
  const [alerts, setAlerts] = useState<AlertRow[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  const plan = (user?.plan_type || 'free') as PlanType
  const isLight = hasAccess(plan, 'light')

  useEffect(() => {
    if (authLoading || !user) return
    fetchAlerts()
  }, [authLoading, user])

  async function fetchAlerts() {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/alerts')
      if (res.ok) {
        const d = await res.json()
        setAlerts(d.alerts || [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleRemove(alertId: string) {
    setRemoving(alertId)
    try {
      await fetch('/api/dashboard/alerts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId }),
      })
      setAlerts(prev => prev.filter(a => a.id !== alertId))
    } catch { /* ignore */ }
    setRemoving(null)
  }

  if (authLoading) {
    return (<div className="min-h-screen bg-gray-50"><Header /><Container className="py-20 text-center"><p className="text-gray-500">Loading...</p></Container><Footer /></div>)
  }

  if (!user) {
    return (<div className="min-h-screen bg-gray-50"><Header /><Container className="py-20 text-center"><h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in Required</h1><div className="flex justify-center"><Link href="/login"><Button variant="primary">Sign In</Button></Link></div></Container><Footer /></div>)
  }

  if (!isLight) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <Container>
            <div className="mb-6">
              <Link href="/dashboard" className="text-sm text-emerald-700 hover:underline">{"\u2190 Back to Dashboard"}</Link>
            </div>
            <Card hover={false}>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Deadline Alerts</h2>
                <p className="text-gray-500 mb-4">Deadline alert notifications are available for Light plan members and above.</p>
                <Badge variant="warning" size="md">Light Plan Required</Badge>
                <div className="flex justify-center mt-6">
                  <Link href="/pricing"><Button variant="primary">View Plans</Button></Link>
                </div>
              </CardContent>
            </Card>
          </Container>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <Container>
          <div className="mb-6">
            <Link href="/dashboard" className="text-sm text-emerald-700 hover:underline">{"\u2190 Back to Dashboard"}</Link>
          </div>
          <SectionHeader title="Deadline Alerts" subtitle={loading ? 'Loading...' : alerts.length + ' alerts configured'} />

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading...</p>
          ) : alerts.length === 0 ? (
            <Card hover={false}>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No alerts set up yet. Save a subsidy and add an alert to get notified before the deadline.</p>
                <Link href="/subsidies"><Button variant="primary">Browse Subsidies</Button></Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const s = alert.subsidies
                if (!s) return null
                const score = s.target_score || 0
                const scoreColor = score >= 75 ? 'text-green-700' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                return (
                  <div key={alert.id} className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <Link href={'/subsidies/' + s.slug} className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <DeadlineLabel deadline={s.deadline} />
                          <Badge variant={alert.is_active ? 'success' : 'default'} size="sm">
                            {alert.is_active ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                        <p className="text-sm text-gray-500">
                          {"Alert: " + alert.alert_days_before + " days before deadline"}
                          {s.deadline ? " (Deadline: " + s.deadline + ")" : ""}
                        </p>
                      </Link>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Score</p>
                          <span className={'text-2xl font-black ' + scoreColor}>{score}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(alert.id)}
                          disabled={removing === alert.id}
                        >
                          {removing === alert.id ? 'Removing...' : 'Remove'}
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
