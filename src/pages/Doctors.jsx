import { useEffect, useState, useMemo } from 'react'
import { DoctorProfileCard } from '../components/doctors/DoctorProfileCard'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarHeart, CheckCircle2, ChevronRight, Stethoscope, Users, Award } from 'lucide-react'
import { Seo } from '../components/shared/Seo'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { doctors as fallbackDoctors } from '../data/seed'
import { physicianJsonLd } from '../lib/seo'

export default function Doctors() {
  const { settings } = useSiteSettings()
  const { data: dbDoctors } = useFirestoreCollection('doctors', fallbackDoctors, null)
  const items = useMemo(() => {
    const rawItems = dbDoctors && dbDoctors.length ? dbDoctors : fallbackDoctors
    return [...rawItems].sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [dbDoctors])
  const leadDoctor = items[0] || fallbackDoctors[0]
  const banner = settings.pageBanners?.doctors || {}
  const journeySteps = Array.isArray(leadDoctor?.journeySteps) && leadDoctor.journeySteps.length
    ? leadDoctor.journeySteps
    : fallbackDoctors[0]?.journeySteps || []

  // Hero Slideshow
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    settings.doctorsPage?.heroImage1,
    settings.doctorsPage?.heroImage2,
    settings.doctorsPage?.heroImage3,
  ].filter(Boolean)

  const finalSlides = slides.length > 0 ? slides : [
    banner.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1600&q=80'
  ]

  const heroTitle = settings.doctorsPage?.heroTitle || banner.title || "Specialist-led fertility and women's health care"
  const heroSubtitle = settings.doctorsPage?.heroSubtitle || banner.subtitle || settings.tagline

  useEffect(() => {
    if (finalSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % finalSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [finalSlides])

  return (
    <>
      <Seo
        title="Doctors"
        description="Doctor profiles and consultation details at Sreya Hospitals & IVF Centre."
        jsonLd={items[0] ? physicianJsonLd(items[0]) : null}
      />

      {/* Slide Carousel Hero */}
      <section className="relative flex h-[480px] items-center justify-center overflow-hidden bg-brand-ink text-white sm:h-[550px] lg:h-[650px]">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={finalSlides[currentSlide]}
              alt="Medical Specialists"
              className="absolute inset-0 h-full w-full object-cover object-center scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.38 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            />
          </AnimatePresence>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.92), rgba(13,148,136,0.35))',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 py-20 text-center sm:py-24 lg:py-[120px]">
          <nav className="mb-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 sm:text-sm">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-white">Doctors</span>
          </nav>

          <span className="mb-4 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary-light backdrop-blur">
            Clinical Team
          </span>

          <motion.h1 
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl lg:text-[56px] font-display"
          >
            {heroTitle}
          </motion.h1>

          <motion.p 
            key={`sub-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-[700px] text-sm font-medium leading-relaxed text-slate-205 sm:text-lg"
          >
            {heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Advanced Way Section */}
      {(settings.doctorsPage?.advancedHeading || settings.doctorsPage?.advancedBody) && (
        <section className="bg-brand-navy text-white py-16 sm:py-20 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
            <svg className="absolute top-1/2 left-10 size-96 text-brand-teal" viewBox="0 0 100 100" fill="currentColor">
              <path d="M30,50 C50,20 70,80 90,50" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6 relative z-10">
            <span className="grid size-12 place-items-center rounded-full bg-brand-rose/25 text-brand-rose mx-auto">
              <Stethoscope className="size-6" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              {settings.doctorsPage.advancedHeading}
            </h2>
            <div className="h-0.5 w-16 bg-brand-teal mx-auto" />
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {settings.doctorsPage.advancedBody}
            </p>
          </div>
        </section>
      )}

      {/* Team Behind Success Section */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          {(settings.doctorsPage?.teamHeading || settings.doctorsPage?.teamBody) && (
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center bg-white rounded-2xl p-6 sm:p-10 border border-slate-100 shadow-soft">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-black uppercase tracking-widest text-brand-rose flex items-center gap-1.5">
                  <Users className="size-4 animate-pulse" /> Sreya Staff
                </span>
                <h2 className="text-3xl font-black text-brand-navy tracking-tight font-display">
                  {settings.doctorsPage.teamHeading}
                </h2>
                <div className="h-0.5 w-12 bg-brand-rose" />
                <p className="text-sm leading-relaxed text-slate-600">
                  {settings.doctorsPage.teamBody}
                </p>
              </div>
              <div className="lg:col-span-5 relative rounded-xl overflow-hidden h-64 sm:h-72 border border-slate-100 shadow-inner">
                {settings.doctorsPage?.teamImage ? (
                  <img
                    src={settings.doctorsPage.teamImage}
                    alt="Sreya Clinical Team"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Award className="size-12" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Doctor Cards list */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-brand-teal">Profiles</span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy font-display">
                Our Specialists
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8">
              {items.map((doctor) => (
                <DoctorProfileCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Sreya's Journey Timeline */}
      <section className="bg-white py-16 sm:py-24 border-t border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Timeline Header Section with 1:1 Overlapping Image Frames */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center mb-20">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Our Story & Milestones</span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display leading-tight">
                {settings.journeyTitle || "Sreya's Journey"}
              </h2>
              <div className="h-1 w-16 bg-brand-rose rounded" />
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {settings.journeyTagline || "Providing Affordable, Quality Healthcare for 2 decades."}
              </p>
            </div>
            
            <div className="lg:col-span-6 relative flex items-center justify-center h-[340px] sm:h-[400px]">
              {/* Overlapping Square Frames */}
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

          {/* Animated Vertical Timeline */}
          <div className="relative border-l-2 border-slate-100 pl-6 ml-4 sm:ml-8 space-y-16 py-8">
            {(settings.journeyMilestones || []).map((milestone, idx) => {
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
                <motion.article 
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative space-y-4"
                >
                  {/* Timeline Badge Bullet (Circle with Year) */}
                  <span className="absolute -left-[35px] sm:-left-[43px] top-1 grid size-8 sm:size-10 place-items-center rounded-full bg-brand-rose text-white text-[9px] sm:text-xs font-black ring-4 ring-white shadow-md">
                    {milestone.year}
                  </span>

                  <div className="pl-2 sm:pl-4 space-y-3">
                    <span className="text-xs font-black uppercase text-brand-teal tracking-wider block">
                      {milestone.date || 'Milestone'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-brand-navy font-display leading-tight">
                      {milestone.description}
                    </h3>
                    
                    {/* Bullet Points */}
                    {bullets.length > 0 && (
                      <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 pt-2">
                        {bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-sm text-slate-655 font-semibold">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-rose" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Milestone Image Gallery Grid */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4 pt-2">
                        {images.map((img, imgIdx) => (
                          <div key={imgIdx} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 transition-all hover:shadow-md duration-300">
                            <img 
                              src={img} 
                              alt={`${milestone.year} milestone scene`} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-350"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </div>

          {/* Concluding Staircase Graphic & Stats Banner */}
          <div className="mt-20 pt-10 border-t border-slate-100">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              
              {/* Staircase Graphic (2007 -> 2010 -> 2017 -> 2026) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
                <h4 className="text-xs font-black uppercase text-brand-rose tracking-widest mb-8">Next Giant Leap</h4>
                <div className="flex items-end justify-center gap-2 h-44 w-full max-w-xs relative">
                  {/* Step 2007 */}
                  <div className="flex flex-col items-center w-16 group">
                    <span className="text-[10px] font-black text-brand-navy mb-1 group-hover:text-brand-rose transition-colors">2007</span>
                    <div className="w-full h-8 bg-brand-blush rounded-t-lg border-x border-t border-brand-rose/20 shadow-sm flex items-center justify-center font-bold text-xs text-brand-rose">Step 1</div>
                  </div>
                  {/* Step 2010 */}
                  <div className="flex flex-col items-center w-16 group">
                    <span className="text-[10px] font-black text-brand-navy mb-1 group-hover:text-brand-rose transition-colors">2010</span>
                    <div className="w-full h-16 bg-[#e0f2fe] rounded-t-lg border-x border-t border-[#0284c7]/20 shadow-sm flex items-center justify-center font-bold text-xs text-[#0284c7]">Step 2</div>
                  </div>
                  {/* Step 2017 */}
                  <div className="flex flex-col items-center w-16 group">
                    <span className="text-[10px] font-black text-brand-navy mb-1 group-hover:text-brand-rose transition-colors">2017</span>
                    <div className="w-full h-24 bg-brand-teal/15 rounded-t-lg border-x border-t border-brand-teal/20 shadow-sm flex items-center justify-center font-bold text-xs text-brand-teal">Step 3</div>
                  </div>
                  {/* Step 2026 */}
                  <div className="flex flex-col items-center w-16 group">
                    <span className="text-[10px] font-black text-brand-navy mb-1 group-hover:text-brand-rose transition-colors">2026</span>
                    <div className="w-full h-32 bg-primary/10 rounded-t-lg border-x border-t border-primary/20 shadow-lg flex items-center justify-center font-bold text-xs text-primary animate-pulse">Step 4</div>
                  </div>
                </div>
                <p className="text-center text-[10px] font-black text-brand-navy uppercase tracking-widest mt-6">
                  Now Ready for the Next Giant Leap
                </p>
              </div>

              {/* Stats Block & Doctor Profile */}
              <div className="lg:col-span-7 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-cream border border-slate-100 rounded-2xl p-5 text-center shadow-soft">
                    <span className="block text-2xl sm:text-3xl font-black text-brand-navy font-display">{settings.journeyStats?.deliveries || "6000+"}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">Deliveries</span>
                  </div>
                  <div className="bg-brand-cream border border-slate-100 rounded-2xl p-5 text-center shadow-soft">
                    <span className="block text-2xl sm:text-3xl font-black text-brand-navy font-display">{settings.journeyStats?.infertility || "10,000+"}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">Infertility Treatments</span>
                  </div>
                  <div className="bg-brand-cream border border-slate-100 rounded-2xl p-5 text-center shadow-soft">
                    <span className="block text-2xl sm:text-3xl font-black text-brand-navy font-display">{settings.journeyStats?.laparoscopic || "7000+"}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">Laparoscopic Surgeries</span>
                  </div>
                  <div className="bg-brand-cream border border-slate-100 rounded-2xl p-5 text-center shadow-soft">
                    <span className="block text-2xl sm:text-3xl font-black text-brand-navy font-display">{settings.journeyStats?.camps || "1500+"}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 block">Free Medical Camps</span>
                  </div>
                </div>

                {/* Doctor profile block */}
                {settings.journeyDoctor?.name && (
                  <div className="flex flex-col sm:flex-row gap-5 items-center bg-white border border-slate-100 rounded-2xl p-5 shadow-soft">
                    {settings.journeyDoctor.photoUrl && (
                      <div className="size-20 shrink-0 rounded-full overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
                        <img src={settings.journeyDoctor.photoUrl} alt={settings.journeyDoctor.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="text-center sm:text-left space-y-1">
                      <h5 className="font-black text-brand-navy text-lg">{settings.journeyDoctor.name}</h5>
                      <div className="text-xs text-slate-550 font-bold space-y-0.5 whitespace-pre-line">
                        {settings.journeyDoctor.qualifications}
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
