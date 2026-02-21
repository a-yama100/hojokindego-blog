import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: '利用規約',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="py-12 min-h-screen">
        <Container size="md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">最終更新日：2026年2月1日</p>

            <p>この利用規約（以下「本規約」）は、おとなのAI実践ラボ（以下「当サイト」）が提供するサービスの利用条件を定めるものです。ユーザーの皆さまには、本規約に同意いただいたうえで、当サイトのサービスをご利用いただきます。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第1条（適用）</h2>
            <p>本規約は、ユーザーと当サイトとの間のサービスの利用に関わる一切の関係に適用されるものとします。当サイトが別途定める個別規定やガイドラインは、本規約の一部を構成するものとします。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第2条（会員登録）</h2>
            <p>登録希望者が当サイトの定める方法によって会員登録を申請し、当サイトがこれを承認することで、会員登録が完了するものとします。当サイトは、以下の場合に登録を拒否することがあります。</p>
            <p>（1）登録情報に虚偽の内容が含まれていた場合</p>
            <p>（2）過去に本規約に違反したことがある場合</p>
            <p>（3）その他、当サイトが会員登録を適当でないと判断した場合</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第3条（有料サービス）</h2>
            <p>有料サービスの料金は、当サイトの料金ページに定めるとおりとします。ユーザーは、当サイトが指定する支払方法により、利用料金を支払うものとします。お支払い後の返金には原則として対応いたしません。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第4条（解約）</h2>
            <p>有料会員は、いつでも解約することができます。解約後も、契約期間の終了日までサービスをご利用いただけます。契約期間の途中で解約された場合も、日割り計算による返金は行いません。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第5条（禁止事項）</h2>
            <p>ユーザーは、以下の行為を行ってはなりません。</p>
            <p>（1）法令または公序良俗に違反する行為</p>
            <p>（2）犯罪行為に関連する行為</p>
            <p>（3）当サイトのコンテンツを無断で複製、転載、販売する行為</p>
            <p>（4）当サイトのサービスの運営を妨害する行為</p>
            <p>（5）他のユーザーに迷惑をかける行為</p>
            <p>（6）不正アクセスやなりすまし行為</p>
            <p>（7）その他、当サイトが不適切と判断する行為</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第6条（コンテンツの著作権）</h2>
            <p>当サイトが提供するコンテンツ（テキスト、画像、動画、ソースコード、テンプレート等）の著作権は、当サイトまたは正当な権利を有する第三者に帰属します。ユーザーは、個人的な使用目的に限り、コンテンツを利用することができます。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第7条（免責事項）</h2>
            <p>当サイトは、サービスに事実上または法律上の瑕疵がないことを保証するものではありません。当サイトのサービスの利用により生じたいかなる損害についても、当サイトは一切の責任を負いません。ただし、当サイトとユーザーとの間の契約が消費者契約法に定める消費者契約に該当する場合、この免責規定は適用されません。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第8条（サービス内容の変更等）</h2>
            <p>当サイトは、ユーザーに通知することなく、サービスの内容を変更しまたはサービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第9条（利用規約の変更）</h2>
            <p>当サイトは、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。変更後の利用規約は、当サイト上に掲載した時点で効力を生じるものとします。</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 pb-2 border-b border-gray-300">第10条（準拠法・裁判管轄）</h2>
            <p>本規約の解釈にあたっては、日本法を準拠法とします。当サイトに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
