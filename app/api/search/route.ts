import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'ai-workhack'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 1) {
    return NextResponse.json({ tools: [], posts: [] })
  }

  const supabase = createServiceClient()
  const keyword = '%' + q + '%'

  // ツール検索
  const { data: tools } = await supabase
    .from('tools')
    .select('tool_id, name, description, category')
    .eq('site_id', SITE_ID)
    .or(`name.ilike.${keyword},description.ilike.${keyword},category.ilike.${keyword}`)
    .not('tool_id', 'in', '("T00001","T00002","T00003","T00004")')
    .limit(8)

  // ブログ記事検索
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title, excerpt')
    .or(`title.ilike.${keyword},excerpt.ilike.${keyword}`)
    .eq('is_published', true)
    .limit(5)

  return NextResponse.json({
    tools: tools || [],
    posts: posts || [],
  })
}
