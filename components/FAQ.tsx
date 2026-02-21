'use client'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
  className?: string
}

export function FAQ({ items, className = '' }: FAQProps) {
  return (
    <div className={'space-y-4 ' + className}>
      {items.map((item, index) => (
        <details
          key={index}
          className="group bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
            <span>{item.question}</span>
            <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </span>
          </summary>
          <div className="px-6 pb-4 text-gray-600 leading-relaxed">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  )
}

interface FAQJsonLdProps {
  items: FAQItem[]
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
