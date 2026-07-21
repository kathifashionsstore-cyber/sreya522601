import { AnnouncementBar } from './AnnouncementBar'
import { CookieBanner } from './CookieBanner'
import { FloatingButtons } from './FloatingButtons'
import { Footer } from './Footer'
import { MobileBottomNav, MobileTopBar } from './MobileBottomNav'
import { Navbar } from './Navbar'
import { ScrollProgress } from './ScrollProgress'
import { SplashAttribution } from './SplashAttribution'
import { StarCareChatbot } from '../chatbot/StarCareChatbot'
import { MaintenanceMode } from './MaintenanceMode'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { useAuth } from '../../context/AuthContext'

export function Layout({ children }) {
  const { settings } = useSiteSettings()
  const { role } = useAuth()

  const isEmployee = role === 'admin' || role === 'editor'

  if (settings.maintenanceMode && !isEmployee) {
    return <MaintenanceMode />
  }

  return (
    <>
      <ScrollProgress />
      <header className="sticky top-0 z-50 w-full">
        <AnnouncementBar />
        <MobileTopBar />
        <Navbar />
      </header>
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
      <StarCareChatbot />
      <CookieBanner />
      <MobileBottomNav />
      <SplashAttribution />
    </>
  )
}
