import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { FAQ, FAQJsonLd } from '@/components/FAQ'
import { AdBanner } from '@/components/AdBanner'

const faqItems = [
  { question: '補助金でゴー！とは？', answer: '補助金でゴー！は、国や地方自治体の補助金・助成金を検索・比較できる情報サイトです。jGrantsや各省庁・自治体の情報を集約し、あなたの事業に合った補助金を見つけるお手伝いをします。' },
  { question: '誰が補助金を申請できますか？', answer: '多くの補助金は中小企業・個人事業主・スタートアップが対象です。業種・地域・事業規模により申請可能な制度が異なります。当サイトのフィルター機能で絞り込めます。' },
  { question: 'ターゲットスコアとは？', answer: '採択率・競争率・締切までの日数・補助額を組み合わせた0～100の独自スコアです。どの補助金から申請すべきかの優先順位付けに役立ちます。' },
  { question: '情報は最新ですか？', answer: '公式情報源を毎日チェックし、各補助金に「最終確認日」を表示しています。締切済みの補助金は自動的に非表示になります。' },
  { question: '申請の代行はしてもらえますか？', answer: '当サイトでは申請代行は行っておりませんが、公式申請ページへのリンクや、補助金申請に強い行政書士・社労士とのマッチングを提供しています。' },
  { question: '無料で使えますか？', answer: '基本的な補助金検索・一覧表示は無料です。プレミアム会員は締切アラート、業種別おすすめ、採択率分析、専門家マッチングをご利用いただけます。' },
]

const ministries = [
  { name: '経産省', full: '経済産業省', focus: 'IT・製造業・イノベーション' },
  { name: '厚労省', full: '厚生労働省', focus: '雇用・訓練・職場環境' },
  { name: '観光庁', full: '国土交通省観光庁', focus: '観光・ホスピタリティ・インバウンド' },
  { name: '環境省', full: '環境省', focus: 'グリーンエネルギー・脱炭素' },
  { name: 'デジタル庁', full: 'デジタル庁', focus: 'DX・デジタル化・IT活用' },
  { name: '地方自治体', full: '都道府県・市区町村', focus: '地域限定の補助金プログラム' },
]

export default function Home() {
  return (
    <>
      <FAQJsonLd items={faqItems} />
      <Header />
      <main>
        {/* ヒーロー */}
        <section className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 py-8 md:py-12">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-yellow-400 font-bold mb-4 tracking-wide">
                補助金でゴー！
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                あなたの事業に合った<br />
                <span className="text-emerald-400">補助金を見つけよう</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium">
                締切前に、最適な補助金を検索・比較・申請。
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
          </Container>
        </section>

        <div className="py-4 bg-white">
          <Container>
            <AdBanner siteId="hojokindego" position="top" />
          </Container>
        </div>

        {/* インパクト */}
        <section className="py-16 md:py-20 bg-emerald-800">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                毎年、数千億円の補助金が未申請のままです。
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
              <p className="text-gray-400 text-center mb-10">補助金探しは、事業を回すより難しくあるべきではありません。</p>
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
                補助金でゴー！が、あなたに合った補助金を見つけます。
              </h2>
              <p className="text-emerald-200 text-center mb-10">業種・地域・事業規模で検索。スコア付きのおすすめをご提供。</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">1</div>
                  <h3 className="font-bold text-white text-lg mb-2">かんたん検索・絞り込み</h3>
                  <p className="text-emerald-100 text-sm">省庁・地域・業種・事業規模・締切で絞り込み。数秒で該当する補助金を見つけられます。</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">2</div>
                  <h3 className="font-bold text-white text-lg mb-2">ターゲットスコア（0～100）</h3>
                  <p className="text-emerald-100 text-sm">採択率 + 競争率 + 締切までの日数 + 補助額 = 1つの数字で優先順位を判断。</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">3</div>
                  <h3 className="font-bold text-white text-lg mb-2">締切管理</h3>
                  <p className="text-emerald-100 text-sm">締切を逃さない。緊急度順に並び替え、期限切れは自動非表示。プレミアム会員はメールアラート付き。</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">4</div>
                  <h3 className="font-bold text-white text-lg mb-2">専門家マッチング</h3>
                  <p className="text-emerald-100 text-sm">補助金申請に強い行政書士・社労士・中小企業診断士とのマッチング。</p>
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
                あなたの次の補助金は、検索一つで見つかるかもしれません。
              </h2>
              <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                3,000件以上の補助金。毎日更新。検索無料。
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
