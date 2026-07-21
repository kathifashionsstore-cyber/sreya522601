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

  // Custom pregnancy & maternal care line art SVG
  const loaderIcon = (
    <svg viewBox="0 0 120 120" className="size-32 text-brand-rose relative z-10" fill="none">
      <defs>
        <linearGradient id="wombGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="pulseHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe4e6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffe4e6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <style>{`
        @keyframes drawMotherLine {
          0% { stroke-dashoffset: 240; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulseWombHeart {
          0%, 100% { transform: scale(0.92); opacity: 0.45; filter: drop-shadow(0 0 2px rgba(244,63,94,0.3)); }
          50% { transform: scale(1.22); opacity: 1; filter: drop-shadow(0 0 8px rgba(244,63,94,0.8)); }
        }
        @keyframes heartbeatWave {
          0% { stroke-dashoffset: 80; }
          100% { stroke-dashoffset: -80; }
        }
        @keyframes gentleGlow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
      `}</style>
      
      {/* Soft halo glow behind womb */}
      <circle
        cx="58"
        cy="64"
        r="28"
        fill="url(#pulseHalo)"
        style={!prefersReducedMotion ? { animation: 'gentleGlow 2.4s ease-in-out infinite' } : {}}
      />
      
      {/* Outer decorative protective heart silhouette */}
      <path
        d="M60,105 C28,82 14,56 14,36 C14,21 26,10 40,10 C49,10 56,15 60,20 C64,15 71,10 80,10 C94,10 106,21 106,36 C106,56 92,82 60,105 Z"
        className="stroke-brand-teal/20"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      
      {/* Elegant Line-Art Silhouette of Pregnant Mother */}
      {/* Head & Hair Profile */}
      <path
        d="M52,18 C55,18 57.5,15.5 57.5,12.5 C57.5,9.5 55,7 52,7 C49,7 46.5,9.5 46.5,12.5 C46.5,15.5 49,18 52,18 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Neck, Spine, Shoulder, Bust, Pregnant Belly, Thighs & Cradling Arm */}
      <path
        d="M 46,17 C 46,24 50,26 51,32 C 52,38 43,45 44,52 C 45,58 53,60 55,68 C 57,75 66,74 65,85 C 64,95 54,100 52,102 M 48,34 C 42,39 40,46 45,54 C 49,61 46,67 52,70"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="240"
        strokeDashoffset={!prefersReducedMotion ? "240" : "0"}
        style={!prefersReducedMotion ? { animation: 'drawMotherLine 3.2s ease-in-out infinite' } : {}}
      />

      {/* Gentle Pulsing Heart in the Womb */}
      <g className="origin-[58px_65px]" style={!prefersReducedMotion ? { animation: 'pulseWombHeart 1.5s ease-in-out infinite' } : {}}>
        <path
          d="M58,72 C55,69 50,65 50,61 C50,57.5 53,55 55.5,55 C57,55 58,56 58,56 C58,56 59,55 60.5,55 C63,55 66,57.5 66,61 C66,65 61,69 58,72 Z"
          fill="url(#wombGlow)"
          stroke="#f43f5e"
          strokeWidth="1.2"
        />
      </g>

      {/* ECG Heartbeat Line Wave across bottom */}
      <path
        d="M20,96 L40,96 L44,90 L48,102 L53,84 L58,98 L62,94 L66,96 L100,96"
        stroke="#087f8c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="80"
        strokeDashoffset={!prefersReducedMotion ? "80" : "0"}
        style={!prefersReducedMotion ? { animation: 'heartbeatWave 2s linear infinite' } : {}}
        className="opacity-70"
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
