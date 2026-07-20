import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { fallbackFacilities } from '../../mockData/facilities'

export function HomeFacilities() {
  const { data: dbFacilities } = useFirestoreCollection('facilities', fallbackFacilities)

  const activeFacilities = (dbFacilities && dbFacilities.length ? dbFacilities : fallbackFacilities)
    .filter((f) => f.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 4)

  return (
    <section className="bg-[var(--color-bg-base)] py-16 sm:py-24 border-b border-[var(--color-border)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#3F8F84] flex items-center justify-center gap-1.5">
            <Sparkles className="size-4 animate-pulse" /> Advanced Medical Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display mt-2">
            State-of-the-Art Facilities
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Take a look at our clinical workspaces, clean-room embryology laboratories, and premium patient recovery spaces.
          </p>
        </div>

        {/* Alternating Layout List */}
        <div className="space-y-20 max-w-5xl mx-auto">
          {activeFacilities.map((facility, index) => {
            const isEven = index % 2 === 0
            const imgUrl = facility.imageUrl || facility.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
            const altText = facility.images?.[0]?.altText || facility.title

            return (
              <div 
                key={facility.id || index}
                className="grid gap-10 md:grid-cols-2 items-center"
              >
                {/* Text Column */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6 }}
                  className={`space-y-4 ${!isEven ? 'md:order-2' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-[#087f8c]/20 font-display">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-black uppercase text-[#087f8c] tracking-widest">
                      {facility.category ? facility.category.toUpperCase() : 'FACILITY'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-brand-navy font-display leading-tight">
                    {facility.title}
                  </h3>
                  <div className="h-1 w-12 bg-[#087f8c] rounded" />
                  <p className="text-sm leading-relaxed text-slate-600 font-medium">
                    {facility.description}
                  </p>
                  
                  {/* Amenities tags */}
                  {Array.isArray(facility.amenities) && facility.amenities.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-[11px] font-black uppercase text-brand-navy tracking-wider mb-2">
                        Key Specifications:
                      </h4>
                      <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-600 font-semibold">
                        {facility.amenities.map((spec, aIdx) => (
                          <li key={aIdx} className="flex items-center gap-2">
                            <span className="size-1.5 shrink-0 rounded-full bg-[#087f8c]" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Image Column */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6 }}
                  className={`relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-soft border border-slate-100/50 bg-slate-900 group ${!isEven ? 'md:order-1' : ''}`}
                >
                  <img 
                    src={imgUrl} 
                    alt={altText} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Go to Facilities Button */}
        <div className="mt-16 text-center">
          <Link
            to="/facilities"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-black text-white hover:bg-primary-dark transition-all duration-300 shadow-md shadow-primary/20"
          >
            Explore All Facilities <ArrowRight className="size-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
