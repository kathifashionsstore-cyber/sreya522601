import { MessageCircle, Phone } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function FloatingButtons() {
  const { settings } = useSiteSettings()
  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 lg:bottom-6">
      <a
        href={settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : '/contact'}
        className="grid size-12 place-items-center rounded-full bg-green-600 text-white shadow-lift"
        aria-label="WhatsApp Sreya Hospitals"
      >
        <MessageCircle className="size-6" />
      </a>
      <a
        href={settings.phone ? `tel:${settings.phone}` : '/contact'}
        className="grid size-12 place-items-center rounded-full bg-[var(--color-chatbot-bubble-bg)] text-white shadow-lift"
        aria-label="Call Sreya Hospitals"
      >
        <Phone className="size-6" />
      </a>
    </div>
  )
}
