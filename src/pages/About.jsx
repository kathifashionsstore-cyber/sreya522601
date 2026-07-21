import { Link } from 'react-router-dom'
import { Award, Baby, Calendar, CheckCircle2, Compass, HeartPulse, Microscope, ShieldCheck, Sparkles, Stethoscope, Target, Users } from 'lucide-react'
import { PageHero } from '../components/shared/PageHero'
import { Seo } from '../components/shared/Seo'
import { placeholderImages } from '../data/seed'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestoreCollection'
import { fallbackDoctors } from '../mockData/doctors'

const hospitalStats = [
  { label: 'Happy Families', value: '5,000+', icon: Users, desc: 'Couples & mothers supported' },
  { label: 'Clinical Leadership', value: '15+ Yrs', icon: Award, desc: 'Led by Dr. Vasanta Kiran' },
  { label: 'IVF & Laparoscopy', value: '3,500+', icon: Microscope, desc: 'Successful clinical procedures' },
  { label: 'Patient Satisfaction', value: '98%', icon: ShieldCheck, desc: 'Rating across Palnadu & AP' },
]

export default function About() {
  const { settings } = useSiteSettings()
  const banner = settings.pageBanners?.about || {}
  const about = settings.aboutPage || {}
  const { data: dbJourney } = useFirestoreDoc('sreyaJourney/active', null)
  const { data: dbDoctors } = useFirestoreCollection('doctors', fallbackDoctors)

  const doctor = dbDoctors && dbDoctors.length ? dbDoctors[0] : fallbackDoctors[0]

  const journeyMilestones = dbJourney?.milestones || about.milestones || [
    { year: '2010', title: 'Founding Vision', description: 'Established with a mission to bring world-class fertility and maternity care to Narasaraopet.' },
    { year: '2015', title: 'Advanced Embryology Lab', description: 'Upgraded cleanroom IVF lab facility with ICSI and computerized imaging technology.' },
    { year: '2019', title: 'Laparoscopic Care Wing', description: 'Expanded minimal-access keyhole surgical theater for complex fertility and gynaecology cases.' },
    { year: '2023', title: 'Comprehensive Maternity Wing', description: 'Integrated preconception to postnatal care under one roof for Palnadu families.' },
  ]

  const sortedMilestones = [...journeyMilestones].sort((a, b) => Number(a.year) - Number(b.year))

  return (
    <>
      <Seo
        title="About Sreya Hospitals & IVF Centre"
        description="Discover Sreya Hospitals' mission, vision, clinical leadership by Dr. M. Vasanta Kiran, and 15+ years of trusted fertility care in Narasaraopet."
      />

      <PageHero
        badge={banner.badge || 'About Sreya Hospitals'}
        title={banner.title || "Dedicated Fertility, Maternity & Women's Care"}
        subtitle={banner.subtitle || settings.tagline || "Walking with you from preconception to parenthood with clarity and ethics."}
        image={banner.imageUrl || placeholderImages.care}
        breadcrumb={banner.breadcrumb || 'About Us'}
      />

      {/* Stats Overview Bar */}
      <section className="relative z-10 -mt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl lg:grid-cols-4 sm:p-8">
          {hospitalStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-col items-center text-center p-3">
                <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-brand-blush text-brand-rose">
                  <Icon className="size-6" />
                </span>
                <span className="text-2xl sm:text-3xl font-black text-brand-navy">{stat.value}</span>
                <span className="text-xs font-black text-text-primary uppercase tracking-wider mt-1">{stat.label}</span>
                <span className="text-[10px] text-text-muted mt-0.5">{stat.desc}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Main Story & Vision Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-blush px-3.5 py-1 text-xs font-black uppercase tracking-wider text-brand-rose">
                <Sparkles className="size-3.5" /> Our Founding Story
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-navy leading-tight font-display">
                {about.title || 'Care That Starts With Clarity & Ethics.'}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                {about.paragraphs?.[0] ||
                  'Sreya Hospitals & IVF Centre was established in Narasaraopet to bridge the gap between advanced reproductive science and compassionate, personalized patient care. We believe every couple deserves transparent advice without unnecessary procedures.'}
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                {about.paragraphs?.[1] ||
                  'From initial follicular scans to specialized embryology monitoring, our lead specialist supervises every step of your care journey to ensure high success rates and complete peace of mind.'}
              </p>
              
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-brand-cream/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-brand-navy mb-1">
                    <Target className="size-4 text-brand-rose" /> Our Vision
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    To be the gold standard in fertility and maternal healthcare across Andhra Pradesh through clinical excellence.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-brand-cream/60 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-brand-navy mb-1">
                    <Compass className="size-4 text-brand-teal" /> Our Mission
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Delivering evidence-based, affordable, and warm healthcare tailored to each patient's unique health story.
                  </p>
                </div>
              </div>
            </div>

            {/* Doctor Spotlight Card */}
            <div className="relative rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xl overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 h-32 w-32 bg-brand-blush/40 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                {doctor?.photoUrl ? (
                  <img
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    className="size-20 rounded-2xl object-cover border-2 border-brand-teal shadow-md"
                  />
                ) : (
                  <span className="grid size-20 place-items-center rounded-2xl bg-brand-teal text-white shadow-md font-black text-xl">
                    VK
                  </span>
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-rose">Lead Specialist &amp; Founder</span>
                  <h3 className="text-xl font-black text-brand-navy">{doctor?.name || 'Dr. M. Vasanta Kiran'}</h3>
                  <p className="text-xs font-bold text-brand-teal mt-0.5">{doctor?.specialty || 'Fertility & Gynaecology Specialist'}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{doctor?.qualifications || 'MBBS, DGO, DRM (Germany), Fellowship in IVF'}</p>
                </div>
              </div>

              <blockquote className="italic text-xs sm:text-sm text-slate-700 leading-relaxed bg-brand-cream/40 p-4 rounded-2xl border border-slate-100">
                "{about.doctorQuote || 'Our pledge is simple: honest guidance, advanced technology, and dedicated personal attention for every patient walking through our doors.'}"
              </blockquote>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="size-4 text-emerald-500" /> Direct Specialist Consultation at Every Visit
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="size-4 text-emerald-500" /> State-of-the-Art Cleanroom IVF Embryology Lab
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="size-4 text-emerald-500" /> 100% Transparent Diagnostic Reporting
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/doctors"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-black text-white hover:bg-brand-teal transition"
                >
                  <Stethoscope className="size-4" /> Meet Dr. Vasanta Kiran &amp; Team
                </Link>
              </div>
            </div>
          </div>

          {/* Sreya Journey Milestones Timeline */}
          <div className="pt-8 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Milestones</span>
              <h2 className="text-3xl font-black text-brand-navy font-display">Sreya's Journey of Trust</h2>
              <p className="text-xs sm:text-sm text-slate-600">Key milestones in our commitment to advancing healthcare in Palnadu.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sortedMilestones.map((item, index) => {
                const icons = [Award, HeartPulse, ShieldCheck, Baby]
                const Icon = icons[index % icons.length]
                return (
                  <div
                    key={`${item.year}-${item.title}`}
                    className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-soft hover:shadow-lift transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="grid size-10 place-items-center rounded-xl bg-brand-blush text-brand-rose font-black text-xs">
                          <Icon className="size-5" />
                        </span>
                        <span className="text-sm font-black text-brand-teal px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-brand-navy mb-2">{item.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-brand-navy via-brand-teal to-brand-rose p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black font-display">Ready to Begin Your Care Journey?</h2>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed text-slate-100">
              Schedule a personalized consultation with Dr. M. Vasanta Kiran or explore our modern hospital facilities in Narasaraopet.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/appointment"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black text-brand-navy hover:bg-brand-cream transition shadow-md"
              >
                <Calendar className="size-4 text-brand-rose" /> Book Appointment
              </Link>
              <Link
                to="/facilities"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs font-black text-white hover:bg-white/20 transition"
              >
                Explore Facilities &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
