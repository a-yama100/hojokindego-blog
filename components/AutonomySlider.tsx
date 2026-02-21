'use client'

interface AutonomySliderProps {
  value: number
  onChange: (level: number) => void
  className?: string
}

const LEVEL_LABELS: Record<number, string> = {
  1: '1 - 指示通りに忠実に実行',
  2: '2 - 必要に応じて軽い補足',
  3: '3 - バランス型（おすすめ）',
  4: '4 - 積極的に提案・分析',
  5: '5 - 最も自律的・創造的',
}

export function AutonomySlider({ value, onChange, className = '' }: AutonomySliderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">AIの自律度</label>
        <span className="text-sm text-gray-500">{value}/5</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
      />
      <p className="text-xs text-gray-500">{LEVEL_LABELS[value]}</p>
    </div>
  )
}
