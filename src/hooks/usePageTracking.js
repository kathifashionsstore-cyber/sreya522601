import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    // Phase 1: Pure Frontend - log page views locally in development
    if (import.meta.env.DEV) {
      console.log(`[Analytics PageView]: ${location.pathname}${location.search}`)
    }
  }, [location.pathname, location.search])
}
