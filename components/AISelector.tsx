'use client'

export type AIProvider = 'chatgpt' | 'gemini' | 'claude'

interface AISelectorProps {
  value: AIProvider
  onChange: (provider: AIProvider) => void
  className?: string
}

const AI_OPTIONS: { value: AIProvider; label: string; description: string }[] = [
  { value: 'chatgpt', label: 'ChatGPT', description: 'GPT-4o Mini - 高速・万能型' },
  { value: 'gemini', label: 'Gemini', description: 'Gemini 2.5 Flash - 低コスト' },
  { value: 'claude', label: 'Claude', description: 'Claude Sonnet - 文脈理解型' },
]

export function AISelector({ value, onChange, className = '' }: AISelectorProps) {
  return (
    <div className={`space-y-2 ${className}`} style={{ textAlign: "center" }}>
      <label className="block text-sm font-medium text-gray-700 text-center">AI</label>
      <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
        {AI_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-3 rounded-lg border-2 text-center transition-all cursor-pointer ${
              value === option.value
                ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-sm">{option.label}</div>
            <div className="text-xs mt-1 opacity-75">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
