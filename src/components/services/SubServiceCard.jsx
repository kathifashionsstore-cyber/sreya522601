import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Microscope, Sparkles, Stethoscope, TrendingUp, UsersRound } from 'lucide-react'
import { getServiceUrl } from '../../mockData/services'

// Define default group icons
const groupIcons = {
  'female-tests': Stethoscope,
  'male-tests': Microscope,
  'both-partners': UsersRound,
}

export function SubServiceCard({ category, service, variant = 'split' }) {
  const accent = category.accentColor || category.color || 'var(--color-primary)'
  const detailUrl = getServiceUrl(service, [category])

  if (variant === 'split') {
    // Split Card (Variant C) Layout - side-by-side content and metrics
    return (
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:shadow-lift hover:border-slate-200/60"
      >
        <Link to={detailUrl} className="grid md:grid-cols-[1fr_220px] divide-y md:divide-y-0 md:divide-x divide-slate-100 h-full">
          {/* Main content area */}
          <div className="p-6 md:p-8 flex flex-col justify-between min-h-[176px]">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-black text-brand-navy group-hover:text-brand-teal transition-colors duration-300 relative inline-block">
                  {service.title}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-teal transition-all duration-300 group-hover:w-full" />
                </h3>
                <span className="grid size-9 place-items-center rounded-lg bg-slate-55 text-slate-400 group-hover:bg-brand-teal/10 group-hover:text-brand-teal transition-colors shrink-0">
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                {service.shortDescription}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-black text-brand-rose">
              <span>Explore details & requirements</span>
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Metrics side panel */}
          <div className="p-6 flex flex-col justify-center bg-slate-50/40 space-y-5 group-hover:bg-slate-50/70 transition-colors">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Duration</p>
              <div className="mt-1.5 flex items-center gap-1.5 text-slate-700">
                <Clock className="size-4 text-brand-rose" />
                <span className="text-sm font-bold">{service.duration || 'Varies'}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Success Rate</p>
              <div 
                className="mt-1.5 flex items-center gap-1.5 text-white rounded-lg px-3 py-1.5 w-fit shadow-sm"
                style={{ backgroundColor: accent }}
              >
                <TrendingUp className="size-3.5" />
                <span className="text-[10px] font-black uppercase tracking-wider">High Success</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Icon-Top (Variant A) Layout - perfect for diagnostic testing grid items
  const IconComponent = groupIcons[service.subgroup] || Sparkles

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:shadow-lift hover:border-slate-200/60"
    >
      <Link to={detailUrl} className="flex flex-col justify-between h-full">
        <div>
          {/* Icon at the top */}
          <div
            className="grid size-12 place-items-center rounded-xl bg-brand-blush text-brand-rose transition-all duration-300 group-hover:bg-brand-teal group-hover:text-white group-hover:shadow-md"
            style={{ '--category-accent': accent }}
          >
            <IconComponent className="size-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <h3 className="mt-5 text-lg font-black text-brand-navy group-hover:text-brand-teal transition-colors duration-300 relative inline-block">
            {service.title}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-teal transition-all duration-300 group-hover:w-full" />
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
            {service.shortDescription}
          </p>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-black text-slate-550">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5 text-brand-rose" /> {service.duration || '1 day'}
          </span>
          <span className="flex items-center gap-1 text-brand-teal group-hover:text-primary transition-colors">
            Learn More <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
