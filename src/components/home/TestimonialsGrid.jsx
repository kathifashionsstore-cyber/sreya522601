import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Quote, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { testimonials as fallbackTestimonials } from '../../data/seed'

function getYoutubeId(url) {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}

export function TestimonialsGrid({ layout = 'grid', showViewAll = true }) {
  const { data: dbTestimonials } = useFirestoreCollection('testimonials', fallbackTestimonials)
  const rawItems = dbTestimonials && dbTestimonials.length ? dbTestimonials : fallbackTestimonials
  const items = rawItems
    .filter((item) => item.active !== false && item.consentConfirmed !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const { settings } = useSiteSettings()
  const copy = settings.testimonialSection || {}
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-rotate slider layout every 6 seconds
  useEffect(() => {
    if (layout !== 'slider' || isPaused || !items.length) return
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [layout, isPaused, items.length])

  if (!items.length) return null

  const activeItem = items[activeIdx % items.length] || items[0]

  if (layout === 'slider') {
    const videoId = getYoutubeId(activeItem.youtubeUrl)
    return (
      <section 
        className="bg-brand-cream/35 py-16 sm:py-24 border-b border-[var(--color-border)] relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-primary">
            {copy.eyebrow || 'Success Stories'}
          </span>
          <h2 className="text-3xl font-black text-brand-navy mt-2 mb-12 sm:text-4xl font-display">
            {copy.title || 'What Our Patients Say'}
          </h2>

          {/* Slider Frame */}
          <div className="relative min-h-[380px] lg:min-h-[300px] flex items-center justify-center max-w-4xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-soft">
            
            {/* Left Chevron */}
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev - 1 + items.length) % items.length)}
              className="absolute left-2 sm:left-4 z-20 grid size-10 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-brand-navy hover:bg-brand-blush hover:text-primary transition shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Right Chevron */}
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev + 1) % items.length)}
              className="absolute right-2 sm:right-4 z-20 grid size-10 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-brand-navy hover:bg-brand-blush hover:text-primary transition shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-5" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full grid gap-8 lg:grid-cols-12 items-center text-left px-8 sm:px-10"
              >
                {/* Left side: Story Copy */}
                <div className={`${videoId ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: Number(activeItem.rating || 5) }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current text-amber-500" />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="size-12 text-brand-rose/10 absolute -top-4 -left-4 pointer-events-none" />
                    <blockquote className="relative z-10 text-base sm:text-lg font-medium text-text-primary leading-relaxed italic pl-4">
                      &ldquo;{activeItem.story}&rdquo;
                    </blockquote>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-border)]/50">
                    <p className="text-sm font-black uppercase tracking-wider text-brand-navy">
                      {activeItem.patientName || 'Anonymous'}
                    </p>
                    <p className="text-[10px] text-brand-rose uppercase tracking-wider font-bold mt-0.5">
                      {activeItem.treatmentReceived || 'Fertility Treatment'} · Verified Journey
                    </p>
                  </div>
                </div>

                {/* Right side: Video Player (If has video) */}
                {videoId && (
                  <div className="lg:col-span-5 w-full">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md bg-black border border-[var(--color-border)]">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                        title={`Patient video testimonial by ${activeItem.patientName}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot Indicators */}
          {items.length > 1 && (
            <div className="mt-8 flex justify-center gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-350 ${
                    idx === (activeIdx % items.length) ? 'w-6 bg-primary' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {showViewAll && (
            <div className="mt-10">
              <Link
                to="/success-stories"
                className="inline-flex items-center gap-1.5 text-sm font-black text-primary hover:text-primary-dark transition"
              >
                {copy.viewAllLabel || 'Read All Success Stories'} &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Grid layout (e.g. for /success-stories page)
  return (
    <section className="bg-brand-cream/10 py-16 border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => {
            const videoId = getYoutubeId(item.youtubeUrl)
            return (
              <article
                key={item.id || idx}
                className="flex flex-col justify-between rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 shadow-soft hover:shadow-md transition duration-200"
              >
                <div className="space-y-4">
                  {videoId ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner mb-2 border border-[var(--color-border)]">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                        title={`Patient video testimonial by ${item.patientName}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-0.5 text-amber-500">
                        {Array.from({ length: Number(item.rating || 5) }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-current text-amber-500" />
                        ))}
                      </div>
                      <Quote className="size-8 text-brand-rose/10" />
                    </div>
                  )}
                  
                  <blockquote className="text-sm font-medium text-text-secondary leading-relaxed italic pl-1">
                    &ldquo;{item.story}&rdquo;
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]/50 mt-6">
                  <p className="text-xs font-black uppercase tracking-wider text-brand-navy">
                    {item.patientName || 'Anonymous'}
                  </p>
                  <p className="text-[9px] text-brand-rose uppercase tracking-wider font-bold mt-0.5">
                    {item.treatmentReceived || 'Fertility Treatment'} · Verified Journey
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
