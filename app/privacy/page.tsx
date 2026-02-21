import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | 補助金でゴー！',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-12">
          <Container>
            <h1 className="text-3xl font-bold text-center">プライバシーポリシー</h1>
          </Container>
        </section>
        <Container size="md" className="py-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. 収集する情報</h2>
              <p className="text-gray-700">アカウント登録情報（メールアドレス・ユーザー名）、お問い合わせフォームの送信内容、およびどの補助金ページを閲覧したかなどの匿名化されたアクセス解析データを収集します。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. 情報の利用目的</h2>
              <p className="text-gray-700">収集した情報は、サービスの提供・補助金データの改善・サポート対応・サービス更新のご連絡のために利用します。個人情報を第三者に販売することはありません。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. データの保管</h2>
              <p className="text-gray-700">データはSupabase（PostgreSQL）を通じて安全に保管されます。アカウントが有効な間、データを保持します。お問い合わせページからいつでも削除をリクエストできます。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookieについて</h2>
              <p className="text-gray-700">認証・セッション管理に必要なCookieを使用します。アクセス解析用のCookieは、どの補助金カテゴリが最も役立つかを把握するために使用します。ブラウザの設定でCookieを無効にできます。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. 外部サービス</h2>
              <p className="text-gray-700">ホスティングにVercel、データ保管にSupabaseを利用しています。行政サイトや公式補助金ポータルへの外部リンクは、それぞれのプライバシーポリシーに従います。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. お客様の権利</h2>
              <p className="text-gray-700">個人データへのアクセス・訂正・削除のご要望は、お問い合わせページからご連絡ください。</p>
            </section>
            <p className="text-gray-500 text-sm">最終更新日：2025年1月</p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
