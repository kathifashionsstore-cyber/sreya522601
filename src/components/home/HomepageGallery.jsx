import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Image as ImageIcon, X, Maximize2 } from 'lucide-react'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { gallery as fallbackGallery } from '../../data/seed'

export function HomepageGallery() {
  const { data: dbGallery } = useFirestoreCollection('gallery', fallbackGallery)
  const [activeImage, setActiveImage] = useState(null)

  const items = (dbGallery && dbGallery.length ? dbGallery : fallbackGallery)
    .filter((item) => item.active !== false && item.homepage !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  if (!items.length) return null

  // Duplicate items array to make the infinite loop marquee seamless
  const marqueeItems = [...items, ...items, ...items]

  return (
    <section className="bg-brand-cream py-20 sm:py-28 border-b border-slate-250/20 overflow-hidden relative">
      {/* Background medical illustration elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg className="absolute top-10 left-10 size-48 text-[#087f8c]" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#087f8c] flex items-center justify-center gap-1.5">
            <ImageIcon className="size-4 animate-pulse text-[#087f8c]" /> Hospital Moments
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display">
            A Glimpse Into Sreya
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
            Take a visual tour of our advanced fertility labs, modern clinical spaces, and milestone events.
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Marquee Wrapper */}
      <div 
        className="w-full relative py-8 overflow-hidden flex select-none hover-pause cursor-grab active:cursor-grabbing"
        style={{
          maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)'
        }}
      >
        <div 
          className="flex gap-8 animate-marquee shrink-0"
          style={{
            width: 'max-content',
            animation: 'marquee 40s linear infinite'
          }}
        >
          {marqueeItems.map((item, idx) => (
            <motion.div
              key={`${item.id}-${idx}`}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveImage(item.imageUrl)}
              className="w-80 sm:w-96 shrink-0 aspect-[16/10] rounded-[28px] overflow-hidden bg-slate-900 shadow-xl relative group border-2 border-white ring-4 ring-[#087f8c]/10 cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.altText || "Sreya Hospital Moment"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                loading="lazy"
              />
              
              {/* Subtle hover icon prompt (No text overlays) */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="size-12 rounded-full bg-white/90 text-brand-navy flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <Maximize2 className="size-5 text-[#087f8c]" />
                </span>
              </div>
            </motion.div>
          ))}
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
          className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#087f8c] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#06646e] transition-all duration-300 shadow-lg shadow-[#087f8c]/25 hover:shadow-xl hover:shadow-[#087f8c]/35"
        >
          Explore Full Photo Gallery <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
              aria-label="Close photo view"
            >
              <X className="size-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage}
                alt="Hospital Moment High Resolution View"
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
