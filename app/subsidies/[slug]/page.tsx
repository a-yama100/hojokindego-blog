import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import Link from 'next/link'

const SUBSIDIES: Record<string, {
  title: string; category: string; region: string; maxAmount: number
  difficulty: string; targetScore: number; deadline: string
  ministry: string; officialUrl: string; summary: string
  requirements: string[]; lastChecked: string
}> = {
  'it-introduction-subsidy': {
    title: 'IT\u5c0e\u5165\u88dc\u52a9\u91d1', category: 'digitalization', region: 'national',
    maxAmount: 4500000, difficulty: '\u666e\u901a', targetScore: 78, deadline: '2025-12-31',
    ministry: '\u7d4c\u6e08\u7523\u696d\u7701', officialUrl: 'https://www.it-hojo.jp/',
    summary: '\u4e2d\u5c0f\u4f01\u696d\u304cIT\u30c4\u30fc\u30eb\u3092\u5c0e\u5165\u3057\u3001\u751f\u7523\u6027\u5411\u4e0a\u3084\u696d\u52d9\u52b9\u7387\u5316\u3092\u56f3\u308b\u305f\u3081\u306e\u88dc\u52a9\u91d1\u3067\u3059\u3002',
    requirements: ['\u4e2d\u5c0f\u4f01\u696d\u307e\u305f\u306f\u5c0f\u898f\u6a21\u4e8b\u696d\u8005', 'IT\u30c4\u30fc\u30eb\u5c0e\u5165\u8a08\u753b\u304c\u5fc5\u8981', 'IT\u30d9\u30f3\u30c0\u30fc\u30ea\u30b9\u30c8\u306b\u767b\u9332\u6e08\u307f\u3067\u3042\u308b\u3053\u3068'],
    lastChecked: '2025-01-15',
  },
  'monodukuri-subsidy': {
    title: '\u3082\u306e\u3065\u304f\u308a\u30fb\u5546\u696d\u30fb\u30b5\u30fc\u30d3\u30b9\u88dc\u52a9\u91d1', category: 'manufacturing', region: 'national',
    maxAmount: 12500000, difficulty: '\u96e3\u3057\u3044', targetScore: 62, deadline: '2025-09-30',
    ministry: '\u7d4c\u6e08\u7523\u696d\u7701', officialUrl: 'https://portal.monodukuri-hojo.jp/',
    summary: '\u4e2d\u5c0f\u4f01\u696d\u304c\u9769\u65b0\u7684\u306a\u88fd\u9020\u8a2d\u5099\u3084\u30d7\u30ed\u30bb\u30b9\u306b\u6295\u8cc7\u3059\u308b\u305f\u3081\u306e\u88dc\u52a9\u91d1\u3067\u3059\u3002',
    requirements: ['\u88fd\u9020\u696d\u306e\u4e2d\u5c0f\u4f01\u696d', '\u9769\u65b0\u8a08\u753b\u304c\u5fc5\u8981', '\u58f2\u4e0a\u6210\u9577\u76ee\u6a19\u306e\u8a2d\u5b9a'],
    lastChecked: '2025-01-15',
  },
  'jizokuka-kyoka-subsidy': {
    title: '\u5c0f\u898f\u6a21\u4e8b\u696d\u8005\u6301\u7d9a\u5316\u88dc\u52a9\u91d1', category: 'general', region: 'national',
    maxAmount: 500000, difficulty: '\u7c21\u5358', targetScore: 85, deadline: '2025-06-30',
    ministry: '\u5546\u5de5\u4f1a\u8b70\u6240', officialUrl: 'https://r3.jizokukakyouka.go.jp/',
    summary: '\u5c0f\u898f\u6a21\u4e8b\u696d\u8005\u304c\u8ca9\u8def\u62e1\u5927\u3001\u5e83\u544a\u3001\u696d\u52d9\u6539\u5584\u306a\u3069\u306b\u5e45\u5e83\u304f\u6d3b\u7528\u3067\u304d\u308b\u88dc\u52a9\u91d1\u3067\u3059\u3002',
    requirements: ['\u5c0f\u898f\u6a21\u4e8b\u696d\u8005\u307e\u305f\u306f\u500b\u4eba\u4e8b\u696d\u4e3b', '\u4e8b\u696d\u6539\u5584\u8a08\u753b\u304c\u5fc5\u8981', '\u76f4\u8fd1\u3067\u53d7\u7d66\u3057\u3066\u3044\u306a\u3044\u3053\u3068'],
    lastChecked: '2025-01-15',
  },
  'saikouchiku-subsidy': {
    title: '\u4e8b\u696d\u518d\u69cb\u7bc9\u88dc\u52a9\u91d1', category: 'reconstruction', region: 'national',
    maxAmount: 150000000, difficulty: '\u96e3\u3057\u3044', targetScore: 55, deadline: '2025-10-31',
    ministry: '\u7d4c\u6e08\u7523\u696d\u7701', officialUrl: 'https://jigyou-saikouchiku.go.jp/',
    summary: '\u30b3\u30ed\u30ca\u5f8c\u306b\u65b0\u4e8b\u696d\u5206\u91ce\u3078\u8ee2\u63db\u3059\u308b\u4f01\u696d\u5411\u3051\u306e\u5927\u578b\u88dc\u52a9\u91d1\u3067\u3059\u3002',
    requirements: ['\u30b3\u30ed\u30ca\u306b\u3088\u308b\u58f2\u4e0a\u6e1b\u5c11\u304c\u3042\u308b\u3053\u3068', '\u65b0\u305f\u306a\u4e8b\u696d\u30ab\u30c6\u30b4\u30ea\u3078\u306e\u53c2\u5165', '\u8a8d\u5b9a\u652f\u63f4\u6a5f\u95a2\u306e\u78ba\u8a8d\u304c\u5fc5\u8981'],
    lastChecked: '2025-01-15',
  },
  'tokyo-startup-subsidy': {
    title: '\u6771\u4eac\u90fd\u5275\u696d\u52a9\u6210\u91d1', category: 'startup', region: 'tokyo',
    maxAmount: 3000000, difficulty: '\u666e\u901a', targetScore: 72, deadline: '2025-08-31',
    ministry: '\u6771\u4eac\u90fd', officialUrl: 'https://www.tokyo-startup.metro.tokyo.lg.jp/',
    summary: '\u6771\u4eac\u90fd\u5185\u3067\u65b0\u305f\u306b\u8d77\u696d\u3059\u308b\u4e8b\u696d\u8005\u3092\u652f\u63f4\u3059\u308b\u52a9\u6210\u91d1\u3067\u3059\u3002',
    requirements: ['\u6771\u4eac\u90fd\u5185\u3067\u306e\u5275\u696d', '\u5275\u696d\u304b\u30893\u5e74\u4ee5\u5185', '\u4e8b\u696d\u8a08\u753b\u306e\u627f\u8a8d\u304c\u5fc5\u8981'],
    lastChecked: '2025-01-15',
  },
}

