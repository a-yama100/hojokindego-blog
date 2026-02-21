"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from './Badge'

interface RelatedPost {
  slug: string
  title: string
  description: string | null
  category: string | null
  thumbnail_url: string | null
  published_at: string
}

export function RelatedPosts({ slug, category }: { slug: string; category: string | null }) {
  const [posts, setPosts] = useState<RelatedPost[]>([])

  useEffect(() => {
    const params = new URLSearchParams({ slug })
    if (category) params.set('category', category)
    fetch('/api/blog/related?' + params.toString())
      .then(res => res.json())
      .then(data => setPosts(data.posts || []))
      .catch(() => {})
  }, [slug, category])

  if (posts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">関連記事</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={'/blog/' + post.slug}
            className="block bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:border-green-300 group"
          >
            {post.thumbnail_url && (
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              {post.category && (
                <Badge variant="default" size="sm">{post.category}</Badge>
              )}
              <h4 className="text-sm font-bold text-gray-900 mt-2 group-hover:text-green-700 transition-colors line-clamp-2">
                {post.title}
              </h4>
              {post.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(post.published_at).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
