import type { Metadata } from 'next'

// tools/review/page.tsx は "use client" で metadata を持てないため、layout で title / canonical を決める（2026-11-26）
export const metadata: Metadata = {
  title: '申請書AIレビュー',
  description: '補助金の申請書の文章をAIが読み、直したほうがよい点を示します（スタンダード会員以上）。',
  alternates: { canonical: '/tools/review' },
}

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children
}
