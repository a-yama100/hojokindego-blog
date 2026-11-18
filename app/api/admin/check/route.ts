import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

// 管理者の判定はこのサイトの利用者に限る（2026-11-18）
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'hojokindego'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return NextResponse.json({ isAdmin: false })
    }
    const serviceClient = createServiceClient()
    const { data: profile } = await serviceClient
      .from('users')
      .select('role, site_id')
      .eq('id', user.id)
      .single()
    return NextResponse.json({ isAdmin: profile?.role === 'admin' && profile?.site_id === SITE_ID })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
