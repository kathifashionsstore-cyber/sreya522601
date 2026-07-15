import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { gallery as fallbackGallery } from '../../data/seed'

export function HomepageGallery() {
  const { data: dbGallery } = useFirestoreCollection('gallery', fallbackGallery)
  const items = (dbGallery && dbGallery.length ? dbGallery : fallbackGallery)
    .filter((item) => item.active !== false && item.homepage !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  if (!items.length) return null

  // Duplicate items array to make the infinite loop marquee seamless
  const marqueeItems = [...items, ...items, ...items]

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-[#E5ECEB] overflow-hidden relative">
      {/* Background medical illustration elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg className="absolute top-10 left-10 size-48 text-[#3F8F84]" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg className="absolute bottom-10 right-10 size-64 text-[#3F8F84]" viewBox="0 0 100 100" fill="currentColor">
          <path d="M30,20 Q50,50 70,20 T70,80" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="30" cy="20" r="5" />
          <circle cx="70" cy="80" r="5" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#3F8F84] flex items-center justify-center gap-1.5">
            <ImageIcon className="size-4 animate-pulse" /> Hospital Moments
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#173A38] font-display">
            A Glimpse Into Sreya
          </h2>
          <p className="text-body-paragraph max-w-xl mx-auto">
            Take a visual tour of our advanced fertility labs, modern clinical spaces, and success celebration events.
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Marquee Wrapper */}
      <div 
        className="w-full relative py-6 overflow-hidden flex select-none hover-pause"
        style={{
          maskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)'
        }}
      >
        <div 
          className="flex gap-6 animate-marquee shrink-0"
          style={{
            width: 'max-content',
            animation: 'marquee 35s linear infinite'
          }}
        >
          {marqueeItems.map((item, idx) => {
            const displayCategory = String(item.category || 'Hospital').replace(/^\w/, (l) => l.toUpperCase())
            return (
              <motion.div
                key={`${item.id}-${idx}`}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3 }}
                className="w-72 sm:w-80 shrink-0 aspect-[4/3] rounded-[24px] overflow-hidden bg-slate-900 shadow-soft relative group border border-[#E5ECEB]/30"
                style={{
                  WebkitBoxReflect: 'below 10px linear-gradient(transparent, transparent 65%, rgba(0,0,0,0.12))'
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                  loading="lazy"
                />
                
                {/* Text Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black text-[#D8B26E] uppercase tracking-wider mb-1">
                    {displayCategory}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white font-display line-clamp-1">
                    {item.title}
                  </h3>
                  {item.shortDescription && (
                    <p className="text-[11px] text-stone-300 line-clamp-2 mt-1 leading-normal font-medium">
                      {item.shortDescription}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CSS custom keyframe style tag */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33333%); }
        }
        .hover-pause:hover .animate-marquee {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Centered CTA View Gallery Button */}
      <div className="mt-16 sm:mt-20 text-center relative z-10">
        <Link
          to="/gallery"
          className="btn-primary-custom"
        >
          View Full Gallery <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
