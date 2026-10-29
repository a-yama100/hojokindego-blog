import { InputHTMLAttributes, useId } from 'react'
import { FIELD_LIMITS } from '@/lib/security/limits'

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  onChange?: (value: string) => void
}

// 種類ごとの既定。呼び出し側で autoComplete・maxLength を渡せばそちらが優先される。
const AUTO: Record<string, string> = { email: 'email', tel: 'tel', url: 'url' }
const MAX: Record<string, number> = { email: FIELD_LIMITS.email, url: FIELD_LIMITS.url, tel: FIELD_LIMITS.phone, password: FIELD_LIMITS.password }

export function FormInput({ label, error, onChange, className = '', id, ...props }: FormInputProps) {
  const autoId = useId()
  const inputId = id || autoId
  const type = props.type || 'text'
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        autoComplete={AUTO[type]}
        maxLength={MAX[type] ?? FIELD_LIMITS.subject}
        className={'w-full px-4 py-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ' + (error ? 'border-red-500' : 'border-gray-300') + ' ' + className}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
