import { useEffect, useState } from 'react'
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
  const { data: dbDoctors } = useFirestoreCollection('doctors', fallbackDoctors)
  const items = dbDoctors && dbDoctors.length ? dbDoctors : fallbackDoctors
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

      {/* Patient journey steps */}
      {journeySteps.length ? (
        <section className="bg-white py-16 sm:py-20 border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Your Journey With Us</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-brand-navy sm:text-4xl">
                  Your Journey With {leadDoctor?.name || 'Dr. Vasanta Kiran'}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  From first consultation to ongoing support, the doctor-led pathway keeps every step clear,
                  personal, and connected to your reports.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/appointment"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-white shadow-soft transition hover:bg-primary-dark"
                  >
                    <CalendarHeart className="size-4" /> Book Appointment
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-black text-brand-navy transition hover:border-primary hover:text-primary"
                  >
                    View Contact
                  </Link>
                </div>
              </div>

              <div className="relative grid gap-5">
                <div className="absolute bottom-8 left-6 top-8 hidden w-px bg-[var(--color-border)] sm:block" />
                {journeySteps.map((step, index) => (
                  <motion.article
                    key={`${step.title}-${index}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="relative grid gap-4 rounded-lg border border-[var(--color-border)] bg-brand-cream p-4 shadow-soft sm:grid-cols-[auto_150px] sm:items-center sm:pl-16"
                  >
                    <span className="absolute left-0 top-6 z-10 hidden size-12 -translate-x-0 place-items-center rounded-full bg-primary text-sm font-black text-white shadow-lg ring-4 ring-white sm:grid">
                      {index + 1}
                    </span>
                    <div>
                      <div className="mb-3 flex items-center gap-2 sm:hidden">
                        <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-black text-white">
                          {index + 1}
                        </span>
                        <CheckCircle2 className="size-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-black text-brand-navy">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                    </div>
                    {step.imageUrl ? (
                      <img
                        src={step.imageUrl}
                        alt={step.title}
                        className="h-36 w-full rounded-lg object-cover sm:h-32"
                        loading="lazy"
                      />
                    ) : null}
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
