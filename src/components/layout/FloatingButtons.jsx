import { useEffect, useState } from 'react'
import { Download, Smartphone, X } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

// Official SVG Brand Logos
function InstagramIcon({ className = 'size-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#igGradient)" />
      <path
        d="M12 7 C9.239 7 7 9.239 7 12 C7 14.761 9.239 17 12 17 C14.761 17 17 14.761 17 12 C17 9.239 14.761 7 12 7 Z M12 15 C10.343 15 9 13.657 9 12 C9 10.343 10.343 9 12 9 C13.657 9 15 10.343 15 12 C15 13.657 13.657 15 12 15 Z"
        fill="white"
      />
      <circle cx="16.5" cy="7.5" r="1.2" fill="white" />
    </svg>
  )
}

function FacebookIcon({ className = 'size-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#1877F2">
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path
        d="M15.12 12.35 L15.54 9.61 H12.91 V7.83 C12.91 7.08 13.28 6.35 14.45 6.35 H15.65 V4.02 C15.65 4.02 14.56 3.83 13.52 3.83 C11.36 3.83 9.94 5.14 9.94 7.51 V9.61 H7.53 V12.35 H9.94 V19.01 C10.42 19.09 10.92 19.13 11.43 19.13 C11.93 19.13 12.43 19.09 12.91 19.01 V12.35 H15.12 Z"
        fill="white"
      />
    </svg>
  )
}

function YouTubeIcon({ className = 'size-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path d="M10 8.5 L15.5 12 L10 15.5 V8.5 Z" fill="white" />
    </svg>
  )
}

function WhatsAppIcon({ className = 'size-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"
        fill="white"
      />
    </svg>
  )
}

function PhoneIcon({ className = 'size-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#087f8c" />
      <path
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
        fill="white"
      />
    </svg>
  )
}

export function FloatingButtons() {
  const { settings } = useSiteSettings()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIosTooltip, setShowIosTooltip] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    setIsStandalone(Boolean(standalone))

    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) && !window.MSStream
    setIsIos(ios)

    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else if (isIos) {
      setShowIosTooltip(true)
    }
  }

  const instagramUrl = settings.instagram || 'https://www.instagram.com/sreyahospitals/'
  const facebookUrl = settings.facebook || 'https://www.facebook.com/SreyaHospitalsNrt/'
  const youtubeUrl = settings.youtube || 'https://www.youtube.com/@sreyahospitalsivfcentre'
  const whatsappNumber = settings.whatsapp || settings.phoneMobile || '9390328255'
  const phoneNumber = settings.phone || settings.phoneMobile || '9390328255'

  const showInstallBtn = !isStandalone && (Boolean(deferredPrompt) || isIos)

  return (
    <>
      {/* Left Floating Stack: Social Links */}
      <div className="fixed bottom-20 left-3 z-40 flex flex-col gap-2.5 lg:bottom-6 lg:left-5">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-white p-0.5 border border-slate-100"
          aria-label="Sreya Hospitals Instagram"
          title="Instagram Page"
        >
          <InstagramIcon className="size-10" />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-white p-0.5 border border-slate-100"
          aria-label="Sreya Hospitals Facebook"
          title="Facebook Page"
        >
          <FacebookIcon className="size-10" />
        </a>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-white p-0.5 border border-slate-100"
          aria-label="Sreya Hospitals YouTube"
          title="YouTube Channel"
        >
          <YouTubeIcon className="size-10" />
        </a>
      </div>

      {/* Right Floating Stack: Action Buttons */}
      <div className="fixed bottom-20 right-3 z-40 flex flex-col gap-2.5 lg:bottom-6 lg:right-5 items-end">
        {/* PWA Install Button */}
        {showInstallBtn && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 rounded-full bg-brand-navy px-3.5 py-2 text-xs font-black text-white shadow-lift hover:scale-105 transition-all border border-white/20 animate-pulse"
            aria-label="Install App"
          >
            <Download className="size-4 text-brand-teal" />
            <span>Install App</span>
          </button>
        )}

        {/* WhatsApp Floating Button */}
        <a
          href={`https://wa.me/91${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-white p-0.5 border border-slate-100"
          aria-label="Chat on WhatsApp"
          title="WhatsApp Support"
        >
          <WhatsAppIcon className="size-10" />
        </a>

        {/* Phone Call Floating Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-white p-0.5 border border-slate-100"
          aria-label="Call Hospital"
          title="Call Hospital"
        >
          <PhoneIcon className="size-10" />
        </a>
      </div>

      {/* iOS PWA Install Guidance Tooltip */}
      {showIosTooltip && (
        <div className="fixed inset-x-4 bottom-24 z-50 rounded-2xl bg-brand-navy p-4 text-white shadow-2xl border border-slate-700 max-w-sm mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm font-black text-brand-rose">
              <Smartphone className="size-5" /> Install Sreya App on iOS
            </div>
            <button
              onClick={() => setShowIosTooltip(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-200">
            Tap the <strong className="text-white">Share icon</strong> in your Safari toolbar, then scroll down and select <strong className="text-white">'Add to Home Screen'</strong> to install the hospital app.
          </p>
        </div>
      )}
    </>
  )
}
