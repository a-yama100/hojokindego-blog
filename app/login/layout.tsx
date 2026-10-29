import type { Metadata } from 'next'

// login/page.tsx は "use client" で metadata を持てないため、layout で title と noindex を決める（2026-10-30）
export const metadata: Metadata = {
  title: 'ログイン',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
