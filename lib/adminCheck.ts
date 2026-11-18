import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

// 管理者の判定はこのサイトの利用者に限る（2026-11-18）
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'hojokindego'

interface AdminResult {
  isAdmin: boolean
  userId: string | null
  error?: string
}

export async function checkAdmin(request: NextRequest): Promise<AdminResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { isAdmin: false, userId: null, error: 'Not authenticated' }
    }

    const serviceClient = createServiceClient()
    const { data: userData } = await serviceClient
      .from('users')
      .select('is_admin, site_id')
      .eq('id', user.id)
      .single()

    return {
      isAdmin: userData?.is_admin === true && userData?.site_id === SITE_ID,
      userId: user.id,
    }
  } catch (error) {
    console.error('Admin check error:', error)
    return { isAdmin: false, userId: null, error: 'Admin check failed' }
  }
}
