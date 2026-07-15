import { useState } from 'react'
import { Volume2, VolumeX, ShieldCheck } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function HomeMomentsVideos() {
  const { settings } = useSiteSettings()
  
  const video1 = settings.hospitalMomentsVideo1 || '/videos/hospital-moments-1.mp4'
  const video2 = settings.hospitalMomentsVideo2 || '/videos/hospital-moments-2.mp4'

  const [muted1, setMuted1] = useState(true)
  const [muted2, setMuted2] = useState(true)

  return (
    <section className="bg-brand-cream py-16 sm:py-20 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-brand-teal flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-4" /> Real Spaces
          </span>
          <h2 className="text-3xl font-black text-brand-navy font-display">
            Hospital Moments & Recovery Spaces
          </h2>
          <p className="text-slate-655 text-sm sm:text-base leading-relaxed">
            Take a look inside Sreya Hospitals: our advanced equipment, patient safety measures, and transparent environment.
          </p>
        </div>

        {/* Side-by-Side Videos */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Video 1 */}
          <div className="group relative overflow-hidden rounded-3xl bg-slate-950 shadow-soft border border-slate-100/50 aspect-video flex items-center justify-center">
            <video
              src={video1}
              autoPlay
              muted={muted1}
              loop
              playsInline
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Overlay controller */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <span className="absolute top-4 left-4 bg-brand-teal/90 backdrop-blur-sm border border-white/10 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
              Clinical Infrastructure
            </span>

            <button
              onClick={() => setMuted1(!muted1)}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full shadow transition-all duration-200 z-10 hover:scale-105"
              aria-label="Toggle mute video 1"
            >
              {muted1 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </div>

          {/* Video 2 */}
          <div className="group relative overflow-hidden rounded-3xl bg-slate-950 shadow-soft border border-slate-100/50 aspect-video flex items-center justify-center">
            <video
              src={video2}
              autoPlay
              muted={muted2}
              loop
              playsInline
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Overlay controller */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            <span className="absolute top-4 left-4 bg-brand-rose/90 backdrop-blur-sm border border-white/10 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
              Patient Care Wards
            </span>

            <button
              onClick={() => setMuted2(!muted2)}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full shadow transition-all duration-200 z-10 hover:scale-105"
              aria-label="Toggle mute video 2"
            >
              {muted2 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
