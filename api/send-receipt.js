import { randomUUID } from 'node:crypto'
import { sendEmail } from './lib/mailer.js'
import { getIp, rateLimit } from './lib/rateLimit.js'
import { captureException, initSentry } from './lib/sentry.js'

function appointmentHtml(appointment) {
  return `
    <h2>Your appointment request has been received</h2>
    <p><strong>Receipt ID:</strong> ${appointment.receiptId}</p>
    <p><strong>Patient:</strong> ${appointment.patientName}</p>
    <p><strong>Department:</strong> ${appointment.department}</p>
    <p><strong>Date:</strong> ${appointment.preferredDate}</p>
    <p><strong>Time:</strong> ${appointment.preferredTime}</p>
    <p>Status: pending until hospital confirmation.</p>
    <p>Website made by Wayzentech - 9398724704</p>
  `
}

function adminAppointmentHtml(appointment) {
  return `
    <h2>New appointment request</h2>
    <p><strong>Patient:</strong> ${appointment.patientName}</p>
    <p><strong>Phone:</strong> ${appointment.phone}</p>
    <p><strong>Email:</strong> ${appointment.email || 'Not provided'}</p>
    <p><strong>Department:</strong> ${appointment.department}</p>
    <p><strong>Date/Time:</strong> ${appointment.preferredDate} ${appointment.preferredTime}</p>
    <p><strong>Message:</strong> ${appointment.message || 'None'}</p>
    <p><strong>Receipt:</strong> ${appointment.receiptId}</p>
  `
}

function adminContactHtml(contact) {
  return `
    <h2>New contact enquiry</h2>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Phone:</strong> ${contact.phone}</p>
    <p><strong>Email:</strong> ${contact.email || 'Not provided'}</p>
    <p><strong>Type:</strong> ${contact.type}</p>
    <p><strong>Message:</strong> ${contact.message}</p>
  `
}

async function safeSend(payload, requestId) {
  try {
    return await sendEmail(payload)
  } catch (error) {
    captureException(error, { requestId, to: payload.to, subject: payload.subject })
    console.error(JSON.stringify({ requestId, event: 'email_failed', to: payload.to, subject: payload.subject, error: error.message }))
    return { error: error.message }
  }
}

export default async function handler(req, res) {
  initSentry()
  const requestId = randomUUID()
  const startedAt = Date.now()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const limited = rateLimit({ key: `receipt:${getIp(req)}`, limit: 30 })
  if (!limited.ok) return res.status(429).json({ error: 'Too many requests' })

  const payload = req.body || {}
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.RECEIPT_ADMIN_EMAIL
  const sends = []

  if (payload.type === 'contact') {
    if (adminEmail) {
      sends.push(safeSend({
        to: adminEmail,
        subject: 'New Sreya Hospitals contact enquiry',
        html: adminContactHtml(payload),
        text: `New contact enquiry from ${payload.name} (${payload.phone}): ${payload.message}`,
      }, requestId))
    }
  } else {
    if (!payload.receiptId) return res.status(400).json({ error: 'Missing receipt ID' })
    if (payload.email) {
      sends.push(safeSend({
        to: payload.email,
        subject: `Sreya Hospitals Appointment Receipt ${payload.receiptId}`,
        html: appointmentHtml(payload),
        text: `Your appointment request has been received. Receipt ID: ${payload.receiptId}`,
      }, requestId))
    }
    if (adminEmail) {
      sends.push(safeSend({
        to: adminEmail,
        subject: 'New Sreya Hospitals appointment request',
        html: adminAppointmentHtml(payload),
        text: `New appointment request from ${payload.patientName} (${payload.phone}) for ${payload.department}`,
      }, requestId))
    }
  }

  const results = await Promise.all(sends)
  console.log(JSON.stringify({ requestId, event: 'notification_processed', count: results.length, durationMs: Date.now() - startedAt }))
  return res.status(200).json({ ok: true, results })
}
