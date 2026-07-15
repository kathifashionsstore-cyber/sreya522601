import * as Sentry from '@sentry/node'

let initialized = false

export function initSentry() {
  if (initialized || !process.env.SENTRY_DSN) return
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
  })
  initialized = true
}

export function captureException(error, context = {}) {
  initSentry()
  if (!process.env.SENTRY_DSN) return
  Sentry.captureException(error, { extra: context })
}
