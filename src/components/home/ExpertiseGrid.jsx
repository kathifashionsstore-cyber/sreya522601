import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { iconMap } from '../../data/seed'
import { getServiceCategoryUrl, serviceCategories } from '../../mockData/services'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function ExpertiseGrid({ showButton = true, limit }) {
  const categories = serviceCategories
  const { settings } = useSiteSettings()
  const visible = limit ? categories.slice(0, limit) : categories
  const copy = settings.expertiseSection || {}

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase text-brand-rose">{copy.eyebrow || 'Our Expertise'}</p>
          <h2 className="mt-2 text-3xl font-black text-brand-navy sm:text-4xl">
            {copy.title || 'Comprehensive Fertility & Women\'s Care'}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            {copy.body || 'Browse care categories maintained by the hospital team through Firestore.'}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {visible.map((category, index) => {
            const Icon = iconMap[category.iconKey] || iconMap.Sparkles
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.04 }}
              >
                <Link
                  to={getServiceCategoryUrl(category)}
                  className="group grid min-h-52 place-items-center rounded-lg border border-slate-100 bg-white p-5 text-center shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift"
                  style={{ '--category-accent': category.accentColor || category.color || 'var(--color-primary)' }}
                >
                  <span className="grid size-20 place-items-center rounded-full bg-slate-100 transition group-hover:bg-brand-blush">
                    {category.iconUrl ? (
                      <img src={category.iconUrl} alt="" className="size-10 object-contain" loading="lazy" />
                    ) : (
                      <Icon className="size-9" style={{ color: 'var(--category-accent)' }} />
                    )}
                  </span>
                  <span className="mt-4 text-base font-black leading-tight text-brand-navy">{category.title}</span>
                  <span className="mt-2 text-xs font-bold text-slate-500">{category.tagline}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
        {showButton ? (
          <div className="mt-9 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-brand-teal px-6 py-3 text-sm font-black text-brand-teal transition hover:bg-brand-teal hover:text-white"
            >
              {copy.buttonLabel || 'View All Specialities'} <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
