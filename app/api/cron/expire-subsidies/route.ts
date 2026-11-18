import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  // 秘密の値が未設定のときは必ず拒否する（2026-11-18）
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== 'Bearer ' + cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('subsidies')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('is_active', true)
    .lt('deadline', today)
    .select('slug, title, deadline')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    message: 'Expired subsidies updated',
    expired_count: data?.length || 0,
    expired: data || [],
  })
}
