import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

async function verifyAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return false
    const serviceClient = createServiceClient()
    const { data: profile } = await serviceClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    return profile?.role === 'admin'
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, category, is_published, is_premium, required_plan, published_at, created_at, updated_at, deleted_at, access_level')
      .eq('site_id', 'ai-workhack')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ posts: data })
  } catch (error) {
    console.error('Admin blog GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const body = await request.json()
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ ...body, site_id: 'ai-workhack' })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Admin blog POST error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
