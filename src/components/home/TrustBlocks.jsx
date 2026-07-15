import { motion } from 'framer-motion'
import { iconMap } from '../../data/seed'
import { trustPoints, differentiators } from '../../mockData/settings'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function TrustBlocks({ collection = 'trustPoints', variant = 'plain' }) {
  const items = (collection === 'differentiators' ? differentiators : trustPoints).filter((item) => item.active !== false)
  const { settings } = useSiteSettings()
  const copy = collection === 'differentiators' ? settings.differentiatorSection : settings.trustSection

  return (
    <section className={variant === 'cards' ? 'bg-white py-16' : 'bg-brand-cream py-16'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className={variant === 'cards' ? 'lg:sticky lg:top-28' : ''}>
            <p className="text-sm font-black uppercase text-brand-rose">{copy?.eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black text-brand-navy sm:text-4xl">{copy?.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{copy?.body}</p>
          </div>
          <div className={variant === 'cards' ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}>
            {items.map((item, index) => {
              const Icon = iconMap[item.iconKey] || iconMap.Sparkles
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.32, delay: index * 0.03 }}
                  className={
                    variant === 'cards'
                      ? 'group border-l-4 border-brand-teal bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift'
                      : 'bg-transparent p-2'
                  }
                >
                  <div
                    className={
                      variant === 'cards'
                        ? 'grid size-12 place-items-center rounded-lg bg-brand-blush text-brand-rose'
                        : 'grid size-12 place-items-center rounded-full border border-brand-teal/20 bg-white text-brand-teal shadow-sm'
                    }
                  >
                    {item.iconUrl ? <img src={item.iconUrl} alt="" className="size-7 object-contain" loading="lazy" /> : <Icon className="size-6" />}
                  </div>
                  <h3 className="mt-4 text-lg font-black text-brand-navy">{item.heading}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
