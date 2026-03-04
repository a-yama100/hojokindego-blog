import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: '利用規約 | 補助金でゴー！',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-12">
          <Container>
            <h1 className="text-3xl font-bold text-center">利用規約</h1>
          </Container>
        </section>
        <Container size="md" className="py-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. 規約への同意</h2>
              <p className="text-gray-700">補助金でゴー！（hojokin.phaiworks.com）をご利用いただくことで、本利用規約に同意したものとみなします。同意いただけない場合は、本サービスのご利用をお控えください。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. サービスの性質</h2>
              <p className="text-gray-700">補助金でゴー！は、公開されている日本の補助金・助成金情報を要約した情報メディアサイトです。申請代行・コンサルティング・採択保証は行っておりません。すべての情報は参考用です。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. 情報の正確性</h2>
              <p className="text-gray-700">補助金の締切・申請要件・上限額は頻繁に変更されます。最新情報の維持に努めていますが、常に正確性を保証できるものではありません。判断前に必ず各ページにリンクされた公式サイトでご確認ください。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. 専門的アドバイスについて</h2>
              <p className="text-gray-700">本サイトの情報は法律・金融・経営に関するアドバイスを構成するものではありません。補助金申請には、中小企業診断士や専門家にご相談ください。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. 知的財産権</h2>
              <p className="text-gray-700">本サイトのオリジナルコンテンツは当サイトの知的財産です。行政文書の内容は要約し、公式情報源へのリンクを提供しています。PDFや公式文書の全文複製は行っていません。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. 免責事項</h2>
              <p className="text-gray-700">補助金でゴー！は、本サイトの情報に基づく損害、申請締切の見落とし、申請不採択について、一切の責任を負いません。</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. 規約の変更</h2>
              <p className="text-gray-700">本規約は事前の通知なく変更される場合があります。継続利用をもって同意とみなします。</p>
            </section>
            <p className="text-gray-500 text-sm">最終更新日：2025年1月</p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
