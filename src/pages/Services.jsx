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

      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-base)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="text-xl font-black text-text-primary">Navigate Care Categories</h2>
            <p className="mt-1 text-xs text-text-secondary">Jump directly to specialized treatments or testing lists</p>
          </div>

          <div className="mx-auto grid max-w-6xl justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((cat) => {
              const Icon = iconMap[cat.iconKey] || HelpCircle
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleScroll(cat.id)}
                  className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.title} className="h-24 w-full object-cover" loading="lazy" />
                  ) : null}
                  <div className="p-5">
                    <span className="mb-4 grid size-10 place-items-center rounded-lg bg-[var(--color-accent-blush)] text-primary shadow-sm">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mb-2 text-xs font-black leading-snug tracking-tight text-text-primary">{cat.title}</h3>
                    <p className="text-[10px] font-medium leading-normal text-text-secondary">{cat.tagline}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-bg-base)] py-16">
        <div className="mx-auto max-w-6xl space-y-20 px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => {
            const categoryServices = subServices.filter((service) => (service.categoryId || service.category) === cat.id)
            const Icon = iconMap[cat.iconKey] || HelpCircle

            return (
              <div key={cat.id} id={cat.id} className="scroll-mt-24 space-y-8">
                <div className="flex items-start gap-4 border-b border-[var(--color-border)] pb-5">
                  <span className="mt-1 grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--color-primary-light)] text-primary shadow-sm">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-black text-text-primary">{cat.title}</h2>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-text-secondary">{cat.description}</p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                        className="card-premium flex flex-col justify-between h-full bg-white border border-[#E5ECEB]"
                      >
                        {serviceImage ? (
                          <img src={serviceImage} alt={service.title} className="h-40 w-full object-cover" loading="lazy" />
                        ) : null}
                        <div className="space-y-3 p-6 flex-grow">
                          <span className="block w-fit rounded-full bg-accent-blush/50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                            {service.pageType === 'test' ? 'Clinical Test' : 'Treatment Line'}
                          </span>
                          <h3 className="text-base font-black leading-snug text-text-primary">{service.title}</h3>
                          <p className="line-clamp-3 text-xs leading-relaxed text-text-secondary">{tagline}</p>
                        </div>

                        <div className="mx-6 mb-6 mt-2 flex items-center justify-between border-t border-[var(--color-border)]/50 pt-6 text-xs">
                          <Link
                            to={detailPath}
                            className="flex items-center gap-1 font-black text-primary transition hover:text-primary-dark"
                          >
                            Read Details <ChevronRight className="size-4" />
                          </Link>
                          {service.subgroup ? (
                            <span className="text-[10px] font-bold tracking-tight text-text-muted">
                              Subgroup: {service.subgroup.replace('-', ' ')}
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
