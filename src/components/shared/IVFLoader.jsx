import { useEffect, useState } from 'react'

const loadingMessages = [
  'Preparing your journey...',
  'Connecting clinical assets...',
  'Securing embryology profiles...',
  'Getting things ready...',
  'Welcoming hope...'
]

export function IVFLoader({ inline = false }) {
  const [msgIdx, setMsgIdx] = useState(0)
  const [showMsg, setShowMsg] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Show messages only if loading takes more than 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMsg(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Rotate messages every 2.5s
  useEffect(() => {
    if (!showMsg) return
    const timer = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % loadingMessages.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [showMsg])

  // Custom IVF embryo cell division SVG animation
  const loaderIcon = (
    <svg viewBox="0 0 100 100" className="size-24 text-primary relative z-10">
      {/* Inner cell/blastomere divisions */}
      {!prefersReducedMotion ? (
        <>
          {/* Main cell membrane */}
          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2.5" fill="none" strokeDasharray="5 5" className="animate-spin" style={{ animationDuration: '12s' }} />
          
          {/* Pulsing and dividing blastomeres */}
          <g className="origin-center">
            {/* Blastomere A */}
            <circle cx="42" cy="50" r="14" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2" className="animate-pulse" style={{ animationDuration: '3s' }} />
            {/* Blastomere B */}
            <circle cx="58" cy="50" r="14" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" className="animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
            {/* Pronuclei */}
            <circle cx="42" cy="50" r="2.5" fill="currentColor" />
            <circle cx="58" cy="50" r="2.5" fill="currentColor" />
          </g>
        </>
      ) : (
        <>
          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <circle cx="44" cy="50" r="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
          <circle cx="56" cy="50" r="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
        </>
      )}
    </svg>
  )

  if (inline) {
    return (
      <div className="flex flex-col items-center justify-center py-6 space-y-3">
        {loaderIcon}
        <span className="text-xs text-text-secondary font-bold">Processing...</span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[var(--color-bg-base)] text-text-primary">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          {/* Soft pulsing halo background */}
          <div className="absolute -inset-4 rounded-full bg-[var(--color-accent-blush)] blur-xl opacity-35 animate-ping" style={{ animationDuration: '3s' }} />
          {loaderIcon}
        </div>
        
        {showMsg && (
          <div className="text-center space-y-1.5 h-10 transition-all">
            <p className="text-sm font-bold text-text-primary tracking-wide">
              {loadingMessages[msgIdx]}
            </p>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black animate-pulse">
              Sreya IVF Centre
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
