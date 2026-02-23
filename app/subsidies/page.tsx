import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/Button'
import Link from 'next/link'

const SUBSIDIES = [
  { slug: 'it-introduction-subsidy', title: 'IT\u5c0e\u5165\u88dc\u52a9\u91d1', category: 'digitalization', region: 'national', maxAmount: 4500000, difficulty: '\u666e\u901a', targetScore: 78, deadline: '2025-12-31' },
  { slug: 'monodukuri-subsidy', title: '\u3082\u306e\u3065\u304f\u308a\u30fb\u5546\u696d\u30fb\u30b5\u30fc\u30d3\u30b9\u88dc\u52a9\u91d1', category: 'manufacturing', region: 'national', maxAmount: 12500000, difficulty: '\u96e3\u3057\u3044', targetScore: 62, deadline: '2025-09-30' },
  { slug: 'jizokuka-kyoka-subsidy', title: '\u5c0f\u898f\u6a21\u4e8b\u696d\u8005\u6301\u7d9a\u5316\u88dc\u52a9\u91d1', category: 'general', region: 'national', maxAmount: 500000, difficulty: '\u7c21\u5358', targetScore: 85, deadline: '2025-06-30' },
  { slug: 'saikouchiku-subsidy', title: '\u4e8b\u696d\u518d\u69cb\u7bc9\u88dc\u52a9\u91d1', category: 'reconstruction', region: 'national', maxAmount: 150000000, difficulty: '\u96e3\u3057\u3044', targetScore: 55, deadline: '2025-10-31' },
  { slug: 'tokyo-startup-subsidy', title: '\u6771\u4eac\u90fd\u5275\u696d\u52a9\u6210\u91d1', category: 'startup', region: 'tokyo', maxAmount: 3000000, difficulty: '\u666e\u901a', targetScore: 72, deadline: '2025-08-31' },
]

const CATEGORIES: Record<string, { label: string; color: string }> = {
  digitalization: { label: 'IT\u30fb\u30c7\u30b8\u30bf\u30eb\u5316', color: 'bg-blue-100 text-blue-800' },
  manufacturing: { label: '\u88fd\u9020\u696d\u30fb\u3082\u306e\u3065\u304f\u308a', color: 'bg-orange-100 text-orange-800' },
  general: { label: '\u4e00\u822c\u4e8b\u696d', color: 'bg-green-100 text-green-800' },
  reconstruction: { label: '\u4e8b\u696d\u518d\u69cb\u7bc9', color: 'bg-purple-100 text-purple-800' },
  startup: { label: '\u5275\u696d\u30fb\u30b9\u30bf\u30fc\u30c8\u30a2\u30c3\u30d7', color: 'bg-pink-100 text-pink-800' },
}

const DIFFICULTY_COLOR: Record<string, string> = {
  '\u7c21\u5358': 'text-green-700 bg-green-50',
  '\u666e\u901a': 'text-yellow-700 bg-yellow-50',
  '\u96e3\u3057\u3044': 'text-red-700 bg-red-50',
}

export default function SubsidiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-10">
          <Container>
            <div className="text-center">
              <p className="text-emerald-400 text-sm font-medium mb-1">{"\u88dc\u52a9\u91d1\u691c\u7d22"}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{"\u3042\u306a\u305f\u306b\u5408\u3063\u305f\u88dc\u52a9\u91d1\u3092\u898b\u3064\u3051\u3088\u3046"}</h1>
              <p className="text-gray-400 text-sm mt-2">{"\u4e2d\u5c0f\u4f01\u696d\u30fb\u500b\u4eba\u4e8b\u696d\u4e3b\u5411\u3051\u306e\u88dc\u52a9\u91d1\u30fb\u52a9\u6210\u91d1\u4e00\u89a7"}</p>
            </div>
          </Container>
        </section>
        <Container className="py-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <Link href="/subsidies" className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-700 text-white">{"\u3059\u3079\u3066"}</Link>
            {Object.entries(CATEGORIES).map(([slug, cat]) => (
              <Link key={slug} href={"/category/" + slug} className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="space-y-4">
            {SUBSIDIES.map((s) => {
              const cat = CATEGORIES[s.category]
              const diffClass = DIFFICULTY_COLOR[s.difficulty] || ""
              const scoreColor = s.targetScore >= 75 ? "text-green-700" : s.targetScore >= 50 ? "text-yellow-600" : "text-red-600"
              return (
                <Link key={s.slug} href={"/subsidies/" + s.slug} className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {cat && <span className={"px-2 py-0.5 rounded text-xs font-medium " + cat.color}>{cat.label}</span>}
                        <span className={"px-2 py-0.5 rounded text-xs font-medium " + diffClass}>{s.difficulty}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{s.region === "national" ? "\u5168\u56fd" : s.region}</span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h2>
                      <p className="text-sm text-gray-500">{"\u4e0a\u9650\u984d: "}{(s.maxAmount / 10000).toLocaleString()}{"\u4e07\u5186 / \u7de0\u5207: "}{s.deadline}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-xs text-gray-500">{"\u30bf\u30fc\u30b2\u30c3\u30c8\u30b9\u30b3\u30a2"}</p>
                      <div className={"text-3xl font-black " + scoreColor}>{s.targetScore}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">{"\u4eca\u5f8c\u3055\u3089\u306b\u591a\u304f\u306e\u88dc\u52a9\u91d1\u3092\u8ffd\u52a0\u4e88\u5b9a\u3067\u3059\u3002\u30d7\u30ec\u30df\u30a2\u30e0\u4f1a\u54e1\u306f\u7de0\u5207\u30a2\u30e9\u30fc\u30c8\u3084\u696d\u7a2e\u5225\u304a\u3059\u3059\u3081\u3092\u3054\u5229\u7528\u3044\u305f\u3060\u3051\u307e\u3059\u3002"}</p>
            <Link href="/pricing"><Button variant="outline">{"\u4f1a\u54e1\u30d7\u30e9\u30f3\u3092\u898b\u308b"}</Button></Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
