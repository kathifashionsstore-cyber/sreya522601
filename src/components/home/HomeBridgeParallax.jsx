import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function HomeBridgeParallax() {
  const { settings } = useSiteSettings()
  const section = settings.homeBridgeSection || {}

  const bgImg = section.bridgeImageUrl || section.imageUrl || settings.pageBanners?.about?.imageUrl || settings.seo?.ogImage
  const badgeText = section.badgeText || 'Empowering Your Pathway'
  const title = section.title || 'Personalised Care Guided By Decades of Clinical Experience'
  const body = section.body || 'At Sreya, you consult directly with our lead specialist at every step. From standard follicular scans to advanced clean-room embryo monitoring, your family journey is managed with continuous transparency.'
  const primaryLabel = section.primaryButtonLabel || 'Book Appointment'
  const primaryLink = section.primaryButtonLink || '/appointment'
  const secondaryLabel = section.secondaryButtonLabel || 'Explore Facilities'
  const secondaryLink = section.secondaryButtonLink || '/facilities'
  const overlayColor = section.overlayColor || '#0F172A'
  const rawOverlayOpacity = Number(section.overlayOpacity ?? 0.58)
  const overlayOpacity = Number.isFinite(rawOverlayOpacity)
    ? Math.min(Math.max(rawOverlayOpacity > 1 ? rawOverlayOpacity / 100 : rawOverlayOpacity, 0), 0.9)
    : 0.58

  return (
    <section 
      className="relative min-h-[45vh] flex items-center justify-center bg-cover bg-center bg-fixed py-20 text-white"
      style={bgImg ? { backgroundImage: `url(${bgImg})` } : undefined}
    >
      <div className="absolute inset-0 z-0 backdrop-blur-[0.5px]" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-dark/35 via-transparent to-primary/25" />

      {/* Content overlay */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="rounded-3xl bg-slate-950/65 border border-white/15 p-8 sm:p-12 shadow-xl space-y-6 max-w-2xl mx-auto backdrop-blur-md">
          {badgeText && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 text-[var(--color-primary-light)] px-3 py-1 text-xs font-black tracking-wider uppercase mx-auto">
              {badgeText}
            </span>
          )}
          
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight">
            {title}
          </h2>
          
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed opacity-95">
            {body}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to={primaryLink}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-xs font-black text-white hover:bg-primary-dark transition shadow-md"
            >
              {primaryLabel} <ArrowRight className="size-3.5" />
            </Link>
            <Link
              to={secondaryLink}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm px-5 py-2 text-xs font-black text-white hover:bg-white/10 transition"
            >
              {secondaryLabel} <Calendar className="size-3.5 text-[var(--color-primary-light)]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
