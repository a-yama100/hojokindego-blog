"use client"
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface MarkdownDisplayProps {
  content: string
  className?: string
}

function preprocessMarkdown(content: string): string {
  let processed = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  // Fix bold for Japanese text: CommonMark sometimes fails when closing **
  // is followed by Japanese chars without word boundary (e.g. **text**followed)
  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return processed
}

export function MarkdownDisplay({ content, className = '' }: MarkdownDisplayProps) {
  const processedContent = preprocessMarkdown(content)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = '.prose figure { margin-bottom: 0 !important; padding-bottom: 0 !important; } .prose figure + p { margin-top: 0 !important; padding-top: 0.25rem !important; text-align: center; font-size: 0.875rem; color: #6b7280; font-style: italic; line-height: 1.4; } .prose figure + p em { font-style: italic; }';
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG" && target.getAttribute("data-lightbox") === "true") {
        setLightboxSrc((target as HTMLImageElement).src)
      }
    }
    el.addEventListener("click", handler)
    return () => el.removeEventListener("click", handler)
  }, [])

  return (
    <>
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div ref={containerRef} className={'prose prose-lg max-w-none ' + className}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
            h2: ({ children }) => { const text = String(children).replace(/[*]/g, ""); const id = text.toLowerCase().replace(/[^a-z0-9\u3000-\u9fff\uff00-\uffef]+/g, "-").replace(/^-|-$/g, ""); return <h2 id={id} className="text-2xl font-bold mt-5 mb-3 pb-2 border-b border-gray-300">{children}</h2>; },
            h3: ({ children }) => { const text = String(children).replace(/[*]/g, ""); const id = text.toLowerCase().replace(/[^a-z0-9\u3000-\u9fff\uff00-\uffef]+/g, "-").replace(/^-|-$/g, ""); return <h3 id={id} className="text-xl font-bold mt-4 mb-2 pb-1 border-b border-gray-200">{children}</h3>; },
            p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            a: ({ href, children }) => <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
            code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>,
            pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
            th: ({ children }) => <th className="border border-gray-300 px-3 py-2 text-left font-semibold">{children}</th>,
            td: ({ children }) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
            strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            hr: () => <hr className="my-8 border-t border-gray-300" />,
            img: ({ src, alt, title }) => {
              const caption = title && title.startsWith("Caption:")
                ? title.replace("Caption:", "").trim()
                : title;
              return (
                <figure className="my-6 text-center">
                  <img
                    src={String(src || "")}
                    alt={String(alt || "")}
                    className="rounded-lg inline-block max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                    data-lightbox="true"
                  />
                  {caption && (
                    <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            },
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </>
  )
}
