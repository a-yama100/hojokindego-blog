import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { SectionHeader } from '@/components/SectionHeader'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: '会員プラン',
  description: '補助金でゴー！の会員プラン。無料で始めて、あなたのペースに合わせてアップグレード。',
}

const plans = [
  {
    id: 'free',
    name: '無料会員',
    price: 0,
    period: '',
    description: 'まずは雰囲気を体験したい方',
    features: [
      '基本記事の閲覧',
      '一部ツールの体験利用（回数制限あり）',
      'メールニュースレター',
    ],
    notIncluded: [
      '会員限定記事',
      'ツール使い放題',
      'ダウンロード素材',
      '質問・サポート',
    ],
    buttonText: '無料で登録',
    buttonVariant: 'outline' as const,
    href: '/signup',
    popular: false,
    disabled: false,
  },
  {
    id: 'light',
    name: 'ライト会員',
    price: 1650,
    period: '/月',
    description: 'AI活用の基礎を知りたい方の入口',
    features: [
      '会員限定記事（基礎・整理系）',
      '月1回の「今月のAI整理便」',
    ],
    notIncluded: [
      'ツール使い放題',
      '実践ガイド',
      '質問対応',
    ],
    buttonText: 'ライトを始める',
    buttonVariant: 'outline' as const,
    href: '/signup',
    popular: false,
    disabled: false,
  },
  {
    id: 'standard',
    name: 'スタンダード会員',
    price: 3300,
    period: '/月',
    description: 'AI前提の作業ルーティンを本格構築したい方',
    features: [
      '全ての会員記事（実践・運用系含む）',
      '全ツール使い放題',
      '月1テーマの実践ガイド（作業設計・収益導線）',
      'ダウンロード素材',
      '質問フォーム（月5回まで）',
    ],
    notIncluded: [],
    buttonText: 'スタンダードを始める',
    buttonVariant: 'primary' as const,
    href: '/signup',
    popular: true,
    disabled: false,
  },
  {
    id: 'premium',
    name: 'プレミアム会員',
    price: 5500,
    period: '/月',
    description: '個別伴走で自分仕様のAI環境を構築したい方',
    features: [
      'スタンダードの全内容',
      '月1回のオンライン伴走セッション（Zoom）',
      'あなた専用の作業設計レビュー（月1回）',
      '優先質問対応',
      '個別フィードバック（作業・収益導線の調整）',
    ],
    notIncluded: [],
    buttonText: '満員',
    buttonVariant: 'outline' as const,
    href: '#',
    popular: false,
    disabled: true,
  },
]

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero title="会員プラン" subtitle="無料で始めて、あなたのペースでアップグレード" />

        <section className="py-16">
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={'relative overflow-visible ' + (plan.popular ? 'border-emerald-800 border-2 shadow-lg' : '') + (plan.disabled ? ' opacity-60' : '')}
                  hover={false}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge variant="primary" size="md">人気</Badge>
                    </div>
                  )}
                  <CardContent className={plan.popular ? 'pt-10' : ''}>
                    <h3 className="text-xl font-bold text-center">{plan.name}</h3>
                    <div className="text-center my-4">
                      <span className="text-4xl font-bold">
                        {plan.price.toLocaleString()}円
                      </span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center mb-6">
                      {plan.description}
                    </p>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start text-sm">
                          <span className="text-green-500 mr-2 mt-0.5">&#10003;</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, i) => (
                        <div key={i} className="flex items-start text-sm text-gray-400">
                          <span className="mr-2 mt-0.5">-</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    {plan.disabled ? (
                      <Button variant="outline" fullWidth disabled>
                        {plan.buttonText}
                      </Button>
                    ) : (
                      <Link href={plan.href}>
                        <Button variant={plan.buttonVariant} fullWidth>
                          {plan.buttonText}
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 bg-gray-50">
          <Container>
            <SectionHeader title="年額プラン" subtitle="年払いで2ヶ月分お得" center />
            <div className="max-w-md mx-auto">
              <Card className="border-green-500 border-2">
                <CardContent>
                  <div className="text-center">
                    <Badge variant="success" size="md">お得</Badge>
                    <h3 className="text-xl font-bold mt-4">スタンダード年額</h3>
                    <div className="my-4">
                      <span className="text-4xl font-bold">33,000円</span>
                      <span className="text-gray-500">/年</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      月額換算 2,750円（通常3,300円）
                    </p>
                    <p className="text-green-600 font-medium mb-6">
                      年間6,600円お得！
                    </p>
                    <Link href="/signup">
                      <Button variant="primary" fullWidth>年額プランを始める</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <SectionHeader title="よくある質問" center />
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900">支払い方法は？</h3>
                <p className="mt-2 text-gray-600">クレジットカード（Visa、Mastercard、JCB、American Express）でお支払いいただけます。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900">いつでも解約できますか？</h3>
                <p className="mt-2 text-gray-600">はい、いつでも解約可能です。解約後も契約期間終了まではサービスをご利用いただけます。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900">プランの変更はできますか？</h3>
                <p className="mt-2 text-gray-600">はい、いつでもアップグレード・ダウングレードが可能です。</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900">返金はできますか？</h3>
                <p className="mt-2 text-gray-600">申し訳ございませんが、デジタルサービスの特性上、返金には対応しておりません。まずは無料会員でお試しください。</p>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-gray-950 text-white">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">まずは無料で始めましょう</h2>
              <p className="text-gray-400 mb-8">
                クレジットカード不要。メールアドレスだけで登録できます。
              </p>
              <Link href="/signup">
                <Button variant="white" size="lg">無料で登録する</Button>
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
