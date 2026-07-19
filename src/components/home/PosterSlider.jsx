import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'

const fallbackBanners = [
  { id: 'fb1', imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1600&q=80', order: 1, active: true },
  { id: 'fb2', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80', order: 2, active: true },
  { id: 'fb3', imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80', order: 3, active: true }
]

export function PosterSlider() {
  const { data: dbBanners } = useFirestoreCollection('banners', [])
  
  const banners = (dbBanners && dbBanners.length ? dbBanners : fallbackBanners)
    .filter(b => b.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) return null

  return (
    <section className="relative w-full overflow-hidden bg-brand-cream py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-soft border border-slate-100/50 aspect-square w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] mx-auto flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={banners[currentIndex].imageUrl}
              alt="Promotional Banner"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>
          {/* Subtle indicator dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`size-2 rounded-full transition-all duration-205 ${
                    currentIndex === idx ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70'
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
