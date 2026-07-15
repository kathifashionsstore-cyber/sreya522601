import { Award, HeartPulse, ShieldCheck } from 'lucide-react'
import { PageHero } from '../components/shared/PageHero'
import { Seo } from '../components/shared/Seo'
import { placeholderImages } from '../data/seed'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function About() {
  const { settings } = useSiteSettings()
  const banner = settings.pageBanners?.about || {}
  const about = settings.aboutPage || {}
  const milestones = [...(about.milestones || [])].sort((a, b) => Number(a.year) - Number(b.year))
  return (
    <>
      <Seo title="About Sreya Hospitals" description="Learn about Sreya Hospitals & IVF Centre, Narasaraopet, and its fertility and women's health care focus." />
      <PageHero
        badge={banner.badge || 'About Sreya Hospitals'}
        title={banner.title || 'Fertility and women\'s care for Palnadu families'}
        subtitle={banner.subtitle || settings.tagline}
        image={banner.imageUrl || placeholderImages.care}
        breadcrumb={banner.breadcrumb || 'About'}
      />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase text-brand-rose">{about.eyebrow || 'Our Story'}</p>
            <h1 className="mt-2 text-4xl font-black text-brand-navy">{about.title || 'Care that starts with clarity.'}</h1>
            {(about.paragraphs || []).map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-7 text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="grid gap-4">
            {milestones.map((item, index) => {
              const icons = [Award, HeartPulse, ShieldCheck]
              const Icon = icons[index % icons.length]
              return (
                <div key={`${item.year}-${item.title}`} className="rounded-lg border border-slate-100 bg-brand-cream p-5">
                  <Icon className="size-6 text-brand-teal" />
                  <p className="mt-3 text-sm font-black uppercase text-brand-rose">{item.year}</p>
                  <h2 className="mt-1 text-xl font-black text-brand-navy">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              )
            })}
            {!milestones.length ? (
              <div className="rounded-lg border border-slate-100 bg-brand-cream p-5">
                <Award className="size-6 text-brand-teal" />
                <h2 className="mt-3 text-xl font-black text-brand-navy">{settings.hospitalName}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{settings.tagline}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
