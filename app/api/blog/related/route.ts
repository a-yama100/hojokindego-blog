import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'ai-workhack'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  const category = request.nextUrl.searchParams.get('category')
  if (!slug) {
    return NextResponse.json({ posts: [] })
  }
  const supabase = createServiceClient()

  let query = supabase
    .from('blog_posts')
    .select('slug, title, description, category, thumbnail_url, published_at')
    .eq('is_published', true)
    .eq('site_id', SITE_ID)
    .is('deleted_at', null)
    .neq('slug', slug)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(6)

  if (category) {
    query = query.eq('category', category)
  }

  const { data } = await query

  let posts = data || []
  if (posts.length < 3 && category) {
    const { data: morePosts } = await supabase
      .from('blog_posts')
      .select('slug, title, description, category, thumbnail_url, published_at')
      .eq('is_published', true)
      .eq('site_id', SITE_ID)
      .is('deleted_at', null)
      .neq('slug', slug)
      .neq('category', category)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(6 - posts.length)
    posts = [...posts, ...(morePosts || [])]
  }

  return NextResponse.json({ posts: posts.slice(0, 6) })
}
