import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageHero } from '@/components/PageHero'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { SectionHeader } from '@/components/SectionHeader'
import { createServiceClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { AdBanner } from '@/components/AdBanner'

export const metadata: Metadata = {
  title: 'ブログ',
  description: '補助金・助成金の最新情報や申請のコツ、採択率を上げるノウハウを発信。',
}

export const revalidate = 60


async function getPosts() {
  const supabase = createServiceClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, thumbnail_url, category, access_level, published_at')
    .eq('is_published', true)
    .contains('site_tags', ['otona'])
    .is('deleted_at', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  
  return data || []
}

const accessBadge = {
  free: { label: '無料', variant: 'success' as const },
  partial: { label: '一部無料', variant: 'warning' as const },
  paid: { label: '会員限定', variant: 'premium' as const },
}

export default async function BlogPage() {
  const posts = await getPosts()
  
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <PageHero title="ブログ" subtitle="補助金・助成金の最新情報と申請のコツ" />

        {/* Posts */}
<section className="py-4">
          <Container>
            <AdBanner siteId="otona" position="top" className="w-full" />
          </Container>
        </section>
        <section className="py-16">
          <Container>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">記事がまだありません。</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post: any) => (
                  <Link key={post.id} href={'/blog/' + post.slug}>
                    <Card className="h-full">
                      {post.thumbnail_url && (
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={post.thumbnail_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardContent>
                        <div className="flex items-center gap-2 mb-2">
                          {post.category && (
                            <Badge variant="default" size="sm">{post.category}</Badge>
                          )}
                          {post.access_level && accessBadge[post.access_level as keyof typeof accessBadge] && (
                            <Badge 
                              variant={accessBadge[post.access_level as keyof typeof accessBadge].variant} 
                              size="sm"
                            >
                              {accessBadge[post.access_level as keyof typeof accessBadge].label}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        {post.description && (
                          <CardDescription className="line-clamp-2 mt-2">
                            {post.description}
                          </CardDescription>
                        )}
                        <p className="text-sm text-gray-500 mt-4">
                          {new Date(post.published_at).toLocaleDateString('ja-JP')}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
