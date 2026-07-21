import { useEffect, useState } from 'react'
import { Button } from '../shared/Button'
import { useFirestoreDoc } from '../../hooks/useFirestoreCollection'
import { X } from 'lucide-react'

export function SplashAttribution() {
  const [visible, setVisible] = useState(false)
  const { data: banner, loading } = useFirestoreDoc('festivalBanners/active', { enabled: false })

  useEffect(() => {
    if (!loading && banner && banner.enabled) {
      setVisible(sessionStorage.getItem('wz_splash_seen') !== '1')
    }
  }, [loading, banner])

  if (!visible || loading || !banner || !banner.enabled) return null

  const handleDismiss = () => {
    sessionStorage.setItem('wz_splash_seen', '1')
    setVisible(false)
  }

  const attributionText = banner.text || 'Website designed by Wayzentech'
  const attributionPhone = banner.phone || '9398724704'
  const attributionLink = banner.link || ''

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-brand-ink/80 p-4 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col p-4 sm:p-6 my-auto">
        {/* Close Button top-right */}
        <button
          onClick={handleDismiss}
          className="absolute top-6 right-6 z-20 grid size-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md"
          aria-label="Close welcome popup"
        >
          <X className="size-5" />
        </button>

        {/* Banner image - 1:1 Square Aspect Ratio */}
        {banner.imageUrl ? (
          <div className="relative w-full aspect-square max-h-[50vh] sm:max-h-[58vh] overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 mb-4 flex place-items-center justify-center">
            <img
              src={banner.imageUrl}
              alt="Welcome Poster"
              className="h-full w-full object-contain sm:object-cover rounded-2xl"
            />
          </div>
        ) : (
          <div className="w-full h-16 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-rose mb-4" />
        )}

        {/* Content body */}
        <div className="text-center space-y-3 flex-1 flex flex-col justify-between pt-1">
          <div className="space-y-1.5">
            {attributionLink ? (
              <a
                href={attributionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <h2 className="text-lg sm:text-xl font-black text-brand-navy group-hover:text-brand-rose transition-colors leading-tight">
                  {attributionText}
                </h2>
                <p className="mt-1 text-sm font-bold text-brand-rose">
                  {attributionPhone}
                </p>
              </a>
            ) : (
              <>
                <h2 className="text-lg sm:text-xl font-black text-brand-navy leading-tight">
                  {attributionText}
                </h2>
                <p className="mt-1 text-sm font-bold text-brand-rose">
                  {attributionPhone}
                </p>
              </>
            )}
            <p className="text-xs text-slate-500 font-semibold pt-0.5">
              Welcome to Sreya Hospitals &amp; IVF Centre
            </p>
          </div>

          <Button
            type="button"
            className="w-full min-h-12 text-sm font-black tracking-wide rounded-xl mt-3"
            onClick={handleDismiss}
          >
            Continue to Website
          </Button>
        </div>
      </div>
    </div>
  )
}
