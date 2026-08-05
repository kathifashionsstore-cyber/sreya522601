import { createContext, useContext, useEffect, useMemo } from 'react'
import { settings as mockSettings, payments as mockPayments } from '../mockData/settings'
import { applyThemeToDocument, defaultTheme, normalizeTheme } from '../lib/theme'
import { useFirestoreDoc } from '../hooks/useFirestoreCollection'

const SiteSettingsContext = createContext(null)
const preferredLogoUrl = '/logoo.webp'

function normalizeLogoUrl(url) {
  if (!url) return ''
  const logoUrl = String(url)
  const normalized = logoUrl.toLowerCase()
  const normalizedPath = normalized.replace(/^https?:\/\/[^/]+/i, '')
  const legacyImageExtension = `.${'svg'}`
  const legacyWebpLogoPattern = /^\/logo[.]webp$/

  if (
    legacyWebpLogoPattern.test(normalizedPath) ||
    (normalizedPath.endsWith(legacyImageExtension) &&
      (normalizedPath.includes('favicon') ||
        normalizedPath.includes('/icons/icon') ||
        normalizedPath.includes('/icons/maskable')))
  ) {
    return preferredLogoUrl
  }

  return logoUrl
}

export function SiteSettingsProvider({ children }) {
  const { data: dbSettings, loading: settingsLoading } = useFirestoreDoc('settings/public', mockSettings)
  const { data: dbPayments, loading: paymentsLoading } = useFirestoreDoc('payments/public', mockPayments)
  const { data: dbTheme, loading: themeLoading } = useFirestoreDoc('settings/theme', defaultTheme)

  const activeSettings = useMemo(() => {
    const raw = { ...mockSettings, ...dbSettings }
    const savedAnnouncement = raw?.announcementBar || {}
    
    let announcementText = savedAnnouncement.text || "Consult with our lead specialist at Sreya Hospitals. Book your appointment today!"
    let announcementLink = savedAnnouncement.link || "/appointment"

    if (announcementText.includes("Camp") || announcementText.includes("camp")) {
      announcementText = "Consult with our lead specialist at Sreya Hospitals. Book your appointment today!"
    }
    if (announcementLink === "/free-camp" || announcementLink === "free-camp") {
      announcementLink = "/appointment"
    }

    const hasLegacyAnnouncement =
      ['#E8CFCB', '#087f8c'].includes(savedAnnouncement.bgColor) ||
      savedAnnouncement.textColor === "#4A3A34"
    return {
      ...raw,
      logoUrl: normalizeLogoUrl(raw.logoUrl),
      announcementBar: {
        enabled: true,
        text: announcementText,
        link: announcementLink,
        bgColor: "#0D9488",
        textColor: "#FFFFFF",
        marquee: true,
        ...savedAnnouncement,
        text: announcementText,
        link: announcementLink,
        ...(hasLegacyAnnouncement ? { bgColor: "#0D9488", textColor: "#FFFFFF" } : {})
      }
    }
  }, [dbSettings])

  const activePayments = dbPayments || mockPayments
  const activeTheme = dbTheme || defaultTheme

  useEffect(() => {
    if (activeTheme) {
      applyThemeToDocument(activeTheme)
    }
  }, [activeTheme])

  const value = useMemo(
    () => ({
      settings: activeSettings,
      payments: activePayments,
      theme: normalizeTheme(activeTheme),
      loading: settingsLoading || paymentsLoading || themeLoading,
      error: null,
    }),
    [activeSettings, activePayments, activeTheme, settingsLoading, paymentsLoading, themeLoading]
  )

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) throw new Error('useSiteSettings must be used inside SiteSettingsProvider')
  return context
}
