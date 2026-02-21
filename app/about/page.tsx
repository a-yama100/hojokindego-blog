import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { SectionHeader } from '@/components/SectionHeader'

export const metadata: Metadata = {
  title: 'About | Hojokindego',
  description: 'Learn about Hojokindego - the Japanese government subsidy search and comparison site.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-16">
          <Container>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">About Hojokindego</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">Making Japanese government subsidies accessible to every business owner</p>
            </div>
          </Container>
        </section>

        <Container size="md" className="py-16">
          <div className="space-y-12">
            <section>
              <SectionHeader title="What is Hojokindego?" />
              <p className="text-gray-700 leading-relaxed">
                Hojokindego is a subsidy search and comparison media site that helps Japanese business owners find and understand government grants and subsidies (Hojokin). We aggregate information from jGrants, Mirasapo Plus, and government ministry websites to give you a clear overview of available funding.
              </p>
            </section>

            <section>
              <SectionHeader title="What we offer" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Subsidy Search', desc: 'Browse subsidies filtered by category (IT, manufacturing, startup) and region (national, Tokyo, Osaka, etc.).' },
                  { title: 'Target Score', desc: 'Our proprietary 0-100 Target Score shows how accessible each subsidy is based on requirements and competition.' },
                  { title: 'Difficulty Rating', desc: 'Clear Easy / Medium / Hard labels help you prioritize which subsidies to pursue first.' },
                  { title: 'Official Links', desc: 'Every subsidy links directly to the official government source so you always have the most current information.' },
                ].map(item => (
                  <div key={item.title} className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="Important disclaimer" />
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Hojokindego is an informational media site. We summarize publicly available subsidy information and link to official sources. We do not reproduce PDFs or official documents in full. Subsidy details including deadlines, amounts, and requirements change frequently. Always verify current information at the official government website linked on each subsidy page. We are not affiliated with any government ministry or agency. The "Last verified" date shown on each page indicates when we last checked the information. We are not responsible for decisions made based on information on this site.
                </p>
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
