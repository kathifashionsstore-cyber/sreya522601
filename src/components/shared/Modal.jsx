import { X } from 'lucide-react'

export function Modal({ open, title, children, onClose, className = '' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-brand-ink/50 p-4 backdrop-blur-sm">
      <div className={`max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-5 shadow-soft ${className}`}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-brand-navy">{title}</h2>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
