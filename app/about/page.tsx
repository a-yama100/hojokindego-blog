import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'

export const metadata: Metadata = {
  title: '運営者について | 補助金でゴー！',
  description: '補助金でゴー！の運営者情報とサービス概要。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-16">
          <Container>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">補助金でゴー！について</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">すべての事業者に、補助金情報をわかりやすく</p>
            </div>
          </Container>
        </section>
        <Container size="md" className="py-16">
          <div className="space-y-12">
            <section>
              <SectionHeader title="補助金でゴー！とは？" />
              <p className="text-gray-700 leading-relaxed">
                補助金でゴー！は、日本の事業者向けに国や地方自治体の補助金・助成金を検索・比較できる情報メディアサイトです。jGrants、ミラサポplus、各省庁の公式サイトから情報を集約し、利用可能な補助金をわかりやすくお届けします。
              </p>
            </section>
            <section>
              <SectionHeader title="提供サービス" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: '補助金検索', desc: 'カテゴリ（IT・製造業・スタートアップ）や地域（全国・東京・大阪など）で絞り込み検索。' },
                  { title: 'ターゲットスコア', desc: '申請要件と競争率に基づく0～100の独自スコアで、各補助金の獲得しやすさを表示。' },
                  { title: '難易度表示', desc: '「簡単」「普通」「難しい」の明確なラベルで、どの補助金から申請すべきか判断できます。' },
                  { title: '公式リンク', desc: 'すべての補助金に公式の行政サイトへのリンクを掛載。常に最新情報を確認できます。' },
                ].map(item => (
                  <div key={item.title} className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <SectionHeader title="免責事項" />
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  補助金でゴー！は情報提供を目的としたメディアサイトです。公開されている補助金情報を要約し、公式情報源へのリンクを提供しています。補助金の締切・金額・要件は頻繁に変更されます。必ず各補助金ページにリンクされた公式サイトで最新情報をご確認ください。当サイトはいかなる行政機関とも提携関係にありません。
                </p>
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
