import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/Button'
import Link from 'next/link'

const SUBSIDIES = [
  { slug: 'it-introduction-subsidy', title: 'IT Introduction Subsidy', category: 'digitalization', region: 'national', maxAmount: 4500000, difficulty: 'Medium', targetScore: 78, deadline: '2025-12-31' },
  { slug: 'monodukuri-subsidy', title: 'Monodukuri & Shokuba Improvement Subsidy', category: 'manufacturing', region: 'national', maxAmount: 12500000, difficulty: 'Hard', targetScore: 62, deadline: '2025-09-30' },
  { slug: 'jizokuka-kyoka-subsidy', title: 'Jizokuka Kyoka Subsidy', category: 'general', region: 'national', maxAmount: 500000, difficulty: 'Easy', targetScore: 85, deadline: '2025-06-30' },
  { slug: 'saikouchiku-subsidy', title: 'Business Reconstruction Subsidy', category: 'reconstruction', region: 'national', maxAmount: 150000000, difficulty: 'Hard', targetScore: 55, deadline: '2025-10-31' },
  { slug: 'tokyo-startup-subsidy', title: 'Tokyo Startup Support Grant', category: 'startup', region: 'tokyo', maxAmount: 3000000, difficulty: 'Medium', targetScore: 72, deadline: '2025-08-31' },
]
const CATEGORIES: Record<string, { label: string; color: string }> = {
  digitalization: { label: 'Digitalization / IT', color: 'bg-blue-100 text-blue-800' },
  manufacturing: { label: 'Manufacturing', color: 'bg-orange-100 text-orange-800' },
  general: { label: 'General Business', color: 'bg-green-100 text-green-800' },
  reconstruction: { label: 'Business Reconstruction', color: 'bg-purple-100 text-purple-800' },
  startup: { label: 'Startup', color: 'bg-pink-100 text-pink-800' },
}
const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'text-green-700 bg-green-50',
  Medium: 'text-yellow-700 bg-yellow-50',
  Hard: 'text-red-700 bg-red-50',
}

export default function SubsidiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-10">
          <Container>
            <div className="text-center">
              <p className="text-emerald-400 text-sm font-medium mb-1">Subsidy Search</p>
              <h1 className="text-3xl md:text-4xl font-bold">Find Your Subsidy</h1>
              <p className="text-gray-400 text-sm mt-2">Browse Japanese government subsidies for businesses</p>
            </div>
          </Container>
        </section>

        <Container className="py-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Link href="/subsidies" className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-700 text-white">All</Link>
            {Object.entries(CATEGORIES).map(([slug, cat]) => (
              <Link key={slug} href={'/category/' + slug} className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-emerald-400 transition-colors">
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Subsidy list */}
          <div className="space-y-4 mb-10">
            {SUBSIDIES.map(s => (
              <Link key={s.slug} href={'/subsidies/' + s.slug} className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-400 hover:shadow-md transition-all">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (CATEGORIES[s.category]?.color || 'bg-gray-100 text-gray-700')}>
                        {CATEGORIES[s.category]?.label || s.category}
                      </span>
                      <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + DIFFICULTY_COLOR[s.difficulty]}>
                        {s.difficulty}
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-base mb-1">{s.title}</h2>
                    <p className="text-xs text-gray-500">Deadline: {s.deadline} | Region: {s.region}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500 mb-0.5">Max Amount</p>
                    <p className="text-lg font-bold text-emerald-700">{s.maxAmount.toLocaleString()} JPY</p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Score </span>
                      <span className={'text-lg font-bold ' + (s.targetScore >= 75 ? 'text-green-700' : s.targetScore >= 55 ? 'text-yellow-600' : 'text-red-600')}>{s.targetScore}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help Applying?</h3>
            <p className="text-gray-600 text-sm mb-4">Our guides and tools help you understand requirements and prepare your application.</p>
            <div className="flex justify-center">
              <Link href="/blog"><Button variant="primary">Read Our Guides</Button></Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
