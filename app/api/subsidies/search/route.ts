import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const region = searchParams.get('region') || ''
  const difficulty = searchParams.get('difficulty') || ''
  const minAmount = parseInt(searchParams.get('min') || '0')
  const maxAmount = parseInt(searchParams.get('max') || '0')
  const sort = searchParams.get('sort') || 'score'

  const supabase = createServiceClient()
  let query = supabase
    .from('subsidies')
    .select('*')
    .eq('is_active', true)

  if (keyword) {
    query = query.or('title.ilike.%' + keyword + '%,summary.ilike.%' + keyword + '%,detail.ilike.%' + keyword + '%')
  }
  if (category) {
    query = query.eq('category', category)
  }
  if (region) {
    query = query.eq('region', region)
  }
  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }
  if (minAmount > 0) {
    query = query.gte('max_amount', minAmount)
  }
  if (maxAmount > 0) {
    query = query.lte('max_amount', maxAmount)
  }

  if (sort === 'deadline') {
    query = query.order('deadline', { ascending: true })
  } else if (sort === 'amount') {
    query = query.order('max_amount', { ascending: false, nullsFirst: false })
  } else {
    query = query.order('target_score', { ascending: false })
  }

  query = query.limit(50)

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ subsidies: data || [], count: data?.length || 0 })
}
