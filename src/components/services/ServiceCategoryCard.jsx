import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { iconMap } from '../../data/seed'
import { getServiceCategoryUrl } from '../../mockData/services'

export function ServiceCategoryCard({ category, count = 0 }) {
  const Icon = iconMap[category.iconKey] || iconMap.Sparkles
  const accentColor = category.color || '#0D9488'

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:shadow-lift hover:border-slate-200/60"
    >
      {/* Accent Color Band */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5" 
        style={{ backgroundColor: accentColor }}
      />

      <div className="overflow-hidden h-52 w-full relative">
        <img 
          src={category.imageUrl} 
          alt={category.title} 
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none" 
          loading="lazy" 
        />
        {/* Glassmorphic Badge count overlay */}
        <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-md border border-white/30 text-brand-navy text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
          {count} Services
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span 
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-50 transition-colors group-hover:bg-slate-100"
          >
            <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" style={{ color: accentColor }} />
          </span>
          <div>
            <h3 className="text-lg font-black text-brand-navy relative inline-block">
              {category.title}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-teal transition-all duration-300 group-hover:w-full" />
            </h3>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Advanced Catalog</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
          {category.description}
        </p>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <Link
            to={getServiceCategoryUrl(category)}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-brand-teal group-hover:text-primary transition-colors"
          >
            Explore Catalog 
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
