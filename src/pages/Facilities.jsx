import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHero } from '../components/shared/PageHero'
import { Seo } from '../components/shared/Seo'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { fallbackFacilities } from '../mockData/facilities'
import { 
  Check, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Microscope, 
  Activity, 
  Users2, 
  Award,
  Bed,
  CheckCircle2
} from 'lucide-react'

export default function Facilities() {
  const { settings } = useSiteSettings()
  const { data: dbFacilities } = useFirestoreCollection('facilities', fallbackFacilities)
  
  const items = (dbFacilities && dbFacilities.length ? dbFacilities : fallbackFacilities)
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const banner = settings.pageBanners?.successStories || {}

  // Categorize facilities
  const rooms = items.filter((item) => item.category === 'rooms')
  
  const clinicalIds = ['icu', 'ot', 'lab', 'ivf', 'tech']
  const clinical = items.filter((item) => 
    clinicalIds.includes(item.category) ||
    item.title.toLowerCase().includes('lab') ||
    item.title.toLowerCase().includes('theatre') ||
    item.title.toLowerCase().includes('icu')
  )

  const others = items.filter((item) => !rooms.includes(item) && !clinical.includes(item))

  const [activeRoomTab, setActiveRoomTab] = useState(0)
  const [mutedVideos, setMutedVideos] = useState({})

  const toggleMuted = (id) => {
    setMutedVideos((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Visual helper mapping clinical items to modern tags & icons
  const getClinicalIcon = (category) => {
    switch (category) {
      case 'ivf':
      case 'tech':
        return Microscope
      case 'ot':
      case 'icu':
        return Activity
      default:
        return Award
    }
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

      <div className="bg-brand-cream py-16 sm:py-24 space-y-32 overflow-hidden">
        
        {/* ================= SECTION 1: CRITICAL CLINICAL CARE SHOWCASE (ALTERNATING HERO BLOCKS) ================= */}
        {clinical.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose flex items-center justify-center gap-1.5">
                <Microscope className="size-4 animate-pulse" /> Precision Medicine
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display">
                Clinical Suites & High-Tech Labs
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Discover the engineering and regulatory benchmarks that power our IVF laboratories, critical care monitorings, and sterile theatres.
              </p>
            </div>

            <div className="space-y-24">
              {clinical.map((facility, index) => {
                const isEven = index % 2 === 0
                const IconComponent = getClinicalIcon(facility.category)
                const mainImage = facility.images?.[0]?.imageUrl || facility.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'

                return (
                  <div 
                    key={facility.id}
                    className="grid gap-12 lg:grid-cols-12 items-center"
                  >
                    {/* Content Block */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className={`lg:col-span-5 space-y-6 ${!isEven ? 'lg:order-2' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid size-12 place-items-center rounded-2xl bg-brand-rose/10 text-brand-rose">
                          <IconComponent className="size-6" />
                        </span>
                        <span className="text-xs font-black uppercase text-brand-teal tracking-widest">
                          0{index + 1} / Infrastructure
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-brand-navy font-display leading-tight">
                        {facility.title}
                      </h3>
                      
                      <div className="h-1 w-12 bg-brand-rose rounded" />

                      <p className="text-sm leading-relaxed text-slate-655 font-semibold">
                        {facility.description}
                      </p>

                      {/* Amenities Specs */}
                      {facility.amenities && (
                        <div className="pt-2">
                          <h4 className="text-xs font-black uppercase text-brand-navy tracking-wider mb-3">
                            Key Specifications:
                          </h4>
                          <ul className="grid gap-2 sm:grid-cols-2 text-xs text-slate-500 font-bold">
                            {facility.amenities.map((spec, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-2">
                                <Check className="size-4 text-brand-rose shrink-0" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>

                    {/* Media Block (Wide Aspect Ratio with Hover Effects) */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className={`lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-soft border border-slate-100/50 bg-slate-900 group ${!isEven ? 'lg:order-1' : ''}`}
                    >
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
                            className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2.5 rounded-full z-10 transition hover:scale-105"
                          >
                            {mutedVideos[facility.id] === false ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                          </button>
                        </div>
                      ) : (
                        <img
                          src={mainImage}
                          alt={facility.images?.[0]?.altText || facility.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ================= SECTION 2: LUXURY ACCOMMODATION SUITE SHOWCASE (TABBED CARD LAYOUT) ================= */}
        {rooms.length > 0 && (
          <section className="bg-white py-16 sm:py-24 border-y border-slate-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-brand-teal flex items-center justify-center gap-1.5">
                  <Bed className="size-4" /> Accommodation Tiers
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display">
                  Patient Wards & Recovery Suites
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold">
                  We prioritize rest and quiet privacy during your recovery. Choose from our well-appointed room categories tailored for clinical comfort and support.
                </p>
              </div>

              {/* Room tab triggers */}
              <div className="flex justify-center gap-3.5 mb-12 flex-wrap">
                {rooms.map((room, idx) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomTab(idx)}
                    className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                      activeRoomTab === idx
                        ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/15 scale-105'
                        : 'bg-white text-brand-navy border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {room.title}
                  </button>
                ))}
              </div>

              {/* Active Room Card */}
              <div className="bg-slate-50 rounded-3xl border border-slate-100 shadow-soft overflow-hidden grid lg:grid-cols-[1.2fr_0.8fr] max-w-5xl mx-auto">
                
                {/* Media frame */}
                <div className="relative min-h-[300px] sm:min-h-[400px] bg-slate-950 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeRoomTab}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      {rooms[activeRoomTab].videoUrl ? (
                        <div className="relative w-full h-full">
                          <video
                            src={rooms[activeRoomTab].videoUrl}
                            autoPlay
                            muted={mutedVideos[rooms[activeRoomTab].id] !== false}
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => toggleMuted(rooms[activeRoomTab].id)}
                            className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur text-white p-2.5 rounded-full z-10 transition"
                          >
                            {mutedVideos[rooms[activeRoomTab].id] === false ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                          </button>
                        </div>
                      ) : (
                        <img
                          src={rooms[activeRoomTab].images?.[0]?.imageUrl || rooms[activeRoomTab].imageUrl}
                          alt={rooms[activeRoomTab].images?.[0]?.altText || rooms[activeRoomTab].title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Copy & Details */}
                <div className="p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-white border-l border-slate-50">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest block">Accommodation Option</span>
                    <h3 className="text-3xl font-black text-brand-navy font-display leading-tight">{rooms[activeRoomTab].title}</h3>
                    <div className="h-0.5 w-10 bg-brand-rose" />
                    <p className="text-sm leading-relaxed text-slate-600">
                      {rooms[activeRoomTab].description}
                    </p>
                  </div>

                  {rooms[activeRoomTab].amenities && (
                    <div className="space-y-4 pt-4 border-t border-slate-55">
                      <h4 className="text-xs font-black uppercase text-brand-navy tracking-widest">Amenities & Support:</h4>
                      <ul className="grid gap-2.5 sm:grid-cols-2 text-xs text-slate-655 font-semibold">
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
            </div>
          </section>
        )}

        {/* ================= SECTION 3: SOCIAL RESPONSIBILITY & SUPPORT (COMMUNITY CARDS) ================= */}
        {others.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose flex items-center justify-center gap-1.5">
                <Users2 className="size-4 animate-pulse" /> Community First
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display">
                Social Outreach & Support facilities
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
              {others.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-lift transition-all duration-300"
                >
                  <div className="relative h-60 bg-slate-900 overflow-hidden flex items-center justify-center">
                    <img
                      src={facility.images?.[0]?.imageUrl || facility.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'}
                      alt={facility.images?.[0]?.altText || facility.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-brand-navy group-hover:text-brand-teal transition-colors duration-300">
                        {facility.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-600">
                        {facility.description}
                      </p>
                    </div>

                    {facility.amenities && (
                      <ul className="mt-6 grid gap-2.5 border-t border-slate-50 pt-5 text-[11px] text-slate-705 leading-relaxed font-semibold">
                        {facility.amenities.map((am, amIdx) => (
                          <li key={amIdx} className="flex gap-2 items-center">
                            <CheckCircle2 className="size-4 text-brand-teal shrink-0" />
                            <span>{am}</span>
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
