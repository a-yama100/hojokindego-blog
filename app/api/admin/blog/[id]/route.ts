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
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
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
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin blog DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
