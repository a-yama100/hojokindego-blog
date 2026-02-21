import { Metadata } from 'next'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { Card, CardContent } from '@/components/Card'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'プロフィール',
  description: 'IT歴35年のベテランエンジニアのプロフィール。おとな世代の経験を土台に、AIを使った仕事と生活の再設計を支援。',
}

const certifications = [
  {
    title: '【米国ヴァンダービルト大学認定】AIエージェント開発・プロフェッショナル',
    image: '/images/about/certs/vanderbilt-ai-agent.png',
    skills: 'プロンプトエンジニアリング / エージェンティックAI / AIアシスタント開発 / Python開発 / 生成AI / データ分析 / 信頼性の高いAI / AIエージェントアーキテクチャ / GPTカスタマイズ / AIツール連携',
  },
  {
    title: '【IBM認定】生成AIエンジニア・プロフェッショナル',
    image: '/images/about/certs/ibm-genai-engineer.png',
    skills: 'LLM・プロンプティング / LLMファインチューニング・アプリケーションフレームワーク / 機械学習・ディープラーニング / 自然言語処理(NLP) / Python・AIツール / データ分析・可視化 / AI倫理 / AIアプリケーション開発',
  },
  {
    title: '【IBM認定】データサイエンス・プロフェッショナル',
    image: '/images/about/certs/ibm-data-science.png',
    skills: 'データ分析・可視化 / 機械学習・モデリング / Pythonプログラミング・ツール / データベース・SQL / データサイエンス方法論 / AI最先端トピック',
  },
  {
    title: '【IBM認定】フルスタックソフトウェア開発・プロフェッショナル',
    image: '/images/about/certs/ibm-fullstack.png',
    skills: 'フロントエンド開発 / バックエンド開発 / データベース管理 / クラウドコンピューティング・DevOps / ソフトウェア工学原則 / バージョン管理 / AI・データサイエンス / ソフトスキル・キャリア開発',
  },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero title="プロフィール" subtitle="「論より証拠」の実績" />

        <section className="py-16">
          <Container>
            <SectionHeader title="プロフィール・主な経歴" center />
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-xl p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="shrink-0 mx-auto md:mx-0">
                    <Image src="/images/about/profile.png" alt="プロフィール写真" width={200} height={200} className="rounded-xl object-cover" />
                  </div>
                  <div>
                    <div className="mb-3">
                      <Image src="/images/about/name-jp.png" alt="運営者" width={290} height={35} />
                    </div>
                    <ul className="space-y-3 text-gray-700">
                    <li>東京都出身 生粋の江戸っ子（3代目）</li>
                    <li>国際知能指数テスト「IQ：135以上」（満点・本テスト最高得点者）</li>
                    <li>日本体育大学卒業。体育学士。中高保健体育教員免許</li>
                    <li>ギター、ドラム、ピアノ、アルトサックスなどを人並み以上に演奏するマルチプレーヤー（全て独学）</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-800 pl-4 mb-6">メディア等掲載履歴</h3>
                <div className="rounded-xl overflow-hidden">
                  <Image src="/images/about/media.png" alt="メディア掲載履歴" width={900} height={500} className="w-full h-auto" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-800 pl-4">キャリア年表</h3>
                <div className="grid gap-3">
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">1990年</span><span>Linuxサーバ管理者</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">1995年</span><span>HTMLで初めてのホームページ作成と公開</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2000年</span><span>独立起業</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2000年代</span><span>SEO対策、WordPress等でサイト構築</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2000年代</span><span>神田昌典氏認定: ダイレクト・レスポンス・マーケティング認定者</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2000年代</span><span>Photoshop、Illustrator、デザイン制作を開始</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2000年代</span><span>アフィリエイトを開始。自らASPを制作運営</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2000年代</span><span>動画配信サイトの制作運営</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2000年代</span><span>絶頂期のライブドアから買収交渉、大手ベンチャーキャピタル数社から投資事案</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2000年代</span><span>全日本SEO協会設立メンバー</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2010年代</span><span>書籍出版（計3冊）と多数の雑誌取材、テレビ出演依頼</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2010年代</span><span>FXトレードを開始</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2010年代</span><span>FXで月平均1000pips以上獲得で勝ち組み（証拠公開中）</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2010年代</span><span>多数のFX自動売買ツール開発</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2010年代</span><span>フィリピン永住権と移住</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2020年代</span><span>AI エンジニア + データサイエンティスト</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2020年代</span><span>AIによるFXの未来価格予測ツール開発</span></div>
                  <div className="flex"><span className="font-medium text-emerald-800 w-24 shrink-0">2020年代</span><span>海外YouTuberアドバイザー（初年度の収益：3.2万ドル達成）</span></div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-gray-50">
          <Container>
            <SectionHeader title="主な資格・認定など" center />
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {certifications.map((cert, index) => (
                <Card key={index}>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <Image src={cert.image} alt={cert.title} width={80} height={80} className="rounded-lg object-contain border border-gray-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-emerald-800 mb-2">{cert.title}</h3>
                        <p className="text-sm text-gray-600">{cert.skills}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
