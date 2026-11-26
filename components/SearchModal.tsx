"use client"
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

interface SearchResult {
  subsidies: Array<{ slug: string; title: string; summary: string | null; deadline: string | null }>
  posts: Array<{ slug: string; title: string; description: string | null }>
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult>({ subsidies: [], posts: [] })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults({ subsidies: [], posts: [] })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 1) {
      setResults({ subsidies: [], posts: [] })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/search?q=' + encodeURIComponent(q))
      const data = await res.json()
      setResults({ subsidies: data.subsidies || [], posts: data.posts || [] })
    } catch {
      setResults({ subsidies: [], posts: [] })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(value), 300)
  }

  if (!isOpen) return null

  const hasResults = results.subsidies.length > 0 || results.posts.length > 0

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center border-b border-gray-200 px-4">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input aria-label="補助金名やキーワードで検索" maxLength={2048}
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="補助金名やキーワードで検索..."
            className="w-full px-3 py-4 text-base outline-none bg-transparent"
          />
          <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-6 text-center text-gray-500 text-sm">検索中...</div>
          )}

          {!loading && query.length > 0 && !hasResults && (
            <div className="p-6 text-center text-gray-500 text-sm">
              「{query}」に一致する結果が見つかりませんでした
            </div>
          )}

          {!loading && hasResults && (
            <div>
              {results.subsidies.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    補助金 ({results.subsidies.length})
                  </div>
                  {results.subsidies.map((s) => (
                    <Link
                      key={s.slug}
                      href={'/subsidies/' + s.slug}
                      onClick={onClose}
                      className="block px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        {s.deadline && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                            {'締切 ' + s.deadline}
                          </span>
                        )}
                        <span className="font-semibold text-gray-900 text-sm">{s.title}</span>
                      </div>
                      {s.summary && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{s.summary}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {results.posts.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ブログ記事 ({results.posts.length})
                  </div>
                  {results.posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={'/blog/' + post.slug}
                      onClick={onClose}
                      className="block px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-semibold text-gray-900 text-sm">{post.title}</span>
                      {post.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && query.length === 0 && (
            <div className="p-6 text-center text-gray-400 text-sm">
              キーワードを入力して、補助金やブログ記事を検索
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-400">ESCで閉じる</span>
          <Link href="/subsidies" onClick={onClose} className="text-xs text-green-700 hover:text-green-800 font-medium">
            条件を指定して補助金を探す →
          </Link>
        </div>
      </div>
    </div>
  )
}
