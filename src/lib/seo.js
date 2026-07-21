import { publicSettings } from '../data/seed'

export function cleanText(value) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .trim()
}

export function routeTitle(title) {
  return title ? `${title} | ${publicSettings.hospitalName}` : publicSettings.seo.title
}

export function canonical(pathname) {
  const base = import.meta.env.VITE_SITE_URL || 'https://www.sreyaivfcentre.com'
  return `${base.replace(/\/$/, '')}${pathname}`
}

export function hospitalJsonLd(settings = publicSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    name: settings.hospitalName,
    description: settings.seo?.description || settings.tagline,
    address: settings.address,
    telephone: settings.phone || undefined,
    url: import.meta.env.VITE_SITE_URL || 'https://www.sreyaivfcentre.com',
    medicalSpecialty: ['Obstetrics', 'Gynecology', 'ReproductiveEndocrinology'],
  }
}

export function physicianJsonLd(doctor) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    medicalSpecialty: doctor.specialty,
    worksFor: publicSettings.hospitalName,
  }
}

export function faqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question || item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.answer || item.a },
    })),
  }
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonical(item.href),
    })),
  }
}

export function generateReceiptId(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const n = String(Math.floor(1000 + Math.random() * 9000))
  return `SRH-${y}${m}${d}-${n}`
}

export function toCsv(rows) {
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  return [keys.join(','), ...rows.map((row) => keys.map((key) => escape(row[key])).join(','))].join('\n')
}

export function downloadTextFile(fileName, content, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
