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
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Clear any existing session first
      await supabase.auth.signOut()
      
      // Then sign in
      let signInData = null
      let lastError: Error | null = null

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (signInError) throw signInError
          signInData = data
          break
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err))
          if (lastError.message.includes('abort') || lastError.message.includes('signal')) {
            await new Promise(r => setTimeout(r, 500))
            continue
          }
          throw lastError
        }
      }
      if (!signInData && lastError) throw lastError
      const data = signInData!

      if (data.session) {
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/'
        router.push(redirectTo)
        router.refresh()
      } else {
        throw new Error('セッションの作成に失敗しました')
      }
    } catch (err) {
      console.error('Login error:', err)
      const msg = err instanceof Error ? err.message : 'ログインに失敗しました'
      if (msg.includes('abort') || msg.includes('signal')) {
        setError('ブラウザ拡張機能またはブラウザの設定によるエラーです。広告ブロックツールなどを無効にするか、シークレットモードでお試しください。')
      } else {
        setError(msg)
      }
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="py-12 min-h-screen bg-gray-50">
        <Container size="sm">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-center mb-8">ログイン</h1>

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

              <LoadingButton
                type="submit"
                loading={loading}
                loadingText="ログイン中..."
                fullWidth
              >
                ログイン
              </LoadingButton>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link href="/forgot-password" className="text-emerald-800 hover:underline">
                パスワードをお忘れですか？
              </Link>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              アカウントをお持ちでない方は
              <Link href="/signup" className="text-emerald-800 hover:underline ml-1">
                新規登録
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
