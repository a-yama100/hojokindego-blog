import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/lib/adminCheck'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const adminCheck = await checkAdmin(request)
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const siteId = process.env.NEXT_PUBLIC_SITE_ID || ''
    let query = supabase
      .from('blog_posts')
      .select('id, slug, title, category, is_published, access_level, published_at, created_at')
      .is('deleted_at', null)
    if (siteId) {
      query = query.eq('site_id', siteId)
    }
    const { data: posts, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
