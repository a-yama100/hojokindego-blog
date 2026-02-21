import { Container } from '@/components/Container'

export default function Page({ params }: { params: { [key: string]: string } }) {
  return (
    <Container>
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Subsidy Details</h1>
        <p className="text-gray-600">Detailed information about this subsidy. Coming soon.</p>
      </div>
    </Container>
  )
}
