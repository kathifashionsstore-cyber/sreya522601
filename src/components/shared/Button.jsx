import { forwardRef } from 'react'

const variants = {
  primary: 'bg-[linear-gradient(135deg,var(--color-btn-primary-bg),var(--color-primary-dark))] text-[var(--color-btn-primary-text)] shadow-soft hover:shadow-lift',
  secondary: 'bg-[var(--color-btn-secondary-bg)] text-brand-navy border border-[var(--color-btn-secondary-border)] hover:border-brand-teal hover:text-brand-teal',
  ghost: 'bg-transparent text-brand-navy hover:bg-white/70',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
}

export const Button = forwardRef(function Button(
  { as: Component = 'button', variant = 'primary', className = '', children, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
})
