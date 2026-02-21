'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  content: string
  category: string
  is_published: boolean
  is_premium: boolean
  required_plan: string
  published_at: string | null
  access_level: string
  deleted_at: string | null
}

interface BlogListItem {
  id: string
  slug: string
  title: string
  category: string
  is_published: boolean
  is_premium: boolean
  required_plan: string
  published_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  access_level: string
}

const CATEGORIES = [
  'AI活用ガイド',
  '副業実践',
  'ツール活用',
  'マインドセット',
  '事例紹介',
  'お知らせ',
]

const PLANS = ['free', 'light', 'standard', 'premium']
const ACCESS_LEVELS = ['full', 'partial', 'preview']

export default function AdminBlogPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [posts, setPosts] = useState<BlogListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const emptyForm = {
    slug: '',
    title: '',
    description: '',
    content: '',
    category: CATEGORIES[0],
    is_published: false,
    is_premium: false,
    required_plan: 'free',
    published_at: '',
    access_level: 'full'
  }
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const postsCache = useRef<{ posts: BlogListItem[]; timestamp: number } | null>(null)
  const [message, setMessage] = useState('')

  const fetchPosts = async (skipCache = false) => {
    if (!skipCache && postsCache.current && Date.now() - postsCache.current.timestamp < 300000) {
      setPosts(postsCache.current.posts)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog')
      const data = await res.json()
      if (data.posts) {
        setPosts(data.posts)
        postsCache.current = { posts: data.posts, timestamp: Date.now() }
      }
    } catch {
      setMessage('記事の取得に失敗しました')
    }
    setLoading(false)
  }

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return
      try {
                const res = await fetch('/api/admin/check')
        const data = await res.json()
        if (data.isAdmin) {
          setIsAdmin(true)
        } else {
          router.push('/')
        }
      } catch {
        router.push('/login')
      }
    }
    if (!authLoading) {
      if (!user) { router.push('/login') }
      else { checkAdmin() }
    }
  }, [user, authLoading, router])

  useEffect(() => { if (isAdmin) fetchPosts(true) }, [isAdmin])

  const handleNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
    setMessage('')
  }

  const handleEdit = async (id: string) => {
    setMessage('')
    try {
      const res = await fetch('/api/admin/blog/' + id)
      const data = await res.json()
      if (data.post) {
        const p = data.post as BlogPost
        setForm({
          slug: p.slug || '',
          title: p.title || '',
          description: p.description || '',
          content: p.content || '',
          category: p.category || CATEGORIES[0],
          is_published: p.is_published,
          is_premium: p.is_premium,
          required_plan: p.required_plan || 'free',
          published_at: p.published_at ? p.published_at.slice(0, 16) : '',
          access_level: p.access_level || 'full'
        })
        setEditing(id)
        setShowForm(true)
      }
    } catch {
      setMessage('記事の取得に失敗しました')
    }
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      setMessage('タイトルとスラッグは必須です')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const body = {
        ...form,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null
      }
      let res
      const authHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
      if (editing) {
        res = await fetch('/api/admin/blog/' + editing, {
          method: 'PATCH',
          headers: authHeaders,
          body: JSON.stringify(body)
        })
      } else {
        res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(body)
        })
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage(editing ? '更新しました' : '作成しました')
      setShowForm(false)
      fetchPosts(true)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'エラーが発生しました')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm('「' + title + '」を削除しますか？')) return
    try {
      const res = await fetch('/api/admin/blog/' + id, {
        method: 'DELETE'
        
      })
      if (!res.ok) throw new Error('Failed')
      setMessage('削除しました')
      fetchPosts(true)
    } catch {
      setMessage('削除に失敗しました')
    }
  }

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch('/api/admin/blog/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleted_at: null })
      })
      if (!res.ok) throw new Error('Failed')
      setMessage('復元しました')
      fetchPosts(true)
    } catch {
      setMessage('復元に失敗しました')
    }
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/blog/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !current })
      })
      if (!res.ok) throw new Error('Failed')
      fetchPosts(true)
    } catch {
      setMessage('更新に失敗しました')
    }
  }

  const formatDate = (d: string | null) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <>
      <Header />
      {(authLoading || !user || !isAdmin) ? (
        <main className="py-20 min-h-screen bg-gray-50">
          <p className="text-center text-gray-500">{authLoading ? '読み込み中...' : 'アクセス権がありません'}</p>
        </main>
      ) : (
      <main className="py-8 min-h-screen bg-gray-50">
        <Container size="lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ブログ管理</h1>
            <button onClick={handleNew} className="cursor-pointer bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg font-medium transition-colors">
              新規作成
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
              {message}
            </div>
          )}

          {showForm && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{editing ? '記事を編集' : '新規記事作成'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル *</label>
                    <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">スラッグ *</label>
                    <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900" placeholder="example-post-slug" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">説明文</label>
                  <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">本文 (Markdown)</label>
                  <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={15} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 font-mono text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">プラン</label>
                    <select value={form.required_plan} onChange={e => setForm({...form, required_plan: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900">
                      {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">アクセス</label>
                    <select value={form.access_level} onChange={e => setForm({...form, access_level: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900">
                      {ACCESS_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">公開日時</label>
                    <input type="datetime-local" value={form.published_at} onChange={e => setForm({...form, published_at: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900" />
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm text-gray-700">公開する</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.is_premium} onChange={e => setForm({...form, is_premium: e.target.checked})} className="w-4 h-4" />
                    <span className="text-sm text-gray-700">プレミアム記事</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} disabled={saving} className="cursor-pointer bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50">
                    {saving ? '保存中...' : (editing ? '更新する' : '作成する')}
                  </button>
                  <button onClick={() => setShowForm(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors">
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-gray-500 text-center py-12">読み込み中...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 text-center py-12">記事がありません</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                    <th className="px-4 py-3">タイトル</th>
                    <th className="px-4 py-3">カテゴリ</th>
                    <th className="px-4 py-3">プラン</th>
                    <th className="px-4 py-3">状態</th>
                    <th className="px-4 py-3">公開日</th>
                    <th className="px-4 py-3">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} className={'border-t border-gray-200 text-sm' + (post.deleted_at ? ' bg-red-50 opacity-60' : '')}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-xs text-gray-400">{post.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{post.category}</td>
                      <td className="px-4 py-3 text-gray-600">{post.required_plan}</td>
                      <td className="px-4 py-3">
                        {post.deleted_at ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">削除済</span>
                        ) : post.is_published ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">公開</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">下書き</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(post.published_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          {post.deleted_at ? (
                            <button onClick={() => handleRestore(post.id)} className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">復元</button>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(post.id)} className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">編集</button>
                              <button onClick={() => handleTogglePublish(post.id, post.is_published)} className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
                                {post.is_published ? '非公開' : '公開'}
                              </button>
                              <button onClick={() => handleDelete(post.id, post.title)} className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">削除</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Container>
      </main>
      )}
      <Footer />
    </>
  )
}
