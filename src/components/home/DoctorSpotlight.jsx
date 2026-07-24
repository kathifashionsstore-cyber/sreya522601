import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Award, Users, ChevronRight } from 'lucide-react'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { doctors as fallbackDoctors } from '../../data/seed'

export function DoctorSpotlight() {
  const { data: dbDoctors } = useFirestoreCollection('doctors', fallbackDoctors, null)
  const doctor = useMemo(() => {
    const items = dbDoctors && dbDoctors.length ? dbDoctors : fallbackDoctors
    const sorted = [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
    return sorted[0]
  }, [dbDoctors])

  const docPhoto = doctor.photoUrl || 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=800&q=80'
  const name = doctor.name || 'Dr. Vasanta Kiran Mekala'
  const qualifications = doctor.qualifications || 'M.S (OBG), MRCOG (UK)'
  const aboutDocText = doctor.bio || 'Dr. Vasanta Kiran Mekala is the founder and lead infertility specialist at Sreya Hospitals. With over 17 years of dedicated clinical expertise, she personally guides patients through follicular scans, precise medication protocols, and surgical cycles, ensuring consistency and absolute clinical transparency at every step.'
  
  const expYears = doctor.practicingSinceYear ? (new Date().getFullYear() - doctor.practicingSinceYear) : 17
  const proceduresCount = doctor.proceduresCount || '2,000+ Miracle Babies Helped'

  return (
    <section className="bg-[var(--color-bg-base)] py-16 sm:py-24 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center max-w-5xl mx-auto">
          
          {/* Column 1: Doctor Photo (Glassmorphism framed) */}
          <div className="relative flex justify-center">
            {/* Ambient decorative blur glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[var(--color-accent-blush)] to-[var(--color-primary-light)] rounded-3xl blur-xl opacity-35" />
            
            {/* The photo container */}
            <div className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 backdrop-blur-[20px] shadow-soft">
              <img
                src={docPhoto}
                alt={name}
                className="w-full max-w-[360px] h-[420px] object-cover rounded-xl shadow-inner"
              />
              {/* Floating tiny experience badge */}
              <div className="absolute bottom-6 right-6 bg-[var(--color-bg-dark)] border border-white/20 text-white rounded-lg px-4 py-2 text-xs font-black shadow-lg">
                Lead IVF Specialist
              </div>
            </div>
          </div>

          {/* Column 2: Details */}
          <div className="space-y-6 text-left">
            <span className="eyebrow-badge bg-[var(--color-accent-blush)] text-primary border border-[var(--color-border)] text-xs">
              Meet Your Specialist
            </span>
            <h2 className="text-section-heading font-display mt-2">
              {name}
            </h2>
            <p className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
              {qualifications}
            </p>
            <p className="text-body-paragraph border-l-2 border-primary/50 pl-4">
              {aboutDocText}
            </p>

            {/* Stats chips */}
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 text-xs font-extrabold text-text-primary shadow-sm">
                <Award className="size-4 text-primary" /> {expYears}+ Years Experience
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 text-xs font-extrabold text-text-primary shadow-sm">
                <Users className="size-4 text-primary" /> {proceduresCount}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                to="/doctors"
                className="btn-primary-custom"
              >
                Meet {name.split(' ')[0]} {name.split(' ')[1] || ''} <ChevronRight className="size-4" />
              </Link>
              <Link
                to="/services"
                className="btn-secondary-custom"
              >
                View Services
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
