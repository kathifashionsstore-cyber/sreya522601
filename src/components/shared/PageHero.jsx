import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

function CtaLink({ cta }) {
  if (!cta?.label || !cta?.href) return null

  const className =
    'inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-black text-white shadow-lg transition hover:bg-primary-dark'

  if (cta.href.startsWith('/')) {
    return (
      <Link to={cta.href} className={className}>
        {cta.label}
      </Link>
    )
  }

  return (
    <a href={cta.href} className={className}>
      {cta.label}
    </a>
  )
}

export function PageHero({
  badge,
  title,
  subtitle,
  image,
  breadcrumb,
  cta,
  imageAlt,
}) {
  const crumb = breadcrumb || badge || title

  return (
    <section className="relative flex h-[420px] items-center justify-center overflow-hidden bg-brand-ink text-white sm:h-[500px] lg:h-[600px]">
      {image ? (
        <img
          src={image}
          alt={imageAlt || title || crumb || 'Sreya Hospitals page hero'}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, var(--color-hero-overlay-start), var(--color-hero-overlay-end))',
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 py-20 text-center sm:py-24 lg:py-[120px]">
        <nav className="mb-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 sm:text-sm">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span>{crumb}</span>
        </nav>
        {badge ? (
          <span className="mb-4 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/80 backdrop-blur">
            {badge}
          </span>
        ) : null}
        <h1 className="max-w-5xl text-[36px] font-bold leading-tight text-white sm:text-5xl lg:text-[56px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-[650px] text-base font-normal leading-7 text-white/[0.92] sm:text-xl sm:leading-8">
            {subtitle}
          </p>
        ) : null}
        {cta ? (
          <div className="mt-8">
            <CtaLink cta={cta} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
