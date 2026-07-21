import { Link } from 'react-router-dom'
import {
  Activity,
  Baby,
  Calendar,
  CalendarHeart,
  ChevronRight,
  Heart,
  HeartPulse,
  HelpCircle,
  Layers,
  Microscope,
  Scissors,
  User,
  Users,
} from 'lucide-react'
import { PageHero } from '../components/shared/PageHero'
import { Seo } from '../components/shared/Seo'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useSiteSettings } from '../context/SiteSettingsContext'
import {
  getLockedServiceCategories,
  getLockedSubServices,
  getServiceUrl,
  serviceCategories as fallbackCategories,
  subServices as fallbackSubServices,
} from '../mockData/services'

const iconMap = {
  Microscope,
  Baby,
  Heart,
  HeartPulse,
  Scissors,
  Calendar,
  CalendarHeart,
  Activity,
  Layers,
  User,
  Users,
}

export default function Services() {
  const { settings } = useSiteSettings()
  const { data: dbCategories } = useFirestoreCollection('serviceCategories', [])
  const { data: dbSubServices } = useFirestoreCollection('subServices', [])

  const categories = getLockedServiceCategories(dbCategories).sort((a, b) => (a.order || 0) - (b.order || 0))
  const subServices = getLockedSubServices(dbSubServices).sort((a, b) => (a.order || 0) - (b.order || 0))
  const banner = settings.pageBanners?.services || {}

  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Seo
        title="Services & Diagnostics | Sreya Hospitals"
        description="Explore IVF treatments, diagnostics, fertility surgery, preservation, and male/female testing at Sreya Hospitals Narasaraopet."
        image={banner.imageUrl || fallbackCategories[0]?.imageUrl}
      />

      <PageHero
        badge={banner.badge || 'Services'}
        title={banner.title || 'Comprehensive Fertility Care & Diagnostics'}
        subtitle={banner.subtitle || 'Complete diagnostic testing and clinical treatments managed under Sreya\'s lead specialist.'}
        image={banner.imageUrl || fallbackCategories[0]?.imageUrl}
        breadcrumb={banner.breadcrumb || 'Services'}
      />

      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-base)] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 sm:mb-10 max-w-xl text-center">
            <h2 className="text-xl sm:text-2xl font-black text-text-primary">Navigate Care Categories</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-text-secondary">Jump directly to specialized treatments, maternity care, or testing lists</p>
          </div>

          <div className="mx-auto grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 justify-center max-w-6xl">
            {categories.map((cat) => {
              const Icon = iconMap[cat.iconKey] || HelpCircle
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleScroll(cat.id)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {cat.imageUrl ? (
                    <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
                      <img src={cat.imageUrl} alt={cat.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  ) : null}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="mb-3 inline-grid size-10 place-items-center rounded-xl bg-[var(--color-accent-blush)] text-primary shadow-sm">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mb-1.5 text-sm font-black leading-snug tracking-tight text-text-primary group-hover:text-primary transition-colors">{cat.title}</h3>
                      <p className="text-xs leading-relaxed text-text-secondary line-clamp-2">{cat.tagline}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-base)] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-16 sm:space-y-20 px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => {
            const categoryServices = subServices.filter((service) => (service.categoryId || service.category) === cat.id)
            const Icon = iconMap[cat.iconKey] || HelpCircle

            return (
              <div key={cat.id} id={cat.id} className="scroll-mt-24 space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 border-b border-[var(--color-border)] pb-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--color-primary-light)] text-primary shadow-sm">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-black text-text-primary">{cat.title}</h2>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-text-secondary">{cat.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryServices.map((service) => {
                    const detailPath = getServiceUrl(service, categories)
                    const tagline =
                      service.shortDescription ||
                      service.tagline ||
                      (service.whatIsIt ? `${service.whatIsIt.substring(0, 80)}...` : '')
                    const serviceImage = service.cardImageUrl || service.heroImage || service.imageUrl

                    return (
                      <article
                        key={service.slug}
                        className="card-premium flex flex-col justify-between h-full bg-white border border-[#E5ECEB] rounded-2xl overflow-hidden shadow-soft hover:shadow-lift transition-all"
                      >
                        {serviceImage ? (
                          <div className="h-44 w-full overflow-hidden bg-slate-100">
                            <img src={serviceImage} alt={service.title} className="h-full w-full object-cover" loading="lazy" />
                          </div>
                        ) : null}
                        <div className="space-y-3 p-5 sm:p-6 flex-grow">
                          <span className="block w-fit rounded-full bg-accent-blush/60 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                            {service.pageType === 'test' ? 'Clinical Test' : 'Treatment Line'}
                          </span>
                          <h3 className="text-base font-black leading-snug text-text-primary">{service.title}</h3>
                          <p className="line-clamp-3 text-xs leading-relaxed text-text-secondary">{tagline}</p>
                        </div>

                        <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 mt-1 flex items-center justify-between border-t border-[var(--color-border)]/60 pt-4 text-xs">
                          <Link
                            to={detailPath}
                            className="flex items-center gap-1 font-black text-primary transition hover:text-primary-dark"
                          >
                            Read Details <ChevronRight className="size-4" />
                          </Link>
                          {service.subgroup ? (
                            <span className="text-[10px] font-bold tracking-tight text-text-muted capitalize">
                              {service.subgroup.replace('-', ' ')}
                            </span>
                          ) : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
