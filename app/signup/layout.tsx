import type { Metadata } from 'next'

// signup/page.tsx は "use client" で metadata を持てないため、layout で title と noindex を決める（2026-10-30）
export const metadata: Metadata = {
  title: '新規登録',
  robots: { index: false, follow: false },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
