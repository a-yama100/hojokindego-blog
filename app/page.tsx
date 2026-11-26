import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { FAQ, FAQJsonLd } from '@/components/FAQ'
import { AdBanner } from '@/components/AdBanner'

const faqItems = [
  { question: '補助金でゴー！とは？', answer: '補助金でゴー！は、国や地方自治体の補助金・助成金を検索・比較できる情報サイトです。jGrantsや各省庁・自治体の情報を集約し、あなたの事業に合った補助金を見つけるお手伝いをします。' },
  { question: '誰が補助金を申請できますか？', answer: '多くの補助金は中小企業・個人事業主・スタートアップが対象です。業種・地域・事業規模により申請可能な制度が異なります。当サイトのフィルター機能で簡単に絞り込めます。' },
  { question: 'ターゲットスコアとは？', answer: '採択率・競争率・締切までの日数・補助額を組み合わせた、0～100の独自のスコアです。どの補助金から申請するかを決める目安になります。' },
  { question: '情報は最新ですか？', answer: '公式の情報源をもとに更新し、各補助金に「最終確認日」を表示しています。締切を過ぎた補助金は一覧に表示しません。申請の前には、必ず公式サイトで最新の情報をご確認ください。' },
  { question: '申請の代行はしてもらえますか？', answer: '当サイトでは申請の代行は行っていません。各補助金のページから、公式の申請ページへ進めます。スタンダード会員は、申請書をAIが読んで改善点を示す「申請書AIレビュー」を使えます。' },
  { question: '無料で使えますか？', answer: '補助金の検索と一覧の表示は無料です。ライト会員以上は、締切アラート・業種別のおすすめメール・採択率の分析を使えます。プランごとの内容は「会員プラン」のページをご覧ください。' },
]

