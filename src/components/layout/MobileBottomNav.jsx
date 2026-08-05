import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Building2, CalendarPlus, Home, Menu, Phone, Stethoscope, X } from 'lucide-react'
import {
  getLockedServiceCategories,
  getServiceCategoryUrl,
  serviceCategories as fallbackCategories,
} from '../../mockData/services'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'

export function MobileTopBar() {
  const { settings } = useSiteSettings()
  return (
    <div className="flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <Link to="/" className="flex items-center gap-2">
        {settings.logoUrl || '/logoo.webp' ? (
          <img 
            src={settings.logoUrl || '/logoo.webp'} 
            alt={settings.hospitalName || 'Sreya Hospitals'} 
            className="h-9 w-auto object-contain rounded bg-white shadow-soft"
          />
        ) : (
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-white shadow-sm">
            <Stethoscope className="size-5" />
          </span>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-black leading-tight text-brand-navy tracking-tight">
            {settings.hospitalName || 'Sreya Hospitals'}
          </span>
          <span className="text-[9px] font-bold text-brand-rose tracking-wider uppercase">
            &amp; IVF Centre
          </span>
        </div>
      </Link>
      <a
        href={`tel:${settings.phoneMobile || '9390328255'}`}
        className="grid size-10 place-items-center rounded-lg bg-brand-blush text-brand-rose shadow-sm"
        aria-label="Call hospital mobile"
      >
        <Phone className="size-5" />
      </a>
    </div>
  )
}

function Sheet({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] bg-brand-ink/40 lg:hidden">
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-2xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl border-t border-slate-100">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-black text-brand-navy uppercase tracking-wider">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function MobileBottomNav() {
  const [sheet, setSheet] = useState(null)
  const { settings } = useSiteSettings()
  
  const { data: dbCategories } = useFirestoreCollection('serviceCategories', fallbackCategories)
  const categories = getLockedServiceCategories(dbCategories)

  const close = () => setSheet(null)

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-lg lg:hidden">
        <NavLink to="/" className={({ isActive }) => `mobile-tab ${isActive ? 'text-primary font-black' : 'text-slate-500'}`}>
          <Home className="size-5" /> Home
        </NavLink>
        <button type="button" className="mobile-tab text-slate-500" onClick={() => setSheet('services')}>
          <Stethoscope className="size-5" /> Services
        </button>
        <NavLink
          to="/appointment"
          className={({ isActive }) =>
            `mobile-tab relative -mt-6 text-brand-navy ${isActive ? 'font-black' : ''}`
          }
        >
          <span className="grid size-16 place-items-center rounded-full bg-primary text-white shadow-xl ring-4 ring-white transition hover:bg-primary-dark">
            <CalendarPlus className="size-7" />
          </span>
          <span className="-mt-1 text-[0.68rem] font-black text-brand-navy">Book</span>
        </NavLink>
        <NavLink to="/facilities" className={({ isActive }) => `mobile-tab ${isActive ? 'text-primary font-black' : 'text-slate-500'}`}>
          <Building2 className="size-5" /> Facilities
        </NavLink>
        <button type="button" className="mobile-tab text-slate-500" onClick={() => setSheet('menu')}>
          <Menu className="size-5" /> Menu
        </button>
      </nav>

      {/* Services Sheet */}
      <Sheet open={sheet === 'services'} title="Services Categories" onClose={close}>
        <div className="grid gap-3">
          <Link
            to="/services"
            onClick={close}
            className="rounded-xl bg-gradient-to-r from-brand-navy to-brand-teal p-4 font-black text-white shadow-md hover:opacity-95 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Stethoscope className="size-5 text-brand-rose" />
              <span>All Medical &amp; Fertility Services</span>
            </div>
            <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full text-white">View All &rarr;</span>
          </Link>

          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 pt-2 px-1">
            Browse By Category
          </div>

          {categories.map((category) => (
            <Link
              key={category.id}
              to={getServiceCategoryUrl(category)}
              onClick={close}
              className="rounded-xl border border-slate-100 p-4 font-bold text-brand-navy bg-slate-50 hover:bg-brand-blush/20 transition flex items-center justify-between"
            >
              <span>{category.title}</span>
              <span className="text-xs text-brand-teal">Browse &rarr;</span>
            </Link>
          ))}
        </div>
      </Sheet>

      {/* Contact Sheet */}
      <Sheet open={sheet === 'contact'} title="Contact Sreya IVF" onClose={close}>
        <div className="grid gap-3">
          <a
            href={`https://wa.me/91${settings.phoneMobile || '9390328255'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#25D366] py-3.5 text-center font-bold text-white shadow-sm"
          >
            WhatsApp Support
          </a>
          <a
            href={`tel:${settings.phoneMobile || '9390328255'}`}
            className="rounded-xl bg-primary py-3.5 text-center font-bold text-white shadow-sm"
          >
            Call Mobile Now
          </a>
          <Link
            to="/contact"
            onClick={close}
            className="rounded-xl border border-slate-200 py-3.5 text-center font-bold text-brand-navy bg-white shadow-sm hover:bg-slate-50"
          >
            View Contact Details &amp; Map
          </Link>
        </div>
      </Sheet>

      {/* Full-Screen Menu Sheet */}
      <Sheet open={sheet === 'menu'} title="Site Menu" onClose={close}>
        <div className="grid gap-2">
          {[
            { label: 'Home', href: '/' },
            { label: 'Our Story (About)', href: '/about' },
            { label: 'All Services Overview', href: '/services' },
            { label: 'Meet Dr. Vasanta Kiran', href: '/doctors' },
            { label: 'Facilities', href: '/facilities' },
            { label: 'Gallery', href: '/gallery' },
            { label: 'Blog Articles', href: '/blog' },
            { label: 'Contact Us', href: '/contact' },
            { label: 'Book Appointment', href: '/appointment' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={close}
              className="rounded-xl px-4 py-3 font-bold text-text-secondary hover:bg-brand-blush hover:text-primary transition-colors text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Sheet>
    </>
  )
}
