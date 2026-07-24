import { useEffect, useState } from 'react'

const loadingMessages = [
  'Preparing specialist care...',
  'Loading doctor profile...',
  'Checking consultation details...',
  'Connecting you with Sreya care...',
  'Setting up your hospital visit...'
]

export function IVFLoader({ inline = false }) {
  const [msgIdx, setMsgIdx] = useState(0)
  const [showMsg, setShowMsg] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (event) => setPrefersReducedMotion(event.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowMsg(true)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showMsg) return undefined
    const timer = window.setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % loadingMessages.length)
    }, 2200)
    return () => window.clearInterval(timer)
  }, [showMsg])

  const animated = !prefersReducedMotion

  const loaderIcon = (
    <div className="relative grid size-36 place-items-center">
      <style>{`
        @keyframes doctorOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes doctorPulse {
          0%, 100% { transform: scale(0.96); opacity: 0.58; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes coatDraw {
          0% { stroke-dashoffset: 260; opacity: 0.42; }
          48% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes ecgRun {
          0% { stroke-dashoffset: 96; }
          100% { stroke-dashoffset: -96; }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      <div
        className="absolute inset-0 rounded-full border border-primary/15 bg-primary/5"
        style={animated ? { animation: 'doctorPulse 2.6s ease-in-out infinite' } : {}}
      />
      <div
        className="absolute inset-3 rounded-full border border-dashed border-primary/30"
        style={animated ? { animation: 'doctorOrbit 8s linear infinite' } : {}}
      />
      <div className="absolute -right-1 top-6 grid size-10 place-items-center rounded-full border border-[var(--color-border)] bg-white shadow-soft">
        <img src="/logoo.webp" alt="" className="size-7 object-contain" />
      </div>

      <svg viewBox="0 0 140 140" className="relative z-10 size-32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="doctorCoatGradient" x1="24" y1="16" x2="116" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0D9488" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
          <radialGradient id="doctorBadgeGlow" cx="50%" cy="50%" r="50%">
            <stop stopColor="#CCFBF1" stopOpacity="0.95" />
            <stop offset="1" stopColor="#CCFBF1" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="70" cy="70" r="48" fill="url(#doctorBadgeGlow)" />
        <path
          d="M52 48c0-10 8-18 18-18s18 8 18 18-8 18-18 18-18-8-18-18Z"
          stroke="url(#doctorCoatGradient)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M31 115c5-27 18-41 39-41s34 14 39 41"
          stroke="url(#doctorCoatGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="260"
          strokeDashoffset={animated ? 260 : 0}
          style={animated ? { animation: 'coatDraw 2.4s ease-in-out infinite alternate' } : {}}
        />
        <path
          d="M49 77 64 113M91 77 76 113M64 75l6 13 6-13"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.78"
        />
        <path
          d="M46 70v13c0 10 8 18 18 18h2M94 70v13c0 10-8 18-18 18h-2"
          stroke="#0D9488"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="42" cy="68" r="5" fill="#0D9488" />
        <circle cx="98" cy="68" r="5" fill="#0D9488" />
        <circle
          cx="70"
          cy="104"
          r="7"
          fill="#ffffff"
          stroke="#0F172A"
          strokeWidth="3"
          style={animated ? { animation: 'badgeFloat 2.2s ease-in-out infinite' } : {}}
        />
        <path
          d="M25 122h23l5-8 7 16 8-27 8 19h39"
          stroke="#0F766E"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="96"
          strokeDashoffset={animated ? 96 : 0}
          style={animated ? { animation: 'ecgRun 1.8s linear infinite' } : {}}
        />
        <path d="M107 35h14M114 28v14" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  )

  if (inline) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-6">
        {loaderIcon}
        <span className="text-xs font-bold text-text-secondary">Loading doctor care...</span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[var(--color-bg-base)] text-text-primary">
      <div className="flex flex-col items-center gap-5">
        {loaderIcon}
        {showMsg && (
          <div className="h-12 space-y-1.5 text-center">
            <p className="text-sm font-black tracking-wide text-text-primary">
              {loadingMessages[msgIdx]}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
              Dr. M. Vasanta Kiran - Sreya Hospitals
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
