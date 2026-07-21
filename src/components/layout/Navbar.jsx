import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, ChevronDown, Phone } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import {
  getLockedSubServices,
  getServiceCategoryUrl,
  getServiceSubgroupUrl,
  getServiceUrl,
  serviceCategories,
  serviceSubgroups,
  subServices as fallbackSubServices,
} from '../../mockData/services'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'

import { ConsultationIcon } from '../shared/FertilityIcons'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null) // 'fertility' | 'about' | null
  const { settings } = useSiteSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data: dbSubServices } = useFirestoreCollection('subServices', fallbackSubServices)
  const services = getLockedSubServices(dbSubServices)

  // Filter treatments & testing subgroups for mega menu
  const treatments = services
    .filter((s) => (s.categoryId || s.category) === 'fertility-treatments' && s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const femaleTests = services
    .filter((s) => (s.categoryId || s.category) === 'fertility-testing' && s.subgroup === 'female-tests' && s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const maleTests = services
    .filter((s) => (s.categoryId || s.category) === 'fertility-testing' && s.subgroup === 'male-tests' && s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const jointTests = services
    .filter((s) => (s.categoryId || s.category) === 'fertility-testing' && s.subgroup === 'both-partners' && s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const treatmentCategory = serviceCategories.find((category) => category.id === 'fertility-treatments')
  const testingCategory = serviceCategories.find((category) => category.id === 'fertility-testing')

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.92)',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(10, 46, 77, 0.15)' : '0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.2 }}
      className="hidden border-b border-slate-100 backdrop-blur-md lg:block"
    >
      <div className="mx-auto flex h-20 items-center justify-between gap-6 px-6 max-w-7xl">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Sreya Hospitals home">
          {settings.logoUrl || '/logo.webp' ? (
            <img 
              src={settings.logoUrl || '/logo.webp'} 
              alt={settings.hospitalName || 'Sreya Hospitals'} 
              className="h-11 w-auto object-contain rounded-lg bg-white shadow-soft"
            />
          ) : (
            <span className="grid size-11 place-items-center rounded-xl bg-primary text-white shadow-md">
              <ConsultationIcon className="size-5" />
            </span>
          )}
          <div className="flex flex-col">
            <span className="text-base font-black leading-tight text-brand-navy tracking-tight">
              {settings.hospitalName || 'Sreya Hospitals'}
            </span>
            <span className="text-[10px] font-bold text-brand-rose tracking-wider uppercase">
              &amp; IVF Centre
            </span>
          </div>
        </Link>

        {/* Central Navigation Links */}
        <nav className="flex items-center gap-1 text-sm font-bold text-slate-700 h-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 transition hover:bg-brand-blush hover:text-primary ${isActive ? 'text-primary' : ''}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 transition hover:bg-brand-blush hover:text-primary ${isActive ? 'text-primary' : ''}`
            }
          >
            About
          </NavLink>

          {/* Mega-menu: Services */}
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setActiveMenu('fertility')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 rounded-lg px-3 py-2 transition hover:bg-brand-blush hover:text-primary ${
                activeMenu === 'fertility' ? 'bg-brand-blush text-primary' : ''
              }`}
            >
              Services <ChevronDown className="size-4" />
            </button>

            <AnimatePresence>
              {activeMenu === 'fertility' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-[80%] w-[960px] -translate-x-1/2 pt-4"
                >
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
                    <div className="grid grid-cols-[250px_1fr] divide-x divide-slate-100 bg-white p-6 gap-6">
                      {/* Column 1: Treatments */}
                      <div className="pr-6">
                        <Link
                          to={getServiceCategoryUrl(treatmentCategory)}
                          onClick={() => setActiveMenu(null)}
                          className="text-xs font-black uppercase tracking-wider text-brand-rose hover:text-brand-rose-dark block mb-4"
                        >
                          Fertility Treatments
                        </Link>
                        <div className="grid gap-1.5">
                          {treatments.map((t) => (
                            <Link
                              key={t.slug}
                              to={getServiceUrl(t)}
                              onClick={() => setActiveMenu(null)}
                              className="text-xs font-semibold text-text-secondary hover:text-primary transition-colors py-0.5"
                            >
                              {t.title}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: Testing Subgroups */}
                      <div className="pl-6 grid grid-cols-3 gap-6">
                        {/* Subgroup A: Female Tests */}
                        <div>
                          <Link
                            to={getServiceSubgroupUrl('female-tests')}
                            onClick={() => setActiveMenu(null)}
                            className="text-xs font-black uppercase tracking-wider text-brand-teal hover:text-brand-teal-dark block mb-3 border-b border-slate-100 pb-1.5"
                          >
                            Female Tests
                          </Link>
                          <div className="grid gap-1.5">
                            {femaleTests.map((t) => (
                              <Link
                                key={t.slug}
                                to={getServiceUrl(t)}
                                onClick={() => setActiveMenu(null)}
                                className="text-[11px] font-semibold text-text-secondary hover:text-primary transition-colors py-0.5"
                              >
                                {t.title}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Subgroup B: Male Tests */}
                        <div>
                          <Link
                            to={getServiceSubgroupUrl('male-tests')}
                            onClick={() => setActiveMenu(null)}
                            className="text-xs font-black uppercase tracking-wider text-brand-teal hover:text-brand-teal-dark block mb-3 border-b border-slate-100 pb-1.5"
                          >
                            Male Tests
                          </Link>
                          <div className="grid gap-1.5">
                            {maleTests.map((t) => (
                              <Link
                                key={t.slug}
                                to={getServiceUrl(t)}
                                onClick={() => setActiveMenu(null)}
                                className="text-[11px] font-semibold text-text-secondary hover:text-primary transition-colors py-0.5"
                              >
                                {t.title}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Subgroup C: Both Partners */}
                        <div>
                          <Link
                            to={getServiceSubgroupUrl('both-partners')}
                            onClick={() => setActiveMenu(null)}
                            className="text-xs font-black uppercase tracking-wider text-brand-teal hover:text-brand-teal-dark block mb-3 border-b border-slate-100 pb-1.5"
                          >
                            Both Partners
                          </Link>
                          <div className="grid gap-1.5">
                            {jointTests.map((t) => (
                              <Link
                                key={t.slug}
                                to={getServiceUrl(t)}
                                onClick={() => setActiveMenu(null)}
                                className="text-[11px] font-semibold text-text-secondary hover:text-primary transition-colors py-0.5"
                              >
                                {t.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Mega menu footer */}
                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
                      <Link
                        to="/services"
                        onClick={() => setActiveMenu(null)}
                        className="text-xs font-extrabold text-primary hover:text-primary-dark transition flex items-center justify-center gap-1"
                      >
                        View All Services &amp; Diagnostics &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 transition hover:bg-brand-blush hover:text-primary ${isActive ? 'text-primary' : ''}`
            }
          >
            Doctors
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 transition hover:bg-brand-blush hover:text-primary ${isActive ? 'text-primary' : ''}`
            }
          >
            Gallery
          </NavLink>
          <NavLink
            to="/facilities"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 transition hover:bg-brand-blush hover:text-primary ${isActive ? 'text-primary' : ''}`
            }
          >
            Facilities
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 transition hover:bg-brand-blush hover:text-primary ${isActive ? 'text-primary' : ''}`
            }
          >
            Blog
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 transition hover:bg-brand-blush hover:text-primary ${isActive ? 'text-primary' : ''}`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right CTA Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/appointment"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-rose px-5 py-2.5 text-xs font-black text-white hover:bg-brand-rose-dark transition shadow-sm"
          >
            <CalendarDays className="size-4" /> Book Appointment
          </Link>
          <a
            href={`tel:${settings.phoneMobile || '9390328255'}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-brand-navy hover:bg-slate-50 transition"
          >
            <Phone className="size-4 text-brand-teal animate-pulse" /> Call Now
          </a>
        </div>
      </div>
    </motion.header>
  )
}
