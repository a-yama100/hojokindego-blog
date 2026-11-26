import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'

export const metadata: Metadata = {
  title: '運営者について',
  description: '補助金でゴー！の運営者情報とサービス概要。',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-16">
          <Container size="md">
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
                補助金でゴー！は、日本の事業者向けに、国や地方自治体の補助金・助成金を検索・比較できる情報サイトです。jGrants・ミラサポplus・各省庁の公式サイトの情報をまとめ、使える補助金をわかりやすく紹介します。
              </p>
            </section>
            <section>
              <SectionHeader title="提供サービス" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: '補助金検索', desc: '分野（IT・製造業・創業など）や地域（全国・東京・大阪など）で絞り込んで探せます。' },
                  { title: 'ターゲットスコア', desc: '申請の条件と競争率をもとにした0～100の独自のスコアで、採択のされやすさの目安を示します。' },
                  { title: '難易度表示', desc: '「簡単」「普通」「難しい」の3段階で表示し、どの補助金から申請するかを決めやすくします。' },
                  { title: '公式リンク', desc: 'すべての補助金に、公式の行政サイトへのリンクを載せています。最新の情報は公式サイトで確認できます。' },
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
                  補助金でゴー！は、情報の提供を目的としたサイトです。公開されている補助金の情報を要約し、公式の情報源へのリンクを載せています。補助金の締切・金額・条件はよく変わります。申請の前に、各補助金のページからリンクしている公式サイトで、必ず最新の情報をご確認ください。当サイトは、どの行政機関とも提携していません。
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
