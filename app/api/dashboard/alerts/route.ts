import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('subsidy_alerts')
      .select('id, alert_days_before, is_active, created_at, subsidy_id, subsidies(id, slug, title, deadline, target_score)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ alerts: data || [] })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { subsidy_id, alert_days_before } = await req.json()
    if (!subsidy_id) return NextResponse.json({ error: 'subsidy_id required' }, { status: 400 })

    const { error } = await supabase.from('subsidy_alerts').insert({
      user_id: user.id,
      subsidy_id,
      alert_days_before: alert_days_before || 7,
    })
    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Alert already exists' }, { status: 409 })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { alert_id } = await req.json()
    if (!alert_id) return NextResponse.json({ error: 'alert_id required' }, { status: 400 })

    await supabase.from('subsidy_alerts').delete().eq('id', alert_id).eq('user_id', user.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
