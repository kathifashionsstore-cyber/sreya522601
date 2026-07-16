import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Image, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer'
import { QRCodeCanvas } from 'qrcode.react'
import { CalendarCheck, Download, Phone, ShieldCheck, Stethoscope, UserRound } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { doctors as fallbackDoctors } from '../../data/seed'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { Button } from '../shared/Button'

// Sreya clinical palette for PDF styling
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    fontFamily: 'Helvetica',
  },
  receiptShell: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    height: 800, // Strictly constrained height to guarantee single-page rendering
  },
  header: {
    backgroundColor: '#0F172A',
    color: '#ffffff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#0D9488',
  },
  brandBlock: { flexDirection: 'row', width: '62%' },
  logoWrap: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 4,
    marginRight: 10,
  },
  logo: { width: 46, height: 46, objectFit: 'contain' },
  brandFallback: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#0D9488',
    color: '#ffffff',
    textAlign: 'center',
    paddingTop: 15,
    fontSize: 12,
    fontWeight: 700,
  },
  hospitalName: { fontSize: 16, fontWeight: 700, marginBottom: 3, color: '#FFFFFF' },
  hospitalMeta: { fontSize: 8, lineHeight: 1.25, color: '#CCFBF1' },
  receiptBadge: {
    width: '34%',
    borderWidth: 1,
    borderColor: '#0D9488',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#134E4A',
  },
  badgeLabel: { color: '#5EEAD4', fontSize: 7.5, fontWeight: 700, marginBottom: 4 },
  receiptId: { color: '#ffffff', fontSize: 14, fontWeight: 700, marginBottom: 6 },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 7.5,
    fontWeight: 700,
  },
  statusPillPending: {
    backgroundColor: '#F8FAFC',
    color: '#0D9488',
  },
  statusPillConfirmed: {
    backgroundColor: '#DCFCE7',
    color: '#16A34A',
  },
  statusPillCancelled: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  content: { padding: 16 },
  topGrid: { flexDirection: 'row', marginBottom: 12 },
  panel: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#F8FAFC',
  },
  patientPanel: { width: '56%', marginRight: 10 },
  doctorPanel: { width: '44%', backgroundColor: '#F1F5F9' },
  panelLabel: { color: '#0D9488', fontSize: 8, fontWeight: 700, marginBottom: 6 },
  patientName: { fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6 },
  fieldRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 5,
    marginTop: 5,
  },
  fieldLabel: { width: '32%', fontSize: 8, color: '#475569', fontWeight: 700 },
  fieldValue: { width: '68%', fontSize: 9, color: '#0F172A', fontWeight: 700 },
  doctorRow: { flexDirection: 'row' },
  doctorPhoto: { width: 56, height: 64, borderRadius: 8, objectFit: 'cover', marginRight: 8 },
  doctorPhotoPlaceholder: {
    width: 56,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorPhotoPlaceholderText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0F172A',
  },
  doctorName: { fontSize: 11, fontWeight: 700, color: '#0F172A', marginBottom: 2 },
  doctorMeta: { fontSize: 8, color: '#475569', lineHeight: 1.25 },
  timeline: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 12,
  },
  timelineItem: { width: '33.33%', paddingRight: 6 },
  timelineLabel: { fontSize: 7.5, color: '#475569', fontWeight: 700, marginBottom: 3 },
  timelineValue: { fontSize: 10, fontWeight: 700, lineHeight: 1.2, color: '#0F172A' },
  verificationRow: { flexDirection: 'row', marginBottom: 12 },
  qrPanel: { width: '28%', alignItems: 'center', marginRight: 10, backgroundColor: '#ffffff' },
  qrImage: { width: 76, height: 76, marginBottom: 5 },
  qrFallback: {
    width: 76,
    height: 76,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    textAlign: 'center',
    paddingTop: 30,
    fontSize: 8,
    color: '#475569',
    marginBottom: 5,
  },
  verifyText: { fontSize: 7, color: '#475569', textAlign: 'center', lineHeight: 1.2 },
  notePanel: { width: '72%', backgroundColor: '#F8FAFC', borderColor: '#0D9488' },
  noteTitle: { fontSize: 10, fontWeight: 700, color: '#0F172A', marginBottom: 4 },
  noteText: { fontSize: 8, color: '#475569', lineHeight: 1.35 },
  messagePanel: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  footerBand: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: '#475569',
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

function absoluteAssetUrl(src) {
  if (!src) return ''
  if (/^(https?:|data:|blob:)/i.test(src)) return src
  if (typeof window === 'undefined') return src
  return new URL(src, window.location.origin).toString()
}

function getContactLine(settings = {}) {
  return [settings.phonePrimary, settings.phoneMobile, settings.phone, settings.email].filter(Boolean).join(' | ')
}

