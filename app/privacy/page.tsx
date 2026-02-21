import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="py-12 min-h-screen">
        <Container size="md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">最終更新日：2026年2月1日</p>

            <p>おとなのAI実践ラボ（以下「当サイト」）は、ユーザーの個人情報の保護を重要視し、以下のプライバシーポリシーに基づき、個人情報の適切な取り扱いと保護に努めます。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">1. 収集する情報</h2>
            <p>当サイトでは、以下の情報を収集する場合があります。</p>
            <p>（1）メールアドレス（会員登録時）</p>
            <p>（2）お支払い情報（有料サービス利用時、Stripeを通じて処理）</p>
            <p>（3）アクセスログ（IPアドレス、ブラウザ情報、アクセス日時等）</p>
            <p>（4）Cookie情報</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">2. 情報の利用目的</h2>
            <p>収集した情報は、以下の目的で利用します。</p>
            <p>（1）サービスの提供・運営</p>
            <p>（2）ユーザーへの連絡（お知らせ、サポート対応等）</p>
            <p>（3）利用料金の請求</p>
            <p>（4）サービスの改善・新サービスの開発</p>
            <p>（5）不正利用の防止</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">3. 情報の第三者提供</h2>
            <p>当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
            <p>（1）ユーザーの同意がある場合</p>
            <p>（2）法令に基づく場合</p>
            <p>（3）人の生命・身体・財産の保護のため必要がある場合</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">4. 決済情報の取り扱い</h2>
            <p>クレジットカード情報等の決済情報は、当サイトでは直接保存せず、決済代行サービス「Stripe」を通じて安全に処理されます。Stripeのプライバシーポリシーについては、Stripeの公式サイトをご参照ください。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">5. Cookieの使用</h2>
            <p>当サイトでは、ユーザーの利便性向上やアクセス解析のためにCookieを使用しています。ブラウザの設定により、Cookieの受け入れを拒否することも可能ですが、一部のサービスが正常に動作しなくなる場合があります。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">6. 情報の安全管理</h2>
            <p>当サイトは、個人情報の漏洩、滅失、毀損を防止するため、適切なセキュリティ対策を実施します。データの送受信はSSL/TLS暗号化通信により保護されています。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">7. 個人情報の開示・訂正・削除</h2>
            <p>ユーザーは、当サイトに対して自己の個人情報の開示、訂正、削除を請求することができます。請求があった場合、本人確認の上、速やかに対応いたします。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">8. プライバシーポリシーの変更</h2>
            <p>当サイトは、必要に応じてプライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当サイト上に掲載した時点で効力を生じるものとします。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">9. お問い合わせ</h2>
            <p>個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。</p>
              <p><a href="/contact" className="text-blue-600 underline hover:text-blue-800">お問い合わせページはこちら</a></p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
