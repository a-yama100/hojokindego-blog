'use client'
import { useId } from 'react'

// 個人情報の取り扱いへの同意（個人情報保護法）。
// 受け口（API）でも consent が true かを確かめるので、画面だけ外しても送れない。
export function ConsentCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  return (
    <div className="flex items-start gap-2 text-sm text-gray-700">
      <input
        id={id}
        name="consent"
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4"
      />
      <label htmlFor={id}>
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">プライバシーポリシー</a>
        に同意し、ご連絡のために入力内容を利用することを承諾します（必須）
      </label>
    </div>
  )
}
