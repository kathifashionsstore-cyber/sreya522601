import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHero } from '../components/shared/PageHero'
import { Seo } from '../components/shared/Seo'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { fallbackFacilities } from '../mockData/facilities'
import { CheckCircle2, ChevronRight, Play, Volume2, VolumeX, ShieldCheck } from 'lucide-react'

export default function Facilities() {
  const { settings } = useSiteSettings()
  const { data: dbFacilities } = useFirestoreCollection('facilities', fallbackFacilities)
  
  const items = (dbFacilities && dbFacilities.length ? dbFacilities : fallbackFacilities)
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const banner = settings.pageBanners?.successStories || {} // Reuses success stories banner config or default

  // Group rooms together
  const rooms = items.filter((item) => item.category === 'rooms')
  const others = items.filter((item) => item.category !== 'rooms')

  const [activeRoomTab, setActiveRoomTab] = useState(0)

  // Autoplay video custom volume controls state
  const [mutedVideos, setMutedVideos] = useState({})

  const toggleMuted = (id) => {
    setMutedVideos((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <>
      <Seo
        title="Hospital Facilities & Infrastructure"
        description="Explore the state-of-the-art medical facilities, advanced embryology IVF labs, and patient recovery rooms at Sreya Hospitals."
      />
      
      <PageHero
        badge={banner.badge || 'Our Facilities'}
        title={banner.title || 'Advanced Infrastructure & Patient Care Wards'}
        subtitle={banner.subtitle || 'Take a tour of our specialized diagnostic labs, ICMR-compliant IVF cleanrooms, and premium recovery rooms.'}
        image={banner.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80'}
        breadcrumb={banner.breadcrumb || 'Facilities'}
      />

      <div className="bg-brand-cream py-16 space-y-20 overflow-hidden">
        
        {/* SECTION 1: PATIENT ROOMS & SUITES (TABBED CARD LAYOUT) */}
        {rooms.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose flex items-center justify-center gap-1.5">
                <ShieldCheck className="size-4" /> Accommodation
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display">
                Patient Wards & Recovery Rooms
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We offer diverse accommodation tiers to prioritize quiet privacy and clinical safety for families during treatment recovery.
              </p>
            </div>

            {/* Room tab triggers */}
            <div className="flex justify-center gap-3.5 mb-8 flex-wrap">
              {rooms.map((room, idx) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomTab(idx)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition shadow-soft border ${
                    activeRoomTab === idx
                      ? 'bg-brand-teal text-white border-brand-teal'
                      : 'bg-white text-brand-navy border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {room.title}
                </button>
              ))}
            </div>

            {/* Active Room Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr]">
              {/* Left Side: Media gallery & Video */}
              <div className="relative min-h-[320px] bg-slate-950 flex items-center justify-center overflow-hidden">
                {rooms[activeRoomTab].videoUrl ? (
                  <div className="absolute inset-0 w-full h-full">
                    <video
                      src={rooms[activeRoomTab].videoUrl}
                      autoPlay
                      muted={mutedVideos[rooms[activeRoomTab].id] !== false}
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Unmute/Mute Floating button */}
                    <button
                      onClick={() => toggleMuted(rooms[activeRoomTab].id)}
                      className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur text-white p-2 rounded-full shadow transition z-10"
                      aria-label="Toggle mute"
                    >
                      {mutedVideos[rooms[activeRoomTab].id] === false ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={rooms[activeRoomTab].images?.[0]?.imageUrl || rooms[activeRoomTab].imageUrl}
                      alt={rooms[activeRoomTab].images?.[0]?.altText || rooms[activeRoomTab].title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                )}
              </div>

              {/* Right Side: Copy & Details */}
              <div className="p-8 sm:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest block">Ward Category</span>
                  <h3 className="text-3xl font-black text-brand-navy font-display">{rooms[activeRoomTab].title}</h3>
                  <div className="h-0.5 w-10 bg-brand-rose" />
                  <p className="text-sm leading-relaxed text-slate-600">
                    {rooms[activeRoomTab].description}
                  </p>
                </div>

                {rooms[activeRoomTab].amenities && (
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-black uppercase text-brand-navy tracking-widest">Included Amenities:</h4>
                    <ul className="grid gap-2.5 sm:grid-cols-2 text-xs text-slate-700 leading-normal font-semibold">
                      {rooms[activeRoomTab].amenities.map((am, amIdx) => (
                        <li key={amIdx} className="flex gap-2 items-center">
                          <CheckCircle2 className="size-4 text-brand-teal shrink-0" />
                          <span>{am}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: REMAINING 7 FACILITIES (GRID BLOCK TRANSITIONS) */}
        {others.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto mb-6 space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-brand-teal block">Specialized Wards</span>
              <h2 className="text-3xl font-black text-brand-navy font-display">
                Clinical Departments & Laboratories
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-lift transition-all duration-300 hover:border-slate-200/60"
                >
                  <div className="relative h-56 bg-slate-900 overflow-hidden flex items-center justify-center">
                    {facility.videoUrl ? (
                      <div className="absolute inset-0 w-full h-full">
                        <video
                          src={facility.videoUrl}
                          autoPlay
                          muted={mutedVideos[facility.id] !== false}
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleMuted(facility.id)}
                          className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full z-10"
                        >
                          {mutedVideos[facility.id] === false ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
                        </button>
                      </div>
                    ) : (
                      <img
                        src={facility.images?.[0]?.imageUrl || facility.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'}
                        alt={facility.images?.[0]?.altText || facility.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                      />
                    )}
                    <span className="absolute top-4 left-4 bg-brand-navy/85 backdrop-blur-sm border border-white/10 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                      Clinical Suite
                    </span>
                  </div>

                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-brand-navy group-hover:text-brand-teal transition-colors duration-300">
                        {facility.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-4">
                        {facility.description}
                      </p>
                    </div>

                    {facility.amenities && (
                      <ul className="mt-4 grid gap-2 border-t border-slate-50 pt-4 text-[11px] text-slate-705 leading-relaxed font-semibold">
                        {facility.amenities.slice(0, 4).map((am, amIdx) => (
                          <li key={amIdx} className="flex gap-1.5 items-center">
                            <CheckCircle2 className="size-3.5 text-brand-teal shrink-0" />
                            <span className="truncate">{am}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  )
}
