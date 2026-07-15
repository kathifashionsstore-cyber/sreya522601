import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import { heroSlides, placeholderImages } from '../../data/seed'
import { useSiteSettings } from '../../context/SiteSettingsContext'

function resolveSecondaryLink(link, phone) {
  if (link?.startsWith('tel:')) return phone ? `tel:${phone}` : '/contact'
  return link || '/contact'
}

function HeroButton({ href, children, variant = 'primary' }) {
  const internal = href?.startsWith('/')
  const className =
    variant === 'primary'
      ? 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-btn-primary-bg)] px-5 py-2.5 text-sm font-black text-[var(--color-btn-primary-text)] shadow-soft transition hover:bg-brand-blue'
      : 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/80 bg-white/15 px-5 py-2.5 text-sm font-black text-white backdrop-blur transition hover:bg-white hover:text-brand-navy'

  if (internal) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

export function HeroSection({ variant = 'home', slides = heroSlides, badge, title, subtitle, image }) {
  const { settings } = useSiteSettings()
  const isHome = variant === 'home'
  const [index, setIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const activeSlides = useMemo(() => {
    const filtered = slides?.filter((slide) => slide.active !== false) || []
    return filtered.length ? filtered : heroSlides
  }, [slides])
  const pageSlide = {
    id: `${title || badge || 'page'}-banner`,
    imageUrl: image || placeholderImages.hero,
    altText: title || settings.hospitalName,
    badgeText: badge,
    title,
    subtitle,
    ctaText: null,
  }
  const carouselSlides = isHome ? activeSlides : [pageSlide]
  const current = carouselSlides[index % carouselSlides.length]
  const headline = current.title || title || settings.hospitalName
  const subheadline = current.subtitle || subtitle || settings.tagline
  const primaryText = current.ctaText || settings.utilityBar?.appointmentLabel || 'Book An Appointment'
  const primaryLink = current.ctaLink || settings.utilityBar?.appointmentLink || '/appointment'
  const secondaryText = current.secondaryCtaText || 'Call Now'
  const secondaryLink = resolveSecondaryLink(current.secondaryCtaLink, settings.phone)

  useEffect(() => {
    setIndex(0)
  }, [carouselSlides.length, isHome])

  useEffect(() => {
    if (!isHome || carouselSlides.length < 2) return undefined
    const timer = window.setInterval(() => setIndex((item) => (item + 1) % carouselSlides.length), 5000)
    return () => window.clearInterval(timer)
  }, [carouselSlides.length, isHome])

  function showPrevious() {
    setIndex((item) => (item - 1 + carouselSlides.length) % carouselSlides.length)
  }

  function showNext() {
    setIndex((item) => (item + 1) % carouselSlides.length)
  }

  function handleTouchEnd(event) {
    if (touchStart == null) return
    const delta = event.changedTouches[0].clientX - touchStart
    setTouchStart(null)
    if (Math.abs(delta) < 48) return
    if (delta > 0) showPrevious()
    else showNext()
  }

  return (
    <section
      className={`relative overflow-hidden bg-brand-ink ${isHome ? 'min-h-[74svh]' : 'min-h-[44svh]'}`}
      onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id || current.imageUrl || index}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={current.imageUrl || image || placeholderImages.hero}
            alt={current.altText || headline}
            className="h-full w-full object-cover"
            loading={isHome ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex min-h-[inherit] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl py-8 text-white"
        >
          {current.badgeText || badge ? (
            <span className="inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-normal text-white backdrop-blur">
              {current.badgeText || badge}
            </span>
          ) : null}
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">{headline}</h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/88 sm:text-lg">{subheadline}</p>
          {isHome ? (
            <div className="mt-7 flex flex-wrap gap-3">
              <HeroButton href={primaryLink}>
                {primaryText} <ArrowRight className="size-4" />
              </HeroButton>
              <HeroButton href={secondaryLink} variant="secondary">
                {secondaryText === 'Call Now' ? <Phone className="size-4" /> : null}
                {secondaryText}
              </HeroButton>
            </div>
          ) : (
            <div className="mt-7 flex flex-wrap items-center gap-2 text-sm font-bold text-white/75">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              <span>/</span>
              <span>{badge || headline}</span>
            </div>
          )}
        </motion.div>
      </div>

      {isHome && carouselSlides.length > 1 ? (
        <>
          <div className="absolute inset-y-0 right-5 hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={showPrevious}
              className="grid size-11 place-items-center rounded-full border border-white/45 bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-brand-navy"
              aria-label="Previous hero slide"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="grid size-11 place-items-center rounded-full border border-white/45 bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-brand-navy"
              aria-label="Next hero slide"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {carouselSlides.map((slide, slideIndex) => (
              <button
                key={slide.id || slide.imageUrl}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className={`h-2 rounded-full transition-all ${
                  slideIndex === index ? 'w-9 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'
                }`}
                aria-label={`Show hero slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
