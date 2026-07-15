import React from 'react'

export function Field({ label, hint, error, children }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-brand-ink">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-medium text-slate-500">{hint}</span> : null}
      {error ? <span className="text-xs font-bold text-rose-600">{error}</span> : null}
    </label>
  )
}

export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 ${className}`}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export const Textarea = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`min-h-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 ${className}`}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'

export const Select = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-ink outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
})

Select.displayName = 'Select'
