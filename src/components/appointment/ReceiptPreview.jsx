import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Image, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer'
import { QRCodeCanvas } from 'qrcode.react'
import {
  CalendarCheck,
  ClipboardCheck,
  Clock3,
  Download,
  Globe2,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { doctors as fallbackDoctors } from '../../data/seed'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { displayDoctorQualifications } from '../../lib/doctorProfile'
import { Button } from '../shared/Button'

const PUBLIC_SITE_URL = 'https://www.sreyaivfcentre.com'
const PUBLIC_SITE_HOME = `${PUBLIC_SITE_URL}/`

const styles = StyleSheet.create({
  page: {
    padding: 18,
    fontSize: 8.5,
    color: '#102A43',
    backgroundColor: '#EEF7F4',
    fontFamily: 'Helvetica',
  },
  receiptShell: {
    borderWidth: 1,
    borderColor: '#BFD8D2',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    height: 806,
  },
  header: {
    backgroundColor: '#101827',
    color: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 4,
    borderBottomColor: '#D9A64A',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandBlock: {
    flexDirection: 'row',
    width: '64%',
  },
  logoWrap: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 4,
    marginRight: 10,
  },
  logo: { width: 46, height: 46, objectFit: 'contain' },
  brandFallback: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#3F8F86',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingTop: 15,
    fontSize: 12,
    fontWeight: 700,
  },
  eyebrow: {
    color: '#F8D36B',
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 1.4,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  hospitalName: { fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#FFFFFF' },
  hospitalMeta: { fontSize: 7.4, lineHeight: 1.35, color: '#D6F2EE' },
  receiptBadge: {
    width: '31%',
    borderWidth: 1,
    borderColor: '#D9A64A',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#182034',
  },
  badgeLabel: {
    color: '#F8D36B',
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  receiptId: { color: '#FFFFFF', fontSize: 14, fontWeight: 700, marginBottom: 8 },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 7.5,
    fontWeight: 700,
  },
  statusPillPending: {
    backgroundColor: '#FFF7ED',
    color: '#B45309',
  },
  statusPillConfirmed: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
  },
  statusPillCancelled: {
    backgroundColor: '#FEE2E2',
    color: '#BE123C',
  },
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#D8E6E2',
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  summaryItem: {
    width: '25%',
    paddingRight: 7,
    borderRightWidth: 1,
    borderRightColor: '#D8E6E2',
  },
  summaryItemLast: {
    width: '25%',
    paddingLeft: 7,
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 6.8,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  summaryValue: {
    color: '#102A43',
    fontSize: 8.4,
    fontWeight: 700,
    lineHeight: 1.25,
  },
  content: { padding: 13 },
  mainRow: { flexDirection: 'row', marginBottom: 10 },
  leftColumn: { width: '58%', marginRight: 10 },
  rightColumn: { width: '42%' },
  panel: {
    borderWidth: 1,
    borderColor: '#D8E6E2',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  panelTint: {
    backgroundColor: '#F3FAF8',
  },
  sectionTitle: {
    color: '#3F8F86',
    fontSize: 7.7,
    fontWeight: 700,
    letterSpacing: 1.2,
    marginBottom: 7,
    textTransform: 'uppercase',
  },
  patientName: { fontSize: 14, fontWeight: 700, color: '#101827', marginBottom: 6 },
  fieldRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 5,
    marginTop: 5,
  },
  fieldLabel: { width: '34%', fontSize: 7.6, color: '#64748B', fontWeight: 700 },
  fieldValue: { width: '66%', fontSize: 8.7, color: '#101827', fontWeight: 700, lineHeight: 1.25 },
  doctorRow: { flexDirection: 'row' },
  doctorPhoto: { width: 58, height: 68, borderRadius: 8, objectFit: 'cover', marginRight: 8 },
  doctorPhotoPlaceholder: {
    width: 58,
    height: 68,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorPhotoPlaceholderText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#101827',
  },
  doctorName: { fontSize: 11.5, fontWeight: 700, color: '#101827', marginBottom: 2 },
  doctorMeta: { fontSize: 7.7, color: '#526174', lineHeight: 1.3 },
  verificationRow: { flexDirection: 'row', marginBottom: 10 },
  qrPanel: {
    width: '31%',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#BFD8D2',
  },
  qrFrame: {
    borderWidth: 1,
    borderColor: '#D8E6E2',
    borderRadius: 10,
    padding: 5,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
  },
  qrImage: { width: 86, height: 86 },
  qrFallback: {
    width: 86,
    height: 86,
    borderWidth: 1,
    borderColor: '#D8E6E2',
    borderRadius: 8,
    textAlign: 'center',
    paddingTop: 35,
    fontSize: 8,
    color: '#64748B',
  },
  verifyText: { fontSize: 6.7, color: '#526174', textAlign: 'center', lineHeight: 1.25 },
  notePanel: { width: '69%', backgroundColor: '#F8FAFC', borderColor: '#BFD8D2' },
  noteTitle: { fontSize: 10.5, fontWeight: 700, color: '#101827', marginBottom: 5 },
  noteText: { fontSize: 7.7, color: '#526174', lineHeight: 1.35, marginBottom: 3 },
  stepRow: {
    flexDirection: 'row',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#D8E6E2',
  },
  stepItem: { width: '33.33%', paddingRight: 5 },
  stepNumber: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3F8F86',
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: 700,
    textAlign: 'center',
    paddingTop: 3,
    marginBottom: 3,
  },
  stepLabel: { fontSize: 7.3, color: '#101827', fontWeight: 700, lineHeight: 1.25 },
  messagePanel: {
    borderWidth: 1,
    borderColor: '#D8E6E2',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#FFFBEB',
  },
  footerBand: {
    position: 'absolute',
    bottom: 14,
    left: 18,
    right: 18,
    borderTopWidth: 1,
    borderTopColor: '#D8E6E2',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.2,
    color: '#526174',
  },
})

function cleanStatus(status = '') {
  return String(status || 'pending').replace(/^\w/, (letter) => letter.toUpperCase())
}

function formatDate(value) {
  if (!value) return 'Pending'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function formatTime(value) {
  if (!value) return 'Pending'
  const [hour, minute] = String(value).split(':')
  if (!hour || !minute) return value
  const date = new Date()
  date.setHours(Number(hour), Number(minute), 0, 0)
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(date)
}

function formatGeneratedAt(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function buildVerifyUrl(receiptId) {
  return `${PUBLIC_SITE_URL}/verify-appointment?receiptId=${encodeURIComponent(receiptId || '')}`
}

function absoluteAssetUrl(src) {
  if (!src) return ''
  if (/^(https?:|data:|blob:)/i.test(src)) return src
  if (typeof window === 'undefined') return src
  return new URL(src, window.location.origin).toString()
}

function getContactLine(settings = {}) {
  return [settings.phonePrimary, settings.phoneMobile, settings.phone, settings.email].filter(Boolean).join(' | ')
}

function getStatusStyle(status) {
  if (status === 'confirmed') return styles.statusPillConfirmed
  if (status === 'cancelled') return styles.statusPillCancelled
  return styles.statusPillPending
}

function ReceiptDocument({ appointment, settings, doctor, logoUrl, doctorPhotoUrl, qrDataUrl, verifyUrl, generatedAt }) {
  const contactLine = getContactLine(settings) || '08647-222888 | 9390328255 | contact@sreyaivfcentre.com'
  const doctorQualifications = displayDoctorQualifications(doctor?.qualifications, 'Consultation details shared at hospital')
  const preferredSlot = `${formatDate(appointment.preferredDate)} at ${formatTime(appointment.preferredTime)}`
  const hospitalName = settings.hospitalName || 'Sreya Hospitals & IVF Centre'
  const statusPillStyle = getStatusStyle(appointment.status)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.receiptShell}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.brandBlock}>
                <View style={styles.logoWrap}>
                  {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : <Text style={styles.brandFallback}>SH</Text>}
                </View>
                <View>
                  <Text style={styles.eyebrow}>Advanced IVF Appointment Receipt</Text>
                  <Text style={styles.hospitalName}>{hospitalName}</Text>
                  <Text style={styles.hospitalMeta}>{settings.tagline || 'Advanced fertility and women health care'}</Text>
                  <Text style={styles.hospitalMeta}>{settings.address || 'Guntur Road, Narsaraopet, Palnadu District, Andhra Pradesh, India - 522601'}</Text>
                  <Text style={styles.hospitalMeta}>{contactLine}</Text>
                  <Text style={styles.hospitalMeta}>{PUBLIC_SITE_HOME}</Text>
                </View>
              </View>

              <View style={styles.receiptBadge}>
                <Text style={styles.badgeLabel}>Patient Copy</Text>
                <Text style={styles.receiptId}>{appointment.receiptId}</Text>
                <Text style={[styles.statusPill, statusPillStyle]}>{cleanStatus(appointment.status)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryStrip}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Issued On</Text>
              <Text style={styles.summaryValue}>{generatedAt}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Preferred Slot</Text>
              <Text style={styles.summaryValue}>{preferredSlot}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Department</Text>
              <Text style={styles.summaryValue}>{appointment.department || 'Pending'}</Text>
            </View>
            <View style={styles.summaryItemLast}>
              <Text style={styles.summaryLabel}>Official Website</Text>
              <Text style={styles.summaryValue}>{PUBLIC_SITE_HOME}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.mainRow}>
              <View style={styles.leftColumn}>
                <View style={[styles.panel, styles.panelTint]}>
                  <Text style={styles.sectionTitle}>Patient and Visit Details</Text>
                  <Text style={styles.patientName}>{appointment.patientName || 'Patient name pending'}</Text>
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Phone</Text>
                    <Text style={styles.fieldValue}>{appointment.phone || 'Pending'}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <Text style={styles.fieldValue}>{appointment.email || 'Not provided'}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Source</Text>
                    <Text style={styles.fieldValue}>{cleanStatus(appointment.source || 'online')}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Consent</Text>
                    <Text style={styles.fieldValue}>{appointment.consentToContact ? 'Patient agreed to contact' : 'Pending confirmation'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.rightColumn}>
                <View style={styles.panel}>
                  <Text style={styles.sectionTitle}>Specialist Care</Text>
                  <View style={styles.doctorRow}>
                    {doctorPhotoUrl ? (
                      <Image src={doctorPhotoUrl} style={styles.doctorPhoto} />
                    ) : (
                      <View style={styles.doctorPhotoPlaceholder}>
                        <Text style={styles.doctorPhotoPlaceholderText}>DR</Text>
                      </View>
                    )}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.doctorName}>{doctor?.name || 'Dr. M. Vasanta Kiran'}</Text>
                      <Text style={styles.doctorMeta}>{doctor?.specialty || 'Fertility Specialist, Gynecologist, and Obstetrician'}</Text>
                      <Text style={styles.doctorMeta}>{doctorQualifications}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.verificationRow}>
              <View style={[styles.panel, styles.qrPanel]}>
                <View style={styles.qrFrame}>
                  {qrDataUrl ? <Image src={qrDataUrl} style={styles.qrImage} /> : <Text style={styles.qrFallback}>QR</Text>}
                </View>
                <Text style={styles.verifyText}>Scan to verify on the official Sreya website.</Text>
              </View>

              <View style={[styles.panel, styles.notePanel]}>
                <Text style={styles.noteTitle}>Verification and Next Steps</Text>
                <Text style={styles.noteText}>
                  QR link: {verifyUrl}
                </Text>
                <Text style={styles.noteText}>
                  This receipt confirms that Sreya Hospitals received the appointment request. Final appointment time,
                  doctor availability, and medical advice are confirmed directly by the hospital team.
                </Text>
                <View style={styles.stepRow}>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepNumber}>1</Text>
                    <Text style={styles.stepLabel}>Request received</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepNumber}>2</Text>
                    <Text style={styles.stepLabel}>Hospital call confirmation</Text>
                  </View>
                  <View style={styles.stepItem}>
                    <Text style={styles.stepNumber}>3</Text>
                    <Text style={styles.stepLabel}>Visit with specialist</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.messagePanel}>
              <Text style={styles.sectionTitle}>Patient Message</Text>
              <Text style={styles.noteText}>{appointment.message || 'No additional symptoms or message were added.'}</Text>
            </View>
          </View>

          <View style={styles.footerBand}>
            <Text>{hospitalName} | {PUBLIC_SITE_HOME}</Text>
            <Text>Website made by Wayzentech - 9398724704</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export function ReceiptPreview({ appointment }) {
  const { settings } = useSiteSettings()
  const { data: dbDoctors } = useFirestoreCollection('doctors', fallbackDoctors, null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const qrCanvasRef = useRef(null)

  const doctor = useMemo(() => {
    const doctors = dbDoctors && dbDoctors.length ? dbDoctors : fallbackDoctors
    return doctors[0]
  }, [dbDoctors])

  const verifyUrl = appointment ? buildVerifyUrl(appointment.receiptId) : ''
  const logoUrl = absoluteAssetUrl(settings.logoUrl || '/logoo.webp')
  const doctorPhotoUrl = absoluteAssetUrl(doctor?.photoUrl || '')
  const doctorQualifications = displayDoctorQualifications(doctor?.qualifications, 'Consultation details shared at hospital')
  const contactLine = getContactLine(settings) || '08647-222888 | 9390328255 | contact@sreyaivfcentre.com'
  const generatedAt = useMemo(() => formatGeneratedAt(), [appointment?.receiptId])
  const preferredSlot = appointment ? `${formatDate(appointment.preferredDate)} at ${formatTime(appointment.preferredTime)}` : 'Pending'

  useEffect(() => {
    if (!appointment) {
      setQrDataUrl('')
      return undefined
    }
    const handle = window.setTimeout(() => {
      try {
        setQrDataUrl(qrCanvasRef.current?.toDataURL('image/png') || '')
      } catch {
        setQrDataUrl('')
      }
    }, 0)
    return () => window.clearTimeout(handle)
  }, [appointment, verifyUrl])

  if (!appointment) return null

  const isConfirmed = appointment.status === 'confirmed'
  const isCancelled = appointment.status === 'cancelled'
  const statusColorClass = isConfirmed
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : isCancelled
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : 'border-amber-200 bg-amber-50 text-amber-700'

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="bg-[#101827] px-5 py-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-white p-1.5 ring-1 ring-white/40">
              <img src={logoUrl} alt={settings.hospitalName || 'Sreya Hospitals'} className="max-h-full max-w-full object-contain" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-[#F8D36B]">Advanced IVF Appointment Receipt</p>
              <h2 className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl">{appointment.receiptId}</h2>
              <p className="mt-2 max-w-2xl text-sm font-bold text-white">{settings.hospitalName || 'Sreya Hospitals & IVF Centre'}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-teal-50/80">{contactLine}</p>
              <a href={PUBLIC_SITE_HOME} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-xs font-black text-[#F8D36B] underline decoration-[#F8D36B]/40 underline-offset-4">
                <Globe2 className="size-3.5" />
                {PUBLIC_SITE_HOME}
              </a>
            </div>
          </div>

          <div className="grid gap-2 text-right">
            <div className={`rounded-lg border px-4 py-2.5 ${statusColorClass}`}>
              <p className="text-xs font-black uppercase opacity-75">Status</p>
              <p className="mt-0.5 text-base font-black capitalize">{appointment.status || 'pending'}</p>
            </div>
            <p className="text-xs font-bold text-white/65">Patient Copy</p>
          </div>
        </div>
      </div>

      <div className="grid border-b border-slate-200 bg-slate-50 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Issued on', value: generatedAt, icon: Clock3 },
          { label: 'Preferred slot', value: preferredSlot, icon: CalendarCheck },
          { label: 'Department', value: appointment.department || 'Pending', icon: ShieldCheck },
          { label: 'Official website', value: PUBLIC_SITE_HOME, icon: Globe2 },
        ].map((item) => (
          <div key={item.label} className="flex gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-slate-200">
              <item.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{item.label}</p>
              <p className="mt-1 break-words text-sm font-black leading-snug text-brand-navy">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <p className="text-xs font-black uppercase tracking-widest text-primary">Patient and Visit Details</p>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">Receipt verified by QR</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <p className="flex gap-2.5 text-sm text-brand-navy">
                <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />
                <span><strong className="block text-xs font-bold uppercase tracking-wider text-slate-500">Patient Name</strong>{appointment.patientName || 'Patient name pending'}</span>
              </p>
              <p className="flex gap-2.5 text-sm text-brand-navy">
                <Phone className="mt-0.5 size-4 shrink-0 text-secondary" />
                <span><strong className="block text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</strong>{appointment.phone || 'Pending'}</span>
              </p>
              <p className="flex gap-2.5 text-sm text-brand-navy">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <span><strong className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email</strong>{appointment.email || 'Not provided'}</span>
              </p>
              <p className="flex gap-2.5 text-sm text-brand-navy">
                <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-secondary" />
                <span><strong className="block text-xs font-bold uppercase tracking-wider text-slate-500">Booking Source</strong>{cleanStatus(appointment.source || 'online')}</span>
              </p>
            </div>
          </section>

          <section className="grid gap-4 rounded-lg border border-slate-200 bg-[#F3FAF8] p-4 shadow-sm md:grid-cols-[auto_1fr]">
            {doctorPhotoUrl ? (
              <img src={doctorPhotoUrl} alt={doctor?.name || 'Sreya specialist'} className="size-24 rounded-lg border border-white object-cover shadow-sm" />
            ) : (
              <span className="grid size-24 rounded-lg border border-slate-200 bg-white text-secondary">
                <Stethoscope className="m-auto size-8" />
              </span>
            )}
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-primary">Specialist Care</p>
              <h3 className="mt-1 text-xl font-black text-brand-navy">{doctor?.name || 'Dr. M. Vasanta Kiran'}</h3>
              <p className="mt-1 text-sm font-bold leading-6 text-slate-700">{doctor?.specialty || 'Fertility Specialist, Gynecologist, and Obstetrician'}</p>
              <p className="text-xs font-semibold leading-5 text-slate-500">{doctorQualifications}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  'Request received',
                  'Hospital call confirmation',
                  'Visit with specialist',
                ].map((step, index) => (
                  <div key={step} className="rounded-lg border border-teal-100 bg-white px-3 py-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-primary">Step {index + 1}</p>
                    <p className="mt-1 text-xs font-bold text-brand-navy">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <HeartPulse className="mt-0.5 size-5 shrink-0 text-amber-700" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-amber-800">Important Appointment Note</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-amber-900">
                  This receipt confirms that Sreya Hospitals received the appointment request. Final appointment time,
                  doctor availability, and medical advice are confirmed directly by the hospital team.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 border-b border-slate-200 pb-2 text-xs font-black uppercase tracking-widest text-primary">Patient Message</p>
            <p className="text-sm leading-6 text-brand-navy">"{appointment.message || 'No additional symptoms or message were added.'}"</p>
          </section>
        </div>

        <aside className="rounded-lg border border-teal-100 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto max-w-[220px] rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <QRCodeCanvas
              ref={qrCanvasRef}
              value={verifyUrl}
              size={168}
              level="H"
              includeMargin
              bgColor="#FFFFFF"
              fgColor="#101827"
            />
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
              <ShieldCheck className="size-3.5" />
              Scan to Verify
            </span>
            <a href={verifyUrl} className="mt-3 block break-all text-xs font-black leading-5 text-primary hover:underline" target="_blank" rel="noreferrer">
              {verifyUrl}
            </a>
            <a href={PUBLIC_SITE_HOME} className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-brand-navy hover:border-primary hover:text-primary" target="_blank" rel="noreferrer">
              <Globe2 className="size-4" />
              {PUBLIC_SITE_HOME}
            </a>
          </div>

          <div className="mt-5 grid gap-3 text-left">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verification</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-700">Receipt ID and QR must match the official Sreya website page.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hospital Address</p>
              <p className="mt-1 flex gap-2 text-xs font-semibold leading-5 text-slate-700">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>{settings.address || 'Guntur Road, Narsaraopet, Palnadu District, Andhra Pradesh, India - 522601'}</span>
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
        <PDFDownloadLink
          document={
            <ReceiptDocument
              appointment={appointment}
              settings={settings}
              doctor={doctor}
              logoUrl={logoUrl}
              doctorPhotoUrl={doctorPhotoUrl}
              qrDataUrl={qrDataUrl}
              verifyUrl={verifyUrl}
              generatedAt={generatedAt}
            />
          }
          fileName={`${appointment.receiptId}.pdf`}
        >
          {({ loading }) => (
            <Button type="button" className="!bg-primary text-white hover:!bg-primary-dark">
              <Download className="size-4" /> {loading ? 'Preparing PDF' : 'Download PDF'}
            </Button>
          )}
        </PDFDownloadLink>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <Sparkles className="size-3.5" />
          Website made by Wayzentech
        </span>
      </div>
    </div>
  )
}
