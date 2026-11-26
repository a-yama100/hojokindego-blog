import type { Metadata } from 'next'

// tools/matching/page.tsx は "use client" で metadata を持てないため、layout で title / canonical を決める（2026-11-26）
export const metadata: Metadata = {
  title: '補助金マッチング',
  description: '業種・目的・従業員の規模を選ぶと、合う補助金をAIが提案します（スタンダード会員以上）。',
  alternates: { canonical: '/tools/matching' },
}

export default function MatchingLayout({ children }: { children: React.ReactNode }) {
  return children
}
