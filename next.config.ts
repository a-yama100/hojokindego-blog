import type { NextConfig } from "next";

// 'unsafe-eval' は開発サーバー（React の不具合の表示）だけで使う。本番では入れない。
const isDev = process.env.NODE_ENV !== 'production'

// ログイン・登録・再設定・マイページ・管理画面は検索に出さない（robots.txt で止めずに noindex で伝える）
const noindexHeaders = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
const NOINDEX_PATHS = ['/login', '/signup', '/forgot-password', '/auth/:path*', '/dashboard/:path*', '/dashboard', '/admin/:path*', '/admin']

// 読み込む外部の宛先は、GA（googletagmanager・google-analytics）と Supabase だけ。
// 画像は記事・広告の画像の URL を DB から出すので https: を許す。
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval'" : "") + " https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "media-src 'self' https: blob:",
  "connect-src 'self' https://*.supabase.co https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com",
  "frame-src 'self' https://www.googletagmanager.com https://www.youtube-nocookie.com https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: csp },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-bfe3a944affd4efaa100db300cff3085.r2.dev',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      ...NOINDEX_PATHS.map((source) => ({ source, headers: noindexHeaders })),
    ]
  },
}

export default nextConfig
