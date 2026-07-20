import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Seo } from '../components/shared/Seo'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { fallbackFacilities } from '../mockData/facilities'

// Custom Parallax media block to move images slightly on scroll
function ParallaxMedia({ facility }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Maps the scroll progress to a translate Y value (subtle parallax)
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40])

  const mainImage = facility.imageUrl || facility.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'

  return (
    <div 
      ref={ref} 
      className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-soft border border-slate-100/50 bg-slate-900 aspect-[16/10] sm:aspect-[16/9]"
    >
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {facility.videoUrl ? (
          <video
            src={facility.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={mainImage}
            alt={facility.images?.[0]?.altText || facility.title}
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}

export default function Facilities() {
  const { settings } = useSiteSettings()
  const { data: dbFacilities } = useFirestoreCollection('facilities', fallbackFacilities)
  
  const items = (dbFacilities && dbFacilities.length ? dbFacilities : fallbackFacilities)
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <>
      <Seo
        title="Hospital Facilities & Infrastructure"
        description="Explore the state-of-the-art medical facilities, advanced embryology IVF labs, and patient recovery rooms at Sreya Hospitals."
      />
      
      {/* Hero Intro Block with Teal Gradient Overlay */}
      <div className="relative overflow-hidden bg-brand-ink py-24 sm:py-36 text-center text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80"
            alt="Sreya Facilities"
            className="w-full h-full object-cover opacity-25"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[#087f8c]/75 to-brand-ink mix-blend-multiply" 
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 text-primary-light px-3 py-1 text-xs font-black tracking-wider uppercase mx-auto">
            Our Infrastructure
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
            Our Facilities
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Take a tour of our specialized diagnostic labs, ICMR-compliant IVF cleanrooms, and premium recovery rooms built for your absolute comfort.
          </p>
        </div>
      </div>

      {/* Editorial Showcase Story Section */}
      <div className="bg-brand-cream py-16 sm:py-24 space-y-20 sm:space-y-32 overflow-hidden">
        {items.map((facility, index) => {
          const isEven = index % 2 === 0
          
          return (
            <div key={facility.id} className="space-y-16 sm:space-y-28">
              {index > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <hr className="border-slate-200/60" />
                </div>
              )}
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 items-center">
                  
                  {/* Media block (60% width on desktop -> col-span-7) */}
                  <div className={`lg:col-span-7 ${!isEven ? 'lg:order-2' : ''}`}>
                    <ParallaxMedia facility={facility} />
                  </div>

                  {/* Text block (40% width on desktop -> col-span-5) */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`lg:col-span-5 space-y-5 sm:space-y-6 ${!isEven ? 'lg:order-1' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-extrabold text-[#087f8c]/20 font-display">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs font-black uppercase text-[#087f8c] tracking-widest">
                        {facility.category ? facility.category.toUpperCase() : 'FACILITY'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-brand-navy font-display leading-tight">
                      {facility.title}
                    </h2>

                    <div className="h-1 w-12 bg-[#087f8c] rounded" />

                    <p className="text-sm leading-relaxed text-slate-600 font-medium">
                      {facility.description}
                    </p>

                    {/* Amenities Specs */}
                    {facility.amenities && facility.amenities.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-black uppercase text-brand-navy tracking-wider mb-3">
                          Key Specifications:
                        </h4>
                        <ul className="grid gap-2.5 sm:grid-cols-2 text-xs text-slate-500 font-bold">
                          {facility.amenities.map((spec, sIdx) => (
                            <li key={sIdx} className="flex items-center gap-2">
                              <span className="size-1.5 shrink-0 rounded-full bg-[#087f8c]" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>

                </div>
              </div>
            </div>
          )
        })}

        {/* End of Section: Centered Pill Button with Hover Fill Animation */}
        <div className="flex justify-center pt-8 pb-12">
          <Link
            to="/gallery?category=facilities"
            className="relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-[#087f8c] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-[#087f8c] transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-[#087f8c]/20 group z-10"
          >
            <span className="absolute inset-0 bg-[#087f8c] transition-transform duration-300 origin-left transform scale-x-0 group-hover:scale-x-100 -z-10" />
            Explore All Facilities
          </Link>
        </div>
      </div>
    </>
  )
}

