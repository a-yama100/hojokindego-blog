"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface RelatedTool {
  tool_id: string
  name: string
  category: string
}

export function RelatedTools({ toolId, category }: { toolId: string; category: string }) {
  const [tools, setTools] = useState<RelatedTool[]>([])

  useEffect(() => {
    if (!category) return
    fetch('/api/tools/related?toolId=' + encodeURIComponent(toolId) + '&category=' + encodeURIComponent(category))
      .then(res => res.json())
      .then(data => setTools(data.tools || []))
      .catch(() => {})
  }, [toolId, category])

  if (tools.length === 0) return null

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-green-700 mb-4 text-center">関連ツール</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.tool_id}
            href={'/tools/' + tool.tool_id}
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-full hover:bg-green-800 transition-colors"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
