'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import { AccessGuard } from '@/components/AccessGuard'
import { Button } from '@/components/Button'

export default function ReviewToolPage() {
  const [text, setText] = useState('')
  const [subsidyName, setSubsidyName] = useState('')
  const [review, setReview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleReview = async () => {
    if (!text.trim()) return
    setLoading(true)
    setReview(null)
    try {
      const res = await fetch('/api/tools/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, subsidyName }),
      })
      if (res.ok) {
        const data = await res.json()
        setReview(data.review)
      } else {
        setReview('レビューに失敗しました。しばらくしてから再度お試しください。')
      }
    } catch {
      setReview('エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolLayout
      toolId="review"
      title="申請書AIレビュー"
      description="申請書のテキストをAIがレビューし、改善点を提案"
      category="申請サポート"
    >
      <AccessGuard toolId="review" requiredPlan="standard">
        {(checkAccess: () => boolean) => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">補助金名（任意）</label>
              <input
                type="text"
                value={subsidyName}
                onChange={e => setSubsidyName(e.target.value)}
                placeholder="例: IT導入補助金、ものづくり補助金"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申請書テキスト <span className="text-red-500">*</span></label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={12}
                placeholder="申請書の事業計画や申請内容を貼り付けてください..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">{text.length}文字</p>
            </div>
            <div className="text-center">
              <Button
                variant="primary"
                onClick={() => { if (checkAccess()) handleReview() }}
                disabled={!text.trim() || loading}
              >
                {loading ? 'レビュー中...' : 'AIレビューを実行'}
              </Button>
            </div>

            {review && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">レビュー結果</h3>
                <div className="prose prose-sm max-w-none">
                  {review.split('\n').filter(l => l.trim()).map((line, i) => (
                    <p key={i} className="text-gray-700 mb-2">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AccessGuard>
    </ToolLayout>
  )
}