import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, ArrowLeft, ArrowRight, Share2, Calendar, MapPin, Eye, Play } from 'lucide-react'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { gallery as fallbackGallery } from '../data/seed'
import { Seo } from '../components/shared/Seo'
import { useSiteSettings } from '../context/SiteSettingsContext'

const CATEGORIES = [
  { id: 'all', label: 'All Moments' },
  { id: 'hospital', label: 'Hospital' },
  { id: 'doctors', label: 'Doctors' },
  { id: 'lab', label: 'Embryology Lab' },
  { id: 'ivf', label: 'IVF' },
  { id: 'success-stories', label: 'Success Stories' },
  { id: 'events', label: 'Events' },
  { id: 'counselling', label: 'Counselling' },
  { id: 'awards', label: 'Awards' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'medical-camp', label: 'Medical Camp' },
  { id: 'videos', label: 'Videos' }
]

export default function Gallery() {
  const { settings } = useSiteSettings()
  const { data: dbGallery } = useFirestoreCollection('gallery', [])
  const items = useMemo(() => {
    return (dbGallery && dbGallery.length ? dbGallery : [])
      .filter((item) => item.active !== false && item.status !== 'draft')
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [dbGallery])

  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Filtered items
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items
    return items.filter((item) => (item.category || '').toLowerCase() === activeCategory)
  }, [items, activeCategory])

  const selectedItem = selectedIdx !== null ? filteredItems[selectedIdx] : null

  // Lightbox navigation
  const handlePrev = () => {
    setIsZoomed(false)
    setShowShareMenu(false)
    setSelectedIdx((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setIsZoomed(false)
    setShowShareMenu(false)
    setSelectedIdx((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1))
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
  }, [selectedIdx, filteredItems])

  // Mobile Swipe Gestures
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

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
        title="Hospital Gallery | Sreya Infertility Journey of Hope" 
        description="A beautiful visual tour of Sreya Hospitals & IVF Centre. Take a look at our clinical rooms, state-of-the-art lab facility, and patient awareness camps."
      />

      {/* LUXURY APPLE-STYLE HERO WITH PARALLAX & FLOTATION PARTICLES */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-[#173A38] flex items-center justify-center">
        {/* Background Parallax image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80')` }}
        />
        {/* Dynamic morphing blur blobs */}
        <div className="absolute top-1/4 left-1/4 size-80 rounded-full bg-[#3F8F84] opacity-20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-[#D8B26E] opacity-15 blur-[120px] animate-pulse [animation-delay:2s]" />

        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 15 + 6,
                height: Math.random() * 15 + 6,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -120 - 80],
                x: [0, Math.random() * 60 - 30],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: Math.random() * 6 + 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-10 text-center max-w-4xl px-4 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#D8B26E] backdrop-blur-[8px]"
          >
            Sreya Moments
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-white text-5xl sm:text-6xl font-black font-display tracking-tight leading-none"
          >
            Our Journey of Hope
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-stone-300 text-lg sm:text-xl font-medium max-w-xl mx-auto leading-relaxed"
          >
            A visual documentation of the smiles, science, infrastructure, and celebrations that define Sreya Infertility Care.
          </motion.p>
        </div>

        {/* Solid Gold Decorative bottom peel */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#D8B26E]" />
      </section>

      {/* FILTER BUTTONS & MASONRY GALLERY */}
      <section className="bg-[#FAFDFD] py-16 sm:py-24 relative min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Categories Horizontal Scrollbar */}
          <div className="flex justify-center mb-16 overflow-x-auto pb-4 scrollbar-none">
            <div className="flex gap-2 sm:gap-3 px-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setSelectedIdx(null)
                  }}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-[#3F8F84] text-white shadow-md scale-105'
                      : 'bg-white text-[#52656D] border border-[#E5ECEB] hover:bg-[#F5F9F8] hover:text-[#173A38]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pinterest-style Masonry Layout */}
          {filteredItems.length > 0 ? (
            <motion.div 
              layout 
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
            >
              {filteredItems.map((item, idx) => {
                const categoryObj = CATEGORIES.find(c => c.id === item.category)
                const categoryLabel = categoryObj ? categoryObj.label : 'Hospital'

                return (
                  <motion.div
                    layout
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                    className="break-inside-avoid rounded-[24px] overflow-hidden mb-6 card-premium bg-white cursor-pointer relative group border border-[#E5ECEB]"
                    onClick={() => setSelectedIdx(idx)}
                  >
                    {/* Image Block */}
                    <div className="relative overflow-hidden w-full">
                      <img 
                        src={item.imageUrl} 
                        alt={item.altText || item.title} 
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                        loading="lazy"
                      />
                      {item.category === 'videos' && (
                        <div className="absolute inset-0 grid place-items-center bg-black/30 z-10">
                          <span className="grid size-12 place-items-center rounded-full bg-white/90 text-[#3F8F84] shadow-md group-hover:scale-110 transition">
                            <Play className="size-5 fill-[#3F8F84] ml-0.5" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta Glassmorphism Overlay (visible on hover) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="inline-block w-fit rounded-full bg-[#D8B26E] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-black mb-2">
                        {categoryLabel}
                      </span>
                      <h3 className="text-white text-base font-bold font-display line-clamp-1">
                        {item.title}
                      </h3>
                      {item.shortDescription && (
                        <p className="text-stone-300 text-xs line-clamp-2 mt-1 leading-normal">
                          {item.shortDescription}
                        </p>
                      )}
                      
                      {/* Meta sub details */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-3 border-t border-white/10 text-[10px] text-stone-400">
                        {item.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" /> {item.date}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" /> {item.location}
                          </span>
                        )}
                      </div>

                      {/* View CTA indicator */}
                      <div className="mt-4 flex items-center gap-1 text-[11px] font-black text-[#D8B26E] uppercase tracking-wider">
                        <Eye className="size-3.5" /> View Full Image
                      </div>
                    </div>

                    {/* Mobile fallback footer details (visible on mobile only, when hover is not active) */}
                    <div className="p-4 sm:hidden border-t border-[#E5ECEB] bg-white">
                      <span className="text-[9px] font-black text-[#3F8F84] uppercase tracking-widest">{categoryLabel}</span>
                      <h3 className="text-sm font-black text-[#173A38] font-display line-clamp-1 mt-0.5">{item.title}</h3>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <div className="text-center py-24 max-w-md mx-auto space-y-4">
              <div className="grid size-16 place-items-center bg-[#F5F9F8] text-[#3F8F84] rounded-full mx-auto">
                <Eye className="size-8" />
              </div>
              <h3 className="text-[#173A38] text-lg font-black font-display">No Images Found</h3>
              <p className="text-body-paragraph text-sm">
                No items have been added to this category yet. Check back later or explore other sections.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ADVANCED FULL-SCREEN LIGHTBOX MODAL */}
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
            <div className="p-4 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/60 to-transparent">
              {/* Item Info Summary */}
              <div className="text-left">
                <span className="text-[10px] font-black text-[#D8B26E] uppercase tracking-widest">
                  {CATEGORIES.find(c => c.id === selectedItem.category)?.label || 'Sreya Gallery'}
                </span>
                <h2 className="text-sm sm:text-base font-black font-display tracking-tight text-white line-clamp-1">
                  {selectedItem.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Share Button */}
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
                        className="absolute right-0 top-12 bg-zinc-900 border border-zinc-800 rounded-lg p-2 shadow-2xl flex flex-col gap-1 w-40 text-xs font-bold text-left text-stone-200"
                      >
                        <a 
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedItem.title + ' ' + selectedItem.imageUrl)}`}
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
                        <a 
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(selectedItem.imageUrl)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded hover:bg-white/10 block transition"
                          onClick={() => setShowShareMenu(false)}
                        >
                          Twitter / X
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Zoom Toggle */}
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                  aria-label="Zoom Image"
                >
                  {isZoomed ? <ZoomOut className="size-4.5" /> : <ZoomIn className="size-4.5" />}
                </button>

                {/* Close Button */}
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
              
              {/* Prev Slide button (desktop only) */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-6 hidden md:grid size-12 place-items-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-white z-20"
                aria-label="Previous Slide"
              >
                <ArrowLeft className="size-5" />
              </button>

              {/* Main Image Container */}
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
                  alt={selectedItem.altText || selectedItem.title}
                  className={`max-h-[75vh] max-w-[90vw] object-contain rounded-lg transition-shadow duration-300 ${
                    isZoomed ? 'cursor-zoom-out shadow-2xl' : 'cursor-zoom-in'
                  }`}
                  onContextMenu={(e) => e.preventDefault()} // Block right-click save
                  draggable={false} // Disable dragging
                />
              </div>

              {/* Next Slide button (desktop only) */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-6 hidden md:grid size-12 place-items-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-white z-20"
                aria-label="Next Slide"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>

            {/* Bottom Meta & Description overlay */}
            <div className="p-6 bg-gradient-to-t from-black/90 to-transparent text-left text-white z-10 space-y-3">
              {selectedItem.shortDescription && (
                <p className="text-sm max-w-3xl leading-relaxed text-stone-300 mx-auto text-center font-medium">
                  {selectedItem.shortDescription}
                </p>
              )}

              {/* Details table in center */}
              <div className="flex flex-wrap justify-center gap-6 text-xs text-stone-400 max-w-md mx-auto pt-2 border-t border-white/10">
                {selectedItem.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-[#3F8F84]" /> Date: {selectedItem.date}
                  </span>
                )}
                {selectedItem.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-[#3F8F84]" /> Loc: {selectedItem.location}
                  </span>
                )}
                {selectedItem.photographer && (
                  <span className="flex items-center gap-1.5">
                    By: {selectedItem.photographer}
                  </span>
                )}
              </div>

              {/* Slider Dots */}
              <div className="text-center text-[10px] text-stone-500 font-extrabold pt-2">
                Image {selectedIdx + 1} of {filteredItems.length} (Swipe left/right to browse)
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
