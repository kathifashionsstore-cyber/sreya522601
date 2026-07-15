import { Link } from 'react-router-dom'
import { CalendarDays, MessageCircle } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { Button } from '../shared/Button'

export function CTASection() {
  const { settings } = useSiteSettings()
  const copy = settings.ctaSection || {}
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl rounded-lg bg-brand-blush px-5 py-10 text-center shadow-soft sm:px-10">
        <p className="text-sm font-black uppercase text-brand-rose">{copy.eyebrow || 'Start with a consultation'}</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-3xl font-black text-brand-navy sm:text-4xl">
          {copy.title || 'Book a visit for fertility treatment or fertility testing.'}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          {copy.body || 'Online appointment requests are stored as pending until the hospital confirms them.'}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/appointment">
            <CalendarDays className="size-4" /> {copy.primaryLabel || 'Book Appointment'}
          </Button>
          <Button
            as="a"
            href={settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : '/contact'}
            variant="secondary"
          >
            <MessageCircle className="size-4" /> {copy.secondaryLabel || 'WhatsApp'}
          </Button>
        </div>
      </div>
    </section>
  )
}
