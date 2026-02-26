import Link from 'next/link'
import Image from 'next/image'
import { Container } from './Container'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/about/avatar.png"
                alt="運営者"
                width={100}
                height={100}
                className="rounded-full w-[80px] h-[80px]"
              />
              <span className="text-xl font-bold text-white">
                補助金でゴー！
              </span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              中小企業・個人事業主向けの補助金・助成金を簡単に検索・比較できる情報サイトです。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">コンテンツ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">ブログ</Link></li>
              <li><Link href="/subsidies" className="text-gray-400 hover:text-white transition-colors">補助金検索</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">プラン</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">サポート</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">運営者</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">法的情報</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">利用規約</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/legal" className="text-gray-400 hover:text-white transition-colors">特定商取引法に基づく表記</Link></li>
              <li><a href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors">サイトマップ</a></li>
              <li><a href="/feed.xml" className="text-gray-400 hover:text-white transition-colors">RSSフィード</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          {currentYear} 補助金でゴー！ All Rights Reserved.
        </div>
      </Container>
    </footer>
  )
}
