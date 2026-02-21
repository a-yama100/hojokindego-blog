"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { FormInput } from '@/components/FormInput'
import { LoadingButton } from '@/components/LoadingButton'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import { signUp } from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const redirectTo = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') || '/' : '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, redirectTo)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="py-12 min-h-screen bg-gray-50">
          <Container size="sm">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h1 className="text-2xl font-bold mb-4">登録完了</h1>
              <p className="text-gray-600 mb-6">
                確認メールを送信しました。<br />
                メール内のリンクをクリックすると、元のページに戻ります。
              </p>
              <Link href="/login" className="text-emerald-800 hover:underline">
                ログインページへ
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="py-12 min-h-screen bg-gray-50">
        <Container size="sm">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-center mb-8">新規登録</h1>

            <ErrorDisplay error={error} className="mb-6" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="メールアドレス"
                type="email"
                value={email}
                onChange={setEmail}
                required
                placeholder="example@email.com"
              />

              <FormInput
                label="パスワード"
                type="password"
                value={password}
                onChange={setPassword}
                required
                placeholder="8文字以上"
              />

              <FormInput
                label="パスワード（確認）"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                placeholder="もう一度入力"
              />

              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="登録中..."
                fullWidth
              >
                無料で登録する
              </LoadingButton>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              既にアカウントをお持ちの方は
              <Link href="/login" className="text-emerald-800 hover:underline ml-1">
                ログイン
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-500 text-center">
              登録することで、
              <Link href="/terms" className="text-emerald-800 hover:underline">利用規約</Link>
              と
              <Link href="/privacy" className="text-emerald-800 hover:underline">プライバシーポリシー</Link>
              に同意したものとみなされます。
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
