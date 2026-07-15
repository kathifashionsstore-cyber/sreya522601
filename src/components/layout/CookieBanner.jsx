import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(localStorage.getItem('srh_cookie_ack') !== '1')
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-4 shadow-lift lg:bottom-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-slate-700">
          This site uses cookies and local storage for analytics and preferences.
          {' '}
          <Link to="/privacy-policy" className="font-black text-brand-teal">Privacy Policy</Link>
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem('srh_cookie_ack', '1')
            setVisible(false)
          }}
          className="min-h-11 rounded-full bg-brand-teal px-5 py-2 text-sm font-black text-white"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
