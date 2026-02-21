import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'Privacy Policy | Hojokindego',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-12">
          <Container>
            <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
          </Container>
        </section>
        <Container size="md" className="py-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-gray-700">We collect account registration data (email, username), contact form submissions, and anonymized usage analytics including which subsidy pages and categories you view.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-700">We use your information to provide the service, improve subsidy data relevance, respond to support requests, and send service updates. We do not sell personal data to third parties.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Storage</h2>
              <p className="text-gray-700">Data is stored securely via Supabase (PostgreSQL). We retain account data while your account is active. You may request deletion at any time through our contact page.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cookies</h2>
              <p className="text-gray-700">We use essential cookies for authentication and session management. Analytics cookies help us understand which subsidy categories are most useful. You may disable cookies in your browser settings.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
              <p className="text-gray-700">We use Vercel for hosting and Supabase for data storage. External links to government sites and official subsidy portals are governed by their own privacy policies.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-gray-700">You may request access to, correction of, or deletion of your personal data by contacting us through our contact page.</p>
            </section>
            <p className="text-gray-500 text-sm">Last updated: January 2025</p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
