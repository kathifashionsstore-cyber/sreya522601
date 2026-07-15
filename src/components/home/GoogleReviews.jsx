import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { Star, MessageSquareCode, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

const fallbackReviewCards = [
  {
    author: 'Sreya patient',
    text: 'The team explained every step with patience and made our hospital visit feel clear and comfortable.',
    rating: 5,
  },
  {
    author: 'Sreya family',
    text: 'Doctor consultation, scans, and follow-up guidance were handled with care and good communication.',
    rating: 5,
  },
  {
    author: 'Sreya visitor',
    text: 'The staff were supportive, the process was organized, and appointment support was easy to understand.',
    rating: 5,
  },
  {
    author: 'Patient review',
    text: 'A calm and professional fertility care experience with clear next steps after the consultation.',
    rating: 5,
  },
]

function starsFor(rating) {
  const count = Number(rating || 5)
  return Math.min(Math.max(Number.isFinite(count) ? Math.round(count) : 5, 1), 5)
}

export function GoogleReviews() {
  const { settings } = useSiteSettings()
  const gSearchUrl = settings.googleReviewUrl || ''
  const rating = settings.googleRating || '4.8'
  const reviewCount = settings.googleReviewCount || '120'
  const reviews = useMemo(
    () => {
      const adminReviews = (Array.isArray(settings.googleReviews) ? settings.googleReviews : [])
        .filter((item) => item?.author && item?.text)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
      return adminReviews.length ? adminReviews : fallbackReviewCards
    },
    [settings.googleReviews],
  )
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || paused || reviews.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIdx((index) => (index + 1) % reviews.length)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [paused, reviews.length])

  const visibleReviews = Array.from({ length: Math.min(3, reviews.length) }, (_, offset) => reviews[(activeIdx + offset) % reviews.length])
  const fallbackReviewUrl = 'https://www.google.com/search?q=Sreya+Hospitals+IVF+Centre+Narasaraopet+reviews'
  const reviewHref = gSearchUrl || fallbackReviewUrl
  const writeHref = gSearchUrl
    ? gSearchUrl.includes('?')
      ? `${gSearchUrl}&lrd=0x3a4a750efaaaaaaa:0x9c3cf05206ab64a1,3,`
      : `${gSearchUrl}?lrd=0x3a4a750efaaaaaaa:0x9c3cf05206ab64a1,3,`
    : `${fallbackReviewUrl}&lrd=0x3a4a750efaaaaaaa:0x9c3cf05206ab64a1,3,`

  return (
    <section
      className="overflow-hidden bg-[var(--color-bg-base)] py-14 sm:py-20 border-b border-[var(--color-border)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-dark">
              Google Reviews
            </span>
            <h3 className="mt-3 font-display text-3xl font-black leading-tight text-brand-navy sm:text-4xl">
              Patient Voices & Experiences
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base font-medium">
              Read real patient testimonials regarding the treatment care and clinical attention received at Sreya.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white px-5 py-4 text-center shadow-soft">
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="mt-2 font-display text-3xl font-black text-brand-navy">{rating} / 5.0</p>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-0.5">
                {reviewCount}+ Verified Reviews
              </p>
          </div>
        </div>

        <div className="relative rounded-3xl border border-[var(--color-border)] bg-white/85 p-4 shadow-soft backdrop-blur sm:p-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="grid gap-4 md:grid-cols-3"
            >
              {visibleReviews.map((review, offset) => (
                <article
                  key={`${activeIdx}-${offset}-${review.author}`}
                  className="min-h-[220px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-base)] p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: starsFor(review.rating) }).map((_, index) => (
                          <Star key={index} className="size-4 fill-current" />
                        ))}
                      </div>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary-dark">
                        Google
                      </span>
                    </div>
                    <p className="mt-5 text-sm font-semibold leading-relaxed text-slate-700">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
                    {review.author}
                  </p>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex flex-col items-center gap-4">
            {reviews.length > 1 ? (
              <div className="flex items-center gap-2 w-full justify-start">
                <button
                  type="button"
                  onClick={() => setActiveIdx((index) => (index - 1 + reviews.length) % reviews.length)}
                  className="grid size-10 place-items-center rounded-full border border-[var(--color-border)] bg-white text-text-primary transition hover:border-primary hover:text-primary"
                  aria-label="Previous Google review"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIdx((index) => (index + 1) % reviews.length)}
                  className="grid size-10 place-items-center rounded-full border border-[var(--color-border)] bg-white text-text-primary transition hover:border-primary hover:text-primary"
                  aria-label="Next Google review"
                >
                  <ChevronRight className="size-4" />
                </button>
                <div className="ml-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                  <motion.span
                    key={activeIdx}
                    className="block h-full rounded-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: paused ? '55%' : '100%' }}
                    transition={{ duration: paused ? 0.15 : 2, ease: 'linear' }}
                  />
                </div>
              </div>
            ) : null}

            {/* CTA Prompt */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full border-t border-slate-100 pt-5 mt-2 gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs font-extrabold text-brand-navy">Consulted with Sreya Hospitals?</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Your honest experience helps other aspiring parents make informed clinical choices.</p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row shrink-0 w-full sm:w-auto">
                <a
                  href={reviewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-black text-brand-navy transition hover:bg-slate-50 hover:border-slate-300 shadow-sm w-full sm:w-auto"
                >
                  Read Reviews <ArrowUpRight className="size-3.5 text-brand-teal" />
                </a>
                <a
                  href={writeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-brand-rose px-5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-brand-rose-dark w-full sm:w-auto"
                >
                  Write A Review <MessageSquareCode className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
