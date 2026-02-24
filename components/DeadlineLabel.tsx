'use client'

export function DeadlineLabel({ deadline, size = 'sm' }: { deadline: string | null; size?: 'sm' | 'lg' }) {
  if (!deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dl = new Date(deadline + 'T00:00:00')
  const diff = Math.ceil((dl.getTime() - today.getTime()) / 86400000)

  if (diff < 0) {
    return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-200 text-gray-500">{'締切済み'}</span>
  }

  const base = size === 'lg' ? 'px-4 py-2 rounded-lg text-sm' : 'px-2.5 py-1 rounded-md text-xs'

  if (diff === 0) {
    return <span className={base + ' font-bold bg-red-600 text-white animate-pulse shadow-lg shadow-red-200'}>{'!! 本日締切！'}</span>
  }
  if (diff <= 3) {
    return <span className={base + ' font-bold bg-red-600 text-white animate-pulse shadow-lg shadow-red-200'}>{'残り' + diff + '日！'}</span>
  }
  if (diff <= 7) {
    return <span className={base + ' font-bold bg-red-500 text-white shadow-md shadow-red-100'}>{'締切間近 残り' + diff + '日'}</span>
  }
  if (diff <= 14) {
    return <span className={base + ' font-bold bg-orange-500 text-white'}>{'残り' + diff + '日'}</span>
  }
  if (diff <= 30) {
    return <span className={base + ' font-bold bg-yellow-500 text-white'}>{'あと' + diff + '日'}</span>
  }
  return null
}