const DIFFICULTY_COLOR: Record<string, string> = {
  '\u7c21\u5358': 'text-green-700 bg-green-50 border-green-200',
  '\u666e\u901a': 'text-yellow-700 bg-yellow-50 border-yellow-200',
  '\u96e3\u3057\u3044': 'text-red-700 bg-red-50 border-red-200',
}

export async function generateStaticParams() {
  return Object.keys(SUBSIDIES).map(slug => ({ slug }))
}

export default async function SubsidyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = SUBSIDIES[slug]
  if (!s) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Container className="py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{"\u88dc\u52a9\u91d1\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093"}</h1>
            <div className="flex justify-center">
              <Link href="/subsidies"><Button variant="primary">{"\u88dc\u52a9\u91d1\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    )
  }
  const scoreColor = s.targetScore >= 75 ? 'text-green-700' : s.targetScore >= 55 ? 'text-yellow-600' : 'text-red-600'
  const scoreBg = s.targetScore >= 75 ? 'bg-green-50 border-green-300' : s.targetScore >= 55 ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-10">
          <Container>
            <p className="text-emerald-400 text-sm font-medium mb-2">{"\u88dc\u52a9\u91d1\u8a73\u7d30"}</p>
            <h1 className="text-2xl md:text-3xl font-bold">{s.title}</h1>
            <p className="text-gray-400 text-sm mt-2">{s.ministry}</p>
          </Container>
        </section>
        <Container className="py-8">
          <div className="flex justify-start mb-6">
            <Link href="/subsidies"><Button variant="outline" size="sm">{"\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={'border-2 rounded-xl p-4 text-center ' + scoreBg}>
              <p className="text-xs text-gray-500 mb-1">{"\u30bf\u30fc\u30b2\u30c3\u30c8\u30b9\u30b3\u30a2"}</p>
              <p className={'text-3xl font-bold ' + scoreColor}>{s.targetScore}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{"\u4e0a\u9650\u984d"}</p>
              <p className="text-lg font-bold text-emerald-700">{(s.maxAmount / 10000).toLocaleString()}{"\u4e07\u5186"}</p>
            </div>
            <div className={'border rounded-xl p-4 text-center ' + DIFFICULTY_COLOR[s.difficulty]}>
              <p className="text-xs mb-1">{"\u96e3\u6613\u5ea6"}</p>
              <p className="text-xl font-bold">{s.difficulty}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{"\u7de0\u5207"}</p>
              <p className="text-sm font-bold text-gray-900">{s.deadline}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{"\u6982\u8981"}</h2>
            <p className="text-gray-700">{s.summary}</p>
            <p className="text-xs text-gray-400 mt-4">{"\u6700\u7d42\u78ba\u8a8d\u65e5: "}{s.lastChecked}{"\u3002\u6700\u65b0\u60c5\u5831\u306f\u5fc5\u305a\u516c\u5f0f\u30b5\u30a4\u30c8\u3067\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002"}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{"\u4e3b\u306a\u8981\u4ef6"}</h2>
            <ul className="space-y-2">
              {s.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-gray-700 text-sm">{req}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{"\u516c\u5f0f\u30b5\u30a4\u30c8\u304b\u3089\u7533\u8acb"}</h3>
            <p className="text-gray-600 text-sm mb-4">{"\u8a73\u7d30\u306f\u5fc5\u305a\u516c\u5f0f\u30b5\u30a4\u30c8\u3067\u78ba\u8a8d\u306e\u4e0a\u3001\u7533\u8acb\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition-colors">{"\u516c\u5f0f\u30b5\u30a4\u30c8\u3078"}</a>
              <Link href="/subsidies"><Button variant="outline">{"\u4e00\u89a7\u306b\u623b\u308b"}</Button></Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
