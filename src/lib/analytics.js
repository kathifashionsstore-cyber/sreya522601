export function getDeviceType() {
  if (typeof window === 'undefined') return 'unknown'
  return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop'
}

export function getSessionId() {
  if (typeof window === 'undefined') return 'server'
  const key = 'srh_session_id'
  const existing = sessionStorage.getItem(key)
  if (existing) return existing
  const next = crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`
  sessionStorage.setItem(key, next)
  return next
}