const ministries = [
  { name: '経産省', full: '経済産業省', focus: 'IT・製造業・イノベーション' },
  { name: '厚労省', full: '厚生労働省', focus: '雇用・訓練・職場環境' },
  { name: '観光庁', full: '国土交通省観光庁', focus: '観光・ホスピタリティ・インバウンド' },
  { name: '環境省', full: '環境省', focus: 'グリーンエネルギー・脱炭素' },
  { name: 'デジタル庁', full: 'デジタル庁', focus: 'DX・デジタル化・IT活用' },
  { name: '地方自治体', full: '都道府県・市区町村', focus: '地域限定の補助金プログラム' },
]

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <>
      <FAQJsonLd items={faqItems} />
      <Header />
      <main>
        {/* ヒーロー */}
        <section className="pt-6 pb-6">
          <Container>
            {/* 背景の帯も本文の幅に収める（2026-11-27） */}
            <div className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 rounded-2xl px-6 py-8 md:py-12">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  あなたの事業に合った<br />
                  <span className="text-emerald-400">補助金が見つかる！</span>
                </h1>
                <Image
                  src="/media/hero.webp"
                  alt="町工場の事務所で、経営者と相談員がノートパソコンを見ながら補助金を探している様子"
                  width={1600}
                  height={679}
                  priority
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="w-full h-auto rounded-xl mb-8"
                />
                <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium">
                  締切に間に合う補助金を、検索して比べられます
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/subsidies" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 shadow-lg text-lg transition-colors">
                    補助金を検索する
                  </Link>
                  <Link href="/blog" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-white border-2 border-white hover:bg-white/10 text-lg transition-colors">
                    ブログを読む
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <div className="bg-white">
          <Container>
            <AdBanner siteId="hojokindego" position="top" />
          </Container>
        </div>

        {/* インパクト */}
        <section className="py-16 md:py-20 bg-emerald-800">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                なんと！ 毎年「数千億円」の補助金が未申請のまま…
              </h2>
              <p className="text-lg md:text-xl text-emerald-100 mb-8 leading-relaxed">
                お金は用意されています。ほとんどの事業者が、その存在を知らないだけなのです。
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/15 backdrop-blur rounded-xl p-6 border border-white/20">
                  <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-2">3,000+</div>
                  <p className="text-white text-sm">国・地方自治体の補助金プログラムが稼働中。</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-6 border border-white/20">
                  <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-2">60%</div>
                  <p className="text-white text-sm">対象の中小企業の60％が、補助金の存在を知らず申請していません。</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-6 border border-white/20">
                  <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-2">1,000万円+</div>
                  <p className="text-white text-sm">人気の中小企業向け補助金の平均補助額。</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* お悩み */}
        <section className="py-16 md:py-20 bg-gray-900">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
                こんなお悩み、ありませんか？
              </h2>
              <p className="text-gray-400 text-center mb-10">補助金探しでつまずくポイントとは？</p>
              <div className="space-y-4">
                {[
                  '補助金の存在を知った時には、もう締切が過ぎていた',
                  'jGrantsで何時間も探したが、該当するものが見つからなかった',
                  '補助金を見つけたが、自社が対象か判断できなかった',
                  '申請したいが、手続きが複雑すぎて誰かに相談したい',
                  'どの補助金の採択率が高いのかわからない',
                  '地方自治体独自の補助金がどのポータルにも載っていなかった',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-red-900/30 rounded-lg border border-red-800/50">
                    <span className="text-red-400 font-bold text-xl flex-shrink-0">-</span>
                    <p className="text-gray-200 text-base md:text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ソリューション */}
        <section className="py-16 md:py-20 bg-emerald-700">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
                補助金でゴー！であなたに合った補助金が見つかる！
              </h2>
              <p className="text-emerald-200 text-center mb-10">分野・地域・補助額で探せて、スコアでおすすめの順もわかります</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">1</div>
                  <h3 className="font-bold text-white text-lg mb-2">かんたん検索・絞り込み</h3>
                  <p className="text-emerald-100 text-sm">分野・地域・難易度・補助額で絞り込み、締切が近い順にも並べられます。合う補助金をすぐに見つけられます。</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">2</div>
                  <h3 className="font-bold text-white text-lg mb-2">ターゲットスコア（0～100）</h3>
                  <p className="text-emerald-100 text-sm">採択率・競争率・締切までの日数・補助額を1つの点数にまとめ、どれから申請するかを決めやすくします。</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">3</div>
                  <h3 className="font-bold text-white text-lg mb-2">締切管理</h3>
                  <p className="text-emerald-100 text-sm">締切が近い順に並べられ、締切を過ぎた補助金は表示しません。ライト会員以上は、締切の前にメールでお知らせします。</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">4</div>
                  <h3 className="font-bold text-white text-lg mb-2">申請書AIレビュー</h3>
                  <p className="text-emerald-100 text-sm">申請書の文章をAIが読み、直したほうがよい点を示します（スタンダード会員以上）。</p>
                </div>
              </div>
              <div className="flex justify-center mt-10">
                <Link href="/subsidies" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 shadow-lg text-lg transition-colors">
                  無料で補助金を検索
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* 情報源 */}
        <section className="py-16 bg-gray-50">
          <Container>
            <SectionHeader
              title="情報源"
              subtitle="国・地方自治体の補助金プログラムを集約"
              center
            />
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
              {ministries.map((m, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-lg font-black text-emerald-700 mb-1">{m.name}</div>
                  <p className="text-gray-900 font-medium text-sm mb-1">{m.full}</p>
                  <p className="text-gray-500 text-xs">{m.focus}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 免責事項 */}
        <section className="py-8 bg-amber-50">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-amber-800 text-xs">
                免責事項：補助金でゴー！は公開されている補助金情報を参考情報として提供しています。申請前に必ず公式サイトで最新情報をご確認ください。補助金の内容変更や申請結果について当サイトは責任を負いません。
              </p>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-emerald-700 to-emerald-900">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                あなたの次の補助金は、無料検索で見つかる！
              </h2>
              <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                締切・金額・地域で絞り込んで探せます。検索は無料です。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/subsidies" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 shadow-lg text-lg transition-colors">
                  無料で補助金を検索
                </Link>
                <Link href="/pricing" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-white border-2 border-white hover:bg-white/10 text-lg transition-colors">
                  プレミアムプランを見る
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <SectionHeader title="よくある質問" center />
            <div className="max-w-2xl mx-auto">
              <FAQ items={faqItems} />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
