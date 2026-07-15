import { useEffect, useState } from 'react'
import { Button } from '../shared/Button'

export function SplashAttribution() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(sessionStorage.getItem('wz_splash_seen') !== '1')
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[150] grid place-items-center bg-brand-ink/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-lg bg-white p-7 text-center shadow-soft">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-blush text-3xl font-black text-brand-rose">
          W
        </div>
        <p className="mt-5 text-2xl font-black leading-tight text-brand-navy">
          Website made by Wayzentech — 9398724704
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Continue to Sreya Hospitals & IVF Centre.
        </p>
        <Button
          type="button"
          className="mt-6 w-full"
          onClick={() => {
            sessionStorage.setItem('wz_splash_seen', '1')
            setVisible(false)
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
