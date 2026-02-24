'use client'

export function DeadlineLabel({ deadline }: { deadline: string | null }) {
  if (!deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dl = new Date(deadline + 'T00:00:00')
  const diff = Math.ceil((dl.getTime() - today.getTime()) / 86400000)

  if (diff < 0) {
    return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-200 text-gray-500">{"締切済み"}</span>
  }
  if (diff <= 7) {
    return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white animate-pulse">{"締切間近！残り" + diff + "日"}</span>
  }
  if (diff <= 30) {
    return <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500 text-white">{"あと" + diff + "日"}</span>
  }
  return null
}
