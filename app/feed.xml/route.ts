import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const baseUrl = 'https://www.hojokindego.com'
  const supabase = createServiceClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, description, category, published_at, updated_at')
    .eq('is_published', true)
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(50)

  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  const items = posts?.map((post: any) => '<item>' +
    '<title>' + escapeXml(post.title) + '</title>' +
    '<link>' + baseUrl + '/blog/' + post.slug + '</link>' +
    '<description>' + escapeXml(post.description || '') + '</description>' +
    '<category>' + escapeXml(post.category || '') + '</category>' +
    '<pubDate>' + new Date(post.published_at || post.updated_at).toUTCString() + '</pubDate>' +
    '<guid isPermaLink="true">' + baseUrl + '/blog/' + post.slug + '</guid>' +
    '</item>').join('\n    ') || ''

  const rss = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '  <channel>\n' +
    '    <title>Hojokindego - Blog</title>\n' +
    '    <link>' + baseUrl + '</link>\n' +
    '    <description>Subsidy information and AI tools for businesses in Japan</description>\n' +
    '    <language>ja</language>\n' +
    '    <lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>\n' +
    '    <atom:link href="' + baseUrl + '/feed.xml" rel="self" type="application/rss+xml"/>\n' +
    '    ' + items + '\n' +
    '  </channel>\n' +
    '</rss>'

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
