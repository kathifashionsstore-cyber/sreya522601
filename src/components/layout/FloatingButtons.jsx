import { useEffect, useState } from 'react'
import { Facebook, Instagram, MessageCircle, Phone, Smartphone, X, Youtube } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function FloatingButtons() {
  const { settings } = useSiteSettings()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)

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
      try {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
          setDeferredPrompt(null)
          return
        }
      } catch (err) {
        console.warn('Install prompt error:', err)
      }
    }
    setShowInstallModal(true)
  }

  const instagramUrl = settings.instagram || 'https://www.instagram.com/sreyahospitals/'
  const facebookUrl = settings.facebook || 'https://www.facebook.com/SreyaHospitalsNrt/'
  const youtubeUrl = settings.youtube || 'https://www.youtube.com/@sreyahospitalsivfcentre'
  const whatsappNumber = settings.whatsapp || settings.phoneMobile || '9390328255'
  const phoneNumber = settings.phone || settings.phoneMobile || '9390328255'

  // Show Install App button on web and mobile unless app is running in standalone mode
  const showInstallBtn = !isStandalone

  return (
    <>
      {/* Left Floating Stack: Social Links */}
      <div className="fixed bottom-20 left-3 z-40 flex flex-col gap-2.5 lg:bottom-6 lg:left-5">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-white border border-slate-100 text-[#E4405F]"
          aria-label="Sreya Hospitals Instagram"
          title="Instagram Page"
        >
          <Instagram className="size-6" />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-white border border-slate-100 text-[#1877F2]"
          aria-label="Sreya Hospitals Facebook"
          title="Facebook Page"
        >
          <Facebook className="size-6" />
        </a>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-white border border-slate-100 text-[#FF0000]"
          aria-label="Sreya Hospitals YouTube"
          title="YouTube Channel"
        >
          <Youtube className="size-6" />
        </a>
      </div>

      {/* Right Floating Stack: Action Buttons */}
      <div className="fixed bottom-20 right-3 z-40 flex flex-col gap-2.5 lg:bottom-6 lg:right-5 items-end">
        {/* PWA Install App Button */}
        {showInstallBtn && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-xs font-black text-white shadow-xl hover:scale-105 transition-all border-2 border-white"
            aria-label="Install App"
            title="Install Hospital Web App"
          >
            <img src="/logo.webp" alt="Sreya Logo" className="h-5 w-auto object-contain bg-white rounded p-0.5" />
            <span>Install App</span>
          </button>
        )}

        {/* WhatsApp Floating Button */}
        <a
          href={`https://wa.me/91${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-[#25D366] text-white border border-slate-100"
          aria-label="Chat on WhatsApp"
          title="WhatsApp Support"
        >
          <MessageCircle className="size-6" />
        </a>

        {/* Phone Call Floating Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="grid size-11 place-items-center rounded-2xl shadow-lift hover:scale-110 transition-transform bg-brand-teal text-white border border-slate-100"
          aria-label="Call Hospital"
          title="Call Hospital"
        >
          <Phone className="size-6" />
        </a>
      </div>

      {/* PWA Install Guidance Modal / Tooltip */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[160] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>

            <div className="mx-auto flex justify-center">
              <img src="/logo.webp" alt="Sreya Hospitals Logo" className="h-12 w-auto object-contain" />
            </div>

            <div>
              <h3 className="text-lg font-black text-brand-navy">Install Sreya Hospitals App</h3>
              <p className="mt-1 text-xs text-slate-500 font-semibold">
                Access fertility care, appointments, and services instantly from your home screen.
              </p>
            </div>

            <div className="rounded-2xl bg-brand-cream/60 p-4 text-left space-y-2 border border-slate-100 text-xs">
              {isIos ? (
                <>
                  <p className="font-extrabold text-brand-navy">For iPhone / iPad (Safari):</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    <li>Tap the <strong>Share button</strong> in Safari menu bar.</li>
                    <li>Scroll down &amp; select <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>Add</strong> to launch app from home screen.</li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="font-extrabold text-brand-navy">For Android / Chrome / Edge:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    <li>Click the <strong>3 dots menu (⋮)</strong> at top-right of browser.</li>
                    <li>Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>Confirm installation to launch Sreya App anytime!</li>
                  </ol>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowInstallModal(false)}
              className="w-full rounded-xl bg-brand-navy py-2.5 text-xs font-black text-white hover:bg-brand-teal transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  )
}
