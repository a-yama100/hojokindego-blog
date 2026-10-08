import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hojokin.phaiworks.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: baseUrl + '/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: baseUrl + '/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: baseUrl + '/pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: baseUrl + '/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // 2026-10-08: tools テーブル由来の /tools/T000xx（このサイトに該当ページがなく404）と、
  // /tools・/downloads（ページなし・404）は sitemap に載せない。実在するのは /tools/matching と /tools/review だけ。

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const supabase = createServiceClient()
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('site_id', process.env.NEXT_PUBLIC_SITE_ID || 'hojokindego')
      .eq('is_published', true)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })

    if (posts) {
      blogPages = posts.map((post: any) => ({
        url: baseUrl + '/blog/' + post.slug,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch blog posts', error)
  }

  return [...staticPages, ...blogPages]
}
