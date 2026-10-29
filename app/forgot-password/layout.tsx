import type { Metadata } from 'next'

// forgot-password/page.tsx は "use client" で metadata を持てないため、layout で title と noindex を決める（2026-10-30）
export const metadata: Metadata = {
  title: 'パスワードの再設定',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
