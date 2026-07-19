import { useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Save } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { Field, Input, Select, Textarea } from '../components/shared/Input'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { saveDocument } from '../hooks/useFirestoreCollection'
import { useToast } from '../components/shared/Toast'

export default function AdminPaymentsQR() {
  const { payments } = useSiteSettings()
  const [form, setForm] = useState(payments)
  const { push } = useToast()

  useEffect(() => {
    if (payments) {
      setForm(payments)
    }
  }, [payments])
  const upiPayload = form.upiId ? `upi://pay?pa=${form.upiId}&pn=${encodeURIComponent(form.displayName || 'Sreya Hospitals')}` : ''

  async function save() {
    try {
      await saveDocument('settings', form, 'payments')
      push('Payment settings saved.', 'success')
    } catch (error) {
      push(error.message, 'error')
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-black text-brand-navy">Payments & QR</h1>
        <p className="mt-2 text-sm text-slate-600">Controls UPI display on Contact and Appointment pages.</p>
        <div className="mt-6 grid gap-4">
          <Field label="UPI ID"><Input value={form.upiId || ''} onChange={(e) => setForm({ ...form, upiId: e.target.value })} /></Field>
          <Field label="Display Name"><Input value={form.displayName || ''} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></Field>
          <Field label="Note"><Textarea value={form.note || ''} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Show on Contact"><Select value={form.showOnContact ? 'yes' : 'no'} onChange={(e) => setForm({ ...form, showOnContact: e.target.value === 'yes' })}><option value="yes">Yes</option><option value="no">No</option></Select></Field>
            <Field label="Show on Appointment"><Select value={form.showOnAppointment ? 'yes' : 'no'} onChange={(e) => setForm({ ...form, showOnAppointment: e.target.value === 'yes' })}><option value="yes">Yes</option><option value="no">No</option></Select></Field>
          </div>
          <Button type="button" onClick={save}><Save className="size-4" /> Save Payments</Button>
        </div>
      </div>
      <aside className="h-fit rounded-lg bg-white p-6 text-center shadow-soft">
        <h2 className="font-black text-brand-navy">QR Preview</h2>
        {upiPayload ? <QRCodeCanvas value={upiPayload} size={220} className="mx-auto mt-5" /> : <p className="mt-5 text-sm text-slate-600">Enter UPI ID to preview QR.</p>}
      </aside>
    </section>
  )
}
