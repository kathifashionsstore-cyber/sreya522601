import { Link, useSearchParams } from 'react-router-dom'
import { CalendarCheck, CheckCircle2, ExternalLink, Home, Phone, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/shared/Button'

const PUBLIC_SITE_HOME = 'https://www.sreyaivfcentre.com/'

export default function VerifyAppointment() {
  const [params] = useSearchParams()
  const receiptId = params.get('receiptId')

  return (
    <>
      <Seo title="Verify Appointment" description="Verify a Sreya Hospitals appointment receipt ID." />
      <section className="min-h-[70vh] bg-[#EEF7F4] px-4 py-14">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-teal-100 bg-white shadow-soft">
          <div className="bg-[#101827] px-6 py-6 text-white">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#F8D36B]">Official Sreya Verification</p>
                <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">Appointment Receipt Verified</h1>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-teal-50/80">
                  This page confirms that the QR code opened the official Sreya Hospitals & IVF Centre website.
                </p>
              </div>
              <span className="grid size-14 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="size-8" />
              </span>
            </div>
          </div>

          <div className="grid gap-5 p-6 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Receipt ID</p>
                <p className="mt-2 break-words text-3xl font-black text-brand-navy">{receiptId || 'Missing receipt ID'}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: 'QR checked', text: 'Receipt opened from the official website.' },
                  { icon: Phone, title: 'Call pending', text: 'Hospital team must confirm the final slot.' },
                  { icon: CalendarCheck, title: 'Visit ready', text: 'Bring this receipt during hospital visit.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
                    <item.icon className="size-5 text-primary" />
                    <p className="mt-3 text-sm font-black text-brand-navy">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-amber-800">Important</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-amber-900">
                  Verification confirms the receipt ID format and official QR destination. Clinical appointment approval,
                  doctor availability, and exact timing must be confirmed by Sreya Hospitals staff.
                </p>
              </div>
            </div>

            <aside className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-primary">Official Website</p>
              <a href={PUBLIC_SITE_HOME} target="_blank" rel="noreferrer" className="mt-2 inline-flex break-all text-base font-black text-brand-navy hover:text-primary">
                {PUBLIC_SITE_HOME}
              </a>
              <div className="mt-5 grid gap-3">
                <Button as={Link} to="/contact" className="w-full justify-center">
                  <Phone className="size-4" />
                  Contact Hospital
                </Button>
                <Button as={Link} to="/" variant="outline" className="w-full justify-center">
                  <Home className="size-4" />
                  Go to Website
                </Button>
                <a href={PUBLIC_SITE_HOME} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-black text-brand-navy hover:border-primary hover:text-primary">
                  <ExternalLink className="size-4" />
                  Open Public Site
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
