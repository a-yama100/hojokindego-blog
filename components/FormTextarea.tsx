import { TextareaHTMLAttributes } from 'react'

interface FormTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  error?: string
  onChange?: (value: string) => void
}

export function FormTextarea({ label, error, onChange, className = '', ...props }: FormTextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={'w-full px-4 py-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y min-h-[100px] ' + (error ? 'border-red-500' : 'border-gray-300') + ' ' + className}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
