'use client'

interface DynamicActionButtonProps {
  hasInput: boolean
  onClear: () => void
  onLoad: () => void
  loadLabel?: string
  clearLabel?: string
}

export function DynamicActionButton({
  hasInput,
  onClear,
  onLoad,
  loadLabel = 'サンプルを入力',
  clearLabel = 'クリア',
}: DynamicActionButtonProps) {
  return (
    <button
      type="button"
      onClick={hasInput ? onClear : onLoad}
      className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer ${
        hasInput
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-700 hover:bg-green-800'
      }`}
    >
      {hasInput ? clearLabel : loadLabel}
    </button>
  )
}