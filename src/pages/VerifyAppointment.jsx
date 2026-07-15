import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/shared/Button'

export default function VerifyAppointment() {
  const [params] = useSearchParams()
  const receiptId = params.get('receiptId')
  return (
    <>
      <Seo title="Verify Appointment" description="Verify a Sreya Hospitals appointment receipt ID." />
      <section className="grid min-h-[70vh] place-items-center bg-brand-cream px-4 py-16">
        <div className="max-w-lg rounded-lg bg-white p-7 text-center shadow-soft">
          <CheckCircle2 className="mx-auto size-14 text-brand-green" />
          <h1 className="mt-4 text-3xl font-black text-brand-navy">Appointment Verification</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Receipt ID: <strong>{receiptId || 'Missing receipt ID'}</strong>
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Final confirmation must be checked with the hospital team. This page proves the receipt format, not clinical appointment approval.
          </p>
          <Button as={Link} to="/contact" className="mt-6">Contact Hospital</Button>
        </div>
      </section>
    </>
  )
}
