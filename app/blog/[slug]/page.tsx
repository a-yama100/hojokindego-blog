import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { Badge } from '@/components/Badge'
import { createServiceClient } from '@/lib/supabase/server'
import { BlogContent } from './BlogContent'
import { Sidebar } from '@/components/Sidebar'
import { RelatedPosts } from '@/components/RelatedPosts'
import { BlogRelatedTools } from '@/components/BlogRelatedTools'
import { AuthorBio } from '@/components/AuthorBio'


export const revalidate = 60
interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .is('deleted_at', null)
    .lte('published_at', new Date().toISOString())
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return { title: 'Not Found' }
  }
  
  return {
    title: post.title + '| 補助金でゴー！',
    description: (post.description || '') + ' | 補助金でゴー！ - 55歳からのAI副収入',
    openGraph: {
      title: post.title + '| 補助金でゴー！',
      description: (post.description || '') + ' | 補助金でゴー！ - 55歳からのAI副収入',
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title + '| 補助金でゴー！',
      description: (post.description || '') + ' | 補助金でゴー！ - 55歳からのAI副収入',
      images: post.thumbnail_url ? [post.thumbnail_url] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    notFound()
  }
  
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description || '',
    image: post.thumbnail_url || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: 'a-yama',
      url: 'https://www.ai-workhack.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: '補助金でゴー！',
      url: 'https://www.ai-workhack.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.ai-workhack.com/blog/${slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-0">
          <div className="flex gap-8">
            <div className="min-w-0 flex-1">
              <article className="max-w-3xl mx-auto px-4 py-12">
                <header className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    {post.category && (
                      <Badge variant="default">{post.category}</Badge>
                    )}
                    {post.access_level === 'paid' && (
                      <Badge variant="premium">{'\u4F1A\u54E1\u9650\u5B9A'}</Badge>
                    )}
                    {post.access_level === 'partial' && (
                      <Badge variant="warning">{'\u4E00\u90E8\u7121\u6599'}</Badge>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {post.title}
                  </h1>
                  {post.description && (
                    <p className="text-xl text-gray-600 mb-4">{post.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(post.published_at).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </header>
                {post.thumbnail_url && (
                  <div className="mb-8 rounded-xl overflow-hidden">
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                <BlogContent
                  content={post.content || ''}
                  accessLevel={post.access_level || 'free'}
                  downloadId={post.download_id}
                />
                <BlogRelatedTools category={post.category} />
                <RelatedPosts slug={slug} category={post.category} />
                {/* <AuthorBio /> */}
              </article>
            </div>
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28">
                <Sidebar siteId="otona" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
