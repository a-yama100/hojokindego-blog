import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'
import { FAQ, FAQJsonLd } from '@/components/FAQ'
import { AdBanner } from '@/components/AdBanner'

const faqItems = [
  { question: 'What is Hojokin de Go?', answer: 'Hojokin de Go is a search and comparison tool for Japanese government subsidies and grants. We aggregate data from jGrants, ministry sites, and local governments to help businesses find funding.' },
  { question: 'Who can use Japanese subsidies?', answer: 'Most subsidies target SMEs, sole proprietors, and startups registered in Japan. Some are open to specific industries, regions, or business sizes. Our filters help you find matching programs.' },
  { question: 'What is the Opportunity Score?', answer: 'Our proprietary 0-100 score combines acceptance rate, competition level, deadline proximity, and grant amount to help you prioritize which subsidies to apply for first.' },
  { question: 'How current is the data?', answer: 'We check official sources daily and display a Last Confirmed date on every listing. Expired subsidies are automatically hidden.' },
  { question: 'Can you help me apply?', answer: 'We do not handle applications directly, but we link to official application pages and partner with certified consultants (gyoseishoshi, sharo-shi) who specialize in subsidy applications.' },
  { question: 'Is it free?', answer: 'Basic search and subsidy listings are free. Premium members get deadline alerts, industry-matched recommendations, acceptance rate analytics, and priority consultant matching.' },
]

const ministries = [
  { name: 'METI', full: 'Ministry of Economy, Trade and Industry', focus: 'IT, manufacturing, innovation' },
  { name: 'MHLW', full: 'Ministry of Health, Labour and Welfare', focus: 'Employment, training, workplace' },
  { name: 'JTA', full: 'Japan Tourism Agency', focus: 'Tourism, hospitality, inbound' },
  { name: 'MOE', full: 'Ministry of the Environment', focus: 'Green energy, sustainability' },
  { name: 'Digital', full: 'Digital Agency', focus: 'DX, digitalization, IT adoption' },
  { name: 'Local', full: 'Prefectural & Municipal', focus: 'Region-specific programs' },
]

export default function Home() {
  return (
    <>
      <FAQJsonLd items={faqItems} />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 py-8 md:py-12">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-yellow-400 font-bold mb-4 tracking-wide">
                Hojokin de Go!
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Find the Right Subsidy<br />
                <span className="text-emerald-400">Before the Deadline Passes</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium">
                Search, compare, and apply for Japanese government grants and subsidies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/subsidies" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 shadow-lg text-lg transition-colors">
                  Search Subsidies
                </Link>
                <Link href="/blog" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-white border-2 border-white hover:bg-white/10 text-lg transition-colors">
                  Read Guides
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Ad Banner Top */}
        <div className="py-4 bg-white">
          <Container>
            <AdBanner siteId="hojokindego" position="top" />
          </Container>
        </div>

        {/* Shock Section */}
        <section className="py-16 md:py-20 bg-emerald-800">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                Billions in subsidies go unclaimed every year.
              </h2>
              <p className="text-lg md:text-xl text-emerald-100 mb-8 leading-relaxed">
                The money is there. Most businesses just do not know how to find it.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/15 backdrop-blur rounded-xl p-6 border border-white/20">
                  <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-2">3,000+</div>
                  <p className="text-white text-sm">Active subsidy programs across national and local governments in Japan.</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-6 border border-white/20">
                  <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-2">60%</div>
                  <p className="text-white text-sm">Of eligible SMEs never apply because they do not know the subsidy exists.</p>
                </div>
                <div className="bg-white/15 backdrop-blur rounded-xl p-6 border border-white/20">
                  <div className="text-4xl md:text-5xl font-black text-yellow-300 mb-2">10M+</div>
                  <p className="text-white text-sm">Yen in average grant amount for popular SME subsidy programs.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Problem Section */}
        <section className="py-16 md:py-20 bg-gray-900">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
                Sound familiar?
              </h2>
              <p className="text-gray-400 text-center mb-10">Finding subsidies should not be harder than running your business.</p>
              <div className="space-y-4">
                {[
                  'You heard about a subsidy but the deadline had already passed',
                  'You spent hours on jGrants but could not find anything relevant',
                  'You found a subsidy but could not tell if your business qualifies',
                  'You wanted to apply but the process seemed too complex',
                  'You do not know which subsidies have high acceptance rates',
                  'You missed a local government program because it was not on any portal',
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

        {/* Solution Section */}
        <section className="py-16 md:py-20 bg-emerald-700">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
                Hojokin de Go finds the right subsidies for you.
              </h2>
              <p className="text-emerald-200 text-center mb-10">Search by industry, region, and business size. Get scored recommendations.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">1</div>
                  <h3 className="font-bold text-white text-lg mb-2">Smart Search & Filters</h3>
                  <p className="text-emerald-100 text-sm">Filter by ministry, region, industry, business size, and deadline. Find matching subsidies in seconds.</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">2</div>
                  <h3 className="font-bold text-white text-lg mb-2">Opportunity Score (0-100)</h3>
                  <p className="text-emerald-100 text-sm">Acceptance rate + competition + deadline proximity + grant amount = one number to prioritize your applications.</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">3</div>
                  <h3 className="font-bold text-white text-lg mb-2">Deadline Tracking</h3>
                  <p className="text-emerald-100 text-sm">Never miss a deadline. Sorted by urgency with automatic expiry. Premium members get email alerts.</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-emerald-500">
                  <div className="text-3xl mb-3 text-emerald-300 font-bold">4</div>
                  <h3 className="font-bold text-white text-lg mb-2">Consultant Matching</h3>
                  <p className="text-emerald-100 text-sm">Connect with certified gyoseishoshi and consultants who specialize in subsidy applications.</p>
                </div>
              </div>
              <div className="flex justify-center mt-10">
                <Link href="/subsidies" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 shadow-lg text-lg transition-colors">
                  Search Subsidies Free
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Ministries */}
        <section className="py-16 bg-gray-50">
          <Container>
            <SectionHeader
              title="Data Sources"
              subtitle="Aggregated from national and local government programs"
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

        {/* Disclaimer */}
        <section className="py-8 bg-amber-50">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-amber-800 text-xs">
                Disclaimer: Hojokin de Go aggregates publicly available subsidy information for reference purposes. Always verify details on official government sites before applying. We are not responsible for changes in subsidy terms or application outcomes.
              </p>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-700 to-emerald-900">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Your next subsidy could be one search away.
              </h2>
              <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                3,000+ programs. Updated daily. Free to search.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/subsidies" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 shadow-lg text-lg transition-colors">
                  Search Subsidies Free
                </Link>
                <Link href="/pricing" className="inline-block px-8 py-4 text-center rounded-lg font-bold text-white border-2 border-white hover:bg-white/10 text-lg transition-colors">
                  View Premium Plans
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <SectionHeader title="Frequently Asked Questions" center />
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
