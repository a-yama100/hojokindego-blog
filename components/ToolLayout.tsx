'use client'
import { ReactNode, useEffect, useState } from 'react'
import { Container } from './Container'
import { PageHero } from './PageHero'
import { Header } from './Header'
import { Footer } from './Footer'
import { RelatedTools } from './RelatedTools'

interface UsageData {
  dailyLimit: number
  used: number
  remaining: number
}

interface ToolLayoutProps {
  children: ReactNode
  toolId: string
  title: string
  description: string
  category?: string
}

export default function ToolLayout({ children, toolId, title, description, category }: ToolLayoutProps) {
  const [usage, setUsage] = useState<UsageData | null>(null)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/tools/usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolId }),
        })
        if (response.ok) {
          const data = await response.json()
          if (data.usage) setUsage(data.usage)
        }
      } catch {
        // silently ignore
      }
    }
    fetchUsage()
  }, [toolId])

  const usageLabel = usage ? '今日の利用: ' + usage.used + ' / ' + usage.dailyLimit + ' 回' : ''
  const remainLabel = usage ? (usage.remaining > 0 ? '残り ' + usage.remaining + ' 回' : '上限に達しました') : ''
  const pct = usage ? Math.min((usage.used / usage.dailyLimit) * 100, 100) : 0

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <PageHero title={title} subtitle={description} />
      <Container size="lg">
        <div className="py-8">
          {category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {category}
              </span>
            </div>
          )}
          {usage && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{usageLabel}</span>
                <span className={usage.remaining > 0 ? 'font-medium text-green-700' : 'font-medium text-red-600'}>
                  {remainLabel}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-700 h-2 rounded-full transition-all"
                  style={{ width: pct + '%' }}
                />
              </div>
            </div>
          )}
          {children}
          {category && <RelatedTools toolId={toolId} category={category} />}
        </div>
      </Container>
      <Footer />
    </div>
  )
}
