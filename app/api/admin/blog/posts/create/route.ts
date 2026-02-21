import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/lib/adminCheck'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const adminCheck = await checkAdmin(request)
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, description, content, category, access_level, is_published, thumbnail_url } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const insertData: Record<string, unknown> = {
      title,
      slug,
      description: description || '',
      content,
      category: category || null,
      access_level: access_level || 'free',
      is_published: is_published || false,
      thumbnail_url: thumbnail_url || null,
      author_id: adminCheck.userId,
    }

    if (is_published) {
      insertData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ post: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
