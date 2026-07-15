import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function AnnouncementBar() {
  const { settings } = useSiteSettings()
  const announcement = settings.announcementBar
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(sessionStorage.getItem('srh_announcement_dismissed') === '1')
  }, [])

  if (!announcement?.enabled || dismissed) return null

  const content = (
    <span className={announcement.marquee ? 'inline-block animate-[ticker_18s_linear_infinite] whitespace-nowrap' : ''}>
      {announcement.text}
    </span>
  )

  return (
    <div
      className="relative z-50 overflow-hidden px-4 py-2 text-center text-sm font-bold"
      style={{
        backgroundColor: announcement.bgColor || 'var(--color-announcement-bg)',
        color: announcement.textColor || 'var(--color-announcement-text)',
      }}
    >
      {announcement.link ? (
        <Link to={announcement.link} className="mx-auto block max-w-5xl">
          {content}
        </Link>
      ) : (
        <div className="mx-auto max-w-5xl">{content}</div>
      )}
      <button
        type="button"
        className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/15 hover:bg-white/25"
        onClick={() => {
          sessionStorage.setItem('srh_announcement_dismissed', '1')
          setDismissed(true)
        }}
        aria-label="Dismiss announcement"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
