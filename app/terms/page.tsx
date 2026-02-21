import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'

export const metadata: Metadata = {
  title: 'Terms of Service | Hojokindego',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gray-950 text-white py-12">
          <Container>
            <h1 className="text-3xl font-bold text-center">Terms of Service</h1>
          </Container>
        </section>
        <Container size="md" className="py-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">By using Hojokindego (hojokindego.com), you agree to these Terms of Service. If you do not agree, please do not use this service.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Nature of the Service</h2>
              <p className="text-gray-700">Hojokindego is an informational media site that summarizes publicly available Japanese government subsidy information. We do not provide application assistance, consulting services, or guarantee subsidy approval. All information is provided for reference only.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Accuracy of Information</h2>
              <p className="text-gray-700">Subsidy details including deadlines, eligibility requirements, and maximum amounts change frequently. We strive to keep information current but cannot guarantee accuracy at all times. Always verify details at the official government source linked on each page before making decisions.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. No Professional Advice</h2>
              <p className="text-gray-700">Information on this site does not constitute legal, financial, or business advice. For subsidy applications, consult a certified shindanshi (business consultant) or professional advisor.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
              <p className="text-gray-700">Original content on this site is our intellectual property. Government document content is summarized and linked to official sources - we do not reproduce full PDFs or official publications.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
              <p className="text-gray-700">Hojokindego is not liable for any damages resulting from reliance on information provided on this site, missed application deadlines, or unsuccessful subsidy applications.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Changes to Terms</h2>
              <p className="text-gray-700">We may update these terms at any time. Continued use constitutes acceptance.</p>
            </section>
            <p className="text-gray-500 text-sm">Last updated: January 2025</p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
