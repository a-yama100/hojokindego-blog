'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingButton } from '@/components/LoadingButton'

const CATEGORIES = ['AI\u6d3b\u7528\u30ac\u30a4\u30c9', '\u526f\u696d\u30fb\u53ce\u76ca', '\u30de\u30a4\u30f3\u30c9\u30bb\u30c3\u30c8', '\u30c4\u30fc\u30eb\u6d3b\u7528', '\u904b\u55b6\u8005\u30b3\u30e9\u30e0']

export default function EditPostPage() {
  const router = useRouter()
  const { session, loading: authLoading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [postId, setPostId] = useState('')
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', content: '',
    category: '', access_level: 'free', is_published: false,
    thumbnail_url: '', slugManual: true
  })

  const getToken = () => session?.access_token || ''

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }

  useEffect(() => {
    if (authLoading) return
    if (!session) { router.push('/login'); return }
    const id = window.location.pathname.split('/admin/blog/')[1]?.split('/edit')[0]
    if (id) {
      setPostId(id)
      checkAndLoad(id)
    }
  }, [authLoading, session])

  const checkAndLoad = async (id: string) => {
    try {
      const token = getToken()
      const res = await fetch('/api/admin/check')
      const data = await res.json()
      if (!data.isAdmin) { router.push('/'); return }
      setIsAdmin(true)

      const postRes = await fetch('/api/admin/blog/posts/' + id)
      const postData = await postRes.json()
      if (postData.post) {
        const p = postData.post
        setFormData({
          title: p.title || '', slug: p.slug || '', description: p.description || '',
          content: p.content || '', category: p.category || '',
          access_level: p.access_level || 'free', is_published: p.is_published || false,
          thumbnail_url: p.thumbnail_url || '', slugManual: true
        })
      }
    } catch (err) {
      setError('Failed to load post')
    } finally {
      setLoadingPost(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/blog/posts/' + postId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/admin/blog')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('Move this post to trash?')) return
    try {
      await fetch('/api/admin/blog/posts/' + postId, {
        method: 'DELETE'
        
      })
      router.push('/admin/blog')
    } catch (err) {
      setError('Failed to delete post')
    }
  }

  if (authLoading || loadingPost) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading...</div>
  }
  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" value={formData.title}
                onChange={(e) => { const t = e.target.value; setFormData({...formData, title: t, slug: formData.slugManual ? formData.slug : generateSlug(t)}) }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value, slugManual: true})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content * (Markdown)</label>
              <textarea value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={20} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-sm" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900">
                  <option value="">-- Select --</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                <select value={formData.access_level}
                  onChange={(e) => setFormData({...formData, access_level: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900">
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial (Paywall)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input type="text" value={formData.thumbnail_url}
                  onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900" placeholder="https://..." />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_published" checked={formData.is_published}
                onChange={(e) => setFormData({...formData, is_published: e.target.checked})} className="rounded" />
              <label htmlFor="is_published" className="text-sm text-gray-700">Publish immediately</label>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button type="button" onClick={handleDeletePost}
                className="cursor-pointer px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition text-sm">
                Delete Post
              </button>
              <div className="flex gap-3">
                <Link href="/admin/blog" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</Link>
                <LoadingButton loading={saving} loadingText="Saving..."
                  className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium">
                  Save Changes
                </LoadingButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
