import nodemailer from 'nodemailer'

function logMail(event) {
  console.log(JSON.stringify({ source: 'mailer', ...event }))
}

export async function sendEmail({ to, subject, html, text }) {
  if (!to) return { skipped: 'missing recipient' }

  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RECEIPT_FROM_EMAIL || 'Sreya Hospitals <appointments@sreyahospitals.in>',
        to,
        subject,
        html,
        text,
      }),
    })
    if (!response.ok) throw new Error(`Email send failed: ${response.status}`)
    const data = await response.json()
    logMail({ outcome: 'sent', provider: 'resend', to, subject })
    return data
  }

  if (!process.env.SMTP_HOST) {
    logMail({ outcome: 'skipped', reason: 'mail provider not configured', to, subject })
    return { skipped: 'mail provider not configured' }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  })

  const result = await transporter.sendMail({
    from: process.env.RECEIPT_FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  })
  logMail({ outcome: 'sent', provider: 'smtp', to, subject })
  return result
}
