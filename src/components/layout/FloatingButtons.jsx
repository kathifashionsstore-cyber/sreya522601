import { useEffect, useState } from 'react'
import { Facebook, Instagram, MessageCircle, Phone, Star, X, Youtube } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

const fallbackReviewUrl = 'https://www.google.com/search?sca_esv=734e3ccf7d0a1214&sxsrf=APpeQnvwqc2rdu3mNDHz8-8guA-MlbWO-A:1785559547033&q=sreya+hospitals+and+ivf+centre+reviews&uds=AJ5uw1_dDM0QRrBvstcLgcNOdWNUQ7qKvemyOfv6I4NZL-gJjQIop4lZYt3SXWDIftaO-9qySDFXz1zaHOCjhtRmqIhdagZ-pnPVkLOaitd_HsUA3KyMLHT92fGK4fEPgjiyUNbgQRtx57zP5MkqNzbjlMFNL6q8GP3WNXPZSmd22pmuRTnHQNiFdX3r_ooyPHbPRDIDAurSGRDRfG-ZBYc04mHJU1d4EYahN_Pwg1uWz62jC9zp7jL2zfZx9BPU23pqjvMt5yu0a2Zme5VqbXlQb0r6cc0LGMm8iyZucIPbIIFbQ3DLujCDZKuXmcExdyMxEzlcM6pzD7Zhbbrk1R03sGTmRXNPEKlqQN3I3o721ggvMlPpInbvjkXwIeA_n5tRV0CkeoxYmgljhyAUQS16_4ByrccliqCmike9knB3WWsbCkSuM2RCXrDpZsxJYXZ3dAT7KNI1NU9UTj3I0cQPLnv6-ATvvEUIvPj6_QrZlC-s4s3D8f0hLe8mCawfggrRPHNL3nmCSeaCV_axsnLw27PjvZb24hvjknNToob28OjzgB7iedo&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_xUdhDUJ5xfqBSKmKBnBepCfGjDA_ByKdFSOu1fWySeWE69aYzlqWk4Dc2tSpQZWQW5GZSkKNx5LdQUg2TT6_YzC-UPl5Bid--7s_QkImixubescPA%3D%3D&sa=X&ved=2ahUKEwjBu5rUz_6VAxUtjOEIHa0HM9QQk8gLegQIHRAB&ictx=1&stq=1&cs=1&lei=-3ltaoHSAa2YhvcPrY_MoQ0#ebo=1&lrd=0x3a4a8154f67b485f:0x2cefc6d088e33924,3,,,,'

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
  const reviewUrl = settings.googleReviewUrl || fallbackReviewUrl

  // Show Install App button on web and mobile unless app is running in standalone mode
  const showInstallBtn = !isStandalone

  return (
    <>
      {/* Left Floating Stack: Social Links */}
      <div className="fixed left-3 z-40 flex flex-col gap-2 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] sm:left-4 lg:bottom-6 lg:left-5 lg:gap-2.5">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-10 place-items-center rounded-xl bg-white text-[#E4405F] shadow-lift ring-1 ring-slate-100 transition-transform hover:scale-105 sm:size-11 sm:rounded-2xl"
          aria-label="Sreya Hospitals Instagram"
          title="Instagram Page"
        >
          <Instagram className="size-6" />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-10 place-items-center rounded-xl bg-white text-[#1877F2] shadow-lift ring-1 ring-slate-100 transition-transform hover:scale-105 sm:size-11 sm:rounded-2xl"
          aria-label="Sreya Hospitals Facebook"
          title="Facebook Page"
        >
          <Facebook className="size-6" />
        </a>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-10 place-items-center rounded-xl bg-white text-[#FF0000] shadow-lift ring-1 ring-slate-100 transition-transform hover:scale-105 sm:size-11 sm:rounded-2xl"
          aria-label="Sreya Hospitals YouTube"
          title="YouTube Channel"
        >
          <Youtube className="size-6" />
        </a>
      </div>

      {/* Right Floating Stack: Action Buttons */}
      <div className="fixed right-3 z-40 flex flex-col items-end gap-2 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] sm:right-4 lg:bottom-6 lg:right-5 lg:gap-2.5">
        {/* PWA Install App Button */}
        {showInstallBtn && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="group relative grid size-11 place-items-center rounded-2xl border-2 border-white bg-brand-navy text-white shadow-xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 sm:size-12"
            aria-label="Install App"
            title="Install Hospital Web App"
          >
            <img src="/logoo.webp" alt="" className="size-7 rounded-lg bg-white object-contain p-0.5" />
            <span className="pointer-events-none absolute right-[calc(100%+0.55rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/80 bg-brand-navy px-3 py-1.5 text-[11px] font-black text-white shadow-xl group-hover:block group-focus-visible:block">
              Install App
            </span>
          </button>
        )}

        {/* Google Review Floating Button */}
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative grid size-11 place-items-center rounded-2xl border-2 border-white bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/35 sm:size-12"
          aria-label="Write Google Review"
          title="Write Google Review"
        >
          <Star className="size-6 fill-white text-white" />
          <span className="pointer-events-none absolute right-[calc(100%+0.55rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/80 bg-amber-500 px-3 py-1.5 text-[11px] font-black text-white shadow-xl group-hover:block group-focus-visible:block">
            Write Review
          </span>
        </a>

        {/* WhatsApp Floating Button */}
        <a
          href={`https://wa.me/91${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-11 place-items-center rounded-2xl bg-[#25D366] text-white shadow-lift ring-1 ring-white/80 transition-transform hover:scale-105 sm:size-12"
          aria-label="Chat on WhatsApp"
          title="WhatsApp Support"
        >
          <MessageCircle className="size-6" />
        </a>

        {/* Phone Call Floating Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="grid size-11 place-items-center rounded-2xl bg-brand-teal text-white shadow-lift ring-1 ring-white/80 transition-transform hover:scale-105 sm:size-12"
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
              <img src="/logoo.webp" alt="Sreya Hospitals Logo" className="h-12 w-auto object-contain" />
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
