import { useEffect, useState } from 'react'

const loadingMessages = [
  'Welcoming hope...',
  'Preparing your care pathway...',
  'Nurturing life, securing dreams...',
  'Connecting clinical specialists...',
  'Every heartbeat tells a story...'
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

  // Custom pregnancy/maternity line art SVG
  const loaderIcon = (
    <svg viewBox="0 0 100 100" className="size-28 text-brand-rose relative z-10" fill="none">
      <style>{`
        @keyframes drawMother {
          0% { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulseWomb {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.18); opacity: 0.95; }
        }
      `}</style>
      
      {/* Outer decorative soft glowing heart */}
      <path
        d="M50,85 C25,65 15,45 15,30 C15,18 24,10 35,10 C42,10 47,14 50,18 C53,14 58,10 65,10 C76,10 85,18 85,30 C85,45 75,65 50,85 Z"
        className="opacity-15 stroke-brand-rose"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Elegant Silhouette of a Pregnant Mother */}
      <path
        d="M48,16 C50.5,16 52.5,14 52.5,11.5 C52.5,9 50.5,7 48,7 C45.5,7 43.5,9 43.5,11.5 C43.5,14 45.5,16 48,16 Z 
           M42,22 C42,22 47,24 48,29 C49,34 42,42 45,49 C47.5,54 55,54 54,64 C53,72 45,78 45,78"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="120"
        strokeDashoffset={!prefersReducedMotion ? "120" : "0"}
        style={!prefersReducedMotion ? { animation: 'drawMother 3s linear infinite' } : {}}
      />
      
      {/* Pulsing baby/heart inside the womb */}
      <path
        d="M47,56 C45,54 42,54 42,56.5 C42,59 47,62 47,62 C47,62 52,59 52,56.5 C52,54 49,54 47,56 Z"
        fill="#e11d48"
        className="origin-[47px_58px]"
        style={!prefersReducedMotion ? { animation: 'pulseWomb 1.6s ease-in-out infinite' } : {}}
      />
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
