import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.ai-workhack.com'

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
      url: baseUrl + '/tools',
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
      url: baseUrl + '/downloads',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: baseUrl + '/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  let toolPages: MetadataRoute.Sitemap = []
  try {
    const supabase = createServiceClient()
    const { data: tools } = await supabase
      .from('tools')
      .select('tool_id')
      .eq('is_active', true)
      .gte('tool_id', 'T00005')
      .order('tool_id')

    if (tools) {
      toolPages = tools.map((tool: any) => ({
        url: baseUrl + '/tools/' + tool.tool_id,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch tools', error)
  }

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const supabase = createServiceClient()
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
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

  return [...staticPages, ...toolPages, ...blogPages]
}
