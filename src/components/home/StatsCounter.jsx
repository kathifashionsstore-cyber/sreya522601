import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { iconMap, publicSettings } from '../../data/seed'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { yearsSince } from '../../lib/dateUtils'

gsap.registerPlugin(ScrollTrigger)

function splitStat(stat, settings) {
  const raw =
    stat.value === 'experienceYears' || stat.sourceField === 'practicingSinceYear'
      ? yearsSince(settings.practicingSinceYear || 2009)
      : stat.value
  const match = String(raw).match(/(\d+(\.\d+)?)(.*)/)
  if (!match) return { number: 0, suffix: stat.suffix || '' }
  return { number: Number(match[1]), suffix: stat.suffix ?? match[3] ?? '' }
}

export function StatsCounter({ stats = publicSettings.stats }) {
  const ref = useRef(null)
  const { settings } = useSiteSettings()

  useEffect(() => {
    const ctx = gsap.context((self) => {
      self.selector('.stat-value').forEach((node) => {
        const target = Number(node.dataset.target)
        const suffix = node.dataset.suffix || ''
        const decimals = String(target).includes('.') ? 1 : 0
        gsap.fromTo(
          node,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.2,
            ease: 'power2.out',
            snap: { textContent: decimals ? 0.1 : 1 },
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
            onUpdate() {
              node.textContent = `${Number(node.textContent).toFixed(decimals).replace(/\.0$/, '')}${suffix}`
            },
          },
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [stats])

  return (
    <div ref={ref} className="relative border-y border-white/70 bg-white/75 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-5 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => {
          const { number, suffix } = splitStat(stat, settings)
          const Icon = iconMap[stat.iconKey] || iconMap.Sparkles
          return (
            <div key={stat.label} className="px-3 py-4 text-center">
              <span className="mx-auto grid size-10 place-items-center rounded-lg bg-brand-blush text-brand-rose">
                {stat.iconUrl ? <img src={stat.iconUrl} alt="" className="size-6 object-contain" loading="lazy" /> : <Icon className="size-5" />}
              </span>
              <p className="stat-value text-3xl font-black text-brand-teal" data-target={number} data-suffix={suffix}>
                {number}
              </p>
              <p className="mt-1 text-xs font-bold uppercase text-slate-500">{stat.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
