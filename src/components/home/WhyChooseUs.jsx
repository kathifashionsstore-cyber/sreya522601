import { HeartHandshake, MapPin, ShieldCheck, Sparkles } from 'lucide-react'

const items = [
  {
    icon: Sparkles,
    title: 'Palnadu-first IVF positioning',
    text: 'Differentiator is seeded as verification-needed content so the hospital can confirm it before launch.',
  },
  {
    icon: HeartHandshake,
    title: 'Counselling-led care',
    text: 'Pages avoid invented prices or outcomes and direct families toward consultation.',
  },
  {
    icon: ShieldCheck,
    title: 'Security-first build',
    text: 'Firestore rules, App Check, serverless upload proxy, rate limiting, and admin-only writes are included.',
  },
  {
    icon: MapPin,
    title: 'Local SEO ready',
    text: 'Narasaraopet, Palnadu, IVF, IUI, ICSI, fertility treatment, and fertility testing keyword clusters are wired in.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-brand-cream py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-brand-rose">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-black text-brand-navy sm:text-4xl">
              A calm, premium website built around trust and editability.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Medical content changes. This build keeps public copy connected to Firestore and gives hospital staff a single admin surface for updates.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.title} className="rounded-lg border border-white bg-white p-5 shadow-soft">
                <div className="grid size-11 place-items-center rounded-lg bg-brand-blush text-brand-rose">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-black text-brand-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
