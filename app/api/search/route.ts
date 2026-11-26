import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { openDeadlineFilter } from '@/lib/subsidyDates'
import { rateLimit, clientIp, TOO_MANY } from '@/lib/security/rateLimit'

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'hojokindego'

// ヘッダーの検索（SearchModal）の受け口。
// 2026-11-26: 以前は tools 表（このサイトの行がなく、リンク先 /tools/T000xx も無い）と posts 表（無い表）を
// 探していて、何を入れても結果が 0 件だった。受付中の補助金と、このサイトの公開中のブログ記事を探す。
export async function GET(request: NextRequest) {
  if (!(await rateLimit('search:ip:' + clientIp(request), 60, 60))) {
    return NextResponse.json(TOO_MANY, { status: 429 })
  }
  // .or() に入れる前に、絞り込みの記号を取り除き 100 字までにする（2026-11-18）
  const q = (request.nextUrl.searchParams.get('q') || '').replace(/[,()*%\\"]/g, ' ').trim().slice(0, 100)
  if (!q) {
    return NextResponse.json({ subsidies: [], posts: [] })
  }

  const supabase = createServiceClient()
  const keyword = '%' + q + '%'

  const [subsidiesRes, postsRes] = await Promise.all([
    supabase
      .from('subsidies')
      .select('slug, title, summary, deadline')
      .eq('is_active', true)
      .or(openDeadlineFilter())
      .or(`title.ilike.${keyword},summary.ilike.${keyword}`)
      .order('target_score', { ascending: false })
      .limit(8),
    supabase
      .from('blog_posts')
      .select('slug, title, description')
      .eq('site_id', SITE_ID)
      .eq('is_published', true)
      .is('deleted_at', null)
      .lte('published_at', new Date().toISOString())
      .or(`title.ilike.${keyword},description.ilike.${keyword}`)
      .limit(5),
  ])

  return NextResponse.json({
    subsidies: subsidiesRes.data || [],
    posts: postsRes.data || [],
  })
}
