import { useEffect, useState, useMemo, useRef } from 'react'
// DoctorProfileCard removed as the list section is removed
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { CalendarHeart, CheckCircle2, ChevronRight, Stethoscope, Users, Award, Check } from 'lucide-react'
import { Seo } from '../components/shared/Seo'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { doctors as fallbackDoctors } from '../data/seed'
import { displayDoctorQualifications, doctorQualificationList } from '../lib/doctorProfile'
import { physicianJsonLd } from '../lib/seo'

// Animated count-up component triggered on scroll
function Counter({ value }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!inView) return
    
    const numericPart = parseInt(value.replace(/[^0-9]/g, ''), 10)
    if (Number.isNaN(numericPart)) {
      setCount(value)
      return
    }

    const duration = 1500
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = progress * (2 - progress) // Easing out quad
      const currentCount = Math.floor(easeProgress * numericPart)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(numericPart)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, value])

  const suffix = value.replace(/[0-9]/g, '')
  const formattedCount = count.toLocaleString('en-IN')

  return (
    <span ref={ref}>
      {formattedCount}
      {suffix}
    </span>
  )
}

// Staircase SVG illustration drawing itself on scroll
function StaircaseSVG() {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100/50 shadow-soft w-full max-w-sm mx-auto">
      <h4 className="text-xs font-black uppercase text-[#087f8c] tracking-widest mb-6">Our Growth Journey</h4>
      <div className="relative w-full aspect-[4/3] flex items-center justify-center">
        <svg className="w-full h-full max-h-[220px]" viewBox="0 0 400 300">
          {/* Draw steps path */}
          <motion.path
            d="M 40 250 H 120 V 190 H 190 V 130 H 260 V 70 H 340"
            fill="none"
            stroke="#087f8c"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* 2007 Step */}
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <circle cx="80" cy="250" r="18" fill="#3F8F84" className="stroke-white stroke-2 shadow-sm" />
            <text x="80" y="254" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">2007</text>
          </motion.g>
          {/* 2010 Step */}
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <circle cx="155" cy="190" r="18" fill="#3F8F84" className="stroke-white stroke-2 shadow-sm" />
            <text x="155" y="194" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">2010</text>
          </motion.g>
          {/* 2017 Step */}
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <circle cx="225" cy="130" r="18" fill="#3F8F84" className="stroke-white stroke-2 shadow-sm" />
            <text x="225" y="134" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">2017</text>
          </motion.g>
          {/* 2026 Step */}
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            <circle cx="295" cy="70" r="22" fill="#087f8c" className="stroke-white stroke-2 shadow-lg animate-pulse" />
            <text x="295" y="74" textAnchor="middle" fill="white" fontSize="10" fontWeight="extrabold">2026</text>
          </motion.g>
        </svg>
      </div>
      <p className="text-center text-[10px] font-black text-brand-navy uppercase tracking-widest mt-4">
        Now Ready for the Next Giant Leap
      </p>
    </div>
  )
}

