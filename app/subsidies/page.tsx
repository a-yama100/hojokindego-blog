import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { Button } from '@/components/Button'
import Link from 'next/link'

const SUBSIDIES = [
  { slug: 'it-introduction-subsidy', title: 'IT Introduction Subsidy', category: 'digitalization', region: 'national', maxAmount: 4500000, difficulty: 'Medium', targetScore: 78, deadline: '2025-12-31' },
  { slug: 'monodukuri-subsidy', title: 'Monodukuri / Commerce / Service Subsidy', category: 'manufacturing', region: 'national', maxAmount: 12500000, difficulty: 'Hard', targetScore: 62, deadline: '2025-09-30' },
  { slug: 'jizokuka-kyoka-subsidy', title: 'Small Business Sustainability Subsidy', category: 'general', region: 'national', maxAmount: 500000, difficulty: 'Easy', targetScore: 85, deadline: '2025-06-30' },
  { slug: 'saikouchiku-subsidy', title: 'Business Reconstruction Subsidy', category: 'reconstruction', region: 'national', maxAmount: 150000000, difficulty: 'Hard', targetScore: 55, deadline: '2025-10-31' },
  { slug: 'tokyo-startup-subsidy', title: 'Tokyo Startup Support Grant', category: 'startup', region: 'tokyo', maxAmount: 3000000, difficulty: 'Medium', targetScore: 72, deadline: '2025-08-31' },
]

const CATEGORIES: Record<string, { label: string; color: string }> = {
  digitalization: { label: 'IT / Digital', color: 'bg-blue-100 text-blue-800' },
  manufacturing: { label: 'Manufacturing', color: 'bg-orange-100 text-orange-800' },
  general: { label: 'General Business', color: 'bg-green-100 text-green-800' },
  reconstruction: { label: 'Reconstruction', color: 'bg-purple-100 text-purple-800' },
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
              <h1 className="text-3xl md:text-4xl font-bold">Find the Right Subsidy for Your Business</h1>
              <p className="text-gray-400 text-sm mt-2">Government grants and subsidies for SMEs and sole proprietors</p>
            </div>
          </Container>
        </section>
        <Container className="py-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <Link href="/subsidies" className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-700 text-white">All</Link>
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
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{s.region === "national" ? "National" : s.region}</span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h2>
                      <p className="text-sm text-gray-500">Max: {(s.maxAmount / 10000).toLocaleString()}man JPY / Deadline: {s.deadline}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-xs text-gray-500">Target Score</p>
                      <div className={"text-3xl font-black " + scoreColor}>{s.targetScore}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">More subsidies coming soon. Premium members get deadline alerts and personalized matches.</p>
            <Link href="/pricing"><Button variant="outline">View Plans</Button></Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
