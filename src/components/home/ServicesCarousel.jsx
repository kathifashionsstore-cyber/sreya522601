import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { subServices as fallbackSubServices, getServiceUrl, getLockedSubServices } from '../../mockData/services'
import {
  EmbryoIcon,
  HeartsIcon,
  UterusIcon,
  OvumIcon,
  SpermIcon,
  PreservationIcon,
  OvulationCalendarIcon,
  DnaIcon,
} from '../shared/FertilityIcons'

const selectorIconMap = {
  ivf: EmbryoIcon,
  iui: SpermIcon,
  icsi: OvumIcon,
  'fertility-preservation': PreservationIcon,
  'donor-programs': HeartsIcon,
  surrogacy: UterusIcon,
  'laparoscopic-surgeries': DnaIcon,
  'hysteroscopic-surgeries': DnaIcon,
  'ovulation-induction': OvulationCalendarIcon,
}

export function ServicesCarousel() {
  const { data: dbSubServices } = useFirestoreCollection('subServices', [])
  const allSubServices = getLockedSubServices(dbSubServices)

  const carouselItems = useMemo(() => {
    const featured = allSubServices.filter((s) => s.featured === true && s.active !== false)
    const treatments = allSubServices.filter((s) => s.category === 'fertility-treatments' && s.active !== false)

    // Merge featured ones first, then add non-featured ones to fill up to 9 items
    const merged = [...featured]
    treatments.forEach((service) => {
      if (!merged.some((m) => m.id === service.id || m.slug === service.slug)) {
        merged.push(service)
      }
    })

    return merged
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return (a.order || 0) - (b.order || 0)
      })
      .slice(0, 9)
  }, [allSubServices])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [visibleCards, setVisibleCards] = useState(3)
  const [translateMultiplier, setTranslateMultiplier] = useState(33.333)
  const pauseTimeoutRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3)
        setTranslateMultiplier(33.333)
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2)
        setTranslateMultiplier(50)
      } else {
        setVisibleCards(1)
        setTranslateMultiplier(82) // 82% translates by single card width on mobile for 1.2 cards peek
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, carouselItems.length - visibleCards)

  // Auto-advance logic every 2 seconds
  useEffect(() => {
    if (isPaused || carouselItems.length <= visibleCards) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 2000)
    return () => clearInterval(timer)
  }, [isPaused, carouselItems.length, visibleCards, maxIndex])

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    }
  }, [])

  const triggerTemporaryPause = () => {
    setIsPaused(true)
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 5000) // Resume auto-sliding after 5s of inactivity
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    triggerTemporaryPause()
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
    triggerTemporaryPause()
  }

  const handleDotClick = (idx) => {
    setCurrentIndex(idx)
    triggerTemporaryPause()
  }

  // Mobile Swipe events
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsPaused(true)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
    triggerTemporaryPause()
  }

  if (!carouselItems.length) return null

  return (
    <section className="bg-[#173A38] py-16 sm:py-24 border-b border-[#E5ECEB]/10 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#D8B26E]">
              Explore Our Pathways
            </span>
            <h2 className="text-white text-section-heading font-display">
              Select a Service to Know More
            </h2>
          </div>

          {/* Navigation Arrows (Hidden on mobile) */}
          {carouselItems.length > visibleCards && (
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="grid size-10 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white transition shadow-sm"
                aria-label="Previous service"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={handleNext}
                className="grid size-10 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white transition shadow-sm"
                aria-label="Next service"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Window */}
        <div
          className="relative overflow-visible cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * translateMultiplier}%)` }}
          >
            {carouselItems.map((service) => {
              const Icon = selectorIconMap[service.slug] || DnaIcon
              const servicePhoto = service.heroImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
              const categoryLabel = service.category === 'fertility-treatments' ? 'Fertility Treatment' : 'Fertility Testing'

              return (
                <div
                  key={service.slug}
                  className="w-[82%] sm:w-1/2 lg:w-1/3 shrink-0 px-3"
                >
                  {/* Premium White Card on Dark background */}
                  <div className="card-premium p-5 flex flex-col justify-between h-full group bg-white border border-[#E5ECEB]">
                    <div>
                      {/* Photo Container with Biology Badge */}
                      <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden mb-4 bg-stone-100 border border-slate-100">
                        <img
                          src={servicePhoto}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        {Icon && (
                          <div className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-[#F5F9F8] text-[#3F8F84] shadow border border-[#E5ECEB] z-10">
                            <Icon className="size-4.5" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <span className="text-[10px] font-black text-[#3F8F84] uppercase tracking-wider">
                        {categoryLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-[#173A38] font-display mt-1 tracking-tight line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#52656D] leading-relaxed mt-2.5 line-clamp-2 min-h-[2.5rem]">
                        {service.shortDescription}
                      </p>
                    </div>

                    {/* View Details Link */}
                    <div className="mt-4 pt-3 border-t border-[#E5ECEB]">
                      <Link
                        to={getServiceUrl(service)}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#3F8F84] hover:text-[#2C645D] transition"
                      >
                        View Details <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pagination Dots (Only show if total slides exceed viewport capacity) */}
        {carouselItems.length > visibleCards && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-5 bg-[#3F8F84]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* See All Services Button */}
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-6 py-2.5 text-sm font-black text-white hover:bg-white hover:text-[#173A38] transition shadow-sm"
          >
            See All Services <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
