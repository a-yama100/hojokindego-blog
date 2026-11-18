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

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const { id } = await params
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('site_id', SITE_ID)
      .single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Admin blog GET [id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const { id } = await params
    const body = await request.json()
    // 復元（deleted_at を null に戻す）だけは受け付ける（2026-11-18）
    const updates = pickEditable(body)
    if (body && typeof body === 'object' && body.deleted_at === null) updates.deleted_at = null
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('site_id', SITE_ID)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Admin blog PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    const { id } = await params
    const supabase = createServiceClient()
    const { error } = await supabase
      .from('blog_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('site_id', SITE_ID)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin blog DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
