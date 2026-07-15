import { Phone, Stethoscope } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function MaintenanceMode() {
  const { settings } = useSiteSettings()
  return (
    <main className="grid min-h-screen place-items-center bg-brand-cream px-4 py-16">
      <section className="max-w-xl rounded-lg bg-white p-8 text-center shadow-soft">
        <span className="mx-auto grid size-16 place-items-center rounded-lg bg-brand-blush text-brand-rose">
          <Stethoscope className="size-8" />
        </span>
        <h1 className="mt-5 text-3xl font-black text-brand-navy">We are making improvements</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          The website is temporarily in maintenance mode. The hospital can still be reached directly for urgent enquiries and appointments.
        </p>
        <a
          href={settings.phone ? `tel:${settings.phone}` : '/contact'}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-teal px-5 py-2.5 text-sm font-black text-white"
        >
          <Phone className="size-4" /> {settings.phone || 'Call the hospital'}
        </a>
      </section>
    </main>
  )
}
