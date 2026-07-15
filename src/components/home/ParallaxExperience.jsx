import { useEffect, useRef, useState } from 'react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function ParallaxExperience() {
  const { settings } = useSiteSettings()
  const exp = settings.parallaxExperience || {}

  const bgPhoto = exp.imageUrl || 'https://images.unsplash.com/photo-1579156286657-41d3d68aa0a9?auto=format&fit=crop&w=1600&q=80'
  const badgeText = exp.badgeText || 'Proven Clinical Leadership'
  const title = exp.title || 'Pioneering Fertility Breakthroughs in Narasaraopet'
  const body = exp.body || 'Guided by Dr. Vasanta Kiran Mekala, Sreya has spent nearly two decades bringing state-of-the-art reproductive science and transparent IVF practices to the Palnadu region.'

  const yearsTarget = settings.practicingSinceYear ? (new Date().getFullYear() - settings.practicingSinceYear) : 17
  
  const rawParentsTarget = settings.heroStats?.find(s => s.iconKey === 'Baby' || s.label?.includes('IVF') || s.label?.includes('Case'))?.value || '2000'
  const parentsTarget = parseInt(rawParentsTarget.replace(/[^0-9]/g, ''), 10) || 2000

  const yearsStat = settings.heroStats?.find(s => s.iconKey === 'Award') || {}
  const parentsStat = settings.heroStats?.find(s => s.iconKey === 'Baby' || s.label?.includes('IVF') || s.label?.includes('Case')) || {}

  const yearsLabel = yearsStat.label || 'Years of Infertility Specialisation'
  const parentsLabel = parentsStat.label || 'Aspiring Parents Guided'

  const containerRef = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [yearsCount, setYearsCount] = useState(0)
  const [parentsCount, setParentsCount] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.25 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isInView) return

    let currentYears = 0
    let currentParents = 0

    const timer = setInterval(() => {
      let updated = false
      if (currentYears < yearsTarget) {
        currentYears += 1
        setYearsCount(currentYears)
        updated = true
      }
      if (currentParents < parentsTarget) {
        currentParents += Math.ceil(parentsTarget / 40)
        if (currentParents > parentsTarget) {
          currentParents = parentsTarget
        }
        setParentsCount(currentParents)
        updated = true
      }

      if (!updated) {
        clearInterval(timer)
      }
    }, 35)

    return () => clearInterval(timer)
  }, [isInView, yearsTarget, parentsTarget])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[50vh] flex items-center justify-center overflow-hidden py-24 text-white bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgPhoto})` }}
    >
      {/* Deep brown overlay to fit the Motherhood & Hope dark base */}
      <div className="absolute inset-0 bg-brand-ink/90 backdrop-blur-[2px] z-0" />

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center space-y-12">
        <div className="space-y-4">
          {badgeText && (
            <span className="text-xs font-black uppercase tracking-widest text-primary-light">
              {badgeText}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
            {title}
          </h2>
          <p className="text-slate-350 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed opacity-90">
            {body}
          </p>
        </div>

        {/* Counter chips */}
        <div className="grid gap-8 sm:grid-cols-2 max-w-2xl mx-auto pt-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 space-y-2 shadow-lg">
            <p className="text-5xl sm:text-6xl font-black text-accent-gold font-display tracking-tight">
              {yearsCount}+
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-300">
              {yearsLabel}
            </p>
            <p className="text-[11px] text-slate-400 leading-normal">
              {yearsTarget}+ years of clinical cycles, scan assessments & embryology oversight
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 space-y-2 shadow-lg">
            <p className="text-5xl sm:text-6xl font-black text-accent-gold font-display tracking-tight">
              {parentsCount.toLocaleString()}+
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-300">
              {parentsLabel}
            </p>
            <p className="text-[11px] text-slate-400 leading-normal">
              Empowering couples across Palnadu District with hope and ethical clarity
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