// Milestone collage helper for Sreya's Journey
function MilestoneCollage({ images }) {
  if (!images || images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className="relative aspect-square w-full min-h-[320px] sm:min-h-[400px] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
        <img src={images[0]} alt="Milestone scene" className="w-full h-full object-cover" />
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-4 w-full aspect-square min-h-[320px] sm:min-h-[400px]">
        {images.map((img, idx) => (
          <div key={idx} className="relative h-full overflow-hidden rounded-[24px] shadow-md border border-slate-100">
            <img src={img} alt="Milestone detail" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    )
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-3 gap-4 w-full aspect-square min-h-[320px] sm:min-h-[400px]">
        <div className="col-span-2 relative h-full overflow-hidden rounded-[24px] shadow-md border border-slate-100">
          <img src={images[0]} alt="Milestone main" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-4">
          {images.slice(1, 3).map((img, idx) => (
            <div key={idx} className="relative h-[calc(50%-8px)] overflow-hidden rounded-[20px] shadow-sm border border-slate-100">
              <img src={img} alt="Milestone thumbnail" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 4 or more: 2x2 grid
  return (
    <div className="grid grid-cols-2 gap-4 w-full aspect-square min-h-[320px] sm:min-h-[400px]">
      {images.slice(0, 4).map((img, idx) => (
        <div key={idx} className="relative h-full overflow-hidden rounded-[20px] shadow-sm border border-slate-100">
          <img src={img} alt="Milestone grid thumbnail" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  )
}

// Default timeline milestones fallback data
const defaultMilestones = [
  {
    year: '2007',
    date: 'January 21, 2007',
    description: 'Establishment of Sreya Nursing Home & Maternity Hospital',
    bulletsText: 'Founded as a dedicated center for maternal & child care in Narasaraopet\nEquipped with 24/7 emergency labor room & diagnostic unit\nThousands of safe deliveries delivered with care',
    image1: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80',
    image3: '',
    image4: '',
    image5: ''
  },
  {
    year: '2010–2016',
    date: '2010 to 2016',
    description: 'Expanded Gynecological & Laparoscopic Surgical Care',
    bulletsText: 'Introduced 3D/4D ultrasound pelvic scanning\nEstablished advanced minimally invasive laparoscopic surgery unit\nOver 7,000 successful keyhole & hysteroscopic procedures',
    image1: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
    image3: '',
    image4: '',
    image5: ''
  },
  {
    year: '2017',
    date: 'August 2017',
    description: 'Launch of First Specialized IVF & Embryology Centre in Palnadu',
    bulletsText: 'First dedicated cleanroom embryology lab in Palnadu region\nInstalled high-precision ICSI micromanipulator & CO2 incubators\nAchieved first successful IVF test-tube baby pregnancies in Narasaraopet',
    image1: 'https://images.unsplash.com/photo-1581093458791-9d2fcea0a349?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1579156286657-41d3d68aa0a9?auto=format&fit=crop&w=600&q=80',
    image3: '',
    image4: '',
    image5: ''
  },
  {
    year: '2026',
    date: 'Present — 2026',
    description: 'Sreya 2.0 — Modernized Multi-Specialty Fertility Destination',
    bulletsText: 'State-of-the-art upgraded IVF & genetic screening lab\nOver 10,000+ happy families & 1,500+ free medical awareness camps\nExpanded digital consultation & patient care continuity',
    image1: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    image2: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=600&q=80',
    image3: '',
    image4: '',
    image5: ''
  }
]

export default function Doctors() {
  const { settings } = useSiteSettings()
  const { data: dbDoctors } = useFirestoreCollection('doctors', fallbackDoctors, null)
  
  const items = useMemo(() => {
    const rawItems = dbDoctors && dbDoctors.length ? dbDoctors : fallbackDoctors
    return [...rawItems].sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [dbDoctors])

  const leadDoctor = items[0] || fallbackDoctors[0]
  const leadDoctorQualifications = displayDoctorQualifications(leadDoctor?.qualifications)

  const milestonesList = useMemo(() => {
    return (settings.journeyMilestones && settings.journeyMilestones.length > 0)
      ? settings.journeyMilestones
      : defaultMilestones
  }, [settings.journeyMilestones])

  const qualificationsList = useMemo(
    () => doctorQualificationList(leadDoctor?.qualifications),
    [leadDoctor?.qualifications],
  )

  return (
    <>
      <Seo
        title="Doctors"
        description="Doctor profiles and consultation details at Sreya Hospitals & IVF Centre."
        jsonLd={items[0] ? physicianJsonLd(items[0]) : null}
      />

      {/* Two-Column Hero layout for Dr. M. Vasanta Kiran */}
      <section className="relative overflow-hidden bg-brand-ink py-20 sm:py-28 text-white">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
          <svg className="absolute top-1/2 left-10 size-96 text-brand-teal" viewBox="0 0 100 100" fill="currentColor">
            <path d="M30,50 C50,20 70,80 90,50" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <ChevronRight className="size-4" />
            <span className="text-white">Doctors</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: 1:1 rounded frame with accent shadow */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square p-3 bg-white rounded-[24px] shadow-2xl border border-white/80 ring-4 ring-[#087f8c]/25 overflow-hidden">
                <img 
                  src={leadDoctor.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'} 
                  alt={leadDoctor.name} 
                  className="w-full h-full object-cover rounded-[16px]"
                />
              </div>
            </motion.div>

            {/* Right Column: Profile data & list */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 text-primary-light px-3 py-1.5 text-[10px] font-black uppercase tracking-widest">
                Lead Infertility Specialist
              </span>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight">
                  {leadDoctor.name}
                </h1>
                <p className="text-lg sm:text-xl font-bold text-primary-light">
                  {leadDoctor.specialty}
                </p>
              </div>

              <div className="h-0.5 w-16 bg-[#087f8c]" />

              <p className="text-slate-350 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                {leadDoctor.bio}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase text-white/90 tracking-wider">Qualifications & Credentials:</h4>
                <ul className="grid gap-2.5 sm:grid-cols-2 text-xs sm:text-sm text-slate-200 font-semibold">
                  {qualificationsList.map((qual, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-[#087f8c] shrink-0 mt-0.5" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Way Section */}
      {(settings.doctorsPage?.advancedHeading || settings.doctorsPage?.advancedBody) && (
        <section className="bg-brand-navy text-white py-12 border-b border-white/5 relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-4">
            <span className="grid size-10 place-items-center rounded-full bg-brand-rose/25 text-brand-rose mx-auto">
              <Stethoscope className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
              {settings.doctorsPage.advancedHeading}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              {settings.doctorsPage.advancedBody}
            </p>
          </div>
        </section>
      )}

      {/* Team Photo Section - Using /team/team-photo.jpg directly */}
      <section className="bg-brand-cream py-16 sm:py-24 border-b border-slate-250/20">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#087f8c]">Meet Our Team</span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy font-display">Dedicated Care Professionals</h2>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-soft border border-slate-100 bg-slate-900 group">
            <img
              src="/team/team-photo.jpg"
              alt="Sreya Clinical & Support Team"
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Sreya's Journey Timeline Section */}
      <section className="bg-brand-cream py-16 sm:py-28 border-t border-slate-200/50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header block */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center mb-24">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#087f8c]">Our Story & Milestones</span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display leading-tight">
                {settings.journeyTitle || "Sreya's Journey"}
              </h2>
              <div className="h-1 w-16 bg-[#087f8c] rounded" />
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {settings.journeyTagline || "Providing Affordable, Quality Healthcare for nearly 2 decades."}
              </p>
            </div>
            
            <div className="lg:col-span-6 relative flex items-center justify-center h-[340px] sm:h-[400px]">
              <div className="absolute top-4 right-10 z-10 w-40 h-40 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-slate-50 rotate-3 transition-transform hover:rotate-0 duration-300">
                <img 
                  src={settings.journeyIntroImage1 || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"} 
                  alt="Maternal care context" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-10 z-20 w-40 h-40 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-50 -rotate-3 transition-transform hover:rotate-0 duration-300">
                <img 
                  src={settings.journeyIntroImage2 || "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80"} 
                  alt="Baby care context" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Premium Vertical Alternating Timeline */}
          <div className="relative max-w-6xl mx-auto px-4">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden lg:block" />

            <div className="space-y-20 lg:space-y-36 relative">
              {milestonesList.map((milestone, idx) => {
                const isEven = idx % 2 === 0
                const isSreya2 = milestone.year.includes('2026')
                
                const bullets = (milestone.bulletsText || '')
                  .split('\n')
                  .map(b => b.trim())
                  .filter(Boolean)

                const images = [
                  milestone.image1,
                  milestone.image2,
                  milestone.image3,
                  milestone.image4,
                  milestone.image5
                ].filter(Boolean)

                return (
                  <div key={idx} className="grid lg:grid-cols-12 gap-8 items-center relative">
                    
                    {/* Center Circle Year Marker (desktop only) */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-20 hidden lg:block">
                      <motion.div
                        initial={{ backgroundColor: "#cbd5e1", scale: 0.9, borderColor: "#cbd5e1" }}
                        whileInView={{ backgroundColor: isSreya2 ? "#087f8c" : "#3F8F84", scale: isSreya2 ? 1.25 : 1.1, borderColor: "#ffffff" }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{ duration: 0.4 }}
                        className={`grid size-14 place-items-center rounded-full text-white text-xs font-black border-4 shadow-lg ${isSreya2 ? 'ring-4 ring-[#087f8c]/25 animate-pulse' : ''}`}
                      >
                        {milestone.year}
                      </motion.div>
                    </div>

                    {/* Left Content Column */}
                    <div className={`lg:col-span-5 ${isEven ? '' : 'lg:order-2'}`}>
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className={`p-6 sm:p-8 rounded-[24px] border ${
                          isSreya2 
                            ? 'border-[#087f8c] bg-gradient-to-br from-white to-[#087f8c]/5 shadow-[0_0_20px_rgba(8,127,140,0.15)] ring-1 ring-[#087f8c]/30' 
                            : 'border-slate-100 bg-white shadow-soft'
                        } space-y-4`}
                      >
                        {/* Year tag for mobile only */}
                        <div className="flex items-center justify-between lg:hidden mb-2">
                          <span className="bg-[#087f8c] text-white px-3.5 py-1 rounded-full text-xs font-black">
                            {milestone.year}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{milestone.date}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="hidden lg:block text-xs font-black uppercase text-[#087f8c] tracking-wider">
                            {milestone.date || 'Milestone'}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-brand-navy font-display leading-tight">
                            {milestone.description}
                          </h3>
                        </div>

                        {/* Staggered bullet points */}
                        {bullets.length > 0 && (
                          <motion.ul
                            variants={{
                              hidden: { opacity: 0 },
                              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            className="space-y-2 mt-4"
                          >
                            {bullets.map((bullet, bIdx) => (
                              <motion.li 
                                key={bIdx}
                                variants={{
                                  hidden: { opacity: 0, y: 8 },
                                  visible: { opacity: 1, y: 0 }
                                }}
                                className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 font-semibold"
                              >
                                <Check className="size-4 text-[#087f8c] shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </motion.div>
                    </div>

                    {/* Spacer for center line (desktop only) */}
                    <div className="lg:col-span-2 hidden lg:block" />

                    {/* Right Photo Column (Image collage) */}
                    <div className={`lg:col-span-5 ${isEven ? '' : 'lg:order-1'}`}>
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <MilestoneCollage images={images} />
                      </motion.div>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>

          {/* Concluding Staircase Graphic & Stats Banner */}
          <div className="mt-24 pt-16 border-t border-slate-200/60 max-w-6xl mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              
              {/* Staircase Graphic SVG */}
              <div className="lg:col-span-5">
                <StaircaseSVG />
              </div>

              {/* Stats Block & Symmetrical Doctor profile card */}
              <div className="lg:col-span-7 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-soft hover:shadow-lift transition duration-300">
                    <span className="block text-3xl sm:text-4xl font-black text-brand-navy font-display">
                      <Counter value={settings.journeyStats?.deliveries || "6000+"} />
                    </span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2 block">Deliveries</span>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-soft hover:shadow-lift transition duration-300">
                    <span className="block text-3xl sm:text-4xl font-black text-brand-navy font-display">
                      <Counter value={settings.journeyStats?.infertility || "10000+"} />
                    </span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2 block">Infertility Treatments</span>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-soft hover:shadow-lift transition duration-300">
                    <span className="block text-3xl sm:text-4xl font-black text-brand-navy font-display">
                      <Counter value={settings.journeyStats?.laparoscopic || "7000+"} />
                    </span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2 block">Laparoscopic Surgeries</span>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-soft hover:shadow-lift transition duration-300">
                    <span className="block text-3xl sm:text-4xl font-black text-brand-navy font-display">
                      <Counter value={settings.journeyStats?.camps || "1500+"} />
                    </span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2 block">Free Medical Camps</span>
                  </div>
                </div>

                {/* Symmetrical Doctor profile card bookending the page */}
                {leadDoctor && (
                  <div className="flex flex-col sm:flex-row gap-6 items-center bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto ring-4 ring-[#087f8c]/5">
                    {leadDoctor.photoUrl && (
                      <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border-2 border-white ring-4 ring-[#087f8c]/15 shadow-md bg-slate-50">
                        <img src={leadDoctor.photoUrl} alt={leadDoctor.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="text-center sm:text-left space-y-1.5">
                      <span className="text-[10px] font-black text-[#087f8c] uppercase tracking-widest">Our Founding Specialist</span>
                      <h5 className="font-black text-brand-navy text-xl font-display">{leadDoctor.name}</h5>
                      <p className="text-xs font-bold text-[#087f8c]">{leadDoctor.specialty}</p>
                      <div className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {leadDoctorQualifications}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  )
}
