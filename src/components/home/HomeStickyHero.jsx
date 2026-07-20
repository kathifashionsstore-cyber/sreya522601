import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { heroSlides as fallbackSlides } from '../../data/seed'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function HomeStickyHero() {
  const { settings } = useSiteSettings()
  const { data: dbSlides } = useFirestoreCollection('heroSlides', fallbackSlides)
  const slides = (dbSlides && dbSlides.length ? dbSlides : fallbackSlides).filter((slide) => slide.active !== false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Rotate slides every 3s unless paused or prefers-reduced-motion is active
  useEffect(() => {
    if (prefersReducedMotion || isPaused || !slides.length) return
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [prefersReducedMotion, isPaused, slides.length])

  if (!slides.length) return null

  const currentSlide = slides[activeSlide % slides.length] || slides[0]
  const fallbackHeroImage = '/hero-care-team.jpg'
  const heroImage = currentSlide.imageUrl || fallbackHeroImage

  return (
    <section
      className="relative w-full overflow-hidden border-b border-[#E5ECEB] bg-[#FFF8F2]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* DESKTOP SPLIT PANEL LAYOUT (lg screen) */}
      <div className="hidden lg:flex relative h-[520px] xl:h-[580px] w-full">
        {/* Left Column: Text & Content (~45% width, overlays z-10) */}
        <div className="w-[45%] h-full flex flex-col justify-between p-12 xl:p-16 z-20 bg-[#FFF8F2] relative pb-12">
          <div className="my-auto space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-5 text-left"
              >
                {currentSlide.badgeText && (
                  <span className="eyebrow-badge bg-[#E8CFCB]/50 text-[#173A38] border border-[#E8CFCB] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                    {currentSlide.badgeText}
                  </span>
                )}

                <h1 className="text-5xl xl:text-6xl font-black leading-[1.15] text-[#173A38] font-display max-w-lg">
                  {currentSlide.title}
                </h1>

                {currentSlide.subtitle && (
                  <p className="text-sm xl:text-base text-[#52656D] leading-relaxed max-w-md">
                    {currentSlide.subtitle}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Static Action Buttons */}
            <div className="pt-4 flex items-center gap-3">
              <Link
                to="/appointment"
                className="btn-primary-custom"
              >
                Book Appointment
              </Link>
              <a
                href={`tel:${settings.phoneMobile || settings.phone || '9390328255'}`}
                className="btn-secondary-custom"
              >
                Call Us Now
              </a>
            </div>
          </div>

          {/* Dot indicators positioned inside the left panel at the bottom */}
          {!prefersReducedMotion && slides.length > 1 && (
            <div className="flex gap-1.5 mt-auto">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-350 ${
                    idx === activeSlide ? 'w-5 bg-[#3F8F84]' : 'w-2 bg-[#E8CFCB] hover:bg-[#3F8F84]/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Image with Left Gradient Fade overlay (~58% width) */}
        <div className="absolute right-0 top-0 bottom-0 w-[58%] h-full z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 bg-cover bg-center h-full w-full"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          </AnimatePresence>

          {/* Elegant Left-to-Right Soft Gradient Fade overlay merging image into Warm Ivory panel */}
          <div className="absolute inset-y-0 left-0 w-[240px] bg-gradient-to-r from-[#FFF8F2] via-[#FFF8F2]/65 to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* MOBILE STACKED LAYOUT (sm/md screens) */}
      <div className="block lg:hidden w-full">
        {/* Top: Image Slider with bottom Gradient Fade mask */}
        <div className="relative w-full h-[38vh] min-h-[260px] max-h-[340px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 bg-cover bg-center h-full w-full"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          </AnimatePresence>

          {/* Soft Bottom-to-Top Gradient Fade overlay merging image into text panel */}
          <div className="absolute inset-x-0 bottom-0 h-[80px] bg-gradient-to-t from-[#FFF8F2] to-transparent z-10 pointer-events-none" />
        </div>

        {/* Bottom: Text & Content on Warm Ivory background */}
        <div className="px-6 py-8 sm:px-10 bg-[#FFF8F2] flex flex-col space-y-6">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-3 text-left"
              >
                {currentSlide.badgeText && (
                  <span className="eyebrow-badge bg-[#E8CFCB]/50 text-[#173A38] border border-[#E8CFCB] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                    {currentSlide.badgeText}
                  </span>
                )}

                <h1 className="text-3xl font-black leading-tight text-[#173A38] tracking-tight font-display">
                  {currentSlide.title}
                </h1>

                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-[#52656D] leading-relaxed">
                    {currentSlide.subtitle}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Static Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/appointment"
                className="btn-primary-custom w-full sm:w-auto text-center"
              >
                Book Appointment
              </Link>
              <a
                href={`tel:${settings.phoneMobile || settings.phone || '9390328255'}`}
                className="btn-secondary-custom w-full sm:w-auto text-center"
              >
                Call Us Now
              </a>
            </div>
          </div>

          {/* Dot Indicators centered at the bottom on mobile */}
          {!prefersReducedMotion && slides.length > 1 && (
            <div className="flex gap-1.5 justify-center pt-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-350 ${
                    idx === activeSlide ? 'w-5 bg-[#3F8F84]' : 'w-2 bg-[#E8CFCB] hover:bg-[#3F8F84]/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
