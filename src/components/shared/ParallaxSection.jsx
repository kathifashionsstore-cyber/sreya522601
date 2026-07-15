import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxSection({ imageUrl, children, overlayOpacity = 0.55 }) {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      // Accessibility Check: skip scroll-scrub animations if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      // Animate background image y translation for clean, bug-free parallax scroll depth
      gsap.fromTo(
        bgRef.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      // Fade & rise content in as it approaches the viewport center
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 85%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[85vh] overflow-hidden">
      {/* Background container: set to 124% height and -top-[12%] to ensure zero gaps on translation */}
      <div
        ref={bgRef}
        className="absolute inset-x-0 -top-[12%] h-[124%] w-full bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(11, 37, 48, ${overlayOpacity}), rgba(11, 37, 48, ${overlayOpacity * 0.7}))`,
          }}
        />
      </div>

      {/* Content wrapper */}
      <div ref={contentRef} className="relative z-10 flex min-h-[85vh] items-center px-6 py-16 md:px-20">
        {children}
      </div>
    </section>
  )
}
