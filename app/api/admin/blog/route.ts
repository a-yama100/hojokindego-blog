import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

// 管理者の判定と記事の操作はこのサイトに限る（2026-11-18）
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'hojokindego'

async function verifyAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return false
    const serviceClient = createServiceClient()
    const { data: profile } = await serviceClient
      .from('users')
      .select('role, site_id')
      .eq('id', user.id)
      .single()
    return profile?.role === 'admin' && profile?.site_id === SITE_ID
  } catch {
    return false
  }
}

// 更新・作成で受け付ける列（管理画面が送る列だけ。site_id・id・author_id は受け付けない）（2026-11-18）
const EDITABLE = ['slug', 'title', 'description', 'content', 'category', 'is_published', 'is_premium', 'required_plan', 'published_at', 'access_level', 'thumbnail_url'] as const

function pickEditable(body: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (!body || typeof body !== 'object') return out
  const src = body as Record<string, unknown>
  for (const k of EDITABLE) {
    if (k in src) out[k] = src[k]
  }
  return out
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
      .eq('site_id', SITE_ID)
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
      .insert({ ...pickEditable(body), site_id: SITE_ID })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Admin blog POST error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
