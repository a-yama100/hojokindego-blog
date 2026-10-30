import type { Metadata } from 'next'

// reset-password/page.tsx は "use client" で metadata を持てないため、layout で title と noindex を決める（2026-10-30）
export const metadata: Metadata = {
  title: '新しいパスワードの設定',
  robots: { index: false, follow: false },
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
