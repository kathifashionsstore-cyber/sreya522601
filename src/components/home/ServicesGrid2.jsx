import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import {
  getLockedServiceCategories,
  getLockedSubServices,
  getServiceUrl,
  subServices as fallbackSubServices,
  serviceCategories as fallbackCategories,
} from '../../mockData/services'

export function ServicesGrid2() {
  const { data: dbSubServices } = useFirestoreCollection('subServices', [])
  const { data: dbCategories } = useFirestoreCollection('serviceCategories', [])

  const activeCategories = getLockedServiceCategories(dbCategories)
  const allSubServices = getLockedSubServices(dbSubServices)

  const featured = allSubServices.filter((s) => s.featured === true && s.active !== false)
  const treatments = allSubServices.filter((s) => s.active !== false)

  // Merge featured ones first, then add non-featured ones to fill up to 6 items
  const merged = [...featured]
  treatments.forEach((service) => {
    if (!merged.some((m) => m.id === service.id || m.slug === service.slug)) {
      merged.push(service)
    }
  })

  const list = merged
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return (a.order || 0) - (b.order || 0)
    })
    .slice(0, 6)

  return (
    <section className="bg-[var(--color-bg-base)] py-16 sm:py-24 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#3F8F84]">Core Treatments & Diagnostics</span>
          <h2 className="text-section-heading font-display mt-2">
            Featured Infertility Pathways
          </h2>
          <p className="text-body-paragraph max-w-xl mx-auto">
            Deep dive into our specific clinical treatment lines and advanced laboratory tests.
          </p>
        </div>

        {/* 6 Image-Backdrop Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {list.map((service, idx) => {
            const detailPath = getServiceUrl(service, activeCategories)

            const tagline = service.shortDescription || service.tagline || (service.whatIsIt ? service.whatIsIt.substring(0, 60) + '...' : '')
            const imgUrl = service.whatIsItImage || (service.images && service.images[0]) || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'

            return (
              <Link
                key={service.id || idx}
                to={detailPath}
                className="group relative h-72 overflow-hidden rounded-3xl border border-[#E5ECEB] shadow-sm hover:shadow-lg transition-all duration-350"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
                
                {/* Darkened Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#173A38]/95 via-[#173A38]/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white space-y-2 z-10">
                  <span className="text-[10px] font-black uppercase text-[#D8B26E] tracking-widest w-fit">
                    Pathway Details
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight font-display">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-200 leading-normal opacity-85 group-hover:opacity-100 transition-opacity">
                    {tagline}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-black text-[#D8B26E] opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore Details <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="btn-secondary-custom"
          >
            View All Services <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
