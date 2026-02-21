import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'

interface Post {
  slug: string
  title: string
  thumbnail_url: string | null
  published_at: string
  category: string | null
}

async function getPosts(): Promise<Post[]> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, title, thumbnail_url, published_at, category')
      .eq('is_published', true)
      .is('deleted_at', null)
      .contains('site_tags', ['otona'])
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(5)
    return data || []
  } catch {
    return []
  }
}

export async function PopularPosts() {
  const posts = await getPosts()
  if (posts.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-800 px-4 py-3">
        <h3 className="text-white font-bold text-sm">最近の投稿</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {posts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={'/blog/' + post.slug}
              className="flex gap-3 p-3 hover:bg-gray-50 transition-colors"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="min-w-0">
                {post.category && (
                  <span className="text-xs text-blue-600 font-medium">{post.category}</span>
                )}
                <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">{post.title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}