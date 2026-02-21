"use client"
import { useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
  locked: boolean
}

function extractHeadings(markdown: string, paywallIndex: number): TocItem[] {
  const headings: TocItem[] = []
  const lines = markdown.split('\n')
  let charPos = 0
  for (const line of lines) {
    const m2 = line.match(/^## (.+)/)
    const m3 = line.match(/^### (.+)/)
    if (m2 || m3) {
      const text = (m2 ? m2[1] : m3![1]).replace(/[*`]/g, '').trim()
      const id = text.toLowerCase().replace(/[^a-z0-9\u3000-\u9fff\uff00-\uffef]+/g, '-').replace(/^-|-$/g, '')
      const locked = paywallIndex >= 0 && charPos > paywallIndex
      headings.push({ id, text, level: m2 ? 2 : 3, locked })
    }
    charPos += line.length + 1
  }
  return headings
}

export function TableOfContents({ content, canAccess = true }: { content: string; canAccess?: boolean }) {
  const [open, setOpen] = useState(false)
  const paywallIndex = content.indexOf('<!-- paywall -->')
  const headings = extractHeadings(content, canAccess ? -1 : paywallIndex)
  if (headings.length < 2) return null
  const displayed = open ? headings : headings.slice(0, 8)
  return (
    <nav className="my-8 border border-gray-200 rounded-lg p-5 bg-gray-50">
      <p className="text-sm font-bold text-gray-700 mb-3">{"\u25bc \u76ee\u6b21"}</p>
      <ul className="space-y-2">
        {displayed.map((h, i) => (
          <li key={i} style={{ paddingLeft: h.level === 3 ? '1.25rem' : '0' }}>
            {h.locked ? (
              <a
                href="#paywall-message"
                className="text-sm text-gray-400 hover:text-blue-500 hover:underline block py-0.5 leading-relaxed"
              >
                {"\ud83d\udd12 "}{h.text}
              </a>
            ) : (
              <a
                href={'#' + h.id}
                className="text-sm text-gray-600 hover:text-blue-600 hover:underline block py-0.5 leading-relaxed"
              >
                {h.text}
              </a>
            )}
          </li>
        ))}
      </ul>
      {headings.length > 8 && !open && (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 text-sm text-gray-500 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 cursor-pointer"
        >
          {"\u3059\u3079\u3066\u8868\u793a"}
        </button>
      )}
    </nav>
  )
}
