import type { Metadata } from 'next'
import Script from 'next/script'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import { ScrollToTop } from '@/components/ScrollToTop'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hojokindego.com'),
  title: {
    default: '補助金でゴー！ - 補助金・助成金検索・比較サイト',
    template: '%s | 補助金でゴー！'
  },
  description: '中小企業・個人事業主向けの補助金・助成金を簡単検索・比較。採択率・締切・ターゲットスコアで最適な補助金を見つけましょう。',
  keywords: ['補助金', '助成金', '中小企業', 'IT導入補助金', 'ものづくり補助金', '事業再構築補助金', '持続化補助金'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://www.hojokindego.com',
    siteName: '補助金でゴー！',
    title: '補助金でゴー！ - 補助金・助成金検索・比較サイト',
    description: '中小企業・個人事業主向けの補助金・助成金を簡単検索・比較。',
  },
  twitter: {
    card: 'summary_large_image',
    title: '補助金でゴー！ - 補助金・助成金検索・比較サイト',
    description: '中小企業・個人事業主向けの補助金・助成金を簡単検索・比較。',
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
  },
  robots: { index: true, follow: true },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '補助金でゴー！',
  url: 'https://www.hojokindego.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://www.hojokindego.com/subsidies?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className={'font-sans antialiased bg-white text-gray-900'}>
        <AuthProvider>
          {children}
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  )
}
