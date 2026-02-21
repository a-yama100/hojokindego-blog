import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

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
      .select('role')
      .eq('id', user.id)
      .single()
    return NextResponse.json({ isAdmin: profile?.role === 'admin' })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
