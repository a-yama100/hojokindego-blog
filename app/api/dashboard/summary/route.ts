import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [savedRes, alertsRes, subsidiesRes] = await Promise.all([
      supabase.from('saved_subsidies').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('subsidy_alerts').select('id', { count: 'exact' }).eq('user_id', user.id).eq('is_active', true),
      supabase.from('subsidies').select('id, deadline').eq('is_active', true).gte('deadline', new Date().toISOString().split('T')[0]).order('deadline', { ascending: true }).limit(5),
    ])

    const urgentCount = (subsidiesRes.data || []).filter((s: { deadline: string | null }) => {
      if (!s.deadline) return false
      const diff = Math.ceil((new Date(s.deadline + 'T00:00:00').getTime() - Date.now()) / 86400000)
      return diff <= 14
    }).length

    return NextResponse.json({
      savedCount: savedRes.count || 0,
      alertsCount: alertsRes.count || 0,
      urgentDeadlines: urgentCount,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
