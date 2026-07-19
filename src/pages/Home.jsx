import { Link } from 'react-router-dom'
import { Phone, MessageSquare } from 'lucide-react'
import { hospitalJsonLd } from '../lib/seo'
import { Seo } from '../components/shared/Seo'
import { HomeStickyHero } from '../components/home/HomeStickyHero'
import { ServicesCarousel } from '../components/home/ServicesCarousel'
import { PosterSlider } from '../components/home/PosterSlider'
import { DoctorSpotlight } from '../components/home/DoctorSpotlight'
import { HomeFacilities } from '../components/home/HomeFacilities'
import { HomeBridgeParallax } from '../components/home/HomeBridgeParallax'
import { ParallaxExperience } from '../components/home/ParallaxExperience'
import { GoogleReviews } from '../components/home/GoogleReviews'
import { TestimonialsGrid } from '../components/home/TestimonialsGrid'
import { HomepageGallery } from '../components/home/HomepageGallery'
import { FertilityPathway } from '../components/home/FertilityPathway'
import { HomeMomentsVideos } from '../components/home/HomeMomentsVideos'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function Home() {
  const { settings } = useSiteSettings()
  const cta = settings.ctaSection || {}

  return (
    <>
      <Seo
        title={settings.seo?.title || "IVF Centre Narasaraopet | Sreya Hospitals"}
        description={settings.seo?.description || "Sreya Hospitals & IVF Centre is Narasaraopet's premier fertility clinic. Lead Infertility Specialist Dr. Vasanta Kiran Mekala provides IVF, IUI, ICSI, and fertility testing."}
        image={settings.seo?.ogImage || "https://images.unsplash.com/photo-1581093458791-9d2fcea0a349?auto=format&fit=crop&w=1400&q=80"}
        jsonLd={hospitalJsonLd(settings)}
      />

      <div className="bg-[var(--color-bg-base)] overflow-x-hidden">
        {/* 1. Hero: split panel hero with sliding text and diagonal curved mask */}
        <HomeStickyHero />

        {/* 2. Rebuilt Services Carousel (Select a Service to Know More) */}
        <ServicesCarousel />

        {/* Poster/Promotional Slider banner */}
        <PosterSlider />

        {/* 3. Doctor / About spotlight */}
        <DoctorSpotlight />

        {/* 4. State-of-the-Art Facilities alternating showcase */}
        <HomeFacilities />

        {/* 5. NEW: Parallax scroll bridging section */}
        <HomeBridgeParallax />

        {/* 6. Years of Experience section (GSAP count-ups) */}
        <ParallaxExperience />

        {/* 8. Testimonials Slider */}
        <TestimonialsGrid layout="slider" showViewAll={true} />

        {/* 8.1 Homepage Gallery Infinite Slider */}
        <HomepageGallery />

        {/* 8.2 Fertility Pathway Flowchart */}
        <FertilityPathway />

        {/* 8.3 Side-by-Side Autoplay Videos */}
        <HomeMomentsVideos />

        {/* 10. Final CTA band */}
        <section className="relative overflow-hidden bg-[var(--color-bg-dark)] py-20 sm:py-28 text-white text-center">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-brand-ink via-brand-ink/95 to-brand-ink/70 opacity-90" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-primary-light">
              {cta.eyebrow || "Take The Next Step"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
              {cta.title || "Take the Next Step Towards Parenthood"}
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto opacity-90">
              {cta.body || "Schedule a baseline check or consult with our lead specialist. Online requests are held as pending until confirmed by our hospital team."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Link
                to="/appointment"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-black text-white hover:bg-primary-dark transition shadow-lg"
              >
                {cta.primaryLabel || "Book Appointment"}
              </Link>
              <a
                href={`tel:${settings.phoneMobile || settings.phone || '9390328255'}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/20 transition"
              >
                <Phone className="size-4" /> Call Clinic
              </a>
              <a
                href={`https://wa.me/91${settings.whatsapp || settings.phoneMobile || '9390328255'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-black text-white hover:bg-[#20ba59] transition"
              >
                <MessageSquare className="size-4" /> {cta.secondaryLabel || "WhatsApp"}
              </a>
            </div>
          </div>
        </section>

        {/* 11. Google Reviews (relocated to absolute bottom) */}
        <GoogleReviews />
      </div>
    </>
  )
}
