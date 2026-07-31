import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ZoomIn, ZoomOut, ArrowLeft, ArrowRight, Share2 } from 'lucide-react'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { gallery as fallbackGallery } from '../data/seed'
import { Seo } from '../components/shared/Seo'

export default function Gallery() {
  const { data: dbGallery } = useFirestoreCollection('gallery', fallbackGallery)
  const prefersReducedMotion = useReducedMotion()
  const items = useMemo(() => {
    return (dbGallery && dbGallery.length ? dbGallery : fallbackGallery)
      .filter((item) => item.active !== false && item.status !== 'draft')
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [dbGallery])

  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null
  const galleryIntroVariants = {
    hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0 },
  }
  const cardVariants = {
    hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 70, scale: 0.9, rotateZ: -1.5, filter: 'blur(10px)' },
    show: (idx) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateZ: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.72,
        delay: prefersReducedMotion ? 0 : Math.min((idx % 6) * 0.11, 0.55),
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  // Lightbox navigation
  const handlePrev = () => {
    setIsZoomed(false)
    setShowShareMenu(false)
    setSelectedIdx((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setIsZoomed(false)
    setShowShareMenu(false)
    setSelectedIdx((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIdx === null) return
      if (e.key === 'Escape') setSelectedIdx(null)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIdx, items])

  // Mobile Touch Gestures
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const diff = touchStart - touchEnd
    if (diff > 60) handleNext()
    if (diff < -60) handlePrev()
    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <>
      <Seo 
        title="Hospital Gallery | Sreya Hospitals" 
        description="A clean visual photo showcase of Sreya Hospitals & IVF Centre."
      />

      {/* HERO BANNER */}
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-[#173A38] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80')` }}
        />
        <div className="relative z-10 text-center max-w-4xl px-4 space-y-3">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#D8B26E] backdrop-blur-[8px]"
          >
            Visual Showcase
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-white text-4xl sm:text-6xl font-black font-display tracking-tight leading-none"
          >
            Hospital Gallery
          </motion.h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#D8B26E]" />
      </section>

      {/* CLEAN PHOTO MASONRY GRID */}
      <section className="relative min-h-screen overflow-hidden bg-[#FAFDFD] py-12 sm:py-20">
        <div className="pointer-events-none absolute left-0 top-0 h-40 w-full bg-gradient-to-b from-[#D8B26E]/10 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={galleryIntroVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mx-auto mb-8 max-w-2xl text-center sm:mb-12"
          >
            <span className="text-xs font-black uppercase tracking-[0.22em] text-[#3F8F84]">Moments of care</span>
            <h2 className="mt-3 font-display text-3xl font-black text-[#173A38] sm:text-4xl">Scroll through Sreya spaces</h2>
          </motion.div>

          {items.length > 0 ? (
            <motion.div 
              layout 
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5"
            >
              {items.map((item, idx) => (
                <motion.div
                  layout
                  key={item.id || idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.22, margin: '0px 0px -8% 0px' }}
                  className="group relative mb-5 break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-[#E5ECEB] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div className="relative w-full overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt="" 
                      className="pointer-events-none w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#173A38]/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24 max-w-md mx-auto space-y-3 text-slate-500">
              <h3 className="text-lg font-black font-display text-[#173A38]">No Images Available</h3>
              <p className="text-sm">Check back soon for new photo updates.</p>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedIdx !== null && selectedItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex flex-col justify-between bg-black/95 select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Toolbar */}
            <div className="p-4 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/70 to-transparent">
              <span className="text-xs font-bold text-stone-300">
                Image {selectedIdx + 1} of {items.length}
              </span>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                    aria-label="Share Image"
                  >
                    <Share2 className="size-4.5" />
                  </button>
                  
                  {/* Share Menu */}
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-12 bg-zinc-900 border border-zinc-800 rounded-lg p-2 shadow-2xl flex flex-col gap-1 w-36 text-xs font-bold text-left text-stone-200"
                      >
                        <a 
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedItem.imageUrl)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded hover:bg-white/10 block transition"
                          onClick={() => setShowShareMenu(false)}
                        >
                          WhatsApp
                        </a>
                        <a 
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedItem.imageUrl)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded hover:bg-white/10 block transition"
                          onClick={() => setShowShareMenu(false)}
                        >
                          Facebook
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                  aria-label="Zoom Image"
                >
                  {isZoomed ? <ZoomOut className="size-4.5" /> : <ZoomIn className="size-4.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIdx(null)}
                  className="grid size-10 place-items-center rounded-full bg-[#3F8F84] hover:bg-[#2C645D] transition text-white"
                  aria-label="Close Lightbox"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Main Image Body */}
            <div className="flex-grow flex items-center justify-center relative overflow-hidden p-4">
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-6 hidden md:grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition text-white z-20"
                aria-label="Previous Slide"
              >
                <ArrowLeft className="size-5" />
              </button>

              <div 
                className="w-full h-full flex items-center justify-center"
                onDoubleClick={() => setIsZoomed(!isZoomed)}
              >
                <motion.img
                  key={selectedItem.id || selectedIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isZoomed ? 1.5 : 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                  src={selectedItem.imageUrl}
                  alt=""
                  className={`max-h-[85vh] max-w-[92vw] object-contain rounded-lg transition-shadow duration-300 ${
                    isZoomed ? 'cursor-zoom-out shadow-2xl' : 'cursor-zoom-in'
                  }`}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-6 hidden md:grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition text-white z-20"
                aria-label="Next Slide"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
