import { useSearchParams } from 'react-router-dom'
import { AppointmentForm } from '../components/appointment/AppointmentForm'
import { HeroSection } from '../components/home/HeroSection'
import { Seo } from '../components/shared/Seo'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { placeholderImages } from '../data/seed'

export default function Appointment() {
  const { settings, payments } = useSiteSettings()
  const [params] = useSearchParams()
  const department = params.get('department') || ''
  return (
    <>
      <Seo title="Book Appointment" description="Book an appointment request with Sreya Hospitals & IVF Centre." />
      <HeroSection
        variant="page"
        badge={settings.pageBanners?.appointment?.badge || 'Appointment'}
        title={settings.pageBanners?.appointment?.title || 'Request an appointment'}
        subtitle={settings.pageBanners?.appointment?.subtitle || settings.tagline}
        image={settings.pageBanners?.appointment?.imageUrl || placeholderImages.consultation}
      />
      <section className="bg-brand-cream py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <AppointmentForm defaultDepartment={department} />
          <aside className="h-fit rounded-lg bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-brand-navy">Before you submit</h2>
            <div className="mt-4 grid gap-4 text-sm leading-6 text-slate-600">
              <p><strong>Phone:</strong> {settings.phone || 'Pending confirmation'}</p>
              <p><strong>WhatsApp:</strong> {settings.whatsapp || 'Pending confirmation'}</p>
              <p><strong>Address:</strong> {settings.address}</p>
              <p><strong>Hours:</strong> {settings.businessHours}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
