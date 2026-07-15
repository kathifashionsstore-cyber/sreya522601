import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Phone,
  MessageSquare,
  HeartPulse,
  UserCheck,
  ChevronRight,
  Activity,
  Award,
  Layers,
  ChevronDown,
  Baby,
  Star,
  MapPin,
  ShieldCheck,
  FileText
} from 'lucide-react'
import { breadcrumbJsonLd, faqJsonLd } from '../../lib/seo'
import { Seo } from '../shared/Seo'
import { AppointmentForm } from '../appointment/AppointmentForm'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import {
  getLockedSubServices,
  getServiceCategoryUrl,
  getServiceUrl,
  subServices as fallbackSubServices,
} from '../../mockData/services'
import { doctors as fallbackDoctors } from '../../data/seed'

const iconMap = {
  Clock,
  TrendingUp,
  HelpCircle,
  ShieldAlert,
  Stethoscope,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  UserCheck,
  Activity,
  Award,
  Layers,
  Baby,
  Star,
  MapPin,
  ShieldCheck,
  FileText
}

function getYoutubeId(url = '') {
  const value = String(url || '').trim()
  if (!value) return ''

  try {
    const parsed = new URL(value)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || ''
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v') || ''
      const [kind, id] = parsed.pathname.split('/').filter(Boolean)
      if (['embed', 'shorts', 'live'].includes(kind)) return id || ''
    }
  } catch {
    const match = value.match(/(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/|live\/)|youtu\.be\/)([^"&?/\s]{11})/)
    return match?.[1] || ''
  }

  return ''
}

function buildVideoEmbedUrl(url = '') {
  const value = String(url || '').trim()
  if (!value) return ''
  const id = getYoutubeId(value)
  if (!id) return value

  const params = new URLSearchParams({
    rel: '0',
    autoplay: '1',
    mute: '1',
    enablejsapi: '1'
  })

  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}export function ServiceDetailLayout({ category, service: rawService }) {
  const service = useMemo(() => {
    if (!rawService) return {}

    // 1. Safe Overview paragraphs
    let overview = []
    if (rawService.whatIsIt && typeof rawService.whatIsIt === 'string' && rawService.whatIsIt.trim()) {
      overview = [rawService.whatIsIt]
    } else if (Array.isArray(rawService.overview) && rawService.overview.length > 0) {
      overview = rawService.overview
    } else if (typeof rawService.overview === 'string') {
      overview = [rawService.overview]
    } else {
      overview = [
        `${rawService.title || 'This'} is a specialized clinical procedure performed at Sreya Hospitals & IVF Centre. This pathway is led by our fertility specialist to bring clarity and target successful outcomes.`,
        "The appropriate pathway is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ]
    }

    // 2. Safe Causes
    let causes = null
    if (Array.isArray(rawService.causes)) {
      causes = rawService.causes.map((c, idx) => {
        if (typeof c === 'string') {
          return { title: `Factor ${idx + 1}`, description: c }
        }
        return c
      })
    } else if (rawService.causes) {
      causes = [{ title: 'Overview of Causes', description: String(rawService.causes) }]
    }

    // 3. Safe Treatment Options
    let treatmentOptions = []
    if (Array.isArray(rawService.treatmentOptions)) {
      treatmentOptions = rawService.treatmentOptions
    } else if (Array.isArray(rawService.options)) {
      treatmentOptions = rawService.options
    } else {
      treatmentOptions = [
        {
          tabName: 'Standard Protocol',
          description: 'A standard evaluation and treatment protocol customized for the individual patient by our specialists.',
          whoMayBenefit: 'Couples seeking specialized fertility assistance.',
          recoveryInfo: 'Discuss with your primary physician.'
        }
      ]
    }

    // 4. Safe FAQ List
    let faqs = []
    if (Array.isArray(rawService.faqs)) {
      faqs = rawService.faqs
    } else {
      faqs = [
        { q: `Is ${rawService.title || 'this service'} suitable for everyone?`, a: 'Suitability depends on consultation, age, reports, and medical history.' },
        { q: 'Will the doctor explain costs?', a: 'Yes. The team should provide a personalised estimate after assessment.' },
      ]
    }

    // 5. Safe Diagnosis Steps
    let diagnosisSteps = []
    if (Array.isArray(rawService.diagnosisSteps)) {
      diagnosisSteps = rawService.diagnosisSteps
    } else if (Array.isArray(rawService.stepsProcess)) {
      diagnosisSteps = rawService.stepsProcess.map((step) => ({
        title: step.title,
        description: Array.isArray(step.bullets) ? step.bullets.join('. ') : step.bullets
      }))
    } else {
      diagnosisSteps = [
        { title: 'Consultation', description: 'Discuss symptoms, goals, and previous records with the specialist.' },
        { title: 'Focused Assessment', description: 'Plan only the investigations that are clinically useful.' },
        { title: 'Clear Diagnosis', description: 'Review results and explain the likely diagnosis in practical language.' },
        { title: 'Next-Step Plan', description: 'Create a treatment or follow-up pathway matched to the patient.' },
      ]
    }

    // 6. Safe Care Journey Steps (MUST be array of strings to avoid rendering crash)
    let careJourneySteps = []
    if (Array.isArray(rawService.careJourneySteps)) {
      careJourneySteps = rawService.careJourneySteps
    } else if (Array.isArray(rawService.stepsProcess)) {
      careJourneySteps = rawService.stepsProcess.map((step) => step.title || String(step))
    } else {
      careJourneySteps = [
        'Initial Evaluation & Scan',
        'Tailored Treatment Induction',
        'Outcome Review & Next Steps'
      ]
    }

    // 7. Safe Patient Education Tips
    let patientEducationTips = []
    if (Array.isArray(rawService.patientEducationTips)) {
      patientEducationTips = rawService.patientEducationTips
    } else if (Array.isArray(rawService.homeCareAdvice)) {
      patientEducationTips = rawService.homeCareAdvice
    } else {
      patientEducationTips = [
        'Bring previous reports and prescriptions.',
        'Avoid self-medication and ask the care team before changing medicines.',
        'Keep emergency contact details ready for urgent symptoms.'
      ]
    }

    // 8. Safe Symptoms Normalize
    let symptoms = []
    if (Array.isArray(rawService.symptoms)) {
      symptoms = rawService.symptoms.map((item, idx) => {
        if (typeof item === 'string') {
          return { icon: 'Stethoscope', title: `Symptom ${idx + 1}`, description: item }
        }
        return item
      })
    }

    const videoUrl = rawService.videoUrl || rawService.youtubeUrl || ''

    return {
      ...rawService,
      overview,
      causes,
      treatmentOptions,
      faqs,
      diagnosisSteps,
      careJourneySteps,
      patientEducationTips,
      relevantDiagnosticTests: rawService.relevantDiagnosticTests || [],
      symptoms,
      riskFactors: rawService.riskFactors || [],
      videoUrl,
      videoEmbedUrl: buildVideoEmbedUrl(videoUrl),
      showVideoSection: Boolean(videoUrl),
      heroHeading: rawService.heroHeading || rawService.title,
      heroSubtitle: rawService.heroSubtitle || rawService.tagline,
      heroImage: rawService.heroImage || rawService.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
      categoryId: rawService.categoryId || rawService.category || category.id,
      category: rawService.categoryId || rawService.category || category.id,
      whyChooseOverride: rawService.whyChooseOverride || [],
      preventionTips: rawService.preventionTips || [],
      patientGuideUrl: rawService.patientGuideUrl || '',
      enabledSections: rawService.enabledSections || {}
    }
  }, [rawService, category.id])

  const [activeTab, setActiveTab] = useState(0)
  const [activeSection, setActiveSection] = useState('overview')

  const heroSlides = useMemo(() => {
    if (Array.isArray(service.heroSlides) && service.heroSlides.length > 0) {
      return service.heroSlides
    }
    return [
      {
        imageUrl: service.heroImage,
        title: service.heroHeading || service.title,
        subtitle: service.heroSubtitle || service.shortDescription
      }
    ]
  }, [service])

  const [slideIndex, setSlideIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (heroSlides.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [heroSlides, isPaused])

  const { settings } = useSiteSettings()
  const { data: dbDoctors } = useFirestoreCollection('doctors', [])
  const { data: dbSubServices } = useFirestoreCollection('subServices', [])
  const { data: dbFacilities } = useFirestoreCollection('facilities', [])

  const activeDoctors = dbDoctors
  const leadDoctor = activeDoctors[0]

  const allSubServices = getLockedSubServices(dbSubServices)

  // Programmatically find related services in the same category
  const relatedServices = useMemo(() => {
    return allSubServices
      .filter((s) => (s.categoryId || s.category) === category.id && s.slug !== service.slug && s.active !== false)
      .slice(0, 4)
  }, [allSubServices, category.id, service.slug])

  const labFacilities = useMemo(() => {
    return (dbFacilities && dbFacilities.length ? dbFacilities : [])
      .filter((f) => f.category === 'lab' || f.category === 'ivf' || f.category === 'facilities')
      .slice(0, 3)
  }, [dbFacilities])

  const displayFacilities = useMemo(() => {
    if (labFacilities.length > 0) return labFacilities
    return [
      { title: 'Laminar Flow Cabinets', description: 'Provides a sterile work zone with horizontal clean air flow for gamete handling.' },
      { title: 'CO2/Tri-Gas Incubators', description: 'Controls heat, carbon dioxide, and oxygen to replicate natural embryo growth environments.' },
      { title: 'Stereo Zoom Microscopes', description: 'High-magnification micromanipulators for ICSI and oocyte identification checks.' },
    ]
  }, [labFacilities])

  const whyChooseBlocks = useMemo(() => {
    if (Array.isArray(service.whyChooseOverride) && service.whyChooseOverride.length > 0) {
      return service.whyChooseOverride.map((item, idx) => ({
        heading: item.heading,
        body: item.body,
        iconKey: item.iconKey || 'Award',
        label: item.label || `Value ${idx + 1}`
      }))
    }
    return [
      { heading: 'Specialist Clinical Experience', body: "Led by Dr. Vasanta Kiran Mekala, offering dedicated expertise in IVF cycles and laparoscopy.", iconKey: 'Award', label: '17+ Years' },
      { heading: 'Parenthood Journeys Helped', body: "Trusted by families across Palnadu district to deliver clinical outcomes.", iconKey: 'Baby', label: '2,000+ Journeys' },
      { heading: 'First Regional Test-Tube Baby', body: "Pioneered advanced embryology and test-tube baby delivery in the Narasaraopet region.", iconKey: 'Star', label: 'Pioneer Status' },
      { heading: 'Complete Reproductive Care', body: "From scans and baseline hormones to micro-injection and treatment-related keyhole procedures.", iconKey: 'Layers', label: 'One-Roof Facility' },
      { heading: 'Dedicated Local Focus', body: "We focus all resources on a single hospital, ensuring personalized treatment adjustments.", iconKey: 'MapPin', label: 'No Corporate Assembly-Line' },
      { heading: 'Honest Outlines', body: "Detailed costing timelines explained clearly during consultation, avoiding hidden charges.", iconKey: 'ShieldCheck', label: 'Transparent Pricing' },
    ]
  }, [service.whyChooseOverride])

  const navItems = useMemo(() => {
    const items = []
    items.push({ id: 'overview', label: 'Overview' })
    
    if (service.enabledSections?.symptoms !== false && service.symptoms?.length > 0) {
      items.push({ id: 'indications', label: service.pageType === 'treatment' ? 'Indications' : 'Checks' })
    }
    
    if (service.enabledSections?.causes !== false && service.causes?.length > 0) {
      items.push({ id: 'causes', label: 'Causes & Risks' })
    }
    
    if (service.enabledSections?.diagnosis !== false && service.diagnosisSteps?.length > 0) {
      items.push({ id: 'timeline', label: 'Process Steps' })
    }
    
    if (service.enabledSections?.treatment !== false && service.treatmentOptions?.length > 0) {
      items.push({ id: 'options', label: service.pageType === 'treatment' ? 'Treatment Options' : 'Test Details' })
    }
    
    if (service.enabledSections?.journey !== false && service.careJourneySteps?.length > 0) {
      items.push({ id: 'journey', label: 'Care Journey' })
    }
    
    items.push({ id: 'specialist', label: 'Specialist' })
    
    if (service.enabledSections?.prevention !== false && service.preventionTips?.length > 0) {
      items.push({ id: 'prevention', label: 'Lifestyle Tips' })
    }
    
    if (service.enabledSections?.closing !== false && service.faqs?.length > 0) {
      items.push({ id: 'faqs', label: 'FAQs' })
    }

    if (service.enabledSections?.gallery !== false && service.gallery?.length > 0) {
      items.push({ id: 'gallery', label: 'Gallery' })
    }
    
    return items
  }, [service])

  // Sticky sub-nav scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      const activeIds = navItems.map((item) => item.id)
      const scrollPos = window.scrollY + 180

      for (const id of activeIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navItems])

  const handleSubNavClick = (id) => {
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 140,
        behavior: 'smooth'
      })
    }
  }

  // Pre-fill department mapping
  const departmentMapping = service.title

  // JSON-LD schemas
  const jsonLd = useMemo(() => {
    const path = getServiceUrl(service, [category])
    return [
      breadcrumbJsonLd([
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: category.title, href: getServiceCategoryUrl(category) },
        { name: service.title, href: path },
      ]),
      faqJsonLd(service.faqs || []),
    ]
  }, [category, service])

  return (
    <>
      <Seo
        title={service.seo?.title || `${service.title} in Narasaraopet | Sreya Hospitals`}
        description={service.seo?.description || service.shortDescription}
        image={service.heroImage}
        jsonLd={jsonLd}
      />

      <div className="bg-bg-alt">
        {/* ================= SECTION 1: HERO ================= */}
        <section 
          className="relative min-h-[90vh] flex items-center bg-brand-navy overflow-hidden select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Parallax Background Slideshow */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.img 
                key={slideIndex}
                src={heroSlides[slideIndex].imageUrl} 
                alt={heroSlides[slideIndex].title || service.title}
                className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.38 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/95 to-brand-navy/60" />
          </div>

          <div className="relative z-10 w-full mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 text-white">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-350 mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-3.5 text-slate-500" />
              <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
              <ChevronRight className="size-3.5 text-slate-500" />
              <Link to={getServiceCategoryUrl(category)} className="hover:text-primary transition-colors">{category.title}</Link>
              <ChevronRight className="size-3.5 text-slate-500" />
              <span className="text-white">{service.title}</span>
            </nav>

            <div className="max-w-3xl space-y-6">
              <span className="eyebrow-badge bg-primary-light/20 text-primary-light border border-primary-light/30">
                Advanced Fertility Care
              </span>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white font-display">
                    {heroSlides[slideIndex].title || service.title}
                  </h1>
                  <p className="text-xl font-medium text-slate-205 leading-relaxed font-body">
                    {heroSlides[slideIndex].subtitle || service.heroSubtitle || service.shortDescription}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => handleSubNavClick('appointment-booking')}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand-rose px-6 py-3 text-sm font-black text-white hover:bg-brand-rose-dark transition shadow-lg hover:shadow-xl"
                >
                  Book Appointment <ArrowRight className="size-4" />
                </button>
                <a
                  href={`tel:${settings.phoneMobile}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/20 transition backdrop-blur-sm"
                >
                  <Phone className="size-4 text-primary-light" /> Call Support
                </a>
              </div>

              {/* Trust Indicators Row */}
              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-6 text-xs font-bold text-slate-350 tracking-wide uppercase">
                <span className="flex items-center gap-2">
                  <UserCheck className="size-4 text-brand-rose" /> Experienced Specialist
                </span>
                <span className="flex items-center gap-2">
                  <Layers className="size-4 text-brand-teal" /> Advanced Diagnostics
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="size-4 text-brand-rose" /> Personalised Treatment
                </span>
                <span className="flex items-center gap-2">
                  <Activity className="size-4 text-brand-teal" /> Patient-First Care
                </span>
              </div>
            </div>
          </div>

          {/* Dots & Nav Arrows */}
          {heroSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-black/25 text-white hover:bg-black/50 border border-white/10 transition z-20"
                aria-label="Previous Slide"
              >
                <ChevronRight className="size-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => setSlideIndex((prev) => (prev + 1) % heroSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-black/25 text-white hover:bg-black/50 border border-white/10 transition z-20"
                aria-label="Next Slide"
              >
                <ChevronRight className="size-5" />
              </button>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      slideIndex === idx ? 'w-6 bg-brand-rose' : 'w-2 bg-white/40'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ================= SPECIALIST VIDEO (DIRECTLY UNDER HERO) ================= */}
        {service.enabledSections?.video !== false && service.showVideoSection && (
          <section className="bg-brand-cream/35 py-12 border-b border-[var(--color-border)]">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-primary font-display block text-center">
                Specialist Video Insights
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-text-primary text-center mb-6">
                Detailed Guide to {service.title}
              </h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border border-[var(--color-border)]">
                {getYoutubeId(service.videoUrl) ? (
                  <>
                    <iframe
                      src={service.videoEmbedUrl}
                      title={`YouTube video player for ${service.title}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-[10px] font-black text-white px-2.5 py-1.5 rounded uppercase tracking-wider select-none pointer-events-none">
                      Muted Autoplay — Use controls to unmute
                    </div>
                  </>
                ) : (
                  <video
                    src={service.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 2: STICKY SUB-NAV ================= */}
        <nav className="sticky top-16 z-30 bg-white border-b border-border shadow-sm overflow-x-auto select-none scrollbar-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-start gap-8 text-sm font-bold text-text-secondary whitespace-nowrap">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSubNavClick(item.id)}
                  className={`h-full border-b-2 transition-all ${
                    activeSection === item.id ? 'border-primary text-primary' : 'border-transparent hover:text-text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleSubNavClick('appointment-booking')}
                className="ml-auto bg-primary text-white text-xs px-4 py-2 rounded-lg hover:bg-primary-dark transition hidden md:block"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN BODY CONTAINER */}
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">

          {/* ================= SECTION 3: OVERVIEW ================= */}
          <section id="overview" className="grid gap-8 lg:grid-cols-12 items-center bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
            <div className="lg:col-span-5 relative rounded-xl overflow-hidden h-72 sm:h-96">
              <img 
                src={service.whatIsItImage || service.heroImage} 
                alt="Diagnostics view"
                className="w-full h-full object-cover" 
                loading="lazy"
              />
              <span className="absolute top-4 left-4 eyebrow-badge bg-primary text-white">
                {category.title}
              </span>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">
                Understanding the {service.pageType === 'treatment' ? 'Procedure' : 'Test'}
              </span>
              <h2 className="text-3xl font-black text-text-primary">
                What is {service.title}?
              </h2>
              {service.overview.map((paragraph, index) => (
                <p key={index} className="text-text-secondary leading-relaxed text-base">
                  {paragraph}
                </p>
              ))}
              {/* Cautious framing info card */}
              <div className="rounded-xl border border-brand-teal/20 bg-brand-teal/5 p-5 mt-4">
                <p className="text-sm font-semibold text-primary leading-relaxed">
                  <strong>Specialist Guidance:</strong> Early evaluation can help our specialist understand your situation and recommend an appropriate path forward.
                </p>
              </div>
              {/* PDF Guide Download Button */}
              {service.patientGuideUrl && (
                <div className="pt-4 animate-fadeIn">
                  <a
                    href={service.patientGuideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-rose px-5 py-2.5 text-xs font-black text-white hover:bg-brand-rose-dark transition shadow-md"
                  >
                    <FileText className="size-4" /> Download Patient Guide (PDF)
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* ================= SECTION 3: CLASSIFICATIONS & TYPES ================= */}
          {service.enabledSections?.classification !== false && Array.isArray(service.classification) && service.classification.length > 0 && (
            <section id="classification" className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Classifications & Types</span>
                <h2 className="text-2xl font-black text-text-primary mt-2">Types & Classifications of {service.title}</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {service.classification.map((item, index) => (
                  <article key={index} className="rounded-xl border border-border bg-bg-alt p-5 space-y-2">
                    <h3 className="font-bold text-text-primary text-base">{item.name}</h3>
                    <p className="text-xs leading-relaxed text-text-secondary">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ================= SECTION 4: QUICK INFO CARDS ================= */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-black text-text-muted uppercase tracking-wider">Category</p>
                <h3 className="text-lg font-bold text-text-primary mt-2">
                  {service.pageType === 'treatment' ? 'Fertility Treatment' : 'Fertility Test'}
                </h3>
              </div>
              <span className="mt-4 text-xs font-bold text-brand-rose">Sreya Clinic Protocol</span>
            </article>

            <article className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-black text-text-muted uppercase tracking-wider">Consultation Type</p>
                <h3 className="text-lg font-bold text-text-primary mt-2">Specialist Evaluation</h3>
              </div>
              <span className="mt-4 text-xs font-bold text-brand-teal">Led by Dr. Vasanta Kiran</span>
            </article>

            <article className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-black text-text-muted uppercase tracking-wider">Diagnostic Support</p>
                <h3 className="text-lg font-bold text-text-primary mt-2">
                  {service.category === 'fertility-treatments' ? 'Advanced Embryology Lab' : 'In-House Scans'}
                </h3>
              </div>
              <span className="mt-4 text-xs font-bold text-brand-rose">Fully Equipped Facility</span>
            </article>

            <article className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-black text-text-muted uppercase tracking-wider">Availability</p>
                <h3 className="text-lg font-bold text-text-primary mt-2">Monday to Saturday</h3>
              </div>
              <span className="mt-4 text-xs font-bold text-brand-teal">09:00 AM – 06:00 PM</span>
            </article>
          </section>

          {/* ================= SECTION 5: SYMPTOMS / INDICATIONS ================= */}
          {service.enabledSections?.symptoms !== false && Array.isArray(service.symptoms) && service.symptoms.length > 0 && (
            <section id="indications" className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">
                {service.pageType === 'treatment' ? 'When It Is Timed' : 'Investigative Focus'}
              </span>
              <h2 className="text-2xl font-black text-text-primary mt-2">
                {service.pageType === 'treatment' ? 'Common Indications & Candidacy' : 'What This Test Checks'}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                {service.pageType === 'treatment' 
                  ? 'IUI, IVF, and advanced fertility processes are typically recommended under specific clinical conditions.' 
                  : 'Diagnostic profiles check critical fertility levels and structural integrity parameters.'}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.symptoms?.map((item, index) => {
                const Icon = iconMap[item.icon] || Stethoscope
                return (
                  <article key={index} className="rounded-xl border border-border bg-bg-alt p-5 flex gap-4">
                    <span className="grid size-10 place-items-center rounded-lg bg-brand-blush text-brand-rose shrink-0">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-text-primary text-base">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-text-secondary">{item.description}</p>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Cautious disclaimer callout */}
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-900 leading-relaxed flex gap-3">
              <ShieldAlert className="size-5 shrink-0 text-amber-700 mt-0.5" />
              <p>
                <strong>Clinical Note:</strong> Symptoms and indicators vary per patient. A specialist consultation and in-person evaluation are required to analyze your health profile and recommend next steps.
              </p>
            </div>
          </section>
          )}

          {/* ================= SECTION 6: CAUSES & RISK FACTORS ================= */}
          {service.enabledSections?.causes !== false && (service.causes?.length > 0 || service.riskFactors?.length > 0) && (
            <section id="causes" className="grid gap-8 lg:grid-cols-12 items-start">
              {service.causes?.length > 0 && (
                <div className={`${service.riskFactors?.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6`}>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Underlying Factors</span>
                    <h2 className="text-2xl font-black text-text-primary mt-2">Possible Causes & Contributing Factors</h2>
                  </div>
                  <div className="space-y-4">
                    {service.causes.map((cause, index) => (
                      <article key={index} className="flex gap-4 p-4 rounded-xl bg-bg-alt border border-border">
                        <span className="grid size-8 place-items-center rounded-full bg-primary text-white text-sm font-black shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-text-primary">{cause.title}</h3>
                          <p className="mt-2 text-xs text-text-secondary leading-relaxed">{cause.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {service.riskFactors?.length > 0 && (
                <div className={`${service.causes?.length > 0 ? 'lg:col-span-5' : 'lg:col-span-12'} bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6`}>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Risk Screening</span>
                    <h2 className="text-2xl font-black text-text-primary mt-2">Risk Profiles & Tags</h2>
                  </div>
                  <div className="space-y-4">
                    {service.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-bg-alt">
                        <p className="text-xs font-medium leading-relaxed text-text-secondary">
                          {factor.text}
                        </p>
                        {factor.level && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            factor.level === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {factor.level}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ================= SECTION 7: WHEN TO CONSULT ================= */}
          <section className="relative overflow-hidden rounded-2xl bg-brand-navy p-8 sm:p-12 text-white shadow-lg border border-white/5">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/60 opacity-90" />
            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-primary-light">Guidance Protocol</span>
              <h2 className="text-3xl font-black text-white mt-2">When should you consult a fertility specialist?</h2>
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                If you have been trying to conceive for 12 months (or 6 months if the female partner is over 35), or have irregular menstrual cycles, history of pelvic infections, or abnormal semen profiles, early clinical evaluation is recommended.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => handleSubNavClick('appointment-booking')}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-rose px-5 py-2.5 text-sm font-black text-white hover:bg-brand-rose-dark transition shadow-md"
                >
                  Schedule Evaluation
                </button>
                <a
                  href={`tel:${settings.phoneMobile}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-black text-white hover:bg-white/10 transition"
                >
                  Call Clinic Directly
                </a>
              </div>
              <p className="mt-6 text-xs text-slate-400 font-bold leading-normal">
                * Our counseling team provides medically safe, non-alarmist explanations. Emergency calls should go directly to local emergency support lines.
              </p>
            </div>
          </section>

          {/* ================= SECTION 8: DIAGNOSIS / HOW TEST WORKS ================= */}
          {service.enabledSections?.diagnosis !== false && Array.isArray(service.diagnosisSteps) && service.diagnosisSteps.length > 0 && (
            <section id="timeline" className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Procedure Pathway</span>
              <h2 className="text-2xl font-black text-text-primary mt-2">
                Step-by-Step Procedure Process
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                A structured overview of how the {service.pageType === 'treatment' ? 'treatment cycle' : 'test'} is completed at Sreya Hospitals.
              </p>
            </div>

            {/* Vertical timeline */}
            <div className="relative border-l-2 border-slate-100 pl-6 ml-4 space-y-8 py-4">
              {service.diagnosisSteps.map((step, index) => (
                <article key={index} className="relative">
                  {/* Circle Dot */}
                  <span className="absolute -left-[35px] top-0.5 grid size-6 place-items-center rounded-full bg-primary text-white text-xs font-black">
                    {step.step || index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-text-primary text-base">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary max-w-3xl">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Relevant diagnostic offerings */}
            {Array.isArray(service.relevantDiagnosticTests) && service.relevantDiagnosticTests.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider mb-4">Related Diagnostic Assays</h3>
                <div className="flex flex-wrap gap-2">
                  {service.relevantDiagnosticTests.map((t, idx) => (
                    <span key={idx} className="rounded-full bg-bg-alt border border-border px-3 py-1 text-xs font-bold text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
          )}

          {/* ================= SECTION 9: TREATMENT OPTIONS ================= */}
          {service.enabledSections?.treatment !== false && Array.isArray(service.treatmentOptions) && service.treatmentOptions.length > 0 && (
            <section id="options" className="bg-brand-navy rounded-2xl p-6 sm:p-8 text-white border border-white/5 shadow-sm space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-primary-light">Options & Pathways</span>
              <h2 className="text-2xl font-black text-white mt-2">
                {service.pageType === 'treatment' ? 'Treatment Protocols' : 'Procedure Details'}
              </h2>
            </div>

            {/* Tabbed interface */}
            <div className="grid gap-6 lg:grid-cols-12 items-start">
              <div className="lg:col-span-4 flex flex-col gap-2">
                {service.treatmentOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left p-4 rounded-xl font-bold transition-all ${
                      activeTab === idx 
                        ? 'bg-white/10 border-l-4 border-brand-rose text-white' 
                        : 'border-l-4 border-transparent text-slate-350 hover:bg-white/5'
                    }`}
                  >
                    {opt.tabName}
                  </button>
                ))}
              </div>

              <div className="lg:col-span-8 bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
                <h3 className="text-xl font-black text-white">
                  {service.treatmentOptions[activeTab]?.tabName}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {service.treatmentOptions[activeTab]?.description}
                </p>
                <div>
                  <h4 className="text-xs font-black uppercase text-brand-rose tracking-wider">Who may benefit</h4>
                  <p className="mt-1 text-sm text-slate-200">
                    {service.treatmentOptions[activeTab]?.whoMayBenefit}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-brand-teal tracking-wider">Recovery & Guidelines</h4>
                  <p className="mt-1 text-sm text-slate-200">
                    {service.treatmentOptions[activeTab]?.recoveryInfo}
                  </p>
                </div>
              </div>
            </div>

            {/* Mandatory warning disclaimer */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-5 mt-6 text-xs text-slate-300 leading-relaxed flex gap-3">
              <ShieldAlert className="size-5 shrink-0 text-brand-rose mt-0.5" />
              <p>
                The appropriate treatment is selected after specialist evaluation and may vary according to the patient&apos;s condition, medical history, and diagnostic findings.
              </p>
            </div>
          </section>
          )}

          {/* ================= SECTION 10: YOUR CARE JOURNEY ================= */}
          {service.enabledSections?.journey !== false && Array.isArray(service.careJourneySteps) && service.careJourneySteps.length > 0 && (
            <section id="journey" className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Timeline Guidelines</span>
              <h2 className="text-2xl font-black text-text-primary mt-2">Your Clinical Care Journey</h2>
              <p className="mt-2 text-sm text-text-secondary">
                From initial booking to specialist analysis and follow-up care.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 relative">
              {service.careJourneySteps.map((step, idx) => (
                <div key={idx} className="relative rounded-xl border border-border bg-bg-alt p-4 flex flex-col justify-between min-h-[120px]">
                  <span className="text-2xl font-black text-primary/25">0{idx + 1}</span>
                  <h3 className="font-bold text-xs text-text-primary mt-4 tracking-wide uppercase">{step}</h3>
                </div>
              ))}
            </div>
          </section>
          )}

          {/* ================= SECTION 11: WHY CHOOSE SREYA HOSPITALS ================= */}
          {service.enabledSections?.whyChoose !== false && whyChooseBlocks.length > 0 && (
            <section className="bg-brand-navy rounded-2xl p-8 sm:p-12 text-white border border-white/5 shadow-sm space-y-8 animate-fadeIn">
              <div className="max-w-3xl">
                <span className="text-xs font-black uppercase tracking-widest text-primary-light">Sreya Care Values</span>
                <h2 className="text-3xl font-black text-white mt-2">Why Choose Sreya Hospitals & IVF Centre</h2>
                <p className="mt-3 text-sm text-slate-350 leading-relaxed">
                  Narsaraopet&apos;s pioneer fertility hospital, combining single-location attention and high success rates.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {whyChooseBlocks.map((block, idx) => {
                  const Icon = iconMap[block.iconKey] || Award
                  return (
                    <article key={idx} className="border border-white/10 bg-white/5 rounded-xl p-6 space-y-3">
                      <span className="text-2xl font-black text-brand-rose flex items-center gap-2">
                        <Icon className="size-6 text-brand-rose shrink-0" />
                        {block.label}
                      </span>
                      <h3 className="font-bold text-white text-base">{block.heading}</h3>
                      <p className="text-xs text-slate-350 leading-relaxed">
                        {block.body}
                      </p>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {/* ================= SECTION 12: SPECIALIST DOCTOR SECTION ================= */}
          {leadDoctor && (
            <section id="specialist" className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Your Lead Specialist</span>
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                <div className="lg:col-span-4 group overflow-hidden rounded-xl h-80 sm:h-96 relative border border-border">
                  <img 
                    src={leadDoctor.photoUrl} 
                    alt={leadDoctor.name} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <h2 className="text-3xl font-black text-text-primary">{leadDoctor.name}</h2>
                  <p className="text-sm font-bold text-primary">{leadDoctor.qualifications}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {leadDoctor.bio}
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <Link 
                      to="/doctors" 
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-black text-white hover:bg-primary-dark transition"
                    >
                      View Doctor Profile
                    </Link>
                    <button
                      onClick={() => handleSubNavClick('appointment-booking')}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-black text-text-primary hover:bg-bg-alt transition"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= SECTION 13: MEDICAL TECHNOLOGY ================= */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Clinical Lab Assets</span>
              <h2 className="text-2xl font-black text-text-primary mt-2">Embryology & Diagnostic Facilities</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Our Narasaraopet centre is equipped with standard clinical equipment to support oocyte and sperm culture protocols.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayFacilities.map((facility, idx) => (
                <div key={facility.id || idx} className="p-4 rounded-xl bg-bg-alt border border-border">
                  <h3 className="font-bold text-sm text-text-primary uppercase tracking-wider">{facility.title}</h3>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ================= SECTION 14: PATIENT EDUCATION ================= */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Patient Guidance</span>
              <h2 className="text-2xl font-black text-text-primary mt-2">Self-Care Guidelines & Education</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <h3 className="font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-700" /> Prescribed Care Guidelines
                </h3>
                <ul className="mt-4 space-y-3 text-xs text-emerald-900 leading-relaxed">
                  {service.patientEducationTips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-bg-alt">
                {service.enabledSections?.prevention !== false && service.preventionTips?.length > 0 ? (
                  <>
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-brand-teal" /> Prevention & Lifestyle Advice
                    </h3>
                    <ul className="mt-4 space-y-3 text-xs text-text-secondary leading-relaxed">
                      {service.preventionTips.map((tip, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-brand-teal font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                      <ShieldAlert className="size-5 text-brand-rose" /> Standard Clinic Advice
                    </h3>
                    <ul className="mt-4 space-y-3 text-xs text-text-secondary leading-relaxed">
                      <li className="flex gap-2">
                        <span className="text-brand-rose font-bold">•</span>
                        <span>Follow the custom medication schedules specified by the doctor exactly.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-brand-rose font-bold">•</span>
                        <span>Attend all follicular and scan monitoring visits at their scheduled times.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-brand-rose font-bold">•</span>
                        <span>Report any sudden pelvic discomfort, spotting, or severe bloating to the care team.</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ================= SECTION 15: RELATED SERVICES ================= */}
          {relatedServices.length > 0 && (
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Explore Further</span>
                <h2 className="text-2xl font-black text-text-primary mt-2">Related Fertility Services</h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedServices.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={getServiceUrl(rel, [category])}
                    className="p-4 rounded-xl border border-border bg-bg-alt hover:border-primary transition group flex flex-col justify-between min-h-[120px]"
                  >
                    <h3 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                      {rel.title}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-rose mt-4 flex items-center gap-1">
                      Learn More <ArrowRight className="size-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ================= SECTION: PHOTO GALLERY ================= */}
          {service.enabledSections?.gallery !== false && Array.isArray(service.gallery) && service.gallery.length > 0 && (
            <section id="gallery" className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Visual Gallery</span>
                <h2 className="text-2xl font-black text-text-primary mt-2">Photo Gallery</h2>
                <p className="mt-2 text-sm text-text-secondary">Visual highlights for {service.title} at Sreya Hospitals.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {service.gallery.map((img, index) => (
                  <div key={index} className="group relative aspect-video rounded-xl overflow-hidden border border-border bg-slate-100 shadow-sm">
                    <img 
                      src={img.imageUrl} 
                      alt={img.caption || `Gallery image ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-3 text-white text-xs font-bold">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= SECTION 16: FAQS ================= */}
          {service.enabledSections?.closing !== false && Array.isArray(service.faqs) && service.faqs.length > 0 && (
            <section id="faqs" className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Common Queries</span>
              <h2 className="text-2xl font-black text-text-primary mt-2">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid gap-4">
              {service.faqs.map((faq, idx) => (
                <details key={idx} className="group border border-border rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                    <h3 className="font-bold text-sm sm:text-base text-text-primary pr-4">
                      {faq.q}
                    </h3>
                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                      <ChevronDown className="size-5 text-text-secondary" />
                    </span>
                  </summary>
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-text-secondary border-t border-slate-100 pt-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
          )}

          {/* ================= SECTION 17: APPOINTMENT CTA BAND ================= */}
          <section className="relative overflow-hidden rounded-2xl bg-brand-navy p-8 sm:p-12 text-white text-center border border-white/5">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-brand-navy via-brand-navy/90 to-brand-navy/60 opacity-95" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-primary-light">Start Your Journey</span>
              <h2 className="text-3xl font-black text-white">Ready to consult our fertility specialist?</h2>
              <p className="text-sm text-slate-350 leading-relaxed">
                Connect with our team to schedule an evaluation or request details.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => handleSubNavClick('appointment-booking')}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand-rose px-6 py-3 text-sm font-black text-white hover:bg-brand-rose-dark transition shadow-md"
                >
                  Book Appointment
                </button>
                <a
                  href={`tel:${settings.phoneMobile}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/20 transition"
                >
                  <Phone className="size-4" /> Call Clinic
                </a>
                <a
                  href={`https://wa.me/91${settings.phoneMobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-black text-white hover:bg-[#20ba59] transition"
                >
                  <MessageSquare className="size-4" /> WhatsApp
                </a>
              </div>
            </div>
          </section>

          {/* ================= SECTION 18: APPOINTMENT FORM ================= */}
          <section id="appointment-booking" className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Online Request</span>
                <h2 className="text-2xl font-black text-text-primary mt-2">Schedule Your Visit</h2>
                <p className="mt-4 text-xs leading-relaxed text-text-secondary">
                  Complete the request form. Online appointment requests are stored as pending until our hospital team calls you to confirm availability.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-brand-teal/5 border border-brand-teal/20 text-xs text-primary leading-relaxed flex gap-3">
                <ShieldAlert className="size-5 shrink-0 text-brand-teal mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> Online scheduling is for routine consultations. In case of medical emergencies, please visit the hospital directly or call the emergency numbers.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <AppointmentForm defaultDepartment={departmentMapping} />
            </div>
          </section>

          {/* Medical disclaimer note */}
          <div className="text-center text-xs leading-relaxed text-text-muted max-w-2xl mx-auto pt-8 border-t border-border">
            Medical content on this page is for general patient education and does not constitute clinical diagnosis or personalized advice. 
            {' '}
            <Link to="/medical-disclaimer" className="font-bold text-primary underline">Read our medical disclaimer</Link>.
          </div>

        </main>
      </div>
    </>
  )
}