function ReceiptDocument({ appointment, settings, doctor, logoUrl, doctorPhotoUrl, qrDataUrl }) {
  const verifyUrl = `${import.meta.env.VITE_SITE_URL || 'https://www.sreyahospitals.example'}/verify-appointment?receiptId=${appointment.receiptId}`
  const contactLine = getContactLine(settings) || 'Phone pending confirmation'

  let statusPillStyle = styles.statusPillPending
  if (appointment.status === 'confirmed') {
    statusPillStyle = styles.statusPillConfirmed
  } else if (appointment.status === 'cancelled') {
    statusPillStyle = styles.statusPillCancelled
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.receiptShell}>
          <View style={styles.header}>
            <View style={styles.brandBlock}>
              <View style={styles.logoWrap}>
                {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : <Text style={styles.brandFallback}>SH</Text>}
              </View>
              <View>
                <Text style={styles.hospitalName}>{settings.hospitalName || 'Sreya Hospitals & IVF Centre'}</Text>
                <Text style={styles.hospitalMeta}>{settings.tagline || 'Advanced fertility and women health care'}</Text>
                <Text style={styles.hospitalMeta}>{settings.address || 'Narasaraopet, Andhra Pradesh'}</Text>
                <Text style={styles.hospitalMeta}>{contactLine}</Text>
              </View>
            </View>
            <View style={styles.receiptBadge}>
              <Text style={styles.badgeLabel}>APPOINTMENT RECEIPT</Text>
              <Text style={styles.receiptId}>{appointment.receiptId}</Text>
              <Text style={[styles.statusPill, statusPillStyle]}>{cleanStatus(appointment.status)}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.topGrid}>
              <View style={[styles.panel, styles.patientPanel]}>
                <Text style={styles.panelLabel}>PATIENT DETAILS</Text>
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
                  <Text style={styles.fieldLabel}>Department</Text>
                  <Text style={styles.fieldValue}>{appointment.department || 'Pending'}</Text>
                </View>
              </View>

              <View style={[styles.panel, styles.doctorPanel]}>
                <Text style={styles.panelLabel}>SPECIALIST CARE</Text>
                <View style={styles.doctorRow}>
                  {doctorPhotoUrl ? (
                    <Image src={doctorPhotoUrl} style={styles.doctorPhoto} />
                  ) : (
                    <View style={styles.doctorPhotoPlaceholder}>
                      <Text style={styles.doctorPhotoPlaceholderText}>DR</Text>
                    </View>
                  )}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.doctorName}>{doctor?.name || 'Dr. Vasanta Kiran Mekala'}</Text>
                    <Text style={styles.doctorMeta}>{doctor?.specialty || 'Fertility Specialist'}</Text>
                    <Text style={styles.doctorMeta}>{doctor?.qualifications || 'Consultation details shared at hospital'}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <Text style={styles.timelineLabel}>PREFERRED DATE</Text>
                <Text style={styles.timelineValue}>{formatDate(appointment.preferredDate)}</Text>
              </View>
              <View style={styles.timelineItem}>
                <Text style={styles.timelineLabel}>PREFERRED TIME</Text>
                <Text style={styles.timelineValue}>{formatTime(appointment.preferredTime)}</Text>
              </View>
              <View style={styles.timelineItem}>
                <Text style={styles.timelineLabel}>BOOKING SOURCE</Text>
                <Text style={styles.timelineValue}>{cleanStatus(appointment.source || 'online')}</Text>
              </View>
            </View>

            <View style={styles.verificationRow}>
              <View style={[styles.panel, styles.qrPanel]}>
                {qrDataUrl ? <Image src={qrDataUrl} style={styles.qrImage} /> : <Text style={styles.qrFallback}>QR</Text>}
                <Text style={styles.verifyText}>Scan to verify this receipt ID online.</Text>
              </View>

              <View style={[styles.panel, styles.notePanel]}>
                <Text style={styles.noteTitle}>Important appointment note</Text>
                <Text style={styles.noteText}>
                  This receipt confirms that your appointment request was received by Sreya Hospitals. Final appointment
                  confirmation, doctor availability, and medical advice are provided directly by the hospital team.
                </Text>
                <Text style={styles.noteText}>Verify URL: {verifyUrl}</Text>
              </View>
            </View>

            {appointment.message ? (
              <View style={styles.messagePanel}>
                <Text style={styles.panelLabel}>PATIENT MESSAGE</Text>
                <Text style={styles.noteText}>{appointment.message}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.footerBand}>
            <Text>{settings.hospitalName || 'Sreya Hospitals & IVF Centre'}</Text>
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

  const verifyUrl = appointment
    ? `${import.meta.env.VITE_SITE_URL || 'https://www.sreyahospitals.example'}/verify-appointment?receiptId=${appointment.receiptId}`
    : ''
  const logoUrl = absoluteAssetUrl(settings.logoUrl || '/logo.webp')
  const doctorPhotoUrl = absoluteAssetUrl(doctor?.photoUrl || '')
  const contactLine = getContactLine(settings) || 'Phone pending confirmation'

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

  // HTML preview color styles
  const isConfirmed = appointment.status === 'confirmed'
  const isCancelled = appointment.status === 'cancelled'
  const statusColorClass = isConfirmed 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    : isCancelled 
      ? 'bg-rose-50 text-rose-700 border-rose-200' 
      : 'bg-amber-50 text-amber-700 border-amber-200'

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[var(--color-bg-base)] shadow-soft">
      {/* Brand Header */}
      <div className="bg-brand-ink p-5 text-white border-b-4 border-primary">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-white p-1.5">
              <img src={logoUrl} alt={settings.hospitalName || 'Sreya Hospitals'} className="max-h-full max-w-full object-contain" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--color-primary-light)]">Appointment Receipt</p>
              <h2 className="mt-1 text-xl sm:text-2xl font-black text-white">{appointment.receiptId}</h2>
              <p className="mt-2 max-w-xl text-sm font-semibold text-white/90">{settings.hospitalName || 'Sreya Hospitals & IVF Centre'}</p>
              <p className="mt-1 text-xs font-semibold text-white/70">{contactLine}</p>
            </div>
          </div>
          <div className={`rounded-xl border px-4 py-2.5 text-right ${statusColorClass}`}>
            <p className="text-xs font-black uppercase opacity-75">Status</p>
            <p className="mt-0.5 text-base font-black capitalize">{appointment.status || 'pending'}</p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          {/* Patient Details Panel */}
          <div className="grid gap-3.5 rounded-xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-primary border-b border-border pb-2">Patient Details</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <p className="flex gap-2.5 text-sm text-brand-navy">
                <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />
                <span><strong className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Patient Name</strong>{appointment.patientName}</span>
              </p>
              <p className="flex gap-2.5 text-sm text-brand-navy">
                <Phone className="mt-0.5 size-4 shrink-0 text-secondary" />
                <span><strong className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Phone Number</strong>{appointment.phone}</span>
              </p>
              <p className="flex gap-2.5 text-sm text-brand-navy">
                <CalendarCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <span><strong className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Preferred Slot</strong>{formatDate(appointment.preferredDate)} at {formatTime(appointment.preferredTime)}</span>
              </p>
              <p className="flex gap-2.5 text-sm text-brand-navy">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" />
                <span><strong className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Department</strong>{appointment.department}</span>
              </p>
            </div>
          </div>

          {/* Specialist Panel */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-brand-cream p-4 shadow-sm">
            {doctorPhotoUrl ? (
              <img src={doctorPhotoUrl} alt={doctor?.name || 'Sreya specialist'} className="size-16 rounded-xl object-cover border border-border shadow-inner" />
            ) : (
              <span className="grid size-16 rounded-xl bg-white text-secondary border border-border"><Stethoscope className="m-auto size-7" /></span>
            )}
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-primary">Specialist Care</p>
              <h3 className="text-base font-black text-brand-navy">{doctor?.name || 'Dr. Vasanta Kiran Mekala'}</h3>
              <p className="text-xs font-semibold leading-5 text-slate-600 truncate">{doctor?.specialty || 'Fertility Specialist'}</p>
              <p className="text-[10px] text-slate-500 truncate">{doctor?.qualifications || 'Consultation details shared at hospital'}</p>
            </div>
          </div>
        </div>

        {/* Verification and QR */}
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-white p-5 shadow-sm text-center">
          <div className="rounded-xl border border-border bg-[var(--color-bg-base)] p-3 shadow-inner">
            <QRCodeCanvas ref={qrCanvasRef} value={verifyUrl} size={112} />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Scan to Verify</span>
            <a href={verifyUrl} className="mt-1 block max-w-[240px] break-all text-xs font-bold text-primary hover:underline" target="_blank" rel="noreferrer">
              {verifyUrl}
            </a>
          </div>
        </div>
      </div>

      {/* Patient Message (If exists) */}
      {appointment.message ? (
        <div className="mx-5 mb-5 rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-primary border-b border-border pb-2 mb-2.5">Patient Message</p>
          <p className="text-sm text-brand-navy leading-relaxed italic">"{appointment.message}"</p>
        </div>
      ) : null}

      {/* Download Action */}
      <div className="flex justify-between items-center border-t border-border px-5 py-4 bg-brand-cream/70">
        <PDFDownloadLink
          document={
            <ReceiptDocument
              appointment={appointment}
              settings={settings}
              doctor={doctor}
              logoUrl={logoUrl}
              doctorPhotoUrl={doctorPhotoUrl}
              qrDataUrl={qrDataUrl}
            />
          }
          fileName={`${appointment.receiptId}.pdf`}
        >
          {({ loading }) => (
            <Button type="button" className="!bg-primary hover:!bg-primary-dark text-white">
              <Download className="size-4" /> {loading ? 'Preparing PDF' : 'Download PDF'}
            </Button>
          )}
        </PDFDownloadLink>
        <span className="text-[10px] font-bold text-slate-400">Website made by Wayzentech</span>
      </div>
    </div>
  )
}
