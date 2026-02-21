import type { Metadata } from 'next'
import Script from 'next/script'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import { ScrollToTop } from '@/components/ScrollToTop'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hojokindego.com'),
  title: {
    default: 'Hojokin de Go! - Japan Subsidy & Grant Finder',
    template: '%s | Hojokin de Go!'
  },
  description: 'Find and compare Japanese government subsidies and grants for businesses. Acceptance rates, deadlines, and strategic scoring to maximize your chances.',
  keywords: ['Japan subsidies', 'government grants', 'hojokin', 'business funding', 'SME grants', 'Japanese grants'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.hojokindego.com',
    siteName: 'Hojokin de Go!',
    title: 'Hojokin de Go! - Japan Subsidy & Grant Finder',
    description: 'Find and compare Japanese government subsidies and grants for businesses.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hojokin de Go! - Japan Subsidy & Grant Finder',
    description: 'Find and compare Japanese government subsidies and grants for businesses.',
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
  },
  robots: { index: true, follow: true },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Hojokin de Go!',
  url: 'https://www.hojokindego.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://www.hojokindego.com/subsidies?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
