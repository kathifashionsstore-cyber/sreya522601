import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, HelpCircle, FileText, Globe } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { getLockedSubServices, getServiceUrl, subServices as fallbackSubServices } from '../../mockData/services'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'

export function Footer() {
  const { settings } = useSiteSettings()
  
  const { data: dbSubServices } = useFirestoreCollection('subServices', fallbackSubServices)
  const services = getLockedSubServices(dbSubServices)

  // Treatments for Column 1: get up to 5 treatments
  const treatments = services
    .filter((s) => (s.categoryId || s.category) === 'fertility-treatments' && s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 5)

  return (
    <footer className="bg-brand-navy pb-24 pt-16 text-slate-300 lg:pb-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1: Treatments */}
        <div>
          <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-rose pl-3">
            Treatments
          </h3>
          <div className="grid gap-2 text-xs font-semibold">
            {treatments.map((t) => (
              <Link
                key={t.slug}
                to={getServiceUrl(t)}
                className="hover:text-white transition-colors"
              >
                {t.title}
              </Link>
            ))}
            <Link to="/services" className="text-brand-teal hover:text-white transition-colors mt-2 block font-extrabold">
              View All Services &rarr;
            </Link>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-teal pl-3">
            Quick Links
          </h3>
          <div className="grid gap-2 text-xs font-semibold">
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact &amp; Location
            </Link>
            <Link to="/facilities" className="hover:text-white transition-colors">
              Facilities
            </Link>
            <Link to="/blog" className="hover:text-white transition-colors">
              Blog &amp; News
            </Link>
            <Link to="/gallery" className="hover:text-white transition-colors">
              Hospital Gallery
            </Link>
            <Link to="/appointment" className="hover:text-white transition-colors text-brand-rose font-black">
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-l-2 border-primary-light pl-3">
            Contact
          </h3>
          <div className="grid gap-3 text-xs font-medium leading-relaxed">
            <p className="flex gap-2.5">
              <MapPin className="size-4 shrink-0 text-brand-rose" />
              <span>{settings.address || 'Guntur Road, Narsaraopet, Palnadu District, Andhra Pradesh - 522601'}</span>
            </p>
            <p className="flex gap-2.5">
              <Phone className="size-4 shrink-0 text-brand-teal" />
              <span className="grid gap-1">
                <span>Primary: {settings.phonePrimary || '08647-222888'}</span>
                <span>Mobile: {settings.phoneMobile || '9390328255'}</span>
              </span>
            </p>
            <p className="flex gap-2.5">
              <Mail className="size-4 shrink-0 text-primary-light" />
              <span>{settings.email || 'contact@sreyaivfcentre.com'}</span>
            </p>
            <p className="flex gap-2.5">
              <Clock className="size-4 shrink-0 text-slate-400" />
              <span>{settings.hours || 'Open daily: 09:00 am – 06:00 pm'}</span>
            </p>
          </div>
        </div>

        {/* Column 4: Social Icons & Trust */}
        <div>
          {settings.logoUrl || '/logoo.webp' ? (
            <div className="mb-4">
              <img 
                src={settings.logoUrl || '/logoo.webp'} 
                alt={settings.hospitalName || 'Sreya Hospitals'} 
                className="h-10 w-auto object-contain rounded bg-white p-1"
              />
            </div>
          ) : (
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-l-2 border-slate-500 pl-3">
              {settings.hospitalName || 'Sreya IVF Centre'}
            </h3>
          )}
          <p className="text-xs leading-relaxed text-slate-400 mb-4 font-semibold">
            Providing premium fertility care under the direct expertise of Dr. Vasanta Kiran Mekala in Narasaraopet.
          </p>
          <div className="flex gap-3">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
              aria-label="Instagram page"
            >
              <Globe className="size-4" />
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
              aria-label="Facebook page"
            >
              <FileText className="size-4" />
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
              aria-label="YouTube page"
            >
              <HelpCircle className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-16 max-w-7xl border-t border-slate-800 px-4 pt-8 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} {settings.hospitalName || 'Sreya Hospitals & IVF Centre'}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-450 font-bold">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <span>&middot;</span>
          <Link to="/terms-of-use" className="hover:text-white transition-colors">
            Terms of Use
          </Link>
          <span>&middot;</span>
          <Link to="/medical-disclaimer" className="hover:text-white transition-colors">
            Medical Disclaimer
          </Link>
          <span>&middot;</span>
          <Link to="/cookie-policy" className="hover:text-white transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
