import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('saved_subsidies')
      .select('id, created_at, subsidy_id, subsidies(id, slug, title, summary, category, region, max_amount, difficulty, target_score, deadline)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ saved: data || [] })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { subsidy_id } = await req.json()
    if (!subsidy_id) return NextResponse.json({ error: 'subsidy_id required' }, { status: 400 })

    const { error } = await supabase.from('saved_subsidies').insert({ user_id: user.id, subsidy_id })
    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Already saved' }, { status: 409 })
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

    const { subsidy_id } = await req.json()
    if (!subsidy_id) return NextResponse.json({ error: 'subsidy_id required' }, { status: 400 })

    await supabase.from('saved_subsidies').delete().eq('user_id', user.id).eq('subsidy_id', subsidy_id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
