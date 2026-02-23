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
    title: 'IT Introduction Subsidy (IT Donyu Hojokin)', category: 'digitalization', region: 'national',
    maxAmount: 4500000, difficulty: 'Medium', targetScore: 78, deadline: '2025-12-31',
    ministry: 'Ministry of Economy, Trade and Industry', officialUrl: 'https://www.it-hojo.jp/',
    summary: 'Supports SMEs adopting IT tools to improve productivity and business efficiency.',
    requirements: ['SME or small business', 'IT tool adoption plan', 'Registered with IT vendor list'],
    lastChecked: '2025-01-15',
  },
  'monodukuri-subsidy': {
    title: 'Monodukuri / Commerce / Service Subsidy', category: 'manufacturing', region: 'national',
    maxAmount: 12500000, difficulty: 'Hard', targetScore: 62, deadline: '2025-09-30',
    ministry: 'Ministry of Economy, Trade and Industry', officialUrl: 'https://portal.monodukuri-hojo.jp/',
    summary: 'Supports SMEs investing in innovative manufacturing equipment and processes.',
    requirements: ['Manufacturing SME', 'Innovation plan', 'Revenue growth target'],
    lastChecked: '2025-01-15',
  },
  'jizokuka-kyoka-subsidy': {
    title: 'Small Business Sustainability Subsidy (Jizokuka Kyoka)', category: 'general', region: 'national',
    maxAmount: 500000, difficulty: 'Easy', targetScore: 85, deadline: '2025-06-30',
    ministry: 'Japan Chamber of Commerce', officialUrl: 'https://r3.jizokukakyouka.go.jp/',
    summary: 'Broad subsidy for small businesses to improve sales channels, advertising, and operations.',
    requirements: ['Small business or sole proprietor', 'Business improvement plan', 'Not received recently'],
    lastChecked: '2025-01-15',
  },
  'saikouchiku-subsidy': {
    title: 'Business Reconstruction Subsidy (Jigyo Saikouchiku)', category: 'reconstruction', region: 'national',
    maxAmount: 150000000, difficulty: 'Hard', targetScore: 55, deadline: '2025-10-31',
    ministry: 'Ministry of Economy, Trade and Industry', officialUrl: 'https://jigyou-saikouchiku.go.jp/',
    summary: 'Large-scale subsidy for businesses pivoting to new business areas post-COVID.',
    requirements: ['Revenue decline due to COVID', 'New business category', 'Certified consultant required'],
    lastChecked: '2025-01-15',
  },
  'tokyo-startup-subsidy': {
    title: 'Tokyo Startup Support Grant', category: 'startup', region: 'tokyo',
    maxAmount: 3000000, difficulty: 'Medium', targetScore: 72, deadline: '2025-08-31',
    ministry: 'Tokyo Metropolitan Government', officialUrl: 'https://www.tokyo-startup.metro.tokyo.lg.jp/',
    summary: 'Supports new businesses starting up in Tokyo with grants for initial costs.',
    requirements: ['Starting business in Tokyo', 'Within 3 years of founding', 'Business plan approval'],
    lastChecked: '2025-01-15',
  },
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'text-green-700 bg-green-50 border-green-200',
  Medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  Hard: 'text-red-700 bg-red-50 border-red-200',
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Subsidy Not Found</h1>
            <div className="flex justify-center">
              <Link href="/subsidies"><Button variant="primary">Back to Subsidies</Button></Link>
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
            <p className="text-emerald-400 text-sm font-medium mb-2">Subsidy Details</p>
            <h1 className="text-2xl md:text-3xl font-bold">{s.title}</h1>
            <p className="text-gray-400 text-sm mt-2">{s.ministry}</p>
          </Container>
        </section>
        <Container className="py-8">
          <div className="flex justify-start mb-6">
            <Link href="/subsidies"><Button variant="outline" size="sm">Back to List</Button></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={'border-2 rounded-xl p-4 text-center ' + scoreBg}>
              <p className="text-xs text-gray-500 mb-1">Target Score</p>
              <p className={'text-3xl font-bold ' + scoreColor}>{s.targetScore}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Max Amount</p>
              <p className="text-lg font-bold text-emerald-700">{s.maxAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-400">JPY</p>
            </div>
            <div className={'border rounded-xl p-4 text-center ' + DIFFICULTY_COLOR[s.difficulty]}>
              <p className="text-xs mb-1">Difficulty</p>
              <p className="text-xl font-bold">{s.difficulty}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Deadline</p>
              <p className="text-sm font-bold text-gray-900">{s.deadline}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Overview</h2>
            <p className="text-gray-700">{s.summary}</p>
            <p className="text-xs text-gray-400 mt-4">Last verified: {s.lastChecked}. Always check the official source for the latest information.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Key Requirements</h2>
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Apply via Official Source</h3>
            <p className="text-gray-600 text-sm mb-4">Always confirm details and apply through the official government website.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition-colors">Official Website</a>
              <Link href="/subsidies"><Button variant="outline">Back to List</Button></Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
