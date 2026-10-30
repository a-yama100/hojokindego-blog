"use client"

// forgot-password が送る再設定のメールのリンク先（2026-10-30）。
// メールのリンクで Supabase が再設定用のセッションを作るので、それを待ってから新しいパスワードを設定する
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [checked, setChecked] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
        setReady(true)
        setChecked(true)
      }
    })
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
      setChecked(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください。')
      return
    }
    if (password !== confirm) {
      setError('確認用のパスワードが一致しません。')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setMessage('パスワードを変更しました。マイページへ移動します。')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch {
      setError('パスワードを変更できませんでした。リンクの有効期限が切れている場合は、もう一度再設定のメールを送ってください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="py-12 min-h-screen bg-gray-50">
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">新しいパスワードの設定</h1>
            {checked && !ready ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-6">
                  再設定のリンクが無効か、有効期限が切れています。もう一度、再設定のメールを送ってください。
                </p>
                <Link href="/forgot-password" className="text-green-600 hover:text-green-800 font-medium text-sm">
                  再設定のメールを送る
                </Link>
              </div>
            ) : (
              <>
                <p className="text-center text-sm text-gray-600 mb-8">新しいパスワード（8文字以上）を入力してください。</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={128}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード（確認）</label>
                    <input
                      id="confirm"
                      name="confirm"
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={128}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}
                  {message && <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">{message}</div>}
                  <button
                    type="submit"
                    disabled={loading || !ready}
                    className="w-full py-2 px-4 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? '変更中...' : 'パスワードを変更する'}
                  </button>
                </form>
              </>
            )}
            <div className="mt-6 text-center">
              <Link href="/login" className="text-green-600 hover:text-green-800 font-medium text-sm">ログインに戻る</Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
