"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { MarkdownDisplay } from '@/components/MarkdownDisplay'
import { TableOfContents } from '@/components/TableOfContents'
import { Button } from '@/components/Button'
import { Card, CardContent } from '@/components/Card'
import { hasAccess } from '@/lib/supabase/types'

interface BlogContentProps {
  content: string
  accessLevel: string
  downloadId?: string | null
}

export function BlogContent({ content, accessLevel, downloadId }: BlogContentProps) {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  
  // Split content by paywall marker
  const paywallMarker = '<!-- paywall -->'
  const hasPaywall = content.includes(paywallMarker)
  const [freeContent, paidContent] = hasPaywall 
    ? content.split(paywallMarker) 
    : [content, '']
  
  // Check access
  const userPlan = user?.plan_type || 'free'
  const requiredPlan = accessLevel === 'paid' ? 'light' : 'free'
  const canAccessPaidContent = hasAccess(userPlan, requiredPlan as any)
  
  // For 'free' access level, show everything
  if (accessLevel === 'free') {
    return (
      <div className="prose prose-lg max-w-none">
        <MarkdownDisplay content={content} />
        {downloadId && <DownloadButton downloadId={downloadId} />}
      </div>
    )
  }
  
  // For 'paid' access level without login
  if (accessLevel === 'paid' && !user) {
    return (
      <div>
        <PaywallMessage remainingChars={content.length} />
      </div>
    )
  }
  
  // For 'paid' access level without sufficient plan
  if (accessLevel === 'paid' && !canAccessPaidContent) {
    return (
      <div>
        <UpgradeMessage />
      </div>
    )
  }
  
  // For 'partial' access level
  if (accessLevel === 'partial') {
    return (
      <div className="prose prose-lg max-w-none">
        <TableOfContents content={content} canAccess={!!(user && canAccessPaidContent)} />
        <MarkdownDisplay content={freeContent} />
        
        {!user && paidContent && (
          <PaywallMessage remainingChars={paidContent.length} />
        )}
        
        {user && !canAccessPaidContent && paidContent && (
          <UpgradeMessage />
        )}
        
        {user && canAccessPaidContent && paidContent && (
          <>
            <MarkdownDisplay content={paidContent} />
            {downloadId && <DownloadButton downloadId={downloadId} />}
          </>
        )}
      </div>
    )
  }
  
  // Full access
  return (
    <div className="prose prose-lg max-w-none">
      <MarkdownDisplay content={content} />
      {downloadId && <DownloadButton downloadId={downloadId} />}
    </div>
  )
}

function PaywallMessage({ remainingChars = 0 }: { remainingChars?: number }) {
    const pathname = usePathname()
  return (
    <div id="paywall-message"><Card className="my-8 border-blue-200 bg-blue-50">
      <CardContent className="text-center py-12">
        {remainingChars > 0 && (
          <p className="font-bold text-gray-700 mb-4">
            {"（残り：" + remainingChars.toLocaleString() + "字）"}
          </p>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          この先は会員限定コンテンツです
        </h3>
        <p className="text-gray-600 mb-6">
          続きを読むには、無料会員登録またはログインが必要です。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button>無料で登録する</Button>
          </Link>
          <Link href={"/login?redirect=" + encodeURIComponent(pathname)}>
            <Button variant="outline">ログイン</Button>
          </Link>
        </div>
      </CardContent>
    </Card></div>
  )
}

function UpgradeMessage() {
  return (
    <Card className="my-8 border-purple-200 bg-purple-50">
      <CardContent className="text-center py-12">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          この先は有料会員限定コンテンツです
        </h3>
        <p className="text-gray-600 mb-6">
          続きを読むには、ライト会員以上へのアップグレードが必要です。
        </p>
        <Link href="/pricing">
          <Button>プランを見る</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function DownloadButton({ downloadId }: { downloadId: string }) {
  return (
    <div className="my-8 p-6 bg-green-50 border border-green-200 rounded-xl">
      <h3 className="font-bold text-gray-900 mb-2">ダウンロード</h3>
      <p className="text-gray-600 text-sm mb-4">
        この記事のソースコード・素材をダウンロードできます。
      </p>
      <Link href={'/downloads/' + downloadId}>
        <Button variant="primary">ダウンロードページへ</Button>
      </Link>
    </div>
  )
}
