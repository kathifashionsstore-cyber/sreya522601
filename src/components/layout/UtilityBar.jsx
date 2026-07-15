import { Link } from 'react-router-dom'
import { CalendarDays, Phone, Stethoscope } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function UtilityBar() {
  const { settings } = useSiteSettings()
  const phoneHref = `tel:${settings.phonePrimary || '08647222888'}`

  return (
    <div className="relative z-50 hidden border-b border-slate-100 bg-brand-navy text-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2 text-xs font-bold">
        {/* Left Links */}
        <div className="flex items-center gap-6">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-white/80 transition hover:text-white">
            <Stethoscope className="size-4 text-brand-rose" /> Find Our Doctor
          </Link>
          <Link to="/free-camp" className="inline-flex items-center gap-2 text-white/80 transition hover:text-white">
            <CalendarDays className="size-4 text-brand-rose" /> Free Counselling Camp
          </Link>
        </div>

        {/* Right Contacts & Book button */}
        <div className="flex items-center gap-4">
          <a href={phoneHref} className="inline-flex items-center gap-2 text-white/85 transition hover:text-white">
            <Phone className="size-4 text-primary-light" />
            Call Primary: {settings.phonePrimary || '08647-222888'}
          </a>
          <Link
            to="/appointment"
            className="inline-flex items-center gap-2 rounded-full bg-brand-rose px-4 py-1.5 font-black text-white transition hover:bg-brand-rose-dark shadow-sm"
          >
            <CalendarDays className="size-4" />
            Book An Appointment
          </Link>
        </div>
      </div>
    </div>
  )
}
