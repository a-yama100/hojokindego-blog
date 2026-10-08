import type { Metadata } from 'next'

// contact/page.tsx は "use client" で metadata を持てないため、layout で title / canonical を決める（2026-10-08）
export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '補助金でゴー！へのお問い合わせ。補助金・助成金の検索やご利用についてのご質問を受け付けています。',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
