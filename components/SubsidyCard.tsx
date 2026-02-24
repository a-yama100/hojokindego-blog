import Link from 'next/link'
import { SubsidyData, CATEGORIES, DIFFICULTY_COLOR, REGIONS } from '@/data/subsidies'
import { DeadlineLabel } from '@/components/DeadlineLabel'

export function SubsidyCard({ s }: { s: SubsidyData }) {
  const cat = s.category ? CATEGORIES[s.category] : null
  const diffClass = s.difficulty ? (DIFFICULTY_COLOR[s.difficulty] || '') : ''
  const score = s.target_score || 0
  const scoreColor = score >= 75 ? 'text-green-700' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
  const regionLabel = s.region ? (REGIONS[s.region] || s.region) : ''
  const amt = s.max_amount || 0
  return (
    <Link href={'/subsidies/' + s.slug} className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {cat && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + cat.color}>{cat.label}</span>}
            {s.difficulty && <span className={'px-2 py-0.5 rounded text-xs font-medium ' + diffClass}>{s.difficulty}</span>}
            {regionLabel && <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{regionLabel}</span>}
            <DeadlineLabel deadline={s.deadline} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h2>
          <p className="text-sm text-gray-500">{"上限額: "}{(amt / 10000).toLocaleString()}{"万円"}{s.deadline ? " / 締切: " + s.deadline : ""}</p>
          {s.summary && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{s.summary}</p>}
        </div>
        <div className="text-center md:text-right flex-shrink-0">
          <p className="text-xs text-gray-500">{"スコア"}</p>
          <div className={'text-3xl font-black ' + scoreColor}>{score}</div>
        </div>
      </div>
    </Link>
  )
}
