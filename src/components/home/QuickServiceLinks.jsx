import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  getLockedServiceCategories,
  getLockedSubServices,
  getServiceUrl,
  serviceCategories as fallbackCategories,
  subServices as fallbackSubServices,
} from '../../mockData/services'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'

export function QuickServiceLinks() {
  const { settings } = useSiteSettings()
  
  const { data: dbCategories } = useFirestoreCollection('serviceCategories', fallbackCategories)
  const { data: dbSubServices } = useFirestoreCollection('subServices', fallbackSubServices)

  const categories = getLockedServiceCategories(dbCategories)
  const services = getLockedSubServices(dbSubServices)

  const featured = services
    .filter((service) => service.featured && service.active !== false)
    .slice(0, 6)
    .map((service) => ({
      service,
      category: categories.find((category) => category.id === service.categoryId),
    }))
    .filter((item) => item.category)

  if (!featured.length) return null

  return (
    <section className="border-b border-slate-100 bg-white py-6">
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 pb-1 sm:px-6 lg:flex-wrap lg:overflow-visible lg:px-8">
        {featured.map(({ service, category }) => (
          <Link
            key={service.id}
            to={getServiceUrl(service, categories)}
            className="group relative grid h-24 min-w-56 overflow-hidden rounded-lg border border-slate-200 px-4 py-3 text-sm font-black text-white shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift"
            style={{ borderColor: category.accentColor || category.color || 'var(--color-primary)' }}
          >
            <img
              src={service.images?.[0] || category.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-45 transition group-hover:scale-105"
              loading="lazy"
            />
            <span
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${category.accentColor || category.color || 'var(--color-primary)'} 95%)`,
              }}
            />
            <span className="relative z-10 mt-auto flex items-center justify-between gap-3">
              {service.title}
              <ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-1" />
            </span>
            <span
              className="absolute inset-0 opacity-0 transition group-hover:opacity-10"
              style={{ backgroundColor: category.accentColor || category.color || 'var(--color-primary)' }}
            />
          </Link>
        ))}
        <Link
          to="/services"
          className="inline-flex min-w-max items-center gap-2 rounded-full bg-brand-teal px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-brand-blue"
        >
          {settings.quickServiceSection?.viewAllLabel || 'View All Services'} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
