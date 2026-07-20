import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'

const fallbackBanners = [
  { id: 'fb1', title: 'Poster Banner 1', imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1600&q=80', order: 1, active: true },
  { id: 'fb2', title: 'Poster Banner 2', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80', order: 2, active: true },
  { id: 'fb3', title: 'Poster Banner 3', imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80', order: 3, active: true },
  { id: 'fb4', title: 'Poster Banner 4', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80', order: 4, active: true },
  { id: 'fb5', title: 'Poster Banner 5', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80', order: 5, active: true },
]

export function PosterSlider() {
  const { data: dbBanners } = useFirestoreCollection('banners', fallbackBanners)
  
  const banners = (dbBanners && dbBanners.length ? dbBanners : fallbackBanners)
    .filter(b => b.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [banners.length, isPaused])

  if (!banners.length) return null

  return (
    <section className="relative w-full overflow-hidden bg-brand-cream py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div 
          className="mx-auto w-full max-w-[500px] aspect-square p-3 sm:p-4 bg-white rounded-[24px] shadow-2xl border border-slate-100/80 flex flex-col justify-between"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="relative w-full h-full overflow-hidden rounded-[16px] bg-slate-900">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={banners[currentIndex].imageUrl}
                alt="Promotional Banner"
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Small dot indicators below the frame */}
        {banners.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'bg-[#087f8c] w-6' 
                    : 'bg-slate-300 hover:bg-slate-400 w-2.5'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

