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
    <div className="fixed inset-0 z-[150] grid place-items-center bg-brand-ink/75 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100 flex flex-col">
        {/* Close Button top-right */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-20 grid size-8 place-items-center rounded-full bg-black/55 text-white hover:bg-black/75 transition-colors"
          aria-label="Close welcome popup"
        >
          <X className="size-4" />
        </button>

        {/* Banner image */}
        {banner.imageUrl ? (
          <div className="relative w-full aspect-video sm:aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              src={banner.imageUrl}
              alt="Welcome Poster"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-12 bg-brand-teal" />
        )}

        {/* Content body */}
        <div className="p-6 text-center space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {attributionLink ? (
              <a
                href={attributionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <h2 className="text-xl font-black text-brand-navy group-hover:text-brand-rose transition-colors leading-tight">
                  {attributionText}
                </h2>
                <p className="mt-1 text-sm font-bold text-brand-rose">
                  {attributionPhone}
                </p>
              </a>
            ) : (
              <>
                <h2 className="text-xl font-black text-brand-navy leading-tight">
                  {attributionText}
                </h2>
                <p className="mt-1 text-sm font-bold text-brand-rose">
                  {attributionPhone}
                </p>
              </>
            )}
            <p className="text-xs text-slate-500 font-semibold pt-1">
              Welcome to Sreya Hospitals & IVF Centre
            </p>
          </div>

          <Button
            type="button"
            className="w-full min-h-12 text-sm font-black tracking-wide"
            onClick={handleDismiss}
          >
            Continue to Website
          </Button>
        </div>
      </div>
    </div>
  )
}
