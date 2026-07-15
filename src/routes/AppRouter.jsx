import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Layout } from '../components/layout/Layout'
import { IVFLoader } from '../components/shared/IVFLoader'
import { usePageTracking } from '../hooks/usePageTracking'
import { ProtectedRoute, RoleGate } from './ProtectedRoute'
import { AdminLayout } from '../admin/AdminLayout'
import AdminLogin from '../admin/AdminLogin'
import AdminDashboard from '../admin/AdminDashboard'
import AdminAnalytics from '../admin/AdminAnalytics'
import AdminAnnouncementBar from '../admin/AdminAnnouncementBar'
import AdminHeroSlides from '../admin/AdminHeroSlides'
import AdminServices from '../admin/AdminServices'
import AdminDoctors from '../admin/AdminDoctors'
import AdminGallery from '../admin/AdminGallery'
import AdminBlog from '../admin/AdminBlog'
import AdminAppointments from '../admin/AdminAppointments'
import AdminContacts from '../admin/AdminContacts'
import AdminPaymentsQR from '../admin/AdminPaymentsQR'
import AdminTestimonials from '../admin/AdminTestimonials'
import AdminFacilities from '../admin/AdminFacilities'
import AdminSettings from '../admin/AdminSettings'
import AdminTheme from '../admin/AdminTheme'

const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const ServiceCategory = lazy(() => import('../pages/ServiceCategory'))
const ServiceOrSubgroupResolver = lazy(() => import('../pages/ServiceOrSubgroupResolver'))
const ServiceSubPage = lazy(() => import('../pages/ServiceSubPage'))
const Doctors = lazy(() => import('../pages/Doctors'))
const Gallery = lazy(() => import('../pages/Gallery'))
const Blog = lazy(() => import('../pages/Blog'))
const BlogDetail = lazy(() => import('../pages/BlogDetail'))
const Facilities = lazy(() => import('../pages/Facilities'))
const Contact = lazy(() => import('../pages/Contact'))
const Appointment = lazy(() => import('../pages/Appointment'))
const VerifyAppointment = lazy(() => import('../pages/VerifyAppointment'))
const LegalPage = lazy(() => import('../pages/LegalPage'))
const NotFound = lazy(() => import('../pages/NotFound'))

function PublicShell() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <Routes location={location}>
          <Route element={<PublicShell />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:category" element={<ServiceCategory />} />
            <Route path="services/:category/:slugOrSubgroup" element={<ServiceOrSubgroupResolver />} />
            <Route path="services/:category/:subgroup/:slug" element={<ServiceSubPage />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="free-camp" element={<Navigate to="/" replace />} />
            <Route path="success-stories" element={<Navigate to="/facilities" replace />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="contact" element={<Contact />} />
            <Route path="appointment" element={<Appointment />} />
            <Route path="verify-appointment" element={<VerifyAppointment />} />
            <Route path="privacy-policy" element={<LegalPage />} />
            <Route path="terms-of-use" element={<LegalPage />} />
            <Route path="medical-disclaimer" element={<LegalPage />} />
            <Route path="cookie-policy" element={<LegalPage />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<RoleGate><AdminAnalytics /></RoleGate>} />
              <Route path="announcement" element={<RoleGate><AdminAnnouncementBar /></RoleGate>} />
              <Route path="hero-slides" element={<RoleGate><AdminHeroSlides /></RoleGate>} />
              <Route path="services" element={<RoleGate><AdminServices /></RoleGate>} />
              <Route path="doctors" element={<RoleGate><AdminDoctors /></RoleGate>} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="payments" element={<RoleGate><AdminPaymentsQR /></RoleGate>} />
              <Route path="testimonials" element={<RoleGate><AdminTestimonials /></RoleGate>} />
              <Route path="facilities" element={<RoleGate><AdminFacilities /></RoleGate>} />
              <Route path="theme" element={<RoleGate><AdminTheme /></RoleGate>} />
              <Route path="settings" element={<RoleGate><AdminSettings /></RoleGate>} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export function AppRouter() {
  usePageTracking()
  return (
    <Suspense fallback={<IVFLoader />}>
      <AnimatedRoutes />
    </Suspense>
  )
}
