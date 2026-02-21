"use client"

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { FormInput } from '@/components/FormInput'
import { FormTextarea } from '@/components/FormTextarea'
import { FormSelect } from '@/components/FormSelect'
import { LoadingButton } from '@/components/LoadingButton'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import { PageHero } from '@/components/PageHero'

const categories = [
  { value: '', label: '選択してください' },
  { value: 'サービスについて', label: 'サービスについて' },
  { value: '料金・お支払い', label: '料金・お支払い' },
  { value: '技術的な質問', label: '技術的な質問' },
  { value: 'ツールについて', label: 'ツールについて' },
  { value: '不具合の報告', label: '不具合の報告' },
  { value: 'その他', label: 'その他' },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('お名前、メールアドレス、お問い合わせ内容は必須です')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, category, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '送信に失敗しました')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました')
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
              <h1 className="text-2xl font-bold mb-4">送信完了</h1>
              <p className="text-gray-600 mb-2">
                お問い合わせありがとうございます。
              </p>
              <p className="text-gray-600 mb-6">
                確認メールを送信しました。通常24時間以内にご返信いたします。
              </p>
              <a href="/" className="text-emerald-800 hover:underline">
                トップページに戻る
              </a>
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
      <main>
        {/* Hero */}
        <PageHero title="お問い合わせ" subtitle="ご質問・ご要望をお気軽にお寄せください" />

        <section className="py-12">
          <Container size="sm">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <ErrorDisplay error={error} className="mb-6" />

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  label="お名前"
                  value={name}
                  onChange={setName}
                  required
                  placeholder="山田 太郎"
                />

                <FormInput
                  label="メールアドレス"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  placeholder="example@email.com"
                />

                <FormSelect
                  label="お問い合わせカテゴリ"
                  options={categories}
                  value={category}
                  onChange={setCategory}
                />

                <FormTextarea
                  label="お問い合わせ内容"
                  value={message}
                  onChange={setMessage}
                  required
                  placeholder="お問い合わせ内容をご記入ください"
                  rows={6}
                />

                <LoadingButton
                  type="submit"
                  loading={loading}
                  loadingText="送信中..."
                  fullWidth
                >
                  送信する
                </LoadingButton>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  送信内容は最新暗号技術により保護され、個人情報保護方針に基づき第三者に漏洩することはありません。<br />
                  24時間以内に返信がない場合は、迷惑メール等をご確認ください。
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
