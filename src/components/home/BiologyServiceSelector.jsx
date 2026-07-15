import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  EmbryoIcon, 
  HeartsIcon, 
  UterusIcon, 
  OvumIcon, 
  SpermIcon, 
  PreservationIcon, 
  OvulationCalendarIcon, 
  DnaIcon 
} from '../shared/FertilityIcons'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { getServiceUrl, getLockedSubServices } from '../../mockData/services'

const selectorIconMap = {
  ivf: EmbryoIcon,
  iui: SpermIcon,
  icsi: OvumIcon,
  'fertility-preservation': PreservationIcon,
  'donor-programs': HeartsIcon,
  surrogacy: UterusIcon,
  'laparoscopic-surgeries': DnaIcon,
  'hysteroscopic-surgeries': DnaIcon,
  'ovulation-induction': OvulationCalendarIcon,
}

function compactTitle(title) {
  return title.replace(/\s*\([^)]*\)/g, '')
}

function subtitleFor(service) {
  const match = service.title.match(/\(([^)]+)\)/)
  if (match) return match[1]
  if (service.slug.includes('surger')) return 'Fertility Surgery'
  return 'Treatment Pathway'
}

export function BiologyServiceSelector() {
  const { data: dbSubServices } = useFirestoreCollection('subServices', [])
  const allSubServices = getLockedSubServices(dbSubServices)

  const selectorItems = allSubServices
    .filter((service) => (service.categoryId || service.category) === 'fertility-treatments' && service.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <section className="bg-brand-cream/45 py-16 sm:py-24 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-black uppercase tracking-widest text-primary">
          Choose a Pathway
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-brand-navy mt-2 mb-3 font-display">
          Select a Service to Know More
        </h2>
        <p className="text-sm text-text-secondary max-w-xl mx-auto mb-14 font-semibold leading-relaxed">
          Click on any speciality below to explore in-depth scientific processes, indications, care journeys, and expert FAQs.
        </p>

        {/* Treatment selector */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
          {selectorItems.map((item, idx) => {
            const Icon = selectorIconMap[item.slug] || DnaIcon
            return (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={getServiceUrl(item)}
                  className="group relative flex flex-col items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 h-56 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-primary/45"
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* Glowing Icon Container */}
                    <div className="grid size-14 place-items-center rounded-2xl bg-brand-blush text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-soft">
                      <Icon className="size-6 transition-transform group-hover:animate-wiggle" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-brand-navy tracking-tight group-hover:text-primary transition-colors">
                        {compactTitle(item.title)}
                      </h3>
                      <p className="text-[10px] font-bold text-brand-rose uppercase tracking-wider mt-0.5">
                        {subtitleFor(item)}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                    {item.shortDescription}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
