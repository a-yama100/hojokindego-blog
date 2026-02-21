"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      })
      if (error) throw error
      setMessage('\u30d1\u30b9\u30ef\u30fc\u30c9\u30ea\u30bb\u30c3\u30c8\u7528\u306e\u30ea\u30f3\u30af\u3092\u30e1\u30fc\u30eb\u3067\u9001\u4fe1\u3057\u307e\u3057\u305f\u3002\u30e1\u30fc\u30eb\u3092\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '\u30ea\u30bb\u30c3\u30c8\u30e1\u30fc\u30eb\u306e\u9001\u4fe1\u306b\u5931\u6557\u3057\u307e\u3057\u305f'
      setError(msg)
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
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              {'\u30d1\u30b9\u30ef\u30fc\u30c9\u306e\u30ea\u30bb\u30c3\u30c8'}
            </h1>
            <p className="text-center text-sm text-gray-600 mb-8">
              {'\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u3092\u5165\u529b\u3059\u308b\u3068\u3001\u30d1\u30b9\u30ef\u30fc\u30c9\u30ea\u30bb\u30c3\u30c8\u7528\u306e\u30ea\u30f3\u30af\u304c\u9001\u4fe1\u3055\u308c\u307e\u3059\u3002'}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {'\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9'}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? '\u9001\u4fe1\u4e2d...' : '\u30ea\u30bb\u30c3\u30c8\u30ea\u30f3\u30af\u3092\u9001\u4fe1'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-green-600 hover:text-green-800 font-medium text-sm">
                {'\u30ed\u30b0\u30a4\u30f3\u306b\u623b\u308b'}
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
