import { useMemo, useState, useEffect, useRef } from 'react'
import { Download, Plus, Save, Search, Trash2, MessageSquare, FileText, Star } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { Field, Input, Select, Textarea } from '../components/shared/Input'
import { ReceiptPreview } from '../components/appointment/ReceiptPreview'
import { DepartmentSelect } from '../components/appointment/DepartmentSelect'
import { useToast } from '../components/shared/Toast'
import { useDebounce } from '../hooks/useDebounce'
import { removeDocument, saveDocument, updateDocument, useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { downloadTextFile, generateReceiptId, toCsv } from '../lib/seo'
import { useSiteSettings } from '../context/SiteSettingsContext'

const statuses = ['pending', 'confirmed', 'completed', 'cancelled']

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const now = ctx.currentTime
    
    // Tone 1: D5
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, now)
    gain1.gain.setValueAtTime(0.08, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.45)

    // Tone 2: A5
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880.00, now + 0.12)
    gain2.gain.setValueAtTime(0.08, now + 0.12)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.57)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.12)
    osc2.stop(now + 0.57)
  } catch (e) {
    console.error('Audio chime synthesis failed:', e)
  }
}

export default function AdminAppointments() {
  const appointments = useFirestoreCollection('appointments', [], 'preferredDate').data
  const { settings } = useSiteSettings()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [deleteId, setDeleteId] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({
    patientName: '',
    phone: '',
    email: '',
    department: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    status: 'confirmed',
  })
  
  const debounced = useDebounce(search, 250).toLowerCase()
  const { push } = useToast()

  // Track appointments length for real-time notification
  const apptsRef = useRef(appointments)
  const isFirstLoad = useRef(true)

  useEffect(() => {
    if (appointments.length > 0 && isFirstLoad.current) {
      isFirstLoad.current = false
      apptsRef.current = appointments
      return
    }

    if (appointments.length > apptsRef.current.length) {
      // Play professional synthesized chime sound
      playChime()
      push('New appointment booking received in real-time!', 'success')
    }
    apptsRef.current = appointments
  }, [appointments, push])

  const filtered = useMemo(
    () =>
      appointments.filter((item) => {
        const matchesStatus = status === 'all' || item.status === status
        const haystack = `${item.patientName} ${item.phone} ${item.department} ${item.receiptId}`.toLowerCase()
        return matchesStatus && haystack.includes(debounced)
      }),
    [appointments, status, debounced],
  )

  async function createManual(event) {
    event.preventDefault()
    try {
      await saveDocument('appointments', {
        ...form,
        source: 'manual',
        receiptId: generateReceiptId(),
      })
      push('Manual appointment created.', 'success')
      setForm({ patientName: '', phone: '', email: '', department: '', preferredDate: '', preferredTime: '', message: '', status: 'confirmed' })
    } catch (error) {
      push(error.message, 'error')
    }
  }

  async function setAppointmentStatus(id, nextStatus) {
    try {
      await updateDocument('appointments', id, { status: nextStatus })
      push(`Status updated to ${nextStatus}.`, 'success')
    } catch (error) {
      push(error.message, 'error')
    }
  }

  async function confirmDelete() {
    try {
      await removeDocument('appointments', deleteId)
      push('Appointment deleted.', 'success')
      setDeleteId(null)
    } catch (error) {
      push(error.message, 'error')
    }
  }

  // Pre-filled wa.me links helpers
  const formatPhone = (phone) => {
    const digits = phone.replace(/[^0-9]/g, '')
    return digits.startsWith('91') ? digits : `91${digits}`
  }

  const getConfirmationWaLink = (item) => {
    const text = `Hello ${item.patientName}, your appointment for ${item.department} at Sreya Hospitals & IVF Centre has been confirmed for ${item.preferredDate} at ${item.preferredTime}. Your Receipt ID is: ${item.receiptId || 'N/A'}. Thank you!`
    // TODO: swap to WhatsApp Business API once provider is confirmed
    return `https://wa.me/${formatPhone(item.phone)}?text=${encodeURIComponent(text)}`
  }

  const getReceiptWaLink = (item) => {
    const receiptUrl = `${window.location.origin}/verify-appointment?receiptId=${item.receiptId}`
    const text = `Hello ${item.patientName}, here is your appointment receipt from Sreya Hospitals & IVF Centre: ${receiptUrl}`
    return `https://wa.me/${formatPhone(item.phone)}?text=${encodeURIComponent(text)}`
  }

  const getReviewWaLink = (item) => {
    const reviewUrl = settings.googleReviewUrl || 'https://www.google.com/search?q=Sreya+Hospitals+IVF+Centre+Narasaraopet'
    const text = `Hello ${item.patientName}, thank you for choosing Sreya Hospitals. We hope you had a comfortable visit. Please share your feedback on Google to support other families: ${reviewUrl}`
    return `https://wa.me/${formatPhone(item.phone)}?text=${encodeURIComponent(text)}`
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Appointments</h1>
          <p className="mt-2 text-sm text-slate-605">Search, filter, confirm, complete, cancel, generate receipt, and export.</p>
        </div>
        <Button type="button" variant="secondary" onClick={() => downloadTextFile('appointments.csv', toCsv(filtered), 'text/csv')}>
          <Download className="size-4" /> Export CSV
        </Button>
      </div>

      <form onSubmit={createManual} className="grid gap-4 rounded-lg bg-white p-5 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-black text-brand-navy"><Plus className="size-5" /> Manual Booking</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Patient"><Input value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></Field>
          <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Department"><DepartmentSelect value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required /></Field>
          <Field label="Date"><Input type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} required /></Field>
          <Field label="Time"><Input type="time" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} required /></Field>
          <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</Select></Field>
          <Field label="Note"><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Field>
        </div>
        <Button type="submit"><Save className="size-4" /> Create Manual Appointment</Button>
      </form>

      <div className="flex flex-wrap gap-3 rounded-lg bg-white p-4 shadow-soft">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search appointments" className="pl-9" />
        </label>
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="w-48">
          <option value="all">All statuses</option>
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
      </div>

      <div className="grid gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-lg bg-white p-4 shadow-soft border border-slate-100">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-brand-navy">{item.patientName}</h2>
                  <span className="rounded-full bg-brand-blush px-3 py-1 text-xs font-black text-brand-rose">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.department} · {item.preferredDate} {item.preferredTime} · {item.phone}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{item.receiptId}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Status Switchers */}
                {statuses.map((next) => (
                  <button
                    key={next}
                    type="button"
                    onClick={() => setAppointmentStatus(item.id, next)}
                    className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-text-secondary hover:bg-slate-100 transition"
                  >
                    {next}
                  </button>
                ))}

                {/* WhatsApp Assist confirmations (Tier 1) */}
                <a
                  href={getConfirmationWaLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-black text-white hover:bg-[#20ba59] transition"
                  title="Send confirmation text via wa.me link"
                >
                  <MessageSquare className="size-3.5" /> Confirm WA
                </a>

                {/* WhatsApp Receipt Share */}
                <a
                  href={getReceiptWaLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#25D366] text-[#25D366] bg-transparent px-3 py-1.5 text-xs font-black hover:bg-[#25D366]/10 transition"
                  title="Share hosted receipt link via WhatsApp"
                >
                  <FileText className="size-3.5" /> Receipt WA
                </a>

                {/* WhatsApp Review loop (Completed only) */}
                {item.status === 'completed' && (
                  <a
                    href={getReviewWaLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-amber-500 text-white px-3 py-1.5 text-xs font-black hover:bg-amber-600 transition shadow-sm animate-pulse"
                    title="Send review invite link via WhatsApp"
                  >
                    <Star className="size-3.5" /> Review WA
                  </a>
                )}

                <Button type="button" variant="secondary" onClick={() => setSelected(item)}>Receipt</Button>
                <Button type="button" variant="danger" onClick={() => setDeleteId(item.id)}><Trash2 className="size-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <ReceiptPreview appointment={selected} />
      <ConfirmDialog open={Boolean(deleteId)} title="Delete appointment" message="Delete this appointment record?" onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </section>
  )
}
